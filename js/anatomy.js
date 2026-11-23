/**
 * Anatomy - Componente SVG e visualizzatore muscolare stile Hevy
 * Genera miniature SVG e modale anatomico ad alta definizione
 */

const Anatomy = {
  // Dati anatomici dettagliati per gruppo muscolare
  MUSCLE_INFO: {
    "Petto": {
      name: "Petto (Chest)",
      primary: "Gran Pettorale (Fascio Clavicolare e Sternocostale), Piccolo Pettorale",
      secondary: "Deltoide Anteriore, Tricipite Brachiale, Dentato Anteriore",
      tips: "Mantieni l'arco fisiologico, le scapole addotte e i gomiti a circa 45-75° rispetto al busto per massimizzare il reclutamento pettorale.",
      color: "#3b82f6"
    },
    "Schiena": {
      name: "Schiena & Dorso (Back)",
      primary: "Gran Dorsale, Trapezio (Fascio Medio e Inferiore), Grande e Piccolo Romboide",
      secondary: "Bicipite Brachiale, Brachioradiale, Deltoide Posteriore, Erettori Spinali",
      tips: "Inizia ogni tirata deprimendo e adducendo le scapole prima di flettere i gomiti per non scaricare la tensione solo sulle braccia.",
      color: "#3b82f6"
    },
    "Spalle": {
      name: "Spalle & Deltoidi (Shoulders)",
      primary: "Deltoide Anteriore, Deltoide Laterale, Deltoide Posteriore",
      secondary: "Trapezio Superiore, Tricipite Brachiale, Cuffia dei Rotatori (Sovraspinato)",
      tips: "Nelle alzate laterali, mantieni il piano scapolare (circa 30° in avanti rispetto alla linea frontale pura) per evitare impingement subacromiale.",
      color: "#3b82f6"
    },
    "Gambe": {
      name: "Gambe & Glutei (Legs)",
      primary: "Quadricipiti (Retto Femorale, Vasti), Glutei, Femorali (Bicipite Femorale), Polpacci",
      secondary: "Adduttori, Abduttori, Core / Erettori Spinali",
      tips: "Spingi forte con tutta la pianta del piede concentrandoti sull'estensione contemporanea di anca e ginocchio con ginocchia stabili.",
      color: "#3b82f6"
    },
    "Bicipiti": {
      name: "Bicipiti (Biceps)",
      primary: "Bicipite Brachiale (Capo Lungo e Capo Breve), Brachiale Anteriore",
      secondary: "Brachioradiale, Pronatore Rotondo, Flessori dell'Avambraccio",
      tips: "Evita di oscillare col busto. Supina completamente il polso verso l'esterno nella fase di picco di contrazione per stimolare il capo breve.",
      color: "#3b82f6"
    },
    "Tricipiti": {
      name: "Tricipiti (Triceps)",
      primary: "Tricipite Brachiale (Capo Laterale, Capo Mediale e Capo Lungo)",
      secondary: "Anconeo, Pettorali, Deltoide Anteriore",
      tips: "Per enfatizzare il capo lungo esegui estensioni sopra la testa in massimo allungamento; per il capo laterale usa spinte verso il basso (pushdown).",
      color: "#3b82f6"
    },
    "Addome": {
      name: "Addome & Core (Abs)",
      primary: "Retto dell'Addome, Obliquo Esterno, Obliquo Interno, Trasverso",
      secondary: "Flessori dell'Anca (Ileo-Psoas), Dentato Anteriore, Diaframma",
      tips: "Espira completamente durante la massima contrazione addominale e concentrati sull'avvicinamento dello sterno al pube.",
      color: "#3b82f6"
    }
  },

  /**
   * Genera il codice SVG dell'illustrazione anatomica con evidenziazione in blu
   * @param {string} muscleGroup - "Petto" | "Schiena" | "Spalle" | "Gambe" | "Bicipiti" | "Tricipiti" | "Addome"
   * @param {number} width - larghezza
   * @param {number} height - altezza
   * @param {boolean} isInteractive - se cliccabile per aprire il modale
   */
  getSvg(muscleGroup = "Petto", width = 44, height = 44, exerciseName = "") {
    const group = this.normalizeGroup(muscleGroup, exerciseName);
    
    // Colori di evidenziazione
    const isChest = group === "Petto";
    const isBack = group === "Schiena";
    const isShoulders = group === "Spalle";
    const isLegs = group === "Gambe";
    const isBiceps = group === "Bicipiti";
    const isTriceps = group === "Tricipiti";
    const isAbs = group === "Addome";

    const baseFill = "#27272a";
    const baseStroke = "#3f3f46";
    const activeFill = "#3b82f6";
    const activeStroke = "#60a5fa";
    const activeGlow = "filter='url(#glowBlue)'";

    return `
      <svg class="anatomy-svg" viewBox="0 0 100 120" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Sfondo Dark Card -->
        <rect width="100" height="120" rx="8" fill="#141417" stroke="#27272a" stroke-width="1.5" />

        <!-- Silhouette Corpo Umano Anatomico -->
        <g stroke-linecap="round" stroke-linejoin="round">
          
          <!-- Testa & Collo -->
          <circle cx="50" cy="14" r="7" fill="${baseFill}" stroke="${baseStroke}" stroke-width="1" />
          <path d="M47 21 L47 25 L53 25 L53 21 Z" fill="${baseFill}" stroke="${baseStroke}" stroke-width="1" />

          <!-- Trapezio & Spalle Posteriori/Superiori (attivo per Schiena o Spalle) -->
          <path d="M44 24 L34 27 L33 34 L45 32 Z" 
            fill="${isBack || isShoulders ? activeFill : baseFill}" 
            stroke="${isBack || isShoulders ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isBack || isShoulders ? activeGlow : ""} />
          <path d="M56 24 L66 27 L67 34 L55 32 Z" 
            fill="${isBack || isShoulders ? activeFill : baseFill}" 
            stroke="${isBack || isShoulders ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isBack || isShoulders ? activeGlow : ""} />

          <!-- Deltoidi Spalle (Esterni) -->
          <path d="M33 27 Q27 30 28 39 Q34 38 35 32 Z" 
            fill="${isShoulders ? activeFill : baseFill}" 
            stroke="${isShoulders ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isShoulders ? activeGlow : ""} />
          <path d="M67 27 Q73 30 72 39 Q66 38 65 32 Z" 
            fill="${isShoulders ? activeFill : baseFill}" 
            stroke="${isShoulders ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isShoulders ? activeGlow : ""} />

          <!-- Petto (Pettorali Sinistro e Destro) -->
          <path d="M36 33 Q43 32 49 34 L49 44 Q42 45 36 39 Z" 
            fill="${isChest ? activeFill : baseFill}" 
            stroke="${isChest ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isChest ? activeGlow : ""} />
          <path d="M64 33 Q57 32 51 34 L51 44 Q58 45 64 39 Z" 
            fill="${isChest ? activeFill : baseFill}" 
            stroke="${isChest ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isChest ? activeGlow : ""} />

          <!-- Dorsali / Schiena (Lats) visibili lateralmente sotto le ascelle -->
          <path d="M36 39 Q34 46 38 52 L42 50 Q40 43 42 39 Z" 
            fill="${isBack ? activeFill : baseFill}" 
            stroke="${isBack ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isBack ? activeGlow : ""} />
          <path d="M64 39 Q66 46 62 52 L58 50 Q60 43 58 39 Z" 
            fill="${isBack ? activeFill : baseFill}" 
            stroke="${isBack ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isBack ? activeGlow : ""} />

          <!-- Bicipiti (Braccia Anteriori) -->
          <path d="M27 38 Q24 45 27 52 L31 50 Q31 43 32 38 Z" 
            fill="${isBiceps ? activeFill : baseFill}" 
            stroke="${isBiceps ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isBiceps ? activeGlow : ""} />
          <path d="M73 38 Q76 45 73 52 L69 50 Q69 43 68 38 Z" 
            fill="${isBiceps ? activeFill : baseFill}" 
            stroke="${isBiceps ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isBiceps ? activeGlow : ""} />

          <!-- Tricipiti (Braccia Esterne/Posteriori) -->
          <path d="M24 36 Q21 44 24 51 L26 49 Q24 43 26 37 Z" 
            fill="${isTriceps ? activeFill : baseFill}" 
            stroke="${isTriceps ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isTriceps ? activeGlow : ""} />
          <path d="M76 36 Q79 44 76 51 L74 49 Q76 43 74 37 Z" 
            fill="${isTriceps ? activeFill : baseFill}" 
            stroke="${isTriceps ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isTriceps ? activeGlow : ""} />

          <!-- Avambracci -->
          <path d="M26 53 L23 68 L28 69 L30 52 Z" fill="${baseFill}" stroke="${baseStroke}" stroke-width="1" />
          <path d="M74 53 L77 68 L72 69 L70 52 Z" fill="${baseFill}" stroke="${baseStroke}" stroke-width="1" />

          <!-- Addome & Core (Six-pack & Obliqui) -->
          <path d="M44 46 L49 46 L49 54 L44 54 Z" 
            fill="${isAbs ? activeFill : baseFill}" 
            stroke="${isAbs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isAbs ? activeGlow : ""} />
          <path d="M51 46 L56 46 L56 54 L51 54 Z" 
            fill="${isAbs ? activeFill : baseFill}" 
            stroke="${isAbs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isAbs ? activeGlow : ""} />
          <path d="M44 56 L49 56 L49 64 L45 64 Z" 
            fill="${isAbs ? activeFill : baseFill}" 
            stroke="${isAbs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isAbs ? activeGlow : ""} />
          <path d="M51 56 L56 56 L55 64 L51 64 Z" 
            fill="${isAbs ? activeFill : baseFill}" 
            stroke="${isAbs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isAbs ? activeGlow : ""} />

          <!-- Bacino & Glutei -->
          <path d="M42 63 L58 63 L59 70 L41 70 Z" 
            fill="${isLegs ? activeFill : baseFill}" 
            stroke="${isLegs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isLegs ? activeGlow : ""} />

          <!-- Gambe: Quadricipiti / Cosce -->
          <path d="M40 70 Q38 82 41 94 L48 93 Q49 82 48 70 Z" 
            fill="${isLegs ? activeFill : baseFill}" 
            stroke="${isLegs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isLegs ? activeGlow : ""} />
          <path d="M60 70 Q62 82 59 94 L52 93 Q51 82 52 70 Z" 
            fill="${isLegs ? activeFill : baseFill}" 
            stroke="${isLegs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isLegs ? activeGlow : ""} />

          <!-- Gambe: Polpacci -->
          <path d="M41 95 Q38 104 42 114 L46 114 Q48 104 46 95 Z" 
            fill="${isLegs ? activeFill : baseFill}" 
            stroke="${isLegs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isLegs ? activeGlow : ""} />
          <path d="M59 95 Q62 104 58 114 L54 114 Q52 104 54 95 Z" 
            fill="${isLegs ? activeFill : baseFill}" 
            stroke="${isLegs ? activeStroke : baseStroke}" 
            stroke-width="1.2" ${isLegs ? activeGlow : ""} />

        </g>
      </svg>
    `;
  },

  /**
   * Normalizza il nome del gruppo muscolare garantendo compatibilità con detectMuscleGroup
   */
  normalizeGroup(muscleGroup, exerciseName = "") {
    if (muscleGroup && this.MUSCLE_INFO[muscleGroup]) {
      return muscleGroup;
    }
    if (exerciseName && typeof detectMuscleGroup === "function") {
      return detectMuscleGroup(exerciseName);
    }
    return "Petto";
  },

  /**
   * Mostra il modale anatomico di dettaglio ingrandito quando l'utente tocca l'illustrazione
   */
  openModal(exerciseName = "", muscleGroup = "") {
    const group = this.normalizeGroup(muscleGroup, exerciseName);
    const info = this.MUSCLE_INFO[group] || this.MUSCLE_INFO["Petto"];

    let modal = document.getElementById("modal-anatomy-lightbox");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-anatomy-lightbox";
      modal.className = "modal-overlay";
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 420px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title" id="anatomy-modal-exercise">Esercizio</h3>
              <div style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 700;" id="anatomy-modal-group">Gruppo Muscolare</div>
            </div>
            <button type="button" class="icon-btn close-modal-btn">✕</button>
          </div>
          <div class="modal-body text-center">
            <div id="anatomy-modal-svg-wrap" style="display: flex; justify-content: center; margin: 12px 0 16px 0;"></div>
            
            <div class="card" style="text-align: left; background: var(--bg-card); border-color: var(--border-subtle); margin-bottom: 10px;">
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Muscoli Primari Bersaglio</div>
              <div id="anatomy-modal-primary" style="font-size: 0.88rem; font-weight: 600; color: #fafafa;">-</div>
            </div>

            <div class="card" style="text-align: left; background: var(--bg-card); border-color: var(--border-subtle); margin-bottom: 10px;">
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Muscoli Sinergici & Stabilizzatori</div>
              <div id="anatomy-modal-secondary" style="font-size: 0.85rem; color: var(--text-secondary);">-</div>
            </div>

            <div class="card" style="text-align: left; background: rgba(59, 130, 246, 0.08); border-color: rgba(59, 130, 246, 0.25);">
              <div style="font-size: 0.72rem; color: var(--accent-blue); font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">💡 Consiglio di Attivazione</div>
              <div id="anatomy-modal-tips" style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">-</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-block close-modal-btn">Chiudi</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.addEventListener("click", () => modal.classList.remove("open"));
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    }

    // Popola contenuti
    const exTitleEl = document.getElementById("anatomy-modal-exercise");
    const groupEl = document.getElementById("anatomy-modal-group");
    const svgWrap = document.getElementById("anatomy-modal-svg-wrap");
    const primaryEl = document.getElementById("anatomy-modal-primary");
    const secondaryEl = document.getElementById("anatomy-modal-secondary");
    const tipsEl = document.getElementById("anatomy-modal-tips");

    if (exTitleEl) exTitleEl.textContent = exerciseName || info.name;
    if (groupEl) groupEl.textContent = `Focus: ${info.name}`;
    if (svgWrap) svgWrap.innerHTML = this.getSvg(group, 140, 168, exerciseName);
    if (primaryEl) primaryEl.textContent = info.primary;
    if (secondaryEl) secondaryEl.textContent = info.secondary;
    if (tipsEl) tipsEl.textContent = info.tips;

    modal.classList.add("open");
  }
};
