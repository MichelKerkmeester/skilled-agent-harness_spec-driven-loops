# Deep Review Resource Map

Generated from review deltas and iteration evidence.

| Finding | Severity | Primary Evidence | Dimensions |
|---------|----------|------------------|------------|
| P1-001 Empty upsert violates documented no-op contract | P1 | `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:52` | correctness, traceability |
| P1-002 CONTINUE coverage claim is untested | P1 | `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:142` | correctness, traceability |
| P1-003 Arbitrary metadata returned in prompt-safe output | P1 | `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67` | security, traceability |
| P2-001 Replay recovery remains manual | P2 | `.opencode/skills/deep-ai-council/references/graph_support.md:96` | maintainability |

## Reviewed Surfaces

- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`
- `.opencode/skills/deep-ai-council/SKILL.md`
- `.opencode/skills/deep-ai-council/references/graph_support.md`
- `.opencode/skills/deep-ai-council/manual_testing_playbook/05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md`
- Phase 003 spec docs under `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/`
