# Iteration 001: Correctness Pass

## Focus

Reviewed the 020 packet's correctness-critical implementation path: shared maintenance marker lifecycle, background scan wiring, embedding queue marker acquisition/release, and the nearby unit/suite coverage. The target files were read-only.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 11
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.10

## Findings

### P0, Blocker

- None.

### P1, Required

- None.

### P2, Suggestion

- **F001**: Add direct retry-manager marker regression coverage, `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1036-1055`, `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-674`, `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:82-109`. The production path begins `beginMaintenance('embedding-queue')` after the queue-size guard and releases it in `finally`, and the marker module itself has reference-count tests. The retry-manager test that covers an empty queue asserts only the returned `queue_empty`/`processed` shape and does not assert that the marker is absent on idle ticks or present/released around a real non-empty queue tick. This leaves the spec's embedding-queue wiring behavior without a direct regression at the integration boundary, even though the implementation currently appears wired correctly.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/spec.md:102-139`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:58-87`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1507-1552`; `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1012-1055` | Correctness-critical normative claims checked for the shared module, scan holder, and embedding-queue holder. Full traceability was not completed because maxIterations=1. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/tasks.md:61-65` | Level 1 target has no `checklist.md`; task completion claims were sampled instead. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1012-1055` | Feature surface observed but not exhaustively catalog-audited in one iteration. |
| playbook_capability | partial | advisory | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/implementation-summary.md:83-94` | Deploy verification claim was read, not re-run in this lineage. |

## Assessment

- New findings ratio: 0.10
- Dimensions addressed: correctness
- Novelty justification: one low-severity integration-test gap; no confirmed P0/P1 behavior defect in the reviewed code path.
- Production evidence: `beginMaintenance` writes the marker, increments active holder state, starts a refresh timer, and removes the marker only at zero active holders (`maintenance-marker.ts:58-87`). The background scan holder starts before `runIndexScan` and ends in the IIFE `finally` (`memory-index.ts:1507-1552`). The retry-manager holder starts after the queue-size empty guard and ends in `finally` (`retry-manager.ts:1032-1055`).

## Ruled Out

- Reference-count clobbering as an active defect: the marker module decrements active count, removes only at zero, and the test verifies two overlapping holders keep the file present until the last holder ends [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:72-85`; `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:82-109`].
- Scan holder leak as an active defect: the background scan IIFE releases its holder in `finally`, covering complete, cancelled, failed, and thrown exits [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1547-1552`].
- Embedding queue holder leak as an active defect: `maintenanceHandle?.end()` runs in `finally` and the empty-queue path never creates a handle [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1022-1055`].

## Dead Ends

- Structural code-graph traversal: readiness was stale (`git HEAD changed: 8b9ff540 -> cf2e49b2; 442 stale files exceed selective threshold (50)`), so exact Grep plus direct reads were used instead.

## Recommended Next Focus

If another iteration is run, prioritize traceability: reconcile the full verification claims in `implementation-summary.md` against concrete test command artifacts and determine whether direct retry-manager marker integration coverage should be required or accepted as advisory.

Review verdict: PASS
