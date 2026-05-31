---
title: "mcp-click-up: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the mcp-click-up skill. Covers all 96 features across cupt CLI and the official ClickUp MCP."
---

# mcp-click-up: Manual Testing Playbook

End-to-end manual testing reference for the mcp-click-up skill. Every scenario validates a feature from the feature catalog against its defined behavior. Scenarios are organized into execution waves to support parallel and sequential orchestration.

---

**EXECUTION POLICY:** Every scenario in this playbook MUST be executed for real — not mocked, not stubbed, not classified as unautomatable. Run actual commands, inspect real outputs, call real API endpoints. Valid statuses: **PASS**, **FAIL**, or **SKIP** (with a documented blocker). "UNAUTOMATABLE" is not a valid status.

---

## 1. OVERVIEW

### Coverage

| Category | Features | Scenarios |
|----------|---------|---------|
| cupt Authentication & Config | 8 | 8 |
| cupt Task Listing | 14 | 10 |
| cupt Task Details | 6 | 6 |
| cupt Task Completion | 4 | 4 |
| cupt Notes & Comments | 2 | 2 |
| cupt Time Tracking | 4 | 4 |
| cupt Tag Management | 2 | 2 |
| cupt Attachments | 3 | 2 |
| cupt Workspace Discovery | 3 | 3 |
| cupt Global Flags | 4 | 3 |
| cupt Advanced Listing | (stacked, no-tag, -n, verbose) | 4 |
| cupt Offline & Cache | (prefetch, offline, clear-cache) | 3 |
| MCP Task CRUD | HIGH: create, get, update, delete, search | 5 |
| MCP Bulk & Comments | HIGH: bulk, comments, workspace | 3 |
| MCP Documents | MEDIUM: create, get, update, pages | 4 |
| MCP Goals & Structure | MEDIUM: goals, lists, spaces, folders | 4 |
| MCP Webhooks & Checklists | LOW: webhooks, checklists | 4 |
| Recovery and Failure | auth fail, empty queue, status errors, MCP fail | 5 |
| **TOTAL** | **96 features** | **76 scenarios** |

### Realistic Test Model

An operator reads: "show today's tagged task queue and complete one task." The skill routes this to cupt. The orchestrator calls:

1. `cupt list --today --tag ai_ready --json` — fetches the queue
2. `cupt statuses TASK_ID` — discovers the closed status for the list
3. `cupt done TASK_ID --dry-run` — previews completion
4. `cupt done TASK_ID --note "processed"` — completes with note

A scenario PASSES only when both the **execution process** (correct commands called, correct flags used) and the **user-visible outcome** (task is closed, note appears in ClickUp) are verified.

---

## 2. GLOBAL PRECONDITIONS

All scenarios share these preconditions. Verify before starting any wave.

1. Working directory is the project root (`pwd` shows the repo root).
2. cupt v0.7.1+ installed: `cupt --version` prints `cupt X.Y.Z`.
3. cupt authenticated: `cupt status` shows workspace name and user.
4. A ClickUp workspace is available with at least one list and one task.
5. For MCP scenarios: `clickup` server configured in platform config with valid `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`.
6. For MCP scenarios: AI client (OpenCode / Claude Code) restarted after last config change.
7. Internet access to `api.clickup.com`.
8. **Destructive tests** (delete task, logout): run only against throwaway test tasks and a test workspace, never against production data.
9. **Timer tests**: confirm `cupt time status` shows "no timer running" before starting timer scenarios.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Each scenario MUST capture:

1. Full command transcript with exit codes (copy terminal output).
2. For MCP scenarios: the Code Mode tool call and return value.
3. User-visible outcome (screenshot or description of what the user sees in ClickUp).
4. Failure triage notes if the scenario fails.
5. Cleanup confirmation for destructive scenarios (task deleted, timer stopped, logged out).

---

## 4. DETERMINISTIC COMMAND NOTATION

| Type | Notation | Example |
|------|---------|---------|
| cupt CLI | `cupt <subcommand> [args]` | `cupt list --today --json` |
| MCP tool | `clickup.clickup_<tool>({...})` | `clickup.clickup_create_task({list_id: "X", name: "Y"})` |
| Bash | `bash: <command>` | `bash: jq length <<< "$RESULT"` |
| Sequential | `->` separator | `cupt statuses ID -> cupt done ID --dry-run -> cupt done ID` |
| Expected output | `# → expected` | `cupt --version  # → cupt 0.7.1` |

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance

A scenario is **PASS** when:
- All preconditions were verified before execution.
- Every command in the sequence ran and produced the expected output.
- All expected signals were observed.
- The user-visible outcome matches the defined desired outcome.
- No contradictory evidence exists.

A scenario is **FAIL** when any of the above conditions is not met.

### Critical-Path Scenarios (BLOCK RELEASE if FAIL)

| ID | Scenario | Why Critical |
|----|----------|-------------|
| CU-001 | cupt version check | Nothing else works without a functioning install |
| CU-007 | cupt status (auth) | All cupt commands require authentication |
| CU-012 | cupt list --json | Primary agent operation — queue fetch |
| CU-021 | cupt statuses (schema discovery) | Required before any completion — agent safety |
| CU-022 | cupt done --dry-run | Safety gate for task completion |
| MCP-H006 | clickup_get_workspace | MCP connection smoke test |
| MCP-M015 | clickup_create_document | Primary MCP-only feature |

### Feature Verdict

A **feature PASSES** when all scenarios mapped to it are PASS.
A **release is ready** when all critical-path scenarios are PASS and no P0 features are FAIL.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Execution Waves

| Wave | Scenarios | Parallelizable | Constraint |
|------|----------|--------------|-----------|
| Wave 1 — Install & Auth | CU-001, CU-002, CU-007, CU-010, CU-011 | Yes | Must complete before all other waves |
| Wave 2 — Read-Only cupt | CU-012–CU-020, CU-028, CU-029 | Yes (no writes) | Requires Wave 1 PASS |
| Wave 3 — Write cupt | CU-021–CU-027, CU-030–CU-034 | Sequential | Use dry-run before each write; requires Wave 2 PASS |
| Wave 4 — MCP Read | MCP-H005, MCP-H006, MCP-H002, MCP-M016, MCP-M014 | Yes | Requires MCP configured; independent of cupt waves |
| Wave 5 — MCP Write | MCP-H001, MCP-H007, MCP-H008, MCP-M015, MCP-M019 | Sequential | Requires Wave 4 PASS |
| Wave 6 — Destructive | CU-008 (logout), MCP-H004 (delete), failure scenarios | Sequential, last | Run last; against throwaway tasks only |

### What Belongs in Per-Feature Files

Per-feature files (in phase directories) contain:
- The 9-column execution table with exact prompts and commands
- Step-by-step execution sequence
- Failure triage with root causes
- Source file references linking back to the feature catalog

The root playbook (this file) provides: global rules, scenario summaries, wave planning, and cross-references.

---

## 7. CUPT AUTHENTICATION & CONFIGURATION (`CU-001..CU-008`)

### CU-001 | cupt Version Check

Verify `cupt --version` returns a semver-like version string and exits 0.

Prompt: `"Confirm cupt is installed and report its version."`
Expected: version string printed; exit 0.

> **Feature File:** [01--cupt-lifecycle/001-install-version.md](01--cupt-lifecycle/001-install-version.md)
> **Catalog:** [01--cupt-authentication/04-version-flag.md](../feature_catalog/10--cupt-global-flags/04-version-flag.md)

---

### CU-002 | Interactive Auth

Verify `cupt auth` completes the interactive authentication flow and stores credentials.

Prompt: `"Authenticate cupt with a Personal API Token."`
Expected: `cupt status` shows workspace name after auth; exit 0.

> **Feature File:** [01--cupt-lifecycle/002-session-auth.md](01--cupt-lifecycle/002-session-auth.md)
> **Catalog:** [01--cupt-authentication/01-interactive-auth.md](../feature_catalog/01--cupt-authentication/01-interactive-auth.md)

---

### CU-003 | Direct Token

Verify `cupt config --api-token pk_xxx` sets credentials non-interactively.

Prompt: `"Set cupt API token directly without interactive auth."`
Expected: `cupt status` shows workspace after token set; exit 0.

> **Feature File:** [01--cupt-lifecycle/002-session-auth.md](01--cupt-lifecycle/002-session-auth.md)
> **Catalog:** [01--cupt-authentication/02-direct-token.md](../feature_catalog/01--cupt-authentication/02-direct-token.md)

---

### CU-004 | Workspace Default

Verify `cupt config --workspace-id <id>` persists across sessions.

Prompt: `"Set the default workspace ID in cupt config."`
Expected: `cupt config --show` reflects the workspace ID after restart; exit 0.

> **Feature File:** [01--cupt-lifecycle/004-config-show.md](01--cupt-lifecycle/004-config-show.md)
> **Catalog:** [01--cupt-authentication/03-workspace-default.md](../feature_catalog/01--cupt-authentication/03-workspace-default.md)

---

### CU-005 | List Default

Verify `cupt config --default-list <id>` persists in config.

Prompt: `"Set the default list ID in cupt config."`
Expected: `cupt config --show` reflects the list ID; exit 0.

> **Feature File:** [01--cupt-lifecycle/004-config-show.md](01--cupt-lifecycle/004-config-show.md)
> **Catalog:** [01--cupt-authentication/04-list-default.md](../feature_catalog/01--cupt-authentication/04-list-default.md)

---

### CU-006 | Show Config

Verify `cupt config --show` displays workspace, list, and masked token.

Prompt: `"Show the current cupt configuration."`
Expected: workspace ID, list ID, masked token displayed; exit 0.

> **Feature File:** [01--cupt-lifecycle/004-config-show.md](01--cupt-lifecycle/004-config-show.md)
> **Catalog:** [01--cupt-authentication/05-show-config.md](../feature_catalog/01--cupt-authentication/05-show-config.md)

---

### CU-007 | Auth Status

Verify `cupt status` shows workspace name, user email, and workspace ID.

Prompt: `"Check cupt authentication status and workspace."`
Expected: workspace name + user email displayed; exit 0.

> **Feature File:** [01--cupt-lifecycle/003-status-json.md](01--cupt-lifecycle/003-status-json.md)
> **Catalog:** [01--cupt-authentication/07-auth-status.md](../feature_catalog/01--cupt-authentication/07-auth-status.md)

---

### CU-008 | Logout (DESTRUCTIVE — Wave 6)

Verify `cupt logout` clears credentials and subsequent `cupt status` fails with AuthError.

Prompt: `"Log out of cupt and verify credentials are cleared."`
Expected: `cupt status` returns AuthError after logout; exit non-zero.
Recovery: `cupt auth` or `cupt config --api-token` before continuing.

> **Feature File:** [05--recovery-and-failure/001-missing-auth.md](05--recovery-and-failure/001-missing-auth.md)
> **Catalog:** [01--cupt-authentication/08-logout.md](../feature_catalog/01--cupt-authentication/08-logout.md)

---

## 8. CUPT TASK LISTING (`CU-009..CU-022`)

### CU-009 | List Assigned

Verify `cupt list --json` returns a valid JSON array (empty or populated).

Prompt: `"List my assigned ClickUp tasks."`
Expected: JSON array; exit 0. `[]` is valid.

> **Feature File:** [02--task-operations/001-list-today.md](02--task-operations/001-list-today.md)
> **Catalog:** [02--cupt-task-listing/01-list-assigned.md](../feature_catalog/02--cupt-task-listing/01-list-assigned.md)

---

### CU-010 | Filter Today

Verify `cupt list --today --json` returns tasks due today.

Prompt: `"List tasks due today in JSON."`
Expected: JSON array; each task `due_date` matches today or null; exit 0.

> **Feature File:** [02--task-operations/001-list-today.md](02--task-operations/001-list-today.md)
> **Catalog:** [02--cupt-task-listing/02-filter-today.md](../feature_catalog/02--cupt-task-listing/02-filter-today.md)

---

### CU-011 | Filter Tag

Verify `cupt list --tag ai_ready --json` returns only tasks with that tag.

Prompt: `"List tasks tagged ai_ready in JSON."`
Expected: JSON array; all tasks contain `"name": "ai_ready"` in tags; exit 0.

> **Feature File:** [02--task-operations/001-list-today.md](02--task-operations/001-list-today.md)
> **Catalog:** [02--cupt-task-listing/05-filter-tag.md](../feature_catalog/02--cupt-task-listing/05-filter-tag.md)

---

### CU-012 | JSON Output (CRITICAL PATH)

Verify `cupt list --json` output is valid JSON parseable by `jq`.

Prompt: `"Fetch task list as JSON and validate structure."`
Expected: `jq length` returns a number; exit 0.

> **Feature File:** [02--task-operations/001-list-today.md](02--task-operations/001-list-today.md)
> **Catalog:** [02--cupt-task-listing/12-json-output.md](../feature_catalog/02--cupt-task-listing/12-json-output.md)

---

### CU-013 | Exclude Tag

Verify `cupt list --no-tag processed --json` excludes tasks with 'processed' tag.

Prompt: `"List tasks that do not have the 'processed' tag."`
Expected: JSON array; no task in result has tag name 'processed'; exit 0.

> **Feature File:** [06--cupt-advanced-listing/001-exclude-tag.md](06--cupt-advanced-listing/001-exclude-tag.md)
> **Catalog:** [02--cupt-task-listing/06-exclude-tag.md](../feature_catalog/02--cupt-task-listing/06-exclude-tag.md)

---

### CU-014 | Cap Results

Verify `cupt list -n 3 --json` returns at most 3 tasks.

Prompt: `"List the first 3 tasks in JSON."`
Expected: JSON array with `jq length` ≤ 3; exit 0.

> **Feature File:** [06--cupt-advanced-listing/002-cap-results.md](06--cupt-advanced-listing/002-cap-results.md)
> **Catalog:** [02--cupt-task-listing/10-cap-results.md](../feature_catalog/02--cupt-task-listing/10-cap-results.md)

---

### CU-015 | Verbose Output

Verify `cupt list --verbose` shows assignee and time columns.

Prompt: `"List tasks with verbose output including assignee and time columns."`
Expected: output includes 'Assignee' and 'Tracked' columns; exit 0.

> **Feature File:** [06--cupt-advanced-listing/003-verbose.md](06--cupt-advanced-listing/003-verbose.md)
> **Catalog:** [02--cupt-task-listing/11-verbose.md](../feature_catalog/02--cupt-task-listing/11-verbose.md)

---

### CU-016 | Stacked Filters

Verify `cupt list --tag A --tag B --json` requires both tags (AND logic).

Prompt: `"List tasks that have both 'sprint' and 'backend' tags."`
Expected: all returned tasks carry both tags; exit 0.

> **Feature File:** [06--cupt-advanced-listing/004-stacked-filters.md](06--cupt-advanced-listing/004-stacked-filters.md)
> **Catalog:** [02--cupt-task-listing/14-stacked-filters.md](../feature_catalog/02--cupt-task-listing/14-stacked-filters.md)

---

## 9. CUPT TASK DETAILS (`CU-017..CU-022`)

### CU-017 | Show Task

Verify `cupt show TASK_ID --json` returns the task object.

Prompt: `"Show full details for task TASK_ID."`
Expected: JSON object with `id`, `name`, `status`, `assignees`; exit 0.

> **Feature File:** [02--task-operations/002-show-task.md](02--task-operations/002-show-task.md)
> **Catalog:** [03--cupt-task-details/01-show-task.md](../feature_catalog/03--cupt-task-details/01-show-task.md)

---

### CU-018 | Show with Notes

Verify `cupt show TASK_ID --notes` appends comments to output.

Prompt: `"Show task details including all comments."`
Expected: output includes comment section with author and text; exit 0.

> **Feature File:** [02--task-operations/002-show-task.md](02--task-operations/002-show-task.md)
> **Catalog:** [03--cupt-task-details/02-show-notes.md](../feature_catalog/03--cupt-task-details/02-show-notes.md)

---

### CU-019 | Task Context

Verify `cupt context TASK_ID` shows parent and siblings.

Prompt: `"Show parent, siblings, and subtasks for task TASK_ID."`
Expected: output sections for parent (or 'no parent'), siblings, subtasks; exit 0.

> **Feature File:** [02--task-operations/002-show-task.md](02--task-operations/002-show-task.md)
> **Catalog:** [03--cupt-task-details/04-task-context.md](../feature_catalog/03--cupt-task-details/04-task-context.md)

---

### CU-020 | Prefetch + Offline

Verify `cupt prefetch` populates cache and `cupt show TASK_ID --offline` succeeds without network.

Prompt: `"Prefetch the task cache and show a task in offline mode."`
Expected: `cupt prefetch` exits 0; `cupt show TASK_ID --offline` returns task without API call; exit 0.

> **Feature File:** [07--cupt-offline-and-cache/001-prefetch-offline.md](07--cupt-offline-and-cache/001-prefetch-offline.md)
> **Catalog:** [09--cupt-workspace/03-prefetch.md](../feature_catalog/09--cupt-workspace/03-prefetch.md)

---

### CU-021 | Status Schema (CRITICAL PATH)

Verify `cupt statuses TASK_ID` lists all statuses and marks the closed one.

Prompt: `"Show the status schema for task TASK_ID's list."`
Expected: list of statuses printed; closed status marked; exit 0.

> **Feature File:** [02--task-operations/003-statuses-dry-run.md](02--task-operations/003-statuses-dry-run.md)
> **Catalog:** [03--cupt-task-details/05-status-schema.md](../feature_catalog/03--cupt-task-details/05-status-schema.md)

---

### CU-022 | Status by List ID

Verify `cupt statuses --list LIST_ID` returns status schema using only a list ID.

Prompt: `"Show the status schema for list LIST_ID."`
Expected: same output as `cupt statuses TASK_ID`; exit 0.

> **Feature File:** [02--task-operations/003-statuses-dry-run.md](02--task-operations/003-statuses-dry-run.md)
> **Catalog:** [03--cupt-task-details/06-status-by-list.md](../feature_catalog/03--cupt-task-details/06-status-by-list.md)

---

## 10. CUPT TASK COMPLETION (`CU-023..CU-026`)

### CU-023 | Dry-Run (CRITICAL PATH)

Verify `cupt done TASK_ID --dry-run` shows resolved status without writing.

Prompt: `"Preview completing task TASK_ID without changing it."`
Expected: "DRY RUN" message with resolved status name; task status unchanged in ClickUp; exit 0.

> **Feature File:** [02--task-operations/003-statuses-dry-run.md](02--task-operations/003-statuses-dry-run.md)
> **Catalog:** [04--cupt-task-completion/02-dry-run.md](../feature_catalog/04--cupt-task-completion/02-dry-run.md)

---

### CU-024 | Mark Complete

Verify `cupt done TASK_ID` closes the task using auto-resolved status.

Prompt: `"Mark task TASK_ID as complete."`
Expected: task status in ClickUp changes to closed status; exit 0.
**Use a throwaway test task.**

> **Feature File:** [02--task-operations/004-done-with-note.md](02--task-operations/004-done-with-note.md)
> **Catalog:** [04--cupt-task-completion/01-mark-complete.md](../feature_catalog/04--cupt-task-completion/01-mark-complete.md)

---

### CU-025 | Complete with Note

Verify `cupt done TASK_ID --note "text"` closes and adds comment in one call.

Prompt: `"Mark task TASK_ID complete and add a note."`
Expected: task closed AND comment with provided text appears in ClickUp; exit 0.

> **Feature File:** [02--task-operations/004-done-with-note.md](02--task-operations/004-done-with-note.md)
> **Catalog:** [04--cupt-task-completion/03-complete-with-note.md](../feature_catalog/04--cupt-task-completion/03-complete-with-note.md)

---

### CU-026 | Tag Removal + Add (Handoff)

Verify `cupt tag remove TASK_ID ai_ready -> cupt tag add TASK_ID needs_review -> cupt note TASK_ID "..."` executes the full agent handoff.

Prompt: `"Complete agent handoff: remove ai_ready tag, add needs_review, leave note."`
Expected: task has needs_review tag, no ai_ready tag, and new comment in ClickUp; all exit 0.

> **Feature File:** [02--task-operations/004-done-with-note.md](02--task-operations/004-done-with-note.md)
> **Catalog:** [07--cupt-tag-management/01-add-tag.md](../feature_catalog/07--cupt-tag-management/01-add-tag.md)

---

## 11. CUPT NOTES, TIME, ATTACHMENTS (`CU-027..CU-034`)

### CU-027 | Add Comment

Verify `cupt note TASK_ID "text"` appends comment with correct author.

Prompt: `"Add a comment to task TASK_ID."`
Expected: comment appears in `cupt notes TASK_ID` output; exit 0.

> **Feature File:** [03--time-and-notes/003-note-and-notes.md](03--time-and-notes/003-note-and-notes.md)

---

### CU-028 | List Comments

Verify `cupt notes TASK_ID` returns all comments chronologically.

Prompt: `"List all comments on task TASK_ID."`
Expected: at least one comment shown with author and timestamp; exit 0.

> **Feature File:** [03--time-and-notes/003-note-and-notes.md](03--time-and-notes/003-note-and-notes.md)

---

### CU-029 | Timer Start → Status → Stop

Verify timer lifecycle: `cupt time start -> cupt time status -> cupt time stop`.

Prompt: `"Start a timer on task TASK_ID, check status, then stop it."`
Expected: start exits 0; status shows running timer; stop exits 0 and logs time; final status shows "no timer".

> **Feature File:** [03--time-and-notes/001-time-start-stop.md](03--time-and-notes/001-time-start-stop.md)

---

### CU-030 | Log Time Manually

Verify `cupt time add TASK_ID 1h30m` creates a time entry.

Prompt: `"Log 1.5 hours on task TASK_ID."`
Expected: time entry appears in ClickUp task; exit 0.

> **Feature File:** [03--time-and-notes/002-time-add-manual.md](03--time-and-notes/002-time-add-manual.md)

---

### CU-031 | Clear Cache

Verify `cupt config --clear-cache` removes cached data, forcing fresh API fetch.

Prompt: `"Clear the cupt local cache."`
Expected: exits 0; next `cupt list` shows fresh data from API; exit 0.

> **Feature File:** [07--cupt-offline-and-cache/002-clear-cache.md](07--cupt-offline-and-cache/002-clear-cache.md)

---

### CU-032 | List Teams

Verify `cupt teams` lists workspace user-groups.

Prompt: `"List all teams in the workspace."`
Expected: one or more team names printed; exit 0.

> **Feature File:** [01--cupt-lifecycle/003-status-json.md](01--cupt-lifecycle/003-status-json.md)

---

### CU-033 | List Attachments

Verify `cupt attach list TASK_ID` returns attachment metadata.

Prompt: `"List all attachments on task TASK_ID."`
Expected: file names and sizes printed (or "no attachments" for tasks without files); exit 0.

> **Feature File:** [07--cupt-offline-and-cache/003-attachments.md](07--cupt-offline-and-cache/003-attachments.md)

---

### CU-034 | Empty Queue Handling

Verify `cupt list --tag nonexistent_xyz --json` returns `[]` with exit 0.

Prompt: `"Fetch tasks with a tag that doesn't exist."`
Expected: output is `[]`; exit 0 (not an error condition).

> **Feature File:** [05--recovery-and-failure/002-empty-queue.md](05--recovery-and-failure/002-empty-queue.md)

---

## 12. MCP TASK CRUD (`MCP-H001..MCP-H006`)

### MCP-H001 | Create Task

Verify `clickup_create_task` creates a task and returns a task ID.

Prompt: `"Create a task named 'Test Task' in list LIST_ID with priority 3."`
Expected: response includes `id` field; task visible in ClickUp UI; exit 0.

> **Feature File:** [08--mcp-task-crud/001-create-task.md](08--mcp-task-crud/001-create-task.md)
> **Catalog:** [11--mcp-high-priority/01-create-task.md](../feature_catalog/11--mcp-high-priority/01-create-task.md)

---

### MCP-H002 | Get Task

Verify `clickup_get_task` returns full task object for the ID created in MCP-H001.

Prompt: `"Get all details for task TASK_ID."`
Expected: JSON object with `id`, `name`, `status`, `priority`; exit 0.

> **Feature File:** [08--mcp-task-crud/002-get-task.md](08--mcp-task-crud/002-get-task.md)

---

### MCP-H003 | Update Task

Verify `clickup_update_task` changes the task status to a known value.

Prompt: `"Update task TASK_ID status to 'in progress'."`
Expected: task status in ClickUp UI is 'in progress'; exit 0.

> **Feature File:** [08--mcp-task-crud/003-update-task.md](08--mcp-task-crud/003-update-task.md)

---

### MCP-H004 | Delete Task (DESTRUCTIVE — Wave 6)

Verify `clickup_delete_task` removes the task created in MCP-H001.

Prompt: `"Delete test task TASK_ID permanently."`
Expected: subsequent `clickup_get_task` returns 404/not-found; task gone from UI.
**Use only the throwaway test task.**

> **Feature File:** [08--mcp-task-crud/004-delete-task.md](08--mcp-task-crud/004-delete-task.md)

---

### MCP-H005 | Search Tasks

Verify `clickup_search_tasks` returns tasks matching a keyword.

Prompt: `"Search for tasks containing the word 'test' in the workspace."`
Expected: JSON array with matching tasks; exit 0.

> **Feature File:** [08--mcp-task-crud/005-search-tasks.md](08--mcp-task-crud/005-search-tasks.md)

---

### MCP-H006 | Get Workspace (CRITICAL PATH)

Verify `clickup_get_workspace` returns workspace name and ID matching `CLICKUP_TEAM_ID`.

Prompt: `"Get workspace details via MCP."`
Expected: JSON with workspace name and numeric ID matching `CLICKUP_TEAM_ID` env var; exit 0.

> **Feature File:** [08--mcp-task-crud/006-get-workspace.md](08--mcp-task-crud/006-get-workspace.md)

---

### MCP-H007 | Manage Comments

Verify `clickup_manage_comments` creates a comment and lists it back.

Prompt: `"Add a comment 'MCP test comment' to task TASK_ID, then list comments."`
Expected: comment appears in list response; exit 0.

> **Feature File:** [08--mcp-task-crud/007-manage-comments.md](08--mcp-task-crud/007-manage-comments.md)

---

### MCP-H008 | Bulk Create Tasks

Verify `clickup_create_bulk_tasks` creates 3+ tasks in one call.

Prompt: `"Create three tasks at once in list LIST_ID."`
Expected: response is array of 3 task objects with IDs; all visible in ClickUp; exit 0.

> **Feature File:** [08--mcp-task-crud/008-bulk-create.md](08--mcp-task-crud/008-bulk-create.md)

---

## 13. MCP DOCUMENTS AND GOALS (`MCP-M015..MCP-M019`)

### MCP-M015 | Create Document (CRITICAL PATH)

Verify `clickup_create_document` creates a document and returns a doc ID.

Prompt: `"Create a document named 'Test Doc' in list LIST_ID with markdown content."`
Expected: response includes `doc_id`; document visible in ClickUp; exit 0.

> **Feature File:** [09--mcp-documents-goals/001-create-document.md](09--mcp-documents-goals/001-create-document.md)
> **Catalog:** [12--mcp-medium-priority/15-create-document.md](../feature_catalog/12--mcp-medium-priority/15-create-document.md)

---

### MCP-M016 | Get Document

Verify `clickup_get_document` returns the document created in MCP-M015.

Prompt: `"Get the document created in MCP-M015."`
Expected: JSON with `name`, `doc_id`; exit 0.

> **Feature File:** [09--mcp-documents-goals/002-get-document.md](09--mcp-documents-goals/002-get-document.md)

---

### MCP-M017 | Create Document Page

Verify `clickup_create_document_page` adds a page and returns a `page_id`.

Prompt: `"Add a page named 'Section 1' to the test document."`
Expected: response includes `page_id`; page visible in ClickUp document; exit 0.

> **Feature File:** [09--mcp-documents-goals/003-document-pages.md](09--mcp-documents-goals/003-document-pages.md)

---

### MCP-M019 | Create Goal

Verify `clickup_manage_goals` creates a goal and returns a `goal_id`.

Prompt: `"Create a goal named 'Q3 Test Goal' in the workspace."`
Expected: response includes `goal_id`; goal visible in ClickUp; exit 0.

> **Feature File:** [09--mcp-documents-goals/004-manage-goals.md](09--mcp-documents-goals/004-manage-goals.md)

---

## 14. MCP BULK AND STRUCTURE (`MCP-H008, MCP-M007..MCP-M009`)

### MCP-M007 | Manage Lists

Verify `clickup_manage_lists` creates a list and returns a `list_id`.

Prompt: `"Create a list named 'Test List' in space SPACE_ID."`
Expected: response includes `list_id`; list visible in ClickUp; exit 0.

> **Feature File:** [10--mcp-bulk-and-structure/001-manage-lists.md](10--mcp-bulk-and-structure/001-manage-lists.md)

---

### MCP-M004 | Create Webhook

Verify `clickup_manage_webhooks` creates a webhook.

Prompt: `"Create a webhook for taskCreated events pointing to https://example.com/webhook."`
Expected: response includes `webhook_id`; exit 0.

> **Feature File:** [10--mcp-bulk-and-structure/002-create-webhook.md](10--mcp-bulk-and-structure/002-create-webhook.md)

---

### MCP-L009 | Checklist Lifecycle

Verify checklist CRUD: create checklist → add item → mark resolved → delete.

Prompt: `"Create a checklist on task TASK_ID, add an item, check it off, then delete the checklist."`
Expected: each operation exits 0; checklist and item state matches in ClickUp UI.

> **Feature File:** [10--mcp-bulk-and-structure/003-checklist-lifecycle.md](10--mcp-bulk-and-structure/003-checklist-lifecycle.md)

---

### MCP-L019 | Set Custom Field

Verify `clickup_set_custom_field_value` sets a field and is readable back.

Prompt: `"Set custom field FIELD_ID on task TASK_ID to value 'test-value'."`
Expected: `clickup_get_task` response shows the field with the new value; exit 0.

> **Feature File:** [10--mcp-bulk-and-structure/004-custom-field.md](10--mcp-bulk-and-structure/004-custom-field.md)

---

## 15. RECOVERY AND FAILURE (`FAIL-001..FAIL-005`)

### FAIL-001 | Missing Auth Recovery

Verify that after `cupt logout`, commands fail with AuthError and recovery via `cupt auth` restores function.

Prompt: `"Simulate missing credentials and recover by re-authenticating."`
Expected: `cupt status` returns AuthError after logout; `cupt status` succeeds after `cupt auth`.

> **Feature File:** [05--recovery-and-failure/001-missing-auth.md](05--recovery-and-failure/001-missing-auth.md)

---

### FAIL-002 | Empty Queue Is Valid

Verify `cupt list --tag nonexistent --json` returns `[]` with exit 0 (not an error).

Prompt: `"Fetch tasks with a tag that has no tasks."`
Expected: `[]` printed; exit 0; agent must not treat this as a failure.

> **Feature File:** [05--recovery-and-failure/002-empty-queue.md](05--recovery-and-failure/002-empty-queue.md)

---

### FAIL-003 | Status Resolution Error

Verify behavior when a list has no closed status defined.

Prompt: `"Attempt cupt done on a task in a list with non-standard status configuration."`
Expected: clear error message naming the status issue; exit non-zero; `cupt statuses` still works.

> **Feature File:** [05--recovery-and-failure/003-status-error.md](05--recovery-and-failure/003-status-error.md)

---

### FAIL-004 | MCP Connection Failure

Verify behavior when `CLICKUP_API_KEY` is missing or wrong.

Prompt: `"Call clickup_get_workspace with an invalid API key."`
Expected: MCP returns 401/auth error; meaningful error message; exit non-zero.

> **Feature File:** [05--recovery-and-failure/001-missing-auth.md](05--recovery-and-failure/001-missing-auth.md)

---

### FAIL-005 | Orphaned Timer Detection

Verify `cupt time status` correctly detects and clears an orphaned timer.

Prompt: `"Detect and stop an orphaned timer left running from a previous session."`
Expected: `cupt time status` shows the running timer; `cupt time stop` stops it; final status shows "no timer".

> **Feature File:** [03--time-and-notes/001-time-start-stop.md](03--time-and-notes/001-time-start-stop.md)

---

## 16. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage |
|-------------|---------|
| `cupt/test_tasks.py` | Task listing, filtering, show, done, statuses |
| `cupt/test_auth.py` | Auth flow, token handling, logout |
| `cupt/test_time_tracker.py` | Timer start/stop/add/status |
| `cupt/test_notes.py` | Note add, notes list |
| `cupt/test_tags.py` | Tag add/remove |
| `cupt/test_config.py` | Config show, workspace/list defaults, clear-cache |
| `cupt/test_attachments.py` | Attach list, add, get |

All test modules are at 86% coverage per the cupt upstream repo.

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

| ID | Feature | Category | Catalog File |
|----|---------|---------|-------------|
| CU-001 | Version check | cupt Auth | `10--cupt-global-flags/04-version-flag.md` |
| CU-002 | Interactive auth | cupt Auth | `01--cupt-authentication/01-interactive-auth.md` |
| CU-007 | Auth status | cupt Auth | `01--cupt-authentication/07-auth-status.md` |
| CU-008 | Logout | cupt Auth | `01--cupt-authentication/08-logout.md` |
| CU-009 | List assigned | cupt Listing | `02--cupt-task-listing/01-list-assigned.md` |
| CU-010 | Filter today | cupt Listing | `02--cupt-task-listing/02-filter-today.md` |
| CU-011 | Filter tag | cupt Listing | `02--cupt-task-listing/05-filter-tag.md` |
| CU-012 | JSON output | cupt Listing | `02--cupt-task-listing/12-json-output.md` |
| CU-013 | Exclude tag | cupt Listing | `02--cupt-task-listing/06-exclude-tag.md` |
| CU-014 | Cap results | cupt Listing | `02--cupt-task-listing/10-cap-results.md` |
| CU-015 | Verbose output | cupt Listing | `02--cupt-task-listing/11-verbose.md` |
| CU-016 | Stacked filters | cupt Listing | `02--cupt-task-listing/14-stacked-filters.md` |
| CU-017 | Show task | cupt Details | `03--cupt-task-details/01-show-task.md` |
| CU-019 | Task context | cupt Details | `03--cupt-task-details/04-task-context.md` |
| CU-021 | Status schema | cupt Details | `03--cupt-task-details/05-status-schema.md` |
| CU-022 | Status by list | cupt Details | `03--cupt-task-details/06-status-by-list.md` |
| CU-023 | Dry-run | cupt Completion | `04--cupt-task-completion/02-dry-run.md` |
| CU-024 | Mark complete | cupt Completion | `04--cupt-task-completion/01-mark-complete.md` |
| CU-025 | Complete+note | cupt Completion | `04--cupt-task-completion/03-complete-with-note.md` |
| CU-027 | Add comment | cupt Notes | `05--cupt-notes-comments/01-add-comment.md` |
| CU-029 | Timer lifecycle | cupt Time | `06--cupt-time-tracking/01-start-timer.md` |
| CU-030 | Log time | cupt Time | `06--cupt-time-tracking/03-log-manual.md` |
| CU-031 | Clear cache | cupt Config | `01--cupt-authentication/06-clear-cache.md` |
| CU-034 | Empty queue | Recovery | `02--cupt-task-listing/01-list-assigned.md` |
| MCP-H001 | Create task | MCP HIGH | `11--mcp-high-priority/01-create-task.md` |
| MCP-H002 | Get task | MCP HIGH | `11--mcp-high-priority/02-get-task.md` |
| MCP-H003 | Update task | MCP HIGH | `11--mcp-high-priority/03-update-task.md` |
| MCP-H004 | Delete task | MCP HIGH | `11--mcp-high-priority/04-delete-task.md` |
| MCP-H005 | Search tasks | MCP HIGH | `11--mcp-high-priority/05-search-tasks.md` |
| MCP-H006 | Get workspace | MCP HIGH | `11--mcp-high-priority/06-get-workspace.md` |
| MCP-H007 | Manage comments | MCP HIGH | `11--mcp-high-priority/07-manage-comments.md` |
| MCP-H008 | Bulk create | MCP HIGH | `11--mcp-high-priority/08-create-bulk-tasks.md` |
| MCP-M015 | Create document | MCP MEDIUM | `12--mcp-medium-priority/15-create-document.md` |
| MCP-M016 | Get document | MCP MEDIUM | `12--mcp-medium-priority/16-get-document.md` |
| MCP-M019 | Manage goals | MCP MEDIUM | `12--mcp-medium-priority/19-manage-goals.md` |
| MCP-M007 | Manage lists | MCP MEDIUM | `12--mcp-medium-priority/07-manage-lists.md` |
| MCP-L009 | Checklist lifecycle | MCP LOW | `13--mcp-low-priority/09-create-checklist.md` |
| MCP-L019 | Set custom field | MCP LOW | `13--mcp-low-priority/19-set-custom-field.md` |
