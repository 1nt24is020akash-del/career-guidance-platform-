/**
 * CareerNova — Skill Assessment & Simulator Engine
 * Powers track filtering on skill-assessment.html and
 * full interactive quiz stepper, timer, scoring, and score saving on assessment-demo.html.
 */

(function () {
  'use strict';

  // Questions Database for PyTorch & Machine Learning Simulator
  const SIMULATOR_QUESTIONS = [
    {
      id: 1,
      section: 'Section 1: Tensor Architecture',
      points: '2.0 Points',
      title: 'Which PyTorch method moves tensor computations to GPU memory while preserving gradient calculation history?',
      code: 'device = torch.device("cuda" if torch.cuda.is_available() else "cpu")\nmodel = ResNet().to(device)\ntensor = torch.randn(32, 3, 224, 224)',
      options: [
        { key: 'A', text: 'tensor.cpu()', correct: false },
        { key: 'B', text: 'tensor.to(device)', correct: true },
        { key: 'C', text: 'tensor.detach()', correct: false },
        { key: 'D', text: 'tensor.numpy()', correct: false }
      ],
      explanation: 'tensor.to(device) transfers the tensor data to the target GPU accelerator while maintaining the autograd graph.'
    },
    {
      id: 2,
      section: 'Section 1: Autograd & Computational Graph',
      points: '2.0 Points',
      title: 'Why is it mandatory to call optimizer.zero_grad() before loss.backward() in standard PyTorch training loops?',
      code: 'for inputs, labels in dataloader:\n    optimizer.zero_grad()  # <-- Why is this line critical?\n    outputs = model(inputs)\n    loss = criterion(outputs, labels)\n    loss.backward()\n    optimizer.step()',
      options: [
        { key: 'A', text: 'To reset the learning rate schedule for the current epoch', correct: false },
        { key: 'B', text: 'Because gradients accumulate by default in PyTorch across subsequent backward passes', correct: true },
        { key: 'C', text: 'To flush GPU cache allocations and prevent Out-Of-Memory errors', correct: false },
        { key: 'D', text: 'To re-initialize layer bias parameters to zero', correct: false }
      ],
      explanation: 'By default, PyTorch accumulates (sums) gradients on subsequent backward passes; zero_grad() prevents compounding previous batch gradients.'
    },
    {
      id: 3,
      section: 'Section 2: Inference & Graph State',
      points: '2.0 Points',
      title: 'In the following PyTorch forward pass, what is the exact difference between torch.no_grad() versus model.eval() during evaluation?',
      code: 'with torch.no_grad():\n    model.eval()\n    outputs = model(inputs)\n    loss = criterion(outputs, labels)',
      options: [
        { key: 'A', text: 'torch.no_grad() disables gradient tracking graphs to save memory, while model.eval() modifies the runtime behavior of layers like Dropout and BatchNorm.', correct: true },
        { key: 'B', text: 'They perform identical functions and can be used interchangeably.', correct: false },
        { key: 'C', text: 'model.eval() freezes weights, while torch.no_grad() deletes the model architecture from RAM.', correct: false },
        { key: 'D', text: 'torch.no_grad() is only valid for CPU inference; model.eval() is required for CUDA.', correct: false }
      ],
      explanation: 'torch.no_grad() deactivates the autograd engine reducing memory consumption; model.eval() informs layers like Dropout (to not drop neurons) and BatchNorm (to use frozen running statistics).'
    },
    {
      id: 4,
      section: 'Section 3: Transformer Attention',
      points: '2.5 Points',
      title: 'In Multi-Head Attention mechanisms, why do we scale the dot product of Query and Key by 1/sqrt(d_k)?',
      code: 'Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V',
      options: [
        { key: 'A', text: 'To ensure the resulting matrix remains upper triangular for causal decoding', correct: false },
        { key: 'B', text: 'To prevent large dot product values from pushing the softmax function into regions with vanishingly tiny gradients', correct: true },
        { key: 'C', text: 'To enforce orthogonality among attention head projections', correct: false },
        { key: 'D', text: 'To normalize the sequence length dimension across varying batch sizes', correct: false }
      ],
      explanation: 'For large values of d_k, dot products grow large in magnitude, driving the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) stabilizes backpropagation.'
    },
    {
      id: 5,
      section: 'Section 4: Low-Rank Adaptation (LoRA)',
      points: '2.5 Points',
      title: 'How does LoRA achieve parameter-efficient fine-tuning on large 7B+ language models?',
      code: 'W_new = W_0 + (B * A) * (alpha / r)\n# where W_0 is frozen, A is in R^(r x k), B is in R^(d x r), r << min(d, k)',
      options: [
        { key: 'A', text: 'By pruning 90% of the attention weights using magnitude thresholding', correct: false },
        { key: 'B', text: 'By freezing base weights and learning two low-rank decomposition matrices (rank r << d)', correct: true },
        { key: 'C', text: 'By quantizing all matrix activations from 16-bit float down to 4-bit integer values', correct: false },
        { key: 'D', text: 'By caching all KV embeddings to external NVMe SSD drives', correct: false }
      ],
      explanation: 'LoRA freezes pre-trained model weights and injects trainable rank decomposition matrices into each Transformer layer, drastically reducing trainable parameters.'
    }
  ];

  document.addEventListener('DOMContentLoaded', function () {
    // Check if on skill-assessment.html
    const isAssessmentCenter = window.location.pathname.includes('skill-assessment.html');
    const isSimulatorPage = window.location.pathname.includes('assessment-demo.html');

    if (isAssessmentCenter) {
      initAssessmentCenter();
    } else if (isSimulatorPage) {
      initSimulatorPage();
    }
  });

  // Track filter on assessment center page
  function initAssessmentCenter() {
    const filterRadios = document.querySelectorAll('input[name="skill-cat"]');
    const cards = document.querySelectorAll('.grid-3 > .card');

    filterRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        const id = this.id;
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (id === 'sc-prog' && !text.includes('python') && !text.includes('typescript') && !text.includes('programming')) {
            card.style.display = 'none';
          } else if (id === 'sc-logic' && !text.includes('algorithm') && !text.includes('deep learning') && !text.includes('math')) {
            card.style.display = 'none';
          } else if (id === 'sc-cloud' && !text.includes('cloud') && !text.includes('devops') && !text.includes('aws')) {
            card.style.display = 'none';
          } else if (id === 'sc-comm' && !text.includes('architecture') && !text.includes('professional')) {
            card.style.display = 'none';
          } else {
            card.style.display = '';
          }
        });
      });
    });

    // Display past score badge if exists
    try {
      const savedScore = localStorage.getItem('careernova-assessment');
      if (savedScore) {
        const data = JSON.parse(savedScore);
        const banner = document.querySelector('.card[style*="linear-gradient"]');
        if (banner) {
          const existingBadge = banner.querySelector('.badge-score');
          if (!existingBadge) {
            const badge = document.createElement('span');
            badge.className = 'badge badge-emerald badge-score';
            badge.textContent = `Latest Score: ${data.score}% (${data.status || 'Verified'})`;
            banner.querySelector('div[style*="gap: 0.5rem"]')?.appendChild(badge);
          }
        }
      }
    } catch (e) {}
  }

  // Interactive 5-question simulator engine
  function initSimulatorPage() {
    let currentIdx = 0;
    const userAnswers = {};
    let timeSeconds = 15 * 60; // 15:00

    const container = document.querySelector('main.container');
    if (!container) return;

    // Start timer
    const timerBadge = document.querySelector('.badge-rose');
    const timerInterval = setInterval(() => {
      if (timeSeconds <= 0) {
        clearInterval(timerInterval);
        submitAssessment();
        return;
      }
      timeSeconds--;
      const m = Math.floor(timeSeconds / 60);
      const s = timeSeconds % 60;
      if (timerBadge) {
        timerBadge.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }, 1000);

    // Render Question
    function renderQuestion(idx) {
      const q = SIMULATOR_QUESTIONS[idx];
      const total = SIMULATOR_QUESTIONS.length;
      const progressPct = Math.round(((idx + 1) / total) * 100);

      // Top progress bar update
      const progressFill = document.querySelector('.progress-bar-fill');
      const progressText = document.querySelector('.progress-bar-wrap')?.previousElementSibling;
      if (progressFill) progressFill.style.width = `${progressPct}%`;
      if (progressText) {
        progressText.innerHTML = `
          <span style="color: var(--text-secondary);">Question <strong>${idx + 1}</strong> of <strong>${total}</strong> in this demonstration</span>
          <span style="color: var(--primary-accent); font-weight: 700;">${progressPct}% Completed</span>
        `;
      }

      // Question card
      const questionCard = document.querySelector('.card[style*="padding: 2.5rem"]') || document.querySelector('.card');
      if (!questionCard) return;

      const selectedOption = userAnswers[q.id];

      questionCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <span class="badge badge-blue">Question #${String(q.id).padStart(2, '0')} &bull; ${q.section}</span>
          <span class="badge badge-teal">${q.points}</span>
        </div>

        <h2 style="font-size: 1.35rem; margin-bottom: 1rem; line-height: 1.5; color: var(--text-primary);">
          ${escapeHtml(q.title)}
        </h2>

        ${q.code ? `
          <div class="code-snippet-box">
            <pre style="margin: 0; font-family: inherit; font-size: inherit; color: inherit; white-space: pre-wrap;">${escapeHtml(q.code)}</pre>
          </div>
        ` : ''}

        <div class="options-group" style="margin-top: 1.5rem;">
          ${q.options.map(opt => {
            const isChecked = selectedOption === opt.key;
            return `
              <label class="option-card-label" style="${isChecked ? 'border-color: var(--primary-accent); background: var(--bg-card-subtle);' : ''}">
                <input type="radio" name="sim_q_${q.id}" value="${opt.key}" ${isChecked ? 'checked' : ''}>
                <span class="option-letter" style="${isChecked ? 'background: var(--primary-accent); color: #FFFFFF;' : ''}">${opt.key}</span>
                <span style="font-size: 0.92rem; color: var(--text-primary); font-weight: ${isChecked ? '600' : '400'};">
                  ${opt.text}
                </span>
              </label>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
          <button type="button" class="btn btn-secondary btn-prev" ${idx === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
            &larr; Previous Question
          </button>
          <div style="display: flex; gap: 0.75rem;">
            ${idx < total - 1 ? `
              <button type="button" class="btn btn-primary btn-next">
                Next Question &rarr;
              </button>
            ` : `
              <button type="button" class="btn btn-primary btn-submit-test" style="background: var(--success); border-color: var(--success);">
                ✓ Submit Assessment
              </button>
            `}
          </div>
        </div>
      `;

      // Option click listener
      const optionLabels = questionCard.querySelectorAll('.option-card-label');
      optionLabels.forEach(label => {
        label.addEventListener('click', function () {
          const radio = this.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;
            userAnswers[q.id] = radio.value;
            // re-render current question to update styles
            renderQuestion(idx);
          }
        });
      });

      // Next / Prev listeners
      const nextBtn = questionCard.querySelector('.btn-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentIdx < SIMULATOR_QUESTIONS.length - 1) {
            currentIdx++;
            renderQuestion(currentIdx);
          }
        });
      }

      const prevBtn = questionCard.querySelector('.btn-prev');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentIdx > 0) {
            currentIdx--;
            renderQuestion(currentIdx);
          }
        });
      }

      const submitBtn = questionCard.querySelector('.btn-submit-test');
      if (submitBtn) {
        submitBtn.addEventListener('click', submitAssessment);
      }
    }

    // Submit Assessment & Show Result Breakdown
    function submitAssessment() {
      clearInterval(timerInterval);

      let correctCount = 0;
      SIMULATOR_QUESTIONS.forEach(q => {
        const correctOpt = q.options.find(o => o.correct);
        if (userAnswers[q.id] === correctOpt?.key) {
          correctCount++;
        }
      });

      const total = SIMULATOR_QUESTIONS.length;
      const scorePct = Math.round((correctCount / total) * 100);
      const isPassed = scorePct >= 70;

      // Persist to localStorage
      const resultData = {
        score: scorePct,
        correct: correctCount,
        total: total,
        status: isPassed ? 'Verified Expert' : 'Candidate',
        completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      localStorage.setItem('careernova-assessment', JSON.stringify(resultData));

      if (window.CareerNovaPortal) {
        window.CareerNovaPortal.toast(`Assessment Completed! You scored ${scorePct}%`, 'success');
      }

      // Render Result Card in place
      container.innerHTML = `
        <div class="card" style="padding: 3rem 2rem; text-align: center; max-width: 720px; margin: 2rem auto; border-top: 4px solid var(--${isPassed ? 'success' : 'primary-accent'});">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); color: var(--success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>

          <span class="badge ${isPassed ? 'badge-emerald' : 'badge-blue'}" style="font-size: 0.85rem; padding: 0.4rem 1rem; margin-bottom: 0.75rem;">
            ${isPassed ? 'Industry Verified Competency' : 'Assessment Completed'}
          </span>

          <h1 style="font-size: 2.2rem; margin: 0 0 0.5rem 0; color: var(--text-primary);">
            Overall Score: <span style="color: var(--primary-accent);">${scorePct}%</span>
          </h1>

          <p style="color: var(--text-secondary); font-size: 1rem; max-width: 520px; margin: 0 auto 2rem auto; line-height: 1.6;">
            You answered <strong>${correctCount} of ${total}</strong> questions correctly. Your verified benchmark score has been attached to your candidate profile and synced with matching hiring partners.
          </p>

          <div class="grid-3" style="gap: 1rem; margin-bottom: 2.5rem; text-align: left;">
            <div style="padding: 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Percentile Rank</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">Top ${100 - scorePct > 5 ? 100 - scorePct : 5}%</div>
            </div>
            <div style="padding: 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Autograd Mastery</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--success); margin-top: 0.25rem;">100%</div>
            </div>
            <div style="padding: 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">LoRA Tuning</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-accent); margin-top: 0.25rem;">Verified</div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="job-matches.html" class="btn btn-primary btn-lg">
              View Matched Roles for this Score &rarr;
            </a>
            <a href="skill-assessment.html" class="btn btn-secondary btn-lg">
              Return to Assessment Center
            </a>
          </div>
        </div>
      `;
    }

    // Top submit button in header
    const topSubmitBtn = document.querySelector('header a[href="#results"], header .btn-primary');
    if (topSubmitBtn) {
      topSubmitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        submitAssessment();
      });
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    // Initial render
    renderQuestion(0);
  }
})();
