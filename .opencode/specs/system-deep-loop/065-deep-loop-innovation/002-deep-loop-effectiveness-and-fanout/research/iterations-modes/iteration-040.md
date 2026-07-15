<!-- iteration 40 | SOL xhigh | mode: skill-benchmark | angle: A5-synth skill-benchmark :: synthesis & highest-leverage recs | 2026-07-15T11:26:16.674Z -->

## Thesis

`skill-benchmark` should become the certificate authority for versioned behavioral dependencies.

A model benchmark asks whether model `M` can solve task `T`. A skill benchmark should answer the more operational question: whether installing exact bundle `S@digest` causes incremental value under executor, registry, tool, permission, and dependency conditions—and when that claim expires. That counterfactual attribution is the moat. Deep-improvement can mutate a skill; deep-review can inspect it; councils can judge outputs. None inherently establish deployable causal lift, activation reliability, negative transfer, or cross-skill interference.

## Highest-leverage recommendations

1. **Issue one canonical Skill Effect Certificate — impact high, effort M.**

Run randomized paired arms per task and executor:

- `no_skill`: existing environment without the bundle.
- `auto_route`: bundle installed and normally discoverable.
- `forced_activation`: exact bundle injected or activated.
- Targeted component arms when attribution is requested.

Report `Δdeploy = auto_route − no_skill`, `Δforced = forced_activation − no_skill`, and `routing_gap = forced_activation − auto_route`. The routing gap is diagnostic, not automatically a causal mediator estimate: forcing activation also changes context and potentially behavior.

The certificate should bind skill/component digests, evaluation and gold digests, executor/harness versions, registry snapshot, tool schemas, permissions, dependency locks, outcome distributions, activation confusion matrices, negative-transfer probability, cost per successful task, and tested compatibility ranges. Emit `issued`, `withheld`, or `expired` events into JSONL. An empty gold set must yield `withheld`; routing, safety, and cost evidence may still be published, but not an effectiveness verdict.

[NVIDIA/skills](https://github.com/NVIDIA/skills) demonstrates the right artifact direction—co-located evaluation data, signatures, skill cards, and `BENCHMARK.md`—but also exposes the freshness problem. At the browsed snapshot, its [benchmark report](https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/BENCHMARK.md) is dated May 28 and describes seven tasks, while the [skill card](https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/skill-card.md) describes eleven tasks, different results, and a June 30 skill SHA. Generate every human-facing report from one content-addressed certificate rather than maintaining parallel mutable summaries.

Maps to: `skill-benchmark`, `runtime/state-jsonl-checkpointing`, `runtime/gauges-observability`, `runtime/continuity-threading`.

2. **Benchmark the skill ecology, not only the isolated bundle — impact high, effort M.**

Construct registry stress grids over library size, hard-negative semantic similarity, and required composition depth. Record the candidate set, target rank, selected skills, activation sequence, plan edges, latency, task effect, and unsafe side effects. The output should be:

- A discovery frontier: maximum tested registry complexity at a declared recall/latency target.
- An interference graph: versioned skill nodes and confidence-weighted synergy, conflict, capability-flow, trust-transfer, and authorization-confusion edges.

[AgentSkillOS](https://github.com/ynulihao/AgentSkillOS) supplies concrete adapters: `src/manager/tree/searcher.py`, `layered_searcher.py`, `dormant_searcher.py`, and `src/workflow/evaluation.py`; it also exercises 200/1K/200K-skill regimes. [SCR-Bench](https://github.com/saint-viperx/SCR_Bench) supplies a useful composition matrix—`A_only`, `B_only`, `A+B_neutral`, `A+B_explicit`—and three path-risk classes. Start fan-out with skill pairs sharing tools, permissions, outputs, or high semantic similarity; expand only edges whose confidence intervals remain decision-relevant.

This sharpens uniqueness directly: model benchmarks cannot certify whether a package remains discoverable or safe when neighboring packages change.

Maps to: `skill-benchmark`, `runtime/fan-out-fan-in`, `runtime/budget-cost`, `runtime/gauges-observability`.

3. **Add adaptive bundle-component attribution — impact high, effort M.**

Treat metadata/description, core instructions, examples, references, scripts, and permission grants as explicit factors. Use randomized blocks by task, executor, and seed.

Start with `SALib.sample.ff.sample()` and `SALib.analyze.ff.analyze(..., second_order=True)` for inexpensive screening; its dummy factors also provide an empirical noise check. Fractional designs alias effects, so confirm important or ambiguous pairs with exact `2×2` experiments. For a reduced component set, compute exact coalition values; use [SHAP](https://github.com/shap/shap) interaction values only after validating a reward surrogate on held-out trials.

Publish main effects, confirmed interactions, minimum-effective-bundle candidates, and components associated with negative transfer. This converts “the skill helped” into “these distributable resources caused the lift,” something an underlying-model benchmark cannot establish.

Maps to: `skill-benchmark`, `runtime/fan-out-fan-in`, `runtime/budget-cost`, `runtime/dedup-novelty`.

Remaining gaps are cross-executor activation telemetry, causal identification when forced activation changes context, principled sample sizes for sparse gold sets, and learned expiry rules. Those are now narrower engineering and experimental-design problems; the mode thesis itself is settled.

```json
{
  "new_repos": [
    {
      "name": "NVIDIA/skills",
      "url": "https://github.com/NVIDIA/skills",
      "stars": "~2.5k",
      "what": "Daily-synced signed skill catalog with evaluation datasets, skill cards, and per-skill benchmark reports; active through June/July 2026.",
      "lesson": "Co-locate provenance and uplift evidence, but generate all views from one content-addressed effect certificate to prevent freshness divergence.",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "ynulihao/AgentSkillOS",
      "url": "https://github.com/ynulihao/AgentSkillOS",
      "stars": "~551",
      "what": "Hierarchical skill retrieval and DAG orchestration over large registries, with benchmark and modular architecture released in March 2026.",
      "lesson": "Turn registry size and distractor similarity into controlled benchmark factors and instrument retrieval separately from orchestration.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "saint-viperx/SCR_Bench",
      "url": "https://github.com/saint-viperx/SCR_Bench",
      "stars": "~13",
      "what": "June 2026 skill-composition security benchmark covering capability flow, trust transfer, and authorization confusion.",
      "lesson": "Evaluate activated skill paths with isolated and composed treatment arms; benign per-skill scores do not imply benign composition.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "SALib/SALib",
      "url": "https://github.com/SALib/SALib",
      "stars": "~986",
      "what": "Active Python sensitivity-analysis library with fractional-factorial, Morris, Sobol, and interaction analysis; v1.5.2 released October 2025.",
      "lesson": "Use fractional-factorial screening and dummy factors to find influential bundle components before paying for confirmatory interaction trials.",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "shap/shap",
      "url": "https://github.com/shap/shap",
      "stars": "~25.6k",
      "what": "Game-theoretic attribution library with exact, partition/Owen, and pairwise interaction mechanisms; v0.52.0 released May 28, 2026.",
      "lesson": "After screening reduces the coalition space, attribute bundle value and interactions while respecting hierarchical component groupings.",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "The correct product of skill-benchmark is a versioned effect certificate with a validity domain, not a leaderboard row.",
      "evidence": "https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/BENCHMARK.md",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Three randomized arms separate deployable intention-to-treat lift from forced-use capability and expose a diagnostic routing gap; observational activation traces alone cannot make that decomposition causal.",
      "evidence": "https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/skill-card.md",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Skill quality is ecology-dependent: discovery degrades with registry complexity, while safety failures can emerge only along composed activation paths.",
      "evidence": "https://github.com/ynulihao/AgentSkillOS; https://arxiv.org/abs/2606.15242",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "A two-stage design—fractional-factorial screening followed by exact confirmation of selected interactions—can attribute bundle effects without evaluating the full component power set.",
      "evidence": "https://salib.readthedocs.io/en/latest/api/SALib.analyze.html; https://github.com/shap/shap",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement skill-effect-certificate.v1 as the canonical output, backed by randomized no-skill, auto-route, and forced-activation arms; bind every claim to bundle, gold, executor, registry, tool, permission, and dependency digests, and emit explicit issued, withheld, and expired JSONL events.",
      "target": "skill-benchmark + runtime/state-jsonl-checkpointing",
      "rationale": "It unifies uplift, activation, cost, risk, compatibility, empty-gold handling, and freshness into one reproducible decision artifact.",
      "uniqueness": "Makes skill-benchmark the causal assurance layer for portable behavioral dependencies, which model benchmarks and qualitative improvement modes cannot provide.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/NVIDIA/skills"
    },
    {
      "rec": "Add a registry-scaling and composition lane that varies library size, hard-negative similarity, and composition depth, then emits discovery frontiers and confidence-weighted cross-skill interference graphs.",
      "target": "skill-benchmark + runtime/fan-out-fan-in",
      "rationale": "Isolated uplift does not predict whether a skill will be found, correctly composed, or remain safe in a realistic skill library.",
      "uniqueness": "Certifies the deployability of the skill ecosystem rather than the raw capability of the executor.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/ynulihao/AgentSkillOS; https://github.com/saint-viperx/SCR_Bench"
    },
    {
      "rec": "Add adaptive component attribution using fractional-factorial screening, task/executor blocking, and exact confirmatory trials for selected component pairs; publish minimum-effective-bundle and negative-interaction findings.",
      "target": "skill-benchmark + runtime/budget-cost",
      "rationale": "It identifies which instructions, references, scripts, examples, and permissions create value without paying for the full subset matrix.",
      "uniqueness": "Attributes improvement to distributable skill resources rather than leaving the gain confounded with the underlying model.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/SALib/SALib; https://github.com/shap/shap"
    }
  ],
  "contradictions": [
    {
      "claim": "A signed or verified skill is an effective skill.",
      "counter": "A signature establishes artifact integrity, not causal efficacy; effectiveness requires separate counterfactual evidence and a validity domain.",
      "evidence": "https://github.com/NVIDIA/skills#verifying-skills"
    },
    {
      "claim": "A skill's isolated benchmark score is sufficient for deployment.",
      "counter": "Composition can create capability-flow, trust-transfer, and authorization-confusion failures that are absent in isolated arms.",
      "evidence": "https://arxiv.org/abs/2606.15242"
    },
    {
      "claim": "One skill-on versus skill-off score explains why value was gained or lost.",
      "counter": "That comparison estimates an aggregate treatment effect but cannot distinguish discovery, activation, guidance, execution, or component interactions without additional randomized arms.",
      "evidence": "https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/BENCHMARK.md"
    }
  ],
  "next_angles": [
    "Run a certificate-expiry replay study that independently mutates skill content, executor version, dependency versions, tool schemas, permissions, and registry composition to learn targeted versus full-retest triggers.",
    "Estimate a two-dimensional discovery frontier by jointly varying registry size and semantic similarity of hard-negative skills, then fit change points for recall, false activation, latency, and task uplift.",
    "Design a cross-executor activation-trace contract that distinguishes discovery, loading, instruction use, script execution, and downstream side effects without relying solely on executor self-report.",
    "Derive sequential sample-size and stopping rules for sparse-gold skill evaluations using minimum detectable uplift, negative-transfer risk, executor heterogeneity, and judge disagreement."
  ],
  "notes": "The main unresolved risks are non-standard activation telemetry, small and potentially contaminated gold sets, the non-causal nature of an unrandomized routing-gap estimate, and lack of a shared certificate schema. The NVIDIA benchmark/card divergence at the browsed snapshot is strong evidence for canonical generated certificates, but it may reflect asynchronous publication rather than an evaluation error."
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
session id: 019f6583-da4f-7a42-ba4c-c3eaf814b1cf
--------
user
You are iteration 40/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: skill-benchmark
MODE IDENTITY (what it does today): deep-improvement variant: benchmarking a SKILL (packaged instruction+resource bundle) across executors, gold-set scoring, empty-gold detection.
GENERIC ALTERNATIVE it must out-value: benchmarking the underlying model instead of the skill, or no skill eval at all

THIS ITERATION'S ANGLE (A5-synth): skill-benchmark :: synthesis & highest-leverage recs
DIRECTIVE: Synthesis pass for skill-benchmark. Highest-leverage MODE-SPECIFIC recommendations (impact x effort) + a sharp 'why skill-benchmark is uniquely valuable and how we make it more so' thesis. Remaining gaps + next_angles.

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
THIS run's new repos so far (158) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform, IBM/prompt-declaration-language, EvoAgentX/EvoAgentX, aiwaves-cn/agents, YaoZ720/SwarmAgenticCode, taowangcheng/SePO, Junjie-Ye/CCTU, CAR-bench/car-bench, claw-eval/claw-eval, agentevals-dev/agentevals, harbor-framework/harbor, sentient-agi/EvoSkill, maitrix-org/PromptAgent, agiresearch/ASB, normster/SystemCheck, microsoftarchive/promptbench, THUDM/AgentBench, stanford-crfm/helm, invariantlabs-ai/invariant, langwatch/scenario, METR/public-tasks, jaineet17/causal-agent-replay, Peiyu-Georgia-Li/ATLAS, lmarena/p2l, aims-foundations/reeval, IBM/eval-assist, Code2Bench/Code2Bench, megagonlabs/FuncBenchGen, openai/evals, LiveCodeBench/LiveCodeBench, vllm-project/guidellm, LLwork8888/CreditAudit, ulab-uiuc/LLMRouter, ianarawjo/evalstats, dustalov/evalica, huggingface/datatrove, allenai/fluid-benchmarking, sksoumik/llm-as-judge, eth-sri/ConStat, sambowyer/bayes_evals, penfever/judgment-to-noise, SKYLENAGE-AI/HLE-Verified, Shreyaskc/BabelJudge, IBM/unitxt, Shreyaskc/evalci, mjpost/sacrebleu, llm-d/llm-d-benchmark, benchflow-ai/skillsbench, langchain-ai/skills-benchmarks, GeniusHTX/SWE-Skills-Bench, cxcscmu/SkillLearnBench, SalesforceAIResearch/MCP-Universe, UCSB-NLP-Chang/Skill-Usage, agent-ecosystem/agent-skill-implementation, anthropics/skills, agentskills/agentskills, py-why/EconML
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment | agent-improvement | model-benchmark | skill-benchmark
New insights so far: 164; recommendations: 108.
Open threads flagged: Estimate a skill-selection frontier by varying library size and semantic similarity of distractors, then model discovery accuracy and latency as the skill registry grows. | Run bundle-component ablations with a fractional-factorial design to estimate interactions between instructions, references, scripts, and tool permissions without paying for the full power set. | Define compatibility-boundary fixtures around dependency and API versions, then learn evidence-based certificate expiry and retest triggers. | Compare intention-to-treat skill lift with mediator diagnostics to quantify how much lost value comes from non-activation versus incorrect guidance versus executor execution failure. | Cross-skill interference attribution: use sparse factorial or Shapley approximations to identify which skill combinations cause instruction conflicts, context pruning, or positive composition. | Skill-effect certificate expiry: learn which runtime, model, dependency, and bundle changes invalidate prior attribution without requiring a full matrix rerun.

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
This is a read-only synthesis pass, so no spec-folder choice is needed. I’m routing it through the user-specified `skill-benchmark` mode, loading the prior-loop context triggers first, then verifying a small set of newer or adjacent mechanisms against primary sources.
codex
The synthesis hinges on attribution, not another leaderboard: a skill is a versioned intervention whose value can fail at discovery, activation, guidance, execution, or interaction with other skills. I’m checking mechanisms for those separations and for certificate invalidation—the parts model-only benchmarks cannot expose.
web search: 
web search: GitHub benchmark agent skills skill discovery activation evaluation repository 2026 ...
web search: 
web search: 
web search: 
web search: 'Stars'
web search: 
web search: GitHub pyDOE3 fractional factorial design repository ...
codex
The strongest pattern is now clear: certify the intervention, then stress its ecology. A scalar “skill uplift” is too lossy; the mode needs a causal certificate plus an interference graph, both keyed to the exact bundle, executor, registry, permissions, and dependency snapshot.
web search: 
web search: 
web search: 
web search: 'run_experiment.py'
web search: 
web search: 
web search: 
web search: site:salib.readthedocs.io SALib.sample.ff SALib.analyze.ff fractional factorial API ...
codex
## Thesis

`skill-benchmark` should become the certificate authority for versioned behavioral dependencies.

A model benchmark asks whether model `M` can solve task `T`. A skill benchmark should answer the more operational question: whether installing exact bundle `S@digest` causes incremental value under executor, registry, tool, permission, and dependency conditions—and when that claim expires. That counterfactual attribution is the moat. Deep-improvement can mutate a skill; deep-review can inspect it; councils can judge outputs. None inherently establish deployable causal lift, activation reliability, negative transfer, or cross-skill interference.

## Highest-leverage recommendations

1. **Issue one canonical Skill Effect Certificate — impact high, effort M.**

Run randomized paired arms per task and executor:

- `no_skill`: existing environment without the bundle.
- `auto_route`: bundle installed and normally discoverable.
- `forced_activation`: exact bundle injected or activated.
- Targeted component arms when attribution is requested.

Report `Δdeploy = auto_route − no_skill`, `Δforced = forced_activation − no_skill`, and `routing_gap = forced_activation − auto_route`. The routing gap is diagnostic, not automatically a causal mediator estimate: forcing activation also changes context and potentially behavior.

The certificate should bind skill/component digests, evaluation and gold digests, executor/harness versions, registry snapshot, tool schemas, permissions, dependency locks, outcome distributions, activation confusion matrices, negative-transfer probability, cost per successful task, and tested compatibility ranges. Emit `issued`, `withheld`, or `expired` events into JSONL. An empty gold set must yield `withheld`; routing, safety, and cost evidence may still be published, but not an effectiveness verdict.

[NVIDIA/skills](https://github.com/NVIDIA/skills) demonstrates the right artifact direction—co-located evaluation data, signatures, skill cards, and `BENCHMARK.md`—but also exposes the freshness problem. At the browsed snapshot, its [benchmark report](https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/BENCHMARK.md) is dated May 28 and describes seven tasks, while the [skill card](https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/skill-card.md) describes eleven tasks, different results, and a June 30 skill SHA. Generate every human-facing report from one content-addressed certificate rather than maintaining parallel mutable summaries.

Maps to: `skill-benchmark`, `runtime/state-jsonl-checkpointing`, `runtime/gauges-observability`, `runtime/continuity-threading`.

2. **Benchmark the skill ecology, not only the isolated bundle — impact high, effort M.**

Construct registry stress grids over library size, hard-negative semantic similarity, and required composition depth. Record the candidate set, target rank, selected skills, activation sequence, plan edges, latency, task effect, and unsafe side effects. The output should be:

- A discovery frontier: maximum tested registry complexity at a declared recall/latency target.
- An interference graph: versioned skill nodes and confidence-weighted synergy, conflict, capability-flow, trust-transfer, and authorization-confusion edges.

[AgentSkillOS](https://github.com/ynulihao/AgentSkillOS) supplies concrete adapters: `src/manager/tree/searcher.py`, `layered_searcher.py`, `dormant_searcher.py`, and `src/workflow/evaluation.py`; it also exercises 200/1K/200K-skill regimes. [SCR-Bench](https://github.com/saint-viperx/SCR_Bench) supplies a useful composition matrix—`A_only`, `B_only`, `A+B_neutral`, `A+B_explicit`—and three path-risk classes. Start fan-out with skill pairs sharing tools, permissions, outputs, or high semantic similarity; expand only edges whose confidence intervals remain decision-relevant.

This sharpens uniqueness directly: model benchmarks cannot certify whether a package remains discoverable or safe when neighboring packages change.

Maps to: `skill-benchmark`, `runtime/fan-out-fan-in`, `runtime/budget-cost`, `runtime/gauges-observability`.

3. **Add adaptive bundle-component attribution — impact high, effort M.**

Treat metadata/description, core instructions, examples, references, scripts, and permission grants as explicit factors. Use randomized blocks by task, executor, and seed.

Start with `SALib.sample.ff.sample()` and `SALib.analyze.ff.analyze(..., second_order=True)` for inexpensive screening; its dummy factors also provide an empirical noise check. Fractional designs alias effects, so confirm important or ambiguous pairs with exact `2×2` experiments. For a reduced component set, compute exact coalition values; use [SHAP](https://github.com/shap/shap) interaction values only after validating a reward surrogate on held-out trials.

Publish main effects, confirmed interactions, minimum-effective-bundle candidates, and components associated with negative transfer. This converts “the skill helped” into “these distributable resources caused the lift,” something an underlying-model benchmark cannot establish.

Maps to: `skill-benchmark`, `runtime/fan-out-fan-in`, `runtime/budget-cost`, `runtime/dedup-novelty`.

Remaining gaps are cross-executor activation telemetry, causal identification when forced activation changes context, principled sample sizes for sparse gold sets, and learned expiry rules. Those are now narrower engineering and experimental-design problems; the mode thesis itself is settled.

```json
{
  "new_repos": [
    {
      "name": "NVIDIA/skills",
      "url": "https://github.com/NVIDIA/skills",
      "stars": "~2.5k",
      "what": "Daily-synced signed skill catalog with evaluation datasets, skill cards, and per-skill benchmark reports; active through June/July 2026.",
      "lesson": "Co-locate provenance and uplift evidence, but generate all views from one content-addressed effect certificate to prevent freshness divergence.",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "ynulihao/AgentSkillOS",
      "url": "https://github.com/ynulihao/AgentSkillOS",
      "stars": "~551",
      "what": "Hierarchical skill retrieval and DAG orchestration over large registries, with benchmark and modular architecture released in March 2026.",
      "lesson": "Turn registry size and distractor similarity into controlled benchmark factors and instrument retrieval separately from orchestration.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "saint-viperx/SCR_Bench",
      "url": "https://github.com/saint-viperx/SCR_Bench",
      "stars": "~13",
      "what": "June 2026 skill-composition security benchmark covering capability flow, trust transfer, and authorization confusion.",
      "lesson": "Evaluate activated skill paths with isolated and composed treatment arms; benign per-skill scores do not imply benign composition.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "SALib/SALib",
      "url": "https://github.com/SALib/SALib",
      "stars": "~986",
      "what": "Active Python sensitivity-analysis library with fractional-factorial, Morris, Sobol, and interaction analysis; v1.5.2 released October 2025.",
      "lesson": "Use fractional-factorial screening and dummy factors to find influential bundle components before paying for confirmatory interaction trials.",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "shap/shap",
      "url": "https://github.com/shap/shap",
      "stars": "~25.6k",
      "what": "Game-theoretic attribution library with exact, partition/Owen, and pairwise interaction mechanisms; v0.52.0 released May 28, 2026.",
      "lesson": "After screening reduces the coalition space, attribute bundle value and interactions while respecting hierarchical component groupings.",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "The correct product of skill-benchmark is a versioned effect certificate with a validity domain, not a leaderboard row.",
      "evidence": "https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/BENCHMARK.md",
      "maps_to": [
        "skill-benchmark",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Three randomized arms separate deployable intention-to-treat lift from forced-use capability and expose a diagnostic routing gap; observational activation traces alone cannot make that decomposition causal.",
      "evidence": "https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/skill-card.md",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Skill quality is ecology-dependent: discovery degrades with registry complexity, while safety failures can emerge only along composed activation paths.",
      "evidence": "https://github.com/ynulihao/AgentSkillOS; https://arxiv.org/abs/2606.15242",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "A two-stage design—fractional-factorial screening followed by exact confirmation of selected interactions—can attribute bundle effects without evaluating the full component power set.",
      "evidence": "https://salib.readthedocs.io/en/latest/api/SALib.analyze.html; https://github.com/shap/shap",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement skill-effect-certificate.v1 as the canonical output, backed by randomized no-skill, auto-route, and forced-activation arms; bind every claim to bundle, gold, executor, registry, tool, permission, and dependency digests, and emit explicit issued, withheld, and expired JSONL events.",
      "target": "skill-benchmark + runtime/state-jsonl-checkpointing",
      "rationale": "It unifies uplift, activation, cost, risk, compatibility, empty-gold handling, and freshness into one reproducible decision artifact.",
      "uniqueness": "Makes skill-benchmark the causal assurance layer for portable behavioral dependencies, which model benchmarks and qualitative improvement modes cannot provide.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/NVIDIA/skills"
    },
    {
      "rec": "Add a registry-scaling and composition lane that varies library size, hard-negative similarity, and composition depth, then emits discovery frontiers and confidence-weighted cross-skill interference graphs.",
      "target": "skill-benchmark + runtime/fan-out-fan-in",
      "rationale": "Isolated uplift does not predict whether a skill will be found, correctly composed, or remain safe in a realistic skill library.",
      "uniqueness": "Certifies the deployability of the skill ecosystem rather than the raw capability of the executor.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/ynulihao/AgentSkillOS; https://github.com/saint-viperx/SCR_Bench"
    },
    {
      "rec": "Add adaptive component attribution using fractional-factorial screening, task/executor blocking, and exact confirmatory trials for selected component pairs; publish minimum-effective-bundle and negative-interaction findings.",
      "target": "skill-benchmark + runtime/budget-cost",
      "rationale": "It identifies which instructions, references, scripts, examples, and permissions create value without paying for the full subset matrix.",
      "uniqueness": "Attributes improvement to distributable skill resources rather than leaving the gain confounded with the underlying model.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/SALib/SALib; https://github.com/shap/shap"
    }
  ],
  "contradictions": [
    {
      "claim": "A signed or verified skill is an effective skill.",
      "counter": "A signature establishes artifact integrity, not causal efficacy; effectiveness requires separate counterfactual evidence and a validity domain.",
      "evidence": "https://github.com/NVIDIA/skills#verifying-skills"
    },
    {
      "claim": "A skill's isolated benchmark score is sufficient for deployment.",
      "counter": "Composition can create capability-flow, trust-transfer, and authorization-confusion failures that are absent in isolated arms.",
      "evidence": "https://arxiv.org/abs/2606.15242"
    },
    {
      "claim": "One skill-on versus skill-off score explains why value was gained or lost.",
      "counter": "That comparison estimates an aggregate treatment effect but cannot distinguish discovery, activation, guidance, execution, or component interactions without additional randomized arms.",
      "evidence": "https://github.com/NVIDIA/skills/blob/main/skills/skill-card-generator/BENCHMARK.md"
    }
  ],
  "next_angles": [
    "Run a certificate-expiry replay study that independently mutates skill content, executor version, dependency versions, tool schemas, permissions, and registry composition to learn targeted versus full-retest triggers.",
    "Estimate a two-dimensional discovery frontier by jointly varying registry size and semantic similarity of hard-negative skills, then fit change points for recall, false activation, latency, and task uplift.",
    "Design a cross-executor activation-trace contract that distinguishes discovery, loading, instruction use, script execution, and downstream side effects without relying solely on executor self-report.",
    "Derive sequential sample-size and stopping rules for sparse-gold skill evaluations using minimum detectable uplift, negative-transfer risk, executor heterogeneity, and judge disagreement."
  ],
  "notes": "The main unresolved risks are non-standard activation telemetry, small and potentially contaminated gold sets, the non-causal nature of an unrandomized routing-gap estimate, and lack of a shared certificate schema. The NVIDIA benchmark/card divergence at the browsed snapshot is strong evidence for canonical generated certificates, but it may reflect asynchronous publication rather than an evaluation error."
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
113,903
