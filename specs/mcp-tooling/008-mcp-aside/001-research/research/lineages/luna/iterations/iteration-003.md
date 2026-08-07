# Iteration 3: Aside packet design, bdg contrast, and UTCP registration

## Focus

Finish the implementation-facing research needed for `mcp-aside-devtools`: a CLI-primary workflow, a Code Mode MCP fallback, a capability matrix against the repository's `bdg` patterns, and an unapplied `aside` UTCP manual.

## Actions Taken

- Read the current root `.utcp_config.json` manual entries to preserve its `manual_call_templates[]` and nested `mcpServers` shape.
- Read `mcp-code-mode` naming/discovery guidance: discover first, use `manual_name.manual_name_tool_name`, and call external MCP through `call_tool_chain`.
- Read the local `mcp-chrome-devtools` skill and its CDP/session references for CLI-first routing, isolated MCP fallback, direct CDP patterns, and bdg lifecycle behavior.
- Reconciled those repository conventions with the verified Aside CLI/MCP observations from iterations 1 and 2.
- Recorded a capability matrix and a copy-ready UTCP object without editing the parent config or running `bdg`.

## Findings

1. The CLI-primary packet should expose two levels of use. Use `aside` or `aside exec` for a high-level browser-agent task and continuation via `--session`; use `aside repl "..."` for deterministic browser automation JavaScript such as opening a tab, inspecting a page, or taking a screenshot. First-run checks should be `command -v aside` and `aside --version`; installation should remain an explicit user action through the official installer. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://releases.aside.com/install.sh] [SOURCE: local `aside --help`, `aside exec --help`, `aside repl --help`, observed 2026-07-16]**

2. The Code Mode fallback should register one local stdio MCP manual and discover its live tool inventory at runtime. The verified server currently exposes only `repl`, with required `{title, code}` input. Under the repository's Code Mode convention, the expected callable spelling after registering manual `aside` is `aside.aside_repl`; this is a naming derivation, not a claim that the root config is currently registered or that the name is stable across releases. Confirm it with `list_tools`/`tool_info` before calling. **[SOURCE: local MCP `tools/list`, observed 2026-07-16] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:217-260, 289-326] [INFERENCE: `{manual_name}.{manual_name}_{tool_name}` applied to manual `aside` and live tool `repl`]**

3. A copy-ready UTCP manual is:

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

   This mirrors the existing local `chrome_devtools_*` entries and the official Aside launch snippet. It contains no remote URL, bearer token, account ID, or invented timeout/daemon flag. **[SOURCE: `.utcp_config.json`:14-48, observed 2026-07-16] [SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help` and MCP initialize/tools/list]**

4. Aside maps to the requested browser workflows through a single code surface, while bdg exposes task-oriented CLI helpers and raw CDP. The practical matrix is:

   | Workflow | Aside CLI primary | Aside MCP fallback | bdg pattern | Evidence status |
   |---|---|---|---|---|
   | Navigate | `aside repl` with `openTab(url)`; agent task via `aside "Open ..."` | `repl` code with `openTab(url)` after browser binding | `bdg cdp Page.navigate '{"url":"..."}'` | Aside `openTab` advertised/live function; bdg local reference |
   | DOM inspection | `aside repl` with `snapshot(page)`/Playwright locators | same inside `repl` | `bdg dom query`, `DOM.getDocument`, `DOM.querySelector`, `Runtime.evaluate` | Aside snapshot function advertised/live; exact bound-page output untested |
   | Screenshot | `aside repl` with `page.screenshot(...)` or annotated screenshot | same inside `repl` | `bdg dom screenshot output.png`, `Page.captureScreenshot` | Aside screenshot function advertised; file behavior untested |
   | Console | no dedicated verified CLI command; capability probe in REPL | probe Playwright `page.on('console', ...)` only if supported, then clean up listener | `bdg console --list`, `Runtime.enable` | Aside not verified against a bound page; bdg documented locally |
   | Network | no dedicated verified CLI command; capability probe in REPL | probe `page.on('request'/'response', ...)` only if supported; do not promise HAR parity | `bdg network har output.har`, `Network.enable` | Aside not verified; bdg documented locally |
   | Session | task continuation `--session`; REPL process/profile binding | persistent stdio process but no public MCP selector; close process to clean up | `bdg <url>`, `bdg status`, operations, `bdg stop` | Both surfaces documented/observed; semantics differ |

   **[SOURCE: local MCP `tools/list` and capability probe, observed 2026-07-16] [SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`] [SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md`] [INFERENCE: standard Playwright event-listener probes are conditional and not an Aside-specific guarantee]**

5. Aside is better framed as a browser-agent/profile surface than as a drop-in CDP replacement. It adds account/profile state, permission modes, approvals, and human-verification pauses; bdg emphasizes direct Chrome/Chromium CDP, Unix-composable outputs, a single global active session, and explicit `status`/`stop`. The skill packet should route to Aside when the user's browser-agent/profile context or Playwright-level interaction is the point, and to bdg when deterministic CDP domains, console logs, HAR output, or low-token CLI composition are the point. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md`] [SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md`]**

6. Aside's browser-bound prerequisite is the most important fallback error contract. A registered UTCP manual can start a healthy stdio server and still receive “This task is not bound to a browser profile.” The packet should surface that as an actionable prerequisite—open/bind the appropriate Aside browser task/profile, verify permissions, then retry—not as a transport or auth-token failure. **[SOURCE: local MCP `tools/call(repl)` unbound-profile probe, observed 2026-07-16]**

7. Console/network parity must not be promised. `tools/list` returned no dedicated Aside console or network tool, and the live capability probe did not bind to a page. A packet may include guarded REPL examples that attach listeners only after capability discovery, but it should label these experimental/untested and avoid claiming `bdg network har` equivalence. **[SOURCE: local MCP `tools/list`, observed 2026-07-16] [INFERENCE: Playwright listener mapping requires a bound page and runtime validation]**

8. Discovery is part of the fallback flow, not setup trivia. The Code Mode instructions require progressive discovery and exact prefixed names; Aside's own MCP advertises `tools.listChanged: true`. The packet should run discovery, inspect the schema, call one small non-mutating probe, and only then execute navigation or capture code. **[SOURCE: local MCP `initialize` and `tools/list`, observed 2026-07-16] [SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260, 289-326]**

9. The requested lineage can provide the manual and packet design without applying them. The parent `.utcp_config.json`, `mcp-aside-devtools` skill, hub registration, graph persistence, and memory save remain outside this detached artifact boundary. **[SOURCE: local `.utcp_config.json`, observed 2026-07-16] [SOURCE: lineage config and explicit scope boundary]**

## Ruled Out

- Treating Aside as a CDP-domain-complete replacement for bdg: the live MCP server exposes one REPL tool, not a verified CDP tool catalog. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- Claiming a stable `aside_console`, `aside_network`, or `aside_har` MCP tool: no such live tools were discovered. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- Registering Aside as remote HTTP/SSE MCP or adding bearer/OAuth configuration: only the local stdio launch is documented and observed. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, observed 2026-07-16]**
- Treating the derived `aside.aside_repl` name as verified without Code Mode discovery: the name follows repository convention but must be confirmed after registration. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260`]**

## Dead Ends

- Running a live bdg comparison was intentionally skipped because the user requested a research lineage and the lineage boundary prohibits unrelated daemon/profile writes; local references provide the required contrast. **[SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`; lineage boundary]**
- A bound Aside page was not available, so screenshot bytes, DOM snapshots, and event-listener behavior remain validation tasks rather than research facts. **[SOURCE: local MCP unbound-profile probe, observed 2026-07-16]**

## Edge Cases

- The live `repl` schema can change; a hard-coded Code Mode function name or helper list can drift even when the UTCP transport remains valid.
- REPL persistence means event listeners or variables can outlive one call; packet code needs explicit cleanup and bounded result sizes.
- `page.screenshot({path})` and `fs` are advertised, but the allowed output root and returned artifact semantics need a bound-page validation.
- Aside's permission mode can make a technically valid workflow pause or deny an operation; report the policy state separately from MCP transport health.
- bdg's documented single global session and Aside's profile/task binding have incompatible concurrency assumptions; do not transplant session cleanup instructions between them.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/help/security]
- [SOURCE: https://docs.aside.com/help/tasks]
- [SOURCE: https://docs.aside.com/help/troubleshooting]
- [SOURCE: https://releases.aside.com/install.sh]
- [SOURCE: local `.utcp_config.json`:14-48]
- [SOURCE: local `.opencode/skills/mcp-code-mode/SKILL.md`:217-260, 289-326]
- [SOURCE: local `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md`]
- [SOURCE: local `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`]
- [SOURCE: local `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md`]
- [SOURCE: local Aside CLI/MCP probes, observed 2026-07-16]

## Assessment

- New information ratio: 0.70
- Questions addressed: CLI-primary packet shape; Code Mode fallback naming/discovery; UTCP manual object; Aside-to-bdg workflow mapping; console/network caveat; session/concurrency contrast; explicit implementation gaps.
- Questions answered: the recommended manual is local stdio `aside mcp`; the expected Code Mode call is discoverable as `aside.aside_repl`; Aside covers navigation/DOM/screenshots through REPL code; console/network require capability probes and are not verified parity with bdg.
- Confidence: high for repository conventions, local UTCP shape, live Aside MCP inventory, and bdg reference patterns; medium for derived Code Mode callable name until an actual registration/discovery pass; low for bound-page screenshot/event behavior because it was not safely testable here.

## Reflection

- What worked and why: reading the existing bdg packet and Code Mode conventions supplied a precise contrast and prevented inventing a second Aside tool family.
- What did not work and why: no browser-bound Aside execution was available, so the matrix correctly separates advertised APIs from validated output behavior.
- What I would do differently: after the skill/config change is explicitly authorized, perform a disposable public-page smoke test and capture actual DOM/screenshot/console/network outputs.

## Recommended Next Focus

Hard cap reached. Synthesize the three iterations with the UTCP object, CLI/MCP runbooks, bdg contrast, evidence grades, and explicit validation backlog. `stopPolicy=max-iterations` permits synthesis even though the convergence telemetry is not an early-stop signal.
