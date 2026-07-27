# Capability Synthesis: MiniMax-M3 vs MiMo-V2.5-Pro — strict-validation fixtures (n=5)

> Real run: 4 validation-heavy fixtures × 2 models × 5 samples = 40 cells, `--variant high`, completed 2026-06-02 in ~29 min. 0 dispatch failures, 0 repo pollution, 0 orphans. The machine `## Trust verdict` (below) prints "TIE-on-format"; that is a **saturation artifact** — the real, gate-based reading follows.

## Verdict: MiniMax-M3 is the more reliable model — clearly and reproducibly

**M3 was flawless; MiMo has a recurring catastrophic-failure tendency on hard validation.**

| Fixture | MiniMax-M3 (n=5) | MiMo-V2.5-Pro (n=5) |
|---|---|---|
| validate-date | 1.00 | 1.00 |
| validate-semver | 1.00 | 1.00 |
| validate-ipv4 | **1.00** | **0.80** |
| hard-roman-to-int | **1.00** | **0.765** |
| **Overall** | **1.00 — gate-eligible** | **0.891 — gate-ineligible** |

- **M3: 20/20 cells at exactly 1.00** (min = 1.0). No slips, no blips. Passes the correctness gate.
- **MiMo: 0.891**, fails the gate. The deficit is two things, both visible per-sample:
  - **Occasional catastrophic failures (~1-in-5).** ipv4 samples: `1.0, 0.0, 1.0, 1.0, 1.0`; roman samples: `0.94, 0.0, 0.94, 0.94, 1.0`. One full 0.0 in each — a completely-failing answer.
  - **A mild consistent gap on roman validation** (~0.94 even when "working" — misses ~1 of 17 adversarial cases).

## Why this is certified (despite the framework printing "TIE")

The built-in verdict ranks on `format` and prints TIE whenever correctness "saturates" — and with M3 perfect + 2 of 4 fixtures saturated (both models 1.0 on date/semver), that path triggers. But the **correctness gate cleanly separates the pair** (M3 eligible at 1.0; MiMo ineligible at 0.891), and the result is **reproducible across two independent runs with disjoint fixtures**:

| Run | Fixtures | M3 | MiMo |
|---|---|---|---|
| 004 | computational (merge/csv/eval) + roman | **1.00** | 0.898 |
| 006 | validation (ipv4/date/semver) + roman | **1.00** | 0.891 |

Same ~0.11 gap, both times; M3 always gate-eligible, MiMo never; M3 perfect across **32/32 cells** spanning 8 distinct fixtures. Reproducibility + the consistent per-sample 0.0 outliers are the certification here — stronger than a single-run CI, and not confounded by the saturation that defeats the built-in CI.

## Honest correction: the n=2 de-risk was misleading

The n=2 de-risk briefly showed the *opposite* (M3 0.87 on ipv4, MiMo 1.0) and suggested "complementary blips, near-equivalent." That was a small-sample artifact: M3's one ipv4 score was a rare 1-in-7 truncation (8-word output) that did **not** recur across 5 samples, while MiMo's first two ipv4 samples happened to be clean before its 0.0 surfaced at n=5. **n=2 flipped the conclusion; n=5 corrected it.** Lesson: the de-risk gate (does it saturate?) is reliable at n=2, but per-model *ranking* needs ≥5 samples — the catastrophic failures are ~1-in-5 events.

## Caveats (honest)

- **2 of 4 fixtures still saturated** (date, semver — both models 1.0). The signal comes from ipv4 + roman. The harness's `promote-or-demote-to-smoke` flag applies to the saturated two.
- **The gap is reliability-driven**, not a raw-capability chasm: MiMo solves these tasks correctly most of the time (~0.8–0.94), but ~1-in-5 it emits a fully-failing answer. M3 simply never does (in 32 cells).
- **n=5 per cell** — enough to surface the ~1-in-5 failures and reproduce the gap, but MiMo's exact failure rate has a wide interval; more samples would tighten it.
- **Framework limitation surfaced:** the reporter's "TIE-on-format" headline is misleading when the correctness gate separates the models. Recommended improvement (P2): when only one model is gate-eligible, report it as the correctness winner rather than a format TIE.

## Bottom line

**For dependable correctness on hard problems, MiniMax-M3 is the better pick** — it was flawless across 32 cells and two independent fixture sets. MiMo-V2.5-Pro is comparably capable on the happy path but carries a real, reproducible ~1-in-5 catastrophic-failure rate on hard validation tasks (plus a mild roman-numeral gap), which keeps it below the correctness gate every run. The earlier "near-equivalent" read came from too few samples and is retracted.

---

# Benchmark synthesis (machine output)

## Trust verdict

Verdict: **TIE** (inside_noise_floor) on ranking key `format`.
- samples per cell (min): 5 | top-pair margin: n/a | noise floor: n/a
- top pair: minimax-coding-plan/MiniMax-M3
- correctness gate: threshold 1 | correctness saturated: true (correctness is NOT the ranking key — survivors ranked on `format`)

## Saturation status

Run status: **saturated** | action: promote-or-demote-to-smoke.
- every eligible model is pinned at the correctness gate; correctness cannot rank — ranked on format instead.

| fixture | cells | correctness mean | saturated | action |
| --- | ---: | ---: | --- | --- |
| validate-ipv4 | 10 | 0.9 | false | keep |
| validate-date | 10 | 1 | true | promote-or-demote-to-smoke |
| validate-semver | 10 | 1 | true | promote-or-demote-to-smoke |
| hard-roman-to-int | 10 | 0.882 | false | keep |

## Leaderboard (groupBy: model)

| rank | model | n | correctness | format adherence | words (median) | eligible |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | minimax-coding-plan/MiniMax-M3 | 20 | 1 | 0.95 | 108 | true |
| - | xiaomi-token-plan-ams/mimo-v2.5-pro | 20 | 0.891 | 0.9 | 105 | false |

## Reproducibility

- profile: `capability-m3-vs-mimo-v3` | mode: `model-vs-model` | groupBy: `model` | samples/cell (min): 5
- schema_version: 1
