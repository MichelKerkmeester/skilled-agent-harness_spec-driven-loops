<!-- iteration 25 | model luna (gpt-5.6-luna) | angle: GAP-SWEEP #1: adjacent ecosystems uncovered | 2026-07-14T23:11:52.489Z -->

Gap-sweep #1 found five adjacent seams absent from the registry.

Agent Lightning separates stable rollouts from retryable attempts, persists versioned resources, emits monotonic trace sequences, and decouples runners from improvement algorithms via a central store. That is directly reusable for improvement-loop accounting and crash-aware fan-in. [Repository](https://github.com/microsoft/agent-lightning) · [Store design](https://microsoft.github.io/agent-lightning/stable/deep-dive/store/)

GitHub Agentic Workflows adds a compile boundary: editable Markdown becomes a locked workflow with read-only agent execution, sanitized writes, threat detection, and hard turn/credit limits. [Repository](https://github.com/github/gh-aw) · [architecture](https://github.github.com/gh-aw/introduction/how-they-work/) · [cost controls](https://github.github.com/gh-aw/reference/cost-management/)

Agent-Git is the clearest match for the open branch-invalidation thread: it combines checkpointing with non-destructive branching and compensating actions for tool side effects. [Repository](https://github.com/MAS-Infra-Layer/Agent-Git) · [paper](https://arxiv.org/abs/2511.00628)

BrowserGym supplies a standardized observation/action/reward/termination contract for interactive loops, while AgentDojo evaluates utility and security separately under live tool-use attacks. [BrowserGym paper](https://arxiv.org/abs/2412.05467) · [AgentDojo paper](https://arxiv.org/abs/2406.13352)

```json
{
  "new_repos": [
    {
      "name": "microsoft/agent-lightning",
      "url": "https://github.com/microsoft/agent-lightning",
      "stars": "~17.4k",
      "what": "Framework-agnostic agent training control plane with rollouts, retryable attempts, spans, workers, and versioned resources; latest release v0.3.0 in Dec 2025.",
      "lesson": "Make rollout identity stable across retries, separate attempt state from aggregate state, and use monotonic event sequencing for distributed fan-in.",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/gauges-observability", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "github/gh-aw",
      "url": "https://github.com/github/gh-aw",
      "stars": "~4.8k",
      "what": "Compiles natural-language Markdown workflows into hardened GitHub Actions; latest release v0.81.6 in Jun 2026.",
      "lesson": "Compile mutable intent into a locked execution artifact, isolate read-only reasoning from approved writes, and enforce turns, time, and credit ceilings outside the model.",
      "maps_to": ["deep-alignment", "runtime/convergence", "runtime/budget-cost", "runtime/locks-recovery", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "MAS-Infra-Layer/Agent-Git",
      "url": "https://github.com/MAS-Infra-Layer/Agent-Git",
      "stars": "~70",
      "what": "Git-like commit, revert, branching, and tool-reversal layer for agent trajectories; updated Feb 2026, with two tags and no published release.",
      "lesson": "A checkpoint is not a rollback unless external effects have inverse or compensating actions; preserve original branches when applying late human edits.",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/fan-out-fan-in", "runtime/continuity-threading", "runtime/locks-recovery"],
      "confidence": "med"
    },
    {
      "name": "ServiceNow/BrowserGym",
      "url": "https://github.com/ServiceNow/BrowserGym",
      "stars": "~1.3k",
      "what": "Gym-style interactive web-agent environment with unified task contracts and traceable benchmarks; latest release v0.14.3 in Jan 2026.",
      "lesson": "Define loop steps through explicit observation, action, reward, termination, and truncation fields so replay and cross-agent evaluation remain comparable.",
      "maps_to": ["deep-research", "deep-review", "runtime/convergence", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "ethz-spylab/agentdojo",
      "url": "https://github.com/ethz-spylab/agentdojo",
      "stars": "~582",
      "what": "Dynamic prompt-injection attack/defense benchmark for tool-using agents; latest release v0.1.35 in Oct 2025.",
      "lesson": "Score task utility and security independently; a successful answer must not compensate for an unsafe tool transition or policy violation.",
      "maps_to": ["deep-alignment", "runtime/convergence", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Use stable rollout IDs for semantic work units and child attempt IDs for retries; aggregate status upward while charging and diagnosing at both levels.",
      "evidence": "https://microsoft.github.io/agent-lightning/stable/deep-dive/store/",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/locks-recovery", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Add a compile-and-lock boundary between loop intent and execution, with static validation, capability allowlists, sanitized outputs, and pre-write threat checks.",
      "evidence": "https://github.github.com/gh-aw/introduction/how-they-work/ and https://github.github.com/gh-aw/reference/threat-detection/",
      "maps_to": ["deep-alignment", "runtime/locks-recovery", "runtime/convergence"],
      "confidence": "high"
    },
    {
      "insight": "Branch-aware continuation needs side-effect lineage, inverse operations, and explicit rebase or invalidation semantics; state snapshots alone are insufficient.",
      "evidence": "https://github.com/MAS-Infra-Layer/Agent-Git and https://arxiv.org/abs/2511.00628",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/fan-out-fan-in", "runtime/continuity-threading", "runtime/locks-recovery"],
      "confidence": "med"
    },
    {
      "insight": "A portable loop contract should expose observation, action, reward, termination, and truncation separately, enabling replay and comparable trajectory metrics.",
      "evidence": "https://arxiv.org/abs/2412.05467",
      "maps_to": ["deep-research", "deep-review", "runtime/convergence", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Alignment evaluation should use a Pareto or veto model over utility and security rather than collapsing both into one scalar reward.",
      "evidence": "https://github.com/ethz-spylab/agentdojo and https://arxiv.org/abs/2406.13352",
      "maps_to": ["deep-alignment", "runtime/convergence", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Restoring externalized state is sufficient for safe rollback.",
      "counter": "External tool effects may persist after state restoration and require inverse or compensating actions.",
      "evidence": "https://github.com/MAS-Infra-Layer/Agent-Git (maps to runtime/state-jsonl-checkpointing and runtime/locks-recovery)"
    },
    {
      "claim": "One aggregate quality score is enough to optimize an agent loop.",
      "counter": "An agent can complete the user task while violating security constraints, so utility and safety must remain separately gated.",
      "evidence": "https://arxiv.org/abs/2406.13352 (maps to deep-alignment and runtime/convergence)"
    }
  ],
  "next_angles": [
    "Benchmark late human edits against branch invalidation sets, reducer reruns, vector-clock fencing, and compensating side effects.",
    "Implement utility-security Pareto termination and compare hard vetoes against weighted penalties under adversarial tool loops.",
    "Measure per-rollout versus per-attempt budget accounting under retries, queueing, crashes, and partial external side effects.",
    "Fuzz source-to-lock compilation and replay to detect semantic drift between editable loop intent and executed JSONL events."
  ],
  "notes": "Coverage expanded into agent training control planes, compiled CI workflows, trajectory version control, embodied evaluation contracts, and adversarial tool-use benchmarks. Agent-Git is early and lightly adopted; BrowserGym and AgentDojo are evaluation environments rather than production runtimes. JSONL-specific crash-resume accounting and multi-human steering conflicts remain weakly covered."
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
session id: 019f62e3-9ebd-7e61-b587-1183fa82356a
--------
user
You are iteration 25/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: GAP-SWEEP #1: adjacent ecosystems uncovered
DIRECTIVE: Sweep for loop-engineering repos/ideas NOT yet in the registry — deliberately adjacent to what's been found. Broaden. Map to any subsystem.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (116) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop | Query reformulation & source diversification | Cross-iteration memory & knowledge accumulation | Reducer / aggregator design patterns | Partial-failure tolerance, retries, idempotency | Human-in-the-loop / steering / interrupt-resume | Cost economics & adaptive-depth scheduling
Insights so far: 120; contradictions logged: 70.
Open threads prior iterations flagged: Branch-aware human edits after partial fan-in: measure invalidation sets, reducer safety, and downstream rebase under late steering. | Conflicting steering signals from multiple humans or agents: test vector clocks, fencing epochs, stale-decision rejection, and approval revocation. | Human attention budgets: compare interruption timing at step boundaries, risk thresholds, and idle periods against rubber-stamping and recovery cost. | Crash plus changed-intent continuity: combine JSONL replay, prompt compaction, delayed approval, and tool side effects; measure exact restoration and duplicate-action rate. | Queue-aware budget pricing: adapt the compute price to provider cost, concurrency, cache hits, and latency pressure. | Correlated-branch economics: compare diverse retrieval, repeated reasoning, and verifier calls by marginal information gain per cost. | Verifier and human-attention markets: schedule expensive critics or human escalation as competing budget actions. | Crash-resume accounting: test whether JSONL replay double-charges, refunds, or loses reserved budget after partial side effects.

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
I’m widening into adjacent orchestration, workflow-runtime, and evaluation ecosystems, then verifying each candidate’s repository metadata and transfer path before selecting only genuinely new entries.
web search: 
web search: GitHub agentic workflow loop orchestration termination strategy evaluator repository Semantic Kernel process framework ...
web search: 
web search: site:github.com GitHub Agentic Workflows gh-aw repository stars ...
web search: 
web search: site:github.com/microsoft/promptflow GitHub Prompt flow stars latest release ...
web search: 
web search: GitHub agent loop runtime budget termination checkpoint replay agentic system repository ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:arxiv.org/abs/2508.03680 Agent Lightning trajectory level aggregation LightningStore ...
web search: 
web search: https://api.github.com/repos/MAS-Infra-Layer/Agent-Git
web search: 
web search: 'Stars'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/MAS-Infra-Layer/Agent-Git/commits/main/
web search: 
web search: site:github.com/MAS-Infra-Layer/Agent-Git/commits Agent-Git 2026 ...
web search: 
web search: GitHub AgentDojo agent security benchmark prompt injection tool loop stars release ...
codex
Gap-sweep #1 found five adjacent seams absent from the registry.

Agent Lightning separates stable rollouts from retryable attempts, persists versioned resources, emits monotonic trace sequences, and decouples runners from improvement algorithms via a central store. That is directly reusable for improvement-loop accounting and crash-aware fan-in. [Repository](https://github.com/microsoft/agent-lightning) · [Store design](https://microsoft.github.io/agent-lightning/stable/deep-dive/store/)

GitHub Agentic Workflows adds a compile boundary: editable Markdown becomes a locked workflow with read-only agent execution, sanitized writes, threat detection, and hard turn/credit limits. [Repository](https://github.com/github/gh-aw) · [architecture](https://github.github.com/gh-aw/introduction/how-they-work/) · [cost controls](https://github.github.com/gh-aw/reference/cost-management/)

Agent-Git is the clearest match for the open branch-invalidation thread: it combines checkpointing with non-destructive branching and compensating actions for tool side effects. [Repository](https://github.com/MAS-Infra-Layer/Agent-Git) · [paper](https://arxiv.org/abs/2511.00628)

BrowserGym supplies a standardized observation/action/reward/termination contract for interactive loops, while AgentDojo evaluates utility and security separately under live tool-use attacks. [BrowserGym paper](https://arxiv.org/abs/2412.05467) · [AgentDojo paper](https://arxiv.org/abs/2406.13352)

```json
{
  "new_repos": [
    {
      "name": "microsoft/agent-lightning",
      "url": "https://github.com/microsoft/agent-lightning",
      "stars": "~17.4k",
      "what": "Framework-agnostic agent training control plane with rollouts, retryable attempts, spans, workers, and versioned resources; latest release v0.3.0 in Dec 2025.",
      "lesson": "Make rollout identity stable across retries, separate attempt state from aggregate state, and use monotonic event sequencing for distributed fan-in.",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/gauges-observability", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "github/gh-aw",
      "url": "https://github.com/github/gh-aw",
      "stars": "~4.8k",
      "what": "Compiles natural-language Markdown workflows into hardened GitHub Actions; latest release v0.81.6 in Jun 2026.",
      "lesson": "Compile mutable intent into a locked execution artifact, isolate read-only reasoning from approved writes, and enforce turns, time, and credit ceilings outside the model.",
      "maps_to": ["deep-alignment", "runtime/convergence", "runtime/budget-cost", "runtime/locks-recovery", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "MAS-Infra-Layer/Agent-Git",
      "url": "https://github.com/MAS-Infra-Layer/Agent-Git",
      "stars": "~70",
      "what": "Git-like commit, revert, branching, and tool-reversal layer for agent trajectories; updated Feb 2026, with two tags and no published release.",
      "lesson": "A checkpoint is not a rollback unless external effects have inverse or compensating actions; preserve original branches when applying late human edits.",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/fan-out-fan-in", "runtime/continuity-threading", "runtime/locks-recovery"],
      "confidence": "med"
    },
    {
      "name": "ServiceNow/BrowserGym",
      "url": "https://github.com/ServiceNow/BrowserGym",
      "stars": "~1.3k",
      "what": "Gym-style interactive web-agent environment with unified task contracts and traceable benchmarks; latest release v0.14.3 in Jan 2026.",
      "lesson": "Define loop steps through explicit observation, action, reward, termination, and truncation fields so replay and cross-agent evaluation remain comparable.",
      "maps_to": ["deep-research", "deep-review", "runtime/convergence", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "ethz-spylab/agentdojo",
      "url": "https://github.com/ethz-spylab/agentdojo",
      "stars": "~582",
      "what": "Dynamic prompt-injection attack/defense benchmark for tool-using agents; latest release v0.1.35 in Oct 2025.",
      "lesson": "Score task utility and security independently; a successful answer must not compensate for an unsafe tool transition or policy violation.",
      "maps_to": ["deep-alignment", "runtime/convergence", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Use stable rollout IDs for semantic work units and child attempt IDs for retries; aggregate status upward while charging and diagnosing at both levels.",
      "evidence": "https://microsoft.github.io/agent-lightning/stable/deep-dive/store/",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/locks-recovery", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Add a compile-and-lock boundary between loop intent and execution, with static validation, capability allowlists, sanitized outputs, and pre-write threat checks.",
      "evidence": "https://github.github.com/gh-aw/introduction/how-they-work/ and https://github.github.com/gh-aw/reference/threat-detection/",
      "maps_to": ["deep-alignment", "runtime/locks-recovery", "runtime/convergence"],
      "confidence": "high"
    },
    {
      "insight": "Branch-aware continuation needs side-effect lineage, inverse operations, and explicit rebase or invalidation semantics; state snapshots alone are insufficient.",
      "evidence": "https://github.com/MAS-Infra-Layer/Agent-Git and https://arxiv.org/abs/2511.00628",
      "maps_to": ["runtime/state-jsonl-checkpointing", "runtime/fan-out-fan-in", "runtime/continuity-threading", "runtime/locks-recovery"],
      "confidence": "med"
    },
    {
      "insight": "A portable loop contract should expose observation, action, reward, termination, and truncation separately, enabling replay and comparable trajectory metrics.",
      "evidence": "https://arxiv.org/abs/2412.05467",
      "maps_to": ["deep-research", "deep-review", "runtime/convergence", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Alignment evaluation should use a Pareto or veto model over utility and security rather than collapsing both into one scalar reward.",
      "evidence": "https://github.com/ethz-spylab/agentdojo and https://arxiv.org/abs/2406.13352",
      "maps_to": ["deep-alignment", "runtime/convergence", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Restoring externalized state is sufficient for safe rollback.",
      "counter": "External tool effects may persist after state restoration and require inverse or compensating actions.",
      "evidence": "https://github.com/MAS-Infra-Layer/Agent-Git (maps to runtime/state-jsonl-checkpointing and runtime/locks-recovery)"
    },
    {
      "claim": "One aggregate quality score is enough to optimize an agent loop.",
      "counter": "An agent can complete the user task while violating security constraints, so utility and safety must remain separately gated.",
      "evidence": "https://arxiv.org/abs/2406.13352 (maps to deep-alignment and runtime/convergence)"
    }
  ],
  "next_angles": [
    "Benchmark late human edits against branch invalidation sets, reducer reruns, vector-clock fencing, and compensating side effects.",
    "Implement utility-security Pareto termination and compare hard vetoes against weighted penalties under adversarial tool loops.",
    "Measure per-rollout versus per-attempt budget accounting under retries, queueing, crashes, and partial external side effects.",
    "Fuzz source-to-lock compilation and replay to detect semantic drift between editable loop intent and executed JSONL events."
  ],
  "notes": "Coverage expanded into agent training control planes, compiled CI workflows, trajectory version control, embodied evaluation contracts, and adversarial tool-use benchmarks. Agent-Git is early and lightly adopted; BrowserGym and AgentDojo are evaluation environments rather than production runtimes. JSONL-specific crash-resume accounting and multi-human steering conflicts remain weakly covered."
}
```
hook: Stop
hook: Stop Completed
tokens used
150,219
