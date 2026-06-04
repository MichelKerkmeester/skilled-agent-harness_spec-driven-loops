# Deep Review Report - MCP Core Review Slice

## 1. Executive Summary
Final verdict: CONDITIONAL.

The lineage completed five review passes across correctness, security, traceability, maintainability, and stabilization. No P0 findings were found. Three P1 findings remain active, plus one P2 advisory. The packet is not release-ready for PASS until the P1s are remediated or explicitly accepted by the program owner.

Active counts:
- P0: 0
- P1: 3
- P2: 1
- hasAdvisories: true

Scope:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`

## 2. Planning Trigger
Route to remediation planning. The active P1s are behavior or operator-contract bugs:
- F001 can keep graph-channel routing stale after update/delete mutations.
- F002 makes reconcile dry-run/planned mutation output inconsistent with apply behavior.
- F003 gives operators an unsupported repair command.

## 3. Active Finding Registry

### F001 - P1 - memory_update and memory_delete leave entity-density cache stale
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:117`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:244`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4`

The shared mutation hook does not import or call `invalidateEntityDensityCache`, while update/delete rely on that shared hook after mutating rows or edges used by the entity-density cache.

### F002 - P1 - success coverage dry-run undercounts rows missing only the active dimension vector
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:285`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84`

Dry-run coverage counts only missing rowid markers, while repair apply mutates rows missing either the rowid marker or the dimension table row.

### F003 - P1 - operator docs use unsupported `dryRun:false` for memory_embedding_reconcile
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:341`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76`

The live schema and handler use `mode: "apply"`, but the install guide instructs `dryRun:false`.

### F004 - P2 - activeOnly is advertised but ignored
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:22`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:36`

The option is accepted in public surfaces but not read by the implementation.

## 4. Remediation Workstreams
1. Shared mutation cache invalidation: add entity-density invalidation to `runPostMutationHooks`, extend its result contract, and add update/delete regression coverage.
2. Reconcile coverage predicate parity: make dry-run success coverage use the same OR predicate as repair apply and update tests for dim-only missing rows.
3. Public command docs parity: replace `dryRun:false` examples for `memory_embedding_reconcile` with `mode:"apply"`.
4. Option cleanup: remove/deprecate `activeOnly` or implement explicit semantics.

## 5. Spec Seed
Add acceptance criteria:
- Post-mutation hooks invalidate entity-density cache for save, update, delete, bulk-delete, and atomic-save paths.
- `memory_embedding_reconcile` dry-run planned mutation counts must match apply mutation predicates for success coverage repair.
- Public docs and troubleshooting examples must use the live schema call shape.

## 6. Plan Seed
1. Patch `mutation-hooks.ts`, `memory-crud-types.ts`, feedback rendering, and hook wiring tests for entity-density invalidation.
2. Add integration tests proving `memory_update` and `memory_delete` clear entity-density without waiting for TTL.
3. Patch `computeSuccessCoverage` to check both rowid and dimension-table surfaces.
4. Update `vector-coverage-hygiene.vitest.ts` so rowid-present/dim-missing success rows count and repair consistently.
5. Update install guide reconcile examples and add a schema-doc parity test if practical.
6. Decide whether `activeOnly` remains a supported option.

## 7. Traceability Status
| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | partial | Scope was honored, but public docs drift from live reconcile schema. |
| `checklist_evidence` | pass/skipped | No checklist exists in this Level 1 slice. |
| `feature_catalog_code` | partial | Reconcile apply contract stale in docs. |
| `playbook_capability` | partial | Troubleshooting playbook gives unsupported call shape. |

## 8. Deferred Items
- F004 is advisory unless maintainers intended `activeOnly:false` to enable non-active shard reconciliation.
- Code Graph was unavailable; graphless fallback was used.
- No tests were run because this lineage is a read-only review and the active findings are evidence-based.

## 9. Audit Appendix
Iterations:
- 001 correctness: F001, F002
- 002 security: no findings
- 003 traceability: F003, F004
- 004 maintainability: no new findings; test gaps recorded
- 005 stabilization: no new findings

Replay:
- Dimension coverage: 100%
- Stabilization passes: 1
- Active P0: 0
- Active P1: 3
- Active P2: 1
- Final verdict: CONDITIONAL

Lineage note: the user requested `executor: cli-codex model=gpt-5.5`. The local `cli-codex` skill forbids nested Codex self-invocation, so this Codex runtime executed the lineage directly and recorded that constraint in the state packet.
