---
title: "Memory Runtime Phase 007: Success-Vector Coverage Hygiene"
description: "Detection and opt-in repair for success-status rows missing from an active vector surface, shipped as a repairSuccessCoverage flag on the memory_embedding_reconcile tool with four passing vitest scenarios and a live dry-run confirmation."
trigger_phrases:
  - "success vector coverage hygiene"
  - "success rows missing active vector"
  - "repairSuccessCoverage flag"
  - "vector coverage repair"
  - "missing vector success rows"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/007-success-vector-coverage-hygiene` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

Verification during the 005 reconcile pass found rows marked `embedding_status='success'` that were absent from the active vector surface. The 006 reconcile tool left these rows untouched by design, so the gap needed its own detection and repair path.

The fix shipped as an opt-in `repairSuccessCoverage` flag on the existing `memory_embedding_reconcile` tool rather than a new MCP surface. The result field `coverage.successMissingActiveVector` is always populated when the active shard is verified. When `repairSuccessCoverage: true` and `mode: apply`, detected rows are reset to `retry` so the retry-manager re-embeds them and regenerates the missing vector. A live dry-run confirmed `coverage.successMissingActiveVector=137` on the production store.

### Added

- `repairSuccessCoverage` opt-in flag on the `memory_embedding_reconcile` tool input schema
- `coverage.successMissingActiveVector` result field always reported when `activeShardVerified` is true
- `computeSuccessCoverage()` helper in `embedding-reconcile.ts` for detection query guarded by active-shard verification
- `mcp_server/tests/vector-coverage-hygiene.vitest.ts` (NEW) with four scenarios: detection (including partial coverage), opt-in repair, default-off no-op and idempotency

### Changed

- `memory_embedding_reconcile` apply transaction extended with an opt-in third UPDATE that resets detected rows to `retry` (`retry_count=0`, `failure_reason=NULL`) when `repairSuccessCoverage: true`
- Tool input types and schemas updated in `types.ts`, `tool-input-schemas.ts` and `tool-schemas.ts` to register the new flag

### Fixed

- `embedding_status='success'` rows absent from `active_vec.vec_memories_rowids` or `vec_<dim>` were invisible to semantic search and unreachable by any prior repair path. The new detection + reset path brings them back into the retry queue.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` (tsc) | Pass (exit 0, no TS errors) |
| Vitest: detection counts seeded missing-vector success row (including partial coverage) | Pass |
| Vitest: apply resets to `retry`, covered rows untouched, default-off no-op | Pass |
| Vitest: idempotency (second run finds 0) | Pass |
| Live dry-run via MCP tool | Pass (`coverage.successMissingActiveVector=137`) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/embedders/embedding-reconcile.ts` | Modified | Added `repairSuccessCoverage` arg, `coverage` result field, `computeSuccessCoverage()` helper and opt-in third UPDATE in the apply transaction |
| `mcp_server/tools/types.ts` | Modified | Registered `repairSuccessCoverage` on the reconcile tool input type |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Added `repairSuccessCoverage` field to the reconcile tool input schema |
| `mcp_server/tool-schemas.ts` | Modified | Registered `repairSuccessCoverage` in the public tool schema definition |
| `mcp_server/tests/vector-coverage-hygiene.vitest.ts` | Created (NEW) | Four vitest scenarios covering detection, repair, default-off and idempotency |

### Follow-Ups

- Confirm the retry-manager drain is active after deployment so reset rows converge back to `success` status.
- Monitor `coverage.successMissingActiveVector` count on subsequent runs to verify the repair path reduces the ~137-row backlog to zero.
