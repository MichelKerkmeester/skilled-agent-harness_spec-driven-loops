---
title: "Official ClickUp MCP Tools Reference"
description: "Reference for the hosted ClickUp MCP server (clickup_official): the 61 live tools, how to call them through Code Mode, the markdown contract, document operations and what the server cannot do."
trigger_phrases:
  - "clickup mcp"
  - "clickup documents"
  - "clickup doc page"
  - "clickup search"
  - "clickup goals"
  - "bulk create tasks"
  - "clickup webhooks"
  - "mcp tools"
importance_tier: "normal"
contextType: "implementation"
version: 1.1.0.0
---

# Official ClickUp MCP Tools Reference

**MCP server:** `clickup_official`, ClickUp's hosted server at `https://mcp.clickup.com/mcp`. The manual in `.utcp_config.json` reaches it over stdio with `npx -y mcp-remote https://mcp.clickup.com/mcp`. The npm package `@clickup/mcp-server` returned 404 on 2026-07-10 and again on 2026-10-08, so the hosted route replaces it.
**Auth:** OAuth 2.1 with PKCE. The first launch opens one browser approval, and the manual reads no API key.
**Tool naming:** Code Mode names each tool `clickup_official.clickup_official_<server tool name>`. Every server tool name already starts with `clickup_`, so the full name repeats it: `clickup_official.clickup_official_clickup_create_task`. A name without the inner `clickup_`, such as `clickup_official.clickup_official_create_task`, does not exist.

> **Verification status (2026-10-08):** the hosted server registered 61 tools on 2026-10-08. The inventory in section 5 and every parameter named in this document come from that registration's schema. Confirm a name with `tool_info()` if a call reports that the tool is missing, because the server can add or rename tools.

---

## 1. OVERVIEW

The official MCP is the secondary surface in mcp-click-up. cupt handles daily task work. The MCP handles what cupt cannot do: creating tasks, documents and their pages, workspace search, lists and folders, task relations, comment threads, chat and reminders.

Use this reference when:
- Routing a request to the MCP based on the operation table in SKILL.md section 2
- Writing a Code Mode call
- Checking whether ClickUp supports a capability through the MCP at all

---

## 2. PREREQUISITES

- Code Mode configured, with the `clickup_official` manual in `.utcp_config.json` (not `opencode.json`, `.mcp.json` or `claude_desktop_config.json`, which are for native MCP tools)
- One OAuth approval for ClickUp in the browser, on the first launch
- The AI client restarted after a config change
- Node.js 18+ and npx, because the manual launches `mcp-remote` on demand

See `INSTALL-GUIDE.md` for the configuration block.

---

## 3. AUTHENTICATION

OAuth 2.1 with PKCE, through the hosted server, with one browser approval on the first launch. The `clickup_official` manual reads no API key, so `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` play no part in this route. Calls act as the signed-in user, so permissions follow that user's role in the workspace.

---

## 4. WHAT THE MCP CAN AND CANNOT DO

Use the **official MCP** for:
- Creating tasks, including subtasks through `parent` (cupt has no create command)
- Documents: creating them, listing their pages and reading, creating or updating pages
- Keyword search across tasks, docs and chats, and field filtering of tasks
- Lists and folders: create, read and update
- Task relations: dependencies, links, extra lists, moves and merges
- Comment threads, chat channels and reminders

Use **cupt** for daily task work: listing your queue, showing a task, completing it with a dry run, notes, timers and tags (see `cupt-commands.md`).

**No route on either surface.** The hosted server has no tools for goals or OKRs, bulk task creation or bulk update, webhooks, editing checklists, spaces, views, space-tag definitions, task templates, guests, user groups, audit logs or product feedback. It also has no whole-document read or update. Documents are read and written page by page. Its operator catalog (`clickup_get_operators`) returned "Enabled operators: none" for workspace `90151466006` on 2026-10-08, so `clickup_execute_operator` adds nothing either. Tell the user the feature is not available rather than routing it anywhere.

Two reads survive for things that cannot be edited: `clickup_get_task` with `include: ["checklists"]` returns a task's checklists, and `include: ["dependencies"]` returns its dependencies.

---

## 5. TOOL INVENTORY (61 TOOLS, LIVE 2026-10-08)

Each tool has a feature card under `feature-catalog/` with its full parameter table. "Required" lists the parameters the schema marks as required. Most tools also accept `workspace_id`, which is needed only when the signed-in user belongs to several workspaces.

### Tasks (8)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_create_task` | Create a task in a ClickUp list | `name`, `list_id` |
| `clickup_get_task` | Retrieve a ClickUp task by ID (supports custom IDs like 'DEV-1234') | `task_id` |
| `clickup_update_task` | Update task properties | `task_id` |
| `clickup_delete_task` | Delete a task by task_id (supports custom IDs like 'DEV-1234') | `task_id` |
| `clickup_move_task` | Move a task to a new home list | `task_id`, `list_id` |
| `clickup_merge_tasks` | Merge one or more source tasks into a target task | `task_id`, `source_task_ids` |
| `clickup_add_task_to_list` | Add a task to an additional list (keeps current home list) | `task_id`, `list_id` |
| `clickup_remove_task_from_list` | Remove a task from an additional list (cannot remove from home list) | `task_id`, `list_id` |

### Search and filtering (2)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_search` | Search across all workspace content (tasks, docs, dashboards, attachments, whiteboards, chats, forms) | none |
| `clickup_filter_tasks` | Retrieve tasks with combined filters (tags, lists, folders, spaces, statuses, assignees, due date range, completion date range, custom field values) | none |

### Comments (6)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_create_comment` | Create a comment or threaded reply on a task, list, or view | `comment_text` |
| `clickup_get_task_comments` | Get task comments with reply_count per comment | `task_id` |
| `clickup_get_threaded_comments` | Get threaded replies for a comment by comment_id | `comment_id` |
| `clickup_update_comment` | Edit an existing comment in place by comment_id | `comment_id` |
| `clickup_delete_comment` | Delete a comment by comment_id | `comment_id` |
| `clickup_create_task_comment` | [DEPRECATED to clickup_create_comment] Legacy name for creating a task comment, kept for clients with stale tool listings | `task_id`, `comment_text` |

### Task relations and tags (7)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_add_task_dependency` | Set a directional dependency where one task blocks the other | `task_id`, `depends_on`, `type` |
| `clickup_remove_task_dependency` | Remove a dependency between two tasks | `task_id`, `depends_on`, `type` |
| `clickup_add_task_link` | Link two tasks together | `task_id`, `links_to` |
| `clickup_remove_task_link` | Remove a link between two tasks | `task_id`, `links_to` |
| `clickup_add_tag_to_task` | Add existing tag to task | `task_id`, `tag_name` |
| `clickup_remove_tag_from_task` | Remove tag from task | `task_id`, `tag_name` |
| `clickup_get_custom_fields` | Get custom field definitions at any hierarchy level (list, folder, space, or workspace) | none |

### Documents (7)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_create_document` | Create a document in a ClickUp space, folder, or list | `name`, `parent`, `visibility`, `create_page` |
| `clickup_list_document_pages` | List page names and structure of a document (no content) | `document_id` |
| `clickup_get_document_pages` | Get the full content of specific pages by page ID | `document_id`, `page_ids` |
| `clickup_create_document_page` | Create a new page in a ClickUp document | `document_id`, `content`, `name` |
| `clickup_update_document_page` | Update a page in a ClickUp document | `document_id`, `page_id` |
| `clickup_list_document_page_attachments` | List metadata for files attached to a ClickUp doc page (images and files embedded in the page content) | `page_id` |
| `clickup_download_document_page_attachment` | Download a ClickUp doc page attachment (get attachment IDs from clickup_list_document_page_attachments) | `page_id`, `attachment_id` |

### Workspace structure (8)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_workspace_hierarchy` | Get workspace hierarchy (spaces, folders, lists) with pagination and depth control | none |
| `clickup_create_list` | Create a list in a ClickUp space | `name` |
| `clickup_create_list_in_folder` | Create a list in a ClickUp folder | `name`, `folder_id` |
| `clickup_get_list` | Get list details by list_id or list_name | none |
| `clickup_update_list` | Update a ClickUp list | `list_id` |
| `clickup_create_folder` | Create folder in ClickUp space | `name` |
| `clickup_get_folder` | Get folder details by folder_id or folder_name (+ space info) | none |
| `clickup_update_folder` | Update a ClickUp folder | `folder_id` |

### Attachments (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_attach_task_file` | Attach file to task | `task_id` |
| `clickup_request_attachment_upload` | Get short-lived, structured upload details (upload URL, ticket, HTTP method, and multipart field name) to attach a LOCAL file (any size) to a task; fo | `task_id` |
| `clickup_download_task_attachment` | Download a ClickUp task attachment (get attachment IDs from clickup_get_task with include: ["attachments"]) | `task_id`, `attachment_id` |

### Time (7)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_start_time_tracking` | Start time tracking on a task | `task_id` |
| `clickup_stop_time_tracking` | Stop the currently running time tracker | none |
| `clickup_add_time_entry` | Add a manual time entry to a task | `task_id`, `start` |
| `clickup_get_current_time_entry` | Get the currently running time entry, if any | none |
| `clickup_get_time_entries` | Get time entries with optional filtering by task, date range, assignee, and billable status | none |
| `clickup_get_task_time_in_status` | Get the time a task has spent in each status | `task_id` |
| `clickup_get_bulk_tasks_time_in_status` | Get the time multiple tasks have spent in each status (bulk operation, up to 100 tasks) | `task_ids` |

### Chat (4)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_chat_channels` | List chat channels in the workspace with pagination support | none |
| `clickup_get_chat_channel_messages` | Get messages for a chat channel | `channel_id` |
| `clickup_get_chat_message_replies` | Get threaded replies for a chat message by message_id | `message_id` |
| `clickup_send_chat_message` | Send a message or threaded reply to a chat channel | `channel_id`, `content` |

### Reminders (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_create_reminder` | Create a personal reminder in your ClickUp workspace | `title`, `due_date` |
| `clickup_search_reminders` | Search and list your reminders | none |
| `clickup_update_reminder` | Update a reminder by reminder_id | `reminder_id` |

### Members (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_workspace_members` | List all members in the workspace | none |
| `clickup_find_member_by_name` | Get a member in the ClickUp workspace by name or email | `name_or_email` |
| `clickup_resolve_assignees` | Convert names, emails, or "me" to numeric ClickUp user IDs | `assignees` |

### Operator catalog (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_operators` | Lists the Unified API operators enabled on this server (`<model>.<operator>` pairs) with each one's HTTP route, parameters and request/response body s | none |
| `clickup_execute_operator` | Run one enabled Unified API operator (a `<model>.<operator>` pair) as the authenticated user, in the session workspace | `model`, `operator` |
| `clickup_get_schema` | Returns the entity-relationship schema (Markdown with a Mermaid ER diagram) for the models behind the enabled Unified API operators | none |

---

## 6. MARKDOWN TRANSPORT CONTRACT (READ BEFORE THE EXAMPLES)

ClickUp shows plain text literally, so markdown sent through a plain-text path appears as raw `### Heading` and `**bold**`. On this server:

- Task create and update: put markdown in `markdown_description`. The server has no plain `description` parameter and no `markdown_content` parameter.
- Task read-back: `clickup_get_task` with `include: ["description"]` returns the full description.
- Document pages: set `content_format: "text/md"` on `clickup_create_document_page`, `clickup_update_document_page` and `clickup_get_document_pages`. The only other value is `"text/plain"`.
- Comments and chat: `clickup_create_comment` and `clickup_send_chat_message` accept markdown in their text.

Push shape for a markdown artifact: the document's H1 becomes the task or page `name`, so drop it from the body. Strip internal HTML comments and processing metadata. Everything else travels verbatim.

ClickUp's markdown import has three traps, all observed on 2026-10-08:
- A file name ending in `.md` in running text becomes a link, and the link can start mid-name at a space. Wrap every file path in backticks.
- A numbered list that follows a heading restarts at 1, whatever number the source gives. Escape each number (`3\.`) and leave a blank line between items when the numbers matter.
- A paragraph directly above a `---` divider becomes a heading. Leave a blank line before the divider.

This section describes the `clickup_official` manual only. The claude.ai ClickUp connector and the raw ClickUp v2 REST API were not re-checked on 2026-10-08.

---

## 7. INVOCATION PATTERN (CODE MODE)

Call the `mcp__code_mode__call_tool_chain` tool with one `code` string. Inside that string, every registered tool is a function. In this repository's Code Mode, top-level `await` is rejected, and a value returned from an async function comes back as `{}`. So wrap the calls in an async function and print what you need with `console.log`. The tool's result is `{ success, logs }`.

```typescript
// The `code` string passed to mcp__code_mode__call_tool_chain
(async () => {
  const task = await clickup_official.clickup_official_clickup_create_task({
    list_id: "LIST_ID",
    name: "New Feature Implementation",
    markdown_description: "### About\n\nImplement the feature per spec.",
    priority: "high",            // urgent | high | normal | low
    due_date: "2026-10-15",      // YYYY-MM-DD or YYYY-MM-DD HH:MM
    tags: ["backend"],           // must already exist in the space
  });
  const comment = await clickup_official.clickup_official_clickup_create_comment({
    entity_type: "task",
    entity_id: task.id,
    comment_text: "Task created by AI agent",
  });
  console.log(JSON.stringify({ task_id: task.id, comment }));
})();
```

The schema does not describe return shapes. Log the first response of a tool and read its ID field before chaining on it, as the example assumes `task.id`. A failed call can return an object such as `{ "error": "Failed to get document pages: not_found_or_authorized" }` instead of throwing, as `clickup_get_document_pages` did on 2026-10-08. Check each result for an `error` field, and wrap the calls in `try`/`catch` as well.

---

## 8. DOCUMENT OPERATIONS

`clickup_create_document` needs `name`, `parent`, `visibility` and `create_page`, and it takes no content. `parent.type` is a string:

| `parent.type` | Container |
|---------------|-----------|
| `"4"` | Space |
| `"5"` | Folder |
| `"6"` | List |
| `"7"` | Everything |
| `"12"` | Workspace |

```typescript
(async () => {
  const doc = await clickup_official.clickup_official_clickup_create_document({
    name: "Sprint Retrospective",
    parent: { id: "LIST_ID", type: "6" },
    visibility: "PRIVATE",       // PUBLIC | PRIVATE | PERSONAL | HIDDEN
    create_page: false,
  });
  const page = await clickup_official.clickup_official_clickup_create_document_page({
    document_id: doc.id,
    name: "What went well",
    content: "- Shipped on time\n- Clear handoffs",
    content_format: "text/md",
  });
  console.log(JSON.stringify({ doc_id: doc.id, page }));
})();
```

To change an existing page, read it first with `clickup_get_document_pages`, then call `clickup_update_document_page`. Its default `content_edit_mode` is `replace`, which overwrites the whole page. `append` and `prepend` keep the existing content. In a ClickUp doc URL, the first ID after `/v/dc/` or `/docs/` is the `document_id` and the second is the `page_id`.

---

## 9. ERROR HANDLING

| Error | Code | Recovery |
|-------|------|----------|
| Not authorized or connection fails | 401 or `not_found_or_authorized` on every call | Approve the OAuth prompt again |
| One page or task cannot be read | `not_found_or_authorized` on that item only | The item is missing, deleted or restricted. Check whether `clickup_list_document_pages` still lists the page |
| Rate limited | 429 | Wait 60 s, then retry with backoff |
| Resource not found | 404 | Check the IDs |
| Insufficient permissions | 403 | The signed-in account may need more access in that workspace |
| Tool not found | n/a | Check the name keeps the inner `clickup_`, then run `tool_info()` or `list_tools()` |

---

## 10. MCP VS CUPT: QUICK DECISION

| Need | Use | Reason |
|------|-----|--------|
| List my tasks today | cupt | `cupt list --today --json` |
| Mark a task done | cupt | Resolves the closed status per list and has a dry run |
| Add a note | cupt | `cupt note <id> "text"` |
| Time tracking | cupt | start, stop and add commands |
| Create a task | MCP | cupt has no create command |
| Create or edit a document | MCP | cupt has no document surface |
| Search the workspace | MCP | `clickup_search` covers tasks, docs and chats |
| Goals, bulk create, webhooks, checklist edits | Neither | No tool on the hosted server and no enabled operator |
