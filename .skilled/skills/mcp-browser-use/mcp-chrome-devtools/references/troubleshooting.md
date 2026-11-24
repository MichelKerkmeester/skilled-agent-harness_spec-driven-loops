---
title: Troubleshooting Guide
description: Error resolution guide for common bdg issues with diagnostic steps and solutions.
trigger_phrases:
  - "bdg command not found"
  - "bdg troubleshooting diagnostics"
  - "browser launch fails"
  - "bdg session not starting"
  - "cdp method not found"
  - "jq parse error bdg output"
  - "session target not found"
importance_tier: normal
contextType: implementation
version: 1.0.9.0
---

# Troubleshooting Guide

Systematic diagnostics and solutions for common bdg CLI installation, session, and browser issues.

---

## 1. OVERVIEW

### Purpose

Turn a failing `bdg` command into a named cause and the fix that addresses it.

### When to Use

- `bdg` will not install, start a session or find Chrome.
- A CDP command fails on a method name, a parameter or a missing session.
- You need the meaning of an exit code or the fix for one platform.

### Core Principle

Find root cause before attempting fixes - symptom fixes create cascading failures. Always run systematic diagnostics (5-check sequence) before implementing solutions.

---

## 2. PREREQUISITES

**Foundation:** Run quick diagnostics from this guide before deeper troubleshooting:
- **5-Check Sequence**: Installation → Version → Session → Browser → Node/npm
- **Platform Awareness**: macOS (native), Linux (native), Windows (WSL only)
- **Error Capture**: Always use `2>&1` to see full error output
- See Quick Diagnostics section below for complete diagnostic sequence

**Required Knowledge**:
- Basic Bash/terminal usage
- Package manager familiarity (npm, brew, apt)
- Path and environment variable concepts

---

## 3. QUICK DIAGNOSTICS

**Run these checks first**:

```bash
# 1. Check bdg installation
command -v bdg || echo "bdg not found - install with: npm install -g browser-debugger-cli@0.6.10"

# 2. Check bdg version
bdg --version 2>&1

# 3. Check session status
bdg status 2>&1

# 4. Check Chrome/Chromium availability
which google-chrome chromium-browser chromium 2>/dev/null

# 5. Check node/npm versions
node --version
npm --version
```

---

## 4. INSTALLATION ISSUES

### Issue: bdg command not found

**Symptoms**:
```bash
$ bdg https://example.com
bash: bdg: command not found
```

**Diagnosis**:
```bash
# Check if installed
npm list -g browser-debugger-cli

# Check npm global bin path
npm config get prefix
echo $PATH
```

**Solutions**:

1. **Install bdg**:
   ```bash
   npm install -g browser-debugger-cli@0.6.10
   ```

2. **Fix PATH if npm bin not in PATH**:
   ```bash
   # Find npm global bin directory
   NPM_BIN=$(npm config get prefix)/bin

   # Add to PATH (bash)
   echo 'export PATH="$PATH:'$NPM_BIN'"' >> ~/.bashrc
   source ~/.bashrc

   # Add to PATH (zsh)
   echo 'export PATH="$PATH:'$NPM_BIN'"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Use npx as alternative**:
   ```bash
   npx browser-debugger-cli https://example.com
   ```

---

### Issue: npm install fails

**Symptoms**:
```bash
$ npm install -g browser-debugger-cli@0.6.10
npm ERR! code EACCES
npm ERR! syscall access
```

**Diagnosis**:
```bash
# Check npm permissions
npm config get prefix
ls -la $(npm config get prefix)
```

**Solutions**:

1. **Use npx (no global install needed)**. This still downloads and runs the package, so it is an install. An agent runs it only after the operator says yes:
   ```bash
   npx browser-debugger-cli@0.6.10 https://example.com
   ```

2. **Fix npm permissions** (recommended):
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc

   npm install -g browser-debugger-cli@0.6.10
   ```

3. **Use sudo** (not recommended):
   ```bash
   sudo npm install -g browser-debugger-cli@0.6.10
   ```

---

### Issue: Wrong Node version

**Symptoms**:
```bash
$ bdg --version
Error: Node version too old
```

**Diagnosis**:
```bash
node --version
# bdg requires Node.js 20.x or higher
```

**Solution**:
```bash
# Install/update Node.js
# Using nvm (recommended)
curl -fsSLo nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh
# Read nvm-install.sh before running it
bash nvm-install.sh
nvm install 20
nvm use 20

# Or download from nodejs.org
```

---

## 5. BROWSER CONNECTION ISSUES

### Issue: Browser not found

**Symptoms**:
```bash
$ bdg https://example.com
Error: Could not find Chrome/Chromium executable
```

**Diagnosis**:
```bash
# Check for Chrome/Chromium
which google-chrome google-chrome-stable chromium chromium-browser

# Check environment variable
echo $CHROME_PATH
```

**Solutions**:

1. **macOS**:
   ```bash
   # Set Chrome path
   export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

   # Add to shell profile
   echo 'export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"' >> ~/.zshrc
   ```

2. **Linux**:
   ```bash
   # Install Chromium
   sudo apt-get install chromium-browser  # Debian/Ubuntu
   sudo yum install chromium              # RHEL/CentOS
   sudo pacman -S chromium                # Arch

   # Or set custom path
   export CHROME_PATH=/usr/bin/chromium-browser
   ```

3. **Windows (WSL)**:
   ```bash
   # Install Chrome in WSL or point to Windows Chrome
   export CHROME_PATH="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
   ```

---

### Before/After: Systematic Troubleshooting

❌ **BEFORE** (Anti-pattern - Guessing fixes):
```bash
# Browser won't launch - trying random fixes
export CHROME_PATH=/usr/bin/chrome  # Guess 1
bdg https://example.com 2>&1  # Still fails

killall chrome  # Guess 2
bdg https://example.com 2>&1  # Still fails

sudo bdg https://example.com 2>&1  # Guess 3 - dangerous!
# Still fails, now with permission issues

# Results: Wasted time, created new problems, no root cause identified
```

✅ **AFTER** (Correct - Systematic diagnosis):
```bash
# Step 1: Run 5-check diagnostic sequence
command -v bdg  # → ✓ Installed

**Validation**: `installation_verified`

bdg --version 2>&1  # → ✓ v1.0.0

**Validation**: `version_confirmed`

which google-chrome chromium-browser  # → ✗ Not found

**Validation**: `browser_missing` (root cause identified!)

# Step 2: Fix root cause (install browser)
brew install --cask google-chrome  # macOS

**Validation**: `browser_installed`

# Step 3: Verify fix
bdg https://example.com 2>&1  # → ✓ Works!

**Validation**: `session_started`
```

**Why better**: Systematic approach finds root cause, no guessing, verifiable checkpoints, prevents cascading issues.

---

### Issue: Browser launch fails

**Symptoms**:
```bash
$ bdg https://example.com
Error: Failed to launch browser
Timeout waiting for browser connection
```

**Diagnosis**:
```bash
# Check if Chrome can launch manually
google-chrome --version

# Check for conflicting processes
ps aux | grep chrome

# Check available ports
netstat -an | grep 9222  # Default debugging port
```

**Solutions**:

1. **Kill existing Chrome instances**:
   ```bash
   # macOS/Linux
   pkill -f chrome

   # Verify
   ps aux | grep chrome
   ```

2. **Use different debugging port**. bdg takes the port from `-p`. It reads no port environment variable, so `CHROME_DEBUGGING_PORT` does nothing:
   ```bash
   bdg -p 9223 https://example.com 2>&1
   ```
   On bdg 0.6.10 a port other than 9222 breaks `dom eval`, `dom click`, `dom fill`, `dom submit` and `dom pressKey`. See the "Session target not found" entry in §6 before you pick this fix.

3. **Run with headless mode** (if display issues):
   ```bash
   bdg --headless https://example.com 2>&1
   ```

4. **Check permissions** (Linux):
   ```bash
   # Add to chrome-sandbox group
   sudo chown root:root /opt/google/chrome/chrome-sandbox
   sudo chmod 4755 /opt/google/chrome/chrome-sandbox
   ```

---

## 6. SESSION MANAGEMENT ISSUES

### Issue: Session won't start

**Symptoms**:
```bash
$ bdg https://example.com
$ bdg status --json
{ "version": "0.6.10", "active": false }
```

**Diagnosis**:
```bash
# Check stderr output (debug output can include request headers, so the log stays outside the repository)
bdg https://example.com 2>&1 | tee "${TMPDIR:-/tmp}/debug.log"

# Check system resources
free -h  # Linux
vm_stat  # macOS

# Check network connectivity
curl -I https://example.com
```

**Solutions**:

1. **Verify URL is accessible**:
   ```bash
   curl -I https://example.com
   # Should return HTTP 200 OK
   ```

2. **Check the launch with debug logging**. bdg 0.6.10 has no launch-timeout setting and reads no `BDG_TIMEOUT` variable. Its `-t <seconds>` flag sets an auto-stop, not a start timeout:
   ```bash
   bdg --debug https://example.com 2>&1 | tee "${TMPDIR:-/tmp}/debug.log"
   ```

3. **Check for certificate errors**:
   ```bash
   # Bypass SSL verification (not for production)
   export NODE_TLS_REJECT_UNAUTHORIZED=0
   bdg https://example.com 2>&1
   ```

4. **Start with simpler URL**:
   ```bash
   # Test with simple page first
   bdg https://example.com 2>&1
   ```

---

### Issue: Session stuck in "starting" state

**Symptoms**: `bdg status --json` keeps reporting a session that never becomes usable, and commands against it hang or fail. Plain `bdg status` prints text, and its JSON has no `state` field, so check `.active` and the session detail it reports.

**Diagnosis**:
```bash
# Check Chrome process
ps aux | grep chrome

# Check the session record
bdg status --json | jq '.'
```

**Solutions**:

1. **Force stop and restart**:
   ```bash
   bdg stop 2>&1
   sleep 3
   pkill -9 -f chrome  # Force kill if needed
   bdg https://example.com 2>&1
   ```

2. **Clear bdg state**:
   ```bash
   # Find and remove state files
   bdg cleanup 2>/dev/null
   bdg https://example.com 2>&1
   ```

---

### Issue: Multiple sessions conflict

**Symptoms**:
```bash
$ bdg https://example.com
Error: Another session already active
```

**Diagnosis**:
```bash
bdg status 2>&1
ps aux | grep bdg
```

**Solutions**:

1. **Stop existing session**:
   ```bash
   bdg stop 2>&1
   ```

2. **Kill all bdg processes**:
   ```bash
   pkill -f "bdg "
   pkill -f browser-debugger-cli
   ```

3. **Use session management pattern**:
   ```bash
   # Check before starting
   if bdg status --json 2>/dev/null | jq -e '.active' > /dev/null; then
     echo "Stopping existing session"
     bdg stop 2>&1
   fi

   bdg https://example.com 2>&1
   ```

---

### Issue: `bdg dom eval` or a form command reports "Session target not found"

**Symptoms** (bdg 0.6.10, session started with `-p` on a port other than 9222):
```bash
$ bdg dom eval 'document.title'
Error: Session target not found (tab may have been closed)
Start a new session with: bdg <url>
```

The command exits with code 83, and the tab is still open. Adding `-p <port>` to `dom eval`, before or after `dom`, gives the same error. Screenshots, console reads and `bdg cdp` keep working in the same session.

**Cause**: in 0.6.10, `dom eval` looks for the session's tab on port 9222 and never reads the port the session was started on. A session on another port has no tab there, so the lookup fails.

The form commands `dom click`, `dom fill`, `dom submit` and `dom pressKey` fail the same way with the same exit code 83. They hard-code port 9222 in `commands/dom/formInteraction.js` and have no `-p` option at all.

**Diagnosis**:
```bash
# The port the session runs on
jq '.port' ~/.bdg/session.meta.json
```

**Solutions**:

1. **Start the session on the default port when 9222 is free**:
   ```bash
   bdg stop 2>&1
   bdg https://example.com 2>&1   # no -p, so the session uses 9222
   bdg dom eval 'document.title' 2>&1
   ```

2. **Read page values through `bdg cdp` when 9222 is taken**, for example by another Chrome. It works on any session port. This fix reads values only. It gives no route for a click or a fill, so for those use fix 1:
   ```bash
   bdg cdp Runtime.evaluate --params '{"expression":"getComputedStyle(document.querySelector(\"h1\")).color","returnByValue":true}' \
     | jq -r '.result.result.value'
   ```

---

## 7. CDP COMMAND ISSUES

### Issue: CDP method not found

**Symptoms**:
```bash
$ bdg cdp Page.screenshot
{"version":"0.6.10","success":false,"error":"Method 'Page.screenshot' not found","exitCode":81}
```

**Diagnosis**:
```bash
# Discover correct method name
bdg cdp --search screenshot

# List the methods in a domain (--describe on a domain gives counts, not method names)
bdg cdp Page --list
```

**Solution**:

Use a method name that exists. Case does not matter:
```bash
# Correct
bdg cdp Page.captureScreenshot 2>&1

# Also works (bdg normalizes case)
bdg cdp page.capturescreenshot 2>&1

# Use helper instead
bdg dom screenshot "${TMPDIR:-/tmp}/output.png" 2>&1
```

---

### Issue: CDP method fails with parameter error

**Symptoms**:
```bash
$ bdg cdp Page.navigate --params '{"url":"example.com"}'
# The call fails: Chrome rejects a URL without a protocol
```

**Diagnosis**:
```bash
# Check method signature
bdg cdp --describe Page.navigate

# Validate JSON
echo '{"url":"example.com"}' | jq .
```

**Solutions**:

1. **Fix parameter format**. Pass the JSON through `--params`. A second positional argument fails before bdg reads it, with `error: too many arguments for 'cdp'. Expected 1 argument but got 2.` and exit 1:
   ```bash
   # Use full URL with protocol
   bdg cdp Page.navigate --params '{"url":"https://example.com"}' 2>&1
   ```

2. **Escape quotes properly**:
   ```bash
   # Use single quotes for JSON, double quotes inside
   bdg cdp Page.navigate --params '{"url":"https://example.com","referrer":"https://google.com"}' 2>&1

   # Or escape double quotes
   bdg cdp Page.navigate --params "{\"url\":\"https://example.com\"}" 2>&1
   ```

3. **Use jq to build JSON**:
   ```bash
   params=$(jq -n --arg url "https://example.com" '{url: $url}')
   bdg cdp Page.navigate --params "$params" 2>&1
   ```

---

### Issue: Session required for CDP command

**Symptoms**:
```bash
$ bdg cdp Page.captureScreenshot
Error: No active session
```

**Solution**:

Start session first:
```bash
# Always verify session before CDP commands
if ! bdg status --json 2>/dev/null | jq -e '.active' > /dev/null; then
  bdg https://example.com 2>&1
fi

# Now execute CDP command
bdg cdp Page.captureScreenshot 2>&1
```

---

## 8. OUTPUT PARSING ISSUES

### Issue: jq parse error

**Symptoms**:
```bash
$ bdg status | jq .
parse error: Invalid numeric literal at line 1, column 10
```

**Diagnosis**:
```bash
# Plain bdg status prints text for people, not JSON
bdg status 2>&1 | head
```

**Cause**: `bdg status` without `--json` prints a human summary, so `jq` cannot parse it. Its no-session text also contains the word "active", so a `grep active` test is always true.

**Solutions**:

1. **Ask for JSON**:
   ```bash
   bdg status --json | jq '.'
   ```

2. **Keep stderr out of the pipe**, so a warning line cannot break the parse:
   ```bash
   bdg status --json 2>/dev/null | jq '.active'
   ```

3. **Handle errors gracefully**:
   ```bash
   output=$(bdg status --json 2>&1)
   if echo "$output" | jq . > /dev/null 2>&1; then
     echo "$output" | jq '.active'
   else
     echo "Error: Invalid JSON output"
     echo "$output"
   fi
   ```

---

### Issue: Binary data in stdout

**Symptoms**:
```bash
$ bdg dom screenshot - | jq .
parse error: ...
$ ls ./-
./-
```

**Cause**: `bdg dom screenshot` and `bdg network har` always write to a file. A missing HAR path gets a generated file name. bdg reads `-` as a file name, writes the PNG or HAR to a file named `-` in the current directory and prints a text success line such as `Screenshot captured`. jq then fails on that text.

**Solution**:

Write to a real path, then read the file:
```bash
# Save to file
bdg dom screenshot "${TMPDIR:-/tmp}/output.png" 2>&1

# Or decode the base64 data from CDP
bdg cdp Page.captureScreenshot 2>&1 | jq -r '.result.data' | base64 -d > "${TMPDIR:-/tmp}/output.png"

# Remove a stray file named - left by an earlier run
rm -f ./-
```

---

## 9. PERFORMANCE ISSUES

### Issue: Slow CDP command execution

**Symptoms**:
```bash
$ time bdg cdp Page.captureScreenshot
real    0m15.432s  # Should be much faster
```

**Diagnosis**:
```bash
# Check network latency
ping example.com

# Check browser resources
bdg cdp Memory.getDOMCounters 2>&1

# Check page complexity
bdg dom eval "document.querySelectorAll('*').length" 2>&1
```

**Solutions**:

1. **Enable CDP domains once upfront**:
   ```bash
   # Enable at session start
   bdg https://example.com 2>&1
   bdg cdp Network.enable 2>&1
   bdg cdp Runtime.enable 2>&1
   bdg cdp DOM.enable 2>&1

   # Now commands execute faster
   bdg console --list 2>&1
   ```

2. **Use helpers instead of raw CDP**:
   ```bash
    # Faster
    bdg dom screenshot "${TMPDIR:-/tmp}/output.png" 2>&1

    # Slower (raw CDP)
   bdg cdp Page.captureScreenshot 2>&1 | jq -r '.result.data' | base64 -d > "${TMPDIR:-/tmp}/output.png"
   ```

3. **Reduce page complexity**:
   ```bash
   # Block images/media
   bdg cdp Network.setBlockedURLs --params '{"urls":["*.jpg","*.png","*.mp4"]}' 2>&1
   ```

---

### Issue: High memory usage

**Symptoms**:
```bash
$ ps aux | grep chrome
... 4.5G ...  # High memory
```

**Solutions**:

1. **Stop sessions promptly**:
   ```bash
   # Always cleanup
   trap "bdg stop 2>&1" EXIT
   ```

2. **Limit concurrent sessions**:
   ```bash
   # Process sequentially instead of parallel
   for url in "${urls[@]}"; do
     bdg "$url" 2>&1
     # ... operations ...
     bdg stop 2>&1
   done
   ```

3. **Clear cache between sessions**:
   ```bash
   bdg cdp Network.clearBrowserCache 2>&1
   bdg cdp Network.clearBrowserCookies 2>&1
   ```

---

## 10. PLATFORM-SPECIFIC ISSUES

### macOS: Gatekeeper blocking Chrome

**Symptoms**:
```bash
Error: Chrome blocked by Gatekeeper
```

**Solution**:
```bash
# Allow Chrome in Security & Privacy settings
# Or use command
xattr -d com.apple.quarantine "/Applications/Google Chrome.app"
```

---

### Linux: Sandbox issues

**Symptoms**:
```bash
Error: Failed to move to new namespace
```

**Solution**:
```bash
# Disable sandbox (NOT for production)
export CHROME_DEVEL_SANDBOX=/dev/null

# Or fix permissions
sudo sysctl kernel.unprivileged_userns_clone=1
```

---

### Windows (WSL): Display issues

**Symptoms**:
```bash
Error: Could not open display
```

**Solution**:
```bash
# Use headless mode
bdg --headless https://example.com 2>&1

# Or setup X11 forwarding
export DISPLAY=:0
```

---

## 11. ERROR CODE REFERENCE

| Exit Code | Meaning | Solution |
|-----------|---------|----------|
| 0 | Success (`SUCCESS`) | N/A |
| 1 | Generic failure (`GENERIC_FAILURE`), also commander usage errors such as `too many arguments` | Check stderr output |
| 80 | Invalid URL (`INVALID_URL`) | Use a full URL with protocol |
| 81 | Invalid arguments (`INVALID_ARGUMENTS`), for example an unknown CDP method or bad `--params` JSON | Check with `bdg cdp --search` or `--describe` |
| 82 | Permission denied (`PERMISSION_DENIED`) | Check file and directory permissions |
| 83 | Resource not found (`RESOURCE_NOT_FOUND`), for example `Session target not found` | Start a session, or see the §6 port entry |
| 84 | Resource already exists (`RESOURCE_ALREADY_EXISTS`) | Stop the existing session first |
| 85 | Resource busy (`RESOURCE_BUSY`) | Wait, then retry |
| 86 | Daemon already running (`DAEMON_ALREADY_RUNNING`) | Run `bdg stop` before a new start |
| 87 | Stale cache (`STALE_CACHE`), invalidated by navigation or DOM changes | Re-run the query |
| 100 | Chrome launch failure (`CHROME_LAUNCH_FAILURE`) | Check the Chrome path (`CHROME_PATH`) |
| 101 | CDP connection failure (`CDP_CONNECTION_FAILURE`) | Check that Chrome still runs |
| 102 | CDP timeout (`CDP_TIMEOUT`) | Retry, or check page load |
| 103 | Session file error (`SESSION_FILE_ERROR`) | Run `bdg cleanup`, then start again |
| 104 | Unhandled exception (`UNHANDLED_EXCEPTION`) | Report a bug with `--debug` output |
| 105 | Signal handler error (`SIGNAL_HANDLER_ERROR`) | Report a bug with `--debug` output |
| 110 | Software error (`SOFTWARE_ERROR`) | Report a bug with `--debug` output |

Codes come from bdg 0.6.10 `utils/exitCodes.js`. The range 80-99 means a user error and 100-119 a software error. A shell that cannot find `bdg` returns 127 itself, before bdg runs.

---

## 12. DEBUG MODE

**Enable verbose logging**:
```bash
# Pass --debug (debug output can include request headers, so the log stays outside the repository)
bdg --debug https://example.com 2>&1 | tee "${TMPDIR:-/tmp}/debug.log"

# Or set BDG_DEBUG=1, the one debug variable bdg reads
BDG_DEBUG=1 bdg status 2>&1
```

---

## 13. GETTING HELP

1. **Check documentation**: [browser-debugger-cli repository](https://github.com/szymdzum/browser-debugger-cli)
2. **Search issues**: [browser-debugger-cli issues](https://github.com/szymdzum/browser-debugger-cli/issues)
3. **Report bug** with:
   - bdg version (`bdg --version`)
   - Platform (macOS/Linux/WSL)
   - Node version (`node --version`)
   - Full error output (with `2>&1`), with cookie and authorization values redacted
   - Minimal reproduction steps

---

## 14. COMMON SOLUTIONS CHECKLIST

Before reporting issues, try these:

- [ ] bdg installed globally (`npm install -g browser-debugger-cli@0.6.10`)
- [ ] bdg in PATH (`command -v bdg`)
- [ ] Chrome/Chromium installed and accessible
- [ ] Session started before CDP commands
- [ ] Session stopped after operations
- [ ] Using `2>&1` to capture full output
- [ ] Valid JSON for CDP parameters
- [ ] Correct CDP method names (check with `--describe`)
- [ ] No conflicting Chrome processes
- [ ] Sufficient system resources (memory, CPU)

---

## 15. RELATED RESOURCES

### Reference Files
- [session-management.md](./session-management.md) - Session lifecycle patterns for robust automation
- [cdp-patterns.md](./cdp-patterns.md) - CDP command examples and domain-specific patterns

### Related Skills
- `mcp-chrome-devtools` - Main skill orchestrator for bdg CLI workflows

### External Resources
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) - Official CDP documentation
- [browser-debugger-cli GitHub](https://github.com/szymdzum/browser-debugger-cli) - Source repository for reporting issues
- [Node.js Downloads](https://nodejs.org/) - Required runtime environment (Node.js 20 or later)

---

**Note**: Most issues stem from missing installation, session state mismanagement, or incorrect CDP parameter format. Always verify session status before executing commands.
