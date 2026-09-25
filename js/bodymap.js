// ============ Mapa muscular (vista frontal y trasera) ============
window.BodyMap = (function () {
  // Músculos de ExerciseDB → regiones del dibujo
  const MAP = {
    pectorals: ['chest'], chest: ['chest'], 'upper chest': ['chest'],
    delts: ['delts', 'rdelts'], deltoids: ['delts', 'rdelts'], shoulders: ['delts', 'rdelts'], 'rear deltoids': ['rdelts'], 'rotator cuff': ['rdelts'],
    biceps: ['biceps'], brachialis: ['biceps'],
    triceps: ['triceps'],
    forearms: ['forearms'], 'wrist flexors': ['forearms'], 'wrist extensors': ['forearms'], wrists: ['forearms'], 'grip muscles': ['forearms'], hands: ['forearms'],
    abs: ['abs'], abdominals: ['abs'], 'lower abs': ['abs'], core: ['abs', 'obliques'], 'serratus anterior': ['obliques'], obliques: ['obliques'],
    quads: ['quads'], quadriceps: ['quads'], 'hip flexors': ['quads'],
    adductors: ['adductors'], 'inner thighs': ['adductors'], groin: ['adductors'],
    abductors: ['glutes'], glutes: ['glutes'],
    hamstrings: ['hamstrings'],
    calves: ['calves', 'calvesF'], soleus: ['calves'], shins: ['calvesF'], ankles: ['calvesF'], 'ankle stabilizers': ['calvesF'], feet: ['calvesF'],
    lats: ['lats'], 'latissimus dorsi': ['lats'],
    'upper back': ['upperback'], rhomboids: ['upperback'], back: ['upperback', 'lats'],
    traps: ['traps', 'trapsF'], trapezius: ['traps', 'trapsF'], 'levator scapulae': ['traps', 'trapsF'],
    spine: ['lowerback'], 'lower back': ['lowerback'],
    neck: ['neck'], sternocleidomastoid: ['neck'],
    'cardiovascular system': []
  };
  const NAMES = {
    chest: 'Pecho', delts: 'Hombros', rdelts: 'Deltoides post.', biceps: 'Bíceps', triceps: 'Tríceps', forearms: 'Antebrazos',
    abs: 'Abdominales', obliques: 'Oblicuos', quads: 'Cuádriceps', adductors: 'Aductores', glutes: 'Glúteos', hamstrings: 'Isquios',
    calves: 'Gemelos', lats: 'Dorsales', upperback: 'Espalda alta', traps: 'Trapecio', lowerback: 'Lumbares', neck: 'Cuello'
  };

  // Suma de series por región: principal = 1, secundario = 0,5
  function scoresFromSets(list) { // list: [{ex, sets}]
    const sc = {};
    const add = (m, v) => (MAP[m] || []).forEach(r => { sc[r] = (sc[r] || 0) + v; });
    list.forEach(({ ex, sets }) => {
      if (!sets) return;
      ex.t.forEach(m => add(m, sets));
      ex.s.forEach(m => add(m, sets * 0.5));
    });
    // regiones gemelas (vista frontal / trasera)
    if (sc.traps) sc.trapsF = sc.traps;
    if (sc.calves && !sc.calvesF) sc.calvesF = sc.calves * 0.6;
    return sc;
  }
  function scoresFromWorkouts(workouts, getEx) {
    const list = [];
    workouts.forEach(w => w.exercises.forEach(e => {
      const n = e.sets.filter(s => s.done && s.type !== 'w').length;
      if (n) list.push({ ex: getEx(e.exId), sets: n });
    }));
    return scoresFromSets(list);
  }
  function scoresFromExercise(ex) {
    const sc = {};
    ex.s.forEach(m => (MAP[m] || []).forEach(r => { sc[r] = Math.max(sc[r] || 0, 0.45); }));
    ex.t.forEach(m => (MAP[m] || []).forEach(r => { sc[r] = 1; }));
    if (sc.traps) sc.trapsF = sc.traps;
    if (sc.calves && !sc.calvesF) sc.calvesF = sc.calves * 0.6;
    return sc;
  }

  // Formas (mitad derecha de la figura, x>100). Se reflejan para la izquierda.
  const FRONT = [
    ['neck', 'M93,54 L107,54 L108,68 L92,68 Z', true],
    ['trapsF', 'M108,60 Q122,63 133,72 L110,72 Z'],
    ['delts', 'M131,72 Q150,72 152,94 Q148,102 140,104 Q132,92 126,80 Z'],
    ['chest', 'M101,74 L126,74 Q138,84 138,100 Q130,114 112,114 Q103,113 101,110 Z'],
    ['biceps', 'M141,106 Q152,104 154,120 Q155,138 147,146 Q139,140 138,124 Z'],
    ['forearms', 'M147,150 Q158,148 161,166 Q162,184 157,196 Q150,196 146,184 Q143,166 147,150 Z'],
    ['abs', 'M101,117 L114,116 Q117,140 116,176 Q110,184 101,186 Z'],
    ['obliques', 'M117,116 Q131,116 134,128 Q134,154 126,176 Q121,178 118,176 Q120,146 117,116 Z'],
    ['quads', 'M104,194 Q118,188 132,192 Q140,210 138,240 Q134,272 124,288 Q114,290 110,282 Q104,250 104,194 Z'],
    ['adductors', 'M101,194 L104,196 Q104,232 108,262 Q103,256 101,246 Z'],
    ['calvesF', 'M112,300 Q124,296 130,306 Q134,330 128,360 Q120,366 116,358 Q110,330 112,300 Z']
  ];
  const BACK = [
    ['neck', 'M93,54 L107,54 L108,64 L92,64 Z', true],
    ['traps', 'M100,58 L110,58 Q124,64 136,74 L120,86 Q108,98 100,114 Z'],
    ['rdelts', 'M131,72 Q150,72 152,94 Q148,102 140,104 Q132,92 126,80 Z'],
    ['upperback', 'M102,100 Q110,90 121,88 Q130,96 128,112 L104,118 Z'],
    ['lats', 'M129,98 Q140,106 137,128 Q131,152 114,168 L104,158 L104,122 L130,114 Z'],
    ['triceps', 'M141,106 Q152,104 154,120 Q155,138 147,146 Q139,140 138,124 Z'],
    ['forearms', 'M147,150 Q158,148 161,166 Q162,184 157,196 Q150,196 146,184 Q143,166 147,150 Z'],
    ['lowerback', 'M101,160 L112,168 Q115,178 113,186 L101,188 Z'],
    ['glutes', 'M101,190 Q124,184 136,198 Q138,222 120,230 Q104,230 101,218 Z'],
    ['hamstrings', 'M104,234 Q124,230 134,240 Q136,264 126,288 Q116,292 110,286 Q104,262 104,234 Z'],
    ['calves', 'M111,298 Q126,292 132,306 Q135,330 127,356 Q119,362 115,354 Q108,328 111,298 Z']
  ];
  function level(v, max) {
    if (!v) return 0;
    return Math.max(0.28, Math.min(1, v / max));
  }

  function figure(shapes, sc, max, label) {
    let g = `<circle cx="100" cy="34" r="17" class="bm-head"/>`;
    // manos y pies neutros
    g += `<ellipse cx="156" cy="204" rx="6" ry="8" class="bm-head"/><ellipse cx="44" cy="204" rx="6" ry="8" class="bm-head"/>`;
    g += `<ellipse cx="122" cy="376" rx="9" ry="6" class="bm-head"/><ellipse cx="78" cy="376" rx="9" ry="6" class="bm-head"/>`;
    // rodillas
    g += `<ellipse cx="119" cy="294" rx="8" ry="6" class="bm-head"/><ellipse cx="81" cy="294" rx="8" ry="6" class="bm-head"/>`;
    shapes.forEach(([r, d, neutral]) => {
      const lv = neutral && !sc[r] ? 0 : level(sc[r], max);
      const style = lv ? `style="fill-opacity:${lv.toFixed(2)}"` : '';
      const cls = lv ? 'bm-m on' : 'bm-m';
      const title = NAMES[r.replace(/F$/, '')] || '';
      const t = `<title>${title}${sc[r] ? ' · ' + (Math.round(sc[r] * 10) / 10) + ' series' : ''}</title>`;
      g += `<path d="${d}" class="${cls}" ${style}>${t}</path>`;
      g += `<path d="${d}" class="${cls}" ${style} transform="translate(200,0) scale(-1,1)">${t}</path>`;
    });
    return `<g>${g}</g><text x="100" y="398" text-anchor="middle" class="bm-label">${label}</text>`;
  }

  // sc: puntuaciones por región; opts.max para escalar (por defecto el máximo)
  function svg(sc, opts = {}) {
    const vals = Object.values(sc);
    const max = opts.max || Math.max(1, ...vals);
    return `<svg viewBox="0 0 420 405" class="bodymap" role="img" aria-label="Mapa muscular">
      <g transform="translate(0,0)">${figure(FRONT, sc, max, 'FRONTAL')}</g>
      <g transform="translate(220,0)">${figure(BACK, sc, max, 'TRASERA')}</g></svg>`;
  }

  // Lista ordenada de regiones con puntuación (para leyenda)
  function ranking(sc) {
    const seen = new Set();
    return Object.entries(sc).filter(([r, v]) => v > 0 && !/F$/.test(r))
      .map(([r, v]) => [NAMES[r] || r, v]).filter(([n]) => !seen.has(n) && seen.add(n))
      .sort((a, b) => b[1] - a[1]);
  }

  return { svg, scoresFromSets, scoresFromWorkouts, scoresFromExercise, ranking, NAMES };
})();
