# Iteration 1: Correctness

## Dispatcher

- Budget profile: scan
- Focus dimension: correctness
- Review target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding`
- Artifact root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review/lineages/gpt55-p020-2`
- Bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not invoked.

## Files Reviewed

| File | Purpose |
|------|---------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/spec.md` | Requirements REQ-001 through REQ-004 and scope |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/tasks.md` | Task and verification claims |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/implementation-summary.md` | Delivery and verification claims |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Shared reference-counted marker implementation |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Background scan holder wiring |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Background embedding queue holder wiring |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | Marker lifecycle tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts` | Retry-manager background job tests |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **F001**: Retry-manager marker boundary lacks a direct regression assertion - `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-683` - `runBackgroundJob` has the correctness-critical empty-queue guard before `beginMaintenance` in `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1038` and releases the holder in `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1052-1055`, while the retry-manager tests only assert empty-queue return shape and a generic object return. The shared marker module is covered directly, but the embedding-queue integration boundary is not directly asserted. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-683] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1055]
   - Finding class: matrix/evidence
   - Scope proof: Grep for `beginMaintenance` under `mcp_server/tests` found direct marker-module tests only; no retry-manager integration assertion names the marker boundary.
   - Affected surface hints: background embedding queue, maintenance marker guard, retry-manager tests
   - Recommendation: Add a focused retry-manager test that redirects `DATABASE_DIR` to a temp dir, runs an empty queue tick, and asserts `.maintenance-active.json` is absent; optionally add a busy-queue case that observes a marker during processing.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/spec.md:131-139`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:58-85`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1513-1551`; `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1055` | Core implementation matches the reference-counted marker and queue timing requirements. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/tasks.md:63-65`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/implementation-summary.md:86-93` | Level 1 packet has no checklist.md; this lineage did not rerun build/test/deploy commands. |

## Integration Evidence

- `beginMaintenance(label)` increments active count, writes the marker, starts a 20s refresh, and returns idempotent `refresh()` / `end()` operations. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:58-85]
- The scan path creates an `index_scan` holder before `runIndexScan`, refreshes it at phase boundaries, and ends it in `finally`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1513-1551]
- The embedding queue checks `stats.queue_size === 0` before calling `beginMaintenance('embedding-queue')`, and always ends the handle in `finally`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1055]
- The marker lifecycle test covers overlapping scan and embedding-queue holders, removal only at the last end, idempotent end, reset cleanup, and same-label holders. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:82-190]

## Edge Cases

- Code graph status was stale; exact Grep and direct Read evidence were used instead of stale structural graph claims.
- `memory_context` rejected the inherited fan-out session with `E_SESSION_SCOPE`; packet docs were used as canonical continuity.
- No P0/P1 claim-adjudication packet is required because this iteration introduced no P0/P1 findings.

## Confirmed-Clean Surfaces

- Same-process overlap is reference-counted: the marker remains while one of multiple holders is active and is removed only after the last holder ends. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:58-85] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:82-108]
- Same-label overlap does not remove the marker after the first same-label holder ends. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:173-188]
- Idle embedding queue ticks return before `beginMaintenance`, so the implementation itself does not write a marker for an empty queue. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1038]

## Ruled Out

- P0/P1 reference-count clobbering in the in-process scan plus embedding queue overlap: ruled out by activeCount removal only at zero and by overlapping-holder tests.
- P0/P1 scan holder leak on normal scan terminal paths: ruled out by `maintenance.end()` in the scan `finally` block.
- P0/P1 embedding holder leak on normal embedding terminal paths: ruled out by optional `maintenanceHandle?.end()` in the embedding `finally` block.

## Assessment

- Dimensions addressed: correctness
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 1.00
- Novelty justification: one new P2 test-coverage advisory; no active P0/P1 correctness defect found.
- Iteration verdict basis: P2-only findings map to `Review verdict: PASS` for this iteration.

## Next Focus

- Dimension: security
- Focus area: stale marker and marker-write failure modes, launcher adoption assumptions, and any cross-process marker ownership edge cases.
- Reason: this one-iteration lineage stopped at `maxIterations=1` after correctness coverage only.

Review verdict: PASS
