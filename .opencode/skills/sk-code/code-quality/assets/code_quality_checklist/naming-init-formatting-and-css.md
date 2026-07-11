---
title: Naming, Initialization, Formatting & CSS Style Checks
description: Validation checklist for JavaScript and CSS code quality and style compliance. — Naming, Initialization, Formatting & CSS Style Checks.
importance_tier: normal
contextType: implementation
version: 3.5.0.17
---

# Naming, Initialization, Formatting & CSS Style Checks

## 5. NAMING CONVENTION CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 2](../../../code-webflow/references/javascript/style_guide/overview-naming-and-structure.md)

### Variable Naming

- [ ] **[P0] CHK-NAM-01**: Variables use `snake_case` (not camelCase)
- [ ] **[P0] CHK-NAM-02**: Constants use `UPPER_SNAKE_CASE`
- [ ] **[P1] CHK-NAM-03**: Boolean variables use `is_` or `has_` prefix
- [ ] **[P1] CHK-NAM-04**: Private variables use `_snake_case` prefix

### Function Naming

- [ ] **[P0] CHK-NAM-05**: Functions use `snake_case` (not camelCase)
- [ ] **[P1] CHK-NAM-06**: Functions use semantic prefixes:
  - `is_` / `has_` - Boolean checks
  - `get_` - Data retrieval (no mutation)
  - `set_` - Data mutation
  - `handle_` - Event handlers
  - `init_` - Initialization
  - `bind_` - Event binding
  - `toggle_` - State toggles
  - `validate_` - Validation
  - `load_` - Resource loading

**Compliant Naming:**
```javascript
// Variables
const hover_timer = null;
const is_attached = false;
const INIT_FLAG = '__componentNameInit';
const _internal_cache = {};

// Functions
function is_valid_email(email) { }
function get_form_data(form) { }
function handle_submit(event) { }
function init_component() { }
```

**Non-Compliant Naming:**
```javascript
// WRONG: camelCase variables
const hoverTimer = null;
const isAttached = false;

// WRONG: camelCase functions
function isValidEmail(email) { }
function getFormData(form) { }
function handleSubmit(event) { }

// WRONG: Missing semantic prefix
function email(value) { }  // Should be: is_valid_email or validate_email
function data(form) { }    // Should be: get_form_data
```

---

## 6. INITIALIZATION PATTERN CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_quality_standards.md Section 2](../../../code-webflow/references/javascript/quality_standards/init-dom-error-and-async.md)

### CDN-Safe Initialization

- [ ] **[P0] CHK-INI-01**: Unique `INIT_FLAG` constant defined
- [ ] **[P0] CHK-INI-02**: Guard check prevents double initialization: `if (window[INIT_FLAG]) return;`
- [ ] **[P0] CHK-INI-03**: Guard flag set: `window[INIT_FLAG] = true;`
- [ ] **[P1] CHK-INI-04**: `INIT_DELAY_MS` constant defined (default 50)
- [ ] **[P1] CHK-INI-05**: Uses setTimeout with INIT_DELAY_MS for DOM readiness
- [ ] **[P1] CHK-INI-06**: DOMContentLoaded listener uses `{ once: true }`
- [ ] **[P1] CHK-INI-07**: Webflow.push integration with fallback

**Compliant Pattern:**
```javascript
const INIT_FLAG = '__componentNameCdnInit';
const INIT_DELAY_MS = 50;

function init_component() {
  // Your initialization code here
}

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  if (document.readyState !== 'loading') {
    setTimeout(init_component, INIT_DELAY_MS);
    return;
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(init_component, INIT_DELAY_MS),
    { once: true }
  );
};

if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

---

## 7. FORMATTING CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 4](../../../code-webflow/references/javascript/style_guide/overview-naming-and-structure.md)

### Basic Formatting

- [ ] **[P1] CHK-FMT-01**: 2-space indentation (no tabs)
- [ ] **[P1] CHK-FMT-02**: Same-line opening braces (K&R style)
- [ ] **[P1] CHK-FMT-03**: Semicolons always used
- [ ] **[P1] CHK-FMT-04**: Single quotes for strings
- [ ] **[P2] CHK-FMT-05**: Trailing commas in multi-line structures
- [ ] **[P2] CHK-FMT-06**: Line length under 120 characters

---

## 8. CSS STYLE CHECKS

**Applies to:** CSS (`.css`)

**Reference:** [css/style_guide.md](../../../code-webflow/references/css/style_guide.md) — full CSS conventions (BEM naming, custom property prefixes, attribute selectors, animation CSS, file organization)

### Custom Property Naming

- [ ] **[P0] CHK-CSS-01**: Custom properties use semantic prefixes (`--font-*`, `--vw-*`, `--component-*`, `--state-*`, `--global-*`)
- [ ] **[P1] CHK-CSS-02**: Component-specific properties include component name (`--hero-padding`, `--card-radius`)
- [ ] **[P2] CHK-CSS-03**: Calculation properties are clearly named (`--coefficient`, `--base`)

### Attribute Selectors

- [ ] **[P0] CHK-CSS-04**: Attribute selectors use case-insensitivity flag `i` for custom data attributes
- [ ] **[P1] CHK-CSS-05**: Data attributes use kebab-case values (`data-render-content="base"`)

### BEM Naming

- [ ] **[P0] CHK-CSS-06**: Class names follow BEM convention: `.block`, `.block__element`, `.block--modifier`
- [ ] **[P1] CHK-CSS-07**: Elements use double-underscore separator (`__`)
- [ ] **[P1] CHK-CSS-08**: Modifiers use double-dash separator (`--`)

### Animation Properties

- [ ] **[P0] CHK-CSS-09**: Animations use GPU-accelerated properties only (`transform`, `opacity`, `scale`)
- [ ] **[P1] CHK-CSS-10**: Layout properties NOT animated (`width`, `height`, `top`, `left`, `padding`, `margin`)
- [ ] **[P1] CHK-CSS-11**: `will-change` managed dynamically (set before animation, reset to `auto` after)

### File Organization

- [ ] **[P1] CHK-CSS-12**: File names use `snake_case` (`btn_app_store.css`, `form_file_upload.css`)
- [ ] **[P2] CHK-CSS-13**: One file per component type, grouped by category

**Compliant Examples:**

```css
/* Custom Properties - Semantic prefixes */
:root {
  --font-from: 18;
  --font-to: 24;
  --vw-from: calc(1920 / 100);
  --vw-to: calc(2560 / 100);
  --hero-padding: 2rem;
  --state-hover-opacity: 0.8;
}

/* Attribute Selectors - Case-insensitive */
[data-render-content="base" i] {
  content-visibility: auto;
}

/* BEM Naming */
.hero { }                    /* Block */
.hero__title { }             /* Element (double-underscore) */
.hero__overlay { }           /* Element */
.hero--featured { }          /* Modifier (double-dash) */

/* GPU-Accelerated Animation */
.animated-element {
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  /* AVOID: width, height, top, left, padding, margin */
}
```

**Non-Compliant Examples:**

```css
/* WRONG: No semantic prefix */
:root {
  --from: 18;              /* Should be: --font-from */
  --padding: 2rem;         /* Should be: --component-padding or --hero-padding */
}

/* WRONG: Missing case-insensitivity flag */
[data-render-content="base"] {  /* Should include 'i' flag */
  content-visibility: auto;
}

/* WRONG: Inconsistent BEM */
.heroTitle { }             /* Should be: .hero__title (BEM element) */
.hero_overlay { }          /* Should be: .hero__overlay (double-underscore) */

/* WRONG: Animating layout properties */
.slide-in {
  transition: left 0.3s;   /* Should use: transform: translateX() */
  transition: width 0.3s;  /* Layout property - causes reflow */
}
```

---

