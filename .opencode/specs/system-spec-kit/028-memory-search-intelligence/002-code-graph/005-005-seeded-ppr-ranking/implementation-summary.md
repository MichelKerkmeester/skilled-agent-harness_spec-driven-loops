---
title: "Implementation Summary: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "Re-plan state — the net-new Code Graph seeded-PPR impact-ranking cluster (Q3-C1 + algorithm core, CG-class-gated-expansion, CG-undirected-projection, Q4-C2 decay) is PENDING and UNBUILT (PPR grep-confirmed absent; none shipped in 030); CG-lexical-vector-seed-union is CUT (NO-GO). This summary records the gated, sequenced build plan: confirm 027's weighted-walk reuse, build the bounded PPR core, gate it to impact/multi-hop modes, then layer the refinements — with the ranking-quality claim and parameter values held behind a code-graph retrieval benchmark that does not yet exist."
trigger_phrases:
  - "seeded ppr impact ranking implementation summary"
  - "q3-c1 cluster pending unbuilt"
  - "code graph personalized pagerank not shipped"
  - "class gated expansion 027 reuse summary"
  - "lexical vector seed union cut"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/005-005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author seeded-PPR impl-summary (re-plan: 0 shipped, 4 BUILD pending, 1 CUT)"
    next_safe_action: "Confirm 027 collectWeightedWalk reuse, then build the bounded PPR core"
    blockers:
      - "Net-new BUILD; refinements gated on the Q3-C1 PPR core; quality claim gated on a benchmark"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is 027's collectWeightedWalk traversal API directly reusable from the code-graph path, or does it need an adapter?"
    answered_questions:
      - "PPR is UNBUILT in the live code-graph (grep empty); this is a net-new build, not a wiring of a dormant helper"
      - "027's collectWeightedWalk weighted-walk substrate EXISTS and is the real reuse target (no PageRank helper exists in either MCP)"
      - "Q4-C1 trust blend shipped out-of-cluster in 030 (e21caf5de6); Q4-C2 reuses its reliability factor, it does not re-implement the blend"
      - "CG-lexical-vector-seed-union is CUT (NO-GO) — the code-graph deliberately disowned its semantic/vector backend"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/005-005-seeded-ppr-ranking` |
| **Completed** | Re-plan (0 of 4 BUILD candidates shipped — PPR is net-new and UNBUILT; 1 candidate CUT/NO-GO) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No production code was built this phase. This is a re-plan: it records that the code-graph impact/blast-radius walk has no query-seeded multi-hop ranking and lays out the gated, sequenced build for one. The gap is real and grep-confirmed — the impact walk ranks callers by flat single-hop reverse-edge enumeration in DB iteration order (`code-graph-context.ts:668-676`), bounded by a 400ms budget that truncates in arbitrary order, and `rg pagerank|personaliz|teleport|damping|ppr|random-walk` over the live `system-code-graph/mcp_server/` returns ZERO hits. None of the cluster shipped in the flat Wave-0 (030 §3 Out of Scope + §14 list Q3-C1 seeded PPR as Wave-2 / NO-GO; the only Code-Graph item that shipped is the out-of-cluster Q4-C1 trust blend, commit `e21caf5de6`). What this phase delivers is the build plan plus the three plan-time confirmations that de-risk it: PPR is genuinely unbuilt (so this is a net-new build, not a wiring), 027's weighted-walk substrate exists (so there is a reuse target), and the "old PageRank helper never wired" roadmap line does not hold (no such helper exists in either MCP — the real reuse target is the weighted-walk traversal).

### Q3-C1 + Q3-C1-seeded-PPR (PENDING — net-new BUILD; gated on 027-reuse + needs-benchmark)

The net-new ranking core: a bounded personalized-PageRank seeded on the subject symbol(s), teleport-weighted by static edge weights (`config-defaults.ts:45-59`) × `metadata.confidence`, run as a power-method with a hard iteration cap for the 400ms budget, ordering impact results best-first by PPR score instead of DB-enumeration order, with the reached set intersected against the current edge set. The two ids are the same build — `Q3-C1` is the wiring (replace the flat enumeration at `:668-676`, bound it inside `expandAnchor` at `:401-403`) and `Q3-C1-seeded-PPR` is the algorithm core it wires in. The spread MUST run over 027's REUSED `collectWeightedWalk`/`collectCausalWeightedNeighbors` traversal (`system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts`), confirmed reusable before any PPR code is written — no second walker (ADR-001).

### CG-class-gated-expansion (PENDING — gated on a new taxonomy + the Q3-C1 core)

The precision gate: run PPR/expansion ONLY for impact/multi-hop modes, OFF for the single-hop neighborhood/outline default. This requires a SingleHop/MultiHop/Entity query-class taxonomy that the structural classifier does not have — `query-intent-classifier.ts` emits only `QueryIntent='structural'` and disowned its semantic backend (`:6,:82-92`), so the taxonomy must be built. The gate honors aionforge's named lesson that indiscriminate expansion hurts single-hop precision while it helps multi-hop recall (`retrieval.md:108-118`); an ambiguous class fails safe toward PPR-OFF. It refines the unbuilt Q3-C1 core and cannot land before it (iter-14).

### CG-undirected-projection (PENDING — gated on needs-benchmark + the Q3-C1 core)

The directionality fix: project the PPR graph undirected so seed mass reaches callers instead of sinking — a directed PPR seeded on a leaf symbol under-reaches its blast radius. The directed reverse-edge semantics are preserved for the non-PPR flat path. It refines the unbuilt Q3-C1 core.

### Q4-C2 multi-hop reliability decay (PENDING — gated on the Q3-C1 core)

The multi-hop trust decay: reuse the rank-time `reliability = clamp(metadata.confidence) × evidenceClassFactor` factor already plumbed at `code-graph-context.ts:350-356` (the out-of-cluster Q4-C1 trust blend) as the per-edge PPR transition weight, so an INFERRED 2-hop path ranks below an OBSERVED 1-hop path. It reuses Q4-C1's factor — it does not re-implement the trust blend — and folds into the PPR walk once the core exists.

### CG-lexical-vector-seed-union (CUT — NO-GO)

A BM25-seeds UNION vector-seeds expansion, so lexical seeds keep expansion alive when the embedder is down. CUT: the lexical seed half exists (a disabled fallback in `seed-resolver.ts`) but the VECTOR half does NOT — the code-graph module explicitly disowned its semantic/vector backend (`query-intent-classifier.ts:82-92`). A vector-seed union is a scope violation against the structural-only design, not a deferred gap (ADR-003). Recorded so nothing is silently dropped.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This phase delivered the plan and the decisions, not code. The reasoning is captured across three ADRs: reuse 027's weighted-walk traversal rather than standing up a second graph-walk engine — confirm-before-building, fail-closed if not reusable (ADR-001); gate PPR to impact/multi-hop modes only and ship the mechanism while deferring the damping/cap/decay parameter VALUES to a code-graph retrieval benchmark that does not yet exist (ADR-002); and CUT the lexical-vector-seed-union as a NO-GO scope violation against the structural-only design (ADR-003). The build sequence in plan.md is: reuse-confirmation gate → the bounded Q3-C1 PPR core → the class-gate taxonomy → the undirected projection and Q4-C2 decay in parallel on the built core. The three refinements explicitly cannot start before the Q3-C1 core lands (they "refine a non-existent feature" otherwise). No schema migration is involved; every change is reversible by mode-gate/flag. Nothing is built, nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse 027's `collectWeightedWalk` substrate; no second walker (ADR-001) | 027 already ships the weighted-walk traversal; two walkers drift; the "never-wired PageRank helper" does not exist in either MCP — the weighted-walk substrate is the real reuse target |
| GATE PPR to impact/multi-hop; ship mechanism, defer parameter VALUES (ADR-002) | Indiscriminate expansion hurts single-hop precision (named aionforge failure mode); no code-graph retrieval benchmark exists to validate quality or tune damping/cap/decay |
| Build the Q3-C1 core FIRST; class-gate/undirected/Q4-C2 refine it | The refinements "refine a non-existent feature" if built before the core (iter-14 key correction) |
| CUT CG-lexical-vector-seed-union as NO-GO (ADR-003) | The vector seed half does not exist; the code-graph deliberately disowned its semantic backend; a union is a scope violation, not a deferred gap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| PPR-is-unbuilt confirmed (grep empty over the live tree) | PASS (spec §2; tasks T001) |
| 027 reuse target confirmed to exist (`collectWeightedWalk`) | PASS (tasks T002; ADR-001) |
| Roadmap "never-wired PageRank helper" caveat corrected (no helper exists) | PASS (spec §2/§12; tasks T003) |
| Q4-C1 shipped out-of-cluster (`e21caf5de6`); Q4-C2 reuses its factor | PASS (spec §3 Out of Scope; tasks T004) |
| Q3-C1 / Q3-C1-seeded-PPR | PENDING (net-new BUILD; gated on the 027-reuse gate + needs-benchmark; seam `code-graph-context.ts:668-676,:401-403`) |
| CG-class-gated-expansion | PENDING (gated on a new SingleHop/MultiHop/Entity taxonomy + the Q3-C1 core; `query-intent-classifier.ts:6,:82-92`) |
| CG-undirected-projection | PENDING (gated on needs-benchmark + the Q3-C1 core; `code-graph-context.ts:512,:668-676`) |
| Q4-C2 multi-hop reliability decay | PENDING (gated on the Q3-C1 core; reuses `reliability` at `:350-356`) |
| CG-lexical-vector-seed-union | CUT — NO-GO (scope violation; `seed-resolver.ts`; iter-14) |
| `validate.sh --strict` on this folder | PASS (spec-doc structure) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All 4 BUILD candidates are PENDING, not built.** PPR is net-new and grep-confirmed UNBUILT; none shipped in 030 (030 §3/§14: Code Graph shipped Q4-C1 trust blend only; Q3-C1 seeded PPR is Wave-2 Out of Scope / NO-GO). This summary documents a re-plan state by design.
2. **No code-graph retrieval benchmark exists campaign-wide.** Every leverage/effort tag in research is structural inference, never a benchmarked delta (research §6). The PPR ranking-QUALITY claim and the damping/cap/decay parameter VALUES are held behind a benchmark that must be built first; the mechanism ships with safe defaults only.
3. **The refinements depend on the unbuilt core.** CG-class-gated-expansion, CG-undirected-projection, and Q4-C2 each refine Q3-C1; they cannot land before it (iter-14: they "refine a non-existent feature").
4. **The 027 traversal reusability is confirmed-present but not yet confirmed-reusable.** `collectWeightedWalk`/`collectCausalWeightedNeighbors` exist in the Memory MCP, but the reuse-confirmation gate (does the node/edge shape cross subsystems cleanly, or is an adapter needed?) is the first build step and is OPEN.
5. **The current-set intersection degrades.** Q3-C1 should intersect with the `invalid_at IS NULL` current set, but `invalid_at`/`valid_at` do NOT exist on `code_edges` today (Q1-C1 DEFER-speculative, separate sub-phase); the intersection degrades to physical-edge-presence until Q1-C1 lands.
<!-- /ANCHOR:limitations -->
