---
title: "Official ClickUp MCP Tools Reference"
description: "Complete reference for the 46 official ClickUp MCP tools: priority table, invocation patterns, and when to use MCP vs cupt CLI."
trigger_phrases:
  - "clickup mcp"
  - "clickup documents"
  - "clickup goals"
  - "bulk create tasks"
  - "clickup webhooks"
  - "mcp tools"
importance_tier: "normal"
contextType: "implementation"
---

# Official ClickUp MCP Tools Reference

**MCP Server:** `github.com/clickup/clickup-mcp-server`
**Package:** `@clickup/mcp-server` (npm)
**Invocation:** Code Mode `call_tool_chain()` via `mcp__code_mode__call_tool_chain`
**Tool naming:** `clickup.clickup_{tool_name}` (all lowercase, underscores)

---

## 1. OVERVIEW

The official ClickUp MCP server exposes 46 tools across task CRUD, documents, goals, time tracking, webhooks, and enterprise features. It is the secondary surface in mcp-click-up, used for operations that cupt CLI cannot perform: creating documents, managing goals/OKRs, bulk task creation, webhooks, and enterprise audit logs.

Use this reference when:
- Routing a request to MCP (not cupt) based on the operation table in SKILL.md §2
- Writing Code Mode `call_tool_chain()` invocations
- Understanding which priority tier a tool belongs to

---

## 2. PREREQUISITES

- Code Mode MCP configured with `clickup` server in your platform config (opencode.json, .mcp.json, or claude_desktop_config.json)
- Environment variables set: `CLICKUP_API_KEY` (`pk_` token) and `CLICKUP_TEAM_ID` (numeric workspace ID)
- OpenCode / AI client restarted after config change
- Node.js 18+ and npx available (for `@clickup/mcp-server`)

See `INSTALL_GUIDE.md §4` for platform-specific configuration blocks.

---

## 3. AUTHENTICATION

| Environment Variable | Description | Example |
|---------------------|-------------|---------|
| `CLICKUP_API_KEY` | ClickUp Personal API Token | `pk_xxxxxxxxxxxxxxxx` |
| `CLICKUP_TEAM_ID` | Workspace (team) ID | `1234567` |

Get `CLICKUP_TEAM_ID`: run `cupt status` and copy the workspace ID, or run `cupt config --show`.

---

## 4. WHEN TO USE MCP VS CUPT CLI

Use the **Official MCP** when you need:
- Creating or reading ClickUp **Documents**
- Managing **Goals** and **OKRs**
- **Bulk-creating 5+ tasks** at once
- **Webhooks** (create, update, delete, list)
- **Custom views** management
- **Checklists** within tasks
- **User groups** and **guests** (Enterprise)
- **Audit logs** (Enterprise)
- **Chat** message management

Use **cupt CLI** for everything else (see `cupt_commands.md`).

---

## 5. TOOL PRIORITY TABLE

### HIGH Priority (8 tools — Daily Use)

| Tool | Method | Description |
|------|--------|-------------|
| `clickup.clickup_create_task` | POST | Create a single task in a list |
| `clickup.clickup_get_task` | GET | Get task details by ID |
| `clickup.clickup_update_task` | PUT | Update task fields (status, assignee, etc.) |
| `clickup.clickup_delete_task` | DELETE | Delete a task permanently |
| `clickup.clickup_search_tasks` | GET | Search tasks with filters |
| `clickup.clickup_get_workspace` | GET | Get workspace/team details |
| `clickup.clickup_manage_comments` | POST/GET | Create or list comments |
| `clickup.clickup_create_bulk_tasks` | POST | Create 5+ tasks in one call |

### MEDIUM Priority (19 tools — Weekly Use)

| Tool | Description |
|------|-------------|
| `clickup.clickup_update_bulk_tasks` | Bulk update multiple tasks |
| `clickup.clickup_create_subtask` | Create a subtask |
| `clickup.clickup_manage_task_dependencies` | Set/remove task dependencies |
| `clickup.clickup_create_task_link` | Link tasks together |
| `clickup.clickup_add_task_to_multiple_lists` | Add task to multiple lists |
| `clickup.clickup_manage_task_attachments` | Upload/list attachments |
| `clickup.clickup_manage_lists` | Create/update/delete lists |
| `clickup.clickup_manage_spaces` | Create/update/delete spaces |
| `clickup.clickup_manage_folders` | Create/update/delete folders |
| `clickup.clickup_manage_custom_fields` | Create/update custom fields |
| `clickup.clickup_add_tag_to_task` | Add tag to task |
| `clickup.clickup_remove_tag_from_task` | Remove tag from task |
| `clickup.clickup_manage_space_tags` | Create/update space-level tags |
| `clickup.clickup_get_views` | Get workspace/space/list views |
| `clickup.clickup_create_document` | Create ClickUp document |
| `clickup.clickup_get_document` | Get document by ID |
| `clickup.clickup_update_document` | Update document content |
| `clickup.clickup_manage_time_tracking` | Log/update time entries |
| `clickup.clickup_manage_goals` | Create/update/delete goals |

### LOW Priority (19 tools — Rare/Setup)

| Tool | Description |
|------|-------------|
| `clickup.clickup_get_task_dependencies` | Query task dependencies |
| `clickup.clickup_use_task_template` | Create task from template |
| `clickup.clickup_manage_chat` | Chat channel operations |
| `clickup.clickup_manage_webhooks` | Create/update/delete webhooks |
| `clickup.clickup_get_user_groups` | List user groups (Enterprise) |
| `clickup.clickup_manage_guests` | Guest user management (Enterprise) |
| `clickup.clickup_get_audit_logs` | Audit log access (Enterprise) |
| `clickup.clickup_provide_feedback` | Submit product feedback |
| `clickup.clickup_create_checklist` | Create task checklist |
| `clickup.clickup_update_checklist` | Update checklist items |
| `clickup.clickup_delete_checklist` | Delete checklist |
| `clickup.clickup_create_checklist_item` | Add checklist item |
| `clickup.clickup_update_checklist_item` | Update checklist item |
| `clickup.clickup_delete_checklist_item` | Remove checklist item |
| `clickup.clickup_get_document_pages` | List document pages |
| `clickup.clickup_create_document_page` | Create document page |
| `clickup.clickup_update_document_page` | Update document page |
| `clickup.clickup_get_custom_fields` | List custom fields |
| `clickup.clickup_set_custom_field_value` | Set custom field value |

---

## 6. INVOCATION PATTERN (CODE MODE)

All MCP tools are invoked via Code Mode's `call_tool_chain()`:

```typescript
// Single tool call
const result = await call_tool_chain([
  {
    tool: "clickup.clickup_get_task",
    input: {
      task_id: "abc123def"
    }
  }
]);

// Chained tool calls
const result = await call_tool_chain([
  {
    tool: "clickup.clickup_create_task",
    input: {
      list_id: "LIST_ID",
      name: "New Feature Implementation",
      description: "Implement the new feature per spec",
      priority: 2,
      tags: ["sprint", "backend"]
    }
  },
  {
    tool: "clickup.clickup_manage_comments",
    input: {
      task_id: "{{prev.id}}",
      comment_text: "Task created by AI agent",
      assignee: null
    }
  }
]);
```

---

## 7. DOCUMENT OPERATIONS

```typescript
// Create a ClickUp document
const doc = await call_tool_chain([{
  tool: "clickup.clickup_create_document",
  input: {
    name: "Sprint Retrospective",
    parent: {
      type: 4,    // 4 = list, 5 = folder, 6 = space, 7 = all, 12 = workspace
      id: "LIST_ID"
    },
    content: "# Sprint Retrospective\n\n## What went well\n...",
    content_format: "markdown"
  }
}]);

// Get document pages
const pages = await call_tool_chain([{
  tool: "clickup.clickup_get_document_pages",
  input: { doc_id: doc.id }
}]);
```

**Parent type values:**
| Type | Description |
|------|-------------|
| 4 | List |
| 5 | Folder |
| 6 | Space |
| 7 | All (workspace-level) |
| 12 | Workspace |

---

## 8. GOAL MANAGEMENT

```typescript
// Create a goal
const goal = await call_tool_chain([{
  tool: "clickup.clickup_manage_goals",
  input: {
    action: "create",
    team_id: "WORKSPACE_ID",
    name: "Q2 Product Targets",
    due_date: 1751328000000,   // Unix timestamp ms
    description: "Q2 OKR tracking",
    color: "#4a90e2"
  }
}]);
```

---

## 9. BULK TASK CREATION

```typescript
// Create multiple tasks in one call (5+ tasks)
const tasks = await call_tool_chain([{
  tool: "clickup.clickup_create_bulk_tasks",
  input: {
    list_id: "LIST_ID",
    tasks: [
      { name: "Task 1", description: "First task", priority: 2 },
      { name: "Task 2", description: "Second task", priority: 3 },
      { name: "Task 3", description: "Third task", priority: 1 }
    ]
  }
}]);
```

---

## 10. WEBHOOK MANAGEMENT

```typescript
// Create a webhook
const webhook = await call_tool_chain([{
  tool: "clickup.clickup_manage_webhooks",
  input: {
    action: "create",
    team_id: "WORKSPACE_ID",
    endpoint: "https://your-app.com/webhooks/clickup",
    events: ["taskCreated", "taskStatusUpdated", "taskCommentPosted"]
  }
}]);
```

---

## 11. ERROR HANDLING

Common error patterns and recovery:

| Error | Code | Recovery |
|-------|------|---------|
| Invalid API key | 401 | Verify `CLICKUP_API_KEY` in opencode.json env |
| Rate limited | 429 | Wait 60s, then retry with exponential backoff |
| Resource not found | 404 | Check IDs — task/list/space ID may be wrong |
| Insufficient permissions | 403 | Check token scope; may need admin access |
| Team not found | 400 | Verify `CLICKUP_TEAM_ID` is numeric workspace ID |

```typescript
// Error handling pattern
try {
  const result = await call_tool_chain([{
    tool: "clickup.clickup_get_task",
    input: { task_id: taskId }
  }]);
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

## 12. MCP VS CUPT: QUICK DECISION

| Need | Use | Reason |
|------|-----|--------|
| List tasks today | cupt | `cupt list --today --json` |
| Mark task done | cupt | Auto-resolves status, has dry-run |
| Add note | cupt | Simpler API |
| Time tracking | cupt | start/stop/add commands |
| Create document | MCP | cupt cannot |
| Manage goals | MCP | cupt cannot |
| Bulk create 5+ | MCP | More efficient |
| Set webhook | MCP | cupt cannot |
