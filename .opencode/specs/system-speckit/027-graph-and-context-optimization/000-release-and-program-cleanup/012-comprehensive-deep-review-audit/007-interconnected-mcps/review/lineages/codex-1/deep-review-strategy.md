# Deep Review Strategy

## Topic
Interconnected MCPs Review Slice.

## Review Dimensions
- [x] correctness - release-blocking fan-out reducer and concurrency findings recorded.
- [x] security - executor recursion/env guard bypass reviewed.
- [x] traceability - spec-to-code and tool-surface contracts reviewed.
- [x] maintainability - sandbox-boundary and comment-hygiene advisories recorded.

## Completed Dimensions
- correctness: FAIL, active P0 and P1 findings.
- security: CONDITIONAL, shared executor guard is bypassed by the fan-out path.
- traceability: CONDITIONAL, CLI executor contract drift remains.
- maintainability: PASS with advisories.

## Running Findings
- P0: 1
- P1: 4
- P2: 2
- Verdict trajectory: FAIL

## What Worked
- Direct file:line comparison found the fan-out artifact override mismatch between workflow YAML and reducer script.
- Reviewing the runner and pool together exposed the async primitive versus synchronous worker mismatch.
- Cross-checking cli-codex against deep-loop runtime showed service-tier drift that local tests do not cover.

## What Failed
- Code graph MCP was unavailable in-session, so structural discovery used `rg` and direct reads.
- No tests were executed because this lineage was constrained to write only under its artifact directory.

## Exhausted Approaches
- Code-graph MCP structural queries: unavailable in this session.
- Resource-map coverage audit: target spec has no `resource-map.md`; coverage gate marked not applicable.

## Ruled-Out Directions
- Tool ID drift as a release blocker: code-graph and skill-advisor live tool registrations match their stable public tool IDs.
- Code-graph readiness degradation as a finding: read paths block on non-fresh or errored readiness and surface recovery data.

## Next Focus
Synthesis. All configured dimensions have evidence; active P0/P1 findings block release readiness.

## Known Context
- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps`
- Artifact dir: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/lineages/codex-1`
- `resource-map.md` not present. Skipping coverage gate.

## Cross-Reference Status
| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| spec_code | hard | partial | Fan-out concurrency and executor-config concerns verified; reducer override bug added as release-blocking. |
| checklist_evidence | hard | pass | Level 1 slice has no checklist; success criterion satisfied by recorded verdict. |
| feature_catalog_code | advisory | partial | Fan-out docs describe concurrency and iterations, but implementation does not honor them end-to-end. |
| playbook_capability | advisory | partial | Existing fanout-run tests cover directories and ledger, not true subprocess overlap or guard reuse. |

## Files Under Review
| File | Coverage | Notes |
|---|---:|---|
| `.opencode/skills/system-code-graph/SKILL.md` | partial | Tool contract checked through live schemas and handler files. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | full | Public tool IDs checked. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | partial | Readiness behavior checked. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts` | partial | Readiness behavior checked. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts` | partial | Readiness and comment hygiene checked. |
| `.opencode/skills/system-skill-advisor/SKILL.md` | partial | Stable tool IDs checked. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | partial | Standalone server registration checked. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts` | full | Public tool descriptors checked. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | full | Skill graph tool descriptors checked. |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | full | Runtime ownership and script contracts checked. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | full | Multiple active findings. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | full | Pool primitive itself looks correct. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | full | Iterations and sandbox defaults reviewed. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | partial | Guard and env filtering compared against fan-out runner. |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | partial | Session-scoped convergence path reviewed. |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | full | Release-blocking fan-out artifact routing finding. |

## Review Boundaries
- Max iterations: 7
- Convergence threshold: 0.10
- Stop reason: maxIterationsReached
- Final verdict: FAIL
- Non-goals: implementation fixes, code edits outside this lineage artifact directory.
- Stop conditions: all dimensions covered, max iterations reached, synthesis complete.
