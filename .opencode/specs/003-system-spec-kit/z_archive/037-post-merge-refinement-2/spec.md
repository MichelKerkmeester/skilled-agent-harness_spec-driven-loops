# Post-Merge Refinement Phase 2 (Library Unification)

## Context
We have a "Split-Brain" issue with two versions of `vector-index.js`:
1. v11 in `scripts/lib/` (used by CLI tools)
2. v12 in `mcp_server/lib/` (used by the MCP server)

## Goals
1. Unify into a single library in `mcp_server/lib/`.
2. Port "Smart Ranking" and "Content Extraction" from v11 to v12.
3. Fix `process.cwd()` fragility by using `__dirname`.
4. Delete the redundant v11 library.
