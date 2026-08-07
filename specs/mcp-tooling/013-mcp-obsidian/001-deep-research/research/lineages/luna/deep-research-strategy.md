---
title: Deep Research Strategy - Obsidian Automation Surfaces
description: Research strategy for the detached Obsidian automation-surface lineage.
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Obsidian Automation Surfaces

## 1. OVERVIEW

This packet tracks three fresh-context research iterations. Reducer-owned sections are refreshed after each iteration.

## 2. TOPIC

Map Obsidian automation surfaces and decide BUILD-vs-ADOPT for a dual CLI+MCP integration.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What official Obsidian automation surfaces exist, and which require a running app?
- [x] Which community CLI packages and binaries are real, identifiable, and feature-complete enough to adopt?
- [x] Which MCP servers and package identities are real, and what are their headless/app and auth requirements?
- [x] What do the Local REST API plugin and obsidian:// URI scheme provide, including auth, configuration, and limits?
- [x] What ranked BUILD-vs-ADOPT choice should be made for each feature and for the dual CLI+MCP mode?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement the Obsidian CLI, MCP mode, or .utcp_config.json changes in this research packet.
- Do not treat unverified package names, search snippets, or stale repositories as adopted candidates.
- Do not infer headless support when a candidate depends on an Obsidian app, plugin, vault, or token.

## 5. STOP CONDITIONS

- Continue through all three iterations even if convergence telemetry becomes favorable before the cap.
- Stop at the hard max-iterations boundary and synthesize with explicit unresolved questions.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What official Obsidian automation surfaces exist, and which require a running app?
- Which community CLI packages and binaries are real, identifiable, and feature-complete enough to adopt?
- Which MCP servers and package identities are real, and what are their headless/app and auth requirements?
- What do the Local REST API plugin and obsidian:// URI scheme provide, including auth, configuration, and limits?
- What ranked BUILD-vs-ADOPT choice should be made for each feature and for the dual CLI+MCP mode?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `@clickup/mcp-server` as an adopted package: the exact name did not resolve during identity verification. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `@clickup/mcp-server` as an adopted package: the exact name did not resolve during identity verification. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `@clickup/mcp-server` as an adopted package: the exact name did not resolve during identity verification. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server]

### `@questi0nm4rk/vori` as the dual CRUD CLI: its advertised surface is read-only query/search. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `@questi0nm4rk/vori` as the dual CRUD CLI: its advertised surface is read-only query/search. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `@questi0nm4rk/vori` as the dual CRUD CLI: its advertised surface is read-only query/search. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori]

### `obsidian-headless` as a note-operation backend: its verified package identity and documented command surface are Sync/Publish, not arbitrary vault operations. [SOURCE: https://www.npmjs.com/package/obsidian-headless] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `obsidian-headless` as a note-operation backend: its verified package identity and documented command surface are Sync/Publish, not arbitrary vault operations. [SOURCE: https://www.npmjs.com/package/obsidian-headless]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `obsidian-headless` as a note-operation backend: its verified package identity and documented command surface are Sync/Publish, not arbitrary vault operations. [SOURCE: https://www.npmjs.com/package/obsidian-headless]

### `obsidian://` as the primary CRUD or MCP transport: it launches desktop actions and has no authenticated data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `obsidian://` as the primary CRUD or MCP transport: it launches desktop actions and has no authenticated data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `obsidian://` as the primary CRUD or MCP transport: it launches desktop actions and has no authenticated data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]

### A process being runnable with `npx`, `uvx`, or a native binary does not make the Obsidian backend headless; all Local REST API candidates still need the app/plugin/token. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A process being runnable with `npx`, `uvx`, or a native binary does not make the Obsidian backend headless; all Local REST API candidates still need the app/plugin/token.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A process being runnable with `npx`, `uvx`, or a native binary does not make the Obsidian backend headless; all Local REST API candidates still need the app/plugin/token.

### A single “headless Obsidian” backend covering all semantics: official headless is Sync/Publish, the official CLI is app-backed, and Local REST/MCP requires the desktop plugin. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A single “headless Obsidian” backend covering all semantics: official headless is Sync/Publish, the official CLI is app-backed, and Local REST/MCP requires the desktop plugin. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single “headless Obsidian” backend covering all semantics: official headless is Sync/Publish, the official CLI is app-backed, and Local REST/MCP requires the desktop plugin. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

### Building a full replacement note engine as the first implementation: the adopted transports already cover the majority of CRUD/search/tag/frontmatter behavior. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Building a full replacement note engine as the first implementation: the adopted transports already cover the majority of CRUD/search/tag/frontmatter behavior. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a full replacement note engine as the first implementation: the adopted transports already cover the majority of CRUD/search/tag/frontmatter behavior. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

### Convergence telemetry fell below the first iteration ratio but remained above the configured threshold; the max-iterations policy still required this third pass, so synthesis was intentionally deferred until after these feature and configuration checks. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Convergence telemetry fell below the first iteration ratio but remained above the configured threshold; the max-iterations policy still required this third pass, so synthesis was intentionally deferred until after these feature and configuration checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Convergence telemetry fell below the first iteration ratio but remained above the configured threshold; the max-iterations policy still required this third pass, so synthesis was intentionally deferred until after these feature and configuration checks.

### The legacy `obsidian-cli` name as the primary install target: the maintained project explicitly renamed the binary/repository to `notesmd-cli`; use the current identity. [SOURCE: https://github.com/Yakitrak/notesmd-cli] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The legacy `obsidian-cli` name as the primary install target: the maintained project explicitly renamed the binary/repository to `notesmd-cli`; use the current identity. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The legacy `obsidian-cli` name as the primary install target: the maintained project explicitly renamed the binary/repository to `notesmd-cli`; use the current identity. [SOURCE: https://github.com/Yakitrak/notesmd-cli]

### The negative package identity remains unresolved as an installable candidate; no dependency should be generated from an unresolvable scoped name. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The negative package identity remains unresolved as an installable candidate; no dependency should be generated from an unresolvable scoped name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The negative package identity remains unresolved as an installable candidate; no dependency should be generated from an unresolvable scoped name.

### The nested `cli-codex` executor could not initialize its app-server client in this runtime. Direct-mode continuation is recorded in the lineage state; research evidence remains packet-local and citation-backed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The nested `cli-codex` executor could not initialize its app-server client in this runtime. Direct-mode continuation is recorded in the lineage state; research evidence remains packet-local and citation-backed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The nested `cli-codex` executor could not initialize its app-server client in this runtime. Direct-mode continuation is recorded in the lineage state; research evidence remains packet-local and citation-backed.

### Treating backlinks or template management as guaranteed core Local REST API features: the documented endpoint/tool matrix does not establish those complete portable surfaces. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating backlinks or template management as guaranteed core Local REST API features: the documented endpoint/tool matrix does not establish those complete portable surfaces. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating backlinks or template management as guaranteed core Local REST API features: the documented endpoint/tool matrix does not establish those complete portable surfaces. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

### Treating the official TypeScript API as a headless binary: it is documented as an Obsidian plugin API. [SOURCE: https://docs.obsidian.md/Plugins/Vault] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the official TypeScript API as a headless binary: it is documented as an Obsidian plugin API. [SOURCE: https://docs.obsidian.md/Plugins/Vault]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the official TypeScript API as a headless binary: it is documented as an Obsidian plugin API. [SOURCE: https://docs.obsidian.md/Plugins/Vault]

### Unscoped package-name assumptions are unsafe. `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, and `@connorbritain/obsidian-mcp-server` are distinct npm identities even when their names and README text overlap. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unscoped package-name assumptions are unsafe. `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, and `@connorbritain/obsidian-mcp-server` are distinct npm identities even when their names and README text overlap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unscoped package-name assumptions are unsafe. `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, and `@connorbritain/obsidian-mcp-server` are distinct npm identities even when their names and README text overlap.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `obsidian-headless` as a note-operation backend: its verified package identity and documented command surface are Sync/Publish, not arbitrary vault operations. [SOURCE: https://www.npmjs.com/package/obsidian-headless] (iteration 1)
- `obsidian://` as the primary CRUD or MCP transport: it launches desktop actions and has no authenticated data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] (iteration 1)
- The nested `cli-codex` executor could not initialize its app-server client in this runtime. Direct-mode continuation is recorded in the lineage state; research evidence remains packet-local and citation-backed. (iteration 1)
- Treating the official TypeScript API as a headless binary: it is documented as an Obsidian plugin API. [SOURCE: https://docs.obsidian.md/Plugins/Vault] (iteration 1)
- `@clickup/mcp-server` as an adopted package: the exact name did not resolve during identity verification. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] (iteration 2)
- `@questi0nm4rk/vori` as the dual CRUD CLI: its advertised surface is read-only query/search. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori] (iteration 2)
- A process being runnable with `npx`, `uvx`, or a native binary does not make the Obsidian backend headless; all Local REST API candidates still need the app/plugin/token. (iteration 2)
- The legacy `obsidian-cli` name as the primary install target: the maintained project explicitly renamed the binary/repository to `notesmd-cli`; use the current identity. [SOURCE: https://github.com/Yakitrak/notesmd-cli] (iteration 2)
- Unscoped package-name assumptions are unsafe. `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, and `@connorbritain/obsidian-mcp-server` are distinct npm identities even when their names and README text overlap. (iteration 2)
- A single “headless Obsidian” backend covering all semantics: official headless is Sync/Publish, the official CLI is app-backed, and Local REST/MCP requires the desktop plugin. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] (iteration 3)
- Building a full replacement note engine as the first implementation: the adopted transports already cover the majority of CRUD/search/tag/frontmatter behavior. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] (iteration 3)
- Convergence telemetry fell below the first iteration ratio but remained above the configured threshold; the max-iterations policy still required this third pass, so synthesis was intentionally deferred until after these feature and configuration checks. (iteration 3)
- The negative package identity remains unresolved as an installable candidate; no dependency should be generated from an unresolvable scoped name. (iteration 3)
- Treating backlinks or template management as guaranteed core Local REST API features: the documented endpoint/tool matrix does not establish those complete portable surfaces. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] (iteration 3)

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
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Resource map: resource-map.md not present; skipping coverage gate.
- The requested executor is the detached `cli-codex` lineage with model `gpt-5.6-luna`.
- The lineage directory is the sole write boundary for this run.

## 13. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05
- Stop policy: max-iterations; convergence is telemetry only
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Spec anchoring and continuity save: skipped for detached lineage scope
<!-- ANCHOR:run-metadata -->
- Session: fanout-luna-1785652123667-7lklw5
- Generation: 1
- Started: 2026-08-02T06:40:51.000Z
<!-- /ANCHOR:run-metadata -->
