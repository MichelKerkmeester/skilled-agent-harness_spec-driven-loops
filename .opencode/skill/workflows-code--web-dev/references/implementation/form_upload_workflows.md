---
title: Form Upload Workflows
description: Complete architecture reference for the FilePond-to-R2 file upload pipeline, including Cloudflare Worker proxy, state management, and Webflow integration.
---

# Form Upload Workflows

Complete architecture reference for the FilePond-to-R2 file upload pipeline, covering every layer from browser drag-drop to CDN URL delivery.

---

## 1. 📖 OVERVIEW

### Core Principle

FilePond runs invisibly while Webflow elements handle all visual feedback — the library provides upload mechanics, the custom UI provides the experience.

### Purpose

Single source of truth for understanding, maintaining, and extending the file upload system across anobel.com. Covers the full pipeline: browser interaction, FilePond orchestration, Cloudflare Worker proxy, R2 storage, and form submission integration.

### When to Use

- Adding file upload to a new page or form
- Debugging upload failures (MIME type, network, UI state)
- Extending accepted file types
- Modifying upload UI behavior or labels
- Understanding how uploaded file URLs reach Formspark

### Prerequisites

- **[implementation_workflows.md](./implementation_workflows.md)**: Condition-based waiting, validation patterns
- **[code_quality_standards.md](../standards/code_quality_standards.md)**: Naming conventions, initialization patterns
- **FilePond CDN**: `unpkg.com/filepond@4.30.4` (CSS + JS + plugins)
- **Cloudflare Worker**: `r2-upload-proxy.cloudflare-decorated911.workers.dev`

---

## 2. 🏗️ ARCHITECTURE

### Pipeline Overview

```
Browser (drag/click)
  --> FilePond (invisible, validation + file handling)
    --> XHR POST (FormData with file)
      --> Cloudflare Worker (r2-upload-proxy)
        --> R2 Bucket (storage)
          --> CDN URL (response.url)
            --> Hidden input [data-file-upload="url"]
              --> Formspark (JSON submission with URL string)
```

### Component Responsibility Table

| Component | File | Responsibility |
|-----------|------|----------------|
| **FilePond Connector** | `src/2_javascript/form/input_upload.js` | Bridges FilePond to Webflow UI, state machine, progress display, drag-drop |
| **Upload CSS** | `src/1_css/input_upload.css` | State-driven visibility, dropzone styling, progress animation |
| **Cloudflare Worker** | External: `r2-upload-proxy` | Receives FormData POST, stores file in R2, returns CDN URL |
| **Form Validation** | `src/2_javascript/form/form_validation.js` | File type/size validation via `accept` attribute |
| **Form Submission** | `src/2_javascript/form/form_submission.js` | Skips File objects in JSON, includes URL string from hidden input |
| **Form Persistence** | `src/2_javascript/form/form_persistence.js` | Persists upload URL in localStorage across page refreshes |

### Data Flow

| Layer | Input | Output |
|-------|-------|--------|
| **Browser** | User drag/click | File object |
| **FilePond** | File object | Validated file + events |
| **XHR** | FormData with file | HTTP POST to Worker |
| **Worker** | FormData POST | `{ url: "https://pub-...r2.dev/filename" }` |
| **Hidden Input** | CDN URL string | Form field value |
| **Formspark** | JSON with URL field | Submission record |
| **Persistence** | URL string | localStorage entry (type: `file-url`) |

---

## 3. 📋 WEBFLOW INTEGRATION

### Data Attribute Reference

All selectors use the `data-file-upload` attribute. There are 15 total selectors:

| # | Selector | Element | Purpose |
|---|----------|---------|---------|
| 1 | `[data-file-upload="wrapper"]` | Container div | Root wrapper, receives state classes |
| 2 | `[data-file-upload="input"]` | `<input type="file">` | Native file input (hidden by FilePond) |
| 3 | `[data-file-upload="url"]` | `<input type="hidden">` | Stores uploaded file CDN URL |
| 4 | `[data-file-upload="idle"]` | Div | IDLE view container (visible by default) |
| 5 | `[data-file-upload="loader"]` | Div | UPLOADING/COMPLETE view container (hidden by default) |
| 6 | `[data-file-upload="browse"]` | Link/button | "Browse" trigger, opens file picker |
| 7 | `[data-file-upload="notice"]` | Text element | Context-sensitive: "Click to cancel" / "Click to delete" |
| 8 | `[data-file-upload="text"]` | Text element | Idle state text: "Drag & drop your file or" |
| 9 | `[data-file-upload="description"]` | Text element | File constraints: "Max 5 MB: PDF, DOC, DOCX" |
| 10 | `[data-file-upload="uploading"]` | Text element | Status text during upload, filename when complete |
| 11 | `[data-file-upload="progress-bar"]` | Div | Progress bar fill element (width set via JS) |
| 12 | `[data-file-upload="percentage"]` | Text element | Percentage text: "40%" |
| 13 | `[data-file-upload="size"]` | Text element | Size text: "178MB of 445MB" (or total only when complete) |
| 14 | `[data-file-upload="icon-upload"]` | Icon/SVG | Upload icon (hidden on complete) |
| 15 | `[data-file-upload="icon-success"]` | Icon/SVG | Success checkmark (shown on complete) |

### HTML Structure Template

Copy-paste ready structure for Webflow:

```html
<!-- Upload Wrapper -->
<div data-file-upload="wrapper">

  <!-- Hidden inputs -->
  <input type="file" data-file-upload="input" style="display:none">
  <input type="hidden" data-file-upload="url" name="file_url">

  <!-- IDLE View (visible by default) -->
  <div data-file-upload="idle">
    <div data-file-upload="icon-upload"><!-- upload icon --></div>
    <div data-file-upload="icon-success"><!-- checkmark icon --></div>
    <div data-file-upload="text">Drag & drop your file or</div>
    <a href="#" data-file-upload="browse">Browse</a>
    <div data-file-upload="description">Max 5 MB: PDF, DOC, DOCX</div>
  </div>

  <!-- LOADER View (hidden by default, shown during upload/complete) -->
  <div data-file-upload="loader">
    <div data-file-upload="uploading">Uploading...</div>
    <div data-file-upload="progress-bar" style="width: 0%"></div>
    <div data-file-upload="percentage">0%</div>
    <div data-file-upload="size"></div>
    <div data-file-upload="notice">Click to cancel upload</div>
  </div>

</div>
```

### Configuration Attributes

Set on the wrapper element to override defaults:

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-upload-endpoint` | `https://r2-upload-proxy.cloudflare-decorated911.workers.dev` | Worker endpoint URL |
| `data-max-size` | `5MB` | Maximum file size (FilePond format) |
| `data-accepted-types` | `application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Comma-separated MIME types |

### Label Customization

Labels are configurable via `data-label-*` attributes on the wrapper. Mobile overrides are supported for idle text and browse labels.

| Attribute | Default | Mobile Override |
|-----------|---------|-----------------|
| `data-label-idle-text` | "Drag & drop your file or" | `data-label-idle-text-mobile` |
| `data-label-browse` | "Browse" | `data-label-browse-mobile` |
| `data-label-description` | "Max 5 MB: PDF, DOC, DOCX" | -- |
| `data-label-uploading` | "Uploading..." | -- |
| `data-label-cancel` | "Click to cancel upload" | -- |
| `data-label-delete` | "Click to delete" | -- |
| `data-label-size-separator` | " of " | -- |
| `data-label-error-type` | "Invalid file type" | -- |
| `data-label-error-size` | "File too large" | -- |
| `data-label-error-dismiss` | "Click to dismiss" | -- |

Mobile detection uses multiple signals: user agent, viewport width (<=991px), touch capability, and pointer media query (coarse).

---

## 4. ⚙️ FILEPOND CONFIGURATION

### Plugin Registration

Two validation plugins are registered before FilePond core:

| Plugin | Version | Purpose |
|--------|---------|---------|
| `FilePondPluginFileValidateType` | 1.2.8 | MIME type validation against `acceptedFileTypes` |
| `FilePondPluginFileValidateSize` | 2.2.8 | File size validation against `maxFileSize` |

Plugins are registered dynamically only if their globals exist:

```javascript
var plugins = [];
if (typeof FilePondPluginFileValidateType !== 'undefined') {
  plugins.push(FilePondPluginFileValidateType);
}
if (typeof FilePondPluginFileValidateSize !== 'undefined') {
  plugins.push(FilePondPluginFileValidateSize);
}
if (plugins.length > 0) {
  FilePond.registerPlugin.apply(FilePond, plugins);
}
```

### Script Loading Order

**Plugins MUST load before FilePond core.** This is a strict requirement — FilePond registers plugins at `create()` time but expects them to be available globally.

```html
<!-- 1. Plugins FIRST -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type@1.2.8/dist/filepond-plugin-file-validate-type.min.js" defer></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size@2.2.8/dist/filepond-plugin-file-validate-size.min.js" defer></script>

<!-- 2. FilePond core SECOND -->
<script src="https://unpkg.com/filepond@4.30.4/dist/filepond.min.js" defer></script>

<!-- 3. Custom connector THIRD -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_upload.min.js?v=1.2.5" defer></script>
```

FilePond CSS is loaded asynchronously in the `<head>`:

```html
<link rel="preload" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" as="style"
     onload="this.rel='stylesheet'">
<noscript>
     <link rel="stylesheet" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css">
</noscript>
```

### Library Detection

The connector retries FilePond detection with exponential backoff:

- **Max retries**: 5
- **Backoff**: 100ms, 200ms, 400ms, 800ms, 1600ms (capped at 2000ms)
- **Fallback**: If FilePond never loads, labels are still set via `set_labels_only()` (fallback mode)

```
Retry 1: 100ms
Retry 2: 200ms
Retry 3: 400ms
Retry 4: 800ms
Retry 5: 1600ms
Total wait: ~3.1 seconds before giving up
```

### Server Config

FilePond uses a custom `server` configuration with `process` and `revert` methods:

**Process (upload)**:
1. Creates `FormData` with the file
2. Opens XHR POST to the configured endpoint
3. Tracks `xhr.upload.onprogress` for progress updates
4. Parses JSON response on success
5. Stores `response.url` in hidden input
6. Returns abort method for cancellation

**Revert (file removal)**:
1. Clears the hidden URL input value
2. Calls `load()` to signal completion

FilePond instance config:

```javascript
FilePond.create(input_el, {
  name: '',                    // Prevent FilePond form submission
  maxFiles: 1,                 // Single file mode
  allowMultiple: false,
  stylePanelLayout: null,      // Hide FilePond panel
  credits: false,
  required: false,
  dropOnPage: false,           // Custom drop handling
  dropOnElement: false,
  acceptedFileTypes: [...],    // From data-accepted-types
  maxFileSize: '5MB',          // From data-max-size
  server: { process, revert }, // Custom XHR handlers
});
```

---

## 5. 🔄 STATE MACHINE

### States

```
IDLE --> UPLOADING --> COMPLETE
  ^         |             |
  |         v             |
  |       ERROR           |
  |         |             |
  +---------+-------------+
        (reset/remove)
```

| State | Trigger | Exit Condition |
|-------|---------|----------------|
| **IDLE** | Initial state, file removed, error dismissed | File added |
| **UPLOADING** | `addfile` event (no error) | Upload completes or fails |
| **COMPLETE** | `processfile` event | File removed |
| **ERROR** | `warning` event, `addfile` error | Click to dismiss |

### CSS Classes

Applied to the wrapper element (`[data-file-upload="wrapper"]`):

| Class | State | Applied When |
|-------|-------|-------------|
| *(none)* | IDLE | Default — no class means idle |
| `is--uploading` | UPLOADING | File added, upload in progress |
| `is--complete` | COMPLETE | Upload finished successfully |
| `is--error` | ERROR | Validation failure or upload error |
| `is--drag-over` | (overlay) | File dragged over wrapper (any state) |

State transitions always remove all state classes first, then add the appropriate one.

### UI Visibility Rules per State

| Element | IDLE | UPLOADING | COMPLETE | ERROR |
|---------|------|-----------|----------|-------|
| `[data-file-upload="idle"]` | `display: flex` | `display: none` | `display: none` | `display: none` |
| `[data-file-upload="loader"]` | `display: none` | `display: flex` | `display: flex` | `display: flex` |
| `[data-file-upload="icon-upload"]` | `display: block` | -- | `display: none` | -- |
| `[data-file-upload="icon-success"]` | `display: none` | -- | `display: block` | -- |

### Dropzone Visual States (CSS)

| State | Border Color | Border Width | Border Style | Background |
|-------|-------------|-------------|-------------|------------|
| Enabled | `--input-border--enabled` | 1px | solid | `--input-bg--enabled` |
| Hover | `--input-border--active` | 1px | solid | `--input-bg--enabled` |
| Drag-over | `--input-border--active` | 2px | dashed | `--input-bg--enabled` |
| Uploading | `--input-border--enabled` | 1px | solid | `--input-bg--enabled` |
| Success | `--input-border--positive` | 2px | solid | `--input-bg--positive` |
| Error | `--input-border--negative` | 2px | solid | `--input-bg--negative` |

### Event Triggers

| FilePond Event | Action |
|----------------|--------|
| `addfile` (no error) | Set state UPLOADING, initialize progress UI |
| `addfile` (error) | Set state ERROR, show error message |
| `processfileprogress` | Update progress bar, percentage, size text |
| `processfile` | Set state COMPLETE, show filename, show delete notice |
| `removefile` | Reset to IDLE state |
| `warning` | Set state ERROR (invalid type or max size exceeded) |

---

## 6. ☁️ CLOUDFLARE WORKER PROXY

### Endpoint and Purpose

- **URL**: `https://r2-upload-proxy.cloudflare-decorated911.workers.dev`
- **Purpose**: Receives file uploads from the browser and stores them in Cloudflare R2 storage, returning a public CDN URL.

### Request Format

```
POST https://r2-upload-proxy.cloudflare-decorated911.workers.dev
Content-Type: multipart/form-data

FormData:
  file: [File object]
```

### Response Format

**Success** (HTTP 200):
```json
{
  "url": "https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/uploaded-filename.pdf"
}
```

**Error** (HTTP 200 with error field, or non-200 status):
```json
{
  "error": "Error description"
}
```

### R2 Bucket and CDN URL Pattern

- **CDN domain**: `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev`
- **URL pattern**: `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/{filename}`
- The same R2 bucket serves both uploaded user files and project CDN assets (JS/CSS)

### Error Scenarios

| Scenario | Detection | Error Message |
|----------|-----------|---------------|
| Network failure | `xhr.onerror` | "Network error - check your connection" |
| Invalid JSON response | `JSON.parse` throws | "Invalid server response" |
| Non-200 HTTP status | `xhr.status` check | "Upload failed: {status}" |
| Server returns error field | `response.error` truthy | `response.error` value |

---

## 7. 🔗 FORM INTEGRATION

### Upload URL to Formspark

The upload URL flows to Formspark through a hidden input:

1. **Upload completes** -> `url_input.value = response.url` (in `create_server_config`)
2. **Form submitted** -> `form_submission.js` converts FormData to JSON
3. **File fields skipped** -> `File` objects are excluded from JSON (cannot stringify)
4. **URL included** -> The hidden input value is a plain string, so it's included in the JSON payload
5. **Formspark receives** -> `{ "file_url": "https://pub-...r2.dev/filename.pdf", ...other_fields }`

### form_validation.js Integration

`form_validation.js` provides native file validation via the `accept` attribute:

```javascript
// Validates file extension, wildcard MIME, or exact MIME
function validate_file_accept(field) {
  const accept = field.getAttribute('accept');
  // Checks: .ext (extension), type/* (wildcard), type/subtype (exact)
}
```

This validation runs on the native file input, separate from FilePond's MIME validation. Both should accept the same types.

### form_submission.js Integration

File handling in `submit_with_retry()`:

```javascript
// File objects are SKIPPED in JSON submission
if (typeof File !== 'undefined' && value instanceof File) {
  has_files.push(key);
  continue; // Skip - can't JSON stringify files
}
```

The upload URL (a string in the hidden input) passes through normally since it's not a `File` object.

### form_persistence.js Integration

Upload URLs are persisted in localStorage:

```javascript
// Selector for file upload URL inputs
fileUploadUrl: '[data-file-upload="url"]',

// Serialized as type: 'file-url'
data[key] = {
  type: 'file-url',
  value: input.value,  // The CDN URL string
};
```

On page refresh, the URL is restored to the hidden input. Note: the actual file preview is NOT restored — only the URL reference persists.

### Form Reset

When a form resets, the upload component cleans up:

1. `form.addEventListener('reset', ...)` triggers `pond.removeFiles()` + `reset_ui(wrapper)`
2. `reset_ui()` sets state to IDLE, clears progress, clears URL input
3. `form_persistence.js` clears stored data on form reset

---

## 8. 🛡️ MIME TYPE REFERENCE

### Accepted Types Table

Default accepted types configured in `DEFAULTS.acceptedTypes`:

| Extension | MIME Type | Browser Reports As | Notes |
|-----------|-----------|-------------------|-------|
| `.pdf` | `application/pdf` | `application/pdf` | Consistent across all browsers |
| `.doc` | `application/msword` | `application/msword` | Legacy Word format |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Modern Word format |

### Why Extensions Don't Work

FilePond's `acceptedFileTypes` matches against the **browser-reported MIME type**, not the file extension. This is critical:

- A `.docx` file has MIME `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Setting `acceptedFileTypes: ['.docx']` will NOT work — FilePond expects MIME strings
- The browser determines MIME type from the file's binary signature, not its extension

**The `.doc/.docx` lesson**: A previous bug occurred when only `application/pdf` was in the accepted types, causing Word documents to be rejected with "Invalid file type". The fix was adding both `application/msword` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document` to the MIME list.

### Adding New File Types

To accept additional file types:

1. **Find the MIME type** — check the table below or use browser DevTools to inspect `file.type`
2. **Update DEFAULTS** — add to `DEFAULTS.acceptedTypes` in `input_upload.js`
3. **OR use data attribute** — set `data-accepted-types` on the wrapper element
4. **Update description label** — change `data-label-description` to reflect new types
5. **Minify and deploy** — follow CDN deployment workflow

### Common MIME Types Reference

| Extension | MIME Type |
|-----------|-----------|
| `.pdf` | `application/pdf` |
| `.doc` | `application/msword` |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `.xls` | `application/vnd.ms-excel` |
| `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `.ppt` | `application/vnd.ms-powerpoint` |
| `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.txt` | `text/plain` |
| `.csv` | `text/csv` |
| `.jpg` / `.jpeg` | `image/jpeg` |
| `.png` | `image/png` |
| `.gif` | `image/gif` |
| `.webp` | `image/webp` |
| `.svg` | `image/svg+xml` |
| `.zip` | `application/zip` |
| `.mp4` | `video/mp4` |

---

## 9. 🛠️ TROUBLESHOOTING

### "Invalid file type" Error

**Symptom**: User drops/selects a valid file but gets "Invalid file type" error.

**Root Cause**: MIME type mismatch between what the browser reports and what `acceptedFileTypes` expects.

**Fix**:
1. Check what MIME type the browser assigns: `console.log(file.type)` in DevTools
2. Add the exact MIME string to `DEFAULTS.acceptedTypes` or `data-accepted-types`
3. Do NOT use file extensions (`.doc`) — use MIME types (`application/msword`)

**Real example**: `.doc` files were rejected because only `application/pdf` was configured. Fix: add `application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

### FilePond Not Loading

**Symptom**: Upload component shows labels but doesn't respond to file drops/clicks. Console shows "[FilePondConnector] FilePond library not loaded after 5 retries".

**Possible Causes**:
1. **Script order wrong** — plugins loaded AFTER core (must be BEFORE)
2. **CDN unavailable** — `unpkg.com` is down or blocked
3. **Script blocked** — ad blocker or CSP blocking external scripts

**Fix**: Check Network tab for failed script loads. Verify script order in HTML.

### Upload Fails Silently

**Symptom**: File is added, progress shows, but never completes. No error displayed.

**Possible Causes**:
1. **Worker endpoint down** — the Cloudflare Worker is not responding
2. **CORS issue** — Worker not returning proper CORS headers
3. **Response format changed** — Worker not returning expected `{ url }` JSON

**Fix**: Check Network tab for the POST request. Inspect response body. Verify Worker is deployed and responding.

### File URL Missing in Submission

**Symptom**: Form submits successfully but the file URL is not in the Formspark data.

**Possible Causes**:
1. **Hidden input missing** — no `[data-file-upload="url"]` element in form
2. **Input has no `name`** — the hidden input needs a `name` attribute for form serialization
3. **Upload not complete** — form submitted before upload finished

**Fix**: Verify the hidden input exists with both `data-file-upload="url"` and a `name` attribute (e.g., `name="file_url"`).

### Progress Bar Stuck

**Symptom**: Progress bar starts but freezes at a percentage.

**Possible Causes**:
1. **XHR progress not firing** — server doesn't support chunked upload progress
2. **Large file on slow connection** — upload genuinely slow
3. **Network interruption** — connection dropped mid-upload

**Fix**: Check Network tab for the upload request status. If the request is pending, wait. If failed, check error handling.

---

## 10. 📄 PAGES AND DEPLOYMENT

### Pages Using Upload

| Page | HTML File | Upload Context |
|------|-----------|----------------|
| Werken bij (Careers) | `src/0_html/werken_bij.html` | Job application form — resume/CV upload |
| Vacature (Job posting) | `src/0_html/cms/vacature.html` | CMS template — job-specific application form |

Both pages load identical FilePond dependencies and the same version of `input_upload.min.js`.

### Version Management

Scripts use the `?v=` query parameter pattern for cache busting:

| Script | Current Version | CDN Path |
|--------|----------------|----------|
| `input_upload.min.js` | `v=1.2.5` | `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/input_upload.min.js` |
| `form_validation.min.js` | `v=1.2.36` | `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_validation.min.js` |
| `form_submission.min.js` | `v=1.2.35` | `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_submission.min.js` |
| `form_persistence.min.js` | `v=1.0.1` | `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/form_persistence.min.js` |

### CDN Workflow

After modifying upload-related JavaScript:

1. **Minify**: Run minification script or `npx terser` on the source file
2. **Verify**: Run verification script to confirm minified output matches source
3. **Upload to R2**: `wrangler r2 object put project-cdn/{file}.min.js --file {minified_path}`
4. **Version bump**: Increment `?v=` parameter in both `werken_bij.html` and `vacature.html`
5. **Browser test**: Verify upload works at mobile and desktop viewports

### Public API

The connector exposes a global API for programmatic control:

```javascript
// Re-initialize (after SPA navigation)
window.InputUpload.init();

// Get FilePond instance from a wrapper element
window.InputUpload.getInstance(wrapperElement);

// Cleanup all instances (before page transitions)
window.InputUpload.cleanup();

// Also available as:
window.initFilepondConnector();
window.getFilepondInstance(wrapper);
window.cleanupFilepondInstances();
```

---

## 11. 🔗 RELATED RESOURCES

- **[implementation_workflows.md](./implementation_workflows.md)** — Condition-based waiting, validation patterns used by the upload connector
- **[security_patterns.md](./security_patterns.md)** — XSS prevention relevant to file upload handling
- **[code_quality_standards.md](../standards/code_quality_standards.md)** — Naming conventions and initialization patterns
- **CDN Deployment**: See [cdn_deployment.md](../deployment/cdn_deployment.md) for R2 upload workflow
- **Minification**: See [minification_guide.md](../deployment/minification_guide.md) for terser configuration
