# CONTEXT
READ-ONLY codebase-context analyzer, deep-context loop iteration 3. Iters 1–2 mapped the 026 program
NARRATIVE and DECISIONS from the spec docs. THIS iteration maps the **live CODE** the program
produced/touched — concrete files, exported symbols, and seams a planner would reuse or integrate with.
Switch from doc-level to CODE-level: real `file:line`, real function/class/tool names and signatures.

# OBJECTIVE — code band part 1 (code-graph MCP + memory + embedders)
Use Glob to enumerate, then Read the entry/key files and Grep for exported symbols in:

1. **code-graph MCP** — `.opencode/skills/system-code-graph/mcp_server/`
   (`index.ts`, `tools/index.ts`, `tools/code-graph-tools.ts`, `tool-schemas.ts`, `core/config.ts`).
   Capture the MCP tool handlers (code_graph_query/context/scan/status/etc.), the IPC/bridge entry,
   and config surface.
2. **memory continuity runtime** — `.opencode/skills/system-spec-kit/mcp_server/lib/memory/`
   (continuity, indexer, quality gates, save path). Capture the key exported functions/classes.
3. **embedder runtime** — `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/` and
   `.opencode/skills/system-spec-kit/shared/embeddings.ts` (local-first `resolveProvider`/cascade per
   ADR-014). Capture the provider-resolution + dispose surface.

For each: identify reuse candidates (exported symbols worth reusing, with signature), integration
points (MCP tool entry/exit, IPC bridge, the seam to the memory DB / coverage-graph), conventions
(error handling, logging, single-writer-lease discipline, config patterns), and dependencies
(imports across subsystems — e.g. code-graph ↔ shared, memory ↔ embedders).

# STYLE
CODE-level and concrete. Every finding cites `evidence` as `file:line` and, where it's a symbol,
fill `symbol` with the real exported name and `signature` with its shape. No doc-narrative restatement.

# TONE
Precise, analytical, neutral.

# AUDIENCE
A `/speckit:plan` / `/speckit:implement` author who needs the verified reuse map: what code already
exists so they extend/compose/import it instead of writing new code.

# RESPONSE FORMAT
Return ONLY one JSON object, no prose/fences. Schema:
{ "findings": [ { "path": "<repo-relative code file>", "symbol": "<exported name>",
  "kind": "reuse_candidate | integration_point | convention | dependency | gap",
  "signature": "<fn/class signature or shape>", "reuse": "extend|compose|wrap|import",
  "evidence": "<file:line>", "relevance": 0.0, "notes": "<how a planner reuses/integrates it>" } ] }
Rules: kind ∈ the 5 values; every finding has a real code `path` + numeric relevance ∈ [0,1];
prefer `reuse_candidate`/`integration_point`/`dependency` this pass; omit unit_id; 15–30 findings.
If a target file does not exist or moved, emit a `gap` finding noting the stale path. Do not pad.
