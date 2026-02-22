---
description: "Deep-dive reference for Mermaid.js 11.12.3, Chart.js 4.5.1, and anime.js 4.3.6 with accessibility, security, and performance defaults"
---

# Visual Explainer — Library Guide

> LOAD PRIORITY: ON_DEMAND — load when deep-diving into Mermaid, Chart.js, or anime.js behavior.

Detailed reference for all external JavaScript libraries used in sk-visual-explainer HTML output.

---

## 1. OVERVIEW

Use this reference when output depends on Mermaid, Chart.js, or anime.js and you need exact version-safe setup details.

It provides canonical CDN/import patterns, initialization rules, and minimal working snippets for each library.

---

## SpecKit Traceability Graph Starter

For `ve-view-mode=traceability-board`, use a Mermaid graph with explicit document-node IDs and deterministic links:

```html
<pre class="mermaid">
graph LR
  spec[spec.md] --> plan[plan.md]
  spec --> tasks[tasks.md]
  plan --> checklist[checklist.md]
  tasks --> checklist
  checklist --> summary[implementation-summary.md]
</pre>
```

Rules:
- Keep node labels as canonical filenames (`spec.md`, `plan.md`, etc.).
- Use optional dotted edges for non-required docs (`research.md`, `decision-record.md`).
- Mirror graph links in the cross-reference matrix table so traceability checks stay coherent.

---

## Mermaid.js 11.12.3

### CDN Import

Mermaid v11 is ESM-only. Always import as an ES module at the bottom of `<body>`:

```html
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.12.3/dist/mermaid.esm.min.mjs';
  import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0.2.0/dist/mermaid-layout-elk.esm.min.mjs';

  mermaid.registerLayoutLoaders(elkLayouts);

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    look: 'handDrawn',   // 'handDrawn' | 'classic'
    layout: 'elk',
    themeVariables: {
      primaryColor: isDark ? '#115e59' : '#ccfbf1',
      primaryBorderColor: isDark ? '#2dd4bf' : '#0d9488',
      primaryTextColor: isDark ? '#ccfbf1' : '#134e4a',
      lineColor: isDark ? '#5eead4' : '#5f8a85',
      fontSize: '16px',
      fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
    }
  });
</script>
```

### Theme Configuration Rules

- **Always use `theme: 'base'`** with custom `themeVariables`. Never use pre-built themes (`default`, `dark`, `forest`, `neutral`) — they ignore your color system.
- `look: 'handDrawn'` produces a sketchy, hand-crafted aesthetic. Switch to `look: 'classic'` for precise, technical lines.
- `layout: 'elk'` provides superior node positioning for complex graphs. Requires the separate ELK import above. Without it, Mermaid silently falls back to dagre (worse layout).
- `fontSize: '16px'` is the minimum for readability — never go below this.
- Always read `window.matchMedia('(prefers-color-scheme: dark)').matches` and pass matching colors.

### Security + Determinism Defaults (Required)

When Mermaid is used, include these initialization options:

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  layout: 'elk',
  securityLevel: 'strict',
  deterministicIds: true,
  maxTextSize: 50000,
  maxEdges: 200,
});
```

- `securityLevel: 'strict'` reduces unsafe HTML injection surfaces.
- `deterministicIds: true` keeps stable output IDs for reproducible renders.
- `maxTextSize` and `maxEdges` protect against pathological diagram payloads.

### Full themeVariables Example (Teal palette, light + dark)

```javascript
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  look: 'handDrawn',
  layout: 'elk',
  themeVariables: {
    // Primary nodes
    primaryColor:       isDark ? '#115e59' : '#ccfbf1',
    primaryBorderColor: isDark ? '#2dd4bf' : '#0d9488',
    primaryTextColor:   isDark ? '#ccfbf1' : '#134e4a',
    // Secondary nodes
    secondaryColor:       isDark ? '#1e1b4b' : '#ede9fe',
    secondaryBorderColor: isDark ? '#c4b5fd' : '#7c3aed',
    secondaryTextColor:   isDark ? '#ccfbf1' : '#134e4a',
    // Tertiary nodes
    tertiaryColor:       isDark ? '#2e2618' : '#fffbeb',
    tertiaryBorderColor: isDark ? '#fbbf24' : '#d97706',
    tertiaryTextColor:   isDark ? '#ccfbf1' : '#134e4a',
    // Edges and annotations
    lineColor:     isDark ? '#5eead4' : '#5f8a85',
    fontSize:      '16px',
    fontFamily:    "'Bricolage Grotesque', system-ui, sans-serif",
    // Notes
    noteBkgColor:    isDark ? '#115e59' : '#fefce8',
    noteTextColor:   isDark ? '#ccfbf1' : '#134e4a',
    noteBorderColor: isDark ? '#fbbf24' : '#d97706',
  }
});
```

### classDef Rules (CRITICAL)

```
classDef myClass fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
```

- **NEVER set `color:` in classDef** — it causes parser issues in v11 and makes text invisible.
- Use **8-digit hex** for transparency: `fill:#0d948822` (last two digits = alpha).
- Avoid `font-weight:` and other CSS properties — only `fill`, `stroke`, `stroke-width`, `stroke-dasharray`, `rx`, `ry` are reliably supported.
- Apply with `:::myClass` on node labels or `class nodeId myClass` at the end of the diagram.

### stateDiagram-v2 Parser Limitations

When using `stateDiagram-v2`, avoid:
- `<br/>` inside state labels — use separate states for multi-line content instead
- Parentheses in state names: `State (detail)` fails — use `State_detail` or quotes
- Multiple colons in a single state name: `A: step: one` fails — use `A: step one`
- Special characters (`&`, `<`, `>`) — use `&amp;`, `&lt;`, `&gt;` or avoid entirely

### Per-Diagram Frontmatter

Use frontmatter to configure diagram-level behavior without touching the global `mermaid.initialize()` call:

```
---
config:
  look: handDrawn      # 'handDrawn' | 'classic'
  layout: elk          # 'elk' | 'dagre' (default)
  theme: base
---
graph TD
  A --> B
```

Supported per diagram types:
- **Flowchart** (`graph TD` / `graph LR`): `TYPE: flowchart`, `WHEN: components + connections`, `ENGINE: mermaid`, `RULES: quote special chars, max 20 nodes, use subgraph for grouping`
- **Sequence** (`sequenceDiagram`): `TYPE: sequence`, `WHEN: actor interactions + messages`, `ENGINE: mermaid`, `RULES: use ->>/-->> for sync/async, avoid HTML in labels`
- **ER** (`erDiagram`): `TYPE: er`, `WHEN: data schema + relationships`, `ENGINE: mermaid`, `RULES: define attributes inline, use cardinality notation`
- **State** (`stateDiagram-v2`): `TYPE: state`, `WHEN: lifecycle states + transitions`, `ENGINE: mermaid`, `RULES: avoid colons/parens in labels, use flowchart for complex labels`
- **Mind map** (`mindmap`): `TYPE: mindmap`, `WHEN: hierarchical breakdown + topics`, `ENGINE: mermaid`, `RULES: indent-based syntax, no edge labels`

### Minimal Complete Diagram Examples

These are the smallest valid Mermaid code blocks that produce a working diagram for each supported type. Use as starting points.

**Flowchart with decision:**
```html
<pre class="mermaid">
graph TD
  A[Start] --> B{Condition?}
  B -->|Yes| C[Handle Yes]
  B -->|No| D[Handle No]
  C --> E[End]
  D --> E
</pre>
```

**Sequence diagram:**
```html
<pre class="mermaid">
sequenceDiagram
  participant C as Client
  participant S as Server
  participant D as Database
  C->>S: POST /api/data
  S->>D: INSERT query
  D-->>S: Result
  S-->>C: 200 OK
  Note over C,S: Sync message (->>), async return (-->>)
</pre>
```

**ER diagram:**
```html
<pre class="mermaid">
erDiagram
  USERS ||--o{ ORDERS : places
  ORDERS ||--|{ LINE_ITEMS : contains
  LINE_ITEMS }o--|| PRODUCTS : references
  USERS { string email PK }
  ORDERS { int id PK }
  LINE_ITEMS { int quantity }
  PRODUCTS { string name }
</pre>
```

**State diagram:**
```html
<pre class="mermaid">
stateDiagram-v2
  [*] --> Draft
  Draft --> Review : submit
  Review --> Approved : approve
  Review --> Draft : request_changes
  Approved --> Published : publish
  Published --> [*]
</pre>
```

**Mind map:**
```html
<pre class="mermaid">
mindmap
  root((Project))
    Frontend
      React
      Tailwind
    Backend
      Node.js
      PostgreSQL
    Infrastructure
      Docker
      CI/CD
</pre>
```

### General Diagram Writing Rules

1. **Quote special characters** — wrap node labels with special chars in quotes: `A["Label with: colon"]`
2. **Simple alphanumeric node IDs** — use `A`, `B`, `step1`, `paymentGateway`. Avoid spaces or hyphens in IDs.
3. **Max 15-20 nodes per diagram** — beyond this, use `subgraph` to group related nodes, or split into multiple diagrams.
4. **Use `subgraph` for grouping**:
   ```
   subgraph "Group Label"
     A --> B
   end
   ```
5. **Arrow semantics**:
   - `-->` solid line (default relationship)
   - `-.->` dashed line (optional/async relationship)
   - `==>` thick line (critical path)
   - `--x` cross end (rejected or blocked path — use in flowcharts)
   - `-- label -->` labeled edge
   - `->>` sync message (sequence diagrams only)
   - `-->>` return/async message (sequence diagrams only)
6. **Escape pipes in labels** — if a label contains a literal `|`, use the HTML entity `#124;` (e.g., `A[Column #124; Row]`). Unescaped pipes delimit edge labels in flowcharts and will cause parse errors.
7. **Never mix diagram syntax** — each diagram type has its own syntax. `-->` works in flowcharts but not in sequence diagrams (`->>` instead). `:::className` works in flowcharts but not in ER diagrams. Never mix flowchart and sequence syntax in the same Mermaid block.

### CSS Overrides for Mermaid SVG

Apply after Mermaid renders to enforce your font system:

```css
/* Increase node label font size */
.mermaid .nodeLabel {
  font-family: var(--font-body) !important;
  font-size: 16px !important;
}

/* Edge labels use mono font */
.mermaid .edgeLabel {
  font-family: var(--font-mono) !important;
  font-size: 13px !important;
}

/* Consistent stroke weights */
.mermaid .node rect,
.mermaid .node circle,
.mermaid .node polygon {
  stroke-width: 1.5px !important;
}

.mermaid .edge-pattern-solid {
  stroke-width: 1.5px !important;
}

/* Edge label rectangle background — prevent bleed-through */
.edgePath .edgeLabel rect {
  fill: var(--ve-surface);
  stroke: var(--ve-border);
}
```

**Sequence diagram CSS overrides:**
```css
/* Sequence diagram actor boxes */
.sequenceDiagram .actor {
  stroke-width: 1.5px;
  fill: var(--ve-surface);
  stroke: var(--ve-border);
}

/* Sequence diagram message lines */
.sequenceDiagram .messageLine0,
.sequenceDiagram .messageLine1 {
  stroke-width: 1.5px;
  stroke: var(--ve-text-dim);
}

/* Sequence diagram note text */
.sequenceDiagram .noteText {
  font-family: var(--font-mono) !important;
  font-size: 12px !important;
  fill: var(--ve-text) !important;
}
```

**ER diagram CSS overrides:**
```css
/* ER diagram entity boxes */
.erDiagram .er.entityBox {
  stroke-width: 1.5px;
  fill: var(--ve-surface);
  stroke: var(--ve-border);
}

/* ER diagram alternating attribute rows */
.erDiagram .er.attributeBoxEven {
  fill: var(--ve-bg);
}
```

**Mind map CSS overrides:**
```css
/* Mind map node rectangles */
.mindmap-node rect {
  stroke-width: 1.5px;
  fill: var(--ve-surface);
  stroke: var(--ve-border);
}

/* Mind map edges */
.mindmap-edge {
  stroke: var(--ve-text-dim);
  stroke-width: 1.5px;
}
```

### Zoom Controls (Complete Implementation)

Every `.mermaid-wrap` must include zoom controls. Copy this pattern in full:

```html
<div class="mermaid-wrap animate" style="--i:3">
  <div class="zoom-controls">
    <button onclick="zoomDiagram(this, 1.2)" title="Zoom in">+</button>
    <button onclick="zoomDiagram(this, 0.8)" title="Zoom out">&minus;</button>
    <button onclick="resetZoom(this)" title="Reset zoom">&#8634;</button>
  </div>
  <pre class="mermaid">
    graph TD
      A --> B
  </pre>
</div>
```

```css
.mermaid-wrap {
  position: relative;
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
  border-radius: 12px;
  padding: 32px 24px;
  overflow: auto;
}

.mermaid-wrap .mermaid {
  display: flex;
  justify-content: center;
  transition: transform 0.2s ease;
  transform-origin: top center;
}

.zoom-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 2px;
  z-index: 10;
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
  border-radius: 6px;
  padding: 2px;
}

.zoom-controls button {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--ve-text-dim);
  font-family: var(--font-mono);
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.zoom-controls button:hover {
  background: var(--ve-border);
  color: var(--ve-text);
}

.mermaid-wrap.is-zoomed { cursor: grab; }
.mermaid-wrap.is-panning { cursor: grabbing; user-select: none; }
```

```javascript
// Zoom and pan functions — include once per page
function updateZoomState(wrap) {
  var target = wrap.querySelector('.mermaid');
  var zoom = parseFloat(target.dataset.zoom || '1');
  wrap.classList.toggle('is-zoomed', zoom > 1);
}

function zoomDiagram(btn, factor) {
  var wrap = btn.closest('.mermaid-wrap');
  var target = wrap.querySelector('.mermaid');
  var current = parseFloat(target.dataset.zoom || '1');
  var next = Math.min(Math.max(current * factor, 0.3), 5);
  target.dataset.zoom = next;
  target.style.transform = 'scale(' + next + ')';
  updateZoomState(wrap);
}

function resetZoom(btn) {
  var wrap = btn.closest('.mermaid-wrap');
  var target = wrap.querySelector('.mermaid');
  target.dataset.zoom = '1';
  target.style.transform = 'scale(1)';
  updateZoomState(wrap);
}

// Attach scroll-to-zoom and drag-to-pan to all mermaid wraps
document.querySelectorAll('.mermaid-wrap').forEach(function(wrap) {
  // Ctrl/Cmd + scroll to zoom
  wrap.addEventListener('wheel', function(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    var target = wrap.querySelector('.mermaid');
    var current = parseFloat(target.dataset.zoom || '1');
    var factor = e.deltaY < 0 ? 1.1 : 0.9;
    var next = Math.min(Math.max(current * factor, 0.3), 5);
    target.dataset.zoom = next;
    target.style.transform = 'scale(' + next + ')';
    updateZoomState(wrap);
  }, { passive: false });

  // Drag to pan when zoomed in
  var startX, startY, scrollL, scrollT;
  wrap.addEventListener('mousedown', function(e) {
    if (e.target.closest('.zoom-controls')) return;
    var target = wrap.querySelector('.mermaid');
    if (parseFloat(target.dataset.zoom || '1') <= 1) return;
    wrap.classList.add('is-panning');
    startX = e.clientX;
    startY = e.clientY;
    scrollL = wrap.scrollLeft;
    scrollT = wrap.scrollTop;
  });
  window.addEventListener('mousemove', function(e) {
    if (!wrap.classList.contains('is-panning')) return;
    wrap.scrollLeft = scrollL - (e.clientX - startX);
    wrap.scrollTop = scrollT - (e.clientY - startY);
  });
  window.addEventListener('mouseup', function() {
    wrap.classList.remove('is-panning');
  });
});
```

### Dark Mode Behavior

Mermaid SVG internals are computed at render time. If the system color scheme changes after render, re-render Mermaid for best fidelity.

Recommended pattern:
1. Render once on page load with current `prefers-color-scheme` value.
2. Listen for `matchMedia('(prefers-color-scheme: dark)')` changes.
3. Re-run Mermaid initialization/render on theme change.

Avoid dual-rendering light/dark duplicates unless re-rendering is not possible.

---

## Chart.js 4.5.1

### CDN Import

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
```

> **Version pinning:** Use the exact pinned version from `assets/library_versions.json`.

### Base Chart Setup

Always detect dark mode and apply matching colors:

```javascript
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const textColor = isDark ? '#e5e5e5' : '#1c1917';
const dimColor  = isDark ? '#a3a3a3' : '#78716c';
const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
const fontBody  = getComputedStyle(document.documentElement)
                    .getPropertyValue('--font-body').trim();
const fontMono  = getComputedStyle(document.documentElement)
                    .getPropertyValue('--font-mono').trim();

const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',  // 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'scatter'
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Dataset',
      data: [12, 19, 8],
      backgroundColor: 'rgba(139, 92, 246, 0.6)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    parsing: false,
    normalized: true,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { family: fontBody, size: 13 }
        }
      },
      tooltip: {
        titleFont: { family: fontMono },
        bodyFont:  { family: fontBody },
      }
    },
    scales: {
      x: {
        ticks: { color: dimColor, font: { family: fontMono, size: 11 } },
        grid:  { color: gridColor }
      },
      y: {
        ticks: { color: dimColor, font: { family: fontMono, size: 11 } },
        grid:  { color: gridColor }
      }
    }
  }
});
```

### Chart Accessibility Expectations

- Wrap chart canvases in `<figure>` with a `<figcaption>` summary.
- Do not rely on color-only signals in legends and labels.
- Provide textual fallback for critical numbers (KPI row, summary list, or table).

### Performance Defaults for Large Datasets

- `parsing: false`
- `normalized: true`
- Enable decimation for high point counts.
- Avoid costly shadows/gradients across large datasets.

### Chart Container Sizing

Always wrap the `<canvas>` to control max height:

```html
<div class="chart-container">
  <canvas id="myChart"></canvas>
</div>
```

```css
.chart-container {
  position: relative;
  max-height: 300px;
  width: 100%;
}
```

### Common Chart Types Reference

```javascript
// Line chart with fill
type: 'line'
datasets: [{ fill: true, tension: 0.4, pointRadius: 3 }]

// Horizontal bar
type: 'bar'
options: { indexAxis: 'y' }

// Doughnut with center label
type: 'doughnut'
// Center label requires a custom plugin

// Scatter plot
type: 'scatter'
datasets: [{ data: [{x: 1, y: 2}, {x: 3, y: 4}] }]
```

---

## anime.js 4.3.6 (Optional)

### CDN Import

```html
<script src="https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.min.js"></script>
```

Use anime.js only for advanced interaction effects. Default motion in this skill remains CSS-first.

### Initial State — Set Before anime() Runs

**Always** set `opacity: 0` on animated target elements in CSS before calling `anime()`. Without this, elements flash at full opacity briefly before the animation starts (FOUC — Flash of Unstyled Content):

```css
/* Set initial state in CSS — prevents flash before animation */
.animate {
  opacity: 0;
}

/* Reduced-motion override — show immediately without animation */
@media (prefers-reduced-motion: reduce) {
  .animate {
    opacity: 1 !important;
  }
}
```

Then in JavaScript, animate from 0 to 1:

```javascript
anime({
  targets: '.animate',
  opacity: [0, 1],  // from initial state (0) to final state (1)
  translateY: [20, 0],
  /* ... */
});
```

### Staggered Fade-In

The most common use: animate a list of elements in sequence.

```javascript
// Check reduced motion before running any animation
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  anime({
    targets: '.animate',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(60),    // 60ms between each element
    easing: 'easeOutCubic',
    duration: 600,
  });
}
```

### SVG Path Drawing (Signature Effect)

```javascript
if (!prefersReduced) {
  anime({
    targets: '.draw-path path, .draw-path line',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: anime.stagger(200),
  });
}
```

```css
/* Prepare SVG for drawing animation */
.draw-path path,
.draw-path line {
  fill: none;  /* paths must have no fill for dashoffset to work */
}
```

### Count-Up Numbers

```javascript
document.querySelectorAll('[data-count]').forEach(el => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.innerHTML = el.dataset.count;
    return;
  }
  anime({
    targets: el,
    innerHTML: [0, parseInt(el.dataset.count)],
    round: 1,           // round to nearest integer
    duration: 1200,
    easing: 'easeOutExpo',
  });
});
```

```html
<!-- Usage: data-count holds the target number -->
<span data-count="93">0</span>
```

### Stagger Grid Animation

```javascript
if (!prefersReduced) {
  anime({
    targets: '.grid-item',
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(40, { grid: [3, 4], from: 'center' }),
    easing: 'easeOutElastic(1, .8)',
    duration: 800,
  });
}
```

### Reduced Motion — Always Wrap

```javascript
// Pattern: check once at top, gate all animations
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function runAnimations() {
  if (prefersReduced) return;
  // ... all anime.js calls here
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAnimations);
} else {
  runAnimations();
}
```

---

## Google Fonts — 13 Pairings

### Loading Pattern

Always use `display=swap` and preconnect:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Fragment+Mono&display=swap" rel="stylesheet">
```

Then define as CSS variables:

```css
:root {
  --font-body: 'Bricolage Grotesque', system-ui, sans-serif;
  --font-mono: 'Fragment Mono', 'SF Mono', Consolas, monospace;
}
```

### Complete Pairings Table

> **Single source of truth.** The summary table in `references/quick_reference.md` mirrors this table. Update here first, then update the quick reference.

| # | Body Font | Mono Font | Feel | Google Fonts URL param |
|---|-----------|-----------|------|------------------------|
| 1 | Bricolage Grotesque | Fragment Mono | Technical, modern | `Bricolage+Grotesque:opsz,wght@12..96,400..700&Fragment+Mono` |
| 2 | Instrument Serif | JetBrains Mono | Editorial, refined | `Instrument+Serif&JetBrains+Mono:wght@400;500;600` |
| 3 | IBM Plex Sans | IBM Plex Mono | Corporate, systematic | `IBM+Plex+Sans:wght@400;500;600;700&IBM+Plex+Mono:wght@400;500;600` |
| 4 | Space Grotesk | Space Mono | Geometric, futuristic | `Space+Grotesk:wght@400;500;600;700&Space+Mono:wght@400;700` |
| 5 | Sora | Fira Code | Clean, developer-friendly | `Sora:wght@400;500;600;700&Fira+Code:wght@400;500` |
| 6 | DM Sans | DM Mono | Neutral, versatile | `DM+Sans:opsz,wght@9..40,400..700&DM+Mono:wght@400;500` |
| 7 | Plus Jakarta Sans | Source Code Pro | Contemporary, balanced | `Plus+Jakarta+Sans:wght@400;500;600;700&Source+Code+Pro:wght@400;500` |
| 8 | Archivo | Roboto Mono | Bold, industrial | `Archivo:wght@400;500;600;700&Roboto+Mono:wght@400;500` |
| 9 | Outfit | Inconsolata | Rounded, approachable | `Outfit:wght@400;500;600;700&Inconsolata:wght@400;500` |
| 10 | Satoshi | Cascadia Code | Premium, modern | `Satoshi:wght@400;500;700` (use CDN) + `Cascadia+Code` |
| 11 | Work Sans | Azeret Mono | Practical, editorial | `Work+Sans:wght@400;500;600;700&Azeret+Mono:wght@400;500` |
| 12 | General Sans | Martian Mono | Distinctive, technical | (use CDN for both) |
| 13 | Manrope | Anonymous Pro | Humanist, readable | `Manrope:wght@400;500;600;700&Anonymous+Pro:wght@400;700` |

Note: Satoshi and General Sans are not on Google Fonts. Use `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap` for Satoshi.

**Never use** Inter, Roboto, Arial, or system-ui as the primary display or heading font. These are overused and generic. Use the pairings above instead.

**Additional pairings from upstream source** (available as alternatives — rotate to avoid repetition):

| Body Font | Mono Font | Feel |
|-----------|-----------|------|
| Outfit | Space Mono | Clean geometric, modern |
| Fraunces | Source Code Pro | Warm, distinctive |
| Libre Franklin | Inconsolata | Classic, reliable |
| Playfair Display | Roboto Mono | Elegant contrast |
| Geist | Geist Mono | Vercel-inspired, sharp |
| Crimson Pro | Noto Sans Mono | Scholarly, serious |
| Red Hat Display | Red Hat Mono | Cohesive family |
