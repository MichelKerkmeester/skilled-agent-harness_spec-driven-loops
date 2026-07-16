# Deep Review Strategy - gpt55r2-a-9

## Topic
Fan-out deep review of `.opencode/skills/system-spec-kit/mcp_server/` search and retrieval code for scope A.

## Review Dimensions

| Dimension | Status | Notes |
| --- | --- | --- |
| correctness | [x] | Iteration 001 covered hybrid lexical fusion and recovery-policy seams. |
| security | [ ] | Not completed before maxIterations=1. |
| performance | [ ] | Partially observed through duplicate lexical scoring, but not full coverage. |
| concurrency-cancellation | [ ] | Not completed before maxIterations=1. |
| maintainability | [ ] | Not completed before maxIterations=1. |
| spec-vs-code-drift | [x] | Formatter tests and live handler wiring were cross-checked for evidence-gap contract drift. |

## Completed Dimensions

| Iteration | Dimension | Verdict | Summary |
| --- | --- | --- | --- |
| 001 | correctness | CONDITIONAL | Found two active P1 retrieval defects. |
| 001 | spec-vs-code-drift | CONDITIONAL | Found handler/formatter field-name drift for evidence-gap recovery policy. |

## Running Findings

| Severity | Count | Active Findings |
| --- | ---: | --- |
| P0 | 0 | None |
| P1 | 2 | F-A9-001, F-A9-002 |
| P2 | 0 | None |

## What Worked

| Iteration | Observation |
| --- | --- |
| 001 | Tracing from handler to formatter exposed a live integration gap not covered by formatter-only tests. |
| 001 | Comparing SQLite lexical routing with RRF fusion showed how duplicate same-source keyword rows inflate ranking. |

## What Failed

| Iteration | Observation |
| --- | --- |
| 001 | `maxIterations=1` prevented full security, cancellation, and maintainability coverage. |

## Exhausted Approaches

| Approach | Result |
| --- | --- |
| Direct MCP session reuse | Memory trigger lookup rejected the fan-out session id as non-server-managed; review continued with direct file inspection. |

## Ruled-Out Directions

| Direction | Reason |
| --- | --- |
| Treating `includeArchived` as an active bug | Existing tests explicitly assert it is API-only compatibility after cleanup. |

## Next Focus

Recommended next dimension: security and concurrency/cancellation over `handlers/memory-search.ts`, `lib/search/hybrid-search.ts`, and vector/trigger backfill modules.

## Known Context

- Scope file says this is a review-only audit with no implementation to verify.
- Resource map was not present in the scope folder. Skipping coverage gate.
- Artifact root was bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` command was not run.

## Cross-Reference Status

| Protocol | Class | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | core | covered | Scope paths and declared search/retrieval files were inspected directly. |
| checklist_evidence | core | not_applicable | Scope folder contains only `spec.md`; this is a review-scope target. |
| feature_catalog_code | overlay | partial | Search pipeline and recovery policy feature seams inspected. |
| playbook_capability | overlay | not_applicable | No playbook target in scope. |

## Files Under Review

| File | Coverage | Notes |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | covered | F-A9-001. |
| `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` | covered | F-A9-001 downstream score accumulation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts` | covered | F-A9-002 evidence-gap producer. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | covered | F-A9-002 handler bridge. |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | covered | F-A9-002 recovery consumer. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts` | covered | F-A9-002 expected formatter contract. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | sampled | No active finding recorded. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | sampled | No active finding recorded. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | sampled | No active finding recorded. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | sampled | No active finding recorded. |

## Review Boundaries

- Max iterations: 1.
- No code or target-file modifications were made.
- Outputs are confined to the lineage artifact directory.
- Final verdict is conditional because active P1 findings remain.

## Non-Goals

- No remediation implementation.
- No mutation of reviewed source files.
- No external web research.

## Stop Conditions

- Stopped because `config.maxIterations` was reached after iteration 001.
