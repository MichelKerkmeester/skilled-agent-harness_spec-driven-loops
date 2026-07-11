---
title: Safe Minification Workflow, Verification Scripts & Debugging
description: Safe minification workflow for Webflow projects with verification to prevent breaking functionality. — Safe Minification Workflow, Verification Scripts & Debugging.
importance_tier: normal
contextType: implementation
version: 3.5.0.15
---

# Safe Minification Workflow, Verification Scripts & Debugging

## 4. SAFE MINIFICATION WORKFLOW

### Step 1: Minify with Terser

```bash
npx terser src/javascript/[folder]/[file].js \
  --compress \
  --mangle \
  -o src/javascript/z_minified/[folder]/[file].min.js
```

For batch minification of all files:

```bash
node .opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs
```

### Step 2: AST Verification

```bash
node .opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs
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
node .opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs
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
bdg https://your-project.webflow.io/

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

## 5. VERIFICATION SCRIPTS REFERENCE

### verify-minification.mjs

**Location:** `.opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs`

**Purpose:** AST-based comparison of original and minified files

**What it extracts:**
- Data attribute selectors (e.g., `[data-target='hero-item']`)
- DOM event names from addEventListener calls
- Global assignments (window.X patterns)
- Webflow/Motion/gsap references

**Usage:**
```bash
node .opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs
```

**Interpreting output:**
- `✓ PASS` - Pattern preserved correctly
- `✗ FAIL` - Critical pattern missing - DO NOT DEPLOY
- `⚠ WARNING` - Non-critical difference - review manually

### test-minified-runtime.mjs

**Location:** `.opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs`

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
node .opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs
```

**Interpreting output:**
- `✓ PASS` - Script executed without errors
- `✗ FAIL` - Script threw error - shows error message

### minify-webflow.mjs

**Location:** `.opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs`

**Purpose:** Batch minification of all JavaScript files

**Usage:**
```bash
# Normal run (skips if output exists and unchanged)
node .opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs

# Force re-minification of all files
node .opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs --force
```

**Output:**
```
Processing 39 source files...
→ hero/hero_video.js (27187B) -> z_minified/hero/hero_video.min.js (8085B) [updated]
= form/form_validation.js (50727B) -> z_minified/form/form_validation.min.js (19303B) [unchanged]
...
Summary:
  Updated: 1
  Unchanged: 38
  Total reduction: 65.89%
```

---

## 6. DEBUGGING MINIFICATION ISSUES

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
   grep -o '"[^"]*"' src/javascript/hero/hero_video.js | sort -u > original_strings.txt
   
   # Extract strings from minified
   grep -o '"[^"]*"' src/javascript/z_minified/hero/hero_video.min.js | sort -u > minified_strings.txt
   
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
   grep -n '\[.*\]' src/javascript/hero/hero_video.js
   ```

---
