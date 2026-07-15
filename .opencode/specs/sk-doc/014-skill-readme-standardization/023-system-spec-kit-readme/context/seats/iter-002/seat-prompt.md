Spec folder: sk-doc/014-skill-readme-standardization/023-system-spec-kit-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/system-spec-kit/` skill so a depth-preserving README restyle cites them correctly. This pass locks precise, citable details and finds stale facts.

Context: Read `.opencode/skills/system-spec-kit/SKILL.md` in full, its current `README.md`, `ARCHITECTURE.md`, `mcp_server/ENV_REFERENCE.md`, and inspect `mcp_server/handlers/` and any tool-registration source for the live `mk-spec-memory` tool list. Verify against real file contents, not memory. This skill is the spec-folder workflow plus the `mk-spec-memory` context-preservation MCP server (hybrid search, decay, constitutional memory, continuity).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. VERSION & ENTRY POINTS — the SKILL.md `version` (expect 3.4.1.0), and the canonical entry commands and scripts the README cites (`/memory:save`, `/speckit:resume`, `scripts/spec/validate.sh`, `scripts/dist/memory/generate-context.js`). Confirm each path exists.
2. THE MCP TOOL SURFACE — inspect `mcp_server/handlers/` (and the tool registry if present). Report the tool families (memory save/search/context, index, graph, health, constitutional, etc.) and the approximate count. If you can find an authoritative registered-tool list, cite it and give the exact number; otherwise report the handler-file count and call the exact tool number UNKNOWN. Flag if the README pins a tool count that disagrees.
3. RETRIEVAL & MEMORY MODEL — the documented retrieval pipeline (BM25, vector, RRF fusion), the decay model (FSRS or other), importance tiers, constitutional memory tiers, and continuity or handover, each cited to SKILL.md, ARCHITECTURE.md or a reference file.
4. CONFIGURATION — the environment variables and config the README documents, cross-checked against `mcp_server/ENV_REFERENCE.md`. Note any README env var that no longer exists or any renamed variable.
5. DOCUMENTATION LEVELS & VALIDATION — the levels (1, 2, 3, 3+), their required files, the phase-parent rule, and the `validate.sh` strict contract, each cited.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with SKILL.md, ENV_REFERENCE.md or the real files (version, tool counts, env var names, paths, command names, level rules). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
