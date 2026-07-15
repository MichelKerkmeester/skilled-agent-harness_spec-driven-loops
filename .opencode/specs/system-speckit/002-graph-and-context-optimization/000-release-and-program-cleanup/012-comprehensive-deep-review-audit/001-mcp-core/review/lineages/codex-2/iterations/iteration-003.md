# Iteration 3: Traceability

## Focus
Compared live reconcile schema and handler behavior against public docs and catalog surfaces.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.1667

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion
- **F004**: Public docs still instruct `dryRun: false` for `memory_embedding_reconcile` apply mode. The live schema exposes `mode: "dry-run" | "apply"` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342`], and the handler derives apply from `args.mode === "apply"` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19`]. The install guide still says writes require `dryRun: false` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`] and repeats that in troubleshooting [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`].
- **F005**: `activeOnly` is exposed as a public input but is not consumed by reconcile runtime logic. The schema advertises `activeOnly` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`] and the strict input allowlist accepts it [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`]. The reconcile runner reads `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage` only [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`], while the handler always attaches the active shard [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:43`].

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/spec.md:35` | Scoped code reviewed; active P1/P2 findings remain. |
| checklist_evidence | pass/skipped | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/spec.md:9` | Level 1 target has no checklist.md. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654` | Catalog still says dryRun boolean and stale status names. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955` | Troubleshooting command shape is stale. |

## Assessment
- New findings ratio: 0.1667
- Dimensions addressed: traceability
- Novelty justification: public-contract drift, no new P1/P0.

## Ruled Out
- Handler hint drift for apply mode: the handler itself recommends `mode: "apply"` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76`].

## Dead Ends
- No checklist evidence audit was possible because the packet has no checklist.

## Recommended Next Focus
Maintainability and atomic-save failure-path review.
Review verdict: PASS
