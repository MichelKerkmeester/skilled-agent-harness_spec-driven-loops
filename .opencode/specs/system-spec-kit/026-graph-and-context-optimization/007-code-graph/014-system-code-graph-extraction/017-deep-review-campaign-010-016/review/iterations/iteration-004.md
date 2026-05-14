# Iteration 4: D3 Traceability — Spec vs Implementation Alignment

## Focus
D3 Traceability — Verify that spec and architecture documentation matches the actual implementation.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.40

## Findings

### P2 — Suggestion

- **F011**: architecture.md §9 "OPEN QUESTIONS" item 1 (line 288) states "SKILL.md still describes 12 MCP tools, while the live schema array and dispatcher expose ten." This is a stale open question — SKILL.md does NOT claim 12 tools. The SKILL.md §2 smart routing table and §5 references correctly list 10 tools. This open question should be resolved. — architecture.md:288

- **F012**: The launcher's `buildIfNeeded` function has a fallback path (mk-code-index-launcher.cjs:170-175) that creates a re-export shim if the direct `dist/index.js` doesn't exist but a nested `dist/system-code-graph/mcp_server/index.js` does. This nested path uses the old package structure name. While the fallback is a build artifact concern, it documents a legacy path that could confuse future maintainers. — mk-code-index-launcher.cjs:170-175

## Assessment
- Architecture documentation well-aligned overall
- 10-tool surface matches across schema, dispatch, and SKILL.md
- Stale open question F011 is the most significant traceability gap but carries no runtime risk

## Recommended Next Focus
D3 Traceability — feature catalog vs code surface