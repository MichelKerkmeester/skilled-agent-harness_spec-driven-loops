---
title: "scripts/: Design Extraction Pipeline Modules"
description: "The extract, cluster, write-prompt, validate, and report pipeline that turns a live URL into tokens.json and a v3 DESIGN.md."
trigger_phrases:
  - "design extraction pipeline scripts"
  - "tokens.json pipeline modules"
  - "design-md generator backend scripts"
  - "extract cluster validate pipeline"
---

# scripts/: Design Extraction Pipeline Modules

---

## 1. OVERVIEW

`scripts/` owns the extract, cluster and classify, write-prompt, then validate pipeline that turns a live URL into `tokens.json` and a v3 Style Reference `DESIGN.md`. The feature extractors and the `crawl.ts`, `dom-collector.ts`, `css-analyzer.ts` stages feed `extract.ts`, which writes `tokens.json`. `build-write-prompt.ts` pre-renders the deterministic value sections from those tokens, the AI writes the prose, and `validate.ts` checks the result against the same tokens. An optional `report-gen.ts`, `preview-gen.ts`, `proof.ts` branch emits visual and fidelity artifacts.

Current state:

- The value-bearing sections (Tokens Colors, Tokens Spacing and Shapes, Surfaces, Quick Start) are rendered deterministically by `formatters-v3.ts`, so the AI never emits a value.
- `cluster.ts` runs OKLCH color clustering with L1 to L4 stability classification, and L4 tokens are excluded from the rendered value surface.
- These modules are driven by the parent skill through `ts-node` or the `npm` scripts, not used standalone.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            scripts/                              │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────────┐
│ Feature extractors   │
│ a11y / dark-mode /   │
│ framework / icon /   │
│ motion / boundary /  │
│ interaction          │
└──────────┬───────────┘
           │
crawl.ts ─▶ dom-collector.ts ─▶ css-analyzer.ts
           │
           ▼
┌──────────────────────┐      ┌──────────────────────┐
│ extract.ts           │ ───▶ │ cluster.ts           │
│ orchestrator         │      │ OKLCH + L1-L4        │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           ▼                             ▼
                  ┌──────────────────────┐
                  │ tokens.json          │
                  └──────────┬───────────┘
                             │
                             ▼
┌──────────────────────┐      ┌──────────────────────┐
│ build-write-prompt.ts│ ───▶ │ formatters-v3.ts     │
│ pre-render + FACTS   │      │ deterministic v3     │
└──────────┬───────────┘      └──────────────────────┘
           │
           ▼
┌──────────────────────┐      ┌──────────────────────┐
│ AI writes DESIGN.md  │ ───▶ │ validate.ts          │
│ prose only           │      │ fidelity + scores    │
└──────────────────────┘      └──────────────────────┘

Optional branch from tokens.json:
report-gen.ts (HTML report) / preview-gen.ts (visual preview) / proof.ts (fidelity proof)
```

---

## 3. DIRECTORY TREE

```text
scripts/
+-- cli.ts                     # CLI entry, quick extraction mode wrapper over extract.ts
+-- extract.ts                 # Phase 1 orchestrator, dispatch flags, phase sequencing
+-- crawl.ts                   # Playwright crawl engine, viewport sampling, page spidering
+-- dom-collector.ts           # DOM walker, element selection, computed-style readout
+-- css-analyzer.ts            # Computed CSS parsing, value extraction, token assignment
+-- cluster.ts                 # OKLCH clustering, role assignment, L1-L4 stability heuristic
+-- a11y-extract.ts            # Contrast ratios, focus indicators, touch targets, ARIA
+-- dark-mode-detect.ts        # Media-query probe, toggle detection, variable-diff recorder
+-- framework-detect.ts        # CSS framework class scan, custom-variable analysis
+-- icon-detect.ts             # SVG inspection, library-signature match, stroke and grid capture
+-- motion-extract.ts          # Transition and animation reading, easing, reduced-motion check
+-- design-boundary-detect.ts  # System-vs-content token classification, cross-page frequency
+-- interaction-capture.ts     # State simulation, style-diff, loading/empty/error detection
+-- build-write-prompt.ts      # Phase 2 pre-render of v3 value sections plus FACTS block
+-- formatters-v3.ts           # Deterministic v3 emitters, hue and lightness colour namer
+-- validate.ts                # Phase 3 v3 fidelity, completeness, dual-score engine
+-- report-gen.ts              # Phase 4 token-to-section HTML report generator
+-- preview-gen.ts             # Phase 4 visual CSS preview renderer
+-- proof.ts                   # Phase 4 fidelity proof artifact generator
+-- types.ts                   # Shared token types, L1-L4 enum, interface contracts
`-- css-tree.d.ts              # css-tree module type declarations
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `extract.ts` | Phase 1 extraction orchestrator. Sequences crawl, DOM collect, CSS analysis, the feature extractors, and clustering, then writes `tokens.json`. |
| `cli.ts` | CLI entry point. Quick extraction mode that runs Phase 1 and outputs `tokens.json`. |
| `crawl.ts` | Playwright crawl engine. Samples viewports and spiders pages across the site. |
| `dom-collector.ts` | DOM style collector. Walks the DOM tree, selects elements, and reads computed styles. |
| `css-analyzer.ts` | Parses computed CSS, extracts values, and assigns tokens using `css-tree`. |
| `cluster.ts` | OKLCH color clustering engine. Assigns roles and applies the L1 to L4 stability heuristic. |
| `a11y-extract.ts` | Computes contrast ratios, captures focus indicators, measures touch targets, and detects ARIA. |
| `dark-mode-detect.ts` | Probes media queries, detects class and attribute toggles, and records variable diffs. |
| `framework-detect.ts` | Scans CSS framework classes and analyzes custom variables. |
| `icon-detect.ts` | Inspects SVGs, matches library signatures, and captures stroke weight and grid size. |
| `motion-extract.ts` | Reads transitions and animations, captures easing, detects choreography, and checks reduced motion. |
| `design-boundary-detect.ts` | Classifies system tokens versus content tokens using cross-page frequency analysis. |
| `interaction-capture.ts` | Discovers interactive elements, simulates per-element states, computes style diffs, and detects loading, empty, and error states. |
| `build-write-prompt.ts` | Phase 2 WRITE-phase prompt builder. Pre-renders the v3 value sections, assembles the FACTS block, and emits the prose-only prompt. |
| `formatters-v3.ts` | Deterministic v3 emitters for Colors, Spacing and Shapes, Surfaces, and Quick Start, plus the hue and lightness colour namer. |
| `validate.ts` | Phase 3 `DESIGN.md` validator. Checks hex accuracy, v3 section completeness, Quick Start fidelity, and runs the dual-score engine. |
| `report-gen.ts` | Phase 4 token-to-section HTML report generator. |
| `preview-gen.ts` | Phase 4 visual CSS preview renderer. |
| `proof.ts` | Phase 4 fidelity proof artifact generator. |
| `types.ts` | Shared type definitions, L1 to L4 classification enum, and the interface contracts every module imports. |
| `css-tree.d.ts` | Type declarations for the `css-tree` module used by `css-analyzer.ts`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Modules import only from within `scripts/`, mostly the shared `types.ts`. The feature extractors and stage modules import from `extract.ts` downward, never from the report or validate branch. |
| Exports | Each stage exports its function for `extract.ts` to call. `validate.ts` exports `validateDesignMd` and `ValidationResult`, which `report-gen.ts` imports. |
| Ownership | `scripts/` owns pipeline modules and the shared `types.ts`. Tests live in `../tests/` and import from here. The build emits `scripts/` to `dist/` and excludes tests. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ live URL                                 │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ extract.ts (crawl, collect, analyze,     │
│ feature extractors, cluster)             │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ tokens.json                              │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ build-write-prompt.ts (formatters-v3.ts) │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ AI writes DESIGN.md prose                │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ validate.ts checks DESIGN.md vs tokens   │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `types.ts` | Module | Open this first. It holds the token types, the L1 to L4 enum, and every interface contract the pipeline shares. |
| `extract.ts` | CLI | Phase 1 crawl and extract. Writes `tokens.json`. |
| `cli.ts` | CLI | Quick extraction wrapper over `extract.ts`. Bin entry `design-system-extractor`. |
| `build-write-prompt.ts` | CLI | Phase 2 pre-render of the v3 value sections plus the FACTS block. |
| `validate.ts` | CLI | Phase 3 fidelity check against `tokens.json`. |
| `report-gen.ts` | CLI | Phase 4 HTML report. |
| `preview-gen.ts` | CLI | Phase 4 visual preview. |
| `proof.ts` | CLI | Phase 4 fidelity proof. |

---

## 7. VALIDATION

Run from `backend/`.

```bash
npm run typecheck
npm run build
npm test
```

Expected result: `typecheck` reports no errors, `build` emits `scripts/` to `dist/`, and `vitest` reports all tests passing.

---

## 8. RELATED

- [`backend/README.md`](../README.md)
- [`backend/tests/README.md`](../tests/README.md)
- [`SKILL.md`](../../SKILL.md)
