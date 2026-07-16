# Iteration 10: G10 Budget Governance

## Focus

G10: How to govern budget for `token_budget`, `tokens_used`, `time_used_seconds`, `usage_limited`, and `budget_limited` in the OpenCode `/goal` plugin state and lifecycle.

## Actions Taken

- Re-read the deep-research packet contract for per-iteration outputs and budget status handling.
- Verified Codex's `thread_goals` schema with `sqlite3 ~/.codex/goals_1.sqlite '.schema thread_goals'`.
- Read the vendored OpenHuman thread-goal type, store, runtime, continuation, API, and chip UI references.
- Read the existing OpenCode plugin hook pattern and plugin type definitions for event/tool/system-transform support.
- Read the thin command-router pattern in `.opencode/commands/memory/learn.md`.

## Findings

1. Codex's canonical model has the exact fields this plugin should preserve: `token_budget`, `tokens_used DEFAULT 0`, `time_used_seconds DEFAULT 0`, and statuses `active`, `paused`, `blocked`, `usage_limited`, `budget_limited`, `complete`. Evidence: `sqlite3 ~/.codex/goals_1.sqlite '.schema thread_goals'` output. OpenHuman's adapted type keeps `token_budget`, `tokens_used`, and `time_used_seconds` as durable fields and computes remaining budget from `token_budget - tokens_used` [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:73`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:95`].

   OUR target: `.opencode/skills/.goal-state/thread-goals/<hex(sessionID)>.json`.

   Decision: store the full Codex status set in OpenCode state even if v1 UI only acts on a subset. `budget_limited` means our configured goal budget was reached. `usage_limited` means the provider/session/runtime refused further work because of an external usage cap.

   Risk: OpenHuman's frontend/API only exposes `active | paused | budget_limited | complete` [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts:19`], so directly copying its UI state would erase Codex's `blocked` and `usage_limited` distinctions.

2. Budget accounting should be a guarded post-turn mutation, not a free-running counter. OpenHuman's store serializes load-mutate-save, guards stale writes by `expected_goal_id`, saturating-adds token/time deltas, and flips an active goal to `BudgetLimited` once `over_budget()` is true [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:9`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:403`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:433`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:437`].

   OUR target: `.opencode/plugins/mk-goal.js`, helper `accountUsage(sessionID, expectedGoalID, tokenDelta, secondsDelta, sourceEvent)`.

   Decision: update `tokensUsed` and `timeUsedSeconds` only for `active` goals, only after a completed message/turn event, and only if the persisted `goalId` still matches the goal observed at turn start. This prevents a late event from charging a replaced objective.

   Risk: if OpenCode emits multiple `message.updated` events for one assistant turn, naive accounting will double-count. The plugin needs `lastAccountedMessageID` or an `accountedMessageIDs` map per goal.

3. The runtime should stop autonomous continuation before creating another expensive turn once the configured budget is exhausted. OpenHuman's runtime only charges active goals and emits a status update when accounting changes the lifecycle [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:143`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:192`]. Its budget stop hook projects already-accounted plus current-turn tokens and stops when the projection meets budget [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:207`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:257`].

   OUR target: `.opencode/plugins/mk-goal.js`, lifecycle gate inside `maybeContinueGoal(sessionID)`.

   Decision: before `session.idle -> session.prompt` continuation, call `loadGoal(sessionID)` and refuse continuation unless `status === "active"` and `tokensUsed < tokenBudget` when a budget exists. If a post-turn event crosses the configured budget, persist `status: "budget_limited"`, suppress further autonomous continuation, and inject a short budget-limited status block on the next user-visible turn.

   Risk: OpenCode plugins may not expose mid-turn usage the way OpenHuman's `StopHook` does. V1 should not promise mid-turn hard stops until an OpenCode event/API exposes live token totals.

4. Setting the same objective should not reset counters, but raising the budget above current usage should reopen a budget-limited goal. OpenHuman preserves counters and `goal_id` for the same objective while refreshing the budget [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:146`], keeps the goal budget-limited while still over budget [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:190`], and its tests assert that raising budget above usage returns the goal to active [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:491`, `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:511`].

   OUR target: `.opencode/commands/goal.md`, route `/goal <objective> --budget <tokens>` and `/goal budget <tokens>` to the plugin's `setGoal`/`updateBudget` tool path.

   Decision: changed objective mints a new `goalId` and resets counters; same objective preserves counters and only changes budget. A budget update reactivates only when the new `tokenBudget` is absent or greater than `tokensUsed`.

   Risk: the command-router pattern is thin and argument-driven [SOURCE: `.opencode/commands/memory/learn.md:37`], so budget parsing must be explicit enough that the model does not treat a numeric objective phrase as a budget.

5. User-visible budget surfacing should be model-visible plus command-visible, not UI overlay dependent. OpenHuman injects budget into `[active_goal]` context [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs:106`] and displays `tokensUsed / tokenBudget` in the chip [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx:231`]. OpenCode plugins can register tools and transform system context [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:108`, `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:197`], and `mk-spec-memory` appends context through `output.system.push(...)` [SOURCE: `.opencode/plugins/mk-spec-memory.js:404`, `.opencode/plugins/mk-spec-memory.js:436`].

   OUR target: `.opencode/plugins/mk-goal.js` exposes `mk_goal_status`; `.opencode/commands/goal.md` routes `show` to it.

   Decision: `mk_goal_status` should return `status`, `objective`, `tokensUsed`, `tokenBudget`, `tokensRemaining`, `timeUsedSeconds`, `usageSource`, `lastAccountedMessageID`, `continuationSuppressed`, and `reason` when limited. The injected block should include budget only when set and should steer `budget_limited` goals to summarize progress rather than continue work.

   Risk: exact `message.updated` usage payload shape is unverified in installed type definitions. The plugin type proves generic `event` support [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:108`], but not token fields; the implementation must use tolerant extraction and surface `usageSource=unavailable` when it cannot account safely.

## Questions Answered

- G10 answered: budget state should live in the per-session goal JSON with Codex-parity fields, guarded post-turn accounting, continuation preflight caps, and distinct `budget_limited` vs `usage_limited` meanings.
- The lifecycle decision is: account only active goals, transition to `budget_limited` on configured cap exhaustion, reserve `usage_limited` for external usage-limit failures, and never auto-continue a limited goal.
- The state mutation decision is: changed objective resets counters; same objective preserves counters; budget raises can reactivate only when no longer over budget.

## Questions Remaining

- G11: exact `mk_goal_status` and `/goal show` presentation text, especially how terse the injected budget block should be.
- G12: final status set and command behavior for `blocked` versus `paused` versus `usage_limited`.
- G13: prompt-injection sanitizer/fencing for the user-authored objective and verifier evidence.
- Implementation smoke: verify real OpenCode `message.updated` payloads include token totals or identify the persisted message/session field that does.

## Next Focus

G11: surface the active goal through inject-every-turn plus `mk_goal_status`/`/goal show` as the practical OpenCode replacement for Claude's status-line overlay.
