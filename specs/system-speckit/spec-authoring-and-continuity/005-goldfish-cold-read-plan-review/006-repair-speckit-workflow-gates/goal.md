---
title: "Goal: Repair the speckit workflow gates"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates"
    last_updated_at: "2026-11-12T01:45:48Z"
    last_updated_by: "codex-closeout"
    recent_action: "Reconciled CHK-012 and recorded fresh verification evidence"
    next_safe_action: "Keep the packet Draft until its owner closes it; retain the three out-of-scope questions."
    blockers: []
    key_files:
      - ".skilled/commands/speckit/assets/speckit-implement.yaml"
      - ".skilled/commands/speckit/assets/speckit-complete.yaml"
      - ".skilled/commands/speckit/assets/speckit-plan.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the quality_gates and circuit_breaker blocks be deleted? This phase leaves both unchanged."
      - "Should the complete workflow receive the same prerequisite and test-failure repairs? This phase leaves them unchanged because the findings name speckit-implement.yaml."
      - "Should default_level: level_2 be deleted? This phase leaves the current default unchanged."
    answered_questions:
      - "CHK-012 is resolved: its checklist criterion allows REQ-001's plan_clarity row and preserves the unrelated gate settings, as confirmed by the scoped diff."
---
# Goal: Repair the speckit workflow gates

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The `/speckit:*` workflows stop on a failing test and on a plan that leaves a design choice open.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` change. |
| D2 | The `quality_gates`, `circuit_breaker` and `default_level` entries are not deleted. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `plan_clarity` is defined in `speckit-implement.yaml` where it is scored
- [x] `step_5_implementation_check` carries a design-choice check with an `on_fail`
- [x] `step_7_completion` names a stop for a failing test
- [x] The phase gate in `speckit-complete.yaml` checks that `plan.md` states a technical approach
- [x] The marker line in `speckit-plan.yaml` reads as passes of three
- [x] All three YAML files parse
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
| Phase opened | Recorded | spec.md metadata records creation on 2026-11-11 on branch main. |
| Phase 6 verification closeout | Recorded | T001–T003 committed HEAD queries printed 3, 1, and 1; the corresponding built-worktree searches returned no output (exit 1). T004–T009 closeout outputs are recorded in tasks.md. CHK-012 is resolved by the scoped diff. The packet remains Draft for its owner to close. |
| Phase closeout | Done | spec.md:23 records Complete; tasks.md has all 10 task rows and 29 verification-checklist rows checked; acceptance-criteria.md has five Met rows and Closeable: Yes. |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and get rechecked against the reviewed spec |
| CHK-012 reconciliation | The checklist now permits REQ-001's scoped plan_clarity row while preserving unrelated gate settings; the current diff confirms the scoped change. |
<!-- /ANCHOR:log -->
