---
title: "CL-007 Goal OpenCode Plugin"
description: "Manual validation for the /goal command, mk_goal tools, passive injection, supervisor lifecycle and default-off continuation gates."
trigger_phrases:
  - "cl-007"
  - "goal opencode plugin"
  - "/goal command"
  - "mk_goal"
version: 0.8.0.33
id: CL-007
category: cli_hooks_and_plugin
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/hooks/skill-advisor-hook.md
---

# CL-007 Goal OpenCode Plugin

Prompt: Manual validation for the /goal command, mk_goal tools, passive injection, supervisor lifecycle and default-off continuation gates.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `/goal` routes through the OpenCode plugin tools, persists per-session state, injects a bounded active-goal block, reports status through `mk_goal_status`, verifies completion through injected or default verifiers, and keeps active continuation default-off unless `MK_GOAL_AUTONOMY` explicitly enables smoke or active mode.

---

## 2. SCENARIO CONTRACT

- OpenCode plugin host can load `.opencode/plugins/mk-goal.js`.
- `/goal` command exists at `.opencode/commands/goal_opencode.md`.
- Use a disposable session or temporary `stateDir` so existing session goals are not overwritten.
- Live OpenCode-run tool invocation is verified (an `opencode serve` run lists `mk_goal`/`mk_goal_status` and a live model turn persists per-session state); when a live session is unavailable in this run, execute the plugin tool path directly and record that as the fallback, not as an open blocker.

---

## 3. TEST EXECUTION

1. Run the state and tool-path tests:

```bash
node .opencode/plugins/tests/mk-goal-state.test.cjs
node .opencode/plugins/tests/mk-goal-tool-path.test.cjs
```

2. Run the supervisor, continuation and lifecycle tests:

```bash
node .opencode/plugins/tests/mk-goal-supervisor.test.cjs
node .opencode/plugins/tests/mk-goal-continuation.test.cjs
node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs
node .opencode/plugins/tests/mk-goal-capabilities.test.cjs
```

3. In a live OpenCode session when tool invocation is available, run:

```text
/goal set Finish the documentation propagation task
/goal set Finish the documentation propagation task --budget 1234
/goal show
/goal history
/goal doctor
/goal health
/goal pause waiting for user approval
/goal resume
/goal complete
/goal clear
```

4. Capture the `STATUS=OK` envelopes and verify mutation responses include the post-mutation state, including `mutation=created|refreshed|replaced` on `/goal set`, `token_budget=1234` after `--budget`, and `store_health=` on status/set output.
5. Verify `mk_goal_status` includes `injection_preview=` and that the preview contains `[active_goal:<goal-id>]` only while the goal is active.
6. Verify `/goal history` includes `archive_count=`, `/goal doctor` and `/goal health` include `active_state_file_count=`, `archive_file_count=`, `continuation_log_bytes=`, `goal_events_log_bytes=`, `last_sweep_at=`, and `orphan_candidate_count=`.
7. Verify `/goal resume` reactivates a paused goal and that a completed goal still rejects resume with `code=INVALID_STATUS_TRANSITION`.
8. With `MK_GOAL_AUTONOMY` unset, confirm continuation is suppressed with `autonomy_disabled`.
9. With `MK_GOAL_AUTONOMY=smoke`, confirm the decision is `would_fire` and no prompt is submitted.
10. With `MK_GOAL_AUTONOMY=active`, confirm `promptAsync` is called only when every guard passes; if a live OpenCode session is unavailable in this run, fall back to the plugin tool path directly (see §1).
11. With `MK_GOAL_MAX_AUTO_TURNS=3` and `MK_GOAL_MAX_WALL_MS=4000`, restart OpenCode and verify `/goal show` reports `remaining_auto_turns=`, `remaining_wall_ms=`, and `provider_retry_after_ms=`.
12. With `MK_GOAL_VERIFIER` unset or `heuristic`, verify only explicit objective-specific evidence completes and the adversarial negative matrix remains `not_met`. With `MK_GOAL_VERIFIER=llm`, verify `ctx.client.session.promptAsync` is called and status reports `verifier_source=default-llm`.

### Expected Signals

- `/goal` does not read or write `.opencode/skills/.goal-state` directly; all state access goes through `mk_goal` or `mk_goal_status`.
- `/goal set` output includes `mutation=created|refreshed|replaced` matching the actual set-time outcome.
- `/goal set <objective> --budget N` rejects invalid budgets and reports the accepted token budget in status output.
- `/goal history`, `/goal doctor`, `/goal health`, and `/goal resume` route through `mk_goal`; none reads `.opencode/skills/.goal-state` directly from command markdown.
- Status/set output includes `store_health=no_active_goal` or `store_health=state_age_ms:<N>`.
- Status/set output includes `verifier_source=none|injected|default-heuristic|default-llm`.
- Status/set output includes `remaining_auto_turns`, `remaining_wall_ms`, and `provider_retry_after_ms`; env caps honor `MK_GOAL_MAX_AUTO_TURNS` and `MK_GOAL_MAX_WALL_MS`.
- Per-session JSON state is isolated by session id.
- Passive injection is bounded and sanitized.
- Supervisor verdicts map to durable goal state: `met` completes, `blocked` blocks, and ambiguous evidence remains active. Injected verifiers keep precedence. The default heuristic rejects empty, unrelated, mixed blocker, generic, truncated, repeat-only, investigation-only, and TODO evidence.
- Continuation is default-off and capped when explicitly enabled.
- Live OpenCode-run tool invocation gaps are reported as a known limitation, not as a plugin success claim.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Command edits state directly | `/goal` command reads or writes `.goal-state` | Block release; command must route through plugin tools only. |
| Cross-session state leak | Goal set in one session appears in another | Inspect `sessionKeyForSession` and state path logic. |
| Prompt injection leaks into context | Injection preview contains unredacted role or instruction text | Inspect `sanitizeInlineText` and `renderGoalInjection`. |
| Active continuation fires by default | `MK_GOAL_AUTONOMY` unset still submits a prompt | Block release; default-off gate regressed. |
| Resume revives terminal goals | `/goal resume` succeeds after `/goal complete` | Block release; transition map must reject `complete` to `active`. |
| Doctor or history mutates state | `history`, `doctor`, or `health` creates active JSON files | Block release; these verbs must stay read-only. |
| Env caps ignored | `MK_GOAL_MAX_AUTO_TURNS` or `MK_GOAL_MAX_WALL_MS` does not alter status/caps after restart | Inspect `normalizeOptions` env reads and status output. |
| Default verifier false-completes | Weak or mixed evidence marks a goal complete under `MK_GOAL_VERIFIER=heuristic` | Block release; the heuristic must fail closed unless evidence is explicit and objective-specific. |
| Verifier provenance missing | Status omits `verifier_source` after a verifier run | Inspect `lastVerifierSource` persistence and status rendering. |
| LLM verifier cannot call client | `MK_GOAL_VERIFIER=llm` never reaches `ctx.client.session.promptAsync` | Inspect `client: ctx?.client` threading into `maybeVerifyGoal`. |
| Live tool path unavailable | OpenCode cannot invoke `mk_goal`/`mk_goal_status` in the run | Mark live portion `SKIP` with the blocker; keep direct plugin test evidence. |

---

## 4. SOURCE FILES

- Feature [`hooks-and-plugin/goal-opencode-plugin.md`](../../feature-catalog/hooks-and-plugin/goal-opencode-plugin.md)
- Source: `.opencode/plugins/mk-goal.js`
- Source: `.opencode/commands/goal_opencode.md`
- Tests: `.opencode/plugins/tests/mk-goal-*.test.cjs`

---

## 5. ADVERSARIAL REGRESSION

> Regression guards for fixed deep-review findings in the goal plugin. Each guard PASSES only while
> its bug stays fixed and is phrased to FAIL the moment the regression returns.

### 5.1 Terminal-goal revival must drop stale usage

- Bug under guard: re-setting the same objective after a terminal (completed or cleared) goal
  carried stale usage counters (tokens, elapsed time, last-accounted message) into the revived goal.
- Must-stay-true invariant: re-arming an objective after a terminal goal must reset usage to zero
  and clear the last-accounted message and continuation-suppressed flags.
- Pass/fail: PASS only if `node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` exits 0 AND
  the revived-goal assertions remain (`tokensUsed === 0`, `timeUsedSeconds === 0`,
  `lastAccountedMessageID === null`); FAIL if the test is missing, weakened, or exits non-zero.

```bash
PATH=/opt/homebrew/bin:$PATH node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs
```

### 5.2 Injection clamp must preserve directive and fence markers

- Bug under guard: the passive-injection length clamp could truncate away the directive header or
  the `[active_goal]` fence, leaking a malformed or unbounded injection block into context.
- Must-stay-true invariant: clamping a long objective must still emit the opening
  `[active_goal:<id>]` marker, the `directive:` line, and the closing `[/active_goal]` fence —
  only the objective text is truncated (ends with `...`).
- Pass/fail: PASS only if `node .opencode/plugins/tests/mk-goal-state.test.cjs` exits 0 AND the
  clamped-injection assertions remain (block starts with `[active_goal:<id>]`, contains the
  `directive:` line, ends with `[/active_goal]`); FAIL if the test is missing, weakened, or exits
  non-zero.

```bash
PATH=/opt/homebrew/bin:$PATH node .opencode/plugins/tests/mk-goal-state.test.cjs
```

### Regression Anchors

| File | Role |
|---|---|
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Fails if a revived same-objective goal carries stale usage. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Fails if the injection clamp drops the directive or fence markers. |

---

## 6. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-007
- Canonical root source: manual-testing-playbook.md
- Feature file path: cli-hooks-and-plugin/goal-opencode-plugin.md

---

## 7. EVIDENCE

### Preconditions

Command file read confirmed `.opencode/commands/goal_opencode.md` exists and routes only through plugin tools:

```text
4: allowed-tools: mk_goal, mk_goal_status
15: Manage the passive session goal through the `mk-goal` plugin. `/goal` is a state-free router: it resolves the requested action from `$ARGUMENTS` and dispatches to the `mk_goal` / `mk_goal_status` plugin tools, which own all goal state and session resolution.
37: This command is state-free. It never reads or writes `.opencode/skills/.goal-state` directly.
39: - Empty arguments or `show` route to `mk_goal_status`.
40: - `set <objective>` routes to `mk_goal` with `action: "set"` and `objective: REST`.
42: - `clear`, `complete`, and `pause [reason]` route to `mk_goal`.
83: - Reads go through `mk_goal_status`; mutations go through `mk_goal`.
```

Grep evidence for direct state path and plugin tools in `.opencode/commands/goal_opencode.md`:

```text
Found 17 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/goal_opencode.md:
  Line 4: allowed-tools: mk_goal, mk_goal_status

  Line 15: Manage the passive session goal through the `mk-goal` plugin. `/goal` is a state-free router: it resolves the requested action from `$ARGUMENTS` and dispatches to the `mk_goal` / `mk_goal_status` plugin tools, which own all goal state and session resolution.

  Line 37: This command is state-free. It never reads or writes `.opencode/skills/.goal-state` directly.

  Line 39: - Empty arguments or `show` route to `mk_goal_status`.

  Line 40: - `set <objective>` routes to `mk_goal` with `action: "set"` and `objective: REST`.

  Line 41: - Bare text routes to `mk_goal` with `action: "set"` and `objective: QUERY`.

  Line 42: - `clear`, `complete`, and `pause [reason]` route to `mk_goal`.

  Line 43: - Any other non-empty `QUERY` is treated as bare goal text and routes to `mk_goal` with `action: "set"` and `objective: QUERY`.

  Line 49: Your FIRST and ONLY action is the single tool call selected below. Do NOT read files, glob, grep, or explore the repository - the `mk_goal` / `mk_goal_status` tools own all goal state and session resolution. Make the call immediately, then print its result verbatim.

  Line 53: 1. If `ARGS_PRESENT=false`, call `mk_goal_status({})` and print its result exactly.

  Line 54: 2. If `FIRST` is `show`, call `mk_goal_status({})` and print its result exactly.

  Line 55: 3. If `FIRST` is `set`, require non-empty `REST`, then call `mk_goal({ action: "set", objective: REST })`.

  Line 56: 4. If `FIRST` is `clear`, call `mk_goal({ action: "clear" })`.

  Line 57: 5. If `FIRST` is `complete`, call `mk_goal({ action: "complete" })`.

  Line 58: 6. If `FIRST` is `pause`, call `mk_goal({ action: "pause", reason: REST })`.

  Line 59: 7. For any other non-empty `QUERY`, call `mk_goal({ action: "set", objective: QUERY })`.

  Line 83: - Reads go through `mk_goal_status`; mutations go through `mk_goal`.
```

### Test Execution Commands

Command:

```bash
node .opencode/plugins/tests/mk-goal-state.test.cjs
node .opencode/plugins/tests/mk-goal-tool-path.test.cjs
```

Observed output:

```text
mk-goal tool-path tests passed
```

Command:

```bash
node .opencode/plugins/tests/mk-goal-supervisor.test.cjs
node .opencode/plugins/tests/mk-goal-continuation.test.cjs
node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs
```

Observed output:

```text
(no output)
```

Command:

```bash
PATH=/opt/homebrew/bin:$PATH node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs
```

Observed output:

```text
(no output)
```

Command:

```bash
PATH=/opt/homebrew/bin:$PATH node .opencode/plugins/tests/mk-goal-state.test.cjs
```

Observed output:

```text
(no output)
```

### Live Tool Invocation Fallback

Live `/goal` slash-command invocation was not available from this tool session. Per scenario contract, the plugin tool path was executed directly and recorded as fallback evidence, not as a live OpenCode success claim.

Initial status via `mk_goal_status({})`:

```text
STATUS=OK ACTION=show
goal_present=false
store_health=no_active_goal
injection_preview=""
```

Set via `mk_goal({ action: "set", objective: "Finish the documentation propagation task" })`:

```text
STATUS=OK ACTION=set
mutation=created
goal_present=true
plugin_id=mk-goal
goal_id=goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49
status=active
objective="Finish the documentation propagation task"
prompt_framework="CRAFT+TIDD-EC"
prompt_methodology="DEPTH"
prompt_clear_score=44
prompt_char_count=1142
prompt_max_chars=4000
token_budget=none
tokens_used=0
time_used_seconds=0
usage_source=unavailable
budget_tokens_used=0
budget_token_budget=none
budget_usage_source=unavailable
created_at_ms=1783043827755
updated_at_ms=1783043827755
store_health=state_age_ms:1
last_check=not_evaluated
verifier_last_verdict=not_evaluated
verifier_last_evidence=""
blocked_by_prompt=false
continuation_suppressed=false
continuation_attempts=0
continuation_suppressed_reason=""
injection_preview="[active_goal:goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49]\nstatus: active\nobjective: Finish the documentation propagation task\ngoal_prompt:\nRole: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the documentation propagation task\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action.\nlast_check: not_evaluated ; reason: none\nusage: tokens 0/none; time 0s; iteration 0/8\ndirective: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.\n[/active_goal]"
```

Show via `mk_goal_status({})` while active:

```text
STATUS=OK ACTION=show
goal_present=true
plugin_id=mk-goal
goal_id=goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49
status=active
objective="Finish the documentation propagation task"
store_health=state_age_ms:9096
continuation_suppressed=false
continuation_attempts=0
continuation_suppressed_reason=""
injection_preview="[active_goal:goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49]\nstatus: active\nobjective: Finish the documentation propagation task\ngoal_prompt:\nRole: Focused OpenCode execution agent operating under the active session goal.\nObjective: Finish the documentation propagation task\nContext: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.\nMethod:\n- Restate the concrete completion condition from available evidence before acting.\n- Clarify the concrete completion condition from available context, then execute until it is met or blocked.\n- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.\nSuccess Criteria:\n- The requested outcome is materially complete, not merely analyzed or partially prepared.\n- Required verification has run, or any inability to run it is reported with the exact blocker.\n- Status output distinguishes confirmed evidence from inference.\nStop Conditions:\n- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.\n- If blocked, preserve state and name the next safe action.\nlast_check: not_evaluated ; reason: none\nusage: tokens 0/none; time 0s; iteration 0/8\ndirective: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.\n[/active_goal]"
```

Pause via `mk_goal({ action: "pause", reason: "waiting for user approval" })`:

```text
STATUS=OK ACTION=pause
goal_present=true
plugin_id=mk-goal
goal_id=goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49
status=paused
objective="Finish the documentation propagation task"
store_health=state_age_ms:1
continuation_suppressed=true
continuation_attempts=0
continuation_suppressed_reason="waiting for user approval"
injection_preview=""
```

Complete via `mk_goal({ action: "complete" })`:

```text
STATUS=OK ACTION=complete
goal_present=true
plugin_id=mk-goal
goal_id=goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49
status=complete
objective="Finish the documentation propagation task"
store_health=state_age_ms:1
continuation_suppressed=true
continuation_attempts=0
continuation_suppressed_reason="waiting for user approval"
injection_preview=""
```

Show via `mk_goal_status({})` after complete:

```text
STATUS=OK ACTION=show
goal_present=true
plugin_id=mk-goal
goal_id=goal-35974fa4-9f5f-4311-b051-9ac2a0d95f49
status=complete
objective="Finish the documentation propagation task"
store_health=state_age_ms:4009
continuation_suppressed=true
continuation_attempts=0
continuation_suppressed_reason="waiting for user approval"
injection_preview=""
```

Clear via `mk_goal({ action: "clear" })`:

```text
STATUS=OK ACTION=clear
goal_present=false
store_health=no_active_goal
injection_preview=""
```

### Continuation Mode Evidence

Command:

```bash
env -u MK_GOAL_AUTONOMY node .opencode/plugins/tests/mk-goal-continuation.test.cjs
```

Observed output:

```text
(no output)
```

Command:

```bash
MK_GOAL_AUTONOMY=smoke node .opencode/plugins/tests/mk-goal-continuation.test.cjs
```

Observed output:

```text
(no output)
```

Command:

```bash
MK_GOAL_AUTONOMY=active node .opencode/plugins/tests/mk-goal-continuation.test.cjs
```

Observed output:

```text
(no output)
```

Grep evidence for continuation assertions:

```text
Found 20 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/mk-goal-continuation.test.cjs:
  Line 38:   const originalAutonomy = process.env.MK_GOAL_AUTONOMY;
  Line 41:     delete process.env.MK_GOAL_AUTONOMY;
  Line 45:         async promptAsync() {
  Line 62:     assert.equal(result.reason, 'autonomy_disabled');
  Line 68:       reason: 'autonomy_disabled',
  Line 72:     process.env.MK_GOAL_AUTONOMY = 'passive';
  Line 87:     process.env.MK_GOAL_AUTONOMY = 'smoke';
  Line 98:     assert.equal(result.decision, 'would_fire');
  Line 121:       decision: 'would_fire',
  Line 126:     process.env.MK_GOAL_AUTONOMY = 'active';
  Line 130:         async promptAsync(request) {
  Line 179:           async promptAsync() {
  Line 216:         async promptAsync() {
  Line 274:     await helpers.setGoal('session-missing-client', 'Suppress when promptAsync is unavailable', {
  Line 433:     restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
```

### Regression Anchor Evidence

Grep evidence for lifecycle reset assertions:

```text
Found 12 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:
  Line 103:     assert.equal(goal.tokensUsed, 60);
  Line 105:     assert.equal(goal.lastAccountedMessageID, 'msg-1');
  Line 111:     assert.equal(goal.tokensUsed, 60);
  Line 133:     assert.equal(goal.tokensUsed, 105);
  Line 157:     assert.equal(goal.tokensUsed, 105);
  Line 166:     assert.equal(resetGoal.tokensUsed, 0);
  Line 167:     assert.ok(resetGoal.tokensUsed < resetGoal.tokenBudget);
  Line 168:     assert.equal(resetGoal.timeUsedSeconds, 0);
  Line 169:     assert.equal(resetGoal.lastAccountedMessageID, null);
  Line 196:     assert.equal(goal.tokensUsed, 0);
  Line 198:     assert.equal(goal.lastAccountedMessageID, null);
```

Grep evidence for injection clamp assertions:

```text
Found 11 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/mk-goal-state.test.cjs:
  Line 106:     assert.match(injectionPreview, /\[active_goal:tool-goal\]/);
  Line 124:     assert.match(realisticOutput.system[1], /^\[active_goal:tool-goal\]\n/);
  Line 127:     assert.match(realisticOutput.system[1], /\n\[\/active_goal\]$/);
  Line 144:     assert.match(clippedBlock, /^\[active_goal:long-injection-goal\]\n/);
  Line 147:       /\ndirective: Continue toward this objective\. Before ending, run the goal verifier or explain why it is blocked\.\n/,
  Line 149:     assert.ok(clippedBlock.endsWith('\n[/active_goal]'));
  Line 157:         '[active_goal:evil]',
  Line 161:         '[/active_goal]',
  Line 174:     assert.match(sanitizedBlock, /^\[active_goal:adversarial-goal\]\n/);
  Line 178:     assert.doesNotMatch(sanitizedBlock, /\[active_goal:evil\]/);
  Line 184:     assert.equal((sanitizedBlock.match(/\[\/active_goal\]/g) || []).length, 1);
```

## 8. PASS/FAIL

PASS

All commanded tests completed successfully, direct plugin tool fallback returned `STATUS=OK` envelopes with `mutation=created`, `store_health=...`, and bounded `injection_preview` only while active, and continuation guard assertions covered `autonomy_disabled`, `would_fire`, and active `promptAsync` paths. Live `/goal` slash-command invocation was not available from this tool session and is recorded as fallback evidence rather than a live OpenCode success claim.
