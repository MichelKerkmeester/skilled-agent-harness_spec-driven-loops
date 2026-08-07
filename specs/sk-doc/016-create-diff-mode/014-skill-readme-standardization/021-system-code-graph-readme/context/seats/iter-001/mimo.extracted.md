1. PURPOSE

Structural AST indexing of source code into a SQLite graph, exposed through the standalone `mk-code-index` MCP server, so agents can query callers, imports, blast radius, and affected symbols with a readiness contract that refuses to answer when the graph is stale.

2. PROBLEM

Semantic search and text grep both answer "what does this code mean" or "where does this string appear," but neither can tell you what is structurally connected — which callers break when you rename a function, which imports lift when you move a module, or which files a diff actually touches across the dependency graph. Blast-radius preflight before a refactor requires knowing the exact reverse impact set, not fuzzy similarity. Worse, both grep and semantic search always return an answer even when their index is stale, silently producing plausible-but-wrong results that lead agents to act on false structural assumptions. A stale graph that answers silently is more dangerous than no graph at all.

3. MODES & CAPABILITIES

- **Structural AST indexing** — tree-sitter parses source files into a SQLite graph of files, symbols, calls, imports, and definitions (`mcp_server/lib/structural-indexer.ts`).
- **Blast-radius impact analysis** — reverse import traversal answers "what depends on this" transitively (`code_graph_query` with `operation: blast_radius`).
- **Readiness and trust state machine** — four freshness values (`fresh`/`stale`/`empty`/`error`) plus a companion trust-state projection (`live`/`stale`/`absent`/`unavailable`); read paths gate on freshness before answering (`references/readiness/readiness_and_scope_fingerprint.md`).
- **False-safe blocked payload** — non-fresh graphs return `status: "blocked"` with an explicit `requiredAction` instead of silently-empty arrays (`references/readiness/code_graph_readiness_check.md`).
- **Change detection from diffs** — maps a unified diff to affected symbols via line-range overlap against the indexed graph (`detect_changes`).
- **Token-budgeted neighborhood retrieval** — builds compact LLM-ready graph neighborhoods around seed files or symbols, constrained by a configurable token budget (`code_graph_context`).
- **Gold-query verification** — runs a persisted battery of structural queries to validate graph quality, with baseline persistence and category filtering (`code_graph_verify`).
- **Verification-gated recovery** — apply-mode operations (rescan, prune, repair, corruption recovery, rollback) run the gold battery before and after each mutation (`code_graph_apply`).

4. INVOCATION

**MCP tools** (all under `mcp__mk_code_index__*` namespace):

| Tool | Purpose |
|---|---|
| `code_graph_scan` | Build or refresh the structural graph (incremental by default) |
| `code_graph_query` | Structural relationships: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius` |
| `code_graph_classify_query_intent` | Classify natural-language query as structural/semantic/hybrid |
| `code_graph_context` | Compact graph neighborhoods around seeds (modes: `neighborhood`, `outline`, `impact`) |
| `code_graph_status` | Graph health, readiness, trust state, parse health |
| `code_graph_verify` | Gold-query verification battery |
| `code_graph_apply` | Verification-gated recovery operations |
| `detect_changes` | Map unified diff to affected symbols |

**Readiness gate:** `code_graph_query`, `code_graph_context`, `code_graph_verify`, and `detect_changes` all call `ensureCodeGraphReady()` before answering. If `readiness !== "fresh"`, they return `blocked` with `requiredAction: "code_graph_scan"`. Always check `code_graph_status` first; run `code_graph_scan` if not fresh.

**Three documented use cases** (from `SKILL.md` §Situational triggers):
1. **Refactor preflight** — `code_graph_query({ operation: blast_radius, subject })` before touching a critical utility.
2. **Patch change detection** — `detect_changes({ diff })` after receiving a code-review diff from a non-local agent.
3. **Incident neighborhood** — `code_graph_context` with seed files for a compact structural snapshot around affected code.

5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime routing instructions, invariants, smart router pseudocode, glossary |
| `README.md` | Human-facing overview, quick start, features, structure, configuration, FAQ |
| `ARCHITECTURE.md` | System architecture, package topology, subsystem design, ADRs |
| `INSTALL_GUIDE.md` | Bootstrap, per-runtime configuration, verification, database/maintainer mode |
| `references/config/database_path_policy.md` | Canonical SQLite path policy, override rules, migration history |
| `references/readiness/code_graph_readiness_check.md` | `ensureCodeGraphReady()` preconditions, gates, failure modes, recovery |
| `references/readiness/readiness_and_scope_fingerprint.md` | Readiness state machine, trust state, scope-fingerprint contract |
| `references/runtime/tool_surface.md` | All 8 MCP tools mapped to handler, purpose, preconditions, token budget |
| `references/runtime/naming_conventions.md` | Name map: skill slug vs MCP server name vs config key vs launcher |
| `references/runtime/ownership_boundary.md` | Why deep-loop/coverage-graph stayed in `system-spec-kit` |
| `references/runtime/launcher_lease.md` | PID-file single-writer lease contract |
| `mcp_server/` | MCP server runtime: entrypoint (`index.ts`), tool schemas (`tool-schemas.ts`), handlers, lib, tools, tests, database |
| `feature_catalog/` | Current runtime feature inventory (14 features, 7 groups) |
| `manual_testing_playbook/` | Operator validation scenarios (22 scenarios, 9 groups) |

6. BOUNDARIES

- **Text-only exact search** — use Grep. This skill does not search file contents by string pattern.
- **Semantic concept search without structure** — use Grep for domain terms and iterate. This skill indexes structure (callers, imports, symbols) via tree-sitter, not embeddings or vector similarity.
- **Spec-doc search** — use `memory_search`. This skill does not index or search spec folders, memory records, or markdown documentation.
- **Filename/path globbing** — use Glob.
- **Deep-loop coverage graph** — owned by `system-spec-kit`, not this skill. The coverage-graph tools (`deep_loop_graph_*`) were removed from `mk-code-index` in arc 118 and now live as script entry points under `.opencode/skills/deep-loop-runtime/scripts/`.
- **SessionStart hooks** — live under `system-spec-kit/mcp_server/hooks/`, not in this skill (110+ file references, ADR-001).

7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**

| Symptom | Cause | Fix |
|---|---|---|
| `status: "blocked"` with `requiredAction: "code_graph_scan"` | Graph is stale, missing, or scope-mismatched | Run `code_graph_scan`. Use `incremental: false` for scope changes. |
| `parserHealth: "quarantined"` | Files failed parsing and landed in skip-list | Inspect `parserSkipList.sample` from `code_graph_status`, repair or accept |
| Skill files not in scan results | `.opencode/skills/**` excluded by default | Set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass `sk-*` list per-call |
| Scope fingerprint mismatch | Scan inputs (include globs, env flags) changed since last scan | Run `code_graph_scan` with new scope; `incremental: false` for narrowing; `forceScopeChange: true` for forced replacement |
| Standalone-storage guard violation | `SPECKIT_CODE_GRAPH_DB_DIR` resolves outside workspace | Use a path inside the repo, or unset |
| `LEASE_HELD_BY:<pid>` | Another launcher instance holds the PID-file lease | Wait for it to exit, or set `MK_CODE_INDEX_STRICT_SINGLE_WRITER=0` for testing |
| Plugin bridge fails with missing `dist/handlers/session-resume.js` | Bridge imports point at modules moved to `system-spec-kit` post-extraction | See `mcp_server/plugin_bridges/README.md` §1 |

**FAQ (2–4 questions users actually ask):**

1. **Why is the folder `system-code-graph` but the MCP server `mk-code-index`?** — The skill slug describes what the skill is for; the MCP server name is the stable runtime contract (ADR-002). Renaming would break every config and saved tool-call ID.
2. **Does this replace grep?** — No. Use grep for exact text. Use code-graph tools when relationships, symbols, freshness, or impact matter.
3. **Why does the readiness contract refuse on stale state?** — Returning empty arrays from a stale index trains agents on false information. A `blocked` payload with `requiredAction` is more useful than a plausible-but-wrong answer.
4. **Can I run this without `mk-spec-memory`?** — Yes. The standalone MCP server boots independently with no dependency on the memory server.

8. STALE FACTS

- **Version discrepancy between `SKILL.md`/`INSTALL_GUIDE.md` and `package.json`:** `SKILL.md` frontmatter and `INSTALL_GUIDE.md` §1 table both state version `1.0.3.2`. `package.json` states `"version": "1.0.0"`. These may be intentionally separate (skill version vs npm package version), but the difference is worth flagging for the rewrite.
- **README.md §3.5 "INDEX LIFECYCLE" duplicates §3.1 "Structural Index":** both tables list `code_graph_status` and `code_graph_scan` with overlapping purpose descriptions. The `code_graph_verify` row appears in both §3.2 and §3.5. This is structural redundancy, not a factual error.
- **README.md §4 "STRUCTURE" lists `feature_catalog/` as "14 entries, 7 groups":** verified correct per `feature_catalog.md`. Lists `manual_testing_playbook/` as "22 scenarios, 9 groups": verified correct per `manual_testing_playbook.md`. No stale counts found.
- **README.md tool count ("8 MCP tools"):** verified correct. The 8 tools are consistently documented across `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `references/runtime/tool_surface.md`, and `ARCHITECTURE.md`.
- **No other factual inaccuracies found** between the current `README.md` and the source-of-truth files (`SKILL.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md`, references).