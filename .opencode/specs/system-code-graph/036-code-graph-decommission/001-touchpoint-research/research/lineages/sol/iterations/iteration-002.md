# Iteration 2: Runtime registrations, launchers, plugins, and install surfaces

## Focus

Enumerated the live startup and registration chain for the MCP server and adjacent OpenCode plugin surfaces.

## Actions Taken

1. Re-read config, state, and strategy.
2. Swept exact identity tokens with `rg --hidden --no-ignore` outside archival specs, changelogs, benchmark reports, and the owned skill tree.
3. Read each physical MCP configuration block.
4. Inspected OpenCode plugin exports, launcher/shim entrypoints, shared launcher integration, environment overrides, process cleanup, and ignore rules.

## Findings

1. Three physical MCP configs register `mk_code_index`, and each starts `.opencode/bin/mk-code-index-launcher.cjs`: `opencode.json`, `.codex/config.toml`, and `.claude/mcp.json`. Remove these registrations before deleting the launcher or server tree. [SOURCE: opencode.json:69] [SOURCE: opencode.json:73] [SOURCE: .codex/config.toml:31] [SOURCE: .codex/config.toml:33] [SOURCE: .claude/mcp.json:58] [SOURCE: .claude/mcp.json:61]
2. Each config carries code-graph indexing flags plus `/tmp/mk-code-index` socket settings. The decommission must remove the whole server block, not only its command, or dead environment doctrine remains. [SOURCE: opencode.json:76] [SOURCE: opencode.json:81] [SOURCE: .codex/config.toml:35] [SOURCE: .codex/config.toml:41] [SOURCE: .claude/mcp.json:63] [SOURCE: .claude/mcp.json:69]
3. `.env.local` contains `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=skills,plugins`. This is ignored local state, must be called out for operator cleanup, and cannot be assumed fixed by a tracked commit. [SOURCE: .env.local:5]
4. OpenCode auto-loads two external plugins that depend on the retiring tree: `mk-code-graph.js` imports the transport and bridge, exposes `mk_code_graph_status`, and injects system/message/compaction context; `mk-code-graph-freshness.js` owns edit-triggered freshness hooks. Both plugin files and their tests/documentation are live removal targets. [SOURCE: .opencode/plugins/mk-code-graph.js:37] [SOURCE: .opencode/plugins/mk-code-graph.js:51] [SOURCE: .opencode/plugins/mk-code-graph.js:377] [SOURCE: .opencode/plugins/mk-code-graph.js:405] [SOURCE: .opencode/plugins/mk-code-graph-freshness.js:111] [SOURCE: .opencode/plugins/mk-code-graph-freshness.js:194]
5. Two root executable entrypoints remain after deleting the skill tree unless removed explicitly: `.opencode/bin/mk-code-index-launcher.cjs` starts/bridges the MCP daemon, while `.opencode/bin/code-index.cjs` shells into the built CLI and defaults to `/tmp/mk-code-index`. [SOURCE: .opencode/bin/mk-code-index-launcher.cjs:1214] [SOURCE: .opencode/bin/mk-code-index-launcher.cjs:1353] [SOURCE: .opencode/bin/code-index.cjs:23] [SOURCE: .opencode/bin/code-index.cjs:25]
6. Shared runtime code still has service-specific branches: `launcher-ipc-bridge.cjs` resolves `mk-code-index`, and `mk-spec-memory-launcher.cjs` sets `SPECKIT_CODE_GRAPH_DB_DIR`. These are external imports/behavioral dependencies, not files deleted with the graph skill. [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:89] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1142]
7. Process hygiene recognizes the launcher in both session cleanup and orphan sweeping. Remove those cases only after registration shutdown, or stale daemons may outlive the cutover. [SOURCE: .opencode/scripts/session-cleanup.sh:99] [SOURCE: .opencode/scripts/orphan-mcp-sweeper.sh:209]
8. `.gitignore` contains graph database, launcher, audit, quarantine, recovery, and known-good paths. These should be pruned late, after runtime-data cleanup/rollback decisions, so residual artifacts remain safely ignored during the transition. [SOURCE: .gitignore:165] [SOURCE: .gitignore:168] [SOURCE: .gitignore:182]

## Questions Answered

- Identified the live MCP registration surfaces and their physical alias identity.
- Identified the primary launcher, CLI shim, plugins, local maintainer override, shared launcher hooks, cleanup cases, and ignore rules.

## Questions Remaining

- Full external source imports and shell-outs outside startup.
- Hook and CI behavior.
- Agent grants, commands, doctrine, and archival boundaries.
- Dependency ordering and rollback.

## Ruled Out

- Deleting only `.opencode/skills/system-code-graph/`: configs, plugins, launcher/shim, cleanup, and shared launcher code would remain broken.
- Removing only the MCP command line: stale environment keys and operator notes would still advertise a nonexistent service.
- Treating `.env.local` as a tracked edit: it is machine-local operator state.

## Dead Ends

- Package-root search did not reveal a root `package.json` script that directly starts the graph; live starts are config and plugin driven.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: exact-token output is large because tests and docs mirror the surfaces; category-specific passes remain necessary.

## Sources Consulted

- `opencode.json:69`
- `.codex/config.toml:31`
- `.claude/mcp.json:58`
- `.env.local:5`
- `.opencode/plugins/mk-code-graph.js:37`
- `.opencode/plugins/mk-code-graph-freshness.js:111`
- `.opencode/bin/mk-code-index-launcher.cjs:1214`
- `.opencode/bin/code-index.cjs:23`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:89`
- `.opencode/bin/mk-spec-memory-launcher.cjs:1142`
- `.opencode/scripts/session-cleanup.sh:99`
- `.opencode/scripts/orphan-mcp-sweeper.sh:209`
- `.gitignore:165`

## Assessment

- New information ratio: 0.95
- Novelty: seven findings were fully new and one refined the baseline registration finding.
- Questions addressed: registrations, plugins, launchers, installation/runtime state.
- Questions answered: startup and registration chain.

## Reflection

- What worked and why: exact identity tokens isolated the executable registration chain from generic doctrine noise.
- What did not work and why: a single unbounded exact-token print still mixed live code, tests, generated output, and docs.
- What I would do differently: continue with narrower semantic roles and verify each category at source lines.

## Recommended Next Focus

Trace external imports, runtime APIs, CLI shell-outs, shared contracts, and integration code outside the retiring skill directory.
