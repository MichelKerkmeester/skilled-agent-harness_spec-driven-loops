---
title: "Goal: Phase 2: hooks-readme-voice"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/002-hooks-readme-voice"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-002-hooks-readme-voice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: hooks-readme-voice

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Both hooks READMEs scan with 0 HVR hard blockers, and no technical claim in either changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rewrites change punctuation and joining words only |
| D2 | Semicolons inside code blocks stay |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/system-spec-kit/runtime/hooks/README.md | grep 'hard blockers'`, run from the repository root, prints hard blockers 0.
- [ ] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/hooks/README.md | grep 'hard blockers'`, run from the repository root, prints hard blockers 0.
- [ ] `python3 .skilled/skills/sk-doc/scripts/package_skill.py --check --strict .skilled/skills/system-spec-kit`, run from the repository root, prints Result: PASS.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/002-hooks-readme-voice --strict`, run from the repository root, prints RESULT: PASSED.
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
| Rewrites and release | Done | 0 hard blockers in both files |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
