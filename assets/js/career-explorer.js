/**
 * CareerNova — Career Explorer Module
 * Real-time career path filtering, search, and category switching.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const searchInputs = document.querySelectorAll('.portal-topbar input[type="search"], .portal-content input[type="search"]');
    const filterRadios = document.querySelectorAll('input[name="career-pill"]');
    const industrySelect = document.querySelector('.portal-content select');
    const careerCards = document.querySelectorAll('.portal-content .card.card-hover, .portal-content article, .portal-content .grid-3 > div, .portal-content .grid-2 > div');
    const countDisplay = document.querySelector('.portal-content h1 + p');

    let currentQuery = '';
    let currentCategory = 'all';

    function filterCareers() {
      const q = currentQuery.toLowerCase().trim();
      let visible = 0;

      careerCards.forEach(card => {
        // Skip non-career cards (like search box itself)
        if (card.querySelector('form') || card.closest('form')) return;

        const text = card.textContent.toLowerCase();
        let matchesQ = !q || text.includes(q);
        let matchesCat = true;

        if (currentCategory === 'ai') {
          matchesCat = text.includes('ai') || text.includes('machine learning') || text.includes('data science');
        } else if (currentCategory === 'fullstack' || currentCategory === 'se') {
          matchesCat = text.includes('full-stack') || text.includes('frontend') || text.includes('backend') || text.includes('software');
        } else if (currentCategory === 'cloud') {
          matchesCat = text.includes('cloud') || text.includes('devops') || text.includes('infrastructure') || text.includes('aws');
        } else if (currentCategory === 'security' || currentCategory === 'cyber') {
          matchesCat = text.includes('cyber') || text.includes('security') || text.includes('defense');
        }

        if (matchesQ && matchesCat) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Search inputs
    searchInputs.forEach(input => {
      input.addEventListener('input', function (e) {
        currentQuery = e.target.value;
        filterCareers();
      });
    });

    // Pill filters
    filterRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.id === 'cf-ai') currentCategory = 'ai';
        else if (this.id === 'cf-fullstack') currentCategory = 'fullstack';
        else if (this.id === 'cf-cloud') currentCategory = 'cloud';
        else if (this.id === 'cf-security') currentCategory = 'security';
        else currentCategory = 'all';
        filterCareers();
      });
    });

    // Industry dropdown
    if (industrySelect) {
      industrySelect.addEventListener('change', function () {
        currentCategory = this.value;
        filterCareers();
      });
    }
  });
})();
