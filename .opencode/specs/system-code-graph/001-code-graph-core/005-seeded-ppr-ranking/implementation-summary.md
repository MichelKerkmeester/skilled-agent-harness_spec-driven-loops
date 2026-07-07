---
title: "Implementation Summary: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "Implemented the Code Graph seeded-PPR impact-ranking mechanism behind the default-off SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING flag: Q3-C1 bounded PPR, query-class gate, undirected projection and Q4-C2 transition decay. Ranking-quality/tuning remains benchmark-gated, invalid_at current-set semantics remain schema-gated, CG-lexical-vector-seed-union remains CUT."
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
    packet_pointer: "system-code-graph/001-code-graph-core/005-seeded-ppr-ranking"
    last_updated_at: "2026-07-06T16:45:38.345Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented seeded-PPR mechanism default-off with deterministic tests"
    next_safe_action: "Build a retrieval benchmark before enabling or tuning seeded-PPR ranking by default"
    blockers:
      - "Ranking-quality claim and parameter tuning are gated on a retrieval benchmark"
      - "Temporal current-set invalid_at semantics are gated on a separate schema migration"
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
    completion_pct: 85
    open_questions:
      - "What benchmark-backed damping/cap/decay values should replace the safe mechanism defaults?"
    answered_questions:
      - "PPR is UNBUILT in the live code-graph (grep empty), this is a net-new build, not a wiring of a dormant helper"
      - "027's collectWeightedWalk weighted-walk substrate EXISTS and is the real reuse target (no PageRank helper exists in either MCP)"
      - "collectWeightedWalk is reusable through a generic weighted edge-reader adapter from the code-graph context path"
      - "Q4-C1 trust blend shipped out-of-cluster in 030 (e21caf5de6), Q4-C2 reuses its reliability factor, it does not re-implement the blend"
      - "CG-lexical-vector-seed-union is CUT (NO-GO) - the code-graph deliberately disowned its semantic/vector backend"
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
| **Spec Folder** | 005-seeded-ppr-ranking |
| **Status** | complete |
| **Completed** | Mechanism implemented default-off, benchmark/schema-gated acceptance remains pending |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase builds the mechanism the re-plan identified, default-off behind `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`. The impact path now has a bounded personalized-PageRank primitive, consumes the Memory MCP weighted-walk substrate through a code-graph edge adapter, gates expansion to impact/multi-hop classes, projects the PPR working graph undirected and folds confidence/evidence reliability into transition weights. With the flag unset, the existing flat impact walk remains the served path, neighborhood and outline short-circuit before PPR even when the flag is enabled.

### Q3-C1 + Q3-C1-seeded-PPR (DONE mechanism - default-off, benchmark tuning pending)

Implemented in `code-graph-context.ts` as `computeBoundedPersonalizedPageRank` plus a flagged impact adapter. The spread runs over the existing Memory MCP `collectWeightedWalk` built artifact using code-graph `CALLS`/`IMPORTS` edge readers. The current-set intersection degrades to physical edge presence, `invalid_at IS NULL` remains pending because temporal columns require a separate schema migration. The ranking-quality claim and parameter values remain pending until a retrieval benchmark exists.

### CG-class-gated-expansion (DONE)

Implemented in `query-intent-classifier.ts` as SingleHop/MultiHop/Entity/ambiguous expansion classification. Impact mode is eligible, neighborhood and outline remain ineligible, ambiguous text fails safe toward PPR-OFF.

### CG-undirected-projection (DONE mechanism - benchmark quality pending)

Implemented on the flagged PPR path only. The adapter reads both incoming and outgoing `CALLS`/`IMPORTS` edges for traversal, while output candidates remain reverse-impact edges. Whether the projection should become default remains benchmark-gated.

### Q4-C2 multi-hop reliability decay (DONE mechanism - calibration pending)

Implemented through PPR transition weights that fold confidence/evidence reliability into structural edge weight while keeping missing metadata neutral. A deterministic test verifies an INFERRED 2-hop path ranks below an OBSERVED 1-hop path.

### CG-lexical-vector-seed-union (CUT - NO-GO)

A BM25-seeds UNION vector-seeds expansion, so lexical seeds keep expansion alive when the embedder is down. CUT: the lexical seed half exists (a disabled fallback in `seed-resolver.ts`) but the VECTOR half does NOT - the code-graph module explicitly disowned its semantic/vector backend (`query-intent-classifier.ts:82-92`). A vector-seed union is a scope violation against the structural-only design, not a deferred gap (ADR-003). Recorded so nothing is silently dropped.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build followed the recorded sequence: confirm weighted-walk reuse, implement the bounded Q3-C1 PPR core, add the query-class gate, then layer undirected projection and transition decay on that core. No schema migration was performed. No live MCP scan, reindex, benchmark or migration was run. The mechanism shipped default-off in commit `657a0f6a3e` (feat(028), which names seeded-PPR), touching `code-graph-context.ts` and `query-intent-classifier.ts` plus the seeded-PPR vitest.
<!-- /ANCHOR:how-delivered -->

---

## Pass-2 Git-History Reconciliation

The mechanism shipped default-off in commit `657a0f6a3e` and was later deleted from the tree in commit `277c35344c`; the current repository no longer has `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` or `computeBoundedPersonalizedPageRank` in the serving path. The authoritative benchmark over 20 labeled queries measured exactly `0.0000` delta for precision@3 (`1.0000` flat, `1.0000` PPR), precision@5 (`0.9800` flat, `0.9800` PPR), precision@8 (`0.9125` flat, `0.9125` PPR), recall@3 (`0.2996` flat, `0.2996` PPR), recall@5 (`0.4659` flat, `0.4659` PPR), recall@8 (`0.6317` flat, `0.6317` PPR), nDCG@3 (`1.0000` flat, `1.0000` PPR), nDCG@5 (`1.0000` flat, `1.0000` PPR) and nDCG@8 (`1.0000` flat, `1.0000` PPR). The damping sweep from `0.5` through `0.95` confirmed no value beats the flat walk: `0.50`, `0.65`, `0.75` and `0.85` tie flat at nDCG@5 `1.0000`, while `0.95` drops to nDCG@5 `0.9915`.

Root cause: all `18,851` CALLS edges carried identical confidence/weight metadata (`INFERRED`, `0.8`, `0.8`), so PPR had no centrality gradient to differentiate on. The benchmark record explicitly says commit `277c35344c` is "not a refute of PPR as an algorithm, it is a verdict on PPR over this substrate" and names "non-uniform edge weighting" as the prerequisite. An operator-approved follow-on project is now **IN PROGRESS** at `../010-edge-confidence-and-ppr-revisit/` to build that prerequisite and re-benchmark; this is not a claim that PPR has been reinstated or that a new benchmark has already run.

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse 027's `collectWeightedWalk` substrate, no second walker (ADR-001) | 027 already ships the weighted-walk traversal, two walkers drift, the "never-wired PageRank helper" does not exist in either MCP - the weighted-walk substrate is the real reuse target |
| GATE PPR to impact/multi-hop, ship mechanism, defer parameter VALUES (ADR-002) | Indiscriminate expansion hurts single-hop precision (named aionforge failure mode), no code-graph retrieval benchmark exists to validate quality or tune damping/cap/decay |
| Build the Q3-C1 core FIRST, class-gate/undirected/Q4-C2 refine it | The refinements "refine a non-existent feature" if built before the core (iter-14 key correction) |
| CUT CG-lexical-vector-seed-union as NO-GO (ADR-003) | The vector seed half does not exist, the code-graph deliberately disowned its semantic backend, a union is a scope violation, not a deferred gap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| PPR-is-unbuilt confirmed (grep empty over the live tree) | PASS (spec §2, tasks T001) |
| 027 reuse target confirmed to exist (`collectWeightedWalk`) | PASS (tasks T002, ADR-001) |
| Roadmap "never-wired PageRank helper" caveat corrected (no helper exists) | PASS (spec §2/§12, tasks T003) |
| Q4-C1 shipped out-of-cluster (`e21caf5de6`), Q4-C2 reuses its factor | PASS (spec §3 Out of Scope, tasks T004) |
| Q3-C1 / Q3-C1-seeded-PPR | PASS mechanism, default-off, benchmark quality/tuning pending |
| CG-class-gated-expansion | PASS |
| CG-undirected-projection | PASS mechanism, benchmark quality pending |
| Q4-C2 multi-hop reliability decay | PASS mechanism, calibration pending |
| CG-lexical-vector-seed-union | CUT - NO-GO (scope violation, `seed-resolver.ts`, iter-14) |
| Baseline typecheck | PASS |
| Baseline broad related vitest | PASS - 4 files / 70 tests |
| Focused implementation tests | PASS - 2 files / 21 tests |
| Broad related vitest after implementation | PASS - 6 files / 94 tests |
| `validate.sh --strict` on this folder | PASS - 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **PPR shipped default-off in commit `657a0f6a3e`, and the flag/code were later removed by measurement in commit `277c35344c`.** The status here is `complete` because this phase shipped and concluded its scoped work (mechanism built, gated, benchmark-deferred). The downstream benchmark over 20 labeled queries measured `0.0000` delta for precision@3/5/8, recall@3/5/8 and nDCG@3/5/8, then cut the flag and its code because all `18,851` CALLS edges carried identical confidence/weight metadata (`INFERRED`, `0.8`, `0.8`) and PPR had no centrality gradient on that substrate. See `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/`.
2. **RESOLVED (2026-07-01): the follow-on prerequisite build at `../010-edge-confidence-and-ppr-revisit/` completed and confirmed CUT, with a worse result than before.** A code-graph retrieval benchmark now exists and has run twice. Real per-edge confidence differentiation was built and gave CALLS edges a genuine gradient (four distinct confidence/evidenceClass tiers instead of a uniform constant). Re-running the exact same benchmark with that gradient in place: PPR no longer ties the flat walk, it loses on every metric (precision@3 -0.10, recall@3-8 -0.01 to -0.05, nDCG@3-8 -0.03 to -0.06). The open question "does PPR perform differently once edge confidence stops being uniform" is answered: yes, it gets worse. No further seeded-PPR revisit is planned. See `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md` for the full follow-up numbers.
3. **The current-set intersection degrades.** Q3-C1 intersects with physically present edges today, `invalid_at IS NULL` semantics remain pending until the separate temporal-edge schema migration exists.
<!-- /ANCHOR:limitations -->
