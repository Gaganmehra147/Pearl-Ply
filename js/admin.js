/**
 * PEARL PLY - ENTERPRISE ANALYTICAL CRM & COMMAND CENTER ENGINE
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'pearl_crm_leads_v2';
  const AUTH_KEY = 'pearl_admin_auth';
  const MASTER_PASSWORD = 'admin123';

  // Force purge all legacy mock demo data from local storage
  ['pearl_crm_leads', 'pearl_crm_leads_v1', 'pearl_leads'].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  // Master Initial Records - Empty array for live production
  const DEFAULT_LEADS = [];

  let leads = [];
  let currentFilter = 'All';
  let searchQuery = '';

  // 0. Security & Authentication Controller
  function checkAuth() {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    const lockOverlay = document.getElementById('adminAuthLock');
    const dashboard = document.getElementById('adminAppDashboard');

    if (isAuth) {
      if (lockOverlay) lockOverlay.style.display = 'none';
      if (dashboard) dashboard.style.display = 'block';
      renderAll();
    } else {
      if (lockOverlay) lockOverlay.style.display = 'flex';
      if (dashboard) dashboard.style.display = 'none';
      const passInput = document.getElementById('adminPassInput');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
    }
    return isAuth;
  }

  window.handleAdminLogin = function(e) {
    if (e) e.preventDefault();
    const passInput = document.getElementById('adminPassInput');
    const errBox = document.getElementById('authErrorMsg');
    const entered = passInput ? passInput.value.trim() : '';

    if (entered === MASTER_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      if (errBox) errBox.style.display = 'none';
      checkAuth();
    } else {
      if (errBox) {
        errBox.textContent = '❌ Invalid Admin Password. Access Denied.';
        errBox.style.display = 'block';
      }
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
    }
  };

  window.adminLogout = function() {
    sessionStorage.removeItem(AUTH_KEY);
    checkAuth();
  };

  // 1. Data Store Controller
  function getLeads() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Remove any legacy mock seed leads
          const mockIds = ['PL-894198', 'PL-894185', 'PL-894172', 'PL-894160', 'PL-894145', 'PL-894110', 'PL-894201'];
          const filtered = parsed.filter(l => l && !mockIds.includes(l.id));
          if (filtered.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          }
          return filtered;
        }
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEADS));
    return DEFAULT_LEADS;
  }

  function saveAllLeads(data) {
    leads = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    renderAll();
  }

  // 2. Analytical Intelligence Aggregations
  function updateAnalytics() {
    leads = getLeads();
    const totalCount = leads.length;

    // A. KPI Top Metrics
    const chatbotCount = leads.filter(l => (l.channel || '').toLowerCase().includes('chat')).length;
    const quoteCount = leads.filter(l => (l.channel || '').toLowerCase().includes('quote')).length;
    const archCount = leads.filter(l => (l.channel || '').toLowerCase().includes('architect')).length;
    const dealerCount = leads.filter(l => (l.channel || '').toLowerCase().includes('dealer')).length;
    const calcCount = leads.filter(l => (l.channel || '').toLowerCase().includes('calc')).length;

    // Calculate Estimated Sheet Volumes & Pipeline Value (₹)
    let totalSheets = 0;
    let pipelineValueLakhs = 0;

    leads.forEach(l => {
      const qtyStr = (l.quantity || '').toLowerCase();
      const numMatch = qtyStr.match(/(\d+)\s*sheet/);
      if (numMatch) {
        totalSheets += parseInt(numMatch[1], 10);
      } else if (qtyStr.includes('project') || qtyStr.includes('bhk')) {
        totalSheets += 35;
      } else if (l.channel === 'Dealership') {
        totalSheets += 250;
      } else {
        totalSheets += 20;
      }

      // Valuations
      if (l.channel === 'Dealership') {
        pipelineValueLakhs += 35;
      } else if (l.product && (l.product.includes('Ultima Plus') || l.product.includes('710'))) {
        pipelineValueLakhs += 1.8;
      } else {
        pipelineValueLakhs += 1.2;
      }
    });

    // Populate DOM KPIs
    const elTotal = document.getElementById('kpiTotalLeads');
    const elVal = document.getElementById('kpiPipelineVal');
    const elVol = document.getElementById('kpiSheetVolume');
    const elChat = document.getElementById('kpiChatbotCount');
    const elArch = document.getElementById('kpiArchitectKits');
    const elDealer = document.getElementById('kpiDealerCount');

    if (elTotal) elTotal.textContent = totalCount;
    if (elVal) elVal.textContent = totalCount > 0 ? `₹${(pipelineValueLakhs / 100).toFixed(2)} Cr` : '₹0.00';
    if (elVol) elVol.textContent = `${totalSheets.toLocaleString()} Sheets`;
    if (elChat) elChat.textContent = totalCount > 0 ? `${chatbotCount} (${Math.round((chatbotCount / totalCount) * 100)}%)` : '0';
    if (elArch) elArch.textContent = archCount;
    if (elDealer) elDealer.textContent = dealerCount;

    // B. Channel Acquisition Progress Bars
    const channelListEl = document.getElementById('channelProgressList');
    if (channelListEl) {
      const channels = [
        { name: 'AI Chatbot Ingestion', count: chatbotCount, color: 'purple' },
        { name: 'Instant Rate Quotes', count: quoteCount, color: 'blue' },
        { name: 'Architect Presentation Kits', count: archCount, color: 'gold' },
        { name: 'B2B Dealership Portfolios', count: dealerCount, color: 'green' },
        { name: 'Interactive Sheet Calculator', count: calcCount, color: 'amber' }
      ];

      channelListEl.innerHTML = channels.map(c => {
        const pct = totalCount > 0 ? Math.round((c.count / totalCount) * 100) : 0;
        return `
          <div class="progress-item">
            <div class="progress-meta">
              <span class="progress-label">${c.name}</span>
              <span class="progress-val">${c.count} leads (${pct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${c.color}" style="width: ${totalCount > 0 ? Math.max(pct, 6) : 0}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // C. Product Grade Demand Matrix (4 Real Pearl Ply Products)
    const gradeListEl = document.getElementById('gradeProgressList');
    if (gradeListEl) {
      const plusCount = leads.filter(l => (l.product || '').includes('Ultima Plus') || (l.product || '').includes('710')).length;
      const plyCount = leads.filter(l => (l.product || '').includes('Ultima Ply') || (l.product || '').includes('BWR')).length;
      const platCount = leads.filter(l => (l.product || '').includes('Platinum') || (l.product || '').includes('Flush') || (l.product || '').includes('Door')).length;
      const decorCount = leads.filter(l => (l.product || '').includes('Black Decor') || (l.product || '').includes('MR')).length;

      const grades = [
        { name: 'Pearl Ultima Plus (IS:710 BWP Marine)', count: plusCount, color: 'gold' },
        { name: 'Pearl Ultima Ply (IS:303 BWR Grade)', count: plyCount, color: 'blue' },
        { name: 'Pearl Platinum (IS:2202 Flush Door)', count: platCount, color: 'green' },
        { name: 'Pearl Black Decor (IS:303 MR Grade)', count: decorCount, color: 'amber' }
      ];

      gradeListEl.innerHTML = grades.map(g => {
        const pct = totalCount > 0 ? Math.round((g.count / totalCount) * 100) : 0;
        return `
          <div class="progress-item">
            <div class="progress-meta">
              <span class="progress-label">${g.name}</span>
              <span class="progress-val">${g.count} Inquiries (${pct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${g.color}" style="width: ${totalCount > 0 ? Math.max(pct, 6) : 0}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // D. Sales Pipeline Funnel Steps
    const statusCounts = {
      'New': leads.filter(l => l.status === 'New').length,
      'Contacted': leads.filter(l => l.status === 'Contacted').length,
      'Quote Sent': leads.filter(l => l.status === 'Quote Sent').length,
      'Sample Dispatched': leads.filter(l => l.status === 'Sample Dispatched').length,
      'Closed Won': leads.filter(l => l.status === 'Closed Won').length
    };

    const fnNew = document.getElementById('funnelNew');
    const fnCon = document.getElementById('funnelContacted');
    const fnQuo = document.getElementById('funnelQuote');
    const fnSam = document.getElementById('funnelSample');
    const fnClo = document.getElementById('funnelClosed');

    if (fnNew) fnNew.textContent = statusCounts['New'];
    if (fnCon) fnCon.textContent = statusCounts['Contacted'];
    if (fnQuo) fnQuo.textContent = statusCounts['Quote Sent'];
    if (fnSam) fnSam.textContent = statusCounts['Sample Dispatched'];
    if (fnClo) fnClo.textContent = statusCounts['Closed Won'];

    // Update Filter Pill Counters
    const pillAll = document.getElementById('pillAllCount');
    const pillChat = document.getElementById('pillChatCount');
    const pillQuo = document.getElementById('pillQuoteCount');
    const pillArch = document.getElementById('pillArchCount');
    const pillDeal = document.getElementById('pillDealerCount');
    const pillCalc = document.getElementById('pillCalcCount');

    if (pillAll) pillAll.textContent = totalCount;
    if (pillChat) pillChat.textContent = chatbotCount;
    if (pillQuo) pillQuo.textContent = quoteCount;
    if (pillArch) pillArch.textContent = archCount;
    if (pillDeal) pillDeal.textContent = dealerCount;
    if (pillCalc) pillCalc.textContent = calcCount;
  }

  // 3. Render High-Density Table
  function renderTable() {
    leads = getLeads();
    const tbody = document.getElementById('crmTableBody');
    if (!tbody) return;

    let filtered = leads.filter(l => {
      // Channel Filter
      if (currentFilter !== 'All') {
        const ch = (l.channel || '').toLowerCase();
        if (currentFilter === 'AI Chatbot' && !ch.includes('chat')) return false;
        if (currentFilter === 'Instant Quote' && !ch.includes('quote')) return false;
        if (currentFilter === 'Architect Kit' && !ch.includes('architect')) return false;
        if (currentFilter === 'Dealership' && !ch.includes('dealer')) return false;
        if (currentFilter === 'Calculator' && !ch.includes('calc')) return false;
      }

      // Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchStr = `${l.name} ${l.phone} ${l.email || ''} ${l.city} ${l.product} ${l.channel} ${l.id}`.toLowerCase();
        if (!searchStr.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px 20px; color: var(--adm-text-muted);">
            <div style="font-size: 1.15rem; color: var(--adm-gold); font-weight: 700; margin-bottom: 6px;">
              ${leads.length === 0 ? '✨ CRM Ready for Live Inquiries' : 'No Inquiries Matching Search'}
            </div>
            <p style="margin: 0; font-size: 0.84rem; color: #A3B5AE;">
              ${leads.length === 0 ? 'Customer inquiries from website forms, plywood calculator, and AI chatbot will appear here in real time.' : 'Try changing your search query or channel filter tab.'}
            </p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(lead => {
      // Source Class
      let srcClass = 'quote';
      const ch = (lead.channel || '').toLowerCase();
      if (ch.includes('chat')) srcClass = 'chatbot';
      else if (ch.includes('architect')) srcClass = 'architect';
      else if (ch.includes('dealer')) srcClass = 'dealer';
      else if (ch.includes('calc')) srcClass = 'calculator';

      // WhatsApp sanitized link
      const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(lead.name)},%20this%20is%20Pearl%20Ply%20Regional%20Technical%20Consultant%20regarding%20your%20inquiry%20for%20${encodeURIComponent(lead.product || 'Plywood')}.`;

      return `
        <tr>
          <td>
            <div style="font-weight: 800; color: var(--adm-gold); letter-spacing: 0.04em;">${lead.id}</div>
            <div style="font-size: 0.72rem; color: var(--adm-text-muted);">${lead.date || 'Today'}</div>
          </td>
          <td>
            <div style="font-weight: 800; color: #FFFFFF; font-size: 0.88rem;">${escapeHTML(lead.name)}</div>
            <div style="font-size: 0.74rem; color: var(--adm-text-muted);">${escapeHTML(lead.email || 'N/A')}</div>
          </td>
          <td>
            <div style="font-weight: 700; color: #E2EAE6;">${escapeHTML(lead.phone)}</div>
            <div style="font-size: 0.74rem; color: var(--adm-text-muted); display: flex; align-items: center; gap: 4px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${escapeHTML(lead.city || 'National')}
            </div>
          </td>
          <td>
            <span class="source-tag ${srcClass}">${escapeHTML(lead.channel || 'Direct Inquiry')}</span>
          </td>
          <td>
            <div style="font-weight: 700; color: #FFFFFF;">${escapeHTML(lead.product || 'Pearl Ultima Plus')}</div>
            <div style="font-size: 0.72rem; color: var(--adm-gold);">${escapeHTML(lead.quantity || 'Inquiry Submitted')}</div>
          </td>
          <td>
            <select class="status-dropdown" onchange="window.PearlCRM.updateStatus('${lead.id}', this.value)">
              <option value="New" ${lead.status === 'New' ? 'selected' : ''}>🟡 New</option>
              <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>🔵 Contacted</option>
              <option value="Quote Sent" ${lead.status === 'Quote Sent' ? 'selected' : ''}>🟣 Quote Sent</option>
              <option value="Sample Dispatched" ${lead.status === 'Sample Dispatched' ? 'selected' : ''}>📦 Sample Dispatched</option>
              <option value="Closed Won" ${lead.status === 'Closed Won' ? 'selected' : ''}>🟢 Closed Won</option>
            </select>
          </td>
          <td>
            <div class="row-actions">
              <a href="${waUrl}" target="_blank" class="btn-icon-action wa" title="1-Click WhatsApp Chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <button class="btn-icon-action view" onclick="window.PearlCRM.viewDossier('${lead.id}')" title="View Full Lead Dossier">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button class="btn-icon-action del" onclick="window.PearlCRM.deleteLead('${lead.id}')" title="Delete Record">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderAll() {
    updateAnalytics();
    renderTable();
  }

  // 4. Exposed Public APIs on window.PearlCRM
  window.PearlCRM = {
    saveLead: function(data) {
      const newLead = {
        id: data.id || ('PL-' + Math.floor(100000 + Math.random() * 900000)),
        name: data.name || 'Anonymous Customer',
        phone: data.phone || 'N/A',
        email: data.email || 'N/A',
        city: data.city || 'Direct Inquiry',
        product: data.product || 'Pearl Ultima Plus',
        channel: data.channel || 'Website Form',
        quantity: data.quantity || 'Inquiry Submitted',
        status: data.status || 'New',
        message: data.message || 'Direct lead captured.',
        date: data.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: data.timestamp || Date.now()
      };
      const list = getLeads();
      list.unshift(newLead);
      saveAllLeads(list);
      window.dispatchEvent(new CustomEvent('pearl_lead_added', { detail: newLead }));
      return newLead;
    },

    updateStatus: function(leadId, newStatus) {
      leads = getLeads();
      const item = leads.find(l => l.id === leadId);
      if (item) {
        item.status = newStatus;
        saveAllLeads(leads);
      }
    },

    deleteLead: function(leadId) {
      if (confirm(`Are you sure you want to delete lead ${leadId}?`)) {
        leads = getLeads().filter(l => l.id !== leadId);
        saveAllLeads(leads);
      }
    },

    resetToDefaults: function() {
      if (confirm('Clear all CRM records and reset to empty state?')) {
        saveAllLeads([]);
      }
    },

    exportCSV: function() {
      leads = getLeads();
      const headers = ['Ref ID', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'Channel', 'Product', 'Quantity/Scope', 'Pipeline Status', 'Notes'];
      const rows = leads.map(l => [
        l.id,
        `"${l.date || ''}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${l.email || ''}"`,
        `"${(l.city || '').replace(/"/g, '""')}"`,
        `"${l.channel || ''}"`,
        `"${(l.product || '').replace(/"/g, '""')}"`,
        `"${(l.quantity || '').replace(/"/g, '""')}"`,
        `"${l.status || ''}"`,
        `"${(l.message || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Pearl_Ply_CRM_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    viewDossier: function(leadId) {
      leads = getLeads();
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      document.getElementById('dosAvatar').textContent = (lead.name || 'P')[0].toUpperCase();
      document.getElementById('dosName').textContent = lead.name;
      document.getElementById('dosRefId').textContent = lead.id;
      document.getElementById('dosDate').textContent = lead.date || 'Today';
      document.getElementById('dosChannel').textContent = lead.channel || 'Direct';
      document.getElementById('dosPhone').textContent = lead.phone;
      document.getElementById('dosEmail').textContent = lead.email || 'N/A';
      document.getElementById('dosCity').textContent = lead.city;
      document.getElementById('dosProduct').textContent = lead.product || 'Pearl Ultima Plus';
      document.getElementById('dosQty').textContent = lead.quantity || 'General Scope';
      document.getElementById('dosStatus').textContent = lead.status;
      document.getElementById('dosMessage').textContent = `"${lead.message || 'No additional notes provided.'}"`;

      const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(lead.name)},%20this%20is%20Pearl%20Ply%20regarding%20your%20inquiry%20(${lead.id}).`;
      document.getElementById('dosWhatsAppBtn').href = waUrl;

      document.getElementById('modalLeadDetails')?.classList.add('active');
    }
  };

  // 5. Modal Controllers
  window.openAddLeadModal = function() {
    document.getElementById('modalAddLead')?.classList.add('active');
  };

  window.closeAddLeadModal = function() {
    document.getElementById('modalAddLead')?.classList.remove('active');
  };

  window.closeLeadDetails = function() {
    document.getElementById('modalLeadDetails')?.classList.remove('active');
  };

  // 6. Bind Events
  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Filter Pills
    document.querySelectorAll('.filter-pill-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-channel') || 'All';
        renderTable();
      });
    });

    // Search Input
    const searchInput = document.getElementById('adminSearchInput');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderTable();
    });

    // Manual Lead Form Ingestion
    const manualForm = document.getElementById('formManualLead');
    manualForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newLead = {
        id: 'PL-' + Math.floor(100000 + Math.random() * 900000),
        name: document.getElementById('mName')?.value.trim(),
        phone: document.getElementById('mPhone')?.value.trim(),
        email: document.getElementById('mEmail')?.value.trim() || 'N/A',
        city: document.getElementById('mCity')?.value.trim(),
        product: document.getElementById('mProduct')?.value,
        channel: document.getElementById('mChannel')?.value,
        quantity: document.getElementById('mQuantity')?.value.trim() || 'Inquiry Submitted',
        status: 'New',
        message: document.getElementById('mMessage')?.value.trim() || 'Direct lead created via Executive CRM Console.',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };

      const current = getLeads();
      current.unshift(newLead);
      saveAllLeads(current);
      manualForm.reset();
      window.closeAddLeadModal();
    });

    // Listen for real-time lead additions from Chatbot / Website
    window.addEventListener('pearl_lead_added', () => {
      renderAll();
    });
  });

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

})();
