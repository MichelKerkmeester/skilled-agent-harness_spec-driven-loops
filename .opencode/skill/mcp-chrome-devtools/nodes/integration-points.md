---
description: "Framework integration, related skills, tool usage guidelines, and external tool dependencies"
---
# Integration Points

How this skill connects to the broader framework, other skills, and external tools.

## Framework Integration

This skill operates within the behavioral framework defined in AGENTS.md.

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

## Related Skills

**mcp-code-mode**: Required for MCP fallback approach
- When CLI unavailable, Code Mode provides alternative
- Tool naming: `{manual_name}.{manual_name}_{tool_name}`

**sk-code--web**: Phase 3 browser testing integration
- Use bdg for verification during implementation
- Example integration pattern:
  ```bash
  npm run dev &
  sleep 5
  bdg http://localhost:3000 2>&1
  bdg dom screenshot verification.png 2>&1
  bdg console --list 2>&1 > console.json
  bdg stop 2>&1
  ```

## Tool Usage Guidelines

**Bash**: All bdg commands, session management, error handling
**Read**: Load reference files when detailed guidance needed
**Grep**: Filter command output, search logs
**Glob**: Find screenshot files, locate HAR exports

## External Tools

**browser-debugger-cli (bdg)**:
- Installation: `npm install -g browser-debugger-cli@alpha`
- Purpose: Primary CLI for browser debugging
- Fallback: Use MCP via Code Mode if unavailable

**Chrome/Chromium**:
- Installation: System package manager or direct download
- Purpose: Browser runtime for CDP connection
- Fallback: Set `CHROME_PATH` if not auto-detected

## Cross References
- [[cli-approach|CLI Approach]] -- CLI tool details
- [[mcp-approach|MCP Approach]] -- MCP tool details
- [[how-it-works|How It Works]] -- Architecture overview