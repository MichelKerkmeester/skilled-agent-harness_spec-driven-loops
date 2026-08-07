# Iteration 3: Browser-Automation Workflows and Capability-Probe Contract

## Focus

Map what Aside can demonstrably automate and identify the stable abstraction for a skill. The iteration deliberately separates confirmed REPL/Asidewright behavior from unpublished MCP tool names.

## Actions Taken

1. Re-read lineage state and verified the third iteration paths were unused.
2. Retrieved Aside's task, browser-basics, and Ultrabrowse documentation.
3. Mined the primary component changelog for browser automation, Playwright, REPL, screenshots, downloads, tabs, and daemon behavior.
4. Located a detailed founder-authored architecture article mirror and checked its claims against primary docs/changelog evidence.
5. Searched the published benchmark repository surface for trace/tool evidence; no indexed MCP `tools/list` artifact was found.

## Findings

1. Aside's deterministic browser API is JavaScript with Playwright-compatible syntax. The public docs expose `aside repl` and `openTab(...)`; the founder's architecture write-up describes the browser layer as “Asidewright,” an opinionated thin wrapper over CDP that intentionally presents a Playwright interface. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]

2. Navigation and tab management are confirmed. `openTab(url)` is documented; changelog fixes cover same-document navigation, recovery after saved tab/window closure, background tab behavior, popup/tab-close signals, and tab/profile routing. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/changelog/components.md]

3. DOM inspection is accessibility-first, not raw CDP-first. Asidewright produces a modified accessibility snapshot that removes intermediate noise and adds focus, iframe, and clickable-state signals. This is the semantic inspection path to prefer before HTML/evaluate fallbacks. [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]

4. Standard Playwright interaction patterns are supported at least across the documented/changelog surface: locators, chained `locator.last`, keyboard down/up, page shortcuts, `page.evaluate`, and same-document navigation. Exact argument coverage may differ; the changelog explicitly notes rejected `page.evaluate` calls when arguments would be dropped. [SOURCE: https://docs.aside.com/changelog/components.md]

5. Screenshots and downloads are first-class REPL workflows. The docs explicitly recommend REPL for screenshots and downloads, while the changelog says REPL screenshots are kept in a session temporary directory and native Chrome download checks are supported. Skill output handling must therefore capture/return the produced path or content before session cleanup. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/changelog/components.md]

6. Network inspection exists in the underlying automation workflow: the founder describes capturing network requests and replaying internal site APIs through the logged-in browser. This supports a network-debug workflow, but no public MCP or REPL method name is documented. It must be expressed as Playwright-compatible code only after a runtime capability check. [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]

7. Console capture is plausible through Playwright-compatible page events, but is not explicitly documented by Aside. The authoring packet should classify console collection as `probe-required`, not guaranteed, and test a harmless `page.on('console', ...)`/equivalent script during capability detection. [INFERENCE: Playwright-compatible API claim plus no console-specific primary documentation]

8. Visual fallback exists for pages that resist DOM control. Asidewright includes a computer-use interface that works from screenshots and coordinates; the browser locks background-agent viewports to 1440×900 for stable visual behavior. This is a fallback lane, not a replacement for accessibility/locator interaction. [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]

9. The MCP surface may expose a small number of code-oriented tools rather than one MCP tool per browser action. Aside's own agent is described as having REPL and bash as core tools, and the public MCP page omits names. Therefore a Chrome-DevTools-style static mapping such as `navigate_page -> aside_navigate` would be fabricated. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks] [INFERENCE: code-oriented harness plus unpublished MCP list]

10. The minimum install-time capability probe is: launch `aside mcp`; send MCP `initialize`; send `tools/list`; record server identity/protocol version/tool schemas; classify tools into `repl/code`, `navigate`, `snapshot/dom`, `interaction`, `screenshot`, `console`, `network`, `download`, and `session/tab`; then run only harmless read/navigation smoke calls. Missing classes should route to `aside repl` or high-level `aside` task mode rather than guessed tool calls. [INFERENCE: MCP protocol discovery requirements derived from findings 1–9]

## Ruled Out

- Hard-coded MCP tool names from unrelated Browser MCP, Playwright MCP, or Chrome DevTools MCP servers.
- Treating CDP as the intended agent-facing API; Asidewright uses CDP internally but deliberately exposes Playwright semantics.
- Assuming console capture because Playwright supports it; Aside's published compatibility evidence is not a complete method table.

## Dead Ends

- Public benchmark and search indexes do not expose an Aside MCP handshake or `tools/list` capture.
- The founder architecture article is available through a mirror rather than a stable Aside documentation URL; its load-bearing capability claims were cross-checked where possible against Aside's changelog.

## Edge Cases

- Ambiguous input: “tool list” can mean Aside's internal agent tools, REPL API, or MCP tools. Only the REPL/architecture layer is presently documented.
- Contradictory evidence: none, but “100% identical to Playwright” is a broad product claim while the changelog records method-specific edge cases; the integration should probe methods it needs.
- Missing dependencies: live MCP discovery remains unavailable without a running Aside installation.
- Partial success: capability classes are well supported; exact MCP names and JSON schemas remain UNKNOWN by design.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/help/tasks]
- [SOURCE: https://docs.aside.com/help/browser-basics]
- [SOURCE: https://docs.aside.com/help/ultrabrowse]
- [SOURCE: https://docs.aside.com/changelog/components.md]
- [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]
- [SOURCE: https://github.com/at-inc/aside-benchmarks]

## Assessment

- New information ratio: 0.95
- Questions addressed: Q3 and Q5
- Questions answered: Q3 as a capability/probe contract; exact MCP schema is explicitly unresolved until runtime discovery

## Reflection

- What worked and why: pairing the changelog with the architecture explanation turned a vague “browser automation” claim into concrete Playwright, accessibility, screenshot, download, visual, tab, and network lanes.
- What did not work and why: searching for MCP names found unrelated servers because Aside has not published its `tools/list` response.
- What I would do differently: author the integration around capability classes and a discovery cache, not provider-specific static names.

## Recommended Next Focus

Q4 — Threat-model the CLI/MCP/REPL surfaces: permission inheritance, browser-profile identity, credential boundaries, prompt injection, sensitive-action approval, concurrency, incognito behavior, output/log hygiene, and unattended-run blockers.

## Scope Violations

- No downloaded Aside binary, browser profile, MCP process, or benchmark corpus was created locally; those actions could create state outside the lineage or violate the packet's no-install/reverse-engineering boundary.
