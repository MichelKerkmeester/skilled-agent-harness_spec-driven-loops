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

- 7 test files, 68 tests, run by vitest.
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
│ 7 files, 68 tests, pass or fail report   │
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
 Test Files  7 passed (7)
      Tests  68 passed (68)
```

---

## 6. RELATED

- [`backend README`](../README.md)
- [`scripts README`](../scripts/README.md)
- [`md-generator SKILL`](../../SKILL.md)
