# Iteration 004 — correctness / A3 (causal & relation-inference integrity)

## Dispatcher
- **Run:** 4 of 20 (parallel-agent mode — writes only `iterations/iteration-004.md` + `deltas/iter-004.jsonl`)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness | **Angle:** A3 (causal / relation-inference integrity)
- **Budget profile:** verify (target 11-13 calls; used 10 tool calls — file:line evidence rereads + P0 adjudication on conflict-guard)
- **Review target:** git range `a9e9bdb0a5^..HEAD`; focus `mcp_server/lib/causal/relation-backfill.ts` (#1 churn, 748 LOC new), `lib/graph/contradiction-detection.ts`, `handlers/causal-graph.ts`, `lib/causal/relation-coverage.ts`, `lib/storage/causal-edges.ts`.
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new, releaseReadinessState in-progress)

## Files Reviewed
- `lib/causal/relation-backfill.ts` (748/0, 100% NEW) — execute path 518-592, honest-count delta 528-575, conflict guard 661-709, `countValidAutoEdgesByRelation` 717-734, entry/defaults 351-386, dryRun 490-516, `pairKey` 234-236.
- `lib/graph/contradiction-detection.ts` (1/1 in range — essentially PRE-EXISTING) — `relationsConflict` 47-56, `CONFLICTING_RELATIONS` 38-42, `detectContradictions` 69-130.
- `handlers/causal-graph.ts` (+186) — backfill wiring 260-310 (NEW), `memory_causal_unlink` 1083-1152.
- `lib/causal/relation-coverage.ts` (12/3) — `backfillJob` block 24-31, 110-122.
- `lib/storage/causal-edges.ts` — `deleteEdge` 743-759 (NOT changed in range).

## Findings — New

### P0 Findings
None. The two charter A3 P0 hypotheses (conflict-guard invalidates valid edges incl reciprocal/3-node transitive; honest-count double-count) were both adversarially tested and DISPROVEN as P0 (see Ruled Out + Edge Cases).

### P1 Findings
None.

### P2 Findings

1. **New opt-in `contradicts` collector can create reciprocal-contradictory edge pairs the system never reconciles** — `lib/causal/relation-backfill.ts:474,675,692-709` + `lib/graph/contradiction-detection.ts:88` — The new supersession→`contradicts` collector (opt-in, `collectSupersessionEdges` 317) inserts edges via `insertNonConflictingEdges`, whose guard `hasConflictingValidEdge` (692-709) checks only `source_id=? AND target_id=?` — directional. This faithfully mirrors `detectContradictions` (query identical at line 88), so it is internally CONSISTENT, not a regression of the guard's stated contract. However, because the whole contradiction model is directional, a newly-inferred `A contradicts B` coexists with a valid `B supports A` (or `B caused A`) — a reciprocal semantic contradiction that NO code path reconciles. The directional model is pre-existing, but this new collector is the first auto path that systematically materializes such reciprocal pairs into the graph at scale, so the latent inconsistency is newly reachable. Advisory: low blast radius (collector default OFF; strength 0.3), but graph-consumers reading both directions may surface contradictory inferences.
   - Finding class: latent-inconsistency / scope-boundary advisory
   - Scope proof: collector is NEW (`relation-backfill.ts` 100% new; opt-in wiring at `causal-graph.ts:277-278` new); the directional limitation it inherits is at `contradiction-detection.ts:88` (1/1 line changed in range = pre-existing model).
   - Affected surface hints: any graph reader that treats `contradicts` as bidirectional; `detectContradictions` directional query; future reciprocal/transitive-cycle reconciliation work.
   - Claim-adjudication:
     ```json
     {
       "type": "latent-inconsistency",
       "claim": "New opt-in contradicts collector materializes reciprocal-contradictory edge pairs (A contradicts B + B supports A) that the directional contradiction model never reconciles.",
       "evidenceRefs": ["lib/causal/relation-backfill.ts:692-709 (directional guard)", "lib/graph/contradiction-detection.ts:85-89 (directional detectContradictions, 1/1 line in range = pre-existing)", "lib/causal/relation-backfill.ts:474,317 (new opt-in supersession->contradicts collector)"],
       "counterevidenceSought": "Checked whether guard or detectContradictions queries the reciprocal pair; both query only source_id=?,target_id=?. Checked pairKey (234-236) which IS order-normalized but is only used for similarity-vs-spec-chain dedup, not for conflict detection.",
       "alternativeExplanation": "Guard is correct-by-design (mirrors detectContradictions); the gap is a property of the pre-existing directional contradiction model, not the new file. This is why it is P2 advisory, not P1/P0.",
       "finalSeverity": "P2",
       "confidence": "high",
       "downgradeTrigger": "Already at floor; would be NOT-A-FINDING if the contradicts collector stayed permanently off, but it is a user-reachable opt-in."
     }
     ```

2. **`memory_causal_stats` backfill wiring applies dryRun default twice (defense-in-depth, not a defect) — verify no inversion** — `handlers/causal-graph.ts:274` + `lib/causal/relation-backfill.ts:355` — The new handler wiring passes `dryRun: backfillRequest.dryRun !== false` (274) into `backfillRelationInference`, which itself re-applies `dryRun = options.dryRun !== false` (355). Double-defaulting is harmless and fail-safe (both default TRUE; only an explicit `false` reaching BOTH layers writes), but the redundancy means the safety contract lives in two places. Advisory: keep the single source of truth in the library; the handler pre-normalization is belt-and-suspenders. No behavioral defect — `false !== false` = false at both layers, `undefined !== false` = true at both. Confirmed safe.
   - Finding class: maintainability/clarity advisory (correctness-adjacent, verified safe)
   - Scope proof: both lines are NEW in range (handler wiring 260-310 added; library file 100% new).
   - Affected surface hints: `memory_causal_stats` callers; relation-coverage `BACKFILL_COMMAND` string (relation-coverage.ts:53).

## Traceability Checks
- **Iteration number:** dispatch says ITERATION 4; JSONL has 2 `type:"iteration"` lines (iter-001, iter-002). In strict JSONL-derived serial mode this would be 3, but dispatch is explicit PARALLEL mode (iter-003 = concurrent A2 agent, not yet flushed). Honoring dispatch iteration=4 per parallel-safety contract; recorded as ambiguity edge case (see Edge Cases #4). No shared-state write performed.
- **`backfillJob.implemented` honesty (charter A7 hypothesis):** REFUTED as a defect. `relation-coverage.ts:113` reports `implemented: true`, and the backfill IS genuinely implemented (`relation-backfill.ts` 748 LOC, wired at `causal-graph.ts:273`). The value is HONEST. Charter's `implemented=false` hypothesis is stale/incorrect for current HEAD.
- **Guard mirrors its claimed reference:** `hasConflictingValidEdge` docstring (689) claims it "mirrors detectContradictions' valid-edge query." Verified TRUE — both use `source_id=? AND target_id=? AND (invalid_at IS NULL OR invalid_at = '')` (backfill 701-703 vs detection 88-89). Traceability between guard and its stated mirror is intact.
- **Range integrity:** confirmed via `git diff --numstat` that relation-backfill.ts is 748/0 (new), contradiction-detection.ts is 1/1 (pre-existing), causal-edges.ts deleteEdge path unchanged.

## Integration Evidence
- `handlers/causal-graph.ts:9,273` — confirmed the new `backfillRelationInference` import + invocation is the ONLY production caller of the new module (no other call sites found in mcp_server lib/handlers). Backfill is reachable solely through `memory_causal_stats({ backfill: ... })`. Integration surface named: `memory_causal_stats` MCP tool handler.

## Edge Cases
1. **Conflict-guard ordering (charter "in-transaction valid edges") — VERIFIED CORRECT.** The execute transaction (539-556) inserts non-conflicting structural edges (spec-chain `caused`, lineage) FIRST via `insertInferredEdges`, THEN runs the conflict-prone collectors (similarity, supersession `contradicts`) via `insertNonConflictingEdges`. Because the guard queries the live connection inside the same `db.transaction` (better-sqlite3 synchronous), it observes the earlier inserts and SKIPS a `contradicts` whose pair already holds a valid `caused` — preventing contradiction-detection from invalidating the valid evolution edge. Ordering is the load-bearing correctness invariant and it is honored. Not a finding — confirmed-clean.
2. **Honest-count delta (charter "double-count of skippedConflicting" / idempotent re-run).** `written`/`byRelation` are derived from a before/after snapshot of VALID auto edges (`countValidAutoEdgesByRelation` 532 vs 568, delta 569-575), NOT from insert attempts. On idempotent re-run, upserts add no new valid rows → delta 0 → `written=0`. `skippedConflicting` is a separate counter incremented only in the guard (673), never folded into `written`. No double-count. The global (un-scoped) count is safe because the whole op is inside one synchronous transaction (no concurrent writer can interleave within the snapshot window). Confirmed-clean.
3. **SQL NULL-vs-empty-string tombstone check.** Both `hasConflictingValidEdge` (700) and `countValidAutoEdgesByRelation` (721) use `AND (invalid_at IS NULL OR invalid_at = '')`, matching `detectContradictions` (89). Correctly treats both NULL and empty-string as "not tombstoned." No finding.
4. **Iteration-number ambiguity (parallel mode).** Strict JSONL-derived serial = 3; dispatch-declared = 4 (parallel). Resolved in favor of dispatch per the parallel-safety contract (each agent owns its numbered files; orchestrator merges). Documented, no shared-state mutation. Safest in-scope interpretation.
5. **dryRun double-default** (see P2 #2) — verified non-inverting at both layers.

## Confirmed-Clean Surfaces
- **Conflict-guard ordering invariant** (`relation-backfill.ts:539-556`) — non-conflicting-first ordering correctly lets the guard protect in-transaction edges.
- **Honest-count delta** (`relation-backfill.ts:528-575`) — snapshot-delta is idempotent on re-run and immune to contradiction-detection invalidation; `skippedConflicting` not double-counted.
- **dryRun default safety** (`relation-backfill.ts:355`; `causal-graph.ts:274`) — defaults TRUE; only explicit `false` writes; `limit` clamped to MAX_LIMIT=2000 (358); similarity/contradicts opt-in default OFF (363-364); threshold clamped 1-100 (366-368).
- **SQL tombstone clause** (`relation-backfill.ts:700,721`) — NULL-or-empty handled, mirrors detectContradictions.
- **`pairKey` reciprocal dedup** (`relation-backfill.ts:234-236`) — order-normalized; similarity edges correctly exclude reciprocal spec-chain pairs.
- **`backfillJob.implemented=true`** (`relation-coverage.ts:113`) — honest (backfill is genuinely implemented).

## Ruled Out
1. **Conflict guard invalidates valid edges (charter A3 P0 hypothesis) — REFUTED.** The guard SKIPS rather than invalidates; ordering (Edge Case #1) ensures valid in-transaction edges are seen. The guard never calls `invalidateEdge`; only the pre-existing `detectContradictions`/`insertEdge` path can, and the guard suppresses exactly the inserts that would trigger it on a conflicting pair.
2. **3-node transitive contradiction cycle handling (charter A3) — NOT A NEW DEFECT.** `contradiction-detection.ts` models ONLY same-pair conflicts (`CONFLICTING_RELATIONS` 38-42; directional query 88); it has no transitive-cycle logic and never claimed to. This file is 1/1 line in range (pre-existing). The new backfill cannot be faulted for a transitive-cycle model the system does not implement. The reciprocal sliver is captured as P2 #1 (newly reachable via the new opt-in collector); the 3-node transitive case is purely pre-existing and out of range.
3. **`memory_causal_unlink` physical-delete + no auto-only guard — PRE-EXISTING, OUT OF RANGE.** `deleteEdge` (`causal-edges.ts:748`) is a physical `DELETE FROM causal_edges` (not an `invalid_at` tombstone) and the handler (`causal-graph.ts:1124`) deletes ANY edge incl manual with no `created_by='auto'` guard. Both the handler unlink path and `deleteEdge` are UNCHANGED in `a9e9bdb0a5^..HEAD`. Per SCOPE LOCK this is not a new finding for this range. Flagged here so a future whole-graph review (not range-scoped) can decide whether unlink should tombstone and restrict to auto edges.

## Next Focus
- **Dimension:** correctness | **Angle:** A4 (shutdown durability & lifecycle) — `context-server.ts` WAL-checkpoint-on-close (~1592/2169), `lib/runtime/shutdown-hooks.ts`, `shared/ipc/socket-server.ts` close()/parent-dir-fsync (~363-387), dispose() idempotency.
- **Reason:** A3 converged with no P0/P1 (2 P2 advisories); A4 is the next unworked correctness angle per charter iteration plan (iter 5) and carries the data-loss-window hypothesis.
- **Rotation status:** correctness A1 (iter 2) + A3 (iter 4) complete; A2 (iter 3) running concurrently; A4 next.
- **Blocked/productive carry-forward:** Productive — P2 #1 (reciprocal contradicts) feeds a future whole-graph (non-range) review of the contradiction model; ruled-out #3 (unlink physical-delete) feeds the same. Neither belongs in this range's findings.
- **Required evidence (A4):** WAL checkpoint call on shutdown path; whether close() fsyncs the socket parent dir; dispose() idempotency / module-global socket leak.
- **Recovery note:** n/a (no stuck/timeout this iteration).
