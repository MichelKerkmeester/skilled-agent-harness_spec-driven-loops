# Deep Review Strategy

## Topic
Audit Scope - Memory Store / Index / Lifecycle (002 non-search)

## Review Dimensions
| Dimension | Status | Notes |
|---|---|---|
| correctness | [x] | Soft-delete delete semantics reviewed. |
| security | [x] | Focused on deleted-data exposure and tenant/governance lifecycle implications. |
| traceability | [x] | Checked scope contract and tool schema against retention implementation. |
| maintainability | [x] | Checked tests and comments for counterevidence and intentional behavior. |

## Completed Dimensions
| Iteration | Dimensions | Verdict |
|---|---|---|
| 001 | correctness, security, traceability, maintainability | CONDITIONAL |

## Running Findings
| Severity | Active | New This Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 2 | 2 |
| P2 | 0 | 0 |

## Files Under Review
| File | Coverage | Notes |
|---|---|---|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md` | read | Scope and review dimensions. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | read | Single delete soft-delete path. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | read | Bulk delete soft-delete path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | read | Retention candidate selection and deletion. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | read | Impact evidence for active projection retrieval. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | read | Counterevidence: intended active/tombstone indexes. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | read | Tool contract for retention sweep. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | read | Counterevidence and codified current behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts` | read | Counterevidence for hard-delete causal edge cleanup. |

## Cross-Reference Status
| Level | Protocol | Status | Evidence |
|---|---|---|---|
| core | spec_code | partial | Scope asks for write-path safety and retention lifecycle review; F001/F002 are lifecycle drifts. |
| core | checklist_evidence | n/a | Scope packet has no checklist.md. |
| overlay | feature_catalog_code | partial | `memory_retention_sweep` description says expired `delete_after` rows are swept, but soft-delete mode filters to tombstones only. |
| overlay | playbook_capability | partial | Delete/retention playbook behavior needs explicit soft-delete contract. |

## Known Context
- Resource map not present. Skipping coverage gate.
- Max iterations fixed to 1 by fan-out lineage config, so this is a broad single-pass audit rather than convergence-saturated review.

## What Worked
- Cross-checking delete handlers against retention implementation and tests separated hard-delete cleanup from soft-delete behavior.
- Tool schema and tests provided direct contract/counterevidence for retention semantics.

## What Failed
- No live MCP daemon calls were needed; direct file reads were sufficient per scope note.

## Exhausted Approaches
- Retention-causal-edge orphan hypothesis was rejected after reading vector-index delete cleanup and causal-edge tombstone tests.

## Ruled Out Directions
- Hard-delete causal edge cleanup is not reported: `deleteAncillaryMemoryRows` sweeps causal edges and tests cover hard-delete cleanup.

## Next Focus
Max iterations reached. Recommended remediation focus: define the soft-delete contract, then either remove tombstoned rows from active projections/queries or guarantee all active recall queries filter `deleted_at IS NULL`; separately decide whether retention sweep should tombstone or purge active expired rows when the soft-delete flag is enabled.

## Review Boundaries
- Artifact directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-b-9`
- Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002`
- Max iterations: 1
- Non-goal: implementation or mutation outside the lineage artifact directory.

## Non-Goals
- No code changes.
- No remediation planning beyond seed work in the final report.
- No review of the search ranking pipeline except as impact evidence for delete lifecycle findings.

## Stop Conditions
- Stop after one iteration due `config.maxIterations: 1`.
- Stop immediately on P0 that requires live escalation; none found.
