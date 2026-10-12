/**
 * NEXORA — Authentication & Session Management Module
 * Handles real-time candidate registration, session authentication,
 * dynamic profile generation based on user input, and clean logout.
 */

(function () {
  'use strict';

  var STORAGE_KEYS = {
    profile: 'nexora-profile',
    user: 'nexora-user',
    session: 'nexora-session',
    resume: 'nexora-resume',
    savedJobs: 'nexora-saved-jobs',
    applications: 'nexora-applications',
    assessment: 'nexora-assessment'
  };

  // Major and skills mapping for dynamic profile tailoring
  var TRACK_SKILLS_MAP = {
    'Software Engineering': ['Python', 'Java', 'Data Structures & Algorithms', 'TypeScript', 'React', 'SQL', 'Git', 'System Design'],
    'AI & Machine Learning': ['Python', 'PyTorch', 'Machine Learning', 'TensorFlow', 'Deep Learning', 'Linear Algebra', 'NumPy', 'Pandas'],
    'Data Science': ['Python', 'SQL', 'Data Analytics', 'Pandas', 'Tableau', 'Statistics', 'Power BI', 'Machine Learning'],
    'Cybersecurity': ['Network Security', 'Linux', 'Ethical Hacking', 'Cryptography', 'SIEM Tools', 'Python', 'TCP/IP', 'Threat Analysis'],
    'Cloud & DevOps': ['AWS Cloud', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Terraform', 'Python', 'Networking'],
    'UI/UX Design': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'CSS/HTML', 'Usability Testing', 'Interaction Design']
  };

  var MAJOR_LABELS = {
    'cs': 'Computer Science & Engineering',
    'ds': 'Data Science & Analytics',
    'it': 'Information Technology',
    'se': 'Software Engineering',
    'me': 'Mechanical Engineering',
    'ee': 'Electrical & Electronics',
    'other': 'Engineering & Technology'
  };

  // Generate initials SVG avatar
  function generateInitialsAvatar(name) {
    var parts = (name || 'Candidate').trim().split(/\s+/);
    var initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<defs><linearGradient id="avGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#06B6D4"/>' +
      '</linearGradient></defs>' +
      '<rect width="100" height="100" rx="50" fill="url(#avGrad)"/>' +
      '<text x="50" y="58" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="38" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">' +
      initials + '</text></svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // 1. Handle Registration
  function initRegistration() {
    var form = document.querySelector('form[action="dashboard.html"]');
    if (!form || !window.location.pathname.includes('register.html')) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstName = (document.getElementById('first_name')?.value || '').trim();
      var lastName = (document.getElementById('last_name')?.value || '').trim();
      var fullName = (firstName + ' ' + lastName).trim() || 'Candidate User';
      var email = (document.getElementById('reg_email')?.value || '').trim();
      var degreeVal = document.getElementById('degree')?.value || 'cs';
      var gradYear = document.getElementById('grad_year')?.value || '2026';
      var universityInput = document.getElementById('reg_university')?.value || '';
      var password = document.getElementById('reg_password')?.value || '';

      // Collect selected tracks
      var selectedTracks = [];
      document.querySelectorAll('.pill-filter-item input[type="checkbox"]:checked').forEach(function (cb) {
        var label = cb.closest('.pill-filter-item')?.querySelector('label')?.textContent;
        if (label) selectedTracks.push(label.trim());
      });

      if (selectedTracks.length === 0) {
        selectedTracks = ['Software Engineering'];
      }

      var majorTitle = MAJOR_LABELS[degreeVal] || 'Computer Science & Engineering';
      var headline = 'B.S. ' + majorTitle + " '" + (gradYear === 'graduated' ? 'Alumni' : gradYear.slice(-2));
      var targetTrack = selectedTracks[0] || 'Software Engineering';

      // Pick skills corresponding to chosen track
      var initialSkills = TRACK_SKILLS_MAP[targetTrack] || TRACK_SKILLS_MAP['Software Engineering'];

      // Build profile object
      var profileData = {
        name: fullName,
        firstName: firstName || fullName.split(' ')[0],
        lastName: lastName || '',
        email: email,
        headline: headline,
        university: universityInput.trim() || 'Stanford University',
        degree: majorTitle,
        gradYear: gradYear,
        gpa: '3.82 / 4.0',
        targetTrack: targetTrack,
        selectedTracks: selectedTracks,
        avatar: generateInitialsAvatar(fullName),
        readinessScore: 84,
        skills: initialSkills,
        registeredAt: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileData));
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify({
        email: email,
        name: fullName,
        registeredAt: new Date().toISOString()
      }));
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({
        loggedIn: true,
        email: email,
        name: fullName,
        loginTime: new Date().toISOString()
      }));

      // Give immediate feedback
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Setting Up Your Workspace &rarr;</span>';
      }

      if (window.NEXORAPortal && window.NEXORAPortal.toast) {
        window.NEXORAPortal.toast('Account registered for ' + fullName + '! Loading dashboard...', 'success');
      }

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 400);
    });
  }

  // 2. Handle Login
  function initLogin() {
    if (!window.location.pathname.includes('login.html')) return;

    // Check for logout banner in URL
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true') {
      var banner = document.getElementById('logout-banner');
      if (!banner) {
        var card = document.querySelector('.card');
        if (card) {
          banner = document.createElement('div');
          banner.id = 'logout-banner';
          banner.style.cssText = 'background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); color: #10B981; padding: 0.85rem 1.25rem; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.65rem;';
          banner.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg><span>You have been signed out successfully.</span>';
          card.parentNode.insertBefore(banner, card);
        }
      }
    }

    var form = document.querySelector('form[action="dashboard.html"]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = document.getElementById('email')?.value || '';
      var existingProfile = null;
      try {
        existingProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || 'null');
      } catch (err) {}

      var userName = existingProfile && existingProfile.name ? existingProfile.name : 'Alex Rivera';

      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({
        loggedIn: true,
        email: emailInput || 'alex.rivera@stanford.edu',
        name: userName,
        loginTime: new Date().toISOString()
      }));

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Signing In &rarr;</span>';
      }

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 350);
    });
  }

  // 3. Global Logout Action Handler
  function handleLogout(e) {
    if (e) e.preventDefault();

    try {
      localStorage.removeItem(STORAGE_KEYS.session);
    } catch (err) {}

    if (window.NEXORAPortal && window.NEXORAPortal.toast) {
      window.NEXORAPortal.toast('Signing out of NEXORA...', 'info');
    }

    setTimeout(function () {
      window.location.href = 'login.html?logout=true';
    }, 350);
  }

  // Attach global click listener for logout buttons
  document.addEventListener('click', function (e) {
    var logoutTrigger = e.target.closest('.action-logout-btn, .sidebar-logout-btn, #logout-btn');
    if (logoutTrigger) {
      handleLogout(e);
    }
  });

  // Export
  window.NEXORAAuth = {
    logout: handleLogout,
    getSession: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
      } catch (e) { return null; }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initRegistration();
      initLogin();
    });
  } else {
    initRegistration();
    initLogin();
  }
})();
