# Review Report: 020-maintenance-grace-background-embedding

## 1. Executive Summary

- **Verdict:** PASS
- **Active findings:** P0=0, P1=0, P2=1
- **hasAdvisories:** true
- **Scope:** Code review of the shared, reference-counted maintenance marker implementation and its integration into the scan and background-embedding queue.
- **Stop reason:** maxIterationsReached
- **Lineage:** sessionId=fanout-p020-kimi-1-1781721166412-nlwse6, generation=1, lineageMode=new

The single-iteration review focused on D1 Correctness. No correctness blockers or required fixes were found. The reference-counting contract, the scan/embedding queue wiring, and the idle-tick guard all match the spec. One P2 advisory remains for a test-helper cleanup gap.

## 2. Planning Trigger

PASS with advisories. No remediation plan is required. The one P2 advisory can be addressed in a follow-up hygiene pass or accepted as low-risk test-only behavior. Next action: `/create:changelog` if the advisory is accepted, or a small cleanup PR if the test helper is tightened.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | Status | First Seen | Last Seen |
|----|----------|-----------|-------|-----------|--------|------------|-----------|
| F001 | P2 | correctness | Test-only reset helper leaves on-disk marker behind | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:87-91` | active | 1 | 1 |

### F001 Detail
**Claim:** The test-only helper `__resetMaintenanceMarkerForTest` resets the in-memory timer and counters but does not remove the `.maintenance-active.json` file it may have written.

**Evidence:** `mcp_server/lib/storage/maintenance-marker.ts:87-91` clears `refreshTimer`, `activeCount`, and `activeLabels` but never calls `rmSync(markerPath())`.

**Impact:** Low. The current tests use a fresh temp directory per case and remove it in `afterEach`, so no leak escapes the test process. A future test reusing a `DATABASE_DIR` and calling this helper without directory cleanup could see a stale marker.

**Adjudication:** After reviewing the test file (`tests/maintenance-marker.vitest.ts:37-66`), the current cleanup path is adequate. The finding is retained as a P2 advisory because making the helper self-cleaning is a cheap hygiene win and removes an implicit contract on callers.

## 4. Remediation Workstreams

### Workstream A: Test hygiene (F001)
- **Action:** In `__resetMaintenanceMarkerForTest`, remove the marker file from `DATABASE_DIR` before clearing state.
- **Files:** `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts`
- **Effort:** trivial
- **Finding IDs:** F001

## 5. Spec Seed

No spec changes are required. The existing spec.md REQ-001 through REQ-004 are satisfied by the current implementation. Optionally add a non-normative note that test helpers are expected to clean up on-disk artifacts they create.

## 6. Plan Seed

If addressing F001:
- Update `__resetMaintenanceMarkerForTest` to call `rmSync(markerPath(), { force: true })` before resetting module state.
- Re-run `maintenance-marker.vitest.ts` to confirm no regression.
- No production code changes are needed.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Correctness claims verified against `maintenance-marker.ts`, `memory-index.ts`, and `retry-manager.ts`; traceability claims not audited due to maxIterations=1 |
| `checklist_evidence` | core | blocked | `checklist.md` absent at the target spec folder; completion evidence recorded in `implementation-summary.md` |
| `skill_agent` | overlay | notApplicable | Target is a spec folder |
| `agent_cross_runtime` | overlay | notApplicable | Target is a spec folder |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog claims in scope |
| `playbook_capability` | overlay | notApplicable | No playbook scenarios in scope |

## 8. Deferred Items

- D2 Security, D3 Traceability, and D4 Maintainability were not reviewed due to `maxIterations=1`.
- The pre-existing cross-file test-isolation flake in `retry-manager.vitest.ts` T49 is noted in `implementation-summary.md` and was not introduced by this phase.

## 9. Audit Appendix

### Iteration Table
| Iteration | Focus | Status | newFindingsRatio | P0 | P1 | P2 |
|-----------|-------|--------|------------------|----|----|----|
| 1 | D1 Correctness | complete | 1.00 | 0 | 0 | 1 |

### Convergence Replay
- Max iterations reached after 1 iteration.
- Hard stop triggered: `maxIterationsReached`.
- Legal-stop gate bundle was not evaluated because the hard stop took precedence.

### File Coverage Matrix
| File | Dimension | Findings |
|------|-----------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | correctness | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | correctness | none |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | correctness | none |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | correctness | none |

### Dimension Breakdown
| Dimension | Covered | Verdict |
|-----------|---------|---------|
| correctness | yes | PASS |
| security | no | pending |
| traceability | no | pending |
| maintainability | no | pending |
