# Iteration 1: Official Aside CLI and MCP surface

## Focus

Establish whether Aside has a real standalone CLI, identify the live MCP transport and tool inventory, and probe the minimum browser binding required by the MCP fallback. The selected interpretation is the installed macOS CLI plus its local `aside mcp` server; undocumented remote endpoints and inferred tool names are deferred.

## Actions Taken

- Read the lineage config, append-only state log, strategy, registry, local research seed, `.utcp_config.json`, and the existing `mcp-chrome-devtools` skill before selecting the focus.
- Opened the official Aside developer, task, privacy, and permission documentation.
- Inspected the installed `aside` binary (`1.26.626.1517`) with `--help`, `mcp --help`, `repl --help`, `exec --help`, and `account --help`.
- Started `aside mcp` under a lineage-local `HOME`, completed MCP `initialize`, called `tools/list`, and called the sole `repl` tool with a non-mutating capability probe.
- Called `repl` with `listBrowserTabs()` to verify the browser-profile binding failure mode without opening or mutating a real tab.

## Findings

1. Aside ships a real standalone CLI, not only an MCP server. The official developer page documents `aside "..."` for a browser-agent task, `aside --session <session-id> "Continue"` for continuation, account inspection/switching, `--account` targeting, `aside exec`, `aside mcp`, and `aside repl`. The installed binary confirms the surface and additionally exposes `--model`, `--provider`, `--speed`, and `--effort`; subcommands are `account`, `exec`, `repl`, and `mcp`. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside --version` → 1.26.626.1517; `aside --help`, observed 2026-07-16]**

2. The documented install path is the official shell bootstrap `curl -fsSL https://releases.aside.com/install.sh | bash`; the fetched script currently supports macOS arm64 and x64, defaults to `~/.aside/cli` for the app and `~/.local/bin/aside` for the command shim, and allows `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, and `ASIDE_CLI_BIN_DIR` overrides. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://releases.aside.com/install.sh]**

3. Aside MCP is a local stdio server. `aside mcp --help` has no URL, port, bearer-token, OAuth, or HTTP options; a JSON-RPC handshake returned server name `aside`, the installed server version, protocol version `2024-11-05`, and `tools.listChanged: true`. This is sufficient for a Code Mode `transport: "stdio"`, `command: "aside"`, `args: ["mcp"]` manual, but there is no public evidence for a remote HTTP MCP registration. **[SOURCE: local commands: `aside mcp --help` and MCP JSON-RPC `initialize`, observed 2026-07-16] [INFERENCE: the absence of documented remote options plus the successful stdio handshake supports a local-stdio-only registration]**

4. The live server exposes one MCP tool, `repl`, rather than separate `navigate`, `dom`, `screenshot`, `console`, or `network` tools. Its schema requires a user-facing `title` and a JavaScript `code` string. The tool description says the code runs in a persistent sandboxed ES2023+ context with Playwright, a 120-second call timeout, no external modules, and `execution.taskSupport: forbidden`. **[SOURCE: local MCP JSON-RPC `tools/list` response for `aside mcp`, observed 2026-07-16]**

5. The `repl` fallback is capable of the requested browser surface through code: the advertised environment includes `openTab(url)`, `tabs`, `listBrowserTabs`, `attachBrowserTab`, `attachActiveBrowserTab`, `snapshot(page, options?)`, `page.screenshot`, `annotatedScreenshot`, `fetch`, `fs`, `sleep`, and a persistent `page`. A non-mutating `repl` probe confirmed `page`, `tabs`, `fs`, and `pwd` are objects/values while `openTab`, `snapshot`, `annotatedScreenshot`, and `fetch` are functions. DOM inspection is therefore snapshot/Playwright-code based; screenshots are page/locator methods; navigation is `openTab`. **[SOURCE: local MCP JSON-RPC `tools/list` and `tools/call(repl)` probes, observed 2026-07-16]**

6. Console and network capture are not advertised as first-class MCP tools or helper functions in the live schema. A future `mcp-aside-devtools` Code Mode packet should implement those workflows inside the `repl` code using only verified Playwright APIs and should mark them as capability probes until tested against a bound browser profile; it must not invent `aside_console` or `aside_network` tool names. **[SOURCE: local MCP `tools/list` response, observed 2026-07-16] [INFERENCE: browser-side Playwright event listeners may cover console/request capture, but this was not asserted as a live Aside-specific helper]**

7. The MCP process is not a generic headless browser daemon with an independent session identifier. Calling the exposed `repl` tool with `listBrowserTabs()` in a fresh stdio process returned `This task is not bound to a browser profile. Open it in Aside browser and try again.` The server emits startup/shutdown telemetry with `discoveryIdleTimeoutMs: 300000` and `replIdleTimeoutMs: 1800000`, so the process maintains a persistent REPL context while connected, but browser use depends on an Aside task/profile binding. **[SOURCE: local MCP `tools/call(repl)` failure and `aside mcp` startup/shutdown events, observed 2026-07-16]**

8. Auth is account/profile and UI-policy based, not a documented MCP bearer/API-key contract. The developer page documents `aside account list/status/use`, and `--account` for `aside` and `aside exec`; it does not document an account or auth option for `aside mcp`. Official permission docs define `Read only`, `Guard` (default for new tasks), and `Full access`, plus browser/network/tool rules; saved password values remain hidden from the agent. This means unattended use must be treated as conditional: a signed-in Aside profile and task binding are prerequisites, and MFA, CAPTCHA, approvals, or other visible verification can pause a task. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]**

## Ruled Out

- Separate Aside MCP tools named `navigate`, `dom`, `screenshot`, `console`, or `network`: the live `tools/list` inventory returned only `repl`. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]**
- A documented remote HTTP/SSE MCP endpoint or static bearer-token configuration: the official developer page and `aside mcp --help` document only the local stdio command. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside mcp --help`, observed 2026-07-16]**
- Treating a fresh `aside mcp` process as sufficient to control any browser: the live unbound-profile error disproves that assumption. **[SOURCE: local MCP `tools/call(repl)` probe, observed 2026-07-16]**

## Dead Ends

- Public docs do not enumerate the MCP schema beyond the server launch snippet; live protocol discovery is the authoritative tool inventory for this packet. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local MCP `tools/list`, observed 2026-07-16]**

## Edge Cases

- Ambiguous input: “Aside MCP server” could mean a remote service or the local CLI subcommand; the live installed command and official docs support local stdio, while remote transport remains unverified.
- Contradictory evidence: none found; public docs and the installed CLI agree on the CLI/MCP/REPL split.
- Missing dependencies: a browser profile was intentionally not opened or mutated, so live navigation/DOM/screenshot behavior remains untested.
- Partial success: the CLI and MCP handshake/tool inventory are verified; browser-bound execution and console/network behavior are deferred.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/help/security]
- [SOURCE: https://docs.aside.com/help/tasks]
- [SOURCE: https://docs.aside.com/help/troubleshooting]
- [SOURCE: https://releases.aside.com/install.sh]
- [SOURCE: local command: `aside --help`, `aside mcp --help`, `aside repl --help`, `aside exec --help`, `aside account --help`]
- [SOURCE: local MCP JSON-RPC probes: `initialize`, `tools/list`, `tools/call(repl)`]

## Assessment

- New information ratio: 0.95
- Questions addressed: standalone CLI existence; official install/launch surface; MCP transport; live tool inventory; browser-profile prerequisite; initial auth/permission boundary.
- Questions answered: standalone CLI exists; MCP is local stdio; live tool inventory is one `repl` tool; a fresh MCP process is not browser-bound.
- Confidence: high for the installed version and live protocol observations; medium for long-term stability because the MCP schema is runtime-discovered and Aside is rapidly changing.

## Reflection

- What worked and why: combining official docs, the installed binary's help output, and a real MCP JSON-RPC handshake resolved the CLI-vs-MCP ambiguity and avoided guessing tool names.
- What did not work and why: a browser-bound action could not be tested without a task/profile; the server correctly rejected the unbound probe.
- What I would do differently: in iteration 2, use the real default Aside profile only if an explicit benign local/public-page smoke test is authorized; otherwise inspect daemon/session behavior without opening a user tab.

## Recommended Next Focus

Iteration 2: Aside session/account/daemon lifecycle, permission and unattended-automation boundaries, plus a safe browser-bound smoke-test plan. Do not broaden into bdg mapping until the session model is explicit.
