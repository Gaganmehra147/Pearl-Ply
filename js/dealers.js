/* ==========================================================================
   PEARL PLY - DEALER LOCATOR & REGIONAL NETWORK
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const DEALER_DATA = [
    {
      name: "Pearl Timber & Ply Gallery",
      city: "Delhi NCR",
      state: "Delhi",
      address: "Plot 42, Timber Market, Kirti Nagar, New Delhi - 110015",
      phone: "+91 98112 34567",
      rating: "4.9 ★ (120+ reviews)",
      type: "Authorized Exclusive Experience Centre"
    },
    {
      name: "Shree Ganesh Woodworks & Plywood",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Shop 18, Lakdawala Compound, SV Road, Andheri West, Mumbai - 400058",
      phone: "+91 98201 98765",
      rating: "4.8 ★ (95 reviews)",
      type: "Authorized Stockist"
    },
    {
      name: "Royal Ply & Laminate Hub",
      city: "Bengaluru",
      state: "Karnataka",
      address: "No. 74, Outer Ring Road, Banaswadi, Bengaluru - 560043",
      phone: "+91 98450 11223",
      rating: "4.9 ★ (150+ reviews)",
      type: "Exclusive Experience Centre"
    },
    {
      name: "Gujarat Timber & Hardware Mart",
      city: "Ahmedabad",
      state: "Gujarat",
      address: "Near Timber Market, Sarangpur Bridge, Ahmedabad - 380002",
      phone: "+91 98250 33445",
      rating: "4.8 ★ (80 reviews)",
      type: "Authorized Wholesale Distributor"
    },
    {
      name: "Kolkata Marine Wood Corporation",
      city: "Kolkata",
      state: "West Bengal",
      address: "12/A, Chetla Central Road, Alipore, Kolkata - 700027",
      phone: "+91 98300 55667",
      rating: "4.9 ★ (110+ reviews)",
      type: "Authorized BWP 710 Stockist"
    },
    {
      name: "Jaipur Ply World & Interiors",
      city: "Jaipur",
      state: "Rajasthan",
      address: "Sector 5, Mansarovar Industrial Area, Jaipur - 302020",
      phone: "+91 98290 77889",
      rating: "4.7 ★ (65 reviews)",
      type: "Authorized Dealer"
    },
    {
      name: "Deccan Woodcraft & Boards",
      city: "Hyderabad",
      state: "Telangana",
      address: "H.No. 4-1-89, Ranigunj, Secunderabad, Hyderabad - 500003",
      phone: "+91 98490 22334",
      rating: "4.9 ★ (140+ reviews)",
      type: "Exclusive Experience Centre"
    },
    {
      name: "Awadh Plywood & Veneer Agency",
      city: "Lucknow",
      state: "Uttar Pradesh",
      address: "Transport Nagar, Phase 2, Kanpur Road, Lucknow - 226012",
      phone: "+91 98390 44556",
      rating: "4.8 ★ (75 reviews)",
      type: "Authorized Dealer"
    },
    {
      name: "Punjab Timber & Board House",
      city: "Chandigarh",
      state: "Punjab",
      address: "Plot 88, Industrial Area Phase 2, Chandigarh - 160002",
      phone: "+91 98140 66778",
      rating: "4.8 ★ (90 reviews)",
      type: "Authorized Distributor"
    }
  ];

  const cityFilter = document.getElementById('dealerCityFilter');
  const searchInput = document.getElementById('dealerSearchInput');
  const dealersList = document.getElementById('dealersList');
  const dealerCount = document.getElementById('dealerCount');

  function renderDealers(dealers) {
    if (!dealersList) return;
    dealersList.innerHTML = '';

    if (dealers.length === 0) {
      dealersList.innerHTML = `
        <div style="padding: 30px; text-align: center; color: #596B63;">
          <i class="lucide-map-pin-off" style="font-size: 2rem; color: #D4A359; margin-bottom: 8px;"></i>
          <p>No dealers found in this location. Don't worry! We deliver directly to your job site.</p>
          <button class="btn btn-primary btn-sm" style="margin-top: 12px;" onclick="openModal('modalQuote')">Request Factory Direct Delivery</button>
        </div>
      `;
      if (dealerCount) dealerCount.textContent = '0 Dealers';
      return;
    }

    if (dealerCount) dealerCount.textContent = `${dealers.length} Verified Locations`;

    dealers.forEach(d => {
      const card = document.createElement('div');
      card.className = 'dealer-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="badge-gold" style="font-size: 0.68rem;">${d.type}</span>
            <span style="font-size: 0.78rem; color: #B8860B; font-weight: 700;">${d.rating}</span>
          </div>
          <h4 class="dealer-name">${d.name}</h4>
          <p class="dealer-loc"><i class="lucide-map-pin" style="font-size: 0.85rem; color: #D4A359;"></i> ${d.address}</p>
          <p style="font-size: 0.82rem; color: #0A1F18; font-weight: 600; margin-top: 4px;">
            <i class="lucide-phone" style="font-size: 0.8rem; color: #D4A359;"></i> ${d.phone}
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;">
          <a href="tel:${d.phone.replace(/\s+/g, '')}" class="btn btn-primary btn-sm">
            <i class="lucide-phone-call"></i> Call
          </a>
          <a href="https://maps.google.com/?q=${encodeURIComponent(d.name + ' ' + d.address)}" target="_blank" class="btn btn-outline-gold btn-sm" style="font-size: 0.75rem; padding: 6px 12px;">
            <i class="lucide-navigation"></i> Map
          </a>
        </div>
      `;
      dealersList.appendChild(card);
    });
  }

  function filterDealers() {
    const city = cityFilter ? cityFilter.value.toLowerCase() : '';
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = DEALER_DATA.filter(d => {
      const matchCity = !city || d.city.toLowerCase().includes(city) || d.state.toLowerCase().includes(city);
      const matchQuery = !query || 
        d.name.toLowerCase().includes(query) || 
        d.address.toLowerCase().includes(query) || 
        d.city.toLowerCase().includes(query);
      return matchCity && matchQuery;
    });

    renderDealers(filtered);
  }

  if (cityFilter) cityFilter.addEventListener('change', filterDealers);
  if (searchInput) searchInput.addEventListener('input', filterDealers);

  // Initial render
  renderDealers(DEALER_DATA);
});
