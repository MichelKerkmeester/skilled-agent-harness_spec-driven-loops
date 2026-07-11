---
title: "Webflow HTML Quality Standards"
description: "HTML quality + enforcement for Webflow projects: data-attribute hygiene, ARIA state-sync validation, custom embed cleanup rules, head/footer custom code panel structure validation."
trigger_phrases:
  - "webflow html quality standards"
  - "data attribute hygiene"
  - "aria state sync"
  - "custom embed validation"
  - "head footer panel structure"
importance_tier: normal
contextType: implementation
version: 3.5.0.2
---

# Webflow HTML Quality Standards

HTML quality and enforcement rules for the small set of conventions that actually apply in Webflow projects.

---

## 1. OVERVIEW

### Purpose

Defensive HTML patterns + enforcement rules for Webflow custom embeds, data-attribute hooks, ARIA state synchronization, and head/footer custom code panel structure. Most HTML in Webflow is owned by the Webflow Designer; this file enforces the small contract surface where custom HTML actually lives.

### When to Use

- Adding `data-*` attributes to Webflow Designer markup (custom JS hooks)
- Writing custom embed blocks (Embed element on a page)
- Authoring head/footer custom code panel content (Site Settings or Page Settings)
- Reviewing custom HTML for ARIA state-sync correctness
- Validating that Webflow Designer markup hasn't drifted from JS expectations

### Core Principle

The only HTML you author is the contract surface — `data-*` hooks, ARIA state, custom embed scaffolding, head/footer panel structure. Enforce it strictly so the JS↔markup contract never silently breaks.

---

## 2. DATA-ATTRIBUTE HYGIENE

### Validation Prompt

> **Check:** Are all `data-*` attributes lowercase-kebab-case? Do component roots have `data-component`? Do triggers have `data-action`? Are bridge attributes (`data-select="*"`, `data-form-field`) shaped correctly?

### Pattern Recognition

**Compliant naming:**

```html
<!-- Lowercase, kebab-case, hyphen-separated -->
<div data-component="hero">
<button data-action="toggle" data-target="panel-1">
<div data-form-field>
<input data-form-input type="email">
<div data-select="wrapper">
  <div data-select="trigger">
  <div data-select="dropdown">
    <div data-select="option" data-value="opt-1">
```

**Violation patterns:**

| Violation | Example | Why broken |
|---|---|---|
| camelCase attribute name | `data-formField` | HTML attribute names are case-insensitive — JS dataset coerces to camelCase, but selectors `[data-formField]` fail in CSS (case-sensitive without `i` flag) |
| PascalCase value | `data-component="Hero"` | Inconsistent with snake_case JS naming + CSS attribute selectors fail without `i` flag |
| snake_case attribute name | `data-form_field` | Breaks the `element.dataset.formField` JS access pattern |
| Spaces in value | `data-action="open modal"` | HTML allows it, but breaks `[data-action="open modal"]` selector readability and JS routing |
| Missing component root | trigger but no `data-component` parent | JS event delegation can't scope to a single component instance |

### Remediation

| From | To |
|---|---|
| `data-FormField` | `data-form-field` |
| `data-action="OpenModal"` | `data-action="open-modal"` |
| `data-component="HeroSection"` | `data-component="hero-section"` or `data-component="hero"` |
| `data-form_field` | `data-form-field` |

Run a repo-wide grep for non-compliant patterns before completion:

```bash
# camelCase data attributes
grep -rE 'data-[a-z]+[A-Z]' src/

# PascalCase values
grep -rE 'data-[a-z-]+="[A-Z][^"]*"' src/
```

---

## 3. EMPTY-VALUE ATTRIBUTE CLEANUP

### Validation Prompt

> **Check:** Are empty value-based attributes (`id=""`, `data-type=""`, `class=""`) removed? Are boolean marker attributes left intact?

### Pattern Recognition

**Compliant: empty value-based attributes removed**

```html
<!-- BEFORE: Webflow may emit empty attributes -->
<div id="" class="" data-type="">
  <input type="text" id="" name="email">
</div>

<!-- AFTER: empty value-based attributes deleted -->
<div>
  <input type="text" name="email">
</div>
```

**Compliant: boolean marker attributes preserved**

```html
<!-- These attributes have NO value because their PRESENCE is the signal -->
<button disabled>
<details open>
<input type="text" required>
<input type="text" autofocus>
<div data-active>          <!-- Boolean flag — keep even though "value" is empty -->
<script async>
<script defer>
```

### Remediation

`attribute_cleanup.min.js` (production utility script in anobel.com) does this on page load. For static cleanup, the regex pattern:

| Attribute | Disposition | Rationale |
|---|---|---|
| Empty `id=""` | **Remove** | Invalid HTML, breaks `getElementById()`, causes selector bugs |
| Empty `class=""` | **Remove** | DOM bloat, no functional purpose |
| Empty `data-type=""` (or any value-based data-*) | **Remove** | DOM bloat |
| `data-active` (no value) | **Keep** | Boolean flag — JS reads `element.hasAttribute('data-active')` |
| `disabled` / `required` / `autofocus` | **Keep** | Native boolean attributes |

### Common pitfall

Don't blindly strip every empty attribute. `disabled`, `required`, `autofocus`, `async`, `defer`, `open`, and any `data-*` flag used as a boolean marker MUST be preserved. The discriminator: does JS read this with `hasAttribute()` (keep) or `getAttribute()` (strip if empty)?

---

## 4. ARIA STATE SYNC ENFORCEMENT

### Validation Prompt

> **Check:** When custom JS toggles a UI state (open/closed, expanded/collapsed, valid/invalid, loading/ready), does it ALSO update the matching ARIA attribute? Are initial ARIA values correct for the initial DOM state?

### Pattern Recognition

**Compliant: ARIA state mirrors DOM state**

```html
<!-- Initial state: collapsed -->
<button
  data-component="accordion-trigger"
  aria-expanded="false"
  aria-controls="accordion-panel-1"
>
  Section title
</button>
<div id="accordion-panel-1" role="region" hidden>
  Panel content
</div>
```

```javascript
// JS toggles BOTH the visual state AND the ARIA state
function toggle_accordion(trigger) {
  const panel_id = trigger.getAttribute('aria-controls');
  const panel = document.getElementById(panel_id);
  const is_expanded = trigger.getAttribute('aria-expanded') === 'true';

  trigger.setAttribute('aria-expanded', is_expanded ? 'false' : 'true');
  panel.toggleAttribute('hidden', is_expanded);
}
```

**Non-compliant patterns:**

| Violation | Example | Fix |
|---|---|---|
| Initial ARIA mismatch | `aria-expanded="false"` on a panel that's visible at page load | Set initial value to match initial visual state |
| State changes without ARIA update | JS adds `.is-open` class but doesn't flip `aria-expanded` | Always pair class toggle with ARIA toggle |
| Wrong ARIA attribute for the role | `aria-pressed` on a non-toggle button | Match ARIA attribute to the widget pattern (button → aria-pressed for toggles, aria-expanded for disclosures) |
| `hidden` attribute desync | Panel visible (`display: block`) but `hidden` attribute still present | When JS shows the panel, remove `hidden`; when hiding, add `hidden` |

### Remediation

For every JS function that changes UI state, audit the corresponding ARIA contract:

| UI pattern | Required ARIA |
|---|---|
| Disclosure (button + panel) | `aria-expanded` on button, `aria-controls` linking to panel id, `hidden` attribute on panel synced to expanded state |
| Toggle button | `aria-pressed="true|false"` |
| Tab + tabpanel | `aria-selected` on tab, `aria-controls` + `aria-labelledby` linking, `tabindex="-1"` on inactive tabs |
| Dialog/Modal | `role="dialog"`, `aria-modal="true"`, focus trap, `aria-labelledby` linking to title |
| Form field invalid | `aria-invalid="true"` on input, `aria-describedby` linking to error message id |
| Loading state | `aria-busy="true"` on the loading region |

The action-routing pattern in [`../javascript/quality_standards/init-dom-error-and-async.md`](../javascript/quality_standards/init-dom-error-and-async.md) §13 includes the toggle handlers that perform this sync — use it as the canonical implementation.

---

## 5. CUSTOM EMBED HYGIENE

### Validation Prompt

> **Check:** Do custom HTML embed blocks (Webflow Designer Embed element) include the standard scaffolding — `data-component` root, `data-action`/`data-target` for interactions, ARIA initial state, JS handoff comment block?

### Pattern Recognition

**Compliant: full embed scaffolding** (matches `assets/webflow/templates/embed_template.html`):

```html
<!-- Component root marker — JS targets this with [data-component="[name]"] -->
<div data-component="[name]" data-state="initial">

  <!-- Trigger button — JS routes via data-action -->
  <button
    data-action="toggle"
    data-target="panel-[name]-1"
    aria-expanded="false"
    aria-controls="panel-[name]-1"
    type="button"
  >
    [Trigger label]
  </button>

  <!-- Target panel — initial state matches aria-expanded="false" -->
  <div
    id="panel-[name]-1"
    data-target
    role="region"
    hidden
  >
    [Panel content]
  </div>

</div>
```

**Non-compliant: missing scaffolding**

```html
<!-- WRONG: no data-component root -->
<button onclick="toggle()">Click</button>
<div>Hidden content</div>

<!-- WRONG: inline onclick handler -->
<button onclick="toggle()">Click</button>

<!-- WRONG: no aria state -->
<button data-action="toggle">Click</button>
<div hidden>Hidden content</div>
```

### Remediation

Use the canonical template at [`../../../assets/webflow/templates/embed_template.html`](../../assets/templates/embed_template.html). Replace `[LIKE_THIS]` placeholders, never invent ad-hoc embed structures.

---

## 6. HEAD / FOOTER CUSTOM CODE PANEL STRUCTURE

### Validation Prompt

> **Check:** Does the head/footer custom code panel content follow the section-header / inline-label / end-marker pattern from [`./style_guide.md`](./style_guide.md) §7?

### Pattern Recognition

**Compliant: 3-line section header + Title-cased inline label + end-marker for multi-line**

```html
<!-- ───────────────────────────────────────────────────────────────
     1. ANALYTICS (inline, must fire early)
─────────────────────────────────────────────────────────────── -->

<!-- Google Tag Manager (Delayed for LCP, skipped on slow connections) -->
<script>
  // ... 30 lines of GTM bootstrap ...
</script>
<!-- End Google Tag Manager -->
```

**Violation patterns:**

| Violation | Example | Fix |
|---|---|---|
| No section headers | All `<script>` tags pile up without grouping | Group into numbered sections per §7 |
| Wrong indent | Title with 3-space indent (matches JS/CSS convention) | HTML uses **5-space** indent (account for `<!--` width) |
| Decimal sub-numbering | `4.1 SPECULATIVE PREFETCH` | Use letter suffix `4b.` for HTML sub-sections |
| Missing inline labels | Bare `<script>` tags with no preceding comment | Add `<!-- Title-cased label -->` above each block |
| Missing end-marker on multi-line | 30-line `<script>` with no `<!-- End X -->` | Add closing marker for blocks ≥5 lines |

### Remediation

Use the canonical template at [`../../../assets/webflow/templates/head_footer_code_template.html`](../../assets/templates/head_footer_code_template.html). Reference production example at `anobel.com/src/0_html/global.html`.

---

## 7. PRE-COMPLETION CHECKLIST

Before claiming HTML implementation done:

```markdown
□ DATA ATTRIBUTES
  □ All `data-*` attributes are lowercase-kebab-case
  □ Component roots have `data-component="[name]"`
  □ Trigger elements have `data-action="[verb]"` and `data-target="[id]"`
  □ Boolean flags (`data-active`, `data-initialized`) preserved without value
  □ Empty value-based attributes (`id=""`, `data-type=""`, `class=""`) removed

□ ARIA STATE
  □ Every JS-toggled UI state has matching ARIA attribute updates
  □ Initial ARIA values match initial DOM state
  □ `hidden` attribute synced with `aria-expanded` / `aria-hidden` semantics
  □ Form fields have `aria-invalid` + `aria-describedby` linking to error messages

□ CUSTOM EMBEDS
  □ Embed blocks follow `embed_template.html` scaffolding
  □ No inline `onclick` / `onmouseover` handlers — use `data-action` + JS routing
  □ JS handoff notes comment present at bottom of embed

□ HEAD/FOOTER PANELS
  □ 3-line section headers with parenthetical-context titles
  □ Title-cased inline labels above each `<script>`/`<link>`/`<meta>`
  □ End-markers on multi-line `<script>` blocks (≥5 lines)
  □ Sub-sections use letter suffix (`4b.`), not decimal (`4.1`)
  □ Inside `<script>`: snake_case JS, IIFE wrapper, INIT_FLAG guard per JS rules
```

---

## RELATED RESOURCES

- [`./style_guide.md`](./style_guide.md) — HTML conventions (data attributes, semantic HTML, ARIA basics, head/footer comment style)
- [`../shared/cross_language_rules.md`](../shared/cross_language_rules.md) — file naming, comment principles, file-header banner format
- [`../shared/enforcement.md`](../shared/enforcement.md) — pre-completion gate workflow
- [`../javascript/quality_standards/init-dom-error-and-async.md`](../javascript/quality_standards/init-dom-error-and-async.md) — action routing pattern (§13) for ARIA state-sync helpers
- [`../javascript/quick_reference.md`](../javascript/quick_reference.md) — form validation class helpers
- [`../css/quick_reference.md`](../css/quick_reference.md) — CSS counterpart for form validation classes + Webflow tokens

### Copy-paste templates

- [`../../../assets/webflow/templates/embed_template.html`](../../assets/templates/embed_template.html) — custom embed scaffolding
- [`../../../assets/webflow/templates/head_footer_code_template.html`](../../assets/templates/head_footer_code_template.html) — head + footer custom code panel template
- [`../../../assets/webflow/templates/form_scaffold_template.html`](../../assets/templates/form_scaffold_template.html) — form field scaffolding with validation hooks

### Production reference

- `anobel.com/src/0_html/global.html` — canonical head + footer custom code panel structure
