# Deep Review Strategy: gpt-3 lineage

## Topic
Fan-out deep review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` with artifact root bound directly to `review/lineages/gpt-3`.

## Review Dimensions
- [x] Correctness: public schemas vs implemented handler behavior.
- [x] Security: prompt-safety and descriptor reachability for debug options.
- [x] Traceability: parent/child spec state and hard protocol evidence.
- [x] Maintainability: release-readiness handoff clarity.

## Completed Dimensions
- Iteration 1: correctness + traceability, verdict CONDITIONAL, found F001.
- Iteration 2: security + correctness, verdict CONDITIONAL, found F002.
- Iteration 3: traceability + maintainability, verdict CONDITIONAL, found F003.

## Running Findings
| Severity | Count | Findings |
|----------|-------|----------|
| P0 | 0 | None |
| P1 | 3 | F001, F002, F003 |
| P2 | 0 | None |

## What Worked
- Comparing handler support against exported JSON schemas exposed public API gaps that handler-only tests missed.
- Reading parent graph metadata alongside child implementation summaries exposed stale resume/search state.

## What Failed
- Direct CLI executor dispatch was not used because `cli-opencode` self-invocation is prohibited inside OpenCode; this lineage executed the review in-process and recorded the executor binding in config.

## Exhausted Approaches
- No further iteration was dispatched after iteration 3 because `config.maxIterations` was reached.

## Ruled-Out Directions
- No P0 security claim was recorded. The observed issues are reachability and state-contract gaps, not data exposure or destructive behavior.

## Next Focus
Remediate the three P1 contract gaps, then rerun a short schema/export regression pass over `code_graph_query`, `advisor_status`, and parent phase metadata.

## Known Context
- `resource-map.md` is not present at the target spec root. Skipping resource-map coverage gate.
- The parent spec originally says this is scaffold-only, but multiple child implementation summaries now report completion.

## Cross-Reference Status
| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| spec_code | hard | fail | F001 and F002 show implemented handler behavior not reachable through public schemas. |
| checklist_evidence | hard | partial | Parent phase state is stale relative to child implementation summaries. |
| feature_catalog_code | advisory | partial | Feature claims exist, but descriptor exposure lags for trace/health options. |
| playbook_capability | advisory | partial | Debug playbooks depending on trace/health options cannot rely on public descriptors. |

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | reviewed | Missing `includeTrace` under `code_graph_query`. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | reviewed | Handler consumes `includeTrace`. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts` | reviewed | Public descriptor only accepts `workspaceRoot`. |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | reviewed | Zod schema accepts `includeSemanticHealth` and `debug`. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts` | reviewed | Handler emits semantic health only when requested. |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts` | reviewed | CLI manifest mirrors stale status descriptor. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md` | reviewed | Parent still reports Planned. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json` | reviewed | Derived status remains planned and last_active_child_id null. |

## Review Boundaries
- Max iterations: 3.
- Writes limited to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/review/lineages/gpt-3`.
- Target source files were read-only.
- No nested sub-agent dispatch.

## Non-Goals
- Do not implement fixes during the review.
- Do not modify parent or child spec metadata.
- Do not run `resolveArtifactRoot`; artifact directory was bound directly from the fan-out override.

## Stop Conditions
- Stop at convergence or after `config.maxIterations`; this lineage stopped because max iterations was reached.
