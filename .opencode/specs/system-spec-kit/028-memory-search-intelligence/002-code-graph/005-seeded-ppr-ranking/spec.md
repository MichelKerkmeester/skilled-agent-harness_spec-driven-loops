---
title: "Feature Specification: Code-Graph Seeded-PPR Impact Ranking (Structural Retrieval Intelligence) (028/002 impl)"
description: "Build the net-new multi-hop ranking machinery the code-graph impact walk lacks: Q3-C1 query-seeded personalized-PageRank, GATED to impact/multi-hop modes (single-hop expansion off for precision), bounded by a power-method cap for the 400ms walk budget, reusing 027's already-shipped causal-edge weighted-walk substrate rather than a second walker. Plus its precision gate (CG-class-gated-expansion, needs a new query-class taxonomy the structural classifier does not have), a directionality fix (CG-undirected-projection), and multi-hop reliability decay (Q4-C2). lexical-vector-seed-union is NO-GO — code-graph deliberately disowned its vector backend. Every candidate is PENDING; PPR is UNBUILT in the live code (grep-confirmed). None shipped in the flat Wave-0 (030)."
trigger_phrases:
  - "code graph seeded ppr impact ranking"
  - "personalized pagerank class gated expansion"
  - "code graph multi hop ranking 027 causal bfs"
  - "undirected projection associative reach"
  - "028 code-graph ppr impl phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored re-plan spec for the code-graph seeded-PPR impact-ranking cluster"
    next_safe_action: "Confirm 027 collectWeightedWalk reuse, then build bounded PPR"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
      - "../../research/synthesis/04-sibling-and-cross-cutting.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Feature Specification: Code-Graph Seeded-PPR Impact Ranking (Structural Retrieval Intelligence)

## EXECUTIVE SUMMARY

The code-graph impact/blast-radius walk ranks callers by **flat single-hop edge enumeration in DB iteration order** — no centrality, no multi-hop spread, no mass propagation. The 028 research maps aionforge's `Graph` retrieval signal (native **Personalized PageRank** seeded on query entities, spread across the associative graph, best-first by PageRank score) onto this seam, and the whole 200-iteration campaign confirms the same thing twice: the impact walk at `code-graph-context.ts:668-676` is reverse `CALLS`/`IMPORTS` directed enumeration bounded by a 400ms latency budget that truncates in **arbitrary DB order** (`research.md` Internal Baseline, iter-2 finding 12), and **PPR is entirely UNBUILT** — `grep pagerank|personaliz|teleport|damping|ppr|random-walk` over the live `system-code-graph/mcp_server/` returns ZERO hits (`research.md`; re-confirmed against the live tree at plan time). This sub-phase builds the net-new query-seeded multi-hop ranking machinery: **Q3-C1** seeded personalized-PageRank, **GATED** to impact/multi-hop modes only (aionforge's hard lesson: indiscriminate graph expansion measurably hurts single-hop precision while it helps multi-hop recall), **bounded** by a power-method iteration cap for the 400ms budget, with the PPR-reached set intersected against the current edge set; plus its precision gate (**CG-class-gated-expansion**, which needs a new query-class taxonomy the structural classifier does not have), a directionality fix (**CG-undirected-projection**), and multi-hop reliability decay (**Q4-C2**). **lexical-vector-seed-union is NO-GO** — the code-graph module explicitly disowned its semantic/vector backend, so a vector-seed union is a scope violation, not a gap.

**Key Decisions**: REUSE, do not rebuild — Q3-C1 must spread mass over **027's already-shipped causal-edge weighted-walk substrate** (`collectWeightedWalk` / `collectCausalWeightedNeighbors` in the Memory MCP `lib/graph/bfs-traversal.ts`), confirming the traversal API is reusable before standing up a second graph-walk engine (`synthesis/04`). GATE expansion to impact/multi-hop modes only — never the cheap neighborhood/outline default — to avoid hurting single-hop precision. The four BUILD candidates (Q3-C1 + its class-gate + undirected projection + Q4-C2 decay) form one ranking-machinery cluster that must land together or each refines a non-existent feature; the seed-union candidate is explicitly **CUT** (NO-GO). Every candidate is **PENDING** — none was implemented in the flat Wave-0 (packet 030), which was scoped to additive/reversible/no-benchmark items and explicitly listed Q3-C1 as Wave-2 (`030.../spec.md` §3 Out of Scope, §14 absent).

**Critical Dependencies**: Q3-C1 depends on (a) **027's reusable weighted-walk traversal substrate** (confirm-then-reuse, not rebuild); (b) a **new query-class taxonomy** — the live `query-intent-classifier.ts` emits only `QueryIntent = 'structural'`, it has NO SingleHop/MultiHop/Entity taxonomy and explicitly disowned its semantic backend, so the class-gate must build that taxonomy first; and (c) a **retrieval benchmark that does not exist** — no candidate campaign-wide has a measured before/after number, and PPR ranking quality cannot be validated without one. CG-undirected-projection and Q4-C2 both **refine the unbuilt Q3-C1** and cannot land before it. The Q1-C1 `invalid_at`-current-set intersection that PPR should respect is itself a separate (DEFER-speculative) sub-phase, so Q3-C1's current-set intersection degrades to "physical edge presence" until that lands.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 (net-new BUILD; benchmark-gated; refines an unbuilt feature) |
| **Status** | Draft (re-plan; not yet implemented) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/002-code-graph |
| **Source research** | `../research/research.md` (Internal Baseline + iter-2/3/8/14); `../../research/roadmap.md` (§3 Query-Class Routing, BROADENING §2); `../../research/synthesis/{01-go-candidates.md, 03, 04}` |
| **Shipped-record (done-candidate evidence)** | `../../../030-memory-search-intelligence-impl/spec.md` §14 + commits `1ecc531431..HEAD` (Q3-C1 cluster ABSENT → all PENDING; sibling Q4-C1 trust blend shipped `e21caf5de6`, out of this cluster) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph `code_graph_context` impact mode ranks callers/callees by a **flat single-hop reverse-edge enumeration in DB iteration order** — there is no centrality, no recursive spread, no mass propagation [CONFIRMED: `research.md` Internal Baseline; iter-2 finding 12]. The impact walk at `code-graph-context.ts:668-676` enumerates reverse `CALLS` then `IMPORTS` edges via `queryEdgesTo`, pushes them in DB order, and is bounded by a 400ms latency budget (`expandAnchor`, `:401-403`, `budgetMs = 400`) that **truncates in arbitrary order** — so the most-central blast-radius callers are not guaranteed to surface before the budget cuts off, and `score` is hardcoded `null` (`:307` region) [CONFIRMED]. aionforge's `Graph` signal is native Personalized PageRank seeded on query entities, spread over the associative graph, best-first by PageRank, with the reached set intersected against the current-support membership [CONFIRMED: iter-2 finding 13, `retrieval.md:193-198`] — and aionforge GATES it to `MultiHop`/`Entity` classes only because "indiscriminate graph expansion measurably hurts simple single-hop precision while it helps multi-hop recall" [CONFIRMED: `retrieval.md:108-118`]. The code-graph has **none of this**: `grep pagerank|personaliz|teleport|damping|ppr|random-walk` over the live `system-code-graph/mcp_server/` returns ZERO hits [CONFIRMED: `research.md`; re-grepped at plan time]. Worse, the candidates that would make PPR precision-safe presuppose machinery the code-graph deliberately does not have — the structural query classifier emits only `QueryIntent = 'structural'` with no SingleHop/MultiHop/Entity taxonomy and explicitly disowned its semantic backend [CONFIRMED: `query-intent-classifier.ts:6, 82-92`; iter-14], and the seed resolver is lexical/structural-only with no vector provider [CONFIRMED: `seed-resolver.ts`; iter-14 NO-GO].

### Purpose
Give the impact/blast-radius walk a **query-seeded multi-hop ranking** so the most-central callers surface first under the 400ms budget instead of being truncated in arbitrary DB order — by seeding personalized-PageRank on the subject symbol(s), spreading mass over **027's already-shipped causal-edge weighted-walk substrate** (not a second walker), ordering results by PPR score, and **gating** the expansion to impact/multi-hop modes only so single-hop precision is never degraded. Build the precision gate (a new query-class taxonomy), the directionality fix (undirected projection so seed mass reaches callers instead of sinking), and the multi-hop reliability decay; explicitly CUT the vector-seed-union as a scope violation.

### Critical context (from the 028 research + BROADENING + 006 sibling addenda, authoritative — supersede pass-1)
- **Q3-C1's PPR is UNBUILT — this is the major iter-14 correction.** `grep PPR/PageRank/random-walk` is empty across the live code-graph. So **CG-class-gated-expansion and CG-undirected-projection refine a non-existent feature** — they cannot land before Q3-C1 itself is built [`research.md`; iter-14 "Key correction (major)"; `synthesis/03`].
- **PPR MUST be GATED, never default-on.** Apply aionforge's lesson: run PPR/expansion ONLY for impact/multi-hop modes; the cheap neighborhood/outline default must stay flat, or single-hop precision measurably degrades [`retrieval.md:108-118`; iter-2 finding 14(b); roadmap §3].
- **REUSE 027's causal-BFS traversal substrate — do NOT stand up a second walker.** The net-new query-seeded multi-hop ranking should reuse 027's already-shipped causal-edge weighted-walk traversal (`collectWeightedWalk`/`collectCausalWeightedNeighbors`, Memory MCP `lib/graph/bfs-traversal.ts`) rather than a second graph-walk engine — **confirm the traversal API is reusable before building PPR** [`synthesis/04` "Seeded-PPR (Q3-C1) × 027's existing causal-BFS traversal"; `synthesis/01` Wave-2 row].
- **Roadmap-caveat correction (plan-time):** the roadmap/synthesis line "027 has only edge-count/degree; the **old PageRank helper was 'never wired'**" is partly INFERRED and does not fully hold against the live tree — there is NO PageRank helper in either the code-graph or Memory MCP (`grep` empty in both `lib/graph/`). What 027 DOES ship and what Q3-C1 reuses is the **weighted-walk substrate** (`collectWeightedWalk` seeds+maxHops+weighted frontier) plus degree/momentum signals (`graph-signals.ts`) and Louvain community detection — not a dormant PPR helper. Treat "reuse the weighted-walk traversal" as the real reuse target; do not hunt for a non-existent PageRank helper to wire.
- **The current-set intersection degrades gracefully.** Q3-C1 should intersect the PPR-reached set with the `invalid_at IS NULL` current set, but `invalid_at`/`valid_at` columns DO NOT EXIST on `code_edges` today (no temporal cols; Q1-C1 is DEFER-speculative in a separate sub-phase) [CONFIRMED: `research.md` Internal Baseline; `grep invalid_at` empty]. Until Q1-C1 lands, the intersection degrades to physical-edge-presence (the current behavior), which is correct-but-not-as-of [iter-2 finding 14(c)].
- **lexical-vector-seed-union is NO-GO (CUT, not deferred).** The lexical seed half exists (disabled fallback) but the VECTOR half does NOT — the module explicitly disowned its semantic backend (structural-only scope). A vector-seed union is a scope violation, not a gap [iter-14 NO-GO; `seed-resolver.ts`; `query-intent-classifier.ts:82-92`].
- **No candidate has a measured before/after benefit number** — every leverage/effort is structural inference, never benchmarked (`synthesis/03` GO-evidence caveats; roadmap BROADENING §6). PPR ranking quality is unprovable without a code-graph retrieval benchmark that does not yet exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the seeded-PPR impact-ranking cluster (6 candidates: 4 BUILD-gated + 1 sub-build + 1 CUT, all PENDING)

| # | Candidate | One-line change | Seam (file:line) | Lev/Eff | Class / Status |
|---|-----------|-----------------|------------------|---------|----------------|
| 1 | **Q3-C1** seeded PPR | Seed personalized-PageRank on the subject symbol(s); spread mass over 027's reused weighted-walk substrate; order impact results by PPR score instead of DB-enumeration order; bounded power-method cap for the 400ms budget; intersect with the current edge set | `code-graph-context.ts:668-676` (impact walk), `:401-403` (`expandAnchor` budget); reuses Memory MCP `lib/graph/bfs-traversal.ts` `collectWeightedWalk` | L→M / L (M-H) | **BUILD** — **PENDING** (PPR UNBUILT; gates 2/3/5; shared-infra-dep + needs-benchmark) |
| 2 | **Q3-C1-seeded-PPR** | The PPR algorithm core itself: seed vector on subject symbol(s), teleport weighted by static edge weights × `metadata.confidence`, bounded power-method iteration cap, best-first ordering — the net-new ranking primitive that candidate 1 wires in | `code-graph-context.ts` (new bounded-PPR primitive); `config-defaults.ts:45-59` (teleport weights) | L / L | **BUILD** — **PENDING** (the core of candidate 1; same shared-infra + benchmark gate) |
| 3 | **CG-class-gated-expansion** | Run PPR/expansion ONLY for impact/multi-hop modes; OFF for the single-hop neighborhood/outline default (the precision gate) — REQUIRES a new SingleHop/MultiHop/Entity query-class taxonomy the structural classifier does not have today | `query-intent-classifier.ts:6` (`QueryIntent='structural'`, NO taxonomy); `code-graph-context.ts:19` (`QueryMode`) | H / M | **BUILD** — **PENDING** (refines unbuilt Q3-C1; needs new taxonomy; CAUTION per iter-14) |
| 4 | **CG-undirected-projection** | Project the PPR graph **undirected** so seed mass reaches callers instead of sinking (a directed PPR seeded on a leaf symbol under-reaches its blast radius) | `code-graph-context.ts:512`/`:668-676` (impact is reverse-directed by design) | M / S | **BUILD** — **PENDING** (refines unbuilt Q3-C1; needs-benchmark per iter-14) |
| 5 | **Q4-C2** multi-hop reliability decay | Reuse the rank-time `reliability` factor (`clamp(confidence) × evidenceClassFactor`) as the per-edge transition weight so an INFERRED 2-hop path ranks below an OBSERVED 1-hop path; folds into the PPR walk | `code-graph-context.ts:350-356` (`reliability` already plumbed); PPR transition weights | M / M | **BUILD** — **PENDING** (deferred-behind-Q3; needs PPR to land first) |
| 6 | **CG-lexical-vector-seed-union** | BM25 seeds UNION vector seeds so lexical keeps expansion alive when the embedder is down | `seed-resolver.ts` (lexical-only, no vector provider) | M / M | **NO-GO** — **CUT** (code-graph deliberately has no vector backend; scope violation, not a gap) |

> **Cluster contract.** Candidates 1+2 are the same Q3-C1 PPR build (the wiring + the algorithm core); 3, 4, 5 each REFINE that build and cannot land before it (iter-14: "class-gated-expansion + undirected-projection refine a non-existent feature"). The cluster must land together or each refines nothing. Candidate 6 is **CUT** — recorded so nothing is silently dropped, but it is a scope violation against the code-graph's deliberate structural-only design, not deferred work.

### Out of Scope (this sub-phase)
- **Q4-C1 rank-time trust multiplier** — the RRF-additive trust blend SHIPPED in Wave-0 (packet 030, commit `e21caf5de6`) and its tuning + the determinism/fuser follow-ups live in the sibling `001-determinism-walk-order` sub-phase. Q4-C2 (candidate 5 here) *reuses* Q4-C1's `reliability` factor as a multi-hop transition weight; it does not re-implement the blend.
- **Q1-C1 code-edge bi-temporal** (`valid_at`/`invalid_at` columns) — DEFER-speculative Wave-2 schema migration in a separate code-graph schema sub-phase. Q3-C1's current-set intersection degrades to physical-edge-presence until it lands.
- **Q6-C1 / Q6-C2 generation watermark**, **CG-edge-staleness / dependency-transitivity**, **det-context-order / fuser-adapter** (the `001-determinism-walk-order` cluster), **Q5 doc-symbol extractor**, **Q2-C1 transient/fatal parser split**, **closed-vocab edge_type** — all separate code-graph sub-phases.
- **The four sibling subsystems** (Memory, Skill Advisor, Deep Loop) — covered by sibling 028 phases (`001-speckit-memory`, `003-skill-advisor`, `004-deep-loop`). The Memory analogue of this same query-class spine (C2-A/C2-C) lives in `001-speckit-memory/003-retrieval-class-routing`; this sub-phase is its code-graph sibling.
- **Re-calibrating PPR/teleport/decay parameter VALUES against a benchmark** — the build lands the *mechanism*; the tuned damping factor, power-method cap, and decay magnitudes are an explicit benchmark follow-up (no code-graph retrieval benchmark exists campaign-wide).
- Modifying packet 030 (the Wave-0 shipped record), the external reference systems under `028.../external/`, the 027 Memory MCP traversal substrate (consumed/confirmed-reusable, not modified), or any sibling subsystem code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify (PENDING Q3-C1) | Replace the flat DB-order impact enumeration at `:668-676` with PPR-score ordering; add the bounded power-method PPR primitive; wire the budget-bounded cap into `expandAnchor` (`:401-403`) |
| `.../system-code-graph/mcp_server/lib/query-intent-classifier.ts` | Modify (PENDING class-gate) | Add a SingleHop/MultiHop/Entity query-class taxonomy (the structural classifier emits only `'structural'` today) so the gate can route PPR ON for impact/multi-hop, OFF for single-hop |
| `.../system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify (PENDING undirected-projection) | Project the PPR graph undirected so seed mass reaches callers (impact is reverse-directed by design) |
| `.../system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify (PENDING Q4-C2 decay) | Reuse the `reliability` factor (`:350-356`) as the per-edge PPR transition weight (INFERRED 2-hop < OBSERVED 1-hop) |
| `.../system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` | Consume only (no modify) | Reuse `collectWeightedWalk`/`collectCausalWeightedNeighbors` as the walk substrate after confirming the API is reusable (027-shipped; do NOT rebuild a second walker) |
| Tests alongside each change | Create | Per-candidate unit + property (PPR convergence/termination under the cap) + adversarial tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Q3-C1 seeds PPR on the subject symbol(s) and orders impact results by PPR score, reusing 027's weighted-walk substrate (NOT a second walker) | The impact walk orders callers by a personalized-PageRank score seeded on the subject symbol(s) instead of DB-enumeration order; the spread runs over 027's `collectWeightedWalk`/`collectCausalWeightedNeighbors` traversal (Memory MCP `lib/graph/bfs-traversal.ts`) after a documented reuse-confirmation; no second graph-walk engine is authored [research: iter-2 finding 14; `synthesis/04`; `synthesis/01` Wave-2] |
| REQ-002 | PPR is bounded for the 400ms impact-walk budget (no unbounded power-method over a large component) | A power-method iteration cap (or equivalent bounded approximation) keeps PPR inside the existing 400ms `expandAnchor` budget (`code-graph-context.ts:401-403`); a property test proves the walk always terminates by the cap; under-budget truncation falls back to the best PPR-ranked prefix, not arbitrary DB order [research: iter-2 finding 14(a); Internal Baseline] |
| REQ-003 | PPR/expansion is GATED to impact/multi-hop modes only; the single-hop neighborhood/outline default stays flat | For an impact/multi-hop query, PPR runs; for the single-hop neighborhood/outline default, PPR is OFF and the cheap flat walk is unchanged — this requires a new SingleHop/MultiHop/Entity query-class taxonomy (the live `query-intent-classifier.ts` emits only `'structural'`); single-hop precision is not degraded by graph over-expansion [research: iter-2 finding 14(b); `retrieval.md:108-118`; iter-14 CAUTION] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The PPR graph is projected undirected so seed mass reaches callers (does not sink) | The PPR projection is undirected for associative reach so a seed on a leaf symbol still reaches its blast-radius callers instead of sinking; the directed reverse-edge semantics of the flat walk are preserved for the non-PPR path [research: iter-8 `undirected-projection-for-associative-reach`; iter-14 NEEDS-BENCHMARK] |
| REQ-005 | Q4-C2 multi-hop reliability decay reuses the rank-time `reliability` factor as the per-edge transition weight | The PPR transition weight folds in `reliability = clamp(metadata.confidence) × evidenceClassFactor` (the factor already plumbed at `code-graph-context.ts:350-356`) so an INFERRED 2-hop path ranks below an OBSERVED 1-hop path; this reuses the Q4-C1 factor, it does not re-implement the trust blend [research: iter-3 Q4 candidate C2 "deferred-behind-Q3"] |
| REQ-006 | The PPR-reached set is intersected with the current edge set, degrading gracefully when temporal columns are absent | PPR ranking intersects with the current edge set; because `invalid_at`/`valid_at` do NOT exist on `code_edges` today (Q1-C1 DEFER-speculative, separate sub-phase), the intersection degrades to physical-edge-presence (current behavior) and is wired to consume `invalid_at IS NULL` ONLY once Q1-C1 lands [research: iter-2 finding 14(c); Internal Baseline; `grep invalid_at` empty] |
| REQ-007 | Every PENDING candidate names its gate; the CUT candidate is recorded so nothing is silently dropped | Q3-C1 + algorithm core (shared-infra-dep 027 walk + needs-benchmark), class-gate (needs-new-taxonomy), undirected-projection (needs-benchmark), Q4-C2 (needs-Q3-first) each carry a research-cited gate in section 12 / CANDIDATE STATUS; CG-lexical-vector-seed-union is recorded as CUT (NO-GO scope violation), not silently dropped [research: iter-14 NO-GO; `synthesis/01`] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For an impact/multi-hop query, the most-central blast-radius callers surface first by PPR score under the 400ms budget — not arbitrary DB-enumeration order — and the PPR spread reuses 027's weighted-walk traversal (no second walker authored).
- **SC-002**: For the single-hop neighborhood/outline default, PPR is OFF and the cheap flat walk output is unchanged — single-hop precision is provably not degraded by the new machinery (the aionforge gating lesson honored).
- **SC-003**: PPR always terminates inside the 400ms budget (bounded power-method cap; property-tested); a budget cut returns the best PPR-ranked prefix, never arbitrary truncation.
- **SC-004**: The cluster's refinements (class-gate taxonomy, undirected projection, Q4-C2 decay) each ship on top of a built Q3-C1 — none refines a non-existent feature — and the CUT seed-union is recorded with its NO-GO rationale so nothing is silently dropped.
- **SC-005**: Typecheck, build, focused per-candidate tests, the existing code-graph suite, and `validate.sh --strict` on this packet all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unbounded power-method over a large component blows the 400ms budget | High — impact walk latency regression | Bounded iteration cap / approximation; property-test termination; best-prefix fallback on budget cut (REQ-002) |
| Risk | PPR run on the single-hop default degrades precision (the aionforge failure mode) | High — demotes the right exact-symbol answer | GATE to impact/multi-hop modes only via the new taxonomy; never default-on (REQ-003) |
| Risk | A second graph-walk engine is built instead of reusing 027's substrate | Med — duplicate traversal logic, drift | Confirm `collectWeightedWalk` API is reusable FIRST; reuse it; do not author a second walker (REQ-001; `synthesis/04`) |
| Risk | Class-gate/undirected/decay are built before Q3-C1 exists (refine a non-existent feature) | High — wasted build on unbuilt machinery | Land Q3-C1 first; 3/4/5 are explicitly contingent refinements (iter-14 key correction) |
| Risk | The seed-union is mistaken for deferred work and someone tries to wire a vector backend | Med — scope violation against structural-only design | Record CG-lexical-vector-seed-union as CUT / NO-GO, not deferred (REQ-007; iter-14) |
| Dependency | 027's causal-edge weighted-walk traversal substrate (`collectWeightedWalk`/`collectCausalWeightedNeighbors`, Memory MCP `lib/graph/bfs-traversal.ts`) | Blocks REQ-001 (PPR spread) | Confirm-then-reuse; do not modify or rebuild (`synthesis/04`) |
| Dependency | A new SingleHop/MultiHop/Entity query-class taxonomy (the structural classifier emits only `'structural'`) | Blocks REQ-003 (class-gate) | Build the taxonomy as part of the class-gate; the structural classifier disowned its semantic backend (`query-intent-classifier.ts:82-92`) |
| Dependency | A code-graph retrieval benchmark | Blocks PPR/undirected/decay quality validation | None exists campaign-wide; build/borrow one before claiming a ranking-quality delta (`synthesis/03`) |
| Dependency | Q1-C1 `invalid_at`/`valid_at` columns (separate DEFER-speculative sub-phase) | Limits REQ-006 to physical-edge-presence | Degrade the current-set intersection gracefully; wire `invalid_at IS NULL` only once Q1-C1 lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: PPR must run inside the existing 400ms impact-walk budget (`code-graph-context.ts:401-403`); the bounded power-method cap is the hard guard, and a budget cut must return the best PPR-ranked prefix, never arbitrary DB-order truncation.
- **NFR-P02**: The single-hop neighborhood/outline path must add **zero** PPR cost — the gate (REQ-003) short-circuits before any walk, so the cheap default is byte-identical to today.

### Security
- **NFR-S01**: No new external data sink or trust boundary; the code-graph context render is JSON-escaped and trusted-source (the broad cross-cutting C8 render generalization was refuted/reachability-gated for code-graph; `synthesis/04`). PPR is a ranking re-order over existing structural edges, not a new content path.

### Reliability
- **NFR-R01**: With the gate OFF (single-hop default) or PPR disabled by flag, the impact-walk output is the current flat enumeration — the new machinery is reversible by gate/flag, and the cheap default never regresses.

---

## 8. EDGE CASES

### Data Boundaries
- **Seed symbol with no incident edges** (isolated node): PPR returns the seed alone with no spread; the walk degrades to the current single-node result, never errors.
- **Leaf symbol seeded under directed projection**: directed PPR would under-reach (mass sinks); the undirected projection (REQ-004) is the fix — a leaf still reaches its blast-radius callers.
- **Edge with no trust metadata** (neutral) under Q4-C2 decay: `reliability` defaults to neutral (`1.0`/`null`-safe) so a metadata-less edge keeps its structural transition weight — no demotion from absent metadata.
- **`invalid_at` columns absent** (today): the current-set intersection (REQ-006) degrades to physical-edge-presence; PPR ranks over live edges exactly as the flat walk sees them.

### Error Scenarios
- **Power-method does not converge within the cap**: returns the best-so-far PPR ranking at the cap (REQ-002), marked bounded — never loops, never blows the budget.
- **Class taxonomy returns an ambiguous/neutral class**: the gate defaults to PPR-OFF (the safe single-hop behavior), never PPR-ON on an unclassified query — fail-safe toward precision.
- **027 traversal API turns out NOT reusable**: the reuse-confirmation gate (REQ-001) fails CLOSED — Q3-C1 is blocked and escalated, NOT silently forked into a second walker.

### Concurrent Operations
- **Reindex concurrent with a PPR read**: out of scope here — handled by the shipped binary readiness gate (`shouldBlockReadPath`); this sub-phase governs ranking once a read is served.
- **Scan rebuild shifts DB row order mid-PPR**: PPR ranks by score (content-derived), so its primary order is stable across the row-order shift that the flat enumeration is vulnerable to (the determinism win is incidental but real; the explicit tiebreak fix lives in `001-determinism-walk-order`).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | Files: ~3 (code-graph-context + query-intent-classifier modified; bfs-traversal consumed), Systems: impact walk + query classifier + reused Memory traversal |
| Risk | 18/25 | Auth: N, API: changes impact-ranking order (public), Breaking: guarded by mode-gate + bounded cap + reversible flag; PPR is net-new ranking machinery |
| Research | 17/20 | Heavy — net-new PPR primitive, a new query-class taxonomy, undirected projection, decay; reuse-confirmation of 027's substrate; benchmark does not exist |
| Multi-Agent | 6/15 | Single workstream, sequenced (Q3-C1 first, then refinements) |
| Coordination | 9/15 | Q3-C1 gates class-gate/undirected/decay; depends on 027 substrate + new taxonomy; benchmark-gated |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Unbounded PPR blows the 400ms impact-walk budget | H | M | Bounded power-method cap; property-tested termination; best-prefix fallback (REQ-002) |
| R-002 | PPR on the single-hop default demotes the right exact-symbol answer (the named aionforge failure mode) | H | M | Mode-gate to impact/multi-hop only via the new taxonomy; PPR-OFF on ambiguous class (REQ-003) |
| R-003 | Refinements (class-gate/undirected/decay) built before Q3-C1 exists | M | M | Land Q3-C1 first; refinements are explicitly contingent (iter-14) |
| R-004 | A second walker is forked instead of reusing 027's substrate | M | M | Reuse-confirmation gate; reuse `collectWeightedWalk` (REQ-001) |
| R-005 | Vector-seed-union attempted against the structural-only design | M | L | Recorded CUT / NO-GO, not deferred (REQ-007) |
| R-006 | PPR ranking shipped without a benchmark to justify its quality | M | H | Land the mechanism; gate the quality claim + parameter tuning on a benchmark that must be built first |

---

## 11. USER STORIES

### US-001: Central-caller-first blast radius (Priority: P0)

**As a** developer asking for the impact/blast-radius of a symbol, **I want** the most-central callers ranked first, **so that** the truncation budget does not cut off the callers that matter in arbitrary DB order.

**Acceptance Criteria**:
1. Given an impact/multi-hop query, When the walk runs, Then results are ordered by personalized-PageRank score seeded on the subject symbol, and a budget cut returns the best PPR-ranked prefix (not arbitrary DB order).

### US-002: Single-hop precision preserved (Priority: P0)

**As a** developer asking for one exact symbol's immediate neighborhood, **I want** PPR/expansion kept OFF, **so that** the precise answer is not demoted by indiscriminate graph over-expansion.

**Acceptance Criteria**:
1. Given a single-hop neighborhood/outline query, When it is routed, Then PPR is OFF and the cheap flat walk output is unchanged (the mode-gate honored).

### US-003: Reachable blast radius for leaf symbols (Priority: P1)

**As a** developer impacting a leaf-level symbol, **I want** the PPR projection undirected, **so that** seed mass still reaches the callers above it instead of sinking.

**Acceptance Criteria**:
1. Given a leaf symbol seed, When PPR spreads, Then the undirected projection reaches its blast-radius callers; directed reverse-edge semantics remain for the non-PPR flat path.

### US-004: Trust-decayed multi-hop ranking (Priority: P1)

**As a** developer reading a multi-hop impact result, **I want** inferred far-hop paths ranked below observed near-hop paths, **so that** low-confidence transitive reach does not outrank high-confidence direct reach.

**Acceptance Criteria**:
1. Given a multi-hop PPR walk, When transition weights are applied, Then an INFERRED 2-hop path ranks below an OBSERVED 1-hop path via the reused `reliability` factor.

---

## 12. OPEN QUESTIONS

- Is 027's `collectWeightedWalk`/`collectCausalWeightedNeighbors` traversal API (Memory MCP `lib/graph/bfs-traversal.ts`) directly reusable from the code-graph context path, or does it couple to Memory-specific node/edge shapes that force an adapter? (REQ-001 reuse-confirmation gate; `synthesis/04` says confirm-before-building.)
- What damping factor, power-method iteration cap, and seed-mass distribution keep PPR inside the 400ms budget while still surfacing central callers? (Parameter VALUES are benchmark-gated; the mechanism ships with safe defaults.)
- What is the minimal SingleHop/MultiHop/Entity query-class taxonomy the gate needs, given the structural classifier disowned its semantic backend — heuristic-only, or does it need new signals? (`query-intent-classifier.ts:82-92`.)
- Does the undirected projection over-expand and re-introduce the single-hop precision loss the mode-gate is meant to prevent? (REQ-004 NEEDS-BENCHMARK per iter-14.)
- The "old PageRank helper never wired" roadmap line does not hold against the live tree (no PageRank helper exists in either MCP) — confirm the real reuse target is the weighted-walk substrate, not a dormant helper to wire. (Plan-time correction; `grep` empty in both `lib/graph/`.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source research**: `../research/research.md` (Internal Baseline + iter-2/3/8/14); `../../research/roadmap.md` (§3 Query-Class Routing + BROADENING §2); `../../research/synthesis/{01-go-candidates.md, 03-corrections-caveats-and-residuals.md, 04-sibling-and-cross-cutting.md}`
- **Sibling (consumed, not modified)**: `../001-determinism-walk-order/spec.md` (Q4-C1 trust blend shipped `e21caf5de6`; Q4-C2 here reuses its `reliability` factor); 027 Memory MCP `lib/graph/bfs-traversal.ts` weighted-walk substrate (confirm-then-reuse)
- **Shipped-record (done-candidate evidence)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (Q3-C1 cluster ABSENT → all PENDING; Q3-C1 listed Wave-2 Out of Scope)
