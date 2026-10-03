---
title: "Goal: Install Transition"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/002-install-transition"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Install Transition

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replace `pi-gpt-fast-mode` with the fork in the Pi install, with a pre-state snapshot and rollback sequence recorded first, and prove the fork owns bare `/fast` before any live check runs.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fork is installed at user scope from `./packages/pi-fast-mode-w-subagent-support`, the same scope as the `pi-gpt-fast-mode` it replaces. |
| D2 | The pre-state snapshot lives in `scratch/rollback-snapshot/` and holds no credentials. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/rollback-snapshot/` holds `settings.json.before` and `pi-list.before.txt`, captured before the first `pi` mutation
- [x] `pi list` shows the fork and 0 `pi-gpt-fast-mode` entries, and no `pi-gpt-fast-mode` copy remains on disk at user or project scope
- [x] RPC `get_commands` exits 0 and lists `"name":"fast"` from the fork's `src/index.ts` with no `/fast:1` suffix
- [x] `python3 -m json.tool .pi/settings.json` parses cleanly and the file references the fork's path in place of `pi-gpt-fast-mode`
- [x] This folder's `plan.md` rollback section lists removing the fork, restoring `settings.json.before`, reinstalling the legacy source and rechecking `pi list` and `get_commands`
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
| Pre-state snapshot | Done (2026-08-16) | `tasks.md` T802; `implementation-summary.md` Pre-state snapshot row |
| Install and removal | Done | `tasks.md` T803, T804 (fork 3 refs in `pi list`; 0 `pi-gpt-fast-mode` in `pi list` and on disk) |
| Bare `/fast` ownership | Done | `tasks.md` T805 |
| Settings validity | Done | `implementation-summary.md` Settings valid row |
| Rollback sequence | Done | `plan.md` §7; `tasks.md` T802 |

### Deviations and findings

| Item | Note |
|------|------|
| User scope instead of `-l` | `plan.md` chose a project-scope `pi install -l`; the operator chose a user-scope replace because `pi-gpt-fast-mode` was user-scoped (T801) |
| Not one bounded operation | The transition ran as install, verify load, then remove (T803). The workstream goal's D2 says the colliding extension is removed in the same bounded operation. This conflict is named here, not resolved |
| npm inventory | `spec.md` REQ-002 asks `pi list` and npm inventories to agree; the recorded evidence is `pi list` plus an on-disk check, with no `npm ls` output |
| Out-of-scope edits in the settings commit | `.pi/PLUGINS.md` was updated here (T806), and a concurrent `defaultProvider` and `defaultModel` change rode along in the `.pi/settings.json` commit (`implementation-summary.md` Known Limitations 2) |
<!-- /ANCHOR:log -->
