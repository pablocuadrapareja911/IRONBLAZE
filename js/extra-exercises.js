// Ejercicios que no están en ExerciseDB (hip thrust, patadas de glúteo, unilaterales…).
// No tienen animación: se muestran con las fotos HD de inicio/fin de free-exercise-db (Unlicense).
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
    return `<svg class="hyp-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="14" y1="181" x2="186" y2="181" class="hyp-floor"/>
      <rect x="20" y="30" width="16" height="150" rx="3" class="hyp-machine"/><circle cx="30" cy="172" r="6" class="hyp-pulley"/>
      ${cable}
      <polyline class="hyp-limb" stroke-width="12" points="100 112 98 146 97 178"/><polyline class="hyp-limb" stroke-width="7" points="97 178 89 180"/>
      ${leg}${ankle}
      <path class="hyp-body" d="M90 60 Q110 53 130 60 L124 116 Q110 121 96 116 Z"/>
      <line x1="110" y1="58" x2="110" y2="44" stroke-width="9" class="hyp-limb"/><circle cx="110" cy="36" r="11.5" class="hyp-head"/>
      <polyline class="hyp-limb" stroke-width="8" points="93 66 70 86 40 96"/><polyline class="hyp-limb" stroke-width="8" points="127 66 141 90 125 108"/>
      ${lbl}</svg>`;
  }
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
    { i: 'fx_ab_roller', f: 'Ab_Roller', k: 'bw', n: 'Rueda abdominal', en: 'ab wheel rollout', b: ['waist'], q: ['wheel roller'], t: ['abs'], s: ['shoulders', 'lower back'],
      x: ['Arrodíllate y apoya la rueda en el suelo delante de ti, sujetándola con ambas manos.', 'Con el abdomen firme y la pelvis metida, rueda hacia delante despacio hasta donde puedas sin hundir la zona lumbar.', 'Vuelve tirando con el abdomen hasta la posición inicial.', 'Empieza con poco recorrido y aumenta poco a poco.'] },
    { i: 'fx_woodchop', f: 'Standing_Cable_Wood_Chop', n: 'Leñador en polea', en: 'cable wood chop', b: ['waist'], q: ['cable'], t: ['abs'], s: ['obliques', 'shoulders'],
      x: ['Pon la polea en la posición más alta y colócate de lado a la máquina, a un brazo de distancia.', 'Agarra el asa con ambas manos por encima del hombro más cercano a la polea.', 'Gira el tronco y tira en diagonal hacia la cadera contraria, con los brazos casi estirados.', 'Vuelve controlando y repite. Después, cambia de lado.'] },
    { i: 'fx_superman', f: 'Superman', n: 'Superman', en: 'superman', b: ['back'], q: ['body weight'], t: ['spine'], s: ['glutes', 'hamstrings'],
      x: ['Túmbate boca abajo con los brazos estirados por delante.', 'Eleva a la vez brazos, pecho y piernas del suelo.', 'Mantén arriba 2 segundos apretando glúteos y lumbares, con el cuello alineado.', 'Baja despacio y repite.'] },
    // ---------------- TREN SUPERIOR ----------------
    { i: 'fx_pull_apart', f: 'Band_Pull_Apart', n: 'Aperturas con banda (pull apart)', en: 'band pull apart', b: ['shoulders'], q: ['band'], t: ['delts'], s: ['upper back', 'traps'],
      x: ['Sujeta la banda con ambas manos y los brazos estirados delante del pecho.', 'Abre los brazos hacia los lados, con los codos estirados, hasta que la banda toque el pecho.', 'Junta las escápulas al final del movimiento.', 'Vuelve despacio y repite.'] },
    { i: 'fx_spider_curl', f: 'Spider_Curl', n: 'Curl araña con barra Z', en: 'ez bar spider curl', b: ['upper arms'], q: ['ez barbell'], t: ['biceps'], s: [],
      x: ['Túmbate boca abajo sobre la parte inclinada del banco Scott (o un banco inclinado) con los brazos colgando.', 'Agarra la barra Z con las palmas hacia arriba.', 'Sube la barra flexionando los codos sin moverlos y aprieta el bíceps arriba.', 'Baja despacio hasta estirar los brazos y repite.'] }
  ];
  // ph = solo fotos, sin animación (la primera foto hace de miniatura)
  EX.forEach(({ f, ...e }) => {
    if (f) window.HD_IMAGES[e.i] = [f + '/0.jpg', f + '/1.jpg'];
    window.EXERCISE_DB.push({ es: true, esn: true, ph: !!f, ...e });
  });
})();
