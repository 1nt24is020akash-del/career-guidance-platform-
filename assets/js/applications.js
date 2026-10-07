/**
 * NEXORA — Application Tracking Module
 * Hydrates candidate applications from localStorage,
 * provides live filtering, status tracking, and withdrawal actions.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('table tbody');
    const searchInput = document.querySelector('.portal-topbar input[type="search"]');

    function renderApplications(filterText = '') {
      if (!tableBody) return;

      const apps = window.NEXORAPortal ? window.NEXORAPortal.getApplications() : [];
      const q = filterText.toLowerCase().trim();

      const filtered = apps.filter(app => {
        if (!q) return true;
        return (app.title || '').toLowerCase().includes(q) || 
               (app.company || '').toLowerCase().includes(q) || 
               (app.status || '').toLowerCase().includes(q);
      });

      // Update KPI counters
      updateKpis(apps);

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 3rem 1rem; color: var(--muted);">
              ${apps.length === 0 ? "You haven't submitted any job applications yet." : "No applications found matching your search."}
              <div style="margin-top: 1rem;">
                <a href="job-matches.html" class="btn btn-primary btn-sm">Find Jobs & Apply &rarr;</a>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = filtered.map(app => {
        let badgeClass = 'badge-blue';
        if (app.status === 'Technical Interview') badgeClass = 'badge-teal';
        else if (app.status === 'Offer Extended') badgeClass = 'badge-emerald';
        else if (app.status === 'Under Review') badgeClass = 'badge-amber';

        return `
          <tr style="border-bottom: 1px solid var(--border-subtle);" data-app-id="${app.id}">
            <td style="padding: 1.15rem 1rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-xs); background: var(--bg-card-subtle); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: var(--text-primary); border: 1px solid var(--border-color);">
                  ${app.company ? app.company.substring(0, 2).toUpperCase() : 'TC'}
                </div>
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem; display: block;">${escapeHtml(app.title)}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(app.company)} &bull; ${escapeHtml(app.location || 'Remote')}</span>
                </div>
              </div>
            </td>
            <td style="padding: 1.15rem 1rem; font-size: 0.88rem; color: var(--text-secondary);">
              ${escapeHtml(app.appliedDate || 'Recent')}
            </td>
            <td style="padding: 1.15rem 1rem;">
              <span class="badge ${badgeClass}">${escapeHtml(app.status)}</span>
            </td>
            <td style="padding: 1.15rem 1rem; font-size: 0.88rem; color: var(--text-secondary);">
              ${escapeHtml(app.nextStep || 'Review in progress')}
            </td>
            <td style="padding: 1.15rem 1rem;">
              <button type="button" class="btn btn-outline btn-sm btn-withdraw-app" data-app-id="${app.id}">
                Withdraw
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function updateKpis(apps) {
      const kpiTotal = document.querySelector('.grid-4 .kpi-card:nth-child(1) .kpi-val');
      const kpiReview = document.querySelector('.grid-4 .kpi-card:nth-child(2) .kpi-val');
      const kpiInterview = document.querySelector('.grid-4 .kpi-card:nth-child(3) .kpi-val');
      const kpiOffer = document.querySelector('.grid-4 .kpi-card:nth-child(4) .kpi-val');

      if (kpiTotal) kpiTotal.textContent = apps.length;
      if (kpiReview) kpiReview.textContent = apps.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;
      if (kpiInterview) kpiInterview.textContent = apps.filter(a => a.status === 'Technical Interview').length;
      if (kpiOffer) kpiOffer.textContent = apps.filter(a => a.status === 'Offer Extended').length;
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    // Search filter
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        renderApplications(e.target.value);
      });
    }

    // Withdraw application
    if (tableBody) {
      tableBody.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-withdraw-app');
        if (btn) {
          const appId = btn.getAttribute('data-app-id');
          let apps = window.NEXORAPortal ? window.NEXORAPortal.getApplications() : [];
          apps = apps.filter(a => String(a.id) !== String(appId));
          localStorage.setItem('nexora-applications', JSON.stringify(apps));
          if (window.NEXORAPortal) {
            window.NEXORAPortal.toast('Application withdrawn', 'info');
          }
          renderApplications();
        }
      });
    }

    renderApplications();
  });
})();
