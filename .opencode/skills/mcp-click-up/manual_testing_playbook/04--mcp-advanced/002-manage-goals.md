---
title: "04-002: Manage Goals via MCP"
---

# 04-002: Manage Goals via Official ClickUp MCP

**Goal:** Verify the official ClickUp MCP can create and retrieve goals.

## Prerequisites

- Code Mode MCP configured (see 04-001)
- Workspace has Goals feature enabled (ClickUp premium+)

## Test (via Code Mode)

```typescript
// Create a goal
const goal = await call_tool_chain([{
  tool: "clickup.clickup_manage_goals",
  input: {
    action: "create",
    team_id: "WORKSPACE_ID",
    name: "Test Goal — mcp-click-up 04-002",
    description: "Created by mcp-click-up manual testing playbook",
    color: "#4a90e2"
  }
}]);
console.log("Created goal:", goal.id, goal.name);

// Retrieve workspace to see goals
const workspace = await call_tool_chain([{
  tool: "clickup.clickup_get_workspace",
  input: {}
}]);
```

## Expected Output

Goal object with ID, name, and metadata.

## Failure Diagnosis

- `Goals feature not enabled` → Upgrade ClickUp plan or use a workspace with Goals
- `403 Forbidden` → Token needs goal management permissions
