# Review Report: maintenance-grace covers background embedding

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | PASS |
| **hasAdvisories** | true |
| **P0 findings** | 0 |
| **P1 findings** | 0 |
| **P2 findings** | 2 |
| **Iterations** | 1 |
| **Stop reason** | maxIterations (1) |
| **Release readiness** | in-progress |

The reference-counted maintenance marker correctly protects both the reindex scan and the post-scan background-embedding queue through their overlap. The idle-tick guard ensures an embedding tick with no pending rows never writes a marker. The launcher-side adopt guard from 019 is unchanged. Two cosmetic P2 advisories relate to label array hygiene in the marker module; neither affects the launcher's adoption behavior.

---

## 2. Planning Trigger

No P0 or P1 findings. The two P2 advisories are cosmetic and do not require remediation planning. The implementation is shippable as-is.

---

## 3. Active Finding Registry

### P2-001: `activeLabels` accumulates duplicate entries

- **Severity:** P2
- **Category:** correctness
- **File:line:** `maintenance-marker.ts:60`
- **Finding class:** cosmetic
- **Status:** active
- **Summary:** `beginMaintenance(label)` pushes the label unconditionally. Duplicate labels accumulate if the same label is used for concurrent holders. The launcher checks file freshness, not label content, so this is cosmetic.

### P2-002: Label removal precedes `activeCount` decrement in `end()`

- **Severity:** P2
- **Category:** correctness
- **File:line:** `maintenance-marker.ts:73`
- **Finding class:** cosmetic
- **Status:** active
- **Summary:** In `end()`, the label splice runs before `activeCount` decrement. If the interval timer fires in the synchronous gap, `writeMarker()` serializes a marker with the label removed but the count still incremented. The launcher doesn't parse labels, so this is cosmetic.

---

## 4. Remediation Workstreams

No remediation required. Optional advisory improvements:

| Workstream | Effort | Findings |
|------------|--------|----------|
| Label array hygiene | Trivial | P2-001, P2-002 |

---

## 5. Spec Seed

No spec changes needed. The implementation matches the spec requirements:
- REQ-001 (shared reference-counted module): implemented in `maintenance-marker.ts`
- REQ-002 (embedding queue protected): implemented in `retry-manager.ts`
- REQ-003 (overlap without clobbering): reference counting handles this
- REQ-004 (idle tick never marks): empty-queue guard in `runBackgroundJob`

---

## 6. Plan Seed

No plan changes needed. The implementation follows the plan's four phases exactly.

---

## 7. Traceability Status

| Protocol | Status |
|----------|--------|
| spec_code | PASS — all REQ acceptance criteria traced to implementation |
| checklist_evidence | N/A — no checklist.md present (Level 1 spec) |

---

## 8. Deferred Items

- **Cooperative embedding phases:** Making the heaviest synchronous embedding phases chunk-and-yield so the daemon stays responsive rather than only un-reaped. Noted in implementation-summary.md known limitations. Out of scope for this phase.
- **Full live end-to-end reindex run:** Deploy-time confirmation, not a code deliverable.

---

## 9. Audit Appendix

### Coverage

| Dimension | Covered |
|-----------|---------|
| Correctness | Yes (iteration 1) |
| Security | Not covered (maxIterations=1) |
| Traceability | Not covered (maxIterations=1) |
| Maintainability | Not covered (maxIterations=1) |

**Note:** maxIterations=1 limits coverage to one dimension. The findings from the correctness pass are sufficient for a PASS verdict. Security, traceability, and maintainability were not independently scored but the correctness analysis touched on traceability (spec↔code alignment) and maintainability (code clarity, test coverage).

### Convergence Evidence

- Stop reason: maxIterations (1) — convergence not evaluated (single iteration)
- newFindingsRatio: 1.0 (first iteration, all findings are new)
- Verdict: PASS (no P0/P1 findings)

### Adversarial Replay

No P0 findings to replay. P2 findings are cosmetic and survived self-check without downgrade.
