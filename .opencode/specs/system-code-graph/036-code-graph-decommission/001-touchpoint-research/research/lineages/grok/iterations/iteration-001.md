# Iteration 001 — Physical registration topology & occurrence baseline

## Focus

Physical MCP/plugin/launcher registration topology with `rg --hidden --no-ignore`, symlink resolution, and live-vs-archival occurrence baseline.

## Actions Taken

1. Resolved symlink identity for doctrine and MCP config paths.
2. Ran mandatory `rg --hidden --no-ignore -l` for `mk_code_index|mk-code-index|system-code-graph|mk_code_graph|mk-code-graph` (excluding `.git`, `node_modules`, `.venv`, `dist`).
3. Grepped physical MCP/settings/hook config files for registration strings.
4. Listed plugin and launcher binaries under `.opencode/plugins` and `.opencode/bin`.
5. Filtered hit list excluding `.opencode/specs/**`, `.worktrees/**`, logs, and benchmark reports → `logs/live-hit-paths-iter001.txt`.

## Findings

### F1 — Symlink dedupe (confirmed)
[SOURCE: CLAUDE.md → AGENTS.md (symlink)]
[SOURCE: .mcp.json → .claude/mcp.json (symlink)]
[SOURCE: .cursor/mcp.json → .claude/mcp.json (symlink)]
- Mutation targets must be **AGENTS.md** (not CLAUDE.md) and **`.claude/mcp.json`** (not `.mcp.json` / `.cursor/mcp.json`).

### F2 — Physical MCP server registrations (4)
| Path | Role | Mutation class |
|------|------|----------------|
| `opencode.json:69` | OpenCode MCP `mk_code_index` → launcher | **remove / rewire** |
| `.claude/mcp.json:58` | Claude/Cursor/root MCP canonical | **remove / rewire** |
| `.codex/config.toml:31` | Codex `[mcp_servers.mk_code_index]` | **remove / rewire** |
| `.pi/mcp.json:25` | Pi MCP `mk_code_index` | **remove / rewire** |

All point at `.opencode/bin/mk-code-index-launcher.cjs` with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index`.

### F3 — Launchers & OpenCode plugins (live binaries)
[SOURCE: .opencode/bin/mk-code-index-launcher.cjs]
[SOURCE: .opencode/bin/code-index.cjs]
[SOURCE: .opencode/plugins/mk-code-graph.js]
[SOURCE: .opencode/plugins/mk-code-graph-freshness.js]
Plus launcher vitest suite under `.opencode/bin/mk-code-index-launcher-*.vitest.ts`.

### F4 — Hook/settings registration surfaces (preview; deepen iter 2)
[SOURCE: .claude/settings.json:165] — SessionStart/freshness hook → `system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs`
[SOURCE: .codex/hooks.json:101] — PostToolUse freshness → `.../codex/code-graph-freshness.cjs`
[SOURCE: .claude/settings.local.json:5] — Bash allowlist grant: `node .opencode/bin/code-index.cjs *`

### F5 — Occurrence baseline & archival split
- Filtered live-ish paths (non-spec, non-worktree, non-log, non-benchmark): **~384 files** (`logs/live-hit-paths-iter001.txt`).
- `.opencode/specs/**` hits: **4364 files** — treat as **ARCHIVAL**; inventory only, never propose edits.
- Recount excluding worktrees/specs/logs: **~390** files — use this as the live surface estimate.
- First unbounded `-l` tee reported 145894 lines (likely inflated by duplicate/worktree/noise); do not use as authoritative live count.

### F6 — Sweep method invariant
Visible-only `rg` without `--hidden --no-ignore` would miss `.claude/mcp.json`, `.mcp.json`, `.cursor/mcp.json`, and `.claude/settings.local.json`. **Mandatory** for this inventory.

## Questions Answered

- Q1 (partial): Physical registration identity after symlink dedupe — **4 MCP configs + plugins/launchers**.
- Q5 (partial): Specs are archival; symlink aliases are not independent edits.

## Questions Remaining

- Q2: Full skill/agent/command/hook/doctrine grant matrix.
- Q3: Import/shell-out/CI/doctor spine.
- Q4: Ordering + rollback.
- Q5: Complete generated/duplicate classification beyond specs/symlinks.

## Ruled Out / Failed

- Visible-only no-ignore sweeps.
- Counting CLAUDE.md / `.mcp.json` / `.cursor/mcp.json` as separate mutation targets.
- Using raw 145894 figure as live touchpoint count.

## Next Focus

Skills, agents, commands, hooks, and doctrine files that grant or require code-graph tools (Q2), using the live-hit list as a starting inventory.

## SCOPE VIOLATIONS

None — writes only under lineage `research/lineages/grok`.
