# Deep Review Report - MCP Core

## 1. Executive Summary

Final verdict: CONDITIONAL.

The lineage completed five review passes across correctness, security, traceability, maintainability, and stabilization. No P0 findings were found. Three P1 findings remain active, plus one P2 advisory. The slice is not ready for PASS until the P1s are fixed or explicitly accepted by the program owner.

Active counts:
- P0: 0
- P1: 3
- P2: 1
- hasAdvisories: true

Scope reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`

## 2. Planning Trigger

Route to remediation planning. The active P1s are behavior or operator-contract bugs:
- F001 can keep graph-channel routing stale after `memory_update` changes high-fanout title or trigger terms.
- F002 makes reconcile dry-run previews under-report the rows that apply will mutate.
- F003 gives operators an unsupported repair command for `memory_embedding_reconcile`.

## 3. Active Finding Registry

### F001 - P1 - memory_update leaves entity-density routing cache stale after title or trigger phrase changes
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:81`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97`

`memory_update` writes `title` and `trigger_phrases`, which are exactly the fields used to build the entity-density graph-preservation cache. The update path clears the general search cache and runs mutation hooks, but neither path invalidates entity-density. Save and bulk-delete have direct invalidation, and single delete invalidates through the lower-level delete helper; update is the remaining stale-cache gap.

### F002 - P1 - memory_embedding_reconcile dry-run under-reports success-coverage repairs for rows missing only the active dimension vector
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:356`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:82`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:87`

Dry-run success coverage counts only missing `vec_memories_rowids`; apply repair resets `success` rows missing either rowids or the active `vec_<dim>` row. A row with rowid present but active dimension vector absent can therefore be omitted from dry-run planned repairs and still be mutated by apply.

### F003 - P1 - operator docs tell users to run unsupported memory_embedding_reconcile({ dryRun: false })
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:653`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:75`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`

The live API uses `mode: "apply"` and strict validation rejects unknown parameters. The install guide and feature catalog still tell operators to pass `dryRun:false`, so the documented repair path fails or remains dry-run if validation is bypassed.

### F004 - P2 - memory_embedding_reconcile accepts activeOnly but never reads it
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:155`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:22`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:36`

The option is exposed in public schemas and request types, but the implementation never reads it. The handler always resolves and attaches the active shard.

## 4. Remediation Workstreams

1. Entity-density invalidation for update:
   Add `invalidateEntityDensityCache()` after successful `memory_update` changes to title or trigger phrases. Prefer wiring through `runPostMutationHooks()` so public feedback can report the cache clear consistently.

2. Reconcile dry-run/apply predicate parity:
   Change `computeSuccessCoverage()` to count success rows missing either rowid or active dimension table row. Add a regression for rowid-present/dim-missing success rows and assert dry-run planned rows match apply mutations.

3. Public docs/schema parity:
   Replace `dryRun:false` reconcile examples with `mode:"apply"` in the install guide and feature catalog. Align status/result wording with the current handler output.

4. `activeOnly` cleanup:
   Remove/deprecate the option or define and implement real behavior for `activeOnly:false`.

## 5. Spec Seed

Add acceptance criteria:
- `memory_update` invalidates entity-density cache immediately after title or trigger phrase mutation.
- `memory_embedding_reconcile` dry-run planned mutation counts match apply mutation predicates for `repairSuccessCoverage`.
- Public docs and feature catalog examples use the live `mode:"apply"` reconcile call shape.
- Public reconcile options are either implemented or removed.

## 6. Plan Seed

1. Expand mutation hook result types and feedback to include entity-density invalidation.
2. Wire `memory_update` through that invalidation path after successful mutation, with a targeted cache freshness test.
3. Patch `computeSuccessCoverage()` to use the OR predicate used by apply repair.
4. Add a dim-only missing success-coverage test.
5. Update install guide and feature catalog reconcile examples.
6. Decide whether `activeOnly` should be removed or implemented, then adjust schema/tests.

## 7. Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| `spec_code` | partial | Requested implementation scope was reviewed, but F001 and F002 show correctness drift. |
| `checklist_evidence` | pass/skipped | This Level 1 slice has no checklist. |
| `feature_catalog_code` | partial | F003 records stale reconcile mode wording in the feature catalog. |
| `playbook_capability` | partial | F003 records stale operator repair guidance in the install guide. |

## 8. Deferred Items

- No security findings were recorded.
- No live MCP mutations were run; this lineage is a read-only source audit with writes confined to the artifact directory.
- Code Graph was unavailable; direct `rg` and line-numbered source reads were used as graphless fallback evidence.
- Resource-map coverage gate was skipped because the target spec folder had no `resource-map.md` at initialization.

## 9. Audit Appendix

Iterations:
- 001 correctness: F001, F002.
- 002 security: no findings.
- 003 traceability: F003, F004.
- 004 maintainability: no new findings.
- 005 stabilization: no new findings.

Replay:
- Dimension coverage: 100%.
- Required traceability protocols: covered or explicitly skipped where not applicable.
- Stabilization passes: 1.
- Active P0: 0.
- Active P1: 3.
- Active P2: 1.
- Stop reason: `converged`.
- Final verdict: CONDITIONAL.

Lineage note: the user supplied `executor: cli-codex model=gpt-5.5`. The local `cli-codex` skill forbids nested Codex self-invocation, so this Codex runtime executed the lineage directly and recorded that constraint in the state packet.
