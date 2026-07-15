<!-- iteration 8 | model luna (gpt-5.6-luna) | angle: Budget / cost / depth control | 2026-07-14T21:53:16.185Z -->

The strongest transfer is to make `runtime/budget-cost` a hierarchical, multi-dimensional ledger—not a single round cap. Pydantic AI separates request, token, and tool-call limits, while LiteLLM adds per-agent session budgets, reset windows, and fallback routing. ([Pydantic subagent budgets](https://pydantic.dev/docs/ai/harness/subagents/), [LiteLLM budgets](https://docs.litellm.ai/docs/proxy/users))

Adaptive depth should price expected quality against remaining budget. The literature now distinguishes fixed-budget control from difficulty/confidence-adaptive allocation; TALE and constrained-policy work support per-instance budget assignment rather than equal rounds. ([survey](https://arxiv.org/abs/2507.02076), [TALE](https://arxiv.org/abs/2412.18547), [adaptive allocation](https://arxiv.org/abs/2604.14853))

Early exit needs an anytime-quality gauge. Recent work finds diminishing returns and overthinking, including cases where longer reasoning abandons a correct answer. Persist partial results and residual budget so stopping is resumable. ([Anytime Reasoning](https://arxiv.org/abs/2601.11038), [When More Thinking Hurts](https://aclanthology.org/2026.findings-acl.1199/))

Fan-out requires explicit reservation and ownership transfer: the recent `token-budgets` artifact targets double-spend races, while LLMLingua shows that repeated context and KV-cache state are themselves cost levers. ([token-budgets paper](https://arxiv.org/abs/2606.04056), [LLMLingua](https://github.com/microsoft/LLMLingua))

```json
{
  "new_repos": [
    {
      "name": "pydantic/pydantic-ai",
      "url": "https://github.com/pydantic/pydantic-ai",
      "stars": "~18.5k",
      "what": "Latest release v2.9.1 on 2026-07-13; UsageLimits covers requests, input/output/total tokens, and tool calls, with per-delegation sub-agent budgets.",
      "lesson": "Make budgets hierarchical and typed by resource, with explicit soft-versus-hard exhaustion and parent-child aggregation semantics.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "BerriAI/litellm",
      "url": "https://github.com/BerriAI/litellm",
      "stars": "~53.6k",
      "what": "Latest release v1.92.0 on 2026-07-12; gateway supports multi-window spend limits, agent max_iterations, max_budget_per_session, and budget fallbacks.",
      "lesson": "Centralize pre-call enforcement, rolling budget windows, model-specific ceilings, and cheaper fallback routing outside individual loop implementations.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "name": "GeniusHTX/TALE",
      "url": "https://github.com/GeniusHTX/TALE",
      "stars": "~149",
      "what": "README's latest dated update is 2025; no release signal found; TALE estimates per-problem reasoning-token budgets through zero-shot or trained estimators.",
      "lesson": "Allocate depth from predicted task complexity, then expose the chosen budget to the model instead of forcing every task through the same reasoning length.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "deep-research",
        "deep-improvement"
      ],
      "confidence": "med"
    },
    {
      "name": "sajjadanwar0/token-budgets",
      "url": "https://github.com/sajjadanwar0/token-budgets",
      "stars": "~1",
      "what": "Associated with a 2026 paper; no GitHub releases published; Rust affine budget values make cloning, double-spending, and use-after-delegation compile-time errors.",
      "lesson": "Treat budget ownership like a capability: reserve before fan-out, transfer ownership explicitly, and prevent concurrent branches from spending the same allocation.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/locks-recovery"
      ],
      "confidence": "low"
    },
    {
      "name": "microsoft/LLMLingua",
      "url": "https://github.com/microsoft/LLMLingua",
      "stars": "~6.4k",
      "what": "Latest release v0.2.2 in 2024; latest visible commit is 2025-10-28; prompt and KV-cache compression supports target-token and structured-context budgets.",
      "lesson": "Charge repeated state, tool output, and replay context as real cost, then compress selectively while preserving high-priority evidence and reporting quality loss.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Budget accounting should track request count, input tokens, output tokens, tool calls, dollars, and wall time at parent, agent, session, and branch scope.",
      "evidence": "https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.ai/docs/proxy/users",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Use a global budget price or dual variable to allocate extra depth to difficult or uncertain tasks and target an average spend, rather than assigning equal rounds to every task.",
      "evidence": "https://arxiv.org/abs/2507.02076; https://arxiv.org/abs/2412.18547; https://arxiv.org/abs/2604.14853",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "deep-research",
        "deep-improvement"
      ],
      "confidence": "med"
    },
    {
      "insight": "As the remaining budget shrinks, shift search from broad fan-out toward greedy exploitation and prune branches using residual progress rather than absolute self-confidence.",
      "evidence": "https://arxiv.org/abs/2603.12634",
      "maps_to": [
        "runtime/convergence",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "med"
    },
    {
      "insight": "Early exit should be driven by marginal quality per marginal cost and should persist the best-so-far answer plus residual budget for continuation.",
      "evidence": "https://arxiv.org/abs/2601.11038; https://aclanthology.org/2026.findings-acl.1199/",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    },
    {
      "insight": "Concurrent delegation needs atomic reservation or non-duplicable budget ownership; post-hoc counters cannot reliably prevent overspend races.",
      "evidence": "https://arxiv.org/abs/2606.04056; https://github.com/sajjadanwar0/token-budgets",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/locks-recovery"
      ],
      "confidence": "low"
    }
  ],
  "contradictions": [
    {
      "claim": "runtime/budget-cost: A single parent token cap is sufficient to bound a multi-agent tree.",
      "counter": "Sub-agent budgets may be isolated, parent limits may not forward, and concurrent shared counters can be best-effort; fan-out requires explicit allocation semantics.",
      "evidence": "https://pydantic.dev/docs/ai/harness/dynamic-workflow/; https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.ai/docs/proxy/users"
    },
    {
      "claim": "runtime/convergence: More test-time reasoning monotonically improves answer quality.",
      "counter": "Marginal returns diminish, overthinking can abandon correct answers, and optimal depth varies by problem difficulty.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1199/; https://arxiv.org/abs/2603.12634"
    },
    {
      "claim": "runtime/budget-cost: Budget exhaustion should always hard-fail the run.",
      "counter": "Soft exhaustion with partial output preserves already-paid work, while hard rejection remains appropriate at provider or safety boundaries.",
      "evidence": "https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.ai/docs/proxy/users"
    }
  ],
  "next_angles": [
    "Compare fixed-round, residual-budget adaptive, and Lagrangian per-task allocation on identical JSONL traces under equal dollar budgets.",
    "Fault-inject concurrent fan-out between reservation and debit; measure overspend, stranded reservations, and fairness under atomic versus best-effort accounting.",
    "Measure full cost curves including repeated JSONL replay, tool latency, retries, evaluator calls, and context compression overhead—not output tokens alone."
  ],
  "notes": "The main gap is a portable budget currency spanning tokens, dollars, tool calls, latency, retries, and parallel reservations. Existing systems expose caps, but few publish quality-versus-cost curves or unify hard-stop, soft-stop, partial-result, and recovery semantics."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: read-only
reasoning effort: max
reasoning summaries: none
session id: 019f6299-dbd2-7803-a147-5181a10316d1
--------
user
You are iteration 8/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Budget / cost / depth control
DIRECTIVE: Token budgeting, adaptive iteration depth, early-exit economics. Map to runtime/budget-cost.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (35) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation
Insights so far: 35; contradictions logged: 21.
Open threads prior iterations flagged: deep-ai-council/runtime/gauges-observability: Compare blind versus attributed review with order swaps, identity leaks, and confidence masking. | deep-ai-council/runtime/convergence/runtime/budget-cost: Compare fixed-round debate, stability-based stopping, and minority-sentinel escalation under equal budgets. | deep-ai-council/deep-alignment/runtime/continuity-threading: Fault-inject collusive or malicious seats that poison shared evidence and test quarantine and revalidation. | deep-ai-council/deep-review: Compare majority vote, blind peer ranking, meta-judge selection, and evidence-weighted adjudication on the same debate traces. | runtime/dedup-novelty: Build a cross-task transfer/interference matrix across deep-research, deep-review, deep-improvement, and deep-alignment. | runtime/dedup-novelty: Compare embedding novelty, entailment-cluster novelty, claim/entity delta, and source/citation delta as branch-selection signals under equal budgets. | runtime/gauges-observability: Add coverage curves, novelty calibration, duplicate-work rate, and promotion precision to the JSONL event schema. | runtime/continuity-threading: Fault-inject stale, contradictory, and superseded memories to test versioned accumulation and recovery.

Map every finding to at least one concrete system-deep-loop target from this list: deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

Write a concise analysis (what you found + why it transfers), THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:
```json
{
  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable lesson for system-deep-loop","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "insights": [{"insight":"one specific transferable idea","evidence":"repo/paper/url","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "contradictions": [{"claim":"","counter":"","evidence":""}],
  "next_angles": ["a specific divergent angle worth exploring next"],
  "notes": "coverage gaps you noticed"
}
```
Target 2-5 NEW repos and 2-5 insights. Novelty and verifiable specifics over volume. If this angle is genuinely exhausted, return few/no new_repos but propose sharp next_angles (that is the divergent pivot, not a failure).
codex
I’m treating this as a read-only research pass, so no spec-folder write is needed. I’ll broaden specifically into budget schedulers, cost-aware search/agent runtimes, and adaptive-depth controllers, and verify repository metadata from primary sources where possible.
web search: 
web search: GitHub LLM agent token budget adaptive iteration depth cost-aware runtime ...
web search: 
web search: https://github.com/pydantic/pydantic-ai
web search: 
web search: 'Star'
web search: 
web search: https://api.github.com/repos/pydantic/pydantic-ai
web search: 
web search: https://github.com/pydantic/pydantic-ai/releases
web search: 
web search: 'Latest'
web search: 
web search: site:ai.pydantic.dev usage limits request_limit total_tokens_limit Pydantic AI ...
web search: 
web search: Pydantic AI UsageLimits request_limit total_tokens_limit docs ...
web search: 
web search: site:docs.litellm.ai "max_budget" ...
web search: 
web search: LiteLLM max_budget budget_duration key spend limit documentation ...
web search: 
web search: site:ai-sdk.dev "stopWhen" "stepCountIs" ...
web search: 
web search: GitHub GeniusHTX TALE Token-Budget-Aware LLM Reasoning ...
web search: 
web search: https://docs.litellm.ai/docs/proxy/users
web search: 
web search: https://arxiv.org/abs/2507.02076
web search: 
web search: 'Abstract'
web search: 
web search: https://arxiv.org/abs/2606.04056
web search: 
web search: 
web search: 
web search: https://github.com/GeniusHTX/TALE/commits/main
web search: 
web search: https://github.com/GeniusHTX/TALE/commits
codex
The useful split is now clear: hard enforcement lives at the gateway/run boundary, while adaptive depth belongs to a policy layer that prices expected quality against remaining budget. I also found a newer failure-mode line—concurrent delegation can double-spend shared budgets—plus evidence that “more thinking” can reduce quality, so early exit should preserve partial results rather than discard them.
codex
The strongest transfer is to make `runtime/budget-cost` a hierarchical, multi-dimensional ledger—not a single round cap. Pydantic AI separates request, token, and tool-call limits, while LiteLLM adds per-agent session budgets, reset windows, and fallback routing. ([Pydantic subagent budgets](https://pydantic.dev/docs/ai/harness/subagents/), [LiteLLM budgets](https://docs.litellm.ai/docs/proxy/users))

Adaptive depth should price expected quality against remaining budget. The literature now distinguishes fixed-budget control from difficulty/confidence-adaptive allocation; TALE and constrained-policy work support per-instance budget assignment rather than equal rounds. ([survey](https://arxiv.org/abs/2507.02076), [TALE](https://arxiv.org/abs/2412.18547), [adaptive allocation](https://arxiv.org/abs/2604.14853))

Early exit needs an anytime-quality gauge. Recent work finds diminishing returns and overthinking, including cases where longer reasoning abandons a correct answer. Persist partial results and residual budget so stopping is resumable. ([Anytime Reasoning](https://arxiv.org/abs/2601.11038), [When More Thinking Hurts](https://aclanthology.org/2026.findings-acl.1199/))

Fan-out requires explicit reservation and ownership transfer: the recent `token-budgets` artifact targets double-spend races, while LLMLingua shows that repeated context and KV-cache state are themselves cost levers. ([token-budgets paper](https://arxiv.org/abs/2606.04056), [LLMLingua](https://github.com/microsoft/LLMLingua))

```json
{
  "new_repos": [
    {
      "name": "pydantic/pydantic-ai",
      "url": "https://github.com/pydantic/pydantic-ai",
      "stars": "~18.5k",
      "what": "Latest release v2.9.1 on 2026-07-13; UsageLimits covers requests, input/output/total tokens, and tool calls, with per-delegation sub-agent budgets.",
      "lesson": "Make budgets hierarchical and typed by resource, with explicit soft-versus-hard exhaustion and parent-child aggregation semantics.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "BerriAI/litellm",
      "url": "https://github.com/BerriAI/litellm",
      "stars": "~53.6k",
      "what": "Latest release v1.92.0 on 2026-07-12; gateway supports multi-window spend limits, agent max_iterations, max_budget_per_session, and budget fallbacks.",
      "lesson": "Centralize pre-call enforcement, rolling budget windows, model-specific ceilings, and cheaper fallback routing outside individual loop implementations.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "name": "GeniusHTX/TALE",
      "url": "https://github.com/GeniusHTX/TALE",
      "stars": "~149",
      "what": "README's latest dated update is 2025; no release signal found; TALE estimates per-problem reasoning-token budgets through zero-shot or trained estimators.",
      "lesson": "Allocate depth from predicted task complexity, then expose the chosen budget to the model instead of forcing every task through the same reasoning length.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "deep-research",
        "deep-improvement"
      ],
      "confidence": "med"
    },
    {
      "name": "sajjadanwar0/token-budgets",
      "url": "https://github.com/sajjadanwar0/token-budgets",
      "stars": "~1",
      "what": "Associated with a 2026 paper; no GitHub releases published; Rust affine budget values make cloning, double-spending, and use-after-delegation compile-time errors.",
      "lesson": "Treat budget ownership like a capability: reserve before fan-out, transfer ownership explicitly, and prevent concurrent branches from spending the same allocation.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/locks-recovery"
      ],
      "confidence": "low"
    },
    {
      "name": "microsoft/LLMLingua",
      "url": "https://github.com/microsoft/LLMLingua",
      "stars": "~6.4k",
      "what": "Latest release v0.2.2 in 2024; latest visible commit is 2025-10-28; prompt and KV-cache compression supports target-token and structured-context budgets.",
      "lesson": "Charge repeated state, tool output, and replay context as real cost, then compress selectively while preserving high-priority evidence and reporting quality loss.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Budget accounting should track request count, input tokens, output tokens, tool calls, dollars, and wall time at parent, agent, session, and branch scope.",
      "evidence": "https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.ai/docs/proxy/users",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Use a global budget price or dual variable to allocate extra depth to difficult or uncertain tasks and target an average spend, rather than assigning equal rounds to every task.",
      "evidence": "https://arxiv.org/abs/2507.02076; https://arxiv.org/abs/2412.18547; https://arxiv.org/abs/2604.14853",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "deep-research",
        "deep-improvement"
      ],
      "confidence": "med"
    },
    {
      "insight": "As the remaining budget shrinks, shift search from broad fan-out toward greedy exploitation and prune branches using residual progress rather than absolute self-confidence.",
      "evidence": "https://arxiv.org/abs/2603.12634",
      "maps_to": [
        "runtime/convergence",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "med"
    },
    {
      "insight": "Early exit should be driven by marginal quality per marginal cost and should persist the best-so-far answer plus residual budget for continuation.",
      "evidence": "https://arxiv.org/abs/2601.11038; https://aclanthology.org/2026.findings-acl.1199/",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    },
    {
      "insight": "Concurrent delegation needs atomic reservation or non-duplicable budget ownership; post-hoc counters cannot reliably prevent overspend races.",
      "evidence": "https://arxiv.org/abs/2606.04056; https://github.com/sajjadanwar0/token-budgets",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/locks-recovery"
      ],
      "confidence": "low"
    }
  ],
  "contradictions": [
    {
      "claim": "runtime/budget-cost: A single parent token cap is sufficient to bound a multi-agent tree.",
      "counter": "Sub-agent budgets may be isolated, parent limits may not forward, and concurrent shared counters can be best-effort; fan-out requires explicit allocation semantics.",
      "evidence": "https://pydantic.dev/docs/ai/harness/dynamic-workflow/; https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.ai/docs/proxy/users"
    },
    {
      "claim": "runtime/convergence: More test-time reasoning monotonically improves answer quality.",
      "counter": "Marginal returns diminish, overthinking can abandon correct answers, and optimal depth varies by problem difficulty.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1199/; https://arxiv.org/abs/2603.12634"
    },
    {
      "claim": "runtime/budget-cost: Budget exhaustion should always hard-fail the run.",
      "counter": "Soft exhaustion with partial output preserves already-paid work, while hard rejection remains appropriate at provider or safety boundaries.",
      "evidence": "https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.ai/docs/proxy/users"
    }
  ],
  "next_angles": [
    "Compare fixed-round, residual-budget adaptive, and Lagrangian per-task allocation on identical JSONL traces under equal dollar budgets.",
    "Fault-inject concurrent fan-out between reservation and debit; measure overspend, stranded reservations, and fairness under atomic versus best-effort accounting.",
    "Measure full cost curves including repeated JSONL replay, tool latency, retries, evaluator calls, and context compression overhead—not output tokens alone."
  ],
  "notes": "The main gap is a portable budget currency spanning tokens, dollars, tool calls, latency, retries, and parallel reservations. Existing systems expose caps, but few publish quality-versus-cost curves or unify hard-stop, soft-stop, partial-result, and recovery semantics."
}
```
hook: Stop
hook: Stop Completed
tokens used
195,680
