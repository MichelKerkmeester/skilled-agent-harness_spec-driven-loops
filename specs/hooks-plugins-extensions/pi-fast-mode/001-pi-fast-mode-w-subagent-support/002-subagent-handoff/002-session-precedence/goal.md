---
title: "Goal: Session Precedence"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/002-session-precedence"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Add the missing evidence for the 2 unticked criteria, starting with the first one in section 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 67
    open_questions: []
    answered_questions: []
---
# Goal: Session Precedence

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Wire the handoff value into the extension lifecycle so the parent writes the normalized value after `/fast` changes and `session_start` resolves explicit `--fast` true, then inherited env, then persisted config, without an absent flag erasing inherited state or handoff bypassing model and target gating.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Flag presence is read as `pi.getFlag("fast") === true`. No `--no-fast` flag is added. |
| D2 | The parent writes the env value after the config is saved, not before. |
| D3 | Invalid or unset inherited env falls through as `readHandoff(process.env) ?? config.enabled`. Lifecycle code does no parsing of its own. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The `/fast` handler in `src/index.ts` calls `writeHandoff(process.env, config.enabled)` after saving config
- [x] `session_start` in `src/index.ts` resolves `pi.getFlag("fast") === true` first, then `readHandoff(process.env)`, then `config.enabled`, and writes the result back to the env
- [x] `tests/precedence.test.ts` covers explicit `--fast` true over inherited state, inherited `1`, inherited `0` and the no-bypass guard, and it passes
- [ ] `tests/precedence.test.ts` has a test proving an explicit `/fast off` disables fast mode despite inherited `1`
- [ ] `tests/precedence.test.ts` has rows proving an invalid and an unset inherited value each resolve to `config.enabled`
- [x] `tests/payload-status.test.ts` still passes, `npm run typecheck` exits 0 and `npm test` reports 76 passed
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
| Flag presence API and matrix | Done (2026-08-16) | `tasks.md` T501, T502 |
| Toggle write and session-start resolution | Done | `tasks.md` T503, T504 (`src/index.ts:111-113`, `src/index.ts:126-135`) |
| Precedence tests | Partial | `tasks.md` T506 records explicit and inherited rows only |
| Gating regression, typecheck and suite | Done | `tasks.md` T505, T507 |

### Deviations and findings

| Item | Note |
|------|------|
| Explicit `/fast off` row unticked | `spec.md` REQ-006 asks for a matrix test. `implementation-summary.md` says `/fast off` works through `parseFastCommand` at `src/index.ts:111-113`, but records no precedence test for it |
| Invalid and unset rows unticked | `spec.md` REQ-003 asks for tests. `implementation-summary.md` says the fallback is guaranteed by `readHandoff` returning `undefined` (tested in `tests/handoff.test.ts`) composed with `?? config.enabled`; no precedence-test row is recorded |
| Plan claims more than tasks | `plan.md` §4 and T506 are ticked for every matrix row, while the T506 evidence covers explicit and inherited rows only |
<!-- /ANCHOR:log -->
