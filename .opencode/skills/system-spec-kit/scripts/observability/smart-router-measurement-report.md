# Smart Router Static Measurement Report

Generated: 2026-05-03T17:41:26.550Z

## Summary

- Total prompts: 197
- Advisor top-1 accuracy vs corpus labels: 130/197 (65.99%)
- Live readiness gate: READY (2 prompts with observed reads from 2 live records)
- Methodology caveat: Static measurement still covers predicted routes and advisor labels only. Routing readiness claims now remain blocked until live wrapper telemetry captures actual reads.

## Live Readiness Gate

- Input: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/.smart-router-telemetry/compliance.jsonl
- Status: READY
- Reason: Live wrapper telemetry with actual reads is present.
- Live wrapper records: 2
- Prompts with observed reads: 2

## Per-Skill Accuracy And Savings

| Skill | Prompts | Correct | Accuracy | ON_DEMAND Hit Rate | Avg Allowed Resources | Median Allowed Resources | Avg Brief Bytes | Avg Full Tree Bytes | Avg Predicted Context Bytes | Avg Brief Savings | Avg Predicted Context Savings |
|-------|---------|---------|----------|--------------------|-----------------------|--------------------------|-----------------|---------------------|-----------------------------|-------------------|-------------------------------|
| mcp-chrome-devtools | 7 | 3 | 42.86% | 42.86% | 1.86 | 1.00 | 54.00 | 59135.00 | 41561.86 | 99.91% | 29.72% |
| mcp-coco-index | 4 | 4 | 100.00% | 100.00% | 3.00 | 3.00 | 58.25 | 79640.00 | 60510.00 | 99.93% | 24.02% |
| memory:save | 9 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 59.33 | 0.00 | 0.00 | 0.00% | 0.00% |
| sk-code | 8 | 4 | 50.00% | 0.00% | 0.00 | 0.00 | 71.25 | 918440.00 | 9988.00 | 99.99% | 98.91% |
| sk-code-review | 28 | 18 | 64.29% | 0.00% | 5.04 | 5.00 | 66.86 | 53167.00 | 38782.89 | 99.87% | 27.05% |
| sk-deep-research | 35 | 31 | 88.57% | 28.57% | 3.23 | 3.00 | 62.06 | 202688.00 | 127135.63 | 99.97% | 37.28% |
| sk-deep-review | 22 | 18 | 81.82% | 50.00% | 3.27 | 4.00 | 60.14 | 164352.00 | 107863.95 | 99.96% | 34.37% |
| sk-doc | 11 | 7 | 63.64% | 63.64% | 2.00 | 2.00 | 50.64 | 618772.00 | 54605.55 | 99.99% | 91.18% |
| sk-git | 3 | 3 | 100.00% | 100.00% | 5.33 | 5.00 | 41.00 | 149614.00 | 91914.00 | 99.97% | 38.57% |
| sk-prompt | 13 | 9 | 69.23% | 0.00% | 0.00 | 0.00 | 69.54 | 115383.00 | 19007.00 | 99.94% | 83.53% |
| skill_advisor | 1 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 76.00 | 0.00 | 0.00 | 0.00% | 0.00% |
| system-spec-kit | 39 | 29 | 74.36% | 35.90% | 4.38 | 4.00 | 62.54 | 552504.00 | 119608.69 | 99.99% | 78.35% |
| UNKNOWN | 13 | 0 | 0.00% | 0.00% | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00% | 0.00% |

## Allowed-Resource Count Distribution

| Allowed Resources | Prompt Count |
|-------------------|--------------|
| 0 | 44 |
| 1 | 34 |
| 2 | 6 |
| 3 | 31 |
| 4 | 19 |
| 5 | 46 |
| 6 | 6 |
| 7 | 3 |
| 8 | 5 |
| 10 | 3 |

## Caveats

- This report measures advisor output and the predicted SMART ROUTING resource route only.
- It does not measure actual AI tool reads, skipped SKILL.md behavior, or whether a model followed a route.
- Compliance JSONL records emitted by this static harness intentionally stay on the static stream and classify as `unknown_unparsed` to avoid implying live-session compliance.
- Readiness stays blocked until the live wrapper captures actual reads in `.opencode/skills/.smart-router-telemetry/compliance.jsonl`.

