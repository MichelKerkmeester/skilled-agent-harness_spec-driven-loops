---
title: Obsidian Automation Surface Research Strategy
description: Detached fan-out lineage strategy for BUILD-vs-ADOPT decisions.
---

# Deep Research Strategy

## 2. TOPIC

Map Obsidian automation surfaces and recommend whether to build or adopt a CLI and an MCP integration for a dual-surface mcp-obsidian mode.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which official Obsidian surfaces are automation-capable, and what is their supported feature and runtime boundary?
- [x] Which community CLI candidates have a verified package/binary identity, usable feature coverage, and true headless execution?
- [x] Which MCP-server candidates have a verified identity and transport, and do they require the Local REST API plugin and a running Obsidian app?
- [x] How does the Local REST API community plugin authenticate and what CRUD/search/backlink/daily-note/tag/frontmatter/template operations does it expose?
- [x] What configuration, auth, environment-prefix, and build-vs-adopt choice best mirrors the local mcp-click-up dual CLI+MCP pattern?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement an Obsidian integration or change repository source/configuration.
- Do not inspect or access a user vault, token, or running desktop application.
- Do not treat an unverified package name, npm page, or README claim as a confirmed candidate.

## 5. STOP CONDITIONS

- Complete exactly three evidence-gathering iterations; convergence is telemetry only because stopPolicy is max-iterations.
- Produce a ranked recommendation per CLI and MCP surface with runtime, authentication, feature-coverage, and package-identity evidence.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which official Obsidian surfaces are automation-capable, and what is their supported feature and runtime boundary?
- Which community CLI candidates have a verified package/binary identity, usable feature coverage, and true headless execution?
- Which MCP-server candidates have a verified identity and transport, and do they require the Local REST API plugin and a running Obsidian app?
- How does the Local REST API community plugin authenticate and what CRUD/search/backlink/daily-note/tag/frontmatter/template operations does it expose?
- What configuration, auth, environment-prefix, and build-vs-adopt choice best mirrors the local mcp-click-up dual CLI+MCP pattern?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Primary documentation exposed the decisive split quickly: the official CLI is app-backed while the Local REST API plugin exposes the only documented network API plus MCP endpoint. (iteration 1)
- Registry pages exposed both executable identity and maintenance/scope signals, avoiding README-only package assumptions. (iteration 2)
- First-party plugin documentation established the native endpoint and auth contract, while the cyanheads documentation supplied an independently useful stdio safety layer that matches the existing repository pattern. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The local ClickUp manual cannot serve as package proof because its configured package is explicitly documented as a registry 404. (iteration 1)
- No audited third-party CLI reached full feature parity without either a running app or a custom filesystem implementation. (iteration 2)
- The current local configuration examples do not establish a safe custom-header Streamable HTTP schema, so the more direct native endpoint cannot be prescribed as the immediate Code Mode implementation. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A third-party CLI that reuses the `obsidian` binary name introduces ambiguous invocation and an avoidable installer/configuration conflict. [SOURCE: https://pypi.org/project/obsidian-cli/] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A third-party CLI that reuses the `obsidian` binary name introduces ambiguous invocation and an avoidable installer/configuration conflict. [SOURCE: https://pypi.org/project/obsidian-cli/]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A third-party CLI that reuses the `obsidian` binary name introduces ambiguous invocation and an avoidable installer/configuration conflict. [SOURCE: https://pypi.org/project/obsidian-cli/]

### Adopting PyPI `obsidian-cli` as the mcp-obsidian CLI: it shares the `obsidian` executable name with the official CLI but its documented scope is vault setup/opening rather than the requested operational surface. [SOURCE: https://pypi.org/project/obsidian-cli/] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adopting PyPI `obsidian-cli` as the mcp-obsidian CLI: it shares the `obsidian` executable name with the official CLI but its documented scope is vault setup/opening rather than the requested operational surface. [SOURCE: https://pypi.org/project/obsidian-cli/]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting PyPI `obsidian-cli` as the mcp-obsidian CLI: it shares the `obsidian` executable name with the official CLI but its documented scope is vault setup/opening rather than the requested operational surface. [SOURCE: https://pypi.org/project/obsidian-cli/]

### Calling the official `obsidian` CLI headless: the official documentation requires a running desktop app and launches it on first use. [SOURCE: https://obsidian.md/help/cli] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Calling the official `obsidian` CLI headless: the official documentation requires a running desktop app and launches it on first use. [SOURCE: https://obsidian.md/help/cli]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling the official `obsidian` CLI headless: the official documentation requires a running desktop app and launches it on first use. [SOURCE: https://obsidian.md/help/cli]

### Configuring the built-in HTTP MCP directly in `.utcp_config.json` before Code Mode's HTTP-manual and custom-header schema is verified. [INFERENCE: based on .utcp_config.json:66] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Configuring the built-in HTTP MCP directly in `.utcp_config.json` before Code Mode's HTTP-manual and custom-header schema is verified. [INFERENCE: based on .utcp_config.json:66]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Configuring the built-in HTTP MCP directly in `.utcp_config.json` before Code Mode's HTTP-manual and custom-header schema is verified. [INFERENCE: based on .utcp_config.json:66]

### Do not adopt the existing ClickUp package name as a template without a registry verification; the local documentation records a 404 for it. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Do not adopt the existing ClickUp package name as a template without a registry verification; the local documentation records a 404 for it. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not adopt the existing ClickUp package name as a template without a registry verification; the local documentation records a 404 for it. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65]

### Enabling unrestricted command execution or whole-vault writes by default for an autonomous client. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Enabling unrestricted command execution or whole-vault writes by default for an autonomous client. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Enabling unrestricted command execution or whole-vault writes by default for an autonomous client. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

### Treating `@obsidian-vfs/core` as a drop-in executable: npm describes it as a shared engine/library and its useful graph/search functions are unavailable while Obsidian is down. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `@obsidian-vfs/core` as a drop-in executable: npm describes it as a shared engine/library and its useful graph/search functions are unavailable while Obsidian is down. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `@obsidian-vfs/core` as a drop-in executable: npm describes it as a shared engine/library and its useful graph/search functions are unavailable while Obsidian is down. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core]

### Treating `obsidian://` as a full data-plane API: it lacks the documented rich query and metadata surface needed for agent operations. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `obsidian://` as a full data-plane API: it lacks the documented rich query and metadata surface needed for agent operations. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `obsidian://` as a full data-plane API: it lacks the documented rich query and metadata surface needed for agent operations. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]

### Treating any Local REST API wrapper as headless: every verified wrapper delegates to the plugin running inside Obsidian. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating any Local REST API wrapper as headless: every verified wrapper delegates to the plugin running inside Obsidian. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating any Local REST API wrapper as headless: every verified wrapper delegates to the plugin running inside Obsidian. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/]

### Treating official Obsidian Headless (`ob`) as an automation API: its documented surface is Sync administration, not note CRUD/search/backlink tooling. [SOURCE: https://obsidian.md/help/sync/headless] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating official Obsidian Headless (`ob`) as an automation API: its documented surface is Sync administration, not note CRUD/search/backlink tooling. [SOURCE: https://obsidian.md/help/sync/headless]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating official Obsidian Headless (`ob`) as an automation API: its documented surface is Sync administration, not note CRUD/search/backlink tooling. [SOURCE: https://obsidian.md/help/sync/headless]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Calling the official `obsidian` CLI headless: the official documentation requires a running desktop app and launches it on first use. [SOURCE: https://obsidian.md/help/cli] (iteration 1)
- Do not adopt the existing ClickUp package name as a template without a registry verification; the local documentation records a 404 for it. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65] (iteration 1)
- Treating `obsidian://` as a full data-plane API: it lacks the documented rich query and metadata surface needed for agent operations. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] (iteration 1)
- A third-party CLI that reuses the `obsidian` binary name introduces ambiguous invocation and an avoidable installer/configuration conflict. [SOURCE: https://pypi.org/project/obsidian-cli/] (iteration 2)
- Adopting PyPI `obsidian-cli` as the mcp-obsidian CLI: it shares the `obsidian` executable name with the official CLI but its documented scope is vault setup/opening rather than the requested operational surface. [SOURCE: https://pypi.org/project/obsidian-cli/] (iteration 2)
- Treating `@obsidian-vfs/core` as a drop-in executable: npm describes it as a shared engine/library and its useful graph/search functions are unavailable while Obsidian is down. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core] (iteration 2)
- Treating official Obsidian Headless (`ob`) as an automation API: its documented surface is Sync administration, not note CRUD/search/backlink tooling. [SOURCE: https://obsidian.md/help/sync/headless] (iteration 2)
- Configuring the built-in HTTP MCP directly in `.utcp_config.json` before Code Mode's HTTP-manual and custom-header schema is verified. [INFERENCE: based on .utcp_config.json:66] (iteration 3)
- Enabling unrestricted command execution or whole-vault writes by default for an autonomous client. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] (iteration 3)
- Treating any Local REST API wrapper as headless: every verified wrapper delegates to the plugin running inside Obsidian. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/] (iteration 3)

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
- Which MCP package should be adopted, if any, instead of connecting to the Local REST API plugin's built-in MCP endpoint? (iteration 1)
- What exact environment variables and safety controls should the mcp-obsidian manual expose? (iteration 1)
- Which community CLI candidates add value over the official CLI without requiring the app? (iteration 1)
- Which MCP-server candidates have a verified identity and transport, and do they require the Local REST API plugin and a running Obsidian app? (iteration 2)
- How does the Local REST API community plugin authenticate and what CRUD/search/backlink/daily-note/tag/frontmatter/template operations does it expose? (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Resource map: resource-map.md not present; skipping coverage gate.
- Memory context: unavailable from the warm daemon (exit 75); research starts from primary external sources and read-only local repository evidence.
- Detached lineage boundary: only this lineage directory may receive writes. Parent-spec anchoring and continuity-save phases are deliberately excluded.

## 13. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05 (telemetry only; max-iterations stop policy)
- Executor: cli-codex, model gpt-5.6-terra
- Allowed write root: this detached lineage packet only
