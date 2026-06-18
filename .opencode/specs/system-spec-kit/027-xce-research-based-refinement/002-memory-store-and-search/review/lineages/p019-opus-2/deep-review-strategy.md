# Deep Review Strategy — 019-maintenance-grace-daemon-survives-reelection

## Topic
Release-readiness review of the maintenance-grace fix: the daemon writes a refreshed `.maintenance-active.json` marker during background maintenance so a competing launcher adopts a busy-but-healthy daemon instead of reaping it mid-scan. Lineage `p019-opus-2` (fan-out, executor cli-claude-code model=claude-opus-4-8, `maxIterations=1`).

## Review Dimensions
- [x] D1 Correctness — marker write/refresh/cleanup, reference-count lifecycle, fail-safe predicate
- [x] D2 Security — marker trust boundary, foreign-pid pin, DB-dir boundary check
- [x] D3 Traceability — spec/plan/tasks/impl-summary vs shipped code (spec_code hard gate)
- [x] D4 Maintainability — test fixtures, doc accuracy, follow-on clarity

## Files Under Review
| File | Role | Result |
|------|------|--------|
| `mcp_server/lib/storage/maintenance-marker.ts` | Reference-counted marker module (NOT in spec table) | Correct; source of F001 drift |
| `mcp_server/handlers/memory-index.ts:1496-1543` | Scan IIFE marker usage | Correct (write/refresh/finally) |
| `mcp_server/lib/providers/retry-manager.ts:1012-1062` | Embedding-queue marker usage (NOT in spec table) | Correct; source of F002 |
| `.opencode/bin/lib/model-server-supervision.cjs:609-640` | Pure adopt predicate | Correct, fail-safe |
| `.opencode/bin/mk-spec-memory-launcher.cjs:329-333,820-825,1688-1694` | Marker-dir resolver + both guard sites | Correct |
| `mcp_server/core/config.ts:63-107` | Daemon DATABASE_DIR resolution | Parity with launcher confirmed (REQ-004) |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Predicate unit test | Passes; fixture stale (F004) |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Isolated harness | Present; adopt + negative-control scope confirmed |

## Cross-Reference Status
### Core (hard gate)
- `spec_code` — **partial**: REQ-001..004 implemented and working; Files-to-Change table does not resolve to shipped files (F001), TTL drift (F003), stale limitation (F002).
- `checklist_evidence` — **skipped (n/a)**: Level 1 spec, no checklist.md required.

### Overlay (advisory)
- None applicable to a spec-folder target of this shape.

## Known Context
- `resource-map.md` not present. Skipping coverage gate.
- Sibling lineage `p019-deepseek-1` independently flagged the `.cjs` path drift (its F001) and the stale embedding-queue limitation (its F002) and the TTL divergence (its F003); this lineage reaches the same structural conclusion via independent code reading and additionally identifies the unlisted `maintenance-marker.ts` module extraction and the `jobId`→`labels` marker-field rename.
- Implementation-summary claims a full live force-reindex completed in 330s with the daemon surviving contention — this is an operator-run live check, not re-verifiable from static review; treated as inferred.

## Review Boundaries
### Non-Goals
- Re-running the live end-to-end reindex (operator/deploy-time check).
- Modifying any target file (review is observation-only).
- Re-litigating the 018 cooperative-yield work (out of scope per spec §3).

### Stop Conditions
- `maxIterations=1` reached after one full-coverage pass (all 4 dimensions). STOP → synthesis.

## Next Focus
Loop exhausted at `maxIterations=1`. Follow-on (if extended): quantify the between-tick embedding-drain unprotected window (F002), doc-resync pass for F001/F003/F004.
