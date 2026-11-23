/**
 * Charts - Grafici interattivi con Chart.js per Carico Massimo, 1RM Epley e Volume Routine
 */

const ChartsManager = {
  exerciseChartInstance: null,
  routineChartInstance: null,

  formatShortDate(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
    } catch (e) {
      return isoString;
    }
  },

  init() {
    this.populateSelectors();
    this.renderCurrentCharts();
  },

  populateSelectors() {
    const history = Store.getHistory();
    const routines = Store.getRoutines();

    // 1. Elenco esercizi unici nello storico + libreria
    const exerciseSelect = document.getElementById("chart-exercise-select");
    if (exerciseSelect) {
      const exerciseSet = new Set();
      // Aggiungi esercizi dallo storico
      history.forEach(session => {
        if (session.exercises) {
          session.exercises.forEach(ex => {
            if (ex.name) exerciseSet.add(ex.name);
          });
        }
      });
      // Aggiungi esercizi dalle routine
      routines.forEach(r => {
        if (r.exercises) {
          r.exercises.forEach(ex => {
            if (ex.name) exerciseSet.add(ex.name);
          });
        }
      });

      const currentVal = exerciseSelect.value;
      exerciseSelect.innerHTML = "";
      
      const sortedExercises = Array.from(exerciseSet).sort();
      sortedExercises.forEach((name, idx) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        exerciseSelect.appendChild(opt);
      });

      if (currentVal && exerciseSet.has(currentVal)) {
        exerciseSelect.value = currentVal;
      } else if (sortedExercises.length > 0) {
        // Seleziona Panca Piana o il primo
        const defaultEx = sortedExercises.find(e => e.toLowerCase().includes("panca")) || sortedExercises[0];
        exerciseSelect.value = defaultEx;
      }
    }

    // 2. Elenco routine per grafico volume
    const routineSelect = document.getElementById("chart-routine-select");
    if (routineSelect) {
      const currentRoutine = routineSelect.value;
      routineSelect.innerHTML = `<option value="all">Tutte le Sessioni</option>`;
      routines.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.name;
        routineSelect.appendChild(opt);
      });

      if (currentRoutine) {
        routineSelect.value = currentRoutine;
      } else if (routines.length > 0) {
        routineSelect.value = routines[0].id;
      }
    }
  },

  renderCurrentCharts() {
    const exerciseSelect = document.getElementById("chart-exercise-select");
    const routineSelect = document.getElementById("chart-routine-select");
    const metricSelect = document.getElementById("chart-metric-select");

    const exName = exerciseSelect ? exerciseSelect.value : "";
    const metric = metricSelect ? metricSelect.value : "both";
    const routineId = routineSelect ? routineSelect.value : "all";

    if (exName) {
      this.renderExerciseChart(exName, metric);
    }
    this.renderRoutineChart(routineId);
  },

  /**
   * Grafico Esercizio: Carico Massimo (kg) e 1RM stimato (Epley) nel tempo
   */
  renderExerciseChart(exerciseName, metric = "both") {
    const history = Store.getHistory();
    // Filtra cronologicamente dal più vecchio al più recente
    const chronological = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = [];
    const maxWeights = [];
    const oneRMs = [];
    const pointsData = [];

    let allTimeMaxWeight = 0;
    let allTimeMax1RM = 0;

    chronological.forEach(session => {
      if (!session.exercises) return;
      const normTarget = exerciseName.toLowerCase().trim();
      const ex = session.exercises.find(e => {
        if (!e.name) return false;
        const n = e.name.toLowerCase().trim();
        return n === normTarget || n.includes(normTarget) || normTarget.includes(n);
      });
      if (ex && ex.sets) {
        const validSets = ex.sets.filter(s => s.completed && Number(s.weight) > 0);
        if (validSets.length > 0) {
          const maxW = Math.max(...validSets.map(s => Number(s.weight)));
          let sessionMax1RM = 0;
          validSets.forEach(s => {
            const epley = Store.calculate1RM(s.weight, s.reps);
            if (epley > sessionMax1RM) sessionMax1RM = epley;
          });

          if (maxW > allTimeMaxWeight) allTimeMaxWeight = maxW;
          if (sessionMax1RM > allTimeMax1RM) allTimeMax1RM = sessionMax1RM;

          labels.push(this.formatShortDate(session.date));
          maxWeights.push(maxW);
          oneRMs.push(sessionMax1RM);
          pointsData.push({
            date: session.date,
            maxWeight: maxW,
            oneRM: sessionMax1RM,
            sets: validSets
          });
        }
      }
    });

    // Aggiorna metriche testuali di riepilogo
    const prEl = document.getElementById("ex-stat-pr");
    const rmEl = document.getElementById("ex-stat-1rm");
    const countEl = document.getElementById("ex-stat-count");
    const badgeEl = document.getElementById("ex-stat-progression");

    if (prEl) prEl.textContent = allTimeMaxWeight > 0 ? `${allTimeMaxWeight} kg` : "-";
    if (rmEl) rmEl.textContent = allTimeMax1RM > 0 ? `${allTimeMax1RM} kg` : "-";
    if (countEl) countEl.textContent = labels.length;

    // Badge suggerimento sovraccarico progressivo
    if (badgeEl) {
      const suggestion = Store.getProgressiveOverloadSuggestion(exerciseName);
      if (suggestion) {
        badgeEl.innerHTML = `<span class="badge-progression">⚡ ${suggestion.text}</span>`;
      } else {
        badgeEl.innerHTML = `<span class="badge-neutral">In mantenimento</span>`;
      }
    }

    const canvas = document.getElementById("exerciseChart");
    if (!canvas) return;

    if (labels.length === 0) {
      this.renderEmptyState(canvas, "Nessun dato registrato per questo esercizio.");
      return;
    }

    if (this.exerciseChartInstance) {
      this.exerciseChartInstance.destroy();
    }

    const datasets = [];
    if (metric === "both" || metric === "maxWeight") {
      datasets.push({
        label: "Carico Max (kg)",
        data: maxWeights,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: metric === "maxWeight"
      });
    }

    if (metric === "both" || metric === "oneRM") {
      datasets.push({
        label: "1RM Stimato (Epley)",
        data: oneRMs,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderWidth: 3,
        borderDash: metric === "both" ? [5, 4] : [],
        tension: 0.35,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: metric === "oneRM"
      });
    }

    if (window.Chart) {
      this.exerciseChartInstance = new Chart(canvas, {
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              labels: {
                color: "#e4e4e7",
                font: { size: 12, family: "inherit" },
                usePointStyle: true,
                boxWidth: 8
              }
            },
            tooltip: {
              backgroundColor: "#18181b",
              titleColor: "#fafafa",
              bodyColor: "#a1a1aa",
              borderColor: "#27272a",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(ctx) {
                  return ` ${ctx.dataset.label}: ${ctx.parsed.y} kg`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: "#27272a" },
              ticks: { color: "#a1a1aa", font: { size: 11 } }
            },
            y: {
              grid: { color: "#27272a" },
              ticks: {
                color: "#a1a1aa",
                callback: v => `${v} kg`,
                font: { size: 11 }
              }
            }
          }
        }
      });
    } else {
      // Fallback SVG semplice se Chart.js non è ancora caricato
      this.renderSvgLineChart(canvas, labels, maxWeights, oneRMs);
    }
  },

  /**
   * Grafico Routine: Volume totale sollevato per sessione (somma serie * reps * kg)
   */
  renderRoutineChart(routineId = "all") {
    const history = Store.getHistory();
    const chronological = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = [];
    const volumes = [];
    let totalVolumeSum = 0;
    let maxVolume = 0;

    chronological.forEach(session => {
      if (routineId !== "all" && session.routineId !== routineId) return;

      const vol = session.totalVolumeKg || Store.calculateVolume(
        (session.exercises || []).flatMap(e => e.sets || [])
      );

      labels.push(this.formatShortDate(session.date));
      volumes.push(vol);
      totalVolumeSum += vol;
      if (vol > maxVolume) maxVolume = vol;
    });

    // Statistiche volume
    const volMaxEl = document.getElementById("routine-stat-maxvol");
    const volAvgEl = document.getElementById("routine-stat-avgvol");
    const volCountEl = document.getElementById("routine-stat-count");

    if (volMaxEl) volMaxEl.textContent = maxVolume > 0 ? `${maxVolume.toLocaleString("it-IT")} kg` : "-";
    if (volAvgEl) {
      const avg = volumes.length > 0 ? Math.round(totalVolumeSum / volumes.length) : 0;
      volAvgEl.textContent = avg > 0 ? `${avg.toLocaleString("it-IT")} kg` : "-";
    }
    if (volCountEl) volCountEl.textContent = volumes.length;

    const canvas = document.getElementById("routineChart");
    if (!canvas) return;

    if (labels.length === 0) {
      this.renderEmptyState(canvas, "Nessun allenamento registrato per questa routine.");
      return;
    }

    if (this.routineChartInstance) {
      this.routineChartInstance.destroy();
    }

    if (window.Chart) {
      this.routineChartInstance = new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Volume Totale (kg)",
              data: volumes,
              backgroundColor: "rgba(59, 130, 246, 0.75)",
              borderColor: "#3b82f6",
              borderWidth: 1.5,
              borderRadius: 6,
              hoverBackgroundColor: "#2563eb"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#e4e4e7",
                font: { size: 12 },
                boxWidth: 8
              }
            },
            tooltip: {
              backgroundColor: "#18181b",
              titleColor: "#fafafa",
              bodyColor: "#a1a1aa",
              borderColor: "#27272a",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(ctx) {
                  return ` Volume: ${ctx.parsed.y.toLocaleString("it-IT")} kg`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#a1a1aa", font: { size: 11 } }
            },
            y: {
              grid: { color: "#27272a" },
              ticks: {
                color: "#a1a1aa",
                callback: v => `${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v} kg`,
                font: { size: 11 }
              }
            }
          }
        }
      });
    }
  },

  renderEmptyState(canvas, message) {
    const parent = canvas.parentElement;
    if (parent) {
      const existing = parent.querySelector(".chart-empty-msg");
      if (existing) existing.remove();
      const div = document.createElement("div");
      div.className = "chart-empty-msg";
      div.textContent = message;
      parent.appendChild(div);
    }
  },

  renderSvgLineChart(canvas, labels, maxWeights, oneRMs) {
    // Semplice fallback grafico vettoriale se offline e Chart.js CDN non disponibile
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight || 240;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "12px sans-serif";
    ctx.fillText("Caricamento visualizzazione grafica...", 20, h / 2);
  }
};
