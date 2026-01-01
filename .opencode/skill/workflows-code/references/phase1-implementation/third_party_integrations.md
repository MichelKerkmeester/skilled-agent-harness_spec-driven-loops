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
// Standard CDN loading pattern
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
// Check for Safari native HLS support vs HLS.js requirement
const test_video = document.createElement('video');
const safari_native = !!test_video.canPlayType('application/vnd.apple.mpegurl');
const can_use_hls_js = !!(window.Hls && Hls.isSupported()) && !safari_native;
```

### Basic Setup

```javascript
// Safari uses native HLS, other browsers use HLS.js
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

```javascript
let botpoison_loader = null;

async function load_botpoison_sdk() {
  if (typeof window.Botpoison !== 'undefined') {
    return true;
  }
  
  if (botpoison_loader) {
    return botpoison_loader;
  }
  
  botpoison_loader = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = BOTPOISON_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      botpoison_loader = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });
  
  return botpoison_loader;
}
```

### Challenge Flow

```javascript
const botpoison_clients = new Map();
const MAX_CLIENTS = 10;

async function solve_botpoison_token(form) {
  const public_key = form.getAttribute('data-botpoison-public-key')?.trim();
  if (!public_key) return null;
  
  const loaded = await load_botpoison_sdk();
  if (!loaded || typeof window.Botpoison === 'undefined') return null;
  
  // Reuse client instances (max 10 cached)
  if (!botpoison_clients.has(public_key)) {
    if (botpoison_clients.size >= MAX_CLIENTS) {
      const first = botpoison_clients.keys().next().value;
      botpoison_clients.delete(first);
    }
    botpoison_clients.set(public_key, new window.Botpoison({ publicKey: public_key }));
  }
  
  const client = botpoison_clients.get(public_key);
  
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 10000)
    );
    const result = await Promise.race([client.challenge(), timeout]);
    return result?.token || result?.solution || null;
  } catch {
    return null;
  }
}
```

### Form Integration

```html
<form data-botpoison-public-key="pk_abc123...">
  <!-- form fields -->
</form>
```

```javascript
async function submit_form(form) {
  const form_data = new FormData(form);
  
  // Solve challenge before submission
  const token = await solve_botpoison_token(form);
  if (token) {
    form_data.set('_botpoison', token);
  }
  
  // Submit with token
  await fetch(form.action, {
    method: 'POST',
    body: form_data
  });
}
```

### Source Files

- `src/2_javascript/form/form_submission.js:93-167` - Full implementation

---

## 5. ⚙️ FINSWEET ATTRIBUTES

Webflow enhancement library providing CMS filtering, sorting, and other utilities.

### Script Loading

```html
<!-- Cookie consent component -->
<script async 
  src="https://cdn.jsdelivr.net/npm/@finsweet/cookie-consent@1/fs-cc.js"
  fs-cc-mode="opt-in">
</script>
```

### Integration Notes

- Finsweet scripts are self-initializing
- Use data attributes for configuration
- Scripts load asynchronously and handle their own initialization
- Check Finsweet documentation for specific attribute patterns

---

## 6. ✅ BEST PRACTICES

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

## 7. 📋 LIBRARY SUMMARY

| Library | CDN | Version | Purpose |
|---------|-----|---------|---------|
| HLS.js | jsdelivr | 1.6.11 | Adaptive video streaming |
| Lenis | jsdelivr | latest | Smooth scrolling |
| Botpoison | unpkg | latest | Form spam protection |
| Finsweet | jsdelivr | 1.x | Webflow enhancements |

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [code_quality_standards.md](./code_quality_standards.md) - CDN-safe initialization pattern for all library integrations
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns for library loading
- [performance_patterns.md](./performance_patterns.md) - Lazy loading and code splitting strategies
