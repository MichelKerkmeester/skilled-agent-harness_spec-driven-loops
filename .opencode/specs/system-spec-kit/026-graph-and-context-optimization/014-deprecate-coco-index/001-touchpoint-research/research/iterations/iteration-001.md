# Iteration 001 - RQ1 Live-Reference Inventory Seed

## Focus (RQ1)
Seed the exhaustive LIVE-reference inventory for mcp-coco-index, system-rerank-sidecar, and system-code-graph decoupling.

## Classified Live Touchpoints

| File (file:line) | Token(s) | Mutation Class | Note |
|------------------|----------|----------------|------|
| .opencode/skills/mcp-coco-index/SKILL.md:1-496 | mcp-coco-index, cocoindex, cocoindex_code, COCOINDEX_RERANK_VIA_SIDECAR | DELETE | Entire skill folder to delete (forked cocoindex-code, MCP server, CLI) |
| .opencode/skills/system-rerank-sidecar/SKILL.md:1-340 | system-rerank-sidecar, rerank_sidecar | DELETE | Entire skill folder to delete (FastAPI sidecar, HTTP service) |
| .opencode/skills/system-code-graph/SKILL.md:52,74,123,161-163 | mcp-coco-index, ccc | EDIT-decouple | Remove CCC bridge integration docs, semantic routing references, ccc_* tool registrations |
| .opencode/skills/system-code-graph/references/integrations/ccc_bridge_integration.md:1-158 | ccc, cocoindex, cocoindex_code | DELETE | Integration doc to delete after tool removal |
| opencode.json:78-92 | cocoindex_code | EDIT-remove-ref | Remove cocoindex_code MCP server registration block |
| .vscode/mcp.json:57-68 | cocoindex_code | EDIT-remove-ref | Remove cocoindex_code MCP server registration block |
| .codex/config.toml:53-64,78-90,97-108 | cocoindex_code, RERANK_SIDECAR_PORT | EDIT-remove-ref | Remove cocoindex_code MCP block and RERANK_SIDECAR_PORT env vars |
| .opencode/skills/system-spec-kit/SKILL.md:422,428 | system-rerank-sidecar | EDIT-remove-ref | Remove sidecar references from skill documentation |
| .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:213 | system-rerank-sidecar | EDIT-remove-ref | Remove sidecar env var documentation |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts | local provider, ensure-rerank-sidecar | EDIT-decouple | Remove local cross-encoder provider path, ensure helper integration |
| .opencode/bin/lib/ensure-rerank-sidecar.cjs:605 | rerank_sidecar | DELETE | Delete ensure helper script after sidecar removal |
| .opencode/commands/deep/start-research-loop.md:4,313 | cocoindex_code | EDIT-remove-ref | Remove cocoindex_code MCP tool reference from deep-research command |
| .opencode/commands/deep/start-review-loop.md:4,360 | cocoindex_code | EDIT-remove-ref | Remove cocoindex_code MCP tool reference from deep-review command |
| .opencode/commands/deep/ask-ai-council.md:5 | cocoindex | EDIT-remove-ref | Remove cocoindex reference from AI council command |
| .opencode/agents/deep-review.md:253 | cocoindex_code | EDIT-remove-ref | Remove cocoindex_code reference from deep-review agent |
| .opencode/commands/doctor/scripts/mcp-doctor.sh:16,50,62,291-295,331-339,795,830 | ccc, cocoindex, cocoindex_code | EDIT-remove-ref | Remove CCC CLI and cocoindex doctor checks |
| .opencode/commands/doctor/assets/doctor_mcp_install.yaml:162-172 | ccc | EDIT-remove-ref | Remove cocoindex MCP install guidance |
| .opencode/skills/deep-review/SKILL.md:4,517 | cocoindex_code | EDIT-remove-ref | Remove cocoindex_code reference from skill documentation |
| .opencode/skills/system-skill-advisor/SKILL.md:417 | mcp-coco-index | EDIT-remove-ref | Remove skill advisor routing reference |
| .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:47,1477-1482,1628-1648,3158-3159 | cocoindex | EDIT-remove-ref | Remove cocoindex references from skill graph scripts |
| .opencode/skills/cli-devin/SKILL.md:372 | rerank_sidecar | EDIT-remove-ref | Remove sidecar reference from CLI skill |
| .opencode/skills/cli-opencode/SKILL.md:296 | rerank_sidecar | EDIT-remove-ref | Remove sidecar reference from CLI skill |
| README.md:35,70,109,615,671,901,1188,1201,1238,1393,1484 | cocoindex, ccc, cocoindex_code | EDIT-remove-ref | Remove semantic search and CCC references from README |
| .gitignore:123 | cocoindex_code | EDIT-remove-ref | Remove .cocoindex_code/ gitignore entry |
| .opencode/skills/system-code-graph/mcp_server/lib/shared/cocoindex-path.ts:1-10 | ccc | DELETE | Delete CCC path utility after tool removal |
| .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:424-425 | ccc | EDIT-decouple | Remove CCC semantic routing from query handler |
| .opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:132,144-146,346,352,358 | ccc | EDIT-decouple | Remove CCC bridge tests from test suite |

## Graph edges discovered

node: mcp-coco-index (DELETE)
node: system-rerank-sidecar (DELETE)
node: system-code-graph (EDIT-decouple)
node: system-spec-kit (EDIT-decouple)
node: opencode.json (EDIT-remove-ref)
node: .vscode/mcp.json (EDIT-remove-ref)
node: .codex/config.toml (EDIT-remove-ref)
node: deep-research command (EDIT-remove-ref)
node: deep-review command (EDIT-remove-ref)
node: deep-review agent (EDIT-remove-ref)
node: doctor scripts (EDIT-remove-ref)
node: global docs (EDIT-remove-ref)

edge: system-rerank-sidecar -> system-spec-kit (cross-encoder.ts local provider, ensure-rerank-sidecar.cjs)
edge: system-rerank-sidecar -> mcp-coco-index (COCOINDEX_RERANK_VIA_SIDECAR)
edge: system-code-graph -> mcp-coco-index (ccc_status/reindex/feedback tools, semantic routing)
edge: deep-research command -> mcp-coco-index (mcp__cocoindex_code__search tool)
edge: deep-review command -> mcp-coco-index (mcp__cocoindex_code__search tool)
edge: opencode.json -> mcp-coco-index (MCP server registration)
edge: .vscode/mcp.json -> mcp-coco-index (MCP server registration)
edge: .codex/config.toml -> mcp-coco-index (MCP server registration)
edge: .codex/config.toml -> system-rerank-sidecar (RERANK_SIDECAR_PORT env var)

## Gaps for next iteration

1. **RQ1 gaps**: Need to enumerate remaining LIVE references in:
   - .gemini/ directory (Gemini runtime configs)
   - .claude/ directory (Claude runtime configs)
   - Hook implementations under .opencode/skills/system-spec-kit/hooks/
   - Agent configurations beyond deep-review
   - Install guides under .opencode/install_guides/
   - Feature catalog entries referencing semantic search
   - Manual testing playbooks with CCC scenarios

2. **RQ2 threads opened**: 
   - Trace mk-spec-memory cross-encoder.ts local provider implementation
   - Verify ensure-rerank-sidecar.cjs integration points
   - Define fallback behavior when sidecar is removed

3. **RQ3 threads opened**:
   - Map exact ccc_* tool registration locations in mk_code_index MCP
   - Identify code_graph_classify_query_intent semantic routing implementation
   - Catalog all CCC bridge integration references in system-code-graph

4. **RQ4 threads opened**:
   - Map semantic-search routing in CLAUDE.md SEARCH ROUTING section
   - Identify AGENTS.md routes that send "find code by concept" to CocoIndex
   - Catalog @context and @deep-review agent semantic search dependencies

5. **RQ5 threads opened**:
   - Enumerate all 4-runtime mirror locations (.opencode/, .claude/, .gemini/, .codex/)
   - Cross-reference MCP registration edits across all runtimes
