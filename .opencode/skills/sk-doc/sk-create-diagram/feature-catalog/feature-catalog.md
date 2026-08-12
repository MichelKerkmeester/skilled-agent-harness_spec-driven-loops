---
title: "sk-create-diagram: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the sk-create-diagram sk-doc workflow packet."
trigger_phrases:
  - "sk-create-diagram"
  - "create diagram skill"
  - "diagram feature catalog"
  - "diagram generation import export"
  - "feature catalog"
last_updated: "2026-08-12"
version: 1.0.0.0
---

# sk-create-diagram: Feature Catalog

This document combines the current feature inventory for the `sk-create-diagram` workflow packet into a single reference. The root catalog acts as the packet-level directory: it summarizes each capability area, describes what the packet does today, and points to the per-feature files that carry the deeper implementation and validation anchors. Everything runs locally — diagram generation produces single self-contained `.html` files with inline SVG, imports redraw draw.io / Mermaid sources through the bundled Python extractors, and exports are a manual, diagram-only PNG / SVG step.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `sk-create-diagram` feature surface. The numbered sections below group the packet by capability area — diagram generation, import and export, and command/hub integration — so readers can move from a top-level summary into per-feature reference files without losing implementation or validation context.

---

## 2. DIAGRAM GENERATION

### Type selection and routing

#### Description

Classifies each request into GENERATE, IMPORT, or EXPORT, then selects one of the 27 supported diagram types and loads the matching `references/types/type-*.md` convention before drawing.

#### Current Reality

The router scores request vocabulary (`diagram`, `architecture`, `sequence`, `drawio`, `mermaid`, `export`, `png`) with an ambiguity delta of 1, guards every resource path, and loads `references/foundations/style-guide.md` always plus the conditional type/import/export references; the 27-type selection guide maps components-and-connections to Architecture, decision logic to Flowchart, time-ordered messages to Sequence, and so on.

#### Source Files

See [`diagram-generation/type-selection-and-routing.md`](diagram-generation/type-selection-and-routing.md) for full implementation and test file listings.

---

### Editorial style and connectors

#### Description

The shared editorial design system every diagram draws against: semantic color and typography tokens, the 4px grid, the complexity budget, and the five non-negotiable connector rules.

#### Current Reality

Tokens live in `references/foundations/style-guide.md` (paper, ink, muted, accent, link) with a light-dark inversion rule and a separate terminal skin; every coordinate, size, and gap must be divisible by 4; the per-diagram budget is 9 nodes, 12 arrows, 2 focal elements, and 2 callouts; connectors must use rounded orthogonal elbows, masked arrow labels with a 6-10px gap, fanned attach points, and no overlapping strokes.

#### Source Files

See [`diagram-generation/editorial-style-and-connectors.md`](diagram-generation/editorial-style-and-connectors.md) for full implementation and test file listings.

---

### Onboarding flow

#### Description

The style-guide gate before the first diagram in a project, plus agent-mediated skin extraction from a website URL, an installed skill, or a local folder that rewrites `style-guide.md`.

#### Current Reality

The gate fires only when the `accent` token is still the shipped default and offers five options (URL, skill, folder, manual tokens, default); onboarding reads the source, extracts colors and fonts, maps them to semantic roles, runs contrast checks, proposes a diff, and writes only after approval; `references/foundations/onboarding.md` documents the full flow.

#### Source Files

See [`diagram-generation/onboarding-flow.md`](diagram-generation/onboarding-flow.md) for full implementation and test file listings.

---

### Primitive variants

#### Description

Four on-demand primitives loaded only on explicit request: annotation callouts, the sketchy filter, the terminal skin, and the monochrome icon library.

#### Current Reality

Annotation callouts are italic serif asides with a dashed Bézier leader and landing dot, max 2 per diagram; the sketchy filter wobbles shapes but never text; the terminal skin is a fixed monospace one-accent register with macOS-style titlebar dots and a `$` prompt; icons are monochrome 24×24 `currentColor` glyphs with license attribution, browsable in `assets/icons.html`.

#### Source Files

See [`diagram-generation/primitive-variants.md`](diagram-generation/primitive-variants.md) for full implementation and test file listings.

---

## 3. IMPORT AND EXPORT

### draw.io import

#### Description

Redraws a `.drawio` source (raw XML, deflate+base64, or PNG/SVG-embedded mxfile) into an editorial diagram via the `drawio_extract.py` intermediate representation, at a chosen format, size, detail level, and audience.

#### Current Reality

The extractor never reads the source as a document — it decodes it into a digest of nodes, edges, hubs, containers, cycle detection, and budget flags; the agent sets the four dials, picks a target type, redraws from scratch (discarding source coordinates, colors, and shape quirks), and reports a fidelity ledger; `faithful` is the one documented complexity-budget exemption, zoned above 9 nodes and split into overview + detail above 24.

#### Source Files

See [`import-export/drawio-import.md`](import-export/drawio-import.md) for full implementation and test file listings.

---

### Mermaid import

#### Description

Redraws a `.mmd`, `.mermaid`, or fenced Mermaid block into an editorial diagram via the `mermaid_extract.py` intermediate representation, without copying the renderer layout or theme.

#### Current Reality

The extractor parses flowchart/graph, sequenceDiagram, stateDiagram-v2, and erDiagram with a strict trust boundary (it never evaluates, renders, fetches, or executes Mermaid content), discards init themes, classes, and click targets, and reports unsupported kinds verbatim; the redraw keeps source meaning plus the fidelity ledger and never inherits Mermaid's automatic spacing or routing.

#### Source Files

See [`import-export/mermaid-import.md`](import-export/mermaid-import.md) for full implementation and test file listings.

---

### Export guidance

#### Description

Manual, diagram-only export of a generated diagram HTML file to a portable `.svg` and/or `.png` beside it, following `references/import-export/export.md`.

#### Current Reality

Both formats deliver only the `<svg>` node; SVG preserves the prefixed accessible title/desc and merges the font `@import`; PNG renders the original HTML and screenshots the svg element's bounding box at `viewBox × device_scale_factor` with a transparent background, requiring a local Playwright install; export never runs unprompted and never modifies the source HTML.

#### Source Files

See [`import-export/export-guidance.md`](import-export/export-guidance.md) for full implementation and test file listings.

---

## 4. COMMAND AND HUB INTEGRATION

### create-diagram command

#### Description

The `/create:diagram` router — a thin router that loads a presentation contract, resolves `:auto` or `:confirm` mode, and executes the bound workflow YAML.

#### Current Reality

The router reads `create-diagram-presentation.txt`, runs Phase 0 verification and setup resolution, binds `create-diagram-auto.yaml` for `:auto` or `create-diagram-confirm.yaml` for `:confirm` (and for an omitted mode), and executes the chosen workflow step by step; user-facing wording lives only in the presentation contract and is never invented by the router.

#### Source Files

See [`command-and-hub-integration/create-diagram-command.md`](command-and-hub-integration/create-diagram-command.md) for full implementation and test file listings.

---

### Hub registration

#### Description

The packet's registration in the `sk-doc` hub: `workflowMode`, command, and aliases in `mode-registry.json`, router signals in `hub-router.json`, leaves in `leaf-manifest.json`, command metadata, and the no-packet-local-`graph-metadata.json` invariant.

#### Current Reality

`sk-create-diagram` is registered with command `/create:diagram` and 17 aliases including `drawio`, `mermaid diagram`, `redraw diagram`, and `export diagram`; `hub-router.json` routes the `create-diagram-aliases` class at weight 3 to this packet's SKILL.md; the packet root carries no packet-local advisor metadata (advisor identity lives at the `sk-doc` hub root); `validate_skill_package.py` is the packaging gate.

#### Source Files

See [`command-and-hub-integration/hub-registration.md`](command-and-hub-integration/hub-registration.md) for full implementation and test file listings.
