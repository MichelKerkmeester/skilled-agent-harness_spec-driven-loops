---
title: Third-Party Library Integrations
description: Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns.
---

# Third-Party Library Integrations

Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns following code quality standards.

---

## 1. 📖 OVERVIEW

### Purpose
Reference guide for integrating external JavaScript libraries in Webflow projects.

### When to Use
- Integrating new third-party libraries
- Managing dependencies (CDN, versions)
- Handling external script loading

### Integration Principles

1. **CDN-first loading** - Use jsDelivr or unpkg for reliable delivery
2. **Version pinning** - Always pin to specific versions for stability
3. **Feature detection** - Check library availability before use
4. **Graceful fallbacks** - Handle missing/failed libraries gracefully
5. **Memory management** - Proper cleanup to prevent leaks

### Loading Pattern

```javascript
const LIBRARY_CDN_URL = 'https://cdn.jsdelivr.net/npm/library@1.0.0';

async function load_library() {
  if (typeof window.Library !== 'undefined') {
    return true;
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = LIBRARY_CDN_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
```

---

## 2. 🎬 HLS.JS (VIDEO STREAMING)

HTTP Live Streaming library for adaptive video playback in non-Safari browsers.

### CDN URL

```html
<!-- Preload for critical video pages -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/hls.js@1.6.11" as="script">

<!-- Load with defer -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.6.11" defer></script>
```

### Feature Detection

```javascript
const test_video = document.createElement('video');
const safari_native = !!test_video.canPlayType('application/vnd.apple.mpegurl');
const can_use_hls_js = !!(window.Hls && Hls.isSupported()) && !safari_native;
```

### Basic Setup

```javascript
if (safari_native) {
  video.src = hls_source_url;
  video.addEventListener('loadedmetadata', on_ready, { once: true });
} else if (can_use_hls_js) {
  const hls = new Hls({ maxBufferLength: 8 }); // Low buffer for hover videos
  hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(hls_source_url));
  hls.on(Hls.Events.MANIFEST_PARSED, on_ready);
  hls.attachMedia(video);
  player._hls = hls; // Store reference for cleanup
}
```

### Error Handling

```javascript
hls.on(Hls.Events.ERROR, function(event, data) {
  if (!data.fatal) return;
  
  switch (data.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      console.warn('Network error, attempting recovery');
      hls.startLoad();
      break;
    case Hls.ErrorTypes.MEDIA_ERROR:
      console.warn('Media error, attempting recovery');
      hls.recoverMediaError();
      break;
    default:
      console.error('Fatal HLS error:', data);
      hls.destroy();
  }
});
```

### Cleanup Pattern

```javascript
function cleanup_hls_player(player) {
  if (player._hls) {
    try { player._hls.destroy(); } catch (_) {}
    player._hls = null;
  }
  
  const video = player.querySelector('video');
  if (video) {
    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch (_) {}
  }
}
```

### When to Use

- **Use HLS.js** for:
  - Adaptive bitrate streaming (ABR)
  - Long-form video content
  - Variable network conditions
  - Quality level switching

- **Use native video** for:
  - Short clips (<30 seconds)
  - Single-quality sources
  - Safari-only deployments

### Source Files

- `src/2_javascript/video/video_background_hls_hover.js` - Hover player with lazy loading
- `src/2_javascript/video/video_background_hls.js` - Background autoplay player
- `src/2_javascript/video/video_player_hls.js` - Full player with controls
- `src/2_javascript/video/video_player_hls_scroll.js` - Scroll-triggered player

---

## 3. 🖱️ LENIS (SMOOTH SCROLL)

Smooth scroll library providing momentum-based scrolling with global accessibility.

### CDN URL

```html
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@latest"></script>
```

### Global Access Pattern

Lenis exposes a global instance at `window.lenis` for cross-script coordination:

```javascript
// Scroll to target element
if (window.lenis) {
  window.lenis.scrollTo(target_element, {
    offset: -100,
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
}
```

### Integration with Modals

```javascript
// Stop Lenis during modal open to prevent background scrolling
function open_modal() {
  if (window.lenis?.stop) {
    window.lenis.stop();
  }
  // ... modal open logic
}

function close_modal() {
  if (window.lenis?.start) {
    window.lenis.start();
  }
  // ... modal close logic
}
```

### Usage in Codebase

- Table of Contents smooth scrolling: `src/2_javascript/cms/table_of_content.js:363`
- Cookie consent modal: `src/2_javascript/modal/modal_cookie_consent.js:955`
- Welcome modal: `src/2_javascript/modal/modal_welcome.js:456`
- Form submission focus lock: `src/2_javascript/form/form_submission.js:178`

---

## 4. 🛡️ BOTPOISON (SPAM PROTECTION)

Invisible captcha alternative for form spam protection without user friction.

### CDN URL

```javascript
const BOTPOISON_SDK_URL = 'https://unpkg.com/@botpoison/browser';
```

### Loading Pattern

The SDK is loaded lazily on first form submission to avoid blocking page load.

```javascript
// Source: src/2_javascript/form/form_submission.js:47-117
let botpoison_loader = null;

async function load_botpoison_sdk() {
  if (typeof window.Botpoison !== 'undefined') {
    return true;
  }

  // Deduplicate concurrent load requests
  if (botpoison_loader) {
    return botpoison_loader;
  }

  botpoison_loader = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = BOTPOISON_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);  // Graceful degradation
    document.head.appendChild(script);
  }).then((loaded) => {
    if (!loaded) {
      botpoison_loader = null;  // Allow retry on failure
    }
    return loaded;
  });

  return botpoison_loader;
}
```

### Challenge Flow with Timeout

The challenge solving includes timeout protection and client instance caching.

```javascript
// Source: src/2_javascript/form/form_submission.js:119-179
const botpoison_clients = new Map();
const MAX_BOTPOISON_CLIENTS = 10;
const BOTPOISON_TIMEOUT_MS = 10000;

async function solve_botpoison_token(form) {
  // Support multiple attribute names for flexibility
  const raw_key = form.getAttribute('data-botpoison-public-key') ||
                  form.getAttribute('data-botpoison-key') ||
                  '';
  const public_key = raw_key.trim();
  if (!public_key) return null;

  const sdk_loaded = await load_botpoison_sdk();
  if (!sdk_loaded || typeof window.Botpoison === 'undefined') return null;

  // LRU-style client caching (max 10 instances)
  if (!botpoison_clients.has(public_key)) {
    if (botpoison_clients.size >= MAX_BOTPOISON_CLIENTS) {
      const first_key = botpoison_clients.keys().next().value;
      botpoison_clients.delete(first_key);
    }
    botpoison_clients.set(public_key, new window.Botpoison({ publicKey: public_key }));
  }

  const client = botpoison_clients.get(public_key);

  try {
    const challenge = client.challenge();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Botpoison timeout')), BOTPOISON_TIMEOUT_MS)
    );

    const result = await Promise.race([challenge, timeout]);
    if (!result) return null;

    const token =
      (typeof result.token === 'string' && result.token) ||
      (typeof result.solution === 'string' && result.solution) ||
      '';

    return token || null;
  } catch (error) {
    const errorMessage = error?.message || 'Unknown error';
    const errorType = errorMessage === 'Botpoison timeout' ? 'TIMEOUT' : 'ERROR';

    console.error(`[Botpoison] Verification failed (${errorType}):`, errorMessage);

    if (window.gtag) {
      window.gtag('event', 'botpoison_error', {
        error_type: errorType,
        error_message: errorMessage
      });
    }

    // Graceful degradation - form still works without bot protection
    return null;
  }
}
```

### Form Integration

```html
<!-- Attribute on form element -->
<form data-botpoison-public-key="pk_abc123..." data-formspark-url="https://submit-form.com/xxx">
  <!-- form fields -->
</form>
```

```javascript
// Source: src/2_javascript/form/form_submission.js:548-567
async function handle_submit(event) {
  const form_data = new FormData(this.form);

  const botpoison_key = (
    this.form.getAttribute('data-botpoison-public-key') ||
    this.form.getAttribute('data-botpoison-key') ||
    ''
  ).trim();
  const botpoison_required = botpoison_key.length > 0;

  const botpoison_token = botpoison_required
    ? await solve_botpoison_token(this.form)
    : null;

  // Fail submission if Botpoison is required but challenge failed
  if (botpoison_required && !botpoison_token) {
    throw new Error('Botpoison challenge failed');
  }

  if (botpoison_token) {
    form_data.set('_botpoison', botpoison_token);
  }

  await this.submit_with_retry(form_data);
}
```

### Error Handling Best Practices

```javascript
try {
  const token = await solve_botpoison_token(form);
  if (token) {
    form_data.set('_botpoison', token);
  }
  // Continue with submission even if token is null (graceful degradation)
} catch (error) {
  console.warn('Botpoison unavailable, continuing without bot protection');
  if (window.gtag) {
    window.gtag('event', 'botpoison_unavailable');
  }
}
```

### Source Files

- `src/2_javascript/form/form_submission.js:18-19` - Configuration constants
- `src/2_javascript/form/form_submission.js:93-117` - SDK loading
- `src/2_javascript/form/form_submission.js:119-179` - Token solving with timeout
- `src/2_javascript/form/form_submission.js:548-567` - Form integration

---

## 5. ⚙️ FINSWEET ATTRIBUTES

Webflow enhancement library providing CMS filtering, sorting, cookie consent, and other utilities.

### CDN URLs

```html
<!-- Cookie Consent (Consent Pro) -->
<script async
  src="https://cdn.jsdelivr.net/npm/@finsweet/cookie-consent@1/fs-cc.js"
  fs-cc-mode="opt-in">
</script>

<!-- CMS Filter -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js"></script>

<!-- CMS Sort -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmssort@1/cmssort.js"></script>

<!-- CMS Load -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js"></script>
```

### Consent Pro Integration

The cookie consent modal integrates with Finsweet Consent Pro for GDPR compliance.

#### Attribute Patterns

```html
<!-- Consent form structure -->
<form fs-consent-element="form">
  <button fs-consent-element="allow">Accept All</button>
  <button fs-consent-element="deny">Reject All</button>
  <button type="submit">Save Preferences</button>
</form>

<!-- Open preferences button (can be placed anywhere) -->
<button fs-consent-element="open-preferences">Manage Cookies</button>

<!-- Close button -->
<button fs-consent-element="close">Close</button>
```

#### Consent Detection Pattern

```javascript
// Source: src/2_javascript/modal/modal_cookie_consent.js:800-869
function has_consent() {
  try {
    const cookies = document.cookie
      .split(';')
      .map((part) => part.trim())
      .filter((part) => part.length);

    const consentCookie = get_cookie_value(cookies, 'fs-consent');
    if (consentCookie) {
      const parsed = parse_json(consentCookie);
      if (consent_record_indicates_decision(parsed)) return true;
      return true; // Presence alone implies interaction
    }

    const consentStatus = get_cookie_value(cookies, 'fs-consent-status');
    if (consentStatus && consentStatus !== 'pending') {
      return true;
    }

    // Check for non-essential category grants (not just essential/security)
    const NON_ESSENTIAL = [
      'fs-consent-analytics_storage',
      'fs-consent-ad_storage',
      'fs-consent-ad_user_data',
      'fs-consent-ad_personalization',
      'fs-consent-personalization_storage',
    ];

    const hasNonEssentialGrant = cookies.some((cookie) => {
      const equalIndex = cookie.indexOf('=');
      if (equalIndex === -1) return false;
      const name = cookie.substring(0, equalIndex);
      const value = cookie.substring(equalIndex + 1);
      if (!NON_ESSENTIAL.includes(name)) return false;
      return value && value !== 'false' && value !== 'denied';
    });
    if (hasNonEssentialGrant) return true;

    const stored =
      window.localStorage?.getItem('fs-consent_preferences') ||
      window.localStorage?.getItem('fs-consent');
    if (stored) return true;

  } catch (_) {
    /* ignore storage access errors */
  }
  return false;
}
```

#### fsAttributes Queue Pattern

```javascript
// Source: src/2_javascript/modal/modal_cookie_consent.js:1233-1291
function bind_consent_status_listener() {
  // Initialize fsAttributes array if needed (works even before Consent Pro loads)
  window.fsAttributes = window.fsAttributes || [];

  // Push callback to queue - will execute when Consent Pro initializes
  window.fsAttributes.push([
    'consent',
    (consent) => {
      if (!consent || typeof consent !== 'object') return;

      const update = (reason = 'fs-consent-update') => {
        if (state.consent_resolved) return;

        if (typeof consent.status === 'string' && consent.status === 'complete') {
          handle_consent_action('fs-consent-complete');
          return;
        }
      };

      update('fs-consent-initial');

      if (typeof consent.on === 'function') {
        consent.on('change', () => update('fs-consent-change'));
        consent.on('save', () => update('fs-consent-save'));
      }
    },
  ]);
}
```

### CMS Sort Bridge Pattern

When using custom select components with Finsweet CMS Sort, a bridge is needed to sync state.

```javascript
// Source: src/2_javascript/form/input_select_fs_bridge.js:1-139
const FS_ATTR = 'fs-list-element';
const FS_VALUE = 'sort-trigger';

// Finsweet list-sort requires a native select to detect changes
function create_hidden_select(custom_select_instance) {
  const container = custom_select_instance.container;
  const options = custom_select_instance.options;

  const native_select = document.createElement('select');
  native_select.setAttribute(FS_ATTR, FS_VALUE);

  // Hide visually but keep accessible to Finsweet
  native_select.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    pointer-events: none;
  `;

  options.forEach((custom_opt) => {
    const native_opt = document.createElement('option');
    native_opt.value = custom_opt.dataset.value || '';
    native_opt.textContent = custom_opt.textContent.trim();
    native_select.appendChild(native_opt);
  });

  container.appendChild(native_select);

  // Remove attribute from wrapper so Finsweet only sees the native select
  container.removeAttribute(FS_ATTR);

  return native_select;
}

function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

#### Usage

```html
<!-- Custom select with Finsweet sort trigger -->
<div data-select="wrapper" fs-list-element="sort-trigger">
  <input data-select="input" readonly />
  <div data-select="dropdown">
    <div data-select="option" data-value="date-desc">Newest First</div>
    <div data-select="option" data-value="date-asc">Oldest First</div>
  </div>
</div>
```

### CMS Load/Filter Initialization

```javascript
// Source: src/0_html/blog.html:54
script.setAttribute("fs-list", "");

// Alternative: Hook into fsAttributes queue
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    listInstances.forEach((instance) => {
      // Custom logic after CMS items load
    });
  },
]);
```

### Integration Notes

1. **Self-initializing** - Finsweet scripts handle their own initialization
2. **Data attribute configuration** - Use `fs-*` attributes for configuration
3. **Queue pattern** - Use `window.fsAttributes.push()` for callbacks
4. **Event-driven** - Listen for `change`, `save`, `load` events via `.on()` method

### Source Files

- `src/2_javascript/modal/modal_cookie_consent.js` - Full Consent Pro integration (1419 lines)
- `src/2_javascript/form/input_select_fs_bridge.js` - CMS Sort bridge for custom selects
- `src/0_html/blog.html:54` - CMS List initialization example

---

## 6. 📁 FILEPOND (FILE UPLOAD)

FilePond is a flexible file upload library with drag-and-drop, image preview, and progress indicators.

### CDN URLs

```html
<!-- Core library -->
<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet">
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>

<!-- File type validation plugin -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js"></script>

<!-- File size validation plugin -->
<script src="https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js"></script>
```

### Configuration

```javascript
// Source: src/2_javascript/form/input_upload.js:11-31
const SELECTORS = {
  wrapper: '[data-file-upload="wrapper"]',
  input: '[data-file-upload="input"]',
  url: '[data-file-upload="url"]',
  config: '[data-file-upload="config"]',
};

const CSS_CLASSES = {
  success: 'is--success',
  error: 'is--error',
};

const DEFAULTS = {
  max_size: '5MB',
  accepted_types: 'application/pdf,.doc,.docx',
  upload_endpoint: 'https://r2-upload-proxy.cloudflare-decorated911.workers.dev',
};
```

### Label Management (i18n Support)

```javascript
// Source: src/2_javascript/form/input_upload.js:33-103
const DEFAULT_LABELS = {
  // Main labels
  label_idle: 'Drag & drop your file or <span class="filepond--label-action">Browse</span>',
  label_file_processing: 'Uploading...',
  label_file_processing_complete: 'Upload complete',
  label_file_processing_error: 'Error during upload',
  label_tap_to_cancel: 'tap to cancel',
  label_tap_to_retry: 'tap to retry',
  label_tap_to_undo: 'tap to undo',

  // Validation messages
  label_file_type_not_allowed: 'Invalid file type',
  label_max_file_size_exceeded: 'File is too large',
  label_max_file_size: 'Maximum size is {filesize}',

  // Alert messages (for form validation)
  alert_uploading: 'Please wait for the file to finish uploading.',
  alert_required: 'Please upload a file before submitting.',

  // Server error messages
  error_invalid_response: 'Invalid server response',
  error_upload_failed: 'Upload failed',
  error_network: 'Network error - check your connection',
};

// Get labels from config element or use defaults
function get_labels(wrapper) {
  const config_el = wrapper.querySelector(SELECTORS.config);
  const labels = { ...DEFAULT_LABELS };

  if (config_el) {
    Object.keys(DEFAULT_LABELS).forEach(key => {
      const dataset_key = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (config_el.dataset[dataset_key]) {
        labels[key] = config_el.dataset[dataset_key];
      }
    });
  }

  // CMS-connectable error messages on wrapper element
  if (wrapper.dataset.errorAccept) {
    labels.label_file_type_not_allowed = wrapper.dataset.errorAccept;
  }
  if (wrapper.dataset.errorSize) {
    labels.label_max_file_size_exceeded = wrapper.dataset.errorSize;
  }

  return labels;
}
```

### R2 Integration via Cloudflare Worker

```javascript
// Source: src/2_javascript/form/input_upload.js:153-230
function create_server_config(upload_endpoint, url_input, wrapper, labels) {
  return {
    process: (field_name, file, metadata, load, error, progress, abort) => {
      const form_data = new FormData();
      form_data.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', upload_endpoint);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progress(true, e.loaded, e.total);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);

            if (response.error) {
              error(response.error);
              return;
            }

            url_input.value = response.url;

            // Signal success to FilePond
            load(response.url);

            wrapper.classList.remove(CSS_CLASSES.error);
            wrapper.classList.add(CSS_CLASSES.success);

          } catch (e) {
            error(labels.error_invalid_response);
          }
        } else {
          error(`${labels.error_upload_failed}: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        error(labels.error_network);
        wrapper.classList.add(CSS_CLASSES.error);
      };

      xhr.send(form_data);

      return {
        abort: () => {
          xhr.abort();
          abort();
        },
      };
    },

    revert: (unique_file_id, load, error) => {
      url_input.value = '';
      wrapper.classList.remove(CSS_CLASSES.success, CSS_CLASSES.error);
      load();
    },
  };
}
```

### FilePond Instance Creation

```javascript
// Source: src/2_javascript/form/input_upload.js:236-310
function init_single_upload(wrapper) {
  const input = wrapper.querySelector(SELECTORS.input);
  const url_input = wrapper.querySelector(SELECTORS.url);

  const upload_endpoint = wrapper.dataset.uploadEndpoint || DEFAULTS.upload_endpoint;
  const max_size = wrapper.dataset.maxSize || DEFAULTS.max_size;
  const accepted_types = wrapper.dataset.acceptedTypes || DEFAULTS.accepted_types;

  const labels = get_labels(wrapper);

  const accepted_types_array = accepted_types.split(',').map(t => t.trim());

  const pond = FilePond.create(input, {
    // Prevent FilePond from submitting with form (we use hidden url input instead)
    name: '',

    maxFiles: 1,
    allowMultiple: false,
    stylePanelLayout: 'compact',
    styleButtonRemoveItemPosition: 'right',
    credits: false,
    required: false, // Prevent native browser validation

    ...to_filepond_labels(labels),

    acceptedFileTypes: accepted_types_array,
    maxFileSize: max_size,

    // Server configuration - Cloudflare R2 via Worker
    server: create_server_config(upload_endpoint, url_input, wrapper, labels),
  });

  // Store pond instance and labels on wrapper for external access
  wrapper._filePond = pond;
  wrapper._labels = labels;

  // Mark FilePond's file input to skip blur validation
  const filepond_root = wrapper.querySelector('.filepond--root');
  if (filepond_root) {
    const filepond_browser = filepond_root.querySelector('.filepond--browser');
    if (filepond_browser) {
      filepond_browser.setAttribute('data-validate-on-submit-only', '');
      filepond_browser.removeAttribute('required');
    }
  }
}
```

### HTML Structure

```html
<!-- File upload wrapper -->
<div data-file-upload="wrapper"
     data-upload-endpoint="https://your-worker.workers.dev"
     data-max-size="10MB"
     data-accepted-types="application/pdf,.doc,.docx">

  <!-- Hidden URL input (receives R2 URL after upload) -->
  <input type="hidden" name="cv_url" data-file-upload="url" />

  <!-- FilePond target input -->
  <input type="file" data-file-upload="input" />

  <!-- Optional: Config element for i18n labels -->
  <div data-file-upload="config"
       data-label-idle="Sleep je bestand of <span class='filepond--label-action'>blader</span>"
       data-label-file-processing="Uploaden..."
       data-label-file-processing-complete="Upload voltooid"
       style="display: none;">
  </div>
</div>
```

### Form Integration

```javascript
// Source: src/2_javascript/form/input_upload.js:316-347
function bind_form_events(wrapper, pond, input, url_input, labels) {
  const form = wrapper.closest('form');
  if (!form) return;

  // Block form submission while uploading
  form.addEventListener('submit', (e) => {
    const files = pond.getFiles();
    const uploading_files = files.filter(f =>
      f.status !== FilePond.FileStatus.PROCESSING_COMPLETE &&
      f.status !== FilePond.FileStatus.IDLE
    );

    if (uploading_files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      alert(labels.alert_uploading);
      return false;
    }
  }, true);

  form.addEventListener('reset', () => {
    setTimeout(() => {
      pond.removeFiles();
      url_input.value = '';
      wrapper.classList.remove(CSS_CLASSES.success, CSS_CLASSES.error);
    }, 0);
  });
}
```

### Plugin Registration

```javascript
// Source: src/2_javascript/form/input_upload.js:136-151
function register_plugins() {
  const plugins = [];

  if (typeof FilePondPluginFileValidateType !== 'undefined') {
    plugins.push(FilePondPluginFileValidateType);
  }

  if (typeof FilePondPluginFileValidateSize !== 'undefined') {
    plugins.push(FilePondPluginFileValidateSize);
  }

  if (plugins.length > 0) {
    FilePond.registerPlugin(...plugins);
  }
}
```

### Public API

```javascript
// Source: src/2_javascript/form/input_upload.js:401-407
function get_filepond_instance(wrapper) {
  return wrapper._filePond || null;
}

window.init_file_uploads = init_file_uploads;
window.get_filepond_instance = get_filepond_instance;
```

### Error Handling Patterns

```javascript
xhr.onerror = () => {
  error(labels.error_network);
  wrapper.classList.add(CSS_CLASSES.error);
};

xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    try {
      const response = JSON.parse(xhr.responseText);
      if (response.error) {
        error(response.error);
        return;
      }
    } catch (e) {
      error(labels.error_invalid_response);
    }
  } else {
    error(`${labels.error_upload_failed}: ${xhr.status}`);
  }
};
```

### Source Files

- `src/2_javascript/form/input_upload.js` - Full FilePond implementation (409 lines)

---

## 7. ✅ BEST PRACTICES

### CDN Loading Pattern

```javascript
// ✅ Good: Version pinned, async, error handled
const CDN_URL = 'https://cdn.jsdelivr.net/npm/library@1.2.3';

async function load_with_timeout(url, timeout_ms = 10000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeout_ms);
    
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => { clearTimeout(timer); resolve(true); };
    script.onerror = () => { clearTimeout(timer); resolve(false); };
    document.head.appendChild(script);
  });
}

// ❌ Bad: No version, no error handling
document.write('<script src="https://cdn.example.com/lib.js"></script>');
```

### Version Pinning

```javascript
// ✅ Pinned to specific version
'https://cdn.jsdelivr.net/npm/hls.js@1.6.11'

// ✅ Pinned to specific minor version
'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0'

// ❌ Avoid: Latest tag can break unexpectedly
'https://cdn.jsdelivr.net/npm/library@latest'

// ❌ Avoid: Unpinned versions
'https://cdn.jsdelivr.net/npm/library'
```

### Fallback Strategies

```javascript
// Pattern: Retry loader for race conditions
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 120;
let retry_count = 0;

function init_with_library() {
  if (typeof Library === 'undefined') {
    if (++retry_count < MAX_RETRIES) {
      console.warn(`Library not ready, retry ${retry_count}/${MAX_RETRIES}`);
      setTimeout(init_with_library, RETRY_DELAY_MS);
      return;
    }
    console.error('Library failed to load');
    return;
  }
  
  retry_count = 0;
  // ... initialization code
}
```

### Error Boundaries

```javascript
// Wrap third-party calls in try-catch
function safe_library_call(action) {
  try {
    return action();
  } catch (error) {
    console.warn('Library error:', error);
    return null;
  }
}

// Usage
safe_library_call(() => {
  window.lenis?.scrollTo(target);
});
```

### Preload Critical Libraries

```html
<!-- In <head> for critical path libraries -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/hls.js@1.6.11" as="script">

<!-- Then load with defer in body -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.6.11" defer></script>
```

### Cleanup on Destroy

```javascript
// Always provide cleanup for dynamically loaded libraries
function destroy_player(player) {
  // 1. Stop any pending operations
  if (player._abort_controller) {
    player._abort_controller.abort();
  }
  
  // 2. Remove event listeners
  if (player._cleanup_handlers) {
    player._cleanup_handlers.forEach(fn => fn());
  }
  
  // 3. Destroy library instances
  if (player._hls) {
    try { player._hls.destroy(); } catch (_) {}
    player._hls = null;
  }
  
  // 4. Clear element references
  player._video = null;
  player._container = null;
}
```

---

## 8. 📋 LIBRARY SUMMARY

| Library | CDN | Version | Purpose |
|---------|-----|---------|---------|
| HLS.js | jsdelivr | 1.6.11 | Adaptive video streaming |
| Lenis | jsdelivr | latest | Smooth scrolling |
| Botpoison | unpkg | latest | Form spam protection |
| Finsweet | jsdelivr | 1.x | Webflow enhancements (CMS, consent) |
| FilePond | unpkg | latest | File upload with R2 integration |

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [code_quality_standards.md](../standards/code_quality_standards.md) - CDN-safe initialization pattern for all library integrations
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns for library loading
- [performance_patterns.md](./performance_patterns.md) - Lazy loading and code splitting strategies
