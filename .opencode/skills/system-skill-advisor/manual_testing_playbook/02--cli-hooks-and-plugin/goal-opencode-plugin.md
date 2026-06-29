---
title: "CL-007 Goal OpenCode Plugin"
description: "Manual validation for the /goal command, mk_goal tools, passive injection, supervisor lifecycle and default-off continuation gates."
trigger_phrases:
  - "cl-007"
  - "goal opencode plugin"
  - "/goal command"
  - "mk_goal"
version: 0.8.0.33
---

# CL-007 Goal OpenCode Plugin

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `/goal` routes through the OpenCode plugin tools, persists per-session state, injects a bounded active-goal block, reports status through `mk_goal_status`, and keeps active continuation default-off unless `MK_GOAL_AUTONOMY` explicitly enables smoke or active mode.

---

## 2. SCENARIO CONTRACT

- OpenCode plugin host can load `.opencode/plugins/mk-goal.js`.
- `/goal` command exists at `.opencode/commands/goal.md`.
- Use a disposable session or temporary `stateDir` so existing session goals are not overwritten.
- Known limitation: live OpenCode-run tool invocation is under investigation; when unavailable, execute the plugin tool path directly and record the limitation as the runtime blocker.

---

## 3. TEST EXECUTION

1. Run the state and tool-path tests:

```bash
node .opencode/plugins/__tests__/mk-goal-state.test.cjs
node .opencode/plugins/__tests__/mk-goal-tool-path.test.cjs
```

2. Run the supervisor, continuation and lifecycle tests:

```bash
node .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs
node .opencode/plugins/__tests__/mk-goal-continuation.test.cjs
node .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs
```

3. In a live OpenCode session when tool invocation is available, run:

```text
/goal set Finish the documentation propagation task
/goal show
/goal pause waiting for user approval
/goal complete
/goal clear
```

4. Capture the `STATUS=OK` envelopes and verify mutation responses include the post-mutation state.
5. Verify `mk_goal_status` includes `injection_preview=` and that the preview contains `[active_goal:<goal-id>]` only while the goal is active.
6. With `MK_GOAL_AUTONOMY` unset, confirm continuation is suppressed with `autonomy_disabled`.
7. With `MK_GOAL_AUTONOMY=smoke`, confirm the decision is `would_fire` and no prompt is submitted.
8. With `MK_GOAL_AUTONOMY=active`, confirm `promptAsync` is called only when every guard passes, or document the live-runtime blocker if OpenCode-run invocation is unavailable.

### Expected Signals

- `/goal` does not read or write `.opencode/skills/.goal-state` directly; all state access goes through `mk_goal` or `mk_goal_status`.
- Per-session JSON state is isolated by session id.
- Passive injection is bounded and sanitized.
- Supervisor verdicts map to durable goal state: `met` completes, `blocked` blocks, and ambiguous evidence remains active.
- Continuation is default-off and capped when explicitly enabled.
- Live OpenCode-run tool invocation gaps are reported as a known limitation, not as a plugin success claim.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Command edits state directly | `/goal` command reads or writes `.goal-state` | Block release; command must route through plugin tools only. |
| Cross-session state leak | Goal set in one session appears in another | Inspect `sessionKeyForSession` and state path logic. |
| Prompt injection leaks into context | Injection preview contains unredacted role or instruction text | Inspect `sanitizeInlineText` and `renderGoalInjection`. |
| Active continuation fires by default | `MK_GOAL_AUTONOMY` unset still submits a prompt | Block release; default-off gate regressed. |
| Live tool path unavailable | OpenCode cannot invoke `mk_goal`/`mk_goal_status` in the run | Mark live portion `SKIP` with the blocker; keep direct plugin test evidence. |

---

## 4. SOURCE FILES

- Feature [`07--hooks-and-plugin/goal-opencode-plugin.md`](../../feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md)
- Source: `.opencode/plugins/mk-goal.js`
- Source: `.opencode/commands/goal.md`
- Tests: `.opencode/plugins/__tests__/mk-goal-*.test.cjs`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-007
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/goal-opencode-plugin.md
