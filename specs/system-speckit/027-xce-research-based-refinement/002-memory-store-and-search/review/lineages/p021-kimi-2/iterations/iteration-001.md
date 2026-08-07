# Iteration 001: Correctness — tail-phase marker refresh and chunking behavior

## Focus

- Dimension: correctness (with traceability cross-check of spec_code)
- Files reviewed:
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts`
- Scope: Verify that the event-loop lag sampler, `timedPhase` wrapper, and trigger-backfill chunking match the spec and do not introduce regressions.

## Scorecard

- Dimensions covered: correctness, traceability (spec_code protocol)
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required

- **F001**: Empty-files scan branch runs the four un-yielded tail phases without `timedPhase`, so they do not refresh the maintenance marker on entry. `[SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-790,802]`
  - The spec (REQ-003) states that orphan-sweep, enrichment-repair, trigger-backfill, and near-dup-repair must each enter via `timedPhase`, which fires `ctx.onPhase` and refreshes the marker. The non-empty branch does this correctly at `memory-index.ts:1239-1261`, but the early-return empty-files branch at `memory-index.ts:785-883` calls the same four phases directly (`runGlobalOrphanSweep`, `runPostInsertEnrichmentRepairBackfill`, `runNearDuplicateRepairBackfill`, `runTriggerEmbeddingBackfill`) without wrapping them in `timedPhase`. This leaves a background scan that finds no indexable files with no per-tail-phase marker refresh, weakening the 180s TTL guarantee in that branch.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | memory-index.ts:788-790,802 vs. memory-index.ts:1239-1261 | REQ-003 claims all four tail phases enter via `timedPhase`; the empty-files branch does not. |
| checklist_evidence | N/A | hard | — | No `checklist.md` present in this Level 1 spec folder. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: One concrete spec-code gap discovered in the empty-files background path. The trigger-backfill chunking and cancel/yield unit tests appear correct and aligned with the spec.

## Ruled Out

- Trigger-backfill transaction corruption: chunking yields strictly between self-contained chunk transactions, never inside one, matching the risk mitigation in the plan.
- Foreground path regression: instrumentation is gated on `ctx.onPhase`, so the synchronous path remains unchanged.

## Dead Ends

- None.

## Recommended Next Focus

If additional iterations were available, the next focus should be the traceability dimension to verify the remaining cross-reference protocols (feature_catalog_code, playbook_capability) and the implementation-summary verification claims against test output.

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "The empty-files scan branch runs the four un-yielded tail phases without timedPhase, so they do not refresh the maintenance marker on entry.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-790",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:802",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1239-1261"
  ],
  "counterevidenceSought": "Re-read the empty-files branch (lines 785-883) and the timedPhase definition and usages (lines 1226-1261) to confirm the four tail-phase calls in the empty branch are not wrapped. Confirmed the non-empty branch wraps all four phases correctly.",
  "alternativeExplanation": "The empty-files branch might be considered a fast path where tail phases are expected to be quick; however, trigger-backfill phrase sync can still scan the whole eligible corpus and the other phases still perform bounded but non-trivial work, so the marker-refresh guarantee still matters.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If the empty-files branch is removed or the four tail phases are refactored to share the same timedPhase-wrapped call sites as the non-empty branch, downgrade to P2 (spec-alignment note) or resolve.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

Review verdict: CONDITIONAL
