// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { initializeFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

type FirebaseBits = {
  app: FirebaseApp | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
};

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasMinimalConfig =
  !!cfg.apiKey && !!cfg.projectId && !!cfg.appId && !!cfg.storageBucket;

let firebase: FirebaseBits = { app: null, db: null, storage: null };

function safeInit() {
  if (!hasMinimalConfig) {
    if (typeof window !== "undefined") {
      console.warn(
        "[firebase] Missing NEXT_PUBLIC_FIREBASE_* envs. Storage will be unavailable."
      );
    }
    return;
  }

  try {
    // Check if we should force long-polling
    const FORCE_LONG_POLLING = 
      process.env.NEXT_PUBLIC_FIRESTORE_FORCE_LONG_POLLING === "true";

    console.log("[firebase] Environment check - Force long polling:", FORCE_LONG_POLLING);
    console.log("[firebase] Existing apps:", getApps().length);

    // Initialize Firebase app
    const app = getApps().length ? getApp() : initializeApp(cfg);

    // Initialize Firestore with appropriate settings
    // Note: initializeFirestore can only be called once per app
    let db: Firestore;
    try {
      if (FORCE_LONG_POLLING) {
        console.log("[firebase] Initializing Firestore with forced long-polling");
        db = initializeFirestore(app, {
          experimentalForceLongPolling: true,
        });
      } else {
        console.log("[firebase] Initializing Firestore with auto-detect long-polling");
        db = initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
        });
      }
    } catch (error: unknown) {
       // If initializeFirestore fails (already initialized), we need to get the existing instance
       const errorMessage = error instanceof Error ? error.message : String(error);
       console.warn("[firebase] Firestore already initialized, this may cause WebChannel issues:", errorMessage);
       // Unfortunately, we can't change settings on an already initialized Firestore
       throw new Error("Firestore already initialized with different settings. Please refresh the page.");
     }

    const storage = getStorage(app);

    firebase = { app, db, storage };
    console.log("[firebase] Initialization complete");
  } catch (e) {
    console.error("[firebase] Initialization failed:", e);
    firebase = { app: null, db: null, storage: null };
  }
}

// Initialize immediately
safeInit();

export const app = firebase.app;
export const db = firebase.db;
export const storage = firebase.storage;
