<!-- iteration 26 | SOL xhigh | mode: agent-improvement | angle: A1-sota agent-improvement :: 2025-2026 state of the art | 2026-07-15T10:11:50.402Z -->

The missing layer is a behavioral compiler. Today’s mode already has benchmarks, stress tests, and guarded promotion; the stronger systems add typed optimization surfaces, trace-local credit assignment, population search, and optimization of the improver itself.

### What the newer systems add

1. **Agents become typed, multi-locus programs.** AutoPDL exposes model, demonstrations, verification steps, and prompting patterns as free variables, searches them with successive halving, and emits an executable PDL program. Its configuration already supports growing validation sets, candidate counts, parallelism, and explicit train/validation/test splits. The repository had about 305 stars and released v0.9.3 in February 2026. [AutoPDL tutorial](https://ibm.github.io/prompt-declaration-language/autopdl/), [repository](https://github.com/IBM/prompt-declaration-language)

   Agent Symbolic Learning goes further: prompts, tools, nodes, and graph edges are symbolic weights. In `src/agents/optimization/node_optimizer.py`, feedback is propagated backward through trajectory nodes as `requirement_for_previous`; `sop_optimizer.py` separately proposes topology operations, validates their legality, and rolls back malformed changes. [repository](https://github.com/aiwaves-cn/agents), [optimizer modules](https://github.com/aiwaves-cn/agents/tree/master/src/agents/optimization)

   **Gap:** benchmark-anchored improvement can still degenerate into rewriting a monolithic agent file. Introduce an `AgentIR` whose mutable loci are individually addressable: role, system prompt, task instructions, tool descriptions/allowlists, routing edges, memory policy, verifier policy, and inference configuration. Immutable safety and authority clauses need explicit masks.  
   **Maps to:** `agent-improvement`, `runtime/dedup-novelty`, `runtime/state-jsonl-checkpointing`.

2. **Evaluation feedback becomes component-local, not merely scalar.** GEPA’s adapter contract accepts `candidate: dict[str, str]`, captures opaque trajectories, and constructs a separate reflective dataset for each selected component. Its current frontier can be instance-, objective-, hybrid-, or Cartesian-based. This is materially stronger than “benchmark failed; rewrite the prompt.” [GEPA adapter contract](https://gepa-ai.github.io/gepa/api/core/GEPAAdapter/), [DSPy GEPA algorithm](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/api/optimizers/GEPA/overview.md)

   The June 2026 environment-grounded optimizer adds a behavior analyzer between rollouts and mutation, attributing episode failures to the descriptor or action-selection prompt before proposing a revision. [RAPOA paper](https://arxiv.org/abs/2606.17838)

   **Adoptable mechanism:** every failure should produce a causal slice:

   ```text
   benchmark case
     -> first divergent trace event
     -> implicated component IDs
     -> evidence and counterfactual
     -> typed patch operations
   ```

   Require matched replay after the patch: same inputs, tool fixtures, model version, seeds, and environment state. A candidate only receives causal credit when the implicated failure disappears without moving a blocker elsewhere.  
   **Maps to:** `agent-improvement`, `runtime/gauges-observability`, `runtime/continuity-threading`.

3. **Search includes structure and keeps complementary lineages.** SwarmAgentic creates roles and coordination topology from the task objective, then performs language-space particle-swarm updates using personal bests, global bests, and failure memory. Its concrete modules are `*/pso.py`, `{domain}/prompt/failure_identify.py`, and `save.jsonl`; the latter holds particles and trace summaries for resume and evaluation. The official repository had about 148 stars. [repository and module map](https://github.com/yaoz720/SwarmAgenticCode)

   EvoAgentX exposes several interchangeable optimizer implementations under `evoagentx/optimizers/`, including AFlow, TextGrad, MIPRO, EvoPrompt, and MAP-Elites. Its TextGrad API distinguishes `instruction`, `system_prompt`, and `all`, supports constraints and rollback, and restores the best development-set graph rather than assuming the last mutation is best. Its AFlow lane separately searches operators and workflow structure. The repository had about 3.1k stars and released v0.1.4 in June 2026. [optimizer modules](https://github.com/EvoAgentX/EvoAgentX/tree/main/evoagentx/optimizers), [TextGrad integration](https://github.com/EvoAgentX/EvoAgentX/blob/main/docs/tutorial/textgrad_optimizer.md), [AFlow integration](https://github.com/EvoAgentX/EvoAgentX/blob/main/docs/tutorial/aflow_optimizer.md)

   **Adoptable mechanism:** maintain two archives:

   - A behavioral Pareto archive keyed by benchmark case and objective: correctness, discipline, safety, consistency, cost, and latency.
   - A lineage archive of typed patches, parent IDs, failure attribution, and evaluation receipts.

   Permit crossover only between non-conflicting components. Do not merge two whole prompts because each scored well on different cases.  
   **Maps to:** `agent-improvement`, `runtime/fan-out-fan-in`, `runtime/dedup-novelty`, `runtime/budget-cost`.

4. **The optimizer agent itself becomes trainable.** SePO treats the prompt improver’s own system prompt as an optimization target. It pre-trains that optimizer across a task mixture, archives children that beat their parents, and then reuses the evolved optimizer for task-specific improvement. This amortizes optimization skill instead of restarting from a fixed handcrafted mutation prompt. The June 2026 repository currently has about two stars and only a README; code release is still pending, so the mechanism is paper-backed but not independently reproducible yet. [paper](https://arxiv.org/abs/2606.04465), [repository status](https://github.com/taowangcheng/SePO)

   **Adoptable mechanism:** create a separate `improver-agent` benchmark lane. Train its diagnosis and mutation policy across historical agent failures, but freeze its version during any target-agent experiment. The evaluator and promotion authority must remain outside this recursive loop.  
   **Maps to:** `agent-improvement`, `runtime/continuity-threading`, `runtime/locks-recovery`.

5. **Prompt and inference policy are optimized together.** Agent-GWO represents prompt templates and decoding hyperparameters as one inheritable configuration. AutoPDL likewise reports that selected strategies vary materially by task and model. A single “best agent prompt” is therefore the wrong output abstraction. [Agent-GWO paper](https://aclanthology.org/2026.findings-acl.821/), [AutoPDL paper](https://proceedings.mlr.press/v293/spiess25a.html)

   Promote an operational envelope: agent definition plus compatible model versions, temperature/reasoning settings, tool versions, expected cost, and known failure regions.  
   **Maps to:** `agent-improvement`, `runtime/gauges-observability`, `runtime/budget-cost`.

### Concrete target architecture

A suitable mode API would be:

```text
compile_agent(
  source,
  agent_ir_schema,
  mutable_components,
  hard_invariants,
  benchmark_pack,
  search_budget
) -> CandidateArchive

evaluate(
  candidate,
  split,
  model_matrix,
  seeds,
  tool_fixtures,
  capture_trace=true
) -> ComponentAttributedEvaluation

promote(candidate_id) ->
  AgentPackage {
    executable_definition,
    causal_diff,
    compatibility_envelope,
    benchmark_receipts,
    lineage,
    rollback_target
  }
```

Candidate evaluation should be staged: syntax and invariant checks, cached trace replay, small development batches with successive halving, stochastic stress trials, then a sealed promotion set. Hard discipline and safety failures remain blockers rather than Pareto objectives that correctness can compensate for.

### Unique-value moat

The sharpened moat is **certified behavioral compilation**: transform a human-readable agent definition into a measured executable policy, with causal attribution for each change and an evidence-backed operating envelope.

Manual prompt tweaking cannot supply lineage, held-out evaluation, component credit assignment, cross-model robustness, or rollback evidence. The other deep modes also stop short: research discovers mechanisms, review finds defects, council aggregates judgments, and alignment checks authority. Only `agent-improvement` should conduct controlled mutations of executable agent behavior and issue a promotion certificate.

The uniqueness-sharpening move is to make that certificate the mode’s exclusive output contract. A “better-looking prompt” is not success; a causally attributable, regression-gated agent package is.

```json
{
  "new_repos": [
    {
      "name": "IBM/prompt-declaration-language",
      "url": "https://github.com/IBM/prompt-declaration-language",
      "stars": "~305",
      "what": "Declarative prompt-program runtime with AutoPDL source-to-source optimization; v0.9.3 released February 2026.",
      "lesson": "Represent models, demonstrations, verification calls, and prompting patterns as typed free variables, then use successive halving and emit an executable optimized artifact.",
      "maps_to": ["agent-improvement", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "name": "EvoAgentX/EvoAgentX",
      "url": "https://github.com/EvoAgentX/EvoAgentX",
      "stars": "~3.1k",
      "what": "Framework integrating TextGrad, AFlow, MIPRO, EvoPrompt, MAP-Elites, workflow evaluation, rollback, and human checkpoints; v0.1.4 released June 2026.",
      "lesson": "Expose multiple optimizer backends behind one agent-workflow IR and distinguish prompt-only optimization from topology and operator search.",
      "maps_to": ["agent-improvement", "runtime/fan-out-fan-in", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "aiwaves-cn/agents",
      "url": "https://github.com/aiwaves-cn/agents",
      "stars": "~5.9k",
      "what": "Agents 2.0 implementation of symbolic learning over prompts, tools, nodes, and SOP topology; journal version appeared in 2025.",
      "lesson": "Back-propagate textual requirements through recorded node trajectories, then optimize node definitions and graph structure through separate validated operations.",
      "maps_to": ["agent-improvement", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "YaoZ720/SwarmAgenticCode",
      "url": "https://github.com/yaoz720/SwarmAgenticCode",
      "stars": "~148",
      "what": "Official EMNLP 2025 implementation of from-scratch multi-agent generation using language-driven particle swarm optimization.",
      "lesson": "Maintain personal-best, global-best, and failure-memory signals while mutating both agent roles and coordination topology; persist particles and traces in JSONL.",
      "maps_to": ["agent-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "taowangcheng/SePO",
      "url": "https://github.com/taowangcheng/SePO",
      "stars": "~2",
      "what": "June 2026 landing repository for self-evolving prompt-agent optimization; code release is still in preparation.",
      "lesson": "Treat the improver agent's own definition as a pre-trainable optimization target, then freeze and reuse it across target-agent improvement runs.",
      "maps_to": ["agent-improvement", "runtime/continuity-threading"],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Replace monolithic prompt mutation with a typed AgentIR covering role, instructions, tools, routing, memory, verifier policy, and inference configuration, with explicit mutable and immutable loci.",
      "evidence": "https://ibm.github.io/prompt-declaration-language/autopdl/ ; https://github.com/aiwaves-cn/agents/tree/master/src/agents/optimization",
      "maps_to": ["agent-improvement", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "insight": "Turn every failing behavior benchmark into component-specific actionable side information by locating the first divergent trace event and propagating requirements backward only to implicated components.",
      "evidence": "https://gepa-ai.github.io/gepa/api/core/GEPAAdapter/ ; https://github.com/aiwaves-cn/agents/blob/master/src/agents/optimization/node_optimizer.py",
      "maps_to": ["agent-improvement", "runtime/gauges-observability", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "insight": "Keep candidate lineages on per-case and per-objective Pareto frontiers, and merge only compatible component-level strengths rather than selecting or splicing whole prompts by aggregate score.",
      "evidence": "https://github.com/gepa-ai/gepa ; https://gepa-ai.github.io/gepa/api/core/optimize/",
      "maps_to": ["agent-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "insight": "Pre-train the improver agent across heterogeneous historical failures, but freeze it during target optimization and keep evaluation and promotion outside the self-referential loop.",
      "evidence": "https://arxiv.org/abs/2606.04465",
      "maps_to": ["agent-improvement", "runtime/locks-recovery", "runtime/continuity-threading"],
      "confidence": "med"
    },
    {
      "insight": "Promote a conditional operational envelope rather than a universal prompt because prompt structure, decoding configuration, model version, and task distribution interact.",
      "evidence": "https://aclanthology.org/2026.findings-acl.821/ ; https://proceedings.mlr.press/v293/spiess25a.html",
      "maps_to": ["agent-improvement", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement a typed AgentIR and causal-slicing evaluator: parse every agent definition into named mutable components, map failed traces to implicated component IDs, and allow only schema-valid typed patch operations.",
      "target": "agent-improvement",
      "rationale": "This converts whole-file prompt rewriting into localized, reviewable, causally testable optimization across prompts, tools, topology, memory, and inference settings.",
      "uniqueness": "Establishes agent-improvement as a behavioral compiler rather than another critique or prompt-editing loop.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/aiwaves-cn/agents/tree/master/src/agents/optimization ; https://gepa-ai.github.io/gepa/guides/adapters/"
    },
    {
      "rec": "Replace single-score candidate selection with blocker-aware Pareto successive halving: cheap invariant and replay checks first, growing development batches second, stochastic stress trials third, and a sealed promotion set last.",
      "target": "agent-improvement/runtime/fan-out-fan-in",
      "rationale": "It preserves complementary behavior strategies, controls rollout cost, and prevents correctness gains from compensating for discipline or safety regressions.",
      "uniqueness": "Produces evidence-backed promotion decisions that manual prompt editing and judgment-only deep modes cannot issue.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://ibm.github.io/prompt-declaration-language/autopdl/ ; https://github.com/gepa-ai/gepa"
    },
    {
      "rec": "Add an independently versioned improver-agent lane trained on historical agent failures, with its own train/dev/sealed benchmarks and a frozen optimizer version recorded in every candidate lineage.",
      "target": "agent-improvement/runtime/continuity-threading",
      "rationale": "The mutation policy can accumulate transferable diagnosis skill without recursively changing during an experiment or contaminating the promotion judge.",
      "uniqueness": "Makes improvement capability itself a benchmarked reusable asset while preserving an external promotion authority.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2606.04465"
    }
  ],
  "contradictions": [
    {
      "claim": "Self-evolving agent systems autonomously produce better agents.",
      "counter": "Most demonstrate improvement on optimizer-visible proxy tasks; SePO has not released code, while SwarmAgentic explicitly warns that generated code may be destructive. Autonomous score improvement is not a safety or deployment guarantee.",
      "evidence": "https://github.com/taowangcheng/SePO ; https://github.com/yaoz720/SwarmAgenticCode#safety-considerations"
    },
    {
      "claim": "The highest aggregate-scoring candidate is the best agent definition.",
      "counter": "GEPA retains candidates that dominate individual cases or objectives, and AutoPDL finds that optimal prompting strategies vary across models and tasks. Promotion should preserve Pareto alternatives or conditional configurations.",
      "evidence": "https://github.com/gepa-ai/gepa ; https://proceedings.mlr.press/v293/spiess25a.html"
    },
    {
      "claim": "Textual gradients provide causal credit assignment.",
      "counter": "They are LLM-generated diagnoses, not causal proof. The proposed mutation still requires matched counterfactual replay, component ablation, and sealed evaluation before promotion.",
      "evidence": "https://github.com/aiwaves-cn/agents/blob/master/src/agents/optimization/node_optimizer.py ; https://github.com/AgentOpt/OpenTrace"
    }
  ],
  "next_angles": [
    "Design the AgentIR schema and typed patch algebra for real AGENTS.md-style definitions, including immutable authority clauses and cross-file inheritance.",
    "Build a benchmark for causal blame assignment: inject known defects into roles, tool descriptions, routing, memory, and inference settings, then measure whether the optimizer edits the correct locus.",
    "Study adaptive benchmark overfitting in long-running agent-definition optimization and design sealed canary rotation, contamination accounting, and evaluator-version invalidation.",
    "Compare conditional agent packages against universal prompts across model upgrades, tool-version changes, stochastic seeds, and degraded-environment episodes."
  ],
  "notes": "Repository stars are GitHub-page snapshots observed on 2026-07-15. SePO's repository contains no implementation yet; Agent-GWO says code will be released, and no authoritative repository was verified. The gaps attributed to the current agent-improvement mode are inferred from the supplied mode identity rather than a local implementation audit."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f653f-13bd-7233-a849-ef1809b1c06f
--------
user
You are iteration 26/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: agent-improvement
MODE IDENTITY (what it does today): deep-improvement variant: benchmark-anchored improvement of AGENT definitions/prompts/loops via behavior benchmarks + discipline stress tests + guarded promotion.
GENERIC ALTERNATIVE it must out-value: manual prompt tweaking / vibes-based agent editing

THIS ITERATION'S ANGLE (A1-sota): agent-improvement :: 2025-2026 state of the art
DIRECTIVE: Survey the NEWEST (2025-2026) automatic AGENT/prompt optimization systems (DSPy, GEPA, TextGrad, ADAS, Agent-Symbolic-Learning, EvoPrompt, trace/opto). What do their agent-definition optimization + behavior evaluation do that our benchmark-anchored agent-improvement variant does NOT? Real repos/URLs + adoptable mechanisms mapped to agent-improvement.

Prior work you build ON (do not merely restate): a 45-iter survey (001) + a 20-iter runtime-deepening run (005 run-1, 59 recs that were mostly about the shared RUNTIME, not the modes). Also the 8 ranked recommendations from 001:
  - R1 Multi-signal, path-covering termination
  - R2 Side-effect-receipt resume contract
  - R3 Effective-independence for deep-ai-council + 5-role evaluator separation
  - R4 Conditional, budget-aware fan-in + logical-branch-ID determinism
  - R5 Cheap-checks-before-judges + regression-gated self-repair
  - R6 Semantic-community novelty + contradiction-as-versioned-event
  - R7 Incremental stream-fold gauges + immutable observability
  - R8 Hierarchical typed budgets, exhaustion-as-state
Your job is MODE-SPECIFIC value that those runtime recs did not cover.

ALWAYS answer BOTH: (1) concrete improvements to make agent-improvement more effective; (2) the UNIQUE-VALUE / moat thesis — what agent-improvement can do that manual prompt tweaking / vibes-based agent editing and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (102) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment
New insights so far: 109; recommendations: 72.
Open threads flagged: Design replayable alignment certificates: determine which artifacts, authority sources, verifier binaries, environment facts, and exception decisions must be retained to reproduce an old PASS. | Benchmark lane-closure proofs based on registries, build manifests, exhaustive globs, and independent discovery adapters under file moves, generated artifacts, and newly introduced artifact classes. | Calibrate candidate-to-blocking promotion using historical false-positive and false-negative corpora per rule, including confidence decay after authority or verifier upgrades. | Design a counterfactual authority-publication simulator: before accepting a rule amendment, predict which certificates, deviation suppressions, and lanes become invalid and estimate human-review load. | Create an adversarial certificate-replay benchmark covering missing evidence blobs, authority equivocation, verifier substitution, mutable subject references, generated-artifact omission, and environment drift. | Develop a cross-authority conflict lattice with explicit precedence, jurisdiction, applicability, and paraconsistent outcomes so contradictory standards do not collapse into arbitrary lane ordering.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "agent-improvement"): agent-improvement, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

Write a concise deep analysis, THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:
```json
{
  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable mechanism for this mode","maps_to":["mode-or-subsystem"],"confidence":"high|med|low"}],
  "insights": [{"insight":"one specific transferable mechanism","evidence":"repo/paper/url","maps_to":["mode-or-subsystem"],"confidence":"high|med|low"}],
  "recommendations": [{"rec":"specific actionable change","target":"mode/subsystem","rationale":"why","uniqueness":"how this sharpens the mode's unique value (or empty)","effort":"S|M|L","impact":"low|med|high","evidence":"url/repo"}],
  "contradictions": [{"claim":"","counter":"","evidence":""}],
  "next_angles": ["a specific divergent angle worth exploring next for this mode"],
  "notes": "coverage gaps you noticed"
}
```
Target 2-5 NEW repos, 2-5 insights, and 1-3 concrete recommendations (at least one uniqueness-sharpening). Novelty and verifiable specifics over volume. If the angle is exhausted, return few/no new_repos but propose sharp next_angles + recommendations (that is the divergent pivot, not a failure).
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
This is read-only research, so no spec-folder mutation is needed. I’m checking current primary sources for mechanisms that go beyond prompt-string search: executable agent graphs, trace-derived textual gradients, Pareto archives, held-out behavior gates, and guarded promotion.
web search: 
web search: 2025 automatic agent optimization prompt agent definition symbolic learning GitHub paper ...
codex
The first pass points to a real gap: current optimizers increasingly treat the agent as a typed, multi-parameter program, not one prompt. I’m narrowing this to systems with inspectable implementations and checking whether their search variables, attribution, and validation protocols transfer cleanly to agent definition files.
web search: 
web search: AutoPDL automatic prompt optimization GitHub ibm 2025 ...
web search: 
web search: "Symbolic learning enables self-evolving agents" GitHub Zhou ...
web search: 
web search: https://github.com/aiwaves-cn/agents
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'TextGradOptimizer'
web search: 
web search: "SePO" "Self-Evolving Prompt Optimization" GitHub ...
web search: 
web search: https://github.com/taowangcheng/SePO
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'class Loss'
web search: 
web search: github SwarmAgentic Yao Zhang repository 2025 code ...
web search: 
web search: 
web search: 
web search: 
codex
A sharper pattern has emerged across the implementations: search breadth is secondary to causal locality. The useful systems expose which role, instruction, tool, edge, or optimizer prompt is mutable, attribute failures to those loci, and only then spend rollout budget. I’m checking the exact optimizer APIs and promotion weaknesses before fixing the recommendations.
web search: 
web search: site:gepa-ai.github.io/gepa custom adapter reflective dataset Pareto frontier official ...
web search: 
web search: https://github.com/EvoAgentX/EvoAgentX/tree/main/evoagentx/optimizers
codex
The missing layer is a behavioral compiler. Today’s mode already has benchmarks, stress tests, and guarded promotion; the stronger systems add typed optimization surfaces, trace-local credit assignment, population search, and optimization of the improver itself.

### What the newer systems add

1. **Agents become typed, multi-locus programs.** AutoPDL exposes model, demonstrations, verification steps, and prompting patterns as free variables, searches them with successive halving, and emits an executable PDL program. Its configuration already supports growing validation sets, candidate counts, parallelism, and explicit train/validation/test splits. The repository had about 305 stars and released v0.9.3 in February 2026. [AutoPDL tutorial](https://ibm.github.io/prompt-declaration-language/autopdl/), [repository](https://github.com/IBM/prompt-declaration-language)

   Agent Symbolic Learning goes further: prompts, tools, nodes, and graph edges are symbolic weights. In `src/agents/optimization/node_optimizer.py`, feedback is propagated backward through trajectory nodes as `requirement_for_previous`; `sop_optimizer.py` separately proposes topology operations, validates their legality, and rolls back malformed changes. [repository](https://github.com/aiwaves-cn/agents), [optimizer modules](https://github.com/aiwaves-cn/agents/tree/master/src/agents/optimization)

   **Gap:** benchmark-anchored improvement can still degenerate into rewriting a monolithic agent file. Introduce an `AgentIR` whose mutable loci are individually addressable: role, system prompt, task instructions, tool descriptions/allowlists, routing edges, memory policy, verifier policy, and inference configuration. Immutable safety and authority clauses need explicit masks.  
   **Maps to:** `agent-improvement`, `runtime/dedup-novelty`, `runtime/state-jsonl-checkpointing`.

2. **Evaluation feedback becomes component-local, not merely scalar.** GEPA’s adapter contract accepts `candidate: dict[str, str]`, captures opaque trajectories, and constructs a separate reflective dataset for each selected component. Its current frontier can be instance-, objective-, hybrid-, or Cartesian-based. This is materially stronger than “benchmark failed; rewrite the prompt.” [GEPA adapter contract](https://gepa-ai.github.io/gepa/api/core/GEPAAdapter/), [DSPy GEPA algorithm](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/api/optimizers/GEPA/overview.md)

   The June 2026 environment-grounded optimizer adds a behavior analyzer between rollouts and mutation, attributing episode failures to the descriptor or action-selection prompt before proposing a revision. [RAPOA paper](https://arxiv.org/abs/2606.17838)

   **Adoptable mechanism:** every failure should produce a causal slice:

   ```text
   benchmark case
     -> first divergent trace event
     -> implicated component IDs
     -> evidence and counterfactual
     -> typed patch operations
   ```

   Require matched replay after the patch: same inputs, tool fixtures, model version, seeds, and environment state. A candidate only receives causal credit when the implicated failure disappears without moving a blocker elsewhere.  
   **Maps to:** `agent-improvement`, `runtime/gauges-observability`, `runtime/continuity-threading`.

3. **Search includes structure and keeps complementary lineages.** SwarmAgentic creates roles and coordination topology from the task objective, then performs language-space particle-swarm updates using personal bests, global bests, and failure memory. Its concrete modules are `*/pso.py`, `{domain}/prompt/failure_identify.py`, and `save.jsonl`; the latter holds particles and trace summaries for resume and evaluation. The official repository had about 148 stars. [repository and module map](https://github.com/yaoz720/SwarmAgenticCode)

   EvoAgentX exposes several interchangeable optimizer implementations under `evoagentx/optimizers/`, including AFlow, TextGrad, MIPRO, EvoPrompt, and MAP-Elites. Its TextGrad API distinguishes `instruction`, `system_prompt`, and `all`, supports constraints and rollback, and restores the best development-set graph rather than assuming the last mutation is best. Its AFlow lane separately searches operators and workflow structure. The repository had about 3.1k stars and released v0.1.4 in June 2026. [optimizer modules](https://github.com/EvoAgentX/EvoAgentX/tree/main/evoagentx/optimizers), [TextGrad integration](https://github.com/EvoAgentX/EvoAgentX/blob/main/docs/tutorial/textgrad_optimizer.md), [AFlow integration](https://github.com/EvoAgentX/EvoAgentX/blob/main/docs/tutorial/aflow_optimizer.md)

   **Adoptable mechanism:** maintain two archives:

   - A behavioral Pareto archive keyed by benchmark case and objective: correctness, discipline, safety, consistency, cost, and latency.
   - A lineage archive of typed patches, parent IDs, failure attribution, and evaluation receipts.

   Permit crossover only between non-conflicting components. Do not merge two whole prompts because each scored well on different cases.  
   **Maps to:** `agent-improvement`, `runtime/fan-out-fan-in`, `runtime/dedup-novelty`, `runtime/budget-cost`.

4. **The optimizer agent itself becomes trainable.** SePO treats the prompt improver’s own system prompt as an optimization target. It pre-trains that optimizer across a task mixture, archives children that beat their parents, and then reuses the evolved optimizer for task-specific improvement. This amortizes optimization skill instead of restarting from a fixed handcrafted mutation prompt. The June 2026 repository currently has about two stars and only a README; code release is still pending, so the mechanism is paper-backed but not independently reproducible yet. [paper](https://arxiv.org/abs/2606.04465), [repository status](https://github.com/taowangcheng/SePO)

   **Adoptable mechanism:** create a separate `improver-agent` benchmark lane. Train its diagnosis and mutation policy across historical agent failures, but freeze its version during any target-agent experiment. The evaluator and promotion authority must remain outside this recursive loop.  
   **Maps to:** `agent-improvement`, `runtime/continuity-threading`, `runtime/locks-recovery`.

5. **Prompt and inference policy are optimized together.** Agent-GWO represents prompt templates and decoding hyperparameters as one inheritable configuration. AutoPDL likewise reports that selected strategies vary materially by task and model. A single “best agent prompt” is therefore the wrong output abstraction. [Agent-GWO paper](https://aclanthology.org/2026.findings-acl.821/), [AutoPDL paper](https://proceedings.mlr.press/v293/spiess25a.html)

   Promote an operational envelope: agent definition plus compatible model versions, temperature/reasoning settings, tool versions, expected cost, and known failure regions.  
   **Maps to:** `agent-improvement`, `runtime/gauges-observability`, `runtime/budget-cost`.

### Concrete target architecture

A suitable mode API would be:

```text
compile_agent(
  source,
  agent_ir_schema,
  mutable_components,
  hard_invariants,
  benchmark_pack,
  search_budget
) -> CandidateArchive

evaluate(
  candidate,
  split,
  model_matrix,
  seeds,
  tool_fixtures,
  capture_trace=true
) -> ComponentAttributedEvaluation

promote(candidate_id) ->
  AgentPackage {
    executable_definition,
    causal_diff,
    compatibility_envelope,
    benchmark_receipts,
    lineage,
    rollback_target
  }
```

Candidate evaluation should be staged: syntax and invariant checks, cached trace replay, small development batches with successive halving, stochastic stress trials, then a sealed promotion set. Hard discipline and safety failures remain blockers rather than Pareto objectives that correctness can compensate for.

### Unique-value moat

The sharpened moat is **certified behavioral compilation**: transform a human-readable agent definition into a measured executable policy, with causal attribution for each change and an evidence-backed operating envelope.

Manual prompt tweaking cannot supply lineage, held-out evaluation, component credit assignment, cross-model robustness, or rollback evidence. The other deep modes also stop short: research discovers mechanisms, review finds defects, council aggregates judgments, and alignment checks authority. Only `agent-improvement` should conduct controlled mutations of executable agent behavior and issue a promotion certificate.

The uniqueness-sharpening move is to make that certificate the mode’s exclusive output contract. A “better-looking prompt” is not success; a causally attributable, regression-gated agent package is.

```json
{
  "new_repos": [
    {
      "name": "IBM/prompt-declaration-language",
      "url": "https://github.com/IBM/prompt-declaration-language",
      "stars": "~305",
      "what": "Declarative prompt-program runtime with AutoPDL source-to-source optimization; v0.9.3 released February 2026.",
      "lesson": "Represent models, demonstrations, verification calls, and prompting patterns as typed free variables, then use successive halving and emit an executable optimized artifact.",
      "maps_to": ["agent-improvement", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "name": "EvoAgentX/EvoAgentX",
      "url": "https://github.com/EvoAgentX/EvoAgentX",
      "stars": "~3.1k",
      "what": "Framework integrating TextGrad, AFlow, MIPRO, EvoPrompt, MAP-Elites, workflow evaluation, rollback, and human checkpoints; v0.1.4 released June 2026.",
      "lesson": "Expose multiple optimizer backends behind one agent-workflow IR and distinguish prompt-only optimization from topology and operator search.",
      "maps_to": ["agent-improvement", "runtime/fan-out-fan-in", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "aiwaves-cn/agents",
      "url": "https://github.com/aiwaves-cn/agents",
      "stars": "~5.9k",
      "what": "Agents 2.0 implementation of symbolic learning over prompts, tools, nodes, and SOP topology; journal version appeared in 2025.",
      "lesson": "Back-propagate textual requirements through recorded node trajectories, then optimize node definitions and graph structure through separate validated operations.",
      "maps_to": ["agent-improvement", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "YaoZ720/SwarmAgenticCode",
      "url": "https://github.com/yaoz720/SwarmAgenticCode",
      "stars": "~148",
      "what": "Official EMNLP 2025 implementation of from-scratch multi-agent generation using language-driven particle swarm optimization.",
      "lesson": "Maintain personal-best, global-best, and failure-memory signals while mutating both agent roles and coordination topology; persist particles and traces in JSONL.",
      "maps_to": ["agent-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "taowangcheng/SePO",
      "url": "https://github.com/taowangcheng/SePO",
      "stars": "~2",
      "what": "June 2026 landing repository for self-evolving prompt-agent optimization; code release is still in preparation.",
      "lesson": "Treat the improver agent's own definition as a pre-trainable optimization target, then freeze and reuse it across target-agent improvement runs.",
      "maps_to": ["agent-improvement", "runtime/continuity-threading"],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Replace monolithic prompt mutation with a typed AgentIR covering role, instructions, tools, routing, memory, verifier policy, and inference configuration, with explicit mutable and immutable loci.",
      "evidence": "https://ibm.github.io/prompt-declaration-language/autopdl/ ; https://github.com/aiwaves-cn/agents/tree/master/src/agents/optimization",
      "maps_to": ["agent-improvement", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "insight": "Turn every failing behavior benchmark into component-specific actionable side information by locating the first divergent trace event and propagating requirements backward only to implicated components.",
      "evidence": "https://gepa-ai.github.io/gepa/api/core/GEPAAdapter/ ; https://github.com/aiwaves-cn/agents/blob/master/src/agents/optimization/node_optimizer.py",
      "maps_to": ["agent-improvement", "runtime/gauges-observability", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "insight": "Keep candidate lineages on per-case and per-objective Pareto frontiers, and merge only compatible component-level strengths rather than selecting or splicing whole prompts by aggregate score.",
      "evidence": "https://github.com/gepa-ai/gepa ; https://gepa-ai.github.io/gepa/api/core/optimize/",
      "maps_to": ["agent-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "insight": "Pre-train the improver agent across heterogeneous historical failures, but freeze it during target optimization and keep evaluation and promotion outside the self-referential loop.",
      "evidence": "https://arxiv.org/abs/2606.04465",
      "maps_to": ["agent-improvement", "runtime/locks-recovery", "runtime/continuity-threading"],
      "confidence": "med"
    },
    {
      "insight": "Promote a conditional operational envelope rather than a universal prompt because prompt structure, decoding configuration, model version, and task distribution interact.",
      "evidence": "https://aclanthology.org/2026.findings-acl.821/ ; https://proceedings.mlr.press/v293/spiess25a.html",
      "maps_to": ["agent-improvement", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement a typed AgentIR and causal-slicing evaluator: parse every agent definition into named mutable components, map failed traces to implicated component IDs, and allow only schema-valid typed patch operations.",
      "target": "agent-improvement",
      "rationale": "This converts whole-file prompt rewriting into localized, reviewable, causally testable optimization across prompts, tools, topology, memory, and inference settings.",
      "uniqueness": "Establishes agent-improvement as a behavioral compiler rather than another critique or prompt-editing loop.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/aiwaves-cn/agents/tree/master/src/agents/optimization ; https://gepa-ai.github.io/gepa/guides/adapters/"
    },
    {
      "rec": "Replace single-score candidate selection with blocker-aware Pareto successive halving: cheap invariant and replay checks first, growing development batches second, stochastic stress trials third, and a sealed promotion set last.",
      "target": "agent-improvement/runtime/fan-out-fan-in",
      "rationale": "It preserves complementary behavior strategies, controls rollout cost, and prevents correctness gains from compensating for discipline or safety regressions.",
      "uniqueness": "Produces evidence-backed promotion decisions that manual prompt editing and judgment-only deep modes cannot issue.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://ibm.github.io/prompt-declaration-language/autopdl/ ; https://github.com/gepa-ai/gepa"
    },
    {
      "rec": "Add an independently versioned improver-agent lane trained on historical agent failures, with its own train/dev/sealed benchmarks and a frozen optimizer version recorded in every candidate lineage.",
      "target": "agent-improvement/runtime/continuity-threading",
      "rationale": "The mutation policy can accumulate transferable diagnosis skill without recursively changing during an experiment or contaminating the promotion judge.",
      "uniqueness": "Makes improvement capability itself a benchmarked reusable asset while preserving an external promotion authority.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2606.04465"
    }
  ],
  "contradictions": [
    {
      "claim": "Self-evolving agent systems autonomously produce better agents.",
      "counter": "Most demonstrate improvement on optimizer-visible proxy tasks; SePO has not released code, while SwarmAgentic explicitly warns that generated code may be destructive. Autonomous score improvement is not a safety or deployment guarantee.",
      "evidence": "https://github.com/taowangcheng/SePO ; https://github.com/yaoz720/SwarmAgenticCode#safety-considerations"
    },
    {
      "claim": "The highest aggregate-scoring candidate is the best agent definition.",
      "counter": "GEPA retains candidates that dominate individual cases or objectives, and AutoPDL finds that optimal prompting strategies vary across models and tasks. Promotion should preserve Pareto alternatives or conditional configurations.",
      "evidence": "https://github.com/gepa-ai/gepa ; https://proceedings.mlr.press/v293/spiess25a.html"
    },
    {
      "claim": "Textual gradients provide causal credit assignment.",
      "counter": "They are LLM-generated diagnoses, not causal proof. The proposed mutation still requires matched counterfactual replay, component ablation, and sealed evaluation before promotion.",
      "evidence": "https://github.com/aiwaves-cn/agents/blob/master/src/agents/optimization/node_optimizer.py ; https://github.com/AgentOpt/OpenTrace"
    }
  ],
  "next_angles": [
    "Design the AgentIR schema and typed patch algebra for real AGENTS.md-style definitions, including immutable authority clauses and cross-file inheritance.",
    "Build a benchmark for causal blame assignment: inject known defects into roles, tool descriptions, routing, memory, and inference settings, then measure whether the optimizer edits the correct locus.",
    "Study adaptive benchmark overfitting in long-running agent-definition optimization and design sealed canary rotation, contamination accounting, and evaluator-version invalidation.",
    "Compare conditional agent packages against universal prompts across model upgrades, tool-version changes, stochastic seeds, and degraded-environment episodes."
  ],
  "notes": "Repository stars are GitHub-page snapshots observed on 2026-07-15. SePO's repository contains no implementation yet; Agent-GWO says code will be released, and no authoritative repository was verified. The gaps attributed to the current agent-improvement mode are inferred from the supplied mode identity rather than a local implementation audit."
}
```
hook: Stop
hook: Stop
hook: Stop
hook: Stop
hook: Stop
hook: Stop
hook: Stop
hook: Stop Completed
hook: Stop Completed
hook: Stop Completed
hook: Stop Completed
hook: Stop Failed
hook: Stop Failed
hook: Stop Completed
tokens used
180,935
