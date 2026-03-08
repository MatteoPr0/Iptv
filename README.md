<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IPTV Player (Web + PWA)

Questa app è predisposta come **PWA installabile** (Android/desktop via browser compatibile).

## Setup locale

**Prerequisites:** Node.js

1. Installa dipendenze:
   `npm install`
2. Crea `.env.local` copiando `.env.example`.
3. Inserisci le variabili Firebase (`VITE_FIREBASE_*`) e, se ti serve, `GEMINI_API_KEY`.
4. Avvia:
   `npm run dev`
5. Apri:
   `http://localhost:3000`

## Build produzione

1. Build frontend:
   `npm run build`
2. (Opzionale) Preview bundle:
   `npm run preview`

## Deploy su GitHub Pages

È incluso un workflow GitHub Actions (`.github/workflows/deploy-pages.yml`) che deploya automaticamente la build su Pages quando fai push su `main`.

### Perché non vedevi il link Pages?

Se in Settings → Pages vedi i pulsanti **Configure**, significa che non c'è ancora stato un deploy completato con successo: GitHub non ha artefatti pubblicati, quindi non mostra URL.

### Passi da fare

1. Vai su **Settings → Pages** e lascia `Source: GitHub Actions`.
2. Fai push su `main`.
3. Vai in **Actions** e verifica che `Deploy to GitHub Pages` sia verde.
4. Torna in **Settings → Pages**: comparirà l'URL (tipicamente `https://<user>.github.io/<repo>/`).


### Pagina bianca su GitHub Pages (fix)

Se il deploy è verde ma il sito è bianco, quasi sempre mancano le variabili Firebase in fase di build Pages.

Imposta in **GitHub → Settings → Secrets and variables → Actions → Variables** almeno:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

(opzionali: `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_MEASUREMENT_ID`, `VITE_FIREBASE_DATABASE_ID`)

Poi rilancia il workflow `Deploy to GitHub Pages` da Actions.

## Alert "Possible valid secrets detected"

Se ricevi email da GitHub/Google Cloud su chiavi API esposte, significa che una chiave è finita nel repository (anche in commit passati).

### Cosa fare subito

1. **Ruota/revoca** la chiave API in Google Cloud Console.
2. Crea una nuova chiave con **restrizioni**:
   - HTTP referrers (dominio GitHub Pages)
   - API allowlist minima necessaria.
3. Aggiorna la nuova chiave in `.env.local` (e nei Secret/Variables di GitHub Actions se ti servono in CI).
4. In GitHub, apri l’alert secret scanning e segnalo come risolto dopo la rotazione.

## Installazione su Android (PWA)

1. Usa il link HTTPS pubblicato su GitHub Pages.
2. Apri l'app da Chrome Android.
3. Menu browser → **Installa app** / **Aggiungi a schermata Home**.

## Note PWA implementate

- `manifest.webmanifest` con `display: standalone`.
- `service worker` con cache app shell.
- Metadati `theme-color` e icona dedicata.
- Compatibilità con percorso `/<repo>/` su GitHub Pages.
