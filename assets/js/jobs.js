/**
 * CareerNova — Job Opportunities & Search Module
 * Handles dynamic filtering, real-time search, company quick chips,
 * and persistent job bookmarking (Save / Unsave).
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const searchInputs = document.querySelectorAll('.portal-topbar input[type="search"], .portal-content input[type="search"]');
    const companyChips = document.querySelectorAll('.company-filter-chip');
    const locationSelect = document.querySelector('select[name="location"], .form-group select:nth-of-type(1)');
    const experienceSelect = document.querySelector('select[name="experience"]');
    const sortSelect = document.querySelector('select[name="sort"]');
    const jobArticles = document.querySelectorAll('.portal-job-card');

    let currentFilter = {
      query: '',
      company: 'all',
      location: 'all',
      sort: 'match'
    };

    // Update bookmark button states based on saved jobs in localStorage
    function updateBookmarkButtons() {
      const savedJobs = window.CareerNovaPortal ? window.CareerNovaPortal.getSavedJobs() : [];
      const savedIds = new Set(savedJobs.map(j => String(j.id)));

      jobArticles.forEach(article => {
        const jobId = article.getAttribute('data-job-id') || article.id || article.querySelector('h3, h4')?.textContent.trim();
        const saveBtn = article.querySelector('a[title="Save Job"], a[href="#saved-modal"], .btn-save-job');
        
        if (saveBtn) {
          const isSaved = savedIds.has(String(jobId)) || savedJobs.some(j => j.title && article.textContent.includes(j.title));
          if (isSaved) {
            saveBtn.innerHTML = '♥ Saved';
            saveBtn.classList.add('btn-saved');
            saveBtn.style.color = 'var(--rose, #F43F5E)';
            saveBtn.style.borderColor = 'var(--rose, #F43F5E)';
          } else {
            saveBtn.innerHTML = '♡ Save';
            saveBtn.classList.remove('btn-saved');
            saveBtn.style.color = '';
            saveBtn.style.borderColor = '';
          }
        }
      });
    }

    // Filter jobs based on query, company chip, location
    function filterJobs() {
      const q = currentFilter.query.toLowerCase().trim();
      const comp = currentFilter.company.toLowerCase();

      let visibleCount = 0;

      jobArticles.forEach(article => {
        const text = article.textContent.toLowerCase();
        const articleCompany = (article.querySelector('.company-hire-meta h4, .brand-badge')?.getAttribute('title') || 
                                article.id || '').toLowerCase();

        let matchesQuery = !q || text.includes(q);
        let matchesCompany = (comp === 'all' || comp === '' || 
                             article.id.toLowerCase() === comp || 
                             text.includes(comp) || 
                             articleCompany.includes(comp));

        if (matchesQuery && matchesCompany) {
          article.style.display = '';
          visibleCount++;
        } else {
          article.style.display = 'none';
        }
      });

      // Update counter if present
      const counterEl = document.querySelector('.portal-content h1 + p, .job-count-text');
      if (counterEl && counterEl.textContent.includes('Showing')) {
        counterEl.innerHTML = `Showing <strong>${visibleCount}</strong> curated tech positions across Fortune 500 innovators and leading product giants.`;
      }
    }

    // Real-time search listeners
    searchInputs.forEach(input => {
      input.addEventListener('input', function (e) {
        currentFilter.query = e.target.value;
        filterJobs();
      });
    });

    // Company filter chips
    companyChips.forEach(chip => {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        companyChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        const href = this.getAttribute('href') || '';
        const comp = href.replace('#', '').trim();
        currentFilter.company = comp;
        filterJobs();

        // Smooth scroll to jobs container
        const targetContainer = document.querySelector('.portal-job-card');
        if (targetContainer) {
          targetContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

    // Save job click handling
    document.addEventListener('click', function (e) {
      const saveBtn = e.target.closest('a[title="Save Job"], a[href="#saved-modal"], .btn-save-job');
      if (saveBtn) {
        e.preventDefault();
        const article = saveBtn.closest('.portal-job-card');
        if (!article) return;

        const title = article.querySelector('h3, h4')?.textContent.trim() || 'Software Engineer';
        const company = article.querySelector('.job-company-identity strong, .company-hire-meta h4')?.textContent.trim() || 
                        article.id.toUpperCase() || 'Tech Partner';
        const location = article.querySelector('.job-detail-pill:nth-child(2) strong, .job-meta-location')?.textContent.trim() || 'San Francisco, CA (Hybrid)';
        const salary = article.querySelector('.job-detail-pill:nth-child(1) strong, .job-meta-salary')?.textContent.trim() || '$135,000 – $180,000';
        const match = article.querySelector('.match-badge, .badge-teal, .badge-blue')?.textContent.trim() || '95% Match';
        const jobId = article.getAttribute('data-job-id') || article.id || title.replace(/\s+/g, '-').toLowerCase();

        const jobObj = {
          id: jobId,
          title: title,
          company: company,
          location: location,
          salary: salary,
          match: match,
          savedAt: new Date().toISOString()
        };

        if (window.CareerNovaPortal) {
          const isSaved = window.CareerNovaPortal.toggleSaveJob(jobObj);
          updateBookmarkButtons();
        }
      }

      // Apply button tracking
      const applyBtn = e.target.closest('a[href*="apply"], .btn-apply-job');
      if (applyBtn && !applyBtn.getAttribute('href').startsWith('http')) {
        const article = applyBtn.closest('.portal-job-card');
        if (article) {
          const title = article.querySelector('h3, h4')?.textContent.trim() || 'Software Engineer';
          const company = article.querySelector('.job-company-identity strong, .company-hire-meta h4')?.textContent.trim() || 'Tech Partner';
          
          if (window.CareerNovaPortal) {
            window.CareerNovaPortal.applyJob({
              id: 'app-' + Date.now(),
              title: title,
              company: company,
              location: 'Remote / Hybrid',
              status: 'Applied',
              appliedDate: 'Just now',
              nextStep: 'Application review in progress'
            });
          }
        }
      }
    });

    // Initial state setup
    updateBookmarkButtons();
  });
})();
