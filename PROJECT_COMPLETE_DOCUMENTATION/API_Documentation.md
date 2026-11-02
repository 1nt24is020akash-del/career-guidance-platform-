# NEXORA API Specification and Interface Documentation

## 1. Executive Architectural Overview

In the current client-side serverless deployment of NEXORA, application programming interfaces (APIs) are organized into two high-performance, contractually bound programmatic layers:

1. **Client-Side Core Engine JavaScript APIs:** Global object interfaces mounted on the browser's `window` runtime (`window.NEXORAAuth` and `window.NEXORAPortal`). These modular singletons handle state orchestration, cross-view messaging, validation, and storage synchronization.
2. **Phase 2 Enterprise RESTful HTTP Microservice Contracts:** The canonical REST specifications mapping each client engine method directly to an enterprise backend endpoint (Node.js/Express, Python FastAPI, or Go), complete with JSON request/response structures, HTTP status codes, and JWT security headers.

---

## 2. Client-Side JavaScript Engine APIs

### 2.1. Authentication Controller API (`window.NEXORAAuth`)
Defined in [`assets/js/auth.js`](file:///C:/Users/Admin/.gemini/antigravity/scratch/career-guidance-platform/assets/js/auth.js).

#### 2.1.1. `register(userData)`
Registers a new candidate, initializes personalized skill tags based on chosen career track, persists the record, and bootstraps the session.
- **Parameters:**
  - `userData` (Object, required):
    - `firstName` (string, required): Candidate's first name.
    - `lastName` (string, optional): Candidate's last name.
    - `email` (string, required): Valid user email.
    - `password` (string, required): User password (min 8 chars).
    - `degreeVal` (string, optional): Academic degree key (e.g. `'cs'`, `'ds'`, `'se'`).
    - `gradYear` (string, optional): Graduation year (e.g. `'2026'`).
    - `university` (string, optional): University name.
    - `selectedTracks` (Array\<string\>, optional): Chosen career tracks (e.g. `['AI & Machine Learning']`).
- **Returns:** `{ success: boolean, profile: Object, message: string }`
- **Side Effects:** Writes to `nexora-user`, `nexora-session`, and `nexora-profile`.

#### 2.1.2. `login(email, password)`
Authenticates user credentials against the local registry.
- **Parameters:**
  - `email` (string, required): Registered user email.
  - `password` (string, required): User password.
- **Returns:** `{ success: boolean, user: Object|null, error?: string }`
- **Side Effects:** Sets `nexora-session` on success.

#### 2.1.3. `logout()`
Terminates the current session, cleans authentication flags, and redirects to `login.html?logout=true`.
- **Parameters:** None.
- **Returns:** `void`
- **Side Effects:** Clears `nexora-session`, updates UI state.

#### 2.1.4. `getCurrentUser()`
Retrieves the currently authenticated session record.
- **Returns:** `Object | null`

#### 2.1.5. `isAuthenticated()`
Checks if a valid, non-expired session is active.
- **Returns:** `boolean`

#### 2.1.6. `requireAuth(redirectUrl)`
Route guard that checks session presence and immediately redirects unauthenticated visitors to `login.html`.
- **Parameters:** `redirectUrl` (string, optional): Fallback page (defaults to `'login.html'`).

---

### 2.2. Portal Core Platform API (`window.NEXORAPortal`)
Defined in [`assets/js/portal.js`](file:///C:/Users/Admin/.gemini/antigravity/scratch/career-guidance-platform/assets/js/portal.js).

#### 2.2.1. `init()`
Initializes storage defaults, hydrates user UI elements (name, avatar, greetings, notifications), attaches global event listeners, and highlights the active navigation menu item.
- **Returns:** `void`

#### 2.2.2. `getProfile()`
Retrieves the candidate profile object from `nexora-profile`.
- **Returns:** `CandidateProfileObject`

#### 2.2.3. `saveProfile(data)`
Merges provided updates into the existing candidate profile and triggers UI synchronization across the DOM.
- **Parameters:** `data` (Object, required): Fields to update (`name`, `gpa`, `skills`, `targetTrack`, etc.).
- **Returns:** `CandidateProfileObject`

#### 2.2.4. `getSavedJobs()`
Fetches the array of all bookmarked jobs.
- **Returns:** `Array<JobObject>`

#### 2.2.5. `toggleSaveJob(jobId)`
Toggles the bookmark status of a specific job by ID.
- **Parameters:** `jobId` (string, required): e.g. `'google-swe-3'`.
- **Returns:** `{ saved: boolean, count: number }`

#### 2.2.6. `isJobSaved(jobId)`
Checks if a job is in the saved catalog.
- **Parameters:** `jobId` (string, required)
- **Returns:** `boolean`

#### 2.2.7. `getApplications()`
Returns all active job applications in the user's pipeline.
- **Returns:** `Array<ApplicationObject>`

#### 2.2.8. `applyForJob(jobId, jobData)`
Adds a job to the applications pipeline with an initial status of `'Applied'` and generates a system notification.
- **Parameters:**
  - `jobId` (string, required)
  - `jobData` (Object, optional): Custom application metadata.
- **Returns:** `{ success: boolean, application: ApplicationObject }`

#### 2.2.9. `updateApplicationStatus(applicationId, newStatus)`
Transitions an application through Kanban workflow stages (`'Applied'`, `'Under Review'`, `'Interview'`, `'Selected'`, `'Rejected'`).
- **Parameters:**
  - `applicationId` (string, required)
  - `newStatus` (string, required)
- **Returns:** `ApplicationObject`

#### 2.2.10. `getNotifications()`
Fetches all candidate notifications.
- **Returns:** `Array<NotificationObject>`

#### 2.2.11. `markNotificationRead(notificationId)`
Sets the `read` flag to `true` for a given notification and decrements the unread badge counter in the topbar.
- **Parameters:** `notificationId` (string, required)
- **Returns:** `void`

#### 2.2.12. `clearAllNotifications()`
Clears all notifications from storage and updates DOM badges to 0.
- **Returns:** `void`

#### 2.2.13. `getResumeData()`
Retrieves the active uploaded resume metadata from `nexora-resume`.
- **Returns:** `ResumeMetadataObject | null`

#### 2.2.14. `saveResumeData(resumeData)`
Persists uploaded resume metadata and updates `resumeUploaded: true` on the profile.
- **Parameters:** `resumeData` (Object, required)
- **Returns:** `ResumeMetadataObject`

#### 2.2.15. `showToast(message, type)`
Renders a dynamic, accessible floating toast alert at the bottom-right of the viewport.
- **Parameters:**
  - `message` (string, required): Toast text message.
  - `type` (string, optional): `'success'`, `'error'`, `'info'`, `'warning'` (defaults to `'info'`).
- **Duration:** Automatically dismisses after 3200ms with a smooth CSS fade-out transition.

---

## 3. Enterprise RESTful HTTP API Specifications (Phase 2 Backend Architecture)

### 3.1. Authentication Microservice

#### `POST /api/v1/auth/register`
Creates a candidate account and returns a signed JSON Web Token (JWT).
- **Request Body:**
```json
{
  "firstName": "Elena",
  "lastName": "Rostova",
  "email": "elena.rostova@ai-quantum.org",
  "password": "Quantum2026!Sec",
  "degree": "cs",
  "gradYear": "2026",
  "university": "Stanford University",
  "targetTracks": ["AI & Machine Learning"]
}
```
- **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_99812",
      "email": "elena.rostova@ai-quantum.org",
      "name": "Elena Rostova",
      "targetTrack": "AI & Machine Learning"
    }
  }
}
```

#### `POST /api/v1/auth/login`
Authenticates candidate credentials.
- **Request Body:**
```json
{
  "email": "elena.rostova@ai-quantum.org",
  "password": "Quantum2026!Sec"
}
```
- **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### 3.2. Candidate Profile & Resume Microservice

#### `GET /api/v1/user/profile`
Retrieves authenticated candidate profile.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK):** Full candidate profile schema.

#### `PUT /api/v1/user/profile`
Updates profile details, academic records, and verified skill tags.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:** JSON dictionary of fields to update.
- **Response (200 OK):** Updated profile record.

#### `POST /api/v1/resumes/upload`
Uploads candidate CV to Amazon S3 / Cloudflare R2 bucket and initiates asynchronous parsing.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: multipart/form-data`
- **Request:** Binary file payload (Form key: `resume`).
- **Response (202 Accepted):**
```json
{
  "status": "success",
  "data": {
    "fileId": "res_88712",
    "fileName": "Elena_Rostova_AI_Resume.pdf",
    "fileSize": 1489201,
    "s3Url": "https://storage.nexora.io/resumes/res_88712.pdf",
    "scanStatus": "Completed",
    "atsScore": 94
  }
}
```

---

### 3.3. Job Intelligence & Application Microservice

#### `GET /api/v1/jobs`
Searches and filters jobs based on query parameters.
- **Query Parameters:**
  - `q` (string): Keyword search (e.g. `'AI'`).
  - `track` (string): Career track filter.
  - `workMode` (string): `'Remote'`, `'Hybrid'`, `'On-site'`.
  - `minSalary` (number): Minimum salary filter.
  - `page` (number): Page number (default: 1).
  - `limit` (number): Items per page (default: 20).
- **Response (200 OK):**
```json
{
  "status": "success",
  "total": 12,
  "page": 1,
  "data": [...]
}
```

#### `POST /api/v1/jobs/{jobId}/apply`
Submits an application for a specific vacancy.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response (201 Created):** Application tracking object.

---

### 3.4. Standard HTTP Error Contract
All REST endpoints adhere to RFC 7807 Problem Details for HTTP APIs:
```json
{
  "status": "error",
  "statusCode": 400,
  "errorCode": "INVALID_FILE_TYPE",
  "message": "Only PDF, DOCX, and TXT files are accepted for resume upload.",
  "timestamp": "2026-11-02T15:55:00.000Z"
}
```
