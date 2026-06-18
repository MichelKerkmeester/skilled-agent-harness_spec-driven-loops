# Review Report: 019-maintenance-grace-daemon-survives-reelection

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **Active findings:** P0=0, P1=1, P2=1
- **hasAdvisories:** true
- **Scope:** Review of the maintenance-grace daemon-survives-re-election implementation: marker writer, launcher predicate, and both reap-path guard sites.
- **Stop reason:** maxIterationsReached (config.maxIterations = 1)
- **Total iterations:** 1

The implementation correctly places marker writes in the background scan path, refreshes the marker at phase boundaries, provides a fail-safe adopt predicate, and wires the guard into both launcher reap sites. One P1 spec-alignment finding remains: the marker payload omits the `jobId` field required by the approved spec. One P2 advisory notes that the spec's TTL value is stale relative to the shipped 180s TTL.

## 2. Planning Trigger

The CONDITIONAL verdict routes to `/speckit:plan` for a small remediation pass:

1. Align the marker payload with the spec (add `jobId` or amend the spec) — addresses F001.
2. Update the normative spec TTL to 180s (or document it as an explicit accepted deviation) — addresses F002.

After remediation, a one-iteration re-review focused on traceability/maintainability should be sufficient to reach PASS.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File | Line | Status |
|----|----------|-----------|-------|------|------|--------|
| F001 | P1 | traceability | Maintenance marker payload omits required `jobId` field | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | 44 | active |
| F002 | P2 | maintainability | Spec TTL value is stale relative to implementation | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md` | 103 | active |

### F001 — Maintenance marker payload omits required `jobId` field

- **Evidence:** `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-50` writes `{ childPid, activeUntilMs, labels, refreshedAtIso }`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:103` requires `{ childPid, activeUntilMs, jobId, refreshedAtIso }`.
- **Root cause:** The marker writer was implemented with a `labels` array for reference counting but the approved spec was not updated to reflect this shape change.
- **Impact:** Low runtime impact (the launcher predicate ignores the field), but the shipped artifact contradicts the approved spec.
- **First/last seen:** Iteration 1.

### F002 — Spec TTL value is stale relative to implementation

- **Evidence:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:103` states 60s TTL; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:25` uses `MAINTENANCE_MARKER_TTL_MS = 180_000`; rationale is documented in `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/implementation-summary.md:56`.
- **Root cause:** The implementation raised the TTL after discovering a ~79s blocking tail phase, but the normative spec text was not updated.
- **Impact:** Documentation/spec drift; future readers may implement a 60s TTL and reintroduce the bug.
- **First/last seen:** Iteration 1.

## 4. Remediation Workstreams

### Workstream A: Spec/implementation alignment (F001)

- **Finding:** F001
- **Action:** Either add `jobId` to the marker payload in `maintenance-marker.ts` (preferred, matches spec intent) or amend spec.md REQ-001 to document the `labels` array and retire `jobId`.
- **Files:** `mcp_server/lib/storage/maintenance-marker.ts`, `spec.md`
- **Order:** 1

### Workstream B: Normative TTL update (F002)

- **Finding:** F002
- **Action:** Update `spec.md:103` to state the accepted 180s TTL and reference the implementation-summary rationale.
- **Files:** `spec.md`
- **Order:** 2

## 5. Spec Seed

Add the following accepted change to `spec.md`:

- REQ-001 marker payload: keep `childPid`, `activeUntilMs`, `refreshedAtIso`; either restore `jobId` or document `labels` as the replacement field.
- TTL: raise from 60s to 180s, noting the margin over the longest observed non-yielding tail phase.

## 6. Plan Seed

- [ ] T1: Decide whether to add `jobId` to `maintenance-marker.ts` or amend the spec to require `labels`.
- [ ] T2: Apply the marker payload change and update relevant tests if `jobId` is added.
- [ ] T3: Update `spec.md` TTL from 60s to 180s with rationale.
- [ ] T4: Re-run unit and isolated-harness tests to confirm no regression.
- [ ] T5: One-iteration deep-review re-check focused on traceability/maintainability.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Marker payload and TTL drift from spec; guard sites and predicate match. |
| `checklist_evidence` | core | pass | Level-1 folder has no checklist.md; gate not applicable. |
| `skill_agent` | overlay | notApplicable | Target is a spec folder. |
| `agent_cross_runtime` | overlay | notApplicable | Target is a spec folder. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog claims under review. |
| `playbook_capability` | overlay | notApplicable | No playbook scenarios under review. |

## 8. Deferred Items

- Security dimension was not covered (maxIterations=1).
- Full maintainability and traceability dimension coverage was not reached.
- The post-scan background-embedding queue remains unprotected by the maintenance marker; this is already acknowledged as a known limitation in `implementation-summary.md` and is intentionally out of scope for this phase.

## 9. Audit Appendix

### Iteration table

| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|--------------|-------|--------|
| 1 | correctness | 5 | correctness | 0/1/1 | 1.00 | complete |

### Convergence replay

- Iterations completed: 1
- Hard stop: maxIterationsReached at iteration 1.
- Composite convergence signals could not be evaluated (insufficient iterations).
- Legal-stop gate bundle not evaluated because hard stop triggered first.

### File coverage matrix

| File | Iteration | Findings |
|------|-----------|----------|
| `mcp_server/lib/storage/maintenance-marker.ts` | 1 | F001 |
| `mcp_server/handlers/memory-index.ts` | 1 | none |
| `bin/lib/model-server-supervision.cjs` | 1 | none |
| `bin/mk-spec-memory-launcher.cjs` | 1 | none |
| `spec.md` | 1 | F002 |

### Dimension breakdown

- Correctness: covered (iteration 1)
- Security: not covered
- Traceability: partially covered via spec_code protocol
- Maintainability: partially covered

### Session lineage

- sessionId: `fanout-p019-kimi-2-1781719527072-mk6no9`
- parentSessionId: null
- lineageMode: new
- generation: 1
- continuedFromRun: null
