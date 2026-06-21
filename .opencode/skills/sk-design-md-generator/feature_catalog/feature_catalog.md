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

The capability surface has one hard prerequisite and four phases. Everything depends on a **tool installation**: `cd tool && npm install && npx playwright install chromium`. From there the **extract** phase crawls a live URL across five viewports and emits verbatim `tokens.json`. The **cluster** phase classifies every token L1 through L4 for stability gating. The **write** phase produces the 17-section `DESIGN.md` with every value copied verbatim from `tokens.json`. The **validate** phase checks hex accuracy and section completeness. An optional **report** phase renders visual HTML previews and proof artifacts. The last area covers six per-feature detectors that run during extraction.

### Capability areas

| Capability area | What it does | Per-feature file |
|---|---|---|
| Extract | Crawls a live URL across 5 viewports, collects computed CSS, emits tokens.json | `01--extract/extract.md` |
| Cluster and classify | OKLCH color clustering and L1-L4 stability classification on extracted tokens | `02--cluster-classify/cluster-classify.md` |
| Write DESIGN.md | Composes the 17-section DESIGN.md, copying every value verbatim from tokens.json | `03--write-design-md/write-design-md.md` |
| Validate | Checks hex accuracy against tokens.json and v2 core-section completeness | `04--validate/validate.md` |
| Report and preview | Generates HTML report, visual preview, and proof artifacts | `05--report-preview/report-preview.md` |
| Feature extractors | Per-feature detection: accessibility, dark mode, framework, icons, motion, design boundary | `06--feature-extractors/feature-extractors.md` |

---

## 2. EXTRACT

The entry point of the pipeline. Crawls a live URL, collects computed CSS values across five responsive viewports, and writes `tokens.json`. Every downstream phase depends on this phase completing cleanly. The extractor runs Playwright with Chromium, reads `getComputedStyle`, and tags each token with its source viewport and DOM context. The `--fast` flag controls crawl depth. Interaction capture (`--with-interaction`) records hover, focus, and active state styles.

Key behaviors:
- Five viewports from mobile (375px) through wide desktop (1440px).
- Computed color, typography, shadow, radius, spacing, and CSS variable collection.
- Dark-mode palette detection via `prefers-color-scheme` media query and class/attribute toggles.
- Per-feature detectors run inline during extraction (accessibility, framework, icons, motion).
- Output written to `output/<domain>/tokens.json`.

See [`01--extract/extract.md`](01--extract/extract.md) for the crawl model, extraction flags, and the tokens.json schema.

---

## 3. CLUSTER AND CLASSIFY

Runs after extraction to transform raw color data into a stability-classified token set. Colors are clustered in the OKLCH color space into named roles, and each token receives an L1 through L4 stability classification that governs whether it appears in `DESIGN.md`. The classifier is deterministic; boundary tokens are assigned the higher class.

Key behaviors:
- OKLCH color space clustering groups visually similar colors into named roles.
- L1 (permanent, brand-level) and L2 (system, component-level) tokens enter main DESIGN.md sections.
- L3 (campaign, temporary) tokens enter with a "Subject to change" annotation.
- L4 (content, one-off, image-derived) tokens are excluded entirely.
- Color role naming follows the taxonomy in `tool/resources/color-role-taxonomy.md`.

See [`02--cluster-classify/cluster-classify.md`](02--cluster-classify/cluster-classify.md) for the OKLCH clustering algorithm, the stability-classification heuristic, and the boundary-disambiguation rule.

---

## 4. WRITE DESIGN.MD

The highest-hallucination-risk phase. Produces the 17-section `DESIGN.md` by reading `tokens.json` and copying every hex, pixel, font-weight, shadow, radius, and spacing value verbatim. The cardinal fidelity rule forbids estimation, rounding, normalization, or invention. The writer loads the v2 format specification from `tool/resources/design-md-format.md` and the voice rules from `tool/resources/writing-style-guide.md` before composing.

Key behaviors:
- Hex codes in 6-digit lowercase only (`#1a1a2e`, never `#1A1A2E`, `#333`, `rgb()`, or `hsl()`).
- L1 and L2 tokens populate the main 17 sections. L3 tokens appear only in a "Subject to change" block. L4 tokens absent.
- Dark-mode section included only when `tokens.json` contains a detected dark palette.
- Accessibility section drawn from a11y data in `tokens.json`.
- The write-phase prompt template (`assets/design_md_prompt_template.md`) and cardinal rules card (`assets/cardinal_rules_card.md`) front-load the fidelity contract.

See [`03--write-design-md/write-design-md.md`](03--write-design-md/write-design-md.md) for the cardinal fidelity rule, the 17-section contract, and the write-phase prompt template.

---

## 5. VALIDATE

Confirms that every hex code in `DESIGN.md` traces to a value in `tokens.json` and that all required v2 core sections are present and non-empty. This is the gating step before any completion claim: an unvalidated DESIGN.md is a draft. Validation is always run after writing and can also be run standalone on an existing DESIGN.md + tokens.json pair.

Key behaviors:
- Hex-accuracy check: cross-references every hex in DESIGN.md against `tokens.colorTokens[].hex` and `tokens.cssVariables[].value`.
- Section-completeness check: confirms all 14 core sections, section 6.5 (Motion System), and sections 11 (State Matrix) and 12 (Iconography) are present.
- Hex casing check: flags uppercase hex, 3-digit shortcuts, `rgb()`, and `hsl()` as format violations.
- Phantom-color detection: flags hex values in DESIGN.md with no token source.
- Score output with per-finding messages and a pass/fail verdict.

See [`04--validate/validate.md`](04--validate/validate.md) for the validation rules, the score model, and the escalation triggers.

---

## 6. REPORT AND PREVIEW

Optional post-validation phase that renders visual artifacts from a DESIGN.md + tokens.json pair. Generates an HTML report mapping tokens to sections, a visual preview of the design system as rendered CSS, and a fidelity proof artifact. These outputs serve human review and team handoff.

Key behaviors:
- `report-gen.ts` produces an HTML report with token-to-section provenance and occurrence counts.
- `preview-gen.ts` renders a visual CSS preview of the design system colors, type, shadows, and spacing.
- `proof.ts` takes a URL and tokens.json and produces a fidelity proof artifact comparing live extraction against the token set.

See [`05--report-preview/report-preview.md`](05--report-preview/report-preview.md) for the report schema, preview rendering, and proof artifact format.

---

## 7. FEATURE EXTRACTORS

Six per-feature detectors that run inline during the extraction phase, each targeting a specific design-system dimension. They enrich `tokens.json` with structured metadata that the write and validate phases consume. Every detector produces its own section of the token schema; a detector that finds no data records the absence rather than inventing values.

Key behaviors:
- **Accessibility** (`a11y-extract.ts`): captures contrast ratios, focus indicator styles, touch-target sizes, ARIA patterns.
- **Dark mode** (`dark-mode-detect.ts`): detects `prefers-color-scheme` media queries, class/attribute dark toggles, and records variable diffs between light and dark.
- **Framework** (`framework-detect.ts`): identifies CSS framework markers (Tailwind, Bootstrap, custom CSS variables).
- **Icons** (`icon-detect.ts`): detects icon library signatures (Heroicons, Lucide, Font Awesome, custom SVG), stroke weights, and grid sizes.
- **Motion** (`motion-extract.ts`): captures transition durations, easing functions, and enter/exit choreography.
- **Design boundary** (`design-boundary-detect.ts`): distinguishes design-system tokens from content-level values to aid L3/L4 boundary classification.

See [`06--feature-extractors/feature-extractors.md`](06--feature-extractors/feature-extractors.md) for each detector's extraction method, the token-schema fields it populates, and the absence-reporting rule.

---

## 8. CAPABILITY COUNT SUMMARY

Each capability area maps to exactly one per-feature file in its numbered category folder.

| Section | Area | Per-feature file |
|---|---|---|
| 2 | Extract | `01--extract/extract.md` |
| 3 | Cluster and classify | `02--cluster-classify/cluster-classify.md` |
| 4 | Write DESIGN.md | `03--write-design-md/write-design-md.md` |
| 5 | Validate | `04--validate/validate.md` |
| 6 | Report and preview | `05--report-preview/report-preview.md` |
| 7 | Feature extractors | `06--feature-extractors/feature-extractors.md` |
| **Total** | **6 capability areas** | **6 per-feature files** |

Total: 6 capability areas = 6 per-feature files
