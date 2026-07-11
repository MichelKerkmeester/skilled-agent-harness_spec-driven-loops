---
title: Third-Party Library Integrations
description: Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns.
trigger_phrases:
  - "webflow third party libraries"
  - "hls js video streaming"
  - "external library integration"
  - "library loading pattern webflow"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Third-Party Library Integrations

Reference guide for integrating external JavaScript libraries in Webflow projects, with production-tested patterns following code quality standards.

---

## 1. OVERVIEW

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
const LIBRARY_CDN_URL = 'https://cdn.jsdelivr.net/npm/library@{version}';

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

## 2. HLS.JS (VIDEO STREAMING)

HTTP Live Streaming library for adaptive video playback in non-Safari browsers.

### CDN URL

```html
<!-- Preload for critical video pages -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/hls.js@{version}" as="script">

<!-- Load with defer -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@{version}" defer></script>
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

- `src/javascript/video/video_background_hls_hover.js` - Hover player with lazy loading
- `src/javascript/video/video_background_hls.js` - Background autoplay player
- `src/javascript/video/video_player_hls.js` - Full player with controls
- `src/javascript/video/video_player_hls_scroll.js` - Scroll-triggered player

---

## 3. LENIS (SMOOTH SCROLL)

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

- Table of Contents smooth scrolling: `src/javascript/cms/table_of_content.js:363`
- Cookie consent modal: `src/javascript/modal/modal_cookie_consent.js:955`
- Welcome modal: `src/javascript/modal/modal_welcome.js:456`
- Form submission focus lock: `src/javascript/form/form_submission.js:178`

---
