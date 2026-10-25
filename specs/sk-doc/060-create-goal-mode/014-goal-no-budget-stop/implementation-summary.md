---
title: "Implementation Summary"
description: "On OpenCode a goal now runs until it is completed, paused or cleared. The plugin no longer stops it on a token budget, a turn cap or a wall-clock cap, which matches the shared core behind Pi, Cursor and Devin."
trigger_phrases:
  - "goal no budget stop implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/014-goal-no-budget-stop"
    last_updated_at: "2026-10-24T16:47:40Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Removed the budget, turn and time stops from the OpenCode goal plugin and documented the change"
    next_safe_action: "Run the sk-code drift-guard wrapper, then close the packet and commit when asked"
    blockers: []
    key_files:
      - ".opencode/plugins/opencode-goal.js"
      - ".skilled/hooks/goal/lib/goal-core.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-goal-no-budget-stop"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-goal-no-budget-stop |
| **Completed** | 2026-10-24 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

On OpenCode, a goal now runs until you complete, pause or clear it. The plugin no longer stops it when a token budget is crossed, after 8 auto turns or after 30 minutes. That matches the shared core behind Pi, Cursor and Devin, which never stopped a goal on a limit.

### Phase 14: goal-no-budget-stop

You asked that the goal plugins and hooks of every runtime never stop a long-running goal on a budget, a turn count or elapsed time. Only the OpenCode plugin did. It set `budget_limited` and silenced continuation when a token budget was crossed, it stopped after 8 auto turns by default and it stopped after 30 minutes by default. The shared core only counts turns and injects whenever the status is `active`, and the Hermes plugin has no goal limit. The change is therefore in the OpenCode plugin alone.

The plugin lost the budget status switch in both token-accounting paths, the resume refusal while over budget, the cap and budget checks in the continuation decision and the cap check in the turn reservation. It also lost the two env variables, the two options and the stored `maxAutoTurns` field. Status output lost `max_auto_turns`, `remaining_auto_turns`, `max_wall_ms` and `remaining_wall_ms`, and the usage line now reads `iteration N` with no ratio, as the shared core prints it.

`--budget N` still records a budget and shows it as `token_budget` and in the usage line, but the figure is a reading only. The `budget_limited` value stays, so records an older version wrote still load and still resume with `/goal-opencode resume`. Token and time accounting, the 1500 ms cooldown between continuations and the provider `usage_limited` status are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/opencode-goal.js` (also reachable as `.skilled/plugins/opencode-goal.js`) | Modified | Removes the three stops, the two env variables, the two options, the stored cap field and four status lines |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs`, `opencode-goal-continuation.test.cjs`, `opencode-goal-lifecycle.test.cjs`, `opencode-goal-render-parity.test.cjs`, `opencode-goal-state.test.cjs` | Modified | Twelve tests that asserted the old stops now assert that the goal keeps running. One pair of cap tests became one test |
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modified | One new test, `a recorded token budget never ends or silences a goal that keeps running` |
| `.skilled/hooks/goal/goal-plugin.md`, `.skilled/commands/goal-opencode.md` | Modified | State that no budget, turn count or elapsed time ends a goal and that `--budget N` is a recorded reading |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md` and `manual-testing-playbook/ux-hooks/goal-opencode-plugin.md` | Modified | The system-spec-kit entries describe a goal with no ceiling |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md` and `manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modified | The system-skill-advisor entries describe a goal with no ceiling |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modified | Drop `OPENCODE_GOAL_MAX_AUTO_TURNS` and `OPENCODE_GOAL_MAX_WALL_MS` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change removes code from one plugin file and updates its tests and docs. The baselines came first: 152 of 152 in the OpenCode goal suites and 162 of 162 across the shared hook suites. After the change the OpenCode suites pass 151 of 151 and `goal-core.test.cjs` passes 87 of 87. A negative control ran the rewritten and new tests against the pre-change plugin, and 10 of them fail. The sk-code drift-guard wrapper passes on the final state. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the stops instead of raising their defaults | You asked that no runtime stop a goal on a budget, a turn count or elapsed time, and a higher cap would still stop a long goal |
| Keep `tokenBudget` and `--budget N` as a recorded reading | The figure stays visible as `token_budget` and in the usage line, and the command still accepts it |
| Keep the `budget_limited` value | Records an older version wrote still load and still resume |
| Keep the `usage_limited` status | It records a provider quota, which is not a goal limit |
| Leave the shared core code and the Hermes plugin unchanged | Neither ever stopped a goal on a limit, and one core test now pins that rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| OpenCode goal suites, baseline before the change | PASS, 152 of 152 |
| OpenCode goal suites after the change (`node --test .opencode/plugins/tests/opencode-goal-*.test.cjs`) | PASS, 151 of 151 |
| `goal-core.test.cjs` after the change | PASS, 87 of 87 with the new test |
| Shared hook suites, baseline before the change | PASS, 162 of 162 |
| Negative control, the rewritten and new tests against the pre-change plugin | 10 of them fail, as intended |
| Retired names in the plugin (V1) | 0, from 26 at HEAD |
| Retired variables in `ENV-REFERENCE.md` and `.env.example` (V5) | 0, from 4 at HEAD |
| Retired variables in `.skilled` outside the changelogs (V6) | 3, from 14 at HEAD, each a playbook step that says they change nothing |
| sk-code drift-guard wrapper | PASS, all 4 guards passed, exit 0, on the final state |
| `validate.sh` on this folder with `--strict` | PASS, `RESULT: PASSED`, Errors 0, Warnings 0. The parent with `--strict --recursive` also prints `RESULT: PASSED` for all 15 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A goal can now run without any ceiling.** You stop it with `/goal-opencode pause` or `/goal-opencode clear`.
2. **A record an older version already suppressed stays suppressed.** A record suppressed with a cap or budget reason has `continuationSuppressed` true, and nothing clears that flag on its own. Setting the goal again replaces it. The only cleanup that touches such a record is archiving, which removes it from active state without clearing the flag: `session.deleted` archives the session's record at once, and the orphan sweep (run on `session.created`, at most once an hour) archives an active-state file that nothing has updated for more than two days (`OPENCODE_GOAL_STATE_ACTIVE_RETENTION_DAYS`). As built here, `/goal-opencode resume` works only for `paused`, `usage_limited` and `budget_limited` records; a later phase makes it clear a retired cap or budget suppression.
<!-- /ANCHOR:limitations -->

---


