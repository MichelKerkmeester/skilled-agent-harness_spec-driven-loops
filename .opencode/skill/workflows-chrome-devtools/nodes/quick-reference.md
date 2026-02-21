---
description: "Cheat sheet of essential CLI commands, network inspection, MCP tool patterns, and error handling templates"
---
# Quick Reference

Concise command reference for both CLI and MCP approaches.

## Essential CLI Commands

```bash
# Discovery
bdg cdp --list                # List domains
bdg cdp --describe Page       # Domain methods
bdg cdp --search screenshot   # Find methods

# Session
bdg <url>                     # Start
bdg status                    # Check
bdg stop                      # Stop

# Helpers
bdg dom screenshot <path>     # Screenshot
bdg console --list            # Console
bdg network getCookies        # Cookies
bdg dom query "<sel>"         # DOM query
bdg dom eval "<expr>"         # Execute JS
bdg network har <path>        # HAR export
```

## MCP Tools (Isolated Instances)

```typescript
// Tool naming: {instance}.{instance}_{tool_name}
// Each instance runs isolated browser (--isolated=true)

// Instance 1
chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." })
chrome_devtools_1.chrome_devtools_1_take_screenshot({})
chrome_devtools_1.chrome_devtools_1_list_console_messages({})

// Instance 2 (parallel testing)
chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "..." })
chrome_devtools_2.chrome_devtools_2_take_screenshot({})
```

## Error Handling Pattern

```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
command -v bdg || { echo "Install bdg first"; exit 1; }
bdg "$URL" 2>&1 || exit 1
# ... operations ...
```

## Cross References
- [[cli-approach|CLI Approach]] -- Full CLI documentation
- [[mcp-approach|MCP Approach]] -- Full MCP documentation
- [[rules|Rules]] -- Error handling and session rules