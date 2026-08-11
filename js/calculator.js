/* ==========================================================================
   PEARL PLY - INTERACTIVE FURNITURE SHEET & COST CALCULATOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const furnitureType = document.getElementById('calcFurnitureType');
  const dimLength = document.getElementById('calcLength');
  const dimHeight = document.getElementById('calcHeight');
  const dimDepth = document.getElementById('calcDepth');
  const plyGrade = document.getElementById('calcGrade');
  const sheetResult = document.getElementById('calcSheetCount');
  const breakdown18mm = document.getElementById('breakdown18mm');
  const breakdown12mm = document.getElementById('breakdown12mm');
  const breakdown6mm = document.getElementById('breakdown6mm');
  const estimatedCost = document.getElementById('estimatedCost');
  const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');

  const FURNITURE_PRESETS = {
    kitchen: { l: 12, h: 7, d: 2, defaultGrade: 'bwp', multiplier: 0.16 },
    wardrobe: { l: 8, h: 7, d: 2, defaultGrade: 'bwr', multiplier: 0.14 },
    bed: { l: 6.5, h: 3.5, d: 6, defaultGrade: 'bwr', multiplier: 0.12 },
    tv_unit: { l: 9, h: 6, d: 1.5, defaultGrade: 'mr', multiplier: 0.10 },
    bathroom: { l: 4, h: 3, d: 2, defaultGrade: 'marine', multiplier: 0.20 },
    custom: { l: 10, h: 6, d: 2, defaultGrade: 'bwp', multiplier: 0.13 }
  };

  const GRADE_PRICING = {
    mr: { name: 'Pearl Commercial MR (IS:303)', avgSqFt: 65 },
    bwr: { name: 'Pearl BWR Moisture Guard', avgSqFt: 88 },
    bwp: { name: 'Pearl Marine BWP (IS:710)', avgSqFt: 115 },
    marine: { name: 'Pearl 100% Calibrated Marine 710', avgSqFt: 145 },
    blockboard: { name: 'Pearl SolidCore Blockboard', avgSqFt: 98 }
  };

  function updateCalculator() {
    if (!furnitureType || !dimLength || !dimHeight || !dimDepth) return;

    const type = furnitureType.value;
    const l = parseFloat(dimLength.value) || 0;
    const h = parseFloat(dimHeight.value) || 0;
    const d = parseFloat(dimDepth.value) || 0;
    const selectedGrade = plyGrade.value;

    // Approximate total sheet surface area in sqft (8x4 sheet = 32 sqft)
    let totalSurfaceArea = 0;

    if (type === 'kitchen') {
      totalSurfaceArea = (l * 2.5 * 3.5) + (l * 2.5 * 2.5) + (l * d * 3); // Base + overhead + internal
    } else if (type === 'wardrobe') {
      totalSurfaceArea = (l * h * 2.2) + (l * d * 4) + (h * d * 3); // Carcass, shelves, shutters
    } else if (type === 'bed') {
      totalSurfaceArea = (l * d * 2.2) + (l * 2 * h) + (d * 2 * h); // Top frame, bottom box, sides
    } else if (type === 'tv_unit') {
      totalSurfaceArea = (l * h * 1.5) + (l * d * 2);
    } else {
      totalSurfaceArea = (2 * (l * h + l * d + h * d)) * 1.15; // Box with 15% wastage
    }

    const totalSheets = Math.max(1, Math.ceil(totalSurfaceArea / 32));
    
    // Thickness Distribution Breakdown
    const s18 = Math.ceil(totalSheets * 0.65); // 65% Carcass & Shutters
    const s12 = Math.max(1, Math.round(totalSheets * 0.20)); // 20% Shelves & Drawers
    const s6 = Math.max(1, totalSheets - s18 - s12); // 15% Backing

    const gradeInfo = GRADE_PRICING[selectedGrade] || GRADE_PRICING['bwp'];
    const totalSqFt = totalSheets * 32;
    const minCost = Math.round(totalSqFt * gradeInfo.avgSqFt * 0.95);
    const maxCost = Math.round(totalSqFt * gradeInfo.avgSqFt * 1.10);

    if (sheetResult) sheetResult.innerHTML = `${totalSheets} <span style="font-size: 1.1rem; color: #A3B5AE;">Sheets (8x4 ft)</span>`;
    if (breakdown18mm) breakdown18mm.textContent = `${s18} Sheets (18mm Carcass / Shutters)`;
    if (breakdown12mm) breakdown12mm.textContent = `${s12} Sheets (12mm Shelves / Partitions)`;
    if (breakdown6mm) breakdown6mm.textContent = `${s6} Sheets (6mm Backing / Base)`;
    if (estimatedCost) estimatedCost.textContent = `₹${minCost.toLocaleString('en-IN')} - ₹${maxCost.toLocaleString('en-IN')}`;

    if (btnShareWhatsApp) {
      const waMsg = encodeURIComponent(
        `*Pearl Ply - Quotation Estimate*\n` +
        `• Furniture: ${furnitureType.options[furnitureType.selectedIndex].text}\n` +
        `• Dimensions: ${l}ft (L) x ${h}ft (H) x ${d}ft (D)\n` +
        `• Grade: ${gradeInfo.name}\n` +
        `• Total 8x4 Sheets: ${totalSheets} Sheets\n` +
        `  - 18mm: ${s18} | 12mm: ${s12} | 6mm: ${s6}\n` +
        `• Estimated Budget: ₹${minCost.toLocaleString('en-IN')} - ₹${maxCost.toLocaleString('en-IN')}\n\n` +
        `Please send me official factory dealer pricing and samples.`
      );
      btnShareWhatsApp.href = `https://wa.me/919993613434?text=${waMsg}`;
    }
  }

  // Event Listeners
  if (furnitureType) {
    furnitureType.addEventListener('change', () => {
      const preset = FURNITURE_PRESETS[furnitureType.value];
      if (preset) {
        dimLength.value = preset.l;
        dimHeight.value = preset.h;
        dimDepth.value = preset.d;
        if (plyGrade) plyGrade.value = preset.defaultGrade;
      }
      updateCalculator();
    });
  }

  [dimLength, dimHeight, dimDepth, plyGrade].forEach(el => {
    if (el) {
      el.addEventListener('input', updateCalculator);
      el.addEventListener('change', updateCalculator);
    }
  });

  // Initial Calculation Run
  updateCalculator();
});
