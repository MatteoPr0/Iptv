import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function readEnv(name: keyof ImportMetaEnv) {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

const requiredFirebaseEnv: (keyof ImportMetaEnv)[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingFirebaseEnv = requiredFirebaseEnv.filter((name) => !readEnv(name));

if (missingFirebaseEnv.length > 0) {
  throw new Error(
    `Missing Firebase env vars: ${missingFirebaseEnv.join(', ')}. Configure repository Variables/Secrets for GitHub Pages build.`,
  );
}

const firebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET') || undefined,
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || undefined,
  measurementId: readEnv('VITE_FIREBASE_MEASUREMENT_ID') || undefined,
};

const firestoreDatabaseId = readEnv('VITE_FIREBASE_DATABASE_ID');

const app = initializeApp(firebaseConfig);
export const db = firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
export const auth = getAuth(app);
