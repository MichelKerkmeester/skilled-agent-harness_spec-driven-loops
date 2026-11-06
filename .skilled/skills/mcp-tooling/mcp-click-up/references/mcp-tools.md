---
title: "Official ClickUp MCP Tools Reference"
description: "Reference for the hosted ClickUp MCP server (clickup_official): the 67 live tools, how to call them through Code Mode, the markdown contract, document operations and what the server cannot do."
trigger_phrases:
  - "clickup mcp"
  - "clickup documents"
  - "clickup doc page"
  - "clickup search"
  - "clickup goals"
  - "bulk create tasks"
  - "clickup webhooks"
  - "mcp tools"
  - "clickup doc divider gap"
importance_tier: "normal"
contextType: "implementation"
version: 1.1.10.0
---

# Official ClickUp MCP Tools Reference

- **MCP server:** `clickup_official`, ClickUp's hosted server at `https://mcp.clickup.com/mcp`. The manual in `.utcp_config.json` reaches it over stdio with `npx -y mcp-remote https://mcp.clickup.com/mcp`. The npm package `@clickup/mcp-server` returned 404 on 2026-07-10 and again on 2026-10-08, so the hosted route replaces it.
- **Auth:** OAuth 2.1 with PKCE. The first launch opens one browser approval, and the manual reads no API key.
- **Tool naming:** Code Mode names each tool `clickup_official.clickup_official_<server tool name>`. Every server tool name already starts with `clickup_`, so the full name repeats it: `clickup_official.clickup_official_clickup_create_task`. A name without the inner `clickup_`, such as `clickup_official.clickup_official_create_task`, does not exist.

> **Verification status (2026-11-06):** the hosted server registered 61 tools on 2026-10-08 and 67 on 2026-11-06. The inventory in section 5 and every parameter named in this document come from those registrations' schemas. Confirm a name with `tool_info()` if a call reports that the tool is missing, because the server can add or rename tools.

---

## 1. OVERVIEW

### Purpose

The official MCP is the secondary surface in mcp-click-up. cupt handles daily task work. The MCP handles what cupt cannot do: creating tasks, documents and their pages, workspace search, lists and folders, task relations, comment threads, chat and reminders.

### When to Use

Use this reference when:
- Routing a request to the MCP based on the operation table in `../ROUTER.md` section 3
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

### First-Use Readiness Check

Two logins sit outside the agent's reach, and the agent never performs either one. The ClickUp MCP needs one OAuth approval in the user's browser. A doc page push also needs ClickUp logged in, in the browser the divider gap pass runs in. Run this check once per session, after the user approves the first ClickUp write and before that write. Task writes need only the MCP part, and doc page writes need both.

What the agent sees, measured on 2026-11-06 with an empty login store:
- **Before the approval, the manual has no tools.** Registering `clickup_official` waits about a minute, ends with `MCP error -32001: Request timed out` and lists 0 tools, so a call fails because the tool is not defined. It never returns a 401.
- **The approval counts only while a connection waits for it.** mcp-remote's local callback runs during registration. An approval given after the timeout writes no token, so tell the user first and then start the connection.
- **After one approval, reconnecting needs nothing.** mcp-remote stores the token under `~/.mcp-auth`, and the next registration listed all 67 tools in seconds with no new tab.
- **The `aside` connection can drop.** After some idle time a call returns `Error: Not connected` while Aside itself is still running. Registering the `aside` manual again brings it back.

Run the program below as the `code` of one `mcp__code_mode__call_tool_chain` call with a `timeout` of 90000. Set `NEED_BROWSER` to `false` when no doc page is written. It opens and closes its own background tab, so the user's view does not change.

```javascript
(async () => {
  const NEED_BROWSER = true;
  const out = { mcp: "unknown", browser: NEED_BROWSER ? "unknown" : "not-needed" };
  // MCP: a cheap read that needs the OAuth approval.
  const resolve = typeof clickup_official === "undefined" ? undefined
    : clickup_official.clickup_official_clickup_resolve_assignees;
  if (typeof resolve !== "function") out.mcp = "not-connected";
  else {
    try {
      const me = JSON.stringify(await resolve({ assignees: ["me"] }));
      out.mcp = /"error"|unauthori[sz]ed|\b401\b|not_found_or_authorized/i.test(me) ? "login" : "ok";
    } catch (e) { out.mcp = "error"; out.mcpError = String(e).slice(0, 200); }
  }
  // Browser: open ClickUp in a background tab and see whether it lands on the login screen.
  if (NEED_BROWSER) {
    try {
      const raw = JSON.stringify(await aside.aside_repl({ title: "clickup readiness", code: `await (async () => {
        const t = await openTab("https://app.clickup.com/");
        try {
          await new Promise((r) => setTimeout(r, 7000));
          console.log("PROBE " + await t.evaluate("location.pathname"));
        } finally { await closeTab(t); }
      })();` }));
      const m = /PROBE (\/[^\s"\\]*)/.exec(raw);
      if (m) out.browser = m[1].includes("/login") ? "aside-login" : "aside";
      else out.asideError = raw.slice(0, 200);
    } catch (e) { out.asideError = String(e).slice(0, 200); }
    if (out.browser === "unknown" && typeof chrome_devtools_live !== "undefined") {
      const B = chrome_devtools_live;
      const ids = async () => String(await B.chrome_devtools_live_list_pages({})).match(/^\d+(?=: )/gm) || [];
      let mine;
      try {
        const before = await ids();
        await B.chrome_devtools_live_new_page({ url: "https://app.clickup.com/", background: true });
        // The page that appeared is this program's own, so a ClickUp tab the user has open stays open.
        mine = (await ids()).find((id) => !before.includes(id));
        const path = String(await B.chrome_devtools_live_evaluate_script(
          { function: "() => new Promise((r) => setTimeout(() => r(location.pathname), 7000))" }));
        out.browser = path.includes("/login") ? "chrome-login" : "chrome";
      } catch (e) { out.chromeError = String(e).slice(0, 200); }
      finally { if (mine) { try { await B.chrome_devtools_live_close_page({ pageId: Number(mine) }); } catch (e) {} } }
    }
    if (out.browser === "unknown") out.browser = "none";
  }
  console.log(JSON.stringify(out));
})();
```

Act on each result in this order, and run the program again after each fix. Ask with the runtime's structured question tool, such as `AskUserQuestion` in Claude Code, and fall back to a one-line question and a wait where the runtime has none. After two rechecks of the same state, stop and report what is missing instead of asking again.
1. **`mcp: "not-connected"` or `"login"`.** Ask: "ClickUp needs a one-time approval. When you pick Ready, a ClickUp 'allow access' tab opens in your browser. Approve it within about a minute." Offer **Ready** and **Skip ClickUp for now**. On Ready, register the `clickup_official` manual again with Code Mode's `register_manual`, using its entry from `.utcp_config.json`. The call waits for the approval and succeeds once it lists tools. Where the runtime has no `register_manual`, ask the user to restart the client or reconnect Code Mode and approve the tab that opens.
2. **`mcp: "error"`.** Report `mcpError` and stop. It is not a login problem.
3. **`asideError` contains `Not connected`.** Register the `aside` manual again from its `.utcp_config.json` entry and rerun the check. This needs no question.
4. **`browser: "aside-login"` or `"chrome-login"`.** Ask: "Log in to ClickUp in {Aside or Chrome}, then pick Logged in." Offer **Logged in** and **Skip the gap removal**.
5. **`browser: "none"`.** Ask: "To remove the divider gaps I need Aside open, or Chrome open with remote debugging turned on at `chrome://inspect/#remote-debugging`." Offer **Aside is open**, **Chrome is ready** and **Skip the gap removal**.

When every part reads `ok`, `aside` or `chrome`, the session is ready, and later writes in it skip the check. A login that fails later, such as `login: true` from the gap pass, goes straight to the matching question above. When the user picks a skip, the write still happens if the MCP is ready, and the report names what was skipped, for example the gaps left on each page. Never call such a page delivered without saying so.

---

## 4. WHAT THE MCP CAN AND CANNOT DO

Use the **official MCP** for:
- Creating tasks whose description carries markdown, including subtasks through `parent` (`cupt add` creates a task but sends only the plain `description` field)
- Documents: creating them, listing their pages and reading, creating or updating pages
- Keyword search across tasks, docs and chats, and field filtering of tasks
- Lists and folders: create, read and update
- Task relations: dependencies, links, extra lists, moves and merges
- Comment threads, chat channels and reminders

Use **cupt** for daily task work: listing your queue, showing a task, completing it with a dry run, notes, timers and tags (see `cupt-commands.md`).

**No route on either surface.** The hosted server has no tools for goals or OKRs, bulk task creation or bulk update, webhooks, editing checklists, spaces, views, editing or deleting space tags, task templates, guests, user groups, audit logs or product feedback. It also has no whole-document read or update. Documents are read and written page by page. No tool deletes a document or a page, so a page the API creates stays until someone deletes it in the ClickUp app (checked 2026-11-05). Run trial writes in one scratch doc and tell the user what to delete. Its operator catalog (`clickup_get_operators`) returned "Enabled operators: none" for workspace `90151466006` on 2026-10-08, so `clickup_execute_operator` adds nothing either. Tell the user the feature is not available rather than routing it anywhere.

Two reads survive for things that cannot be edited: `clickup_get_task` with `include: ["checklists"]` returns a task's checklists, and `include: ["dependencies"]` returns its dependencies.

---

## 5. TOOL INVENTORY (67 TOOLS, LIVE 2026-11-06)

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

### Task relations and tags (8)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_add_task_dependency` | Set a directional dependency where one task blocks the other | `task_id`, `depends_on`, `type` |
| `clickup_remove_task_dependency` | Remove a dependency between two tasks | `task_id`, `depends_on`, `type` |
| `clickup_add_task_link` | Link two tasks together | `task_id`, `links_to` |
| `clickup_remove_task_link` | Remove a link between two tasks | `task_id`, `links_to` |
| `clickup_add_tag_to_task` | Add existing tag to task | `task_id`, `tag_name` |
| `clickup_remove_tag_from_task` | Remove tag from task | `task_id`, `tag_name` |
| `clickup_create_space_tag` | Create a tag in a space so tasks can carry it; an existing tag of that name comes back unchanged with `created: false` | `space_id`, `name` |
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

### Workspace structure (9)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_workspace_hierarchy` | Get workspace hierarchy (spaces, folders, lists) with pagination and depth control | none |
| `clickup_create_list` | Create a list in a ClickUp space | `name` |
| `clickup_create_list_in_folder` | Create a list in a ClickUp folder | `name`, `folder_id` |
| `clickup_get_list` | Get list details by list_id or list_name | none |
| `clickup_get_list_location` | Get the names and links of the space and folders that contain a list | `list_id` |
| `clickup_update_list` | Update a ClickUp list | `list_id` |
| `clickup_create_folder` | Create folder in ClickUp space | `name` |
| `clickup_get_folder` | Get folder details by folder_id or folder_name (+ space info) | none |
| `clickup_update_folder` | Update a ClickUp folder | `folder_id` |

### Attachments (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_attach_task_file` | Attach file to task | `task_id` |
| `clickup_request_attachment_upload` | Get short-lived, structured upload details (upload URL, ticket, HTTP method, and multipart field name) to attach a LOCAL file (any size) to a task | `task_id` |
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

### Chat (7)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_chat_channels` | List chat channels in the workspace with pagination support | none |
| `clickup_get_chat_channel_messages` | Get messages for a chat channel | `channel_id` |
| `clickup_get_chat_message_replies` | Get threaded replies for a chat message by message_id | `message_id` |
| `clickup_send_chat_message` | Send a message or threaded reply to a chat channel | `channel_id`, `content` |
| `clickup_update_chat_message` | Edit a message or reply you posted, or resolve or reassign it; `content` replaces the whole message | `message_id` |
| `clickup_react_to_chat_message` | Add or remove your emoji reaction on a message or reply | `message_id`, `action`, `reaction` |
| `clickup_delete_chat_message` | Delete a message, reply or post, which cannot be undone; a top-level message takes its replies with it | `message_id` |

### Reminders (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_create_reminder` | Create a personal reminder in your ClickUp workspace | `title`, `due_date` |
| `clickup_search_reminders` | Search and list your reminders | none |
| `clickup_update_reminder` | Update a reminder by reminder_id | `reminder_id` |

### Members (4)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_workspace_members` | List all members in the workspace | none |
| `clickup_find_member_by_name` | Get a member in the ClickUp workspace by name or email | `name_or_email` |
| `clickup_resolve_assignees` | Convert names, emails, or "me" to numeric ClickUp user IDs | `assignees` |
| `clickup_get_user` | Get the signed-in user with their timezone and current time; call it before working out a relative date | none |

### Operator catalog (3)

| Tool | What it does | Required |
|------|--------------|----------|
| `clickup_get_operators` | Lists the Unified API operators enabled on this server (`<model>.<operator>` pairs) with each one's HTTP route, parameters and request/response body | none |
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

One more trap has no markdown fix: every divider on a page the server writes shows an empty line under it in the ClickUp app. Section 8 covers how to detect it and how to remove it.

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
    document_id: doc.document_id,
    name: "What went well",
    content: "- Shipped on time\n- Clear handoffs",
    content_format: "text/md",
  });
  console.log(JSON.stringify({ doc_id: doc.document_id, page_id: page.page_id }));
})();
```

The IDs come back under their own names, checked 2026-11-05: `clickup_create_document` returns `document_id` and `document_url`, `clickup_create_document_page` returns `page_id`, and `clickup_get_document_pages` returns `{ pages: [{ id, name, content, date_updated, ... }] }`.

To change an existing page, read it first with `clickup_get_document_pages`, then call `clickup_update_document_page`. Its default `content_edit_mode` is `replace`, which overwrites the whole page. `append` and `prepend` keep the existing content. In a ClickUp doc URL, the first ID after `/v/dc/` or `/docs/` is the `document_id` and the second is the `page_id`.

### Divider spacing on pages the server writes

Every divider the server writes gets an empty line under it, so a page built from markdown with `* * *` dividers shows a double gap below each one. Observed on 2026-11-05 across 65 pages:
- It happens on `clickup_create_document_page`, and on `clickup_update_document_page` in `replace` and `append` mode, for every divider spelling: `* * *`, `---`, `***`, `___` and `- - -`. Blank lines around the divider change nothing, and a raw `<hr>` arrives as literal text.
- A page whose dividers were made in the ClickUp editor keeps them tight, and a `replace` on such a page wrote a new divider tight as well. The gap comes from a page built from nothing, not from the markdown.
- The markdown read-back cannot show it. `content_format: "text/md"` returns the same `* * *` with blank lines around it either way.

**Detect it with the plain-text read-back.** `clickup_get_document_pages` with `content_format: "text/plain"` returns each divider as a single space. A tight divider runs straight into the next line (`"\n Who gets it"`), and a divider with the gap ends its own line (`"\n \nWho gets it"`). Count gaps with `/(^|\n) \n/g` and tight dividers with `/(^|\n) [^\n]/g`. An image at the end of a page also reads as `" \n"`, so check the text around each hit before calling it a divider.

**The server has no fix.** No markdown spelling and no edit mode writes a tight divider. The fix happens in the ClickUp editor: put the caret on the empty line under the divider and press Delete, the forward delete. The next line moves up and keeps its own format, so a list stays a list and a heading stays a heading.

### Required after every page write

Every `clickup_create_document_page` or `clickup_update_document_page` call ends with this routine, in the same turn, before the push is reported. It belongs to the write the user approved, so it needs no second yes: it removes only empty lines, and step 4 proves the text is unchanged.

1. **Check the import.** Read the page with `content_format: "text/md"` and compare it with the markdown you sent, both normalized: trailing spaces and blank lines dropped, and `[url](url)` unwrapped to the bare URL. A line you sent that is missing from the read-back is an import defect, such as an escaped `\*\*`, a paragraph turned into a heading above a divider, a literal `\[\]` or an auto-linked `.md` name. Fix the content and write the page again before step 2. A bold run that ClickUp re-split around inline code is not a defect.
2. **Count the gaps.** Read the page with `content_format: "text/plain"` and count `/(^|\n) \n/g`. Zero means the routine is done.
3. **Remove the gaps.** Run one of the two programs below. Both work in a browser the user is already logged in to, in a tab of their own, and close that tab when they finish:
   - **Aside first** (`mcp-aside-devtools`). The `aside` manual drives the user's own Aside browser. `openTab` opens the page as a background tab, so the user's active tab and window stay as they are and they can keep working while the pass runs. Measured on 2026-11-06: the active tab in each window was the same before and after a pass, and the pass tab reported `active: false`.
   - **Chrome as the fallback** (`mcp-chrome-devtools`). The `chrome_devtools_live` manual runs `chrome-devtools-mcp --autoConnect` and attaches to the user's own Chrome. It needs Chrome open with remote debugging turned on once at `chrome://inspect/#remote-debugging`. Never use `chrome_devtools_1` or `chrome_devtools_2` for this: they are isolated, so every run starts logged out, and ClickUp keeps a login only for the browser session, so a saved profile does not help either.

   When no browser tool is available, or a page opens on ClickUp's login screen (`login: true`), stop and tell the user the gap count per page and which browser needs the ClickUp login. Run the program again once they confirm.
4. **Report per page:** import diff lines, gaps before, gaps left and whether the text is unchanged. A page with gaps left or changed text is not delivered. Say which, and why.

**Aside program.** It runs steps 1, 3 and 4 for a batch of pages. Fill in the constants and paste it as the `code` of one `mcp__code_mode__call_tool_chain` call. The read-backs run in Code Mode and the editor pass runs in one `aside.aside_repl` call per page. That tool needs a `title`, and its REPL keeps one shared scope between calls, so the pass runs inside its own function. Each call stops after about 12 seconds of work, under Code Mode's 30-second limit per tool call, and keeps its tab for the next call, so a page with many dividers takes several calls. Give the `call_tool_chain` call a `timeout` of about 60 seconds per page. Keep batches to about ten pages, because each page takes 10 to 20 seconds and a longer call moves to the background. The editor selectors are ClickUp internals as of 2026-11-05 and can change. Verified on 2026-11-06 on eleven scratch pages, including two with 74 dividers and runs with Aside minimized: every gap removed, text unchanged, no login prompt, the user's active tabs unchanged. A long page that needed two calls finished on the same tab and left no tab open.

```javascript
(async () => {
  const WORKSPACE = "WORKSPACE_ID";
  const DOC = "DOCUMENT_ID";
  const PAGES = [{ id: "PAGE_ID", sent: "THE MARKDOWN YOU SENT" }];
  const read = async (id, format) => (await clickup_official.clickup_official_clickup_get_document_pages(
    { document_id: DOC, page_ids: [id], content_format: format })).pages[0].content;
  const norm = (text) => text.split("\n").map((l) => l.replace(/[  ]+$/, ""))
    .filter((l) => l.trim() !== "").map((l) => l.replace(/\[(https?:[^\]\s]+)\]\(\1\)/g, "$1"));
  const gaps = (text) => (text.match(/(^|\n) \n/g) || []).length;
  // Returns the number of empty blocks under a divider and puts the caret in the first one.
  // -1 means no editor on the page, -2 means ClickUp showed its login screen.
  const PICK = `() => {
    if (location.pathname.includes("/login")) return -2;
    const ed = document.querySelector(".ql-editor"); if (!ed) return -1; ed.focus();
    const empty = [...ed.querySelectorAll(":scope > hr.ql-divider")].map((h) => h.nextElementSibling)
      .filter((n) => n && n.classList.contains("ql-block") && n.textContent === ""
        && n.children.length === 1 && n.firstElementChild.tagName === "BR");
    if (!empty.length) return 0;
    const sel = window.getSelection(); sel.removeAllRanges();
    const range = document.createRange(); range.setStart(empty[0], 0); range.collapse(true); sel.addRange(range);
    return empty.length;
  }`;
  // One call works for about 12 seconds, under Code Mode's 30-second tool limit, and keeps its tab
  // in the REPL between calls, so a long page takes several calls on the same tab.
  const editorPass = (url) => `await (async () => {
    const U = ${JSON.stringify(url)};
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const all = (globalThis.__clickupGapPass ||= {});
    const st = (all[U] ||= { p: await openTab(U), attempt: 0, loaded: false, stall: 0, presses: 0, editor: false });
    const pick = () => st.p.evaluate(${JSON.stringify("(" + PICK + ")()")});
    const t0 = Date.now();
    let n = 0, login = false, done = false;
    while (Date.now() - t0 < 12000) {
      if (!st.loaded) {
        if (st.attempt) await st.p.goto(U);
        await sleep(6000 + st.attempt * 2000); st.loaded = true;
      }
      n = await pick();
      if (n === -2) { login = true; done = true; break; }
      if (n === -1) { st.attempt++; st.loaded = false; if (st.attempt >= 3) { done = true; break; } continue; }
      st.editor = true;
      if (n === 0 || st.presses >= 300) { done = true; break; }
      await st.p.keyboard.press("Delete"); st.presses++;
      const m = await pick();
      if (m < n) { st.stall = 0; continue; }
      if (++st.stall < 3) { await sleep(2000); continue; }
      st.stall = 0; st.attempt++; st.loaded = false;
      if (st.attempt >= 3) { done = true; break; }
    }
    if (done) {
      if (!st.editor && !login) login = (await pick()) === -2;
      await sleep(3500); await closeTab(st.p); delete all[U];
    }
    console.log("RESULT " + JSON.stringify({ done, presses: st.presses, left: Math.max(n, 0), login, editor: st.editor }));
  })();`;
  const report = [];
  for (const page of PAGES) {
    const md = await read(page.id, "text/md");
    const got = new Set(norm(md));
    const importDiff = norm(page.sent).filter((line) => !got.has(line));
    const gapsBefore = gaps(await read(page.id, "text/plain"));
    let browser = { presses: 0, login: false, editor: true }, calls = 0;
    while (gapsBefore > 0 && calls < 30) {
      const raw = JSON.stringify(await aside.aside_repl({ title: "clickup divider gaps",
        code: editorPass(`https://app.clickup.com/${WORKSPACE}/v/dc/${DOC}/${page.id}`) }));
      const m = /RESULT (\{[^}]*\})/.exec(raw.replace(/\\"/g, '"'));
      browser = m ? JSON.parse(m[1]) : { error: raw.slice(0, 300) }; calls++;
      if (!m || browser.done) break;
    }
    const after = await read(page.id, "text/md");
    const plainHits = gaps(await read(page.id, "text/plain"));
    // The editor counts only dividers. The plain-text count also catches an image at the end of a block.
    const gapsLeft = browser.editor && !browser.login && browser.done !== false ? (browser.left ?? plainHits) : plainHits;
    report.push({ page: page.id, importDiff, gapsBefore, ...browser, calls, gapsLeft, plainHits,
      textUnchanged: norm(after).join("\n") === norm(md).join("\n") });
  }
  console.log(JSON.stringify(report));
})();
```

A report with an `error` field means the Aside call failed before the editor pass, for example because Aside is closed. Open Aside and run the program again.

**Chrome program.** The same routine through `chrome_devtools_live`. It opens the first page with `new_page` in the background, so the user's view does not change and their selected tab is never navigated away, reuses that tab for the rest of the batch and closes it at the end. `chrome_devtools_live` is the name in this repository's Code Mode, so use the name your `list_tools()` shows. Verified on 2026-11-06 on two scratch pages: every gap removed, text unchanged, no login prompt, only its own tab closed.

```javascript
(async () => {
  const WORKSPACE = "WORKSPACE_ID";
  const DOC = "DOCUMENT_ID";
  const PAGES = [{ id: "PAGE_ID", sent: "THE MARKDOWN YOU SENT" }];
  const B = chrome_devtools_live;
  const read = async (id, format) => (await clickup_official.clickup_official_clickup_get_document_pages(
    { document_id: DOC, page_ids: [id], content_format: format })).pages[0].content;
  const norm = (text) => text.split("\n").map((l) => l.replace(/[  ]+$/, ""))
    .filter((l) => l.trim() !== "").map((l) => l.replace(/\[(https?:[^\]\s]+)\]\(\1\)/g, "$1"));
  const gaps = (text) => (text.match(/(^|\n) \n/g) || []).length;
  const sleep = (ms) => B.chrome_devtools_live_evaluate_script(
    { function: `() => new Promise((r) => setTimeout(() => r(1), ${ms}))` });
  const number = (result) => { const m = /```json\n(-?\d+)/.exec(result); return m ? Number(m[1]) : -9; };
  // Returns the number of empty blocks under a divider and puts the caret in the first one.
  // -1 means no editor on the page, -2 means ClickUp showed its login screen.
  const PICK = `() => {
    if (location.pathname.includes("/login")) return -2;
    const ed = document.querySelector(".ql-editor"); if (!ed) return -1; ed.focus();
    const empty = [...ed.querySelectorAll(":scope > hr.ql-divider")].map((h) => h.nextElementSibling)
      .filter((n) => n && n.classList.contains("ql-block") && n.textContent === ""
        && n.children.length === 1 && n.firstElementChild.tagName === "BR");
    if (!empty.length) return 0;
    const sel = window.getSelection(); sel.removeAllRanges();
    const range = document.createRange(); range.setStart(empty[0], 0); range.collapse(true); sel.addRange(range);
    return empty.length;
  }`;
  const ids = async () => String(await B.chrome_devtools_live_list_pages({})).match(/^\d+(?=: )/gm) || [];
  const report = [];
  let opened = null, mine = null;
  try {
    for (const page of PAGES) {
      const url = `https://app.clickup.com/${WORKSPACE}/v/dc/${DOC}/${page.id}`;
      const md = await read(page.id, "text/md");
      const got = new Set(norm(md));
      const importDiff = norm(page.sent).filter((line) => !got.has(line));
      const gapsBefore = gaps(await read(page.id, "text/plain"));
      let left = gapsBefore, presses = 0, login = false, editor = gapsBefore === 0;
      for (let attempt = 0; left > 0 && attempt < 3; attempt++) {
        if (!mine) {
          // The page that appears is this program's own. A tab the user has open on the same page is not.
          const before = await ids();
          await B.chrome_devtools_live_new_page({ url, background: true });
          mine = (await ids()).find((id) => !before.includes(id)) || null;
        } else {
          await B.chrome_devtools_live_select_page({ pageId: Number(mine) });
          await B.chrome_devtools_live_navigate_page({ type: "url", url });
        }
        opened = url;
        await sleep(6000 + attempt * 2000);
        let n = number(await B.chrome_devtools_live_evaluate_script({ function: PICK })), stall = 0;
        if (n === -2) { login = true; break; }
        if (n === -1) continue;
        editor = true;
        while (n > 0 && stall < 3 && presses < 300) {
          await B.chrome_devtools_live_press_key({ key: "Delete" }); presses++;
          const m = number(await B.chrome_devtools_live_evaluate_script({ function: PICK }));
          if (m >= n) { stall++; await sleep(2000); } else { stall = 0; }
          n = m;
        }
        left = Math.max(n, 0);
      }
      // ClickUp can redirect to its login screen after the editor check, so look once more.
      if (opened && !editor && !login) login = number(await B.chrome_devtools_live_evaluate_script({ function: PICK })) === -2;
      await sleep(3500);
      const after = await read(page.id, "text/md");
      const plainHits = gaps(await read(page.id, "text/plain"));
      // The editor counts only dividers. The plain-text count also catches an image at the end of a block.
      const gapsLeft = editor && !login ? left : plainHits;
      report.push({ page: page.id, login, editor, importDiff, gapsBefore, presses, gapsLeft, plainHits,
        textUnchanged: norm(after).join("\n") === norm(md).join("\n") });
    }
  } finally {
    // Close only the tab this program opened, by the page ID that appeared when it opened.
    if (mine) { try { await B.chrome_devtools_live_close_page({ pageId: Number(mine) }); } catch (e) {} }
  }
  console.log(JSON.stringify(report));
})();
```

`editor: false` means the page never showed the ClickUp editor in three tries. Check `login`, then the page ID.

`gapsLeft` comes from the editor whenever the pass reached it, and the editor counts only dividers. `plainHits` is the plain-text count after the pass, which also counts an image at the end of a block, so `gapsLeft: 0` with `plainHits: 1` on a page with an image is a clean page. When the pass never reached the editor, `gapsLeft` falls back to `plainHits`.

**Prefer `replace` on an existing page.** A page that already has editor-made dividers keeps them tight under `replace`, so the routine finds nothing to remove.

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
| Create a plain task | cupt | `cupt add "<name>" --list <id> --json` |
| Create a task with a markdown description | MCP | `cupt add` sends only the plain `description` field |
| Create or edit a document | MCP | cupt has no document surface |
| Search the workspace | MCP | `clickup_search` covers tasks, docs and chats |
| Goals, bulk create, webhooks, checklist edits | Neither | No tool on the hosted server and no enabled operator |
