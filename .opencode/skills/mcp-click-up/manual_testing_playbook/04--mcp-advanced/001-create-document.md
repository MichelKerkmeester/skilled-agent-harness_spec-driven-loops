---
title: "04-001: Create ClickUp Document via MCP"
---

# 04-001: Create ClickUp Document via MCP

**Goal:** Verify the official ClickUp MCP can create a document in a ClickUp space/list.

## Prerequisites

- Code Mode MCP configured with `clickup` in opencode.json
- `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` set in env block
- OpenCode restarted after config change

## Test (via Code Mode)

```typescript
const result = await call_tool_chain([{
  tool: "clickup.clickup_create_document",
  input: {
    name: "Test Document — mcp-click-up 04-001",
    parent: {
      type: 7,  // 7 = all (workspace level)
      id: "WORKSPACE_ID"
    },
    content: "# Test Document\n\nCreated by mcp-click-up manual testing playbook.",
    content_format: "markdown"
  }
}]);
console.log(result);
```

## Expected Output

JSON with document ID and metadata.

## Failure Diagnosis

- `CLICKUP_API_KEY not set` → Check opencode.json env block
- `tool not found` → Verify tool name: `clickup.clickup_create_document`
- `403 Forbidden` → Token may need document write permissions
- MCP not loading → Restart OpenCode after updating opencode.json
