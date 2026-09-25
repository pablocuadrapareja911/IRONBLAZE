// ============ IRONBLAZE · Estado, persistencia y analítica ============
(function () {
  const KEY = 'ironblaze.v1';
  const GIF = id => `https://static.exercisedb.dev/media/${id}.gif`;
  const HD_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
  const HD = id => { const h = window.HD_IMAGES && window.HD_IMAGES[id]; return h && h.length ? h.map(p => HD_BASE + p) : null; };

  const VERSION = '1.4.2';
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
    migrate(state); indexExercises(); save(true);
  }
  // Pide al navegador que no borre los datos aunque falte espacio
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });

  let saveTimer = null;
  function save(now, fromCloud) {
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

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

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
  function exerciseHistory(exId) {
    const out = [];
    for (const w of state.workouts) {
      for (const ex of w.exercises) {
        if (ex.exId === exId && ex.sets.some(s => s.done)) out.push({ workout: w, sets: ex.sets.filter(s => s.done) });
      }
    }
    return out.sort((a, b) => b.workout.start - a.workout.start);
  }

  // Series del último entreno (columna "Anterior")
  function previousSets(exId, beforeTs, excludeId) {
    const h = exerciseHistory(exId).filter(x => x.workout.id !== excludeId && (!beforeTs || x.workout.start < beforeTs));
    return h.length ? h[0].sets : [];
  }

  // Récords de un ejercicio (opcionalmente excluyendo un entreno y/o solo antes de una fecha)
  function records(exId, excludeWorkoutId, beforeTs) {
    const r = { weight: 0, e1rm: 0, volume: 0, reps: 0, sessionVolume: 0, bestSet: null };
    for (const w of state.workouts) {
      if (w.id === excludeWorkoutId) continue;
      if (beforeTs && w.start >= beforeTs) continue;
      for (const ex of w.exercises) {
        if (ex.exId !== exId) continue;
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
    const prs = [];
    for (const ex of w.exercises) {
      const had = state.workouts.some(o => o.id !== w.id && o.start < w.start && o.exercises.some(e => e.exId === ex.exId && e.sets.some(s => s.done)));
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
    autoSnapshot, snapshots, restoreSnapshot, importData, replaceWithEmpty,
    reset() { state = defaults(); indexExercises(); save(true); }
  };
})();
