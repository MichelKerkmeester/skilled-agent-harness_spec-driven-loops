# Context Report: mcp-click-up README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the two paths, the operation routing, the safety invariants and the outputs. Both independently found that the current README has WRONG MCP integration details (config file, tool naming, call pattern), so this rewrite fixes broken instructions, not just voice.

---

## 1. PURPOSE

`mcp-click-up` is an orchestrator that drives ClickUp from an agent or terminal through two paths: the `cupt` command-line tool for fast daily task operations and the official ClickUp MCP server (through Code Mode) for documents, goals and bulk work, with operation-based routing and explicit agent safety invariants.

## 2. PROBLEM

Managing ClickUp from an agent is risky and slow if you reach for the heavyweight API on every small action. A "mark this done" or "list my tasks today" wants one fast command, but each ClickUp list can carry its own status schema, so a blind completion writes the wrong status and that is hard to reverse. Bulk work and documents need the full API, but routing daily reads and writes through it wastes tokens and loses the dry-run safety net. This skill sends daily task ops to a fast CLI with a dry-run preview and reserves the official MCP for the heavy operations, with invariants that force a status check and a dry-run before any completion.

## 3. THE TWO PATHS

- cupt CLI (primary): fast and token-efficient for daily task ops (list, show, done, notes, time tracking, tags, context, statuses). It carries the dry-run safety net and an offline mode.
- Official ClickUp MCP (secondary): the full `@clickup/mcp-server` surface for documents, goals and OKRs, bulk creates (5+ tasks), webhooks, chat and audit logs. Reached through Code Mode `call_tool_chain()`.
- Routing is operation-based (`SKILL.md:57-76`): each operation has a primary tool. Eleven daily operations go to cupt; six heavier operation classes are MCP-only.

## 4. INVOCATION (verified, authoritative forms)

cupt install (`SKILL.md:177`): `bash .opencode/skills/mcp-click-up/scripts/install.sh` (runs `pipx install cupt`, falls back to `pip install --user cupt`; supports `--check-only` and `--mcp-only`). Authenticate with `cupt auth` (interactive) or `cupt config --api-token pk_xxx`. Verify with `cupt status`. Needs Python 3.8+.

cupt subcommands (`SKILL.md:303-346`): `cupt list [--today|--week|--overdue|--tag X|--mine|--all|--json|--offline]`, `cupt show <id> [--notes|--json]`, `cupt done <id> [--dry-run|--note "text"]`, `cupt note <id> "<text>"`, `cupt notes <id>`, `cupt time start <id>|stop|add <id> <dur>|status`, `cupt tag add|remove <id> <name>`, `cupt context <id>`, `cupt statuses <id>`.

Official MCP (the authoritative facts the current README gets wrong):
- Register the official `@clickup/mcp-server` in the platform MCP config under `opencode.json` `mcpServers` (or `.mcp.json` / `claude_desktop_config.json`) with server key `"clickup"`, env `CLICKUP_API_KEY=pk_xxx` and `CLICKUP_TEAM_ID=<numeric>`. Run `scripts/install.sh --mcp-only` to print the snippet. Needs Node 18+/npx.
- Tool naming is `clickup.clickup_{tool_name}` (all lowercase, underscores). NOT `clickup_official.clickup_official_*`.
- Call through Code Mode with the array form: `call_tool_chain([{ tool: "clickup.clickup_search_tasks", input: { ... } }])`. NOT the `{ code: "..." }` form, and NOT `.utcp_config.json`.

## 5. OPERATION ROUTING (verified, SKILL.md:57-76)

cupt is primary for: list/filter, task details, mark complete, add note, read comments, start/stop timer, log time, add tag, remove tag, task context, discover statuses. The official MCP is the only path for: documents, goals and OKRs, bulk create (5+), webhooks, chat, audit logs. Many daily operations also have an MCP fallback tool (`clickup_search_tasks`, `clickup_get_task`, `clickup_update_task`, `clickup_manage_comments`, `clickup_add_tag_to_task`), but the routing rule keeps daily ops on cupt for speed and dry-run safety.

## 6. AGENT SAFETY INVARIANTS (verified, SKILL.md:250-266)

Always: run `cupt statuses <id>` before any `cupt done` (each list has its own status schema), `cupt done <id> --dry-run` before a batch completion (one dry-run per task), `--json` for programmatic reads, `cupt --version && cupt status` as a preflight, treat an empty `cupt list` as valid, `cupt context <id>` before acting. Never: hardcode status names across tasks, bulk-complete without a per-task dry-run, use the community `@krodak/clickup-cli` (`cu`) tool, auto-modify `opencode.json` (print the snippet for the user), fabricate tasks for an empty queue, or use the MCP for daily task ops. The MCP has no dry-run equivalent, which is why daily writes stay on cupt.

## 7. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | Routing pseudocode, the operation table, the agent invariants and the quick reference |
| `INSTALL_GUIDE.md` | Phased install for cupt and the MCP server with validation checkpoints |
| `references/cupt_commands.md` | Complete cupt command reference with `--json` variants and invariant examples |
| `references/mcp_tools.md` | The official MCP tool reference with priority tiers and the `call_tool_chain()` pattern |
| `references/troubleshooting.md` | Auth, status, team-filter, MCP connection and PATH-conflict diagnostics |
| `examples/README.md` | Orientation for the two production scripts |
| `examples/task-queue-workflow.sh` | Tagged queue: preflight, inspect, dry-run all, complete, handoff |
| `examples/time-tracking-workflow.sh` | Timer lifecycle: start, stop, log, status, with orphan detection |
| `scripts/install.sh` | Embedded installer; prints the MCP config snippet, never writes config |

The skill also ships `feature_catalog/`, `manual_testing_playbook/`, `graph-metadata.json`, a `changelog/` and a vendored `mcp-servers/` tree. Capability counts (cupt commands, MCP tools, catalog entries, test scenarios) differ across docs, so the rewrite does not pin them.

## 8. WORKFLOWS & OUTPUTS

`task-queue-workflow.sh [--tag X] [--dry-run]` processes a tagged queue: preflight (cupt + jq + auth), fetch (`cupt list --tag X --all --json`), inspect each task (`cupt show --notes --json`, `cupt context`, `cupt statuses`), dry-run every completion, then complete and hand off (remove the processing tag, add `needs_review`, leave a note). It prints phase-segmented output with a completed/failed summary and exits 0 on success or empty queue, 1 on preflight failure. `time-tracking-workflow.sh {start <id>|stop|log <id> <dur>|status}` manages a timer with duration validation and orphan detection on exit.

## 9. BOUNDARIES

This skill orchestrates ClickUp; it does not implement the MCP transport (that is `mcp-code-mode`). It uses only the official `@clickup/mcp-server`, never a community server. cupt and the MCP cover different operation sets by design, so neither is a drop-in for the other. For generated application code the surface is `sk-code`.

## 10. STALE FACTS (the current README is wrong here)

- MCP config location: the README says `.utcp_config.json` with a `manual_call_templates` entry. SKILL.md, INSTALL_GUIDE, install.sh and mcp_tools.md all say the platform MCP config (`opencode.json` mcpServers and peers) with server key `"clickup"`. Use the authoritative form.
- MCP tool naming: the README says `clickup_official.clickup_official_{tool}`. Every authoritative file says `clickup.clickup_{tool_name}`. Use `clickup.clickup_`.
- Call pattern: the README uses `call_tool_chain({ code: "..." })`. The canonical form is the array `call_tool_chain([{ tool, input }])`.
- Server key: the README uses `"clickup_official"`. SKILL.md and INSTALL_GUIDE use `"clickup"`.
- Version line and the Version History section: drop both (the template carries no version).
- Counts: the README says 14 operations (the table has 16) and "5 phases / 16 test files" (the playbook has 10 phase folders). Do not pin counts.

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the two paths and invocation; iteration 2 verified the command surface, the routing table, the safety invariants and the stale facts, each cited to a file and line. Both models independently found the same wrong MCP integration details in the README and agreed on the authoritative forms. Converged before the three-iteration ceiling.
