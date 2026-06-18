# Deep Review Strategy: Search and Retrieval Scope

BINDING: spec_folder=.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval
BINDING: artifact_dir=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-a-2
BINDING: resolveArtifactRoot=skipped_by_fanout_override

## Topic
Independent gpt-5.5 deep-review audit of system-spec-kit MCP search/retrieval behavior, focused on correctness and scoped retrieval seams.

## Review Dimensions
| Dimension | Status | Notes |
| --- | --- | --- |
| correctness | complete | Iteration 001 reviewed scope handling in memory_search fallback and summary retrieval channel. |
| security | pending | Not covered due maxIterations=1. |
| performance | pending | Not covered due maxIterations=1. |
| concurrency-cancellation | pending | Not covered due maxIterations=1. |
| maintainability | pending | Not covered due maxIterations=1. |
| spec-vs-code-drift | pending | Partially touched through scope contract evidence. |

## Completed Dimensions
| Iteration | Dimension | Verdict | Evidence |
| --- | --- | --- | --- |
| 001 | correctness | CONDITIONAL | F001 P1, F002 P2. |

## Running Findings
| Severity | Count | Active Finding IDs |
| --- | ---: | --- |
| P0 | 0 | none |
| P1 | 1 | F001 |
| P2 | 1 | F002 |

## What Worked
- Direct graphless review was necessary because code graph readiness was stale. Exact `Glob`, `Grep`, and `Read` evidence was sufficient for finding-level confidence.
- Tracing `memory_search` after Stage 4 exposed fallback paths that bypassed the otherwise scoped pipeline.

## What Failed
- Code graph structural context could not be trusted for this run because status reported `trustState=stale` and required a full scan.
- Max iteration count of 1 prevented full dimension coverage and stabilization.

## Exhausted Approaches
- Code graph relationship queries were not used because stale readiness would make structural answers unreliable.

## Ruled-Out Directions
- Confidence calibration/PAV logic was inspected and no active defect was recorded in this single pass.
- Stage 4 final limit enforcement exists for normal pipeline results; the active P1 is specifically post-pipeline community fallback scope, not Stage 4 limit handling.

## Next Focus
Run a follow-up security/performance pass over the same retrieval surface, starting with community fallback scope enforcement and global/community retrieval semantics.

## Known Context
- Scope file says this round broadens beyond 017-021 fixes to the whole search/retrieval surface and emphasizes scoped retrieval, score normalization, calibration, and unbounded read-path work.
- `resource-map.md` not present. Skipping coverage gate.

## Cross-Reference Status
| Protocol | Status | Gate | Notes |
| --- | --- | --- | --- |
| spec_code | partial | hard | Scope spec requires search/retrieval audit; findings map to shipped code evidence. |
| checklist_evidence | skipped | hard | No checklist.md in the review-scope folder. |
| feature_catalog_code | partial | advisory | Search/retrieval feature paths were reviewed only for correctness seams. |
| playbook_capability | skipped | advisory | No playbook target in this scope. |

## Files Under Review
| Path | Coverage | Notes |
| --- | --- | --- |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md` | read | Scope source. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | reviewed | P1 community fallback scope bypass. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | reviewed | P1 source of global member IDs. |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | reviewed | Confirms formatter does not re-filter supplied rows by specFolder. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | reviewed | P2 summary channel exact scope filter. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts` | read | Canonical descendant LIKE pattern reference. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | sampled | No finding recorded in this pass. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | sampled | No finding recorded in this pass. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | sampled | No finding recorded in this pass. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | sampled | No finding recorded in this pass. |

## Review Boundaries
- Max iterations: 1.
- Artifact root was bound directly to the fan-out lineage override.
- No target code was modified.
- Writes were confined to the lineage artifact directory.
- Final synthesis is based on maxIterations, not convergence.

## Non-Goals
- Implement fixes.
- Modify target code or canonical spec docs.
- Run resolveArtifactRoot.
- Run memory continuity save, because the user limited writes to the lineage artifact directory.

## Stop Conditions
- Stop after one iteration per config.maxIterations.
- Stop immediately on any P0 requiring escalation; none found.
