# Focus

G11: surface the active OpenCode goal without Claude's status-line overlay, using per-turn injection plus `mk_goal_status` and a concise `/goal show` command surface.

# Actions Taken

- Read the deep-research packet contract and output references to preserve the leaf iteration shape and avoid appending to the shared state log.
- Read the current strategy and state log. The dispatch asks for iteration 11, while local state artifacts currently stop at iteration 9; I used the requested iteration-011 paths and treated the numbering gap as a protocol risk.
- Re-read prior G4 and G6 outputs so this iteration does not duplicate the earlier decisions to use `experimental.chat.system.transform`, add `mk_goal_status`, and route `/goal` through plugin tools.
- Mined OpenCode plugin type definitions and existing plugins for the exact system-transform and tool surfaces.
- Mined the vendored OpenHuman `ThreadGoalChip` and `threadGoalApi` for compact user-facing goal status patterns.
- Re-checked Codex `thread_goals` schema to align the status and budget vocabulary used by the injected block and status tool.

# Findings

## 1. The OpenCode substitute for Claude's status line should be three surfaces, not one.

Evidence: prior Claude evidence says Claude exposes `Goal`, `Last check`, `Goal active`, `Goal achieved`, and no-goal labels, and prior G2 already concluded OpenCode needs a status substitute rather than literal overlay parity. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-002.md`:44] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-002.md`:46] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-002.md`:48] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-002.md`:50] The strategy also declares literal Claude status-line replication a non-goal because OpenCode cannot render it. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/deep-research-strategy.md`:38]

OUR target: `.opencode/plugins/mk-goal.js` and `.opencode/commands/goal.md`.

Decision: Define v1 UX as a three-surface substitute:

1. `.opencode/plugins/mk-goal.js` injects a compact `[active_goal:<goalId>]` block into `output.system` on every model turn while status is `active`.
2. `.opencode/plugins/mk-goal.js` exposes `mk_goal_status` for model/operator diagnostics.
3. `.opencode/commands/goal.md` exposes `/goal show` as the human-facing summary, using the same state fields but hiding plugin internals unless the plugin reports failure.

Risk: without a persistent overlay, the user may not notice an active goal between turns. The command must print the current state immediately after `set`, `pause`, `complete`, and `clear`, and the injected block must stay short enough not to become background noise.

## 2. The injected block should be the model-facing "status line": concise, stable, and action-oriented.

Evidence: OpenCode's system-transform hook receives optional `sessionID` and a model, and mutates `output.system: string[]`. [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:197] [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:201] `mk-spec-memory` normalizes `output.system`, resolves a session id, fetches a brief, clamps it, dedupes, and pushes one string. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:404] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:406] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:408] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:411] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:412] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:413] `mk-code-graph` follows the same pattern by rendering one block and appending it to `output.system`. [SOURCE: `.opencode/plugins/mk-code-graph.js`:442] [SOURCE: `.opencode/plugins/mk-code-graph.js`:462] [SOURCE: `.opencode/plugins/mk-code-graph.js`:467]

OUR target: `.opencode/plugins/mk-goal.js`, function `appendGoalBrief(input, output)`.

Decision: Render the injected block as a compact contract, not a debug dashboard:

```text
[active_goal:<goalId>]
status: active
objective: <sanitized objective>
last_check: <not_evaluated|met|not_met|blocked> ; reason: <short reason or none>
usage: tokens <tokensUsed>/<tokenBudget|none>; time <timeUsedSeconds>s; iteration <continuationCount>/<maxContinuations>
directive: Continue toward this objective. Before ending, run the goal verifier or explain why the goal is blocked.
[/active_goal]
```

Skip injection for absent, `paused`, `complete`, `budget_limited`, and `usage_limited` goals; for `blocked`, inject only when the next assistant turn needs to explain the block, not to continue. Dedupe by `[active_goal:<goalId>]`, not by full text, so a turn cannot receive duplicate active-goal blocks.

Risk: the objective is user-authored text injected into every turn. G13 must define the sanitizer/fencing rule before implementation, and the block needs a hard character cap so long objectives do not dominate prompt budget.

## 3. `mk_goal_status` should be a diagnostic tool, not the human `/goal show` display.

Evidence: OpenCode plugins expose a `tool` map. [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:108] [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:113] Plugin tools receive `ToolContext.sessionID`, `directory`, and `worktree`, which lets the tool report session-scoped state without the markdown command guessing identity. [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts`:2] [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts`:10] Existing status tools return plugin internals such as enabled state, runtime readiness, cache metrics, last error, warm bridge state, and retryability. [SOURCE: `.opencode/plugins/mk-spec-memory.js`:438] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:447] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:453] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:459] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:467] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:470]

OUR target: `.opencode/plugins/mk-goal.js`, tool `mk_goal_status`.

Decision: `mk_goal_status` returns a parseable diagnostic block:

```text
plugin_id=mk-goal
enabled=true
session_id=<current|missing>
goal_present=true
goal_id=<goalId>
goal_status=<active|paused|blocked|usage_limited|budget_limited|complete|none>
objective_preview=<truncated sanitized objective>
last_check=<not_evaluated|met|not_met|blocked>
last_reason=<short reason|none>
continuation_count=<n>
continuation_suppressed=<true|false>
tokens_used=<n>
token_budget=<n|none>
time_used_seconds=<n>
last_injection=<injected|skipped:reason>
store_status=<ok|missing|malformed|io_error>
last_error=<code|none>
updated_at_ms=<n>
```

This is the substitute for the missing overlay's diagnostic depth. It is deliberately richer than `/goal show` and should be allowed for model-visible self-inspection when the assistant needs to know whether a goal is active, why continuation stopped, or whether the store is unhealthy.

Risk: status output can leak absolute paths or implementation details. Report the store through logical labels by default and expose filesystem paths only behind a future debug option.

## 4. `/goal show` should be user-facing, smaller, and backed by the same plugin view model.

Evidence: the thin-router command pattern keeps routing in the markdown file and makes outputs parseable. [SOURCE: `.opencode/commands/memory/learn.md`:7] [SOURCE: `.opencode/commands/memory/learn.md`:9] [SOURCE: `.opencode/commands/memory/learn.md`:32] [SOURCE: `.opencode/commands/memory/learn.md`:39] G6 already chose a root `/goal` command delegating state mutation to plugin tools, with `mk_goal` and `mk_goal_status` as the plugin surfaces. [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-006.md`:68] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-006.md`:78] [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/iterations/iteration-006.md`:83]

OUR target: `.opencode/commands/goal.md`, route `show` and post-mutation summaries.

Decision: `/goal show` should call plugin state through `mk_goal action=show` or `mk_goal_status compact=true` and render:

```text
Goal active: <objective>
Last check: <not evaluated|not met|blocked|met> - <short reason or none>
Usage: <tokensUsed>/<tokenBudget|no token budget>, <timeUsedSeconds>s, iteration <continuationCount>/<maxContinuations>
Controls: /goal pause | /goal complete | /goal clear
STATUS=OK ACTION=show GOAL_STATUS=active SESSION=current
```

When no goal exists, show `No goal set. Usage: /goal <condition>` plus `STATUS=OK ACTION=show GOAL_STATUS=none SESSION=current`. This keeps command output readable while preserving a parseable footer for logs or scripts.

Risk: duplicating formatting in the command and plugin can drift. The plugin tool should return a small normalized view model or pre-rendered compact summary, and `goal.md` should only route and display it.

## 5. Reuse the OpenHuman chip's field hierarchy, but not its UI mechanics.

Evidence: OpenHuman's thread goal UI is a compact footer affordance plus an editor panel, both sharing one controller. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:10] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:16] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:19] It fetches on thread change and light-polls so agent-driven changes surface without manual refresh. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:22] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:27] The visible trigger prioritizes status plus objective. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:202] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:213] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:216] The expanded panel adds budget and lifecycle controls. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:230] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:241] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:255] Thread goal data includes objective, status, token budget, tokens used, time used, timestamps, and continuation suppression. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts`:19] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts`:23] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts`:28] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts`:33]

OUR target: `.opencode/plugins/mk-goal.js` status/injection fields and `.opencode/commands/goal.md` show text.

Decision: Adopt the same information hierarchy:

- Always-visible equivalent: status + objective.
- Expanded equivalent: budget, last verifier result, continuation suppression, controls.
- Hidden diagnostics: store health, plugin enabled state, last injection result, cache/error details.

In OpenCode, "always visible" means every-turn injection and post-command summaries, "expanded" means `/goal show`, and "hidden diagnostics" means `mk_goal_status`.

Risk: OpenHuman uses a real UI with polling; OpenCode's CLI/plugin surface has no passive visual refresh. If state changes in the background, the next visible update is either the next model turn, `/goal show`, or a status tool call.

# Questions Answered

- G11 answered: use a three-surface UX. Per-turn injection is the model-facing status line, `/goal show` is the user-facing compact state view, and `mk_goal_status` is the diagnostic substitute for overlay internals.
- `mk_goal_status` fields are now concrete: session identity, goal status, objective preview, verifier state, continuation/budget counters, last injection result, store health, and last error.
- `/goal show` differs from `mk_goal_status`: it omits plugin internals and renders status, objective, last check, usage, and controls with a parseable footer.

# Questions Remaining

- G12: finalize the exact status set and keying rules in the synthesis, especially how `blocked`, `usage_limited`, and `budget_limited` should affect injection and continuation.
- G13: define the sanitizer/fencing rule for user-authored objective text before the injected block is safe to implement.
- Protocol risk: the dispatch asks for iteration 11, but local shared state and artifact lists only show iterations 1-9 before this write.
- Build-time smoke risk: G6 already flagged that plugin tool names in command `allowed-tools` need verification in a real OpenCode run.

# Next Focus

G14 synthesis: assemble the end-to-end design for `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md`, and the state store, carrying G12/G13 as explicit final-design decisions or risks.
