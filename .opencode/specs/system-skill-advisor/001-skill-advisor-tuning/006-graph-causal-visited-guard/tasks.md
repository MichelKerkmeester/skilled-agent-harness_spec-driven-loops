---
title: "Task Breakdown: Graph-Causal Visited-Guard Order Fix"
description: "Executable task list: make the graph-causal per-seed BFS score-first, replace the boolean visited set with a best-positive-strength expansion map, retain the positive-only enqueue gate, add the focused unit test, and verify corpus-neutrality."
trigger_phrases:
  - "graph causal visited guard tasks"
  - "score-first traversal task breakdown"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/006-graph-causal-visited-guard"
    last_updated_at: "2026-07-06T22:45:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Task Breakdown: Graph-Causal Visited-Guard Order Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[P]` parallelizable
- Each task lists its evidence (file, test, or command).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the target lane, its consuming tests, and the projection fixture helper. Evidence: graph-causal.ts / native-scorer.vitest.ts / projection.ts / types.ts read.
- [x] T-002 Reproduce the bug and confirm the corrected value. Evidence: `alpha->beta {conflicts_with w=1, enhances w=0.9}` scores `-0.35` under the old guard, `+0.145` under score-first.
- [x] T-003 Verify the target file is git-clean before editing. Evidence: `git status --porcelain` on graph-causal.ts returns empty.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-010 Replace the boolean `seen` set and the strength/path queue entry with `bestPositiveStrengthByTarget` and an `{ id, depth }` queue; read propagation strength from the map. Evidence: graph-causal.ts diff; typecheck exit 0.
- [x] T-011 Delete the pre-scoring `seen.has/seen.add` guard so scoring is unconditional (score-first). Evidence: guard removed; both edges to a target appear in evidence.
- [x] T-012 Retain the `if (signed > 0)` enqueue gate and enqueue a target once on first positive reach, tracking best positive strength. Evidence: negative-edge invariant test green.
- [x] T-013 Drop the unused `path` diagnostic field. Evidence: no `path` reference remains in the module.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-020 Author `tests/scorer/graph-causal-visited-order.vitest.ts` (order, below-threshold, invariant, termination). Evidence: 5 tests pass.
- [x] T-021 Confirm vitest exercises the source `.ts` expansion path via a temporary throw probe. Evidence: probe hit the throw in the new block, then removed.
- [x] T-022 Rebuild dist and re-run the 193-row corpus (baseline dist vs fix dist). Evidence: 0/193 route flips; tsCorrect 136 -> 136 on the current tree.
- [x] T-023 Run the scorer/parity/lane-attribution gate. Evidence: 20 files / 142 tests pass; python-ts-parity hard-asserts 105/101/4.
- [x] T-024 Run the divergence ratchet. Evidence: ratchet green with no ledger edit.
- [x] T-025 Run the full advisor suite; confirm no new regressions. Evidence: new tests pass; the 5 failures are pre-existing/flaky infra tests, none importing the scorer.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0/P1 requirements met (REQ-001..REQ-008).
- Score-first traversal; positive-only enqueue gate retained; `path` dropped; comment hygiene clean.
- 0/193 corpus flips; 105/101/4 held byte-identical; ratchet green with no ledger edit; zero new regressions.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md`
- Program umbrella: `system-skill-advisor/001-skill-advisor-tuning/001-scorer-saturation-root-fix`.
<!-- /ANCHOR:cross-refs -->
