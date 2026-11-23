/**
 * Dati predefiniti per Hevy Gym Tracker
 * Include esercizi base, routine di default e 4 sessioni storiche con sovraccarico progressivo.
 */

const DEFAULT_EXERCISES = [
  { id: "panca-piana", name: "Panca Piana con Bilanciere", category: "Petto", defaultRest: 90 },
  { id: "squat", name: "Squat con Bilanciere", category: "Gambe", defaultRest: 120 },
  { id: "lat-machine", name: "Lat Machine Presa Larga", category: "Dorso", defaultRest: 60 },
  { id: "stacco-terra", name: "Stacco da Terra", category: "Dorso / Gambe", defaultRest: 150 },
  { id: "military-press", name: "Military Press (Overhead Press)", category: "Spalle", defaultRest: 90 },
  { id: "panca-inclinata", name: "Panca Inclinata Manubri", category: "Petto", defaultRest: 90 },
  { id: "rematore-bilanciere", name: "Rematore con Bilanciere", category: "Dorso", defaultRest: 90 },
  { id: "leg-press", name: "Leg Press 45°", category: "Gambe", defaultRest: 90 },
  { id: "leg-extension", name: "Leg Extension", category: "Gambe", defaultRest: 60 },
  { id: "leg-curl", name: "Leg Curl Sdraiato", category: "Gambe", defaultRest: 60 },
  { id: "dip", name: "Dip alle Parallele", category: "Petto / Tricipiti", defaultRest: 90 },
  { id: "curl-manubri", name: "Curl Manubri Alternato", category: "Bicipiti", defaultRest: 60 },
  { id: "french-press", name: "French Press con Bilanciere EZ", category: "Tricipiti", defaultRest: 60 },
  { id: "alzate-laterali", name: "Alzate Laterali con Manubri", category: "Spalle", defaultRest: 60 },
  { id: "calf-machine", name: "Polpacci alla Calf Machine", category: "Polpacci", defaultRest: 45 },
  { id: "plank", name: "Plank Addominale", category: "Core", defaultRest: 60 }
];

function generateMockHistory() {
  const now = new Date();
  
  function getPastDate(daysAgo) {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(18, 30, 0, 0);
    return d.toISOString();
  }

  return [
    {
      id: "hist_1",
      routineId: "routine_fullbody_a",
      routineName: "Full Body A",
      date: getPastDate(28),
      durationMinutes: 52,
      totalVolumeKg: 5895,
      exercises: [
        {
          name: "Panca Piana con Bilanciere",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 67.5, reps: 8, completed: true },
            { setNumber: 2, weight: 67.5, reps: 8, completed: true },
            { setNumber: 3, weight: 67.5, reps: 8, completed: true },
            { setNumber: 4, weight: 67.5, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 90.0, reps: 6, completed: true },
            { setNumber: 2, weight: 90.0, reps: 6, completed: true },
            { setNumber: 3, weight: 90.0, reps: 6, completed: true },
            { setNumber: 4, weight: 90.0, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga",
          notes: "Trazione controllata al petto",
          sets: [
            { setNumber: 1, weight: 52.5, reps: 10, completed: true },
            { setNumber: 2, weight: 52.5, reps: 10, completed: true },
            { setNumber: 3, weight: 52.5, reps: 10, completed: true }
          ]
        }
      ]
    },
    {
      id: "hist_2",
      routineId: "routine_fullbody_a",
      routineName: "Full Body A",
      date: getPastDate(21),
      durationMinutes: 55,
      totalVolumeKg: 6110,
      exercises: [
        {
          name: "Panca Piana con Bilanciere",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 70.0, reps: 8, completed: true },
            { setNumber: 2, weight: 70.0, reps: 8, completed: true },
            { setNumber: 3, weight: 70.0, reps: 8, completed: true },
            { setNumber: 4, weight: 70.0, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 92.5, reps: 6, completed: true },
            { setNumber: 2, weight: 92.5, reps: 6, completed: true },
            { setNumber: 3, weight: 92.5, reps: 6, completed: true },
            { setNumber: 4, weight: 92.5, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga",
          notes: "Trazione controllata al petto",
          sets: [
            { setNumber: 1, weight: 55.0, reps: 10, completed: true },
            { setNumber: 2, weight: 55.0, reps: 10, completed: true },
            { setNumber: 3, weight: 55.0, reps: 10, completed: true }
          ]
        }
      ]
    },
    {
      id: "hist_3",
      routineId: "routine_fullbody_a",
      routineName: "Full Body A",
      date: getPastDate(14),
      durationMinutes: 58,
      totalVolumeKg: 6385,
      exercises: [
        {
          name: "Panca Piana con Bilanciere",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 72.5, reps: 8, completed: true },
            { setNumber: 2, weight: 72.5, reps: 8, completed: true },
            { setNumber: 3, weight: 72.5, reps: 8, completed: true },
            { setNumber: 4, weight: 72.5, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 97.5, reps: 6, completed: true },
            { setNumber: 2, weight: 97.5, reps: 6, completed: true },
            { setNumber: 3, weight: 97.5, reps: 6, completed: true },
            { setNumber: 4, weight: 97.5, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga",
          notes: "Trazione controllata al petto",
          sets: [
            { setNumber: 1, weight: 57.5, reps: 10, completed: true },
            { setNumber: 2, weight: 57.5, reps: 10, completed: true },
            { setNumber: 3, weight: 57.5, reps: 10, completed: true }
          ]
        }
      ]
    },
    {
      id: "hist_4",
      routineId: "routine_fullbody_a",
      routineName: "Full Body A",
      date: getPastDate(7),
      durationMinutes: 60,
      totalVolumeKg: 6600,
      exercises: [
        {
          name: "Panca Piana con Bilanciere",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 75.0, reps: 8, completed: true },
            { setNumber: 2, weight: 75.0, reps: 8, completed: true },
            { setNumber: 3, weight: 75.0, reps: 8, completed: true },
            { setNumber: 4, weight: 75.0, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 100.0, reps: 6, completed: true },
            { setNumber: 2, weight: 100.0, reps: 6, completed: true },
            { setNumber: 3, weight: 100.0, reps: 6, completed: true },
            { setNumber: 4, weight: 100.0, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga",
          notes: "Trazione controllata al petto",
          sets: [
            { setNumber: 1, weight: 60.0, reps: 10, completed: true },
            { setNumber: 2, weight: 60.0, reps: 10, completed: true },
            { setNumber: 3, weight: 60.0, reps: 10, completed: true }
          ]
        }
      ]
    }
  ];
}

const DEFAULT_ROUTINES = [
  {
    id: "routine_fullbody_a",
    name: "Full Body A",
    description: "Petto, Gambe e Dorso ad alta intensità",
    updatedAt: new Date().toISOString(),
    exercises: [
      {
        id: "ex_1",
        name: "Panca Piana con Bilanciere",
        notes: "Arco compatto, scapole addotte",
        restSeconds: 90,
        sets: [
          { weight: 75.0, reps: 8 },
          { weight: 75.0, reps: 8 },
          { weight: 75.0, reps: 8 },
          { weight: 75.0, reps: 8 }
        ]
      },
      {
        id: "ex_2",
        name: "Squat con Bilanciere",
        notes: "Scendi sotto il parallelo",
        restSeconds: 120,
        sets: [
          { weight: 100.0, reps: 6 },
          { weight: 100.0, reps: 6 },
          { weight: 100.0, reps: 6 },
          { weight: 100.0, reps: 6 }
        ]
      },
      {
        id: "ex_3",
        name: "Lat Machine Presa Larga",
        notes: "Trazione controllata al petto",
        restSeconds: 60,
        sets: [
          { weight: 60.0, reps: 10 },
          { weight: 60.0, reps: 10 },
          { weight: 60.0, reps: 10 }
        ]
      }
    ]
  },
  {
    id: "routine_push",
    name: "Push Day (Spinta)",
    description: "Focus Petto, Spalle anteriori/laterali e Tricipiti",
    updatedAt: new Date().toISOString(),
    exercises: [
      {
        id: "p_ex_1",
        name: "Panca Piana con Bilanciere",
        notes: "Scapole addotte",
        restSeconds: 90,
        sets: [
          { weight: 72.5, reps: 8 },
          { weight: 72.5, reps: 8 },
          { weight: 72.5, reps: 8 }
        ]
      },
      {
        id: "p_ex_2",
        name: "Military Press (Overhead Press)",
        notes: "Glutei stretti e core attivo",
        restSeconds: 90,
        sets: [
          { weight: 45.0, reps: 8 },
          { weight: 45.0, reps: 8 },
          { weight: 45.0, reps: 8 }
        ]
      },
      {
        id: "p_ex_3",
        name: "Dip alle Parallele",
        notes: "Inclinati leggermente in avanti",
        restSeconds: 90,
        sets: [
          { weight: 0.0, reps: 10 },
          { weight: 0.0, reps: 10 },
          { weight: 0.0, reps: 8 }
        ]
      },
      {
        id: "p_ex_4",
        name: "Alzate Laterali con Manubri",
        notes: "Controllo in fase eccentrica",
        restSeconds: 60,
        sets: [
          { weight: 10.0, reps: 12 },
          { weight: 10.0, reps: 12 },
          { weight: 10.0, reps: 12 }
        ]
      }
    ]
  },
  {
    id: "routine_pull",
    name: "Pull Day (Tirata)",
    description: "Focus Dorso, Spalle posteriori e Bicipiti",
    updatedAt: new Date().toISOString(),
    exercises: [
      {
        id: "pl_ex_1",
        name: "Stacco da Terra",
        notes: "Schiena neutra, spingi con le gambe",
        restSeconds: 150,
        sets: [
          { weight: 110.0, reps: 5 },
          { weight: 110.0, reps: 5 },
          { weight: 110.0, reps: 5 }
        ]
      },
      {
        id: "pl_ex_2",
        name: "Rematore con Bilanciere",
        notes: "Busto a 45 gradi",
        restSeconds: 90,
        sets: [
          { weight: 65.0, reps: 8 },
          { weight: 65.0, reps: 8 },
          { weight: 65.0, reps: 8 }
        ]
      },
      {
        id: "pl_ex_3",
        name: "Lat Machine Presa Larga",
        notes: "Focus dorsali",
        restSeconds: 60,
        sets: [
          { weight: 60.0, reps: 10 },
          { weight: 60.0, reps: 10 },
          { weight: 60.0, reps: 10 }
        ]
      },
      {
        id: "pl_ex_4",
        name: "Curl Manubri Alternato",
        notes: "Supinazione completa",
        restSeconds: 60,
        sets: [
          { weight: 14.0, reps: 10 },
          { weight: 14.0, reps: 10 },
          { weight: 14.0, reps: 10 }
        ]
      }
    ]
  }
];
