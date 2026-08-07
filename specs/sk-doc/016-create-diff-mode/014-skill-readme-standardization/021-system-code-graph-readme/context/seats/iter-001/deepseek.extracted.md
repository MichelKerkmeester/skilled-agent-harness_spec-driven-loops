## 1. PURPOSE

System Code Graph provides a structural code index — a tree-sitter AST parser backed by a SQLite graph exposed through a standalone MCP server — so agents can answer "what depends on this" from actual call/import/symbol edges instead of guessing from text similarity.

## 2. PROBLEM

An AI assistant can read individual files but cannot reason about call graphs, so when asked "who calls this function?" or "what breaks if I rename this interface?" it guesses from text similarity and gets it wrong on anything non-trivial. Semantic search finds similar code but not connected code: it surfaces conceptually related functions, not the exact set of callers that will break from a signature change. Without a readiness contract, a stale or empty graph could return silent empty arrays that train agents to act on false information — the false-safe blocked payload prevents that by explicitly refusing to answer when the index is not trustworthy.

## 3. MODES & CAPABILITIES

- **Structural AST indexing**: Tree-sitter + web-tree-sitter WASM grammars parse source files into a SQLite graph of files, symbols, calls, imports, and definitions.
- **Blast-radius impact analysis**: `code_graph_query` with `operation: "blast_radius"` returns the reverse impact set — every file that imports the subject, transitively, so callers are known before a refactor lands.
- **Readiness and trust state**: Four freshness states (`fresh`, `stale`, `empty`, `error`) plus derived trust projections (`live`, `stale`, `absent`, `unavailable`) gate every read-path tool; `code_graph_status` reports both as first-class fields.
- **False-safe blocked payload**: Read tools (`code_graph_query`, `code_graph_context`, `detect_changes`) refuse on non-fresh graph state by returning `status: "blocked"` with an explicit `requiredAction` rather than silently empty arrays.
- **Change detection**: `detect_changes` maps a unified diff to affected symbols and files via line-range overlap against indexed code nodes; refuses on non-fresh readiness.
- **Token-budgeted neighborhood retrieval**: `code_graph_context` assembles a compact LLM-friendly graph neighborhood around seeds (modes: `neighborhood`, `outline`, `impact`) with a configurable per-response token budget.

## 4. INVOCATION

All tools run under the `mcp__mk_code_index__*` MCP namespace from the `mk-code-index` standalone server (config key `mk_code_index`).

| Tool | Operations / Modes | Family |
|---|---|---|
| `code_graph_scan` | Incremental/full re-index with scope flags (`includeSkills`, `includeAgents`, etc.) | Maintenance |
| `code_graph_query` | `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`; multi-subject union via `blast_radius` | Read |
| `code_graph_context` | `neighborhood`, `outline`, `impact`; accepts manual seeds and graph seeds | Read |
| `code_graph_status` | Reports totals, freshness, trust state, last scan, schema version, parse health, quality summary | Maintenance |
| `code_graph_classify_query_intent` | Classifies natural-language queries as `structural`, `semantic`, or `hybrid` | Maintenance |
| `code_graph_verify` | Runs gold-query battery with category filter, fail-fast, and baseline persistence | Maintenance |
| `code_graph_apply` | Verification-gated recovery: `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply` | Maintenance |
| `detect_changes` | Maps unified diff → affected symbols via line-range overlap | Read |

**Three documented use cases** (from `.opencode/skills/system-code-graph/SKILL.md` §Situational triggers):

1. **Refactor preflight** — Run `code_graph_query` with `blast_radius` against the symbol to surface every caller before edits land.
2. **Patch change-detection** — Run `detect_changes` with a unified diff from a code-review patch to get the precise set of affected symbols and files.
3. **Incident neighborhood** — Pull a compact graph neighborhood with `code_graph_context` around a seed file to get a token-budgeted structural snapshot.

**Readiness gate**: `code_graph_query`, `code_graph_context`, `detect_changes`, and `code_graph_verify` require `readiness === "fresh"`; they return `blocked` with `requiredAction: "code_graph_scan"` otherwise. `code_graph_status` is always answerable.

## 5. KEY FILES

| Path (relative to `.opencode/skills/system-code-graph/`) | Purpose |
|---|---|
| `SKILL.md` | Runtime routing, tool dispatch contract, invariants, and resource-loading rules for agents |
| `ARCHITECTURE.md` | System design: dependency direction (`handlers → lib → parser/database`), subsystem boundaries, ADRs 1-5 |
| `INSTALL_GUIDE.md` | Native bootstrap, per-runtime config, database path policy, maintainer mode setup, verification |
| `README.md` | Human-facing overview, quick start, tool reference per family, troubleshooting, FAQ |
| `references/config/database_path_policy.md` | Canonical SQLite path (`.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`), override rules, three-phase migration history |
| `references/readiness/readiness_and_scope_fingerprint.md` | Readiness state machine (`fresh`/`stale`/`empty`/`error` freshness, `blocked` refusal, `absent` trust projection), scope fingerprint hash contract, typical flows |
| `references/readiness/code_graph_readiness_check.md` | `ensureCodeGraphReady()` implementation contract: six preconditions, five gates, six failure modes, three recovery procedures (CG-RP-001/002/003) |
| `references/runtime/tool_surface.md` | Per-tool contract: handler file, family, preconditions, token budget; 3 read-path + 5 maintenance tools |
| `references/runtime/naming_conventions.md` | Name map across five layers: skill slug `system-code-graph`, MCP server `mk-code-index`, config key `mk_code_index`, namespace `mcp__mk_code_index__*`, launcher `mk-code-index-launcher.cjs` |
| `references/runtime/ownership_boundary.md` | What stays in `system-spec-kit` (deep-loop, coverage-graph, hooks) vs what lives in `system-code-graph` (structural indexer, SQLite graph, readiness, MCP tools) |
| `references/runtime/launcher_lease.md` | PID-file single-writer lease contract for `.mk-code-index-launcher.json`, stale reclaim path |
| `mcp_server/` | Standalone MCP runtime: `index.ts` (entrypoint), `tool-schemas.ts` (canonical schema array), `handlers/`, `lib/` (parser, readiness, storage, query, context, apply-mode), `tools/` (dispatch), `database/`, `tests/`, `stress_test/`, `plugin_bridges/`, `core/` |

## 6. BOUNDARIES

System Code Graph does **NOT** do:

- **Text-only exact search**: Use Grep for literal string/pattern matching. Structural tools answer relationship questions, not text-occurrence questions.
- **Semantic concept search without structure**: This skill indexes structure (callers, imports, symbols, definitions) via tree-sitter AST, not embeddings. For concept discovery without known symbol names, use Grep for domain terms and iterate — then use code-graph tools on the files or symbols Grep surfaces.
- **Spec-doc search**: `memory_search` (from mk-spec-memory) indexes spec folders and saved memory context. Code graph indexes application/framework source code structure only.

Additionally, code-graph does **NOT** own: deep-loop research/review state machines, coverage-graph session-scoped storage, SessionStart hooks (all three stay in `system-spec-kit`), or skill routing (owned by `system-skill-advisor`).

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**

| Symptom | Cause | Resolution |
|---|---|---|
| `status: "blocked"` with `requiredAction: "code_graph_scan"` | Graph is stale, empty, or scope-mismatched | Run `code_graph_scan`; use `incremental: false` for scope changes |
| `parserHealth: "quarantined"` | One or more files failed tree-sitter parsing and were added to the skip-list | Inspect `parserSkipList.sample` from `code_graph_status`; repair the file or accept quarantine |
| Scope fingerprint mismatch on read | Stored scope (from prior scan) differs from current env/call scope | Run a new scan with the intended scope; if scope was narrowed, use `incremental: false` |
| Skill files don't appear in scan results | `.opencode/skills/**` excluded by default (`INDEX_SKILLS=false`) | Set `includeSkills: true` per-call or enable `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` |
| Launcher exits with "standalone-storage guard violation" | `SPECKIT_CODE_GRAPH_DB_DIR` overrides to a path outside the workspace | Use a path inside the repo or unset the override |
| `mk_code_index` unavailable | MCP server not running or not configured | Check runtime config has `mk_code_index` entry pointing at `.opencode/bin/mk-code-index-launcher.cjs`; structural queries do NOT fall back to text search |

**Gotchas:**
- **Stale graph**: A `code_graph_status` call returning `readiness: "stale"` means all read tools will block until a scan runs. The skill intentionally does not degrade to partial results.
- **Scope fingerprint**: Switching between maintainer mode (all `INDEX_*` true) and end-user mode (all false) thrashes the fingerprint, causing repeated blocked reads.
- **Plugin bridges**: The `mcp_server/plugin_bridges/` CLI bridge is noted as "currently non-functional, post-extraction" in `.opencode/skills/system-code-graph/README.md` §4; production MCP tool calls use the `mk-code-index` server directly.

**Questions a user actually asks:**

1. **"Why is the skill folder named `system-code-graph` but the MCP server is `mk-code-index`?"** — The skill folder slug describes what the skill is for; the MCP server name is a stable tool contract. Renaming the server would break every config across all runtimes and every saved tool call ID. The asymmetry is intentional per ADR-002 (see `references/runtime/naming_conventions.md`).
2. **"Does this replace grep?"** — No. Use `grep` for exact text matching. Use code-graph tools when relationships, symbols, freshness, or impact matter. The tools answer different questions than text search.
3. **"Why does the readiness contract refuse to answer on stale state?"** — Returning empty arrays from a stale index trains agents to act on false information. The hard refuse with an explicit `requiredAction` is more useful than a plausible-but-wrong response, especially during refactors.
4. **"Where should shared memory or session resume behavior live?"** — In `system-spec-kit`. Code-graph scopes itself to the structural index and its tools; lifecycle, continuity, and resume flows are owned upstream.

## 8. STALE FACTS

- **`package.json` version is `1.0.0` while `SKILL.md` and `INSTALL_GUIDE.md` report skill version `1.0.3.2`.** The npm package version and the skill version differ; `SKILL.md` frontmatter `version: 1.0.3.2` is the authoritative skill version. The `package.json` version has not been aligned.
- **README §4 structure tree lists `feature_catalog/` as "14 entries, 7 groups" and `manual_testing_playbook/` as "22 scenarios, 9 groups".** These exact counts cannot be verified from the files read — the nominal counts may be accurate but were not confirmed against the actual directory contents.
- **README §4 structure tree omits `changelog/`, `scripts/`, and `dist/` directories** that are present in the actual skill directory listing. `dist/` (build output under `mcp_server/dist/`) is deliberately omitted as a build artifact; the omission of `changelog/` and `scripts/` appears to be an incomplete tree.