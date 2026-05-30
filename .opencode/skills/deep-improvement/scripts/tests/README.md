---
title: "Scripts Tests: Vitest Suites"
description: "Vitest suites covering the deep-improvement lane scripts, shared reducers, and library helpers."
trigger_phrases:
  - "deep-improvement tests"
  - "scripts vitest suite"
---

# Scripts Tests: Vitest Suites

---

## 1. OVERVIEW

`tests/` holds the vitest suites for the deep-improvement scripts. Each suite targets a script in `agent-improvement/`, `model-benchmark/`, `shared/`, or `lib/` and asserts against deterministic inputs from `fixtures/`.

Current state:

- Suites use the `.vitest.ts` extension and the explicit include glob in `vitest.config.mjs`.
- Fixture-backed suites read static state from `fixtures/` rather than running a live loop.
- The suite runs from the `scripts/` directory with `npx vitest run`.

---

## 2. DIRECTORY TREE

```text
tests/
+-- benchmark-stability.vitest.ts
+-- bundle-gate-exec-gate.vitest.ts
+-- candidate-lineage.vitest.ts
+-- grader-harness-hardening.vitest.ts
+-- improvement-journal.vitest.ts
+-- loop-host.vitest.ts
+-- materialize-fixture-id.vitest.ts
+-- mirror-sync-verify.vitest.ts
+-- mutation-coverage.vitest.ts
+-- optin-scorer.vitest.ts
+-- promote-candidate-benchmark.vitest.ts
+-- reduce-state-dashboard.vitest.ts
+-- reduce-state-mode-mix.vitest.ts
+-- remediation.vitest.ts
+-- run-benchmark-hardening.vitest.ts
+-- score-candidate-cache.vitest.ts
+-- score-candidate-security.vitest.ts
+-- scorer.vitest.ts
+-- trade-off-detector.vitest.ts
`-- fixtures/                          # Deterministic state inputs
```

---

## 3. KEY FILES

| File | Covers |
|---|---|
| `benchmark-stability.vitest.ts` | `agent-improvement/benchmark-stability.cjs` variance and insufficient-sample paths. |
| `bundle-gate-exec-gate.vitest.ts` | `model-benchmark/scorer/deterministic/bundle-gate.cjs` criteria-exec gate. |
| `candidate-lineage.vitest.ts` | `agent-improvement/candidate-lineage.cjs` derivation tracking. |
| `grader-harness-hardening.vitest.ts` | `model-benchmark/scorer/grader/harness.cjs` hardening (score clamp, cache gate). |
| `improvement-journal.vitest.ts` | `shared/improvement-journal.cjs` append-only journal and enum validation. |
| `loop-host.vitest.ts` | `shared/loop-host.cjs` mode switching and lane path resolution. |
| `materialize-fixture-id.vitest.ts` | `shared/materialize-benchmark-fixtures.cjs` fixture-id sanitization. |
| `mirror-sync-verify.vitest.ts` | `lib/mirror-sync-verify.cjs` four-runtime mirror equivalence. |
| `mutation-coverage.vitest.ts` | `shared/mutation-coverage.cjs` coverage metrics and trajectories. |
| `optin-scorer.vitest.ts` | `model-benchmark/run-benchmark.cjs` opt-in `5dim` scorer path. |
| `promote-candidate-benchmark.vitest.ts` | `shared/promote-candidate.cjs` model-benchmark promotion path. |
| `reduce-state-dashboard.vitest.ts` | `shared/reduce-state.cjs` dashboard output. |
| `reduce-state-mode-mix.vitest.ts` | `shared/reduce-state.cjs` mixed-mode registry reduction. |
| `remediation.vitest.ts` | Remediation handling across the lane scripts. |
| `run-benchmark-hardening.vitest.ts` | `model-benchmark/run-benchmark.cjs` hardening and fixture handling. |
| `score-candidate-cache.vitest.ts` | `agent-improvement/score-candidate.cjs` cache behavior. |
| `score-candidate-security.vitest.ts` | `agent-improvement/score-candidate.cjs` security and path-guard paths. |
| `scorer.vitest.ts` | Five-dimension scoring output. |
| `trade-off-detector.vitest.ts` | `agent-improvement/trade-off-detector.cjs` regression and insufficient-data paths. |
| `fixtures/` | Static state inputs the suites read. See `fixtures/README.md`. |

---

## 4. VALIDATION

Run from the `scripts/` directory.

```bash
npx vitest run
```

Expected result: every suite under `tests/**/*.vitest.ts` passes.

---

## 5. RELATED

- [`scripts/README.md`](../README.md)
- [`fixtures/README.md`](./fixtures/README.md)
- [`scripts/lib/README.md`](../lib/README.md)
