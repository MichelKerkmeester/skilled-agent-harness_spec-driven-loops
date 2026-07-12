---
title: FilePond File Upload
description: Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns. — FilePond File Upload.
trigger_phrases:
  - "filepond file upload"
  - "filepond file patterns"
  - "webflow filepond file"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# FilePond File Upload

Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns. — FilePond File Upload.

---

## 1. OVERVIEW

### Purpose

Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns. — FilePond File Upload.

### When to Use

Use this reference when implementing or troubleshooting filepond file upload.

---

## 2. FILEPOND (FILE UPLOAD)

FilePond is a flexible file upload library with drag-and-drop and progress indicators. The connector bridges FilePond (invisible) to a Webflow-designed UI with custom state management.

### CDN URLs

```html
<!-- 1. Plugins FIRST (must load before core) -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type@1.2.8/dist/filepond-plugin-file-validate-type.min.js" defer></script>
<script src="https://unpkg.com/filepond-plugin-file-validate-size@2.2.8/dist/filepond-plugin-file-validate-size.min.js" defer></script>

<!-- 2. FilePond core SECOND -->
<script src="https://unpkg.com/filepond@4.30.4/dist/filepond.min.js" defer></script>

<!-- 3. Custom connector THIRD -->
<script src="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v={version}" defer></script>

<!-- CSS (async in <head>) -->
<link rel="preload" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" as="style"
     onload="this.rel='stylesheet'">
```

### Configuration

```javascript
// Source: src/2_javascript/form/input_upload.js
const SELECTORS = {
  wrapper:     '[data-file-upload="wrapper"]',
  input:       '[data-file-upload="input"]',
  url:         '[data-file-upload="url"]',
  idle:        '[data-file-upload="idle"]',
  loader:      '[data-file-upload="loader"]',
  browse:      '[data-file-upload="browse"]',
  notice:      '[data-file-upload="notice"]',
  idleText:    '[data-file-upload="text"]',
  description: '[data-file-upload="description"]',
  uploading:   '[data-file-upload="uploading"]',
  progressBar: '[data-file-upload="progress-bar"]',
  percentage:  '[data-file-upload="percentage"]',
  size:        '[data-file-upload="size"]',
};

const DEFAULTS = {
  maxSize: '5MB',
  acceptedTypes: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/vnd.oasis.opendocument.text,application/rtf,text/rtf',
  uploadEndpoint: 'https://worker--upload-form.lorenzo-89a.workers.dev',
};

const STATE = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  COMPLETE: 'complete',
  ERROR: 'error',
};

// Extension-to-MIME-type map for reliable file type detection
// Browsers may report incorrect MIME types for Office documents
const MIME_TYPE_MAP = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.rtf': 'application/rtf',
};
```

### Label Management (via data attributes)

Labels are configurable via `data-label-*` attributes on the wrapper element. Mobile overrides supported for idle text and browse labels.

```javascript
// Source: src/2_javascript/form/input_upload.js
const DEFAULT_LABELS = {
  // Idle state
  idleText: 'Drag & drop your file or',
  browse: 'Browse',
  description: 'Max 5 MB: PDF, DOC, DOCX, TXT, MD, ODT, RTF',
  // Uploading state
  uploading: 'Uploading...',
  cancel: 'Click to cancel upload',
  delete: 'Click to delete',
  sizeSeparator: ' of ',
  // Error state
  errorInvalidType: 'Invalid file type',
  errorMaxSize: 'File too large',
  errorUpload: 'Upload failed, please try again',
  errorDismiss: 'Click to dismiss',
};

function get_labels(wrapper) {
  var idle_text = wrapper.getAttribute('data-label-idle-text') || DEFAULT_LABELS.idleText;
  var browse = wrapper.getAttribute('data-label-browse') || DEFAULT_LABELS.browse;

  // Use mobile labels if on mobile and they exist
  if (is_mobile()) {
    idle_text = wrapper.getAttribute('data-label-idle-text-mobile') || idle_text;
    browse = wrapper.getAttribute('data-label-browse-mobile') || browse;
  }

  return {
    idleText: idle_text,
    browse: browse,
    description: wrapper.getAttribute('data-label-description') || DEFAULT_LABELS.description,
    uploading: wrapper.getAttribute('data-label-uploading') || DEFAULT_LABELS.uploading,
    cancel: wrapper.getAttribute('data-label-cancel') || DEFAULT_LABELS.cancel,
    delete: wrapper.getAttribute('data-label-delete') || DEFAULT_LABELS.delete,
    sizeSeparator: wrapper.getAttribute('data-label-size-separator') || DEFAULT_LABELS.sizeSeparator,
    errorInvalidType: wrapper.getAttribute('data-label-error-type') || DEFAULT_LABELS.errorInvalidType,
    errorMaxSize: wrapper.getAttribute('data-label-error-size') || DEFAULT_LABELS.errorMaxSize,
    errorUpload: wrapper.getAttribute('data-label-error-upload') || DEFAULT_LABELS.errorUpload,
    errorDismiss: wrapper.getAttribute('data-label-error-dismiss') || DEFAULT_LABELS.errorDismiss,
  };
}
```

### MIME Type Detection Fallback

Browsers inconsistently report MIME types for Office documents. The `detect_file_type` function provides extension-based fallback detection via FilePond's `fileValidateTypeDetectType` option.

```javascript
// Source: src/2_javascript/form/input_upload.js
function detect_file_type(source, type) {
  return new Promise(function (resolve) {
    // If browser already reports a known accepted MIME type, trust it
    var known_types = Object.values(MIME_TYPE_MAP);
    if (type && known_types.indexOf(type) !== -1) {
      resolve(type);
      return;
    }

    // Fallback: detect from file extension
    var ext = source.name ? source.name.match(/\.[^.]+$/) : null;
    if (ext && MIME_TYPE_MAP[ext[0].toLowerCase()]) {
      resolve(MIME_TYPE_MAP[ext[0].toLowerCase()]);
      return;
    }

    // No match — pass through original type
    resolve(type);
  });
}
```

### R2 Integration via Cloudflare Worker

```javascript
// Source: src/2_javascript/form/input_upload.js
function create_server_config(endpoint, wrapper, url_input) {
  return {
    process: function (_fieldName, file, _metadata, load, error, progress, abort) {
      const form_data = new FormData();
      form_data.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          progress(true, e.loaded, e.total);
          var percent = (e.loaded / e.total) * 100;
          update_ui(wrapper, { percentage: percent, loaded: e.loaded, total: e.total });
        }
      };

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var response = JSON.parse(xhr.responseText);
            if (response.error) { error(response.error); return; }
            url_input.value = response.url;
            load(response.url);
          } catch (_e) {
            error('Invalid server response');
          }
        } else {
          error('Upload failed: ' + xhr.status);
        }
      };

      xhr.onerror = function () { error('Network error - check your connection'); };
      xhr.onabort = function () { abort(); };
      xhr.send(form_data);

      return { abort: function () { xhr.abort(); abort(); } };
    },

    revert: function (_uniqueFileId, load, _error) {
      url_input.value = '';
      load();
    },
  };
}
```

### FilePond Instance Creation

```javascript
// Source: src/2_javascript/form/input_upload.js
function init_instance(wrapper) {
  var input_el = get_el(wrapper, SELECTORS.input);
  var url_input = get_el(wrapper, SELECTORS.url);

  var endpoint = wrapper.dataset.uploadEndpoint || DEFAULTS.uploadEndpoint;
  var max_size = wrapper.dataset.maxSize || DEFAULTS.maxSize;
  var accepted_types = wrapper.dataset.acceptedTypes || DEFAULTS.acceptedTypes;

  var accepted_types_array = accepted_types.split(',').map(function (t) {
    return t.replace(/\s+/g, '');
  });

  // Add extension aliases as a fallback for browsers/platforms that
  // report DOC/DOCX as generic zip/octet MIME types during selection.
  Object.keys(MIME_TYPE_MAP).forEach(function (ext) {
    if (accepted_types_array.indexOf(ext) === -1) {
      accepted_types_array.push(ext);
    }
  });

  // Keep native accept in sync with normalized FilePond configuration.
  // This prevents Webflow/editor stale values from drifting and ensures
  // extension fallbacks (.docx, etc.) are available in all browsers.
  input_el.setAttribute('accept', accepted_types_array.join(','));

  var pond = FilePond.create(input_el, {
    name: '',                    // Prevent FilePond form submission
    maxFiles: 1,
    allowMultiple: false,
    stylePanelLayout: null,      // Hide FilePond panel
    styleButtonRemoveItemPosition: 'left',
    credits: false,
    required: false,
    dropOnPage: false,           // Custom drop handling
    dropOnElement: false,

    // Validation
    acceptedFileTypes: accepted_types_array,
    fileValidateTypeDetectType: detect_file_type, // Extension-based MIME fallback
    maxFileSize: max_size,

    // Server configuration - Cloudflare R2 via Worker
    server: create_server_config(endpoint, wrapper, url_input),
  });

  // Hide FilePond's root element (custom UI handles all visuals)
  var filepond_root = pond.element;
  if (filepond_root) {
    filepond_root.style.position = 'absolute';
    filepond_root.style.width = '1px';
    filepond_root.style.height = '1px';
    filepond_root.style.overflow = 'hidden';
    filepond_root.style.opacity = '0';
    filepond_root.style.pointerEvents = 'none';
    filepond_root.setAttribute('aria-hidden', 'true');
  }

  wrapper._pond = pond;
  set_state(wrapper, STATE.IDLE);
}
```

### HTML Structure

```html
<!-- Upload Wrapper -->
<div data-file-upload="wrapper">

  <!-- Hidden inputs -->
  <input type="file" data-file-upload="input" style="display:none">
  <input type="hidden" data-file-upload="url" name="cv_url">

  <!-- IDLE View (visible by default) -->
  <div data-file-upload="idle">
    <div data-file-upload="text">Drag & drop your file or</div>
    <a href="#" data-file-upload="browse">Browse</a>
    <div data-file-upload="description">Max 5 MB: PDF, DOC, DOCX, TXT, MD, ODT, RTF</div>
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

### State Machine

| State | CSS Class | Trigger | Exit |
|-------|-----------|---------|------|
| **IDLE** | *(none)* | Initial, file removed, error dismissed | File added |
| **UPLOADING** | `is--uploading` | `addfile` event (no error) | Upload completes or fails |
| **COMPLETE** | `is--complete` | `processfile` event | File removed |
| **ERROR** | `is--error` | `warning` event, `addfile` error | Click to dismiss |

### Plugin Registration

```javascript
// Source: src/2_javascript/form/input_upload.js
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

### Public API

```javascript
// Source: src/2_javascript/form/input_upload.js
window.InputUpload = {
  init: init,                              // Re-initialize (after SPA navigation)
  cleanup: cleanupFilepondInstances,       // Cleanup all instances
  getInstance: function (wrapper) {        // Get FilePond instance from wrapper
    return wrapper._pond || null;
  },
};

// Also available as legacy globals:
window.initFilepondConnector = init;
window.getFilepondInstance = function (wrapper) { return wrapper._pond || null; };
window.cleanupFilepondInstances = function () { /* destroys all instances */ };
```

### Source Files

- `src/2_javascript/form/input_upload.js` — Full FilePond connector (948 lines)
- `src/2_javascript/z_minified/form/input_upload.min.js` — Minified CDN version
- See **[form_upload_workflows.md](../form_upload_workflows/overview_architecture_and_filepond.md)** for complete architecture reference, including:
  - Full pipeline: browser → FilePond → Worker → R2 → Formspark
  - Upload URL validation guards (connector-level and form-level)
  - Extension alias fallback mechanism
  - Validation error mapping for wording variants
  - R2 bucket configuration (separate buckets for user files vs. project assets)
  - MIME type detection and browser compatibility notes

---

