---

# 1. EXACT INVOCATION

## CLI Path: `bdg` (browser-debugger-cli)

**Install command** (`.opencode/skills/mcp-chrome-devtools/SKILL.md:202`, `README.md:46`, `INSTALL_GUIDE.md:221`):

```
npm install -g browser-debugger-cli@alpha
```

**Verification** (`SKILL.md:202`):
```
command -v bdg
bdg --version 2>&1
```

**Key subcommands and flags** (`SKILL.md:323`):
```
bdg cdp --list              # List all CDP domains
bdg cdp --describe <Domain> # Show domain methods
bdg cdp --search <term>     # Find methods by keyword
bdg <url>                   # Start session at URL
bdg status                  # Check session state
bdg stop                    # End session
bdg dom screenshot <path>   # Save full-page PNG
bdg dom query "<selector>"  # Query DOM elements
bdg dom eval "<expression>" # Execute JavaScript
bdg console --list          # Read console messages
bdg network har <path>      # Export HAR network trace
```

**CLI outputs**: Screenshots → PNG file at path; console → JSON array on stdout piped to `jq`; HAR → `.har` file; DOM queries → JSON; JavaScript eval → JSON with result value (`references/cdp_patterns.md:37-46`).

> **WARNING**: `INSTALL_GUIDE.md` uses different helper command names: `bdg screenshot <path>` (instead of `bdg dom screenshot`), `bdg console logs` (instead of `bdg console --list`), `bdg js` (instead of `bdg dom eval`), `bdg network cookies` (instead of `bdg network getCookies`), `bdg har export <path>` (instead of `bdg network har <path>`). See INSTALL_GUIDE.md:632-638 vs SKILL.md:323.

## MCP Path: Code Mode `call_tool_chain()`

**Prerequisites** (`SKILL.md:210-212`):
1. Code Mode configured in `.utcp_config.json`
2. Chrome DevTools MCP server registered with `--isolated=true`

**Invocation pattern** (`SKILL.md:233`, `README.md:258-260`):
```
Tool naming convention: {manual_name}.{manual_name}_{tool_name}()

Concrete example: chrome_devtools_1.chrome_devtools_1_take_screenshot({})

Usage inside call_tool_chain():
  await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
  const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
```

**MCP outputs**: Tools return data directly inside the TypeScript block — screenshots as base64 data, console messages as arrays, page info as JSON objects. No filesystem artifacts unless explicitly written.

**Close pages in `finally`** (`SKILL.md:256`): Wrap all MCP browser operations in `try/finally` and call `close_page` in the `finally` clause.

---

# 2. CAPABILITY ROSTER

## Routing Rule (`SKILL.md:196`)

> "Prefer CLI (`bdg`) for fast, low-token browser inspection. Use MCP via Code Mode when browser work must be chained with other tools or parallel isolated sessions."

Decision flow (`INSTALL_GUIDE.md:82-97`): Check `command -v bdg` → if YES, use CLI; if NO, check Code Mode configured → if YES, use MCP; if NO, install CLI.

## Concrete Capability List

| Capability | CLI (bdg) | MCP (Code Mode) |
|---|---|---|
| Navigation | `bdg <url>` | `navigate_page` |
| Screenshots | `bdg dom screenshot <path>` | `take_screenshot` |
| Network (HAR) | `bdg network har <path>` | N/A (per `README.md:174`) |
| Console | `bdg console --list` | `list_console_messages` |
| Viewport | `bdg cdp Emulation.setDeviceMetricsOverride` | `resize_page` |
| Clicks | `bdg cdp Input.dispatchMouseEvent` | `click` |
| Form fill | `bdg dom eval "...value = ..."` | `fill` |
| Hover | `bdg cdp Input.dispatchMouseEvent` | `hover` |
| Keyboard | `bdg cdp Input.dispatchKeyEvent` | `press_key` |
| Waits | N/A (shell `sleep`) | `wait_for` |
| Session management | `bdg status`, `bdg stop` | `new_page`, `select_page`, `close_page` |
| CDP discovery | `bdg cdp --list`, `--describe`, `--search` | `search_tools()` |
| DOM query | `bdg dom query "<selector>"` | N/A |
| JS execution | `bdg dom eval "<expression>"` | N/A |
| Cookies (read) | `bdg network getCookies` | N/A |
| Cookies (set) | `bdg cdp Network.setCookie` | N/A |

(MCP tool list from `README.md:122-135`; CLI equivalents from `README.md:168-182`; capability routing from `SKILL.md:192-257`.)

**CDP scope**: CLI has "300+ CDP methods across 53 domains" (`SKILL.md:251`, `README.md:37`, `references/cdp_patterns.md:14`). MCP has "a subset of CDP methods" (`SKILL.md:251`).

---

# 3. KEY FILES

| Path | Role |
|---|---|
| `SKILL.md` | Skill definition: routing logic, rules, intent scoring, quick reference (335 lines, `version: 1.0.7.0`) |
| `README.md` | User-facing README: overview, quick start, features, troubleshooting, FAQ (511 lines) |
| `INSTALL_GUIDE.md` | Step-by-step installation guide for bdg CLI and MCP server (1070 lines, self-reports `Version: 2.1.0`) |
| `graph-metadata.json` | Skill graph metadata: edges, domains, intent signals, derived entities (139 lines, `schema_version: 2`) |
| `references/cdp_patterns.md` | CDP domain patterns, complete workflows, Unix pipe examples (727 lines) |
| `references/session_management.md` | Session lifecycle, retry logic, multi-session, cleanup patterns, state persistence (696 lines) |
| `references/troubleshooting.md` | Error code reference, diagnostic sequence, platform-specific fixes (836 lines) |
| `examples/README.md` | Guide to the three production example scripts and CI integration (377 lines) |
| `examples/animation-testing.sh` | Animation performance script: assertions on layout/recalc/task, before/after screenshots (147 lines) |
| `examples/multi-viewport-test.sh` | 5-viewport responsive test: desktop/laptop/tablet/mobile/mobile-large (174 lines) |
| `examples/performance-baseline.sh` | Full baseline: metrics, HAR, screenshot, console, DOM stats, summary (103 lines) |
| `scripts/install.sh` | Automated bdg installer: Chrome detection, profile setup, verification (399 lines) |
| `changelog/v1.0.0.0.md` | Initial changelog entry |
| `changelog/v1.0.1.0.md` | Changelog entry |
| `changelog/v1.0.2.0.md` | Changelog entry |
| `changelog/v1.0.7.0.md` | 2026-02-16: removed decorative heading markers |
| `changelog/v1.0.8.0.md` | 2026-02-20: clarified primary starting point, reframed `index.md` as supplemental |
| `manual_testing_playbook/` | 7 entries: 6 numbered playbooks + `manual_testing_playbook.md` |
| `.opencode/skills/.advisor-state/skill-graph-generation.json` | Advisor skill graph generation state |

---

# 4. WORKFLOWS & OUTPUTS

## 4.1 `performance-baseline.sh` (`examples/performance-baseline.sh:1-103`)

**Usage**: `./performance-baseline.sh [URL] [OUTPUT_DIR]`

**Captures**:
- Performance metrics (`bdg cdp Performance.getMetrics`)
- Network HAR trace (`bdg network har`)
- Screenshot (`bdg dom screenshot`)
- Console logs (`bdg console --list`)
- DOM statistics (node count, images, scripts, stylesheets)

**Outputs** to `performance-baselines/` (or custom dir):
- `metrics-{timestamp}.json`
- `network-{timestamp}.har`
- `screenshot-{timestamp}.png`
- `console-{timestamp}.json`
- `summary-{timestamp}.txt`

## 4.2 `animation-testing.sh` (`examples/animation-testing.sh:1-147`)

**Usage**: `./animation-testing.sh [URL] [SELECTOR] [TRIGGER_CLASS]`

**Default thresholds**: `MAX_LAYOUT_COUNT=3`, `MAX_RECALC_COUNT=5`, `MAX_TASK_DURATION=200` (lines 17-19)

**Captures**: Before/after screenshots, performance metrics, console logs, text report with pass/fail assertions.

**Outputs** to `animation-tests/`:
- `animation-before-{timestamp}.png`
- `animation-after-{timestamp}.png`
- `animation-metrics-{timestamp}.json`
- `animation-console-{timestamp}.json`
- `animation-report-{timestamp}.txt`

**Exit codes**: `0` = all assertions passed, `1` = one or more failed.

## 4.3 `multi-viewport-test.sh` (`examples/multi-viewport-test.sh:1-174`)

**Usage**: `./multi-viewport-test.sh [URL] [SELECTOR] [TRIGGER_CLASS]`

**5 viewports** (lines 17-23):
| Name | Resolution | Mobile |
|---|---|---|
| desktop | 1920x1080 | false |
| laptop | 1366x768 | false |
| tablet | 768x1024 | false |
| mobile | 375x667 | true |
| mobile-large | 414x896 | true |

**Outputs** to `viewport-tests/{timestamp}/` per viewport:
- `{name}-initial.png`
- `{name}-animated.png` (if animation triggered)
- `{name}-metrics.json`
- `{name}-console.json`
- `summary.txt`

**Exit codes**: `0` = all viewports passed (no console errors), `1` = one or more failed.

---

# 5. TROUBLESHOOTING & FAQ

## 5.1 Concrete Failure Modes (`references/troubleshooting.md`)

| Failure | Root Cause | Fix |
|---|---|---|
| `command not found: bdg` (line 61) | CLI not installed or npm global bin not in PATH | `npm install -g browser-debugger-cli@alpha`; fix PATH via `npm config get prefix/bin` |
| `Error: Could not find Chrome` (line 179) | Chrome not installed or at non-standard path | Set `CHROME_PATH` env var; macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| `Error: Another session already active` (line 415) | Prior session not stopped | `bdg stop 2>&1`; if fail, `pkill -f "bdg "` |
| `Error: Method not found: Page.screenshot` (line 457) | Method name guessed instead of discovered | `bdg cdp --search screenshot` → `Page.captureScreenshot` |
| `jq: parse error` on bdg output (line 556) | stderr contaminating stdout stream | Always `2>&1` before piping to jq |
| MCP: tools missing in Code Mode (`INSTALL_GUIDE.md:915`) | UTCP config missing or disabled | Check `.utcp_config.json`, confirm `disabled: false`, restart session |
| MCP: connection failed (`INSTALL_GUIDE.md:923`) | Port conflict or config error | `npx chrome-devtools-mcp@latest --version`; `lsof -i :9222`; kill conflicting processes |
| `Failed to move to new namespace` (Linux, line 726) | Linux sandbox restriction | Enable user namespaces: `sudo sysctl kernel.unprivileged_userns_clone=1` |
| Windows native not supported (line 744) | bdg requires WSL | `wsl --install`, then install bdg inside WSL |

**5-check diagnostic sequence** (`references/troubleshooting.md:37-53`):
```
command -v bdg || echo "Not installed"
bdg --version 2>&1
bdg status 2>&1
which google-chrome chromium-browser chromium 2>/dev/null
node --version && npm --version
```

## 5.2 FAQ Questions (from `README.md:459-476`)

1. **CLI vs MCP?** — Use CLI by default (one-command install, lower token cost, more CDP methods). Switch to MCP inside `call_tool_chain()` blocks with other Code Mode tools, or for parallel browser testing with 2+ isolated instances.

2. **Prevent browser accumulation?** — Register `trap "bdg stop 2>&1" EXIT INT TERM` at script top. For MCP, wrap in `try/finally` and call `close_page` with a discovered `pageId` in the `finally` clause.

3. **Docker/CI with no display?** — Set `CHROME_HEADLESS=true`. Linux may also need `CHROME_DEVEL_SANDBOX=/dev/null` in isolated CI containers. All three example scripts are written for this use case with semantic exit codes.

4. **CDP method name changes between Chrome versions?** — Never hardcode method names. Use `bdg cdp --search <keyword>` each time. bdg normalizes case. Run `bdg cdp --describe <Domain.Method>` to confirm parameters.

---

# 6. STALE FACTS IN CURRENT README

1. **Version**: `README.md:37` states "The current version is 1.0.7.0." The changelog contains `v1.0.8.0.md` dated 2026-02-20. `SKILL.md:5` still reads `version: 1.0.7.0` in its frontmatter. The changelog entry for v1.0.8.0 references `SKILL.md` and a now-missing `index.md` as changed files — but `SKILL.md` frontmatter was not bumped to 1.0.8.0.

2. **CDP method count**: `README.md:37` says "300+ CDP methods." `INSTALL_GUIDE.md:116` and `INSTALL_GUIDE.md:678` say "All 644 CDP methods." These numbers disagree. `SKILL.md:251` sides with 300+. `references/cdp_patterns.md:14` says "300+."

3. **MCP tool count**: `INSTALL_GUIDE.md:153` claims "26 MCP tools" / "26 exposed tools" (`INSTALL_GUIDE.md:116`). `README.md:122-135` lists exactly 12 MCP tools. `INSTALL_GUIDE.md:971-982` lists only 7 with backticks and `get_page_content` / `type_text` not documented in the README at all.

4. **MCP npm package version**: `README.md:240` pins `chrome-devtools-mcp@0.26.0`. `INSTALL_GUIDE.md:354` and `INSTALL_GUIDE.md:68` use `chrome-devtools-mcp@latest`. These are different version selectors.

5. **CLI helper command names**: `INSTALL_GUIDE.md:632-638` documents these commands:
   - `bdg screenshot <path>` — `README.md:109` says `bdg dom screenshot <path>`
   - `bdg console logs` — `README.md:112` says `bdg console --list`
   - `bdg js` — `README.md:111` says `bdg dom eval`
   - `bdg network cookies` — `README.md:113` says `bdg network getCookies`
   - `bdg har export <path>` — `README.md:113` says `bdg network har <path>`

6. **Missing files in README Structure section**: `README.md:189-204` lists the directory tree but omits:
   - `changelog/` (5 entries)
   - `manual_testing_playbook/` (7 entries)
   - `graph-metadata.json`
   - `.opencode/`

7. **INSTALL_GUIDE version scheme**: `INSTALL_GUIDE.md:8` self-reports "Version: 2.1.0" while all other artifacts use 1.x versioning (`SKILL.md:5` = 1.0.7.0, changelogs up to 1.0.8.0).