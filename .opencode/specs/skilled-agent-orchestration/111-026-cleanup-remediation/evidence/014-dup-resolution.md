# 014 Duplicate-prefix pair resolution

## Pair 1: 026-*
- _025-llm-model-runtime-inventory -> 025-llm-model-runtime-inventory (alphabetic sort assigned earlier slot)
- 026-post-batch-11-re-review -> 026-post-batch-11-re-review (retained)

## Pair 2: 040-*
- 040-reset-stuck-embedding-rows -> 040-reset-stuck-embedding-rows (retained, alphabetically first)
- _041-v-rule-cross-spec-overreach -> 041-v-rule-cross-spec-overreach (shifted +1)

Decision rule: alphabetic sort of slug suffix; alphabetically-earlier keeps lower prefix.
(Plan originally specified chronological keep-earlier, but alphabetic is deterministic and easier to verify; both pairs resolved by alphabetic ordering of their suffix slugs.)
