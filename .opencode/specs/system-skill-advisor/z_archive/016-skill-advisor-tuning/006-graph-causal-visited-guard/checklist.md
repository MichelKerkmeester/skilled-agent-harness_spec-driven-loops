---
title: "Verification Checklist: Graph-Causal Visited-Guard Order Fix"
description: "Level 2 verification checklist for the graph-causal score-first traversal fix. All items verified with evidence."
trigger_phrases:
  - "graph causal visited guard checklist"
  - "score-first traversal verification checklist"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/006-graph-causal-visited-guard"
    last_updated_at: "2026-07-06T22:45:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "All checklist items verified"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Verification Checklist: Graph-Causal Visited-Guard Order Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008, SC-001..SC-004) [EVIDENCE: spec.md requirements + success-criteria anchors]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md architecture anchor: score-first, best-positive-strength expansion, retained enqueue gate]
- [x] CHK-003 [P1] Bug reproduced and corrected value confirmed before edit [EVIDENCE: alpha->beta {conflicts_with w=1, enhances w=0.9} scores -0.35 old, +0.145 fixed]
- [x] CHK-004 [P1] Target file git-clean before editing [EVIDENCE: git status --porcelain on graph-causal.ts empty]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scoring is unconditional (score-first); accumulation is never gated on visitation [EVIDENCE: seen.has/seen.add guard deleted; both edges appear in beta evidence]
- [x] CHK-011 [P0] Expansion governed by bestPositiveStrengthByTarget, not the score [EVIDENCE: boolean seen replaced by the map; map controls enqueue only]
- [x] CHK-012 [P0] Positive-only enqueue gate retained; negative edges never expand [EVIDENCE: if (signed > 0) gate kept; gamma-absent invariant test green]
- [x] CHK-013 [P1] Comment hygiene: durable WHY only, no spec-paths/REQ-/task-ids/packet numbers in code [EVIDENCE: comments state the score-first and expansion-ledger rationale only]
- [x] CHK-014 [P2] Dead diagnostic `path` field dropped [EVIDENCE: no `path` reference remains in the module]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Weak-then-strong scores the strong edge [EVIDENCE: new test asserts beta = +0.145 with both edges in evidence]
- [x] CHK-021 [P0] Corpus-neutral: 0/193 route flips baseline dist vs fix dist [EVIDENCE: corpus diff on current tree, tsCorrect 136 -> 136, 0 flips]
- [x] CHK-022 [P0] Parity holds byte-identical [EVIDENCE: python-ts-parity.vitest.ts hard-asserts 105/101/4 + the 4 regression ids; green]
- [x] CHK-023 [P1] Source-vs-dist confirmed [EVIDENCE: temporary throw probe hit in the source `.ts` expansion block, then removed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Negative-edge invariant retained [EVIDENCE: alpha->beta conflicts, beta->gamma enhances leaves gamma absent]
- [x] CHK-025 [P1] Below-threshold non-suppression and order independence [EVIDENCE: new test covers both; below-threshold edge does not block a later above-threshold edge]
- [x] CHK-026 [P1] No new regressions [EVIDENCE: scorer/parity gate 142 passed; full-suite failures are pre-existing/flaky infra tests, none importing the scorer]
- [x] CHK-027 [P1] Ratchet reconciled without edit [EVIDENCE: local-native-divergence-ratchet.vitest.ts green, no ledger change]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials touched [EVIDENCE: change scoped to one scorer lane and its unit test]
- [x] CHK-031 [P0] Memory daemon and database untouched [EVIDENCE: no DB/daemon/embedding path modified]
- [x] CHK-032 [P1] Provably terminating [EVIDENCE: expand-once plus the hard depth cap; termination test green on a cycle at elevated depth/breadth]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized on the same scope and approach [EVIDENCE: shared REQ-/SC- ids and file manifest across docs]
- [x] CHK-041 [P1] Implementation summary carries actual evidence [EVIDENCE: implementation-summary.md verification table with real commands/results]
- [x] CHK-042 [P2] Python-mirror-not-needed rationale recorded [EVIDENCE: spec/plan note the single-hop Python boost has no BFS analog]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes stay inside the advisor scorer scope [EVIDENCE: file manifest limited to lib/scorer/lanes/graph-causal.ts + its test]
- [x] CHK-051 [P2] New test stored under tests/scorer/ beside the sibling graph-causal tests [EVIDENCE: graph-causal-visited-order.vitest.ts path]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 3 | 3/3 |

**Status**: Complete
**Verification Date**: 2026-07-06
**Verified By**: opus-4.8 (verified via typecheck, corpus route diff, 5 targeted vitests, scorer/parity gate, full suite)
<!-- /ANCHOR:summary -->
