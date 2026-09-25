// ============ IRONBLAZE · Estado, persistencia y analítica ============
(function () {
  const KEY = 'ironblaze.v1';
  const GIF = id => `https://static.exercisedb.dev/media/${id}.gif`;
  const HD_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
  const HD = id => { const h = window.HD_IMAGES && window.HD_IMAGES[id]; return h && h.length ? h.map(p => HD_BASE + p) : null; };

  const VERSION = '1.5.1';
  const DATA_VERSION = 2; // súbelo si cambia el formato de los datos y añade la migración abajo
  const SNAP_KEY = 'ironblaze.snapshots';

  const defaults = () => ({
    dataVersion: DATA_VERSION,
    settings: { name: 'Atleta', unit: 'kg', restDefault: 90, sound: true, vibrate: true, weekGoal: 4, keepAwake: true, bodyweight: '', notify: false, lastExport: 0, backupReminder: true },
    workouts: [],
    routines: [],
    custom: [],
    measures: [],
    active: null,
    createdAt: Date.now()
  });

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  let state;
  try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch (e) { state = defaults(); }
  state.settings = Object.assign(defaults().settings, state.settings);
  migrate(state);

  // Migraciones de datos entre versiones: nunca se pierde nada al actualizar la app
  function migrate(st) {
    const v = st.dataVersion || 1;
    if (v < 2) {
      // v2: superseries (campo ss) y copias automáticas. No requiere transformar datos, solo marcar versión.
      st.workouts.forEach(w => w.exercises.forEach(e => { if (e.ss === undefined) e.ss = null; }));
      st.routines.forEach(r => r.exercises.forEach(e => { if (e.ss === undefined) e.ss = null; }));
    }
    st.dataVersion = DATA_VERSION;
  }

  // ---------- Seguridad: limpieza de datos ----------
  // Todo lo que entra de fuera (copias importadas, la nube, datos antiguos) se normaliza a tipos
  // simples: números donde van números, textos con longitud máxima e identificadores sin símbolos.
  // Así ningún dato manipulado puede colar HTML o código en la interfaz.
  const S_TYPES = ['n', 'w', 'd', 'f'], KINDS = ['weight', 'bw', 'time', 'cardio'];
  const str = (x, max = 200) => (x == null ? '' : String(x)).slice(0, max);
  const num = x => (x === '' || x == null || !isFinite(+x)) ? '' : +x;
  const ident = x => str(x, 64).replace(/[^\w.-]/g, '');
  const arr = x => Array.isArray(x) ? x : [];
  function cleanSet(s, withTargets) {
    s = s || {};
    const o = { type: S_TYPES.includes(s.type) ? s.type : 'n', w: num(s.w), r: num(s.r) };
    if ('done' in s) o.done = !!s.done;
    if (withTargets) {
      if (s.tw !== undefined && num(s.tw) !== '') o.tw = num(s.tw);
      if (s.tr !== undefined && num(s.tr) !== '') o.tr = num(s.tr);
      if (Array.isArray(s.pr)) o.pr = s.pr.map(p => str(p, 30));
    }
    return o;
  }
  function cleanEx(e, withTargets) {
    e = e || {};
    return { exId: ident(e.exId), notes: str(e.notes, 2000), ss: e.ss ? ident(e.ss) : null, rest: num(e.rest) === '' ? null : Math.max(0, Math.min(3600, num(e.rest))), sets: arr(e.sets).slice(0, 100).map(s => cleanSet(s, withTargets)) };
  }
  function sanitizeWorkout(w, withTargets) {
    w = w || {};
    const start = isFinite(+w.start) ? +w.start : Date.now();
    const o = {
      id: ident(w.id) || uid(), title: str(w.title, 120), notes: str(w.notes, 5000), start, end: isFinite(+w.end) ? +w.end : start,
      routineId: w.routineId ? ident(w.routineId) : null, exercises: arr(w.exercises).slice(0, 60).map(e => cleanEx(e, withTargets)).filter(e => e.exId)
    };
    if (w.rest && isFinite(+w.rest.end)) o.rest = { end: +w.rest.end, total: +w.rest.total || 0 };
    return o;
  }
  function sanitizeRoutine(r) {
    r = r || {};
    return { id: ident(r.id) || uid(), name: str(r.name, 120), folder: str(r.folder, 60), exercises: arr(r.exercises).slice(0, 60).map(e => cleanEx(e)).filter(e => e.exId) };
  }
  function sanitizeCustom(c) {
    c = c || {};
    const id = ident(c.i);
    return { i: id.startsWith('c_') ? id : 'c_' + (id || uid()), n: str(c.n, 80), b: arr(c.b).slice(0, 5).map(x => str(x, 40)), q: arr(c.q).slice(0, 5).map(x => str(x, 40)),
      t: arr(c.t).slice(0, 5).map(x => str(x, 40)), s: arr(c.s).slice(0, 10).map(x => str(x, 40)), x: arr(c.x).slice(0, 30).map(x => str(x, 500)), custom: true, k: KINDS.includes(c.k) ? c.k : 'weight' };
  }
  function sanitizeAvatar(a) {
    if (!a || typeof a !== 'object') return null;
    if (a.type === 'img' && typeof a.data === 'string' && a.data.length < 400000 &&
      (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(a.data) || /^https:\/\/lh\d\.googleusercontent\.com\/[\w\-./=?&%]+$/.test(a.data))) return { type: 'img', data: a.data };
    if (a.type === 'preset' && typeof a.e === 'string' && a.e.length <= 8 && !/[<>"'&]/.test(a.e)) return { type: 'preset', e: a.e, c: Math.max(0, Math.min(20, parseInt(a.c) || 0)) };
    return null;
  }
  function sanitizeSettings(s) {
    const d = defaults().settings;
    s = Object.assign({}, d, s || {});
    return Object.assign(s, {
      name: str(s.name, 40) || d.name, unit: s.unit === 'lbs' ? 'lbs' : 'kg', restDefault: Math.max(0, Math.min(3600, +s.restDefault || 0)),
      weekGoal: Math.max(1, Math.min(7, parseInt(s.weekGoal) || 4)), bodyweight: num(s.bodyweight), avatar: sanitizeAvatar(s.avatar),
      lastExport: +s.lastExport || 0, sound: !!s.sound, vibrate: !!s.vibrate, keepAwake: !!s.keepAwake, notify: !!s.notify, backupReminder: !!s.backupReminder
    });
  }
  function sanitizeState(st) {
    st.workouts = arr(st.workouts).map(w => sanitizeWorkout(w));
    st.routines = arr(st.routines).map(sanitizeRoutine);
    st.custom = arr(st.custom).map(sanitizeCustom);
    st.measures = arr(st.measures).map(m => {
      const o = { id: ident(m && m.id) || uid(), date: isFinite(+(m && m.date)) ? +m.date : Date.now() };
      ['weight', 'fat', 'waist', 'chest', 'arm', 'thigh'].forEach(k => { if (m && num(m[k]) !== '') o[k] = num(m[k]); });
      return o;
    });
    st.active = st.active ? sanitizeWorkout(st.active, true) : null;
    st.settings = sanitizeSettings(st.settings);
    st.createdAt = isFinite(+st.createdAt) ? +st.createdAt : Date.now();
    return st;
  }
  sanitizeState(state);

  // Copias automáticas en el propio dispositivo (una al día, se guardan las 3 últimas)
  function autoSnapshot() {
    try {
      const snaps = JSON.parse(localStorage.getItem(SNAP_KEY) || '[]');
      const last = snaps[0];
      if (last && Date.now() - last.ts < 20 * 3600e3) return;
      if (!state.workouts.length && !state.routines.length) return;
      snaps.unshift({ ts: Date.now(), n: state.workouts.length, data: JSON.stringify(state) });
      while (snaps.length > 3) snaps.pop();
      try { localStorage.setItem(SNAP_KEY, JSON.stringify(snaps)); }
      catch (e) { snaps.length = 1; localStorage.setItem(SNAP_KEY, JSON.stringify(snaps)); }
    } catch (e) { }
  }
  function snapshots() { try { return JSON.parse(localStorage.getItem(SNAP_KEY) || '[]').map(s => ({ ts: s.ts, n: s.n })); } catch (e) { return []; } }
  function restoreSnapshot(ts) {
    const s = JSON.parse(localStorage.getItem(SNAP_KEY) || '[]').find(x => x.ts === ts);
    if (!s) return false;
    importData(JSON.parse(s.data)); return true;
  }
  function importData(obj) {
    state = Object.assign(defaults(), obj);
    state.settings = Object.assign(defaults().settings, state.settings);
    migrate(state); sanitizeState(state); indexExercises(); save(true);
  }
  // Pide al navegador que no borre los datos aunque falte espacio
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });

  let saveTimer = null;
  // Revisión de los datos: cada guardado invalida la caché de cálculos (récords, historial…)
  let rev = 0;
  const memo = new Map();
  function cached(key, fn) {
    const k = rev + '|' + key;
    if (memo.has(k)) return memo.get(k);
    if (memo.size > 3000) memo.clear();
    const v = fn(); memo.set(k, v); return v;
  }
  function save(now, fromCloud) {
    rev++; memo.clear();
    clearTimeout(saveTimer);
    const run = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('No se pudo guardar', e); } };
    if (now) run(); else saveTimer = setTimeout(run, 150);
    // Programa la subida a la nube (si hay cuenta). El entreno en curso no se sube hasta terminarlo.
    if (!fromCloud && window.Cloud) window.Cloud.schedule();
  }
  // Vacía los datos de entrenamiento (al entrar con otra cuenta en este dispositivo)
  function replaceWithEmpty() {
    const d = defaults();
    state.workouts = []; state.routines = []; state.custom = []; state.measures = []; state.active = null; state.createdAt = d.createdAt;
    indexExercises(); save(true, true);
  }
  window.addEventListener('beforeunload', () => save(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });

  // ---------- Ejercicios ----------
  const byId = new Map();
  // Aplica nombres/instrucciones en español (una sola vez) y pone mayúscula inicial
  const ES = window.ES_CONTENT || {};
  for (const e of window.EXERCISE_DB) {
    if (e.en) continue;
    e.en = e.n;
    const es = ES[e.i];
    if (es) { e.n = es.n; e.xen = e.x; e.x = es.x; e.es = true; }
    else e.n = e.n.charAt(0).toUpperCase() + e.n.slice(1);
  }
  function indexExercises() {
    byId.clear();
    for (const e of window.EXERCISE_DB) byId.set(e.i, e);
    for (const e of state.custom) byId.set(e.i, e);
  }
  indexExercises();

  function allExercises() { return [...state.custom, ...window.EXERCISE_DB]; }
  function getEx(id) { return byId.get(id) || { i: id, n: 'Ejercicio eliminado', b: ['other'], q: ['none'], t: [], s: [], x: [], custom: true }; }

  // Tipo de registro: peso+reps, peso corporal (reps + lastre opcional), cardio (distancia + tiempo), tiempo
  function kind(ex) {
    if (ex.k) return ex.k;
    const n = (ex.en || ex.n).toLowerCase();
    if (ex.b.includes('cardio') && /run|bike|walk|elliptical|skierg|stepmill|ergometer|cycling|rowing/.test(n)) return 'cardio';
    if (/plank|wall sit|isometric|l-sit|dead hang/.test(n)) return 'time';
    if (ex.q.includes('body weight') || ex.q.includes('assisted') || ex.q.includes('stability ball') || ex.q.includes('bosu ball')) return 'bw';
    return 'weight';
  }

  // ---------- Unidades ----------
  const LB = 2.20462;
  function toDisplay(kg) {
    if (kg === '' || kg == null || isNaN(kg)) return '';
    const v = state.settings.unit === 'lbs' ? kg * LB : +kg;
    return Math.round(v * 100) / 100;
  }
  function fromDisplay(v) {
    if (v === '' || v == null || isNaN(parseFloat(v))) return '';
    const n = parseFloat(v);
    return state.settings.unit === 'lbs' ? Math.round((n / LB) * 1000) / 1000 : n;
  }
  const unit = () => state.settings.unit === 'lbs' ? 'lbs' : 'kg';

  // ---------- Métricas ----------
  const e1rm = (w, r) => (!w || !r) ? 0 : r === 1 ? w : w * (1 + r / 30); // Fórmula de Epley
  const setVolume = s => (s.done && s.type !== 'w' && s.w && s.r) ? s.w * s.r : 0;

  // Peso corporal: el de ajustes o, si no, la última medición
  function bodyweight() {
    if (+state.settings.bodyweight > 0) return +state.settings.bodyweight;
    const m = state.measures.filter(x => +x.weight > 0).sort((a, b) => b.date - a.date)[0];
    return m ? +m.weight : 0;
  }

  function workoutStats(w) {
    let volume = 0, sets = 0, reps = 0;
    const bw = bodyweight();
    for (const ex of w.exercises) {
      const k = kind(getEx(ex.exId));
      for (const s of ex.sets) {
        if (!s.done) continue;
        sets++;
        if (k === 'weight') { volume += setVolume(s); reps += +s.r || 0; }
        else if (k === 'bw') { if (s.type !== 'w') volume += ((+s.w || 0) + bw) * (+s.r || 0); reps += +s.r || 0; }
      }
    }
    const duration = ((w.end || Date.now()) - w.start) / 1000;
    return { volume, sets, reps, duration };
  }

  // Historial de un ejercicio: lista de {workout, sets}, más reciente primero
  // Índice ejercicio → apariciones en entrenos. Se construye una vez por revisión de datos,
  // así las búsquedas de historial y récords no recorren todo el historial cada vez.
  function exIndex() {
    return cached('idx', () => {
      const m = new Map();
      for (const w of state.workouts) for (const ex of w.exercises) {
        let a = m.get(ex.exId); if (!a) m.set(ex.exId, a = []);
        a.push({ w, ex });
      }
      return m;
    });
  }
  function exerciseHistory(exId) {
    return cached('h|' + exId, () => {
      const out = [];
      for (const { w, ex } of exIndex().get(exId) || []) {
        if (ex.sets.some(s => s.done)) out.push({ workout: w, sets: ex.sets.filter(s => s.done) });
      }
      return out.sort((a, b) => b.workout.start - a.workout.start);
    });
  }

  // Series del último entreno (columna "Anterior")
  function previousSets(exId, beforeTs, excludeId) {
    const h = exerciseHistory(exId).filter(x => x.workout.id !== excludeId && (!beforeTs || x.workout.start < beforeTs));
    return h.length ? h[0].sets : [];
  }

  // Récords de un ejercicio (opcionalmente excluyendo un entreno y/o solo antes de una fecha)
  function records(exId, excludeWorkoutId, beforeTs) {
    return cached(`r|${exId}|${excludeWorkoutId || ''}|${beforeTs || ''}`, () => recordsRaw(exId, excludeWorkoutId, beforeTs));
  }
  function recordsRaw(exId, excludeWorkoutId, beforeTs) {
    const r = { weight: 0, e1rm: 0, volume: 0, reps: 0, sessionVolume: 0, bestSet: null };
    for (const { w, ex } of exIndex().get(exId) || []) {
      if (w.id === excludeWorkoutId) continue;
      if (beforeTs && w.start >= beforeTs) continue;
      {
        let sv = 0;
        for (const s of ex.sets) {
          if (!s.done || s.type === 'w') continue;
          const wt = +s.w || 0, rp = +s.r || 0;
          if (wt > r.weight) r.weight = wt;
          const one = e1rm(wt, rp);
          if (one > r.e1rm) { r.e1rm = one; r.bestSet = { w: wt, r: rp }; }
          if (wt * rp > r.volume) r.volume = wt * rp;
          if (rp > r.reps) r.reps = rp;
          sv += wt * rp;
        }
        if (sv > r.sessionVolume) r.sessionVolume = sv;
      }
    }
    return r;
  }

  // ¿Esta serie (del entreno en curso) bate algún récord previo?
  function setPR(exId, set, workoutId) {
    if (!set.done || set.type === 'w') return [];
    const k = kind(getEx(exId));
    if (!exerciseHistory(exId).some(h => h.workout.id !== workoutId)) return [];
    const prev = records(exId, workoutId);
    const wt = +set.w || 0, rp = +set.r || 0, out = [];
    if (k === 'weight' || (k === 'bw' && wt > 0)) {
      if (wt > prev.weight) out.push('Peso máx.');
      if (e1rm(wt, rp) > prev.e1rm + 0.01) out.push('1RM est.');
      if (wt * rp > prev.volume) out.push('Volumen serie');
    } else if ((k === 'bw' || k === 'time') && rp > prev.reps) out.push(k === 'time' ? 'Máx. tiempo' : 'Máx. reps');
    return out;
  }

  // Récords conseguidos en un entreno (comparado con entrenos anteriores)
  function workoutPRs(w) {
    // Solo se cachean entrenos ya guardados (el que está en curso cambia con cada serie)
    const saved = state.workouts.includes(w);
    return saved ? cached(`p|${w.id}|${w.start}`, () => workoutPRsRaw(w)) : workoutPRsRaw(w);
  }
  function workoutPRsRaw(w) {
    const prs = [];
    for (const ex of w.exercises) {
      const had = (exIndex().get(ex.exId) || []).some(({ w: o, ex: e }) => o.id !== w.id && o.start < w.start && e.sets.some(s => s.done));
      if (!had) continue;
      const prev = records(ex.exId, w.id, w.start);
      const k = kind(getEx(ex.exId));
      const best = { weight: 0, e1rm: 0, reps: 0 };
      for (const s of ex.sets) {
        if (!s.done || s.type === 'w') continue;
        best.weight = Math.max(best.weight, +s.w || 0);
        best.e1rm = Math.max(best.e1rm, e1rm(+s.w, +s.r));
        best.reps = Math.max(best.reps, +s.r || 0);
      }
      if (k === 'weight' || k === 'bw') {
        if (best.weight > prev.weight && best.weight > 0) prs.push({ exId: ex.exId, label: 'Peso máx.', value: best.weight, unit: 'w' });
        else if (best.e1rm > prev.e1rm + 0.01) prs.push({ exId: ex.exId, label: '1RM estimado', value: best.e1rm, unit: 'w' });
        if (k === 'bw' && best.reps > prev.reps) prs.push({ exId: ex.exId, label: 'Máx. reps', value: best.reps, unit: 'r' });
      }
    }
    return prs;
  }

  // Semanas consecutivas entrenando (racha)
  function weekKey(ts) {
    const d = new Date(ts); d.setHours(0, 0, 0, 0);
    const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day);
    return d.getTime();
  }
  function streakWeeks() {
    const weeks = new Set(state.workouts.map(w => weekKey(w.start)));
    let wk = weekKey(Date.now()), n = 0;
    if (!weeks.has(wk)) wk = weekKey(wk - 3 * 864e5); // la semana actual aún no rompe la racha
    while (weeks.has(wk)) { n++; wk = weekKey(wk - 3 * 864e5); }
    return n;
  }

  // ---------- Programas prediseñados ----------
  const S = (n, r) => Array.from({ length: n }, () => ({ type: 'n', w: '', r: r ?? '' }));
  const E = (exId, n = 3, r = 10, rest) => ({ exId, rest: rest ?? null, sets: S(n, r) });
  const PROGRAMS = [
    {
      name: 'Push · Pull · Legs', level: 'Intermedio', desc: 'El clásico de 3 días para hipertrofia. Repítelo 1-2 veces por semana.',
      routines: [
        { name: 'Push (Empuje)', exercises: [E('EIeI8Vf', 4, 8, 150), E('ns0SIbU', 3, 10), E('znQUdHY', 3, 10), E('DsgkuIt', 3, 15, 60), E('gAwDzB3', 3, 12, 60), E('2IxROQ1', 3, 12, 60)] },
        { name: 'Pull (Tirón)', exercises: [E('lBDjFxJ', 4, 8, 150), E('eZyBC3j', 4, 8, 120), E('fUBheHs', 3, 12), E('wqNPGCg', 3, 15, 60), E('25GPyDY', 3, 10, 60), E('slDvUAU', 3, 12, 60)] },
        { name: 'Legs (Pierna)', exercises: [E('qXTaZnJ', 4, 6, 180), E('wQ2c4XD', 3, 10, 120), E('10Z2DXU', 3, 12), E('Zg3XY7P', 3, 12, 60), E('my33uHU', 3, 15, 60), E('8ozhUIZ', 4, 15, 60)] }
      ]
    },
    {
      name: 'Upper / Lower', level: 'Intermedio', desc: '4 días: torso y pierna alternos, combinando fuerza y volumen.',
      routines: [
        { name: 'Torso A', exercises: [E('EIeI8Vf', 4, 6, 180), E('eZyBC3j', 4, 8, 120), E('kTbSH9h', 3, 10), E('RVwzP10', 3, 10), E('25GPyDY', 3, 12, 60), E('h8LFzo9', 3, 12, 60)] },
        { name: 'Pierna A', exercises: [E('qXTaZnJ', 4, 6, 180), E('wQ2c4XD', 3, 8, 120), E('RRWFUcw', 3, 10), E('17lJ1kr', 3, 12, 60), E('8ozhUIZ', 4, 12, 60), E('I3tsCnC', 3, 12, 60)] },
        { name: 'Torso B', exercises: [E('3TZduzM', 4, 8, 150), E('fUBheHs', 4, 10, 120), E('A6wtbuL', 3, 10), E('C0MA9bC', 3, 10), E('goJ6ezq', 3, 15, 60), E('slDvUAU', 3, 12, 60)] },
        { name: 'Pierna B', exercises: [E('ila4NZS', 3, 5, 180), E('zG0zs85', 3, 8, 150), E('qx4fgX7', 3, 10), E('my33uHU', 3, 15, 60), E('ykUOVze', 4, 15, 60), E('WW95auq', 3, 15, 60)] }
      ]
    },
    {
      name: 'Full Body Principiante', level: 'Principiante', desc: '3 días por semana, todo el cuerpo. Perfecto para empezar.',
      routines: [
        { name: 'Full Body A', exercises: [E('yn8yg1r', 3, 10), E('SpYC0Kp', 3, 10), E('RVwzP10', 3, 10), E('znQUdHY', 3, 10), E('VBAWRPG', 3, 30, 60)] },
        { name: 'Full Body B', exercises: [E('rR0LJzx', 3, 10), E('I4hDWkc', 3, 12), E('BJ0Hz5L', 3, 10), E('DsgkuIt', 3, 15, 60), E('TFqbd8t', 3, 20, 60)] }
      ]
    },
    {
      name: 'Fuerza 5×5', level: 'Todos', desc: 'Básicos pesados. Sube 2,5 kg cada sesión en la que completes las 5×5.',
      routines: [
        { name: '5×5 · Día A', exercises: [E('qXTaZnJ', 5, 5, 180), E('EIeI8Vf', 5, 5, 180), E('eZyBC3j', 5, 5, 180)] },
        { name: '5×5 · Día B', exercises: [E('qXTaZnJ', 5, 5, 180), E('kTbSH9h', 5, 5, 180), E('ila4NZS', 1, 5, 180)] }
      ]
    },
    {
      name: 'En casa con mancuernas', level: 'Principiante', desc: 'Solo necesitas un par de mancuernas y el suelo.',
      routines: [
        { name: 'Casa · Torso', exercises: [E('I4hDWkc', 4, 15), E('SpYC0Kp', 3, 12), E('C0MA9bC', 3, 12), E('A6wtbuL', 3, 12), E('NbVPDMW', 3, 12, 60), E('kont8Ut', 3, 12, 60)] },
        { name: 'Casa · Pierna y core', exercises: [E('yn8yg1r', 4, 12), E('rR0LJzx', 3, 12), E('RRWFUcw', 3, 10), E('dPmaUaU', 3, 20, 60), E('XVDdcoj', 3, 20, 45), E('RJgzwny', 3, 30, 45)] }
      ]
    },
    {
      name: 'HIIT Quemagrasa', level: 'Todos', desc: 'Circuito metabólico con descansos cortos. 25-30 minutos.',
      routines: [
        { name: 'HIIT Circuito', exercises: [E('dK9394r', 4, 12, 30), E('LIlE5Tn', 4, 15, 30), E('RJgzwny', 4, 30, 30), E('UHJlbu3', 4, 20, 30), E('I4hDWkc', 4, 15, 30), E('1ZFqTDN', 4, 20, 30)] }
      ]
    }
  ];

  window.Store = {
    get state() { return state; },
    save, uid, GIF, HD, getEx, allExercises, kind, indexExercises, bodyweight,
    toDisplay, fromDisplay, unit, e1rm, workoutStats, exerciseHistory, previousSets,
    records, setPR, workoutPRs, streakWeeks, weekKey, PROGRAMS, VERSION,
    autoSnapshot, snapshots, restoreSnapshot, importData, replaceWithEmpty, sanitizeWorkout, sanitizeState,
    cached,
    reset() { state = defaults(); indexExercises(); save(true); }
  };
})();
