---
description: "Completion checklist and quality targets for Chrome DevTools workflows"
---
# Success Criteria

Defines when a browser debugging or automation workflow is complete and meets quality standards.

## Browser Debugging Completion Checklist

**Workflow complete when:**

- CLI vs MCP approach selected based on availability
- bdg installation verified (or MCP configured)
- Session started successfully (`active` state)
- CDP operations executed (exit code 0, valid JSON)
- Required data captured (screenshot, logs, cookies, etc.)
- Session stopped and cleaned up
- Output provided to user
- Error handling implemented (stderr captured)
- Method discovery documented

## Quality Targets

- **Session startup**: < 5 seconds
- **Screenshot capture**: < 2 seconds
- **Console log retrieval**: < 1 second
- **Error rate**: 0% (all errors handled gracefully)

## Cross References
- [[rules|Rules]] -- Behavioral rules governing operations
- [[cli-approach|CLI Approach]] -- CLI command patterns
- [[mcp-approach|MCP Approach]] -- MCP session cleanup