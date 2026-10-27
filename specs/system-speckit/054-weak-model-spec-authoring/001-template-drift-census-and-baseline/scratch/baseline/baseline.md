# Baseline: DeepSeek V4.1 Flash authoring on the v2.2 templates

Three serial runs of the fixed T009 task on `llmgateway/deepseek-v4.1-flash-1017` at max. Each run created `specs/zz-bench-authoring/`, was measured, and was deleted before the next run started.

| Run | strict_passed | leftover_hints | missing_anchors | out_of_scope_writes | seconds |
|-----|---------------|----------------|-----------------|---------------------|---------|
| 1 | 1 | 1 | 0 | 0 | 133 |
| 2 | 1 | 0 | 0 | 0 | 181 |
| 3 | 1 | 0 | 0 | 0 | 368 |

## Minimum and maximum

- `strict_passed`: min 1, max 1. One means `validate.sh --strict` printed `RESULT: PASSED`.
- `leftover_hints`: min 0, max 1. This counts the scaffold hint strings still present in the four filled docs.
- `missing_anchors`: min 0, max 0. This counts anchors the filled docs dropped relative to the scaffold.
- `out_of_scope_writes`: min 0, max 0. This counts changed paths outside the throwaway track and this phase folder.
- `seconds`: min 133, max 368. This is the wall time from dispatch to return.
