# Deep Review Strategy: 021-cooperative-heavy-phases

## Topic

Review of 021-cooperative-heavy-phases: daemon responsiveness through reindex heavy phases.

## Review Dimensions

- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

## Completed Dimensions

- [x] correctness — Iteration 001; one active P1 finding (F001)
- [x] traceability — Iteration 001; spec_code protocol executed, status partial
- [ ] security — not covered
- [ ] maintainability — not covered

## Running Findings

P0: 0 | P1: 1 | P2: 0

### Active

- F001 (P1, correctness): Empty-files scan branch omits timedPhase marker refresh for tail phases

## What Worked

- Direct file reading against spec claims quickly identified a spec-code gap in the empty-files branch.
- The trigger-backfill chunking and cancel/yield unit tests align with the plan and spec.

## What Failed

- None.

## Exhausted Approaches

- None.

## Ruled Out Directions

- Trigger-backfill transaction corruption (yields between transactions, not inside).
- Foreground path regression (instrumentation gated on ctx.onPhase).

## Next Focus

No further iterations available (maxIterations = 1 reached). Proceed to synthesis.

## Known Context

- Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases
- resource-map.md not present. Skipping coverage gate.
- Implementation summary reports typecheck clean, trigger-backfill unit tests 6/6 passing, scan-job suite passing, daemon-reelection adoption harness 6/6 passing.

## Cross-Reference Status

### Core Protocols

- spec_code: partial — F001 documents a missing timedPhase wrapper in the empty-files branch
- checklist_evidence: N/A — no checklist.md in this Level 1 spec folder

### Overlay Protocols

- feature_catalog_code: not covered
- playbook_capability: not covered

## Files Under Review

| File | Status | Notes |
|------|--------|-------|
| spec.md | reviewed | Requirements and success criteria documented |
| plan.md | reviewed | Architecture and phases documented |
| tasks.md | reviewed | Tasks mapped to files |
| implementation-summary.md | reviewed | Verification evidence recorded |
| mcp_server/handlers/memory-index.ts | reviewed | Lag sampler and timedPhase verified; F001 filed |
| mcp_server/lib/search/trigger-embedding-backfill.ts | reviewed | Chunked transaction and cancel/yield look correct |
| mcp_server/tests/trigger-embedding-backfill.vitest.ts | reviewed | Cancel/yield cases present |

## Review Boundaries

- Max iterations: 1
- Convergence threshold: 0.10
- Severity threshold: P2
- Target files read-only; no code changes during review.
