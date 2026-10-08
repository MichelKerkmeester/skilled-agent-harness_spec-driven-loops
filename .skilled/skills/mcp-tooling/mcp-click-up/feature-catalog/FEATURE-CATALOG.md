---
title: "mcp-click-up: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the mcp-click-up skill: cupt CLI (v0.7.1+) and the official hosted ClickUp MCP (61 live tools)."
version: 1.1.0.0
---

# mcp-click-up: Feature Catalog

Complete feature inventory for both tools in the mcp-click-up skill. This catalog describes **what ships today** — not roadmap aspirations. Execution detail (exact prompts, commands, expected signals, pass/fail criteria) lives in the manual testing playbook.

---

## 1. OVERVIEW

The mcp-click-up skill routes ClickUp work between two complementary tools:

- **cupt CLI** (`pipx install cupt`) — 50 features across 10 command areas. Purpose-built for agent use: per-list status resolution, dry-run safety, offline cache, and `--json` output on 4 of its read commands (`list`, `show`, `statuses`, `teams` — not global).
- **Official ClickUp MCP** (the `clickup_official` manual: the hosted server at `https://mcp.clickup.com/mcp`, launched over stdio via `npx -y mcp-remote`, signed in with OAuth, registered in `.utcp_config.json`, via Code Mode `call_tool_chain({ code: "..." })`). Covers what cupt cannot do: task creation, documents and pages, search, lists and folders, task relations, chat and reminders.

> **Verification status (2026-10-08):** the `clickup_official` manual runs ClickUp's hosted server through `mcp-remote`, after the npm package `@clickup/mcp-server` returned 404 on 2026-07-10 and again on 2026-10-08. The hosted server registered 61 tools on 2026-10-08, and every MCP card below was generated from that tool list, one card per tool, with each parameter table taken from the server's own schema. The server has no tools for goals, bulk create, webhooks, checklist edits, spaces, views, space tags, task templates, guests, user groups or audit logs. Its operator catalog had no operators enabled, so those features have no MCP route.

Routing is **operation-based**: each feature belongs to exactly one tool. See `../SKILL.md §2` for the routing pseudocode.

| Metric | Value |
|--------|-------|
| cupt features | 50 |
| Official MCP tools | 61, one card each, live-verified 2026-10-08 |
| Total catalog entries | 111 |
| cupt install | `pipx install cupt` |
| MCP server | `clickup_official`, the hosted ClickUp server via `npx -y mcp-remote`, OAuth sign-in, registered in `.utcp_config.json` |
| MCP invocation | `clickup_official.clickup_official_<tool_name>`, where every server tool name already starts with `clickup_`, for example `clickup_official.clickup_official_clickup_create_task` |

See `../feature-catalog/FEATURE-CATALOG.md` for the agent decision guide.

---

## 2. CUPT AUTHENTICATION & CONFIGURATION

8 features covering credential setup, workspace defaults, and config management.

### Interactive auth
`cupt auth` — interactive wizard for OAuth or Personal API Token. Guides through token entry or browser-redirect OAuth flow.

See [`cupt-authentication/interactive-auth.md`](../feature-catalog/cupt-authentication/interactive-auth.md)

### Direct token
`cupt config --api-token pk_xxx` — set Personal API Token non-interactively. Token must start with `pk_`.

See [`cupt-authentication/direct-token.md`](../feature-catalog/cupt-authentication/direct-token.md)

### Workspace default
`cupt config --workspace-id <id>` — persist a default workspace ID for all subsequent commands.

See [`cupt-authentication/workspace-default.md`](../feature-catalog/cupt-authentication/workspace-default.md)

### List default
`cupt config --default-list <id>` — persist a default list ID.

See [`cupt-authentication/list-default.md`](../feature-catalog/cupt-authentication/list-default.md)

### Show config
`cupt config --show` — display workspace, default list, and masked auth state.

See [`cupt-authentication/show-config.md`](../feature-catalog/cupt-authentication/show-config.md)

### Clear cache
`cupt config --clear-cache` — remove all locally cached task data.

See [`cupt-authentication/clear-cache.md`](../feature-catalog/cupt-authentication/clear-cache.md)

### Auth status
`cupt status` — workspace name, user, and auth health check. Use as preflight before starting any agent workflow.

See [`cupt-authentication/auth-status.md`](../feature-catalog/cupt-authentication/auth-status.md)

### Logout
`cupt logout` — revoke stored credentials and clear the local cache.

See [`cupt-authentication/logout.md`](cupt-authentication/logout.md)

---

## 3. CUPT TASK LISTING & FILTERING

14 features covering all listing modes, date filters, tag/team filters, and output options.

### List assigned
`cupt list` — tasks assigned to the current user in the default workspace.

See [`cupt-task-listing/list-assigned.md`](../feature-catalog/cupt-task-listing/list-assigned.md)

### Filter today
`cupt list --today` — tasks due today only.

See [`cupt-task-listing/filter-today.md`](../feature-catalog/cupt-task-listing/filter-today.md)

### Filter week
`cupt list --week` — tasks due within the current week.

See [`cupt-task-listing/filter-week.md`](../feature-catalog/cupt-task-listing/filter-week.md)

### Filter overdue
`cupt list --overdue` — past-due tasks only.

See [`cupt-task-listing/filter-overdue.md`](../feature-catalog/cupt-task-listing/filter-overdue.md)

### Filter by tag
`cupt list --tag <name>` — server-side filter (fast). Multiple `--tag` flags use AND logic: task must carry all specified tags.

See [`cupt-task-listing/filter-tag.md`](../feature-catalog/cupt-task-listing/filter-tag.md)

### Exclude by tag
`cupt list --no-tag <name>` — exclude tasks carrying the specified tag. Useful for filtering out already-processed work.

See [`cupt-task-listing/exclude-tag.md`](../feature-catalog/cupt-task-listing/exclude-tag.md)

### Filter by team
`cupt list --team <name>` — client-side filter (5-20s on large workspaces). Multiple `--team` flags use OR logic: task may belong to any specified team.

See [`cupt-task-listing/filter-team.md`](../feature-catalog/cupt-task-listing/filter-team.md)

### All tasks
`cupt list --all` — include tasks assigned to anyone on the team, not just the current user.

See [`cupt-task-listing/all-tasks.md`](../feature-catalog/cupt-task-listing/all-tasks.md)

### Mine only
`cupt list --mine` — restrict to self-assigned tasks. Equivalent to default but explicit when combined with `--all`.

See [`cupt-task-listing/mine-only.md`](../feature-catalog/cupt-task-listing/mine-only.md)

### Cap results
`cupt list -n <N>` — limit output to N rows. Useful for large workspaces when only the first N results are needed.

See [`cupt-task-listing/cap-results.md`](../feature-catalog/cupt-task-listing/cap-results.md)

### Verbose output
`cupt list --verbose` — add extra columns: assignee, time estimate, and time tracked.

See [`cupt-task-listing/verbose.md`](cupt-task-listing/verbose.md)

### JSON output
`cupt list --json` — structured JSON array. Required for agent workflows — never parse human-readable output programmatically.

See [`cupt-task-listing/json-output.md`](../feature-catalog/cupt-task-listing/json-output.md)

### Offline listing
`cupt list --offline` — use local cache, no network call. Requires prior `cupt list` (auto-caches) or `cupt prefetch`.

See [`cupt-task-listing/offline.md`](cupt-task-listing/offline.md)

### Stacked filters
`--tag A --tag B` (AND: task has both), `--team X --team Y` (OR: task in either), combined freely with date/scope flags.

See [`cupt-task-listing/stacked-filters.md`](../feature-catalog/cupt-task-listing/stacked-filters.md)

---

## 4. CUPT TASK DETAILS

6 features covering task inspection, context, and status schema discovery.

### Show task
`cupt show <id>` — full task: name, description, status, assignees, tags, due date, custom fields.

See [`cupt-task-details/show-task.md`](../feature-catalog/cupt-task-details/show-task.md)

### Show with notes
`cupt show <id> --notes` — appends all comments below the task detail output.

See [`cupt-task-details/show-notes.md`](../feature-catalog/cupt-task-details/show-notes.md)

### Show offline
`cupt show <id> --offline` — returns cached task data without network call.

See [`cupt-task-details/show-offline.md`](../feature-catalog/cupt-task-details/show-offline.md)

### Task context
`cupt context <id>` — shows parent task, all siblings at the same level, and direct subtasks. Use before acting to avoid orphaning work.

See [`cupt-task-details/task-context.md`](../feature-catalog/cupt-task-details/task-context.md)

### Status schema by task
`cupt statuses <id>` — lists all statuses for the task's list, marking the closed status. Always run this before `cupt done`.

See [`cupt-task-details/status-schema.md`](../feature-catalog/cupt-task-details/status-schema.md)

### Status schema by list
`cupt statuses --list <list-id>` — query the status schema for a specific list without a task ID. Useful when planning batch operations.

See [`cupt-task-details/status-by-list.md`](../feature-catalog/cupt-task-details/status-by-list.md)

---

## 5. CUPT TASK COMPLETION

4 features for safely marking tasks complete with status resolution and dry-run support.

### Mark complete
`cupt done <id>` — marks task complete using the list's resolved closed status. Never requires specifying the status name.

See [`cupt-task-completion/mark-complete.md`](../feature-catalog/cupt-task-completion/mark-complete.md)

### Dry-run preview
`cupt done <id> --dry-run` — shows which status would be applied without writing. Required before any batch completion loop.

See [`cupt-task-completion/dry-run.md`](../feature-catalog/cupt-task-completion/dry-run.md)

### Complete with note
`cupt done <id> --note "<text>"` — marks complete and adds a comment in one call. Preferred for agent handoff patterns.

See [`cupt-task-completion/complete-with-note.md`](../feature-catalog/cupt-task-completion/complete-with-note.md)

### Auto-note
`cupt done <id> --auto-note` — uses local AI (if configured) to draft a completion note automatically.

See [`cupt-task-completion/auto-note.md`](../feature-catalog/cupt-task-completion/auto-note.md)

---

## 6. CUPT NOTES & COMMENTS

2 features for adding and reading task comments.

### Add comment
`cupt note <id> "<text>"` — appends a comment to the task. Used for agent handoff messages and progress notes.

See [`cupt-notes-comments/add-comment.md`](../feature-catalog/cupt-notes-comments/add-comment.md)

### List comments
`cupt notes <id>` — displays all comments on the task in chronological order with author and timestamp.

See [`cupt-notes-comments/list-comments.md`](../feature-catalog/cupt-notes-comments/list-comments.md)

---

## 7. CUPT TIME TRACKING

4 features for timer management and manual time logging.

### Start timer
`cupt time start <id>` — starts a running timer on the task. Only one timer can run at a time.

See [`cupt-time-tracking/start-timer.md`](../feature-catalog/cupt-time-tracking/start-timer.md)

### Stop timer
`cupt time stop` — stops the currently running timer and logs the elapsed time to ClickUp automatically.

See [`cupt-time-tracking/stop-timer.md`](../feature-catalog/cupt-time-tracking/stop-timer.md)

### Log manually
`cupt time add <id> <duration>` — log time retroactively without using a timer. Duration formats: `1h30m`, `45m`, `2h`, `30m`.

See [`cupt-time-tracking/log-manual.md`](../feature-catalog/cupt-time-tracking/log-manual.md)

### Timer status
`cupt time status` — shows running task name + elapsed time, or "no timer running" when idle.

See [`cupt-time-tracking/timer-status.md`](../feature-catalog/cupt-time-tracking/timer-status.md)

---

## 8. CUPT TAG MANAGEMENT

2 features for applying and removing task tags.

### Add tag
`cupt tag add <id> <name>` — applies a named tag to the task. Tag must already exist in the workspace.

See [`cupt-tag-management/add-tag.md`](../feature-catalog/cupt-tag-management/add-tag.md)

### Remove tag
`cupt tag remove <id> <name>` — removes a named tag from the task.

See [`cupt-tag-management/remove-tag.md`](../feature-catalog/cupt-tag-management/remove-tag.md)

---

## 9. CUPT ATTACHMENTS

3 features for listing, uploading, and downloading task files.

### List attachments
`cupt attach list <id>` — shows all files attached to the task with names, sizes, and upload dates.

See [`cupt-attachments/list-attachments.md`](../feature-catalog/cupt-attachments/list-attachments.md)

### Upload file
`cupt attach add <id> <file>` — uploads a local file as a task attachment.

See [`cupt-attachments/upload-file.md`](../feature-catalog/cupt-attachments/upload-file.md)

### Download file
`cupt attach get <id> <selector>` — downloads an attachment by index number or partial name match.

See [`cupt-attachments/download-file.md`](../feature-catalog/cupt-attachments/download-file.md)

---

## 10. CUPT WORKSPACE DISCOVERY

3 features for discovering workspace structure and pre-caching data.

### List teams
`cupt teams` — lists all user-groups in the workspace. ClickUp UI calls these "Teams"; the REST API calls them "groups".

See [`cupt-workspace/list-teams.md`](../feature-catalog/cupt-workspace/list-teams.md)

### Task summary
`cupt summary` — generates a workspace-wide overview of task counts and status distribution.

See [`cupt-workspace/task-summary.md`](../feature-catalog/cupt-workspace/task-summary.md)

### Prefetch cache
`cupt prefetch` — eagerly downloads and caches task details. Enables all `--offline` flags without prior `cupt list`.

See [`cupt-workspace/prefetch.md`](cupt-workspace/prefetch.md)

---

## 11. CUPT GLOBAL FLAGS

4 flags that apply across multiple cupt commands.

### JSON output flag
`--json` — returns structured JSON on all read commands. Required for agent workflows. Never parse human-readable output.

See [`cupt-global-flags/json-flag.md`](../feature-catalog/cupt-global-flags/json-flag.md)

### Offline mode flag
`--offline` — uses local cache instead of the API on `list` and `show` commands. Requires prior caching.

See [`cupt-global-flags/offline-flag.md`](../feature-catalog/cupt-global-flags/offline-flag.md)

### Debug logging flag
`--debug` — enables verbose internal logs for troubleshooting auth, API calls, and cache misses.

See [`cupt-global-flags/debug-flag.md`](../feature-catalog/cupt-global-flags/debug-flag.md)

### Version flag
`--version` — prints the installed cupt version string (e.g. `cupt 0.7.1`).

See [`cupt-global-flags/version-flag.md`](../feature-catalog/cupt-global-flags/version-flag.md)

---

## 12. OFFICIAL CLICKUP MCP: HIGH PRIORITY (10 TOOLS)

Task create, read, update and delete, task search and filtering, comments, and the connection smoke test.

### clickup_create_task
Create one task in a list, with a markdown description, assignees, tags, dates and custom fields.

See [`mcp-high-priority/create-task.md`](../feature-catalog/mcp-high-priority/create-task.md)

### clickup_get_task
Read one task by ID, including custom IDs such as `DEV-1234`.

See [`mcp-high-priority/get-task.md`](../feature-catalog/mcp-high-priority/get-task.md)

### clickup_update_task
Change task fields: name, markdown description, status, priority, dates, assignees, type and custom fields.

See [`mcp-high-priority/update-task.md`](../feature-catalog/mcp-high-priority/update-task.md)

### clickup_delete_task
Delete a task permanently.

See [`mcp-high-priority/delete-task.md`](../feature-catalog/mcp-high-priority/delete-task.md)

### clickup_filter_tasks
List tasks that match field filters: tags, lists, folders, spaces, statuses, assignees, dates and custom fields.

See [`mcp-high-priority/filter-tasks.md`](../feature-catalog/mcp-high-priority/filter-tasks.md)

### clickup_search
Keyword search across the workspace: tasks, docs, dashboards, attachments, whiteboards, chats and forms.

See [`mcp-high-priority/search.md`](../feature-catalog/mcp-high-priority/search.md)

### clickup_get_workspace_hierarchy
Read the workspace structure: spaces, folders and lists, with paging and depth control.

See [`mcp-high-priority/get-workspace-hierarchy.md`](../feature-catalog/mcp-high-priority/get-workspace-hierarchy.md)

### clickup_create_comment
Post a comment or threaded reply on a task, list or view, with markdown support.

See [`mcp-high-priority/create-comment.md`](../feature-catalog/mcp-high-priority/create-comment.md)

### clickup_get_task_comments
List a task's comments, with a reply count per comment.

See [`mcp-high-priority/get-task-comments.md`](../feature-catalog/mcp-high-priority/get-task-comments.md)

### clickup_move_task
Move a task to a different home list.

See [`mcp-high-priority/move-task.md`](../feature-catalog/mcp-high-priority/move-task.md)

---

## 13. OFFICIAL CLICKUP MCP: MEDIUM PRIORITY (25 TOOLS)

Documents, tags, comment upkeep, task relations, lists and folders, and time tracking.

### clickup_create_document
Create a ClickUp document in a space, folder, list, everything view or workspace.

See [`mcp-medium-priority/create-document.md`](../feature-catalog/mcp-medium-priority/create-document.md)

### clickup_add_tag_to_task
Add an existing space tag to a task.

See [`mcp-medium-priority/add-tag.md`](../feature-catalog/mcp-medium-priority/add-tag.md)

### clickup_remove_tag_from_task
Remove a tag from a task. The tag stays defined in the space.

See [`mcp-medium-priority/remove-tag.md`](../feature-catalog/mcp-medium-priority/remove-tag.md)

### clickup_update_comment
Edit a comment in place: replace its text, resolve it or reassign it.

See [`mcp-medium-priority/update-comment.md`](../feature-catalog/mcp-medium-priority/update-comment.md)

### clickup_delete_comment
Delete a comment permanently.

See [`mcp-medium-priority/delete-comment.md`](../feature-catalog/mcp-medium-priority/delete-comment.md)

### clickup_get_threaded_comments
Read the replies under one comment.

See [`mcp-medium-priority/get-threaded-comments.md`](../feature-catalog/mcp-medium-priority/get-threaded-comments.md)

### clickup_merge_tasks
Merge source tasks into a target task. The sources are consumed.

See [`mcp-medium-priority/merge-tasks.md`](../feature-catalog/mcp-medium-priority/merge-tasks.md)

### clickup_add_task_to_list
Show a task in an additional list while it keeps its home list.

See [`mcp-medium-priority/add-task-to-list.md`](../feature-catalog/mcp-medium-priority/add-task-to-list.md)

### clickup_remove_task_from_list
Remove a task from an additional list. The home list cannot be removed.

See [`mcp-medium-priority/remove-task-from-list.md`](../feature-catalog/mcp-medium-priority/remove-task-from-list.md)

### clickup_add_task_dependency
Make one task block another: `waiting_on` or `blocking`.

See [`mcp-medium-priority/add-task-dependency.md`](../feature-catalog/mcp-medium-priority/add-task-dependency.md)

### clickup_remove_task_dependency
Remove a dependency between two tasks.

See [`mcp-medium-priority/remove-task-dependency.md`](../feature-catalog/mcp-medium-priority/remove-task-dependency.md)

### clickup_add_task_link
Link two tasks with no ordering or blocking.

See [`mcp-medium-priority/add-task-link.md`](../feature-catalog/mcp-medium-priority/add-task-link.md)

### clickup_remove_task_link
Remove a link between two tasks.

See [`mcp-medium-priority/remove-task-link.md`](../feature-catalog/mcp-medium-priority/remove-task-link.md)

### clickup_create_list
Create a list directly in a space.

See [`mcp-medium-priority/create-list.md`](../feature-catalog/mcp-medium-priority/create-list.md)

### clickup_create_list_in_folder
Create a list inside a folder.

See [`mcp-medium-priority/create-list-in-folder.md`](../feature-catalog/mcp-medium-priority/create-list-in-folder.md)

### clickup_get_list
Read a list by ID or name, including its configured statuses.

See [`mcp-medium-priority/get-list.md`](../feature-catalog/mcp-medium-priority/get-list.md)

### clickup_update_list
Change a list's name, content or status.

See [`mcp-medium-priority/update-list.md`](../feature-catalog/mcp-medium-priority/update-list.md)

### clickup_create_folder
Create a folder in a space, optionally with its own statuses.

See [`mcp-medium-priority/create-folder.md`](../feature-catalog/mcp-medium-priority/create-folder.md)

### clickup_get_folder
Read a folder by ID or name.

See [`mcp-medium-priority/get-folder.md`](../feature-catalog/mcp-medium-priority/get-folder.md)

### clickup_update_folder
Rename a folder or change its statuses.

See [`mcp-medium-priority/update-folder.md`](../feature-catalog/mcp-medium-priority/update-folder.md)

### clickup_start_time_tracking
Start a timer on a task.

See [`mcp-medium-priority/start-time-tracking.md`](../feature-catalog/mcp-medium-priority/start-time-tracking.md)

### clickup_stop_time_tracking
Stop the running timer and return the finished entry.

See [`mcp-medium-priority/stop-time-tracking.md`](../feature-catalog/mcp-medium-priority/stop-time-tracking.md)

### clickup_add_time_entry
Log a manual time entry on a task.

See [`mcp-medium-priority/add-time-entry.md`](../feature-catalog/mcp-medium-priority/add-time-entry.md)

### clickup_get_current_time_entry
Read the running time entry, if there is one.

See [`mcp-medium-priority/get-current-time-entry.md`](../feature-catalog/mcp-medium-priority/get-current-time-entry.md)

### clickup_get_time_entries
List time entries, filtered by task, dates, assignee or billable flag.

See [`mcp-medium-priority/get-time-entries.md`](../feature-catalog/mcp-medium-priority/get-time-entries.md)

---

## 14. OFFICIAL CLICKUP MCP: LOW PRIORITY (26 TOOLS)

Document pages and their attachments, task attachments, chat, reminders, members, time in status, and the operator catalog.

### clickup_list_document_pages
List the page tree of a document, names only.

See [`mcp-low-priority/list-document-pages.md`](../feature-catalog/mcp-low-priority/list-document-pages.md)

### clickup_get_document_pages
Read the full content of chosen document pages.

See [`mcp-low-priority/get-doc-pages.md`](../feature-catalog/mcp-low-priority/get-doc-pages.md)

### clickup_create_document_page
Add a page, or a sub-page, to a document.

See [`mcp-low-priority/create-doc-page.md`](../feature-catalog/mcp-low-priority/create-doc-page.md)

### clickup_update_document_page
Rename a page or change its content, by replacing, appending or prepending.

See [`mcp-low-priority/update-doc-page.md`](../feature-catalog/mcp-low-priority/update-doc-page.md)

### clickup_get_custom_fields
Read custom field definitions at list, folder, space or workspace level.

See [`mcp-low-priority/get-custom-fields.md`](../feature-catalog/mcp-low-priority/get-custom-fields.md)

### clickup_list_document_page_attachments
List the files and images embedded in a document page.

See [`mcp-low-priority/list-document-page-attachments.md`](../feature-catalog/mcp-low-priority/list-document-page-attachments.md)

### clickup_download_document_page_attachment
Get a short-lived download URL for a document page attachment.

See [`mcp-low-priority/download-document-page-attachment.md`](../feature-catalog/mcp-low-priority/download-document-page-attachment.md)

### clickup_attach_task_file
Attach a small file or a web URL to a task.

See [`mcp-low-priority/attach-task-file.md`](../feature-catalog/mcp-low-priority/attach-task-file.md)

### clickup_request_attachment_upload
Get upload details for attaching a local file of any size to a task.

See [`mcp-low-priority/request-attachment-upload.md`](../feature-catalog/mcp-low-priority/request-attachment-upload.md)

### clickup_download_task_attachment
Get a short-lived download URL for a task attachment.

See [`mcp-low-priority/download-task-attachment.md`](../feature-catalog/mcp-low-priority/download-task-attachment.md)

### clickup_create_task_comment
Deprecated alias for task comments. Use `clickup_create_comment`.

See [`mcp-low-priority/create-task-comment.md`](../feature-catalog/mcp-low-priority/create-task-comment.md)

### clickup_get_chat_channels
List the workspace's chat channels.

See [`mcp-low-priority/get-chat-channels.md`](../feature-catalog/mcp-low-priority/get-chat-channels.md)

### clickup_send_chat_message
Post a chat message or threaded reply, with markdown support.

See [`mcp-low-priority/send-chat-message.md`](../feature-catalog/mcp-low-priority/send-chat-message.md)

### clickup_get_chat_channel_messages
Read a chat channel's messages.

See [`mcp-low-priority/get-chat-channel-messages.md`](../feature-catalog/mcp-low-priority/get-chat-channel-messages.md)

### clickup_get_chat_message_replies
Read the replies in a chat thread.

See [`mcp-low-priority/get-chat-message-replies.md`](../feature-catalog/mcp-low-priority/get-chat-message-replies.md)

### clickup_create_reminder
Create a personal reminder with a due date.

See [`mcp-low-priority/create-reminder.md`](../feature-catalog/mcp-low-priority/create-reminder.md)

### clickup_search_reminders
List and filter the user's reminders.

See [`mcp-low-priority/search-reminders.md`](../feature-catalog/mcp-low-priority/search-reminders.md)

### clickup_update_reminder
Change a reminder or mark it complete.

See [`mcp-low-priority/update-reminder.md`](../feature-catalog/mcp-low-priority/update-reminder.md)

### clickup_get_workspace_members
List every member of the workspace.

See [`mcp-low-priority/get-workspace-members.md`](../feature-catalog/mcp-low-priority/get-workspace-members.md)

### clickup_find_member_by_name
Find one member by name or email.

See [`mcp-low-priority/find-member-by-name.md`](../feature-catalog/mcp-low-priority/find-member-by-name.md)

### clickup_resolve_assignees
Turn names, emails or `me` into numeric user IDs.

See [`mcp-low-priority/resolve-assignees.md`](../feature-catalog/mcp-low-priority/resolve-assignees.md)

### clickup_get_task_time_in_status
Show how long a task has spent in each status.

See [`mcp-low-priority/get-task-time-in-status.md`](../feature-catalog/mcp-low-priority/get-task-time-in-status.md)

### clickup_get_bulk_tasks_time_in_status
Show time in status for up to 100 tasks at once.

See [`mcp-low-priority/get-bulk-tasks-time-in-status.md`](../feature-catalog/mcp-low-priority/get-bulk-tasks-time-in-status.md)

### clickup_get_operators
List the operators this server has enabled beyond its dedicated tools.

See [`mcp-low-priority/get-operators.md`](../feature-catalog/mcp-low-priority/get-operators.md)

### clickup_execute_operator
Run one enabled operator, as the signed-in user.

See [`mcp-low-priority/execute-operator.md`](../feature-catalog/mcp-low-priority/execute-operator.md)

### clickup_get_schema
Return the data model behind the enabled operators.

See [`mcp-low-priority/get-schema.md`](../feature-catalog/mcp-low-priority/get-schema.md)

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
| MCP HIGH Priority | 10 |
| MCP MEDIUM Priority | 25 |
| MCP LOW Priority | 26 |
| **MCP subtotal** | **61** |
| **TOTAL** | **111** |
