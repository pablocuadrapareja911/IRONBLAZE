// Traducciones de categorías de la base de datos (ExerciseDB está en inglés)
window.I18N = {
  bodyParts: {
    'back': 'Espalda', 'cardio': 'Cardio', 'chest': 'Pecho', 'lower arms': 'Antebrazos',
    'lower legs': 'Gemelos', 'neck': 'Cuello', 'shoulders': 'Hombros', 'upper arms': 'Brazos',
    'upper legs': 'Piernas', 'waist': 'Core', 'full body': 'Cuerpo completo', 'other': 'Otro'
  },
  equipment: {
    'assisted': 'Asistido', 'band': 'Banda', 'barbell': 'Barra', 'body weight': 'Peso corporal',
    'bosu ball': 'Bosu', 'cable': 'Polea', 'dumbbell': 'Mancuerna', 'elliptical machine': 'Elíptica',
    'ez barbell': 'Barra Z', 'hammer': 'Martillo', 'kettlebell': 'Kettlebell', 'leverage machine': 'Máquina',
    'medicine ball': 'Balón medicinal', 'olympic barbell': 'Barra olímpica', 'resistance band': 'Banda elástica',
    'roller': 'Rodillo', 'rope': 'Cuerda', 'skierg machine': 'SkiErg', 'sled machine': 'Prensa / trineo',
    'smith machine': 'Multipower', 'stability ball': 'Fitball', 'stationary bike': 'Bici estática',
    'stepmill machine': 'Escaladora', 'tire': 'Neumático', 'trap bar': 'Barra hexagonal',
    'upper body ergometer': 'Ergómetro brazos', 'weighted': 'Lastrado', 'wheel roller': 'Rueda abdominal',
    'none': 'Ninguno'
  },
  muscles: {
    'abductors': 'Abductores', 'abs': 'Abdominales', 'abdominals': 'Abdominales', 'adductors': 'Aductores',
    'biceps': 'Bíceps', 'calves': 'Gemelos', 'cardiovascular system': 'Sistema cardiovascular',
    'delts': 'Deltoides', 'deltoids': 'Deltoides', 'forearms': 'Antebrazos', 'glutes': 'Glúteos',
    'hamstrings': 'Isquiotibiales', 'lats': 'Dorsales', 'latissimus dorsi': 'Dorsal ancho',
    'levator scapulae': 'Elevador de la escápula', 'pectorals': 'Pectorales', 'quads': 'Cuádriceps',
    'quadriceps': 'Cuádriceps', 'serratus anterior': 'Serrato anterior', 'spine': 'Lumbares',
    'traps': 'Trapecio', 'trapezius': 'Trapecio', 'triceps': 'Tríceps', 'upper back': 'Espalda alta',
    'ankle stabilizers': 'Estabilizadores del tobillo', 'ankles': 'Tobillos', 'back': 'Espalda',
    'brachialis': 'Braquial', 'chest': 'Pecho', 'core': 'Core', 'feet': 'Pies', 'grip muscles': 'Agarre',
    'groin': 'Ingle', 'hands': 'Manos', 'hip flexors': 'Flexores de cadera', 'inner thighs': 'Aductores',
    'lower abs': 'Abdominal inferior', 'lower back': 'Zona lumbar', 'obliques': 'Oblicuos',
    'rear deltoids': 'Deltoides posterior', 'rhomboids': 'Romboides', 'rotator cuff': 'Manguito rotador',
    'shins': 'Tibiales', 'shoulders': 'Hombros', 'soleus': 'Sóleo', 'sternocleidomastoid': 'Esternocleidomastoideo',
    'upper chest': 'Pecho superior', 'wrist extensors': 'Extensores de muñeca', 'wrist flexors': 'Flexores de muñeca',
    'wrists': 'Muñecas', 'neck': 'Cuello'
  }
};
window.tr = (group, key) => (window.I18N[group] && window.I18N[group][key]) || (key ? key.charAt(0).toUpperCase() + key.slice(1) : '');
