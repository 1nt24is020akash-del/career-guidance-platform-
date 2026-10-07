/**
 * CareerNova — Candidate Profile Module
 * Handles candidate profile editing, dynamic skill tag manager,
 * and synchronizing profile state across portal headers and sidebar.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const editForm = document.querySelector('#edit-form form, .grid-2 form');
    const profileBannerName = document.querySelector('.portal-content h2');
    const sidebarName = document.querySelector('.user-mini-name');
    const skillContainer = document.querySelector('.skill-tags-wrap, div[style*="gap: 0.5rem; flex-wrap: wrap"]');

    // Load initial profile data
    let profile = window.CareerNovaPortal ? window.CareerNovaPortal.getProfile() : null;

    if (profile && editForm) {
      const nameInput = editForm.querySelector('input[type="text"]');
      if (nameInput && profile.name) {
        nameInput.value = profile.name;
      }
    }

    // Handle Form Submit
    if (editForm) {
      editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputs = editForm.querySelectorAll('input, textarea, select');
        const updated = { ...profile };

        inputs.forEach(input => {
          const label = input.closest('.form-group')?.querySelector('label')?.textContent.toLowerCase() || '';
          const val = input.value.trim();

          if (label.includes('name')) updated.name = val;
          else if (label.includes('track') || label.includes('role')) updated.targetRole = val;
          else if (label.includes('school') || label.includes('university')) updated.school = val;
          else if (label.includes('bio') || label.includes('about')) updated.bio = val;
        });

        // Save to localStorage
        localStorage.setItem('careernova-profile', JSON.stringify(updated));

        // Update DOM in real-time
        if (profileBannerName && updated.name) {
          profileBannerName.textContent = updated.name;
        }
        if (sidebarName && updated.name) {
          sidebarName.textContent = updated.name;
        }

        if (window.CareerNovaPortal) {
          window.CareerNovaPortal.toast('Candidate profile updated successfully!', 'success');
        }
      });
    }

    // Dynamic Skill Tag Addition
    const skillAdderWrap = document.querySelector('.skill-input-row');
    if (skillContainer) {
      // Allow clicking existing skill badges to remove them
      skillContainer.addEventListener('click', function (e) {
        const badge = e.target.closest('.badge');
        if (badge && e.altKey) {
          badge.remove();
          if (window.CareerNovaPortal) {
            window.CareerNovaPortal.toast(`Skill removed`, 'info');
          }
        }
      });
    }
  });
})();
