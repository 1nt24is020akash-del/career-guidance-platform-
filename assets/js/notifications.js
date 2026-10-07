/**
 * CareerNova — Notification Center Module
 * Handles filter pills, "Mark All Read" action, and clearing unread badges.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const markAllBtn = document.querySelector('header a[href*="notifications.html"].btn-secondary, .btn-mark-all-read');
    const filterRadios = document.querySelectorAll('input[name="notif-pill"]');
    const notifCards = document.querySelectorAll('.portal-content .card');

    if (markAllBtn) {
      markAllBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove all unread badges
        document.querySelectorAll('.badge-rose').forEach(b => {
          if (b.textContent.trim().toLowerCase() === 'unread') {
            b.remove();
          }
        });

        // Clear topbar and sidebar badges
        document.querySelectorAll('.sidebar-badge.badge-rose, .notification-count').forEach(el => {
          el.textContent = '';
          el.style.display = 'none';
        });

        if (window.CareerNovaPortal) {
          window.CareerNovaPortal.toast('All notifications marked as read', 'success');
        }
      });
    }

    // Category filter pills
    filterRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        const id = this.id;
        notifCards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (id === 'nf-jobs' && !text.includes('job match') && !text.includes('synthetix') && !text.includes('google')) {
            card.style.display = 'none';
          } else if (id === 'nf-ai' && !text.includes('ai') && !text.includes('recommendation') && !text.includes('advisor')) {
            card.style.display = 'none';
          } else if (id === 'nf-skills' && !text.includes('skill') && !text.includes('milestone') && !text.includes('assessment')) {
            card.style.display = 'none';
          } else if (id === 'nf-sys' && !text.includes('platform') && !text.includes('security') && !text.includes('update')) {
            card.style.display = 'none';
          } else {
            card.style.display = '';
          }
        });
      });
    });
  });
})();
