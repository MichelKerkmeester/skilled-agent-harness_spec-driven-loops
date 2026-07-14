Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/021-system-code-graph-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/system-code-graph/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/system-code-graph/SKILL.md` in full, its current `README.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md`, the `references/` files and `mcp_server/tool-schemas.ts` (for the live tool list). Verify against real file contents, not memory. This skill is the structural code-intelligence engine (AST indexing, SQLite graph, readiness contract, MCP tools).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT TOOLS & INVOCATION — the precise MCP tool names and their key operations/inputs (`code_graph_scan`, `code_graph_query` with its operations, `code_graph_context`, `code_graph_status`, `detect_changes`, `code_graph_classify_query_intent`), quoted from the schemas or SKILL.md. Note the readiness gate (`ensureCodeGraphReady`) and the false-safe blocked payload.
2. CAPABILITY ROSTER — structural indexing (what node and edge types), blast-radius/impact, readiness states and trust state, the false-safe guarantee, change detection and neighborhood retrieval, copied with citations.
3. KEY FILES — a table of the real files and subfolders (path + one-line role): SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, each `references/` subfolder, `mcp_server/` (note tool-schemas.ts), scripts.
4. WORKFLOWS & OUTPUTS — the documented workflows (refactor preflight, patch change-detection, incident neighborhood) and what each tool returns, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (graph not ready / blocked, stale index, scope fingerprint mismatch, scan failures) and the 3 to 5 questions a user most likely asks, with short grounded answers (including the structural-versus-semantic boundary).
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md`, `ARCHITECTURE.md` or the real files (counts, paths, version, tool list, node/edge types). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
