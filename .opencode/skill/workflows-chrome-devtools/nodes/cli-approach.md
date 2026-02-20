---
description: "CLI (bdg) approach for browser debugging: installation, discovery, session management, and commands"
---
# CLI Approach

The CLI approach uses `browser-debugger-cli` (bdg) as the primary tool for browser debugging and automation. Prioritized for speed and token efficiency.

## Installation and Verification

```bash
# Check if installed
command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"

# Installation
npm install -g browser-debugger-cli@alpha

# Verify
bdg --version 2>&1
```

## Discovery Commands

bdg is self-documenting. Always use discovery before executing CDP methods:

```bash
bdg cdp --list                # List all CDP domains
bdg cdp --describe Page       # Show methods for a domain
bdg cdp --search screenshot   # Search across all methods
```

## Session Management

```bash
# Start session (navigates to URL)
bdg <url> 2>&1

# Check session status
bdg status 2>&1 | jq '.state'

# Stop session (always clean up)
bdg stop 2>&1
```

## Common Operations

```bash
# Screenshot
bdg dom screenshot <path>

# Console logs
bdg console --list

# Cookies
bdg network getCookies

# DOM query
bdg dom query "<selector>"

# Execute JavaScript
bdg dom eval "<expression>"

# HAR export
bdg network har <path>
```

## Error Handling Pattern

```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
command -v bdg || { echo "Install bdg first"; exit 1; }
bdg "$URL" 2>&1 || exit 1
# ... operations ...
```

## Integration with Dev Workflows

Use bdg for verification during implementation:

```bash
npm run dev &
sleep 5
bdg http://localhost:3000 2>&1
bdg dom screenshot verification.png 2>&1
bdg console --list 2>&1 > console.json
bdg stop 2>&1
```

## Cross References
- [[how-it-works|How It Works]] -- Tool comparison overview
- [[mcp-approach|MCP Approach]] -- Alternative when CLI unavailable
- [[rules|Rules]] -- ALWAYS/NEVER rules for CLI usage
- [[quick-reference|Quick Reference]] -- Command cheat sheet