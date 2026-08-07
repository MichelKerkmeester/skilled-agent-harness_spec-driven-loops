# Context Report: system-code-graph README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the eight MCP tools, the structural model, the readiness contract and the false-safe guarantee. DeepSeek's verification found no stale facts in the current README, so this is a voice rewrite that preserves accurate facts, not a correction.

---

## 1. PURPOSE

`system-code-graph` is the structural half of code intelligence. It parses the codebase into a SQLite-backed graph of files, symbols, calls and imports, then answers structural questions (what calls this, what a diff touches, what breaks if I change this) through the mk-code-index MCP tools, behind a readiness contract that refuses stale answers.

## 2. PROBLEM

Semantic search tells you what code means, so it finds vaguely similar functions. It cannot tell you what code touches, which is the question that matters before a refactor: which callers break, which imports lift, which symbols a diff actually moves. Worse, a structural index that has gone stale and answers anyway is dangerous, because an agent acts on a blast-radius set that is missing the caller that breaks. This skill builds the structural graph, answers the connected-code questions, and gates every read behind a freshness check that returns an explicit blocked signal rather than a silently-incomplete answer.

## 3. MODES & CAPABILITIES

- Structural indexing: a tree-sitter parser builds a SQLite graph of files, symbols, calls, imports and definitions, distinct from text matching and embeddings.
- Blast radius: the reverse impact set of a symbol or file, with multi-hop traversal, so you see every caller before an edit lands.
- Change detection: a unified diff maps to the exact affected symbols and files by line-range overlap.
- Neighborhood retrieval: a token-budgeted graph snapshot around a seed that fits an LLM window without losing the structural edges.
- The readiness and trust contract: freshness states plus a verification-trust signal, with a false-safe guarantee that a non-fresh read returns a blocked payload rather than an empty answer.

## 4. THE TOOLS (verified, 8 via mk-code-index)

The MCP server is `mk-code-index` and the tools namespace as `mcp__mk_code_index__*`. Schemas live in `mcp_server/tool-schemas.ts`. The eight tools:

| Tool | What it does |
|------|--------------|
| `code_graph_scan` | Build or incrementally refresh the index for a scope |
| `code_graph_query` | Structural queries: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius` |
| `code_graph_context` | A token-budgeted neighborhood snapshot (`neighborhood`, `outline` or `impact` mode) |
| `code_graph_status` | Read-only health: counts, freshness, readiness, trust state (always answerable) |
| `code_graph_classify_query_intent` | Classify a query as structural, semantic or hybrid |
| `code_graph_verify` | Run the gold-query battery against the graph |
| `code_graph_apply` | Verification-gated recovery (rescan, prune, repair, recover, rollback) |
| `detect_changes` | Map a unified diff to the affected symbols and files |

Read-path tools (`code_graph_query`, `code_graph_context`, `code_graph_verify`, `detect_changes`) pass through `ensureCodeGraphReady()` first; on a non-fresh graph they return `status: "blocked"` with a `requiredAction` rather than an empty result.

## 5. READINESS & THE FALSE-SAFE CONTRACT (verified)

Freshness has four values: `fresh`, `stale`, `empty` and `error`. `blocked` is not a freshness value, it is the refusal payload a read tool returns when the graph is not fresh. A separate trust-state projection (`live`, `stale`, `absent`, `unavailable`) and a gold-verification-trust axis track whether the graph passed its query battery recently. A scope fingerprint (a hash of the scan's include and exclude globs and flags) is compared on every read, and a mismatch blocks the read. The false-safe guarantee is the skill's defining property: it is a hard refuse, not a soft degrade, so an agent never acts on partial structural state.

## 6. INVOCATION & WORKFLOWS (verified)

Three documented workflows:
- Refactor preflight: `code_graph_query` with `operation: "blast_radius"` and the symbol, before edits land, to see every caller.
- Patch change-detection: `detect_changes` with the unified diff, to get the precise affected symbols and files.
- Incident neighborhood: a semantic search for candidate files, then `code_graph_context` with those seeds for a token-budgeted snapshot.

The index lifecycle is `code_graph_status` to check freshness, `code_graph_scan` (incremental or full) to build or refresh, then the query and context tools, with `code_graph_verify` for the gold-query battery.

## 7. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | The runtime routing, the invariants, the tool dispatch contract |
| `ARCHITECTURE.md` | The package topology, the dependency direction and the ADRs |
| `INSTALL_GUIDE.md` | The native bootstrap, per-runtime config and verification |
| `references/runtime/` | The tool surface, naming conventions, ownership boundary and launcher lease |
| `references/readiness/` | The `ensureCodeGraphReady` contract, the readiness state machine and the scope fingerprint |
| `references/config/` | The database path policy |
| `mcp_server/tool-schemas.ts` | The source of truth for the eight tool schemas |
| `mcp_server/` | The standalone MCP server: handlers, the graph lib, the tree-sitter parser and the SQLite database |

## 8. BOUNDARIES

system-code-graph answers structural questions. It is not text search (use Grep for an exact token or path), not semantic concept search (use Grep with domain terms and iterate, since this skill indexes structure, not embeddings) and not spec-doc search (use memory_search). When the graph is unavailable, the skill reports and stops rather than falling back to text search. The skill boots independently and has no runtime dependency on mk-spec-memory. The skill folder, the MCP server and the config key carry different names by design (per an ADR), so renaming would invalidate every runtime config.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- A tool returns `status: "blocked"` with `requiredAction: "code_graph_scan"`: the graph is stale, empty or scope-mismatched. Run a scan with the intended scope.
- Stale index: a soft-stale graph self-heals with an incremental rescan; a hard-stale one needs a full rescan.
- Scope fingerprint mismatch: the stored fingerprint differs from the current scan inputs. Widening allows incremental, narrowing needs a full scan.
- Parser quarantine: files that fail to parse land in a skip-list, surfaced in the status output.
- FAQ: why the tool refuses instead of returning empty, when to use the code graph versus Grep, why the skill folder and MCP server names differ, whether it runs without mk-spec-memory, and what readiness versus trust state mean.

## 10. STALE FACTS

DeepSeek's verification found none. The current README does not pin a version, and its tool count, feature counts, readiness state machine and false-safe description all check out against SKILL.md, ARCHITECTURE.md, the tool schemas and the references. The rewrite preserves these accurate facts and changes only the voice and structure. The one stable count worth keeping is the eight MCP tools; the rewrite avoids drift-prone counts (node-kind totals, feature-catalog totals) in favor of describing the families.

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the structural model and the tools; iteration 2 verified the eight tool schemas, the readiness state machine, the false-safe contract and the stale facts against the live schemas and references, each cited to a file and line. Both models produced identical tool schemas and DeepSeek's pass concluded no stale facts. Converged before the three-iteration ceiling.
