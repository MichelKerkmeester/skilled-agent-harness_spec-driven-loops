# Iteration 075 — vocab NEEDS-FIX: DEFAULT_RELATION_TARGETS diverges from canonical RELATION_TYPES (prod stats bug); STATE_LIMITS export; owners 008/003,008/004,005

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.72. **Findings:** 5.
**Raw analysis:** `research/prompts/iteration-075.out`

### FINDINGS
[F-075-01] Live canonical `RELATION_TYPES` = `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`; schema CHECK matches it. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18-24`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:719-721`

[F-075-02] `DEFAULT_RELATION_TARGETS` = `caused`, `supports`, `contradicts`, `supersedes`, `produced`, `cited_by`; it omits canonical `enabled`/`derived_from` and includes non-canonical `produced`/`cited_by`. `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:41-48`

[F-075-03] Divergence is coverage/reporting-only for edge semantics, but production-consumed by `memory_causal_stats`: handler calls `buildRelationCoverageState(byRelation, db)` and returns `relationCoverage`; edge validation uses `RELATION_TYPES`, not `DEFAULT_RELATION_TARGETS`. Real production stats/hints bug, not insertion blocker. `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:13`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:997`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:1043-1055`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:829-834`

[F-075-04] 008/003 explicitly plans `ENABLED(A -> B)` edges and `enabled` is valid live vocabulary/schema, so reducer is feasible vocab-wise; its own audit note correctly blocks on coverage-target alignment before relation floors. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:48`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:60-61`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:81`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:20`

[F-075-05] `STATE_LIMITS` is still a module-local const and only exposed through `__testables`, explicitly “not intended for production use”; 008/004-retention-reducer already records the needed production export precondition. `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:68-74`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:359-370`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer/spec.md:59`

### VOCAB_ACTIONS
- Align `DEFAULT_RELATION_TARGETS` to canonical `RELATION_TYPES`, or explicitly document it as legacy coverage/output-only and add canonical `enabled`/`derived_from` targets before 008/003 applies relation floors.
- Add a normal production export/helper for `STATE_LIMITS`; do not import from `__testables`.
- 005-metadata-edge-promoter and 008/003-causal-reducer requirements must cite `RELATION_TYPES` plus schema CHECK as canonical vocabulary; 004-tombstones must preserve relation text but not change allowed vocabulary.

### VERDICT
vocab/constants = NEEDS-FIX

008/003 owns `DEFAULT_RELATION_TARGETS` alignment before `ENABLED` reducer floors. 008/004 owns `STATE_LIMITS` production export. 005 owns canonical vocabulary mapping for metadata promotion. 004 owns tombstone preservation only, not vocabulary expansion.

### RULED_OUT
- `enabled` absent from live vocabulary: ruled out.
- `DEFAULT_RELATION_TARGETS` as edge-validator/schema source: ruled out.
- `STATE_LIMITS` already production-exported: ruled out.

### METRICS
newInfoRatio: 0.72

novelty: Live code confirms the audit: `RELATION_TYPES`/schema are stable, but coverage targets and `STATE_LIMITS` export remain blocking constants drift.

status: complete

sources: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18-24`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:719-721`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:41-48`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:997`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:1043-1055`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:60-61`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:68-74`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:359-370`
