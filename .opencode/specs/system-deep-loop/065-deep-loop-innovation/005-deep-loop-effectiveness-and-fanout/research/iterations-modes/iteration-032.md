<!-- iteration 32 | SOL xhigh | mode: model-benchmark | angle: A2-moat model-benchmark :: unique value / moat | 2026-07-15T10:44:33.394Z -->

The moat is not “a better leaderboard.” It is a private decision laboratory: public leaderboards nominate candidates; `model-benchmark` decides which model, prompt, and routing path minimizes real failure and operating cost on the user’s own work.

Evidence supports that distinction. Across 30 models, public-leaderboard rankings correlated below 0.5 with most unseen target-task rankings, and the leaderboard winner was best on only one target task. A separate task-aware study found semantic metrics reordered models relative to generic lexical scoring. [The Fault in Our LLM Leaderboards](https://openreview.net/forum?id=kVrKQ83PPo), [Task-Aware Evaluation](https://aclanthology.org/2025.chomps-main.1/). Small presentation changes can also move models by up to eight ranking positions, while CreditAudit finds benign protocol variation can change deployment priorities. [When Benchmarks Are Targets](https://arxiv.org/abs/2402.01781), [CreditAudit](https://arxiv.org/abs/2602.02515). These map primarily to `model-benchmark` and `runtime/gauges-observability`.

Three mechanisms sharpen this into a defensible mode:

1. Make private workload regret the primary output. Add a frozen `workload` contract containing `snapshot_id`, task cluster, traffic weight, failure severity, oracle reference, source cutoff, and exposure state. Cross it with `model × executionPath × framework × fixture × seed × protocolPerturbation`. Report public/private Kendall τ, regret from selecting the public-leaderboard winner, router regret against the per-task oracle, and performance by costly failure slice. The five dimensions remain diagnostics and hard gates; task-specific executable or human-grounded outcomes decide selection.

2. Treat hidden cases as expiring sealed canaries. Record creation hash, source timestamp, proposer visibility, oracle visibility, evaluations, disclosure, retirement, and replacement lineage as JSONL events. Materialize private payloads only inside the existing per-cell temporary directory. Generate semantically equivalent protocol siblings and measure mean, dispersion, and worst-slice quality. Time separation reduces contamination, but does not prove its absence—ICLR 2025 shows that even training on the test task, without literal leakage, confounds comparative evaluation. [Training on the Test Task](https://proceedings.iclr.cc/paper_files/paper/2025/hash/ab8c971c2ccd12bac0ab249f75e2c16d-Abstract-Conference.html), [LiveCodeBench](https://github.com/LiveCodeBench/LiveCodeBench).

3. Replace nominal “efficiency” with constrained cost selection. The current dispatcher already normalizes latency, tokens, and cost in [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:295), but [sweep-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:467) discards them, while [sweep-reporter.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:71) defines efficiency as output length. Propagate actual usage, including routing, retries, graders, and cache effects. Select the cheapest candidate whose quality lower bound and p95 latency satisfy deployment gates; report the Pareto frontier and weighted cost per successful task. Reuse the shipped paired bootstrap, then stop allocating samples to candidates whose upper bound is dominated. The very recent RoR paper provides supporting, still-unreviewed evidence for marginal correctness per unit cost. [Resample or Reroute](https://arxiv.org/abs/2607.08665).

One naming conflict needs resolution: this checkout calls model-vs-model “Mode A” and framework bakeoff “Mode B”; router-replay versus live execution belongs to skill-benchmark. Introduce an `executionPath` axis such as `router-replay | router-live | direct-live` instead of overloading those mode labels.

That yields the unique-value claim: no public leaderboard or other deep mode can measure the controlled interaction of proprietary task mix, exact workflow prompt, routing decision, model version, provider behavior, failure value, and billed runtime. One-off comparisons can observe some of it once; `model-benchmark` can preserve paired evidence, sealed provenance, uncertainty, and decision regret across model changes.

```json
{
  "new_repos": [
    {
      "name": "openai/evals",
      "url": "https://github.com/openai/evals",
      "stars": "~18.9k",
      "what": "Custom and private eval framework with registry data, templates, completion-function protocols, and approximately 691 commits; verified July 2026.",
      "lesson": "Make private workflow data a first-class evaluation source while retaining reusable scorer and dispatcher interfaces.",
      "maps_to": [
        "model-benchmark",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "LiveCodeBench/LiveCodeBench",
      "url": "https://github.com/LiveCodeBench/LiveCodeBench",
      "stars": "~907",
      "what": "Continuously versioned coding benchmark with time-window filtering in lcb_runner/evaluation/compute_scores.py and custom-output evaluation; release_v6 covers problems through April 2025.",
      "lesson": "Attach source dates and evaluation windows to private cases, rotate them, and compare rankings on post-release cases to expose contamination-sensitive reversals.",
      "maps_to": [
        "model-benchmark",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "vllm-project/guidellm",
      "url": "https://github.com/vllm-project/guidellm",
      "stars": "~1.4k",
      "what": "Production-workload benchmark supporting file and trace inputs, traffic profiles, token-level and tail-latency metrics; v0.7.1 released July 2, 2026.",
      "lesson": "Replay the real workload shape and carry TTFT, inter-token latency, end-to-end latency, throughput, and SLO violations beside quality.",
      "maps_to": [
        "model-benchmark",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "LLwork8888/CreditAudit",
      "url": "https://github.com/LLwork8888/CreditAudit",
      "stars": "~3",
      "what": "Small 2026 toolkit whose creditaudit_test.py evaluates models under aligned benign system-prompt scenarios and whose draw_a_picture.py reports mean and protocol-induced volatility.",
      "lesson": "Benchmark semantically invariant protocol siblings and treat dispersion or worst-slice loss as deployment risk, not merely noise around a mean.",
      "maps_to": [
        "model-benchmark",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "ulab-uiuc/LLMRouter",
      "url": "https://github.com/ulab-uiuc/LLMRouter",
      "stars": "~2.1k",
      "what": "Actively updated routing library with 16-plus routers, custom_tasks, price metadata, token-bearing routing records, and a July 2026 update.",
      "lesson": "Represent router replay and live execution as comparable policies over the same private task rows, including token use, per-model prices, and route regret.",
      "maps_to": [
        "model-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Public rankings should be treated as candidate-selection priors, because their top model and ordering often fail to transfer to unseen target tasks; report private-task rank correlation and public-top-1 regret explicitly.",
      "evidence": "https://openreview.net/forum?id=kVrKQ83PPo",
      "maps_to": [
        "model-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "The outcome metric is part of the model-selection treatment: compliance checks, numeric equivalence, executable assertions, and task-specific ground truth can reorder models relative to generic lexical or aggregate metrics.",
      "evidence": "https://aclanthology.org/2025.chomps-main.1/",
      "maps_to": [
        "model-benchmark"
      ],
      "confidence": "med"
    },
    {
      "insight": "Protocol robustness must be crossed with model and task rather than averaged away; benign formatting and system-prompt variations can move rankings or overturn deployment priorities.",
      "evidence": "https://arxiv.org/abs/2402.01781 and https://arxiv.org/abs/2602.02515",
      "maps_to": [
        "model-benchmark",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Contamination resistance needs provenance, time separation, secrecy, rotation, and retirement lineage; literal duplicate detection alone cannot detect training on the broader test task.",
      "evidence": "https://proceedings.iclr.cc/paper_files/paper/2025/hash/ab8c971c2ccd12bac0ab249f75e2c16d-Abstract-Conference.html and https://github.com/LiveCodeBench/LiveCodeBench",
      "maps_to": [
        "model-benchmark",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Cost-aware selection should optimize a quality-constrained Pareto frontier using complete realized cost and latency, then allocate further samples by expected decision value rather than applying a fixed weighted score.",
      "evidence": "https://arxiv.org/abs/2607.08665 and https://github.com/vllm-project/guidellm",
      "maps_to": [
        "model-benchmark",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a Private Workload Contract and executionPath axis to sweep-benchmark.cjs: freeze a stratified workload snapshot with task cluster, traffic weight, failure severity, oracle_ref, source cutoff, and exposure state; expand identical task IDs across router-replay, router-live, and direct-live paths; report public/private rank correlation, public-top-1 regret, route regret, and costly-slice failures.",
      "target": "model-benchmark, runtime/state-jsonl-checkpointing, runtime/gauges-observability",
      "rationale": "Paired own-task evidence answers the deployment question that a public aggregate cannot, while retaining public leaderboards as inexpensive shortlist priors.",
      "uniqueness": "UNIQUENESS-SHARPENING: makes proprietary workload regret recovered by in-workflow evaluation the mode's defining output, which public leaderboards and the other deep modes cannot observe.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://openreview.net/forum?id=kVrKQ83PPo and https://github.com/openai/evals"
    },
    {
      "rec": "Implement a sealed-canary JSONL lifecycle with creation hash, source timestamp, proposer and oracle visibility, evaluation count, disclosure, retirement, and replacement lineage; add invariant protocol siblings and select on quality lower bound plus protocol volatility or worst slice.",
      "target": "model-benchmark, runtime/state-jsonl-checkpointing, runtime/dedup-novelty, runtime/continuity-threading",
      "rationale": "It reduces memorization and evaluator leakage while preserving enough lineage to reproduce decisions and replace disclosed cases.",
      "uniqueness": "Private, expiring, task-derived canaries create a defensible evidence asset unavailable to public benchmarks and manual comparisons.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/LiveCodeBench/LiveCodeBench and https://arxiv.org/abs/2602.02515"
    },
    {
      "rec": "Wire dispatch-model.cjs usage fields through dispatchCell and every sweep row, including failures; aggregate inference, routing, retry, grader, and cache-adjusted cost plus p95 latency; choose the cheapest candidate whose paired quality lower bound and latency satisfy profile gates, expose the Pareto set, and stop sampling statistically dominated cells after a configurable minimum.",
      "target": "model-benchmark, runtime/budget-cost, runtime/fan-out-fan-in, runtime/gauges-observability",
      "rationale": "The checkout already has normalized usage fields and paired-bootstrap statistics, but the sweep currently discards usage and substitutes output length for efficiency.",
      "uniqueness": "Turns benchmark quality into an operational deployment decision under the user's actual prices, retries, routing overhead, and SLOs.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/vllm-project/guidellm and https://github.com/ulab-uiuc/LLMRouter"
    }
  ],
  "contradictions": [
    {
      "claim": "A generic public-leaderboard winner is a reliable default model for an unseen workflow.",
      "counter": "Leaderboard-to-target correlations were below 0.5 for most tested tasks, and the leaderboard winner was best on only one target task.",
      "evidence": "https://openreview.net/forum?id=kVrKQ83PPo"
    },
    {
      "claim": "The current model-benchmark lane already performs cost-aware selection.",
      "counter": "dispatch-model.cjs exposes normalized latency, token, and cost fields, but sweep-benchmark.cjs hardcodes token and cost fields to null and sweep-reporter.cjs ranks efficiency by output word count.",
      "evidence": ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:295; sweep-benchmark.cjs:467; lib/sweep-reporter.cjs:71"
    },
    {
      "claim": "Router replay is model-benchmark Mode A and live execution is its Mode B in the current checkout.",
      "counter": "model-benchmark/MODES.md labels model-vs-model as A and framework bakeoff as B; router-replay versus live execution is documented under skill-benchmark, creating a naming collision.",
      "evidence": ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:18; scripts/skill-benchmark/tests/README.md:33"
    }
  ],
  "next_angles": [
    "Measure benchmark-snapshot half-life: detect when production task-cluster drift makes the private suite cease predicting live failures, then price the value of refreshing each stratum.",
    "Test privacy-preserving portability: determine which hashed task signatures, failure taxonomies, and rank statistics can be shared across organizations without exposing private prompts while retaining model-selection value.",
    "Elicit uncertain failure-cost and latency-value curves, then test whether the selected Pareto point remains stable under price, traffic-mix, and business-value perturbations."
  ],
  "notes": "Evidence establishes weak leaderboard transfer, rank reversals under task-aware scoring, and contamination or protocol risks; it does not prove private evaluation universally beats every public leaderboard. Closed-model training cutoffs and provider billing payloads remain partly opaque, so contamination resistance and realized-cost completeness need explicit confidence states. CreditAudit is a very small, recent repository, and the July 2026 resample-or-reroute result is new enough to treat as provisional."
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
session id: 019f655b-6f73-7ea2-897d-02e687f7f776
--------
user
You are iteration 32/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: model-benchmark
MODE IDENTITY (what it does today): deep-improvement variant: in-workflow task-anchored model benchmarking (router mode-A vs live mode-B), 5-dim scoring, cost-aware selection.
GENERIC ALTERNATIVE it must out-value: public leaderboards (LMArena, HELM) / one-off manual model comparison

THIS ITERATION'S ANGLE (A2-moat): model-benchmark :: unique value / moat
DIRECTIVE: What makes an IN-WORKFLOW, own-task-anchored, cost-aware model benchmark (router mode-A vs live mode-B) uniquely valuable versus public leaderboards? Find evidence that task-relevant private evals beat generic leaderboards for model selection. Propose concrete ways to SHARPEN the moat: own-task relevance, contamination resistance, cost-normalized selection.

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
THIS run's new repos so far (129) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform, IBM/prompt-declaration-language, EvoAgentX/EvoAgentX, aiwaves-cn/agents, YaoZ720/SwarmAgenticCode, taowangcheng/SePO, Junjie-Ye/CCTU, CAR-bench/car-bench, claw-eval/claw-eval, agentevals-dev/agentevals, harbor-framework/harbor, sentient-agi/EvoSkill, maitrix-org/PromptAgent, agiresearch/ASB, normster/SystemCheck, microsoftarchive/promptbench, THUDM/AgentBench, stanford-crfm/helm, invariantlabs-ai/invariant, langwatch/scenario, METR/public-tasks, jaineet17/causal-agent-replay, Peiyu-Georgia-Li/ATLAS, lmarena/p2l, aims-foundations/reeval, IBM/eval-assist, Code2Bench/Code2Bench, megagonlabs/FuncBenchGen
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment | agent-improvement | model-benchmark
New insights so far: 136; recommendations: 90.
Open threads flagged: Simulate the adaptive allocator against the full executor-by-seed-by-perturbation matrix and measure cost, false promotion, family coverage, and causal-blame accuracy. | Specify the canary state machine across proposer visibility, evaluator revisions, disclosure, retirement, replacement lineage, and session resume. | Create planted clause-level failure trajectories and test whether context and policy interventions recover the true causal locus across multiple executors. | Simulate a crossed model-by-path-by-seed-by-perturbation design and compare fixed-sample, adaptive Rasch, and sequential confidence-bound allocators on cost, false promotion, family coverage, and causal-blame accuracy. | Specify the sealed canary lifecycle as JSONL events covering creation, proposer visibility, oracle visibility, evaluation, failure disclosure, retirement, replacement lineage, and resume. | Prototype per-dimension prediction-powered judge calibration and measure how oracle-label allocation changes when calibration is shared globally versus stratified by task cluster and candidate family.

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
This is a read-only model-benchmark research iteration, so no spec-folder mutation is needed. I’m following the supplied mode contract directly; the project’s named deep-loop workflow is not exposed as an available skill in this session, so I’ll preserve its output schema and novelty constraints while verifying evidence on the live web.
exec
/bin/zsh -lc 'python3 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "iteration 32 model-benchmark moat: in-workflow own-task private evaluation versus public leaderboards; live web research; no writes" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 3310ms:
2026-07-15 12:39:01.456 xcodebuild[83556:208079854]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 12:39:01.702 xcodebuild[83556:208079853] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-u1gNZoUT' (errno=Operation not permitted)
2026-07-15 12:39:02.235 xcodebuild[83568:208079916]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 12:39:02.381 xcodebuild[83568:208079912] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.8382,
    "uncertainty": 0.12,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.592053,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "system-deep-loop",
      "liveScore": 0.592053,
      "shadowScore": 0.558544,
      "delta": -0.033509,
      "dominantShadowLane": "explicit_author"
    }
  }
]

codex
Skill routing resolved to `system-deep-loop` at 0.838 confidence. I’m loading that workflow contract now; it governs the iteration mechanics and may constrain how the evidence is synthesized.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
name: system-deep-loop
version: 2.0.0.0
description: "Routes research, review, AI Council, improvement, and named-standard alignment modes through registry-selected packets."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]
---

<!-- Keywords: system-deep-loop, deep-loop, deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, alignment, conformance, standard-authority, alignment-lane, conformance-review, read-only-default, context-gathering, reuse-catalog, autoresearch, iterative-research, review-loop, deep-review-wave, release-readiness, severity-findings, P0-P1-P2, ai-council, council-deliberation, multi-seat-planning, agent-improvement, benchmark-harness, model-benchmark, skill-benchmark, convergence-detection, externalized-state, coverage-graph, mode-registry, workflowmode, runtimeloop-type, backendkind -->

# System Deep Loop

One skill, five active workflow families, one nested runtime layer. `system-deep-loop` is the public, advisor-routable home for active deep-loop personas; `runtime/` is the frozen, MCP-free infrastructure layer it consumes (formerly the separate `deep-loop-runtime` skill, merged into this hub 2026-07-08). This hub holds NO per-mode convergence, state, or synthesis logic — each active mode keeps its own contract in its packet, and the hub only routes by `workflowMode` through `mode-registry.json`.

Use `@context` for one-shot retrieval, `/deep:research` for iterative investigation with a bounded context snapshot, `/deep:review` for iterative audit with a bounded review snapshot, `/deep:alignment` for read-only-by-default conformance against a named standard authority, or `/speckit:plan` for implementation planning.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any active deep-loop workflow. Invoke it as `Skill(system-deep-loop)` (optionally with a mode hint such as `research: <request>` or `alignment: <request>`); the hub classifies the request, resolves a `workflowMode`, and loads the matching nested mode packet. Active `/deep:*` commands and native agent types remain as complementary surfaces over the same packets.

| Mode | Use it for | Packet | Command | Agent |
|------|-----------|--------|---------|-------|
| **research** | Outward, web + code iterative investigation → `research/research.md` | `system-deep-loop/deep-research/` | `/deep:research` | `deep-research` |
| **review** | Iterative review loop → P0/P1/P2 findings + verdict | `system-deep-loop/deep-review/` | `/deep:review` | `deep-review` |
| **ai-council** | Multi-seat planning deliberation → `ai-council/**` artifacts | `system-deep-loop/deep-ai-council/` | `/deep:ai-council` | `ai-council` |
| **improvement** (3 lanes) | Evaluator-first improvement: `agent-improvement`, `model-benchmark`, `skill-benchmark` | `system-deep-loop/deep-improvement/` | `/deep:agent-improvement` · `/deep:model-benchmark` · `/deep:skill-benchmark` | `deep-improvement` |
| **alignment** | Read-only-by-default conformance audit against a named standard authority | `system-deep-loop/deep-alignment/` | `/deep:alignment` | `deep-alignment` |

### When NOT to Use
- A single quick read/edit (no loop) — use the relevant code or doc skill directly.
- Backend/runtime support (executor, coverage-graph, scoring, fan-out) — that is `runtime/`, consumed here, not invoked as a user workflow (formerly the separate deep-loop-runtime skill).

---

## 2. SMART ROUTING

Routing is **registry-driven** (invokable-hub, Option E). `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. When invoked as `Skill(system-deep-loop[, "<mode>: <request>"])`, the hub classifies the request to a `workflowMode`, resolves it through the registry, and loads `registry[mode].packet`. The advisor routes any deep-loop query to the single identity `system-deep-loop`; the hub then picks the mode. The `/deep:*` commands and native agent types remain as complementary surfaces — they reach the same packets through static routers/agent definitions — and the hub holds NO per-mode logic.

This hub is an intent/registry router, not a keyed resource-discovery router: it intentionally omits `discover_markdown_resources` because there are no hub-level `references/` or `assets/` directories to route by runtime key. The canonical resource-discovery patterns apply to skills that select `references/<key>/` or `assets/<key>/`; this hub only guards registry-selected packet loads.

### Note on the frontmatter `allowed-tools` grant

The hub's own routing logic is read-only (classify, guard a path, load a packet). The frontmatter `allowed-tools` list is nonetheless broad because, per the two-axis hub canon contract, a hub's tool grant MUST equal the exact union of every registered mode's `toolSurface.allowed` in `mode-registry.json` — not the tool set the hub's own logic uses. This is a hard invariant enforced by `parent-skill-check.cjs` (check 3j: "hub allowed-tools equals the union of mode tool surfaces"); narrowing the frontmatter grant to only what routing-only logic needs would fail that check and break every mode whose `toolSurface` isn't a subset of the narrowed list. Treat the breadth of `allowed-tools` as evidence of the child modes' combined needs, not of mutating logic living in the hub.

### The three-tier discriminator
- **`workflowMode`** — the public active mode key: `research`, `review`, `ai-council`, `alignment`, and the three improvement lanes `agent-improvement`, `model-benchmark`, `skill-benchmark`.
- **`runtimeLoopType`** — the graph-backed convergence key consumed by `runtime/scripts/convergence.cjs` (validated against active `research|review|council`). **Explicit `null` for all three improvement lanes; never inferred from `workflowMode`.** Note `ai-council` maps to `runtimeLoopType: council`, while `alignment` maps to `runtimeLoopType: review`.
- **`backendKind`** — which backend runs the mode: `runtime-loop-type` (research/review/ai-council/alignment) or `improvement-host` (`deep-improvement/scripts/shared/loop-host.cjs --mode`).

### Routing rule
```
classify the request to a workflowMode (dominant deep-loop intent; mode hint like "research: ..." overrides)
guard mode-registry.json inside SKILL_ROOT and read it as data
if classifier confidence is low or no mode dominates:
  → return UNKNOWN_FALLBACK with a disambiguation checklist: choose research, review, ai-council, alignment, or one improvement lane
else:
  → resolve workflowMode from the hint / classified intent (or the /deep:* command / advisor alias)
  → find registry[mode]; if missing, return UNKNOWN_FALLBACK instead of loading a guessed path
  → guard registry[mode].packet/SKILL.md inside SKILL_ROOT and load it only if the packet directory and SKILL.md both exist
       e.g. registry["research"].packet → system-deep-loop/deep-research/SKILL.md
       e.g. registry["alignment"].packet → system-deep-loop/deep-alignment/SKILL.md
       (the 3 improvement modes all share the system-deep-loop/deep-improvement/ packet)
  → if registry[mode].runtimeLoopType !== null: backend = convergence.cjs --loop-type <runtimeLoopType>
     else: backend = improvement loop-host (--mode), per backendKind
```

Router-driven loads MUST use `_guard_in_skill(relative_path)` before `load()`, reject paths that escape this skill or do not end in `.md`, and check `if packet_base.exists()` plus `if packet_skill.exists()` before loading. The fallback must name the unresolved `workflowMode` when known, avoid loading any guessed packet, and ask the operator to provide one of the registered modes or the matching `/deep:*` command.

Intent classification favors the single dominant active deep-loop mode; a mode hint (`research: ...`, `review: ...`, `ai-council: ...`, `alignment: ...`, or an improvement lane) overrides the classifier. The legacy advisor projection maps stay hardcoded and drift-guarded against the registry, and the command files remain static routers with hardcoded asset/mode routing; neither resolves from `mode-registry.json` at runtime, but both stay equal to its projection.

Per-mode behavior is **not flattened**: each active packet keeps its own convergence math, state shape, artifacts, and tool-permission guards (research has WebFetch; review/ai-council are code/inward-only; alignment is a named-standard, read-only-by-default conformance audit; improvement is the only direct mutation family). Exactly one `graph-metadata.json` — this hub's — is preserved, so the advisor discovers exactly one skill identity regardless of which surface (hub `Skill()`, `/deep:*` command, or agent) reaches a mode.

---

## 3. HOW IT WORKS

### Layout
```
system-deep-loop/
  SKILL.md               # this routing hub (no per-mode logic)
  mode-registry.json     # the three-tier discriminator + advisorRouting (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  deep-research/   deep-review/   deep-ai-council/   deep-improvement/   deep-alignment/   # active mode packets
  shared/synthesis/      # workflows-shared synthesis (e.g. emitResourceMap)
```

Each active mode packet keeps its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature_catalog/`, or `manual_testing_playbook/` as applicable, with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The `deep-ai-council` packet folder follows the standard `folder == packetSkillName` convention (`deep-ai-council`); its legacy public surfaces (the `/deep:ai-council` command and the `ai-council` agent) intentionally keep the shorter `ai-council` key, so always resolve the packet path through `mode-registry.json` rather than hardcoding it.

### Backend
All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The runtime never gains an `improvement` loopType — improvement stays host-driven.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json` (read the `packet` key; never hardcode a router mapping or packet path in the hub).
- **ALWAYS** keep advisor projection maps hardcoded and drift-guarded against the registry; command mode routing is still hardcoded in the command files and does not resolve through `mode-registry.json`.
- **ALWAYS** keep each mode's convergence/state/artifact contract in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity, whether a mode is reached via `Skill(system-deep-loop)`, a `/deep:*` command, or an agent.
- **ALWAYS** keep `Skill(system-deep-loop)` hub routing, the `/deep:*` commands, and the agent types as complementary surfaces over the same packets — never let one surface fork per-mode logic out of its packet.

### ⛔ NEVER
- **NEVER** add an `improvement` `loopType` to `runtime/convergence.cjs` (improvement is host-driven; `runtimeLoopType` stays `null`).
- **NEVER** infer `runtimeLoopType` from `workflowMode` — read it from the registry (explicit `null` is load-bearing).
- **NEVER** let a read-only mode (research/review/ai-council/alignment) reach the improvement mutation scripts (`promote-candidate.cjs`/`rollback-candidate.cjs`).
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or `shared/`.

### ⚠️ ESCALATE IF
- A new mode is needed beyond the seven registered — extend `mode-registry.json` and open a packet, do not bolt logic onto the hub.
- A change would require the runtime to gain MCP tools or an improvement loopType — that contradicts the architecture; escalate.

---

## 5. REFERENCES

- Backend: `.opencode/skills/system-deep-loop/runtime/` (frozen, consumed by every mode; nested infrastructure, not a separate skill).
- Mode packets: `deep-research/SKILL.md`, `deep-review/SKILL.md`, `deep-ai-council/SKILL.md`, `deep-improvement/SKILL.md`, `deep-alignment/SKILL.md` (per-mode detail).
- Commands: the active `/deep:*` commands under `.opencode/commands/deep/` (complementary surface).
- Registry: `mode-registry.json` (the routing contract — the authoritative `packet` paths).

---

## 6. SUCCESS CRITERIA

- The hub resolves one primary active `workflowMode` for the request through `mode-registry.json` (improvement folds to the right lane via the registry, never by array order).
- The selected mode packet owns the detailed convergence/state/artifact workflow; the hub stayed routing-only.
- `Skill(system-deep-loop[, hint])` reaches a mode, and the `/deep:*` commands and agent types still reach the same packets.
- Exactly one `graph-metadata.json` exists for the whole skill; no packet carries its own.

---

## 7. INTEGRATION POINTS

### Modes
- `research` — outward web + code iterative investigation (`research/research.md`).
- `review` — iterative review loop, P0/P1/P2 findings + verdict.
- `ai-council` — multi-seat planning deliberation (`ai-council/**` artifacts).
- `improvement` (3 lanes) — evaluator-first agent/model/skill improvement.
- `alignment` — read-only-by-default conformance audit against a named standard authority (`alignment/` artifacts).

### Surfaces and Consumers
- `Skill(system-deep-loop)` is the invokable hub; active `/deep:*` commands and the agent types (`deep-research`, `deep-review`, `ai-council`, `deep-improvement`, `deep-alignment`) are complementary surfaces over the same packets.
- `runtime/` is the frozen, MCP-free backend every mode consumes (nested infrastructure, not a separate skill).
- `/speckit:plan` consumes `@context` packages plus research/review/alignment outputs; spec-folder docs consume research/review/alignment output.

---

## 8. RELATED RESOURCES

- Pattern: `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md` (parent-skill hub + nested packets, the one-graph-metadata invariant).
- Sibling example: `.opencode/skills/sk-design/` (the same invokable-hub + `mode-registry.json` Option E pattern).
- Registry: `mode-registry.json` (this hub's routing contract).

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/mode-registry.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
{
  "skill": "system-deep-loop",
  "version": "2.0.0.0",
  "description": "Declarative mode registry: the single source of truth for the three-tier discriminator (workflowMode/runtimeLoopType/backendKind) PLUS the advisorRouting projection. The advisor keeps its hardcoded projection maps (Python DEEP_ROUTING_MODE_BY_KEY, TypeScript DEEP_MODE_BY_CANONICAL) in sync with this registry via a CI drift-guard test (maps == registry projection); the advisor does NOT read this file at runtime, which avoids cross-skill import coupling on the advisor hot path.",
  "discriminator": {
    "workflowMode": "Public command/advisor/mode key. Stable identity used in commands, advisor aliases, and this registry. Carried by every mode.",
    "runtimeLoopType": "The graph-backed convergence loop key consumed by runtime/scripts/convergence.cjs. Validated against exactly research|review|council. Explicit null for improvement-host modes; NEVER inferred from workflowMode.",
    "backendKind": "Which backend actually runs the mode: runtime-loop-type (runtime/ convergence) or improvement-host (deep-improvement/scripts/shared/loop-host.cjs --mode)."
  },
  "advisorRoutingContract": {
    "routingClass": "How the advisor finds the mode. 'lexical' = weighted-regex scoring in skill_advisor.py AND present in both projection maps. 'alias-fold' = TS DEEP_MODE_BY_CANONICAL only (alias projection, not lexically scored). 'metadata' = resolved by skill membership; no advisor map entry. 'command-bridge' = routed by its /deep:* command, not an advisor map entry.",
    "legacyAdvisorId": "The legacy deep-* skill id the projection maps key on (present for lexical + alias-fold modes only).",
    "advisorDefaultMode": "Marks the default mode a multi-mode legacy id folds to (deep-improvement -> agent-improvement). Never inferred from array order.",
    "legacyAliases": "The TypeScript scorer alias set (aliases.ts SKILL_ALIAS_GROUPS[legacyAdvisorId]) the merged-identity layer keys on; the drift-guard asserts these match it order-insensitive. The Python deep-router uses its own alias set + regex patterns by design (same keys, different values), so the guard only cross-checks that each legacyAdvisorId key also exists in the Python SKILL_ALIAS_GROUPS.",
    "packetSkillName": "The packet's SKILL.md name. Most packets use folder == packetSkillName == deep-<mode> (e.g. deep-ai-council). Exception: the three improvement lanes (agent/skill/model) multiplex onto one shared packet 'deep-improvement', so several workflowModes map to that single folder/packetSkillName. The legacy public key 'ai-council' is preserved only on the command/agent surfaces, not on the packet folder/name.",
    "driftGuard": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
  },
  "extensions": {
    "runtime-loop": {
      "description": "Declares the runtime-loop backend: modes with backendKind 'runtime-loop-type' converge over runtime/, keyed by runtimeLoopType (research|review|council). runtimeLoopType is explicit null for improvement-host modes and is never inferred from workflowMode.",
      "runtimeLoopTypes": ["research", "review", "council"]
    },
    "advisor-projection": {
      "description": "Declares that the advisor keeps hardcoded projection maps (Python DEEP_ROUTING_MODE_BY_KEY, TypeScript DEEP_MODE_BY_CANONICAL) in sync with this registry's advisorRouting projection. The advisor does not read this file at runtime; a CI drift-guard asserts maps == registry projection.",
      "driftGuard": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
    }
  },
  "deprecatedModes": [],
  "modes": [
    {
      "workflowMode": "research",
      "runtimeLoopType": "research",
      "backendKind": "runtime-loop-type",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Task", "WebFetch"],
        "forbidden": [],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-research",
      "command": "/deep:research",
      "agent": "deep-research",
      "artifactRoot": "research/",
      "aliases": ["deep-research", "research loop", "iterative investigation workflow", "research convergence detection", "autoresearch", "iterative-research"],
      "advisorRouting": {
        "routingClass": "lexical",
        "legacyAdvisorId": "deep-research",
        "legacyAliases": ["command-spec-kit-deep-research", "/deep:research", "spec_kit:deep-research", "deep-research", "sk-deep-research"],
        "packetSkillName": "deep-research"
      }
    },
    {
      "workflowMode": "review",
      "runtimeLoopType": "review",
      "backendKind": "runtime-loop-type",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Task"],
        "forbidden": [],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-review",
      "command": "/deep:review",
      "agent": "deep-review",
      "artifactRoot": "review/",
      "aliases": ["deep-review", "review loop", "iterative review loop", "severity weighted findings", "convergence review", "release-readiness", "deep-review wave"],
      "advisorRouting": {
        "routingClass": "lexical",
        "legacyAdvisorId": "deep-review",
        "legacyAliases": ["command-spec-kit-deep-review", "/deep:review", "spec_kit:deep-review", "deep-review", "sk-deep-review"],
        "packetSkillName": "deep-review"
      }
    },
    {
      "workflowMode": "ai-council",
      "runtimeLoopType": "council",
      "backendKind": "runtime-loop-type",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Task"],
        "forbidden": [],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-ai-council",
      "command": "/deep:ai-council",
      "agent": "ai-council",
      "artifactRoot": "ai-council/",
      "aliases": ["deep-ai-council", "ai council deliberation", "multi-seat planning council", "council convergence", "planning council"],
      "advisorRouting": {
        "routingClass": "lexical",
        "legacyAdvisorId": "deep-ai-council",
        "legacyAliases": ["@deep-ai-council", "deep-ai-council", "deep ai council", "ai council", "planning council", "council deliberation", "multi-ai-council"],
        "packetSkillName": "deep-ai-council"
      }
    },
    {
      "workflowMode": "agent-improvement",
      "runtimeLoopType": null,
      "backendKind": "improvement-host",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Task"],
        "forbidden": [],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-improvement",
      "loopHostMode": "agent-improvement",
      "command": "/deep:agent-improvement",
      "agent": "deep-improvement",
      "artifactRoot": "improvement/",
      "aliases": ["improve agent", "evaluate agent", "agent scoring", "score agent candidate", "promote or rollback agent change", "agent-improvement"],
      "advisorRouting": {
        "routingClass": "alias-fold",
        "legacyAdvisorId": "deep-improvement",
        "advisorDefaultMode": true,
        "legacyAliases": ["command-spec-kit-deep-agent-improvement", "/deep:agent-improvement", "deep-agent-improvement", "sk-deep-agent-improvement"],
        "packetSkillName": "deep-improvement"
      }
    },
    {
      "workflowMode": "model-benchmark",
      "runtimeLoopType": null,
      "backendKind": "improvement-host",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Task"],
        "forbidden": [],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-improvement",
      "loopHostMode": "model-benchmark",
      "command": "/deep:model-benchmark",
      "agent": "deep-improvement",
      "artifactRoot": "improvement/",
      "aliases": ["model benchmark", "benchmark a model", "prompt framework benchmark", "benchmark-harness"],
      "advisorRouting": {
        "routingClass": "command-bridge",
        "packetSkillName": "deep-improvement"
      }
    },
    {
      "workflowMode": "skill-benchmark",
      "runtimeLoopType": null,
      "backendKind": "improvement-host",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Task"],
        "forbidden": [],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-improvement",
      "loopHostMode": "skill-benchmark",
      "command": "/deep:skill-benchmark",
      "agent": "deep-improvement",
      "artifactRoot": "improvement/",
      "aliases": ["skill benchmark", "benchmark a skill", "skill routing benchmark"],
      "advisorRouting": {
        "routingClass": "command-bridge",
        "packetSkillName": "deep-improvement"
      }
    },
    {
      "workflowMode": "alignment",
      "runtimeLoopType": "review",
      "backendKind": "runtime-loop-type",
      "packetKind": "workflow",
      "grandfatheredFolderMismatch": false,
      "toolSurface": {
        "allowed": ["Read", "Grep", "Glob", "Task", "Bash"],
        "forbidden": ["Write", "Edit"],
        "mutatesWorkspace": true,
        "bashAllowlist": []
      },
      "packet": "deep-alignment",
      "command": "/deep:alignment",
      "agent": "deep-alignment",
      "artifactRoot": "alignment/",
      "aliases": ["deep-alignment", "alignment lane", "conformance review", "standard authority check", "alignment conformance audit"],
      "advisorRouting": {
        "routingClass": "lexical",
        "legacyAdvisorId": "deep-alignment",
        "legacyAliases": ["command-spec-kit-deep-alignment", "/deep:alignment", "spec_kit:deep-alignment", "deep-alignment", "sk-deep-alignment"],
        "packetSkillName": "deep-alignment"
      }
    }
  ]
}

exec
/bin/zsh -lc "sed -n '1,280p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
name: deep-improvement
description: "Evaluator-first bounded agent improvement: 5-dim scoring, dynamic profiling, packet-local candidates, guarded promotion."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.17.0.1
triggers:
  - deep-improvement
  - agent improvement loop
  - bounded agent improvement
  - 5-dimension scoring
  - integration scanner
  - dynamic profiling
  - model-benchmark mode
  - benchmark a model or prompt framework
  - skill-benchmark mode
---

<!-- Keywords: deep-improvement, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

## 1. WHEN TO USE

### Three Co-Equal Lanes

This skill supports three co-equal use-case lanes that share the same candidate, dispatcher, and scorer seams:

| Lane | Pick when | Command |
| --- | --- | --- |
| **Lane A: Agent-Improvement** | You want to improve a bounded agent `.md` file | `/deep:agent-improvement` |
| **Lane B: Model-Benchmark** | You want to benchmark a model or prompt framework | `/deep:model-benchmark` |
| **Lane C: Skill-Benchmark** | You want to diagnose a skill's real-world routing, discovery, efficiency, and usefulness | `/deep:skill-benchmark` |

Lane A is detailed in §3 (Runtime Initialization, Proposal and Evaluation, Promotion and Recovery). Lane B is detailed in §4. Lane C (skill-benchmark) is documented in `references/skill_benchmark/` (operator guide, scoring contract, scenario authoring) and run via `loop-host.cjs --mode=skill-benchmark`. All lanes run the same loop shape and keep the agent-improvement path byte-identical when no mode flag is set.

### Activation Triggers

Use this skill when:
- You want to test whether an agent prompt or instruction surface can be improved (Lane A)
- You want to benchmark a model or prompt framework against repeatable fixtures (Lane B)
- You want to diagnose whether a skill is well-routed, discoverable, efficient, and useful in practice (Lane C)
- The mutation boundary is explicit and narrow
- You need packet-local evidence instead of ad hoc prompt tweaking
- You need target-specific benchmark or scoring rules before any canonical mutation
- Promotion must stay gated behind independent evidence plus operator approval

### Primary Use Cases

- **Lane A** — proposal-first loop for any bounded agent file: packet-local candidates, dynamic 5-dimension scoring, append-only evidence, guarded promotion/rollback with drift review kept separate. See §3.
- **Lane B** — benchmarks a model or prompt framework (not an agent file) against a benchmark profile, scoring produced outputs; shares the candidate, dispatcher, and scorer seams with Lane A. See §4.
- **Lane C** — diagnoses whether a *skill* is well-routed, discoverable, efficient, and useful in practice; emits a ranked Skill Benchmark Report and is diagnostic by default (no target mutation). See `references/skill_benchmark/operator_guide.md`.

### When NOT to Use

Do not use this skill for:
- Open-ended prompt rewrites across multiple agent families at once
- Direct canonical edits without a packet-local candidate and evaluator evidence
- Broad runtime-mirror synchronization work presented as benchmark truth
- General packet planning that belongs in `/speckit:plan` or implementation that does not need an improvement loop

---

## 2. SMART ROUTING


### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring so only the guidance that matches the current task is loaded.

- `references/` for operator workflows, evaluator policy, promotion or rollback rules, target onboarding, and quick-reference guidance
- `assets/` for reusable runtime templates such as the charter and strategy markdown files
- `scripts/` for deterministic benchmark, scoring, reduction, promotion, rollback, and drift-check helpers

**Lane awareness**: resources are organized by lane. `references/agent_improvement/` + `assets/agent_improvement/` carry Lane A guidance, `references/model_benchmark/` + `assets/model_benchmark/` carry Lane B guidance, and `references/skill_benchmark/` + `assets/skill_benchmark/` carry Lane C guidance. `RESOURCE_MAP` routes the `MODEL_BENCHMARK` and `SKILL_BENCHMARK` intents to their lane references, and `RUNTIME_ASSETS` loads each lane's profile only when its intent is selected. The `ALWAYS` and shared `references/shared/` resources apply to all three lanes.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/shared/quick_reference.md` |
| CONDITIONAL | If intent signals match | Workflow, policy, or onboarding references |
| ON_DEMAND | Only on explicit request or full setup | Markdown runtime templates in `assets/` |

### Smart Router Pseudocode

The authoritative routing logic for scoped markdown loading and explicit runtime-asset loading.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - quick-reference, loop, evaluation, promotion, target onboarding, integration, and setup intents route resources.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK_CHECKLIST` asks for target/action/gate disambiguation and missing intent routes return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/shared/quick_reference.md"

INTENT_SIGNALS = {
    "QUICK_REFERENCE": {"weight": 3, "keywords": ["quick reference", "short reminder", "command example"]},
    "LOOP_EXECUTION": {"weight": 4, "keywords": ["run loop", "proposal", "candidate", "score candidate", "benchmark"]},
    "EVALUATION_POLICY": {"weight": 4, "keywords": ["evaluator", "rubric", "contract", "repeatability", "no-go"]},
    "PROMOTION_OPERATIONS": {"weight": 4, "keywords": ["promote", "rollback", "mirror drift", "approval gate"]},
    "TARGET_ONBOARDING": {"weight": 4, "keywords": ["new target", "target profile", "onboarding", "second target"]},
    "INTEGRATION_SCAN": {"weight": 4, "keywords": ["integration", "scan surfaces", "mirror sync", "dynamic profile", "5-dimension"]},
    "MODEL_BENCHMARK": {"weight": 5, "keywords": ["benchmark a model", "benchmark a prompt framework", "optimize a model", "model-benchmark", "model benchmark"]},
    "SKILL_BENCHMARK": {"weight": 5, "keywords": ["benchmark a skill", "skill benchmark", "skill routing", "unprompted discovery", "routing accuracy", "skill-benchmark"]},
    "FULL_SETUP": {"weight": 3, "keywords": ["full setup", "initialize runtime", "charter", "strategy"]},
}

RESOURCE_MAP = {
    "QUICK_REFERENCE": ["references/shared/quick_reference.md"],
    "LOOP_EXECUTION": ["references/shared/loop_protocol.md", "references/model_benchmark/benchmark_operator_guide.md", "references/shared/runtime_truth_contracts.md", "references/agent_improvement/candidate_proposal_format.md"],
    "EVALUATION_POLICY": ["references/model_benchmark/evaluator_contract.md", "references/shared/promotion_rules.md", "references/shared/heldout_and_gold_sets.md", "references/agent_improvement/score_dimensions.md", "assets/agent_improvement/improvement_config_reference.md"],
    "PROMOTION_OPERATIONS": ["references/shared/rollback_runbook.md", "references/agent_improvement/mirror_drift_policy.md", "references/shared/promotion_rules.md", "references/agent_improvement/stress_test_protocol.md", "references/shared/promotion_gate_contract.md"],
    "TARGET_ONBOARDING": ["references/agent_improvement/target_onboarding.md"],
    "INTEGRATION_SCAN": ["references/agent_improvement/integration_scanning.md", "references/model_benchmark/evaluator_contract.md", "references/agent_improvement/profiling_audit_log.md"],
    "MODEL_BENCHMARK": ["references/model_benchmark/benchmark_operator_guide.md", "references/model_benchmark/evaluator_contract.md", "references/model_benchmark/lane_b_mechanics.md", "references/model_benchmark/mixed_executor_methodology.md", "assets/model_benchmark/benchmark-fixtures/reviewer_schema.md"],
    "SKILL_BENCHMARK": ["references/skill_benchmark/operator_guide.md", "references/skill_benchmark/scoring_contract.md", "references/skill_benchmark/scenario_authoring.md", "references/skill_benchmark/routing_optimization.md", "assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md"],
    "FULL_SETUP": ["assets/agent_improvement/improvement_charter.md", "assets/agent_improvement/improvement_strategy.md"],
}

RUNTIME_ASSETS = {
    "ALWAYS": ["assets/agent_improvement/improvement_config.json", "assets/agent_improvement/target_manifest.jsonc"],
    "MODEL_BENCHMARK": ["assets/model_benchmark/benchmark-profiles/default.json"],
    "SKILL_BENCHMARK": ["assets/skill_benchmark/default_profile.json"],
}

ON_DEMAND_KEYWORDS = ["target profile", "score candidate", "proposal loop", "benchmark", "promotion gate", "mirror drift"]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

UNKNOWN_FALLBACK_CHECKLIST = ["Confirm target path", "Confirm proposal vs scoring vs promotion", "Confirm packet-local evidence path"]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routed here: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUICK_REFERENCE"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_recursive_agent_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task))
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    runtime_assets = list(RUNTIME_ASSETS["ALWAYS"])
    if "MODEL_BENCHMARK" in intents:
        runtime_assets.extend(RUNTIME_ASSETS.get("MODEL_BENCHMARK", []))
    if "SKILL_BENCHMARK" in intents:
        runtime_assets.extend(RUNTIME_ASSETS.get("SKILL_BENCHMARK", []))

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)
    return {"intents": intents, "resources": loaded, "runtime_assets": runtime_assets}
```

---

## 3. LANE A: AGENT-IMPROVEMENT

Lane A improves a bounded agent `.md` file. Command: `/deep:agent-improvement`. It runs the proposal-first loop in three modes (initialization, proposal and evaluation, promotion and recovery) and scores candidates with dynamic-mode 5-dimension scoring across structural integrity (0.20), rule coherence (0.25), integration consistency (0.25), output quality (0.15), and system fitness (0.15) — profiles are generated on the fly per target via `scripts/agent-improvement/generate-profile.cjs`; no static profiles ship.

1. **Init**: confirm spec folder/target/mode/profile, create `{spec_folder}/improvement/` plus `candidates/`, `benchmark-runs/`, `archive/`, copy in runtime templates, record baseline in the append-only ledger.
2. **Propose + evaluate**: read charter/boundary/profile/target, run `scan-integration.cjs`, write exactly one bounded candidate under `candidates/`, score it with `score-candidate.cjs` (dynamic 5-dimension, the sole supported path), benchmark it with `run-benchmark.cjs`, append results to the ledger, refresh state with `reduce-state.cjs`.
3. **Promote + recover**: promote only when scoring, benchmark status, repeatability, boundary, and approval gates all pass, via `promote-candidate.cjs`; roll back with `rollback-candidate.cjs` plus direct comparison evidence; treat mirror drift as separate downstream work via `check-mirror-drift.cjs`.

For changes that alter agent discipline, run a same-task A/B stress scenario (isolated sandbox baseline vs. the disciplined path, judged only on grep/file/diff/exit-code signals) before recommending promotion — reading `SKILL.md` is not evidence the protocol executed. See `references/agent_improvement/stress_test_protocol.md` for the full procedure, `references/shared/loop_protocol.md` for the complete step-by-step INIT/PROPOSE/SCORE/PROMOTE lifecycle, and `references/agent_improvement/score_dimensions.md` for the full per-dimension scoring rubric.

---

## 4. LANE B: MODEL-BENCHMARK

Lane B benchmarks a model or prompt framework instead of mutating an agent file. Command: `/deep:model-benchmark`. Runtime entry is `scripts/shared/loop-host.cjs --mode=model-benchmark`. It reuses the three pluggable seams (candidate-source, dispatcher, scorer) and keeps the default agent-improvement path byte-identical when no mode flag is set.

- **Entry + dispatch**: `loop-host.cjs` resolves `--mode=agent-improvement` (default) vs `--mode=model-benchmark`; the model-agnostic dispatcher `scripts/model-benchmark/dispatch-model.cjs` loads only on the model-benchmark path.
- **Scoring**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher; `--scorer 5dim` routes through the ported 120/003 five-dimension scorer with a pluggable `--grader noop|mock|llm` (default `noop`, deterministic).
- **Promotion**: state records and reports carry `mode`/`scoringMethod` for lane attribution. Lane A promotes through the agent-scored gates in `promote-candidate.cjs`; Lane B promotes from the benchmark report via `promote-candidate.cjs --benchmark-report <report.json>` when status is `benchmark-complete` with a passing recommendation — both lanes still share one canonical-target guard, archive, and runtime-mirror sync.
- **Hardening**: `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in both the 5-dim scorer and the bundle-gate Layer-3 acceptance command; `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the cache. Both default permissive (trusted-author boundary: criteria come only from operator-authored benchmark profiles in the same trust domain as the loop) — flip both for hardened/shared-runner deployments.

Full dispatcher, scorer, promotion-path, and hardening-rationale detail: `references/model_benchmark/lane_b_mechanics.md`.

---

## 5. SUCCESS CRITERIA

- The loop stays proposal-first unless an explicit guarded promotion path is requested
- Benchmark evidence, prompt scoring, and mirror-sync evidence remain separate
- Reducer outputs make the best-known state, rejected runs, infrastructure failures, and stop conditions easy to review
- Operators can onboard a bounded target without weakening boundary or evaluator guardrails

---

## 6. HOW IT WORKS (Multi-Iteration Methodology)
For multi-iter evaluation sweeps, a mixed-executor split plus an adjudication pass gives better breadth, better synthesis, and less noise than a single-executor run.

- **Mixed-executor 8+2 split**: run breadth iterations on a breadth executor (e.g. cli-opencode or cli-opencode with a fast model) and synthesis iterations on a synthesis executor (e.g. cli-opencode gpt-5.5). For a 10-iter sweep, that is iters 1-8 breadth and iters 9-10 synthesis.
- **Adjudication iter**: insert a false-positive filter pass before the synthesis iterations (typically the iter-7 mark) so only confirmed findings carry forward. In validation this delivers a 90%+ false-positive reduction, with one pass dropping 9 false-positive and 4 outdated items to take a 20-item queue down to 7.

See `references/model_benchmark/mixed_executor_methodology.md` for the split mechanics, adjudication details, and the full validation evidence.

---

## 7. RUNTIME TRUTH CONTRACTS

Every improvement session termination MUST produce both a `stopReason` (why) and a `sessionOutcome` (what happened), drawn from a small frozen enum validated by `scripts/shared/improvement-journal.cjs`:

- **stopReason**: `converged` (all 5 legal-stop gate bundles pass + trajectory stable), `maxIterationsReached`, `blockedStop` (a gate bundle failed), `manualStop`, `error`, `stuckRecovery`
- **sessionOutcome**: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`

Journal emission is orchestrator-only (ADR-001) — the target agent never writes journal rows. The append-only `improvement-journal.jsonl` records lifecycle events (`session_start`, `candidate_scored`, `gate_evaluation`, `legal_stop_evaluated`, `promotion_result`, `session_end`, etc.) via `scripts/shared/improvement-journal.cjs --emit <eventType> --journal <path> --details '<json>'`. A session may NOT claim `converged` unless all five gate bundles pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`.

**Resume caveat (current release):** sessions support only `new` lineage today. Every `/deep:agent-improvement` invocation starts a fresh session id and generation 1 — `resume`/`restart`/`fork`/`completed-continue` have no shipped runtime wiring despite appearing in earlier drafts. To continue evaluating an agent, archive the prior session folder and re-invoke the command; the reducer never carries ancestry across sessions.

Static benchmark assets (profile, fixtures, materializer, runner) ship with the skill under `assets/model_benchmark/` and `scripts/shared/materialize-benchmark-fixtures.cjs` / `scripts/model-benchmark/run-benchmark.cjs`. Output location depends on the caller: the static `default.json` regression check embedded in every `/deep:agent-improvement` iteration (Lane A) writes spec-locally to `{spec_folder}/improvement/benchmark-outputs/`, while the standalone `/deep:model-benchmark` command (Lane B) writes to the sk-prompt/prompt-models hub (`.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`), keyed by the operator-supplied `run_label`. `scripts/shared/mutation-coverage.cjs` tracks explored/exhausted mutation types with a signature-based dedup (`DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` bypasses it); `scripts/agent-improvement/trade-off-detector.cjs` blocks promotion on Pareto-dominated candidates; `scripts/agent-improvement/candidate-lineage.cjs` (disabled by default) and `scripts/agent-improvement/benchmark-stability.cjs` (advisory-only weight recommendations) round out the coverage/trajectory tooling. The reducer (`scripts/shared/reduce-state.cjs`) replays `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` on every refresh into `journalSummary`, `candidateLineage`, and `mutationCoverage` registry fields, degrading gracefully to `null` when an artifact is missing.

Full stop-reason tables, the journal event-type list, the mutation-signature formula, dimension-trajectory vs. plateau distinctions, and orchestrator/reducer boundary ownership are documented in `references/shared/runtime_truth_contracts.md`.

---

## 8. RULES

### ✅ ALWAYS

- Read the charter, boundary file, and target profile before creating a candidate
- Keep the ledger append-only

exec
/bin/zsh -lc "sed -n '281,560p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work
- Require integration evidence to name each expected runtime mirror path explicitly (`.claude/agents`, `.opencode/agents`, plus any declared extra mirrors) before trusting `integrationGate`

### ⛔ NEVER

- Mutate the canonical target during proposal-only mode
- Broaden scope beyond the active boundary
- Treat runtime mirrors as experiment truth in the same phase as canonical evaluation
- Treat a stale placeholder mirror path as equivalent to a real runtime mirror
- Hide rejected runs, weak benchmark results, or infra failures
- Promote non-canonical targets even if they benchmark well

### ⚠️ ESCALATE IF

- The target profile and boundary file disagree about mutability or target family
- The benchmark runner cannot produce stable repeatability results
- Promotion evidence is incomplete but canonical mutation is still being requested
- Documentation edits would change the trust boundary rather than clarify it

---

## 9. REFERENCES

Core references: `README.md`, `references/shared/quick_reference.md`, `references/shared/loop_protocol.md`, evaluator/promotion/rollback/no-go/onboarding docs, runtime assets under `assets/`, benchmark assets, and helper scripts for scoring, reduction, promotion, rollback, scanning, drift, journal, mutation coverage, trade-offs, candidate lineage, and benchmark stability.

---

## 10. INTEGRATION POINTS

- `/deep:agent-improvement` initializes and runs the Lane A bounded workflow
- `/deep:model-benchmark` initializes and runs the Lane B model-benchmark workflow
- `/deep:skill-benchmark` runs the Lane C skill diagnostic
- `.opencode/agents/deep-improvement.md` provides the mutator surface for deep-improvement runs
- `sk-doc` validators enforce package-shape, README, and markdown document consistency
- `system-spec-kit` packet validation proves phase records remain truthful

---

## 11. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/shared/loop_protocol.md`, `references/shared/quick_reference.md`, `references/model_benchmark/benchmark_operator_guide.md`, `references/model_benchmark/evaluator_contract.md`, `references/agent_improvement/integration_scanning.md`, `references/agent_improvement/mirror_drift_policy.md`, `references/shared/promotion_rules.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/agent-improvement/benchmark-stability.cjs` (repeatability and weight recommendations), `scripts/agent-improvement/candidate-lineage.cjs` (candidate parentage across waves), `scripts/agent-improvement/check-mirror-drift.cjs` (runtime mirror drift report), `scripts/agent-improvement/generate-profile.cjs` (dynamic target profile), `scripts/shared/improvement-journal.cjs` (append-only lifecycle journal), `scripts/shared/materialize-benchmark-fixtures.cjs` (static fixture materializer), `scripts/shared/mutation-coverage.cjs` (mutation coverage graph), `scripts/shared/promote-candidate.cjs` (guarded canonical promotion), `scripts/shared/reduce-state.cjs` (dashboard and registry reducer), `scripts/shared/loop-host.cjs` (deep-loop host entrypoint), `scripts/agent-improvement/rollback-candidate.cjs` (promotion rollback), `scripts/model-benchmark/run-benchmark.cjs` (Lane B fixture runner), `scripts/model-benchmark/sweep-benchmark.cjs` (Lane B matrix sweep and scoring), `scripts/agent-improvement/scan-integration.cjs` (integration surface scanner), `scripts/agent-improvement/score-candidate.cjs` (Lane A candidate scorer), `scripts/agent-improvement/trade-off-detector.cjs` (Pareto trade-off detector), `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C orchestrator), `scripts/skill-benchmark/live-executor.cjs` (Lane C live dispatch executor), `scripts/skill-benchmark/score-skill-benchmark.cjs` (Lane C D1-D5 scorer), `scripts/skill-benchmark/d4-ablation.cjs` (D4 and D4-R ablation), `scripts/skill-benchmark/build-report.cjs` (Lane C markdown report renderer), `scripts/skill-benchmark/executor-dispatch.cjs` (Lane C executor router), `scripts/skill-benchmark/router-replay.cjs` (router-mode replay harness), `scripts/skill-benchmark/advisor-probe.cjs` (D1-inter deterministic advisor probe), `scripts/skill-benchmark/d5-connectivity.cjs` (D5 router-connectivity drift guard), `scripts/skill-benchmark/contamination-lint.cjs` (skill-off contamination linter), `scripts/skill-benchmark/load-playbook-scenarios.cjs` (playbook scenario loader), `scripts/skill-benchmark/playbook-generator.cjs` (playbook scenario generator), `scripts/skill-benchmark/browser-executor.cjs` (Lane C browser-trace executor), and `scripts/model-benchmark/dispatch-model.cjs` (Lane B per-cell dispatch envelope). This list names the lane-level scripts; per-lane `scorer/`, `lib/`, and `tests/` helpers are discovered dynamically and not all enumerated here.

Related skills: `sk-doc` for package-shape and markdown validation, `system-spec-kit` for packet validation, and `sk-prompt` when prompt surfaces need evaluator-backed rewriting.

codex
The routed packet confirms `model-benchmark` is Lane B on the improvement host, with router/live dispatch and pluggable 5-dimension scoring. Its mode-specific references now matter because the moat recommendations must extend existing seams—not duplicate features already present.
exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: Lane B (Model-Benchmark) Mechanics
description: Entry-point routing, dispatcher, scorer selection, mode-aware promotion path, and hardening env-gate rationale for the model-benchmark lane.
trigger_phrases:
  - "model-benchmark entry point"
  - "dispatch-model dispatcher"
  - "5dim scorer grader selection"
  - "criteria exec hardening gate"
  - "mode-aware promotion path"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Lane B (Model-Benchmark) Mechanics

Full mechanics behind the SKILL.md summary of Lane B: how `loop-host.cjs` resolves mode, how the model dispatcher and scorers are selected, how promotion is mode-aware, and why the criteria-exec hardening gates default the way they do.

---

## 1. OVERVIEW

### Purpose

Documents the exact routing, dispatch, and scoring mechanics that let Lane B (model-benchmark) share the candidate, dispatcher, and scorer seams with Lane A (agent-improvement) while keeping the default agent-improvement path byte-identical when no mode flag is set.

### When to Use

Use this reference when:
- Debugging why `loop-host.cjs` routed to the wrong scorer or dispatcher
- Choosing between the `pattern` and `5dim` scorers, or between `noop`/`mock`/`llm` graders
- Deciding whether a hardening env gate should be flipped for a shared or hardened deployment
- Explaining why a benchmark-report promotion bypassed the agent-scored-file requirement

### Core Principle

Lane B benchmarks a model or prompt framework instead of mutating an agent file, but it reuses Lane A's promoter, archive, and runtime-mirror sync — the two lanes diverge only at mode resolution, dispatch, and scoring, and reconverge at a single canonical-target guard.

---

## 2. ENTRY POINT AND MODE RESOLUTION

`scripts/shared/loop-host.cjs` resolves the mode. `--mode=agent-improvement` (or no flag) routes to `scripts/agent-improvement/score-candidate.cjs`. `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`. An unknown mode warns and falls back to agent-improvement.

---

## 3. DISPATCHER

`scripts/model-benchmark/dispatch-model.cjs` is the model-agnostic dispatcher (executor-routing map across cli-opencode, cli-claude-code, cli-opencode). It is loaded only on the model-benchmark path, never in agent-improvement mode.

---

## 4. SCORER SELECTION

`run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher. `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported 120/003 five-dimension scorer (deterministic checks plus a pluggable grader). `--grader noop` (default) stays deterministic with no model dispatch. `--grader mock` or `--grader llm` select the stub or real grader.

---

## 5. MODE-AWARE RECORDS AND PROMOTION PATH

Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports carry `scoringMethod: pattern|5dim`, so the reducer (`reduce-state.cjs`) and downstream consumers can attribute results per lane. Record-level mode metadata lives in the reducer, NOT in the promoter.

Lane A promotes a scored candidate through the agent-scored gates in `promote-candidate.cjs`. Lane B promotes from the benchmark report: pass `promote-candidate.cjs --benchmark-report <report.json>`, and when the report status is `benchmark-complete` with a passing benchmark recommendation, the benchmark-report path drives promotion and bypasses the agent-scored-file requirement. The promoter is NOT otherwise lane-branching beyond this benchmark-report path — both lanes share the same single canonical-target guard, archive, and runtime-mirror sync.

---

## 6. HARDENING ENV GATES

Set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to refuse criteria-driven shell execution in the 5-dim scorer. When the gate is off, BOTH criteria-exec paths are refused: the deterministic-criterion `execSync` in `score-model-variant.cjs` AND the bundle-gate Layer-3 acceptance-command `execSync` in `bundle-gate.cjs`. Set `DEEP_AGENT_GRADER_CACHE_RAW=0` to redact raw grader output from the on-disk cache. Both default to the permissive value for backward-compat.

### Trusted-Author Default Rationale (DOCUMENT-ACCEPT)

Criteria commands originate only from benchmark profiles authored by the operator running the loop, and the deterministic criterion runs in the same trust domain as the loop itself, so the default-on behavior is an intended trusted-author boundary rather than an untrusted-input risk. A shipped backward-compat test asserts the criterion runs by default, so flipping the default would be a behavior change with test impact, not a silent hardening. Hardened or shared-runner deployments set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to fail closed, and `DEEP_AGENT_GRADER_CACHE_RAW=0` to redact cached grader output.

---

## 7. RELATED RESOURCES

- `benchmark_operator_guide.md`
- `evaluator_contract.md`
- `mixed_executor_methodology.md`
- `../shared/promotion_rules.md`
- `../../scripts/model-benchmark/dispatch-model.cjs`
- `../../scripts/shared/loop-host.cjs`

exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: Evaluator Contract
description: Deterministic scoring and benchmark contract for target-profiled deep-improvement experiments.
trigger_phrases:
  - "evaluator contract"
  - "candidate scoring rubric"
  - "benchmark runner inputs"
  - "infra failure vs weak candidate"
importance_tier: important
contextType: implementation
version: 1.17.0.14
---

# Evaluator Contract

Contract for how `deep-improvement` scores candidates and benchmarks packet-local outputs. Use it when you need the exact evaluator inputs, outputs, rubric dimensions, and hard rejection behavior.

---

## 1. OVERVIEW

### Purpose

Defines the input and output contract for the prompt-surface scorer and the output benchmark runner so deep-improvement runs remain deterministic enough for bounded local experimentation.

### When to Use

Use this reference when:
- Updating scoring logic or benchmark rules
- Explaining why a candidate was kept, rejected, or marked infra-failure
- Adding a new target profile that needs evaluator support

### Core Principle

Weak candidates and infrastructure failures must be distinguishable. The contract exists so a broken tool path is not mistaken for a bad prompt and vice versa.

---

## 2. EVALUATED SURFACES

### Dynamic Profiles (only mode)

Every agent file in `.opencode/agents/*.md` is evaluated using dynamic mode. The scorer generates a profile on the fly from the agent's own structure, rules, and permissions using `generate-profile.cjs`. No static profiles are shipped; dynamic mode is the sole scoring path.

---

## 3. INPUT CONTRACT

### Dynamic Mode (5-dimension, only mode)

The scorer runs dynamic 5-dimension evaluation by default:
- `--candidate=PATH` required (path to the agent .md file)
- `--target=PATH` optional (defaults to candidate path)
- `--manifest=PATH` optional
- `--weights=JSON` optional (override default dimension weights)
- `--output=PATH` optional

The benchmark runner expects:
- `--profile=ID`
- `--outputs-dir=PATH`
- `--output=PATH`
- `--label=STRING` optional
- `--state-log=PATH` optional

---

## 4. OUTPUT CONTRACT

The scorer emits JSON with:
- `status`
- `profileId`
- `family`
- `evaluationMode` (always `"dynamic-5d"`)
- `target`
- `candidate`
- `score` (weighted dynamic score)
- `dimensions` (array of 5 dimension objects)
- `recommendation`
- `failureModes`
- `legacyScore` (always `null`; retained for schema compatibility)

The benchmark runner emits JSON with:
- `status`
- `profileId`
- `family`
- `label`
- `aggregateScore`
- `maxScore`
- `recommendation`
- `fixtures`
- `failureModes`

### Dimension Details

Each entry in the `dimensions` array contains `name`, `score`, `weight`, and `details`. The recommendation is `"candidate-acceptable"` when the weighted score is at least 70, otherwise `"needs-improvement"`.

---

## 5. RUBRIC

### 5-Dimension Rubric (dynamic mode)

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES sections) |
| Rule Coherence | 0.25 | ALWAYS/NEVER/ESCALATE IF rules align with workflow steps and instructions; keyword match against the agent's own stated rules |
| Integration Consistency | 0.25 | Runtime mirrors in sync, commands reference agent, skills reference agent; scored via `scan-integration.cjs` (mirror 60%, command 20%, skill 20%) |
| Output Quality | 0.15 | Output verification checklist items present in instructions; no placeholder content ([TODO], [TBD], [YOUR_VALUE_HERE]) |
| System Fitness | 0.15 | Permission-capability alignment (no tools listed but denied); resource references valid (commands and skills exist); frontmatter completeness (name, mode, permission) |

### Benchmark Rubric

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structure | 0.45 | Required headings or sections appear in the output |
| Grounding | 0.35 | Required file, command, or context references appear |
| Cleanliness | 0.20 | Placeholders and forbidden patterns are absent |
| Integration | optional | Mirror parity, command alignment, skill coverage (via `--integration-report`) |

---

## 6. REJECTION AND INFRA FAILURE

Reject immediately when:
- required target-profile sources are missing
- the candidate omits the target's mandatory contract anchors
- nested delegation is allowed where forbidden
- placeholders dominate the body
- the manifest marks the surface as forbidden or fixed
- a benchmark run drops below the profile minimum fixture or aggregate score

Use `infra_failure` only when the scorer or benchmark runner cannot read files, parse the manifest or profile, or load the fixture or output set.

---

## 7. RELATED RESOURCES

- `benchmark_operator_guide.md`
- `../shared/promotion_rules.md`
- `../shared/promotion_rules.md`
- `../../scripts/agent-improvement/score-candidate.cjs`
- `../../scripts/agent-improvement/scan-integration.cjs`
- `../../scripts/agent-improvement/generate-profile.cjs`


exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/benchmark_operator_guide.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
{
  "profileId": "default",
  "id": "default",
  "version": "1.0",
  "family": "deep-improvement",
  "targetPath": ".opencode/agents/deep-improvement.md",
  "fixtureDir": ".opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["fixture_baseline", "fixture_improved", "fixture_edge"],
  "outputsDir": "{spec_folder}/improvement/benchmark-outputs",
  "metrics": ["score", "delta", "pass_rate"],
  "thresholdDelta": 0.05,
  "benchmark": {
    "requiredAggregateScore": 80,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0.03,
    "repeatabilityCalibration": {
      "basis": "single-sample-noise",
      "note": "A tolerance of 0 asserts perfectly repeatable scoring, which contradicts observed run-to-run noise on single-sample cells (close single-sample results are ties with no confidence). 0.03 is a conservative score-fraction noise floor: deltas at or below it should be read as ties, not improvements. Recalibrate from the median absolute deviation over repeated identical-config runs once multi-sample data exists (sweep-stats `mad`)."
    }
  }
}

 succeeded in 0ms:
---
title: Benchmark Operator Guide
description: Step-by-step guide for running repeatable fixture benchmarks for deep-improvement target profiles.
trigger_phrases:
  - "run a fixture benchmark"
  - "benchmark runner command"
  - "benchmark repeatability"
  - "benchmark output layout"
importance_tier: normal
contextType: implementation
version: 1.17.0.18
---

# Benchmark Operator Guide

Operational guide for running deep-improvement benchmarks against packet-local outputs. Use it when you need deterministic evidence that a target profile still behaves consistently across repeated runs.

---

## 1. OVERVIEW

### Purpose

Explains how to run deterministic fixture benchmarks, where to store the resulting evidence, and how to interpret repeatability.

### When to Use

Use this reference when:
- Running the benchmark runner for any dynamic-mode target
- Building repeatability evidence for a promotion gate
- Checking whether a target profile is stable enough to trust

### Core Principle

Benchmark truth is output-based. The runner judges produced packet-local artifacts, not just how a prompt file reads.

The copied runtime templates use the `improvement_*` asset names, but the packet-local runtime files produced by the current workflow use the `agent-improvement-*` naming family.

---

## 2. RUNNER COMMAND

```text
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs \
  --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json \
  --outputs-dir {spec_folder}/improvement/benchmark-outputs

node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs \
  --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json \
  --outputs-dir {spec_folder}/improvement/benchmark-outputs
```

### Scorer Selection

`run-benchmark.cjs` defaults to `--scorer pattern` (the byte-identical heading and pattern matcher). Add `--scorer 5dim` to route the materialized outputs through the five-dimension scorer (`scripts/model-benchmark/scorer/score-model-variant.cjs`), and `--grader noop|mock|llm` to pick the D4 grader (default `noop`, deterministic). The report and `benchmark_run` record carry `scoringMethod: pattern` or `scoringMethod: 5dim`.

```text
node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs \
  --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json \
  --outputs-dir {spec_folder}/improvement/benchmark-outputs \
  --scorer 5dim --grader noop
```

### Integration Benchmark

When running with an integration report, add the `--integration-report` flag:

```text
node scripts/model-benchmark/run-benchmark.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json --outputs-dir=... --integration-report=integration-report.json
```

The integration report adds `integrationScore` and `integrationDetails` to the benchmark output:
- `mirrorScore` (0-100): deducts 30 per missing mirror, 20 per diverged mirror
- `commandScore` (0/100): at least 1 command references the agent
- `skillScore` (0/100): at least 1 skill references the agent
- Weighted: 60% mirror + 20% command + 20% skill

---

## 3. REQUIRED LAYOUT

```text
{spec_folder}/improvement/benchmark-outputs/
  fixture-baseline.md
  fixture-improved.md
  fixture-edge.md
  report.json
```

---

## 4. REPEATABILITY RULE

- Run the same fixture or output set at least twice
- Scores must remain identical when inputs are identical
- If scores drift, stop and treat the harness as unstable

---

## 5. SUCCESS CRITERIA

Benchmark success means:
- aggregate score meets the profile threshold
- no fixture falls below the profile minimum fixture score
- forbidden placeholder or fabrication patterns do not appear
- the benchmark record is appended to the packet-local ledger

Benchmark success does not mean:
- a mirror sync passed downstream checks
- a prompt-surface score exists with no benchmark evidence
- a benchmark run passed only once

---

## 6. RELATED RESOURCES

- `evaluator_contract.md`
- `../shared/loop_protocol.md`
- `../shared/promotion_rules.md`
- Authoring the fixtures and profiles this runner consumes: [`sk-doc/create-benchmark`](../../../../sk-doc/create-benchmark/SKILL.md) §11 — the fixture/profile templates plus [`model_benchmark_fixture_guide.md`](../../../../sk-doc/create-benchmark/references/model_benchmark/model_benchmark_fixture_guide.md). This guide keeps the run and scoring workflow; create-benchmark authors the input documents.

exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "reviewer fixture schema"
description: "Schema for reviewer-prompt regression fixtures with expected verdicts, visible and hidden cases, and deterministic replay support."
trigger_phrases:
  - "reviewer fixture schema"
  - "reviewer prompt regression"
  - "expected verdict fixture"
  - "deterministic fixture replay"
importance_tier: normal
contextType: implementation
version: 1.17.0.2
---

# Reviewer Fixture Schema

---

## 1. Overview

Reviewer fixtures let Lane B check whether a reviewer prompt still catches a known bug class. A fixture supplies a prompt template, a diff or repo-state input, and an expected verdict. The scorer runs the reviewer prompt, extracts `PASS`, `FAIL`, or `BLOCK`, then compares the result to the hidden oracle.

Reviewer fixtures are opt-in. Existing pattern and code-task fixtures keep their current scorers unless `SPECKIT_REVIEWER_BENCHMARKS` is enabled and the fixture has the reviewer shape.

---

## 2. Required Shape

```json
{
  "id": "reviewer-example",
  "kind": "reviewer-prompt",
  "agent": "review",
  "prompt_template": "Review this change. Return VERDICT: PASS|FAIL|BLOCK.",
  "input_kind": "diff",
  "input": {
    "repo_state": "short state summary",
    "diff": "unified diff or state reference",
    "review_focus": "what the reviewer must decide"
  },
  "expectedVerdict": "fail",
  "expectedFindings": [
    {
      "id": "finding-slug",
      "mustInclude": ["stale", "verification"]
    }
  ],
  "tests": [],
  "hidden_tests": []
}
```

Required fields:

- `kind`: must be `reviewer-prompt`.
- `agent`: reviewer agent or prompt family under test.
- `prompt_template`: prompt text. The scorer replaces `{{input}}`, `{{diff}}`, `{{state_ref}}`, and `{{review_focus}}` when present.
- `input_kind`: `diff` or `state_ref`.
- `input`: object or string carrying the repo-state/diff material.
- `expectedVerdict`: one of `pass`, `fail`, or `block`.
- `expectedFindings`: finding expectations checked against reviewer output.

---

## 3. Visible And Hidden Cases

Use `tests` for visible calibration cases and `hidden_tests` for held-out oracle cases. Each case may override `input`, `input_kind`, `expectedVerdict`, `expectedFindings`, and `reviewer_output`.

The scorer grades visible plus hidden cases, but hidden cases are the overfit guard: a prompt that passes the visible case and misses a hidden case fails the fixture.

---

## 4. Deterministic Replay

For deterministic CI or pre-commit replay, a case may include `reviewer_output`. When present, the scorer parses that output instead of dispatching a live model. When absent, the scorer writes the composed prompt to a temp file and calls `dispatch-model.cjs`.

Live model dispatch is opt-in and should stay outside blocking CI unless the operator deliberately enables it.

---

## 5. Verdict Contract

Reviewer output should include one parseable verdict line:

```text
VERDICT: FAIL
```

Accepted verdicts are `PASS`, `FAIL`, and `BLOCK` in any case. If the pattern matcher cannot find a verdict and the run uses `--grader llm`, the scorer asks the existing model dispatcher to classify the prose into one of the three verdicts.

On mismatch, the Lane B report surfaces one consequence line per fixture:

```text
REVIEWER_BENCHMARK: fixture reviewer-example expected FAIL, got PASS — rule not safe to promote
```

---

## 6. Adding A Fixture

1. Copy one of the `reviewer-*.json` seed fixtures.
2. Keep `kind: "reviewer-prompt"` and choose `input_kind`.
3. Put the known buggy or blocking input in `input`.
4. Add one visible case and one hidden case.
5. Keep expected findings token-based and specific enough to reject vague verdict-only output.
6. Parse the JSON before committing.

exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: Quick Reference
description: Short operational reference for running the deep-improvement workflow.
trigger_phrases:
  - "deep-improvement quick reference"
  - "agent improvement command"
  - "improvement runtime layout"
  - "dimension weights"
importance_tier: normal
contextType: general
version: 1.17.0.20
---

# Quick Reference

Quick reminder for running `deep-improvement` without re-reading the full protocol. Use it when you already know the workflow and only need the command shape, runtime layout, and core guards.

---

## 1. OVERVIEW

### Purpose

Provides a compact reminder of the deep-improvement workflow, the canonical command shape, and the packet-local runtime layout.

### When to Use

Use this reference when:
- You need the shortest possible command reminder
- You want to confirm the expected runtime folder layout
- You need a quick safety check before running the loop

### Core Principle

Proposal-first evidence is the default. Canonical mutation is a later guarded step, not the starting point.

The workflow copies `improvement_*` assets into the runtime, but the packet-local runtime files currently use the `agent-improvement-*` naming family shown below.

---

## 2. COMMANDS

```text
# Dynamic mode (the only evaluation path; works for any agent)
/deep:agent-improvement ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}
```

### Standalone Scripts

```text
# Scan integration surfaces
node scripts/agent-improvement/scan-integration.cjs --agent=debug

# Generate dynamic profile
node scripts/agent-improvement/generate-profile.cjs --agent=.opencode/agents/debug.md

# 5-dimension scoring (dynamic mode, the only supported path)
node scripts/agent-improvement/score-candidate.cjs --candidate=.opencode/agents/debug.md

# Static benchmark fixtures
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs
node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs

# Model-benchmark mode (benchmarks a model/prompt, not an agent file; default path unchanged)
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs --mode=model-benchmark --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs
# Opt-in 5-dimension scorer (default is --scorer pattern); grader noop|mock|llm
node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs --scorer 5dim --grader noop
```

### Dimension Weights (Dynamic Mode)

| Dimension | Weight |
| --- | --- |
| Structural Integrity | 0.20 |
| Rule Coherence | 0.25 |
| Integration Consistency | 0.25 |
| Output Quality | 0.15 |
| System Fitness | 0.15 |

---

## 3. RUNTIME LAYOUT

```text
{spec_folder}/improvement/
  agent-improvement-config.json
  agent-improvement-state.jsonl
  agent-improvement-strategy.md
  agent-improvement-dashboard.md
  experiment-registry.json
  candidates/
  benchmark-outputs/
```

---

## 4. KEY GUARDS

- proposal-only by default
- promotion is a per-target decision under dynamic mode
- dynamic profiles drive scoring and benchmarks
- append-only ledger
- scorer independent from mutator
- benchmark evidence separate from mirror-sync packaging

---

## 5. RELATED RESOURCES

- `loop_protocol.md`
- `../model_benchmark/evaluator_contract.md`
- `../agent_improvement/integration_scanning.md`
- `../model_benchmark/benchmark_operator_guide.md`
- `promotion_rules.md`
- `../../README.md`

exec
/bin/zsh -lc "sed -n '1,999p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/mixed_executor_methodology.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "Mixed-Executor Methodology for Multi-Iter Evaluation Sweeps"
description: "Guidance on using mixed-executor dispatch (breadth CLI executor breadth + cli-opencode gpt-5.5 synthesis) and adjudication-iter false-positive filter for DAI multi-iter evaluation sweeps."
trigger_phrases:
  - "mixed-executor methodology"
  - "multi-iter evaluation sweep"
  - "breadth and synthesis iters"
  - "adjudication-iter false-positive filter"
importance_tier: normal
contextType: research
version: 1.17.0.8
---

# Mixed-Executor Methodology for Multi-Iter Evaluation Sweeps

How to combine mixed-executor dispatch with an adjudication-iter false-positive filter for DAI multi-iter evaluation sweeps.

---

## 1. OVERVIEW

This reference documents the mixed-executor dispatch pattern and the adjudication-iter false-positive filter. Both are proven, recommended practices for DAI operators running multi-iter evaluation sweeps.

The mixed-executor pattern combines breadth exploration (a breadth CLI executor, e.g. cli-opencode small-model) with synthesis quality (cli-opencode gpt-5.5) using an 8+2 split for 10-iter sweeps. The adjudication-iter pattern adds a false-positive filter pass (typically at iter-7-equivalent) to reduce noise before synthesis. Together, these patterns provide better breadth/synthesis balance and 90%+ false-positive reduction compared to single-executor approaches.

## 2. When to Use the Mixed-Executor Pattern

Use the mixed-executor pattern when:
- Running multi-iter evaluation sweeps (not single-shot scoring)
- Breadth exploration and synthesis quality are both important
- False-positive reduction is a priority
- You want to balance cost (breadth CLI executor) with synthesis quality (cli-opencode gpt-5.5)

Do NOT use the mixed-executor pattern when:
- Running single-shot scoring (single executor is sufficient)
- Breadth-only exploration is sufficient (breadth CLI executor only)
- Synthesis-only is sufficient (cli-opencode gpt-5.5 only)

---

## 3. The 8+2 Split

The mixed-executor pattern uses an 8+2 split for a 10-iter sweep:

### Breadth Iters (1-N-2): breadth CLI executor (e.g. cli-opencode small-model)

- **Purpose**: Breadth exploration, finding candidates, surface-level analysis
- **Executor**: a breadth CLI executor (e.g. cli-opencode small-model)
- **Characteristics**: Fast, cost-effective, good for breadth
- **Example**: Iters 1-8 of a 10-iter sweep

### Synthesis Iters (N-1, N): cli-opencode gpt-5.5

- **Purpose**: Synthesis, quality pass, final validation
- **Executor**: cli-opencode gpt-5.5
- **Characteristics**: Higher reasoning, better synthesis, more expensive
- **Example**: Iters 9-10 of a 10-iter sweep

### Example: 10-Iter Sweep

```text
Iter 1:  breadth CLI executor  (breadth)
Iter 2:  breadth CLI executor  (breadth)
Iter 3:  breadth CLI executor  (breadth)
Iter 4:  breadth CLI executor  (breadth)
Iter 5:  breadth CLI executor  (breadth)
Iter 6:  breadth CLI executor  (breadth)
Iter 7:  breadth CLI executor  (adjudication)
Iter 8:  breadth CLI executor  (breadth)
Iter 9:  cli-opencode gpt-5.5    (synthesis)
Iter 10: cli-opencode gpt-5.5    (final validation)
```

---

## The Adjudication-Iter Pattern

The adjudication-iter pattern is a false-positive filter pass that significantly reduces noise in multi-iter sweeps.

### Pattern: False-Positive Filter Pass

- **Adjudication iter**: Typically at iter-7-equivalent (before synthesis iters)
- **Mechanism**: Cross-finding adjudication to drop outdated and false-positive items
- **Outcome**: Only confirmed findings proceed to synthesis

### Example: 10-Iter Sweep with Adjudication

```text
Iter 1-6:  breadth CLI executor  (breadth)
Iter 7:    breadth CLI executor  (adjudication pass)
Iter 8:    breadth CLI executor  (breadth)
Iter 9-10: cli-opencode gpt-5.5    (synthesis on confirmed findings only)
```

### Adjudication Mechanics

The adjudication iter should:
1. Review all findings from previous iters
2. Cross-check for duplicates, outdated items, and false-positives
3. Drop items marked as `OUTDATED` or `FALSE-POSITIVE`
4. Keep only `CONFIRMED` items for synthesis

### Validation Evidence

In a 10-iter validation sweep, the iteration-7 adjudication pass:
- Dropped 9 false-positive items
- Dropped 4 outdated items
- Reduced the queue from 20 to 7 confirmed findings
- Achieved 90%+ false-positive reduction

---

## Why It Works

A 10-iter deep-research investigation validated this methodology. Its key findings:

- Single-executor approaches lose breadth/synthesis balance
- Without adjudication, adversarial passes produce 90%+ false-positive findings
- The 8+2 split provides the best balance of cost and quality
- Adjudication at the iter-7 mark is optimal for 10-iter sweeps

---

## Implementation Notes for DAI

### Current Status

The mixed-executor and adjudication patterns are documented as **RECOMMENDED** practices. They are not enforced in the DAI YAML workflow.

### Future Enhancement: Auto-Dispatch

A future enhancement could auto-dispatch the mixed-executor pattern in the DAI YAML workflow, similar to how deep-research's workflow handles executor selection. This would require:
- Adding executor configuration to DAI's YAML workflow
- Wiring the 8+2 split into the iteration loop
- Adding adjudication-iter as a configurable step

### Manual Implementation Today

Operators can manually implement the mixed-executor pattern by:
1. Running breadth iters with a breadth CLI executor (e.g. cli-opencode small-model)
2. Running an adjudication pass to filter findings
3. Running synthesis iters with cli-opencode gpt-5.5 on confirmed findings only

---

## Related References

- DAI SKILL.md: section "5. MULTI-ITER METHODOLOGY"
- `references/shared/loop_protocol.md`: end-to-end operator workflow that consumes this methodology

codex
The current lane is strong on deterministic replay but weak on three selection truths: task distribution, hidden-data provenance, and utility per euro/token/latency. I’m testing those gaps against primary papers, official benchmark analyses, and implementation repos that were not in the prior inventories.
web search: 
web search: task-specific private evaluation LLM model selection generic leaderboard rank reversal paper ...
web search: 
web search: "The Fault in Our LLM Leaderboards" repository GitHub ...
web search: 
web search: cost-aware LLM model selection quality cost Pareto benchmark paper 2025 GitHub ...
web search: 
web search: LAMPS Language Model Pareto Selection GitHub repository ICLR 2026 ...
web search: 
web search: 
web search: 
web search: "The Fault in Our LLM Leaderboards" target task correlation ranking result ...
web search: 
web search: https://api.github.com/repos/openai/evals
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:github.com/openai/evals "Latest commit" 2026 ...
codex
Evidence now supports the moat directly: one 2025 study found leaderboard–target-task correlations often below 0.5, while task-aware metrics can reorder models. The differentiator should therefore be measured as “public-prior regret recovered on private work,” not another aggregate benchmark score. I’m anchoring the mechanism to Lane B’s actual dispatcher/sweep modules next.
exec
/bin/zsh -lc "rg -n --glob '*.cjs' --glob '*.json' --glob '*.md' 'mode[-_ ]?A|mode[-_ ]?B|router|live|cost|latency|token|price|sweep|seed|perturb' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:17:// aggregation, and deliverable-contract extraction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:19:const { extractDeliverable } = require('../shared/extract-deliverable.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:88:// The immutable history snapshot lives at a basename derived from the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:147:// exponential-backtracking construct over a long input, and anchor matching cost
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:192:  // When the profile declares deliverable_contract, score ONLY the delimited
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:193:  // deliverable region because reasoning text contaminates pattern and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:196:    const extracted = extractDeliverable(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:209:        failureModes: ['missing-deliverable-contract'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:302:  // represent the aggregate; per-sample detail lives under `samples`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:626:    // Profile-declared deliverable contracts make scorers grade only the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:628:    const contract = profile.deliverable_contract
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:629:      ? { required: Boolean(profile.deliverable_contract.required) }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:731:      ...(contract && { deliverableContract: contract }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:3:Config-driven model-benchmark sweeps. One profile drives a **framework bake-off** (many prompt frameworks, one model) OR a **model-vs-model** comparison (one framework, many models) through the same code path. Which kind of run you get is decided by your profile, not by different code: there are NO mode-specific branches. `mode` only sets sensible defaults; the swept axis is whichever profile array carries more than one value.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:13:- **One profile, one path.** `sweep-benchmark.cjs` expands `models × variants × frameworks × fixtures × samples` into a uniform cartesian product. Any axis you omit collapses to a singleton, so a 5-framework bake-off and a 3-model head-to-head run the same `runSweep`/`expandCells` logic.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:24:| `sweep-benchmark.cjs` | CLI entry + matrix expander. Expands the profile, renders each framework prompt, dispatches each cell, scores each row, writes outputs. No mode branch. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:27:| `lib/sweep-stats.cjs` | `mean` / `median` / `mad` / `quantile` / `seededRandom` + the trust-verdict helper (with an insufficient-n floor). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:30:| `lib/sweep-reporter.cjs` | Builds `aggregate.json` (grouped + verdict) and `synthesis.md` (verdict + saturation, then leaderboard). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:31:| `../../../sk-prompt/assets/framework-registry.json` | The 5 frameworks as data: `rcaf`, `race`, `cidi`, `tidd-ec`, `costar` (id / description / applies_to / template / slots / output_contract). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:44:node sweep-benchmark.cjs --profile <path> [--mock] [--out-dir <dir>]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:49:| `--profile <path>` | Required. The sweep profile JSON. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:58:node sweep-benchmark.cjs \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:61:  --out-dir /tmp/sweep-out
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:96:The MVP runs `sweep-benchmark.cjs` standalone and ships the minimum stats needed for an honest verdict. Still on the roadmap: the full stats engine (paired bootstrap confidence intervals / noise-floor gating), the normalized dispatch envelope (OpenCode JSON token/cost parsing and `model-profiles.json` capability fields), the guarded `loop-host.cjs` integration that runs the sweep inside the improvement loop, and the tiered fixture taxonomy (more T3/T4 plus long-context/agentic categories). See the roadmap: `../../../../specs/skilled-agent-orchestration/127-reusable-model-benchmark-framework/001-design-research/research/research.md`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/README.md:65:| `framework_bakeoff.json` | `mode: framework-bakeoff` profile running one `cli-opencode` model across `frameworks` `[rcaf, race, cidi, tidd-ec, costar]` on the `t3_*` fixtures with the weighted `5dim` scorer. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/README.md:74:| Ownership | This directory is data only. Lane B logic lives in the scripts; fixtures and profiles carry no executable code. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json:18:      "note": "A tolerance of 0 asserts perfectly repeatable scoring, which contradicts observed run-to-run noise on single-sample cells (close single-sample results are ties with no confidence). 0.03 is a conservative score-fraction noise floor: deltas at or below it should be read as ties, not improvements. Recalibrate from the median absolute deviation over repeated identical-config runs once multi-sample data exists (sweep-stats `mad`)."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_discriminating.json:14:  "frameworks": ["rcaf", "race", "cidi", "tidd-ec", "costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_discriminating.json:29:  "sampling": { "samplesPerCell": 6, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json:13:  "frameworks": ["rcaf", "race", "cidi", "tidd-ec", "costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json:28:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json:23:  "frameworks": ["costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json:26:    { "executor": "cli-opencode", "model": "xiaomi-token-plan-ams/mimo-v2.5-pro", "variant": "high" }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json:31:  "sampling": { "samplesPerCell": 5, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:3:Six situational benchmark modes, all driven by **the profile alone**. The rig code (`sweep-benchmark.cjs` + `lib/*`) never branches on the mode: it always does *expand matrix → render framework prompt → dispatch each cell → score each row → reduce by `groupBy`*. A "mode" is a thin selector that sets sensible defaults; **the only thing that changes between situations is the swept axis in the profile.** Pick the mode whose swept axis matches the question you are asking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:5:> **What "swept axis" means.** Any profile array (`models[]`, `frameworks[]`, `variants[]`) with more than one entry is a swept axis; every other axis collapses to a singleton. The matrix is `models × variants × frameworks × fixtures × samples`. You do not need a different mode to get a different sweep — you need a different array to carry more than one value. `mode` only documents intent and picks defaults (default `groupBy`, default scorer, default leaderboard).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:18:Everything below is the **profile delta** for each mode. Shared keys (`fixtureDir`, `scoring`, `sampling`, `benchmark`, `outputsDir`) are the same shape as the shipped example profiles in `../../assets/model_benchmark/benchmark-profiles/`. The two shipped examples — `framework_bakeoff.json` (mode B) and `model_vs_model.json` (mode A) — are runnable references; the C–F snippets follow the same contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:44:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:66:  "frameworks": ["rcaf", "race", "cidi", "tidd-ec", "costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:71:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:99:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:108:**Question:** is candidate prompt B better than candidate prompt A for a fixed model? This is a two-entry framework sweep where the two "frameworks" are your two candidate prompts (registry ids, or inline framework definitions). It reuses the same scoring path as B with exactly two competitors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:121:  "frameworks": ["rcaf", "costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:126:  "sampling": { "samplesPerCell": 5, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:155:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:178:  "fixtures": ["t1-echo", "t3-lower-bound", "t3-compare-versions", "t4-tokenize-expr"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:187:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:192:> The fixtures above span tiers on purpose: `t1-echo` (T1 smoke / demote-class) confirms the harness end-to-end and is expected to saturate; the two T3 fixtures separate on real algorithmic correctness; `t4-tokenize-expr` (T4 adversarial, strict-acceptance with a malformed-input sentinel branch) is the one frontier models genuinely vary on. Reading the per-fixture verdict together is the capability radar.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md:23:- `loop-host.cjs` in `../shared/` is the router. It resolves the bare names `run-benchmark.cjs` and `dispatch-model.cjs` to this folder at spawn time.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md:36:│ (../shared)      │      │ executor router     │      │ opencode/claude/ │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md:37:│ router           │      │ read-only default   │      │ opencode             │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md:62:+-- dispatch-model.cjs    # Executor router: prompt-file in, model output JSON out
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md:64:+-- sweep-benchmark.cjs   # Config-driven matrix sweep runner for models/frameworks/variants
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md:87:| Ownership | Lane B dispatch and fixture scoring live here. The 5-dimension engine lives in `scorer/`. Mode routing and lane-path resolution live in `../shared/loop-host.cjs`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json:23:  "frameworks": ["costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json:26:    { "executor": "cli-opencode", "model": "xiaomi-token-plan-ams/mimo-v2.5-pro", "variant": "high" }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json:31:  "sampling": { "samplesPerCell": 5, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:47:// This file lives in scripts/model-benchmark/, one level deeper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:50:// pre-move scripts/-root depth. state/ and assets/ live at the skill root
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:183:// Coerce a candidate usage value to a finite number, or null. Token/cost fields
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:192:// plausibly carries them. The live binary's usage payload is UNVERIFIED (the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:195:// shapes: a `usage`/`tokens` object with input/output token counts, and a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:196:// numeric `cost`/`cost_usd`. Returns { tokens_in, tokens_out, cost_usd } with
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:199:  const out = { tokens_in: null, tokens_out: null, cost_usd: null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:206:    const usage = c.usage || c.tokens || null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:208:      if (out.tokens_in == null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:209:        out.tokens_in = finiteOrNull(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:211:            : usage.input_tokens != null ? usage.input_tokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:212:              : usage.prompt_tokens != null ? usage.prompt_tokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:213:                : usage.tokens_in,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:216:      if (out.tokens_out == null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:217:        out.tokens_out = finiteOrNull(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:219:            : usage.output_tokens != null ? usage.output_tokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:220:              : usage.completion_tokens != null ? usage.completion_tokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:221:                : usage.tokens_out,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:225:    if (out.cost_usd == null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:226:      const cost = c.cost != null ? c.cost : c.cost_usd;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:227:      if (cost && typeof cost === 'object') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:228:        out.cost_usd = finiteOrNull(cost.total != null ? cost.total : cost.usd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:230:        out.cost_usd = finiteOrNull(cost);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:238:// Returns { output, tokens_in, tokens_out, cost_usd, usage_parser_status }:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:240://     part start time (mirrors the sweep extractor shape). Empty string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:251:    tokens_in: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:252:    tokens_out: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:253:    cost_usd: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:271:    if (usage.tokens_in != null && result.tokens_in == null) result.tokens_in = usage.tokens_in;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:272:    if (usage.tokens_out != null && result.tokens_out == null) result.tokens_out = usage.tokens_out;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:273:    if (usage.cost_usd != null && result.cost_usd == null) result.cost_usd = usage.cost_usd;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:283:  if (result.tokens_in != null || result.tokens_out != null || result.cost_usd != null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:293:// the cli-opencode event stream, else raw stdout). Token/cost stay null unless an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:295:function buildEnvelope(raw, resolved, executor, latencyMs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:297:  env.latency_ms = Number.isFinite(latencyMs) ? latencyMs : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:304:  env.tokens_in = finiteOrNull(raw && raw.tokens_in);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:305:  env.tokens_out = finiteOrNull(raw && raw.tokens_out);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:306:  env.cost_usd = finiteOrNull(raw && raw.cost_usd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:316:    if (parsed.tokens_in != null) env.tokens_in = parsed.tokens_in;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:317:    if (parsed.tokens_out != null) env.tokens_out = parsed.tokens_out;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:318:    if (parsed.cost_usd != null) env.cost_usd = parsed.cost_usd;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:404:      // token-plan providers (MiniMax, Xiaomi MiMo) reject it outright. Pass
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:410:      // assemble clean assistant text and read usage (tokens/cost) when the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:443:  // Wall-clock start for the normalized envelope's latency_ms (per-dispatch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:444:  // inclusive of retries/backoff — the real elapsed cost of getting a result).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json:13:  "frameworks": ["rcaf", "race", "cidi", "tidd-ec", "costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json:28:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:8: * Two cache kinds live side by side under cache/:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:2:// ║ sweep-stats — dependency-free sweep statistics & trustworthiness gates   ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:7:// Dependency-free statistics for the benchmark sweep. No scipy/numpy analogue —
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:9:// robust spread (MAD) for the noise floor, quantiles, a deterministic seeded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:10:// generator for reproducible randomized fixtures, a seeded paired-delta
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:13:// and tolerates empty input by returning NaN (never throws) so a partial sweep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:89: * Deterministic PRNG (mulberry32). Same seed -> same stream, so randomized /
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:91: * machines. Accepts a number or a string seed (hashed to a 32-bit int).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:93: * @param {number|string} seed - Numeric seed or string seed (FNV-1a hashed).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:96:function seededRandom(seed) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:98:  if (typeof seed === 'number' && Number.isFinite(seed)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:99:    a = seed >>> 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:101:    // FNV-1a 32-bit over the string form, so string seeds are stable.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:103:    const s = String(seed === undefined ? '' : seed);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:156:// Pair two sample series by position, the only pairing the sweep can justify:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:221: *      draws n deltas and records its mean. seededRandom makes the draw stream
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:222: *      reproducible, so the same inputs + seed always yield the same CI.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:236: * @param {number|string} [options.seed] - Seed for the resampling stream.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:260:  const rand = seededRandom(opts.seed);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:265:      // Draw an index in [0, n) from the seeded stream; Math.floor keeps it in
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:346:  seededRandom,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:18:`benchmark-profiles/` holds the three JSON profiles a Lane B run loads with `run-benchmark.cjs --profile <path-or-id>`. A profile declares the fixtures to score, where outputs land, the scoring method, and (for sweep profiles) the matrix of frameworks and models to run. `default.json` is the legacy single-pass profile; `framework_bakeoff.json` and `model_vs_model.json` add a `mode` field and a sweep matrix.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:22:- `default.json` has no `mode` — it scores three deep-improvement agent fixtures with the legacy pattern scorer (no `scoring` block, no sweep).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:23:- `framework_bakeoff.json` sets `mode: framework-bakeoff` and sweeps five prompt frameworks against one model, grouping the leaderboard by framework.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:24:- `model_vs_model.json` sets `mode: model-vs-model` and sweeps three models against one fixed framework, grouping the leaderboard by model.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:25:- Both sweep profiles use the opt-in `5dim` scorer, `samplesPerCell: 3` at `seed: 1729`, and the same five weighted dimensions (D1 0.25, D2 0.30, D3 0.20, D4 0.15, D5 0.10) under a `correctnessGate` of 1.0.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:26:- All three share the same `outputsDir` token (`{spec_folder}/improvement/benchmark-outputs`) and the same `benchmark` gate (aggregate 80, per-fixture 70, repeatability tolerance 0).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:35:| `framework_bakeoff.json` | `framework-bakeoff` | Prompt-framework sweep. Holds one model fixed (`cli-opencode` / `minimax-coding-plan` / `MiniMax-M2.7`) and sweeps `frameworks: [rcaf, race, cidi, tidd-ec, costar]` over the T3 fixtures `t3-lower-bound` and `t3-compare-versions`. Reports `groupBy: framework` with leaderboard and history. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:36:| `model_vs_model.json` | `model-vs-model` | Model sweep. Holds one framework fixed (`rcaf`) and sweeps three model cells (`cli-opencode` MiniMax-M2.7, `cli-opencode` gpt-5.5 high, `cli-claude-code` claude-opus high) over the same two T3 fixtures. Reports `groupBy: model` with leaderboard and history. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:46:| Ownership | These three profiles are the canonical Lane B run configs. The fixtures they reference live in `../benchmark-fixtures/` (resolved via each profile's `fixtureDir`). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md:49:| Path tokens | `outputsDir` contains the `{spec_folder}` token, expanded by the loop runtime at dispatch time; do not hard-code a spec path here. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:2:// ║ profile-validator — additive, dependency-free sweep-profile validator      ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:9: * framework. It validates ONLY the new sweep keys, and ONLY when they are
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:20:// Supported sweep modes. `mode` is a thin selector; the runner stays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:82:  // Legacy profile: no sweep semantics declared. Leave it entirely alone.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/model_vs_model.json:30:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json:7:  "_note": "GLM-5.2 framework bakeoff (157-glm-5-2-support/002). Uses the invalid-dominant strict-validator pack from the start (the 149 run-007 lesson) so correctness SEPARATES instead of saturating. Frameworks are limited to the harness framework-registry set [rcaf,race,cidi,tidd-ec,costar]; CRAFT (the phase-1 doc-guided default) is NOT in the registry, so the empirical winner among these 5 replaces it. correctnessGate.threshold 0.0 ranks groups on graded correctness_pass_rate (deterministic oracle) rather than filtering. Ran with --grader noop so correctness comes from the deterministic hidden-test oracle with no LLM-judge bias.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json:13:  "frameworks": ["rcaf", "race", "cidi", "tidd-ec", "costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json:28:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:18:`benchmark-fixtures/` holds the JSON fixtures a sweep scores. Each coding-task fixture names a function (`fn_name`), states the task, and carries `tests[]` (visible) + `hidden_tests[]` (held-out adversarial) oracle cases of the form `{name, args[], expect}`. `code-task-scorer.cjs` extracts the model's function, runs every oracle case in an isolated child process, and returns a `correctness_pass_rate` fraction — so "mostly right" separates from "fully right" instead of pass/fail.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:27:- The tiered taxonomy (`t1`/`t3`/`t4`) seeds the smoke → adversarial range.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:31:- Reviewer fixtures (`reviewer_*`) seed reviewer-prompt regression cases for stale evidence, softened failure, read-budget overuse, and acceptance coverage shortfall.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:43:| `t4_adversarial_tokenizer.json` | T4 | `tokenize` | 15 | Adversarial tokenizer. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:63:Reviewer fixtures are detected by shape: `kind: "reviewer-prompt"`, a string `prompt_template`, and an `expectedVerdict` in `pass`/`fail`/`block`. They carry `tests[]` and `hidden_tests[]` just like code-task fixtures, but the oracle is a verdict plus expected finding tokens rather than function return values.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:2:title: "lib: config-driven sweep framework primitives"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:3:description: "Pure, mostly dependency-free helpers consumed by the sweep runner: per-cell scoring, reviewer verdict scoring, correctness gating, framework rendering, profile validation, grouped reporting, and stats."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:5:  - "sweep framework primitives"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:8:  - "sweep-reporter"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:11:# lib: config-driven sweep framework primitives
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:17:`lib/` holds the building blocks of the config-driven benchmark *sweep*. Each module is a pure (or near-pure) helper that `../sweep-benchmark.cjs` composes into one pipeline: render a prompt per framework, score each model output into a dimension vector, gate on correctness, then aggregate and report a trust verdict before any leaderboard. The central design choice is that **correctness is a GATE, not a blended score** — the fix for a saturation mis-read where a tied 100%-correct column let a format/length artifact pose as a correctness win.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:25:- `profile-validator.cjs` validates only the new sweep keys, only when present, so legacy profiles pass untouched.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:26:- `sweep-reporter.cjs` groups rows, applies the gate, auto-detects saturation, and emits `aggregate.json` + `synthesis.md` with the trust verdict first.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:27:- `sweep-stats.cjs` supplies the dependency-free stats the verdict needs: MAD, quantiles, a seeded paired-delta bootstrap CI, and the verdict gates.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:39:| `profile-validator.cjs` | Additive, dependency-free sweep-key validator. Returns `{ valid, errors }` (collects all issues, never throws). A profile with no `mode` is reported valid and untouched; present keys (`mode`, `models[].executor`, `scoring.scorer`, dimension weights summing to 1.0, `correctnessGate.threshold ∈ [0,1]`, `sampling.samplesPerCell`) are checked against their contract. Exports `validateProfile`, `KNOWN_MODES`, `KNOWN_EXECUTORS`, `KNOWN_SCORERS`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:40:| `sweep-reporter.cjs` | Turns raw per-cell rows into a grouped aggregate + human synthesis. Groups by `reporting.groupBy`, applies the gate, auto-detects per-fixture saturation, and builds a trust verdict (enough repeated samples AND top-pair margin over the noise floor AND a paired bootstrap CI excluding zero) on the gate's chosen ranking key. Orders `synthesis.md` so the verdict and saturation status precede any leaderboard. Exports `report` plus `groupRows`, `aggregateGroup`, `detectFixtureSaturation`, `minSamplesPerCell`, `noiseFloorForKey`, `buildVerdict`, `SCHEMA_VERSION`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:41:| `sweep-stats.cjs` | Dependency-free statistics: `mean`, `median`, `quantile`, `mad` (robust spread used as the noise floor), `seededRandom` (mulberry32, number or string seed), `bootstrapPairedDeltaCi`, `pairedWinRate`, `noiseFloorMad`, and the verdict gates `trustVerdict` / `trustVerdictCI`. Every helper is pure and returns NaN on empty input rather than throwing. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:49:| Imports | `code-task-scorer.cjs`, `correctness-gate.cjs`, `framework-renderer.cjs`, `profile-validator.cjs`, and `sweep-stats.cjs` import only Node builtins. `sweep-reporter.cjs` is the one intra-lib edge: it requires `./sweep-stats.cjs` and `./correctness-gate.cjs`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:51:| Consumers | `../sweep-benchmark.cjs` is the sweep runner that composes these: it requires `framework-renderer`, `profile-validator`, `code-task-scorer`, and `sweep-reporter` directly (the gate and stats arrive transitively through the reporter). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:52:| Ownership | These primitives own per-cell scoring, gating, rendering, validation, aggregation, and stats. The sweep orchestration, dispatch, and disk layout live in `../sweep-benchmark.cjs`; the legacy 5-dimension engine lives in `../scorer/`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:53:| Write policy | Pure helpers do no I/O except `sweep-reporter.report` (writes `aggregate.json` + `synthesis.md` only when `outDir`/`write` is set) and `framework-renderer.loadRegistry` (reads a registry JSON). The child-process scorer materializes a runner program to a temp dir; it writes no benchmark state. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:65:│ (additive sweep-key checks; legacy passes)   │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:83:│ sweep-reporter.report                        │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:88:│  → trust verdict via sweep-stats             │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:106:npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:107:npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:108:npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md:111:Expected result: the sweep foundation, stats-CI, and acceptance suites pass.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json:23:  "frameworks": ["costar"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json:26:    { "executor": "cli-opencode", "model": "xiaomi-token-plan-ams/mimo-v2.5-pro", "variant": "high" }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json:31:  "sampling": { "samplesPerCell": 3, "seed": 1729 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs:53:    const token = new RegExp('\\{\\{\\s*' + escapeRegExp(key) + '\\s*\\}\\}', 'g');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs:54:    out = out.replace(token, String(val));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs:71:// Build the value map for a framework render: fixture-sourced tokens plus the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs:74:// the fixture tokens before it can fill the framework's {{output_contract}} slot.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs:116: * @param {Object} fixture - Fixture providing task/fn_name/signature tokens.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:2:// ║ sweep-reporter — grouped sweep aggregate + trust-first synthesis           ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:9: * per-cell sweep rows into a grouped aggregate plus a human synthesis, and it
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:38:const stats = require('./sweep-stats.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:101: * @param {Array<Object>} rows - The raw per-cell sweep rows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:252:  // Stable, deterministic condition order so the seeded bootstrap is reproducible.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:266:// A stable per-report seed for the paired bootstrap: derived from the deciding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:268:// comparison. An explicit seed override (tests / calibration) takes precedence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:284: *   confidence?, seed? }.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:343:      seed: verdictSeed(top.group, second.group, rankingKey, options.seed),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:517: * Turn a sweep result into a grouped aggregate plus a trust-first synthesis,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:520: * @param {Object} sweepResult - The object returned by runSweep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:528:function report(sweepResult, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:530:  if (!sweepResult || !Array.isArray(sweepResult.rows)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:531:    throw new Error('report: sweepResult must carry a rows[] array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:543:  const rows = sweepResult.rows;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:579:  // knobs (iterations / confidence / seed) stay overridable for tests.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:584:    seed: options.bootstrapSeed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:624:      id: (sweepResult.profile && sweepResult.profile.id) || profile.id || profile.profileId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:625:      mode: (sweepResult.profile && sweepResult.profile.mode) || profile.mode || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:626:      version: (sweepResult.profile && sweepResult.profile.version) || profile.version || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md:22:- Dimensions: D1 acceptance, D2 bundle gate (hard gate), D3 cwd/path, D4 grader, D5 pre-planning. Weights live in `DEFAULT_RUBRIC`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:2:  "id": "t4-tokenize-expr",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:5:  "fn_name": "tokenize",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:6:  "signature": "function tokenize(expr)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:7:  "task": "Implement a JavaScript function `tokenize(expr)` that scans a tiny arithmetic-expression string left to right and returns an array of token objects. The grammar: a NUMBER is a maximal run of ASCII digits 0-9 and the '.' character; an OPERATOR is one of `+ - * /`; a PAREN is `(` or `)`; spaces and tabs are separators and produce no token. Emit tokens in source order. Apply these rules strictly: (1) A number token is `{ type: 'num', value: <the exact literal substring> }` — accumulate consecutive digit/'.' characters into ONE token (so '12' and '345' are two tokens but '12' is never split into '1','2'). (2) An operator token is `{ type: 'op', value: <the operator char> }`; EVERY `-` is an operator token (there is no negative-number literal in this grammar), so '1+-2' is num,op,op,num. (3) A paren token is `{ type: 'paren', value: <the paren char> }`. (4) Whitespace (space or tab) is skipped entirely and never appears in the output. (5) ERROR HANDLING — instead of throwing, return the sentinel value `null` for malformed input: a numeric literal containing more than one '.' (e.g. '1.2.3'), a bare '.' that is not part of a digit run (e.g. the input '.'), or any character outside digits, '.', the four operators, the two parens, space, and tab (e.g. '$' or a letter). An empty or all-whitespace input is NOT an error: it returns an empty array `[]`. These are adversarial cases: multi-digit/decimal number accumulation, treating every '-' as an operator, distinguishing the empty-array (no tokens) result from the null (malformed) result, and the single-'.' / double-'.' rejection are exactly where naive single-character or regex-greedy tokenizers diverge.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:8:  "visibleSpec": "tokenize(expr) -> Array<{type:'num'|'op'|'paren', value:string}> | null. Numbers are maximal digit/'.' runs kept as one token carrying the literal substring; operators are + - * / (every '-' is an operator); parens are ( ); whitespace is skipped. Malformed input (a literal with two or more dots, a bare '.', or any unsupported character) returns null. Empty or all-whitespace input returns []. Tokens are returned in source order.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:18:    { "name": "empty string yields empty token list", "args": [""], "expect": [] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:19:    { "name": "decimal number stays one token", "args": ["3.14"], "expect": [{ "type": "num", "value": "3.14" }] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:21:    { "name": "minus is always the operator token", "args": ["8-3"], "expect": [{ "type": "num", "value": "8" }, { "type": "op", "value": "-" }, { "type": "num", "value": "3" }] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:22:    { "name": "adjacent operators each tokenize", "args": ["1+-2"], "expect": [{ "type": "num", "value": "1" }, { "type": "op", "value": "+" }, { "type": "op", "value": "-" }, { "type": "num", "value": "2" }] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json:24:    { "name": "all whitespace yields empty token list", "args": ["   "], "expect": [] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:128:  return required.every((token) => text.includes(String(token).toLowerCase()));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:200:// Cache the materialized child path per process so a sweep of many cells does
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:309: *   output_words          : whitespace-delimited token count of raw output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:373:  // Exported for unit reuse and so the sweep layer can share extraction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:68: * Extract candidate path-like tokens from text.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:69: * Heuristic: absolute /..., ~/..., relative ./..., ../..., or token containing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:73: * @returns {string[]} De-duplicated path-like tokens.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:87:    // Skip very-likely-URL tokens (contain "://").
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:95:function stripTrailingPunct(token) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:96:  return token.replace(/[\.,;:!\?\)\]\}'"`>]+$/, '');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:109: * Classify a path token relative to the fixture cwd.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:111: * @param {string} rawPath - Candidate path token.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:143: * Score an output's path/CWD discipline by tallying classified path tokens.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_eval_expr.json:7:  "task": "Implement a JavaScript function `evalExpr(expr)` that evaluates an integer arithmetic expression string and returns the integer result, or the sentinel value `null` for any malformed expression. The grammar supports non-negative integer literals, the binary operators `+ - * /`, parentheses `( )`, and a UNARY minus. Apply these rules strictly: (1) Standard precedence: `*` and `/` bind tighter than `+` and `-`; evaluate left-to-right within the same precedence level; parentheses override. (2) `/` is INTEGER division that TRUNCATES TOWARD ZERO (so 7/2 = 3 and -7/2 = -3, matching JS `Math.trunc(a/b)`), NOT floor division. (3) Unary minus negates the following factor, so '-5' is -5 and '3 - -2' is 5 and '-(2+3)' is -5. (4) Whitespace (spaces) is insignificant and may appear anywhere between tokens. (5) MALFORMED input returns `null` instead of throwing: an empty or all-whitespace string, unbalanced parentheses, a trailing or doubled binary operator (e.g. '1+' or '1++2'), an empty pair of parens '()', any character outside digits/operators/parens/space, OR a DIVISION BY ZERO. (Division by zero returns null, it does NOT throw and does NOT return Infinity.) These are adversarial cases: trunc-toward-zero on negative division, unary vs binary minus disambiguation, precedence with parentheses, division-by-zero as null, and the several malformed shapes are exactly where a naive left-to-right evaluator, a floor-division `/`, or a `new Function` shortcut diverges. Return ONLY the function source as text. Do NOT create or write any files.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_eval_expr.json:8:  "visibleSpec": "evalExpr(expr) -> number | null. Evaluates an integer arithmetic string over + - * / and parens with standard precedence and unary minus; / truncates toward zero (Math.trunc). Returns null for malformed input: empty/whitespace, unbalanced parens, '()', a trailing/doubled binary operator, an illegal character, or division by zero. Whitespace between tokens is insignificant.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:189:        hint: 'fixture seed not materialized; 003 should not score variants against this fixture',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:3:// ║ sweep-benchmark — config-driven benchmark matrix expander and scorer     ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:6:// profile into a cartesian sweep of cells and scores each cell, with NO
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:33:const { report } = require('./lib/sweep-reporter.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:41:// Canonical framework definitions live in the sk-prompt prompt-improve sub-hub;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:67:  if (!raw) throw new Error('sweep: profile is missing fixtureDir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:84:    throw new Error('sweep: cannot read fixtureDir ' + fixtureDir + ': ' + (e.message || e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:117:    throw new Error('sweep: profile selects no fixtures (set fixtures[] or fixtureSelection.include[])');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:127:    throw new Error('sweep: fixtures not found by id or filename: ' + missing.join(', '));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:156:  // Top-level variants[] is the explicit sweep axis (e.g. reasoning ablation).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:195: * @param {Object} profile - The benchmark profile defining the sweep axes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:196: * @param {Array<Object>} fixtures - The resolved fixtures to sweep across.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:209:          // Effective variant: the explicit sweep axis wins; otherwise the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:262:      throw new Error('sweep: cell ' + cell.cellId + ' has no framework and no fixture.task to dispatch');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:268:    throw new Error('sweep: framework "' + cell.framework + '" not found in registry');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:286:      latency_ms: Date.now() - t0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:297:  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-cell-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:328:      latency_ms: Date.now() - t0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:368:// The sweep.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:377:  return fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-out-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:380:// Run the full sweep for a profile. opts:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:393: * Run the full benchmark sweep for a profile: expand cells, dispatch, score, and report.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:395: * @param {Object} profile - The validated benchmark profile to sweep.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:397: * @returns {Object} The sweep result (profile, rows, meta, and aggregate/synthesis when reporting).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:404:    throw new Error('sweep: invalid profile: ' + verdict.errors.join('; '));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:467:        latency_ms: d.latency_ms,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:468:        // Nullable usage fields: providers that do not expose token/cost report
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:470:        tokens_in: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:471:        tokens_out: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:472:        cost_usd: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:571:    process.stderr.write('usage: sweep-benchmark.cjs --profile <path> [--mock] [--mock-mode=<m>] [--out-dir <dir>] [--no-report]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:578:    process.stderr.write('sweep: cannot read profile ' + args.profile + ': ' + (e.message || e) + '\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:595:    process.stderr.write('sweep failed: ' + (e.message || e) + '\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/README.md:63:| `cwd-check.cjs` | Extracts path-like tokens and classifies each as in-cwd, outside, bare-relative, or traversal. Scores 1.0 when all are in-cwd or bare-relative, 0.7 when some are outside, and 0.0 on any traversal attempt. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:74:For deterministic CI or pre-commit replay, a case may include `reviewer_output`. When present, the scorer parses that output instead of dispatching a live model. When absent, the scorer writes the composed prompt to a temp file and calls `dispatch-model.cjs`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:100:1. Copy one of the `reviewer-*.json` seed fixtures.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:104:5. Keep expected findings token-based and specific enough to reject vague verdict-only output.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:484:  const [fixturePath, outputPath, modeArg] = process.argv.slice(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:492:  const mode = modeArg && modeArg.startsWith('mock') ? 'mock' : (modeArg || 'mock');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:493:  const mockMode = modeArg && modeArg.startsWith('mock-') ? modeArg.slice('mock-'.length) : 'default';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:23: *   CLI flags: tokens matching /(--?[A-Za-z][A-Za-z0-9_-]+)/ in fenced code blocks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:98: * Extract tokens that look like CLI flags from output text.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:101: * @returns {string[]} De-duplicated CLI-flag tokens.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:105:  // Find tokens that look like CLI flags: --flag or -f, length >= 2 to skip "-" subtraction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:2:title: "tests: Lane B + sweep framework vitest suite"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:3:description: "The vitest suite that guards the deep-improvement Lane B benchmark and the config-driven sweep framework — scorers, the correctness gate, the matrix sweep runtime, the dispatch envelope, paired-bootstrap stats, and dispatch cwd-isolation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:6:  - "sweep vitest suite"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:7:  - "sweep-isolation test"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:11:# tests: Lane B + sweep framework vitest suite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:17:`tests/` holds the vitest suite for the whole `model-benchmark/` surface — both the original deep-improvement Lane B grader and the config-driven *sweep* framework built on top of it. The suite is additive: the Lane B baseline stays green while every sweep feature lands behind its own spec file. Run the whole suite from the skill's `scripts/` root:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:28:- `sweep-isolation` is the safety net for the real-dispatch path: it asserts each cell runs in an `os.tmpdir()` working directory (never the repo root) and is cleaned up, so an agentic model's stray writes cannot pollute the repo.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:42:| `sweep-foundation.vitest.ts` | 26 | Matrix expansion (cartesian cells, no mode branches), framework rendering, profile validation. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:43:| `sweep-runtime.vitest.ts` | 13 | Sweep run orchestration, scoring per cell, reporting wiring. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:44:| `sweep-acceptance.vitest.ts` | 11 | End-to-end sweep acceptance over fixtures (mock-mode). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:45:| `sweep-stats-ci.vitest.ts` | 19 | Dependency-free stats: MAD noise floor, quantiles, seeded paired-delta bootstrap CI, verdict gates. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:46:| `dispatch-envelope.vitest.ts` | 18 | Normalized dispatch envelope (latency, nullable tokens/cost, OpenCode JSON-stream usage parsing). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:47:| `sweep-isolation.vitest.ts` | 15 | Per-cell cwd is under `os.tmpdir()` (not repo root), holds the prompt file, is cleaned up after single + multi-cell sweeps, and a simulated model write does not leak; plus fixture-shape + profile-load coverage for the hard / validation fixture packs. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f4b6ea7a34706c73189ac821c6ec177d.out.md:1:<!-- cache-meta {"kind":"grader","key":"f4b6ea7a34706c73189ac821c6ec177d","created_at":"2026-07-08T16:44:05.141Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8e6d3962a346cf59796d3df172c3901b.out.md:1:<!-- cache-meta {"kind":"grader","key":"8e6d3962a346cf59796d3df172c3901b","created_at":"2026-06-15T14:24:23.881Z","dim_id":"D4","fixture_id":"CS-001#off","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md:1:<!-- cache-meta {"kind":"grader","key":"c0470150d6f7383f350f17216a2fbb3a","created_at":"2026-07-09T17:05:57.195Z","dim_id":"D4-R","fixture_id":"SP-004#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md:2:{"score":0.81,"confidence":0.75,"rationale":"Provides specific model configuration (COSTAR primary, TIDD-EC fallback) with correct file paths and appropriate read-only verification commands, though does not explicitly address the 'Z.AI Coding Plan' context from the question.","evidence":["GLM-5.2 uses `prompt-models/references/models/glm-5.2.md`: primary `COSTAR`, fallback `TIDD-EC`, avoid `RCAF`, pre-planning `lean`","rg -n '\"id\": \"glm-5\\.2\"|\"primary\": \"costar\"|\"fallback\": \"tidd-ec\"...' .opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json","No file changes. Existing source already answers it"],"dim_id":"D4-R","parse_status":"fallback_fenced","raw_grader_output":"[redacted: set DEEP_AGENT_GRADER_CACHE_RAW=1 to store raw output]","version":"1.0.0"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md:1:<!-- cache-meta {"kind":"grader","key":"8429f8a8a9d13c87e2176d57a49648c5","created_at":"2026-07-09T17:06:44.706Z","dim_id":"D4-R","fixture_id":"SP-004#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/df404b41b693fd90b7d2b2fb64d46d78.out.md:1:<!-- cache-meta {"kind":"grader","key":"df404b41b693fd90b7d2b2fb64d46d78","created_at":"2026-07-09T16:56:45.327Z","dim_id":"D4-R","fixture_id":"SP-001#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/aac68b3316e3489dd0c4e9b5e367ddd5.out.md:1:<!-- cache-meta {"kind":"grader","key":"aac68b3316e3489dd0c4e9b5e367ddd5","created_at":"2026-07-11T16:22:35.795Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc53734e22ef097b18e31f94d61a003d.out.md:1:<!-- cache-meta {"kind":"grader","key":"fc53734e22ef097b18e31f94d61a003d","created_at":"2026-07-11T16:22:35.740Z","dim_id":"D4","fixture_id":"CS-001#off","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4d1138ca8c23389ecdf84767e8691348.out.md:1:<!-- cache-meta {"kind":"grader","key":"4d1138ca8c23389ecdf84767e8691348","created_at":"2026-07-08T16:44:05.095Z","dim_id":"D4","fixture_id":"CS-001#on","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/42840a5b34cdd91b3e2ff2d77184541e.out.md:1:<!-- cache-meta {"kind":"grader","key":"42840a5b34cdd91b3e2ff2d77184541e","created_at":"2026-06-15T14:24:23.879Z","dim_id":"D4","fixture_id":"CS-001#on","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/e5706bc35dabb7584b4563c9d5b2bd42.out.md:1:<!-- cache-meta {"kind":"grader","key":"e5706bc35dabb7584b4563c9d5b2bd42","created_at":"2026-07-09T17:03:14.530Z","dim_id":"D4-R","fixture_id":"SP-003#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/d0bc23dd3d54f9d0feef1727c1313afe.out.md:1:<!-- cache-meta {"kind":"grader","key":"d0bc23dd3d54f9d0feef1727c1313afe","created_at":"2026-07-08T16:44:05.098Z","dim_id":"D4","fixture_id":"CS-001#off","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9a38a58ebffba2c0a5e87918261d9afb.out.md:1:<!-- cache-meta {"kind":"grader","key":"9a38a58ebffba2c0a5e87918261d9afb","created_at":"2026-07-11T16:22:35.796Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/7fb218c8d070aa9e92bbda2b3bba94de.out.md:1:<!-- cache-meta {"kind":"grader","key":"7fb218c8d070aa9e92bbda2b3bba94de","created_at":"2026-06-15T14:24:23.887Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9c562e7eb6d90a65972bc75282b09770.out.md:1:<!-- cache-meta {"kind":"grader","key":"9c562e7eb6d90a65972bc75282b09770","created_at":"2026-06-15T14:24:23.886Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/0115576e1e7be786962398431c973dd9.out.md:1:<!-- cache-meta {"kind":"grader","key":"0115576e1e7be786962398431c973dd9","created_at":"2026-07-09T16:59:57.764Z","dim_id":"D4-R","fixture_id":"SP-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/cbbeff1caf82bd3a1e002bbd22377b43.out.md:1:<!-- cache-meta {"kind":"grader","key":"cbbeff1caf82bd3a1e002bbd22377b43","created_at":"2026-07-09T16:56:09.228Z","dim_id":"D4-R","fixture_id":"SP-001#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc10907e5828f4c8b642f4557d6c0675.out.md:1:<!-- cache-meta {"kind":"grader","key":"fc10907e5828f4c8b642f4557d6c0675","created_at":"2026-07-11T16:22:35.737Z","dim_id":"D4","fixture_id":"CS-001#on","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md:1:<!-- cache-meta {"kind":"grader","key":"8f1323b05b3fd805dc519983d68b2e9d","created_at":"2026-07-09T17:02:45.940Z","dim_id":"D4-R","fixture_id":"SP-003#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4b7b4bbc6313c5e1c67711655e612a98.out.md:1:<!-- cache-meta {"kind":"grader","key":"4b7b4bbc6313c5e1c67711655e612a98","created_at":"2026-07-08T16:44:05.140Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md:1:<!-- cache-meta {"kind":"grader","key":"5036729e69ce24c3ba32d9bf748e6152","created_at":"2026-07-09T16:59:33.152Z","dim_id":"D4-R","fixture_id":"SP-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->

exec
/bin/zsh -lc "rg -n --glob '"'!cache/**'"' --glob '"'!tests/**'"' -i 'router mode|mode a|mode b|router-mode|live mode|replay|advisor|mode-a|mode-b' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/routing-allowlist.json:4:    {"path": "assets/skill_benchmark/fixtures/README.md", "reason": "Legacy Mode-A fixture corpus inventory; superseded-but-supported catalog, not per-task guidance."},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:263:- **sessionOutcome**: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:269:Static benchmark assets (profile, fixtures, materializer, runner) ship with the skill under `assets/model_benchmark/` and `scripts/shared/materialize-benchmark-fixtures.cjs` / `scripts/model-benchmark/run-benchmark.cjs`. Output location depends on the caller: the static `default.json` regression check embedded in every `/deep:agent-improvement` iteration (Lane A) writes spec-locally to `{spec_folder}/improvement/benchmark-outputs/`, while the standalone `/deep:model-benchmark` command (Lane B) writes to the sk-prompt/prompt-models hub (`.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`), keyed by the operator-supplied `run_label`. `scripts/shared/mutation-coverage.cjs` tracks explored/exhausted mutation types with a signature-based dedup (`DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` bypasses it); `scripts/agent-improvement/trade-off-detector.cjs` blocks promotion on Pareto-dominated candidates; `scripts/agent-improvement/candidate-lineage.cjs` (disabled by default) and `scripts/agent-improvement/benchmark-stability.cjs` (advisory-only weight recommendations) round out the coverage/trajectory tooling. The reducer (`scripts/shared/reduce-state.cjs`) replays `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` on every refresh into `journalSummary`, `candidateLineage`, and `mutationCoverage` registry fields, degrading gracefully to `null` when an artifact is missing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:326:Scripts: `scripts/agent-improvement/benchmark-stability.cjs` (repeatability and weight recommendations), `scripts/agent-improvement/candidate-lineage.cjs` (candidate parentage across waves), `scripts/agent-improvement/check-mirror-drift.cjs` (runtime mirror drift report), `scripts/agent-improvement/generate-profile.cjs` (dynamic target profile), `scripts/shared/improvement-journal.cjs` (append-only lifecycle journal), `scripts/shared/materialize-benchmark-fixtures.cjs` (static fixture materializer), `scripts/shared/mutation-coverage.cjs` (mutation coverage graph), `scripts/shared/promote-candidate.cjs` (guarded canonical promotion), `scripts/shared/reduce-state.cjs` (dashboard and registry reducer), `scripts/shared/loop-host.cjs` (deep-loop host entrypoint), `scripts/agent-improvement/rollback-candidate.cjs` (promotion rollback), `scripts/model-benchmark/run-benchmark.cjs` (Lane B fixture runner), `scripts/model-benchmark/sweep-benchmark.cjs` (Lane B matrix sweep and scoring), `scripts/agent-improvement/scan-integration.cjs` (integration surface scanner), `scripts/agent-improvement/score-candidate.cjs` (Lane A candidate scorer), `scripts/agent-improvement/trade-off-detector.cjs` (Pareto trade-off detector), `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C orchestrator), `scripts/skill-benchmark/live-executor.cjs` (Lane C live dispatch executor), `scripts/skill-benchmark/score-skill-benchmark.cjs` (Lane C D1-D5 scorer), `scripts/skill-benchmark/d4-ablation.cjs` (D4 and D4-R ablation), `scripts/skill-benchmark/build-report.cjs` (Lane C markdown report renderer), `scripts/skill-benchmark/executor-dispatch.cjs` (Lane C executor router), `scripts/skill-benchmark/router-replay.cjs` (router-mode replay harness), `scripts/skill-benchmark/advisor-probe.cjs` (D1-inter deterministic advisor probe), `scripts/skill-benchmark/d5-connectivity.cjs` (D5 router-connectivity drift guard), `scripts/skill-benchmark/contamination-lint.cjs` (skill-off contamination linter), `scripts/skill-benchmark/load-playbook-scenarios.cjs` (playbook scenario loader), `scripts/skill-benchmark/playbook-generator.cjs` (playbook scenario generator), `scripts/skill-benchmark/browser-executor.cjs` (Lane C browser-trace executor), and `scripts/model-benchmark/dispatch-model.cjs` (Lane B per-cell dispatch envelope). This list names the lane-level scripts; per-lane `scorer/`, `lib/`, and `tests/` helpers are discovered dynamically and not all enumerated here.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/README.md:80:An agent is more than its `.md` file. `scan-integration.cjs` inventories the canonical agent definition (`.opencode/agents/`), its Claude runtime mirror (`.claude/agents/`), command dispatch files, YAML workflow assets, skill references and the skill-advisor routing path. The scanner extracts emphasized strings from the canonical agent and marks a mirror aligned when enough of them appear. A drifted mirror shows up before it causes a runtime surprise, and the score reflects the whole integration surface, not the prompt in isolation. Mirror parity is also enforced repo-wide outside a scoring run: `scripts/check-agent-mirror-sync.cjs` gates commits (through `.opencode/hooks/pre-commit`) and pull requests into `main` (through `.github/workflows/agent-mirror-sync.yml`), so drifted runtime copies are caught before they merge. The commit hook fails open when Node or the checker is unavailable so it never blocks an unrelated commit; the CI gate on `main` is the fail-closed backstop.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/README.md:132:`deep-improvement` is the only deep loop that can mutate a file. Every other deep loop is read-only or advisory. This one writes only when the promotion gate opens, and even then it records a rollback path. `system-spec-kit` owns the spec folder, validation and memory continuity for the run. `runtime/` provides the shared coverage graph and atomic-state layer. `sk-prompt/prompt-models` owns the benchmark output tree that Lane B writes into.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/README.md:158:A: It finds every file that references an agent: the canonical definition, its Claude runtime mirror, command dispatch files, YAML workflow references, skill SKILL.md mentions and the skill-advisor routing entry. It extracts emphasized strings from the canonical agent and marks a mirror aligned when enough of them appear.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/README.md:180:The `feature_catalog/` covers every capability across five categories: evaluation-loop, integration-scanning, scoring-system, model-benchmark-mode and skill-benchmark. Each category documents inputs, outputs, the owning resource and acceptance criteria with live source anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json:110:    "replayCount": 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:42:3. Capture enough evidence that another operator can replay the verdict without guessing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:462:Expected signals: Journal contains at least one `session_ended` or `session_end` event; `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`; Both fields are present (validation rejects events missing either); `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:566:Expected signals: `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory; `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays; `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome; `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`; `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed; No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:571:### RT-031 | Replay Consumer Artifact Verification
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:574:Replay Consumer Artifact Verification.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:577:Prompt summary: As a manual-testing orchestrator, validate ADR-002 Option A replay-consumer behavior: reduce-state.cjs reads improvement-journal.jsonl, candidate-lineage.json, and mutation-coverage.json, writes their summaries into the registry, and degrades gracefully when any one artifact is missing against the current deep-improvement command, runtime artifacts, and validation scripts. Verify \`experiment-registry.json\` contains the replay-consumer summaries. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:582:> **Feature File:** [RT-031](runtime_truth/replay_consumer.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:793:This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract. These scenarios validate Lane C (Skill-Benchmark): the `loop-host.cjs --mode=skill-benchmark` arm, the contamination gate, router-replay (Mode A), the D5 connectivity hard gate, scoring against the private gold, and the dual report plus remediation taxonomy. See `SKILL.md` "Lane C: Skill-Benchmark" and `references/skill_benchmark/operator_guide.md` for the source-of-truth contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:821:### SB-045 | Router-Replay (Mode A, Deterministic)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:824:`router-replay.cjs` replays the target skill's own router for a task and produces stable, deterministic routing decisions (the CI gate).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:827:Prompt summary: As a manual-testing orchestrator, validate that router-replay produces deterministic routing output for a fixed task. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:832:> **Feature File:** [SB-045](skill_benchmark/router_replay_mode_a.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:850:`run-skill-benchmark.cjs` plus `score-skill-benchmark.cjs` score router-replay output against the private gold fixture and aggregate the D1-D5 dimensions over only the dimensions actually measured.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:855:Expected signals: the run exits 0 with `scoringMethod: "mode-a-router-replay"`; at least one scored scenario row carries `dims.d1intra`; the aggregate carries an `aggregateScore` and a verdict (`PASS`/`CONDITIONAL`/`FAIL`); `D4` is reported `unscored` (live-mode ablation) and `D5.hardGate` is present; under the default deterministic path `unscoredDimensions` includes `D1inter` (advisor probe off).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:882:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts` | Candidate lineage graph helpers used by E2E-021 and replay-consumer validation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:889:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Skill-benchmark router-replay, D5 connectivity, scoring, and dual-report helpers used by SB-043..SB-048 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:907:| Skill-Benchmark Mode | `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md`, `02-contamination-gate-and-fixtures.md`, `03-router-replay-and-advisor-probe.md`, `04-d5-connectivity-gate.md`, `05-scoring-and-funnel.md`, `06-dual-report-and-remediation.md` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:5:  "scoringMethod": "mode-a-router-replay",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:33:      "status": "unscored-mode-a"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:50:      "status": "unscored-mode-a"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:62:  "advisorySignals": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:65:      "status": "unscored (run --d4 in live mode)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:71:      "note": "deferred-asset support recall; advisory, not weighted"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:76:      "note": "advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:80:      "status": "unscored (no advisor probe or no rank-below gold)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:81:      "note": "advisor target rank relative to sibling transports; advisory, not weighted"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:203:    "advisor": 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:315:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:316:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:323:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:331:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:335:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:341:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:351:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:403:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:404:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:411:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:419:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:423:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:429:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:439:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:491:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:492:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:499:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:507:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:511:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:517:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:527:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:579:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:580:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:587:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:595:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:599:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:605:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:615:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:667:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:668:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:675:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:683:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:687:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:693:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:703:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:755:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:756:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:763:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:771:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:775:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:781:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:791:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:843:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:844:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:851:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:859:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:863:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:869:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:879:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:931:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:932:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:939:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:947:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:951:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:957:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:967:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1019:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1020:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1027:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1035:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1039:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1045:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1055:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1095:      "status": "unscored (no advisor probe or no rank-below gold)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1096:      "note": "advisor target rank relative to sibling transports; advisory, not weighted"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json:1168:    "note": "Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0)."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:3:> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:10:- By class — routing: 9 · advisor: 0 · browser: 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:16:| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:20:| D4 usefulness | 25pts | _unscored-mode-a_ |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:23:_Unscored in this run (need live mode): D1inter, D4._
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:25:### Advisory signals (NOT in the weighted aggregate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:27:- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:60:## Contamination findings (router mode — drift, not failures)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md:75:- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:5:  "scoringMethod": "mode-b-live",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:33:      "status": "unscored-mode-a"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:50:      "status": "unscored-mode-a"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:62:  "advisorySignals": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:65:      "status": "unscored (run --d4 in live mode)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:71:      "note": "deferred-asset support recall; advisory, not weighted"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:76:      "note": "advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:80:      "status": "unscored (no advisor probe or no rank-below gold)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:81:      "note": "advisor target rank relative to sibling transports; advisory, not weighted"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:203:    "advisor": 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:231:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:232:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:239:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:247:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:251:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:257:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:267:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:322:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:323:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:330:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:338:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:342:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:348:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:358:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:413:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:414:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:421:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:429:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:433:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:439:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:449:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:504:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:505:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:512:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:520:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:524:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:530:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:540:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:602:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:603:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:610:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:618:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:622:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:628:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:638:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:700:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:701:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:708:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:716:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:720:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:726:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:736:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:791:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:792:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:799:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:807:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:811:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:817:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:827:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:889:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:890:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:897:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:905:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:909:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:915:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:925:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:987:          "proxy": "router-replay-recall",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:988:          "note": "Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:995:          "note": "Mode A proxy; live-mode replaces with calls/tokens-to-first-expected"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1003:          "unscored": "no advisor probe (run with --advisor-mode=python)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1007:          "unscored": "requires skill-on/off ablation (live mode)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1013:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1023:          "advisory": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1065:      "status": "unscored (no advisor probe or no rank-below gold)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1066:      "note": "advisor target rank relative to sibling transports; advisory, not weighted"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json:1138:    "note": "Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0)."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:3:> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:10:- By class — routing: 10 · advisor: 0 · browser: 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:16:| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:20:| D4 usefulness | 25pts | _unscored-mode-a_ |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:23:_Unscored in this run (need live mode): D1inter, D4._
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:25:### Advisory signals (NOT in the weighted aggregate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:27:- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md:63:- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md:85:- Profile-selection logs are not critical for replay (unlike `agent-improvement-state.jsonl`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md:50:| Skill advisor | `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Routing entries |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/audit_journal_emission.md:23:- Objective: Validate Audit Journal Lifecycle Event Emission for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md:90:- **sessionOutcome** (WHAT happened): `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md:1:This is a fix-and-hardening release that closes every finding from an independent deep review of the v1.11.0.0 skill-benchmark work. A 10-iteration MiMo-v2.5-pro deep review of `skill:deep-improvement` surfaced 28 issues (0 blockers, 8 should-fix, 20 advisory). All 28 are now fixed, behavior-preserving — the full Vitest suite stays green and the sk-code router drift guard is unchanged. The headline fix makes the D4-R task-outcome grader correct end-to-end: it no longer reuses the old D4-hallucination plumbing in its fallback path, and it no longer clips the (longer) task-outcome answers before grading.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md:28:- **`scoreScenario` decomposed (byte-identical math).** The 153-line function is split into named helpers (`normalizeScenarioInput`, `computeSurfaceMatch`, `scoreD1Intra`, `scoreD2`, `scoreD3`, `scoreAssetRecall`, `firstFailingStage`, `modeAScore`, `buildLiveEvidence`); the D1-intra weights and surface-mismatch cap are named constants; mode-A scoring reads `WEIGHTS`; the negative-scenario `wastedCount` semantics are clarified. No score changes. Duplicated grader-base construction (`d4-ablation`) and event-stream parsing (`sweep-benchmark`) were de-duplicated into shared helpers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md:29:- **Docs match the code.** `SKILL.md` gains the `SKILL_BENCHMARK runtime_assets` router branch and the 6 previously-missing scripts in §11; `README.md` reconciles the references count (14→17), the scripts table, the structure block, and the trigger phrases (6→9); `scoring_contract.md` completes the funnel stages and documents `advisorySignals`; the v1.11.0.0 changelog ties the D4-R scenarios to the `DEFAULT_D4R_SCENARIOS` constant.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/journal_wiring.md:23:- Objective: Validate Journal Wiring Boundary Coverage for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/journal_wiring.md:46:| RT-029 | Journal Wiring Boundary Coverage | Validate Journal Wiring Boundary Coverage | `Validate that /deep:agent-improvement wires improvement-journal.cjs at every required workflow boundary.` | /deep:agent-improvement &quot;.opencode/agents/debug.md&quot; :auto --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br>AUTO_YAML=.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml<br>TMP_SPEC=&quot;$(mktemp -d /tmp/deep-improvement-journal-XXXXXX)&quot;<br>TMP_JOURNAL=&quot;$TMP_SPEC/improvement/improvement-journal.jsonl&quot;<br><br><br>grep -n &quot;improvement-journal.cjs\&#124;--emit&quot; &quot;$AUTO_YAML&quot;<br><br><br>python3 - &lt;&lt;&#x27;PY&#x27;<br>from pathlib import Path<br>yaml_text = Path(&quot;.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml&quot;).read_text()<br>required = [<br>    &quot;session_start&quot;,<br>    &quot;candidate_generated&quot;,<br>    &quot;candidate_scored&quot;,<br>    &quot;benchmark_completed&quot;,<br>    &quot;legal_stop_evaluated&quot;,<br>    &quot;gateResults&quot;,<br>    &quot;session_end&quot;,<br>]<br>missing = [token for token in required if token not in yaml_text]<br>assert not missing, f&quot;Missing journal boundaries in auto YAML: {missing}&quot;<br>print(&quot;PASS - auto YAML covers start, iteration, nested legal-stop, benchmark, and end boundaries&quot;)<br>PY<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs --emit session_start --journal &quot;$TMP_JOURNAL&quot; --details &#x27;{&quot;sessionId&quot;:&quot;imp-2026-04-11T12-00-00Z&quot;,&quot;target&quot;:&quot;deep-research&quot;,&quot;charter&quot;:&quot;...&quot;,&quot;startedAt&quot;:&quot;2026-04-11T12:00:00Z&quot;}&#x27;<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs --read &quot;$TMP_JOURNAL&quot; &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>assert len(events) == 1 and events[0][&#x27;eventType&#x27;] == &#x27;session_start&#x27;, &#x27;CLI example did not emit session_start&#x27;<br>print(&#x27;PASS - command doc CLI example executed successfully&#x27;)<br>&quot;<br><br><br>grep -A 7 &quot;STOP_REASONS\&#124;SESSION_OUTCOMES\&#124;LEGAL_STOP_GATES&quot; .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs<br><br><br>python3 - &lt;&lt;&#x27;PY&#x27;<br>from pathlib import Path<br>doc = Path(&quot;.opencode/commands/deep/agent-improvement.md&quot;).read_text()<br>script = Path(&quot;.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs&quot;).read_text()<br>required_stop = [<br>    &quot;converged&quot;,<br>    &quot;maxIterationsReached&quot;,<br>    &quot;blockedStop&quot;,<br>    &quot;manualStop&quot;,<br>    &quot;error&quot;,<br>    &quot;stuckRecovery&quot;,<br>]<br>required_outcomes = [<br>    &quot;keptBaseline&quot;,<br>    &quot;promoted&quot;,<br>    &quot;rolledBack&quot;,<br>    &quot;advisoryOnly&quot;,<br>]<br>required_gates = [&quot;contractGate&quot;, &quot;behaviorGate&quot;, &quot;integrationGate&quot;, &quot;evidenceGate&quot;, &quot;improvementGate&quot;]<br>for token in required_stop + required_outcomes:<br>    assert token in doc, f&quot;Missing enum token in command doc: {token}&quot;<br>    assert token in script, f&quot;Missing enum token in helper: {token}&quot;<br>for token in required_gates:<br>    assert token in script, f&quot;Missing legal-stop gate token in helper: {token}&quot;<br>print(&quot;PASS - command doc taxonomy and legal-stop gates match improvement-journal.cjs enums&quot;)<br>PY<br><br><br>rm -rf &quot;$TMP_SPEC&quot; | `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml` contains `improvement-journal.cjs` emission steps for:; `session_start` before the first loop iteration; `candidate_generated`, `candidate_scored`, `benchmark_completed`, nested `legal_stop_evaluated.details.gateResults`, and `gate_evaluation`/stop checks inside each iteration; `session_end` after synthesis completes; The CLI example from `.opencode/commands/deep/agent-improvement.md` executes successfully against a temp journal target with exit code `0`; `improvement-journal.cjs` exports frozen `STOP_REASONS`, `SESSION_OUTCOMES`, and legal-stop gate names; `validateEvent()` accepts only those enum members for `session_end` / `session_ended`; The command doc taxonomy in `agent.md` matches the helper's internal validator and does not drift | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The autonomous YAML contains journal emission coverage for session start, per-iteration lifecycle checkpoints, nested legal-stop, benchmark completion, and session end; the CLI example from `.opencode/commands/deep/agent-improvement.md` runs successfully as written against a temp journal path; and the stop-reason / session-outcome enums in the command doc match the frozen values enforced by `improvement-journal.cjs`. | If any boundary is missing from the YAML: add or restore the missing `step_emit_journal_event*` command in `deep_agent-improvement_auto.yaml`<br>If the CLI example exits non-zero: copy the exact example from `.opencode/commands/deep/agent-improvement.md` and reconcile the helper CLI contract (`--emit`, `--journal`, `--details`)<br>If `legal_stop_evaluated` validation fails: confirm `details.gateResults` includes all five gate keys<br>If `session_end` is emitted but validation fails: compare the emitted `details.stopReason` / `details.sessionOutcome` values against the frozen enums in `improvement-journal.cjs`<br>If the doc taxonomy drifts from the helper: update the command doc and helper together so the runtime contract stays frozen |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md:68:|   +-- benchmark-stability.cjs            # Score variance and weight advisory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md:80:| `maxScoreExecutions` | number | Cumulative cap on `score-candidate.cjs` executions for the whole session — counts the primary score plus both uncached stability replays (default: 15, i.e. `maxIterations` x 3 executions/iteration) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/legal_stop_gate_bundle.md:11:> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-035-sandbox/`. The fixture has insufficient benchmark replay evidence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/legal_stop_gate_bundle.md:15:The fixture has good-looking structure but insufficient benchmark replay. The disciplined path must emit a complete `legal_stop_evaluated` bundle and block convergence when `evidenceGate` fails.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md:27:Both deep-improvement YAML workflows call `score-candidate.cjs` after a candidate is written, then emit `candidate_scored`, record mutation coverage and dimension trajectory, run replay-stability and trade-off helpers, append packet evidence, and refresh the runtime state with `reduce-state.cjs`. Those steps are explicit shell commands in the YAML files, so the scoring path is not inferred from prose alone.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md:40:| `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml` | Workflow | Mirrors the dispatch sequence in interactive mode and pauses at review gates. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md:43:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs` | Stability helper | Measures replay stability and emits `insufficientSample` until enough replays exist. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md:51:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts` | Automated test | Verifies replay-stability thresholds, warnings, and insufficient-sample handling. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md:1:This release lands the deep-improvement portion of the packets 108 plus 110 auto-review uplift program. One reusable teaching from the upstream `dzianisv/opencode-plugins` auto-review package now applies to the mutation-coverage pipeline: a signature-based dedup that prevents the same mutation from being proposed twice across iterations of the same improvement arc. The signature is stored alongside each mutation in `mutation-coverage.json`. The council was explicit in section 10.6 that the authoritative storage IS `mutation-coverage.json`, NOT `agent-improvement-state.jsonl`, so the replay consumer and the coverage reducer share one source of truth. Every mechanism cleared a 5-of-5 unanimous deep-ai-council review by `cli-codex gpt-5.5 xhigh fast` before any code shipped.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md:17:The naive port would have stored signatures in `agent-improvement-state.jsonl`. The council's section 10.6 review rejected that path because the JSONL state file is event-sourced and append-only, which means dedup queries would have to scan the entire history on every proposal. The signatures live on each mutation entry in `mutation-coverage.json`, which is the reducer's canonical output and is sized to the actual mutation count rather than the iteration count. The replay consumer and the reducer now read signatures from the same place.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md:41:Packet 110 ran through a 5-seat deep-ai-council deliberation before any source change. The council returned REQUEST-CHANGES on the first pass with HIGH confidence and reshaped scope on the storage decision. The original draft proposed `agent-improvement-state.jsonl` as the signature store; the council's section 10.6 ruled that storage had to live on the mutation entry in `mutation-coverage.json` so the replay consumer and reducer share one source of truth. The skip-reason format and the env-var bypass also surfaced from the council deliberation rather than from the original packet draft. Implementation followed via `cli-opencode + deepseek-v4-pro --pure`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md:50:| Replay-consumer coverage | implicit | explicit |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md:52:A new manual playbook scenario at `manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` verifies that the replay consumer respects signature dedup. The scenario covers the happy path (signature match skips), the legacy path (missing signature falls through to equality), and the bypass path (`DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` re-enables the proposal).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md:71:| `.opencode/skills/deep-loop-workflows/deep-improvement/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` | New manual playbook scenario verifying that the replay consumer respects signature dedup. Touched in b29640496. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/dimension_trajectory.md:23:- Objective: Validate Dimension Trajectory and Convergence Eligibility for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.1.0.md:13:- **Resume/continuation expected behavior retracted to match reality** -- The skill's runtime-truth section and the `/deep:agent-improvement` command definition both listed `resume`, `restart`, `fork`, and `completed-continue` as supported lifecycle modes for evaluating an agent across multiple sessions. The shipped workflow has no inputs for any of them, the reducer does not produce ancestry output, and the journal helper has no boundary event for a multi-session run history. The only thing the runtime actually supports is `new` - every `/deep:agent-improvement` invocation starts a fresh session with generation 1. The documentation now says so explicitly. Operators who want to continue an evaluation should archive the prior `improve/` folder under a timestamped path and re-invoke the command. A future release that ships real multi-session run history will arrive with first-class event emission, reducer ancestry output, and replay coverage; until then, treat every invocation as a standalone evaluation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:1:deep-improvement gained a first-class model-benchmark mode and, on top of it, became a genuine two-lane skill end to end: Lane A (improve an agent file) and Lane B (benchmark a model or prompt framework) are now co-equal at the command, doc, agent, and on-disk layers. The capability was built from a designed mode-selector + pluggable seams, then hardened by two independent deep-review -> remediation cycles (gpt-5.5 and Opus 4.8) before Lane B shipped.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:17:- **Mode-aware state records:** loop state now carries a `mode` field so a benchmark run reaches `benchmark-complete` and is distinguishable from agent-improvement runs in the journal and registry.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:29:- **Closed the actionable P2 advisories** in the same pass: Atomics-based backoff replacing the busy-wait, a grader-cache raw-input gate, dependency-injected `fs` in `dispute.cjs` (removing a global monkey-patch), a deterministic-scoring regression test, delta-units documentation, and a reconciled REQ-004 `--cwd` wording. The two non-defects (intended deferral, dedup artifact) were recorded as no-change with rationale.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:40:- **New dedicated `/deep:model-benchmark` command** plus two Lane B workflow YAMLs (`deep_model-benchmark_{auto,confirm}.yaml`) that run `loop-host.cjs --mode=model-benchmark`, reduce, journal, and offer mode-aware promotion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:41:- **Advisor registration:** a `deep-model-benchmark` alias group plus bounded command-level disambiguation so benchmark phrasing routes to the new command rather than the Lane A one.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:54:- **The `@deep-improvement` awareness note went from "Mode awareness" to "Lane awareness"** across all 4 runtime mirrors, byte-identical (mirror-drift 0). The note makes clear there is one agent and Lane B dispatches models through `dispatch-model.cjs`, never a second Claude agent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:80:This release covers the entire 121 program. Arc 1 designed (001), deep-researched (002), built (003), and hardened (007 review -> 004 remediation) the model-benchmark mode, then added the opt-in 5-dim scorer + docs (005) and a maintenance fix (006). Arc 2 elevated model-benchmark from a "Mode 4" bolt-on to a lane co-equal with agent-improvement across command (008), SKILL.md (009), references/assets (010), the agent note (011), catalog/playbook/advisor (012), and scripts (013), then hardened it with two independent deep-review -> remediation cycles — gpt-5.5 (014 -> 015) and Opus 4.8 (017 -> 018) — plus per-subfolder code READMEs (016). The tri-model hardening review of Arc 1 was originally scaffolded as separate packet 122 and folded into 121 as phase 007 on 2026-05-29; that is why remediation phase 004 carries a lower number than the review it remediates (007). Each phase ran as an agentic workflow with an independent verification pass.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:86:- Advisor routes benchmark phrasing to `deep-model-benchmark` and agent phrasing to agent-improvement.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/candidate_generation.md:29:The YAML workflows own when candidate generation happens. Autonomous mode runs the proposal step whenever the loop continues, while confirm mode adds an approval gate before dispatching the candidate writer. The packet-local boundary is strict in the shipped agent: canonical targets and runtime mirrors are explicit never-edit surfaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:267:    typeof statePayload.replayCount !== 'number' ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:275:    replayCount: statePayload.replayCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:503:function deriveReplayCountFromDimensions(dimensions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:551:  const replayCount = isFiniteNumber(value.replayCount)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:552:    ? value.replayCount
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:553:    : deriveReplayCountFromDimensions(value.dimensions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:557:  const isInsufficientSample = value.state === 'insufficientSample' && replayCount !== null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:561:      replayCount: replayCount === null ? null : replayCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:584:    replayCount: latestSummary?.replayCount ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:1179:| replayCount | ${formatDashboardValue(sampleQuality.replayCount)} |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:1320:  const replayConsumerSections = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:1349:${replayConsumerSections}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/resume_continuation.md:23:- Objective: Validate Fresh-Session Continuation After Archive for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/resume_continuation.md:46:| RT-024 | Fresh-Session Continuation After Archive | Validate Fresh-Session Continuation After Archive | `Validate that new-mode continuation archives the previous run and starts a fresh session.` | Step 1 -- Run the initial session (2 iterations):<br><br><br>/deep:agent-improvement &quot;.opencode/agents/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Step 2 -- Archive the previous session folder:<br><br><br>ARCHIVE_ROOT=&quot;{spec}/improvement_archive/$(date +%Y%m%d-%H%M%S)&quot;<br>mkdir -p &quot;{spec}/improvement_archive&quot;<br>mv &quot;{spec}/improvement&quot; &quot;$ARCHIVE_ROOT&quot;<br><br><br>Step 3 -- Start a fresh session against the same target:<br><br><br>/deep:agent-improvement &quot;.opencode/agents/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>starts = [e for e in events if e[&#x27;eventType&#x27;] == &#x27;session_start&#x27;]<br>assert len(starts) &gt;= 1, f&#x27;Expected at least 1 session_start event in the fresh session, got {len(starts)}&#x27;<br>details = starts[0].get(&#x27;details&#x27;, {})<br>assert details.get(&#x27;lineageMode&#x27;, &#x27;new&#x27;) == &#x27;new&#x27;, f&quot;Expected lineageMode new, got {details.get(&#x27;lineageMode&#x27;)}&quot;<br>assert details.get(&#x27;generation&#x27;, 1) == 1, f&quot;Expected generation 1, got {details.get(&#x27;generation&#x27;)}&quot;<br>print(&#x27;PASS - fresh session starts in new mode after archive&#x27;)<br>&quot; | The archived `improvement/` directory is preserved under `improvement_archive/` before the next run begins; The fresh run creates a new `improvement/` directory instead of reusing the archived one; The fresh session starts in `new` mode with a new session id and generation `1`; Iteration numbering restarts from `1` in the fresh session journal; No unsupported lineage flags or multi-generation session behaviors are required or documented as shipped | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | After archiving the prior runtime folder and starting a fresh session, the repository preserves the old evidence separately, the new session journal starts in `new` mode with generation `1`, and the fresh run begins again at iteration `1` without claiming unshipped continuation semantics. | If the archive step fails: verify the spec folder path is correct and `improvement/` exists before moving it<br>If the fresh run reuses the archived directory: inspect the init phase to confirm it always creates a new runtime folder<br>If lineage metadata is not `new` / generation `1`: compare the emitted `session_start` details against the current-release session model in `SKILL.md`<br>If docs still mention unsupported lineage flags or multi-generation continuation modes: remove the stale wording from the playbook and command examples |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/plateau_detection.md:21:This feature covers the stop logic spread across the reducer, mutation-coverage graph, replay-stability helper, and trade-off detector.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/plateau_detection.md:42:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs` | Stability helper | Measures replay variance and refuses verdicts until the minimum replay count is met. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md:22:- `promote-candidate.cjs` and `reduce-state.cjs` are mode-aware: they read a `mode` field on records and attribute missing or unknown modes to `agent-improvement`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md:60:+-- promote-candidate.cjs               # Mode-aware guarded canonical promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:9:- `SKILL.md` adds a new "Journal Wiring Contract" section documenting the three boundary points, the frozen `STOP_REASONS` / `SESSION_OUTCOMES` enums (aligned to the helper's actual validator: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery` / `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`), and the orchestrator-only emission rule.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:16:- `benchmark-stability.cjs` now requires `minReplayCount` (default: 3). Below threshold, returns `{state: "insufficientSample", replayCount: n, minRequired: 3}` and treats that state as "not stable" in the is stable helper. Exports `MIN_REPLAY_COUNT_DEFAULT = 3`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:21:#### ADR-002 Replay Consumer Implementation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:23:- **ADR-002 Option A accepted: implement replay consumers** (rather than downgrading docs to ledger-only reality).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:35:- Reducer dashboard gains a new **Sample Quality** section that renders `replayCount`, `stabilityCoefficient`, `insufficientSampleIterations` count, and `insufficientDataIterations` count as distinct fields, separate from generic benchmark failure counters. Operators can now distinguish "real regression" from "not enough samples to decide".
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:42:- New fixture: `scripts/tests/fixtures/low-sample-benchmark/` - a candidate session with 1 replay + 2-point trade-off trajectory + complete journal/run history/coverage artifacts. Validates that helper smoke tests return `{state: "insufficientSample", replayCount: 1, minRequired: 3}` and `{state: "insufficientData", dataPoints: 2, minRequired: 3}` as expected.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:46:- `034-replay-consumer.md` - verify ADR-002 consumer path + graceful degradation on missing artifacts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:65:| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/benchmark-stability.cjs` | Modified | minReplayCount=3 default, insufficientSample state, MIN_REPLAY_COUNT_DEFAULT export |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:66:| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/reduce-state.cjs` | Modified | ADR-002 replay consumer (journal + lineage + coverage reads); insufficient-state propagation; Sample Quality dashboard section |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:72:| `.opencode/skills/deep-loop-workflows/deep-improvement/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` | Created | Manual test for ADR-002 replay consumer + graceful degradation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md:81:**Backward-compatible.** Existing sessions without the three new replay artifacts (journal, lineage, mutation-coverage) still work - the reducer defaults each consumer field to `null` when the artifact is absent. The `trade-off-detector` and `benchmark-stability` default thresholds (3 data points / 3 replays) are enforced on new sessions but can be overridden via `minDataPoints` / `minReplayCount` constructor options or env variables for legacy replay flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.4.0.0.md:17:- Advisor scoring tables: skill advisor routing and scoring references target the new skill name.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md:26:The reducer read replay artifacts into the registry but dropped them from the dashboard. Operators had no visibility. Added dedicated dashboard sections for journal summary, candidate run history, and mutation coverage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md:62:The confirm-mode session gate was advisory only - no `verify`/`on_fail` enforcement. Confirm mode now mirrors the auto workflow's structured halt pattern.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md:78:#### Replay-consumer playbook corrected
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md:80:`034-replay-consumer.md` now describes journal, run history, and coverage as registry-only outputs (not dashboard sections that don't exist yet - they now do after this release).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md:17:This scenario validates that low-sample guards propagate `insufficientData` and `insufficientSample` states from the helpers into the reducer registry and the dashboard's Sample Quality reporting. Given: a session fixture with only 2 trade-off trajectory points and 1 benchmark replay at `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/` once T050 lands. When: the operator runs `trade-off-detector.cjs`, `benchmark-stability.cjs`, and `reduce-state.cjs` against that low-sample runtime. Then: the helper states remain distinct, the reducer records `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard surfaces low-sample messaging instead of collapsing both cases into a generic failure.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md:23:- Objective: Validate Insufficient Sample Propagation for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md:24:- Real user request: `` Validate that low-sample guards propagate `insufficientData` and `insufficientSample` states from the helpers into the reducer registry and the dashboard's Sample Quality reporting. Given: a session fixture with only 2 trade-off trajectory points and 1 benchmark replay at `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/` once T050 lands. When: the operator runs `trade-off-detector.cjs`, `benchmark-stability.cjs`, and `reduce-state.cjs` against that low-sample runtime. Then: the helper states remain distinct, the reducer records `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard surfaces low-sample messaging instead of collapsing both cases into a generic failure. ``
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md:27:- Expected signals: `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory; `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays; `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome; `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`; `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed; No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md:29:- Pass/fail: The low-sample fixture produces `insufficientData` from `trade-off-detector.cjs`, `insufficientSample` from `benchmark-stability.cjs`, the reducer registry records both `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard's Sample Quality section exposes those states clearly enough that the operator can distinguish low trajectory coverage from low replay coverage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md:46:| RT-030 | Insufficient Sample Propagation | Validate Insufficient Sample Propagation | `Validate that low-sample guards propagate into reducer registry and dashboard Sample Quality output.` | Run the low-sample fixture through trade-off detection, benchmark stability, and the reducer once T050 lands.<br><br><br>Verification:<br><br><br>FIXTURE=.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark<br>TRAJECTORY_JSON=&quot;$(rg --files &quot;$FIXTURE&quot; &#124; rg &#x27;trajectory&#x27; &#124; head -n 1)&quot;<br>REPLAYS_JSON=&quot;$(rg --files &quot;$FIXTURE&quot; &#124; rg &#x27;replay&#124;benchmark&#x27; &#124; head -n 1)&quot;<br><br><br>test -n &quot;$TRAJECTORY_JSON&quot;<br>test -n &quot;$REPLAYS_JSON&quot;<br><br><br>TRAJECTORY_JSON=&quot;$TRAJECTORY_JSON&quot; node -e &quot;<br>const fs = require(&#x27;node:fs&#x27;);<br>const td = require(&#x27;./.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs&#x27;);<br>const trajectory = JSON.parse(fs.readFileSync(process.env.TRAJECTORY_JSON, &#x27;utf8&#x27;));<br>const result = td.detectTradeOffs(trajectory);<br>console.assert(result.state === &#x27;insufficientData&#x27;, &#x27;Expected insufficientData state&#x27;);<br>console.assert(result.dataPoints === 2, &#x27;Expected 2 trajectory points&#x27;);<br>console.assert(result.minRequired === 3, &#x27;Expected minRequired=3&#x27;);<br>console.log(&#x27;PASS - trade-off-detector insufficientData:&#x27;, JSON.stringify(result));<br>&quot;<br><br><br>REPLAYS_JSON=&quot;$REPLAYS_JSON&quot; node -e &quot;<br>const fs = require(&#x27;node:fs&#x27;);<br>const bs = require(&#x27;./.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs&#x27;);<br>const replays = JSON.parse(fs.readFileSync(process.env.REPLAYS_JSON, &#x27;utf8&#x27;));<br>const result = bs.measureStability(replays);<br>console.assert(result.state === &#x27;insufficientSample&#x27;, &#x27;Expected insufficientSample state&#x27;);<br>console.assert(result.replayCount === 1, &#x27;Expected replayCount=1&#x27;);<br>console.assert(result.minRequired === 3, &#x27;Expected minRequired=3&#x27;);<br>console.log(&#x27;PASS - benchmark-stability insufficientSample:&#x27;, JSON.stringify(result));<br>&quot;<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs &quot;$FIXTURE&quot;<br><br><br>grep -n &quot;insufficientDataIterations\&#124;insufficientSampleIterations&quot; &quot;$FIXTURE/experiment-registry.json&quot;<br>grep -n &quot;## Sample Quality\&#124;insufficientSampleIterations\&#124;insufficientDataIterations\&#124;insufficient&quot; &quot;$FIXTURE/agent-improvement-dashboard.md&quot;<br><br><br>cat &quot;$FIXTURE/experiment-registry.json&quot; &#124; jq &#x27;.insufficientDataIterations, .insufficientSampleIterations&#x27; | `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory; `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays; `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome; `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`; `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed; No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The low-sample fixture produces `insufficientData` from `trade-off-detector.cjs`, `insufficientSample` from `benchmark-stability.cjs`, the reducer registry records both `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard's Sample Quality section exposes those states clearly enough that the operator can distinguish low trajectory coverage from low replay coverage. | If the fixture path is missing: confirm T050 landed and the low-sample runtime exists under `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/`<br>If `trade-off-detector.cjs` returns an array instead of `insufficientData`: check `MIN_DATA_POINTS_DEFAULT` / `minDataPoints` wiring and verify the fixture only has 2 trajectory entries<br>If `benchmark-stability.cjs` returns a generic instability result: verify `minReplayCount` is set to `3` and the fixture exposes only 1 replay<br>If reducer fields are absent: inspect `reduce-state.cjs` for `extractInsufficientDataIteration()` and `extractInsufficientSampleIteration()` wiring<br>If the dashboard hides which gate failed: update Sample Quality rendering so insufficient data points and insufficient replay count surface as separate operator-facing signals |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.0.0.md:31:The `scan-integration.cjs` script discovers every surface an agent touches across the repo: main definition, 3 runtime mirrors (Claude, Codex, .agents), command dispatch references, YAML workflow references, skill mentions, global doc references, and skill advisor routing entries. Mirror sync is detected by signal-string matching against the main body.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/initialization.md:41:| `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml` | Workflow | Mirrors the init path in interactive mode and adds approval gates before baseline recording. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md:93:**Note:** Repeatability is advisory only in current release. `benchmark-stability.cjs` emits recommendations but does not auto-apply them (ADR-005).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md:148:6. If any gate fails, abort with specific failure mode and emit `promotion_blocked_branch_preserved` when an event log is configured
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md:1:Self-test, bug fixes, reducer improvements, and skill advisor routing sync for `deep-improvement`. Phase 009 ran the improvement loop on the agent-improver's own definition and found a real bug (stale command path). Phase 010 fixed that bug plus 4 reducer issues and promoted the best candidate improvements. Phase 011 updated the skill advisor routing and README documentation. The goal is to make the workflow easier to follow and easier to trust.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md:17:- **Skill advisor routing** (Phase 011): Added 7 INTENT_BOOSTERS, 13 PHRASE_INTENT_BOOSTERS, 8 COMMAND_BRIDGES for 5D scoring, integration scanning, dynamic profiling, and all `/deep:` + `/create:` slash commands.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md:33:| `.opencode/skills/scripts/skill_advisor.py` | Modified | Phase 008+ routing entries + COMMAND_BRIDGES |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:78:      const defaultPlan = loopHost.planInvocation(loopHost.resolveMode(defaultArgs.mode as string | undefined), defaultArgs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:81:      const explicitPlan = loopHost.planInvocation(loopHost.resolveMode(explicitArgs.mode as string | undefined), explicitArgs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:94:    it('an unknown mode also plans the identical agent-improvement invocation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/parallel_candidates_opt_in.md:23:- Objective: Validate Parallel Candidates Opt-In Default for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/parallel_candidates_opt_in.md:46:| RT-028 | Parallel Candidates Opt-In Default | Validate Parallel Candidates Opt-In Default | `Validate that default settings keep parallelWaves.enabled false and run sequential candidates only.` | # Verify default config<br>node -e &quot;<br>const config = require(&#x27;./.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json&#x27;);<br>console.log(&#x27;parallelWaves config:&#x27;, JSON.stringify(config.parallelWaves, null, 2));<br>&quot;<br><br><br>Then run an improvement session with default settings:<br><br><br>/deep:agent-improvement &quot;.opencode/agents/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br># Step 1: Verify config default<br>node -e &quot;<br>const config = require(&#x27;./.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json&#x27;);<br>console.assert(config.parallelWaves.enabled === false, &#x27;parallelWaves should be disabled by default&#x27;);<br>console.log(&#x27;PASS - parallelWaves.enabled:&#x27;, config.parallelWaves.enabled);<br>&quot;<br><br><br># Step 2: After running improvement session, verify no parallel candidates<br>node -e &quot;<br>const cl = require(&#x27;./.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/candidate-lineage.cjs&#x27;);<br>const lineagePath = &#x27;{spec}/improvement/candidate-lineage.json&#x27;;<br>const fs = require(&#x27;fs&#x27;);<br>if (fs.existsSync(lineagePath)) {<br>  const graph = JSON.parse(fs.readFileSync(lineagePath, &#x27;utf8&#x27;));<br>  const nodes = graph.nodes &#124;&#124; [];<br>  const waveIndices = [...new Set(nodes.map(n =&gt; n.waveIndex))];<br>  console.assert(waveIndices.length &lt;= 1, &#x27;Should have at most 1 wave index in single-wave mode&#x27;);<br>  console.assert(waveIndices.every(w =&gt; w === 0 &#124;&#124; w === undefined), &#x27;All wave indices should be 0 or undefined&#x27;);<br>  console.log(&#x27;PASS - wave indices:&#x27;, waveIndices, &#x27;, nodes:&#x27;, nodes.length);<br>} else {<br>  console.log(&#x27;PASS - no lineage file created (expected for single-wave mode)&#x27;);<br>}<br>&quot; | `improvement_config.json` has `parallelWaves.enabled: false` by default; `parallelWaves.maxCandidates: 3` (configured but not active); During an improvement session with defaults: only one candidate is generated per iteration; Candidate lineage (if tracked) shows all nodes with `waveIndex: 0` (single-wave); No parallel mutation spawning occurs regardless of exploration-breadth score; The activation conditions (exploration-breadth threshold, 3+ unresolved mutation families, 2 consecutive ties) are never evaluated when `enabled: false` | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The default config has `parallelWaves.enabled: false`, and an improvement session running with default settings generates exactly one candidate per iteration with no parallel wave behavior -- verified by the absence of multi-wave lineage entries and single-candidate-per-iteration flow. | If `parallelWaves.enabled` is true: the default config has been changed; revert to `false`<br>If multiple candidates appear per iteration: check whether the orchestrator respects the `parallelWaves.enabled` gate before spawning parallel candidates<br>If wave indices are &gt; 0: verify that single-wave mode assigns `waveIndex: 0` (or omits it)<br>If parallel spawning occurs despite `enabled: false`: check for a code path that bypasses the config gate |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:2:title: "Router replay and advisor probe"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:3:description: "Replays the target skill's own substring router for in-skill routing and resource discovery (Mode A, deterministic, the CI gate), and runs an opt-in deterministic advisor probe out-of-band for inter-skill selection."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:5:  - "router replay and advisor probe"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:6:  - "router-replay.cjs"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:7:  - "replay skill router"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:8:  - "advisor probe inter-skill"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:13:# Router replay and advisor probe
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:19:Mode A routing is reproduced deterministically. `router-replay.cjs` parses the target skill's own `INTENT_SIGNALS` and `RESOURCE_MAP` and re-runs its substring matching to produce the D1-intra (intent) and D2 (resource discovery) signals. `advisor-probe.cjs` separately shells out to the standalone Python skill-advisor to capture the D1-inter (inter-skill selection) signal; this probe is opt-in (`--advisor-mode=python`) and is also deterministic because the advisor reads a compiled SQLite graph, not an LLM.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:25:`scripts/skill-benchmark/router-replay.cjs` is a pure function of `(skillRoot, taskText)` with no LLM. `extractDictBody(text, name)` finds `NAME = {` and returns the brace-balanced body. `parseIntentSignals` builds `{ KEY: { weight, keywords } }` from the `INTENT_SIGNALS` block (keywords lowercased); `parseResourceMap` builds `{ KEY: [paths] }` from `RESOURCE_MAP`; `parseDefaultResource` reads `DEFAULT_RESOURCE`. `parseRouter` combines these and sets `parseable` true when either map is non-empty. `scoreIntents` lowercases the task and sums each intent's `weight` for every keyword that is a substring of the task; `selectIntents` keeps every intent within `AMBIGUITY_DELTA = 1` of the top score. `routeSkillResources` returns `{ parseable, intents, resources, missingResources, scores }`, where `resources` is the union of `DEFAULT_RESOURCE` plus `RESOURCE_MAP[intent]` for selected intents, and `missingResources` are routed paths absent on disk. When the router is unparseable it returns `parseable:false` with empty arrays. The module exports `routeSkillResources`, `parseRouter`, `scoreIntents`, and `selectIntents`; `contamination-lint.cjs` and `d5-connectivity.cjs` reuse `parseRouter`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:27:`scripts/skill-benchmark/advisor-probe.cjs` provides the D1-inter signal and is opt-in. `probeAdvisor({ prompt, advisorPy, timeoutMs })` runs `spawnSync('python3', [skill_advisor.py, prompt], { timeout: 60000, maxBuffer: 8MB })` against `DEFAULT_ADVISOR_PY = .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`. On non-zero exit or empty stdout it returns `{ ok: false, recommendations: [], topSkill: null, error }`; on unparseable JSON it returns `ok:false` with an error; otherwise it maps the parsed array to `{ skill, confidence }` records and returns `{ ok: true, recommendations, topSkill }`. `scoreD1Inter({ advisorResult, expectedSkillId, negative })` rank-weights the target's position in the recommendations: rank 1 = 1.0, rank ≤ 3 = 0.75, rank ≤ 5 = 0.5, else 0; a failed/`ok:false` probe yields `score:null`; negative-activation scenarios invert (target absent or rank > 5 scores 1, otherwise 0). The orchestrator calls `probeAdvisor` per scenario only when `--advisor-mode=python`; with the probe off, D1-inter is reported `unscored-mode-a`. (Internal detail: `score-skill-benchmark.cjs` imports `scoreD1Inter` from this module to fold the probe result into the scenario score.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:37:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Routing | Deterministic Mode A replay of the skill's own `INTENT_SIGNALS` / `RESOURCE_MAP` substring routing; emits D1-intra + D2 signals via `routeSkillResources`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:38:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` | Discovery probe | Opt-in, read-only `skill_advisor.py` probe (`probeAdvisor`) + rank-weighted `scoreD1Inter` for D1-inter. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:44:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts `routeSkillResources` routes a REVIEW prompt on `cli-opencode` to expected resources, `selectIntents` keeps near-tied intents, an unparseable router returns `parseable:false`, `scoreD1Inter` rank-weighting (1.0 / 0.75 / 0 / null) and negative-scenario inversion, and that `probeAdvisor` returns a ranked list deterministically. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md:52:- Feature file path: `skill-benchmark/router-replay-and-advisor-probe.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:1:deep-improvement is now a genuine **three-lane** skill: this release brings Lane C (skill-benchmark) to release status by completing the live half of it. Lane C already had a deterministic router-replay benchmark (Mode A, built under packet 122); v1.10.0.0 adds the prerequisite that made a real skill benchmarkable (router-benchmarkability) and the "Mode B" that benchmarks a skill against its OWN `manual_testing_playbook` executed live through `cli-opencode` — the way the skill is actually used, not a synthetic replay. It also relocates the script test suites to live lane-locally beside the code they cover.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:11:- **Machine-readable router for `sk-code`.** Lane C's Mode A needs an `INTENT_SIGNALS` + `RESOURCE_MAP` router to replay. `sk-code` keeps its router in a referenced doc (`references/smart_routing.md`), not inline in `SKILL.md`, so the benchmark couldn't read it. Added a machine-readable router block (DEFAULT_RESOURCE + 14 intents + a RESOURCE_MAP covering every routable content file) to `smart_routing.md`, with a drift-guard regression test that fails if any mapped path goes missing on disk or any routable doc stops being covered.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:12:- **Harness now follows a referenced router.** `router-replay.cjs` `parseRouter()` resolves a skill's router doc when the dictionaries are not inline in `SKILL.md` (`findReferencedRouterDoc`), and stamps the `routerSource`. `d5-connectivity.cjs` and `contamination-lint.cjs` thread the `skillRoot` through so the reference-following resolves correctly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:13:- **`DEFAULT_RESOURCE` is now a list.** The replay parser, the route builder, and the D5 connectivity coverage check accept a list of always-loaded resources (string form still supported), so a skill's routing preamble — the docs consulted on every route, not mapped to one intent — is modeled honestly and counts as covered rather than orphaned.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:14:- **sk-code router tuned from its own benchmark.** sk-code always detects stack, detects phase, and consults the router before code work, so those three docs moved into `DEFAULT_RESOURCE` (clearing three orphan references and lifting D5 to 100), and the language-standards / config intents gained file-extension signals (`.ts`/`.py`/`.sh`/`.json` …) matching how sk-code routes by target path — not by copying benchmark scenario text. Router-mode aggregate 31 → 40, D2 29 → 44, routed-intra failures 12 → 5; the residual failures are the documented surface-flattening replay artifacts that live mode resolves.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:16:### Lane C "Mode B" — live playbook benchmarking (phase 010)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:18:- **The playbook is the corpus.** `load-playbook-scenarios.cjs` parses a skill's `manual_testing_playbook/` into normalized gold scenarios, tagged `routing` / `advisor` / `browser` (sk-code → 24 scenarios). Gold is captured as authored, which surfaces router↔gold drift.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:22:- **D4 usefulness ablation (approximate).** `d4-ablation.cjs` grades skill-on vs skill-off (`MK_SKILL_ADVISOR_HOOK_DISABLED=1` + a "don't read the skill" preamble, verified by `observedReads==0`) via the existing `gradeD4` grader; attribution is stamped `approximate` by design.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:35:- **Live surface mismatch fails routing.** A live result whose observed surface disagrees with the scenario's expected surface now caps D1-intra below the pass line and reports a `surface-mismatch` funnel stage, instead of passing on incidental resource overlap. Router mode (no observed surface) is unaffected.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:43:Phase `009` (router-benchmarkability) made `sk-code` measurable and fixed the harness to follow a referenced router; phase `010` (live playbook mode) realized the "Mode B" that `122/002-implementation-deep-research` had scoped as a deferred follow-on. Both were built and verified this cycle, then consolidated into the 122 phase parent. The 010 build ran plan-mode research (explore + plan agents + sequential thinking) → a deterministic spine first (CI-safe) → a live spike to retire the schema/ablation/browser unknowns → the live executor against the confirmed schema. The test lane-org followed as a file-organization pass.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md:48:- Live Mode B confirmed against `openai/gpt-5.5-fast --variant high` (aggregate 76; all scenarios parsed; `CS-001` routed to the correct surface live where router-replay was wrong). `xhigh` was found to time out (>4 min/dispatch) — use `high`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/full_pipeline.md:46:| E2E-017 | Full Pipeline Loop with Debug Target | Validate Full Pipeline Loop with Debug Target | `Validate the full /deep:agent-improvement loop against the debug agent.` | /deep:agent-improvement &quot;.opencode/agents/debug.md&quot; :confirm --spec-folder=<spec-folder> --iterations=1 | Init phase creates `improvement/` directory with config, charter, strategy, and manifest; Integration scan runs and produces `integration-report.json`; Candidate generated under `improvement/candidates/`; Score output produced via dynamic-mode 5-dimension scoring; Dashboard generated at `improvement/agent-improvement-dashboard.md`; Loop completes 1 iteration without errors | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | All runtime artifacts present after 1 iteration (`improvement/` directory with config, charter, strategy, manifest, candidates, integration report, and dashboard), no errors in console output. | If the pipeline stalls at a specific stage: run that stage&#x27;s individual test (from its category folder) to isolate the failure<br>If `improvement/` directory is not created: check the init phase logic and spec folder path resolution<br>If integration scan fails: verify that `debug.md` is resolvable at the given path and the scanner can discover its surfaces<br>If the command is not recognized: verify the skill is registered in `skill_advisor.py` and the command definition exists |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.1.0.0.md:18:- A CLI entrypoint (`node .../improvement-journal.cjs --emit <event-json> | --read <session>`) allows replay tools and tests to consume the journal directly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.1.0.0.md:66:| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/tests/improvement-journal.vitest.ts`                                           | Created  | Vitest coverage for journal append/replay and enum validation                                 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.3.0.0.md:3:> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/008-deep-skill-feature-catalogs/` (Level 3)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.3.0.0.md:17:- Scoring system: 5-dimension rubric, score aggregation, margin computation, threshold gates, deterministic replay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/legal_stop_gates.md:23:- Objective: Validate Legal-Stop Gate Blocking for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:196:    it('rejects scoreExecution once the cumulative cap (default 15 = 5 iterations x 3 replays) would be exceeded', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:205:    it('rejects a batched replay request (requested=2) that would push the cumulative count past the cap', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:207:      // 4 full iterations of 3 + this iteration's primary), replays ask for 2 more
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:223:    it('allows a batched replay request (requested=2) that lands exactly on the cap', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:250:        const replayCheck = checker.checkDispatchCap({ journalPath, config, operation: 'scoreExecution', requested: 2 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:251:        expect(replayCheck.allowed).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:294:    it('honors --requested for the batched replay check via the CLI', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:17:Full detail behind the SKILL.md quick summary of session termination, journal emission, gate bundles, and reducer replay for `deep-improvement`. Use it when wiring or auditing orchestrator-side journal calls, when a session's stop reason or outcome looks wrong, or when the reducer's replay-derived registry fields need explaining.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:25:Defines the exact contracts an orchestrator must honor when starting, running, and ending a deep-improvement session: which stop reasons and session outcomes are legal, how the append-only journal is emitted and replayed, which gate bundles must pass before `converged` can be claimed, and how mutation coverage, trajectory, trade-off, and lineage tracking behave.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:61:| `advisoryOnly` | Session completed for assessment only; no mutation attempted |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:95:- Operators invoking the helper manually must use the same boundary order so replay and reducer consumers see a consistent journal shape.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:103:For legal-stop replay, the reducer consumes `details.gateResults` from the latest `legal_stop_evaluated` event and surfaces it as `journalSummary.latestLegalStop.gateResults` in `experiment-registry.json` plus the dashboard's latest legal-stop table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:131:If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `deep_agent-improvement_{auto,confirm}.yaml`, reducer ancestry handling in `deep-improvement/scripts/shared/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:192:## 11. WEIGHT OPTIMIZER (Advisory Only)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:202:The reducer is the consumer for replay artifacts on refresh, rather than a separate orchestrator-only synthesis step. Every `scripts/shared/reduce-state.cjs` pass attempts to read:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:204:- `improvement-journal.jsonl` — to summarize last session boundaries, total replayed events, per-event counts, and terminal `stopReason` / `sessionOutcome`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:214:The dashboard also includes a dedicated **Sample Quality** section. This separates replay/stability sample sufficiency from benchmark failures so operators can tell the difference between a true regression and an iteration that simply lacked enough data for trade-off or replay-stability trust.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/dual_report_and_remediation.md:25:`scripts/skill-benchmark/build-report.cjs` exposes `renderReport(report)`, which builds the markdown directly from the report object: a `# Skill Benchmark Report — <targetSkill.id>` title; a "rendered from report.json (do not hand-edit)" line echoing `scoringMethod` and `traceMode`; a `**Verdict: <verdict>**` line with `aggregate <n>/100` when present and a capped-verdict warning when `gate.gateFailed`; a Dimension scores table (`dimLine` prints `<n>/100`, or `_<status>_` such as `unscored-mode-a` when `score` is null, and adds " (hard gate)" for D5); an "Unscored in this run" line from `unscoredDimensions`; a Funnel section listing each stage count plus the headline bottleneck; a Ranked bottlenecks table from the report's `bottlenecks` (severity / class / locus-or-stage / detail); a Scenarios table from `scenarioRows`; and a Methodology / caveats section. As a script (`require.main`), `main()` reads `--report` (the JSON) and optionally writes `--output`; the orchestrator instead calls `renderReport` in-process and writes the `.md` alongside the `.json`. The module exports only `renderReport`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dynamic_profiling.md:42:| `.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md` | Contract reference | Defines dynamic mode as the only scoring surface. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:2:title: "RT-031 -- Replay Consumer Artifact Verification"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:3:description: "Manual validation scenario for RT-031: Replay Consumer Artifact Verification."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:9:# RT-031 -- Replay Consumer Artifact Verification
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:17:This scenario validates ADR-002 Option A replay-consumer behavior: `reduce-state.cjs` reads `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json`, writes their summaries into the registry, and degrades gracefully when any one artifact is missing. Given: an improvement runtime where `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` are all present. When: the operator runs `reduce-state.cjs` and then repeats the run with one artifact removed at a time from a disposable runtime copy. Then: the registry contains `journalSummary`, `candidateLineage`, and `mutationCoverage`; and any missing artifact resolves to `null` without throwing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:23:- Objective: Validate Replay Consumer Artifact Verification for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:24:- Real user request: `` Validate that ADR-002 Option A replay-consumer behavior: `reduce-state.cjs` reads `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json`, writes their summaries into the registry, and degrades gracefully when any one artifact is missing. Given: an improvement runtime where `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` are all present. When: the operator runs `reduce-state.cjs` and then repeats the run with one artifact removed at a time from a disposable runtime copy. Then: the registry contains `journalSummary`, `candidateLineage`, and `mutationCoverage`; and any missing artifact resolves to `null` without throwing. ``
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:25:- Prompt: `Validate that reduce-state.cjs consumes replay artifacts and degrades gracefully when one is missing.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:29:- Pass/fail: With all three replay artifacts present, `reduce-state.cjs` populates `journalSummary`, `candidateLineage`, and `mutationCoverage` in the registry. When any one artifact is missing, the reducer completes successfully and sets only the corresponding field to `null` while preserving the others.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:46:| RT-031 | Replay Consumer Artifact Verification | Validate Replay Consumer Artifact Verification | `Validate that reduce-state.cjs consumes replay artifacts and degrades gracefully when one is missing.` | node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs {spec}/improvement<br><br><br>Verification:<br><br><br>RUNTIME_COPY=&quot;$(mktemp -d /tmp/deep-improvement-replay-XXXXXX)&quot;<br>cp -R &quot;{spec}/improvement/.&quot; &quot;$RUNTIME_COPY/&quot;<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs &quot;$RUNTIME_COPY&quot;<br><br><br>cat &quot;$RUNTIME_COPY/experiment-registry.json&quot; &#124; jq &#x27;.journalSummary, .candidateLineage, .mutationCoverage&#x27;<br><br><br>python3 - &lt;&lt;&#x27;PY&#x27; &quot;$RUNTIME_COPY/experiment-registry.json&quot;<br>import json, sys<br>registry = json.load(open(sys.argv[1], &#x27;r&#x27;, encoding=&#x27;utf-8&#x27;))<br>js = registry.get(&#x27;journalSummary&#x27;)<br>cl = registry.get(&#x27;candidateLineage&#x27;)<br>mc = registry.get(&#x27;mutationCoverage&#x27;)<br>assert js is not None, &#x27;journalSummary missing&#x27;<br>assert cl is not None, &#x27;candidateLineage missing&#x27;<br>assert mc is not None, &#x27;mutationCoverage missing&#x27;<br>required_js = [&#x27;lastSessionStart&#x27;, &#x27;lastSessionEnd&#x27;, &#x27;totalEvents&#x27;, &#x27;eventTypeCounts&#x27;, &#x27;stopReason&#x27;, &#x27;sessionOutcome&#x27;]<br>required_cl = [&#x27;lineageDepth&#x27;, &#x27;totalCandidates&#x27;, &#x27;currentLeaf&#x27;]<br>required_mc = [&#x27;coverageRatio&#x27;, &#x27;uncoveredMutations&#x27;]<br>for key in required_js:<br>    assert key in js, f&#x27;journalSummary missing {key}&#x27;<br>for key in required_cl:<br>    assert key in cl, f&#x27;candidateLineage missing {key}&#x27;<br>for key in required_mc:<br>    assert key in mc, f&#x27;mutationCoverage missing {key}&#x27;<br>print(&#x27;PASS - reducer populated all three replay consumer summaries&#x27;)<br>PY<br><br><br>for artifact in improvement-journal.jsonl candidate-lineage.json mutation-coverage.json; do<br>  TMP_CASE=&quot;$(mktemp -d /tmp/deep-improvement-replay-case-XXXXXX)&quot;<br>  cp -R &quot;$RUNTIME_COPY/.&quot; &quot;$TMP_CASE/&quot;<br>  rm -f &quot;$TMP_CASE/$artifact&quot;<br>  node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs &quot;$TMP_CASE&quot;<br>  case &quot;$artifact&quot; in<br>    improvement-journal.jsonl)<br>      cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq &#x27;.journalSummary&#x27;<br>      test &quot;$(cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq -r &#x27;.journalSummary&#x27;)&quot; = &quot;null&quot;<br>      ;;<br>    candidate-lineage.json)<br>      cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq &#x27;.candidateLineage&#x27;<br>      test &quot;$(cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq -r &#x27;.candidateLineage&#x27;)&quot; = &quot;null&quot;<br>      ;;<br>    mutation-coverage.json)<br>      cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq &#x27;.mutationCoverage&#x27;<br>      test &quot;$(cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq -r &#x27;.mutationCoverage&#x27;)&quot; = &quot;null&quot;<br>      ;;<br>  esac<br>  rm -rf &quot;$TMP_CASE&quot;<br>done<br><br><br>rm -rf &quot;$RUNTIME_COPY&quot; | `experiment-registry.json` contains:; `journalSummary` with `lastSessionStart`, `lastSessionEnd`, `totalEvents`, `eventTypeCounts`, `stopReason`, `sessionOutcome`; `candidateLineage` with `lineageDepth`, `totalCandidates`, `currentLeaf`; `mutationCoverage` with `coverageRatio`, `uncoveredMutations`; Re-running the reducer with any one of the 3 artifacts removed does not throw; The corresponding registry field resolves to `null` when its source artifact is missing; The remaining consumer paths still populate normally when only one artifact is absent | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | With all three replay artifacts present, `reduce-state.cjs` populates `journalSummary`, `candidateLineage`, and `mutationCoverage` in the registry. When any one artifact is missing, the reducer completes successfully and sets only the corresponding field to `null` while preserving the others. | If any registry summary is missing with artifacts present: inspect `buildJournalSummary()`, `buildCandidateLineageSummary()`, or `buildMutationCoverageSummary()` in `reduce-state.cjs`<br>If the reducer throws when one artifact is removed: verify `readOptionalUtf8()` / `readOptionalJson()` are still used for graceful degradation<br>If a missing artifact silently drops multiple fields: confirm each summary builder is wired independently from its own path<br>If a later doc claims dashboard-only proof for ADR-002 Option A: trim it back to the registry fields, which are the canonical replay-consumer outputs validated by this scenario |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:69:| `runtime-truth/replay-consumer.md` | Canonical per-feature execution contract |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md:85:- Feature file path: `runtime-truth/replay-consumer.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/deterministic_scoring.md:48:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts` | Automated test | Verifies the replay-stability helper that sits beside benchmark verdicts. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md:3:description: "Routes loop-host to the skill-benchmark orchestrator with one additive lane arm; the orchestrator runs the D5 gate first, then per-scenario contamination-lint and router-replay, then scores and emits a dual report."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md:19:Lane C is reached by resolving `--mode=skill-benchmark` in `loop-host.cjs`, which plans a single step pointing at `run-skill-benchmark.cjs`. The orchestrator runs a fixed deterministic pipeline: the D5 connectivity gate first, then per-scenario contamination-lint and router-replay, scoring, and a dual JSON-plus-markdown report.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md:25:`scripts/shared/loop-host.cjs` adds the lane additively. It defines `const LANE_SKILL_BENCHMARK = new Set(['run-skill-benchmark.cjs'])` and includes `'skill-benchmark'` in the closed `VALID_MODES` set alongside `agent-improvement` and `model-benchmark`. `parseArgs` accepts both `--key=value` and `--key value` forms; `resolveMode` returns `agent-improvement` for an undefined mode and writes a stderr warning and falls back to `agent-improvement` for any value not in `VALID_MODES`. `planInvocation('skill-benchmark', args)` fails closed unless both `--skill` and `--outputs-dir` are present, then returns a single step `{ script: 'run-skill-benchmark.cjs', args: [...] }`, forwarding the optional flags listed in `SKILL_BENCHMARK_RUN_OPTIONS` (`fixtures-dir`, `output`, `trace-mode`, `advisor-mode`). `resolveScriptPath` maps the bare `run-skill-benchmark.cjs` name to `scripts/skill-benchmark/` at spawn time. The agent-improvement (`score-candidate.cjs`) and model-benchmark (`materialize-benchmark-fixtures.cjs` + `run-benchmark.cjs`) plans are unchanged. `loop-host.cjs`'s `runPlan` spawns each step with `spawnSync('node', ...)` and aborts the remaining steps if one exits non-zero.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md:27:`scripts/skill-benchmark/run-skill-benchmark.cjs` is the orchestrator (`run(args)`). It resolves the target skill root via `resolveSkillRoot` (a path/`.`-prefixed arg is resolved as-is; a bare id is joined under `.opencode/skills/`), derives `skillId` from the basename, creates `--outputs-dir`, and returns exit code 2 with a stderr message if the target has no `SKILL.md`. It then runs the pipeline in fixed order: (1) `scanConnectivity` (D5 gate) first, before any fixtures load; (2) `loadFixtures` from `--fixtures-dir` or `assets/skill_benchmark/fixtures/<skillId>/`; (3) per scenario, `buildBannedVocab` + `lintFixture`, then `routeSkillResources` (Mode A), then `scoreScenario`; (4) the advisor probe (`probeAdvisor`) runs per scenario only when `--advisor-mode=python`, otherwise `advisorResult` is `undefined`; (5) `aggregate` builds the report object, which is written to `skill-benchmark-report.json` and rendered to `skill-benchmark-report.md` via `renderReport`. Malformed fixtures degrade to an `unparseable-fixture` row rather than crashing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md:38:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestration | Lane C pipeline: D5 gate, per-scenario contamination-lint + router-replay, optional advisor probe, scoring, dual report. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md:85:Promotion is a per-target decision under dynamic mode and remains a guarded later-phase workflow requiring:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement_config.json:6:  "minReplayCount": 3
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/benchmark_stability.md:23:- Objective: Validate Benchmark Stability Measurement for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/benchmark_stability.md:26:- Expected execution process: Run the benchmark-stability helper against the documented replay data; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md:25:`scripts/skill-benchmark/d5-connectivity.cjs` exposes `scanConnectivity({ skillRoot })`, which reuses `parseRouter` from `router-replay.cjs`. If `SKILL.md` is missing it returns early with `score: 60, gateFailed: true, routerParseable: false` and a single `missing_skill_md` P0 finding. Otherwise it walks `RESOURCE_MAP` and detects these finding classes:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md:44:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Utility (imported) | Supplies `parseRouter` the gate scans for dead/escaping/orphan paths and dead intent keys. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md:60:- [router-replay-and-advisor-probe.md](../skill_benchmark/router_replay_and_advisor_probe.md) — Router replay and advisor probe
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:4:{"timestamp":"2026-04-11T12:00:30Z","eventType":"gate_evaluation","iteration":1,"candidateId":"candidate-1","details":{"decision":"continue","tradeOff":{"state":"insufficientData","dataPoints":1,"minRequired":3},"benchmark":{"state":"insufficientSample","replayCount":0,"minRequired":3}}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:7:{"timestamp":"2026-04-11T12:01:20Z","eventType":"gate_evaluation","iteration":2,"candidateId":"candidate-2","details":{"decision":"keep-baseline","tradeOff":{"state":"insufficientData","dataPoints":2,"minRequired":3},"benchmark":{"state":"insufficientSample","replayCount":1,"minRequired":3}}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dimensional_progress.md:41:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs` | Journal helper | Stores typed lifecycle events, stop reasons, and session outcomes for replay consumers. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dimensional_progress.md:49:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts` | Automated test | Verifies event validation, stop-reason enums, and journal replay helpers. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_diverse_agent.md:46:| IS-003 | Scan Diverse Agent (Debug) | Validate Scan Diverse Agent (Debug) | `Validate that scanning the debug agent finds at least 20 integration surfaces.` | node .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs --agent=debug<br><br><br>Verification:<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs --agent=debug &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); s=d[&#x27;summary&#x27;]; assert s[&#x27;totalSurfaces&#x27;]&gt;=20; assert s[&#x27;commandCount&#x27;]&gt;=1; assert s[&#x27;skillCount&#x27;]&gt;=5; print(f&#x27;PASS: {s[\&quot;totalSurfaces\&quot;]} surfaces, {s[\&quot;commandCount\&quot;]} commands, {s[\&quot;skillCount\&quot;]} skills&#x27;)&quot; | `status: "complete"`; `summary.totalSurfaces >= 20`; `surfaces.mirrors` entries with `syncStatus: "aligned"`; `summary.commandCount >= 1`; `summary.skillCount >= 5`; Surfaces span commands, skills, and global docs (CLAUDE.md, agent definitions, skill routing entries); Exit code is 0 | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | `summary.totalSurfaces` is 20 or more, mirrors are aligned, `commandCount >= 1`, `skillCount >= 5`, with surfaces found across commands, skills, and global docs. | If `summary.totalSurfaces &lt; 20`: review surface detection patterns to ensure all reference styles are covered (markdown links, inline mentions, routing tables, agent directory entries)<br>If `summary.skillCount &lt; 5`: check that skill routing entries referencing `debug` are being detected in CLAUDE.md and skill advisor config<br>If `summary.commandCount &lt; 1`: verify debug-related command definitions exist<br>If the script errors: verify the debug agent file exists at `.opencode/agents/debug.md` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md:23:- Objective: Validate Stop-Reason Taxonomy Validation for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md:27:- Expected signals: Journal contains at least one `session_ended` or `session_end` event; `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`; Both fields are present (validation rejects events missing either); `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md:46:| RT-022 | Stop-Reason Taxonomy Validation | Validate Stop-Reason Taxonomy Validation | `Validate that completed sessions emit session_ended with valid stopReason and sessionOutcome taxonomy values.` | /deep:agent-improvement &quot;.opencode/agents/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>ends = [e for e in events if e[&#x27;eventType&#x27;] in (&#x27;session_ended&#x27;, &#x27;session_end&#x27;)]<br>assert len(ends) &gt;= 1, &#x27;No session_ended event found&#x27;<br>VALID_STOP = {&#x27;converged&#x27;,&#x27;maxIterationsReached&#x27;,&#x27;blockedStop&#x27;,&#x27;manualStop&#x27;,&#x27;error&#x27;,&#x27;stuckRecovery&#x27;}<br>VALID_OUTCOME = {&#x27;keptBaseline&#x27;,&#x27;promoted&#x27;,&#x27;rolledBack&#x27;,&#x27;advisoryOnly&#x27;}<br>for e in ends:<br>    sr = e[&#x27;details&#x27;][&#x27;stopReason&#x27;]<br>    so = e[&#x27;details&#x27;][&#x27;sessionOutcome&#x27;]<br>    assert sr in VALID_STOP, f&#x27;Invalid stopReason: {sr}&#x27;<br>    assert so in VALID_OUTCOME, f&#x27;Invalid sessionOutcome: {so}&#x27;<br>print(&#x27;PASS&#x27;)<br>&quot; | Journal contains at least one `session_ended` or `session_end` event; `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`; Both fields are present (validation rejects events missing either); `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | After a completed improvement session, the journal contains a `session_ended` event whose `stopReason` and `sessionOutcome` are both valid members of the frozen taxonomy enums, and the `validateEvent()` function rejects any event with invalid values. | If no `session_ended` event exists: verify the orchestrator calls `emitEvent` with `eventType: &#x27;session_ended&#x27;` at session close<br>If `stopReason` is missing: check the orchestrator&#x27;s end-of-session logic for the `details.stopReason` assignment<br>If `stopReason` is invalid: check whether a new reason was added to the orchestrator but not to the `STOP_REASONS` enum in `improvement-journal.cjs`<br>If `sessionOutcome` is missing: check that the orchestrator includes `details.sessionOutcome` when emitting the end event |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:132:Two stop models are live. `reduce-state.cjs` can stop when all tracked dimensions plateau with exact repeated scores across the configured plateau window, while `mutation-coverage.cjs`, `trade-off-detector.cjs`, and `benchmark-stability.cjs` separately gate convergence, trade-off analysis, and replay stability behind a minimum of three scored samples.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:170:`scan-integration.cjs` scans the canonical agent file, three runtime mirrors, improve command markdown, YAML workflow assets, skill references, global docs, and a skill-advisor path constant. That path now points at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`, so the consolidated skill-advisor surface is included in the integration map.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:370:These entries describe the skill-benchmark path that diagnoses how a *skill* is routed-to, discovered, used, and structured in practice — distinct from doc-shape validation and manual testing playbooks. It is diagnostic by default and emits a ranked Skill Benchmark Report. Mode A (router-replay) and D1-inter (advisor probe) are deterministic; D4 usefulness ablation and live trace capture are follow-on.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:376:Routes loop-host to the skill-benchmark orchestrator with a single additive arm; the orchestrator runs the D5 gate, then per-scenario contamination-lint, router-replay, and scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:400:### Router-replay and advisor probe (Mode A)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:404:Replays the target skill's own router for in-skill routing and discovery, and probes the advisor out-of-band for inter-skill selection — both deterministic, no LLM.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:408:`scripts/skill-benchmark/router-replay.cjs` extracts `INTENT_SIGNALS`/`RESOURCE_MAP` from the target `SKILL.md` and reproduces the substring routing (D1-intra + D2 proxy); `scripts/skill-benchmark/advisor-probe.cjs` runs `skill_advisor.py` over the SQLite graph for the D1-inter signal.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:412:See [`skill-benchmark/router-replay-and-advisor-probe.md`](skill_benchmark/router_replay_and_advisor_probe.md) for full implementation and validation file listings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:436:`scripts/skill-benchmark/score-skill-benchmark.cjs` scores D1 inter+intra, D2 discovery, D3 efficiency, D5 connectivity, and reports D4 usefulness as `unscored` until live mode; the weights are hardcoded in the scorer, and `assets/skill_benchmark/default_profile.json` documents them but is a reference asset that is not consumed at runtime.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md:25:Fixtures live under `assets/skill_benchmark/fixtures/<skill-id>/` as `<id>.public.json` and `<id>.private.json`. The orchestrator's `loadFixtures` reads every `*.public.json`, derives the base id, and reads the matching `<id>.private.json` (defaulting to `{ expected: {} }` when the private file is missing). A malformed (unparseable) fixture is caught and recorded as a `loadError` row rather than crashing the run. The loaded shape is `{ scenarioId, tier, public, expected, rubric }`. The shipped pair is `fixtures/deep-improvement/agent_improve_001.{public,private}.json`: the public side holds `public.prompt` plus `runtime`/`mutationBoundary`/`outputContract` and `provenance`; the private side holds `expected: { skillId, advisorLane, intentKeys, resources, negativeActivation }` and a `rubric`. The shipped fixture intentionally leaves `expected.intentKeys` and `expected.resources` empty (`[]`) until the deep-improvement router map is confirmed; Mode A treats empty gold as non-penalizing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md:27:`scripts/skill-benchmark/contamination-lint.cjs` builds a banned vocabulary from the TARGET SKILL's own identity via `buildBannedVocab({ skillRoot, skillId, privateExpected })`: the skill id and root basename; frontmatter triggers (parsed by `frontmatterTriggers`, which reads `trigger_phrases:` list items and `name:` from the SKILL.md frontmatter block); router keywords and intent keys from `parseRouter(skillMd).intentSignals` (every `INTENT_SIGNALS` key plus its lowercased keywords, parsed via `router-replay.cjs`'s `parseRouter`); and resource path tokens from `RESOURCE_MAP` (each path's basename, extension-stripped basename, and any segment longer than 3 chars via `pathTokens`). When a private gold object is supplied it also bans the private `skillId`, `intentKeys`, `resources`, and `assets` tokens. The `add` helper only admits strings longer than 2 chars, lowercased. `lintFixture({ publicText, bannedVocab })` lowercases the prompt and flags any banned term that is a substring of it, returning `{ passed, hardLeaks }` where `passed` is true only when `hardLeaks` is empty. In the orchestrator a failed lint produces a `firstFailingStage: 'contaminated-fixture'` row with `modeAScore: 0` and does not abort the rest of the run.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md:39:| `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json` | Fixture | Scorer-only gold: `expected.{skillId,advisorLane,intentKeys,resources,negativeActivation}` + `rubric`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md:40:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Utility (imported) | Supplies `parseRouter` used to derive banned router keyword / intent-key / resource tokens. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md:57:- [router-replay-and-advisor-probe.md](../skill_benchmark/router_replay_and_advisor_probe.md) — Router replay and advisor probe
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:3:description: "How to run Lane C (skill-benchmark): invocation, the opt-in advisor probe, Mode A pipeline, dimension coverage, verdict bands, and target eligibility for benchmarking whether a skill is well-routed, discoverable, efficient, and useful in practice."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:8:  - "opt-in advisor probe"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:22:Run Lane C with `loop-host.cjs --mode=skill-benchmark` (or `/deep:skill-benchmark`). The orchestrator runs the D5 structural hard gate first, then per-scenario contamination-lint → router-replay → score, then writes a dual JSON+Markdown report. Mode A is deterministic and is the CI gate; the D1-inter advisor probe, the live trace (Mode B), and the D4-R task-outcome ablation are all opt-in (live/paid), kept off the CI path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:24:> **Mode B (live playbook) — BUILT** (packet `122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode`). Beyond the synthetic-fixture Mode A above, Lane C can now use a skill's own `manual_testing_playbook` as the corpus and score it in two trace-modes over one parser:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:25:> - `--trace-mode router` (default for `run()` / CI) — deterministic router-replay over the real playbook prompts, scored against the playbook's expected-ref gold (replaces the old empty-gold fixtures).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:26:> - `--trace-mode live` — real `cli-opencode` dispatch; routing/advisor scenarios are run as routing-analysis prompts (the model states its routing as JSON, graded vs gold + observed activation); browser scenarios (MR/CB) route to a `bdg` browser executor. Add `--d4` for the opt-in **D4-R task-outcome ablation** — the model is asked to *do* a routine task skill-on vs skill-off (a patch plan + verification, not a routing list), claude-graded into an advisory `D4_task_outcome` (the real usefulness measure, separate from the hallucination-grader D4). A↔B divergence + `assetRecall` are reported alongside.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:27:> - Flags: `--scenarios <ids|critical>`, `--executor`, `--playbook-dir`. Live model via env `SKILL_BENCH_OPENCODE_MODEL` / `SKILL_BENCH_OPENCODE_VARIANT`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:28:> - **Live model guidance:** `gpt-5.5-fast --variant high` completes (~78s); `xhigh` is too slow and times out. Live is advisory (cost + nondeterminism) — the gated verdict stays driven by router mode + the D5 hard gate. Auto-CREATE generator (`playbook-generator.cjs`) is opt-in + staged.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:33:# Mode A (router-replay, deterministic — the CI gate). Run on a skill that has an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:39:  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:42:`--advisor-mode=python` enables the **D1-inter** advisor probe — the deterministic in-repo SQLite advisor, scored out-of-band so the answer cannot leak. It is **off by default** (and in CI) to keep the pure-router path fast and dependency-free; enable it to lift a Mode A run from 4-dimension to 5-dimension coverage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:47:# advisory D4_task_outcome over routine scenarios — requires --trace-mode live
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:54:`--d4` runs a separate task-outcome ablation (skill-on/off) graded by claude and writes an advisory `D4_task_outcome` to the report; it requires `--trace-mode live` (a no-op otherwise) and spends API per scenario. Skill-off keeps a contamination guard — a leaked skill read drops the pair `unscored` rather than faking a score. D4-R runs only on explicit **target-owned** scenarios named via `--d4-scenarios` (or `--scenarios`); with none selected it writes `D4_task_outcome.status: not-run-no-target-scenarios` and scores nothing — there are no cross-target defaults that could borrow another skill's ids.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:58:## 3. WHAT RUNS (MODE A)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:62:3. **Per scenario** — contamination-lint the public prompt (a leak is a fixture failure), then router-replay, then join with private gold to score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:67:| Dim | What | Mode A |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:70:| D2 | unprompted discovery (router-replay recall proxy) | scored |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:73:| D1-inter | advisor selects the right skill | scored when `--advisor-mode=python`; `unscored-mode-a` when no probe ran; `excluded-by-design` (in `excludedDimensions`) for advisor-invisible skills |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:74:| D4 (weighted) | hallucination-grader proxy (the 25-pt dimension) | `unscored-mode-a` in the aggregate **by design** — see note |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:76:**Advisory signals** (live `--d4`; surfaced under `advisorySignals`, **not** folded into the weighted aggregate):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:81:| `assetRecall` | deferred `expectedAssets` support recall, kept off D2/D3 | live (router mode reports it deferred) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:83:D1-inter is **built and deterministic** but opt-in (`--advisor-mode=python`); the live in-situ trace (Mode B) is built. The weighted **D4** dimension stays `unscored-mode-a` on purpose — its grader scores *hallucination*, not task usefulness, so folding it would mislabel the number. Real usefulness is the opt-in **D4-R task-outcome ablation** (`--d4`), reported separately as advisory `D4_task_outcome`, never summed into the weighted score. Mode A stays honest about coverage: the aggregate normalizes over the dimensions actually measured.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md:91:Mode A needs a parseable `INTENT_SIGNALS` + `RESOURCE_MAP` router (e.g. the `cli-*` skills). Skills without that pattern report `router_unparseable` and gate — that is a real signal that the skill is not smart-router-routable, not a harness bug. A skill that routes via a different mechanism is a candidate for live-mode (Mode B) measurement once built.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/contamination_gate.md:75:| `../../scripts/skill-benchmark/router-replay.cjs` | Provides `parseRouter()` used by `buildBannedVocab()` for intent keys/keywords/paths |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:3:description: "Authoritative D1-D5 computation for the Lane C Skill Benchmark Report: point weights, Mode A deterministic scoring, the opt-in advisor probe for D1-inter, deferred live-mode dimensions, and funnel/bottleneck ranking."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:22:Lane C scores a skill across five dimensions (D1-D5) and rolls them into a single verdict. D5 (structural connectivity) is a static hard gate that runs first. Mode A (router-replay) scores everything that needs no live model deterministically; D1-inter is built but opt-in via the in-repo advisor. The weighted **D4** dimension (a hallucination-grader proxy) stays unscored in the aggregate **by design** — it does not measure task usefulness. Real routine-task usefulness is measured separately by the opt-in **D4-R task-outcome ablation**, reported as an advisory signal (never folded into the weighted score); the live trace (Mode B) is built. The aggregate normalizes over the dimensions actually measured so the headline number stays honest about coverage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:24:## 2. POINT WEIGHTS (FULL / LIVE MODE)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:28:## 3. MODE A (ROUTER-REPLAY, DETERMINISTIC)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:30:Scores only what needs no live model; the aggregate normalizes over the measured weights (D1-intra + D2 + D3, plus D1-inter when the advisor probe is enabled) so the number is honest about coverage. D5 is computed statically and gates.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:33:- **D2** (Mode A proxy) = recall of expected resources in the routed set. Live mode replaces this with Hit@1 / Hit@3 / Recall@5 / MRR over the observed file-load trace.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:34:- **D3** (Mode A proxy) = `1 - wastedRouted / totalRouted` (over-routing penalty). Live mode replaces with calls/tokens-to-first-expected.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:37:## 4. D1-INTER — OPT-IN ADVISOR PROBE (BUILT, DETERMINISTIC)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:39:D1-inter (does the skill *advisor* select this skill for the scenario?) is built and deterministic, but **opt-in** so the pure-router default stays fast and dependency-free:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:41:- Enable with `--advisor-mode=python`. Off by default and in CI.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:42:- Scored out-of-band via the deterministic SQLite advisor (`scoreAdvisorPrompt` / `skill_advisor.py`) with the advisor hook disabled so the answer cannot leak into the dispatched prompt.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:43:- When disabled it reports `status: unscored-mode-a` (never faked); when enabled it contributes its 12 points to the measured aggregate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:44:- For an **advisor-invisible** skill — one whose directory carries no `graph-metadata.json`, so the advisor ranks its owning parent identity rather than the packet — D1-inter is **excluded-by-design**: reported `applicable: false, status: "excluded-by-design"` with the owning identity in `delegatedMeasure.targetSkill`, and listed under `excludedDimensions` (not `unscoredDimensions`). This is structural N/A, not a missing score; the weighted aggregate is unaffected either way.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:46:## 5. LIVE MODE (MODE B) + ADVISORY SIGNALS
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:48:The weighted **D4** dimension stays `unscored-mode-a` in the aggregate by design (its grader scores hallucination, not usefulness). Two live-mode signals are surfaced under `advisorySignals`, **outside** the weighted aggregate so the v1 weights/verdict are unchanged:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:50:- **`D4_task_outcome` — the real usefulness instrument (D4-R).** Opt-in via `--d4` (live). The model is asked to *do* a routine task (a minimal patch plan + verification commands, not a routing list) skill-on vs skill-off; both answers are graded by the task-outcome rubric (`system-grader-task-outcome.md`: correctness / verification-fit / focus / hallucination-risk) through the Lane B grader harness (claude-graded; distinct cache keys via the `#taskoutcome#on|off` fixture ids). Score = `0.5 + (on − off) / 2` (>0.5 = the skill helped). Stamped `attribution: approximate` (skill-off is approximated by hook-disable + preamble + a contamination guard that drops a leaked pair). Reported as `advisorySignals.D4_task_outcome`, never summed into the verdict.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:53:**Live trace (Mode B)** replaces the D2/D3 router-replay proxies with the model's stated/observed routing (references only — assets are on the `assetRecall` lane). Signals that did not run report `status: unscored-mode-a` — never faked.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:55:### Advisory Signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:57:`score-skill-benchmark.cjs` emits `advisorySignals` in the machine report, and `build-report.cjs` renders them under **Advisory signals (NOT in the weighted aggregate)**. `D4_task_outcome` reports the opt-in D4-R routine-task usefulness delta when `--d4` live ablation runs; otherwise it is unscored. `assetRecall` reports expected deferred-asset support when live stated assets are available; otherwise it is deferred or unscored. Both are diagnostic only and never change `aggregateScore`, `dimensionScores`, `verdict`, or D4's weighted status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:61:Per-scenario `firstFailingStage` follows the implemented order: `activated-inter` (advisor selected the wrong skill when D1-inter is scored), `router-unparseable`, `surface-mismatch`, `routed-intra`, then `discovered`. A scenario with no failing stage is counted as `passed`; orchestrator-added degradation rows can also contribute `unparseable-fixture`, `contaminated-fixture`, or browser routed-out reasons, and `build-report.cjs` displays routed-out rows with their reason instead of a normal failing stage. The headline bottleneck is the non-`passed` stage with the largest first-failure count (attrition). Bottlenecks list D5 findings plus the headline funnel finding, each mapped through `assets/skill_benchmark/remediation_taxonomy.json` to file, locus, one-line fix, and handoff lane.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:19:`score-skill-benchmark.cjs` turns router-replay, advisor, and connectivity results into the five benchmark dimensions. D1-intra, D2, and D3 are scored per scenario against the private gold; D1-inter is per scenario but only when the advisor probe ran; D5 is per skill; D4 is always `null` (unscored) until live mode. The scenario `modeAScore` and the per-skill aggregate are normalized over only the dimensions actually measured, and a funnel ranks first-failure stages so the largest attrition becomes the headline bottleneck.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:30:- D2 (Mode A proxy `router-replay-recall`) = expected-resource recall (1.0 when no expected resources); for negative scenarios it mirrors the D1-intra suppression outcome.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:31:- D3 (Mode A proxy `router-overload`) = `routed === 0 ? 1 : Math.max(0, 1 - wasted/routed)` where `wasted` is routed resources not in the expected set; for negative scenarios D3 mirrors the suppression outcome.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:32:- D1-inter = `scoreD1Inter` from the advisor probe when an `advisorResult` is supplied, else `{ score: null, unscored: '...' }`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:33:- D4 (the weighted hallucination dimension) = always `{ score: null, unscored: 'requires skill-on/off ablation (live mode)' }` — unscored in the aggregate by design.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:41:`aggregate({ skillId, skillRoot, scenarioRows, connectivity, traceMode })` averages the per-scenario dimension scores (ignoring non-numbers), counts `firstFailingStage` occurrences into a `funnel`, and picks the `headlineBottleneck` as the non-`passed` stage with the highest count. D5 score is `connectivity.score`. The verdict is: `BLOCKED-BY-STRUCTURE` when `connectivity.gateFailed`; else `NO-SCENARIOS` when no aggregate score; else `PASS` ≥ 80, `CONDITIONAL` ≥ 50, else `FAIL` — on the 0-100 `aggregateScore`. The report object carries `schemaVersion: 'skill-benchmark-report.v1'`, `scoringMethod: 'mode-a-router-replay'`, `dimensionScores` (each dimension reports `points` plus `score` or `status: 'unscored-mode-a'`), `unscoredDimensions` (`['D1inter','D4']` when no advisor, else `['D4']`), `advisorySignals` (`D4_task_outcome` + `assetRecall` — surfaced but NOT folded into the weighted aggregate; `D4_task_outcome` is populated only by the opt-in `--d4` live pass, else `unscored`), and `bottlenecks` (the connectivity findings, with a `funnel_attrition` P1 entry unshifted to the front when a headline bottleneck exists). Weights and verdict bands also live in `assets/skill_benchmark/default_profile.json`. UNVERIFIED: that profile is a reference only — its `notes` field states it is NOT consumed at runtime; the scorer hardcodes `WEIGHTS` and there is no `--profile` loader on the Lane C path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md:52:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` | Utility (imported) | Supplies `scoreD1Inter` folded into the scenario score. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:27:- `<scenarioId>.private.json` — scorer-only gold, never crosses the dispatch boundary. `{ scenarioId, expected: { skillId, advisorLane, intentKeys, resources, negativeActivation }, rubric }`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:52:Publish the **T1↔T2 score gap** as the circularity meter (mirrors the advisor corpus↔holdout split). A large gap is a finding against the corpus, not evidence the skill is good.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:60:`expected.intentKeys`/`expected.resources` may be left `[]` while a skill's router map is still being confirmed; Mode A treats empty gold as non-penalizing (scores structure/efficiency only). Populate from a router-extract pass to get real D1-intra/D2 signal.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:86:1. For each scenario, replay the router and record the resources it always selects before intent-specific additions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:97:Signal: D3 efficiency, computed as wasted routed resources over total routed resources in Mode A and replaced by live calls/tokens-to-first-expected in Mode B.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:153:6. Re-run deterministic Mode A; enable advisor/live probes only after static routing is structurally clean.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs:53:  // individual execution (primary + replays), since the domain
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs:157: * Used for resume/replay semantics.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json:34:      "replayCount": 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json:39:      "replayCount": 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json:78:            "replayCount": 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json:80:            "reason": "Benchmark stability requires at least 3 replays before verdict",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json:112:            "replayCount": 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json:114:            "reason": "Benchmark stability requires at least 3 replays before verdict",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md:3:description: Entry-point routing, dispatcher, scorer selection, mode-aware promotion path, and hardening env-gate rationale for the model-benchmark lane.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md:9:  - "mode-aware promotion path"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md:17:Full mechanics behind the SKILL.md summary of Lane B: how `loop-host.cjs` resolves mode, how the model dispatcher and scorers are selected, how promotion is mode-aware, and why the criteria-exec hardening gates default the way they do.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md:59:## 5. MODE-AWARE RECORDS AND PROMOTION PATH
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:62:// (router-replay, contamination-lint, d5-connectivity, parse-resource-loads,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:77:  'advisor-mode',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:195:    // D5-gate -> router-replay -> (optional live) -> trace-parse -> score ->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md:17:This scenario validates that `scripts/skill-benchmark/score-skill-benchmark.cjs` scores a router-replay result against private gold and aggregates the D1–D5 dimensions. The orchestrator `run-skill-benchmark.cjs` loads public/private fixture pairs from `assets/skill_benchmark/fixtures/<skill-id>/` (`<id>.public.json` + `<id>.private.json`); the private gold (`expected.intentKeys`, `expected.resources`, `expected.skillId`, `expected.negativeActivation`) never crosses the dispatch boundary and is joined post-route. `scoreScenario()` computes Mode A dimensions deterministically: D1-intra (`0.4*intentRecall + 0.6*resourceRecall`), D2 (resource-recall discovery proxy), D3 (over-routing efficiency proxy), with D1-inter scored only when `--advisor-mode=python` supplies an advisor probe and D4 always `unscored-mode-a` (needs live ablation). `aggregate()` averages the scenario `modeAScore`s, attaches the D5 connectivity score (hard gate), and derives the verdict (`PASS` ≥80, `CONDITIONAL` 50–79, `FAIL` <50, `BLOCKED-BY-STRUCTURE` on a D5 gate). The bundled `deep-improvement` fixture `agent_improve_001` exercises the full lint → route → score path, so running the orchestrator against `deep-improvement` produces at least one scored scenario row with a populated `dims.d1intra`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md:23:- Objective: Validate that score-skill-benchmark joins router-replay output with private gold and aggregates D1–D5 — producing at least one scored scenario row (non-load-error) with `dims.d1intra` and a numeric `aggregateScore` and verdict.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md:25:- Prompt: `Validate that score-skill-benchmark scores router-replay output against private gold and aggregates the D1 through D5 dimensions.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md:27:- Expected signals: the run exits `0`; `skill-benchmark-report.json` has `scoringMethod: "mode-a-router-replay"`; `scenarioRows` is non-empty and at least one row has no `loadError` and carries `dims.d1intra` (numeric `score`); `aggregateScore` is a number and `verdict` is one of `PASS`/`CONDITIONAL`/`FAIL`/`BLOCKED-BY-STRUCTURE`; `dimensionScores.D4` is `unscored-mode-a` and `unscoredDimensions` includes `D4` (and `D1inter` when the advisor probe is off); `dimensionScores.D5` carries `hardGate: true`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md:46:| SB-047 | Scoring Against Private Gold | Validate the scorer joins router output with private gold and aggregates D1–D5 | `Validate that score-skill-benchmark scores router-replay output against private gold and aggregates the D1 through D5 dimensions.` | rm -rf /tmp/sb-047 &amp;&amp; mkdir -p /tmp/sb-047/out &amp;&amp; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \<br>  --skill deep-improvement \<br>  --outputs-dir /tmp/sb-047/out ; echo "run-exit=$?" ; \<br>node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('/tmp/sb-047/out/skill-benchmark-report.json','utf8'));const scored=(r.scenarioRows||[]).find(x=&gt;!x.loadError);console.log('scoringMethod='+r.scoringMethod);console.log('rows='+r.scenarioRows.length+' scoredHasD1intra='+!!(scored&amp;&amp;scored.dims&amp;&amp;scored.dims.d1intra));console.log('aggregateScore='+r.aggregateScore+' verdict='+r.verdict);console.log('D4='+r.dimensionScores.D4.status+' D5hardGate='+r.dimensionScores.D5.hardGate+' unscored='+JSON.stringify(r.unscoredDimensions));" | `run-exit=0`; `scoringMethod=mode-a-router-replay`; `rows` &gt; 0 and `scoredHasD1intra=true`; `aggregateScore` numeric; `verdict` one of PASS/CONDITIONAL/FAIL/BLOCKED-BY-STRUCTURE; `D4=unscored-mode-a`; `D5hardGate=true`; `unscored` includes `D4` (and `D1inter` with the advisor off) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when the run exits 0 and the report has a non-empty `scenarioRows` with at least one scored row carrying `dims.d1intra`, plus a numeric `aggregateScore` and a valid `verdict`; FAIL otherwise. | If `scenarioRows` is empty: confirm `deep-improvement` still ships `assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.{public,private}.json` and that `loadFixtures()` found the pair<br>If the only row has `loadError`: the public/private JSON is malformed — the degraded `unparseable-fixture` row is the symptom<br>If `aggregateScore`/`verdict` is wrong: inspect `scoreScenario()` recall math and the `aggregate()` verdict bands in `score-skill-benchmark.cjs` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md:74:| `../../scripts/skill-benchmark/score-skill-benchmark.cjs` | `scoreScenario()` + `aggregate()` — Mode A dimension scoring and roll-up |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/score_delta_benchmark_gates.md:59:- [mode-records-and-gates.md](../model_benchmark_mode/mode_records_and_gates.md) -- Record-level mode and hardening gates
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md:29:Mode resolution is closed-set. `VALID_MODES` introduced this two-mode split (`agent-improvement` and `model-benchmark`); the set has since grown additively to three — `agent-improvement`, `model-benchmark`, and `skill-benchmark` — with the additional mode documented in [mode-wiring.md](../skill_benchmark/mode_wiring.md). `resolveMode()` treats an undefined mode as `agent-improvement`. An unknown mode value writes a warning to stderr and falls back to `agent-improvement`, so a typo degrades to the safe default rather than failing the run. The model-benchmark plan also requires `--profile` and `--outputs-dir`, and the host aborts remaining steps when an earlier step exits non-zero.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:18:Everything below is the **profile delta** for each mode. Shared keys (`fixtureDir`, `scoring`, `sampling`, `benchmark`, `outputsDir`) are the same shape as the shipped example profiles in `../../assets/model_benchmark/benchmark-profiles/`. The two shipped examples — `framework_bakeoff.json` (mode B) and `model_vs_model.json` (mode A) — are runnable references; the C–F snippets follow the same contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md:27:`scan-integration.cjs` inventories the canonical `.opencode/agents/{name}.md` file, runtime mirrors, improve-command markdown, YAML workflow assets, skill references, global docs, and one skill-advisor lookup. Command markdown is scanned for `@{agent}` dispatch, while YAML is scanned for either `@{agent}` or bare agent-name references.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md:29:The discovery map includes the consolidated advisor script at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`, so the skill-advisor surface is registered from its self-contained package location.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md:39:| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Scanner | Walks the repo and collects canonical, mirror, command, YAML, skill, global-doc, and skill-advisor surfaces. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:66:// run in their READ-ONLY mode by default. Write-capable evaluation is an explicit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/command_dispatch.md:29:The real dispatch authority lives in the YAML assets. Both workflow files rescan integration, dispatch `@deep-improvement` to write candidates, emit journal events with `improvement-journal.cjs`, and call the scoring, coverage, trade-off, and reducer helpers. Confirm mode adds approval gates around candidate generation and post-score review, while auto mode runs the same stages without those gates.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/mode_wiring_routing.md:17:This scenario validates that `scripts/shared/loop-host.cjs` registers `skill-benchmark` as a valid `--mode` value and that `planInvocation('skill-benchmark', ...)` resolves to a single orchestrator step — `run-skill-benchmark.cjs` — while an unknown `--mode` warns to stderr and falls back to `agent-improvement`. `VALID_MODES` in `loop-host.cjs` carries `agent-improvement`, `model-benchmark`, and `skill-benchmark`; `LANE_SKILL_BENCHMARK` maps `run-skill-benchmark.cjs` to `../skill-benchmark/`; and `SKILL_BENCHMARK_RUN_OPTIONS` (`fixtures-dir`, `output`, `trace-mode`, `advisor-mode`) is the exact forwarded optional-flag set. `resolveMode()` returns `agent-improvement` for any value not in `VALID_MODES` after writing the fallback notice to stderr.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/mode_wiring_routing.md:76:| `../../references/skill_benchmark/operator_guide.md` | Canonical invocation + Mode A pipeline reference |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:3:// ║ live-executor — Mode B live executor (cli-opencode)                      ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:8: * live-executor.cjs — Mode B live executor (cli-opencode).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:10: * Runs a playbook routing/advisor scenario through a real `opencode run` and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:2:title: "SB-045 -- Router-Replay Mode A Determinism"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:3:description: "Manual validation scenario for SB-045: Router-Replay Mode A Determinism."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:9:# SB-045 -- Router-Replay Mode A Determinism
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:17:This scenario validates that `scripts/skill-benchmark/router-replay.cjs` (Mode A, deterministic) produces stable, repeatable routing decisions for a fixed task — the property that makes it the CI gate. The script reads the target `SKILL.md`, extracts `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` from the fenced router block, then reproduces the in-skill semantics: lowercase the task, score each intent by counting which keywords appear as substrings (weighted), keep intents within `AMBIGUITY_DELTA = 1` of the top score, and union the default resource with `RESOURCE_MAP[intent]` for the selected intents. The standalone CLI is `router-replay.cjs --skill <skill-root> --task "<task text>"`: it prints `{ parseable, intents, resources, missingResources, scores }` and exits `0` on a successful replay (even with zero intents) / `2` on an unparseable router. Determinism is verified by running the identical task twice and diffing the JSON output.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:23:- Objective: Validate that router-replay (Mode A) is deterministic — the same task on the same skill yields byte-identical routing JSON across runs — and selects the expected intent with existing routed paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:24:- Real user request: `Confirm the Mode A router replay returns the same routing decision every time for a given task so it is safe as a CI gate.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:25:- Prompt: `Validate that router-replay produces stable, repeatable routing decisions for a fixture task and is exit-0 deterministic.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:26:- Expected execution process: Run `router-replay.cjs` twice with the same `--skill` and `--task`, save both JSON outputs, then diff them and inspect the routed intents/resources; capture stdout, stderr, exit code; then execute the verification block against the saved artifacts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:28:- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence that the replay is deterministic.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:46:| SB-045 | Router-Replay Mode A Determinism | Validate deterministic Mode A routing replay across two identical runs | `Validate that router-replay produces stable, repeatable routing decisions for a fixture task and is exit-0 deterministic.` | rm -rf /tmp/sb-045 &amp;&amp; mkdir -p /tmp/sb-045 &amp;&amp; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \<br>  --skill .opencode/skills/cli-external-orchestration/cli-opencode \<br>  --task "review this diff for security vulnerabilities and give a second opinion" \<br>  &gt; /tmp/sb-045/run1.json ; echo "run1-exit=$?" ; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \<br>  --skill .opencode/skills/cli-external-orchestration/cli-opencode \<br>  --task "review this diff for security vulnerabilities and give a second opinion" \<br>  &gt; /tmp/sb-045/run2.json ; echo "run2-exit=$?" ; \<br>diff /tmp/sb-045/run1.json /tmp/sb-045/run2.json &amp;&amp; echo "DETERMINISTIC" ; \<br>node -e "const r=require('/tmp/sb-045/run1.json');console.log('parseable='+r.parseable+' hasREVIEW='+r.intents.includes('REVIEW')+' resources='+r.resources.length+' missing='+r.missingResources.length);" | both runs `run1-exit=0` / `run2-exit=0`; `diff` empty and prints `DETERMINISTIC`; JSON `"parseable": true`; `hasREVIEW=true`; `resources` &gt; 0; `missing=0` (`missingResources` empty) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when both runs exit 0, are `parseable:true`, the JSON is byte-identical across runs, and the expected REVIEW intent + non-empty existing resources are routed; FAIL otherwise. | If the two outputs differ: routing is not deterministic — inspect `scoreIntents()`/`selectIntents()` and the `scores.sort` order in `router-replay.cjs`<br>If `parseable:false` (exit 2): the target `SKILL.md` lacks a parseable `INTENT_SIGNALS`/`RESOURCE_MAP` block — check `extractDictBody()` and `parseRouter()`<br>If `missingResources` is non-empty: a routed path does not exist on disk — this is the same condition D5 hard-gates (`dead_resource_path`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:67:| `skill-benchmark/router-replay-mode-a.md` | Canonical per-feature execution contract |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:74:| `../../scripts/skill-benchmark/router-replay.cjs` | Mode A deterministic in-skill smart-router replay |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:76:| `../../references/skill_benchmark/operator_guide.md` | Documents Mode A as the deterministic CI gate |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md:85:- Feature file path: `skill-benchmark/router-replay-mode-a.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:46: * Select the executor class for a scenario: routing/advisor run via router-replay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:54: * @returns {'browser'|'advisor'|'routing'} The executor class.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:63:  // A scenario that asserts an in-skill SURFACE is a routing test (the advisor
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:64:  // check is just its precondition). Advisor-class is reserved for scenarios
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:65:  // whose WHOLE test is skill selection — no surface — run as a skill_advisor.py
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:69:  if (prefix === 'SA' || /top-1\s*(!=|==)|routes? .* to sk-doc|advisor (top-1|wins)/.test(pass)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:70:    return 'advisor';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:237:  // disambiguation expected, or advisor must pick another skill).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:1:{"type":"config","sessionId":"imp-low-sample-fixture","target":"deep-research","startedAt":"2026-04-11T12:00:00Z","config":{"minDataPoints":3,"minReplayCount":3}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:2:{"type":"candidate_iteration","sessionId":"imp-low-sample-fixture","target":"deep-research","iteration":1,"candidateId":"candidate-1","score":7.2,"recommendation":"tie","dimensions":[{"name":"correctness","score":0.82},{"name":"efficiency","score":0.61}],"analysis":{"tradeOff":{"state":"insufficientData","dataPoints":1,"minRequired":3,"reason":"Trade-off detection requires at least 3 data points before analysis"},"benchmark":{"state":"insufficientSample","replayCount":0,"minRequired":3,"reason":"Benchmark stability requires at least 3 replays before verdict","stabilityCoefficient":null}}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:3:{"type":"candidate_iteration","sessionId":"imp-low-sample-fixture","target":"deep-research","iteration":2,"candidateId":"candidate-2","score":7.1,"recommendation":"keep-baseline","dimensions":[{"name":"correctness","score":0.8},{"name":"efficiency","score":0.62}],"analysis":{"tradeOff":{"state":"insufficientData","dataPoints":2,"minRequired":3,"reason":"Trade-off detection requires at least 3 data points before analysis"},"benchmark":{"state":"insufficientSample","replayCount":1,"minRequired":3,"reason":"Benchmark stability requires at least 3 replays before verdict","stabilityCoefficient":null}}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:3:// ║ browser-executor.cjs — Mode B executor for browser-gated scenarios       ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:8: * browser-executor.cjs — Mode B executor for browser-gated scenarios (MR-*, CB-*).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/check-dispatch-cap.cjs:30: *    replays for stability measurement) but only the primary emits the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.private.json:6:    "advisorLane": null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:155:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode', 'routedMode is required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:160:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.routeDeclaration', 'routeDeclaration must be ROUTED');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:165:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.expectedWorkflowMode', 'expectedWorkflowMode is required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:169:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.expectedWorkflowMode', 'expectedWorkflowMode is required in the envelope');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:175:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.observedWorkflowMode', 'observedWorkflowMode is required');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:182:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.observedIntents', 'observedIntents must be an array including observedWorkflowMode');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:184:    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.observedIntents', 'observedIntents must include the observed workflow mode');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:204: * Lint a DESIGN_BOUNDARY_PROOF payload for v1 shape and routed-mode binding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/README.md:16:- `benchmark-results.json` contains only 1 replay, so `benchmark-stability.cjs` should return `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` when called with `minReplayCount: 3`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:21:// mode-agnostic, so this list is the only place a new mode is gated.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:22:- Three executors back the scenarios: `router-replay.cjs` (Mode A deterministic), `live-executor.cjs` (Mode B `cli-opencode`), and `browser-executor.cjs` (`bdg`). `executor-dispatch.cjs` is the seam that routes by `classKind` + trace mode and normalizes every executor into one observed-result shape.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:23:- `score-skill-benchmark.cjs` computes the D1-D5 dimensions per scenario and aggregates with point weights; Mode A normalizes over only the dimensions it can measure rather than faking the live-only ones. It also carries the advisory `D4_task_outcome` signal.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:24:- `d4-ablation.cjs` holds the D4 hallucination ablation AND the opt-in `--d4` D4-R task-outcome ablation (advisory `D4_task_outcome`, never collapsed into D4).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:25:- Supporting modules: `contamination-lint.cjs` (pre-dispatch hint-free gate), `advisor-probe.cjs` (D1-inter advisor signal), `playbook-generator.cjs` (opt-in staged scenario generator), and `_args.cjs` (space-form arg parser). `load-playbook-scenarios.cjs` is the corpus loader.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:51:│ executor-        │ ─routing/  │ router-replay.cjs   (Mode A)     │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:52:│ dispatch.cjs     │  advisor ─▶│ live-executor.cjs   (Mode B)     │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:59:│ score-skill-     │ ───▶ │ advisor-probe.cjs (D1-inter)     │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:60:│ benchmark.cjs    │      │ D1-D5 + advisorySignals          │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:70:        augments report.{json,md} with advisory D4_task_outcome
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:83:+-- router-replay.cjs             # Mode A deterministic in-skill smart-router replay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:84:+-- live-executor.cjs             # Mode B live executor (cli-opencode)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:85:+-- browser-executor.cjs          # Mode B executor for browser-gated scenarios (bdg)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:86:+-- score-skill-benchmark.cjs     # Per-scenario D1-D5 + aggregate + advisorySignals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:90:+-- advisor-probe.cjs             # D1-inter signal: does the advisor route to this skill?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:105:| `executor-dispatch.cjs` | The seam between orchestrator and executors. Routes `classKind` routing/advisor + trace-mode router→`router-replay`, +live→`live-executor`, browser→`browser-executor`, and normalizes each into one observed-result the scorer consumes. Lazy-requires live/browser siblings. Exports `dispatchScenario`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:106:| `router-replay.cjs` | Mode A deterministic in-skill smart-router replay. Extracts INTENT_SIGNALS + RESOURCE_MAP from the target SKILL.md and reproduces its substring-scoring semantics. Exit 0 on replay, 2 on unparseable router. Exports `routeSkillResources`, `parseRouter`, `scoreIntents`, `selectIntents`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:107:| `live-executor.cjs` | Mode B live executor via `opencode run`. Runs routing/advisor scenarios as routing-ANALYSIS prompts, reads back stated routing + tool_use corroboration, normalizes to the observed-result shape. Self-contained dispatch (no `--agent`, uses `--format json`). Exports `runLiveScenario`, `parseLiveResult`, `buildLiveDispatchPrompt`, `runDispatch`, and parsing helpers. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:108:| `browser-executor.cjs` | Mode B executor for browser-gated scenarios (MR-*, CB-*) via `bdg`. Honesty rule: only capturable signals get PASS/FAIL; the rest report PARTIAL-NEEDS-ARTIFACT or SKIP-NO-BROWSER, never a fabricated PASS. Runs serially. Exports `executeBrowserScenario`, `verdictToDims`, `motionSandboxHtml`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:109:| `score-skill-benchmark.cjs` | Computes Lane C dimensions per scenario and aggregates. Mode A scores D1-intra, D2, D3, D5; D1-inter and D4 are reported unscored in Mode A (not faked) and the aggregate normalizes over measured dims. For an advisor-invisible skill (no `graph-metadata.json` at its root), D1-inter is instead `excluded-by-design` under `excludedDimensions`, carrying the owning advisor identity in `delegatedMeasure.targetSkill`. Point weights: D1-inter 12, D1-intra 13, D2 20, D3 15, D4 25, D5 15 (gate). Exports `scoreScenario`, `aggregate`, `computeDivergence`, `WEIGHTS`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:111:| `d4-ablation.cjs` | D4 usefulness ablation. Holds the D4 hallucination delta (skill-ON vs skill-OFF, graded by the Lane B grader) AND the opt-in `--d4` D4-R task-outcome ablation that grades a real change with the task-outcome rubric and reports it as the advisory `D4_task_outcome` (never collapsed into D4). Skill-OFF is approximate; scores stamp `attribution: "approximate"`. Exports `runD4Ablation`, `gradeAblation`, `runD4RAblation`, `gradeTaskOutcome`, and prompt builders. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:113:| `advisor-probe.cjs` | D1-inter signal: does the skill-advisor route a domain prompt to the target skill? Runs the in-repo Python advisor CLI over the PUBLIC prompt (deterministic — reads the compiled SQLite skill graph), opt-in via `--advisor-mode=python`. Exports `probeAdvisor`, `scoreD1Inter`, `DEFAULT_ADVISOR_PY`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:124:| Imports | `run-skill-benchmark.cjs` requires the in-lane modules directly; `executor-dispatch.cjs` lazy-requires `live-executor.cjs` and `browser-executor.cjs` so router mode stays dependency-free and CI-safe. `d4-ablation.cjs` requires `live-executor.cjs` and the Lane B grader at `../model-benchmark/scorer/grader/harness.cjs`. `advisor-probe.cjs` shells out to the Python advisor CLI under `system-skill-advisor/`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:125:| Exports | Each module exports named functions (see KEY FILES). `router-replay.cjs` exports the deterministic router (`routeSkillResources`, `parseRouter`); `score-skill-benchmark.cjs` exports `scoreScenario`/`aggregate`/`WEIGHTS`; `build-report.cjs` exports only `renderReport`. The orchestrator's `main()` runs as a CLI. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:151:│ router-replay | live | browser           │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:157:│ D1-D5 + advisorySignals → aggregate      │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:174:| `... --d4 [--d4-scenarios <ids>] [--grader-mode real\|mock]` | CLI (opt-in) | Adds the D4-R task-outcome ablation; requires `--trace-mode live`. Augments the report with advisory `D4_task_outcome`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176:| `routeSkillResources({ task, skillRoot })` | Function | Deterministic Mode A router replay used directly by tests and the generator. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:17: *   cache/<kind>/.lock-<key>/       Mkdir-based advisory lock; POSIX atomic mkdir.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:8:// Live mode reports references and assets on separate channels. The sk-doc gold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:9:// authors an asset target in expected_resources; the live model correctly states
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md:42:| `sweep-foundation.vitest.ts` | 26 | Matrix expansion (cartesian cells, no mode branches), framework rendering, profile validation. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:3:// ║ advisor-probe.cjs — D1-inter advisor routing signal probe                ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:8: * advisor-probe.cjs — D1-inter signal: does the skill-advisor route a domain
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:11: * Captured OUT-OF-BAND (the advisor never sees that it is being benchmarked):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:12: * we run the in-repo Python advisor CLI (`skill_advisor.py`) over the PUBLIC
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:15: * Mode A deterministic core, not live mode. (The TS `scoreAdvisorPrompt` is the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:19: * Probing is opt-in (the orchestrator calls it only when --advisor-mode=python)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:20: * so the pure-router Mode A default stays dependency-free and fast.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:35:const DEFAULT_ADVISOR_PY = path.join(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:36:  SKILLS_DIR, 'system-skill-advisor', 'mcp_server', 'scripts', 'skill_advisor.py',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:44: * Run the advisor over a prompt and return its ranked recommendations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:46: * @param {string} params.prompt - Public prompt text to route through the advisor.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:47: * @param {string} [params.advisorPy] - Path to the advisor CLI; defaults to DEFAULT_ADVISOR_PY.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:52:function probeAdvisor({ prompt, advisorPy, timeoutMs }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:53:  const py = advisorPy || DEFAULT_ADVISOR_PY;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:66:    return { ok: false, recommendations: [], topSkill: null, error: `unparseable advisor output: ${err.message}` };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:75: * Probe the advisor's deep-loop mode routing for a prompt (ADVISORY only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:79: * mode plus per-mode scores. This is separate from {@link probeAdvisor}: that
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:85: * @param {string} [params.advisorPy] - Path to the advisor CLI; defaults to DEFAULT_ADVISOR_PY.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:89:function probeAdvisorMode({ prompt, advisorPy, timeoutMs }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:90:  const py = advisorPy || DEFAULT_ADVISOR_PY;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:113: * Score the ADVISORY mode-precision signal for one scenario. NEVER a gate: the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:115: * authority. This surfaces whether the advisor's resolved mode matches the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:119: * @param {{ ok: boolean, mode: string|null }} [params.modeRouting] - Result from probeAdvisorMode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:122: *   advisory: true, unscored?: string }}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:126:    return { score: null, expectedMode: null, observedMode: null, advisory: true, unscored: 'fixture carries no expected.mode' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:129:    return { score: null, expectedMode, observedMode: null, advisory: true, unscored: 'no mode-routing probe (run with --advisor-mode=python)' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:136:    advisory: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:155: * Score relative advisor ordering for sibling transport suppression.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:158: * @param {{ ok: boolean, recommendations: Array<{skill:string}> }} params.advisorResult - Result from probeAdvisor.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:163: *   advisory: true, unscored?: string, error?: string, reason?: string }}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:165:function scoreRelativeAdvisorRanking({ advisorResult, expectedSkillId, rankBelowSkillIds }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:175:      advisory: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:179:  if (!advisorResult || !advisorResult.ok) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:187:      advisory: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:188:      unscored: 'advisor probe failed',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:189:      error: advisorResult && advisorResult.error,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:193:  const ranksBySkill = rankMap(advisorResult.recommendations);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:213:    advisory: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:219: * Score the D1-inter dimension for one scenario from an advisor probe result.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:223: * @param {{ ok: boolean, recommendations: Array<{skill:string}>, topSkill: string|null }} params.advisorResult - Result from probeAdvisor.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:228:function scoreD1Inter({ advisorResult, expectedSkillId, negative }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:229:  if (!advisorResult || !advisorResult.ok) return { score: null, rank: null, topSkill: null, ok: false };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:230:  const recs = advisorResult.recommendations;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:235:    return { score: rank === null || rank > 5 ? 1 : 0, rank, topSkill: advisorResult.topSkill, ok: true };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:241:  return { score, rank, topSkill: advisorResult.topSkill, ok: true };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:249:  probeAdvisor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:250:  probeAdvisorMode,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:253:  scoreRelativeAdvisorRanking,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:254:  DEFAULT_ADVISOR_PY,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:260:    process.stderr.write('usage: advisor-probe.cjs --prompt "<text>" [--advisor-py <path>] [--expected-skill-id <id> --rank-below <csv>]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:263:  const out = probeAdvisor({ prompt: args.prompt, advisorPy: args['advisor-py'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:266:      process.stderr.write('usage: advisor-probe.cjs --prompt "<text>" --expected-skill-id <id> --rank-below <csv>\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:269:    const relativeRanking = scoreRelativeAdvisorRanking({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:270:      advisorResult: out,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:56:// router-replay is a pure module — exercise it directly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:57:const { routeSkillResources, scoreIntents, selectIntents, parseRouter, loadSurfaceRouter } = require(join(SB, 'router-replay.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:69:const { scoreD1Inter, probeAdvisor } = require(join(SB, 'advisor-probe.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:99:describe('Lane C — router-replay (Mode A)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:533:    expect(report.advisorySignals.recipeMissRate.rate).toBe(0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:719:describe('Lane C — D1-inter advisor scoring', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:722:  it('scores top-1 advisor selection as full credit', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:723:    const res = scoreD1Inter({ advisorResult: probe([{ skill: 'deep-improvement', confidence: 0.9 }]), expectedSkillId: 'deep-improvement', negative: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:728:  it('rank-weights a lower advisor placement', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:729:    const res = scoreD1Inter({ advisorResult: probe([{ skill: 'a' }, { skill: 'b' }, { skill: 'deep-improvement' }]), expectedSkillId: 'deep-improvement', negative: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:734:    const res = scoreD1Inter({ advisorResult: probe([{ skill: 'x' }]), expectedSkillId: 'deep-improvement', negative: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:739:    const absent = scoreD1Inter({ advisorResult: probe([{ skill: 'x' }]), expectedSkillId: 'deep-improvement', negative: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:741:    const present = scoreD1Inter({ advisorResult: probe([{ skill: 'deep-improvement' }]), expectedSkillId: 'deep-improvement', negative: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:745:  it('returns unscored when the advisor probe failed', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:746:    const res = scoreD1Inter({ advisorResult: { ok: false, recommendations: [] }, expectedSkillId: 'deep-improvement', negative: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:751:  it('probes the real advisor deterministically (SQLite, no LLM)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:752:    const res = probeAdvisor({ prompt: 'evaluate and score a bounded agent definition file then propose one guarded revision' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:753:    // The advisor is in-repo + deterministic; it should return a ranked list.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:759:describe('Lane C — mode-precision advisory signal (non-gating)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:760:  const { scoreModePrecision } = require(join(SB, 'advisor-probe.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:767:    expect(r.advisory).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:770:  it('scoreModePrecision credits a matching advisor mode and fails a mismatch', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:778:    // Advisory mode signal must NOT move the weighted Mode A score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:784:  it('a wrong advisor mode does not lower the scenario score (gate stays skill-id)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:791:  it('aggregate surfaces modePrecision in advisorySignals, outside the weighted aggregate', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:794:    expect(report.advisorySignals.modePrecision.score).toBe(100);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:795:    // The advisory signal is not listed as a weighted dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/README.md:22:- Concurrency uses an mkdir-based advisory lock with a 5-minute stale-lock TTL.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:16: * MK_SKILL_ADVISOR_HOOK_DISABLED=1 + a "do not load any skill" preamble, then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:37: * no project skill-file reads. Pairs with MK_SKILL_ADVISOR_HOOK_DISABLED=1.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:91:  const off = runDispatch({ prompt: buildSkillOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:203:  const off = runDispatch({ prompt: buildTaskOutcomeOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts:4:// Surface-slice sync guard for sk-code's router-replay.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts:8:// deterministic router-replay MUST slice a single-surface task to only its
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts:22:const { routeSkillResources } = require(join(HARNESS, 'router-replay.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts:36:describe('sk-code surface-slice sync — router-replay slices to code-<surface>/ packets', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts:71:// Within the OpenCode surface, router-replay slices to the touched-language SET so
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts:158:    const r = routed('update the skill_advisor.py argparse block in .opencode/skills/system-skill-advisor');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-dashboard.md:24:| replayCount | 1 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-runtime.vitest.ts:169:  it('produces both modes through the SAME code path (no mode branch)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:25:const { parseRouter } = require('./router-replay.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:13:const { routeSkillResources } = require(join(SB, 'router-replay.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts:113:  it('treats a legacy profile with no mode as valid and untouched', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md:89:| `skill-benchmark.vitest.ts` | `skill-benchmark/` orchestrator, router-replay, dual report rendering. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/benchmark-results.json:5:      "replays": [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/benchmark-results.json:12:      "replayCount": 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md:24:| `sweep-benchmark.cjs` | CLI entry + matrix expander. Expands the profile, renders each framework prompt, dispatches each cell, scores each row, writes outputs. No mode branch. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:58:      expect(journal.SESSION_OUTCOMES.advisoryOnly).toBe('advisoryOnly');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:72:      // runs 3x per iteration (primary + 2 replays) but only the primary emits the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:141:        details: { stopReason: 'maxIterationsReached', sessionOutcome: 'advisoryOnly' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:281:          sessionOutcome: 'advisoryOnly',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:287:      expect(result.sessionOutcome).toBe('advisoryOnly');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:11: * Mode A (router-replay, deterministic) scores the dimensions that need no live
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:13: * (efficiency proxy), D5 (structural connectivity, hard gate). D1-inter (advisor
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:14: * selection) and D4 (usefulness ablation) require live dispatch / the advisor
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:15: * scorer and are reported as unscored in Mode A rather than faked — the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:16: * aggregate is normalized over the dimensions actually measured so a Mode A
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:19: * Converged point weights (for reference / live mode): D1=25 (inter12+intra13),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:29:const { scoreD1Inter, scoreModePrecision, scoreRelativeAdvisorRanking } = require('./advisor-probe.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:124:    // Mode is the parent-skill routing target (advisory only); skill-id stays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:150:  let { scenarioId, tier, routerResult, expected, advisorResult } = arg;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:161:  return { scenarioId, tier, routerResult, expected, advisorResult, scenario };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188:    // router mode the skill is already selected, so "routed something" is not
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:189:    // itself over-activation (that is an advisor-lane concern); a disambiguation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:194:  // Live mode never asks the model for the internal intent-signal key, so intent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:197:  // Router mode keeps the intent+resource blend since the key is deterministically
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:223:    proxy: 'router-replay-recall',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:224:    note: 'Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:253:  // uses when no advisor probe ran — so this dimension drops out and the row is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:283:    note: 'Mode A proxy; live-mode replaces with calls/tokens-to-first-expected',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:288: * Compute the advisory asset-recall lane; null scores are explicit unscored states.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:301:    return { score: null, deferred: true, expectedAssets, note: 'assets deferred on-demand; not in the first slice (router mode)' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:303:  return { score: setRecall(expectedAssets, observedAssets), expectedAssets, observedAssets, note: 'live stated-asset recall (advisory, not weighted)' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:842:  const advisoryLine = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:853:    'Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:854:    `Advisory signals: ${advisoryLine}.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1091: * Score a single scenario from its router-replay result joined with private gold.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1092: * @param {Object} arg - Scenario input (legacy {scenarioId,tier,routerResult,expected,advisorResult} or new {scenario,observed,traceMode}).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1096:  const { scenarioId, tier, routerResult, expected, advisorResult, scenario } = normalizeScenarioInput(arg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1098:  // (live mode); router mode leaves observedSurface null. Computed up front so a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1114:  // Live mode reports references and assets on SEPARATE channels (the model states
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1131:  // D2 proxy (Mode A): recall of expected resources in the routed set. In live
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1135:  // D3 efficiency proxy (Mode A): penalize over-routing — resources routed that
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1136:  // are not in the expected set are "wasted loads". Live mode uses tool-call /
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1154:  // Asset support lane (advisory, not in the weighted aggregate). The router
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1156:  // D2/D3. Router mode has no observed-asset channel (assets are not in the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1157:  // first slice), so it reports deferred; live mode scores stated-asset recall.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1160:  // D1-inter: scored deterministically when an advisor probe is supplied (the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1161:  // Python advisor reads the SQLite graph, no LLM), else left unscored.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1162:  if (advisorResult) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1163:    const inter = scoreD1Inter({ advisorResult, expectedSkillId: expected && expected.skillId, negative });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1166:      : { score: null, unscored: 'advisor probe failed', error: advisorResult.error };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1168:    dims.d1inter = { score: null, unscored: 'no advisor probe (run with --advisor-mode=python)' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1171:  dims.d4 = { score: null, unscored: 'requires skill-on/off ablation (live mode)' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1173:  // Mode-precision (ADVISORY, never gated): for parent-skill fixtures the gate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1174:  // is skill-id (D1-inter); this only reports whether the advisor's resolved
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1182:  dims.relativeRanking = scoreRelativeAdvisorRanking({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1183:    advisorResult,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1195:  // First failing stage (funnel): advisor activate -> router parse -> surface -> route gold -> tool surface -> recipe -> intra -> discovery.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1198:  // Mode A scenario score: weight the measured dims, normalize over their weights.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1199:  // D1-inter joins the measured set only when an advisor probe produced a score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1219: * resource but the live model doesn't (the skill doesn't signpost it inline),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1224: * @param {Object} params.routerObserved - Router-mode observation for the scenario.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1254:// Advisor visibility mirrors the advisor's own projection rule: a directory is a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1256:// (e.g. a read-only surface) has none, so the advisor ranks its owning parent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1259:function resolveAdvisorOwner(skillRoot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1296:  const coverage = { routing: 0, advisor: 0, browser: 0, routedOut: 0, scored: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1345:  // D1-inter is scored only when advisor probes ran; avg() returns null if no row
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1349:  // Distinguish excluded-by-design (advisor-invisible target, structurally N/A)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1350:  // from runnable-but-unscored (advisor-visible, no probe ran). D1-inter is the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1354:  const advisorTopology = resolveAdvisorOwner(skillRoot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1357:  if (!advisorTopology.visible) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1363:      reason: advisorTopology.owner
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1364:        ? `advisor-invisible surface bundled by advisor identity ${advisorTopology.owner}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1365:        : 'advisor-invisible skill (no graph-metadata.json); not an advisor routing target',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1366:      delegatedMeasure: advisorTopology.owner ? { targetSkill: advisorTopology.owner } : null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1371:      ? { points: WEIGHTS.d1inter, score: null, status: 'unscored-mode-a' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1375:  if (advisorTopology.visible && d1interAvg === null) unscoredDimensions.push('D1inter');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1377:  // Advisory signals — surfaced but NOT folded into the weighted aggregate (so
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1385:  // Mode-precision advisory: share of scored rows whose advisor-resolved mode
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1392:    ? { score: null, status: 'unscored (no advisor probe or no rank-below gold)', note: 'advisor target rank relative to sibling transports; advisory, not weighted' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1393:    : { score: relativeRankingAvg, note: 'advisor target rank relative to sibling transports; advisory, not weighted' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1452:    scoringMethod: (traceMode || 'router') === 'live' ? 'mode-b-live' : 'mode-a-router-replay',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1470:      D4: { points: WEIGHTS.d4, score: null, status: 'unscored-mode-a' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1475:    advisorySignals: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1477:        ? { score: null, status: 'unscored (run --d4 in live mode)', note: 'task-outcome usefulness delta; separate from D4 hallucination, never summed into it' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1480:        ? { score: null, status: 'deferred (router) or no asset gold', note: 'deferred-asset support recall; advisory, not weighted' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1481:        : { score: assetRecallAvg, note: 'deferred-asset support recall; advisory, not weighted' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1483:        ? { score: null, status: 'unscored (no mode-routing probe or no expected.mode)', note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1484:        : { score: modePrecisionAvg, note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:19:const { parseRouter } = require('./router-replay.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:21:const { parseRouter, loadSurfaceRouter, registryPacketRoots } = require(join(SKILL_ROOT, 'scripts', 'skill-benchmark', 'router-replay.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:13: *   classKind routing/advisor + trace-mode router → routeSkillResources (deterministic)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:14: *   classKind routing/advisor + trace-mode live   → live-executor.cjs (cli-opencode)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:17: * The live/browser executors are lazy-required so router mode stays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:26:const { routeSkillResources } = require('./router-replay.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:51: * @param {string} [args.executor] - Optional executor override for live mode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:58:    // Browser scenarios need a real browser (bdg). Run them only in live mode;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:66:        routedOut: true, reason: 'browser scenario — run in live mode (needs bdg)', raw: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:78:  // Default: deterministic router-replay (the CI gate path).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:82:    executor: 'router-replay',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/README.md:46:| `low-sample-benchmark/` | One short session with too few data points and replays. Exercises the insufficient-data path of `trade-off-detector.cjs`, the insufficient-sample path of `benchmark-stability.cjs`, and the registry surfacing in `reduce-state.cjs`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:31:const { parseRouter, routeSkillResources, loadSurfaceRouter } = require('./router-replay.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:15: *      failure), then router-replay (Mode A), then join with private gold to score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:18: * Mode A (router-replay) is the deterministic default and the CI gate. Live
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:19: * dispatch (Mode B) + D1-inter advisor scoring + D4 ablation are follow-on; this
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:20: * orchestrator emits a complete, honest Mode A report today.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:29:const { routeSkillResources } = require('./router-replay.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:33:const { probeAdvisor } = require('./advisor-probe.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:96:function runLegacyFixtures({ fixturesDir, skillRoot, skillId, advisorMode, scenarioRows }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:119:    const advisorResult = advisorMode === 'python'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:120:      ? probeAdvisor({ prompt: fx.public.prompt || '' }) : undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:121:    scenarioRows.push(scoreScenario({ scenarioId: fx.scenarioId, tier: fx.tier, routerResult, expected: fx.expected, advisorResult }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:135:// executors. Contamination-lint is a drift FINDING in router mode (the playbook
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:136:// intentionally carries trigger words) and is skipped entirely in live mode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:137:function runPlaybook({ skillRoot, skillId, traceMode, advisorMode, executor, playbookDir, scenariosFilter, scenarioRows, lintFindings, warningsOut }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:150:        // Live mode: browser-executor returned a full scenario row (with a verdict).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:160:    const advisorResult = (advisorMode === 'python' && sc.classKind === 'advisor' && sc.prompt)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:161:      ? probeAdvisor({ prompt: sc.prompt }) : undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:162:    scenarioRows.push(scoreScenario({ scenario: sc, skillId, observed, advisorResult, traceMode }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:183:  const advisorMode = args['advisor-mode'] || 'off';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:201:    runLegacyFixtures({ fixturesDir: path.resolve(args['fixtures-dir']), skillRoot, skillId, advisorMode, scenarioRows });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:204:      skillRoot, skillId, traceMode, advisorMode, executor: args.executor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:232:// the advisory D4_task_outcome aggregate, and re-writes report.{json,md}. D4-R runs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:238: * the chosen scenarios, attach each row's d4TaskOutcome, recompute the advisory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:256:    report.advisorySignals = report.advisorySignals || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:257:    report.advisorySignals.D4_task_outcome = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:283:  report.advisorySignals = report.advisorySignals || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:284:  report.advisorySignals.D4_task_outcome = d4TaskAvg === null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289:  process.stdout.write(`  D4-R: ${scored} scenario(s) scored; advisory D4_task_outcome=${d4TaskAvg == null ? 'null' : d4TaskAvg}\n`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json:5:    "advisorLane": "deep-improvement",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json:14:  "notes": "expected.intentKeys/resources intentionally left empty until the deep-improvement SKILL.md router map is confirmed; Mode A scores structure/efficiency and treats unknown gold as non-penalizing. Populate after a router-extract pass."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:2:title: "fixtures: legacy Mode A skill-benchmark corpus"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:3:description: "Per-skill public/private fixture pairs for the legacy Mode A (--fixtures-dir) skill-benchmark corpus; superseded by the in-skill manual_testing_playbook but still supported."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:7:  - "Mode A fixtures-dir corpus"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:12:# fixtures: legacy Mode A skill-benchmark corpus
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18:`fixtures/` holds the legacy Mode A skill-benchmark corpus, organized as per-skill directories (`<skill-id>/`) each containing one or more `<scenario>.public.json` / `<scenario>.private.json` pairs. The skill-benchmark loop consumes this corpus via `--fixtures-dir`. The PUBLIC half of a pair is the only material that crosses the dispatch boundary to the agent under test; the PRIVATE half is scorer-only gold and never reaches the model. This corpus is superseded by the skill's own `manual_testing_playbook` (the default corpus) but remains supported for explicit `--fixtures-dir` runs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:24:- The private half declares `expected` routing (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`) and a `rubric` of `usefulnessChecks` / `harmChecks`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:25:- `expected.intentKeys` and `expected.resources` are intentionally empty pending a router-extract pass; Mode A treats unknown gold as non-penalizing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:26:- This is the LEGACY Mode A path. The in-skill `manual_testing_playbook` is the default corpus; `fixtures/` is superseded-but-supported.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:46:| `deep-improvement/agent_improve_001.private.json` | Scorer-only gold, withheld from the agent. Holds `scenarioId`, an `expected` routing block (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`), a `rubric` (`usefulnessChecks`, `harmChecks`), and a `notes` field recording why `intentKeys`/`resources` stay empty. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:56:| Consumers | Read by the skill-benchmark loop only when invoked with `--fixtures-dir` (Mode A). The default corpus is the in-skill `manual_testing_playbook`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:10: * Boundary-side freshness, replay consumption, payload recomputation, and file
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:12: * weakened proof shape so fixture replay can catch token stripping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:25:const { parseRouter } = require('./router-replay.cjs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts:11:const { routeSkillResources } = require(join(SB, 'router-replay.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:3:// ║ router-replay — Mode A deterministic in-skill smart-router replay        ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:8: * router-replay.cjs — Mode A deterministic in-skill smart-router replay.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10: * The converged design needs the intra-skill router replayed deterministically
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:19: * Exit: 0 on a successful replay (even with zero intents), 2 on unparseable router.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:101:// doc) is genuinely consulted on every route, so the replay seeds every result
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:391:// reference paths) as a retained shared doc. Resource recall must be replayed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:475: * Replay the in-skill router for a task and return the routed resources.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:502:  // replay the retained surface router for the resource gold, which lives at the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:549:    process.stderr.write('usage: router-replay.cjs --skill <skill-root> --task "<task text>"\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:557:    process.stderr.write(`router-replay: ${err.message}\n`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:59:    lines.push(`- By class — routing: ${c.routing} · advisor: ${c.advisor} · browser: ${c.browser}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:86:  lines.push(dimLine('D1 inter (advisor)', d.D1inter));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:94:    lines.push(`_Unscored in this run (need live mode): ${r.unscoredDimensions.join(', ')}._`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:107:  if (r.advisorySignals) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:108:    const a = r.advisorySignals;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:110:    lines.push('### Advisory signals (NOT in the weighted aggregate)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:166:    lines.push('## Contamination findings (router mode — drift, not failures)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:177:  lines.push(`- ${r.runQuality ? r.runQuality.note : 'Mode A deterministic router-replay.'}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:2:// ║ benchmark-stability — score variance & weight optimization advisory      ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:17: * Default number of replay runs for stability measurement.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:20:const MIN_REPLAY_COUNT_DEFAULT = 3;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:21:const DEFAULT_REPLAY_COUNT = MIN_REPLAY_COUNT_DEFAULT;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:49:function resolveMinReplayCount(config) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:50:  if (Number.isInteger(config?.minReplayCount) && config.minReplayCount > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:51:    return config.minReplayCount;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:55:    process.env.SK_IMPROVE_AGENT_BENCHMARK_MIN_REPLAY_COUNT || '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:62:  return MIN_REPLAY_COUNT_DEFAULT;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:99: * @param {number[]} values - Array of score values from replays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:113: * Accepts an array of result sets from identical replays and computes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:117: * @param {object} [config] - { warningThreshold?, minReplayCount? }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:118: * @returns {{ dimensions: object, stable: boolean, warnings: string[] }|{state: string, replayCount: number, minRequired: number, reason: string}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:121:  const replayCount = Array.isArray(results) ? results.length : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:124:    minReplayCount: resolveMinReplayCount(config),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:128:  if (replayCount < opts.minReplayCount) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:131:      replayCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:132:      minRequired: opts.minReplayCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:133:      reason: `Benchmark stability requires at least ${opts.minReplayCount} replays before verdict`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:218:// 4. WEIGHT OPTIMIZER (Advisory Only — REQ-AI-012)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:223: * Research finding (P2): advisory-only, never auto-apply.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:312:  reportLines.push('NOTE: These recommendations are advisory only. Do NOT auto-apply.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:327:  MIN_REPLAY_COUNT_DEFAULT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:328:  DEFAULT_REPLAY_COUNT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md:3:description: "Reproducible advisor-probe scorecard scoring per-mode routing for the three lexical system-deep-loop modes (research, review, ai-council) via the advisor's deep-skill-routing endpoint; a corpus-side routing check distinct from the harness's skill-id-only score."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md:8:  - "advisor routing dogfood"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md:16:A re-inspectable advisor-probe scorecard for the parent-skill routing dogfood.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md:17:It scores per-mode routing for the three **lexical** modes via the advisor's
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md:20:`system-skill-advisor/.../tests/routing-parity-deep-*.vitest.ts`. This probe is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md:26:ADV=.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.private.json:6:    "advisorLane": "deep-research",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.private.json:25:  "notes": "Parent-skill routing dogfood: skill-level gold is system-deep-loop; mode-level precision is additionally enforced by the advisor routing-parity fixtures + the registry drift-guard."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts:7:// a shape the Lane C router-replay parser cannot read (it expects the standard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts:20:const { parseRouter } = require(join(HARNESS, 'router-replay.cjs'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts:76:  it('router-replay now parses mcp-figma into the six runtime intents (was zero)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md:36:        +-- agent_improve_001.public.json   # Domain-language prompt + contract (advisor-blind)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md:48:| `fixtures/<skill-id>/<id>.public.json` | The advisor-blind, domain-language scenario input: `prompt`, `runtime`, `mutationBoundary`, `outputContract`, and `provenance`. Never names router keywords. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md:49:| `fixtures/<skill-id>/<id>.private.json` | The held-out gold for the same scenario: `expected` labels (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`) and a `rubric` of usefulness / harm checks. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:20:const SKILL_ADVISOR_PATH = '.opencode/skills/scripts/skill_advisor.py';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:173:function scanSkillAdvisor(repoRoot, agentName) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:174:  const content = readOptional(path.join(repoRoot, SKILL_ADVISOR_PATH));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:175:  return { path: SKILL_ADVISOR_PATH, matched: content !== null && new RegExp(`\\b${agentName}\\b`, 'i').test(content) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:197:  const skillAdvisor = scanSkillAdvisor(repoRoot, agentName);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:204:    + globalDocs.length + (skillAdvisor.matched ? 1 : 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:214:    surfaces: { canonical, mirrors, commands, yamlWorkflows, skills, globalDocs, skillAdvisor },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:8:// for this skill). D1-inter is excluded for an advisor-invisible skill — one whose
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:9:// directory carries no graph-metadata.json, so the advisor ranks its owning parent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:18:const CODE_OPENCODE = join(REPO_SKILLS, 'sk-code', 'code-opencode'); // advisor-invisible surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:19:const SK_CODE = join(REPO_SKILLS, 'sk-code'); // advisor-visible hub identity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:29:  it('excludes D1-inter by design for an advisor-invisible surface', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:42:  it('does not exclude D1-inter for an advisor-visible hub', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:45:    expect(report.dimensionScores.D1inter.status).toBe('unscored-mode-a');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:54:    expect(report.advisorySignals.D4_task_outcome.status).toBe('not-run-no-target-scenarios');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:18:  MIN_REPLAY_COUNT_DEFAULT: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:19:  DEFAULT_REPLAY_COUNT: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:29:      | { state: string; replayCount: number; minRequired: number; reason: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:36:    it('has default minimum replay count of 3', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:37:      expect(stability.MIN_REPLAY_COUNT_DEFAULT).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:40:    it('has default replay count of 3', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:41:      expect(stability.DEFAULT_REPLAY_COUNT).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:93:    it('returns insufficientSample for 1 replay', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:98:        replayCount: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:100:        reason: 'Benchmark stability requires at least 3 replays before verdict',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:104:    it('returns insufficientSample for 2 replays', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:110:        replayCount: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:112:        reason: 'Benchmark stability requires at least 3 replays before verdict',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:116:    it('returns stable for identical replays', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:125:        throw new Error('Expected full stability verdict for 3 replays');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:141:        throw new Error('Expected full stability verdict for 3 replays');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:158:        throw new Error('Expected full stability verdict for 3 replays');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:167:        replayCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:169:        reason: 'Benchmark stability requires at least 3 replays before verdict',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:173:    it('respects custom minReplayCount override', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:179:      ], { minReplayCount: 5 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:183:        replayCount: 4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:185:        reason: 'Benchmark stability requires at least 5 replays before verdict',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:251:      expect(result.report).toContain('advisory only');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:67:+-- benchmark-stability.cjs   # Library: score variance + weight advisory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:81:| `scan-integration.cjs` | Scans the three runtime mirrors, commands, YAML workflows, skills, global docs, and the skill advisor for an agent name. CLI: `--agent=<name>` with optional `--repo-root` and `--output`. Emits `status: 'complete'` with `surfaces` and `summary`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:84:| `benchmark-stability.cjs` | Library exports (`measureStability`, `stabilityCoefficient`, `generateWeightRecommendations`, and related) reporting score variance and weight-optimization advisories. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:139:| `benchmark-stability.cjs` | Module | Stability and weight advisory helpers. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:4:// Deterministic coverage for the playbook-corpus path (Mode B's router-mode
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:37:  it('tags advisor-only scenarios (SA-001, RD-002) as advisor', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:38:    const adv = scenarios.filter((s: any) => s.classKind === 'advisor').map((s: any) => s.scenarioId).sort();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:61:  it('routes a routing scenario through router-replay deterministically', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:160:  it('router mode (no observed surface) is unaffected by the surface gate', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:289:  it('router mode: assets are deferred (assetRecall unscored, no D2/D3 distortion)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:298:  it('live mode: assetRecall = recall of expectedAssets in observedAssets; stated asset is not D3 waste', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:310:      scenario: { scenarioId: 'LS-002', passCriteria: 'edits skill_advisor.py to add a --json-output flag' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:311:      onText: 'Edit skill_advisor.py: add --json-output. Verify: python3 skill_advisor.py --json-output',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:329:describe('aggregate — advisory signals are additive, not weighted', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:337:    expect(report.aggregateScore).toBe(80); // unchanged by the advisory signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:338:    expect(report.advisorySignals.D4_task_outcome.score).toBe(70);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:339:    expect(report.advisorySignals.assetRecall.score).toBe(50);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json:12:  "notes": "Reference profile only — NOT yet consumed at runtime. The scorer hardcodes WEIGHTS in scripts/skill-benchmark/score-skill-benchmark.cjs and there is no --profile loader on the Lane C path yet; this weights block is the forward-looking source these will read once profile loading lands. Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically; D1-inter (advisor) is built but opt-in via --advisor-mode=python; D4 (usefulness ablation) requires live mode and is reported unscored until then. Weights/bands are provisional pending 2-3 pilot calibration per the 002 playbook."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.private.json:6:    "advisorLane": "deep-ai-council",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.private.json:25:  "notes": "Parent-skill routing dogfood: skill-level gold is system-deep-loop; mode-level precision is additionally enforced by the advisor routing-parity fixtures + the registry drift-guard."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:3:description: "The three Vitest suites covering the skill-benchmark (Lane C) lane: orchestrator/router-replay/dual-report, playbook mode, and the sk-code router drift guard."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:32:| `skill-benchmark.vitest.ts` | Orchestrator and Mode A coverage: `loop-host.cjs` mode wiring (skill-benchmark as a valid mode, single-step plan, fail-closed args, byte-identical Lane A default), `router-replay.cjs` routing including inline vs reference-following routers, `contamination-lint.cjs`, `d5-connectivity.cjs` hard gate, `score-skill-benchmark.cjs` scoring with negative-activation, `build-report.cjs` report render, `advisor-probe.cjs` D1-inter scoring, malformed-fixture degradation, and the dual `skill-benchmark-report.json` / `.md` artifacts via `run-skill-benchmark.cjs`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:33:| `playbook-mode.vitest.ts` | Mode B (playbook corpus) coverage: `load-playbook-scenarios.cjs` parsing the sk-code playbook (24 scenarios, text/browser/advisor split), `executor-dispatch.cjs` router branch + browser routing-out, `score-skill-benchmark.cjs` real-gold scoring, `computeDivergence` A vs B deltas, `live-executor.cjs` (`parseLiveResult`, `extractRoutingJson`, `proseRoutingFallback`), surface-mismatch gating, the asset lane (`assetRecall` separate from D2/D3), `browser-executor.cjs` verdict mapping, `d4-ablation.cjs` D4 and D4-R task-outcome, `playbook-generator.cjs` coverage + gates, `--playbook-dir` threading, and advisory-signal aggregation. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:34:| `sk-code-router-sync.vitest.ts` | Drift guard for sk-code's machine-readable router. Via `router-replay.cjs` `parseRouter`, asserts the machine block parses by reference-following, every routed path exists on disk, every routable `references/`/`assets/` `.md` (outside the navigation allowlist) is covered, and every explicit full path named in the `smart_routing.md` prose maps is present. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.private.json:6:    "advisorLane": "deep-improvement",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.private.json:24:  "notes": "Parent-skill routing dogfood: skill-level gold is system-deep-loop; mode-level precision is additionally enforced by the advisor routing-parity fixtures + the registry drift-guard."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.private.json:6:    "advisorLane": "deep-review",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.private.json:25:  "notes": "Parent-skill routing dogfood: skill-level gold is system-deep-loop; mode-level precision is additionally enforced by the advisor routing-parity fixtures + the registry drift-guard."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:65:See [`reviewer_schema.md`](./reviewer_schema.md) for the full schema, deterministic replay field, and how-to-add steps.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_edge.json:12:    "sessionOutcome: advisoryOnly"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:3:description: "Schema for reviewer-prompt regression fixtures with expected verdicts, visible and hidden cases, and deterministic replay support."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:8:  - "deterministic fixture replay"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:72:## 4. Deterministic Replay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:74:For deterministic CI or pre-commit replay, a case may include `reviewer_output`. When present, the scorer parses that output instead of dispatching a live model. When absent, the scorer writes the composed prompt to a temp file and calls `dispatch-model.cjs`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:76:Live model dispatch is opt-in and should stay outside blocking CI unless the operator deliberately enables it.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.private.json:6:    "advisorLane": "sk-design",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.private.json:6:    "advisorLane": "sk-design",

exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark | rg 'sweep-(stats|reporter|profile)|dispatch-model|sweep-benchmark|SWEEP|MODES'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md

exec
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     644 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs
     648 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
     352 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
     665 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
     203 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md
    2512 total

exec
/bin/zsh -lc "rg -n '"'^function |''^async function |module'"\\.exports|cost_usd|tokens_in|latency_ms|paired|bootstrap|verdict|grouped|leaderboard|Pareto|utility|price|budget' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:8:// just the primitives a trustworthiness verdict needs: central tendency, a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:10:// generator for reproducible randomized fixtures, a seeded paired-delta
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:11:// bootstrap CI + paired win rate for confidence-aware top-pair comparison, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:12:// the verdict gates themselves (point-margin and CI-gated). Every helper is pure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:22:function toNumbers(xs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:33:function mean(xs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:49:function quantile(xs, q) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:68:function median(xs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:80:function mad(xs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:96:function seededRandom(seed) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:127: * BEFORE any leaderboard text. This is the guard against the saturated-fixture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:139: * @returns {{verdict: string, reason: string}} Verdict with machine-readable reason.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:141:function trustVerdict({ nSamples, margin, noiseFloor, minSamplesForWinner = 3 }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:147:    return { verdict: 'INCONCLUSIVE', reason: 'insufficient_n' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:151:    return { verdict: 'TIE', reason: 'inside_noise_floor' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:153:  return { verdict: 'WINNER', reason: 'trusted_margin' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:159:// (a partial cell never invents a phantom paired observation).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:160:function pairDeltas(samplesA, samplesB) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:182: * Fraction of paired comparisons where A strictly beats B (A_i > B_i). Ties and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:191:function pairedWinRate(samplesA, samplesB) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:213: * Seeded paired-delta bootstrap confidence interval for the mean difference
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:215: * point margin, it asks whether the WHOLE plausible range of the paired mean
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:219: *   1. Form the per-index paired deltas d_i = A_i - B_i (shared sample index).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:224: *      bootstrap mean-delta distribution; `point` is the mean of the raw deltas.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:226: * Degenerate inputs (0 or 1 paired delta) cannot support a spread, so lo/hi
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:239:function bootstrapPairedDeltaCi(samplesA, samplesB, options) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:254:    // One paired observation has no resampling variance: every bootstrap mean is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:283: * plays in the verdict gate, so call sites read as intent, not as a raw stat.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:288:function noiseFloorMad(repeatedSamples) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:294: * CI-gated trustworthiness verdict. The stricter successor to trustVerdict: a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:296: * paired confidence interval that excludes zero. Any one failing downgrades the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:297: * verdict with a machine-readable reason the reporter surfaces before any
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:298: * leaderboard text.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:306: * the bootstrap says zero difference is still plausible.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:314: * @returns {{verdict: string, reason: string}} Verdict with machine-readable reason.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:316:function trustVerdictCI({ nSamples, margin, noiseFloor, ci, minSamplesForWinner = 3 }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:322:    return { verdict: 'INCONCLUSIVE', reason: 'insufficient_n' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:325:    return { verdict: 'TIE', reason: 'inside_noise_floor' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:332:    return { verdict: 'TIE', reason: 'ci_overlaps_zero' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:334:  return { verdict: 'WINNER', reason: 'trusted_margin' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:341:module.exports = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:348:  bootstrapPairedDeltaCi,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs:349:  pairedWinRate,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:64:// Grader/benchmark dispatch is a read-only judgment: the model emits its verdict
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:73:function writeCapableOptIn() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:84:function resolveStateDir(opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:98:function pauseSentinelPath(opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:102:function loadConfig() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:122:const BUDGET = MB_CONFIG.budget || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:142:function sha256Hex(input) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:149:function sleepSync(ms) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:159:function repoRoot() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:168:function detectRateLimit(combinedOutput) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:176:function deriveProvider(modelSlug) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:186:function finiteOrNull(v) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:196:// numeric `cost`/`cost_usd`. Returns { tokens_in, tokens_out, cost_usd } with
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:198:function probeUsageFromEvent(ev) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:199:  const out = { tokens_in: null, tokens_out: null, cost_usd: null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:208:      if (out.tokens_in == null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:209:        out.tokens_in = finiteOrNull(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:213:                : usage.tokens_in,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:225:    if (out.cost_usd == null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:226:      const cost = c.cost != null ? c.cost : c.cost_usd;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:228:        out.cost_usd = finiteOrNull(cost.total != null ? cost.total : cost.usd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:230:        out.cost_usd = finiteOrNull(cost);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:238:// Returns { output, tokens_in, tokens_out, cost_usd, usage_parser_status }:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:248:function parseOpencodeStream(stdout) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:251:    tokens_in: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:253:    cost_usd: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:271:    if (usage.tokens_in != null && result.tokens_in == null) result.tokens_in = usage.tokens_in;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:273:    if (usage.cost_usd != null && result.cost_usd == null) result.cost_usd = usage.cost_usd;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:283:  if (result.tokens_in != null || result.tokens_out != null || result.cost_usd != null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:295:function buildEnvelope(raw, resolved, executor, latencyMs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:297:  env.latency_ms = Number.isFinite(latencyMs) ? latencyMs : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:304:  env.tokens_in = finiteOrNull(raw && raw.tokens_in);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:306:  env.cost_usd = finiteOrNull(raw && raw.cost_usd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:316:    if (parsed.tokens_in != null) env.tokens_in = parsed.tokens_in;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:318:    if (parsed.cost_usd != null) env.cost_usd = parsed.cost_usd;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:334:function buildResumeHint(sentinelPath) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:349:function shellQuote(value) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:360:function writePauseSentinel(reason, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:385:function pauseSentinelExists(opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:394:function buildSpawnSpec(executor, promptText, resolved) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:442:function dispatchReal(opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:443:  // Wall-clock start for the normalized envelope's latency_ms (per-dispatch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:517:function dispatchMock(opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:576:function dispatch(opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:585:function parseArgs(argv) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:600:function main() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:629:module.exports = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:2:// ║ sweep-reporter — grouped sweep aggregate + trust-first synthesis           ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:9: * per-cell sweep rows into a grouped aggregate plus a human synthesis, and it
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:10: * orders the synthesis so a trust verdict and a saturation status are stated
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:11: * BEFORE any leaderboard or "winner" wording. A reader can never see a ranked
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:20: *     -> trust verdict (enough repeated samples AND top-pair margin > noise floor
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:21: *        AND a paired bootstrap CI on the top-pair delta that excludes zero)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:24: * The verdict deliberately measures its margin on the GATE's chosen ranking key
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:53:function isFiniteNumber(v) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:57:// Count the finite entries of an array, the real paired depth available to the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:58:// bootstrap (a dispatch-failed sample is null and must not inflate the count).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:59:function countFinite(xs) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:71:function rowMetric(row, key) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:86:function groupMetric(group, key) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:106:function groupRows(rows, groupBy) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:121: * so the verdict cannot be a WINNER (insufficient_n).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:126:function minSamplesPerCell(rows) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:147:function noiseFloorForKey(rows, key) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:170:function aggregateGroup(name, rows) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:207:function detectFixtureSaturation(rows) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:235:// --- Trust verdict, measured on the gate's chosen ranking key. ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:238:// shared (fixture, sample-index) condition, so a paired bootstrap cancels the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:241:// returned series are index-aligned for paired resampling.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:242:function pairedSeriesForKey(topRows, secondRows, key) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:252:  // Stable, deterministic condition order so the seeded bootstrap is reproducible.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:266:// A stable per-report seed for the paired bootstrap: derived from the deciding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:269:function verdictSeed(topGroup, secondGroup, rankingKey, override) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:271:  return 'verdict::' + rankingKey + '::' + topGroup + '::' + secondGroup;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:275: * Build the trust verdict on the gate's chosen ranking key: gates on repeated
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:276: * samples, top-pair margin vs noise floor, and a paired bootstrap CI excluding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:283: * @param {Object} [opts] - Overrides: { groupBy?, bootstrapIterations?,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:285: * @returns {Object} { verdict, reason, ranking_key, n_samples, margin,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:288:function buildVerdict(ranked, rankingKey, rows, minSamplesForWinner, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:303:      verdict: v.verdict,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:321:  // The CI rigor needs paired multi-sample observations. Group the original rows
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:327:  const { samplesA, samplesB } = pairedSeriesForKey(topRows, secondRows, rankingKey);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:329:  // Single-sample fallback: with only one paired observation there is no spread
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:330:  // to bootstrap, so the CI cannot exclude zero. Defer to the n-gate, which on a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:332:  const pairedDepth = Math.min(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:337:  if (pairedDepth >= 2) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:338:    ci = stats.bootstrapPairedDeltaCi(samplesA, samplesB, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:339:      iterations: isFiniteNumber(options.bootstrapIterations)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:340:        ? options.bootstrapIterations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:343:      seed: verdictSeed(top.group, second.group, rankingKey, options.seed),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:355:    verdict: v.verdict,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:369:// --- Synthesis markdown — verdict + saturation FIRST, leaderboard LAST. ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:371:function fmtNum(v, digits) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:377:function renderSynthesis(aggregate, profileMeta) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:382:  // 1. Trust verdict FIRST — before any leaderboard or winner language.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:383:  const v = aggregate.verdict;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:384:  lines.push('## Trust verdict');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:388:      v.verdict +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:406:      '- paired ' +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:469:  // 3. Leaderboard LAST. The word "leaderboard" appears only after the verdict.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:517: * Turn a sweep result into a grouped aggregate plus a trust-first synthesis,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:523: *   minSamplesForWinner?, write?, bootstrapIterations?, confidence?,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:524: *   bootstrapSeed? }. `write` defaults to writing iff `outDir` is provided.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:528:function report(sweepResult, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:556:  // so the leaderboard can show every group, ranked survivors first.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:577:  // Trust verdict on the gate's ranking key. The CI rigor needs to re-group the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:578:  // raw rows back to the deciding pair, so the groupBy travels with it; bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:580:  const verdict = buildVerdict(gate.ranked, gate.ranking_key, rows, minSamplesForWinner, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:582:    bootstrapIterations: options.bootstrapIterations,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:584:    seed: options.bootstrapSeed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:587:  // Build the leaderboard group list: ranked survivors first (in rank order),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:622:    verdict,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:655:module.exports = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:62:function resolveFixtureDir(profile, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:79:function loadFixtureIndex(fixtureDir) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:111:function selectFixtures(profile, index) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:143:function axisModels(profile) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:155:function axisVariants(profile) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:168:function axisFrameworks(profile) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:182:function sampleCount(profile, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:199:function expandCells(profile, fixtures) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:258:function buildPrompt(cell, registry) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:277:function dispatchCell(cell, promptText, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:286:      latency_ms: Date.now() - t0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:328:      latency_ms: Date.now() - t0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:348:function parseAssistantTextFromStream(stdout) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:359:function extractAssistantText(stdout) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:371:function resolveOutDir(profile, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:399:function runSweep(profile, opts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:402:  const verdict = validateProfile(profile);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:403:  if (!verdict.valid) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:404:    throw new Error('sweep: invalid profile: ' + verdict.errors.join('; '));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:467:        latency_ms: d.latency_ms,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:470:        tokens_in: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:472:        cost_usd: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:526:  // out) so the returned result carries the gated aggregate + trust verdict, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:551:function parseArgs(argv) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:568:function main() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:605:        // Surface the trust verdict + saturation up front so a CLI reader sees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:606:        // whether the run is trustworthy before reading any leaderboard file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:607:        verdict: result.aggregate ? result.aggregate.verdict : null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:620:function gitRoot() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:636:module.exports = {

exec
/bin/zsh -lc "sed -n '277,340p;430,485p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
function dispatchCell(cell, promptText, opts) {
  const t0 = Date.now();

  if (opts.mock && typeof opts.mockResponder === 'function') {
    const text = String(opts.mockResponder(cell) || '');
    return {
      assistantText: text,
      dispatch_ok: text.trim().length > 0,
      exit_code: 0,
      latency_ms: Date.now() - t0,
      attempts: 1,
      mock: true,
    };
  }

  // Materialize the prompt to a per-cell temp dir: every executor in
  // dispatch-model.cjs reads its prompt from a file path, and the dispatch runs
  // with that throwaway dir as its cwd so an agentic model's stray writes land
  // there (and are discarded), never polluting the repo. The dir is removed in
  // the finally so each cell is fully isolated and leaves nothing behind.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-cell-'));
  const promptFile = path.join(dir, 'prompt.txt');
  fs.writeFileSync(promptFile, promptText, 'utf8');
  // Test-only injection seam: opts._dispatch stands in for the CLI dispatcher so
  // tests can capture cwd/prompt-file behavior without spawning a real executor.
  // Production callers never set it, so the universal dispatcher is used.
  const dispatchFn = typeof opts._dispatch === 'function' ? opts._dispatch : dispatcher.dispatch;

  try {
    const res = dispatchFn({
      prompt_file: promptFile,
      executor: cell.executor || undefined,
      model: cell.modelId || undefined,
      variant: cell.variant || undefined,
      timeout_ms: opts.timeout_ms,
      mock: !!opts.mock,
      mock_mode: opts.mock_mode,
      state_dir: opts.state_dir,
      cwd: dir,
    });

    // The dispatcher returns concatenated stdout. For a real cli-opencode run that
    // is a JSONL event stream; pull the assistant text out of it. Mock output and
    // plain-text executors return the assistant text directly on stdout.
    const stdout = res.stdout || '';
    const assistantText = res.mock ? stdout : extractAssistantText(stdout) || stdout;

    return {
      assistantText,
      dispatch_ok: !!res.ok && assistantText.trim().length > 0,
      exit_code: typeof res.exit_code === 'number' ? res.exit_code : -1,
      latency_ms: Date.now() - t0,
      attempts: res.attempts || 0,
      paused: res.paused || false,
      pause_reason: res.pause_reason || null,
      mock: !!res.mock,
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Pull the concatenated assistant text out of a cli-opencode JSONL event stream.
// Falls back to returning the raw string when it is not an event stream (so a
          correctness_pass_rate: null,
          assertions_passed: null,
          assertions_total: (
            (Array.isArray(cell.fixture.tests) ? cell.fixture.tests.length : 0) +
            (Array.isArray(cell.fixture.hidden_tests) ? cell.fixture.hidden_tests.length : 0)
          ),
          format_adherent: null,
          format_reason: 'dispatch_failed',
          output_words: 0,
          output_chars: 0,
          per_test: [],
          extracted: false,
          extract_reason: 'dispatch_failed',
        };
      }

      rows.push({
        cellId: cell.cellId,
        mode: profile.mode || null,
        model: cell.model,
        executor: cell.executor,
        variant: cell.variant,
        framework: cell.framework,
        fixture: cell.fixture.id || null,
        sample,
        correctness_pass_rate: scores.correctness_pass_rate,
        assertions_passed: scores.assertions_passed,
        assertions_total: scores.assertions_total,
        format_adherent: scores.format_adherent,
        format_reason: scores.format_reason,
        output_words: scores.output_words,
        output_chars: scores.output_chars,
        extracted: scores.extracted,
        extract_reason: scores.extract_reason,
        per_test: scores.per_test,
        dispatch_ok: d.dispatch_ok,
        exit_code: d.exit_code,
        latency_ms: d.latency_ms,
        // Nullable usage fields: providers that do not expose token/cost report
        // null rather than a fabricated number, avoiding schema churn later.
        tokens_in: null,
        tokens_out: null,
        cost_usd: null,
      });
    }
  }

  const result = {
    profile: {
      id: profile.id || profile.profileId || null,
      mode: profile.mode || null,
      version: profile.version || null,
    },
    rows,
    meta: {
      axes: {

exec
/bin/zsh -lc "sed -n '183,330p;442,520p;576,640p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
// Coerce a candidate usage value to a finite number, or null. Token/cost fields
// are reported as null when unknown — NEVER a fabricated 0 — so downstream
// aggregation can distinguish "provider did not report usage" from "zero usage".
function finiteOrNull(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  return null;
}

// Probe an event object for usage fields at the locations OpenCode's event shape
// plausibly carries them. The live binary's usage payload is UNVERIFIED (the
// event-stream text shape is confirmed, the usage fields are not), so every
// access is defensive: any missing branch leaves the value null. Recognized
// shapes: a `usage`/`tokens` object with input/output token counts, and a
// numeric `cost`/`cost_usd`. Returns { tokens_in, tokens_out, cost_usd } with
// nulls for whatever is absent.
function probeUsageFromEvent(ev) {
  const out = { tokens_in: null, tokens_out: null, cost_usd: null };
  if (!ev || typeof ev !== 'object') return out;
  // Usage commonly hangs off the event, a nested part, or a session payload.
  const carriers = [ev, ev.part, ev.session, ev.message, ev.info].filter(
    (c) => c && typeof c === 'object',
  );
  for (const c of carriers) {
    const usage = c.usage || c.tokens || null;
    if (usage && typeof usage === 'object') {
      if (out.tokens_in == null) {
        out.tokens_in = finiteOrNull(
          usage.input != null ? usage.input
            : usage.input_tokens != null ? usage.input_tokens
              : usage.prompt_tokens != null ? usage.prompt_tokens
                : usage.tokens_in,
        );
      }
      if (out.tokens_out == null) {
        out.tokens_out = finiteOrNull(
          usage.output != null ? usage.output
            : usage.output_tokens != null ? usage.output_tokens
              : usage.completion_tokens != null ? usage.completion_tokens
                : usage.tokens_out,
        );
      }
    }
    if (out.cost_usd == null) {
      const cost = c.cost != null ? c.cost : c.cost_usd;
      if (cost && typeof cost === 'object') {
        out.cost_usd = finiteOrNull(cost.total != null ? cost.total : cost.usd);
      } else {
        out.cost_usd = finiteOrNull(cost);
      }
    }
  }
  return out;
}

// Parse a cli-opencode `--format json` stdout (newline-delimited JSON events).
// Returns { output, tokens_in, tokens_out, cost_usd, usage_parser_status }:
//   - output: assembled assistant text from `type === 'text'` events, ordered by
//     part start time (mirrors the sweep extractor shape). Empty string
//     when no text events are present.
//   - usage fields: extracted from the events when exposed, else null.
//   - usage_parser_status: 'parsed' (≥1 usage field found), 'absent' (events
//     parsed cleanly but carried no usage), or 'error' (no line parsed as JSON —
//     i.e. not an event stream / malformed / empty).
// Defensive by contract: a malformed or empty stream yields output '' and null
// usage with status 'error' so the caller can fall back to raw stdout.
function parseOpencodeStream(stdout) {
  const result = {
    output: '',
    tokens_in: null,
    tokens_out: null,
    cost_usd: null,
    usage_parser_status: 'absent',
  };
  const lines = String(stdout || '').split(/\r?\n/).filter(Boolean);
  const parts = [];
  let sawEvent = false;
  for (const line of lines) {
    let ev;
    try {
      ev = JSON.parse(line);
    } catch (_) {
      continue; // non-JSON line (e.g. a stray log) is skipped, not fatal.
    }
    sawEvent = true;
    if (ev && ev.type === 'text' && ev.part && typeof ev.part.text === 'string') {
      parts.push({ text: ev.part.text, start: (ev.part.time && ev.part.time.start) || 0 });
    }
    const usage = probeUsageFromEvent(ev);
    if (usage.tokens_in != null && result.tokens_in == null) result.tokens_in = usage.tokens_in;
    if (usage.tokens_out != null && result.tokens_out == null) result.tokens_out = usage.tokens_out;
    if (usage.cost_usd != null && result.cost_usd == null) result.cost_usd = usage.cost_usd;
  }
  if (!sawEvent) {
    // Nothing parsed as a JSON event — not an OpenCode stream. Signal 'error' so
    // the caller keeps the raw stdout as output and leaves usage null.
    result.usage_parser_status = 'error';
    return result;
  }
  parts.sort((x, y) => x.start - y.start);
  result.output = parts.map((p) => p.text).join('');
  if (result.tokens_in != null || result.tokens_out != null || result.cost_usd != null) {
    result.usage_parser_status = 'parsed';
  }
  return result;
}

// Wrap a raw dispatch result in the normalized cross-executor envelope. ADD-only:
// every existing key on `raw` is preserved (callers/tests that read ok/exit_code/
// stdout/stderr/attempts/paused/etc. keep working); the envelope layers the
// model-agnostic fields on top. `output` is the clean assistant text (parsed from
// the cli-opencode event stream, else raw stdout). Token/cost stay null unless an
// executor's parser fills them.
function buildEnvelope(raw, resolved, executor, latencyMs) {
  const env = Object.assign({}, raw);
  env.latency_ms = Number.isFinite(latencyMs) ? latencyMs : null;
  env.executor = executor || null;
  env.model = (resolved && resolved.model) || null;
  env.variant = (resolved && resolved.variant) || null;
  env.provider = deriveProvider(env.model);
  // Usage is null until a parser proves otherwise. Preserve any value a caller
  // already set on raw (none do today), else default null — never fabricate.
  env.tokens_in = finiteOrNull(raw && raw.tokens_in);
  env.tokens_out = finiteOrNull(raw && raw.tokens_out);
  env.cost_usd = finiteOrNull(raw && raw.cost_usd);

  // cli-opencode emits the JSON event stream (--format json). Parse it for clean
  // assistant text + usage; fall back to raw stdout on a malformed/empty stream.
  if (!raw.mock && executor === 'cli-opencode' && typeof raw.stdout === 'string') {
    const parsed = parseOpencodeStream(raw.stdout);
    env.usage_parser_status = parsed.usage_parser_status;
    env.output = parsed.usage_parser_status === 'error'
      ? raw.stdout
      : (parsed.output || raw.stdout);
    if (parsed.tokens_in != null) env.tokens_in = parsed.tokens_in;
    if (parsed.tokens_out != null) env.tokens_out = parsed.tokens_out;
    if (parsed.cost_usd != null) env.cost_usd = parsed.cost_usd;
  } else if (env.output == null) {
    // Plain-text executors (and mock) return assistant text directly on stdout.
    env.output = typeof raw.stdout === 'string' ? raw.stdout : '';
  }
  return env;
}

// Emit a resume command that removes the real run-scoped sentinel path and
// invokes the loop-host at its shipped lane path.
/**
 * Build a copy-paste resume command that clears the sentinel and restarts the loop.
 *
function dispatchReal(opts) {
  // Wall-clock start for the normalized envelope's latency_ms (per-dispatch,
  // inclusive of retries/backoff — the real elapsed cost of getting a result).
  const t0 = Date.now();
  const executor = opts.executor || TARGET.executor || 'cli-opencode';
  if (!KNOWN_EXECUTORS.has(executor)) {
    return buildEnvelope(
      { ok: false, exit_code: -1, stdout: '', stderr: '', attempts: 0, error: `unknown executor: ${executor}` },
      { model: opts.model || null, variant: opts.variant || null },
      executor,
      Date.now() - t0,
    );
  }
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  const dir = opts.cwd || repoRoot();
  // Injectable spawn for tests that assert cwd reaches the spawn layer.
  const spawnFn = opts._spawn || spawnSync;
  // Test-only backoff override (mirrors the _spawn seam): lets the pause-sentinel
  // regression exhaust the backoff schedule without real 60-240s sleeps. Production
  // callers never set _backoff, so the configured BACKOFF_MS schedule is used.
  const backoff = Array.isArray(opts._backoff) ? opts._backoff : BACKOFF_MS;
  const promptText = fs.readFileSync(opts.prompt_file, 'utf8');
  const resolved = {
    model: opts.model || TARGET.model || 'minimax-coding-plan/MiniMax-M2.7-highspeed',
    agent: opts.agent || TARGET.agent || 'general',
    variant: opts.variant || null,
    dir,
    promptFile: opts.prompt_file,
  };

  let lastStdout = '';
  let lastStderr = '';

  for (let attempt = 0; attempt < backoff.length + 1; attempt++) {
    const spec = buildSpawnSpec(executor, promptText, resolved);
    const res = spawnFn(spec.bin, spec.args, {
      // Set cwd for every executor so non-opencode CLIs do not silently inherit
      // the host process cwd.
      cwd: dir,
      // Close stdin for executors that receive the prompt through argv to avoid
      // opencode's stdin-hang bug.
      input: spec.input == null ? undefined : spec.input,
      stdio: spec.input == null ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
      timeout,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    lastStdout = res.stdout || '';
    lastStderr = res.stderr || '';
    if (res.status === 0) {
      return buildEnvelope({ ok: true, exit_code: 0, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1 }, resolved, executor, Date.now() - t0);
    }
    const combined = lastStdout + lastStderr;
    if (detectRateLimit(combined)) {
      if (attempt < backoff.length) {
        const wait = backoff[attempt];
        process.stderr.write(`dispatch-model: rate limit on attempt ${attempt + 1}; backing off ${wait}ms\n`);
        sleepSync(wait);
        continue;
      }
      const sentinelPath = writePauseSentinel('rate_limit_exhausted_3_strikes', opts);
      return { ok: false, exit_code: res.status || -1, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1, paused: true, pause_reason: 'rate_limit', sentinel_path: sentinelPath };
    }
    return { ok: false, exit_code: res.status || -1, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1, error: 'dispatch failed (non-rate-limit)' };
  }
  return { ok: false, exit_code: -1, stdout: lastStdout, stderr: lastStderr, attempts: backoff.length + 1 };
}

// Mock outputs are model-agnostic — they exercise the scoring pipeline for the dry-run gate.
/**
 * Return canned model-agnostic output for a dry-run dispatch, shaped by mock_mode.
 *
 * @param {Object} opts - Dispatch options; opts.mock_mode selects high-score/low-score/default.
 * @returns {Object} A mock dispatch result (ok, exit_code, mock, stdout, stderr, attempts).
 */
function dispatchMock(opts) {
  const t0 = Date.now();
  const mockMode = opts.mock_mode || 'default';
  const promptText = fs.readFileSync(opts.prompt_file, 'utf8');
function dispatch(opts) {
  if (pauseSentinelExists(opts)) {
    const sentinelPath = pauseSentinelPath(opts);
    return { ok: false, paused: true, pause_reason: 'sentinel_exists', sentinel_path: sentinelPath, error: `pause sentinel present (${sentinelPath}); resume manually` };
  }
  if (opts.mock) return dispatchMock(opts);
  return dispatchReal(opts);
}

function parseArgs(argv) {
  const args = { mock: false };
  for (const entry of argv) {
    if (entry === '--mock') args.mock = true;
    else if (entry.startsWith('--executor=')) args.executor = entry.slice('--executor='.length);
    else if (entry.startsWith('--model=')) args.model = entry.slice('--model='.length);
    else if (entry.startsWith('--agent=')) args.agent = entry.slice('--agent='.length);
    else if (entry.startsWith('--variant=')) args.variant = entry.slice('--variant='.length);
    else if (entry.startsWith('--mock-mode=')) args.mock_mode = entry.slice('--mock-mode='.length);
    else if (entry.startsWith('--state-dir=')) args.state_dir = entry.slice('--state-dir='.length);
    else if (!entry.startsWith('--') && !args.prompt_file) args.prompt_file = entry;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.prompt_file) {
    process.stderr.write('usage: dispatch-model.cjs [--executor=cli-opencode] [--model=...] [--agent=...] [--variant=...] [--state-dir=...] [--mock] [--mock-mode=...] <prompt-file>\n');
    process.exit(2);
  }
  const r = dispatch(args);
  // Surface failure diagnostics so non-interactive callers can diagnose a
  // failed executor run without instrumenting this module.
  process.stdout.write(JSON.stringify({
    ok: r.ok,
    exit_code: r.exit_code,
    attempts: r.attempts,
    paused: r.paused || false,
    pause_reason: r.pause_reason || null,
    sentinel_path: r.sentinel_path || null,
    error: r.error || null,
  }, null, 2) + '\n');
  process.stdout.write('--- STDOUT ---\n' + (r.stdout || '') + '\n');
  process.stdout.write('--- STDERR ---\n' + (r.stderr || '') + '\n');
  process.exit(r.ok ? 0 : 1);
}

if (require.main === module) main();

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  dispatch,
  dispatchReal,
  dispatchMock,
  buildSpawnSpec,
  buildEnvelope,
  parseOpencodeStream,
  deriveProvider,
  KNOWN_EXECUTORS,
  resolveStateDir,
  pauseSentinelPath,
  writePauseSentinel,

exec
/bin/zsh -lc "sed -n '53,205p;528,630p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

// Count the finite entries of an array, the real paired depth available to the
// bootstrap (a dispatch-failed sample is null and must not inflate the count).
function countFinite(xs) {
  if (!Array.isArray(xs)) return 0;
  let n = 0;
  for (const x of xs) if (isFiniteNumber(x)) n++;
  return n;
}

// Map a raw row to its value on a given ranking key, on that key's own scale so
// the margin and the noise floor are directly comparable:
//   correctness -> pass rate (0..1)
//   format      -> adherence as 0/1
//   efficiency  -> output word count (lower is better; the reducer handles sign)
function rowMetric(row, key) {
  if (key === 'correctness') {
    return isFiniteNumber(row.correctness_pass_rate) ? row.correctness_pass_rate : NaN;
  }
  if (key === 'format') {
    if (row.format_adherent === true) return 1;
    if (row.format_adherent === false) return 0;
    return NaN;
  }
  // efficiency
  return isFiniteNumber(row.output_words) ? row.output_words : NaN;
}

// The group-level aggregate value on a ranking key, matching how the gate ranks:
// correctness by mean, format by adherent rate, efficiency by median words.
function groupMetric(group, key) {
  if (key === 'correctness') return group.correctness_mean;
  if (key === 'format') return group.format_adherent_rate;
  return group.output_words_median;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// --- Grouping + per-group aggregation. ---

/**
 * Bucket rows by a grouping key into a Map of group-name -> rows[].
 *
 * @param {Array<Object>} rows - The raw per-cell sweep rows.
 * @param {string} groupBy - The row field to group by.
 * @returns {Map<string, Array<Object>>} Buckets keyed by group name; a null key
 *   is bucketed under the stable literal '(none)'.
 */
function groupRows(rows, groupBy) {
  const buckets = new Map();
  for (const row of rows) {
    // A null group key (e.g. grouping by framework on a no-framework run) is
    // bucketed under a stable literal rather than dropped.
    const key = row[groupBy] == null ? '(none)' : String(row[groupBy]);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row);
  }
  return buckets;
}

/**
 * Min repeated-sample count across the cells in a row set, the depth of repeated
 * measurement the trust gate relies on. A single sample per cell gives no spread,
 * so the verdict cannot be a WINNER (insufficient_n).
 *
 * @param {Array<Object>} rows - Rows carrying a `cellId` field.
 * @returns {number} The minimum per-cell sample count, or 0 when no cells exist.
 */
function minSamplesPerCell(rows) {
  const perCell = new Map();
  for (const row of rows) {
    const id = row.cellId == null ? '(cell)' : String(row.cellId);
    perCell.set(id, (perCell.get(id) || 0) + 1);
  }
  if (perCell.size === 0) return 0;
  let min = Infinity;
  for (const c of perCell.values()) if (c < min) min = c;
  return min === Infinity ? 0 : min;
}

/**
 * Robust noise floor on a ranking-key metric: take MAD across the repeated
 * samples WITHIN each cell (run-to-run jitter for an identical config), then the
 * max across cells as the conservative floor.
 *
 * @param {Array<Object>} rows - Rows carrying a `cellId` field.
 * @param {string} key - The ranking key ('correctness'|'format'|'efficiency').
 * @returns {number} The conservative noise floor; single-sample cells add 0.
 */
function noiseFloorForKey(rows, key) {
  const perCell = new Map();
  for (const row of rows) {
    const id = row.cellId == null ? '(cell)' : String(row.cellId);
    if (!perCell.has(id)) perCell.set(id, []);
    perCell.get(id).push(rowMetric(row, key));
  }
  let floor = 0;
  for (const series of perCell.values()) {
    const m = stats.mad(series);
    if (Number.isFinite(m) && m > floor) floor = m;
  }
  return floor;
}

/**
 * Aggregate one group's rows into per-group summary statistics.
 *
 * @param {string} name - The group name.
 * @param {Array<Object>} rows - The rows belonging to this group.
 * @returns {Object} { group, n, correctness_mean, format_adherent_rate,
 *   output_words_median, rows }; adherence rate ignores null-field rows.
 */
function aggregateGroup(name, rows) {
  const correctness = rows.map((r) => r.correctness_pass_rate);
  const words = rows.map((r) => r.output_words);
  // Adherence rate ignores rows where the field is null (a failed dispatch), so
  // a dispatch failure does not silently count as non-adherent.
  let adherentCount = 0;
  let adherentTotal = 0;
  for (const r of rows) {
    if (r.format_adherent === true) {
      adherentCount++;
      adherentTotal++;
    } else if (r.format_adherent === false) {
      adherentTotal++;
    }
  }
  return {
    group: name,
    n: rows.length,
    correctness_mean: stats.mean(correctness),
    format_adherent_rate: adherentTotal > 0 ? adherentCount / adherentTotal : NaN,
    output_words_median: stats.median(words),
    rows,
  };
}

// --- Saturation auto-detect. ---

/**
 * Flag each fixture as saturated when every cell touching it scored a perfect
 * correctness rate with zero variance — the column then carries no ranking signal
 * and harder cases (or demotion to smoke) are required.
 *
 * @param {Array<Object>} rows - Rows carrying `fixture` and
 *   `correctness_pass_rate` fields.
 * @returns {Array<Object>} Per-fixture records: { fixture, cells,
 *   correctness_mean, saturated, action }.
function report(sweepResult, opts) {
  const options = opts || {};
  if (!sweepResult || !Array.isArray(sweepResult.rows)) {
    throw new Error('report: sweepResult must carry a rows[] array');
  }
  const profile = options.profile || {};
  const reporting = profile.reporting || {};
  const groupBy = options.groupBy || reporting.groupBy || DEFAULT_GROUP_BY;

  const gateCfg =
    (profile.scoring && profile.scoring.correctnessGate) || { threshold: 1.0 };
  const minSamplesForWinner = isFiniteNumber(options.minSamplesForWinner)
    ? options.minSamplesForWinner
    : DEFAULT_MIN_SAMPLES_FOR_WINNER;

  const rows = sweepResult.rows;

  // Per-group aggregation.
  const buckets = groupRows(rows, groupBy);
  const groupAggs = [];
  for (const [name, gRows] of buckets) {
    groupAggs.push(aggregateGroup(name, gRows));
  }

  // Correctness GATE: eligibility + ranking key (correctness never blended).
  const gate = applyGate(groupAggs, gateCfg);

  // Index rank/eligibility back onto the full group list (eligible + ineligible)
  // so the leaderboard can show every group, ranked survivors first.
  const rankByGroup = new Map();
  for (const g of gate.ranked) rankByGroup.set(g.group, g.rank);
  const eligibleSet = new Set(gate.ranked.map((g) => g.group));

  // Saturation auto-detect across fixtures + a run-level rollup.
  const fixtures = detectFixtureSaturation(rows);
  const runSaturated = gate.correctness_saturated;
  const saturation = {
    status: runSaturated ? 'saturated' : 'separable',
    action: runSaturated ? 'promote-or-demote-to-smoke' : null,
    detail: runSaturated
      ? 'every eligible ' +
        groupBy +
        ' is pinned at the correctness gate; correctness cannot rank — ranked on ' +
        gate.ranking_key +
        ' instead.'
      : 'correctness still separates the eligible groups.',
    fixtures,
  };

  // Trust verdict on the gate's ranking key. The CI rigor needs to re-group the
  // raw rows back to the deciding pair, so the groupBy travels with it; bootstrap
  // knobs (iterations / confidence / seed) stay overridable for tests.
  const verdict = buildVerdict(gate.ranked, gate.ranking_key, rows, minSamplesForWinner, {
    groupBy,
    bootstrapIterations: options.bootstrapIterations,
    confidence: options.confidence,
    seed: options.bootstrapSeed,
  });

  // Build the leaderboard group list: ranked survivors first (in rank order),
  // then ineligible groups, each carrying its rank + eligibility.
  const orderedGroups = [];
  for (const g of gate.ranked) {
    orderedGroups.push({
      group: g.group,
      n: g.n,
      correctness_mean: g.correctness_mean,
      format_adherent_rate: g.format_adherent_rate,
      output_words_median: g.output_words_median,
      eligible: true,
      rank: rankByGroup.get(g.group),
    });
  }
  for (const g of groupAggs) {
    if (eligibleSet.has(g.group)) continue;
    orderedGroups.push({
      group: g.group,
      n: g.n,
      correctness_mean: g.correctness_mean,
      format_adherent_rate: g.format_adherent_rate,
      output_words_median: g.output_words_median,
      eligible: false,
      rank: null,
    });
  }

  const aggregate = {
    schema_version: SCHEMA_VERSION,
    groupBy,
    gate_threshold: gate.threshold,
    ranking_key: gate.ranking_key,
    correctness_saturated: gate.correctness_saturated,
    groups: orderedGroups,
    saturation,
    verdict,
    profile: {
      id: (sweepResult.profile && sweepResult.profile.id) || profile.id || profile.profileId || null,
      mode: (sweepResult.profile && sweepResult.profile.mode) || profile.mode || null,
      version: (sweepResult.profile && sweepResult.profile.version) || profile.version || null,
    },
  };

  const profileMeta = aggregate.profile;

exec
/bin/zsh -lc "sed -n '102,140p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
function loadConfig() {
  const explicit = process.env.DEEP_AGENT_IMPROVEMENT_CONFIG;
  const candidates = [
    explicit,
    path.join(SCRIPTS_ROOT, '..', '..', 'assets', 'agent-improvement', 'improvement_config.json'),
  ].filter(Boolean);
  for (const file of candidates) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      if (err && err.code === 'ENOENT') continue;
      console.warn('dispatch-model: could not parse optional config ' + file + ': ' + (err.message || err));
    }
  }
  return {};
}

const CONFIG = loadConfig();
const MB_CONFIG = CONFIG.modelBenchmarkConfig || {};
const TARGET = MB_CONFIG.target_model || {};
const BUDGET = MB_CONFIG.budget || {};

const DEFAULT_TIMEOUT_MS = parseInt(
  process.env.DEEP_AGENT_DISPATCH_TIMEOUT_MS || String(TARGET.timeout_ms || 600000),
  10,
);
const BACKOFF_MS = BUDGET.rate_limit_backoff_ms || [60000, 120000, 240000];
const RATE_LIMIT_PATTERNS = [
  /rate limit/i,
  /429/,
  /too many requests/i,
  /quota exceeded/i,
  /insufficient balance/i,
];

const KNOWN_EXECUTORS = new Set([
  'cli-opencode',
  'cli-claude-code',
]);

web search: 
web search: 
web search: 
web search: 
codex
The moat is not “a better leaderboard.” It is a private decision laboratory: public leaderboards nominate candidates; `model-benchmark` decides which model, prompt, and routing path minimizes real failure and operating cost on the user’s own work.

Evidence supports that distinction. Across 30 models, public-leaderboard rankings correlated below 0.5 with most unseen target-task rankings, and the leaderboard winner was best on only one target task. A separate task-aware study found semantic metrics reordered models relative to generic lexical scoring. [The Fault in Our LLM Leaderboards](https://openreview.net/forum?id=kVrKQ83PPo), [Task-Aware Evaluation](https://aclanthology.org/2025.chomps-main.1/). Small presentation changes can also move models by up to eight ranking positions, while CreditAudit finds benign protocol variation can change deployment priorities. [When Benchmarks Are Targets](https://arxiv.org/abs/2402.01781), [CreditAudit](https://arxiv.org/abs/2602.02515). These map primarily to `model-benchmark` and `runtime/gauges-observability`.

Three mechanisms sharpen this into a defensible mode:

1. Make private workload regret the primary output. Add a frozen `workload` contract containing `snapshot_id`, task cluster, traffic weight, failure severity, oracle reference, source cutoff, and exposure state. Cross it with `model × executionPath × framework × fixture × seed × protocolPerturbation`. Report public/private Kendall τ, regret from selecting the public-leaderboard winner, router regret against the per-task oracle, and performance by costly failure slice. The five dimensions remain diagnostics and hard gates; task-specific executable or human-grounded outcomes decide selection.

2. Treat hidden cases as expiring sealed canaries. Record creation hash, source timestamp, proposer visibility, oracle visibility, evaluations, disclosure, retirement, and replacement lineage as JSONL events. Materialize private payloads only inside the existing per-cell temporary directory. Generate semantically equivalent protocol siblings and measure mean, dispersion, and worst-slice quality. Time separation reduces contamination, but does not prove its absence—ICLR 2025 shows that even training on the test task, without literal leakage, confounds comparative evaluation. [Training on the Test Task](https://proceedings.iclr.cc/paper_files/paper/2025/hash/ab8c971c2ccd12bac0ab249f75e2c16d-Abstract-Conference.html), [LiveCodeBench](https://github.com/LiveCodeBench/LiveCodeBench).

3. Replace nominal “efficiency” with constrained cost selection. The current dispatcher already normalizes latency, tokens, and cost in [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:295), but [sweep-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:467) discards them, while [sweep-reporter.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:71) defines efficiency as output length. Propagate actual usage, including routing, retries, graders, and cache effects. Select the cheapest candidate whose quality lower bound and p95 latency satisfy deployment gates; report the Pareto frontier and weighted cost per successful task. Reuse the shipped paired bootstrap, then stop allocating samples to candidates whose upper bound is dominated. The very recent RoR paper provides supporting, still-unreviewed evidence for marginal correctness per unit cost. [Resample or Reroute](https://arxiv.org/abs/2607.08665).

One naming conflict needs resolution: this checkout calls model-vs-model “Mode A” and framework bakeoff “Mode B”; router-replay versus live execution belongs to skill-benchmark. Introduce an `executionPath` axis such as `router-replay | router-live | direct-live` instead of overloading those mode labels.

That yields the unique-value claim: no public leaderboard or other deep mode can measure the controlled interaction of proprietary task mix, exact workflow prompt, routing decision, model version, provider behavior, failure value, and billed runtime. One-off comparisons can observe some of it once; `model-benchmark` can preserve paired evidence, sealed provenance, uncertainty, and decision regret across model changes.

```json
{
  "new_repos": [
    {
      "name": "openai/evals",
      "url": "https://github.com/openai/evals",
      "stars": "~18.9k",
      "what": "Custom and private eval framework with registry data, templates, completion-function protocols, and approximately 691 commits; verified July 2026.",
      "lesson": "Make private workflow data a first-class evaluation source while retaining reusable scorer and dispatcher interfaces.",
      "maps_to": [
        "model-benchmark",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "LiveCodeBench/LiveCodeBench",
      "url": "https://github.com/LiveCodeBench/LiveCodeBench",
      "stars": "~907",
      "what": "Continuously versioned coding benchmark with time-window filtering in lcb_runner/evaluation/compute_scores.py and custom-output evaluation; release_v6 covers problems through April 2025.",
      "lesson": "Attach source dates and evaluation windows to private cases, rotate them, and compare rankings on post-release cases to expose contamination-sensitive reversals.",
      "maps_to": [
        "model-benchmark",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "vllm-project/guidellm",
      "url": "https://github.com/vllm-project/guidellm",
      "stars": "~1.4k",
      "what": "Production-workload benchmark supporting file and trace inputs, traffic profiles, token-level and tail-latency metrics; v0.7.1 released July 2, 2026.",
      "lesson": "Replay the real workload shape and carry TTFT, inter-token latency, end-to-end latency, throughput, and SLO violations beside quality.",
      "maps_to": [
        "model-benchmark",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "LLwork8888/CreditAudit",
      "url": "https://github.com/LLwork8888/CreditAudit",
      "stars": "~3",
      "what": "Small 2026 toolkit whose creditaudit_test.py evaluates models under aligned benign system-prompt scenarios and whose draw_a_picture.py reports mean and protocol-induced volatility.",
      "lesson": "Benchmark semantically invariant protocol siblings and treat dispersion or worst-slice loss as deployment risk, not merely noise around a mean.",
      "maps_to": [
        "model-benchmark",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "ulab-uiuc/LLMRouter",
      "url": "https://github.com/ulab-uiuc/LLMRouter",
      "stars": "~2.1k",
      "what": "Actively updated routing library with 16-plus routers, custom_tasks, price metadata, token-bearing routing records, and a July 2026 update.",
      "lesson": "Represent router replay and live execution as comparable policies over the same private task rows, including token use, per-model prices, and route regret.",
      "maps_to": [
        "model-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Public rankings should be treated as candidate-selection priors, because their top model and ordering often fail to transfer to unseen target tasks; report private-task rank correlation and public-top-1 regret explicitly.",
      "evidence": "https://openreview.net/forum?id=kVrKQ83PPo",
      "maps_to": [
        "model-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "The outcome metric is part of the model-selection treatment: compliance checks, numeric equivalence, executable assertions, and task-specific ground truth can reorder models relative to generic lexical or aggregate metrics.",
      "evidence": "https://aclanthology.org/2025.chomps-main.1/",
      "maps_to": [
        "model-benchmark"
      ],
      "confidence": "med"
    },
    {
      "insight": "Protocol robustness must be crossed with model and task rather than averaged away; benign formatting and system-prompt variations can move rankings or overturn deployment priorities.",
      "evidence": "https://arxiv.org/abs/2402.01781 and https://arxiv.org/abs/2602.02515",
      "maps_to": [
        "model-benchmark",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Contamination resistance needs provenance, time separation, secrecy, rotation, and retirement lineage; literal duplicate detection alone cannot detect training on the broader test task.",
      "evidence": "https://proceedings.iclr.cc/paper_files/paper/2025/hash/ab8c971c2ccd12bac0ab249f75e2c16d-Abstract-Conference.html and https://github.com/LiveCodeBench/LiveCodeBench",
      "maps_to": [
        "model-benchmark",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Cost-aware selection should optimize a quality-constrained Pareto frontier using complete realized cost and latency, then allocate further samples by expected decision value rather than applying a fixed weighted score.",
      "evidence": "https://arxiv.org/abs/2607.08665 and https://github.com/vllm-project/guidellm",
      "maps_to": [
        "model-benchmark",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a Private Workload Contract and executionPath axis to sweep-benchmark.cjs: freeze a stratified workload snapshot with task cluster, traffic weight, failure severity, oracle_ref, source cutoff, and exposure state; expand identical task IDs across router-replay, router-live, and direct-live paths; report public/private rank correlation, public-top-1 regret, route regret, and costly-slice failures.",
      "target": "model-benchmark, runtime/state-jsonl-checkpointing, runtime/gauges-observability",
      "rationale": "Paired own-task evidence answers the deployment question that a public aggregate cannot, while retaining public leaderboards as inexpensive shortlist priors.",
      "uniqueness": "UNIQUENESS-SHARPENING: makes proprietary workload regret recovered by in-workflow evaluation the mode's defining output, which public leaderboards and the other deep modes cannot observe.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://openreview.net/forum?id=kVrKQ83PPo and https://github.com/openai/evals"
    },
    {
      "rec": "Implement a sealed-canary JSONL lifecycle with creation hash, source timestamp, proposer and oracle visibility, evaluation count, disclosure, retirement, and replacement lineage; add invariant protocol siblings and select on quality lower bound plus protocol volatility or worst slice.",
      "target": "model-benchmark, runtime/state-jsonl-checkpointing, runtime/dedup-novelty, runtime/continuity-threading",
      "rationale": "It reduces memorization and evaluator leakage while preserving enough lineage to reproduce decisions and replace disclosed cases.",
      "uniqueness": "Private, expiring, task-derived canaries create a defensible evidence asset unavailable to public benchmarks and manual comparisons.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/LiveCodeBench/LiveCodeBench and https://arxiv.org/abs/2602.02515"
    },
    {
      "rec": "Wire dispatch-model.cjs usage fields through dispatchCell and every sweep row, including failures; aggregate inference, routing, retry, grader, and cache-adjusted cost plus p95 latency; choose the cheapest candidate whose paired quality lower bound and latency satisfy profile gates, expose the Pareto set, and stop sampling statistically dominated cells after a configurable minimum.",
      "target": "model-benchmark, runtime/budget-cost, runtime/fan-out-fan-in, runtime/gauges-observability",
      "rationale": "The checkout already has normalized usage fields and paired-bootstrap statistics, but the sweep currently discards usage and substitutes output length for efficiency.",
      "uniqueness": "Turns benchmark quality into an operational deployment decision under the user's actual prices, retries, routing overhead, and SLOs.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/vllm-project/guidellm and https://github.com/ulab-uiuc/LLMRouter"
    }
  ],
  "contradictions": [
    {
      "claim": "A generic public-leaderboard winner is a reliable default model for an unseen workflow.",
      "counter": "Leaderboard-to-target correlations were below 0.5 for most tested tasks, and the leaderboard winner was best on only one target task.",
      "evidence": "https://openreview.net/forum?id=kVrKQ83PPo"
    },
    {
      "claim": "The current model-benchmark lane already performs cost-aware selection.",
      "counter": "dispatch-model.cjs exposes normalized latency, token, and cost fields, but sweep-benchmark.cjs hardcodes token and cost fields to null and sweep-reporter.cjs ranks efficiency by output word count.",
      "evidence": ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:295; sweep-benchmark.cjs:467; lib/sweep-reporter.cjs:71"
    },
    {
      "claim": "Router replay is model-benchmark Mode A and live execution is its Mode B in the current checkout.",
      "counter": "model-benchmark/MODES.md labels model-vs-model as A and framework bakeoff as B; router-replay versus live execution is documented under skill-benchmark, creating a naming collision.",
      "evidence": ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md:18; scripts/skill-benchmark/tests/README.md:33"
    }
  ],
  "next_angles": [
    "Measure benchmark-snapshot half-life: detect when production task-cluster drift makes the private suite cease predicting live failures, then price the value of refreshing each stratum.",
    "Test privacy-preserving portability: determine which hashed task signatures, failure taxonomies, and rank statistics can be shared across organizations without exposing private prompts while retaining model-selection value.",
    "Elicit uncertain failure-cost and latency-value curves, then test whether the selected Pareto point remains stable under price, traffic-mix, and business-value perturbations."
  ],
  "notes": "Evidence establishes weak leaderboard transfer, rank reversals under task-aware scoring, and contamination or protocol risks; it does not prove private evaluation universally beats every public leaderboard. Closed-model training cutoffs and provider billing payloads remain partly opaque, so contamination resistance and realized-cost completeness need explicit confidence states. CreditAudit is a very small, recent repository, and the July 2026 resample-or-reroute result is new enough to treat as provisional."
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
224,088
