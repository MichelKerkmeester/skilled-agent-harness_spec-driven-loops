---
description: "Comprehensive CSS pattern library covering all 9 aesthetic profiles with custom properties, depth tiers, backgrounds, and animations"
---

# Doc Visual — CSS Patterns

> LOAD PRIORITY: CONDITIONAL — load when generating any HTML output.

A comprehensive CSS pattern library for sk-doc-visual HTML pages. Copy-paste these patterns as the foundation for generated pages.

---

## 1. OVERVIEW

Use this reference when selecting or composing a visual style for generated HTML pages.

It defines the canonical README Ledger token system (`--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border`), plus a `--ve-*` alias bridge for migration-safe snippets.

---

## Theme Setup — CSS Custom Properties

Always define the README Ledger variables in `:root` first. Keep `--ve-*` aliases for compatibility with legacy snippets and templates.

```css
:root {
  /* README Ledger tokens (default profile) */
  --bg: #131314;
  --surface: #1c1c1e;
  --surface2: #232326;
  --surface-elevated: #2a2a2d;
  --text: #fafafa;
  --muted: #71717a;
  --accent: #3b82f6;
  --border: #27272a;
  --border-bright: #3f3f46;
  --accent-dim: rgba(59, 130, 246, 0.14);

  --success: #22c55e;
  --success-dim: rgba(34, 197, 94, 0.14);
  --warning: #f59e0b;
  --warning-dim: rgba(245, 158, 11, 0.14);
  --danger: #ef4444;
  --danger-dim: rgba(239, 68, 68, 0.14);

  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;

  /* Compatibility aliases for existing --ve-* snippets */
  --ve-bg: var(--bg);
  --ve-surface: var(--surface);
  --ve-surface2: var(--surface2);
  --ve-surface-elevated: var(--surface-elevated);
  --ve-border: var(--border);
  --ve-border-bright: var(--border-bright);
  --ve-text: var(--text);
  --ve-text-dim: var(--muted);
  --ve-accent: var(--accent);
  --ve-accent-dim: var(--accent-dim);
  --ve-success: var(--success);
  --ve-success-dim: var(--success-dim);
  --ve-warning: var(--warning);
  --ve-warning-dim: var(--warning-dim);
  --ve-danger: var(--danger);
  --ve-danger-dim: var(--danger-dim);
}

/* Light mode override (keep dual-theme support for validator and accessibility) */
@media (prefers-color-scheme: light) {
  :root {
    --bg: #f5f6fa;
    --surface: #ffffff;
    --surface2: #eef1f6;
    --surface-elevated: #ffffff;
    --text: #18181b;
    --muted: #52525b;
    --accent: #2563eb;
    --border: #d4d4d8;
    --border-bright: #a1a1aa;
    --accent-dim: rgba(37, 99, 235, 0.12);

    --success: #15803d;
    --success-dim: rgba(21, 128, 61, 0.12);
    --warning: #b45309;
    --warning-dim: rgba(180, 83, 9, 0.12);
    --danger: #b91c1c;
    --danger-dim: rgba(185, 28, 28, 0.12);
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
    --border: currentColor;
    --border-bright: currentColor;
    --muted: var(--text);
  }
}

@media (forced-colors: active) {
  :root {
    --bg: Canvas;
    --surface: Canvas;
    --surface2: Canvas;
    --text: CanvasText;
    --muted: CanvasText;
    --border: CanvasText;
    --border-bright: CanvasText;
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

## README Ledger Components (Default Module Set)

Use this module set as the default profile shell. Keep class names unchanged for deterministic rendering across artifacts.

```css
.terminal-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: color-mix(in srgb, var(--surface) 88%, transparent 12%);
  border-bottom: 1px solid var(--border);
  font: 700 10px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.glass-card {
  background: color-mix(in srgb, var(--surface) 86%, transparent 14%);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.3s ease;
}
.glass-card:hover { border-color: var(--accent); }

.toc-link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--muted);
  text-decoration: none;
  font: 700 11px/1.35 var(--font-mono);
  text-transform: uppercase;
}
.toc-link.active { color: var(--accent); }
.toc-link.active::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}

.ledger-line {
  height: 1px;
  background: linear-gradient(90deg, var(--border) 0%, transparent 100%);
}

.flow-step {
  padding: 1.25rem;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface) 92%, transparent 8%);
  border-radius: 6px;
}
.viz-bar {
  height: 6px;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
}
.viz-fill {
  height: 100%;
  width: 0;
  background: var(--accent);
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scanline {
  position: fixed;
  inset: 0 auto auto 0;
  width: 100%;
  height: 1px;
  opacity: 0.08;
  pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
  animation: scanline 10s linear infinite;
}
@keyframes scanline { from { transform: translateY(-100vh); } to { transform: translateY(100vh); } }

.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.in-view { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  .viz-fill { transition: none; width: var(--target-width, 100%); }
  .scanline { animation: none; }
}
```

### README Fluid Typography Recipe

```css
html { font-size: clamp(14px, 0.72vw + 12px, 18px); }
h1 { font-size: clamp(2.75rem, 7vw, 8rem); line-height: 0.95; letter-spacing: -0.03em; }
h2 { font-size: clamp(0.58rem, 0.28vw + 0.5rem, 0.72rem); letter-spacing: 0.3em; text-transform: uppercase; }
p, li { font-size: clamp(0.95rem, 0.35vw + 0.86rem, 1.12rem); line-height: 1.7; }
@media (max-width: 1024px) {
  h1 { font-size: clamp(2rem, 12vw, 4rem); }
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
