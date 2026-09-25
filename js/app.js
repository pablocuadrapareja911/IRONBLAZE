// =====================================================================
//  IRONBLAZE · App principal
// =====================================================================
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const S = () => Store.state;
  const save = () => Store.save();
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  const pad = n => String(n).padStart(2, '0');
  const nf = (v, d = 1) => (Math.round((+v || 0) * 10 ** d) / 10 ** d).toLocaleString('es-ES');
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const DAY = 864e5;

  // ---------------- Iconos ----------------
  const P = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    chevDown: '<path d="m6 9 6 6 6-6"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/>',
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
    note: '<path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3"/>',
    save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>',
    repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    yt: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8z"/><path d="m10 15 5-3-5-3z" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h0M3 12h0M3 18h0"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    drag: '<path d="M9 5h0M15 5h0M9 12h0M15 12h0M9 19h0M15 19h0" stroke-width="3.2"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    scale: '<path d="M5 20h14l-2-12H7zM9 8a3 3 0 0 1 6 0"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.6 1 2.5h6c0-.9.2-1.7 1-2.5A6 6 0 0 0 12 3z"/>'
  };
  const ic = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24">${P[n]}</svg>`;

  // ---------------- Formatos ----------------
  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }
  function fmtDur(sec) {
    const h = Math.floor(sec / 3600), m = Math.round(sec % 3600 / 60);
    return h ? `${h}h ${m}min` : `${m}min`;
  }
  function fmtRest(sec) {
    if (!sec) return 'Desactivado';
    const m = Math.floor(sec / 60), s = sec % 60;
    return m ? `${m}min${s ? ' ' + s + 's' : ''}` : `${s}s`;
  }
  function fmtDate(ts, withTime) {
    const d = new Date(ts), today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - new Date(d).setHours(0, 0, 0, 0)) / DAY);
    let s = diff === 0 ? 'Hoy' : diff === 1 ? 'Ayer' : d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    if (withTime) s += ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return cap(s);
  }
  const fmtW = kg => `${nf(Store.toDisplay(kg))} ${Store.unit()}`;
  const fmtVol = kg => `${Math.round(Store.toDisplay(kg)).toLocaleString('es-ES')} ${Store.unit()}`;
  const shortDate = ts => { const d = new Date(ts); return `${d.getDate()}/${d.getMonth() + 1}`; };
  const isoLocal = ts => { const d = new Date(ts); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); };

  function setText(k, s) {
    const w = s.w !== '' && s.w != null ? +s.w : 0, r = +s.r || 0;
    if (k === 'cardio') return `${nf(w, 2)} km · ${nf(r)} min`;
    if (k === 'time') return (w ? `+${fmtW(w)} · ` : '') + `${r} s`;
    if (k === 'bw') return w ? `+${fmtW(w)} × ${r}` : `${r} reps`;
    return `${fmtW(w)} × ${r}`;
  }
  const typeLabel = { w: 'W', d: 'D', f: 'F' };
  const typeName = { n: 'Normal', w: 'Calentamiento', d: 'Drop set', f: 'Al fallo' };
  const typeColor = t => t === 'w' ? 'var(--yellow)' : t === 'd' ? 'var(--blue)' : t === 'f' ? 'var(--red)' : 'var(--muted)';

  function cols(k) {
    const u = Store.unit().toUpperCase();
    return { weight: [u, 'REPS'], bw: ['+' + u, 'REPS'], time: ['+' + u, 'SEG'], cardio: ['KM', 'MIN'] }[k];
  }
  const dispVal = (k, v) => v === '' || v == null ? '' : (k === 'cardio' ? v : Store.toDisplay(v));
  const parseVal = (k, v) => v === '' || isNaN(parseFloat(v)) ? '' : (k === 'cardio' ? parseFloat(v) : Store.fromDisplay(v));

  function thumb(ex, cls = '') {
    if (ex.custom) return `<div class="thumb custom ${cls}">${esc(ex.n.charAt(0).toUpperCase())}</div>`;
    return `<div class="thumb ${cls}"><img loading="lazy" src="${Store.GIF(ex.i)}" alt="" onerror="this.remove()"></div>`;
  }
  const exSub = ex => `${tr('bodyParts', ex.b[0])} · ${tr('equipment', ex.q[0])}`;

  // Superseries: letra y color por grupo, en orden de aparición
  const SS_COLORS = ['#4da3ff', '#2fd67b', '#c77dff', '#ffc233', '#ff5c8a'];
  function ssMap(arr) {
    const m = {}; let n = 0;
    arr.forEach(e => { if (e.ss && !m[e.ss]) { m[e.ss] = { letter: String.fromCharCode(65 + n), color: SS_COLORS[n % SS_COLORS.length] }; n++; } });
    return m;
  }
  function cleanupSS(arr) {
    const count = {};
    arr.forEach(e => { if (e.ss) count[e.ss] = (count[e.ss] || 0) + 1; });
    arr.forEach(e => { if (e.ss && count[e.ss] < 2) e.ss = null; });
  }
  const ssTag = info => info ? `<span class="ss-tag" style="--ss:${info.color}">${ic('link')} Superserie ${info.letter}</span>` : '';

  // ---------------- Feedback ----------------
  let toastT;
  function toast(msg, cls = '') {
    const t = $('#toast'); t.className = 'toast ' + cls; t.innerHTML = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
  }
  let actx;
  function beep(times = 3) {
    if (!S().settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime;
      for (let i = 0; i < times; i++) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = i === times - 1 ? 1175 : 880;
        g.gain.setValueAtTime(0.0001, t0 + i * .3);
        g.gain.exponentialRampToValueAtTime(0.35, t0 + i * .3 + .02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * .3 + .22);
        o.connect(g); g.connect(actx.destination); o.start(t0 + i * .3); o.stop(t0 + i * .3 + .25);
      }
    } catch (e) { }
  }
  const vibrate = p => { if (S().settings.vibrate && navigator.vibrate) navigator.vibrate(p); };
  function confetti() {
    const app = $('#app'), colors = ['#ff6a00', '#ff8a2a', '#ffffff', '#ffc233'];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('div'); c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%'; c.style.background = colors[i % 4];
      c.style.animationDuration = 1.6 + Math.random() * 1.8 + 's'; c.style.animationDelay = Math.random() * .4 + 's';
      app.appendChild(c); setTimeout(() => c.remove(), 4200);
    }
  }
  let wakeLock = null;
  async function keepAwake(on) {
    try {
      if (on && S().settings.keepAwake && 'wakeLock' in navigator && !wakeLock) wakeLock = await navigator.wakeLock.request('screen');
      else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
    } catch (e) { }
  }
  const swPost = msg => { try { navigator.serviceWorker && navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg); } catch (e) { } };
  const canNotify = () => S().settings.notify && 'Notification' in window && Notification.permission === 'granted';

  // =====================================================================
  //  Sistema de capas (pantallas, hojas, modales)
  // =====================================================================
  const stack = [];
  function openLayer(def) {
    const el = document.createElement('div'); el.className = 'layer';
    $('#layers').appendChild(el);
    const L = {
      el, def, data: def.data || {},
      render() {
        const sc = el.querySelector('.screen,.sheet'); const top = sc ? sc.scrollTop : 0;
        el.innerHTML = def.html(L);
        const sc2 = el.querySelector('.screen,.sheet'); if (sc2 && top) { sc2.style.animation = 'none'; sc2.scrollTop = top; }
        def.bind && def.bind(el, L);
      },
      close(silent) {
        const i = stack.indexOf(L); if (i < 0) return;
        stack.splice(i, 1); el.remove();
        def.onClose && def.onClose(L);
        if (!def.transient && !silent) refreshTop();
        updateChrome();
      }
    };
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-act]');
      if (t && el.contains(t) && def.actions && def.actions[t.dataset.act]) def.actions[t.dataset.act](t, e, L);
    });
    if (def.onInput) el.addEventListener('input', e => def.onInput(e, L));
    if (def.onChange) el.addEventListener('change', e => def.onChange(e, L));
    stack.push(L); L.render(); updateChrome();
    return L;
  }
  function refreshTop() {
    const top = [...stack].reverse().find(l => !l.def.transient);
    if (top) top.render(); else renderTab();
  }
  function closeAll() { while (stack.length) stack[stack.length - 1].close(true); renderTab(); updateChrome(); }

  function sheet({ title, options }) {
    return new Promise(res => {
      let done = false;
      const L = openLayer({
        transient: true,
        html: () => `<div class="backdrop" data-act="x"></div><div class="sheet"><div class="grab"></div>${title ? `<h3>${title}</h3>` : ''}
          ${options.map((o, i) => o ? `<button class="sheet-opt ${o.danger ? 'danger' : ''}" data-act="pick" data-i="${i}">${o.icon ? ic(o.icon) : ''}<span>${o.label}${o.sub ? `<span class="sub">${o.sub}</span>` : ''}</span>${o.on ? `<span style="margin-left:auto;color:var(--orange)">${ic('check')}</span>` : ''}</button>` : '').join('')}</div>`,
        actions: {
          x: () => { L.close(); },
          pick: t => { done = true; L.close(); res(options[+t.dataset.i].value); }
        },
        onClose: () => { if (!done) res(null); }
      });
    });
  }
  function modal({ title, text, buttons, html, noFocus }) {
    return new Promise(res => {
      let done = false;
      const L = openLayer({
        transient: true,
        html: () => `<div class="backdrop" data-act="x"></div><div class="modal"><h3>${title}</h3>${text ? `<p>${text}</p>` : ''}${html || ''}
          <div class="m-actions" style="${buttons.length > 2 ? 'flex-direction:column' : ''}">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-act="b" data-i="${i}">${b.label}</button>`).join('')}</div></div>`,
        actions: {
          x: () => L.close(),
          b: t => {
            const b = buttons[+t.dataset.i];
            const inputs = [...L.el.querySelectorAll('input,textarea,select')];
            const val = b.value === 'input' ? (inputs.length > 1 ? Object.fromEntries(inputs.map(i => [i.dataset.k || i.name, i.value])) : inputs[0] ? inputs[0].value : '') : b.value;
            done = true; L.close(); res(val);
          }
        },
        bind: el => { const i = el.querySelector('input'); if (i && !noFocus) setTimeout(() => { i.focus(); i.select && i.select(); }, 60); },
        onClose: () => { if (!done) res(null); }
      });
    });
  }
  const confirmM = (title, text, ok = 'Aceptar', danger = false) =>
    modal({ title, text, buttons: [{ label: 'Cancelar', value: false }, { label: ok, value: true, cls: danger ? 'danger' : 'primary' }] });
  const promptM = (title, value = '', placeholder = '', type = 'text') =>
    modal({ title, html: `<input class="input" type="${type}" ${type === 'number' ? 'inputmode="decimal" step="any"' : ''} value="${esc(value)}" placeholder="${esc(placeholder)}" style="margin-bottom:16px">`, buttons: [{ label: 'Cancelar', value: null }, { label: 'Guardar', value: 'input', cls: 'primary' }] });

  // Reordenar arrastrando (lista genérica)
  function openReorder(arr, onDone) {
    let order = arr.map((_, i) => i);
    openLayer({
      transient: true,
      html: () => `<div class="screen up"><div class="page">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="close">${ic('close')}</button><h1 style="font-size:18px">Reordenar ejercicios</h1><button class="btn primary sm" data-act="done">Hecho</button></div>
        <p class="muted" style="margin:0 0 12px;font-size:13px">Arrastra desde el asa ⠿ para cambiar el orden.</p>
        <div class="ro-list">${order.map(i => { const ex = Store.getEx(arr[i].exId); return `<div class="ro-item" data-i="${i}">${thumb(ex, 'sm')}<span class="ro-name">${esc(ex.n)}</span><span class="ro-handle" title="Arrastrar">${ic('drag')}</span></div>`; }).join('')}</div>
      </div></div>`,
      bind: el => {
        const list = el.querySelector('.ro-list'); let drag = null;
        list.addEventListener('pointerdown', e => {
          const h = e.target.closest('.ro-handle'); if (!h) return;
          drag = h.closest('.ro-item'); drag.classList.add('dragging');
          try { h.setPointerCapture(e.pointerId); } catch (err) { }
          e.preventDefault();
        });
        list.addEventListener('pointermove', e => {
          if (!drag) return;
          const items = [...list.querySelectorAll('.ro-item:not(.dragging)')];
          const after = items.find(it => { const r = it.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
          if (after) { if (drag.nextElementSibling !== after) list.insertBefore(drag, after); } else if (list.lastElementChild !== drag) list.appendChild(drag);
        });
        const end = () => { if (!drag) return; drag.classList.remove('dragging'); drag = null; order = [...list.querySelectorAll('.ro-item')].map(x => +x.dataset.i); vibrate(15); };
        list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end);
      },
      actions: { close: (t, e, L) => L.close(), done: (t, e, L) => { L.close(); onDone(order); } }
    });
  }
  const applyOrder = (arr, order) => { const copy = order.map(i => arr[i]); arr.splice(0, arr.length, ...copy); };

  // Menú de superserie compartido (entreno y rutinas)
  async function supersetMenu(arr, i) {
    const cur = arr[i];
    const others = arr.map((e, j) => ({ e, j })).filter(x => x.j !== i);
    if (!others.length) { toast('Añade otro ejercicio para crear una superserie'); return false; }
    const v = await sheet({
      title: 'Superserie con…', options: [
        ...others.map(x => ({ label: esc(Store.getEx(x.e.exId).n), value: x.j, on: cur.ss && x.e.ss === cur.ss })),
        cur.ss && { label: 'Quitar de la superserie', icon: 'close', value: 'rm', danger: true }]
    });
    if (v === null) return false;
    if (v === 'rm') { cur.ss = null; cleanupSS(arr); return true; }
    const target = arr[v];
    const g = cur.ss || target.ss || 'g' + Store.uid();
    // si me uno a un grupo ya existente me muevo yo; si no, el elegido se coloca detrás del grupo actual
    const mover = (!cur.ss && target.ss) ? cur : target;
    cur.ss = g; target.ss = g;
    arr.splice(arr.indexOf(mover), 1);
    let last = -1; arr.forEach((e, j) => { if (e.ss === g) last = j; });
    arr.splice(last + 1, 0, mover);
    cleanupSS(arr);
    return true;
  }

  // =====================================================================
  //  Navegación principal
  // =====================================================================
  let tab = 'home';
  let VA = {};
  const view = $('#view');
  view.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (t && VA[t.dataset.act]) VA[t.dataset.act](t, e); });
  $('#tabbar').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    if (tab === b.dataset.tab) { view.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    tab = b.dataset.tab; renderTab(true);
  });
  function renderTab(reset) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    const top = view.scrollTop;
    ({ home: renderHome, workout: renderWorkoutTab, exercises: renderExercisesTab, profile: renderProfile })[tab]();
    view.scrollTop = reset ? 0 : top;
    updateChrome();
  }

  function updateChrome() {
    const a = S().active, awOpen = stack.some(l => l.def.id === 'aw');
    const mini = $('#mini-workout');
    const show = a && !awOpen;
    mini.classList.toggle('hidden', !show);
    $('#app').classList.toggle('has-mini', !!show);
    if (show) mini.innerHTML = `<span class="pulse"></span><span>${esc(a.title)}</span><span class="mw-time" data-clock>${fmtClock((Date.now() - a.start) / 1000)}</span>`;
  }
  $('#mini-workout').addEventListener('click', () => openActive());

  // Reloj global
  setInterval(() => {
    const a = S().active; if (!a) return;
    const t = fmtClock((Date.now() - a.start) / 1000);
    document.querySelectorAll('[data-clock]').forEach(e => e.textContent = t);
  }, 1000);

  // =====================================================================
  //  ANALÍTICA: grupos musculares, avisos y resumen semanal
  // =====================================================================
  const GROUPS = [
    ['Pecho', ['chest']], ['Espalda', ['lats', 'upperback']], ['Hombros', ['delts', 'rdelts']],
    ['Brazos', ['biceps', 'triceps']], ['Piernas', ['quads', 'hamstrings', 'glutes']], ['Core', ['abs', 'obliques']]
  ];
  const groupSets = sc => GROUPS.map(([g, rs]) => [g, rs.reduce((a, r) => a + (sc[r] || 0), 0)]);
  const inRange = (from, to) => S().workouts.filter(w => w.start >= from && w.start < to);
  function weekTotals(ws) {
    return ws.reduce((a, w) => { const s = Store.workoutStats(w); a.n++; a.v += s.volume; a.s += s.sets; a.d += s.duration; return a; }, { n: 0, v: 0, s: 0, d: 0 });
  }
  function insights() {
    const ws = S().workouts, now = Date.now(), out = [];
    if (!ws.length) return out;
    // Racha en peligro
    const streak = Store.streakWeeks(), thisWk = Store.weekKey(now);
    const dow = (new Date().getDay() + 6) % 7;
    if (streak >= 2 && !ws.some(w => w.start >= thisWk) && dow >= 4) out.push({ icon: '🔥', text: `Tu racha de <b>${streak} semanas</b> está en peligro. ¡Entrena antes del domingo!`, cls: 'warn' });
    // Grupos descuidados
    if (inRange(now - 21 * DAY, now + 1).length >= 2) {
      const lastHit = {};
      ws.forEach(w => {
        const g = groupSets(BodyMap.scoresFromWorkouts([w], Store.getEx));
        g.forEach(([name, v]) => { if (v >= 1 && !(lastHit[name] > w.start)) lastHit[name] = w.start; });
      });
      const neglected = GROUPS.map(([g]) => [g, lastHit[g] ? Math.floor((now - lastHit[g]) / DAY) : null])
        .filter(([g, d]) => (d === null && ws.length >= 4) || d >= 10).slice(0, 2);
      neglected.forEach(([g, d]) => out.push({ icon: '⚠️', text: d === null ? `Aún no has entrenado <b>${g}</b>. ¡Equilibra tu rutina!` : `Llevas <b>${d} días</b> sin entrenar <b>${g}</b>.`, cls: 'warn' }));
    }
    // Récords de la semana
    const prs = inRange(thisWk, now + 1).reduce((a, w) => a + Store.workoutPRs(w).length, 0);
    if (prs) out.push({ icon: '🏆', text: `¡<b>${prs} récord${prs > 1 ? 's' : ''}</b> personal${prs > 1 ? 'es' : ''} esta semana! Sigue así.`, cls: 'good' });
    return out.slice(0, 3);
  }

  // Progresión: sugiere el siguiente objetivo a partir de la última sesión (doble progresión)
  function roundW(kg) {
    if (S().settings.unit === 'lbs') { const lb = Store.toDisplay(kg); return Store.fromDisplay(Math.round(lb / 2.5) * 2.5); }
    return Math.round(kg * 2) / 2;
  }
  function progressionTip(e, prev, k) {
    if (!(k === 'weight' || k === 'bw')) return null;
    const work = prev.filter(s => s.type === 'n' || s.type === 'f'); if (!work.length) return null;
    const topW = Math.max(...work.map(s => +s.w || 0));
    const atTop = work.filter(s => (+s.w || 0) === topW);
    const minR = Math.min(...atTop.map(s => +s.r || 0)); if (!minR) return null;
    const targets = e.sets.map(s => +s.tr || 0).filter(Boolean), target = targets.length ? Math.max(...targets) : 0;
    const q = Store.getEx(e.exId).q[0];
    const incKg = S().settings.unit === 'lbs' ? 5 / 2.20462 : /sled|leverage|cable/.test(q) ? 5 : 2.5;
    if (k === 'bw' && topW === 0) return { w: '', r: minR + 1, text: `Intenta ${minR + 1} reps por serie`, why: `La última vez: ${minR} reps` };
    const upper = target || 12;
    if (minR >= upper) {
      const nw = roundW(topW + incKg), nr = target || 8;
      return { w: nw, r: nr, up: true, text: `Sube a ${fmtW(nw)} × ${nr}`, why: `Completaste ${minR} reps con ${fmtW(topW)} 💪` };
    }
    return { w: topW, r: minR + 1, text: `${fmtW(topW)} × ${minR + 1}`, why: `Mismo peso, +1 rep (la última vez ${minR})` };
  }

  // =====================================================================
  //  INICIO
  // =====================================================================
  function weekDays() {
    const start = Store.weekKey(Date.now());
    return Array.from({ length: 7 }, (_, i) => start + i * DAY);
  }
  function workoutCard(w) {
    const st = Store.workoutStats(w), prs = Store.workoutPRs(w), name = S().settings.name;
    const exs = w.exercises.filter(e => e.sets.some(s => s.done));
    return `<div class="card tap wcard" data-act="openW" data-id="${w.id}">
      <div class="wc-head"><div class="avatar">${esc(name.charAt(0).toUpperCase())}</div>
        <div style="flex:1"><div class="wc-name">${esc(name)}</div><div class="wc-date">${fmtDate(w.start, true)}</div></div>
        ${prs.length ? `<span class="pr-pill">🏆 ${prs.length} PR</span>` : ''}</div>
      <h4>${esc(w.title)}</h4>
      <div class="wc-stats"><div>Duración<b>${fmtDur(st.duration)}</b></div><div>Volumen<b>${fmtVol(st.volume)}</b></div><div>Series<b>${st.sets}</b></div></div>
      <div class="wc-ex">${exs.slice(0, 3).map(e => {
      const ex = Store.getEx(e.exId), n = e.sets.filter(s => s.done).length;
      return `<div class="row">${thumb(ex, 'sm')}<span class="nm">${esc(ex.n)}</span><span class="sets">${n} ${n === 1 ? 'serie' : 'series'}</span></div>`;
    }).join('')}
      ${exs.length > 3 ? `<div class="wc-more">Ver ${exs.length - 3} ejercicio${exs.length - 3 > 1 ? 's' : ''} más</div>` : ''}</div></div>`;
  }
  function backupDue() {
    const s = S().settings;
    return s.backupReminder && S().workouts.length >= 3 && Date.now() - (s.lastExport || 0) > 7 * DAY;
  }

  let feedLimit = 15;
  function renderHome() {
    const st = S(), days = weekDays(), today = new Date().setHours(0, 0, 0, 0);
    const trained = new Set(st.workouts.map(w => new Date(w.start).setHours(0, 0, 0, 0)));
    const weekW = st.workouts.filter(w => w.start >= days[0]);
    const agg = weekTotals(weekW);
    const streak = Store.streakWeeks();
    const h = new Date().getHours();
    const hello = h < 6 ? 'Noche de hierro' : h < 13 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
    const tips = insights();
    view.innerHTML = `<div class="page">
      <div class="page-head"><h1 class="brand">IRON<b>BLAZE</b></h1>
        <div class="h-actions"><button class="icon-btn" data-act="prs" title="Récords">${ic('trophy')}</button><button class="icon-btn" data-act="settings" title="Ajustes">${ic('gear')}</button></div></div>
      <div class="hero">
        <div class="hero-top"><div><h3>${hello}, ${esc(st.settings.name)}</h3>
          <p>${streak ? `Racha de <b style="color:var(--orange)">${streak} semana${streak > 1 ? 's' : ''}</b> seguidas. ¡No la rompas!` : 'Hoy es un gran día para empezar tu racha.'}</p></div>
          <div class="flame">🔥</div></div>
        <div class="week-strip">${days.map((d, i) => `<div class="d ${trained.has(d) ? 'on' : ''} ${d === today ? 'today' : ''}">${'LMXJVSD'[i]}<i>${new Date(d).getDate()}</i></div>`).join('')}</div>
        <div class="mt" style="font-size:13px;color:var(--text-2)"><b style="color:var(--text)">${weekW.length}/${st.settings.weekGoal}</b> entrenos del objetivo semanal
          <div class="rt-bar" style="margin-top:6px"><i style="width:${Math.min(100, weekW.length / st.settings.weekGoal * 100)}%"></i></div></div>
      </div>
      <div class="stats-row">
        <div class="stat"><div class="v">${weekW.length}</div><div class="l">Entrenos semana</div></div>
        <div class="stat"><div class="v">${agg.v >= 1000 ? nf(Store.toDisplay(agg.v) / 1000) + '<small>t</small>' : Math.round(Store.toDisplay(agg.v)) + `<small>${Store.unit()}</small>`}</div><div class="l">Volumen</div></div>
        <div class="stat"><div class="v">${Math.round(agg.d / 60)}<small>min</small></div><div class="l">Tiempo</div></div>
      </div>
      ${st.active ? `<div class="card mt" style="border-color:var(--orange)"><div class="row-flex"><div style="flex:1"><b>Entrenamiento en curso</b><div class="muted" style="font-size:13px">${esc(st.active.title)} · <span data-clock>${fmtClock((Date.now() - st.active.start) / 1000)}</span></div></div><button class="btn primary sm" data-act="resume">Continuar</button></div></div>` :
        `<button class="btn primary block mt" style="height:54px;font-size:16px" data-act="quick">${ic('play')} Empezar entrenamiento</button>`}
      ${backupDue() ? `<div class="card mt insight backup"><div class="row-flex"><span class="ins-ic">💾</span><div style="flex:1"><b>Haz una copia de seguridad</b><div class="muted" style="font-size:13px">Tus entrenos solo viven en este móvil. Guarda una copia en Drive, correo o WhatsApp.</div></div></div>
        <div class="quick-grid mt-s"><button class="btn primary sm" data-act="backupNow">Guardar copia</button><button class="btn sm" data-act="backupLater">Ahora no</button></div></div>` : ''}
      ${tips.length ? `<div class="mt">${tips.map(t => `<div class="insight ${t.cls}"><span class="ins-ic">${t.icon}</span><span>${t.text}</span></div>`).join('')}</div>` : ''}
      <h2 class="section">Actividad ${st.workouts.length ? `<span class="link" data-act="goProfile">Estadísticas</span>` : ''}</h2>
      ${st.workouts.length ? st.workouts.slice(0, feedLimit).map(workoutCard).join('') +
        (st.workouts.length > feedLimit ? `<button class="btn outline block mt" data-act="moreFeed">Cargar más</button>` : '') :
        `<div class="card empty"><div class="big">🏋️</div><h4>Tu historial está vacío</h4><p>Empieza un entrenamiento o elige uno de nuestros programas listos para usar.</p>
          <div class="quick-grid"><button class="btn primary" data-act="quick">Empezar</button><button class="btn outline" data-act="programs">Programas</button></div>
          <p class="mt" style="margin:14px 0 0;font-size:13px">¿Solo quieres curiosear? <span class="link" data-act="demo">Carga datos de ejemplo</span></p></div>`}
    </div>`;
    VA = {
      openW: t => openWorkoutDetail(t.dataset.id),
      settings: openSettings, prs: openPRs,
      quick: () => startWorkout(null), resume: openActive,
      programs: openPrograms,
      goProfile: () => { tab = 'profile'; renderTab(true); },
      moreFeed: () => { feedLimit += 15; renderHome(); },
      backupNow: async () => { await exportBackup(); renderHome(); },
      backupLater: () => { S().settings.lastExport = Date.now() - 4 * DAY; save(); renderHome(); },
      demo: async () => { if (await confirmM('Datos de ejemplo', 'Se generarán ~10 semanas de entrenamientos ficticios (Push/Pull/Legs) para que veas la app en acción. Puedes borrarlos luego en Ajustes.', 'Generar')) { seedDemo(); renderTab(); toast('✅ Datos de ejemplo cargados'); } }
    };
  }

  // =====================================================================
  //  ENTRENAR (rutinas)
  // =====================================================================
  const closedFolders = new Set();
  function routineCard(r) {
    return `<div class="card routine-card">
      <div class="rc-head"><div class="rc-name">${esc(r.name)}</div><button class="icon-btn ghost" data-act="rMenu" data-id="${r.id}">${ic('more')}</button></div>
      <div class="rc-ex">${r.exercises.map(e => esc(Store.getEx(e.exId).n)).join(', ') || 'Sin ejercicios'}</div>
      <button class="btn primary block" data-act="rStart" data-id="${r.id}">Empezar rutina</button></div>`;
  }
  function renderWorkoutTab() {
    const st = S();
    const groups = {};
    st.routines.forEach(r => { const f = r.folder || ''; (groups[f] = groups[f] || []).push(r); });
    const folders = Object.keys(groups).sort((a, b) => a === '' ? 1 : b === '' ? -1 : a.localeCompare(b));
    view.innerHTML = `<div class="page">
      <div class="page-head"><h1>Entrenar</h1></div>
      <h2 class="section" style="margin-top:6px">Inicio rápido</h2>
      <button class="btn ${st.active ? '' : 'primary'} block" style="height:52px" data-act="${st.active ? 'resume' : 'empty'}">${st.active ? 'Continuar entrenamiento en curso' : ic('plus') + ' Empezar entrenamiento vacío'}</button>
      <h2 class="section">Rutinas</h2>
      <div class="quick-grid"><button class="btn" data-act="newR">${ic('note')} Nueva rutina</button><button class="btn" data-act="programs">${ic('search')} Explorar</button></div>
      ${st.routines.length ? folders.map(f => `
        <div class="folder-title ${closedFolders.has(f) ? 'closed' : ''}" data-act="fold" data-f="${esc(f)}">${ic('down')}${f ? esc(f) : 'Mis rutinas'} <span class="muted">(${groups[f].length})</span>
          ${f ? `<span style="margin-left:auto" data-act="folderMenu" data-f="${esc(f)}">${ic('more')}</span>` : ''}</div>
        ${closedFolders.has(f) ? '' : groups[f].map(routineCard).join('')}`).join('') :
        `<div class="card empty mt"><div class="big">📋</div><h4>Aún no tienes rutinas</h4><p>Crea la tuya o añade un programa probado (PPL, Upper/Lower, 5×5…).</p><button class="btn primary" data-act="programs">Ver programas</button></div>`}
    </div>`;
    VA = {
      empty: () => startWorkout(null), resume: openActive,
      newR: () => openRoutineEditor(null), programs: openPrograms,
      fold: (t, e) => { if (e.target.closest('[data-act="folderMenu"]')) return; const f = t.dataset.f; closedFolders.has(f) ? closedFolders.delete(f) : closedFolders.add(f); renderWorkoutTab(); },
      folderMenu: async t => {
        const f = t.dataset.f;
        const v = await sheet({ title: esc(f), options: [{ label: 'Renombrar carpeta', icon: 'edit', value: 'ren' }, { label: 'Eliminar carpeta (conservar rutinas)', icon: 'folder', value: 'unf' }, { label: 'Eliminar carpeta y rutinas', icon: 'trash', danger: true, value: 'del' }] });
        if (v === 'ren') { const n = await promptM('Renombrar carpeta', f); if (n && n.trim()) { S().routines.forEach(r => { if (r.folder === f) r.folder = n.trim(); }); save(); } }
        if (v === 'unf') { S().routines.forEach(r => { if (r.folder === f) r.folder = ''; }); save(); }
        if (v === 'del' && await confirmM('¿Eliminar carpeta?', `Se eliminarán todas las rutinas de "${esc(f)}".`, 'Eliminar', true)) { S().routines = S().routines.filter(r => r.folder !== f); save(); }
        renderWorkoutTab();
      },
      rStart: t => startWorkout(S().routines.find(r => r.id === t.dataset.id)),
      rMenu: t => routineMenu(t.dataset.id)
    };
  }
  async function routineMenu(id) {
    const r = S().routines.find(x => x.id === id); if (!r) return;
    const v = await sheet({
      title: esc(r.name), options: [
        { label: 'Editar rutina', icon: 'edit', value: 'edit' },
        { label: 'Duplicar', icon: 'copy', value: 'dup' },
        { label: 'Mover a carpeta', icon: 'folder', value: 'move' },
        { label: 'Eliminar rutina', icon: 'trash', value: 'del', danger: true }]
    });
    if (v === 'edit') openRoutineEditor(r);
    if (v === 'dup') { const c = JSON.parse(JSON.stringify(r)); c.id = Store.uid(); c.name += ' (copia)'; S().routines.push(c); save(); renderTab(); toast('Rutina duplicada'); }
    if (v === 'move') {
      const folders = [...new Set(S().routines.map(x => x.folder).filter(Boolean))];
      const f = await sheet({ title: 'Mover a…', options: [{ label: 'Sin carpeta', value: '\u0000' }, ...folders.map(x => ({ label: esc(x), value: x, on: r.folder === x })), { label: 'Nueva carpeta…', icon: 'plus', value: '\u0001' }] });
      if (f === null) return;
      if (f === '\u0001') { const n = await promptM('Nueva carpeta', '', 'Ej: Volumen invierno'); if (!n || !n.trim()) return; r.folder = n.trim(); }
      else r.folder = f === '\u0000' ? '' : f;
      save(); renderTab();
    }
    if (v === 'del' && await confirmM('¿Eliminar rutina?', `"${esc(r.name)}" se eliminará. Tu historial no se verá afectado.`, 'Eliminar', true)) {
      S().routines = S().routines.filter(x => x.id !== id); save(); renderTab();
    }
  }

  // ---------------- Programas ----------------
  function openPrograms() {
    openLayer({
      html: () => `<div class="screen"><div class="page">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1>Programas</h1></div>
        <p class="muted" style="margin:0 0 14px">Planes probados, listos para empezar. Añádelos a tus rutinas y personalízalos.</p>
        ${Store.PROGRAMS.map((p, i) => `<div class="card tap program-card" data-act="open" data-i="${i}">
          <div class="row-flex"><div style="flex:1"><div class="lvl">${p.level} · ${p.routines.length} día${p.routines.length > 1 ? 's' : ''}</div><h4>${p.name}</h4><p>${p.desc}</p></div>${ic('chevR')}</div></div>`).join('')}
      </div></div>`,
      actions: { back: (t, e, L) => L.close(), open: t => openProgram(Store.PROGRAMS[+t.dataset.i]) }
    });
  }
  function openProgram(p) {
    openLayer({
      html: () => `<div class="screen"><div class="page pb-fab">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1 style="font-size:19px">${p.name}</h1></div>
        <div class="lvl" style="color:var(--orange);font-weight:800;font-size:12px;letter-spacing:.6px">${p.level.toUpperCase()}</div>
        <p style="color:var(--text-2);line-height:1.5">${p.desc}</p>
        ${p.routines.map((r, i) => `<div class="card">
          <div class="row-flex"><b style="flex:1;font-size:16px">${r.name}</b><button class="btn sm outline" data-act="start" data-i="${i}">${ic('play')} Empezar</button></div>
          <div class="mt-s">${r.exercises.map(e => { const ex = Store.getEx(e.exId); return `<div class="list-item" data-act="ex" data-id="${ex.i}">${thumb(ex, 'sm')}<div class="li-main"><div class="li-title">${esc(ex.n)}</div><div class="li-sub">${e.sets.length} series × ${e.sets[0].r} ${Store.kind(ex) === 'time' ? 'seg' : 'reps'}</div></div></div>`; }).join('')}</div></div>`).join('')}
      </div><div class="fab-bottom"><button class="btn primary block" data-act="add">${ic('plus')} Guardar programa en mis rutinas</button></div></div>`,
      actions: {
        back: (t, e, L) => L.close(),
        ex: t => openExerciseDetail(t.dataset.id),
        start: t => { const r = JSON.parse(JSON.stringify(p.routines[+t.dataset.i])); startWorkout(r); },
        add: () => {
          p.routines.forEach(r => { const c = JSON.parse(JSON.stringify(r)); c.id = Store.uid(); c.folder = p.name; S().routines.push(c); });
          save(); toast(`✅ ${p.routines.length} rutinas añadidas`); closeAll(); tab = 'workout'; renderTab(true);
        }
      }
    });
  }

  // ---------------- Editor de rutinas ----------------
  function openRoutineEditor(routine) {
    const draft = routine ? JSON.parse(JSON.stringify(routine)) : { id: Store.uid(), name: '', folder: '', exercises: [] };
    const L = openLayer({
      html: () => {
        const ssm = ssMap(draft.exercises);
        return `<div class="screen up"><div class="page" style="padding-bottom:40px">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="cancel">${ic('close')}</button><h1 style="font-size:18px">${routine ? 'Editar rutina' : 'Nueva rutina'}</h1>
          <button class="btn primary sm" data-act="save">Guardar</button></div>
        <input class="title-input" data-f="name" placeholder="Nombre de la rutina" value="${esc(draft.name)}">
        <div class="mt">${draft.exercises.map((e, ei) => {
          const ex = Store.getEx(e.exId), k = Store.kind(ex), c = cols(k), ss = e.ss && ssm[e.ss];
          return `<div class="re-ex ${ss ? 'in-ss' : ''}" ${ss ? `style="--ss:${ss.color}"` : ''}>
            ${ssTag(ss)}
            <div class="re-head">${thumb(ex, 'sm')}<div class="nm" data-act="info" data-e="${ei}">${esc(ex.n)}</div><button class="icon-btn ghost" data-act="exMenu" data-e="${ei}">${ic('more')}</button></div>
            <button class="aw-rest" data-act="rest" data-e="${ei}">${ic('clock')} Descanso: ${fmtRest(e.rest ?? S().settings.restDefault)}</button>
            <div class="re-set head"><span>SERIE</span><span>${c[0]}</span><span>${c[1]}</span><span></span></div>
            ${e.sets.map((s, si) => `<div class="re-set"><button class="set-num ${s.type}" data-act="type" data-e="${ei}" data-s="${si}">${typeLabel[s.type] || e.sets.slice(0, si + 1).filter(x => x.type === 'n' || x.type === 'f').length}</button>
              <input class="set-in" inputmode="decimal" type="number" step="any" data-f="w" data-e="${ei}" data-s="${si}" value="${dispVal(k, s.w)}" placeholder="—">
              <input class="set-in" inputmode="numeric" type="number" step="any" data-f="r" data-e="${ei}" data-s="${si}" value="${s.r}" placeholder="—">
              <button class="icon-btn ghost" style="width:34px;height:34px;color:var(--muted)" data-act="delSet" data-e="${ei}" data-s="${si}">${ic('close')}</button></div>`).join('')}
            <button class="add-set" data-act="addSet" data-e="${ei}">+ Añadir serie</button></div>`;
        }).join('')}</div>
        ${draft.exercises.length ? '' : `<div class="empty"><div class="big">🏋️</div><h4>Empieza añadiendo un ejercicio</h4><p>Busca entre más de 1500 ejercicios con animación.</p></div>`}
        <button class="btn primary block mt" data-act="add">${ic('plus')} Añadir ejercicio</button>
        ${draft.exercises.length > 1 ? `<button class="btn block mt-s" data-act="reorder">${ic('swap')} Reordenar ejercicios</button>` : ''}
      </div></div>`;
      },
      onInput: e => {
        const t = e.target, f = t.dataset.f; if (!f) return;
        if (f === 'name') { draft.name = t.value; return; }
        const ex = draft.exercises[+t.dataset.e], k = Store.kind(Store.getEx(ex.exId)), s = ex.sets[+t.dataset.s];
        if (f === 'w') s.w = parseVal(k, t.value); else s.r = t.value === '' ? '' : parseFloat(t.value);
      },
      actions: {
        cancel: async (t, e, L) => { if (!draft.exercises.length || await confirmM('¿Descartar cambios?', 'Los cambios de esta rutina no se guardarán.', 'Descartar', true)) L.close(); },
        save: (t, e, L) => {
          if (!draft.name.trim()) { toast('Ponle un nombre a la rutina'); L.el.querySelector('.title-input').focus(); return; }
          if (!draft.exercises.length) { toast('Añade al menos un ejercicio'); return; }
          cleanupSS(draft.exercises);
          const i = S().routines.findIndex(r => r.id === draft.id);
          if (i >= 0) S().routines[i] = draft; else S().routines.push(draft);
          save(); toast('✅ Rutina guardada'); L.close();
        },
        add: (t, e, L) => openPicker({ multi: true, onPick: ids => { ids.forEach(id => draft.exercises.push({ exId: id, rest: null, ss: null, sets: [0, 1, 2].map(() => ({ type: 'n', w: '', r: '' })) })); L.render(); } }),
        reorder: (t, e, L) => openReorder(draft.exercises, order => { applyOrder(draft.exercises, order); L.render(); }),
        info: t => openExerciseDetail(draft.exercises[+t.dataset.e].exId),
        addSet: (t, e, L) => { const ex = draft.exercises[+t.dataset.e]; const last = ex.sets[ex.sets.length - 1]; ex.sets.push(last ? { ...last } : { type: 'n', w: '', r: '' }); L.render(); },
        delSet: (t, e, L) => { const ex = draft.exercises[+t.dataset.e]; ex.sets.splice(+t.dataset.s, 1); L.render(); },
        type: async (t, e, L) => { const s = draft.exercises[+t.dataset.e].sets[+t.dataset.s]; const v = await setTypeSheet(s.type, false); if (v) { s.type = v; L.render(); } },
        rest: async (t, e, L) => { const ex = draft.exercises[+t.dataset.e]; const v = await restSheet(ex.rest ?? S().settings.restDefault); if (v !== null) { ex.rest = v; L.render(); } },
        exMenu: async (t, e, L) => {
          const i = +t.dataset.e, arr = draft.exercises;
          const v = await sheet({ options: [{ label: 'Ver técnica', icon: 'info', value: 'info' }, { label: arr[i].ss ? 'Editar superserie' : 'Crear superserie', icon: 'link', value: 'ss' }, { label: 'Reemplazar ejercicio', icon: 'swap', value: 'rep' }, arr.length > 1 && { label: 'Reordenar ejercicios', icon: 'drag', value: 'order' }, { label: 'Quitar ejercicio', icon: 'trash', danger: true, value: 'del' }] });
          if (v === 'info') openExerciseDetail(arr[i].exId);
          if (v === 'ss') { if (await supersetMenu(arr, i)) L.render(); return; }
          if (v === 'rep') openPicker({ multi: false, onPick: ids => { arr[i].exId = ids[0]; L.render(); } });
          if (v === 'order') openReorder(arr, order => { applyOrder(arr, order); L.render(); });
          if (v === 'del') { arr.splice(i, 1); cleanupSS(arr); }
          L.render();
        }
      }
    });
    if (!routine) setTimeout(() => L.el.querySelector('.title-input')?.focus(), 250);
  }
  function setTypeSheet(cur, allowDelete = true) {
    return sheet({
      title: 'Tipo de serie', options: [
        { label: '<b style="display:inline-block;width:22px">1</b> Normal', value: 'n', on: cur === 'n' },
        { label: '<b style="display:inline-block;width:22px;color:var(--yellow)">W</b> Calentamiento', sub: 'No cuenta para volumen ni récords', value: 'w', on: cur === 'w' },
        { label: '<b style="display:inline-block;width:22px;color:var(--blue)">D</b> Drop set', value: 'd', on: cur === 'd' },
        { label: '<b style="display:inline-block;width:22px;color:var(--red)">F</b> Al fallo', value: 'f', on: cur === 'f' },
        allowDelete && { label: 'Eliminar serie', icon: 'trash', danger: true, value: 'del' }]
    });
  }
  function restSheet(cur) {
    const opts = [0, 30, 45, 60, 75, 90, 120, 150, 180, 240, 300];
    return sheet({ title: 'Temporizador de descanso', options: opts.map(s => ({ label: fmtRest(s), value: s, on: s === cur })) });
  }

  // =====================================================================
  //  SELECTOR / BIBLIOTECA DE EJERCICIOS
  // =====================================================================
  const BODY_PARTS = ['chest', 'back', 'shoulders', 'upper arms', 'lower arms', 'upper legs', 'lower legs', 'waist', 'cardio', 'neck'];
  const EQUIP = [...new Set(window.EXERCISE_DB.flatMap(e => e.q))].sort((a, b) => tr('equipment', a).localeCompare(tr('equipment', b)));
  const POPULAR = new Set(Store.PROGRAMS.flatMap(p => p.routines.flatMap(r => r.exercises.map(e => e.exId))));
  const ES_EN = [
    ['press de banca', 'bench press'], ['press banca', 'bench press'], ['banca', 'bench'], ['press militar', 'military press'], ['press frances', 'lying triceps extension'],
    ['peso muerto rumano', 'romanian deadlift'], ['peso muerto', 'deadlift'], ['sentadillas', 'squat'], ['sentadilla', 'squat'], ['dominadas', 'pull'], ['dominada', 'pull'],
    ['remo', 'row'], ['zancadas', 'lunge'], ['zancada', 'lunge'], ['fondos', 'dip'], ['flexiones', 'push-up'], ['flexion', 'push-up'],
    ['elevaciones laterales', 'lateral raise'], ['elevacion lateral', 'lateral raise'], ['elevaciones', 'raise'], ['elevacion', 'raise'],
    ['prensa de piernas', 'leg press'], ['prensa', 'leg press'], ['jalon', 'pulldown'], ['encogimientos', 'shrug'], ['encogimiento', 'shrug'],
    ['aperturas', 'fly'], ['apertura', 'fly'], ['cruces', 'crossover'], ['militar', 'military'], ['maquina', 'lever'], ['plancha', 'plank'],
    ['gemelos', 'calf'], ['gemelo', 'calf'], ['extensiones', 'extension'], ['extension', 'extension'], ['inclinado', 'incline'], ['declinado', 'decline'],
    ['martillo', 'hammer'], ['cuerda', 'rope'], ['comba', 'jump rope'], ['correr', 'run'], ['bicicleta', 'bike'], ['bici', 'bike'],
    ['hiperextension', 'hyperextension'], ['puente de gluteo', 'glute bridge'], ['puente', 'bridge'], ['empuje de cadera', 'hip thrust'], ['patada', 'kickback'],
    ['pajaro', 'rear delt'], ['buenos dias', 'good morning'], ['bulgara', 'split squat'], ['escalador', 'mountain climber'], ['saltos', 'jump'], ['salto', 'jump'],
    ['abdominales', 'crunch'], ['curl femoral', 'leg curl'], ['femoral', 'leg curl'], ['cuadriceps', 'leg extension'], ['hombro', 'shoulder'], ['pecho', 'chest'],
    ['mancuernas', 'dumbbell'], ['mancuerna', 'dumbbell'], ['barra', 'barbell'], ['polea', 'cable'], ['sentado', 'seated'], ['de pie', 'standing'], ['tumbado', 'lying'],
    ['agarre cerrado', 'close-grip'], ['agarre', 'grip'], ['una mano', 'one arm'], ['un brazo', 'one arm'], ['una pierna', 'one leg'], ['giro ruso', 'russian twist'], ['rueda', 'wheel']
  ];
  function translateQuery(q) {
    let s = norm(q);
    for (const [es, en] of ES_EN) if (s.includes(es)) s = s.replace(es, en);
    return s.split(/\s+/).filter(Boolean);
  }
  const hayCache = new Map();
  function hay(e) {
    let h = hayCache.get(e.i);
    if (!h) {
      h = norm([e.n, e.en || '', ...e.b, ...e.q, ...e.t, ...e.b.map(x => tr('bodyParts', x)), ...e.q.map(x => tr('equipment', x)), ...e.t.map(x => tr('muscles', x))].join(' '));
      hayCache.set(e.i, h);
    }
    return h;
  }
  function usageCounts() {
    const m = new Map();
    S().workouts.forEach(w => w.exercises.forEach(e => m.set(e.exId, (m.get(e.exId) || 0) + 1)));
    return m;
  }

  function exerciseBrowser(host, opts) {
    const f = opts.filter;
    const usage = usageCounts();
    f.view = f.view || 'grid';
    host.innerHTML = `
      <div class="ex-toolbar">
        <div class="search">${ic('search')}<input type="search" placeholder="Buscar ejercicio: press banca, sentadilla, bíceps…" value="${esc(f.q)}"></div>
        <div class="chips">${['all', ...BODY_PARTS].map(b => `<button class="chip ${f.bp === b ? 'on' : ''}" data-bp="${b}">${b === 'all' ? 'Todos' : tr('bodyParts', b)}</button>`).join('')}</div>
        <div class="filters">
          <select class="select" data-k="eq"><option value="all">Todo el material</option>${EQUIP.map(q => `<option value="${q}" ${f.eq === q ? 'selected' : ''}>${tr('equipment', q)}</option>`).join('')}</select>
          <select class="select" data-k="sort"><option value="rel" ${f.sort === 'rel' ? 'selected' : ''}>Relevancia</option><option value="az" ${f.sort === 'az' ? 'selected' : ''}>A → Z</option><option value="used" ${f.sort === 'used' ? 'selected' : ''}>Más usados</option></select>
          <button class="icon-btn view-toggle" data-view title="Cambiar vista">${ic(f.view === 'grid' ? 'list' : 'grid')}</button>
        </div>
        <div class="muted" style="font-size:12px;padding-top:8px" data-count></div>
      </div>
      <div class="ex-list lazy-list ${f.view === 'grid' ? 'ex-grid' : ''}"></div>`;
    const list = host.querySelector('.ex-list');
    let items = [], shown = 0;
    const io = new IntersectionObserver(en => { if (en.some(x => x.isIntersecting)) more(); }, { rootMargin: '600px' });

    function row(e) {
      const sel = opts.selected && opts.selected.has(e.i), n = usage.get(e.i);
      if (f.view === 'grid') {
        return `<div class="ex-card ${sel ? 'selected' : ''}" data-id="${e.i}">
          <div class="ex-card-media">${e.custom ? `<span class="ex-card-letter">${esc(e.n.charAt(0).toUpperCase())}</span>` : `<img loading="lazy" src="${Store.GIF(e.i)}" alt="${esc(e.n)}" onerror="this.remove()">`}
            ${Store.HD(e.i) ? '<span class="hd-badge">HD</span>' : ''}
            ${opts.selectable ? `<div class="check-dot">${sel ? ic('check') : ''}</div>` : ''}</div>
          <div class="ex-card-body"><div class="ex-card-name">${esc(e.n)}</div><div class="ex-card-sub">${exSub(e)}${n ? ` · <span style="color:var(--orange)">${n}×</span>` : ''}</div></div></div>`;
      }
      return `<div class="list-item ${sel ? 'selected' : ''}" data-id="${e.i}">${thumb(e)}<div class="li-main"><div class="li-title">${esc(e.n)}</div>
        <div class="li-sub">${exSub(e)}${n ? ` · <span style="color:var(--orange)">${n}×</span>` : ''}</div></div>
        ${opts.selectable ? `<div class="check-dot">${sel ? ic('check') : ''}</div>` : `<span class="chev">${ic('chevR')}</span>`}</div>`;
    }
    function more() {
      const slice = items.slice(shown, shown + (f.view === 'grid' ? 24 : 40)); if (!slice.length) return;
      host.querySelector('.sentinel')?.remove();
      list.insertAdjacentHTML('beforeend', slice.map(row).join('') + (shown + slice.length < items.length ? '<div class="sentinel" style="height:1px"></div>' : ''));
      shown += slice.length;
      const s = host.querySelector('.sentinel'); if (s) io.observe(s);
    }
    function apply() {
      const toks = translateQuery(f.q), raw = norm(f.q).trim();
      items = Store.allExercises().filter(e => {
        if (f.bp !== 'all' && !e.b.includes(f.bp)) return false;
        if (f.eq !== 'all' && !e.q.includes(f.eq)) return false;
        if (!toks.length) return true;
        const h = hay(e);
        if (raw && norm(e.n).includes(raw)) return true;
        return toks.every(t => h.includes(t) || (t.length > 3 && t.endsWith('s') && h.includes(t.slice(0, -1))));
      });
      const nameScore = e => {
        if (!toks.length) return 0;
        const n = norm(e.n), en = norm(e.en || '');
        if (raw && n.startsWith(raw)) return 3;
        if (raw && n.includes(raw)) return 2;
        return (en.startsWith(toks.join(' ')) || toks.every(t => n.includes(t) || en.includes(t))) ? 1 : 0;
      };
      items.sort((a, b) => {
        if (f.sort === 'az') return a.n.localeCompare(b.n);
        const ua = usage.get(a.i) || 0, ub = usage.get(b.i) || 0;
        if (f.sort === 'used' && ua !== ub) return ub - ua;
        if (ua !== ub) return ub - ua;
        if (!!a.custom !== !!b.custom) return a.custom ? -1 : 1;
        const pa = POPULAR.has(a.i), pb = POPULAR.has(b.i); if (pa !== pb) return pa ? -1 : 1;
        const sa = nameScore(a), sb = nameScore(b); if (sa !== sb) return sb - sa;
        if (!!a.es !== !!b.es) return a.es ? -1 : 1;
        const ha = !!Store.HD(a.i), hb = !!Store.HD(b.i); if (ha !== hb) return ha ? -1 : 1;
        return a.n.length - b.n.length || a.n.localeCompare(b.n);
      });
      list.innerHTML = ''; shown = 0; io.disconnect(); more();
      host.querySelector('[data-count]').textContent = `${items.length} ejercicio${items.length === 1 ? '' : 's'}`;
    }
    let deb;
    host.querySelector('input').addEventListener('input', e => { f.q = e.target.value; clearTimeout(deb); deb = setTimeout(apply, 120); });
    host.querySelector('.chips').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      f.bp = c.dataset.bp; host.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c)); apply();
    });
    host.querySelectorAll('select').forEach(s => s.addEventListener('change', () => { f[s.dataset.k] = s.value; apply(); }));
    host.querySelector('[data-view]').addEventListener('click', e => {
      f.view = f.view === 'grid' ? 'list' : 'grid';
      e.currentTarget.innerHTML = ic(f.view === 'grid' ? 'list' : 'grid');
      list.classList.toggle('ex-grid', f.view === 'grid'); apply();
    });
    list.addEventListener('click', e => {
      const r = e.target.closest('[data-id]'); if (!r) return;
      opts.onTap(r.dataset.id, r, () => { r.outerHTML = row(Store.getEx(r.dataset.id)); });
    });
    apply();
    return { apply, focus: () => host.querySelector('input').focus() };
  }

  const libFilter = { q: '', bp: 'all', eq: 'all', sort: 'rel', view: 'grid' };
  function renderExercisesTab() {
    view.innerHTML = `<div class="page"><div class="page-head"><h1>Ejercicios</h1><button class="btn sm outline" data-act="create">${ic('plus')} Crear</button></div><div id="lib"></div></div>`;
    exerciseBrowser($('#lib'), { filter: libFilter, onTap: id => openExerciseDetail(id) });
    VA = { create: () => openCreateExercise(null, () => renderTab()) };
  }

  function openPicker({ multi, onPick }) {
    const selected = new Set(), order = [];
    const filter = { q: '', bp: 'all', eq: 'all', sort: 'rel', view: 'grid' };
    const L = openLayer({
      transient: true,
      html: () => `<div class="screen up"><div class="page pb-fab">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="close">${ic('close')}</button><h1 style="font-size:19px">${multi ? 'Añadir ejercicios' : 'Reemplazar ejercicio'}</h1>
          <button class="btn sm outline" data-act="create">Crear</button></div><div class="browser"></div></div></div>
        <div class="fab-bottom hidden"><button class="btn primary block" data-act="confirm"></button></div>`,
      bind: (el, L) => {
        L.data.browser = exerciseBrowser(el.querySelector('.browser'), {
          filter, selectable: multi, selected,
          onTap: (id, rowEl, rerow) => {
            if (!multi) { L.close(); onPick([id]); return; }
            if (selected.has(id)) { selected.delete(id); order.splice(order.indexOf(id), 1); } else { selected.add(id); order.push(id); }
            rerow(); updateFab();
          }
        });
      },
      actions: {
        close: (t, e, L) => L.close(),
        confirm: (t, e, L) => { L.close(); onPick(order.slice()); },
        create: () => openCreateExercise(null, ex => { if (multi) { selected.add(ex.i); order.push(ex.i); L.data.browser.apply(); updateFab(); } else { L.close(); onPick([ex.i]); } })
      }
    });
    function updateFab() {
      const fab = L.el.querySelector('.fab-bottom');
      fab.classList.toggle('hidden', !selected.size);
      fab.querySelector('button').innerHTML = `Añadir ${selected.size} ejercicio${selected.size === 1 ? '' : 's'}`;
    }
  }

  // ---------------- Crear ejercicio personalizado ----------------
  function openCreateExercise(existing, onDone) {
    const d = existing ? JSON.parse(JSON.stringify(existing)) : { i: 'c_' + Store.uid(), n: '', b: ['chest'], q: ['barbell'], t: ['pectorals'], s: [], x: [], custom: true, k: 'weight' };
    const muscles = Object.keys(I18N.muscles).filter(m => window.EXERCISE_DB.some(e => e.t.includes(m)));
    openLayer({
      transient: true,
      html: () => `<div class="screen up"><div class="page">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="close">${ic('close')}</button><h1 style="font-size:18px">${existing ? 'Editar ejercicio' : 'Crear ejercicio'}</h1><button class="btn primary sm" data-act="save">Guardar</button></div>
        <div class="field"><label>Nombre</label><input class="input" data-f="n" value="${esc(d.n)}" placeholder="Ej: Press inclinado en máquina"></div>
        <div class="field"><label>Tipo de registro</label><div class="seg" data-seg>${[['weight', 'Peso y reps'], ['bw', 'Peso corporal'], ['time', 'Tiempo'], ['cardio', 'Cardio']].map(([v, l]) => `<button data-act="kind" data-v="${v}" class="${d.k === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <div class="field"><label>Grupo muscular</label><select class="select input" style="height:46px" data-f="b">${BODY_PARTS.map(b => `<option value="${b}" ${d.b[0] === b ? 'selected' : ''}>${tr('bodyParts', b)}</option>`).join('')}</select></div>
        <div class="field"><label>Músculo principal</label><select class="select input" style="height:46px" data-f="t">${muscles.map(m => `<option value="${m}" ${d.t[0] === m ? 'selected' : ''}>${tr('muscles', m)}</option>`).join('')}</select></div>
        <div class="field"><label>Equipamiento</label><select class="select input" style="height:46px" data-f="q">${EQUIP.map(q => `<option value="${q}" ${d.q[0] === q ? 'selected' : ''}>${tr('equipment', q)}</option>`).join('')}</select></div>
        <div class="field"><label>Instrucciones (opcional, una por línea)</label><textarea class="textarea" data-f="x" rows="4">${esc(d.x.join('\n'))}</textarea></div>
      </div></div>`,
      onInput: e => { const f = e.target.dataset.f; if (f === 'n') d.n = e.target.value; if (f === 'x') d.x = e.target.value.split('\n').filter(s => s.trim()); },
      onChange: e => { const f = e.target.dataset.f; if (f === 'b' || f === 't' || f === 'q') d[f] = [e.target.value]; },
      actions: {
        close: (t, e, L) => L.close(),
        kind: (t, e, L) => { d.k = t.dataset.v; L.el.querySelectorAll('[data-act="kind"]').forEach(b => b.classList.toggle('on', b === t)); },
        save: (t, e, L) => {
          if (!d.n.trim()) { toast('Escribe un nombre'); return; }
          d.n = cap(d.n.trim());
          const i = S().custom.findIndex(c => c.i === d.i);
          if (i >= 0) S().custom[i] = d; else S().custom.unshift(d);
          Store.indexExercises(); hayCache.delete(d.i); save();
          L.close(); toast('✅ Ejercicio guardado'); onDone && onDone(d);
        }
      }
    });
  }

  // =====================================================================
  //  DETALLE DE EJERCICIO
  // =====================================================================
  function openExerciseDetail(id) {
    const ex = Store.getEx(id), k = Store.kind(ex);
    const enName = ex.en || ex.n;
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent('how to ' + enName + ' proper form')}`;
    const ytEs = `https://www.youtube.com/results?search_query=${encodeURIComponent('cómo hacer ' + (ex.es ? ex.n : enName) + ' técnica')}`;
    const trUrl = `https://translate.google.com/?sl=en&tl=es&op=translate&text=${encodeURIComponent(ex.x.join('\n'))}`;
    openLayer({
      data: { tab: 'sum', metric: k === 'weight' || k === 'bw' ? 'e1rm' : 'r', media: 'hd' },
      html: L => {
        const hist = Store.exerciseHistory(id), rec = Store.records(id), t = L.data.tab;
        let body = '';
        const hd = Store.HD(ex.i), mode = hd ? L.data.media : 'gif';
        if (t === 'sum') body = `
          ${ex.custom ? `<div class="ex-media" style="background:var(--card)"><div style="font-size:80px;color:var(--orange);font-weight:800">${esc(ex.n.charAt(0).toUpperCase())}</div></div>` :
            mode === 'hd' ? `<div class="ex-media hd"><span class="loading">Cargando fotos HD…</span>
                <img class="f0" src="${hd[0]}" alt="${esc(ex.n)}" onload="this.parentNode.querySelector('.loading')?.remove()">${hd[1] ? `<img class="f1" src="${hd[1]}" alt="">` : ''}
                <span class="media-badge">HD · INICIO ⇄ FINAL</span></div>` :
            `<div class="ex-media gif"><span class="loading">Cargando animación…</span><img src="${Store.GIF(ex.i)}" alt="${esc(ex.n)}" onload="this.previousElementSibling.remove()" onerror="this.previousElementSibling.textContent='Sin conexión: no se pudo cargar la animación'"><span class="media-badge">▶ ANIMACIÓN</span></div>`}
          ${hd && !ex.custom ? `<div class="seg mt-s"><button class="${mode === 'hd' ? 'on' : ''}" data-act="media" data-v="hd">📷 Fotos HD</button><button class="${mode === 'gif' ? 'on' : ''}" data-act="media" data-v="gif">▶ Animación</button></div>` : ''}
          <div class="ex-title">${esc(ex.n)}</div>
          ${ex.es ? `<div class="muted" style="font-size:13px;margin:-4px 0 8px">${esc(cap(ex.en))}</div>` : ''}
          <div class="tags">${ex.b.map(b => `<span class="tag o">${tr('bodyParts', b)}</span>`).join('')}${ex.q.map(q => `<span class="tag">${tr('equipment', q)}</span>`).join('')}${ex.custom ? '<span class="tag">Personalizado</span>' : ''}</div>
          ${ex.custom ? '' : `<div class="quick-grid mt"><a class="btn yt-btn" href="${ytUrl}" target="_blank" rel="noopener">${ic('yt')} Vídeo (EN)</a><a class="btn yt-btn" style="background:#b30024" href="${ytEs}" target="_blank" rel="noopener">${ic('yt')} Vídeo (ES)</a></div>`}
          <h2 class="section">Músculos</h2>
          <div class="card bm-card">${BodyMap.svg(BodyMap.scoresFromExercise(ex), { max: 1 })}
            <div class="bm-legend"><span><i class="lg1"></i>Principal</span><span><i class="lg2"></i>Secundario</span></div></div>
          <div class="muscle-map mt-s">
            <div class="mm"><div class="l">Principal</div><div class="v">${ex.t.map(m => tr('muscles', m)).join(', ') || '—'}</div></div>
            <div class="mm"><div class="l">Secundarios</div><div class="v">${ex.s.map(m => tr('muscles', m)).join(', ') || '—'}</div></div>
          </div>
          ${ex.x.length ? `<h2 class="section">Cómo se hace ${!ex.custom && !ex.es ? `<a class="link" href="${trUrl}" target="_blank" rel="noopener" style="font-size:13px">${ic('globe', 'ico')} Traducir</a>` : ''}</h2><ol class="steps">${ex.x.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
          ${rec.e1rm || rec.reps ? `<h2 class="section">Tus mejores marcas</h2>${recGrid(k, rec)}` : ''}`;
        if (t === 'hist') body = hist.length ? hist.map(h => `<div class="hist-card"><div class="hc-t">${esc(h.workout.title)}</div><div class="hc-d">${fmtDate(h.workout.start, true)}</div>
            ${h.sets.map((s, i) => `<div class="hc-s"><b style="color:${typeColor(s.type)}">${typeLabel[s.type] || h.sets.slice(0, i + 1).filter(x => x.type !== 'w' && x.type !== 'd').length}</b><span style="flex:1">${setText(k, s)}</span>${k === 'weight' && s.type !== 'w' ? `<span class="muted" style="font-size:12px">1RM ${nf(Store.toDisplay(Store.e1rm(+s.w, +s.r)))}</span>` : ''}</div>`).join('')}</div>`).join('')
          : `<div class="empty"><div class="big">📉</div><h4>Sin historial todavía</h4><p>Cuando registres este ejercicio aparecerán aquí tus sesiones.</p></div>`;
        if (t === 'chart') {
          const metrics = k === 'cardio' ? [['w', 'Distancia'], ['r', 'Tiempo']] : k === 'time' ? [['r', 'Duración máx.']] : k === 'bw' ? [['r', 'Máx. reps'], ['tr', 'Reps totales'], ['w', 'Lastre máx.']] : [['e1rm', '1RM est.'], ['w', 'Peso máx.'], ['vol', 'Volumen'], ['r', 'Máx. reps']];
          body = `<div class="card chart-card"><div class="chart-head"><div class="ttl"><div class="sub">Progreso por sesión</div></div></div>
            <div class="mini-seg" style="margin-bottom:12px;flex-wrap:wrap">${metrics.map(([v, l]) => `<button data-act="metric" data-v="${v}" class="${L.data.metric === v ? 'on' : ''}">${l}</button>`).join('')}</div>
            <div class="chart-host" style="position:relative"></div></div>`;
        }
        if (t === 'rec') body = rec.e1rm || rec.reps ? recGrid(k, rec) + repRecords(id, k) : `<div class="empty"><div class="big">🏆</div><h4>Aún sin récords</h4><p>Completa series de este ejercicio para ver tus marcas personales.</p></div>`;
        return `<div class="screen"><div class="page">
          <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1 style="font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(ex.n)}</h1>
            ${ex.custom ? `<button class="icon-btn ghost" data-act="menu">${ic('more')}</button>` : ''}</div>
          <div class="tabs-inline">${[['sum', 'Resumen'], ['hist', 'Historial'], ['chart', 'Gráficas'], ['rec', 'Récords']].map(([v, l]) => `<button class="${t === v ? 'on' : ''}" data-act="tab" data-v="${v}">${l}</button>`).join('')}</div>
          ${body}</div></div>`;
      },
      bind: (el, L) => {
        if (L.data.tab !== 'chart') return;
        const hist = Store.exerciseHistory(id).slice().reverse(), m = L.data.metric;
        const data = hist.map(h => {
          const ss = h.sets.filter(s => s.type !== 'w');
          let v = 0;
          if (m === 'e1rm') v = Math.max(0, ...ss.map(s => Store.e1rm(+s.w, +s.r)));
          if (m === 'w') v = Math.max(0, ...ss.map(s => +s.w || 0));
          if (m === 'vol') v = ss.reduce((a, s) => a + (+s.w || 0) * (+s.r || 0), 0);
          if (m === 'r') v = Math.max(0, ...ss.map(s => +s.r || 0));
          if (m === 'tr') v = ss.reduce((a, s) => a + (+s.r || 0), 0);
          const isW = (m === 'e1rm' || m === 'w' || m === 'vol') && k !== 'cardio';
          return { label: shortDate(h.workout.start), full: fmtDate(h.workout.start), value: isW ? Store.toDisplay(v) : v, tip: isW ? `${nf(Store.toDisplay(v))} ${Store.unit()}` : `${nf(v)}` };
        });
        Charts.line(el.querySelector('.chart-host'), data);
      },
      actions: {
        back: (t, e, L) => L.close(),
        tab: (t, e, L) => { L.data.tab = t.dataset.v; L.render(); },
        media: (t, e, L) => { L.data.media = t.dataset.v; L.render(); },
        metric: (t, e, L) => { L.data.metric = t.dataset.v; L.render(); },
        menu: async (t, e, L) => {
          const v = await sheet({ options: [{ label: 'Editar ejercicio', icon: 'edit', value: 'edit' }, { label: 'Eliminar ejercicio', icon: 'trash', danger: true, value: 'del' }] });
          if (v === 'edit') openCreateExercise(ex, () => { L.close(); openExerciseDetail(id); });
          if (v === 'del') {
            const used = S().workouts.some(w => w.exercises.some(x => x.exId === id)) || S().routines.some(r => r.exercises.some(x => x.exId === id));
            if (used) { toast('Está en uso en entrenos o rutinas'); return; }
            if (await confirmM('¿Eliminar ejercicio?', 'Esta acción no se puede deshacer.', 'Eliminar', true)) { S().custom = S().custom.filter(c => c.i !== id); Store.indexExercises(); save(); L.close(); }
          }
        }
      }
    });
  }
  function recGrid(k, rec) {
    if (k === 'cardio' || k === 'time') return `<div class="rec-grid"><div class="rec"><div class="l">${k === 'time' ? 'Mayor duración' : 'Mayor tiempo'}</div><div class="v">${nf(rec.reps)} <small>${k === 'time' ? 's' : 'min'}</small></div></div><div class="rec"><div class="l">${k === 'cardio' ? 'Mayor distancia' : 'Lastre máx.'}</div><div class="v">${k === 'cardio' ? nf(rec.weight, 2) + ' <small>km</small>' : fmtW(rec.weight)}</div></div></div>`;
    return `<div class="rec-grid">
      <div class="rec"><div class="l">Peso máximo</div><div class="v">${nf(Store.toDisplay(rec.weight))} <small>${Store.unit()}</small></div></div>
      <div class="rec"><div class="l">1RM estimado</div><div class="v">${nf(Store.toDisplay(rec.e1rm))} <small>${Store.unit()}</small></div></div>
      <div class="rec"><div class="l">Mejor serie</div><div class="v" style="font-size:17px">${rec.bestSet ? setText(k, rec.bestSet) : '—'}</div></div>
      <div class="rec"><div class="l">Máx. repeticiones</div><div class="v">${rec.reps}</div></div>
      <div class="rec"><div class="l">Mejor volumen (serie)</div><div class="v" style="font-size:17px">${fmtVol(rec.volume)}</div></div>
      <div class="rec"><div class="l">Mejor volumen (sesión)</div><div class="v" style="font-size:17px">${fmtVol(rec.sessionVolume)}</div></div></div>`;
  }
  function repRecords(id, k) {
    if (k !== 'weight') return '';
    const best = {};
    Store.exerciseHistory(id).forEach(h => h.sets.forEach(s => { if (s.type === 'w') return; const r = +s.r; if (r >= 1 && r <= 15 && (+s.w || 0) > (best[r]?.w || 0)) best[r] = { w: +s.w, ts: h.workout.start }; }));
    const keys = Object.keys(best).map(Number).sort((a, b) => a - b);
    if (!keys.length) return '';
    return `<h2 class="section">Récords por repeticiones</h2><div class="card"><table class="pct-table">${keys.map(r => `<tr><td>${r} rep${r > 1 ? 's' : ''}</td><td class="muted">${shortDate(best[r].ts)}</td><td>${fmtW(best[r].w)}</td></tr>`).join('')}</table></div>`;
  }

  // =====================================================================
  //  EDITOR DE ENTRENO (en curso y edición de entrenos pasados)
  // =====================================================================
  function defaultTitle() {
    const h = new Date().getHours();
    return h < 12 ? 'Entreno de mañana' : h < 20 ? 'Entreno de tarde' : 'Entreno de noche';
  }
  async function startWorkout(routine) {
    if (S().active) {
      const v = await modal({ title: 'Ya tienes un entreno en curso', text: '¿Quieres continuar con él o descartarlo y empezar uno nuevo?', buttons: [{ label: 'Continuar el actual', value: 'resume', cls: 'primary' }, { label: 'Descartar y empezar nuevo', value: 'new', cls: 'danger' }, { label: 'Cancelar', value: null }] });
      if (v === 'resume') { openActive(); return; }
      if (v !== 'new') return;
      stopRest();
    }
    S().active = {
      id: Store.uid(), title: routine ? routine.name : defaultTitle(), start: Date.now(), routineId: routine && routine.id && S().routines.some(r => r.id === routine.id) ? routine.id : null, notes: '',
      exercises: routine ? routine.exercises.map(e => ({
        exId: e.exId, notes: '', rest: e.rest ?? null, ss: e.ss || null,
        sets: e.sets.map(s => ({ type: s.type || 'n', w: '', r: '', tw: s.w !== '' ? s.w : undefined, tr: s.r !== '' ? s.r : undefined, done: false }))
      })) : []
    };
    save();
    closeAll();
    openActive();
  }

  function openActive() {
    if (!S().active) return;
    if (stack.some(l => l.def.id === 'aw')) return;
    keepAwake(true);
    openLayer({ id: 'aw', data: { mode: 'active', w: S().active }, html: awHTML, actions: AW, onInput: awInput, onClose: () => keepAwake(false) });
  }
  function openEditWorkout(id) {
    const w = S().workouts.find(x => x.id === id); if (!w) return;
    const copy = JSON.parse(JSON.stringify(w));
    copy.exercises.forEach(e => { if (e.ss === undefined) e.ss = null; });
    openLayer({ id: 'we', data: { mode: 'edit', w: copy }, html: awHTML, actions: AW, onInput: awInput });
  }

  function placeholders(ex, si, prev) {
    const s = ex.sets[si], p = prev[si], last = si > 0 ? ex.sets[si - 1] : null;
    const pick = (...v) => { for (const x of v) if (x !== undefined && x !== null && x !== '') return x; return ''; };
    return { w: pick(s.tw, p && p.w, last && last.w, last && last.tw), r: pick(s.tr, p && p.r, last && last.r, last && last.tr) };
  }
  const isAct = L => L.data.mode === 'active';
  const prevFor = (L, exId) => isAct(L) ? Store.previousSets(exId) : Store.previousSets(exId, L.data.w.start, L.data.w.id);

  function awHTML(L) {
    const w = L.data.w, act = isAct(L); if (!w) return '';
    const st = Store.workoutStats(w), ssm = ssMap(w.exercises);
    const head = act ? `
        <button class="icon-btn ghost" data-act="minimize" title="Minimizar">${ic('chevDown')}</button>
        <div class="aw-title">Entrenando</div>
        <button class="icon-btn" data-act="timer" title="Temporizador">${ic('clock')}</button>
        <button class="btn primary sm" data-act="finish">Terminar</button>` : `
        <button class="icon-btn ghost" data-act="cancelEdit" title="Cancelar">${ic('close')}</button>
        <div class="aw-title">Editar entreno</div>
        <button class="btn primary sm" data-act="saveEdit">Guardar</button>`;
    const stats = act
      ? `<div class="aw-stats"><div class="t">Duración<b data-clock>${fmtClock((Date.now() - w.start) / 1000)}</b></div><div>Volumen<b id="aw-vol">${fmtVol(st.volume)}</b></div><div>Series<b id="aw-sets">${st.sets}</b></div></div>`
      : `<div class="aw-stats"><div>Volumen<b id="aw-vol">${fmtVol(st.volume)}</b></div><div>Series<b id="aw-sets">${st.sets}</b></div></div>
         <div class="edit-times"><div class="field"><label>Inicio</label><input class="input" type="datetime-local" data-field="start" value="${isoLocal(w.start)}"></div>
         <div class="field"><label>Duración (min)</label><input class="input" type="number" inputmode="numeric" data-field="dur" value="${Math.round((w.end - w.start) / 6e4)}"></div></div>`;
    return `<div class="screen up" style="padding-bottom:140px">
      <div class="aw-head">${head}</div>
      ${stats}
      <div style="padding:12px 16px 0"><input class="title-input" data-field="title" value="${esc(w.title)}" placeholder="Nombre del entreno"></div>
      ${w.exercises.length ? w.exercises.map((e, ei) => awExHTML(L, e, ei, ssm)).join('') :
        `<div class="empty-aw"><div class="big">💪</div><h4>Empieza añadiendo un ejercicio</h4><p>Toca el botón de abajo para elegir entre más de 1500 ejercicios.</p></div>`}
      <div class="aw-footer">
        <button class="btn primary block" data-act="addEx">${ic('plus')} Añadir ejercicio</button>
        <div class="row-flex">${w.exercises.length > 1 ? `<button class="btn block" data-act="reorder">${ic('swap')} Reordenar</button>` : ''}<button class="btn block" data-act="notes">${ic('note')} Notas</button></div>
        ${act ? `<button class="btn danger block" data-act="discard">Descartar entrenamiento</button>` : ''}
      </div></div>`;
  }
  function awExHTML(L, e, ei, ssm) {
    const act = isAct(L), w = L.data.w;
    const ex = Store.getEx(e.exId), k = Store.kind(ex), c = cols(k), prev = prevFor(L, e.exId);
    const rest = e.rest ?? S().settings.restDefault, ss = e.ss && ssm[e.ss];
    const tip = act && e.sets.some(s => !s.done) ? progressionTip(e, prev, k) : null;
    let n = 0;
    return `<div class="aw-ex ${ss ? 'in-ss' : ''}" ${ss ? `style="--ss:${ss.color}"` : ''}>
      ${ssTag(ss)}
      <div class="aw-ex-head"><span data-act="info" data-e="${ei}" style="cursor:pointer">${thumb(ex)}</span><div class="nm" data-act="info" data-e="${ei}">${esc(ex.n)}</div><button class="icon-btn ghost" data-act="exMenu" data-e="${ei}">${ic('more')}</button></div>
      <textarea class="aw-note" rows="1" data-field="note" data-e="${ei}" placeholder="Añadir notas aquí…">${esc(e.notes || '')}</textarea>
      ${act ? `<button class="aw-rest" data-act="restPick" data-e="${ei}">${ic('clock')} Descanso: ${fmtRest(rest)}${ss && w.exercises.slice(ei + 1).some(x => x.ss === e.ss) ? ' · <span class="muted">tras la superserie</span>' : ''}</button>` : ''}
      ${tip ? `<div class="tip-line ${tip.up ? 'up' : ''}">${ic('bulb')}<span><b>${tip.up ? '¡Hora de subir! ' : 'Objetivo: '}${tip.text}</b><small>${tip.why}</small></span><button class="btn sm" data-act="applyTip" data-e="${ei}">Aplicar</button></div>` : ''}
      <div class="set-table">
        <div class="set-row head"><span>SERIE</span><span>ANTERIOR</span><span>${c[0]}</span><span>${c[1]}</span><span>✓</span></div>
        ${e.sets.map((s, si) => {
      if (s.type === 'n' || s.type === 'f') n++;
      const ph = placeholders(e, si, prev), p = prev[si];
      return `<div class="set-row ${s.done ? 'done' : ''}" data-e="${ei}" data-s="${si}">
            <button class="set-num ${s.type}" data-act="setType">${s.type === 'n' ? n : typeLabel[s.type]}</button>
            <div class="set-prev" data-act="usePrev">${p ? setText(k, p) : '—'}</div>
            <input class="set-in" type="number" step="any" inputmode="decimal" data-field="w" value="${dispVal(k, s.w)}" placeholder="${ph.w === '' ? (k === 'weight' ? '0' : '—') : nf(dispVal(k, ph.w), 2)}">
            <input class="set-in" type="number" step="any" inputmode="${k === 'cardio' ? 'decimal' : 'numeric'}" data-field="r" value="${s.r}" placeholder="${ph.r === '' ? '0' : ph.r}">
            <button class="set-check" data-act="toggle">${ic('check', '')}</button>
            ${s.pr && s.pr.length ? '<span class="set-pr" title="Récord">🏆</span>' : ''}
          </div>`;
    }).join('')}
      </div>
      <button class="add-set" data-act="addSet" data-e="${ei}">+ Añadir serie</button></div>`;
  }

  function awInput(e, L) {
    const w = L.data.w; if (!w) return;
    const t = e.target, f = t.dataset.field; if (!f) return;
    const persist = () => { if (isAct(L)) save(); };
    if (f === 'title') { w.title = t.value; persist(); if (isAct(L)) updateChrome(); return; }
    if (f === 'start') { const v = new Date(t.value).getTime(); if (!isNaN(v)) { const dur = w.end - w.start; w.start = v; w.end = v + dur; } return; }
    if (f === 'dur') { const m = parseFloat(t.value); if (m > 0) w.end = w.start + m * 6e4; return; }
    if (f === 'note') { w.exercises[+t.dataset.e].notes = t.value; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; persist(); return; }
    const row = t.closest('.set-row'), ex = w.exercises[+row.dataset.e], s = ex.sets[+row.dataset.s];
    const k = Store.kind(Store.getEx(ex.exId));
    if (f === 'w') s.w = parseVal(k, t.value);
    if (f === 'r') s.r = t.value === '' ? '' : parseFloat(t.value);
    if (s.done) updateAwStats(L);
    persist();
  }
  function updateAwStats(L) {
    const st = Store.workoutStats(L.data.w);
    const v = L.el.querySelector('#aw-vol'), s = L.el.querySelector('#aw-sets');
    if (v) v.textContent = fmtVol(st.volume);
    if (s) s.textContent = st.sets;
  }
  const rowOf = (t, L) => { const r = t.closest('.set-row'); const ex = L.data.w.exercises[+r.dataset.e]; return { r, ex, s: ex.sets[+r.dataset.s], si: +r.dataset.s, ei: +r.dataset.e }; };
  const commit = L => { if (isAct(L)) save(); L.render(); };

  const AW = {
    minimize: (t, e, L) => L.close(),
    timer: async () => {
      const v = await sheet({ title: 'Temporizador rápido', options: [30, 60, 90, 120, 180, 300].map(s => ({ label: fmtRest(s), value: s, icon: 'clock' })) });
      if (v) startRest(v);
    },
    notes: async (t, e, L) => {
      const w = L.data.w;
      const v = await modal({ title: 'Notas del entreno', html: `<textarea class="textarea" rows="4" style="margin-bottom:16px" placeholder="¿Cómo te has sentido hoy?">${esc(w.notes || '')}</textarea>`, buttons: [{ label: 'Cancelar', value: null }, { label: 'Guardar', value: 'input', cls: 'primary' }] });
      if (v !== null) { w.notes = v; if (isAct(L)) save(); }
    },
    info: (t, e, L) => openExerciseDetail(L.data.w.exercises[+t.dataset.e].exId),
    addEx: (t, e, L) => openPicker({
      multi: true, onPick: ids => {
        ids.forEach(id => {
          const prev = prevFor(L, id).filter(s => s.type !== 'w');
          const n = Math.max(prev.length || 3, 1);
          L.data.w.exercises.push({ exId: id, notes: '', rest: null, ss: null, sets: Array.from({ length: n }, () => ({ type: 'n', w: '', r: '', done: false })) });
        });
        commit(L);
        setTimeout(() => { const sc = L.el.querySelector('.screen'); sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' }); }, 60);
      }
    }),
    reorder: (t, e, L) => openReorder(L.data.w.exercises, order => { applyOrder(L.data.w.exercises, order); commit(L); }),
    addSet: (t, e, L) => {
      const ex = L.data.w.exercises[+t.dataset.e];
      ex.sets.push({ type: 'n', w: '', r: '', done: false });
      commit(L);
    },
    setType: async (t, e, L) => {
      const { ex, s, si } = rowOf(t, L);
      const v = await setTypeSheet(s.type, true);
      if (!v) return;
      if (v === 'del') ex.sets.splice(si, 1); else s.type = v;
      commit(L);
    },
    usePrev: (t, e, L) => {
      const { ex, s, si } = rowOf(t, L);
      const p = prevFor(L, ex.exId)[si]; if (!p) return;
      s.w = p.w; s.r = p.r; commit(L);
    },
    applyTip: (t, e, L) => {
      const ex = L.data.w.exercises[+t.dataset.e], k = Store.kind(Store.getEx(ex.exId));
      const tip = progressionTip(ex, prevFor(L, ex.exId), k); if (!tip) return;
      ex.sets.forEach(s => { if (!s.done && (s.type === 'n' || s.type === 'f')) { if (tip.w !== '') s.tw = tip.w; s.tr = tip.r; if (s.w === '' || s.w == null) s.w = ''; } });
      commit(L); toast('💡 Objetivo aplicado: marca ✓ al completar cada serie');
    },
    toggle: (t, e, L) => {
      const { ex, s, si, ei } = rowOf(t, L);
      const k = Store.kind(Store.getEx(ex.exId));
      if (s.done) { s.done = false; s.pr = null; commit(L); return; }
      const ph = placeholders(ex, si, prevFor(L, ex.exId));
      if (s.w === '' && ph.w !== '') s.w = ph.w;
      if (s.r === '' && ph.r !== '') s.r = ph.r;
      if ((k === 'weight' || k === 'bw' || k === 'time') && !(+s.r > 0)) { toast(k === 'time' ? 'Introduce los segundos' : 'Introduce las repeticiones'); return; }
      if (k === 'cardio' && !(+s.r > 0) && !(+s.w > 0)) { toast('Introduce distancia o tiempo'); return; }
      if (s.w === '' && k === 'weight') s.w = 0;
      s.done = true;
      if (!isAct(L)) { commit(L); return; }
      s.pr = Store.setPR(ex.exId, s, L.data.w.id);
      if (s.pr.length) {
        const better = ex.sets.some(o => o !== s && o.done && o.type !== 'w' && Store.e1rm(+o.w, +o.r) > Store.e1rm(+s.w, +s.r) + 0.01);
        if (!better) { toast(`🏆 ¡Nuevo récord! ${s.pr.join(' · ')}`, 'pr'); vibrate([60, 40, 60]); } else s.pr = [];
      }
      commit(L);
      // Superserie: pasa al siguiente ejercicio del grupo sin descanso; descansa al cerrar la vuelta
      const arr = L.data.w.exercises;
      if (ex.ss) {
        const group = arr.filter(x => x.ss === ex.ss);
        const pos = group.indexOf(ex);
        if (pos < group.length - 1) {
          const next = group[pos + 1];
          if (next.sets.some(x => !x.done)) { toast(`➡️ Superserie: ahora ${esc(Store.getEx(next.exId).n)}`); return; }
        }
        const restG = group[group.length - 1].rest ?? S().settings.restDefault;
        if (restG > 0) startRest(restG);
        return;
      }
      const rest = ex.rest ?? S().settings.restDefault;
      if (rest > 0) startRest(rest);
    },
    restPick: async (t, e, L) => {
      const ex = L.data.w.exercises[+t.dataset.e];
      const v = await restSheet(ex.rest ?? S().settings.restDefault);
      if (v !== null) { ex.rest = v; commit(L); }
    },
    exMenu: async (t, e, L) => {
      const arr = L.data.w.exercises, i = +t.dataset.e;
      const v = await sheet({
        options: [{ label: 'Ver técnica y vídeo', icon: 'info', value: 'info' },
        { label: arr[i].ss ? 'Editar superserie' : 'Crear superserie', icon: 'link', value: 'ss', sub: 'Encadena ejercicios sin descanso entre ellos' },
        { label: 'Reemplazar ejercicio', icon: 'swap', value: 'rep' },
        arr.length > 1 && { label: 'Reordenar ejercicios', icon: 'drag', value: 'order' },
        { label: 'Eliminar ejercicio', icon: 'trash', danger: true, value: 'del' }]
      });
      if (v === 'info') openExerciseDetail(arr[i].exId);
      if (v === 'ss') { if (await supersetMenu(arr, i)) commit(L); return; }
      if (v === 'rep') openPicker({ multi: false, onPick: ids => { arr[i].exId = ids[0]; arr[i].sets.forEach(s => { s.tw = undefined; s.tr = undefined; s.pr = null; }); commit(L); } });
      if (v === 'order') openReorder(arr, order => { applyOrder(arr, order); commit(L); });
      if (v === 'del') {
        if (arr[i].sets.some(s => s.done) && !await confirmM('¿Eliminar ejercicio?', 'Tiene series completadas que se perderán.', 'Eliminar', true)) return;
        arr.splice(i, 1); cleanupSS(arr);
        commit(L);
      }
    },
    discard: async () => {
      if (await confirmM('¿Descartar entrenamiento?', 'Se perderá todo lo registrado en esta sesión.', 'Descartar', true)) {
        S().active = null; stopRest(); save(); closeAll(); toast('Entrenamiento descartado');
      }
    },
    finish: async () => {
      const a = S().active;
      const done = a.exercises.reduce((n, e) => n + e.sets.filter(s => s.done).length, 0);
      const pending = a.exercises.reduce((n, e) => n + e.sets.filter(s => !s.done).length, 0);
      if (!done) {
        const v = await modal({ title: 'No hay series completadas', text: 'Marca con ✓ al menos una serie para guardar el entrenamiento.', buttons: [{ label: 'Seguir entrenando', value: null, cls: 'primary' }, { label: 'Descartar entreno', value: 'd', cls: 'danger' }] });
        if (v === 'd') { S().active = null; stopRest(); save(); closeAll(); }
        return;
      }
      if (pending && !await confirmM('Series sin completar', `Tienes ${pending} serie${pending > 1 ? 's' : ''} sin marcar. Se descartarán al guardar.`, 'Terminar igualmente')) return;
      openFinish();
    },
    // --- Solo en modo edición ---
    cancelEdit: async (t, e, L) => { if (await confirmM('¿Descartar cambios?', 'Los cambios en este entreno no se guardarán.', 'Descartar', true)) L.close(); },
    saveEdit: (t, e, L) => {
      const w = L.data.w;
      const exercises = w.exercises.map(x => ({ exId: x.exId, notes: x.notes || '', ss: x.ss || null, sets: x.sets.filter(s => s.done).map(s => ({ type: s.type, w: s.w === '' ? 0 : s.w, r: s.r === '' ? 0 : s.r, done: true })) })).filter(x => x.sets.length);
      if (!exercises.length) { toast('El entreno necesita al menos una serie completada ✓'); return; }
      cleanupSS(exercises);
      const saved = { ...w, title: (w.title || '').trim() || defaultTitle(), exercises };
      const i = S().workouts.findIndex(x => x.id === w.id);
      if (i >= 0) S().workouts[i] = saved;
      S().workouts.sort((x, y) => y.start - x.start);
      Store.save(true); L.close(); toast('✅ Entreno actualizado');
    }
  };

  // ---------------- Temporizador de descanso ----------------
  const rest = { end: 0, total: 0, iv: null, doneT: null };
  function startRest(sec) {
    rest.total = sec; rest.end = Date.now() + sec * 1000;
    if (S().active) { S().active.rest = { end: rest.end, total: rest.total }; save(); }
    clearTimeout(rest.doneT); clearInterval(rest.iv);
    rest.iv = setInterval(tickRest, 250); tickRest();
    if (canNotify()) swPost({ type: 'rest', end: rest.end });
  }
  function stopRest() {
    clearInterval(rest.iv); clearTimeout(rest.doneT); rest.end = 0;
    if (S().active) S().active.rest = null;
    $('#rest-timer').classList.add('hidden');
    swPost({ type: 'rest-cancel' });
  }
  function tickRest() {
    const el = $('#rest-timer'), left = Math.ceil((rest.end - Date.now()) / 1000);
    if (left <= 0) {
      clearInterval(rest.iv);
      el.className = 'rest-timer finished';
      el.innerHTML = `<div class="rt-top"><div class="rt-time">0:00</div><div class="rt-label"><b style="color:var(--text);font-size:15px">¡Descanso terminado!</b><br>A por la siguiente serie 🔥</div><button class="btn sm primary" data-rt="skip">OK</button></div>`;
      beep(3); vibrate([300, 150, 300]);
      if (S().active) { S().active.rest = null; save(); }
      rest.doneT = setTimeout(() => el.classList.add('hidden'), 5000);
      return;
    }
    el.className = 'rest-timer';
    const pct = Math.max(0, Math.min(100, left / rest.total * 100));
    if (!el.querySelector('[data-rt="add"]')) {
      el.innerHTML = `<div class="rt-top"><div class="rt-time"></div><div class="rt-label">Descanso<br><span class="rt-total"></span></div>
        <button class="btn sm" data-rt="sub">−15</button><button class="btn sm" data-rt="add">+15</button><button class="btn sm primary" data-rt="skip">Saltar</button></div><div class="rt-bar"><i></i></div>`;
    }
    el.querySelector('.rt-time').textContent = fmtClock(left);
    el.querySelector('.rt-total').textContent = 'de ' + fmtClock(rest.total);
    el.querySelector('.rt-bar i').style.width = pct + '%';
  }
  $('#rest-timer').addEventListener('click', e => {
    const b = e.target.closest('[data-rt]'); if (!b) return;
    const a = b.dataset.rt;
    if (a === 'skip') { stopRest(); save(); return; }
    const d = a === 'add' ? 15 : -15;
    rest.end += d * 1000; rest.total = Math.max(1, rest.total + d);
    if (S().active) { S().active.rest = { end: rest.end, total: rest.total }; save(); }
    if (canNotify()) swPost({ type: 'rest', end: rest.end });
    tickRest();
  });

  // ---------------- Terminar / guardar ----------------
  function muscleSection(scores, title = 'Músculos trabajados') {
    const rank = BodyMap.ranking(scores);
    if (!rank.length) return '';
    return `<h2 class="section">${title}</h2><div class="card bm-card">${BodyMap.svg(scores)}
      <div class="tags mt-s" style="justify-content:center">${rank.slice(0, 6).map(([n, v]) => `<span class="tag">${n} · <b style="color:var(--text)">${nf(v)}</b></span>`).join('')}</div>
      <div class="muted center" style="font-size:11px;margin-top:6px">Series efectivas (secundarios cuentan ½)</div></div>`;
  }
  function openFinish() {
    const a = S().active;
    const draft = { title: a.title, notes: a.notes || '', updateRoutine: false };
    const routine = a.routineId && S().routines.find(r => r.id === a.routineId);
    openLayer({
      html: () => {
        const st = Store.workoutStats(a);
        const tmp = { ...a, exercises: a.exercises.map(e => ({ ...e, sets: e.sets.filter(s => s.done) })) };
        const prs = Store.workoutPRs(tmp);
        return `<div class="screen"><div class="page">
          <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1 style="font-size:18px">Guardar entrenamiento</h1><button class="btn primary sm" data-act="save">Guardar</button></div>
          <input class="title-input" data-f="title" value="${esc(draft.title)}" placeholder="Nombre del entreno">
          <div class="muted" style="font-size:13px">${fmtDate(a.start, true)}</div>
          <div class="stats-row"><div class="stat"><div class="v" style="font-size:17px">${fmtDur(st.duration)}</div><div class="l">Duración</div></div><div class="stat"><div class="v" style="font-size:17px">${fmtVol(st.volume)}</div><div class="l">Volumen</div></div><div class="stat"><div class="v" style="font-size:17px">${st.sets}</div><div class="l">Series</div></div></div>
          ${prs.length ? `<h2 class="section">🏆 Nuevos récords</h2><div class="card pr-list">${prs.map(p => `<div class="pr-row">${thumb(Store.getEx(p.exId), 'sm')}<div class="nm">${esc(Store.getEx(p.exId).n)}</div><div class="val">${p.unit === 'w' ? fmtW(p.value) : p.value + ' reps'}<small>${p.label}</small></div></div>`).join('')}</div>` : ''}
          ${muscleSection(BodyMap.scoresFromWorkouts([tmp], Store.getEx))}
          <div class="field mt"><label>Notas</label><textarea class="textarea" data-f="notes" placeholder="¿Cómo ha ido? Sensaciones, energía, molestias…">${esc(draft.notes)}</textarea></div>
          ${routine ? `<div class="setting-row"><div class="sr-main"><div class="sr-title">Actualizar rutina "${esc(routine.name)}"</div><div class="sr-sub">Guarda los pesos y reps de hoy como objetivo para la próxima vez</div></div><button class="toggle ${draft.updateRoutine ? 'on' : ''}" data-act="upd"></button></div>` : ''}
          <button class="btn primary block mt" style="height:52px" data-act="save">${ic('save')} Guardar entrenamiento</button>
        </div></div>`;
      },
      onInput: e => { const f = e.target.dataset.f; if (f) draft[f] = e.target.value; },
      actions: {
        back: (t, e, L) => L.close(),
        upd: (t, e, L) => { draft.updateRoutine = !draft.updateRoutine; t.classList.toggle('on', draft.updateRoutine); },
        save: () => {
          const w = {
            id: a.id, title: draft.title.trim() || defaultTitle(), notes: draft.notes.trim(), start: a.start, end: Date.now(), routineId: a.routineId,
            exercises: a.exercises.map(e => ({ exId: e.exId, notes: e.notes, ss: e.ss || null, sets: e.sets.filter(s => s.done).map(s => ({ type: s.type, w: s.w === '' ? 0 : s.w, r: s.r === '' ? 0 : s.r, done: true })) })).filter(e => e.sets.length)
          };
          cleanupSS(w.exercises);
          const prs = Store.workoutPRs(w);
          S().workouts.unshift(w);
          S().workouts.sort((x, y) => y.start - x.start);
          if (routine && draft.updateRoutine) {
            routine.exercises = a.exercises.filter(e => e.sets.some(s => s.done)).map(e => ({ exId: e.exId, rest: e.rest, ss: e.ss || null, sets: e.sets.filter(s => s.done).map(s => ({ type: s.type, w: s.w, r: s.r })) }));
            cleanupSS(routine.exercises);
          }
          S().active = null; stopRest(); Store.save(true); Store.autoSnapshot();
          closeAll(); tab = 'home'; renderTab(true);
          celebrate(w, prs);
        }
      }
    });
  }
  function celebrate(w, prs) {
    const n = S().workouts.length, st = Store.workoutStats(w);
    confetti(); beep(2);
    openLayer({
      transient: true,
      html: () => `<div class="backdrop"></div><div class="modal" style="padding:0;overflow:hidden">
        <div class="celebrate" style="background:radial-gradient(100% 100% at 50% 0%, rgba(255,106,0,.35), transparent 70%)"><div class="trophy">🏆</div>
        <h2>¡Brutal!</h2><p>Has completado tu entreno <b style="color:var(--orange)">#${n}</b></p></div>
        <div style="padding:16px 20px 20px">
          <div class="stats-row" style="margin-top:0"><div class="stat"><div class="v" style="font-size:16px">${fmtDur(st.duration)}</div><div class="l">Duración</div></div><div class="stat"><div class="v" style="font-size:16px">${fmtVol(st.volume)}</div><div class="l">Volumen</div></div><div class="stat"><div class="v" style="font-size:16px">${prs.length}</div><div class="l">Récords</div></div></div>
          <button class="btn primary block mt" data-act="ok">Hecho</button>
          <button class="btn outline block mt-s" data-act="view">Ver resumen</button></div></div>`,
      actions: { ok: (t, e, L) => { L.close(); renderTab(); }, view: (t, e, L) => { L.close(); openWorkoutDetail(w.id); } }
    });
  }

  // =====================================================================
  //  DETALLE DE ENTRENO (historial)
  // =====================================================================
  function openWorkoutDetail(id) {
    openLayer({
      html: () => {
        const w = S().workouts.find(x => x.id === id);
        if (!w) return `<div class="screen"><div class="page"><div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1>Entreno</h1></div><div class="empty">Entreno eliminado</div></div></div>`;
        const st = Store.workoutStats(w), prs = Store.workoutPRs(w);
        const prSet = new Set(prs.map(p => p.exId)), ssm = ssMap(w.exercises);
        return `<div class="screen"><div class="page">
          <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1 style="font-size:18px">Detalle</h1><button class="icon-btn ghost" data-act="menu">${ic('more')}</button></div>
          <div class="row-flex"><div class="avatar">${esc(S().settings.name.charAt(0).toUpperCase())}</div><div><b>${esc(S().settings.name)}</b><div class="muted" style="font-size:12px">${fmtDate(w.start, true)}</div></div></div>
          <h2 style="font-size:24px;margin:16px 0 12px">${esc(w.title)}</h2>
          <div class="wc-stats"><div>Duración<b>${fmtDur(st.duration)}</b></div><div>Volumen<b>${fmtVol(st.volume)}</b></div><div>Series<b>${st.sets}</b></div><div>Récords<b>${prs.length}</b></div></div>
          ${w.notes ? `<div class="card mt" style="color:var(--text-2);white-space:pre-wrap">${esc(w.notes)}</div>` : ''}
          <div class="quick-grid three mt"><button class="btn sm" data-act="edit">${ic('edit')} Editar</button><button class="btn sm" data-act="repeat">${ic('repeat')} Repetir</button><button class="btn sm" data-act="asRoutine">${ic('save')} Rutina</button></div>
          ${prs.length ? `<h2 class="section">🏆 Récords</h2><div class="card pr-list">${prs.map(p => `<div class="pr-row"><div class="nm">${esc(Store.getEx(p.exId).n)}</div><div class="val">${p.unit === 'w' ? fmtW(p.value) : p.value + ' reps'}<small>${p.label}</small></div></div>`).join('')}</div>` : ''}
          ${muscleSection(BodyMap.scoresFromWorkouts([w], Store.getEx))}
          <h2 class="section">Ejercicios</h2>
          ${w.exercises.map(e => {
          const ex = Store.getEx(e.exId), k = Store.kind(ex), ss = e.ss && ssm[e.ss]; let n = 0;
          return `<div class="card ${ss ? 'in-ss' : ''}" ${ss ? `style="--ss:${ss.color}"` : ''}>${ssTag(ss)}<div class="row-flex" data-act="ex" data-id="${ex.i}" style="cursor:pointer">${thumb(ex)}<div style="flex:1;min-width:0"><div style="font-weight:700;color:var(--orange)">${esc(ex.n)} ${prSet.has(e.exId) ? '🏆' : ''}</div><div class="muted" style="font-size:12px">${exSub(ex)}</div></div></div>
              ${e.notes ? `<div class="muted mt-s" style="font-size:13px;font-style:italic">${esc(e.notes)}</div>` : ''}
              <div class="mt-s">${e.sets.map(s => { if (s.type === 'n' || s.type === 'f') n++; return `<div class="hc-s" style="padding:6px 0;border-top:1px solid var(--line)"><b style="color:${typeColor(s.type)}">${s.type === 'n' ? n : typeLabel[s.type]}</b><span>${setText(k, s)}</span></div>`; }).join('')}</div></div>`;
        }).join('')}
        </div></div>`;
      },
      actions: {
        back: (t, e, L) => L.close(),
        ex: t => openExerciseDetail(t.dataset.id),
        edit: () => openEditWorkout(id),
        repeat: () => repeatWorkout(id),
        asRoutine: () => saveAsRoutine(id),
        menu: async (t, e, L) => {
          const v = await sheet({ options: [{ label: 'Editar entreno', icon: 'edit', value: 'edit', sub: 'Series, pesos, ejercicios, fecha y duración' }, { label: 'Repetir entrenamiento', icon: 'repeat', value: 'rep' }, { label: 'Guardar como rutina', icon: 'save', value: 'rt' }, { label: 'Eliminar entrenamiento', icon: 'trash', danger: true, value: 'del' }] });
          if (v === 'edit') openEditWorkout(id);
          if (v === 'rep') repeatWorkout(id);
          if (v === 'rt') saveAsRoutine(id);
          if (v === 'del' && await confirmM('¿Eliminar entrenamiento?', 'Se borrará de tu historial y estadísticas. No se puede deshacer.', 'Eliminar', true)) {
            S().workouts = S().workouts.filter(x => x.id !== id); save(); L.close(); toast('Entrenamiento eliminado');
          }
        }
      }
    });
  }
  function workoutToRoutine(w) {
    return { id: Store.uid(), name: w.title, folder: '', exercises: w.exercises.map(e => ({ exId: e.exId, rest: null, ss: e.ss || null, sets: e.sets.map(s => ({ type: s.type, w: s.w, r: s.r })) })) };
  }
  function repeatWorkout(id) { const w = S().workouts.find(x => x.id === id); if (w) { const r = workoutToRoutine(w); r.id = null; startWorkout(r); } }
  async function saveAsRoutine(id) {
    const w = S().workouts.find(x => x.id === id); if (!w) return;
    const n = await promptM('Nombre de la rutina', w.title); if (!n || !n.trim()) return;
    const r = workoutToRoutine(w); r.name = n.trim(); S().routines.push(r); save(); toast('✅ Rutina creada');
  }

  // =====================================================================
  //  PERFIL
  // =====================================================================
  let profMetric = 'duration', calOffset = 0, mapDays = 7;
  const delta = (a, b) => {
    if (!b) return a ? '<span class="dl up">nuevo</span>' : '<span class="dl">—</span>';
    const p = Math.round((a - b) / b * 100);
    return `<span class="dl ${p > 0 ? 'up' : p < 0 ? 'down' : ''}">${p > 0 ? '▲' : p < 0 ? '▼' : '='} ${Math.abs(p)}%</span>`;
  };
  function renderProfile() {
    const st = S(), ws = st.workouts, now = Date.now();
    const tot = ws.reduce((a, w) => { const s = Store.workoutStats(w); a.v += s.volume; a.d += s.duration; a.s += s.sets; return a; }, { v: 0, d: 0, s: 0 });
    // Semanas
    const thisWeek = Store.weekKey(now);
    const weeks = Array.from({ length: 12 }, (_, i) => thisWeek - (11 - i) * 7 * DAY);
    const wdata = weeks.map((wk, i) => {
      const inW = ws.filter(w => Store.weekKey(w.start) === Store.weekKey(wk + 3 * DAY));
      let v = 0;
      inW.forEach(w => { const s = Store.workoutStats(w); v += profMetric === 'duration' ? s.duration / 60 : profMetric === 'volume' ? Store.toDisplay(s.volume) : profMetric === 'reps' ? s.reps : 1; });
      const tip = profMetric === 'duration' ? fmtDur(v * 60) : profMetric === 'volume' ? `${Math.round(v).toLocaleString('es-ES')} ${Store.unit()}` : profMetric === 'reps' ? `${v} reps` : `${v} entreno${v === 1 ? '' : 's'}`;
      return { label: shortDate(wk), full: 'Semana del ' + shortDate(wk), value: v, tip, hi: i === 11 };
    });
    // Resumen semanal (esta semana vs. la anterior completa)
    const thisW = inRange(thisWeek, now + 1), lastW = inRange(thisWeek - 7 * DAY, thisWeek);
    const tA = weekTotals(thisW), tB = weekTotals(lastW);
    const gA = groupSets(BodyMap.scoresFromWorkouts(thisW, Store.getEx)), gB = groupSets(BodyMap.scoresFromWorkouts(lastW, Store.getEx));
    // Mapa muscular del periodo
    const mapScores = BodyMap.scoresFromWorkouts(inRange(now - mapDays * DAY, now + 1), Store.getEx);
    // Calendario
    const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOffset); base.setHours(0, 0, 0, 0);
    const first = (base.getDay() + 6) % 7, daysIn = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const dayMap = {}; ws.forEach(w => { const k = new Date(w.start).setHours(0, 0, 0, 0); (dayMap[k] = dayMap[k] || []).push(w.id); });
    const today = new Date().setHours(0, 0, 0, 0);
    const monthCount = ws.filter(w => { const d = new Date(w.start); return d.getMonth() === base.getMonth() && d.getFullYear() === base.getFullYear(); }).length;
    const bw = Store.bodyweight();

    view.innerHTML = `<div class="page">
      <div class="page-head"><h1>Perfil</h1><div class="h-actions"><button class="icon-btn" data-act="settings">${ic('gear')}</button></div></div>
      <div class="row-flex"><div class="avatar lg">${esc(st.settings.name.charAt(0).toUpperCase())}</div>
        <div style="flex:1"><div style="font-size:21px;font-weight:800;cursor:pointer" data-act="rename">${esc(st.settings.name)} <span class="muted" style="font-size:13px">${ic('edit')}</span></div>
          <div class="muted" style="font-size:13px">Miembro desde ${new Date(st.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</div>
          <div class="bw-chip" data-act="bw">${ic('scale')} ${bw ? fmtW(bw) : 'Añade tu peso corporal'}</div></div></div>
      <div class="stats-row">
        <div class="stat"><div class="v">${ws.length}</div><div class="l">Entrenos</div></div>
        <div class="stat"><div class="v">${Store.streakWeeks()}<small>sem</small></div><div class="l">Racha 🔥</div></div>
        <div class="stat"><div class="v">${Math.round(tot.d / 3600)}<small>h</small></div><div class="l">Entrenadas</div></div>
      </div>

      <h2 class="section">Resumen semanal</h2>
      <div class="card">
        <div class="muted" style="font-size:12px;margin-bottom:8px">Esta semana vs. la semana pasada completa</div>
        <div class="wk-grid">
          <div><span class="l">Entrenos</span><b>${tA.n}</b><small>${tB.n} la pasada</small>${delta(tA.n, tB.n)}</div>
          <div><span class="l">Volumen</span><b>${fmtVol(tA.v)}</b><small>${fmtVol(tB.v)}</small>${delta(tA.v, tB.v)}</div>
          <div><span class="l">Series</span><b>${tA.s}</b><small>${tB.s} la pasada</small>${delta(tA.s, tB.s)}</div>
          <div><span class="l">Tiempo</span><b>${fmtDur(tA.d)}</b><small>${fmtDur(tB.d)}</small>${delta(tA.d, tB.d)}</div>
        </div>
        <div class="wk-muscles mt">${gA.map(([g, v], i) => { const b = gB[i][1], max = Math.max(1, ...gA.map(x => x[1]), ...gB.map(x => x[1])); return `<div class="hbar"><span class="hl">${g}</span><span class="ht two"><i style="width:${v / max * 100}%"></i><em style="width:${b / max * 100}%"></em></span><span class="hv">${nf(v)}</span></div>`; }).join('')}
          <div class="bm-legend"><span><i class="lg1"></i>Esta semana</span><span><i class="lg3"></i>Semana pasada</span><span class="muted">series efectivas</span></div></div>
      </div>

      <div class="card mt chart-card">
        <div class="chart-head"><div class="ttl"><div class="big">${wdata[11].tip}</div><div class="sub">Esta semana · últimas 12 semanas</div></div></div>
        <div class="mini-seg" style="margin-bottom:10px">${[['duration', 'Duración'], ['volume', 'Volumen'], ['reps', 'Reps'], ['count', 'Entrenos']].map(([v, l]) => `<button data-act="metric" data-v="${v}" class="${profMetric === v ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div id="wchart" style="position:relative"></div>
      </div>
      <div class="quick-grid mt">
        <button class="btn" data-act="prs">${ic('trophy')} Récords</button>
        <button class="btn" data-act="measures">${ic('ruler')} Medidas</button>
        <button class="btn" data-act="calc">${ic('calc')} Calculadoras</button>
        <button class="btn" data-act="exStats">${ic('chart')} Ejercicios</button>
      </div>
      <h2 class="section">Mapa muscular <span class="mini-seg" style="margin-left:auto">${[7, 30].map(d => `<button data-act="mapDays" data-v="${d}" class="${mapDays === d ? 'on' : ''}">${d} días</button>`).join('')}</span></h2>
      <div class="card bm-card">${Object.keys(mapScores).length ? BodyMap.svg(mapScores) + `<div class="tags mt-s" style="justify-content:center">${BodyMap.ranking(mapScores).slice(0, 8).map(([n, v]) => `<span class="tag">${n} · <b style="color:var(--text)">${nf(v)}</b></span>`).join('')}</div>` : `<div class="empty-chart">Entrena para ver qué músculos trabajas</div>`}</div>
      <h2 class="section">Calendario</h2>
      <div class="card">
        <div class="cal-head"><button class="icon-btn ghost" data-act="calPrev">${ic('back')}</button><div class="center"><b>${base.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</b><div class="muted" style="font-size:12px">${monthCount} entreno${monthCount === 1 ? '' : 's'}</div></div><button class="icon-btn ghost" data-act="calNext" ${calOffset >= 0 ? 'disabled style="opacity:.3"' : ''}>${ic('chevR')}</button></div>
        <div class="cal">${'LMXJVSD'.split('').map(d => `<div class="dn">${d}</div>`).join('')}
          ${Array.from({ length: first }, () => '<div></div>').join('')}
          ${Array.from({ length: daysIn }, (_, i) => { const k = new Date(base.getFullYear(), base.getMonth(), i + 1).getTime(); const on = dayMap[k]; return `<div class="c ${on ? 'on' : ''} ${k === today ? 'today' : ''}" ${on ? `data-act="day" data-id="${on[0]}"` : ''}>${i + 1}</div>`; }).join('')}</div>
      </div>
      <div class="muted center mt" style="font-size:12px;padding:10px 0">IRONBLAZE · Volumen total levantado: <b style="color:var(--orange)">${fmtVol(tot.v)}</b></div>
    </div>`;
    Charts.bar($('#wchart'), wdata);
    VA = {
      settings: openSettings, prs: openPRs, measures: openMeasures, calc: openCalculators,
      exStats: () => { tab = 'exercises'; libFilter.sort = 'used'; renderTab(true); },
      metric: t => { profMetric = t.dataset.v; renderProfile(); },
      mapDays: t => { mapDays = +t.dataset.v; renderProfile(); },
      calPrev: () => { calOffset--; renderProfile(); },
      calNext: () => { if (calOffset < 0) { calOffset++; renderProfile(); } },
      day: t => openWorkoutDetail(t.dataset.id),
      rename: async () => { const n = await promptM('Tu nombre', S().settings.name); if (n && n.trim()) { S().settings.name = n.trim(); save(); renderProfile(); } },
      bw: async () => { if (await askBodyweight()) renderProfile(); }
    };
  }
  async function askBodyweight() {
    const cur = +S().settings.bodyweight ? nf(Store.toDisplay(S().settings.bodyweight)) : '';
    const n = await promptM(`Peso corporal (${Store.unit()})`, String(cur).replace(',', '.'), 'Ej: 75', 'number');
    if (n === null) return false;
    const v = parseFloat(String(n).replace(',', '.'));
    S().settings.bodyweight = v > 0 ? Store.fromDisplay(v) : '';
    if (v > 0) S().measures.push({ id: Store.uid(), date: Date.now(), weight: Store.fromDisplay(v) });
    save(); toast('✅ Peso corporal guardado'); return true;
  }

  // ---------------- Récords personales ----------------
  function openPRs() {
    openLayer({
      html: () => {
        const ids = [...new Set(S().workouts.flatMap(w => w.exercises.map(e => e.exId)))];
        const rows = ids.map(id => ({ id, ex: Store.getEx(id), rec: Store.records(id) })).filter(r => r.rec.e1rm > 0 || r.rec.reps > 0)
          .sort((a, b) => b.rec.e1rm - a.rec.e1rm || b.rec.reps - a.rec.reps);
        return `<div class="screen"><div class="page"><div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1>Récords</h1></div>
          ${rows.length ? `<div class="card pr-list">${rows.map(r => {
          const k = Store.kind(r.ex);
          return `<div class="pr-row" data-act="ex" data-id="${r.id}" style="cursor:pointer">${thumb(r.ex, 'sm')}<div class="nm">${esc(r.ex.n)}</div><div class="val">${k === 'weight' ? fmtW(r.rec.weight) : k === 'bw' && r.rec.weight ? '+' + fmtW(r.rec.weight) : r.rec.reps + (k === 'time' ? ' s' : k === 'cardio' ? ' min' : ' reps')}<small>${k === 'weight' ? '1RM est. ' + fmtW(r.rec.e1rm) : 'Mejor marca'}</small></div></div>`;
        }).join('')}</div>` : `<div class="empty"><div class="big">🏆</div><h4>Sin récords todavía</h4><p>Tus mejores marcas aparecerán aquí automáticamente.</p></div>`}
        </div></div>`;
      },
      actions: { back: (t, e, L) => L.close(), ex: t => openExerciseDetail(t.dataset.id) }
    });
  }

  // ---------------- Medidas ----------------
  function openMeasures() {
    const FIELDS = [['weight', 'Peso corporal', 'kg'], ['fat', 'Grasa corporal', '%'], ['waist', 'Cintura', 'cm'], ['chest', 'Pecho', 'cm'], ['arm', 'Brazo', 'cm'], ['thigh', 'Muslo', 'cm']];
    openLayer({
      data: { f: 'weight' },
      html: L => {
        const ms = S().measures.slice().sort((a, b) => b.date - a.date);
        const fld = FIELDS.find(f => f[0] === L.data.f);
        const latest = ms.find(m => m[L.data.f] != null && m[L.data.f] !== '');
        return `<div class="screen"><div class="page">
          <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1>Medidas</h1><button class="btn primary sm" data-act="add">${ic('plus')} Añadir</button></div>
          <div class="chips" style="padding-top:0">${FIELDS.map(f => `<button class="chip ${L.data.f === f[0] ? 'on' : ''}" data-act="f" data-v="${f[0]}">${f[1]}</button>`).join('')}</div>
          <div class="card mt-s chart-card"><div class="chart-head"><div class="ttl"><div class="big">${latest ? (fld[0] === 'weight' ? fmtW(latest.weight) : nf(latest[fld[0]]) + ' ' + fld[2]) : '—'}</div><div class="sub">${fld[1]} · último registro</div></div></div><div class="chart-host" style="position:relative"></div></div>
          <h2 class="section">Historial</h2>
          ${ms.length ? ms.map(m => `<div class="card"><div class="row-flex"><b style="flex:1">${fmtDate(m.date)}</b><button class="icon-btn ghost" data-act="del" data-id="${m.id}">${ic('trash')}</button></div>
            <div class="tags mt-s">${FIELDS.filter(f => m[f[0]] != null && m[f[0]] !== '').map(f => `<span class="tag">${f[1]}: <b style="color:var(--text)">${f[0] === 'weight' ? fmtW(m.weight) : nf(m[f[0]]) + ' ' + f[2]}</b></span>`).join('')}</div></div>`).join('') :
            `<div class="empty"><div class="big">📏</div><h4>Registra tu progreso</h4><p>Peso, % de grasa y perímetros. Verás su evolución en la gráfica.</p></div>`}
        </div></div>`;
      },
      bind: (el, L) => {
        const f = L.data.f;
        const data = S().measures.filter(m => m[f] != null && m[f] !== '').sort((a, b) => a.date - b.date)
          .map(m => { const v = f === 'weight' ? Store.toDisplay(m[f]) : +m[f]; return { label: shortDate(m.date), full: fmtDate(m.date), value: v, tip: nf(v) + ' ' + (f === 'weight' ? Store.unit() : FIELDS.find(x => x[0] === f)[2]) }; });
        Charts.line(el.querySelector('.chart-host'), data);
      },
      actions: {
        back: (t, e, L) => L.close(),
        f: (t, e, L) => { L.data.f = t.dataset.v; L.render(); },
        del: async (t, e, L) => { if (await confirmM('¿Eliminar registro?', '', 'Eliminar', true)) { S().measures = S().measures.filter(m => m.id !== t.dataset.id); save(); L.render(); } },
        add: async (t, e, L) => {
          const today = new Date(); const iso = new Date(today - today.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
          const html = `<div class="field"><label>Fecha</label><input class="input" type="date" data-m="date" value="${iso}"></div>` +
            FIELDS.map(f => `<div class="field"><label>${f[1]} (${f[0] === 'weight' ? Store.unit() : f[2]})</label><input class="input" type="number" step="any" inputmode="decimal" data-m="${f[0]}"></div>`).join('');
          const res = await new Promise(r => {
            const M = openLayer({
              transient: true,
              html: () => `<div class="backdrop" data-act="x"></div><div class="sheet"><div class="grab"></div><h3>Nueva medición</h3>${html}<button class="btn primary block" data-act="ok">Guardar</button></div>`,
              actions: {
                x: () => { M.close(); r(null); },
                ok: () => { const o = {}; M.el.querySelectorAll('[data-m]').forEach(i => o[i.dataset.m] = i.value); M.close(); r(o); }
              }
            });
          });
          if (!res) return;
          const m = { id: Store.uid(), date: res.date ? new Date(res.date + 'T12:00').getTime() : Date.now() };
          let any = false;
          FIELDS.forEach(f => { if (res[f[0]] !== '') { m[f[0]] = f[0] === 'weight' ? Store.fromDisplay(res[f[0]]) : parseFloat(res[f[0]]); any = true; } });
          if (!any) { toast('Introduce al menos un valor'); return; }
          S().measures.push(m); save(); L.render(); toast('✅ Medición guardada');
        }
      }
    });
  }

  // ---------------- Calculadoras ----------------
  function openCalculators() {
    const c = { w: '', r: '', target: '', bar: S().settings.unit === 'lbs' ? 45 : 20 };
    openLayer({
      data: { t: 'rm' },
      html: L => `<div class="screen"><div class="page">
        <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1>Calculadoras</h1></div>
        <div class="seg"><button class="${L.data.t === 'rm' ? 'on' : ''}" data-act="t" data-v="rm">1RM</button><button class="${L.data.t === 'pl' ? 'on' : ''}" data-act="t" data-v="pl">Discos</button><button class="${L.data.t === 'wu' ? 'on' : ''}" data-act="t" data-v="wu">Calentamiento</button></div>
        ${L.data.t === 'rm' ? `<div class="card mt"><div class="quick-grid"><div class="field"><label>Peso (${Store.unit()})</label><input class="input" type="number" inputmode="decimal" data-c="w" value="${c.w}"></div><div class="field"><label>Repeticiones</label><input class="input" type="number" inputmode="numeric" data-c="r" value="${c.r}"></div></div>
            <div class="muted center" style="font-size:12px">Tu 1RM estimado (Epley)</div><div class="num-big" id="rm-out">—</div><table class="pct-table" id="rm-table"></table></div>` : ''}
        ${L.data.t === 'pl' ? `<div class="card mt"><div class="quick-grid"><div class="field"><label>Peso objetivo (${Store.unit()})</label><input class="input" type="number" inputmode="decimal" data-c="target" value="${c.target}"></div><div class="field"><label>Barra (${Store.unit()})</label><input class="input" type="number" inputmode="decimal" data-c="bar" value="${c.bar}"></div></div>
            <div class="plates" id="pl-vis"></div><div class="center" id="pl-out" style="color:var(--text-2)">Introduce un peso</div></div>` : ''}
        ${L.data.t === 'wu' ? `<div class="card mt"><div class="field"><label>Peso de trabajo (${Store.unit()})</label><input class="input" type="number" inputmode="decimal" data-c="target" value="${c.target}"></div><table class="pct-table" id="wu-table"></table></div>` : ''}
      </div></div>`,
      bind: (el, L) => calc(el, L),
      onInput: (e, L) => { const k = e.target.dataset.c; if (k) { c[k] = e.target.value; calc(L.el, L); } },
      actions: { back: (t, e, L) => L.close(), t: (t, e, L) => { L.data.t = t.dataset.v; L.render(); } }
    });
    function calc(el, L) {
      const u = Store.unit();
      if (L.data.t === 'rm') {
        const w = +c.w, r = +c.r, out = el.querySelector('#rm-out'), tb = el.querySelector('#rm-table');
        if (w > 0 && r > 0) {
          const rm = Store.e1rm(w, r);
          out.textContent = `${nf(rm)} ${u}`;
          tb.innerHTML = [100, 95, 90, 85, 80, 75, 70, 65, 60].map(p => `<tr><td>${p}%</td><td class="muted">~${p === 100 ? 1 : Math.max(1, Math.round((100 / p - 1) * 30))} reps</td><td>${nf(rm * p / 100)} ${u}</td></tr>`).join('');
        } else { out.textContent = '—'; tb.innerHTML = ''; }
      }
      if (L.data.t === 'pl') {
        const plates = u === 'lbs' ? [45, 35, 25, 10, 5, 2.5] : [25, 20, 15, 10, 5, 2.5, 1.25];
        const colors = { 25: '#ff3b30', 20: '#2f7bff', 15: '#ffc233', 10: '#2fd67b', 5: '#fff', 2.5: '#ff6a00', 1.25: '#aaa', 45: '#2f7bff', 35: '#ffc233' };
        let side = (+c.target - +c.bar) / 2; const used = [];
        const vis = el.querySelector('#pl-vis'), out = el.querySelector('#pl-out');
        if (!(+c.target > 0) || side < 0) { vis.innerHTML = ''; out.textContent = side < 0 ? 'El peso es menor que la barra' : 'Introduce un peso'; return; }
        for (const p of plates) while (side >= p - 1e-9) { used.push(p); side -= p; }
        const h = p => 40 + (p / plates[0]) * 70;
        vis.innerHTML = `<div class="bar"></div>${used.slice().reverse().map(p => `<div class="pl" style="height:${h(p)}px;background:${colors[p] || '#ccc'}">${p}</div>`).join('')}<div class="sleeve"></div>${used.map(p => `<div class="pl" style="height:${h(p)}px;background:${colors[p] || '#ccc'}">${p}</div>`).join('')}<div class="bar"></div>`;
        out.innerHTML = used.length ? `Por lado: <b style="color:var(--text)">${used.join(' + ')}</b>${side > 0.01 ? `<br><span style="color:var(--yellow)">Faltan ${nf(side * 2, 2)} ${u} para cuadrar</span>` : ''}` : 'Solo la barra';
      }
      if (L.data.t === 'wu') {
        const w = +c.target, tb = el.querySelector('#wu-table');
        tb.innerHTML = w > 0 ? [[+c.bar || 20, 10, 'Barra vacía'], [w * .4, 8, '40%'], [w * .6, 5, '60%'], [w * .8, 3, '80%'], [w * .9, 1, '90%']].map(([x, r, l]) => `<tr><td>${l}</td><td class="muted">${r} reps</td><td>${nf(Math.round(x / 2.5) * 2.5)} ${u}</td></tr>`).join('') : '';
      }
    }
  }

  // ---------------- Copias de seguridad ----------------
  async function exportBackup() {
    const name = `ironblaze-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const json = JSON.stringify(S());
    const mark = () => { S().settings.lastExport = Date.now(); save(); };
    try {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Copia de seguridad IRONBLAZE', text: 'Copia de mis entrenamientos' });
        mark(); toast('✅ Copia compartida'); return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    download(name, json, 'application/json'); mark(); toast('✅ Copia descargada');
  }
  function download(name, content, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---------------- Ajustes ----------------
  function openSettings() {
    openLayer({
      html: () => {
        const s = S().settings, snaps = Store.snapshots();
        const notifState = !('Notification' in window) ? 'No disponible en este navegador' : Notification.permission === 'denied' ? 'Bloqueadas: actívalas en los ajustes del navegador' : 'Te avisa aunque tengas la pantalla bloqueada';
        return `<div class="screen"><div class="page">
          <div class="page-head"><button class="icon-btn ghost back-btn" data-act="back">${ic('back')}</button><h1>Ajustes</h1></div>
          <h2 class="section">Perfil</h2>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Nombre</div><div class="sr-sub">${esc(s.name)}</div></div><button class="btn sm" data-act="name">Editar</button></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Peso corporal</div><div class="sr-sub">${Store.bodyweight() ? fmtW(Store.bodyweight()) + ' · se usa para el volumen de dominadas, fondos…' : 'Para calcular el volumen en ejercicios con tu propio peso'}</div></div><button class="btn sm" data-act="bw">Editar</button></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Objetivo semanal</div><div class="sr-sub">${s.weekGoal} entrenos por semana</div></div><div class="row-flex"><button class="icon-btn" data-act="goal" data-d="-1">−</button><button class="icon-btn" data-act="goal" data-d="1">+</button></div></div>
          <h2 class="section">Entrenamiento</h2>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Unidades</div></div><div class="seg" style="width:130px"><button class="${s.unit === 'kg' ? 'on' : ''}" data-act="unit" data-v="kg">kg</button><button class="${s.unit === 'lbs' ? 'on' : ''}" data-act="unit" data-v="lbs">lbs</button></div></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Descanso por defecto</div><div class="sr-sub">${fmtRest(s.restDefault)}</div></div><button class="btn sm" data-act="rest">Cambiar</button></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Aviso de descanso en segundo plano</div><div class="sr-sub">${notifState}</div></div><button class="toggle ${canNotify() ? 'on' : ''}" data-act="notify"></button></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Sonido al terminar descanso</div></div><button class="toggle ${s.sound ? 'on' : ''}" data-act="tog" data-k="sound"></button></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Vibración</div></div><button class="toggle ${s.vibrate ? 'on' : ''}" data-act="tog" data-k="vibrate"></button></div>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Mantener pantalla encendida</div><div class="sr-sub">Durante el entrenamiento</div></div><button class="toggle ${s.keepAwake ? 'on' : ''}" data-act="tog" data-k="keepAwake"></button></div>
          <h2 class="section">Copias de seguridad</h2>
          <button class="sheet-opt" data-act="export">${ic('share')}<span>Guardar / compartir copia<span class="sub">${s.lastExport ? 'Última: ' + fmtDate(s.lastExport) : 'Aún no has hecho ninguna'} · a Drive, correo, WhatsApp…</span></span></button>
          <button class="sheet-opt" data-act="import">${ic('upload')}<span>Restaurar desde archivo<span class="sub">Recupera tus datos de un archivo .json</span></span></button>
          <div class="setting-row"><div class="sr-main"><div class="sr-title">Recordatorio semanal de copia</div></div><button class="toggle ${s.backupReminder ? 'on' : ''}" data-act="tog" data-k="backupReminder"></button></div>
          <div class="sr-sub" style="margin:12px 0 6px;color:var(--muted);font-size:13px">Copias automáticas en este móvil (1 al día):</div>
          ${snaps.length ? snaps.map(sn => `<div class="setting-row"><div class="sr-main"><div class="sr-title" style="font-size:14px">${fmtDate(sn.ts, true)}</div><div class="sr-sub">${sn.n} entrenos</div></div><button class="btn sm" data-act="restoreSnap" data-ts="${sn.ts}">Restaurar</button></div>`).join('') : '<div class="muted" style="font-size:13px;padding:6px 0 10px">Todavía no hay copias automáticas.</div>'}
          <h2 class="section">Otros datos</h2>
          <button class="sheet-opt" data-act="csv">${ic('list')}<span>Exportar historial a CSV<span class="sub">Para Excel / Google Sheets</span></span></button>
          <button class="sheet-opt" data-act="demo">${ic('dumbbell')}<span>Cargar datos de ejemplo</span></button>
          <button class="sheet-opt danger" data-act="reset">${ic('trash')}<span>Borrar todos los datos</span></button>
          <input type="file" accept=".json,application/json" id="imp" class="hidden">
          <div class="muted center mt" style="font-size:12px;line-height:1.6;padding:20px 0">
            <div class="brand" style="font-size:22px">IRON<b>BLAZE</b></div>
            Versión ${Store.VERSION}<br>
            Animaciones: <a class="link" href="https://oss.exercisedb.dev" target="_blank" rel="noopener">ExerciseDB</a> · Fotos HD: <a class="link" href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener">free-exercise-db</a><br>Tus datos se guardan solo en este dispositivo.</div>
        </div></div>`;
      },
      bind: (el, L) => {
        el.querySelector('#imp').addEventListener('change', async e => {
          const f = e.target.files[0]; if (!f) return;
          try {
            const obj = JSON.parse(await f.text());
            if (!Array.isArray(obj.workouts)) throw 0;
            if (await confirmM('¿Restaurar datos?', `Se reemplazarán tus datos actuales por los del archivo (${obj.workouts.length} entrenos).`, 'Restaurar', true)) {
              Store.importData(obj); hayCache.clear(); toast('✅ Datos restaurados'); closeAll();
            }
          } catch (err) { toast('Archivo no válido'); }
        });
      },
      actions: {
        back: (t, e, L) => L.close(),
        name: async (t, e, L) => { const n = await promptM('Tu nombre', S().settings.name); if (n && n.trim()) { S().settings.name = n.trim(); save(); L.render(); } },
        bw: async (t, e, L) => { if (await askBodyweight()) L.render(); },
        goal: (t, e, L) => { S().settings.weekGoal = Math.max(1, Math.min(7, S().settings.weekGoal + +t.dataset.d)); save(); L.render(); },
        unit: (t, e, L) => { S().settings.unit = t.dataset.v; save(); L.render(); },
        rest: async (t, e, L) => { const v = await restSheet(S().settings.restDefault); if (v !== null) { S().settings.restDefault = v; save(); L.render(); } },
        tog: (t, e, L) => { const k = t.dataset.k; S().settings[k] = !S().settings[k]; save(); L.render(); },
        notify: async (t, e, L) => {
          const s = S().settings;
          if (canNotify()) { s.notify = false; save(); L.render(); return; }
          if (!('Notification' in window)) { toast('Tu navegador no admite notificaciones. En iPhone, instala la app en la pantalla de inicio primero.'); return; }
          const p = await Notification.requestPermission();
          if (p === 'granted') { s.notify = true; save(); toast('🔔 Te avisaremos al terminar cada descanso'); }
          else toast('Permiso denegado. Puedes activarlo en los ajustes del navegador.');
          L.render();
        },
        export: async (t, e, L) => { await exportBackup(); L.render(); },
        import: (t, e, L) => L.el.querySelector('#imp').click(),
        restoreSnap: async t => {
          const ts = +t.dataset.ts;
          if (await confirmM('¿Restaurar esta copia?', `Volverás al estado del ${fmtDate(ts, true)}. Lo registrado después se perderá.`, 'Restaurar', true)) {
            if (Store.restoreSnapshot(ts)) { hayCache.clear(); closeAll(); toast('✅ Copia restaurada'); }
          }
        },
        csv: () => {
          const rows = [['fecha', 'entreno', 'ejercicio', 'serie', 'tipo', `peso_${Store.unit()}`, 'reps', 'duracion_min']];
          S().workouts.forEach(w => w.exercises.forEach(e => e.sets.forEach((s, i) => rows.push([new Date(w.start).toISOString(), w.title, Store.getEx(e.exId).n, i + 1, typeName[s.type], Store.toDisplay(s.w), s.r, Math.round((w.end - w.start) / 6e4)]))));
          download(`ironblaze-historial-${new Date().toISOString().slice(0, 10)}.csv`, '﻿' + rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv');
        },
        demo: async (t, e, L) => { if (await confirmM('Datos de ejemplo', 'Se añadirán ~10 semanas de entrenamientos ficticios.', 'Generar')) { seedDemo(); toast('✅ Datos de ejemplo cargados'); L.render(); } },
        reset: async () => {
          if (await confirmM('¿Borrar TODO?', 'Se eliminarán entrenos, rutinas, medidas y ajustes. Exporta una copia antes si la quieres conservar.', 'Borrar todo', true)) {
            stopRest(); Store.reset(); hayCache.clear(); closeAll(); toast('Datos borrados');
          }
        }
      }
    });
  }

  // ---------------- Bienvenida (primera vez) ----------------
  async function onboarding() {
    const st = S();
    if (st.settings.onboarded) return;
    if (st.workouts.length) { st.settings.onboarded = true; save(); return; }
    const v = await modal({
      title: '🔥 Bienvenido a IRONBLAZE', noFocus: true,
      text: 'Cuéntanos un poco de ti para personalizar la app. Podrás cambiarlo cuando quieras en Ajustes.',
      html: `<div class="field"><label>Tu nombre</label><input class="input" data-k="name" placeholder="Ej: Pablo"></div>
        <div class="quick-grid"><div class="field"><label>Peso corporal</label><input class="input" data-k="bw" type="number" inputmode="decimal" step="any" placeholder="Ej: 75"></div>
        <div class="field"><label>Unidades</label><select class="select input" data-k="unit" style="height:46px"><option value="kg">kg</option><option value="lbs">lbs</option></select></div></div>
        <div class="field"><label>Entrenos por semana (objetivo)</label><select class="select input" data-k="goal" style="height:46px">${[2, 3, 4, 5, 6].map(n => `<option ${n === 4 ? 'selected' : ''}>${n}</option>`).join('')}</select></div>`,
      buttons: [{ label: 'Ahora no', value: null }, { label: '¡Vamos!', value: 'input', cls: 'primary' }]
    });
    st.settings.onboarded = true;
    if (v && typeof v === 'object') {
      if (v.name && v.name.trim()) st.settings.name = v.name.trim();
      st.settings.unit = v.unit === 'lbs' ? 'lbs' : 'kg';
      st.settings.weekGoal = +v.goal || 4;
      const bw = parseFloat(String(v.bw || '').replace(',', '.'));
      if (bw > 0) { st.settings.bodyweight = Store.fromDisplay(bw); st.measures.push({ id: Store.uid(), date: Date.now(), weight: Store.fromDisplay(bw) }); }
    }
    save(); renderTab();
  }

  // ---------------- Datos de ejemplo ----------------
  function seedDemo() {
    const prog = Store.PROGRAMS[0], now = Date.now(), st = S();
    const baseW = ex => {
      const n = (ex.en || ex.n).toLowerCase();
      if (/squat/.test(n) && ex.q.includes('barbell')) return 80;
      if (/deadlift/.test(n) && ex.q.includes('barbell')) return 90;
      if (/bench press/.test(n) && ex.q.includes('barbell')) return 65;
      if (/leg press/.test(n)) return 140;
      const q = ex.q[0];
      return { barbell: 45, dumbbell: 18, cable: 35, 'leverage machine': 45, 'sled machine': 120, 'ez barbell': 30 }[q] || 0;
    };
    const days = [];
    for (let wk = 9; wk >= 0; wk--) for (const dow of [0, 2, 4]) {
      const d = new Date(); d.setHours(18, 30, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7 - wk * 7 + dow);
      if (d.getTime() < now - 2 * 3600e3) days.push(d.getTime() + Math.round((Math.random() - .5) * 90) * 6e4);
    }
    days.forEach((t, idx) => {
      const r = prog.routines[idx % 3], prog1 = 1 + Math.floor(idx / 3) * 0.025;
      const exercises = r.exercises.map(e => {
        const ex = Store.getEx(e.exId), k = Store.kind(ex), w0 = Math.round(baseW(ex) * prog1 / 2.5) * 2.5;
        const sets = [];
        if (k === 'weight' && idx % 2 === 0 && baseW(ex) >= 45) sets.push({ type: 'w', w: Math.round(w0 * 0.5 / 2.5) * 2.5, r: 10, done: true });
        e.sets.forEach((s, si) => sets.push({ type: si === e.sets.length - 1 && idx % 4 === 1 ? 'f' : 'n', w: k === 'weight' ? w0 : k === 'bw' && idx > 12 ? 5 : 0, r: Math.max(1, (+s.r || 10) + Math.round(Math.random() * 2) - (si > 1 ? 1 : 0)), done: true }));
        return { exId: e.exId, notes: '', ss: null, sets };
      });
      st.workouts.push({ id: Store.uid(), title: r.name, notes: '', start: t, end: t + (52 + Math.round(Math.random() * 25)) * 6e4, exercises });
    });
    st.workouts.sort((a, b) => b.start - a.start);
    days.filter((_, i) => i % 3 === 0).forEach((t, i) => st.measures.push({ id: Store.uid(), date: t, weight: Math.round((82 - i * 0.35 + Math.random() * .4) * 10) / 10, fat: Math.round((18 - i * 0.2) * 10) / 10, waist: Math.round(86 - i * 0.3) }));
    if (!st.routines.some(r => r.folder === prog.name)) prog.routines.forEach(r => { const c = JSON.parse(JSON.stringify(r)); c.id = Store.uid(); c.folder = prog.name; st.routines.push(c); });
    st.settings.onboarded = true;
    Store.save(true);
  }

  // =====================================================================
  //  Actualizaciones de la app (service worker)
  // =====================================================================
  function showUpdateBanner(worker) {
    if ($('#update-banner')) return;
    const b = document.createElement('div');
    b.id = 'update-banner'; b.className = 'update-banner';
    b.innerHTML = `<span>🔥 <b>Nueva versión disponible</b></span><button class="btn sm primary" data-u="go">Actualizar</button><button class="icon-btn ghost" data-u="x" style="width:30px;height:30px">${ic('close')}</button>`;
    b.addEventListener('click', e => {
      const u = e.target.closest('[data-u]'); if (!u) return;
      if (u.dataset.u === 'go') { Store.save(true); worker.postMessage({ type: 'skip-waiting' }); b.querySelector('[data-u="go"]').textContent = 'Actualizando…'; }
      else b.remove();
    });
    $('#app').appendChild(b);
  }
  function initSW() {
    if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
    navigator.serviceWorker.register('sw.js').then(reg => {
      const check = () => reg.update().catch(() => { });
      setInterval(check, 30 * 60e3);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
      const watch = w => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(w); });
      if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner(reg.waiting);
      reg.addEventListener('updatefound', () => watch(reg.installing));
    }).catch(() => { });
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
  }

  // =====================================================================
  //  Arranque
  // =====================================================================
  renderTab(true);
  if (S().active) {
    if (S().active.rest && S().active.rest.end > Date.now()) { rest.end = S().active.rest.end; rest.total = S().active.rest.total; rest.iv = setInterval(tickRest, 250); tickRest(); }
    updateChrome();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && stack.some(l => l.def.id === 'aw')) keepAwake(true); });
  // Evitar que la rueda cambie valores en inputs numéricos
  document.addEventListener('wheel', e => { if (document.activeElement && document.activeElement.type === 'number' && document.activeElement === e.target) e.target.blur(); }, { passive: true });
  Store.autoSnapshot();
  initSW();
  setTimeout(onboarding, 400);
})();
