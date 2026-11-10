---
title: "Goal: Extension Integration Suite"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Add the missing evidence for the unticked criterion in section 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 83
    open_questions: []
    answered_questions: []
---
# Goal: Extension Integration Suite

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Cover the extension's registration, lifecycle, config, model, status and handoff boundaries through a structural FakePi so a broken boundary fails `npm test` before any install changes settings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fake is a plain object of `vi.fn()` spies and handler and command maps passed to the extension factory. The Pi module is never mocked as a whole. |
| D2 | Tests assert observable registrations, payloads and status calls. They do not reimplement production logic. |
| D3 | Real command-suffix renumbering, live RPC and TUI rendering and real child spawn stay out of this suite. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The suite asserts `registerCommand("fast")`, `registerFlag("fast")` and the `session_start`, `model_select` and `session_shutdown` handler order
- [x] The suite exercises config scope resolution and the one-time legacy migration
- [x] The suite asserts `setStatus(STATUS_KEY, ...)` calls and a cloned payload carrying `service_tier` for a supported model
- [ ] A command-ownership helper is exported from the test suite for the live `get_commands` probe
- [x] `npm run typecheck` exits 0 and `npm test` reports 76 passed
- [x] `git status` shows no `.pi/` or npm-scope change caused by this phase
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
| FakePi inventory and fixture | Done (2026-08-17) | `tasks.md` T701, T702 |
| Registration, lifecycle, config, status and payload cases | Done | `tasks.md` T703, T704, T705 |
| Command-ownership helper | Not done | `tasks.md` T706 records the helper was not exported |
| Typecheck, suite and scope | Done | `tasks.md` T707, T708 |

### Deviations and findings

| Item | Note |
|------|------|
| Ownership helper unticked | `spec.md` REQ-004 asks for an exported helper. T706 and `implementation-summary.md` say live ownership was proven through RPC `get_commands` in `002-install-transition` instead |
| Test layout | The FakePi is inline in `tests/extension.test.ts`, not in `tests/helpers/fake-pi.ts`, and the planned `lifecycle`, `config-migration` and `integration` test files were folded into existing files (T702 to T705) |
| Open question left in `spec.md` | `spec.md` §7 still asks which `get_commands` assertions can be in-process; `plan.md` §5 answers it |
<!-- /ANCHOR:log -->
