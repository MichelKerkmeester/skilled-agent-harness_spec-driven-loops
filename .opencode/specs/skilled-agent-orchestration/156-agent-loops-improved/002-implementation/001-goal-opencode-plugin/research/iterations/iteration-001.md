# Focus

G1: Codex `thread_goals` data model and lifecycle implications for the OpenCode `/goal` state model.

# Actions Taken

- Read the deep-research skill contract and quick reference to confirm this is a leaf iteration writing `research/iterations/iteration-NNN.md` plus `research/deltas/iter-NNN.jsonl`.
- Read the packet strategy and state seed. The strategy names the target OpenCode files as `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md`, and a state store at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/research/deep-research-strategy.md:11`; G1 is the current focus at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/research/deep-research-strategy.md:17`.
- Queried `~/.codex/goals_1.sqlite` with `.schema thread_goals`, `PRAGMA table_info(thread_goals)`, row counts, status counts, and index metadata.

# Findings

## 1. Codex uses exactly one durable goal row per thread.

Evidence: `sqlite3 ~/.codex/goals_1.sqlite '.schema thread_goals'` returned `thread_id TEXT PRIMARY KEY NOT NULL`, followed by `goal_id`, `objective`, `status`, optional `token_budget`, `tokens_used`, `time_used_seconds`, `created_at_ms`, and `updated_at_ms`. The only index reported by `sqlite_master` was `sqlite_autoindex_thread_goals_1`, the primary-key index. The live database row count was `goal_count = 0`, so no real lifecycle rows were available.

OUR target: `.opencode/plugins/mk-goal.js` should key active goal state by the OpenCode session/thread identifier, and the state store should enforce one current goal per session. `.opencode/commands/goal.md` can implement setting a new objective as an upsert/replace for the current session, not as an append-only list.

Decision: Port the Codex shape as a per-session singleton: `sessionId` as the primary key, `goalId` as the stable identity for the current objective, and `objective` as the user-authored completion condition.

Risk: The database is empty, so this is schema evidence, not observed transition evidence. Later iterations still need OpenCode lifecycle evidence before deciding exactly when `goalId` rotates and whether complete goals are retained or deleted.

## 2. Codex status is a constrained lifecycle enum, not free-form state.

Evidence: the schema has `CHECK(status IN ('active', 'paused', 'blocked', 'usage_limited', 'budget_limited', 'complete'))`. The status-count query returned no rows because the table is empty.

OUR target: `.opencode/plugins/mk-goal.js` should treat status as a closed enum for injection and autonomy decisions. `.opencode/commands/goal.md` should expose user-facing transitions for `active`, `paused`, and `complete`; `blocked`, `usage_limited`, and `budget_limited` should be plugin/runtime transitions.

Decision: Use Codex's six statuses unchanged for v1: `active`, `paused`, `blocked`, `usage_limited`, `budget_limited`, `complete`. Do not add `cleared`; `/goal clear` should remove the session record. Do not add `expired`; without a Codex time budget field, that would be an OpenCode-only extension.

Risk: The enum names are clear, but their transition rules are not proven by rows or source. If later Claude/OpenHuman evidence expects a richer lifecycle, this enum may need metadata fields rather than more statuses.

## 3. Token budget exists; time budget does not.

Evidence: `PRAGMA table_info(thread_goals)` returned `token_budget INTEGER`, `tokens_used INTEGER NOT NULL DEFAULT 0`, and `time_used_seconds INTEGER NOT NULL DEFAULT 0`. A query for `time_budget_seconds` failed with `no such column: time_budget_seconds`, confirming Codex tracks elapsed time but does not store a time cap in this table.

OUR target: the OpenCode state store should include `tokenBudget`, `tokensUsed`, and `timeUsedSeconds`, matching Codex. It should not include `timeBudgetSeconds` in the v1 schema unless a later OpenCode-specific design fork deliberately adds it.

Decision: Implement budget governance as token-first: nullable `tokenBudget`; numeric `tokensUsed`; numeric `timeUsedSeconds` as telemetry. Move to `budget_limited` when `tokenBudget` is non-null and the plugin can prove `tokensUsed >= tokenBudget`. Reserve `usage_limited` for external model/runtime usage exhaustion, not normal goal budget exhaustion.

Risk: OpenCode plugin hooks may not expose reliable token deltas per session. If usage accounting is unavailable, `tokensUsed` may need to be best-effort telemetry and `budget_limited` may require manual or command-driven enforcement.

## 4. Timestamps are millisecond integers, which keeps the store portable.

Evidence: the schema stores `created_at_ms INTEGER NOT NULL` and `updated_at_ms INTEGER NOT NULL`. No datetime text columns or migration table were present in the `thread_goals` schema/index query.

OUR target: the state store should use JSON number timestamps named `createdAtMs` and `updatedAtMs`, with `updatedAtMs` changed on every command or plugin lifecycle transition.

Decision: Use a small flat JSON state file for the OpenCode v1 design, keyed by `sessionId`, with camelCase field names mirroring the Codex schema: `sessionId`, `goalId`, `objective`, `status`, `tokenBudget`, `tokensUsed`, `timeUsedSeconds`, `createdAtMs`, `updatedAtMs`.

Risk: SQLite would give atomic writes and constraints for free. If multiple OpenCode processes can mutate the same state file, the flat JSON option needs atomic write/rename plus read-modify-write discipline, or the design should switch to SQLite in G7.

# Questions Answered

- G1 answered for the state model: Codex's goal model is a per-thread singleton with a constrained status enum, nullable token budget, usage counters, elapsed-time telemetry, and millisecond timestamps. It does not include a time-budget cap.

# Questions Remaining

- G2-G14 remain open. The biggest dependency for G1 follow-through is G7: whether OpenCode should keep the flat JSON state store for simplicity or use SQLite to inherit Codex-like constraints and safer concurrent mutation.

# Next Focus

G2: Claude Code `/goal` behavior: completion condition, autonomous continue-until-met behavior, independent supervisor verification, and status-line overlay.
