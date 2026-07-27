# Iteration 008 — Removal Order, Compatibility, and Rollback

## Focus

Convert the touchpoint graph into a safe removal sequence and identify consumers that still speak the old contract.

## Ordering Constraints

1. **Freeze and capture rollback state.** Record current config blocks, launcher/plugin/hook files, package lock state, ignored database location, and any operator `.env.local` graph flags. Decide whether the ignored SQLite database is disposable or needs an out-of-band backup. Git cannot restore ignored DB/WAL/quarantine data.
2. **Stop new callers first.** Remove agent grants, command allowlists, graph-first doctrine, Spec Kit routing nudges, passive enrichment calls, session-prime calls, Cursor/Claude/Codex/Devin freshness hooks, and OpenCode plugins. Preserve filesystem fallback behavior, memory hooks, advisor hooks, autosync, and deep-loop coverage graph behavior.
3. **Regenerate consumers before provider deletion.** Rebuild Spec Kit source/dist and command/runtime mirrors, synchronize canonical agents into regular-file runtime projections, and refresh installed Codex hooks. The `install-codex-hooks.mjs --check` probe currently reports user-level drift, proving repository-only hook edits are insufficient.
4. **Remove registrations and prevent restart.** Delete the physical MCP blocks in `opencode.json`, `.codex/config.toml`, and `.claude/mcp.json` once; their symlink aliases follow automatically. Remove doctor/install paths that can re-add the server.
5. **Drain runtime processes.** Stop `mk-code-index` launcher/daemon processes and remove stale socket, PID, lease, and freshness-state artifacts. Do this after registration removal so clients cannot immediately respawn them.
6. **Remove provider and dedicated front doors.** Delete `.opencode/skills/system-code-graph/**`, `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/code-index.cjs`, dedicated launcher tests, code-index smoke cells, and graph-only plugin/tests.
7. **Prune shared infrastructure surgically.** Remove the `mk-code-index` service branches from `launcher-ipc-bridge.cjs`, `mk-spec-memory-launcher.cjs`, `worktree-session.sh`, cleanup/sweeper classifiers, post-commit invalidation, mixed smoke suites, and isolation CI. Preserve memory/advisor services and generic launcher behavior.
8. **Reconcile docs, catalogs, counts, and ignore rules.** Rewrite current README/install/operator docs and remove graph-only scenarios. Prune `.gitignore`/`.gitattributes` entries only after the data rollback decision. Historical specs/changelogs/benchmarks remain.
9. **Run residual and behavior gates.** Exact-identity sweep, current-doc sweep, build/test matrix, config parse, hook installer check, and negative startup probes must all pass before deleting the rollback snapshot.

## Old-Contract Consumers

- Installed user-level Codex hooks can continue invoking removed freshness logic.
- Long-lived OpenCode/Claude/Codex sessions retain tool schemas and may call a removed server until restarted.
- Existing worktrees can carry old runtime configs, symlinked dist/node_modules, per-worktree graph DB paths, and environment exports (`.opencode/bin/worktree-session.sh:26`, `:88-89`, `:211-315`).
- Operator `.env.local` can retain `SPECKIT_CODE_GRAPH_*` variables even though it is not a tracked migration target.
- Cached plugin state, daemon sockets under `/tmp/mk-code-index`, PID/lease files, and ignored database artifacts survive Git changes.
- Regular-file agent/command mirrors and compiled Spec Kit dist survive authority edits unless explicitly regenerated.

## Rollback Risks

- Restoring only the skill directory leaves registrations, launcher, consumers, and generated mirrors version-skewed.
- Restoring registrations before provider/build artifacts makes every client fail at startup.
- Reusing a post-change empty/stale database as rollback state loses the prior graph and known-good snapshots.
- Reverting mixed hooks or CI wholesale can undo unrelated memory/advisor protections.
- A partial rollback can reintroduce graph-first doctrine without a callable graph, or a callable graph without grants and recovery guidance.

## Telemetry

- Findings: 9
- New-information ratio: 0.58
- Convergence: above threshold; telemetry only under `max-iterations`
- Next angle: enumerate the concrete verification and package/build/test surface
