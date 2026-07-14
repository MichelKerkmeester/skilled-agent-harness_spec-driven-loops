# Iteration 9: MiniMax Hardening, Negative Knowledge, And Patch Text

## Focus

Harden the MiniMax-2.7 via `cli-opencode` recommendations before synthesis: enumerate risks and mitigations, record what not to do, and finalize exact patch text for the follow-on implementation packet.

## Actions Taken

1. Read the current iteration state log and iteration 8 artifacts to avoid duplicating previously settled rows and policies. [SOURCE: `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-008.md`]
2. Rechecked live target shapes for `model-profiles.json`, `per-model-budgets.json`, `cli-opencode/references/context-budget.md`, `cli-opencode/SKILL.md`, `cli-opencode/references/cli_reference.md`, `sk-prompt/assets/cli_prompt_quality_card.md`, and `sk-prompt-models` index files. [SOURCE: `.opencode/skills/sk-prompt/assets/model-profiles.json`] [SOURCE: `.opencode/skills/cli-devin/assets/per-model-budgets.json`] [SOURCE: `.opencode/skills/cli-opencode/references/context-budget.md`] [SOURCE: `.opencode/skills/cli-opencode/SKILL.md`] [SOURCE: `.opencode/skills/cli-opencode/references/cli_reference.md`] [SOURCE: `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`] [SOURCE: `.opencode/skills/sk-prompt-models/SKILL.md`] [SOURCE: `.opencode/skills/sk-prompt-models/references/pattern-index.md`]
3. Compared the current MiniMax direct-provider docs against the hardened policies from iterations 6-8: no duplicate registry entry, no default `--variant`, no silent fallback, no MiniMax-specific permission or verification fork.
4. Converted the final recommendations into patch-ready replacement snippets and insertion blocks.

## Findings

### Finding 1: MiniMax has five operational failure modes that need explicit guardrails

| Risk / failure mode | Why it matters | Mitigation |
| --- | --- | --- |
| RPM/TPM throttling on the direct MiniMax.io provider | A large 143,360-token active budget can still fail if request or token rate limits are saturated. | Pre-flight `opencode providers list`; on throttling, fail fast with the provider error, preserve the prompt/artifact paths, and retry only after an explicit delay or user approval. Do not auto-route to another pool. |
| Cost runaway on 204,800-token contexts | Pay-as-you-go direct API calls can become expensive when the operator treats the full context as free scratch space. | Keep the active budget at 70 percent, summarize before dispatch, prefer MiniMax only for large retained-evidence or quota-isolation tasks, and add a quality-card routing row that sends narrow edits to Qwen. |
| Hang or timeout behavior in non-interactive `opencode run` | Long MiniMax calls plus inherited stdin can look like provider latency or a model stall. | Keep `</dev/null` mandatory for every non-interactive invocation, capture stdout/stderr separately for ablation, and use explicit timeouts in external harnesses. |
| `--variant` no-op or rejection | `cli-opencode` defaults `--variant high` for OpenCode Go, but MiniMax provider behavior is unverified. | Omit `--variant` on MiniMax by default. Promote only after the paired ablation proves clean exits and meaningful quality gain within the latency ceiling. |
| `minimax-api` single-path exhaustion | The current registry has `fallback_target: null`, so there is no verified separate-pool fallback from MiniMax. | Keep fail-fast semantics. Offer MiniMax as an explicit alternate when other pools are exhausted, but never silently substitute from or to MiniMax. |

### Finding 2: Negative knowledge is now as important as the positive route

Do not assert that `--variant high` maps to MiniMax reasoning effort until the ablation passes. The docs should say "omit by default" and describe the promotion rule.

Do not duplicate the `minimax-2.7` registry entry or add second provider rows for the same direct path. Phase 001 already added the single active executor path with `provider: "minimax"` and `quota_pool: "minimax-api"`.

Do not add MiniMax-specific runtime branches for permissions, fallback, or output verification. Permissions are scope/operation based; fallback is registry driven; verification is output-shape driven.

Do not add MiniMax-specific rows for generic permissions, fallback, or output verification to `sk-prompt-models/references/pattern-index.md`. The sentinel stays thin and link-only.

Do not make MiniMax the default `cli-opencode` model. Keep `opencode-go/deepseek-v4-pro --variant high` as the default and route MiniMax only when the task shape or user request warrants it.

Do not silently consume large MiniMax contexts for cheap/narrow edits. `opencode-go/qwen3.6` remains the better bounded-edit route when the evidence set fits.

Do not treat `minimax-2.7-highspeed` as implied by `--variant high`. If a highspeed slug exists, it is a distinct model id to confirm with `opencode models minimax`.

### Finding 3: Exact patch text for `.opencode/skills/sk-prompt/assets/model-profiles.json`

Replace the existing `minimax-2.7` object with this object. Keep array placement unchanged.

```json
{
  "id": "minimax-2.7",
  "context_length": 204800,
  "tool_calling": "native",
  "chat_template": "default",
  "executors": [
    {
      "executor": "cli-opencode",
      "provider": "minimax",
      "quota_pool": "minimax-api",
      "status": "active",
      "notes": "Direct MiniMax.io API key (`MINIMAX_API_KEY`). Bypasses opencode-go; use for large retained-evidence prompts or explicit minimax-api quota isolation. Omit `--variant` by default until 120/002 ablation proves accepted and beneficial behavior."
    }
  ],
  "primary_quota_pool": "minimax-api",
  "fallback_target": null,
  "free_tier": false,
  "strengths": [
    "204800-token context window with 143360-token active budget under the 70 percent rule",
    "separate quota pool (minimax-api) independent of cognition/opencode-go",
    "direct MiniMax.io API access for large read-heavy analyses"
  ],
  "weaknesses": [
    "single executor path (no fallback if minimax-api unavailable)",
    "`--variant`/reasoning-effort mapping unverified pending live ablation",
    "large context can create pay-as-you-go cost exposure if used for narrow edits"
  ],
  "avg_iter_wall_clock_min": null,
  "status": "active"
}
```

### Finding 4: Exact patch text for `.opencode/skills/cli-devin/assets/per-model-budgets.json`

Insert this object after the existing `qwen3.6` row and before optional stubs.

```json
{
  "id": "minimax-2.7",
  "provider": "MiniMax",
  "context_length": 204800,
  "max_budget_pct": 70,
  "working_memory_tokens": 500,
  "summary_threshold_lines": 200,
  "truncation_marker_template": "[... truncated %d tokens]",
  "notes": "Direct MiniMax.io route via cli-opencode. 70% budget yields 143360 tokens; preserve complete active tool-call/tool-result spans when trimming."
}
```

### Finding 5: Exact patch text for `.opencode/skills/cli-opencode/references/context-budget.md`

Replace the model-window table under `## cli-opencode-specific notes` with this table.

```markdown
| Model | Context window | 70% active budget | cli-opencode note |
| --- | ---: | ---: | --- |
| `deepseek-v4-pro` | 64,000 | 44,800 | Default cli-opencode model; keep prompts tighter than SWE-1.6. |
| `kimi-k2.6` | 200,000 | 140,000 | Long-context opencode-go route; useful when opencode-go quota is available and MiniMax isolation is not needed. |
| `qwen3.6` | 32,000 | 22,400 | Smallest active cli-opencode window; best for narrow bounded edits with exact file anchors. |
| `minimax-2.7` | 204,800 | 143,360 | Direct MiniMax.io API route; use for large retained-evidence prompts, active tool-round continuity, or explicit `minimax-api` quota isolation. |
```

Add this paragraph after the table.

```markdown
MiniMax has the largest active budget in the current cli-opencode small-model set, but it is not the default. Use it when the retained evidence would otherwise need aggressive splitting or when isolating spend from `opencode-go` / Cognition matters. When trimming MiniMax prompts, preserve complete active tool-call/tool-result spans and evict only older or complete message-boundary spans; never leave an active tool round half-retained.
```

### Finding 6: Exact patch text for `.opencode/skills/cli-opencode/SKILL.md`

Add this paragraph after the `### Model Selection` paragraph that begins `Run opencode providers list`.

```markdown
MiniMax direct-provider exception: when the user explicitly requests MiniMax or the task shape requires a very large retained-evidence bundle, dispatch with `--model minimax/minimax-2.7` and omit `--variant` by default. Keep `opencode-go/deepseek-v4-pro --variant high` as the default route. MiniMax is a separate `minimax-api` quota pool, not a silent fallback from `opencode-go`, Cognition, or DeepSeek.
```

Add this compact table immediately after that paragraph.

```markdown
| Task shape | Preferred cli-opencode route | Reason |
| --- | --- | --- |
| Hard root-cause reasoning within 44,800 active tokens | `opencode-go/deepseek-v4-pro --variant high` | Default strong reasoning route. |
| Narrow bounded edit within 22,400 active tokens | `opencode-go/qwen3.6 --variant high` | Smaller adequate route for cheap tight loops. |
| Established long-context task within 140,000 active tokens | `opencode-go/kimi-k2.6 --variant high` | Long-context route through the existing opencode-go pool. |
| Structured synthesis within 89,600 active tokens | `opencode-go/glm-5.1 --variant high` | Broad synthesis route when the evidence fits. |
| Large evidence bundle, active tool-round continuity, or quota isolation | `minimax/minimax-2.7` | 204,800-token window, 143,360 active budget, separate `minimax-api` pool; omit `--variant` pending ablation. |
```

### Finding 7: Exact patch text for `.opencode/skills/cli-opencode/references/cli_reference.md`

In the `### Reasoning effort via --variant` table, replace the MiniMax row with:

```markdown
| `minimax` (`minimax-2.7`) | Omit by default. `--variant` behavior is unverified; promote only after the MiniMax no-variant vs `--variant high` ablation proves accepted and beneficial behavior. |
```

Replace the sentence after the table with:

```markdown
Default skill behavior: pass `--variant high` for the default `opencode-go/deepseek-v4-pro` route. For `minimax/minimax-2.7`, omit `--variant` unless the operator explicitly requests an ablation or a later validated policy updates this row.
```

Add this subsection after the reasoning-effort text.

```markdown
### MiniMax direct-provider routing

Use `minimax/minimax-2.7` for explicit MiniMax requests, large retained-evidence prompts, active tool-round continuity, or quota isolation from `opencode-go` / Cognition. The current budget tuple is 204,800 context tokens with a 143,360-token active budget under the shared 70 percent rule.

Do not silently substitute MiniMax when another provider is missing or exhausted. MiniMax uses the separate `minimax-api` pool and currently has `fallback_target: null` in the model registry, so exhaustion remains fail-fast unless the user explicitly chooses a different provider.
```

### Finding 8: Exact patch text for `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`

Replace the `### Budget Awareness` paragraph with this text and table.

```markdown
Prompts targeting small models (`swe-1.6`, `deepseek-v4-pro`, `kimi-k2.6`, `qwen3.6`, `glm-5.1`, `minimax-2.7`) must respect the per-model context windows and quota metadata in `sk-prompt/assets/model-profiles.json`. Use `cli-devin/references/context-budget.md` as the canonical Phase 004 source for budget composition patterns; if evidence is trimmed, mark the boundary with `[... truncated N tokens]`, where `N` is the estimated token deficit and the model must not infer the omitted content.

| Task shape | Preferred small-model route | Budget / quota reason | Dispatch note |
| --- | --- | --- | --- |
| Hard root-cause reasoning with <=44k active prompt tokens | `opencode-go/deepseek-v4-pro --variant high` | Strong default reasoning route; 64k window / 44.8k active budget | Keep current cli-opencode default. |
| Narrow bounded edit with <=22k active prompt tokens | `opencode-go/qwen3.6 --variant high` | Smallest adequate window; cheap tight-loop route | Use exact file anchors and concise acceptance criteria. |
| Established long-context opencode-go task with <=140k active prompt tokens | `opencode-go/kimi-k2.6 --variant high` | 200k window / 140k active budget through the existing opencode-go path | Prefer when opencode-go quota is available and MiniMax isolation is not needed. |
| Structured broad synthesis with <=89k active prompt tokens | `opencode-go/glm-5.1 --variant high` | 128k window / 89.6k active budget; synthesis-oriented route | Prefer for organized comparison/synthesis over narrow edits. |
| Large evidence bundle, active tool-round continuity, or quota isolation from opencode-go/Cognition | `minimax/minimax-2.7` | 204.8k window / 143.36k active budget; separate `minimax-api` pool | Omit `--variant` by default; preserve complete active tool-call/tool-result spans. |
| Cognition/opencode-go pool exhausted and no configured separate fallback | Fail fast; ask before using direct MiniMax | Fallback is opt-in and same-pool retry is banned | Never silently substitute MiniMax. |
```

### Finding 9: Exact patch text for `.opencode/skills/sk-prompt-models/SKILL.md`

Insert this row in the dispatch matrix after `GLM-5.1`.

```markdown
| MiniMax-2.7 | `cli-opencode` -> minimax (minimax-api) | active (single direct-provider path; omit `--variant` pending ablation) |
```

Replace the `cli-opencode` ownership row with:

```markdown
| `cli-opencode` | DeepSeek API direct path + opencode-go pool (DeepSeek/Kimi/Qwen/GLM) + MiniMax.io direct provider (MiniMax-2.7) — budget propagation mirror, permissions matrix schema, structured permissions reference, MiniMax routing/variant caveats |
```

In `ALWAYS` rule 5, replace the in-scope model list with:

```markdown
Honor the in-scope model set — SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, and MiniMax-2.7 required; Haiku, Gemini Flash optional. Frontier models (Opus, Sonnet, gpt-5.5) are explicitly out of scope.
```

### Finding 10: Exact patch text for `.opencode/skills/sk-prompt-models/references/pattern-index.md`

Insert these rows after the existing `sk-prompt budget awareness` row.

```markdown
| MiniMax context-budget adoption (204,800 context, 143,360 active budget, tool-round continuity) | `cli-devin` + `cli-opencode` | [`../../cli-devin/assets/per-model-budgets.json`](../../cli-devin/assets/per-model-budgets.json) + [`../../cli-opencode/references/context-budget.md`](../../cli-opencode/references/context-budget.md) | 120/002 |
| MiniMax direct-provider routing heuristics (large-context + `minimax-api` quota isolation; no silent substitution) | `cli-opencode` | [`../../cli-opencode/references/cli_reference.md`](../../cli-opencode/references/cli_reference.md) + [`../../cli-opencode/SKILL.md`](../../cli-opencode/SKILL.md) | 120/002 |
| MiniMax prompt-quality and variant-ablation policy (RCAF/CLEAR defaults; omit `--variant` until proven) | `cli-opencode` + `sk-prompt` | [`../../cli-opencode/references/cli_reference.md`](../../cli-opencode/references/cli_reference.md) + [`../../sk-prompt/assets/cli_prompt_quality_card.md`](../../sk-prompt/assets/cli_prompt_quality_card.md) | 120/002 |
```

### Finding 11: Exact patch text for optional MiniMax ablation playbook

If the follow-on packet adds a concrete manual test, create `.opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/005-minimax-variant-ablation.md` with this body.

````markdown
# CO-013: MiniMax Variant Ablation

## Purpose

Verify whether `--variant high` changes direct MiniMax behavior before documenting or defaulting any MiniMax reasoning-effort mapping.

## Commands

Run each command three times and compare medians.

```bash
PROMPT='Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence. Return: decision, 5 trade-off bullets, risk, verification step.'

/usr/bin/time -p opencode run \
  --model minimax/minimax-2.7 \
  --agent general \
  --format json \
  --dir "$(pwd)" \
  "$PROMPT" \
  </dev/null > /tmp/minimax-27-ablation-none.jsonl 2> /tmp/minimax-27-ablation-none.stderr

/usr/bin/time -p opencode run \
  --model minimax/minimax-2.7 \
  --agent general \
  --variant high \
  --format json \
  --dir "$(pwd)" \
  "$PROMPT" \
  </dev/null > /tmp/minimax-27-ablation-high.jsonl 2> /tmp/minimax-27-ablation-high.stderr
```

## Pass Criteria

- both variants exit cleanly on all paired runs;
- `--variant high` keeps the same model id and is not rejected;
- median quality improves by at least 2/10 or adds at least one meaningful trade-off dimension;
- median latency stays within 1.75x of no-variant latency.

If these criteria do not pass, keep MiniMax default as no `--variant`.
````

## Questions Answered

- MiniMax's primary operational risks are rate-limit saturation, large-context cost runaway, non-interactive hangs/timeouts, unverified `--variant` behavior, and single-path `minimax-api` exhaustion.
- Every risk has a mitigation that extends existing 114 infrastructure: budget discipline, provider pre-flight, `</dev/null`, ablation-before-promotion, and registry-driven fail-fast fallback.
- Negative knowledge is explicit: do not duplicate provider rows, do not add MiniMax runtime forks, do not silently substitute MiniMax, and do not claim `--variant` mapping without evidence.
- Exact patch text is now available for each delta target in the follow-on packet.

## Questions Remaining

- Live MiniMax auth is still needed to run `opencode models minimax` and the no-variant vs `--variant high` ablation.
- The stale runtime-helper anchors for fallback and permissions still need reconciliation, but that is not MiniMax-specific and should not block these documentation and registry deltas.

## Next Focus

Iteration 10 should synthesize the final `research.md`: ordered implementation plan, validation commands, no-duplicate checklist, and final convergence verdict.
