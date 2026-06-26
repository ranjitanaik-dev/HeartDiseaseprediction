import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-messaging-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder-app-id"
};

// Check if credentials are placeholders
export const isMockMode = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey === 'placeholder-api-key' ||
  firebaseConfig.apiKey.trim() === '';

let app;
let auth;
let googleProvider;

if (!isMockMode) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to mock authentication mode:", error);
    app = null;
    auth = null;
    googleProvider = null;
  }
} else {
  console.log("Using Mock Authentication Mode. Configure valid Firebase environment variables in .env to connect to your real Firebase project.");
}

export { app, auth, googleProvider };
