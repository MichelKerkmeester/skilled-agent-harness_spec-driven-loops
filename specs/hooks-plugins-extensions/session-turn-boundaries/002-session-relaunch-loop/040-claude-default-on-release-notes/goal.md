---
title: "Goal: Claude Code session handover on by default and v4.0.2.1 release notes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claude default on release notes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/040-claude-default-on-release-notes"
    last_updated_at: "2026-11-14T19:45:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Claude Code session handover on by default and v4.0.2.1 release notes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Claude Code users of Skilled get in-session handover by default while every other runtime stays off until switched on, and the v4.0.2.1 release notes and root README describe every handover change in the existing changelog style.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the default changes. Hop behavior, the wrapper and the adapters stay as they are. |
| D2 | A set global or Claude switch, a kill switch and the master switch all answer before the Claude default. |
| D3 | The release tag, the GitHub release and any merge or push wait for the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] With no switch set, `hookFlagDecision` returns enabled for `claude` and disabled for the other five runtimes, and `hook_enabled` agrees
- [x] The relaunch, plugin, resolver, goal and Pi suites pass with 0 failed
- [x] `check_changelog_shape.py` passes the v4.0.2.1 entry, and its Session Handover section names the Claude default
- [x] `validate.sh --strict` on this packet prints `RESULT: PASSED`
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
| Resolver and tests | Done | 29 of 29 resolver tests, 2 failed before the change |
| Docs, README and release notes | Done | shape PASS at 280 lines, voice 0 hard blockers |
| Full gate | Done | 1,556, 29, 200 and 62 passed, both sync checks PASS |
| Dotenv template | Done | .env.example sections 8 and 18 say on for Claude Code only, edited on the operator's request 2026-11-15 |

### Deviations and findings

| Item | Note |
|------|------|
| Dotenv template | Left unedited under the operator's rule against dotenv files. One comment there still says the loop ships off. |
| Release entry length | The entry sat at its 280-line ceiling, so same-effect items were merged, including two CI items outside the handover section. |
<!-- /ANCHOR:log -->
