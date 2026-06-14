# Deep Review Report: gpt-3 lineage

## Executive Summary
- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 3
- Active findings: P0=0, P1=3, P2=0
- hasAdvisories: false
- Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` plus referenced advisor/code-graph implementation surfaces.
- Release readiness state: in-progress

This lineage found no P0 blockers, but three active P1 contract gaps prevent a PASS verdict. Two are public schema/descriptor reachability failures for implemented debug features; one is parent phase-state drift after child completion.

## Planning Trigger
Create a remediation plan before claiming release readiness. The fixes are bounded:
- Add `includeTrace` to the exported `code_graph_query` schema and parity tests.
- Add `includeSemanticHealth` and `debug` to `advisor_status` MCP and CLI descriptors, with descriptor-schema parity tests.
- Reconcile parent phase status, phase map, graph metadata, and last-active child state after child completion.

## Active Finding Registry
| ID | Severity | Status | Dimension | Title | Evidence |
|----|----------|--------|-----------|-------|----------|
| F001 | P1 | active | correctness/traceability | `code_graph_query` does not expose `includeTrace` in its public tool schema | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:49-60`; `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:37-48`; `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1533-1542` |
| F002 | P1 | active | correctness/security | `advisor_status` semantic health is implemented but blocked by public descriptors | `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts:10-16`; `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:231-237`; `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:257-281` |
| F003 | P1 | active | traceability/maintainability | Phase parent still advertises every child as planned after child completion | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:51-122`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json:43-45` |

## Remediation Workstreams
1. Code Graph schema parity: update `code_graph_query` public schema to include `includeTrace`, then add validation coverage that schema-validated calls can reach `why_included` output.
2. Skill Advisor descriptor parity: update MCP and CLI descriptors for `advisor_status` to expose `includeSemanticHealth` and `debug`, then add parity tests against the Zod schema.
3. Phase-parent reconciliation: update the parent phase map and derived metadata so aggregate status reflects completed child phases and resume/search surfaces point to the right child state.

## Spec Seed
- Add an acceptance criterion requiring every newly implemented optional handler input to be exposed in all public descriptor/manifest surfaces in the same phase.
- Add a phase-parent completion rule requiring parent aggregate status reconciliation when child phases move from planned to completed.

## Plan Seed
- Task 1: Patch `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` `code_graph_query` properties with `includeTrace` and run code-graph schema validation tests.
- Task 2: Patch `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts` and `skill-advisor-cli-manifest.ts` with `includeSemanticHealth` and `debug`; add descriptor parity tests.
- Task 3: Reconcile `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md` and `graph-metadata.json` aggregate status after child completion.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | fail | hard | F001 and F002 show implemented behavior not exposed by public schemas. |
| checklist_evidence | partial | hard | F003 shows aggregate status is stale relative to child evidence. |
| feature_catalog_code | partial | advisory | Implemented features exist but catalog/descriptors do not fully advertise them. |
| playbook_capability | partial | advisory | Debug playbooks depending on trace/health options are descriptor-blocked. |

## Deferred Items
- No P2 advisories were recorded.
- No live test suite was run by this lineage; findings are evidence-based source review only.
- Memory save was not run because the user constrained writes to the lineage artifact directory only.

## Audit Appendix
| Iteration | Dimensions | Files Reviewed | New P0 | New P1 | New P2 | Verdict |
|-----------|------------|----------------|--------|--------|--------|---------|
| 1 | correctness, traceability | 4 | 0 | 1 | 0 | CONDITIONAL |
| 2 | security, correctness | 5 | 0 | 1 | 0 | CONDITIONAL |
| 3 | traceability, maintainability | 4 | 0 | 1 | 0 | CONDITIONAL |

Convergence replay:
- Dimension coverage reached 4/4.
- Active P1 count is 3, so final verdict is CONDITIONAL.
- Stop reason is maxIterationsReached because `config.maxIterations` is 3.
- Claim adjudication packets were recorded for all P1 findings.

Executor audit:
- Requested executor: `cli-opencode model=openai/gpt-5.5-fast`.
- Direct `opencode run` dispatch was not used because `cli-opencode` prohibits self-invocation inside OpenCode unless explicitly detached. This lineage executed in-process and wrote the required artifacts directly under the configured fan-out artifact directory.
