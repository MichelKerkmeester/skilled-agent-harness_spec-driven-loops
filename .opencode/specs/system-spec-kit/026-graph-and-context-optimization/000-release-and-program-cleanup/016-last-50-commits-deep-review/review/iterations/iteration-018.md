# Iteration 018 — correctness / A3-deepen (causal-graph consistency under inference)

## Dispatcher
- **Run:** 18 of 20 (parallel-agent mode — writes ONLY `iterations/iteration-018.md` + `deltas/iter-018.jsonl`; NO shared state/strategy/registry/config mutation)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness | **Angle:** A3-deepen (deepen F-A3-01: downstream consumer impact of reciprocal-contradictory edge pairs)
- **Budget profile:** verify (target 11-13 calls; used 11 tool calls — consumer-tracing + recursion-guard adjudication + dryRun re-confirm)
- **Review target:** git range `a9e9bdb0a5^..HEAD`; deepen scope = downstream consumers of `causal_edges` rows with `relation IN (supports, contradicts)`.
- **READ-FIRST seed:** `iterations/iteration-004.md` (F-A3-01 — the opt-in `contradicts` collector materializes reciprocal-contradictory pairs the directional model never reconciles).
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new, releaseReadinessState in-progress)

## Files Reviewed
- `lib/rag/trust-tree.ts` (FULL read) — trust-display / trust-scoring consumer. `buildTrustTree` 59-88, `hasContradiction` 67, `causalSignal` 131-143, `decideTrust` 188-199, `groupCausalEdges` 201-207.
- `handlers/memory-context.ts:1812-1846` — `memory_context` trust-tree wiring (`trustTreeInput` 1832-1843).
- `handlers/memory-search.ts:1223-1241` — `memory_search` trust-tree wiring (`trustTreeInput` 1229-1234).
- `lib/search/causal-boost.ts` (FULL read) — MMR/retrieval consumer. Recursive CTE `getNeighborBoosts` 417-503 (CTE 430-469), `applyCausalBoost` 532-674, `injectGraphContext` 711-784, `RELATION_WEIGHT_MULTIPLIERS` 91-98.
- `lib/storage/causal-edges.ts` — graph-traversal consumer. `getCausalChain` 598-655 (cycle guard 630, depth guard 617), `getEdgesFrom`/`getEdgesTo` 525-573 (no relation filter, no per-pair dedup).
- `handlers/causal-graph.ts` — `memory_drift_why` consumer (`by_contradicts` hint 727-729), directional buckets 285-287/330-332/372-374, backfill wiring 274/960.
- `lib/causal/relation-backfill.ts:351-386` — dryRun + opt-in gating (F-A3-02 re-confirm).
- `lib/graph/contradiction-detection.ts:34,38-42` — pre-existing directional/mutually-exclusive model (the ONLY mutual-exclusivity assertion in scope).
- `lib/causal/relation-coverage.ts:43-44,122` — coverage targets (supports minimumShare 0.05; contradicts minimumShare 0).

## Findings — New

### P0 Findings
None. No consumer of `causal_edges` (relation IN supports/contradicts) hangs, loops infinitely, or returns a logically-contradictory result when a reciprocal pair (A contradicts B + B supports A) exists. All recursive/graph consumers are bounded; all relation-bucketing consumers treat each relation as an independent row (no mutual-exclusivity assumption downstream). Evidence below.

### P1 Findings
None. The deepen did not surface any consumer that ASSUMES mutual exclusivity and breaks. The single mutual-exclusivity assertion (`contradiction-detection.ts:34`) is the pre-existing DIRECTIONAL model already captured by F-A3-01; it operates per (source,target) and never reads the reverse edge, so a reciprocal pair is invisible to it (two independent directional facts) rather than mishandled.

### P2 Findings

1. **F-A3-01 CONFIRMED at P2 (does NOT rise) — reciprocal-contradictory pairs are benign-but-noisy across all consumers; one display consumer surfaces a benign "review for consistency" hint** — `lib/rag/trust-tree.ts:67,135-139,196` + `handlers/causal-graph.ts:727-729` — Every downstream consumer of `supports`/`contradicts` edges treats the two relations as INDEPENDENT rows, not a mutually-exclusive pair. The strongest downstream reaction to a reciprocal pair is benign and arguably correct: (a) `trust-tree.ts:67` sets `hasContradiction=true` via `.some(relation==='contradicts')` (presence test, O(n), no loop), which flips `decideTrust` to `'mixed'` (196) and `causalSignal` state to `'stale'` (138) — but it ALSO counts the coexisting `supports` edge (139,203) without contradiction; the output is "mixed trust", which is the semantically appropriate response when both signals are present, not a logically-contradictory result; (b) `causal-graph.ts:727-729` pushes the advisory hint `'Contradicting relationships detected - review for consistency'` — exactly the right user-facing nudge for a reciprocal pair. No consumer asserts the two relations cannot coexist. Severity stays P2 (latent-inconsistency advisory): low blast radius (doubly-gated opt-in; default OFF), no functional break, no DoS.
   - Finding class: latent-inconsistency / scope-boundary advisory (downstream-impact confirmed benign)
   - Scope proof: collector that materializes the pair is NEW (`relation-backfill.ts` 100% new in range; opt-in wiring `causal-graph.ts:274,960` new). All consumers traced here are PRE-EXISTING (trust-tree.ts, causal-boost.ts, causal-edges.ts getCausalChain unchanged in range); the deepen confirms the pre-existing consumers absorb the new pair gracefully.
   - Affected surface hints: `trust-tree.buildTrustTree` (`memory_context`/`memory_search` trust display — see Edge Case #3 for live-wiring caveat); `memory_drift_why` consistency hint; future whole-graph reciprocal/transitive reconciliation work.
   - Claim-adjudication:
     ```json
     {
       "type": "latent-inconsistency",
       "claim": "Reciprocal-contradictory pairs (A contradicts B + B supports A) materialized by the new opt-in collector cause NO downstream consumer to hang, loop, or return a logically-contradictory result; the strongest reaction is a benign 'mixed trust' decision + a 'review for consistency' hint. F-A3-01 stays P2.",
       "evidenceRefs": ["lib/rag/trust-tree.ts:67 (.some presence test, O(n))", "lib/rag/trust-tree.ts:135-139 (independent supports/contradicts counts)", "lib/rag/trust-tree.ts:196 (hasContradiction -> 'mixed', not error)", "handlers/causal-graph.ts:727-729 (benign advisory hint only)", "lib/search/causal-boost.ts:462 (recursive CTE depth guard cw.hop_distance < ?)", "lib/search/causal-boost.ts:463 (origin-return guard)", "lib/storage/causal-edges.ts:617,630 (getCausalChain depth + path-set cycle guards)", "lib/storage/causal-edges.ts:525-573 (getEdgesFrom/To: no relation filter, no per-pair dedup)"],
       "counterevidenceSought": "Searched for any consumer asserting mutual exclusivity / XOR / 'cannot both' on supports+contradicts: only hit is contradiction-detection.ts:34 (the pre-existing DIRECTIONAL model, per-(source,target), which never reads the reverse edge so the reciprocal pair is invisible to it). Searched all recursive causal_edges walkers (causal-boost CTE, getCausalChain) for missing termination guards: BOTH bounded (CTE by hop_distance literal + origin-return filter; getCausalChain by maxDepth + visited path Set). Checked whether trust-tree is actually fed causal edges at the live memory_context/memory_search call sites: it is NOT (see Edge Case #3), which further shrinks live blast radius.",
       "alternativeExplanation": "One might argue the 'mixed'/'stale' trust flip is a contradictory RESULT. Rejected: when both a supports and a contradicts edge genuinely exist, 'mixed trust' is the correct, defensible output, not a logic error. The trust-tree does not claim exclusivity; it reports both.",
       "finalSeverity": "P2",
       "confidence": "high",
       "downgradeTrigger": "Already at floor. Would be NOT-A-FINDING if the contradicts collector were permanently disabled, but it remains a user-reachable doubly-gated opt-in (dryRun:false AND contradicts:true)."
     }
     ```

## Traceability Checks
- **F-A3-02 (dryRun default fail-safe) RE-CONFIRMED.** `lib/causal/relation-backfill.ts:355` — `const dryRun = options.dryRun !== false; // default TRUE; only explicit false writes`. Truth table verified: `undefined !== false` = TRUE (safe default, no write); `false !== false` = FALSE (explicit opt-in writes); `true !== false` = TRUE. The reciprocal-pair-materializing path is DOUBLY gated: it requires `dryRun:false` (355) AND `contradicts:true` (364, `options.contradicts === true` defaults OFF). Fail-safe intact at the library layer; matches iteration-004's verified-safe finding. No inversion.
- **Consumer trace completeness (relation IN supports,contradicts):** Enumerated all production (non-test, non-worktree) readers via `rg supports|contradicts`. Consumer set = {trust-tree.ts (trust display/scoring), causal-boost.ts (MMR/retrieval boost + graph-context injection), causal-edges.ts getCausalChain (graph traversal), causal-graph.ts memory_drift_why (directional buckets + hint), relation-coverage.ts (stats targets)}. Each inspected for hang/loop/exclusivity. None breaks.
- **Recursive-walk termination (DoS hypothesis under reciprocal/cyclic edges):** REFUTED. `causal-boost.ts` CTE has hard depth bound `cw.hop_distance < ?` (462, maxHops=1 in sparse / 2 default) + origin-return filter (463) + `UNION` row-dedup; `getCausalChain` has `depth >= maxDepth` (617) + `path.has(nextId)` visited-set cycle guard (630). A reciprocal A↔B pair cannot diverge the recursion in either walker.
- **Mutual-exclusivity assertion search:** the ONLY downstream assertion that supports+contradicts are exclusive is `contradiction-detection.ts:34` (`Relation pairs that are mutually exclusive on the same source+target`) — pre-existing, directional, 1/1 line in range. It is the SOURCE of the F-A3-01 gap, not a victim of it. No OTHER consumer encodes exclusivity.

## Integration Evidence
- `handlers/memory-context.ts:1832-1843` (`memory_context` MCP tool) — wires `trustTreeInput` with `responsePolicy` + `codeGraph` ONLY; NO `causal:` key passed. So at the LIVE `memory_context` call site, `buildTrustTree` receives `input.causal?.edges ?? []` = empty → the contradiction logic is dormant for live `memory_context`.
- `handlers/memory-search.ts:1229-1234` (`memory_search` MCP tool) — wires `trustTreeInput` with `responsePolicy` ONLY; NO `causal:` key. Same dormancy for live `memory_search`.
- `lib/search/search-decision-envelope.ts:81` — `buildTrustTree` is only invoked when `trustTreeInput` is supplied; the two live callers above do not supply causal edges, so the only code paths that actually feed causal edges into `buildTrustTree` are `stress_test/search-quality/w3-trust-tree.vitest.ts`. Live blast radius of the reciprocal-pair → trust-tree interaction is therefore currently THEORETICAL (display consumer wired but not fed causal edges in production), which further supports holding F-A3-01 at P2.
- `handlers/causal-graph.ts:960` — `memory_causal_stats({ backfill: { ..., contradicts } })` is the sole production entry that can enable the contradicts collector (matches iteration-004 integration finding). Named integration surface: `memory_causal_stats` MCP tool handler.

## Edge Cases
1. **Recursive CTE under a reciprocal pair — VERIFIED BOUNDED.** `causal-boost.ts` `causal_walk` recursion (450-463) joins `causal_edges` on `ce.source_id = cw.node_id OR ce.target_id = cw.node_id`, so it traverses BOTH directions of an A↔B pair. Termination is guaranteed by the literal depth bound `cw.hop_distance < ?` (462) bound to maxHops (1 or 2) and the origin-return exclusion (463). A reciprocal pair adds at most a constant number of bounded rows; `MAX(walk_score)` (465) aggregates them. No divergence, no DoS. Confirmed-clean.
2. **`getCausalChain` JS recursion under a reciprocal pair — VERIFIED BOUNDED.** `traverse` (616-651) carries a per-path `Set<string>` and skips `path.has(nextId)` (630). Walking root A→B (contradicts) then attempting B→A is skipped because A is already in B's path. Plus `depth >= maxDepth` (617, default 3). No infinite recursion. Confirmed-clean.
3. **trust-tree NOT fed causal edges at live call sites — live blast radius narrower than worst case.** `memory_context` (1832-1843) and `memory_search` (1229-1234) pass NO `causal:` key, so `buildTrustTree`'s contradiction handling is dormant in production today (only stress tests feed it). The reciprocal-pair → trust-display interaction is wired-but-unfed live. This is a blast-radius narrowing, NOT a new defect; documented so a future packet that DOES wire causal edges into trust-tree knows the reciprocal pair will produce a (benign) 'mixed' decision.
4. **relation-coverage stats target for contradicts = 0.** `relation-coverage.ts:44` sets `{ relation: 'contradicts', minimumShare: 0, minimumCount: 0 }` — coverage stats never DEMAND contradicts edges and never assume exclusivity vs supports (0.05 share, line 43). The opt-in collector growing contradicts edges cannot trip a coverage failure or mis-balance the stats. Confirmed-clean.
5. **Iteration-number ambiguity (parallel mode).** Strict JSONL-derived serial (shared `state.jsonl` has 2 `type:"iteration"` lines) = 3; dispatch-declared = 18 (parallel). Per the parallel-safety contract each agent owns its numbered delta/iteration files and the reducer merges later; honoring dispatch iteration=18. No shared-state mutation performed. Safest in-scope interpretation. (Also: `iterations/iteration-014.md` present without a matching `deltas/iter-014.jsonl` = a concurrent agent mid-flush; consistent with parallel mode.)

## Confirmed-Clean Surfaces
- **trust-tree contradiction handling** (`trust-tree.ts:67,135-139,196,201-207`) — presence-based, O(n), counts supports+contradicts independently; reciprocal pair → benign 'mixed'/'stale', never a logic error or loop.
- **causal-boost recursive CTE** (`causal-boost.ts:430-469`) — depth-bounded + origin-return-guarded + UNION-deduped; reciprocal/cyclic edges cannot diverge it. `contradicts` weight 0.8x, `supports` 1.0x applied independently.
- **getCausalChain traversal** (`causal-edges.ts:598-655`) — visited-set + maxDepth cycle/depth guards; reciprocal pair cannot infinitely recurse.
- **getEdgesFrom / getEdgesTo** (`causal-edges.ts:525-573`) — return all edges, no relation filter, no per-pair dedup, no exclusivity assumption.
- **memory_drift_why directional buckets + hint** (`causal-graph.ts:285-287,727-729`) — `by_supports`/`by_contradicts` independent buckets; reciprocal pair → benign advisory hint only.
- **dryRun + opt-in double-gate** (`relation-backfill.ts:355,363-364`) — default TRUE / OFF; only `dryRun:false` AND `contradicts:true` materializes the pair. Fail-safe re-confirmed (F-A3-02).
- **relation-coverage targets** (`relation-coverage.ts:43-44`) — no exclusivity / no contradicts-demand; opt-in growth cannot mis-balance stats.

## Ruled Out
1. **Downstream DoS / infinite loop from reciprocal or cyclic supports/contradicts edges — REFUTED.** Both recursive consumers (causal-boost CTE 462-463; getCausalChain 617,630) are independently depth- and cycle-bounded. No consumer can hang or loop on a reciprocal pair. This was the strongest "rise to P0" path for F-A3-01; it is closed.
2. **A consumer that assumes mutual exclusivity and returns a logically-contradictory result — REFUTED.** The sole exclusivity assertion (`contradiction-detection.ts:34`) is directional/per-(source,target) and never reads the reverse edge; the reciprocal pair is invisible to it (two independent facts), not mishandled. No other consumer encodes exclusivity. trust-tree's 'mixed' decision is a correct response to coexisting signals, not a contradiction.
3. **F-A3-01 rising to P1/P0 — REJECTED.** Downstream impact is benign across all consumers; live trust-tree wiring does not even feed causal edges today (Edge Case #3); the materializing path is doubly-gated opt-in (default OFF). Severity correctly held at P2. The only "remediation" that would matter is a future whole-graph reciprocal/transitive reconciliation of the directional contradiction model — out of this range's scope, already noted as carry-forward in iteration-004.
4. **dryRun default inversion (F-A3-02 regression) — REFUTED again.** `relation-backfill.ts:355` re-verified non-inverting; opt-in collectors default OFF (363-364). No regression.

## Next Focus
- **Dimension:** correctness | **Angle:** whole-graph (NON-range) reconciliation of the directional contradiction model — reciprocal/transitive contradiction cycles, and whether `memory_causal_unlink` should tombstone + restrict to auto edges (carry-forward from iteration-004 ruled-out #3).
- **Reason:** A3 (range-scoped) is now fully converged: F-A3-01 settled at P2 with downstream impact proven benign; F-A3-02 re-confirmed. The only remaining causal-consistency work is explicitly OUT OF the `a9e9bdb0a5^..HEAD` range (pre-existing directional model + pre-existing unlink path) and belongs to a future whole-graph review.
- **Rotation status:** correctness A3 + A3-deepen complete (iter 4 + iter 18). No new range-scoped A3 angle remains.
- **Blocked/productive carry-forward:** Productive — two whole-graph (non-range) items feed a future review: (a) reciprocal/transitive contradiction reconciliation in the directional model; (b) wiring causal edges into trust-tree at the live `memory_context`/`memory_search` call sites (currently unfed — Edge Case #3) and its interaction with reciprocal pairs. Neither belongs in this range's findings.
- **Required evidence (future whole-graph review):** a reconciliation policy for reciprocal `contradicts`+`supports`; live trust-tree causal wiring decision; unlink tombstone-vs-physical-delete + auto-only-guard decision.
- **Recovery note:** n/a (no stuck/timeout/error this iteration; 11 tool calls within verify budget).
