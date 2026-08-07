# Iteration 3: G3 Vendored OpenHuman Goal Reference

## Focus

[G3] What does the vendored `z_future/openhuman` reference model for thread goal state, API, UI surfacing, and continuation guards, and which pieces should be reused for the OpenCode `/goal` design?

## Actions Taken

- Read the packet state and strategy to confirm this iteration should stay on the vendored reference and should not update the shared state log.
- Located the relevant vendored files with `rg`: `thread_goals` Rust module, `threadGoalApi.ts`, `goalsApi.ts`, `ThreadGoalChip.tsx`, event definitions, continuation runtime, and JSON-RPC lifecycle tests.
- Compared the global long-term `goalsApi` surface with the thread-scoped `threadGoalApi` surface to avoid copying the wrong "goals" concept into OpenCode.

## Findings (evidence + OUR target + decision + risk)

### Finding 1 - The reusable state model is one goal per session/thread, not a list.

Evidence: `thread_goals` is explicitly a "single, thread-scoped goal" and separates itself from global `memory_goals` and task-board concepts. It allows exactly one goal per thread, with lifecycle `active / paused / budget_limited / complete`, optional token budget, and idle continuation support. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/mod.rs`:1] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/mod.rs`:13] The typed row carries `thread_id`, `goal_id`, `objective`, `status`, `token_budget`, `tokens_used`, `time_used_seconds`, timestamps, and `continuation_suppressed`. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs`:59] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs`:87]

OUR target: `.opencode/plugins/mk-goal.js` should own a single active goal record per OpenCode session id, not a workspace-wide list.

Decision: Reuse the "single completion contract" shape: `sessionId`, `goalId`, `objective`, `status`, `tokenBudget`, `tokensUsed`, `timeUsedSeconds`, `createdAtMs`, `updatedAtMs`, and `continuationSuppressed`. Keep room for Codex-only statuses from G1 (`blocked`, `usage_limited`) but do not let global long-term goals drive the shape.

Risk: OpenHuman's status set is smaller than the Codex status set listed in the research prompt, so a final state schema copied from OpenHuman alone would under-model `blocked` and `usage_limited`.

### Finding 2 - JSON-per-thread persistence is a strong local-store precedent.

Evidence: OpenHuman stores each goal under `<workspace>/thread_goals/<hex(thread_id)>.json`, with at most one goal per thread. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs`:1] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs`:64] Mutations use a load-mutate-save sequence guarded by a mutex, and persistence writes through a temp file plus fsync plus rename. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs`:9] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs`:103]

OUR target: goal state store used by `.opencode/plugins/mk-goal.js`.

Decision: Prefer the flat JSON option for OpenCode: `.opencode/skills/.goal-state/<hex(session_id)>.json` or equivalent per-session JSON files, with atomic temp-write and rename. This matches the vendored design better than a shared SQLite store or spec-memory document.

Risk: A JavaScript OpenCode plugin may run in more than one process, so an in-process mutex alone is not enough. The build design needs an atomic write path and probably a lock file or compare-and-swap by `goalId` for stale writers.

### Finding 3 - The command/API contract is get, set, complete, pause, resume, clear.

Evidence: `threadGoalApi.ts` defines the frontend wire type and exposes `get`, `set`, `complete`, `pause`, `resume`, and `clear` against `openhuman.thread_goals_*` RPC methods. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts`:19] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts`:50] The JSON-RPC e2e test covers the full lifecycle: no goal, set with budget, get same `goalId`, pause, resume, complete, clear, and subsequent null get. [SOURCE: `.opencode/specs/z_future/openhuman/external/tests/json_rpc_e2e.rs`:2802] [SOURCE: `.opencode/specs/z_future/openhuman/external/tests/json_rpc_e2e.rs`:2851] [SOURCE: `.opencode/specs/z_future/openhuman/external/tests/json_rpc_e2e.rs`:2894]

OUR target: `.opencode/commands/goal.md`.

Decision: Make `/goal` a thin router over the same lifecycle verbs: no args or `show` -> get; arbitrary text -> set; `pause`; `resume`; `complete`; `clear`. Preserve `goalId` across same-objective budget edits, but mint a new id and reset counters when the objective changes.

Risk: OpenCode markdown commands may not be able to mutate plugin state directly. G6 must verify whether `goal.md` can call a plugin helper/tool, or whether it must instruct the model to perform a file edit through the normal tool surface.

### Finding 4 - The wrong `goalsApi` is global memory, not session completion.

Evidence: `goalsApi.ts` is for `openhuman.memory_goals_*` and persists an editable list of durable long-term goals to `<workspace>/MEMORY_GOALS.md`. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/goalsApi.ts`:1] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/goalsApi.ts`:4] Its verbs are list/add/edit/remove/reflect, including a long-running enrichment pass. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/goalsApi.ts`:62] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/services/api/goalsApi.ts`:96]

OUR target: `.opencode/plugins/mk-goal.js` and `.opencode/commands/goal.md`.

Decision: Do not reuse the global `goalsApi` semantics for OpenCode `/goal`. Reuse only its response-normalization idea if later needed; the goal plugin should model `threadGoalApi`, not long-term memory goals.

Risk: Naming the OpenCode command `/goal` can blur "session completion condition" with durable user goals. The command help text should call it a session goal/completion condition, not a memory goal.

### Finding 5 - The UI reuse idea is a compact status chip plus an expanded editor, not a full panel.

Evidence: `ThreadGoalChip.tsx` splits state into a shared `useThreadGoal` controller, a footer trigger, and an editor panel. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:10] The hook fetches on thread change and polls every 10 seconds so continuation-driven changes appear without manual refresh. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:27] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:104] The footer trigger shows `Set goal` when empty, otherwise status plus objective; the panel exposes pause/resume/complete/clear, budget usage, and objective editing. [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:180] [SOURCE: `.opencode/specs/z_future/openhuman/external/app/src/pages/conversations/components/ThreadGoalChip.tsx`:221]

OUR target: `.opencode/plugins/mk-goal.js` injection and `.opencode/commands/goal.md` user surface.

Decision: Since OpenCode cannot reuse the desktop chip directly, substitute two surfaces: a compact injected `[active_goal]` block every turn for the model, and `/goal show` for the human-visible equivalent of the chip. If OpenCode exposes a status-line or tool-status hook in G5/G11, show the same `status + objective + budget` tuple there.

Risk: Without a real status-line overlay, users may forget a goal is active between turns. The command should make `show` cheap, and the injected context should identify itself as harness state to avoid confusing it with a user message.

### Finding 6 - The per-turn steering text is tiny, source-attributed harness state.

Evidence: OpenHuman renders an `[active_goal]` block only for active or budget-limited goals and includes status, objective, budget, and a directive. Paused and complete goals return no steering block. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs`:86] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs`:91] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/runtime.rs`:102]

OUR target: `.opencode/plugins/mk-goal.js`, specifically `experimental.chat.system.transform`.

Decision: Reuse this compact block almost directly, adapted to OpenCode: inject only `active` and budget-stop states; omit `paused` and `complete`; include a directive to continue, mark complete when evidence confirms completion, and summarize rather than continue when budget-limited.

Risk: Injecting the raw objective every turn makes prompt-injection handling load-bearing. G13 should decide whether `objective` must be sanitized or fenced before inclusion.

### Finding 7 - Idle autonomy needs one-shot suppression and budget gates before it is safe.

Evidence: The continuation runtime is opt-in, fires only after an active goal is idle, sets `continuation_suppressed` after one continuation, serializes continuations with a semaphore, skips in-flight turns, and caps continuations per heartbeat tick. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs`:1] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs`:8] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs`:45] [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs`:71] The continuation prompt explicitly tells the agent there is no present user, to verify evidence, call completion when done, and stop on missing input or irreversible actions. [SOURCE: `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/continuation.rs`:147]

OUR target: `.opencode/plugins/mk-goal.js` lifecycle if G5 confirms `session.idle` can dispatch another prompt.

Decision: Reuse `continuationSuppressed` even if the first build is passive injection only. If active continuation is enabled later, make it opt-in, one-shot per idle period, no in-flight turn, capped, and budget-aware.

Risk: OpenCode may not expose an equivalent trusted-automation origin or approval gate. Without that, active idle continuation should remain disabled by default.

## Questions Answered

- [G3] Answered: the vendored reference models `/goal` as a single thread/session completion contract, with a compact lifecycle, per-thread JSON persistence, typed get/set/pause/resume/complete/clear API, compact chip/editor UI, per-turn `[active_goal]` injection, and guarded one-shot idle continuation.
- Reuse ideas: per-session JSON state, `goalId` versioning, same-objective counter preservation, changed-objective counter reset, status/objective/budget display tuple, compact injected goal block, and `continuationSuppressed`.
- Do not reuse: global long-term `goalsApi` semantics or `MEMORY_GOALS.md` as the session-goal store.

## Questions Remaining

- [G1] Confirm the exact Codex `thread_goals` SQLite schema and status set, especially `blocked` and `usage_limited`.
- [G4] Verify the exact OpenCode `experimental.chat.system.transform` signature and how to push the `[active_goal]` block.
- [G5] Verify whether `session.idle` can safely trigger a continuation turn, and whether OpenCode exposes no-in-flight, approval, and event-status signals.
- [G6] Verify whether markdown commands can call a plugin helper/tool or must route through model-visible file edits.
- [G7] Finalize the state-store path and locking strategy.
- [G13] Decide the sanitizer/fencing rule before inserting user-authored objective text into every turn.

## Next Focus

[G4] How OpenCode injects context via `experimental.chat.system.transform` in `.opencode/plugins/mk-spec-memory.js`, because G3's strongest reusable mechanism is the compact per-turn `[active_goal]` block and the next design risk is mapping it onto the actual OpenCode plugin API.
