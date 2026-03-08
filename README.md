<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IPTV Player (Web + PWA)

Questa app è ora predisposta anche come **PWA installabile** (Android/desktop via browser compatibile).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open:
   `http://localhost:3000`

## Build produzione

1. Build frontend:
   `npm run build`
2. (Opzionale) Preview bundle:
   `npm run preview`

## Installazione su Android (PWA)

1. Pubblica app e backend proxy in HTTPS.
2. Apri l'app da Chrome Android.
3. Menu browser → **Installa app** / **Aggiungi a schermata Home**.

## Note PWA implementate

- `manifest.webmanifest` con `display: standalone`.
- `service worker` con cache della app shell.
- Metadati `theme-color` e icona dedicata.
