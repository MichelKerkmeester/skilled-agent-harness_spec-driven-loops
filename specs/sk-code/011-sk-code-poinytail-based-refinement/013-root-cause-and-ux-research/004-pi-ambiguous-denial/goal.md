---
title: "Goal: Phase 4: pi-ambiguous-denial"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/004-pi-ambiguous-denial"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-004-pi-ambiguous-denial"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: pi-ambiguous-denial

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the Pi dispatch guard's refusal of an ambiguous command tell the caller what command shape it accepts, pinned by a test that failed before the change.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The first sentence of the reason stays word for word; guidance is appended after it. |
| D2 | No shared message template is introduced; one string changes. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts 2>&1 | grep 'Tests '`, run from the repository root, prints `Tests  36 passed (36)`.
- [x] `grep -c 'Call one executor by its literal name' .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts`, run from the repository root, prints 1 for each file.
- [x] `grep -c 'the command does not prove one direct executor\.' .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`, run from the repository root, prints 1.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/004-pi-ambiguous-denial --strict`, run from the repository root, prints RESULT: PASSED.
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
| Before numbers | Done | Suite 35 passed (35) |
| Test added | Done | cli-pi build; suite 1 failed, 35 passed; the new test failed on `toContain` |
| Text extended | Done | cli-pi build; suite 36 passed (36) |

### Deviations and findings

| Item | Note |
|------|------|
| No version bump | The dispatch hooks sit outside every skill and carry no version or changelog |
<!-- /ANCHOR:log -->
