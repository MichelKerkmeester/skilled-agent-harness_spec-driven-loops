---
title: "454 -- Goal OpenCode plugin active-goal injection and status"
description: "Manual scenario validating the local /goal OpenCode plugin, active-goal injection preview, prompt metadata, and restart boundary."
version: 3.7.0.1
id: ux-hooks-goal-opencode-plugin
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/hooks/goal-plugin.md
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
- Expected execution process: Restart OpenCode after plugin edits, run `/goal set <objective> --budget N`, run `/goal show`, run `/goal history`, run `/goal doctor` or `/goal health`, run `/goal pause <reason>`, run `/goal resume`, inspect each status envelope, validate `MK_GOAL_VERIFIER=heuristic` and optional `MK_GOAL_VERIFIER=llm`, and compare it with the plugin unit tests when a direct runtime check is unavailable.
- Expected signals: `STATUS=OK ACTION=set`, `STATUS=OK ACTION=show`, `STATUS=OK ACTION=history`, `STATUS=OK ACTION=doctor` or `STATUS=OK ACTION=health`, `STATUS=OK ACTION=resume`, `goal_prompt=`, `prompt_framework="CRAFT+TIDD-EC"`, `prompt_max_chars=4000`, `token_budget=`, `remaining_auto_turns=`, `remaining_wall_ms=`, `provider_retry_after_ms=`, `verifier_source=none|injected|default-heuristic|default-llm`, `mutation=created|refreshed|replaced` on set, `store_health=` on status/set output, and an injection preview containing `[active_goal:<goalId>]` plus `goal_prompt:`.
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
4. `/goal set Finish the goal plugin docs integration and validate it --budget 1234`
5. `/goal history`
6. `/goal doctor`
7. `/goal health`
8. `/goal pause waiting for manual verification`
9. `/goal resume`
10. If a live OpenCode restart is unavailable, run `node .opencode/plugins/tests/mk-goal-state.test.cjs`, `node .opencode/plugins/tests/mk-goal-tool-path.test.cjs`, and `node .opencode/plugins/tests/mk-goal-capabilities.test.cjs` as fallback evidence.
11. Run `node .opencode/plugins/tests/mk-goal-supervisor.test.cjs` and confirm the default heuristic positive case, eight negative adversarial cases, LLM unavailable path, LLM success path, and `verifier_source` provenance assertions pass.

### Expected

Status output includes active goal state, `goal_prompt=`, prompt metadata, `mutation=created|refreshed|replaced` on set, `token_budget=1234`, `remaining_auto_turns=`, `remaining_wall_ms=`, `provider_retry_after_ms=`, `verifier_source=`, `store_health=` on status/set output, and an injection preview containing `[active_goal:<goalId>]` and `goal_prompt:`. `/goal history` includes `archive_count=`. `/goal doctor` and `/goal health` include `active_state_file_count=`, `archive_file_count=`, `continuation_log_bytes=`, `goal_events_log_bytes=`, `last_sweep_at=`, and `orphan_candidate_count=`. Default heuristic verification must complete only explicit objective-specific evidence and must keep empty, unrelated, mixed blocker, generic, truncated, repeat-only, investigation-only, or TODO evidence `not_met`.

### Env-Cap Check

Run a fresh OpenCode session with `MK_GOAL_MAX_AUTO_TURNS=3` and `MK_GOAL_MAX_WALL_MS=4000`, then run `/goal set Env cap validation --budget 99` and `/goal show`. PASS if status includes `remaining_auto_turns=3`, `max_wall_ms=4000`, and a positive `remaining_wall_ms`. FAIL if the defaults `8` and `1800000` remain in effect after restart.

### Evidence

Live OpenCode goal plugin tool output from `/goal set Finish the goal plugin docs integration and validate it` equivalent:

```text
STATUS=OK ACTION=set
mutation=created
goal_present=true
plugin_id=mk-goal
goal_id=goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894
status=active
objective="Finish the goal plugin docs integration and validate it"
goal_prompt="Role: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the goal plugin docs integration and validate it\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action."
prompt_framework="CRAFT+TIDD-EC"
prompt_methodology="DEPTH"
prompt_clear_score=44
prompt_char_count=1156
prompt_max_chars=4000
token_budget=none
tokens_used=0
time_used_seconds=0
usage_source=unavailable
budget_tokens_used=0
budget_token_budget=none
budget_usage_source=unavailable
created_at_ms=1783033167486
updated_at_ms=1783033167486
store_health=state_age_ms:5
last_check=not_evaluated
verifier_last_verdict=not_evaluated
verifier_source=none
verifier_last_evidence=""
blocked_by_prompt=false
continuation_suppressed=false
continuation_attempts=0
continuation_suppressed_reason=""
injection_preview="[active_goal:goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894]\nstatus: active\nobjective: Finish the goal plugin docs integration and validate it\ngoal_prompt:\nRole: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the goal plugin docs integration and validate it\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action.\nlast_check: not_evaluated ; reason: none\nusage: tokens 0/none; time 0s; iteration 0/8\ndirective: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.\n[/active_goal]"
```

Live OpenCode goal plugin tool output from `/goal show` equivalent:

```text
STATUS=OK ACTION=show
goal_present=true
plugin_id=mk-goal
goal_id=goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894
status=active
objective="Finish the goal plugin docs integration and validate it"
goal_prompt="Role: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the goal plugin docs integration and validate it\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action."
prompt_framework="CRAFT+TIDD-EC"
prompt_methodology="DEPTH"
prompt_clear_score=44
prompt_char_count=1156
prompt_max_chars=4000
token_budget=none
tokens_used=0
time_used_seconds=0
usage_source=unavailable
budget_tokens_used=0
budget_token_budget=none
budget_usage_source=unavailable
created_at_ms=1783033167486
updated_at_ms=1783033168833
store_health=state_age_ms:3677
last_check=not_evaluated
verifier_last_verdict=not_evaluated
verifier_source=none
verifier_last_evidence=""
blocked_by_prompt=false
continuation_suppressed=false
continuation_attempts=0
continuation_suppressed_reason=""
injection_preview="[active_goal:goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894]\nstatus: active\nobjective: Finish the goal plugin docs integration and validate it\ngoal_prompt:\nRole: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the goal plugin docs integration and validate it\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action.\nlast_check: not_evaluated ; reason: none\nusage: tokens 0/none; time 0s; iteration 0/8\ndirective: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.\n[/active_goal]"
```

Dedicated active-goal status and injection preview output:

```text
STATUS=OK ACTION=show
goal_present=true
plugin_id=mk-goal
goal_id=goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894
status=active
objective="Finish the goal plugin docs integration and validate it"
goal_prompt="Role: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the goal plugin docs integration and validate it\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action."
prompt_framework="CRAFT+TIDD-EC"
prompt_methodology="DEPTH"
prompt_clear_score=44
prompt_char_count=1156
prompt_max_chars=4000
token_budget=none
tokens_used=0
time_used_seconds=0
usage_source=unavailable
budget_tokens_used=0
budget_token_budget=none
budget_usage_source=unavailable
created_at_ms=1783033167486
updated_at_ms=1783033173736
store_health=state_age_ms:6701
last_check=not_evaluated
verifier_last_verdict=not_evaluated
verifier_source=none
verifier_last_evidence=""
blocked_by_prompt=false
continuation_suppressed=false
continuation_attempts=0
continuation_suppressed_reason=""
injection_preview="[active_goal:goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894]\nstatus: active\nobjective: Finish the goal plugin docs integration and validate it\ngoal_prompt:\nRole: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the goal plugin docs integration and validate it\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action.\nlast_check: not_evaluated ; reason: none\nusage: tokens 0/none; time 0s; iteration 0/8\ndirective: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.\n[/active_goal]"
```

### Pass / Fail

- **PASS**: active goal state, `goal_prompt=`, `prompt_framework="CRAFT+TIDD-EC"`, `prompt_max_chars=4000`, `mutation=created`, `store_health=`, `verifier_source=none` before verification, and injection preview with `[active_goal:goal-b7a3ad9a-f1a6-4787-8eb8-3c413c78a894]` plus `goal_prompt:` were visible from plugin-owned tool output.

- **Pass**: active goal state, prompt metadata, and injection preview are visible and owned by plugin tools.
- **Fail**: command markdown reads state directly, status lacks prompt metadata, set output omits `mutation=`, status/set output omits `store_health=` or `verifier_source=`, `/goal history` omits `archive_count=`, `/goal doctor` or `/goal health` omits `orphan_candidate_count=`, `/goal resume` cannot reactivate a paused goal, `MK_GOAL_VERIFIER=heuristic` false-completes weak evidence, `MK_GOAL_VERIFIER=llm` cannot reach `ctx.client.session.promptAsync` when enabled, `MK_GOAL_MAX_AUTO_TURNS` or `MK_GOAL_MAX_WALL_MS` is ignored, or injection preview omits `goal_prompt:`.

### Failure Triage

Confirm OpenCode was restarted -> inspect `.opencode/plugins/mk-goal.js` plugin load -> inspect `.opencode/commands/goal_opencode.md` allowed tools -> run `mk-goal-state` and `mk-goal-tool-path` tests -> inspect `.opencode/skills/.goal-state/` only as runtime evidence, not as command-owned state.

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/goal-opencode-plugin.md](../../feature-catalog/ux-hooks/goal-opencode-plugin.md)
- Operator reference: [references/hooks/goal-plugin.md](../../references/hooks/goal-plugin.md)
- Source file: `.opencode/plugins/mk-goal.js`
- Command file: `.opencode/commands/goal_opencode.md`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 454
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/goal-opencode-plugin.md`
