# 028/007 ↔ 027/002 (015-019) — Reconciliation with the Concurrently-Shipped Search Intelligence

> While the 028/007 memory-systems mining ran, packet **027/002 shipped phases 015-019** to the *same* internal Memory MCP: a cosine-gate fix (015), a 10-iteration Opus retrieval+output research pass (016), seven implementation phases (017/001-007), and reindex/daemon infra (018-019). This doc reconciles those shipped changes against the 028/007 roadmap (`06-memory-systems-findings.md`). **Method:** a fresh 3-seat Opus 4.8 council (staleness / overlap / synergy), each verifying against live `mcp_server/` source — adversarially prompted to *maximize* impact. **Verdict: MINOR-EDITS** — no GO refuted, the spearhead and both new initiatives untouched, two "Before" states gone stale, and 027 actively *unblocks* the roadmap's biggest caveat.

## The clean split (why impact is bounded)
027/002 (015-019) touched the **read / ranking / calibration / output** path. The 028/007 core lives in the **graph-write / edge / background** path. Seat-1 live-source audit: **8 of 11 candidate "Before" states pristine, 0 actually built by 027, 1 partial-supersession.** 027 touched fusion-read, confidence, token-budget-truncation, vector-lane admission; it touched *nothing* in `temporal-edges.ts`, `contradiction-detection.ts`, `pressure-monitor.ts`, `entity-extractor.ts`, or `community-search.ts`.

## Verdict ledger (per candidate)
| 028/007 candidate | Verdict | Evidence / why |
|---|---|---|
| **#1 MEM-fact-invalidation-event-time** (spearhead) | **DISTINCT — intact** | `temporal-edges.ts:81` still stamps `invalid_at = new Date().toISOString()` (txn-time); module gated default-off, 027 never reached it. |
| #2 CG-iterative-context-extension | **DISTINCT** | `executeStrategy` (`memory-context.ts:1291-1312`) is single-pass; 017/003 escalates a tier *before* one pass, adds no convergence loop. 016 Problem-1 proposed the single-pass re-route, not iterative recall. |
| #3 CG-agentic-tool-loop | **DISTINCT** | No tool-calling / LLM controller in the synchronous path; 016 Problem-4 explicitly ruled out an LLM reranker as the first move. |
| #4 MEM-fused-summary-channel | **DISTINCT (closest call)** | RRF channel list `hybrid-search.ts:1310` = `['vector','fts','bm25','graph','degree']` — no summary lane. S5 reorders the *already-fused head*; O2 is output-format only. **016 Problem-4 deliberately chose head-reorder over adding a channel → strengthens this candidate's deferred status.** |
| #5 MEM-tiered-recall-budget | **DISTINCT (adjacent)** | `pressure-monitor.ts:56` still one flat ratio; S1 floors result *count* + pages, but adds no per-tier *content density*. Net-new on top of S1. |
| **#6 LT-compaction-fallback-ladder** | **OVERLAPS-S1 / partial-supersession — STALE BEFORE** | `enforceTokenBudget` (`memory-context.ts:778-816`) now content-trims to 500c first, drops only under a count floor, keeps dropped results as **metadata stubs** + a binary-search compaction tier. **~70% of the ladder already shipped (017/001).** Only the LLM-summarize rung is net-new. |
| #7 DL-iterative-retrieval-loop | **DISTINCT** | Deep-Loop `reduce-state.cjs` — a different subsystem; 027/002 cannot/did not touch it. |
| **#9 CG-question-type-router** | **DISTINCT (mechanism) — STALE BEFORE (partial)** | `query-classifier.ts:239-249` + `routeQuery` (`hybrid-search.ts:1306-1333`, `SPECKIT_COMPLEXITY_ROUTER` default-on) now route by query *complexity*. My *question-type* router (find_spec vs find_decision) extends it, but "no per-query routing" is half-stale (it conflated the intent reweighter with the live complexity router). |
| Cheap wins: GR-temporal-ordering-invalidation · M0-bm25-sigmoid · M0-entity-cardinality · CG-declarative-regex-entity-config | **DISTINCT** | All verified untouched: `contradiction-detection.ts:38-42` (no `valid_at` ordering rule), no sigmoid/midpoint anywhere under `lib/`, no hub penalty, `entity-extractor.ts:82-122` still 5 inline regexes. |
| Initiative A (semantic edge layer) · Initiative B (async sleep-time consolidation) | **DISTINCT — intact** | No edge-vector or background-consolidation work in 017; wholly outside the 015-019 blast radius. |

**Tally: DISTINCT ×12 · STALE-BEFORE ×2 (#6, #9) · OVERLAPS/partial-supersession ×1 (#6) · REFUTED ×0 · NOW-ALREADY-IMPLEMENTED ×0.**

## Two stale "Before"s to correct (applied to `06` + `007 research.md`)
1. **#6** — drop "goes straight to char-slicing and dropping whole results" (that is the S1 *before*-state, already fixed). Rescope to: *"add a summarize-lowest-value rung on top of S1's shipped skip / count-floor / metadata-stub / binary-search-compaction ladder."*
2. **#9** — drop "no per-query routing (intent reweights only)." Reframe to: *"a query-**complexity** router is live (017/003, `SPECKIT_COMPLEXITY_ROUTER`); the net-new is a query-**type** taxonomy on top of it — note the slot is occupied to avoid double-building."*

## Reverse value — 027/002 strengthens the roadmap (the constructive half)
1. **Measurement unblocked (re-stamp the #1 caveat).** The campaign's "no benefit numbers" residual was not inherent — it ran on a *broken instrument*: the request-quality gate read RRF scores (~0.03) against cosine thresholds (0.7/0.4), pinning every verdict at `weak/do_not_cite`. **015 fixed it** (a 0.89 cosine match now reads `good/cite_results`). Re-stamp `06` from "research-only, unmeasurable" → **"measurable once the reindex runs."**
2. **Reindex is gate-zero.** §13 states the deferred corpus reindex (restoring ~25% cold/un-embedded rows) is the precondition for measuring *any* recall candidate. The roadmap omits this — add a **Wave-(−1) reindex precondition** ahead of the prove-first column.
3. **Adopt the 027 doctrine-class axis.** 027's principle — *correctness ships always-on; new results-affecting intelligence ships shadow-gated/default-off and earns activation on live evidence* — is orthogonal to the effort-based waves. Correctness-class: #1 (reader-transparent), CG-declarative-regex-config. Shadow-gate-class (mandatory build-behind-flag → shadow-observe → promote): Initiative-A (LLM-judged dedup can *silently merge two distinct facts* — highest tail-risk), Initiative-B (mutates archival off-turn), #2/#3 (loop in a deterministic hot path), #4 (new fusion lane + ablation-retune). Wave-tier sizes the build; doctrine-class decides whether it can ever default-on.

## Independent corroboration (016 ↔ 028/007 convergence)
The 016 Opus research (10 iters, concurrent, separate effort) reached the **same conclusions** as the 028/007 campaign in every overlapping area — independent cross-validation:
- **FSRS cold-tier → leave unchanged** (016 Problem-5 found cold crowding ~2 rows, near-inert; matches 028/007's "NOT changing → FSRS/cold tier").
- **LLM/cross-encoder reranker → needs a governor, not a cheap win** (016 Problem-4 ruled it out as first move; matches the 028/007 caution on CG-agentic-tool-loop).
- **Fusion channels → defer** (016 Problem-4 chose cosine head-reorder over adding a channel; matches MEM-fused-summary-channel's deferred status).

## Single most-likely-wrong (this reconciliation)
The orchestrator blind-spot the council flagged: **treating "unmeasurable" as a permanent property of research-only work** when 015 converted it into a *cleared blocker with a named precondition (reindex)*. The implementation packet's first action is **not** "build the smallest candidate" — it is "run the deferred reindex, then re-run the recall/saturation checks the campaign couldn't trust, because they may now read true." Secondary risk: the exact truncation-floor constant (a `length>1` floor + metadata stubs were seen at `memory-context.ts:791`; the literal floor-of-3 may live in `hybrid-search.ts truncateToBudget`) — immaterial to the verdict, but verify at implementation time.

> **Scope reminder.** Research-only (028 §3). This reconciliation records impact; it builds nothing. Full per-candidate council evidence is in this session's record; live seams cited above are current as of the 015-019 ship.
