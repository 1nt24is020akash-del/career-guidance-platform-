# 🚀 CareerNova — Career Guidance & Job Matching Platform
## Complete Pure HTML5 & CSS3 SaaS Redesign with Light/Dark Theme Switching

A complete, production-quality, modern, visually stunning, and highly usable **Career Guidance & Job Matching Platform** built from scratch for students, career seekers, university advisors, and technical recruiters.

Designed with a clean, high-end modern SaaS aesthetic featuring a **default Light Mode** (`#F5F7FB` background, crisp white cards, refined Royal Blue `#2563EB` and Modern Teal `#0D9488` accents) and an instant **CSS-Only Dark Mode** (`#101827` background, refined navy slate cards `#1D2A40`, soft glow highlights).

---

## 🚨 Strict Technology Compliance

This entire platform adheres strictly to the **100% Pure HTML5 and CSS3** mandate:

- **HTML5:** All page semantic layouts, native forms, validation attributes, accessible controls, and native `<details>`/`<summary>` accordions.
- **CSS3:** All design tokens, CSS Grid & Flexbox architectures, CSS transitions, keyframe animations, CSS-only theme switching, and print stylesheets.
- ❌ **No JavaScript**
- ❌ **No TypeScript**
- ❌ **No React / Vue / Angular**
- ❌ **No Bootstrap / Tailwind CSS**
- ❌ **No jQuery**
- ❌ **No Backend or Database**
- ❌ **No External Component Libraries or JS Animation Scripts**

All interactive experiences (theme toggle, mobile navigation drawer, multi-track roadmap tabs, test simulation stepper, filter chips, range sliders, progress rings, and file dropzones) are engineered exclusively with native HTML5 and CSS3 techniques.

---

## 🌓 CSS-Only Light & Dark Theme Architecture

Theme switching is achieved without a single line of JavaScript using the CSS `:has()` pseudo-class and sibling selectors:

1. **Checkbox Anchor:** A native checkbox (`#theme-toggle`) is placed at the start of each page `<body>`.
2. **Instant Dynamic Variable Swapping:**
   ```css
   /* Light Mode Tokens (Default) */
   :root {
     --bg-main: #F5F7FB;
     --bg-card: #FFFFFF;
     --text-primary: #172033;
     --text-secondary: #65728A;
     --primary-accent: #2563EB;
     --secondary-accent: #0D9488;
     --border-color: #E2E8F0;
   }

   /* Dark Mode Overrides (CSS-Only) */
   body:has(#theme-toggle:checked),
   #theme-toggle:checked ~ .page-wrapper {
     --bg-main: #101827;
     --bg-card: #1D2A40;
     --bg-card-subtle: #172235;
     --text-primary: #F8FAFC;
     --text-secondary: #A8B4C7;
     --primary-accent: #60A5FA;
     --secondary-accent: #2DD4BF;
     --border-color: #334155;
   }
   ```
3. **Interactive Toggle Switch:** A styled `<label for="theme-toggle" class="theme-switch">` contains Sun and Moon SVG icons that seamlessly swap visibility depending on the checked state.

---

## 🎨 Design System & Color Tokens

| Token | Light Mode (Default) | Dark Mode | Role |
| :--- | :--- | :--- | :--- |
| `--bg-main` | `#F5F7FB` | `#101827` | Primary canvas background |
| `--bg-card` | `#FFFFFF` | `#1D2A40` | Card & surface containers |
| `--bg-card-subtle` | `#F8FAFC` | `#172235` | Secondary surface / subtle cards |
| `--text-primary` | `#172033` | `#F8FAFC` | High-contrast headers & text |
| `--text-secondary` | `#65728A` | `#A8B4C7` | Body text & subtitles |
| `--text-muted` | `#94A3B8` | `#64748B` | Captions & metadata |
| `--primary-accent` | `#2563EB` | `#60A5FA` | Primary Royal Blue accent |
| `--secondary-accent`| `#0D9488` | `#2DD4BF` | Modern Teal highlight |
| `--border-color` | `#E2E8F0` | `#334155` | Borders & dividers |
| `--success` | `#16A34A` | `#34D399` | Verification & positive badges |
| `--warning` | `#D97706` | `#FBBF24` | Review status & caution |
| `--error / --rose` | `#DC2626` | `#F43F5E` | Urgency & unread alerts |

### Typography
- **Primary Body Font:** `Plus Jakarta Sans` (300, 400, 500, 600, 700, 800)
- **Headings & Display:** `Space Grotesk` (500, 600, 700)
- **Code & Snippets:** `JetBrains Mono` (400, 500, 600)

---

## 🗂️ Complete Platform Page Catalog (18 Full Pages)

Every single navigation link and internal page reference connects to a real, fully realized HTML page:

```
career-guidance-platform/
│
├── index.html                  # Homepage (Hero with metrics, Benefits, Careers, Jobs, AI preview, Testimonials, FAQ)
├── dashboard.html              # Comprehensive Student Dashboard (Readiness Gauge, KPI Cards, Matches, Activity feed)
├── career-explorer.html        # Career Discovery Hub with category filters & Side-by-Side Comparison Matrix
├── career-details.html         # In-depth profile for AI/ML Engineer (Compensation, Responsibilities, Roadmap preview)
├── job-matches.html            # Recruitment matching feed with multi-criteria sidebar filters & 4+ rich job cards
├── job-details.html            # Dedicated job specs (Synthetix AI) with company overview & application form
├── saved-jobs.html             # Saved jobs repository with bookmark filters & direct apply CTAs
├── applications.html           # Full application tracking portal with pipeline stages (Applied, Screen, Interview, Offer)
├── ai-assistant.html           # Conversational AI Career Assistant (Split chat feed, prompts, and insights panel)
├── skill-assessment.html       # Skill Assessment Catalog with difficulty, questions, and duration
├── assessment-demo.html        # Interactive test simulator with timer, question stepper, code snippets & palette
├── learning-roadmap.html       # Personalized Learning Roadmaps with CSS-only 5-track tabs & milestone spine
├── resume-builder.html         # Dual-pane resume editor & live paper preview (Print stylesheet ready)
├── profile.html                # Candidate profile management (Personal info form, skills, projects, certifications)
├── notifications.html          # Notification Center with categorized alerts, unread status & quick actions
├── settings.html               # Account credentials, privacy toggles, alert preferences & theme chooser
├── about.html                  # Mission, architectural achievements, leadership team & platform overview
├── login.html                  # Standalone sign-in portal with validation & social login buttons
├── register.html               # Student onboarding form with career interest chips & academic degree selector
│
├── css/
│   ├── variables.css           # Complete CSS variables for Light & Dark modes, radius, transitions, shadows
│   ├── style.css               # Base CSS reset, typography, layout container, buttons, footer
│   ├── navbar.css              # Spacious responsive navbar, theme toggle switch, mobile hamburger drawer
│   ├── components.css          # Cards, badges, KPI metric boxes, progress bars, details accordions
│   ├── forms.css               # Form controls, select wraps, custom switches, filter chips, file dropzone
│   ├── dashboard.css           # Portal layout, sidebar menu, topbar, circular gauge, activity timeline
│   ├── animations.css          # Keyframe animations (pulse, shimmer, gentle float)
│   ├── responsive.css          # Media queries (1200px, 992px, 768px, 480px) for fluid layout responsiveness
│   └── print.css               # Monochrome print stylesheet for clean paper resume export (Ctrl + P)
│
└── README.md                   # Complete system documentation
```

---

## 💡 Pure HTML5 & CSS3 Interactive Implementations

Because JavaScript is strictly prohibited, the following advanced native web patterns were implemented:

1. **CSS-Only Theme Switching:**
   Uses `#theme-toggle:checked` and `:has()` pseudo-class to instantaneously restyle all components.
2. **CSS-Only Responsive Navigation Drawer:**
   Uses `#nav-toggle:checked` and sibling selectors to trigger mobile drawer visibility smoothly.
3. **Pure CSS Tab Switching:**
   Uses hidden radio inputs (`#tab-fs`, `#tab-ai`, `#tab-ds`, `#tab-cyber`, `#tab-cloud`) to show/hide respective roadmaps without page reloads.
4. **Circular Readiness Gauge:**
   SVG circle element styled with CSS `stroke-dasharray` and `stroke-dashoffset` to render student career readiness.
5. **Interactive Accordion FAQ:**
   Native HTML5 `<details>` and `<summary>` elements with smooth CSS rotational markers.
6. **Live Resume Paper Sheet & Print Engine:**
   Realistic white sheet preview on screen, automatically converted to a crisp monochrome document on `Ctrl + P` / `Cmd + P` via `@media print`.

---

## 🚀 How to Run the Platform Locally

No build step, Node.js compilation, or external server is required:

### Option 1: Direct File Open
Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Option 2: Local HTTP Server (Python)
Run the built-in HTTP server:
```bash
cd career-guidance-platform
python -m http.server 8080
```
Then visit:
**`http://localhost:8080/`**

---

## 📜 Prototype Disclosure Notice

All career statistics, compensation bands, assessment test evaluations, and AI advisory dialogues are illustrative prototype demonstrations constructed with pure HTML5 and CSS3 to showcase modern career-tech SaaS architecture.
