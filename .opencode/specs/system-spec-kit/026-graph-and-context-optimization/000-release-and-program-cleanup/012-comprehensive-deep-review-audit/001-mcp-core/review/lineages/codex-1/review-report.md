# Deep Review Report - MCP Core Lineage codex-1

## 1. Executive Summary

Final verdict: CONDITIONAL.

The lineage completed five passes across correctness, security, traceability, maintainability, and stabilization. No P0 findings were found. Three P1 findings remain active, plus one P2 advisory. The slice is not ready for a PASS verdict until the P1s are remediated or explicitly accepted by the program owner.

Active counts:

- P0: 0
- P1: 3
- P2: 1
- hasAdvisories: true

Scope covered:

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

- F001 can keep graph-channel routing stale for update/delete mutations until the entity-density TTL expires.
- F002 makes reconcile dry-run under-report planned success-coverage repairs compared with apply.
- F003 gives operators an unsupported repair command for degraded vector state.

## 3. Active Finding Registry

### F001 - P1 - `memory_update` and `memory_delete` leave entity-density cache stale

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:244`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:136`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159`

The shared post-mutation hook does not import or call `invalidateEntityDensityCache()`, and its result contract has no entity-density lane. `memory_update` and `memory_delete` call only that hook after successful mutations. Because entity-density caches high-degree memory title and trigger tokens, updated or deleted rows can continue affecting routing until the TTL expires.

### F002 - P1 - Reconcile dry-run undercounts success-coverage repairs

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:356`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84`

Dry-run success coverage counts only rows missing `vec_memories_rowids`. Apply mode, when `repairSuccessCoverage` is enabled, resets `success` rows missing either `vec_memories_rowids` or the active dimension table row. A rowid-present/dimension-missing success row is therefore omitted from dry-run planned mutations but mutated by apply.

### F003 - P1 - Operator docs use unsupported `dryRun:false`

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:341`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19`

The install guide and feature catalog document `dryRun:false`, but the live tool contract exposes `mode: "dry-run" | "apply"` and the handler enters apply mode only when `args.mode === "apply"`. The troubleshooting command in the install guide therefore does not match the live schema.

### F004 - P2 - `activeOnly` is advertised but ignored

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:308`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`

`activeOnly` is accepted in public schema and TypeScript surfaces, but `runMemoryEmbeddingReconcile()` never reads it. Passing the option has no observable effect.

## 4. Remediation Workstreams

1. Shared mutation cache invalidation: add entity-density invalidation to the update/delete post-mutation path, preferably through `runPostMutationHooks()`, then extend the hook result/feedback contract.
2. Reconcile coverage predicate parity: make dry-run success coverage use the same rowid-or-dimension absence predicate as apply, or intentionally narrow apply and document the invariant.
3. Public reconcile contract cleanup: replace `dryRun:false` examples with `mode:"apply"` and align feature catalog wording with the live result shape.
4. Option cleanup: remove/deprecate `activeOnly`, or implement explicit semantics and tests for `activeOnly:false`.

## 5. Spec Seed

Add acceptance criteria:

- Post-mutation hooks or mutation handlers invalidate entity-density cache after save, update, delete, bulk-delete, and atomic-save commits that affect memory rows or causal-edge-derived density.
- `memory_embedding_reconcile({ mode:"dry-run", repairSuccessCoverage:true })` planned mutation counts match `mode:"apply"` mutation predicates for success-coverage repair.
- Public docs and feature catalog entries use the live reconcile schema call shape.
- Every public reconcile option has observable implementation semantics or is removed from the schema.

## 6. Plan Seed

1. Patch entity-density invalidation for `memory_update` and `memory_delete`.
2. Add regression tests proving update/delete refresh entity-density without waiting for TTL.
3. Patch `computeSuccessCoverage()` to count rows missing either active vector surface.
4. Add a Vitest case for a `success` row with rowid present but active dimension row absent.
5. Update install guide and feature catalog examples from `dryRun:false` to `mode:"apply"`.
6. Decide whether `activeOnly` remains supported, then either implement it or remove it from schema/type/docs.

## 7. Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Target scope was reviewed; active implementation defects remain. |
| checklist_evidence | pass/skipped | Level 1 slice has no `checklist.md`; no checked items required evidence. |
| feature_catalog_code | partial | Feature catalog reconcile mode wording is stale. |
| playbook_capability | partial | Install guide troubleshooting command uses unsupported `dryRun:false`. |

## 8. Deferred Items

- F004 is advisory unless maintainers intended `activeOnly:false` to select non-active shards or skip active-shard enforcement.
- Live MCP invocation was deferred because this fan-out lineage was constrained to write only inside its artifact directory.
- No test command was run for the same reason; findings are source-audit evidence.
- Code Graph was unavailable; graphless fallback used direct source reads and `rg`.

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

- convergenceGate: pass
- dimensionCoverageGate: pass
- p0ResolutionGate: pass
- evidenceDensityGate: pass
- hotspotSaturationGate: pass
- claimAdjudicationGate: pass
- fixCompletenessReplayGate: pass
- candidateCoverageGate: pass
- graphlessFallbackGate: pass

Replay:

- Dimension coverage: 100%
- Stabilization passes: 1
- Active P0: 0
- Active P1: 3
- Active P2: 1
- Final verdict: CONDITIONAL
- Stop reason: converged

Lineage note: the user requested `executor: cli-codex model=gpt-5.5`. The local `cli-codex` skill forbids nested Codex self-invocation, so this Codex runtime executed the lineage directly and recorded that constraint in the state packet.
