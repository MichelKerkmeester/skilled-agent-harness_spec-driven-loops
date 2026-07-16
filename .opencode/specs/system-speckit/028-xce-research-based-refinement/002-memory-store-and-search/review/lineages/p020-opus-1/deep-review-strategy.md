# Deep Review Strategy — p020-opus-1

## Topic

Release-readiness review of spec-folder `020-maintenance-grace-background-embedding`: extracting the maintenance-marker writer into a shared, reference-counted module and wiring the post-scan background-embedding queue into it so a reindex survives launcher re-election end to end (not just during the scan).

## Review Dimensions

- [x] D1 Correctness — reference-count lifecycle, TTL/refresh, idle-tick guard, overlap semantics
- [x] D2 Security — marker file contents, input trust, path handling
- [x] D3 Traceability — REQ-001..004, SC-001/SC-002, scope fidelity vs shipped code
- [x] D4 Maintainability — clarity, comment hygiene, leak bounds, forward-compat

## Files Under Review

| File | Role |
|------|------|
| `mcp_server/lib/storage/maintenance-marker.ts` | New shared reference-counted marker module |
| `mcp_server/handlers/memory-index.ts` (scan IIFE ~1496-1543) | Scan refactored onto shared module |
| `mcp_server/lib/providers/retry-manager.ts` (`runBackgroundJob` ~1012-1062) | Embedding queue wired into module |
| `mcp_server/tests/maintenance-marker.vitest.ts` | Unit test for ref-counted lifecycle |
| `core/config.ts` (DATABASE_DIR / resolveDatabasePaths) | Live-binding assumption used by test |
| `lib/storage/transaction-manager.ts` (atomicWriteFile) | Marker write primitive |

## Cross-Reference Status

| Protocol | Class | Status |
|----------|-------|--------|
| `spec_code` | core / hard | pass — REQ-001..004 + scope all resolve to shipped behavior |
| `checklist_evidence` | core / hard | n/a — Level 1, no checklist.md; tasks.md completion claims verified against code |
| `feature_catalog_code` | overlay / advisory | n/a — no catalog entry in scope |
| `playbook_capability` | overlay / advisory | n/a — no playbook in scope |

## Known Context

- Level 1 spec folder; LOC delta is small and well-scoped (one new module + two surgical wirings + one unit test).
- `resource-map.md` not present. Skipping coverage gate.
- Predecessor 019 launcher adopt/reap guard is explicitly out of scope and unchanged.
- Deploy-time live reindex survival (SC-002) is a deploy check, not a code deliverable; impl-summary records it PASS as deploy verification.

## Review Boundaries

- Read-only. Target files never modified.
- Single iteration (maxIterations=1, fan-out lineage); all 4 dimensions covered in one pass given the small blast radius.

## Non-Goals

- Re-running the live deploy reindex.
- Reviewing 019's launcher-side guard internals (out of scope).

## Stop Conditions

- maxIterations=1 reached after one full-coverage pass.

## Next Focus

- Complete (synthesis).
