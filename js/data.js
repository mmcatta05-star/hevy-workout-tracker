/**
 * Dati predefiniti per Hevy Gym Tracker
 * Include libreria con oltre 90 esercizi bilingue (IT/EN),
 * routine di default e 4 sessioni storiche con sovraccarico progressivo.
 */

const DEFAULT_EXERCISES = [
  // --- PETTO / CHEST (13 esercizi) ---
  { id: "panca-piana", name: "Panca Piana con Bilanciere (Barbell Bench Press)", nameIt: "Panca Piana con Bilanciere", nameEn: "Barbell Bench Press", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "panca-inclinata-bil", name: "Panca Inclinata con Bilanciere (Incline Barbell Bench)", nameIt: "Panca Inclinata con Bilanciere", nameEn: "Incline Barbell Bench Press", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "panca-declinata-bil", name: "Panca Declinata con Bilanciere (Decline Barbell Bench)", nameIt: "Panca Declinata con Bilanciere", nameEn: "Decline Barbell Bench Press", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "panca-piana-manubri", name: "Panca Piana con Manubri (Dumbbell Bench Press)", nameIt: "Panca Piana con Manubri", nameEn: "Dumbbell Bench Press", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "panca-inclinata", name: "Panca Inclinata Manubri (Incline Dumbbell Press)", nameIt: "Panca Inclinata Manubri", nameEn: "Incline Dumbbell Press", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "panca-declinata-man", name: "Panca Declinata con Manubri (Decline Dumbbell Press)", nameIt: "Panca Declinata con Manubri", nameEn: "Decline Dumbbell Press", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "croci-manubri", name: "Croci con Manubri su Panca (Dumbbell Flyes)", nameIt: "Croci con Manubri", nameEn: "Dumbbell Chest Flyes", category: "Petto", muscleGroup: "Petto", defaultRest: 60 },
  { id: "croci-cavi", name: "Croci ai Cavi (Cable Crossover / Cable Fly)", nameIt: "Croci ai Cavi", nameEn: "Cable Crossover", category: "Petto", muscleGroup: "Petto", defaultRest: 60 },
  { id: "chest-press", name: "Chest Press alla Macchina (Machine Chest Press)", nameIt: "Chest Press Macchina", nameEn: "Machine Chest Press", category: "Petto", muscleGroup: "Petto", defaultRest: 75 },
  { id: "push-up", name: "Push Up / Flessioni (Push Ups)", nameIt: "Push Up / Flessioni", nameEn: "Push Ups", category: "Petto", muscleGroup: "Petto", defaultRest: 60 },
  { id: "dip-petto", name: "Dip alle Parallele per Petto (Chest Dips)", nameIt: "Dip alle Parallele per Petto", nameEn: "Chest Dips", category: "Petto", muscleGroup: "Petto", defaultRest: 90 },
  { id: "pullover-manubrio", name: "Pullover con Manubrio (Dumbbell Pullover)", nameIt: "Pullover con Manubrio", nameEn: "Dumbbell Pullover", category: "Petto", muscleGroup: "Petto", defaultRest: 60 },
  { id: "chest-press-inclinata", name: "Incline Chest Press Macchina (Incline Machine Press)", nameIt: "Chest Press Inclinata", nameEn: "Incline Machine Press", category: "Petto", muscleGroup: "Petto", defaultRest: 75 },

  // --- SCHIENA & DORSO / BACK (16 esercizi) ---
  { id: "stacco-terra", name: "Stacco da Terra (Barbell Deadlift)", nameIt: "Stacco da Terra", nameEn: "Barbell Deadlift", category: "Dorso", muscleGroup: "Schiena", defaultRest: 150 },
  { id: "stacco-sumo", name: "Stacco Sumo (Sumo Deadlift)", nameIt: "Stacco da Terra Sumo", nameEn: "Sumo Deadlift", category: "Dorso", muscleGroup: "Schiena", defaultRest: 150 },
  { id: "lat-machine", name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)", nameIt: "Lat Machine Presa Larga", nameEn: "Wide Grip Lat Pulldown", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "lat-machine-inversa", name: "Lat Machine Presa Inversa (Reverse Lat Pulldown)", nameIt: "Lat Machine Presa Inversa", nameEn: "Reverse Lat Pulldown", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "lat-machine-neutra", name: "Lat Machine Presa Neutra (Close Grip Lat Pulldown)", nameIt: "Lat Machine Presa Neutra", nameEn: "Close Grip Lat Pulldown", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "trazioni-sbarra", name: "Trazioni alla Sbarra (Pull Ups)", nameIt: "Trazioni alla Sbarra", nameEn: "Pull Ups", category: "Dorso", muscleGroup: "Schiena", defaultRest: 90 },
  { id: "chin-up", name: "Chin Up Trazioni Supine (Chin Ups)", nameIt: "Chin Up Presa Supina", nameEn: "Chin Ups", category: "Dorso", muscleGroup: "Schiena", defaultRest: 90 },
  { id: "rematore-bilanciere", name: "Rematore con Bilanciere (Barbell Row)", nameIt: "Rematore con Bilanciere", nameEn: "Barbell Row", category: "Dorso", muscleGroup: "Schiena", defaultRest: 90 },
  { id: "rematore-manubrio", name: "Rematore con Manubrio Singolo (Single Arm Dumbbell Row)", nameIt: "Rematore con Manubrio", nameEn: "Dumbbell Row", category: "Dorso", muscleGroup: "Schiena", defaultRest: 75 },
  { id: "pulley-basso", name: "Pulley Basso al Cavo (Seated Cable Row)", nameIt: "Pulley Basso", nameEn: "Seated Cable Row", category: "Dorso", muscleGroup: "Schiena", defaultRest: 75 },
  { id: "rematore-tbar", name: "Rematore T-Bar (T-Bar Row)", nameIt: "Rematore T-Bar", nameEn: "T-Bar Row", category: "Dorso", muscleGroup: "Schiena", defaultRest: 90 },
  { id: "pulldown-braccia-tese", name: "Pull-down a Braccia Tese (Straight Arm Pulldown)", nameIt: "Pulldown a Braccia Tese", nameEn: "Straight Arm Pulldown", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "hyperextension", name: "Hyperextension Estensioni Lombari (Back Extensions)", nameIt: "Hyperextension Lombari", nameEn: "Back Extensions", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "shrug-bilanciere", name: "Scrollate con Bilanciere (Barbell Shrugs)", nameIt: "Scrollate con Bilanciere", nameEn: "Barbell Shrugs", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "shrug-manubri", name: "Scrollate con Manubri (Dumbbell Shrugs)", nameIt: "Scrollate con Manubri", nameEn: "Dumbbell Shrugs", category: "Dorso", muscleGroup: "Schiena", defaultRest: 60 },
  { id: "rematore-macchina", name: "Rematore alla Macchina (Machine Row)", nameIt: "Rematore alla Macchina", nameEn: "Machine Row", category: "Dorso", muscleGroup: "Schiena", defaultRest: 75 },

  // --- SPALLE / SHOULDERS (12 esercizi) ---
  { id: "military-press", name: "Military Press / Overhead Press (Barbell OHP)", nameIt: "Military Press con Bilanciere", nameEn: "Barbell Overhead Press", category: "Spalle", muscleGroup: "Spalle", defaultRest: 90 },
  { id: "lento-avanti-manubri", name: "Lento Avanti con Manubri (Seated Dumbbell Press)", nameIt: "Lento Avanti con Manubri", nameEn: "Seated Dumbbell Shoulder Press", category: "Spalle", muscleGroup: "Spalle", defaultRest: 90 },
  { id: "arnold-press", name: "Arnold Press con Manubri (Arnold Press)", nameIt: "Arnold Press", nameEn: "Arnold Press", category: "Spalle", muscleGroup: "Spalle", defaultRest: 75 },
  { id: "alzate-laterali", name: "Alzate Laterali con Manubri (Dumbbell Lateral Raises)", nameIt: "Alzate Laterali con Manubri", nameEn: "Dumbbell Lateral Raises", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },
  { id: "alzate-laterali-cavi", name: "Alzate Laterali al Cavo (Cable Lateral Raises)", nameIt: "Alzate Laterali al Cavo", nameEn: "Cable Lateral Raises", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },
  { id: "alzate-frontali", name: "Alzate Frontali con Manubri (Front Dumbbell Raises)", nameIt: "Alzate Frontali con Manubri", nameEn: "Front Dumbbell Raises", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },
  { id: "face-pull", name: "Face Pull al Cavo con Corda (Cable Face Pull)", nameIt: "Face Pull con Corda", nameEn: "Cable Face Pull", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },
  { id: "rear-delt-fly", name: "Alzate a 90° Deltoidi Posteriori (Rear Delt Fly)", nameIt: "Alzate Posteriori a 90°", nameEn: "Rear Delt Dumbbell Fly", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },
  { id: "reverse-pec-deck", name: "Reverse Pec Deck Macchina (Machine Rear Delt)", nameIt: "Reverse Pec Deck", nameEn: "Reverse Pec Deck Fly", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },
  { id: "shoulder-press-macchina", name: "Shoulder Press alla Macchina (Machine Shoulder Press)", nameIt: "Shoulder Press Macchina", nameEn: "Machine Shoulder Press", category: "Spalle", muscleGroup: "Spalle", defaultRest: 75 },
  { id: "tirate-al-mento", name: "Tirate al Mento con Bilanciere (Upright Row)", nameIt: "Tirate al Mento", nameEn: "Barbell Upright Row", category: "Spalle", muscleGroup: "Spalle", defaultRest: 75 },
  { id: "alzate-disco", name: "Alzate Frontali con Disco (Plate Front Raise)", nameIt: "Alzate Frontali con Disco", nameEn: "Plate Front Raise", category: "Spalle", muscleGroup: "Spalle", defaultRest: 60 },

  // --- GAMBE / LEGS & GLUTES (20 esercizi) ---
  { id: "squat", name: "Squat con Bilanciere (Barbell Back Squat)", nameIt: "Squat con Bilanciere", nameEn: "Barbell Back Squat", category: "Gambe", muscleGroup: "Gambe", defaultRest: 120 },
  { id: "front-squat", name: "Front Squat con Bilanciere (Front Squat)", nameIt: "Front Squat con Bilanciere", nameEn: "Front Squat", category: "Gambe", muscleGroup: "Gambe", defaultRest: 120 },
  { id: "hack-squat", name: "Hack Squat alla Macchina (Hack Squat)", nameIt: "Hack Squat", nameEn: "Hack Squat Machine", category: "Gambe", muscleGroup: "Gambe", defaultRest: 90 },
  { id: "leg-press", name: "Leg Press 45° (45° Leg Press Machine)", nameIt: "Leg Press 45°", nameEn: "45° Leg Press", category: "Gambe", muscleGroup: "Gambe", defaultRest: 90 },
  { id: "leg-extension", name: "Leg Extension (Quad Leg Extension)", nameIt: "Leg Extension", nameEn: "Leg Extension", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },
  { id: "leg-curl", name: "Leg Curl Sdraiato (Lying Leg Curl)", nameIt: "Leg Curl Sdraiato", nameEn: "Lying Leg Curl", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },
  { id: "leg-curl-seduto", name: "Leg Curl Seduto (Seated Leg Curl)", nameIt: "Leg Curl Seduto", nameEn: "Seated Leg Curl", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },
  { id: "stacco-rumeno", name: "Stacco Rumeno con Bilanciere (Romanian Deadlift / RDL)", nameIt: "Stacco Rumeno RDL", nameEn: "Romanian Deadlift", category: "Gambe", muscleGroup: "Gambe", defaultRest: 90 },
  { id: "stacco-rumeno-manubri", name: "Stacco Rumeno con Manubri (Dumbbell RDL)", nameIt: "Stacco Rumeno Manubri", nameEn: "Dumbbell Romanian Deadlift", category: "Gambe", muscleGroup: "Gambe", defaultRest: 90 },
  { id: "hip-thrust", name: "Hip Thrust con Bilanciere (Barbell Hip Thrust)", nameIt: "Hip Thrust con Bilanciere", nameEn: "Barbell Hip Thrust", category: "Gambe", muscleGroup: "Gambe", defaultRest: 90 },
  { id: "glute-bridge", name: "Glute Bridge Ponte Glutei (Glute Bridge)", nameIt: "Glute Bridge", nameEn: "Glute Bridge", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },
  { id: "affondi-manubri", name: "Affondi Camminati con Manubri (Walking Lunges)", nameIt: "Affondi con Manubri", nameEn: "Dumbbell Lunges", category: "Gambe", muscleGroup: "Gambe", defaultRest: 75 },
  { id: "bulgarian-split-squat", name: "Split Squat Bulgaro (Bulgarian Split Squat)", nameIt: "Squat Bulgaro", nameEn: "Bulgarian Split Squat", category: "Gambe", muscleGroup: "Gambe", defaultRest: 75 },
  { id: "goblet-squat", name: "Goblet Squat con Manubrio (Goblet Squat)", nameIt: "Goblet Squat", nameEn: "Goblet Squat", category: "Gambe", muscleGroup: "Gambe", defaultRest: 75 },
  { id: "abductor-machine", name: "Abductor Machine (Macchina Abduttori Glutei)", nameIt: "Abductor Machine", nameEn: "Hip Abductor Machine", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },
  { id: "adductor-machine", name: "Adductor Machine (Macchina Adduttori Interno Coscia)", nameIt: "Adductor Machine", nameEn: "Hip Adductor Machine", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },
  { id: "calf-machine", name: "Polpacci alla Calf Machine Seduto (Seated Calf Raise)", nameIt: "Calf Machine Seduto", nameEn: "Seated Calf Raise", category: "Polpacci", muscleGroup: "Gambe", defaultRest: 45 },
  { id: "calf-in-piedi", name: "Polpacci in Piedi alla Macchina (Standing Calf Raise)", nameIt: "Calf in Piedi", nameEn: "Standing Calf Raise", category: "Polpacci", muscleGroup: "Gambe", defaultRest: 45 },
  { id: "donkey-calf", name: "Donkey Calf Raise (Polpacci Donkey)", nameIt: "Donkey Calf", nameEn: "Donkey Calf Raise", category: "Polpacci", muscleGroup: "Gambe", defaultRest: 45 },
  { id: "step-up", name: "Step Up con Manubri su Panca (Dumbbell Step Ups)", nameIt: "Step Up con Manubri", nameEn: "Dumbbell Step Ups", category: "Gambe", muscleGroup: "Gambe", defaultRest: 60 },

  // --- BICIPITI / BICEPS (10 esercizi) ---
  { id: "curl-bilanciere", name: "Curl con Bilanciere Dritto (Barbell Bicep Curl)", nameIt: "Curl con Bilanciere Dritto", nameEn: "Barbell Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "curl-bilanciere-ez", name: "Curl con Bilanciere EZ (EZ-Bar Bicep Curl)", nameIt: "Curl Bilanciere EZ", nameEn: "EZ-Bar Bicep Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "curl-manubri", name: "Curl Manubri Alternato (Alternating Dumbbell Curl)", nameIt: "Curl Manubri Alternato", nameEn: "Dumbbell Bicep Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "hammer-curl", name: "Curl a Martello con Manubri (Dumbbell Hammer Curl)", nameIt: "Hammer Curl a Martello", nameEn: "Dumbbell Hammer Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "curl-panca-inclinata", name: "Curl su Panca Inclinata (Incline Dumbbell Curl)", nameIt: "Curl Panca Inclinata", nameEn: "Incline Dumbbell Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "preacher-curl", name: "Curl alla Panca Scott (Preacher Curl)", nameIt: "Curl Panca Scott", nameEn: "Preacher Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "cable-curl", name: "Curl al Cavo Basso (Cable Bicep Curl)", nameIt: "Curl ai Cavi Bassi", nameEn: "Low Cable Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "concentration-curl", name: "Curl Concentrato con Manubrio (Concentration Curl)", nameIt: "Curl Concentrato", nameEn: "Concentration Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "spider-curl", name: "Spider Curl su Panca Inclinata (Spider Curl)", nameIt: "Spider Curl", nameEn: "Spider Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 60 },
  { id: "curl-21", name: "Curl 21 con Bilanciere (21s Bicep Curl)", nameIt: "Curl 21 Bilanciere", nameEn: "21s Bicep Curl", category: "Bicipiti", muscleGroup: "Bicipiti", defaultRest: 90 },

  // --- TRICIPITI / TRICEPS (10 esercizi) ---
  { id: "pushdown-corda", name: "Pushdown ai Cavi con Corda (Tricep Rope Pushdown)", nameIt: "Pushdown Cavi Corda", nameEn: "Rope Tricep Pushdown", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },
  { id: "pushdown-barra", name: "Pushdown ai Cavi con Barra Dritta (Bar Cable Pushdown)", nameIt: "Pushdown Cavi Barra", nameEn: "Straight Bar Pushdown", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },
  { id: "french-press", name: "French Press con Bilanciere EZ (EZ-Bar Skull Crushers)", nameIt: "French Press Bilanciere EZ", nameEn: "Skull Crushers", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },
  { id: "overhead-tricep-ext", name: "Estensioni Sopra la Testa con Manubrio (Overhead Tricep Extension)", nameIt: "Estensioni Sopra la Testa Manubrio", nameEn: "Overhead Dumbbell Tricep Extension", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },
  { id: "overhead-cable-ext", name: "Estensioni ai Cavi Sopra la Testa (Overhead Cable Extension)", nameIt: "Estensioni Cavo Sopra Testa", nameEn: "Overhead Cable Extension", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },
  { id: "panca-stretta", name: "Panca Piana Presa Stretta (Close-Grip Bench Press)", nameIt: "Panca Presa Stretta", nameEn: "Close Grip Bench Press", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 90 },
  { id: "dip", name: "Dip alle Parallele per Tricipiti (Triceps Dips)", nameIt: "Dip alle Parallele Tricipiti", nameEn: "Tricep Dips", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 90 },
  { id: "kickback-manubri", name: "Kickback con Manubri (Dumbbell Kickbacks)", nameIt: "Kickback Manubri", nameEn: "Tricep Kickbacks", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 45 },
  { id: "bench-dips", name: "Dip tra Panche (Bench Dips)", nameIt: "Dip tra Panche", nameEn: "Bench Dips", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },
  { id: "tate-press", name: "Tate Press con Manubri (Tate Press)", nameIt: "Tate Press con Manubri", nameEn: "Tate Press", category: "Tricipiti", muscleGroup: "Tricipiti", defaultRest: 60 },

  // --- ADDOME & CORE / ABS (9 esercizi) ---
  { id: "crunch", name: "Crunch a Terra (Floor Crunch)", nameIt: "Crunch a Terra", nameEn: "Floor Crunch", category: "Core", muscleGroup: "Addome", defaultRest: 45 },
  { id: "cable-crunch", name: "Crunch ai Cavi in Ginocchio (Kneeling Cable Crunch)", nameIt: "Crunch ai Cavi", nameEn: "Cable Kneeling Crunch", category: "Core", muscleGroup: "Addome", defaultRest: 60 },
  { id: "plank", name: "Plank Addominale (Standard Plank)", nameIt: "Plank Addominale", nameEn: "Front Plank", category: "Core", muscleGroup: "Addome", defaultRest: 60 },
  { id: "side-plank", name: "Side Plank Laterale (Side Plank)", nameIt: "Side Plank Laterale", nameEn: "Side Plank", category: "Core", muscleGroup: "Addome", defaultRest: 45 },
  { id: "hanging-leg-raise", name: "Alzate Gambe alla Sbarra (Hanging Leg Raise)", nameIt: "Alzate Gambe alla Sbarra", nameEn: "Hanging Leg Raise", category: "Core", muscleGroup: "Addome", defaultRest: 60 },
  { id: "russian-twist", name: "Russian Twist con Peso (Weighted Russian Twist)", nameIt: "Russian Twist", nameEn: "Russian Twist", category: "Core", muscleGroup: "Addome", defaultRest: 45 },
  { id: "ab-wheel", name: "Ruota Addominale (Ab Wheel Rollout)", nameIt: "Ruota Addominale Rollout", nameEn: "Ab Wheel Rollout", category: "Core", muscleGroup: "Addome", defaultRest: 60 },
  { id: "mountain-climbers", name: "Mountain Climbers (Scalatore)", nameIt: "Mountain Climbers", nameEn: "Mountain Climbers", category: "Core", muscleGroup: "Addome", defaultRest: 45 },
  { id: "dead-bug", name: "Dead Bug per Stabilità Core (Dead Bug)", nameIt: "Dead Bug Core", nameEn: "Dead Bug", category: "Core", muscleGroup: "Addome", defaultRest: 45 }
];

/**
 * Riconosce automaticamente il gruppo muscolare principale dal nome dell'esercizio
 * (utile sia per gli esercizi standard sia per qualsiasi nome personalizzato inserito dall'utente)
 */
function detectMuscleGroup(exerciseName = "") {
  if (!exerciseName) return "Petto";
  const str = exerciseName.toLowerCase();

  // Cerca prima corrispondenza nella libreria
  const matched = DEFAULT_EXERCISES.find(e => 
    e.name.toLowerCase() === str || 
    (e.nameIt && e.nameIt.toLowerCase() === str) || 
    (e.nameEn && e.nameEn.toLowerCase() === str) ||
    str.includes(e.nameIt ? e.nameIt.toLowerCase() : "")
  );
  if (matched && matched.muscleGroup) return matched.muscleGroup;

  // Euristica per parole chiave
  if (/petto|chest|panca|bench|croci|fly|flessioni|push\s?up|spinte|inclinat/i.test(str)) return "Petto";
  if (/dorso|schiena|back|lat|trazion|pull\s?up|chin\s?up|stacco|deadlift|row|remator|pulley|hyper|shrug|scrollat/i.test(str)) return "Schiena";
  if (/spall|shoulder|military|overhead|press|arnold|alzat|lateral|front|rear|delt|face\s?pull|upright|mento/i.test(str)) return "Spalle";
  if (/bicip|bicep|curl|scott|martello|hammer|spider|braccia/i.test(str)) return "Bicipiti";
  if (/tricip|tricep|pushdown|french|skull|dip|kickback|tate/i.test(str)) return "Tricipiti";
  if (/crunch|plank|addom|core|abs|twist|leg\s?raise|ruota|rollout|dead\s?bug/i.test(str)) return "Addome";
  if (/squat|leg|gambe|press|affond|lunge|polpacc|calf|glute|thrust|bulgar|hack|femor|quadricip/i.test(str)) return "Gambe";

  return "Petto";
}

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
          name: "Panca Piana con Bilanciere (Barbell Bench Press)",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 67.5, reps: 8, completed: true },
            { setNumber: 2, weight: 67.5, reps: 8, completed: true },
            { setNumber: 3, weight: 67.5, reps: 8, completed: true },
            { setNumber: 4, weight: 67.5, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere (Barbell Back Squat)",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 90.0, reps: 6, completed: true },
            { setNumber: 2, weight: 90.0, reps: 6, completed: true },
            { setNumber: 3, weight: 90.0, reps: 6, completed: true },
            { setNumber: 4, weight: 90.0, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)",
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
          name: "Panca Piana con Bilanciere (Barbell Bench Press)",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 70.0, reps: 8, completed: true },
            { setNumber: 2, weight: 70.0, reps: 8, completed: true },
            { setNumber: 3, weight: 70.0, reps: 8, completed: true },
            { setNumber: 4, weight: 70.0, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere (Barbell Back Squat)",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 92.5, reps: 6, completed: true },
            { setNumber: 2, weight: 92.5, reps: 6, completed: true },
            { setNumber: 3, weight: 92.5, reps: 6, completed: true },
            { setNumber: 4, weight: 92.5, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)",
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
          name: "Panca Piana con Bilanciere (Barbell Bench Press)",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 72.5, reps: 8, completed: true },
            { setNumber: 2, weight: 72.5, reps: 8, completed: true },
            { setNumber: 3, weight: 72.5, reps: 8, completed: true },
            { setNumber: 4, weight: 72.5, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere (Barbell Back Squat)",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 97.5, reps: 6, completed: true },
            { setNumber: 2, weight: 97.5, reps: 6, completed: true },
            { setNumber: 3, weight: 97.5, reps: 6, completed: true },
            { setNumber: 4, weight: 97.5, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)",
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
          name: "Panca Piana con Bilanciere (Barbell Bench Press)",
          notes: "Arco compatto, scapole addotte",
          sets: [
            { setNumber: 1, weight: 75.0, reps: 8, completed: true },
            { setNumber: 2, weight: 75.0, reps: 8, completed: true },
            { setNumber: 3, weight: 75.0, reps: 8, completed: true },
            { setNumber: 4, weight: 75.0, reps: 8, completed: true }
          ]
        },
        {
          name: "Squat con Bilanciere (Barbell Back Squat)",
          notes: "Scendi sotto il parallelo",
          sets: [
            { setNumber: 1, weight: 100.0, reps: 6, completed: true },
            { setNumber: 2, weight: 100.0, reps: 6, completed: true },
            { setNumber: 3, weight: 100.0, reps: 6, completed: true },
            { setNumber: 4, weight: 100.0, reps: 6, completed: true }
          ]
        },
        {
          name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)",
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
        name: "Panca Piana con Bilanciere (Barbell Bench Press)",
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
        name: "Squat con Bilanciere (Barbell Back Squat)",
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
        name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)",
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
        name: "Panca Piana con Bilanciere (Barbell Bench Press)",
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
        name: "Military Press / Overhead Press (Barbell OHP)",
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
        name: "Dip alle Parallele per Petto (Chest Dips)",
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
        name: "Alzate Laterali con Manubri (Dumbbell Lateral Raises)",
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
        name: "Stacco da Terra (Barbell Deadlift)",
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
        name: "Rematore con Bilanciere (Barbell Row)",
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
        name: "Lat Machine Presa Larga (Wide Grip Lat Pulldown)",
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
        name: "Curl Manubri Alternato (Alternating Dumbbell Curl)",
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
