<!-- iteration 23 | model luna (gpt-5.6-luna) | angle: Human-in-the-loop / steering / interrupt-resume | 2026-07-14T23:04:20.478Z -->

HITL is best modeled as a control-plane state transition, not a UI affordance. The durable unit is a typed steering event applied to a checkpointed branch, carrying actor, scope, state hash, expiry, and supersession semantics.

OpenAI persists pending interruptions, nested-agent state, usage, and context during resume; Cloudflare models approval as a durable workflow wait with typed records, timeouts, escalation, and quorum. [OpenAI HITL docs](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Cloudflare HITL docs](https://github.com/cloudflare/agents/blob/main/docs/human-in-the-loop.md)

AG-UI and GitHub Copilot treat steering as ordered runtime events. LangChain exposes approve/edit/reject/respond, but its issue tracker shows the failure mode: editing tool arguments without superseding the original intent can cause the stale call to reappear. [AG-UI](https://docs.ag-ui.com/introduction) · [Copilot steering](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/use-copilot-cli/steer-agents) · [LangChain issue](https://github.com/langchain-ai/langchain/issues/33787)

Research systems point toward an editable plan-as-document: humans change plans, code, ownership, or dependencies; downstream work is selectively invalidated and recomputed. [ResearStudio](https://aclanthology.org/2025.emnlp-demos.69/) · [Cocoa](https://arxiv.org/abs/2412.10999)

InterruptBench adds the right evaluation vocabulary—addition, revision, retraction, adaptation, and recovery efficiency—while newer feedback research warns that apparent improvement may only be repeated attempts. [InterruptBench](https://arxiv.org/abs/2604.00892) · [feedback study](https://arxiv.org/abs/2606.30774)

Live metadata checked: [OpenAI](https://github.com/openai/openai-agents-python), [Cloudflare](https://github.com/cloudflare/agents), [AG-UI](https://github.com/ag-ui-protocol/ag-ui), [DeepScientist](https://github.com/ResearAI/DeepScientist), and [AgentTeams](https://github.com/agentscope-ai/AgentTeams).

```json
{
  "new_repos": [
    {
      "name": "openai/openai-agents-python",
      "url": "https://github.com/openai/openai-agents-python",
      "stars": "~27.9k",
      "what": "Approval-aware multi-agent SDK; latest release v0.18.2 on 2026-07-11.",
      "lesson": "Persist pending decisions, nested-agent identity, usage, and context merge semantics, then resume from the same agent graph.",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/continuity-threading", "deep-alignment", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "cloudflare/agents",
      "url": "https://github.com/cloudflare/agents",
      "stars": "~5.3k",
      "what": "Durable-Object agent/workflow runtime; latest listed release @cloudflare/think@0.13.0 on 2026-07-13.",
      "lesson": "Represent approval as a durable external wait with actor identity, progress, timeout, escalation, and multi-approver quorum.",
      "maps_to": ["runtime/continuity-threading", "runtime/locks-recovery", "runtime/budget-cost", "runtime/gauges-observability", "deep-alignment"],
      "confidence": "high"
    },
    {
      "name": "ag-ui-protocol/ag-ui",
      "url": "https://github.com/ag-ui-protocol/ag-ui",
      "stars": "~14.7k",
      "what": "Event-based agent-user interaction protocol; latest release listed as 2026-07-03.",
      "lesson": "Make pause, approve, edit, retry, escalate, cancel, and steering typed events with event-sourced state diffs and conflict resolution.",
      "maps_to": ["runtime/continuity-threading", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability", "deep-research", "deep-review"],
      "confidence": "high"
    },
    {
      "name": "ResearAI/DeepScientist",
      "url": "https://github.com/ResearAI/DeepScientist",
      "stars": "~3.2k",
      "what": "Durable research workspace with human takeover; latest release v1.6.0 on 2026-05-13.",
      "lesson": "Treat plans, files, graph state, memory, execution history, and failed paths as the continuity thread that humans can edit before resuming.",
      "maps_to": ["deep-research", "deep-improvement", "runtime/continuity-threading", "runtime/dedup-novelty", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "agentscope-ai/AgentTeams",
      "url": "https://github.com/agentscope-ai/AgentTeams",
      "stars": "~5.1k",
      "what": "Manager-worker multi-agent runtime with human-visible Matrix coordination; latest release v1.1.2 on 2026-05-27.",
      "lesson": "Put humans, managers, workers, and artifacts in one auditable control room; make steering durable room events rather than hidden side-channel prompts.",
      "maps_to": ["deep-ai-council", "runtime/fan-out-fan-in", "runtime/continuity-threading", "runtime/gauges-observability", "runtime/locks-recovery"],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "A human interruption must be a durable state transition containing pending decisions, target action, actor, expiry, and resume context; appending a message to the transcript is insufficient.",
      "evidence": "https://openai.github.io/openai-agents-python/human_in_the_loop/; https://github.com/cloudflare/agents/blob/main/docs/human-in-the-loop.md",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/continuity-threading", "runtime/locks-recovery", "deep-alignment"],
      "confidence": "high"
    },
    {
      "insight": "An edit must supersede persisted intent and rebase downstream work; changing only executed tool arguments can leave the original tool call eligible for regeneration.",
      "evidence": "https://docs.langchain.com/oss/python/langchain/human-in-the-loop; https://github.com/langchain-ai/langchain/issues/33787",
      "maps_to": ["runtime/continuity-threading", "runtime/convergence", "runtime/state-jsonl-checkpointing", "deep-alignment"],
      "confidence": "high"
    },
    {
      "insight": "Steering should be an ordered, scoped event stream with explicit effective boundaries, rather than an untyped prompt injection.",
      "evidence": "https://docs.ag-ui.com/introduction; https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/use-copilot-cli/steer-agents",
      "maps_to": ["runtime/continuity-threading", "runtime/gauges-observability", "deep-research", "deep-review", "deep-ai-council"],
      "confidence": "high"
    },
    {
      "insight": "An editable plan-as-document can identify step ownership and dependencies, then invalidate and recompute only downstream work after a human edit.",
      "evidence": "https://arxiv.org/abs/2412.10999; https://aclanthology.org/2025.emnlp-demos.69/",
      "maps_to": ["deep-research", "deep-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "insight": "Interruption evaluation should score intent adoption, stale-action rate, rollback or compensation, recovery latency, and token replay against repeated-attempt baselines.",
      "evidence": "https://arxiv.org/abs/2604.00892; https://arxiv.org/abs/2606.30774",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/continuity-threading", "deep-alignment"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "Human-in-the-loop means a final approval button after the loop finishes.",
      "counter": "The stronger pattern is interruption during execution: edit, retry, escalate, redirect, or change the plan before resuming.",
      "evidence": "https://docs.ag-ui.com/introduction; https://aclanthology.org/2025.emnlp-demos.69/"
    },
    {
      "claim": "An edited tool call is equivalent to replacing the original intent.",
      "counter": "The original intent must be explicitly superseded; otherwise stale calls may reappear after the edited action.",
      "evidence": "https://github.com/langchain-ai/langchain/issues/33787"
    },
    {
      "claim": "More feedback turns prove that human steering helped.",
      "counter": "Improvement may come from retries or resampling; evaluation needs an unguided repeated-attempt baseline and a feedback-use metric.",
      "evidence": "https://arxiv.org/abs/2606.30774"
    }
  ],
  "next_angles": [
    "Branch-aware human edits after partial fan-in: measure invalidation sets, reducer safety, and downstream rebase under late steering.",
    "Conflicting steering signals from multiple humans or agents: test vector clocks, fencing epochs, stale-decision rejection, and approval revocation.",
    "Human attention budgets: compare interruption timing at step boundaries, risk thresholds, and idle periods against rubber-stamping and recovery cost.",
    "Crash plus changed-intent continuity: combine JSONL replay, prompt compaction, delayed approval, and tool side effects; measure exact restoration and duplicate-action rate."
  ],
  "notes": "Coverage is strong for tool approval and editable plans, but weaker for authenticated multi-user steering, revocation after approval, approvals arriving after state changes, and human edits affecting already-completed side effects. InterruptBench's paper is stronger evidence than its small, still-immature repository."
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
session id: 019f62da-ee4c-7921-9a13-044770d90da3
--------
user
You are iteration 23/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Human-in-the-loop / steering / interrupt-resume
DIRECTIVE: Interrupt, approve, edit-and-resume, steering signals mid-loop. Map to runtime/continuity-threading, deep-alignment.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (106) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop | Query reformulation & source diversification | Cross-iteration memory & knowledge accumulation | Reducer / aggregator design patterns | Partial-failure tolerance, retries, idempotency
Insights so far: 110; contradictions logged: 65.
Open threads prior iterations flagged: Benchmark reducer algebra under out-of-order JSONL arrival: associative, commutative, idempotent, and order-sensitive reducers; maps_to=runtime/fan-out-fan-in and runtime/state-jsonl-checkpointing. | Inject a false or outdated anchor at an upper hierarchy level and measure downstream correction versus anchor lock-in; maps_to=runtime/continuity-threading and deep-alignment. | Compare barrier fan-in, quorum fan-in, and early partial reduction under branch failures and stragglers; maps_to=runtime/locks-recovery, runtime/budget-cost, and runtime/convergence. | Build a claim-level conflict ledger measuring agreement concentration, unresolved conflict mass, provenance loss, and synthesis amplification; maps_to=runtime/dedup-novelty and runtime/gauges-observability. | Inject crashes before side effect, after side effect before acknowledgement, and after checkpoint; compare stable keys, at-most-once, and compensation. | Test split-brain lock holders and stale resume tokens using lease expiry, fencing epochs, and database outages. | Benchmark fan-out saga recovery under out-of-order branch completion: reverse-topological versus branch-local compensation. | Classify agent tool calls as pure, idempotent, compensatable, or non-retryable and measure duplicate side effects, recovery latency, and token waste.

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
I’m targeting systems where a human can intervene without losing loop state: pause/approve/edit/resume, interrupt-safe tool execution, and steering signals that become durable continuation context. I’ll verify each repository’s URL, approximate stars, and recency from live sources, then separate direct evidence from transfer hypotheses.
web search: 
web search: GitHub agent framework human in the loop interrupt resume approval steering durable state ...
web search: 
web search: https://github.com/openai/openai-agents-python
web search: 
web search: 
web search: 
web search: 'interrupt'
codex
The first pass shows a useful split: SDK-level interruption state (OpenAI), durable workflow-level approval (Cloudflare), and UI/protocol-level steering (CopilotKit/AG-UI). I’m checking adjacent projects now so the catalog does not collapse into three variants of the same approval button.
web search: 
web search: site:github.com humanlayer human in the loop agents approval resume GitHub ...
web search: 
web search: 
web search: 
web search: 'Star'
web search: 
web search: 'Releases'
web search: 
web search: https://api.github.com/repos/humanlayer/agentcontrolplane
web search: 
web search: https://github.com/humanlayer/agentcontrolplane/commits/main
web search: 
web search: "AI Intervention Agent" GitHub interactive_feedback MCP ...
web search: 
web search: github noopstudios interactive-feedback-mcp ...
web search: 
web search: https://github.com/noopstudios/interactive-feedback-mcp
web search: 
web search: 'Releases'
web search: 
web search: 
web search: 
web search: github HenryPengZou InterruptBench ...
web search: 
web search: https://github.com/HenryPengZou/InterruptBench
web search: 
web search: HULA Human-in-the-loop LLM-based Agents software development GitHub ...
web search: 
web search: https://github.com/ResearAI/ResearStudio
web search: 
web search: 'Releases'
web search: 
web search: 
web search: 
web search: 'pause'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'waitForApproval'
context compacted
codex
HITL is best modeled as a control-plane state transition, not a UI affordance. The durable unit is a typed steering event applied to a checkpointed branch, carrying actor, scope, state hash, expiry, and supersession semantics.

OpenAI persists pending interruptions, nested-agent state, usage, and context during resume; Cloudflare models approval as a durable workflow wait with typed records, timeouts, escalation, and quorum. [OpenAI HITL docs](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Cloudflare HITL docs](https://github.com/cloudflare/agents/blob/main/docs/human-in-the-loop.md)

AG-UI and GitHub Copilot treat steering as ordered runtime events. LangChain exposes approve/edit/reject/respond, but its issue tracker shows the failure mode: editing tool arguments without superseding the original intent can cause the stale call to reappear. [AG-UI](https://docs.ag-ui.com/introduction) · [Copilot steering](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/use-copilot-cli/steer-agents) · [LangChain issue](https://github.com/langchain-ai/langchain/issues/33787)

Research systems point toward an editable plan-as-document: humans change plans, code, ownership, or dependencies; downstream work is selectively invalidated and recomputed. [ResearStudio](https://aclanthology.org/2025.emnlp-demos.69/) · [Cocoa](https://arxiv.org/abs/2412.10999)

InterruptBench adds the right evaluation vocabulary—addition, revision, retraction, adaptation, and recovery efficiency—while newer feedback research warns that apparent improvement may only be repeated attempts. [InterruptBench](https://arxiv.org/abs/2604.00892) · [feedback study](https://arxiv.org/abs/2606.30774)

Live metadata checked: [OpenAI](https://github.com/openai/openai-agents-python), [Cloudflare](https://github.com/cloudflare/agents), [AG-UI](https://github.com/ag-ui-protocol/ag-ui), [DeepScientist](https://github.com/ResearAI/DeepScientist), and [AgentTeams](https://github.com/agentscope-ai/AgentTeams).

```json
{
  "new_repos": [
    {
      "name": "openai/openai-agents-python",
      "url": "https://github.com/openai/openai-agents-python",
      "stars": "~27.9k",
      "what": "Approval-aware multi-agent SDK; latest release v0.18.2 on 2026-07-11.",
      "lesson": "Persist pending decisions, nested-agent identity, usage, and context merge semantics, then resume from the same agent graph.",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/continuity-threading", "deep-alignment", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "cloudflare/agents",
      "url": "https://github.com/cloudflare/agents",
      "stars": "~5.3k",
      "what": "Durable-Object agent/workflow runtime; latest listed release @cloudflare/think@0.13.0 on 2026-07-13.",
      "lesson": "Represent approval as a durable external wait with actor identity, progress, timeout, escalation, and multi-approver quorum.",
      "maps_to": ["runtime/continuity-threading", "runtime/locks-recovery", "runtime/budget-cost", "runtime/gauges-observability", "deep-alignment"],
      "confidence": "high"
    },
    {
      "name": "ag-ui-protocol/ag-ui",
      "url": "https://github.com/ag-ui-protocol/ag-ui",
      "stars": "~14.7k",
      "what": "Event-based agent-user interaction protocol; latest release listed as 2026-07-03.",
      "lesson": "Make pause, approve, edit, retry, escalate, cancel, and steering typed events with event-sourced state diffs and conflict resolution.",
      "maps_to": ["runtime/continuity-threading", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability", "deep-research", "deep-review"],
      "confidence": "high"
    },
    {
      "name": "ResearAI/DeepScientist",
      "url": "https://github.com/ResearAI/DeepScientist",
      "stars": "~3.2k",
      "what": "Durable research workspace with human takeover; latest release v1.6.0 on 2026-05-13.",
      "lesson": "Treat plans, files, graph state, memory, execution history, and failed paths as the continuity thread that humans can edit before resuming.",
      "maps_to": ["deep-research", "deep-improvement", "runtime/continuity-threading", "runtime/dedup-novelty", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "agentscope-ai/AgentTeams",
      "url": "https://github.com/agentscope-ai/AgentTeams",
      "stars": "~5.1k",
      "what": "Manager-worker multi-agent runtime with human-visible Matrix coordination; latest release v1.1.2 on 2026-05-27.",
      "lesson": "Put humans, managers, workers, and artifacts in one auditable control room; make steering durable room events rather than hidden side-channel prompts.",
      "maps_to": ["deep-ai-council", "runtime/fan-out-fan-in", "runtime/continuity-threading", "runtime/gauges-observability", "runtime/locks-recovery"],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "A human interruption must be a durable state transition containing pending decisions, target action, actor, expiry, and resume context; appending a message to the transcript is insufficient.",
      "evidence": "https://openai.github.io/openai-agents-python/human_in_the_loop/; https://github.com/cloudflare/agents/blob/main/docs/human-in-the-loop.md",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/continuity-threading", "runtime/locks-recovery", "deep-alignment"],
      "confidence": "high"
    },
    {
      "insight": "An edit must supersede persisted intent and rebase downstream work; changing only executed tool arguments can leave the original tool call eligible for regeneration.",
      "evidence": "https://docs.langchain.com/oss/python/langchain/human-in-the-loop; https://github.com/langchain-ai/langchain/issues/33787",
      "maps_to": ["runtime/continuity-threading", "runtime/convergence", "runtime/state-jsonl-checkpointing", "deep-alignment"],
      "confidence": "high"
    },
    {
      "insight": "Steering should be an ordered, scoped event stream with explicit effective boundaries, rather than an untyped prompt injection.",
      "evidence": "https://docs.ag-ui.com/introduction; https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/use-copilot-cli/steer-agents",
      "maps_to": ["runtime/continuity-threading", "runtime/gauges-observability", "deep-research", "deep-review", "deep-ai-council"],
      "confidence": "high"
    },
    {
      "insight": "An editable plan-as-document can identify step ownership and dependencies, then invalidate and recompute only downstream work after a human edit.",
      "evidence": "https://arxiv.org/abs/2412.10999; https://aclanthology.org/2025.emnlp-demos.69/",
      "maps_to": ["deep-research", "deep-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "insight": "Interruption evaluation should score intent adoption, stale-action rate, rollback or compensation, recovery latency, and token replay against repeated-attempt baselines.",
      "evidence": "https://arxiv.org/abs/2604.00892; https://arxiv.org/abs/2606.30774",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/continuity-threading", "deep-alignment"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "Human-in-the-loop means a final approval button after the loop finishes.",
      "counter": "The stronger pattern is interruption during execution: edit, retry, escalate, redirect, or change the plan before resuming.",
      "evidence": "https://docs.ag-ui.com/introduction; https://aclanthology.org/2025.emnlp-demos.69/"
    },
    {
      "claim": "An edited tool call is equivalent to replacing the original intent.",
      "counter": "The original intent must be explicitly superseded; otherwise stale calls may reappear after the edited action.",
      "evidence": "https://github.com/langchain-ai/langchain/issues/33787"
    },
    {
      "claim": "More feedback turns prove that human steering helped.",
      "counter": "Improvement may come from retries or resampling; evaluation needs an unguided repeated-attempt baseline and a feedback-use metric.",
      "evidence": "https://arxiv.org/abs/2606.30774"
    }
  ],
  "next_angles": [
    "Branch-aware human edits after partial fan-in: measure invalidation sets, reducer safety, and downstream rebase under late steering.",
    "Conflicting steering signals from multiple humans or agents: test vector clocks, fencing epochs, stale-decision rejection, and approval revocation.",
    "Human attention budgets: compare interruption timing at step boundaries, risk thresholds, and idle periods against rubber-stamping and recovery cost.",
    "Crash plus changed-intent continuity: combine JSONL replay, prompt compaction, delayed approval, and tool side effects; measure exact restoration and duplicate-action rate."
  ],
  "notes": "Coverage is strong for tool approval and editable plans, but weaker for authenticated multi-user steering, revocation after approval, approvals arriving after state changes, and human edits affecting already-completed side effects. InterruptBench's paper is stronger evidence than its small, still-immature repository."
}
```
hook: Stop
hook: Stop Completed
tokens used
269,525
