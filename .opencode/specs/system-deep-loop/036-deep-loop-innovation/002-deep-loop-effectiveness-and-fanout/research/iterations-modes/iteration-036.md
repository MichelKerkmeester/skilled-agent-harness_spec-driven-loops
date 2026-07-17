<!-- iteration 36 | SOL xhigh | mode: skill-benchmark | angle: A1-sota skill-benchmark :: 2025-2026 state of the art | 2026-07-15T11:06:20.952Z -->

The main gap is causal attribution. Cross-executor scores can show where a skill works, but they do not yet separate skill availability, activation, correct use, bundle-component value, executor compatibility, and final task success.

### What current systems add

- [SkillsBench](https://github.com/benchflow-ai/skillsbench) runs matched no-skill, curated-skill, and self-generated-skill conditions in the same task container. Its June 2026 release reports three trials across 18 model–harness configurations and separately measures invocation rate. Invocation ranges from 46% to 99%, while some invoked-skill runs still fail—direct evidence that availability, adoption, and efficacy are distinct stages. Its task packages pin the environment, contain a withheld oracle, and require deterministic outcome verifiers. `[maps: skill-benchmark; runtime/fan-out-fan-in; runtime/gauges-observability]`

- [langchain-ai/skills-benchmarks](https://github.com/langchain-ai/skills-benchmarks) decouples tasks from treatments. `CONTROL`, production-skill, split/merged-skill, concise-skill, and noise-skill treatments can be crossed with any task; `skills/noise/` explicitly measures distractor interference. This tests whether an executor selects the right skill from a realistic library, not merely whether it can use a preselected skill. `[maps: skill-benchmark; runtime/dedup-novelty]`

- [SkillLearnBench](https://github.com/cxcscmu/SkillLearnBench) evaluates three linked levels: skill-content quality, trajectory key-point coverage/order, and final outcome. Its `eval_keypoints/` and `evaluation/{skill,trajectory}/` structure localizes failures to “bad skill,” “skill ignored/misapplied,” or “execution failed despite adequate guidance.” `[maps: skill-benchmark; runtime/gauges-observability]`

- [SWE-Skills-Bench](https://github.com/GeniusHTX/SWE-Skills-Bench) ties every acceptance criterion to an execution test against a fixed repository commit. Its important result is negative: 39 of 49 skills produced no pass-rate gain, three degraded performance, and stale version-specific guidance caused some regressions. A skill benchmark therefore needs a compatibility envelope, not a global skill score. `[maps: skill-benchmark; runtime/continuity-threading]`

- Tool-use benchmarks contribute better diagnostic verifiers. [BFCL V4](https://gorilla.cs.berkeley.edu/leaderboard) separates relevance/irrelevance, missing-function, missing-parameter, long-context, multi-turn, memory, web-search, latency, and cost scores while pinning an evaluator package and repository commit. [ToolSandbox](https://github.com/apple/ToolSandbox) matches arbitrary trajectories to a milestone DAG under valid topological order, avoiding one-canonical-path scoring. [MCP-Universe](https://github.com/SalesforceAIResearch/MCP-Universe) exposes a composable `func → op → value` evaluator DSL and supports live, time-sensitive ground truth. `[maps: skill-benchmark; runtime/state-jsonl-checkpointing; runtime/gauges-observability]`

### Concrete design

Adopt a randomized, paired treatment lattice per task–executor cell:

`no-skill`, `full-skill`, `full-skill + near-neighbor distractors`, `SKILL.md-only`, `references-ablated`, `scripts-ablated`, and `compatibility-boundary/stale-environment`.

Each trial should record `task_id`, fixture hash, executor and harness revisions, provider model revision, skill bundle hash, treatment, distractor-set hash, repeat, and randomized treatment order. Use fresh cloned environments and at least three repetitions. The primary estimate remains intention-to-treat—the paired full-skill versus no-skill delta—because invocation is a post-treatment event. Aggregate repetitions inside each task, then bootstrap over tasks rather than treating trajectories as independent samples.

Add a causal-path record:

`available → discovered → opened/invoked → required key points followed → intermediate state reached → final verifier passed`.

Trajectory milestones should diagnose failures and award explanatory partial credit, but should not reject an otherwise correct artifact unless the process constraint is itself safety- or policy-critical. Outcome tests remain authoritative.

This also strengthens empty-gold handling. Replace one `empty_gold` condition with typed states: `oracle_invalid`, `outcome_unverifiable`, `baseline_saturated`, `skill_not_activated`, `skill_content_gap`, `executor_incompatible`, and `negative_transfer`. Dynamic tasks may supply an executable reference function instead of a static gold answer.

### Unique-value thesis

The moat is a versioned **Skill Contribution Certificate**, not another leaderboard. It answers questions a model benchmark cannot:

- What marginal outcome and cost change is caused by installing this exact bundle?
- Which executors discover and use it without being told its name?
- Which instructions, references, or scripts create the lift?
- Under which task slices and dependency versions does it help, do nothing, or harm?
- Can a cheaper executor plus the skill replace a stronger executor without it?
- Does the bundle expand the security or permission boundary?

Other deep modes can improve an agent, compare models, or optimize a workflow. Only `skill-benchmark` can certify a portable, separately versioned capability artifact and produce install/disable/routing decisions across an executor fleet.

```json
{
  "new_repos": [
    {
      "name": "benchflow-ai/skillsbench",
      "url": "https://github.com/benchflow-ai/skillsbench",
      "stars": "~1.5k",
      "what": "2026 benchmark using matched no-skill, curated-skill, and self-generated-skill conditions across model-harness configurations.",
      "lesson": "Treat skill availability as an intervention and report paired skill lift separately from invocation rate and absolute executor success.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/skills-benchmarks",
      "url": "https://github.com/langchain-ai/skills-benchmarks",
      "stars": "~109",
      "what": "Treatment-oriented skill benchmark with control, production, split/merged, concise, and noise-skill conditions; v0.1.0 released March 2026.",
      "lesson": "Decouple task definitions from skill treatments and add distractor libraries to measure skill selection and interference, not only assisted task completion.",
      "maps_to": [
        "skill-benchmark",
        "runtime/dedup-novelty",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "GeniusHTX/SWE-Skills-Bench",
      "url": "https://github.com/GeniusHTX/SWE-Skills-Bench",
      "stars": "~56",
      "what": "March 2026 requirement-driven paired evaluation of public SWE skills against fixed-commit repositories and deterministic tests.",
      "lesson": "Bind every gold criterion to an executable check and test version compatibility because stale skill guidance can create negative lift.",
      "maps_to": [
        "skill-benchmark",
        "runtime/continuity-threading",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "cxcscmu/SkillLearnBench",
      "url": "https://github.com/cxcscmu/SkillLearnBench",
      "stars": "~70",
      "what": "COLM 2026 benchmark evaluating generated skills at content, execution-trajectory, and task-outcome levels.",
      "lesson": "Use layered mediation metrics to distinguish defective skill content from executor non-adoption and downstream execution failure.",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "SalesforceAIResearch/MCP-Universe",
      "url": "https://github.com/SalesforceAIResearch/MCP-Universe",
      "stars": "~593",
      "what": "2025 real-world MCP benchmark framework with composable evaluators, traces, live environments, and v1.1.3 released March 2026.",
      "lesson": "Support evaluator pipelines expressed as extraction functions plus operators, including executable dynamic ground truth for time-sensitive skill tasks.",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Skill lift must be a within-task, within-executor paired contrast; an absolute with-skill score mostly measures the underlying executor and task difficulty.",
      "evidence": "https://www.skillsbench.ai/blogs/skillsbench-1-1",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Availability, invocation, trajectory compliance, and outcome are separate causal stages; primary ranking should use intention-to-treat lift while the later stages diagnose why lift was gained or lost.",
      "evidence": "https://arxiv.org/abs/2604.20087",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Near-neighbor and noise skills are necessary negative controls because a preselected-skill benchmark does not measure discovery, routing, or library interference.",
      "evidence": "https://github.com/langchain-ai/skills-benchmarks",
      "maps_to": [
        "skill-benchmark",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "A skill score without environment and dependency compatibility metadata is unsafe: version-mismatched procedural guidance can measurably reduce success.",
      "evidence": "https://arxiv.org/abs/2603.15401",
      "maps_to": [
        "skill-benchmark",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Gold scoring should combine deterministic final-state checks, non-binding milestone-DAG diagnostics, and executable dynamic reference functions rather than require one canonical trajectory or static answer.",
      "evidence": "https://github.com/apple/ToolSandbox ; https://github.com/SalesforceAIResearch/MCP-Universe",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement a randomized paired treatment lattice: no skill, full skill, full skill with distractors, SKILL.md-only, references-ablated, scripts-ablated, and compatibility-boundary variants; repeat each cell at least three times and bootstrap paired deltas over tasks.",
      "target": "skill-benchmark + runtime/fan-out-fan-in",
      "rationale": "This isolates marginal skill value, component contribution, selection interference, and executor-skill interactions while avoiding model capability masquerading as skill quality.",
      "uniqueness": "It makes the packaged skill bundle itself the manipulated artifact, which an underlying-model benchmark cannot do.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/benchflow-ai/skillsbench ; https://github.com/langchain-ai/skills-benchmarks"
    },
    {
      "rec": "Add a causal-path verifier schema recording discovery, invocation, key-point coverage/order, intermediate state milestones, final artifact tests, cost, and controlled security probes; preserve final-state tests as authoritative unless process compliance is explicitly required.",
      "target": "skill-benchmark + runtime/state-jsonl-checkpointing + runtime/gauges-observability",
      "rationale": "A final pass/fail cannot distinguish bad guidance from ignored guidance or an execution failure, while trajectory-only scoring can unfairly reject valid alternative solutions.",
      "uniqueness": "The resulting diagnosis explains how a portable skill changes executor behavior, not merely whether an agent completed a task.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/cxcscmu/SkillLearnBench ; https://github.com/apple/ToolSandbox ; https://arxiv.org/abs/2603.28815"
    },
    {
      "rec": "Emit a versioned Skill Contribution Certificate containing bundle and evaluator hashes, paired lift confidence intervals, invocation rate, component ablations, task-slice compatibility envelope, negative-transfer cases, cost/security deltas, and evidence-based expiry triggers.",
      "target": "skill-benchmark + runtime/continuity-threading + runtime/budget-cost",
      "rationale": "A global score cannot support install, disable, upgrade, or conditional fleet-routing decisions when skill value varies by executor, task slice, dependency version, and cost.",
      "uniqueness": "This is the moat: certification of a portable capability artifact and its substitution value across executors, something model-benchmark and the other deep modes cannot produce.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2603.15401 ; https://www.skillsbench.ai/blogs/skillsbench-1-1"
    }
  ],
  "contradictions": [
    {
      "claim": "Broad curated-skill evaluation reports a +16.6 percentage-point aggregate lift.",
      "counter": "Requirement-driven SWE evaluation reports only +1.2 points on average, with 39 of 49 skills showing zero gain and three showing negative lift; task selection, baseline saturation, specialization, and compatibility therefore dominate any universal skill-effect claim.",
      "evidence": "https://www.skillsbench.ai/blogs/skillsbench-1-1 ; https://arxiv.org/abs/2603.15401"
    }
  ],
  "next_angles": [
    "Estimate a skill-selection frontier by varying library size and semantic similarity of distractors, then model discovery accuracy and latency as the skill registry grows.",
    "Run bundle-component ablations with a fractional-factorial design to estimate interactions between instructions, references, scripts, and tool permissions without paying for the full power set.",
    "Define compatibility-boundary fixtures around dependency and API versions, then learn evidence-based certificate expiry and retest triggers.",
    "Compare intention-to-treat skill lift with mediator diagnostics to quantify how much lost value comes from non-activation versus incorrect guidance versus executor execution failure."
  ],
  "notes": "The newest direct skill benchmarks are mostly 2026 preprints and young repositories, so their methods are more informative than their ecosystem maturity. Cross-study lift numbers are not directly comparable because task selection and baseline saturation differ. A remaining coverage gap is a statistically rigorous, open benchmark that crosses multiple executors, multiple harnesses, realistic distractor libraries, component ablations, security probes, and compatibility drift in one design."
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
session id: 019f6570-bcff-7b02-aafd-f88639868738
--------
user
You are iteration 36/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: skill-benchmark
MODE IDENTITY (what it does today): deep-improvement variant: benchmarking a SKILL (packaged instruction+resource bundle) across executors, gold-set scoring, empty-gold detection.
GENERIC ALTERNATIVE it must out-value: benchmarking the underlying model instead of the skill, or no skill eval at all

THIS ITERATION'S ANGLE (A1-sota): skill-benchmark :: 2025-2026 state of the art
DIRECTIVE: Survey the NEWEST (2025-2026) capability/skill/tool-use evaluation systems (agent skill evals, tool-use & function-calling benchmarks, tau-bench, SWE-bench/agent harnesses, gorilla/BFCL, task-completion suites). What do their capability-attribution methods do that our cross-executor skill-benchmark variant does NOT? Real repos/URLs + adoptable mechanisms.

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

ALWAYS answer BOTH: (1) concrete improvements to make skill-benchmark more effective; (2) the UNIQUE-VALUE / moat thesis — what skill-benchmark can do that benchmarking the underlying model instead of the skill, or no skill eval at all and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (148) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform, IBM/prompt-declaration-language, EvoAgentX/EvoAgentX, aiwaves-cn/agents, YaoZ720/SwarmAgenticCode, taowangcheng/SePO, Junjie-Ye/CCTU, CAR-bench/car-bench, claw-eval/claw-eval, agentevals-dev/agentevals, harbor-framework/harbor, sentient-agi/EvoSkill, maitrix-org/PromptAgent, agiresearch/ASB, normster/SystemCheck, microsoftarchive/promptbench, THUDM/AgentBench, stanford-crfm/helm, invariantlabs-ai/invariant, langwatch/scenario, METR/public-tasks, jaineet17/causal-agent-replay, Peiyu-Georgia-Li/ATLAS, lmarena/p2l, aims-foundations/reeval, IBM/eval-assist, Code2Bench/Code2Bench, megagonlabs/FuncBenchGen, openai/evals, LiveCodeBench/LiveCodeBench, vllm-project/guidellm, LLwork8888/CreditAudit, ulab-uiuc/LLMRouter, ianarawjo/evalstats, dustalov/evalica, huggingface/datatrove, allenai/fluid-benchmarking, sksoumik/llm-as-judge, eth-sri/ConStat, sambowyer/bayes_evals, penfever/judgment-to-noise, SKYLENAGE-AI/HLE-Verified, Shreyaskc/BabelJudge, IBM/unitxt, Shreyaskc/evalci, mjpost/sacrebleu, llm-d/llm-d-benchmark
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment | agent-improvement | model-benchmark
New insights so far: 155; recommendations: 102.
Open threads flagged: Inject controlled oracle corruption into 1%, 3%, and 5% of fixtures and measure which gold-audit sampling and adjudication policy detects the corruption before it changes selection. | Prototype ConStat on one private task family using fresh equivalent fixtures and measure whether performance-inflation exclusions alter the selected local model enough to justify the reference-panel cost. | Selection half-life: measure how quickly a certificate becomes stale under silent provider model updates, pricing changes, workload drift, and judge-version drift, then derive evidence-based retest triggers. | Conditional routing extraction: when no global winner exists, learn the smallest interpretable task-slice routing policy and compare its net value against single-model selection after routing latency, complexity, and monitoring costs. | Trajectory-twin fidelity: define incumbent self-replay metrics over tool calls, state transitions, final artifacts, and failure modes, then determine which fidelity thresholds preserve model rank ordering. | Utility elicitation: replace arbitrary five-dimension weights with explicit costs for errors, human rework, latency, abstention, and switching, and report the parameter regions in which each candidate is optimal.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "skill-benchmark"): skill-benchmark, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
This is read-only research, so no spec-folder choice is needed. I’m routing it as a mode-specific benchmark analysis: first verify the newest primary sources and repository metadata, then extract mechanisms that isolate the skill’s causal contribution rather than the executor’s raw capability.
exec
/bin/zsh -lc "node \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/skill-advisor.cjs\" advisor_recommend --json '{\"prompt\":\"Iteration 36/40 read-only research: newest 2025-2026 capability, skill, tool-use and function-calling evaluation systems; find mode-specific improvements and unique moat for skill-benchmark, avoiding all previously catalogued repos.\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "node \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/spec-memory.cjs\" memory_match_triggers --json '{\"prompt\":\"Iteration 36/40 read-only research: newest 2025-2026 capability, skill, tool-use and function-calling evaluation systems; find mode-specific improvements and unique moat for skill-benchmark, avoiding all previously catalogued repos.\"}' --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 173ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-skill-advisor/daemon-ipc.sock",
  "exitCode": 75
}

 exited 75 in 3289ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

codex
The local memory and skill-advisor daemons are present but inaccessible in this sandbox (`EPERM` on their sockets), so there is no recovered prior context beyond the exclusion lists in your prompt. Skill routing therefore falls back to the explicit `skill-benchmark` research directive; the available artifact skills do not apply.
web search: 
web search: 2025 agent skill evaluation benchmark GitHub tool use skill benchmark ...
web search: 
web search: site:github.com 2025 MCP-Universe benchmark tool use agents repository ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: SkillsBench paper skill lift invocation rate paired no skill with skill 2026 ...
codex
The strongest divergence from prior runtime work is now clear: the benchmark needs a causal decomposition, not another aggregate leaderboard. Current skill-centric systems separate “skill available,” “skill actually invoked,” “trajectory changed,” “task succeeded,” and “cost/security changed”; that separation exposes negative transfer and executor–skill incompatibility that cross-executor scoring alone can hide.
web search: 
web search: https://github.com/GeniusHTX/SWE-Skills-Bench
web search: 
web search: 
web search: 
web search: 'Evaluator'
web search: 
web search: https://arxiv.org/abs/2508.14704
web search: 
web search: 
web search: 
web search: 
web search: 
web search: Berkeley Function Calling Leaderboard V4 GitHub 2025 multi turn state evaluation ...
web search: 
web search: 
codex
The main gap is causal attribution. Cross-executor scores can show where a skill works, but they do not yet separate skill availability, activation, correct use, bundle-component value, executor compatibility, and final task success.

### What current systems add

- [SkillsBench](https://github.com/benchflow-ai/skillsbench) runs matched no-skill, curated-skill, and self-generated-skill conditions in the same task container. Its June 2026 release reports three trials across 18 model–harness configurations and separately measures invocation rate. Invocation ranges from 46% to 99%, while some invoked-skill runs still fail—direct evidence that availability, adoption, and efficacy are distinct stages. Its task packages pin the environment, contain a withheld oracle, and require deterministic outcome verifiers. `[maps: skill-benchmark; runtime/fan-out-fan-in; runtime/gauges-observability]`

- [langchain-ai/skills-benchmarks](https://github.com/langchain-ai/skills-benchmarks) decouples tasks from treatments. `CONTROL`, production-skill, split/merged-skill, concise-skill, and noise-skill treatments can be crossed with any task; `skills/noise/` explicitly measures distractor interference. This tests whether an executor selects the right skill from a realistic library, not merely whether it can use a preselected skill. `[maps: skill-benchmark; runtime/dedup-novelty]`

- [SkillLearnBench](https://github.com/cxcscmu/SkillLearnBench) evaluates three linked levels: skill-content quality, trajectory key-point coverage/order, and final outcome. Its `eval_keypoints/` and `evaluation/{skill,trajectory}/` structure localizes failures to “bad skill,” “skill ignored/misapplied,” or “execution failed despite adequate guidance.” `[maps: skill-benchmark; runtime/gauges-observability]`

- [SWE-Skills-Bench](https://github.com/GeniusHTX/SWE-Skills-Bench) ties every acceptance criterion to an execution test against a fixed repository commit. Its important result is negative: 39 of 49 skills produced no pass-rate gain, three degraded performance, and stale version-specific guidance caused some regressions. A skill benchmark therefore needs a compatibility envelope, not a global skill score. `[maps: skill-benchmark; runtime/continuity-threading]`

- Tool-use benchmarks contribute better diagnostic verifiers. [BFCL V4](https://gorilla.cs.berkeley.edu/leaderboard) separates relevance/irrelevance, missing-function, missing-parameter, long-context, multi-turn, memory, web-search, latency, and cost scores while pinning an evaluator package and repository commit. [ToolSandbox](https://github.com/apple/ToolSandbox) matches arbitrary trajectories to a milestone DAG under valid topological order, avoiding one-canonical-path scoring. [MCP-Universe](https://github.com/SalesforceAIResearch/MCP-Universe) exposes a composable `func → op → value` evaluator DSL and supports live, time-sensitive ground truth. `[maps: skill-benchmark; runtime/state-jsonl-checkpointing; runtime/gauges-observability]`

### Concrete design

Adopt a randomized, paired treatment lattice per task–executor cell:

`no-skill`, `full-skill`, `full-skill + near-neighbor distractors`, `SKILL.md-only`, `references-ablated`, `scripts-ablated`, and `compatibility-boundary/stale-environment`.

Each trial should record `task_id`, fixture hash, executor and harness revisions, provider model revision, skill bundle hash, treatment, distractor-set hash, repeat, and randomized treatment order. Use fresh cloned environments and at least three repetitions. The primary estimate remains intention-to-treat—the paired full-skill versus no-skill delta—because invocation is a post-treatment event. Aggregate repetitions inside each task, then bootstrap over tasks rather than treating trajectories as independent samples.

Add a causal-path record:

`available → discovered → opened/invoked → required key points followed → intermediate state reached → final verifier passed`.

Trajectory milestones should diagnose failures and award explanatory partial credit, but should not reject an otherwise correct artifact unless the process constraint is itself safety- or policy-critical. Outcome tests remain authoritative.

This also strengthens empty-gold handling. Replace one `empty_gold` condition with typed states: `oracle_invalid`, `outcome_unverifiable`, `baseline_saturated`, `skill_not_activated`, `skill_content_gap`, `executor_incompatible`, and `negative_transfer`. Dynamic tasks may supply an executable reference function instead of a static gold answer.

### Unique-value thesis

The moat is a versioned **Skill Contribution Certificate**, not another leaderboard. It answers questions a model benchmark cannot:

- What marginal outcome and cost change is caused by installing this exact bundle?
- Which executors discover and use it without being told its name?
- Which instructions, references, or scripts create the lift?
- Under which task slices and dependency versions does it help, do nothing, or harm?
- Can a cheaper executor plus the skill replace a stronger executor without it?
- Does the bundle expand the security or permission boundary?

Other deep modes can improve an agent, compare models, or optimize a workflow. Only `skill-benchmark` can certify a portable, separately versioned capability artifact and produce install/disable/routing decisions across an executor fleet.

```json
{
  "new_repos": [
    {
      "name": "benchflow-ai/skillsbench",
      "url": "https://github.com/benchflow-ai/skillsbench",
      "stars": "~1.5k",
      "what": "2026 benchmark using matched no-skill, curated-skill, and self-generated-skill conditions across model-harness configurations.",
      "lesson": "Treat skill availability as an intervention and report paired skill lift separately from invocation rate and absolute executor success.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/skills-benchmarks",
      "url": "https://github.com/langchain-ai/skills-benchmarks",
      "stars": "~109",
      "what": "Treatment-oriented skill benchmark with control, production, split/merged, concise, and noise-skill conditions; v0.1.0 released March 2026.",
      "lesson": "Decouple task definitions from skill treatments and add distractor libraries to measure skill selection and interference, not only assisted task completion.",
      "maps_to": [
        "skill-benchmark",
        "runtime/dedup-novelty",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "GeniusHTX/SWE-Skills-Bench",
      "url": "https://github.com/GeniusHTX/SWE-Skills-Bench",
      "stars": "~56",
      "what": "March 2026 requirement-driven paired evaluation of public SWE skills against fixed-commit repositories and deterministic tests.",
      "lesson": "Bind every gold criterion to an executable check and test version compatibility because stale skill guidance can create negative lift.",
      "maps_to": [
        "skill-benchmark",
        "runtime/continuity-threading",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "cxcscmu/SkillLearnBench",
      "url": "https://github.com/cxcscmu/SkillLearnBench",
      "stars": "~70",
      "what": "COLM 2026 benchmark evaluating generated skills at content, execution-trajectory, and task-outcome levels.",
      "lesson": "Use layered mediation metrics to distinguish defective skill content from executor non-adoption and downstream execution failure.",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "SalesforceAIResearch/MCP-Universe",
      "url": "https://github.com/SalesforceAIResearch/MCP-Universe",
      "stars": "~593",
      "what": "2025 real-world MCP benchmark framework with composable evaluators, traces, live environments, and v1.1.3 released March 2026.",
      "lesson": "Support evaluator pipelines expressed as extraction functions plus operators, including executable dynamic ground truth for time-sensitive skill tasks.",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Skill lift must be a within-task, within-executor paired contrast; an absolute with-skill score mostly measures the underlying executor and task difficulty.",
      "evidence": "https://www.skillsbench.ai/blogs/skillsbench-1-1",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Availability, invocation, trajectory compliance, and outcome are separate causal stages; primary ranking should use intention-to-treat lift while the later stages diagnose why lift was gained or lost.",
      "evidence": "https://arxiv.org/abs/2604.20087",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Near-neighbor and noise skills are necessary negative controls because a preselected-skill benchmark does not measure discovery, routing, or library interference.",
      "evidence": "https://github.com/langchain-ai/skills-benchmarks",
      "maps_to": [
        "skill-benchmark",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "A skill score without environment and dependency compatibility metadata is unsafe: version-mismatched procedural guidance can measurably reduce success.",
      "evidence": "https://arxiv.org/abs/2603.15401",
      "maps_to": [
        "skill-benchmark",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Gold scoring should combine deterministic final-state checks, non-binding milestone-DAG diagnostics, and executable dynamic reference functions rather than require one canonical trajectory or static answer.",
      "evidence": "https://github.com/apple/ToolSandbox ; https://github.com/SalesforceAIResearch/MCP-Universe",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement a randomized paired treatment lattice: no skill, full skill, full skill with distractors, SKILL.md-only, references-ablated, scripts-ablated, and compatibility-boundary variants; repeat each cell at least three times and bootstrap paired deltas over tasks.",
      "target": "skill-benchmark + runtime/fan-out-fan-in",
      "rationale": "This isolates marginal skill value, component contribution, selection interference, and executor-skill interactions while avoiding model capability masquerading as skill quality.",
      "uniqueness": "It makes the packaged skill bundle itself the manipulated artifact, which an underlying-model benchmark cannot do.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/benchflow-ai/skillsbench ; https://github.com/langchain-ai/skills-benchmarks"
    },
    {
      "rec": "Add a causal-path verifier schema recording discovery, invocation, key-point coverage/order, intermediate state milestones, final artifact tests, cost, and controlled security probes; preserve final-state tests as authoritative unless process compliance is explicitly required.",
      "target": "skill-benchmark + runtime/state-jsonl-checkpointing + runtime/gauges-observability",
      "rationale": "A final pass/fail cannot distinguish bad guidance from ignored guidance or an execution failure, while trajectory-only scoring can unfairly reject valid alternative solutions.",
      "uniqueness": "The resulting diagnosis explains how a portable skill changes executor behavior, not merely whether an agent completed a task.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/cxcscmu/SkillLearnBench ; https://github.com/apple/ToolSandbox ; https://arxiv.org/abs/2603.28815"
    },
    {
      "rec": "Emit a versioned Skill Contribution Certificate containing bundle and evaluator hashes, paired lift confidence intervals, invocation rate, component ablations, task-slice compatibility envelope, negative-transfer cases, cost/security deltas, and evidence-based expiry triggers.",
      "target": "skill-benchmark + runtime/continuity-threading + runtime/budget-cost",
      "rationale": "A global score cannot support install, disable, upgrade, or conditional fleet-routing decisions when skill value varies by executor, task slice, dependency version, and cost.",
      "uniqueness": "This is the moat: certification of a portable capability artifact and its substitution value across executors, something model-benchmark and the other deep modes cannot produce.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2603.15401 ; https://www.skillsbench.ai/blogs/skillsbench-1-1"
    }
  ],
  "contradictions": [
    {
      "claim": "Broad curated-skill evaluation reports a +16.6 percentage-point aggregate lift.",
      "counter": "Requirement-driven SWE evaluation reports only +1.2 points on average, with 39 of 49 skills showing zero gain and three showing negative lift; task selection, baseline saturation, specialization, and compatibility therefore dominate any universal skill-effect claim.",
      "evidence": "https://www.skillsbench.ai/blogs/skillsbench-1-1 ; https://arxiv.org/abs/2603.15401"
    }
  ],
  "next_angles": [
    "Estimate a skill-selection frontier by varying library size and semantic similarity of distractors, then model discovery accuracy and latency as the skill registry grows.",
    "Run bundle-component ablations with a fractional-factorial design to estimate interactions between instructions, references, scripts, and tool permissions without paying for the full power set.",
    "Define compatibility-boundary fixtures around dependency and API versions, then learn evidence-based certificate expiry and retest triggers.",
    "Compare intention-to-treat skill lift with mediator diagnostics to quantify how much lost value comes from non-activation versus incorrect guidance versus executor execution failure."
  ],
  "notes": "The newest direct skill benchmarks are mostly 2026 preprints and young repositories, so their methods are more informative than their ecosystem maturity. Cross-study lift numbers are not directly comparable because task selection and baseline saturation differ. A remaining coverage gap is a statistically rigorous, open benchmark that crosses multiple executors, multiple harnesses, realistic distractor libraries, component ablations, security probes, and compatibility drift in one design."
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
154,891
