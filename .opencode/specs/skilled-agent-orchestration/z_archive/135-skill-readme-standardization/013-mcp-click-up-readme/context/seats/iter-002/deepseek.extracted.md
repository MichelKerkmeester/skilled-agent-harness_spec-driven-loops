## 1. EXACT INVOCATION

### cupt Install Command

```bash
bash .opencode/skills/mcp-click-up/scripts/install.sh
```

— `.opencode/skills/mcp-click-up/SKILL.md:177`, `.opencode/skills/mcp-click-up/README.md:43`, `.opencode/skills/mcp-click-up/INSTALL_GUIDE.md:25`

The script (`scripts/install.sh`) supports `--check-only` (verify state, no install) and `--mcp-only` (print MCP snippet only, skip cupt). Internally, it runs `pipx install cupt` (preferred) or falls back to `pip install --user cupt`. — `scripts/install.sh:44-55`, `scripts/install.sh:111-118`

The alternative sub-script is `bash mcp-servers/clickup-cli/setup.sh`, which simply runs `pipx install cupt` or `pip install --user cupt`. — `mcp-servers/clickup-cli/setup.sh:5-8`

### cupt Subcommands (quoted from SKILL.md §7 Quick Reference)

| Subcommand | Exact Form |
|---|---|
| list | `cupt list [--today\|--week\|--overdue\|--tag X\|--team X\|--mine\|--all] [--json] [--offline]` |
| show | `cupt show <id> [--notes] [--json] [--offline]` |
| done | `cupt done <id> [--dry-run] [--note "text"]` |
| note | `cupt note <id> "<text>"` |
| notes | `cupt notes <id>` |
| time | `cupt time start <id>` / `cupt time stop` / `cupt time add <id> <dur>` / `cupt time status` |
| tag | `cupt tag add <id> <name>` / `cupt tag remove <id> <name>` |
| context | `cupt context <id>` |
| statuses | `cupt statuses <id>` |

— `.opencode/skills/mcp-click-up/SKILL.md:303-346`
— `.opencode/skills/mcp-click-up/references/cupt_commands.md:19-326` (full reference)

### Code Mode MCP `call_tool_chain()` Pattern

Per SKILL.md §3, the invocation pattern is an **array of tool-call objects**:

```typescript
const result = await call_tool_chain([
  {
    tool: "clickup.clickup_{tool_name}",
    input: { /* ... */ }
  }
]);
```

— `.opencode/skills/mcp-click-up/SKILL.md:222-232`, `.opencode/skills/mcp-click-up/references/mcp_tools.md:141-173`

Tool naming convention: `clickup.clickup_{tool_name}` (all lowercase, underscores). — `references/mcp_tools.md:18`

Key `clickup_*` tool names (46 total, per priority):

**HIGH (8 tools):** `clickup.clickup_create_task`, `clickup.clickup_get_task`, `clickup.clickup_update_task`, `clickup.clickup_delete_task`, `clickup.clickup_search_tasks`, `clickup.clickup_get_workspace`, `clickup.clickup_manage_comments`, `clickup.clickup_create_bulk_tasks`

**MEDIUM (19 tools):** `clickup.clickup_update_bulk_tasks`, `clickup.clickup_create_subtask`, `clickup.clickup_manage_task_dependencies`, `clickup.clickup_create_task_link`, `clickup.clickup_add_task_to_multiple_lists`, `clickup.clickup_manage_task_attachments`, `clickup.clickup_manage_lists`, `clickup.clickup_manage_spaces`, `clickup.clickup_manage_folders`, `clickup.clickup_manage_custom_fields`, `clickup.clickup_add_tag_to_task`, `clickup.clickup_remove_tag_from_task`, `clickup.clickup_manage_space_tags`, `clickup.clickup_get_views`, `clickup.clickup_create_document`, `clickup.clickup_get_document`, `clickup.clickup_update_document`, `clickup.clickup_manage_time_tracking`, `clickup.clickup_manage_goals`

**LOW (19 tools):** `clickup.clickup_get_task_dependencies`, `clickup.clickup_use_task_template`, `clickup.clickup_manage_chat`, `clickup.clickup_manage_webhooks`, `clickup.clickup_get_user_groups`, `clickup.clickup_manage_guests`, `clickup.clickup_get_audit_logs`, `clickup.clickup_provide_feedback`, `clickup.clickup_create_checklist`, `clickup.clickup_update_checklist`, `clickup.clickup_delete_checklist`, `clickup.clickup_create_checklist_item`, `clickup.clickup_update_checklist_item`, `clickup.clickup_delete_checklist_item`, `clickup.clickup_get_document_pages`, `clickup.clickup_create_document_page`, `clickup.clickup_update_document_page`, `clickup.clickup_get_custom_fields`, `clickup.clickup_set_custom_field_value`

— `.opencode/skills/mcp-click-up/references/mcp_tools.md:77-133`

### Auth/Setup Prerequisites

1. **Python 3.8+** required (`python3 --version`) — `INSTALL_GUIDE.md:92-93`, `scripts/install.sh:10-11`
2. **pipx** (recommended) or pip available — `INSTALL_GUIDE.md:95-110`
3. **cupt auth** (`cupt auth` interactive wizard) OR `cupt config --api-token pk_xxxxx` (direct token) — `SKILL.md:181-185`, `INSTALL_GUIDE.md:180-196`
4. **For MCP:** Node.js 18+/npx, `CLICKUP_API_KEY=pk_xxx`, `CLICKUP_TEAM_ID=<numeric>` configured in platform MCP config — `INSTALL_GUIDE.md:114-120`, `references/mcp_tools.md:35-40`

---

## 2. CAPABILITY ROSTER

### Operation-Routing Table

From `SKILL.md:57-75` (Operation-to-Tool Routing Table):

| Operation | Primary Tool | Command | MCP Fallback |
|---|---|---|---|
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

### Agent Safety Invariants

**ALWAYS rules** (`SKILL.md:251-257`):
1. `cupt statuses <id>` before any `cupt done` call
2. `cupt done <id> --dry-run` before batch completion
3. `--json` flag for all cupt read commands when processing programmatically
4. `cupt --version && cupt status` as preflight before starting a workflow session
5. Treat empty `cupt list` results as valid
6. `cupt context <id>` before acting on a task

**NEVER rules** (`SKILL.md:259-266`):
1. Never hardcode status names across tasks
2. Never run `cupt done` on multiple tasks without per-task dry-run first
3. Never use `@krodak/clickup-cli` (`cu` command)
4. Never auto-modify `opencode.json` — print MCP config snippets for user to apply
5. Never fabricate tasks for an empty queue
6. Never use the MCP for daily task ops

### Full Command/Tool List

**cupt** — 50 features across 10 command areas (auth/status, task listing, task details, task completion, notes/comments, time tracking, tags, attachments, workspace, global flags). Full reference: `references/cupt_commands.md:1-326`. — `feature_catalog/FEATURE_CATALOG.md:17`

**Official ClickUp MCP** — 46 tools: 8 HIGH, 19 MEDIUM, 19 LOW priority. Full reference: `references/mcp_tools.md:74-133`. — `feature_catalog/FEATURE_CATALOG.md:18`

**Total: 96 catalog entries.** — `feature_catalog/FEATURE_CATALOG.md:25`

---

## 3. KEY FILES

| Path | One-Line Role |
|---|---|
| `SKILL.md` | Runtime skill definition: routing pseudocode, agent invariants, quick-reference cheat sheet (8 sections) |
| `README.md` | Human-facing overview with feature tables, FAQ, structure diagram |
| `INSTALL_GUIDE.md` | Phase-based install guide with 5 validation checkpoints and AI-first install block |
| `graph-metadata.json` | Skill-graph registration: edges, intent signals, derived trigger_phrases, entities |
| `references/cupt_commands.md` | Complete cupt command reference (15 sections): all subcommands, `--json` variants, agent invariants with code examples |
| `references/mcp_tools.md` | 46 official MCP tools reference: HIGH/MEDIUM/LOW priority table, `call_tool_chain()` invocation patterns, error handling |
| `references/troubleshooting.md` | Diagnostic guide: installation, auth (401), status resolution, team-filter performance, MCP connection, PATH conflicts (cu vs cupt), empty results |
| `scripts/install.sh` | Embedded install script: Python check, cupt install via pipx/pip, MCP config snippet print (never writes config files), `--check-only`/`--mcp-only` flags |
| `mcp-servers/clickup-cli/requirements.txt` | cupt pip pin: `cupt>=0.7.1` |
| `mcp-servers/clickup-cli/setup.sh` | Minimal cupt install via pipx (preferred) or pip (fallback) |
| `mcp-servers/clickup-cli/README.md` | cupt sub-directory readme with install + auth instructions |
| `mcp-servers/clickup-mcp/package.json` | Vendor config: depends on `@clickup/mcp-server` (npm), `npm install` to vendor locally |
| `mcp-servers/clickup-mcp/README.md` | MCP sub-directory readme with platform-config snippet (uses server key `clickup_official`) |
| `examples/README.md` | Example-scripts orientation: prerequisites, usage, customization tips, troubleshooting |
| `examples/task-queue-workflow.sh` | Production script: tagged queue → preflight → inspect → dry-run → complete → handoff (214 lines) |
| `examples/time-tracking-workflow.sh` | Production script: `start`/`stop`/`log`/`status` subcommands with duration validation (175 lines) |
| `feature_catalog/FEATURE_CATALOG.md` | Root catalog: 96 features indexed (50 cupt + 46 MCP), 13 subcategory directories |
| `feature_catalog/` (13 subdirs) | Per-feature markdown files: `01--cupt-authentication/` through `13--mcp-low-priority/` |
| `changelog/v1.0.0.0.md` | Initial release notes: architecture decisions, known limitations (2026-05-31) |
| `manual_testing_playbook/manual_testing_playbook.md` | Testing-playbook index with 10 phase directories |
| `manual_testing_playbook/` (10 subdirs) | Phase test files: `01--cupt-lifecycle/` through `10--mcp-bulk-and-structure/` |

---

## 4. WORKFLOWS & OUTPUTS

### `examples/task-queue-workflow.sh`

**File:** `.opencode/skills/mcp-click-up/examples/task-queue-workflow.sh` (214 lines)

**Usage:**
```bash
bash examples/task-queue-workflow.sh                    # Default tag: ai_ready
bash examples/task-queue-workflow.sh --tag sprint_ready # Custom tag
bash examples/task-queue-workflow.sh --dry-run          # Preview only
```

— `examples/README.md:75-87`

**Phases:**
1. **Preflight** — `require_cmd cupt`, `require_cmd jq`, verifies `cupt status` succeeds. Exits code 1 on failure.
2. **Fetch** — `cupt list --tag $PROCESSING_TAG --all --json`, exits code 0 with diagnostic suggestions if queue empty.
3. **Phase 1: Inspect** — For each task: `cupt show <id> --notes --json` → `cupt context <id>` → `cupt statuses <id>`. Writes task detail to `/tmp/cupt_task_detail.json`.
4. **Phase 2: Dry-run all** — `cupt done <id> --dry-run` for every task in batch.
5. **Phase 3: Complete & Handoff** — `cupt done <id> --note "Processed by AI agent"`, then `cupt tag remove <id> <PROCESSING_TAG>` + `cupt tag add <id> needs_review` + `cupt note <id> "Handoff complete..."`.

— `examples/task-queue-workflow.sh:47-212`

**Output:** Structured CLI output with `[task-queue] →/✓/⚠/✗` prefix, start/end banners, summary line (Completed: N | Failed: M), exit codes 0 (success/empty) or 1 (preflight failure).

### `examples/time-tracking-workflow.sh`

**File:** `.opencode/skills/mcp-click-up/examples/time-tracking-workflow.sh` (175 lines)

**Subcommands:**
| Subcommand | Args | Description |
|---|---|---|
| `start` | `TASK_ID` | Starts timer; fails if one already running |
| `stop` | — | Stops current timer, logs elapsed time automatically |
| `log` | `TASK_ID DURATION` | Logs time retroactively (`1h30m`, `45m`, `2h`) |
| `status` | — | Shows running timer or "no timer running" |

— `examples/time-tracking-workflow.sh:25-40`, `examples/README.md:155-160`

**Duration validation:** `^[0-9]+h([0-9]+m)?$|^[0-9]+m$` — `examples/time-tracking-workflow.sh:110`

**Safety:** `trap cleanup EXIT INT TERM` — detects orphaned timers on abnormal exit. — `examples/time-tracking-workflow.sh:9-16`

---

## 5. TROUBLESHOOTING & FAQ

### Concrete Failure Modes (cited to `references/troubleshooting.md`)

1. **cupt not installed** (`command not found: cupt`) — §4: Check PATH (`which cupt`, `echo $PATH`), install via `pipx install cupt && pipx ensurepath` or `pip install --user cupt`.
2. **Auth missing/expired** (`AuthError: No credentials found`, 401) — §5: `cupt config --api-token pk_xxx` or `cupt logout && cupt auth`. Token always starts with `pk_`.
3. **Wrong status on completion** — §6: Root cause is hardcoded status names. Prevention: `cupt statuses <id>` then `cupt done <id> --dry-run`. Recovery: MCP `clickup.clickup_update_task` to reopen.
4. **Team filter slow** (`cupt list --team X` >10s) — §7: Team filter is client-side (walks all pages). Combine with `--tag` for server-side pre-filtering.
5. **MCP connection failure** (`CLICKUP_API_KEY not set`, `tool not found`) — §8: Verify API key in platform config (`opencode.json`, `.mcp.json`, or `claude_desktop_config.json`), restart AI client. Tool format: `clickup.clickup_{tool_name}`.
6. **PATH conflict (`cu` vs `cupt`)** — §9: System `cu` command (UUCP) or `@krodak/clickup-cli` `cu` are **not** cupt. Always use `cupt`.
7. **Empty queue** — §10: `cupt list` returning `[]` is valid. Before escalating: check tag spelling, try `--all`, verify via `cupt teams`.

### FAQ (5 most likely user questions, grounded)

**Q1: When should I use cupt vs the official MCP?**
Route by operation: cupt for daily task ops (list, done, note, time, tag), MCP for documents, goals, bulk create (5+), webhooks. See routing table in `SKILL.md:57-75`. cupt-only features: `--dry-run`, offline mode, status schema auto-discovery, task context. MCP-only: documents, goals, bulk tasks, webhooks, chat, audit logs.

**Q2: Do I need both cupt and the MCP installed?**
cupt alone covers all daily task management. MCP is only needed for documents, goals, bulk operations, webhooks. — `README.md:285-286`

**Q3: How does `cupt done` handle varying status names across lists?**
`cupt done` auto-resolves the correct closed status for each task's list. However, the **invariant** is always run `cupt statuses <id>` first to inspect the schema, then `cupt done <id> --dry-run` to verify before committing. — `SKILL.md:252-253`, `references/cupt_commands.md:133-135`

**Q4: What if `cupt list` returns empty?**
An empty `[]` result is valid — not an error. Check tag spelling, try `--all`, verify team names via `cupt teams`. Never fabricate tasks. — `SKILL.md:256`, `references/troubleshooting.md:284-304`

**Q5: Why is `cupt list --team X` slow?**
Team filters run client-side — cupt fetches all tasks then filters. Combine with `--tag X` (server-side) to reduce the result set. For large-scale searches, the MCP supports server-side team filtering. — `references/troubleshooting.md:203-230`, `references/cupt_commands.md:107-110`

---

## 6. STALE FACTS IN CURRENT README

The following claims in `.opencode/skills/mcp-click-up/README.md` disagree with `SKILL.md`, `INSTALL_GUIDE.md`, or the real file structure:

### 1. MCP platform-config location (lines 190-211)
**README claims:** MCP config goes in `.utcp_config.json` as a `manual_call_templates` entry named `clickup_official`, and explicitly states "**not to `opencode.json`** — that file only registers `code_mode`."

**Reality:**
- `SKILL.md:207-217` — says "add to `opencode.json` mcpServers" with the server key `"clickup"`.
- `INSTALL_GUIDE.md:211-257` — lists three platform configs: `opencode.json`, `.mcp.json`, `claude_desktop_config.json`. All use `"clickup"` as the server key. `.utcp_config.json` is never mentioned.
- `scripts/install.sh:169-178` — prints snippet targeting `opencode.json`.
- `references/mcp_tools.md:36` — says "platform config (opencode.json, .mcp.json, or claude_desktop_config.json)".

The `.utcp_config.json` / `manual_call_templates` / `clickup_official` structure in the README has no counterpart in any other skill file.

### 2. MCP tool naming prefix (line 274)
**README claims:** Tool format is `clickup_official.clickup_official_{tool_name}` (also used in Scenario 3, line 252).

**Reality:**
- `SKILL.md:293` — `clickup.clickup_{tool_name}`.
- `references/mcp_tools.md:18` — "Tool naming: `clickup.clickup_{tool_name}` (all lowercase, underscores)."
- `INSTALL_GUIDE.md:391` — "Use `clickup.clickup_{tool_name}` (all lowercase, underscores)."
- `references/troubleshooting.md:268` — "All tools must be in format `clickup.clickup_{tool_name}`."
- `scripts/install.sh:181` — "Tools are named: `clickup.clickup_{tool_name}`."

Every authoritative file uses `clickup.clickup_`. The README's `clickup_official.clickup_official_` prefix is found nowhere else.

### 3. MCP server config key name (line 197)
**README claims:** Server key is `"clickup_official"` in the MCP config snippet.

**Reality:**
- `SKILL.md:209-216` — uses `"clickup"` as the server key.
- `INSTALL_GUIDE.md:214-224` — uses `"clickup"` for all three platforms (OpenCode, Claude Code, Claude Desktop).

(Note: `mcp-servers/clickup-mcp/README.md:45` also uses `"clickup_official"`, so the README is not alone — but it conflicts with SKILL.md and INSTALL_GUIDE.md.)

### 4. `call_tool_chain()` invocation pattern in Scenario 3 (lines 249-261)
**README claims:** `call_tool_chain({ code: '...' })` — passes a single object with inline TypeScript `code` property referencing tools via `clickup_official.clickup_official_*`.

**Reality:**
- `SKILL.md:222-232` — `call_tool_chain([{ tool: "clickup.clickup_...", input: {...} }])` — an **array** of tool-call objects.
- `references/mcp_tools.md:143-172` — consistently uses the array pattern.
- `INSTALL_GUIDE.md:303-308` — uses the array pattern for MCP verification.

The `{ code: '...' }` form is an alternate Code Mode invocation (executing raw TypeScript) that is never shown in any SKILL.md or reference file. The array form is the canonical approach documented in all reference and install files.

### 5. manual_testing_playbook phase count (line 149)
**README claims:** "5 phases, 16 test files."

**Reality:** The directory `manual_testing_playbook/` contains **10** phase subdirectories:
```
01--cupt-lifecycle/
02--task-operations/
03--time-and-notes/
04--mcp-advanced/
05--recovery-and-failure/
06--cupt-advanced-listing/
07--cupt-offline-and-cache/
08--mcp-task-crud/
09--mcp-documents-goals/
10--mcp-bulk-and-structure/
```
(The changelog `changelog/v1.0.0.0.md:74` also says "5 testing phases, 16 total test files", indicating both documents were written against an earlier state of the directory.)

### 6. `call_tool_chain` tool name in allowed-tools frontmatter
**README description** (not frontmatter) does not list allowed tools, but `SKILL.md:4` registers `mcp__code_mode__call_tool_chain` as the allowed tool. The README's Scenario 3 uses bare `call_tool_chain()` — the actual tool name used by the runtime is `mcp__code_mode__call_tool_chain` (with the `mcp__code_mode__` prefix as shown in `SKILL.md:293`). This is a minor naming mismatch in the README's code examples vs. the runtime's registered tool name.