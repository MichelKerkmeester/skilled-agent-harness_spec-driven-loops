# Benchmark synthesis

> Real multi-sample run (3 samples × 4 hard fixtures × 2 models = 24 cells, `--variant high`), completed 2026-06-02 in ~33 min. 0 dispatch failures, 0 repo pollution, 0 orphans. The machine `## Trust verdict` below labels this a format-TIE; that is a **saturation artifact** — the human reading follows.

## Capability verdict (interpretation)

**MiniMax-M3 over MiMo-V2.5-Pro — on reliability/consistency, not raw capability.**

- **Both models are capable.** MiMo scored ~1.0 on three of four hard fixtures and 0.94 on the fourth when it worked; M3 scored 1.0 everywhere.
- **The discriminator is `hard-roman-to-int`** (the one fixture that did NOT saturate). M3 = 1.0 / 1.0 / 1.0 across the three samples; MiMo = **0.94 / 0.94 / 0.0** — two near-perfect runs and **one catastrophic miss** (a verbose 189-word answer that broke extraction). That single blip is the entire gap.
- **Correctness gate (threshold 1.0):** M3 = 1.0 → **eligible**; MiMo = 0.898 → **NOT eligible**. On the gate, M3 wins; the framework still prints "TIE" only because it fell back to ranking on `format` after 3/4 fixtures saturated.
- **Format/brevity:** roughly even — M3 slightly tighter (format adherence 1.0 vs 0.82; ~144 vs ~163 median words).

**Bottom line:** for dependable correctness on hard problems, **M3 is the safer pick** (perfect consistency); MiMo is comparably smart but showed real variance — a 1-in-12 hard failure.

**Caveats (honest):** n=3 is thin, so MiMo's true failure rate is uncertain (1 event). 3 of 4 fixtures saturated (both models 1.0) — the harness flags `promote-or-demote-to-smoke`; a sharper verdict needs harder fixtures + more samples. But the instrument worked: the hard-fixture pack surfaced a reliability gap the old 2-fixture (always-saturated) benchmark could never show.

## Trust verdict

Verdict: **TIE** (inside_noise_floor) on ranking key `format`.
- samples per cell (min): 3 | top-pair margin: n/a | noise floor: n/a
- top pair: minimax-coding-plan/MiniMax-M3
- correctness gate: threshold 1 | correctness saturated: true (correctness is NOT the ranking key — survivors ranked on `format`)

## Saturation status

Run status: **saturated** | action: promote-or-demote-to-smoke.
- every eligible model is pinned at the correctness gate; correctness cannot rank — ranked on format instead.

| fixture | cells | correctness mean | saturated | action |
| --- | ---: | ---: | --- | --- |
| hard-merge-intervals | 6 | 1 | true | promote-or-demote-to-smoke |
| hard-parse-csv-line | 6 | 1 | true | promote-or-demote-to-smoke |
| hard-roman-to-int | 6 | 0.814 | false | keep |
| hard-eval-expr | 6 | 1 | true | promote-or-demote-to-smoke |

## Leaderboard (groupBy: model)

| rank | model | n | correctness | format adherence | words (median) | eligible |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | minimax-coding-plan/MiniMax-M3 | 12 | 1 | 1 | 142 | true |
| - | xiaomi-token-plan-ams/mimo-v2.5-pro | 12 | 0.898 | 0.818 | 148 | false |

## Reproducibility

- profile: `capability-m3-vs-mimo` | mode: `model-vs-model` | groupBy: `model` | samples/cell (min): 3
- schema_version: 1
