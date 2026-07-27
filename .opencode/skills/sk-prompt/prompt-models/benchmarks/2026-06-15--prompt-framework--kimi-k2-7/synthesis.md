# Benchmark synthesis

## Trust verdict

Verdict: **TIE** (inside_noise_floor) on ranking key `efficiency`.
- samples per cell (min): 3 | top-pair margin: 0.5 | noise floor: 12
- paired 90% CI on the top-pair delta: [-4.667, 5.167] (point 0.333) — overlaps zero, so no trusted separation
- top pair: cidi vs costar
- correctness gate: threshold 1 | correctness saturated: true (correctness is NOT the ranking key — survivors ranked on `efficiency`)

## Saturation status

Run status: **saturated** | action: promote-or-demote-to-smoke.
- every eligible framework is pinned at the correctness gate; correctness cannot rank — ranked on efficiency instead.

| fixture | cells | correctness mean | saturated | action |
| --- | ---: | ---: | --- | --- |
| t3-lower-bound | 15 | 1 | true | promote-or-demote-to-smoke |
| t3-compare-versions | 15 | 1 | true | promote-or-demote-to-smoke |

## Leaderboard (groupBy: framework)

| rank | framework | n | correctness | format adherence | words (median) | eligible |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | cidi | 6 | 1 | 1 | 122.5 | true |
| 2 | costar | 6 | 1 | 1 | 123 | true |
| 3 | race | 6 | 1 | 1 | 123.5 | true |
| 4 | rcaf | 6 | 1 | 1 | 125 | true |
| 5 | tidd-ec | 6 | 1 | 1 | 137 | true |

## Reproducibility

- profile: `kimi-k2.7-frameworks` | mode: `framework-bakeoff` | groupBy: `framework` | samples/cell (min): 3
- schema_version: 1
