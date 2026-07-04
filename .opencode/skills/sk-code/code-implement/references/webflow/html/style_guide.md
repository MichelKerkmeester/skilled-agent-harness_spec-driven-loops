---
title: "Webflow HTML Style Guide"
description: "Data-attribute naming conventions, semantic HTML preferences, and ARIA basics for Webflow projects. Most HTML in Webflow projects is managed by the Webflow Designer; this file covers the conventions that apply to custom embeds, data attributes used by JS, and accessibility patterns."
trigger_phrases:
  - "webflow html style guide"
  - "webflow data attribute naming"
  - "webflow custom embed conventions"
  - "webflow aria basics"
importance_tier: normal
contextType: implementation
version: 3.5.0.2
---

# Webflow HTML Style Guide

> See [`../shared/cross_language_rules.md`](../../../../shared/references/webflow-shared/cross_language_rules.md) for rules that apply to all languages.

---

## 1. OVERVIEW

### Purpose

Documents the small set of HTML conventions that DO apply to Webflow projects (data-attribute naming, semantic HTML for custom embeds, ARIA basics) and points at Webflow Designer documentation for everything else.

### When to Use

- Adding data-attribute hooks for custom JavaScript
- Writing custom embed HTML inside Webflow
- Syncing ARIA state from JavaScript-driven interactions
- Deciding whether a markup question belongs to Webflow Designer or to custom code

### Core Principle

Most HTML in Webflow is owned by the Webflow Designer; custom HTML conventions only cover the contract surface (data attributes + ARIA).

---

## 2. SCOPE

In Webflow projects, **most HTML is managed by the Webflow Designer**. Site authors don't hand-write markup for layout, components, or content blocks — those are designed visually and exported by Webflow's CDN delivery. This style guide covers the small but important set of HTML conventions that DO apply when writing custom code:

1. Data-attribute naming for JS-targetable hooks
2. Semantic HTML for custom embed blocks
3. ARIA basics for keyboard accessibility
4. Comment style for **page Head + Footer custom code panels** (§7) — sections, inline labels, end-markers, sub-numbering
5. Where to find Webflow Designer best practices

---

## 3. DATA-ATTRIBUTE CONVENTIONS

Data attributes are the contract between Webflow Designer markup and the custom JavaScript that targets it. Use kebab-case for all attribute names.

### Component identifiers

The `data-component` attribute marks the root of a JS-managed component:

```html
<div data-component="hero">…</div>
<div data-component="modal">…</div>
<div data-component="accordion">…</div>
```

JS targets these with `[data-component="name"]` selectors.

### Action attributes

The `data-action` attribute declares what a clickable element does. Values mirror the semantic verb prefixes used in JS (`toggle`, `expand`, `collapse`, `remove`):

```html
<button data-action="toggle">Toggle panel</button>
<button data-action="expand">Show details</button>
<button data-action="collapse">Hide details</button>
<button data-action="remove">Delete item</button>
```

JS routes these via a single delegated event listener that reads `element.dataset.action` and dispatches to the matching handler (see [`../javascript/quality_standards.md`](../javascript/quality_standards.md) §13 Action Routing Pattern).

### Trigger / target patterns

Use `data-trigger` on the element that initiates an action and `data-target` to reference the element it affects:

```html
<!-- data-trigger: the element JS listens on -->
<div data-trigger>…</div>

<!-- data-target: points to an id that JS resolves -->
<button data-action="toggle" data-target="panel-1">Toggle</button>
<div id="panel-1" hidden>…</div>
```

### Form-field state markers

Form validation state flows through `data-form-field` containers and `data-form-input` elements:

```html
<div data-form-field>
  <input data-form-input class="input" type="text" />
</div>
```

Validation JS toggles `.validation-invalid` / `.validation-valid` classes on the `[data-form-field]` container (see [`../javascript/quick_reference.md`](../javascript/quick_reference.md) §10 Form Validation Classes).

### Custom select bridge attributes

When a styled `<div>`-based select must integrate with native form submission or Finsweet list-sort, the bridge pattern uses these attributes:

```html
<!-- Before bridge initialization -->
<div data-select="wrapper" fs-list-element="sort-trigger">
  <div data-select="trigger">
    <input data-select="input" placeholder="Sort by..." readonly />
  </div>
  <div data-select="dropdown">
    <div data-select="option" data-value="date-asc">Date (Oldest)</div>
    <div data-select="option" data-value="date-desc">Date (Newest)</div>
  </div>
</div>
```

| Attribute                 | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `data-select="wrapper"`   | Container targeted by CustomSelect                      |
| `data-select="input"`     | Displays current selection value                        |
| `data-select="option"`    | Selectable option element                               |
| `data-value`              | The actual value synced to the hidden native `<select>` |
| `data-select-initialized` | State marker set after bridge attaches                  |

See [`../implementation/webflow_patterns.md`](../implementation/webflow_patterns.md) §8 for the complete bridge pattern.

### Per-item data attributes in collection lists

Since Webflow duplicates `id` attributes across collection items, use `dataset` properties as stable per-item handles:

```html
<!-- After JS initialization, each .w-dyn-item carries stable data-* handles -->
<div class="w-dyn-item" data-item-index="0" data-item-id="abc123" data-item-slug="my-post">
  <span data-field="title">Post Title</span>
  <span data-cms-id>abc123</span>
</div>
```

| Attribute            | Source                           | Purpose                          |
| -------------------- | -------------------------------- | -------------------------------- |
| `data-item-index`    | JS-assigned during init          | Stable positional index          |
| `data-item-id`       | Copied from `data-cms-id` text   | CMS item identifier              |
| `data-item-slug`     | Copied from `data-cms-slug` text | URL-friendly identifier          |
| `data-field="title"` | Designer-set (CMS bind)          | Field-binding handle             |
| `data-cms-id`        | Designer-set (CMS bind)          | Raw CMS item ID                  |
| `data-initialized`   | JS-assigned after first init     | Guards against re-initialization |

### DOM attribute hygiene

Remove empty value-based attributes to keep markup clean. Never remove boolean marker attributes:

| Attribute               | Disposition   | Rationale                        |
| ----------------------- | ------------- | -------------------------------- |
| Empty `id=""`           | Always remove | Invalid HTML, selector bugs      |
| Empty `data-type=""`    | Remove        | DOM bloat, no functional purpose |
| `data-active` (boolean) | Never remove  | Boolean flag used by JS logic    |

---

## 4. SEMANTIC HTML

Prefer semantic elements over `<div>` when the element has a meaningful role:

- `<button>` for clickable actions (not `<div onclick="…">`)
- `<nav>` for navigation regions
- `<main>` for primary page content
- `<article>` for self-contained content blocks
- `<section>` for thematically grouped content
- `<header>` / `<footer>` for page or section framing

The Webflow Designer's tag-override feature lets you set the underlying HTML tag on any element — use it to promote `<div>` containers to semantic equivalents without losing Designer layout control.

---

## 5. ARIA BASICS

When custom JavaScript adds interactive behavior to Webflow markup, sync the ARIA state:

```html
<button data-component="accordion-trigger" aria-expanded="false" aria-controls="accordion-panel-1">
  Section title
</button>
<div id="accordion-panel-1" role="region" hidden>…</div>
```

When the JS toggles the panel, it must update `aria-expanded` and `hidden` together. The action-routing pattern in [`../javascript/quality_standards.md`](../javascript/quality_standards.md) §13 handles this — the `expand` and `collapse` actions set `aria-expanded` on the target element.

---

## 6. WEBFLOW DESIGNER REFERENCE

For Webflow Designer-level decisions (when to use a Symbol vs a Component, Collection list slots, breakpoints, native interactions vs custom JS), refer to:

- [Webflow University](https://university.webflow.com)
- [Webflow Designer documentation](https://help.webflow.com)
- The team's Webflow project for conventions in use

---

## 7. HEAD & FOOTER CUSTOM CODE COMMENTS

> Cross-language commenting principles (WHY-not-WHAT, no commented-out code, platform prefixes) live in [`../shared/cross_language_rules.md`](../../../../shared/references/webflow-shared/cross_language_rules.md). This section covers HTML-specific comment LAYOUT, FREQUENCY, and CONTENT for the **page Head + Footer custom code panels** in Webflow Site Settings (or the per-page Custom Code panel).

### Why HTML comments matter here

Webflow's Site Settings → Custom Code → Head Code and Footer Code panels are the only places site authors hand-author HTML/JS/CSS markup at scale. Those panels mix `<script>`, `<style>`, `<link>`, `<meta>`, and JSON-LD blocks. Without consistent comment layout, the panels become impossible to maintain — multiple analytics scripts, preconnects, preloads, and module imports get tangled. The conventions below match `anobel.com/src/0_html/global.html` which mirrors the production Webflow panel content one-for-one in source control.

### File-level Head/Footer markers

When the dev source file holds BOTH head and footer code (typical pattern when one `.html` source mirrors two Webflow panels), open each region with a single-line marker:

```html
<!-- HEADER ───────────────────────────────────────────────────── -->

<!-- ... head section content ... -->

<!-- FOOTER ───────────────────────────────────────────────────── -->

<!-- ... footer section content ... -->
```

These markers belong only in the dev file — the actual Webflow panels split the content into Head Code vs Footer Code automatically.

### Section headers (numbered, 3-line block)

Group related blocks (analytics, security headers, connection hints, preloads, module scripts, schema markup) into numbered sections. Same shape as JS/CSS section headers, using HTML comment syntax:

```html
<!-- ───────────────────────────────────────────────────────────────
     1. ANALYTICS (inline, must fire early)
─────────────────────────────────────────────────────────────── -->
```

**Specifications** (matches `anobel.com/src/0_html/global.html`):
- Opening line: `<!-- ─` followed by 63 `─` characters
- Title line: **5-space indent** (NOT 3-space like JS/CSS — HTML uses extra padding because `<!--` is wider), ALL CAPS, may include parenthetical context
- Closing line: 63 `─` characters followed by ` -->` (space, then closing comment)
- Sections numbered sequentially within each region (Head and Footer each restart at 1)
- Sub-numbering: use letter suffix `4b.` for inserted sub-sections (NOT decimal `4.1` like CSS — HTML/Webflow custom code panels prefer the letter form)

### Title parenthetical-context pattern

Section titles SHOULD include parenthetical context describing WHY this section exists at this position in the head/footer:

```html
<!-- ───────────────────────────────────────────────────────────────
     1. ANALYTICS (inline, must fire early)
─────────────────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     4. PRELOADS (critical resources)
─────────────────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     4b. SPECULATIVE PREFETCH (likely navigation targets)
─────────────────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     7. MODULE SCRIPTS (ES modules, non-blocking)
─────────────────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────────
     1. THIRD-PARTY LIBRARIES (load first, others depend on these)
─────────────────────────────────────────────────────────────── -->
```

The parenthetical describes load-order intent or the dependency relationship. Future maintainers immediately know whether they can safely re-order sections.

### Inline labels (single-line, above each script/link/meta block)

Every individual `<script>`, `<link>`, or `<meta>` block gets a 1-line `<!-- Label -->` comment immediately above it identifying what the block does:

```html
<!-- Google Tag Manager (Delayed for LCP, skipped on slow connections) -->
<script>
  (function () {
    function loadGTM() {
      // Skip GTM on slow connections (2G/slow-3G) or data saver mode
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData)) {
        return;
      }
      // ...
    }
  })();
</script>
<!-- End Google Tag Manager -->

<!-- Preconnect -->
<link rel="preconnect" href="https://anobel-zn.b-cdn.net" crossorigin>
<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin>

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://assets-global.website-files.com">

<!-- Fonts -->
<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>

<!-- Third-party -->
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm" crossorigin>

<!-- Individual Script Preloads -->
<link rel="preload" href="https://example.r2.dev/nav_dropdown.min.js?v=1.3.1" as="script">
```

**Rules:**
- Inline label is short (1 line, ≤80 chars where possible)
- Title-cases the label (`Preconnect`, `DNS Prefetch`, `Fonts`, `Third-party`, `Individual Script Preloads`) — distinct from section-header ALL CAPS
- Label can include parenthetical context for non-obvious blocks (`Google Tag Manager (Delayed for LCP, skipped on slow connections)`)

### End-marker pattern (for multi-line blocks)

When a `<script>` or `<style>` block spans 5+ lines, close it with an `<!-- End ComponentName -->` comment. This gives visual closure when scanning the panel:

```html
<!-- Google Tag Manager (Delayed for LCP, skipped on slow connections) -->
<script>
  (function () {
    // ... 30 lines of GTM bootstrap logic ...
  })();
</script>
<!-- End Google Tag Manager -->
```

End-markers are OPTIONAL for short blocks (`<link>` tags, single-line `<script>` tags, `<meta>` tags) — those don't need closing comments.

### Comments INSIDE `<script>` blocks

Once inside a `<script>` block, the rules in [`../javascript/style_guide.md`](../javascript/style_guide.md) §5 apply (function preambles, inline WHY-comments, group-introductory comments, snake_case naming). HTML comment syntax (`<!-- -->`) does NOT work inside `<script>`; use `//` line comments or `/* */` block comments per the JS conventions.

```html
<script>
  // LCP Safety Timeout - Force page visible after timeout
  (function () {
    var isMobile = window.innerWidth < 992;
    var timeout = isMobile ? 2000 : 3000;

    setTimeout(function () {
      var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
      if (pw && !pw.classList.contains('page-ready')) {
        pw.classList.add('page-ready');
        console.warn('[LCP Safety] Force-revealed page after ' + timeout + 'ms timeout');
      }
    }, timeout);
  })();
</script>
```

### Comment density (HTML head/footer)

Higher density than typical HTML body markup because each block has a distinct load-order purpose:

- **Every** numbered section gets a 3-line section header with parenthetical context
- **Every** distinct `<script>` / `<link>` / `<meta>` group gets a 1-line inline label
- Multi-line `<script>` blocks (5+ lines) get an `<!-- End X -->` closing marker
- Inside `<script>`, comment density follows JS rules (~1 per 5-10 lines)

### Standard Head section order (typical)

```
1. ANALYTICS (inline, must fire early)
2. SECURITY META TAGS
3. CONNECTION HINTS (preconnect, dns-prefetch)
4. PRELOADS (critical resources)
4b. SPECULATIVE PREFETCH (likely navigation targets)
5. JS DETECTION
6. SERVICE WORKER REGISTRATION
7. MODULE SCRIPTS (ES modules, non-blocking)
8. SCHEMA MARKUP
```

### Standard Footer section order (typical)

```
1. THIRD-PARTY LIBRARIES (load first, others depend on these)
2. CUSTOM SCRIPTS
```

Within CUSTOM SCRIPTS, group `<script>` tags by inline label categories: `Performance`, `SEO`, `Touch Scroll Guard`, `Browser`, `Cookie Consent`, `Accordion`, `Navigation`, `Copyright`, etc.

### Production reference

Compare your panel content against `anobel.com/src/0_html/global.html` — the canonical example of these conventions.

---

## RELATED RESOURCES

- [`../shared/cross_language_rules.md`](../../../../shared/references/webflow-shared/cross_language_rules.md) — file naming, comment principles, file-header banner format
- [`../javascript/style_guide.md`](../javascript/style_guide.md) — JS conventions for code that targets HTML
- [`../css/style_guide.md`](../css/style_guide.md) — CSS conventions for styling Webflow output
- [`../implementation/webflow_patterns.md`](../implementation/webflow_patterns.md) — Webflow-specific implementation patterns (collection lists, async rendering, page transitions)
- [`../javascript/quality_standards.md`](../javascript/quality_standards.md) — action routing pattern and event delegation
- [`../javascript/quick_reference.md`](../javascript/quick_reference.md) — form validation class reference
