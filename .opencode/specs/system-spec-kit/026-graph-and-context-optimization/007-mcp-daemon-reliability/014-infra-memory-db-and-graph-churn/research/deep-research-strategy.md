# Deep Research Charter — Remaining system-spec-kit failures (common-cause)

## Research Topic
Root-cause the remaining system-spec-kit failures observed after this session's recent phases, and determine whether they share a common underlying cause (daemon-lifecycle / single-writer contention).

## Executor
cli-codex · gpt-5.5 · reasoning=high · service-tier=fast · timeout 900s. Native @deep-research fallback after 2 consecutive cli failures.

## Sub-questions (P0 = blocker for the verdict)
- **SQ1 [P0] Substrate 5-vs-4:** Why does `substrate-runner-harness.vitest.ts:42` find 5 verdict rows when it asserts 4? Is it (a) a 5th scenario added without updating the assertion, (b) a duplicate row, or (c) a non-deterministic double-write through the two real MCP daemons? Evidence: the harness, its TSV producer, the scenario list (403/404/407/410).
- **SQ2 [P0] Memory constraint recurrence:** Why does `SQLITE_CONSTRAINT_PRIMARYKEY` recur on `memory_index` insert (via the `memory_fts_insert` FTS5 trigger) in a fresh process *after* an FTS rebuild + clean restart, while the at-rest DB is healthy (quick_check ok, memory_index = memory_fts counts)? What makes the daemon exit uncleanly and re-drop `.unclean-shutdown`?
- **SQ3 [P1] Graph-metadata churn:** Confirm the committed root cause (default-root walk + unconditional last_save_at + Zod stripping last_active_child_id/last_active_at) holds, and whether it interacts with the daemon lifecycle.
- **SQ4 [P0] Common cause:** Do SQ2's unclean-shutdown recurrence and SQ1's multi-daemon double-write both trace to the single-writer / daemon-lifecycle contention that 031/009 and 032 addressed (multiple daemons / unclean exits under concurrent sessions)?

## Non-goals (do NOT do)
- Do NOT fix any code. Research only; cite evidence as file:line.
- Do NOT mutate the live memory DB or run memory_save/index_scan against it.
- Do NOT touch git, adjacent-session WIP, or files outside the evidence sources.
- Do NOT re-run the full stress suite (the failure is already captured).

## Stop conditions
- All P0 sub-questions (SQ1, SQ2, SQ4) answered with file:line evidence AND 3 quality guards pass, OR
- newInfoRatio ≤ 0.05 for 2 consecutive iterations (min 3 iterations), OR
- 10 iterations reached.

## Known context (evidence sources)
- Packet 031/009 — single-writer/durability cluster (respawn-lock liveness, listener re-arm, reap-root, marker-after-close, staging-shard swap, lease childPid).
- Packet 032 — infra memory-db + graph-churn investigation (this packet).
- `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` + its TSV producer/runner.
- `.opencode/bin/mk-spec-memory-launcher.cjs` — daemon lifecycle, single-writer lease, `.unclean-shutdown` marker.
- FTS5 trigger schema (`memory_fts_insert`) in `mcp_server/lib/search/vector-index-schema.ts`.
- This session's stress run: DEGRADED, 78/79 (1 substrate failure).
- Live observation this session: `SQLITE_CONSTRAINT_PRIMARYKEY` recurred in a fresh codex/opencode process despite an FTS rebuild; `.unclean-shutdown` re-appeared naming a since-dead pid.

## Negative knowledge (seed — ruled-out so far)
- Standing on-disk FTS corruption as the *sole* cause: ruled out — at-rest quick_check is ok and row counts match; the FTS rebuild succeeded yet the failure recurred. Points to lifecycle, not data.
- `/doctor memory` as the repair path: ruled out — it is diagnostic-only; the guarded path is `memory_health autoRepair`.
