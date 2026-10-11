---
title: "Goal: Phase 5: hooks-vitest-scope"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/005-hooks-vitest-scope"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-016-005-hooks-vitest-scope"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: hooks-vitest-scope

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A hooks vitest run started from `.skilled/hooks` collects only the hooks tree, exits 0 and leaves the working tree clean, with every current hooks suite still collected.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The root stays the repository so hook imports resolve |
| D2 | The fix is one include entry |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run dispatch`, run from `.skilled/hooks`, exits 0.
- [ ] `git status --short`, run from the repository root right after that run, prints nothing.
- [ ] `npx --prefix .skilled vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks`, run from the repository root, reports 5 test files passed.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/005-hooks-vitest-scope --strict`, run from the repository root, prints RESULT: PASSED.
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
| Include | Done | dispatch run exit 0, tree clean |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
