// =============================================================================
// PEARL PLYWOOD - CLOUD DATABASE SERVICE (FIRESTORE)
// Real-time synchronization across all devices (Mobile, PC, Live Web)
// =============================================================================

(function() {
  'use strict';

  const PRODUCTS_COLLECTION = 'products';
  const LEADS_COLLECTION = 'leads';

  let activeProductsUnsub = null;
  let activeLeadsUnsub = null;

  window.PearlCloudDB = {
    isReady: function() {
      return Boolean(window.pearlDb && typeof window.isFirebaseConfigured === 'function' && window.isFirebaseConfigured());
    },

    // ── PRODUCTS OPERATIONS ──────────────────────────────────────────────

    // Save or Update Product in Cloud Firestore
    saveProduct: async function(product) {
      if (!this.isReady()) {
        console.warn('[PearlCloudDB] Database not configured. Changes saved locally only.');
        return false;
      }
      try {
        const id = product.id || ('PP-' + Date.now());
        const docData = { ...product, id, updatedAt: new Date().toISOString() };
        await window.pearlDb.collection(PRODUCTS_COLLECTION).doc(id).set(docData, { merge: true });
        console.log('☁️ [PearlCloudDB] Product synced to Cloud Firestore:', id);
        return true;
      } catch (err) {
        console.error('❌ [PearlCloudDB] Error saving product to Cloud:', err);
        throw err;
      }
    },

    // Delete Product from Cloud Firestore
    deleteProduct: async function(productId) {
      if (!this.isReady()) return false;
      try {
        await window.pearlDb.collection(PRODUCTS_COLLECTION).doc(productId).delete();
        console.log('☁️ [PearlCloudDB] Product deleted from Cloud Firestore:', productId);
        return true;
      } catch (err) {
        console.error('❌ [PearlCloudDB] Error deleting product from Cloud:', err);
        throw err;
      }
    },

    // Real-time Subscribe to Products
    subscribeToProducts: function(callback) {
      if (activeProductsUnsub) {
        try { activeProductsUnsub(); } catch (e) {}
        activeProductsUnsub = null;
      }
      if (!this.isReady()) return null;
      try {
        activeProductsUnsub = window.pearlDb.collection(PRODUCTS_COLLECTION).onSnapshot(
          snapshot => {
            const products = [];
            snapshot.forEach(doc => {
              products.push(doc.data());
            });
            console.log('☁️ [PearlCloudDB] Real-time products sync: ' + products.length + ' items');
            if (typeof callback === 'function') callback(products);
          },
          error => {
            console.error('❌ [PearlCloudDB] Products realtime listener error:', error);
          }
        );
        return activeProductsUnsub;
      } catch (e) {
        console.warn('[PearlCloudDB] Could not start Products listener:', e);
        return null;
      }
    },

    // Seed / Upload Local Products to Cloud
    seedLocalProductsToCloud: async function(productsList) {
      if (!this.isReady()) {
        throw new Error('Cloud Database is not connected yet. Please configure your Firebase keys first.');
      }
      if (!Array.isArray(productsList) || productsList.length === 0) {
        throw new Error('No products found to sync.');
      }
      const batch = window.pearlDb.batch();
      productsList.forEach(prod => {
        const id = prod.id || ('PP-' + Math.random().toString(36).substr(2, 6));
        const ref = window.pearlDb.collection(PRODUCTS_COLLECTION).doc(id);
        batch.set(ref, { ...prod, id, syncedAt: new Date().toISOString() }, { merge: true });
      });
      await batch.commit();
      console.log('✅ [PearlCloudDB] Synced ' + productsList.length + ' products to Cloud Firestore!');
      return productsList.length;
    },

    // ── LEADS & CRM OPERATIONS ───────────────────────────────────────────

    // Save Lead / Customer Inquiry to Cloud
    saveLead: async function(lead) {
      if (!this.isReady()) {
        console.log('ℹ️ [PearlCloudDB] Lead stored in local storage (Cloud DB setup optional).');
        return false;
      }
      try {
        const id = lead.id || ('PL-' + Math.floor(100000 + Math.random() * 900000));
        const cleanLead = {
          ...lead,
          id,
          status: lead.status || 'New',
          createdAt: lead.createdAt || new Date().toISOString(),
          syncedAt: new Date().toISOString()
        };
        await window.pearlDb.collection(LEADS_COLLECTION).doc(id).set(cleanLead, { merge: true });
        console.log('☁️ [PearlCloudDB] Customer inquiry / lead saved to Cloud Firestore:', id);
        return true;
      } catch (err) {
        console.error('❌ [PearlCloudDB] Error saving lead to Cloud:', err);
        return false;
      }
    },

    // Update Lead Status (e.g. New -> In Discussion -> Converted)
    updateLeadStatus: async function(leadId, status) {
      if (!this.isReady()) return false;
      try {
        await window.pearlDb.collection(LEADS_COLLECTION).doc(leadId).set({
          status: status,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('☁️ [PearlCloudDB] Lead status updated in Cloud:', leadId, status);
        return true;
      } catch (err) {
        console.error('❌ [PearlCloudDB] Error updating lead status in Cloud:', err);
        return false;
      }
    },

    // Delete Lead from Cloud
    deleteLead: async function(leadId) {
      if (!this.isReady()) return false;
      try {
        await window.pearlDb.collection(LEADS_COLLECTION).doc(leadId).delete();
        console.log('☁️ [PearlCloudDB] Lead deleted from Cloud Firestore:', leadId);
        return true;
      } catch (err) {
        console.error('❌ [PearlCloudDB] Error deleting lead from Cloud:', err);
        return false;
      }
    },

    // Real-time Subscribe to Leads
    subscribeToLeads: function(callback) {
      if (activeLeadsUnsub) {
        try { activeLeadsUnsub(); } catch (e) {}
        activeLeadsUnsub = null;
      }
      if (!this.isReady()) return null;
      try {
        activeLeadsUnsub = window.pearlDb.collection(LEADS_COLLECTION).onSnapshot(
          snapshot => {
            const leads = [];
            snapshot.forEach(doc => leads.push(doc.data()));
            // Sort by creation date descending
            leads.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            console.log('☁️ [PearlCloudDB] Real-time leads sync: ' + leads.length + ' records');
            if (typeof callback === 'function') callback(leads);
          },
          err => console.warn('[PearlCloudDB] Leads snapshot error:', err)
        );
        return activeLeadsUnsub;
      } catch (e) {
        console.warn('[PearlCloudDB] Could not start Leads listener:', e);
        return null;
      }
    },

    // Seed / Upload Local Leads to Cloud
    seedLocalLeadsToCloud: async function(leadsList) {
      if (!this.isReady()) {
        throw new Error('Cloud Database is not connected yet. Please configure your Firebase keys first.');
      }
      if (!Array.isArray(leadsList) || leadsList.length === 0) {
        throw new Error('No leads found to sync.');
      }
      const batch = window.pearlDb.batch();
      leadsList.forEach(lead => {
        const id = lead.id || ('PL-' + Math.floor(100000 + Math.random() * 900000));
        const ref = window.pearlDb.collection(LEADS_COLLECTION).doc(id);
        batch.set(ref, { ...lead, id, syncedAt: new Date().toISOString() }, { merge: true });
      });
      await batch.commit();
      console.log('✅ [PearlCloudDB] Synced ' + leadsList.length + ' leads to Cloud Firestore!');
      return leadsList.length;
    }
  };

  // Re-subscribe on database status change
  window.addEventListener('pearl:firebase:status', function(e) {
    if (e.detail && e.detail.connected) {
      console.log('🔄 [PearlCloudDB] Database reconnected. Realtime listeners active.');
    }
  });

})();
