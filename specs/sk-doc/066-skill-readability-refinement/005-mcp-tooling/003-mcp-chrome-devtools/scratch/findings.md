### .skilled/skills/mcp-tooling/mcp-chrome-devtools/README.md
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/README.md:154-166 | 6 | "When To Use This Skill" and its Chromium-only boundary are the reader's first decision, but they sit in §5 after Quick Start (§3) and How It Works (§4), so a reader meets them only after already running the skill. | Move lines 156-166 to after line 40, so §2 reads `Why This Skill Exists` → `What It Does` → `When To Use This Skill` → `The CDP Capability Surface`. Then delete `### Related Skills` (line 168), retitle line 154 to `## 5. RELATED SKILLS`, and at line 202 replace `See INTEGRATION & NAVIGATION for the full boundary.` with `See OVERVIEW for the full boundary.`
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/README.md:220-224 | 6 | The verification table leads with the README's own lint check, before the setup, CLI, MCP and example-script checks a reader runs in that order. | Move the `README structure` row on line 220 to the end of the table, after line 224.
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/README.md:243-244 | 8 | The related-documents index lists `scripts/install.sh` and `scripts/doctor.sh` but not `scripts/README.md`, the file that documents what each script changes and prints. | Insert after line 244: `| [`scripts/README.md`](./scripts/README.md) | What each script changes and the output it prints |`

### .skilled/skills/mcp-tooling/mcp-chrome-devtools/ROUTER.md
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/ROUTER.md:23 | 7 | The §1 overview is one 658-character sentence packing four trigger families and all three resource families into a single clause chain. | Replace line 23 with:
  ```
  Requests reach this skill from four kinds of signal: browser-debugging vocabulary ("browser debugging", "Chrome DevTools", "CDP", `bdg`, `browser-debugger-cli`); inspection tasks (a screenshot, HAR export, console log, network inspection, DOM query or in-browser script); CI-ready automation; and a Chrome DevTools MCP call that chains browser work with other tools or runs parallel isolated sessions.

  It routes to three resource families:

  - `references/cdp-patterns.md` for the CDP command patterns.
  - `references/session-management.md` for the session lifecycle.
  - `references/troubleshooting.md` for an install, a failure, or the fuller diagnostics an on-demand keyword requests.
  ```
- [P1] .skilled/skills/mcp-tooling/mcp-chrome-devtools/ROUTER.md:36 | 1 | The `TROUBLESHOOT` bullet lists 9 keywords while `INTENT_SIGNALS["TROUBLESHOOT"]` at line 88 matches 19, so a reader who predicts routing from §2 concludes that "crash", "timeout", "session issue" and seven other terms do not route; the template requires §2 and the machine map to stay in sync. | Replace the quoted keyword run in line 36 with: `"error", "failed", "troubleshoot", "session issue", "keeps dropping", "won't connect", "figure out why", "work out the cause", "hangs", "hanging", "stuck", "crash", "crashing", "broken", "not working", "timeout", "disconnect", "flaky" and "root cause"`
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/ROUTER.md:33-35,37 | 1 | The CLI, MCP, INSTALL and AUTOMATION bullets carry the same drift against lines 85-89: they omit `"command-line"`, `"model context protocol"`, `"multiple tools"`, `"set up"`, `"download"`, `"unattended"` and `"recurring"`. | Replace each quoted keyword run in place: line 33 → `"bdg", "browser-debugger-cli", "terminal", "cli", "command line", "command-line", "shell", "headless", "lightweight" and "token efficient"`; line 34 → `"mcp", "code mode", "multi-tool", "model context protocol", "multiple tools", "tool chain", "isolated instances", "parallel sessions" and "in parallel"`; line 35 → `"install", "setup", "set up", "not installed", "command -v bdg", "getting started", "download", "npm install", "not found" and "first time"`; line 37 → `"ci", "continuous integration", "pipeline", "automation", "unattended", "production", "automate", "batch" and "recurring"`
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/ROUTER.md:39 | 7 | The §2 closing paragraph is one 527-character sentence carrying five separate routing rules: the 1.0 tie-break, the two-intent cap, the zero-score fallback, the suggested default and the on-demand additions. | Replace line 39 with:
  ```
  - The two highest-scoring intents load together when their scores sit within 1.0 of each other, and at most two intents load per request.
  - A request that scores on none loads nothing: it returns `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST`, and `references/cdp-patterns.md` is suggested beside that checklist as a fallback-only default, so it never enters a scored route's loaded set.
  - A scoring `ON_DEMAND_KEYWORDS` term then adds `references/troubleshooting.md` and `references/session-management.md` on top of the scored set.
  ```

### .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:113 | 1 | `### MCP Session Cleanup` is an H3, so it reads as a peer of `CLI Approach` and `MCP Approach` even though its rule is MCP-only and it trails the MCP subsections. | Change line 113 to `#### MCP Session Cleanup`.
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:153 | 7 | The section is titled "Completion Checklist" but the seven criteria are packed into one 243-character sentence. | Replace line 153 with:
  ```
  The workflow is complete when:

  - [ ] A CLI or MCP path is selected.
  - [ ] Installation or configuration is verified.
  - [ ] The session is active.
  - [ ] CDP operations exit 0 with valid JSON.
  - [ ] The requested data is captured.
  - [ ] Sessions are cleaned up.
  - [ ] Discovery and error handling are documented.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:182 | 7 | QUICK REFERENCE packs eleven commands into one 298-character sentence, so the fastest-to-scan section is the slowest to read. | Replace line 182 with the same commands as bullets, then the trap sentence:
  ```
  - `bdg cdp --list`
  - `bdg cdp --describe <domain>`
  - `bdg cdp --search <term>`
  - `bdg <url>`
  - `bdg status`
  - `bdg stop`
  - `bdg dom screenshot <path>`
  - `bdg console --list`
  - `bdg dom query`
  - `bdg dom eval`
  - `bdg network har <path>`

  In shell scripts, install a trap so `bdg stop 2>&1` runs on exit.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:192 | 8 | The references index names one of the two runnable scripts and omits `scripts/doctor.sh`, which README §8 tells readers to run, plus `scripts/README.md`. | Replace line 192 with: ``Scripts: `scripts/install.sh` and `scripts/doctor.sh`, both documented in `scripts/README.md`.``

### .skilled/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md
- clean

### .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/cdp-patterns.md
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/cdp-patterns.md:22-24 | 4 | §1 OVERVIEW opens with a single Core Principle paragraph; it has no Purpose and no When to Use, so the overview never says what outcome the reference produces or what sends a reader here. | Replace line 24 with:
  ```
  ### Purpose

  Turn a browser task into a CDP command that runs against the connected Chrome version, without a hardcoded method list.

  ### When to Use

  - You know the browser task but not the CDP method name or signature.
  - You are assembling a multi-step browser workflow from commands that already run.
  - You want to filter `bdg` output with `jq`, `grep` or another Unix tool.

  ### Core Principle

  Progressive disclosure from discovery to execution - always explore capabilities via `bdg cdp --list`/`--describe`/`--search` before executing CDP methods. Self-documentation eliminates hardcoded method lists and ensures up-to-date access to 300+ CDP methods across 53 domains.
  ```
- [P1] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/cdp-patterns.md:611,616,621,626 | 1 | Four `**Validation**:` checkpoint labels sit inside the ```` ```bash ```` fence that opens at line 607, so they render literally as `**Validation**: `domains_discovered`` and the "Correct" block cannot be copied and run. | Replace those four lines with code comments: `# Validation: domains_discovered`, `# Validation: method_identified`, `# Validation: signature_understood`, `# Validation: execution_successful`.
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/cdp-patterns.md:736-738 | 10, 2 | A `**Reference**: <bare URL>` note sits after `## 10. RELATED RESOURCES`, so the related-resources section is not last, and the URL raises the file's only render warning. | Move line 738 to after line 734, inside §10, wrapped as `**Reference**: [Full CDP documentation](https://chromedevtools.github.io/devtools-protocol/)`, and delete the divider on line 736.

### .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md:22-24 | 4 | §1 OVERVIEW is a Core Principle paragraph only; it has no Purpose and no When to Use. | Replace line 24 with:
  ```
  ### Purpose

  Keep a `bdg` browser session healthy from start to stop, with the scripts that verify, recover and clean it up.

  ### When to Use

  - You are writing a script that starts and stops its own browser session.
  - A session start is flaky and needs retries, a timeout or a health check.
  - You need cleanup that survives errors and interrupts.

  ### Core Principle

  Always verify session state before operations - session failures cascade. Implement proper cleanup patterns (trap-based) to prevent resource leaks and orphaned browser processes.
  ```
- [P1] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md:528,535 | 1 | Two `**Validation**:` labels sit inside the ```` ```bash ```` fence that opens at line 515, so they render as literal bold syntax and break the trap-cleanup example a reader is meant to copy. | Replace those two lines with code comments: `# Validation: cleanup_registered` and `# Validation: operations_complete`.
- [P1] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md:667 | 5 | Best practice 4 tells the reader to track multiple sessions "when running concurrent operations", which the governing finding at line 240 forbids: `bdg` exposes one global `status`/`stop` lifecycle, a second `bdg <url>` replaces the first, and only the MCP surface gives real parallelism. | Replace line 667 with: ``4. **Label sessions for reporting only** and finish one before starting the next, because `bdg` exposes a single active session (§6).``
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md:576 | 1 | The heading promises "Session Pooling", but `warm_session` keeps exactly one session warm and the doc has already established that no pool of sessions can exist. | Replace line 576 with `### Warm Session Reuse`.

### .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md:22-24 | 4 | §1 OVERVIEW is a Core Principle paragraph only; it has no Purpose and no When to Use. | Replace line 24 with:
  ```
  ### Purpose

  Turn a failing `bdg` command into a named cause and the fix that addresses it.

  ### When to Use

  - `bdg` will not install, start a session or find Chrome.
  - A CDP command fails on a method name, a parameter or a missing session.
  - You need the meaning of an exit code or the fix for one platform.

  ### Core Principle

  Find root cause before attempting fixes - symptom fixes create cascading failures. Always run systematic diagnostics (5-check sequence) before implementing solutions.
  ```
- [P1] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md:253,257,261,266,271 | 1 | Five `**Validation**:` labels sit inside the ```` ```bash ```` fence that opens at line 249, so the "Systematic diagnosis" example renders literal bold syntax and cannot be run as written. | Replace those five lines with code comments: `# Validation: installation_verified`, `# Validation: version_confirmed`, `# Validation: browser_missing (root cause identified!)`, `# Validation: browser_installed`, `# Validation: session_started`.
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md:802-803 | 2 | Both support links are bare URLs, which the render check reports as `render_bare_url` and which a reader cannot click. | Replace line 802 with `1. **Check documentation**: [browser-debugger-cli repository](https://github.com/szymdzum/browser-debugger-cli)` and line 803 with `2. **Search issues**: [browser-debugger-cli issues](https://github.com/szymdzum/browser-debugger-cli/issues)`.
- [P2] .skilled/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md:800-827 | 6 | `## 13. GETTING HELP` tells the reader how to report a bug before `## 14. COMMON SOLUTIONS CHECKLIST` tells them what to try before reporting, so the two steps sit in reverse order. | Move the GETTING HELP block (lines 800-810) to after line 827, renumber line 813 to `## 13. COMMON SOLUTIONS CHECKLIST`, and number the moved heading `## 14. GETTING HELP`.

