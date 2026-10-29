---
title: "Create Diagram Router"
description: "Sibling router for sk-design-diagram: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-design-diagram router"
  - "sk-design-diagram routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Diagram Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name a diagram whose structure a reader follows rather than values to compare: an architecture, sequence, ER, swimlane, quadrant, timeline, Gantt or org-chart picture; a `.drawio`, `.mmd` or fenced-Mermaid source to redraw; an export of a finished diagram to PNG or SVG; or a plain-text flowchart in `ascii-markdown` rather than the default `html-svg`. The router selects from four resource families: the always-loaded `references/foundations/style-guide.md` with the onboarding, output-spec and derivation references beside it, the per-type and import/export references under `references/types/` and `references/import-export/`, the `references/ascii-format/pattern-selection.md` reference with one matching `assets/ascii-patterns/` asset, and the copyable forms, primitives and icon gallery under `assets/` and `references/primitives/`. An ambiguous format returns `UNKNOWN_FALLBACK` rather than a guess.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

Five intents, one per detection signal the machine router scores. Each names the phrasing that fires it and the files it loads; `references/foundations/style-guide.md` loads ahead of every one of them.

- **`GENERATE`** fires on "diagram / architecture / sequence / er model / swimlane / venn" with no source file behind the request. It loads `references/foundations/style-guide.md` first, then the type reference the diagram-type table names for the request — `references/types/type-architecture.md`, `references/types/type-sequence.md` or `references/types/type-flowchart.md` among the 27 `references/types/type-*.md` references.
- **`IMPORT`** fires on a `.drawio`, `.drawio.png`, `.drawio.svg`, `.mmd`, `.mermaid` path or a fenced Mermaid block. It loads `references/import-export/import-drawio.md` or `references/import-export/import-mermaid.md`, and `references/foundations/output-spec.md` for the four dials set before drawing.
- **`EXPORT`** fires on "export / png / svg / rasterize / save as". It loads `references/import-export/export.md` and `references/foundations/output-spec.md`.
- **`ASCII_MARKDOWN`** fires on "ascii flowchart / workflow diagram / text diagram / text characters / decision tree / decision branch / approval loop diagram / parallel execution diagram / box-drawing / ascii-markdown", and resolves the `ascii-markdown` format before any type is chosen. It loads `references/ascii-format/pattern-selection.md` and one matching `assets/ascii-patterns/*.md` asset.
- **`STYLE`** fires on the customize request the resource table marks CONDITIONAL: "customize the style guide / onboard the skin / brand the diagram / theme diagram / repaint diagram". It loads `references/foundations/onboarding.md` and `references/foundations/style-guide.md`, the file every run loads anyway.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the format-resolution rule, the request-shape signals, the phase map, the resource domains, the loading-level table and the router pseudocode the SMART ROUTING summary in `SKILL.md` points at.

Resolve the output format before selecting resources. **`html-svg`** is the default for the existing Generate, Import, and Export paths. **`ascii-markdown`** is for plain-text or box-drawing flowcharts in markdown.

Then `html-svg` selects a type/import/export reference, while `ascii-markdown` selects one pattern from `references/ascii-format/pattern-selection.md` and `assets/ascii-patterns/`. `references/types/type-flowchart.md` remains the HTML/SVG flowchart TYPE reference, not the ASCII/markdown format path.

### Format Resolution

Resolve `OUTPUT_FORMAT` before selecting a type or pattern:

```bash
# ASCII/markdown: explicit format or plain-text flowchart signals
echo "$REQUEST" | grep -qiE 'ascii flowchart|workflow diagram|text diagram|text characters|decision tree|decision branch|approval loop diagram|parallel execution diagram|box.drawing|ascii-markdown' && OUTPUT_FORMAT="ascii-markdown"
# HTML/SVG remains the default for diagram, HTML, SVG, import, and export requests
[[ -z "${OUTPUT_FORMAT:-}" ]] && OUTPUT_FORMAT="html-svg"
```

Use `ascii-markdown` for explicit markdown/text or flowchart signals. If ambiguous, use `UNKNOWN_FALLBACK`, not a guess. Load the pattern-selection reference and one matching asset for `ascii-markdown`; continue to the existing type/import/export routing for `html-svg`.

### Primary Detection Signal

Detect the request shape from source extensions and intent vocabulary:

```bash
# Generate: type vocabulary + "diagram" — no file source
echo "$REQUEST" | grep -qiE 'diagram|architecture|sequence|er model|swimlane|venn' && SHAPE="GENERATE"
# Import: a source file path or extension
echo "$REQUEST" | grep -qiE '\.drawio|\.mmd|\.mermaid' && SHAPE="IMPORT"
# Export: an output format
echo "$REQUEST" | grep -qiE 'export|png|svg|rasterize|save as' && SHAPE="EXPORT"
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect request shape (generate / import / export) and diagram type
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Style-guide gate + load the type / route reference
    +- Phase 2: Draw the diagram (taste gate)
    +- Phase 3: Verify self-contained output + accessibility contract
```

### Resource Domains

```text
references/foundations/style-guide.md    # design tokens — ALWAYS
references/foundations/onboarding.md     # skin extraction — CONDITIONAL (customize request)
references/foundations/output-spec.md    # import dials + export sizing — CONDITIONAL (import/export)
references/primitives/primitive-*.md     # annotation, sketchy, terminal, icons — ON_DEMAND
references/types/type-*.md               # 27 per-type layout conventions — CONDITIONAL (generate)
references/import-export/import-*.md     # draw.io / Mermaid redraw — CONDITIONAL (import)
references/import-export/export.md       # PNG/SVG export procedure — CONDITIONAL (export)
assets/diagrams/starter-*.html          # 4 skin starters to copy — ON_DEMAND
assets/style-reference/harness-diagram/icons.html                        # icon gallery — ON_DEMAND
```

The route reference per diagram type:

| Diagram type | Reference |
|---|---|
| Architecture | `references/types/type-architecture.md` |
| IT current-state | `references/types/type-it-state.md` |
| Flowchart | `references/types/type-flowchart.md` |
| Sequence | `references/types/type-sequence.md` |
| State machine | `references/types/type-state.md` |
| ER / data model | `references/types/type-er.md` |
| Timeline | `references/types/type-timeline.md` |
| Swimlane | `references/types/type-swimlane.md` |
| Quadrant | `references/types/type-quadrant.md` |
| Radar / Spider | `references/types/type-radar.md` |
| Loop | `references/types/type-loop.md` |
| Nested | `references/types/type-nested.md` |
| Tree | `references/types/type-tree.md` |
| Org chart | `references/types/type-org-chart.md` |
| Layer stack | `references/types/type-layers.md` |
| Venn | `references/types/type-venn.md` |
| Pyramid / funnel | `references/types/type-pyramid.md` |
| Bar chart | `references/types/type-bar.md` |
| Line chart | `references/types/type-line.md` |
| Gantt | `references/types/type-gantt.md` |
| Scatter plot | `references/types/type-scatter.md` |
| High-Level | `references/types/type-high-level.md` |
| Process | `references/types/type-process.md` |
| Medallion | `references/types/type-medallion.md` |
| Data flow | `references/types/type-data-flow.md` |
| DP integration | `references/types/type-dp-integration.md` |
| DP security matrix | `references/types/type-dp-security-matrix.md` |

### Resource Loading Levels

| Level | When to Load | Resources |
|---|---|---|
| ALWAYS | Every diagram | `references/foundations/style-guide.md` |
| CONDITIONAL | Intent matches | `references/types/type-*.md`, `references/import-export/import-*.md`, `references/foundations/output-spec.md`, `references/import-export/export.md`, `references/foundations/onboarding.md` |
| ON_DEMAND | Only on explicit request | `references/primitives/primitive-*.md`, `assets/diagrams/starter-*.html`, `assets/style-reference/harness-diagram/icons.html` |

### Smart Router Pseudocode

The reference implementation of the router lives in [`references/foundations/router-pseudocode.md`](references/foundations/router-pseudocode.md): it holds `discover_markdown_resources()`, `_guard_in_skill()` and the `UNKNOWN_FALLBACK` branch, while the routing rules above are the contract and the pseudocode is one way to hold them.


The router guards paths and loads only existing resources. Format resolution precedes type/pattern selection; ambiguity returns `UNKNOWN_FALLBACK`.
