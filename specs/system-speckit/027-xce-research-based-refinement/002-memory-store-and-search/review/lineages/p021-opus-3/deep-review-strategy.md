# Deep Review Strategy — 021-cooperative-heavy-phases (lineage p021-opus-3)

## Topic

Review the 021 packet "cooperative heavy phases keep the daemon responsive": scan event-loop lag
instrumentation, the chunked/cancellable trigger-embedding-backfill, and the per-tail-phase
maintenance-marker refresh. Single-iteration fan-out lineage (executor cli-claude-code,
model claude-opus-4-8, maxIterations=1).

## Review Dimensions

- [x] Correctness (logic, transaction safety, cancel/yield boundaries, timer lifecycle)
- [x] Security (no new trust boundary; observation-only; default-off flag)
- [x] Traceability (spec_code, checklist_evidence; REQ-001..004 vs shipped code)
- [x] Maintainability (comment hygiene, test coverage, dead code)

Single iteration covers all four dimensions in breadth (maxIterations=1).

## Files Under Review

| File | Role | Change |
|------|------|--------|
| `mcp_server/handlers/memory-index.ts` | Scan orchestrator | Event-loop lag sampler, `timedPhase` wrapper (timing + marker refresh), `isCancelled` threaded into both trigger-backfill call sites |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Trigger phrase sync | Whole-corpus transaction → `syncPhraseChunk` 200-row chunks with between-chunk yields; `isCancelled?` option; cache-hit-path yield; `cancelled` status |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Unit tests | cancel-immediate, cancel-at-chunk-boundary, cooperative-yield cases |

Authoritative diff: commit `372bb0f2cd`.

## Cross-Reference Status

### Core (hard)
- `spec_code`: REQ-001..004 vs `memory-index.ts` + `trigger-embedding-backfill.ts` — executed.
- `checklist_evidence`: Level 1 packet, no `checklist.md`; tasks.md T001-T012 completion vs code/summary — executed against tasks.md.

### Overlay (advisory)
- `feature_catalog_code`: N/A — internal daemon hardening, no feature-catalog claims.
- `playbook_capability`: N/A — no playbook scenarios for this packet.

## Known Context

- Predecessors 018 (cooperative yields), 019 (maintenance marker + 180s TTL), 020 (marker on post-scan embedding queue). 021 closes 020's "un-reaped ≠ responsive" gap.
- `resource-map.md` not present. Skipping coverage gate.
- `dist/` compiled output already reflects all three source changes (`timedPhase`, `isCancelled`, `cancelled`), corroborating a clean `tsc --build`.

## Review Boundaries

### Non-Goals
- Re-running the live single-launcher deploy-time lag read (SC-002) — explicitly deferred to deploy.
- Launcher `.cjs` adopt/reap logic — investigated by the packet and confirmed unchanged; not re-derived here beyond the documented contract.

### Stop Conditions
- maxIterations=1 (fan-out single pass). Stop after one full-coverage iteration.
