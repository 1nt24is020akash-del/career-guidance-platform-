/**
 * NEXORA — Public Pages Interactive Module
 * Handles mobile navbar toggle, simulated auth actions for demo login/register,
 * and seamless redirection to dashboard.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Demo Login / Register Form handling
    const authForms = document.querySelectorAll('form[action*="dashboard.html"], form[action*="login"], form[action*="register"], .auth-card form');

    authForms.forEach(form => {
      form.addEventListener('submit', function (e) {
        // Allow smooth simulated transition
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const nameInput = form.querySelector('input[name="name"], input[placeholder*="Name"]');

        let profileName = 'Alex Rivera';
        if (nameInput && nameInput.value.trim()) {
          profileName = nameInput.value.trim();
        }

        // Store active session
        localStorage.setItem('nexora-auth', 'true');
        const profile = {
          name: profileName,
          email: emailInput ? emailInput.value : 'alex.rivera@stanford.edu',
          school: 'Stanford University',
          targetRole: 'AI / ML Engineer'
        };
        localStorage.setItem('nexora-profile', JSON.stringify(profile));

        // Toast feedback
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Signing in...';
          btn.disabled = true;
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 350);
      });
    });

    // Mobile Navbar Menu Toggle for public pages
    const navToggle = document.querySelector('.nav-toggle, #nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu, .nav-menu');
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
      });
    }

    // Mount Floating AI Assistant Symbol
    if (!document.getElementById('floating-ai-btn')) {
      const btn = document.createElement('a');
      btn.href = 'ai-assistant.html';
      btn.className = 'floating-ai-btn';
      btn.id = 'floating-ai-btn';
      btn.setAttribute('aria-label', 'Ask AI Career Assistant');
      btn.setAttribute('title', 'Chat with NovaAdvisor AI');

      btn.innerHTML = `
        <span class="floating-ai-pulse"></span>
        <span class="floating-ai-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" fill="rgba(255,255,255,0.95)" stroke="none"/>
            <path d="M19 2L19.8 5.2L23 6L19.8 6.8L19 10L18.2 6.8L15 6L18.2 5.2Z" fill="#38BDF8" stroke="none"/>
          </svg>
        </span>
        <span class="floating-ai-status" title="NovaAdvisor Active"></span>
        <span class="floating-ai-tooltip">Ask Nova AI ✨</span>
      `;
      document.body.appendChild(btn);
    }
  });
})();

