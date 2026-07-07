---
title: "Implementation Summary: Graph-Causal Visited-Guard Order Fix"
description: "Shipped: the graph-causal lane now scores every qualifying edge before deciding expansion. The boolean visited set is replaced by a best-positive-strength map that governs queue expansion only; the positive-only enqueue gate is retained and the unused path field dropped. Corpus-neutral (0/193 flips, 105/101/4 held byte-identical), negative-edge invariant retained, TS-only."
trigger_phrases:
  - "graph causal visited guard summary"
  - "score-first traversal implementation summary"
  - "graph causal edge suppression fixed"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/006-graph-causal-visited-guard"
    last_updated_at: "2026-07-06T22:45:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Score-first traversal implemented and verified corpus-neutral; scorer gates green"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch (no commit/push done here)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/graph-causal-visited-order.vitest.ts"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/global/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-graph-causal-visited-guard |
| **Completed** | 2026-07-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The graph-causal lane's per-seed breadth-first walk now scores every qualifying edge before deciding whether to expand a target, so a weaker or earlier edge can no longer suppress a stronger later edge to the same target.

### The bug
The walk called `seen.add(edge.targetId)` before the multiplier/threshold/score logic. Since outgoing edges are sorted by raw `weight` (not signed contribution), the first edge to reach a target marked it visited and every later edge to it was dropped. A high-weight `conflicts_with` edge processed before a lower-weight `enhances` edge suppressed the stronger positive edge entirely, flipping the target's net sign. Measured: seed `alpha=1`, `alpha->beta conflicts_with w=1` and `alpha->beta enhances w=0.9` scored `beta = -0.35` (conflict only) when the correct net is `-0.35 + 0.495 = +0.145`. A below-threshold first edge was worse: `seen.add` ran before the threshold `continue`, so a dropped first edge could mark a target visited without scoring it and delete it entirely.

### The fix
Scoring and traversal are separated. Every qualifying edge accumulates its signed contribution unconditionally (score-first). The boolean `seen` set is replaced by `bestPositiveStrengthByTarget: Map<string, number>`, seeded with the origin so a back-edge cannot re-expand the seed. A target is enqueued once, on its first positive reach, and the map records its best positive strength, which becomes the propagation strength when that target is dequeued. The `if (signed > 0)` enqueue gate is retained so negative or zero edges score but never expand, preserving the invariant that positive support never propagates through a negative edge. The unused `path` diagnostic field is dropped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/scorer/lanes/graph-causal.ts` | Modified | Score-first traversal; best-positive-strength expansion ledger; enqueue gate retained; `path` dropped |
| `tests/scorer/graph-causal-visited-order.vitest.ts` | Created | Order, below-threshold, negative-edge-invariant, and termination unit tests (5 tests) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Behavior was measured, not asserted. The bug was reproduced (`beta = -0.35`) and the corrected value confirmed (`+0.145`) before editing. A temporary throw probe in the new expansion block confirmed vitest exercises the source `.ts`, then was removed. Corpus-neutrality was re-confirmed on the current tree (which already carries the orchestrator's WS2 changes): a baseline dist was built with the original lane, routes captured for all 193 rows, then a fix dist built and routes re-captured; the diff is 0 route flips (tsCorrect 136 -> 136). No commit or push was performed; the changes are left in the working tree for the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Score-first (accumulate every qualifying edge) | The boolean `seen` conflated "scored" with "expanded"; only unconditional scoring stops a weaker/earlier edge from suppressing a stronger later edge |
| Expand-once with a best-positive-strength map | Achieves the correct scoring without re-expansion amplification; a target enters the queue once and propagates at its best positive strength |
| Retain the `if (signed > 0)` enqueue gate | Preserves the existing invariant that positive graph-causal support never propagates through a negative edge |
| No Python mirror | `skill_advisor.py._apply_graph_boosts` is a single-hop transitive pass with no queue, depth, or visited set, so it has no analog of this BFS bug |
| Drop the `path` field | It was never read anywhere in the module; dead diagnostic state |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (exit 0) |
| `graph-causal-visited-order.vitest.ts` | PASS (5/5: weak-then-strong, order independence, below-threshold, negative-edge invariant, termination) |
| Corpus route diff (baseline dist vs fix dist, 193 rows) | 0 route flips; tsCorrect 136 -> 136 on the current tree |
| `python-ts-parity.vitest.ts` | PASS (hard-asserts pythonCorrect=105, tsAlsoCorrect=101, regressions=4, ids equal) |
| `local-native-divergence-ratchet.vitest.ts` | PASS (green; no ledger edit) |
| Scorer/parity/lane-attribution gate | PASS (20 files / 142 tests) |
| Full advisor vitest suite | 635 passed, 5 skipped, 5 failed (all pre-existing/flaky infra, none importing the scorer) |
| Source-vs-dist probe | PASS (temporary throw hit in the new expansion block, then removed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full-suite shows 5 failures, all pre-existing and scorer-independent.** The stable core is four: `compat/shim` (Python subprocess stdin), `skill-advisor-cli-parity` (Python/native CLI), `advisor-graph-health` (legacy graph health), and `manual-testing-playbook` (doc inventory). The fifth slot is occupied by a different flaky infra test per run: this run showed `skill-advisor-launcher-orphan-reaping` (a process/filesystem-cleanup test), which passes in isolation and does not import the scorer; `migration-lineage-identity`, flagged as failing in a prior snapshot, passed here. None of the five exercises the graph-causal lane, and the scorer/parity/ratchet gates are all green, so this change introduces no new failures.
2. **No commit or push was performed.** The orchestrator owns the push to the shared branch; the changes are in the working tree.
<!-- /ANCHOR:limitations -->
