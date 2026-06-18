# Improvement Roadmap: Memory Search Intelligence (Packet 028)

> Cross-cutting synthesis of four completed deep-research reports — **Memory MCP** (001, 21 candidates, PRIMARY), **Code Graph** (002, ~13 candidates), **Skill Advisor** (003, 9 candidates), **Deep Loop** (004, 11 candidates) — mining two external memory systems (**aionforge-memory**, Rust; **galadriel**, Python) for evidence-backed, code-mapped improvements across all four internal subsystems. This roadmap is organized by the **six cross-cutting spine themes** (not by subsystem) so that the *generalizable* external techniques are visible across systems. Per-subsystem detail lives in each child's `research/research.md` (linked in §Per-Subsystem Pointers).
>
> **➤ For the consolidated, digestible view of the full 150-iteration campaign (4-subsystem mining + the 027-revisit), read `research/synthesis/00-index.md` first** — it maps the actionable GO list (`01`), the 027↔028 reconciliation (`02`), and the corrections/caveats (`03`). This `roadmap.md` is the detailed/historical record: the pass-1 six-spine tables below, then two append-only addenda (BROADENING, 027-REVISIT).

## Executive Summary

Three meta-findings lead this roadmap:

1. **PROMOTE-the-off-state-flag is the single biggest pattern.** Across all four subsystems, the highest-leverage wins are existing-but-flag-gated-OFF or structurally-half-built machinery, NOT build-new. Memory ships bi-temporal edges, idempotency receipts, deferred/async save, pure rank-time decay, and graceful-degrade substrate — all gated OFF or unwired. Skill Advisor ships an end-to-end shadow pipeline (durable outcome capture + bounded delta estimator + shadow-weight registry) waiting to graduate. Code Graph ships confidence/evidenceClass fields plumbed to formatting but never multiplied into a score, plus off-by-default tombstones. Deep Loop ships a Beta-mean scorer that is exported but never imported by convergence. Of Memory's top-6, **5 are S-effort and 4 are PROMOTE-off-state**. The implementation spearhead is "flip the flag and wire the seam," not "write the algorithm."

2. **Determinism / reproducibility is the strongest unifying spine.** Every subsystem fuses ranked signals and renders sets a downstream model caches against. The shared `fuseResultsMulti {bonusOverChannels}` primitive plus the apply-exactly-once G2 invariant (both already shared-library code in `system-spec-kit/shared/algorithms/rrf-fusion.ts` + `stage2-fusion.ts`) underpin determinism across Memory, Skill Advisor, Code Graph, and Deep Loop. Determinism is also the unlock for galadriel's **stable-prefix prompt-cache (~84% cache-write reduction)** — byte-identical recall serialization is a prerequisite-by-spirit.

3. **The campaign surfaced a live framework bug — a near-zero-effort correctness FIX.** Deep Loop Q6: the shipped `deep_research_strategy.md` strategy template carries **zero** `<!-- ANCHOR:* -->` markers, but `reduce-state.cjs` (`:699-745`) requires all 7. A freshly-copied strategy therefore hard-fails `Missing anchor section key-questions in strategy file` on the first reduce after iteration 1. This session's own driver hit the bug firsthand and hand-patched its working copy. **Ship this first** — it is template-only, no runtime-code change, no dependencies, and it restores deterministic reducer behavior.

**Sibling priority** (seeded from 001): **code-graph is the heaviest beneficiary — touched by ALL FOUR original 001 spines** (determinism, bi-temporal currentness, query-class routing, graceful degradation), strongest for bi-temporal (commit-time = event-time) and query-class routing (same "indiscriminate graph expansion hurts single-hop precision" failure mode). Skill Advisor is touched broadly but more lightly (shared RRF substrate + already-live exit-75 degrade). Deep Loop is touched by determinism and graceful-degradation meaningfully, bi-temporal/query-class marginally — but owns the keystone reliability-weighted-learning spine.

> **Evidence convention.** Each child report marks claims **[CONFIRMED]** (file:line read directly) vs **[INFERENCE]/[INFERRED]** (reasoning over confirmed evidence, naming what would confirm). All internal seams below are preserved verbatim from the child reports. The *cross-subsystem reuse* mappings in this roadmap are largely **inferred** from the 001 seed and need impl-time confirmation (see §Provenance & Caveats).

---

## The Six Spine Themes

### (1) Determinism / Reproducibility

**External technique:** aionforge separates content-derived `SerializationId` render order from score-based fusion order, fuses by RANK (never raw score), and treats a rescan of unchanged content as an idempotent no-op. galadriel's stable-prefix prompt-cache (~84% cache-write reduction) depends on byte-identical output. The transferable artifact is the shared `fuseResultsMulti {bonusOverChannels}` primitive + the apply-exactly-once G2 invariant.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **C5-B** | Memory | Content-derived tie-breaks (`score desc, then canonicalId asc`) replacing score-only/clock tie-breaks | `hybrid-search.ts:752-758, 900-904, 922-926` | M-H | S | BUILD-small |
| **C5-A** | Memory | Content-derived serialization-order render stage (`serializationId = sha256(canonical fields)`), separating render order from score order | `formatters/search-results.ts:782`; `envelope.ts:99` | M-H | M | BUILD-new |
| **C-X1** | Memory | Shared `fuseResultsMulti {bonusOverChannels:'active'|'configured'}` so zeroing channels doesn't distort survivors' convergence bonus | `rrf-fusion.ts:345-388` | H | S→M | BUILD-new |
| **C6-A** | Memory | Always-on rank-time decay vs caller-supplied `nowMs` (not just `trackAccess`); reinforcement as a separate explicit event | `stage2-fusion.ts:897-908`; `fsrs.ts:40-47` | H | S→M | PROMOTE |
| **C4-B** | Memory | Content-addressed identity for DERIVED artifacts (`derived_id = sha256(canonical-triple + source + rule_version)`), causal edges first | `causal-edges.ts`; sha256 helper `memory-index.ts:281` | M | M | BUILD-new |
| **C3 (RRF)** | Skill Advisor | Import 001 shared `fuseResultsMulti` + deterministic RRF (fuse by rank, stable id tiebreak, weight:0 elision); advisor passes its OWN smaller `k` | `fusion.ts:69-82, :425+`; `rrf-fusion.ts:272-399` | H | M | PROMOTE (import) |
| **C2 (RRF order)** | Skill Advisor | Deterministic RRF byte-stable output replacing `toFixed(6)`+`localeCompare` tiebreaks (folds into C3) | `fusion.ts:409, 425-433` | M | S | PROMOTE (folds into C3) |
| **Cross-cut (det. order)** | Code Graph | Content-derived stable tiebreak (sort on node id/hash) so walk output is reproducible across runs instead of DB-iteration order — **one `finalize()` tiebreak covers impact + dependency/callees + outline-export (002 iter-7), not impact-only** | `code-graph-context.ts:627-671` | M | S | PROMOTE |
| **fuseResultsMulti reuse** | Code Graph | PROMOTE the 001 fuser (not build a code-graph-specific one) to fuse CALLS-channel + IMPORTS-channel impact results with a cross-channel bonus | `code-graph-context.ts:627-671` | M | M | PROMOTE (reuse 001) |
| **D-reproducible-fold** | Deep Loop | Reproducible convergence/newInfoRatio folding + content-derived node-id ordering for quarantine victim tie-break (no new determinism mechanism) | `convergence.cjs` fold; Q2 tie-break | M | S | PROMOTE (reuse 001) |

**Note:** the determinism primitive is the most-transferable single artifact in the whole packet — Memory builds it (C-X1), Skill Advisor imports it (C3), Code Graph promotes it (impact-channel fuse), and Deep Loop reuses its content-derived ordering. See §Sequencing Notes.

---

### (2) Bi-temporal Edge-Based Currentness

**External technique:** aionforge models currentness as **edge presence**, not physical deletion — supersede via `SUPERSEDED_BY`/`CONTRADICTS` edges + closed validity windows (`valid_from`/`valid_to` event-time + `ingested_at`/`expired_at` transaction-time), so a superseded fact is closed (History-readable) rather than destroyed. "Successful call = proof of freshness"; the generation watermark makes a stale read an error, never silently-stale data.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **C3-A** | Memory | Flip `SPECKIT_TEMPORAL_EDGES` ON so edge-presence currentness (`invalid_at` close + conflict auto-invalidation) becomes the live retirement path | `contradiction-detection.ts:75-77, 99-110` | H | S | PROMOTE-off-state |
| **C3-B** | Memory | Four-timestamp window (event-time `valid_from`/`valid_to` + txn-time `ingested_at`/`expired_at`) replacing single `valid_at`/`invalid_at` pair | `temporal-edges.ts:35-54` | M | M | BUILD-new (additive) |
| **C3-C** | Memory | `TemporalMode` (Current/AsOf/AsKnownAt/History) on recall + maintained `current-support` provider | `contradiction-detection.ts` (new enum/provider); depends on C3-B | M | M/L | BUILD-new |
| **C3-D** | Memory | Document tombstone-sweep ("off-state forgetting") vs temporal-close ("not current") as separate concerns | `sweep.ts:68-100` vs `temporal-edges.ts:64-80` | M | S | BUILD-new (decision note) |
| **Q1-C1** | Code Graph | Add `valid_at`/`invalid_at` to `code_edges`; replace reindex DELETEs with `UPDATE ... SET invalid_at = <generation>` + INSERT new; default read filters `invalid_at IS NULL`; enables as-of-last-green-scan impact | `code-graph-db.ts:177-184`, reindex DELETEs `:941,:985,:1012,:1031` | M | M | BUILD (schema migration, shared txn) |
| **Q1-C2** | Code Graph | Renamed symbol emits a `SUPERSEDES` edge (keyed on matching `contentHash`) instead of delete+recreate; preserves rename lineage; no schema change | edge-write `structural-indexer.ts` + `code-graph-db.ts`; tombstone machinery `:227-288` | M | S | BUILD (new edge type) |
| **Q6-C1** | Code Graph | Hard monotonic `generation` watermark bumped per scan commit; replace binary `freshness !== 'fresh'` with as-of-generation check — unsatisfiable generation surfaces an ERROR, never silently-stale edges | `code-graph-db.ts` swap; `code-graph-context.ts:313-321, :227` | M | M | BUILD (atomic with reindex) |
| **Q6-C2** | Code Graph | Soft `generation` int on the freshness envelope + metrics, no error gate yet — staged predecessor letting callers opt into as-of-generation comparisons | `code-graph-context.ts:313-321, :227` | M | S | PROMOTE (additive on freshness path) |
| **Q2-quarantine** | Deep Loop | Trust-keyed CONTRADICTS quarantine of the lower-trust side via edge-presence read-path exclusion (retain both nodes); mirrors aionforge `current_support_facts` exclusion-by-edge-presence | `coverage-graph-query.ts:221-252` + `coverage-graph-signals.ts:511-522` + `convergence.cjs:114,216-218` | H | M | BUILD |

**Note:** code structure is *intrinsically* bi-temporal — a symbol/edge is valid for a commit range (event-time) and indexed at scan-time (transaction-time) — so Memory's causal-edge `valid_at`/`invalid_at` + `supersedes`/`contradicts` model is the direct template for "this call edge was superseded by a refactor at commit X" and "what did the call graph look like at commit X" (a genuinely new Code Graph capability seeded here). Deep Loop's quarantine reuses the *exclusion-by-edge-presence* read-guard, not the validity windows.

---

### (3) Query-Class Routing

**External technique:** aionforge's 5-class query-class router classifies retrieval *shape* (SingleHop / MultiHop / Temporal / Entity / Quote) and applies per-class weight profiles + gating — crucially, gating graph/PPR expansion OFF for single-hop because "indiscriminate expansion hurts single-hop precision, helps multi-hop recall." The costly error is the false positive that demotes the right answer.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **C2-A** | Memory | New `retrieval-class-classifier.ts` (SingleHop/MultiHop/Temporal/Entity/Quote) as additive THIRD axis → `RouteResult.retrievalClass`; gates C2-B/C2-C | `query-router.ts:46-52` | H | M | BUILD-new (gating) |
| **C2-B** | Memory | Per-class `RetrievalProfile` → `RankedList.weight` injection at pre-fusion seam (honors `weight:0`); needs C-X1 so zeroing channels doesn't distort survivors | `rrf-fusion.ts:83-86, 272, 302` | H | S→M | PROMOTE seam |
| **C2-C** | Memory | Graph-expansion gating per retrieval-class via EXISTING `preserved`/`includeDegree` primitive (SingleHopFactual → graph off) | `query-router.ts:238-254` | H | S | PROMOTE (extend primitive) |
| **QCR** | Skill Advisor | Query-class router → intent-aware per-LANE weights (additive, never replaces explicit_author); generalizes the hand-maintained `primaryIntentBonus` table; ship behind shadow weights | `fusion.ts:69-82` (`effectiveScorerWeights`) | H | M | PROMOTE (shadow rollout) |
| **Q3-C1** | Code Graph | Personalized-PageRank impact ranking seeded on subject symbol, GATED to impact/multi-hop modes only (single-hop expansion off); bounded power-method for 400ms budget; intersect with `invalid_at IS NULL` current set | `code-graph-context.ts:627-671` | L→M | L | BUILD |
| **Q4-C1** | Code Graph | Rank-time trust multiplier `effectiveScore = structuralWeight × reliability` (`reliability = clamp(confidence) × evidenceClassFactor`); ordering-only, structural weight never mutated; the cheap precursor to Q3-C1 | `code-graph-context.ts:350-356`, sort `:607, :649` | M | S | PROMOTE (fields pre-plumbed) |

**Note:** Code Graph is the highest-value cross-subsystem transfer for this spine — its impact/neighborhood ranker has the *same* "find exact symbol" (single-hop, graph-expansion OFF) vs "trace impact/callers" (multi-hop, ON) shapes and the *same* over-expansion failure mode Memory's C2-A/C2-C fix. Skill Advisor's QCR is the additive per-lane analogue. Deep Loop dispatches by *mode* (research/review/council), not query shape — marginal/none for this spine.

---

### (4) Graceful Degradation

**External technique:** aionforge reports `embedder_available: false` and degrades to the remaining live signals rather than throwing — skip-the-unavailable-signal, report it honestly, keep serving narrower results. The daemon exit-75 (retryable IPC unavailability) is the same discipline at the transport layer.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **C9** | Memory | Detect embedder-unavailable, degrade to lexical (`useVector=false`) + report `embedder_available:false` instead of THROWING | `stage1-candidate-gen.ts:700-707, 1014-1020`; substrate `hybrid-search.ts:931-947` | H | S | PROMOTE substrate (currently THROWS) |
| **C5** | Skill Advisor | Runtime-empty lane elision in `liveTotal` (degrade-to-remaining, not skew-down) — ⚠ **'~13%' is UNSOURCED (BROADENING §2/§6 — capture a baseline); elide only RUNTIME-DEGRADED lanes, not zero-match, else it over-credits non-matching skills → needs a P0 lane-health signal first** | `fusion.ts:343-345, :388` | H | S | PROMOTE-fix |
| **C5a** | Skill Advisor | `embedder_available`-style degraded-lane explanation flag (`liveLaneCount` / degraded-lane list) — cheap legibility companion to C5 | `fusion.ts:533` | M | S | BUILD (explanation-only) |
| **graph_available degrade** | Code Graph | Already PRESENT with wired consumer; code-graph returns a graceful "unavailable" envelope rather than throwing — needs only the Q6 generation watermark layered on the same envelope | `memory-context.ts:1513` | M | — | PRESENT |
| **Q3-fanout-recovery** | Deep Loop | Transient/fatal classification keyed on `timedOut`/exit-code; re-dispatch a failed branch ALONE instead of re-running all siblings (degrade-narrower, report honestly) | `fanout-run.cjs:472-489`, `fanout-pool.cjs:174-194, 100-118, 235-238` | M-H | M | BUILD |

**Note:** Code Graph already lives this spine (the `memory-context.ts:1513` consumer was built to read code-graph's own `graph_available:false` degrade), and Skill Advisor's warm-only/exit-75 fallback is already this discipline in practice — C5/C5a formalize the in-process version. C9 is the sharpest gap: Memory recall currently THROWS on embedder-unavailable despite the keep-lexical substrate already existing.

---

### (5) Bounded Reliability-Weighted Learning

**External technique:** aionforge's reliability-weighted Beta posterior is immune to vote-count flooding — "every attester adds exactly one to the denominator … can never be pushed to certainty by sheer numbers." Per-source fractional evidence `r`/`1−r`, two-gate promotion (`k≥2` AND posterior, neither trades off), cold-start neutrality (unknown agent = uninformative 0.5), and a config-validation rule that refuses a policy whose `k` can't reach threshold.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **D2-reliability** | Deep Loop | Derive `reliabilityPosterior` + `distinctReliableSourceCount`: walk finding/source nodes, read `metadata.reliability` (default 0.5, read-only), accumulate `Σr`/`Σ(1−r)`, call `computeWeightedScore` — the KEYSTONE shared dep | `coverage-graph-signals.ts:295-450`, reads `upsert.cjs:179, 224` | H | M | BUILD (keystone) |
| **D3-cap+gate** | Deep Loop | Replace unbounded volume terms with `min(reliabilityPosterior, normalizedDiversity/Depth)` cap + two-gate STOP (`posterior ≥ stopThreshold` AND `distinctReliableSourceCount ≥ kMin`) — kills the vote-count flood | `convergence.cjs:112-121` (+ STOP path) | H | M | BUILD |
| **D1-weighted-Beta** | Deep Loop | Add `computeWeightedScore(Σrᵢ, Σ(1−rᵢ), α=1, β=1) = (α+for)/(α+β+for+against)` as additive export; integer `computeScore`/`shouldDemote` untouched | `bayesian-scorer.ts:13-44` (new export) | M | S | BUILD (+ PROMOTE dormant scorer) |
| **D4-policy-config** | Deep Loop | Off-by-default `convergence.reliability` policy (`priorAlpha=1, priorBeta=1, stopThreshold∈(0.5,1.0], kMin≥2`) with config-validation refusing a `kMin` that can't reach `stopThreshold` | `convergence.cjs` (mirror `promotion.enabled:109`) | M | S | BUILD |
| **Q2-adjudicator-seat** | Deep Loop | Seat-reliability multiplier via the existing `options.weights` override (council-side analogue of research quarantine; shares D2) | `adjudicator-verdict-scoring.cjs:118-146` (`:121`) | M | S | BUILD (council-side, optional) |
| **C4** | Skill Advisor | Bounded Beta-posterior lane auto-tune — ⚠ **CORRECTED (BROADENING §2): NO Beta math exists (the live estimator is raw-frequency), so C4 is a BUILD, not a graduation; and 027 shipped no lane attribution, so a Beta *lane* tune needs net-new attribution too**; needs holdout promotion gate | `feedback-calibration.ts:154,175-177`; `lane-registry.ts:71-74` | H | L | BUILD (shadow-first) |

**Note:** Deep Loop owns this spine — D2 is the keystone reliability signal that D1/D3/Q2/Q7 all consume (design once, use three times). Skill Advisor's C4 is the same Beta-posterior pattern but **[corrected: NOT a graduation / NOT lower-build — no Beta math ships; the estimator is raw-frequency; C4 is a real BUILD, see BROADENING §2]**. Both share aionforge's anti-overfit shape: cold-start neutrality, count floor, clamped deviation band. (Shared-Beta build shape: one f64 primitive + per-consumer adapters — the live integer scorer throws on fractional inputs; see `synthesis/01` Shared-infrastructure.)

---

### (6) Idempotent Async Consolidation + Crash-Safe Recovery

**External technique:** aionforge's consolidation uses content-addressed `fact_id` (canonical triple + episode + rule version) so a crash-replay reconstructs identical artifacts; `PassError::Transient` vs `Fatal` with `max_retries=5` and a durable failed-audit retry count ("a crash does not hand a failing episode a fresh retry budget"); poison-pill isolation so later ticks proceed past a failing item; per-tick observability gauges (`lag`, `pending`, `failed`).

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **C4-A** | Memory | Promote idempotency-receipts default-on for `memory_save`/`memory_update`; wire `replay`/`conflict` into deferred-save | `idempotency-receipts.ts:9-29, 54-57` | H | S | PROMOTE-off-state (`SPECKIT_MEMORY_IDEMPOTENCY`) |
| **C4-C** | Memory | Explicit episode→consolidation cursor + per-item `raw|in_progress|consolidated|failed` state over the existing `background`/`deferred` seam | `memory-index.ts:293-294, 1376-1377` | M | M/L | PROMOTE+BUILD |
| **C-G1** | Memory | Cadence-driven ambient ("goodnight") consolidation tick advancing the C4-C cursor on a clock, not just on save | `session-manager.ts:199-208` + `reconsolidation-bridge.ts` + C4-C cursor | M | M | BUILD (depends on C4-C) |
| **C7-A** | Memory | Session/spec-folder dominance cap (default 3, spill-if-underfilled) before the stage-4 final slice | `stage4-filter.ts:305-309` | H | S | BUILD-new (clean GAP) |
| **C8** | Memory | Untrusted-XML recall wrapper (`recalled-memory-context note="…not instructions"`, tag-escaped body) at render boundary | `formatters/search-results.ts:782`; `envelope.ts:284-295` | M-H | M | BUILD-new (security GAP) |
| **Q2-C1** | Code Graph | Split parser skip into TRANSIENT (WASM OOM/timeout → re-attempt until `attempt_count ≥ max_retries` default 5) vs FATAL (permanent); later ticks proceed past the poison file so it never wedges the scan | `tree-sitter-parser.ts` catch / `structural-indexer.ts:1254-1262`; budget col `parser-skip-list.ts:79-87` | M | M | BUILD (policy change — owner sign-off) |
| **apply-once G2 invariant** | Code Graph | Unifying constraint behind Q1-C1/Q2-C1/Q6-C1: a rescan of unchanged content must be a no-op (same edge ids, same windows, generation unchanged) | shared across Q1/Q2/Q6 | — | INVARIANT |

**Note:** Memory ships the most of this spine already half-built (idempotency receipts flag-OFF, deferred/async-save seam present, `complete_with_pending_vectors` reporting) — the gap is the durable cursor (C4-C) + the cadence clock (C-G1, galadriel's lone strong net-new contribution). Code Graph's Q2-C1 transient/fatal split directly contradicts the current "must not auto-unskip / no self-heal" stance and needs explicit owner sign-off. Deep Loop's Q3-fanout-recovery (also in spine 4) is the same transient/fatal + durable-retry pattern at the orchestration layer.

---

## Top "Ship First" Cross-System Picks

A single ranked list of the highest-leverage, lowest-effort, lowest-conflict candidates across ALL subsystems, with Memory MCP weighted as primary. Lead with the correctness FIX, then the promote-off-state flips.

| # | Pick | Subsystem | Why ship first | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| 1 | **Q6-anchor FIX** | Deep Loop | Live framework bug: shipped strategy template has zero `<!-- ANCHOR:* -->` markers → reducer hard-fails on first reduce. Template-only, no runtime change, no deps, restores deterministic reducer. | H | S | FIX |
| 2 | **C2-C** graph-expansion gating per class | Memory | Cheapest high-leverage win: extends existing `preserved`/`includeDegree` primitive to turn graph off for SingleHopFactual (precision) for ~free. (Gated by C2-A.) | H | S | PROMOTE |
| 3 | **C3-A** flip temporal-edges ON | Memory | Code-complete bi-temporal edge-presence currentness + conflict auto-invalidation, gated OFF. Flip makes "currentness = edge presence" live. Reversible. | H | S | PROMOTE-off |
| 4 | **C9** graceful embedder-degrade | Memory | Recall currently THROWS when embedder unavailable; `useVector=false` keep-lexical substrate already exists, just unwired. Route null-embedding → lexical + flag. | H | S | PROMOTE substrate |
| 5 | **C4-A** idempotency-receipts default-on | Memory | Aionforge-shaped module exists, flag-gated OFF, already pruned on lifecycle. Promote + wire replay/conflict into deferred-save. | H | S | PROMOTE-off |
| 6 | **C5** runtime-empty lane elision | Skill Advisor | Smallest high-value fix: closes confirmed ~13% confidence skew when graph_causal returns `[]` during rebuild. Degrade-to-remaining. (Needs baseline capture.) | H | S | PROMOTE-fix |
| 7 | **Q4-C1** rank-time trust multiplier | Code Graph | `confidence`/`evidenceClass` already plumbed to formatting but never scored. Fold into a rank multiplier — no schema change, neutral fallback. Cheap precursor to PPR. | M | S | PROMOTE |
| 8 | **Q6-C2** soft generation watermark | Code Graph | Additive `generation` int on existing freshness envelope, no txn change — safe staged predecessor to the hard error gate. | M | S | PROMOTE |
| 9 | **C3 (RRF import)** | Skill Advisor | Import 001 `fuseResultsMulti` so fusion reads RANK not raw score — fixes cross-lane comparability AND fragile float tiebreaks; unblocks C1/C2/C6. | H | M | PROMOTE (import) |
| 10 | **C5-B** content-derived tie-breaks | Memory | Narrowest determinism fix (`score desc, then canonicalId asc`); prerequisite-by-spirit for galadriel's stable-prefix prompt-cache (~84% cache-write reduction). | M-H | S | BUILD-small |

**Wave-0 spearhead** (independent, reversible, S-effort, ship before any BUILD-new): Q6-anchor FIX, then Memory C9 / C3-A / C6-A / C5-B, Skill Advisor C5 / C5a, Code Graph Q4-C1 / Q6-C2 / det-impact-order. These bank the off-state-flip and correctness ROI first.

---

## Per-Subsystem Pointers

| Subsystem | research.md | Candidates | Top-3 |
|---|---|---|---|
| **Memory MCP** (PRIMARY) | `001-speckit-memory/research/research.md` | 21 | **C2-C** (graph-gating per class), **C3-A** (flip temporal-edges ON), **C9** (graceful embedder-degrade) |
| **Code Graph** | `002-code-graph/research/research.md` | ~13 | **Q4-C1** (rank-time trust multiplier), **Q6-C2** (soft generation watermark), **cross-cut det-impact-order + graceful-degrade** |
| **Skill Advisor** | `003-skill-advisor/research/research.md` | 9 | **C3** (import shared RRF), **C5** (runtime-empty lane elision), **C1** (split-conflict re-rank) |
| **Deep Loop** | `004-deep-loop/research/research.md` | 11 | **Q6-anchor FIX** (template bug), **D2-reliability** (keystone signal), **D3-cap+gate** (kill vote-count flood) |

> All paths relative to `.opencode/specs/system-spec-kit/028-memory-search-intelligence/`.

---

## Sequencing Notes

- **The determinism primitive is the most-transferable single artifact (Memory → Skill Advisor → Code Graph).** The shared `fuseResultsMulti {bonusOverChannels:'active'|'configured'}` option plus the apply-exactly-once G2 invariant is the choke point every sibling ranker passes through. Memory authors `C-X1` (the `{bonusOverChannels}` option, defaulting to `'active'` so existing fusion stays byte-identical); Skill Advisor imports it (`C3`, passing its own smaller `k` for far-fewer-than-1000 skills); Code Graph promotes it for impact-channel fusion (CALLS + IMPORTS with a cross-channel bonus) rather than building a code-graph-specific fuser. Confirm the `fuseResultsMulti` signature is generic enough for code-graph result shapes before promoting (open item).

- **Deep Loop's D2 reliability signal is the keystone its other candidates consume.** D2 (read-only off `upsert.cjs:179,224` `metadata.reliability`, default 0.5) is the shared dependency for D1 (the math primitive), D3 (the cap+gate), Q2 (quarantine victim selection), and Q7 (finding ranking). Design once, use three times. Build order: **Q6-anchor FIX → D2 → D3 → Q2 → D1** (D1 is the thin additive enabler, sequenced last because its value is realized only once D2/D3 consume it).

- **The Code Graph temporal-column/generation cluster shares one `code-graph-db.ts` transaction boundary.** Q1-C1 (`valid_at`/`invalid_at` columns), Q6-C1 (hard generation counter), and the existing destructive DELETE+INSERT reindex all touch the same write path. A single schema migration + single atomic swap should land the validity columns AND the generation bump together (generation must bump atomically with the swap), or each re-pays the migration cost (SCHEMA_VERSION bump from 5, reindex-site rewrites at `:941,:985,:1012,:1031`). Q3-C1 (PPR) belongs in this cluster on the read side — it must intersect the PPR-reached set with the `invalid_at IS NULL` current set. The rank-time-only candidates (Q4-C1, Q6-C2) and the no-migration BUILDs (Q1-C2, Q2-C1) ship independently first and de-risk the cluster.

- **Memory's two longest chains** are `C4-A → C4-C → C-G1` (idempotency → cursor → cadence) and `C3-A → C3-B → C3-C` (flip-on → four-timestamp → temporal modes). Wave 0 spearhead **[corrected — see BROADENING §3]: C9, C5-B (+ the total-comparator keystone)**; C3-A is a read-side build (not a flip) and C6-A is demoted — both dropped from the spearhead. C-X1 sequences BEFORE C2-B so per-class zero-weighting doesn't reshape the convergence bonus.

---

## Provenance & Caveats

**Confirmed vs inferred mappings.** Within each child report, *internal-baseline* claims are largely **[CONFIRMED]** (file:line read directly), and the candidate seams are confirmed. The **cross-subsystem reuse claims in this roadmap are largely INFERRED** from the 001 seed and need impl-time confirmation:

- The "import 001 `fuseResultsMulti`" reuse is **[CONFIRMED]** shape-compatible for Skill Advisor (`LaneMatch{skillId}` → `RrfItem{id}`, zero schema friction) and **[RESOLVED by 002 iter-5]** for Code Graph: the signature is **promotable-with-adapter** (zero Memory coupling) but NOT drop-in — it needs an adapter (synthesize `RrfItem.id`, pre-sort each channel, label the dual GRAPH channels); the `{bonusOverChannels}` option name used elsewhere in this roadmap is **fictional** (not the real API).
- The bi-temporal "commit-time = event-time" mapping onto Code Graph is **[INFERRED]** design mapping (the dangling-prune contract + cross-file CALLS resolver were not traced end-to-end).
- Deep Loop's reuse of 001's content-derived ordering helper for the quarantine tie-break is **[CONFIRMED-by-reference]** but the exact 001 folding call site is **[INFERRED]** (unread — confirm by reading the 001 folding helper).
- Memory's convergence-bonus channel-interdependence (whether per-class zero-weights or a first-class LexicalAnchor channel soft-double-count) is **[INFERENCE]** needing a fusion-bonus unit test.

**Open implementation-time items per subsystem:**

- **Memory:** k=40 vs k=60 tuning (co-tuned with convergence-bonus constants; leave at 40 unless benchmark says otherwise); per-class `RetrievalProfile` weight VALUES need re-calibration on the ~1000-memory corpus; FSRS reinforcement preservation under the C6-A split; C3-B temporal-store reconciliation (causal-edge vs lineage at `vector-index-schema.ts:184-185` must unify, not fork into a third); C-G2 keep-or-cut overlap check vs `contextType` + C2-A.
- **Code Graph:** the **`Q5-C1` doc-symbol extractor** (markdown headings→`heading` nodes, json/yaml/toml keys→`key` nodes, content-derived ids) is a **tier-2 BUILD candidate (002 iter-4)**, not merely a `SymbolKind` tolerance note; `fuseResultsMulti` signature genericity (Q8) is **RESOLVED → promotable-with-adapter** (above); impact-walk run-stability (is impact output already stable across runs, or does it rely on SQLite row order); cross-file CALLS resolver vs supersede (trace dangling-prune contract `:957-968` before Q1-C1 — now **DEFER-speculative**).
- **Skill Advisor:** re-confirm the C4 shadow linkage is ONE live pipeline (outcome record → delta estimator → shadow-weight registry → `_shadow` channel), not three disconnected scaffolds; QCR class taxonomy + per-class lane multipliers (keep explicit_author dominant); exact Beta prior + holdout thresholds for C4; how the conflict demotion stays in a post-fusion re-rank comparator (C1 — **no RRF exists in the advisor scorer; it is weighted-sum, so the iter-1 "outside RRF" framing is mis-stated**; and C1 is deferred regardless — `conflicts_with` arrays are empty in production); C5 before/after baseline capture (changes confidence magnitudes per regression-baseline rule).
- **Deep Loop:** D3 threshold re-baselining is unmeasured — with all `r=0.5` (no reliability metadata anywhere yet) D3 is NOT a pure no-op; a measured calibration run is required at build time; the 001 content-derived ordering call site is an unread inference; whether any non-prompt-pack continuity-injection path exists (beyond reducer anchors + prompt-pack `variables`) was not exhaustively traced.

**Galadriel saturation note:** galadriel was ~70% saturated against aionforge and contributed exactly one strong net-new candidate — Memory's **C-G1** (the cadence/clock for the C4-C consolidation cursor). Its other transferable signal is the threaded ambient-reflection model (Deep Loop Q5 carried-forward open-questions block, low-med leverage). The determinism spine is what unlocks galadriel's prompt-cache savings, not a galadriel candidate per se.

---

# BROADENING ADDENDUM (Iterations 20–100) — AUTHORITATIVE; SUPERSEDES THE PASS-1 HEADLINES ABOVE

> **Read this first.** Everything above this line is the **pass-1 synthesis (19 iterations, mtime ~18:59)**. The campaign was then broadened to **100 total iterations** (001=38, 002=24, 003=18, 004=20) of read-only adversarial verification + deeper external mining, which was **net deflationary**: it refuted ~12 over-claimed candidates and tempered both meta-spines. The four Executive-Summary headlines and the pass-1 "Ship First" #3 are **partially or wholly superseded** by the corrections below. Where this addendum and the pass-1 body disagree, **this addendum wins.** All corrections trace to banked findings in `00{1..4}/research/deltas/iter-*.jsonl` and `iterations/iteration-*.md`.

## 1. Meta-spine recalibration (the two headlines that did not hold)

| Pass-1 headline | Verdict after broadening | Why |
|---|---|---|
| #1 "PROMOTE-the-off-state-flag is **the single biggest pattern**" | **TEMPERED → 0-of-4 *clean* flips.** Only **C4-A** (Memory idempotency-receipts) is a literal off-state flip. | The other three "promotes" need real work: **C3-A** is NOT a flag flip (`SPECKIT_TEMPORAL_EDGES` is **already ON** — `ENV_REFERENCE.md:296`, `search-flags.ts:706`) — edge-presence currentness still needs a **read-side build + store reconciliation**; **C4** (Advisor) is a build not a graduation (next row); **C6-A** is a seam change. "Flip the flag" describes exactly one candidate, not the spine. |
| #2 "Determinism is **the strongest unifying spine**" | **TEMPERED → genuinely shared by 2-of-4.** Memory authors it (C-X1) and one consumer is real; Code Graph / Deep Loop reuse is thinner than billed. | The determinism *primitive* is still the single most-transferable artifact, but the "all four fuse and cache" framing over-counts. Deep Loop's `D-reproducible-fold` and Code Graph's impact-channel fuse are real but lighter. Several determinism GOs are "byte-identical-**by-default**" only **conditional** on "default = current fusion math" — resting on the **fusion-bonus unit test the pass-1 body already lists as open** (§Provenance). |

## 2. Candidate-level corrections (refutations / reclassifications)

| Candidate | Pass-1 claim | Correction (banked) | Evidence |
|---|---|---|---|
| **C4** (Advisor) | "**GRADUATION** of a Beta-posterior shadow estimator" | **NO Beta math exists.** The shadow estimator is a **raw-frequency** estimator with shadow guardrails — there is nothing to "graduate." C4 is a **BUILD** (add the Beta posterior), not a promote. | `feedback-calibration.ts:173-177, :230-237` |
| **D2-reliability** (Deep Loop) | "the **KEYSTONE** reliability signal D1/D3/Q2 consume" | **Wholly absent net-new build.** No `metadata.reliability` is written anywhere — **every input is `r=0.5` today**. D2 is unmeasured; **D3 is NOT a no-op** under all-0.5; **Q2 is NO-GO until D2 exists**. It is a keystone *by design*, not a present signal. | `upsert.cjs:179,224` (no reliability writer); `convergence.cjs:112-121` |
| **C3-A** (Memory) — *was Ship-First #3* | "**flip temporal-edges ON** → clean reversible flip" | **KILLED as a flip → reclassified read-side build.** Flag is already ON; making "currentness = edge presence" the live retirement path needs read-path wiring + temporal-store reconciliation (causal-edge vs lineage must unify, not fork). | `contradiction-detection.ts:75-77,99-110`; `vector-index-schema.ts:184-185` |
| **C5** (Advisor) "~13% confidence skew" | quantified leverage "~13%" | **UNSOURCED — asserted, not measured.** `grep` for `13%`/`~13`/`0.13`/confidence-skew across `.opencode/specs` + `system-skill-advisor` = **ZERO** matches (fails the regression-baseline rule). The per-lane skew *mechanism* is real, but **capture a baseline before claiming any number.** | `feedback-calibration.ts:167-189` (shadow-gated, collapses without `laneAttributionBySkill`); grep=0 |
| **Q4-C1** (Code Graph) | rank-time trust multiplier as a "**neutral no-op** fallback" | **A multiplicative-neutral fallback FAILS** against the rowid baseline (re-orders ties). Use **RRF-additive** trust blending, not `score × reliability` with neutral=1. | iter I2 (002) re-verify vs rowid baseline |
| **Q6-C2** (Code Graph) generation bump site | sketch bumped generation at `ensure-ready.ts:497` | **REFUTED.** `:497` is `setLastGitHead` (git-HEAD bookkeeping) inside an **out-of-scope branch** — NOT a generation bump. Q6-C2 needs a different, scan-commit-atomic bump site. | iter J6 (002) re-verify |
| **DL order-independent-merge** | "SOLID" determinism win | **WEAKER.** `finding.id` is not always present; merge keys on `id‖title` (`fanout-merge.cjs:123`) with first-seen-wins dedup — that is a dedup, not a total-order tiebreak. | `fanout-merge.cjs:123-131` |
| **DL failure-class** | "SOLID" classification at the pool | **WEAKER.** `settleItem` computes **no** class — it flattens `{name,message}` (`fanout-pool.cjs:103-106`); the class is computed **upstream in fanout-run**, not in the pool. | `fanout-pool.cjs:103-106` |

## 3. Corrected "Ship First" ranking

**Removed from the pass-1 top-10:** **C4** (Advisor — not a graduation, needs Beta build) and **C1** (Advisor — gated by the C2-A classifier / negative-mass question). **Demoted:** **C4-A**, **C6-A**, **det-impact-order** drop out of the lead slots (still in Wave-0, but each is now caveated, not "free").

**Implementation-ready spearhead (additive / reversible / no benchmark required) — ship in this order:**

| # | Pick | Subsystem | Status after broadening |
|---|---|---|---|
| 1 | **Q6-anchor FIX** | Deep Loop | Unchanged — the live framework bug; template-only; the only unconditional win. |
| 2 | **C4-A** idempotency-receipts default-on | Memory | The **one literal off-state flip** that survived; confident, but **no measured benefit number**. |
| 3 | **C-X1 + C6-A (clock form)** | Memory | Determinism primitive + rank-time-decay clock; both `S→M`; C-X1 sequences before C2-B. |
| 4 | **Deep Loop trio** — merge-tiebreak / failure-class / pool-gauges | Deep Loop | Ship with the §2 caveats (merge & failure-class are WEAKER than billed; gauges are clean). |
| 5 | **Q6-C1** generation watermark + **closed-vocab** + **Q4-C1 (RRF-additive)** | Code Graph | Each carries its J-round caveat (Q6-C1/closed-vocab WEAKER; Q4-C1 must be additive, not multiplicative-neutral). |
| 6 | **C9** graceful embedder-degrade | Memory | Credible but **vector-branch-caveated** (the keep-lexical substrate exists; confirm the null-embedding branch). |

**Four classes that need per-candidate validation / a benchmark BEFORE go (not Wave-0):**
1. **Reliability-weighted learning** (D2 net-new + D3 unmeasured + Q2 gated) — no reliability data exists yet.
2. **Promote-off-state cluster** — 0-of-4 clean flips; C3-A is a read-side build.
3. **Advisor C4 / C5** — C4 needs the Beta build; C5 needs a captured baseline (the 13% is unsourced).
4. **Code Graph bi-temporal / PPR** — shared schema migration; edge-bitemporal is NO-GO as-scoped; PPR is unbuilt.

## 4. Shared infrastructure — build once, reuse N (confirmed by broadening)

| Shared module | Consumers | Note |
|---|---|---|
| **Total-comparator + content-derived-id module** | C5-B, C-X1, det-impact-order, D-reproducible-fold | **Portability gotcha:** JS `(a,b)=>b-a` is **not a total order** (NaN / −0 poison it). Every determinism candidate needs a **hand-written total comparator + content-derived id tiebreak** — build it once. |
| **Beta posterior (anti-flood)** | Advisor **C4** + Deep Loop **D2** | Same `(α+for)/(α+β+for+against)` math, cold-start 0.5, count-floor. Neither ships it today; build once, wire twice. |
| **Bi-temporal validity-window shape** | Memory **C3-B** (causal edges) + Code Graph **Q1-C1** (`code_edges`) | Same four-timestamp / `valid_*`+`invalid_at` schema; reconcile so Memory's causal-edge store and Code Graph's edge table share the column shape rather than forking. |

## 5. Three new gaps surfaced by the broadening (net-new, beyond the pass-1 6 spines)

1. **CG incremental-edge-staleness repair** — ~~`structural-indexer.ts:2171-2177` skips re-index on unchanged **mtime**~~ **[CORRECTED by 006: the skip is content-hash-gated, NOT mtime (`isFileStale code-graph-db.ts:1046-1056`); the real gap is dependency-transitivity — `queryFileImportDependents` is wired only to the read path, so a file whose *dependency* changed (own content-hash stable) leaves stale edges. See `synthesis/04` + the `01` CG-edge-staleness GO.]** (Code Graph.)
2. **DL newInfoRatio audit** — `convergence.cjs:285, :107-141, :378-381` self-grades `newInfoRatio` but the grade is **never ingested** back into the loop's stop/continue decision — a self-assessment that is computed and dropped. (Deep Loop.)
3. **Recall-trust spine + ingest bypass** — the untrusted-recall wrapper (`envelope.ts:284-295`, C8) exists at the render boundary; ~~the **ingest path bypasses it** (`extraction-adapter.ts:247`)~~ **[SUPERSEDED — REFUTED by the 027-REVISIT ADDENDUM edit #3 below + `synthesis/03 §A`: `working_memory` carries no content; ingest is pointer-only. C8 is a real *render*-gap, not an ingest-bypass.]** (Memory; security-adjacent.)

## 6. GO-evidence caveats (read before quoting any leverage)

- **No candidate has a measured before/after benefit number** — every "leverage HIGH" is **structural inference**, never a benchmarked delta. This is the **highest residual unknown** at 100 iterations.
- **C5's "~13%" is unsourced** (§2) — do not cite it; capture a baseline first.
- **C9 / Q6-C2 / Q6-C1 / closed-vocab are WEAKER** than their pass-1 billing (each caveated above).
- Determinism "byte-identical-by-default" GOs are **conditional** on the still-open fusion-bonus unit test.

## 7. Follow-ups (iteration-101 territory — a follow-on packet, NOT this campaign)

1. **Mine `aionforge-procedural`** — the one external crate genuinely skipped. It maps to the Round-A-refuted Memory "procedural/bad-pattern" cluster but applied to **Skill selection** (Advisor), where it is net-new: **outcome-weighted skill ranking** (Beta-posterior reliability `(α₀+s)/(α₀+β₀+s+f)`, blended `score = similarity × reliability × penalty`, fresh skill = 0.5) + **per-skill failure-mode recall**. Seam: `system-skill-advisor` scorer + a new skill-outcome store. (Candidate `SA-outcome-weighted-ranking`, iter-018.)
2. **Run ONE benefit micro-benchmark** — D2 reliability (does it out-earn existing confirmation/relevance signals when every input is `r=0.5`?) or C2-C single-hop graph-gating precision. Converts the highest residual unknown (§6) into a measured delta.

> **Coverage statement (honest):** External mining is **complete except `aionforge-procedural`** (one crate, follow-up #1). All other aionforge surfaces (embed/capture/mcp transport/cli/tui/config; the memory-* consumer skills) and **all** galadriel surfaces (SOUL/CONTEXT/TOOLS persona, tower/web, discord, cmd) were confirmed **no-transfer** (plumbing / agent-loop / persona). The broadening added **zero material new over-claims**; its net effect was to make the pass-1 roadmap honest.

---

# 027-REVISIT ADDENDUM (child `005-revisit-027`, 50 iterations) — CROSS-PACKET RECONCILIATION

> A fifth child (`005-revisit-027`, 50 read-only iterations → packet total **150**) reconciled this roadmap's findings against **packet 027's shipped code** (the XCE-Derived Spec Kit Refinement epic: memory write-safety, retention, causal-edge lifecycle, feedback reducers, incremental index, triggers, search resilience, daemon re-election, observability, derived-memory). Full ledger: **`005-revisit-027/research/research.md`** (authoritative). This addendum records the **edits the revisit makes to THIS roadmap** + the cross-packet headline.

## Headline

**028 is overwhelmingly net-additive to 027 — zero supersedes, zero contradicts across all ten revisited subjects** (EXTENDS ×6, ALREADY-COVERED ×1, NO-TRANSFER ×3). And the relationship is bidirectional: **027's already-shipped doctrine supplies the design answers for 028's open candidates** (its always-on fail-closed scrubber is the pattern for C8; its always-on/default-off rule decides C8 + justifies C4-A; its shadow-gated reducers are the fix template for the dormant `newInfoRatio`) **and independently validates 028's own "0-of-4 clean flips" deflation** ("a built-behind-a-flag feature is a bet not yet cashed in"). 027's peck verification-discipline even pre-encodes 028's adversarial-verify methodology.

## Edits to this roadmap (apply at implementation time)

1. **Correct the content-hash mis-citation** (§1 + §4 shared-infra row + C4-B seam, `:33`): `memory-index.ts:281` is `createScanKey` (a 16-char scan-options hash), **not** a content base. The real bases are `computeContentHash` (content-body, `memory-parser.ts:914-916`) and `hashJson`+`normalizeForHash` (canonical-field, `idempotency-receipts.ts:81-102`). Only C4-B's `derived_id` hash is genuinely net-new.
2. **C3-D / skip-closed is NOT a hard C3-A gate** (§2 + Sequencing Notes): adversarial verification downgraded the promoter-fork to *theoretical + tombstone-recoverable* hygiene (no automatic producer creates the `contradicts`-on-a-frontmatter-pair collision). Ship the `AND invalid_at IS NULL` guard as cheap defensive hardening before C3-A, not as a data-loss blocker.
3. **C8 reclassified** (§6 + the "new gaps" row): the ingest-bypass framing is **refuted** (`working_memory` carries no content; ingest is pointer-only). C8 is a **real render-gap** — no untrusted-recall escaper exists anywhere, and `getTieredContent` HOT-tier emits raw memory-file content into the agent loop. Keep it BUILD-new always-on, reusing 027's fail-closed scrubber **pattern** (not its write-lane seam). Residual: leverage is gated on the threat model ("can untrusted content become a recalled memory" — Round O found yes, via `memory_save`).
4. **Bi-temporal scoping** (§2 + §4 shared-infra row): consumers are **causal + lineage + code_edges**; **exclude retention TTL** (physical deletion is the opposite of edge-presence currentness — a category error). Canonical supersede writer = **lineage** (causal `invalid_at` is a derived projection); the real "current memory" read store is **`active_memory_projection`** (neither pass-1 framing named it). C3-C "Current"-replaces-projection would be **L** (≈12 JOIN sites / 2 writers), not M.
4b. **C5-B is net-new on the RRF surface too** (§1): the live `compareDeterministicRows` ties on raw rowid and `rrf-fusion.ts` has no tiebreak; C5-B reuses `computeContentHash` and is **S** (its value is content-derived tie *stability*, since the comparator is already total via the unique rowid). C4-B's `derived_id` **must include anchors** or the legacy anchor-inclusive UNIQUE backfill rejects.

## 027-revisit GO additions (net-new candidates this revisit surfaced)

- **C9 recall-degrade** (Memory) — EXTENDS, S: 027's embedder subsystem is storage-side only; recall THROWS on a null embedding. Detect-unavailable → lexical + report.
- **`memory_history` valid-time as-of tool** (Memory) — the lib-only `resolveLineageAsOf`/`inspectLineageChain` are unexposed; a ~5-surface tool add exposes a never-surfaced capability (full AsKnownAt is gated on C3-B).
- **gauge `lag`/pending/failed** (Memory) — S, decoupled from C4-C (rides the existing `post_insert_enrichment_status` column + `created_at` + health query).
- **Q7 lease-classification telemetry** (Code-Graph launcher) — low-priority observability (no metrics sink today).
- **027-internal hardening** (not transfers): Q4 sliding-TTL absolute-deleteAfter ceiling; the `search-results.ts:528` `ce.edge_id` CTE-alias quirk.

## Follow-ups for the 028 parent's sibling children (out of the Memory-scoped 005 mandate)

- **028 Advisor-C4 × 027 `005-advisor-feedback-calibration`** — the bounded-Beta posterior applies to the *advisor* (→ `002-code-graph`/`003-skill-advisor` reconciliation, not Memory).
- **028 Code-Graph cluster (Q1-C1 / Q6-C1 / CG-edge-staleness) × 027 codegraph-tombstone-audit** — edge-currentness overlap the Memory-scoped revisit bounced as "Code-Graph-scoped."

> **Single most-likely-wrong (whole revisit):** the C8 verdict — its seam moved once under adversarial pressure and its leverage rests on the threat model strength. Runner-up: the C3-B four-timestamp additivity claim (no migration spec exists to verify). The revisit was net-deflationary and fabricated no benefit numbers.

---

# MEMORY-SYSTEMS ADDENDUM (child `007-memory-systems`, 22 iterations) — EXTERNAL AGENT-MEMORY MINING

> 4-model mining (DeepSeek v4 Pro · MiMo v2.5 Pro · Kimi K2.7 · Opus 4.8 native) of **Mem0 · Graphiti/Zep · Letta/MemGPT · Cognee**, novelty-diffed against everything 027/028 already shipped. Stopped at **22 of a planned 40** at the honest saturation point. Plain-language before→after: `synthesis/06-memory-systems-findings.md`. Full evidence: `007-memory-systems/research/{research.md, iterations/, deltas/}`. **Research-only.**

## Headline
A **top-7 roadmap** + **2 new initiatives**, net-deflationary: 3 "net-new" claims were refuted as already-implemented (community detection, query decomposition, the determinism layer), and 2 headline candidates were downsized by blast-radius (`CG-agentic-tool-loop` H/L→L; `MEM-fused-summary-channel` M/M→L). The durable spearhead is **event-time fact-invalidation (H/S, reader-transparent)**.

## Top-7 (ranked; feeds the same Wave structure as `synthesis/01`)
| # | id | value | lev/eff | seam | subsystem |
|---|---|---|---|---|---|
| 1 | `MEM-fact-invalidation-event-time` | close superseded edges at event-time not now() — correct bitemporal history | H/**S** | `lib/graph/temporal-edges.ts:81-96` | Memory |
| 2 | `CG-iterative-context-extension` | answer-as-next-query recall w/ convergence stop (smallest safe new build) | H/M | `handlers/memory-context.ts` (new strategy) | Memory (+Deep-Loop) |
| 3 | `MEM-tiered-recall-budget` | per-section/per-tier budgets vs one flat pressure ratio | H/M | `lib/cognitive/pressure-monitor.ts` + `memory-context.ts` | Memory |
| 4 | `LT-compaction-fallback-ladder` | summarize tier before hard truncation | M/S | `handlers/memory-context.ts:492-532` | Memory |
| 5 | `MEM-fused-summary-channel` | promote built community/summaries from fallback → fused RRF lane | **L** (corrected) | `lib/search/hybrid-search.ts` (~5 sites + weights) | Memory |
| 6 | `DL-iterative-retrieval-loop` | derive next-focus from prior answer (convergence already built) | H/M | `deep-research/scripts/reduce-state.cjs:538` | Deep-Loop |
| 7 | `CG-agentic-tool-loop` | ReAct tool-loop as a new memory_context strategy | **L** (corrected) | `handlers/memory-context.ts:1291-1311` + greenfield governor | Memory |

Plus cheap wins: `CG-declarative-regex-entity-config` (L/S), `GR-temporal-ordering-invalidation` (H/S, scope to conflicting relation-pairs), `M0-bm25-sigmoid-calibration` / `M0-entity-cardinality-penalty` / `M0-spacy-lemmatization-bm25` (small ranking gains), `LT-turn-cadence-trigger` (M/S).

## Two new initiatives (Wave-2, prove-first)
- **Semantic edge layer** — per-edge embeddings + semantic edge retrieval (the substrate the memory-ID graph lacks). Unlocks `CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-fact-embedding-on-edge`, `GR-semantic-fact-dedup-merge`, `GR-semantic-invalidation-discovery` *together*. One coherent build, not five ships.
- **Async sleep-time consolidation** — background, cadence-gated memory reorganization (`LT-bg-sleeptime-agent` + `LT-turn-cadence-trigger` + `LT-llm-transcript-chunking`), distinct from our synchronous on-save reconsolidation. `LT-tool-rule-memory-chain` is the loop-governor that de-risks the agentic-tool-loop (#7).

## What this mining did NOT change (already internal)
Community detection (`community-detection.ts`, wired, default-on) · query decomposition (`query-decomposer.ts`, wired) · composite-edge dedup (`insertEdge` superset key) · the C5 determinism layer (complete) · Mem0 entity-cleanup-on-update + pre-fusion gate · Graphiti 3-channel RRF (ours supersets). Episode-model candidates are gated (no episode model). Letta char-limit eviction refuted (advisory only).

> **Single most-likely-wrong (this addendum):** `CG-content-hash-reprocessing-trigger` and `CG-graph-neighborhood-projection` are unverified against the existing reindex / `enableCausalBoost` paths — verify before building. No benefit number is measured anywhere; all lev/eff are structural inference.
