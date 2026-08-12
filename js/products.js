/**
 * PEARL PLY - PRODUCT CATALOG MANAGER
 * Full CRUD: Add, Edit, Delete, Photo Upload, Specs, Sizes
 */
(function () {
  'use strict';

  const PRODUCTS_KEY = 'pearl_products_v2';
  let currentPhotoBase64 = '';
  let searchQuery = '';
  let gradeFilter = '';

  // ── Default Seed Products (4 Real Pearl Ply Master Products) ───────────────
  const DEFAULT_PRODUCTS = [
    {
      id: 'PP-001',
      name: 'Pearl Ultima Plus',
      grade: 'Marine',
      tagline: '100% Gurjan Inside & 15-Year Replacement Warranty',
      description: 'Super-premium Boiling Water Proof (BWP) plywood certified IS:710 (CM/L 9504492). Built with 100% Gurjan inside, extra layer construction, high density compaction, and low VOC eco-friendly resin. 72-hr boiling proof.',
      core: '100% High Density Gurjan Inside',
      resin: '100% Undiluted Phenol Formaldehyde (PF) — Low VOC',
      standard: 'IS:710 (BWP) • CM/L 9504492',
      warranty: '15-Year Guarantee',
      waterTest: '72-Hour Boiling Proof (Zero Delamination)',
      moisture: 'BWP',
      thicknesses: ['6', '9', '12', '16', '18', '19', '25'],
      sheetSizes: ['8x4', '7x4', '8x3', '7x3'],
      price: '₹1,550 per sheet',
      status: 'Active',
      features: 'Superior Strength, Boiling Water Proof (BWP), Termite & Borer Proof, Perfectly Calibrated, Eco-Friendly, Low VOC, 100% Gurjan Inside',
      photo: 'assets/images/pearl_ultima_plus.jpg',
      createdAt: '01 Aug 2026'
    },
    {
      id: 'PP-002',
      name: 'Pearl Ultima Ply',
      grade: 'BWR',
      tagline: 'High Density Extra Layer with Calibrated Gurjan Face',
      description: 'Certified IS:303 BWR Grade (CM/L 9760279217). Engineered with extra layer plywood technology, calibrated Gurjan face, high density core, and hot pressed under precision hydraulic temperature & pressure.',
      core: 'High Density Core + Calibrated Gurjan Face',
      resin: 'Fortified Phenol Formaldehyde Synthetic Resin — Low VOC',
      standard: 'IS:303 (BWR) • CM/L 9760279217',
      warranty: '10-Year Guarantee',
      waterTest: '8-Hour Boiling Resistant (Hot Pressed)',
      moisture: 'BWR',
      thicknesses: ['6', '9', '12', '16', '18', '19', '25'],
      sheetSizes: ['8x4', '7x4', '8x3', '7x3'],
      price: '₹1,050 per sheet',
      status: 'Active',
      features: '303 BWR Grade, Calibrated Gurjan Face, Extra Layer Plywood, High Density, Low VOC, 10 Years Guarantee, Hot Pressed, Termite Proof',
      photo: 'assets/images/pearl_ultima_ply.jpg',
      createdAt: '01 Aug 2026'
    },
    {
      id: 'PP-003',
      name: 'Pearl Platinum',
      grade: 'Marine',
      tagline: 'Premium 100% Pine Wood Flush Door (Full Water Proof)',
      description: 'Premium flush door engineered with 100% pure pine wood core. Swell proof, termite & borer resistant with GD protection. Certified IS:2202 BWP grade with superior strength.',
      core: '100% Pure Seasoned Pine Wood',
      resin: '100% Undiluted Phenol Formaldehyde (PF)',
      standard: 'IS:2202 (BWP Grade)',
      warranty: '10-Year Guarantee',
      waterTest: 'Full Water Proof (BWP)',
      moisture: 'BWP',
      thicknesses: ['30', '35'],
      sheetSizes: ['8x4', '7x4', '7x3', '6.5x3'],
      price: '₹1,350 per sheet',
      status: 'Active',
      features: '100% Pure Pine Wood, Superior Swell Proof, Full Water Proof, Termite & Borer Resistant, GD Protection, ISO 9001:2008',
      photo: 'assets/images/pearl_platinum.jpg',
      createdAt: '01 Aug 2026'
    },
    {
      id: 'PP-004',
      name: 'Pearl Black Decor',
      grade: 'MR',
      tagline: '303 MR Grade Plywood with 100% Gurjan Face',
      description: '303 MR Grade plywood with 100% Gurjan Face Veneer. Full core, full panel construction ensures zero gaps and superior screw holding strength for luxury furniture and interior paneling.',
      core: 'Full Core, Full Panel Selected Hardwood',
      resin: 'Fortified Melamine Urea Formaldehyde (MUF)',
      standard: 'IS:303 (MR Grade)',
      warranty: '10-Year Guarantee',
      waterTest: 'Moisture Resistant (Interior Grade)',
      moisture: 'MR',
      thicknesses: ['9', '12', '16', '18', '19'],
      sheetSizes: ['8x4', '7x4', '8x3', '7x3'],
      price: '₹850 per sheet',
      status: 'Active',
      features: '100% Gurjan Face, Full Core Full Panel, High Screw Retention, GLP Certified, Type AA ISI Marked, Anti-Borer Chemical Treatment',
      photo: 'assets/images/pearl_black_decor.jpg',
      createdAt: '01 Aug 2026'
    }
  ];

  // ── Data Layer ─────────────────────────────────────────────────────────────
  function getProducts() {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) {
        let list = JSON.parse(stored);
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch (e) { console.warn('Products read error:', e); }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
      if (stored) {
        let list = JSON.parse(stored);
        // Ensure default products exist in stored list
        let updated = false;
        DEFAULT_PRODUCTS.forEach(dp => {
          if (!list.some(p => p.id === dp.id)) {
            list.push(dp);
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
        }
        return list;
      }
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
