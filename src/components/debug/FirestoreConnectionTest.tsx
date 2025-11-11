"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";

export function FirestoreConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...");
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    if (!db) {
      setConnectionStatus("❌ Firestore not initialized");
      return;
    }

    setConnectionStatus("🔄 Testing Firestore connection...");

    // Test connection by listening to a simple collection
    const unsubscribe = onSnapshot(
      collection(db, "connection-test"),
      (snapshot) => {
        setConnectionStatus("✅ Firestore connected successfully (Long-polling active)");
        setErrorDetails("");
        console.log("[FirestoreTest] Connection successful, docs:", snapshot.size);
      },
      (error) => {
        setConnectionStatus("❌ Firestore connection failed");
        setErrorDetails(error.message);
        console.error("[FirestoreTest] Connection error:", error);
        
        // Check if it's a WebChannel error
        if (error.message.includes("WebChannel") || error.message.includes("transport")) {
          setErrorDetails("WebChannel transport error detected. Long-polling may not be active.");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-sm z-50">
      <h3 className="font-bold mb-2">🔥 Firestore Debug</h3>
      <div className="space-y-1">
        <div>Status: {connectionStatus}</div>
        {errorDetails && (
          <div className="text-red-300 text-xs">
            Error: {errorDetails}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-2">
          Long-polling: {process.env.NEXT_PUBLIC_FIRESTORE_FORCE_LONG_POLLING === "true" ? "✅ Enabled" : "❌ Disabled"}
        </div>
      </div>
    </div>
  );
}