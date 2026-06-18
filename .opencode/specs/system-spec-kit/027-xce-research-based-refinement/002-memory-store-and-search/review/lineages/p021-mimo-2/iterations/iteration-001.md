# Iteration 1: Correctness

## Focus
D1: Correctness — Review of the event-loop lag sampler, timedPhase wrapper, trigger-embedding-backfill chunking, isCancelled threading, and unit tests.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

### P2, Suggestion

- **F001**: Lag sampler expectedAt drift can accumulate rounding error, `memory-index.ts:512-516`, The lag sampler resets `loopLagExpectedAt = sampledAt + LOOP_LAG_SAMPLE_MS` on each tick. If a tick fires slightly late (e.g., due to GC pause), the next expectedAt is anchored to the late sample time rather than the ideal cadence. This means a single GC pause of 50ms would inflate the *next* lag measurement by 50ms as well, since the expected time is now 50ms behind the ideal schedule. In practice this is self-correcting after one tick and the max lag tracking is still meaningful, but it slightly overstates lag for the tick *after* a block. The implementation-summary reports 634ms max lag; the true block may have been ~584ms with ~50ms accumulated drift. Severity: P2 — the overstatement is bounded and conservative (reports worse than actual), so it does not mask a real block.

- **F002**: `timedPhase` logs elapsed wall-clock but not whether the phase exceeded the 180s marker TTL, `memory-index.ts:1226-1237`, The `timedPhase` wrapper logs `phase=<label> ms=<elapsed>` and fires `ctx.onPhase` (which refreshes the marker), but it does not check whether the elapsed time exceeded the 180s TTL. If a phase *did* block for >180s, the log line exists to detect it, but there is no WARN-level annotation or structured alert. A deploy-time operator must manually correlate `phase=... ms=...` against the known 180s TTL. Severity: P2 — the raw data is present for diagnosis; a structured warning would be a convenience improvement.

- **F003**: Embedding loop cache-hit yield uses modulo-50 but does not check `isCancelled` at the yield point, `trigger-embedding-backfill.ts:282-284`, The cache-hit fast path yields every 50 iterations via `if (++processedSinceYield % 50 === 0) { await setImmediate }`, and the `isCancelled` check is at the top of the loop (line 275). This means if cancellation is requested *during* a burst of 50 cache hits, the loop processes up to 49 extra rows before the next cancel check. With the default limit of 100 pending rows, this means at most 49 extra cache-hit fast-path iterations (each doing a DB lookup + status update) before cancellation takes effect. Severity: P2 — the extra work is bounded and non-destructive (cache hits are read-heavy, status updates are idempotent).

## Cross-Reference Results

### spec_code

| Claim | Evidence | Status |
|-------|----------|--------|
| REQ-001: scan distinguishes true event-loop block from slow-but-cooperative work | `memory-index.ts:501-526` (lag sampler gated on `ctx.onPhase`), `memory-index.ts:1226-1237` (timedPhase per tail phase) | PASS |
| REQ-002: trigger-backfill transaction can never block the loop | `trigger-embedding-backfill.ts:169-259` (chunk loop with between-chunk yields, isCancelled at boundary) | PASS |
| REQ-003: each un-yielded tail phase carries a full marker TTL | `memory-index.ts:1226-1237` (timedPhase fires `ctx.onPhase` which calls `maintenance.refresh()`), lines 1239-1261 wrap all four tail phases | PASS |
| REQ-004: launcher root-cause resolved | Spec states launcher path confirmed correct; no launcher code in scope | PASS (advisory) |
| Spec claim: synchronous foreground path is byte-identical | `memory-index.ts:501` (`const instrument = typeof ctx.onPhase === 'function'`), all instrumentation gated on `instrument` | PASS |
| Spec claim: chunk transactions are never inside a database.transaction() | `trigger-embedding-backfill.ts:169-245` (syncPhraseChunk is a transaction), `trigger-embedding-backfill.ts:247-259` (yields BETWEEN chunk calls, never inside) | PASS |

### checklist_evidence

No checklist.md exists in this Level 1 spec folder. Skipping.

## Assessment
- New findings ratio: 0.0 (all P2, no P0/P1)
- Dimensions addressed: correctness
- Novelty justification: 3 new P2 findings, all advisory. No correctness defects found in the core chunking/yielding logic. The implementation correctly separates per-chunk atomicity from whole-corpus atomicity, yields between transactions (never inside), threads isCancelled through all code paths, and refreshes the marker per tail phase.

## Ruled Out
- Race between isCancelled and syncPhraseChunk: Ruled out. The cancel check at line 248-252 runs BEFORE the chunk transaction starts. A cancel arriving during a chunk transaction is deferred to the next boundary — correct behavior, as interrupting mid-transaction would corrupt the chunk.
- Marker TTL exhaustion during a single tail phase: Ruled out. The orphan sweep is bounded to 200 rows, enrichment-repair processes BATCH_SIZE rows with out-of-process HTTP embeddings, trigger-backfill yields between chunks, and near-dup-repair processes BATCH_SIZE rows with out-of-process embeddings. None should approach 180s on a healthy deployment.

## Dead Ends
(none)

## Recommended Next Focus
With maxIterations=1, no further iterations are warranted. The correctness dimension shows clean implementation with only P2 advisory findings. Synthesis should proceed.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "Lag sampler expectedAt drift can accumulate rounding error, slightly overstating lag for the tick after a block.",
  "evidenceRefs": [
    "memory-index.ts:512-516"
  ],
  "counterevidenceSought": "Checked whether expectedAt resets to an absolute cadence (it does not); verified the self-correcting behavior after one tick; confirmed max lag tracking is still meaningful despite the accumulation.",
  "alternativeExplanation": "Could be intentional design — anchoring to sampledAt provides jitter-tolerant measurement rather than wall-clock cadence, which may be preferable for detecting blocks in the presence of normal timer jitter.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "If the implementation switches to an absolute cadence (e.g., expectedAt += SAMPLE_MS without reset), the drift issue disappears entirely.",
  "transitions": []
}
```

```json
{
  "findingId": "F002",
  "claim": "timedPhase logs elapsed wall-clock but does not annotate when a phase exceeds the 180s marker TTL.",
  "evidenceRefs": [
    "memory-index.ts:1226-1237"
  ],
  "counterevidenceSought": "Checked whether any downstream consumer (dashboard, job-store, health check) parses the phase= log for TTL violations — none do; the log is plain-text only.",
  "alternativeExplanation": "Could be intentional — the log is raw telemetry and the deploy-time operator is expected to set their own alerting threshold. Adding a structured warning might create noise if the TTL is ever changed.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "If a structured observability hook is added to timedPhase (e.g., emitting to the job-store or a metrics system), this finding becomes resolved.",
  "transitions": []
}
```

```json
{
  "findingId": "F003",
  "claim": "Embedding loop cache-hit yield checks isCancelled at loop top but not at the yield point, allowing up to 49 extra cache-hit iterations after cancellation.",
  "evidenceRefs": [
    "trigger-embedding-backfill.ts:274-284"
  ],
  "counterevidenceSought": "Checked whether the extra iterations could cause data corruption (no — cache hits are read-heavy, status updates are idempotent ON CONFLICT); checked whether the 49-row bound is tight (yes, modulo-50 is the worst case).",
  "alternativeExplanation": "Could be intentional optimization — the cancel check has a cost (function call + boolean evaluation) and placing it at every iteration would slow the fast path. The current design amortizes the check cost.",
  "finalSeverity": "P2",
  "confidence": 0.90,
  "downgradeTrigger": "If the cancel check is added to the yield point (line 283), this finding is resolved. The performance impact of an extra boolean check per iteration is negligible.",
  "transitions": []
}
```

Review verdict: PASS
