// =============================================================================
// PEARL PLYWOOD - CLOUD REALTIME DATABASE (FIREBASE FIRESTORE) CONFIGURATION
// =============================================================================

// Default baseline configuration. 
// Can also be set directly from Admin Dashboard > Cloud Database Setup.
const _env = (typeof process !== 'undefined' && process && process.env) ? process.env : {};
window.PEARL_FIREBASE_CONFIG = window.PEARL_FIREBASE_CONFIG || {
  apiKey: _env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA7Jk3km3C3rnd-KfZ0QRuJsDjGmGVUCl4",
  authDomain: _env.REACT_APP_FIREBASE_AUTH_DOMAIN || "pearlply-168e6.firebaseapp.com",
  projectId: _env.REACT_APP_FIREBASE_PROJECT_ID || "pearlply-168e6",
  storageBucket: _env.REACT_APP_FIREBASE_STORAGE_BUCKET || "pearlply-168e6.firebasestorage.app",
  messagingSenderId: _env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "296740323445",
  appId: _env.REACT_APP_FIREBASE_APP_ID || "1:296740323445:web:8dcea7782b5e3805b9b83c",
  measurementId: _env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-3DLBS6QK98"
};

// Retrieve active config (localStorage has precedence over default file config)
window.getFirebaseConfig = function() {
  try {
    const saved = localStorage.getItem('pearl_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.apiKey !== "YOUR_API_KEY" && parsed.projectId && parsed.projectId !== "pearl-ply") {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Pearl Firebase] Error reading stored config:', e);
  }
  return window.PEARL_FIREBASE_CONFIG;
};

// Check if valid user credentials are configured
window.isFirebaseConfigured = function() {
  const cfg = window.getFirebaseConfig();
  return Boolean(
    cfg &&
    cfg.apiKey &&
    cfg.apiKey !== "YOUR_API_KEY" &&
    cfg.apiKey.length > 10 &&
    cfg.projectId &&
    cfg.projectId !== "pearl-ply" &&
    cfg.projectId.trim().length > 2
  );
};

// Initialize or re-initialize Firebase Firestore
window.initFirebase = function() {
  if (typeof firebase === 'undefined') {
    console.warn('[Pearl Firebase] Firebase SDK not loaded yet.');
    window.pearlDb = null;
    return false;
  }

  const cfg = window.getFirebaseConfig();
  if (window.isFirebaseConfigured()) {
    try {
      if (firebase.apps.length > 0) {
        // If already initialized with different config, delete and re-init
        try {
          firebase.app().delete();
        } catch (delErr) {
          console.warn('[Pearl Firebase] App reset warning:', delErr);
        }
      }
      firebase.initializeApp(cfg);
      window.pearlDb = firebase.firestore();
      console.log('✅ [Pearl Ply] Firebase Cloud Database Connected successfully! Project:', cfg.projectId);
      
      // Dispatch status event
      window.dispatchEvent(new CustomEvent('pearl:firebase:status', {
        detail: { connected: true, projectId: cfg.projectId }
      }));
      return true;
    } catch (err) {
      console.error('❌ [Pearl Ply] Firebase initialization error:', err);
      window.pearlDb = null;
      window.dispatchEvent(new CustomEvent('pearl:firebase:status', {
        detail: { connected: false, error: err.message }
      }));
      return false;
    }
  } else {
    window.pearlDb = null;
    window.dispatchEvent(new CustomEvent('pearl:firebase:status', {
      detail: { connected: false, reason: 'unconfigured' }
    }));
    return false;
  }
};

// Save new configuration from Admin UI
window.saveFirebaseConfig = function(newConfig) {
  if (!newConfig || !newConfig.apiKey || !newConfig.projectId) {
    throw new Error('API Key and Project ID are required.');
  }
  const cleanConfig = {
    apiKey: String(newConfig.apiKey).trim(),
    authDomain: String(newConfig.authDomain || `${newConfig.projectId.trim()}.firebaseapp.com`).trim(),
    projectId: String(newConfig.projectId).trim(),
    storageBucket: String(newConfig.storageBucket || `${newConfig.projectId.trim()}.appspot.com`).trim(),
    messagingSenderId: String(newConfig.messagingSenderId || '').trim(),
    appId: String(newConfig.appId || '').trim()
  };
  localStorage.setItem('pearl_firebase_config', JSON.stringify(cleanConfig));
  window.initFirebase();
  return cleanConfig;
};

// Reset to default
window.resetFirebaseConfig = function() {
  localStorage.removeItem('pearl_firebase_config');
  window.initFirebase();
};

// Live connection test
window.testFirebaseConnection = async function() {
  if (!window.isFirebaseConfigured()) {
    return { success: false, error: 'Firebase credentials have not been configured yet.' };
  }
  if (!window.pearlDb) {
    const ok = window.initFirebase();
    if (!ok || !window.pearlDb) {
      return { success: false, error: 'Failed to initialize Firebase with current credentials.' };
    }
  }
  try {
    // Attempt a light ping read on a system collection
    await window.pearlDb.collection('_ping').limit(1).get();
    return { success: true, message: 'Cloud Firestore connected and responding!' };
  } catch (err) {
    console.error('[Pearl Firebase] Test connection error:', err);
    return { success: false, error: err.message || 'Connection failed' };
  }
};

// Auto-run immediately so window.pearlDb is available to all subsequent scripts without waiting
try {
  window.initFirebase();
} catch (e) {
  console.warn('[Pearl Firebase] Immediate init error:', e);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.pearlDb) window.initFirebase();
  });
}
