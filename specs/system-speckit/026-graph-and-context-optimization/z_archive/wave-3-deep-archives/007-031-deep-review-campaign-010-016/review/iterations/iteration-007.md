# Iteration 7: D4 Maintainability — Test Coverage for Rename

## Focus
D4 Maintainability — Assess whether the rename from `system_code_graph` to `mk-code-index` has adequate test coverage, and whether the build and test infrastructure correctly references the new names.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P2 — Suggestion

- **F017**: The compiled dist files in `mcp_server/` contain source-map references to `../../../../../../system-code-graph/mcp_server/` paths (e.g., `index.js.map`, `index.d.ts.map`, `tool-schemas.js.map`). These are build artifacts with source-mapping URLs that reflect the directory name `system-code-graph`, not the MCP server name `mk-code-index`. This is expected TypeScript compilation behavior (source maps reference the actual filesystem path), but anyone inspecting the dist files for residual strings will see `system-code-graph` references. No functional impact since source maps are not loaded in production. — mcp_server/tools/index.js.map:1, mcp_server/tools/index.d.ts.map:1, mcp_server/tool-schemas.js.map:1

- **F003 (refined)**: SKILL.md line 116 references `system-code-graph/mcp_server/lib/*` as a direct import path (for in-process cross-skill integration). This is the actual filesystem path and is technically correct. However, combined with F002 (SKILL.md name field), it creates two naming surfaces (`system-code-graph` as skill/directory name and `mk-code-index` as MCP server name) that could confuse future contributors. The SKILL.md §4 Rules and §7 Integration Points already clarify this distinction, so the residual risk is low. — SKILL.md:116

## Assessment
- The server name `mk-code-index` is correctly and consistently used in: index.ts:9, tool-schemas.ts dispatch names, README.md, architecture.md, SKILL.md §2-5, and .claude/mcp.json
- The directory name `system-code-graph` remains the package/skill directory name, which is consistent across: launcher paths, build config, imports, and test references
- The `TOOL_DEFINITIONS` compatibility alias (tool-schemas.ts:233) exists for backward compatibility with moved tests — this is safe and documented inline
- TypeScript build commands in README.md (line 107-109) reference the correct paths

## Ruled Out
- Checked dist/*.js.map and dist/*.d.ts.map files: `system-code-graph` references are all in `sourceRoot` or `sources` fields pointing to actual filesystem paths — expected behavior, not residual naming bugs
- No `system_code_graph` (underscore, old MCP name) found in any source .ts file

## Recommended Next Focus
D4 Maintainability — manual testing scenario robustness