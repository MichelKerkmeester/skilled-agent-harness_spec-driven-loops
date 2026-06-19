---
title: "Implementation Plan: Code-Graph Seeded-PPR Impact Ranking (028/002 impl)"
description: "Sequenced approach for the seeded-PPR impact-ranking cluster: confirm 027's weighted-walk traversal is reusable, then build Q3-C1 bounded personalized-PageRank over it, GATED to impact/multi-hop modes via a new query-class taxonomy; then layer the undirected projection and Q4-C2 multi-hop reliability decay. lexical-vector-seed-union is CUT (NO-GO)."
trigger_phrases:
  - "seeded ppr impact ranking plan"
  - "code graph personalized pagerank sequencing"
  - "class gated expansion taxonomy plan"
  - "027 weighted walk reuse plan"
  - "code graph multi hop decay plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored implementation plan for the seeded-PPR cluster"
    next_safe_action: "Confirm 027's collectWeightedWalk traversal API is reusable, then build bounded PPR over it"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code-Graph Seeded-PPR Impact Ranking

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) — System Code Graph MCP server (`system-code-graph/mcp_server/`) |
| **Framework** | tree-sitter → SQLite code graph + the `code_graph_context` impact/neighborhood walk |
| **Storage** | SQLite (`code_nodes`/`code_edges`, no temporal columns; SCHEMA_VERSION 5) — no schema migration in this cluster |
| **Testing** | Vitest (focused per-candidate suites; PPR convergence/termination property tests) |
| **Reused substrate** | 027's Memory MCP `lib/graph/bfs-traversal.ts` weighted-walk traversal (`collectWeightedWalk`/`collectCausalWeightedNeighbors`) — confirm-then-reuse, do NOT rebuild |

### Overview
Give the code-graph impact/blast-radius walk a query-seeded multi-hop ranking. The work is built around one net-new ranking primitive — Q3-C1 bounded personalized-PageRank — seeded on the subject symbol, spread over 027's already-shipped weighted-walk traversal, ordered best-first by PPR score, and GATED to impact/multi-hop modes only (the aionforge precision lesson). Three refinements layer on top of that built core: a new SingleHop/MultiHop/Entity query-class taxonomy for the gate (the structural classifier has none), an undirected projection so seed mass reaches callers, and Q4-C2 multi-hop reliability decay reusing the already-plumbed `reliability` factor. The vector-seed-union candidate is CUT — the code-graph deliberately disowned its semantic backend. Every change is reversible by mode-gate/flag; the cheap single-hop default never regresses.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-3)
- [ ] Success criteria measurable (spec.md §5)
- [ ] Dependencies identified — 027 weighted-walk reuse (confirm-first), new query-class taxonomy (build), retrieval benchmark (gate-zero for quality)
- [ ] PPR-is-unbuilt confirmed (grep empty) so the cluster builds the core before its refinements

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001 PPR-over-reused-walk, REQ-002 bounded budget, REQ-003 mode-gate)
- [ ] Per-candidate tests + existing code-graph suite green; PPR termination property test passes
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record synchronized)
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Net-new bounded-PPR ranking primitive wired into an existing flat impact walk, gated by a new query-class axis, spread over a reused (not rebuilt) traversal substrate. No new subsystem; no schema migration — the change re-orders an existing walk and adds a gated walk variant.

### Key Components
- **Bounded PPR primitive (NEW, in `code-graph-context.ts`)**: seed vector on the subject symbol(s), teleport weighted by static edge weights (`config-defaults.ts:45-59`) × `metadata.confidence`, power-method with a hard iteration cap for the 400ms budget, best-first ordering by PPR score. (Q3-C1 + algorithm core)
- **027 weighted-walk traversal (REUSED, `lib/graph/bfs-traversal.ts`)**: `collectWeightedWalk`(seeds + maxHops + weighted frontier) / `collectCausalWeightedNeighbors` — the spread engine PPR drives, after a reuse-confirmation gate. NOT modified, NOT re-implemented.
- **Query-class taxonomy (NEW, in `query-intent-classifier.ts`)**: SingleHop/MultiHop/Entity classes on top of the structural-only `QueryIntent='structural'`; the gate routes PPR ON for impact/multi-hop, OFF for the single-hop neighborhood/outline default. (CG-class-gated-expansion)
- **Undirected projection (`code-graph-context.ts`)**: project the PPR graph undirected so a leaf seed reaches its callers; the flat reverse-directed path is preserved for the non-PPR walk. (CG-undirected-projection)
- **Multi-hop reliability decay (`code-graph-context.ts:350-356`)**: reuse the `reliability = clamp(confidence) × evidenceClassFactor` factor as the per-edge PPR transition weight. (Q4-C2)

### Data Flow
Impact query → query-class taxonomy classifies shape (NEW) → gate: single-hop ⇒ existing flat walk (PPR OFF, zero cost); impact/multi-hop ⇒ seed PPR on the subject symbol → spread mass over 027's `collectWeightedWalk` (REUSED) with per-edge transition weights folding in `reliability` (Q4-C2) over an undirected projection (CG-undirected) → bounded power-method to the budget cap → order results best-first by PPR score → intersect with the current edge set (physical-presence today; `invalid_at IS NULL` once Q1-C1 lands) → render.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This cluster touches the public impact-ranking order and the query classifier — surfaces with consumers. Inventory before implementing.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| impact walk (`code-graph-context.ts:668-676`) | flat reverse `CALLS`/`IMPORTS` enumeration in DB order | replace ordering with PPR score (impact/multi-hop only) | byte-identical for single-hop; PPR-ordered for impact |
| `expandAnchor` budget (`code-graph-context.ts:401-403`, `budgetMs=400`) | 400ms latency budget, arbitrary-order truncation | bound PPR inside it; best-prefix fallback on cut | termination property test under the cap |
| `query-intent-classifier.ts:6` (`QueryIntent='structural'`) | structural-only verdict, no shape taxonomy | add SingleHop/MultiHop/Entity classes for the gate | new-taxonomy unit tests; gate routes PPR by class |
| `reliability` factor (`code-graph-context.ts:350-356`) | rank-time trust factor (Q4-C1, shipped) | reuse as PPR per-edge transition weight (Q4-C2) | INFERRED 2-hop < OBSERVED 1-hop test |
| 027 `collectWeightedWalk` (`system-spec-kit/.../lib/graph/bfs-traversal.ts`) | weighted-walk traversal substrate | CONSUME (confirm reusable; do not modify) | reuse-confirmation note precedes any PPR code |
| `code_edges` current set | physical edge presence (no temporal cols) | intersect PPR-reached set; degrade gracefully | physical-presence today; `invalid_at IS NULL` once Q1-C1 lands |

Required inventories:
- Consumers of the impact-walk result order: `rg -n 'expandAnchor|queryEdgesTo|blast_radius' system-code-graph/mcp_server --glob '*.ts'`.
- 027 traversal API shape: read `system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` `collectWeightedWalk`/`collectCausalWeightedNeighbors` signatures; confirm node/edge-shape compatibility BEFORE writing PPR.
- Grep-confirm PPR is unbuilt before building: `rg -n 'pagerank|personaliz|teleport|damping|ppr|random.?walk' system-code-graph/mcp_server` (expect empty).
- Algorithm invariant: PPR is a bounded power-method (terminates by the cap); document the damping factor + cap; gate is fail-safe toward PPR-OFF on an ambiguous class.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reuse-confirmation + Q3-C1 PPR core (the build)
- [ ] Confirm 027's `collectWeightedWalk`/`collectCausalWeightedNeighbors` traversal API is reusable from the code-graph path (the confirm-before-building gate); if not directly reusable, define the minimal adapter — do NOT fork a second walker
- [ ] Build the bounded PPR primitive (seed vector, teleport weights, power-method with a hard iteration cap) spread over the reused traversal
- [ ] Order impact results by PPR score; best-prefix fallback on a budget cut; intersect with the current edge set (physical-presence today)
- [ ] PPR convergence/termination property test (always stops by the cap, inside 400ms)

### Phase 2: The precision gate (new query-class taxonomy)
- [ ] Add a SingleHop/MultiHop/Entity taxonomy to `query-intent-classifier.ts` (structural classifier emits only `'structural'` today)
- [ ] Gate PPR ON for impact/multi-hop, OFF for the single-hop neighborhood/outline default; ambiguous class ⇒ PPR-OFF (fail-safe toward precision)
- [ ] Single-hop byte-identity test (cheap default unchanged); impact PPR-ON test

### Phase 3: Refinements on the built core
- [ ] CG-undirected-projection: project the PPR graph undirected so a leaf seed reaches its callers; preserve directed reverse-edge semantics for the flat path
- [ ] Q4-C2: fold the `reliability` factor (`:350-356`) into the PPR per-edge transition weight (INFERRED 2-hop < OBSERVED 1-hop)
- [ ] Record CG-lexical-vector-seed-union as CUT / NO-GO (scope violation; no vector backend) — nothing silently dropped

### Phase 4: Verification
- [ ] `tsc`/build + existing code-graph suite green; per-candidate adversarial review; benchmark caveat recorded (quality + parameter tuning gated on a benchmark that must be built first); `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | PPR primitive (seed/teleport/order); query-class taxonomy per-class; undirected projection; Q4-C2 decay (INFERRED 2-hop < OBSERVED 1-hop) | Vitest |
| Property | PPR termination (always stops by the cap, inside 400ms); gate totality (every query → PPR-ON or PPR-OFF, ambiguous ⇒ OFF) | Vitest |
| Integration | impact/multi-hop end-to-end (PPR-ordered, central-callers-first) vs single-hop (flat, PPR-OFF, unchanged) | Vitest |
| Regression | single-hop neighborhood/outline output byte-identical to baseline (the mode-gate guarantee) | Vitest + captured baseline |
| Reuse-confirmation | 027 `collectWeightedWalk` API drives the spread (no second walker authored) | code read + integration assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 027 `collectWeightedWalk`/`collectCausalWeightedNeighbors` traversal | Internal (Memory MCP, reused) | Green — shipped; reusability confirm-first | PPR spread has no substrate; risk of forking a second walker |
| New SingleHop/MultiHop/Entity query-class taxonomy | Internal (this packet) | Red until built | The class-gate cannot route PPR by mode |
| Q3-C1 PPR core (built before its refinements) | Internal (this packet) | Red until built | class-gate/undirected/Q4-C2 refine a non-existent feature |
| Code-graph retrieval benchmark | Internal data | Red (does not exist campaign-wide) | PPR ranking quality + parameter values cannot be validated |
| Q1-C1 `invalid_at`/`valid_at` columns | Internal (separate DEFER-speculative sub-phase) | Absent today | Current-set intersection limited to physical-edge-presence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Impact-walk latency regression (PPR over budget), single-hop precision regression (gate leaked PPR onto the cheap default), or a forked second walker discovered.
- **Procedure**: Each candidate is a scoped, separately revertible commit. PPR is reversible by a default-off flag (disable ⇒ the flat enumeration returns, byte-identical). The mode-gate failing OFF on an ambiguous class is the safe default; refinements (undirected, Q4-C2 decay) revert independently of the PPR core. No schema migration ⇒ no data reversal.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (reuse-confirm + Q3-C1 PPR core) ──► Phase 2 (class-gate taxonomy) ──► Phase 4 (Verify)
                                          └─► Phase 3 (undirected + Q4-C2 refinements) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Q3-C1 core) | 027 traversal reuse-confirm | Phases 2, 3 |
| Phase 2 (class-gate) | Phase 1 + new taxonomy | Phase 4 |
| Phase 3 (undirected, Q4-C2) | Phase 1 (refines the built core) | Phase 4 |
| Phase 4 (Verify) | Phases 2, 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (reuse-confirm + Q3-C1 PPR core) | High (net-new primitive, bounded power-method) | Q3-C1: L (M-H) |
| Phase 2 (class-gate taxonomy) | Med (new taxonomy + gate) | CG-class-gated-expansion: H/M |
| Phase 3 (undirected + Q4-C2) | Low-Med (refinements on the built core) | undirected: M/S; Q4-C2: M/M |
| Phase 4 (Verification) | Low | per-candidate |
| **Total** | | **Level-3 cluster; net-new ranking machinery; benchmark-gated (quality + parameter values un-measured)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — N/A, no schema migration
- [ ] Default-off flag configured for the PPR ranking path
- [ ] Single-hop baseline captured for the byte-identity (mode-gate) check

### Rollback Procedure
1. Disable the PPR default-off flag — the flat impact enumeration returns, byte-identical to baseline
2. For the refinements, `git revert` the scoped undirected / Q4-C2 commit independently
3. Re-run the single-hop byte-identity regression to confirm the cheap default is unchanged
4. No stakeholder notification needed (branch-only; nothing deployed without explicit go)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐     ┌─────────────────────┐
│ 027 weighted-walk  │     │ new query-class     │
│ traversal (REUSE)  │     │ taxonomy (BUILD)    │
└─────────┬──────────┘     └──────────┬──────────┘
          │                           │
          ▼                           ▼
   ┌──────────────────┐        ┌──────────────────┐
   │  Q3-C1 PPR core  │───────►│  CG-class-gated  │
   │  (bounded power- │        │  -expansion      │
   │   method, BUILD) │        └──────────────────┘
   └────────┬─────────┘
            │ (refinements on the built core)
            ├──────────────────┬──────────────────┐
            ▼                  ▼                   ▼
   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
   │ CG-undirected  │  │ Q4-C2 multi-hop│  │ (CUT) lexical- │
   │ -projection    │  │ reliability    │  │ vector-seed-   │
   │                │  │ decay          │  │ union (NO-GO)  │
   └────────────────┘  └────────────────┘  └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 027 weighted-walk traversal | (reuse-confirm) | the spread engine | Q3-C1 |
| new query-class taxonomy | (build) | SingleHop/MultiHop/Entity classes | class-gate |
| Q3-C1 PPR core | 027 traversal | PPR-scored impact order | class-gate, undirected, Q4-C2 |
| CG-class-gated-expansion | Q3-C1 + taxonomy | PPR ON/OFF by mode | (verify) |
| CG-undirected-projection | Q3-C1 | leaf seeds reach callers | (verify) |
| Q4-C2 decay | Q3-C1 | INFERRED far-hop demotion | (verify) |
| lexical-vector-seed-union | — | (CUT) | (none — NO-GO) |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **027 traversal reuse-confirmation** — the gate that decides reuse-vs-adapter; nothing spreads without a substrate — CRITICAL
2. **Q3-C1 PPR core** — the net-new primitive; every refinement layers on it — CRITICAL
3. **CG-class-gated-expansion (taxonomy + gate)** — the precision guard; PPR must never run on the single-hop default — CRITICAL

**Total Critical Path**: reuse-confirm → Q3-C1 PPR core → class-gate (the refinements parallelize after the core).

**Parallel Opportunities**:
- The new query-class taxonomy build can start in parallel with the PPR core (it gates, it does not block the core's existence).
- CG-undirected-projection and Q4-C2 decay run in parallel once the PPR core exists.
- A retrieval-benchmark build can start any time; it gates the quality CLAIM and the parameter tuning, not the mechanism landing.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | PPR core live | impact results ordered by PPR score over the reused 027 walk; terminates inside 400ms | Phase 1 |
| M2 | Precision gate live | PPR ON for impact/multi-hop, OFF for single-hop; cheap default byte-identical | Phase 2 |
| M3 | Refinements live | undirected projection (leaf seeds reach callers) + Q4-C2 decay (INFERRED 2-hop < OBSERVED 1-hop) | Phase 3 |
| M4 | Cluster verified | strict validation + suite green; seed-union recorded CUT; benchmark caveat recorded | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse 027's weighted-walk traversal; do NOT stand up a second graph-walk engine

**Status**: Accepted

**Context**: Q3-C1 needs a multi-hop spread engine. 027 already ships a causal-edge weighted-walk traversal (`collectWeightedWalk`/`collectCausalWeightedNeighbors`), and the synthesis explicitly directs reusing it rather than building a second walker — confirm-before-building.

**Decision**: Drive the PPR spread over 027's traversal after a reuse-confirmation gate; if the API does not cross subsystems cleanly, define a minimal adapter rather than forking a parallel walker.

**Consequences**:
- One traversal substrate, no drift between two walkers.
- A reuse-confirmation gate is the critical-path first step; if it fails CLOSED, Q3-C1 is blocked and escalated, never silently forked.

**Alternatives Rejected**:
- A code-graph-specific PPR walker: rejected — duplicates traversal logic and contradicts the synthesis directive.

### ADR-002: GATE PPR to impact/multi-hop modes; ship the mechanism, defer parameter VALUES to a benchmark

**Status**: Accepted

**Context**: aionforge's hard lesson is that indiscriminate graph expansion hurts single-hop precision while helping multi-hop recall; the code-graph has no shape taxonomy today (`QueryIntent='structural'` only). And no candidate campaign-wide has a measured benefit number — PPR ranking quality and its damping/cap/decay VALUES are unprovable without a code-graph retrieval benchmark that does not exist.

**Decision**: Build a SingleHop/MultiHop/Entity taxonomy and gate PPR ON for impact/multi-hop only (OFF for the single-hop default, fail-safe toward OFF on ambiguity); land the PPR mechanism with safe defaults and treat the tuned damping factor, power-method cap, and decay magnitudes as a separate benchmark follow-up.

**Consequences**:
- Single-hop precision is structurally protected; the cheap default is byte-identical and zero-cost.
- The mechanism ships reversibly now; the quality claim and parameter tuning wait for a measured benchmark.

**Alternatives Rejected**:
- PPR default-on for all modes: rejected — re-introduces the named single-hop precision-loss failure mode.
- Shipping guessed damping/cap/decay values as a quality claim: rejected — 028 forbids fabricated benefit numbers; the regression-baseline discipline requires a measured before/after.
