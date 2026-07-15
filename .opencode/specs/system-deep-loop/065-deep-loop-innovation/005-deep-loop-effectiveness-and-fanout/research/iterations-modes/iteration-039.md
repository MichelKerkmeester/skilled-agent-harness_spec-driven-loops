<!-- iteration 39 | SOL xhigh | mode: skill-benchmark | angle: A4-fail skill-benchmark :: failure modes & guardrails | 2026-07-15T11:22:41.457Z -->

Skill-benchmark’s routing diagnostics are stronger than its causal validity. Two fail-open paths matter:

- Empty positive gold becomes `null` in `setRecall()`, then receives full D1/D2 credit before normalization. A structurally sound skill can therefore pass without behavioral gold. See [score-skill-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:65).
- Holdout rows are excluded from the headline aggregate, while the generalization gap is advisory. A skill can pass fitted scenarios despite collapsing on blind scenarios. See [score-skill-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287).

The fix is a validity gate before the verdict:

1. Positive scenarios with empty route or outcome gold become `UNSCORABLE`, never neutral. `PASS` requires coverage-based blind gold: every claimed intent/capability and every “do not use” class has an independently authored holdout.
2. Replace the two-arm D4 estimate with a randomized, counterbalanced triad: skill-on, skill-off, and equal-token placebo. Run each executor × scenario × seed block under the same environment and budget. Report intention-to-treat lift first; activation and instruction-use remain mediator diagnostics.
3. Fit `score ~ skill + executor + skill:executor + order + tier`, with scenario/seed random effects or clustered uncertainty. Statsmodels supports random slopes, variance components, and correlated repeated-measure analysis through [MixedLM](https://www.statsmodels.org/stable/mixed_linear.html) and [GEE](https://www.statsmodels.org/stable/gee.html).
4. Add item-information screening. Ceiling/floor scenarios with almost no paired discordance cannot identify skill lift; retain them as longitudinal anchors but exclude them from causal attribution. Bayesian 2PL IRT provides difficulty and discrimination estimates through [py-irt](https://github.com/nd-ball/py-irt), while the newer [MetaEval](https://github.com/wangzhuo0092/MetaEval) demonstrates discrimination-driven benchmark reduction.
5. Extend literal contamination lint with provenance and semantic-community splits. Any prompt derived while viewing the target skill is fitted-only; paraphrase siblings must stay in one split. Maintain sealed rolling audit batches, borrowing the update-and-retire pattern from [ForecastBench](https://github.com/forecastingresearch/forecastbench).

The moat is causal bundle attribution. Model-benchmark can rank executors, but it cannot hold the executor fixed and answer whether this exact instruction/resource/tool bundle caused improvement, failed to activate, helped only certain executors, or merely benefited from extra context tokens. Sharpen that into a `SkillEffectCertificate` containing bundle/scenario/executor digests, intention-to-treat lift with interval, placebo lift, executor interaction, activation funnel, validity flags, and expiry triggers.

```json
{
  "new_repos": [
    {
      "name": "TiesPetersen/SkillBenchmark",
      "url": "https://github.com/TiesPetersen/SkillBenchmark",
      "stars": "~10",
      "what": "New May-2026 skill evaluator with 22 commits, paired skill-on/off runs, blind judging, token accounting, and confidence intervals.",
      "lesson": "Preserve its matched same-model/task/temperature comparison, but analyze paired task-seed clusters rather than treating judge repetitions as independent samples.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "statsmodels/statsmodels",
      "url": "https://github.com/statsmodels/statsmodels",
      "stars": "~11.5k",
      "what": "Mature statistical-modeling library; release 0.14.6 shipped 2025-12-05 with MixedLM, GEE, and binomial mixed-model support.",
      "lesson": "Estimate skill lift as a treatment effect while modeling scenario dependence and executor-by-skill heterogeneity instead of averaging an executor matrix.",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "nd-ball/py-irt",
      "url": "https://github.com/nd-ball/py-irt",
      "stars": "~170",
      "what": "Bayesian 1PL/2PL/4PL item-response implementation with 255 commits; older research code with no tagged releases.",
      "lesson": "Fit scenario difficulty and discrimination so ceiling, floor, negative-discrimination, and low-information items are visible before they distort skill lift.",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "wangzhuo0092/MetaEval",
      "url": "https://github.com/wangzhuo0092/MetaEval",
      "stars": "~2",
      "what": "AAAI-2026 research snapshot with notebooks for fitting item discrimination, estimating ability, and selecting discriminative benchmark subsets.",
      "lesson": "Rank scenarios by treatment-relevant discrimination and spend repeat budget on informative items rather than uniform resampling.",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "forecastingresearch/forecastbench",
      "url": "https://github.com/forecastingresearch/forecastbench",
      "stars": "~74",
      "what": "ICLR-2025 dynamic benchmark with 585 commits and nightly dataset/leaderboard updates.",
      "lesson": "Use sealed rolling audit batches and retire/reveal old batches so skill authors cannot repeatedly optimize against permanent holdout gold.",
      "maps_to": [
        "skill-benchmark",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Empty positive gold is currently fail-open: null recall is converted to full D1/D2 credit, while D3 is omitted from normalization.",
      "evidence": "local score-skill-benchmark.cjs:65-68,172-229,1059-1073",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "The fitted-versus-holdout gap is observable but not verdict-bearing; attribution remains vulnerable to gold overfit until blind performance gates PASS.",
      "evidence": "local score-skill-benchmark.cjs:1287-1288,1342-1344,1422-1445",
      "maps_to": [
        "skill-benchmark",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Trustworthy skill attribution needs matched randomization plus an executor interaction: the skill main effect estimates average lift, while skill-by-executor terms reveal portability or masking.",
      "evidence": "https://www.statsmodels.org/stable/mixed_linear.html",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "For paired binary outcomes, only discordant skill-on/off pairs identify lift; universal success or failure is a coverage signal but nearly information-free for attribution.",
      "evidence": "https://github.com/nd-ball/py-irt",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Contamination control must operate on lineage and semantic communities, not only banned substrings: target-aware generation and paraphrase siblings belong to fitted data, never blind holdout.",
      "evidence": "https://github.com/forecastingresearch/forecastbench",
      "maps_to": [
        "skill-benchmark",
        "runtime/dedup-novelty",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a fail-closed corpus-validity preflight before scoring: positive empty-gold rows become UNSCORABLE; emit goldCoverage by intent/capability/negative class; require blind holdout coverage; and cap the verdict at INSUFFICIENT-EVIDENCE when required coverage or holdout evidence is absent.",
      "target": "skill-benchmark",
      "rationale": "Normalization cannot distinguish success from missing evidence, and the present advisory generalization gap does not prevent fitted-set overfitting.",
      "uniqueness": "Turns Lane C from a routing score into an evidence-qualified certificate for a specific skill contract.",
      "effort": "M",
      "impact": "high",
      "evidence": "local score-skill-benchmark.cjs; https://github.com/forecastingresearch/forecastbench"
    },
    {
      "rec": "[uniqueness-sharpening] Replace D4-R's simple on/off average with counterbalanced skill-on, skill-off, and equal-token placebo blocks across executor × scenario × seed; persist assigned arm, actual activation, environment digest, order, and outcome; estimate ITT lift plus executor interaction using clustered or mixed-effects inference.",
      "target": "skill-benchmark + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing",
      "rationale": "Pairing removes scenario noise, placebo controls context-length and generic instruction effects, and the interaction exposes executors that mask or reverse the skill effect.",
      "uniqueness": "Only skill-benchmark can hold the model constant and attribute incremental value to the packaged bundle while decomposing assignment, activation, guidance, and execution.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/TiesPetersen/SkillBenchmark; https://www.statsmodels.org/stable/gee.html"
    },
    {
      "rec": "Add a validity-audit module producing per-scenario p_on, p_off, paired discordance, discrimination/information, provenance, literal leaks, semantic cluster, and split lineage; quarantine ceiling/floor and contaminated items, keep anchors separately, and allocate repeat budget by information gain.",
      "target": "skill-benchmark + runtime/dedup-novelty + runtime/gauges-observability + runtime/budget-cost",
      "rationale": "Low-information items waste budget and conceal lift, while semantic siblings crossing fitted/holdout boundaries make generalization estimates circular.",
      "uniqueness": "Makes the benchmark diagnose where a skill works and where its effect is unidentifiable, rather than producing another undifferentiated model-style average.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/nd-ball/py-irt; https://github.com/wangzhuo0092/MetaEval"
    }
  ],
  "contradictions": [
    {
      "claim": "Empty expected intent/resource arrays are harmless and can remain non-penalizing.",
      "counter": "For positive scenarios they erase the behavioral estimand; the only valid result is unscorable or insufficient evidence, not full recall.",
      "evidence": "local scenario_authoring.md NOTE ON EMPTY GOLD versus score-skill-benchmark.cjs:65-68,172-229"
    },
    {
      "claim": "All run-by-judge scores can be treated as independent samples and compared with Welch intervals.",
      "counter": "Repeated judges score the same generated output and skill-on/off outputs share a task/run block; independence is false, so paired or cluster-aware inference is required.",
      "evidence": "https://github.com/TiesPetersen/SkillBenchmark; https://www.statsmodels.org/stable/gee.html"
    },
    {
      "claim": "A high fitted aggregate is sufficient for PASS while holdout remains outside the verdict.",
      "counter": "That establishes fit to authored scenarios, not transferable skill effect; blind holdout collapse must block attribution.",
      "evidence": "local score-skill-benchmark.cjs:1287-1288,1422-1445"
    }
  ],
  "next_angles": [
    "Design a power and sequential-stopping controller for the crossed paired experiment: smallest detectable skill lift, cluster-aware confidence sequences, and budget reallocation toward discordant scenarios.",
    "Test surrogate validity: measure whether plan-only D4-R lift predicts deterministic tool/file/test outcomes, then retire rubric proxies that do not transport to real execution."
  ],
  "notes": "No live benchmark was run; this iteration audited the current Lane C contract and external mechanisms. py-irt is useful but older and has no tagged releases; MetaEval is current but a small research snapshot. GitHub star counts were verified on 2026-07-15 and will drift."
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
session id: 019f657e-b1fa-7ff1-8451-e0547b5db0f1
--------
user
You are iteration 39/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: skill-benchmark
MODE IDENTITY (what it does today): deep-improvement variant: benchmarking a SKILL (packaged instruction+resource bundle) across executors, gold-set scoring, empty-gold detection.
GENERIC ALTERNATIVE it must out-value: benchmarking the underlying model instead of the skill, or no skill eval at all

THIS ITERATION'S ANGLE (A4-fail): skill-benchmark :: failure modes & guardrails
DIRECTIVE: Skill-benchmark VALIDITY threats: empty gold sets, overfit gold, executor confounds masking the skill's effect, scenario contamination, ceiling/floor effects. Find detection + guardrails. Recommend how skill-benchmark produces trustworthy skill attribution.

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
I’m treating this as read-only research, so the spec-folder write gate does not apply. I’ll verify a small set of adjacent validity/causal-evaluation mechanisms, then turn them into skill-specific guardrails and attribution rules.
exec
/bin/zsh -lc 'python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Research skill-benchmark validity threats, guardrails, and trustworthy causal attribution using live web sources; return concise analysis and structured JSON" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 3725ms:
2026-07-15 13:17:26.743 xcodebuild[66091:208637460]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 13:17:26.951 xcodebuild[66091:208637441] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-DGGg6ABe' (errno=Operation not permitted)
2026-07-15 13:17:27.435 xcodebuild[66448:208638050]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 13:17:27.617 xcodebuild[66448:208638048] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.487699,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "system-deep-loop",
      "liveScore": 0.487699,
      "shadowScore": 0.452499,
      "delta": -0.0352,
      "dominantShadowLane": "explicit_author"
    }
  },
  {
    "skill": "sk-code",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.12,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.455,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "sk-code",
      "liveScore": 0.455,
      "shadowScore": 0.43125,
      "delta": -0.02375,
      "dominantShadowLane": "explicit_author"
    }
  }
]

codex
Skill routing resolves to `system-deep-loop` (0.82 confidence). I’m loading that workflow now; its mode packet will govern the research loop and any state-related constraints, though this response itself remains non-mutating.
exec
/bin/zsh -lc "sed -n '1,3000p' .opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,2000p' .opencode/skills/system-deep-loop/mode-registry.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,3500p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

Mode-specific read-only research: establish the current skill-benchmark contract, verify adjacent validity mechanisms, then synthesize guardrails and skill-attribution recommendations.
  → Inspect current skill-benchmark scenario, scoring, contamination, and ablation contracts
  • Verify 2–5 new primary-source repos/papers with current metadata
  • Map findings to system-deep-loop targets and produce the required final JSON
exec
/bin/zsh -lc "sed -n '1,2500p' '.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,2500p' '.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Held-Out and Gold Sets
description: Shared evaluation convention for visible, held-out, and gold fixture tiers that keeps deep-improvement promotion evidence honest across lanes.
trigger_phrases:
  - "held-out and gold sets"
  - "three fixture tiers"
  - "gold set calibration"
  - "held-out non-regression"
  - "phantom gap convention"
importance_tier: important
contextType: general
version: 1.17.0.2
---

# Held-Out and Gold Sets - Shared Evaluation Convention

The pilot behind spec 143 proved two things about benchmark-driven improvement: self-reported scores inflate (~+6/25 measured against independent graders) and proposers overfit any fixture they can read (the pilot's adversarial fixture published its own seeds in-repo). This convention is how every deep-improvement lane keeps its evidence honest. It applies to Lane B profiles and any future loop that promotes on benchmark evidence.

## 1. THE THREE FIXTURE TIERS

| Tier | Who sees it | Used for | Rules |
|---|---|---|---|
| **Visible** | proposer + grader | gap analysis, iteration targeting | may be discussed in prompts and journals |
| **Held-out** | grader only | promotion gates | the proposer NEVER sees ids, prompts or seeds; promotion requires non-regression here, not on visible fixtures |
| **Gold** (optional) | humans + grader | grader calibration | human-anchored target scores, version-locked; never optimized against |

## 2. HELD-OUT RULES

1. **Gradeable, always.** Every held-out fixture must produce a delimited deliverable (`<DELIVERABLE>` contract). Interactive fixtures that answer with a clarifying question are ungradeable and turn into false gate failures (teaching T6). Gate lists with `scripts/shared/fixture-lint.cjs` before any paid dispatch.
2. **Dimension-sensitive.** Prefer held-out fixtures that are maximally sensitive to the dimensions being optimized (the pilot's stat-centric fixture collapsed under a no-stats deficit, which is exactly what made its signal decisive).
3. **Unpublished seeds.** Adversarial seeds and expected answers must not live in files the proposer reads. If a fixture's tricks are enumerated in-repo, it is a visible fixture by definition.
4. **N-sample evidence.** Single runs are stochastic (teaching T4; one fixture swung 16 to 22 across runs). Held-out gating uses N >= 3 sample averages with all-samples pass semantics (`--samples` in Lane B).

## 3. GOLD-SET RULES

A gold set anchors the GRADER, not the proposer: a small output set with human-agreed target scores, re-scored whenever the grader model changes. Disagreement beyond ~2 of 25 (or 8 of 100) means recalibrate before trusting new grades. Keep gold outputs and target scores version-locked outside any tree a loop can write.

## 4. GRADER RULES (cross-reference)

- The grader must be a **different model family** from whatever produced the outputs (`scripts/shared/model-family.cjs`; Lane B refuses same-family LLM grading without `--allow-same-family`).
- Hard rules (banned vocabulary, structural rules) are checked by **deterministic code linters**, never by a model.
- Grader replies follow a strict-JSON contract (single-line JSON, no fences); parsers stay tolerant and record explicit `grader_error` values — an auth failure must be diagnosable from the record, not parsed as a zero score (teaching T11).
- Probe provider auth with one minimal dispatch before any multi-dispatch batch; an expired credential must fail the batch in one probe, not N grading calls.

## 5. PHANTOM GAP

Wherever the system under test self-reports a score, record `self_score` vs the independent score and their gap per fixture (Lane B: `self_score_pattern` + `phantomGap` in the report). A widening gap is a reward-hacking signal and must surface as a warning, never be averaged away.

exec
/bin/zsh -lc "sed -n '1,2500p' '.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Lane C Skill-Benchmark Operator Guide"
description: "How to run Lane C (skill-benchmark): invocation, the opt-in advisor probe, Mode A pipeline, dimension coverage, verdict bands, and target eligibility for benchmarking whether a skill is well-routed, discoverable, efficient, and useful in practice."
trigger_phrases:
  - "skill-benchmark operator guide"
  - "run lane c"
  - "skill benchmark invocation"
  - "opt-in advisor probe"
importance_tier: normal
contextType: implementation
version: 1.17.0.8
---

# Lane C Skill-Benchmark Operator Guide

Lane C benchmarks whether a *skill* is well-routed, discoverable, efficient, and useful **in practice** — distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior). It emits a ranked, remediable Skill Benchmark Report.

---

## 1. OVERVIEW

Run Lane C with `loop-host.cjs --mode=skill-benchmark` (or `/deep:skill-benchmark`). The orchestrator runs the D5 structural hard gate first, then per-scenario contamination-lint → router-replay → score, then writes a dual JSON+Markdown report. Mode A is deterministic and is the CI gate; the D1-inter advisor probe, the live trace (Mode B), and the D4-R task-outcome ablation are all opt-in (live/paid), kept off the CI path.

> **Mode B (live playbook) — BUILT** (packet `122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode`). Beyond the synthetic-fixture Mode A above, Lane C can now use a skill's own `manual_testing_playbook` as the corpus and score it in two trace-modes over one parser:
> - `--trace-mode router` (default for `run()` / CI) — deterministic router-replay over the real playbook prompts, scored against the playbook's expected-ref gold (replaces the old empty-gold fixtures).
> - `--trace-mode live` — real `cli-opencode` dispatch; routing/advisor scenarios are run as routing-analysis prompts (the model states its routing as JSON, graded vs gold + observed activation); browser scenarios (MR/CB) route to a `bdg` browser executor. Add `--d4` for the opt-in **D4-R task-outcome ablation** — the model is asked to *do* a routine task skill-on vs skill-off (a patch plan + verification, not a routing list), claude-graded into an advisory `D4_task_outcome` (the real usefulness measure, separate from the hallucination-grader D4). A↔B divergence + `assetRecall` are reported alongside.
> - Flags: `--scenarios <ids|critical>`, `--executor`, `--playbook-dir`. Live model via env `SKILL_BENCH_OPENCODE_MODEL` / `SKILL_BENCH_OPENCODE_VARIANT`.
> - **Live model guidance:** `gpt-5.5-fast --variant high` completes (~78s); `xhigh` is too slow and times out. Live is advisory (cost + nondeterminism) — the gated verdict stays driven by router mode + the D5 hard gate. Auto-CREATE generator (`playbook-generator.cjs`) is opt-in + staged.

## 2. INVOCATION

```bash
# Mode A (router-replay, deterministic — the CI gate). Run on a skill that has an
# INTENT_SIGNALS + RESOURCE_MAP smart router in its SKILL.md.
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=<skill-id-or-root> \
  --outputs-dir=<path> \
  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
```

`--advisor-mode=python` enables the **D1-inter** advisor probe — the deterministic in-repo SQLite advisor, scored out-of-band so the answer cannot leak. It is **off by default** (and in CI) to keep the pure-router path fast and dependency-free; enable it to lift a Mode A run from 4-dimension to 5-dimension coverage.

For the opt-in, paid **D4-R task-outcome** usefulness signal (live only):

```bash
# advisory D4_task_outcome over routine scenarios — requires --trace-mode live
SKILL_BENCH_OPENCODE_MODEL=openai/gpt-5.5-fast SKILL_BENCH_OPENCODE_VARIANT=high GRADER_MODEL=claude-sonnet-4-5 \
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill=<skill-id-or-root> --outputs-dir=<path> --trace-mode live \
  --scenarios <routine-ids> --d4 [--d4-scenarios <ids>] [--grader-mode real|mock]
```

`--d4` runs a separate task-outcome ablation (skill-on/off) graded by claude and writes an advisory `D4_task_outcome` to the report; it requires `--trace-mode live` (a no-op otherwise) and spends API per scenario. Skill-off keeps a contamination guard — a leaked skill read drops the pair `unscored` rather than faking a score. D4-R runs only on explicit **target-owned** scenarios named via `--d4-scenarios` (or `--scenarios`); with none selected it writes `D4_task_outcome.status: not-run-no-target-scenarios` and scores nothing — there are no cross-target defaults that could borrow another skill's ids.

Command surface: `/deep:skill-benchmark` (see `commands/deep/skill-benchmark.md`).

## 3. WHAT RUNS (MODE A)

1. **D5 connectivity** (static, hard gate) — runs first; dead routed paths, dead intent keys, path escapes, orphan refs, unparseable router. Any P0 caps the verdict to `BLOCKED-BY-STRUCTURE`.
2. **Fixtures** — public/private pairs under `assets/skill_benchmark/fixtures/<skill-id>/` (`<id>.public.json` + `<id>.private.json`).
3. **Per scenario** — contamination-lint the public prompt (a leak is a fixture failure), then router-replay, then join with private gold to score.
4. **Report** — `skill-benchmark-report.json` + `skill-benchmark-report.md` (rendered FROM the JSON, anti-drift).

## 4. DIMENSIONS

| Dim | What | Mode A |
| --- | ---- | ------ |
| D1-intra | in-skill router selects expected intents/resources | scored |
| D2 | unprompted discovery (router-replay recall proxy) | scored |
| D3 | efficiency (over-routing proxy) | scored |
| D5 | structural connectivity | scored (hard gate) |
| D1-inter | advisor selects the right skill | scored when `--advisor-mode=python`; `unscored-mode-a` when no probe ran; `excluded-by-design` (in `excludedDimensions`) for advisor-invisible skills |
| D4 (weighted) | hallucination-grader proxy (the 25-pt dimension) | `unscored-mode-a` in the aggregate **by design** — see note |

**Advisory signals** (live `--d4`; surfaced under `advisorySignals`, **not** folded into the weighted aggregate):

| Signal | What | When |
| ------ | ---- | ---- |
| `D4_task_outcome` | real routine-task usefulness — skill-on vs skill-off, claude-graded on a task-outcome rubric (correctness / verification-fit / focus / hallucination-risk) | opt-in `--d4` (live) |
| `assetRecall` | deferred `expectedAssets` support recall, kept off D2/D3 | live (router mode reports it deferred) |

D1-inter is **built and deterministic** but opt-in (`--advisor-mode=python`); the live in-situ trace (Mode B) is built. The weighted **D4** dimension stays `unscored-mode-a` on purpose — its grader scores *hallucination*, not task usefulness, so folding it would mislabel the number. Real usefulness is the opt-in **D4-R task-outcome ablation** (`--d4`), reported separately as advisory `D4_task_outcome`, never summed into the weighted score. Mode A stays honest about coverage: the aggregate normalizes over the dimensions actually measured.

## 5. VERDICT BANDS

`PASS` ≥80 & no gate · `CONDITIONAL` 50–79 · `FAIL` <50 · `BLOCKED-BY-STRUCTURE` on any D5 P0. (Provisional — calibrate on 2-3 pilots.)

## 6. TARGET ELIGIBILITY

Mode A needs a parseable `INTENT_SIGNALS` + `RESOURCE_MAP` router (e.g. the `cli-*` skills). Skills without that pattern report `router_unparseable` and gate — that is a real signal that the skill is not smart-router-routable, not a harness bug. A skill that routes via a different mechanism is a candidate for live-mode (Mode B) measurement once built.

## 7. AUTHORING THE BENCHMARK FOLDER

Running Lane C is this guide's job; authoring the durable `benchmark/` tree stored beside a skill is `sk-doc/create-benchmark`'s (§10). Author a hub's `benchmark/README.md` run-label index from [`skill_benchmark_readme_template.md`](../../../../sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md), following the storage and run-label convention in [`skill_benchmark_storage_guide.md`](../../../../sk-doc/create-benchmark/references/skill_benchmark/skill_benchmark_storage_guide.md). The per-run `skill-benchmark-report.md` is an anti-drift render owned by `build-report.cjs` and is **never** templated; the D1-D5 [`scoring_contract.md`](./scoring_contract.md) and this operator guide stay lane-local and are only cross-linked from that packet.

exec
/bin/zsh -lc "sed -n '1,2500p' '.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Skill Routing Optimization"
description: "Lane C methodology for improving a skill's live routing score by fixing real router reachability, gold alignment, and over-routing issues without gaming the benchmark."
trigger_phrases:
  - "skill routing optimization"
  - "raise live routing score"
  - "lane c routing remediation"
  - "resource map optimization"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Skill Routing Optimization

Lane C rewards skills that route to the right resources for the right task, keep every declared support file reachable, and avoid loading unrelated material. Raising a live routing score is therefore a remediation exercise, not a metric exercise: make the router express the skill's real operating contract, then align the benchmark gold to that contract.

This reference covers the common score blockers and the safe changes that improve them without hiding defects.

---

## 1. OVERVIEW

The fastest honest score gains usually come from five places:

- **D5 structural connectivity** — every real `references/*.md` and `assets/*.md` file must be reachable through a meaningful `RESOURCE_MAP` intent.
- **D5 ALWAYS coverage** — files the skill always loads must still be mapped into intent/resource coverage so they are credited instead of appearing disconnected.
- **D1/D2 gold alignment** — private scenario gold must include legitimate base loads, especially resources the router always selects.
- **D3 efficiency** — eager loads that are not needed for a scenario should be intent-gated.
- **Parent-hub drift** — parent `RESOURCE_MAP` must remain the union of child routes, with every child reachable.

Treat the benchmark report as a funnel: fix hard structural failures first, then fix scenario gold, then reduce genuine waste.

## 2. D5 ORPHAN REFERENCES

Signal: `D5 orphan_reference`.

What the benchmark sees: a file under `references/*.md` or `assets/*.md` exists, but no parseable `RESOURCE_MAP` path can reach it. Lane C treats that as a structural connectivity defect because the skill cannot reliably route to material it ships.

Concrete remediation:

1. List every D5 `orphan_reference` path from the Skill Benchmark Report.
2. For each path, identify the real task intent that needs it. Do not create a junk intent such as `misc` unless the skill genuinely has a miscellaneous workflow.
3. Add the file to that intent's `RESOURCE_MAP` entry.
4. Add only domain-language `INTENT_SIGNALS` keywords that would appear in a user's real prompt for that intent.
5. Add or update at least one scenario whose private `expected.resources` includes the newly reachable file when that file is required for the task.
6. Re-run Lane C and confirm the D5 orphan finding is gone and D1/D2 recall did not drop.

Good pattern:

```text
User task language -> INTENT_SIGNALS key -> RESOURCE_MAP intent -> concrete reference or asset path
```

Avoid:

- Mapping an orphan into an unrelated high-traffic intent just to make D5 green.
- Adding keywords copied from the filename instead of user-domain language.
- Adding every orphan to every intent, which fixes D5 but usually creates D3 waste.

## 3. ALWAYS-TIER FILES NOT IN RESOURCE_MAP

Signal: D5 coverage gaps and D1/D2 under-credit for files that are legitimately loaded as base context.

What the benchmark sees: a file is loaded by the skill's always-on path, but the router map does not declare where it belongs. That can make a real base load look structurally disconnected or invisible to scenario scoring.

Concrete remediation:

1. Identify the skill's ALWAYS-tier files: the files loaded for nearly every activation because they define contracts, safety rules, common workflow, or router doctrine.
2. Decide whether each file is truly universal or only frequently useful. Universal files can remain base loads; frequently useful files should move behind intents.
3. Add universal files to the relevant `RESOURCE_MAP` entries that depend on them. If every intent needs the file, include it in every meaningful intent rather than leaving it unrepresented.
4. Keep `INTENT_SIGNALS` focused on task language. Do not add broad keywords solely to pull an ALWAYS file into more scenarios.
5. Update private scenario gold so `expected.resources` includes the ALWAYS files that the router legitimately loads for that scenario.
6. Re-run the benchmark and inspect both D5 and D3. A base load should be credited when legitimate, but it should still count as waste when it is unrelated.

Rule of thumb: if the skill would be unsafe or impossible to execute without the file, make it visible in `RESOURCE_MAP`; if it is only occasionally useful, intent-gate it.

## 4. GOLD ALIGNMENT FOR LEGITIMATE BASE LOADS

Signals: D1-intra resource recall, D2 discovery recall, and D3 over-routing.

What the benchmark sees: router output is scored against private gold. If a scenario's `expected.resources` omits files the router always and legitimately loads, D3 may classify those files as wasted routing even though they are part of the correct base context.

Concrete remediation:

1. For each scenario, replay the router and record the resources it always selects before intent-specific additions.
2. Classify each base resource as legitimate for the scenario or genuinely unrelated.
3. Add legitimate base resources to the private gold field (`expected.resources`; also called `expected_resources` in some report prose).
4. Leave unrelated base resources out of gold. They should remain visible as D3 waste.
5. For scenarios with negative activation, verify gold does not accidentally bless resources from the skill that should not activate.
6. Keep public prompts uncontaminated: they must not name skill ids, route keys, resource basenames, or commands unless the scenario is explicitly testing router keywords under the allowed lint mode.

Gold alignment is not inventing new truth; it is making scorer-only gold match the router contract the skill actually promises.

## 5. GENUINE OVER-ROUTING

Signal: D3 efficiency, computed as wasted routed resources over total routed resources in Mode A and replaced by live calls/tokens-to-first-expected in Mode B.

What the benchmark sees: the router selected resources that were not expected for the scenario. If those resources are not legitimate base loads, D3 is correctly reporting over-routing.

Concrete remediation:

1. Sort scenarios by lowest D3 score or largest wasted-routed count.
2. For each wasted file, ask whether a skilled human would need it to answer that prompt.
3. If no, remove it from the eager route and place it behind the narrowest meaningful intent.
4. Add or tighten `INTENT_SIGNALS` so the file loads only when user-domain language indicates that intent.
5. If the file is useful only after another decision point, keep it as a deferred resource or child-mode resource rather than a default load.
6. Re-run Lane C and verify D3 improves without hurting D1/D2 recall for scenarios that genuinely need the file.

Do not solve D3 by deleting resources from gold or from the skill when they are actually required. Solve it by making the router discriminate.

## 6. PARENT-HUB ROUTING

Signals: D5 dead paths, orphan children, parent/child drift, D1/D2 misses for child routes.

What the benchmark sees: a parent skill is a router surface. If child skills own workflow-specific resources, the parent must still expose a coherent union route so every child can be reached from the parent activation path.

Concrete remediation:

1. Treat the parent `RESOURCE_MAP` as the union of child `RESOURCE_MAP` entries, not as a hand-written subset.
2. For every child, confirm there is at least one parent intent that reaches that child or the child's entrypoint resource.
3. Keep parent `INTENT_SIGNALS` broad enough to choose the correct child, but not so broad that sibling children activate together by default.
4. Add a drift guard to the maintenance workflow: when a child adds, removes, or renames a route, update the parent union in the same change.
5. Add coverage scenarios for each child route and at least one sibling negative/adversarial prompt.
6. Re-run Lane C on both the child and parent. The child should pass its own routing contract; the parent should pass reachability and avoid sibling over-routing.

Parent hubs should make children discoverable, not flatten all child resources into one always-loaded bundle.

## 7. DO NOT GAME THE METRIC

Lane C is useful only if the router, resources, and private gold represent real behavior.

Do not:

- Invent gold resources that a scenario does not need.
- Add keywords that cause the skill to activate for the wrong user intent.
- Hide unrelated eager loads by marking everything expected.
- Move every file into ALWAYS-tier to bypass intent routing.
- Create placeholder intents whose only purpose is to silence `orphan_reference`.
- Let parent hubs over-claim child routes they cannot safely execute.

Accept lower scores when they describe real ambiguity. Fix the skill, the route map, or the scenario authoring; do not train the benchmark to lie.

## 8. REMEDIATION ORDER

Use this order when improving a skill after a Lane C run:

1. Fix D5 P0/P1 structural findings first: unparseable router, dead routed paths, path escapes, orphan references, and dead intent keys.
2. Map ALWAYS-tier files into meaningful `RESOURCE_MAP` coverage.
3. Align private scenario gold with legitimate base loads.
4. Intent-gate genuine over-routing until D3 waste reflects only acceptable base context.
5. For parent hubs, update the parent union and confirm every child is reachable.
6. Re-run deterministic Mode A; enable advisor/live probes only after static routing is structurally clean.

The expected result is not merely a higher number. It is a router whose score explains the skill's real behavior: reachable resources, honest gold, narrow intent gates, and no silent parent/child drift.

exec
/bin/zsh -lc "sed -n '1,2500p' '.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Lane C Skill-Benchmark Scoring Contract"
description: "Authoritative D1-D5 computation for the Lane C Skill Benchmark Report: point weights, Mode A deterministic scoring, the opt-in advisor probe for D1-inter, deferred live-mode dimensions, and funnel/bottleneck ranking."
trigger_phrases:
  - "skill-benchmark scoring contract"
  - "lane c scoring"
  - "d1 d5 weights"
  - "skill benchmark dimensions"
importance_tier: important
contextType: implementation
version: 1.17.0.6
---

# Lane C Skill-Benchmark Scoring Contract

Authoritative computation for the Skill Benchmark Report. Source of truth: the converged design in `122-.../001-skill-benchmark-deep-research/research/research.md` §3 and the implementation playbook in `002-implementation-deep-research/research/research.md`.

---

## 1. OVERVIEW

Lane C scores a skill across five dimensions (D1-D5) and rolls them into a single verdict. D5 (structural connectivity) is a static hard gate that runs first. Mode A (router-replay) scores everything that needs no live model deterministically; D1-inter is built but opt-in via the in-repo advisor. The weighted **D4** dimension (a hallucination-grader proxy) stays unscored in the aggregate **by design** — it does not measure task usefulness. Real routine-task usefulness is measured separately by the opt-in **D4-R task-outcome ablation**, reported as an advisory signal (never folded into the weighted score); the live trace (Mode B) is built. The aggregate normalizes over the dimensions actually measured so the headline number stays honest about coverage.

## 2. POINT WEIGHTS (FULL / LIVE MODE)

`D1 = 25` (inter 12 + intra 13) · `D2 = 20` · `D3 = 15` · `D4 = 25` · `D5 = 15` (hard gate).

## 3. MODE A (ROUTER-REPLAY, DETERMINISTIC)

Scores only what needs no live model; the aggregate normalizes over the measured weights (D1-intra + D2 + D3, plus D1-inter when the advisor probe is enabled) so the number is honest about coverage. D5 is computed statically and gates.

- **D1-intra** = `0.4 * intentRecall + 0.6 * resourceRecall` vs private `expected.intentKeys` / `expected.resources`. Empty expected = not-applicable (treated as 1.0, non-penalizing). Negative-activation scenarios invert: routing the expected resources is a failure.
- **D2** (Mode A proxy) = recall of expected resources in the routed set. Live mode replaces this with Hit@1 / Hit@3 / Recall@5 / MRR over the observed file-load trace.
- **D3** (Mode A proxy) = `1 - wastedRouted / totalRouted` (over-routing penalty). Live mode replaces with calls/tokens-to-first-expected.
- **D5** = `100 - Σ penalties` (P0 40, P1 12, P2 3), floored at 0. Any P0 sets `gateFailed`.

## 4. D1-INTER — OPT-IN ADVISOR PROBE (BUILT, DETERMINISTIC)

D1-inter (does the skill *advisor* select this skill for the scenario?) is built and deterministic, but **opt-in** so the pure-router default stays fast and dependency-free:

- Enable with `--advisor-mode=python`. Off by default and in CI.
- Scored out-of-band via the deterministic SQLite advisor (`scoreAdvisorPrompt` / `skill_advisor.py`) with the advisor hook disabled so the answer cannot leak into the dispatched prompt.
- When disabled it reports `status: unscored-mode-a` (never faked); when enabled it contributes its 12 points to the measured aggregate.
- For an **advisor-invisible** skill — one whose directory carries no `graph-metadata.json`, so the advisor ranks its owning parent identity rather than the packet — D1-inter is **excluded-by-design**: reported `applicable: false, status: "excluded-by-design"` with the owning identity in `delegatedMeasure.targetSkill`, and listed under `excludedDimensions` (not `unscoredDimensions`). This is structural N/A, not a missing score; the weighted aggregate is unaffected either way.

## 5. LIVE MODE (MODE B) + ADVISORY SIGNALS

The weighted **D4** dimension stays `unscored-mode-a` in the aggregate by design (its grader scores hallucination, not usefulness). Two live-mode signals are surfaced under `advisorySignals`, **outside** the weighted aggregate so the v1 weights/verdict are unchanged:

- **`D4_task_outcome` — the real usefulness instrument (D4-R).** Opt-in via `--d4` (live). The model is asked to *do* a routine task (a minimal patch plan + verification commands, not a routing list) skill-on vs skill-off; both answers are graded by the task-outcome rubric (`system-grader-task-outcome.md`: correctness / verification-fit / focus / hallucination-risk) through the Lane B grader harness (claude-graded; distinct cache keys via the `#taskoutcome#on|off` fixture ids). Score = `0.5 + (on − off) / 2` (>0.5 = the skill helped). Stamped `attribution: approximate` (skill-off is approximated by hook-disable + preamble + a contamination guard that drops a leaked pair). Reported as `advisorySignals.D4_task_outcome`, never summed into the verdict.
- **`assetRecall` — deferred-asset support.** `expectedAssets` is scored on its own lane (live: recall vs the model's stated assets; router: deferred). `live-executor` keeps assets on a separate `observedAssets` channel so a stated, useful asset is not counted as D3 over-routing waste.

**Live trace (Mode B)** replaces the D2/D3 router-replay proxies with the model's stated/observed routing (references only — assets are on the `assetRecall` lane). Signals that did not run report `status: unscored-mode-a` — never faked.

### Advisory Signals

`score-skill-benchmark.cjs` emits `advisorySignals` in the machine report, and `build-report.cjs` renders them under **Advisory signals (NOT in the weighted aggregate)**. `D4_task_outcome` reports the opt-in D4-R routine-task usefulness delta when `--d4` live ablation runs; otherwise it is unscored. `assetRecall` reports expected deferred-asset support when live stated assets are available; otherwise it is deferred or unscored. Both are diagnostic only and never change `aggregateScore`, `dimensionScores`, `verdict`, or D4's weighted status.

## 6. FUNNEL + BOTTLENECK RANKING

Per-scenario `firstFailingStage` follows the implemented order: `activated-inter` (advisor selected the wrong skill when D1-inter is scored), `router-unparseable`, `surface-mismatch`, `routed-intra`, then `discovered`. A scenario with no failing stage is counted as `passed`; orchestrator-added degradation rows can also contribute `unparseable-fixture`, `contaminated-fixture`, or browser routed-out reasons, and `build-report.cjs` displays routed-out rows with their reason instead of a normal failing stage. The headline bottleneck is the non-`passed` stage with the largest first-failure count (attrition). Bottlenecks list D5 findings plus the headline funnel finding, each mapped through `assets/skill_benchmark/remediation_taxonomy.json` to file, locus, one-line fix, and handoff lane.

exec
/bin/zsh -lc "sed -n '1,2500p' '.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Lane C Skill-Benchmark Scenario Authoring"
description: "How to author Lane C fixtures: the public/private pair schema, the three anti-circularity tiers (auto-derived, hand-authored holdout, adversarial), the T1-T2 circularity meter, coverage targets, and empty-gold handling."
trigger_phrases:
  - "skill-benchmark scenario authoring"
  - "lane c fixtures"
  - "public private fixture"
  - "anti-circularity tiers"
importance_tier: normal
contextType: implementation
version: 1.17.0.4
---

# Lane C Skill-Benchmark Scenario Authoring

How to author the public/private fixture pairs Lane C scores against.

---

## 1. OVERVIEW

Each scenario is a public/private pair under `assets/skill_benchmark/fixtures/<skill-id>/`. The public half is the only material that crosses the dispatch boundary; the private half is scorer-only gold. Author fixtures in three tiers to manage circularity, publish the T1-T2 score gap as the circularity meter, and aim for one admitted fixture per router key.

## 2. FIXTURE STRUCTURE

- `<scenarioId>.public.json` — dispatched material only. `{ scenarioId, tier, public: { prompt, runtime, mutationBoundary, outputContract }, provenance }`. The `prompt` is written in **domain language** — it must NOT name the skill, its triggers, intent keys, resource paths/basenames, or commands (the contamination linter rejects leaks before scoring).
- `<scenarioId>.private.json` — scorer-only gold, never crosses the dispatch boundary. `{ scenarioId, expected: { skillId, advisorLane, intentKeys, resources, negativeActivation }, rubric }`.

Route-gold fixtures may extend the private `expected` block with workflow-router fields:

```json
{
  "expected": {
    "workflowMode": "interface",
    "routeOutcome": "single",
    "forbiddenWorkflowModes": ["audit"],
    "minimalPairGroup": null
  }
}
```

`workflowMode` is a string for `single` and `defer` outcomes, and an ordered array for `orderedBundle` outcomes. `routeOutcome` is one of `single`, `orderedBundle`, or `defer`. `forbiddenWorkflowModes` lists workflow modes that must not appear in the selected route. `minimalPairGroup` is a shared stable id for paired adversarial fixtures, or `null` when the fixture is unpaired.

For router-scoring corpora, domain router keywords are allowed when they are the behavior under test. Use identity-scoped contamination lint for those prompts: ban the skill id, workflow mode names, and resource basenames, but do not ban the domain keywords the router is meant to match.

## 3. THREE TIERS (ANTI-CIRCULARITY)

- **T1 — auto-derived + paraphrased.** Gold keys mechanically derived from the skill's own `RESOURCE_MAP[intent]`; prompt paraphrased from the task domain and decontaminated. Breadth/coverage; circular unless decontaminated.
- **T2 — hand-authored holdout.** Prompt written from the task domain by an author blind to `INTENT_SIGNALS`/`RESOURCE_MAP`; gold joined privately. The honesty anchor.
- **T3 — adversarial.** Sibling-skill paraphrases, decoys whose gold belongs to another skill, and "should NOT activate" negatives (`negativeActivation: true`).

Publish the **T1↔T2 score gap** as the circularity meter (mirrors the advisor corpus↔holdout split). A large gap is a finding against the corpus, not evidence the skill is good.

## 4. COVERAGE

Aim for ≥1 admitted fixture per `INTENT_SIGNALS` key, per `RESOURCE_MAP` target, and per "When NOT to Use" class. Uncovered keys are themselves dead-key findings.

## 5. NOTE ON EMPTY GOLD

`expected.intentKeys`/`expected.resources` may be left `[]` while a skill's router map is still being confirmed; Mode A treats empty gold as non-penalizing (scores structure/efficiency only). Populate from a router-extract pass to get real D1-intra/D2 signal.

codex
The current contract has one concrete validity hole already: empty `intentKeys`/`resources` are scored as non-penalizing, so a corpus with no behavioral gold can still produce a favorable normalized verdict. I’m now checking mechanisms for three other threats: contamination, low-information items, and executor-by-skill confounding.
web search: 
web search: GitHub benchmark contamination detection LLM prompts repository 2025 ...
web search: 
web search: "MetaEval" benchmark discrimination GitHub ...
web search: 
web search: site:github.com/TiesPetersen/SkillBenchmark SkillBenchmark ...
web search: 
web search: https://github.com/TiesPetersen/SkillBenchmark
web search: 
web search: 
exec
/bin/zsh -lc "rg -n \"empty|expectedResources|expected\\.resources|not-applicable|contamin|D4_task_outcome|aggregateScore|weighted\" .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:220: * Rank-weighted: top-1 = 1.0, top-3 = 0.75, top-5 = 0.5, else 0. Negative
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10: * Runs BEFORE any dispatch and caps the verdict regardless of weighted score.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:40:// are intentionally not routed). Returns an empty Set when absent or malformed,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:86:function emptyHubRegistryResult() {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:147:  if (!fs.existsSync(modeRegistryPath)) return emptyHubRegistryResult();
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:12: * a far better benchmark corpus than synthetic decontaminated fixtures: real
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:230:  const expectedResources = extractPaths(refBlock);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:257:    expectedResources,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:339:        expectedResources: resources,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:3:// ║ contamination-lint.cjs — pre-dispatch hint-free fixture gate             ║
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:8: * contamination-lint.cjs — pre-dispatch hint-free gate.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:37: * @param {string} skillMd - Raw SKILL.md contents (may be empty).
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:131:    process.stderr.write('usage: contamination-lint.cjs --skill <root> --text "<public prompt>"\n');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:18: * as contaminated). D4 scores are stamped attribution:"approximate".
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:102:    return { d4: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate' }, contaminated: true };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:187: * grade. Spends API. Same contamination guard as the hallucination ablation.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:214:    return { d4r: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate', instrument: 'task-outcome' }, contaminated: true };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:50:  lines.push(`**Verdict: ${r.verdict}**${r.aggregateScore != null ? ` · aggregate ${r.aggregateScore}/100` : ''}`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:51:  if (r.gate && r.gate.gateFailed) lines.push(`\n⚠ **${r.gate.reason}** — verdict capped regardless of weighted score.`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:110:    lines.push('### Advisory signals (NOT in the weighted aggregate)');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:112:    if (a.D4_task_outcome) lines.push(`- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: ${fmt(a.D4_task_outcome)}`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:110:    addFinding(findings, 'invalid-loaded-files', 'loadedFiles', 'loadedFiles must be a non-empty array');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:122:      addFinding(findings, 'invalid-loaded-file-path', `${prefix}.path`, `${prefix}.path must be a non-empty string`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:140:    addFinding(findings, 'invalid-workflow-modes', 'workflowModes', 'workflowModes must be a non-empty array');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:145:      addFinding(findings, 'invalid-workflow-mode', `workflowModes[${index}]`, `workflowModes[${index}] must be a non-empty string`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:197:    addFinding(findings, 'invalid-minted-by', 'mintedBy', 'mintedBy must be a non-empty string');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:200:    addFinding(findings, 'invalid-bound-surface', 'boundSurface', 'boundSurface must be a non-empty string');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:19: *   1. contamination — the prompt must not leak skill/router identifiers
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:32:const { buildBannedVocab, lintFixture } = require('./contamination-lint.cjs');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:81: * @param {string[]} spec.expectedResources - Expected references.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:86:function renderScenarioMarkdown({ id, title, prompt, expectedSurface, expectedResources, negative, stage = 'routing' }) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:87:  const refs = (expectedResources || []).map((r) => `- \`${r}\``).join('\n') || '- (none)';
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:130: * @param {string[]} args.expectedResources - Claimed gold resources.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:133: * @returns {{contamination:boolean,structural:boolean,parseRoundTrip:boolean,selfConsistency:boolean,allPassed:boolean}} Gate results.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:135:function validateGenerated({ skillRoot, skillId, scenarioMd, prompt, expectedResources, stagingDir, id }) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:137:  // 1. contamination
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:138:  const vocab = buildBannedVocab({ skillRoot, skillId, privateExpected: { resources: expectedResources } });
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:139:  gates.contamination = lintFixture({ publicText: prompt, bannedVocab: vocab }).passed;
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:149:  gates.selfConsistency = (expectedResources || []).length === 0
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:151:    : expectedResources.some((r) => routed.resources.includes(r));
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:162: * (spec -> {prompt, expectedSurface, expectedResources}); the default `dry`
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:184:    expectedResources: [],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:200:    const md = renderScenarioMarkdown({ id: spec.id, title, prompt: a.prompt, expectedSurface: a.expectedSurface, expectedResources: a.expectedResources, negative: spec.negative, stage: spec.stage || (spec.negative ? 'negative' : 'routing') });
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs:201:    const gates = validateGenerated({ skillRoot, skillId, scenarioMd: md, prompt: a.prompt, expectedResources: a.expectedResources, stagingDir, id: spec.id });
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:41:function emptyResult(overrides = {}) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:274:    return emptyResult({
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:292:  if (!hubExists && !registryExists) return emptyResult();
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:315:    return emptyResult({
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:339:    return emptyResult({
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:14: *   4. per scenario: contamination-lint the PUBLIC prompt (a leak is a fixture
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:30:const { buildBannedVocab, lintFixture } = require('./contamination-lint.cjs');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:112:        firstFailingStage: 'contaminated-fixture',
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:114:        contamination: lint.hardLeaks,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:156:      const bannedVocab = buildBannedVocab({ skillRoot, skillId, privateExpected: { resources: sc.expectedResources } });
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:218:  process.stdout.write(`skill-benchmark: ${skillId} verdict=${report.verdict} aggregate=${report.aggregateScore} scenarios=${scenarioRows.length}\n`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:221:  // hub registry) unusable regardless of weighted score. An exit code that stays
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:232:// the advisory D4_task_outcome aggregate, and re-writes report.{json,md}. D4-R runs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:239: * D4_task_outcome aggregate, and re-write report.{json,md}.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:257:    report.advisorySignals.D4_task_outcome = {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:284:  report.advisorySignals.D4_task_outcome = d4TaskAvg === null
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289:  process.stdout.write(`  D4-R: ${scored} scenario(s) scored; advisory D4_task_outcome=${d4TaskAvg == null ? 'null' : d4TaskAvg}\n`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:23:- `score-skill-benchmark.cjs` computes the D1-D5 dimensions per scenario and aggregates with point weights; Mode A normalizes over only the dimensions it can measure rather than faking the live-only ones. It also carries the advisory `D4_task_outcome` signal.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:24:- `d4-ablation.cjs` holds the D4 hallucination ablation AND the opt-in `--d4` D4-R task-outcome ablation (advisory `D4_task_outcome`, never collapsed into D4).
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:25:- Supporting modules: `contamination-lint.cjs` (pre-dispatch hint-free gate), `advisor-probe.cjs` (D1-inter advisor signal), `playbook-generator.cjs` (opt-in staged scenario generator), and `_args.cjs` (space-form arg parser). `load-playbook-scenarios.cjs` is the corpus loader.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:46:│   3. per scenario: contamination-lint → executor-dispatch │
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:70:        augments report.{json,md} with advisory D4_task_outcome
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:89:+-- contamination-lint.cjs        # Pre-dispatch hint-free gate (leak = fixture failure)
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:102:| `run-skill-benchmark.cjs` | Lane C orchestrator. Resolves the target skill root, runs the D5 connectivity gate FIRST, loads scenarios, contamination-lints each public prompt, dispatches, aggregates, writes `report.json` and renders `report.md`. Exports `run`, `augmentWithD4R`, `resolveSkillRoot`, `loadFixtures`. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:103:| `d5-connectivity.cjs` | Static structural scan and D5 hard gate. Runs before any dispatch and caps the verdict regardless of weighted score: catches dead RESOURCE_MAP routes, dead intent keys, paths escaping the skill root, and orphan references (reported, not gated). An unparseable router is the strongest gate failure. Exports `scanConnectivity`, `listMarkdownRefs`. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:111:| `d4-ablation.cjs` | D4 usefulness ablation. Holds the D4 hallucination delta (skill-ON vs skill-OFF, graded by the Lane B grader) AND the opt-in `--d4` D4-R task-outcome ablation that grades a real change with the task-outcome rubric and reports it as the advisory `D4_task_outcome` (never collapsed into D4). Skill-OFF is approximate; scores stamp `attribution: "approximate"`. Exports `runD4Ablation`, `gradeAblation`, `runD4RAblation`, `gradeTaskOutcome`, and prompt builders. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:112:| `contamination-lint.cjs` | Pre-dispatch hint-free gate. Reuses the routers' own lowercased-substring match logic so "hint-free" is judged by the same mechanism that could be gamed. Banned vocabulary is built from the skill's identity (name/id, triggers, router keywords, intent keys, resource segments) and the private gold labels. A hard leak is a FIXTURE failure. Exports `buildBannedVocab`, `lintFixture`, `frontmatterTriggers`. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:114:| `playbook-generator.cjs` | Opt-in staged scenario generator for skills with thin coverage. NEVER writes the live playbook — writes only to `manual_testing_playbook/_generated_staging/` and emits a promoteHint. Generated scenarios are tier `T1-auto` and must pass contamination, parser round-trip, structural, and self-consistency gates. Exports `generatePlaybook`, `analyzeCoverage`, `validateGenerated`, `renderScenarioMarkdown`. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:145:│ contamination-lint each public prompt    │
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:163:│ (--d4 augments both with D4_task_outcome) │
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:174:| `... --d4 [--d4-scenarios <ids>] [--grader-mode real\|mock]` | CLI (opt-in) | Adds the D4-R task-outcome ablation; requires `--trace-mode live`. Augments the report with advisory `D4_task_outcome`. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:370:// first match. An empty set preserves the "no language slice" behaviour that a null
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:115:    resources: scenario.expectedResources || [],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:125:    // the gate, so this rides a separate non-weighted lane.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:183:    if ((expected.resources || []).length > 0) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:236:  const unexpectedRoutedCount = expected && expected.resources
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:237:    ? routerResult.resources.filter((r) => !expected.resources.includes(r)).length
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:249:  // No positive resource gold: over-routing is unmeasurable. Against an empty
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:252:  // all. Return a not-applicable score instead — the same convention D1-inter
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:255:  if (!expected || !expected.resources || expected.resources.length === 0) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:261:      note: 'not-applicable: no expected-resource gold to measure over-routing against',
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:267:  // not-applicable so the dimension drops out and the row is judged on recall
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:275:      note: 'not-applicable: nothing routed against positive gold; over-routing efficiency undefined',
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:303:  return { score: setRecall(expectedAssets, observedAssets), expectedAssets, observedAssets, note: 'live stated-asset recall (advisory, not weighted)' };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:375:    errors.push('argumentGrammar.render must be a non-empty string');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:378:    errors.push('argumentGrammar.positional must be a non-empty array');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:395:        errors.push(`argumentGrammar.positional[${index}].kind must be a non-empty string`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:420:        errors.push(`argumentGrammar.flags[${index}].kind must be a non-empty string`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:423:        errors.push(`argumentGrammar.flags[${index}].valueName must be non-empty when takesValue is true`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:432:  if (!Array.isArray(choreography) || choreography.length === 0) return ['choreography must be a non-empty array'];
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:452:        errors.push(`choreography[${index}].${field} must be a non-empty string`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:489:    missReasons.push(recipeMiss('metadata', 'commandRecipe.command must be a non-empty string'));
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1070:  // Round once after weighted normalization so the row score stays stable.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1123:  const resourceRecall = setRecall(expected && expected.resources, observedForRecall);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1154:  // Asset support lane (advisory, not in the weighted aggregate). The router
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1282:  // skill was tuned on; holdout is the decontaminated generalization check and
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1285:  // rows, so aggregateScore is byte-identical to the pre-split behavior.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1304:  // scenarios are decontaminated holdout vs adversarial suppression.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1340:  const aggregateScore = avgOf(fittedRows, (r) => r.modeAScore);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1342:  const generalizationGap = (aggregateScore != null && holdoutScore != null)
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1343:    ? aggregateScore - holdoutScore
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1351:  // only dimension that flips: weighted D4 stays unscored harness-wide because no
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1352:  // live weighted-D4 scorer is wired. The aggregate is unaffected either way —
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1377:  // Advisory signals — surfaced but NOT folded into the weighted aggregate (so
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1378:  // the v1 dimension weights/verdict are unchanged). D4_task_outcome is attached
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1386:  // matched the fixture's expected.mode. Never folded into aggregateScore.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1392:    ? { score: null, status: 'unscored (no advisor probe or no rank-below gold)', note: 'advisor target rank relative to sibling transports; advisory, not weighted' }
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1393:    : { score: relativeRankingAvg, note: 'advisor target rank relative to sibling transports; advisory, not weighted' };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1427:  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1428:  else if (aggregateScore >= 80 && !hasActiveP1) verdict = 'PASS';
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1429:  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1432:  // Generalization / circularity block: fitted vs decontaminated-holdout scores
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1437:    fittedScore: aggregateScore,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1456:    aggregateScore,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1476:      D4_task_outcome: d4TaskAvg === null
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1480:        ? { score: null, status: 'deferred (router) or no asset gold', note: 'deferred-asset support recall; advisory, not weighted' }
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1481:        : { score: assetRecallAvg, note: 'deferred-asset support recall; advisory, not weighted' },
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:16:      expectedResources: ['assets/security_checklist.md'], negativeActivation: false,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:31:      expectedResources: ['assets/security_checklist.md'], negativeActivation: false,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:46:      expectedResources: ['references/a.md'], expectedIntent: 'SECURITY', negativeActivation: false,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:61:      expectedResources: ['references/a.md'], expectedIntent: 'SECURITY', negativeActivation: false,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:75:      expectedResources: ['assets/security_checklist.md'], negativeActivation: false,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts:48:// INTENT_MODEL carries tuple-weighted keywords: "KEY": {"keywords": [("kw", N), ...]}.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/routing-allowlist.vitest.ts:50:  it('malformed allowlist json falls back to empty (no crash, no exemptions)', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:11:// the reporting change never moves the weighted aggregate.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:38:    // normalized out of the weighted score.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:39:    expect(typeof report.aggregateScore).toBe('number');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts:54:    expect(report.advisorySignals.D4_task_outcome.status).toBe('not-run-no-target-scenarios');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts:94:    const root = mkdtempSync(join(tmpdir(), 'parent-hub-vocab-empty-'));
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:32:| `skill-benchmark.vitest.ts` | Orchestrator and Mode A coverage: `loop-host.cjs` mode wiring (skill-benchmark as a valid mode, single-step plan, fail-closed args, byte-identical Lane A default), `router-replay.cjs` routing including inline vs reference-following routers, `contamination-lint.cjs`, `d5-connectivity.cjs` hard gate, `score-skill-benchmark.cjs` scoring with negative-activation, `build-report.cjs` report render, `advisor-probe.cjs` D1-inter scoring, malformed-fixture degradation, and the dual `skill-benchmark-report.json` / `.md` artifacts via `run-skill-benchmark.cjs`. |
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:150:  it('each surface child router parses with a non-empty resource map', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:152:      expect(Object.keys(children[s]).length, `${s} resourceMap empty`).toBeGreaterThan(0);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:46:    expect(sd.expectedResources.length).toBeGreaterThan(3);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:81:      expectedResources: ['references/a.md', 'references/b.md'], negativeActivation: false,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:134:    const scenario = { scenarioId: 'L-1', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], negativeActivation: false };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:140:  it('degrades to unparseable when the stream is empty', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:149:    const scenario = { scenarioId: 'SM-1', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], negativeActivation: false };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:161:    const scenario = { scenarioId: 'SM-2', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], negativeActivation: false };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:173:    const emptyPlaybook = mkdtempSync(join(tmpdir(), 'skc-empty-pb-'));
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:175:    run({ skill: SKCODE, 'outputs-dir': out, 'playbook-dir': emptyPlaybook, 'trace-mode': 'router' });
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:177:    // sk-code's real playbook yields 24 scenarios; an empty custom dir yields 0,
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:259:    expect(r.staged[0].gates).toHaveProperty('contamination');
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:263:  it('contamination gate rejects a prompt that names the skill', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:267:      prompt: 'use the sk-code skill to do X', expectedResources: [],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:270:    expect(g.contamination).toBe(false);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:284:    expect(report.aggregateScore).toBe(80); // browser row excluded from the avg
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:290:    const scenario = { scenarioId: 'A-1', classKind: 'routing', expectedResources: ['references/a.md'], expectedAssets: ['assets/x.js'], negativeActivation: false };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:299:    const scenario = { scenarioId: 'A-2', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], expectedAssets: ['assets/x.js', 'assets/y.js'], negativeActivation: false };
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:329:describe('aggregate — advisory signals are additive, not weighted', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:330:  it('surfaces D4_task_outcome + assetRecall without changing the weighted aggregate', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:337:    expect(report.aggregateScore).toBe(80); // unchanged by the advisory signals
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts:338:    expect(report.advisorySignals.D4_task_outcome.score).toBe(70);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:58:const { buildBannedVocab, lintFixture } = require(join(SB, 'contamination-lint.cjs'));
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:175:describe('Lane C — contamination linter', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:338:    expect(report.aggregateScore).toBeGreaterThanOrEqual(80);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:567:      expectedResources: opts.expectedResources || ['references/a.md'],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:575:      observedResources: opts.observedResources || opts.expectedResources || ['references/a.md'],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:593:    expect(withHoldout.aggregateScore).toBe(fittedOnly.aggregateScore);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:596:    expect(withHoldout.generalization.generalizationGap).toBe(withHoldout.aggregateScore - holdout.modeAScore);
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:604:    expect(rep.aggregateScore).toBe(Math.round((r1.modeAScore + r2.modeAScore) / 2));
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:613:      expectedResources: [],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:641:    // A decontaminated/holdout prompt the keyword router cannot match routes
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:645:      scenarioId: 'empty', tier: 'T2',
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:778:    // Advisory mode signal must NOT move the weighted Mode A score.
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:791:  it('aggregate surfaces modePrecision in advisorySignals, outside the weighted aggregate', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:795:    // The advisory signal is not listed as a weighted dimension.

exec
/bin/zsh -lc "sed -n '160,290p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1260,1465p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  expected = normalizeExpectedRouteGold(expected, scenario, arg);
  return { scenarioId, tier, routerResult, expected, advisorResult, scenario };
}

function computeSurfaceMatch(scenario, obs) {
  const expectedSurface = scenario ? scenario.expectedSurface : undefined;
  const observedSurface = obs ? (obs.observedSurface || null) : undefined;
  const surfaceMatch = (expectedSurface && observedSurface)
    ? (observedSurface === expectedSurface) : null;
  return { expectedSurface, observedSurface, surfaceMatch };
}

function scoreD1Intra({ expected, routerResult, negative, surfaceMatch, intentRecall, resourceRecall, liveTier }) {
  if (negative) {
    // A suppression scenario fails when a FORBIDDEN resource is routed — matched
    // by prefix, since the gold is usually a glob (`references/webflow/*`). The
    // positive "should-load" set is NOT the forbidden set: a scenario can require
    // the universal tier while forbidding a surface. When a positive set is named
    // (e.g. an UNKNOWN stack that still loads the universal refs), score it on
    // recall and hard-cap only if a forbidden resource leaked; with no positive
    // set, fall back to "any routing is over-activation" (a route-nothing gold).
    const forbidden = expected.forbiddenResources || [];
    const leaked = forbidden.some((f) => (routerResult.resources || []).some((r) => r.startsWith(f)));
    if ((expected.resources || []).length > 0) {
      const rr = resourceRecall == null ? 1 : resourceRecall;
      return { score: leaked ? Math.min(0.3, rr) : rr, intentRecall, resourceRecall, negative: true, forbiddenLeaked: leaked };
    }
    // No positive set: only a declared-forbidden leak fails the scenario. In
    // router mode the skill is already selected, so "routed something" is not
    // itself over-activation (that is an advisor-lane concern); a disambiguation
    // scenario that names neither a positive nor a forbidden set stays neutral.
    return { score: leaked ? 0 : 1, intentRecall, resourceRecall, negative: true, forbiddenLeaked: leaked };
  }
  const rr = resourceRecall == null ? 1 : resourceRecall;
  // Live mode never asks the model for the internal intent-signal key, so intent
  // recall is unobservable there; scoring d1-intra on resource recall alone keeps
  // the live number honest instead of flatly halving it by an always-zero term.
  // Router mode keeps the intent+resource blend since the key is deterministically
  // observable there.
  const d1 = liveTier
    ? { score: rr, intentRecall, resourceRecall, negative: false, liveResourceOnly: true }
    : {
        score: D1_INTRA_INTENT_WEIGHT * (intentRecall == null ? 1 : intentRecall) + D1_INTRA_RESOURCE_WEIGHT * rr,
        intentRecall,
        resourceRecall,
        negative: false,
      };
  if (surfaceMatch === false) {
    d1.surfaceMismatch = true;
    d1.score = Math.min(d1.score, SURFACE_MISMATCH_D1_CAP);
  }
  return d1;
}

/**
 * Compute D2 discovery recall proxy for the resources surfaced by the router.
 *
 * @param {Object} params - Inputs from D1-intra and resource recall.
 * @returns {Object} D2 proxy score payload.
 */
function scoreD2({ negative, d1intra, resourceRecall }) {
  return {
    score: negative ? d1intra.score : (resourceRecall == null ? 1 : resourceRecall),
    proxy: 'router-replay-recall',
    note: 'Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR',
  };
}

/**
 * Compute D3 routing-efficiency proxy from unexpected routed resources.
 *
 * @param {Object} params - Router output and expected resources.
 * @returns {Object} D3 proxy score payload.
 */
function scoreD3({ negative, d1intra, routerResult, expected }) {
  const routed = routerResult.resources.length;
  const unexpectedRoutedCount = expected && expected.resources
    ? routerResult.resources.filter((r) => !expected.resources.includes(r)).length
    : 0;
  if (negative) {
    return {
      score: d1intra.score,
      routedCount: routed,
      // In negative scenarios, every routed resource is suppression waste.
      wastedCount: routed,
      proxy: 'negative-activation',
      note: 'negative scenario: D3 tracks the suppression outcome, not over-routing',
    };
  }
  // No positive resource gold: over-routing is unmeasurable. Against an empty
  // expectation every routed resource would count as waste, scoring a spurious
  // zero, so a resourceless scenario would be punished for routing anything at
  // all. Return a not-applicable score instead — the same convention D1-inter
  // uses when no advisor probe ran — so this dimension drops out and the row is
  // normalized over the dims that were actually measured.
  if (!expected || !expected.resources || expected.resources.length === 0) {
    return {
      score: null,
      routedCount: routed,
      wastedCount: 0,
      proxy: 'no-positive-gold',
      note: 'not-applicable: no expected-resource gold to measure over-routing against',
    };
  }
  // Routed nothing against positive gold: there is no routing to measure
  // efficiency over. Crediting full efficiency here would reward a total recall
  // miss (d1-intra/d2 are already 0), flooring an outright failure. Mark it
  // not-applicable so the dimension drops out and the row is judged on recall
  // alone — the same convention as the no-positive-gold case above.
  if (routed === 0) {
    return {
      score: null,
      routedCount: 0,
      wastedCount: 0,
      proxy: 'no-routing',
      note: 'not-applicable: nothing routed against positive gold; over-routing efficiency undefined',
    };
  }
  return {
    score: Math.max(0, 1 - unexpectedRoutedCount / routed),
    routedCount: routed,
    wastedCount: unexpectedRoutedCount,
    proxy: 'router-overload',
    note: 'Mode A proxy; live-mode replaces with calls/tokens-to-first-expected',
  };
}

/**
 * Compute the advisory asset-recall lane; null scores are explicit unscored states.
 *
 * @param {Object} expected - Expected resources/assets for the scenario.

 succeeded in 0ms:
  if (!skillRoot) return { visible: true, owner: null };
  if (fs.existsSync(path.join(skillRoot, 'graph-metadata.json'))) {
    return { visible: true, owner: path.basename(skillRoot) };
  }
  let dir = path.dirname(skillRoot);
  for (let hops = 0; hops < 6 && dir && dir !== path.dirname(dir); hops += 1) {
    if (fs.existsSync(path.join(dir, 'graph-metadata.json'))) {
      return { visible: false, owner: path.basename(dir) };
    }
    if (path.basename(dir) === 'skills') break;
    dir = path.dirname(dir);
  }
  return { visible: false, owner: null };
}

function aggregate({ skillId, skillRoot, scenarioRows, connectivity, hubRegistry = {}, traceMode, lintFindings, divergence }) {
  const rows = scenarioRows.filter(Boolean).map((row) => applyAggregateToolSurface(row, skillRoot));
  const avg = (sel) => {
    const vals = rows.map(sel).filter((v) => typeof v === 'number');
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  // Benchmark stage partition. The fitted set (routing + negative) is what the
  // skill was tuned on; holdout is the decontaminated generalization check and
  // is kept OUT of the headline aggregate so it can neither inflate nor deflate
  // it. When no row declares a stage (every shipped corpus today) fittedRows ===
  // rows, so aggregateScore is byte-identical to the pre-split behavior.
  const stageOf = (r) => (r && (r.stage === 'holdout' || r.stage === 'negative') ? r.stage : 'routing');
  const fittedRows = rows.filter((r) => stageOf(r) !== 'holdout');
  const holdoutRows = rows.filter((r) => stageOf(r) === 'holdout');
  const negativeRows = rows.filter((r) => stageOf(r) === 'negative');
  const avgOf = (subset, sel) => {
    const vals = subset.map(sel).filter((v) => typeof v === 'number');
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  // Per-classKind coverage. Browser scenarios are routed out of the text
  // executors; routed-out rows enter neither the funnel nor the score average.
  const coverage = { routing: 0, advisor: 0, browser: 0, routedOut: 0, scored: 0 };
  for (const r of rows) {
    const k = r.classKind || 'routing';
    if (coverage[k] !== undefined) coverage[k] += 1;
    if (r.routedOut) coverage.routedOut += 1;
    else if (typeof r.modeAScore === 'number') coverage.scored += 1;
  }
  // Stage-axis counts (orthogonal to the classKind buckets above): how many
  // scenarios are decontaminated holdout vs adversarial suppression.
  coverage.holdout = holdoutRows.length;
  coverage.negative = negativeRows.length;
  // Funnel attrition: count first-failing-stage occurrences (scored rows only).
  const funnel = {};
  for (const r of rows) {
    if (r.routedOut) continue;
    const stage = r.firstFailingStage || 'passed';
    funnel[stage] = (funnel[stage] || 0) + 1;
  }
  const headlineBottleneck = Object.entries(funnel)
    .filter(([k]) => k !== 'passed')
    .sort((a, b) => b[1] - a[1])[0] || null;
  const hubRouteFailures = rows
    .filter((r) => r.dims && r.dims.hubRoute && r.dims.hubRoute.applicable && !r.dims.hubRoute.pass)
    .map((r) => r.dims.hubRoute);
  const hubRouteRegressions = hubRouteFailures.filter((h) => h.knownGap !== true).length;
  const hubRouteKnownGaps = hubRouteFailures.filter((h) => h.knownGap === true).length;
  const hubRouteGate = {
    failed: hubRouteRegressions > 0,
    regressions: hubRouteRegressions,
    knownGaps: hubRouteKnownGaps,
    reason: hubRouteRegressions > 0 ? 'route-gold regression' : null,
  };
  const toolSurfaceFailures = rows
    .filter((r) => r.dims && r.dims.toolSurface && r.dims.toolSurface.applicable && !r.dims.toolSurface.pass);
  const toolSurfaceViolations = toolSurfaceFailures.flatMap((r) => (r.dims.toolSurface.violations || [])
    .map((violation) => ({ scenarioId: r.scenarioId, ...violation })));
  const toolSurfaceGate = {
    failed: toolSurfaceViolations.length > 0,
    violations: toolSurfaceViolations,
    reason: toolSurfaceViolations.length > 0 ? 'tool-surface violation' : null,
  };

  const d5 = connectivity.score;
  // Headline aggregate is the FITTED set only (holdout excluded).
  const aggregateScore = avgOf(fittedRows, (r) => r.modeAScore);
  const holdoutScore = avgOf(holdoutRows, (r) => r.modeAScore);
  const generalizationGap = (aggregateScore != null && holdoutScore != null)
    ? aggregateScore - holdoutScore
    : null;
  // D1-inter is scored only when advisor probes ran; avg() returns null if no row
  // carried a numeric D1-inter score, so the dimension self-reports its coverage.
  const d1interAvg = avg((r) => (r.dims && r.dims.d1inter && typeof r.dims.d1inter.score === 'number'
    ? Math.round(r.dims.d1inter.score * 100) : null));
  // Distinguish excluded-by-design (advisor-invisible target, structurally N/A)
  // from runnable-but-unscored (advisor-visible, no probe ran). D1-inter is the
  // only dimension that flips: weighted D4 stays unscored harness-wide because no
  // live weighted-D4 scorer is wired. The aggregate is unaffected either way —
  // modeAScore already drops D1-inter/D4 when null.
  const advisorTopology = resolveAdvisorOwner(skillRoot);
  const excludedDimensions = [];
  let d1interDim;
  if (!advisorTopology.visible) {
    d1interDim = {
      points: WEIGHTS.d1inter,
      score: null,
      applicable: false,
      status: 'excluded-by-design',
      reason: advisorTopology.owner
        ? `advisor-invisible surface bundled by advisor identity ${advisorTopology.owner}`
        : 'advisor-invisible skill (no graph-metadata.json); not an advisor routing target',
      delegatedMeasure: advisorTopology.owner ? { targetSkill: advisorTopology.owner } : null,
    };
    excludedDimensions.push('D1inter');
  } else {
    d1interDim = d1interAvg === null
      ? { points: WEIGHTS.d1inter, score: null, status: 'unscored-mode-a' }
      : { points: WEIGHTS.d1inter, score: d1interAvg };
  }
  const unscoredDimensions = [];
  if (advisorTopology.visible && d1interAvg === null) unscoredDimensions.push('D1inter');
  unscoredDimensions.push('D4');
  // Advisory signals — surfaced but NOT folded into the weighted aggregate (so
  // the v1 dimension weights/verdict are unchanged). D4_task_outcome is attached
  // to rows by the orchestrator's opt-in D4-R ablation pass; assetRecall comes
  // from the per-scenario asset lane.
  const d4TaskAvg = avg((r) => (r.d4TaskOutcome && typeof r.d4TaskOutcome.score === 'number'
    ? Math.round(r.d4TaskOutcome.score * 100) : null));
  const assetRecallAvg = avg((r) => (r.dims && r.dims.assetRecall && typeof r.dims.assetRecall.score === 'number'
    ? Math.round(r.dims.assetRecall.score * 100) : null));
  // Mode-precision advisory: share of scored rows whose advisor-resolved mode
  // matched the fixture's expected.mode. Never folded into aggregateScore.
  const modePrecisionAvg = avg((r) => (r.dims && r.dims.modePrecision && typeof r.dims.modePrecision.score === 'number'
    ? Math.round(r.dims.modePrecision.score * 100) : null));
  const relativeRankingAvg = avg((r) => (r.dims && r.dims.relativeRanking && typeof r.dims.relativeRanking.score === 'number'
    ? Math.round(r.dims.relativeRanking.score * 100) : null));
  const relativeRankingSignal = relativeRankingAvg === null
    ? { score: null, status: 'unscored (no advisor probe or no rank-below gold)', note: 'advisor target rank relative to sibling transports; advisory, not weighted' }
    : { score: relativeRankingAvg, note: 'advisor target rank relative to sibling transports; advisory, not weighted' };
  const routeTelemetry = reduceRouteTelemetry(rows);
  const recipeMiss = reduceRecipeMiss(rows);
  const runQualityNote = buildRunQualityNote({
    routeTelemetry,
    recipeMiss,
    modePrecisionAvg,
    relativeRankingSignal,
  });
  const gateFailed = connectivity.gateFailed;

  // Bottlenecks: D5 findings + any scenario stage failures, ranked by severity.
  const bottlenecks = [
    ...connectivity.findings,
    ...(Array.isArray(hubRegistry.findings) ? hubRegistry.findings : []),
  ];
  if (headlineBottleneck) {
    const onlyKnownRouteGaps = hubRouteGate.regressions === 0
      && hubRouteGate.knownGaps > 0
      && ['silent-default', 'wrong-mode', 'bundle-mismatch'].includes(headlineBottleneck[0]);
    bottlenecks.unshift({
      class: onlyKnownRouteGaps ? 'routing_known_gap' : 'funnel_attrition',
      severity: onlyKnownRouteGaps ? 'P3' : 'P1',
      stage: headlineBottleneck[0],
      detail: `${headlineBottleneck[1]} scenario(s) first fail at stage '${headlineBottleneck[0]}'`,
    });
  }

  const hasActiveP1 = bottlenecks.some((bottleneck) => bottleneck.severity === 'P1');
  let verdict;
  if (gateFailed) verdict = 'BLOCKED-BY-STRUCTURE';
  else if (hubRegistry && hubRegistry.gateFailed) verdict = 'BLOCKED-BY-REGISTRY';
  else if (hubRouteGate.failed) verdict = 'BLOCKED-BY-ROUTING';
  else if (toolSurfaceGate.failed) verdict = 'BLOCKED-BY-TOOL-SURFACE';
  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
  else if (aggregateScore >= 80 && !hasActiveP1) verdict = 'PASS';
  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
  else verdict = 'FAIL';

  // Generalization / circularity block: fitted vs decontaminated-holdout scores
  // and their gap. A large positive gap (fitted >> holdout) is the circularity
  // signal — the skill scores well on what it was tuned against but generalizes
  // worse. Dormant (holdout null) until a corpus declares stage:holdout fixtures.
  const generalization = {
    fittedScore: aggregateScore,
    holdoutScore,
    generalizationGap,
    fittedCount: fittedRows.filter((r) => typeof r.modeAScore === 'number').length,
    holdoutCount: holdoutRows.filter((r) => typeof r.modeAScore === 'number').length,
    negativeCount: negativeRows.length,
    note: holdoutRows.length === 0
      ? 'no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)'
      : 'holdout excluded from the fitted aggregate; gap = fitted minus holdout',
  };

  return {
    schemaVersion: 'skill-benchmark-report.v1',
    status: 'skill-benchmark-complete',
    mode: 'skill-benchmark',
    scoringMethod: (traceMode || 'router') === 'live' ? 'mode-b-live' : 'mode-a-router-replay',
    traceMode: traceMode || 'router',
    targetSkill: { id: skillId, root: skillRoot },
    verdict,
    aggregateScore,
    generalization,
    gate: {
      d5Score: d5,
      gateFailed,
      reason: gateFailed ? 'D5 structural hard-gate failure' : null,
      hubRoute: hubRouteGate,
      toolSurface: toolSurfaceGate,
    },
    dimensionScores: {

exec
/bin/zsh -lc "sed -n '1080,1175p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    observedReads: obs.raw.observedReads,
    statedRoutingParsed: !!(obs.raw.stated && Object.keys(obs.raw.stated).length),
    responseHead: (obs.raw.responseText || '').slice(0, 300),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a single scenario from its router-replay result joined with private gold.
 * @param {Object} arg - Scenario input (legacy {scenarioId,tier,routerResult,expected,advisorResult} or new {scenario,observed,traceMode}).
 * @returns {{ scenarioId, dims, firstFailingStage, modeAScore, applicable }}
 */
function scoreScenario(arg) {
  const { scenarioId, tier, routerResult, expected, advisorResult, scenario } = normalizeScenarioInput(arg);
  // Surface correctness is meaningful only when an executor observed a surface
  // (live mode); router mode leaves observedSurface null. Computed up front so a
  // wrong observed surface can fail routing rather than passing on incidental
  // resource overlap.
  const obs = arg.observed || null;
  const { expectedSurface, observedSurface, surfaceMatch } = computeSurfaceMatch(scenario, obs);

  const dims = {};
  const negative = expected && expected.negativeActivation === true;
  // Benchmark stage drives the aggregate's fitted/holdout partition. Only
  // holdout/negative are meaningful; anything else (incl. the legacy
  // no-scenario call shape) is fitted routing.
  const stage = scenario && (scenario.stage === 'holdout' || scenario.stage === 'negative')
    ? scenario.stage
    : 'routing';

  // D1-intra: did the in-skill router select the expected intents + resources?
  // Live mode reports references and assets on SEPARATE channels (the model states
  // "resources" and "assets" distinctly). Credit correct asset routing in recall by
  // folding stated assets into the observed set here; D3 over-routing below stays
  // references-only so a deferred, correctly-named asset is not re-read as waste.
  const liveTier = tier === 'live';
  const observedForRecall = liveTier
    ? [...new Set([...(routerResult.resources || []), ...((obs && obs.observedAssets) || [])])]
    : routerResult.resources;
  const intentRecall = setRecall(expected && expected.intentKeys, routerResult.intents);
  const resourceRecall = setRecall(expected && expected.resources, observedForRecall);
  dims.d1intra = scoreD1Intra({ expected, routerResult, negative, surfaceMatch, intentRecall, resourceRecall, liveTier });

  // Command recipe validity is gold-gated. Without recipe gold it is inert; when
  // present, an undefined or malformed recipe soft-caps D2/D3 instead of adding
  // a new hard verdict gate.
  dims.commandRecipe = scoreCommandRecipe({ expected, skillRoot: arg.skillRoot, routerResult, observed: obs });

  // D2 proxy (Mode A): recall of expected resources in the routed set. In live
  // mode this is replaced by Hit@k/Recall@k/MRR over the observed load trace.
  dims.d2 = scoreD2({ negative, d1intra: dims.d1intra, resourceRecall });

  // D3 efficiency proxy (Mode A): penalize over-routing — resources routed that
  // are not in the expected set are "wasted loads". Live mode uses tool-call /
  // token cost to first expected resource.
  // For a negative scenario the "expected" resources are the ones that must NOT
  // be routed, so the over-routing math inverts (routing them reads as zero
  // waste). Couple D3 to the suppression outcome instead, mirroring D2.
  dims.d3 = scoreD3({ negative, d1intra: dims.d1intra, routerResult, expected });
  const recipeCapped = dims.commandRecipe.applicable && !dims.commandRecipe.valid;
  if (recipeCapped) {
    dims.d2.uncappedScore = dims.d2.score;
    dims.d2.score = Math.min(dims.d2.score, RECIPE_INVALID_CAP);
    dims.d2.recipeCapped = true;
    if (typeof dims.d3.score === 'number') {
      dims.d3.uncappedScore = dims.d3.score;
      dims.d3.score = Math.min(dims.d3.score, RECIPE_INVALID_CAP);
      dims.d3.recipeCapped = true;
    }
  }

  // Asset support lane (advisory, not in the weighted aggregate). The router
  // defers assets/* on demand, so they are scored separately instead of inside
  // D2/D3. Router mode has no observed-asset channel (assets are not in the
  // first slice), so it reports deferred; live mode scores stated-asset recall.
  dims.assetRecall = scoreAssetRecall(expected, obs);

  // D1-inter: scored deterministically when an advisor probe is supplied (the
  // Python advisor reads the SQLite graph, no LLM), else left unscored.
  if (advisorResult) {
    const inter = scoreD1Inter({ advisorResult, expectedSkillId: expected && expected.skillId, negative });
    dims.d1inter = inter.ok
      ? { score: inter.score, rank: inter.rank, topSkill: inter.topSkill }
      : { score: null, unscored: 'advisor probe failed', error: advisorResult.error };
  } else {
    dims.d1inter = { score: null, unscored: 'no advisor probe (run with --advisor-mode=python)' };
  }
  // D4 usefulness ablation: still needs live skill-on/off dispatch (follow-on).
  dims.d4 = { score: null, unscored: 'requires skill-on/off ablation (live mode)' };

  // Mode-precision (ADVISORY, never gated): for parent-skill fixtures the gate
  // is skill-id (D1-inter); this only reports whether the advisor's resolved
  // deep-loop mode matches the fixture's expected.mode. Scored when the

exec
/bin/zsh -lc "sed -n '1,190p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ contamination-lint.cjs — pre-dispatch hint-free fixture gate             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * contamination-lint.cjs — pre-dispatch hint-free gate.
 *
 * A public fixture prompt must not leak the answer. The lint reuses the same
 * lowercased-substring logic the routers themselves use to decide a match, so
 * "hint-free" is decided by the identical mechanism that would otherwise be
 * gamed. Banned vocabulary is built from the target skill's own identity:
 * name/id, frontmatter triggers, router keywords, intent keys, resource path
 * segments + basenames, and the private gold labels for the scenario. A hard
 * leak is a FIXTURE failure (fix the fixture, not the skill).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { parseRouter } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

/**
 * Extract trigger phrases and the skill name from a SKILL.md frontmatter block.
 * @param {string} skillMd - Raw SKILL.md contents (may be empty).
 * @returns {string[]} Trigger phrases plus the frontmatter name, if present.
 */
function frontmatterTriggers(skillMd) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(skillMd);
  if (!fm) return [];
  const triggers = [];
  const block = fm[1];
  const tm = /trigger_phrases:\s*\n((?:\s*-\s*.+\n?)+)/.exec(block);
  if (tm) {
    for (const line of tm[1].split('\n')) {
      const v = /-\s*["']?([^"'\n]+)["']?\s*$/.exec(line);
      if (v) triggers.push(v[1].trim());
    }
  }
  const nameM = /^name:\s*["']?([^"'\n]+)/m.exec(block);
  if (nameM) triggers.push(nameM[1].trim());
  return triggers;
}

function pathTokens(resourcePath) {
  const tokens = new Set();
  const base = path.basename(resourcePath);
  tokens.add(base);
  tokens.add(base.replace(/\.[a-z]+$/i, ''));
  for (const seg of resourcePath.split('/')) if (seg && seg.length > 3) tokens.add(seg);
  return [...tokens];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the banned-substring vocabulary for a target skill.
 * @param {Object} params - Vocabulary parameters.
 * @param {string} params.skillRoot - Target skill root directory (holds SKILL.md).
 * @param {string} [params.skillId] - Skill id; defaults to the skillRoot basename.
 * @param {{ skillId?: string, intentKeys?: string[], resources?: string[], assets?: string[] }} [params.privateExpected] - Private gold labels for the scenario.
 * @returns {string[]} lowercased banned substrings
 */
function buildBannedVocab({ skillRoot, skillId, privateExpected }) {
  const skillMd = readIfExists(path.join(skillRoot, 'SKILL.md'));
  const vocab = new Set();
  const add = (s) => { if (s && String(s).trim().length > 2) vocab.add(String(s).toLowerCase()); };

  add(skillId || path.basename(skillRoot));
  add(path.basename(skillRoot));
  for (const t of frontmatterTriggers(skillMd)) add(t);

  const router = parseRouter(skillMd, skillRoot);
  for (const [intentKey, sig] of Object.entries(router.intentSignals)) {
    add(intentKey);
    for (const kw of sig.keywords) add(kw);
  }
  for (const [intentKey, resources] of Object.entries(router.resourceMap)) {
    add(intentKey);
    for (const r of resources) for (const tok of pathTokens(r)) add(tok);
  }

  if (privateExpected) {
    add(privateExpected.skillId);
    for (const k of privateExpected.intentKeys || []) add(k);
    for (const r of privateExpected.resources || []) for (const tok of pathTokens(r)) add(tok);
    for (const a of privateExpected.assets || []) for (const tok of pathTokens(a)) add(tok);
  }
  return [...vocab];
}

/**
 * Lint a public fixture prompt against the banned vocabulary.
 * @param {Object} params - Lint parameters.
 * @param {string} params.publicText - Public prompt text to scan for leaks.
 * @param {string[]} params.bannedVocab - Lowercased banned substrings from buildBannedVocab.
 * @returns {{ passed: boolean, hardLeaks: Array<{term:string}> }}
 */
function lintFixture({ publicText, bannedVocab }) {
  const hay = String(publicText || '').toLowerCase();
  const hardLeaks = [];
  for (const term of bannedVocab) {
    if (term && hay.includes(term)) hardLeaks.push({ term });
  }
  return { passed: hardLeaks.length === 0, hardLeaks };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { buildBannedVocab, lintFixture, frontmatterTriggers };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill || !args.text) {
    process.stderr.write('usage: contamination-lint.cjs --skill <root> --text "<public prompt>"\n');
    process.exit(2);
  }
  const vocab = buildBannedVocab({ skillRoot: args.skill });
  const res = lintFixture({ publicText: args.text, bannedVocab: vocab });
  process.stdout.write(JSON.stringify(res, null, 2) + '\n');
  process.exit(res.passed ? 0 : 1);
}

exec
/bin/zsh -lc "sed -n '1,270p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ d4-ablation — D4/D4-R usefulness ablation (skill-ON vs skill-OFF delta)  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * d4-ablation.cjs — D4 usefulness ablation (APPROXIMATE).
 *
 * "Does the skill actually help?" measured as the quality delta between a
 * skill-ON run and a skill-OFF run of the same scenario, graded by the existing
 * Lane B grader (gradeD4).
 *
 * Honest constraint (validated in the Phase 0 spike): opencode has no clean
 * single-skill suppression. Skill-OFF is APPROXIMATED with
 * MK_SKILL_ADVISOR_HOOK_DISABLED=1 + a "do not load any skill" preamble, then
 * verified by checking the skill was NOT loaded/read (else the pair is dropped
 * as contaminated). D4 scores are stamped attribution:"approximate".
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const { runDispatch, parseLiveResult, buildLiveDispatchPrompt } = require('./live-executor.cjs');
const grader = require('../model-benchmark/scorer/grader/harness.cjs');
const clamp01 = grader.clampScore01;
const buildGraderBase = grader.buildGraderBase;

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the skill-OFF prompt: answer from the model's own knowledge, no skill,
 * no project skill-file reads. Pairs with MK_SKILL_ADVISOR_HOOK_DISABLED=1.
 *
 * @param {Object} scenario - Scenario whose prompt is being ablated.
 * @returns {string} Skill-OFF dispatch prompt.
 */
function buildSkillOffPrompt(scenario) {
  return [
    'Answer ONLY from your own knowledge. Do NOT load any skill and do NOT read project skill files.',
    `Task: ${scenario.prompt || ''}`,
    'Emit ONLY a fenced ```json code block: {"surface": "...", "resources": ["..."], "assets": ["..."], "agent": "none"}',
  ].join('\n');
}

/**
 * Grade the on/off output pair into a normalized D4 usefulness score.
 * Deterministic when graderMode is a mock mode. score in [0,1]: 0.5 = no delta,
 * 1 = skill-on fully better, 0 = skill-off better (skill hurt).
 *
 * @param {Object} args - Grading inputs.
 * @param {Object} args.scenario - Scenario being graded.
 * @param {string} args.onText - Skill-ON response text.
 * @param {string} args.offText - Skill-OFF response text.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4 score object plus raw on/off grades.
 */
async function gradeAblation({ scenario, onText, offText, graderMode = 'mock', cacheDir }) {
  const base = buildGraderBase({ variantHash: 'live', graderMode, cacheDir, dimId: 'D4' });
  const rubric = scenario.passCriteria || scenario.prompt || '';
  const onG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#on`, rubric }, swe16_output_text: onText || '', ...base });
  const offG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#off`, rubric }, swe16_output_text: offText || '', ...base });
  const onScore = clamp01(onG.score);
  const offScore = clamp01(offG.score);
  const score = clamp01(0.5 + (onScore - offScore) / 2);
  return { d4: { score, onScore, offScore, attribution: 'approximate', graderMode }, raw: { onG, offG } };
}

/**
 * Full live ablation: two real dispatches (on/off) + grade. Spends API.
 *
 * @param {Object} args - Ablation inputs.
 * @param {Object} args.scenario - Scenario to ablate.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} args.model - Model id for dispatch.
 * @param {string} args.variant - Reasoning-effort variant.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4 result object (graded or unscored).
 */
async function runD4Ablation({ scenario, skillRoot, model, variant, graderMode = 'mock', cacheDir }) {
  const dir = path.resolve(skillRoot, '..', '..', '..');
  const skillId = path.basename(skillRoot || '');

  const on = runDispatch({ prompt: buildLiveDispatchPrompt(scenario), dir, model, variant });
  const off = runDispatch({ prompt: buildSkillOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
  if (on.status !== 0 || off.status !== 0) {
    return { d4: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate' } };
  }
  const onParsed = parseLiveResult(on.stdout, { skillId });
  const offParsed = parseLiveResult(off.stdout, { skillId });

  // Contamination guard: skill-OFF must NOT have loaded/read the skill.
  const offTouched = (offParsed.activation && offParsed.activation.activated)
    || (offParsed.raw.observedReads || []).length > 0;
  if (offTouched) {
    return { d4: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate' }, contaminated: true };
  }

  const graded = await gradeAblation({
    scenario, onText: onParsed.raw.responseText, offText: offParsed.raw.responseText, graderMode, cacheDir,
  });
  return { ...graded, onActivated: !!(onParsed.activation && onParsed.activation.activated) };
}

// ─────────────────────────────────────────────────────────────────────────────
// D4-R: task-outcome usefulness (the complement of the hallucination delta).
//
// The hallucination ablation above grades a ROUTING-ANALYSIS answer with a
// grader that is explicitly forbidden from scoring correctness — so it cannot
// say whether the skill makes a ROUTINE TASK answer better. D4-R fixes that: it
// asks the model to produce the actual change (a minimal patch plan + the
// verification command), not a list of which docs it would load, and grades the
// on/off pair with a task-outcome rubric. Reported as a SEPARATE number; the two
// are never collapsed.
// ─────────────────────────────────────────────────────────────────────────────

const TASK_OUTCOME_PROMPT_PATH = path.join(
  __dirname, '..', 'model-benchmark', 'scorer', 'grader', 'prompts', 'system-grader-task-outcome.md',
);

/**
 * Build the skill-ON task-outcome prompt: do the work, do not just route.
 *
 * @param {Object} scenario - Scenario whose task is being graded.
 * @returns {string} Skill-ON task-outcome dispatch prompt.
 */
function buildTaskOutcomePrompt(scenario) {
  return [
    'Produce a MINIMAL implementation plan for the task below — not a routing list.',
    `Task: ${scenario.prompt || ''}`,
    'Using the project code skill, output exactly: (1) the precise file(s) to change and the',
    'exact edit (a short unified-diff-style sketch is fine), and (2) the verification command(s)',
    'that would confirm the change. Do NOT edit files. Do NOT just list which docs you would load.',
  ].join('\n');
}

/**
 * Build the skill-OFF task-outcome prompt: same work, from the model's own
 * knowledge, no skill.
 *
 * @param {Object} scenario - Scenario whose task is being graded.
 * @returns {string} Skill-OFF task-outcome dispatch prompt.
 */
function buildTaskOutcomeOffPrompt(scenario) {
  return [
    'Answer ONLY from your own knowledge. Do NOT load any skill and do NOT read project skill files.',
    `Task: ${scenario.prompt || ''}`,
    'Output exactly: (1) the precise file(s) to change and the exact edit, and (2) the verification',
    'command(s) that would confirm it. Do NOT edit files.',
  ].join('\n');
}

/**
 * Grade an on/off task-outcome pair with the task-outcome rubric (NOT the
 * hallucination grader). Deterministic under a mock graderMode. Mirrors
 * gradeAblation's delta math so the two instruments are comparable.
 *
 * @param {Object} args - Grading inputs.
 * @param {Object} args.scenario - Scenario being graded.
 * @param {string} args.onText - Skill-ON response text.
 * @param {string} args.offText - Skill-OFF response text.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4-R score object plus raw on/off grades.
 */
async function gradeTaskOutcome({ scenario, onText, offText, graderMode = 'mock', cacheDir }) {
  const base = buildGraderBase({
    variantHash: 'live-d4r', graderMode, cacheDir, systemPromptPath: TASK_OUTCOME_PROMPT_PATH, dimId: 'D4-R',
  });
  const rubric = scenario.passCriteria || scenario.prompt || '';
  const onG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#taskoutcome#on`, rubric }, swe16_output_text: onText || '', ...base });
  const offG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#taskoutcome#off`, rubric }, swe16_output_text: offText || '', ...base });
  const onScore = clamp01(onG.score);
  const offScore = clamp01(offG.score);
  const score = clamp01(0.5 + (onScore - offScore) / 2);
  return { d4r: { score, onScore, offScore, attribution: 'approximate', instrument: 'task-outcome', graderMode }, raw: { onG, offG } };
}

/**
 * Full live D4-R ablation: two real dispatches (on/off) in task-outcome mode +
 * grade. Spends API. Same contamination guard as the hallucination ablation.
 *
 * @param {Object} args - Ablation inputs.
 * @param {Object} args.scenario - Scenario to ablate.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} args.model - Model id for dispatch.
 * @param {string} args.variant - Reasoning-effort variant.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4-R result object (graded or unscored).
 */
async function runD4RAblation({ scenario, skillRoot, model, variant, graderMode = 'mock', cacheDir }) {
  const dir = path.resolve(skillRoot, '..', '..', '..');
  const skillId = path.basename(skillRoot || '');

  const on = runDispatch({ prompt: buildTaskOutcomePrompt(scenario), dir, model, variant });
  const off = runDispatch({ prompt: buildTaskOutcomeOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
  if (on.status !== 0 || off.status !== 0) {
    return { d4r: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate', instrument: 'task-outcome' } };
  }
  const onParsed = parseLiveResult(on.stdout, { skillId });
  const offParsed = parseLiveResult(off.stdout, { skillId });

  // Contamination guard: skill-OFF must NOT have loaded/read the skill.
  const offTouched = (offParsed.activation && offParsed.activation.activated)
    || (offParsed.raw.observedReads || []).length > 0;
  if (offTouched) {
    return { d4r: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate', instrument: 'task-outcome' }, contaminated: true };
  }

  const graded = await gradeTaskOutcome({
    scenario, onText: onParsed.raw.responseText, offText: offParsed.raw.responseText, graderMode, cacheDir,
  });
  return { ...graded, onActivated: !!(onParsed.activation && onParsed.activation.activated) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  runD4Ablation, gradeAblation, buildSkillOffPrompt, buildGraderBase, clamp01,
  runD4RAblation, gradeTaskOutcome, buildTaskOutcomePrompt, buildTaskOutcomeOffPrompt,
};

exec
/bin/zsh -lc "sed -n '1400,1495p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    relativeRankingSignal,
  });
  const gateFailed = connectivity.gateFailed;

  // Bottlenecks: D5 findings + any scenario stage failures, ranked by severity.
  const bottlenecks = [
    ...connectivity.findings,
    ...(Array.isArray(hubRegistry.findings) ? hubRegistry.findings : []),
  ];
  if (headlineBottleneck) {
    const onlyKnownRouteGaps = hubRouteGate.regressions === 0
      && hubRouteGate.knownGaps > 0
      && ['silent-default', 'wrong-mode', 'bundle-mismatch'].includes(headlineBottleneck[0]);
    bottlenecks.unshift({
      class: onlyKnownRouteGaps ? 'routing_known_gap' : 'funnel_attrition',
      severity: onlyKnownRouteGaps ? 'P3' : 'P1',
      stage: headlineBottleneck[0],
      detail: `${headlineBottleneck[1]} scenario(s) first fail at stage '${headlineBottleneck[0]}'`,
    });
  }

  const hasActiveP1 = bottlenecks.some((bottleneck) => bottleneck.severity === 'P1');
  let verdict;
  if (gateFailed) verdict = 'BLOCKED-BY-STRUCTURE';
  else if (hubRegistry && hubRegistry.gateFailed) verdict = 'BLOCKED-BY-REGISTRY';
  else if (hubRouteGate.failed) verdict = 'BLOCKED-BY-ROUTING';
  else if (toolSurfaceGate.failed) verdict = 'BLOCKED-BY-TOOL-SURFACE';
  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
  else if (aggregateScore >= 80 && !hasActiveP1) verdict = 'PASS';
  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
  else verdict = 'FAIL';

  // Generalization / circularity block: fitted vs decontaminated-holdout scores
  // and their gap. A large positive gap (fitted >> holdout) is the circularity
  // signal — the skill scores well on what it was tuned against but generalizes
  // worse. Dormant (holdout null) until a corpus declares stage:holdout fixtures.
  const generalization = {
    fittedScore: aggregateScore,
    holdoutScore,
    generalizationGap,
    fittedCount: fittedRows.filter((r) => typeof r.modeAScore === 'number').length,
    holdoutCount: holdoutRows.filter((r) => typeof r.modeAScore === 'number').length,
    negativeCount: negativeRows.length,
    note: holdoutRows.length === 0
      ? 'no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)'
      : 'holdout excluded from the fitted aggregate; gap = fitted minus holdout',
  };

  return {
    schemaVersion: 'skill-benchmark-report.v1',
    status: 'skill-benchmark-complete',
    mode: 'skill-benchmark',
    scoringMethod: (traceMode || 'router') === 'live' ? 'mode-b-live' : 'mode-a-router-replay',
    traceMode: traceMode || 'router',
    targetSkill: { id: skillId, root: skillRoot },
    verdict,
    aggregateScore,
    generalization,
    gate: {
      d5Score: d5,
      gateFailed,
      reason: gateFailed ? 'D5 structural hard-gate failure' : null,
      hubRoute: hubRouteGate,
      toolSurface: toolSurfaceGate,
    },
    dimensionScores: {
      D1inter: d1interDim,
      D1intra: { points: WEIGHTS.d1intra, score: avg((r) => (r.dims && r.dims.d1intra ? Math.round(r.dims.d1intra.score * 100) : null)) },
      D2: { points: WEIGHTS.d2, score: avg((r) => (r.dims && r.dims.d2 ? Math.round(r.dims.d2.score * 100) : null)) },
      D3: { points: WEIGHTS.d3, score: avg((r) => (r.dims && r.dims.d3 && typeof r.dims.d3.score === 'number' ? Math.round(r.dims.d3.score * 100) : null)) },
      D4: { points: WEIGHTS.d4, score: null, status: 'unscored-mode-a' },
      D5: { points: WEIGHTS.d5, score: d5, hardGate: true },
    },
    unscoredDimensions,
    excludedDimensions,
    advisorySignals: {
      D4_task_outcome: d4TaskAvg === null
        ? { score: null, status: 'unscored (run --d4 in live mode)', note: 'task-outcome usefulness delta; separate from D4 hallucination, never summed into it' }
        : { score: d4TaskAvg, note: 'task-outcome usefulness delta (skill-on vs off), separate from D4 hallucination' },
      assetRecall: assetRecallAvg === null
        ? { score: null, status: 'deferred (router) or no asset gold', note: 'deferred-asset support recall; advisory, not weighted' }
        : { score: assetRecallAvg, note: 'deferred-asset support recall; advisory, not weighted' },
      modePrecision: modePrecisionAvg === null
        ? { score: null, status: 'unscored (no mode-routing probe or no expected.mode)', note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' }
        : { score: modePrecisionAvg, note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' },
      relativeRanking: relativeRankingSignal,
      routeTelemetry,
      recipeMissRate: recipeMiss.recipeMissRate,
      recipeMissBreakdown: recipeMiss.breakdown,
    },
    funnel,
    headlineBottleneck: headlineBottleneck ? headlineBottleneck[0] : null,
    bottlenecks,
    coverage,
    divergence: divergence || [],
    lintFindings: lintFindings || [],

exec
/bin/zsh -lc "sed -n '1030,1085p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      applicable: true,
      pass: false,
      firstFailingStage: 'bash-allowlist',
      violations: bashViolations,
      skippedBashAllowlistChecks,
    };
  }

  return {
    applicable: true,
    pass: true,
    firstFailingStage: null,
    violations: [],
    skippedBashAllowlistChecks,
  };
}

function firstFailingStage({ dims, routerResult, surfaceMatch }) {
  if (dims.d1inter.score !== null && dims.d1inter.score < 0.5) return 'activated-inter';
  if (!routerResult.parseable) return 'router-unparseable';
  if (surfaceMatch === false) return 'surface-mismatch';
  if (dims.hubRoute && dims.hubRoute.applicable && !dims.hubRoute.pass) return dims.hubRoute.firstFailingStage;
  if (dims.toolSurface && dims.toolSurface.applicable && !dims.toolSurface.pass) return dims.toolSurface.firstFailingStage;
  if (dims.commandRecipe && dims.commandRecipe.applicable && !dims.commandRecipe.valid) return dims.commandRecipe.firstFailingStage;
  if (dims.d1intra.score < 0.5) return 'routed-intra';
  if (dims.d2.score < 0.5) return 'discovered';
  return null;
}

function modeAScore(dims) {
  const measured = [
    [dims.d1intra.score, WEIGHTS.d1intra],
    [dims.d2.score, WEIGHTS.d2],
  ];
  // D3 and D1-inter join the measured set only when they were actually scored.
  // A scenario with no positive-resource gold cannot measure over-routing, so
  // its D3 drops out and the row normalizes over the remaining dims.
  if (dims.d3.score !== null) measured.push([dims.d3.score, WEIGHTS.d3]);
  if (dims.d1inter.score !== null) measured.push([dims.d1inter.score, WEIGHTS.d1inter]);
  const wsum = measured.reduce((a, [, w]) => a + w, 0);
  // Round once after weighted normalization so the row score stays stable.
  return Math.round((measured.reduce((a, [s, w]) => a + s * w, 0) / wsum) * 100);
}

function buildLiveEvidence(obs) {
  if (!obs || !obs.raw) return undefined;
  return {
    eventCount: obs.raw.eventCount,
    activated: obs.activation ? obs.activation.activated : undefined,
    toolCalls: (obs.raw.toolCalls || []).map((t) => t.tool),
    observedReads: obs.raw.observedReads,
    statedRoutingParsed: !!(obs.raw.stated && Object.keys(obs.raw.stated).length),
    responseHead: (obs.raw.responseText || '').slice(0, 300),
  };
}


exec
/bin/zsh -lc "sed -n '600,675p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  it('is score-preserving — a stage-less row set yields the plain mean and a null holdout score', () => {
    const r1 = routing('a', ['references/a.md']);
    const r2 = routing('b', ['references/b.md']);
    const rep = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: [r1, r2], connectivity: conn, traceMode: 'router' });
    expect(rep.aggregateScore).toBe(Math.round((r1.modeAScore + r2.modeAScore) / 2));
    expect(rep.generalization.holdoutScore).toBeNull();
    expect(rep.generalization.generalizationGap).toBeNull();
    expect(rep.coverage.holdout).toBe(0);
  });

  it('routes a stage:negative scenario through the inversion lane and counts it in coverage.negative', () => {
    const neg = staged('neg', 'negative', {
      negativeActivation: true,
      expectedResources: [],
      forbiddenResources: ['references/webflow/'],
      observedResources: ['references/webflow/leak.md'],
    });
    expect(neg.dims.d1intra.negative).toBe(true);
    expect(neg.dims.d1intra.score).toBe(0); // leaked a forbidden (suppressed) resource
    const rep = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: [neg], connectivity: conn, traceMode: 'router' });
    expect(rep.coverage.negative).toBe(1);
    expect(rep.generalization.negativeCount).toBe(1);
  });

  it('loader honors stage: stage:negative sets negativeActivation, stage:holdout stays positive', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lc-stage-'));
    const catDir = join(dir, 'cat');
    mkdirSync(catDir, { recursive: true });
    writeFileSync(join(catDir, 'neg.md'), '---\nid: NEG-001\nexpected_intent: review\nstage: negative\nexpected_resources:\n  - references/a.md\n---\nPrompt: exercise a suppression path\n');
    writeFileSync(join(catDir, 'hold.md'), '---\nid: HOLD-001\nexpected_intent: review\nstage: holdout\nexpected_resources:\n  - references/b.md\n---\nPrompt: exercise a holdout path\n');
    const { scenarios } = loadPlaybookScenarios({ playbookDir: dir });
    const neg = scenarios.find((s: any) => s.scenarioId === 'NEG-001');
    const hold = scenarios.find((s: any) => s.scenarioId === 'HOLD-001');
    expect(neg.stage).toBe('negative');
    expect(neg.negativeActivation).toBe(true);
    expect(hold.stage).toBe('holdout');
    expect(hold.negativeActivation).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });

  it('scores a positive scenario that routed nothing as a recall failure (D3 N/A, not a 31 floor)', () => {
    // A decontaminated/holdout prompt the keyword router cannot match routes
    // nothing. Efficiency must be undefined (not a full-marks salvage), so the
    // row is judged on recall alone and an outright miss scores 0.
    const row = scoreScenario({
      scenarioId: 'empty', tier: 'T2',
      routerResult: { parseable: true, intents: [], resources: [], missingResources: [], scores: [] },
      expected: { intentKeys: ['REVIEW'], resources: ['references/a.md'] },
    });
    expect(row.dims.d3.score).toBeNull();
    expect(row.dims.d3.proxy).toBe('no-routing');
    expect(row.modeAScore).toBe(0);
  });
});

describe('Lane C — malformed-fixture degradation', () => {
  it('degrades to an unparseable-fixture row instead of crashing', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const fixDir = mkdtempSync(join(tmpdir(), 'lc-badfix-'));
    writeFileSync(join(fixDir, 'broken.public.json'), '{ not valid json');
    const out = mkdtempSync(join(tmpdir(), 'lc-badout-'));
    const code = run({ skill: join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode'), 'outputs-dir': out, 'fixtures-dir': fixDir });
    expect(code).toBe(0); // did not crash
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    const row = (report.scenarioRows || []).find((r: any) => r.firstFailingStage === 'unparseable-fixture');
    expect(row).toBeTruthy();
    expect(row.loadError).toBeTruthy();
  });
});

describe('Lane C — D5 gate exit code (run-skill-benchmark)', () => {
  const gateDirs: string[] = [];
  afterAll(() => {
    for (const d of gateDirs) rmSync(d, { recursive: true, force: true });
  });


exec
/bin/zsh -lc "rg -n \"function setRecall|empty expected|no expected-resource|expectedResources: \\[\\]\" .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:613:      expectedResources: [],
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:65:function setRecall(expected, actual) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:261:      note: 'not-applicable: no expected-resource gold to measure over-routing against',

exec
/bin/zsh -lc "sed -n '55,78p' .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  ['bash-allowlist', 5],
  ['recipe-invalid', 6],
  ['routed-intra', 7],
  ['discovered', 8],
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function setRecall(expected, actual) {
  if (!expected || expected.length === 0) return null; // not applicable
  const have = new Set(actual || []);
  const hit = expected.filter((e) => have.has(e)).length;
  return hit / expected.length;
}

function scenarioObservationShape(arg) {
  return arg.scenario && arg.observed ? { scenario: arg.scenario, observed: arg.observed } : null;
}

function routeGapFromNotes(notes) {
  return !!(notes && notes.status === KNOWN_ROUTE_GAP_STATUS);
}

web search: 
web search: dynamic benchmark generation contamination resistant GitHub LLM evaluation repository "2025" ...
web search: 
web search: https://github.com/forecastingresearch/forecastbench
web search: 
web search: site:statsmodels.org/stable MixedLM random slopes variance components crossed official ...
web search: 
web search: 
web search: 
web search: https://github.com/TiesPetersen/SkillBenchmark/blob/master/src/stats.py
exec
/bin/zsh -lc 'rg -n "function setRecall|function scoreD1Intra|function scoreD2|function modeAScore|const fittedRows|const holdoutRows|let verdict|const generalization" .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
65:function setRecall(expected, actual) {
172:function scoreD1Intra({ expected, routerResult, negative, surfaceMatch, intentRecall, resourceRecall, liveTier }) {
220:function scoreD2({ negative, d1intra, resourceRecall }) {
1059:function modeAScore(dims) {
1287:  const fittedRows = rows.filter((r) => stageOf(r) !== 'holdout');
1288:  const holdoutRows = rows.filter((r) => stageOf(r) === 'holdout');
1342:  const generalizationGap = (aggregateScore != null && holdoutScore != null)
1422:  let verdict;
1436:  const generalization = {

codex
The attribution design now resolves cleanly: treat “skill available” as the randomized treatment, actual activation as a mediator, and executor as an effect modifier. That yields an honest intention-to-treat skill lift plus diagnostics for routing, instruction use, and executor-specific failure—without confusing model quality with skill quality.
Current Lane C behavior and external mechanisms are verified; the synthesis is ready.
  ✓ Inspect current skill-benchmark scenario, scoring, contamination, and ablation contracts
  ✓ Verify 2–5 new primary-source repos/papers with current metadata
  ✓ Map findings to system-deep-loop targets and produce the required final JSON
codex
Skill-benchmark’s routing diagnostics are stronger than its causal validity. Two fail-open paths matter:

- Empty positive gold becomes `null` in `setRecall()`, then receives full D1/D2 credit before normalization. A structurally sound skill can therefore pass without behavioral gold. See [score-skill-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:65).
- Holdout rows are excluded from the headline aggregate, while the generalization gap is advisory. A skill can pass fitted scenarios despite collapsing on blind scenarios. See [score-skill-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287).

The fix is a validity gate before the verdict:

1. Positive scenarios with empty route or outcome gold become `UNSCORABLE`, never neutral. `PASS` requires coverage-based blind gold: every claimed intent/capability and every “do not use” class has an independently authored holdout.
2. Replace the two-arm D4 estimate with a randomized, counterbalanced triad: skill-on, skill-off, and equal-token placebo. Run each executor × scenario × seed block under the same environment and budget. Report intention-to-treat lift first; activation and instruction-use remain mediator diagnostics.
3. Fit `score ~ skill + executor + skill:executor + order + tier`, with scenario/seed random effects or clustered uncertainty. Statsmodels supports random slopes, variance components, and correlated repeated-measure analysis through [MixedLM](https://www.statsmodels.org/stable/mixed_linear.html) and [GEE](https://www.statsmodels.org/stable/gee.html).
4. Add item-information screening. Ceiling/floor scenarios with almost no paired discordance cannot identify skill lift; retain them as longitudinal anchors but exclude them from causal attribution. Bayesian 2PL IRT provides difficulty and discrimination estimates through [py-irt](https://github.com/nd-ball/py-irt), while the newer [MetaEval](https://github.com/wangzhuo0092/MetaEval) demonstrates discrimination-driven benchmark reduction.
5. Extend literal contamination lint with provenance and semantic-community splits. Any prompt derived while viewing the target skill is fitted-only; paraphrase siblings must stay in one split. Maintain sealed rolling audit batches, borrowing the update-and-retire pattern from [ForecastBench](https://github.com/forecastingresearch/forecastbench).

The moat is causal bundle attribution. Model-benchmark can rank executors, but it cannot hold the executor fixed and answer whether this exact instruction/resource/tool bundle caused improvement, failed to activate, helped only certain executors, or merely benefited from extra context tokens. Sharpen that into a `SkillEffectCertificate` containing bundle/scenario/executor digests, intention-to-treat lift with interval, placebo lift, executor interaction, activation funnel, validity flags, and expiry triggers.

```json
{
  "new_repos": [
    {
      "name": "TiesPetersen/SkillBenchmark",
      "url": "https://github.com/TiesPetersen/SkillBenchmark",
      "stars": "~10",
      "what": "New May-2026 skill evaluator with 22 commits, paired skill-on/off runs, blind judging, token accounting, and confidence intervals.",
      "lesson": "Preserve its matched same-model/task/temperature comparison, but analyze paired task-seed clusters rather than treating judge repetitions as independent samples.",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "statsmodels/statsmodels",
      "url": "https://github.com/statsmodels/statsmodels",
      "stars": "~11.5k",
      "what": "Mature statistical-modeling library; release 0.14.6 shipped 2025-12-05 with MixedLM, GEE, and binomial mixed-model support.",
      "lesson": "Estimate skill lift as a treatment effect while modeling scenario dependence and executor-by-skill heterogeneity instead of averaging an executor matrix.",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "nd-ball/py-irt",
      "url": "https://github.com/nd-ball/py-irt",
      "stars": "~170",
      "what": "Bayesian 1PL/2PL/4PL item-response implementation with 255 commits; older research code with no tagged releases.",
      "lesson": "Fit scenario difficulty and discrimination so ceiling, floor, negative-discrimination, and low-information items are visible before they distort skill lift.",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "wangzhuo0092/MetaEval",
      "url": "https://github.com/wangzhuo0092/MetaEval",
      "stars": "~2",
      "what": "AAAI-2026 research snapshot with notebooks for fitting item discrimination, estimating ability, and selecting discriminative benchmark subsets.",
      "lesson": "Rank scenarios by treatment-relevant discrimination and spend repeat budget on informative items rather than uniform resampling.",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "forecastingresearch/forecastbench",
      "url": "https://github.com/forecastingresearch/forecastbench",
      "stars": "~74",
      "what": "ICLR-2025 dynamic benchmark with 585 commits and nightly dataset/leaderboard updates.",
      "lesson": "Use sealed rolling audit batches and retire/reveal old batches so skill authors cannot repeatedly optimize against permanent holdout gold.",
      "maps_to": [
        "skill-benchmark",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Empty positive gold is currently fail-open: null recall is converted to full D1/D2 credit, while D3 is omitted from normalization.",
      "evidence": "local score-skill-benchmark.cjs:65-68,172-229,1059-1073",
      "maps_to": [
        "skill-benchmark",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "The fitted-versus-holdout gap is observable but not verdict-bearing; attribution remains vulnerable to gold overfit until blind performance gates PASS.",
      "evidence": "local score-skill-benchmark.cjs:1287-1288,1342-1344,1422-1445",
      "maps_to": [
        "skill-benchmark",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Trustworthy skill attribution needs matched randomization plus an executor interaction: the skill main effect estimates average lift, while skill-by-executor terms reveal portability or masking.",
      "evidence": "https://www.statsmodels.org/stable/mixed_linear.html",
      "maps_to": [
        "skill-benchmark",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "For paired binary outcomes, only discordant skill-on/off pairs identify lift; universal success or failure is a coverage signal but nearly information-free for attribution.",
      "evidence": "https://github.com/nd-ball/py-irt",
      "maps_to": [
        "skill-benchmark",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Contamination control must operate on lineage and semantic communities, not only banned substrings: target-aware generation and paraphrase siblings belong to fitted data, never blind holdout.",
      "evidence": "https://github.com/forecastingresearch/forecastbench",
      "maps_to": [
        "skill-benchmark",
        "runtime/dedup-novelty",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a fail-closed corpus-validity preflight before scoring: positive empty-gold rows become UNSCORABLE; emit goldCoverage by intent/capability/negative class; require blind holdout coverage; and cap the verdict at INSUFFICIENT-EVIDENCE when required coverage or holdout evidence is absent.",
      "target": "skill-benchmark",
      "rationale": "Normalization cannot distinguish success from missing evidence, and the present advisory generalization gap does not prevent fitted-set overfitting.",
      "uniqueness": "Turns Lane C from a routing score into an evidence-qualified certificate for a specific skill contract.",
      "effort": "M",
      "impact": "high",
      "evidence": "local score-skill-benchmark.cjs; https://github.com/forecastingresearch/forecastbench"
    },
    {
      "rec": "[uniqueness-sharpening] Replace D4-R's simple on/off average with counterbalanced skill-on, skill-off, and equal-token placebo blocks across executor × scenario × seed; persist assigned arm, actual activation, environment digest, order, and outcome; estimate ITT lift plus executor interaction using clustered or mixed-effects inference.",
      "target": "skill-benchmark + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing",
      "rationale": "Pairing removes scenario noise, placebo controls context-length and generic instruction effects, and the interaction exposes executors that mask or reverse the skill effect.",
      "uniqueness": "Only skill-benchmark can hold the model constant and attribute incremental value to the packaged bundle while decomposing assignment, activation, guidance, and execution.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/TiesPetersen/SkillBenchmark; https://www.statsmodels.org/stable/gee.html"
    },
    {
      "rec": "Add a validity-audit module producing per-scenario p_on, p_off, paired discordance, discrimination/information, provenance, literal leaks, semantic cluster, and split lineage; quarantine ceiling/floor and contaminated items, keep anchors separately, and allocate repeat budget by information gain.",
      "target": "skill-benchmark + runtime/dedup-novelty + runtime/gauges-observability + runtime/budget-cost",
      "rationale": "Low-information items waste budget and conceal lift, while semantic siblings crossing fitted/holdout boundaries make generalization estimates circular.",
      "uniqueness": "Makes the benchmark diagnose where a skill works and where its effect is unidentifiable, rather than producing another undifferentiated model-style average.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/nd-ball/py-irt; https://github.com/wangzhuo0092/MetaEval"
    }
  ],
  "contradictions": [
    {
      "claim": "Empty expected intent/resource arrays are harmless and can remain non-penalizing.",
      "counter": "For positive scenarios they erase the behavioral estimand; the only valid result is unscorable or insufficient evidence, not full recall.",
      "evidence": "local scenario_authoring.md NOTE ON EMPTY GOLD versus score-skill-benchmark.cjs:65-68,172-229"
    },
    {
      "claim": "All run-by-judge scores can be treated as independent samples and compared with Welch intervals.",
      "counter": "Repeated judges score the same generated output and skill-on/off outputs share a task/run block; independence is false, so paired or cluster-aware inference is required.",
      "evidence": "https://github.com/TiesPetersen/SkillBenchmark; https://www.statsmodels.org/stable/gee.html"
    },
    {
      "claim": "A high fitted aggregate is sufficient for PASS while holdout remains outside the verdict.",
      "counter": "That establishes fit to authored scenarios, not transferable skill effect; blind holdout collapse must block attribution.",
      "evidence": "local score-skill-benchmark.cjs:1287-1288,1422-1445"
    }
  ],
  "next_angles": [
    "Design a power and sequential-stopping controller for the crossed paired experiment: smallest detectable skill lift, cluster-aware confidence sequences, and budget reallocation toward discordant scenarios.",
    "Test surrogate validity: measure whether plan-only D4-R lift predicts deterministic tool/file/test outcomes, then retire rubric proxies that do not transport to real execution."
  ],
  "notes": "No live benchmark was run; this iteration audited the current Lane C contract and external mechanisms. py-irt is useful but older and has no tagged releases; MetaEval is current but a small research snapshot. GitHub star counts were verified on 2026-07-15 and will drift."
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
177,247
