/* ==========================================================================
   PEARL PLY - MAIN APPLICATION SCRIPT & CONTROLLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle & App-Like Drawer
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.getElementById('navOverlay');

  function openMobileMenu() {
    navMenu?.classList.add('active');
    mobileToggle?.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu?.classList.remove('active');
    mobileToggle?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    navOverlay?.addEventListener('click', closeMobileMenu);

    // Close on link click
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          closeMobileMenu();
        }
      });
    });
  }

  // 2.5. Mobile Native Bottom Nav Controller & Chat Trigger
  window.triggerMobileChat = function() {
    const widget = document.getElementById('pearlAiWidget');
    if (widget) {
      widget.classList.toggle('active');
      if (widget.classList.contains('active')) {
        const input = document.getElementById('chatInput');
        if (input) setTimeout(() => input.focus(), 300);
      }
    }
  };

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 250;
    const sections = [
      { id: 'home', tabId: 'mTabHome' },
      { id: 'products', tabId: 'mTabProducts' },
      { id: 'calculator', tabId: 'mTabCalc' }
    ];

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      const tab = document.getElementById(s.tabId);
      if (el && tab) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.mobile-nav-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        }
      }
    });
  });

  // 3. Quality Lab 7-Point Testing Tab Switcher (7 Distinct Process Images)
  const LAB_TEST_DETAILS = {
    test1: {
      title: "72-Hour Continuous Boiling Water Immersion Test",
      desc: "Conducted under strict IS:710 guidelines. Sample specimens are submerged in boiling water (100°C) for 72 continuous hours. Tested for zero delamination, zero edge swelling, and complete resin bond integrity.",
      metric: "72 Hours Boiling | 0% Delamination",
      labStandard: "Bureau of Indian Standards (IS:710:2010)",
      img: "assets/images/lab_boiling.png",
      processTag: "Process 1/7: 100°C Boiling Water Tank"
    },
    test2: {
      title: "Modulus of Rupture (MOR) & Elasticity (MOE) Tensile Test",
      desc: "Measures cross-grain and along-grain bending endurance under heavy point loads. Ensures plywood panels do not sag or crack under heavy stone/granite modular kitchen countertops.",
      metric: "MOR > 55 N/mm² | MOE > 6500 N/mm²",
      labStandard: "IS:1734 Part 11 Tensile Protocols",
      img: "assets/images/lab_mor.png",
      processTag: "Process 2/7: UTM 3-Point Flexural Bending"
    },
    test3: {
      title: "Vacuum Pressure Chemical Impregnation & Borer Defense",
      desc: "Veneers undergo vacuum chamber treatment with organic anti-termite and borer chemical solutions before pressing. Guarantees 100% protection to the core timber layers against wood-boring beetles.",
      metric: "100% Core Penetration | 25-Year Anti-Borer Warranty",
      labStandard: "IS:5539 Preservative Testing",
      img: "assets/images/lab_vacuum.png",
      processTag: "Process 3/7: Autoclave Chemical Defense"
    },
    test4: {
      title: "Quadruple Calibrating Sanding Precision",
      desc: "All sheets pass through computerized 4-head calibration sanders. Ensures uniform thickness across 8x4 ft surface with micro-precision tolerance of +/- 0.1mm, eliminating uneven kitchen cabinet shutters.",
      metric: "+/- 0.1mm Tolerance | 100% Flat CNC Ready",
      labStandard: "European Calibration Standard EN-315",
      img: "assets/images/lab_cnc.png",
      processTag: "Process 4/7: 4-Head Diamond Calibration"
    },
    test5: {
      title: "Glue Shear Strength & Knife Adhesion Test",
      desc: "Mechanical knife test forces separation along veneer glue lines. Pearl Ply exceeds standard shear thresholds, ensuring wood fibers tear before the synthetic phenolic resin bond ever fails.",
      metric: "Shear Strength > 1450 N (Dry & Wet)",
      labStandard: "IS:1734 Part 4",
      img: "assets/images/lab_knife.png",
      processTag: "Process 5/7: Knife Shear & Core Adhesion"
    },
    test6: {
      title: "Screw & Nail Holding Capacity Verification",
      desc: "Measures force required to extract screws and nails from the panel face and edge. High timber density ensures hardware hinges and heavy hydraulic soft-close drawer channels never loosen.",
      metric: "Face Holding > 2200 N | Edge > 1400 N",
      labStandard: "IS:1734 Part 10",
      img: "assets/images/lab_screw.png",
      processTag: "Process 6/7: Hydraulic Screw Holding Pull"
    },
    test7: {
      title: "E0 / E1 Low Formaldehyde Indoor Air Safety",
      desc: "Certified in environmental emission chambers. Keeps indoor air free from harsh chemical odors and formaldehyde fumes, making Pearl Ply completely safe for bedrooms, children's nurseries, and hospital interiors.",
      metric: "Formaldehyde < 0.5 mg/L (E0 Emission)",
      labStandard: "GreenPro & CARB Phase 2 Compliant",
      img: "assets/images/lab_e0.png",
      processTag: "Process 7/7: Environmental Gas Emission"
    }
  };

  const testTabs = document.querySelectorAll('.test-tab-btn');
  const labTitle = document.getElementById('labTestTitle');
  const labDesc = document.getElementById('labTestDesc');
  const labMetric = document.getElementById('labTestMetric');
  const labStandard = document.getElementById('labTestStandard');
  const labImg = document.getElementById('labTestImg');
  const labProcessBadge = document.getElementById('labTestProcessBadge');

  testTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      testTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const testKey = tab.dataset.test;
      const data = LAB_TEST_DETAILS[testKey];
      if (data) {
        if (labTitle) labTitle.textContent = data.title;
        if (labDesc) labDesc.textContent = data.desc;
        if (labMetric) labMetric.textContent = data.metric;
        if (labStandard) labStandard.textContent = data.labStandard;
        if (labProcessBadge) labProcessBadge.textContent = data.processTag;
        if (labImg) {
          labImg.style.opacity = '0.3';
          setTimeout(() => {
            labImg.src = data.img;
            labImg.style.opacity = '1';
          }, 150);
        }
      }
    });
  });

  // 4. Resources Filter Tabs (Catalogue, Brochures, Datasheets, Certifications)
  const resTabs = document.querySelectorAll('.res-tab-btn');
  const resCards = document.querySelectorAll('.resource-card');

  resTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      resTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      resCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Global Modal Helpers
  window.openModal = function(modalId, contextData) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // If specific product context is passed to quote modal
      if (modalId === 'modalQuote' && contextData) {
        const productSelect = document.getElementById('quoteProductSelect');
        if (productSelect && contextData.productName) {
          productSelect.value = contextData.productName;
        }
      }
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // 6. Toast Notification Helper
  window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="lucide-check-circle" style="color: #D4A359; font-size: 1.2rem;"></i>
      <div>
        <div style="font-weight: 700; font-size: 0.92rem; color: #FFFFFF;">${message}</div>
        <div style="font-size: 0.78rem; color: #A3B5AE;">Pearl Ply Concierge Team will connect shortly.</div>
      </div>
    `;
    container.appendChild(toast);

    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 5500);
  };

  // 6.5. INSTANT WHATSAPP (+91 99936 13434) & EMAIL LEAD NOTIFICATION ENGINE
  const NOTIFICATION_CONFIG = {
    WHATSAPP_PHONE: '919993613434',
    OFFICIAL_EMAIL: 'ambikatradingcompany.sonu@gmail.com',
    OWNER_NAME: 'Pearl Ply Management'
  };

  window.dispatchLeadNotification = function(lead) {
    const timeStr = new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    // 1. Format Professional WhatsApp Alert Message
    const alertMessage = 
      `🚨 *NEW LEAD INQUIRY - PEARL PLY CRM* 🚨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer / Firm:* ${lead.name || 'Direct Customer'}\n` +
      `📞 *Phone / WhatsApp:* ${lead.phone || 'N/A'}\n` +
      `📍 *Location & City:* ${lead.city || 'India'}\n` +
      `🪵 *Product Grade:* ${lead.product || 'Pearl Platinum / Pearl Black Decor'}\n` +
      `📦 *Requirement / Scope:* ${lead.quantity || 'General Project Scope'}\n` +
      `📢 *Lead Source Channel:* ${lead.channel || 'Website Inquiry'}\n` +
      `📝 *Client Notes:* ${lead.message || 'Direct online submission'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ *Reference ID:* ${lead.id || 'PL-' + Math.floor(100000 + Math.random() * 900000)}\n` +
      `🕒 *Received At:* ${timeStr}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Action Required:* Contact customer for technical rate card dispatch.`;

    const waAlertUrl = `https://wa.me/${NOTIFICATION_CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(alertMessage)}`;

    // 2. Format Email Notification Link
    const mailSubject = encodeURIComponent(`[Pearl Ply Lead Alert] ${lead.name || 'New Client'} - ${lead.product || 'Inquiry'}`);
    const mailBody = encodeURIComponent(alertMessage.replace(/\*/g, ''));
    const mailAlertUrl = `mailto:${NOTIFICATION_CONFIG.OFFICIAL_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

    // 3. Display High-Priority Interactive Notification Toast
    const container = document.getElementById('toastContainer');
    if (container) {
      const toast = document.createElement('div');
      toast.className = 'toast toast-lead-alert';
      toast.innerHTML = `
        <div class="toast-lead-header">
          <div class="toast-lead-title-wrap">
            <div class="toast-lead-icon">⚡</div>
            <div>
              <div class="toast-lead-heading">Inquiry Registered & Notified!</div>
              <div class="toast-lead-ref">Ref: ${lead.id || 'PL-NEW'} &bull; ${lead.channel || 'Website'}</div>
            </div>
          </div>
        </div>
        <div class="toast-lead-body">
          <div class="toast-lead-name">${lead.name}</div>
          <div class="toast-lead-meta">
            <span>📞 ${lead.phone}</span>
            <span>&bull;</span>
            <span>📍 ${lead.city || 'India'}</span>
          </div>
          <div style="font-size: 0.76rem; color: #D4A359; font-weight: 700;">🪵 ${lead.product || 'Pearl Platinum / Black Decor'}</div>
        </div>
        <div class="toast-lead-actions">
          <a href="${waAlertUrl}" target="_blank" class="toast-btn-wa">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            WhatsApp Alert (9993613434)
          </a>
          <a href="${mailAlertUrl}" class="toast-btn-mail">
            ✉️ Email Copy
          </a>
        </div>
      `;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }, 7500);
    }
  };

  // 7. Form Submit Handlers with Real-Time CRM Data Sync & Instant Notification Dispatch
  const forms = [
    { id: 'formQuote', msg: 'Quote Request Received & Logged in Admin CRM!', channel: 'Instant Quote' },
    { id: 'formSampleBox', msg: 'Architect Sample Box Dispatched for Approval!', channel: 'Architect Kit' },
    { id: 'formDealerApply', msg: 'Dealership Application Submitted Successfully!', channel: 'Dealership' },
    { id: 'formContact', msg: 'Thank you! Ingestion confirmed in Admin CRM.', channel: 'Contact Inquiry' }
  ];

  forms.forEach(f => {
    const formEl = document.getElementById(f.id);
    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = formEl.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
        // Extract field values
        const nameInput = formEl.querySelector('input[type="text"], input[name="name"], input[placeholder*="Name"], input[id*="name"]');
        const phoneInput = formEl.querySelector('input[type="tel"], input[name="phone"], input[placeholder*="Phone"], input[placeholder*="WhatsApp"]');
        const cityInput = formEl.querySelector('input[placeholder*="City"], input[id*="city"]');
        const productInput = formEl.querySelector('select[name="product"], select[id*="product"], select');
        const msgInput = formEl.querySelector('textarea, input[placeholder*="message"], input[placeholder*="requirement"]');

        const leadName = nameInput ? nameInput.value.trim() : 'Customer Lead';
        const leadPhone = phoneInput ? phoneInput.value.trim() : '+91 99936 13434';
        const leadCity = cityInput ? cityInput.value.trim() : 'National Hub';
        const leadProduct = productInput ? productInput.value : 'Pearl Platinum / Black Decor';
        const leadMsg = msgInput ? msgInput.value.trim() : `Submitted via website form: ${f.id}`;

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="lucide-loader-2" style="animation: spin 1s linear infinite;"></i> Ingesting Lead & Alerting WhatsApp...`;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }

          const leadObj = {
            id: 'PL-' + Math.floor(100000 + Math.random() * 900000),
            name: leadName,
            phone: leadPhone,
            city: leadCity,
            channel: f.channel,
            product: leadProduct,
            quantity: 'Inquiry Submitted',
            status: 'New',
            message: leadMsg,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
          };

          // 1. Save directly to CRM
          if (window.PearlCRM && typeof window.PearlCRM.saveLead === 'function') {
            window.PearlCRM.saveLead(leadObj);
          } else {
            const existing = JSON.parse(localStorage.getItem('pearl_crm_leads') || '[]');
            existing.unshift(leadObj);
            localStorage.setItem('pearl_crm_leads', JSON.stringify(existing));
          }

          // 2. Dispatch Instant WhatsApp (+91 99936 13434) & Email Notification
          window.dispatchLeadNotification(leadObj);

          formEl.reset();
          const parentModal = formEl.closest('.modal-backdrop');
          if (parentModal) {
            parentModal.classList.remove('active');
            document.body.style.overflow = 'auto';
          }
        }, 500);
      });
    }
  });

  // 8. Product Technical Specs Modal Populate & View
  const PRODUCT_SPECS_DATA = {
    'mr': {
      title: 'Pearl Commercial MR Plywood (IS:303)',
      grade: 'IS:303 Moisture Resistant Grade',
      core: 'Selected High-Density Hardwood Veneers',
      resin: 'Fortified Melamine Urea Formaldehyde (MUF)',
      thickness: '6mm, 9mm, 12mm, 16mm, 19mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: 'Water resistance at 60°C for 3 hours',
      screwHolding: '> 2100 N (Face) | > 1350 N (Edge)',
      warranty: '10 Years Borer & Termite Warranty',
      applications: 'Bedroom wardrobes, false ceilings, TV back panels, living furniture'
    },
    'bwr': {
      title: 'Pearl BWR Moisture Guard Plywood (IS:303)',
      grade: 'Boiling Water Resistant Grade',
      core: '100% Calibrated Hardwood & Gurjan',
      resin: 'Modified Phenol Formaldehyde Synthetic Resin',
      thickness: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: 'Immersion in boiling water for 8 continuous hours without delamination',
      screwHolding: '> 2300 N (Face) | > 1450 N (Edge)',
      warranty: '15 Years Replacement Guarantee',
      applications: 'Kitchen upper cabinets, dining tables, semi-humid partition walls'
    },
    'bwp': {
      title: 'Pearl Marine BWP 710 Plywood',
      grade: 'IS:710 Boiling Water Proof Certified',
      core: '100% Imported Gurjan / Eucalyptus Timber Core',
      resin: '100% Undiluted Phenol Formaldehyde (BWP Grade)',
      thickness: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: '72-Hour Continuous Boiling Water Proof Immersion Test Passed',
      screwHolding: '> 2650 N (Face) | > 1650 N (Edge)',
      warranty: '20 Years Complete Peace of Mind Guarantee',
      applications: 'Modular kitchen base cabinets, under-sink boxes, vanity counters, bathrooms'
    },
    'marine': {
      title: 'Pearl 100% Calibrated Marine Plywood (IS:710)',
      grade: 'Super-Premium Marine IS:710 & EN-314 Class 3',
      core: '100% Selected Gurjan Core with 0.1mm Quad-Calibration',
      resin: 'High-Purity Phenolic Marine Matrix',
      thickness: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: '72+ Hours Boiling Water Test + Extreme Saline Environment Resistance',
      screwHolding: '> 2900 N (Face) | > 1850 N (Edge)',
      warranty: '25 Years Replacement Guarantee',
      applications: 'Coastal luxury residences, CNC automated modular factories, luxury yachts'
    },
    'commercial': {
      title: 'Pearl Commercial Plywood (Hardwood Core)',
      grade: 'General Purpose Interior Commercial Grade',
      core: 'Uniform Hardwood Core Veneers with Zero Gap Layup',
      resin: 'Advanced Urea Formaldehyde Formulation',
      thickness: '4mm, 6mm, 9mm, 12mm, 18mm',
      dimensions: '8x4, 7x4 ft',
      boilingTest: 'Standard Indoor Moisture Barrier Tested',
      screwHolding: '> 1950 N (Face) | > 1200 N (Edge)',
      warranty: '7 Years Standard Manufacturing Warranty',
      applications: 'Office partition frames, packaging, sofa inner framing, temporary paneling'
    },
    'ultima_plus': {
      title: 'Pearl Ultima Plus (IS:710 BWP Marine Grade)',
      grade: 'IS:710 BWP Grade • CM/L 9504492',
      core: '100% Gurjan Inside with Extra Layer Technology & High Density Compaction',
      resin: '100% Undiluted Phenol Formaldehyde (PF) Marine Resin (Low VOC)',
      thickness: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: '72-Hour Continuous Boiling Water Proof Immersion Test (Zero Delamination)',
      screwHolding: '> 2850 N (Face) | > 1750 N (Edge)',
      warranty: '15 Years Guarantee',
      applications: 'Modular kitchen base units, wet areas, bathroom vanities, luxury wardrobes, coastal residences'
    },
    'ultima_ply': {
      title: 'Pearl Ultima Ply (IS:303 BWR Grade)',
      grade: 'IS:303 BWR Grade • CM/L 9760279217',
      core: 'High Density Hardwood Core with Calibrated Gurjan Face & Extra Layer',
      resin: 'Fortified Phenol Formaldehyde Synthetic Resin Matrix (Low VOC)',
      thickness: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: '8-Hour Continuous Boiling Resistant (Hot Pressed Technology)',
      screwHolding: '> 2450 N (Face) | > 1550 N (Edge)',
      warranty: '10 Years Guarantee',
      applications: 'Kitchen upper cabinets, wardrobes, dining furniture, living partitions, architectural woodworking'
    },
    'platinum': {
      title: 'Pearl Platinum Flush Door (IS:2202 BWP)',
      grade: 'IS:2202 BWP Grade • ISO 9001:2008',
      core: '100% Pure Pine Wood Solid Door Core with GD Protection',
      resin: 'Phenol Formaldehyde (PF) BWP Synthetic Resin',
      thickness: '30mm, 35mm',
      dimensions: '8x4, 7x4, 7x3, 6.5x3 ft',
      boilingTest: 'Full Water Proof (BWP) & Superior Swell Proof',
      screwHolding: '> 3000 N (Face) | > 2100 N (Edge)',
      warranty: '10-Year Guarantee',
      applications: 'Main entrance doors, bathroom doors, bedroom luxury doors, commercial suites'
    },
    'blackdecor': {
      title: 'Pearl Black Decor MR Plywood (IS:303)',
      grade: 'IS:303 MR Grade • Type AA (ISI Marked)',
      core: 'Full Core, Full Panel Construction with 100% Gurjan Face',
      resin: 'Fortified Melamine Urea Formaldehyde (MUF)',
      thickness: '9mm, 12mm, 16mm, 18mm, 19mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: 'Moisture Resistant Interior Immersion Tested',
      screwHolding: '> 2350 N (Face) | > 1450 N (Edge)',
      warranty: '10-Year Guarantee',
      applications: 'Premium living furniture, modular wardrobes, TV consoles, wall paneling'
    },
    'blockboard': {
      title: 'Pearl SolidCore Block Board (IS:1659)',
      grade: 'IS:1659 Solid Batten Blockboard',
      core: 'Seasoned Pine / Hardwood Solid Core Battens',
      resin: 'BWP / MR Grade Phenolic & Melamine Bonding',
      thickness: '19mm, 25mm, 30mm',
      dimensions: '8x4, 7x4, 8x3, 7x3 ft',
      boilingTest: 'High Thermal & Moisture Immersion Resistant',
      screwHolding: '> 2800 N (High Retention Batten Core)',
      warranty: '20 Years Anti-Warping Guarantee',
      applications: '7ft to 9ft tall wardrobe shutters, solid core doors, long conference tables'
    }
  };

  window.openProductSpecs = function(productKey) {
    const data = PRODUCT_SPECS_DATA[productKey];
    if (!data) return;

    document.getElementById('specModalTitle').textContent = data.title;
    document.getElementById('specGrade').textContent = data.grade;
    document.getElementById('specCore').textContent = data.core;
    document.getElementById('specResin').textContent = data.resin;
    document.getElementById('specThickness').textContent = data.thickness;
    document.getElementById('specDimensions').textContent = data.dimensions;
    document.getElementById('specBoiling').textContent = data.boilingTest;
    document.getElementById('specHolding').textContent = data.screwHolding;
    document.getElementById('specWarranty').textContent = data.warranty;
    document.getElementById('specApplications').textContent = data.applications;

    openModal('modalProductSpecs');
  };

  // 9. Real PDF Download Handler
  const PDF_MAP = {
    'Pearl Ply Master Catalogue 2026': 'assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf',
    'Pearl Ply Master Product Catalogue 2026': 'assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf',
    'Pearl Ply Product Catalogue 2026': 'assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf',
    'Pearl Ply Product Catalogue': 'assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf',
    'Marine BWP 710 Series Brochure': 'assets/docs/Pearl_Ply_Marine_BWP_710_Brochure.pdf',
    'Pearl Ply Series Brochures': 'assets/docs/Pearl_Ply_Marine_BWP_710_Brochure.pdf',
    'Technical Data Sheets TDS': 'assets/docs/Pearl_Ply_Technical_Data_Sheet_TDS.pdf',
    'Technical Data Sheet (TDS Matrix)': 'assets/docs/Pearl_Ply_Technical_Data_Sheet_TDS.pdf',
    'Technical Data Sheet': 'assets/docs/Pearl_Ply_Technical_Data_Sheet_TDS.pdf',
    'Technical Data Sheet TDS Matrix': 'assets/docs/Pearl_Ply_Technical_Data_Sheet_TDS.pdf',
    'BIS & ISO Official Licenses': 'assets/docs/Pearl_Ply_BIS_IS710_IS303_Certifications.pdf',
    'BIS License IS:710 & IS:303 Copy': 'assets/docs/Pearl_Ply_BIS_IS710_IS303_Certifications.pdf',
    'BIS License IS710 and IS303 Official Copy': 'assets/docs/Pearl_Ply_BIS_IS710_IS303_Certifications.pdf',
    'BIS and ISO Certifications': 'assets/docs/Pearl_Ply_BIS_IS710_IS303_Certifications.pdf'
  };

  window.triggerDownload = function(docTitle) {
    showToast(`Downloading: ${docTitle} (PDF)`);
    const filePath = PDF_MAP[docTitle] || 'assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf';
    
    const a = document.createElement('a');
    a.href = filePath;
    a.download = filePath.split('/').pop();
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Initialize Lucide Icons
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // 10. Auto Lead Capture Popup on Load
  setTimeout(() => {
    // Only show once per session
    if (!sessionStorage.getItem('leadPopupShown')) {
      openModal('modalLeadPopup');
      sessionStorage.setItem('leadPopupShown', 'true');
    }
  }, 3000);

  // 11. Lead Capture Form Handler
  window.submitLeadForm = function(event) {
    event.preventDefault();
    const formEl = document.getElementById('formLeadPopup');
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    const leadName = document.getElementById('leadName').value.trim();
    const leadPhone = document.getElementById('leadPhone').value.trim();
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="lucide-loader-2" style="animation: spin 1s linear infinite;"></i> Processing...`;
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      const leadObj = {
        id: 'PL-' + Math.floor(100000 + Math.random() * 900000),
        name: leadName,
        phone: leadPhone,
        city: 'N/A',
        channel: 'Welcome Popup Lead',
        product: 'General Inquiry',
        quantity: 'Website Auto Popup',
        status: 'New',
        message: 'Lead captured from automatic welcome popup form.',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };
      
      // Save directly to CRM local storage
      if (window.PearlCRM && typeof window.PearlCRM.saveLead === 'function') {
        window.PearlCRM.saveLead(leadObj);
      } else {
        const existing = JSON.parse(localStorage.getItem('pearl_crm_leads') || '[]');
        existing.unshift(leadObj);
        localStorage.setItem('pearl_crm_leads', JSON.stringify(existing));
      }
      
      // Dispatch Instant WhatsApp & Email Notification
      if (typeof window.dispatchLeadNotification === 'function') {
        window.dispatchLeadNotification(leadObj);
      }
      
      formEl.reset();
      closeModal('modalLeadPopup');
      showToast('Thank you! Our expert will connect with you shortly.');
    }, 800);
  };

  // Discrete Owner Shortcut to Admin CRM: Press Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      window.location.href = 'admin.html';
    }
  });
});

// Also trigger on window load
window.addEventListener('load', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
});
