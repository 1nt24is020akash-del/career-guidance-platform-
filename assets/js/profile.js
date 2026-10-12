/**
 * NEXORA — Candidate Profile & Resume Management Engine
 * Handles dynamic profile hydration, real-time editing,
 * file resume uploads (PDF/DOCX/TXT) with live analysis, and synchronization.
 */

(function () {
  'use strict';

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  document.addEventListener('DOMContentLoaded', function () {
    // DOM Targets
    var editForm = document.querySelector('#edit-form form');
    var profileBannerName = document.querySelector('.portal-content h2');
    var profileBannerSub = document.querySelector('.portal-content .card p');
    var profileBannerAvatar = document.querySelector('.portal-content .card img');
    var profileBannerTrack = document.querySelector('.portal-content .card .badge-blue');

    var inputFullName = document.getElementById('p_full_name');
    var inputEmail = document.getElementById('p_email');
    var inputCollege = document.getElementById('p_college');
    var inputDegree = document.getElementById('p_degree');
    var inputGrad = document.getElementById('p_grad');
    var inputLocation = document.getElementById('p_location');
    var inputBio = document.getElementById('p_bio');

    // Resume elements
    var dropzone = document.getElementById('resume-dropzone');
    var fileInput = document.getElementById('resume-file-input');
    var progressWrap = document.getElementById('resume-progress-wrap');
    var progressFill = document.getElementById('resume-progress-fill');
    var progressPct = document.getElementById('resume-progress-pct');
    var progressLabel = document.getElementById('resume-status-label');
    var activeCard = document.getElementById('resume-active-card');
    var cardFileName = document.getElementById('resume-card-name');
    var cardFileMeta = document.getElementById('resume-card-meta');
    var replaceBtn = document.getElementById('resume-replace-btn');

    // 1. Hydrate Profile Data from LocalStorage
    var profile = null;
    try {
      profile = JSON.parse(localStorage.getItem('nexora-profile') || 'null');
    } catch (e) {}

    if (profile) {
      if (profileBannerName && profile.name) {
        profileBannerName.textContent = profile.name;
      }
      if (profileBannerSub) {
        var uni = profile.university || 'Stanford University';
        var deg = profile.degree || profile.headline || 'B.S. in Computer Science';
        var grad = profile.gradYear || '2026';
        profileBannerSub.textContent = (profile.location || 'San Francisco Bay Area, CA') + ' • ' + uni + ' • ' + deg + ' (Class of ' + grad + ')';
      }
      if (profileBannerAvatar && profile.avatar) {
        profileBannerAvatar.src = profile.avatar;
        profileBannerAvatar.alt = profile.name || 'Candidate';
      }
      if (profileBannerTrack && profile.targetTrack) {
        profileBannerTrack.textContent = profile.targetTrack + ' Track';
      }

      // Populate form fields
      if (inputFullName && profile.name) inputFullName.value = profile.name;
      if (inputEmail && profile.email) inputEmail.value = profile.email;
      if (inputCollege && profile.university) inputCollege.value = profile.university;
      if (inputDegree && (profile.degree || profile.headline)) inputDegree.value = profile.degree || profile.headline;
      if (inputLocation && profile.location) inputLocation.value = profile.location;
      if (inputBio && profile.bio) inputBio.value = profile.bio;

      if (inputGrad && profile.gradYear) {
        Array.from(inputGrad.options).forEach(function (opt) {
          if (opt.value === profile.gradYear) opt.selected = true;
        });
      }
    }

    // 2. Hydrate Existing Resume Document State
    var savedResume = null;
    try {
      savedResume = JSON.parse(localStorage.getItem('nexora-resume') || 'null');
    } catch (e) {}

    function renderResumeState(resume) {
      if (resume && resume.fileName && activeCard && dropzone) {
        cardFileName.textContent = resume.fileName;
        cardFileMeta.textContent = (resume.fileSize || '1.8 MB') + ' • Uploaded on ' + (resume.uploadDate || 'Recently') + ' • ' + (resume.status || 'Verified & Active');
        activeCard.style.display = 'flex';
        dropzone.style.display = 'none';
        if (progressWrap) progressWrap.style.display = 'none';
      } else if (activeCard && dropzone) {
        activeCard.style.display = 'none';
        dropzone.style.display = 'block';
      }
    }

    renderResumeState(savedResume);

    // 3. Process Resume File Upload
    function processFileUpload(file) {
      if (!file) return;

      var validExts = ['.pdf', '.doc', '.docx', '.txt'];
      var fileName = file.name || 'resume.pdf';
      var ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

      if (!validExts.includes(ext) && file.type !== 'application/pdf') {
        if (window.NEXORAPortal) {
          window.NEXORAPortal.toast('Please select a valid PDF, DOCX, or TXT file', 'error');
        }
        return;
      }

      // Show Progress Bar
      if (progressWrap) {
        progressWrap.style.display = 'block';
        progressFill.style.width = '0%';
        progressPct.textContent = '0%';
        progressLabel.textContent = 'Uploading ' + fileName + '...';
      }

      var progress = 0;
      var interval = setInterval(function () {
        progress += 25;
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPct) progressPct.textContent = progress + '%';

        if (progress === 50 && progressLabel) {
          progressLabel.textContent = 'NovaAdvisor AI scanning competencies & structure...';
        }

        if (progress >= 100) {
          clearInterval(interval);

          var resumeData = {
            fileName: fileName,
            fileSize: formatBytes(file.size),
            uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Verified & Active'
          };

          localStorage.setItem('nexora-resume', JSON.stringify(resumeData));

          // Also boost user profile readiness score
          var prof = JSON.parse(localStorage.getItem('nexora-profile') || '{}');
          if (prof) {
            prof.resumeUploaded = true;
            prof.readinessScore = Math.min(96, (prof.readinessScore || 80) + 5);
            localStorage.setItem('nexora-profile', JSON.stringify(prof));
          }

          renderResumeState(resumeData);

          if (window.NEXORAPortal) {
            window.NEXORAPortal.toast('Resume "' + fileName + '" uploaded and verified successfully!', 'success');
          }
        }
      }, 150);
    }

    // Attach File Input Listener
    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
          processFileUpload(e.target.files[0]);
        }
      });
    }

    // Drag and drop listeners on dropzone
    if (dropzone) {
      ['dragenter', 'dragover'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('drag-active');
          dropzone.style.borderColor = 'var(--primary)';
          dropzone.style.background = 'var(--primary-subtle)';
        });
      });

      ['dragleave', 'drop'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('drag-active');
          dropzone.style.borderColor = '';
          dropzone.style.background = '';
        });
      });

      dropzone.addEventListener('drop', function (e) {
        var dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          processFileUpload(dt.files[0]);
        }
      });
    }

    // Replace Resume Button Listener
    if (replaceBtn && fileInput) {
      replaceBtn.addEventListener('click', function () {
        if (activeCard) activeCard.style.display = 'none';
        if (dropzone) dropzone.style.display = 'block';
        fileInput.click();
      });
    }

    // 4. Handle Edit Profile Form Submit
    if (editForm) {
      editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var updated = JSON.parse(localStorage.getItem('nexora-profile') || '{}');
        if (inputFullName) updated.name = inputFullName.value.trim();
        if (inputEmail) updated.email = inputEmail.value.trim();
        if (inputCollege) updated.university = inputCollege.value.trim();
        if (inputDegree) {
          updated.degree = inputDegree.value.trim();
          updated.headline = inputDegree.value.trim();
        }
        if (inputLocation) updated.location = inputLocation.value.trim();
        if (inputBio) updated.bio = inputBio.value.trim();
        if (inputGrad) updated.gradYear = inputGrad.value;

        localStorage.setItem('nexora-profile', JSON.stringify(updated));

        // Update real-time DOM
        if (profileBannerName && updated.name) {
          profileBannerName.textContent = updated.name;
        }
        if (profileBannerSub) {
          var uni = updated.university || 'Stanford University';
          var deg = updated.degree || 'B.S. in Computer Science';
          var grad = updated.gradYear || '2026';
          profileBannerSub.textContent = (updated.location || 'San Francisco Bay Area, CA') + ' • ' + uni + ' • ' + deg + ' (Class of ' + grad + ')';
        }

        // Sync with global portal
        if (window.NEXORAPortal && window.NEXORAPortal.syncProfile) {
          window.NEXORAPortal.syncProfile();
          window.NEXORAPortal.toast('Candidate profile updated successfully!', 'success');
        }
      });
    }
  });
})();
