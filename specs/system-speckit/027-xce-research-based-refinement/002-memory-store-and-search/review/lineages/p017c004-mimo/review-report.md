# Review Report — confidence-calibration-labeled-set

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **Active P0** | 0 |
| **Active P1** | 1 |
| **Active P2** | 3 (advisories) |
| **hasAdvisories** | true |
| **Scope** | `004-confidence-calibration-labeled-set` spec folder + implementation files |
| **Iterations** | 1 (maxIterations=1) |
| **Stop Reason** | maxIterations reached |
| **Release Readiness** | in-progress |

The review found the implementation code to be correct in isolation — the isotonic PAV algorithm, weight rebalance, calibration wiring, and flag gating all work as designed. However, the spec documents (`spec.md`, `plan.md`, `tasks.md`) remain scaffold placeholders with no actual requirements, making traceability verification impossible. This is the single P1 finding. Three P2 advisories cover test gaps and defensive-coding improvements.

---

## 2. Planning Trigger

The verdict is **CONDITIONAL** due to one active P1 finding. This routes to `/speckit:plan` for remediation:

- **P1-001** requires filling in the spec, plan, and tasks documents with the actual requirements, architecture decisions, and task breakdown that the implementation delivered. This is a documentation/traceability fix, not a code change.

---

## 3. Active Finding Registry

### P1-001: Spec documents are scaffold placeholders — zero traceability baseline

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Category** | traceability |
| **Finding Class** | spec-alignment |
| **Status** | active |
| **Evidence** | `spec.md:48-128`, `plan.md:46-129`, `tasks.md:53-77` |

The `spec.md`, `plan.md`, and `tasks.md` files are in scaffold/template state. All requirements are placeholder text, all tasks are generic template tasks, and the plan has no architecture or phases filled in. The `implementation-summary.md` is complete and claims 100% delivery, but there is no specification to trace against. Cannot verify that the implementation matches its intended specification.

**Remediation**: Fill in spec.md with actual requirements (weight rebalance constants, calibration model contract, flag gating contract, labeled-set format). Fill in plan.md with architecture decisions and phases. Fill in tasks.md with the actual tasks that were completed.

### P2-001: No test for boolean `relevant` values in `loadLabeledSet()`

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | correctness |
| **Finding Class** | test-gap |
| **Status** | active |
| **Evidence** | `confidence-calibration.vitest.ts:122-127` |

The validation logic correctly rejects booleans (`relevant !== 0 && relevant !== 1`), but no test covers this case. Adding `loadLabeledSet([{ query: 'q', memoryId: 1, relevant: true }])` to the rejection tests would guard against future refactors loosening the check.

### P2-002: Weight constants lack invariant assertion

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | maintainability |
| **Finding Class** | defensive-coding |
| **Status** | active |
| **Evidence** | `confidence-scoring.ts:54-56` |

`WEIGHT_HEURISTIC = 0.45` and `WEIGHT_SCORE_PRIOR = 0.55` must sum to 1.0 per the comment, but no runtime or test assertion enforces this. The `Math.min(1, ...)` clamp on line 318 silently masks overflow. A simple invariant check or test assertion would catch drift.

### P2-003: Model cache not invalidated on file content change

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | maintainability |
| **Finding Class** | known-limitation |
| **Status** | active |
| **Evidence** | `confidence-scoring.ts:170-179` |

`resolveCalibrationModel()` memoizes by path only. Documented in `implementation-summary.md:151` as Known Limitation #4. Conscious design choice; flagged for completeness.

---

## 4. Remediation Workstreams

| Workstream | Findings | Effort | Priority |
|-----------|----------|--------|----------|
| **WS-1: Spec documentation** | P1-001 | Medium (fill in 3 template docs) | Required |
| **WS-2: Test hardening** | P2-001 | Low (1 test case) | Advisory |
| **WS-3: Defensive invariants** | P2-002 | Low (1 assertion or test) | Advisory |

---

## 5. Spec Seed

Minimal spec delta derived from review:

The spec should document:
1. **REQ-001**: Weight rebalance — `WEIGHT_HEURISTIC=0.45`, `WEIGHT_SCORE_PRIOR=0.55`, sum invariant, monotonicity guarantee
2. **REQ-002**: Calibration infrastructure — isotonic PAV fit/apply, `CalibrationModel` shape, `fitCalibration` → `applyCalibration` pipeline
3. **REQ-003**: Flag gating — `SPECKIT_CONFIDENCE_CALIBRATION` (default OFF), `SPECKIT_CONFIDENCE_CALIBRATION_MODEL` path, both-must-be-present contract
4. **REQ-004**: Labeled set format — `{query, memoryId, relevant: 0|1}[]`, validation rules
5. **REQ-005**: Starter labeled set — corpus-derived proxy, not production-grade, documented as UNVALIDATED

---

## 6. Plan Seed

Action-ready plan starter for remediation:

1. Fill in `spec.md` requirements table with the 5 requirements above
2. Fill in `plan.md` architecture section with the two-deliverable structure (A: rebalance, B: calibration infra)
3. Fill in `tasks.md` with actual completed tasks (T001: named constants, T002: calibration module, T003: flag wiring, T004: tests, T005: proxy seed generator, T006: starter labeled set)
4. Add boolean test case to `confidence-calibration.vitest.ts`
5. Add weight-sum invariant test to confidence-scoring test suite

---

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | FAILED | spec.md is scaffold — cannot trace |
| checklist_evidence | N/A | No checklist.md (Level 1 folder) |

---

## 8. Deferred Items

| Item | Reason | Severity |
|------|--------|----------|
| Security dimension | Not covered (maxIterations=1) | N/A |
| Dedicated Traceability dimension | Not covered (maxIterations=1) | N/A |
| Dedicated Maintainability dimension | Not covered (maxIterations=1) | N/A |
| Assets review (fit-calibration.mjs, starter set, starter model) | Not covered (maxIterations=1) | N/A |

---

## 9. Audit Appendix

### Coverage

- **Iterations dispatched**: 1
- **Dimensions covered**: 1 of 4 (Correctness)
- **Dimensions partially covered**: 2 (Traceability, Maintainability — findings captured during Correctness pass)
- **Files reviewed**: 4 of 7 (confidence-scoring.ts, confidence-calibration.ts, search-flags.ts, vitest.ts)

### Convergence

- **Convergence achieved**: No
- **Stop reason**: maxIterations=1 reached
- **newFindingsRatio**: 1.0 (4 findings from 0 baseline)
- **newInfoRatio**: 0.85

### Verdict Logic

- PASS requires no P0/P1 findings → blocked by P1-001
- CONDITIONAL = P1 present, no P0 → **correct**
- FAIL requires P0 → not applicable

### Review Quality Guards

| Gate | Status |
|------|--------|
| Evidence | PASS — all findings cite file:line |
| Scope | PASS — all findings within declared scope |
| Coverage | PARTIAL — only 1 of 4 dimensions covered |
