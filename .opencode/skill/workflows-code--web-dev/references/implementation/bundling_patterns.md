---
title: JavaScript & CSS Bundling Patterns
description: Comprehensive bundling patterns for JavaScript and CSS including page-specific loading strategies, build configuration, and bundle organization.
---

# JavaScript & CSS Bundling Patterns

Comprehensive bundling patterns for JavaScript and CSS including page-specific loading strategies, build configuration, and bundle organization.

---

## 1. 📖 OVERVIEW

### Purpose

This reference documents bundling patterns for JavaScript and CSS optimization. Bundling reduces HTTP requests, improves caching, and enables page-specific code loading for better performance.

### When to Use This Reference

- 10+ JavaScript files loading globally
- Page-specific functionality (forms, video, blog features)
- Bundle size > 100KB per page
- Repeat code across multiple files
- Multiple HTTP requests slowing page load

### When NOT to Bundle

- Small sites with < 5 JS files
- All scripts already minified and small (< 50KB total)
- Using native ES modules with HTTP/2
- Simple landing pages with minimal interactivity

### Core Principle

**Page-specific loading**: Load only the JavaScript and CSS needed for each page type, reducing initial payload and improving Time to Interactive (TTI).

---

## 2. 📦 BUNDLE STRATEGY

### Page-Specific Bundles

| Bundle     | Purpose                  | Load On       | Typical Size |
| ---------- | ------------------------ | ------------- | ------------ |
| core.js    | Universal functionality  | All pages     | 20-40KB      |
| form.js    | Form handling, validation| Form pages    | 15-25KB      |
| video.js   | Video players, controls  | Video pages   | 10-20KB      |
| blog.js    | Blog-specific features   | Blog pages    | 10-15KB      |
| product.js | Product interactions     | Product pages | 15-25KB      |

### Bundle Entry Pattern

```javascript
// bundles/core.bundle.js
// Re-export all core modules for bundling
// [PATTERN: Entry point aggregates related modules]

export * from '../2_javascript/navigation/nav_dropdown.js';
export * from '../2_javascript/navigation/nav_mobile_menu.js';
export * from '../2_javascript/global/image_lazy_load.js';
export * from '../2_javascript/global/scroll_effects.js';
export * from '../2_javascript/utilities/dom_helpers.js';
```

```javascript
// bundles/form.bundle.js
// Form-specific functionality
// [PATTERN: Domain-specific bundle]

export * from '../2_javascript/forms/form_validation.js';
export * from '../2_javascript/forms/form_submit.js';
export * from '../2_javascript/forms/input_masks.js';
```

```javascript
// bundles/video.bundle.js
// Video player functionality
// [PATTERN: Feature-specific bundle]

export * from '../2_javascript/video/hls_player.js';
export * from '../2_javascript/video/video_controls.js';
export * from '../2_javascript/video/video_analytics.js';
```

### Bundle Size Targets

| Bundle Type | Target Size | Warning Threshold | Critical Threshold |
| ----------- | ----------- | ----------------- | ------------------ |
| Core        | < 40KB      | > 50KB            | > 75KB             |
| Feature     | < 25KB      | > 35KB            | > 50KB             |
| Total/page  | < 100KB     | > 125KB           | > 150KB            |

**Note:** Sizes are minified + gzipped. Use `bundlesize` or esbuild's `--analyze` to monitor.

---

## 3. ⚙️ BUILD CONFIGURATION

### esbuild (Recommended - Fast)

**Single bundle:**
```bash
# Basic bundle
npx esbuild src/bundles/core.bundle.js \
  --bundle \
  --minify \
  --outfile=dist/core.min.js

# With sourcemaps (development)
npx esbuild src/bundles/core.bundle.js \
  --bundle \
  --sourcemap \
  --outfile=dist/core.js
```

**Multiple bundles:**
```bash
# Build all bundles at once
npx esbuild src/bundles/*.bundle.js \
  --bundle \
  --minify \
  --outdir=dist/js
```

**With target browser support:**
```bash
# ES2020 target for modern browsers
npx esbuild src/bundles/core.bundle.js \
  --bundle \
  --minify \
  --target=es2020 \
  --outfile=dist/core.min.js
```

### Rollup Alternative

```javascript
// rollup.config.js
export default [
  {
    input: 'src/bundles/core.bundle.js',
    output: {
      file: 'dist/js/core.min.js',
      format: 'iife',
      name: 'Core'
    },
    plugins: [
      // Add terser for minification
      terser()
    ]
  },
  {
    input: 'src/bundles/form.bundle.js',
    output: {
      file: 'dist/js/form.min.js',
      format: 'iife',
      name: 'FormBundle'
    },
    plugins: [terser()]
  }
];
```

### package.json Scripts

```json
{
  "scripts": {
    "build:js": "esbuild src/bundles/*.bundle.js --bundle --minify --outdir=dist/js",
    "build:css": "esbuild src/css/main.css --bundle --minify --outfile=dist/css/styles.min.css",
    "build": "npm run build:js && npm run build:css",
    "watch": "esbuild src/bundles/*.bundle.js --bundle --outdir=dist/js --watch",
    "analyze": "esbuild src/bundles/*.bundle.js --bundle --minify --metafile=meta.json --outdir=dist/js"
  }
}
```

---

## 4. 🎨 CSS BUNDLING

### CSS Entry File Pattern

```css
/* bundles/main.bundle.css */
/* [PATTERN: Import order matters - base first, utilities last] */

/* Reset and variables */
@import '../css/reset.css';
@import '../css/variables.css';

/* Base styles */
@import '../css/typography.css';
@import '../css/layout.css';

/* Components */
@import '../css/components/buttons.css';
@import '../css/components/forms.css';
@import '../css/components/cards.css';

/* Utilities (last for override priority) */
@import '../css/utilities.css';
```

### esbuild CSS Bundling

```bash
# Bundle and minify CSS
npx esbuild src/bundles/main.bundle.css \
  --bundle \
  --minify \
  --outfile=dist/css/styles.min.css
```

### PostCSS Alternative

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),      // Handle @import
    require('autoprefixer'),        // Add vendor prefixes
    require('cssnano')              // Minify
  ]
};
```

**Build command:**
```bash
npx postcss src/bundles/main.bundle.css -o dist/css/styles.min.css
```

### Critical CSS Pattern

```css
/* bundles/critical.bundle.css */
/* [PATTERN: Above-the-fold styles only - target < 14KB] */

@import '../css/variables.css';
@import '../css/typography-critical.css';
@import '../css/layout-critical.css';
@import '../css/header.css';
@import '../css/hero.css';
```

---

## 5. 📄 HTML LOADING PATTERNS

### Global Scripts (All Pages)

```html
<!-- In <head> or before </body> -->
<!-- Core bundle loads on every page -->
<script src="/js/core.min.js" defer></script>
```

### Conditional Loading (Page-Specific)

**Jinja/Nunjucks template:**
```html
<!-- Only on form pages -->
{% if page.has_form %}
<script src="/js/form.min.js" defer></script>
{% endif %}

<!-- Only on video pages -->
{% if page.has_video %}
<script src="/js/video.min.js" defer></script>
{% endif %}

<!-- Only on blog pages -->
{% if page.template == 'blog' %}
<script src="/js/blog.min.js" defer></script>
{% endif %}
```

### Webflow Custom Code

**In Page Settings > Custom Code > Before </body>:**
```html
<!-- Form page bundle -->
<script src="https://cdn.example.com/js/form.min.js?v=1.0.0" defer></script>
```

**In Site Settings > Custom Code (global):**
```html
<!-- Core bundle on all pages -->
<script src="https://cdn.example.com/js/core.min.js?v=1.0.0" defer></script>
```

### Dynamic Loading (Advanced)

```javascript
// Load bundle only when needed
async function load_form_bundle() {
  if (!window.FormBundle) {
    await import('/js/form.min.js');
  }
  return window.FormBundle;
}

// Usage: Load on form focus
document.querySelector('form')?.addEventListener('focusin', async () => {
  const FormBundle = await load_form_bundle();
  FormBundle.init();
}, { once: true });
```

---

## 6. 📁 FILE ORGANIZATION

### Recommended Structure

```
src/
├── bundles/
│   ├── core.bundle.js       # Entry: global functionality
│   ├── form.bundle.js       # Entry: form pages
│   ├── video.bundle.js      # Entry: video pages
│   ├── blog.bundle.js       # Entry: blog pages
│   └── main.bundle.css      # Entry: all CSS
├── js/
│   ├── navigation/
│   │   ├── nav_dropdown.js
│   │   └── nav_mobile_menu.js
│   ├── forms/
│   │   ├── form_validation.js
│   │   └── form_submit.js
│   ├── video/
│   │   ├── hls_player.js
│   │   └── video_controls.js
│   └── utilities/
│       ├── dom_helpers.js
│       └── event_helpers.js
└── css/
    ├── base/
    │   ├── reset.css
    │   └── variables.css
    ├── components/
    │   ├── buttons.css
    │   └── forms.css
    └── utilities/
        └── utilities.css

dist/
├── js/
│   ├── core.min.js          # Output: ~35KB
│   ├── form.min.js          # Output: ~20KB
│   ├── video.min.js         # Output: ~15KB
│   └── blog.min.js          # Output: ~12KB
└── css/
    └── styles.min.css       # Output: ~25KB
```

### Naming Conventions

| File Type       | Pattern                  | Example                    |
| --------------- | ------------------------ | -------------------------- |
| Entry file      | `{name}.bundle.js`       | `core.bundle.js`           |
| Source module   | `{feature}_{action}.js`  | `form_validation.js`       |
| Output bundle   | `{name}.min.js`          | `core.min.js`              |
| CSS entry       | `{name}.bundle.css`      | `main.bundle.css`          |
| CSS output      | `{name}.min.css`         | `styles.min.css`           |

---

## 7. 🐛 DEBUGGING BUNDLES

### Development vs Production

```bash
# Development (with sourcemaps, no minification)
npx esbuild src/bundles/core.bundle.js \
  --bundle \
  --sourcemap \
  --outfile=dist/core.dev.js

# Production (minified, no sourcemaps)
npx esbuild src/bundles/core.bundle.js \
  --bundle \
  --minify \
  --outfile=dist/core.min.js
```

### Bundle Analysis

```bash
# Generate metafile for analysis
npx esbuild src/bundles/core.bundle.js \
  --bundle \
  --minify \
  --metafile=meta.json \
  --outfile=dist/core.min.js

# View analysis (install esbuild-visualizer)
npx esbuild-visualizer --metadata meta.json --open
```

### Size Monitoring Script

```bash
#!/bin/bash
# scripts/check-bundle-size.sh

MAX_CORE=40960      # 40KB
MAX_FEATURE=25600   # 25KB

check_size() {
  local file=$1
  local max=$2
  local size=$(wc -c < "$file" | tr -d ' ')
  
  if [ "$size" -gt "$max" ]; then
    echo "❌ FAIL: $file is ${size} bytes (max: ${max})"
    return 1
  else
    echo "✅ PASS: $file is ${size} bytes"
    return 0
  fi
}

check_size "dist/js/core.min.js" $MAX_CORE
check_size "dist/js/form.min.js" $MAX_FEATURE
check_size "dist/js/video.min.js" $MAX_FEATURE
```

### Common Issues

| Issue                    | Symptom                      | Solution                           |
| ------------------------ | ---------------------------- | ---------------------------------- |
| Module not found         | Build error                  | Check import paths, file exists    |
| Duplicate code           | Large bundle size            | Extract to shared utility bundle   |
| Missing exports          | Runtime error                | Check export * syntax              |
| Sourcemap not working    | Can't debug minified         | Add --sourcemap flag               |
| IIFE name collision      | Global conflicts             | Use unique bundle names            |

---

## 8. 📋 BUNDLING CHECKLIST

### Before Bundling

```
[ ] Identify page types and their specific JS needs
[ ] Audit current JS files for shared functionality
[ ] Define bundle boundaries (core vs feature-specific)
[ ] Set size budgets per bundle
```

### Build Configuration

```
[ ] Entry files created in bundles/ directory
[ ] esbuild or rollup configured
[ ] npm scripts defined (build, watch, analyze)
[ ] Development sourcemaps enabled
[ ] Production minification enabled
```

### HTML Integration

```
[ ] Core bundle added to global template
[ ] Feature bundles added conditionally
[ ] defer attribute on all script tags
[ ] CDN version parameters set
```

### Verification

```
[ ] All bundles build without errors
[ ] Bundle sizes within budget
[ ] No duplicate code across bundles
[ ] Sourcemaps work in DevTools
[ ] Production build tested in browser
```

---

## 9. 🚫 ANTI-PATTERNS

**Never:**
- ❌ Bundle everything into one massive file (defeats page-specific loading)
- ❌ Import entire libraries when only using small parts
- ❌ Skip minification for production builds
- ❌ Commit dist/ files to version control (build in CI/CD)
- ❌ Use sync script tags without defer/async
- ❌ Forget to update CDN versions after bundle changes

**Always:**
- ✅ Keep core bundle under 40KB
- ✅ Split feature-specific code into separate bundles
- ✅ Use defer on all script tags
- ✅ Include sourcemaps for development
- ✅ Monitor bundle sizes with analysis tools
- ✅ Update version parameters when deploying

---

## 10. 🔗 RELATED RESOURCES

### Reference Files

- [minification_guide.md](../deployment/minification_guide.md) - Terser minification workflow
- [cdn_deployment.md](../deployment/cdn_deployment.md) - CDN upload and version management
- [performance_patterns.md](./performance_patterns.md) - Performance optimization patterns
- [implementation_workflows.md](./implementation_workflows.md) - Implementation phase workflows

### External Documentation

| Resource        | URL                           | Use For                    |
| --------------- | ----------------------------- | -------------------------- |
| esbuild         | esbuild.github.io             | Build tool documentation   |
| Rollup          | rollupjs.org                  | Alternative bundler        |
| bundlesize      | github.com/siddharthkp/bundlesize | Size monitoring CI     |
| source-map-explorer | npm.js/package/source-map-explorer | Bundle analysis    |

### Standards

- **Integration with workflows-code**: Apply during Phase 1 (Implementation) when setting up build pipeline, Phase 3 (Verification) when checking bundle sizes
