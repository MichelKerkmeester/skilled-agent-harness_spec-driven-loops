# MCP Notes Drift Audit

Date: 2026-05-17

## Scope

Audited MCP-info surfaces for stale mk-spec-memory tool counts, embedder-tool mentions, and retrieval-rescue feature-flag notes after the 016 post-state.

## Updated Inline

- `.mcp.json`
  - `_NOTE_2_TOOLS`: `39` -> `42`
  - Added `memory_quick_search` to the memory group.
  - Added `embedder_list/set/status` as the 3-tool embedder group.
  - `_NOTE_8_FEATURE_FLAGS`: added default-on `SPECKIT_RERANK_LAYER`.
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
  - Description now says `42 tools` and includes embedder control.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-spec-memory-mcp-stress-test/graph-metadata.json`
  - Trigger phrase refreshed from `39 tool sweep` to `42 tool sweep`.

## Audited Clean

- `.utcp_config.json`: no mk-spec-memory tool counts or feature-flag notes.
- `.opencode/skills/system-spec-kit/mcp_server/configs/search-weights.json`: no tool-count or feature-flag note drift.
- `.opencode/skills/system-spec-kit/mcp_server` JSON inventory: 24 JSON files scanned outside `dist`, `data`, `database`, `node_modules`, and coverage; no additional stale tool-count strings found.
- Skill manifests: 20 `SKILL.md` files scanned; no stale mk-spec-memory tool-count claims found.
- Per-spec graph metadata: 17 targeted `graph-metadata.json` hits sampled for mk-spec-memory/tool references; 15 were contextual references without stale counts.

Clean audited count: 59 files.

## Follow-On Drift

- `.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/011-skill-alignment/graph-metadata.json`
  - Archived `causal_summary` still says the live memory surface settled at `33 tools`.
  - Recommendation: leave archived metadata untouched unless a future graph-metadata regeneration packet explicitly refreshes archive state.

## Notes

- Historical evidence JSONL rows under this packet still describe the ADR-010 opt-in run as captured at the time. Those rows were not rewritten; ADR-011 and current docs now record the default-on operator decision.
- The `SPECKIT_RERANK_LAYER` runtime contract is now: unset means enabled, `false` means disabled.
