# Iteration 8: MiniMax Routing Heuristic Stress Test And Pattern-Index Rows

## Focus

Stress-test the MiniMax-vs-other-small-model routing heuristics against concrete task scenarios, confirm the current `sk-prompt-small-model/references/pattern-index.md` format, and finalize the exact MiniMax rows plus a compact routing decision table for the cross-CLI quality card.

## Actions Taken

1. Read the current `sk-prompt-small-model/references/pattern-index.md`; it has 14 rows in a four-column table: `Pattern`, `Owner Skill`, `Canonical Location`, and `Shipped In`. [SOURCE: `.opencode/skills/sk-prompt-small-model/references/pattern-index.md`]
2. Read the current `cli-opencode/references/context-budget.md`; it mirrors the canonical `cli-devin` budget pattern and currently lists DeepSeek, Kimi, and Qwen, but not MiniMax. [SOURCE: `.opencode/skills/cli-opencode/references/context-budget.md`]
3. Read the cross-CLI quality card; its Budget Awareness list currently names `swe-1.6`, `deepseek-v4-pro`, `kimi-k2.6`, and `qwen3.6`, but not `glm-5.1` or `minimax-2.7`. [SOURCE: `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`]
4. Rechecked the live MiniMax model profile and `cli-opencode` provider docs; MiniMax exists as a single `cli-opencode` direct-provider path with `quota_pool: "minimax-api"` and `fallback_target: null`, while context length is still `null` in the file pending implementation. [SOURCE: `.opencode/skills/sk-prompt/assets/model-profiles.json`] [SOURCE: `.opencode/skills/cli-opencode/SKILL.md`] [SOURCE: `.opencode/skills/cli-opencode/references/cli_reference.md`]

## Findings

### Finding 1: The pattern-index format supports MiniMax as link-only rows, not embedded policy text

The current index is intentionally thin: one table, four columns, no pattern bodies. MiniMax additions should therefore be exact rows pointing to canonical owner files. Do not paste the routing table, ablation recipe, or budget math into the index.

Exact new rows to add after the existing `sk-prompt budget awareness` row:

```markdown
| MiniMax context-budget adoption (204,800 context, 143,360 active budget, tool-round continuity) | `cli-devin` + `cli-opencode` | [`../../cli-devin/assets/per-model-budgets.json`](../../cli-devin/assets/per-model-budgets.json) + [`../../cli-opencode/references/context-budget.md`](../../cli-opencode/references/context-budget.md) | 120/002 |
| MiniMax direct-provider routing heuristics (large-context + `minimax-api` quota isolation; no silent substitution) | `cli-opencode` | [`../../cli-opencode/references/cli_reference.md`](../../cli-opencode/references/cli_reference.md) + [`../../cli-opencode/SKILL.md`](../../cli-opencode/SKILL.md) | 120/002 |
| MiniMax prompt-quality and variant-ablation policy (RCAF/CLEAR defaults; omit `--variant` until proven) | `cli-opencode` + `sk-prompt` | [`../../cli-opencode/references/cli_reference.md`](../../cli-opencode/references/cli_reference.md) + [`../../sk-prompt/assets/cli_prompt_quality_card.md`](../../sk-prompt/assets/cli_prompt_quality_card.md) | 120/002 |
```

Do not add MiniMax-specific rows for permissions, fallback, or generic output verification. Existing rows already cover those canonical patterns:

- `Structured permissions schema`, `Structured permissions reference`, and `Permissions gate runtime` remain provider-neutral.
- `Quota-pool-aware fallback` remains registry-driven; MiniMax only contributes `quota_pool: "minimax-api"` and `fallback_target: null`.
- `Output verification pipeline` remains output-shape-driven. MiniMax should reuse it, with any MiniMax dispatch note living in `cli-opencode` docs or the quality card, not as a new sentinel row.

### Finding 2: Routing stress tests keep MiniMax targeted, not default

Scenario outcomes:

| Scenario | Heuristic pick | Why |
| --- | --- | --- |
| 180k-token multi-file review | `minimax/minimax-2.7` when MiniMax auth is configured | The evidence set pressures DeepSeek, Qwen, and GLM budgets, and MiniMax offers the largest active budget from the researched tuple: 143,360 tokens under the 70 percent rule. Kimi is close at 140,000 tokens, but MiniMax also isolates spend from `opencode-go`. |
| Tight cheap edit | `opencode-go/qwen3.6` | The task does not need MiniMax's context window. Qwen's 22,400-token active budget is enough for narrow file anchors, and the smaller model avoids spending a large-context direct-provider call. |
| Cost-sensitive batch | `minimax/minimax-2.7` for read-heavy or medium/large batched analyses; `opencode-go/qwen3.6` for tiny edit batches | The routing split should be by retained evidence size, not the word "batch". MiniMax is better when batching would drain Cognition/opencode-go quota or require repeated prompt splitting; Qwen remains better for short, bounded edits. |
| Cognition-Pro-exhausted fallback | No automatic model; fail fast, then offer explicit `minimax/minimax-2.7` if the user wants a separate direct-provider route | The fallback contract is opt-in and one-step, and active models have `fallback_target: null`. MiniMax must not be a silent fallback from Cognition Pro, but it is the right manually approved alternate pool when configured. |

This stress test supports the earlier routing rule: MiniMax wins on large evidence bundles and quota isolation. It does not beat DeepSeek as the general hard-reasoning default, Qwen as the tiny edit path, Kimi as the established opencode-go long-context route, or GLM as the structured synthesis path when their budgets fit.

### Finding 3: Compact routing decision table for the cross-CLI quality card

This table is suitable for the `sk-prompt/assets/cli_prompt_quality_card.md` Budget Awareness section or an adjacent small-model routing subsection:

```markdown
| Task shape | Preferred small-model route | Budget / quota reason | Dispatch note |
| --- | --- | --- | --- |
| Hard root-cause reasoning with <=44k active prompt tokens | `opencode-go/deepseek-v4-pro --variant high` | Strong default reasoning route; 64k window / 44.8k active budget | Keep current cli-opencode default. |
| Narrow bounded edit with <=22k active prompt tokens | `opencode-go/qwen3.6 --variant high` | Smallest adequate window; cheap tight-loop route | Use exact file anchors and concise acceptance criteria. |
| Established long-context opencode-go task with <=140k active prompt tokens | `opencode-go/kimi-k2.6 --variant high` | 200k window / 140k active budget through the existing opencode-go path | Prefer when opencode-go quota is available and MiniMax isolation is not needed. |
| Structured broad synthesis with <=89k active prompt tokens | `opencode-go/glm-5.1 --variant high` | 128k window / 89.6k active budget; synthesis-oriented route | Prefer for organized comparison/synthesis over narrow edits. |
| Large evidence bundle, active tool-round continuity, or quota isolation from opencode-go/Cognition | `minimax/minimax-2.7` | 204.8k window / 143.36k active budget; separate `minimax-api` pool | Omit `--variant` by default; preserve complete active tool-call/tool-result spans. |
| Cognition/opencode-go pool exhausted and no configured separate fallback | Fail fast; ask before using direct MiniMax | Fallback is opt-in and same-pool retry is banned | Never silently substitute MiniMax. |
```

### Finding 4: Concrete file-level deltas are now stable enough for implementation

Patch-ready implementation boundaries:

- `sk-prompt/assets/model-profiles.json`: update the existing `minimax-2.7` object, not a duplicate. Set `context_length: 204800`, keep `primary_quota_pool: "minimax-api"` and `fallback_target: null`, and replace stale unverified-context language with the conservative `--variant` caveat.
- `cli-devin/assets/per-model-budgets.json`: append a `minimax-2.7` row using the current `models[]` schema: `context_length: 204800`, `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, and the existing truncation marker.
- `cli-opencode/references/context-budget.md`: add MiniMax to the cli-opencode model-window table and add the tool-round continuity caveat.
- `cli-opencode/references/cli_reference.md` and `cli-opencode/SKILL.md`: keep MiniMax explicit-request routing, but add the `--variant` exception and the routing heuristic table.
- `sk-prompt/assets/cli_prompt_quality_card.md`: add `glm-5.1` and `minimax-2.7` to Budget Awareness and include the compact routing decision table above.
- `sk-prompt-small-model/SKILL.md`: add MiniMax to the dispatch matrix and `cli-opencode` ownership row.
- `sk-prompt-small-model/references/pattern-index.md`: add only the three link-only MiniMax rows listed in Finding 1.

## Questions Answered

- The 180k-token review scenario picks MiniMax when configured because it is the only route combining the researched 143,360-token active budget with separate `minimax-api` quota isolation.
- The tight cheap edit scenario picks Qwen, not MiniMax, because MiniMax's large window is unnecessary overhead.
- The cost-sensitive batch scenario splits by evidence size: MiniMax for read-heavy or larger batched analyses, Qwen for tiny bounded edits.
- The Cognition-Pro-exhausted fallback scenario does not pick a silent fallback. The correct behavior is fail-fast, then explicitly offer MiniMax if the user wants a separate direct-provider route.
- The pattern-index rows should be three link-only MiniMax rows: context-budget adoption, direct-provider routing heuristics, and prompt-quality/variant-ablation policy.

## Questions Remaining

- Live MiniMax dispatch still needs to confirm whether `--variant high` is accepted, ignored, rejected, or behavior-changing.
- Live `opencode models minimax` still needs to confirm whether a highspeed model slug is exposed and what its exact runnable id is.
- The stale runtime-helper anchors for fallback and permissions still need a follow-up reconciliation, but that is not MiniMax-specific.

## Next Focus

Iteration 9 should produce the final implementation-ready synthesis: a minimal ordered patch plan with validation commands, stale-anchor handling, and a no-duplicate checklist for `model-profiles.json`, `per-model-budgets.json`, `cli-opencode`, `sk-prompt`, and `sk-prompt-small-model`.
