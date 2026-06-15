---
title: "agent-improvement/tests: Lane A Vitest suites"
description: "The five Vitest suites that cover the agent-improvement (Lane A) scripts: stability, lineage, score-candidate cache/security, and trade-off detection."
trigger_phrases:
  - "agent-improvement tests"
  - "lane A vitest"
  - "score-candidate test"
  - "trade-off-detector test"
---

# agent-improvement/tests: Lane A Vitest suites

---

## 1. OVERVIEW

This directory holds the five Vitest suites that cover the Lane A (agent-improvement) scripts one level up in `../`. Each suite resolves its script-under-test from `WORKSPACE_ROOT` and exercises one `.cjs` module: pure-function suites `require()` the module directly, while the score-candidate suites shell out to `score-candidate.cjs` via `execFileSync` to assert end-to-end CLI and cache behavior.

Current state:

- Suites use the `.vitest.ts` extension and are picked up by the `*/tests/**/*.vitest.ts` include glob in `scripts/vitest.config.mjs`.
- `WORKSPACE_ROOT` resolves via `path.resolve(TEST_DIR, '../../../../../../')`, so each suite is position-stable inside this lane's `tests/` dir.
- `benchmark-stability`, `candidate-lineage`, and `trade-off-detector` `require()` the module and assert exported functions and constants directly.
- `score-candidate-cache` and `score-candidate-security` spawn `score-candidate.cjs` with `execFileSync` and parse its JSON stdout, using `os.tmpdir()` scratch dirs created/torn down per test.

---

## 2. KEY FILES

| File | Covers |
|---|---|
| `benchmark-stability.vitest.ts` | `../benchmark-stability.cjs` — default constants, the `mean`/`stddev`/`stabilityCoefficient` math helpers, `measureStability` (insufficient-sample and full-verdict paths), `isStable`, and `generateWeightRecommendations`. |
| `candidate-lineage.vitest.ts` | `../candidate-lineage.cjs` — `createLineageGraph`, `recordCandidate` (parent/child links plus rubric-stripped content-hash dedup), `getLineage`, `getCandidatesByWave`, `getRootCandidates`, and `getChildren`. |
| `score-candidate-cache.vitest.ts` | `../score-candidate.cjs` cache reproducibility — identical inputs return the same `inputHash`/`score`/`dimensions`, and two distinct candidates in a shared cache dir never collide on one cache entry. |
| `score-candidate-security.vitest.ts` | `../score-candidate.cjs` security — cache read-integrity (tampered or non-`scored` entries are treated as a miss and recomputed) and `scoreDimSystemFitness` resource-ref sanitization (traversal-shaped command/skill refs are counted but never credited as valid). |
| `trade-off-detector.vitest.ts` | `../trade-off-detector.cjs` — hard/soft dimension constants and thresholds, `detectTradeOffs` (insufficient-data and regression-vs-improvement paths), `getTrajectory` (inline dimensions and `scoreOutputPath` indirection), and `checkParetoDominance`. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Suites import only Node builtins (`path`, `fs`, `os`, `child_process`, `module`, `url`) plus `vitest`. They resolve scripts-under-test by absolute path from `WORKSPACE_ROOT`, never via package imports. |
| Scope | Each suite covers exactly one Lane A script in `../`. New Lane A behavior gets a co-located suite here; cross-lane and `shared/`/`lib/` coverage lives in `../../shared/tests/`. |
| Side effects | Filesystem-touching suites write only to `os.tmpdir()` scratch dirs created in `beforeEach` and removed in `afterEach`. No suite mutates repo state. |
| Ownership | Read-only against the scripts. Suites assert exported behavior and CLI output; they do not patch or write back into the lane. |

---

## 4. VALIDATION

Run from the `scripts/` directory.

```bash
npx vitest run agent-improvement/tests
```

Expected result: all five Lane A suites pass.

---

## 5. RELATED

- [`agent-improvement README`](../README.md)
- [`shared/tests README` (central index)](../../shared/tests/README.md)
- [`deep-improvement SKILL.md`](../../../SKILL.md)
