1. EXACT INVOCATION

**CLI path (bdg):**
- Install: `npm install -g browser-debugger-cli@alpha` (SKILL.md:202, INSTALL_GUIDE.md:221)
- Verify: `bdg --version 2>&1` (SKILL.md:202)
- Check: `command -v bdg` (SKILL.md:202)
- Start session: `bdg <url> 2>&1` (SKILL.md:323)
- Status: `bdg status 2>&1` (SKILL.md:323)
- Stop: `bdg stop 2>&1` (SKILL.md:323)
- Screenshot: `bdg dom screenshot <path> 2>&1` — produces PNG file (SKILL.md:323)
- Console: `bdg console --list 2>&1` — produces JSON array (SKILL.md:323)
- HAR: `bdg network har <path> 2>&1` — produces HAR file (SKILL.md:323)
- CDP discovery: `bdg cdp --list`, `bdg cdp --describe <domain>`, `bdg cdp --search <term>` (SKILL.md:323)
- Raw CDP: `bdg cdp <Domain.Method> '<json>' 2>&1` (SKILL.md:323)

**MCP path (Code Mode):**
- Pattern: `call_tool_chain({ code: "..." })` (SKILL.md:233)
- Tool naming convention: `{manual_name}.{manual_name}_{tool_name}` (SKILL.md:233)
- Example: `chrome_devtools_1.chrome_devtools_1_take_screenshot({})` (README.md:262)
- MCP package: `chrome-devtools-mcp` with `--isolated=true` flag (SKILL.md:216, INSTALL_GUIDE.md:341)
- Config location: `.utcp_config.json` (SKILL.md:210, INSTALL_GUIDE.md:306)
- MCP produces: screenshots, console logs, page content — returned as TypeScript objects inside `call_tool_chain()` (README.md:120-136)

**Key difference:** CLI produces files on disk (PNG, HAR) and stdout JSON; MCP returns objects in TypeScript scope. CLI is preferred for speed/token efficiency; MCP for multi-tool chaining and parallel isolated browser instances (SKILL.md:196-197).

---

2. CAPABILITY ROSTER

**Routing rule (SKILL.md:71-85):**
- CLI intent: keywords `bdg`, `browser-debugger-cli`, `terminal`, `cli` → loads `references/cdp_patterns.md`, `references/session_management.md`
- MCP intent: keywords `mcp`, `code mode`, `multi-tool`, `parallel sessions` → loads `references/session_management.md`, `references/cdp_patterns.md`
- INSTALL intent: keywords `install`, `setup`, `not installed`, `command -v bdg` → loads `references/troubleshooting.md`
- TROUBLESHOOT intent: keywords `error`, `failed`, `troubleshoot`, `session issue` → loads `references/troubleshooting.md`
- AUTOMATION intent: keywords `ci`, `pipeline`, `automation`, `production` → loads `examples/README.md`
- CLI gets +5 weight if `cli_available`; MCP gets +4 if `code_mode_configured`; TROUBLESHOOT gets +4 if `has_error` (SKILL.md:123-128)
- Default fallback when all scores ≤ 0: CLI (SKILL.md:134)

**CLI capabilities (SKILL.md:323, README.md:101-118):**
- Navigation: `bdg <url>`
- Screenshot: `bdg dom screenshot <path>`
- Console: `bdg console --list`
- Network/HAR: `bdg network har <path>`, `bdg network getCookies`, `bdg network headers`
- DOM query: `bdg dom query "<selector>"`
- JS execution: `bdg dom eval "<expression>"`
- CDP discovery: `bdg cdp --list`, `--describe`, `--search`
- Raw CDP: `bdg cdp <Method> '<json>'`

**MCP capabilities (SKILL.md:237, README.md:120-136):**
- Navigation: `navigate_page`
- Screenshot: `take_screenshot`
- Console: `list_console_messages`
- Viewport: `resize_page`
- Clicks: `click`
- Form fill: `fill`
- Hover: `hover`
- Keyboard: `press_key`
- Waits: `wait_for`
- Sessions: `new_page`, `close_page`, `select_page`

**CDP domain coverage (README.md:139-148):** Page, DOM, Network, Runtime, Performance, Emulation, HeapProfiler, Tracing.

---

3. KEY FILES

| Path | Role |
|------|------|
| `SKILL.md` | Skill definition: routing logic, rules, quick reference, version 1.0.7.0 |
| `README.md` | User-facing overview, quick start, features, configuration, examples, troubleshooting, FAQ |
| `INSTALL_GUIDE.md` | Step-by-step installation for bdg CLI and MCP server, version 2.1.0 |
| `references/cdp_patterns.md` | CDP domain examples, workflows, Unix composability patterns (727 lines) |
| `references/session_management.md` | Session lifecycle, retry logic, concurrency, state persistence (696 lines) |
| `references/troubleshooting.md` | Error resolution guide, diagnostic sequence, platform-specific fixes (836 lines) |
| `examples/README.md` | Guide to the three production example scripts and CI integration |
| `examples/animation-testing.sh` | Animation performance assertions with exit codes (147 lines) |
| `examples/multi-viewport-test.sh` | Visual testing across 5 device viewports (174 lines) |
| `examples/performance-baseline.sh` | Full baseline capture: metrics, HAR, screenshot, console, DOM stats (103 lines) |
| `scripts/install.sh` | Automated installation script for bdg CLI (399 lines) |
| `graph-metadata.json` | Skill graph metadata: family `mcp`, category `mcp-tool`, edges to `mcp-code-mode` and `sk-code` |
| `changelog/` | Version history: v1.0.0.0, v1.0.1.0, v1.0.2.0, v1.0.7.0, v1.0.8.0 |
| `manual_testing_playbook/` | 6 test scenarios + playbook markdown |
| `.opencode/skills/` | Nested skill metadata directory |

**Not listed in README.md `STRUCTURE` section:** `graph-metadata.json`, `changelog/`, `manual_testing_playbook/`, `.opencode/`.

---

4. WORKFLOWS & OUTPUTS

**`examples/performance-baseline.sh`** (lines 1-103):
- Usage: `./performance-baseline.sh [URL] [OUTPUT_DIR]`
- Captures: performance metrics (Performance.getMetrics), network HAR, screenshot, DOM stats (node/image/script/stylesheet counts), console logs
- Output directory: `performance-baselines/`
- Files produced: `metrics-<timestamp>.json`, `network-<timestamp>.har`, `screenshot-<timestamp>.png`, `console-<timestamp>.json`, `summary-<timestamp>.txt`
- Summary includes: DOM statistics, key metrics (Layout/Script/Task), network summary (total requests, transfer size, page load time), console errors

**`examples/animation-testing.sh`** (lines 1-147):
- Usage: `./animation-testing.sh [URL] [SELECTOR] [TRIGGER_CLASS]`
- Default selector: `.animated-element`, default trigger: `animate`
- Thresholds: `MAX_LAYOUT_COUNT=3`, `MAX_RECALC_COUNT=5`, `MAX_TASK_DURATION=200` ms (hardcoded, line 17-19)
- Captures: before/after screenshots, performance metrics, console logs
- Output directory: `animation-tests/`
- Files: `animation-before-<ts>.png`, `animation-after-<ts>.png`, `animation-metrics-<ts>.json`, `animation-console-<ts>.json`, `animation-report-<ts>.txt`
- Exit code: 0 = all assertions passed, 1 = one or more failed (line 147)

**`examples/multi-viewport-test.sh`** (lines 1-174):
- Usage: `./multi-viewport-test.sh [URL] [SELECTOR] [TRIGGER_CLASS]`
- Viewports tested (line 17-23): desktop 1920x1080, laptop 1366x768, tablet 768x1024, mobile 375x667, mobile-large 414x896
- Per viewport: initial screenshot, animated screenshot (if triggered), performance metrics, console logs, error count check
- Output directory: `viewport-tests/<timestamp>/`
- Files per viewport: `<name>-initial.png`, `<name>-animated.png`, `<name>-metrics.json`, `<name>-console.json`, plus `summary.txt`
- Exit code: 0 = no console errors across viewports, 1 = failures detected (line 173)

**All three scripts** use `trap "bdg stop 2>&1" EXIT INT TERM` implicitly via `set -euo pipefail` and manual `bdg stop` calls. They can be chained in CI with `set -e` (README.md:201-219).

---

5. TROUBLESHOOTING & FAQ

**Concrete failure modes (README.md:348-455, INSTALL_GUIDE.md:829-947, references/troubleshooting.md):**

| Failure mode | Cause | Fix |
|---|---|---|
| `bash: bdg: command not found` | CLI not installed or npm global bin not in PATH | `npm install -g browser-debugger-cli@alpha`; fix PATH with `npm config get prefix` |
| `Could not find Chrome/Chromium executable` | Chrome not installed or non-standard location | Set `CHROME_PATH` env var to browser executable path |
| `Another session already active` | Prior script exited without `bdg stop` | `bdg stop 2>&1`; register `trap "bdg stop 2>&1" EXIT INT TERM` |
| `Method not found: Page.screenshot` | Wrong CDP method name | Use `bdg cdp --search screenshot` → finds `Page.captureScreenshot` |
| `jq` parse error | stderr contaminating stdout JSON | Always append `2>&1` before piping to `jq` |
| `Failed to move to new namespace` (Linux) | Sandbox restriction | Enable user namespaces or set `CHROME_FLAGS` |
| Windows not supported | Native Windows unsupported | Install WSL with `wsl --install` |
| MCP tools missing in Code Mode | `.utcp_config.json` entry missing or `disabled: true` | Check config, confirm `disabled: false`, restart session |
| MCP server fails to start | Port conflict | `lsof -i :9222` and kill conflicting processes |
| `EADDRINUSE: address already in use :::9222` | Port 9222 taken | `kill -9 $(lsof -t -i :9222)` |

**Top 5 user questions (README.md:459-475):**

1. **CLI vs MCP when?** CLI by default (one-command install, lower tokens, more CDP methods). MCP when already in `call_tool_chain()` with other Code Mode tools, or need parallel isolated browsers. (README.md:461-463)

2. **How to prevent browser process accumulation?** CLI: `trap "bdg stop 2>&1" EXIT INT TERM`. MCP: `try/finally` with `close_page` in `finally`. (README.md:465-467)

3. **Can bdg run in Docker/CI with no display?** Yes. Set `CHROME_HEADLESS=true`. Linux may need `CHROME_DEVEL_SANDBOX=/dev/null`. (README.md:469-471)

4. **What if a CDP method name changes between Chrome versions?** Never hardcode. Use `bdg cdp --search <keyword>` each time. Casing is normalized. Confirm signature with `bdg cdp --describe`. (README.md:473-475)

5. **How to configure MCP parallel instances?** Register multiple entries in `.utcp_config.json` with distinct names (`chrome_devtools_1`, `chrome_devtools_2`) each with `--isolated=true`. (INSTALL_GUIDE.md:340-378)

---

6. STALE FACTS IN CURRENT README

1. **CDP method count: "300+ CDP methods"** — README.md:27 says "300+ CDP methods across 53 domains". INSTALL_GUIDE.md:116 and INSTALL_GUIDE.md:678 say **"All 644 CDP methods"**. SKILL.md:251 says "CLI has 300+ methods across 53 domains". The INSTALL_GUIDE's architecture diagram and feature table both cite 644, which is a different number. The correct current number is **UNKNOWN** without running `bdg --list` but the README and SKILL.md disagree with INSTALL_GUIDE.

2. **MCP package version pinned to `@0.26.0`** — README.md:240 shows `"args": ["chrome-devtools-mcp@0.26.0", "--isolated=true"]`. INSTALL_GUIDE.md:354 shows `"args": ["chrome-devtools-mcp@latest", "--isolated=true"]`. These disagree on the version pin.

3. **Node.js minimum version** — README.md:510 says "Node.js (required runtime, 14.x+)". INSTALL_GUIDE.md:6 and INSTALL_GUIDE.md:175 say **"Node.js 18+"**. The 14.x+ claim is stale.

4. **CLI commands `bdg screenshot` and `bdg console logs`** — INSTALL_GUIDE.md:246, 478, 526, 531, 634, 636, 711, 719 uses `bdg screenshot <path>` and `bdg console logs`. SKILL.md:323 and README.md:108 use `bdg dom screenshot <path>` and `bdg console --list`. The INSTALL_GUIDE uses shorthand forms not present in SKILL.md's quick reference.

5. **INSTALL_GUIDE verification command `bdg --list`** — INSTALL_GUIDE.md:234, 278, 490, 645 uses `bdg --list` to list CDP domains. SKILL.md:323 uses `bdg cdp --list`. The correct form per SKILL.md is `bdg cdp --list`.

6. **Viewport list in SKILL.md** — SKILL.md:97 claims "five device profiles (desktop 1920x1080 down to mobile 375x667)". The actual script (`multi-viewport-test.sh`:17-23) defines: desktop 1920x1080, laptop 1366x768, tablet 768x1024, mobile 375x667, mobile-large 414x896. The README.md:159-163 correctly lists all five. SKILL.md's description is imprecise but not wrong on count.

7. **README `STRUCTURE` section is incomplete** — README.md:188-204 lists 10 files/dirs. Actual directory contains 14 entries: missing `graph-metadata.json`, `changelog/` (5 version files), `manual_testing_playbook/` (6 subdirs + playbook), `.opencode/skills/`.

8. **INSTALL_GUIDE version "2.1.0" vs SKILL.md version "1.0.7.0"** — INSTALL_GUIDE.md:8 declares its own version as 2.1.0, while SKILL.md:5 declares 1.0.7.0. These are separate version tracks but not documented as such, which could confuse readers.