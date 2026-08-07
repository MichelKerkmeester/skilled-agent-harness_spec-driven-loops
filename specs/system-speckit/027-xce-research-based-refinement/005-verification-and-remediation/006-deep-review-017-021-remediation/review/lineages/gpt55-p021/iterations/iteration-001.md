# Iteration 1: Correctness

## Focus
Dimension: correctness. Scope: verify whether the packet's daemon-responsiveness claims are backed by the implementation paths for scan instrumentation, trigger-backfill chunking/cancellation, marker refresh, and launcher adoption.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 10
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Trigger backfill still has an unbounded synchronous pre-chunk SELECT. REQ-002 says the trigger backfill can never block the loop, but `runTriggerEmbeddingBackfill()` first loads every eligible row with `database.prepare(...).all()` before reaching the first cancellation check or chunk-yield boundary [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:132-134] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:173-180] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:262-278]. The transaction body is chunked, but the pre-chunk source read remains corpus-sized synchronous work and is not cancellable until after the read returns.

#### Claim Adjudication Packet F001
```json
{
  "findingId": "F001",
  "claim": "Trigger backfill still performs an unbounded synchronous full-corpus SELECT before its first cancellation/yield boundary, so REQ-002's never-block/cancellable claim is not fully satisfied.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:132-134",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:173-180",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:262-278"
  ],
  "counterevidenceSought": "Reviewed the subsequent phrase-sync chunk loop, cache-hit yield path, cancellation tests, timedPhase scan wiring, and launcher marker-adoption code. The write transaction is chunked and the launcher behavior is correct, but no pagination or cancellation check exists before sourceRows = ...all().",
  "alternativeExplanation": "The current corpus may be small enough that the SELECT is fast in practice, and the spec text names the whole-corpus transaction specifically. That does not fully satisfy the stronger acceptance wording that the trigger backfill can never block the loop when enabled.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade or close if the source-row read is paginated/limited with cancellation and yield boundaries, or if a documented hard cap plus regression test proves the SELECT cannot materially block the event loop.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery during correctness review."
    }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:132-134`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:173-180` | One sampled normative claim remains partially unmet: trigger-backfill cancellation/yield does not cover the initial full-corpus SELECT. |
| checklist_evidence | partial | hard | target directory has no `checklist.md` | No checklist marks are available to validate in this Level 1 packet. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: the finding identifies a remaining pre-chunk synchronous operation not covered by the packet's chunk-transaction tests.

## Ruled Out
- Launcher root cause: `respawnAfterDeadSocket()` checks a fresh maintenance marker before respawn [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:814-824], and stale reclaim adopts a live child with a fresh marker before reaping [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1685-1694].
- Missing tail-phase marker refresh: `timedPhase()` calls `ctx.onPhase?.(phase)` before running the phase [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:786-800], and background `onPhase` refreshes maintenance before setting the job phase [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1518-1523].
- Missing chunk/cancel test coverage for the transaction itself: the unit tests cover immediate cancellation, chunk-boundary cancellation with exactly 200 rows, and cooperative yielding for multi-chunk runs [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts:155-224].

## Dead Ends
- No second finding recorded for event-loop lag logging. The sampler and phase timer are present, and the residual final-sample edge case is not enough to assert a defect without runtime evidence in this one-pass lineage.

## Recommended Next Focus
Security/cancellation robustness: determine whether a paginated `SELECT id > cursor LIMIT 200` source-row sync is needed to remove the remaining synchronous corpus-sized read and add a cancellation regression that proves cancellation can interrupt before scanning the whole source set.
Review verdict: CONDITIONAL
