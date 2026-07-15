<!-- iteration 15 | model luna (gpt-5.6-luna) | angle: Coding-agent loop control (OpenHands/SWE-agent/smolagents) | 2026-07-14T22:28:49.019Z -->

The coding-agent evidence sharpens the loop model: convergence should operate on typed action→observation transitions, with separate retry scopes and budgets for model calls, parser errors, attempts, wall time, and executor cost.

OpenHands’ detector is unusually concrete: it matches semantic event signatures and distinguishes repeated action/observation, repeated errors, monologues, ping-pong alternation, and context-window failures. That transfers directly to `runtime/convergence` and `runtime/gauges-observability`, with detector reason and repetition count persisted as first-class state. ([OpenHands stuck detector](https://docs.openhands.dev/sdk/guides/agent-stuck-detector))

SWE-agent separates same-step requery from fresh-attempt retry and trajectory selection; it saves trajectories after each step with history, environment state, and model statistics. mini-SWE-agent adds independent step, cost, wall-time, and format-error limits, plus typed `LimitsExceeded` termination for unattended runs. ([SWE-agent agent reference](https://swe-agent.com/latest/reference/agent/), [mini-SWE-agent agent reference](https://mini-swe-agent.com/latest/reference/agents/default/))

smolagents exposes `max_steps`, planning intervals, step callbacks, replayable memory, and final-answer checks—useful as a compact model for evaluator hooks and verifier-gated termination. ([smolagents agents API](https://huggingface.co/docs/smolagents/en/reference/agents))

The ACI evidence is mixed: SWE-agent reports interface design as performance-critical, while the 2026 `onlycodes` ablation finds a single `execute_code` surface cheaper or tied in three of four agent/task cells, with nearly unchanged pass rates. Tool surface should therefore be benchmark metadata, not a fixed architectural assumption. ([SWE-agent paper](https://arxiv.org/abs/2405.15793), [onlycodes paper](https://arxiv.org/abs/2607.10569))

A 2025 trajectory study found execution-error classes correlate with lower resolution and higher reasoning overhead, supporting error-specific retry policies rather than generic retries. SWE-ReX adds the missing runtime boundary: executor/session/command identity must be checkpointable when running interactive shells or parallel sandboxes. ([failure study](https://arxiv.org/abs/2503.12374), [SWE-ReX](https://github.com/SWE-agent/swe-rex))

Metadata checked against [SWE-agent](https://github.com/SWE-agent/SWE-agent), [mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent), [smolagents](https://github.com/huggingface/smolagents), [SWE-ReX](https://github.com/SWE-agent/swe-rex), and [onlycodes](https://github.com/hyang0129/onlycodes).

```json
{
  "new_repos": [
    {
      "name": "SWE-agent/SWE-agent",
      "url": "https://github.com/SWE-agent/SWE-agent",
      "stars": "~19.8k",
      "what": "ACI-based GitHub-issue coding agent; latest release v1.1.0 on May 22, 2025, with activity through July 2026.",
      "lesson": "Separate parser requery, full-attempt retry, reviewer selection, and total-cost termination into explicit retry scopes.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "SWE-agent/mini-swe-agent",
      "url": "https://github.com/SWE-agent/mini-swe-agent",
      "stars": "~5.8k",
      "what": "Minimal bash-first coding agent; latest release v2.4.5 on July 6, 2026, with commits through July 2026.",
      "lesson": "Represent step, cost, wall-time, format-error, and user-interruption exits as typed terminal states, preserving the trajectory before stopping.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "name": "huggingface/smolagents",
      "url": "https://github.com/huggingface/smolagents",
      "stars": "~28.3k",
      "what": "Compact ReAct/code-agent library; latest release v1.26.0 on May 29, 2026.",
      "lesson": "Expose step callbacks, planning checkpoints, replayable memory, and final-answer validators as stable loop-control hooks.",
      "maps_to": [
        "runtime/convergence",
        "runtime/gauges-observability",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "name": "SWE-agent/SWE-ReX",
      "url": "https://github.com/SWE-agent/swe-rex",
      "stars": "~549",
      "what": "Sandboxed local/cloud shell runtime supporting interactive sessions and parallel agents; latest release v1.4.0 in August 2025, activity through July 2026.",
      "lesson": "Decouple loop state from executor infrastructure and persist executor, session, command, exit-code, timeout, and reattachment metadata.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "hyang0129/onlycodes",
      "url": "https://github.com/hyang0129/onlycodes",
      "stars": "0",
      "what": "2026 benchmark and MCP server comparing tool-rich coding agents with a single execute_code surface; latest release June 8, 2026.",
      "lesson": "Treat ACI/tool surface as a controlled experimental variable because path cost can change substantially without changing pass rate.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "deep-research"
      ],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Implement stuck detection as semantic signatures over action-observation-error windows, with separate counters for repetition, repeated failure, monologue, alternation, and context errors.",
      "evidence": "https://docs.openhands.dev/sdk/guides/agent-stuck-detector",
      "maps_to": [
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Use a typed retry hierarchy: provider retry, parser/action requery, same-task step retry, fresh attempt, and multi-attempt chooser; each needs its own retry count and cost budget.",
      "evidence": "https://swe-agent.com/latest/reference/agent/; https://swe-agent.com/latest/usage/competitive_runs/; https://mini-swe-agent.com/latest/reference/agents/default/; https://arxiv.org/abs/2503.12374",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Append a durable step record before retry or attempt promotion, including environment state, model statistics, error class, and terminal reason; this makes interrupted runs replayable and unattended limit exits safe.",
      "evidence": "https://swe-agent.com/latest/reference/agent/; https://mini-swe-agent.com/v2/usage/mini/",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Make planning checkpoints, per-step callbacks, replay, and final-answer validation part of the loop contract rather than optional logging.",
      "evidence": "https://huggingface.co/docs/smolagents/main/conceptual_guides/react; https://huggingface.co/docs/smolagents/en/reference/agents; https://docs.openhands.dev/sdk/guides/critic",
      "maps_to": [
        "runtime/gauges-observability",
        "runtime/convergence",
        "deep-review",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Benchmark ACI surface and executor backend as independent control variables: tool choice changes path cost, while executor abstraction determines session durability and fan-out behavior.",
      "evidence": "https://arxiv.org/abs/2405.15793; https://arxiv.org/abs/2607.10569; https://github.com/SWE-agent/swe-rex",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "[runtime/convergence] Repeated identical actions are sufficient evidence that an agent is stuck.",
      "counter": "Interactive shells, polling, and long-running commands can repeat actions while executor state is changing; detector thresholds need external progress signals such as file, test, or process deltas.",
      "evidence": "https://docs.openhands.dev/sdk/guides/agent-stuck-detector; https://github.com/SWE-agent/swe-rex"
    },
    {
      "claim": "[runtime/budget-cost] More full attempts are a general path to higher success.",
      "counter": "SWE-agent documents multi-attempt runs as expensive and warns that unbounded iteration makes average cost diverge; mini-SWE-agent favors a simpler bounded trajectory.",
      "evidence": "https://swe-agent.com/latest/usage/competitive_runs/; https://github.com/SWE-agent/mini-swe-agent"
    },
    {
      "claim": "[runtime/budget-cost] A richer specialized ACI should always improve coding-agent efficiency.",
      "counter": "The onlycodes study finds tool-surface cost depends jointly on task regime and agent design; pass rates were statistically tied while path costs varied.",
      "evidence": "https://arxiv.org/abs/2607.10569; https://github.com/hyang0129/onlycodes"
    }
  ],
  "next_angles": [
    "[runtime/convergence + runtime/gauges-observability] Benchmark false positives from stuck detectors against productive polling, retries, and interactive shell sessions using semantic signatures plus filesystem/test deltas.",
    "[runtime/budget-cost] Measure expected gain per dollar for provider retry, parser requery, same-task continuation, fresh attempt, and alternate-model branching.",
    "[runtime/state-jsonl-checkpointing + runtime/locks-recovery] Fault-inject executor loss between command dispatch and observation receipt; test idempotent replay and session reattachment.",
    "[deep-research + runtime/convergence] Re-run ACI/tool-surface ablations across OpenHands, SWE-agent, mini-SWE-agent, and smolagents under equal model, seed, wall-time, and cache-adjusted budgets."
  ],
  "notes": "OpenHands evidence comes from current SDK documentation; the supplied catalog already contains the OpenHands SDK repo, so it is intentionally not repeated. Coverage is still weak on detector false-positive rates, cross-agent equal-budget comparisons, and provider-hidden retry costs."
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
session id: 019f62ba-809e-7603-9e01-379f0d0619c6
--------
user
You are iteration 15/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Coding-agent loop control (OpenHands/SWE-agent/smolagents)
DIRECTIVE: Agent-computer interface, step budgets, stuck-detection, retry loops in coding agents. Map to runtime/convergence, runtime/budget-cost.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (66) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop
Insights so far: 70; contradictions logged: 40.
Open threads prior iterations flagged: Test retention policies that expire inactive thread segments while pinning pending approvals and ancestor seeds. | runtime/fan-out-fan-in: test any-join continuation with late sibling results, duplicate completions, and convergence updates after the winner proceeds. | runtime/continuity-threading: design a versioned adapter for AG2 classic GroupChat versus the v1 protocol-driven API. | deep-ai-council: benchmark LLM selector overhead against deterministic graphs and measure whether early termination starves required critics. | [deep-improvement/runtime/budget-cost] Add a cheap headroom and coupling preflight: generate 10–20 candidates, measure attainable gain and interaction, then decide whether expensive joint optimization is justified. | [runtime/convergence/runtime/gauges-observability] Benchmark scalar scores, textual gradients, execution traces, and pairwise duels under equal evaluator-call budgets; compare improvement per call, variance, regret, and transfer. | [runtime/state-jsonl-checkpointing/runtime/locks-recovery] Fault-inject after feedback persistence, incumbent decisions, and candidate promotion; verify idempotent replay and exactly-once acceptance. | [runtime/fan-out-fan-in/runtime/dedup-novelty] Compare MCTS, beam, Bayesian, and bandit frontiers while preserving candidate-family diversity instead of greedily replacing the incumbent.

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
I’m checking the primary repositories and papers for concrete loop-control mechanisms: action/observation budgets, failure recovery, stuck detection, and how those map onto the deep-loop runtime. I’ll avoid the 66 catalogued repos and verify stars/recency from GitHub pages or APIs where possible.
web search: 
web search: GitHub All-Hands-AI OpenHands max iterations stuck detection agent loop ...
web search: 
web search: 
web search: 
web search: site:github.com/All-Hands-AI/OpenHands "Stars" "Releases" ...
web search: 
web search: https://github.com/All-Hands-AI/OpenHands
web search: 
web search: 'Latest'
web search: 
web search: 
web search: 
web search: site:docs.openhands.dev SDK max_iterations agent budget OpenHands ...
web search: 
web search: https://arxiv.org/abs/2405.15793
web search: 
web search: 'Abstract'
web search: 
web search: site:swe-agent.com/latest retry_loop cost_limit retry configuration max_steps turn_limit SWE-agent ...
web search: 
web search: site:huggingface.co/docs/smolagents main max_steps reached final answer checks planning_interval callbacks memory
web search: 
web search: GitHub SWE-agent SWE-ReX repo stars release sandbox execution agent computer interface ...
web search: 
web search: https://api.github.com/repos/SWE-agent/SWE-agent/releases/latest
web search: 
web search: https://github.com/SWE-agent/SWE-agent/releases/tag/v1.1.0
web search: 
web search: "SWE-agent" "v1.1.0" "May 22, 2026" ...
web search: 
web search: 
web search: 
web search: https://github.com/SWE-agent/SWE-agent/commit/0f3acafacabc0def8cc76b4e48acb4b6cf302cb9
web search: 
web search: "SWE-agent 1.1.0" 2025 ...
web search: 
web search: 
web search: 
web search: 'Stars'
web search: 
web search: 
codex
The coding-agent evidence sharpens the loop model: convergence should operate on typed action→observation transitions, with separate retry scopes and budgets for model calls, parser errors, attempts, wall time, and executor cost.

OpenHands’ detector is unusually concrete: it matches semantic event signatures and distinguishes repeated action/observation, repeated errors, monologues, ping-pong alternation, and context-window failures. That transfers directly to `runtime/convergence` and `runtime/gauges-observability`, with detector reason and repetition count persisted as first-class state. ([OpenHands stuck detector](https://docs.openhands.dev/sdk/guides/agent-stuck-detector))

SWE-agent separates same-step requery from fresh-attempt retry and trajectory selection; it saves trajectories after each step with history, environment state, and model statistics. mini-SWE-agent adds independent step, cost, wall-time, and format-error limits, plus typed `LimitsExceeded` termination for unattended runs. ([SWE-agent agent reference](https://swe-agent.com/latest/reference/agent/), [mini-SWE-agent agent reference](https://mini-swe-agent.com/latest/reference/agents/default/))

smolagents exposes `max_steps`, planning intervals, step callbacks, replayable memory, and final-answer checks—useful as a compact model for evaluator hooks and verifier-gated termination. ([smolagents agents API](https://huggingface.co/docs/smolagents/en/reference/agents))

The ACI evidence is mixed: SWE-agent reports interface design as performance-critical, while the 2026 `onlycodes` ablation finds a single `execute_code` surface cheaper or tied in three of four agent/task cells, with nearly unchanged pass rates. Tool surface should therefore be benchmark metadata, not a fixed architectural assumption. ([SWE-agent paper](https://arxiv.org/abs/2405.15793), [onlycodes paper](https://arxiv.org/abs/2607.10569))

A 2025 trajectory study found execution-error classes correlate with lower resolution and higher reasoning overhead, supporting error-specific retry policies rather than generic retries. SWE-ReX adds the missing runtime boundary: executor/session/command identity must be checkpointable when running interactive shells or parallel sandboxes. ([failure study](https://arxiv.org/abs/2503.12374), [SWE-ReX](https://github.com/SWE-agent/swe-rex))

Metadata checked against [SWE-agent](https://github.com/SWE-agent/SWE-agent), [mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent), [smolagents](https://github.com/huggingface/smolagents), [SWE-ReX](https://github.com/SWE-agent/swe-rex), and [onlycodes](https://github.com/hyang0129/onlycodes).

```json
{
  "new_repos": [
    {
      "name": "SWE-agent/SWE-agent",
      "url": "https://github.com/SWE-agent/SWE-agent",
      "stars": "~19.8k",
      "what": "ACI-based GitHub-issue coding agent; latest release v1.1.0 on May 22, 2025, with activity through July 2026.",
      "lesson": "Separate parser requery, full-attempt retry, reviewer selection, and total-cost termination into explicit retry scopes.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "SWE-agent/mini-swe-agent",
      "url": "https://github.com/SWE-agent/mini-swe-agent",
      "stars": "~5.8k",
      "what": "Minimal bash-first coding agent; latest release v2.4.5 on July 6, 2026, with commits through July 2026.",
      "lesson": "Represent step, cost, wall-time, format-error, and user-interruption exits as typed terminal states, preserving the trajectory before stopping.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "name": "huggingface/smolagents",
      "url": "https://github.com/huggingface/smolagents",
      "stars": "~28.3k",
      "what": "Compact ReAct/code-agent library; latest release v1.26.0 on May 29, 2026.",
      "lesson": "Expose step callbacks, planning checkpoints, replayable memory, and final-answer validators as stable loop-control hooks.",
      "maps_to": [
        "runtime/convergence",
        "runtime/gauges-observability",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "name": "SWE-agent/SWE-ReX",
      "url": "https://github.com/SWE-agent/swe-rex",
      "stars": "~549",
      "what": "Sandboxed local/cloud shell runtime supporting interactive sessions and parallel agents; latest release v1.4.0 in August 2025, activity through July 2026.",
      "lesson": "Decouple loop state from executor infrastructure and persist executor, session, command, exit-code, timeout, and reattachment metadata.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "hyang0129/onlycodes",
      "url": "https://github.com/hyang0129/onlycodes",
      "stars": "0",
      "what": "2026 benchmark and MCP server comparing tool-rich coding agents with a single execute_code surface; latest release June 8, 2026.",
      "lesson": "Treat ACI/tool surface as a controlled experimental variable because path cost can change substantially without changing pass rate.",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "deep-research"
      ],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Implement stuck detection as semantic signatures over action-observation-error windows, with separate counters for repetition, repeated failure, monologue, alternation, and context errors.",
      "evidence": "https://docs.openhands.dev/sdk/guides/agent-stuck-detector",
      "maps_to": [
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Use a typed retry hierarchy: provider retry, parser/action requery, same-task step retry, fresh attempt, and multi-attempt chooser; each needs its own retry count and cost budget.",
      "evidence": "https://swe-agent.com/latest/reference/agent/; https://swe-agent.com/latest/usage/competitive_runs/; https://mini-swe-agent.com/latest/reference/agents/default/; https://arxiv.org/abs/2503.12374",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Append a durable step record before retry or attempt promotion, including environment state, model statistics, error class, and terminal reason; this makes interrupted runs replayable and unattended limit exits safe.",
      "evidence": "https://swe-agent.com/latest/reference/agent/; https://mini-swe-agent.com/v2/usage/mini/",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Make planning checkpoints, per-step callbacks, replay, and final-answer validation part of the loop contract rather than optional logging.",
      "evidence": "https://huggingface.co/docs/smolagents/main/conceptual_guides/react; https://huggingface.co/docs/smolagents/en/reference/agents; https://docs.openhands.dev/sdk/guides/critic",
      "maps_to": [
        "runtime/gauges-observability",
        "runtime/convergence",
        "deep-review",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Benchmark ACI surface and executor backend as independent control variables: tool choice changes path cost, while executor abstraction determines session durability and fan-out behavior.",
      "evidence": "https://arxiv.org/abs/2405.15793; https://arxiv.org/abs/2607.10569; https://github.com/SWE-agent/swe-rex",
      "maps_to": [
        "runtime/budget-cost",
        "runtime/convergence",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "[runtime/convergence] Repeated identical actions are sufficient evidence that an agent is stuck.",
      "counter": "Interactive shells, polling, and long-running commands can repeat actions while executor state is changing; detector thresholds need external progress signals such as file, test, or process deltas.",
      "evidence": "https://docs.openhands.dev/sdk/guides/agent-stuck-detector; https://github.com/SWE-agent/swe-rex"
    },
    {
      "claim": "[runtime/budget-cost] More full attempts are a general path to higher success.",
      "counter": "SWE-agent documents multi-attempt runs as expensive and warns that unbounded iteration makes average cost diverge; mini-SWE-agent favors a simpler bounded trajectory.",
      "evidence": "https://swe-agent.com/latest/usage/competitive_runs/; https://github.com/SWE-agent/mini-swe-agent"
    },
    {
      "claim": "[runtime/budget-cost] A richer specialized ACI should always improve coding-agent efficiency.",
      "counter": "The onlycodes study finds tool-surface cost depends jointly on task regime and agent design; pass rates were statistically tied while path costs varied.",
      "evidence": "https://arxiv.org/abs/2607.10569; https://github.com/hyang0129/onlycodes"
    }
  ],
  "next_angles": [
    "[runtime/convergence + runtime/gauges-observability] Benchmark false positives from stuck detectors against productive polling, retries, and interactive shell sessions using semantic signatures plus filesystem/test deltas.",
    "[runtime/budget-cost] Measure expected gain per dollar for provider retry, parser requery, same-task continuation, fresh attempt, and alternate-model branching.",
    "[runtime/state-jsonl-checkpointing + runtime/locks-recovery] Fault-inject executor loss between command dispatch and observation receipt; test idempotent replay and session reattachment.",
    "[deep-research + runtime/convergence] Re-run ACI/tool-surface ablations across OpenHands, SWE-agent, mini-SWE-agent, and smolagents under equal model, seed, wall-time, and cache-adjusted budgets."
  ],
  "notes": "OpenHands evidence comes from current SDK documentation; the supplied catalog already contains the OpenHands SDK repo, so it is intentionally not repeated. Coverage is still weak on detector false-positive rates, cross-agent equal-budget comparisons, and provider-hidden retry costs."
}
```
hook: Stop
hook: Stop Completed
tokens used
229,145
