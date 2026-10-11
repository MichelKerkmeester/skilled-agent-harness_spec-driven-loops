---
title: "Goal: Phase 3: admission-gold"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/003-admission-gold"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-003-admission-gold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: admission-gold

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** DOC-331's drift is settled with evidence: the wrong side is named, and it is either fixed or closed with the reason and the smallest fix tried.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The scenario's prompt is not reworded to pass |
| D2 | A router mechanism needs a second real caller before it is built |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt 'Initialize the deep-loop graph from current iteration folders.'`, run from the repository root, prints an `action` of `defer`.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/003-admission-gold/scratch/context-strip-trial.cjs`, run from the repository root, prints prompts 15 changed 1.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/003-admission-gold --strict`, run from the repository root, prints RESULT: PASSED.
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
| Verdict | Done | Gold right, router wrong, CLOSED: one-caller mechanism |

### Deviations and findings

| Item | Note |
|------|------|
| Admission still fails for the hub | The operator's acceptance asked for admission to pass without `--warn-only`. The only fix that does it is a one-caller mechanism, so the item is CLOSED instead, as the brief allows |
<!-- /ANCHOR:log -->
