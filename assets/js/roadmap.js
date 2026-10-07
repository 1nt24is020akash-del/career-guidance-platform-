/**
 * CareerNova — Learning Roadmap Interactive Module
 * Tab switching across tracks (Full-Stack, AI, Data Science, Cyber, Cloud),
 * search filtering, and milestone progress tracking.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const tabLabels = document.querySelectorAll('.roadmap-tab-nav label');
    const searchInput = document.querySelector('.portal-topbar input[type="search"]');

    // Tab switcher
    tabLabels.forEach(label => {
      label.addEventListener('click', function () {
        tabLabels.forEach(l => l.style.borderColor = '');
        this.style.borderColor = 'var(--primary-accent)';
        
        const text = this.textContent.trim();
        if (window.CareerNovaPortal) {
          window.CareerNovaPortal.toast(`Switched track to ${text}`, 'info');
        }
      });
    });

    // Search filter across milestones
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const q = e.target.value.toLowerCase().trim();
        const nodes = document.querySelectorAll('.milestone-node');

        nodes.forEach(node => {
          if (!q) {
            node.style.display = '';
            return;
          }
          const text = node.textContent.toLowerCase();
          if (text.includes(q)) {
            node.style.display = '';
          } else {
            node.style.display = 'none';
          }
        });
      });
    }
  });
})();
