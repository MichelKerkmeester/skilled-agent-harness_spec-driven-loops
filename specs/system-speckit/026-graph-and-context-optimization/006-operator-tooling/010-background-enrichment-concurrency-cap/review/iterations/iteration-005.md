# Deep-Review Iteration 5 (opus-4.8) — resource exhaustion / failure injection

## Verdict: 1 NEW P2; 2 lenses examined + dismissed.

- **F-007 (P2, NEW; sharpens iter-2 F-003): Unbounded queue LENGTH under a live save flood.** Iter-2's "scan-bounded" framing only covers the finite-`allFiles` scan path. The **live** enqueue (`memory-save.ts:2753`, fires per async `memory_save`, returns immediately) has no length cap; sustained save-rate > 4-wide drain-rate → monotonic queue + retained-`parsed` growth → OOM. Distinct axis from retention-*duration*: this is unbounded *count*. **Fix:** `MAX_QUEUED` + drop-on-overflow (row already enrichment-pending → backfill repairs). P2 not P1: local/trusted, no untrusted surface, fully recoverable.
- `shift()` O(n²): dismissed — dominated by per-item enrichment latency; OOM (F-007) binds first.
- `setImmediate` semantics: negligible — only a macrotask boundary is needed; holds under polyfills. Optional: a comment asserting "macrotask boundary required — not queueMicrotask".
- GC pressure: the fix's event-loop improvement is REAL; residual pressure localizes to F-007's retained queue.

## Convergence impact: P2 (no P0/P1 from this lens).
