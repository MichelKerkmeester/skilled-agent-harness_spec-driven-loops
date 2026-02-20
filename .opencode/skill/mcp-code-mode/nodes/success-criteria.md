---
description: "Definition of done for a successful Code Mode invocation."
---
# Success Criteria

**Code Mode implementation complete when**:

- ✅ All MCP tool calls use `call_tool_chain` (no direct tool calls)
- ✅ Tool naming follows `{manual_name}.{manual_name}_{tool_name}` pattern
- ✅ Progressive discovery used (`search_tools` before calling)
- ✅ Error handling implemented (try/catch for critical operations)
- ✅ Console logging tracks workflow progress
- ✅ Return values structured consistently
- ✅ Timeouts set appropriately for workflow complexity
- ✅ Configuration validated (`.utcp_config.json` and `.env` correct)
- ✅ Type safety verified (no TypeScript errors)
- ✅ Multi-tool workflows execute atomically (all succeed or all fail)