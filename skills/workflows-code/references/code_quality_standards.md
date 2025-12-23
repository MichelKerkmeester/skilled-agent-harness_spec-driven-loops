# Code Quality Standards - Integrated Reference

Essential code quality standards for frontend development, integrating naming conventions, animation patterns, and initialization structure.

### Core Principle

Consistency enables collaboration. Clarity prevents bugs.

### Primary Sources
- Section 2 (Naming) and Section 6 (Commenting) below - Complete naming and commenting rules
- Section 4 below - Complete CDN-safe pattern documentation
- [animation_workflows.md](./animation_workflows.md) - Complete animation implementation guide

---

## 1. 📋 OVERVIEW

### Purpose
Essential code quality standards for frontend development, integrating naming conventions, animation patterns, and initialization structure.

### When to Use
- Writing new code (naming, structure)
- Reviewing code for standards compliance
- Setting up new components

---

## 2. 📝 NAMING CONVENTIONS

### JavaScript Identifiers (snake_case)

All JavaScript code uses `snake_case` for consistency:

| Type | Convention | Example |
|------|------------|---------|
| Variables | `snake_case` | `user_data`, `is_valid` |
| Functions | `snake_case` | `handle_submit()`, `init_component()` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `INIT_DELAY_MS` |
| Private | `_snake_case` | `_internal_cache` |

### Semantic Function Prefixes

Use standard prefixes to indicate purpose:

| Prefix | Purpose | Returns |
|--------|---------|---------|
| `is_` | Boolean check | true/false |
| `has_` | Presence check | true/false |
| `get_` | Data retrieval | data (no mutation) |
| `set_` | Data mutation | void/success |
| `handle_` | Event handler | void |
| `init_` | Initialization | void |
| `load_` | Resource loading | Promise |

**Examples:**
```javascript
function is_valid_email(email) { }
function has_required_fields(form) { }
function get_form_data(form) { }
function set_loading_state(enabled) { }
function handle_submit(event) { }
function init_validation() { }
function load_external_library() { }
```

### CSS Naming (kebab-case with BEM)

```css
.hero { }                    /* Block */
.hero--title { }             /* Element */
.hero--overlay { }           /* Element */
.hero-featured { }           /* Modifier */
```

**See:** Top of Section 2 for complete naming rules.

---

## 3. 📁 FILE STRUCTURE REQUIREMENTS

### JavaScript File Header (MANDATORY)

**Standard pattern:** See file header format example below.

**Quick reference:**
```javascript
// ───────────────────────────────────────────────────────────────
// COMPONENT: [NAME]
// ───────────────────────────────────────────────────────────────
```

**Rules:**
- Three-line separator format
- `COMPONENT: [NAME]` in uppercase
- No metadata (dates, authors, tickets)

### Section Headers (Numbered)

Organize code blocks with numbered sections:

```javascript
/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   2. EVENT HANDLERS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   3. INITIALIZE
──────────────────────────────────────────────────────────────── */
```

**See:** File header format section above for complete header rules.

---

## 4. 🔧 INITIALIZATION PATTERN (CDN-SAFE)

### The Standard Pattern (COPY EXACTLY)

**Every component MUST use this pattern:**

```javascript
/* ─────────────────────────────────────────────────────────────
   INITIALIZE
──────────────────────────────────────────────────────────────── */
const INIT_FLAG = '__componentNameCdnInit';  // Unique per component
const INIT_DELAY_MS = 50;                     // Adjust per component

function init_component() {
  // Your initialization code here
}

const start = () => {
  // Guard: Prevent double initialization
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  // If DOM already loaded, delay before initializing
  if (document.readyState !== 'loading') {
    setTimeout(init_component, INIT_DELAY_MS);
    return;
  }

  // Otherwise, wait for DOMContentLoaded with delay
  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(init_component, INIT_DELAY_MS),
    { once: true }
  );
};

// Prefer Webflow.push, fallback to immediate start
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

### Why This Pattern Exists

| Requirement | Implementation | Why Needed |
|------------|----------------|------------|
| **Guard Flag** | `if (window[INIT_FLAG]) return;` | Prevents double initialization during Webflow page transitions |
| **Delayed Execution** | `setTimeout(init_component, INIT_DELAY_MS)` | Ensures DOM and dependencies (Motion.dev) fully ready |
| **Webflow.push Support** | `window.Webflow.push(start)` | Integrates with Webflow's native queueing system |
| **Once-Only Listener** | `{ once: true }` | Prevents memory leaks from duplicate listeners |

### When to Adjust INIT_DELAY_MS

| Delay | When to Use | Example |
|-------|-------------|---------|
| **0ms** | No dependencies, simple DOM queries | Copyright year updater |
| **50ms** (default) | Standard components | Forms, accordions, navigation |
| **100ms+** | Heavy dependencies | Hero animations (Motion.dev), video players |

**See:** Top of Section 4 for complete pattern documentation and troubleshooting.

---

## 5. 🎬 ANIMATION STRATEGY

### Quick Decision Tree

```
Need animation?
├─> Can CSS express it (transform/opacity)?
│   └─> Use CSS transitions/keyframes
└─> Requires sequencing/scroll/in-view logic?
    └─> Use Motion.dev
```

### Essential Patterns

**CSS animations (first choice):**
- Use GPU-accelerated properties only (transform, opacity)
- Add `prefers-reduced-motion` support (MANDATORY)
- Timing: 200-400ms for most interactions

**Motion.dev (for complexity):**
- Library loading: Global ES module import in global.html
- Retry pattern: Check `window.Motion` with setTimeout fallback
- Standardized easing: `[0.22, 1, 0.36, 1]` (ease-out), `[0.16, 1, 0.3, 1]` (expo-out)
- Performance: Remove `will-change` in `onComplete`

### Complete Animation Guide

**For implementation, debugging, and testing:**
- **Decision tree and patterns:** [animation_workflows.md](./animation_workflows.md)
- **Complete reference:** [animation_workflows.md](./animation_workflows.md) contains all animation policy, rationale, and implementation details

---

## 6. 💬 COMMENTING RULES

### Principles

**Quantity limit:** Maximum 5 comments per 10 lines of code

**Focus on WHY, not WHAT:**
- ✅ Explain intent, constraints, platform requirements
- ✅ Reference external dependencies (Webflow, libraries)
- ❌ Avoid narrating implementation details

### Function Purpose Comments

Single line above function describing intent:

```javascript
// Load Botpoison SDK from CDN if not already loaded
// Returns promise resolving to true on success, false on failure
function load_botpoison_sdk() {}

// Show modal with entrance animation using Motion.dev
// Make container visible before animating to avoid layout jumps
async function show_modal() {}
```

### Inline Logic Comments (WHY, Not WHAT)

**Good examples (explain reasoning):**
```javascript
// Prevent background scroll while modal is open
if (window.lenis) {
  window.lenis.stop();
}

// Add 10 second timeout to prevent infinite hang
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 10000)
);

// Use modern Array.from or fallback to slice
return Array.from ? Array.from(list) : Array.prototype.slice.call(list);
```

**Bad examples (narrate implementation):**
```javascript
// ❌ Set price to price times 100
const price_cents = price * 100;

// ❌ Loop through items
for (const item of items) {}
```

### Platform-Specific Comments

Reference external constraints:

```javascript
// WEBFLOW: collection list constraint (max 100 items)
// MOTION: Animation requires Motion.dev library loaded
// LENIS: Smooth scroll integration point

// Conditional logging for debug mode
function log(...args) {
  if (debug_enabled) {
    console.log(LOG_PREFIX, ...args);
  }
}
```

**See:** Top of Section 6 for complete commenting guide.

---

## 7. 🔗 RELATED RESOURCES

### Reference Files
- [animation_workflows.md](./animation_workflows.md) - Complete animation implementation guide for CSS and Motion.dev patterns
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting and validation patterns using these naming conventions
- [webflow_patterns.md](./webflow_patterns.md) - Webflow-specific patterns requiring CDN-safe initialization
- [debugging_workflows.md](./debugging_workflows.md) - Debugging workflows for checking naming consistency and pattern compliance
- [verification_workflows.md](./verification_workflows.md) - Verification workflows for code standards and accessibility testing

### Standards
- **Phase 1 (Implementation)**: Start with naming (semantic prefixes), add file header, use initialization pattern, choose animation approach (CSS first), add WHY comments
- **Phase 2 (Debugging)**: Check naming consistency (snake_case), verify initialization (guard flag and delay), review comments (platform-specific notes), test animations (reduced motion)
- **Phase 3 (Verification)**: Code standards check (file headers, naming, comments), pattern compliance (initialization), animation testing (CSS/Motion.dev across viewports), accessibility (reduced motion support)

---

## 8. ✅ QUICK REFERENCE CHECKLIST

Before deploying any component:

**Naming:**
- [ ] All variables/functions use `snake_case`
- [ ] Constants use `UPPER_SNAKE_CASE`
- [ ] Semantic prefixes used (is_, has_, get_, etc.)

**File Structure:**
- [ ] Component header at top of file
- [ ] Numbered section headers for organization
- [ ] No metadata in headers (no dates/authors/tickets)

**Initialization:**
- [ ] Wrapped in IIFE `(() => { ... })()`
- [ ] Unique `INIT_FLAG` constant
- [ ] `INIT_DELAY_MS` constant (50ms default)
- [ ] Guard check and set present
- [ ] DOM readiness with setTimeout
- [ ] `{ once: true }` on event listener
- [ ] Webflow.push with fallback

**Animation:**
- [ ] CSS used for simple transitions
- [ ] Motion.dev for complex sequences
- [ ] Retry logic for Motion.dev loading
- [ ] `prefers-reduced-motion` support
- [ ] `will-change` cleanup on completion

**Comments:**
- [ ] Maximum 5 comments per 10 lines
- [ ] Focus on WHY, not WHAT
- [ ] Platform constraints documented
- [ ] No commented-out code

---

**Core principle:** These standards ensure maintainable, performant, accessible frontend code that integrates seamlessly with Webflow's CDN delivery and lifecycle.

---

## 9. 🎨 CSS STANDARDS

### Custom Property Naming

**Use prefixes to indicate scope and purpose:**

| Prefix | Scope | Example |
|--------|-------|---------|
| `--font-*` | Typography variables | `--font-from`, `--font-to` |
| `--vw-*` | Viewport calculations | `--vw-from`, `--vw-to` |
| `--component-*` | Component-specific | `--hero-padding`, `--card-radius` |
| `--state-*` | Interactive states | `--state-hover-opacity` |
| `--global-*` | Site-wide values | `--global-max-width` |

**Production example from fluid_responsive.css:**
```css
:root {
  --font-from: 18;
  --font-to: 18;
  --vw-from: calc(5120 / 100);
  --vw-to: calc(7680 / 100);
  --coefficient: calc((var(--font-to) - var(--font-from)) / (var(--vw-to) - var(--vw-from)));
  --base: calc((var(--font-from) - var(--vw-from) * var(--coefficient)) / 16);
}
```

### Fluid Typography Formula

**Scales font size smoothly between viewport breakpoints:**

```css
/* Core formula: base + coefficient * viewport width */
html {
  font-size: calc(var(--base) * 1rem + var(--coefficient) * 1vw);
}

/* Breakpoint-specific values */
@media screen and (max-width: 1920px) {
  :root {
    --font-from: 15;
    --font-to: 16;
    --vw-from: calc(1440 / 100);
    --vw-to: calc(1920 / 100);
  }
}

@media screen and (max-width: 991px) {
  :root {
    --font-from: 14;
    --font-to: 16;
    --vw-from: calc(1 / 100);
    --vw-to: calc(991 / 100);
  }
}
```

**Why this pattern:**
- Eliminates discrete font-size jumps at breakpoints
- Uses mathematical interpolation for smooth scaling
- All sizing uses `rem` for consistent scaling

### Animation CSS

**will-change management:**
```css
/* Set will-change in JavaScript BEFORE animation starts */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes (via JavaScript) */
.animation-complete {
  will-change: auto;
}
```

**GPU-accelerated properties only:**
```css
.animated-element {
  /* ✅ GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  
  /* ❌ Layout properties - AVOID ANIMATING */
  /* width, height, top, left, padding, margin */
}
```

**Easing standards (aligned with Motion.dev):**
```css
/* General purpose - smooth deceleration */
transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

/* Dramatic entrances - strong deceleration */
transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

### File Organization

**One file per component type, grouped by category:**

```
src/1_css/
├── animations/          # Reusable animation classes
├── button/              # Button variants (btn_primary, btn_secondary)
├── card/                # Card layouts
├── form/                # Form elements
├── global/              # Site-wide styles (fluid_responsive, reset)
├── link/                # Link styles
├── menu/                # Navigation menus
├── slider/              # Carousel/slider styles
├── text/                # Typography components
└── video/               # Video player styles
```

**Naming conventions:**
- Files: `component_variant.css` (snake_case)
- Classes: `.component--element` (BEM with double-dash)
- Modifiers: `.component-modifier` (single-dash)

**Reference:** `src/1_css/global/fluid_responsive.css` - Complete fluid typography implementation
