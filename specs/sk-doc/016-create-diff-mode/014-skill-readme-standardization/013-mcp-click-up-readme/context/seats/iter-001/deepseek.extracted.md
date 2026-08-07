## 1. PURPOSE

Routes ClickUp work between the `cupt` command-line tool (primary, daily task operations) and the official ClickUp MCP server via Code Mode (secondary, documents/goals/bulk operations), using operation-based routing so agents never need to decide which tool to use.

## 2. PROBLEM

Managing ClickUp programmatically from an AI agent or terminal is fragmented across two fundamentally different surfaces: fast, safe daily operations (listing tasks, completing work, tracking time, managing tags) versus advanced operations (creating documents, managing goals/OKRs, bulk-creating tasks, webhooks, audit logs). A single tool cannot cover both well — `cupt` has dry-run safety and per-list auto-status-resolution for daily ops but cannot create documents, while the official ClickUp MCP handles documents and bulk operations but has no dry-run guard, no offline mode, and requires explicit status names. Without a routing layer, agents must hardcode assumptions about which tool to use, risking destructive operations on the wrong surface or silently failing on operations the tool does not support. This skill removes the decision burden by detecting intent and routing each operation to the correct tool, enforcing safety invariants (dry-run before writes, never hardcode status names) that prevent the most common agent-driven ClickUp mistakes.

## 3. MODES & CAPABILITIES

**Primary path — cupt CLI:** handles daily task operations: list/filter tasks, show details, mark complete (with `--dry-run` guard), add/read notes, start/stop time tracking, log time, add/remove tags, discover per-list status schemas (`cupt statuses`), and inspect task context (parent/sibling relationships). cupt auto-resolves the correct closed status per list and supports `--json` for machine output and `--offline` for cached operation.

**Secondary path — official ClickUp MCP via Code Mode:** handles operations cupt cannot do: creating/reading/updating ClickUp Documents, managing Goals/OKRs, bulk-creating 5+ tasks, webhooks, custom views, checklists, user groups, guests, chat messages, and enterprise audit logs. Also serves as fallback for task CRUD and search when cupt is unavailable.

**Routing rule (operation-based, not availability-based):** daily task ops (list, done, note, time, tag, context, statuses) route to cupt; documents, goals, bulk create, webhooks, chat, audit logs route to MCP only. The routing table and intent-signal scoring pseudocode live in `SKILL.md` §2.

**Agent safety invariants (each enforced by routing rules):** (1) dry-run before every destructive operation — `cupt done --dry-run` previews resolved status without writing, and batch processing loops must dry-run every task first; (2) never hardcode status names across tasks — `cupt statuses <id>` must run before every `cupt done` call because each ClickUp list has its own status schema; (3) for batch completion, per-task dry-run is mandatory, not a single shared lookup; (4) treat empty `cupt list` results as valid (an empty queue is not an error), check tag spelling and team names before escalating; (5) never use the `@krodak/clickup-cli` (`cu` command) — it is a different tool and the `cu` binary conflicts with the Unix `cu` command; (6) never auto-modify `opencode.json` — print MCP config snippets for the user to apply, never write to config files programmatically.

## 4. INVOCATION

**cupt CLI path:**

- **Install:** `python3 --version` (3.8+ required), then `pipx install cupt` (recommended, isolated) or `pip install --user cupt` (fallback), or use the embedded install script: `bash .opencode/skills/mcp-click-up/scripts/install.sh`. The script also accepts `--check-only` and `--mcp-only` flags.
- **Authenticate:** `cupt auth` (interactive OAuth wizard) or `cupt config --api-token pk_xxxxx` (direct Personal API Token). Verify with `cupt status`.
- **Key subcommands:** `cupt list [--today|--week|--overdue|--tag X|--team X|--mine|--all] [--json]`, `cupt show <id> [--notes] [--json] [--offline]`, `cupt statuses <id>`, `cupt done <id> [--dry-run] [--note "..."]`, `cupt note <id> "<text>"`, `cupt notes <id>`, `cupt time start|stop|add|status`, `cupt tag add|remove <id> <name>`, `cupt context <id>`, `cupt teams`, `cupt summary`, `cupt prefetch`. Full reference: `references/cupt_commands.md`.
- **Configuration stored at:** `~/.cupt/config.yaml` (token encrypted).

**Official ClickUp MCP path:**

- **Prerequisites:** Node.js 18+ with npx; the `clickup` MCP server registered in `opencode.json` under `mcpServers` with `CLICKUP_API_KEY` (Personal API Token, `pk_` prefix) and `CLICKUP_TEAM_ID` (numeric workspace ID — obtainable from `cupt status`) as env vars. Platform-specific config blocks for OpenCode (`opencode.json`), Claude Code (`.mcp.json`), and Claude Desktop are documented in `INSTALL_GUIDE.md` §4.
- **Invocation pattern:** MCP tools are called via Code Mode's `call_tool_chain()` (`mcp__code_mode__call_tool_chain` in tool routing). Tool naming convention: `clickup.clickup_{tool_name}` (e.g., `clickup.clickup_create_task`, `clickup.clickup_create_document`, `clickup.clickup_search_tasks`). The `references/mcp_tools.md` catalog lists all 46 tools in HIGH/MEDIUM/LOW priority tiers with invocation examples.
- **Auth:** `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` environment variables set in the MCP server's env block within the platform config.

**Vendored server copies (local install opt-in):**
- `mcp-servers/clickup-cli/` — contains `requirements.txt` (pin `cupt>=0.7.1`) and `setup.sh` (pipx/pip install) as an alternative to the top-level `scripts/install.sh`.
- `mcp-servers/clickup-mcp/` — contains `package.json` for `@clickup/mcp-server`; run `npm install` to vendor the MCP server locally.

## 5. KEY FILES

| File | Purpose |
|------|---------|
| `SKILL.md` | Runtime skill definition: activation triggers (§1), operation-to-tool routing table with intent-signal scoring pseudocode (§2), comparison table and dual-path invocation instructions (§3), agent safety invariants and escalate-if rules (§4), success criteria (§5), integration points (§6), quick-reference cheatsheet (§7), and related resources (§8) |
| `README.md` | Human-facing overview: feature tables, quick start, structure map, configuration, usage examples, troubleshooting table, FAQ, and related documents index |
| `INSTALL_GUIDE.md` | Phase-based installation guide (5 validation phases) with an AI-first install block, per-phase checklists, platform-specific MCP config snippets (OpenCode, Claude Code, Claude Desktop), troubleshooting table, and a quick reference card |
| `references/cupt_commands.md` | Complete cupt CLI command reference: authentication, task listing, task details, task completion (with dry-run and batch patterns), notes/comments, time tracking, tags, attachments, workspace commands, global flags, agent invariants with code examples, and API naming map (cupt vs ClickUp UI) |
| `references/mcp_tools.md` | Official ClickUp MCP tools reference (46 tools): HIGH/MEDIUM/LOW priority tables, Code Mode `call_tool_chain()` invocation patterns, document operations with parent-type values, goal management, bulk task creation, webhook management, error handling patterns (401/429/403/404), and MCP vs cupt quick-decision table |
| `references/troubleshooting.md` | Diagnostic reference: quick diagnostics sequence, installation issues (cupt not found, Python too old), authentication issues (401, expired tokens), status resolution errors (wrong status on completion, no matching closed status), team filter performance (client-side slowness), MCP connection issues (env vars, 403, tool not found), PATH conflicts (cu vs cupt), empty result handling, and cupt upgrade instructions |
| `scripts/install.sh` | Embedded install script: Python 3.8+ version check, cupt install via pipx (preferred) or pip (fallback), prints authentication instructions, prints official MCP config snippet (read-only, no file writes), with `--check-only` and `--mcp-only` flags |
| `mcp-servers/clickup-cli/setup.sh` | Alternative cupt install via pipx/pip (local vendored path) |
| `mcp-servers/clickup-cli/requirements.txt` | Pip pin for cupt (`cupt>=0.7.1`) |
| `mcp-servers/clickup-mcp/package.json` | npm package manifest for `@clickup/mcp-server` (run `npm install` to vendor) |
| `examples/task-queue-workflow.sh` | Production-ready bash script: full queue processing pipeline (preflight → fetch tagged tasks → inspect with `cupt show` + `cupt context` → discover per-task status schemas → dry-run all completions → confirm → complete → handoff with tag swap and note), with `--tag` and `--dry-run` flags, safe batch loop with per-task verification |
| `examples/time-tracking-workflow.sh` | Production-ready bash script: timer lifecycle management (`start`, `stop`, `log`, `status` subcommands), duration format validation (`1h30m`/`45m`/`2h`), orphaned timer detection, cleanup trap |
| `examples/README.md` | Example scripts documentation: overview, prerequisites, per-script usage and output examples, common patterns, customization tips, troubleshooting |
| `graph-metadata.json` | Skill graph registration: edges (depends_on mcp-code-mode, enhances sk-code), intent signals, trigger phrases, derived key files and entities, causal summary |
| `changelog/v1.0.0.0.md` | Initial release notes (2026-05-31): core skill, installation, references, examples, manual testing playbook design, architecture decisions, known limitations |
| `feature_catalog/FEATURE_CATALOG.md` | Full cupt + MCP feature inventory (UNKNOWN number of features claimed: README says 96 across 13 categories) |
| `feature_catalog/01--cupt-authentication/` through `13--mcp-low-priority/` | 13 per-category feature subdirectories |
| `manual_testing_playbook/manual_testing_playbook.md` | Testing playbook overview |
| `manual_testing_playbook/01--cupt-lifecycle/` through `10--mcp-bulk-and-structure/` | 10 phase-specific test directories |

## 6. BOUNDARIES

- **Community ClickUp MCP servers are excluded** — the `@taazkareem/clickup-mcp-server` and any other third-party MCP servers are explicitly out of scope. Only the official `@clickup/mcp-server` (`github.com/clickup/clickup-mcp-server`) is supported. `@krodak/clickup-cli` (`cu` command) is also excluded and explicitly warned against in SKILL.md §1 and §4.
- **Direct ClickUp REST API calls** (without cupt or MCP) are not covered — this skill adds no value for direct API usage.
- **Browser-based ClickUp automation** (Playwright/Puppeteer) is out of scope.
- **MCP transport is owned by the sibling skill `mcp-code-mode`** — this skill depends on it (`graph-metadata.json` edge weight 0.7) for invoking official ClickUp MCP tools via `call_tool_chain()`, but does not own, configure, or maintain the transport layer.
- **cupt and official MCP cover different operation sets** — cupt cannot create documents, manage goals, bulk-create tasks, or manage webhooks/chat/audit logs. The MCP has no dry-run, no per-list status auto-resolution, no offline mode, no `cupt context` equivalent, and no `cupt statuses` equivalent. They are complementary, not redundant.
- **This skill does not auto-modify config files** — the NEVER rule in SKILL.md §4 explicitly prohibits programmatic writes to `opencode.json` or any platform config. MCP config snippets are printed for the user to apply manually.
- **Task creation of <5 tasks** is available via cupt (UNKNOWN — not explicitly confirmed in the routing table, which only lists bulk create 5+ as MCP-only; single-task creation is not listed in the cupt commands reference either).

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes (from `references/troubleshooting.md`):**

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: cupt` | Not installed or PATH issue | `pipx install cupt && pipx ensurepath && source ~/.zshrc` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` or `cupt config --api-token pk_xxx` |
| `cupt done` sets wrong status | List has non-standard status schema | Run `cupt statuses <id>` first; always dry-run before writing |
| `cupt list --team X` slow (>10s) | Team filter is client-side | Combine with `--tag X` to reduce result set |
| cupt status shows 401 | Expired or revoked token | `cupt logout && cupt auth` |
| MCP: `CLICKUP_API_KEY not set` | Missing env var in config | Add to env block in platform config |
| MCP: tool not found | Wrong tool name format | Use `clickup.clickup_{tool_name}` (all lowercase, underscores) |
| Empty `cupt list` result | Queue genuinely empty (not an error) | Check tag spelling, try `--all`, verify teams via `cupt teams` |

**Key gotchas:**

- Tag filters are server-side (fast); team filters are client-side (walks all pages, 5-20+ seconds on large workspaces). Combine them to reduce client-side walking.
- The `cu` binary on some Unix systems is a serial-communication tool, not ClickUp CLI. Always use `cupt` (not `cu`).
- Each ClickUp list has its own status schema — "Done", "Complete", "Closed", "Shipped" etc. `cupt statuses <id>` discovers the actual closed-status name; never reuse a status name across lists.
- `cupt prefetch` must run before `--offline` works; offline mode uses an encrypted local cache at `~/.cupt/cache/`.

**Top 4 user questions:**

1. **When should I use cupt vs the official MCP?** — Route by operation. cupt for daily task ops (list, done, note, time, tag, context, statuses). MCP for documents, goals/OKRs, bulk create (5+), webhooks, chat, audit logs. See the Feature Reference and Routing Table.
2. **Do I need both cupt and the MCP installed?** — No. cupt alone covers all daily task management. Install the MCP only if you need documents, goals, or bulk operations.
3. **How does cupt handle varying status names across lists?** — `cupt done` auto-resolves the correct closed status per list. Use `cupt statuses <id>` to preview, then `cupt done <id> --dry-run` to verify before writing.
4. **What if `cupt list` returns an empty array?** — An empty result is valid, not an error. Check tag spelling (case-sensitive), try `--all` for wider scope, verify team names via `cupt teams`. Never fabricate tasks.

## 8. STALE FACTS

The following items in the current `README.md` are inaccurate compared to `SKILL.md` and the real files on disk:

1. **"14 operations mapped"** (README §3.1 and implied in the feature reference) — The routing table in `SKILL.md` §2 lists 17 distinct operation rows: List/filter, Task details, Mark complete, Add note, Read comments, Start/stop timer, Log time, Add tag, Remove tag, Task context, Discover statuses, Documents, Goals/OKRs, Bulk create 5+, Webhooks, Chat, Audit logs.

2. **Configuration file and server naming divergence** (README §5 "MCP Platform Configuration") — README instructs users to add the config to `.utcp_config.json` under `manual_call_templates` with server name `clickup_official`, producing tool names like `clickup_official.clickup_official_create_document`. Both `SKILL.md` §3 and `INSTALL_GUIDE.md` §4 consistently use `opencode.json` under `mcpServers` with server name `clickup`, producing tool names like `clickup.clickup_create_document`. The README's MCP invocation examples in §6 Scenario 3 and the troubleshooting table in §7 also use the `clickup_official` prefix, further compounding the discrepancy.

3. **"5 phases, 16 test files"** for `manual_testing_playbook/` (README §4 STRUCTURE tree) — The actual directory contains 10 phase subdirectories (`01--cupt-lifecycle/` through `10--mcp-bulk-and-structure/`) plus the overview playbook file, for 11 entries. The changelog's original v1.0.0.0 release notes reference "5 testing phases, 16 total test files," which describes the initial design but does not match the current directory contents.

4. **"List tasks (date/tag filters) — cupt: ✓ server-side"** (README §3.2 Feature Reference table) — This is imprecise. Per `references/cupt_commands.md` §5 and `references/troubleshooting.md` §7, only tag filters are server-side (fast). Team filters (`--team`) are client-side and can take 5-20+ seconds on large workspaces. The blanket "server-side" claim is misleading for team-based listing.