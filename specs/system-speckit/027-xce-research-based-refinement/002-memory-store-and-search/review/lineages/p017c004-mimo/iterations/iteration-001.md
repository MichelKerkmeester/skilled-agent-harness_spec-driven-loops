# Iteration 001 — Correctness Review

**Dimension**: Correctness
**Focus**: Isotonic PAV algorithm, weight rebalance math, calibration wiring, edge-case handling, spec/impl alignment

---

## Review Actions

1. Read `confidence-calibration.ts` — PAV fit/apply math, labeled-set loader, model loader
2. Read `confidence-scoring.ts` — weight rebalance (0.45/0.55), calibration hook wiring, request-quality aggregation
3. Read `search-flags.ts` — `isConfidenceCalibrationEnabled()` opt-in flag, `getConfidenceCalibrationModelPath()`
4. Read `confidence-calibration.vitest.ts` — test coverage for fit/apply/loader/wiring
5. Grep for `relevant` and `clamp01` usage patterns across the search module

---

## Findings

### P1-001: Spec documents are scaffold placeholders — zero traceability baseline

**Severity**: P1
**Category**: traceability
**File:Line**: `004-confidence-calibration-labeled-set/spec.md:48-128`, `plan.md:46-129`, `tasks.md:53-77`
**Finding_class**: spec-alignment

The `spec.md`, `plan.md`, and `tasks.md` files are still in scaffold/template state. All requirements are placeholder text (`[Requirement description]`, `[How to verify it's done]`), all tasks are generic (`T001 Create project structure`), and the plan has no architecture, phases, or testing strategy filled in. The `implementation-summary.md` is fully populated and claims 100% completion, but there is no spec to trace the implementation against.

**Impact**: Cannot verify that the implementation matches its specification because no specification exists. The implementation may be correct in isolation, but the traceability contract is broken.

**Evidence**:
- `spec.md:49`: Priority = `[P0/P1/P2]` (placeholder)
- `spec.md:50`: Status = `[Draft/In Progress/Review/Complete]` (placeholder)
- `spec.md:121`: REQ-001 = `[Requirement description]` (placeholder)
- `tasks.md:53-56`: Phase 1 = `T001 Create project structure`, `T002 Install dependencies` (generic template tasks)

---

### P2-001: No test for boolean `relevant` values in `loadLabeledSet()`

**Severity**: P2
**Category**: correctness
**File:Line**: `mcp_server/tests/confidence-calibration.vitest.ts:122-127`
**Finding_class**: test-gap

`loadLabeledSet()` validates `relevant !== 0 && relevant !== 1` (strict equality), which correctly rejects booleans (`true`/`false`), strings (`"1"`), and out-of-range numbers. The validation logic is correct. However, the test suite does not cover the boolean edge case — `loadLabeledSet([{ query: 'q', memoryId: 1, relevant: true }])` is not tested. Adding this case would guard against a future refactor that loosens the check (e.g., `== 0` instead of `=== 0`).

**Evidence**: `confidence-calibration.vitest.ts:122-126` tests empty query, null memoryId, and `relevant: 2` — but not `relevant: true/false`.

---

### P2-002: Weight constants `WEIGHT_HEURISTIC` + `WEIGHT_SCORE_PRIOR` have no invariant assertion

**Severity**: P2
**Category**: maintainability
**File:Line**: `mcp_server/lib/search/confidence-scoring.ts:54-56`
**Finding_class**: defensive-coding

The comment states "These two must sum to 1.0" but there is no runtime or test assertion enforcing this invariant. If a future change modifies one constant without the other, `heuristicValue + scorePrior` could exceed 1.0 (the `Math.min(1, ...)` clamp on line 318 would mask the overflow) or fall below 1.0 (silently shifting the blend). A simple `if (WEIGHT_HEURISTIC + WEIGHT_SCORE_PRIOR !== 1) throw` or a test assertion would catch drift.

**Evidence**: `confidence-scoring.ts:54`: comment says "These two must sum to 1.0"; line 318: `Math.max(0, Math.min(1, heuristicValue + scorePrior))` silently clamps.

---

### P2-003: Model cache is never invalidated on file content change

**Severity**: P2
**Category**: maintainability
**File:Line**: `mcp_server/lib/search/confidence-scoring.ts:170-179`
**Finding_class**: known-limitation

`resolveCalibrationModel()` memoizes by path only. Editing a model file in place during a long-lived process keeps serving the previously loaded model until the path changes or the process restarts. This is documented in `implementation-summary.md:151` as Known Limitation #4, so it is a conscious design choice — not a bug. Flagging here for completeness.

---

## Adversarial Self-Check (P0 review)

No P0 findings were identified. The PAV algorithm correctly implements pool-adjacent-violators (sort by x, merge left while monotonicity violated). The `applyCalibration` piecewise-linear interpolation is bounded [0,1] and monotonic. The `maybeCalibrate` wiring correctly gates on flag AND model existence. The `clamp01` function handles `NaN` and `Infinity`. No P0 findings to escalate.

---

## Verdict

**P1 findings**: 1 (scaffold docs block traceability)
**P0 findings**: 0

Review verdict: CONDITIONAL
