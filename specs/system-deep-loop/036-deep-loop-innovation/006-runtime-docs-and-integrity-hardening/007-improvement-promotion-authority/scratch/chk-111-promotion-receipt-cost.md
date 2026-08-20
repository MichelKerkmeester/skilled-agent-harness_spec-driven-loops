# Receipt cost on a promotion — measured before and after

Measured 2026-08-19 on the operator's machine. Reproduction scripts are beside
this file: `promotion-receipt-bench.cjs.txt` (whole-promotion arms) and
`receipt-ops-bench.cjs.txt` (the two receipt operations in isolation).

The checklist previously recorded only the current cost of a receipt write with
no comparison arm. This closes that gap with both halves: an isolated cost for
the receipt operations, and a real before/after on whole-promotion wall clock.

## What "before" means here

`--approve` used to be a bare boolean flag. It now takes a path to an
HMAC-authenticated receipt that binds candidate, target, report, config, and
manifest, and promotion verifies it before touching anything. The pre-binding
side was obtained by checking out `d0d8623ddf` — the parent of `0d1827eef50`,
the commit that turned the flag into a receipt — in a separate worktree and
running the same fixture there. It is a real historical arm, not the current
code with a feature switched off.

Both arms promote a hermetic benchmark-lane fixture through the real
`promote-candidate.cjs` as a subprocess, and both were confirmed to actually
promote (the candidate bytes land on the canonical target) rather than to fail
fast and look quick.

## The receipt operations, isolated

100 samples per run, 10 warmup discarded, timed in-process.

| Operation | mean | median | p95 | 100x total |
|---|---|---|---|---|
| Issue (hash bound artifacts, sign, exclusive write) | 4.56 / 4.17 ms | 4.01 / 4.00 ms | 7.74 / 5.85 ms | 455.6 / 417.1 ms |
| Verify (read, authenticate HMAC, check type) | 0.078 / 0.082 ms | 0.074 / 0.077 ms | 0.129 / 0.118 ms | 7.8 / 8.2 ms |

Two independent runs are shown as `run1 / run2`. The issue figure corroborates
the previously recorded probe (100 writes, 485.381 ms total, 4.854 ms mean) on
a separate implementation of the measurement.

**Receipt-attributable cost per promotion: about 4.3 ms.** Verification is
noise at roughly 0.08 ms; essentially all of the cost is the write, and most of
that is hashing the bound artifacts and the exclusive-create file write.

## Whole promotion, before and after

40 samples per arm, 5 warmup discarded. Each arm was run twice, in alternating
order, so a cold cache or machine drift would show up as disagreement between
the two passes.

| Arm | pass 1 mean | pass 2 mean | median | p95 |
|---|---|---|---|---|
| Before — bare `--approve` at `d0d8623ddf` | 86.31 ms | 90.22 ms | 90.37 / 94.53 ms | 102.58 / 152.48 ms |
| After — authenticated receipt at HEAD | 64.07 ms | 66.59 ms | 63.98 / 63.54 ms | 67.72 / 100.25 ms |

Adding the ~5 ms receipt issuance the caller performs before invoking promote,
the shipped path costs roughly 69 ms end to end against roughly 88 ms before.

## Reading it honestly

The hardened promotion is **not slower** — it measures about 20 ms faster than
the pre-binding baseline, consistently, in both orderings.

That delta must not be credited to receipts. The two arms are separate commits,
so the comparison spans every change between them, and nothing here isolates
which one bought the 20 ms. The defensible claim is the narrow one: receipts
add about 4.3 ms to a promotion, and whole-promotion wall clock did not regress
across the change that introduced them.

The isolated figure is the durable one. Absolute promotion times include Node
process startup and will move on other hardware; the ~4.3 ms receipt cost was
measured in-process and is dominated by hashing and one fsync-bound write.

Measured on a working machine rather than a quiet benchmark host, which inflates
all arms and shows up mainly in the p95 outliers (152 ms and 100 ms), not in the
medians, which are stable across passes.
