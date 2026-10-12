---
title: "mcp-click-up: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the mcp-click-up skill. Covers all 111 features across cupt CLI and the official ClickUp MCP."
version: 1.1.0.0
---

# mcp-click-up: Manual Testing Playbook

End-to-end manual testing reference for the mcp-click-up skill. Every scenario validates a feature from the feature catalog against its defined behavior. Scenarios are organized into execution waves to support parallel and sequential orchestration.

---

**EXECUTION POLICY:** Every scenario in this playbook MUST be executed for real — not mocked, not stubbed, not classified as unautomatable. Run actual commands, inspect real outputs, call real API endpoints. Valid statuses: **PASS**, **FAIL**, or **SKIP** (with a documented blocker). "UNAUTOMATABLE" is not a valid status.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are recorded into `mcp-click-up/benchmark/reports/<dated-run-label>/`.

---

## 1. OVERVIEW

### Coverage

| Category | Features | Scenarios |
|----------|---------|---------|
| cupt Authentication & Config | 8 | 4 |
| cupt Task Listing | 14 | 1 |
| cupt Task Details | 6 | 1 |
| cupt Task Completion | 4 | 2 |
| cupt Notes & Comments | 2 | 1 |
| cupt Time Tracking | 4 | 2 |
| cupt Tag Management | 2 | 0 |
| cupt Attachments | 3 | 1 |
| cupt Workspace Discovery | 3 | 0 |
| cupt Global Flags | 4 | 0 |
| cupt Advanced Listing | (stacked, no-tag, -n, verbose) | 4 |
| cupt Offline & Cache | (prefetch, offline, clear-cache) | 2 |
| MCP Task CRUD | HIGH: create, get, update, delete, filter, search | 6 |
| MCP Comments & Smoke Test | HIGH: comments, workspace hierarchy | 2 |
| MCP Documents | create, read pages, add page, append to page | 4 |
| MCP Structure | lists, custom field values | 2 |
| Recovery and Failure | auth fail, empty queue, status errors, MCP fail | 3 |
| **TOTAL** | **111 features** | **35 scenarios** |

Scenario count verified by direct file count against the 9 scenario category folders (35 files, 35 distinct IDs). The MCP scenarios for bulk create, goals, webhooks and checklist edits were retired on 2026-10-08 because the hosted server has no tools for them. The routing-recall holdout set validates smart-router intent selection on a separate ID scheme and is not an executable manual-testing scenario, so it is excluded from this count.

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
5. For MCP scenarios: the `clickup_official` manual configured in `.utcp_config.json` (hosted server through `mcp-remote`) and a valid OAuth approval.
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
| MCP tool | `clickup_official.clickup_official_clickup_<tool>({...})` | `clickup_official.clickup_official_clickup_create_task({list_id: "X", name: "Y"})` |
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
| MCP-H006 | clickup_get_workspace_hierarchy | MCP connection smoke test |
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
| Wave 4 — MCP Read | MCP-H006, MCP-H005, MCP-H002, MCP-M016 | Yes | Requires MCP configured; independent of cupt waves |
| Wave 5 — MCP Write | MCP-H001, MCP-H009, MCP-H003, MCP-H007, MCP-M015, MCP-M017, MCP-M018, MCP-M007, MCP-L019 | Sequential | Requires Wave 4 PASS |
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

> **Feature File:** [cupt-lifecycle/install-version.md](../manual-testing-playbook/cupt-lifecycle/install-version.md)
> **Catalog:** [cupt-global-flags/version-flag.md](../feature-catalog/cupt-global-flags/version-flag.md)

---

### CU-002 | Interactive Auth

Verify `cupt auth` completes the interactive authentication flow and stores credentials.

Prompt: `"Authenticate cupt with a Personal API Token."`
Expected: `cupt status` shows workspace name after auth; exit 0.

> **Feature File:** [cupt-lifecycle/session-auth.md](../manual-testing-playbook/cupt-lifecycle/session-auth.md)
> **Catalog:** [cupt-authentication/interactive-auth.md](../feature-catalog/cupt-authentication/interactive-auth.md)

---

### CU-003 | Direct Token

Verify `cupt config --api-token pk_xxx` sets credentials non-interactively.

Prompt: `"Set cupt API token directly without interactive auth."`
Expected: `cupt status` shows workspace after token set; exit 0.

> **Feature File:** [cupt-lifecycle/session-auth.md](../manual-testing-playbook/cupt-lifecycle/session-auth.md)
> **Catalog:** [cupt-authentication/direct-token.md](../feature-catalog/cupt-authentication/direct-token.md)

---

### CU-004 | Workspace Default

Verify `cupt config --workspace-id <id>` persists across sessions.

Prompt: `"Set the default workspace ID in cupt config."`
Expected: `cupt config --show` reflects the workspace ID after restart; exit 0.

> **Feature File:** [cupt-lifecycle/config-show.md](../manual-testing-playbook/cupt-lifecycle/config-show.md)
> **Catalog:** [cupt-authentication/workspace-default.md](../feature-catalog/cupt-authentication/workspace-default.md)

---

### CU-005 | List Default

Verify `cupt config --default-list <id>` persists in config.

Prompt: `"Set the default list ID in cupt config."`
Expected: `cupt config --show` reflects the list ID; exit 0.

> **Feature File:** [cupt-lifecycle/config-show.md](../manual-testing-playbook/cupt-lifecycle/config-show.md)
> **Catalog:** [cupt-authentication/list-default.md](../feature-catalog/cupt-authentication/list-default.md)

---

### CU-006 | Show Config

Verify `cupt config --show` displays workspace, list, and masked token.

Prompt: `"Show the current cupt configuration."`
Expected: workspace ID, list ID, masked token displayed; exit 0.

> **Feature File:** [cupt-lifecycle/config-show.md](../manual-testing-playbook/cupt-lifecycle/config-show.md)
> **Catalog:** [cupt-authentication/show-config.md](../feature-catalog/cupt-authentication/show-config.md)

---

### CU-007 | Auth Status

Verify `cupt status` shows workspace name, user email, and workspace ID.

Prompt: `"Check cupt authentication status and workspace."`
Expected: workspace name + user email displayed; exit 0.

> **Feature File:** [cupt-lifecycle/status-json.md](../manual-testing-playbook/cupt-lifecycle/status-json.md)
> **Catalog:** [cupt-authentication/auth-status.md](../feature-catalog/cupt-authentication/auth-status.md)

---

### CU-008 | Logout (DESTRUCTIVE — Wave 6)

Verify `cupt logout` clears credentials and subsequent `cupt status` fails with AuthError.

Prompt: `"Log out of cupt and verify credentials are cleared."`
Expected: `cupt status` returns AuthError after logout; exit non-zero.
Recovery: `cupt auth` or `cupt config --api-token` before continuing.

> **Feature File:** [recovery-and-failure/missing-auth.md](../manual-testing-playbook/recovery-and-failure/missing-auth.md)
> **Catalog:** [cupt-authentication/logout.md](../feature-catalog/cupt-authentication/logout.md)

---

## 8. CUPT TASK LISTING (`CU-009..CU-022`)

### CU-009 | List Assigned

Verify `cupt list --json` returns a valid JSON array (empty or populated).

Prompt: `"List my assigned ClickUp tasks."`
Expected: JSON array; exit 0. `[]` is valid.

> **Feature File:** [task-operations/list-today.md](../manual-testing-playbook/task-operations/list-today.md)
> **Catalog:** [cupt-task-listing/list-assigned.md](../feature-catalog/cupt-task-listing/list-assigned.md)

---

### CU-010 | Filter Today

Verify `cupt list --today --json` returns tasks due today.

Prompt: `"List tasks due today in JSON."`
Expected: JSON array; each task `due_date` matches today or null; exit 0.

> **Feature File:** [task-operations/list-today.md](../manual-testing-playbook/task-operations/list-today.md)
> **Catalog:** [cupt-task-listing/filter-today.md](../feature-catalog/cupt-task-listing/filter-today.md)

---

### CU-011 | Filter Tag

Verify `cupt list --tag ai_ready --json` returns only tasks with that tag.

Prompt: `"List tasks tagged ai_ready in JSON."`
Expected: JSON array; all tasks contain `"name": "ai_ready"` in tags; exit 0.

> **Feature File:** [task-operations/list-today.md](../manual-testing-playbook/task-operations/list-today.md)
> **Catalog:** [cupt-task-listing/filter-tag.md](../feature-catalog/cupt-task-listing/filter-tag.md)

---

### CU-012 | JSON Output (CRITICAL PATH)

Verify `cupt list --json` output is valid JSON parseable by `jq`.

Prompt: `"Fetch task list as JSON and validate structure."`
Expected: `jq length` returns a number; exit 0.

> **Feature File:** [task-operations/list-today.md](../manual-testing-playbook/task-operations/list-today.md)
> **Catalog:** [cupt-task-listing/json-output.md](../feature-catalog/cupt-task-listing/json-output.md)

---

### CU-013 | Exclude Tag

Verify `cupt list --no-tag processed --json` excludes tasks with 'processed' tag.

Prompt: `"List tasks that do not have the 'processed' tag."`
Expected: JSON array; no task in result has tag name 'processed'; exit 0.

> **Feature File:** [cupt-advanced-listing/exclude-tag.md](../manual-testing-playbook/cupt-advanced-listing/exclude-tag.md)
> **Catalog:** [cupt-task-listing/exclude-tag.md](../feature-catalog/cupt-task-listing/exclude-tag.md)

---

### CU-014 | Cap Results

Verify `cupt list -n 3 --json` returns at most 3 tasks.

Prompt: `"List the first 3 tasks in JSON."`
Expected: JSON array with `jq length` ≤ 3; exit 0.

> **Feature File:** [cupt-advanced-listing/cap-results.md](../manual-testing-playbook/cupt-advanced-listing/cap-results.md)
> **Catalog:** [cupt-task-listing/cap-results.md](../feature-catalog/cupt-task-listing/cap-results.md)

---

### CU-015 | Verbose Output

Verify `cupt list --verbose` shows assignee and time columns.

Prompt: `"List tasks with verbose output including assignee and time columns."`
Expected: output includes 'Assignee' and 'Tracked' columns; exit 0.

> **Feature File:** [cupt-advanced-listing/verbose.md](cupt-advanced-listing/verbose.md)
> **Catalog:** [cupt-task-listing/verbose.md](../feature-catalog/cupt-task-listing/verbose.md)

---

### CU-016 | Stacked Filters

Verify `cupt list --tag A --tag B --json` requires both tags (AND logic).

Prompt: `"List tasks that have both 'sprint' and 'backend' tags."`
Expected: all returned tasks carry both tags; exit 0.

> **Feature File:** [cupt-advanced-listing/stacked-filters.md](../manual-testing-playbook/cupt-advanced-listing/stacked-filters.md)
> **Catalog:** [cupt-task-listing/stacked-filters.md](../feature-catalog/cupt-task-listing/stacked-filters.md)

---

## 9. CUPT TASK DETAILS (`CU-017..CU-022`)

### CU-017 | Show Task

Verify `cupt show TASK_ID --json` returns the task object.

Prompt: `"Show full details for task TASK_ID."`
Expected: JSON object with `id`, `name`, `status`, `assignees`; exit 0.

> **Feature File:** [task-operations/show-task.md](../manual-testing-playbook/task-operations/show-task.md)
> **Catalog:** [cupt-task-details/show-task.md](../feature-catalog/cupt-task-details/show-task.md)

---

### CU-018 | Show with Notes

Verify `cupt show TASK_ID --notes` appends comments to output.

Prompt: `"Show task details including all comments."`
Expected: output includes comment section with author and text; exit 0.

> **Feature File:** [task-operations/show-task.md](../manual-testing-playbook/task-operations/show-task.md)
> **Catalog:** [cupt-task-details/show-notes.md](../feature-catalog/cupt-task-details/show-notes.md)

---

### CU-019 | Task Context

Verify `cupt context TASK_ID` shows parent and siblings.

Prompt: `"Show parent, siblings, and subtasks for task TASK_ID."`
Expected: output sections for parent (or 'no parent'), siblings, subtasks; exit 0.

> **Feature File:** [task-operations/show-task.md](../manual-testing-playbook/task-operations/show-task.md)
> **Catalog:** [cupt-task-details/task-context.md](../feature-catalog/cupt-task-details/task-context.md)

---

### CU-020 | Prefetch + Offline

Verify `cupt prefetch` populates cache and `cupt show TASK_ID --offline` succeeds without network.

Prompt: `"Prefetch the task cache and show a task in offline mode."`
Expected: `cupt prefetch` exits 0; `cupt show TASK_ID --offline` returns task without API call; exit 0.

> **Feature File:** [cupt-offline-and-cache/prefetch-offline.md](../manual-testing-playbook/cupt-offline-and-cache/prefetch-offline.md)
> **Catalog:** [cupt-workspace/prefetch.md](../feature-catalog/cupt-workspace/prefetch.md)

---

### CU-021 | Status Schema (CRITICAL PATH)

Verify `cupt statuses TASK_ID` lists all statuses and marks the closed one.

Prompt: `"Show the status schema for task TASK_ID's list."`
Expected: list of statuses printed; closed status marked; exit 0.

> **Feature File:** [task-operations/statuses-dry-run.md](../manual-testing-playbook/task-operations/statuses-dry-run.md)
> **Catalog:** [cupt-task-details/status-schema.md](../feature-catalog/cupt-task-details/status-schema.md)

---

### CU-022 | Status by List ID

Verify `cupt statuses --list LIST_ID` returns status schema using only a list ID.

Prompt: `"Show the status schema for list LIST_ID."`
Expected: same output as `cupt statuses TASK_ID`; exit 0.

> **Feature File:** [task-operations/statuses-dry-run.md](../manual-testing-playbook/task-operations/statuses-dry-run.md)
> **Catalog:** [cupt-task-details/status-by-list.md](../feature-catalog/cupt-task-details/status-by-list.md)

---

## 10. CUPT TASK COMPLETION (`CU-023..CU-026`)

### CU-023 | Dry-Run (CRITICAL PATH)

Verify `cupt done TASK_ID --dry-run` shows resolved status without writing.

Prompt: `"Preview completing task TASK_ID without changing it."`
Expected: "DRY RUN" message with resolved status name; task status unchanged in ClickUp; exit 0.

> **Feature File:** [task-operations/statuses-dry-run.md](../manual-testing-playbook/task-operations/statuses-dry-run.md)
> **Catalog:** [cupt-task-completion/dry-run.md](../feature-catalog/cupt-task-completion/dry-run.md)

---

### CU-024 | Mark Complete

Verify `cupt done TASK_ID` closes the task using auto-resolved status.

Prompt: `"Mark task TASK_ID as complete."`
Expected: task status in ClickUp changes to closed status; exit 0.
**Use a throwaway test task.**

> **Feature File:** [task-operations/done-with-note.md](../manual-testing-playbook/task-operations/done-with-note.md)
> **Catalog:** [cupt-task-completion/mark-complete.md](../feature-catalog/cupt-task-completion/mark-complete.md)

---

### CU-025 | Complete with Note

Verify `cupt done TASK_ID --note "text"` closes and adds comment in one call.

Prompt: `"Mark task TASK_ID complete and add a note."`
Expected: task closed AND comment with provided text appears in ClickUp; exit 0.

> **Feature File:** [task-operations/done-with-note.md](../manual-testing-playbook/task-operations/done-with-note.md)
> **Catalog:** [cupt-task-completion/complete-with-note.md](../feature-catalog/cupt-task-completion/complete-with-note.md)

---

### CU-026 | Tag Removal + Add (Handoff)

Verify `cupt tag remove TASK_ID ai_ready -> cupt tag add TASK_ID needs_review -> cupt note TASK_ID "..."` executes the full agent handoff.

Prompt: `"Complete agent handoff: remove ai_ready tag, add needs_review, leave note."`
Expected: task has needs_review tag, no ai_ready tag, and new comment in ClickUp; all exit 0.

> **Feature File:** [task-operations/done-with-note.md](../manual-testing-playbook/task-operations/done-with-note.md)
> **Catalog:** [cupt-tag-management/add-tag.md](../feature-catalog/cupt-tag-management/add-tag.md)

---

## 11. CUPT NOTES, TIME, ATTACHMENTS (`CU-027..CU-034`)

### CU-027 | Add Comment

Verify `cupt note TASK_ID "text"` appends comment with correct author.

Prompt: `"Add a comment to task TASK_ID."`
Expected: comment appears in `cupt notes TASK_ID` output; exit 0.

> **Feature File:** [time-and-notes/note-and-notes.md](../manual-testing-playbook/time-and-notes/note-and-notes.md)

---

### CU-028 | List Comments

Verify `cupt notes TASK_ID` returns all comments chronologically.

Prompt: `"List all comments on task TASK_ID."`
Expected: at least one comment shown with author and timestamp; exit 0.

> **Feature File:** [time-and-notes/note-and-notes.md](../manual-testing-playbook/time-and-notes/note-and-notes.md)

---

### CU-029 | Timer Start → Status → Stop

Verify timer lifecycle: `cupt time start -> cupt time status -> cupt time stop`.

Prompt: `"Start a timer on task TASK_ID, check status, then stop it."`
Expected: start exits 0; status shows running timer; stop exits 0 and logs time; final status shows "no timer".

> **Feature File:** [time-and-notes/time-start-stop.md](../manual-testing-playbook/time-and-notes/time-start-stop.md)

---

### CU-030 | Log Time Manually

Verify `cupt time add TASK_ID 1h30m` creates a time entry.

Prompt: `"Log 1.5 hours on task TASK_ID."`
Expected: time entry appears in ClickUp task; exit 0.

> **Feature File:** [time-and-notes/time-add-manual.md](../manual-testing-playbook/time-and-notes/time-add-manual.md)

---

### CU-031 | Clear Cache

Verify `cupt config --clear-cache` removes cached data, forcing fresh API fetch.

Prompt: `"Clear the cupt local cache."`
Expected: exits 0; next `cupt list` shows fresh data from API; exit 0.

> **Feature File:** [cupt-offline-and-cache/clear-cache.md](../manual-testing-playbook/cupt-offline-and-cache/clear-cache.md)

---

### CU-032 | List Teams

Verify `cupt teams` lists workspace user-groups.

Prompt: `"List all teams in the workspace."`
Expected: one or more team names printed; exit 0.

> **Feature File:** [cupt-lifecycle/status-json.md](../manual-testing-playbook/cupt-lifecycle/status-json.md)

---

### CU-033 | List Attachments

Verify `cupt attach list TASK_ID` returns attachment metadata.

Prompt: `"List all attachments on task TASK_ID."`
Expected: file names and sizes printed (or "no attachments" for tasks without files); exit 0.

> **Feature File:** [cupt-offline-and-cache/attachments.md](cupt-offline-and-cache/attachments.md)

---

### CU-034 | Empty Queue Handling

Verify `cupt list --tag nonexistent_xyz --json` returns `[]` with exit 0.

Prompt: `"Fetch tasks with a tag that doesn't exist."`
Expected: output is `[]`; exit 0 (not an error condition).

> **Feature File:** [recovery-and-failure/empty-queue.md](../manual-testing-playbook/recovery-and-failure/empty-queue.md)

---

## 12. MCP TASK CRUD (`MCP-H001, MCP-H002, MCP-H003, MCP-H004, MCP-H005, MCP-H006, MCP-H007, MCP-H009`)

### MCP-H001 | Create Task via MCP

Verify `clickup_create_task` creates a task in LIST_ID and returns its ID.

Prompt: `"Create a task named 'MCP Playbook Test Task' in list LIST_ID."`
Expected: Response carries a task ID and no `error` field; `cupt show` confirms the name.

> **Feature File:** [mcp-task-crud/create-task.md](../manual-testing-playbook/mcp-task-crud/create-task.md)
> **Catalog:** [mcp-high-priority/create-task.md](../feature-catalog/mcp-high-priority/create-task.md)

---

### MCP-H002 | Get Task via MCP

Verify `clickup_get_task` returns the task created in MCP-H001.

Prompt: `"Get all details for task TASK_ID, including its description."`
Expected: Response carries the task ID, name and status, and no `error` field.

> **Feature File:** [mcp-task-crud/get-task.md](../manual-testing-playbook/mcp-task-crud/get-task.md)
> **Catalog:** [mcp-high-priority/get-task.md](../feature-catalog/mcp-high-priority/get-task.md)

---

### MCP-H003 | Update Task via MCP

Verify `clickup_update_task` changes the test task's status to a valid value.

Prompt: `"Update task TASK_ID status to 'in progress'."`
Expected: The status exists in `available_statuses`; the update returns no `error` field; cupt shows the new status.

> **Feature File:** [mcp-task-crud/update-task.md](../manual-testing-playbook/mcp-task-crud/update-task.md)
> **Catalog:** [mcp-high-priority/update-task.md](../feature-catalog/mcp-high-priority/update-task.md)

---

### MCP-H004 | Delete Task via MCP (DESTRUCTIVE)

Verify `clickup_delete_task` removes the throwaway task from MCP-H001.

Prompt: `"Delete test task TASK_ID permanently."`
Expected: Delete returns no `error` field; the follow-up read reports the task as not found.

**Use only the throwaway test task.**

> **Feature File:** [mcp-task-crud/delete-task.md](../manual-testing-playbook/mcp-task-crud/delete-task.md)
> **Catalog:** [mcp-high-priority/delete-task.md](../feature-catalog/mcp-high-priority/delete-task.md)

---

### MCP-H005 | Filter Tasks via MCP

Verify `clickup_filter_tasks` lists the tasks in LIST_ID, including the test task.

Prompt: `"Show the open tasks in list LIST_ID."`
Expected: Result lists tasks from LIST_ID including the test task; no `error` field.

> **Feature File:** [mcp-task-crud/filter-tasks.md](../manual-testing-playbook/mcp-task-crud/filter-tasks.md)
> **Catalog:** [mcp-high-priority/filter-tasks.md](../feature-catalog/mcp-high-priority/filter-tasks.md)

---

### MCP-H006 | Get Workspace Hierarchy (CRITICAL PATH)

Verify `clickup_get_workspace_hierarchy` answers, proving the MCP route and the OAuth sign-in work.

Prompt: `"Show the spaces in my ClickUp workspace via MCP."`
Expected: Response lists the workspace's spaces; no `error` field.

> **Feature File:** [mcp-task-crud/get-workspace-hierarchy.md](../manual-testing-playbook/mcp-task-crud/get-workspace-hierarchy.md)
> **Catalog:** [mcp-high-priority/get-workspace-hierarchy.md](../feature-catalog/mcp-high-priority/get-workspace-hierarchy.md)

---

### MCP-H007 | Task Comments via MCP

Verify `clickup_create_comment` posts a comment and `clickup_get_task_comments` reads it back.

Prompt: `"Add a comment 'MCP test comment' to task TASK_ID, then list its comments."`
Expected: The comment appears in the comment list; neither call returns an `error` field.

> **Feature File:** [mcp-task-crud/task-comments.md](../manual-testing-playbook/mcp-task-crud/task-comments.md)
> **Catalog:** [mcp-high-priority/create-comment.md](../feature-catalog/mcp-high-priority/create-comment.md)

---

### MCP-H009 | Search the Workspace via MCP

Verify `clickup_search` finds the test task by keyword.

Prompt: `"Search ClickUp for 'MCP Playbook Test Task'."`
Expected: Results include the test task; no `error` field.

> **Feature File:** [mcp-task-crud/search.md](../manual-testing-playbook/mcp-task-crud/search.md)
> **Catalog:** [mcp-high-priority/search.md](../feature-catalog/mcp-high-priority/search.md)

---

## 13. MCP DOCUMENTS (`MCP-M015, MCP-M016, MCP-M017, MCP-M018`)

### MCP-M015 | Create Document (CRITICAL PATH)

Verify `clickup_create_document` creates a document in LIST_ID and returns its ID.

Prompt: `"Create a private document named 'MCP Playbook Test Doc' in list LIST_ID."`
Expected: Response carries a document ID and no `error` field; the document is visible in the list.

> **Feature File:** [mcp-documents/create-document.md](../manual-testing-playbook/mcp-documents/create-document.md)
> **Catalog:** [mcp-medium-priority/create-document.md](../feature-catalog/mcp-medium-priority/create-document.md)

---

### MCP-M016 | Read Document Pages

Verify `clickup_list_document_pages` and `clickup_get_document_pages` read the document from MCP-M015.

Prompt: `"List the pages of document DOC_ID and read the first one as markdown."`
Expected: The page list contains PAGE_ID; the read returns its content with no `error` field.

> **Feature File:** [mcp-documents/read-document-pages.md](../manual-testing-playbook/mcp-documents/read-document-pages.md)
> **Catalog:** [mcp-low-priority/list-document-pages.md](../feature-catalog/mcp-low-priority/list-document-pages.md)

---

### MCP-M017 | Create Document Page

Verify `clickup_create_document_page` adds a markdown page to the test document.

Prompt: `"Add a page named 'Section 1' to document DOC_ID."`
Expected: The new page is listed; the heading renders as a heading in ClickUp.

> **Feature File:** [mcp-documents/document-pages.md](../manual-testing-playbook/mcp-documents/document-pages.md)
> **Catalog:** [mcp-low-priority/create-doc-page.md](../feature-catalog/mcp-low-priority/create-doc-page.md)

---

### MCP-M018 | Append to a Document Page

Verify `clickup_update_document_page` appends without overwriting the page.

Prompt: `"Append 'Appended line' to page PAGE_ID of document DOC_ID."`
Expected: The page keeps its earlier content and ends with 'Appended line'.

> **Feature File:** [mcp-documents/update-document-page.md](../manual-testing-playbook/mcp-documents/update-document-page.md)
> **Catalog:** [mcp-low-priority/update-doc-page.md](../feature-catalog/mcp-low-priority/update-doc-page.md)

---

## 14. MCP STRUCTURE (`MCP-M007, MCP-L019`)

### MCP-M007 | Create a List

Verify `clickup_create_list` creates a list in SPACE_ID.

Prompt: `"Create a list named 'MCP Playbook Test List' in space SPACE_ID."`
Expected: The list is created and resolves by name; no `error` field.

> **Feature File:** [mcp-structure/create-list.md](../manual-testing-playbook/mcp-structure/create-list.md)
> **Catalog:** [mcp-medium-priority/create-list.md](../feature-catalog/mcp-medium-priority/create-list.md)

---

### MCP-L019 | Set a Custom Field Value

Verify a custom field value set through `clickup_update_task` reads back.

Prompt: `"Set custom field FIELD_ID on task TASK_ID to 'test-value'."`
Expected: The read-back shows FIELD_ID with 'test-value'.

> **Feature File:** [mcp-structure/custom-field.md](../manual-testing-playbook/mcp-structure/custom-field.md)
> **Catalog:** [mcp-low-priority/get-custom-fields.md](../feature-catalog/mcp-low-priority/get-custom-fields.md)

---

## 15. RECOVERY AND FAILURE (`FAIL-001..FAIL-005`)

### FAIL-001 | Missing Auth Recovery

Verify that after `cupt logout`, commands fail with AuthError and recovery via `cupt auth` restores function.

Prompt: `"Simulate missing credentials and recover by re-authenticating."`
Expected: `cupt status` returns AuthError after logout; `cupt status` succeeds after `cupt auth`.

> **Feature File:** [recovery-and-failure/missing-auth.md](../manual-testing-playbook/recovery-and-failure/missing-auth.md)

---

### FAIL-002 | Empty Queue Is Valid

Verify `cupt list --tag nonexistent --json` returns `[]` with exit 0 (not an error).

Prompt: `"Fetch tasks with a tag that has no tasks."`
Expected: `[]` printed; exit 0; agent must not treat this as a failure.

> **Feature File:** [recovery-and-failure/empty-queue.md](../manual-testing-playbook/recovery-and-failure/empty-queue.md)

---

### FAIL-003 | Status Resolution Error

Verify behavior when a list has no closed status defined.

Prompt: `"Attempt cupt done on a task in a list with non-standard status configuration."`
Expected: clear error message naming the status issue; exit non-zero; `cupt statuses` still works.

> **Feature File:** [recovery-and-failure/status-error.md](../manual-testing-playbook/recovery-and-failure/status-error.md)

---

### FAIL-004 | MCP Connection Failure

Verify behavior when the OAuth approval is missing or lapsed.

Prompt: `"Call clickup_get_workspace_hierarchy after the OAuth approval has lapsed."`
Expected: MCP returns 401/auth error; meaningful error message; exit non-zero.

> **Feature File:** [recovery-and-failure/missing-auth.md](../manual-testing-playbook/recovery-and-failure/missing-auth.md)

---

### FAIL-005 | Orphaned Timer Detection

Verify `cupt time status` correctly detects and clears an orphaned timer.

Prompt: `"Detect and stop an orphaned timer left running from a previous session."`
Expected: `cupt time status` shows the running timer; `cupt time stop` stops it; final status shows "no timer".

> **Feature File:** [time-and-notes/time-start-stop.md](../manual-testing-playbook/time-and-notes/time-start-stop.md)

---

## 16. INTRA ROUTING RECALL

Routing-recall contracts validate that the SKILL.md Smart Router's `INTENT_SIGNALS`/`RESOURCE_MAP`
model routes realistic prompts to the right references. Routing-stage files may use router
vocabulary; holdout files were authored blind to obvious router keywords (their `blindExceptions`
frontmatter records any natural-language vocabulary later bound into the router); the negative file
must route to `UNKNOWN_FALLBACK` with no loaded resource.

- CU-R01: [CUPT daily routing](intra-routing-recall/cupt-daily.md)
- CU-R02: [MCP advanced routing](intra-routing-recall/mcp-advanced.md)
- CU-R03: [Install routing](intra-routing-recall/install.md)
- CU-R04: [Troubleshoot routing](intra-routing-recall/troubleshoot.md)
- CU-H01: [Blind holdout — daily task op](intra-routing-recall/holdout-daily.md)
- CU-H02: [Blind holdout — advanced feature](intra-routing-recall/holdout-advanced.md)
- CU-N01: [Negative — out of domain](intra-routing-recall/negative.md)

---

## 17. AUTOMATED TEST CROSS-REFERENCE

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

## 18. FEATURE CATALOG CROSS-REFERENCE INDEX

| ID | Feature | Category | Catalog File |
|----|---------|---------|-------------|
| CU-001 | Version check | cupt Auth | `cupt-global-flags/version-flag.md` |
| CU-002 | Interactive auth | cupt Auth | `cupt-authentication/interactive-auth.md` |
| CU-007 | Auth status | cupt Auth | `cupt-authentication/auth-status.md` |
| CU-008 | Logout | cupt Auth | `cupt-authentication/logout.md` |
| CU-009 | List assigned | cupt Listing | `cupt-task-listing/list-assigned.md` |
| CU-010 | Filter today | cupt Listing | `cupt-task-listing/filter-today.md` |
| CU-011 | Filter tag | cupt Listing | `cupt-task-listing/filter-tag.md` |
| CU-012 | JSON output | cupt Listing | `cupt-task-listing/json-output.md` |
| CU-013 | Exclude tag | cupt Listing | `cupt-task-listing/exclude-tag.md` |
| CU-014 | Cap results | cupt Listing | `cupt-task-listing/cap-results.md` |
| CU-015 | Verbose output | cupt Listing | `cupt-task-listing/verbose.md` |
| CU-016 | Stacked filters | cupt Listing | `cupt-task-listing/stacked-filters.md` |
| CU-017 | Show task | cupt Details | `cupt-task-details/show-task.md` |
| CU-019 | Task context | cupt Details | `cupt-task-details/task-context.md` |
| CU-021 | Status schema | cupt Details | `cupt-task-details/status-schema.md` |
| CU-022 | Status by list | cupt Details | `cupt-task-details/status-by-list.md` |
| CU-023 | Dry-run | cupt Completion | `cupt-task-completion/dry-run.md` |
| CU-024 | Mark complete | cupt Completion | `cupt-task-completion/mark-complete.md` |
| CU-025 | Complete+note | cupt Completion | `cupt-task-completion/complete-with-note.md` |
| CU-027 | Add comment | cupt Notes | `cupt-notes-comments/add-comment.md` |
| CU-029 | Timer lifecycle | cupt Time | `cupt-time-tracking/start-timer.md` |
| CU-030 | Log time | cupt Time | `cupt-time-tracking/log-manual.md` |
| CU-031 | Clear cache | cupt Config | `cupt-authentication/clear-cache.md` |
| CU-034 | Empty queue | Recovery | `cupt-task-listing/list-assigned.md` |
| MCP-H001 | Create Task via MCP | MCP Task CRUD | `mcp-high-priority/create-task.md` |
| MCP-H002 | Get Task via MCP | MCP Task CRUD | `mcp-high-priority/get-task.md` |
| MCP-H003 | Update Task via MCP | MCP Task CRUD | `mcp-high-priority/update-task.md` |
| MCP-H004 | Delete Task via MCP (DESTRUCTIVE) | MCP Task CRUD | `mcp-high-priority/delete-task.md` |
| MCP-H005 | Filter Tasks via MCP | MCP Task CRUD | `mcp-high-priority/filter-tasks.md` |
| MCP-H006 | Get Workspace Hierarchy (CRITICAL PATH) | MCP Task CRUD | `mcp-high-priority/get-workspace-hierarchy.md` |
| MCP-H007 | Task Comments via MCP | MCP Task CRUD | `mcp-high-priority/create-comment.md` |
| MCP-H009 | Search the Workspace via MCP | MCP Task CRUD | `mcp-high-priority/search.md` |
| MCP-M015 | Create Document (CRITICAL PATH) | MCP Documents | `mcp-medium-priority/create-document.md` |
| MCP-M016 | Read Document Pages | MCP Documents | `mcp-low-priority/list-document-pages.md` |
| MCP-M017 | Create Document Page | MCP Documents | `mcp-low-priority/create-doc-page.md` |
| MCP-M018 | Append to a Document Page | MCP Documents | `mcp-low-priority/update-doc-page.md` |
| MCP-M007 | Create a List | MCP Structure | `mcp-medium-priority/create-list.md` |
| MCP-L019 | Set a Custom Field Value | MCP Structure | `mcp-low-priority/get-custom-fields.md` |
