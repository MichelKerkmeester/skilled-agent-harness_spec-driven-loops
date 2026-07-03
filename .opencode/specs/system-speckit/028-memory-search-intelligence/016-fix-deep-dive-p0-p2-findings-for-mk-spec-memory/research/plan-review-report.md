# Plan Review Report — 016 Deep-Dive Remediation Program

**Date:** 2026-07-03 · **Method:** 5 independent fresh Opus reviewers, each cross-checking phase plans against the source findings (research/) AND live `mcp_server` code + the production DB. A plan passing `validate.sh --strict` proves doc structure only; these reviews judge substance. ~80 file:line claims verified across the batch.

## VERDICT TABLE

| Phase | Rating | Headline |
|-------|--------|----------|
| 001 orphan-sweep-and-identity-repair | GO-WITH-CHANGES | cursor fix sound; `near_duplicate_of` backfill format collision; drain not cleanly checkpointable |
| 002 archived-tier-and-tombstone | **REWORK** | predicate SQL buggy (NULL exclusion, drops constitutional) + false "FTS/BM25 don't filter" premise (graduated-flag logic-sync) |
| 003 content-hash-and-save-dedup | GO-WITH-CHANGES | root cause verified; 2 executor-halting citation errors (wrong file path, wrong guard line) |
| 004 embedding-coverage | GO-WITH-CHANGES | P0 mechanism verified; P0 acceptance wording wrong (parent 'partial' by design); SC-001 gameable |
| 005 trigger-phrase-quality | GO-WITH-CHANGES | latency target hinges on a cache surviving `clearCache()` (unstated); regeneration selector undefined |
| 006 rescue-authority-decision | GO-WITH-CHANGES | framing trustworthy; dead-battery premise wrong (2/3 modules live); completeRecall@3 too coarse to decide |
| 007 filter-bypass-score-scale | GO-WITH-CHANGES | 7 fix sites verified; 006↔007 no-op hazard unencoded; headroom band can't carry +0.7 boost; T-0211 misassigned |
| 008 causal-graph-hygiene | **REWORK** | absorbed P1-2/P1-4 already fixed in code; ADR-001 migration violates CHECK constraint + mis-scored; wrong column names |
| 009 learning-loop-repair | **REWORK** | absorbed P1-5 already fixed; fuel thesis unreachable (`trackAccess` default-off, zero prod enablers) |
| 010 hot-path-performance | GO-WITH-CHANGES | targets grounded; 008↔010 file overlap unfenced; scaffold continuity never populated |
| 011 daemon-freshness | GO-WITH-CHANGES | deadlock fix sound; hash-cache must reuse checker's source enumeration; exit-taxonomy conservative default |
| 012 envelope-and-doc-alignment | GO-WITH-CHANGES | drift battery real (4/4 spot-checks confirmed); one field-name claim unverified |
| 013 review-remediation-closeout | **CHANGES-REQUIRED** | dead 91-P2 source path; section-level sweep too coarse (11 findings slipped past) |

3 REWORK (002, 008, 009), 1 changes-required (013), 9 go-with-changes. **No phase is fundamentally misconceived** — the discipline (verify-first batteries, baseline-before-delta, checkpointed migrations, per-task citations) is genuinely strong. The defects are correctable before implementation.

---

## SYSTEMIC FINDING #1 — The stale-tracker cascade (highest value)

**All three absorbed `028/006/002` items are already fixed in live code**, yet phases 008/009 schedule them as P0 code fixes. Verified by the graph/loop reviewer:

- **P1-2** (derived_id identity split → 008 REQ-003, tagged P0): `vector-index-schema.ts:1119-1129` already hashes the same `causal-edge:v1` rule version live writes use, with an inline comment describing the exact fix. The migration hasn't *run* (derived_id NULL on 32,414/33,425 rows) but the code defect is gone. Collapses to "run migration + add twin-identity test."
- **P1-4** (semantic-edge embedding inside `BEGIN IMMEDIATE` → 008 REQ-004, tagged P0): the target symbols `runSemanticEdgeEmbeddingPass`/`embedEdgeText` **return zero tree-wide**; `consolidation.ts` already runs the scan outside the lock (:574-578). Cited lines `:684/:701` exceed the 634-line file. The acceptance criterion tests a nonexistent symbol.
- **P1-5** (retention spare-only stale snapshot → 009 REQ-006, tagged P0): `memory-retention-sweep.ts:660-687` already revalidates the fresh in-tx row before DELETE, with a rationale comment.

**Root cause is mine:** the deep dive relayed these as "known-open" from Agent A's inventory, which trusted the `006/002` tracker's `implementation-summary.md` ("all remain PENDING, no code fixed") without re-reading the code. The absorption faithfully carried that error forward. This is why 008 and 009 landed REWORK — their *native* scope is sound; the absorbed P0 framing is the problem.

**Fix:** reclassify P1-2/P1-4/P1-5 from "P0 fix" to "verify-first → backfill-test + (for P1-2) run migration → close." Phase 013's tracker-closeout and each Phase-1 verify pass must confirm current code state first. This removes ~3 phantom P0s and prevents re-fixing/destabilizing correct code.

---

## SYSTEMIC FINDING #2 — Phase 002 predicate: the linchpin is the weakest artifact

001's dedup exclusion, 003's tombstone visibility, and 005's trigger exclusion all consume 002's shared active-row predicate. It has three load-bearing defects (all verified):

1. **Buggy SQL — excludes NULL-tier rows.** `lower(tier) NOT IN ('deprecated','archived')` → for NULL tier, `NULL NOT IN (...)` is NULL → falsy → **row excluded**, hiding live legacy rows and contradicting 002's own edge-case spec. Correct forms elsewhere (`vector-index-queries.ts:431`, `sqlite-fts.ts:188`) all guard with `IS NULL OR …`.
2. **Drops the existing constitutional exclusion.** Vector channel today excludes `('deprecated','constitutional')`; the shared predicate excludes `('deprecated','archived')`. Adopting it lets constitutional rows into ranked vector results, double-surfacing against the injection lane.
3. **False premise / logic-sync conflict.** The spec asserts "FTS/BM25 apply no tier filter." **They do** — `sqlite-fts.ts:186-188` and `hybrid-search.ts:564-566` filter deprecated, gated by `isArchivedRetrievalIncludedByDefault()` which is **graduated to default-TRUE by deliberate design** ("FSRS ranks them lower, no hard wall needed"). An unconditional predicate silently reverses a graduated decision. This needs an explicit logic-sync decision, not a "we added a filter" gloss.

**Fix:** correct the SQL to `(importance_tier IS NULL OR lower(importance_tier) NOT IN ('deprecated','archived','constitutional'))` for ranked lanes; add a confirm-before-fix task re-reading the FTS/BM25 filters + the graduated flag and make an explicit reverse-the-graduation decision. 002 must land its corrected predicate before 001/003/005 build on it.

---

## SYSTEMIC FINDING #3 — The 001↔002 ordering inversion (2 reviewers converge)

Execution order is 011→001→002. But 001's dup-collapse *deprecates* losers and relies on **002's** predicate to hide them from lexical/graph channels — and 002 runs after 001. Worse, the two docs contradict each other: 001's plan sequences collapse before its own handoff ("cross-prefix duplicates collapsed to 0"), while 002's plan says 001's collapse is "re-sequenced after 002's predicate lands." Both cannot hold. 001's search-level success gate can't pass until 002.

**Fix (pick one):** (a) reorder 002 before 001; (b) 001 delete-not-deprecate the losers; or (c) relax 001's success gate to the SQL-level invariant ("1 active row per logical key," which *is* achievable at 001-completion) and defer the search-level gate to post-002. Option (c) is lowest-risk. State the choice in both docs.

---

## SYSTEMIC FINDING #4 — Silent drops (11 findings + a security item)

The program-coherence reviewer traced ~35 findings and found **11 that map to no phase task and no explicit defer list**, clustered in the P2/contract/refinement tail where 013's *section-level* sweep is weakest:

1. **Agent D P2 — `llm-reformulation` unfenced prompt-injection** (+ cache-before-flag, no-negative-caching). **SECURITY.** `llm-reformulation.ts` is owned by no phase.
2. Agent D P2 — `retrieval-directives` `parseCandidateLine` mid-word `indexOf` (malformed directives to LLM); only its perf aspect is mapped (010), the correctness bug is dropped.
3. Agent F P2 — content-router Tier-1 drops chunks containing `tool:`/`user:`.
4. Agent F P2 — stale-delete counts cascaded children as failures.
5. Agent C P2 — session-boost writes ranking score into `attentionScore` alias (contract violation).
6. Agent C contract — constitutional recency exemption = perpetual +0.07 (tier-order violation).
7. Agent C contract — FSRS hybrid-decay default-ON before flag check.
8. Agent G P2 — dashboard `latency` prefix mislabels `ablation_latency_*` as improved; quality snapshots eternal `eval_run_id=0`.
9. Agent G P2 — session-trace causal reducer (single co-occurrence, no threshold).
10. Agent E — `memory_context` resume hardcodes `fingerprintStatus:'verified'`.
11. Agent D refinement — concept alias map expands common words (default-ON, dilutes lexical precision).

Plus **2 conscious defers**: working-memory decay double-apply (**the only report §3 P1 with no fix-phase owner** — routed to code-less phase 013), and `memory_context` JSON-in-string double-encoding (no explicit 013 slot).

**Fix:** upgrade 013's completeness sweep from section-level to **finding-level**, and pre-enumerate these 13 now rather than trusting the execution-time sweep. Route the security + correctness items to real fix phases (llm-reformulation → 007; content-router → 003/004; session-boost/recency/FSRS contracts → 007; dashboard → 009; parseCandidateLine → 007/008). Reassign the working-memory P1 to 009 or 007.

---

## OTHER MUST-FIX (per-phase, verified)

**Executor-halting citation errors** (SCOPE-LOCK will block or misfire):
- 003: `save-quality-gate.ts` pathed to `lib/memory/` but lives in `lib/validation/` (spec, scope, REQ, task all wrong). And the SUPERSEDE-guard task cites `pe-gating.ts:293-298` (the mutation) — the real guard is `pe-orchestration.ts:84-97`, condition `:80-82` tests only UPDATE/REINFORCE.
- 008: probes use `relation_type`/`source` columns that don't exist (correct: `relation`/`created_by`) — throw "no such column" as written.

**Unsound fixes:**
- 008 ADR-001 migration is **unsafe**: `causal_edges` has `CHECK(relation IN (...6 values...))` with no `entity_cooccurrence`; both the INSERT and the relabel UPDATE violate it and fail. The "trivial one-column UPDATE" scored 8/10 is actually a full 1.3GB table rebuild — the option scoring is invalid. Down-weight-in-place (keeps `relation='supports'`) is the only no-schema-migration option.
- 008 REQ-002 "derive strength from graph state" read literally overwrites the relation prior with a degree-only function, destroying the causal signal. Restate as relation_prior (recomputed, not accumulated) combined idempotently with degree.
- 001 ADR-002 `near_duplicate_of` backfill writes bare integer ids, but the column has an active JSON writer (`near-duplicate.ts:143`, `{id,similarity,threshold}`) and reader (`response-builder.ts:699`) — a format collision. ADR-002's "only read/clear code exists" premise is false.
- 007 ADR-001 headroom band (0.95) can't carry the dominant learned +0.7 boost (additive-then-clamp → re-ties at 1.0, the exact bug REQ-016 claims to fix) unless boosts are also rescaled — uncommitted.

**Gameable / unmeasurable acceptance:**
- 004 REQ-001 says "parent never 'partial'" but chunked parents are `'partial'` by design — assert fresh child rows survive + content reachable instead. SC-001 (367→0) is satisfied by reconcile moving rows `success`→`retry` without embedding — add "queryable via active vector surface."
- 004 finding #16 is config-conditional (drain bug only bites under a non-default `vec_<dim>` shard); T003 must assert the shard is active or tests false-pass.
- 005 latency target needs the (path,mtime) cache to survive `clearCache()` (fires every write) — state it as a separate write-invalidation-resistant cache and measure p50 under write churn, not quiescent.
- 006 must promote MRR/rank-position deltas into the decision gate (completeRecall@3 alone can't separate A/B/C); and specify the ablation-through-`executePipeline` mechanism (channel toggles + concurrent-DB isolation).
- 009 `trackAccess` is default-off with zero production enablers — the cache-hit fix can't move the 65/33,101 number. Either scope enabling it on the prod/auto-surface path or reframe every learning fix as preventive/latent with synthetic-fixture validation.

**006↔007 interaction:** encode "if 006 = Option A, 007 ADR-001/ADR-002 are moot" so the headroom band + trigger-weight don't ship as no-ops paying R-002's threshold-migration cost. 007 also ships cluster 4 (#13/#14, equally rescue-compressed) "direct" — that lane can ship a ranking change the harness never measures.

**006 dead-battery re-scope:** `attention-decay.ts` is live (`memory-triggers.ts:626`, Gate-1), `interference-scoring.ts` is live (write path). Only composite five-factor ranking functions are dead. Option-A delete must be re-scoped or it breaks trigger matching.

**007 T-0211 misassignment:** `causalBoosted:0` is not a flag-plumbing bug (causal flag is per-request + cache-keyed) — needs a dedicated diagnosis task or T011 fails with no fix path.

**007 security-vs-recall gate:** split "scope gates: always" (security) from "tier/quality gates: soft" for the recall lanes (trigger promotion, rescue) — hard-gating them suppresses the legitimate recall those lanes exist for and undercuts the 026 lexical-grounding purpose.

**013 dead source path:** the frozen 91-P2 list at `028/006/archive/review-report.md` (and `../../archive/review-report.md`) **does not exist** — REQ-002 can't be sourced. Locate/rehome it; the old 006/004 tracker inherited the same dead pointer.

**Doc hygiene (my residue):** phases **005 and 011** have `SPECKIT_LEVEL: 2` in spec.md but `1` in plan.md/tasks.md (fallout from the `create.sh --level` tooling bug). Phase **010's** continuity block is the untouched scaffold (`packet_pointer:"scaffold/010-…"`, `key_files:[]`) — unusable for resume. Zeroed `session_dedup.fingerprint` across children is expected pre-implementation but will trip CONTINUITY_FRESHNESS on completion claims.

**011 hash-cache hinge:** `finalize-dist.mjs` must reuse the checker's source *enumeration* (`collectSourceFiles`), not just its hash fn, or the cache never matches and the deadlock persists. Keep stale-dist inside exit 75 as a documented non-retryable sub-case unless the consumer inventory proves a distinct code is needed (CLAUDE.md's "75 = retryable" is a live contract).

---

## RANKED CONSOLIDATED MUST-FIX (before implementation)

1. **Reclassify the 3 absorbed 028/006/002 items to verify-first-then-close** (Systemic #1) — removes 3 phantom P0s from 008/009; prevents re-fixing/destabilizing correct code.
2. **Fix the 002 predicate SQL + logic-sync the graduated flag** (Systemic #2) — corrects a corpus-wide regression the linchpin would otherwise propagate.
3. **Resolve the 001↔002 ordering inversion** (Systemic #3) — reconcile the two contradicting docs; option (c) SQL-level gate is lowest-risk.
4. **Upgrade 013 to finding-level coverage + route the 11 silent drops** (Systemic #4) — especially the llm-reformulation security item and the orphaned working-memory P1.
5. **Fix 008's unsafe ADR-001 migration + wrong column names** — CHECK-constraint reality, re-score the options, `source`→`created_by`/`relation_type`→`relation`.
6. **Correct 003's two executor-halting citations** — `save-quality-gate.ts` path + SUPERSEDE guard site.
7. **Encode the 006→007 dependency + fix the headroom band; re-scope 006's dead-battery delete** — prevent no-op ships and a Gate-1-breaking delete.
8. **De-game the acceptance criteria** — 004 P0 wording + SC-001, 005 latency-under-churn, 006 metric power, 009 trackAccess enablement.
9. **Repath 013's dead 91-P2 source; fix 005/011 level stamps + 010 scaffold continuity.**
10. **011 hash-cache enumeration reuse + conservative exit taxonomy.**

Net: a genuinely strong program with real engineering discipline, but not ready to implement as-is. The three systemic findings (stale-tracker cascade, the 002 predicate, silent drops) are the ones that would cause wasted or wrong work; the rest are targeted corrections. All are fixable without re-architecting the program.
