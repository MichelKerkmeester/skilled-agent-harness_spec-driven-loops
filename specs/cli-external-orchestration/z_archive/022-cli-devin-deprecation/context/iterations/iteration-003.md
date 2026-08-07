# Iteration 003

**Pool:** native-a + native-b (sonnet) · **Focus:** deep-loop command YAMLs + docs (VERIFIED): 3 if_cli_devin blocks + executor enums; +model-benchmark/agent-improvement docs

## Findings (11)
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` — if_cli_devin block (753-811) → delete-block — dead assets: agent-config-deep-research-iter.json, deep-loop-iter-contract.md, agent-config-recipes.md, cloud_handoff.md
- `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` — (none) (0 matches) → none — VERIFIED CLEAN - no cli-devin
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` — if_cli_devin block (916-974) → delete-block — dead assets: agent-config-deep-review-iter.json + 2 refs + cloud_handoff.md
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` — if_cli_devin block (865-888) → delete-block — simpler (no agent-config); notes ref cloud_handoff.md
- `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` — cli_contract seat note + prose (421,455,456) → delete-item+inline — 455 delete seat note; 456 strip /cli-devin; 421 drop '/ devin --print'
- `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` — cli_contract seat note + prose (450,484,485) → delete-item+inline — mirror of auto
- `.opencode/commands/deep/start-research-loop.md` — enum+flag+option E (123,172,235) → inline+delete-paragraph — option E para line 235; default model swe-1.6
- `.opencode/commands/deep/start-review-loop.md` — enum+flag+option E (123,185,261) → inline+delete-paragraph — option E para line 261
- `.opencode/commands/deep/start-context-loop.md` — executor type enum (168) → inline-edit — drop | cli-devin
- `.opencode/commands/deep/start-model-benchmark-loop.md` — executor enum + table row + dispatch-model list (97,188,357) → inline+delete-row — NEW FILE; implies dispatch-model.cjs has cli-devin executor branch (map in iter7)
- `.opencode/commands/deep/start-agent-improvement-loop.md` — dispatch-model executor list (509) → inline-edit — NEW FILE; drop ', cli-devin'

See `../seats/iter-003/` for the full per-seat finding sets.
