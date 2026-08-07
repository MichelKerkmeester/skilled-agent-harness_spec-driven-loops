# Deep Research Strategy — Aside Developer Surface

## 1. Overview

This lineage verifies Aside's actual developer interfaces before the `mcp-aside-devtools` mode is authored. It prioritizes primary evidence, preserves negative knowledge, and forces all five iterations even if convergence telemetry drops below the configured threshold.

## 2. Topic

Aside browser CLI and MCP server: command/tool surface, installation, authentication, transport, session and daemon behavior, browser-automation workflows, Chrome DevTools contrast, and the integration facts needed for a CLI-primary skill with a Code Mode MCP fallback and UTCP manual.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [x] Q1 — Aside exposes a standalone macOS CLI with direct task, `exec`, `account`, `mcp`, and `repl` modes; `--session` continues a task and `--account` selects an account. Exact unpublished help flags remain unverified.
- [x] Q2 — `aside mcp` is a client-spawned local stdio process configured as command/args. It depends on the Aside local daemon/browser service and selected device account; no MCP token, remote URL, or documented `--account` override exists. Exact initialization and tools require a live probe.
- [x] Q3 — Aside's confirmed automation contract is a Playwright-compatible JS REPL/Asidewright layer covering navigation/tabs, accessibility snapshots, locators/keyboard/evaluate, screenshots, downloads, network workflows, and visual fallback. Console and every exact MCP tool name/schema are probe-required; run MCP `initialize` and `tools/list` before use.
- [x] Q4 — Production use must layer its own read/action/sensitive policy over Aside, preflight account/daemon/profile, serialize mutations per profile, redact outputs, treat page content as hostile, and stop for MFA/CAPTCHA/vault/approval/sensitive actions. MCP permission inheritance and concurrency isolation remain live-test requirements.
- [x] Q5 — Reuse Chrome's CLI-first/discovery/evidence discipline, but route deterministic Aside work through `aside repl`; register one credential-free `aside` stdio manual, discover schemas at runtime, and serialize mutations per profile until isolation is proven.
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Implementing the `mcp-aside-devtools` skill or editing `.utcp_config.json`.
- Installing Aside, logging into a user account, or exercising a private authenticated browser session.
- Modifying files outside this lineage packet.
- Treating marketing copy or generated snippets as stronger evidence than verified docs, package metadata, or observed APIs.

## 5. Stop Conditions

- Complete five iterations, regardless of early convergence telemetry.
- Synthesize after iteration 5 with explicit confidence labels for unsupported or contradictory claims.
- Halt only for corrupt lineage state, an unrecoverable write-boundary breach, or a security incident.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- Q1 — Answered in iteration 1 from Aside's developer documentation and official installer.
- Q2 — Answered in iteration 2 from the developer page and component changelog; live tool-schema discovery remains under Q3.
- Q3 — Answered in iteration 3 as a capability/probe contract; negative knowledge forbids guessed MCP names.
- Q4 — Answered in iteration 4 from product controls, policies, and operational changelog evidence.
- Q5 — Answered in iteration 5 from repository-local Chrome DevTools, Code Mode, UTCP, and manual-testing contracts.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Direct primary-page retrieval: search indexing missed product-specific commands, while the developer page exposed the supported surface. (iteration 1)
- Official installer inspection: resolved supported platforms and filesystem layout without installing the binary. (iteration 1)
- Changelog correlation: exposed stdio failure diagnostics, idle keepalive, and daemon outage behavior omitted from setup docs. (iteration 2)
- Architecture-plus-changelog triangulation: translated the REPL into concrete Playwright, accessibility, screenshot, download, tab, network, and visual lanes. (iteration 3)
- Policy/help/changelog layering: separated process trust, account/profile identity, permissions, credentials, data flows, and human approvals. (iteration 4)
- Local Chrome/Code Mode inspection: exposed the exact router, UTCP, discovery, callable-name, cleanup, and artifact-validation conventions. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Broad “Aside CLI” web search: product-name ambiguity returned unrelated browser MCP projects. (iteration 1)
- Exact MCP schema search: no official or captured `tools/list` response was publicly indexed. (iteration 2)
- Benchmark repository search: no indexed MCP handshake or tool schema appeared. (iteration 3)
- MCP-specific permission/concurrency search: public docs define UI task controls but not foreign-client inheritance or multi-client isolation. (iteration 4)
- Cross-product analogy: Chrome's typed commands and isolation flags cannot establish Aside commands or concurrency guarantees. (iteration 5)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches (do not retry)

- Invented typed CLI subcommands: no primary evidence for `aside navigate`, `aside screenshot`, or network/DOM equivalents; use task mode, REPL, or MCP instead. (iteration 1)
- Remote exported MCP transport: no primary evidence for HTTP/SSE; use local stdio unless runtime introspection proves otherwise. (iteration 2)
- Inbound/outbound MCP conflation: Aside's authenticated HTTP connectors describe servers Aside consumes, not the server `aside mcp` exports. (iteration 2)
- Borrowed browser MCP tool names: unrelated servers cannot define Aside's unpublished tool registry. (iteration 3)
- Agent-facing CDP control: Aside uses CDP internally but exposes Playwright-compatible semantics to agents. (iteration 3)
- Local stdio as a trust boundary: logged-in browser state remains sensitive even without a network listener. (iteration 4)
- Fully unattended sensitive actions or authentication challenges: product policy requires human gates. (iteration 4)
- Concurrent mutation by multiple clients on one profile: unsupported until isolation is proven. (iteration 4)
- Chrome command cloning: retain the router and validation pattern, but use Aside's documented task/REPL/MCP lanes. (iteration 5)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions

- Exact `aside --help` flag inventory remains unavailable without an installed binary.
- Exact `tools/list` output and MCP protocol metadata remain unavailable without a live Aside installation and daemon.
- Console collection remains probe-required; no Aside primary page names a console method.
- MCP-to-task permission-mode inheritance and visible task/audit recording remain unverified.
- Multi-client/session isolation within one selected profile remains unverified.
- Exact Code Mode callable names remain unverified until the registered manual returns tools at runtime.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: live install fixtures, exact MCP schemas, permission inheritance, console support, and isolation probes
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

- Exact `aside --help` and version output.
- Captured MCP `initialize` and `tools/list` fixtures.
- Console capability, permission inheritance, and per-profile concurrency behavior.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Complete — five passes and terminal synthesis emitted. Resume only for a new generation with installed-product fixtures.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Primary seed: `https://docs.aside.com/help/developers#use-mcp`.
- Parent phase says CLI existence is unverified and must not be assumed.
- No packet `resource-map.md` exists; source coverage must be built from the research itself.
- The root fan-out config assigns this lineage five `cli-codex / gpt-5.6-sol / xhigh / fast` iterations.

## 13. Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations; convergence is telemetry only before iteration 5
- Per-iteration budget: target 8–11 calls, hard max 12
- Researched surfaces are read-only
- All writes remain under the lineage root
- Current generation: 1
- Started: 2026-07-16T10:12:20Z
