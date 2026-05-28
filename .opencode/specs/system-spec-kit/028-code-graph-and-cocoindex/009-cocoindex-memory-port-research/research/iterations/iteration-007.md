# Iteration 007 - K1.6 non-port confirmation and K2.1 prefix construction

## Focus

This iteration answers two linked questions.

K1.6 asks whether CocoIndex offers any portable query-intelligence layer for our five-channel memory search router. The target distinction is narrow: storage/index declaration or backend-specific lookup support does not count as router, intent classifier, RRF fusion, entity-density routing, or channel orchestration.

K2.1 asks where the visible MCP tool prefix comes from in names like `mcp__mk_spec_memory__memory_context`, and whether that shape is an MCP standard or a host-specific naming convention.

## Actions Taken

- Surveyed `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/external/cocoindex-main/python/cocoindex/` for retrieval, query, search, router, rank, and fuse modules.
- Read `python/cocoindex/query_handler.py`, `connectorkits/statediff.py`, and representative backend connector targets for Postgres and Qdrant.
- Read our current `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` and `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`.
- Read project MCP configs for Claude Code, OpenCode, Codex, and Gemini: `.claude/mcp.json`, `opencode.json`, `.codex/config.toml`, and `.gemini/settings.json`.
- Checked external host/protocol docs for MCP tool naming: Claude Code Agent SDK MCP docs, OpenCode MCP docs, OpenAI Codex MCP docs, Gemini CLI MCP docs, and the MCP tools specification.

## Part A: K1.6 Findings and Verdict

### CocoIndex has no portable query-intelligence module

The Python package survey found only one top-level file whose name matches query semantics: `python/cocoindex/query_handler.py`. That file defines result metadata and a `QueryOutput` wrapper. `QueryHandlerResultFields` lets an application describe returned embedding and score fields for tools such as CocoInsight (`query_handler.py:9-18`), `QueryInfo` can carry the query embedding (`query_handler.py:29-37`), and `QueryOutput` is a container for application-provided results plus query metadata (`query_handler.py:42-52`). It is not a router, classifier, retriever, reranker, fusion engine, or channel selector.

No Python modules named or shaped like `retrieval`, `search`, `router`, `rank`, or `fuse` were found under `python/cocoindex/`. The closest semantic hit outside connectors is entity resolution, but that is an upstream dedup/canonicalization operation for extracted entities, not a user-query retrieval path.

By contrast, our current memory search surface is explicitly a query router. `query-router.ts` defines the channel set as `vector`, `fts`, `bm25`, `graph`, and `degree` (`query-router.ts:35-37`), maps simple/moderate/complex tiers to channel subsets (`query-router.ts:98-108`), preserves BM25 for authority-oriented intents and artifacts (`query-router.ts:149-170`), and preserves graph/degree when intent or entity-density conditions fire (`query-router.ts:206-255`). `routeQuery()` classifies query complexity, runs the intent classifier, adjusts selected channels, emits routing reasons, and merges a routing query plan (`query-router.ts:325-447`). Nothing in the CocoIndex Python surface matches that responsibility boundary.

### Connector retrieval is backend-local, not framework-level query intelligence

CocoIndex connectors expose target-state and index declaration primitives, leaving actual retrieval semantics to the backend or to user code. The Postgres connector defines pgvector operator classes (`postgres/_target.py:394-400`), applies vector index create/drop actions (`postgres/_target.py:420-460`), and lets a table target declare a pgvector index with metric/method parameters (`postgres/_target.py:1211-1248`). That is schema/index management, not query routing.

The Qdrant connector is even clearer. Its module doc says it manages collection-level create/drop and point-level upsert/delete (`qdrant/_target.py:1-7`). It defines vector schema/distance metadata (`qdrant/_target.py:50-68`), constructs collection schemas from vector definitions (`qdrant/_target.py:107-180`), and declares/mounts collection targets (`qdrant/_target.py:520-585`). It has backend distance conversion helpers (`qdrant/_target.py:598-606`), but no cross-backend search planner or result fusion layer.

### Adjacent but distinct: statediff and target reconciliation

CocoIndex does offer important upstream mechanics adjacent to retrieval. `statediff.py` compares desired target state against prior tracking records and chooses `insert`, `upsert`, `replace`, or `delete` (`statediff.py:1-18`, `statediff.py:149-186`). It also supports composite state with keyed sub-states (`statediff.py:55-72`) and grouped sub-state transitions (`statediff.py:189-251`).

That is useful for K1.3-style target reconciliation: keeping embeddings, vector rows, graph projections, and backend indexes convergent. It is upstream of retrieval quality. It does not decide which search channels to run, whether a query is authority-seeking, how to blend vector and lexical scores, or how to route graph/degree signals.

### K1.6 verdict

NON-PORT CONFIRMED.

There is no CocoIndex query-intelligence implementation to port. The only portable lesson is architectural negative space: let CocoIndex-like reconciliation maintain clean backend targets, but keep our query intelligence in `lib/search/query-router.ts` and related TypeScript modules. Future research should not revisit CocoIndex for router, intent classifier, RRF fusion, channel routing, or entity-density query orchestration unless upstream adds a new retrieval framework layer.

## Part B: K2.1 Findings, Matrix, and Verdict

### Protocol baseline

The MCP protocol does not specify `mcp__<server>__<tool>`. The tools spec defines each tool with a `name`, `description`, and schemas, with names unique only within a single server. It recommends tool names of 1-128 characters using ASCII letters, digits, underscore, hyphen, and dot, and it says aggregating clients should implement their own collision-disambiguation strategy such as prefixing with a server identifier. It also warns that `serverInfo.name` is not guaranteed unique and should not be relied on for disambiguation. Source: Model Context Protocol tools spec, lines 300-310 at `https://modelcontextprotocol.io/specification/draft/server/tools`.

Our server follows that model. `ToolDefinition` has a raw `name: string` field (`tool-schemas.ts:32-39`), and tools are defined as names such as `memory_context` and `memory_search` (`tool-schemas.ts:47-56`) without the server prefix. The `mcp__...` or equivalent prefix is therefore added by the MCP host/client after it reads the server's `tools/list` response.

### Host-specific naming behavior

Claude Code explicitly documents `mcp__<server-name>__<tool-name>`. Its Agent SDK docs show `allowedTools: ["mcp__claude-code-docs__*"]` for a configured server (`https://code.claude.com/docs/en/agent-sdk/mcp`, lines 128-139), then state the tool naming convention directly at lines 200-202. So for Claude Code, the origin of `mcp__mk_spec_memory__memory_context` is the Claude Code host, using the server key `spec_kit_memory` from `.claude/mcp.json`.

OpenCode registers MCP servers under `mcp` in `opencode.json`. This repo registers `spec_kit_memory` as a local server with command `node .opencode/bin/spec-kit-memory-launcher.cjs` (`opencode.json:10-24`). OpenCode docs say each MCP gets a unique config name and can be referred to by that name in prompts, and its tool-management examples show server-name prefix patterns such as `my-mcp*` and `mymcpservername_*` rather than Claude's double-underscore `mcp__...` form. Source: `https://opencode.ai/docs/mcp-servers`, lines 111-140 and 570-582.

Codex registers MCP servers under `[mcp_servers.<server-name>]`. This repo's project config registers `[mcp_servers.spec_kit_memory]` with `node` and `.opencode/bin/spec-kit-memory-launcher.cjs` (`.codex/config.toml:5-13`). The user-level Codex config also has a `[mcp_servers.spec_kit_memory]` entry, but this iteration deliberately does not record secrets from that file. OpenAI's Codex docs confirm that Codex stores MCP configuration in `config.toml`, supports project-scoped `.codex/config.toml`, and configures each server through `[mcp_servers.<server-name>]` (`https://developers.openai.com/codex/mcp`, lines 622-653). The public Codex docs found in this pass do not state a Claude-style displayed tool-name format; they refer to `enabled_tools` and `disabled_tools` as raw tool allow/deny lists (`https://developers.openai.com/codex/mcp`, lines 672-678).

Gemini registers MCP servers under `mcpServers` in `settings.json`. This repo registers `spec_kit_memory` with `node .opencode/bin/spec-kit-memory-launcher.cjs`, `cwd: "."`, environment, and `trust: true` (`.gemini/settings.json:17-49`). Gemini CLI docs say discovery iterates configured `mcpServers` (`https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md`, lines 258-264), then assigns every MCP tool an FQN in the format `mcp_{serverName}_{toolName}` and warns not to use underscores in server names because the policy parser splits after `mcp_` (`same source`, lines 624-633). With our current server name, Gemini's documented FQN would be ambiguous for policy parsing: `mcp_spec_kit_memory_memory_context`.

### Runtime and registration matrix

| Runtime | Config file | How `spec_kit_memory` registered | Prefix in displayed tool names | Tool-name regex constraint |
|---------|-------------|----------------------------------|-------------------------------|----------------------------|
| Claude Code | `.claude/mcp.json` | Key under `mcpServers`; command `node`, args `.opencode/bin/spec-kit-memory-launcher.cjs` (`.claude/mcp.json:1-15`) | `mcp__<server>__<tool>` per Claude host docs; example becomes `mcp__mk_spec_memory__memory_context` | MCP raw tool names should use letters/digits/underscore/hyphen/dot; Claude composed name adds host prefix. Existing memory feedback-style names with underscores are legal under MCP. |
| OpenCode | `opencode.json` | Key under `mcp`; local command array `["node", ".opencode/bin/spec-kit-memory-launcher.cjs"]` (`opencode.json:10-24`) | Not `mcp__...` in docs. OpenCode docs describe server-name prefixing and tool globs like `my-mcp*` / `mymcpservername_*`. Likely `<server>_<tool>` for tool management. | OpenCode docs do not state a separate regex in this pass; use MCP raw tool-name limits, plus avoid ambiguous rename choices until verified in OpenCode UI. |
| Codex | `.codex/config.toml` and optionally `~/.codex/config.toml` | Key under `[mcp_servers.spec_kit_memory]`; command `node`, args `.opencode/bin/spec-kit-memory-launcher.cjs` in project config (`.codex/config.toml:5-13`) | Public Codex docs found here do not state a composed display format. This runtime may expose MCP tools through internal namespaces rather than Claude-style names. Treat `mcp__...` as unconfirmed for Codex. | Codex docs expose `enabled_tools` / `disabled_tools` as tool filters, apparently raw server tool names; apply MCP raw name limits until Codex source/UI confirms composition. |
| Gemini | `.gemini/settings.json` | Key under `mcpServers`; command `node`, args `.opencode/bin/spec-kit-memory-launcher.cjs`, `cwd: "."`, `trust: true` (`.gemini/settings.json:17-49`) | `mcp_<server>_<tool>` per Gemini docs. With current name: `mcp_spec_kit_memory_memory_context`, but this is policy-ambiguous because server names with underscores are discouraged. | Gemini sanitizes names to letters, numbers, underscore, hyphen, dot, colon and truncates beyond 63 chars; it warns against underscores in MCP server names. |

### K2.1 verdict

The `mcp__` prefix is not an MCP protocol standard. It is a Claude Code host naming convention for presenting and permissioning tools from multiple MCP servers. The server-name segment comes from each runtime's MCP configuration key: `.claude/mcp.json` `mcpServers.spec_kit_memory`, `opencode.json` `mcp.spec_kit_memory`, `.codex/config.toml` `[mcp_servers.spec_kit_memory]`, and `.gemini/settings.json` `mcpServers.spec_kit_memory`.

Cross-runtime compatibility is not uniform. Claude uses `mcp__<server>__<tool>`, Gemini documents `mcp_<server>_<tool>`, OpenCode documents server-name-prefixed tool globs, and Codex's public docs confirm config and raw tool filtering but not a Claude-style displayed prefix. Any namespace-shortening plan must therefore optimize for multiple host renderings, not just `mcp__mk_spec_memory__*`.

## Questions Answered

- K1.6 answered: query intelligence is a non-port axis for CocoIndex.
- K2.1 answered: the visible MCP prefix is host-added, not server-defined and not fixed by the MCP protocol.
- Server-name origin answered: the segment comes from the runtime's configured MCP server key, not from `tool-schemas.ts`.

## Questions Remaining

- K2.2: evaluate rename mechanics and breakage risk for `spec_kit_memory -> mk_memory` or another server alias.
- K2.3: decide whether individual tools should drop the redundant `memory_*` prefix after server rename.
- K2.5: final go/no-go migration recommendation and staged compatibility plan.

## Next Focus

Recommend K2.2 next. K2.1 shows that server-name choice affects each runtime differently, and Gemini specifically penalizes underscores in server names. The next iteration should test candidate aliases against the actual config surfaces before deciding on `mk_memory`, `mk`, or a hyphenated alternative.
