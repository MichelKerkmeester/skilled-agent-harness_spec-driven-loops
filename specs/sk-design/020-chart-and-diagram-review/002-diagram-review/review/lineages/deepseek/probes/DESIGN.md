# Harness Diagram — Style Reference
> Paper the colour of newsprint, one ink, one accent, and structure that never competes with meaning

**Theme:** light, with a dark and a terminal register

This is the language the harness draws diagrams in. A diagram is a page, not an interface: a warm
off-white ground, a single blue-slate ink, and exactly one saturated accent that marks the thing the
title is about. Structure — boundaries, rules, inactive spokes — is drawn in tones of the ink rather
than in colour, so the only saturated mark on a page is the one carrying the argument. Five muted
earth hues exist for the handful of forms that must separate overlapping entities, and they are
deliberately desaturated so that a chart of them still reads quieter than the accent. Corners are
small: a 6px card and a 2px mark, with nothing rounder than 8px except a pill. Type is a grotesque
for names, a monospace for anything technical, and a serif reserved for an annotation in the margin.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#fbfbfb` | `--color-paper` | Page ground — off-white, never pure |
| Card | `#ececec` | `--color-paper-2` | Raised panel and node fill, one step off the paper |
| Backend | `#ffffff` | `--color-backend-fill` | The one fill that reads as a service rather than a surface |
| Rule | `rgba(45,49,66,0.12)` | `--color-rule` | Hairline dividers, drawn as ink at low alpha |
| Boundary | `rgba(79,93,117,0.25)` | `--color-rule-solid` | Dashed boundary outlines, muted at quarter strength |
| Soft | `#7a8399` | `--color-soft` | Structure only: inactive spokes, dot pattern, tick marks |
| Muted | `#4f5d75` | `--color-muted` | Secondary text, sublabels and axis ticks |
| Chevron | `#3d4460` | `--color-high-level-chevron` | The banner ground on a high-level map |
| Ink | `#2d3142` | `--color-ink` | Primary text, node outlines and connectors |
| Accent | `#0a5fa8` | `--color-accent` | The one focal mark on a page |
| Accent tint | `rgba(235,108,54,0.08)` | `--color-accent-tint` | The focal node's fill behind its accent outline |
| Link | `#8a4a9c` | `--color-link` | A reference out of the diagram |
| Sage | `#7c8f6f` | `--color-series-1` | First series where several entities overlap |
| Slate blue | `#5c7899` | `--color-series-2` | Second series |
| Wheat | `#b8915a` | `--color-series-3` | Third series |
| Rust | `#9c6b50` | `--color-series-4` | Fourth series |
| Heather | `#6e6479` | `--color-series-5` | Fifth series |
| Night | `#d9d9d9` | `--color-paper (dark)` | Dark ground — the light theme's ink becomes the dark theme's paper |
| Snow | `#f5f5f5` | `--color-ink (dark)` | Primary text on the dark ground |
| Fog | `#bfc0c0` | `--color-muted (dark)` | Secondary text on the dark ground |
| Ember | `#f08a59` | `--color-accent (dark)` | The focal mark, lifted so it holds against the dark ground |
| Beacon | `#6a95d8` | `--color-link (dark)` | A reference out of the diagram, lifted for the dark ground |
| Pitch | `#0a0a0a` | `--color-page (terminal)` | Terminal page ground |
| Console | `#141414` | `--color-paper (terminal)` | Terminal panel ground |
| Bar | `#1b1b1b` | `--color-bar (terminal)` | Terminal title bar |
| Border | `#2b2b2b` | `--color-border (terminal)` | Terminal panel border |
| Phosphor | `#f5f5f5` | `--color-ink (terminal)` | Terminal primary text |
| Dim | `#9a9a9a` | `--color-muted (terminal)` | Terminal secondary text |
| Faint | `#5c5c5c` | `--color-soft (terminal)` | Terminal decoration: inactive dots and spokes, never text |
| Signal | `#ff5a36` | `--color-accent (terminal)` | The terminal focal mark |
| Signal tint | `rgba(255, 90, 54, 0.12)` | `--color-accent-tint (terminal)` | The terminal focal fill |

## Tokens — Typography

### Geist — Primary typeface for titles, node names and every label a reader reads as language. A neutral grotesque chosen so the type never competes with the accent. · `--font-sans`
- **Substitute:** Inter, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial
- **Weights:** 400, 500, 600
- **Sizes:** 8.5px, 9px, 10px, 11px, 12px, 14px, 18px
- **Line height:** 1.20–1.50
- **Role:** Primary typeface for titles, node names and labels.

### Geist Mono — Monospace for anything technical a reader compares rather than reads: eyebrows, type tags, endpoints, counts and legend keys. · `--font-mono`
- **Substitute:** ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono
- **Weights:** 400, 500, 600
- **Sizes:** 8px, 9px, 10px, 11px
- **Letter spacing:** 0.12em on an eyebrow
- **Role:** Monospace for technical content and legend keys — the technical voice.

### Instrument Serif — Reserved for a margin annotation: the one sentence that comments on the diagram rather than labelling it. · `--font-serif`
- **Substitute:** Iowan Old Style, Palatino, Georgia, serif
- **Weights:** 400
- **Sizes:** 11px, 12px, 13px
- **Role:** Annotation callouts only.

## Tokens — Spacing & Shapes

### Border Radius

| Element | Value |
|---------|-------|
| Mark | 2px |
| Chip | 3px |
| Tag | 4px |
| Node | 6px |
| Card | 8px |
| Pill | 24px |
