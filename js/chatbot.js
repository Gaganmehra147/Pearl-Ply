/* ==========================================================================
   PEARL PLY - INTELLIGENT AI TIMBER CONSULTANT & CRM ENGINE
   ========================================================================== */

(function() {
  'use strict';

  const STORAGE_KEY = 'pearl_crm_leads_v2';

  // 1. Shared CRM Data Storage Utility
  window.PearlCRM = window.PearlCRM || {
    STORAGE_KEY: STORAGE_KEY,
    
    getLeads: function() {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) return JSON.parse(data);
      } catch (e) {
        console.error('Error reading CRM leads:', e);
      }
      return [];
    },

    saveLead: function(leadData) {
      const leads = this.getLeads();
      const newLead = {
        id: 'PL-' + Math.floor(100000 + Math.random() * 900000),
        name: leadData.name || 'Anonymous Customer',
        phone: leadData.phone || 'N/A',
        email: leadData.email || 'N/A',
        city: leadData.city || 'Direct Inquiry',
        channel: leadData.channel || 'AI Chatbot',
        product: leadData.product || 'Pearl Ultima Plus',
        quantity: leadData.quantity || 'Inquiry Submitted',
        status: leadData.status || 'New',
        message: leadData.message || 'Captured via Pearl AI Chatbot.',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };
      
      leads.unshift(newLead);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leads));
      
      // Dispatch custom event for real-time CRM updates
      window.dispatchEvent(new CustomEvent('pearl_lead_added', { detail: newLead }));
      
      if (typeof window.showToast === 'function') {
        window.showToast(`Lead Synced to Admin CRM: ${newLead.name} (${newLead.channel})`);
      }
      return newLead;
    }
  };

  // 2. Google Gemini API Configuration
  const GEMINI_CONFIG = {
    API_KEY: window.PEARL_GEMINI_API_KEY || '',
    PRIMARY_MODEL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    FALLBACK_MODEL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    SYSTEM_INSTRUCTION: `You are "Pearl AI", the senior official AI Timber & Plywood Technical Consultant for "Pearl Ply" (India's premier manufacturer of IS:710 Marine Plywood, BWR Grade, Flush Doors, and MR Grade). Answer questions about Pearl Ply products, plywood grades, wood specifications, furniture applications, prices, testing standards, factory manufacturing, architect sample kits, and dealership opportunities in Hindi/English.`
  };

  let conversationHistory = [];

  // 3. AI Query Processor (Hybrid: Gemini LLM if Key Available -> Instant Neural Knowledge Engine Fallback)
  async function queryAIResponse(userPrompt) {
    // If a valid Gemini API key is configured, try querying Google Gemini
    if (GEMINI_CONFIG.API_KEY && GEMINI_CONFIG.API_KEY.startsWith('AIzaSy')) {
      try {
        conversationHistory.push({
          role: "user",
          parts: [{ text: userPrompt }]
        });

        if (conversationHistory.length > 8) {
          conversationHistory = conversationHistory.slice(-8);
        }

        const requestBody = {
          system_instruction: { parts: [{ text: GEMINI_CONFIG.SYSTEM_INSTRUCTION }] },
          contents: conversationHistory,
          generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        let response = await fetch(`${GEMINI_CONFIG.PRIMARY_MODEL}?key=${GEMINI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

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
            conversationHistory.push({ role: "model", parts: [{ text: botReply }] });
            return formatMarkdownToHTML(botReply);
          }
        }
      } catch (err) {
        console.info('Gemini Live API fallback triggered:', err.message);
      }
    }

    // Instant High-Precision Pearl AI Knowledge Engine
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateSmartResponse(userPrompt));
      }, 350);
    });
  }

  // 4. Comprehensive Pearl AI Knowledge & Intent NLP Engine
  function generateSmartResponse(userInput) {
    const raw = userInput.toLowerCase().trim();
    const q = raw.replace(/[^\w\s\u0900-\u097F]/gi, ' ');

    // 1. Greetings (Hindi, English, Hinglish)
    if (/^(hi|hello|hey|namaste|namaskar|pranam|ram ram|good morning|good evening|good afternoon|kaise ho|kya hal hai)/i.test(raw)) {
      return `<strong>Namaste! 🙏 Welcome to Pearl Ply.</strong><br><br>I am <strong>Pearl AI</strong>, your personal Plywood & Timber Technical Consultant.<br><br>I can assist you with:<br>
• <strong>Product Specs:</strong> IS:710 Marine, IS:303 BWR, Flush Doors & MR Grade<br>
• <strong>Pricing & Estimates:</strong> Current factory rates & sheet calculations<br>
• <strong>Room Recommendations:</strong> Modular Kitchens, Wardrobes, Doors & Louvers<br>
• <strong>B2B Partnerships:</strong> Dealership terms & Free Architect Sample Kits<br><br>
What type of furniture or project are you planning?`;
    }

    // 2. Pearl Ultima Plus (IS:710 Marine Plywood)
    if (q.includes('ultima plus') || q.includes('marine') || q.includes('710') || q.includes('bwp') || (q.includes('water') && q.includes('proof')) || q.includes('waterproof') || q.includes('boiling')) {
      return `<strong>🌊 Pearl Ultima Plus (IS:710 BWP Marine Grade Plywood)</strong><br><br>
Our flagship super-premium marine grade plywood engineered for maximum water immersion and structural longevity:<br><br>
• <strong>Core Timber:</strong> 100% Selected Gurjan Hardwood Core (Extra Layer Construction)<br>
• <strong>Resin Bonding:</strong> 100% Unextended Phenol Formaldehyde (PF) Synthetic Resin<br>
• <strong>Water Resistance:</strong> <strong>72-Hour Boiling Water Proof (BWP)</strong> with zero delamination<br>
• <strong>Calibration:</strong> 4-Head Diamond Sanded for ±0.1mm micro-uniform thickness<br>
• <strong>Protection:</strong> Autoclave Vacuum Pressure Treated (Termite, Borer & Fungus Proof)<br>
• <strong>Warranty:</strong> <strong>15-Year Replacement Guarantee</strong><br>
• <strong>Best Applications:</strong> Modular kitchen sink units, bathroom vanities, coastal structures, and wet zones.<br><br>
Would you like a direct price quote or thickness specifications?`;
    }

    // 3. Pearl Ultima Ply (IS:303 BWR Grade)
    if (q.includes('ultima ply') || q.includes('bwr') || (q.includes('303') && !q.includes('mr')) || q.includes('moisture guard')) {
      return `<strong>🛡️ Pearl Ultima Ply (IS:303 BWR Grade Plywood)</strong><br><br>
Engineered specifically for heavy-duty interior woodwork and moisture-prone areas:<br><br>
• <strong>Face Veneer:</strong> Calibrated Gurjan Face with High-Density Core<br>
• <strong>Resin:</strong> Fortified Melamine Urea Formaldehyde (MUF) synthetic resin<br>
• <strong>Water Endurance:</strong> <strong>8-Hour Boiling Water Resistance (BWR)</strong><br>
• <strong>Strength:</strong> High bending strength (MOR > 48 N/mm²) & zero core gaps<br>
• <strong>Warranty:</strong> <strong>10-Year Guarantee</strong><br>
• <strong>Best Applications:</strong> Bedroom wardrobes, tall cupboards, dining tables, study units, and semi-wet areas.`;
    }

    // 4. Pearl Platinum (Flush Doors)
    if (q.includes('door') || q.includes('platinum') || q.includes('flush') || q.includes('2202') || q.includes('darwaza')) {
      return `<strong>🚪 Pearl Platinum (IS:2202 BWP Premium Flush Doors)</strong><br><br>
Solid core wooden doors designed for lifetime structural rigidity and elegant acoustics:<br><br>
• <strong>Core Framing:</strong> 100% Seasoned Pinewood Batten Core with Gurjan Cross-Bands<br>
• <strong>Bonding:</strong> Phenol Formaldehyde BWP Synthetic Resin<br>
• <strong>Features:</strong> 100% Swell-Proof, Warp-Free, Lock-Rail Embedded, Termite Immune<br>
• <strong>Warranty:</strong> <strong>10-Year Guarantee</strong><br>
• <strong>Standard Sizes:</strong> 8x4 ft, 7x3.25 ft, 6.5x3 ft | <strong>Thickness:</strong> 30mm, 32mm, 35mm, 38mm<br>
• <strong>Ideal For:</strong> Luxury main entrance doors, bedroom doors, and high-traffic hotel rooms.`;
    }

    // 5. Pearl Black Decor (MR Grade Commercial)
    if (q.includes('black decor') || q.includes('mr') || q.includes('commercial') || q.includes('interior') || q.includes('tv unit') || q.includes('paneling') || q.includes('ceiling') || q.includes('louver')) {
      return `<strong>✨ Pearl Black Decor (IS:303 Moisture Resistant MR Grade)</strong><br><br>
India's preferred commercial plywood for aesthetic dry interior living spaces:<br><br>
• <strong>Face & Core:</strong> 100% Gurjan Face Veneer with full core full panel balance<br>
• <strong>Features:</strong> Superior screw-holding retention (>2600 N), E0 Low Formaldehyde emission<br>
• <strong>Certification:</strong> IS:303 Type AA ISI Marked • GLP Certified<br>
• <strong>Warranty:</strong> <strong>5-Year Guarantee</strong><br>
• <strong>Best Applications:</strong> TV wall paneling, acoustic fluted louvers, false ceilings, bedroom beds, and living room consoles.`;
    }

    // 6. Pricing, Cost, Rates & Estimates
    if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('quot') || q.includes('kitna') || q.includes('kitne') || q.includes('kya rate') || q.includes('bhav') || q.includes('discount')) {
      return `<strong>💰 Pearl Ply Indicative Factory Price List (2026):</strong><br><br>
• <strong>Pearl Ultima Plus (IS:710 BWP Marine):</strong> Approx. <strong>₹135 – ₹165 / sq.ft</strong> (18mm/19mm)<br>
• <strong>Pearl Ultima Ply (IS:303 BWR Grade):</strong> Approx. <strong>₹95 – ₹120 / sq.ft</strong> (18mm/19mm)<br>
• <strong>Pearl Platinum Flush Doors (IS:2202):</strong> Approx. <strong>₹180 – ₹240 / sq.ft</strong> (30mm/35mm)<br>
• <strong>Pearl Black Decor (IS:303 MR Grade):</strong> Approx. <strong>₹70 – ₹88 / sq.ft</strong> (18mm/19mm)<br><br>
<em>*Standard 8x4 ft sheet = 32 sq.ft. Bulk project discounts available for 50+ sheets.</em><br><br>
👉 Click <strong>"Get Quote"</strong> at the top of this chat or share your <strong>Name & Phone Number</strong> to get exact wholesale rates on WhatsApp!`;
    }

    // 7. Kitchen & Sink Recommendations
    if (q.includes('kitchen') || q.includes('rasoi') || q.includes('sink') || q.includes('counter')) {
      return `<strong>🍳 Modular Kitchen Plywood Recommendation:</strong><br><br>
• <strong>Under Sink & Wet Base Cabinets:</strong> Use <strong>Pearl Ultima Plus (IS:710 Marine 710)</strong> — 100% Phenol Formaldehyde resin protects against daily water leaks and boiling oil spills.<br>
• <strong>Upper Storage & Loft Cabinets:</strong> Use <strong>Pearl Ultima Ply (IS:303 BWR)</strong> for rigid, non-bending lightweight carcasses.<br>
• <strong>Recommended Thickness:</strong> 18mm for Carcass/Boxes, 19mm for Shutters, 6mm/8mm for Back Panels.`;
    }

    // 8. Wardrobe & Bedroom Recommendations
    if (q.includes('wardrobe') || q.includes('almirah') || q.includes('closet') || q.includes('bed') || q.includes('bedroom')) {
      return `<strong>🛏️ Wardrobes & Bedroom Furniture Recommendation:</strong><br><br>
• <strong>Tall Wardrobe Shutters (7ft / 8ft):</strong> Use <strong>Pearl Ultima Ply (IS:303 BWR)</strong> or <strong>SolidCore Blockboard</strong> — Guaranteed zero warping/bending over tall heights.<br>
• <strong>Hydraulic Storage Beds:</strong> Use <strong>Pearl Ultima Ply (19mm)</strong> for superior load-bearing capacity.<br>
• <strong>TV Unit & Wall Paneling:</strong> Use <strong>Pearl Black Decor (IS:303 MR)</strong> with high screw-holding retention.`;
    }

    // 9. Sizes, Thicknesses & Dimensions
    if (q.includes('size') || q.includes('thickness') || q.includes('dimension') || q.includes('mm') || q.includes('8x4') || q.includes('7x4')) {
      return `<strong>📐 Available Thicknesses & Sheet Dimensions:</strong><br><br>
• <strong>Standard Sheet Sizes:</strong> 8x4 ft (2440 x 1220 mm), 7x4 ft (2140 x 1220 mm), 8x3 ft, 7x3 ft, 6x4 ft, 6x3 ft<br>
• <strong>Plywood Thicknesses:</strong> 4mm, 6mm, 8mm, 9mm, 12mm, 16mm, 18mm, 19mm, 25mm<br>
• <strong>Flush Door Thicknesses:</strong> 25mm, 30mm, 32mm, 35mm, 38mm<br>
• <strong>Calibration:</strong> 4-Head Diamond Sanded micro-tolerance of ±0.1mm across every sheet.`;
    }

    // 10. Dealership & Distributor Inquiry
    if (q.includes('dealer') || q.includes('distributor') || q.includes('franchise') || q.includes('agency') || q.includes('business') || q.includes('dukan') || q.includes('shop') || q.includes('margin')) {
      return `<strong>🤝 Pearl Ply Authorized Dealership & Distributor Program:</strong><br><br>
Join Central India's fastest-growing premium timber brand with direct factory supply & marketing support:<br><br>
• <strong>Tier 1: Authorized Dealer:</strong> ₹10 Lakhs – ₹25 Lakhs initial inventory allocation.<br>
• <strong>Tier 2: District Distributor:</strong> ₹25 Lakhs – ₹50 Lakhs+ territory exclusive rights.<br>
• <strong>Benefits:</strong> Guaranteed profit margins, free architect sample displays, branding boards, priority 24-hr dispatch, and dedicated CRM leads.<br><br>
Share your <strong>Name, Phone Number, and City/District</strong> to receive the official Dealership Prospectus.`;
    }

    // 11. Architect Sample Kit
    if (q.includes('sample') || q.includes('architect') || q.includes('designer') || q.includes('kit') || q.includes('swatch') || q.includes('box')) {
      return `<strong>📦 Pearl Ply Luxury Architect Presentation Kit:</strong><br><br>
Complimentary presentation sample box delivered directly to verified Architects, Interior Designers, and Builders:<br><br>
• <strong>Contents:</strong> Real physical wood swatches of Pearl Ultima Plus (IS:710), BWR Grade, Flush Door cross-section, and MR Grade.<br>
• <strong>Documentation:</strong> BIS CM/L certificates, Technical Data Sheets (TDS), and 4K CAD interior assets.<br><br>
Please share your <strong>Firm Name, Contact Person, Phone, and Postal Address</strong> to dispatch your kit.`;
    }

    // 12. Location, Factory & Delivery (Jabalpur, MP, Pan-India)
    if (q.includes('jabalpur') || q.includes('madhya pradesh') || q.includes('mp') || q.includes('indore') || q.includes('bhopal') || q.includes('factory') || q.includes('plant') || q.includes('address') || q.includes('location') || q.includes('kaha')) {
      return `<strong>🏭 Pearl Ply Manufacturing Plant & Distribution Network:</strong><br><br>
• <strong>Central Plant Hub:</strong> Jabalpur, Madhya Pradesh, India.<br>
• <strong>Direct Dispatch Corridors:</strong> Same-day dispatch across Jabalpur, Katni, Satna, Rewa; 24-Hour delivery to Indore, Bhopal, Gwalior, Ujjain; Pan-India express freight.<br>
• <strong>Contact Hotline:</strong> +91 99936 13434<br>
• <strong>Email:</strong> info@pearlply.in`;
    }

    // 13. Contact, Phone, WhatsApp, Support
    if (q.includes('contact') || q.includes('phone') || q.includes('mobile') || q.includes('whatsapp') || q.includes('number') || q.includes('call') || q.includes('email') || q.includes('support')) {
      return `<strong>📞 Pearl Ply Customer Support & Technical Desk:</strong><br><br>
• <strong>Phone / WhatsApp:</strong> <a href="https://wa.me/919993613434" target="_blank" style="color: #48BB78; font-weight: 800; text-decoration: underline;">+91 99936 13434</a><br>
• <strong>Official Email:</strong> <a href="mailto:info@pearlply.in" style="color: var(--chat-gold); text-decoration: underline;">info@pearlply.in</a><br>
• <strong>Business Hours:</strong> Monday – Saturday: 9:00 AM to 8:00 PM<br><br>
<a href="https://wa.me/919993613434?text=Hi%20Pearl%20Ply,%20I%20am%20chatting%20with%20Pearl%20AI%20and%20want%20to%20connect." target="_blank" class="btn btn-sm btn-primary" style="font-size: 0.78rem; padding: 6px 12px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; margin-top: 6px;">
  📲 Click to WhatsApp Directly (+91 99936 13434)
</a>`;
    }

    // 14. Quality, Testing & Certifications
    if (q.includes('test') || q.includes('quality') || q.includes('certificate') || q.includes('isi') || q.includes('bis') || q.includes('termite') || q.includes('warranty') || q.includes('guarantee')) {
      return `<strong>🔬 7-Point Laboratory Quality & ISI Standards:</strong><br><br>
• <strong>72-Hr Boiling Water Test:</strong> Zero ply separation under continuous boiling immersion.<br>
• <strong>Adhesion & Tensile Strength:</strong> Modulus of Rupture (MOR) exceeds 55 N/mm².<br>
• <strong>Quad-Calibration:</strong> ±0.1mm micro-even thickness for seamless CNC routing.<br>
• <strong>Termite & Borer Shield:</strong> Vacuum pressure chemical impregnation.<br>
• <strong>Formaldehyde Safety:</strong> E0 emission certified safe for children's bedrooms.<br>
• <strong>BIS Licenses:</strong> IS:710 (CM/L 9504492), IS:303 (CM/L 9760279217), IS:2202.`;
    }

    // Default Fallback
    return `Thank you for your question! <strong>Pearl Ply</strong> is India's premier manufacturer of certified <strong>Pearl Ultima Plus (IS:710 BWP)</strong>, <strong>Pearl Ultima Ply (IS:303 BWR)</strong>, and <strong>Pearl Platinum Flush Doors</strong>.<br><br>
I can help you with:<br>
• <strong>1. Specific Grade Specs</strong> (Ultima Plus, Ultima Ply, Platinum, Black Decor)<br>
• <strong>2. Room Recommendations</strong> (Kitchens, Wardrobes, Doors, Ceilings)<br>
• <strong>3. Sheet Estimates & Pricing</strong><br>
• <strong>4. Dealership Terms & Free Architect Sample Kits</strong><br><br>
What is your specific question or project requirement?`;
  }

  function formatMarkdownToHTML(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•\s/g, '• ')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // 5. Render Floating Chatbot Markup on Customer Pages Only
  function initChatbotDOM() {
    if (document.querySelector('.admin-navbar') || window.location.pathname.includes('admin.html')) {
      return;
    }
    if (document.getElementById('pearlAiWidget')) return;

    // Trigger Button
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

    // Chatbot Widget Window
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

      <!-- Top Collapsible Lead Capture Drawer -->
      <div class="top-lead-drawer" id="topLeadDrawer">
        <div class="top-lead-header">
          <h5>⚡ Connect with Technical Specialist</h5>
          <button class="top-lead-close" id="closeTopLeadDrawer">&times; Close</button>
        </div>
        <div class="top-lead-grid">
          <input type="text" id="chatLeadName" placeholder="Full Name *" required />
          <input type="tel" id="chatLeadPhone" placeholder="Phone / WhatsApp *" required />
          <input type="text" id="chatLeadCity" placeholder="City / State *" />
          <select id="chatLeadProduct">
            <option value="Pearl Ultima Plus (IS:710 BWP)">Pearl Ultima Plus (IS:710 BWP Marine)</option>
            <option value="Pearl Ultima Ply (IS:303 BWR)">Pearl Ultima Ply (IS:303 BWR Grade)</option>
            <option value="Pearl Platinum (IS:2202 Flush Door)">Pearl Platinum (IS:2202 Flush Door)</option>
            <option value="Pearl Black Decor (IS:303 MR)">Pearl Black Decor (IS:303 MR Grade)</option>
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
              <div class="chat-chip" onclick="window.sendChatQuery('Which plywood is best for kitchen?')">Kitchen Recommendation</div>
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

  // 6. Send Query and Bot Response Controller
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
        channel: 'AI Chatbot',
        product: 'General Plywood Inquiry',
        status: 'New',
        message: text
      });
    }

    try {
      const replyHtml = await queryAIResponse(text);

      if (typing) typing.classList.remove('active');

      const isLeadIntent = text.toLowerCase().includes('price') || 
                           text.toLowerCase().includes('quote') || 
                           text.toLowerCase().includes('rate') || 
                           text.toLowerCase().includes('sample') || 
                           text.toLowerCase().includes('dealer') ||
                           text.toLowerCase().includes('sheet');

      if (isLeadIntent) {
        document.getElementById('topLeadDrawer')?.classList.add('active');
      }

      const chipsHtml = `
        <div class="chat-chips">
          <div class="chat-chip" onclick="window.sendChatQuery('What is IS:710 Marine Plywood?')">IS:710 Marine</div>
          <div class="chat-chip" onclick="window.sendChatQuery('Which plywood is best for kitchen?')">Kitchen Specs</div>
          <div class="chat-chip" onclick="window.sendChatQuery('Order Architect Sample Kit')">Sample Kit</div>
          <div class="chat-chip" onclick="window.sendChatQuery('Apply for Dealership')">Dealership Terms</div>
        </div>
      `;

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.innerHTML = `
        <div class="msg-bubble">
          <div>${replyHtml}</div>
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

  // 7. Submit Lead directly from Chat to Admin CRM
  window.submitChatLead = function(origQuery) {
    const nameEl = document.getElementById('chatLeadName');
    const phoneEl = document.getElementById('chatLeadPhone');
    const cityEl = document.getElementById('chatLeadCity');
    const productEl = document.getElementById('chatLeadProduct');

    const name = nameEl?.value.trim();
    const phone = phoneEl?.value.trim();
    const city = cityEl?.value.trim() || 'Direct Inquiry';
    const product = productEl?.value || 'Pearl Ultima Plus';

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
      message: `Inquiry submitted via Chat Drawer (${origQuery || 'Direct'})`
    });

    document.getElementById('topLeadDrawer')?.classList.remove('active');

    if (window.dispatchLeadNotification) {
      window.dispatchLeadNotification(savedLead);
    }

    const messagesContainer = document.getElementById('chatMessages');
    const confirmMsg = document.createElement('div');
    confirmMsg.className = 'chat-msg bot';
    confirmMsg.innerHTML = `
      <div class="msg-bubble" style="border-left: 3px solid #48BB78;">
        <p><strong>✅ Inquiry Registered & Synced!</strong></p>
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

    if (nameEl) nameEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (cityEl) cityEl.value = '';
  };

  // Helper Utilities
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // Global mobile trigger function
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotDOM);
  } else {
    initChatbotDOM();
  }
})();
