# Deep Review Strategy — p020-opus-3

**Target:** `020-maintenance-grace-background-embedding`
**Lineage:** fan-out p020-opus-3 · **Executor:** cli-claude-code model=claude-opus-4-8 · **maxIterations:** 1

## Files Under Review

| File | Type | Reviewed |
|------|------|----------|
| `mcp_server/lib/storage/maintenance-marker.ts` | new module | ✓ |
| `mcp_server/handlers/memory-index.ts` (scan IIFE ~1488-1554) | modify | ✓ |
| `mcp_server/lib/providers/retry-manager.ts` (`runBackgroundJob` ~1012-1062) | modify | ✓ |
| `mcp_server/tests/maintenance-marker.vitest.ts` | new test | ✓ |
| `mcp_server/lib/storage/transaction-manager.ts:177` (`atomicWriteFile`, read for verification) | dependency | ✓ |
| `mcp_server/core/config.ts:97` (`DATABASE_DIR` binding, read for verification) | dependency | ✓ |

## Cross-Reference Status

### Core protocols
- `spec_code` (spec ↔ implementation): EXECUTED — REQ-001..004 all trace to code; scope table matches touched files.
- `checklist_evidence` (verification claims ↔ artifacts): EXECUTED — verification rows plausible and self-consistent; build/suite re-run out of read-only TCB; live reindex is deploy-time (SC-002).

### Overlay protocols
- Resource Map Coverage: N/A — `{spec_folder}/resource-map.md` absent at init (`resource_map_present: false`); coverage gate skipped per protocol.

## Known Context
- 019 protected only the scan; the scan defers embeddings (`asyncEmbedding`) so the real vector writes run in the post-scan embedding queue, which was unprotected. This phase widens *who* writes the marker; the 019 launcher adopt/reap guard is unchanged and out of scope.
- `atomicWriteFile` swallows fs errors and returns `false` (does not throw) — central to refuting the reference-count-leak hypothesis.
- `DATABASE_DIR` is a live `export let` binding reassigned by `resolveDatabasePaths()` — makes the vitest redirect sound.
- resource-map.md not present. Skipping coverage gate.

## Findings Summary
- P0: 0 · P1: 0 · P2: 2 (one robustness advisory, one by-design cosmetic)

## Dimension Coverage
- D1 Correctness: COVERED
- D2 Security: COVERED
- D3 Traceability: COVERED
- D4 Maintainability: COVERED

## Next Focus
None. All 4 dimensions covered in iteration-001; maxIterations=1 reached. Converged to PASS with advisories.

## Review Boundaries
- Read-only. No code under review was modified.
- Out of scope: 019 launcher-side adopt/reap guard, marker schema/TTL/dir-resolution, full live end-to-end reindex (deploy-time check).
