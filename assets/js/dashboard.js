/**
 * NEXORA — Student Dashboard Module
 * Dynamically hydrates overview metrics, readiness gauge, and candidate status.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Read cached state
    try {
      const savedJobs = window.NEXORAPortal ? window.NEXORAPortal.getSavedJobs() : [];
      const apps = window.NEXORAPortal ? window.NEXORAPortal.getApplications() : [];
      const assessment = JSON.parse(localStorage.getItem('nexora-assessment') || 'null');
      const profile = window.NEXORAPortal ? window.NEXORAPortal.getProfile() : null;

      // Update KPI card: Recommended Jobs / Saved
      const kpiJobs = document.querySelector('.grid-4 .kpi-card:nth-child(3) .kpi-val');
      if (kpiJobs && savedJobs.length > 0) {
        // e.g. keep baseline or indicate saved
      }

      // Update Career Readiness score if user completed assessment
      if (assessment && typeof assessment.score === 'number' && assessment.score > 0) {
        const readinessKpi = document.querySelector('.grid-4 .kpi-card:nth-child(2) .kpi-val');
        if (readinessKpi) {
          readinessKpi.textContent = `${assessment.score}%`;
        }

        const circlePct = document.querySelector('.circle-percentage');
        if (circlePct) {
          circlePct.textContent = `${assessment.score}%`;
        }

        const circleVal = document.querySelector('.circle-val');
        if (circleVal) {
          // Circumference is 2 * PI * 45 = 282.74
          const dashoffset = 282.74 * (1 - assessment.score / 100);
          circleVal.style.strokeDashoffset = dashoffset;
        }

        const tierBadge = document.querySelector('.readiness-gauge .badge');
        if (tierBadge) {
          if (assessment.score >= 90) tierBadge.textContent = '⭐ Top 5% Candidate Tier';
          else if (assessment.score >= 80) tierBadge.textContent = '⭐ Top 10% Candidate Tier';
          else if (assessment.score >= 70) tierBadge.textContent = '✓ Verified Benchmark';
          else tierBadge.textContent = 'In Progress Benchmark';
        }
      }

      // Update User Name greeting if present
      if (profile && profile.name) {
        const firstName = profile.firstName || profile.name.split(' ')[0];
        const greeting = document.querySelector('.portal-topbar h3');
        if (greeting) {
          greeting.textContent = `Good morning, ${firstName} 👋`;
        }
      }

      // Update Top Recommendation Banner based on candidate track
      if (profile && profile.targetTrack) {
        const recTitle = document.querySelector('.card h4');
        if (recTitle && recTitle.textContent.includes('Top Recommendation:')) {
          recTitle.textContent = `Top Recommendation: ${profile.targetTrack} Engineer`;
        }
        const recSub = document.querySelector('.card h4 + p');
        if (recSub && profile.skills && profile.skills.length > 0) {
          const topSkills = profile.skills.slice(0, 3).join(', ');
          recSub.textContent = `Based on your chosen ${profile.targetTrack} track and competencies in ${topSkills}. Direct openings active.`;
        }
      }
    } catch (e) {}
  });
})();
