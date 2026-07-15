<!-- iteration 31 | SOL xhigh | mode: model-benchmark | angle: A1-sota model-benchmark :: 2025-2026 state of the art | 2026-07-15T10:38:32.619Z -->

The mode’s missing layer is not another benchmark suite; it is a calibrated experimental design. A five-dimensional score can still confidently select the wrong model when tasks are unpaired, router-A and live-B change multiple factors simultaneously, or judge error differs by candidate.

### What the 2025–2026 systems add

1. **They quantify uncertainty around comparisons.** Inspect supports repeated epochs, clustered standard errors, bootstrap error, grouped metrics, and re-scoring stored logs without regenerating outputs. Arena-Hard fits bootstrapped Bradley–Terry models and can regress out length and Markdown-style features. HELM’s REEval estimates item difficulty with a Rasch model and adaptively selects questions near the candidate’s current ability. [Inspect metrics](https://inspect.aisi.org.uk/metrics.html), [Arena-Hard scoring](https://github.com/lmarena/arena-hard-auto/blob/main/show_result.py), [REEval](https://crfm.stanford.edu/2025/06/04/reliable-and-efficient-evaluation.html).  
   **Gap:** router-A/live-B currently appears to produce point scores, not an estimand with paired confidence bounds. If model, path, tools, prompt, or environment change together, the result is a stack comparison—not a model comparison.  
   *(maps: model-benchmark, runtime/fan-out-fan-in, runtime/budget-cost, runtime/gauges-observability)*

2. **They condition rankings on the actual prompt distribution.** LMArena’s P2L predicts prompt-specific Bradley–Terry coefficients and exposes an OpenAI-compatible router with `optimal-lp`, `simple-lp`, and strict cost policies. This directly challenges the premise that one aggregate model ranking is operationally sufficient. [P2L repository and router API](https://github.com/lmarena/p2l).  
   **Gap:** five task-agnostic dimensions can hide model reversals between task families.  
   *(maps: model-benchmark, runtime/budget-cost, runtime/continuity-threading)*

3. **They treat judges as noisy instruments.** EvalAssist develops criteria against synthetic edge cases, supports direct and pairwise judgment, and diagnoses positional bias. PRECISE combines a small oracle-labeled set with many judge-labeled samples through prediction-powered inference. New 2026 analysis shows that sharing calibration across candidate models can even reverse the estimated winner when judge quality shifts between models. [EvalAssist](https://github.com/IBM/eval-assist), [PRECISE](https://www.amazon.science/publications/precise-reducing-the-bias-of-llm-evaluations-using-prediction-powered-ranking-estimation), [bias and cross-model calibration instability](https://arxiv.org/abs/2605.06939).  
   **Gap:** a judge score should not enter promotion logic until its error is measured for that task cluster, judge version, and candidate family.  
   *(maps: model-benchmark, runtime/gauges-observability, runtime/state-jsonl-checkpointing)*

4. **They make contamination resistance part of case provenance.** LiveBench rotates objectively scored questions monthly; ForecastBench evaluates unresolved future events and updates nightly; Code2Bench selects post-cutoff commits, generates property tests, and requires full branch coverage; FuncBenchGen creates hidden function-dependency DAGs with controlled depth and distractors. [LiveBench](https://github.com/LiveBench/LiveBench), [ForecastBench](https://github.com/forecastingresearch/forecastbench), [Code2Bench](https://github.com/Code2Bench/Code2Bench), [FuncBenchGen](https://github.com/megagonlabs/FuncBenchGen).  
   **Gap:** “fresh” is only evidence, not proof. The mode needs sealed/exposed/retired lineage and objective validation of every generated variant.  
   *(maps: model-benchmark, runtime/dedup-novelty, runtime/state-jsonl-checkpointing, runtime/continuity-threading)*

### Concrete design

First, define the experimental unit as:

`TrialKey = (case_lineage, task_cluster, candidate_stack, path, seed, perturbation, judge_hash)`

`candidate_stack` must include model revision, system-prompt hash, tool-schema hash, inference parameters, and router policy. Cross model × path where possible. Otherwise report “stack B beats stack A”; do not attribute the difference to the model.

Run A and B on the same task block, randomize execution and display order, mirror pairwise judgments, and cluster-bootstrap by case lineage. Replace a weighted five-score average with constrained non-inferiority:

- Every protected dimension must satisfy `lower95(Δk) ≥ -εk`.
- Safety and correctness checks remain hard vetoes.
- Cost and latency choose among the statistically non-inferior candidates.
- Adaptive sampling begins only after task-family coverage requirements are met; then Rasch/Fisher information or interval width selects the next case.

Second, insert a judge-calibration firewall. Deterministic receipts and property checks score first. The judge sees blinded candidate identities and both A/B orderings. A small oracle slice measures task- and candidate-specific judge error. For a paired difference, prediction-powered correction has the useful shape:

`corrected_delta = mean_all(judge_delta) + mean_oracle(oracle_delta - judge_delta)`

Its interval must include uncertainty from both pools. Version calibration by judge model, prompt, rubric, task cluster, and candidate family; append re-scores rather than overwriting them. If cross-model calibration instability is excessive, the correct result is `ABSTAIN`, not a forced winner.

Third—and this is the uniqueness-sharpening move—turn model-benchmark into a **sealed task-lineage compiler that emits an executable routing policy**. Mine the current workflow’s real task traces, derive validated counterfactuals, retain a sealed holdout, and record lifecycle events such as `case_created`, `case_eligible`, `case_exposed`, `case_retired`, and `replacement_linked`. Train prompt/task-conditioned Bradley–Terry strengths over those private cases, then solve the quality/cost policy per task cluster.

That sharpens the moat:

- Public leaderboards estimate marginal public-prompt performance; they cannot observe private task semantics, local tools, side effects, failure receipts, or current cost constraints.
- Manual comparisons can be task-specific but lack replay, uncertainty, contamination lineage, and calibrated promotion.
- Other deep modes produce, review, align, or improve artifacts. Model-benchmark uniquely performs controlled counterfactuals over the executor stack and converts the evidence into a versioned operating policy: **which model, route, context policy, and budget should handle this exact evolving task family?**

```json
{
  "new_repos": [
    {
      "name": "lmarena/p2l",
      "url": "https://github.com/lmarena/p2l",
      "stars": "~275",
      "what": "2025 Prompt-to-Leaderboard implementation with prompt-conditioned Bradley-Terry strengths and OpenAI-compatible cost-aware routing.",
      "lesson": "Replace one global model rank with task-conditioned strengths, then solve routing under explicit cost constraints using the route server's BT/LP pattern.",
      "maps_to": ["model-benchmark", "runtime/budget-cost", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "aims-foundations/reeval",
      "url": "https://github.com/aims-foundations/reeval",
      "stars": "~8",
      "what": "2025 HELM-integrated Rasch/IRT calibration and computerized adaptive testing implementation.",
      "lesson": "Estimate task difficulty and candidate ability, then spend evaluation budget on maximally informative cases while retaining explicit coverage quotas.",
      "maps_to": ["model-benchmark", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "name": "IBM/eval-assist",
      "url": "https://github.com/IBM/eval-assist",
      "stars": "~102",
      "what": "AAAI 2025 judge-development environment with direct and pairwise modes, synthetic edge cases, positional-bias inspection, and Unitxt export; v1.0.5 released November 2025.",
      "lesson": "Treat rubric and judge construction as a testable artifact: exercise criteria against edge cases, mirror response order, and preserve the resulting judge configuration for bulk replay.",
      "maps_to": ["model-benchmark", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "Code2Bench/Code2Bench",
      "url": "https://github.com/Code2Bench/Code2Bench",
      "stars": "~10",
      "what": "ICLR 2026 dynamic code-benchmark compiler using post-cutoff commits, scope graphs, property-based tests, full branch-coverage filtering, and failure fingerprints.",
      "lesson": "Compile fresh task-local cases only when generated oracles pass strong structural and behavioral validation; emit diagnostic failure classes rather than only Pass@1.",
      "maps_to": ["model-benchmark", "runtime/dedup-novelty", "runtime/gauges-observability", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "megagonlabs/FuncBenchGen",
      "url": "https://github.com/megagonlabs/FuncBenchGen",
      "stars": "~5",
      "what": "ICLR 2026 generator for contamination-free multi-step tool tasks over hidden dependency DAGs with controllable depth, width, and type-compatible distractors.",
      "lesson": "Generate sealed counterfactual tool-use cases from hidden graphs and vary one difficulty factor at a time to localize model versus state-tracking failures.",
      "maps_to": ["model-benchmark", "runtime/fan-out-fan-in", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Router-A versus live-B is a model comparison only if model and execution path are independently crossed; otherwise the valid estimand is the difference between two complete candidate stacks.",
      "evidence": "https://inspect.aisi.org.uk/reference/inspect_ai.html and https://github.com/lmarena/p2l",
      "maps_to": ["model-benchmark", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Adaptive evaluation should select cases by expected information gain after minimum family coverage, using a Rasch-style ability/difficulty estimate rather than spending the same number of trials on obvious wins and ambiguous boundaries.",
      "evidence": "https://crfm.stanford.edu/2025/06/04/reliable-and-efficient-evaluation.html",
      "maps_to": ["model-benchmark", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "insight": "Judge calibration must be candidate-specific: use a small oracle slice to correct paired judge deltas and propagate calibration uncertainty; shared calibration can produce a confident sign reversal.",
      "evidence": "https://arxiv.org/abs/2605.06939 and https://www.amazon.science/publications/precise-reducing-the-bias-of-llm-evaluations-using-prediction-powered-ranking-estimation",
      "maps_to": ["model-benchmark", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Contamination resistance is a case-lineage state machine: temporal source evidence, proposer visibility, oracle visibility, first exposure, disclosure, retirement, and replacement lineage must be recorded separately.",
      "evidence": "https://github.com/LiveBench/LiveBench, https://github.com/forecastingresearch/forecastbench, and https://github.com/Code2Bench/Code2Bench",
      "maps_to": ["model-benchmark", "runtime/state-jsonl-checkpointing", "runtime/dedup-novelty", "runtime/continuity-threading"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add BenchmarkDesign and TrialResult events implementing paired task blocks, randomized path/order, crossed model-path factors, repeated seeds where needed, clustered bootstrap intervals, and dimension-specific non-inferiority promotion gates.",
      "target": "model-benchmark; runtime/fan-out-fan-in; runtime/gauges-observability",
      "rationale": "This separates real treatment effects from task, sampling, and path variance and prevents a weighted point score from promoting an uncertain or confounded winner.",
      "uniqueness": "It makes the mode a causal stack-selection experiment rather than another score-producing leaderboard.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://inspect.aisi.org.uk/metrics.html and https://github.com/lmarena/arena-hard-auto/blob/main/show_result.py"
    },
    {
      "rec": "Insert a versioned judge-calibration firewall: deterministic checks first, blinded mirrored pairwise judgments, style-feature controls, a task- and candidate-specific oracle slice, prediction-powered correction, calibration-aware intervals, and explicit abstention.",
      "target": "model-benchmark; runtime/state-jsonl-checkpointing; runtime/gauges-observability",
      "rationale": "Judge disagreement is measurement error, not ordinary model variance; uncorrected or shared calibration can reverse the selected model.",
      "uniqueness": "",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2605.06939 and https://www.amazon.science/publications/precise-reducing-the-bias-of-llm-evaluations-using-prediction-powered-ranking-estimation"
    },
    {
      "rec": "Build a sealed task-lineage compiler from current workflow traces and validated counterfactuals, then learn prompt/task-conditioned Bradley-Terry strengths and emit a versioned cost-aware routing policy rather than a global winner.",
      "target": "model-benchmark; runtime/dedup-novelty; runtime/budget-cost; runtime/continuity-threading",
      "rationale": "Private current tasks, objective receipts, contamination lineage, and local cost constraints are precisely the evidence public leaderboards and manual comparisons cannot supply.",
      "uniqueness": "This turns model-benchmark into the only deep mode that answers which complete executor policy should handle each exact evolving task family and updates the live router from controlled evidence.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/lmarena/p2l, https://github.com/Code2Bench/Code2Bench, and https://github.com/megagonlabs/FuncBenchGen"
    }
  ],
  "contradictions": [
    {
      "claim": "A single aggregate five-dimensional ranking is sufficient for model selection.",
      "counter": "Prompt-to-Leaderboard finds prompt-dependent Bradley-Terry strengths specifically because marginal rankings conceal prompt-level performance reversals.",
      "evidence": "https://github.com/lmarena/p2l"
    },
    {
      "claim": "One judge calibration can be reused across compared candidate models.",
      "counter": "Cross-model calibration instability can bias the comparison enough to reverse its sign with high apparent confidence.",
      "evidence": "https://arxiv.org/abs/2605.06939"
    },
    {
      "claim": "A recent timestamp alone makes a benchmark contamination-free.",
      "counter": "Temporal filtering lowers risk but does not prove non-exposure; sealed future-resolved questions or private generated cases with explicit exposure lineage provide stronger evidence.",
      "evidence": "https://github.com/forecastingresearch/forecastbench and https://github.com/Code2Bench/Code2Bench"
    }
  ],
  "next_angles": [
    "Simulate a crossed model-by-path-by-seed-by-perturbation design and compare fixed-sample, adaptive Rasch, and sequential confidence-bound allocators on cost, false promotion, family coverage, and causal-blame accuracy.",
    "Specify the sealed canary lifecycle as JSONL events covering creation, proposer visibility, oracle visibility, evaluation, failure disclosure, retirement, replacement lineage, and resume.",
    "Prototype per-dimension prediction-powered judge calibration and measure how oracle-label allocation changes when calibration is shared globally versus stratified by task cluster and candidate family."
  ],
  "notes": "The local model-benchmark implementation was not inspected; gaps are inferred from the supplied router-A/live-B and five-dimensional identity. Existing catalog entries such as Inspect, HELM, LiveBench, and Arena-Hard were used only for deeper mechanism evidence and were not re-listed as new repositories. Repository stars were verified approximately on 2026-07-15. REEval, Code2Bench, and FuncBenchGen are technically relevant but still small/early projects. No public PRECISE code repository was found, so that mechanism is cited to the authoritative paper page."
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
session id: 019f6556-7e9b-7f13-bd34-501336b2667a
--------
user
You are iteration 31/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: model-benchmark
MODE IDENTITY (what it does today): deep-improvement variant: in-workflow task-anchored model benchmarking (router mode-A vs live mode-B), 5-dim scoring, cost-aware selection.
GENERIC ALTERNATIVE it must out-value: public leaderboards (LMArena, HELM) / one-off manual model comparison

THIS ITERATION'S ANGLE (A1-sota): model-benchmark :: 2025-2026 state of the art
DIRECTIVE: Survey the NEWEST (2025-2026) LLM benchmarking/eval harnesses (lm-evaluation-harness, HELM, LiveBench, LMArena/Elo, inspect-ai, contamination-free & dynamic benchmarks, LLM-as-judge frameworks). What do their statistical rigor, contamination resistance, and judge calibration do that our router-A/live-B model-benchmark variant does NOT? Real repos/URLs + adoptable mechanisms.

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

ALWAYS answer BOTH: (1) concrete improvements to make model-benchmark more effective; (2) the UNIQUE-VALUE / moat thesis — what model-benchmark can do that public leaderboards (LMArena, HELM) / one-off manual model comparison and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (124) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform, IBM/prompt-declaration-language, EvoAgentX/EvoAgentX, aiwaves-cn/agents, YaoZ720/SwarmAgenticCode, taowangcheng/SePO, Junjie-Ye/CCTU, CAR-bench/car-bench, claw-eval/claw-eval, agentevals-dev/agentevals, harbor-framework/harbor, sentient-agi/EvoSkill, maitrix-org/PromptAgent, agiresearch/ASB, normster/SystemCheck, microsoftarchive/promptbench, THUDM/AgentBench, stanford-crfm/helm, invariantlabs-ai/invariant, langwatch/scenario, METR/public-tasks, jaineet17/causal-agent-replay, Peiyu-Georgia-Li/ATLAS
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment | agent-improvement
New insights so far: 132; recommendations: 87.
Open threads flagged: Specify the inherited-clause compiler IR: authority locus, immutable status, shadowing relation, behavioral family, generated counterexample class, and semantic-version impact. | Define canary lifecycle and contamination accounting across proposer access, evaluator revisions, failure disclosure, benchmark retirement, and lineage resume. | Prototype the inherited-clause IR and test semantic-version classification on real agent diffs containing immutable, shadowed, and cross-runtime clauses. | Simulate the adaptive allocator against the full executor-by-seed-by-perturbation matrix and measure cost, false promotion, family coverage, and causal-blame accuracy. | Specify the canary state machine across proposer visibility, evaluator revisions, disclosure, retirement, replacement lineage, and session resume. | Create planted clause-level failure trajectories and test whether context and policy interventions recover the true causal locus across multiple executors.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "model-benchmark"): model-benchmark, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
This is read-only research, so no spec-folder write choice is needed. I’m checking the newest primary sources and will focus on mechanisms absent from router-A/live-B: uncertainty-aware ranking, leakage controls, judge calibration, and task-local decision rules.
web search: 
web search: 2025 LLM evaluation benchmark statistical uncertainty confidence intervals contamination dynamic benchmark GitHub ...
web search: 
web search: CODE2BENCH GitHub 2025 dynamic benchmark ...
web search: 
web search: site:github.com CODE2BENCH code2bench 2509 ...
web search: 
web search: https://code2bench.github.io/
web search: 
web search: 
web search: 
web search: 
codex
The gap is becoming clear: the mode has a scoring rubric, but not yet an experimental design. The strongest transfer is to treat router-A/live-B as paired treatments on the same fresh task blocks, then separate task variance, sampling variance, and judge-calibration variance before promoting a model.
web search: 
web search: site:lmarena.ai blog 2025 leaderboard methodology confidence intervals Bradley Terry bootstrap style control ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 2025 semantic preserving mutation dynamic LLM benchmark GitHub contamination code models ...
web search: 
web search: 
web search: 
web search: PRECISE prediction-powered inference LLM judge AAAI 2026 GitHub amazon science ...
web search: 
web search: site:github.com/huggingface/lighteval "bootstrap" "src/lighteval" ...
web search: 
web search: site:github.com/IBM/eval-assist positional bias certainty evaluator backend ...
web search: 
web search: 
web search: 
web search: site:github.com/lmarena/p2l "optimal-lp" ...
codex
The mode’s missing layer is not another benchmark suite; it is a calibrated experimental design. A five-dimensional score can still confidently select the wrong model when tasks are unpaired, router-A and live-B change multiple factors simultaneously, or judge error differs by candidate.

### What the 2025–2026 systems add

1. **They quantify uncertainty around comparisons.** Inspect supports repeated epochs, clustered standard errors, bootstrap error, grouped metrics, and re-scoring stored logs without regenerating outputs. Arena-Hard fits bootstrapped Bradley–Terry models and can regress out length and Markdown-style features. HELM’s REEval estimates item difficulty with a Rasch model and adaptively selects questions near the candidate’s current ability. [Inspect metrics](https://inspect.aisi.org.uk/metrics.html), [Arena-Hard scoring](https://github.com/lmarena/arena-hard-auto/blob/main/show_result.py), [REEval](https://crfm.stanford.edu/2025/06/04/reliable-and-efficient-evaluation.html).  
   **Gap:** router-A/live-B currently appears to produce point scores, not an estimand with paired confidence bounds. If model, path, tools, prompt, or environment change together, the result is a stack comparison—not a model comparison.  
   *(maps: model-benchmark, runtime/fan-out-fan-in, runtime/budget-cost, runtime/gauges-observability)*

2. **They condition rankings on the actual prompt distribution.** LMArena’s P2L predicts prompt-specific Bradley–Terry coefficients and exposes an OpenAI-compatible router with `optimal-lp`, `simple-lp`, and strict cost policies. This directly challenges the premise that one aggregate model ranking is operationally sufficient. [P2L repository and router API](https://github.com/lmarena/p2l).  
   **Gap:** five task-agnostic dimensions can hide model reversals between task families.  
   *(maps: model-benchmark, runtime/budget-cost, runtime/continuity-threading)*

3. **They treat judges as noisy instruments.** EvalAssist develops criteria against synthetic edge cases, supports direct and pairwise judgment, and diagnoses positional bias. PRECISE combines a small oracle-labeled set with many judge-labeled samples through prediction-powered inference. New 2026 analysis shows that sharing calibration across candidate models can even reverse the estimated winner when judge quality shifts between models. [EvalAssist](https://github.com/IBM/eval-assist), [PRECISE](https://www.amazon.science/publications/precise-reducing-the-bias-of-llm-evaluations-using-prediction-powered-ranking-estimation), [bias and cross-model calibration instability](https://arxiv.org/abs/2605.06939).  
   **Gap:** a judge score should not enter promotion logic until its error is measured for that task cluster, judge version, and candidate family.  
   *(maps: model-benchmark, runtime/gauges-observability, runtime/state-jsonl-checkpointing)*

4. **They make contamination resistance part of case provenance.** LiveBench rotates objectively scored questions monthly; ForecastBench evaluates unresolved future events and updates nightly; Code2Bench selects post-cutoff commits, generates property tests, and requires full branch coverage; FuncBenchGen creates hidden function-dependency DAGs with controlled depth and distractors. [LiveBench](https://github.com/LiveBench/LiveBench), [ForecastBench](https://github.com/forecastingresearch/forecastbench), [Code2Bench](https://github.com/Code2Bench/Code2Bench), [FuncBenchGen](https://github.com/megagonlabs/FuncBenchGen).  
   **Gap:** “fresh” is only evidence, not proof. The mode needs sealed/exposed/retired lineage and objective validation of every generated variant.  
   *(maps: model-benchmark, runtime/dedup-novelty, runtime/state-jsonl-checkpointing, runtime/continuity-threading)*

### Concrete design

First, define the experimental unit as:

`TrialKey = (case_lineage, task_cluster, candidate_stack, path, seed, perturbation, judge_hash)`

`candidate_stack` must include model revision, system-prompt hash, tool-schema hash, inference parameters, and router policy. Cross model × path where possible. Otherwise report “stack B beats stack A”; do not attribute the difference to the model.

Run A and B on the same task block, randomize execution and display order, mirror pairwise judgments, and cluster-bootstrap by case lineage. Replace a weighted five-score average with constrained non-inferiority:

- Every protected dimension must satisfy `lower95(Δk) ≥ -εk`.
- Safety and correctness checks remain hard vetoes.
- Cost and latency choose among the statistically non-inferior candidates.
- Adaptive sampling begins only after task-family coverage requirements are met; then Rasch/Fisher information or interval width selects the next case.

Second, insert a judge-calibration firewall. Deterministic receipts and property checks score first. The judge sees blinded candidate identities and both A/B orderings. A small oracle slice measures task- and candidate-specific judge error. For a paired difference, prediction-powered correction has the useful shape:

`corrected_delta = mean_all(judge_delta) + mean_oracle(oracle_delta - judge_delta)`

Its interval must include uncertainty from both pools. Version calibration by judge model, prompt, rubric, task cluster, and candidate family; append re-scores rather than overwriting them. If cross-model calibration instability is excessive, the correct result is `ABSTAIN`, not a forced winner.

Third—and this is the uniqueness-sharpening move—turn model-benchmark into a **sealed task-lineage compiler that emits an executable routing policy**. Mine the current workflow’s real task traces, derive validated counterfactuals, retain a sealed holdout, and record lifecycle events such as `case_created`, `case_eligible`, `case_exposed`, `case_retired`, and `replacement_linked`. Train prompt/task-conditioned Bradley–Terry strengths over those private cases, then solve the quality/cost policy per task cluster.

That sharpens the moat:

- Public leaderboards estimate marginal public-prompt performance; they cannot observe private task semantics, local tools, side effects, failure receipts, or current cost constraints.
- Manual comparisons can be task-specific but lack replay, uncertainty, contamination lineage, and calibrated promotion.
- Other deep modes produce, review, align, or improve artifacts. Model-benchmark uniquely performs controlled counterfactuals over the executor stack and converts the evidence into a versioned operating policy: **which model, route, context policy, and budget should handle this exact evolving task family?**

```json
{
  "new_repos": [
    {
      "name": "lmarena/p2l",
      "url": "https://github.com/lmarena/p2l",
      "stars": "~275",
      "what": "2025 Prompt-to-Leaderboard implementation with prompt-conditioned Bradley-Terry strengths and OpenAI-compatible cost-aware routing.",
      "lesson": "Replace one global model rank with task-conditioned strengths, then solve routing under explicit cost constraints using the route server's BT/LP pattern.",
      "maps_to": ["model-benchmark", "runtime/budget-cost", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "aims-foundations/reeval",
      "url": "https://github.com/aims-foundations/reeval",
      "stars": "~8",
      "what": "2025 HELM-integrated Rasch/IRT calibration and computerized adaptive testing implementation.",
      "lesson": "Estimate task difficulty and candidate ability, then spend evaluation budget on maximally informative cases while retaining explicit coverage quotas.",
      "maps_to": ["model-benchmark", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "name": "IBM/eval-assist",
      "url": "https://github.com/IBM/eval-assist",
      "stars": "~102",
      "what": "AAAI 2025 judge-development environment with direct and pairwise modes, synthetic edge cases, positional-bias inspection, and Unitxt export; v1.0.5 released November 2025.",
      "lesson": "Treat rubric and judge construction as a testable artifact: exercise criteria against edge cases, mirror response order, and preserve the resulting judge configuration for bulk replay.",
      "maps_to": ["model-benchmark", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "Code2Bench/Code2Bench",
      "url": "https://github.com/Code2Bench/Code2Bench",
      "stars": "~10",
      "what": "ICLR 2026 dynamic code-benchmark compiler using post-cutoff commits, scope graphs, property-based tests, full branch-coverage filtering, and failure fingerprints.",
      "lesson": "Compile fresh task-local cases only when generated oracles pass strong structural and behavioral validation; emit diagnostic failure classes rather than only Pass@1.",
      "maps_to": ["model-benchmark", "runtime/dedup-novelty", "runtime/gauges-observability", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "megagonlabs/FuncBenchGen",
      "url": "https://github.com/megagonlabs/FuncBenchGen",
      "stars": "~5",
      "what": "ICLR 2026 generator for contamination-free multi-step tool tasks over hidden dependency DAGs with controllable depth, width, and type-compatible distractors.",
      "lesson": "Generate sealed counterfactual tool-use cases from hidden graphs and vary one difficulty factor at a time to localize model versus state-tracking failures.",
      "maps_to": ["model-benchmark", "runtime/fan-out-fan-in", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Router-A versus live-B is a model comparison only if model and execution path are independently crossed; otherwise the valid estimand is the difference between two complete candidate stacks.",
      "evidence": "https://inspect.aisi.org.uk/reference/inspect_ai.html and https://github.com/lmarena/p2l",
      "maps_to": ["model-benchmark", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Adaptive evaluation should select cases by expected information gain after minimum family coverage, using a Rasch-style ability/difficulty estimate rather than spending the same number of trials on obvious wins and ambiguous boundaries.",
      "evidence": "https://crfm.stanford.edu/2025/06/04/reliable-and-efficient-evaluation.html",
      "maps_to": ["model-benchmark", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "insight": "Judge calibration must be candidate-specific: use a small oracle slice to correct paired judge deltas and propagate calibration uncertainty; shared calibration can produce a confident sign reversal.",
      "evidence": "https://arxiv.org/abs/2605.06939 and https://www.amazon.science/publications/precise-reducing-the-bias-of-llm-evaluations-using-prediction-powered-ranking-estimation",
      "maps_to": ["model-benchmark", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Contamination resistance is a case-lineage state machine: temporal source evidence, proposer visibility, oracle visibility, first exposure, disclosure, retirement, and replacement lineage must be recorded separately.",
      "evidence": "https://github.com/LiveBench/LiveBench, https://github.com/forecastingresearch/forecastbench, and https://github.com/Code2Bench/Code2Bench",
      "maps_to": ["model-benchmark", "runtime/state-jsonl-checkpointing", "runtime/dedup-novelty", "runtime/continuity-threading"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add BenchmarkDesign and TrialResult events implementing paired task blocks, randomized path/order, crossed model-path factors, repeated seeds where needed, clustered bootstrap intervals, and dimension-specific non-inferiority promotion gates.",
      "target": "model-benchmark; runtime/fan-out-fan-in; runtime/gauges-observability",
      "rationale": "This separates real treatment effects from task, sampling, and path variance and prevents a weighted point score from promoting an uncertain or confounded winner.",
      "uniqueness": "It makes the mode a causal stack-selection experiment rather than another score-producing leaderboard.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://inspect.aisi.org.uk/metrics.html and https://github.com/lmarena/arena-hard-auto/blob/main/show_result.py"
    },
    {
      "rec": "Insert a versioned judge-calibration firewall: deterministic checks first, blinded mirrored pairwise judgments, style-feature controls, a task- and candidate-specific oracle slice, prediction-powered correction, calibration-aware intervals, and explicit abstention.",
      "target": "model-benchmark; runtime/state-jsonl-checkpointing; runtime/gauges-observability",
      "rationale": "Judge disagreement is measurement error, not ordinary model variance; uncorrected or shared calibration can reverse the selected model.",
      "uniqueness": "",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2605.06939 and https://www.amazon.science/publications/precise-reducing-the-bias-of-llm-evaluations-using-prediction-powered-ranking-estimation"
    },
    {
      "rec": "Build a sealed task-lineage compiler from current workflow traces and validated counterfactuals, then learn prompt/task-conditioned Bradley-Terry strengths and emit a versioned cost-aware routing policy rather than a global winner.",
      "target": "model-benchmark; runtime/dedup-novelty; runtime/budget-cost; runtime/continuity-threading",
      "rationale": "Private current tasks, objective receipts, contamination lineage, and local cost constraints are precisely the evidence public leaderboards and manual comparisons cannot supply.",
      "uniqueness": "This turns model-benchmark into the only deep mode that answers which complete executor policy should handle each exact evolving task family and updates the live router from controlled evidence.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/lmarena/p2l, https://github.com/Code2Bench/Code2Bench, and https://github.com/megagonlabs/FuncBenchGen"
    }
  ],
  "contradictions": [
    {
      "claim": "A single aggregate five-dimensional ranking is sufficient for model selection.",
      "counter": "Prompt-to-Leaderboard finds prompt-dependent Bradley-Terry strengths specifically because marginal rankings conceal prompt-level performance reversals.",
      "evidence": "https://github.com/lmarena/p2l"
    },
    {
      "claim": "One judge calibration can be reused across compared candidate models.",
      "counter": "Cross-model calibration instability can bias the comparison enough to reverse its sign with high apparent confidence.",
      "evidence": "https://arxiv.org/abs/2605.06939"
    },
    {
      "claim": "A recent timestamp alone makes a benchmark contamination-free.",
      "counter": "Temporal filtering lowers risk but does not prove non-exposure; sealed future-resolved questions or private generated cases with explicit exposure lineage provide stronger evidence.",
      "evidence": "https://github.com/forecastingresearch/forecastbench and https://github.com/Code2Bench/Code2Bench"
    }
  ],
  "next_angles": [
    "Simulate a crossed model-by-path-by-seed-by-perturbation design and compare fixed-sample, adaptive Rasch, and sequential confidence-bound allocators on cost, false promotion, family coverage, and causal-blame accuracy.",
    "Specify the sealed canary lifecycle as JSONL events covering creation, proposer visibility, oracle visibility, evaluation, failure disclosure, retirement, replacement lineage, and resume.",
    "Prototype per-dimension prediction-powered judge calibration and measure how oracle-label allocation changes when calibration is shared globally versus stratified by task cluster and candidate family."
  ],
  "notes": "The local model-benchmark implementation was not inspected; gaps are inferred from the supplied router-A/live-B and five-dimensional identity. Existing catalog entries such as Inspect, HELM, LiveBench, and Arena-Hard were used only for deeper mechanism evidence and were not re-listed as new repositories. Repository stars were verified approximately on 2026-07-15. REEval, Code2Bench, and FuncBenchGen are technically relevant but still small/early projects. No public PRECISE code repository was found, so that mechanism is cited to the authoritative paper page."
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
172,364
