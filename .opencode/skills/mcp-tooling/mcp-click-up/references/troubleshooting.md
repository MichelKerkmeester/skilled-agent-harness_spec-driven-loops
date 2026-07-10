---
title: "mcp-click-up Troubleshooting Guide"
description: "Error resolution for cupt CLI and official ClickUp MCP. Covers auth failures, status errors, team filter performance, and MCP connection issues."
trigger_phrases:
  - "cupt error"
  - "clickup auth failed"
  - "cupt not found"
  - "mcp connection failed"
  - "cupt done wrong status"
  - "team filter slow"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.3
---

# mcp-click-up Troubleshooting Guide

---

## 1. OVERVIEW

Diagnostic reference for cupt CLI and official ClickUp MCP errors. Start with the Quick Diagnostics sequence (§3) before diving into specific issues. Most failures fall into four categories: installation (cupt not found), authentication (401/no credentials), status resolution (wrong status on completion), and MCP connection (missing env vars or wrong tool name).

---

## 2. PREREQUISITES

- cupt installed: `cupt --version`
- Network access to ClickUp API
- For MCP issues: Code Mode MCP configured in platform config with `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`

---

## 3. QUICK DIAGNOSTICS (Run in Order)

```bash
# 1. Is cupt installed?
cupt --version

# 2. Is cupt authenticated?
cupt status

# 3. Can it reach the API?
cupt list --today --json

# 4. Does a specific task exist?
cupt show TASK_ID --json

# 5. What statuses does the list use?
cupt statuses TASK_ID
```

---

## 4. INSTALLATION ISSUES

### `command not found: cupt`

**Symptoms:** Shell prints `cupt: command not found` or `cupt: No such file or directory`

**Diagnosis:**
```bash
which cupt           # Should print /Users/you/.local/bin/cupt or similar
echo $PATH           # Check if ~/.local/bin or ~/.pipx/bin is in PATH
pipx list 2>/dev/null | grep cupt  # Is it installed via pipx?
```

**Solutions (in order):**

1. **Install via pipx (recommended):**
   ```bash
   pipx install cupt
   pipx ensurepath
   source ~/.zshrc   # or ~/.bashrc
   cupt --version    # Verify
   ```

2. **Install via pip (fallback):**
   ```bash
   pip install --user cupt
   # Add to PATH:
   export PATH="$HOME/.local/bin:$PATH"
   ```

3. **PATH fix if installed but not found:**
   ```bash
   # Find where cupt is installed:
   python3 -m site --user-base
   # Add <user-base>/bin to PATH in your shell profile
   ```

---

### Python version too old

**Symptoms:** `cupt: Python 3.8+ required` or install fails with version error

**Diagnosis:**
```bash
python3 --version   # Need 3.8+
```

**Fix:**
```bash
# macOS (Homebrew)
brew install python@3.12
# Linux (Ubuntu/Debian)
sudo apt install python3.12
```

---

## 5. AUTHENTICATION ISSUES

### `AuthError: No credentials found`

**Symptoms:** `cupt status` or any command exits with auth error

**Diagnosis:**
```bash
cupt status   # Should show workspace name if authenticated
cupt config --show  # Check stored config
```

**Solutions:**

1. **Personal API Token (simplest):**
   ```bash
   # Get token at: https://app.clickup.com/settings/apps
   cupt config --api-token pk_YOUR_TOKEN_HERE
   cupt status   # Verify
   ```

2. **OAuth interactive flow:**
   ```bash
   cupt logout   # Clear any partial state
   cupt auth     # Follow prompts
   cupt status   # Verify
   ```

**Token format:** Personal API Tokens always start with `pk_` (e.g., `pk_1234567_ABCDEFGHIJKLMNOP`).

---

### `401 Unauthorized` on API calls

**Symptoms:** Commands run but return 401 errors

**Causes:**
- Token expired (OAuth tokens expire; Personal API Tokens do not)
- Token revoked in ClickUp settings
- Wrong workspace

**Fix:**
```bash
cupt logout
cupt auth    # Re-authenticate
cupt status  # Verify workspace is correct
```

---

## 6. STATUS RESOLUTION ISSUES

### `cupt done` completes with wrong status

**Symptoms:** Task is marked with an unexpected status (e.g., "in review" instead of "done")

**Root cause:** cupt resolves the closed status per list. If the list has a non-standard closed status name, cupt may resolve incorrectly.

**Prevention:**
```bash
# ALWAYS check status schema before completing:
cupt statuses TASK_ID

# Use dry-run to verify:
cupt done TASK_ID --dry-run
# Output shows: "Resolved status: 'complete'"
# Verify this matches the expected closed status before running for real
```

**Fix if already completed:**
- cupt cannot reopen tasks (use ClickUp UI or MCP `clickup_update_task`)
- For MCP: `clickup.clickup_update_task` with `{ "status": "in progress" }` to reopen

---

### `No matching closed status` error

**Symptoms:** `cupt done` fails to find a closed status

**Cause:** The list's status schema has no status marked as "closed type" in ClickUp

**Diagnosis:**
```bash
cupt statuses TASK_ID   # List available statuses
```

**Fix:**
- Check the task's list in ClickUp UI → Settings → Statuses
- Ensure at least one status has "closed" type enabled
- Or use MCP: `clickup.clickup_update_task` with explicit status name

---

## 7. TEAM FILTER PERFORMANCE

### `cupt list --team X` is very slow (>10s)

**Root cause:** Team filters are client-side in cupt — it fetches all tasks and filters locally. This can take 5-20+ seconds on large workspaces.

**Optimization strategies:**

1. **Combine with tag filter (fastest):**
   ```bash
   cupt list --tag sprint --team "Engineering" --json
   ```
   Tag filter runs server-side first, reducing pages walked.

2. **Use --mine to limit scope:**
   ```bash
   cupt list --mine --tag sprint --json
   ```

3. **Consider MCP for large-scale searches:**
   ```typescript
   // MCP supports server-side team filtering:
   await call_tool_chain([{
     tool: "clickup.clickup_search_tasks",
     input: { assignees: ["USER_ID"], team_id: "WORKSPACE_ID" }
   }]);
   ```

---

## 8. MCP CONNECTION ISSUES

### `CLICKUP_API_KEY not set` or MCP tools not found

**Diagnosis:**
```bash
# Check if opencode.json has the clickup MCP config:
cat ~/.config/opencode/opencode.json | grep -A5 clickup
# OR (project-local):
cat .opencode/opencode.json | grep -A5 clickup
```

**Fix:**
1. Run `bash .opencode/skills/mcp-click-up/scripts/install.sh --mcp-only` to print the config snippet
2. Add the snippet to `opencode.json` under `mcpServers`
3. Set `CLICKUP_API_KEY` to your ClickUp token (`pk_xxx`)
4. Set `CLICKUP_TEAM_ID` to your workspace's numeric ID (from `cupt status`)
5. Restart OpenCode

---

### MCP tool call returns 403 Forbidden

**Cause:** Token has insufficient permissions for the operation (e.g., viewing audit logs requires admin)

**Diagnosis:** Check the specific tool in references/mcp_tools.md for permission notes

**Fix:** Use a token with appropriate workspace permissions or use cupt for equivalent daily ops

---

### MCP `tool not found` error

**Cause:** Wrong tool name format

**Fix:** All tools must be in format `clickup.clickup_{tool_name}` (e.g., `clickup.clickup_create_task`, NOT `clickup_create_task`)

---

## 9. PATH CONFLICT: `cu` vs `cupt`

**Symptom:** Running `cu` instead of `cupt` opens a UUCP program (or errors)

**Root cause:** Some Unix/Linux systems have a `cu` command for serial communication. The @krodak/clickup-cli also uses `cu`. Neither is cupt.

**Fix:** Always use `cupt` (not `cu`). The install.sh script verifies `cupt --version`, not `cu --version`.

---

## 10. EMPTY RESULTS

### `cupt list` returns `[]` (empty array)

**This is valid behavior** — an empty queue means no matching tasks exist.

**Before escalating:**
```bash
# 1. Check tag spelling (case-sensitive in some ClickUp configs):
cupt list --tag ai_ready --json   # Try exact tag name
cupt list --tag AI_Ready --json   # Try alternate case

# 2. Try wider scope:
cupt list --all --json            # Include team tasks

# 3. Verify teams:
cupt teams                        # List available team names

# 4. Try without date filter:
cupt list --all --tag ai_ready --json  # Remove --today/--week
```

**After checking all above:** Report "Queue is genuinely empty" — do not fabricate tasks.

---

## 11. CUPT UPGRADE

```bash
# Upgrade to latest version
pipx upgrade cupt

# Verify version
cupt --version
```

---

## 12. GETTING HELP

- cupt documentation: https://github.com/newz2000/cupt
- ClickUp API docs: https://clickup.com/api/
- Official MCP repo: https://github.com/clickup/clickup-mcp-server
- Report cupt bugs: https://github.com/newz2000/cupt/issues
