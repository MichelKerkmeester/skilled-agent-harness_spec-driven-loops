# Review Resource Map: gpt-2

## Reviewed Artifacts

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/tasks.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/implementation-summary.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration/implementation-summary.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation/implementation-summary.md`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`

## Phase-5 Augmentation

- Novel logic gaps: F002 (`query.ts` unresolved-only BM25 integration vs broader Phase 009 resolver scope).
- Traceability gaps: F001 (phase parent stale planned/scaffold-only state).
- Maintainability advisories: F003 (ephemeral bug label in durable source comment).
