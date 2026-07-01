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
- `/goal` command exists at `.opencode/commands/goal_opencode.md`.
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
- Source: `.opencode/commands/goal_opencode.md`
- Tests: `.opencode/plugins/__tests__/mk-goal-*.test.cjs`

---

## 5. ADVERSARIAL REGRESSION

> Regression guards for fixed deep-review findings in the goal plugin. Each guard PASSES only while
> its bug stays fixed and is phrased to FAIL the moment the regression returns.

### 5.1 Terminal-goal revival must drop stale usage

- Bug under guard: re-setting the same objective after a terminal (completed or cleared) goal
  carried stale usage counters (tokens, elapsed time, last-accounted message) into the revived goal.
- Must-stay-true invariant: re-arming an objective after a terminal goal must reset usage to zero
  and clear the last-accounted message and continuation-suppressed flags.
- Pass/fail: PASS only if `node .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` exits 0 AND
  the revived-goal assertions remain (`tokensUsed === 0`, `timeUsedSeconds === 0`,
  `lastAccountedMessageID === null`); FAIL if the test is missing, weakened, or exits non-zero.

```bash
PATH=/opt/homebrew/bin:$PATH node .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs
```

### 5.2 Injection clamp must preserve directive and fence markers

- Bug under guard: the passive-injection length clamp could truncate away the directive header or
  the `[active_goal]` fence, leaking a malformed or unbounded injection block into context.
- Must-stay-true invariant: clamping a long objective must still emit the opening
  `[active_goal:<id>]` marker, the `directive:` line, and the closing `[/active_goal]` fence —
  only the objective text is truncated (ends with `...`).
- Pass/fail: PASS only if `node .opencode/plugins/__tests__/mk-goal-state.test.cjs` exits 0 AND the
  clamped-injection assertions remain (block starts with `[active_goal:<id>]`, contains the
  `directive:` line, ends with `[/active_goal]`); FAIL if the test is missing, weakened, or exits
  non-zero.

```bash
PATH=/opt/homebrew/bin:$PATH node .opencode/plugins/__tests__/mk-goal-state.test.cjs
```

### Regression Anchors

| File | Role |
|---|---|
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | Fails if a revived same-objective goal carries stale usage. |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Fails if the injection clamp drops the directive or fence markers. |

---

## 6. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-007
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/goal-opencode-plugin.md
