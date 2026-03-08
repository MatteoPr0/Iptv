import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', document.baseURI).pathname;
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

const rootEl = document.getElementById('root')!;

async function bootstrap() {
  try {
    const {default: App} = await import('./App.tsx');

    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('App bootstrap failed:', error);
    rootEl.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#e4e4e7;padding:24px;font-family:system-ui,sans-serif;">
        <div style="max-width:720px;background:#18181b;border:1px solid #3f3f46;border-radius:16px;padding:20px;line-height:1.5;">
          <h1 style="margin:0 0 8px 0;font-size:20px;">Configurazione non completata</h1>
          <p style="margin:0;">Mancano variabili Firebase in fase di build GitHub Pages. Configura le variabili repository <code>VITE_FIREBASE_*</code> e rilancia il deploy.</p>
        </div>
      </div>
    `;
  }
}

void bootstrap();
