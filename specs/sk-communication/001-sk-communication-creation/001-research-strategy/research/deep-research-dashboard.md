# Deep Research Dashboard

## Status

- Workflow: complete
- Stop policy: `max-iterations`
- Total lineages: 2
- Total iterations: 10
- Merged findings: 97
- Delta corruption: 0

## Lineages

| Lineage | Model | Iterations | Stop reason | Validation |
|---------|-------|------------|-------------|------------|
| `deepseek-go` | `opencode-go/deepseek-v4-flash` | 7/7 | `maxIterationsReached` | 7/7 pass |
| `gpt-sol-fast` | `openai/gpt-5.6-sol-fast`, high | 3/3 | `maxIterationsReached` | 3/3 pass |

## Question Status

- Resolved: 13
- Open architecture-selection questions: 0
- Remaining implementation fixture questions: documented in `research.md` Section 12

## Novelty Trends

- DeepSeek: `0.95 -> 0.80 -> 0.72 -> 0.65 -> 0.58 -> 0.50 -> 0.42`
- GPT: `0.69 -> 0.86 -> 0.81`
- Convergence telemetry did not stop either lineage before its required cap.

## Warnings

- One stall warning was recorded while both lineages ultimately completed.
- Eight DeepSeek timestamps were after the observed subprocess window and one record lacked a timestamp. These values are not accepted as chronological evidence.

## Canonical Output

- `research.md`
- `resource-map.md`
- `findings-registry.json`
- `fanout-attribution.md`
- `orchestration-summary.json`
