---
title: "Goal: Phase 2: goal-criteria-refresh"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/002-goal-criteria-refresh"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-015-002-goal-criteria-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: goal-criteria-refresh

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every completed goal criterion in the 011 and 066 trees passes against today's tree, and each amendment is logged with its date and reason.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | An amendment follows a rename, a later count, a merged branch range or a later version, and never weakens what the criterion proves |
| D2 | Branch-range checks become commit-based checks on the commit that shipped the work |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -rh --include=goal.md '| Criterion [0-9]* amended 2026-10-11' specs/sk-code/011-sk-code-poinytail-based-refinement specs/sk-doc/066-feature-catalog-template-anchor-deprecation | wc -l`, run from the repository root, prints 75 or more.
- [ ] `bash specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard/scratch/prototype/negative-controls.sh`, run from the repository root, prints `6/6`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout/002-goal-criteria-refresh --strict`, run from the repository root, prints RESULT: PASSED.
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
| Criteria rerun and amended | Done | 459 criteria run; 75 amended in 48 goals; every amended command reran green |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
