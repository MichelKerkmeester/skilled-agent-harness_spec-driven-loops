# Deep Review Strategy: 021-cooperative-heavy-phases

## Topic
Release-readiness review of packet 021 ("cooperative heavy phases keep the daemon responsive"): scan event-loop lag instrumentation, trigger-embedding-backfill chunk-and-yield + cancellation, and per-tail-phase maintenance-marker refresh in the spec-memory MCP daemon.

## Review Dimensions
- [x] Correctness — logic, cancel semantics, transaction boundaries, lag-sampler math
- [x] Security — no new trust boundaries; logging surface
- [x] Traceability — REQ-001..004 vs shipped code; checklist/AC evidence
- [x] Maintainability — DRY, comment hygiene, claim accuracy

(All four covered in iteration 001; single-iteration fan-out lineage, maxIterations=1.)

## Completed Dimensions
- correctness — CONDITIONAL (1×P1, 2×P2)
- security — PASS (no findings)
- traceability — CONDITIONAL (P1 is a spec_code/AC gap on the `files.length === 0` path)
- maintainability — PASS-with-advisories (1×P2)

## Running Findings
- P0: 0
- P1: 1 (F001 — REQ-001/REQ-003 coverage gap on the empty-files scan path)
- P2: 3 (F002 foreground "byte-identical" claim; F003 pendingRemaining stale on cancel; F004 duplicated isCancelled thunk)
- Delta vs prior: n/a (first iteration)

## What Worked
- Git-diff-first read of commit 372bb0f2cd isolated the exact change surface (3 files).
- Reading both `runTriggerEmbeddingBackfill` call sites surfaced the un-timed empty-files path that prose/diff reading alone hid.
- Tracing `onPhase` to its single wiring point (memory-index.ts:1507-1512 → `maintenance.refresh()`) confirmed the marker-refresh mechanism and exactly which path it does/doesn't cover.

## What Failed
- (none)

## Exhausted Approaches
- (none)

## Ruled-Out Directions
- Security deep-dive on the embedding/transaction path: no new external input, no credential handling, hashing unchanged. Ruled out after one pass.
- Re-running the full vitest suite: the packet's own limitations note warns repeated daemon cold-spawns churn the live daemon; test-pass is corroborated by the test file inspection + implementation-summary evidence rather than a re-run in this lineage.

## Next Focus
None — converged for this lineage at maxIterations=1. Follow-up: decide F001 (wrap the empty-files tail phases in `timedPhase`, or downgrade with a proof the empty path is always sub-TTL and per-phase attribution is unneeded for no-change scans).

## Known Context
- Predecessors 018 (cancellable scan + tail-loop yields), 019 (maintenance marker, 180s TTL), 020 (marker extended to embedding queue). 021 closes 020's "un-reaped ≠ responsive" gap.
- `resource-map.md` not present in target. Skipping coverage gate.
- Trigger-backfill is gated off by default (`SPECKIT_TRIGGER_EMBEDDING_BACKFILL`); its chunking is a latent-bug fix.

## Cross-Reference Status
### Core (hard)
- spec_code: PARTIAL — REQ-001/REQ-003 acceptance criteria not met on the `files.length === 0` path (F001).
- checklist_evidence: N/A — Level 1 packet, no checklist.md; verification table in implementation-summary.md used instead.

### Overlay (advisory)
- feature_catalog_code: N/A — internal daemon hardening, no catalog claim.

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `mcp_server/handlers/memory-index.ts` | full | lag sampler, timedPhase, two tail-phase paths |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | full | chunk-and-yield, isCancelled, cancelled status |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | full | 3 new cancel/yield cases verified logically correct |

## Review Boundaries
- maxIterations: 1 (fan-out lineage)
- severityThreshold: P2
- Target files READ-ONLY (observation only)

## Non-Goals
- Fixing findings (report only).
- Re-validating the live deploy-time lag read (deferred by the packet itself).

## Stop Conditions
- maxIterations reached (1).
