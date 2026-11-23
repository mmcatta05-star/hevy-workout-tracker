/**
 * Hevy Gym Tracker - Applicazione Principale
 * Gestisce navigazione, esecuzione allenamento, routine editor,
 * catalogo 90+ esercizi, illustrazioni anatomiche SVG e badge PR in tempo reale.
 */

const App = {
  currentView: "view-routines",
  activeWorkout: null,
  workoutTimerInterval: null,
  activeExercisePickerContext: null, // "editor" o "active_workout"
  pickerMuscleFilter: "Tutti",
  finishSummaryData: null,
  currentEditorExercises: [],

  init() {
    Store.init();
    RestTimer.init();

    this.bindNavigation();
    this.bindModals();
    this.bindSettings();
    this.bindExercisePickerFilters();
    this.renderRoutines();

    // Controlla se c'è un allenamento già attivo salvato in LocalStorage
    const savedActive = Store.getActiveWorkout();
    if (savedActive) {
      this.activeWorkout = savedActive;
      this.resumeActiveWorkout();
    }

    // Inizializza i grafici
    ChartsManager.init();

    // Gestione selettori grafici
    const exSelect = document.getElementById("chart-exercise-select");
    const metricSelect = document.getElementById("chart-metric-select");
    const rtSelect = document.getElementById("chart-routine-select");

    if (exSelect) {
      exSelect.addEventListener("change", () => {
        ChartsManager.renderExerciseChart(exSelect.value, metricSelect ? metricSelect.value : "both");
      });
    }
    if (metricSelect) {
      metricSelect.addEventListener("change", () => {
        ChartsManager.renderExerciseChart(exSelect ? exSelect.value : "", metricSelect.value);
      });
    }
    if (rtSelect) {
      rtSelect.addEventListener("change", () => {
        ChartsManager.renderRoutineChart(rtSelect.value);
      });
    }

    // Tab switcher in statistiche (Grafici vs Storico)
    const tabCharts = document.getElementById("tab-btn-charts");
    const tabHistory = document.getElementById("tab-btn-history");
    const panelCharts = document.getElementById("stats-panel-charts");
    const panelHistory = document.getElementById("stats-panel-history");

    if (tabCharts && tabHistory && panelCharts && panelHistory) {
      tabCharts.addEventListener("click", () => {
        tabCharts.className = "btn btn-primary btn-sm flex-1";
        tabHistory.className = "btn btn-secondary btn-sm flex-1";
        panelCharts.style.display = "block";
        panelHistory.style.display = "none";
        ChartsManager.renderCurrentCharts();
      });

      tabHistory.addEventListener("click", () => {
        tabHistory.className = "btn btn-primary btn-sm flex-1";
        tabCharts.className = "btn btn-secondary btn-sm flex-1";
        panelCharts.style.display = "none";
        panelHistory.style.display = "block";
        this.renderHistoryList();
      });
    }
  },

  // ================= 1. NAVIGAZIONE =================
  bindNavigation() {
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetView = btn.getAttribute("data-view");
        this.switchView(targetView);
      });
    });

    const btnQuick = document.getElementById("btn-start-quick-workout");
    if (btnQuick) {
      btnQuick.addEventListener("click", () => this.startQuickWorkout());
    }

    const btnGoToRoutines = document.getElementById("btn-goto-routines");
    if (btnGoToRoutines) {
      btnGoToRoutines.addEventListener("click", () => this.switchView("view-routines"));
    }
  },

  switchView(viewId) {
    this.currentView = viewId;

    document.querySelectorAll(".nav-item").forEach(btn => {
      if (btn.getAttribute("data-view") === viewId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    document.querySelectorAll(".view-section").forEach(sec => {
      if (sec.id === viewId) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    if (viewId === "view-routines") {
      this.renderRoutines();
    } else if (viewId === "view-active") {
      this.renderActiveWorkout();
    } else if (viewId === "view-stats") {
      ChartsManager.populateSelectors();
      ChartsManager.renderCurrentCharts();
      this.renderHistoryList();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  updateActiveNavBadge() {
    const dot = document.getElementById("nav-active-dot");
    if (dot) {
      dot.style.display = this.activeWorkout ? "block" : "none";
    }
  },

  // ================= 2. GESTIONE ROUTINE =================
  renderRoutines() {
    const container = document.getElementById("routines-list-container");
    if (!container) return;

    const routines = Store.getRoutines();
    if (routines.length === 0) {
      container.innerHTML = `
        <div class="card text-center" style="padding: 30px 16px;">
          <p style="color: var(--text-secondary); margin-bottom: 12px;">Nessuna scheda salvata.</p>
          <button class="btn btn-primary btn-sm" onclick="App.openRoutineEditor()">Crea la tua prima scheda</button>
        </div>
      `;
      return;
    }

    container.innerHTML = routines.map(r => {
      const exerciseCount = r.exercises ? r.exercises.length : 0;
      const previewExercises = (r.exercises || []).slice(0, 3).map(ex => {
        const setsCount = ex.sets ? ex.sets.length : 0;
        const firstSet = ex.sets && ex.sets[0] ? `${ex.sets[0].weight}kg × ${ex.sets[0].reps}` : "";
        const mGroup = detectMuscleGroup(ex.name);
        return `
          <div class="preview-item">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="anatomy-thumb-btn" style="cursor: pointer;" onclick="event.stopPropagation(); Anatomy.openModal('${this.escapeHtml(ex.name)}', '${mGroup}')" title="Visualizza anatomia">
                ${Anatomy.getSvg(mGroup, 26, 32, ex.name)}
              </span>
              <span>${this.escapeHtml(ex.name)}</span>
            </div>
            <span class="preview-sets">${setsCount} serie ${firstSet ? '(' + firstSet + ')' : ''}</span>
          </div>
        `;
      }).join("");

      return `
        <div class="routine-card" data-id="${r.id}">
          <div class="routine-header">
            <div>
              <h2 class="routine-title">${this.escapeHtml(r.name)}</h2>
              <div class="routine-meta">${exerciseCount} esercizi</div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="icon-btn" onclick="App.duplicateRoutine('${r.id}')" title="Duplica Scheda">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button class="icon-btn" onclick="App.openRoutineEditor('${r.id}')" title="Modifica Scheda">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn" onclick="App.deleteRoutine('${r.id}')" title="Elimina Scheda" style="color: var(--accent-red);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
          ${r.description ? `<p class="routine-desc">${this.escapeHtml(r.description)}</p>` : ""}
          <div class="routine-exercise-preview">
            ${previewExercises}
            ${exerciseCount > 3 ? `<div class="preview-item" style="color: var(--text-muted); font-style: italic;">+ altri ${exerciseCount - 3} esercizi</div>` : ""}
          </div>
          <div class="routine-actions">
            <button class="btn btn-primary" onclick="App.startWorkoutFromRoutine('${r.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Avvia Allenamento
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  openRoutineEditor(routineId = null) {
    const modal = document.getElementById("modal-routine-editor");
    const titleEl = document.getElementById("routine-editor-title");
    const idEl = document.getElementById("edit-routine-id");
    const nameEl = document.getElementById("edit-routine-name");
    const descEl = document.getElementById("edit-routine-desc");

    if (routineId) {
      const routine = Store.getRoutineById(routineId);
      if (!routine) return;
      titleEl.textContent = "Modifica Scheda";
      idEl.value = routine.id;
      nameEl.value = routine.name;
      descEl.value = routine.description || "";
      this.currentEditorExercises = JSON.parse(JSON.stringify(routine.exercises || []));
    } else {
      titleEl.textContent = "Nuova Scheda";
      idEl.value = "";
      nameEl.value = "";
      descEl.value = "";
      this.currentEditorExercises = [];
    }

    this.renderEditorExercises();
    modal.classList.add("open");
  },

  renderEditorExercises() {
    const container = document.getElementById("editor-exercises-list");
    if (!container) return;

    if (!this.currentEditorExercises || this.currentEditorExercises.length === 0) {
      container.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 16px;">Nessun esercizio aggiunto. Clicca "+ Aggiungi Esercizio".</p>`;
      return;
    }

    container.innerHTML = this.currentEditorExercises.map((ex, exIdx) => {
      const mGroup = detectMuscleGroup(ex.name);
      const setsHtml = (ex.sets || []).map((s, sIdx) => `
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); width: 20px;">S${sIdx + 1}</span>
          <input type="number" class="input-stepper" style="height: 32px;" value="${s.weight}" step="0.5" placeholder="kg" onchange="App.updateEditorSet(${exIdx}, ${sIdx}, 'weight', this.value)">
          <span style="font-size: 0.8rem; color: var(--text-muted);">kg ×</span>
          <input type="number" class="input-stepper" style="height: 32px;" value="${s.reps}" step="1" placeholder="reps" onchange="App.updateEditorSet(${exIdx}, ${sIdx}, 'reps', this.value)">
          <span style="font-size: 0.8rem; color: var(--text-muted);">rep</span>
          <button type="button" class="icon-btn" style="width: 32px; height: 32px; color: var(--accent-red);" onclick="App.removeEditorSet(${exIdx}, ${sIdx})">✕</button>
        </div>
      `).join("");

      return `
        <div class="card" style="margin-bottom: 12px; padding: 12px; background-color: var(--bg-card);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" class="anatomy-thumb-btn" onclick="Anatomy.openModal('${this.escapeHtml(ex.name)}', '${mGroup}')" title="Visualizza muscoli bersaglio">
                ${Anatomy.getSvg(mGroup, 32, 38, ex.name)}
              </button>
              <div>
                <strong style="font-size: 0.95rem;">${this.escapeHtml(ex.name)}</strong>
                <div style="font-size: 0.72rem; color: var(--accent-blue); font-weight: 600;">${mGroup}</div>
              </div>
            </div>
            <button type="button" class="icon-btn" style="color: var(--accent-red);" onclick="App.removeEditorExercise(${exIdx})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <div>
              <label class="form-label" style="font-size: 0.72rem;">Recupero (secondi)</label>
              <input type="number" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" value="${ex.restSeconds || 90}" step="15" onchange="App.updateEditorExerciseRest(${exIdx}, this.value)">
            </div>
            <div>
              <label class="form-label" style="font-size: 0.72rem;">Note esecuzione</label>
              <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" value="${this.escapeHtml(ex.notes || '')}" placeholder="es. presa stretta" onchange="App.updateEditorExerciseNotes(${exIdx}, this.value)">
            </div>
          </div>

          <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">Serie Programmate</label>
          ${setsHtml}

          <button type="button" class="btn-add-set" onclick="App.addEditorSet(${exIdx})">
            + Aggiungi Serie
          </button>
        </div>
      `;
    }).join("");
  },

  updateEditorExerciseRest(exIdx, val) {
    if (this.currentEditorExercises[exIdx]) {
      this.currentEditorExercises[exIdx].restSeconds = Math.max(15, parseInt(val, 10) || 90);
    }
  },

  updateEditorExerciseNotes(exIdx, val) {
    if (this.currentEditorExercises[exIdx]) {
      this.currentEditorExercises[exIdx].notes = val;
    }
  },

  updateEditorSet(exIdx, sIdx, field, val) {
    if (this.currentEditorExercises[exIdx] && this.currentEditorExercises[exIdx].sets[sIdx]) {
      this.currentEditorExercises[exIdx].sets[sIdx][field] = Number(val) || 0;
    }
  },

  addEditorSet(exIdx) {
    if (this.currentEditorExercises[exIdx]) {
      const sets = this.currentEditorExercises[exIdx].sets;
      const last = sets[sets.length - 1] || { weight: 50, reps: 10 };
      sets.push({ weight: last.weight, reps: last.reps });
      this.renderEditorExercises();
    }
  },

  removeEditorSet(exIdx, sIdx) {
    if (this.currentEditorExercises[exIdx]) {
      this.currentEditorExercises[exIdx].sets.splice(sIdx, 1);
      this.renderEditorExercises();
    }
  },

  removeEditorExercise(exIdx) {
    this.currentEditorExercises.splice(exIdx, 1);
    this.renderEditorExercises();
  },

  saveRoutineFromEditor() {
    const id = document.getElementById("edit-routine-id").value;
    const name = document.getElementById("edit-routine-name").value.trim();
    const desc = document.getElementById("edit-routine-desc").value.trim();

    if (!name) {
      this.showToast("Inserisci un nome per la scheda.");
      return;
    }

    const routine = {
      id: id || "routine_" + Date.now(),
      name,
      description: desc,
      updatedAt: new Date().toISOString(),
      exercises: this.currentEditorExercises || []
    };

    Store.saveRoutine(routine);
    this.closeModal("modal-routine-editor");
    this.renderRoutines();
    ChartsManager.populateSelectors();
    this.showToast(`Scheda "${name}" salvata con successo!`);
  },

  duplicateRoutine(id) {
    const copy = Store.duplicateRoutine(id);
    if (copy) {
      this.renderRoutines();
      ChartsManager.populateSelectors();
      this.showToast(`Scheda duplicata: ${copy.name}`);
    }
  },

  deleteRoutine(id) {
    const routine = Store.getRoutineById(id);
    if (!routine) return;
    if (confirm(`Sei sicuro di voler eliminare la scheda "${routine.name}"?`)) {
      Store.deleteRoutine(id);
      this.renderRoutines();
      ChartsManager.populateSelectors();
      this.showToast(`Scheda eliminata.`);
    }
  },

  // ================= 3. ESECUZIONE ALLENAMENTO ATTIVO =================
  startWorkoutFromRoutine(routineId) {
    const routine = Store.getRoutineById(routineId);
    if (!routine) return;

    if (this.activeWorkout) {
      if (!confirm("C'è già un allenamento in corso. Vuoi abbandonarlo per avviare questo?")) {
        this.switchView("view-active");
        return;
      }
    }

    this.activeWorkout = {
      id: "workout_" + Date.now(),
      routineId: routine.id,
      routineName: routine.name,
      startTime: Date.now(),
      exercises: (routine.exercises || []).map(ex => ({
        name: ex.name,
        notes: ex.notes || "",
        restSeconds: ex.restSeconds || 90,
        sets: (ex.sets || []).map((s, idx) => ({
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
          completed: false
        }))
      }))
    };

    Store.saveActiveWorkout(this.activeWorkout);
    this.startWorkoutTimer();
    this.updateActiveNavBadge();
    this.switchView("view-active");
    this.showToast(`Iniziato allenamento: ${routine.name}`);
  },

  startQuickWorkout() {
    this.activeWorkout = {
      id: "workout_" + Date.now(),
      routineId: null,
      routineName: "Sessione Libera",
      startTime: Date.now(),
      exercises: []
    };
    Store.saveActiveWorkout(this.activeWorkout);
    this.startWorkoutTimer();
    this.updateActiveNavBadge();
    this.switchView("view-active");
    this.openExercisePicker("active_workout");
  },

  resumeActiveWorkout() {
    this.startWorkoutTimer();
    this.updateActiveNavBadge();
    if (this.currentView === "view-active") {
      this.renderActiveWorkout();
    }
  },

  startWorkoutTimer() {
    if (this.workoutTimerInterval) clearInterval(this.workoutTimerInterval);
    this.updateElapsedDisplay();
    this.workoutTimerInterval = setInterval(() => this.updateElapsedDisplay(), 1000);
  },

  updateElapsedDisplay() {
    if (!this.activeWorkout || !this.activeWorkout.startTime) return;
    const diffSec = Math.floor((Date.now() - this.activeWorkout.startTime) / 1000);
    const hrs = Math.floor(diffSec / 3600);
    const mins = Math.floor((diffSec % 3600) / 60);
    const secs = diffSec % 60;

    const formatted = hrs > 0
      ? `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
      : `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const timerEl = document.getElementById("active-elapsed-time");
    if (timerEl) timerEl.textContent = formatted;
  },

  /**
   * Genera i badge PR (💪 Carico Max e 🏅 Miglior Serie) per un esercizio
   */
  generatePRBadgesHtml(exerciseName, sets = [], exIdx = null) {
    const prs = Store.checkExercisePRs(exerciseName, sets);
    let badges = [];

    if (prs.isMaxWeightPR) {
      badges.push(`
        <span class="pr-badge pr-badge-weight" onclick="App.showPRToast('weight', '${this.escapeHtml(exerciseName)}', ${prs.currentMaxWeight}, ${prs.prevMaxWeight})" title="Record Carico Max: ${prs.currentMaxWeight} kg (Precedente: ${prs.prevMaxWeight} kg)">
          💪 <span class="pr-badge-text">PR ${prs.currentMaxWeight}kg</span>
        </span>
      `);
    }

    if (prs.isMaxVolumePR) {
      badges.push(`
        <span class="pr-badge pr-badge-volume" onclick="App.showPRToast('volume', '${this.escapeHtml(exerciseName)}', ${prs.currentMaxVolume}, ${prs.prevMaxVolume})" title="Record Miglior Serie (kg × reps): ${prs.currentMaxVolume} kg (Precedente: ${prs.prevMaxVolume} kg)">
          🏅 <span class="pr-badge-text">Record ${prs.currentMaxVolume}kg</span>
        </span>
      `);
    }

    const idAttr = exIdx !== null ? `id="pr-badges-wrap-${exIdx}"` : "";
    return `<div class="pr-badges-wrap" ${idAttr}>${badges.join("")}</div>`;
  },

  showPRToast(type, exerciseName, current, prev) {
    if (type === "weight") {
      this.showToast(`💪 RECORD CARICO MAX su ${exerciseName}: ${current} kg! (Superato il precedente record di ${prev} kg)`);
    } else {
      this.showToast(`🏅 RECORD MIGLIOR SERIE (kg × reps) su ${exerciseName}: ${current} kg! (Superato il precedente record di ${prev} kg)`);
    }
  },

  renderActiveWorkout() {
    const emptyState = document.getElementById("active-empty-state");
    const container = document.getElementById("active-workout-container");
    const nameEl = document.getElementById("active-routine-name");
    const statsEl = document.getElementById("active-summary-stats");
    const listEl = document.getElementById("active-exercises-list");

    if (!this.activeWorkout) {
      if (emptyState) emptyState.style.display = "block";
      if (container) container.style.display = "none";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (container) container.style.display = "block";

    if (nameEl) nameEl.textContent = this.activeWorkout.routineName || "Allenamento";

    let totalCompletedSets = 0;
    let totalAllSets = 0;
    let totalVolume = 0;

    (this.activeWorkout.exercises || []).forEach(ex => {
      (ex.sets || []).forEach(s => {
        totalAllSets++;
        if (s.completed) {
          totalCompletedSets++;
          totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });

    if (statsEl) {
      statsEl.textContent = `${totalCompletedSets}/${totalAllSets} serie • ${totalVolume.toLocaleString("it-IT")} kg`;
    }

    if (!listEl) return;
    if (this.activeWorkout.exercises.length === 0) {
      listEl.innerHTML = `
        <div class="card text-center" style="padding: 24px;">
          <p style="color: var(--text-secondary); margin-bottom: 10px;">Nessun esercizio aggiunto a questo allenamento.</p>
          <button class="btn btn-primary btn-sm" onclick="App.openExercisePicker('active_workout')">+ Aggiungi Esercizio</button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.activeWorkout.exercises.map((ex, exIdx) => {
      const lastSessionInfo = Store.getLastSessionForExercise(ex.name);
      const lastSetsText = (lastSessionInfo && lastSessionInfo.exercise && lastSessionInfo.exercise.sets)
        ? lastSessionInfo.exercise.sets.filter(s => s.completed)
        : [];

      const suggestion = Store.getProgressiveOverloadSuggestion(ex.name, ex.sets);
      const mGroup = detectMuscleGroup(ex.name);
      const prBadgesHtml = this.generatePRBadgesHtml(ex.name, ex.sets, exIdx);

      const setsRows = (ex.sets || []).map((s, sIdx) => {
        const prevSet = lastSetsText[sIdx];
        const prevLabel = prevSet ? `${prevSet.weight}kg × ${prevSet.reps}` : "-";

        return `
          <div class="set-row ${s.completed ? 'completed' : ''}" id="row-${exIdx}-${sIdx}">
            <div class="set-num-badge">${s.setNumber || sIdx + 1}</div>
            <div class="set-prev-info" title="Prestazione sessione precedente">${prevLabel}</div>
            <div>
              <input type="number" inputmode="decimal" class="input-stepper" 
                value="${s.weight}" step="0.5" 
                onchange="App.handleSetInputChange(${exIdx}, ${sIdx}, 'weight', this.value)"
                aria-label="Carico kg">
            </div>
            <div>
              <input type="number" inputmode="numeric" class="input-stepper" 
                value="${s.reps}" step="1" 
                onchange="App.handleSetInputChange(${exIdx}, ${sIdx}, 'reps', this.value)"
                aria-label="Ripetizioni">
            </div>
            <div>
              <button type="button" class="btn-set-check" 
                onclick="App.toggleSetCompletion(${exIdx}, ${sIdx})" 
                aria-label="Segna serie completata">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="exercise-box" data-exercise-index="${exIdx}">
          
          <!-- Intestazione con Miniatura Anatomica SVG e Badge PR -->
          <div class="exercise-header">
            <div class="exercise-main-header">
              <button type="button" class="anatomy-thumb-btn" onclick="Anatomy.openModal('${this.escapeHtml(ex.name)}', '${mGroup}')" title="Tocca per ingrandire l'illustrazione anatomica">
                ${Anatomy.getSvg(mGroup, 38, 46, ex.name)}
              </button>
              
              <div class="exercise-header-details">
                <div class="exercise-title-line">
                  <h3 class="exercise-title">${this.escapeHtml(ex.name)}</h3>
                  <button class="icon-btn" style="color: var(--text-muted); width: 32px; height: 32px;" onclick="App.removeExerciseFromActive(${exIdx})" title="Rimuovi Esercizio">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 2px;">
                  <span class="exercise-category-pill">${mGroup}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">
                    Recupero: <strong style="color: var(--accent-blue); cursor: pointer;" onclick="App.editExerciseRest(${exIdx})">${ex.restSeconds || 90}s</strong>
                  </span>
                </div>

                <!-- Contenitore Badge PR in Tempo Reale -->
                <div id="pr-slot-${exIdx}">${prBadgesHtml}</div>
              </div>
            </div>
          </div>

          <input type="text" class="exercise-notes-input" 
            placeholder="Aggiungi note (es. sensazioni, drop set...)" 
            value="${this.escapeHtml(ex.notes || '')}"
            onchange="App.updateActiveExerciseNotes(${exIdx}, this.value)">

          ${suggestion ? `
            <div class="exercise-suggestion-banner" onclick="App.applyOverloadSuggestion(${exIdx}, '${suggestion.type}', ${suggestion.value})">
              <span class="badge-progression">⚡ ${suggestion.text}</span>
              <span style="font-size: 0.72rem; color: var(--text-secondary); margin-left: 6px;">Tocca per applicare</span>
            </div>
          ` : ""}

          <!-- Intestazione Tabella Serie -->
          <div class="sets-grid-header">
            <div>SET</div>
            <div style="text-align: left; padding-left: 4px;">PREC.</div>
            <div>KG</div>
            <div>REPS</div>
            <div>✓</div>
          </div>

          <!-- Righe Serie -->
          ${setsRows}

          <button type="button" class="btn-add-set" onclick="App.addSetToActiveExercise(${exIdx})">
            + Aggiungi Serie
          </button>
        </div>
      `;
    }).join("");
  },

  handleSetInputChange(exIdx, sIdx, field, val) {
    if (!this.activeWorkout || !this.activeWorkout.exercises[exIdx]) return;
    const ex = this.activeWorkout.exercises[exIdx];
    const set = ex.sets[sIdx];
    if (set) {
      set[field] = Number(val) || 0;
      Store.saveActiveWorkout(this.activeWorkout);
      this.updateActiveHeaderStats();
      this.updateExercisePRsRealtime(exIdx);
    }
  },

  /**
   * Aggiorna in tempo reale i badge PR 💪 e 🏅 senza rigenerare l'intero DOM dell'esercizio
   */
  updateExercisePRsRealtime(exIdx) {
    if (!this.activeWorkout || !this.activeWorkout.exercises[exIdx]) return;
    const ex = this.activeWorkout.exercises[exIdx];
    const slotEl = document.getElementById(`pr-slot-${exIdx}`);
    if (slotEl) {
      const prevBadgesCount = slotEl.querySelectorAll(".pr-badge").length;
      slotEl.innerHTML = this.generatePRBadgesHtml(ex.name, ex.sets, exIdx);
      const newBadgesCount = slotEl.querySelectorAll(".pr-badge").length;
      
      // Se è comparso un nuovo badge PR per la prima volta
      if (newBadgesCount > prevBadgesCount) {
        if ("vibrate" in navigator) {
          navigator.vibrate([40, 60, 80]);
        }
        this.showToast(`🔥 Nuovo Record Personale su ${ex.name}!`);
      }
    }
  },

  updateActiveExerciseNotes(exIdx, val) {
    if (this.activeWorkout && this.activeWorkout.exercises[exIdx]) {
      this.activeWorkout.exercises[exIdx].notes = val;
      Store.saveActiveWorkout(this.activeWorkout);
    }
  },

  editExerciseRest(exIdx) {
    const ex = this.activeWorkout.exercises[exIdx];
    if (!ex) return;
    const current = ex.restSeconds || 90;
    const res = prompt("Imposta tempo di recupero in secondi:", current);
    if (res !== null) {
      const parsed = Math.max(15, parseInt(res, 10) || 90);
      ex.restSeconds = parsed;
      Store.saveActiveWorkout(this.activeWorkout);
      this.renderActiveWorkout();
    }
  },

  toggleSetCompletion(exIdx, sIdx) {
    if (!this.activeWorkout || !this.activeWorkout.exercises[exIdx]) return;
    const ex = this.activeWorkout.exercises[exIdx];
    const set = ex.sets[sIdx];
    if (!set) return;

    set.completed = !set.completed;
    Store.saveActiveWorkout(this.activeWorkout);

    if ("vibrate" in navigator) {
      navigator.vibrate(20);
    }

    if (set.completed) {
      const restSec = ex.restSeconds || 90;
      RestTimer.start(restSec, ex.name);
      this.showToast(`Serie completata! Recupero: ${restSec}s`);
    }

    const rowEl = document.getElementById(`row-${exIdx}-${sIdx}`);
    if (rowEl) {
      if (set.completed) {
        rowEl.classList.add("completed");
      } else {
        rowEl.classList.remove("completed");
      }
    }
    this.updateActiveHeaderStats();
    this.updateExercisePRsRealtime(exIdx);
  },

  updateActiveHeaderStats() {
    let totalCompleted = 0;
    let totalSets = 0;
    let totalVolume = 0;

    (this.activeWorkout.exercises || []).forEach(ex => {
      (ex.sets || []).forEach(s => {
        totalSets++;
        if (s.completed) {
          totalCompleted++;
          totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });

    const statsEl = document.getElementById("active-summary-stats");
    if (statsEl) {
      statsEl.textContent = `${totalCompleted}/${totalSets} serie • ${totalVolume.toLocaleString("it-IT")} kg`;
    }
  },

  applyOverloadSuggestion(exIdx, type, val) {
    if (!this.activeWorkout || !this.activeWorkout.exercises[exIdx]) return;
    const ex = this.activeWorkout.exercises[exIdx];
    if (!ex.sets) return;

    if (type === "weight") {
      ex.sets.forEach(s => {
        s.weight = (Number(s.weight) || 0) + val;
      });
      this.showToast(`Incrementato carico di +${val} kg su tutte le serie!`);
    } else {
      ex.sets.forEach(s => {
        s.reps = (Number(s.reps) || 0) + val;
      });
      this.showToast(`Aggiunta +${val} rep a ogni serie!`);
    }

    Store.saveActiveWorkout(this.activeWorkout);
    this.renderActiveWorkout();
  },

  addSetToActiveExercise(exIdx) {
    if (!this.activeWorkout || !this.activeWorkout.exercises[exIdx]) return;
    const sets = this.activeWorkout.exercises[exIdx].sets;
    const last = sets[sets.length - 1] || { weight: 50, reps: 10 };
    sets.push({
      setNumber: sets.length + 1,
      weight: last.weight,
      reps: last.reps,
      completed: false
    });
    Store.saveActiveWorkout(this.activeWorkout);
    this.renderActiveWorkout();
  },

  removeExerciseFromActive(exIdx) {
    if (!this.activeWorkout) return;
    const ex = this.activeWorkout.exercises[exIdx];
    if (confirm(`Rimuovere "${ex.name}" da questo allenamento?`)) {
      this.activeWorkout.exercises.splice(exIdx, 1);
      Store.saveActiveWorkout(this.activeWorkout);
      this.renderActiveWorkout();
    }
  },

  cancelActiveWorkout() {
    if (!this.activeWorkout) return;
    if (confirm("Sei sicuro di voler annullare e cancellare questo allenamento in corso?")) {
      if (this.workoutTimerInterval) clearInterval(this.workoutTimerInterval);
      RestTimer.stop();
      Store.clearActiveWorkout();
      this.activeWorkout = null;
      this.updateActiveNavBadge();
      this.renderActiveWorkout();
      this.showToast("Allenamento annullato.");
    }
  },

  finishActiveWorkout() {
    if (!this.activeWorkout) return;

    let completedSetsCount = 0;
    let totalVolume = 0;
    const exercisesData = [];

    (this.activeWorkout.exercises || []).forEach(ex => {
      const completedSets = (ex.sets || []).filter(s => s.completed);
      if (completedSets.length > 0) {
        completedSetsCount += completedSets.length;
        completedSets.forEach(s => {
          totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        });
      }
      exercisesData.push({
        name: ex.name,
        notes: ex.notes || "",
        sets: (ex.sets || []).map(s => ({
          setNumber: s.setNumber,
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          completed: !!s.completed
        }))
      });
    });

    if (completedSetsCount === 0) {
      if (!confirm("Non hai completato nessuna serie con la spunta. Vuoi terminare comunque?")) {
        return;
      }
    }

    const durationMin = Math.max(1, Math.round((Date.now() - this.activeWorkout.startTime) / 60000));

    // Raccoglie tutti i record personali battuti
    const newPRs = [];
    exercisesData.forEach(ex => {
      const prs = Store.checkExercisePRs(ex.name, ex.sets);
      if (prs.isMaxWeightPR) {
        newPRs.push(`💪 ${ex.name}: Nuovo record di carico ${prs.currentMaxWeight} kg (prec: ${prs.prevMaxWeight} kg)!`);
      }
      if (prs.isMaxVolumePR) {
        newPRs.push(`🏅 ${ex.name}: Nuovo record serie ${prs.currentMaxVolume} kg (prec: ${prs.prevMaxVolume} kg)!`);
      }
    });

    const finishedSession = {
      id: this.activeWorkout.id,
      routineId: this.activeWorkout.routineId,
      routineName: this.activeWorkout.routineName || "Allenamento",
      date: new Date().toISOString(),
      durationMinutes: durationMin,
      totalVolumeKg: totalVolume,
      exercises: exercisesData
    };

    this.finishSummaryData = finishedSession;

    const nameEl = document.getElementById("summary-workout-name");
    const durEl = document.getElementById("summary-duration");
    const volEl = document.getElementById("summary-volume");
    const setsEl = document.getElementById("summary-sets");
    const prsEl = document.getElementById("summary-prs-container");

    if (nameEl) nameEl.textContent = finishedSession.routineName;
    if (durEl) durEl.textContent = `${durationMin} min`;
    if (volEl) volEl.textContent = `${totalVolume.toLocaleString("it-IT")} kg`;
    if (setsEl) setsEl.textContent = completedSetsCount;

    if (prsEl) {
      if (newPRs.length > 0) {
        prsEl.innerHTML = newPRs.map(pr => `
          <div class="badge-progression" style="display: block; margin-bottom: 6px; padding: 8px 12px; font-size: 0.85rem; text-align: left;">
            ${this.escapeHtml(pr)}
          </div>
        `).join("");
      } else {
        prsEl.innerHTML = "";
      }
    }

    const modal = document.getElementById("modal-workout-summary");
    if (modal) modal.classList.add("open");
  },

  confirmSaveAndCloseSummary() {
    if (!this.finishSummaryData) return;

    const chkUpdate = document.getElementById("chk-update-routine-loads");
    const shouldUpdate = chkUpdate ? chkUpdate.checked : true;

    Store.saveWorkoutSession(this.finishSummaryData, shouldUpdate);

    if (this.workoutTimerInterval) clearInterval(this.workoutTimerInterval);
    RestTimer.stop();
    Store.clearActiveWorkout();
    this.activeWorkout = null;
    this.finishSummaryData = null;

    this.closeModal("modal-workout-summary");
    this.updateActiveNavBadge();

    ChartsManager.populateSelectors();
    ChartsManager.renderCurrentCharts();
    this.renderHistoryList();
    this.switchView("view-stats");

    this.showToast("Ottimo lavoro! Allenamento registrato con successo.");
  },

  // ================= 4. SELETTORE ESERCIZI (LIBRERIA 90+ E AUTOCOMPLETAMENTO) =================
  bindExercisePickerFilters() {
    const filterContainer = document.getElementById("picker-muscle-filter");
    if (!filterContainer) return;

    filterContainer.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        filterContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.pickerMuscleFilter = chip.getAttribute("data-group") || "Tutti";
        const searchInput = document.getElementById("search-exercise-input");
        this.renderPickerExercises(searchInput ? searchInput.value : "");
      });
    });
  },

  openExercisePicker(context = "editor") {
    this.activeExercisePickerContext = context;
    const modal = document.getElementById("modal-exercise-picker");
    const searchInput = document.getElementById("search-exercise-input");
    const customInput = document.getElementById("custom-exercise-name");

    if (searchInput) searchInput.value = "";
    if (customInput) customInput.value = "";

    this.pickerMuscleFilter = "Tutti";
    const filterContainer = document.getElementById("picker-muscle-filter");
    if (filterContainer) {
      filterContainer.querySelectorAll(".filter-chip").forEach(c => {
        if (c.getAttribute("data-group") === "Tutti") c.classList.add("active");
        else c.classList.remove("active");
      });
    }

    this.renderPickerExercises("");
    modal.classList.add("open");

    if (searchInput) {
      searchInput.oninput = (e) => this.renderPickerExercises(e.target.value);
    }
  },

  renderPickerExercises(query = "") {
    const listEl = document.getElementById("picker-exercises-list");
    const subtitleEl = document.getElementById("picker-subtitle");
    if (!listEl) return;

    const q = query.trim().toLowerCase();
    const groupFilter = this.pickerMuscleFilter;

    const filtered = DEFAULT_EXERCISES.filter(ex => {
      // Filtro per gruppo muscolare
      if (groupFilter !== "Tutti" && ex.muscleGroup !== groupFilter) {
        return false;
      }
      // Filtro per ricerca testuale bilingue
      if (!q) return true;
      return (
        ex.name.toLowerCase().includes(q) ||
        (ex.nameIt && ex.nameIt.toLowerCase().includes(q)) ||
        (ex.nameEn && ex.nameEn.toLowerCase().includes(q)) ||
        (ex.category && ex.category.toLowerCase().includes(q)) ||
        (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(q))
      );
    });

    if (subtitleEl) {
      subtitleEl.textContent = `${filtered.length} esercizi trovati ${groupFilter !== 'Tutti' ? 'in ' + groupFilter : ''}`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 24px 16px; color: var(--text-muted); text-align: center;">
          <p style="margin-bottom: 8px;">Nessun esercizio trovato per "${this.escapeHtml(query)}".</p>
          <p style="font-size: 0.8rem;">Puoi crearlo subito usando il campo personalizzato sopra!</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(ex => {
      const mGroup = ex.muscleGroup || detectMuscleGroup(ex.name);
      return `
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; margin-bottom: 8px; cursor: pointer;" onclick="App.selectExerciseFromPicker('${this.escapeHtml(ex.name)}', ${ex.defaultRest})">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
            <button type="button" class="anatomy-thumb-btn" onclick="event.stopPropagation(); Anatomy.openModal('${this.escapeHtml(ex.name)}', '${mGroup}')" title="Visualizza anatomia">
              ${Anatomy.getSvg(mGroup, 34, 40, ex.name)}
            </button>
            <div style="min-width: 0; flex: 1;">
              <div style="font-weight: 700; font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${this.escapeHtml(ex.nameIt || ex.name)}
              </div>
              <div class="picker-item-sub">
                ${ex.nameEn ? `<span style="color: var(--text-secondary);">${this.escapeHtml(ex.nameEn)}</span> • ` : ''}
                <span style="color: var(--accent-blue); font-weight: 600;">${mGroup}</span> • ${ex.defaultRest}s
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-left: 8px;">+ Scegli</button>
        </div>
      `;
    }).join("");
  },

  selectExerciseFromPicker(name, defaultRest = 90) {
    if (this.activeExercisePickerContext === "editor") {
      this.currentEditorExercises = this.currentEditorExercises || [];
      this.currentEditorExercises.push({
        id: "ex_" + Date.now(),
        name,
        notes: "",
        restSeconds: defaultRest,
        sets: [
          { weight: 50, reps: 8 },
          { weight: 50, reps: 8 },
          { weight: 50, reps: 8 }
        ]
      });
      this.renderEditorExercises();
    } else if (this.activeExercisePickerContext === "active_workout") {
      if (this.activeWorkout) {
        this.activeWorkout.exercises.push({
          name,
          notes: "",
          restSeconds: defaultRest,
          sets: [
            { setNumber: 1, weight: 50, reps: 8, completed: false },
            { setNumber: 2, weight: 50, reps: 8, completed: false },
            { setNumber: 3, weight: 50, reps: 8, completed: false }
          ]
        });
        Store.saveActiveWorkout(this.activeWorkout);
        this.renderActiveWorkout();
      }
    }

    this.closeModal("modal-exercise-picker");
    this.showToast(`Aggiunto: ${name}`);
  },

  addCustomExercise() {
    const input = document.getElementById("custom-exercise-name");
    const name = input ? input.value.trim() : "";
    if (!name) {
      this.showToast("Inserisci il nome del nuovo esercizio.");
      return;
    }
    const detected = detectMuscleGroup(name);
    this.selectExerciseFromPicker(name, 90);
    this.showToast(`Esercizio personalizzato aggiunto! Gruppo muscolare associato: ${detected}`);
  },

  // ================= 5. STORICO SESSIONI =================
  renderHistoryList() {
    const container = document.getElementById("history-cards-container");
    if (!container) return;

    const history = Store.getHistory();
    if (history.length === 0) {
      container.innerHTML = `
        <div class="card text-center" style="padding: 30px 16px;">
          <p style="color: var(--text-secondary);">Nessun allenamento completato ancora.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = history.map(item => {
      const d = new Date(item.date);
      const formattedDate = d.toLocaleDateString("it-IT", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      });

      const exercisesSummary = (item.exercises || []).map(ex => {
        const completedSets = (ex.sets || []).filter(s => s.completed);
        const setStrings = completedSets.map(s => `${s.weight}kg × ${s.reps}`).join(", ");
        const mGroup = detectMuscleGroup(ex.name);
        
        // Calcola se questo esercizio ha avuto un PR in questa sessione
        const prs = Store.checkExercisePRs(ex.name, ex.sets, item.id);
        const prBadges = [];
        if (prs.isMaxWeightPR) prBadges.push(`<span class="pr-badge pr-badge-weight" style="font-size: 0.65rem; padding: 1px 6px;">💪 PR ${prs.currentMaxWeight}kg</span>`);
        if (prs.isMaxVolumePR) prBadges.push(`<span class="pr-badge pr-badge-volume" style="font-size: 0.65rem; padding: 1px 6px;">🏅 Record ${prs.currentMaxVolume}kg</span>`);

        return `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" class="anatomy-thumb-btn" onclick="Anatomy.openModal('${this.escapeHtml(ex.name)}', '${mGroup}')" title="Visualizza anatomia">
                ${Anatomy.getSvg(mGroup, 24, 30, ex.name)}
              </button>
              <div>
                <strong>${this.escapeHtml(ex.name)}</strong>
                <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.76rem;">${setStrings || 'Nessuna serie completata'}</div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
              ${prBadges.join("")}
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="history-item-card">
          <div class="history-item-header">
            <div>
              <h3 class="history-item-title">${this.escapeHtml(item.routineName || "Allenamento")}</h3>
              <div class="history-item-date">${formattedDate}</div>
            </div>
            <button class="icon-btn" style="color: var(--accent-red);" onclick="App.deleteHistoryItem('${item.id}')" title="Elimina dallo storico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </div>
          <div class="history-metrics-row">
            <div>Volume: <span>${(item.totalVolumeKg || 0).toLocaleString("it-IT")} kg</span></div>
            <div>Durata: <span>${item.durationMinutes || 0} min</span></div>
            <div>Esercizi: <span>${(item.exercises || []).length}</span></div>
          </div>
          <div style="background-color: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            ${exercisesSummary}
          </div>
        </div>
      `;
    }).join("");
  },

  deleteHistoryItem(id) {
    if (confirm("Eliminare questa sessione dallo storico?")) {
      const history = Store.getHistory().filter(h => h.id !== id);
      Store.setHistory(history);
      this.renderHistoryList();
      ChartsManager.populateSelectors();
      ChartsManager.renderCurrentCharts();
      this.showToast("Sessione eliminata.");
    }
  },

  // ================= 6. MODALI, IMPOSTAZIONI & BACKUP =================
  bindModals() {
    document.querySelectorAll(".close-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) modal.classList.remove("open");
      });
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("open");
        }
      });
    });

    const btnCreateRoutine = document.getElementById("btn-create-routine");
    if (btnCreateRoutine) {
      btnCreateRoutine.addEventListener("click", () => this.openRoutineEditor());
    }

    const btnSaveRoutine = document.getElementById("btn-save-routine");
    if (btnSaveRoutine) {
      btnSaveRoutine.addEventListener("click", () => this.saveRoutineFromEditor());
    }

    const btnEditorAddEx = document.getElementById("btn-editor-add-exercise");
    if (btnEditorAddEx) {
      btnEditorAddEx.addEventListener("click", () => this.openExercisePicker("editor"));
    }

    const btnActiveAddEx = document.getElementById("btn-add-exercise-to-active");
    if (btnActiveAddEx) {
      btnActiveAddEx.addEventListener("click", () => this.openExercisePicker("active_workout"));
    }

    const btnAddCustom = document.getElementById("btn-add-custom-exercise");
    if (btnAddCustom) {
      btnAddCustom.addEventListener("click", () => this.addCustomExercise());
    }

    const btnFinish = document.getElementById("btn-finish-workout");
    if (btnFinish) {
      btnFinish.addEventListener("click", () => this.finishActiveWorkout());
    }

    const btnCancel = document.getElementById("btn-cancel-workout");
    if (btnCancel) {
      btnCancel.addEventListener("click", () => this.cancelActiveWorkout());
    }

    const btnConfirmSummary = document.getElementById("btn-confirm-save-summary");
    if (btnConfirmSummary) {
      btnConfirmSummary.addEventListener("click", () => this.confirmSaveAndCloseSummary());
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
  },

  bindSettings() {
    const btnOpenSettings = document.getElementById("btn-open-settings");
    if (btnOpenSettings) {
      btnOpenSettings.addEventListener("click", () => {
        const settings = Store.getSettings();
        const chkSound = document.getElementById("setting-sound");
        const chkVibe = document.getElementById("setting-vibe");
        if (chkSound) chkSound.checked = !!settings.soundEnabled;
        if (chkVibe) chkVibe.checked = !!settings.vibrationEnabled;
        document.getElementById("modal-settings").classList.add("open");
      });
    }

    const chkSound = document.getElementById("setting-sound");
    if (chkSound) {
      chkSound.addEventListener("change", () => {
        const s = Store.getSettings();
        s.soundEnabled = chkSound.checked;
        Store.setSettings(s);
      });
    }

    const chkVibe = document.getElementById("setting-vibe");
    if (chkVibe) {
      chkVibe.addEventListener("change", () => {
        const s = Store.getSettings();
        s.vibrationEnabled = chkVibe.checked;
        Store.setSettings(s);
      });
    }

    const btnExport = document.getElementById("btn-export-backup");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const jsonStr = Store.exportBackup();
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const dateStr = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `hevy_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast("Backup JSON scaricato con successo!");
      });
    }

    const inputImport = document.getElementById("input-import-backup");
    if (inputImport) {
      inputImport.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const res = Store.importBackup(event.target.result);
          if (res.success) {
            this.renderRoutines();
            ChartsManager.populateSelectors();
            ChartsManager.renderCurrentCharts();
            this.renderHistoryList();
            this.closeModal("modal-settings");
            this.showToast(`Import completato: ${res.countRoutines} schede, ${res.countHistory} sessioni!`);
          } else {
            alert("Errore nell'importazione: " + res.error);
          }
        };
        reader.readAsText(file);
      });
    }

    const btnReset = document.getElementById("btn-reset-sample-data");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Vuoi sovrascrivere i dati correnti con i dati di esempio iniziali (Full Body A + 4 settimane di storico)?")) {
          Store.resetToDefaults();
          this.renderRoutines();
          ChartsManager.populateSelectors();
          ChartsManager.renderCurrentCharts();
          this.renderHistoryList();
          this.closeModal("modal-settings");
          this.showToast("Dati di esempio ripristinati!");
        }
      });
    }
  },

  showToast(message) {
    const toast = document.getElementById("app-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  },

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
