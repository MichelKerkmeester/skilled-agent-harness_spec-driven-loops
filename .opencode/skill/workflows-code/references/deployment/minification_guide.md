---
title: JavaScript Minification Guide
description: Safe minification workflow for Webflow projects with verification to prevent breaking functionality.
---

# JavaScript Minification Guide

Safe minification workflow for Webflow projects with verification to prevent breaking functionality.

---

## 1. 📖 OVERVIEW

### Purpose

Provides systematic workflows for safely minifying JavaScript files using terser, with AST verification and runtime testing to ensure critical patterns are preserved and functionality is not broken.

### When to Use

- After making JavaScript changes that need deployment
- When optimizing file sizes for production
- Before uploading to CDN
- When setting up minification pipeline for new files

### Core Principle

Minification is safe when verified - AST check preserves critical patterns, runtime test catches execution errors, browser test confirms functionality.

### Why Minify?

| Benefit              | Impact                                    |
| -------------------- | ----------------------------------------- |
| File size reduction  | 60-80% smaller files                      |
| Faster page loads    | Less bandwidth, quicker parsing           |
| Bandwidth savings    | Lower CDN costs                           |
| Obfuscation          | Harder to read (minor security benefit)   |

### Risks of Minification

Minification can break code when:
- Dynamic property access uses string-based lookups
- Code relies on function/variable names at runtime
- Global variables are expected by external code
- String literals are incorrectly identified as dead code

**Solution:** Verification pipeline catches these issues before deployment.

---

## 2. ⚙️ TERSER CONFIGURATION

### Basic Command

```bash
npx terser [source] --compress --mangle -o [output]
```

### Options Explained

| Option           | What It Does                                              | Safe?                    |
| ---------------- | --------------------------------------------------------- | ------------------------ |
| `--compress`     | Dead code elimination, constant folding, simplification   | Usually safe             |
| `--mangle`       | Renames local variables to shorter names                  | Usually safe             |
| `--mangle-props` | Renames object properties                                 | **DANGEROUS** - avoid    |

### What `--compress` Does

- Removes unreachable code
- Evaluates constant expressions (`1 + 1` → `2`)
- Simplifies conditionals (`if (true)` → removes check)
- Removes unused variables
- Inlines simple functions

### What `--mangle` Does

- Renames local variables (`myLongVariableName` → `a`)
- Preserves global references (`window`, `document`)
- Preserves string literals
- Preserves property names (unless `--mangle-props`)

### Example

```bash
# Minify single file
npx terser src/2_javascript/hero/hero_video.js --compress --mangle -o src/2_javascript/z_minified/hero/hero_video.js

# Check sizes
wc -c src/2_javascript/hero/hero_video.js src/2_javascript/z_minified/hero/hero_video.js
# Output: 27187 (original) → 8085 (minified) = 70% reduction
```

---

## 3. 🎯 CRITICAL PATTERNS FOR WEBFLOW

These patterns MUST be preserved during minification. The verification scripts check for them.

### Data Attribute Selectors

```javascript
// These string selectors must remain intact
const SELECTORS = {
  section: "[data-target='hero-section']",
  content: "[data-target='hero-content']",
  header: "[data-target='hero-header']",
  item: "[data-target='hero-item']",
};
```

**Why:** Used with `document.querySelector()` - if string changes, elements won't be found.

### Webflow.push Pattern

```javascript
// This pattern integrates with Webflow's lifecycle
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

**Why:** Webflow expects this exact pattern for proper initialization timing.

### Motion.dev / GSAP References

```javascript
// External library references must be preserved
if (window.Motion && typeof window.Motion.animate === 'function') {
  const { animate } = window.Motion;
  // ...
}
```

**Why:** These are global objects loaded from CDN - names cannot change.

### Global Init Flags

```javascript
// Prevent double initialization
const INIT_FLAG = '__heroVideoNoLoaderCdnInit';
if (window[INIT_FLAG]) return;
window[INIT_FLAG] = true;
```

**Why:** Flag name is used as string key - must remain identical.

### DOM Event Names

```javascript
// Event names are strings that must match browser expectations
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', handleResize);
element.addEventListener('click', handleClick);
```

**Why:** Browser APIs expect exact event name strings.

### CSS Property Names

```javascript
// CSS properties used in animations
element.style.opacity = '1';
element.style.transform = 'translateY(0)';
animate(element, { opacity: [0, 1], y: ['4rem', '0px'] });
```

**Why:** Property names must match CSS specification exactly.

---

## 4. 🔄 SAFE MINIFICATION WORKFLOW

### Step 1: Minify with Terser

```bash
npx terser src/2_javascript/[folder]/[file].js \
  --compress \
  --mangle \
  -o src/2_javascript/z_minified/[folder]/[file].js
```

For batch minification of all files:

```bash
node scripts/minify-webflow.mjs
```

### Step 2: AST Verification

```bash
node scripts/verify-minification.mjs
```

**What it checks:**
- All data-attribute selectors preserved
- All DOM event names preserved
- All Webflow/Motion/gsap patterns preserved
- All global init flags preserved
- String literal comparison

**Expected output:**
```
=== VERIFICATION REPORT ===

hero/hero_video.js
  ✓ 8 data-selectors preserved
  ✓ 4 DOM events preserved
  ✓ Webflow patterns preserved
  ✓ Init flag: __heroVideoNoLoaderCdnInit
  RESULT: PASS

=== SUMMARY ===
Passed: 39/39
Failed: 0/39
```

**If FAIL:** Do not proceed - fix issues first.

### Step 3: Runtime Testing

```bash
node scripts/test-minified-runtime.mjs
```

**What it checks:**
- Script executes without throwing errors
- No ReferenceError for undefined variables
- Init flags are properly set
- No syntax errors in minified code

**Expected output:**
```
=== RUNTIME TEST REPORT ===

hero/hero_video.js
  ✓ Script executed without errors
  ✓ Init flag set: __heroVideoNoLoaderCdnInit
  RESULT: PASS

=== SUMMARY ===
Passed: 39/39
Failed: 0/39
```

### Step 4: Browser Testing

```bash
# Start browser session on staging site
bdg https://a-nobel-en-zn.webflow.io/en

# Check console for errors
bdg console logs

# Stop session
bdg stop
```

**What to check:**
- No JavaScript errors in console
- Functionality works as expected
- Animations play correctly
- Interactive elements respond

---

## 5. 🔍 VERIFICATION SCRIPTS REFERENCE

### verify-minification.mjs

**Location:** `scripts/verify-minification.mjs`

**Purpose:** AST-based comparison of original and minified files

**What it extracts:**
- Data attribute selectors (e.g., `[data-target='hero-item']`)
- DOM event names from addEventListener calls
- Global assignments (window.X patterns)
- Webflow/Motion/gsap references

**Usage:**
```bash
node scripts/verify-minification.mjs
```

**Interpreting output:**
- `✓ PASS` - Pattern preserved correctly
- `✗ FAIL` - Critical pattern missing - DO NOT DEPLOY
- `⚠ WARNING` - Non-critical difference - review manually

### test-minified-runtime.mjs

**Location:** `scripts/test-minified-runtime.mjs`

**Purpose:** Execute minified scripts in mock browser environment

**What it mocks:**
- `window.Webflow` - push callbacks
- `window.Motion` - animation library
- `window.matchMedia` - media queries
- `document.fonts` - font loading
- `localStorage` / `sessionStorage`
- `IntersectionObserver` / `ResizeObserver` / `MutationObserver`
- `fetch` - network requests
- `Hls` - video streaming
- `Swiper` - carousels
- `gsap` / `ScrollTrigger` - animations

**Usage:**
```bash
node scripts/test-minified-runtime.mjs
```

**Interpreting output:**
- `✓ PASS` - Script executed without errors
- `✗ FAIL` - Script threw error - shows error message

### minify-webflow.mjs

**Location:** `scripts/minify-webflow.mjs`

**Purpose:** Batch minification of all JavaScript files

**Usage:**
```bash
# Normal run (skips if output exists and unchanged)
node scripts/minify-webflow.mjs

# Force re-minification of all files
node scripts/minify-webflow.mjs --force
```

**Output:**
```
Processing 39 source files...
→ hero/hero_video.js (27187B) -> z_minified/hero/hero_video.js (8085B) [updated]
= form/form_validation.js (50727B) -> z_minified/form/form_validation.js (19303B) [unchanged]
...
Summary:
  Updated: 1
  Unchanged: 38
  Total reduction: 65.89%
```

---

## 6. 🐛 DEBUGGING MINIFICATION ISSUES

### Common Error: "X is not defined"

**Cause:** Variable was mangled but referenced by string elsewhere

**Example:**
```javascript
// Original
const myHandler = () => { ... };
element.setAttribute('onclick', 'myHandler()');  // String reference!

// Minified - BROKEN
const a = () => { ... };  // myHandler renamed to 'a'
element.setAttribute('onclick', 'myHandler()');  // Still looks for 'myHandler'!
```

**Fix:** Don't use string-based function references. Use addEventListener instead.

### Common Error: Missing Selector

**Cause:** Selector string was in "dead code" that got removed

**Example:**
```javascript
// Original
if (DEBUG_MODE) {
  const debugSelector = "[data-debug='true']";  // Only used in debug
  // ...
}

// Minified - selector removed because DEBUG_MODE is false
```

**Fix:** Ensure critical selectors are not in conditional blocks that get eliminated.

### Common Error: Function Not Found

**Cause:** Global function name was mangled

**Example:**
```javascript
// Original
window.initHero = function() { ... };

// External code expects window.initHero to exist
```

**Fix:** Use explicit global assignment that terser preserves:
```javascript
window['initHero'] = function() { ... };  // Bracket notation preserves name
```

### Debugging Steps

1. **Identify the error** - What exactly fails?

2. **Check AST verification output** - Any missing patterns?

3. **Compare strings:**
   ```bash
   # Extract strings from original
   grep -o '"[^"]*"' src/2_javascript/hero/hero_video.js | sort -u > original_strings.txt
   
   # Extract strings from minified
   grep -o '"[^"]*"' src/2_javascript/z_minified/hero/hero_video.js | sort -u > minified_strings.txt
   
   # Compare
   diff original_strings.txt minified_strings.txt
   ```

4. **Test without mangling:**
   ```bash
   # Minify without --mangle to isolate issue
   npx terser source.js --compress -o test.js
   
   # If this works, issue is with variable mangling
   ```

5. **Check for dynamic access:**
   ```bash
   # Look for bracket notation that might break
   grep -n '\[.*\]' src/2_javascript/hero/hero_video.js
   ```

---

## 7. 📦 BATCH MINIFICATION WORKFLOW

### For All Files

```bash
# Step 1: Minify all
node scripts/minify-webflow.mjs --force

# Step 2: Verify all
node scripts/verify-minification.mjs

# Step 3: Test all
node scripts/test-minified-runtime.mjs

# Step 4: Browser test key pages
bdg https://a-nobel-en-zn.webflow.io/en
bdg console logs
bdg stop
```

### For Single File

```bash
# Step 1: Minify
npx terser src/2_javascript/hero/hero_video.js --compress --mangle \
  -o src/2_javascript/z_minified/hero/hero_video.js

# Step 2: Verify (runs on all, but check specific file in output)
node scripts/verify-minification.mjs

# Step 3: Test
node scripts/test-minified-runtime.mjs

# Step 4: Browser test
bdg https://a-nobel-en-zn.webflow.io/en
bdg console logs
bdg stop
```

---

## 8. 📋 RULES

### ✅ ALWAYS

- Run AST verification after minification
- Run runtime test after minification
- Test in browser before deploying
- Keep original source files (never delete)
- Use `--compress --mangle` together (standard config)
- Check verification output for FAIL status

### ❌ NEVER

- Use `--mangle-props` (breaks object property access)
- Deploy if AST verification shows FAIL
- Deploy without browser testing
- Minify directly over source files
- Assume minification is safe without verification

### ⚠️ ESCALATE IF

- AST verification shows missing critical pattern
- Runtime test throws errors
- Browser console shows new errors after minification
- Cannot identify why minification broke functionality
- Need to use custom terser configuration

---

## 9. 🔗 RELATED RESOURCES

### Reference Files

- [cdn_deployment.md](./cdn_deployment.md) - Deploying minified files to Cloudflare R2
- [implementation_workflows.md](./implementation_workflows.md) - General implementation patterns
- [debugging_workflows.md](./debugging_workflows.md) - Debugging workflows

### Scripts

- `scripts/minify-webflow.mjs` - Batch minification
- `scripts/verify-minification.mjs` - AST verification
- `scripts/test-minified-runtime.mjs` - Runtime testing

### External

- [Terser Documentation](https://terser.org/docs/api-reference)
- [Terser CLI Options](https://terser.org/docs/cli-usage)
