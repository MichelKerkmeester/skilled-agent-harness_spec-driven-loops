---
title: "Implementation Plan: Graph-Causal Visited-Guard Order Fix"
description: "Technical plan to make the graph-causal lane score-first: replace the boolean visited set with a best-positive-strength map that governs queue expansion only, retaining the positive-only enqueue gate and dropping the unused path field. TS-only; the Python single-hop boost has no analog of the BFS bug."
trigger_phrases:
  - "graph causal visited guard plan"
  - "score-first traversal architecture"
  - "best positive strength map expansion"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/006-graph-causal-visited-guard"
    last_updated_at: "2026-07-06T22:45:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Fix implemented; all scorer gates green; corpus-neutral"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Implementation Plan: Graph-Causal Visited-Guard Order Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The per-seed BFS conflated two concerns in one boolean `seen` set: whether a target was scored and whether it was expanded. Because `seen.add` ran before scoring and outgoing edges are sorted by raw weight, the first edge to reach a target suppressed every later edge to it. The fix separates the concerns: scoring becomes unconditional (score-first) so every qualifying edge accumulates its signed contribution, and a `bestPositiveStrengthByTarget: Map<string, number>` becomes the expansion ledger. A target is enqueued once, on its first positive reach, and the map tracks its best positive strength for onward propagation. The `if (signed > 0)` enqueue gate is retained so negative or zero edges never expand, and the unused `path` diagnostic field is dropped.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `npm run typecheck` exits 0.
- `graph-causal-visited-order.vitest.ts` (order, below-threshold, invariant, termination) green.
- `python-ts-parity.vitest.ts` holds at 105/101/4 (byte-identical; the change is corpus-neutral).
- `local-native-divergence-ratchet.vitest.ts` green with no ledger edit.
- 0/193 corpus route flips (baseline dist vs fix dist) on the current tree.
- No scorer/parity test regresses versus the pre-existing baseline.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Scoring is separated from traversal. Every qualifying edge (known multiplier, above the 0.05 threshold) accumulates its signed contribution into the target's entry unconditionally, so the target's evidence and net score reflect all of its edges. Expansion is governed by `bestPositiveStrengthByTarget`: seeded with the origin (so a back-edge cannot re-expand the seed), it enqueues a target once on first positive reach and records the best positive strength discovered, which becomes the propagation strength when that target is dequeued. Termination is guaranteed by expand-once (a target enters the queue at most once) plus the hard depth cap; positive strength strictly decays with depth and multiplier magnitude, so the 0.05 threshold cuts the walk short in practice.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `lib/scorer/lanes/graph-causal.ts` (the per-seed BFS body: visited set replaced, scoring made unconditional, enqueue gate retained, `path` dropped).
- `tests/scorer/graph-causal-visited-order.vitest.ts` (new focused unit test).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Score-first traversal
Replace the boolean `seen` set and the strength/path queue entry with `bestPositiveStrengthByTarget` and an `{ id, depth }` queue; delete the pre-scoring `seen.has/seen.add` guard; read the propagation strength from the map.

### Phase 2: Expansion ledger
Enqueue a target once on first positive reach and track its best positive strength; retain the `if (signed > 0)` gate so negative edges score but never expand.

### Phase 3: Tests and verification
Add the focused unit test; rebuild dist; re-run the 193-row corpus (baseline vs fix) for 0 flips; run the scorer/parity/ratchet gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- A native fixture unit test covering: weak-then-strong scores the strong edge (`beta = +0.145`, both edges in evidence); order independence at equal weight; below-threshold non-suppression; the negative-edge invariant (gamma absent); and termination on a cycle at elevated depth/breadth.
- The 193-row corpus route diff (baseline dist vs fix dist) as the neutrality gate.
- The parity gate and the divergence ratchet as safety gates.
- A temporary throw probe to confirm vitest exercises the source `.ts` expansion path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `001-scorer-saturation-root-fix` (advisor scorer program umbrella).
- No Python dependency: `scripts/skill_advisor.py._apply_graph_boosts` is single-hop with no queue/visited set, so there is no analog bug to mirror.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single lane file and delete the new test. There is no data migration, schema change, or deployed-contract change; the lane is one contribution at fusion weight 0.13, so reverting restores the prior latent behavior with no corpus impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1 (the map exists before it can gate expansion). Phase 3 depends on both and on a fresh dist build for the corpus diff.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

~15 changed lines in one lane file plus one focused test. Single session.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No database, embedding, or ledger state changes, so rollback is a pure file revert with no migration and no re-approval of divergences.
<!-- /ANCHOR:enhanced-rollback -->
