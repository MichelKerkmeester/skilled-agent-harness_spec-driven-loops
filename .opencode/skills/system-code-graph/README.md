---
title: system-code-graph
description: Structural code intelligence for AI agents: tree-sitter AST graph, false-safe readiness contract and eight MCP tools that answer what code touches without lying on stale state.
trigger_phrases:
  - "code graph"
  - "blast radius"
  - "impact analysis"
  - "structural search"
  - "code_graph_query"
---

# system-code-graph

> The structural half of code intelligence. Answer what depends on what with a graph that refuses to lie when it goes stale.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Structural answers: callers, imports, blast radius and diff impact |
| **Invoke with** | "code graph", "blast radius", "impact analysis" or a code_graph_* tool name |
| **Works on** | A tree-sitter AST graph built from your workspace source files |
| **Produces** | Relationship answers gated by freshness, with a hard refuse on stale state |

---

## 2. OVERVIEW

### Why This Skill Exists

Semantic search tells you what code means. It cannot tell you what code touches, which is the question that matters before a refactor: which callers break, which imports lift, which symbols a diff moves. Worse, a structural index that has gone stale and answers anyway is dangerous. An agent acts on a blast-radius set that is missing the caller that breaks. system-code-graph builds the structural graph, answers the connected-code questions and gates every read behind a freshness check that returns an explicit blocked signal rather than a silently-incomplete answer.

### What It Does

system-code-graph parses your codebase into a SQLite-backed graph of files, symbols, calls and imports through tree-sitter. Eight MCP tools sit on top. `code_graph_scan` builds the index. `code_graph_query` answers relationship questions: outline, callers, importers and blast radius. `code_graph_context` assembles compact graph neighborhoods sized for an LLM window. `detect_changes` maps a unified diff to the exact symbols it touches. `code_graph_status` reports health and is always answerable.

Every read-path tool passes through a readiness gate first. A stale or scope-mismatched graph returns `status: "blocked"` with a `requiredAction`, never a silently-empty result. The false-safe guarantee is what makes the toolchain trustworthy during a refactor. system-code-graph is the structural half of code intelligence. It answers "what does this code touch" rather than "what does it mean," and it does not answer at all when the answer might be wrong.

---

## 3. QUICK START

**Step 1: Check graph health.**

```
mcp__mk_code_index__code_graph_status({})
```

Returns `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt` and graph-quality metadata. If `readiness` is anything other than `fresh`, the read tools block until you run a scan.

**Step 2: Build or refresh the graph.**

```
mcp__mk_code_index__code_graph_scan({ "incremental": true })
```

Walks the workspace, parses changed files through tree-sitter and persists file, symbol and edge rows in SQLite. Expected output reports file counts, node counts by kind, edge counts by type and the new readiness state. Use `"incremental": false` after changing the scan scope or environment flags.

**Step 3: Ask a relationship question.**

```
mcp__mk_code_index__code_graph_query({
  "operation": "blast_radius",
  "subject": ".opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts"
})
```

Returns the reverse import impact set: every file that imports the subject, transitively, with `sourceFiles`, `nodes`, `affectedFiles`, `depthGroups`, `riskLevel`, `minConfidence` and ambiguity fields. `affectedSymbols` belongs to `detect_changes`, not `blast_radius`.

**Step 4: Verify the runtime.**

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph
```

TypeScript exits 0. The focused Vitest code-graph suite passes.

**Prefer a shell?** The daemon-backed CLI has full parity with the MCP surface: the same 8 code-graph tools are callable through `node .opencode/bin/code-index.cjs`, over the same daemon the MCP registration uses:

```bash
node .opencode/bin/code-index.cjs list-tools --format text     # offline, no daemon contact
node .opencode/bin/code-index.cjs code_graph_status --format json
```

Use MCP as the primary in-session transport today. Use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm, and for hooks, cron, CI and operator shell diagnostics. Exit codes are `0` success, `1` runtime error, `64` usage/schema error, `69` protocol/dist mismatch, `75` retryable daemon error. The false-safe contract carries through: a `status: "blocked"` readiness refusal exits `0` deliberately — blocked is an actionable answer (run the surfaced `requiredAction`), not a CLI failure — while a malformed diff to `detect_changes` (`status: "parse_error"`) exits `64`. Pass `--warm-only` in prompt-time contexts so a cold daemon yields exit `75` instead of a cold spawn. Because the CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan.

---

## 4. HOW IT WORKS

### The Structural Index

A tree-sitter parser walks your workspace and converts each source file into a graph node. Symbols, calls, imports and definitions become typed edges in a SQLite database. The indexer skips unchanged files by content hash, so incremental scans stay fast. Parser crash cohorts classified as B1/B2 land in a quarantine skip-list, surfaced through `code_graph_status` output under `parserHealth` and `parserSkipList`. Syntax-error partial parses surface parse diagnostics without adding a skip-list row. They do not poison the graph but they do reduce coverage.

The default scan globs include JSON, JSONC, YAML, YML and TOML as the `doc` lane, but deliberately omit Markdown/prose docs. The doc lane is file-row coverage only today: config-format files are recorded with content hashes and clean parse health, while symbol nodes and relationship edges stay empty (`node_count: 0`, `edge_count: 0`). Re-add Markdown only with explicit `includeGlobs`, and treat doc-lane file counts as inventory coverage, not structural extraction.

This structural model is what lets the tools answer "what calls this" with precision. The relationship is a first-class graph edge, not a text-match guess. A function call from file A to file B is an edge you can query, traverse transitively and surface in an impact report.

### Readiness and the False-Safe Contract

Every read-path tool calls the readiness gate before it answers. The gate checks whether the graph exists, whether its content hashes still match the workspace, whether the scan scope has changed since the last run and whether the gold-query battery has verified the index recently. If any check fails, the tool returns `status: "blocked"` with a `requiredAction` that tells you exactly what to do next.

The four freshness values are `fresh`, `stale`, `empty` and `error`. `blocked` is not a freshness value. It is the refusal payload the tool returns when freshness is not `fresh`. `absent` is a trust-state projection of an `empty` graph, not a freshness value either. The false-safe guarantee is the defining property: a non-fresh read returns a blocked payload rather than an empty answer, every time. It is a hard refuse, not a soft degrade. You never get a silently-empty array from a stale graph, so you never act on partial structural state.

A separate trust-state signal tracks whether the gold-query battery passed recently. A graph can be `fresh` while `goldVerificationTrust` is `absent` if nobody has run `code_graph_verify` since the last structural change. High-stakes queries should check both before acting on results.

A scope fingerprint, a hash of the scan include and exclude globs plus feature flags, is compared on every read. `code_graph_status.data.activeScope` exposes both the human label and structured `includeGlobs` / `excludeGlobs` arrays. When globs narrow the scan, the label says `narrowed by includeGlobs: ...` and/or `excludeGlobs: ...` so a `*.ts`-only scan does not look like full-workspace coverage. A mismatch blocks the read and recommends a full rescan. Widening the scope allows an incremental rebuild. Narrowing it needs a full scan.

### Blast Radius and Change Detection

The `blast_radius` operation on `code_graph_query` computes the reverse impact set for a file or symbol. It follows import edges transitively and returns every caller that would break if the subject changed. Pass a file path or symbol name as the `subject`. Pass `unionMode: "multi"` with an array of `subjects` to see the combined impact of touching several files at once.

`detect_changes` takes a unified diff and maps it to the exact affected symbols and files through line-range overlap against the indexed code nodes. It refuses to answer when the graph is not fresh, returning `status: "blocked"` instead of an empty `affectedSymbols[]`. This means you can run impact analysis against incoming patches without worrying about a stale graph hiding a breaking change.

### Neighborhood Retrieval

`code_graph_context` builds a token-budgeted graph snapshot around a seed symbol or file. Three modes: `neighborhood` (one-hop calls and imports), `outline` (file-level symbols with line ranges) and `impact` (reverse callers). Pass seeds from manual input (a file path and line range) or from prior graph lookups (a symbol ID). The token budget clamps the response size so the snapshot fits an LLM window without losing the structural edges that matter. Use this when semantic search finds candidate files and you need the structural context around them before deciding what to change.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for system-code-graph when the question is structural. Four scenarios cover most uses:

1. Before a refactor that touches a shared utility, run `code_graph_query` with `operation: "blast_radius"` to see every caller.
2. After receiving a patch from a remote agent, run `detect_changes` with the unified diff to map the exact affected symbols.
3. When investigating an incident that crosses file boundaries, pull a compact graph neighborhood with `code_graph_context` around the seed file.
4. Before trusting a structural answer, check `code_graph_status` for `readiness` and `trustState`.

The boundary with text search is simple. Use Grep when you know the exact token or path to match. Use system-code-graph when you need relationships, freshness or impact analysis. Use memory_search when you need spec docs and saved decisions, not source-code structure. The code graph boots independently of mk-spec-memory and answers only structural questions.

### Related Skills

| Skill | Relationship |
|---|---|
| Grep (built-in) | Text search for exact tokens and paths. Fast for known symbols. system-code-graph answers the relationship questions Grep cannot reach. |
| `mk-spec-memory` | Owns spec-doc search, memory continuity and context retrieval. system-code-graph boots independently and indexes source code structure only. |
| `system-spec-kit` | Owns spec folders, memory saves and session continuity. system-code-graph provides the structural index and tools that spec-kit workflows call during impact preflight. |
| `system-skill-advisor` | Routes prompts to matching skills. system-code-graph provides `code_graph_classify_query_intent` to decide whether a query is structural or semantic. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `status: "blocked"` with `requiredAction: "code_graph_scan"` | The graph is stale, empty or scope-mismatched | Run `code_graph_scan` with the intended scope. Use `incremental: false` for scope changes |
| A tool returns `blocked` after you changed scan flags | The stored scope fingerprint differs from the current scan inputs | Run a full scan (`incremental: false`) so the fingerprint updates. Widening the scope allows an incremental rebuild, narrowing needs a fresh scan |
| `parserHealth` shows quarantined files | One or more parser crash cohorts landed in the skip-list | Inspect `parserSkipList.sample` from `code_graph_status`. Repair the file or accept the quarantine for this scan run |
| Skill files do not appear in scan results | `.opencode/skills/**` is excluded by default | Set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass the `includeSkills` array on the scan call |
| `code_graph_query` returns fewer results than expected | Some files are not indexed due to parse failures or scope exclusions | Check `parserHealth` and `nodesByKind` in `code_graph_status` output |
| `code-index.cjs` exits 69 | The CLI dist entrypoint is missing or stale relative to its sources | Run `tsc -p .opencode/skills/system-code-graph/tsconfig.json` (dev loops can set `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`) |
| `code-index.cjs` exits 75 under `--warm-only` | The daemon is cold and warm-only forbids a cold spawn | Expected at prompt time; retry without `--warm-only` to auto-spawn via the launcher |
| Plugin bridge reports skipped or fail-open status | The bridge runs prompt-time warm-only and does not cold-spawn missing daemons or sockets | It routes through `.opencode/bin/code-index.cjs` and the launcher IPC bridge; see `mcp_server/plugin_bridges/README.md` |
| An old doc references `system_code_graph` (underscore form) | A pre-rename reference survived the standalone server rename | Use `mk-code-index`, `mk_code_index` and `mcp__mk_code_index__*` for current runtime docs |

---

## 7. FAQ

**Q: Why does the readiness gate refuse to answer instead of returning an empty list?**

A: An empty answer from a stale index trains an agent to act on false information. The hard refuse is intentional. A `blocked` payload with a `requiredAction` preserves the contract: no read-path tool returns a silently-empty result, ever. During a refactor, that guarantee is what stops you from landing a change that breaks a caller the stale index missed.

**Q: When do I use the code graph instead of Grep?**

A: Use Grep when you know the exact text or path to match. Use the code graph when you need to know what calls a function, what imports a file, what symbols a diff touches or how far a change reaches transitively. Grep cannot answer relationship questions. The code graph cannot match arbitrary text.

**Q: Can I run the MCP server without mk-spec-memory installed?**

A: Yes. The standalone MCP server boots independently. The code graph has no runtime dependency on mk-spec-memory. The code-graph production source keeps local contracts under `mcp_server/lib/shared/` and the TypeScript build emits only this package's runtime under `mcp_server/dist/`.

**Q: Why are the skill folder and the MCP server named differently?**

A: The skill folder (`system-code-graph`) owns documentation and source layout. The MCP server (`mk-code-index`) keeps a stable identity across rename packets so external callers do not break. Both names are intentional. File paths use the skill slug. MCP-facing identifiers use the server name. Renaming either would invalidate every runtime config.

**Q: What is the difference between readiness and trust state?**

A: Readiness answers whether the graph reflects the current workspace. The four values are `fresh`, `stale`, `empty` and `error`. Trust state answers whether the graph passed its gold-query battery recently. A graph can be `fresh` while `goldVerificationTrust` is `absent` if nobody has verified it since the last structural change. High-stakes queries should check both.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| TypeScript compiles clean | `.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json` exits 0 |
| Vitest code-graph suite | `.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph` passes all tests |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-code-graph/README.md --type readme` reports zero issues |
| Gold-query battery | `mcp__mk_code_index__code_graph_verify({})` returns `passed` status on a fresh graph |
| CLI front door | `node .opencode/bin/code-index.cjs list-tools --format text` prints the eight tool names offline and exits 0 |
| Skill graph integrity | `mcp__mk_skill_advisor__skill_graph_scan({})` and `mcp__mk_skill_advisor__skill_graph_validate({})` report no errors |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, smart routing and invariants for agents |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Package topology, dependency direction and subsystem boundaries |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Native bootstrap, per-runtime config and verification |
| [`references/runtime/tool_surface.md`](./references/runtime/tool_surface.md) | Per-tool contracts for all eight MCP tools |
| [`references/readiness/readiness_and_scope_fingerprint.md`](./references/readiness/readiness_and_scope_fingerprint.md) | Readiness state machine, trust state and scope-fingerprint contract |
| [`references/readiness/code_graph_readiness_check.md`](./references/readiness/code_graph_readiness_check.md) | Readiness contract primer |
| [`references/runtime/naming_conventions.md`](./references/runtime/naming_conventions.md) | Name map across skill folder, MCP server, launcher and hook locations |
| [`references/runtime/ownership_boundary.md`](./references/runtime/ownership_boundary.md) | Boundary between system-code-graph and system-spec-kit |
| [`references/config/database_path_policy.md`](./references/config/database_path_policy.md) | Database path and override rules |
| [`references/runtime/launcher_lease.md`](./references/runtime/launcher_lease.md) | Launcher PID-file lease and single-writer behavior |
| [`mcp_server/tool-schemas.ts`](./mcp_server/tool-schemas.ts) | Source of truth for the eight MCP tool schemas |
| [`mcp_server/handlers/README.md`](./mcp_server/handlers/README.md) | Handler-layer package topology |
| [`mcp_server/lib/README.md`](./mcp_server/lib/README.md) | Core graph implementation topology |
