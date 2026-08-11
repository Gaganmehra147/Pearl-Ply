/**
 * PEARL PLY - PRODUCT CATALOG MANAGER
 * Full CRUD: Add, Edit, Delete, Photo Upload, Specs, Sizes
 */
(function () {
  'use strict';

  const PRODUCTS_KEY = 'pearl_products_v1';
  let currentPhotoBase64 = '';
  let searchQuery = '';
  let gradeFilter = '';

  // ── Default Seed Products ──────────────────────────────────────────────────
  const DEFAULT_PRODUCTS = [
    {
      id: 'PP-001',
      name: 'Pearl Marine BWP 710',
      grade: 'Marine',
      tagline: 'Modular Kitchen Base & Bathrooms',
      description: 'Engineered for continuous water contact. Endures 72 continuous hours in boiling water test. Deep chemical vacuum pressure treated with 100% Undiluted Phenol Formaldehyde resin.',
      core: 'High Density Gurjan Core',
      resin: 'Phenol Formaldehyde (PF) — 100% Undiluted',
      standard: 'IS:710 (BWP)',
      warranty: '20-Year Guarantee',
      waterTest: '72-Hour Boiling Proof',
      moisture: 'BWP',
      thicknesses: ['6', '9', '12', '16', '18', '19', '25'],
      sheetSizes: ['8x4', '7x4'],
      price: '₹1,450 per sheet',
      status: 'Active',
      features: 'ISI Marked, IS:710 Certified, 4-Head Quad Calibrated (±0.1mm), Zero Delamination Warranty',
      photo: '',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    {
      id: 'PP-002',
      name: 'Pearl BWR Moisture Guard',
      grade: 'BWR',
      tagline: 'Semi-Wet Areas & Dining Units',
      description: 'Manufactured with Phenol Formaldehyde resin to withstand boiling water immersion for 8 hours without ply separation. Ideal for semi-wet zones.',
      core: '100% Calibrated Hardwood Core',
      resin: 'Phenol Formaldehyde (PF)',
      standard: 'IS:303 (BWR)',
      warranty: '15-Year Guarantee',
      waterTest: '8-Hour Boiling Resistant',
      moisture: 'BWR',
      thicknesses: ['6', '9', '12', '16', '18', '19', '25'],
      sheetSizes: ['8x4', '7x4', '6x4'],
      price: '₹980 per sheet',
      status: 'Active',
      features: 'ISI Marked, IS:303 Certified, Anti-fungal treatment, Termite resistant',
      photo: '',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    {
      id: 'PP-003',
      name: 'Pearl Commercial MR Plywood',
      grade: 'MR',
      tagline: 'Bedroom Furniture & Paneling',
      description: 'Bonded with fortified Melamine Urea Formaldehyde resin. Highly resistant to ambient moisture, perfect for dry interior furnishings.',
      core: 'Selected Hardwood',
      resin: 'Fortified MUF Synthetic',
      standard: 'IS:303 (MR)',
      warranty: '10-Year Guarantee',
      waterTest: 'Moisture Resistant (Interior)',
      moisture: 'MR',
      thicknesses: ['6', '9', '12', '16', '18', '19'],
      sheetSizes: ['8x4', '7x4', '6x4', '6x3'],
      price: '₹680 per sheet',
      status: 'Active',
      features: 'ISI Marked, Smooth sanded face, Low formaldehyde emission',
      photo: '',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    {
      id: 'PP-004',
      name: 'Pearl SolidCore Blockboard',
      grade: 'Blockboard',
      tagline: 'Wardrobe Shutters & Tall Panels',
      description: 'Solid timber core with premium face veneers. Anti-warping technology makes it ideal for tall wardrobe shutters, doors, and furniture in humid conditions.',
      core: 'Solid Plantation Timber Strips',
      resin: 'Phenol Formaldehyde (PF)',
      standard: 'IS:1659 (BWR)',
      warranty: '12-Year Anti-Warp Guarantee',
      waterTest: 'Boiling Water Resistant',
      moisture: 'BWR',
      thicknesses: ['19', '25'],
      sheetSizes: ['8x4', '7x4'],
      price: '₹1,100 per sheet',
      status: 'Active',
      features: 'Anti-warp core, ISI:1659, Solid timber strip construction, Zero bow guarantee',
      photo: '',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  ];

  // ── Data Layer ─────────────────────────────────────────────────────────────
  function getProducts() {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.warn('Products read error:', e); }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }

  function saveProducts(data) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
    renderProducts();
    updateProductStats();
  }

  // ── Tab Switch ─────────────────────────────────────────────────────────────
  window.switchAdminTab = function (tab) {
    const crmMain = document.querySelector('.admin-main-wrap:not(.products-main)');
    const prodMain = document.getElementById('productsSection');
    const tabCRM = document.getElementById('tabCRM');
    const tabProd = document.getElementById('tabProducts');
    const headerBtn = document.getElementById('headerActionBtn');
    const headerLabel = document.getElementById('headerActionLabel');

    if (tab === 'crm') {
      crmMain && (crmMain.style.display = '');
      prodMain && (prodMain.style.display = 'none');
      tabCRM && tabCRM.classList.add('active');
      tabProd && tabProd.classList.remove('active');
      headerBtn && (headerBtn.onclick = () => window.openAddLeadModal());
      headerLabel && (headerLabel.textContent = '+ Add Manual Lead');
    } else {
      crmMain && (crmMain.style.display = 'none');
      prodMain && (prodMain.style.display = '');
      tabCRM && tabCRM.classList.remove('active');
      tabProd && tabProd.classList.add('active');
      headerBtn && (headerBtn.onclick = () => window.PearlProducts.openModal());
      headerLabel && (headerLabel.textContent = '+ Add Product');
      renderProducts();
      updateProductStats();
    }
  };

  // ── Render Product Cards ───────────────────────────────────────────────────
  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let products = getProducts();

    // Apply filters
    const search = (document.getElementById('prodSearchInput')?.value || '').toLowerCase();
    const grade = document.getElementById('prodGradeFilter')?.value || '';

    products = products.filter(p => {
      if (grade && p.grade !== grade) return false;
      if (search) {
        const str = `${p.name} ${p.grade} ${p.tagline} ${p.description} ${p.core}`.toLowerCase();
        if (!str.includes(search)) return false;
      }
      return true;
    });

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="products-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <h3>No Products Found</h3>
          <p>Click "+ Add Product" to add your first plywood product.</p>
        </div>
      `;
      return;
    }

    const gradeColors = {
      'Marine': { bg: 'rgba(212,163,89,0.12)', badge: 'var(--adm-gold)', label: 'IS:710 • BWP MARINE' },
      'BWR':    { bg: 'rgba(49,130,206,0.12)',  badge: 'var(--adm-blue)',  label: 'IS:303 • BWR GRADE' },
      'MR':     { bg: 'rgba(56,161,105,0.12)',  badge: 'var(--adm-green)', label: 'IS:303 • MR GRADE' },
      'Blockboard': { bg: 'rgba(128,90,213,0.12)', badge: 'var(--adm-purple)', label: 'IS:1659 • BLOCKBOARD' },
      'Flexi':  { bg: 'rgba(221,107,32,0.12)', badge: 'var(--adm-amber)', label: 'FLEXI PLY' },
      'Other':  { bg: 'rgba(143,168,158,0.12)', badge: 'var(--adm-text-muted)', label: 'SPECIALTY' }
    };

    grid.innerHTML = products.map(p => {
      const gc = gradeColors[p.grade] || gradeColors['Other'];
      const statusDot = p.status === 'Active' ? '🟢' : p.status === 'Draft' ? '🟡' : '🔴';
      const photoHTML = p.photo
        ? `<img src="${p.photo}" alt="${p.name}" style="width:100%; height:180px; object-fit:cover; display:block;" />`
        : `<div class="prod-card-no-photo"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><span>No Photo</span></div>`;

      const thickBadges = (p.thicknesses || []).map(t => `<span class="prod-size-badge">${t}mm</span>`).join('');

      return `
        <div class="product-card">
          <div class="prod-card-photo-wrap" style="background: ${gc.bg};">
            <div class="prod-card-grade-badge" style="background: rgba(5,20,15,0.85); color: ${gc.badge}; border: 1px solid ${gc.badge}40;">${gc.label}</div>
            <div class="prod-card-status-badge">${statusDot} ${p.status}</div>
            ${photoHTML}
          </div>
          <div class="prod-card-body">
            <div class="prod-card-name">${escapeHTML(p.name)}</div>
            ${p.tagline ? `<div class="prod-card-tagline">${escapeHTML(p.tagline)}</div>` : ''}
            <p class="prod-card-desc">${escapeHTML(p.description)}</p>
            
            <div class="prod-card-specs">
              ${p.core ? `<div class="prod-spec-row"><span>Core Timber</span><strong>${escapeHTML(p.core)}</strong></div>` : ''}
              ${p.resin ? `<div class="prod-spec-row"><span>Resin Index</span><strong>${escapeHTML(p.resin)}</strong></div>` : ''}
              ${p.warranty ? `<div class="prod-spec-row"><span>Warranty</span><strong>${escapeHTML(p.warranty)}</strong></div>` : ''}
              ${p.waterTest ? `<div class="prod-spec-row"><span>Water Test</span><strong>${escapeHTML(p.waterTest)}</strong></div>` : ''}
              ${p.price ? `<div class="prod-spec-row"><span>Price</span><strong style="color:var(--adm-gold);">${escapeHTML(p.price)}</strong></div>` : ''}
            </div>

            ${thickBadges ? `<div class="prod-size-badges">${thickBadges}</div>` : ''}

            <div class="prod-card-actions">
              <button class="btn-adm btn-adm-gold" style="flex:1; justify-content:center; font-size:0.8rem; padding:8px 12px;" onclick="window.PearlProducts.openModal('${p.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button class="btn-adm btn-adm-outline" style="font-size:0.8rem; padding:8px 12px; border-color:rgba(220,38,38,0.5); color:#FC8181;" onclick="window.PearlProducts.deleteProduct('${p.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Stats Update ───────────────────────────────────────────────────────────
  function updateProductStats() {
    const products = getProducts();
    const total = products.length;
    const active = products.filter(p => p.status === 'Active').length;
    const grades = new Set(products.map(p => p.grade)).size;
    const withPhotos = products.filter(p => p.photo && p.photo.length > 10).length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('statTotalProducts', total);
    set('statActiveProducts', active);
    set('statGrades', grades);
    set('statWithPhotos', withPhotos);
    set('tabProductCount', total);
  }

  // ── Modal Open/Close ───────────────────────────────────────────────────────
  function openModal(editId) {
    const modal = document.getElementById('modalProduct');
    const form = document.getElementById('formProduct');
    if (!modal || !form) return;

    form.reset();
    currentPhotoBase64 = '';
    const preview = document.getElementById('prodPhotoPreview');
    const placeholder = document.getElementById('photoPlaceholder');
    if (preview) { preview.src = ''; preview.style.display = 'none'; }
    if (placeholder) placeholder.style.display = 'flex';

    // Uncheck all checkboxes
    document.querySelectorAll('#sizeCheckboxes input[type=checkbox]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name=sheetSize]').forEach(cb => cb.checked = false);

    if (editId) {
      const products = getProducts();
      const p = products.find(x => x.id === editId);
      if (!p) return;

      document.getElementById('productModalTitle').textContent = '✏️ Edit Product';
      document.getElementById('prodEditId').value = p.id;
      document.getElementById('prodName').value = p.name || '';
      document.getElementById('prodGrade').value = p.grade || '';
      document.getElementById('prodTagline').value = p.tagline || '';
      document.getElementById('prodDescription').value = p.description || '';
      document.getElementById('prodCore').value = p.core || '';
      document.getElementById('prodResin').value = p.resin || '';
      document.getElementById('prodStandard').value = p.standard || '';
      document.getElementById('prodWarranty').value = p.warranty || '';
      document.getElementById('prodWaterTest').value = p.waterTest || '';
      document.getElementById('prodMoisture').value = p.moisture || '';
      document.getElementById('prodPrice').value = p.price || '';
      document.getElementById('prodStatus').value = p.status || 'Active';
      document.getElementById('prodFeatures').value = p.features || '';

      // Restore photo
      if (p.photo) {
        currentPhotoBase64 = p.photo;
        if (preview) { preview.src = p.photo; preview.style.display = 'block'; }
        if (placeholder) placeholder.style.display = 'none';
      }

      // Restore thickness checkboxes
      (p.thicknesses || []).forEach(t => {
        const cb = document.querySelector(`#sizeCheckboxes input[value="${t}"]`);
        if (cb) cb.checked = true;
      });

      // Restore sheet sizes
      (p.sheetSizes || []).forEach(s => {
        const cb = document.querySelector(`input[name=sheetSize][value="${s}"]`);
        if (cb) cb.checked = true;
      });

    } else {
      document.getElementById('productModalTitle').textContent = '+ Add New Product';
      document.getElementById('prodEditId').value = '';
    }

    modal.classList.add('active');
  }

  function closeModal() {
    document.getElementById('modalProduct')?.classList.remove('active');
  }

  // ── Photo Upload ───────────────────────────────────────────────────────────
  function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB. Please compress and try again.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      currentPhotoBase64 = e.target.result;
      const preview = document.getElementById('prodPhotoPreview');
      const placeholder = document.getElementById('photoPlaceholder');
      if (preview) { preview.src = currentPhotoBase64; preview.style.display = 'block'; }
      if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // ── Save Product ───────────────────────────────────────────────────────────
  function saveProduct(event) {
    event.preventDefault();

    const thicknesses = Array.from(
      document.querySelectorAll('#sizeCheckboxes input[type=checkbox]:checked')
    ).map(cb => cb.value);

    const sheetSizes = Array.from(
      document.querySelectorAll('input[name=sheetSize]:checked')
    ).map(cb => cb.value);

    const editId = document.getElementById('prodEditId').value.trim();
    const products = getProducts();

    const productData = {
      id: editId || 'PP-' + Math.floor(100 + Math.random() * 900),
      name: document.getElementById('prodName').value.trim(),
      grade: document.getElementById('prodGrade').value,
      tagline: document.getElementById('prodTagline').value.trim(),
      description: document.getElementById('prodDescription').value.trim(),
      core: document.getElementById('prodCore').value.trim(),
      resin: document.getElementById('prodResin').value.trim(),
      standard: document.getElementById('prodStandard').value.trim(),
      warranty: document.getElementById('prodWarranty').value.trim(),
      waterTest: document.getElementById('prodWaterTest').value.trim(),
      moisture: document.getElementById('prodMoisture').value,
      thicknesses,
      sheetSizes,
      price: document.getElementById('prodPrice').value.trim(),
      status: document.getElementById('prodStatus').value,
      features: document.getElementById('prodFeatures').value.trim(),
      photo: currentPhotoBase64,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (editId) {
      const idx = products.findIndex(p => p.id === editId);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData };
      }
    } else {
      products.unshift(productData);
    }

    saveProducts(products);
    closeModal();

    // Show success toast
    showToast(editId ? '✅ Product updated successfully!' : '✅ Product added successfully!');
  }

  // ── Delete Product ─────────────────────────────────────────────────────────
  function deleteProduct(id) {
    if (!confirm('Delete this product permanently?')) return;
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    showToast('🗑️ Product deleted.');
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  function filterProducts() {
    renderProducts();
  }

  // ── Toast Notification ─────────────────────────────────────────────────────
  function showToast(msg) {
    let toast = document.getElementById('prodToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'prodToast';
      toast.style.cssText = `
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        background: #0E2E22; border: 1px solid var(--adm-gold);
        color: var(--adm-gold-light); padding: 14px 22px;
        border-radius: 10px; font-size: 0.88rem; font-weight: 700;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        transform: translateY(20px); opacity: 0;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0';
    }, 3000);
  }

  // ── Helper ─────────────────────────────────────────────────────────────────
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'\"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.PearlProducts = {
    openModal,
    closeModal,
    saveProduct,
    deleteProduct,
    filterProducts,
    handlePhotoUpload
  };

  // Init on load
  document.addEventListener('DOMContentLoaded', () => {
    updateProductStats();
  });

})();
