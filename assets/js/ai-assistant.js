/**
 * CareerNova — NovaAdvisor AI Assistant Engine
 * Real-time conversational interface with prompt pill integration,
 * typing indicators, contextual responses, and session persistence.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const chatForm = document.querySelector('.chat-input-container, form[action="ai-assistant.html"]');
    const chatInput = document.querySelector('.chat-input-container input[type="text"], input[placeholder*="Ask NovaAdvisor"]');
    const msgContainer = document.querySelector('.chat-messages-container');
    const promptChips = document.querySelectorAll('.prompt-chip');

    if (!msgContainer || !chatInput) return;

    // AI Response Knowledge Bank
    function generateAiResponse(userText) {
      const q = userText.toLowerCase();

      if (q.includes('interview') || q.includes('crack') || q.includes('prepare')) {
        return `
          <div style="font-weight: 700; color: var(--primary-accent); font-size: 0.8rem; margin-bottom: 0.45rem; text-transform: uppercase;">
            Interview Strategy Guide &bull; Technical Architecture
          </div>
          <p style="margin-bottom: 0.75rem;">Here is a battle-tested strategy for breaking into Tier-1 Tech interviews:</p>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; line-height: 1.6; margin-bottom: 0.75rem; color: var(--text-secondary);">
            <li><strong>Data Structures &amp; Graphs:</strong> Master Depth-First Search (DFS), Dijkstra's, and Segment Trees on LeetCode.</li>
            <li><strong>Low-Level System Design:</strong> Practice implementing concurrency primitives (Mutex locks, thread pools) and caching (LRU, Redis).</li>
            <li><strong>Behavioral (STAR Method):</strong> Formulate 3 stories demonstrating resolving technical ambiguity and handling post-mortems under pressure.</li>
          </ul>
          <div style="padding: 0.75rem 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); font-size: 0.84rem; border: 1px solid var(--border-color);">
            💡 <strong>Action Item:</strong> Run through the <a href="skill-assessment.html" style="color: var(--primary-accent); font-weight: 600;">Skill Assessment Center</a> to test your baseline algorithm timing.
          </div>
        `;
      }

      if (q.includes('roadmap') || q.includes('system') || q.includes('full-stack') || q.includes('path')) {
        return `
          <div style="font-weight: 700; color: var(--secondary-accent); font-size: 0.8rem; margin-bottom: 0.45rem; text-transform: uppercase;">
            Architectural Learning Roadmap &bull; 30-Day Plan
          </div>
          <p style="margin-bottom: 0.75rem;">Based on your current skill gaps, here is your high-impact milestone sequence:</p>
          <ol style="padding-left: 1.25rem; font-size: 0.88rem; line-height: 1.6; margin-bottom: 0.75rem; color: var(--text-secondary);">
            <li><strong>Week 1:</strong> Asynchronous Task Queues (Celery, RabbitMQ, Redis Streams).</li>
            <li><strong>Week 2:</strong> Container Orchestration with Docker &amp; Kubernetes cluster configs.</li>
            <li><strong>Week 3:</strong> Distributed Vector Databases (Pinecone, Qdrant) &amp; Hybrid Search.</li>
            <li><strong>Week 4:</strong> Observability, Prometheus metrics, and OpenTelemetry instrumentation.</li>
          </ol>
          <div style="padding: 0.75rem 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); font-size: 0.84rem; border: 1px solid var(--border-color);">
            🚀 <strong>View Live Progress:</strong> Visit your <a href="learning-roadmap.html" style="color: var(--primary-accent); font-weight: 600;">Interactive Learning Roadmap</a> to track completed modules.
          </div>
        `;
      }

      if (q.includes('resume') || q.includes('critique') || q.includes('cv')) {
        return `
          <div style="font-weight: 700; color: var(--primary-accent); font-size: 0.8rem; margin-bottom: 0.45rem; text-transform: uppercase;">
            Resume Audit &bull; ATS Compatibility Review
          </div>
          <p style="margin-bottom: 0.75rem;">I reviewed your stored profile attributes against enterprise ATS parsers:</p>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; line-height: 1.6; margin-bottom: 0.75rem; color: var(--text-secondary);">
            <li><strong>Quantify Business Impact:</strong> Rather than "Built API", use "Engineered REST microservices reducing latency by 28% across 45k req/s".</li>
            <li><strong>Keyword Indexing:</strong> Ensure PyTorch, Docker, Kubernetes, and PostgreSQL appear in both bullet points and the Technical Skills section.</li>
            <li><strong>Single Page Structure:</strong> Keep formatting clean and avoid tables or multi-column grids that confuse legacy applicant parsers.</li>
          </ul>
          <div style="padding: 0.75rem 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); font-size: 0.84rem; border: 1px solid var(--border-color);">
            📄 <strong>Ready to update?</strong> Open the <a href="resume-builder.html" style="color: var(--primary-accent); font-weight: 600;">Live Resume Builder</a> to preview formatting in real time.
          </div>
        `;
      }

      // Default contextual response
      return `
        <div style="font-weight: 700; color: var(--primary-accent); font-size: 0.8rem; margin-bottom: 0.45rem; text-transform: uppercase;">
          NovaAdvisor &bull; Career Intelligence Recommendation
        </div>
        <p style="margin-bottom: 0.75rem;">
          That is a strategic focus area. For candidates targeting <strong>Junior to Mid-Level Engineering</strong> roles, direct experience with production deployments sets you apart from 90% of applicants.
        </p>
        <p style="margin-bottom: 0.75rem; font-size: 0.88rem; color: var(--text-secondary);">
          Your profile indicates strong proficiency in Python and Algorithms. To maximize your match percentage for companies like Google, Microsoft, and NVIDIA, focus on building end-to-end full-stack systems with automated CI/CD and deployment pipelines.
        </p>
        <div style="padding: 0.75rem 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); font-size: 0.84rem; border: 1px solid var(--border-color);">
          🎯 <strong>Recommended Next Steps:</strong> Explore <a href="job-matches.html" style="color: var(--primary-accent); font-weight: 600;">34 Live Job Matches</a> or check <a href="recommendations.html" style="color: var(--primary-accent); font-weight: 600;">Career Matches</a>.
        </div>
      `;
    }

    // Append Message to Chat
    function appendMessage(text, isUser = false) {
      const row = document.createElement('div');
      row.className = `chat-msg-row ${isUser ? 'chat-msg-user' : 'chat-msg-ai'}`;

      if (isUser) {
        row.innerHTML = `
          <div class="chat-avatar chat-avatar-user">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Alex">
          </div>
          <div class="chat-bubble chat-bubble-user-style">
            ${escapeHtml(text)}
          </div>
        `;
      } else {
        row.innerHTML = `
          <div class="chat-avatar chat-avatar-ai">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="chat-bubble chat-bubble-ai-style">
            ${text}
          </div>
        `;
      }

      msgContainer.appendChild(row);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    // Handle User Submission
    function handleSend(userMessage) {
      if (!userMessage || !userMessage.trim()) return;

      appendMessage(userMessage, true);
      chatInput.value = '';

      // Typing Indicator
      const typingRow = document.createElement('div');
      typingRow.className = 'chat-msg-row chat-msg-ai typing-indicator-row';
      typingRow.innerHTML = `
        <div class="chat-avatar chat-avatar-ai">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="chat-bubble chat-bubble-ai-style" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.25rem;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--primary-accent); animation: pulse 1s infinite;"></span>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">NovaAdvisor is thinking...</span>
        </div>
      `;
      msgContainer.appendChild(typingRow);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      // Simulate AI Latency
      setTimeout(() => {
        typingRow.remove();
        const responseHtml = generateAiResponse(userMessage);
        appendMessage(responseHtml, false);
      }, 750);
    }

    // Form submit listener
    if (chatForm) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = chatInput.value;
        handleSend(val);
      });
    }

    // Prompt Chips listener
    promptChips.forEach(chip => {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        const queryText = this.textContent.replace(/^[^\w]+/, '').trim();
        handleSend(queryText);
      });
    });

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }
  });
})();
