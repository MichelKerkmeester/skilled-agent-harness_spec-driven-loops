---
title: "Feature Specification: Graph-Causal Visited-Guard Order Fix"
description: "Fix the graph-causal lane's per-seed BFS so it scores every qualifying edge before deciding expansion. The old visited guard marked a target seen before scoring, so the first edge to reach it (sorted by raw weight) suppressed every later edge and could flip the target's net sign. The fix replaces the boolean visited set with a best-positive-strength map that governs queue expansion only, retaining the positive-only enqueue gate."
trigger_phrases:
  - "graph causal visited guard"
  - "graph causal edge suppression"
  - "score-first graph traversal"
  - "best positive strength expansion"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-graph-causal-visited-guard"
    last_updated_at: "2026-07-06T22:45:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Score-first traversal implemented and verified corpus-neutral"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Feature Specification: Graph-Causal Visited-Guard Order Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The graph-causal lane's per-seed breadth-first walk called `seen.add(edge.targetId)` before the multiplier/threshold/score logic, so the first edge to reach a target marked it visited and every later edge to that target was dropped. Because outgoing edges are sorted by raw `weight` (not signed contribution), a high-weight `conflicts_with` edge could be processed before a lower-weight `enhances` edge and suppress the stronger positive edge entirely, flipping the target's net sign. Measured on `alpha=1` with `alpha->beta conflicts_with w=1` and `alpha->beta enhances w=0.9`, the lane scored `beta = -0.35` (conflict only) when the correct net is `-0.35 + 0.495 = +0.145`. A below-threshold first edge was worse: it still executed `seen.add` before the threshold `continue`, so it could mark a target visited without scoring it and suppress a later real edge, dropping the target entirely.

### Purpose
Score every qualifying edge before deciding expansion, so a weaker or earlier edge can never suppress a stronger later edge to the same target, while preserving the invariant that positive support never propagates through a negative edge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the boolean `seen` visited set in `lib/scorer/lanes/graph-causal.ts` with a `bestPositiveStrengthByTarget: Map<string, number>` that governs queue expansion only.
- Make edge scoring unconditional (score-first) so accumulation never depends on visitation.
- Retain the `if (signed > 0)` enqueue gate and drop the unused `path` diagnostic field.
- A focused unit test locking the order behavior, below-threshold non-suppression, order independence, the negative-edge invariant, and termination.

### Out of Scope
- The Python local scorer (`scripts/skill_advisor.py`): its `_apply_graph_boosts` is a single-hop transitive pass with no queue, depth, or visited set, so it has no analog of this bug and needs no mirror.
- The 193-row gold corpus content: this change is corpus-neutral (0 route flips).
- Fusion weights, lane registration, projection, or any embedding/daemon/database change: none touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Modify | Score-first traversal; best-positive-strength expansion ledger; drop `path` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/graph-causal-visited-order.vitest.ts` | Create | Order/below-threshold/invariant/termination unit tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Score-first: every qualifying edge contributes | Accumulation is never gated on visitation; both edges to a target appear in evidence |
| REQ-002 | Expansion governed by a best-positive-strength map, not the score | Boolean `seen` replaced by `bestPositiveStrengthByTarget`; the map controls enqueue only |
| REQ-003 | Corpus-neutral | 0/193 route flips baseline->fix; `python-ts-parity.vitest.ts` stays 105/101/4 |
| REQ-004 | Negative-edge invariant retained | `alpha->beta conflicts, beta->gamma enhances` leaves gamma absent (positive-only enqueue gate) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Below-threshold non-suppression | A dropped below-threshold first edge does not prevent a later above-threshold edge from scoring |
| REQ-006 | Order independence | A target's combined score is the algebraic sum of its edges regardless of processing order |
| REQ-007 | Provably terminating | Expand-once plus the hard depth cap bound the walk by reachable node count |
| REQ-008 | Ratchet reconciled without edit | `local-native-divergence-ratchet.vitest.ts` green with no ledger change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Weak-then-strong scores the strong edge: `beta = +0.145` (not `-0.35`), with both `conflicts_with` and `enhances` in beta's evidence.
- **SC-002**: 0/193 corpus route flips; parity holds at 105/101/4; ratchet green with no ledger edit.
- **SC-003**: Every existing graph-causal test stays green; the new unit test locks the fix.
- **SC-004**: Comment hygiene clean (durable WHY only); TS-only change, no Python mirror required.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Score change flips a gold route | High | Measured 0/193 flips (baseline dist vs fix dist) on the current tree; parity 105/101/4 held |
| Risk | Re-expansion amplifies downstream scores | Med | Chose expand-once (variant A1): a target is enqueued once, tracking best positive strength, no re-expansion |
| Risk | Negative edge suppresses via the new path | Med | Retained the `if (signed > 0)` enqueue gate; verified gamma stays absent |
| Dependency | Consumer `fusion.ts` (orchestrator WS2, in-flight) | Low | This lane is clean and file-scoped; neutrality re-confirmed on the current WS2 tree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One lane at fusion weight 0.13; the walk is bounded by the hard depth cap (default 2) and expand-once, so per-query cost is unchanged.

### Security
- **NFR-S01**: No secrets, daemon, or database touched; the change is one TypeScript scorer lane plus its unit test.

### Reliability
- **NFR-R01**: The traversal is provably terminating (expand-once plus the depth cap), independent of graph density.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Non-positive seed: `currentStrength <= 0` skips expansion, matching the prior behavior where a non-positive seed strength produced only below-threshold propagation.
- Back-edge to the seed: the map is seeded with the origin, so the seed can never be re-expanded.

### Error Scenarios
- Unknown edge type: `multiplier === undefined` still `continue`s before scoring.
- Below-threshold edge: `propagated < 0.05` `continue`s before both scoring and the ledger update, so it neither scores nor blocks a later edge.

### State Transitions
- A target reached first by a negative edge is scored (conflict evidence) but not enqueued; a later positive edge to it still scores and enqueues it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One lane file, ~15 changed lines, plus one focused test |
| Risk | 14/25 | Shared parity gate + ratchet; corpus-neutral, but sign-affecting logic |
| Research | 10/20 | Bug reproduced and fix verified corpus-neutral empirically before edit |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- None. The bug was reproduced, the fix verified correct (`beta = +0.145`), corpus-neutral (0/193), and terminating; the Python mirror was ruled out with evidence.
<!-- /ANCHOR:questions -->
