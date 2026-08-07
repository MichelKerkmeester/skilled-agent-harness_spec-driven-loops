---
title: "Tasks: Post-019 Skill-Routing Research"
description: "Completed research, reducer, synthesis, and verification tasks for phase 018."
trigger_phrases:
  - "post-019 research tasks"
  - "skill routing research tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/018-post-019-research"
    last_updated_at: "2026-07-25T07:47:34Z"
    last_updated_by: "opencode"
    recent_action: "Completed all approved eight-iteration research and closeout tasks"
    next_safe_action: "Translate recommendations into separately scoped implementation tasks"
    completion_pct: 100
---
# Tasks: Post-019 Skill-Routing Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Test TRP and authority across all routing archetypes [EVIDENCE: `research/iterations/iteration-001.md`]
- [x] T002 Analyze advisor confidence and selective routing [EVIDENCE: `research/iterations/iteration-002.md`]
- [x] T003 Define causal leaf-use telemetry [EVIDENCE: `research/iterations/iteration-003.md`]
- [x] T004 Specify the required/supplemental paired ablation [EVIDENCE: `research/iterations/iteration-004.md`]
- [x] T005 Bound fixture claims against natural-prompt validity [EVIDENCE: `research/iterations/iteration-005.md`]
- [x] T006 Define the joined route/execution/outcome estimator [EVIDENCE: `research/iterations/iteration-006.md`]
- [x] T007 Resolve fleet reproduction and 8-versus-13 provenance [EVIDENCE: `research/iterations/iteration-007.md`]
- [x] T008 Design the privacy-preserving sealed sampling frame [EVIDENCE: `research/iterations/iteration-008.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 Support `iteration` when `run` is absent [EVIDENCE: `reduce-state.cjs`]
- [x] T010 Resolve questions from canonical question context [EVIDENCE: `findings-registry.json`]
- [x] T011 Persist confirm-mode `manualStop` [EVIDENCE: `deep-research-confirm.yaml`]
- [x] T012 Add reducer and contract regressions [EVIDENCE: targeted Vitest 20/20]
- [x] T013 Reconcile stale reducer fixtures and capability expectations [EVIDENCE: `deep-research-contract-parity.vitest.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Record approved manual stop after iteration 8 [EVIDENCE: `research/deep-research-state.jsonl`]
- [x] T015 Refresh registry, strategy, dashboard, and resource map [EVIDENCE: `research/findings-registry.json`]
- [x] T016 Compile `research/research.md` [EVIDENCE: 17-section synthesis]
- [x] T017 Append terminal synthesis state and mark config complete [EVIDENCE: `research/deep-research-config.json`]
- [x] T018 Release the stale advisory lock through the lock helper [EVIDENCE: `loop-lock.cjs status` reports exists=false]
- [x] T019 Reconcile Level 2 packet documentation [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Eight completed iterations remain canonical
- [x] Iterations 9-10 are not claimed as completed
- [x] Five original questions are resolved in reducer state
- [x] Synthesis distinguishes confirmed findings from proposed experiments
- [x] Terminal status and lock state are clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
- `implementation-summary.md`
- `research/research.md`
<!-- /ANCHOR:cross-refs -->
