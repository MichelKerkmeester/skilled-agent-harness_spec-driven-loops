# Benchmark synthesis

## Trust verdict

Verdict: **TIE** (inside_noise_floor) on ranking key `correctness`.
- samples per cell (min): 3 | top-pair margin: 0 | noise floor: 0
- paired 90% CI on the top-pair delta: [0, 0] (point 0) — overlaps zero, so no trusted separation
- top pair: costar vs tidd-ec
- correctness gate: threshold 0 | correctness saturated: false

## Saturation status

Run status: **separable**.
- correctness still separates the eligible groups.

| fixture | cells | correctness mean | saturated | action |
| --- | ---: | ---: | --- | --- |
| validate-ipv4 | 15 | 1 | true | promote-or-demote-to-smoke |
| validate-date | 15 | 1 | true | promote-or-demote-to-smoke |
| validate-semver | 15 | 0.986 | false | keep |

## Leaderboard (groupBy: framework)

| rank | framework | n | correctness | format adherence | words (median) | eligible |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | costar | 9 | 1 | 1 | 13 | true |
| 2 | tidd-ec | 9 | 1 | 1 | 38 | true |
| 3 | cidi | 9 | 1 | 1 | 94 | true |
| 4 | race | 9 | 1 | 1 | 94 | true |
| 5 | rcaf | 9 | 0.976 | 0.889 | 85 | true |

## Reproducibility

- profile: `glm-5.2-frameworks` | mode: `framework-bakeoff` | groupBy: `framework` | samples/cell (min): 3
- schema_version: 1
