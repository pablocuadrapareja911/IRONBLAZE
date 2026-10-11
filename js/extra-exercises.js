// Ejercicios que no están en ExerciseDB (hip thrust, patadas de glúteo, unilaterales…).
// Se muestran con las fotos HD de inicio/fin de free-exercise-db (Unlicense) o, si no hay fotos libres, con un dibujo animado propio.
(function () {
  // Dibujo animado (vista de frente) de la patada lateral en polea: no hay fotos ni animaciones libres de este ejercicio
  function cableSideKick(opts = {}) {
    const anim = !!opts.anim, dur = '3s', kt = '0;0.4;0.55;1';
    const rest = { K: [122, 146], A: [123, 178], T: [130, 180] }, out = { K: [140, 139], A: [160, 166], T: [168, 164] };
    const pose = anim ? rest : out, pts = q => `120 112 ${q.K} ${q.A}`;
    const leg = `<polyline class="hyp-limb" stroke-width="12" points="${pts(pose)}">${anim ? `<animate attributeName="points" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${[rest, out, out, rest].map(pts).join(';')}"/>` : ''}</polyline>`;
    const mv = (attr, a, b) => anim ? `<animate attributeName="${attr}" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${a};${b};${b};${a}"/>` : '';
    const ankle = `<circle r="5" class="hyp-cuff" cx="${pose.A[0]}" cy="${pose.A[1]}">${mv('cx', rest.A[0], out.A[0])}${mv('cy', rest.A[1], out.A[1])}</circle>`;
    const cable = `<line class="hyp-cable" x1="30" y1="172" x2="${pose.A[0]}" y2="${pose.A[1]}">${mv('x2', rest.A[0], out.A[0])}${mv('y2', rest.A[1], out.A[1])}</line>`;
    const lbl = anim ? '<text x="100" y="20" text-anchor="middle" class="hyp-lbl">Pierna hacia fuera, despacio</text>' : '';
    // Músculo que trabaja (glúteo medio) en naranja, como el rojo de las animaciones 3D
    const hi = `<polyline class="hyp-limb hyp-hi" stroke-width="12" points="120 112 ${pose.K}">${anim ? `<animate attributeName="points" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${[rest, out, out, rest].map(q => `120 112 ${q.K}`).join(';')}"/>` : ''}</polyline>`;
    return `<svg class="hyp-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="14" y1="181" x2="186" y2="181" class="hyp-floor"/>
      <rect x="20" y="30" width="16" height="150" rx="3" class="hyp-machine"/><circle cx="30" cy="172" r="6" class="hyp-pulley"/>
      ${cable}
      <polyline class="hyp-limb" stroke-width="12" points="100 112 98 146 97 178"/><polyline class="hyp-limb" stroke-width="7" points="97 178 89 180"/>
      ${leg}${hi}${ankle}<circle cx="121" cy="110" r="8" class="hyp-hi-f"/>
      <path class="hyp-body" d="M90 60 Q110 53 130 60 L124 116 Q110 121 96 116 Z"/>
      <line x1="110" y1="58" x2="110" y2="44" stroke-width="9" class="hyp-limb"/><circle cx="110" cy="36" r="11.5" class="hyp-head"/>
      <polyline class="hyp-limb" stroke-width="8" points="93 66 70 86 40 96"/><polyline class="hyp-limb" stroke-width="8" points="127 66 141 90 125 108"/>
      ${lbl}</svg>`;
  }
  // Dibujo animado genérico: dos posturas (a → b → a) con articulaciones con nombre (lienzo 200×200, suelo en y=180).
  // parts = [[articulaciones], grosor, clase]: una sola articulación es un círculo (cabeza o músculo resaltado).
  // La miniatura enseña la postura final (b), que es la que identifica el ejercicio.
  const KT = '0;0.4;0.6;1';
  const MAT = '<rect x="4" y="180" width="192" height="5" rx="2.5" class="hyp-mat"/>';
  const FLOOR = '<line x1="14" y1="181" x2="186" y2="181" class="hyp-floor"/>';
  function fig({ a, b = null, parts, extra = FLOOR, label = '', dur = 3 }) {
    return (opts = {}) => {
      const anim = !!opts.anim && !!b, show = b && !opts.anim ? b : a, seq = b ? [a, b, b, a] : [a, a, a, a];
      const loop = (attr, vals) => anim ? `<animate attributeName="${attr}" dur="${dur}s" repeatCount="indefinite" keyTimes="${KT}" values="${vals.join(';')}"/>` : '';
      const pts = (p, ks) => ks.map(k => p[k].join(' ')).join(' ');
      const body = parts.map(([ks, w, cls = '']) => ks.length === 1
        ? `<circle class="${cls || 'hyp-head'}" r="${w}" cx="${show[ks[0]][0]}" cy="${show[ks[0]][1]}">${loop('cx', seq.map(p => p[ks[0]][0]))}${loop('cy', seq.map(p => p[ks[0]][1]))}</circle>`
        : `<polyline class="hyp-limb ${cls}" stroke-width="${w}" points="${pts(show, ks)}">${loop('points', seq.map(p => pts(p, ks)))}</polyline>`).join('');
      const lbl = opts.anim && label ? `<text x="100" y="20" text-anchor="middle" class="hyp-lbl">${label}</text>` : '';
      return `<svg class="hyp-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${extra}${body}${lbl}</svg>`;
    };
  }
  // Partes de una figura de perfil (de la más lejana a la más cercana)
  const FAR = [[['S', 'E2', 'W2'], 8, 'hyp-far'], [['P', 'K2', 'A2', 'T2'], 11, 'hyp-far']];
  const NEAR = [[['S', 'P'], 22], [['S', 'H'], 9], [['H'], 11.5], [['P', 'K', 'A', 'T'], 12], [['S', 'E', 'W'], 8]];
  const HI_THIGH = [['P', 'K'], 12, 'hyp-hi'], HI_GLUTE = [['P'], 9, 'hyp-hi-f'];
  const quad = { H: [50, 94], S: [70, 106], P: [130, 108], E: [70, 142], W: [70, 176], E2: [74, 142], W2: [74, 176], K: [132, 176], A: [166, 178], T: [172, 172], K2: [128, 176], A2: [162, 178], T2: [168, 172] };
  const ART = {
    birdDog: fig({ a: quad, b: { ...quad, E: [46, 100], W: [20, 96], K2: [160, 104], A2: [192, 100], T2: [197, 92] }, parts: [...FAR, ...NEAR, [['P', 'K2'], 11, 'hyp-hi']], label: 'Brazo y pierna contraria, sin girar' }),
    clamshell: fig({
      a: { H: [34, 158], S: [56, 164], P: [116, 164], E: [72, 148], W: [100, 158], E2: [38, 176], W2: [16, 170], K: [146, 168], A: [172, 172], T: [178, 166], K2: [146, 174], A2: [172, 177], T2: [178, 171] },
      b: { H: [34, 158], S: [56, 164], P: [116, 164], E: [72, 148], W: [100, 158], E2: [38, 176], W2: [16, 170], K: [140, 130], A: [172, 170], T: [178, 164], K2: [146, 174], A2: [172, 177], T2: [178, 171] },
      parts: [...FAR, ...NEAR, HI_THIGH, HI_GLUTE], extra: MAT, label: 'Abre la rodilla, pies juntos'
    }),
    hollow: fig({
      a: { H: [30, 168], S: [52, 170], P: [112, 170], E: [32, 174], W: [12, 174], K: [146, 172], A: [180, 173], T: [186, 165] },
      b: { H: [36, 150], S: [58, 156], P: [112, 168], E: [36, 148], W: [14, 140], K: [146, 160], A: [180, 148], T: [186, 141] },
      parts: [...NEAR, [['S', 'P'], 8, 'hyp-hi']], extra: MAT, label: 'Lumbar pegada al suelo y aguanta', dur: 4
    }),
    frogPump: fig({
      a: { H: [38, 166], S: [58, 168], P: [112, 170], E: [80, 176], W: [102, 177], K: [134, 150], A: [124, 176], T: [112, 178] },
      b: { H: [38, 166], S: [58, 168], P: [112, 146], E: [80, 176], W: [102, 177], K: [138, 142], A: [124, 176], T: [112, 178] },
      parts: [...NEAR, HI_GLUTE], extra: MAT, label: 'Plantas juntas: sube la cadera', dur: 2.5
    }),
    wallSit: fig({
      a: { H: [62, 40], S: [58, 64], P: [62, 120], K: [114, 120], A: [114, 176], T: [128, 178], E: [82, 92], W: [104, 110] },
      parts: [...NEAR, HI_THIGH], extra: FLOOR + '<rect x="28" y="16" width="12" height="164" class="hyp-machine"/>', label: 'Aguanta: muslos paralelos al suelo'
    }),
    // Vista de espaldas: la rodilla sale hacia el lado
    fireHydrant: fig({
      a: { H: [100, 82], Sl: [82, 98], Wl: [82, 176], Sr: [118, 98], Wr: [118, 176], Bl: [86, 104], Br: [114, 104], Hl: [89, 118], Hr: [111, 118], Kl: [87, 176], Fl: [86, 190], Kr: [113, 176], Fr: [114, 190] },
      b: { H: [100, 82], Sl: [82, 98], Wl: [82, 176], Sr: [118, 98], Wr: [118, 176], Bl: [86, 104], Br: [114, 104], Hl: [89, 118], Hr: [111, 118], Kl: [87, 176], Fl: [86, 190], Kr: [160, 132], Fr: [166, 146] },
      parts: [[['Sl', 'Wl'], 9], [['Sr', 'Wr'], 9], [['Bl', 'Br'], 30], [['Hl', 'Hr'], 26], [['Hl', 'Kl', 'Fl'], 13], [['Hr', 'Kr', 'Fr'], 13], [['Hr', 'Kr'], 13, 'hyp-hi'], [['H'], 11.5]],
      label: 'Rodilla hacia el lado, espalda quieta'
    })
  };
  const EX = [
    // ---------------- GLÚTEO ----------------
    { i: 'fx_hip_thrust', f: 'Barbell_Hip_Thrust', n: 'Hip thrust con barra', en: 'barbell hip thrust', b: ['upper legs'], q: ['barbell'], t: ['glutes'], s: ['hamstrings', 'quadriceps', 'core'],
      x: ['Siéntate en el suelo con la parte alta de la espalda (bajo los omóplatos) apoyada en el borde de un banco.', 'Rueda la barra hasta la cadera; usa una almohadilla o una toalla para que no moleste.', 'Apoya los pies al ancho de las caderas, de forma que en la parte alta las rodillas queden a 90°.', 'Empuja con los talones y sube la cadera hasta que el tronco quede en línea con los muslos, apretando fuerte el glúteo.', 'Mantén la barbilla un poco metida y las costillas abajo: no arquees la zona lumbar.', 'Baja controlando hasta casi tocar el suelo y repite.'] },
    { i: 'fx_ball_thrust', f: 'Physioball_Hip_Bridge', n: 'Hip thrust sobre fitball', en: 'stability ball hip thrust', b: ['upper legs'], q: ['stability ball'], t: ['glutes'], s: ['hamstrings', 'core'],
      x: ['Apoya la parte alta de la espalda sobre el fitball con la cadera en el aire y los pies en el suelo, al ancho de las caderas.', 'Sube la cadera empujando con los talones hasta que tronco y muslos queden en línea.', 'Aprieta el glúteo 1-2 segundos arriba sin arquear la zona lumbar.', 'Baja despacio sin perder el apoyo del balón y repite.'] },
    { i: 'fx_glute_bridge', f: 'Butt_Lift_Bridge', n: 'Puente de glúteo', en: 'glute bridge (butt lift)', b: ['upper legs'], q: ['body weight'], t: ['glutes'], s: ['hamstrings', 'core'],
      x: ['Túmbate boca arriba con las rodillas flexionadas, los pies apoyados al ancho de los hombros y los brazos junto al cuerpo.', 'Empuja con los talones y eleva la cadera hasta formar una línea recta de hombros a rodillas.', 'Aprieta el glúteo arriba 1-2 segundos.', 'Baja despacio sin llegar a relajarte del todo y repite.'] },
    { i: 'fx_sl_bridge', f: 'Single_Leg_Glute_Bridge', n: 'Puente de glúteo a una pierna', en: 'single leg glute bridge', b: ['upper legs'], q: ['body weight'], t: ['glutes'], s: ['hamstrings', 'core'],
      x: ['Túmbate boca arriba con las rodillas flexionadas y los pies apoyados.', 'Levanta una pierna y llévala hacia el pecho (o estírala).', 'Empuja con el talón de la pierna apoyada y sube la cadera sin que se incline hacia un lado.', 'Aprieta el glúteo arriba, baja despacio y, al terminar las repeticiones, cambia de pierna.'] },
    { i: 'fx_cable_kick', f: 'One-Legged_Cable_Kickback', n: 'Patada de glúteo trasera en polea', en: 'cable glute kickback', b: ['upper legs'], q: ['cable'], t: ['glutes'], s: ['hamstrings'],
      x: ['Coloca la tobillera en la polea baja y engánchala a un tobillo.', 'Ponte de cara a la máquina, a unos 60 cm, y agárrate al soporte con el tronco algo inclinado hacia delante.', 'Con el abdomen firme y la rodilla casi estirada, lleva la pierna hacia atrás y arriba apretando el glúteo.', 'No arquees la zona lumbar ni gires la cadera: el movimiento sale de la cadera, no de la espalda.', 'Vuelve despacio hasta delante y repite. Después, cambia de pierna.'] },
    { i: 'fx_glute_kick', f: 'Glute_Kickback', n: 'Patada de glúteo en cuadrupedia', en: 'glute kickback (quadruped donkey kick)', b: ['upper legs'], q: ['body weight'], t: ['glutes'], s: ['hamstrings'],
      x: ['Colócate a cuatro patas con las manos bajo los hombros y las rodillas bajo la cadera.', 'Con la rodilla doblada a 90°, empuja el talón hacia el techo hasta que el muslo quede en línea con el tronco.', 'Aprieta el glúteo arriba sin arquear la espalda ni girar la cadera.', 'Baja controlando y repite. Para hacerlo más difícil, usa tobillera lastrada o una banda.'] },
    { i: 'fx_rear_kick', f: 'Leg_Lift', n: 'Patada trasera de pie', en: 'standing rear leg lift (glute kickback)', b: ['upper legs'], q: ['body weight'], t: ['glutes'], s: ['hamstrings'],
      x: ['Ponte de pie y agárrate a un apoyo firme (una silla, la máquina o el rack).', 'Con o sin tobillera lastrada, lleva una pierna estirada hacia atrás todo lo que puedas sin inclinar el tronco.', 'Aprieta el glúteo al final del recorrido 1 segundo.', 'Vuelve despacio y repite. Después, cambia de pierna.'] },
    { i: 'fx_band_kick', f: 'Hip_Extension_with_Bands', n: 'Patada de glúteo con banda', en: 'band glute kickback (hip extension)', b: ['upper legs'], q: ['band'], t: ['glutes'], s: ['hamstrings'],
      x: ['Ata un extremo de la banda a un poste bajo y el otro al tobillo.', 'Ponte de cara al poste y agárrate para mantener el equilibrio, con el pecho arriba.', 'Lleva la pierna hacia atrás todo lo que puedas sin arquear la espalda.', 'Vuelve despacio a la posición inicial y repite. Después, cambia de pierna.'] },
    { i: 'fx_side_kick', f: 'Side_Leg_Raises', n: 'Patada lateral de glúteo de pie', en: 'standing side leg raise (lateral kick)', b: ['upper legs'], q: ['body weight'], t: ['abductors'], s: ['glutes'],
      x: ['Ponte de pie junto a una silla o un apoyo y agárrate con una mano.', 'Apoya el peso en la pierna más cercana al apoyo.', 'Con la otra pierna estirada y la punta del pie hacia delante, elévala hacia el lado todo lo que puedas sin inclinar el tronco.', 'Baja controlando y repite. Después, cambia de pierna.', 'Para más intensidad, hazlo con tobillera lastrada, con una banda o enganchada a la polea baja.'] },
    { i: 'fx_cable_side_kick', art: cableSideKick, n: 'Patada lateral de glúteo en polea', en: 'cable standing hip abduction (lateral kick)', b: ['upper legs'], q: ['cable'], t: ['abductors'], s: ['glutes'],
      x: ['Coloca la tobillera en la polea baja y engánchala al tobillo de la pierna más alejada de la máquina.', 'Ponte de lado a la máquina, a un paso de distancia, y agárrate a ella con la mano más cercana.', 'Con el tronco recto y la pierna casi estirada, llévala hacia fuera (alejándola de la máquina) todo lo que puedas sin inclinarte.', 'Aprieta el glúteo un segundo arriba y vuelve despacio, cruzando un poco por delante de la pierna de apoyo.', 'Termina las repeticiones y cambia de lado.'] },
    { i: 'fx_fire_hydrant', art: ART.fireHydrant, k: 'bw', n: 'Patada lateral de glúteo en cuadrupedia (fire hydrant)', en: 'fire hydrant', b: ['upper legs'], q: ['body weight'], t: ['abductors'], s: ['glutes'],
      x: ['Colócate a cuatro patas con las manos bajo los hombros y las rodillas bajo la cadera.', 'Sin mover la espalda, separa una rodilla hacia el lado manteniéndola doblada a 90°, hasta que el muslo quede casi a la altura de la cadera.', 'Aprieta el glúteo arriba un segundo y baja despacio.', 'Completa las repeticiones y cambia de lado. Para más intensidad, pon una banda por encima de las rodillas.'] },
    { i: 'fx_clamshell', art: ART.clamshell, k: 'bw', n: 'Almeja (clamshell)', en: 'clamshell', b: ['upper legs'], q: ['band'], t: ['abductors'], s: ['glutes'],
      x: ['Túmbate de lado con las caderas y las rodillas flexionadas (unos 45°) y la cabeza apoyada en el brazo de abajo.', 'Pon una banda elástica por encima de las rodillas (también se puede hacer sin banda).', 'Con los pies juntos, abre la rodilla de arriba todo lo que puedas sin girar la cadera hacia atrás.', 'Aguanta un segundo apretando el glúteo, cierra despacio, completa las repeticiones y cambia de lado.'] },
    { i: 'fx_frog_pump', art: ART.frogPump, k: 'bw', n: 'Frog pump (puente de glúteo en rana)', en: 'frog pump', b: ['upper legs'], q: ['body weight'], t: ['glutes'], s: ['adductors'],
      x: ['Túmbate boca arriba y junta las plantas de los pies, dejando que las rodillas se abran hacia los lados.', 'Acerca los pies a la cadera todo lo que puedas.', 'Empuja con el borde de los pies y sube la cadera apretando fuerte el glúteo.', 'Baja y repite a buen ritmo (suelen hacerse muchas repeticiones). Puedes poner una mancuerna sobre la cadera.'] },
    { i: 'fx_wall_sit', art: ART.wallSit, k: 'time', n: 'Sentadilla isométrica en pared', en: 'wall sit', b: ['upper legs'], q: ['body weight'], t: ['quads'], s: ['glutes', 'hamstrings'],
      x: ['Apoya la espalda en una pared y adelanta los pies unos 50 cm.', 'Desliza la espalda hacia abajo hasta que los muslos queden paralelos al suelo y las rodillas a 90°.', 'Mantén las rodillas por encima de los tobillos y la espalda pegada a la pared.', 'Aguanta el tiempo indicado y anótalo en SEG.'] },
    // ---------------- PIERNA ----------------
    { i: 'fx_leg_ext_1', f: 'Single-Leg_Leg_Extension', n: 'Extensión de cuádriceps unilateral', en: 'single leg extension', b: ['upper legs'], q: ['leverage machine'], t: ['quads'], s: [],
      x: ['Siéntate en la máquina con el eje de giro a la altura de la rodilla y el rodillo sobre la parte baja de la espinilla.', 'Coloca solo una pierna bajo el rodillo y agárrate a las asas.', 'Extiende la rodilla hasta estirar la pierna y aprieta el cuádriceps 1 segundo arriba.', 'Baja despacio sin dejar caer el peso y repite. Después, cambia de pierna.'] },
    { i: 'fx_leg_curl_1', f: 'Standing_Leg_Curl', n: 'Curl femoral de pie unilateral', en: 'standing single leg curl (machine)', b: ['upper legs'], q: ['leverage machine'], t: ['hamstrings'], s: ['calves'],
      x: ['Ajusta la máquina a tu altura y apoya el rodillo justo por encima del talón de una pierna.', 'Inclina un poco el tronco hacia delante y agárrate a las asas.', 'Flexiona la rodilla llevando el talón hacia el glúteo sin mover el muslo.', 'Baja despacio y repite. Después, cambia de pierna.'] },
    { i: 'fx_nordic', f: 'Natural_Glute_Ham_Raise', n: 'Curl nórdico', en: 'nordic hamstring curl', b: ['upper legs'], q: ['body weight'], t: ['hamstrings'], s: ['glutes', 'calves', 'lower back'],
      x: ['Ponte de rodillas sobre una superficie acolchada con los tobillos sujetos (bajo un rodillo o con un compañero).', 'Con el cuerpo recto de rodillas a cabeza, déjate caer hacia delante lo más despacio que puedas frenando con los isquiotibiales.', 'Cuando no puedas frenar más, apoya las manos en el suelo.', 'Empújate un poco con las manos y sube contrayendo los isquios. Es un ejercicio muy exigente: empieza con pocas repeticiones.'] },
    { i: 'fx_ghr', f: 'Glute_Ham_Raise', n: 'Glute ham raise (GHR)', en: 'glute ham raise', b: ['upper legs'], q: ['leverage machine'], t: ['hamstrings'], s: ['glutes', 'calves'],
      x: ['Colócate en la máquina con los tobillos bajo los rodillos y las rodillas justo detrás de la almohadilla.', 'Empieza con el tronco vertical y el cuerpo recto.', 'Baja hacia delante extendiendo las rodillas y manteniendo la cadera estirada.', 'Sube flexionando las rodillas con fuerza de isquios y glúteo hasta la vertical.'] },
    { i: 'fx_kb_sl_rdl', f: 'Kettlebell_One-Legged_Deadlift', n: 'Peso muerto a una pierna con kettlebell', en: 'kettlebell single leg deadlift', b: ['upper legs'], q: ['kettlebell'], t: ['hamstrings'], s: ['glutes', 'lower back'],
      x: ['Sujeta la kettlebell con una mano y apoya el peso en la pierna del mismo lado, con la rodilla un poco flexionada.', 'Inclínate desde la cadera llevando la pierna libre hacia atrás, con la espalda recta.', 'Baja hasta notar el estiramiento del isquio, con la cadera mirando al suelo.', 'Vuelve a subir apretando el glúteo y repite. Después, cambia de lado.'] },
    { i: 'fx_plie', f: 'Plie_Dumbbell_Squat', n: 'Sentadilla sumo con mancuerna', en: 'plie dumbbell squat (sumo)', b: ['upper legs'], q: ['dumbbell'], t: ['quads'], s: ['adductors', 'glutes', 'hamstrings'],
      x: ['Ponte de pie con los pies más abiertos que los hombros y las puntas hacia fuera.', 'Sujeta una mancuerna por un extremo con los brazos estirados entre las piernas.', 'Baja flexionando rodillas y cadera, con las rodillas en la dirección de las puntas y la espalda recta.', 'Sube empujando con los talones y apretando glúteos y aductores.'] },
    // ---------------- CORE ----------------
    { i: 'fx_ab_roller', f: 'Ab_Roller', k: 'bw', n: 'Rueda abdominal de rodillas', en: 'ab wheel rollout', b: ['waist'], q: ['wheel roller'], t: ['abs'], s: ['shoulders', 'lower back'],
      x: ['Arrodíllate y apoya la rueda en el suelo delante de ti, sujetándola con ambas manos.', 'Con el abdomen firme y la pelvis metida, rueda hacia delante despacio hasta donde puedas sin hundir la zona lumbar.', 'Vuelve tirando con el abdomen hasta la posición inicial.', 'Empieza con poco recorrido y aumenta poco a poco.'] },
    { i: 'fx_woodchop', f: 'Standing_Cable_Wood_Chop', n: 'Leñador en polea', en: 'cable wood chop', b: ['waist'], q: ['cable'], t: ['abs'], s: ['obliques', 'shoulders'],
      x: ['Pon la polea en la posición más alta y colócate de lado a la máquina, a un brazo de distancia.', 'Agarra el asa con ambas manos por encima del hombro más cercano a la polea.', 'Gira el tronco y tira en diagonal hacia la cadera contraria, con los brazos casi estirados.', 'Vuelve controlando y repite. Después, cambia de lado.'] },
    { i: 'fx_superman', f: 'Superman', n: 'Superman', en: 'superman', b: ['back'], q: ['body weight'], t: ['spine'], s: ['glutes', 'hamstrings'],
      x: ['Túmbate boca abajo con los brazos estirados por delante.', 'Eleva a la vez brazos, pecho y piernas del suelo.', 'Mantén arriba 2 segundos apretando glúteos y lumbares, con el cuello alineado.', 'Baja despacio y repite.'] },
    { i: 'fx_bird_dog', art: ART.birdDog, k: 'bw', n: 'Bird dog (pájaro-perro)', en: 'bird dog', b: ['waist'], q: ['body weight'], t: ['abs'], s: ['glutes', 'lower back'],
      x: ['Colócate a cuatro patas con las manos bajo los hombros y las rodillas bajo la cadera.', 'Estira a la vez un brazo hacia delante y la pierna contraria hacia atrás, hasta quedar en línea con el tronco.', 'No dejes que la cadera gire ni que la zona lumbar se hunda: imagina un vaso de agua en tu espalda.', 'Vuelve despacio y alterna de lado.'] },
    { i: 'fx_hollow', art: ART.hollow, k: 'time', n: 'Hollow body (cuerpo hueco)', en: 'hollow body hold', b: ['waist'], q: ['body weight'], t: ['abs'], s: ['hip flexors'],
      x: ['Túmbate boca arriba con los brazos estirados por encima de la cabeza.', 'Pega la zona lumbar al suelo y eleva a la vez hombros y piernas estiradas, formando una "banana".', 'Cuanto más bajas estén piernas y brazos, más difícil; si la lumbar se despega, sube las piernas o dobla las rodillas.', 'Aguanta el tiempo indicado y anótalo en SEG.'] },
    { i: 'fx_cat_cow', f: 'Cat_Stretch', k: 'time', n: 'Gato-camello (movilidad de espalda)', en: 'cat cow stretch', b: ['back'], q: ['body weight'], t: ['spine'], s: ['abs'],
      x: ['Colócate a cuatro patas con las manos bajo los hombros y las rodillas bajo la cadera.', 'Redondea la espalda hacia el techo metiendo la barbilla y el ombligo (gato), soltando el aire.', 'Después hunde suavemente la espalda y mira al frente (camello), tomando aire.', 'Alterna despacio durante el tiempo indicado.'] },
    { i: 'fx_child_pose', f: 'Childs_Pose', k: 'time', n: 'Postura del niño (estiramiento)', en: "child's pose", b: ['back'], q: ['body weight'], t: ['spine'], s: ['lats'],
      x: ['Arrodíllate y siéntate sobre los talones, con las rodillas un poco separadas.', 'Inclínate hacia delante y estira los brazos en el suelo, dejando caer la frente.', 'Respira despacio notando cómo se estira la espalda.', 'Aguanta el tiempo indicado.'] },
    // ---------------- CARDIO ----------------
    { i: 'fx_rower', f: 'Rowing_Stationary', n: 'Remo en máquina (ergómetro)', en: 'rowing machine (ergometer)', b: ['cardio'], q: ['rowing machine'], t: ['cardiovascular system'], s: ['lats', 'quadriceps', 'glutes'],
      x: ['Siéntate en la máquina, sujeta los pies con las cintas y agarra el maneral con los brazos estirados.', 'Empuja primero con las piernas, después inclina un poco el tronco hacia atrás y por último tira del maneral hasta la parte baja del pecho.', 'Vuelve en orden inverso: brazos, tronco y por último piernas.', 'Mantén un ritmo constante y anota la distancia y el tiempo.'] },
    // ---------------- TREN SUPERIOR ----------------
    { i: 'fx_pull_apart', f: 'Band_Pull_Apart', n: 'Aperturas con banda (pull apart)', en: 'band pull apart', b: ['shoulders'], q: ['band'], t: ['delts'], s: ['upper back', 'traps'],
      x: ['Sujeta la banda con ambas manos y los brazos estirados delante del pecho.', 'Abre los brazos hacia los lados, con los codos estirados, hasta que la banda toque el pecho.', 'Junta las escápulas al final del movimiento.', 'Vuelve despacio y repite.'] },
    { i: 'fx_spider_curl', f: 'Spider_Curl', n: 'Curl araña en banco Scott', en: 'ez bar spider curl', b: ['upper arms'], q: ['ez barbell'], t: ['biceps'], s: [],
      x: ['Túmbate boca abajo sobre la parte inclinada del banco Scott (o un banco inclinado) con los brazos colgando.', 'Agarra la barra Z con las palmas hacia arriba.', 'Sube la barra flexionando los codos sin moverlos y aprieta el bíceps arriba.', 'Baja despacio hasta estirar los brazos y repite.'] }
  ];
  // ph = solo fotos, sin animación (la primera foto hace de miniatura)
  EX.forEach(({ f, ...e }) => {
    if (f) window.HD_IMAGES[e.i] = [f + '/0.jpg', f + '/1.jpg'];
    window.EXERCISE_DB.push({ es: true, esn: true, ph: !!f, ...e });
  });
})();
