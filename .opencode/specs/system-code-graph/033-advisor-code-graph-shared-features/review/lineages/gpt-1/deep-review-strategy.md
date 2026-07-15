# Deep Review Strategy

## Topic

Fan-out lineage review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` and selected advisor/code-graph implementation surfaces.

## Review Dimensions

- [x] Correctness
- [x] Security
- [x] Traceability
- [x] Maintainability

## Completed Dimensions

| Dimension | Iteration | Verdict |
|-----------|-----------|---------|
| Correctness | 001 | CONDITIONAL: F001 |
| Security | 002 | CONDITIONAL: F002 reachability risk, no direct prompt/security leak found |
| Traceability | 003 | CONDITIONAL: F003 plus partial core protocol status |
| Maintainability | 002-003 | CONDITIONAL: public schema and parent status drift create maintenance debt |

## Running Findings

| Severity | Active | Newest Iteration |
|----------|--------|------------------|
| P0 | 0 | n/a |
| P1 | 3 | 003 |
| P2 | 0 | n/a |

## What Worked

- Direct code reads found production reachability gaps that targeted unit tests missed.
- Comparing parent spec claims with child-phase completion metadata exposed stale phase-parent status.
- Schema validation checks proved the handler-only `includeTrace` implementation is not public-call reachable.

## What Failed

- Code graph structural MCP was stale (`trustState: stale`), so structural graph queries were not used as authoritative evidence.
- No parent `resource-map.md` exists, so resource-map coverage was marked not applicable.

## Exhausted Approaches

- Do not treat direct handler tests as proof of public tool reachability when `validateToolArgs` enforces `additionalProperties:false`.
- Do not trust parent packet status without reconciling child specs and graph metadata.

## Ruled Out Directions

- No P0 security finding was recorded: attribution sanitization and trace default-off behavior did not show direct raw prompt/code execution exposure in inspected surfaces.
- No tombstone retention finding was recorded: the status path and retention pruning are present in inspected code.

## Next Focus

Remediate active P1 findings before release-readiness: wire or explicitly re-scope BM25 shadow telemetry, add `includeTrace` to the published `code_graph_query` schema, and reconcile parent packet status/metadata.

## Known Context

- Spec 145 is a phase parent for nine advisor/code-graph adoption phases.
- Parent `resource-map.md` is absent. Skipping coverage gate.
- Code graph readiness is stale: git HEAD changed and 874 stale files exceed the selective threshold.

## Cross-Reference Status

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| spec_code | hard | partial | F003: parent says scaffold-only while children are complete |
| checklist_evidence | hard | partial | Child task ledgers checked, but parent is not reconciled |
| feature_catalog_code | advisory | partial | F001/F002 reachable-vs-claimed drift |
| playbook_capability | advisory | not_applicable | No playbook surface reviewed in this lineage |

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | reviewed | F001 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` | reviewed | F001 support |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` | reviewed | F001 support |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | reviewed | F002 support |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | reviewed | F002 |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | reviewed | F002 support |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md` | reviewed | F003 |
| child phase specs 001, 006, 009 | sampled | F003 support |

## Review Boundaries

- Max iterations: 3.
- Artifact root: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/review/lineages/gpt-1`.
- Writes were constrained to the artifact root.

## Non-Goals

- Do not implement fixes during review.
- Do not modify target code or spec documents outside the lineage artifact directory.

## Stop Conditions

- Stop after convergence or `config.maxIterations`, whichever comes first.
- This lineage stopped at max iterations with active P1 findings, so synthesis verdict is CONDITIONAL.
