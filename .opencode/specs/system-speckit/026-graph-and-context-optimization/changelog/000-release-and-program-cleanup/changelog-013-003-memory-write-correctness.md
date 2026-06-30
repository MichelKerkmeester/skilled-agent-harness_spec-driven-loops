---
title: "013/003 Memory Write Correctness"
description: "Entity-density routing now reflects memory_update mutations immediately and atomic-save uuid-suffixed orphan recovery is regression-protected."
trigger_phrases:
  - "013/003 memory write correctness"
  - "entity density invalidation changelog"
  - "mutation hook entity density"
  - "atomic save orphan recovery"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation`

### Summary

Memory metadata mutations now refresh entity-density routing immediately. The shared post-mutation hook clears entity-density cache alongside the existing trigger, tool, constitutional, graph-signal, degree and co-activation caches, so `memory_update`, atomic-save, delete and bulk-delete stay covered through one fan-in point. The atomic-save crash recovery path for uuid-suffixed pending-file orphans now has a regression test.

### Added

- Optional `entityDensityCacheCleared` on `MutationHookResult`, allowing the shared hook to record the new invalidation without forcing every caller and fallback literal to change
- Integration test coverage for `memory_update` trigger-phrase rewrites invalidating entity-density routing without waiting for TTL
- Transaction-manager recovery coverage for a `*_pending.md.<uuid8>` orphan with no original file

### Changed

- `runPostMutationHooks` now imports and calls `invalidateEntityDensityCache` in the shared post-commit hook

### Fixed

- `memory_update` no longer serves stale entity-density routing tokens for up to 60 seconds after title or trigger phrase edits
- Atomic-save startup recovery for uuid-suffixed pending-file orphans is now pinned by an end-to-end regression case

### Verification

- Optional-field typecheck safety review across five fallback literals: PASS
- Import path `../lib/search/entity-density.js` from handlers: PASS by inspection against existing style
- Update-path test logic: PASS by inspection, designed to fail without the hook wiring
- Orphan-recovery test logic: PASS by inspection against `parsePendingPath` behavior
- `mcp_server` typecheck and vitest: DEFERRED to central because peer edits were active in the same package

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Modified | Entity-density invalidation in the shared hook |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Modified | Optional `entityDensityCacheCleared` field |
| `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` | Modified | `memory_update` trigger-phrase rewrite case |
| `.opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts` | Modified | uuid-suffixed orphan-recovery case |

### Follow-Ups

- The non-atomic quality-loop finalize write in `memory-save.ts` remains outside the pending/recovery mechanism and outside this phase scope.
- `buildMutationHookFeedback` does not yet echo `entityDensityCacheCleared`. The result records the flag but the feedback envelope does not surface it.
