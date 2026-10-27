---
title: "tests: Vitest Unit Suite for the Extraction Pipeline"
description: "Vitest unit coverage for the backend pipeline: OKLCH clustering, deterministic v3 emitters, the validation engine, prompt building, accessibility extraction and CLI flag parsing."
trigger_phrases:
  - "md-generator tests"
  - "backend vitest suite"
  - "design pipeline unit tests"
  - "cluster validate formatters tests"
---

# tests: Vitest Unit Suite for the Extraction Pipeline

---

## 1. OVERVIEW

`tests/` owns the vitest unit suite for the backend extraction pipeline. Each file imports its subject from `../scripts/` and asserts current behavior of one module, from raw colour parsing through the deterministic DESIGN.md emitters and the validation engine.

Current state:

- 20 test files, 176 tests, run by vitest.
- Every file imports its subject directly from `../scripts/` (for example `from '../scripts/cluster'`).
- `cluster.test.ts` is the largest suite at 42 tests covering colour parsing, contrast, OKLCH delta-E, shadow classification and token merging.

---

## 2. DIRECTORY TREE

```text
tests/
+-- cluster.test.ts            # OKLCH clustering, parsing, contrast, delta-E, shadow + token merge
+-- cluster-classify.test.ts   # classifyVariant and classifyColorStability
+-- formatters-v3.test.ts      # deterministic v3 emitters, colour namer, max-width verbatim rule
+-- validate.test.ts           # validation engine, hex accuracy, prose fabrication, sections
+-- build-write-prompt.test.ts # v3 pre-render, FACTS block, prose-only write prompt
+-- a11y-extract.test.ts       # accessibility extraction, focus honest absence
+-- parseargs.test.ts          # extract.ts flag parsing, order independence, --fast defaults
+-- corpus-baseline-v3.test.ts # corpus baseline through the retrieval manifest
+-- css-analyzer-transitions.test.ts # transition shorthand parsing with cubic-bezier commas
+-- design-boundary-detect.test.ts   # design boundary detection
+-- icon-detect.test.ts        # icon system detection
+-- motion-extract.test.ts     # motion token extraction
+-- output-policy.test.ts      # output path resolution and write guards
+-- render-safety.test.ts      # safe colour, length, line-height and weight rendering
+-- report-preview-overwrite.test.ts # report and preview overwrite guard
+-- schema-v3.test.ts          # v3 schema single-authority contract
+-- typography-role-v3.test.ts # semantic typography-role normalizer
+-- guided-run.test.ts         # guided-run wrapper
+-- typo-flags.test.ts         # long-option typo refusal in guided-run
+-- study-exemplars.test.ts    # bounded STUDY exemplar controls
+-- fixtures/                  # shared study case data
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `cluster.test.ts` | Covers `parseColor`, `parsePxValue`, `rgbaToHex`, `wcagContrast`, `deltaE`, `splitShadowLayers`, `classifyShadow` and `mergeTokenSets`. Asserts OKLCH delta-E within-cluster thresholds and L1 to L4 token merging by perceptual identity. |
| `cluster-classify.test.ts` | Covers the extracted `classifyVariant` button heuristic across every branch including Outline and Tertiary, plus `classifyColorStability` capping a high-frequency single-page colour at the campaign layer through the coverage gate. |
| `formatters-v3.test.ts` | Covers the deterministic v3 emitters: `nameColors` hue and lightness naming with collision suffixes, the fab-killer rule where `formatSpacingShapesV3` emits `100%` max-width verbatim, deterministic `emitQuickStart`, and clean empty-token rendering. |
| `validate.test.ts` | Covers `validateDesignMd`: hex accuracy, phantom-colour and content-layer detection, Quick Start fidelity, prose-fabrication warnings, section completeness and the failure and warning scoring math. |
| `build-write-prompt.test.ts` | Covers `buildWritePrompt`: the deterministic v3 pre-render, the FACTS block, the flat-elevation rule for zero shadows and focus-honesty wording driven by captured and consistent flags. |
| `a11y-extract.test.ts` | Covers `extractA11y` focus-indicator honesty: `captured:false` and `consistent:false` on empty data, and a real captured outline style. |
| `parseargs.test.ts` | Covers `parseArgs` from `extract.ts`: order-independent `--fast`, `--fast` defaults applied only without an explicit value, and interaction capture defaulting on. |
| `corpus-baseline-v3.test.ts` | Covers `corpus-baseline-v3.ts`: the corpus baseline read through the retrieval manifest. |
| `css-analyzer-transitions.test.ts` | Covers `parseTransitionShorthand` from `css-analyzer.ts`, including `cubic-bezier` arguments whose commas must not split the shorthand. |
| `design-boundary-detect.test.ts` | Covers `detectBoundaries` from `design-boundary-detect.ts`. |
| `icon-detect.test.ts` | Covers `detectIcons` from `icon-detect.ts`. |
| `motion-extract.test.ts` | Covers `extractMotion` from `motion-extract.ts`. |
| `output-policy.test.ts` | Covers `resolveOutputPath`, `requireOutputPath` and `ensureWritableFile` from `output-policy.ts`. |
| `render-safety.test.ts` | Covers the `render-safety.ts` sanitizers, `safeColor`, `safeLength`, `safeLineHeight` and `safeFontWeight` among them. |
| `report-preview-overwrite.test.ts` | Covers the overwrite guard shared by `report-gen.ts` and `preview-gen.ts`. |
| `schema-v3.test.ts` | Covers the v3 schema as the single authority that `build-write-prompt.ts` and `formatters-v3.ts` read. |
| `typography-role-v3.test.ts` | Covers the semantic typography-role normalizer in `typography-role-v3.ts`. |
| `guided-run.test.ts` | Covers the `guided-run.ts` wrapper and its use of `output-policy.ts`. |
| `typo-flags.test.ts` | Covers the refusal of misspelled long options by `guided-run.ts`. |
| `study-exemplars.test.ts` | Covers the bounded STUDY exemplar controls across `build-write-prompt.ts`, `formatters-v3.ts` and `guided-run.ts`. |
| `fixtures/` | Shared study case data. See [`fixtures/README.md`](fixtures/README.md). |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Each test imports its subject from `../scripts/` and shared types from `../scripts/types`. |
| Build | The suite is type-checked by `tsconfig.json`, which includes `tests/**/*`. `tsconfig.build.json` excludes `tests` and `**/*.test.ts`, so tests never reach the `dist` emit. |
| Discovery | `vitest.config.ts` sets `include: ['tests/**/*.test.ts']`, so vitest discovers every `.test.ts` under this folder. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ npm test (vitest run)                    │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ vitest.config.ts include glob            │
│ tests/**/*.test.ts                       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ each *.test.ts imports from ../scripts/  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ assertions on the pipeline modules       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ 20 files, 176 tests, pass or fail report │
╰──────────────────────────────────────────╯
```

---

## 5. VALIDATION

Run from the `backend/` directory.

```bash
npm test
```

Expected result:

```text
 Test Files  20 passed (20)
      Tests  176 passed (176)
```

---

## 6. RELATED

- [`backend README`](../README.md)
- [`scripts README`](../scripts/README.md)
- [`md-generator SKILL`](../../SKILL.md)
