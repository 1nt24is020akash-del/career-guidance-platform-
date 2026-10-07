/**
 * CareerNova — Unified Global Theme Engine
 * Rock-solid persistence across all pages, reloads, and browser sessions
 * Primary key: "careernova-theme" in localStorage
 */

(function () {
  'use strict';

  var THEME_STORAGE_KEY = 'careernova-theme';

  // 1. Synchronous initialization function (runs immediately)
  function initTheme() {
    try {
      var savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  // Execute synchronously
  initTheme();

  // 2. Set theme helper
  function applyTheme(theme) {
    var validTheme = (theme === 'dark') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', validTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    } catch (e) {
      console.warn('LocalStorage unavailable for theme storage:', e);
    }

    // Sync any theme checkbox inputs on page
    var checkboxes = document.querySelectorAll('#theme-toggle, input[type="checkbox"][id*="theme"]');
    checkboxes.forEach(function (cb) {
      cb.checked = (validTheme === 'dark');
    });

    // Update accessible text or aria-labels
    var switches = document.querySelectorAll('.theme-switch, [data-theme-toggle]');
    switches.forEach(function (el) {
      el.setAttribute('aria-label', 'Switch to ' + (validTheme === 'dark' ? 'Light' : 'Dark') + ' Mode');
    });
  }

  // 3. Toggle theme function
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = (current === 'dark') ? 'light' : 'dark';
    applyTheme(next);
  }

  // 4. Attach event listeners on DOM ready
  function setupThemeListeners() {
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme);

    // Click handler for theme switch labels or buttons
    document.addEventListener('click', function (e) {
      var target = e.target;
      var switchBtn = target.closest('.theme-switch, [data-theme-toggle]');
      if (switchBtn) {
        // Prevent default label click if it would cause double toggle with checkbox
        var associatedCheckbox = document.getElementById('theme-toggle');
        if (associatedCheckbox && target.tagName.toLowerCase() !== 'input') {
          e.preventDefault();
        }
        toggleTheme();
      }
    });

    // Change handler on master checkbox if clicked directly
    var masterToggle = document.getElementById('theme-toggle');
    if (masterToggle) {
      masterToggle.addEventListener('change', function () {
        applyTheme(this.checked ? 'dark' : 'light');
      });
    }

    // Listen to storage events from other open tabs
    window.addEventListener('storage', function (e) {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        applyTheme(e.newValue);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeListeners);
  } else {
    setupThemeListeners();
  }

  // Expose global API
  window.CareerNovaTheme = {
    get: function () {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },
    set: applyTheme,
    toggle: toggleTheme
  };

})();
