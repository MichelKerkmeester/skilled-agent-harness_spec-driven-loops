<!-- iteration 30 | model sol (gpt-5.6-sol) | angle: Durable-execution ↔ agent-loop mapping (deep) | 2026-07-14T23:42:04.577Z -->

The transferable guarantee is narrower than “the agent resumes exactly where it stopped.” Durable execution reconstructs a deterministic coordinator from committed history. It does not make an uncommitted LLM or tool invocation deterministic or exactly-once. Azure explicitly documents activities as at-least-once, while Dapr’s agent runtime reuses the recorded assistant message during replay instead of invoking the model again. ([Azure Durable Task](https://learn.microsoft.com/en-us/azure/durable-task/common/programming-model-overview), [Dapr Agents](https://docs.dapr.io/developing-ai/dapr-agents/dapr-agents-hooks/))

For `runtime/state-jsonl-checkpointing`, model each nondeterministic operation as `scheduled -> completed|failed|indeterminate`. `scheduled` needs stable call/attempt IDs, request hash, owner epoch, and driver/policy/prompt/model/tool-schema versions. `completed` stores the raw output or immutable blob hash, provider request ID, usage, and backend fingerprint. Recovery consumes only committed completions. If the process died after the remote call but before committing its result, mark the attempt `indeterminate`; regeneration requires a new attempt and branch identity.

Canonical JSONL writes should use Kurrent-style expected-sequence CAS plus deterministic event IDs. This makes a lost-ack append safely retryable and rejects competing writers. It still cannot atomically couple the append with an external API call. ([KurrentDB append semantics](https://docs.kurrent.io/clients/python/v1.1/appending-events))

A lease supplies liveness, not ownership safety. Hazelcast documents how a paused holder can lose its session, wake later, and conflict with the new holder. Every canonical append and effect dispatch therefore needs a monotonically increasing `writer_epoch` that the destination validates; late results from stale epochs become orphan evidence, never state transitions. ([Hazelcast FencedLock](https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock))

Even greedy decoding is not a replay mechanism: the NeurIPS 2025 study found that batch size, GPU count/type, and floating-point reduction order can materially change reasoning outputs. Seeds and model names are diagnostic provenance only; the actual observed output is the replay object. ([NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html))

Finally, control-policy changes are history-schema changes. Adding, removing, or reordering durable calls can make old histories unreplayable, as Convex and Azure document. In-flight runs should remain pinned to their reducer/driver version or receive an explicit migration/fork event. ([Convex limitations](https://github.com/get-convex/workflow#limitations), [Azure orchestration versioning](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-orchestration-versioning))

```json
{
  "new_repos": [
    {
      "name": "dapr/dapr-agents",
      "url": "https://github.com/dapr/dapr-agents",
      "stars": "~713",
      "what": "Workflow-backed agent framework; v1.0.5 released 2026-06-15; records LLM activity outputs for replay.",
      "lesson": "Put each LLM/tool call behind a durable activity boundary and replay the committed response rather than invoking the provider again.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "deep-research",
        "deep-ai-council"
      ],
      "confidence": "high"
    },
    {
      "name": "get-convex/workflow",
      "url": "https://github.com/get-convex/workflow",
      "stars": "~76",
      "what": "TypeScript durable-workflow component; v0.4.4 tagged 2026-06-10; deterministic replay with explicit 8 MiB journal limits.",
      "lesson": "Stable step identities and workflow versions are part of the history schema; regenerating from an earlier step creates a new epoch rather than transparent recovery.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "kurrent-io/KurrentDB",
      "url": "https://github.com/kurrent-io/KurrentDB",
      "stars": "~5.8k",
      "what": "Event-native append-only database; v26.1.0 released 2026-04-30; supports atomic appends, expected-revision checks, and event-ID idempotency.",
      "lesson": "Require expected_seq and deterministic event_id on every canonical JSONL transition so retries are idempotent and stale writers fail closed.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "hazelcast/hazelcast",
      "url": "https://github.com/hazelcast/hazelcast",
      "stars": "~6.6k",
      "what": "Distributed data platform with CP FencedLock; v5.7.0 released 2026-05-13.",
      "lesson": "A lease must yield a monotonic fencing epoch that every state sink and effect broker validates; the lock service alone cannot stop a paused stale worker.",
      "maps_to": [
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "nanomaoli/llm_reproducibility",
      "url": "https://github.com/nanomaoli/llm_reproducibility",
      "stars": "~106",
      "what": "Code for NeurIPS 2025 inference-reproducibility research; no formal releases, with repository updates through 2026-05-29.",
      "lesson": "Seed, temperature, and model name are provenance rather than replay guarantees; persist the actual response because hardware and batching can alter greedy reasoning.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability",
        "deep-review"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Represent every nondeterministic call with separate scheduled, completed, failed, and indeterminate JSONL events; replay may consume a completed result but must never silently regenerate the same attempt.",
      "evidence": "https://docs.dapr.io/developing-ai/dapr-agents/dapr-agents-hooks/ ; https://learn.microsoft.com/en-us/azure/durable-task/common/programming-model-overview",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Derive event_id from run_id, writer_epoch, step_id, attempt_id, and event_kind, and append only when expected_seq matches; this closes duplicate-append and competing-writer races but not the remote-call crash gap.",
      "evidence": "https://docs.kurrent.io/clients/python/v1.1/appending-events",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Lease expiry should trigger takeover, while a sink-enforced writer_epoch provides safety; late responses from older epochs should increment an orphan-result gauge and remain non-canonical.",
      "evidence": "https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock",
      "maps_to": [
        "runtime/locks-recovery",
        "runtime/gauges-observability",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Record seed, backend fingerprint, hardware, batching, and precision for diagnosis, but treat the immutable observed output as the only replayable model result.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "insight": "Pin driver_version, policy_version, and event_schema_version at run creation; changed durable-call topology requires an explicit compatibility branch, migration, or new run rather than replay under the new code.",
      "evidence": "https://github.com/get-convex/workflow#limitations ; https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-orchestration-versioning",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "deep-improvement"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Durable activity execution provides exactly-once LLM and tool effects.",
      "counter": "Activities are generally at-least-once when execution finishes before its result is committed; runtime/locks-recovery needs an explicit indeterminate state, idempotency, and reconciliation.",
      "evidence": "https://learn.microsoft.com/en-us/azure/durable-task/common/programming-model-overview"
    },
    {
      "claim": "Reissuing the same prompt during recovery is deterministic replay.",
      "counter": "Replay returns the recorded assistant message; reissuing inference is a new stochastic attempt and must create a new branch or attempt identity in runtime/state-jsonl-checkpointing.",
      "evidence": "https://docs.dapr.io/developing-ai/dapr-agents/dapr-agents-hooks/"
    },
    {
      "claim": "Temperature zero or a fixed seed makes an LLM response reproducible.",
      "counter": "Greedy outputs can still diverge with GPU, batching, and reduction-order changes; runtime/gauges-observability should treat these settings as provenance, not a guarantee.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html"
    },
    {
      "claim": "A renewable lease guarantees one active loop writer.",
      "counter": "A paused former holder can resume after lease expiry; runtime/locks-recovery is safe only when canonical sinks reject stale fencing epochs.",
      "evidence": "https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock"
    }
  ],
  "next_angles": [
    "Build a Jepsen-style crash-point matrix for runtime/state-jsonl-checkpointing and runtime/locks-recovery across pre-send, post-send, post-response, pre-fsync, and post-fsync failures.",
    "Survey provider-specific request idempotency and status-reconciliation support, then quantify duplicate-token and duplicate-effect exposure in runtime/budget-cost.",
    "Fuzz replay compatibility across driver, policy, prompt, model, rubric, and tool-schema upgrades for runtime/continuity-threading and deep-improvement.",
    "Compare first-current-epoch-wins, evaluator-selected, and human-reviewed policies when multiple valid LLM responses emerge from one indeterminate logical call."
  ],
  "notes": "The unresolved gap is the remote-effect acknowledgement window: no generic JSONL or lock protocol can prove that a timed-out LLM/tool request did not execute. Fencing works only when the actual state or effect sink validates the epoch. Provider reconciliation capabilities and local JSONL fsync/torn-tail behavior need dedicated fault-injection evidence."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: ultra
reasoning summaries: none
session id: 019f62fd-9224-7ef3-90f5-1eedf7d6cecd
--------
user
You are iteration 30/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Durable-execution ↔ agent-loop mapping (deep)
DIRECTIVE: Precisely what durable-workflow guarantees transfer to LLM loops and what breaks (nondeterminism). Map to runtime/state-jsonl-checkpointing, runtime/locks-recovery.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (140) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop | Query reformulation & source diversification | Cross-iteration memory & knowledge accumulation | Reducer / aggregator design patterns | Partial-failure tolerance, retries, idempotency | Human-in-the-loop / steering / interrupt-resume | Cost economics & adaptive-depth scheduling | GAP-SWEEP #1: adjacent ecosystems uncovered | Contradiction audit: convergent vs divergent | Determinism under concurrency (fan-out correctness) | Evaluator reliability: LLM-as-judge failure modes | Novelty/coverage metrics that formally drive broadening
Insights so far: 144; contradictions logged: 87.
Open threads prior iterations flagged: De-anchored evaluation protocols: compare commit-first, blind-solve, reference-guided, and candidate-first judges on long-form reviews and complete agent trajectories. | Correlation-aware council aggregation: seed family-correlated failures and compare majority vote, arithmetic mean, geometric median, leave-one-family-out selection, and abstention. | Evaluator upgrade drift: replay fixed JSONL trajectories across judge-model, rubric, prompt-template, and parser upgrades and measure winner flips and premature-stop flips. | Presentation invariance beyond verbosity: isolate markdown, citation density, sectioning, confidence language, and polished-but-unverifiable reasoning from substantive quality. | Calibrate Good-Turing and capture-recapture unseen-mass estimators under adaptive, non-IID agent search and correlated source families. | Design a versioned semantic-aspect ontology with split/merge lineage so coverage cannot be inflated by clustering drift. | Replay historical JSONL trajectories through the two-axis STOP/PIVOT policy and measure premature-stop, unnecessary-pivot and budget-regret deltas. | Compare quality-weighted k-DPP, submodular facility location and farthest-first fan-out under family-correlated agent failures.

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
This is read-only research, so no spec-folder write gate applies. I’m checking the prior research memory and skill routing first, then I’ll verify a small set of genuinely new durable-execution sources against primary docs and GitHub.
exec
/bin/zsh -lc "node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"Research current durable-execution guarantees that transfer to nondeterministic LLM agent loops, emphasizing JSONL checkpointing and locks/recovery, using authoritative web sources and new GitHub repos\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 0ms:
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-skill-advisor/daemon-ipc.sock",
  "exitCode": 75
}

exec
/bin/zsh -lc "node .opencode/bin/spec-memory.cjs memory_context --json '{\"input\":\"iteration 30 durable-execution agent-loop mapping nondeterminism state JSONL checkpointing locks recovery\",\"mode\":\"resume\"}' --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 3144ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

codex
The local memory/advisor daemons are unavailable (both returned retryable exit 75), so I’m using the supplied 29-iteration coverage as the exclusion baseline. The research split is now: workflow replay semantics, stochastic-call boundaries, and lock/lease recovery.
web search: 
web search: site:github.com durable workflow engine deterministic replay event history Cadence Azure Durable Task ...
web search: 
web search: github Azure/durabletask stars latest release 2026 ...
web search: 
web search: https://github.com/Azure/durabletask
web search: 
web search: 'stars'
web search: 
web search: https://api.github.com/repos/get-convex/workflow
web search: 
web search: official LLM API seed determinism best effort system fingerprint nondeterministic outputs docs ...
web search: 
web search: 
web search: 
web search: site:github.com/taskforcesh/bullmq stars latest release ...
web search: 
web search: https://github.com/taskforcesh/bullmq
web search: 
web search: site:cadenceworkflow.io/docs workflow determinism replay continue as new history activity retries ...
web search: 
web search: site:github.com/get-convex/workflow/releases/tag get-convex workflow 2026 ...
web search: 
web search: https://github.com/vercel/workflow
web search: 
web search: site:workflow-sdk.dev docs durability replay deterministic step exactly once retries workflow Vercel ...
codex
The strongest boundary is now clear: durable engines can make recovery deterministic relative to committed history, but they cannot make a fresh model/tool invocation deterministic or atomic with the checkpoint. I’m verifying the remaining repo metadata and the stale-worker fencing evidence before synthesis.
web search: 
web search: site:github.com/hazelcast/hazelcast stars release 5.7.0 2026 ...
web search: 
web search: site:github.com/kurrent-io/KurrentDB stars v26.1.0 Apr 2026 ...
web search: 
web search: https://github.com/get-convex/workflow/tags
web search: 
web search: 'Stars'
web search: 
web search: https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html
web search: 
web search: https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock
web search: 
web search: 'never re-execute'
codex
The transferable guarantee is narrower than “the agent resumes exactly where it stopped.” Durable execution reconstructs a deterministic coordinator from committed history. It does not make an uncommitted LLM or tool invocation deterministic or exactly-once. Azure explicitly documents activities as at-least-once, while Dapr’s agent runtime reuses the recorded assistant message during replay instead of invoking the model again. ([Azure Durable Task](https://learn.microsoft.com/en-us/azure/durable-task/common/programming-model-overview), [Dapr Agents](https://docs.dapr.io/developing-ai/dapr-agents/dapr-agents-hooks/))

For `runtime/state-jsonl-checkpointing`, model each nondeterministic operation as `scheduled -> completed|failed|indeterminate`. `scheduled` needs stable call/attempt IDs, request hash, owner epoch, and driver/policy/prompt/model/tool-schema versions. `completed` stores the raw output or immutable blob hash, provider request ID, usage, and backend fingerprint. Recovery consumes only committed completions. If the process died after the remote call but before committing its result, mark the attempt `indeterminate`; regeneration requires a new attempt and branch identity.

Canonical JSONL writes should use Kurrent-style expected-sequence CAS plus deterministic event IDs. This makes a lost-ack append safely retryable and rejects competing writers. It still cannot atomically couple the append with an external API call. ([KurrentDB append semantics](https://docs.kurrent.io/clients/python/v1.1/appending-events))

A lease supplies liveness, not ownership safety. Hazelcast documents how a paused holder can lose its session, wake later, and conflict with the new holder. Every canonical append and effect dispatch therefore needs a monotonically increasing `writer_epoch` that the destination validates; late results from stale epochs become orphan evidence, never state transitions. ([Hazelcast FencedLock](https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock))

Even greedy decoding is not a replay mechanism: the NeurIPS 2025 study found that batch size, GPU count/type, and floating-point reduction order can materially change reasoning outputs. Seeds and model names are diagnostic provenance only; the actual observed output is the replay object. ([NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html))

Finally, control-policy changes are history-schema changes. Adding, removing, or reordering durable calls can make old histories unreplayable, as Convex and Azure document. In-flight runs should remain pinned to their reducer/driver version or receive an explicit migration/fork event. ([Convex limitations](https://github.com/get-convex/workflow#limitations), [Azure orchestration versioning](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-orchestration-versioning))

```json
{
  "new_repos": [
    {
      "name": "dapr/dapr-agents",
      "url": "https://github.com/dapr/dapr-agents",
      "stars": "~713",
      "what": "Workflow-backed agent framework; v1.0.5 released 2026-06-15; records LLM activity outputs for replay.",
      "lesson": "Put each LLM/tool call behind a durable activity boundary and replay the committed response rather than invoking the provider again.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "deep-research",
        "deep-ai-council"
      ],
      "confidence": "high"
    },
    {
      "name": "get-convex/workflow",
      "url": "https://github.com/get-convex/workflow",
      "stars": "~76",
      "what": "TypeScript durable-workflow component; v0.4.4 tagged 2026-06-10; deterministic replay with explicit 8 MiB journal limits.",
      "lesson": "Stable step identities and workflow versions are part of the history schema; regenerating from an earlier step creates a new epoch rather than transparent recovery.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "kurrent-io/KurrentDB",
      "url": "https://github.com/kurrent-io/KurrentDB",
      "stars": "~5.8k",
      "what": "Event-native append-only database; v26.1.0 released 2026-04-30; supports atomic appends, expected-revision checks, and event-ID idempotency.",
      "lesson": "Require expected_seq and deterministic event_id on every canonical JSONL transition so retries are idempotent and stale writers fail closed.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "hazelcast/hazelcast",
      "url": "https://github.com/hazelcast/hazelcast",
      "stars": "~6.6k",
      "what": "Distributed data platform with CP FencedLock; v5.7.0 released 2026-05-13.",
      "lesson": "A lease must yield a monotonic fencing epoch that every state sink and effect broker validates; the lock service alone cannot stop a paused stale worker.",
      "maps_to": [
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "nanomaoli/llm_reproducibility",
      "url": "https://github.com/nanomaoli/llm_reproducibility",
      "stars": "~106",
      "what": "Code for NeurIPS 2025 inference-reproducibility research; no formal releases, with repository updates through 2026-05-29.",
      "lesson": "Seed, temperature, and model name are provenance rather than replay guarantees; persist the actual response because hardware and batching can alter greedy reasoning.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability",
        "deep-review"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Represent every nondeterministic call with separate scheduled, completed, failed, and indeterminate JSONL events; replay may consume a completed result but must never silently regenerate the same attempt.",
      "evidence": "https://docs.dapr.io/developing-ai/dapr-agents/dapr-agents-hooks/ ; https://learn.microsoft.com/en-us/azure/durable-task/common/programming-model-overview",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Derive event_id from run_id, writer_epoch, step_id, attempt_id, and event_kind, and append only when expected_seq matches; this closes duplicate-append and competing-writer races but not the remote-call crash gap.",
      "evidence": "https://docs.kurrent.io/clients/python/v1.1/appending-events",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Lease expiry should trigger takeover, while a sink-enforced writer_epoch provides safety; late responses from older epochs should increment an orphan-result gauge and remain non-canonical.",
      "evidence": "https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock",
      "maps_to": [
        "runtime/locks-recovery",
        "runtime/gauges-observability",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Record seed, backend fingerprint, hardware, batching, and precision for diagnosis, but treat the immutable observed output as the only replayable model result.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "insight": "Pin driver_version, policy_version, and event_schema_version at run creation; changed durable-call topology requires an explicit compatibility branch, migration, or new run rather than replay under the new code.",
      "evidence": "https://github.com/get-convex/workflow#limitations ; https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-orchestration-versioning",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "deep-improvement"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Durable activity execution provides exactly-once LLM and tool effects.",
      "counter": "Activities are generally at-least-once when execution finishes before its result is committed; runtime/locks-recovery needs an explicit indeterminate state, idempotency, and reconciliation.",
      "evidence": "https://learn.microsoft.com/en-us/azure/durable-task/common/programming-model-overview"
    },
    {
      "claim": "Reissuing the same prompt during recovery is deterministic replay.",
      "counter": "Replay returns the recorded assistant message; reissuing inference is a new stochastic attempt and must create a new branch or attempt identity in runtime/state-jsonl-checkpointing.",
      "evidence": "https://docs.dapr.io/developing-ai/dapr-agents/dapr-agents-hooks/"
    },
    {
      "claim": "Temperature zero or a fixed seed makes an LLM response reproducible.",
      "counter": "Greedy outputs can still diverge with GPU, batching, and reduction-order changes; runtime/gauges-observability should treat these settings as provenance, not a guarantee.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2025/hash/f80094a824ba5912d4a2de169c404a40-Abstract-Conference.html"
    },
    {
      "claim": "A renewable lease guarantees one active loop writer.",
      "counter": "A paused former holder can resume after lease expiry; runtime/locks-recovery is safe only when canonical sinks reject stale fencing epochs.",
      "evidence": "https://docs.hazelcast.com/hazelcast/5.7/data-structures/fencedlock"
    }
  ],
  "next_angles": [
    "Build a Jepsen-style crash-point matrix for runtime/state-jsonl-checkpointing and runtime/locks-recovery across pre-send, post-send, post-response, pre-fsync, and post-fsync failures.",
    "Survey provider-specific request idempotency and status-reconciliation support, then quantify duplicate-token and duplicate-effect exposure in runtime/budget-cost.",
    "Fuzz replay compatibility across driver, policy, prompt, model, rubric, and tool-schema upgrades for runtime/continuity-threading and deep-improvement.",
    "Compare first-current-epoch-wins, evaluator-selected, and human-reviewed policies when multiple valid LLM responses emerge from one indeterminate logical call."
  ],
  "notes": "The unresolved gap is the remote-effect acknowledgement window: no generic JSONL or lock protocol can prove that a timed-out LLM/tool request did not execute. Fencing works only when the actual state or effect sink validates the epoch. Provider reconciliation capabilities and local JSONL fsync/torn-tail behavior need dedicated fault-injection evidence."
}
```
hook: Stop
hook: Stop Completed
tokens used
215,975
