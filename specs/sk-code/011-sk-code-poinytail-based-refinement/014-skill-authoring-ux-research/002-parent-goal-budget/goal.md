---
title: "Goal: Phase 2: parent-goal-budget"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/002-parent-goal-budget"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-002-parent-goal-budget"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: parent-goal-budget

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 011 parent goal durable slice to 3,800 characters or fewer, cut in the order sk-create-goal prescribes, with all six completion criteria kept.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Cut in the order of sk-create-goal references/budget-and-handoff.md section 3, steps 3 to 6, and stop at the first step that reaches the target. |
| D2 | Target 3,800 rather than 4,000 so the two sibling binding rows still fit after merge. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-code/011-sk-code-poinytail-based-refinement --workspace .`, run from the repository root, prints packet_budget=ok and a packet_durable_chars value of 3800 or less.
- [ ] `grep -c '^- \[[ x]\] ' specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md`, run from the repository root, prints 6.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/011-sk-code-poinytail-based-refinement`, run from the repository root, prints RESULT: PASSED.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/002-parent-goal-budget --strict`, run from the repository root, prints RESULT: PASSED.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | spec.md, plan.md, tasks.md and this goal written by the orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Recorded here as the phase runs |
<!-- /ANCHOR:log -->
