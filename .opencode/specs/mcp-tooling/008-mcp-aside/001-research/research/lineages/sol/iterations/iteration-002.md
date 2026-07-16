# Iteration 2: MCP Transport, Authentication Boundary, and Daemon Lifecycle

## Focus

Verify how `aside mcp` is launched and connected, then distinguish transport authentication from the Aside account/browser authorization that the local process inherits. Exact browser tools are intentionally deferred to Q3.

## Actions Taken

1. Re-read lineage config, state, and strategy and checked the iteration write paths.
2. Retrieved the primary developer, permissions, and privacy pages as Markdown.
3. Searched Aside's browser/component changelogs for MCP, CLI, REPL, account, and daemon behavior.
4. Searched for independent descriptions of `aside mcp` and separated product-specific results from unrelated MCP projects.

## Findings

1. The exported server is documented as a local command MCP server: client configuration uses `command: "aside"` and `args: ["mcp"]`, with no URL, port, environment variable, token, or OAuth metadata. Under the MCP configuration model this is a client-spawned stdio process, not a remote HTTP/SSE endpoint. [SOURCE: https://docs.aside.com/help/developers]

2. Aside's changelog independently calls failed connections to local stdio servers “MCP connections,” corroborating stdio as a live product transport. It also records stderr and timeout details for connection failures, which a skill should surface rather than masking as a generic unavailable-tool error. [SOURCE: https://docs.aside.com/changelog/components.md]

3. `aside mcp` has a durable idle lifecycle but is not self-contained. A July 2026 fix keeps the MCP server alive after idle periods and reports daemon outages plainly; this implies a long-lived stdio bridge backed by a separate local Aside daemon/browser service. The wrapper should restart a dead MCP child, but it must diagnose daemon/browser availability separately. [SOURCE: https://docs.aside.com/changelog/components.md]

4. The public MCP client snippet carries no MCP-layer credential. Authentication therefore appears local/process-bound: the CLI runs under an Aside account selected on the device, while the browser profile and daemon mediate access to logged-in sites. This is an inference, not a documented bearer-token contract. [SOURCE: https://docs.aside.com/help/developers] [INFERENCE: command-only stdio configuration plus device account selection]

5. Account behavior is asymmetric. The docs explicitly allow `--account` for direct `aside` tasks and `aside exec`, but do not document it for `aside mcp` or `aside repl`. Phase 2 must not invent `aside mcp --account`; it should use the selected/default account and expose a preflight based on `aside account status`, pending runtime verification. [SOURCE: https://docs.aside.com/help/developers]

6. Aside account sign-in and model-provider authentication are distinct. A signed-out Aside account disables built-in Aside models, while user-provided OpenAI/Anthropic credentials can continue for CLI task execution. The deterministic MCP server may not invoke a model at all, so model auth cannot be treated as the MCP transport credential. [SOURCE: https://docs.aside.com/help/developers]

7. The changelog's “MCP settings,” “session tools,” and “authenticated HTTP connectors” describe Aside acting as an MCP client for external servers. They are not evidence that the exported `aside mcp` server itself offers HTTP transport. Conflating inbound and outbound MCP surfaces would produce a wrong UTCP manual. [SOURCE: https://docs.aside.com/changelog/components.md]

8. The public developer page does not enumerate `tools/list`, tool names, argument schemas, protocol version, capabilities, or initialization behavior. A production integration needs an install-time/runtime MCP probe that launches `aside mcp`, performs `initialize`, and records `tools/list`; until that succeeds, exact MCP tool parity is UNKNOWN. [SOURCE: https://docs.aside.com/help/developers]

## Ruled Out

- Remote HTTP/SSE configuration for the exported server: no primary source documents a URL or server port; the supported snippet is command/args.
- A token/API-key field in `mcp.json`: the primary snippet contains none.
- Using Aside's new authenticated HTTP connector feature as exported-server transport evidence: that feature belongs to Aside's MCP-client settings.

## Dead Ends

- Public search did not expose a captured `tools/list` response or official MCP schema. Exact tool names remain a runtime-discovery obligation.

## Edge Cases

- Ambiguous input: “auth” spans MCP transport, Aside account state, AI provider credentials, site sessions, and permission rules. These are separate layers.
- Contradictory evidence: none; changelog and developer configuration agree on local stdio.
- Missing dependencies: no installed/logged-in Aside instance was available for protocol probing.
- Partial success: transport and process model are high-confidence; tool schema and `mcp` account overrides remain unverified.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/help/security]
- [SOURCE: https://docs.aside.com/help/privacy]
- [SOURCE: https://docs.aside.com/changelog/components.md]
- [SOURCE: https://docs.aside.com/changelog/native.md]

## Assessment

- New information ratio: 0.93
- Questions addressed: Q2, Q3, Q4
- Questions answered: Q2, except undocumented account override and protocol/tool schema details

## Reflection

- What worked and why: changelog evidence exposed lifecycle details absent from the concise developer page and clarified the local daemon dependency.
- What did not work and why: web search still mixed unrelated “Aside” and browser MCP products; exact MCP introspection output is not indexed.
- What I would do differently: use the protocol itself as the next evidence boundary—define the required `initialize`/`tools/list` preflight and evaluate what the REPL/changelog imply without naming undocumented tools.

## Recommended Next Focus

Q3 — Map supported browser-automation workflows. Separate confirmed REPL/Playwright primitives from UNKNOWN MCP tool names, and determine the minimum capability probe for navigation, inspection, interaction, screenshots, console, network, downloads, tabs, and sessions.

## Scope Violations

- No MCP process was installed or launched because doing so could create account/runtime state outside the authorized lineage. The missing live `tools/list` is reported rather than fabricated.
