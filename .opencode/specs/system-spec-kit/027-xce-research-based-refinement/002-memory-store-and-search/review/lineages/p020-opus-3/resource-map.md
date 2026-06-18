# Resource Map — p020-opus-3 (emitted from converged review delta)

> `{spec_folder}/resource-map.md` was **absent at init** (`resource_map_present: false`), so the Resource Map Coverage Gate was skipped. This file is the convergence-emitted delta map (not a coverage audit).

## Files reviewed (delta evidence)

| Path | Role | Verdict contribution |
|------|------|---------------------|
| `mcp_server/lib/storage/maintenance-marker.ts` | New shared reference-counted marker module | P2-D1-01 (write-failure signal ignored, fail-open) |
| `mcp_server/handlers/memory-index.ts` (scan IIFE ~1488-1554) | Scan refactored onto shared module | Clean — no leftover inline 019 writer |
| `mcp_server/lib/providers/retry-manager.ts` (`runBackgroundJob` ~1012-1062) | Embedding queue wired in after empty-queue guard | Clean — REQ-002/REQ-004 satisfied |
| `mcp_server/tests/maintenance-marker.vitest.ts` | Unit coverage for ref-counted lifecycle | P2-D4-01 (transient stale labels, by-design, asserted here) |

## Dependencies read for verification (not under review)

| Path | Why read |
|------|----------|
| `mcp_server/lib/storage/transaction-manager.ts:177` | `atomicWriteFile` never throws → refuted the ref-count-leak P0-candidate |
| `mcp_server/core/config.ts:97` | `export let DATABASE_DIR` live binding → confirms vitest redirect is sound |

## Phase-5 Augmentation (novel logic gaps)

- Empty result: no novel logic gaps beyond the two recorded P2 advisories. The change is additive, scope-locked to 4 files, and traces fully to REQ-001..004. The only outstanding item is the deploy-time live reindex-survival check (SC-002), which is non-code by design.
