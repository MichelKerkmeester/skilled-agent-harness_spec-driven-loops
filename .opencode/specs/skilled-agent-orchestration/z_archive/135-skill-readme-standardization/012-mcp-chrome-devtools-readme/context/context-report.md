# Context Report: mcp-chrome-devtools README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the two paths, the routing rule, the command surface and the outputs. This skill carries heavy internal drift (two command conventions, three method counts, three version numbers), so the host recorded the authoritative value for each and the rewrite drops the brittle ones.

---

## 1. PURPOSE

`mcp-chrome-devtools` is an orchestrator that drives a real browser from an agent or terminal through two complementary paths: the `bdg` command-line tool for fast, token-efficient inspection and the Chrome DevTools path through Code Mode MCP for multi-tool chaining and parallel isolated sessions.

## 2. PROBLEM

Driving a browser from an agent usually means a heavyweight automation framework or burning tokens on verbose protocol dumps. A single tool does not fit both needs: a one-shot screenshot or a console read wants a fast command, while a multi-step flow that interleaves browser actions with other tool calls wants a typed, chainable interface. Picking the wrong one wastes tokens or blocks parallelism. This skill routes between a lightweight CLI for the common case and an MCP path when the work must chain with other tools or run several isolated browsers at once, so neither need forces the wrong tool.

## 3. THE TWO PATHS

- CLI path (`bdg`, the priority): fast and low-token, self-documenting through `bdg cdp --list`, `--describe` and `--search`, and it reaches the full Chrome DevTools Protocol surface. It writes artifacts to disk (PNG, HAR, JSON) and prints JSON to stdout.
- MCP path (Code Mode, the fallback): registered with `--isolated=true` so each instance is its own browser process, which makes parallel sessions and multi-tool chaining possible. Tools return data as objects inside the `call_tool_chain()` block rather than files on disk.
- Routing rule (`SKILL.md:196`): prefer the CLI for fast low-token inspection, use the MCP path when browser work must be chained with other tools or run as parallel isolated sessions.

## 4. CAPABILITIES (verified, SKILL.md command forms)

The skill maps the same browser actions across both paths. The CLI commands below are the authoritative forms from `SKILL.md:323` (the INSTALL_GUIDE uses shorter aliases that disagree; the README must follow SKILL.md).

| Action | CLI (`bdg`) | MCP (Code Mode) |
|--------|-------------|-----------------|
| Navigate | `bdg <url>` | `navigate_page` |
| Screenshot | `bdg dom screenshot <path>` | `take_screenshot` |
| Console | `bdg console --list` | `list_console_messages` |
| Network trace | `bdg network har <path>` | not exposed |
| DOM query | `bdg dom query "<selector>"` | not exposed |
| JavaScript | `bdg dom eval "<expr>"` | not exposed |
| Viewport | `bdg cdp Emulation.setDeviceMetricsOverride` | `resize_page` |
| Click / fill / hover / key | `bdg cdp Input.*` | `click`, `fill`, `hover`, `press_key` |
| Wait | shell `sleep` | `wait_for` |
| Sessions | `bdg status`, `bdg stop` | `new_page`, `select_page`, `close_page` |
| Discovery | `bdg cdp --list` / `--describe` / `--search` | `search_tools()` |

The CLI reaches the full CDP surface (hundreds of methods across dozens of domains); the MCP path exposes a curated subset. MCP tool naming is `{manual_name}.{manual_name}_{tool_name}`, run inside `call_tool_chain()` with page close in a `finally` block.

## 5. INVOCATION (verified)

CLI install (`SKILL.md:202`): `npm install -g browser-debugger-cli@alpha`, then `command -v bdg` and `bdg --version`. MCP prerequisites (`SKILL.md:210-216`): Code Mode configured in `.utcp_config.json` with a Chrome DevTools entry registered `--isolated=true`. Register several entries (`chrome_devtools_1`, `chrome_devtools_2`) for parallel testing. The MCP package is `chrome-devtools-mcp` and should be pinned to `@latest` (the README's `@0.26.0` is drift). Node 18+ is required (the README's 14.x+ is drift).

## 6. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | Routing logic, the two-path contract, intent scoring and the bdg quick reference |
| `INSTALL_GUIDE.md` | Step-by-step install for the CLI and the MCP server, with an AI-first prompt |
| `references/cdp_patterns.md` | CDP domain patterns, workflows and Unix-pipe composition |
| `references/session_management.md` | Session lifecycle, retry, multi-session and cleanup |
| `references/troubleshooting.md` | Error reference, the diagnostic sequence and platform fixes |
| `examples/README.md` | Guide to the three production scripts and CI integration |
| `examples/performance-baseline.sh` | Full baseline: metrics, HAR, screenshot, console, DOM stats |
| `examples/animation-testing.sh` | Animation assertions with before/after shots and exit codes |
| `examples/multi-viewport-test.sh` | Five-viewport responsive test (desktop to mobile-large) |
| `scripts/install.sh` | Automated bdg installer with Chrome detection |

The skill also ships `changelog/`, `manual_testing_playbook/` and `graph-metadata.json`. Do not cite `.opencode/skills/.advisor-state/skill-graph-generation.json` (repo-level advisor noise, not a skill file).

## 7. WORKFLOWS & OUTPUTS

Three example scripts double as the end-to-end workflows. `performance-baseline.sh [URL] [OUTPUT_DIR]` captures metrics, a HAR, a screenshot, console logs and DOM stats into timestamped files. `animation-testing.sh` asserts layout, recalc and task-duration thresholds with before and after screenshots, exiting non-zero on failure. `multi-viewport-test.sh` runs five viewports (desktop 1920x1080, laptop 1366x768, tablet 768x1024, mobile 375x667, mobile-large 414x896) and fails on any console error. All three are CI-friendly with semantic exit codes and headless support (`CHROME_HEADLESS=true`).

## 8. BOUNDARIES

This skill orchestrates browser debugging; it is not a cross-browser test framework (the CLI targets Chrome, Chromium and Edge only). The MCP transport itself is owned by `mcp-code-mode` (this skill consumes Code Mode, it does not implement it). For generated application code the surface is `sk-code`. The CLI path needs the `bdg` binary installed; the MCP path needs Code Mode configured.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- `command not found: bdg`: not installed or npm global bin not on PATH. Install and fix PATH.
- `Could not find Chrome`: set `CHROME_PATH` to the browser executable.
- `Another session already active`: a prior session was not stopped. Run `bdg stop`, or register `trap "bdg stop" EXIT INT TERM`.
- `Method not found`: a guessed CDP method. Use `bdg cdp --search <term>` to find the real name; never hardcode.
- `jq` parse error: stderr is contaminating stdout. Append `2>&1` before piping.
- MCP tools missing: the `.utcp_config.json` entry is missing or disabled. Confirm and restart the session.
- FAQ: when to use the CLI versus the MCP path, how to prevent browser process accumulation, how to run headless in CI, how to keep CDP method names stable across Chrome versions, how to configure parallel isolated MCP instances.

## 10. STALE FACTS

The current README and the INSTALL_GUIDE disagree on several values. The narrative template drops version lines and brittle counts, so most resolve on rewrite:

- Version: README says 1.0.7.0, the changelog runs to v1.0.8.0 and the INSTALL_GUIDE self-reports 2.1.0. Drop the version line.
- CDP method count: README and SKILL.md say 300+, the INSTALL_GUIDE says 644. Do not pin a number; state the CLI reaches the full surface and the MCP path a subset.
- MCP tool count: the docs say 7, 12 and 26 in different places. Do not cite a count; list capability categories.
- MCP package pin: README says `@0.26.0`, INSTALL_GUIDE says `@latest`. Use `@latest`.
- Node version: README says 14.x+, INSTALL_GUIDE says 18+. Use 18+.
- Command forms: the INSTALL_GUIDE uses `bdg screenshot`, `bdg console logs`, `bdg js`, `bdg --list`; SKILL.md uses `bdg dom screenshot`, `bdg console --list`, `bdg dom eval`, `bdg cdp --list`. Use the SKILL.md forms.

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the two paths and invocation; iteration 2 verified the command surface, the routing rule, the outputs and the stale facts, each cited to a file and line. The two models agreed on the command authority (SKILL.md) and both flagged the count and version drift. Converged before the three-iteration ceiling.
