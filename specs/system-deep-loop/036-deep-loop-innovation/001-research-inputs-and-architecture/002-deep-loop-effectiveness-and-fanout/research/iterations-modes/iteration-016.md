<!-- iteration 16 | SOL xhigh | mode: deep-improvement | angle: A1-sota deep-improvement :: 2025-2026 state of the art | 2026-07-15T09:18:49.004Z -->

The frozen evaluator is necessary, but no longer sufficient. The 2025–2026 systems add four capabilities deep-improvement still appears to lack: case-level fitness memory, quality-diverse lineages, evolvable mutation policies, and promotion judges protected from candidate-induced anchoring.

GEPA is the clearest upgrade path. Its adapter returns both scores and “actionable side information” from full traces; a mutant must survive a minibatch before full validation, while candidates that solve different cases remain on a case-wise Pareto frontier and can later be merged. This is richer than five aggregate dimensions: the dimensions should remain guardrails, while the per-case vector drives search and preserves specialists. Its implementation exposes `GEPAAdapter.evaluate()` and `make_reflective_dataset()` under `src/gepa/adapters/`. [GEPA repository](https://github.com/gepa-ai/gepa), [paper](https://arxiv.org/abs/2507.19457)

OpenEvolve supplies the complementary quality-diversity machinery: MAP-Elites cells, isolated islands, controlled migration, separate performance/inspiration selection, cascaded evaluation, and an artifact channel carrying stderr and profiler evidence into the next mutation. The relevant implementation surfaces are `openevolve/database.py`, `evaluator.py`, `evaluation_result.py`, `novelty_judge.py`, and `evolution_trace.py`. This is a community AlphaEvolve implementation; I found no public official DeepMind source repository. [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve), [official AlphaEvolve paper](https://arxiv.org/abs/2506.13131)

The mutation surface has also expanded. ADAS lets a meta-agent write complete agent architectures; Meta-Harness searches the code controlling storage, retrieval, and presentation while giving its proposer filesystem access to every prior candidate, score, and trace. Promptbreeder and STOP go one level higher by mutating the mutation prompt or improver itself, while MIPRO uses program/data-aware proposals and a minibatch-trained surrogate to choose instruction/demonstration combinations. Deep-improvement should therefore evolve proposal policies—but never its promotion authority. [ADAS](https://github.com/ShengranHu/ADAS), [Meta-Harness](https://github.com/stanford-iris-lab/meta-harness), [Promptbreeder](https://arxiv.org/abs/2309.16797), [STOP](https://github.com/microsoft/stop), [MIPRO](https://arxiv.org/abs/2406.11695)

The sharpest new evaluator result is a July 2026 preprint: a reference-free judge that sees the candidate first can optimize for plausibility instead of correctness. In its experiments, having the judge commit its own answer before seeing the candidate reduced false positives from 0.719 to 0.012. This is early evidence, but directly actionable: deep-improvement needs a candidate-blind anchor channel, not merely a frozen rubric. [Reward-hacking study](https://arxiv.org/abs/2607.05904)

Three concrete changes follow:

1. Add a `CandidateMatrixArchive`. Record `candidate_proposed`, `candidate_evaluated`, and `promotion_receipt` events containing parent/operator lineage, per-case and five-dimension vectors, evaluator and split digests, artifacts, cost, and promotion scope. Use minibatch non-regression before full validation; retain candidates by case-wise Pareto coverage plus stable MAP-Elites behavior cells. Cost: larger evaluation matrices and feature-design work.

2. Add a mutation-strategy portfolio: trace-reflective mutation, program/data-aware synthesis, crossover, architecture/workspace mutation, and meta-mutation of proposal policies. Allocate budget by held-out improvement per cost. The proposal policy may evolve; evaluator code, hidden cases, thresholds, and judge prompts remain immutable and inaccessible. This is the uniqueness-sharpening move.

3. Replace global promotion with two-key, profile-scoped promotion. Key one is candidate-blind verifiable evidence; key two is the frozen five-dimension evaluator. Promote globally only after cross-profile transfer. Otherwise retain the candidate as a routed specialist in a harness tree, with the baseline as low-confidence fallback. Adaptive Auto-Harness reports that repeatedly updating one dense harness can peak early and degrade under heterogeneous task streams. [Adaptive Auto-Harness](https://arxiv.org/abs/2606.01770)

The moat becomes precise: deep-research discovers mechanisms, deep-review diagnoses defects, and deep-ai-council adjudicates alternatives; deep-improvement alone can issue an auditable promotion receipt for a versioned agent artifact. Naive self-improvement lets the same model propose, rationalize, and accept its change. Deep-improvement can allow recursive creativity on the mutable side while keeping candidate-blind, held-out promotion authority outside the recursion.

```json
{
  "new_repos": [
    {
      "name": "gepa-ai/gepa",
      "url": "https://github.com/gepa-ai/gepa",
      "stars": "~5.6k",
      "what": "Reflective text evolution with case-wise Pareto selection, trace-derived feedback, merge, and adapters; v0.1.3 released 2026-07-14.",
      "lesson": "Keep rich evaluator artifacts and per-case fitness vectors, using minibatch admission before expensive full validation.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "algorithmicsuperintelligence/openevolve",
      "url": "https://github.com/algorithmicsuperintelligence/openevolve",
      "stars": "~6.7k",
      "what": "Community AlphaEvolve implementation with MAP-Elites, islands, migration, cascaded evaluation, and artifact feedback; v0.3.1 released 2026-07-14.",
      "lesson": "Separate performance elites from inspiration candidates and preserve quality-diverse lineages instead of repeatedly mutating one winner.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "stanford-iris-lab/meta-harness",
      "url": "https://github.com/stanford-iris-lab/meta-harness",
      "stars": "~1.3k",
      "what": "2026 reference implementation for searching complete model harness code from prior source, scores, and traces.",
      "lesson": "Make prompts, skills, memory policy, retrieval, and control code typed mutation surfaces while preserving complete experiment history.",
      "maps_to": [
        "deep-improvement",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "A-EVO-Lab/AdaptiveHarness",
      "url": "https://github.com/A-EVO-Lab/AdaptiveHarness",
      "stars": "~10",
      "what": "June 2026 paper-code mirror for harness-tree construction and per-task solve-time routing; canonical development is an A-Evolve release branch.",
      "lesson": "Promote specialists conditionally by workload profile instead of forcing every accepted improvement into one global harness.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    },
    {
      "name": "ShengranHu/ADAS",
      "url": "https://github.com/ShengranHu/ADAS",
      "stars": "~1.6k",
      "what": "ICLR 2025 Meta Agent Search implementation that iteratively programs complete agent systems from an archive of prior discoveries.",
      "lesson": "Search over agent architecture and reusable building blocks, not only prompt wording, while evaluating generated systems through a fixed task interface.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Treat evaluator traces, error messages, profiler output, and constraint failures as an actionable textual gradient; scalar dimension scores remain promotion constraints but are insufficient mutation guidance.",
      "evidence": "https://github.com/gepa-ai/gepa and https://arxiv.org/abs/2507.19457",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Maintain two selection structures: a case-wise Pareto frontier for complementary competence and a MAP-Elites archive over stable behavioral descriptors; do not use the five score dimensions themselves as permissive trade-off axes.",
      "evidence": "https://github.com/gepa-ai/gepa and https://github.com/algorithmicsuperintelligence/openevolve",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Mutation operators can themselves be candidates: record operator lineage and evolve diagnostic, crossover, and architecture-synthesis policies, but keep evaluator implementation and promotion thresholds outside the mutable genome.",
      "evidence": "https://arxiv.org/abs/2309.16797 and https://github.com/microsoft/stop",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "insight": "A frozen LLM judge can still be gamed if it sees the optimized candidate before forming an independent answer; promotion should include a candidate-blind commitment or verifiable hidden anchor.",
      "evidence": "https://arxiv.org/abs/2607.05904",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "insight": "Under heterogeneous or drifting workloads, improvement should produce a routed tree of profile-specific champions; global replacement is reserved for candidates that transfer across profiles.",
      "evidence": "https://arxiv.org/abs/2606.01770 and https://github.com/A-EVO-Lab/AdaptiveHarness",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement a CandidateMatrixArchive with candidate_proposed, candidate_evaluated, and promotion_receipt JSONL events carrying lineage, mutation-operator ID, per-case and five-dimension vectors, evaluator/split digests, artifacts, cost, and promotion scope; filter by minibatch non-regression before full held-out evaluation.",
      "target": "deep-improvement",
      "rationale": "This converts five-dimensional scoring from a terminal ranking into a searchable evidence surface while preserving complementary candidates and controlling evaluation cost.",
      "uniqueness": "Deep-improvement becomes the only mode that can bind a concrete agent mutation to reproducible evaluation evidence and an auditable promotion receipt.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/gepa-ai/gepa"
    },
    {
      "rec": "Add a budgeted mutation-strategy portfolio covering trace-reflective mutation, program/data-aware proposal, crossover, workspace architecture search, and mutation-policy meta-evolution; allocate trials by held-out improvement per unit cost while cryptographically freezing evaluator assets.",
      "target": "deep-improvement",
      "rationale": "GEPA, MIPRO, ADAS, Promptbreeder, and STOP show that candidate quality depends heavily on the proposal mechanism and that the proposal mechanism can improve recursively.",
      "uniqueness": "This sharpens the moat into controlled recursive improvement: the generator may rewrite how it generates, but it can never rewrite or impersonate promotion authority.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2309.16797"
    },
    {
      "rec": "Use two-key, profile-scoped promotion: a candidate-blind hidden-anchor/verifier channel plus the frozen five-dimension evaluator; globally promote only after cross-profile transfer, otherwise retain the candidate as a routed specialist with baseline fallback.",
      "target": "deep-improvement",
      "rationale": "Frozen reference-free judges remain vulnerable to plausibility optimization, while a single globally updated harness can degrade on heterogeneous task streams.",
      "uniqueness": "Naive self-improvement produces one self-endorsed replacement; deep-improvement produces bounded, reversible, workload-scoped capabilities whose acceptance does not depend on the candidate's own persuasion.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2607.05904"
    }
  ],
  "contradictions": [
    {
      "claim": "A frozen evaluator is sufficient to prevent self-improvement from gaming promotion.",
      "counter": "A July 2026 preprint reports that even frozen reference-free judges optimize for candidate plausibility when shown the candidate first; blind commitment substantially reduced false positives.",
      "evidence": "https://arxiv.org/abs/2607.05904"
    },
    {
      "claim": "The best aggregate candidate should replace the current agent globally.",
      "counter": "Adaptive Auto-Harness reports that one densely updated harness can peak and decline under heterogeneous, shifting streams; tree-based construction and solve-time routing preserve task-specific benefits.",
      "evidence": "https://arxiv.org/abs/2606.01770"
    },
    {
      "claim": "The strongest available model should receive most of the improvement-generation budget.",
      "counter": "Harness Updating Is Not Harness Benefit reports relatively flat harness-update gains across evolver capability tiers and non-monotonic ability of solver models to benefit from those updates.",
      "evidence": "https://arxiv.org/abs/2605.30621"
    }
  ],
  "next_angles": [
    "Design the exact CandidateMatrixArchive schema and compare case-wise Pareto, MAP-Elites, and scalar ranking on synthetic candidate populations with specialists, generalists, regressions, and deceptive high-score candidates.",
    "Build a candidate-blind promotion benchmark measuring whether commit-before-view, hidden executable anchors, cross-family judges, and judge ensembles predict downstream correctness under iterative optimization.",
    "Specify the mutable-genome boundary for deep-improvement: prompts, skills, demonstrations, memory policy, tool descriptions, workflow graph, control code, and mutation policy, with evaluator reachability tests proving each protected asset is inaccessible.",
    "Evaluate profile-scoped promotion and harness-tree routing against one global champion under stable, heterogeneous, and drifting packet workloads."
  ],
  "notes": "Official public AlphaEvolve source code was not found; OpenEvolve is a community implementation, while the authoritative AlphaEvolve evidence is the DeepMind paper and product documentation. The July 2026 reward-hacking and June 2026 adaptive-harness results are recent preprints, so their mechanisms are strong test candidates rather than settled results. GEPA and OpenEvolve repository stars and releases were verified from GitHub on 2026-07-15."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f650f-0210-7860-b6a1-0ed83bfe0964
--------
user
You are iteration 16/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-improvement
MODE IDENTITY (what it does today): Evaluator-first bounded agent improvement: 5-dimension scoring, dynamic profiling, packet-local candidates, guarded promotion.
GENERIC ALTERNATIVE it must out-value: naive 'ask the model to improve its own prompt/agent' with no frozen evaluator

THIS ITERATION'S ANGLE (A1-sota): deep-improvement :: 2025-2026 state of the art
DIRECTIVE: Survey the NEWEST (2025-2026) self-improvement / evaluator-first / evolutionary-agent systems (AlphaEvolve, ADAS, Promptbreeder, DSPy/MIPROv2, GEPA, STOP self-taught-optimizer, self-rewarding LMs). What do their candidate generation, evaluation, and promotion gates do that our evaluator-first 5-dim loop does NOT? Real repos/URLs + adoptable mechanisms mapped to deep-improvement.

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

ALWAYS answer BOTH: (1) concrete improvements to make deep-improvement more effective; (2) the UNIQUE-VALUE / moat thesis — what deep-improvement can do that naive 'ask the model to improve its own prompt/agent' with no frozen evaluator and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (58) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph
Modes covered so far this run: deep-research | deep-review | deep-ai-council
New insights so far: 62; recommendations: 42.
Open threads flagged: Fit a Friedkin-Johnsen influence matrix across benchmark batches—not within one three-seat run—to estimate seat stubbornness, dominant-speaker influence, and provider-cluster dependence, then compare it with the cheaper unsupported-flip gauges. | Design a packet-local counterfactual probe benchmark that measures verdict sensitivity separately to seat identity, response order, argument length, claimed expertise, majority count, and trusted-history poisoning. | Build a cost-normalized admission benchmark comparing single-model, self-consistency, and council runs across routine, hidden-profile, late-evidence, factual-uncertainty, and value-conflict strata. | Specify and adversarially test the plural-verdict schema on fixtures containing Condorcet cycles, factual disagreement, constitutional vetoes, Pareto-dominated options, and irreducible value orderings. | Implement the packet-local counterfactual probe matrix and determine which perturbation metrics best predict real downstream plan changes rather than harmless wording variation. | Test factual-seat calibration using domain seed questions while proving that performance weights cannot suppress normative minority positions.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "deep-improvement"): deep-improvement, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
Research only; no files will be changed, so the spec-folder write gate does not apply. I’m treating the named deep-research loop as the governing workflow and will focus on mechanisms added or materially sharpened in 2025–2026, excluding every repository on your prior lists.
codex
SKILL ROUTING: User directed → `system-deep-loop` deep-research iteration. The memory trigger service is unavailable in this session, so there is no prior packet context beyond the supplied exclusions; I’m using those lists as the novelty boundary.
web search: 
web search: 2025 AlphaEvolve official Google DeepMind paper GitHub evolutionary coding agent ...
web search: 
web search: site:github.com/ShengranHu/ADAS Meta Agent Search code archive evaluation files ...
web search: 
web search: https://api.github.com/repos/gepa-ai/gepa
web search: 
web search: github gepa-ai/gepa stars 2026 ...
codex
The strongest gap is emerging: a fixed five-number score is a gate, but not yet an optimizer. GEPA and AlphaEvolve-style systems preserve *which cases* a candidate improves, feed diagnostic traces back into mutation, and retain multiple useful lineages instead of ranking everything by one aggregate. I’m checking the promotion details and 2026 “meta-harness” work before fixing the recommendation.
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'MAP-Elites'
web search: 
web search: 
web search: 
web search: MIPROv2 paper Bayesian optimization bootstrapped demonstrations instruction proposals official arxiv ...
web search: 
web search: site:arxiv.org MIPROv2 Optimizing Instructions Demonstrations Multi-Stage Language Model Programs 2024 ...
web search: 
web search: 'Latest'
web search: 
web search: Adaptive Auto-Harness sustained self-improvement open-ended task streams arxiv 2606.01770 mechanism ...
web search: 
web search: "More Convincing, Not More Correct" GitHub ...
web search: 
web search: https://github.com/A-EVO-Lab/AdaptiveHarness
codex
The frozen evaluator is necessary, but no longer sufficient. The 2025–2026 systems add four capabilities deep-improvement still appears to lack: case-level fitness memory, quality-diverse lineages, evolvable mutation policies, and promotion judges protected from candidate-induced anchoring.

GEPA is the clearest upgrade path. Its adapter returns both scores and “actionable side information” from full traces; a mutant must survive a minibatch before full validation, while candidates that solve different cases remain on a case-wise Pareto frontier and can later be merged. This is richer than five aggregate dimensions: the dimensions should remain guardrails, while the per-case vector drives search and preserves specialists. Its implementation exposes `GEPAAdapter.evaluate()` and `make_reflective_dataset()` under `src/gepa/adapters/`. [GEPA repository](https://github.com/gepa-ai/gepa), [paper](https://arxiv.org/abs/2507.19457)

OpenEvolve supplies the complementary quality-diversity machinery: MAP-Elites cells, isolated islands, controlled migration, separate performance/inspiration selection, cascaded evaluation, and an artifact channel carrying stderr and profiler evidence into the next mutation. The relevant implementation surfaces are `openevolve/database.py`, `evaluator.py`, `evaluation_result.py`, `novelty_judge.py`, and `evolution_trace.py`. This is a community AlphaEvolve implementation; I found no public official DeepMind source repository. [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve), [official AlphaEvolve paper](https://arxiv.org/abs/2506.13131)

The mutation surface has also expanded. ADAS lets a meta-agent write complete agent architectures; Meta-Harness searches the code controlling storage, retrieval, and presentation while giving its proposer filesystem access to every prior candidate, score, and trace. Promptbreeder and STOP go one level higher by mutating the mutation prompt or improver itself, while MIPRO uses program/data-aware proposals and a minibatch-trained surrogate to choose instruction/demonstration combinations. Deep-improvement should therefore evolve proposal policies—but never its promotion authority. [ADAS](https://github.com/ShengranHu/ADAS), [Meta-Harness](https://github.com/stanford-iris-lab/meta-harness), [Promptbreeder](https://arxiv.org/abs/2309.16797), [STOP](https://github.com/microsoft/stop), [MIPRO](https://arxiv.org/abs/2406.11695)

The sharpest new evaluator result is a July 2026 preprint: a reference-free judge that sees the candidate first can optimize for plausibility instead of correctness. In its experiments, having the judge commit its own answer before seeing the candidate reduced false positives from 0.719 to 0.012. This is early evidence, but directly actionable: deep-improvement needs a candidate-blind anchor channel, not merely a frozen rubric. [Reward-hacking study](https://arxiv.org/abs/2607.05904)

Three concrete changes follow:

1. Add a `CandidateMatrixArchive`. Record `candidate_proposed`, `candidate_evaluated`, and `promotion_receipt` events containing parent/operator lineage, per-case and five-dimension vectors, evaluator and split digests, artifacts, cost, and promotion scope. Use minibatch non-regression before full validation; retain candidates by case-wise Pareto coverage plus stable MAP-Elites behavior cells. Cost: larger evaluation matrices and feature-design work.

2. Add a mutation-strategy portfolio: trace-reflective mutation, program/data-aware synthesis, crossover, architecture/workspace mutation, and meta-mutation of proposal policies. Allocate budget by held-out improvement per cost. The proposal policy may evolve; evaluator code, hidden cases, thresholds, and judge prompts remain immutable and inaccessible. This is the uniqueness-sharpening move.

3. Replace global promotion with two-key, profile-scoped promotion. Key one is candidate-blind verifiable evidence; key two is the frozen five-dimension evaluator. Promote globally only after cross-profile transfer. Otherwise retain the candidate as a routed specialist in a harness tree, with the baseline as low-confidence fallback. Adaptive Auto-Harness reports that repeatedly updating one dense harness can peak early and degrade under heterogeneous task streams. [Adaptive Auto-Harness](https://arxiv.org/abs/2606.01770)

The moat becomes precise: deep-research discovers mechanisms, deep-review diagnoses defects, and deep-ai-council adjudicates alternatives; deep-improvement alone can issue an auditable promotion receipt for a versioned agent artifact. Naive self-improvement lets the same model propose, rationalize, and accept its change. Deep-improvement can allow recursive creativity on the mutable side while keeping candidate-blind, held-out promotion authority outside the recursion.

```json
{
  "new_repos": [
    {
      "name": "gepa-ai/gepa",
      "url": "https://github.com/gepa-ai/gepa",
      "stars": "~5.6k",
      "what": "Reflective text evolution with case-wise Pareto selection, trace-derived feedback, merge, and adapters; v0.1.3 released 2026-07-14.",
      "lesson": "Keep rich evaluator artifacts and per-case fitness vectors, using minibatch admission before expensive full validation.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "algorithmicsuperintelligence/openevolve",
      "url": "https://github.com/algorithmicsuperintelligence/openevolve",
      "stars": "~6.7k",
      "what": "Community AlphaEvolve implementation with MAP-Elites, islands, migration, cascaded evaluation, and artifact feedback; v0.3.1 released 2026-07-14.",
      "lesson": "Separate performance elites from inspiration candidates and preserve quality-diverse lineages instead of repeatedly mutating one winner.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "stanford-iris-lab/meta-harness",
      "url": "https://github.com/stanford-iris-lab/meta-harness",
      "stars": "~1.3k",
      "what": "2026 reference implementation for searching complete model harness code from prior source, scores, and traces.",
      "lesson": "Make prompts, skills, memory policy, retrieval, and control code typed mutation surfaces while preserving complete experiment history.",
      "maps_to": [
        "deep-improvement",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "A-EVO-Lab/AdaptiveHarness",
      "url": "https://github.com/A-EVO-Lab/AdaptiveHarness",
      "stars": "~10",
      "what": "June 2026 paper-code mirror for harness-tree construction and per-task solve-time routing; canonical development is an A-Evolve release branch.",
      "lesson": "Promote specialists conditionally by workload profile instead of forcing every accepted improvement into one global harness.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    },
    {
      "name": "ShengranHu/ADAS",
      "url": "https://github.com/ShengranHu/ADAS",
      "stars": "~1.6k",
      "what": "ICLR 2025 Meta Agent Search implementation that iteratively programs complete agent systems from an archive of prior discoveries.",
      "lesson": "Search over agent architecture and reusable building blocks, not only prompt wording, while evaluating generated systems through a fixed task interface.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Treat evaluator traces, error messages, profiler output, and constraint failures as an actionable textual gradient; scalar dimension scores remain promotion constraints but are insufficient mutation guidance.",
      "evidence": "https://github.com/gepa-ai/gepa and https://arxiv.org/abs/2507.19457",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Maintain two selection structures: a case-wise Pareto frontier for complementary competence and a MAP-Elites archive over stable behavioral descriptors; do not use the five score dimensions themselves as permissive trade-off axes.",
      "evidence": "https://github.com/gepa-ai/gepa and https://github.com/algorithmicsuperintelligence/openevolve",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Mutation operators can themselves be candidates: record operator lineage and evolve diagnostic, crossover, and architecture-synthesis policies, but keep evaluator implementation and promotion thresholds outside the mutable genome.",
      "evidence": "https://arxiv.org/abs/2309.16797 and https://github.com/microsoft/stop",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "insight": "A frozen LLM judge can still be gamed if it sees the optimized candidate before forming an independent answer; promotion should include a candidate-blind commitment or verifiable hidden anchor.",
      "evidence": "https://arxiv.org/abs/2607.05904",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "insight": "Under heterogeneous or drifting workloads, improvement should produce a routed tree of profile-specific champions; global replacement is reserved for candidates that transfer across profiles.",
      "evidence": "https://arxiv.org/abs/2606.01770 and https://github.com/A-EVO-Lab/AdaptiveHarness",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement a CandidateMatrixArchive with candidate_proposed, candidate_evaluated, and promotion_receipt JSONL events carrying lineage, mutation-operator ID, per-case and five-dimension vectors, evaluator/split digests, artifacts, cost, and promotion scope; filter by minibatch non-regression before full held-out evaluation.",
      "target": "deep-improvement",
      "rationale": "This converts five-dimensional scoring from a terminal ranking into a searchable evidence surface while preserving complementary candidates and controlling evaluation cost.",
      "uniqueness": "Deep-improvement becomes the only mode that can bind a concrete agent mutation to reproducible evaluation evidence and an auditable promotion receipt.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/gepa-ai/gepa"
    },
    {
      "rec": "Add a budgeted mutation-strategy portfolio covering trace-reflective mutation, program/data-aware proposal, crossover, workspace architecture search, and mutation-policy meta-evolution; allocate trials by held-out improvement per unit cost while cryptographically freezing evaluator assets.",
      "target": "deep-improvement",
      "rationale": "GEPA, MIPRO, ADAS, Promptbreeder, and STOP show that candidate quality depends heavily on the proposal mechanism and that the proposal mechanism can improve recursively.",
      "uniqueness": "This sharpens the moat into controlled recursive improvement: the generator may rewrite how it generates, but it can never rewrite or impersonate promotion authority.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2309.16797"
    },
    {
      "rec": "Use two-key, profile-scoped promotion: a candidate-blind hidden-anchor/verifier channel plus the frozen five-dimension evaluator; globally promote only after cross-profile transfer, otherwise retain the candidate as a routed specialist with baseline fallback.",
      "target": "deep-improvement",
      "rationale": "Frozen reference-free judges remain vulnerable to plausibility optimization, while a single globally updated harness can degrade on heterogeneous task streams.",
      "uniqueness": "Naive self-improvement produces one self-endorsed replacement; deep-improvement produces bounded, reversible, workload-scoped capabilities whose acceptance does not depend on the candidate's own persuasion.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2607.05904"
    }
  ],
  "contradictions": [
    {
      "claim": "A frozen evaluator is sufficient to prevent self-improvement from gaming promotion.",
      "counter": "A July 2026 preprint reports that even frozen reference-free judges optimize for candidate plausibility when shown the candidate first; blind commitment substantially reduced false positives.",
      "evidence": "https://arxiv.org/abs/2607.05904"
    },
    {
      "claim": "The best aggregate candidate should replace the current agent globally.",
      "counter": "Adaptive Auto-Harness reports that one densely updated harness can peak and decline under heterogeneous, shifting streams; tree-based construction and solve-time routing preserve task-specific benefits.",
      "evidence": "https://arxiv.org/abs/2606.01770"
    },
    {
      "claim": "The strongest available model should receive most of the improvement-generation budget.",
      "counter": "Harness Updating Is Not Harness Benefit reports relatively flat harness-update gains across evolver capability tiers and non-monotonic ability of solver models to benefit from those updates.",
      "evidence": "https://arxiv.org/abs/2605.30621"
    }
  ],
  "next_angles": [
    "Design the exact CandidateMatrixArchive schema and compare case-wise Pareto, MAP-Elites, and scalar ranking on synthetic candidate populations with specialists, generalists, regressions, and deceptive high-score candidates.",
    "Build a candidate-blind promotion benchmark measuring whether commit-before-view, hidden executable anchors, cross-family judges, and judge ensembles predict downstream correctness under iterative optimization.",
    "Specify the mutable-genome boundary for deep-improvement: prompts, skills, demonstrations, memory policy, tool descriptions, workflow graph, control code, and mutation policy, with evaluator reachability tests proving each protected asset is inaccessible.",
    "Evaluate profile-scoped promotion and harness-tree routing against one global champion under stable, heterogeneous, and drifting packet workloads."
  ],
  "notes": "Official public AlphaEvolve source code was not found; OpenEvolve is a community implementation, while the authoritative AlphaEvolve evidence is the DeepMind paper and product documentation. The July 2026 reward-hacking and June 2026 adaptive-harness results are recent preprints, so their mechanisms are strong test candidates rather than settled results. GEPA and OpenEvolve repository stars and releases were verified from GitHub on 2026-07-15."
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
157,287
