---
title: State Machine, Cloudflare Worker Proxy & Form Integration
description: Complete architecture reference for the FilePond-to-R2 file upload pipeline, including Cloudflare Worker proxy, state management, and Webflow integration. — State Machine, Cloudflare Worker Proxy & Form Integration.
trigger_phrases:
  - "state machine cloudflare"
  - "proxy form integration"
  - "state machine patterns"
  - "webflow state machine"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# State Machine, Cloudflare Worker Proxy & Form Integration

Complete architecture reference for the FilePond-to-R2 file upload pipeline, including Cloudflare Worker proxy, state management, and Webflow integration. — State Machine, Cloudflare Worker Proxy & Form Integration.

---

## 1. OVERVIEW

### Purpose

The upload state machine, the Cloudflare Worker proxy that fronts it, and how both integrate with a Webflow form.

### When to Use

- Implementing the upload state machine
- Fronting uploads with a Cloudflare Worker proxy
- Wiring the upload flow into a Webflow form

---

## 2. STATE MACHINE

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
| `processfile` (no error) | Set state COMPLETE, show filename, show delete notice |
| `processfile` (error) | Set state ERROR, show upload error, clear URL input |
| `removefile` | Reset to IDLE state |
| `warning` | Set state ERROR (invalid type or max size exceeded) |

---

## 3. CLOUDFLARE WORKER PROXY

### Endpoint and Purpose

- **URL**: `https://worker--upload-form.lorenzo-89a.workers.dev`
- **Purpose**: Receives file uploads from the browser and stores them in Cloudflare R2 storage, returning a public CDN URL.

### Request Format

```
POST https://worker--upload-form.lorenzo-89a.workers.dev
Content-Type: multipart/form-data

FormData:
  file: [File object]
```

### Response Format

**Success** (HTTP 200):
```json
{
  "url": "https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/uploaded-filename.pdf"
}
```

**Error** (HTTP 200 with error field, or non-200 status):
```json
{
  "error": "Error description"
}
```

### R2 Bucket and CDN URL Pattern

- **CDN domain**: `pub-383189394a924ad3b619aa4522f32d27.r2.dev` (uploaded user files)
- **Project CDN domain**: `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev` (JS/CSS assets)
- **URL pattern**: `https://pub-383189394a924ad3b619aa4522f32d27.r2.dev/{filename}`
- Uploaded user files are stored in a separate R2 bucket from project assets

### Error Scenarios

| Scenario | Detection | Error Message |
|----------|-----------|---------------|
| Network failure | `xhr.onerror` | "Network error - check your connection" |
| Invalid JSON response | `JSON.parse` throws | "Invalid server response" |
| Non-200 HTTP status | `xhr.status` check | "Upload failed: {status}" |
| Server returns error field | `response.error` truthy | `response.error` value |

---

## 4. FORM INTEGRATION

### Upload URL to Formspark

The upload URL flows to Formspark through a hidden input:

1. **Upload completes** -> `url_input.value = response.url` (in `create_server_config`)
2. **Form submitted** -> `form_submission.js` converts FormData to JSON
3. **File fields skipped** -> `File` objects are excluded from JSON (cannot stringify)
4. **URL included** -> The hidden input value is a plain string, so it's included in the JSON payload
5. **Formspark receives** -> `{ "file_url": "https://pub-383189394a924ad3b619aa4522f32d27.r2.dev/filename.pdf", ...other_fields }`

### Upload URL Validation Guard

Both the FilePond connector and form submission handler prevent submitting when an upload is in a non-idle state but the URL is missing:

```javascript
// Connector-level guard (input_upload.js:759-781)
form.addEventListener('submit', function (e) {
  var current_state = wrapper.dataset.uploadState || STATE.IDLE;
  var has_upload_url = !!(url_input.value && url_input.value.trim());

  if (current_state !== STATE.IDLE && !has_upload_url) {
    var labels = get_labels(wrapper);
    set_state(wrapper, STATE.ERROR);
    update_ui(wrapper, {
      status: labels.errorUpload,
      percentage: 0,
      notice: labels.errorDismiss,
    });
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);

// Form-level guard (form_submission.js:589-594)
const upload_blocker = get_upload_submission_blocker(this.form);
if (upload_blocker) {
  const upload_error = new Error('File upload did not complete. Please upload again.');
  this.handle_error(upload_error);
  return;
}
```

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

