---
title: "Write Path Reconciliation: Statediff Subscriber Layer"
description: "Spec Kit Memory gained an explicit statediff layer for write-path planning and post-mutation subscribers. Handlers pass durable row actions to subscribers for cache and hygiene effects after making their own policy decisions. No schema change. Existing storage mutation functions remain the source of durable writes."
trigger_phrases:
  - "write path reconciliation"
  - "statediff subscriber layer"
  - "mutation hooks action batches"
  - "027 002/002 004 changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle`

### Summary

Spec Kit Memory now has an explicit statediff layer for write-path planning and post-mutation subscribers. The layer does not decide semantic policy; handlers still make policy decisions first, then pass durable row actions to subscribers for cache and hygiene effects. `lib/storage/statediff.ts` defines target rows, insert/upsert/replace/delete actions, composite parent-child targets, and subscriber interfaces with deterministic target sorting and safe incomplete-prior handling via upsert. `mutation-hooks.ts` was converted from direct cache invalidation calls to action-aware subscribers: trigger, tool, constitutional, graph, degree, and coactivation caches subscribe fail-safe to any non-empty applied action batch. Entity-density subscribes to memory and graph actions. Graph and coactivation clears are not gated on graph-targeted actions because batches are an advisory aid that under-reports cascaded causal-edge deletes. Four handlers gained explicit action-batch wiring: `memory-index.ts` builds a scan action plan before write batches; `memory-save.ts` routes enrichment and atomic-save cache effects through subscribers; `save/response-builder.ts` routes normal save cache effects; and `memory-bulk-delete.ts` emits delete action batches and removes inline entity-density invalidation.

### Added

- `lib/storage/statediff.ts`: deterministic statediff planning module with target rows, action variants, composite targets, sink interfaces, and subscriber interfaces
- `mcp_server/tests/statediff.vitest.ts`: action variants, deterministic ordering, incomplete prior, composite targets, and sink application coverage
- `mcp_server/tests/mutation-hooks-statediff.vitest.ts`: fail-safe subscriber dispatch for memory-index and causal-edge action batches
- `mcp_server/tests/write-path-reconciliation.vitest.ts`: scan plan-before-write and handler action-batch wiring guards

### Changed

- `handlers/mutation-hooks.ts`: converted post-mutation cache work into action-aware subscribers with fail-safe dispatch
- `handlers/memory-crud-types.ts`: mutation hook result metadata extended with action counts and subscriber reports
- `hooks/mutation-feedback.ts`: reports subscriber-based mutation feedback while preserving legacy response fields
- `handlers/memory-index.ts`: scan plan-before-write logging added; action-batch subscriber dispatch wired after successful mutations
- `handlers/memory-save.ts`: enrichment and atomic-save cache effects routed through statediff action subscribers
- `handlers/save/response-builder.ts`: normal save cache effects routed through statediff action subscribers
- `handlers/memory-bulk-delete.ts`: emits delete action batches for successful bulk deletes; inline entity-density invalidation removed
- `tests/memory-save-dedup-order.vitest.ts`: enrichment ordering regression updated for subscriber dispatch

### Fixed

- Inline entity-density invalidation in `memory-save.ts` and `memory-bulk-delete.ts` was replaced with explicit subscriber wiring, removing the implicit coupling between handler logic and cache state.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS: `tsc --build && node scripts/finalize-dist.mjs` exited 0 |
| Focused Vitest suites (9 files, 66 tests) | PASS |
| Comment hygiene check | PASS: modified TypeScript files produced no output |
| `validate.sh ... --strict` | PASS: strict validation exited 0 |
| Alignment drift checker | FAIL outside scope: `canonical-fingerprint.ts` and `memo.ts` still lack module headers from prior phases |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/storage/statediff.ts` | Created | Deterministic statediff planning, composite targets, sink and subscriber interfaces |
| `mcp_server/handlers/mutation-hooks.ts` | Modified | Post-mutation cache work converted to action-aware fail-safe subscribers |
| `mcp_server/handlers/memory-crud-types.ts` | Modified | Mutation hook result metadata extended with action counts and subscriber reports |
| `mcp_server/hooks/mutation-feedback.ts` | Modified | Subscriber-based feedback reporting with legacy field preservation |
| `mcp_server/handlers/memory-index.ts` | Modified | Scan plan-before-write logging and action-batch subscriber dispatch |
| `mcp_server/handlers/memory-save.ts` | Modified | Enrichment and atomic-save cache effects through statediff action subscribers |
| `mcp_server/handlers/save/response-builder.ts` | Modified | Normal save cache effects through statediff action subscribers |
| `mcp_server/handlers/memory-bulk-delete.ts` | Modified | Delete action batches emitted; inline entity-density invalidation removed |
| `mcp_server/tests/statediff.vitest.ts` | Created | Action variants, deterministic ordering, composite target, and sink coverage |
| `mcp_server/tests/mutation-hooks-statediff.vitest.ts` | Created | Fail-safe subscriber dispatch coverage |
| `mcp_server/tests/write-path-reconciliation.vitest.ts` | Created | Scan plan-before-write and handler wiring guards |
| `mcp_server/tests/memory-save-dedup-order.vitest.ts` | Modified | Enrichment ordering regression updated for subscriber dispatch |

### Follow-Ups

- Existing lower-level mutation helpers still perform some best-effort cache invalidation for legacy callers. The handler-level inline invalidations requested for this phase were removed; remaining lower-level callsites are candidates for a follow-on cleanup sweep.
- Two pre-existing module-header defects in `canonical-fingerprint.ts` and `memo.ts` remain outside this phase's allowed write scope.
