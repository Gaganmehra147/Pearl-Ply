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
      title: 'Pearl 100% Calibrated Marine Plywood (IS:710)',
      tag: 'Supreme Waterproof & CNC Precision',
      desc: 'Engineered with unextended Phenol Formaldehyde resin, 72-hour boiling water proof endurance, and 4x calibrating sanding for 0.1mm thickness accuracy required by modular factory CNC machines.',
      specs: 'IS:710 Marine Certified | 100% Gurjan Core | 25-Year Warranty | E0 Emission',
      targetId: 'prod-marine'
    },
    kitchen_mod_carpenter: {
      title: 'Pearl Marine BWP 710 Plywood',
      tag: 'Boiling Water Proof & Termite Defense',
      desc: 'Ideal for modular kitchens, under-sink carcasses, and heavy moisture zones. Deep chemical vacuum pressure impregnation prevents borer and termite infestations permanently.',
      specs: 'IS:710 BWP | 72-Hour Boiling Proof | 100% Hardwood | 20-Year Guarantee',
      targetId: 'prod-bwp'
    },
    bedroom_dry: {
      title: 'Pearl Commercial MR Plywood (IS:303)',
      tag: 'Cost-Effective Strength for Living & Bedrooms',
      desc: 'Bonded with fortified Melamine Urea Formaldehyde resin, engineered for high nail holding capacity, warp-free wardrobes, and luxury false ceiling paneling.',
      specs: 'IS:303 MR Grade | Borer Proof Chemical Shield | Selected Timber Core',
      targetId: 'prod-mr'
    },
    wardrobe_doors: {
      title: 'Pearl SolidCore Block Board (IS:1659)',
      tag: '100% Anti-Warping for Tall 7ft/8ft Shutters',
      desc: 'Manufactured with seasoned pine and hardwood battens with zero core gaps. Provides extreme vertical rigidity preventing wardrobe shutters and long table tops from bending over time.',
      specs: 'IS:1659 Grade | Zero Core Gap | High Screw Retention | Solid Timber Batten',
      targetId: 'prod-blockboard'
    },
    bwr_general: {
      title: 'Pearl BWR Moisture Guard Plywood (IS:303)',
      tag: 'Boiling Water Resistant for All-Weather Use',
      desc: 'Enhanced synthetic phenolic bonding withstands moderate humidity and accidental water spills. Perfect for dining furniture, living room partitions, and bedroom storage.',
      specs: 'IS:303 BWR | Phenolic Resin | 15-Year Warranty | High Density Core',
      targetId: 'prod-bwr'
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
    if (userAnswers.room === 'kitchen' || userAnswers.room === 'bathroom') {
      recKey = (userAnswers.style === 'cnc') ? 'kitchen_high_cnc' : 'kitchen_mod_carpenter';
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
