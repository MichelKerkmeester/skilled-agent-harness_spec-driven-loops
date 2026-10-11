---
title: "Goal: Phase 4: dispatch-guard-and-vitest"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/004-dispatch-guard-and-vitest"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-015-004-dispatch-guard-and-vitest"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: dispatch-guard-and-vitest

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A vitest run over the hooks tree exits 0 with no node-style coverage lost, and a bash -c payload with escaped quotes is classified by the command it runs.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Skip by content, not by a hand list, so a new node-style file never breaks the run |
| D2 | An expansion inside a payload keeps failing closed |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx --prefix .skilled vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch`, run from the repository root, exits 0 with every test file passed.
- [ ] `npx --prefix .skilled vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks`, run from the repository root, exits 0.
- [ ] `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, run from the repository root, exits 0 with fail 0.
- [ ] `grep -c 'escaped quotes\|escaped quoted path' .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, run from the repository root, prints 2 or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout/004-dispatch-guard-and-vitest --strict`, run from the repository root, prints RESULT: PASSED.
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
| Payload fix and vitest exclusion | Done | 3 new cases failed before the fix; both vitest scopes exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
