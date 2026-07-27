# Iteration 001 — Physical Topology and Raw Occurrence Baseline

**Lineage:** glm | **Iteration:** 1 of 5 | **Focus:** Physical topology and raw occurrence baseline
**Timestamp:** 2026-07-27T20:28:00.000Z

## Focus
Establish the full live-surface hit set for the core identifiers (`system-code-graph`, `mk_code_index`/`mk-code-index`, `code_graph_*`, `detect_changes`, `code-index.cjs`) using `rg --hidden --no-ignore`, dedupe symlinks, and classify each hit as live vs archival before deeper per-consumer analysis.

## Method
- `rg --hidden --no-ignore -l` for `system-code-graph` and `mk[_-]code[_-]index` on the live surface (excluding `.worktrees/**`, `.opencode/specs/**` archival, `.git/**`, `node_modules/**`, `research/lineages/**`).
- `rg --hidden --no-ignore -n` for the core identifiers inside the three runtime registration files (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`).
- `rg --hidden --no-ignore -n` for `code_graph_` and `detect_changes` tool-id references on the live surface (excluding `dist/**`).
- Symlink resolution via `ls -la`.

## Findings

### F1.1 — Symlink deduplication map (CONFIRMED)
- `CLAUDE.md` → `AGENTS.md` (symlink, same file). [SOURCE: `ls -la CLAUDE.md AGENTS.md`]
- `.mcp.json` → `.claude/mcp.json` (symlink). [SOURCE: `ls -la .mcp.json`]
- `.cursor/mcp.json` → `../.mcp.json` → `.claude/mcp.json` (two-hop symlink chain, resolves to `.claude/mcp.json`). [SOURCE: `ls -la .cursor/mcp.json`]
- **Implication:** The three MCP registration files are ONE physical file (`.claude/mcp.json`) surfaced under three paths. Any removal edit touches one file; the symlink aliases must be inventoried but not independently edited. `CLAUDE.md`/`AGENTS.md` are likewise one doctrine file.

### F1.2 — Three runtime registrations of `mk_code_index` (CONFIRMED, blocking)
1. `opencode.json:69` — `"mk_code_index": { ... "command": ".opencode/bin/mk-code-index-launcher.cjs" }` [SOURCE: opencode.json:69-84]
2. `.claude/mcp.json:58` — same registration block (canonical file for the `.mcp.json`/`.cursor/mcp.json` symlink chain) [SOURCE: .claude/mcp.json:58-72]
3. `.codex/config.toml:31` — `[mcp_servers.mk_code_index]` with `args = [".opencode/bin/mk-code-index-launcher.cjs"]` [SOURCE: .codex/config.toml:31-41]
- **Failure mode if absent:** Each runtime (OpenCode, Claude, Codex) fails at session start with an MCP server-not-found error. These are the five "runtime registrations" cited in the spec (three distinct physical files; the `.mcp.json`/`.cursor/mcp.json` aliases are symlinks to #2).

### F1.3 — Agent tool grants (CONFIRMED, blocking for those agents)
Agents that list `mcp__mk_code_index__*` tools in their `tools:` frontmatter:
- `.claude/agents/deep-review.md:4` — `mcp__mk_code_index__detect_changes, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context` [SOURCE: .claude/agents/deep-review.md:4]
- `.claude/agents/deep-alignment.md:4` — `mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context` [SOURCE: .claude/agents/deep-alignment.md:4]
- `.claude/agents/review.md:4` — `mcp__mk_code_index__detect_changes` [SOURCE: .claude/agents/review.md:4]
- `.claude/agents/context.md` — references `code_graph_status`, `code_graph_query`, `code_graph_context` in body (tool grant line not captured this iteration; deferred to iteration 2). [SOURCE: .pi/agents/context.md:9,43,63-93]
- `.pi/agents/*` and `.codex/agents/*` — parallel agent definition trees with equivalent tool references (deep-review, deep-alignment, review, context, deep-research, deep-improvement, ai-council, debug). [SOURCE: .pi/agents/deep-review.md:12, .codex/agents/review.toml:42]
- `.claude/SYNC.md:76` — `tools: ... mcp__mk_code_index__detect_changes` [SOURCE: .claude/SYNC.md:76]
- **Failure mode if absent:** Agents with granted tools that no longer exist will either error at load or silently drop the tool depending on runtime strictness. Must be removed in lockstep with the MCP server registration.

### F1.4 — The eight `code_graph_*` tool ids (CONFIRMED)
From README.md:648: "The same 8 tools are exposed 1:1 by the `code-index.cjs` daemon-backed CLI." Named in live surface:
- `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_apply` (5 mutating/query)
- `detect_changes` (impact preflight)
- 2 more not yet named by id this iteration (README says 8; `code_graph_verify` and one other likely — deferred to iteration 2 via tool-schemas.ts). [SOURCE: README.md:648,637,657]
- The MCP tool prefix is `mcp__mk_code_index__code_graph_*` and `mcp__mk_code_index__detect_changes`. [SOURCE: README.md:657]

### F1.5 — Doctrine claims in root docs (CONFIRMED, live)
- `AGENTS.md:342` — routing table row: "Code Graph (`code_graph_query`, `code_graph_context`, `detect_changes`) + Grep" [SOURCE: AGENTS.md:342]
- `AGENTS.md:378` — stale/missing context row: `code_graph_scan if needed` [SOURCE: AGENTS.md:378]
- `.claude/CLAUDE.md:5` — "SEARCH ROUTING: use Code Graph structural search (`mcp__mk_code_index__code_graph_query`) plus Grep..." [SOURCE: .claude/CLAUDE.md:5]
- `README.md:590-657` — extensive end-user code graph documentation (scan, query, context, detect_changes, apply, readiness contract). [SOURCE: README.md:590-657]
- **Classification:** Live doctrine. Must be updated/removed in decommission. `AGENTS.md` = `CLAUDE.md` (symlink dedup).

### F1.6 — Archival boundary (CONFIRMED)
- `.opencode/specs/system-code-graph/**` (including `z_archive/`) — ARCHIVAL historical record. Inventoried but never proposed for editing.
- `.worktrees/**` — worktree checkouts containing archival spec copies. Excluded from live surface; not touchpoints.
- Changelogs under `.opencode/skills/system-code-graph/changelog/` and `.opencode/skills/system-deep-loop/deep-*/changelog/` — ARCHIVAL.
- Benchmark reports under `.opencode/skills/*/benchmark/reports/` — ARCHIVAL.

### F1.7 — Live-surface file count by top-level area (CONFIRMED)
Raw occurrence of `system-code-graph` OR `mk_code_index` on the live surface (excl worktrees/specs-archive/node_modules/research-lineages):
- `.opencode/skills/system-code-graph/**` — the skill itself (self-referential; entire skill is the decommission target)
- `.opencode/skills/system-spec-kit/**` — heavy integration (code-graph-boundary, code-index-cli-fallback, context-server, tool-schemas, shared contracts)
- `.opencode/skills/system-skill-advisor/**` — skill-graph.json, scorer fusion lanes, bench files
- `.opencode/skills/system-deep-loop/**` — coverage-graph schema, integration points, changelogs
- `.opencode/bin/**` — launchers, code-index.cjs, tests
- `.opencode/plugins/**` — mk-code-graph.js, mk-code-graph-freshness.js
- `.opencode/scripts/**` — session-cleanup.sh, orphan-mcp-sweeper.sh, git-hooks/post-commit
- `.opencode/commands/**` — doctor routes, deep research/review commands
- `.claude/**`, `.codex/**`, `.pi/**` — agent definitions, mcp.json, settings, hooks
- `.github/workflows/isolation-check.yml` — CI job
- `opencode.json`, `README.md`, `AGENTS.md` — root config and docs

## Assessment
- **newInfoRatio:** 1.0 — all findings are new to this lineage (first iteration).
- **Questions advanced:** q1 (runtime registrations — 3 confirmed), q4 (doctrine claims — root docs confirmed), partial q3 (agent tool grants confirmed).
- **Ruled out:** visible-only `rg` without `--hidden` (would miss `.claude/mcp.json`, `.codex/config.toml`, `.devin/hooks.v1.json`); counting symlink aliases as independent edit targets.

## Dead Ends
- None this iteration.

## Next Focus
Iteration 2: Deep-dive the runtime registration chain — launchers (`mk-code-index-launcher.cjs`, `code-index.cjs`, `mk-spec-memory-launcher.cjs`), plugins (`mk-code-graph.js`, `mk-code-graph-freshness.js`), install surfaces, and the `.opencode/bin/lib/launcher-ipc-bridge.cjs` shared IPC. Confirm the remaining 2 tool ids via `tool-schemas.ts`. Capture the `.claude/agents/context.md` tool grant line.
