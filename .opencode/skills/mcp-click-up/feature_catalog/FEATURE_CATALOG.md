---
title: "mcp-click-up: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the mcp-click-up skill — cupt CLI (v0.7.1+) and Official ClickUp MCP (46 tools)."
---

# mcp-click-up: Feature Catalog

Complete feature inventory for both tools in the mcp-click-up skill. This catalog describes **what ships today** — not roadmap aspirations. Execution detail (exact prompts, commands, expected signals, pass/fail criteria) lives in the manual testing playbook.

---

## 1. OVERVIEW

The mcp-click-up skill routes ClickUp work between two complementary tools:

- **cupt CLI** (`pipx install cupt`) — 50 features across 10 command areas. Purpose-built for agent use: per-list status resolution, dry-run safety, offline cache, and `--json` output on every read command.
- **Official ClickUp MCP** (`@clickup/mcp-server`) — 46 tools via Code Mode `call_tool_chain()`. Covers surfaces cupt cannot reach: documents, goals, bulk creation, webhooks, and enterprise administration.

Routing is **operation-based**: each feature belongs to exactly one tool. See `../SKILL.md §2` for the routing pseudocode.

| Metric | Value |
|--------|-------|
| cupt features | 50 |
| Official MCP tools | 46 |
| Total catalog entries | 96 |
| cupt install | `pipx install cupt` |
| MCP package | `@clickup/mcp-server` (npm) |
| MCP invocation | `clickup.clickup_{tool_name}` via Code Mode |

See `../feature_catalog/FEATURE_CATALOG.md` for the agent decision guide.

---

## 2. CUPT AUTHENTICATION & CONFIGURATION

8 features covering credential setup, workspace defaults, and config management.

### Interactive auth
`cupt auth` — interactive wizard for OAuth or Personal API Token. Guides through token entry or browser-redirect OAuth flow.

See [`01--cupt-authentication/01-interactive-auth.md`](01--cupt-authentication/01-interactive-auth.md)

### Direct token
`cupt config --api-token pk_xxx` — set Personal API Token non-interactively. Token must start with `pk_`.

See [`01--cupt-authentication/02-direct-token.md`](01--cupt-authentication/02-direct-token.md)

### Workspace default
`cupt config --workspace-id <id>` — persist a default workspace ID for all subsequent commands.

See [`01--cupt-authentication/03-workspace-default.md`](01--cupt-authentication/03-workspace-default.md)

### List default
`cupt config --default-list <id>` — persist a default list ID.

See [`01--cupt-authentication/04-list-default.md`](01--cupt-authentication/04-list-default.md)

### Show config
`cupt config --show` — display workspace, default list, and masked auth state.

See [`01--cupt-authentication/05-show-config.md`](01--cupt-authentication/05-show-config.md)

### Clear cache
`cupt config --clear-cache` — remove all locally cached task data.

See [`01--cupt-authentication/06-clear-cache.md`](01--cupt-authentication/06-clear-cache.md)

### Auth status
`cupt status` — workspace name, user, and auth health check. Use as preflight before starting any agent workflow.

See [`01--cupt-authentication/07-auth-status.md`](01--cupt-authentication/07-auth-status.md)

### Logout
`cupt logout` — revoke stored credentials and clear the local cache.

See [`01--cupt-authentication/08-logout.md`](01--cupt-authentication/08-logout.md)

---

## 3. CUPT TASK LISTING & FILTERING

14 features covering all listing modes, date filters, tag/team filters, and output options.

### List assigned
`cupt list` — tasks assigned to the current user in the default workspace.

See [`02--cupt-task-listing/01-list-assigned.md`](02--cupt-task-listing/01-list-assigned.md)

### Filter today
`cupt list --today` — tasks due today only.

See [`02--cupt-task-listing/02-filter-today.md`](02--cupt-task-listing/02-filter-today.md)

### Filter week
`cupt list --week` — tasks due within the current week.

See [`02--cupt-task-listing/03-filter-week.md`](02--cupt-task-listing/03-filter-week.md)

### Filter overdue
`cupt list --overdue` — past-due tasks only.

See [`02--cupt-task-listing/04-filter-overdue.md`](02--cupt-task-listing/04-filter-overdue.md)

### Filter by tag
`cupt list --tag <name>` — server-side filter (fast). Multiple `--tag` flags use AND logic: task must carry all specified tags.

See [`02--cupt-task-listing/05-filter-tag.md`](02--cupt-task-listing/05-filter-tag.md)

### Exclude by tag
`cupt list --no-tag <name>` — exclude tasks carrying the specified tag. Useful for filtering out already-processed work.

See [`02--cupt-task-listing/06-exclude-tag.md`](02--cupt-task-listing/06-exclude-tag.md)

### Filter by team
`cupt list --team <name>` — client-side filter (5-20s on large workspaces). Multiple `--team` flags use OR logic: task may belong to any specified team.

See [`02--cupt-task-listing/07-filter-team.md`](02--cupt-task-listing/07-filter-team.md)

### All tasks
`cupt list --all` — include tasks assigned to anyone on the team, not just the current user.

See [`02--cupt-task-listing/08-all-tasks.md`](02--cupt-task-listing/08-all-tasks.md)

### Mine only
`cupt list --mine` — restrict to self-assigned tasks. Equivalent to default but explicit when combined with `--all`.

See [`02--cupt-task-listing/09-mine-only.md`](02--cupt-task-listing/09-mine-only.md)

### Cap results
`cupt list -n <N>` — limit output to N rows. Useful for large workspaces when only the first N results are needed.

See [`02--cupt-task-listing/10-cap-results.md`](02--cupt-task-listing/10-cap-results.md)

### Verbose output
`cupt list --verbose` — add extra columns: assignee, time estimate, and time tracked.

See [`02--cupt-task-listing/11-verbose.md`](02--cupt-task-listing/11-verbose.md)

### JSON output
`cupt list --json` — structured JSON array. Required for agent workflows — never parse human-readable output programmatically.

See [`02--cupt-task-listing/12-json-output.md`](02--cupt-task-listing/12-json-output.md)

### Offline listing
`cupt list --offline` — use local cache, no network call. Requires prior `cupt list` (auto-caches) or `cupt prefetch`.

See [`02--cupt-task-listing/13-offline.md`](02--cupt-task-listing/13-offline.md)

### Stacked filters
`--tag A --tag B` (AND: task has both), `--team X --team Y` (OR: task in either), combined freely with date/scope flags.

See [`02--cupt-task-listing/14-stacked-filters.md`](02--cupt-task-listing/14-stacked-filters.md)

---

## 4. CUPT TASK DETAILS

6 features covering task inspection, context, and status schema discovery.

### Show task
`cupt show <id>` — full task: name, description, status, assignees, tags, due date, custom fields.

See [`03--cupt-task-details/01-show-task.md`](03--cupt-task-details/01-show-task.md)

### Show with notes
`cupt show <id> --notes` — appends all comments below the task detail output.

See [`03--cupt-task-details/02-show-notes.md`](03--cupt-task-details/02-show-notes.md)

### Show offline
`cupt show <id> --offline` — returns cached task data without network call.

See [`03--cupt-task-details/03-show-offline.md`](03--cupt-task-details/03-show-offline.md)

### Task context
`cupt context <id>` — shows parent task, all siblings at the same level, and direct subtasks. Use before acting to avoid orphaning work.

See [`03--cupt-task-details/04-task-context.md`](03--cupt-task-details/04-task-context.md)

### Status schema by task
`cupt statuses <id>` — lists all statuses for the task's list, marking the closed status. Always run this before `cupt done`.

See [`03--cupt-task-details/05-status-schema.md`](03--cupt-task-details/05-status-schema.md)

### Status schema by list
`cupt statuses --list <list-id>` — query the status schema for a specific list without a task ID. Useful when planning batch operations.

See [`03--cupt-task-details/06-status-by-list.md`](03--cupt-task-details/06-status-by-list.md)

---

## 5. CUPT TASK COMPLETION

4 features for safely marking tasks complete with status resolution and dry-run support.

### Mark complete
`cupt done <id>` — marks task complete using the list's resolved closed status. Never requires specifying the status name.

See [`04--cupt-task-completion/01-mark-complete.md`](04--cupt-task-completion/01-mark-complete.md)

### Dry-run preview
`cupt done <id> --dry-run` — shows which status would be applied without writing. Required before any batch completion loop.

See [`04--cupt-task-completion/02-dry-run.md`](04--cupt-task-completion/02-dry-run.md)

### Complete with note
`cupt done <id> --note "<text>"` — marks complete and adds a comment in one call. Preferred for agent handoff patterns.

See [`04--cupt-task-completion/03-complete-with-note.md`](04--cupt-task-completion/03-complete-with-note.md)

### Auto-note
`cupt done <id> --auto-note` — uses local AI (if configured) to draft a completion note automatically.

See [`04--cupt-task-completion/04-auto-note.md`](04--cupt-task-completion/04-auto-note.md)

---

## 6. CUPT NOTES & COMMENTS

2 features for adding and reading task comments.

### Add comment
`cupt note <id> "<text>"` — appends a comment to the task. Used for agent handoff messages and progress notes.

See [`05--cupt-notes-comments/01-add-comment.md`](05--cupt-notes-comments/01-add-comment.md)

### List comments
`cupt notes <id>` — displays all comments on the task in chronological order with author and timestamp.

See [`05--cupt-notes-comments/02-list-comments.md`](05--cupt-notes-comments/02-list-comments.md)

---

## 7. CUPT TIME TRACKING

4 features for timer management and manual time logging.

### Start timer
`cupt time start <id>` — starts a running timer on the task. Only one timer can run at a time.

See [`06--cupt-time-tracking/01-start-timer.md`](06--cupt-time-tracking/01-start-timer.md)

### Stop timer
`cupt time stop` — stops the currently running timer and logs the elapsed time to ClickUp automatically.

See [`06--cupt-time-tracking/02-stop-timer.md`](06--cupt-time-tracking/02-stop-timer.md)

### Log manually
`cupt time add <id> <duration>` — log time retroactively without using a timer. Duration formats: `1h30m`, `45m`, `2h`, `30m`.

See [`06--cupt-time-tracking/03-log-manual.md`](06--cupt-time-tracking/03-log-manual.md)

### Timer status
`cupt time status` — shows running task name + elapsed time, or "no timer running" when idle.

See [`06--cupt-time-tracking/04-timer-status.md`](06--cupt-time-tracking/04-timer-status.md)

---

## 8. CUPT TAG MANAGEMENT

2 features for applying and removing task tags.

### Add tag
`cupt tag add <id> <name>` — applies a named tag to the task. Tag must already exist in the workspace.

See [`07--cupt-tag-management/01-add-tag.md`](07--cupt-tag-management/01-add-tag.md)

### Remove tag
`cupt tag remove <id> <name>` — removes a named tag from the task.

See [`07--cupt-tag-management/02-remove-tag.md`](07--cupt-tag-management/02-remove-tag.md)

---

## 9. CUPT ATTACHMENTS

3 features for listing, uploading, and downloading task files.

### List attachments
`cupt attach list <id>` — shows all files attached to the task with names, sizes, and upload dates.

See [`08--cupt-attachments/01-list-attachments.md`](08--cupt-attachments/01-list-attachments.md)

### Upload file
`cupt attach add <id> <file>` — uploads a local file as a task attachment.

See [`08--cupt-attachments/02-upload-file.md`](08--cupt-attachments/02-upload-file.md)

### Download file
`cupt attach get <id> <selector>` — downloads an attachment by index number or partial name match.

See [`08--cupt-attachments/03-download-file.md`](08--cupt-attachments/03-download-file.md)

---

## 10. CUPT WORKSPACE DISCOVERY

3 features for discovering workspace structure and pre-caching data.

### List teams
`cupt teams` — lists all user-groups in the workspace. ClickUp UI calls these "Teams"; the REST API calls them "groups".

See [`09--cupt-workspace/01-list-teams.md`](09--cupt-workspace/01-list-teams.md)

### Task summary
`cupt summary` — generates a workspace-wide overview of task counts and status distribution.

See [`09--cupt-workspace/02-task-summary.md`](09--cupt-workspace/02-task-summary.md)

### Prefetch cache
`cupt prefetch` — eagerly downloads and caches task details. Enables all `--offline` flags without prior `cupt list`.

See [`09--cupt-workspace/03-prefetch.md`](09--cupt-workspace/03-prefetch.md)

---

## 11. CUPT GLOBAL FLAGS

4 flags that apply across multiple cupt commands.

### JSON output flag
`--json` — returns structured JSON on all read commands. Required for agent workflows. Never parse human-readable output.

See [`10--cupt-global-flags/01-json-flag.md`](10--cupt-global-flags/01-json-flag.md)

### Offline mode flag
`--offline` — uses local cache instead of the API on `list` and `show` commands. Requires prior caching.

See [`10--cupt-global-flags/02-offline-flag.md`](10--cupt-global-flags/02-offline-flag.md)

### Debug logging flag
`--debug` — enables verbose internal logs for troubleshooting auth, API calls, and cache misses.

See [`10--cupt-global-flags/03-debug-flag.md`](10--cupt-global-flags/03-debug-flag.md)

### Version flag
`--version` — prints the installed cupt version string (e.g. `cupt 0.7.1`).

See [`10--cupt-global-flags/04-version-flag.md`](10--cupt-global-flags/04-version-flag.md)

---

## 12. OFFICIAL CLICKUP MCP — HIGH PRIORITY (8 Tools)

Daily task management. All tools invoked as `clickup.clickup_{tool_name}` in Code Mode.

### clickup_create_task
Create a single task in a list. Supports name, description, priority (1-4), assignees, tags, due_date, and status.

See [`11--mcp-high-priority/01-create-task.md`](11--mcp-high-priority/01-create-task.md)

### clickup_get_task
Get full task details by ID. Returns all fields including custom fields, time tracked, and subtask list.

See [`11--mcp-high-priority/02-get-task.md`](11--mcp-high-priority/02-get-task.md)

### clickup_update_task
Update task fields: status, priority, assignees, due date, name, description. The only MCP tool that can change task status.

See [`11--mcp-high-priority/03-update-task.md`](11--mcp-high-priority/03-update-task.md)

### clickup_delete_task
Permanently delete a task. Not reversible. Use only on confirmed test or duplicate tasks.

See [`11--mcp-high-priority/04-delete-task.md`](11--mcp-high-priority/04-delete-task.md)

### clickup_search_tasks
Full-text search across the workspace with optional filters for list, assignee, tags, and status.

See [`11--mcp-high-priority/05-search-tasks.md`](11--mcp-high-priority/05-search-tasks.md)

### clickup_get_workspace
Get workspace details including team ID, name, members, and plan information.

See [`11--mcp-high-priority/06-get-workspace.md`](11--mcp-high-priority/06-get-workspace.md)

### clickup_manage_comments
Create (POST) or list (GET) task comments. Equivalent to cupt note/notes but via MCP.

See [`11--mcp-high-priority/07-manage-comments.md`](11--mcp-high-priority/07-manage-comments.md)

### clickup_create_bulk_tasks
Create 5 or more tasks in one API call. More efficient than sequential `clickup_create_task` for large batches.

See [`11--mcp-high-priority/08-create-bulk-tasks.md`](11--mcp-high-priority/08-create-bulk-tasks.md)

---

## 13. OFFICIAL CLICKUP MCP — MEDIUM PRIORITY (19 Tools)

Weekly operations: structure management, documents, goals, advanced task features.

### clickup_update_bulk_tasks
Update multiple tasks in a single call. Accepts an array of task objects with `task_id` + fields to change.

See [`12--mcp-medium-priority/01-update-bulk-tasks.md`](12--mcp-medium-priority/01-update-bulk-tasks.md)

### clickup_create_subtask
Create a subtask under a parent task. Requires `parent_task_id` and `name`.

See [`12--mcp-medium-priority/02-create-subtask.md`](12--mcp-medium-priority/02-create-subtask.md)

### clickup_manage_task_dependencies
Set or remove dependencies between tasks. Supports `depends_on` and `dependency_of` relationship types.

See [`12--mcp-medium-priority/03-task-dependencies.md`](12--mcp-medium-priority/03-task-dependencies.md)

### clickup_create_task_link
Create a non-dependency link between two tasks (e.g. "related to").

See [`12--mcp-medium-priority/04-create-task-link.md`](12--mcp-medium-priority/04-create-task-link.md)

### clickup_add_task_to_multiple_lists
Add an existing task to additional lists without duplicating it.

See [`12--mcp-medium-priority/05-multi-list.md`](12--mcp-medium-priority/05-multi-list.md)

### clickup_manage_task_attachments
Upload or list task attachments via MCP. Alternative to `cupt attach` for MCP-first workflows.

See [`12--mcp-medium-priority/06-task-attachments.md`](12--mcp-medium-priority/06-task-attachments.md)

### clickup_manage_lists
Create, update, or delete lists within a space or folder.

See [`12--mcp-medium-priority/07-manage-lists.md`](12--mcp-medium-priority/07-manage-lists.md)

### clickup_manage_spaces
Create, update, or delete spaces within the workspace.

See [`12--mcp-medium-priority/08-manage-spaces.md`](12--mcp-medium-priority/08-manage-spaces.md)

### clickup_manage_folders
Create, update, or delete folders within a space.

See [`12--mcp-medium-priority/09-manage-folders.md`](12--mcp-medium-priority/09-manage-folders.md)

### clickup_manage_custom_fields
Create or update custom field definitions for a list.

See [`12--mcp-medium-priority/10-custom-fields.md`](12--mcp-medium-priority/10-custom-fields.md)

### clickup_add_tag_to_task
Add a tag to a task via MCP. Functionally equivalent to `cupt tag add`.

See [`12--mcp-medium-priority/11-add-tag.md`](12--mcp-medium-priority/11-add-tag.md)

### clickup_remove_tag_from_task
Remove a tag from a task via MCP. Functionally equivalent to `cupt tag remove`.

See [`12--mcp-medium-priority/12-remove-tag.md`](12--mcp-medium-priority/12-remove-tag.md)

### clickup_manage_space_tags
Create or update workspace-level tag definitions in a space.

See [`12--mcp-medium-priority/13-space-tags.md`](12--mcp-medium-priority/13-space-tags.md)

### clickup_get_views
List all views (list view, board, calendar, etc.) for a workspace, space, or list.

See [`12--mcp-medium-priority/14-get-views.md`](12--mcp-medium-priority/14-get-views.md)

### clickup_create_document
Create a ClickUp document. Supports markdown or HTML content. Parent type codes: 4=list, 5=folder, 6=space, 7=all, 12=workspace.

See [`12--mcp-medium-priority/15-create-document.md`](12--mcp-medium-priority/15-create-document.md)

### clickup_get_document
Get document details by document ID.

See [`12--mcp-medium-priority/16-get-document.md`](12--mcp-medium-priority/16-get-document.md)

### clickup_update_document
Update an existing document's name or content.

See [`12--mcp-medium-priority/17-update-document.md`](12--mcp-medium-priority/17-update-document.md)

### clickup_manage_time_tracking
Log or update time tracking entries for a task via MCP. Accepts start/end timestamps or duration.

See [`12--mcp-medium-priority/18-time-tracking.md`](12--mcp-medium-priority/18-time-tracking.md)

### clickup_manage_goals
Create, update, or delete goals and OKRs. Requires workspace-level team ID.

See [`12--mcp-medium-priority/19-manage-goals.md`](12--mcp-medium-priority/19-manage-goals.md)

---

## 14. OFFICIAL CLICKUP MCP — LOW PRIORITY (19 Tools)

Used for setup, enterprise administration, and specialized workflows.

### clickup_get_task_dependencies
Query the dependency graph for a task (read-only). Returns all `depends_on` and `dependency_of` relationships.

See [`13--mcp-low-priority/01-get-dependencies.md`](13--mcp-low-priority/01-get-dependencies.md)

### clickup_use_task_template
Create a new task from a saved ClickUp task template.

See [`13--mcp-low-priority/02-use-template.md`](13--mcp-low-priority/02-use-template.md)

### clickup_manage_chat
Send messages to ClickUp Chat channels.

See [`13--mcp-low-priority/03-manage-chat.md`](13--mcp-low-priority/03-manage-chat.md)

### clickup_manage_webhooks
Create, update, list, or delete workspace webhooks. Supports `taskCreated`, `taskStatusUpdated`, and other event types.

See [`13--mcp-low-priority/04-manage-webhooks.md`](13--mcp-low-priority/04-manage-webhooks.md)

### clickup_get_user_groups
List user groups (teams) in the workspace. Enterprise feature — requires admin token.

See [`13--mcp-low-priority/05-user-groups.md`](13--mcp-low-priority/05-user-groups.md)

### clickup_manage_guests
Add or remove guest users from the workspace. Enterprise feature.

See [`13--mcp-low-priority/06-manage-guests.md`](13--mcp-low-priority/06-manage-guests.md)

### clickup_get_audit_logs
Access workspace audit logs for compliance and security review. Enterprise feature.

See [`13--mcp-low-priority/07-audit-logs.md`](13--mcp-low-priority/07-audit-logs.md)

### clickup_provide_feedback
Submit product feedback directly to ClickUp from the MCP. Rarely used in agent workflows.

See [`13--mcp-low-priority/08-feedback.md`](13--mcp-low-priority/08-feedback.md)

### clickup_create_checklist
Create a named checklist inside a task.

See [`13--mcp-low-priority/09-create-checklist.md`](13--mcp-low-priority/09-create-checklist.md)

### clickup_update_checklist
Update a checklist's name or ordering.

See [`13--mcp-low-priority/10-update-checklist.md`](13--mcp-low-priority/10-update-checklist.md)

### clickup_delete_checklist
Delete a checklist from a task.

See [`13--mcp-low-priority/11-delete-checklist.md`](13--mcp-low-priority/11-delete-checklist.md)

### clickup_create_checklist_item
Add a new item to an existing checklist.

See [`13--mcp-low-priority/12-create-checklist-item.md`](13--mcp-low-priority/12-create-checklist-item.md)

### clickup_update_checklist_item
Update a checklist item: change text or mark as resolved/unresolved.

See [`13--mcp-low-priority/13-update-checklist-item.md`](13--mcp-low-priority/13-update-checklist-item.md)

### clickup_delete_checklist_item
Remove a specific item from a checklist.

See [`13--mcp-low-priority/14-delete-checklist-item.md`](13--mcp-low-priority/14-delete-checklist-item.md)

### clickup_get_document_pages
List all pages within a ClickUp document.

See [`13--mcp-low-priority/15-get-doc-pages.md`](13--mcp-low-priority/15-get-doc-pages.md)

### clickup_create_document_page
Add a new page to an existing ClickUp document.

See [`13--mcp-low-priority/16-create-doc-page.md`](13--mcp-low-priority/16-create-doc-page.md)

### clickup_update_document_page
Update the name or content of a specific document page.

See [`13--mcp-low-priority/17-update-doc-page.md`](13--mcp-low-priority/17-update-doc-page.md)

### clickup_get_custom_fields
List all custom field definitions for a list.

See [`13--mcp-low-priority/18-get-custom-fields.md`](13--mcp-low-priority/18-get-custom-fields.md)

### clickup_set_custom_field_value
Set the value of a custom field on a specific task.

See [`13--mcp-low-priority/19-set-custom-field.md`](13--mcp-low-priority/19-set-custom-field.md)

---

## Feature Count Summary

| Category | Count |
|----------|-------|
| cupt Authentication & Config | 8 |
| cupt Task Listing & Filtering | 14 |
| cupt Task Details | 6 |
| cupt Task Completion | 4 |
| cupt Notes & Comments | 2 |
| cupt Time Tracking | 4 |
| cupt Tag Management | 2 |
| cupt Attachments | 3 |
| cupt Workspace Discovery | 3 |
| cupt Global Flags | 4 |
| **cupt subtotal** | **50** |
| MCP HIGH Priority | 8 |
| MCP MEDIUM Priority | 19 |
| MCP LOW Priority | 19 |
| **MCP subtotal** | **46** |
| **TOTAL** | **96** |
