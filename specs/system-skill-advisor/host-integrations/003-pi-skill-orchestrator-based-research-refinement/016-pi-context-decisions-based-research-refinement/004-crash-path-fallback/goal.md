---
title: "Goal: Crash-Path Fallback and Threshold Doc Line"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "crash path fallback goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/004-crash-path-fallback"
    last_updated_at: "2026-11-18T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 002 is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Crash-Path Fallback and Threshold Doc Line

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A crash inside the shared advisor hook shows the model the outage line instead of nothing, and the threshold doc names the override that works.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Edit only the catch in `hooks/claude/user-prompt-submit.ts`. The adapter import-failure catches stay as they are |
| D2 | One test, with a throwing `renderBrief` |
| D3 | One sentence in `ENV-REFERENCE.md`. No new output field, warning or schema bump |
| D4 | Built by the parent's Luna swarm with the Vibe fallback, in the waves `../delegation-strategy.md` section 4 gives this phase. The test lands and fails before the catch changes |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run tests/hooks` exits 0 from the advisor runtime folder, with the new test included
- [ ] `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints line 382
- [ ] `git diff --stat` lists only the three planned files
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18 |

### Deviations and findings

| Item | Note |
|------|------|
| Catch range | The brief cited `:466-480`. The catch itself spans `:468-480`. Lines 466 and 467 close the try body |
<!-- /ANCHOR:log -->
