---
title: "Implementation Plan: Post-019 Skill-Routing Research"
description: "Execution, reducer integrity, synthesis, and closeout plan for the post-019 research loop."
trigger_phrases:
  - "post-019 research plan"
  - "skill routing research plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/018-post-019-research"
    last_updated_at: "2026-07-25T07:47:34Z"
    last_updated_by: "opencode"
    recent_action: "Completed the research, reducer repair, and terminal synthesis"
    next_safe_action: "Create a separate implementation packet for the measurement contract"
    completion_pct: 100
---
# Implementation Plan: Post-019 Skill-Routing Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run deep research in an isolated worktree, stop after the eight completed iterations selected by the operator, correct reducer/workflow integrity defects, synthesize the immutable evidence into the canonical 17-section report, and close the packet without implementation changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Five research questions and non-goals are frozen
- [x] Isolated worktree and append-only state are available
- [x] Eight completed iteration narratives and deltas are present

### Definition of Done

- [x] Reducer handles `run` and `iteration` numbering
- [x] Question coverage uses question context rather than answer-text equality
- [x] Confirm-mode manual stop is persisted
- [x] Targeted reducer and contract tests pass
- [x] Canonical synthesis, terminal event, config status, and lock cleanup are complete
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Iteration narratives and JSONL records are immutable evidence. The reducer owns strategy machine sections, registry, dashboard, and resource-map generation. The workflow owns final `research/research.md`, terminal state, and lock lifecycle.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research

- [x] Complete iterations 1-8
- [x] Preserve route proof, deltas, prompts, and receipts
- [x] Stop before executing iterations 9-10

### Phase 2: Integrity Repair

- [x] Render canonical iteration numbers in dashboards
- [x] Resolve strategy questions from answer, focus, or unambiguous key-question context
- [x] Persist `manualStop` on both confirm-mode stop branches
- [x] Refresh stale test fixtures and capability expectations

### Phase 3: Synthesis

- [x] Append manual-stop state
- [x] Refresh reducer outputs and emit resource map
- [x] Compile the 17-section canonical synthesis
- [x] Append `synthesis_complete`, mark config complete, and release the lock
- [x] Reconcile Level 2 packet documentation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Syntax | Research reducer | `node --check .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` |
| Unit/Integration | Reducer behavior | Vitest `deep-research-reducer.vitest.ts` |
| Contract parity | Confirm workflow and runtime mirrors | Vitest `deep-research-contract-parity.vitest.ts` |
| Runtime state | Terminal synthesis and lock | Reducer output plus `loop-lock.cjs status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Eight iteration narratives/deltas | Green | No synthesis source |
| Reducer | Green | Registry/dashboard/strategy cannot be trusted |
| Graph convergence dependency | Blocked | Graph score unavailable; file evidence remains usable |
| Memory daemon | Unavailable | No immediate memory indexing; canonical files remain source of truth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Preserve state, deltas, and iteration narratives. Reducer-owned outputs can be regenerated; the synthesis can be rebuilt from the eight immutable narratives. No source implementation or deployment requires reversal.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

`Eight iterations -> Reducer integrity -> Manual stop -> Synthesis -> Terminal state -> Docs`
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

The run completed eight bounded research passes plus reducer repair, two targeted test suites, and final synthesis. Iterations 9-10 were intentionally not spent.
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

The packet contains no migrations or external effects. Restore generated files by rerunning the reducer and recompiling `research.md` from iteration 1-8; retain append-only terminal events as audit history.
<!-- /ANCHOR:l2-rollback -->
