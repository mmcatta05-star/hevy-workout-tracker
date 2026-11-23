/**
 * Rest Timer - Timer di recupero non bloccante con Web Audio API e Haptic Vibration
 */

const RestTimer = {
  endTime: null,
  totalDuration: 90,
  intervalId: null,
  isRunning: false,
  isPaused: false,
  remainingWhenPaused: 0,
  currentExerciseName: "",
  audioCtx: null,

  init() {
    this.renderBar();
  },

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playBeep() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Suona una sequenza melodica a 3 toni tipo campana da palestra (C5 -> E5 -> G5)
      const notes = [
        { freq: 523.25, start: 0, dur: 0.15 },
        { freq: 659.25, start: 0.18, dur: 0.15 },
        { freq: 783.99, start: 0.36, dur: 0.35 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.3, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch (e) {
      console.warn("Audio non disponibile:", e);
    }
  },

  triggerVibration() {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([150, 80, 150, 80, 250]);
      } catch (e) {
        // ignore
      }
    }
  },

  start(seconds = 90, exerciseName = "") {
    // Inizializza audio su interazione utente
    this.getAudioContext();

    this.totalDuration = Math.max(5, parseInt(seconds, 10) || 90);
    this.currentExerciseName = exerciseName || "Recupero";
    this.endTime = Date.now() + this.totalDuration * 1000;
    this.isRunning = true;
    this.isPaused = false;

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.tick(), 250);

    this.showBar();
    this.updateUI();
  },

  tick() {
    if (!this.isRunning || this.isPaused) return;

    const remaining = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
    this.updateUI(remaining);

    if (remaining <= 0) {
      this.complete();
    }
  },

  complete() {
    this.stop();
    const settings = Store.getSettings();
    if (settings.soundEnabled) {
      this.playBeep();
    }
    if (settings.vibrationEnabled) {
      this.triggerVibration();
    }
    // Mostra notifica toast rapida
    if (window.App && window.App.showToast) {
      window.App.showToast(`🔔 Tempo di recupero terminato! Pronto per la prossima serie.`);
    }
  },

  addTime(seconds) {
    if (!this.isRunning) return;
    if (this.isPaused) {
      this.remainingWhenPaused = Math.max(0, this.remainingWhenPaused + seconds);
    } else {
      this.endTime += seconds * 1000;
    }
    this.totalDuration += seconds;
    this.tick();
  },

  togglePause() {
    if (!this.isRunning) return;
    if (this.isPaused) {
      this.isPaused = false;
      this.endTime = Date.now() + this.remainingWhenPaused * 1000;
    } else {
      this.isPaused = true;
      this.remainingWhenPaused = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
    }
    this.updateUI();
  },

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.hideBar();
  },

  formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  },

  renderBar() {
    let bar = document.getElementById("rest-timer-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "rest-timer-bar";
      bar.className = "rest-timer-bar hidden";
      bar.innerHTML = `
        <div class="timer-progress-bg">
          <div class="timer-progress-fill" id="timer-progress-fill"></div>
        </div>
        <div class="timer-content">
          <div class="timer-info">
            <span class="timer-title" id="timer-exercise-name">Recupero</span>
            <div class="timer-digits-wrap">
              <span class="timer-time" id="timer-time-display">01:30</span>
              <span class="timer-status" id="timer-pause-status"></span>
            </div>
          </div>
          <div class="timer-actions">
            <button type="button" class="timer-btn" id="btn-timer-sub15" title="-15 secondi">-15s</button>
            <button type="button" class="timer-btn" id="btn-timer-add15" title="+15 secondi">+15s</button>
            <button type="button" class="timer-btn timer-btn-skip" id="btn-timer-skip">Salta</button>
          </div>
        </div>
      `;
      document.body.appendChild(bar);

      // Event listeners
      document.getElementById("btn-timer-add15").addEventListener("click", () => this.addTime(15));
      document.getElementById("btn-timer-sub15").addEventListener("click", () => this.addTime(-15));
      document.getElementById("btn-timer-skip").addEventListener("click", () => this.stop());
      document.getElementById("timer-time-display").addEventListener("click", () => this.togglePause());
    }
  },

  showBar() {
    const bar = document.getElementById("rest-timer-bar");
    if (bar) bar.classList.remove("hidden");
  },

  hideBar() {
    const bar = document.getElementById("rest-timer-bar");
    if (bar) bar.classList.add("hidden");
  },

  updateUI(customRemaining = null) {
    let remaining;
    if (this.isPaused) {
      remaining = this.remainingWhenPaused;
    } else if (customRemaining !== null) {
      remaining = customRemaining;
    } else {
      remaining = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
    }

    const timeDisplay = document.getElementById("timer-time-display");
    const nameDisplay = document.getElementById("timer-exercise-name");
    const progressFill = document.getElementById("timer-progress-fill");
    const pauseStatus = document.getElementById("timer-pause-status");

    if (timeDisplay) timeDisplay.textContent = this.formatTime(remaining);
    if (nameDisplay) nameDisplay.textContent = this.currentExerciseName || "Recupero";

    if (pauseStatus) {
      pauseStatus.textContent = this.isPaused ? "❚❚ In Pausa" : "";
    }

    if (progressFill && this.totalDuration > 0) {
      const pct = Math.max(0, Math.min(100, (remaining / this.totalDuration) * 100));
      progressFill.style.width = `${pct}%`;
    }
  }
};
