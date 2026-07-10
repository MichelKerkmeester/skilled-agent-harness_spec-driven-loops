# Benchmark synthesis

## Trust verdict

Verdict: **TIE** (inside_noise_floor) on ranking key `correctness`.
- samples per cell (min): 6 | top-pair margin: 0 | noise floor: 0.018
- paired 90% CI on the top-pair delta: [0, 0] (point 0) — overlaps zero, so no trusted separation
- top pair: tidd-ec vs race
- correctness gate: threshold 0 | correctness saturated: false

## Saturation status

Run status: **separable**.
- correctness still separates the eligible groups.

| fixture | cells | correctness mean | saturated | action |
| --- | ---: | ---: | --- | --- |
| validate-ipv4 | 30 | 1 | true | promote-or-demote-to-smoke |
| validate-date | 30 | 1 | true | promote-or-demote-to-smoke |
| validate-semver | 30 | 0.993 | false | keep |

## Leaderboard (groupBy: framework)

| rank | framework | n | correctness | format adherence | words (median) | eligible |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | tidd-ec | 18 | 1 | 1 | 25 | true |
| 2 | race | 18 | 1 | 1 | 53.5 | true |
| 3 | costar | 18 | 1 | 1 | 70 | true |
| 4 | cidi | 18 | 0.996 | 1 | 83.5 | true |
| 5 | rcaf | 18 | 0.992 | 1 | 64.5 | true |

## Reproducibility

- profile: `kimi-k2.7-discriminating` | mode: `framework-bakeoff` | groupBy: `framework` | samples/cell (min): 6
- schema_version: 1
