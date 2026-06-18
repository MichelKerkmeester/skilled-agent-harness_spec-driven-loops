# Iteration 1: Full-surface review (correctness + security + traceability + maintainability)

## Focus
Single-pass review of packet 021's entire change surface (commit `372bb0f2cd`):
- `mcp_server/handlers/memory-index.ts` — event-loop lag sampler, `timedPhase` wrapper, two tail-phase execution paths, `isCancelled` threading.
- `mcp_server/lib/search/trigger-embedding-backfill.ts` — whole-corpus transaction chunking, between-chunk yield, cancel checks, `cancelled` status.
- `mcp_server/tests/trigger-embedding-backfill.vitest.ts` — 3 new cancel/yield cases.
Evaluated against REQ-001..REQ-004 and SC-001/SC-002.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.30

## Findings

### P0, Blocker
- (none)

### P1, Required
- **F001**: REQ-001/REQ-003 acceptance criteria are not met on the `files.length === 0` scan path, `mcp_server/handlers/memory-index.ts:788-804`. `runIndexScan` has two tail-phase execution paths. The main path (`memory-index.ts:1239-1261`) wraps all four tail phases — orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair — in `timedPhase` (`memory-index.ts:1226`), which both logs `phase=<name> ms=` (REQ-001 per-phase wall-clock) and fires `ctx.onPhase` → `maintenance.refresh()` (REQ-003 per-tail-phase marker refresh, wiring at `memory-index.ts:1507-1512`). The early-return `files.length === 0` path runs the **same four phases** (`runGlobalOrphanSweep()` :788, `runPostInsertEnrichmentRepairBackfill()` :789, `runNearDuplicateRepairBackfill()` :790, `runTriggerEmbeddingBackfill(...)` :802) as bare calls — **no `timedPhase`, no per-phase wall-clock line, no per-phase marker refresh**. This is the common incremental-no-change background scan path (most periodic scans find no changed files), and it is reached on the background/job path that holds the marker (`memory-index.ts:1496-1514`). REQ-003's acceptance criteria literally enumerates these four phases entering via `timedPhase`; the empty-files path violates that. REQ-001's per-phase attribution is also absent there, so a lag spike on a no-change scan cannot be attributed to a phase.
  - Mitigating: the event-loop **lag sampler** (`loopLagTimer`, started at :507 inside the shared `try` before the :785 branch) DOES cover the empty path, so `max-event-loop-lag` / `event-loop blocked` still fire. The empty-path phases are also bounded/cooperative (orphan-sweep 200 rows; enrichment/near-dup are LIMIT-5 awaiting out-of-process embeddings; trigger-backfill off by default and chunk-yields when on), and the marker's 20s self-refresh timer fires during their yields — so a demonstrated TTL-exceeding block on this path is not shown. That is why this is P1, not P0. But the shipped code does not satisfy the REQ-001/REQ-003 acceptance criteria for all reachable paths, and the implementation-summary's claim "each un-yielded tail phase refreshes the marker on entry" is not true for the `files.length === 0` path.

### P2, Suggestion
- **F002**: "byte-identical synchronous foreground path" is overstated, `spec.md:105` vs `mcp_server/handlers/memory-index.ts:1239`. `orphan-sweep` changed from a synchronous `runGlobalOrphanSweep()` to `await timedPhase('orphan-sweep', () => runGlobalOrphanSweep())`. Even when `instrument` is false, `timedPhase` is `async`, so the foreground path now crosses one extra microtask boundary at orphan-sweep. This does not yield the macrotask/IO loop, so responsiveness is unaffected — but "byte-identical" is inaccurate. The other three phases were already `await`ed pre-change. Doc-accuracy nit.
- **F003**: `result.pendingRemaining` is not recomputed on cancel-during-embedding, `mcp_server/lib/search/trigger-embedding-backfill.ts:275-279`. When the run cancels inside the embedding loop, phrase-sync has already populated `pending` rows in the DB, but the early `return result` leaves `result.pendingRemaining` at its `emptyResult` default of `0`. A consumer that reads `pendingRemaining` on a `cancelled` result would understate the remaining backlog. Low impact (status `cancelled` signals an incomplete run), but the count is silently wrong.
- **F004**: duplicated `isCancelled` thunk, `mcp_server/handlers/memory-index.ts:803` and `:1257`. Both trigger-backfill call sites inline `isCancelled: () => ctx.isCancelled?.() ?? false`. Minor DRY; a shared local thunk would keep the two paths from drifting (and is adjacent to the F001 path divergence).

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "The files.length === 0 scan path runs the four tail phases without timedPhase, so it provides neither REQ-001 per-phase wall-clock nor REQ-003 per-tail-phase marker refresh, contradicting REQ-003's acceptance criteria and the implementation-summary claim.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-804",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1239-1261",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1226-1237",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1507-1512"
  ],
  "counterevidenceSought": "Re-read the empty-files branch (:785-831) to confirm no timedPhase or onPhase call wraps the four phases there; confirmed the lag sampler (loopLagTimer, :503-519) starts before the :785 branch so lag (but not per-phase attribution) still covers the empty path; confirmed onPhase has exactly one wiring site (:1507) that calls maintenance.refresh(); checked the spec In-Scope (:106) and REQ-003 AC (:139) which enumerate the four phases entering via timedPhase without restricting to files.length>0.",
  "alternativeExplanation": "The empty-files path's phases are bounded (orphan 200 rows) or cooperative (LIMIT-5 out-of-process embeddings; trigger-backfill off/chunked), and the 20s marker self-refresh timer fires during their yields, so a TTL-exceeding marker-staleness block on this path may be impossible in practice — making the gap a literal-AC/diagnostic-completeness gap rather than a live correctness defect. Accepted as the reason this is P1 (incomplete implementation), not P0.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to P2 if the empty-files tail phases are proven to always run sub-180s-TTL AND per-phase lag attribution is deemed unnecessary for no-change scans (the deploy-time read is a force reindex, which takes the instrumented files.length>0 path). Resolve to P0-adjacent only if a real no-change-scan block is observed.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: AC enumerates four phases via timedPhase; empty-files path omits them." }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | memory-index.ts:788-804 vs spec.md:139 (REQ-003 AC) | REQ-002 (chunk/cancel) and REQ-004 (no launcher change) fully satisfied; REQ-001/REQ-003 satisfied on files.length>0 path only |
| checklist_evidence | n/a | hard | implementation-summary.md:88-97 | Level 1 packet, no checklist.md; verification table present and self-consistent |
| feature_catalog_code | n/a | advisory | — | internal daemon hardening, no catalog claim |

### REQ traceability
- REQ-001 (lag sampler + per-phase wall-clock, gated on onPhase): PARTIAL — lag sampler global (:503-519, :1474-1479); per-phase wall-clock only on files.length>0 path (F001).
- REQ-002 (chunk transaction, yield between chunks, isCancelled→cancelled, cache-hit yield): PASS — trigger-embedding-backfill.ts:247-259 (chunk+yield outside transaction), :248-252 (cancel→cancelled), :273-284 (cache-hit-path yield + cancel). Yield is strictly between self-contained chunk transactions (:253 then :258), never inside `database.transaction()`.
- REQ-003 (each un-yielded tail phase refreshes marker on entry): PARTIAL — true on files.length>0 path (:1239-1261 via :1510); not on files.length===0 path (F001).
- REQ-004 (launcher adopt/reap confirmed correct, no change): PASS — read-only investigation recorded; no launcher diff in commit 372bb0f2cd (verified via `git show --stat`).

## Assessment
- New findings ratio: 0.30 (1 P1 + 3 P2 across a small, well-scoped surface).
- Dimensions addressed: all four.
- Novelty justification: P1 is a structural path-divergence not visible in the prose/diff alone; the P2s are localized doc/consistency nits. Security pass found no new trust boundary (no external input, hashing unchanged, console.error logs carry no secrets).

## Ruled Out
- "Yield inside a transaction" risk (spec.md:159): NOT present — the `await setImmediate` at trigger-embedding-backfill.ts:258 is between `syncPhraseChunk(...)` calls, outside `database.transaction()`. Risk correctly mitigated.
- Partial-commit corruption on mid-sync cancel: idempotent `ON CONFLICT DO UPDATE` upserts (:182) + per-memory-id deletes (:208-226) make a partial chunk-boundary cancel reconcilable on the next scan. Confirmed safe.
- Test correctness: cancel-immediate (cancelAfter(0)→0 rows), cancel-at-chunk-boundary (cancelAfter(1)→exactly 200 rows), cooperative-yield (500 rows, competing setImmediate tick advances) all logically match the implementation. Ruled out as a finding source.

## Dead Ends
- Searching for a second `onPhase` wiring outside memory-index.ts: none exists (grep returned only the in-file site). The mechanism is self-contained.

## Recommended Next Focus
Adjudicate F001: either wrap the `files.length === 0` tail phases in `timedPhase` (one-line-each change mirroring :1239-1261) so REQ-001/REQ-003 hold on all paths, or record an explicit scope decision that the empty-files path is exempt because its phases are provably sub-TTL and the deploy-time diagnostic uses the force-reindex (files>0) path.

Review verdict: CONDITIONAL
