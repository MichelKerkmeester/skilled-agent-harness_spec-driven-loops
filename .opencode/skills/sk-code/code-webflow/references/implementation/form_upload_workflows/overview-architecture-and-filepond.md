---
title: Form Upload Workflows
description: Complete architecture reference for the FilePond-to-R2 file upload pipeline, including Cloudflare Worker proxy, state management, and Webflow integration.
trigger_phrases:
  - "webflow form upload"
  - "filepond r2 pipeline"
  - "cloudflare worker upload proxy"
  - "file upload state management"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Form Upload Workflows

Complete architecture reference for the FilePond-to-R2 file upload pipeline, covering every layer from browser drag-drop to CDN URL delivery.

---

## 1. OVERVIEW

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

- **[implementation_workflows.md](../implementation_workflows/condition-based-waiting.md)**: Condition-based waiting, validation patterns
- **[code_quality_standards.md](../../javascript/quality_standards/init_dom_error_and_async.md)**: Naming conventions, initialization patterns
- **FilePond CDN**: `unpkg.com/filepond` (CSS + JS + plugins — check HTML source for current version)
- **Cloudflare Worker**: `worker--upload-form.lorenzo-89a.workers.dev`

---

## 2. ARCHITECTURE

### Pipeline Overview

```
Browser (drag/click)
  --> FilePond (invisible, validation + file handling)
    --> XHR POST (FormData with file)
      --> Cloudflare Worker (worker--upload-form)
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
| **Cloudflare Worker** | External: `worker--upload-form` | Receives FormData POST, stores file in R2, returns CDN URL |
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

## 3. WEBFLOW INTEGRATION

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
| `data-upload-endpoint` | `https://worker--upload-form.lorenzo-89a.workers.dev` | Worker endpoint URL |
| `data-max-size` | `5MB` | Maximum file size (FilePond format) |
| `data-accepted-types` | `application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/vnd.oasis.opendocument.text,application/rtf,text/rtf` | Comma-separated MIME types (extensions appended as fallback) |

### Label Customization

Labels are configurable via `data-label-*` attributes on the wrapper. Mobile overrides are supported for idle text and browse labels.

| Attribute | Default | Mobile Override |
|-----------|---------|-----------------|
| `data-label-idle-text` | "Drag & drop your file or" | `data-label-idle-text-mobile` |
| `data-label-browse` | "Browse" | `data-label-browse-mobile` |
| `data-label-description` | "Max 5 MB: PDF, DOC, DOCX, TXT, MD, ODT, RTF" | -- |
| `data-label-uploading` | "Uploading..." | -- |
| `data-label-cancel` | "Click to cancel upload" | -- |
| `data-label-delete` | "Click to delete" | -- |
| `data-label-size-separator` | " of " | -- |
| `data-label-error-type` | "Invalid file type" | -- |
| `data-label-error-size` | "File too large" | -- |
| `data-label-error-upload` | "Upload failed, please try again" | -- |
| `data-label-error-dismiss` | "Click to dismiss" | -- |

Mobile detection uses multiple signals: user agent, viewport width (<=991px), touch capability, and pointer media query (coarse).

---

## 4. FILEPOND CONFIGURATION

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
<script src="https://unpkg.com/filepond-plugin-file-validate-type@{version}/dist/filepond-plugin-file-validate-type.min.js" defer></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size@{version}/dist/filepond-plugin-file-validate-size.min.js" defer></script>

<!-- 2. FilePond core SECOND -->
<script src="https://unpkg.com/filepond@{version}/dist/filepond.min.js" defer></script>

<!-- 3. Custom connector THIRD -->
<script src="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v={version}" defer></script>
```

> **Note**: Check `werken_bij.html` or `vacature.html` for current pinned versions.

FilePond CSS is loaded asynchronously in the `<head>`:

```html
<link rel="preload" href="https://unpkg.com/filepond@{version}/dist/filepond.min.css" as="style"
     onload="this.rel='stylesheet'">
<noscript>
     <link rel="stylesheet" href="https://unpkg.com/filepond@{version}/dist/filepond.min.css">
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
  fileValidateTypeDetectType: detect_file_type, // Extension-based MIME fallback
  maxFileSize: '5MB',          // From data-max-size
  server: { process, revert }, // Custom XHR handlers
});
```

---
