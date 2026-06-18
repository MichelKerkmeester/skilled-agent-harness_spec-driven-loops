---
title: "lib: config-driven sweep framework primitives"
description: "Pure, mostly dependency-free helpers consumed by the sweep runner: per-cell scoring, reviewer verdict scoring, correctness gating, framework rendering, profile validation, grouped reporting, and stats."
trigger_phrases:
  - "sweep framework primitives"
  - "correctness gate"
  - "code-task-scorer"
  - "sweep-reporter"
---

# lib: config-driven sweep framework primitives

---

## 1. OVERVIEW

`lib/` holds the building blocks of the config-driven benchmark *sweep*. Each module is a pure (or near-pure) helper that `../sweep-benchmark.cjs` composes into one pipeline: render a prompt per framework, score each model output into a dimension vector, gate on correctness, then aggregate and report a trust verdict before any leaderboard. The central design choice is that **correctness is a GATE, not a blended score** — the fix for a saturation mis-read where a tied 100%-correct column let a format/length artifact pose as a correctness win.

Current state:

- `code-task-scorer.cjs` produces the per-cell dimension vector by running fixture oracles as deep-equal tests in isolated child processes.
- `reviewer-scorer.cjs` scores reviewer-prompt fixtures by dispatching a reviewer prompt, extracting a verdict, and comparing it to the expected-verdict oracle.
- `correctness-gate.cjs` decides eligibility and the ranking key; correctness is dropped as the key when it saturates, never folded into a blend.
- `framework-renderer.cjs` fills `{{slot}}` placeholders from a machine-readable framework registry and fails loud on any unfilled required slot.
- `profile-validator.cjs` validates only the new sweep keys, only when present, so legacy profiles pass untouched.
- `sweep-reporter.cjs` groups rows, applies the gate, auto-detects saturation, and emits `aggregate.json` + `synthesis.md` with the trust verdict first.
- `sweep-stats.cjs` supplies the dependency-free stats the verdict needs: MAD, quantiles, a seeded paired-delta bootstrap CI, and the verdict gates.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `code-task-scorer.cjs` | Scores ONE cell's model output against a code-task fixture. Extracts the target function from fenced/bare and `function`/arrow forms, runs visible + `hidden_tests` oracles as deep-equal checks in isolated child processes (one process per case, each with its own hard timeout), and returns `{ correctness_pass_rate, assertions_passed/total, format_adherent, output_words/chars, per_test, extracted, ... }`. Exports `scoreCodeTask`, `extractFunction`, `detectFormatAdherence`, `unfence`, `runSuite`. Dependency-free (Node stdlib). |
| `reviewer-scorer.cjs` | Scores reviewer-prompt fixtures. Detects `kind: "reviewer-prompt"`, composes prompts from `prompt_template` plus `input`, dispatches through `dispatch-model.cjs` when no deterministic `reviewer_output` is present, extracts `PASS`/`FAIL`/`BLOCK` pattern-first with `--grader llm` fallback, and emits a Lane B report row with `correctness_pass_rate`, D1-D5 dimensions, per-case details, and `REVIEWER_BENCHMARK` mismatch messages. |
| `correctness-gate.cjs` | Applies correctness as a GATE. A group is eligible iff its `correctness_mean` clears the threshold (default 1.0); among the eligible, correctness ranks them only while it still separates, otherwise it is dropped and survivors rank on format-adherence (desc) then efficiency / fewer words (asc). Exports `applyGate`, `DEFAULT_THRESHOLD`. Pure, no I/O. |
| `framework-renderer.cjs` | Data-driven `{{slot}}` prompt renderer over a JSON framework registry. Computes a framework-neutral `output_contract` + `constraints` from the fixture, fills every slot, and throws naming any required slot left empty or any placeholder that survived. Exports `renderFramework`, `loadRegistry`, `getFramework`, `DEFAULT_CONSTRAINTS`. |
| `profile-validator.cjs` | Additive, dependency-free sweep-key validator. Returns `{ valid, errors }` (collects all issues, never throws). A profile with no `mode` is reported valid and untouched; present keys (`mode`, `models[].executor`, `scoring.scorer`, dimension weights summing to 1.0, `correctnessGate.threshold ∈ [0,1]`, `sampling.samplesPerCell`) are checked against their contract. Exports `validateProfile`, `KNOWN_MODES`, `KNOWN_EXECUTORS`, `KNOWN_SCORERS`. |
| `sweep-reporter.cjs` | Turns raw per-cell rows into a grouped aggregate + human synthesis. Groups by `reporting.groupBy`, applies the gate, auto-detects per-fixture saturation, and builds a trust verdict (enough repeated samples AND top-pair margin over the noise floor AND a paired bootstrap CI excluding zero) on the gate's chosen ranking key. Orders `synthesis.md` so the verdict and saturation status precede any leaderboard. Exports `report` plus `groupRows`, `aggregateGroup`, `detectFixtureSaturation`, `minSamplesPerCell`, `noiseFloorForKey`, `buildVerdict`, `SCHEMA_VERSION`. |
| `sweep-stats.cjs` | Dependency-free statistics: `mean`, `median`, `quantile`, `mad` (robust spread used as the noise floor), `seededRandom` (mulberry32, number or string seed), `bootstrapPairedDeltaCi`, `pairedWinRate`, `noiseFloorMad`, and the verdict gates `trustVerdict` / `trustVerdictCI`. Every helper is pure and returns NaN on empty input rather than throwing. |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `code-task-scorer.cjs`, `correctness-gate.cjs`, `framework-renderer.cjs`, `profile-validator.cjs`, and `sweep-stats.cjs` import only Node builtins. `sweep-reporter.cjs` is the one intra-lib edge: it requires `./sweep-stats.cjs` and `./correctness-gate.cjs`. |
| Exports | Each module is a CommonJS module exporting named functions (see KEY FILES). No module has a CLI `main()`; these are library helpers, not entrypoints. |
| Consumers | `../sweep-benchmark.cjs` is the sweep runner that composes these: it requires `framework-renderer`, `profile-validator`, `code-task-scorer`, and `sweep-reporter` directly (the gate and stats arrive transitively through the reporter). |
| Ownership | These primitives own per-cell scoring, gating, rendering, validation, aggregation, and stats. The sweep orchestration, dispatch, and disk layout live in `../sweep-benchmark.cjs`; the legacy 5-dimension engine lives in `../scorer/`. |
| Write policy | Pure helpers do no I/O except `sweep-reporter.report` (writes `aggregate.json` + `synthesis.md` only when `outDir`/`write` is set) and `framework-renderer.loadRegistry` (reads a registry JSON). The child-process scorer materializes a runner program to a temp dir; it writes no benchmark state. |

Main flow:

```text
╭──────────────────────────────────────────────╮
│ profile + framework registry + fixtures      │
╰──────────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────────┐
│ profile-validator.validateProfile            │
│ (additive sweep-key checks; legacy passes)   │
└──────────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────┐
│ framework-renderer.renderFramework           │
│ {{slot}} fill → one prompt per cell          │
└──────────────────────────────────────────────┘
                  │  (model dispatched by the runner)
                  ▼
┌──────────────────────────────────────────────┐
│ code-task-scorer.scoreCodeTask               │
│ or reviewer-scorer.scoreReviewerFixture      │
│ oracle checks → row vector                   │
└──────────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────┐
│ sweep-reporter.report                        │
│  group rows                                  │
│  → correctness-gate.applyGate (eligibility,  │
│      ranking key — correctness never blended)│
│  → saturation auto-detect                    │
│  → trust verdict via sweep-stats             │
│      (MAD floor + paired bootstrap CI)       │
└──────────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────────╮
│ aggregate.json + synthesis.md                │
│ (verdict + saturation FIRST, board LAST)     │
╰──────────────────────────────────────────────╯
```

---

## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts
npx vitest run .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
npx vitest run .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts
```

Expected result: the sweep foundation, stats-CI, and acceptance suites pass.

---

## 5. RELATED

- [`model-benchmark README`](../README.md)
- [`scorer README`](../scorer/README.md)
- [`scripts README`](../../README.md)
- [`deep-improvement SKILL.md`](../../../SKILL.md)
