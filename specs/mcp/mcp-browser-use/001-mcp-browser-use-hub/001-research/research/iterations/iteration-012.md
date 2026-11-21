# Iteration 12: Settle the Chrome DevTools Lighthouse contradiction

## Focus

Resolve the one remaining open question (operator inbox question 10): the hub router advertises "run a Lighthouse or performance trace" as Chrome DevTools intent, but the Chrome DevTools feature catalog has no dedicated Lighthouse feature. Determine whether the mode actually offers Lighthouse, and if so in which lane and with what scope, from the local files plus the chrome-devtools-mcp / bdg upstream docs. No prior iteration is BLOCKED for this direction — the exhausted entries concern Bladebro web search and live Bladebro probes only.

## Actions Taken

1. Read state (config, strategy, findings registry, state JSONL) and verified the packet-local write boundary: `iteration-012.md` and `deltas/iter-012.jsonl` absent, `research.md` present with `progressiveSynthesis: true`.
2. `rg -i lighthouse` over `.skilled/skills/mcp-tooling` to inventory every local Lighthouse mention (router, registry, graph metadata, catalogs, fixtures).
3. Read the Chrome DevTools feature catalog feature list and Feature Count Summary, plus the router intent block and SKILL.md HAR/performance lines.
4. Parsed the 2026-07-16 `list_tools` discovery fixture to enumerate the actual registered Chrome DevTools MCP tools per instance.
5. Fetched the upstream `chrome-devtools-mcp` README and auto-generated Tool Reference to confirm the tool upstream and pin its exact scope.

## Findings

1. **Yes — the Chrome DevTools mode really does offer Lighthouse, in the MCP-via-Code-Mode lane.** The upstream Tool Reference documents `lighthouse_audit` as a first-class Debugging tool: "Get Lighthouse scores, failing audits, and the DOM nodes they flag for accessibility, SEO, best practices, and agentic browsing. Full reports are saved to disk. This excludes performance. For performance audits, run `performance_start_trace`" [SOURCE: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/docs/tool-reference.md]. The upstream README independently frames performance trace recording as a key feature [SOURCE: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/README.md].
2. **The tool is registered locally, not merely available upstream.** The 2026-07-16 `list_tools()` fixture shows `chrome_devtools_1` and `chrome_devtools_2` each exposing 29 tools including `lighthouse_audit`, `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight` and `take_memory_snapshot` [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6]. Aside's own parity leaf names the same pair as the mapping source: "Chrome DevTools' Performance panel and the Chrome DevTools MCP's `performance_start_trace` / `lighthouse_audit`" [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/performance-timing.md:17].
3. **The "feature catalog gap" is a granularity artifact, not a capability absence.** The catalog enumerates 30 features grouped as CLI bdg lifecycle, protocol discovery, DOM/screenshot, console/network, MCP parallel instances, automation/performance and recovery [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:227-238]. Its "Automation and Performance" category is four shell-script example patterns, not Lighthouse [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:170-192]. It deliberately does not freeze MCP tool names: "MCP tool names are a subset of CDP ... must be confirmed with Code Mode discovery ... never guess a tool name" [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:20]. So a missing Lighthouse *leaf* says nothing about a missing Lighthouse *tool*.
4. **The router was right and needs no keyword rewrite.** "run a Lighthouse or performance trace" is listed as Chrome DevTools intent [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:49-53], and `lighthouse` is a stage-one signal keyword in every routing surface: CHROME_DEVTOOLS intent [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:94], hub-router signals [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:140], mode-registry capabilities [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:54], and graph-metadata keywords including "run lighthouse" [SOURCE: .skilled/skills/mcp-tooling/graph-metadata.json:329].
5. **Scope split that the hub must preserve: Lighthouse ≠ performance.** Upstream `lighthouse_audit` explicitly excludes performance; Core Web Vitals and traces come from `performance_start_trace` / `performance_stop_trace` / `performance_analyze_insight` [SOURCE: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/docs/tool-reference.md]. The router's single phrase "a Lighthouse or performance trace" conflates two tool families that both exist; the new hub's capability matrix should keep them as two rows rather than one [INFERENCE: upstream tool descriptions plus ROUTER.md:52].
6. **Lighthouse is fallback-lane only; the bdg CLI lane has no shipped Lighthouse feature.** The CLI feature catalog covers raw CDP, HAR export and example scripts but lists no Lighthouse command [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:61-132] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:210]. Consequence: the new hub should map the `lighthouse` intent to the MCP leaf surface and have 004/005 add an explicit Lighthouse + performance-trace row to the Chrome packet's catalog so the router's advertised intent has a describing leaf.
7. **Do not freeze the tool count into the hub contract.** The catalog says "26 exposed tools" [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md:121] while the 2026-07-16 fixture shows 29 per instance and the current upstream reference lists a larger flag-gated catalog — consistent with the standing rule to rediscover the inventory every session [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:20] [INFERENCE: three inventories at different dates].

## Questions Answered

- Does the Chrome DevTools mode really offer Lighthouse? Its hub router lists it but its feature catalog has no entry; settle it from the files and the chrome-devtools-mcp / bdg upstream docs.

## Questions Remaining

- None. This was the last open question in the registry.

## Edge Cases

- Ambiguous input: "offer Lighthouse" could mean a catalog leaf, an MCP tool, or a CLI command. Selected the narrowest evidence-backed reading — an invocable capability in either lane — and report all three readings explicitly.
- Contradictory evidence: router + fixture + upstream confirm the tool; the catalog has no Lighthouse row. Both sides are cited above (findings 1-4); the conflict is resolved as a documentation-granularity gap, not a capability conflict.
- Missing dependencies: none. Both upstream docs were reachable; the bdg upstream repo was not separately fetched because the local CLI catalog and SKILL.md are decisive for finding 6.
- Partial success: none; all planned research actions completed.

## Sources Consulted

- https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/docs/tool-reference.md (read 2026-11-21)
- https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/README.md (read 2026-11-21)
- .skilled/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:20,61-132,170-192,227-238
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md:121
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:210
- .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/performance-timing.md:17
- .skilled/skills/mcp-tooling/ROUTER.md:49-53,94
- .skilled/skills/mcp-tooling/hub-router.json:140
- .skilled/skills/mcp-tooling/mode-registry.json:54
- .skilled/skills/mcp-tooling/graph-metadata.json:329

## Assessment

- New information ratio: 0.85 (3 of 7 findings fully new from the upstream Tool Reference and the local fixture enumeration; 3 partially new reframings of prior KQ1/routing evidence; 1 redundancy for the tool-count rule; +0.10 synthesis bonus for resolving the carried contradiction and closing the last open question).
- Questions addressed: operator inbox question 10 (Lighthouse contradiction).
- Questions answered: operator inbox question 10.

## Reflection

- What worked and why: going from the router claim to the *tool inventory* rather than hunting for a catalog leaf; the discovery fixture and the auto-generated upstream Tool Reference are both authoritative about what is actually invocable, so they settled the question in one pass.
- What did not work and why: the initial catalog-only reading (iteration 1) produced a "genuine contradiction" verdict because the catalog is organized by CLI features and MCP invocation patterns, not by MCP tool names. The granularity mismatch was the root cause.
- What I would do differently: when a packet's feature catalog and its router disagree, check the registered tool inventory first — the catalog is a teaching artifact, the tool list is the contract.

## Recommended Next Focus

Run is at its 12-iteration ceiling with all ten questions answered. No further research focus; the actionable handoff is to implementation: 004/005 should add a dedicated Lighthouse (`lighthouse_audit`) and performance-trace (`performance_start_trace`/`performance_stop_trace`) row to the Chrome DevTools packet's feature catalog so the hub router's advertised `lighthouse` intent has a describing leaf, and KQ1's capability matrix should keep Lighthouse and performance as separate rows. Do not freeze a tool count in the hub contract.

## SCOPE VIOLATIONS

None. No researched file was modified; all writes are confined to this run's packet.
