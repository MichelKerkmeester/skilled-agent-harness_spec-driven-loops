---
title: "454 -- Goal OpenCode plugin active-goal injection and status"
description: "Manual scenario validating the local /goal OpenCode plugin, active-goal injection preview, prompt metadata, and restart boundary."
version: 3.7.0.1
---

# 454 -- Goal OpenCode plugin active-goal injection and status

Use this scenario to verify that a live or test-backed OpenCode session exposes the active goal state through plugin-owned status and injection preview output.

## 1. OVERVIEW

This scenario validates that the local `/goal` OpenCode plugin owns session-goal state, exposes the expected tool status, and renders the same active-goal context the model receives.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `/goal set` persists a goal, generates `goalPrompt` metadata, and exposes an `[active_goal]` injection preview through plugin status.
- Real user request: `Set a goal to finish the goal plugin docs integration, then show me the active goal status and the injection preview.`
- Prompt: `Validate the /goal plugin active-goal injection and status surface.`
- Expected execution process: Restart OpenCode after plugin edits, run `/goal set <objective>`, run `/goal show`, inspect the status envelope, and compare it with the plugin unit tests when a direct runtime check is unavailable.
- Expected signals: `STATUS=OK ACTION=set`, `STATUS=OK ACTION=show`, `goal_prompt=`, `prompt_framework="CRAFT+TIDD-EC"`, `prompt_max_chars=4000`, `mutation=created|refreshed|replaced` on set, `store_health=` on status/set output, and an injection preview containing `[active_goal:<goalId>]` plus `goal_prompt:`.
- Desired user-visible outcome: A concise pass/fail verdict with the exact status lines or unit-test evidence.
- Pass/fail: PASS if tool status and injection preview include the active goal plus prompt metadata; FAIL if `/goal` reads state directly from command markdown, omits `goal_prompt`, or requires MCP daemon state.

---

## 3. TEST EXECUTION

### Prompt

```text
As an OpenCode runtime validation operator, restart OpenCode if plugin files changed, run /goal set "Finish the goal plugin docs integration and validate it", then run /goal show. Verify the output contains STATUS=OK, an active status, goal_prompt metadata, prompt_framework="CRAFT+TIDD-EC", prompt_max_chars=4000, and an injection preview with [active_goal:<goalId>] plus goal_prompt:. Return a concise PASS/FAIL verdict with cited output.
```

### Commands

1. Restart OpenCode after any `.opencode/plugins/mk-goal.js` or `.opencode/commands/goal_opencode.md` edit.
2. `/goal set Finish the goal plugin docs integration and validate it`
3. `/goal show`
4. If a live OpenCode restart is unavailable, run `node .opencode/plugins/tests/mk-goal-state.test.cjs` and `node .opencode/plugins/tests/mk-goal-tool-path.test.cjs` as fallback evidence.

### Expected

Status output includes active goal state, `goal_prompt=`, prompt metadata, `mutation=created|refreshed|replaced` on set, `store_health=` on status/set output, and an injection preview containing `[active_goal:<goalId>]` and `goal_prompt:`.

### Evidence

Capture the `/goal show` status envelope or the two Node test transcripts.

### Pass / Fail

- **Pass**: active goal state, prompt metadata, and injection preview are visible and owned by plugin tools.
- **Fail**: command markdown reads state directly, status lacks prompt metadata, set output omits `mutation=`, status/set output omits `store_health=`, or injection preview omits `goal_prompt:`.

### Failure Triage

Confirm OpenCode was restarted -> inspect `.opencode/plugins/mk-goal.js` plugin load -> inspect `.opencode/commands/goal_opencode.md` allowed tools -> run `mk-goal-state` and `mk-goal-tool-path` tests -> inspect `.opencode/skills/.goal-state/` only as runtime evidence, not as command-owned state.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/goal-opencode-plugin.md](../../feature_catalog/18--ux-hooks/goal-opencode-plugin.md)
- Operator reference: [references/hooks/goal_plugin.md](../../references/hooks/goal_plugin.md)
- Source file: `.opencode/plugins/mk-goal.js`
- Command file: `.opencode/commands/goal_opencode.md`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 454
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/goal-opencode-plugin.md`
