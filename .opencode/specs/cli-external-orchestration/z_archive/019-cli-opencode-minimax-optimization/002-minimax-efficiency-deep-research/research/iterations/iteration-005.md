# Iteration 5: Q5 - MiniMax Routing Heuristics and Patch-Ready Deltas

## Focus

Define routing heuristics for MiniMax 2.7 versus DeepSeek-v4-pro, Qwen3.6, Kimi-k2.6, and GLM-5.1, then consolidate Q1-Q4 into concrete follow-up deltas for `sk-prompt-models`, `sk-prompt`, and `cli-opencode`.

## Actions Taken

- Read the current state log to preserve Q1-Q4 decisions: 204,800 context, 143,360 active budget, conservative MiniMax `--variant` policy, `minimax-api` quota isolation, null fallback target, and provider-neutral permissions. [SOURCE: .opencode/specs/cli-external-orchestration/019-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl]
- Read iteration 3 and 4 narratives to carry forward the MiniMax prompt-quality, variant-ablation, quota-pool, fallback, and permissions findings without re-opening settled questions. [SOURCE: .opencode/specs/cli-external-orchestration/019-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-003.md] [SOURCE: .opencode/specs/cli-external-orchestration/019-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-004.md]
- Inspected the existing 114 registry and budget surfaces to identify exact patch points: `model-profiles.json`, `per-model-budgets.json`, the canonical `cli-devin` context-budget reference, the `cli-opencode` context-budget mirror, the OpenCode CLI reference, and the small-model pattern index. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json] [SOURCE: .opencode/skills/cli-devin/assets/per-model-budgets.json] [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md] [SOURCE: .opencode/skills/sk-prompt-models/references/pattern-index.md]
- Checked official MiniMax and OpenCode docs for the remaining externally variable facts: MiniMax M2.7 and M2.7-highspeed both publish 204,800-token context windows, while OpenCode documents variants as provider/model-specific settings and does not prove a built-in MiniMax `--variant high` mapping. [SOURCE: https://platform.minimax.io/docs/guides/text-generation] [SOURCE: https://dev.opencode.ai/docs/models/]

## Findings

### F1 - MiniMax should be routed as a large-context, separate-pool cli-opencode model, not as the universal small-model default

MiniMax 2.7 should be preferred when all three are true: the user wants `cli-opencode`, `minimax` auth is configured, and the task benefits from either the 204,800-token window or the isolated `minimax-api` pool. The strongest cases are large local evidence bundles, long tool-result continuity, broad codebase inspection, or cost-conscious iteration when preserving `opencode-go` and Cognition quota matters.

Do not make MiniMax the default for every cli-opencode dispatch. `deepseek-v4-pro` remains the safer default for complex root-cause reasoning when 64,000 tokens is enough and the selected DeepSeek pool is available. `qwen3.6` remains suitable for tight, bounded edits where 32,000 tokens is enough and opencode-go quota is deliberately being used. `kimi-k2.6` remains a long-context option with an already-established 200,000-token profile, but MiniMax is the better candidate when separate-pool isolation or highspeed model selection matters. `glm-5.1` remains a structured long-context synthesis option at 128,000 tokens; MiniMax wins when the retained evidence set exceeds that window or `opencode-go` should be avoided.

Concrete routing rule: choose MiniMax for explicit MiniMax requests, `minimax-api` quota isolation, or evidence sets that need around 140,000 active prompt tokens after applying the 70 percent budget rule. Otherwise choose by task shape: DeepSeek for hardest reasoning, Qwen for narrow cheap loops, Kimi for established long-context OpenCode Go runs, GLM for broad structured synthesis.

### F2 - MiniMax's highspeed path is model selection, not `--variant high`

Official MiniMax docs list `MiniMax-M2.7` and `MiniMax-M2.7-highspeed` as separate model names with the same 204,800-token window and different output speeds. OpenCode docs describe variants as provider/model-specific configuration, with built-in examples for common providers but no MiniMax-specific proof in the public docs.

Therefore the patch should keep direct MiniMax dispatches conservative: omit `--variant` by default for `--model minimax/minimax-2.7`. If `opencode models minimax` exposes a highspeed slug, route to that exact model id when latency is the priority. Only promote a MiniMax variant default after the ablation from iteration 3 proves observable provider behavior.

### F3 - The 114 budget tuple extends cleanly: 204,800 context, 143,360 active budget, 61,440 reserve

The existing budget engine uses `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, and `[... truncated %d tokens]` markers. Applying the same tuple to MiniMax gives:

| Field | Value |
| --- | ---: |
| `context_length` | 204,800 |
| `max_budget_pct` | 70 |
| Dynamic budget | 143,360 |
| Reserve | 61,440 |
| `working_memory_tokens` | 500 |
| `summary_threshold_lines` | 200 |

The only MiniMax-specific caveat is continuity: because MiniMax is being adopted for agentic/tool-use contexts, prompt composition should trim only old or complete message-boundary spans and must not split an active tool-call/tool-result round.

### F4 - Patch-ready file deltas

`.opencode/skills/sk-prompt/assets/model-profiles.json`

- Change `minimax-2.7.context_length` from `null` to `204800`.
- Keep `executors[0].executor: "cli-opencode"`, `provider: "minimax"`, `quota_pool: "minimax-api"`, `primary_quota_pool: "minimax-api"`, and `fallback_target: null`.
- Replace the executor note with: direct MiniMax.io API key, bypasses opencode-go, 204,800-token context verified, omit `--variant` by default, highspeed is a distinct model id if exposed.
- Update strengths to include `204,800-token context window`, `143,360-token active budget under the 70 percent 114 rule`, `separate minimax-api quota pool`, and `direct MiniMax.io API access`.
- Update weaknesses to remove "context length unverified" and retain real caveats: single executor path, no automatic fallback, MiniMax `--variant` mapping unverified, live latency/quality benchmarks still pending.
- Leave `avg_iter_wall_clock_min` as `null` until measured; do not invent a benchmark.

`.opencode/skills/cli-devin/assets/per-model-budgets.json`

- Add a `minimax-2.7` model entry even though dispatch is owned by `cli-opencode`, because this asset is the canonical Phase 004 budget table mirrored by cli-opencode.
- Entry values: `provider: "MiniMax"`, `context_length: 204800`, `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, `truncation_marker_template: "[... truncated %d tokens]"`.
- Notes: `Direct MiniMax.io path via cli-opencode. 70% budget yields 143360 tokens; reserve is 61440 tokens. Omit --variant by default pending ablation.`

`.opencode/skills/cli-devin/references/context-budget.md`

- Update the active small-model set sentence to include MiniMax-2.7 as a cli-opencode-owned direct-provider budget participant.
- Add a per-model table row: `minimax-2.7 | MiniMax | 204,800 | 143,360 | active via cli-opencode direct MiniMax.io API`.
- Add one caveat below the table: MiniMax follows the same budget rule, but prompt composers must preserve complete active tool-call/tool-result rounds when trimming.

`.opencode/skills/cli-opencode/references/context-budget.md`

- Add MiniMax to the cli-opencode model-window table: `minimax-2.7 | 204,800 | Direct MiniMax.io API; separate minimax-api quota pool; 143,360-token active budget; preserve active tool-round continuity.`
- Replace "Kimi-k2.6 above SWE-1.6" wording with a comparison that includes MiniMax: MiniMax and Kimi are the largest cli-opencode windows, while DeepSeek, GLM, and Qwen require tighter prompt packs.
- Add a MiniMax-specific routing note: use MiniMax when the evidence bundle would pressure DeepSeek/GLM/Qwen windows or when quota isolation from `opencode-go` is desired.

`.opencode/skills/cli-opencode/references/cli_reference.md`

- Update the model table row for `minimax/minimax-2.7` to mention 204,800-token context and separate `minimax-api` quota pool.
- Add `minimax/minimax-2.7-highspeed` only if `opencode models minimax` exposes that exact slug; document it as model selection, not a variant.
- In "cli-opencode default invocation shape", add a MiniMax exception: omit `--variant high` for `--model minimax/...` until ablation proves a provider mapping.
- Replace the MiniMax variant row with: `omit by default; public docs do not prove a built-in MiniMax --variant mapping; highspeed is a distinct model id if exposed`.
- Add a routing heuristics table: MiniMax for 204,800 context and `minimax-api` isolation; DeepSeek for hardest reasoning/root-cause tasks; Qwen for narrow bounded edits; Kimi for established long-context opencode-go runs; GLM for structured broad synthesis.
- Add the iteration 3 ablation recipe near the variant section.
- Keep the auth-preflight rule: if MiniMax was requested but not configured, ask for `opencode providers login minimax`; do not substitute silently.

`.opencode/skills/sk-prompt-models/references/pattern-index.md`

- Add a row for "MiniMax direct-provider routing heuristics" owned by `cli-opencode`, pointing to `../../cli-opencode/references/cli_reference.md`, shipped in packet `120/002`.
- Add a row for "MiniMax context-budget adoption" owned by `cli-opencode` plus `cli-devin`, pointing to `../../cli-opencode/references/context-budget.md` and `../../cli-devin/assets/per-model-budgets.json`, shipped in `120/002`.
- Add a row for "MiniMax prompt-quality and variant-ablation policy" owned by `cli-opencode`, pointing to `../../cli-opencode/assets/prompt_quality_card.md` and `../../cli-opencode/references/cli_reference.md`, shipped in `120/002`.
- Do not copy the full policy into the sentinel; keep this file link-only.

`.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`

- Update Budget Awareness to include `minimax-2.7` in the small-model list.
- Add one sentence: MiniMax direct-provider prompts can carry larger retained evidence sets, but still use the same budget markers and must not infer trimmed content.

`.opencode/skills/cli-opencode/assets/prompt_quality_card.md`

- Add the MiniMax direct-API prompt note from iteration 3: RCAF default, CRISPE for research, medium-density pre-plan, exact repo/file/model anchors, concise rationale for non-obvious constraints, and active tool-round continuity.

`.opencode/skills/cli-opencode/references/permissions-matrix.md`

- Add a provider-neutral note: direct MiniMax tool calls inherit the active structured permissions matrix unchanged; provider/model selection does not create a separate permission policy.

Optional test/documentation deltas for the follow-up implementation packet:

- Extend the fallback-router unit tests with a `minimax-2.7` null-target fail-fast case and, if a separate-pool fallback is ever adopted, one positive separate-pool case.
- Do not add `resolveMiniMaxFallback`, MiniMax-only permission schema fields, or same-pool retry behavior.

## Questions Answered

- Q5 routing heuristics: MiniMax is preferred for explicit MiniMax dispatches, 204,800-token evidence sets, `minimax-api` quota isolation, and latency-sensitive runs only when the highspeed model id is explicitly selected. DeepSeek remains the hardest-reasoning default, Qwen remains narrow-scope, Kimi remains established long-context through opencode-go/Cognition, and GLM remains structured broad synthesis.
- Q5 deltas: the follow-up patch should touch `model-profiles.json`, canonical and mirrored budget docs/assets, `cli_reference.md`, `pattern-index.md`, prompt-quality cards, and a permissions note. The fallback target remains null.
- Q1-Q4 consolidation: no new runtime should be built. The work extends the 114 registry, budget engine, verification pipeline, fallback semantics, and permissions matrix.

## Questions Remaining

- Live latency and quality numbers remain unmeasured. Keep `avg_iter_wall_clock_min: null` until a controlled `MiniMax-M2.7` and `MiniMax-M2.7-highspeed` ablation runs.
- Exact highspeed model slug must be verified with `opencode models minimax` before documenting a runnable command.
- Whether MiniMax should become the default cli-opencode model is not supported by current evidence; leave default selection unchanged unless later benchmarks beat DeepSeek on quality and stability.

## Next Focus

All five research questions are now answered at the research-artifact level. Next step is synthesis or an implementation packet that applies the patch-ready deltas above and runs the relevant documentation/JSON validation.
