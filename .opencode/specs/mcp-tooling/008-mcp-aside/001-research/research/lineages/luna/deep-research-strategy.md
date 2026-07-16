---
title: Deep Research Strategy - Aside CLI and MCP lineage luna
description: Detached three-iteration research strategy for the Aside browser developer surface.
version: 1.14.0.0
---

# Deep Research Strategy - Aside CLI and MCP lineage luna

## 1. OVERVIEW

This is the `fanout-luna-1784196776045-jwfb3a` detached lineage. The workflow artifact root is explicitly bound to this directory. All durable outputs for this lineage stay under the lineage root.

## 2. TOPIC

Aside browser developer surface for an `mcp-tooling` skill mode: Aside CLI, Aside MCP, browser automation, bdg contrast, `mcp-aside-devtools`, and an `aside` UTCP manual.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What is the complete stable Aside CLI command and option surface for browser automation?
- [ ] What exact MCP tools and schemas does `aside mcp` expose, and what is the session/daemon lifecycle?
- [ ] How do Aside's CLI-primary and Code Mode MCP fallback map to the bdg browser-debugging workflow and UTCP registration?
- [ ] Which auth, privacy, permission, and unattended-automation boundaries must `mcp-aside-devtools` document?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not author or modify the `mcp-aside-devtools` skill, hub registration, or root `.utcp_config.json` in this research lineage.
- Do not install or mutate external browser profiles, credentials, or production websites.
- Do not claim undocumented Aside MCP tools, HTTP endpoints, bearer tokens, or daemon flags as facts.

## 5. STOP CONDITIONS

- Continue through all 3 iterations even if convergence telemetry is low; `stop_policy=max-iterations` makes convergence telemetry-only.
- Stop at the hard cap of 3 iterations and synthesize with explicit evidence gaps.
- Treat official docs, live installed CLI/MCP probes, and repository conventions as separate evidence classes.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- combining official docs, the installed binary's help output, and a real MCP JSON-RPC handshake resolved the CLI-vs-MCP ambiguity and avoided guessing tool names. (iteration 1)
- separating task-agent continuation from REPL/MCP process state made the session model precise without inventing a hidden browser selector. (iteration 2)
- reading the existing bdg packet and Code Mode conventions supplied a precise contrast and prevented inventing a second Aside tool family. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- a browser-bound action could not be tested without a task/profile; the server correctly rejected the unbound probe. (iteration 1)
- a browser-bound smoke test remained intentionally unavailable because it would require a real profile and user-facing browser state. (iteration 2)
- no browser-bound Aside execution was available, so the matrix correctly separates advertised APIs from validated output behavior. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A bound Aside page was not available, so screenshot bytes, DOM snapshots, and event-listener behavior remain validation tasks rather than research facts. **[SOURCE: local MCP unbound-profile probe, observed 2026-07-16]** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A bound Aside page was not available, so screenshot bytes, DOM snapshots, and event-listener behavior remain validation tasks rather than research facts. **[SOURCE: local MCP unbound-profile probe, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A bound Aside page was not available, so screenshot bytes, DOM snapshots, and event-listener behavior remain validation tasks rather than research facts. **[SOURCE: local MCP unbound-profile probe, observed 2026-07-16]**

### A documented remote HTTP/SSE MCP endpoint or static bearer-token configuration: the official developer page and `aside mcp --help` document only the local stdio command. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside mcp --help`, observed 2026-07-16]** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A documented remote HTTP/SSE MCP endpoint or static bearer-token configuration: the official developer page and `aside mcp --help` document only the local stdio command. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside mcp --help`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A documented remote HTTP/SSE MCP endpoint or static bearer-token configuration: the official developer page and `aside mcp --help` document only the local stdio command. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside mcp --help`, observed 2026-07-16]**

### A safe browser-bound smoke test could not be performed without selecting or opening a real Aside profile; no profile or website was touched. **[SOURCE: local MCP unbound-profile error, observed 2026-07-16]** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A safe browser-bound smoke test could not be performed without selecting or opening a real Aside profile; no profile or website was touched. **[SOURCE: local MCP unbound-profile error, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A safe browser-bound smoke test could not be performed without selecting or opening a real Aside profile; no profile or website was touched. **[SOURCE: local MCP unbound-profile error, observed 2026-07-16]**

### Claiming a stable `aside_console`, `aside_network`, or `aside_har` MCP tool: no such live tools were discovered. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claiming a stable `aside_console`, `aside_network`, or `aside_har` MCP tool: no such live tools were discovered. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming a stable `aside_console`, `aside_network`, or `aside_har` MCP tool: no such live tools were discovered. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**

### Depending on undocumented daemon subcommands or private timeout flags: the public help surface does not expose them. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16]** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Depending on undocumented daemon subcommands or private timeout flags: the public help surface does not expose them. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Depending on undocumented daemon subcommands or private timeout flags: the public help surface does not expose them. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16]**

### Public docs do not enumerate the MCP schema beyond the server launch snippet; live protocol discovery is the authoritative tool inventory for this packet. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local MCP `tools/list`, observed 2026-07-16]** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Public docs do not enumerate the MCP schema beyond the server launch snippet; live protocol discovery is the authoritative tool inventory for this packet. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Public docs do not enumerate the MCP schema beyond the server launch snippet; live protocol discovery is the authoritative tool inventory for this packet. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local MCP `tools/list`, observed 2026-07-16]**

### Public documentation explains task and permission behavior but does not publish a separate MCP session registry or daemon API. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Public documentation explains task and permission behavior but does not publish a separate MCP session registry or daemon API. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Public documentation explains task and permission behavior but does not publish a separate MCP session registry or daemon API. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]**

### Registering Aside as remote HTTP/SSE MCP or adding bearer/OAuth configuration: only the local stdio launch is documented and observed. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, observed 2026-07-16]** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Registering Aside as remote HTTP/SSE MCP or adding bearer/OAuth configuration: only the local stdio launch is documented and observed. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registering Aside as remote HTTP/SSE MCP or adding bearer/OAuth configuration: only the local stdio launch is documented and observed. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, observed 2026-07-16]**

### Running a live bdg comparison was intentionally skipped because the user requested a research lineage and the lineage boundary prohibits unrelated daemon/profile writes; local references provide the required contrast. **[SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`; lineage boundary]** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Running a live bdg comparison was intentionally skipped because the user requested a research lineage and the lineage boundary prohibits unrelated daemon/profile writes; local references provide the required contrast. **[SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`; lineage boundary]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running a live bdg comparison was intentionally skipped because the user requested a research lineage and the lineage boundary prohibits unrelated daemon/profile writes; local references provide the required contrast. **[SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`; lineage boundary]**

### Separate Aside MCP tools named `navigate`, `dom`, `screenshot`, `console`, or `network`: the live `tools/list` inventory returned only `repl`. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Separate Aside MCP tools named `navigate`, `dom`, `screenshot`, `console`, or `network`: the live `tools/list` inventory returned only `repl`. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Separate Aside MCP tools named `navigate`, `dom`, `screenshot`, `console`, or `network`: the live `tools/list` inventory returned only `repl`. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**

### Treating `--session` as an MCP browser-target selector: it is documented on agent-task paths; the MCP launcher has no such option. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `--session` as an MCP browser-target selector: it is documented on agent-task paths; the MCP launcher has no such option. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--session` as an MCP browser-target selector: it is documented on agent-task paths; the MCP launcher has no such option. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]**

### Treating a fresh `aside mcp` process as sufficient to control any browser: the live unbound-profile error disproves that assumption. **[SOURCE: local MCP `tools/call(repl)` probe, observed 2026-07-16]** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating a fresh `aside mcp` process as sufficient to control any browser: the live unbound-profile error disproves that assumption. **[SOURCE: local MCP `tools/call(repl)` probe, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a fresh `aside mcp` process as sufficient to control any browser: the live unbound-profile error disproves that assumption. **[SOURCE: local MCP `tools/call(repl)` probe, observed 2026-07-16]**

### Treating a signed-in account as sufficient for unattended execution: permission gates, browser-profile binding, approvals, MFA, CAPTCHA, and visible verification remain independent prerequisites. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating a signed-in account as sufficient for unattended execution: permission gates, browser-profile binding, approvals, MFA, CAPTCHA, and visible verification remain independent prerequisites. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a signed-in account as sufficient for unattended execution: permission gates, browser-profile binding, approvals, MFA, CAPTCHA, and visible verification remain independent prerequisites. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]**

### Treating Aside as a CDP-domain-complete replacement for bdg: the live MCP server exposes one REPL tool, not a verified CDP tool catalog. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating Aside as a CDP-domain-complete replacement for bdg: the live MCP server exposes one REPL tool, not a verified CDP tool catalog. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Aside as a CDP-domain-complete replacement for bdg: the live MCP server exposes one REPL tool, not a verified CDP tool catalog. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**

### Treating the derived `aside.aside_repl` name as verified without Code Mode discovery: the name follows repository convention but must be confirmed after registration. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260`]** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the derived `aside.aside_repl` name as verified without Code Mode discovery: the name follows repository convention but must be confirmed after registration. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260`]**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the derived `aside.aside_repl` name as verified without Code Mode discovery: the name follows repository convention but must be confirmed after registration. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260`]**

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A documented remote HTTP/SSE MCP endpoint or static bearer-token configuration: the official developer page and `aside mcp --help` document only the local stdio command. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside mcp --help`, observed 2026-07-16]** (iteration 1)
- Public docs do not enumerate the MCP schema beyond the server launch snippet; live protocol discovery is the authoritative tool inventory for this packet. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 1)
- Separate Aside MCP tools named `navigate`, `dom`, `screenshot`, `console`, or `network`: the live `tools/list` inventory returned only `repl`. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 1)
- Treating a fresh `aside mcp` process as sufficient to control any browser: the live unbound-profile error disproves that assumption. **[SOURCE: local MCP `tools/call(repl)` probe, observed 2026-07-16]** (iteration 1)
- A safe browser-bound smoke test could not be performed without selecting or opening a real Aside profile; no profile or website was touched. **[SOURCE: local MCP unbound-profile error, observed 2026-07-16]** (iteration 2)
- Depending on undocumented daemon subcommands or private timeout flags: the public help surface does not expose them. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16]** (iteration 2)
- Public documentation explains task and permission behavior but does not publish a separate MCP session registry or daemon API. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]** (iteration 2)
- Treating `--session` as an MCP browser-target selector: it is documented on agent-task paths; the MCP launcher has no such option. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]** (iteration 2)
- Treating a signed-in account as sufficient for unattended execution: permission gates, browser-profile binding, approvals, MFA, CAPTCHA, and visible verification remain independent prerequisites. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]** (iteration 2)
- A bound Aside page was not available, so screenshot bytes, DOM snapshots, and event-listener behavior remain validation tasks rather than research facts. **[SOURCE: local MCP unbound-profile probe, observed 2026-07-16]** (iteration 3)
- Claiming a stable `aside_console`, `aside_network`, or `aside_har` MCP tool: no such live tools were discovered. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 3)
- Registering Aside as remote HTTP/SSE MCP or adding bearer/OAuth configuration: only the local stdio launch is documented and observed. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, observed 2026-07-16]** (iteration 3)
- Running a live bdg comparison was intentionally skipped because the user requested a research lineage and the lineage boundary prohibits unrelated daemon/profile writes; local references provide the required contrast. **[SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`; lineage boundary]** (iteration 3)
- Treating Aside as a CDP-domain-complete replacement for bdg: the live MCP server exposes one REPL tool, not a verified CDP tool catalog. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 3)
- Treating the derived `aside.aside_repl` name as verified without Code Mode discovery: the name follows repository convention but must be confirmed after registration. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260`]** (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: The requested lineage can provide the manual and packet design without applying them. The parent `.utcp_config.json`, `mcp-aside-devtools` skill, hub registration, graph persistence, and memory save remain outside thi...

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Primary source: `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/context/website-link.md` → `https://docs.aside.com/help/developers#use-mcp`.
- Local binary: `aside` is installed at `/Users/michelkerkmeester/.local/bin/aside`; observed version `1.26.626.1517`.
- Local MCP probe: `aside mcp` initializes as server `aside`; `tools/list` returns one `repl` tool with a persistent sandboxed JavaScript/Playwright surface.
- Local conventions: root `.utcp_config.json` uses `manual_call_templates[]` with `transport: stdio`; `mcp-chrome-devtools` is registered as an `npx` stdio manual.
- Explicit boundary: parent spec and root config are read-only for this detached lineage.

## 13. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05 (telemetry only under max-iterations stop policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Executor provenance: `cli-codex`, model `gpt-5.6-luna`
- Session: `fanout-luna-1784196776045-jwfb3a`
- Resource map: absent at init; lineage-local map may be emitted during synthesis.
- No parent spec writeback, graph persistence, memory save, or repository staging.
