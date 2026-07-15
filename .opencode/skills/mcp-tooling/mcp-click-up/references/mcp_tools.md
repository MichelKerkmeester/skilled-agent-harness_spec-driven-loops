---
title: "Official ClickUp MCP Tools Reference"
description: "Reference for the ClickUp MCP server (clickup_official): last-captured tool inventory (32 tools, confirmed-absent classes removed), invocation patterns, and when to use MCP vs cupt CLI."
trigger_phrases:
  - "clickup mcp"
  - "clickup documents"
  - "clickup goals"
  - "bulk create tasks"
  - "clickup webhooks"
  - "mcp tools"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.3
---

# Official ClickUp MCP Tools Reference

**MCP Server:** `clickup_official` — the `@clickup/mcp-server` package launched over stdio via `npx -y @clickup/mcp-server`, registered in `.utcp_config.json`. This is NOT the hosted `https://mcp.clickup.com/mcp` OAuth server; that claim was stale reality-drift and has been corrected.
**Auth:** `CLICKUP_API_KEY` + `CLICKUP_TEAM_ID` environment variables, interpolated into `.utcp_config.json`. Not OAuth — no browser authorization step.
**Invocation:** Code Mode `call_tool_chain({ code: "..." })` via `mcp__code_mode__call_tool_chain` (a single TypeScript code string with direct access to registered tools as hierarchical functions — not an array of `{tool, input}` records).
**Tool naming:** Code Mode namespaces every registered tool as `<manual_name>.<manual_name>_<tool_name>` — one dot then underscore; a second dot is the documented wrong-dot-notation mistake (e.g. `figma.figma_get_figma_data`, `github.github_create_issue`, `chrome_devtools_1.chrome_devtools_1_click`). For this manual that pattern is `clickup_official.clickup_official_<tool_name>`. Do not guess a tool name — confirm every one with `tool_info()`/`list_tools()` before calling.

> **Verification status (2026-07-10):** the ClickUp manual is currently UNREGISTERED in this environment — `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` are unset and a live `list_tools()` call returns zero `clickup_official.*` entries, so no tool name in this document can be live-reconfirmed right now. Separately, the npm package identifier configured in `.utcp_config.json` (`@clickup/mcp-server`) returned `404 Not Found` on the public npm registry when checked — a real, differently-named ClickUp MCP server package does exist on npm (e.g. `@taazkareem/clickup-mcp-server`), but reconciling the configured package name is a routing/infra change outside this document's scope.
>
> The tool inventory below (Sections 5 and 7) reflects the most recent successful capture on record: a direct `list_tools()` check (2026-07) found 51 tools covering task CRUD, lists/folders/spaces, documents (create + pages only, no top-level get/update-document), time tracking, chat, reminders and custom fields, and found **no goals/OKR, bulk-create, webhook, checklist, user-group, guest or audit-log tools**. That capture could not be independently reproduced in this pass (manual unregistered). Treat every tool name below as unverified until reconfirmed with a fresh `tool_info()`/`list_tools()` call once the manual is reachable; the confirmed-absent goals, webhook, checklist, user-group, guest, audit-log and bulk-create tools have been removed below rather than left as stale rows.

---

## 1. OVERVIEW

The official ClickUp MCP server is the secondary surface in mcp-click-up, used for operations that cupt CLI cannot perform. Verified so far: creating documents and document pages, time tracking, chat and reminders. Goals, bulk task creation, webhooks and enterprise features (audit logs, guests, user groups) do not currently appear in the real tool list, see the verification note above.

Use this reference when:
- Routing a request to MCP (not cupt) based on the operation table in SKILL.md §2
- Writing Code Mode `call_tool_chain({ code: "..." })` invocations
- Confirming whether a capability is supported before routing to it

---

## 2. PREREQUISITES

- Code Mode MCP configured, with the `clickup_official` manual in `.utcp_config.json` (not `opencode.json`, `.mcp.json` or `claude_desktop_config.json`, those are for native/non-Code-Mode MCP tools)
- `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` environment variables set — no browser authorization step
- AI client restarted after config change
- Node.js 18+ and npx available (the manual launches `@clickup/mcp-server` on demand via `npx -y`)

See `install_guide.md §4` for platform-specific configuration blocks.

---

## 3. AUTHENTICATION

`CLICKUP_API_KEY` + `CLICKUP_TEAM_ID` environment variables, interpolated into `.utcp_config.json` for the `clickup_official` manual. Not OAuth — there is no browser authorization step and no PKCE flow for this deployment.

---

## 4. WHEN TO USE MCP VS CUPT CLI

Use the **Official MCP** when you need:
- Creating or reading ClickUp **Documents**
- **Chat** message management
- Operations outside cupt's 50-feature surface generally (verify the specific tool exists first — see the verification note above)

The following capability classes were explicitly confirmed **absent** from the last successful live inventory and have been removed from this reference's tool list and examples: **Goals/OKRs, bulk task creation, Webhooks, Checklists, User groups and guests (Enterprise), Audit logs (Enterprise)**. Do not route requests for these to MCP; there is currently no known way to fulfill them through this server.

Use **cupt CLI** for everything else (see `cupt_commands.md`).

---

## 5. TOOL INVENTORY (LAST CAPTURED, UNVERIFIED THIS PASS)

The tables below list tools from the most recent successful `list_tools()` capture (2026-07) that were NOT among the confirmed-absent classes. Every name still needs live reconfirmation via `tool_info()` before use — absence from the confirmed-absent list is not the same as a fresh existence check. Confirmed-absent tools (goals, bulk-create, webhooks, checklists, user groups, guests, audit logs) have been removed rather than left as stale rows.

### Task CRUD (7 tools)

| Tool (append to `clickup_official.clickup_official_`) | Method | Description |
|------|--------|-------------|
| `clickup_create_task` | POST | Create a single task in a list |
| `clickup_get_task` | GET | Get task details by ID |
| `clickup_update_task` | PUT | Update task fields (status, assignee, etc.) |
| `clickup_delete_task` | DELETE | Delete a task permanently |
| `clickup_search_tasks` | GET | Search tasks with filters |
| `clickup_get_workspace` | GET | Get workspace/team details |
| `clickup_manage_comments` | POST/GET | Create or list comments |

### Structure, Documents & Time Tracking (11 tools)

| Tool (append to `clickup_official.clickup_official_`) | Description |
|------|-------------|
| `clickup_update_bulk_tasks` | Bulk update multiple existing tasks (not bulk create) |
| `clickup_create_subtask` | Create a subtask |
| `clickup_manage_task_dependencies` | Set/remove task dependencies |
| `clickup_create_task_link` | Link tasks together |
| `clickup_add_task_to_multiple_lists` | Add task to multiple lists |
| `clickup_manage_task_attachments` | Upload/list attachments |
| `clickup_manage_lists` | Create/update/delete lists |
| `clickup_manage_spaces` | Create/update/delete spaces |
| `clickup_manage_folders` | Create/update/delete folders |
| `clickup_manage_custom_fields` | Create/update custom fields |
| `clickup_manage_time_tracking` | Log/update time entries |

### Tags, Views & Low-Frequency (14 tools)

| Tool (append to `clickup_official.clickup_official_`) | Description |
|------|-------------|
| `clickup_add_tag_to_task` | Add tag to task |
| `clickup_remove_tag_from_task` | Remove tag from task |
| `clickup_manage_space_tags` | Create/update space-level tags |
| `clickup_get_views` | Get workspace/space/list views |
| `clickup_create_document` | Create ClickUp document |
| `clickup_get_task_dependencies` | Query task dependencies |
| `clickup_use_task_template` | Create task from template |
| `clickup_manage_chat` | Chat channel operations |
| `clickup_provide_feedback` | Submit product feedback |
| `clickup_get_document_pages` | List document pages |
| `clickup_create_document_page` | Create document page |
| `clickup_update_document_page` | Update document page |
| `clickup_get_custom_fields` | List custom fields |
| `clickup_set_custom_field_value` | Set custom field value |

Note: no top-level `get_document`/`update_document` tool was found in the last inventory — only creation and page-level operations. Treat those two capabilities as unsupported until proven otherwise (see `feature_catalog/mcp_medium_priority/{get-document,update-document}.md`).

---

## 6. MARKDOWN TRANSPORT CONTRACT (READ BEFORE THE EXAMPLES)

The plain `description` field stores text literally — markdown submitted there renders in ClickUp as raw `### Heading` / `**bold**` / `- [ ]` strings. Whenever the content contains markdown syntax:

- Task create: use `markdown_description` (never plain `description`)
- Task update via raw v2 API or the Code Mode server: use `markdown_content` (`markdown_description` is also accepted)
- Task update via the claude.ai ClickUp connector: use `markdown_description`
- Documents and pages: use `content` + `content_format: "markdown"` (connector pages use `"text/md"`)
- Read-back: add `include_markdown_description=true` to get calls

Live-verified against the ClickUp v2 REST API on 2026-07-15: content submitted through these parameters converts to rendered rich text; a scratch-task round trip confirmed headings, bold, and checkbox rendering on create and on both update parameter names, and a full Product Owner task export pushed the same day rendered end-to-end with headings, bold, dividers, and checkboxes intact.

Push shape for markdown artifacts: the document's H1 becomes the task `name` (drop it from the body) and internal HTML comments (processing metadata) are stripped before submission; everything else travels verbatim.

This contract exists because tickets written through plain `description` landed in the Barter workspace as unreadable raw markdown.

---

## 7. INVOCATION PATTERN (CODE MODE)

`call_tool_chain` takes a single `code` string (TypeScript), not an array of `{tool, input}` records. It has direct access to every registered tool as a hierarchical function:

```typescript
// Single tool call
const result = await call_tool_chain({
  code: `
    const task = await clickup_official.clickup_official_clickup_get_task({
      task_id: "abc123def",
    });
    return task;
  `,
});

// Chained tool calls in one code string
const result = await call_tool_chain({
  code: `
    const task = await clickup_official.clickup_official_clickup_create_task({
      list_id: "LIST_ID",
      name: "New Feature Implementation",
      markdown_description: "### About\\n\\nImplement the new feature per spec.\\n\\n**Checklist**\\n- [ ] Ship it",
      priority: 2,
      tags: ["sprint", "backend"],
    });
    const comment = await clickup_official.clickup_official_clickup_manage_comments({
      task_id: task.id,
      comment_text: "Task created by AI agent",
    });
    return { task, comment };
  `,
});
```

Confirm every callable name with `tool_info()`/`list_tools()` before hardcoding it — the names above are last-captured, not live-verified this pass. The same parameter names exist on the native claude.ai ClickUp connector (`mcp__claude_ai_ClickUp__clickup_create_task` exposes `markdown_description`). This contract exists because tickets written through plain `description` landed in the Barter workspace as unreadable raw markdown.

---

## 8. DOCUMENT OPERATIONS

```typescript
// Create a ClickUp document, then list its pages
const result = await call_tool_chain({
  code: `
    const doc = await clickup_official.clickup_official_clickup_create_document({
      name: "Sprint Retrospective",
      parent: {
        type: 4,    // 4 = list, 5 = folder, 6 = space, 7 = all, 12 = workspace
        id: "LIST_ID",
      },
      content: "# Sprint Retrospective\\n\\n## What went well\\n...",
      content_format: "markdown",
    });
    const pages = await clickup_official.clickup_official_clickup_get_document_pages({
      doc_id: doc.id,
    });
    return { doc, pages };
  `,
});
```

**Parent type values:**
| Type | Description |
|------|-------------|
| 4 | List |
| 5 | Folder |
| 6 | Space |
| 7 | All (workspace-level) |
| 12 | Workspace |

There is no top-level `get_document`/`update_document` tool in the last inventory — only `clickup_create_document` and the document-pages tools were confirmed.

---

## 9. ERROR HANDLING

Common error patterns and recovery:

| Error | Code | Recovery |
|-------|------|---------|
| Not authorized / connection fails | 401 | Check `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` are set and valid — there is no browser step for this deployment |
| Rate limited | 429 | Wait 60s, then retry with exponential backoff |
| Resource not found | 404 | Check IDs — task/list/space ID may be wrong |
| Insufficient permissions | 403 | The API key's account may need admin access in that workspace |
| Tool not found | n/a | Manual not registered, or the callable name has changed — run `list_tools()`/`tool_info()` before retrying |

```typescript
// Error handling pattern
try {
  const result = await call_tool_chain({
    code: `
      return await clickup_official.clickup_official_clickup_get_task({ task_id: "${taskId}" });
    `,
  });
  return result;
} catch (error) {
  if (error.code === 429) {
    // Rate limited — wait and retry
    await delay(60000);
    return retry();
  }
  throw error;
}
```

---

## 10. MCP VS CUPT: QUICK DECISION

| Need | Use | Reason |
|------|-----|--------|
| List tasks today | cupt | `cupt list --today --json` |
| Mark task done | cupt | Auto-resolves status, has dry-run |
| Add note | cupt | Simpler API |
| Time tracking | cupt | start/stop/add commands |
| Create document | MCP | cupt cannot |
| Manage goals | Neither | Confirmed absent from the last MCP inventory; cupt has no goals surface either |
| Bulk create 5+ | Neither | Confirmed absent from the last MCP inventory; use repeated single-task calls |
| Set webhook | Neither | Confirmed absent from the last MCP inventory |
