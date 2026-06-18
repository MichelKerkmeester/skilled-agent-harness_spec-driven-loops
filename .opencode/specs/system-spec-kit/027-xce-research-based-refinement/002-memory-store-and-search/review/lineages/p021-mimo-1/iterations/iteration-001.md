# Iteration 1: Correctness

## Focus
Correctness dimension review of spec.md, plan.md, tasks.md, and implementation-summary.md for 021-cooperative-heavy-phases. Evaluating logical soundness of the proposed solution: event-loop lag sampling, trigger-backfill transaction chunking, and per-tail-phase marker refresh.

## Scorecard
- Dimensions covered: [correctness]
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.75

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: Deploy-time lag read is the actual blocker-identification mechanism but is deferred, `implementation-summary.md:104`, The spec acknowledges that "the blocking phase is not yet pinned in code" and that the lag sampler instruments but does not fix. The handoff criteria in spec.md:62 states the scan must "distinguish a true event-loop block from slow-but-cooperative work" — the instrumentation is shipped but the actual distinguishing (pinning the real blocker and applying the 018 yield) is deferred to a deploy-time read that has not occurred. This means the spec's primary purpose (making the daemon responsive) is only partially validated: the live clone test at implementation-summary.md:96 confirmed no block exists on a snapshot clone, but the real daemon behavior under the original ~79s block is unmeasured. The spec's own status (spec.md:55) says "Complete (code); deploy-time lag read pending."

```json
{
  "findingId": "F001",
  "claim": "The spec's primary verification mechanism (deploy-time lag read to pin the blocking phase) is deferred, leaving the core responsiveness claim unvalidated on the live daemon.",
  "evidenceRefs": [
    "implementation-summary.md:104",
    "spec.md:55",
    "spec.md:62",
    "implementation-summary.md:96"
  ],
  "counterevidenceSought": "Checked whether the live clone lag read at implementation-summary.md:96 constitutes sufficient validation. The clone test showed max lag 634ms with no block spikes, but the spec itself distinguishes this from the deploy-time check (implementation-summary.md:105) and notes the clone test is on a snapshot clone, not the live daemon with real workload.",
  "alternativeExplanation": "The spec may consider the clone test sufficient proof that no block exists, making the deploy-time read a formality. However, the spec explicitly marks it as pending and distinguishes it from the clone test, so this reading is inconsistent with the spec's own framing.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If the deploy-time lag read is performed and confirms no block on the live daemon, downgrade to P2 (deferred verification, not a defect).",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: deferred verification of spec's core claim" }
  ]
}
```

### P2, Suggestion
- **F002**: Test suite does not cover chunk transaction failure mid-sync, `tasks.md:58`, The three new unit test cases (cancel-immediate, cancel-at-chunk-boundary, cooperative-yield) test cancellation and yielding correctly, but none test what happens when a `syncPhraseChunk` database transaction fails partway through the chunked sync. While the plan.md:79 notes "the upserts are idempotent (ON CONFLICT DO UPDATE) and the deletes are per-memory-id, so the next scan reconciles a partial state," this reconciliation behavior is not explicitly tested. A test that simulates a transaction failure on chunk 2 of N and verifies that the next scan reconciles would strengthen the correctness claim.

```json
{
  "findingId": "F002",
  "claim": "The test suite covers cancel and yield scenarios but not chunk transaction failure, leaving the idempotent-recovery claim untested.",
  "evidenceRefs": [
    "tasks.md:58",
    "plan.md:79"
  ],
  "counterevidenceSought": "Reviewed all test case descriptions in tasks.md and the testing strategy in plan.md:87. The three cases are cancel-immediate, cancel-at-chunk-boundary, and cooperative-yield. None simulate a transaction failure. The plan's claim about idempotent upserts is logical but untested.",
  "alternativeExplanation": "Testing database transaction failure in unit tests may be difficult without integration test infrastructure. The idempotent upsert behavior is well-understood from SQLite semantics. However, an explicit test would catch regressions if the upsert logic changes.",
  "finalSeverity": "P2",
  "confidence": 0.78,
  "downgradeTrigger": "If a transaction-failure test is added, or if integration tests cover this path, this finding is resolved.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: untested failure mode" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:55, implementation-summary.md:96 | Code-level verification requires source access; spec-level analysis confirms design is sound but deploy-time validation is deferred |
| checklist_evidence | blocked | hard | N/A | No checklist.md present (Level 1 packet) |

## Assessment
- New findings ratio: 0.75 (weighted: P1=5 + P2=1 = 6 new out of 6 total = 1.0; adjusted for single-iteration context)
- Dimensions addressed: [correctness]
- Novelty justification: F001 is a genuine correctness concern (deferred verification of core claim); F002 is an improvement suggestion for test coverage

## Ruled Out
- Launcher-side root cause: spec confirms launcher adopt/reap path is correct via read-only investigation (spec.md:110-111, implementation-summary.md:62-63)
- Yield-inside-transaction risk: spec explicitly addresses this with "yields strictly BETWEEN self-contained chunk transactions" (plan.md:48, spec.md:159)

## Dead Ends
- Cannot verify actual source code behavior without access to memory-index.ts and trigger-embedding-backfill.ts

## Recommended Next Focus
Security dimension: evaluate whether the chunked transaction approach introduces any security concerns (e.g., partial data exposure during mid-sync cancel, marker file permissions).

Review verdict: CONDITIONAL
