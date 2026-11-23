# Hevy Gym Tracker (PWA) 🏋️‍♂️

Web App Mobile-First per il tracciamento degli allenamenti in palestra ispirata all'interfaccia e all'ergonomia di **Hevy**.
Progettata per l'uso ad alto contrasto con una sola mano, dark mode AMOLED predefinita, timer di recupero non bloccante con sintesi audio Web Audio API, calcolo automatico del sovraccarico progressivo (*Progressive Overload*), formule 1RM di Epley, grafici interattivi e supporto completo PWA per iOS/Safari.

---

## 📱 Funzionalità Principali

### 1. Architettura & Navigazione Mobile a Una Mano
- **Barra di Navigazione Inferiore Fissa**: 3 sezioni principali con supporto nativo a `env(safe-area-inset-bottom)` per iPhone (Routine, Allenamento, Statistiche).
- **Indicatore Attivo**: Badge pulsante verde sulla scheda Allenamento quando c'è una sessione attiva.

### 2. Gestione Routine & Esercizi
- **CRUD Completo**: Creazione di nuove schede, modifica, duplicazione rapida e rimozione.
- **Parametri Dettagliati**: Note di esecuzione per esercizio, tempo di recupero target (in secondi), serie con kg e ripetizioni.
- **Riferimento Sessione Precedente**: Mostra in tempo reale sotto a ogni serie il carico e le ripetizioni dell'ultima sessione completata (es. `75 kg × 8`).

### 3. Esecuzione Allenamento & Timer di Recupero
- **Campi Rapidi Touch**: Modifica immediata con input numerici ottimizzati per mobile (`inputmode="decimal"`).
- **Spunta Serie Interattiva**: Iconico pulsante di completamento Hevy ad alto contrasto verde smeraldo.
- **Trigger Automatico del Timer**: Appena l'utente spunta una serie, parte automaticamente il timer di recupero impostato per quell'esercizio.
- **Timer Non Bloccante**: Barra flottante compatta con pulsanti rapidi `+15s`, `-15s`, `Pausa`, `Salta`, indicatore di avanzamento e suono di fine serie (Web Audio API a 3 toni armonici) + vibrazione aptica.
- **Termina & Salva**: Calcolo automatico di volume totale, durata, record personali (PR) e opzione per aggiornare automaticamente i carichi della routine.

### 4. Suggerimento Sovraccarico Progressivo (*Progressive Overload*)
- L'algoritmo analizza le prestazioni dell'ultima sessione: se tutte le serie target sono state completate con successo con il carico previsto, l'app genera un badge discreto:
  - `⚡ Consiglio: +2.5 kg` per esercizi con bilanciere/macchine pesanti
  - `⚡ Consiglio: +1 rep` o `+1.25 kg` per esercizi a corpo libero o isolamento
  - Toccando il badge, l'incremento viene applicato istantaneamente a tutte le serie con un solo tocco!

### 5. Grafici Interattivi & Statistiche
- **Grafico Esercizio**:
  - Filtro per singolo esercizio da menu a tendina.
  - Carico Massimo sollevato nel tempo (kg).
  - 1RM Stimato secondo la formula di Epley:
    $$\text{1RM} = \text{Carico} \times \left(1 + \frac{\text{Ripetizioni}}{30}\right)$$
  - Riepilogo All-Time PR e numero sessioni.
- **Grafico Routine**:
  - Volume totale sollevato per sessione ($\sum \text{serie} \times \text{kg} \times \text{reps}$).
  - Volume massimo, volume medio e storico sessioni espandibile.

### 6. Persistenza dei Dati, Backup & PWA iOS
- **LocalStorage**: Salvataggio in tempo reale di routine, storico e persino dell'allenamento in corso in caso di ricaricamento o chiusura accidentale.
- **Dati Iniziali Pre-caricati**: Scheda "Full Body A" con 4 sessioni storiche nelle ultime 4 settimane per mostrare subito grafici e progressione.
- **Backup JSON**: Pulsante per scaricare l'intero database in JSON e ripristinarlo su qualsiasi altro dispositivo.
- **PWA Standalone (iOS / Safari)**: File `manifest.json` valido, `sw.js` (Service Worker) per il funzionamento offline e meta tag:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  ```

---

## 🚀 Come Eseguire l'Applicazione

### Metodo 1: Apri direttamente `index.html` nel browser
L'app è costruita con tecnologie web standard a zero dipendenze di build. Puoi fare doppio clic su `index.html` per aprirla in Google Chrome, Microsoft Edge o Safari.

### Metodo 2: Server Locale per testare su iPhone via Wi-Fi
Se vuoi aprirla direttamente dal tuo iPhone collegato alla stessa rete Wi-Fi del computer:
1. Apri una finestra PowerShell nella cartella del progetto:
   ```powershell
   cd C:\Users\Notebook\.gemini\antigravity\scratch\hevy-workout-tracker
   powershell -ExecutionPolicy Bypass -File .\serve.ps1
   ```
2. La console mostrerà l'indirizzo IP locale (es. `http://192.168.1.xxx:3000`).
3. Apri Safari sul tuo iPhone e digita quell'indirizzo.
4. Tocca il pulsante **Condividi** in Safari e seleziona **"Aggiungi alla schermata Home"**.
5. L'app verrà installata e si aprirà a schermo intero come un'app nativa di iOS!

---

## 📁 Struttura dei File

```
hevy-workout-tracker/
│
├── index.html            # Shell applicativa, meta tag PWA, modali e viste
├── manifest.json         # Manifest PWA (standalone, icone, dark theme)
├── sw.js                 # Service worker per caching offline
├── serve.ps1             # Server HTTP locale in PowerShell
├── README.md             # Documentazione completa
│
├── css/
│   └── style.css         # Stili dark mode AMOLED, layout mobile-first, safe areas iOS
│
├── js/
│   ├── data.js           # Esercizi predefiniti, routine base e 4 settimane di mock history
│   ├── store.js          # Gestione LocalStorage, formule 1RM Epley, Overload e backup JSON
│   ├── timer.js          # Controller timer recupero, Web Audio API chime e vibrazione
│   ├── charts.js         # Gestore Chart.js (Carico Max, 1RM e Volume Routine)
│   └── app.js            # Controller applicazione, routing tab, modali ed eventi
│
└── icons/
    ├── favicon.svg       # Icona vettoriale bilanciere e fulmine
    ├── icon-192.png      # Icona PWA 192x192
    ├── icon-512.png      # Icona PWA 512x512
    └── apple-touch-icon.png
```
