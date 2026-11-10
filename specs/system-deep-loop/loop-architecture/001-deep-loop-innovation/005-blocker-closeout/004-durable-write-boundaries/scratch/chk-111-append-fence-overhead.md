---
title: "Fencing overhead on the append path — measured"
trigger_phrases: []
---
# Fencing overhead on the append path — measured

Measured 2026-08-18 on the operator's machine. Reproduction script:
`append-fence-overhead-bench.vitest.ts.txt` in this folder.

## What was compared

Both arms perform the identical authorized append against a fresh ledger, with
authorization excluded from the timed region. Only the append call is timed.

- **Arm A — gateway seam.** `appendAuthorizedThroughFence(ledger, event, proof)`,
  the path shipped callers actually use. Acquires one short-lived fence per
  append, validates the capability, commits, releases.
- **Arm B — held lease.** `appendAuthorizedWithCapabilityForTest(ledger, event,
  proof, lease)` with a single lease acquired once up front. Capability
  validation and the commit path are unchanged; only the per-append acquire and
  release are removed.

The difference between the arms is therefore the fencing overhead itself, not
the cost of durable appending.

40 samples per arm, 5 warmup iterations discarded.

## Result

| Arm | mean | median | p95 |
|---|---|---|---|
| Gateway seam (shipped path) | 174.82 ms | 174.08 ms | 205.99 ms |
| Held lease (fence cost removed) | 164.42 ms | 165.32 ms | 200.39 ms |
| **Fencing overhead** | **10.40 ms** | **8.76 ms** | — |

Fencing accounts for **5.9%** of a gateway append.

## Reading it honestly

The durable append dominates: ~164 ms of the ~175 ms is the ledger commit
itself, which is fsync-bound and therefore a property of this disk rather than
of the fencing design. Absolute figures will move on different hardware.

The **ratio is the durable finding**. Per-append lease acquire and release adds
roughly a tenth of the cost of the work it protects, on a path that is already
fsync-bound. Nothing here suggests fencing is a throughput concern for the
append path, and no perf regression surfaced in the load-bearing suites, which
re-run green at their baseline counts.

One caveat worth stating rather than hiding: this was measured on a busy
workstation, not a quiet benchmark host. That inflates both arms roughly
equally, so it affects the absolute numbers more than the delta — but a
dedicated host would give a tighter p95.

## Why the bench is not in the suite

`vitest.config.ts` includes `tests/**/*.{vitest,test}.ts`, so anything left
under `tests/` runs on every invocation. A 26-second timing measurement has no
place in the standard gate, and a timing assertion there would be flaky by
construction. The script is kept here verbatim so the measurement can be
reproduced on demand: copy it back to
`runtime/tests/unit/append-fence-overhead.vitest.ts` and run it directly.
