1. EXACT INVOCATION

**cupt CLI install command:**
- `pipx install cupt` (recommended, isolated) — `.opencode/skills/mcp-click-up/SKILL.md:163`, `INSTALL_GUIDE.md:54`
- `pip install --user cupt` (fallback) — `scripts/install.sh:117`
- Embedded script: `bash .opencode/skills/mcp-click-up/scripts/install.sh` — `SKILL.md:177`, `scripts/install.sh:1`
- `scripts/install.sh` supports `--check-only` and `--mcp-only` flags — `scripts/install.sh:36-37`

**Key cupt subcommands/flags (from `SKILL.md:305-345` and `references/cupt_commands.md`):**
- `cupt list [--today|--week|--overdue|--tag X|--team X|--all|--mine|--json|--offline]`
- `cupt show <id> [--notes|--json|--offline]`
- `cupt done <id> [--dry-run|--note "text"]`
- `cupt note <id> "<text>"` / `cupt notes <id>`
- `cupt time start <id>` / `cupt time stop` / `cupt time add <id> <dur>` / `cupt time status`
- `cupt tag add|remove <id> <name>`
- `cupt context <id>`
- `cupt statuses <id>` (also `cupt statuses --list <list-id>` per `feature_catalog/FEATURE_CATALOG.md:186`)
- `cupt auth` / `cupt logout` / `cupt status` / `cupt config --api-token|--workspace-id|--default-list|--show|--clear-cache`
- `cupt attach list|add|get` / `cupt teams` / `cupt summary` / `cupt prefetch`

**Code Mode MCP `call_tool_chain()` pattern:**
- Invocation: `mcp__code_mode__call_tool_chain` — `SKILL.md:4`
- Tool naming: `clickup.clickup_{tool_name}` (all lowercase, underscores) — `SKILL.md:221`, `references/mcp_tools.md:18`
- Example from `SKILL.md:222-232`:
  ```typescript
  const result = await call_tool_chain([{
    tool: "clickup.clickup_create_document",
    input: { name: "Sprint Notes", parent: { type: 4, id: "LIST_ID" }, content: "..." }
  }]);
  ```

**Auth/setup prerequisites:**
- cupt: `cupt auth` (interactive OAuth wizard) or `cupt config --api-token pk_xxx` — `SKILL.md:182-185`, `INSTALL_GUIDE.md:180-195`
- MCP: `CLICKUP_API_KEY` (`pk_` token) and `CLICKUP_TEAM_ID` (numeric workspace ID) env vars — `SKILL.md:205-206`, `INSTALL_GUIDE.md:206`
- MCP config goes in `opencode.json` under `mcpServers` — `SKILL.md:208-217`, `INSTALL_GUIDE.md:212-225`
- Python 3.8+ required for cupt — `INSTALL_GUIDE.md:89`
- Node.js 18+ and npx required for MCP — `INSTALL_GUIDE.md:114`

---

2. CAPABILITY ROSTER

**Operation-to-Tool Routing Table (from `SKILL.md:57-76`):**

| Operation | Primary Tool | Command | MCP Fallback |
|-----------|-------------|---------|-------------|
| List/filter tasks | cupt | `cupt list [--today\|--week\|--tag X]` | `clickup_search_tasks` |
| Task details | cupt | `cupt show <id> [--notes]` | `clickup_get_task` |
| Mark task complete | cupt | `cupt done <id> [--dry-run]` | `clickup_update_task` |
| Add note/comment | cupt | `cupt note <id> "<text>"` | `clickup_manage_comments` |
| Read comments | cupt | `cupt notes <id>` | `clickup_manage_comments` |
| Start/stop timer | cupt | `cupt time start <id>` / `cupt time stop` | MCP time tracking |
| Log time manually | cupt | `cupt time add <id> <dur>` | MCP time tracking |
| Add tag | cupt | `cupt tag add <id> <name>` | `clickup_add_tag_to_task` |
| Remove tag | cupt | `cupt tag remove <id> <name>` | `clickup_remove_tag_from_task` |
| Task context | cupt | `cupt context <id>` | n/a |
| Discover statuses | cupt | `cupt statuses <id>` | n/a |
| **Documents** | **MCP only** | n/a | `clickup_create_document` |
| **Goals/OKRs** | **MCP only** | n/a | goal management tools |
| **Bulk create 5+** | **MCP only** | n/a | `clickup_create_bulk_tasks` |
| **Webhooks** | **MCP only** | n/a | webhook management tools |
| **Chat** | **MCP only** | n/a | chat tools |
| **Audit logs** | **MCP only** | n/a | `clickup_get_audit_logs` |

**Agent safety invariants (from `SKILL.md:250-266`):**
- ALWAYS run `cupt statuses <id>` before `cupt done` — each list has its own status schema
- ALWAYS use `cupt done <id> --dry-run` before batch completion
- Use `--json` for all programmatic cupt reads
- Run `cupt --version && cupt status` as preflight
- Treat empty `cupt list` results as valid
- Use `cupt context <id>` before acting on a task
- NEVER hardcode status names across tasks
- NEVER use `@krodak/clickup-cli` (`cu` command) — different tool, not supported
- NEVER auto-modify `opencode.json` — print config snippets only
- NEVER fabricate tasks on empty queue
- NEVER use MCP for daily task ops — cupt handles these with dry-run safety

**MCP tool count:** 46 official tools — `references/mcp_tools.md:24`, `feature_catalog/FEATURE_CATALOG.md:25`
- HIGH priority: 8 tools (`references/mcp_tools.md:74-86`)
- MEDIUM priority: 19 tools (`references/mcp_tools.md:87-109`)
- LOW priority: 19 tools (`references/mcp_tools.md:111-133`)

---

3. KEY FILES

| Path | Role |
|------|------|
| `.opencode/skills/mcp-click-up/SKILL.md` | Runtime skill definition: 8 sections, routing pseudocode, agent invariants, quick reference (378 lines) |
| `.opencode/skills/mcp-click-up/README.md` | Human-facing overview with feature tables, quick start, FAQ (311 lines) |
| `.opencode/skills/mcp-click-up/INSTALL_GUIDE.md` | Phase-based install guide with 5 validation checkpoints (446 lines) |
| `.opencode/skills/mcp-click-up/graph-metadata.json` | Skill graph registration, intent signals, edges (127 lines) |
| `.opencode/skills/mcp-click-up/scripts/install.sh` | Embedded install: cupt via pipx/pip + MCP config snippet printer (241 lines) |
| `.opencode/skills/mcp-click-up/references/cupt_commands.md` | Full cupt CLI reference: 15 sections, all commands, agent invariants (326 lines) |
| `.opencode/skills/mcp-click-up/references/mcp_tools.md` | 46 official MCP tools: priority table, invocation patterns, error handling (310 lines) |
| `.opencode/skills/mcp-click-up/references/troubleshooting.md` | Error resolution: auth, status, team filter, MCP failures (325 lines) |
| `.opencode/skills/mcp-click-up/examples/README.md` | Example scripts overview with usage, patterns, customization (358 lines) |
| `.opencode/skills/mcp-click-up/examples/task-queue-workflow.sh` | Production script: tagged queue → inspect → dry-run → complete → handoff (214 lines) |
| `.opencode/skills/mcp-click-up/examples/time-tracking-workflow.sh` | Production script: timer start/stop/log/status lifecycle (175 lines) |
| `.opencode/skills/mcp-click-up/mcp-servers/clickup-mcp/package.json` | Official ClickUp MCP server vendoring (`@clickup/mcp-server` npm) |
| `.opencode/skills/mcp-click-up/mcp-servers/clickup-mcp/README.md` | MCP server install/config instructions (57 lines) |
| `.opencode/skills/mcp-click-up/mcp-servers/clickup-cli/requirements.txt` | cupt pip pin: `cupt>=0.7.1` |
| `.opencode/skills/mcp-click-up/mcp-servers/clickup-cli/setup.sh` | cupt install via pipx or pip (11 lines) |
| `.opencode/skills/mcp-click-up/mcp-servers/clickup-cli/README.md` | cupt CLI install instructions (49 lines) |
| `.opencode/skills/mcp-click-up/feature_catalog/FEATURE_CATALOG.md` | Full feature inventory: 96 features, 13 categories (611 lines) |
| `.opencode/skills/mcp-click-up/feature_catalog/01--cupt-authentication/` through `13--mcp-low-priority/` | 13 category subdirectories with per-feature markdown files |
| `.opencode/skills/mcp-click-up/manual_testing_playbook/manual_testing_playbook.md` | 76 test scenarios across 6 waves, 96 features (863 lines) |
| `.opencode/skills/mcp-click-up/manual_testing_playbook/01--cupt-lifecycle/` through `10--mcp-bulk-and-structure/` | 10 phase subdirectories with per-scenario test files |
| `.opencode/skills/mcp-click-up/changelog/v1.0.0.0.md` | Initial release notes, architecture decisions (105 lines) |

---

4. WORKFLOWS & OUTPUTS

**task-queue-workflow.sh** (`examples/task-queue-workflow.sh:1-214`):
- Purpose: Process a tagged ClickUp work queue end-to-end
- Flow: preflight (verify cupt installed + auth) → fetch queue (`cupt list --tag X --all --json`) → Phase 1: inspect each task (`cupt show --notes --json`, `cupt context`, `cupt statuses`) → Phase 2: dry-run all completions → Phase 3: complete with `cupt done <id> --note "Processed by AI agent"` → handoff (remove processing tag, add `needs_review` tag, leave handoff note)
- Flags: `--tag=<name>` (default `ai_ready`), `--dry-run`
- Requires: `cupt` and `jq`
- Output: Phase-segmented terminal output with summary (completed/failed counts)
- Exit codes: 0 = success or empty queue; 1 = preflight failure

**time-tracking-workflow.sh** (`examples/time-tracking-workflow.sh:1-175`):
- Purpose: Timer lifecycle management — start, status, stop, manual logging
- Subcommands: `start <task_id>`, `stop`, `log <task_id> <duration>`, `status`
- Duration formats: `1h30m`, `45m`, `2h` (validated by regex at line 110)
- Safety: detects already-running timer before start, validates duration format, orphaned timer detection on exit via `trap cleanup EXIT INT TERM`
- Output: Status messages per operation

---

5. TROUBLESHOOTING & FAQ

**Concrete failure modes (from `references/troubleshooting.md`):**

| Failure | Cause | Fix | Source |
|---------|-------|-----|--------|
| `command not found: cupt` | Not installed or PATH issue | `pipx install cupt && pipx ensurepath && source ~/.zshrc` | `troubleshooting.md:54-88` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` or `cupt config --api-token pk_xxx` | `troubleshooting.md:112-138` |
| `401 Unauthorized` | Expired/revolved token or wrong workspace | `cupt logout && cupt auth` | `troubleshooting.md:142-157` |
| `cupt done` sets wrong status | List has non-standard status schema | Run `cupt statuses <id>` first; use `--dry-run` | `troubleshooting.md:162-199` |
| `cupt list --team X` slow (>10s) | Client-side team filter | Combine with `--tag X` to narrow results server-side | `troubleshooting.md:205-229` |
| MCP: `CLICKUP_API_KEY not set` | Missing env var in config | Add `CLICKUP_API_KEY` to env block in platform config | `troubleshooting.md:235-251` |
| MCP: `tool not found` | Wrong tool name format | Use `clickup.clickup_{tool_name}` (all lowercase, underscores) | `troubleshooting.md:264-268` |
| Python version error | Python < 3.8 | Install Python 3.8+ | `troubleshooting.md:92-107` |
| PATH conflict: `cu` vs `cupt` | `cu` is UUCP or @krodak/clickup-cli | Always use `cupt` | `troubleshooting.md:272-279` |
| `cupt list` returns `[]` | Empty queue (valid) | Check tag spelling, try `--all`, verify teams | `troubleshooting.md:282-304` |

**Top user questions (from `README.md:280-294`):**

1. **When should I use cupt vs the official MCP?** Route by operation: cupt for daily task ops (list, done, note, time, tag), MCP for advanced features (documents, goals, bulk create, webhooks).
2. **Do I need both cupt and the MCP installed?** No. cupt alone covers all daily task management. Install MCP only if you need documents, goals, or bulk operations.
3. **How does cupt handle status names that vary by list?** `cupt done` automatically resolves the correct closed status. Use `cupt statuses <id>` to preview. Always `--dry-run` before batch.
4. **What if `cupt list` returns an empty array?** Empty is valid. Check tag spelling, try `--all`, verify teams via `cupt teams`. Never fabricate tasks.

---

6. STALE FACTS IN CURRENT README

**1. MCP server name inconsistency in tool naming (README.md:274 vs SKILL.md:221)**
- README.md §7 Troubleshooting says: `Use clickup_official.clickup_official_{tool_name}` (e.g. `clickup_official.clickup_official_create_task`)
- README.md §6 Scenario 3 uses: `clickup_official.clickup_official_create_document`
- SKILL.md:221 says: `clickup.clickup_{tool_name}`
- references/mcp_tools.md:18 says: `clickup.clickup_{tool_name}`
- INSTALL_GUIDE.md:77 says: `call_tool_chain("clickup.clickup_*")`
- install.sh:181 says: `clickup.clickup_{tool_name}`
- **The README uses `clickup_official.clickup_official_*` in two places; all other source-of-truth files use `clickup.clickup_*`.**

**2. MCP configuration location conflict (README.md:190 vs INSTALL_GUIDE.md:212)**
- README.md §5 says: add ClickUp to `.utcp_config.json` as a `manual_call_templates` entry named `clickup_official`
- INSTALL_GUIDE.md §4 says: add to `opencode.json` under `mcpServers` (and shows identical pattern for Claude Code `.mcp.json` and Claude Desktop config)
- SKILL.md:208-217 shows config under `opencode.json` `mcpServers`
- **README.md §5 contradicts INSTALL_GUIDE.md and SKILL.md about which config file to use.** INSTALL_GUIDE.md is the dedicated install document and should be authoritative.

**3. Feature count claim (README.md:78)**
- README.md §3.1 says: "14 operations mapped to the right tool"
- SKILL.md routing table (§2, lines 57-76) lists 16 operation rows (11 cupt + 5 MCP-only)
- **README undercounts the routing table by 2 operations.**

**4. `feature_catalog/` reference path (README.md:118)**
- README.md §3.2 says: `See feature_catalog/FEATURE_CATALOG.md for the full feature inventory with examples.`
- The actual file exists at `.opencode/skills/mcp-click-up/feature_catalog/FEATURE_CATALOG.md` — path is correct relative to skill root. However, FEATURE_CATALOG.md contains no examples; it is a catalog of features with links to per-feature files. **The "with examples" claim is unsupported.**

**5. manual_testing_playbook test file count (README.md:149)**
- README.md §4 Structure says: `manual_testing_playbook/ # 5 phases, 16 test files`
- The actual directory contains 10 phase subdirectories (01 through 10), not 5. Per `manual_testing_playbook.md:40` the total is 76 scenarios. The changelog `v1.0.0.0.md:74` also says "5 testing phases, 16 total test files" — this is the original claim, but the directory has since expanded to 10 subdirectories.
- **README says 5 phases; actual directory has 10. README says 16 test files; playbook has 76 scenarios.**

**6. Version History section (README.md:309-311)**
- README.md §Version History says: `See changelog/v1.0.0.0.md for the initial release notes and architecture decisions.`
- The file exists and contains the expected content. **This claim is accurate.**

**7. Missing cupt commands from README quick reference (README.md:62-69)**
- README.md Quick Start does not mention `cupt statuses`, `cupt context`, `cupt notes`, `cupt tag remove`, or `cupt time status` — all of which are documented in SKILL.md and used in the examples.
- **Not incorrect per se, but the Quick Start is incomplete relative to the SKILL.md cheat sheet.**

**8. `cupt list --no-tag` flag undocumented in README**
- `feature_catalog/FEATURE_CATALOG.md:110` documents `cupt list --no-tag <name>` as a feature
- `manual_testing_playbook.md:302` tests it as CU-013
- README.md does not mention `--no-tag` anywhere
- **README omits a documented cupt listing flag.**

**9. `cupt list -n <N>` and `--verbose` flags undocumented in README**
- `feature_catalog/FEATURE_CATALOG.md:129-137` documents both flags
- README.md does not mention `-n` or `--verbose`
- **README omits two documented cupt listing flags.**

**10. `cupt statuses --list <list-id>` variant undocumented in README**
- `feature_catalog/FEATURE_CATALOG.md:186` and `manual_testing_playbook.md:413` document `cupt statuses --list <list-id>` as distinct from `cupt statuses <task_id>`
- README.md only shows `cupt statuses <task_id>`
- **README omits the list-ID variant of statuses.**

**11. `cupt done --auto-note` flag undocumented in README**
- `feature_catalog/FEATURE_CATALOG.md:212` documents `cupt done <id> --auto-note` (uses local AI to draft completion note)
- README.md does not mention `--auto-note`
- **README omits a documented completion flag.**