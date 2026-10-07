/**
 * NEXORA — Saved Jobs Module
 * Manages rendering of bookmarked jobs from localStorage,
 * provides removal actions, empty state handling, and filter tabs.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const listContainer = document.querySelector('.portal-content > div[style*="flex-direction: column"]');
    const filterRadios = document.querySelectorAll('input[name="saved-filter"]');
    const countPills = document.querySelectorAll('.pill-filter-group label, .portal-topbar h3');

    function renderSavedJobs(filter = 'all') {
      if (!listContainer) return;

      const savedJobs = window.NEXORAPortal ? window.NEXORAPortal.getSavedJobs() : [];

      // Filter
      let displayed = savedJobs;
      if (filter === 'high') {
        displayed = savedJobs.filter(j => {
          const matchNum = parseInt((j.match || '').replace(/\D/g, ''), 10) || 0;
          return matchNum >= 90;
        });
      } else if (filter === 'remote') {
        displayed = savedJobs.filter(j => (j.location || '').toLowerCase().includes('remote'));
      }

      // Empty State
      if (displayed.length === 0) {
        listContainer.innerHTML = `
          <div class="card empty-state" style="text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
            <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--bg-card-subtle); color: var(--muted); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </div>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--text);">No Saved Jobs Found</h3>
            <p style="color: var(--muted); font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem auto;">
              ${savedJobs.length === 0 ? "You haven't bookmarked any opportunities yet. Browse top enterprise roles to save and track deadlines." : "No saved jobs match this specific filter criteria."}
            </p>
            <a href="job-matches.html" class="btn btn-primary" style="padding: 0.75rem 1.75rem;">
              Explore Tech Opportunities &rarr;
            </a>
          </div>
        `;
        return;
      }

      // Render Cards
      listContainer.innerHTML = displayed.map(job => {
        const logo = job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80';
        return `
          <div class="card card-hover" style="padding: 1.5rem;" data-job-id="${job.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.85rem;">
              <div style="display: flex; gap: 1.25rem; align-items: center;">
                <img src="${logo}" alt="${job.company}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-color);" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'">
                <div>
                  <h4 style="margin-bottom: 0.2rem;"><a href="job-details.html">${escapeHtml(job.title)}</a></h4>
                  <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <strong style="color: var(--text-primary);">${escapeHtml(job.company)}</strong>
                    <span>&bull;</span>
                    <span>${escapeHtml(job.location)}</span>
                    <span>&bull;</span>
                    <span style="color: var(--primary-accent); font-weight: 600;">${escapeHtml(job.salary)}</span>
                  </div>
                </div>
              </div>

              <span class="badge badge-blue" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">${escapeHtml(job.match || '95% Match')}</span>
            </div>

            <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem; color: var(--text-secondary);">
              Direct opening matching your validated technical assessment scores and profile credentials.
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
              <span style="font-size: 0.82rem; color: var(--text-muted);">Saved in portal &bull; Application window active</span>
              <div style="display: flex; gap: 0.75rem;">
                <button type="button" class="btn btn-outline btn-sm btn-remove-saved" data-job-id="${job.id}">Remove</button>
                <a href="job-details.html" class="btn btn-secondary btn-sm">View Details</a>
                <button type="button" class="btn btn-primary btn-sm btn-apply-saved" data-job-id="${job.id}">Apply Now</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    // Filter listeners
    filterRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.id === 'sf-high') renderSavedJobs('high');
        else if (this.id === 'sf-remote') renderSavedJobs('remote');
        else renderSavedJobs('all');
      });
    });

    // Remove & Apply actions
    if (listContainer) {
      listContainer.addEventListener('click', function (e) {
        const removeBtn = e.target.closest('.btn-remove-saved');
        if (removeBtn) {
          const jobId = removeBtn.getAttribute('data-job-id');
          if (window.NEXORAPortal) {
            window.NEXORAPortal.toggleSaveJob(jobId);
            renderSavedJobs();
          }
          return;
        }

        const applyBtn = e.target.closest('.btn-apply-saved');
        if (applyBtn) {
          const jobId = applyBtn.getAttribute('data-job-id');
          const savedJobs = window.NEXORAPortal ? window.NEXORAPortal.getSavedJobs() : [];
          const job = savedJobs.find(j => String(j.id) === String(jobId));
          if (job && window.NEXORAPortal) {
            window.NEXORAPortal.applyJob({
              id: 'app-' + Date.now(),
              title: job.title,
              company: job.company,
              location: job.location,
              status: 'Applied',
              appliedDate: 'Today',
              nextStep: 'Application under review'
            });
            applyBtn.textContent = '✓ Applied';
            applyBtn.classList.remove('btn-primary');
            applyBtn.classList.add('btn-secondary');
            applyBtn.disabled = true;
          }
        }
      });
    }

    // Initial render
    renderSavedJobs('all');
  });
})();
