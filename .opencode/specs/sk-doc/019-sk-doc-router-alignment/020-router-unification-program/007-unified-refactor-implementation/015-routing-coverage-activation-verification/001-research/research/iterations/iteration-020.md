# Iteration 20 — gpt-5.6-terra xhigh — focus: unnamed

Headline: P4 cannot make compiled routing effective in the OpenCode hook as written. The advisor attaches `compiledRoute`, but the hook bridge discards it before injecting the system brief; the fallback chain also drops the future `=0` kill-switch.

Nine direct absent→legacy consumers:

- Runtime resolver: flag must equal `'1'`; missing or malformed manifests resolve to legacy, and all non-serving states return `null`. `.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs:22-46`
- Public front door converts that `null` or any throw into the legacy sentinel. `.opencode/bin/compiled-route.cjs:32-39`
- Advisor enrichment returns legacy output unless the flag equals `'1'`, then drops the sentinel. `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts:326-373`
- Seven agent-facing hub directives independently say “invoke compiled only when `=1`; otherwise use legacy”: `cli-external-orchestration/SKILL.md:41-45`, `mcp-tooling/SKILL.md:44-48`, `sk-code/SKILL.md:52-56`, `sk-design/SKILL.md:56-60`, `sk-doc/SKILL.md:50-54`, `sk-prompt/SKILL.md:36-40`, and `system-deep-loop/SKILL.md:40-44`.

The transport paths matter too. The OpenCode plugin passes its environment to the bridge, `.opencode/plugins/mk-skill-advisor.js:542-545`; the bridge’s supported no-dist fallback filters that environment before launching MCP, `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:58-87`, `:210-213`, `:371-377`; then the launcher independently filters it again before spawning the advisor server. `.opencode/bin/mk-skill-advisor-launcher.cjs:99-150`, `:267-285`, `:1268-1271`

Ranked actions:

1. P0 — Make the hook consume a validated compiled decision. The handler emits `compiledRoute`, but both native and CLI bridge projections retain only skill/confidence fields, and the renderer outputs only the top skill label. `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts:357-373`, `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:539-577`, `:788-812`, `:326-361`  
   Add an explicit bridge-level compiled-decision projection and render/consume its route targets or clarification state before the plugin injects the brief. The current injection point receives only that brief. `.opencode/plugins/mk-skill-advisor.js:765-773`

2. P0 — Add `SPECKIT_COMPILED_ROUTING` to both bridge and launcher child-env contracts. Otherwise the supported fallback loses explicit `=0`; after the planned unset=on semantic change, that turns a kill-switch invocation into compiled serving. This refines F-14-6. The P4 contract requires `=0` rollback. `012-default-on-decision/spec.md:202`

3. P1 — Bind OpenCode’s advisor cache to the effective compiled-serving state. Its signature tracks skill roots and advisor artifacts, not activation manifests; its cache key uses only that signature. `.opencode/plugins/mk-skill-advisor.js:150-179`, `:271-284`  
   Once compiled decisions reach the hook, a per-hub flip, rollback, or re-mint can otherwise leave a cached prior serving state until expiry.

4. P1 — Extend P4 verification from resolver/advisor metadata to the real hook chain. The plugin suite uses synthetic opaque bridge envelopes, so it cannot catch route-field loss. `.opencode/plugins/tests/mk-skill-advisor.test.cjs:76-82`, `:117-130` The current P4 plan names resolver/advisor child probes but not an OpenCode transform test. `012-default-on-decision/plan.md:187-195`  
   Test native and no-dist fallback paths for unset, `=1`, and `=0`, asserting the injected context carries the expected compiled route or legacy fallback.

Read-only audit; no files changed.

===FINDINGS-JSON-START===
[
  {"id":"F-20-1","area":"unnamed","finding":"The OpenCode hook drops the advisor's compiledRoute before rendering and injecting its system brief, so default-on cannot make compiled routing effective at that agent boundary.","evidence":".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:539","severity":"P0","actionable":"Define a validated compiled-decision projection in both native and CLI bridge paths and render or structurally consume route, clarify, defer, and reject outcomes before system-context injection.","novelty":"new"},
  {"id":"F-20-2","area":"activation","finding":"The supported bridge-to-launcher fallback has a second child-environment allowlist that omits SPECKIT_COMPILED_ROUTING, so an explicit future =0 kill-switch is lost before the advisor child starts.","evidence":".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:58","severity":"P0","actionable":"Add the flag to both bridge and launcher child-env allowlists and test unset, 1, and 0 through native plus fallback subprocess chains.","novelty":"refines:F-14-6"},
  {"id":"F-20-3","area":"activation","finding":"The OpenCode advisor cache fingerprints skill roots and advisor artifacts but not activation manifests, so a serving flip, rollback, or re-mint will not invalidate a future compiled-routing hook decision.","evidence":".opencode/plugins/mk-skill-advisor.js:150","severity":"P1","actionable":"Include a shared effective-serving-state fingerprint in the cache key or bypass the cache for compiled decisions, with manifest-flip and rollback invalidation tests.","novelty":"new"},
  {"id":"F-20-4","area":"unnamed","finding":"The OpenCode plugin regression suite stubs opaque bridge output and therefore cannot detect compiledRoute loss or kill-switch propagation through the real hook chain.","evidence":".opencode/plugins/tests/mk-skill-advisor.test.cjs:76","severity":"P1","actionable":"Add end-to-end bridge and plugin system-transform tests using a real compiled decision for native and no-dist launcher fallback paths.","novelty":"new"}
]
===FINDINGS-JSON-END===

