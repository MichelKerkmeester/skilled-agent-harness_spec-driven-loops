# Iteration 8: Authoritative per-turn injection and prompt-caching practices

## Focus

Researched official OpenAI, Anthropic, Google, and Amazon Bedrock guidance on concise instruction design, stable-prefix placement, static/dynamic ordering, cache thresholds/keys/retention, one-time versus repeated context, conditional gating, and cross-turn deduplication. The narrow interpretation is provider/API prompt caching and instruction placement, not an assumption that each of the six CLI runtimes exposes cache controls. Each practice is connected to the established six-adapter payload facts without ranking changes.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **Keep repeated policy in a stable prefix and changing turn data after it.** OpenAI says cache hits require exact prefix matches and recommends static instructions/examples first and variable user-specific content last. Anthropic independently says to put tool definitions, system instructions, context, and examples first, with a breakpoint at the reusable boundary; Google recommends large common content at the beginning and similar prefixes close in time. Applied here, the three fixed directives and any durable startup policy are static, while the advisor recommendation, Gate-3 outcome, current user text, OpenCode route summary, and continuity state are dynamic. Claude Code/Codex/Devin currently emit the advisor capsule before Gate-3, which is locally compatible with static-before-dynamic inside that per-turn payload; Cursor's configured Gate-3-before-advisor order is the reverse, Pi appends the fixed dispatch directive after dynamic advisor context, and OpenCode has no proven cross-plugin order. The six runtimes therefore do not currently present one cache-friendly ordering contract. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://ai.google.dev/gemini-api/docs/caching] [SOURCE: .opencode/hooks/injection-contract.md:44] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:196] [SOURCE: .pi/extensions/prompt-advisor.ts:103] [INFERENCE: based on the cited provider prefix rules and iterations 002/007 six-adapter composition facts]

2. **Caching does not make short repeated capsules free, and provider thresholds differ.** OpenAI automatic caching starts at 1,024 tokens. Google currently lists 2,048-token minima for Gemini 2.5 and 4,096 for Gemini 3.1/3.5 models. Anthropic says prompts below the model-specific minimum are processed without caching and reports zero cache creation/read tokens; its current model minima vary. Bedrock likewise varies by model and silently proceeds when a checkpoint is below the minimum. The measured advisor/directive/Gate/Pi blocks from iteration 3 are individually far below these thresholds, so moving or repeating those blocks cannot by itself guarantee a cache hit; they only benefit if they are part of a sufficiently long identical prefix owned by the runtime/provider. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://ai.google.dev/gemini-api/docs/caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43] [INFERENCE: based on provider thresholds plus iteration 003 measurements]

3. **A changing suffix should not be included in the reusable cache identity.** OpenAI's GPT-5.6 guidance explicitly warns that timestamps, tool history, or user input included at the implicit latest-message breakpoint can yield zero cached tokens despite a long common prefix; it recommends an explicit breakpoint after stable content, a shared `prompt_cache_key`, and explicit mode to avoid writes for the changing suffix. Anthropic gives the same failure mode: placing `cache_control` on a timestamp/current-message block causes a fresh write and no read, while placing it on the last stable block hits. For these adapters, advisor labels/scores/freshness, Gate-3 questions, current prompt text, and continuity are unsuitable members of a cross-turn stable cache key. The three invariant directives are suitable only if the host can place them before those values; the existing renderer concatenates fixed directives *after* the dynamic advisor sentence, so its whole string is not a stable-prefix unit. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:196] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:207]

4. **Keys, breakpoints, ordering, and retention are provider-specific, not portable adapter semantics.** OpenAI GPT-5.6 uses exact-prefix breakpoints plus `prompt_cache_key`, currently permits up to four new writes, considers up to the latest 50 breakpoints for reads, and documents a 30-minute default/only TTL for that family; older in-memory policies generally expire after 5–10 idle minutes and at most one hour. Anthropic processes `tools → system → messages`, supports up to four breakpoints, checks back up to 20 blocks, defaults to five minutes, and offers one hour on supported paths/models. Google Interactions exposes implicit caching only, with no explicit cache object, and only advises common prefixes in a short interval. Bedrock exposes model-dependent checkpoints and TTLs, and warns that changing earlier `tools` invalidates later `system/messages` caches. Consequently, the shared hook layer can standardize stable/dynamic content boundaries and telemetry, but cannot assume a universal cache key, breakpoint API, TTL, section order, or retention guarantee across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://ai.google.dev/gemini-api/docs/caching] [SOURCE: https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html] [INFERENCE: provider APIs are beneath runtimes whose cache-control exposure is not established by iterations 001-007]

5. **One-time context and repeated reminders solve different problems; caching is not cross-turn semantic memory.** Anthropic automatic caching advances a cache point as conversation history grows, but cached content remains part of the full prompt prefix; Google says the model makes no distinction between cached and ordinary tokens; OpenAI says caching does not change generation behavior. Thus cache reuse reduces prefill cost/latency but does not deduplicate model-visible instructions or guarantee that a startup instruction survives host compaction. SessionStart context in Claude Code/Codex/Cursor/Devin/Pi is appropriately one-time for stable session facts, but moving a guardrail there requires separate compaction/resume preservation evidence. OpenCode's recurring continuity transform is a semantic reinjection mechanism, not merely a cache optimization. [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://ai.google.dev/gemini-api/docs/generate-content/caching] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: .opencode/hooks/injection-contract.md:35] [INFERENCE: based on iteration 007 lifecycle findings and provider descriptions]

6. **Conditional and threshold gating should target relevance, while fixed guardrails need an explicit preservation mechanism.** Anthropic's prompting guidance favors clear, direct, specific instructions and empirical success criteria; its current Opus guidance says short conciseness reminders can work and warns that explicit verification instructions can cause over-verification on that model. Locally, the advisor recommendation is already gated by confidence/uncertainty at render time, but `renderAdvisorFallbackDirective()` emits all three directives even when no recommendation exists, and Gate-3 is conditionally emitted only for mutation-like turns. This supports testing narrower turn predicates for comment hygiene (code/comment-writing turns), governor (long-running/tool-heavy turns), and proof (machine-state completion turns), while retaining Gate-3's stateful conditional pattern. It does **not** prove safe removal: provider guidance is model-specific and the comment/proof capsules have local hard-block intent. [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:213] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103] [INFERENCE: conditional candidates derive from semantic relevance; behavioral preservation requires later tests]

7. **Cross-turn deduplication has three distinct layers and only the first is currently implemented broadly.** Exact-prompt advisor caching avoids recomputation but still emits the same model-visible payload (iteration 6). OpenCode continuity suppresses a duplicate only within the current `output.system` array (iteration 2). Provider prompt caching reuses computation for an identical prefix but leaves the tokens semantically present. A true model-visible dedup design would instead send durable context once, retain a compact version/state identifier, and re-emit only on first turn, version change, compaction/resume, or a relevance threshold. None of the official cache APIs supplies those lifecycle signals automatically, and the six adapters expose different event surfaces, so cross-turn dedup must remain a hook/runtime state policy with cache metrics (`cached_tokens`, cache creation/read/write fields) as validation rather than as the mechanism. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://ai.google.dev/gemini-api/docs/caching] [SOURCE: .opencode/hooks/injection-contract.md:35] [INFERENCE: based on iterations 002/006/007 plus official cache semantics]

## Six-Adapter Practice Matrix (Unranked)

| Adapter | Stable-prefix implication | One-time/repeat implication | Provider-specific caveat |
|---|---|---|---|
| Claude Code | Separate fixed directives from dynamic advisor/Gate suffix if the host preserves ordering. | SessionStart can hold durable facts; recurring guardrails need compaction evidence or conditional replay. | Anthropic API ordering/cache controls may not be exposed by Claude Code hooks. |
| Codex | Same shared renderer split; static first, user/advisor/Gate data last. | Startup once; gate only while unresolved; state/version-based replay is a hook concern. | OpenAI model family changes cache behavior; GPT-5.6 keys/breakpoints are not proven controllable by Codex hooks. |
| Cursor | Configured Gate-before-advisor is cache-hostile for a fixed advisor prefix. | Startup observed, prompt hook not observed; dedup savings cannot be claimed before delivery works. | Underlying provider/model and cache surface are unverified. |
| Devin | Shared static/dynamic split applies; current advisor-before-Gate order is closer to provider guidance. | Observed startup and conditional Gate-3 support event-based replay. | Underlying provider/cache API is not established by adapter registration. |
| OpenCode | Independent system transforms need a deterministic stable-before-dynamic composition contract. | Recurring continuity should be state/version gated rather than mistaken for cache reuse. | Plugin host may use different providers; no universal breakpoint/key API. |
| Pi | Fixed Pi directive currently follows dynamic advisor content, so it cannot form an earlier stable prefix in that transform. | Startup is one-time; Pi-only arbitration may need a compact recurring override if compaction drops startup context. | Visible user-message transformation differs from system-prefix APIs and may prevent provider-level placement control. |

## Ruled Out

- Treating prompt caching as semantic deduplication or memory: official docs say cached content remains prompt context and output behavior is unchanged.
- Assuming the small fixed capsules independently meet cache thresholds: official minima start in the thousands of tokens.
- Applying one provider's key, TTL, breakpoint count, or message ordering uniformly to all runtimes.
- Inferring that CLI hook adapters expose their underlying provider's cache-control fields.
- Recommending unconditional removal from model-specific concision guidance before guardrail evals.

## Dead Ends

- Generic web search did not reliably return OpenAI and Anthropic pages; direct official documentation URLs were required. No unofficial source was used.
- Official caching docs do not specify Claude Code, Codex CLI, Cursor, Devin, OpenCode, or Pi hook-level cache-control exposure. This cannot be resolved from API docs alone and should not be retried as a provider-doc question.

## Edge Cases

- Ambiguous input: “prompt caching” could mean the local advisor result cache or provider KV/prefix caching. This iteration covers provider caching and explicitly distinguishes local recomputation caching.
- Contradictory evidence: providers agree on stable-prefix placement but differ materially on thresholds, breakpoint behavior, TTL, keying, and ordering. The contradiction is a portability limit, not resolved into one universal rule.
- Missing dependencies: runtime-to-provider request envelopes and cache telemetry are unavailable in this packet, so actual hit rates and control exposure remain unverified.
- Partial success: authoritative practices are established and connected to all six adapters; runtime-specific cache efficacy and guardrail preservation remain for later empirical work.

## Sources Consulted

- https://developers.openai.com/api/docs/guides/prompt-caching
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5
- https://ai.google.dev/gemini-api/docs/caching
- https://ai.google.dev/gemini-api/docs/generate-content/caching
- https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-215`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119`
- `.pi/extensions/prompt-advisor.ts:49-106`
- `.opencode/hooks/injection-contract.md:35-71`
- `iterations/iteration-002.md`, `iteration-003.md`, `iteration-006.md`, `iteration-007.md`

## Assessment

- New information ratio: 0.86 (`(5 + 0.5×2) / 7 = 0.857`, rounded). Five findings add authoritative provider constraints; two partially refine prior lifecycle/cache distinctions.
- Novelty justification: New external evidence establishes stable-prefix rules, exact provider thresholds/keying/retention limits, model-specific instruction caveats, and the three-layer dedup model; prior iterations supplied adapter facts only.
- Questions addressed: What do authoritative prompt-caching and instruction-design sources recommend? How do those practices constrain the six adapters?
- Questions answered: Provider-backed stable/dynamic ordering, cache eligibility, keys/breakpoints/retention, semantic limits, and conditional/dedup design boundaries are established without ranking.

## Reflection

- What worked and why: Direct official documentation pages yielded exact current limits and exposed the portability boundary more clearly than generic best-practice summaries.
- What did not work and why: Search discovery under-returned OpenAI/Anthropic sources, and provider API docs cannot prove CLI-level cache-control exposure.
- What I would do differently: Next use runtime request receipts and cache-usage telemetry, not more provider-doc searching, to test actual prefix placement and hits.

## Recommended Next Focus

Instrument or capture one representative request envelope per runtime, recording the actual ordered prefix, provider/model, cache-control exposure, and cache read/write metrics. Separately define behavioral evals for one-time, conditional, and version/compaction-triggered replay of each guardrail before any ranking.
