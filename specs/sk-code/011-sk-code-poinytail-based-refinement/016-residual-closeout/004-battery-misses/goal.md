---
title: "Goal: Phase 4: battery-misses"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/004-battery-misses"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-004-battery-misses"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: battery-misses

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Each battery miss ends FIXED at its root cause with no new false positive, or CLOSED with the rule and the score gap that block it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A fix is metadata the owning skill lacks; scorer rules and token tables stay as they are |
| D2 | No probe-specific special case |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs`, run from the repository root, ends with positives 16/17 negatives-false-positive 0/5.
- [ ] `python3 specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py`, run from the repository root, ends with positives 15/17 negatives-false-positive 0/5.
- [ ] `npx vitest run`, run from `.skilled/skills/system-skill-advisor/runtime`, reports 0 failed.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/004-battery-misses --strict`, run from the repository root, prints RESULT: PASSED.
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
| P15 fix and release | Done | 16/17 and 15/17, 0/5 |
| P4 and P7 | Done | CLOSED with rule and gap |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
