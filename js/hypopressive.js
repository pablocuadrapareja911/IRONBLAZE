// ============ IRONBLAZE · Gimnasia abdominal hipopresiva y suelo pélvico ============
// Ejercicios propios (no vienen de ExerciseDB): se añaden a la biblioteca con su propio dibujo animado
// que marca las fases de la respiración (inspira · espira · apnea con apertura de costillas).
(function () {
  // ---------- Posturas (vista de perfil, lienzo 200×200, suelo en y=180) ----------
  // H cabeza · S hombro · P cadera · K rodilla · A tobillo · T punta del pie · E codo · W mano
  // K2/A2/T2: la otra pierna (la del fondo), cuando está en otra posición
  const SUP = { H: [38, 166], S: [58, 168], P: [116, 168], K: [142, 138], A: [166, 176], T: [174, 162] };
  const POSES = {
    learn: { ...SUP, E: [76, 176], W: [88, 151], mat: true },
    venus: { H: [104, 36], S: [98, 58], P: [95, 112], K: [103, 146], A: [97, 178], T: [113, 179], E: [96, 86], W: [110, 108], armBack: true },
    atenea: { H: [104, 36], S: [98, 58], P: [95, 112], K: [103, 146], A: [97, 178], T: [113, 179], E: [120, 72], W: [143, 74] },
    artemisa: { H: [139, 62], S: [122, 76], P: [80, 110], K: [108, 142], A: [96, 178], T: [112, 179], E: [116, 104], W: [101, 131] },
    aura: { H: [108, 52], S: [104, 74], P: [106, 128], K: [112, 177], A: [64, 178], T: [50, 178], E: [124, 82], W: [146, 84], mat: true },
    hestia: { H: [96, 94], S: [92, 116], P: [88, 170], K: [132, 164], A: [104, 176], T: [118, 178], E: [110, 146], W: [126, 158], mat: true },
    hestiaLegs: { H: [80, 94], S: [76, 116], P: [72, 170], K: [116, 171], A: [158, 173], T: [165, 160], E: [92, 146], W: [104, 164], mat: true },
    gaia: { H: [146, 122], S: [126, 124], P: [70, 126], K: [68, 177], A: [36, 176], T: [28, 178], E: [132, 150], W: [128, 177], mat: true },
    maya: { H: [146, 136], S: [126, 134], P: [70, 128], K: [68, 177], A: [36, 176], T: [28, 178], E: [128, 177], W: [158, 178], mat: true },
    freya: { H: [146, 64], S: [132, 80], P: [96, 120], K: [128, 146], A: [132, 178], T: [146, 179], K2: [78, 148], A2: [58, 174], T2: [48, 180], E: [156, 69], W: [172, 54] },
    persefone: { H: [106, 40], S: [102, 62], P: [100, 116], K: [132, 140], A: [130, 178], T: [146, 179], K2: [88, 162], A2: [62, 170], T2: [55, 180], E: [122, 78], W: [144, 80] },
    supine: { ...SUP, E: [80, 175], W: [104, 176], mat: true },
    bridge: { H: [38, 167], S: [58, 170], P: [114, 150], K: [142, 134], A: [162, 176], T: [170, 164], E: [80, 176], W: [102, 177], mat: true },
    overhead: { H: [42, 166], S: [62, 168], P: [120, 168], K: [152, 160], A: [184, 176], T: [192, 164], E: [36, 177], W: [14, 177], mat: true },
    selene: { H: [40, 156], S: [60, 166], P: [118, 166], K: [150, 172], A: [180, 174], T: [189, 170], K2: [148, 160], A2: [178, 162], T2: [187, 158], E: [36, 177], W: [12, 177], mat: true },
    kegel: { ...SUP, E: [80, 175], W: [104, 176], mat: true, kegel: true }
  };

  const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const f = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);

  // Tronco de perfil: espalda, pecho y barriga. "bulge" es lo que sale la barriga (pequeño = vacío abdominal)
  // y "rib" cuánto se abren las costillas.
  function torso(S, P, bulge, rib) {
    const dx = P[0] - S[0], dy = P[1] - S[1], len = Math.hypot(dx, dy), u = [dx / len, dy / len], n = [u[1], -u[0]];
    const ws = 11, wp = 12;
    const Bs = add(S, n, -(ws - 1)), Fs = add(S, n, ws), Fr = add(lerp(S, P, 0.4), n, ws + 1 + rib), Fh = add(P, n, wp - 3), Bh = add(P, n, -wp);
    const c1 = add(S, u, -9), c2 = add(lerp(S, P, 0.18), n, ws + 4 + rib), cb = add(lerp(S, P, 0.72), n, bulge), c3 = add(P, u, 9), c4 = add(lerp(S, P, 0.5), n, -(ws + 1));
    return { d: `M${f(Bs)} Q${f(c1)} ${f(Fs)} Q${f(c2)} ${f(Fr)} Q${f(cb)} ${f(Fh)} Q${f(c3)} ${f(Bh)} Q${f(c4)} ${f(Bs)} Z`, belly: `M${f(Fr)} Q${f(cb)} ${f(Fh)}`, n, u };
  }
  const line = (pts, w, cls) => `<polyline class="${cls}" points="${pts.map(f).join(' ')}" stroke-width="${w}"/>`;
  const arrow = (tail, tip, dir, side) => {
    const w1 = add(add(tip, dir, -5), side, 4), w2 = add(add(tip, dir, -5), side, -4);
    return `<path d="M${f(tail)} L${f(tip)} M${f(w1)} L${f(tip)} L${f(w2)}"/>`;
  };

  const CYCLE = 12; // hipopresivo: 2 s inspira · 4 s espira · 5 s apnea · 1 s relaja
  const KT = '0;0.1667;0.5;0.58;0.9167;1';
  const KEGEL = 8;  // Kegel: 4 s contrae · 4 s relaja

  function svg(id, opts = {}) {
    const p = POSES[id] || POSES.venus, anim = !!opts.anim;
    const shape = (b, r) => torso(p.S, p.P, b, r);
    const neutral = shape(15, 0), inhale = shape(17, 2), exhaled = shape(13, 0), vacuum = shape(5, 4);
    const pts = Object.keys(p).filter(k => Array.isArray(p[k])).map(k => p[k]);
    let vb = '0 0 200 200';
    if (opts.mini) { // encuadre ajustado a la figura para las miniaturas
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      const x0 = Math.min(...xs) - 16, x1 = Math.max(...xs) + 16, y0 = Math.min(...ys) - 16, y1 = Math.max(...ys) + 8;
      const s = Math.max(x1 - x0, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      vb = `${(cx - s / 2).toFixed(1)} ${(cy - s / 2).toFixed(1)} ${s.toFixed(1)} ${s.toFixed(1)}`;
    }
    const dur = p.kegel ? KEGEL : CYCLE;
    const label = (txt, kt, vals) => `<text x="100" y="20" text-anchor="middle" class="hyp-lbl" opacity="0">${txt}<animate attributeName="opacity" dur="${dur}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${kt}" values="${vals}"/></text>`;
    const bar = `<rect x="20" y="193" width="160" height="3" rx="1.5" class="hyp-track"/><rect x="20" y="193" width="0" height="3" rx="1.5" class="hyp-prog"><animate attributeName="width" dur="${dur}s" repeatCount="indefinite" values="0;160"/></rect>`;

    let body, extra = '';
    if (p.kegel) {
      // Kegel: el tronco no cambia; se marca el suelo pélvico, que se contrae y "sube" hacia dentro
      const { u, n } = neutral, pf = add(add(p.P, u, 5), n, 2);
      body = `<path class="hyp-body" d="${neutral.d}"/>`;
      extra = `<circle class="hyp-pf" cx="${pf[0].toFixed(1)}" cy="${pf[1].toFixed(1)}" r="${anim ? 5 : 7}">${anim ? `<animate attributeName="r" dur="${KEGEL}s" repeatCount="indefinite" keyTimes="0;0.12;0.5;0.62;1" values="5;8;8;5;5"/>` : ''}</circle>`;
      if (anim) {
        const tail = add(pf, u, -6), tip = add(pf, u, -20);
        extra += `<g class="hyp-arrows" opacity="0">${arrow(tail, tip, [-u[0], -u[1]], n)}<animate attributeName="opacity" dur="${KEGEL}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5" values="1;0"/></g>` +
          label('1 · Contrae y eleva (4 s)', '0;0.5', '1;0') + label('2 · Relaja del todo (4 s)', '0;0.5', '0;1') + bar;
      }
    } else {
      const still = anim ? neutral : vacuum;
      const animD = which => anim ? `<animate attributeName="d" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${KT}" values="${[neutral, inhale, exhaled, vacuum, vacuum, neutral].map(s => s[which]).join(';')}"/>` : '';
      body = `<path class="hyp-body" d="${still.d}">${animD('d')}</path><path class="hyp-belly" d="${still.belly}">${animD('belly')}</path>`;
      if (anim) {
        // Flechas hacia dentro durante la apnea (la barriga se mete "hacia dentro y hacia arriba")
        const { n, u } = vacuum, base = lerp(p.S, p.P, 0.66), mn = [-n[0], -n[1]];
        const one = off => { const tip = add(add(base, u, off), n, 13); return arrow(add(tip, n, 11), tip, mn, u); };
        extra = `<g class="hyp-arrows" opacity="0">${one(-7)}${one(7)}<animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5;0.9167" values="0;1;0"/></g>` +
          label('1 · Inspira por la nariz', '0;0.1667', '1;0') + label('2 · Espira por la boca', '0;0.1667;0.5', '0;1;0') +
          label('3 · Apnea: abre costillas', '0;0.5;0.9167', '0;1;0') + label('Respira suave', '0;0.9167', '0;1') + bar;
      }
    }
    // Brazo: delante del cuerpo, o detrás cuando taparía la barriga (de pie con los brazos abajo)
    const arm = `${line([p.S, p.E, p.W], 8, 'hyp-limb hyp-arm')}<circle cx="${p.W[0]}" cy="${p.W[1]}" r="4.5" class="hyp-head"/>`;
    const farLeg = p.K2 ? `${line([p.P, p.K2, p.A2], 12, 'hyp-limb hyp-far')}${line([p.A2, p.T2], 7, 'hyp-limb hyp-far')}` : '';
    return `<svg class="hyp-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${p.mat ? '<rect x="4" y="180" width="192" height="5" rx="2.5" class="hyp-mat"/>' : '<line x1="14" y1="181" x2="186" y2="181" class="hyp-floor"/>'}
      ${farLeg}${p.armBack ? arm : ''}
      ${line([p.P, p.K, p.A], 12, 'hyp-limb')}${line([p.A, p.T], 7, 'hyp-limb')}
      <line x1="${p.S[0]}" y1="${p.S[1]}" x2="${p.H[0]}" y2="${p.H[1]}" stroke-width="9" class="hyp-limb"/>
      ${body}
      <circle cx="${p.H[0]}" cy="${p.H[1]}" r="11.5" class="hyp-head"/>
      ${p.armBack ? '' : arm}
      ${extra}</svg>`;
  }

  // ---------- Ejercicios ----------
  const STEPS_END = 'Haz 3 respiraciones (inspira 2 s, espira 4 s) y, tras la última espiración, mantén la apnea abriendo las costillas. Repite la postura 3 veces.';
  const SWITCH = 'Haz una serie con cada lado: en la siguiente, cambia de pierna (o de lado).';
  const MID = 'Nivel intermedio: hazla cuando ya domines las posturas básicas.';
  const EX = [
    { i: 'hyp_learn', pose: 'learn', n: 'Hipopresivo: aprender la apnea (tumbada)', en: 'Hypopressive breathing · learning (lying)', yt: 'aprender respiración hipopresiva apnea apertura costal',
      x: ['Túmbate boca arriba con las rodillas flexionadas y los pies apoyados, separados al ancho de las caderas.', 'Apoya las manos sobre las costillas bajas para notar cómo se abren hacia los lados.', 'Inspira por la nariz llevando el aire a las costillas (no a la tripa) y espira lento por la boca, como si empañaras un cristal.', 'Tras la última espiración, no cojas aire: cierra la garganta y abre las costillas como si fueras a inspirar. Notarás que la tripa se mete hacia dentro y hacia arriba.', 'Es el ejercicio para aprender la técnica: empieza con apneas de 5-10 segundos.'] },
    { i: 'hyp_venus', pose: 'venus', n: 'Hipopresivo de pie, brazos abajo (Venus)', en: 'Hypopressive · Venus pose (standing)', yt: 'hipopresivos postura Venus',
      x: ['De pie, con los pies paralelos al ancho de las caderas y las rodillas un poco flexionadas.', 'Crece hacia arriba como si un hilo tirara de tu cabeza, mete un poco la barbilla y lleva el peso del cuerpo ligeramente hacia delante.', 'Brazos a los lados, a la altura de las caderas, con los codos un poco doblados y las muñecas flexionadas hacia arriba (dedos hacia dentro). Empuja suavemente las manos hacia el suelo.', STEPS_END] },
    { i: 'hyp_atenea', pose: 'atenea', n: 'Hipopresivo de pie, brazos al frente (Atenea)', en: 'Hypopressive · Athena pose (standing)', yt: 'hipopresivos postura Atenea',
      x: ['Misma base que Venus: pies al ancho de las caderas, rodillas un poco flexionadas y espalda larga.', 'Sube los brazos por delante hasta la altura del pecho, con los codos ligeramente doblados y las yemas de los dedos enfrentadas.', 'Empuja suavemente con los codos hacia fuera, como si abrazaras un balón grande, sin subir los hombros.', STEPS_END] },
    { i: 'hyp_artemisa', pose: 'artemisa', n: 'Hipopresivo inclinada, manos en muslos (Artemisa)', en: 'Hypopressive · Artemis pose (inclined)', yt: 'hipopresivos postura Artemisa',
      x: ['De pie, flexiona las rodillas e inclina el tronco hacia delante con la espalda recta, llevando la cadera atrás.', 'Apoya las manos sobre la parte alta de los muslos, con los dedos hacia dentro y los codos un poco abiertos.', 'Mantén la cabeza alineada con la espalda (mirada al suelo, un poco por delante de los pies) y empuja suavemente los muslos con las manos.', STEPS_END] },
    { i: 'hyp_aura', pose: 'aura', n: 'Hipopresivo de rodillas (Aura)', en: 'Hypopressive · Aura pose (kneeling)', yt: 'hipopresivos postura de rodillas',
      x: ['De rodillas sobre una esterilla, con las rodillas al ancho de las caderas y la espalda recta.', 'Crece hacia arriba desde la coronilla y lleva el peso un poco hacia delante, sin arquear la zona lumbar.', 'Brazos por delante a la altura de los hombros, con codos y muñecas ligeramente flexionados.', STEPS_END] },
    { i: 'hyp_hestia', pose: 'hestia', n: 'Hipopresivo sentada (Hestia)', en: 'Hypopressive · Hestia pose (seated)', yt: 'hipopresivos postura sentada',
      x: ['Siéntate con las piernas cruzadas, apoyada sobre los isquiones (los huesos de apoyo del culete).', 'Espalda larga, barbilla un poco metida y hombros lejos de las orejas.', 'Apoya las manos sobre los muslos, cerca de las rodillas, con los codos un poco abiertos y empujando suavemente hacia abajo.', STEPS_END] },
    { i: 'hyp_hestia_legs', pose: 'hestiaLegs', n: 'Hipopresivo sentada, piernas estiradas', en: 'Hypopressive · seated, legs extended', yt: 'hipopresivos sentada piernas estiradas',
      x: ['Variante de Hestia para quien no está cómoda con las piernas cruzadas.', 'Siéntate con las piernas estiradas al frente, un poco separadas, y las puntas de los pies hacia arriba. Si la espalda se te redondea, flexiona un poco las rodillas.', 'Espalda larga y manos apoyadas sobre los muslos, cerca de las caderas, empujando suavemente hacia abajo.', STEPS_END] },
    { i: 'hyp_gaia', pose: 'gaia', n: 'Hipopresivo a cuatro patas sobre las manos (Gaia)', en: 'Hypopressive · Gaia pose (quadruped)', yt: 'hipopresivos postura Gaia cuadrupedia',
      x: ['Colócate a cuatro patas con las manos debajo de los hombros y las rodillas debajo de las caderas, apoyando las puntas de los pies.', 'Codos un poco flexionados y apuntando hacia atrás; empuja el suelo con las manos para separar las escápulas.', 'Espalda larga desde la cabeza hasta el coxis y mirada al suelo, sin dejar caer la zona lumbar.', STEPS_END] },
    { i: 'hyp_maya', pose: 'maya', n: 'Hipopresivo a cuatro patas sobre antebrazos (Maya)', en: 'Hypopressive · Maya pose (quadruped)', yt: 'hipopresivos postura Maya cuadrupedia',
      x: ['Colócate a cuatro patas con las rodillas debajo de las caderas y apoyándote en las puntas de los pies.', 'Apoya los antebrazos en el suelo con los codos debajo de los hombros.', 'Alarga la espalda desde la cabeza hasta el coxis, sin dejar caer la zona lumbar, y empuja el suelo con los antebrazos.', STEPS_END] },
    { i: 'hyp_freya', pose: 'freya', n: 'Hipopresivo con pierna adelantada (Freya)', en: 'Hypopressive · Freya pose (split stance)', yt: 'hipopresivos postura Freya',
      x: [MID, 'De pie, adelanta una pierna con la rodilla flexionada y deja la de atrás estirada, apoyada en la punta del pie.', 'Inclina el tronco hacia delante en línea con la pierna de atrás, con la espalda recta.', 'Brazos estirados por encima de la cabeza, en la prolongación del tronco, sin subir los hombros hacia las orejas.', STEPS_END, SWITCH] },
    { i: 'hyp_persefone', pose: 'persefone', n: 'Hipopresivo en zancada (Perséfone)', en: 'Hypopressive · Persephone pose (lunge)', yt: 'hipopresivos postura Persefone',
      x: [MID + ' Es la postura de pie más exigente.', 'Desde de pie, da un paso largo hacia delante y flexiona las dos rodillas; la de atrás queda doblada, apoyada en la punta del pie y sin llegar al suelo.', 'Cadera recta y mirando al frente, tronco erguido creciendo hacia arriba.', 'Brazos por delante a la altura del pecho, como en Atenea.', STEPS_END, SWITCH] },
    { i: 'hyp_supine', pose: 'supine', n: 'Hipopresivo tumbada, rodillas flexionadas', en: 'Hypopressive · lying, knees bent', yt: 'hipopresivos tumbada boca arriba',
      x: ['Túmbate boca arriba con las rodillas flexionadas, los talones apoyados y las puntas de los pies hacia arriba.', 'Mete un poco la barbilla para alargar la nuca y aleja los hombros de las orejas.', 'Brazos estirados junto al cuerpo con las palmas hacia arriba, empujando suavemente con los hombros hacia el suelo.', STEPS_END] },
    { i: 'hyp_bridge', pose: 'bridge', n: 'Hipopresivo en puente suave (tumbada)', en: 'Hypopressive · gentle bridge (lying)', yt: 'hipopresivos puente tumbada',
      x: ['Túmbate boca arriba con las rodillas flexionadas y los pies apoyados al ancho de las caderas, brazos estirados junto al cuerpo.', 'Eleva un poco la cadera del suelo, solo unos centímetros, sin arquear la zona lumbar.', 'Mantén la cadera arriba durante la apnea y bájala despacio cuando vuelvas a respirar.', STEPS_END] },
    { i: 'hyp_overhead', pose: 'overhead', n: 'Hipopresivo tumbada, brazos por encima de la cabeza', en: 'Hypopressive · lying, arms overhead', yt: 'hipopresivos tumbada brazos arriba',
      x: ['Túmbate boca arriba con las piernas casi estiradas (rodillas un poco flexionadas) y las puntas de los pies hacia arriba.', 'Lleva los brazos estirados por encima de la cabeza, apoyados en el suelo si llegas sin arquear la espalda.', 'Mantén la nuca larga y la zona lumbar tranquila; si se arquea, flexiona un poco más las rodillas.', STEPS_END] },
    { i: 'hyp_selene', pose: 'selene', n: 'Hipopresivo tumbada de lado (Selene)', en: 'Hypopressive · Selene pose (side lying)', yt: 'hipopresivos postura Selene tumbada de lado',
      x: [MID, 'Túmbate de lado con el brazo de abajo estirado por encima de la cabeza y la cabeza apoyada en él.', 'Piernas estiradas una encima de la otra (o con las rodillas un poco flexionadas si te cuesta mantener el equilibrio).', 'Hombros y cadera en línea, sin dejarte caer hacia delante ni hacia atrás; el brazo de arriba apoyado sobre el costado.', STEPS_END, SWITCH] },
    { i: 'hyp_kegel', pose: 'kegel', kegel: true, k: 'bw', t: ['pelvic floor'], s: [], n: 'Suelo pélvico: ejercicios de Kegel', en: 'Kegel exercises (pelvic floor)', yt: 'ejercicios de Kegel suelo pélvico cómo hacerlos',
      x: ['Túmbate boca arriba con las rodillas flexionadas (con práctica, también sentada o de pie).', 'Localiza la musculatura: es la que usarías para cortar el pis o retener un gas. Úsalo solo para identificarla; no lo hagas mientras orinas.', 'Contrae y eleva el suelo pélvico hacia dentro y hacia arriba durante 3-5 segundos, sin apretar glúteos, muslos ni tripa.', 'Relaja del todo durante el mismo tiempo. Respira con normalidad: no aguantes el aire.', 'Haz 10 repeticiones por serie y apunta las repeticiones en REPS.'] }
  ];
  EX.forEach(e => {
    window.EXERCISE_DB.push(Object.assign({ b: ['hypopressive'], q: ['body weight'], t: ['transverse abdominis', 'pelvic floor'], s: ['obliques', 'lower back'], k: 'time', es: true, hyp: true }, e));
  });

  // Fichas comunes: técnica y precauciones (se muestran en el detalle de cada ejercicio)
  const HYP_INFO = `<h2 class="section">Técnica (en todas las posturas)</h2>
    <ol class="steps">
      <li>Colócate en la postura y crece hacia arriba (como si un hilo tirara de tu cabeza), con la barbilla un poco metida y los hombros lejos de las orejas.</li>
      <li>Inspira por la nariz en 2 segundos abriendo las costillas hacia los lados.</li>
      <li>Espira por la boca en 4 segundos, despacio. Repite 3 respiraciones.</li>
      <li>Tras la última espiración, sin coger aire, cierra la garganta y abre las costillas como si fueras a inspirar: la tripa se mete hacia dentro y hacia arriba.</li>
      <li>Mantén la apnea 10-15 segundos al principio (20-25 con práctica) y vuelve a respirar suave.</li>
      <li><span>En cada serie apunta en la columna <b>SEG</b> los segundos que has aguantado la apnea.</span></li>
    </ol>
    <div class="card hyp-warn"><b>⚠️ Precauciones</b>
      <p>No los hagas si tienes la tensión alta sin controlar, problemas de corazón o respiratorios importantes, ni durante el embarazo. Después de un parto o de una operación abdominal, espera a que te lo autorice tu médico o fisioterapeuta.</p>
      <p>Hazlos con el estómago vacío (2-3 horas después de comer). Si te mareas, para y respira con normalidad. Lo ideal es aprender la técnica con un fisioterapeuta especializado en suelo pélvico.</p></div>`;
  const KEGEL_INFO = `<div class="card hyp-warn"><b>💡 Consejos</b>
      <p>Al principio cuesta notar el músculo: es normal. Con unas semanas de práctica (3 series al día) se nota la mejora.</p>
      <p>Si al hacerlos sientes dolor, notas que los escapes empeoran o no consigues identificar la musculatura, consulta con un fisioterapeuta especializado en suelo pélvico.</p></div>`;
  const info = ex => ex.kegel ? KEGEL_INFO : HYP_INFO;

  window.HYPO = { svg, info, ids: EX.map(e => e.i) };
})();
