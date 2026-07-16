# Review Report: 021-cooperative-heavy-phases

## Executive Summary

- **Verdict**: CONDITIONAL
- **Active findings**: P0=0 | P1=1 | P2=0
- **hasAdvisories**: false
- **Scope**: Spec-folder review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases` and its referenced implementation files.
- **Stop reason**: maxIterationsReached (config.maxIterations = 1)
- **Dimension coverage**: correctness (covered), traceability (covered), security (not covered), maintainability (not covered)

The single iteration focused on correctness and the `spec_code` traceability protocol. It found one P1 spec-alignment gap: the empty-files early-return branch in `memory-index.ts` runs the four un-yielded tail phases without the `timedPhase` wrapper, so those phases do not refresh the maintenance marker on entry. The trigger-backfill chunking and cancel/yield behavior otherwise align with the spec.

## Planning Trigger

The CONDITIONAL verdict routes to `/speckit:plan` to remediate F001. The fix should wrap the four tail-phase calls in the empty-files branch with the same `timedPhase` helper used in the non-empty branch, or refactor both branches to share a common tail-phase sequence.

## Active Finding Registry

### F001 — Empty-files scan branch omits timedPhase marker refresh for tail phases

- **Severity**: P1
- **Dimension**: correctness
- **Status**: active
- **File**: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- **Line**: 788
- **Evidence**:
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-790` — empty-files branch calls `runGlobalOrphanSweep`, `runPostInsertEnrichmentRepairBackfill`, and `runNearDuplicateRepairBackfill` directly.
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:802` — empty-files branch calls `runTriggerEmbeddingBackfill` directly.
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1239-1261` — non-empty branch correctly wraps all four phases in `timedPhase`.
- **Description**: The empty-files early-return branch in `runIndexScan` executes the same four un-yielded tail phases as the non-empty branch but does not wrap them in `timedPhase`. Because `timedPhase` fires `ctx.onPhase`, which the background runner maps to `maintenance.refresh()`, the marker is not refreshed per tail phase in this branch. This contradicts REQ-003, which requires every un-yielded tail phase to enter via `timedPhase` so that a bounded block never outlives the 180s TTL.

## Remediation Workstreams

1. **Unify tail-phase execution** (finding F001)
   - Refactor `memory-index.ts` so both the empty-files and non-empty branches execute the four tail phases through the same `timedPhase`-wrapped helper.
   - Alternatively, move the `timedPhase` definition above the empty-files branch and wrap the four calls at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-802`.
   - Verify with the existing scan-job suite and daemon-reelection adoption harness.

## Spec Seed

- REQ-003 should explicitly state that the tail-phase `timedPhase` wrapper applies to all scan paths that execute those phases, including the empty-files early-return branch.

## Plan Seed

- Task P1.1: Refactor `runIndexScan` in `memory-index.ts` so the empty-files branch reuses the `timedPhase`-wrapped tail-phase sequence.
- Task P1.2: Add a scan-job test case that exercises the empty-files background path and asserts `onPhase` is called for each tail phase.
- Task P1.3: Re-run typecheck, scan-job suite, and daemon-reelection adoption harness.

## Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | partial | F001: empty-files branch does not use `timedPhase` |
| checklist_evidence | core | N/A | No `checklist.md` present in this Level 1 spec folder |
| feature_catalog_code | overlay | not covered | — |
| playbook_capability | overlay | not covered | — |

## Deferred Items

- Security dimension review deferred due to maxIterations=1.
- Maintainability dimension review deferred due to maxIterations=1.
- Overlay traceability protocols (`feature_catalog_code`, `playbook_capability`) deferred.
- Verification that implementation-summary test claims match actual CI output deferred.

## Audit Appendix

### Iteration summary

| Iteration | Focus | Status | newFindingsRatio | P0 | P1 | P2 |
|-----------|-------|--------|------------------|----|----|----|
| 1 | correctness | complete | 1.00 | 0 | 1 | 0 |

### Convergence replay

- Max iterations reached after 1 iteration.
- Composite convergence not evaluated because the hard iteration cap stopped the loop.
- Legal-stop gate bundle not evaluated because the loop terminated on `maxIterationsReached`.

### File coverage

| File | Reviewed |
|------|----------|
| spec.md | yes |
| plan.md | yes |
| tasks.md | yes |
| implementation-summary.md | yes |
| mcp_server/handlers/memory-index.ts | yes |
| mcp_server/lib/search/trigger-embedding-backfill.ts | yes |
| mcp_server/tests/trigger-embedding-backfill.vitest.ts | yes |

### Dimension breakdown

- correctness: examined, one active P1 finding
- traceability: `spec_code` executed, partial result
- security: not examined
- maintainability: not examined
