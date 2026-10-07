/**
 * CareerNova — Settings Module
 * Handles form save, preference persistence, and toast feedback.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const settingsForm = document.querySelector('.portal-content form');
    if (!settingsForm) return;

    settingsForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('s_name');
      const emailInput = document.getElementById('s_email');

      if (window.CareerNovaPortal) {
        const profile = window.CareerNovaPortal.getProfile() || {};
        if (nameInput) profile.name = nameInput.value.trim();
        if (emailInput) profile.email = emailInput.value.trim();
        localStorage.setItem('careernova-profile', JSON.stringify(profile));
        window.CareerNovaPortal.toast('Settings saved successfully!', 'success');
      }
    });
  });
})();
