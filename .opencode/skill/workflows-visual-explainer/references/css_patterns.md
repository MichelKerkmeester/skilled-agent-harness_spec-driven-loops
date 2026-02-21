---
description: "Comprehensive CSS pattern library covering all 9 aesthetic profiles with custom properties, depth tiers, backgrounds, and animations"
---

# Visual Explainer — CSS Patterns

> LOAD PRIORITY: CONDITIONAL — load when generating any HTML output.

A comprehensive CSS pattern library for visual-explainer HTML pages. Copy-paste these patterns as the foundation for generated pages.

---

## Theme Setup — CSS Custom Properties

Always define these variables in `:root`. The `--ve-` prefix namespaces them to avoid conflicts.

```css
:root {
  /* Typography */
  --font-body: 'Bricolage Grotesque', system-ui, sans-serif;
  --font-mono: 'Fragment Mono', 'SF Mono', Consolas, monospace;

  /* Surfaces */
  --ve-bg: #fafaf9;
  --ve-surface: #ffffff;
  --ve-surface2: #f5f5f4;
  --ve-surface-elevated: #fffdf9;
  --ve-border: rgba(0, 0, 0, 0.07);
  --ve-border-bright: rgba(0, 0, 0, 0.14);

  /* Text */
  --ve-text: #1c1917;
  --ve-text-dim: #78716c;

  /* Accent — override per aesthetic */
  --ve-accent: #8b5cf6;
  --ve-accent-dim: rgba(139, 92, 246, 0.08);

  /* Semantic colors */
  --ve-success: #16a34a;
  --ve-success-dim: rgba(22, 163, 74, 0.08);
  --ve-warning: #d97706;
  --ve-warning-dim: rgba(217, 119, 6, 0.08);
  --ve-danger: #dc2626;
  --ve-danger-dim: rgba(220, 38, 38, 0.08);
}

/* Dark mode — complete override */
@media (prefers-color-scheme: dark) {
  :root {
    --ve-bg: #0c0a09;
    --ve-surface: #1c1917;
    --ve-surface2: #292524;
    --ve-surface-elevated: #231f1e;
    --ve-border: rgba(255, 255, 255, 0.07);
    --ve-border-bright: rgba(255, 255, 255, 0.13);
    --ve-text: #fafaf9;
    --ve-text-dim: #a8a29e;
    --ve-accent: #a78bfa;
    --ve-accent-dim: rgba(167, 139, 250, 0.12);
    --ve-success: #4ade80;
    --ve-success-dim: rgba(74, 222, 128, 0.1);
    --ve-warning: #fbbf24;
    --ve-warning-dim: rgba(251, 191, 36, 0.1);
    --ve-danger: #f87171;
    --ve-danger-dim: rgba(248, 113, 113, 0.1);
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
  background-image: radial-gradient(ellipse at 30% 0%, var(--ve-accent-dim), transparent 50%);
}
```

### Dual Radial (two anchor points — architectural feel)
```css
body {
  background-color: var(--ve-bg);
  background-image:
    radial-gradient(ellipse at 20% 0%, var(--ve-accent-dim) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, var(--ve-success-dim) 0%, transparent 40%);
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* Default — standard cards and sections */
.depth-default {
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Recessed — secondary info, inner content */
.depth-recessed {
  background: var(--ve-surface2);
  border: 1px solid var(--ve-border);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
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
  animation: fadeUp 0.4s ease-out both;
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
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
