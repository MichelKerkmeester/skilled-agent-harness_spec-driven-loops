# Iteration 2: AI-Browser Workflows + Chrome DevTools Contrast + UTCP Registration + Packet Authoring

## Focus
Broaden review angles (stopPolicy = max-iterations; convergence is telemetry only). Map the AI-browser-automation workflow capability set, contrast the Aside surface with the Chrome DevTools `bdg` CLI-primary / Code Mode MCP-fallback architecture, define the exact `.utcp_config.json` aside manual, and enumerate everything needed to author the `mcp-aside-devtools` skill packet.

## Findings

### F2.1 — Two-tier automation surface: NL agent loop (`aside`) vs deterministic REPL (`aside repl`)
Aside exposes two distinct automation tiers, both usable from the CLI and the MCP server:

| Tier | Command | Model | Best for |
|------|---------|-------|----------|
| **NL agent** | `aside "<prompt>"` / `aside exec -m <model> "<prompt>"` | Model-driven, multi-step, can pause/approve/wait | "Open localhost:3000 and run a smoke test"; credential autofill; multi-site traversal |
| **Deterministic REPL** | `aside repl "<js>"` | Direct, scriptable JS | `openTab(url)`, screenshots, downloads, deterministic page inspection |

This maps to two distinct use-case classes in the skill packet: agentic tasks (delegate a goal) and imperative inspection (assert exact DOM/screenshot). `bdg` only offers the imperative tier; Aside's differentiator is the agentic tier plus a deterministic REPL.
[SOURCE: https://docs.aside.com/help/developers]

### F2.2 — Workflow capabilities: navigate, inspect, screenshot, download, multi-step
From the developer + tasks docs, the documented workflow capabilities are:
- **Navigate:** `aside repl "const p = await openTab('https://example.com')"` (deterministic); the NL agent navigates as part of task execution.
- **DOM inspection / page inspection:** "direct page inspection" via the REPL (iteration 1 F1.6).
- **Screenshots:** explicitly a REPL capability.
- **Downloads:** explicitly a REPL capability.
- **Multi-step browsing/search/files/history:** tasks "can browse sites, search the web, use files, search history, request approvals, and sign in with allowed autofill."
- **Approval/notification gating:** tasks "can wait for a notification before continuing"; pause for input / request approval / resume after a wait.
- **File work:** tasks create/change files; the task detail page previews images, PDFs, HTML, text, and file metadata.

**Gap vs Chrome DevTools bdg:** `bdg` documents explicit console capture (`bdg console --list`), network HAR capture (`bdg network har <path>`), and structured DOM query/eval (`bdg dom query`, `bdg dom eval`). Aside's docs name these capabilities ("console/network capture", "page inspection") but do NOT expose named low-level commands for them in the public CLI reference — they are surfaced through the NL agent and the REPL rather than a `console`/`network` subcommand. The REPL is the deterministic path for these; exact REPL API functions beyond `openTab` are not enumerated in the public docs (runtime discovery / `--help` needed).
[SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/tasks]

### F2.3 — Contrast with Chrome DevTools bdg architecture (skill packet pattern)
The `mcp-chrome-devtools` skill establishes the canonical pattern the `mcp-aside-devtools` packet must mirror, with key differences:

| Dimension | Chrome DevTools (bdg) | Aside |
|-----------|-----------------------|-------|
| **Install** | `npm install -g browser-debugger-cli@alpha` | `curl -fsSL https://releases.aside.com/install.sh \| bash` |
| **Binary** | `bdg` | `aside` |
| **Primary surface** | Imperative CDP primitives (300+ methods, 53 domains) | NL agent + deterministic REPL |
| **CLI discovery** | `bdg cdp --list`, `--describe`, `--search` | Not documented; use `aside --help` / REPL + runtime discovery |
| **MCP server** | `chrome-devtools-mcp` npm package via npx | `aside mcp` (built into the same `aside` binary) |
| **MCP transport** | stdio | stdio |
| **Parallel instances** | `--isolated=true` flag, register multiple manuals | Account/session model (`--session`, `--account`); no documented `--isolated` flag |
| **Auth** | None (local browser) | Account-based (Aside account / provider keys) |
| **Sandbox/permissions** | None first-class | Read-only / Guard / Full-access modes + Allow/Ask/Deny rules |
| **MCP tool inventory** | Subset of CDP; well-known set | Not enumerated in public docs — runtime discovery required |

The **shared architecture**: CLI-primary (fast, token-efficient, scriptable) + Code Mode MCP fallback (multi-tool chaining, parallel sessions, type-safe `call_tool_chain`). The skill packet should preserve this two-path structure but adapt the CLI section to Aside's agentic+REPL model and the MCP section to `aside mcp` discovery.
[SOURCE: file:.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md] [SOURCE: https://docs.aside.com/help/developers]

### F2.4 — Exact `.utcp_config.json` aside manual registration
Following the existing UTCP manual format (every existing manual uses `call_template_type: "mcp"` + `config.mcpServers.<name>` with stdio transport), the aside manual is:

```json
{
  "name": "aside",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "aside": {
        "transport": "stdio",
        "command": "aside",
        "args": ["mcp"],
        "env": {}
      }
    }
  }
}
```

**Notes:**
- `command: "aside"` assumes the binary is on PATH. The docs advise using the concrete CLI path from Developer settings if found. The packet can recommend resolving the absolute path via `command -v aside` and substituting it (matching the open_design manual which uses an absolute path).
- `env: {}` — no API key env vars are documented for the MCP server because auth inherits the logged-in account/provider state. Unlike `clickup_official` (`CLICKUP_API_KEY`) or `figma` (`FIGMA_API_KEY`), Aside auth is account-session-based, not env-var-based.
- Multiple instances: for parallel agent sessions, register `aside_1` / `aside_2` manuals (mirroring `chrome_devtools_1/2`), each driven by `--session`/`--account` scoping rather than an `--isolated` flag.
[SOURCE: file:.utcp_config.json] [SOURCE: https://docs.aside.com/help/developers]

### F2.5 — MCP tool invocation contract (Code Mode fallback)
Within Code Mode, the tool-naming convention is `{manual_name}.{manual_name}_{tool_name}` (e.g. `clickup.clickup_get_teams`). For the aside manual, tools resolve as `aside.aside_<tool>` and are invoked inside `call_tool_chain()`. Because the aside MCP tool set is not enumerated in public docs (iteration 1 F1.7), the packet's MCP section MUST prescribe runtime discovery:

1. `search_tools({ task_description: "browser automation navigate screenshot" })` or `list_tools()` filtered to the `aside` prefix.
2. Confirm exact tool names before invoking (do not hardcode — the bdg skill's "NEVER assume method names without discovery" rule applies identically).
3. Wrap operations in `try/finally` for session cleanup (bdg skill rule "Always close browser instances when done" — the aside analog is ending/releasing the session).

[SOURCE: file:.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md] [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md] [SOURCE: https://docs.aside.com/help/developers]

### F2.6 — mcp-aside-devtools packet authoring requirements (complete checklist)
Everything needed to author the packet at `.opencode/skills/mcp-tooling/mcp-aside-devtools/`:

1. **SKILL.md** mirroring mcp-chrome-devtools structure:
   - Frontmatter: `name: mcp-aside-devtools`, `allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]`, `version`.
   - §1 When to Use: triggers ("aside browser", "AI browser automation", "aside cli/mcp"); when NOT to use (imperative CDP-only needs → bdg; heavy test frameworks → Playwright).
   - §2 Smart Routing: CLI / MCP / INSTALL / TROUBLESHOOT / AUTOMATION intents (reuse the mcp-chrome-devtools router skeleton).
   - §3 How it Works: two-path — CLI-primary (`aside`/`aside repl`) + Code Mode MCP fallback (`aside mcp`).
   - §4 Rules: ALWAYS check CLI first (`command -v aside`); ALWAYS discover tool names before MCP calls; ALWAYS wrap MCP in try/finally; NEVER assume REPL API without `--help`; auth rule: verify account sign-in for built-in models.
   - §5 Success criteria, §6 Integration points (Gate 2, Tool Routing, Memory), §7 Quick reference, §8 References.
2. **INSTALL_GUIDE.md:** `curl -fsSL https://releases.aside.com/install.sh | bash`; verify `aside --version`; resolve account sign-in.
3. **references/** flat set (like mcp-chrome-devtools): `aside_cli_patterns.md` (NL agent + REPL recipes), `mcp_session-management.md` (account/session/permission modes), `troubleshooting.md` (sign-out recovery, session not found).
4. **scripts/install.sh:** thin wrapper around the curl installer + `command -v aside` verification.
5. **Registration:**
   - New UTCP manual `aside` in `.utcp_config.json` (F2.4).
   - New mode entry in `.opencode/skills/mcp-tooling/mode-registry.json` (so the mcp-tooling hub routes to it).
6. **Auth guidance:** built-in models need active Aside account sign-in; BYO provider keys keep working when signed out; MCP inherits the CLI account context.

[SOURCE: file:.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md] [SOURCE: file:.utcp_config.json] [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/ai] [SOURCE: https://docs.aside.com/help/security]

### F2.7 — Security/permission guidance for the packet
The packet should surface Aside's layered permission model as a first-class concern (bdg has no equivalent):
- Default new-task mode is `Guard` (work in approved folders, ask elsewhere).
- `Read only` for inspection-only MCP flows; `Full access` never exposes saved password values.
- Rule precedence: Deny > Ask > Allow.
- Agent-level + session-level rules compose; session overrides sit on top of agent defaults.
- Password boundary: autofill is available but raw credentials never reach the agent — document this as a safe-authenticated-navigation capability.

[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/password-manager (referenced)]

## Sources Consulted
- [SOURCE: https://docs.aside.com/help/developers] — CLI/REPL/MCP surface, capabilities
- [SOURCE: https://docs.aside.com/help/tasks] — workflow capabilities (browse/search/files/history/approval/notification)
- [SOURCE: https://docs.aside.com/help/ai] — provider tiers (auth context for MCP)
- [SOURCE: https://docs.aside.com/help/security] — permission modes, rule values, password boundary
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md] — sibling skill pattern (CLI-primary + MCP fallback, router, rules, tool-naming)
- [SOURCE: file:.utcp_config.json] — UTCP manual_call_templates format + existing manuals
- [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md] — Code Mode call_tool_chain orchestration (context from Known Context snapshot)
- [SOURCE: iteration-001.md] — iteration 1 findings (CLI surface, MCP stdio, auth, session model) carried forward

## Assessment
- **newInfoRatio: 0.65** — Workflow capability mapping, architecture contrast table, the exact UTCP manual JSON, MCP invocation contract, and the full packet authoring checklist are net-new synthesis. Partial overlap with iteration 1 on CLI/MCP/auth facts (carried forward as context, not re-counted as novel). Simplicity bonus for consolidating into decision-ready artifacts.
- **noveltyJustification:** Iteration 2 produces the contrast/registration/authoring artifacts iteration 1 lacked; ~65% net-new (architecture table, UTCP JSON, packet checklist, security guidance) with the rest being deliberate carry-forward context.
- **confidence:** High for the UTCP JSON, packet checklist, and architecture contrast (grounded in the actual workspace files + public docs). Medium for the exact REPL API and aside MCP tool names — these are not in public docs and require runtime discovery; the packet correctly prescribes discovery rather than guessing.

## Reflection
### What Worked
- Reusing the mcp-chrome-devtools SKILL.md as a structural template made the packet authoring checklist concrete and the architecture contrast rigorous.
- Reading the real `.utcp_config.json` let me produce an exact, drop-in manual JSON instead of a hypothetical one.

### What Failed
- The public docs still do not name the aside MCP tools or the full REPL function surface — this is a genuine documentation gap that the packet must handle via runtime discovery, not a research failure.

### Ruled Out
- (none new this iteration; npm install path already ruled out in iteration 1)

## Recommended Next Focus
Loop terminates at maxIterations (2). Next operational step (out of research scope): author the `mcp-aside-devtools` packet using this research, register the aside UTCP manual, and add the mode to `mode-registry.json`, then validate with runtime MCP tool discovery against a live `aside mcp` server.
