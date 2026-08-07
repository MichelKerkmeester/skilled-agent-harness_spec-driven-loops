# Deep Review Report - gpt55r2-b-9

## Executive Summary
Verdict: CONDITIONAL

Active findings: P0=0, P1=2, P2=0. `hasAdvisories=false`.

Scope: B-rest-of-002 memory store/index/lifecycle audit, with a single max-iteration fan-out pass over delete, retention, governance, index scan, and related lifecycle evidence.

Stop reason: `maxIterationsReached` after 1 iteration. Release readiness remains `in-progress` because active P1 findings need remediation or contract clarification.

## Planning Trigger
Route to remediation planning. Both findings concern soft-delete lifecycle semantics and can affect deletion/retention guarantees when `SPECKIT_SOFT_DELETE_TOMBSTONES=true`.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|---|---|---|---|---|---|
| F001 | P1 | correctness/security | Soft-delete path leaves tombstoned rows visible through active projection retrieval | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-99`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:718-743`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:232-236` | active |
| F002 | P1 | traceability/data-integrity | Soft-delete retention mode skips expired active rows instead of sweeping delete_after records | `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:142-173`; `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503-506`; `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:143-176` | active |

## Remediation Workstreams
| Workstream | Findings | Recommended Order |
|---|---|---|
| Soft-delete active visibility | F001 | 1 |
| Retention sweep two-phase contract | F002 | 2 |

## Spec Seed
- Define whether soft-delete tombstones are hidden immediately from all active recall surfaces or remain queryable until purge.
- Define whether `memory_retention_sweep` under `SPECKIT_SOFT_DELETE_TOMBSTONES=true` tombstones active expired rows, purges active expired rows, or only purges previously tombstoned rows.
- Update the `memory_retention_sweep` public description if the intended behavior is tombstone-purge-only.

## Plan Seed
1. Add a regression proving `memory_delete({ id, confirm:true })` with tombstones enabled cannot return the deleted row through trigger/vector/BM25/graph active retrieval.
2. Either remove tombstoned IDs from `active_memory_projection` and active caches during `tombstoneMemory`, or add/enforce `deleted_at IS NULL` across all active retrieval SQL.
3. Add a retention regression for an active row with expired `delete_after` and tombstones enabled; decide and enforce expected tombstone-or-purge behavior.
4. Align tests and tool schema with the chosen two-phase retention contract.

## Traceability Status
| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Scope asked for write safety and retention lifecycle; two P1 lifecycle findings recorded. |
| checklist_evidence | n/a | Scope packet has no checklist.md. |
| feature_catalog_code | partial | Retention tool description says expired `delete_after` rows are swept, while soft-delete mode filters to tombstoned rows only. |
| playbook_capability | partial | Delete/retention playbooks need explicit soft-delete semantics. |

## Deferred Items
- Long-tail review of `handlers/save/*`, `lib/storage/*`, and `lib/ops/*` remains residual risk because this lineage was capped at one iteration.
- Cancellation lifecycle review was sampled but no finding was recorded in this pass.

## Audit Appendix
| Item | Result |
|---|---|
| Iterations | 1 |
| Stop reason | `maxIterationsReached` |
| New findings ratio | 1.00 |
| Claim adjudication | passed for F001 and F002 |
| P0 replay | no P0 findings |
| Resource map present at init | false |
| Resource map emitted | `resource-map.md` evidence index |

Replay validation: JSONL state, registry, dashboard, iteration markdown, and this report agree on verdict `CONDITIONAL` with active counts P0=0, P1=2, P2=0.
