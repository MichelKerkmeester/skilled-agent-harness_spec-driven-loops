---
title: Botpoison Spam Protection & Finsweet Attributes
description: Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns. — Botpoison Spam Protection & Finsweet Attributes.
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Botpoison Spam Protection & Finsweet Attributes

## 4. BOTPOISON (SPAM PROTECTION)

Invisible captcha alternative for form spam protection without user friction.

### CDN URL

```javascript
const BOTPOISON_SDK_URL = 'https://unpkg.com/@botpoison/browser';
```

### Loading Pattern

The SDK is loaded lazily on first form submission to avoid blocking page load.

```javascript
// Source: src/javascript/form/form_submission.js:47-117
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
// Source: src/javascript/form/form_submission.js:119-179
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
// Source: src/javascript/form/form_submission.js:548-567
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

- `src/javascript/form/form_submission.js:18-19` - Configuration constants
- `src/javascript/form/form_submission.js:93-117` - SDK loading
- `src/javascript/form/form_submission.js:119-179` - Token solving with timeout
- `src/javascript/form/form_submission.js:548-567` - Form integration

---

## 5. FINSWEET ATTRIBUTES

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
// Source: src/javascript/modal/modal_cookie_consent.js:800-869
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
// Source: src/javascript/modal/modal_cookie_consent.js:1233-1291
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
// Source: src/javascript/form/input_select_fs_bridge.js:1-139
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
// Source: src/html/blog.html:54
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

- `src/javascript/modal/modal_cookie_consent.js` - Full Consent Pro integration (1419 lines)
- `src/javascript/form/input_select_fs_bridge.js` - CMS Sort bridge for custom selects
- `src/html/blog.html:54` - CMS List initialization example

---
