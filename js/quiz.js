/* ==========================================================================
   PEARL PLY - SMART PRODUCT FINDER QUIZ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const userAnswers = {
    room: null,
    moisture: null,
    style: null
  };

  const stepNodes = document.querySelectorAll('.quiz-step-node');
  const quizSteps = document.querySelectorAll('.quiz-step-panel');
  const quizResultBox = document.getElementById('quizResultBox');
  const quizFormPanel = document.getElementById('quizFormPanel');

  const PRODUCT_RECOMMENDATIONS = {
    kitchen_high_cnc: {
      title: 'Pearl Ultima Plus (IS:710 BWP Marine)',
      tag: '100% Gurjan Inside & 15-Year Replacement Warranty',
      desc: 'Super-premium Boiling Water Proof (BWP) plywood certified IS:710 (CM/L 9504492). Built with 100% Gurjan core inside, extra layer construction, and 4-head quad calibration for zero delamination in modular kitchens & bathrooms.',
      specs: 'IS:710 Marine Certified | 100% Gurjan Inside | 15-Year Guarantee | 72-Hr Boiling Proof',
      targetId: 'prod-ultimaplus'
    },
    kitchen_mod_carpenter: {
      title: 'Pearl Ultima Plus (IS:710 BWP Marine)',
      tag: 'Supreme Waterproof & Anti-Termite Shield',
      desc: 'Ideal for modular kitchens, under-sink carcasses, and continuous water contact areas. Deep vacuum pressure chemical treatment guarantees zero borer and termite vulnerability.',
      specs: 'IS:710 BWP | 72-Hour Boiling Proof | 100% Gurjan Core | 15-Year Guarantee',
      targetId: 'prod-ultimaplus'
    },
    bedroom_dry: {
      title: 'Pearl Black Decor (IS:303 MR Grade)',
      tag: '100% Gurjan Face & Full Core Solid Panel',
      desc: 'Engineered for luxury living room furniture, wardrobes, wall louvers, and TV consoles. Full core, full panel construction delivers unmatched screw holding and structural flatness.',
      specs: 'IS:303 MR Grade | 100% Gurjan Face | Full Core Full Panel | ISI Marked',
      targetId: 'prod-blackdecor'
    },
    wardrobe_doors: {
      title: 'Pearl Platinum (IS:2202 BWP Flush Door)',
      tag: '100% Pure Pine Wood & Zero Swell Protection',
      desc: 'Manufactured with 100% pure seasoned pine wood core. Full water proof and warp resistant, perfect for tall 7ft/8ft wardrobe shutters, main entrance doors, and heavy load partitions.',
      specs: 'IS:2202 BWP Grade | 100% Pine Wood Core | Swell Proof | 10-Year Guarantee',
      targetId: 'prod-platinum'
    },
    bwr_general: {
      title: 'Pearl Ultima Ply (IS:303 BWR Grade)',
      tag: 'Calibrated Gurjan Face & Extra Layer Technology',
      desc: 'Certified IS:303 BWR Grade (CM/L 9760279217). Extra layer high density plywood with calibrated Gurjan face. 8-hour boiling water resistant and hot pressed for lifetime domestic durability.',
      specs: 'IS:303 BWR Grade | Calibrated Gurjan Face | 10-Year Guarantee | High Density',
      targetId: 'prod-ultimaply'
    }
  };

  window.selectQuizOption = function(step, key, element) {
    // Highlight selection
    const parent = element.parentElement;
    parent.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');

    if (step === 1) userAnswers.room = key;
    if (step === 2) userAnswers.moisture = key;
    if (step === 3) userAnswers.style = key;

    setTimeout(() => {
      if (step < 3) {
        goToStep(step + 1);
      } else {
        renderQuizResult();
      }
    }, 250);
  };

  function goToStep(step) {
    currentStep = step;
    quizSteps.forEach(panel => {
      panel.style.display = (parseInt(panel.dataset.step) === step) ? 'block' : 'none';
    });

    stepNodes.forEach(node => {
      const nodeStep = parseInt(node.dataset.step);
      node.classList.remove('active', 'completed');
      if (nodeStep === step) node.classList.add('active');
      else if (nodeStep < step) node.classList.add('completed');
    });
  }

  function renderQuizResult() {
    if (quizFormPanel) quizFormPanel.style.display = 'none';
    if (quizResultBox) quizResultBox.style.display = 'block';

    let recKey = 'bwr_general';
    if (userAnswers.room === 'kitchen' || userAnswers.room === 'bathroom' || userAnswers.moisture === 'submerged') {
      recKey = 'kitchen_high_cnc';
    } else if (userAnswers.room === 'wardrobe_doors') {
      recKey = 'wardrobe_doors';
    } else if (userAnswers.moisture === 'dry') {
      recKey = 'bedroom_dry';
    } else {
      recKey = 'bwr_general';
    }

    const rec = PRODUCT_RECOMMENDATIONS[recKey] || PRODUCT_RECOMMENDATIONS['kitchen_high_cnc'];

    const titleEl = document.getElementById('recProductTitle');
    const tagEl = document.getElementById('recProductTag');
    const descEl = document.getElementById('recProductDesc');
    const specsEl = document.getElementById('recProductSpecs');
    const ctaEl = document.getElementById('recProductCta');

    if (titleEl) titleEl.textContent = rec.title;
    if (tagEl) tagEl.textContent = rec.tag;
    if (descEl) descEl.textContent = rec.desc;
    if (specsEl) specsEl.textContent = rec.specs;
    if (ctaEl) ctaEl.href = `#${rec.targetId}`;
  }

  window.restartQuiz = function() {
    userAnswers.room = null;
    userAnswers.moisture = null;
    userAnswers.style = null;
    document.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
    if (quizResultBox) quizResultBox.style.display = 'none';
    if (quizFormPanel) quizFormPanel.style.display = 'block';
    goToStep(1);
  };
});
