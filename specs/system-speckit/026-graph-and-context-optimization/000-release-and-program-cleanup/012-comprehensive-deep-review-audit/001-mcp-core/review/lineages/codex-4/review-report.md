# Deep Review Report - codex-4

## 1. Executive Summary

Final verdict: CONDITIONAL.

The lineage completed five review passes across correctness, security, traceability, maintainability, and stabilization. No P0 findings were found. Three P1 findings remain active, plus one P2 advisory. Release PASS should wait until the P1s are fixed or consciously accepted by the program owner.

Active counts:

| Severity | Count |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 1 |

`hasAdvisories`: true.

Scope covered the target mutation, save, reconcile, and entity-density files from the spec, plus supporting schema/docs/test surfaces needed to prove traceability drift.

## 2. Planning Trigger

Route to remediation planning.

The release-blocking work is not speculative:

- F001 affects graph-channel routing freshness after `memory_update`.
- F002 makes reconcile dry-run previews under-report what apply will mutate.
- F003 gives operators a repair command shape the live tool does not support.

## 3. Active Finding Registry

### F001 - P1 - memory_update leaves entity-density cache stale after title or trigger phrase changes

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:92`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:494`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:81`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:96`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:112`

`memory_update` can change the fields that feed entity-density routing, but the update path clears only the generic search cache and relies on a shared hook that does not invalidate entity-density. The stale window lasts until the 60s TTL or a separate invalidation.

### F002 - P1 - repairSuccessCoverage dry-run undercounts success rows missing only the active dimension vector

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:285`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:420`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:89`

Dry-run success coverage counts only missing rowid markers, while apply repair mutates success rows missing either rowid or active dimension-vector rows. Planned mutation counts can therefore be lower than apply mutations.

### F003 - P1 - operator docs still instruct unsupported dryRun:false for memory_embedding_reconcile apply mode

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76`

The docs say to use `dryRun:false`; the live tool uses `mode:"apply"`. With strict schemas the documented command is rejected. If an unknown field passes through, the handler still defaults to dry-run.

### F004 - P2 - activeOnly is exposed as an option but has no implementation branch

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:308`
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:155`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:302`

The option is public but unread. The current default behavior is safe, so this is advisory contract cleanup rather than a required behavior fix.

## 4. Remediation Workstreams

1. Shared mutation freshness.
   Add entity-density invalidation to `memory_update`, preferably via `runPostMutationHooks`. Extend the hook result and feedback payload, then cover `memory_update` with an entity-density freshness regression.

2. Reconcile predicate parity.
   Make `computeSuccessCoverage()` use the same OR predicate as the repair SQL. Add a test for a `success` row with `vec_memories_rowids` present and the active `vec_<dim>` row absent.

3. Operator contract cleanup.
   Replace `dryRun:false` examples with `mode:"apply"` in install-guide and feature-catalog surfaces. Align catalog wording with current result fields.

4. Public option cleanup.
   Remove/deprecate `activeOnly`, or implement explicit semantics and test them.

## 5. Spec Seed

Add acceptance criteria:

- `memory_update` invalidates entity-density cache whenever title, trigger phrases, or other entity-density source fields change.
- `memory_embedding_reconcile({ mode:"dry-run", repairSuccessCoverage:true })` reports every row that `mode:"apply"` would reset for success-coverage repair.
- Operator docs and feature catalog examples use the live reconcile apply shape: `mode:"apply"`.
- Public reconcile options either have implemented behavior or are absent from public schemas.

## 6. Plan Seed

1. Patch `runPostMutationHooks` or `memory_update` to call `invalidateEntityDensityCache()` after successful update mutations.
2. Extend `MutationHookResult` and mutation feedback if the invalidation moves into the shared hook.
3. Add/update tests proving `memory_update` refreshes entity-density without waiting for TTL.
4. Patch `computeSuccessCoverage()` to match the apply repair OR predicate.
5. Extend `vector-coverage-hygiene.vitest.ts` with a rowid-present/dimension-missing success row.
6. Replace stale `dryRun:false` docs and feature-catalog wording with `mode:"apply"`.
7. Decide whether to remove or implement `activeOnly`.

## 7. Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| `spec_code` | partial | Scope was honored, but implementation drift remains in update cache invalidation and reconcile dry-run/apply parity. |
| `checklist_evidence` | not applicable | The target slice is Level 1 and has no `checklist.md`. |
| `feature_catalog_code` | partial | Feature catalog still describes `dryRun:false` and stale reconcile result fields. |
| `playbook_capability` | partial | Install-guide troubleshooting gives an unsupported repair command shape. |

## 8. Deferred Items

- F004 is advisory unless maintainers intended `activeOnly:false` to expose a non-active-shard mode.
- Code Graph was unavailable; graphless fallback used direct source reads and `rg`.
- No live MCP mutation commands were run. This lineage stayed read-only for reviewed files and wrote only lineage artifacts.

## 9. Audit Appendix

Iterations:

| Run | Dimension | New P0 | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---|
| 1 | correctness | 0 | 2 | 0 | CONDITIONAL |
| 2 | security | 0 | 0 | 0 | PASS |
| 3 | traceability | 0 | 1 | 1 | CONDITIONAL |
| 4 | maintainability | 0 | 0 | 0 | PASS |
| 5 | stabilization | 0 | 0 | 0 | PASS |

Legal-stop gates:

| Gate | Status |
|---|---|
| convergenceGate | pass |
| dimensionCoverageGate | pass |
| p0ResolutionGate | pass |
| evidenceDensityGate | pass |
| hotspotSaturationGate | pass |
| claimAdjudicationGate | pass |
| fixCompletenessReplayGate | pass |
| candidateCoverageGate | pass |
| graphlessFallbackGate | pass |

Replay:

- Dimension coverage: 100%.
- Stabilization passes: 1.
- Active P0: 0.
- Active P1: 3.
- Active P2: 1.
- Stop reason: converged.
- Final verdict: CONDITIONAL.

Lineage note: the requested executor was `cli-codex model=gpt-5.5`; the local `cli-codex` skill forbids nested Codex self-invocation, so this Codex runtime executed the lineage directly and recorded that constraint in the state packet.
