# Iteration 8: G8 Autonomy Tier And Loop Brakes

## Focus

[G8] Which autonomy tier should `.opencode/plugins/mk-goal.js` ship: passive injection only, active continuation via `session.idle -> session.prompt`, or active continuation plus supervisor; and what loop caps plus kill-switch should bound it?

## Actions Taken

- Read the deep-research skill contract and state/output references to keep this as a leaf iteration that writes only `iteration-008.md` and `iter-008.jsonl`.
- Read the current research state and prior G4-G7 narratives to avoid re-deciding injection, lifecycle, command routing, and state store.
- Read `.opencode/plugins/mk-spec-memory.js`, `.opencode/plugins/mk-code-graph.js`, and `.opencode/plugins/mk-skill-advisor.js` for the local event/system-transform plugin pattern.
- Read the project-scoped OpenCode plugin and SDK type definitions under `.opencode/node_modules/@opencode-ai/*` to verify whether a plugin can submit a continuation prompt.

## Findings (evidence + OUR target + decision + risk)

### Finding 1: Tier 2 active continuation is buildable because the plugin receives a client and the SDK exposes `promptAsync`.

Evidence: `PluginInput` includes `client: ReturnType<typeof createOpencodeClient>` [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:10] [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`:11]. The SDK `Session` client exposes `prompt` to create and send a message [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.d.ts`:172] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.d.ts`:174] and `promptAsync` to create/send a message, start if needed, and return immediately [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.d.ts`:180] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.d.ts`:182]. The generated client posts `promptAsync` to `/session/{id}/prompt_async` [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.js`:380] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.js`:384].

OUR target: `.opencode/plugins/mk-goal.js`, specifically `maybeContinueGoal(sessionID)`.

Decision: Choose Tier 2 for v1: active continuation from `session.idle` by calling `ctx.client.session.promptAsync({ path: { id: sessionID }, query: { directory: projectDir }, body: { parts: [...] } })`. Passive injection remains the fallback mode when autonomy is disabled. Use `promptAsync`, not blocking `prompt`, so the event hook does not wait for the full assistant turn.

Risk: This proves the SDK surface exists, not that recursive prompt submission from inside a plugin event hook is harmless. The first build must include a smoke mode that logs the would-send continuation prompt, then a single-turn real `promptAsync` test before enabling multi-turn active continuation.

### Finding 2: `session.idle` is the only event that should drive continuation, with status and prompt-blocker gates before sending.

Evidence: the SDK event type has `EventSessionIdle` with `type: "session.idle"` and `properties.sessionID` [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:413] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:417]. Session status is explicitly one of `idle`, `retry`, or `busy`, surfaced through `session.status` with `sessionID` [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:396] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:410]. Permission events carry session and message identifiers [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:369] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:375], and permission replies carry `sessionID`, `permissionID`, and `response` [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:388] [SOURCE: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts`:394]. Prior G5 already ruled that `message.updated` tracks progress rather than drives continuation [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-005.md`:21].

OUR target: `.opencode/plugins/mk-goal.js` event handler and per-session volatile runtime state.

Decision: Only `session.idle` calls `maybeContinueGoal(sessionID)`. That function must check, in order: plugin enabled, autonomy enabled, real session ID, durable goal status is `active`, `continuationSuppressed` is false, no in-flight continuation lock, no permission/question blocker, last observed session status is not `busy` or `retry`, cooldown elapsed, caps not exceeded, and budgets not exceeded. `message.updated` only refreshes `lastMessageId`, `lastActivityAt`, and usage if available.

Risk: The SDK types prove permission events, but not question events in the excerpt read this iteration. If question events are not available to the plugin, approval/question waits must be guarded through observed session status plus `permission.*` events, and G9/G10 should not assume complete prompt-blocker coverage.

### Finding 3: Do not ship the supervisor as part of the idle loop; make it a completion-candidate verifier in G9.

Evidence: G4 separated prompt-time injection from lifecycle/autonomy: `experimental.chat.system.transform` should only inject the active goal, while event handling owns continuation [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-004.md`:42]. G7 gave the goal record an OpenCode-specific `continuationSuppressed` guard field [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-007.md`:21] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-007.md`:23]. The live state still lists G9 as the unresolved completion-detection question [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/deep-research-state.jsonl`:8].

OUR target: `.opencode/plugins/mk-goal.js` autonomy architecture and future G9 verifier hook.

Decision: Tier 3 is not the G8 choice. The idle loop should continue work, not verify completion. A supervisor/verifier belongs only after the main agent claims completion or calls `/goal complete`; it can decide whether to mark `complete`, keep `active`, or set `blocked`. That keeps the hot loop simple and leaves G9 to define completion evidence.

Risk: Without a supervisor in the loop, v1 may continue one or more extra turns after the work is substantively done if the assistant does not self-report completion clearly. The loop caps below are required, and G9 should add a completion-candidate verifier before any final "complete" transition becomes automatic.

### Finding 4: Loop caps should be per-goal, per-session, and stored durably enough to survive plugin reload.

Evidence: G7 chose a per-session JSON record under `.opencode/skills/.goal-state/<hex(sessionID)>.json` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-007.md`:31] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-007.md`:33]. The same decision included atomic writes and a mutation queue as required hardening [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-007.md`:72]. Local plugins already use an event hook plus per-session cache invalidation on `session.*` and `message.*` events [SOURCE: `.opencode/plugins/mk-spec-memory.js`:416] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:429].

OUR target: `.opencode/plugins/mk-goal.js` state schema and `maybeContinueGoal(sessionID)` caps.

Decision: Add these fields to the G7 record: `autoTurnsUsed`, `maxAutoTurns`, `startedAtMs`, `lastContinuationAtMs`, `lastContinuationMessageId`, `lastContinuationError`, and `continuationSuppressedReason`. Defaults: `maxAutoTurns = 8`, `maxWallMs = 30 * 60 * 1000`, `cooldownMs = 1500`, and one in-flight continuation per session. When a cap is hit, set `status: "blocked"` if work needs user input, or `status: "budget_limited"` / `status: "usage_limited"` when G10 budget rules say so; always set `continuationSuppressed = true` before returning.

Risk: `autoTurnsUsed` can become inaccurate if `promptAsync` succeeds but the process dies before the next state write. Increment before sending and persist `lastContinuationAtMs`; this is conservative because it may stop one turn early, which is safer than an unbounded loop.

### Finding 5: The kill-switch must exist at three levels: process, session, and current idle event.

Evidence: existing plugins use config/env disabled state before hook work [SOURCE: `.opencode/plugins/mk-spec-memory.js`:407] and report disabled/plugin health through status tools [SOURCE: `.opencode/plugins/mk-spec-memory.js`:438] [SOURCE: `.opencode/plugins/mk-spec-memory.js`:447]. The `/goal` command decision already includes `pause` and `clear` routes [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-006.md`:56] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-006.md`:62]. Tool context includes `sessionID`, `directory`, and `worktree`, so command tools can mutate the current session's goal without text-side session inference [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts`:3] [SOURCE: `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts`:15].

OUR target: `.opencode/plugins/mk-goal.js` options/env, `mk_goal` command tool, and `mk_goal_status`.

Decision: Implement three kill-switches. Process-wide: `MK_GOAL_AUTONOMY=passive` or `MK_GOAL_DISABLE_AUTONOMY=1` disables active continuation while leaving injection/status intact. Session-level: `/goal pause [reason]` sets `status: "paused"` plus `continuationSuppressed = true`; `/goal clear` deletes or archives the record so injection stops. Event-level: `session.error`, missing session ID, permission pending, busy/retry status, cap hit, or promptAsync failure suppresses that idle continuation and records `lastContinuationError` for `mk_goal_status`.

Risk: A process-wide env kill-switch only applies after OpenCode is started with that environment. The reliable user-facing emergency stop is `/goal pause`; `mk_goal_status` should print both the process autonomy mode and the session suppression reason so the operator can see which brake fired.

## Questions Answered

- [G8] Answered: choose Tier 2 active continuation for v1, implemented as `session.idle -> maybeContinueGoal(sessionID) -> ctx.client.session.promptAsync(...)`.
- [G8] Passive injection remains the fallback mode when autonomy is disabled or suppressed.
- [G8] Do not put the supervisor in the idle loop. Supervisor verification belongs to G9 completion detection.
- [G8] Loop caps: default `maxAutoTurns = 8`, `maxWallMs = 30 minutes`, `cooldownMs = 1500`, one in-flight continuation per session, plus budget gates from G10.
- [G8] Kill-switches: process env/config, `/goal pause` or `/goal clear`, and event-level suppression on prompt blockers, busy/retry/error, cap hit, missing session id, or promptAsync failure.

## Questions Remaining

- [G9] Completion detection: what exact verifier/supervisor or shell-gate rule turns a completion candidate into `complete`?
- [G10] Budget governance: how to populate and enforce `tokensUsed`, `timeUsedSeconds`, `budget_limited`, and `usage_limited`.
- [G12] Final status set, especially when cap-hit should be `blocked` versus a budget/usage status.
- [G13] Prompt-injection sanitizer/fencing for the user-authored objective before every-turn injection and before autonomous continuation text.

## Next Focus

[G9] Completion detection: model self-report versus verifiable shell gate versus supervisor model, and how that interacts with the Tier 2 idle continuation loop.
