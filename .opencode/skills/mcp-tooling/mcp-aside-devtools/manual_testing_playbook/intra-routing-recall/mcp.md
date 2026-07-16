---
id: AD-R03
category: intra-routing-recall
stage: routing
title: 'MCP routing'
expected_intent: MCP
expected_resources:
  - references/mcp-wiring.md
  - references/session-management.md
  - assets/utcp-aside-manual.md
version: 1.1.0.0
---
# AD-R03: MCP routing
## SCENARIO CONTRACT
- Expected intent: `MCP`
- Gold adjudication: under fallback-only assembly a scored route carries exactly its intent's declared resources, and the MCP intent declares `assets/utcp-aside-manual.md` (the UTCP manual needed for Code Mode wiring) alongside the two references — the gold lists the full declared set rather than blessing or omitting a partial one.
**Exact prompt**:
```text
Run the aside mcp server over stdio and chain its repl tool with other code mode tools in one call_tool_chain block.
```
