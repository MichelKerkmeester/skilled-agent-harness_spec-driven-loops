---
title: "Goal: Phase 17: fleet-front-door-stdin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fleet front door stdin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/017-fleet-front-door-stdin"
    last_updated_at: "2026-11-24T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the fleet stdin front door"
    next_safe_action: "Triage the generation-4 P2 findings in phase 018"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-fleet-front-door-stdin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: fleet-front-door-stdin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every hub tells agents to pass the task to its compiled front door without the shell expanding it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The whole fleet moves to `--prompt-stdin` with a quoted heredoc (operator answer "Fleet-wide switch") |
| D2 | Changelogs and benchmark reports keep their old wording |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git grep -- '--prompt "<task>"' -- .skilled` outside changelogs and benchmarks prints nothing
- [x] A heredoc task holding `$()` and a backtick routes on all eight hubs and creates no file
- [x] The bin suite passes and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED
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
| 32 lines rewritten | Done | Grep empty |
| Manifests and signals | Done | Guard 8 fresh; generator PASSED on eight |
| Checks | Done | Canaries 8 of 8; bin 197 of 197; pytest 462 passed |

### Deviations and findings

| Item | Note |
|------|------|
| The parity test was described as pinning all eight hubs | It asserts only synthetic fixtures; its live report is informational and covers five hubs |
| Canary harnesses wrote untracked build folders | Removed after the run |
<!-- /ANCHOR:log -->
