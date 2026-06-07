Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/021-system-code-graph-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/system-code-graph/`. Read its `SKILL.md` in full, its current `README.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md` and the files under `references/` (config, readiness, runtime). Stay within that skill directory. This skill ships the structural half of code intelligence: a tree-sitter parser, a SQLite-backed graph, a readiness and trust contract, and the mk-code-index MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_classify_query_intent`, `detect_changes`). Note the boundary with Grep (text and concept search) and memory_search (spec docs) only to describe it.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why semantic search finds similar code but not connected code, why blast radius matters before a refactor, and why a stale graph that answers silently is dangerous.
3. MODES & CAPABILITIES — structural AST indexing, blast-radius impact, the readiness and trust state, the false-safe blocked payload, change detection and token-budgeted neighborhood retrieval, each one line.
4. INVOCATION — the MCP tools (`code_graph_scan`, `code_graph_query` with operations like blast_radius, `code_graph_context`, `code_graph_status`, `detect_changes`, `code_graph_classify_query_intent`) and the three documented use cases (refactor preflight, patch change-detection, incident neighborhood). Note the readiness gate.
5. KEY FILES — a table of the real files and subfolders (path + one-line purpose): SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, `references/config/`, `references/readiness/`, `references/runtime/`, `mcp_server/`.
6. BOUNDARIES — what it does NOT do: text-only exact search (Grep), semantic concept search without structure (Grep plus iteration; this skill indexes structure not embeddings), and spec-doc search (memory_search).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (stale graph, readiness blocked, scope fingerprint), and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, tool list). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
