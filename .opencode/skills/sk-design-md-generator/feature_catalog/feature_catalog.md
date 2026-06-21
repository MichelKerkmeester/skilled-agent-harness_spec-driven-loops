---
title: "sk-design-md-generator: Feature Catalog"
description: "Unified capability inventory for the sk-design-md-generator skill, covering extraction, clustering, DESIGN.md writing, validation, reporting, and per-feature detection across a three-phase pipeline."
trigger_phrases:
  - "design system extraction"
  - "DESIGN.md generation"
  - "tokens.json output"
  - "extract design tokens from url"
  - "anti-hallucination design reference"
  - "design md feature catalog"
last_updated: "2026-06-21"
---

# sk-design-md-generator: Feature Catalog

This document is the canonical capability inventory for the `sk-design-md-generator` skill. The root catalog acts as the system-level directory: it summarizes each capability area, names the canonical scripts for each phase, and keeps the extraction-to-publication contract visible at a glance. The skill captures a live website's real, measured CSS into a 17-section `DESIGN.md` design-system reference that AI agents build against without hallucinating. A three-phase pipeline runs through an embedded Playwright crawler (EXTRACT), a fidelity-checked markdown writer (WRITE), and a hex-and-section validator (VALIDATE), with an optional REPORT phase for visual artifacts.

The skill is the **extraction and format-fidelity engine** of the `sk-design-*` family. It captures what already exists. Sibling `sk-design-interface` invents new distinctive direction; this skill produces the authoritative ground-truth reference those transports and skills consume.

---

## 1. OVERVIEW

Use this catalog as the inventory for the live `sk-design-md-generator` surface. The numbered sections below group the skill by capability area so readers can move from a top-level summary into the per-feature detail without losing the pipeline context.

The capability surface has one hard prerequisite and four phases. Everything depends on a **tool installation**: `cd tool && npm install && npx playwright install chromium`. From there the **extract** phase crawls a live URL across five viewports and emits verbatim `tokens.json`. The **cluster** phase classifies every token L1 through L4 for stability gating. The **write** phase produces the 17-section `DESIGN.md` with every value copied verbatim from `tokens.json`. The **validate** phase checks hex accuracy and section completeness. An optional **report** phase renders visual HTML previews and proof artifacts. The **feature-extractors** area covers six per-feature detectors that run during extraction, and the **interaction-capture** area records component states (`--with-interaction`) for the State Matrix.

### Capability areas

| Capability area | What it does | Per-feature file |
|---|---|---|
| Extract | Crawls a live URL across 5 viewports, collects computed CSS, emits tokens.json | `01--extract/extract.md` |
| Cluster and classify | OKLCH color clustering and L1-L4 stability classification on extracted tokens | `02--cluster-classify/cluster-classify.md` |
| Write DESIGN.md | Composes the 17-section DESIGN.md, copying every value verbatim from tokens.json | `03--write-design-md/write-design-md.md` |
| Validate | Checks hex accuracy against tokens.json and v2 core-section completeness | `04--validate/validate.md` |
| Report and preview | Generates HTML report, visual preview, and proof artifacts | `05--report-preview/report-preview.md` |
| Feature extractors | Per-feature detection: accessibility, dark mode, framework, icons, motion, design boundary | `06--feature-extractors/feature-extractors.md` |
| Interaction capture | Records hover/focus/active/disabled component states (`--with-interaction`), producing the §11 State Matrix | `07--interaction-capture/interaction-capture.md` |

---

## 2. EXTRACT

#### Description

Crawls a live URL across five viewports with Playwright, collects computed CSS values, runs per-feature detectors, and writes `tokens.json` — the entry point everything downstream depends on.

#### Current Reality

- Five viewports from mobile (375px) through wide desktop (1440px).
- Computed color, typography, shadow, radius, spacing, and CSS variable collection.
- Dark-mode palette detection via `prefers-color-scheme` media query and class/attribute toggles.
- Per-feature detectors run inline during extraction (accessibility, framework, icons, motion).
- Output written to `output/<domain>/tokens.json`.
- The `--fast` flag controls crawl depth; `--with-interaction` captures hover, focus, and active state styles.
- If Playwright cannot reach the URL or the page emits no measurable CSS, the extractor exits with an error.

#### Source Files

See [`01--extract/extract.md`](01--extract/extract.md) for the crawl model, extraction flags, and the tokens.json schema.

---

## 3. CLUSTER AND CLASSIFY

#### Description

Transforms raw color data from `tokens.json` into stability-classified tokens via OKLCH color-space clustering and L1-L4 classification, gating which tokens enter DESIGN.md.

#### Current Reality

- OKLCH color space clustering groups visually similar colors into named roles following the taxonomy in `tool/resources/color-role-taxonomy.md`.
- L1 (permanent, brand-level) and L2 (system, component-level) tokens populate the main DESIGN.md sections.
- L3 (campaign, temporary) tokens enter with a "Subject to change" annotation.
- L4 (content, one-off, image-derived) tokens are excluded entirely.
- Boundary tokens are assigned the higher (more restrictive) class.
- The classification is deterministic; token gating drives the write phase.
- Incremental extraction: `mergeTokenSets` (exported from `cluster.ts`) merges a prior `tokens.json` with a fresh run when extraction is invoked with `--merge-with`, deduplicating and re-clustering the combined set.

#### Source Files

See [`02--cluster-classify/cluster-classify.md`](02--cluster-classify/cluster-classify.md) for the OKLCH clustering algorithm, the stability-classification heuristic, and the boundary-disambiguation rule.

---

## 4. WRITE DESIGN.MD

#### Description

Produces the 17-section `DESIGN.md` from `tokens.json` under the cardinal fidelity rule — every hex, pixel, font-weight, shadow, radius, and spacing value copied verbatim, with no estimation, rounding, or invention.

#### Current Reality

- Hex codes in 6-digit lowercase only (`#1a1a2e`, never `#1A1A2E`, `#333`, `rgb()`, or `hsl()`).
- L1 and L2 tokens populate the main 17 sections. L3 tokens appear only in a "Subject to change" block. L4 tokens absent.
- Dark-mode section appears only when `tokens.json` contains a detected dark palette with populated variable diffs.
- Accessibility section drawn from a11y data in `tokens.json`.
- The write-phase prompt template (`assets/design_md_prompt_template.md`) and cardinal rules card (`assets/cardinal_rules_card.md`) front-load the fidelity contract.
- The writer loads the v2 section spec from `tool/resources/design-md-format.md` and voice rules from `tool/resources/writing-style-guide.md` before composing.

#### Source Files

See [`03--write-design-md/write-design-md.md`](03--write-design-md/write-design-md.md) for the cardinal fidelity rule, the 17-section contract, and the write-phase prompt template.

---

## 5. VALIDATE

#### Description

Confirms every hex in DESIGN.md traces to `tokens.json`, all v2 core sections are present and non-empty, and no format violations exist — the gating step before any completion claim.

#### Current Reality

- Hex-accuracy check cross-references every hex in DESIGN.md against `tokens.colorTokens[].hex` and `tokens.cssVariables[].value`.
- Section-completeness check confirms all 14 core sections, section 6.5 (Motion System), and sections 11 (State Matrix) and 12 (Iconography) are present.
- Hex casing check flags uppercase hex, 3-digit shortcuts, `rgb()`, and `hsl()` as format violations.
- Phantom-color detection flags hex values in DESIGN.md with no token source.
- Score output with per-finding messages and a pass/fail verdict.
- Four escalation conditions require human judgment rather than automated correction.

#### Source Files

See [`04--validate/validate.md`](04--validate/validate.md) for the validation rules, the score model, and the escalation triggers.

---

## 6. REPORT AND PREVIEW

#### Description

Optional post-validation phase that renders visual artifacts — HTML report, CSS visual preview, and fidelity proof — from a DESIGN.md + tokens.json pair for human review and team handoff.

#### Current Reality

- `report-gen.ts` produces an HTML report with token-to-section provenance and occurrence counts.
- `preview-gen.ts` renders a visual CSS preview of the design system colors, type, shadows, and spacing.
- `proof.ts` takes a URL and tokens.json and produces a fidelity proof artifact comparing live extraction against the token set.
- All three scripts write to a user-specified output directory as standalone browser-viewable files.

#### Source Files

See [`05--report-preview/report-preview.md`](05--report-preview/report-preview.md) for the report schema, preview rendering, and proof artifact format.

---

## 7. FEATURE EXTRACTORS

#### Description

Six per-feature detectors that run inline during extraction, each targeting a specific design-system dimension — accessibility, dark mode, framework, icons, motion, and design boundary — enriching `tokens.json` with structured metadata.

#### Current Reality

- **Accessibility** (`a11y-extract.ts`): captures contrast ratios, focus indicator styles, touch-target sizes, ARIA patterns.
- **Dark mode** (`dark-mode-detect.ts`): detects `prefers-color-scheme` media queries, class/attribute dark toggles, and records variable diffs between light and dark.
- **Framework** (`framework-detect.ts`): identifies CSS framework markers (Tailwind, Bootstrap, custom CSS variables).
- **Icons** (`icon-detect.ts`): detects icon library signatures (Heroicons, Lucide, Font Awesome, custom SVG), stroke weights, and grid sizes.
- **Motion** (`motion-extract.ts`): captures transition durations, easing functions, and enter/exit choreography.
- **Design boundary** (`design-boundary-detect.ts`): distinguishes design-system tokens from content-level values to aid L3/L4 boundary classification.
- Every detector that finds no data records the absence rather than inventing values.

#### Source Files

See [`06--feature-extractors/feature-extractors.md`](06--feature-extractors/feature-extractors.md) for each detector's extraction method, the token-schema fields it populates, and the absence-reporting rule.

---

## 8. INTERACTION CAPTURE

#### Description

Captures hover, focus, active, and disabled component states when extraction runs with `--with-interaction`, producing the data for the required v2 DESIGN.md section 11 (State Matrix).

#### Current Reality

- Gated by the `--with-interaction` flag; default extraction skips interaction capture.
- `captureInteractions()` drives a real page, triggering hover, focus, active, and disabled states and recording the resulting computed styles per component.
- The captured state data populates DESIGN.md section 11 (State Matrix), which `validate.ts` checks as a required section.
- State tokens are classified L3 (interaction states are component-specific) and feed the accessibility focus-indicator data.
- A component with no distinct state styling records the absence rather than inventing a state.

#### Source Files

See [`07--interaction-capture/interaction-capture.md`](07--interaction-capture/interaction-capture.md) for the interaction-capture method, the state-matrix schema, and the `--with-interaction` flag contract.
