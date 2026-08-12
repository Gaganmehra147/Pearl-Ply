/* ==========================================================================
   PEARL PLY - INTELLIGENT AI CHATBOT & CRM SYNC ENGINE
   ========================================================================== */

(function() {
  // 1. Shared CRM Data Storage Utility
  window.PearlCRM = {
    STORAGE_KEY: 'pearl_crm_leads',
    
    getLeads: function() {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) return JSON.parse(data);
      } catch (e) {
        console.error('Error reading CRM leads:', e);
      }
      return this.getSeedLeads();
    },

    saveLead: function(leadData) {
      const leads = this.getLeads();
      const newLead = {
        id: 'PL-' + Date.now().toString().slice(-6),
        name: leadData.name || 'Anonymous Customer',
        phone: leadData.phone || 'N/A',
        email: leadData.email || 'N/A',
        city: leadData.city || 'National Inquiry',
        channel: leadData.channel || 'AI Chatbot',
        product: leadData.product || 'General Plywood Range',
        quantity: leadData.quantity || 'N/A',
        status: leadData.status || 'New',
        message: leadData.message || 'Chatbot Inquiry',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };
      
      leads.unshift(newLead);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leads));
      
      // Dispatch custom event for real-time CRM updates
      window.dispatchEvent(new CustomEvent('pearl_lead_added', { detail: newLead }));
      
      // Show notification toast if available
      if (typeof showToast === 'function') {
        showToast(`Lead Synced to Admin CRM: ${newLead.name} (${newLead.channel})`);
      }
      return newLead;
    },

    getSeedLeads: function() {
      const seed = [
        {
          id: 'PL-894201',
          name: 'Ar. Rajesh Verma',
          phone: '+91 98201 44520',
          email: 'rajesh@vermaarchitects.com',
          city: 'Mumbai, Maharashtra',
          channel: 'Architect Kit',
          product: 'Pearl 100% Calibrated Marine 710',
          quantity: 'Sample Box Dispatched',
          status: 'Sample Dispatched',
          message: 'Requested 4K CAD USB & wood swatch presentation box for luxury sea-facing villa project in Bandra.',
          date: '08 Aug 2026, 01:15 AM',
          timestamp: Date.now() - 1800000
        },
        {
          id: 'PL-894198',
          name: 'Vikram Timber & Hardware',
          phone: '+91 98765 12340',
          email: 'vikram@vikramtimber.in',
          city: 'Ahmedabad, Gujarat',
          channel: 'Dealership',
          product: 'Full Brand Distributorship',
          quantity: '₹25L - ₹50L Investment',
          status: 'Contacted',
          message: 'Applying for exclusive territory dealership across SG Highway showroom.',
          date: '07 Aug 2026, 11:45 PM',
          timestamp: Date.now() - 7200000
        },
        {
          id: 'PL-894185',
          name: 'Pooja Mehta',
          phone: '+91 97110 88231',
          email: 'pooja.mehta@gmail.com',
          city: 'Gurugram, Haryana',
          channel: 'Calculator',
          product: 'Pearl Marine BWP 710',
          quantity: '18 Sheets (Kitchen + Wardrobes)',
          status: 'Quote Sent',
          message: 'Calculated 18mm & 12mm mix for 3BHK flat renovation in DLF Phase 5.',
          date: '07 Aug 2026, 09:20 PM',
          timestamp: Date.now() - 18000000
        },
        {
          id: 'PL-894172',
          name: 'Sunil Aggarwal (Contractor)',
          phone: '+91 94140 22910',
          email: 'sunil.buildcon@rediffmail.com',
          city: 'Jaipur, Rajasthan',
          channel: 'AI Chatbot',
          product: 'Pearl SolidCore Blockboard',
          quantity: '120 Sheets (8x4 ft)',
          status: 'New',
          message: 'Inquired about anti-warping warranty for 8ft wardrobe shutters for commercial hotel suite fitting.',
          date: '07 Aug 2026, 07:10 PM',
          timestamp: Date.now() - 25000000
        },
        {
          id: 'PL-894160',
          name: 'Amitabh Sen',
          phone: '+91 98300 55122',
          email: 'amitabh.sen@interiorstudio.co',
          city: 'Kolkata, West Bengal',
          channel: 'Instant Quote',
          product: 'Pearl 100% Calibrated Marine 710',
          quantity: '45 Sheets (19mm)',
          status: 'Closed Won',
          message: 'Factory dispatch order confirmed for coastal apartment project in New Town.',
          date: '07 Aug 2026, 04:30 PM',
          timestamp: Date.now() - 36000000
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
  };

  // 2. Google Gemini LLM API Configuration & Strict Business Prompt
  const GEMINI_CONFIG = {
    API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
    PRIMARY_MODEL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    FALLBACK_MODEL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    SYSTEM_INSTRUCTION: `You are "Pearl AI", the official AI Timber & Plywood Technical Consultant for "Pearl Ply" (India's premier manufacturer of IS:710 Marine Plywood, BWR Moisture Guard, Commercial MR, and SolidCore Blockboards).

CRITICAL GROUNDING RULES:
1. STRICT BUSINESS FOCUS ONLY:
   - You must ONLY answer questions about Pearl Ply, plywood grades, wood specifications, furniture applications, prices, testing standards, factory manufacturing, architect sample kits, and dealership opportunities.
   - STRICT REFUSAL: If the user asks about ANYTHING outside Pearl Ply's business (e.g. insults, jokes, math, coding, politics, recipes, weather, general knowledge), DO NOT get distracted. Politely respond in the same language:
     - Hindi: "मैं पर्ल प्लाई (Pearl Ply) का अधिकृत AI कंसल्टेंट हूँ। मैं केवल प्लाईवुड ग्रेड्स, रेट्स, थिकनेस, और फर्नीचर स्पेसिफिकेशन्स में आपकी मदद कर सकता हूँ। आपकी प्लाईवुड आवश्यकता क्या है?"
     - English: "I am Pearl Ply's official AI Timber Consultant. I can only assist with plywood grades (IS:710 Marine, BWR, MR, Blockboard), rates, dimensions, and furniture projects. How can I help with your project?"

2. BILINGUAL NATURAL CONVERSATION (HINDI & ENGLISH):
   - Always respond in the EXACT language and tone the customer used (Hindi / Hinglish / English).
   - Be helpful, respectful, and professional like a senior plywood company advisor.

3. PEARL PLY SPECIFICATIONS & TECHNICAL MATRIX:
   - Pearl 100% Calibrated Marine 710 (IS:710): 100% Gurjan hardwood core, undiluted Phenol Formaldehyde resin, 72-hour boiling water test certified, 25-Year replacement warranty. Best for modular kitchen sinks, bathroom vanities, dining tables, and boats.
   - Pearl BWR Moisture Guard (IS:303): Synthetic phenolic resin bonding, 8-hour boiling water resistant, 15-Year warranty. Ideal for kitchen overhead cabinets and dining areas.
   - Pearl Commercial MR (IS:303): Fortified Melamine Urea Formaldehyde (MUF) resin with vacuum chemical anti-borer defense, 10-Year warranty. Best for bedroom wardrobes, TV wall paneling, and false ceilings.
   - Pearl SolidCore Blockboard (IS:1659): Kiln-dried seasoned solid pine battens with Gurjan cross-bands. 100% anti-bend guarantee for 7ft to 9ft tall wardrobe shutters and doors. Thicknesses: 19mm, 25mm, 30mm.
   - 4x Automated Quad-Calibration: ±0.1mm micro-even thickness using European 4-head diamond sanders.
   - 7-Point Quality Testing Protocol: 72-hr boiling test, MOR tensile test (>55 N/mm²), autoclave vacuum chemical defense, knife shear adhesion test, screw holding (>2200 N), E0 low formaldehyde emission.
   - Indicative Price Range: Commercial MR 18mm (~₹65-₹85/sq.ft), BWR 18mm (~₹95-₹120/sq.ft), Marine 710 18mm (~₹130-₹165/sq.ft), Blockboard 19mm (~₹110-₹140/sq.ft).
   - Dealership / Distributor: Authorized Dealer (₹10L-₹25L), District Distributor (₹25L-₹50L+).
   - Architect Sample Box: Free luxury sample kit with real wood swatches & 4K CAD USB sent to architects.

4. LEAD CAPTURE INSTRUCTION:
   - Whenever the customer asks for price, quotation, dealership, or has a specific room/project, proactively invite them to share their Name, Phone number/WhatsApp, and City so you can sync their requirements to the Pearl Ply Admin CRM for factory discount dispatch.

5. FORMATTING: Use bold text for key terms and short, bulleted points for quick reading.`
  };

  // Conversation history memory
  let conversationHistory = [];

  // 3. Call Gemini LLM API (gemini-2.5-flash with automatic fallback)
  async function queryGeminiLLM(userPrompt) {
    try {
      conversationHistory.push({
        role: "user",
        parts: [{ text: userPrompt }]
      });

      // Keep recent 6 turns for optimal context
      if (conversationHistory.length > 8) {
        conversationHistory = conversationHistory.slice(-8);
      }

      const requestBody = {
        system_instruction: {
          parts: [{ text: GEMINI_CONFIG.SYSTEM_INSTRUCTION }]
        },
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600
        }
      };

      // Try Gemini 2.5 Flash first
      let response = await fetch(`${GEMINI_CONFIG.PRIMARY_MODEL}?key=${GEMINI_CONFIG.API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      // Fallback to Gemini 2.0 Flash if needed
      if (!response.ok) {
        response = await fetch(`${GEMINI_CONFIG.FALLBACK_MODEL}?key=${GEMINI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      }

      if (response.ok) {
        const data = await response.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botReply) {
          conversationHistory.push({
            role: "model",
            parts: [{ text: botReply }]
          });
          return formatMarkdownToHTML(botReply);
        }
      }
    } catch (err) {
      console.warn('Gemini API call error:', err);
    }
    // Fallback to internal Pearl Ply Knowledge base
    return generateLocalFallback(userPrompt);
  }

  function formatMarkdownToHTML(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•\s/g, '• ')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // 3. Render Floating Chatbot Markup on Customer Pages Only
  function initChatbotDOM() {
    // Guard: Do not render chatbot on admin panel
    if (document.querySelector('.admin-navbar') || window.location.pathname.includes('admin.html')) {
      return;
    }
    if (document.getElementById('pearlAiWidget')) return;
    const triggerBtn = document.createElement('div');
    triggerBtn.className = 'pearl-ai-trigger';
    triggerBtn.id = 'pearlAiTrigger';
    triggerBtn.setAttribute('title', 'Chat with Pearl AI Assistant');
    triggerBtn.innerHTML = `
      <div class="pearl-ai-sparkle">
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v4"></path>
          <path d="M4 10h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"></path>
          <circle cx="9" cy="15" r="1.5" fill="currentColor"></circle>
          <circle cx="15" cy="15" r="1.5" fill="currentColor"></circle>
          <path d="M9 19h6"></path>
        </svg>
        <div class="pearl-ai-dot"></div>
      </div>
    `;
    document.body.appendChild(triggerBtn);

    // 2. Chatbot Widget Window (With Top Lead Capture Drawer)
    const widget = document.createElement('div');
    widget.className = 'pearl-ai-widget';
    widget.id = 'pearlAiWidget';
    widget.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            P
            <div class="chat-online-dot"></div>
          </div>
          <div class="chat-header-title">
            <h4>Pearl AI Specialist</h4>
            <p><span class="pulse-dot"></span> Plywood Specs & Rates</p>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="header-lead-btn" id="toggleTopLeadBtn" title="Request Quotation / Callback">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Get Quote
          </button>
          <button class="chat-close-btn" id="chatCloseBtn" aria-label="Close Chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Top Collapsible Lead Capture Drawer (At the Top) -->
      <div class="top-lead-drawer" id="topLeadDrawer">
        <div class="top-lead-header">
          <h5>⚡ Connect with Technical Specialist</h5>
          <button class="top-lead-close" id="closeTopLeadDrawer">&times; Close</button>
        </div>
        <div class="top-lead-grid">
          <input type="text" id="chatLeadName" placeholder="Full Name *" required />
          <input type="tel" id="chatLeadPhone" placeholder="Phone / WhatsApp *" required />
          <input type="text" id="chatLeadCity" placeholder="City & State *" required />
          <select id="chatLeadProduct">
            <option value="Pearl Ultima Plus (IS:710 BWP)">Pearl Ultima Plus (IS:710 BWP)</option>
            <option value="Pearl Ultima Ply (IS:303 BWR)">Pearl Ultima Ply (IS:303 BWR)</option>
            <option value="Pearl Platinum Flush Door (IS:2202)">Pearl Platinum Flush Door</option>
            <option value="Pearl Black Decor MR (IS:303)">Pearl Black Decor MR</option>
            <option value="Pearl 100% Calibrated Marine 710">Pearl Marine BWP 710</option>
            <option value="Pearl SolidCore Blockboard">SolidCore Blockboard</option>
            <option value="Dealership Partnership">Dealership Partnership</option>
            <option value="Architect Sample Kit">Architect Sample Kit</option>
          </select>
        </div>
        <button onclick="window.submitChatLead('Top Drawer Ingestion')">Save & Sync to Admin CRM</button>
      </div>

      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg bot">
          <div class="msg-bubble">
            <p><strong>Namaste! 🙏 Welcome to Pearl Ply.</strong></p>
            <p>I am your official AI Timber & Plywood Consultant. Ask me about <strong>Pearl Ultima Plus (IS:710 BWP)</strong>, <strong>Pearl Ultima Ply (IS:303 BWR)</strong>, <strong>Pearl Platinum Doors</strong>, thicknesses, or pricing!</p>
            <div class="chat-chips">
              <div class="chat-chip" onclick="window.sendChatQuery('What is IS:710 Marine Plywood?')">IS:710 Marine 710</div>
              <div class="chat-chip" onclick="window.sendChatQuery('Plywood price estimate')">Price / Rates</div>
              <div class="chat-chip" onclick="window.sendChatQuery('Order Architect Sample Kit')">Request Sample Kit</div>
              <div class="chat-chip" onclick="window.sendChatQuery('Apply for Dealership')">Dealership Inquiry</div>
            </div>
            <div class="msg-time">Just now</div>
          </div>
        </div>
        <div class="typing-indicator" id="typingIndicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>

      <div class="chat-input-bar">
        <input type="text" class="chat-input-field" id="chatInput" placeholder="Ask about plywood grades, prices, sizes..." />
        <button class="chat-send-btn" id="chatSendBtn" aria-label="Send Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;
    document.body.appendChild(widget);

    // Event Bindings
    triggerBtn.addEventListener('click', () => {
      widget.classList.toggle('active');
      if (widget.classList.contains('active')) {
        document.getElementById('chatInput')?.focus();
      }
    });

    document.getElementById('chatCloseBtn')?.addEventListener('click', () => {
      widget.classList.remove('active');
    });

    // Top Lead Drawer Toggle Handlers
    const toggleLeadBtn = document.getElementById('toggleTopLeadBtn');
    const topLeadDrawer = document.getElementById('topLeadDrawer');
    const closeLeadDrawerBtn = document.getElementById('closeTopLeadDrawer');

    toggleLeadBtn?.addEventListener('click', () => {
      topLeadDrawer?.classList.toggle('active');
      if (topLeadDrawer?.classList.contains('active')) {
        document.getElementById('chatLeadName')?.focus();
      }
    });

    closeLeadDrawerBtn?.addEventListener('click', () => {
      topLeadDrawer?.classList.remove('active');
    });

    const sendBtn = document.getElementById('chatSendBtn');
    const inputField = document.getElementById('chatInput');

    function handleSend() {
      const text = inputField.value.trim();
      if (!text) return;
      window.sendChatQuery(text);
      inputField.value = '';
    }

    sendBtn?.addEventListener('click', handleSend);
    inputField?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // 4. Send Query and Bot Response Controller (Google Gemini LLM Powered)
  window.sendChatQuery = async function(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const typing = document.getElementById('typingIndicator');
    if (!messagesContainer) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `
      <div class="msg-bubble">
        <p>${escapeHTML(text)}</p>
        <div class="msg-time">${getCurrentTime()}</div>
      </div>
    `;
    messagesContainer.insertBefore(userMsg, typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show Typing Indicator
    if (typing) typing.classList.add('active');

    // Auto-detect phone numbers in user chat to auto-ingest into CRM
    const phoneMatch = text.match(/(\+91[\-\s]?)?[6789]\d{9}/);
    if (phoneMatch) {
      window.PearlCRM.saveLead({
        name: 'Chat Customer',
        phone: phoneMatch[0],
        city: 'Inquired in Chat',
        channel: 'AI Chatbot (Auto-detected)',
        product: 'General Plywood Inquiry',
        status: 'New',
        message: text
      });
    }

    try {
      // Query Google Gemini LLM API
      const replyHtml = await queryGeminiLLM(text);

      if (typing) typing.classList.remove('active');

      const isLeadIntent = text.toLowerCase().includes('price') || 
                           text.toLowerCase().includes('quote') || 
                           text.toLowerCase().includes('rate') || 
                           text.toLowerCase().includes('sample') || 
                           text.toLowerCase().includes('dealer') ||
                           text.toLowerCase().includes('sheet') ||
                           text.toLowerCase().includes('contact') ||
                           text.toLowerCase().includes('call');

      // If user asks about quote or pricing, automatically open the top drawer!
      if (isLeadIntent) {
        document.getElementById('topLeadDrawer')?.classList.add('active');
      }

      const chipsHtml = `
        <div class="chat-chips">
          <div class="chat-chip" onclick="window.sendChatQuery('What is IS:710 Marine Plywood?')">IS:710 Marine 710</div>
          <div class="chat-chip" onclick="window.sendChatQuery('Calculate Plywood Furniture Sheets')">Calculate Sheets</div>
          <div class="chat-chip" onclick="window.sendChatQuery('Order Architect Sample Kit')">Request Sample Kit</div>
          <div class="chat-chip" onclick="window.sendChatQuery('Apply for Pearl Ply Dealership')">Dealership Terms</div>
        </div>
      `;

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.innerHTML = `
        <div class="msg-bubble">
          <p>${replyHtml}</p>
          ${chipsHtml}
          <div class="msg-time">${getCurrentTime()}</div>
        </div>
      `;

      messagesContainer.insertBefore(botMsg, typing);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (e) {
      if (typing) typing.classList.remove('active');
      console.error('Chat processing error:', e);
    }
  };

  // Local knowledge fallback if API is unreachable
  function generateLocalFallback(userInput) {
    const q = userInput.toLowerCase();
    if (q.includes('ultima plus') || (q.includes('ultima') && q.includes('plus'))) {
      return "<strong>Pearl Ultima Plus (IS:710 BWP Marine Plywood)</strong> is our super-premium flagship grade:<br><br>• <strong>Core:</strong> 100% Gurjan Inside with Extra Layer Technology.<br>• <strong>Standard:</strong> Certified IS:710 (BWP) • CM/L 9504492.<br>• <strong>Endurance:</strong> 72-Hour Boiling Water Proof (Zero Delamination).<br>• <strong>Features:</strong> Perfectly Quad-Calibrated (±0.1mm), Termite & Borer Proof, Low VOC.<br>• <strong>Warranty:</strong> 15-Year Replacement Guarantee.<br>• <strong>Best For:</strong> Modular kitchens, bathroom vanities, under-sink units, and wet areas.";
    }
    if (q.includes('ultima ply') || q.includes('ultima')) {
      return "<strong>Pearl Ultima Ply (IS:303 BWR Grade)</strong> is engineered for high performance interior woodworking:<br><br>• <strong>Face & Core:</strong> Calibrated Gurjan Face with High Density Extra Layer Core.<br>• <strong>Standard:</strong> Certified IS:303 (BWR) • CM/L 9760279217.<br>• <strong>Manufacturing:</strong> Hot Pressed under hydraulic temperature & pressure.<br>• <strong>Features:</strong> 8-Hr Boiling Water Resistant, Termite Proof, Low VOC indoor safe.<br>• <strong>Warranty:</strong> 10-Year Guarantee.<br>• <strong>Best For:</strong> Kitchen upper cabinets, wardrobes, TV units, and dining furniture.";
    }
    if (q.includes('marine') || q.includes('710') || q.includes('water')) {
      return "<strong>Pearl Ultima Plus & Marine 710 (IS:710 BWP)</strong> are crafted with 100% Gurjan core and unextended Phenol Formaldehyde resin.<br><br>• <strong>Endurance:</strong> 72 continuous hours boiling water tested.<br>• <strong>Warranty:</strong> 15 to 25-Year Guarantee.<br>• <strong>Ideal For:</strong> Modular kitchens, bathroom vanity counters, and coastal residences.";
    }
    if (q.includes('price') || q.includes('rate') || q.includes('cost')) {
      return "<strong>Pearl Ply Indicative Rates:</strong><br><br>• <strong>Pearl Ultima Plus IS:710 (18mm):</strong> Approx. ₹135 - ₹165 / sq.ft.<br>• <strong>Pearl Ultima Ply IS:303 (18mm):</strong> Approx. ₹95 - ₹120 / sq.ft.<br>• <strong>Pearl Black Decor MR (18mm):</strong> Approx. ₹70 - ₹88 / sq.ft.<br>• <strong>SolidCore Blockboard (19mm):</strong> Approx. ₹110 - ₹140 / sq.ft.";
    }
    if (q.includes('dealer') || q.includes('distributor')) {
      return "<strong>Pearl Ply Dealership Partnership:</strong><br><br>We offer territory-exclusive dealerships across India.<br>• <strong>Authorized Dealer:</strong> ₹10L - ₹25L investment tier.<br>• <strong>Distributor:</strong> ₹25L - ₹50L+ tier with full sampling and plant dispatch support.";
    }
    return "Thank you for reaching out! <strong>Pearl Ply</strong> manufactures certified <strong>Pearl Ultima Plus (IS:710 BWP)</strong>, <strong>Pearl Ultima Ply (IS:303 BWR)</strong>, and <strong>Pearl Platinum Flush Doors</strong> with up to 15-Year warranty.<br><br>I can assist with grade specifications, pricing, sheet estimates, architect sample kits, and dealership opportunities.";
  }

  // 6. Submit Lead directly from Chat to Admin CRM
  window.submitChatLead = function(origQuery) {
    const nameEl = document.getElementById('chatLeadName');
    const phoneEl = document.getElementById('chatLeadPhone');
    const cityEl = document.getElementById('chatLeadCity');
    const productEl = document.getElementById('chatLeadProduct');

    const name = nameEl?.value.trim();
    const phone = phoneEl?.value.trim();
    const city = cityEl?.value.trim() || 'Direct Inquiry';
    const product = productEl?.value || 'Pearl Marine BWP 710';

    if (!name || !phone) {
      alert('Please provide your Name and Phone number.');
      return;
    }

    const savedLead = window.PearlCRM.saveLead({
      name: name,
      phone: phone,
      city: city,
      product: product,
      channel: 'AI Chatbot',
      status: 'New',
      message: `Captured via Chatbot prompt: "${origQuery}"`
    });

    // Close the top drawer smoothly
    document.getElementById('topLeadDrawer')?.classList.remove('active');

    // Trigger Instant WhatsApp (9993613434) & Email Notification Engine
    if (window.dispatchLeadNotification) {
      window.dispatchLeadNotification(savedLead);
    }

    const messagesContainer = document.getElementById('chatMessages');
    const confirmMsg = document.createElement('div');
    confirmMsg.className = 'chat-msg bot';
    confirmMsg.innerHTML = `
      <div class="msg-bubble" style="border-left: 3px solid #48BB78;">
        <p><strong>✅ Lead Synced & Notification Alert Sent!</strong></p>
        <p>Thank you <strong>${escapeHTML(name)}</strong>. Your inquiry has been registered in the <strong>Pearl Ply Admin CRM</strong> (Ref ID: <code>${savedLead.id}</code>). Regional sales team will connect at <strong>${escapeHTML(phone)}</strong>.</p>
        <div style="margin-top: 8px;">
          <a href="https://wa.me/919993613434?text=${encodeURIComponent('Namaste Pearl Ply, I just inquired via AI Chatbot: ' + name + ' (' + phone + '), looking for ' + product)}" target="_blank" class="btn btn-sm btn-primary" style="font-size: 0.72rem; padding: 5px 10px; display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
            📲 Open Direct WhatsApp Chat (+91 99936 13434)
          </a>
        </div>
        <div class="msg-time">${getCurrentTime()}</div>
      </div>
    `;
    messagesContainer.appendChild(confirmMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Reset Form Card
    if (nameEl) nameEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (cityEl) cityEl.value = '';
  };

  // Helper Utilities
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotDOM);
  } else {
    initChatbotDOM();
  }
})();
