Let me check the remaining directories and files referenced in the README.
Here is the factual map.

---

## 1. PURPOSE

Routes ClickUp work between the `cupt` CLI (primary, daily task operations) and the official ClickUp MCP server through Code Mode (secondary, documents, goals, bulk operations), with operation-based routing and embedded install.

## 2. PROBLEM

Managing ClickUp from an AI agent or terminal requires two fundamentally different tool surfaces: a fast CLI for repetitive daily task ops (list, complete, note, time, tag) and an MCP server for richer surfaces (documents, goals, bulk creates, webhooks, audit logs). Neither tool alone covers both — `cupt` cannot create documents or manage goals, while the MCP has no dry-run safety, no per-list status resolution, and no offline mode. Without a routing layer, agents misapply tools (e.g., using MCP for daily ops where dry-run is needed, or attempting `cupt` for document creation). The skill eliminates this by encoding which tool owns which operation, enforcing safety invariants (always `cupt statuses` before `cupt done`, always dry-run before batch), and providing a single install script that sets up both surfaces.

## 3. MODES & CAPABILITIES

- **cupt CLI (primary):** daily task ops — list, show, done, notes, time tracking, tags, attachments, context, statuses, workspace commands; supports `--json`, `--offline`, `--dry-run` on completion.
- **Official ClickUp MCP (secondary):** documents (create/read/update), goals/OKRs, bulk task creation (5+), webhooks, custom views, checklists, user groups, guests, audit logs, chat.
- **Routing rule:** operation-based, not availability-based — each ClickUp operation maps to exactly one tool per the routing table in `SKILL.md` §2.
- **Agent safety invariant 1:** `cupt statuses <id>` MUST precede every `cupt done` call — each list has its own status schema; never hardcode status names.
- **Agent safety invariant 2:** `cupt done <id> --dry-run` MUST precede every batch completion — verify resolved status before writing.
- **Agent safety invariant 3:** Official MCP only — community ClickUp MCP servers (e.g., `@taazkareem/clickup-mcp-server`) are excluded; `@krodak/clickup-cli` (`cu` command) is explicitly unsupported.

## 4. INVOCATION

**cupt CLI path:**
- Install: `pipx install cupt` or `bash .opencode/skills/mcp-click-up/scripts/install.sh`
- Authenticate: `cupt auth` (interactive wizard) or `cupt config --api-token pk_xxxxx` (direct token)
- Verify: `cupt --version && cupt status`
- Key subcommands: `cupt list`, `cupt show`, `cupt done`, `cupt note`, `cupt notes`, `cupt time start|stop|add|status`, `cupt tag add|remove`, `cupt context`, `cupt statuses`, `cupt attach`, `cupt teams`, `cupt summary`, `cupt prefetch`
- Prerequisites: Python 3.8+, pipx (recommended) or pip

**Official MCP path:**
- Prerequisites: Node.js 18+, npx, Code Mode MCP configured
- Install: `npm install` in `mcp-servers/clickup-mcp/` or via npx at runtime (`npx -y @clickup/mcp-server`)
- Auth: `CLICKUP_API_KEY` (pk_ token) and `CLICKUP_TEAM_ID` (numeric workspace ID) in env block
- Invocation: Code Mode `mcp__code_mode__call_tool_chain` with tool naming `clickup.clickup_{tool_name}` (e.g., `clickup.clickup_create_task`)
- Config goes in platform config files (opencode.json, .mcp.json, claude_desktop_config.json) — see `INSTALL_GUIDE.md` §4 for per-platform blocks
- The install script (`scripts/install.sh`) prints the MCP config snippet to stdout; it does NOT write to config files

## 5. KEY FILES

| Path | Purpose |
|------|---------|
| `SKILL.md` | Runtime routing logic, operation-to-tool table, agent invariants (ALWAYS/NEVER/ESCALATE), smart router pseudocode, cupt cheat sheet |
| `README.md` | Human-facing overview: quick start, feature tables, structure tree, configuration, usage examples, troubleshooting, FAQ |
| `INSTALL_GUIDE.md` | Phase-based install (5 phases with validation checkpoints) for cupt CLI and official MCP; platform-specific config blocks |
| `graph-metadata.json` | Skill graph registration: depends on `mcp-code-mode`, enhances `sk-code`; intent signals, domains, entities |
| `references/cupt_commands.md` | Complete cupt CLI reference: auth, listing, details, completion, notes, time, tags, attachments, workspace, global flags, agent invariants |
| `references/mcp_tools.md` | 46 official MCP tools: HIGH (8) / MEDIUM (19) / LOW (19) priority tiers, invocation patterns, document/goal/bulk examples |
| `references/troubleshooting.md` | Diagnostic guide: installation, auth, status resolution, team filter performance, MCP connection, empty results, cu vs cupt conflict |
| `scripts/install.sh` | Embedded bash script: Python version check, cupt install via pipx/pip, auth instructions, MCP config snippet to stdout. Flags: `--check-only`, `--mcp-only` |
| `examples/task-queue-workflow.sh` | Production script: tagged queue fetch → inspect → dry-run → complete → tag handoff. Flags: `--tag`, `--dry-run` |
| `examples/time-tracking-workflow.sh` | Production script: timer lifecycle (start/stop/log/status). Subcommands: `start`, `stop`, `log`, `status` |
| `examples/README.md` | Examples index: script purposes, usage, prerequisites, common patterns, customization tips, troubleshooting |
| `mcp-servers/clickup-mcp/package.json` | Vendor manifest for official `@clickup/mcp-server` npm package |
| `mcp-servers/clickup-cli/requirements.txt` | pip pin for cupt (`cupt>=0.7.1`) |
| `mcp-servers/clickup-cli/setup.sh` | cupt install via pipx/pip (alternative to `scripts/install.sh`) |
| `feature_catalog/FEATURE_CATALOG.md` | Full inventory: 96 features (50 cupt + 46 MCP), 13 categories, per-feature detail files in subdirectories |
| `manual_testing_playbook/` | 10 test phase directories + `manual_testing_playbook.md` root guide |
| `changelog/v1.0.0.0.md` | Initial release notes |

## 6. BOUNDARIES

- **Does NOT own MCP transport:** Code Mode MCP orchestration is owned by the sibling skill `mcp-code-mode`; this skill invokes MCP tools via `mcp__code_mode__call_tool_chain` but does not manage the MCP connection lifecycle.
- **Excludes community MCP servers:** `@taazkareem/clickup-mcp-server` and any other third-party ClickUp MCP servers are explicitly out of scope. Only the official `@clickup/mcp-server` is used.
- **Excludes `@krodak/clickup-cli` (`cu` command):** Different tool entirely; also conflicts with the Unix `cu` command on some systems.
- **cupt and MCP cover different operation sets:** cupt cannot create documents, manage goals, bulk-create tasks, handle webhooks, or access audit logs. MCP has no dry-run, no per-list status auto-resolution, no offline mode, and no `--json` flag control.
- **Does NOT auto-modify config files:** `scripts/install.sh` prints MCP config snippets to stdout; it never writes to `opencode.json` or other config files.
- **Does NOT handle direct ClickUp REST API calls or browser automation:** no Playwright/Puppeteer surface.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- `command not found: cupt` — cupt not installed or pipx bin dir not in PATH; fix with `pipx install cupt && pipx ensurepath && source ~/.zshrc`
- `AuthError: No credentials` / `401` — not authenticated or token expired/revoked; fix with `cupt auth` or `cupt config --api-token pk_xxx`
- `cupt done` sets wrong status — list has non-standard status schema; prevention: always `cupt statuses <id>` then `--dry-run`
- `cupt list --team X` is slow (>20s) — team filter is client-side; combine with `--tag` for server-side narrowing
- MCP `tool not found` — wrong naming format; must be `clickup.clickup_{tool_name}` (all lowercase, underscores)
- MCP connection failure — missing `CLICKUP_API_KEY` or `CLICKUP_TEAM_ID` in env block; verify in platform config and restart client
- `cu` vs `cupt` conflict — `cu` is a UUCP program or @krodak/clickup-cli; always use `cupt`

**FAQ (2–4 questions users actually ask):**
1. *When should I use cupt vs the official MCP?* — Route by operation: cupt for daily task ops (list, done, note, time, tag), MCP for advanced features (documents, goals, bulk create, webhooks).
2. *Do I need both cupt and the MCP installed?* — No. cupt alone covers all daily task management. Install MCP only if you need documents, goals, or bulk operations.
3. *How does cupt handle status names that vary by list?* — `cupt done` auto-resolves the correct closed status per list. Use `cupt statuses <id>` to preview and always `--dry-run` before batch.
4. *What if `cupt list` returns empty?* — Valid behavior, not an error. Check tag spelling (case-sensitive), try `--all`, verify team names via `cupt teams`.

## 8. STALE FACTS

1. **README §3.1 claims "14 operations mapped"** — The routing table in `SKILL.md` §2 lists 14 explicit rows, but the feature catalog documents 96 total features (50 cupt + 46 MCP). The "14" count only covers the SKILL.md routing table rows, not the full capability set. Misleading if read as total operations.

2. **README §7 MCP tool name format is wrong** — Line 274 states tool names use `clickup_official.clickup_official_{tool_name}`. The actual convention (per `SKILL.md`, `references/mcp_tools.md`, `INSTALL_GUIDE.md`, and `scripts/install.sh`) is `clickup.clickup_{tool_name}`. The README example at line 252 also uses `clickup_official.clickup_official_create_document`, contradicting every other file.

3. **README §5 MCP config guidance conflicts with INSTALL_GUIDE** — README §5 (line 190) says to add config to `.utcp_config.json` as a `manual_call_templates` entry named `clickup_official`. INSTALL_GUIDE §4 says to add it to `opencode.json` under `mcpServers` with key `clickup`. SKILL.md §3 also shows `opencode.json` with key `clickup`. The README is the outlier.

4. **README §4 structure tree claims 10 test phase directories** — README line 149 says `manual_testing_playbook/` has "5 phases, 16 test files". The actual directory contains 10 phase subdirectories (`01--cupt-lifecycle/` through `10--mcp-bulk-and-structure/`) plus `manual_testing_playbook.md`.

5. **SKILL.md version string** — SKILL.md frontmatter says `version: 1.0.0.0` (four segments). README/changelog also use `v1.0.0.0`. INSTALL_GUIDE frontmatter says `version: "1.0.0"` (three segments). Minor inconsistency.

6. **README §3.2 "Custom views" row** — README line 115 shows Custom views as MCP-only with a checkmark. The SKILL.md routing table does not include a row for custom views. The mcp_tools.md MEDIUM priority table lists `clickup.clickup_get_views` — so the feature exists but is not in the canonical routing table.