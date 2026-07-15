<!-- iteration 27 | model sol (gpt-5.6-sol) | angle: Determinism under concurrency (fan-out correctness) | 2026-07-14T23:25:43.188Z -->

Five new repositories survived the exclusion check. The stronger conclusion is that “sort before reduce” is insufficient: correctness needs separate contracts for value reproducibility, ordering, task identity, lock ownership, and reduction topology.

- Spark’s [`DETERMINATE` / `UNORDERED` / `INDETERMINATE`](https://spark.apache.org/docs/latest/api/java/org/apache/spark/rdd/DeterministicLevel.html) classification transfers cleanly. Most live LLM calls are `INDETERMINATE` on re-execution, even when previously captured outputs can be reduced deterministically. Store both an ordered digest and a multiset digest; make reducers declare which upstream class they accept.

- Dask separates [completion-order observation](https://distributed.dask.org/en/stable/api.html) from input-order gathering. It also assumes functions are [pure by default](https://distributed.dask.org/en/stable/client.html), reusing stable computation keys, while deterministic tokenization is [not fail-closed by default](https://docs.dask.org/en/latest/configuration.html). System-deep-loop therefore needs distinct `work_key`, `sample_id`, `attempt_id`, and preallocated `branch_id`; otherwise independent same-prompt rollouts may collapse into one cached result.

- Dedup is a linearizable claim protocol, not a lookup. Prefect’s default [`READ_COMMITTED` cache isolation](https://docs.prefect.io/v3/concepts/caching) explicitly permits concurrent same-key executions. Asynq demonstrates the missing ownership rule: its completion script [deletes a uniqueness lock only when the stored task ID still owns it](https://github.com/hibiken/asynq/blob/master/internal/rdb/rdb.go). Add a fencing generation too, preventing an expired worker from releasing or committing over a newer claim.

- CALM separates coordination-free, [monotonic computation](https://arxiv.org/abs/1901.01930) from decisions requiring a barrier. Appending immutable branch results is monotonic; declaring “all finished,” retracting duplicates, selecting top-k, or stopping for convergence is not. Those operations need an explicit epoch manifest and close event. Reproducible early stopping should run only at fixed decision watermarks, never after whichever response happens to finish next.

- Reducer topology is semantic state. oneTBB’s [`parallel_deterministic_reduce`](https://uxlfoundation.github.io/oneTBB/main/specification/source/algorithms/functions/parallel_deterministic_reduce_func.html) fixes split/join order independently of worker count, yet warns that its answer can differ from a sequential reduction. Canonical branch sorting therefore still needs a versioned reduction tree; convergence scores should preferably be quantized integers or otherwise reproducibly accumulated.

```json
{
  "new_repos": [
    {
      "name": "apache/spark",
      "url": "https://github.com/apache/spark",
      "stars": "~43.6k",
      "what": "Large-scale data engine with explicit DETERMINATE, UNORDERED, and INDETERMINATE replay classes; Spark 4.1.2 released May 2026.",
      "lesson": "Attach a determinism class to every fan-out stage and compare ordered versus multiset digests according to that contract.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "dask/distributed",
      "url": "https://github.com/dask/distributed",
      "stars": "~1.7k",
      "what": "Distributed scheduler exposing completion-order iteration, input-order gathering, and content-derived keys; latest GitHub release dated July 2026.",
      "lesson": "Separate arrival order from canonical reduction order, and separate deterministic work identity from stochastic sample identity.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "PrefectHQ/prefect",
      "url": "https://github.com/PrefectHQ/prefect",
      "stars": "~23.4k",
      "what": "Python workflow engine whose cache isolation documents concurrent same-key execution under READ_COMMITTED; release 3.7.8 in July 2026.",
      "lesson": "A matching cache key is not mutual exclusion; novelty reuse needs a serialized claim or atomic compare-and-set.",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "hibiken/asynq",
      "url": "https://github.com/hibiken/asynq",
      "stars": "~13.5k",
      "what": "Redis-backed Go task queue using atomic uniqueness scripts and owner-checked lock deletion; v0.26.0 released February 2026.",
      "lesson": "Store owner and generation with each dedup claim, and release it only through an owner-checked fenced transition.",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "uxlfoundation/oneTBB",
      "url": "https://github.com/uxlfoundation/oneTBB",
      "stars": "~6.7k",
      "what": "C++ parallel runtime with a deterministic reduction primitive that fixes split and join topology; latest GitHub release dated July 2026.",
      "lesson": "Version and replay the reduction tree itself; canonical input ordering alone does not stabilize non-associative aggregation.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Give every stage a replay class: DETERMINATE for identical ordered output, UNORDERED for an identical multiset, and INDETERMINATE for potentially different values. Persist an ordered hash plus a hash of sorted content-hash/count pairs.",
      "evidence": "Apache Spark DeterministicLevel: https://spark.apache.org/docs/latest/api/java/org/apache/spark/rdd/DeterministicLevel.html",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Allocate branch_id, sample_id, and attempt_id before dispatch; record arrival_seq only as telemetry. Content-address deterministic work, but include sample identity for independent stochastic rollouts and fail closed when inputs cannot be canonically tokenized.",
      "evidence": "Dask client, as_completed, and tokenization docs: https://distributed.dask.org/en/stable/client.html ; https://distributed.dask.org/en/stable/api.html ; https://docs.dask.org/en/latest/generated/dask.tokenize.tokenize.html",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Model novelty exclusion as claim, commit, and release events carrying dedup_key, generation, owner_event_id, and expiry. Compare owner and generation on every release or commit so an expired worker cannot overwrite a renewed claim.",
      "evidence": "Prefect cache isolation and Asynq owner-checked Lua transitions: https://docs.prefect.io/v3/concepts/caching ; https://github.com/hibiken/asynq/blob/master/internal/rdb/rdb.go",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Split fan-in into monotonic collection and coordinated finalization. Results may append concurrently, but semantic dedup retractions, top-k, all-complete, convergence, and stopping execute only after a versioned epoch-close barrier.",
      "evidence": "CALM theorem and Prefect concurrent-cache behavior: https://arxiv.org/abs/1901.01930 ; https://docs.prefect.io/v3/concepts/caching",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Define a canonical reduction tree over sorted branch IDs, quantize evaluator scores before aggregation, and use stable tie-break tuples. Fuzz permutations, worker counts, tree shapes, and duplicate injection around every convergence threshold.",
      "evidence": "oneTBB deterministic reduction specification: https://uxlfoundation.github.io/oneTBB/main/specification/source/algorithms/functions/parallel_deterministic_reduce_func.html",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Stable content keys make repeated fan-out submissions idempotent.",
      "counter": "For stochastic LLM calls, identical inputs may denote intentionally independent samples; pure-function reuse collapses diversity, while noncanonical inputs can generate unstable keys.",
      "evidence": "https://distributed.dask.org/en/stable/client.html ; https://docs.dask.org/en/latest/configuration.html"
    },
    {
      "claim": "A matching cache or novelty key prevents duplicate execution.",
      "counter": "Prefect explicitly permits simultaneous same-key execution under its default cache isolation; exclusion requires serialization or an atomic claim.",
      "evidence": "https://docs.prefect.io/v3/concepts/caching"
    },
    {
      "claim": "A TTL uniqueness lock is safe to release when an old task finishes.",
      "counter": "After expiry and reacquisition, that release can delete the new owner's lock; Asynq avoids this by comparing the stored owner ID before deletion.",
      "evidence": "https://github.com/hibiken/asynq/blob/master/internal/rdb/rdb.go"
    },
    {
      "claim": "The same branch values necessarily produce the same aggregate.",
      "counter": "Parallel split and join topology can change a non-associative result; oneTBB needs a deterministic tree and still documents that its answer may differ from sequential reduction.",
      "evidence": "https://uxlfoundation.github.io/oneTBB/main/specification/source/algorithms/functions/parallel_deterministic_reduce_func.html"
    }
  ],
  "next_angles": [
    "Build a Jepsen-style linearizability model for novelty claim/commit/release histories under TTL expiry, crash, retry, and ABA lock reacquisition.",
    "Differentially replay one branch multiset across completion permutations, worker counts, reduction trees, and numeric encodings; measure top-k and stopping-decision flips.",
    "Fuzz cross-language canonicalization of JSON, Unicode, floating-point edge cases, prompt templates, and stochastic sample identifiers.",
    "Design deterministic streaming early termination using fixed decision epochs, late-result policies, and replayable cancellation boundaries."
  ],
  "notes": "Direct agent frameworks still rarely publish formal concurrency or determinism contracts; the strongest evidence came from adjacent dataflow, workflow, queue, and parallel-runtime systems. True model-call re-execution remains indeterminate unless outputs, provider revision, prompt bytes, tool versions, and sampling identity are captured."
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
session id: 019f62ee-0336-7ba0-b6d2-c3a198591b81
--------
user
You are iteration 27/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Determinism under concurrency (fan-out correctness)
DIRECTIVE: The subtle correctness problems in concurrent map-reduce agent loops: ordering, dedup races, reproducibility. Map to runtime/fan-out-fan-in, runtime/dedup-novelty.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (126) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop | Query reformulation & source diversification | Cross-iteration memory & knowledge accumulation | Reducer / aggregator design patterns | Partial-failure tolerance, retries, idempotency | Human-in-the-loop / steering / interrupt-resume | Cost economics & adaptive-depth scheduling | GAP-SWEEP #1: adjacent ecosystems uncovered | Contradiction audit: convergent vs divergent
Insights so far: 130; contradictions logged: 76.
Open threads prior iterations flagged: Crash-resume accounting: test whether JSONL replay double-charges, refunds, or loses reserved budget after partial side effects. | Benchmark late human edits against branch invalidation sets, reducer reruns, vector-clock fencing, and compensating side effects. | Implement utility-security Pareto termination and compare hard vetoes against weighted penalties under adversarial tool loops. | Measure per-rollout versus per-attempt budget accounting under retries, queueing, crashes, and partial external side effects. | Fuzz source-to-lock compilation and replay to detect semantic drift between editable loop intent and executed JSONL events. | Replay identical system-deep-loop JSONL trajectories under separate branch-stop and parent-stop policies, measuring false stops, wasted budget, and final selection regret. | Construct delayed-bloom branches whose quality improves only after apparent stabilization to calibrate multi-fidelity promotion and full-depth sentinel rates. | Estimate a two-dimensional improvement hazard: probability that another step improves an existing branch versus probability that a new independent branch finds a better basin.

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
I’m treating this as read-only iteration research: no spec-folder writes. I’ll verify candidate repos against the exclusion list, then cross-check concurrency semantics in primary docs and papers; any unstable star or recency data will be labeled approximate.
web search: 
web search: site:github.com/apple/foundationdb deterministic simulation testing stars ...
web search: 
web search: site:distributed.dask.org/en/latest/api.html Client.gather order futures as_completed ...
web search: 
web search: github dask distributed stars releases 2026 ...
web search: 
web search: https://api.github.com/repos/dask/distributed
web search: 
web search: site:github.com/dask/distributed "stars" "2026.3.0" ...
web search: 
web search: 
web search: 
web search: 'stars'
web search: 
web search: site:docs.bullmq.io/guide/jobs deduplication idempotent jobId duplicate concurrency ...
web search: 
web search: site:docs.tigerbeetle.com deterministic simulation VOPR seed concurrency testing ...
web search: 
web search: 'history'
codex
The strongest transfer is emerging at the boundary between “stable identity” and “independent sampling”: content-addressed task keys make pure maps reproducible, but can silently collapse intentionally stochastic LLM branches. I’m checking reducer algebra and fault-history evidence before fixing the recommendations.
web search: 
web search: CALM theorem paper monotonicity coordination-free distributed programs pdf Hellerstein Alvaro ...
web search: 
web search: 
web search: 
web search: https://github.com/tigerbeetle/tigerbeetle
2026-07-14T23:22:25.584883Z ERROR codex_core::tools::router: error=timeout_ms must be at least 10000
web search: 
web search: reproducible parallel reduction floating point order repository ReproBLAS GitHub ...
web search: 
web search: 
web search: 
web search: site:github.com/riakymch/exblas/commits/master exblas 2025 ...
web search: 
web search: https://github.com/riakymch/exblas/commits/master/
web search: 
web search: site:github.com/uxlfoundation/oneTBB "stars" releases 2026 ...
web search: 
web search: https://github.com/uxlfoundation/oneTBB
collab: Wait
web search: 
web search: https://github.com/apache/spark
web search: 
web search: Apache Spark 4.1.2 release date 2026 official ...
web search: 
web search: https://github.com/PrefectHQ/prefect
web search: 
web search: https://github.com/hibiken/asynq
web search: 
web search: 'uniqueKey'
codex
Five new repositories survived the exclusion check. The stronger conclusion is that “sort before reduce” is insufficient: correctness needs separate contracts for value reproducibility, ordering, task identity, lock ownership, and reduction topology.

- Spark’s [`DETERMINATE` / `UNORDERED` / `INDETERMINATE`](https://spark.apache.org/docs/latest/api/java/org/apache/spark/rdd/DeterministicLevel.html) classification transfers cleanly. Most live LLM calls are `INDETERMINATE` on re-execution, even when previously captured outputs can be reduced deterministically. Store both an ordered digest and a multiset digest; make reducers declare which upstream class they accept.

- Dask separates [completion-order observation](https://distributed.dask.org/en/stable/api.html) from input-order gathering. It also assumes functions are [pure by default](https://distributed.dask.org/en/stable/client.html), reusing stable computation keys, while deterministic tokenization is [not fail-closed by default](https://docs.dask.org/en/latest/configuration.html). System-deep-loop therefore needs distinct `work_key`, `sample_id`, `attempt_id`, and preallocated `branch_id`; otherwise independent same-prompt rollouts may collapse into one cached result.

- Dedup is a linearizable claim protocol, not a lookup. Prefect’s default [`READ_COMMITTED` cache isolation](https://docs.prefect.io/v3/concepts/caching) explicitly permits concurrent same-key executions. Asynq demonstrates the missing ownership rule: its completion script [deletes a uniqueness lock only when the stored task ID still owns it](https://github.com/hibiken/asynq/blob/master/internal/rdb/rdb.go). Add a fencing generation too, preventing an expired worker from releasing or committing over a newer claim.

- CALM separates coordination-free, [monotonic computation](https://arxiv.org/abs/1901.01930) from decisions requiring a barrier. Appending immutable branch results is monotonic; declaring “all finished,” retracting duplicates, selecting top-k, or stopping for convergence is not. Those operations need an explicit epoch manifest and close event. Reproducible early stopping should run only at fixed decision watermarks, never after whichever response happens to finish next.

- Reducer topology is semantic state. oneTBB’s [`parallel_deterministic_reduce`](https://uxlfoundation.github.io/oneTBB/main/specification/source/algorithms/functions/parallel_deterministic_reduce_func.html) fixes split/join order independently of worker count, yet warns that its answer can differ from a sequential reduction. Canonical branch sorting therefore still needs a versioned reduction tree; convergence scores should preferably be quantized integers or otherwise reproducibly accumulated.

```json
{
  "new_repos": [
    {
      "name": "apache/spark",
      "url": "https://github.com/apache/spark",
      "stars": "~43.6k",
      "what": "Large-scale data engine with explicit DETERMINATE, UNORDERED, and INDETERMINATE replay classes; Spark 4.1.2 released May 2026.",
      "lesson": "Attach a determinism class to every fan-out stage and compare ordered versus multiset digests according to that contract.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "dask/distributed",
      "url": "https://github.com/dask/distributed",
      "stars": "~1.7k",
      "what": "Distributed scheduler exposing completion-order iteration, input-order gathering, and content-derived keys; latest GitHub release dated July 2026.",
      "lesson": "Separate arrival order from canonical reduction order, and separate deterministic work identity from stochastic sample identity.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "PrefectHQ/prefect",
      "url": "https://github.com/PrefectHQ/prefect",
      "stars": "~23.4k",
      "what": "Python workflow engine whose cache isolation documents concurrent same-key execution under READ_COMMITTED; release 3.7.8 in July 2026.",
      "lesson": "A matching cache key is not mutual exclusion; novelty reuse needs a serialized claim or atomic compare-and-set.",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "hibiken/asynq",
      "url": "https://github.com/hibiken/asynq",
      "stars": "~13.5k",
      "what": "Redis-backed Go task queue using atomic uniqueness scripts and owner-checked lock deletion; v0.26.0 released February 2026.",
      "lesson": "Store owner and generation with each dedup claim, and release it only through an owner-checked fenced transition.",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "uxlfoundation/oneTBB",
      "url": "https://github.com/uxlfoundation/oneTBB",
      "stars": "~6.7k",
      "what": "C++ parallel runtime with a deterministic reduction primitive that fixes split and join topology; latest GitHub release dated July 2026.",
      "lesson": "Version and replay the reduction tree itself; canonical input ordering alone does not stabilize non-associative aggregation.",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Give every stage a replay class: DETERMINATE for identical ordered output, UNORDERED for an identical multiset, and INDETERMINATE for potentially different values. Persist an ordered hash plus a hash of sorted content-hash/count pairs.",
      "evidence": "Apache Spark DeterministicLevel: https://spark.apache.org/docs/latest/api/java/org/apache/spark/rdd/DeterministicLevel.html",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Allocate branch_id, sample_id, and attempt_id before dispatch; record arrival_seq only as telemetry. Content-address deterministic work, but include sample identity for independent stochastic rollouts and fail closed when inputs cannot be canonically tokenized.",
      "evidence": "Dask client, as_completed, and tokenization docs: https://distributed.dask.org/en/stable/client.html ; https://distributed.dask.org/en/stable/api.html ; https://docs.dask.org/en/latest/generated/dask.tokenize.tokenize.html",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Model novelty exclusion as claim, commit, and release events carrying dedup_key, generation, owner_event_id, and expiry. Compare owner and generation on every release or commit so an expired worker cannot overwrite a renewed claim.",
      "evidence": "Prefect cache isolation and Asynq owner-checked Lua transitions: https://docs.prefect.io/v3/concepts/caching ; https://github.com/hibiken/asynq/blob/master/internal/rdb/rdb.go",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Split fan-in into monotonic collection and coordinated finalization. Results may append concurrently, but semantic dedup retractions, top-k, all-complete, convergence, and stopping execute only after a versioned epoch-close barrier.",
      "evidence": "CALM theorem and Prefect concurrent-cache behavior: https://arxiv.org/abs/1901.01930 ; https://docs.prefect.io/v3/concepts/caching",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Define a canonical reduction tree over sorted branch IDs, quantize evaluator scores before aggregation, and use stable tie-break tuples. Fuzz permutations, worker counts, tree shapes, and duplicate injection around every convergence threshold.",
      "evidence": "oneTBB deterministic reduction specification: https://uxlfoundation.github.io/oneTBB/main/specification/source/algorithms/functions/parallel_deterministic_reduce_func.html",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Stable content keys make repeated fan-out submissions idempotent.",
      "counter": "For stochastic LLM calls, identical inputs may denote intentionally independent samples; pure-function reuse collapses diversity, while noncanonical inputs can generate unstable keys.",
      "evidence": "https://distributed.dask.org/en/stable/client.html ; https://docs.dask.org/en/latest/configuration.html"
    },
    {
      "claim": "A matching cache or novelty key prevents duplicate execution.",
      "counter": "Prefect explicitly permits simultaneous same-key execution under its default cache isolation; exclusion requires serialization or an atomic claim.",
      "evidence": "https://docs.prefect.io/v3/concepts/caching"
    },
    {
      "claim": "A TTL uniqueness lock is safe to release when an old task finishes.",
      "counter": "After expiry and reacquisition, that release can delete the new owner's lock; Asynq avoids this by comparing the stored owner ID before deletion.",
      "evidence": "https://github.com/hibiken/asynq/blob/master/internal/rdb/rdb.go"
    },
    {
      "claim": "The same branch values necessarily produce the same aggregate.",
      "counter": "Parallel split and join topology can change a non-associative result; oneTBB needs a deterministic tree and still documents that its answer may differ from sequential reduction.",
      "evidence": "https://uxlfoundation.github.io/oneTBB/main/specification/source/algorithms/functions/parallel_deterministic_reduce_func.html"
    }
  ],
  "next_angles": [
    "Build a Jepsen-style linearizability model for novelty claim/commit/release histories under TTL expiry, crash, retry, and ABA lock reacquisition.",
    "Differentially replay one branch multiset across completion permutations, worker counts, reduction trees, and numeric encodings; measure top-k and stopping-decision flips.",
    "Fuzz cross-language canonicalization of JSON, Unicode, floating-point edge cases, prompt templates, and stochastic sample identifiers.",
    "Design deterministic streaming early termination using fixed decision epochs, late-result policies, and replayable cancellation boundaries."
  ],
  "notes": "Direct agent frameworks still rarely publish formal concurrency or determinism contracts; the strongest evidence came from adjacent dataflow, workflow, queue, and parallel-runtime systems. True model-call re-execution remains indeterminate unless outputs, provider revision, prompt bytes, tool versions, and sampling identity are captured."
}
```
hook: Stop
hook: Stop Completed
tokens used
254,851
