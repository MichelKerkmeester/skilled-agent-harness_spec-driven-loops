# Deep Review Strategy: 020-maintenance-grace-background-embedding

## Topic

Review the completed Level 1 packet `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding` and its referenced implementation for the shared reference-counted maintenance marker, scan wiring, embedding queue wiring, and marker unit coverage.

## Review Dimensions

| Dimension | Status | Notes |
|-----------|--------|-------|
| correctness | complete | Iteration 001 found no P0/P1 behavior defect and one P2 integration-test coverage advisory |
| security | pending | Not reached in maxIterations=1 |
| traceability | pending | Not reached in maxIterations=1 |
| maintainability | pending | Not reached in maxIterations=1 |

## Completed Dimensions

| Dimension | Iteration | Verdict | Notes |
|-----------|-----------|---------|-------|
| correctness | 001 | PASS | Shared marker, scan holder, and embedding queue holder are present; one P2 test-coverage advisory recorded. |

## Running Findings

| Severity | Active | Notes |
|----------|--------|-------|
| P0 | 0 | None at initialization |
| P1 | 0 | None at initialization |
| P2 | 1 | F001 direct retry-manager marker regression coverage advisory |

## What Worked

- Direct reads of the packet docs identified the implementation files and acceptance criteria.
- Exact Grep located the marker usage sites without relying on stale code graph data.
- The implementation path has clear `finally`-based release points for both the scan holder and embedding queue holder.

## What Failed

- Code graph status is stale (`git HEAD changed: 8b9ff540 -> cf2e49b2; 442 stale files exceed selective threshold (50)`), so structural graph answers were not used as evidence.
- The existing retry-manager empty-queue test covers return shape but not marker absence/presence at the retry-manager boundary.

## Exhausted Approaches

- Code graph structural traversal is exhausted for this lineage unless the graph is rescanned; direct file evidence is used instead.

## Ruled-Out Directions

- Resource-map coverage gate is not applicable because the target packet had no `resource-map.md` at init.
- Active behavior-defect theories for marker clobbering and holder leaks were ruled out by direct code evidence in iteration 001.

## Next Focus

Max iterations reached. If this lineage is continued, next focus should be traceability over verification claims and whether F001 should remain advisory.

## Known Context

- The packet claims 020 closes the 019 follow-on gap by moving the maintenance marker writer into a shared reference-counted module and wiring the post-scan embedding queue to hold the marker.
- `spec.md` acceptance criteria require marker presence while at least one holder is active, removal at zero holders, idempotent `end()`, scan wiring, embedding queue wiring after the empty-queue guard, and unit/suite verification.
- `resource-map.md not present. Skipping coverage gate`.

## Cross-Reference Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | Shared module, scan holder, and embedding queue holder checked; full traceability remains incomplete under maxIterations=1 |
| checklist_evidence | core | not-applicable | Level 1 packet has no checklist.md; sampled tasks.md instead |
| feature_catalog_code | overlay | pending | Limited to implementation file review in maxIterations=1 |
| playbook_capability | overlay | pending | Limited to implementation file review in maxIterations=1 |

## Files Under Review

| File | Source | Coverage |
|------|--------|----------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/spec.md` | target doc | read |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/plan.md` | target doc | read |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/tasks.md` | target doc | read |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/implementation-summary.md` | target doc | read |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | implementation | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | implementation | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | implementation | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | test | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | test | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts` | test | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts` | test | reviewed |

## Review Boundaries

- Max iterations: 1.
- Write boundary: only the lineage artifact directory.
- Target files are read-only.
- No nested task dispatch and no WebFetch.
- The fan-out override binds artifact_dir directly; `resolveArtifactRoot` was not run.

## Non-Goals

- Do not implement fixes.
- Do not modify the target packet docs or implementation files.
- Do not perform deploy/live daemon verification.

## Stop Conditions

- Stop after one iteration because `config.maxIterations=1`.
- Synthesize whatever coverage and findings the single iteration produced.
