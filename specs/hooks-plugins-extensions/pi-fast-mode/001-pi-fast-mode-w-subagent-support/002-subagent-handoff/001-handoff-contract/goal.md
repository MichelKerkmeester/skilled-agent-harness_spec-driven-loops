---
title: "Goal: Handoff Contract"
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
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract"
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
# Goal: Handoff Contract

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Define the one strict handoff contract for `PI_FAST_MODE_W_SUBAGENT_SUPPORT`: a `readHandoff` that maps only `1` and `0` to a preference, a `writeHandoff` that emits only those two strings, and a documented rule that the parent writes and children only read.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `src/handoff.ts` is pure: no lifecycle wiring, config, UI or provider-payload work. |
| D2 | `HANDOFF_ENV` and the `FastModePreference` type live in `src/types.ts`. |
| D3 | No alias is read for any other environment name. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `src/types.ts` exports `HANDOFF_ENV` with the value `PI_FAST_MODE_W_SUBAGENT_SUPPORT`
- [x] `tests/handoff.test.ts` asserts `"1"` gives true, `"0"` gives false, and unset, `"true"`, `"2"` and `""` give `undefined`, and it passes
- [x] `tests/handoff.test.ts` asserts `writeHandoff` writes exactly `"1"` for true and `"0"` for false
- [x] An `rg` scan of installed packages, pinned sources and user `.pi` finds no earlier `PI_FAST_MODE*` name
- [x] `npm run typecheck` exits 0 and `npm test` reports 76 tests passed
- [x] This folder's `plan.md` states that the parent writes the value and children only read their copied environment
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
| Collision scan | Done (2026-08-16) | `tasks.md` T401; `implementation-summary.md` Verification row |
| Constant, helpers and contract tests | Done | `tasks.md` T403, T404 |
| Typecheck and suite | Done | `tasks.md` T405 (76 passed; typecheck exit 0) |
| Parent-only ownership policy | Done | `tasks.md` T402, T406; `plan.md` FIX ADDENDUM |

### Deviations and findings

| Item | Note |
|------|------|
| Suite count | The 76-test count is the whole package suite across 7 files, recorded identically in all three handoff leaves (`implementation-summary.md`: 57 before the workstream plus 19 new) |
<!-- /ANCHOR:log -->
