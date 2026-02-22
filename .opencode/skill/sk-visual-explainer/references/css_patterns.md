---
description: "Comprehensive CSS pattern library covering all 9 aesthetic profiles with custom properties, depth tiers, backgrounds, and animations"
---

# Visual Explainer — CSS Patterns

> LOAD PRIORITY: CONDITIONAL — load when generating any HTML output.

A comprehensive CSS pattern library for sk-visual-explainer HTML pages. Copy-paste these patterns as the foundation for generated pages.

---

## 1. OVERVIEW

Use this reference when selecting or composing a visual style for generated HTML pages.

It defines the canonical `--ve-*` token system, atmosphere backgrounds, layout primitives, and reusable UI pattern snippets.

---

## Theme Setup — CSS Custom Properties

Always define these variables in `:root`. The `--ve-` prefix namespaces them to avoid conflicts.

```css
:root {
  /* Typography — override per template */
  --font-body: 'Bricolage Grotesque', system-ui, sans-serif;
  --font-mono: 'Fragment Mono', 'SF Mono', Consolas, monospace;

  /* Surfaces */
  --ve-bg: #f8f9fb;
  --ve-surface: #ffffff;
  --ve-surface2: #f0f3f6;
  --ve-surface-elevated: #fbfcfd;
  --ve-border: rgba(15, 23, 42, 0.08);
  --ve-border-bright: rgba(15, 23, 42, 0.15);

  /* Text */
  --ve-text: #1a2332;
  --ve-text-dim: #5e6e7e;

  /* Accent — desaturated teal */
  --ve-accent: #3d867e;
  --ve-accent-dim: rgba(61, 134, 126, 0.08);

  /* Semantic colors — desaturated */
  --ve-success: #3a7a55;
  --ve-success-dim: rgba(58, 122, 85, 0.08);
  --ve-warning: #946830;
  --ve-warning-dim: rgba(148, 104, 48, 0.08);
  --ve-danger: #9c4242;
  --ve-danger-dim: rgba(156, 66, 66, 0.08);
}

/* Dark mode — complete override */
@media (prefers-color-scheme: dark) {
  :root {
    --ve-bg: #0e1419;
    --ve-surface: #151d25;
    --ve-surface2: #1c2630;
    --ve-surface-elevated: #212d38;
    --ve-border: rgba(200, 215, 230, 0.10);
    --ve-border-bright: rgba(200, 215, 230, 0.18);
    --ve-text: #dce4ec;
    --ve-text-dim: #8899a8;
    --ve-accent: #5eb8af;
    --ve-accent-dim: rgba(94, 184, 175, 0.12);
    --ve-success: #5cbd82;
    --ve-success-dim: rgba(92, 189, 130, 0.12);
    --ve-warning: #d4a24a;
    --ve-warning-dim: rgba(212, 162, 74, 0.12);
    --ve-danger: #d07070;
    --ve-danger-dim: rgba(208, 112, 112, 0.12);
  }
}
```

### Compatibility and Contrast Media Features

Include these support patterns on new pages:

```html
<meta name="color-scheme" content="light dark">
```

```css
@media (prefers-contrast: more) {
  :root {
    --ve-border: rgba(0, 0, 0, 0.25);
    --ve-border-bright: rgba(0, 0, 0, 0.38);
    --ve-text-dim: #3d4d5c;
  }
}

@media (forced-colors: active) {
  :root {
    --ve-bg: Canvas;
    --ve-surface: Canvas;
    --ve-surface2: Canvas;
    --ve-text: CanvasText;
    --ve-text-dim: CanvasText;
    --ve-border: CanvasText;
    --ve-border-bright: CanvasText;
  }

  * {
    forced-color-adjust: auto;
  }
}
```

---

## Background Atmosphere Patterns

Choose one per page — sets the ambient mood without being distracting.

### Radial Gradient (default — subtle warmth)
```css
body {
  background-color: var(--ve-bg);
  background-image: radial-gradient(ellipse at 25% -5%, var(--ve-accent-dim), transparent 45%);
}
```

### Dual Radial (two anchor points — architectural feel)
```css
body {
  background-color: var(--ve-bg);
  background-image:
    radial-gradient(ellipse at 15% -5%, var(--ve-accent-dim) 0%, transparent 45%),
    radial-gradient(ellipse at 85% 105%, var(--ve-success-dim) 0%, transparent 35%);
}
```

### Dot Grid (blueprint/technical feel)
```css
body {
  background-color: var(--ve-bg);
  background-image: radial-gradient(circle, var(--ve-border) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Diagonal Lines (structured, engineering feel)
```css
body {
  background-color: var(--ve-bg);
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    var(--ve-border) 20px,
    var(--ve-border) 21px
  );
}
```

### Gradient Mesh (rich, editorial feel)
```css
body {
  background-color: var(--ve-bg);
  background-image:
    radial-gradient(ellipse at 0% 0%, var(--ve-accent-dim), transparent 40%),
    radial-gradient(ellipse at 100% 0%, var(--ve-warning-dim), transparent 40%),
    radial-gradient(ellipse at 50% 100%, var(--ve-success-dim), transparent 50%);
}
```

---

## Depth Tiers

Three distinct levels of elevation for cards and containers.

```css
/* Elevated — most prominent, entry points */
.depth-elevated {
  background: var(--ve-surface-elevated);
  border: 1px solid color-mix(in srgb, var(--ve-border) 50%, var(--ve-accent) 50%);
  border-top: 2px solid var(--ve-accent);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03);
}

/* Default — standard cards and sections */
.depth-default {
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
}

/* Recessed — secondary info, inner content */
.depth-recessed {
  background: var(--ve-surface2);
  border: 1px solid var(--ve-border);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
}

/* Glass — special-occasion overlay effect (use sparingly) */
.node--glass {
  background: color-mix(in srgb, var(--ve-surface) 60%, transparent 40%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.1);
}
```

---

## SpecKit Dashboard and Traceability Modules

Use these module classes for the two SpecKit templates.

```css
/* KPI row for artifact dashboard */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 10px;
}

.kpi-card {
  background: var(--ve-surface2);
  border: 1px solid var(--ve-border);
  border-radius: 12px;
  padding: 12px;
}

/* Coverage and risk panels */
.coverage-map,
.risk-gaps-panel {
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
  border-radius: 12px;
  padding: 14px;
}

/* Cross-reference matrix for traceability board */
.crossref-matrix {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.crossref-matrix th,
.crossref-matrix td {
  padding: 10px;
  border-bottom: 1px solid var(--ve-border);
  text-align: left;
}

/* Diagnostics list */
.missing-link-diagnostics {
  display: grid;
  gap: 8px;
}
```

Recommended breakpoints:

```css
@media (max-width: 820px) {
  .kpi-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
```

---

## CRITICAL: Overflow Protection

**Always include these rules on flex/grid containers.** Missing them is the #1 cause of layout breaks.

```css
/* Prevent flex/grid children from overflowing their container */
.flex-child { min-width: 0; }
.grid-child { min-width: 0; }

/* Safe text wrapping for long strings */
.text-wrap {
  overflow-wrap: break-word;
  word-break: break-word;
}

/* NEVER apply display:flex to <li> elements — use a wrapper instead */
/* BAD:  li { display: flex; } */
/* GOOD: li .li-inner { display: flex; } */

/* Table cells — prevent content from breaking layout */
.data-table td {
  overflow-wrap: break-word;
  max-width: 0; /* combined with width: X% triggers wrapping */
}

/* Horizontal scroll for wide content (tables, pipelines) */
.scroll-x {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

## Grid Layouts

### Architecture Two-Column
```css
.arch-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .arch-grid { grid-template-columns: 1fr; }
}
```

### Pipeline (Horizontal, Equal-Width Steps)
```css
.pipeline {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(200px, 1fr);
  gap: 0;
  overflow-x: auto;
}
```

### Card Auto-Fit (Responsive)
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
```

### Three-Column (Equal)
```css
.three-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .three-col { grid-template-columns: 1fr; }
}
```

---

## Data Tables

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.55;
}

/* Sticky header */
.data-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
}

/* Sticky first column (for very wide tables) */
.data-table th:first-child,
.data-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--ve-surface);
}

/* Right-align numeric columns */
.data-table td.num,
.data-table th.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
}

.data-table th {
  background: var(--ve-surface2);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ve-text-dim);
  text-align: left;
  padding: 14px 16px;
  border-bottom: 2px solid var(--ve-border-bright);
  white-space: nowrap;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--ve-border);
  vertical-align: top;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* Alternating rows using accent color */
.data-table tbody tr:nth-child(even) {
  background: var(--ve-accent-dim);
}

.data-table tbody tr:hover {
  background: var(--ve-border);
  transition: background 0.15s ease;
}

/* Footer row */
.data-table tfoot td {
  background: var(--ve-surface2);
  font-weight: 600;
  font-family: var(--font-mono);
  font-size: 12px;
  border-top: 2px solid var(--ve-border-bright);
  border-bottom: none;
  padding: 14px 16px;
}

/* Code inside cells */
.data-table code {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--ve-accent-dim);
  color: var(--ve-accent);
  padding: 1px 5px;
  border-radius: 3px;
}

/* Wide column helper */
.data-table .col-wide {
  min-width: 220px;
  max-width: 440px;
}
```

---

## Connectors

### Vertical Flow Arrow (SVG)
```html
<div class="flow-arrow">
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none"
       stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 4 L10 16 M6 12 L10 16 L14 12"/>
  </svg>
  <span>label text</span>
</div>
```

```css
.flow-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: var(--ve-text-dim);
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 4px 0;
}
```

### Horizontal Arrow (CSS pseudo-element)
```css
.h-arrow {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.h-arrow::before {
  content: '';
  display: block;
  width: 32px;
  height: 1px;
  background: var(--ve-border-bright);
}

.h-arrow::after {
  content: '›';
  color: var(--ve-border-bright);
  font-size: 18px;
  line-height: 1;
  margin-left: -4px;
}
```

### Curved Path (SVG for complex connections)
```html
<svg class="connector-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
  <path d="M0,30 Q50,0 100,30" stroke="var(--ve-border-bright)"
        stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>
</svg>
```

---

## Animations

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Apply to any element with --i CSS variable for stagger */
.animate {
  animation: fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i, 0) * 0.06s);
}

/* Usage in HTML: <div class="animate" style="--i:3"> */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Scale-fade — for KPI cards, badges, status indicators */
@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* SVG draw-in — for connectors, progress rings, path elements */
/* Set --path-length to the path's getTotalLength() value */
@keyframes drawIn {
  from { stroke-dashoffset: var(--path-length); }
  to { stroke-dashoffset: 0; }
}

/* Hover lift — apply to any interactive card */
.node {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* CSS counter animation — hero numbers without JS */
/* Falls back to final value in browsers without @property support */
@property --count {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}

@keyframes countUp {
  to { --count: var(--target); }
}

.kpi-card__value--animated {
  --target: 0; /* override per element: style="--target: 247" */
  counter-reset: val var(--count);
  animation: countUp 1.2s ease-out forwards;
}

.kpi-card__value--animated::after {
  content: counter(val);
}

/* ALWAYS include reduced motion override */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## KPI Cards

```css
.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.kpi-card {
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
}

.kpi-card__value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.kpi-card__value--success { color: var(--ve-success); }
.kpi-card__value--warning { color: var(--ve-warning); }
.kpi-card__value--danger { color: var(--ve-danger); }
.kpi-card__value--accent { color: var(--ve-accent); }

.kpi-card__label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ve-text-dim);
  margin-top: 6px;
}

/* Trend indicators — up/down modifiers */
.kpi-card__trend {
  font-family: var(--font-mono);
  font-size: 12px;
  margin-top: 4px;
}

.kpi-card__trend--up   { color: var(--ve-success); }
.kpi-card__trend--down { color: var(--ve-danger); }
```

---

## Comparison Panels (Before / After)

```css
.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.compare-panel {
  border: 1px solid var(--ve-border);
  border-radius: 10px;
  overflow: hidden;
}

.compare-panel__header {
  padding: 10px 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.compare-panel--before .compare-panel__header {
  background: var(--ve-danger-dim);
  color: var(--ve-danger);
  border-bottom: 1px solid var(--ve-danger-dim);
}

.compare-panel--after .compare-panel__header {
  background: var(--ve-success-dim);
  color: var(--ve-success);
  border-bottom: 1px solid var(--ve-success-dim);
}

.compare-panel__body {
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ve-text-dim);
}

@media (max-width: 768px) {
  .compare-grid { grid-template-columns: 1fr; }
}
```

---

## Collapsible Sections

```css
details.collapsible {
  border: 1px solid var(--ve-border);
  border-radius: 10px;
  overflow: hidden;
}

details.collapsible summary {
  padding: 14px 20px;
  background: var(--ve-surface);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ve-text);
  transition: background 0.15s ease;
  user-select: none;
}

details.collapsible summary:hover {
  background: var(--ve-surface2);
}

details.collapsible summary::-webkit-details-marker { display: none; }

details.collapsible summary::before {
  content: '▸';
  font-size: 11px;
  color: var(--ve-text-dim);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

details.collapsible[open] summary::before {
  transform: rotate(90deg);
}

details.collapsible .collapsible__body {
  padding: 16px 20px;
  border-top: 1px solid var(--ve-border);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ve-text-dim);
}
```

---

## Badges and Tags

```css
.status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

/* Dot indicator before text */
.status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.status--match  { background: var(--ve-success-dim); color: var(--ve-success); }
.status--gap    { background: var(--ve-danger-dim);  color: var(--ve-danger); }
.status--warn   { background: var(--ve-warning-dim); color: var(--ve-warning); }
.status--accent { background: var(--ve-accent-dim);  color: var(--ve-accent); }

/* Pill tag (no dot, plain label) */
.tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--ve-surface2);
  border: 1px solid var(--ve-border);
  color: var(--ve-text-dim);
}
```

---

## Responsive Breakpoints

```css
/* Primary breakpoint — tablet/mobile transition */
@media (max-width: 768px) {
  body { padding: 20px; }
  h1 { font-size: clamp(22px, 5vw, 32px); }

  /* Stack all multi-column layouts */
  .arch-grid,
  .three-col,
  .compare-grid { grid-template-columns: 1fr; }

  /* Pipelines wrap instead of scroll */
  .pipeline {
    grid-auto-flow: row;
    grid-auto-columns: 1fr;
  }

  /* Reduce table padding */
  .data-table th,
  .data-table td { padding: 10px 12px; }
}

/* Micro-breakpoint — narrow phones */
@media (max-width: 480px) {
  body { padding: 16px; }
  .kpi-row { grid-template-columns: 1fr 1fr; }
}
```

---

## Sparklines (Inline SVG Trend Indicators)

```html
<!-- Inline sparkline — drop directly inside a table cell or KPI card -->
<svg class="sparkline" viewBox="0 0 80 24" preserveAspectRatio="none"
     width="80" height="24">
  <polyline
    points="0,20 10,16 20,18 30,10 40,12 50,6 60,8 70,4 80,2"
    fill="none"
    stroke="var(--ve-success)"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"/>
</svg>
```

```css
.sparkline {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
  overflow: visible;
}
```

### Progress Bars

```html
<div class="progress-bar">
  <div class="progress-fill" style="--pct: 72%"></div>
</div>
```

```css
.progress-bar {
  height: 6px;
  background: var(--ve-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: var(--pct, 0%);
  background: var(--ve-accent);
  border-radius: 3px;
}
```

---

## Callout Block

```css
.callout {
  background: var(--ve-surface2);
  border: 1px solid var(--ve-border);
  border-left: 3px solid var(--ve-accent);
  border-radius: 0 8px 8px 0;
  padding: 14px 18px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ve-text-dim);
}

.callout strong { color: var(--ve-text); font-weight: 600; }

.callout code {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--ve-accent-dim);
  color: var(--ve-accent);
  padding: 1px 5px;
  border-radius: 3px;
}

/* Color variants */
.callout--success { border-left-color: var(--ve-success); }
.callout--warning { border-left-color: var(--ve-warning); }
.callout--danger  { border-left-color: var(--ve-danger); }
```

---

## Generated Images

For AI-generated or stock illustrations embedded as `<img>` elements. Use sparingly — hero banners, conceptual illustrations, decorative accents.

### Hero Banner

Full-width image cropped to a fixed height with a gradient fade into the page background. Place before the title or between the title and first content section.

```css
.hero-img-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.hero-img-wrap img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

/* Gradient fade into page background */
.hero-img-wrap::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, var(--ve-bg), transparent);
  pointer-events: none;
}
```

```html
<div class="hero-img-wrap">
  <img src="..." alt="Descriptive alt text">
</div>
```

### Inline Illustration

Centered image with border, shadow, and optional caption. Use within content sections for conceptual or educational illustrations.

```css
.illus {
  text-align: center;
  margin: 24px 0;
}

.illus img {
  max-width: 480px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--ve-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.illus figcaption {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ve-text-dim);
  margin-top: 8px;
}
```

```html
<figure class="illus">
  <img src="..." alt="Descriptive alt text">
  <figcaption>Caption describing the image</figcaption>
</figure>
```

### Side Accent

Small image floated beside a section. Use when the illustration supports but doesn't dominate the content.

```css
.accent-img {
  float: right;
  max-width: 200px;
  margin: 0 0 16px 24px;
  border-radius: 10px;
  border: 1px solid var(--ve-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

@media (max-width: 768px) {
  .accent-img {
    float: none;
    max-width: 100%;
    margin: 0 0 16px 0;
  }
}
```

```html
<img class="accent-img" src="..." alt="Descriptive alt text">
```

---

## Semantic Node Colors

Apply to `.node` elements to signal meaning through color. Uses the existing semantic color variables from the theme.

```css
/* Primary — accent-colored node for focal/hero elements */
.node--primary {
  border-color: color-mix(in srgb, var(--ve-border) 50%, var(--ve-accent) 50%);
  background: color-mix(in srgb, var(--ve-surface) 94%, var(--ve-accent) 6%);
}

/* Success — green node for healthy/passing states */
.node--success {
  border-color: color-mix(in srgb, var(--ve-border) 50%, var(--ve-success) 50%);
  background: var(--ve-success-dim);
}

/* Warning — amber node for degraded/at-risk states */
.node--warning {
  border-color: color-mix(in srgb, var(--ve-border) 50%, var(--ve-warning) 50%);
  background: var(--ve-warning-dim);
}

/* Danger — red node for failing/critical states */
.node--danger {
  border-color: color-mix(in srgb, var(--ve-border) 50%, var(--ve-danger) 50%);
  background: var(--ve-danger-dim);
}
```
