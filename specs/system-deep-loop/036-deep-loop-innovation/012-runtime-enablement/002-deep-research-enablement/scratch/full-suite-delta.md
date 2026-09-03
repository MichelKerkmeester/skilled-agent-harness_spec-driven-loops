---
title: "Full-suite delta"
trigger_phrases: []
---
# Full-suite delta

Both phases deferred this on cost, not on a blocker. It was run.

Command: `npx vitest run` over the whole runtime suite, at `b3a9b1e2e4`.
Duration `7405.77s` (2h 3m). vitest exit `1`, because the suite has
pre-existing failures.

## Numbers

| | Baseline | Final | Δ |
|---|---|---|---|
| Tests failed | 15 | 14 | −1 |
| Tests passed | 4111 | 4175 | +64 |
| Tests skipped | 39 | 39 | 0 |
| Tests total | 4165 | 4228 | +63 |
| Files failed | 17 | 16 | −1 |
| Files total | 182 | 186 | +4 |

Baseline is the captured run at `8c9f0b6944`.

## The added tests account for the growth exactly

`4206` was the recorded mid-epic total. Adding `check-direct-append-cli` (6) and
`check-protocol-append-sites` (16) gives `4228`. The four new files are
`fleet-enablement`, `enable-modes-cli`, `check-direct-append-cli` and
`check-protocol-append-sites`, which is the whole of the `182 -> 186` growth.
Nothing else appeared.

## No regression: the failing set is a strict subset

Diffing the failing-file lists gives a single one-directional difference —
`tests/unit/model-benchmark-ledger-schema.vitest.ts` no longer appears. Nothing
new failed. Every one of my new test files passes.

## The −1 is flakiness, not a fix, and is reported as such

That file's baseline failure was `Error: Test timed out in 30000ms` on a case
that took `32292ms` — a load-sensitive timeout. Run standalone at the final
commit it **still fails** (`1 failed | 14 passed`). It came in under the timeout
during this particular run.

So the honest claim is **no regression**, not an improvement. The failed-test
count moved for a reason unrelated to any change in this epic, and treating
`15 -> 14` as progress would be reading noise as signal.

Raw logs: baseline `p003/baseline-raw.txt`, final `p003/final-suite-raw.txt`.
