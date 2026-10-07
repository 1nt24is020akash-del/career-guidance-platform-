/**
 * CareerNova — Unified Student Portal Core Engine
 * Manages dynamic navigation highlights, responsive drawer, notifications,
 * profile sync, and persistent state across all 15 portal pages.
 */

(function () {
  'use strict';

  // Local storage keys
  var STORAGE_KEYS = {
    theme: 'careernova-theme',
    profile: 'careernova-profile',
    savedJobs: 'careernova-saved-jobs',
    applications: 'careernova-applications',
    assessment: 'careernova-assessment',
    roadmap: 'careernova-roadmap',
    notifications: 'careernova-notifications'
  };

  // Safe LocalStorage helpers
  function getStorage(key, defaultValue) {
    try {
      var item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn('Error reading from localStorage key ' + key + ':', e);
      return defaultValue;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Error writing to localStorage key ' + key + ':', e);
    }
  }

  // 1. Initialize default demo data if not yet present in localStorage
  function seedDefaultData() {
    // Saved Jobs defaults
    if (!localStorage.getItem(STORAGE_KEYS.savedJobs)) {
      setStorage(STORAGE_KEYS.savedJobs, [
        {
          id: "google-swe-3",
          company: "Google",
          companyLogo: "G",
          badgeClass: "badge-google",
          jobTitle: "Software Engineer III (Core Systems)",
          location: "Bengaluru, India (Hybrid)",
          salary: "₹38 - 52 LPA",
          matchPercentage: 96,
          workMode: "Hybrid",
          dateSaved: "Oct 5, 2026"
        },
        {
          id: "nvidia-dl-eng",
          company: "NVIDIA",
          companyLogo: "NV",
          badgeClass: "badge-nvidia",
          jobTitle: "Deep Learning Software Engineer",
          location: "Bengaluru / Pune, India",
          salary: "₹42 - 60 LPA",
          matchPercentage: 98,
          workMode: "Hybrid",
          dateSaved: "Oct 5, 2026"
        },
        {
          id: "atlassian-fs-eng",
          company: "Atlassian",
          companyLogo: "ATL",
          badgeClass: "badge-atlassian",
          jobTitle: "Full Stack Engineer (Jira Core)",
          location: "Bengaluru, India (Remote-First)",
          salary: "₹34 - 46 LPA",
          matchPercentage: 95,
          workMode: "Remote",
          dateSaved: "Oct 4, 2026"
        }
      ]);
    }

    // Applications defaults
    if (!localStorage.getItem(STORAGE_KEYS.applications)) {
      setStorage(STORAGE_KEYS.applications, [
        {
          id: "app-1",
          company: "Google",
          companyLogo: "G",
          badgeClass: "badge-google",
          jobTitle: "Software Engineer III",
          location: "Bengaluru",
          appliedDate: "Oct 2, 2026",
          status: "Interview",
          statusClass: "badge-blue",
          nextStep: "Technical Round 2 scheduled for Oct 12"
        },
        {
          id: "app-2",
          company: "Synthetix AI Labs",
          companyLogo: "SYN",
          badgeClass: "badge-teal",
          jobTitle: "Junior ML Engineer",
          location: "San Francisco (Remote)",
          appliedDate: "Oct 4, 2026",
          status: "Under Review",
          statusClass: "badge-amber",
          nextStep: "Portfolio & GitHub code review in progress"
        },
        {
          id: "app-3",
          company: "Microsoft",
          companyLogo: "MS",
          badgeClass: "badge-microsoft",
          jobTitle: "Cloud Solution Architect",
          location: "Hyderabad",
          appliedDate: "Sep 28, 2026",
          status: "Selected",
          statusClass: "badge-emerald",
          nextStep: "Formal offer package dispatched via email"
        },
        {
          id: "app-4",
          company: "Amazon",
          companyLogo: "A",
          badgeClass: "badge-amazon",
          jobTitle: "Software Development Engineer (AWS)",
          location: "Hyderabad",
          appliedDate: "Sep 20, 2026",
          status: "Applied",
          statusClass: "badge-neutral",
          nextStep: "Application submitted and acknowledged"
        }
      ]);
    }

    // Profile defaults
    if (!localStorage.getItem(STORAGE_KEYS.profile)) {
      setStorage(STORAGE_KEYS.profile, {
        name: "Alex Rivera",
        headline: "B.S. Computer Science '26",
        university: "Stanford University",
        gpa: "3.86 / 4.0",
        targetTrack: "AI & Machine Learning Engineering",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
        readinessScore: 88,
        skills: ["Python", "PyTorch", "TypeScript", "React", "PostgreSQL", "Docker", "Algorithms", "Calculus"]
      });
    }

    // Notifications defaults
    if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
      setStorage(STORAGE_KEYS.notifications, [
        {
          id: "notif-1",
          type: "job",
          title: "New 98% Match: Deep Learning Engineer at NVIDIA",
          time: "2 hours ago",
          read: false,
          link: "job-matches.html"
        },
        {
          id: "notif-2",
          type: "assessment",
          title: "Skill Benchmark Verification Cleared: PyTorch Deep Learning (Score: 92%)",
          time: "Yesterday",
          read: false,
          link: "skill-assessment.html"
        },
        {
          id: "notif-3",
          type: "application",
          title: "Application Status Update: Google moved you to Technical Interview Round 2",
          time: "2 days ago",
          read: false,
          link: "applications.html"
        }
      ]);
    }
  }

  // 2. Active Sidebar Navigation Highlight
  function highlightActiveNavigation() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    // Map subpages to their parent sidebar items
    var pageMap = {
      '': 'dashboard.html',
      'dashboard.html': 'dashboard.html',
      'recommendations.html': 'recommendations.html',
      'profile.html': 'profile.html',
      'career-explorer.html': 'career-explorer.html',
      'career-details.html': 'career-explorer.html',
      'ai-assistant.html': 'ai-assistant.html',
      'job-matches.html': 'job-matches.html',
      'job-details.html': 'job-matches.html',
      'skill-assessment.html': 'skill-assessment.html',
      'learning-roadmap.html': 'learning-roadmap.html',
      'resume-builder.html': 'resume-builder.html',
      'saved-jobs.html': 'saved-jobs.html',
      'applications.html': 'applications.html',
      'notifications.html': 'notifications.html',
      'settings.html': 'settings.html'
    };

    var targetHref = pageMap[filename] || filename;

    var sidebarLinks = document.querySelectorAll('.portal-sidebar .sidebar-link, .app-sidebar .sidebar-link');
    sidebarLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // 3. Dynamic Badge Counters in Sidebar & Topbar
  function updateBadgeCounters() {
    // Saved Jobs counter
    var savedJobs = getStorage(STORAGE_KEYS.savedJobs, []);
    var savedCount = savedJobs.length;
    var savedLinks = document.querySelectorAll('a[href="saved-jobs.html"] .sidebar-badge, [data-badge="saved-jobs"]');
    savedLinks.forEach(function (badge) {
      badge.textContent = savedCount;
    });

    // Unread Notifications counter
    var notifications = getStorage(STORAGE_KEYS.notifications, []);
    var unreadCount = notifications.filter(function (n) { return !n.read; }).length;
    var notifLinks = document.querySelectorAll('a[href="notifications.html"] .sidebar-badge, [data-badge="notifications"]');
    notifLinks.forEach(function (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? '' : 'none';
    });

    var topbarNotifDots = document.querySelectorAll('.notification-count');
    topbarNotifDots.forEach(function (dot) {
      dot.style.display = unreadCount > 0 ? 'block' : 'none';
    });

    // Applications counter
    var apps = getStorage(STORAGE_KEYS.applications, []);
    var appCount = apps.length;
    var appLinks = document.querySelectorAll('a[href="applications.html"] .sidebar-badge, [data-badge="applications"]');
    appLinks.forEach(function (badge) {
      badge.textContent = appCount;
    });
  }

  // 4. Mobile Drawer Interactivity
  function setupMobileDrawer() {
    var toggle = document.getElementById('sidebar-toggle');
    var backdrop = document.querySelector('.portal-sidebar-backdrop');

    if (backdrop && toggle) {
      backdrop.addEventListener('click', function () {
        toggle.checked = false;
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle && toggle.checked) {
        toggle.checked = false;
      }
    });

    // Close drawer when any sidebar link is clicked
    var links = document.querySelectorAll('.portal-sidebar a, .app-sidebar a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (toggle && window.innerWidth <= 992) {
          toggle.checked = false;
        }
      });
    });
  }

  // 5. Toast Notification System
  function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;bottom:96px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    var bg = '#1E293B';
    var border = '#334155';
    var icon = 'ℹ️';

    if (type === 'success') {
      bg = '#064E3B';
      border = '#059669';
      icon = '✓';
    } else if (type === 'danger' || type === 'error') {
      bg = '#7F1D1D';
      border = '#DC2626';
      icon = '✕';
    } else if (type === 'primary') {
      bg = '#1E3A8A';
      border = '#2563EB';
      icon = '🚀';
    }

    toast.style.cssText = 'background:' + bg + ';color:#FFFFFF;border:1px solid ' + border + ';border-radius:10px;padding:12px 18px;font-size:0.9rem;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,0.3);display:flex;align-items:center;gap:10px;pointer-events:auto;animation:toastIn 0.25s ease-out;max-width:360px;';
    toast.innerHTML = '<span style="font-size:1.1rem;font-weight:700;">' + icon + '</span><span>' + message + '</span>';

    container.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  // 6. User Profile Card Hydration
  function syncUserProfile() {
    var profile = getStorage(STORAGE_KEYS.profile, null);
    if (!profile) return;

    var nameElements = document.querySelectorAll('.user-mini-name');
    nameElements.forEach(function (el) {
      el.textContent = profile.name || 'Alex Rivera';
    });

    var roleElements = document.querySelectorAll('.user-mini-role');
    roleElements.forEach(function (el) {
      el.textContent = profile.headline || "B.S. Computer Science '26";
    });

    if (profile.avatar) {
      var avatars = document.querySelectorAll('.user-avatar');
      avatars.forEach(function (img) {
        if (img.tagName.toLowerCase() === 'img') {
          img.src = profile.avatar;
          img.alt = profile.name || 'Alex';
        }
      });
    }
  }

  // 7. Mount Floating AI Assistant Button at bottom right corner
  function mountFloatingAiButton() {
    var btn = document.getElementById('floating-ai-btn');
    if (!btn) {
      btn = document.createElement('a');
      btn.href = 'ai-assistant.html';
      btn.className = 'floating-ai-btn';
      btn.id = 'floating-ai-btn';
      btn.setAttribute('aria-label', 'Ask AI Career Assistant');
      btn.setAttribute('title', 'Chat with NovaAdvisor AI');

      btn.innerHTML = [
        '<span class="floating-ai-pulse"></span>',
        '<span class="floating-ai-icon">',
        '  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" fill="rgba(255,255,255,0.95)" stroke="none"/>',
        '    <path d="M19 2L19.8 5.2L23 6L19.8 6.8L19 10L18.2 6.8L15 6L18.2 5.2Z" fill="#38BDF8" stroke="none"/>',
        '  </svg>',
        '</span>',
        '<span class="floating-ai-status" title="NovaAdvisor Active"></span>',
        '<span class="floating-ai-tooltip">Ask Nova AI ✨</span>'
      ].join('');

      document.body.appendChild(btn);
    }

    // If already on ai-assistant.html, clicking focuses chat input
    if (window.location.pathname.includes('ai-assistant.html')) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var chatInp = document.querySelector('.chat-input-container input[type="text"], input[placeholder*="Ask NovaAdvisor"]');
        if (chatInp) {
          chatInp.focus();
          chatInp.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast('NovaAdvisor AI is ready! Type your question.', 'info');
        }
      });
    }
  }

  // 8. Global initialization
  function initPortal() {
    seedDefaultData();
    highlightActiveNavigation();
    updateBadgeCounters();
    setupMobileDrawer();
    syncUserProfile();
    mountFloatingAiButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortal);
  } else {
    initPortal();
  }

  // Expose global CareerNova Portal API
  window.CareerNovaPortal = {
    KEYS: STORAGE_KEYS,
    getStorage: getStorage,
    setStorage: setStorage,
    toast: showToast,
    updateBadges: updateBadgeCounters,
    syncProfile: syncUserProfile,

    getSavedJobs: function () {
      return getStorage(STORAGE_KEYS.savedJobs, []);
    },

    toggleSaveJob: function (jobObjOrId) {
      var saved = getStorage(STORAGE_KEYS.savedJobs, []);
      var id = typeof jobObjOrId === 'object' ? jobObjOrId.id : jobObjOrId;
      var existingIdx = saved.findIndex(function (j) {
        return String(j.id) === String(id) || (typeof jobObjOrId === 'object' && j.title === jobObjOrId.title);
      });

      var isSaved = false;
      if (existingIdx >= 0) {
        saved.splice(existingIdx, 1);
        showToast('Removed from saved jobs', 'info');
        isSaved = false;
      } else {
        var newJob = typeof jobObjOrId === 'object' ? jobObjOrId : { id: id, title: 'Bookmarked Position', savedAt: new Date().toISOString() };
        saved.unshift(newJob);
        showToast('Position bookmarked in your workspace!', 'success');
        isSaved = true;
      }

      setStorage(STORAGE_KEYS.savedJobs, saved);
      updateBadgeCounters();
      return isSaved;
    },

    getApplications: function () {
      return getStorage(STORAGE_KEYS.applications, []);
    },

    applyJob: function (app) {
      var apps = getStorage(STORAGE_KEYS.applications, []);
      var existing = apps.find(function (a) { return String(a.id) === String(app.id) || a.title === app.title; });
      if (!existing) {
        apps.unshift(app);
        setStorage(STORAGE_KEYS.applications, apps);
        updateBadgeCounters();
        showToast('Application submitted for ' + (app.title || 'Role') + '!', 'success');
      } else {
        showToast('Already applied for this position', 'info');
      }
      return apps;
    },

    getProfile: function () {
      return getStorage(STORAGE_KEYS.profile, null);
    },

    getNotifications: function () {
      return getStorage(STORAGE_KEYS.notifications, []);
    }
  };

})();

