---
title: "Scripts Tests: Vitest Suites (lane-local)"
description: "Index of the deep-improvement Vitest suites, co-located with the lane each one covers, plus the cross-lane fixtures."
trigger_phrases:
  - "deep-improvement tests"
  - "scripts vitest suite"
  - "lane-local tests"
---

# Scripts Tests: Vitest Suites (lane-local)

---

## 1. OVERVIEW

The deep-improvement Vitest suites are **co-located with the lane each one covers**: a suite that exercises `agent-improvement/` lives in `agent-improvement/tests/`, a suite for `model-benchmark/` lives in `model-benchmark/tests/`, and so on. Suites that cover `shared/` or `lib/` helpers — plus the cross-lane fixtures and this index — live in `shared/tests/`.

Current state:

- Suites use the `.vitest.ts` extension and the explicit include glob (`*/tests/**/*.vitest.ts`) in `vitest.config.mjs`.
- Each suite resolves scripts-under-test from `WORKSPACE_ROOT` (`path.resolve(TEST_DIR, '../../../../../../')`), so suites are position-stable within their lane's `tests/` dir.
- Fixture-backed suites read static state from `shared/tests/fixtures/` rather than running a live loop.
- The suite runs from the `scripts/` directory with `npx vitest run`.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- agent-improvement/tests/
|   +-- benchmark-stability.vitest.ts
|   +-- candidate-lineage.vitest.ts
|   +-- score-candidate-cache.vitest.ts
|   +-- score-candidate-security.vitest.ts
|   `-- trade-off-detector.vitest.ts
+-- model-benchmark/tests/
|   +-- bundle-gate-exec-gate.vitest.ts
|   +-- grader-harness-hardening.vitest.ts
|   +-- optin-scorer.vitest.ts
|   +-- remediation.vitest.ts
|   +-- run-benchmark-hardening.vitest.ts
|   `-- scorer.vitest.ts
+-- skill-benchmark/tests/
|   +-- skill-benchmark.vitest.ts
|   +-- playbook-mode.vitest.ts
|   `-- sk-code-router-sync.vitest.ts
`-- shared/tests/
    +-- improvement-journal.vitest.ts
    +-- loop-host.vitest.ts
    +-- materialize-fixture-id.vitest.ts
    +-- mirror-sync-verify.vitest.ts     # covers lib/mirror-sync-verify.cjs
    +-- mutation-coverage.vitest.ts
    +-- promote-candidate-benchmark.vitest.ts
    +-- reduce-state-dashboard.vitest.ts
    +-- reduce-state-mode-mix.vitest.ts
    `-- fixtures/                          # Cross-lane deterministic state inputs
```

---

## 3. KEY FILES

### agent-improvement/tests/

| File | Covers |
|---|---|
| `benchmark-stability.vitest.ts` | `agent-improvement/benchmark-stability.cjs` variance and insufficient-sample paths. |
| `candidate-lineage.vitest.ts` | `agent-improvement/candidate-lineage.cjs` derivation tracking. |
| `score-candidate-cache.vitest.ts` | `agent-improvement/score-candidate.cjs` cache behavior. |
| `score-candidate-security.vitest.ts` | `agent-improvement/score-candidate.cjs` security and path-guard paths. |
| `trade-off-detector.vitest.ts` | `agent-improvement/trade-off-detector.cjs` regression and insufficient-data paths. |

### model-benchmark/tests/

| File | Covers |
|---|---|
| `bundle-gate-exec-gate.vitest.ts` | `model-benchmark/scorer/deterministic/bundle-gate.cjs` criteria-exec gate. |
| `grader-harness-hardening.vitest.ts` | `model-benchmark/scorer/grader/harness.cjs` hardening (score clamp, cache gate). |
| `optin-scorer.vitest.ts` | `model-benchmark/run-benchmark.cjs` opt-in `5dim` scorer path. |
| `remediation.vitest.ts` | Model-benchmark remediation hardening (dispatcher cwd, cwd-check prefix, criteria-exec gate). |
| `run-benchmark-hardening.vitest.ts` | `model-benchmark/run-benchmark.cjs` hardening and fixture handling. |
| `scorer.vitest.ts` | `model-benchmark/scorer/score-model-variant.cjs` five-dimension scoring output. |

### skill-benchmark/tests/

| File | Covers |
|---|---|
| `skill-benchmark.vitest.ts` | `skill-benchmark/` orchestrator, router-replay, dual report rendering. |
| `playbook-mode.vitest.ts` | Playbook parser, executor dispatch, real-gold scoring, divergence, live/browser/D4/generator. |
| `sk-code-router-sync.vitest.ts` | sk-code router drift guard (machine-readable router stays parseable). |

### shared/tests/

| File | Covers |
|---|---|
| `improvement-journal.vitest.ts` | `shared/improvement-journal.cjs` append-only journal and enum validation. |
| `loop-host.vitest.ts` | `shared/loop-host.cjs` mode switching and lane path resolution. |
| `materialize-fixture-id.vitest.ts` | `shared/materialize-benchmark-fixtures.cjs` fixture-id sanitization. |
| `mirror-sync-verify.vitest.ts` | `lib/mirror-sync-verify.cjs` four-runtime mirror equivalence. |
| `mutation-coverage.vitest.ts` | `shared/mutation-coverage.cjs` coverage metrics and trajectories. |
| `promote-candidate-benchmark.vitest.ts` | `shared/promote-candidate.cjs` model-benchmark promotion path. |
| `reduce-state-dashboard.vitest.ts` | `shared/reduce-state.cjs` dashboard output. |
| `reduce-state-mode-mix.vitest.ts` | `shared/reduce-state.cjs` mixed-mode registry reduction. |
| `fixtures/` | Static state inputs the suites read. See `fixtures/README.md`. |

---

## 4. VALIDATION

Run from the `scripts/` directory.

```bash
npx vitest run
```

Expected result: every suite under `*/tests/**/*.vitest.ts` passes.

---

## 5. RELATED

- [`scripts/README.md`](../../README.md)
- [`fixtures/README.md`](./fixtures/README.md)
- [`scripts/lib/README.md`](../../lib/README.md)

## Running the battery

Run the deep-improvement Vitest battery from `.opencode/skills/deep-loop-workflows/improvement/scripts/` with `npx --yes vitest@4.1.6 run --config vitest.config.mjs`; the versioned `npx` package supplies the missing Vitest binary without editing `.opencode/package.json` or any lockfile, and running from `scripts/` keeps config resolution on the local `vitest.config.mjs`.
