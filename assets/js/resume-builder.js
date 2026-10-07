/**
 * NEXORA — Interactive Resume Builder Engine
 * Real-time two-way DOM synchronization between form inputs and live sheet preview,
 * template style switching, and print triggering.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('res_name');
    const emailInput = document.getElementById('res_email');
    const phoneInput = document.getElementById('res_phone');
    const locInput = document.getElementById('res_loc');
    const linksInput = document.getElementById('res_links');
    const summaryInput = document.getElementById('res_summary');
    const eduInput = document.getElementById('res_edu');
    const proj1Input = document.getElementById('res_proj1');
    const proj2Input = document.getElementById('res_proj2');
    const skillsInput = document.getElementById('res_skills');
    const resumeSheet = document.getElementById('resume-sheet');

    // Live Target Elements in Right Preview
    const sheetName = document.querySelector('.sheet-name');
    const sheetContact = document.querySelector('.sheet-contact');
    const summarySection = document.querySelector('.sheet-section:nth-of-type(1) p');
    const eduSection = document.querySelector('.sheet-section:nth-of-type(2) .sheet-item-header span:first-child');
    const proj1Header = document.querySelector('.sheet-section:nth-of-type(4) .sheet-item:first-of-type .sheet-item-header span:first-child');

    // Sync Functions
    function syncName() {
      if (nameInput && sheetName) {
        sheetName.textContent = nameInput.value || 'Your Full Name';
      }
    }

    function syncContact() {
      if (!sheetContact) return;
      const parts = [
        emailInput?.value,
        phoneInput?.value,
        locInput?.value,
        linksInput?.value
      ].filter(Boolean);

      sheetContact.innerHTML = parts.map((part, i) => `<span>${escapeHtml(part)}</span>`).join(' <span>&bull;</span> ');
    }

    function syncSummary() {
      if (summaryInput && summarySection) {
        summarySection.textContent = summaryInput.value || 'Brief summary of your background and professional goals.';
      }
    }

    function syncEdu() {
      if (eduInput && eduSection) {
        eduSection.textContent = eduInput.value || 'University / Degree';
      }
    }

    function syncProjects() {
      if (proj1Input && proj1Header) {
        proj1Header.textContent = proj1Input.value || 'Featured Project Title';
      }
    }

    function syncSkills() {
      const skillsContainer = document.querySelector('.sheet-section:last-of-type, .sheet-skills');
      if (skillsInput && skillsContainer) {
        // If technical skills section exists, update text
        const skillsText = skillsContainer.querySelector('p');
        if (skillsText) {
          skillsText.textContent = skillsInput.value;
        }
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    // Attach Event Listeners
    if (nameInput) nameInput.addEventListener('input', syncName);
    if (emailInput) emailInput.addEventListener('input', syncContact);
    if (phoneInput) phoneInput.addEventListener('input', syncContact);
    if (locInput) locInput.addEventListener('input', syncContact);
    if (linksInput) linksInput.addEventListener('input', syncContact);
    if (summaryInput) summaryInput.addEventListener('input', syncSummary);
    if (eduInput) eduInput.addEventListener('input', syncEdu);
    if (proj1Input) proj1Input.addEventListener('input', syncProjects);
    if (skillsInput) skillsInput.addEventListener('input', syncSkills);

    // Form Submit (Prevent page reload)
    const form = document.querySelector('.builder-layout form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        syncName();
        syncContact();
        syncSummary();
        syncEdu();
        syncProjects();
        syncSkills();
        if (window.NEXORAPortal) {
          window.NEXORAPortal.toast('Resume preview updated live!', 'success');
        }
      });
    }

    // Template Presets
    const templateBadges = document.querySelectorAll('.form-group .badge');
    templateBadges.forEach(badge => {
      badge.addEventListener('click', function () {
        templateBadges.forEach(b => {
          b.classList.remove('badge-blue', 'badge-teal', 'badge-emerald');
          b.classList.add('badge-secondary');
        });
        this.classList.remove('badge-secondary');
        this.classList.add('badge-blue');

        const styleName = this.textContent.toLowerCase();
        if (resumeSheet) {
          if (styleName.includes('executive')) {
            resumeSheet.style.fontFamily = 'Georgia, serif';
            resumeSheet.style.borderTop = '6px solid #1E293B';
          } else if (styleName.includes('academic')) {
            resumeSheet.style.fontFamily = "'Times New Roman', serif";
            resumeSheet.style.borderTop = '3px solid #000000';
          } else {
            resumeSheet.style.fontFamily = 'var(--font-sans)';
            resumeSheet.style.borderTop = '4px solid var(--primary-accent)';
          }
        }
        if (window.NEXORAPortal) {
          window.NEXORAPortal.toast(`Switched template to ${this.textContent.trim()}`, 'info');
        }
      });
    });

    // Add Print to PDF Button to Top Action Bar
    const topActions = document.querySelector('.no-print div[style*="display: flex; gap: 0.75rem"]');
    if (topActions) {
      const printBtn = document.createElement('button');
      printBtn.type = 'button';
      printBtn.className = 'btn btn-primary btn-sm';
      printBtn.innerHTML = '🖨️ Print / Save PDF';
      printBtn.addEventListener('click', () => {
        window.print();
      });
      topActions.appendChild(printBtn);
    }
  });
})();
