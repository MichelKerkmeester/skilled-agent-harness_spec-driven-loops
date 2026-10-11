---
title: "Goal: Phase 9: reducer-config-message"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/009-reducer-config-message"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-009-reducer-config-message"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 9: reducer-config-message

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A strict reduction that fails only on a missing review config says so, instead of reporting state-log corruption.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The error code stays STATE_CORRUPTION |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run tests/unit/deep-review-state-reducer.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/009-reducer-config-message --strict`, run from the repository root, prints RESULT: PASSED.
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
| Phase planned | Done | Scope written from review-report.md |
| Fix built | Done | Two DeepSeek dispatches |
| Tests proven | Done | Fail before, pass after |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
