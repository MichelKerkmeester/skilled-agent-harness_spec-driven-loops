> Extracted from `027/research/027-xce-research-pt-02/resource-map.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

### 027 phase specs

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/plan.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/tasks.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/description.json`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/plan.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/tasks.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/checklist.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/description.json`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/plan.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-skill-advisor-first-action-mandate/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-skill-advisor-first-action-mandate/description.json`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/plan.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/checklist.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/description.json`


### mcp_server source

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/prompt-cache.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-prompt-cache.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/api/providers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`


### Deliverables written in this synthesis

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/findings.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/sub-packet-amendments.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/resource-map.md`


## Cross-Packet Dependencies

- Pass 2 depends on pass 1's parent synthesis and phase scaffolds for the adoption surface and original phase split.
- Phase 001 amendments feed Phase 002 through `classifyFileRole()` and the open-string `file_role` contract.
- Phase 002 amendments feed Phase 003 only for optional downstream narrative reuse; Phase 003 deterministic MVP remains independent.
- Phase 003 amendments feed Phase 005 because Phase 005 calibrates risk weights and evaluates impact-analysis behavior.
- Phase 004 amendments feed Phase 005 because the eval harness measures the advisor first-action treatment.
- Phase 005 depends on all four implementation phases and should remain last unless subprocess hardening is split into a prerequisite packet.
- pt-02 does not modify any phase scaffold; it proposes changes for a follow-on amendment packet.


