---
id: AD-R03
category: intra_routing_recall
stage: routing
title: 'MCP routing'
expected_intent: MCP
expected_resources:
  - references/mcp_wiring.md
  - references/session_management.md
version: 1.0.0.0
---
# AD-R03: MCP routing
## SCENARIO CONTRACT
- Expected intent: `MCP`
**Exact prompt**:
```text
Run the aside mcp server over stdio and chain its repl tool with other code mode tools in one call_tool_chain block.
```
