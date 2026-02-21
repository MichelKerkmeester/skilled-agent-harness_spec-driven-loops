---
description: "Mandatory ALWAYS, NEVER, and ESCALATE rules for Chrome DevTools operations"
---
# Rules

Behavioral rules that govern all Chrome DevTools operations regardless of approach (CLI or MCP).

## ALWAYS Rules

**ALWAYS do these without asking:**

1. **ALWAYS check CLI availability first**
   - Run `command -v bdg` before any operation
   - Prefer CLI over MCP when available

2. **ALWAYS verify bdg installation** before first use
   - `command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"`

3. **ALWAYS use discovery commands** when exploring
   - Start with `--list`, `--describe`, `--search`
   - Document how you found the method

4. **ALWAYS verify session status** before CDP commands
   - `bdg status 2>&1 | jq '.state'`

5. **ALWAYS capture stderr** with `2>&1`
   - Essential for error handling
   - All bdg commands should include this

6. **ALWAYS stop sessions** after operations
   - `bdg stop 2>&1` or use trap pattern

7. **ALWAYS use jq** for JSON processing
   - Avoid string manipulation on JSON output

## NEVER Rules

**NEVER do these:**

1. **NEVER execute CDP commands without verifying session**
   - Session must be `active` state first

2. **NEVER hardcode CDP method lists**
   - Use self-discovery instead
   - Methods change between versions

3. **NEVER skip error handling**
   - Always use `2>&1` pattern
   - Check exit codes in scripts

4. **NEVER leave sessions running**
   - Cleanup with `bdg stop` or trap
   - Browser processes consume resources

5. **NEVER assume method names**
   - Verify with `--describe` first
   - Method signatures vary

6. **NEVER use on Windows without WSL**
   - PowerShell/Git Bash not supported

## ESCALATE IF

**Ask user when:**

1. **ESCALATE IF bdg not installed on Windows**
   - WSL required for Windows support
   - Ask if they have WSL configured

2. **ESCALATE IF Chrome/Chromium not found**
   - May need `CHROME_PATH` environment variable
   - Ask user to specify browser location

3. **ESCALATE IF session fails after 3 retries**
   - May indicate deeper issue
   - Ask about browser permissions/sandbox

4. **ESCALATE IF task requires cross-browser testing**
   - bdg is Chrome-only
   - Suggest Puppeteer/Playwright for cross-browser

5. **ESCALATE IF complex UI testing needed**
   - May be better suited for Puppeteer/Playwright
   - Ask about test framework preferences

## Cross References
- [[cli-approach|CLI Approach]] -- CLI commands and patterns
- [[mcp-approach|MCP Approach]] -- MCP session cleanup rules
- [[success-criteria|Success Criteria]] -- Quality gates