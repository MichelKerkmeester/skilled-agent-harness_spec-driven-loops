# Iteration 7: G7 State Store Decision

## Focus

Which state store should the OpenCode `/goal` plugin use: flat JSON `.goal-state`, SQLite, or Spec Kit memory MCP? The decision must be buildable for `.opencode/plugins/mk-goal.js`, compatible with `.opencode/commands/goal.md`, and keyed by OpenCode session ID.

## Actions Taken

- Re-read the deep-research iteration/state contract and the existing research state so this iteration only answers G7.
- Queried Codex's live `thread_goals` schema from `~/.codex/goals_1.sqlite`.
- Read the vendored OpenHuman `thread_goals` type/store/API files for the existing "Codex row adapted to file JSON" implementation.
- Read `.opencode/plugins/mk-spec-memory.js` for OpenCode plugin session-ID extraction, cache invalidation, and system-transform mechanics.
- Compared `threadGoalApi.ts` with `goalsApi.ts` to separate session completion contracts from durable long-term memory goals.

## Findings

### Finding 1: Use the Codex row shape, but store it as a JSON record per OpenCode session.

Evidence: Codex `thread_goals` has `thread_id TEXT PRIMARY KEY`, `goal_id`, `objective`, constrained `status`, `token_budget`, `tokens_used`, `time_used_seconds`, `created_at_ms`, and `updated_at_ms` in the live sqlite schema. The vendored OpenHuman type explicitly says the thread goal mirrors Codex's row while adapting it to per-thread file JSON [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:10]. Its serialized record is one thread-scoped goal with `thread_id`, `goal_id`, `objective`, lifecycle status, optional `token_budget`, usage counters, timestamps, and `continuation_suppressed` [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:59].

OUR target: `.opencode/plugins/mk-goal.js` should define a JSON-friendly state record with `sessionId`, `goalId`, `objective`, `status`, `tokenBudget`, `tokensUsed`, `timeUsedSeconds`, `createdAtMs`, `updatedAtMs`, and `continuationSuppressed`.

Decision: Port Codex's row model into JSON rather than inventing a plugin-specific schema. Keep Codex's six-status set for final design parity, with `continuationSuppressed` as the one OpenCode/autonomy guard field.

Risk: The vendored OpenHuman status enum only covers `active`, `paused`, `budget_limited`, and `complete` [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:15]. Final G12 must reconcile that with Codex's `blocked` and `usage_limited` statuses instead of silently dropping them.

### Finding 2: Prefer per-session flat JSON under `.opencode/skills/.goal-state`, not SQLite.

Evidence: The vendored reference already rejected a direct SQLite port in favor of one JSON file per thread: `<workspace>/thread_goals/<hex(thread_id)>.json`, with at most one goal per thread [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:3]. It uses a load, mutate, atomic-persist sequence serialized by a process-wide mutex [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:9], creates the store directory on demand [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:57], writes a temp file, fsyncs it, then renames it into place [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:103].

OUR target: goal state store at `.opencode/skills/.goal-state/<hex(sessionID)>.json`, owned by `.opencode/plugins/mk-goal.js`.

Decision: Use a small filesystem store implemented inside `.opencode/plugins/mk-goal.js`: `ensureGoalStateDir()`, `goalPathForSession(sessionID)`, `readGoal(sessionID)`, `mutateGoal(sessionID, fn)`, `writeGoalAtomic(goal)`, and `clearGoal(sessionID)`. Avoid SQLite in v1 because the plugin can ship with Node core APIs only, while SQLite would add runtime/dependency/install friction for a one-row-per-session store.

Risk: Atomic rename protects torn writes, but not two OpenCode processes mutating the same session concurrently. The v1 plugin needs at least an in-process mutation queue; if multi-process OpenCode sessions are expected, add a lockfile created with exclusive open plus stale-lock cleanup before build.

### Finding 3: Key strictly by OpenCode session ID and hex-encode the filename.

Evidence: `.opencode/plugins/mk-spec-memory.js` already normalizes session identifiers from `sessionID`, `sessionId`, `session.id`, and event payload locations, falling back to `__global__` [SOURCE: .opencode/plugins/mk-spec-memory.js:122]. The vendored store validates non-empty thread IDs [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:38] and hex-encodes the thread ID bytes into the filename [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:64].

OUR target: `.opencode/plugins/mk-goal.js` should reuse a `sessionIdFrom(inputOrEvent)` helper and compute `.opencode/skills/.goal-state/<hex(sessionID)>.json`.

Decision: Mutating commands must require a real session ID. `__global__` may be acceptable for plugin diagnostics, but `/goal <objective>`, `/goal pause`, `/goal complete`, and `/goal clear` should not write a global fallback row.

Risk: If OpenCode command-tool context does not pass a session ID consistently, the plugin must fail closed with "session id required" rather than creating ambiguous global state.

### Finding 4: Do not use Spec Kit memory MCP as the source of truth for active goals.

Evidence: The vendored frontend separates thread goals from long-term goals: `threadGoalApi` describes a single thread-scoped completion contract and says handlers persist one goal per thread under the JSON thread-goals directory [SOURCE: .opencode/specs/z_future/openhuman/external/app/src/services/api/threadGoalApi.ts:1]. `goalsApi` is a different long-term surface persisted to `MEMORY_GOALS.md` and curated by a background goals agent [SOURCE: .opencode/specs/z_future/openhuman/external/app/src/services/api/goalsApi.ts:1]. The existing Spec Memory plugin shells out to a bridge process for continuity lookup [SOURCE: .opencode/plugins/mk-spec-memory.js:273] and treats failures as `fail_open` [SOURCE: .opencode/plugins/mk-spec-memory.js:315], which is reasonable for context injection but too indirect for authoritative command state.

OUR target: `.opencode/plugins/mk-goal.js` owns hot-path goal state locally; Spec Kit memory may receive a later completion summary, but it should not gate `/goal show`, every-turn injection, or lifecycle mutation.

Decision: Reject Spec Kit memory MCP as the v1 state store. It is a context/memory layer, not a session-goal transaction log.

Risk: Goal state will not be semantically searchable by Spec Kit memory while active. That is acceptable for a session-scoped completion condition; optional memory save can be added after completion if synthesis wants durable history.

### Finding 5: Preserve Codex/OpenHuman mutation semantics around replace, clear, list, and budget accounting.

Evidence: The vendored store preserves `goal_id` and counters when setting the same objective, but remints `goal_id` and resets counters when the objective changes [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:144]. It can list all JSON files for continuation scanning while skipping corrupt entries [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:256], clear by deleting the file [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:291], and ignore stale usage writes when `expected_goal_id` does not match the current goal [SOURCE: .opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/store.rs:401].

OUR target: `.opencode/plugins/mk-goal.js` state helpers and future `session.idle` continuation path.

Decision: Implement `setGoal` as an upsert with same-objective preserve / changed-objective reset, `clearGoal` as delete, and `accountUsage(sessionID, expectedGoalID, tokenDelta, secondsDelta)` as compare-and-skip on stale goal ID. Include `listGoals()` only for diagnostics or future global idle scanning; regular OpenCode `session.idle` can use the event's current session ID.

Risk: Usage accounting may be best-effort if OpenCode events do not expose reliable token deltas. G10 still needs to decide whether `usage_limited` is enforceable or only reportable.

## Questions Answered

- G7 is answered: use a flat per-session JSON state store under `.opencode/skills/.goal-state`, keyed by hex-encoded OpenCode session ID.
- SQLite is not the v1 choice: Codex's schema should be ported, but a SQLite dependency is unnecessary for one singleton row per session.
- Spec Kit memory MCP is not the v1 choice: it can preserve summaries, but it should not own hot-path active-goal state.
- The state store should use atomic writes and a mutation queue; cross-process lockfile support is the main hardening question before implementation.

## Questions Remaining

- G8: autonomy tier and loop caps for `session.idle` continuation.
- G9: completion detection: model self-report, verifier/supervisor, or shell gate.
- G10: exact budget governance and how to populate `tokensUsed` / `timeUsedSeconds` from OpenCode events.
- G12: final status set, especially `blocked` and `usage_limited`.
- G13: prompt-injection sanitizer/fencing for the user-authored objective before every-turn injection.

## Next Focus

G8: choose the autonomy tier for `.opencode/plugins/mk-goal.js`: passive injection only, active continuation via `session.idle -> session.prompt`, or active continuation plus supervisor verification. The state-store decision gives G8 a concrete substrate: active goals are local per-session JSON records with `continuationSuppressed`, usage counters, and status gates.
