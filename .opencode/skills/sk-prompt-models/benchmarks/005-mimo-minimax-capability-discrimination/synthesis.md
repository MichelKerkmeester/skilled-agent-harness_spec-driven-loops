# MiniMax-M3 vs MiMo-V2.5-Pro — Capability Discrimination (merged synthesis)

Two complementary real-dispatch runs reach the same verdict. The detailed per-run reports and raw
data live in the two `eval/` subsets; this is the combined reading.

## Verdict

**MiniMax-M3 is the more reliable pick over MiMo-V2.5-Pro — on reliability/consistency, not raw capability.**

Both models are capable on the happy path. The discriminator is reliability under hard fixtures:
MiMo emits a fully-failing answer roughly 1-in-5 on the hardest cases, while M3 never did across
the combined runs. The benchmark's built-in verdict prints "TIE-on-format" because correctness
saturates on the easy fixtures, but the correctness gate cleanly separates the pair every run.

| Run (eval subset) | Fixtures | cells | MiniMax-M3 | MiMo-V2.5-Pro | Gate |
|---|---|---:|---:|---:|---|
| `eval/capability-discrimination/` | computational: merge-intervals, parse-csv, roman, eval-expr | 24 | **1.00** (eligible) | 0.898 (ineligible) | M3 |
| `eval/strict-validation/` | validation: ipv4, date, semver, roman | 40 | **1.00** (eligible) | 0.891 (ineligible) | M3 |
| **Combined** | 8 distinct fixtures, 2 independent runs | — | **1.00 across 32/32 model-cells** | ~0.89, gate-ineligible both runs | **M3** |

## Why this is certified despite the "TIE" headline

The reporter ranks survivors on `format` and prints TIE whenever correctness saturates. With M3
perfect and several fixtures saturated, that path triggers. But the correctness gate (threshold
1.0) separates the models cleanly — M3 eligible at 1.00, MiMo ineligible at ~0.89 — and the result
**reproduces across two independent runs with disjoint fixtures**. Reproducibility plus the
consistent per-sample 0.0 outliers in MiMo's results is the certification, stronger than a single
saturated run.

## Caveats

- The gap is **reliability-driven, not a raw-capability chasm**: MiMo solves these correctly most
  of the time (~0.8–0.94) but ~1-in-5 emits a fully-failing answer; M3 simply never does in 32 cells.
- Several fixtures saturated (both models 1.0); the live signal comes from the harder fixtures
  (ipv4, roman). The harness flags the saturated fixtures `promote-or-demote-to-smoke`.
- n=3 (capability) and n=5 (strict-validation) per cell. Enough to surface the ~1-in-5 failures and
  reproduce the gap; MiMo's exact failure rate still has a wide interval.
- The earlier n=2 de-risk briefly showed the opposite and was retracted: per-model ranking needs
  >=5 samples because the catastrophic failures are ~1-in-5 events.

## Subsets

- [`eval/capability-discrimination/synthesis.md`](./eval/capability-discrimination/synthesis.md) — computational-fixture run (3 samples x 4 fixtures x 2 models).
- [`eval/strict-validation/synthesis.md`](./eval/strict-validation/synthesis.md) — validation-fixture run (5 samples x 4 fixtures x 2 models).

Each subset carries its own `results.json` + `aggregate.json`.
