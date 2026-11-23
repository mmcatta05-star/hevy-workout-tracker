/**
 * Store - Gestione LocalStorage, Calcoli 1RM, Sovraccarico Progressivo e Backup
 */

const STORAGE_KEYS = {
  ROUTINES: "hevy_routines_v1",
  HISTORY: "hevy_history_v1",
  ACTIVE_WORKOUT: "hevy_active_workout_v1",
  SETTINGS: "hevy_settings_v1"
};

const Store = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ROUTINES)) {
      this.setRoutines(DEFAULT_ROUTINES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      this.setHistory(generateMockHistory());
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setSettings({
        soundEnabled: true,
        vibrationEnabled: true,
        defaultTimerIncrement: 15,
        theme: "dark"
      });
    }
  },

  // --- ROUTINES ---
  getRoutines() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Errore lettura routine:", e);
      return [];
    }
  },

  setRoutines(routines) {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  },

  getRoutineById(id) {
    const list = this.getRoutines();
    return list.find(r => r.id === id) || null;
  },

  saveRoutine(routine) {
    const list = this.getRoutines();
    const index = list.findIndex(r => r.id === routine.id);
    routine.updatedAt = new Date().toISOString();
    if (index >= 0) {
      list[index] = routine;
    } else {
      list.push(routine);
    }
    this.setRoutines(list);
    return routine;
  },

  duplicateRoutine(id) {
    const orig = this.getRoutineById(id);
    if (!orig) return null;
    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = "routine_" + Date.now();
    copy.name = `${orig.name} (Copia)`;
    copy.updatedAt = new Date().toISOString();
    const list = this.getRoutines();
    list.push(copy);
    this.setRoutines(list);
    return copy;
  },

  deleteRoutine(id) {
    const list = this.getRoutines().filter(r => r.id !== id);
    this.setRoutines(list);
  },

  // --- STORICO ALLENAMENTI ---
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const list = data ? JSON.parse(data) : [];
      // Ordine cronologico decrescente (più recenti prima)
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
      console.error("Errore lettura storico:", e);
      return [];
    }
  },

  setHistory(history) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  saveWorkoutSession(session, updateRoutineDefaults = true) {
    const history = this.getHistory();
    history.unshift(session);
    this.setHistory(history);

    // Se l'allenamento appartiene a una routine, aggiorna i valori di riferimento per le serie se sono aumentati
    if (updateRoutineDefaults && session.routineId) {
      const routine = this.getRoutineById(session.routineId);
      if (routine && routine.exercises) {
        let changed = false;
        session.exercises.forEach(sessionEx => {
          const targetEx = routine.exercises.find(e => e.name.toLowerCase() === sessionEx.name.toLowerCase());
          if (targetEx && sessionEx.sets && sessionEx.sets.length > 0) {
            // Aggiorna le serie target con i valori eseguiti completati
            const completedSets = sessionEx.sets.filter(s => s.completed);
            if (completedSets.length > 0) {
              targetEx.sets = completedSets.map(s => ({
                weight: Number(s.weight) || 0,
                reps: Number(s.reps) || 0
              }));
              changed = true;
            }
          }
        });
        if (changed) {
          this.saveRoutine(routine);
        }
      }
    }
  },

  getLastSessionForExercise(exerciseName) {
    const history = this.getHistory();
    const norm = exerciseName.trim().toLowerCase();
    for (const session of history) {
      if (!session.exercises) continue;
      const found = session.exercises.find(e => e.name && e.name.trim().toLowerCase() === norm);
      if (found && found.sets && found.sets.some(s => s.completed)) {
        return {
          date: session.date,
          sessionName: session.routineName || "Allenamento",
          exercise: found
        };
      }
    }
    return null;
  },

  // --- SOVRACCARICO PROGRESSIVO (PROGRESSIVE OVERLOAD) ---
  /**
   * Logica di progressione automatica:
   * Se nell'ultima sessione l'utente ha completato tutte le serie target
   * con il carico previsto, suggeriamo un incremento per la sessione successiva:
   * - +2.5 kg per i grandi esercizi con bilanciere/macchina
   * - +1 o +2 reps se il carico era a corpo libero o se si consiglia progressione di volume
   */
  getProgressiveOverloadSuggestion(exerciseName, currentSets = []) {
    const lastSession = this.getLastSessionForExercise(exerciseName);
    if (!lastSession || !lastSession.exercise || !lastSession.exercise.sets) {
      return null;
    }

    const pastSets = lastSession.exercise.sets.filter(s => s.completed);
    if (pastSets.length === 0) return null;

    // Controlla se tutte le serie sono state completate
    const allCompleted = pastSets.every(s => s.completed && s.reps > 0 && s.weight !== undefined);
    if (!allCompleted) return null;

    // Prendi il peso massimo usato nell'ultima sessione
    const maxWeight = Math.max(...pastSets.map(s => Number(s.weight) || 0));
    const minReps = Math.min(...pastSets.map(s => Number(s.reps) || 0));
    const avgReps = pastSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0) / pastSets.length;

    // Se l'utente ha completato almeno il numero di ripetizioni previste con facilità
    if (maxWeight > 0) {
      const increment = maxWeight >= 60 ? 2.5 : 1.25;
      return {
        type: "weight",
        value: increment,
        text: `Consiglio: +${increment} kg`,
        detail: `Hai completato tutte le ${pastSets.length} serie a ${maxWeight} kg nell'ultima sessione.`,
        suggestedWeight: maxWeight + increment
      };
    } else {
      return {
        type: "reps",
        value: 1,
        text: `Consiglio: +1 rep`,
        detail: `Ottima costanza! Prova ad aggiungere una ripetizione a ogni serie.`,
        suggestedReps: Math.round(avgReps) + 1
      };
    }
  },

  // --- CALCOLO 1RM EPLEY & VOLUME ---
  calculate1RM(weight, reps) {
    const w = Number(weight) || 0;
    const r = Number(reps) || 0;
    if (w <= 0 || r <= 0) return 0;
    if (r === 1) return w;
    // Formula di Epley: 1RM = w * (1 + r / 30)
    return Math.round(w * (1 + r / 30) * 10) / 10;
  },

  calculateVolume(sets = []) {
    return sets.reduce((sum, s) => {
      if (!s.completed && s.completed !== undefined) return sum;
      const w = Number(s.weight) || 0;
      const r = Number(s.reps) || 0;
      return sum + (w * r);
    }, 0);
  },

  // --- ACTIVE WORKOUT IN CORSO ---
  getActiveWorkout() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveActiveWorkout(workout) {
    if (!workout) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
    }
  },

  clearActiveWorkout() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  },

  // --- IMPOSTAZIONI ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { soundEnabled: true, vibrationEnabled: true, defaultTimerIncrement: 15 };
    } catch (e) {
      return { soundEnabled: true, vibrationEnabled: true, defaultTimerIncrement: 15 };
    }
  },

  setSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // --- BACKUP & RESTORE JSON ---
  exportBackup() {
    const backup = {
      app: "HevyGymTracker",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      routines: this.getRoutines(),
      history: this.getHistory(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.routines) || !Array.isArray(data.history)) {
        throw new Error("Formato del file di backup non valido.");
      }
      this.setRoutines(data.routines);
      this.setHistory(data.history);
      if (data.settings) this.setSettings(data.settings);
      return { success: true, countRoutines: data.routines.length, countHistory: data.history.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  resetToDefaults() {
    this.setRoutines(DEFAULT_ROUTINES);
    this.setHistory(generateMockHistory());
    this.clearActiveWorkout();
  }
};
