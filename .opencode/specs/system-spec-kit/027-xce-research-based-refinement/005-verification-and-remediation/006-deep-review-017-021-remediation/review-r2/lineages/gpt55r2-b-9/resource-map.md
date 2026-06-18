# Review Evidence Resource Map

## Phase-5 Augmentation
- Novel logic gaps: F001 soft-delete active visibility; F002 soft-delete retention candidate filtering.
- Iteration sources: `iterations/iteration-001.md`.
- Empty-result case: not applicable; findings were recorded.

## Evidence Index
| Finding | Evidence |
|---|---|
| F001 | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-99`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:232-236`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:718-743` |
| F002 | `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:142-173`; `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503-506`; `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:143-176` |
