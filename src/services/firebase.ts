import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setLogLevel } from 'firebase/firestore/lite';
import firebaseConfig from '../../firebase-applet-config.json';

// Configure log level to error to avoid noisy stream connection debug warnings
setLogLevel('error');

const clientConfig = {
  ...firebaseConfig,
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId,
};

// Initialize Firebase App instance singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(clientConfig) : getApp();

// Initialize Firestore with the provisioned named database instance using the lightweight client
export const db = getFirestore(firebaseApp, clientConfig.firestoreDatabaseId);

/**
 * Validates connection to the provisioned Firestore database
 */
export async function verifyFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt a lightweight read to verify connectivity and rules
    const testDoc = doc(db, 'settings', 'admin');
    await getDoc(testDoc);
    return true;
  } catch (error: any) {
    // A 'not-found' still confirms network connectivity and rule authorization
    if (error?.code === 'not-found') {
      return true;
    }
    console.warn('[Firebase] Firestore connection check notice:', error?.message || error);
    return false;
  }
}

export default db;
