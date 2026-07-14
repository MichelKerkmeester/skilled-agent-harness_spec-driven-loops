# Iteration 1: Q1 - MiniMax 2.7 API Characteristics

## Focus

Establish MiniMax 2.7 API characteristics that determine downstream budget, verification, routing, and provider guidance for `cli-opencode` through the direct MiniMax.io API path.

## Actions Taken

- Read the deep-research strategy and current state log to confirm Q1 is the first focus and no previous iteration findings exist. [SOURCE: .opencode/specs/cli-external-orchestration/019-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-strategy.md]
- Searched official MiniMax API documentation for model overview, compatible API surfaces, rate limits, token-plan limits, pay-as-you-go pricing, tool use, prompt caching, and coding-tool setup.
- Inspected the just-added local `cli-opencode` provider documentation and the shared small-model registry entry for `minimax-2.7`. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:150] [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:187]
- Checked the 114 infrastructure extension points: model registry, context-budget mirror, pattern index, and permissions matrix. [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:10] [SOURCE: .opencode/skills/sk-prompt-models/references/pattern-index.md:33] [SOURCE: .opencode/skills/cli-opencode/references/permissions-matrix.md:31]

## Findings

### F1 - Context window is confirmed and should replace the registry placeholder

Official MiniMax docs list `MiniMax-M2.7` and `MiniMax-M2.7-highspeed` with a 204,800-token context window. The same model overview reports approximately 60 tps for the normal model and 100 tps for highspeed. [SOURCE: https://platform.minimax.io/docs/guides/text-generation#L97-L105]

The local registry still has `context_length: null` and notes that context length is unverified. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:187] [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:197]

Concrete delta: update `.opencode/skills/sk-prompt/assets/model-profiles.json` for `minimax-2.7` to `context_length: 204800`; revise weaknesses/notes to say context is verified, while `--variant` remains unverified; add MiniMax to `.opencode/skills/cli-opencode/references/context-budget.md` as a 204,800-token cli-opencode model, slightly above Kimi's current 200,000-token entry.

### F2 - The direct MiniMax provider should prefer the Anthropic-compatible path when reasoning/tool state matters

MiniMax documents both Anthropic-compatible and OpenAI-compatible APIs, but its model invocation guide marks the Anthropic-compatible endpoint as recommended and says it supports thinking blocks and interleaved thinking. [SOURCE: https://platform.minimax.io/docs/guides/text-generation#L126-L147]

The dedicated Anthropic-compatible page shows `thinking` as a supported input parameter, supports text/tool/thinking message blocks, and says image/document inputs are not supported. [SOURCE: https://platform.minimax.io/docs/api-reference/text-anthropic-api#L165-L169] [SOURCE: https://platform.minimax.io/docs/api-reference/text-anthropic-api]

The local `cli-opencode` docs already model MiniMax as a direct provider, but they do not yet say that preserving reasoning blocks matters for multi-turn tool use. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:198] [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:211]

Concrete delta: add a MiniMax provider note to `cli_reference.md` saying MiniMax efficiency depends on retaining full assistant messages across tool rounds, including thinking/reasoning/tool-use blocks when the provider emits them. Do not collapse tool-call history to text-only summaries unless the context-budget engine is intentionally evicting older state.

### F3 - Tool calling is native, but interleaved-thinking continuity is a hard requirement

MiniMax says M2.7 has native tool use and interleaved thinking. For multi-turn function-call conversations, its docs require returning the complete assistant response to history, including tool calls and reasoning fields. [SOURCE: https://platform.minimax.io/docs/guides/text-m2-function-call#L81-L85] [SOURCE: https://platform.minimax.io/docs/guides/text-m2-function-call#L109-L118]

The current registry already marks `tool_calling` as `native`, so the field is directionally correct. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:189]

Concrete delta: leave `tool_calling: "native"` in the registry, but add a verification recipe note under the `cli-opencode` MiniMax docs: for agent/tool tests, verify not only final text but also that tool calls, tool results, and reasoning/tool-use continuity survive event parsing.

### F4 - Pricing supports a cost-efficient routing profile, with highspeed as an explicit cost/latency trade

MiniMax pay-as-you-go pricing lists M2.7 at $0.30 per million input tokens and $1.20 per million output tokens. The highspeed variant is double that: $0.60 input and $2.40 output per million tokens. Prompt caching is cheaper on reads and more expensive on writes. [SOURCE: https://platform.minimax.io/docs/guides/pricing-paygo#L62-L78]

Token Plan pricing is request-quota based: monthly Starter/Plus/Max provide 1,500/4,500/15,000 M2.7 requests per 5 hours; highspeed plans provide 4,500/15,000/30,000 M2.7-highspeed requests per 5 hours. [SOURCE: https://platform.minimax.io/docs/guides/pricing-token-plan#L60-L72]

Concrete delta: extend MiniMax registry notes with pay-as-you-go and token-plan metadata, or add a small `pricing` object if the model-profile schema permits it. Routing guidance should treat M2.7 as cheap enough for long-context background coding/research, while reserving highspeed for latency-sensitive runs after a live provider model-id check confirms it is exposed by `opencode models minimax`.

### F5 - Rate limits are high enough that fallback should be quota-aware, not same-pool retry

Official rate limits list M2.7/M2.7-highspeed at 500 RPM and 20,000,000 TPM for the LLM API. [SOURCE: https://platform.minimax.io/docs/guides/rate-limits#L117-L124]

The local registry correctly separates MiniMax into `primary_quota_pool: "minimax-api"` and has no fallback target yet. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:193] [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:200]

Concrete delta: keep `quota_pool: "minimax-api"` and `fallback_target: null` until Q4 identifies a different-pool target. The 114 fallback invariant says no same-pool retry; MiniMax's highspeed sibling still appears to be the same MiniMax provider/pool, so it should be a deliberate user/model choice, not an automatic quota fallback. [SOURCE: .opencode/skills/sk-prompt-models/references/pattern-index.md:39]

### F6 - `--variant` remains unverified; MiniMax API exposes reasoning support but not OpenCode variant mapping

The local `cli-opencode` docs correctly mark MiniMax `--variant` behavior as unverified. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:202] [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:211]

MiniMax docs confirm reasoning/thinking support, but they do not document OpenCode's `--variant minimal|low|medium|high|max` mapping for the `minimax` provider. The Anthropic-compatible docs also list `service_tier` as ignored, which argues against assuming `--variant high` maps to a MiniMax speed tier. [SOURCE: https://platform.minimax.io/docs/api-reference/text-anthropic-api]

Concrete delta: keep the default `--variant high` as the broad cli-opencode behavior, but add a MiniMax caveat: variant should be treated as pass-through/unverified until an ablation proves effect. If `MiniMax-M2.7-highspeed` is exposed, route it as a distinct model id rather than pretending `--variant` toggles highspeed.

### F7 - Official OpenCode setup creates a model-id/casing verification task

MiniMax's OpenCode setup shows `opencode auth login` provider selection and an alternate provider config using `@ai-sdk/anthropic`, `baseURL: "https://api.minimax.io/anthropic/v1"`, and model name `MiniMax-M2.7`. [SOURCE: https://platform.minimax.io/docs/guides/text-ai-coding-tools#L487-L557]

The local `cli-opencode` docs use `--model minimax/minimax-2.7`. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:167] [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md:198]

Concrete delta: add a validation step to `cli-opencode` MiniMax docs: run `opencode models minimax` after login and copy the exact exposed model slug. If the live slug is `MiniMax-M2.7`, update examples and registry notes; if OpenCode normalizes to `minimax-2.7`, keep the local slug and document the alias/casing difference.

### F8 - Prompt-efficiency guidance maps cleanly onto the 114 context-budget engine

MiniMax usage tips recommend keeping task state visible in a single long context, splitting naturally phased tasks across windows, using structured tests/scripts, keeping system prompts concise when compression is available, and evaluating prompt changes against representative cases. [SOURCE: https://platform.minimax.io/docs/token-plan/prompting-best-practices#L413-L471]

The 114 pattern index already points to the context-budget engine, output-verification pipeline, confidence scoring, and model registry rather than duplicating logic in `sk-prompt-models`. [SOURCE: .opencode/skills/sk-prompt-models/references/pattern-index.md:35] [SOURCE: .opencode/skills/sk-prompt-models/references/pattern-index.md:48]

Concrete delta: update `sk-prompt-models` MiniMax guidance as a thin pointer: "Use the existing context-budget engine with a 204,800-token window; keep current plan/status/open questions in the retained working set; use the existing 4-stage verification pipeline; add MiniMax-specific checks for reasoning/tool-use continuity."

## Sources Consulted

- MiniMax Model Invocation: https://platform.minimax.io/docs/guides/text-generation
- MiniMax Compatible Anthropic API: https://platform.minimax.io/docs/api-reference/text-anthropic-api
- MiniMax Tool Use & Interleaved Thinking: https://platform.minimax.io/docs/guides/text-m2-function-call
- MiniMax Pay as You Go pricing: https://platform.minimax.io/docs/guides/pricing-paygo
- MiniMax Token Plan pricing: https://platform.minimax.io/docs/guides/pricing-token-plan
- MiniMax Rate Limits: https://platform.minimax.io/docs/guides/rate-limits
- MiniMax M-series Usage Tips: https://platform.minimax.io/docs/token-plan/prompting-best-practices
- MiniMax for AI Coding Tools: https://platform.minimax.io/docs/guides/text-ai-coding-tools
- `.opencode/skills/sk-prompt/assets/model-profiles.json`
- `.opencode/skills/cli-opencode/references/cli_reference.md`
- `.opencode/skills/cli-opencode/references/context-budget.md`
- `.opencode/skills/sk-prompt-models/references/pattern-index.md`
- `.opencode/skills/cli-opencode/references/permissions-matrix.md`

## Questions Answered

- Q1 is substantially answered for context window, tool-calling, pricing, token-plan limits, rate limits, recommended API surface, and latency proxy via documented tps.
- Q1 remains partially open for real observed `cli-opencode` latency and exact live OpenCode model slug/casing, because those require a configured `MINIMAX_API_KEY` and `opencode models minimax`.
- Q1 remains open for `--variant` mapping because MiniMax docs confirm reasoning support but do not define how OpenCode variants map to MiniMax API parameters.

## Questions Remaining

- Q2: Derive the MiniMax context-budget tuple and output-verification recipe from the confirmed 204,800-token window and interleaved-tool continuity requirement.
- Q3: Define prompt-quality/RCAF patterns and a safe `--variant` policy, likely with an ablation recipe before any strong mapping claim.
- Q4: Decide quota fallback behavior for `minimax-api`, including whether any different-pool fallback should target DeepSeek/Kimi/GLM.
- Q5: Produce final routing heuristics and concrete deltas across `sk-prompt-models` and `cli-opencode`.

## Assessment

`newInfoRatio`: 0.92.

Novelty justification: this pass converts several placeholders into sourced facts: 204,800 context, native tool use, interleaved thinking continuity, pay-as-you-go pricing, token-plan quotas, RPM/TPM limits, and speed classes. The main uncertainty left is runtime-specific: OpenCode model slug normalization and whether `--variant` affects MiniMax.

Confidence: high for official API/pricing/context facts; medium for file-level deltas because schema choices and live provider exposure need validation in later iterations.

## Reflection

What worked: official MiniMax docs now expose enough current facts to unblock Q2 budget work without inventing new infrastructure.

What failed: no live `opencode models minimax` or dispatch test was run, so model slug/casing, highspeed exposure, and `--variant` behavior remain runtime validation tasks.

Ruled out: treating `--variant high` as MiniMax highspeed. The docs point to highspeed as a separate model/pricing class, not a documented OpenCode variant.

## Next Focus

Q2: Map MiniMax's 204,800-token context and interleaved-tool continuity requirements onto the 114 context-budget tuple and 4-stage output-verification recipe, without duplicating the canonical `cli-devin` budget engine.
