# Deep Review Strategy

## Topic

Review of spec 019-maintenance-grace-daemon-survives-reelection: the daemon writes a refreshed `.maintenance-active.json` marker during background scans, and the launcher adopts a busy-but-healthy daemon instead of reaping it.

## Review Dimensions

- [x] D1: Correctness (iteration 1)
- [ ] D2: Security
- [x] D3: Traceability (iteration 1, partial)
- [ ] D4: Maintainability

## Files Under Review

| File | Status | Notes |
|------|--------|-------|
| `mcp_server/lib/storage/maintenance-marker.ts` | reviewed | Core marker writer, reference-counted, clean design |
| `mcp_server/handlers/memory-index.ts:1502-1541` | reviewed | Background scan IIFE calls beginMaintenance with finally cleanup |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | reviewed | Unit tests for predicate via launcher require |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | reviewed | Isolated harness adopt + stale-marker cases |

### Spec-Declared Files Not Found in Codebase

| File | Status |
|------|--------|
| `mcp_server/bin/lib/model-server-supervision.cjs` | NOT FOUND (P1-002) |
| `mcp_server/bin/mk-spec-memory-launcher.cjs` | NOT FOUND (P1-002) |

## Cross-Reference Status

### Core Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | partial | Marker writer exists; spec-code field mismatch (labels vs jobId); launcher guard files absent |
| `checklist_evidence` | N/A | No checklist.md in this Level 1 spec |

## Findings

| ID | Severity | Category | Summary |
|----|----------|----------|---------|
| P1-001 | P1 | traceability | Spec declares jobId field but implementation writes labels array |
| P1-002 | P1 | traceability | Launcher guard implementation files not found in codebase |
| P2-001 | P2 | correctness | writeMarker has no error handling around atomicWriteFile |
| P2-002 | P2 | maintainability | Module-level mutable state prevents concurrent test isolation |
| P2-003 | P2 | traceability | Spec says 60s TTL but implementation uses 180s |

## Known Context

- The spec is Level 1, completed, with implementation-summary.md claiming full shipment.
- `maintenance-marker.ts` uses reference counting (`activeCount`) allowing overlapping maintenance sources.
- TTL is 180s (raised from 60s after live testing showed ~79s blocking phases).
- The launcher and supervision `.cjs` files referenced in the spec are absent from the current codebase.
- Live verification passed: a full reindex completed in 330s without daemon reaping.

## Review Boundaries

- In scope: spec docs, maintenance-marker.ts, memory-index.ts integration, test files
- Out of scope: 018 cooperative yield work, embedding queue changes

## Provisional Verdict

**CONDITIONAL** — 2 P1 findings (spec-code drift), 3 P2 advisories. No P0 findings. Core runtime logic is sound.
