<!-- iteration 37 | SOL xhigh | mode: skill-benchmark | angle: A2-moat skill-benchmark :: unique value / moat | 2026-07-15T11:10:43.719Z -->

The moat is causal release certification for a versioned skill bundle—not another model leaderboard.

A model benchmark asks, “How capable is this executor?” Skill-benchmark should answer, “What marginal value did this exact bundle add; where did value disappear between discovery, loading, compliance, and outcome; and does that value transfer across executors?” Neither model-benchmark nor the other deep modes isolates that intervention.

Three current behaviors weaken that claim:

- Mode A can emit generic `PASS` while task usefulness remains unscored and advisory ([scoring contract](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:22>), [scorer](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1421>)).
- Empty intent/resource gold is treated as a perfect, non-penalizing match ([scenario authoring](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:58>)).
- Skill-off is prompt-level suppression rather than hermetic removal, so the implementation correctly labels attribution approximate ([d4-ablation.cjs](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:7>)).

External evidence supports treating these as separate estimands. The new Skill-Usage study found that benefits degrade as agents move from oracle-provided skills to retrieval from 34,000 candidates; its repository exposes retrieval, top-k selection, trajectory inspection, and three-model configurations. That means “good skill content” and “realized skill value” are observably different properties. [Paper](https://arxiv.org/abs/2604.04323), [repository](https://github.com/UCSB-NLP-Chang/Skill-Usage).

The strongest concrete mechanism is a four-arm paired experiment:

- `off`: skill absent from a hermetic registry.
- `auto`: installed and discovered normally.
- `forced`: exact bundle body/resources guaranteed loaded.
- `placebo`: equalized context/tool overhead but inert content.

This yields `realizedLift = auto − off`, `selectionTax = forced − auto`, and `contentEffect = forced − placebo`. Run identical task/environment blocks across executor descriptors `{runtime, runtimeVersion, model, modelVersion, loaderVersion, toolSurface}`. Require both a same-model/different-runtime contrast and a same-runtime/different-model contrast; otherwise mark attribution `executor-confounded`. Start with paired bootstrap intervals; use heterogeneous-treatment estimation only after enough task/executor cells exist.

Loading canaries sharpen the decomposition. `agent-ecosystem/agent-skill-implementation` supplies 17 probe skills with unique phrases across bodies, references, scripts, and assets, specifically to distinguish deterministic harness loading from probabilistic model behavior. Port that idea into `live-executor.cjs`: record canary receipts at discovery, activation, resource load, and post-compaction. [Benchmark fixtures](https://github.com/agent-ecosystem/agent-skill-implementation/blob/main/benchmark-skills/README.md).

Mode A and Mode B should consequently stop sharing one verdict vocabulary:

- Mode A: `ROUTER-CONTRACT-PASS|FAIL|BLOCKED`—static reachability, routing precision, and corpus integrity only.
- Mode B: `SKILL-LIFT-BENEFICIAL|NEUTRAL|HARMFUL|INCONCLUSIVE`, with effect interval, practical margin, executor interaction, and cost delta.
- `PORTABLE-SKILL` requires beneficial or non-inferior live results across effectively distinct executors. A router pass alone can never confer it.

Empty gold needs fail-closed semantics. Require `goldPolicy: scored|negative|structural-only|pending`. `pending` scenarios contribute no score and make the corpus `BLOCKED-BY-GOLD`; `structural-only` is explicitly N/A rather than 1.0. Add provenance `{skillCommit, source, reviewer, behaviorConstraintIds}` and a mutation-sensitivity test that swaps or deletes gold and confirms the score changes. This aligns with Skill Coverage’s finding that leaderboard trajectories exercised only 38.66–45.51% of extracted behavior constraints: task success is not evidence that the packaged instructions were adequately tested. [Skill Coverage paper](https://arxiv.org/abs/2606.20659).

```json
{
  "new_repos": [
    {
      "name": "UCSB-NLP-Chang/Skill-Usage",
      "url": "https://github.com/UCSB-NLP-Chang/Skill-Usage",
      "stars": "~45",
      "what": "April 2026 skill-utility study with retrieval from 34k skills, three models, trajectory inspection, and refinement pipelines.",
      "lesson": "Separate oracle content efficacy from retrieval, selection, and realized end-to-end skill lift.",
      "maps_to": ["skill-benchmark", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "agent-ecosystem/agent-skill-implementation",
      "url": "https://github.com/agent-ecosystem/agent-skill-implementation",
      "stars": "~0",
      "what": "Nascent 2026 compatibility project with 17 canary-bearing skills covering 23 loader checks across nine categories.",
      "lesson": "Use resource-specific canaries to distinguish harness exposure from model activation and instruction-following.",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability"],
      "confidence": "med"
    },
    {
      "name": "anthropics/skills",
      "url": "https://github.com/anthropics/skills",
      "stars": "~161k",
      "what": "Current official Agent Skills repository; its skill-creator snapshots old/no-skill baselines and grades repeated outputs.",
      "lesson": "Treat the skill directory as the versioned intervention and preserve immutable baseline snapshots per evaluation.",
      "maps_to": ["skill-benchmark", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "agentskills/agentskills",
      "url": "https://github.com/agentskills/agentskills",
      "stars": "~23.1k",
      "what": "Active open specification repository defining portable bundles and progressive discovery, activation, and resource loading.",
      "lesson": "Benchmark each progressive-disclosure stage independently; format conformance does not prove runtime-semantic portability.",
      "maps_to": ["skill-benchmark", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "py-why/EconML",
      "url": "https://github.com/py-why/EconML",
      "stars": "~4.7k",
      "what": "Heterogeneous-treatment-effect toolkit; latest verified release v0.16.0 was July 2025.",
      "lesson": "Estimate skill uplift conditional on executor and task features, with intervals, once the factorial run matrix is large enough.",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Skill value is a staged treatment: discovery, loading, instruction adherence, and verified outcome must be measured separately because oracle-injected gains collapse under realistic retrieval.",
      "evidence": "https://arxiv.org/abs/2604.04323",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "A balanced off/auto/forced/placebo design identifies realized lift, selection tax, and content effect while executor-by-skill interactions distinguish model dependence from loader dependence.",
      "evidence": "https://github.com/py-why/EconML",
      "maps_to": ["skill-benchmark", "runtime/fan-out-fan-in", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "insight": "Unique canaries embedded separately in SKILL.md, references, scripts, and assets produce objective exposure receipts and avoid relying on model self-report.",
      "evidence": "https://github.com/agent-ecosystem/agent-skill-implementation/blob/main/benchmark-skills/README.md",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Task success is insufficient test adequacy: only 38.66-45.51% of extracted skill behavior constraints were covered in evaluated trajectories, so skill-benchmark needs constraint coverage alongside outcome lift.",
      "evidence": "https://arxiv.org/abs/2606.20659",
      "maps_to": ["skill-benchmark", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "UNIQUENESS-SHARPENING: add a paired off/auto/forced/placebo attribution matrix to live mode. Extend executor-dispatch.cjs with treatmentArm and executorDescriptor; make live-executor.cjs emit activation/resource canary receipts; add attribution-estimator.cjs producing realizedLift, selectionTax, contentEffect, confidence intervals, cost delta, and executor interactions. Persist each cell with skill bundle hash, task/environment hash, seed, receipts, outcome, tokens, latency, and cost.",
      "target": "skill-benchmark + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing + runtime/gauges-observability",
      "rationale": "This holds the model/task fixed while varying the deployable bundle, then holds the bundle fixed while varying runtime and model. It turns approximate skill-on/off scoring into attributable evidence.",
      "uniqueness": "Model-benchmark cannot identify whether lost value came from skill discovery, loader semantics, guidance quality, or execution; this matrix can.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/UCSB-NLP-Chang/Skill-Usage"
    },
    {
      "rec": "Split the report and verdict contracts: Mode A emits only ROUTER-CONTRACT-* results; Mode B emits SKILL-LIFT-BENEFICIAL|NEUTRAL|HARMFUL|INCONCLUSIVE using a practical-effect margin and paired interval. Require same-model/different-runtime and same-runtime/different-model contrasts before granting a PORTABLE-SKILL certificate; otherwise label the result executor-confounded.",
      "target": "skill-benchmark + runtime/gauges-observability + runtime/budget-cost",
      "rationale": "The current generic PASS can normalize over missing live usefulness, conflating deterministic router correctness with causal skill utility.",
      "uniqueness": "This creates a release certificate for a portable skill artifact rather than another aggregate model score.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/agent-ecosystem/agent-skill-implementation"
    },
    {
      "rec": "Add a pre-dispatch gold-integrity gate. Require goldPolicy=scored|negative|structural-only|pending; block a positive scored scenario when both intent/resource gold are empty; exclude pending and structural-only rows from numerators; emit BLOCKED-BY-GOLD when required coverage is incomplete. Store gold provenance and run a mutation-sensitivity check that proves changing gold changes the score.",
      "target": "skill-benchmark + runtime/gauges-observability",
      "rationale": "Treating empty expected sets as 1.0 permits high router scores without testing routing or discovery, while mutation sensitivity detects inert or decorative gold.",
      "uniqueness": "A trustworthy skill benchmark validates the bundle's behavioral contract; a model benchmark has no equivalent package-resource oracle.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2606.20659"
    }
  ],
  "contradictions": [
    {
      "claim": "A standardized Agent Skills folder is portable, so one executor is sufficient for skill evaluation.",
      "counter": "The standard defines package shape and progressive disclosure, while real harnesses may strip metadata, preload or hide resources, prune instructions, or use different activation mechanisms.",
      "evidence": "https://github.com/agent-ecosystem/agent-skill-implementation"
    },
    {
      "claim": "A Mode A PASS establishes that the skill is effective.",
      "counter": "Current Mode A normalizes over router dimensions while task usefulness remains unscored; realistic retrieval experiments show that oracle-route utility can fall toward the no-skill baseline.",
      "evidence": "https://arxiv.org/abs/2604.04323"
    }
  ],
  "next_angles": [
    "Cross-skill interference attribution: use sparse factorial or Shapley approximations to identify which skill combinations cause instruction conflicts, context pruning, or positive composition.",
    "Skill-effect certificate expiry: learn which runtime, model, dependency, and bundle changes invalidate prior attribution without requiring a full matrix rerun."
  ],
  "notes": "Skill Coverage did not expose a verified code repository in the sources found, so it is cited as a paper only. agent-ecosystem/agent-skill-implementation is a concrete and useful canary protocol but remains an early 0-star project with limited populated platform results. The current OpenCode lane lacks hermetic single-skill suppression; the off arm therefore needs an isolated registry/container before attribution can be upgraded from approximate."
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
session id: 019f6574-e452-7761-b6d5-34ebf42e1b91
--------
user
You are iteration 37/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: skill-benchmark
MODE IDENTITY (what it does today): deep-improvement variant: benchmarking a SKILL (packaged instruction+resource bundle) across executors, gold-set scoring, empty-gold detection.
GENERIC ALTERNATIVE it must out-value: benchmarking the underlying model instead of the skill, or no skill eval at all

THIS ITERATION'S ANGLE (A2-moat): skill-benchmark :: unique value / moat
DIRECTIVE: What makes benchmarking a SKILL (packaged instruction+resource bundle) across multiple executors uniquely valuable versus benchmarking the underlying model? Find evidence on skill-vs-model attribution. Propose concrete ways to SHARPEN the moat: skill/model attribution, mode-A router vs mode-B live separation, executor-diversity, empty-gold detection.

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
THIS run's new repos so far (153) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform, IBM/prompt-declaration-language, EvoAgentX/EvoAgentX, aiwaves-cn/agents, YaoZ720/SwarmAgenticCode, taowangcheng/SePO, Junjie-Ye/CCTU, CAR-bench/car-bench, claw-eval/claw-eval, agentevals-dev/agentevals, harbor-framework/harbor, sentient-agi/EvoSkill, maitrix-org/PromptAgent, agiresearch/ASB, normster/SystemCheck, microsoftarchive/promptbench, THUDM/AgentBench, stanford-crfm/helm, invariantlabs-ai/invariant, langwatch/scenario, METR/public-tasks, jaineet17/causal-agent-replay, Peiyu-Georgia-Li/ATLAS, lmarena/p2l, aims-foundations/reeval, IBM/eval-assist, Code2Bench/Code2Bench, megagonlabs/FuncBenchGen, openai/evals, LiveCodeBench/LiveCodeBench, vllm-project/guidellm, LLwork8888/CreditAudit, ulab-uiuc/LLMRouter, ianarawjo/evalstats, dustalov/evalica, huggingface/datatrove, allenai/fluid-benchmarking, sksoumik/llm-as-judge, eth-sri/ConStat, sambowyer/bayes_evals, penfever/judgment-to-noise, SKYLENAGE-AI/HLE-Verified, Shreyaskc/BabelJudge, IBM/unitxt, Shreyaskc/evalci, mjpost/sacrebleu, llm-d/llm-d-benchmark, benchflow-ai/skillsbench, langchain-ai/skills-benchmarks, GeniusHTX/SWE-Skills-Bench, cxcscmu/SkillLearnBench, SalesforceAIResearch/MCP-Universe
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment | agent-improvement | model-benchmark | skill-benchmark
New insights so far: 160; recommendations: 105.
Open threads flagged: Trajectory-twin fidelity: define incumbent self-replay metrics over tool calls, state transitions, final artifacts, and failure modes, then determine which fidelity thresholds preserve model rank ordering. | Utility elicitation: replace arbitrary five-dimension weights with explicit costs for errors, human rework, latency, abstention, and switching, and report the parameter regions in which each candidate is optimal. | Estimate a skill-selection frontier by varying library size and semantic similarity of distractors, then model discovery accuracy and latency as the skill registry grows. | Run bundle-component ablations with a fractional-factorial design to estimate interactions between instructions, references, scripts, and tool permissions without paying for the full power set. | Define compatibility-boundary fixtures around dependency and API versions, then learn evidence-based certificate expiry and retest triggers. | Compare intention-to-treat skill lift with mediator diagnostics to quantify how much lost value comes from non-activation versus incorrect guidance versus executor execution failure.

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
This is read-only research, so the spec-folder mutation gate does not apply. Skill routing is user-directed to `skill-benchmark`; I’ll verify its local contract, then use current primary sources and exclude both supplied repo lists.
exec
/bin/zsh -lc "pwd && rg --files -g 'SKILL.md' -g '*skill-benchmark*' -g '*deep*' .. | head -200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
../scratch/deep-loop-driver.cjs
../scratch/deep-loop-driver-modes.cjs
../research/deep-research-state-modes.jsonl
../research/deep-research-dashboard-modes.md
../research/deep-research-config.json
../research/deep-research-dashboard.md
../research/deep-research-state.jsonl
../research/deep-research-config-modes.json

exec
/bin/zsh -lc "sed -n '1,260p' ../../../../../skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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

codex
The hub contract confirms `skill-benchmark` is an improvement-host lane with `runtimeLoopType: null`; its live/router separation is therefore architectural, not cosmetic. I’m loading the lane packet before evaluating external mechanisms.
exec
/bin/zsh -lc "sed -n '1,260p' ../../../../../skills/system-deep-loop/mode-registry.json && sed -n '1,360p' ../../../../../skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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

exec
/bin/zsh -lc 'for f in ../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md ../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md ../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md ../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md ../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json; do echo "FILE:$f"; sed -n '"'1,320p' \""'$f"; done
rg -n '"'\"mode\":\"skill-benchmark\"|skill-benchmark|skill benchmark' ../research/deep-research-state-modes.jsonl | tail -30" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
FILE:../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md
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
FILE:../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
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
FILE:../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md
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
FILE:../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md
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
FILE:../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json
{
  "profileId": "default",
  "mode": "skill-benchmark",
  "traceMode": "router",
  "weights": { "d1inter": 12, "d1intra": 13, "d2": 20, "d3": 15, "d4": 25, "d5": 15 },
  "verdictBands": {
    "PASS": ">=80 and no hard gate",
    "CONDITIONAL": "50-79 or a non-gating finding",
    "FAIL": "<50",
    "BLOCKED-BY-STRUCTURE": "D5 hard-gate failure (dead path / path escape / unparseable router)"
  },
  "notes": "Reference profile only — NOT yet consumed at runtime. The scorer hardcodes WEIGHTS in scripts/skill-benchmark/score-skill-benchmark.cjs and there is no --profile loader on the Lane C path yet; this weights block is the forward-looking source these will read once profile loading lands. Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically; D1-inter (advisor) is built but opt-in via --advisor-mode=python; D4 (usefulness ablation) requires live mode and is reported unscored until then. Weights/bands are provisional pending 2-3 pilot calibration per the 002 playbook."
}
36:{"iteration":36,"model":"sol","model_id":"gpt-5.6-sol","reasoning":"xhigh","mode":"skill-benchmark","iter_in_mode":1,"angle_key":"A1-sota","angle":"skill-benchmark :: 2025-2026 state of the art","new_repos":5,"recs":3,"total_new_repos":153,"insights_total":160,"recs_total":105,"parse_ok":true,"ok":true,"ts":"2026-07-15T11:06:20.955Z"}

codex
The current lane already has paired skill-on/off task ablation, but attribution is explicitly only “approximate,” executor diversity is anecdotal, and empty gold is non-penalizing. I’m targeting mechanisms that close those three evidentiary gaps without reusing the 443 repositories already catalogued.
web search: 
web search: site:github.com agent skills benchmark skill vs model attribution executor GitHub -skillsbench -"skills-benchmarks" ...
web search: 
web search: UCSB-NLP-Chang Skill-Usage GitHub README skill utility realistic 34k refinement executors ...
web search: 
web search: GitHub agentskills agentskills specification progressive disclosure compatibility SKILL.md repository ...
web search: 
web search: github agent-ecosystem agent-skill-implementation compatibility checks seven implementations ...
web search: 
web search: https://agentskillimplementation.com/
web search: 
web search: 'stars'
codex
The strongest external signal is not another aggregate leaderboard. It is the split between harness behavior and model behavior: portable `SKILL.md` format does not imply portable loading semantics, and canary fixtures can identify which layer exposed each resource. That enables attribution the current live lane cannot make.
exec
/bin/zsh -lc "rg -n \"empty|unscored|traceMode|trace-mode|executor|skill.off|skillOff|D4_task|advisorySignals|aggregateScore|verdict|expected\\.resources|expected\\.intent\" ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark ../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark | head -240" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:3:// ║ live-executor — Mode B live executor (cli-opencode)                      ║
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:8: * live-executor.cjs — Mode B live executor (cli-opencode).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:350: * Executor entrypoint called by executor-dispatch.cjs (live branch).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:396:  process.stderr.write('usage: live-executor.cjs --parse-file <ndjson> [--skill <id>] [--require-route]\n');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:3:// ║ browser-executor.cjs — Mode B executor for browser-gated scenarios       ║
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:8: * browser-executor.cjs — Mode B executor for browser-gated scenarios (MR-*, CB-*).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:64: * Map a browser verdict to per-dimension scores for aggregation.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:65: * @param {string} verdict - One of PASS, FAIL, PARTIAL-*, or a SKIP-* verdict.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:66: * @returns {Object} Dimension map with d1intra/d2/d3 scored and d1inter/d4 unscored.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:68:function verdictToDims(verdict) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:69:  const v = verdict === 'PASS' ? 1 : verdict === 'FAIL' ? 0 : verdict.startsWith('PARTIAL') ? 0.5 : null;
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:71:  return { d1intra: dim(), d2: dim(), d3: dim(), d1inter: { score: null, unscored: 'browser scenario' }, d4: { score: null, unscored: 'browser scenario' } };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:74:function row(scenario, verdict, browser) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:75:  const dims = verdictToDims(verdict);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:80:    modeAScore, firstFailingStage: verdict === 'PASS' ? null : 'browser',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:98:    if (start.status !== 0) return row(scenario, 'SKIP-NO-BROWSER', { verdict: 'SKIP-NO-BROWSER', reason: 'bdg failed to start', evidence, error: start.stderr.slice(0, 200) });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:108:      verdict: pass ? 'PASS' : 'FAIL', signalsObserved: { ...s, consoleErrors: errCount }, evidence,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:116: * Executor entrypoint (called by executor-dispatch.cjs browser branch).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:117: * Honest per-scenario verdicts; never a fabricated PASS.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:121: * @returns {Object} Scenario result row with verdict, dims, and browser evidence.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:129:  // The rest map to honest non-PASS verdicts pending the per-scenario harness:
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:136:    'MR-002': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'CDN @latest scan is CLI-checkable; export probe needs a per-URL harness' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:137:    'MR-003': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'reduced-motion media-query is checkable; motion-neutralization needs positional comparison' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:138:    'MR-004': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'video baseline diff is capture-only, not auto-judgeable' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:139:    'CB-001': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'Chrome leg automatable; Safari/Firefox out of bdg scope', escalation: 'cross-browser:safari,firefox' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:140:    'CB-002': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'LCP/CLS derivable via PerformanceObserver; INP needs a scripted interaction' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:141:    'CB-003': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'layout/recalc counters via Performance.getMetrics; compositor judgement assisted' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:142:  }[id] || { verdict: 'SKIP-NO-BROWSER', reason: 'no browser-harness recipe for this scenario yet' };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:143:  return row(scenario, partial.verdict, { ...partial, evidence: [] });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:150:module.exports = { executeBrowserScenario, verdictToDims, motionSandboxHtml };
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.private.json:15:      "verdict": "rejected",
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.private.json:15:      "verdict": "rejected",
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:210: * @returns {{verdict:'valid'|'rejected', findings:Array}} Lint verdict.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:218:    return { verdict: 'rejected', findings };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:235:  return { verdict: findings.length === 0 ? 'valid' : 'rejected', findings };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:311:      verdict: 'rejected',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:327:      verdict: 'rejected',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:350:    verdict: findings.length === 0 ? 'valid' : 'rejected',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:388:      process.exit(result.verdict === 'valid' ? 0 : 1);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs:398:    process.exit(result.verdict === 'valid' ? 0 : 1);
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.private.json:16:      "verdict": "valid",
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.private.json:15:      "verdict": "valid",
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:25:- `expected.intentKeys` and `expected.resources` are intentionally empty pending a router-extract pass; Mode A treats unknown gold as non-penalizing.
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:46:| `deep-improvement/agent_improve_001.private.json` | Scorer-only gold, withheld from the agent. Holds `scenarioId`, an `expected` routing block (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`), a `rubric` (`usefulnessChecks`, `harmChecks`), and a `notes` field recording why `intentKeys`/`resources` stay empty. |
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json:4:  "traceMode": "router",
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json:6:  "verdictBands": {
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json:12:  "notes": "Reference profile only — NOT yet consumed at runtime. The scorer hardcodes WEIGHTS in scripts/skill-benchmark/score-skill-benchmark.cjs and there is no --profile loader on the Lane C path yet; this weights block is the forward-looking source these will read once profile loading lands. Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically; D1-inter (advisor) is built but opt-in via --advisor-mode=python; D4 (usefulness ablation) requires live mode and is reported unscored until then. Weights/bands are provisional pending 2-3 pilot calibration per the 002 playbook."
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:110:    addFinding(findings, 'invalid-loaded-files', 'loadedFiles', 'loadedFiles must be a non-empty array');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:122:      addFinding(findings, 'invalid-loaded-file-path', `${prefix}.path`, `${prefix}.path must be a non-empty string`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:140:    addFinding(findings, 'invalid-workflow-modes', 'workflowModes', 'workflowModes must be a non-empty array');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:145:      addFinding(findings, 'invalid-workflow-mode', `workflowModes[${index}]`, `workflowModes[${index}] must be a non-empty string`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:158: * @returns {{verdict:'valid'|'rejected', findings:Array}} Lint verdict.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:166:    return { verdict: 'rejected', findings };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:197:    addFinding(findings, 'invalid-minted-by', 'mintedBy', 'mintedBy must be a non-empty string');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:200:    addFinding(findings, 'invalid-bound-surface', 'boundSurface', 'boundSurface must be a non-empty string');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:203:  return { verdict: findings.length === 0 ? 'valid' : 'rejected', findings };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs:223:    process.exit(result.verdict === 'valid' ? 0 : 1);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:29:  const score = d.score == null ? `_${d.status || 'unscored'}_` : `${d.score}/100`;
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:48:  lines.push(`> Rendered from report.json (do not hand-edit). Scoring: \`${r.scoringMethod}\` · trace mode: \`${r.traceMode}\`.`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:50:  lines.push(`**Verdict: ${r.verdict}**${r.aggregateScore != null ? ` · aggregate ${r.aggregateScore}/100` : ''}`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:51:  if (r.gate && r.gate.gateFailed) lines.push(`\n⚠ **${r.gate.reason}** — verdict capped regardless of weighted score.`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:58:    lines.push(`- Scored (text executors): **${c.scored}** · routed out to browser harness: **${c.routedOut}**`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:92:  if (r.unscoredDimensions && r.unscoredDimensions.length) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:94:    lines.push(`_Unscored in this run (need live mode): ${r.unscoredDimensions.join(', ')}._`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:107:  if (r.advisorySignals) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:108:    const a = r.advisorySignals;
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:109:    const fmt = (s) => (s && typeof s.score === 'number' ? `${s.score}/100` : `_${(s && s.status) || 'unscored'}_`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:112:    if (a.D4_task_outcome) lines.push(`- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: ${fmt(a.D4_task_outcome)}`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:37: * @param {string} skillMd - Raw SKILL.md contents (may be empty).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:122: *   advisory: true, unscored?: string }}
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:126:    return { score: null, expectedMode: null, observedMode: null, advisory: true, unscored: 'fixture carries no expected.mode' };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:129:    return { score: null, expectedMode, observedMode: null, advisory: true, unscored: 'no mode-routing probe (run with --advisor-mode=python)' };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:163: *   advisory: true, unscored?: string, error?: string, reason?: string }}
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:176:      unscored: 'fixture carries no rankBelowSkillIds',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:188:      unscored: 'advisor probe failed',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:23:    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:38:    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:52:    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:67:    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts:82:    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:22:- Three executors back the scenarios: `router-replay.cjs` (Mode A deterministic), `live-executor.cjs` (Mode B `cli-opencode`), and `browser-executor.cjs` (`bdg`). `executor-dispatch.cjs` is the seam that routes by `classKind` + trace mode and normalizes every executor into one observed-result shape.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:23:- `score-skill-benchmark.cjs` computes the D1-D5 dimensions per scenario and aggregates with point weights; Mode A normalizes over only the dimensions it can measure rather than faking the live-only ones. It also carries the advisory `D4_task_outcome` signal.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:24:- `d4-ablation.cjs` holds the D4 hallucination ablation AND the opt-in `--d4` D4-R task-outcome ablation (advisory `D4_task_outcome`, never collapsed into D4).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:46:│   3. per scenario: contamination-lint → executor-dispatch │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:51:│ executor-        │ ─routing/  │ router-replay.cjs   (Mode A)     │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:52:│ dispatch.cjs     │  advisor ─▶│ live-executor.cjs   (Mode B)     │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:53:│ classKind +      │            │ browser-executor.cjs (bdg)       │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:54:│ traceMode router │ ─browser ─▶└──────────────────────────────────┘
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:60:│ benchmark.cjs    │      │ D1-D5 + advisorySignals          │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:70:        augments report.{json,md} with advisory D4_task_outcome
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:82:+-- executor-dispatch.cjs         # Seam: routes by classKind+traceMode, normalizes observed result
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:84:+-- live-executor.cjs             # Mode B live executor (cli-opencode)
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:85:+-- browser-executor.cjs          # Mode B executor for browser-gated scenarios (bdg)
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:86:+-- score-skill-benchmark.cjs     # Per-scenario D1-D5 + aggregate + advisorySignals
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:103:| `d5-connectivity.cjs` | Static structural scan and D5 hard gate. Runs before any dispatch and caps the verdict regardless of weighted score: catches dead RESOURCE_MAP routes, dead intent keys, paths escaping the skill root, and orphan references (reported, not gated). An unparseable router is the strongest gate failure. Exports `scanConnectivity`, `listMarkdownRefs`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:105:| `executor-dispatch.cjs` | The seam between orchestrator and executors. Routes `classKind` routing/advisor + trace-mode router→`router-replay`, +live→`live-executor`, browser→`browser-executor`, and normalizes each into one observed-result the scorer consumes. Lazy-requires live/browser siblings. Exports `dispatchScenario`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:107:| `live-executor.cjs` | Mode B live executor via `opencode run`. Runs routing/advisor scenarios as routing-ANALYSIS prompts, reads back stated routing + tool_use corroboration, normalizes to the observed-result shape. Self-contained dispatch (no `--agent`, uses `--format json`). Exports `runLiveScenario`, `parseLiveResult`, `buildLiveDispatchPrompt`, `runDispatch`, and parsing helpers. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:108:| `browser-executor.cjs` | Mode B executor for browser-gated scenarios (MR-*, CB-*) via `bdg`. Honesty rule: only capturable signals get PASS/FAIL; the rest report PARTIAL-NEEDS-ARTIFACT or SKIP-NO-BROWSER, never a fabricated PASS. Runs serially. Exports `executeBrowserScenario`, `verdictToDims`, `motionSandboxHtml`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:109:| `score-skill-benchmark.cjs` | Computes Lane C dimensions per scenario and aggregates. Mode A scores D1-intra, D2, D3, D5; D1-inter and D4 are reported unscored in Mode A (not faked) and the aggregate normalizes over measured dims. For an advisor-invisible skill (no `graph-metadata.json` at its root), D1-inter is instead `excluded-by-design` under `excludedDimensions`, carrying the owning advisor identity in `delegatedMeasure.targetSkill`. Point weights: D1-inter 12, D1-intra 13, D2 20, D3 15, D4 25, D5 15 (gate). Exports `scoreScenario`, `aggregate`, `computeDivergence`, `WEIGHTS`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:111:| `d4-ablation.cjs` | D4 usefulness ablation. Holds the D4 hallucination delta (skill-ON vs skill-OFF, graded by the Lane B grader) AND the opt-in `--d4` D4-R task-outcome ablation that grades a real change with the task-outcome rubric and reports it as the advisory `D4_task_outcome` (never collapsed into D4). Skill-OFF is approximate; scores stamp `attribution: "approximate"`. Exports `runD4Ablation`, `gradeAblation`, `runD4RAblation`, `gradeTaskOutcome`, and prompt builders. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:124:| Imports | `run-skill-benchmark.cjs` requires the in-lane modules directly; `executor-dispatch.cjs` lazy-requires `live-executor.cjs` and `browser-executor.cjs` so router mode stays dependency-free and CI-safe. `d4-ablation.cjs` requires `live-executor.cjs` and the Lane B grader at `../model-benchmark/scorer/grader/harness.cjs`. `advisor-probe.cjs` shells out to the Python advisor CLI under `system-skill-advisor/`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:127:| Write policy | Diagnostic-by-default. The only writers are `build-report.cjs` (`report.md`, from JSON) and the orchestrator (`report.json`, plus `--d4` augmentation). `playbook-generator.cjs` writes only to a skill's `manual_testing_playbook/_generated_staging/`, opt-in via `createMissing`. Live dispatch requires `--trace-mode live`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:139:│ caps verdict on structural failure       │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:150:│ executor-dispatch.cjs per scenario       │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:157:│ D1-D5 + advisorySignals → aggregate      │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:163:│ (--d4 augments both with D4_task_outcome) │
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:173:| `node run-skill-benchmark.cjs --skill <root-or-id> --outputs-dir <path> [--trace-mode router\|live] [--scenarios <ids>] [--output <report.json>]` | CLI | Runs the Lane C benchmark and writes `report.json` + `report.md`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:174:| `... --d4 [--d4-scenarios <ids>] [--grader-mode real\|mock]` | CLI (opt-in) | Adds the D4-R task-outcome ablation; requires `--trace-mode live`. Augments the report with advisory `D4_task_outcome`. |
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:15: * scorer and are reported as unscored in Mode A rather than faked — the
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:183:    if ((expected.resources || []).length > 0) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:236:  const unexpectedRoutedCount = expected && expected.resources
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:237:    ? routerResult.resources.filter((r) => !expected.resources.includes(r)).length
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:249:  // No positive resource gold: over-routing is unmeasurable. Against an empty
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:255:  if (!expected || !expected.resources || expected.resources.length === 0) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:288: * Compute the advisory asset-recall lane; null scores are explicit unscored states.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:375:    errors.push('argumentGrammar.render must be a non-empty string');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:378:    errors.push('argumentGrammar.positional must be a non-empty array');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:395:        errors.push(`argumentGrammar.positional[${index}].kind must be a non-empty string`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:420:        errors.push(`argumentGrammar.flags[${index}].kind must be a non-empty string`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:423:        errors.push(`argumentGrammar.flags[${index}].valueName must be non-empty when takesValue is true`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:432:  if (!Array.isArray(choreography) || choreography.length === 0) return ['choreography must be a non-empty array'];
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:452:        errors.push(`choreography[${index}].${field} must be a non-empty string`);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:489:    missReasons.push(recipeMiss('metadata', 'commandRecipe.command must be a non-empty string'));
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:835:  return (signal && signal.status) || 'unscored';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:843:    `mode precision ${modePrecisionAvg === null ? 'unscored' : `${modePrecisionAvg}/100`}`,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1092: * @param {Object} arg - Scenario input (legacy {scenarioId,tier,routerResult,expected,advisorResult} or new {scenario,observed,traceMode}).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1097:  // Surface correctness is meaningful only when an executor observed a surface
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1122:  const intentRecall = setRecall(expected && expected.intentKeys, routerResult.intents);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1123:  const resourceRecall = setRecall(expected && expected.resources, observedForRecall);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1128:  // a new hard verdict gate.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1161:  // Python advisor reads the SQLite graph, no LLM), else left unscored.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1166:      : { score: null, unscored: 'advisor probe failed', error: advisorResult.error };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1168:    dims.d1inter = { score: null, unscored: 'no advisor probe (run with --advisor-mode=python)' };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1171:  dims.d4 = { score: null, unscored: 'requires skill-on/off ablation (live mode)' };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1176:  // orchestrator supplies a mode-routing probe, else unscored. The parity
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1211:    traceMode: arg.traceMode || (obs ? obs.mode : undefined),
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1249: * @param {string} [params.traceMode] - Trace mode ('router' or 'live').
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1275:function aggregate({ skillId, skillRoot, scenarioRows, connectivity, hubRegistry = {}, traceMode, lintFindings, divergence }) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1285:  // rows, so aggregateScore is byte-identical to the pre-split behavior.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1295:  // executors; routed-out rows enter neither the funnel nor the score average.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1340:  const aggregateScore = avgOf(fittedRows, (r) => r.modeAScore);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1342:  const generalizationGap = (aggregateScore != null && holdoutScore != null)
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1343:    ? aggregateScore - holdoutScore
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1350:  // from runnable-but-unscored (advisor-visible, no probe ran). D1-inter is the
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1351:  // only dimension that flips: weighted D4 stays unscored harness-wide because no
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1371:      ? { points: WEIGHTS.d1inter, score: null, status: 'unscored-mode-a' }
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1374:  const unscoredDimensions = [];
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1375:  if (advisorTopology.visible && d1interAvg === null) unscoredDimensions.push('D1inter');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1376:  unscoredDimensions.push('D4');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1378:  // the v1 dimension weights/verdict are unchanged). D4_task_outcome is attached
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1386:  // matched the fixture's expected.mode. Never folded into aggregateScore.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1392:    ? { score: null, status: 'unscored (no advisor probe or no rank-below gold)', note: 'advisor target rank relative to sibling transports; advisory, not weighted' }
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1422:  let verdict;
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1423:  if (gateFailed) verdict = 'BLOCKED-BY-STRUCTURE';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1424:  else if (hubRegistry && hubRegistry.gateFailed) verdict = 'BLOCKED-BY-REGISTRY';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1425:  else if (hubRouteGate.failed) verdict = 'BLOCKED-BY-ROUTING';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1426:  else if (toolSurfaceGate.failed) verdict = 'BLOCKED-BY-TOOL-SURFACE';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1427:  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1428:  else if (aggregateScore >= 80 && !hasActiveP1) verdict = 'PASS';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1429:  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1430:  else verdict = 'FAIL';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1437:    fittedScore: aggregateScore,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1452:    scoringMethod: (traceMode || 'router') === 'live' ? 'mode-b-live' : 'mode-a-router-replay',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1453:    traceMode: traceMode || 'router',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1455:    verdict,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1456:    aggregateScore,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1470:      D4: { points: WEIGHTS.d4, score: null, status: 'unscored-mode-a' },
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1473:    unscoredDimensions,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1475:    advisorySignals: {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1476:      D4_task_outcome: d4TaskAvg === null
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1477:        ? { score: null, status: 'unscored (run --d4 in live mode)', note: 'task-outcome usefulness delta; separate from D4 hallucination, never summed into it' }
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1483:        ? { score: null, status: 'unscored (no mode-routing probe or no expected.mode)', note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' }
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1499:      traceMode: traceMode || 'router',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:3:// ║ executor-dispatch — orchestrator-to-executor seam, normalized results    ║
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:8: * executor-dispatch.cjs — the seam between the orchestrator and the three
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:9: * scenario executors. It normalizes every executor's output into ONE observed
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:10: * result the scorer consumes, so the orchestrator never branches on executor
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:13: *   classKind routing/advisor + trace-mode router → routeSkillResources (deterministic)
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:14: *   classKind routing/advisor + trace-mode live   → live-executor.cjs (cli-opencode)
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:15: *   classKind browser                             → browser-executor.cjs (bdg)
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:17: * The live/browser executors are lazy-required so router mode stays
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:33: * Normalized observed-result the scorer consumes regardless of executor:
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:35: *   mode, executor, classKind,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:50: * @param {string} args.traceMode - Trace mode ('live' or router/CI default).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:51: * @param {string} [args.executor] - Optional executor override for live mode.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:54:function dispatchScenario({ scenario, skillRoot, traceMode, executor } = {}) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:61:    if (traceMode !== 'live') {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:63:        mode: 'browser', classKind, executor: 'browser-executor',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:69:    return runOptionalExecutor('./browser-executor.cjs', 'executeBrowserScenario',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:73:  if (traceMode === 'live') {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:74:    return runOptionalExecutor('./live-executor.cjs', 'runLiveScenario',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:75:      { scenario, skillRoot, executor }, { mode: 'live', classKind });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:82:    executor: 'router-replay',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:95:// Lazy-load a sibling executor; if it is not built yet, degrade to a recorded
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:96:// "executor-unavailable" observation rather than crashing the run.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:105:      : 'live executor not yet built (Phase 2)';
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:107:      ...base, executor: moduleRel.replace(/^\.\/|\.cjs$/g, ''),
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.private.json:16:      "verdict": "rejected",
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.public.json:5:    "prompt": "shape a product dashboard grid for high-volume data tables, chart type choices, filters, and empty states without adding decorative whitespace",
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:46: * Select the executor class for a scenario: routing/advisor run via router-replay
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:48: * out of the text executors.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:54: * @returns {'browser'|'advisor'|'routing'} The executor class.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10: * Runs BEFORE any dispatch and caps the verdict regardless of weighted score.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:40:// are intentionally not routed). Returns an empty Set when absent or malformed,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:86:function emptyHubRegistryResult() {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:91:    verdict: null,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:141: *   verdict:string|null, findings:Array, missingModes:Array, deadPackets:Array,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:147:  if (!fs.existsSync(modeRegistryPath)) return emptyHubRegistryResult();
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:172:      verdict: 'BLOCKED-BY-REGISTRY',
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:288:    verdict: gateFailed ? 'BLOCKED-BY-REGISTRY' : null,
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:300: * Statically scan a skill's router connectivity and produce the D5 gate verdict.
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:314:    // condition; gateFailed is the authoritative verdict signal either way.
../../../../../skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json:14:  "notes": "expected.intentKeys/resources intentionally left empty until the deep-improvement SKILL.md router map is confirmed; Mode A scores structure/efficiency and treats unknown gold as non-penalizing. Populate after a router-extract pass."
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:63:    expect(lint.verdict).toBe(privateFixture.expected.boundaryProof.verdict);
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:72:    expect(lint.verdict).toBe('rejected');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:82:    expect(lint.verdict).toBe('rejected');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:93:    expect(lint.verdict).toBe('rejected');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:103:    expect(lint.verdict).toBe('rejected');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:116:    expect(result.verdict).toBe('valid');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:132:    expect(identical.verdict).toBe('valid');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:137:    expect(drifted.verdict).toBe('rejected');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts:141:    expect(missing.verdict).toBe('rejected');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:26:const { runDispatch, parseLiveResult, buildLiveDispatchPrompt } = require('./live-executor.cjs');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:53: * 1 = skill-on fully better, 0 = skill-off better (skill hurt).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:84: * @returns {Promise<Object>} D4 result object (graded or unscored).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:93:    return { d4: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate' } };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:102:    return { d4: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate' }, contaminated: true };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:196: * @returns {Promise<Object>} D4-R result object (graded or unscored).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:205:    return { d4r: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate', instrument: 'task-outcome' } };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:214:    return { d4r: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate', instrument: 'task-outcome' }, contaminated: true };
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:36:const { dispatchScenario } = require('./executor-dispatch.cjs');
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:134:// the executor for its classKind; browser scenarios are routed out of the text
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:135:// executors. Contamination-lint is a drift FINDING in router mode (the playbook
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:137:function runPlaybook({ skillRoot, skillId, traceMode, advisorMode, executor, playbookDir, scenariosFilter, scenarioRows, lintFindings, warningsOut }) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:141:    const observed = dispatchScenario({ scenario: sc, skillRoot, traceMode, executor });
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:150:        // Live mode: browser-executor returned a full scenario row (with a verdict).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:155:    if (traceMode === 'router' && sc.prompt) {
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:162:    scenarioRows.push(scoreScenario({ scenario: sc, skillId, observed, advisorResult, traceMode }));
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:176: *   3 when the D5 structural/registry gate blocked the verdict).
../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:186:  const traceMode = args['trace-mode'] || 'router';

exec
/bin/zsh -lc "sed -n '1,280p' ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs
sed -n '1080,1515p' ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs
sed -n '1,180p' ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs
sed -n '170,310p' ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
  // orchestrator supplies a mode-routing probe, else unscored. The parity
  // fixtures remain the authoritative mode-precision check.
  dims.modePrecision = scoreModePrecision({
    modeRouting: arg.modeRouting,
    expectedMode: expected && expected.mode,
  });
  dims.relativeRanking = scoreRelativeAdvisorRanking({
    advisorResult,
    expectedSkillId: expected && expected.skillId,
    rankBelowSkillIds: expected && expected.rankBelowSkillIds,
  });

  // Hard route-gold lane: fail closed only when route gold is present.
  dims.hubRoute = scoreHubRoute({ expected, routerResult });
  dims.toolSurface = scoreToolSurface({
    toolSurface: resolveToolSurface({ expected, skillRoot: arg.skillRoot }),
    toolCalls: obs && obs.raw && obs.raw.toolCalls,
  });

  // First failing stage (funnel): advisor activate -> router parse -> surface -> route gold -> tool surface -> recipe -> intra -> discovery.
  const failingStage = firstFailingStage({ dims, routerResult, surfaceMatch });

  // Mode A scenario score: weight the measured dims, normalize over their weights.
  // D1-inter joins the measured set only when an advisor probe produced a score.
  const score = modeAScore(dims);

  // Trimmed live evidence so a live report is inspectable (what the model
  // actually did) without bloating the JSON with full transcripts.
  const liveEvidence = buildLiveEvidence(obs);

  return {
    scenarioId, tier, stage, dims, firstFailingStage: failingStage, modeAScore: score, applicable: true, recipeCapped,
    classKind: scenario ? scenario.classKind : undefined,
    expectedWorkflowMode: expected && expected.workflowMode,
    expectedSurface, observedSurface, surfaceMatch,
    traceMode: arg.traceMode || (obs ? obs.mode : undefined),
    liveEvidence,
    routeTelemetry: routerResult.routeTelemetry || null,
  };
}

/**
 * A↔B divergence: the 122-research finding class — the router can reach a
 * resource but the live model doesn't (the skill doesn't signpost it inline),
 * or vice versa. Compared per scenario from a router observation and a live
 * observation of the SAME scenario.
 * @param {Object} params - Comparison input.
 * @param {string} params.scenarioId - Scenario identifier.
 * @param {Object} params.routerObserved - Router-mode observation for the scenario.
 * @param {Object} params.liveObserved - Live-mode observation for the same scenario.
 * @returns {{ scenarioId, resourceDelta:{onlyRouter:string[],onlyLive:string[]}, surfaceAgree:boolean|null, severity:string }}
 */
function computeDivergence({ scenarioId, routerObserved, liveObserved }) {
  const rRefs = new Set((routerObserved && routerObserved.observedResources) || []);
  const lRefs = new Set((liveObserved && liveObserved.observedResources) || []);
  const onlyRouter = [...rRefs].filter((r) => !lRefs.has(r));
  const onlyLive = [...lRefs].filter((r) => !rRefs.has(r));
  const rSurface = routerObserved && routerObserved.observedSurface;
  const lSurface = liveObserved && liveObserved.observedSurface;
  const surfaceAgree = (rSurface && lSurface) ? (rSurface === lSurface) : null;
  const delta = onlyRouter.length + onlyLive.length;
  const severity = delta === 0 && surfaceAgree !== false ? 'none' : (delta > 4 || surfaceAgree === false ? 'high' : 'low');
  return { scenarioId, resourceDelta: { onlyRouter, onlyLive }, surfaceAgree, severity };
}

/**
 * Aggregate scenario rows + the D5 connectivity result into a report object.
 * @param {Object} params - Aggregation input.
 * @param {string} params.skillId - Target skill identifier.
 * @param {string} params.skillRoot - Target skill root path.
 * @param {Array} params.scenarioRows - Per-scenario score rows.
 * @param {Object} params.connectivity - D5 structural connectivity result.
 * @param {Object} [params.hubRegistry] - Optional hub-registry gate result.
 * @param {string} [params.traceMode] - Trace mode ('router' or 'live').
 * @param {Array} [params.lintFindings] - Lint findings to attach.
 * @param {Array} [params.divergence] - A↔B divergence rows to attach.
 * @returns {Object} Skill-benchmark report object.
 */
// Advisor visibility mirrors the advisor's own projection rule: a directory is a
// routing candidate only when it carries graph-metadata.json. A bundled packet
// (e.g. a read-only surface) has none, so the advisor ranks its owning parent
// identity, never the packet itself — D1-inter is therefore not measurable
// against it and is reported excluded-by-design rather than as a missing score.
function resolveAdvisorOwner(skillRoot) {
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
    scenarioRows: rows,
    runQuality: {
      scenarioCount: rows.length,
      traceMode: traceMode || 'router',
      hubRouteKnownGaps,
      relativeRanking: relativeRankingSignal,
      routeTelemetry,
      recipeMissRate: recipeMiss.recipeMissRate,
      recipeMissBreakdown: recipeMiss.breakdown,
      recipeGoldRows: recipeMiss.recipeGoldRows,
      note: runQualityNote,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ executor-dispatch — orchestrator-to-executor seam, normalized results    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * executor-dispatch.cjs — the seam between the orchestrator and the three
 * scenario executors. It normalizes every executor's output into ONE observed
 * result the scorer consumes, so the orchestrator never branches on executor
 * internals.
 *
 *   classKind routing/advisor + trace-mode router → routeSkillResources (deterministic)
 *   classKind routing/advisor + trace-mode live   → live-executor.cjs (cli-opencode)
 *   classKind browser                             → browser-executor.cjs (bdg)
 *
 * The live/browser executors are lazy-required so router mode stays
 * dependency-free and CI-safe even before those siblings ship.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const { routeSkillResources } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalized observed-result the scorer consumes regardless of executor:
 * {
 *   mode, executor, classKind,
 *   parseable: bool,
 *   observedIntents: string[],
 *   observedResources: string[],   // router: routed refs; live: stated/observed refs
 *   observedSurface: string|null,
 *   statedRoutingCorrect: bool|null,
 *   activation: { activated: bool, topSkill: string|null } | null,
 *   missingResources: string[],
 *   routedOut?: bool, reason?: string, error?: string,
 *   raw: object
 * }
 *
 * @param {Object} [args] - Dispatch inputs.
 * @param {Object} args.scenario - Scenario to execute.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} args.traceMode - Trace mode ('live' or router/CI default).
 * @param {string} [args.executor] - Optional executor override for live mode.
 * @returns {Object} Normalized observed-result for the scorer.
 */
function dispatchScenario({ scenario, skillRoot, traceMode, executor } = {}) {
  const classKind = scenario.classKind || 'routing';

  if (classKind === 'browser') {
    // Browser scenarios need a real browser (bdg). Run them only in live mode;
    // in router (CI) mode keep them routed-out so the gate stays deterministic
    // and offline.
    if (traceMode !== 'live') {
      return {
        mode: 'browser', classKind, executor: 'browser-executor',
        parseable: false, observedIntents: [], observedResources: [], observedSurface: null,
        statedRoutingCorrect: null, activation: null, missingResources: [],
        routedOut: true, reason: 'browser scenario — run in live mode (needs bdg)', raw: null,
      };
    }
    return runOptionalExecutor('./browser-executor.cjs', 'executeBrowserScenario',
      { scenario, skillRoot }, { mode: 'browser', classKind });
  }

  if (traceMode === 'live') {
    return runOptionalExecutor('./live-executor.cjs', 'runLiveScenario',
      { scenario, skillRoot, executor }, { mode: 'live', classKind });
  }

  // Default: deterministic router-replay (the CI gate path).
  const router = routeSkillResources({ skillRoot, taskText: scenario.prompt || '' });
  return {
    mode: 'router',
    executor: 'router-replay',
    classKind,
    parseable: router.parseable,
    observedIntents: router.intents || [],
    observedResources: router.resources || [],
    observedSurface: null,
    statedRoutingCorrect: null,
    activation: null,
    missingResources: router.missingResources || [],
    raw: router,
  };
}

// Lazy-load a sibling executor; if it is not built yet, degrade to a recorded
// "executor-unavailable" observation rather than crashing the run.
function runOptionalExecutor(moduleRel, fnName, callArgs, base) {
  let mod;
  try {
    // eslint-disable-next-line global-require
    mod = require(path.join(__dirname, moduleRel));
  } catch (err) {
    const reason = base.mode === 'browser'
      ? 'browser harness not yet built (Phase 3)'
      : 'live executor not yet built (Phase 2)';
    return {
      ...base, executor: moduleRel.replace(/^\.\/|\.cjs$/g, ''),
      parseable: false, observedIntents: [], observedResources: [], observedSurface: null,
      statedRoutingCorrect: null, activation: null, missingResources: [],
      routedOut: base.mode === 'browser', reason, error: err.message,
      raw: null,
    };
  }
  const result = mod[fnName](callArgs);
  // Trust the sibling to return the normalized shape; backfill base fields.
  return { ...base, ...result };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { dispatchScenario };
/**
 * Run the Lane C benchmark: resolve skill, D5 connectivity gate, score scenarios
 * (legacy fixtures or playbook), aggregate, and write report.{json,md}.
 *
 * @param {Object} args - Parsed CLI args.
 * @returns {number} Process exit code (0 success, 2 on missing SKILL.md,
 *   3 when the D5 structural/registry gate blocked the verdict).
 */
function run(args) {
  const skillRoot = resolveSkillRoot(args.skill);
  const skillId = resolveSkillId(skillRoot);
  const outputsDir = path.resolve(args['outputs-dir']);
  fs.mkdirSync(outputsDir, { recursive: true });
  const advisorMode = args['advisor-mode'] || 'off';
  // The internal fallback stays 'router' so direct run() calls (the test suite)
  // are deterministic; the live default is injected by loop-host for operators.
  const traceMode = args['trace-mode'] || 'router';

  if (!fs.existsSync(path.join(skillRoot, 'SKILL.md'))) {
    process.stderr.write(`run-skill-benchmark: no SKILL.md at ${skillRoot}\n`);
    return 2;
  }

  // D5 hard gate first.
  const connectivity = scanConnectivity({ skillRoot });
  const hubRegistry = scanHubRegistry({ skillRoot });

  const scenarioRows = [];
  const lintFindings = [];
  const warnings = [];
  if (args['fixtures-dir']) {
    runLegacyFixtures({ fixturesDir: path.resolve(args['fixtures-dir']), skillRoot, skillId, advisorMode, scenarioRows });
  } else {
    runPlaybook({
      skillRoot, skillId, traceMode, advisorMode, executor: args.executor,
      playbookDir: args['playbook-dir'],
      scenariosFilter: args.scenarios, scenarioRows, lintFindings, warningsOut: warnings,
    });
  }

  // aggregate + emit.
  const report = aggregate({ skillId, skillRoot, scenarioRows, connectivity, hubRegistry, traceMode, lintFindings });
  if (warnings.length) report.parseWarnings = warnings;
  const reportJsonPath = args.output ? path.resolve(args.output) : path.join(outputsDir, 'skill-benchmark-report.json');
  const reportMdPath = reportJsonPath.replace(/\.json$/, '.md');
  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(reportMdPath, renderReport(report));

  process.stdout.write(`skill-benchmark: ${skillId} verdict=${report.verdict} aggregate=${report.aggregateScore} scenarios=${scenarioRows.length}\n`);
  process.stdout.write(`  report.json -> ${reportJsonPath}\n  report.md   -> ${reportMdPath}\n`);
  // The D5 gate exists to make a structurally-broken skill (dead router, broken
  // hub registry) unusable regardless of weighted score. An exit code that stays
  // 0 on that verdict lets a CI caller treat "blocked" the same as "passed" —
  // reports still write either way, but the process signal must disagree.
  if (report.verdict === 'BLOCKED-BY-STRUCTURE' || report.verdict === 'BLOCKED-BY-REGISTRY') return 3;
  return 0;
}

// Opt-in D4-R pass (live + paid). Kept OUT of the synchronous run() so the
// deterministic test suite (which calls run() and reads the report immediately)
// stays sync. Re-reads the report run() wrote, runs the task-outcome ablation on
// the explicitly selected scenarios, attaches each row's d4TaskOutcome, recomputes
// the advisory D4_task_outcome aggregate, and re-writes report.{json,md}. D4-R runs
// only on target-owned scenarios named via --d4-scenarios (or --scenarios); there
// are no cross-target defaults, which would silently borrow another skill's ids.

/**
 * Opt-in D4-R pass: re-read the written report, run the task-outcome ablation on
 * the chosen scenarios, attach each row's d4TaskOutcome, recompute the advisory
 * D4_task_outcome aggregate, and re-write report.{json,md}.
 *
 * @param {Object} args - Parsed CLI args.
 * @returns {Promise<number>} Process exit code (0 on success).
 */
async function augmentWithD4R(args) {
  const { runD4RAblation } = require('./d4-ablation.cjs');
  const skillRoot = resolveSkillRoot(args.skill);
  const outputsDir = path.resolve(args['outputs-dir']);
  const reportJsonPath = args.output ? path.resolve(args.output) : path.join(outputsDir, 'skill-benchmark-report.json');
  const report = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));
  const { scenarios } = loadPlaybookScenarios({ skillRoot, playbookDir: args['playbook-dir'] });
  const explicit = args['d4-scenarios'] || args.scenarios;
  const wanted = explicit
    ? String(explicit).split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
    : [];
  if (!wanted.length) {
    report.advisorySignals = report.advisorySignals || {};
    report.advisorySignals.D4_task_outcome = {
      score: null,
      status: 'not-run-no-target-scenarios',
      note: 'D4-R needs explicit target-owned --d4-scenarios (or --scenarios); no cross-target defaults',
    };
    fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
    fs.writeFileSync(reportJsonPath.replace(/\.json$/, '.md'), renderReport(report));
    process.stdout.write('  D4-R: not run — pass explicit --d4-scenarios (target-owned ids)\n');
    return 0;
  }
  const byId = new Map((report.scenarioRows || []).map((r) => [(r.scenarioId || '').toUpperCase(), r]));
  const graderMode = args['grader-mode'] || 'real';
  const model = process.env.SKILL_BENCH_OPENCODE_MODEL;
  const variant = process.env.SKILL_BENCH_OPENCODE_VARIANT;
  let scored = 0;
  for (const sc of scenarios) {
    if (!wanted.includes((sc.scenarioId || '').toUpperCase())) continue;
    process.stdout.write(`  D4-R ablation: ${sc.scenarioId} ...\n`);
    const res = await runD4RAblation({ scenario: sc, skillRoot, model, variant, graderMode });
    const row = byId.get((sc.scenarioId || '').toUpperCase());
    if (row) { row.d4TaskOutcome = res.d4r; if (typeof res.d4r.score === 'number') scored += 1; }
  }
  const vals = (report.scenarioRows || [])
    .map((r) => (r.d4TaskOutcome && typeof r.d4TaskOutcome.score === 'number' ? Math.round(r.d4TaskOutcome.score * 100) : null))
    .filter((v) => typeof v === 'number');
  const d4TaskAvg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  report.advisorySignals = report.advisorySignals || {};
  report.advisorySignals.D4_task_outcome = d4TaskAvg === null
    ? { score: null, status: 'no D4-R rows scored', note: 'task-outcome usefulness delta; separate from D4 hallucination' }
    : { score: d4TaskAvg, scoredCount: scored, attribution: 'approximate', note: 'task-outcome usefulness delta (skill-on vs off), separate from D4 hallucination' };
  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(reportJsonPath.replace(/\.json$/, '.md'), renderReport(report));
  process.stdout.write(`  D4-R: ${scored} scenario(s) scored; advisory D4_task_outcome=${d4TaskAvg == null ? 'null' : d4TaskAvg}\n`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { run, augmentWithD4R, resolveSkillRoot, loadFixtures };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill || !args['outputs-dir']) {
    process.stderr.write('usage: run-skill-benchmark.cjs --skill <root-or-id> --outputs-dir <path> [--fixtures-dir <path>] [--playbook-dir <path>] [--scenarios <ids>] [--output <report.json>] [--trace-mode router|live] [--d4 [--d4-scenarios <ids>] [--grader-mode real|mock]]\n');
    process.exit(2);
  }
  const code = run(args);
  if (code === 0 && args.d4 && (args['trace-mode'] === 'live')) {
    augmentWithD4R(args).then((c) => process.exit(c)).catch((err) => {
      process.stderr.write(`D4-R pass failed: ${err && err.message}\n`);
      process.exit(1);
    });

web search: 
web search: 
web search: 
web search: 
exec
/bin/zsh -lc "nl -ba ../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md | sed -n '45,72p'
nl -ba ../../../../../skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md | sed -n '20,72p'
nl -ba ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs | sed -n '1,120p'
nl -ba ../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs | sed -n '1418,1488p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
    45	
    46	## 3. THREE TIERS (ANTI-CIRCULARITY)
    47	
    48	- **T1 — auto-derived + paraphrased.** Gold keys mechanically derived from the skill's own `RESOURCE_MAP[intent]`; prompt paraphrased from the task domain and decontaminated. Breadth/coverage; circular unless decontaminated.
    49	- **T2 — hand-authored holdout.** Prompt written from the task domain by an author blind to `INTENT_SIGNALS`/`RESOURCE_MAP`; gold joined privately. The honesty anchor.
    50	- **T3 — adversarial.** Sibling-skill paraphrases, decoys whose gold belongs to another skill, and "should NOT activate" negatives (`negativeActivation: true`).
    51	
    52	Publish the **T1↔T2 score gap** as the circularity meter (mirrors the advisor corpus↔holdout split). A large gap is a finding against the corpus, not evidence the skill is good.
    53	
    54	## 4. COVERAGE
    55	
    56	Aim for ≥1 admitted fixture per `INTENT_SIGNALS` key, per `RESOURCE_MAP` target, and per "When NOT to Use" class. Uncovered keys are themselves dead-key findings.
    57	
    58	## 5. NOTE ON EMPTY GOLD
    59	
    60	`expected.intentKeys`/`expected.resources` may be left `[]` while a skill's router map is still being confirmed; Mode A treats empty gold as non-penalizing (scores structure/efficiency only). Populate from a router-extract pass to get real D1-intra/D2 signal.
    20	## 1. OVERVIEW
    21	
    22	Lane C scores a skill across five dimensions (D1-D5) and rolls them into a single verdict. D5 (structural connectivity) is a static hard gate that runs first. Mode A (router-replay) scores everything that needs no live model deterministically; D1-inter is built but opt-in via the in-repo advisor. The weighted **D4** dimension (a hallucination-grader proxy) stays unscored in the aggregate **by design** — it does not measure task usefulness. Real routine-task usefulness is measured separately by the opt-in **D4-R task-outcome ablation**, reported as an advisory signal (never folded into the weighted score); the live trace (Mode B) is built. The aggregate normalizes over the dimensions actually measured so the headline number stays honest about coverage.
    23	
    24	## 2. POINT WEIGHTS (FULL / LIVE MODE)
    25	
    26	`D1 = 25` (inter 12 + intra 13) · `D2 = 20` · `D3 = 15` · `D4 = 25` · `D5 = 15` (hard gate).
    27	
    28	## 3. MODE A (ROUTER-REPLAY, DETERMINISTIC)
    29	
    30	Scores only what needs no live model; the aggregate normalizes over the measured weights (D1-intra + D2 + D3, plus D1-inter when the advisor probe is enabled) so the number is honest about coverage. D5 is computed statically and gates.
    31	
    32	- **D1-intra** = `0.4 * intentRecall + 0.6 * resourceRecall` vs private `expected.intentKeys` / `expected.resources`. Empty expected = not-applicable (treated as 1.0, non-penalizing). Negative-activation scenarios invert: routing the expected resources is a failure.
    33	- **D2** (Mode A proxy) = recall of expected resources in the routed set. Live mode replaces this with Hit@1 / Hit@3 / Recall@5 / MRR over the observed file-load trace.
    34	- **D3** (Mode A proxy) = `1 - wastedRouted / totalRouted` (over-routing penalty). Live mode replaces with calls/tokens-to-first-expected.
    35	- **D5** = `100 - Σ penalties` (P0 40, P1 12, P2 3), floored at 0. Any P0 sets `gateFailed`.
    36	
    37	## 4. D1-INTER — OPT-IN ADVISOR PROBE (BUILT, DETERMINISTIC)
    38	
    39	D1-inter (does the skill *advisor* select this skill for the scenario?) is built and deterministic, but **opt-in** so the pure-router default stays fast and dependency-free:
    40	
    41	- Enable with `--advisor-mode=python`. Off by default and in CI.
    42	- Scored out-of-band via the deterministic SQLite advisor (`scoreAdvisorPrompt` / `skill_advisor.py`) with the advisor hook disabled so the answer cannot leak into the dispatched prompt.
    43	- When disabled it reports `status: unscored-mode-a` (never faked); when enabled it contributes its 12 points to the measured aggregate.
    44	- For an **advisor-invisible** skill — one whose directory carries no `graph-metadata.json`, so the advisor ranks its owning parent identity rather than the packet — D1-inter is **excluded-by-design**: reported `applicable: false, status: "excluded-by-design"` with the owning identity in `delegatedMeasure.targetSkill`, and listed under `excludedDimensions` (not `unscoredDimensions`). This is structural N/A, not a missing score; the weighted aggregate is unaffected either way.
    45	
    46	## 5. LIVE MODE (MODE B) + ADVISORY SIGNALS
    47	
    48	The weighted **D4** dimension stays `unscored-mode-a` in the aggregate by design (its grader scores hallucination, not usefulness). Two live-mode signals are surfaced under `advisorySignals`, **outside** the weighted aggregate so the v1 weights/verdict are unchanged:
    49	
    50	- **`D4_task_outcome` — the real usefulness instrument (D4-R).** Opt-in via `--d4` (live). The model is asked to *do* a routine task (a minimal patch plan + verification commands, not a routing list) skill-on vs skill-off; both answers are graded by the task-outcome rubric (`system-grader-task-outcome.md`: correctness / verification-fit / focus / hallucination-risk) through the Lane B grader harness (claude-graded; distinct cache keys via the `#taskoutcome#on|off` fixture ids). Score = `0.5 + (on − off) / 2` (>0.5 = the skill helped). Stamped `attribution: approximate` (skill-off is approximated by hook-disable + preamble + a contamination guard that drops a leaked pair). Reported as `advisorySignals.D4_task_outcome`, never summed into the verdict.
    51	- **`assetRecall` — deferred-asset support.** `expectedAssets` is scored on its own lane (live: recall vs the model's stated assets; router: deferred). `live-executor` keeps assets on a separate `observedAssets` channel so a stated, useful asset is not counted as D3 over-routing waste.
    52	
    53	**Live trace (Mode B)** replaces the D2/D3 router-replay proxies with the model's stated/observed routing (references only — assets are on the `assetRecall` lane). Signals that did not run report `status: unscored-mode-a` — never faked.
    54	
    55	### Advisory Signals
    56	
    57	`score-skill-benchmark.cjs` emits `advisorySignals` in the machine report, and `build-report.cjs` renders them under **Advisory signals (NOT in the weighted aggregate)**. `D4_task_outcome` reports the opt-in D4-R routine-task usefulness delta when `--d4` live ablation runs; otherwise it is unscored. `assetRecall` reports expected deferred-asset support when live stated assets are available; otherwise it is deferred or unscored. Both are diagnostic only and never change `aggregateScore`, `dimensionScores`, `verdict`, or D4's weighted status.
    58	
    59	## 6. FUNNEL + BOTTLENECK RANKING
    60	
    61	Per-scenario `firstFailingStage` follows the implemented order: `activated-inter` (advisor selected the wrong skill when D1-inter is scored), `router-unparseable`, `surface-mismatch`, `routed-intra`, then `discovered`. A scenario with no failing stage is counted as `passed`; orchestrator-added degradation rows can also contribute `unparseable-fixture`, `contaminated-fixture`, or browser routed-out reasons, and `build-report.cjs` displays routed-out rows with their reason instead of a normal failing stage. The headline bottleneck is the non-`passed` stage with the largest first-failure count (attrition). Bottlenecks list D5 findings plus the headline funnel finding, each mapped through `assets/skill_benchmark/remediation_taxonomy.json` to file, locus, one-line fix, and handoff lane.
     1	#!/usr/bin/env node
     2	// ╔══════════════════════════════════════════════════════════════════════════╗
     3	// ║ d4-ablation — D4/D4-R usefulness ablation (skill-ON vs skill-OFF delta)  ║
     4	// ╚══════════════════════════════════════════════════════════════════════════╝
     5	'use strict';
     6	
     7	/**
     8	 * d4-ablation.cjs — D4 usefulness ablation (APPROXIMATE).
     9	 *
    10	 * "Does the skill actually help?" measured as the quality delta between a
    11	 * skill-ON run and a skill-OFF run of the same scenario, graded by the existing
    12	 * Lane B grader (gradeD4).
    13	 *
    14	 * Honest constraint (validated in the Phase 0 spike): opencode has no clean
    15	 * single-skill suppression. Skill-OFF is APPROXIMATED with
    16	 * MK_SKILL_ADVISOR_HOOK_DISABLED=1 + a "do not load any skill" preamble, then
    17	 * verified by checking the skill was NOT loaded/read (else the pair is dropped
    18	 * as contaminated). D4 scores are stamped attribution:"approximate".
    19	 */
    20	
    21	// ─────────────────────────────────────────────────────────────────────────────
    22	// 1. IMPORTS/REQUIRES
    23	// ─────────────────────────────────────────────────────────────────────────────
    24	
    25	const path = require('path');
    26	const { runDispatch, parseLiveResult, buildLiveDispatchPrompt } = require('./live-executor.cjs');
    27	const grader = require('../model-benchmark/scorer/grader/harness.cjs');
    28	const clamp01 = grader.clampScore01;
    29	const buildGraderBase = grader.buildGraderBase;
    30	
    31	// ─────────────────────────────────────────────────────────────────────────────
    32	// 2. CORE LOGIC
    33	// ─────────────────────────────────────────────────────────────────────────────
    34	
    35	/**
    36	 * Build the skill-OFF prompt: answer from the model's own knowledge, no skill,
    37	 * no project skill-file reads. Pairs with MK_SKILL_ADVISOR_HOOK_DISABLED=1.
    38	 *
    39	 * @param {Object} scenario - Scenario whose prompt is being ablated.
    40	 * @returns {string} Skill-OFF dispatch prompt.
    41	 */
    42	function buildSkillOffPrompt(scenario) {
    43	  return [
    44	    'Answer ONLY from your own knowledge. Do NOT load any skill and do NOT read project skill files.',
    45	    `Task: ${scenario.prompt || ''}`,
    46	    'Emit ONLY a fenced ```json code block: {"surface": "...", "resources": ["..."], "assets": ["..."], "agent": "none"}',
    47	  ].join('\n');
    48	}
    49	
    50	/**
    51	 * Grade the on/off output pair into a normalized D4 usefulness score.
    52	 * Deterministic when graderMode is a mock mode. score in [0,1]: 0.5 = no delta,
    53	 * 1 = skill-on fully better, 0 = skill-off better (skill hurt).
    54	 *
    55	 * @param {Object} args - Grading inputs.
    56	 * @param {Object} args.scenario - Scenario being graded.
    57	 * @param {string} args.onText - Skill-ON response text.
    58	 * @param {string} args.offText - Skill-OFF response text.
    59	 * @param {string} [args.graderMode='mock'] - Grader mode.
    60	 * @param {string} [args.cacheDir] - Optional grader cache directory.
    61	 * @returns {Promise<Object>} D4 score object plus raw on/off grades.
    62	 */
    63	async function gradeAblation({ scenario, onText, offText, graderMode = 'mock', cacheDir }) {
    64	  const base = buildGraderBase({ variantHash: 'live', graderMode, cacheDir, dimId: 'D4' });
    65	  const rubric = scenario.passCriteria || scenario.prompt || '';
    66	  const onG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#on`, rubric }, swe16_output_text: onText || '', ...base });
    67	  const offG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#off`, rubric }, swe16_output_text: offText || '', ...base });
    68	  const onScore = clamp01(onG.score);
    69	  const offScore = clamp01(offG.score);
    70	  const score = clamp01(0.5 + (onScore - offScore) / 2);
    71	  return { d4: { score, onScore, offScore, attribution: 'approximate', graderMode }, raw: { onG, offG } };
    72	}
    73	
    74	/**
    75	 * Full live ablation: two real dispatches (on/off) + grade. Spends API.
    76	 *
    77	 * @param {Object} args - Ablation inputs.
    78	 * @param {Object} args.scenario - Scenario to ablate.
    79	 * @param {string} args.skillRoot - Absolute path to the skill root.
    80	 * @param {string} args.model - Model id for dispatch.
    81	 * @param {string} args.variant - Reasoning-effort variant.
    82	 * @param {string} [args.graderMode='mock'] - Grader mode.
    83	 * @param {string} [args.cacheDir] - Optional grader cache directory.
    84	 * @returns {Promise<Object>} D4 result object (graded or unscored).
    85	 */
    86	async function runD4Ablation({ scenario, skillRoot, model, variant, graderMode = 'mock', cacheDir }) {
    87	  const dir = path.resolve(skillRoot, '..', '..', '..');
    88	  const skillId = path.basename(skillRoot || '');
    89	
    90	  const on = runDispatch({ prompt: buildLiveDispatchPrompt(scenario), dir, model, variant });
    91	  const off = runDispatch({ prompt: buildSkillOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
    92	  if (on.status !== 0 || off.status !== 0) {
    93	    return { d4: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate' } };
    94	  }
    95	  const onParsed = parseLiveResult(on.stdout, { skillId });
    96	  const offParsed = parseLiveResult(off.stdout, { skillId });
    97	
    98	  // Contamination guard: skill-OFF must NOT have loaded/read the skill.
    99	  const offTouched = (offParsed.activation && offParsed.activation.activated)
   100	    || (offParsed.raw.observedReads || []).length > 0;
   101	  if (offTouched) {
   102	    return { d4: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate' }, contaminated: true };
   103	  }
   104	
   105	  const graded = await gradeAblation({
   106	    scenario, onText: onParsed.raw.responseText, offText: offParsed.raw.responseText, graderMode, cacheDir,
   107	  });
   108	  return { ...graded, onActivated: !!(onParsed.activation && onParsed.activation.activated) };
   109	}
   110	
   111	// ─────────────────────────────────────────────────────────────────────────────
   112	// D4-R: task-outcome usefulness (the complement of the hallucination delta).
   113	//
   114	// The hallucination ablation above grades a ROUTING-ANALYSIS answer with a
   115	// grader that is explicitly forbidden from scoring correctness — so it cannot
   116	// say whether the skill makes a ROUTINE TASK answer better. D4-R fixes that: it
   117	// asks the model to produce the actual change (a minimal patch plan + the
   118	// verification command), not a list of which docs it would load, and grades the
   119	// on/off pair with a task-outcome rubric. Reported as a SEPARATE number; the two
   120	// are never collapsed.
  1418	    });
  1419	  }
  1420	
  1421	  const hasActiveP1 = bottlenecks.some((bottleneck) => bottleneck.severity === 'P1');
  1422	  let verdict;
  1423	  if (gateFailed) verdict = 'BLOCKED-BY-STRUCTURE';
  1424	  else if (hubRegistry && hubRegistry.gateFailed) verdict = 'BLOCKED-BY-REGISTRY';
  1425	  else if (hubRouteGate.failed) verdict = 'BLOCKED-BY-ROUTING';
  1426	  else if (toolSurfaceGate.failed) verdict = 'BLOCKED-BY-TOOL-SURFACE';
  1427	  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
  1428	  else if (aggregateScore >= 80 && !hasActiveP1) verdict = 'PASS';
  1429	  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
  1430	  else verdict = 'FAIL';
  1431	
  1432	  // Generalization / circularity block: fitted vs decontaminated-holdout scores
  1433	  // and their gap. A large positive gap (fitted >> holdout) is the circularity
  1434	  // signal — the skill scores well on what it was tuned against but generalizes
  1435	  // worse. Dormant (holdout null) until a corpus declares stage:holdout fixtures.
  1436	  const generalization = {
  1437	    fittedScore: aggregateScore,
  1438	    holdoutScore,
  1439	    generalizationGap,
  1440	    fittedCount: fittedRows.filter((r) => typeof r.modeAScore === 'number').length,
  1441	    holdoutCount: holdoutRows.filter((r) => typeof r.modeAScore === 'number').length,
  1442	    negativeCount: negativeRows.length,
  1443	    note: holdoutRows.length === 0
  1444	      ? 'no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)'
  1445	      : 'holdout excluded from the fitted aggregate; gap = fitted minus holdout',
  1446	  };
  1447	
  1448	  return {
  1449	    schemaVersion: 'skill-benchmark-report.v1',
  1450	    status: 'skill-benchmark-complete',
  1451	    mode: 'skill-benchmark',
  1452	    scoringMethod: (traceMode || 'router') === 'live' ? 'mode-b-live' : 'mode-a-router-replay',
  1453	    traceMode: traceMode || 'router',
  1454	    targetSkill: { id: skillId, root: skillRoot },
  1455	    verdict,
  1456	    aggregateScore,
  1457	    generalization,
  1458	    gate: {
  1459	      d5Score: d5,
  1460	      gateFailed,
  1461	      reason: gateFailed ? 'D5 structural hard-gate failure' : null,
  1462	      hubRoute: hubRouteGate,
  1463	      toolSurface: toolSurfaceGate,
  1464	    },
  1465	    dimensionScores: {
  1466	      D1inter: d1interDim,
  1467	      D1intra: { points: WEIGHTS.d1intra, score: avg((r) => (r.dims && r.dims.d1intra ? Math.round(r.dims.d1intra.score * 100) : null)) },
  1468	      D2: { points: WEIGHTS.d2, score: avg((r) => (r.dims && r.dims.d2 ? Math.round(r.dims.d2.score * 100) : null)) },
  1469	      D3: { points: WEIGHTS.d3, score: avg((r) => (r.dims && r.dims.d3 && typeof r.dims.d3.score === 'number' ? Math.round(r.dims.d3.score * 100) : null)) },
  1470	      D4: { points: WEIGHTS.d4, score: null, status: 'unscored-mode-a' },
  1471	      D5: { points: WEIGHTS.d5, score: d5, hardGate: true },
  1472	    },
  1473	    unscoredDimensions,
  1474	    excludedDimensions,
  1475	    advisorySignals: {
  1476	      D4_task_outcome: d4TaskAvg === null
  1477	        ? { score: null, status: 'unscored (run --d4 in live mode)', note: 'task-outcome usefulness delta; separate from D4 hallucination, never summed into it' }
  1478	        : { score: d4TaskAvg, note: 'task-outcome usefulness delta (skill-on vs off), separate from D4 hallucination' },
  1479	      assetRecall: assetRecallAvg === null
  1480	        ? { score: null, status: 'deferred (router) or no asset gold', note: 'deferred-asset support recall; advisory, not weighted' }
  1481	        : { score: assetRecallAvg, note: 'deferred-asset support recall; advisory, not weighted' },
  1482	      modePrecision: modePrecisionAvg === null
  1483	        ? { score: null, status: 'unscored (no mode-routing probe or no expected.mode)', note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' }
  1484	        : { score: modePrecisionAvg, note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' },
  1485	      relativeRanking: relativeRankingSignal,
  1486	      routeTelemetry,
  1487	      recipeMissRate: recipeMiss.recipeMissRate,
  1488	      recipeMissBreakdown: recipeMiss.breakdown,

codex
The moat is causal release certification for a versioned skill bundle—not another model leaderboard.

A model benchmark asks, “How capable is this executor?” Skill-benchmark should answer, “What marginal value did this exact bundle add; where did value disappear between discovery, loading, compliance, and outcome; and does that value transfer across executors?” Neither model-benchmark nor the other deep modes isolates that intervention.

Three current behaviors weaken that claim:

- Mode A can emit generic `PASS` while task usefulness remains unscored and advisory ([scoring contract](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:22>), [scorer](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1421>)).
- Empty intent/resource gold is treated as a perfect, non-penalizing match ([scenario authoring](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:58>)).
- Skill-off is prompt-level suppression rather than hermetic removal, so the implementation correctly labels attribution approximate ([d4-ablation.cjs](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:7>)).

External evidence supports treating these as separate estimands. The new Skill-Usage study found that benefits degrade as agents move from oracle-provided skills to retrieval from 34,000 candidates; its repository exposes retrieval, top-k selection, trajectory inspection, and three-model configurations. That means “good skill content” and “realized skill value” are observably different properties. [Paper](https://arxiv.org/abs/2604.04323), [repository](https://github.com/UCSB-NLP-Chang/Skill-Usage).

The strongest concrete mechanism is a four-arm paired experiment:

- `off`: skill absent from a hermetic registry.
- `auto`: installed and discovered normally.
- `forced`: exact bundle body/resources guaranteed loaded.
- `placebo`: equalized context/tool overhead but inert content.

This yields `realizedLift = auto − off`, `selectionTax = forced − auto`, and `contentEffect = forced − placebo`. Run identical task/environment blocks across executor descriptors `{runtime, runtimeVersion, model, modelVersion, loaderVersion, toolSurface}`. Require both a same-model/different-runtime contrast and a same-runtime/different-model contrast; otherwise mark attribution `executor-confounded`. Start with paired bootstrap intervals; use heterogeneous-treatment estimation only after enough task/executor cells exist.

Loading canaries sharpen the decomposition. `agent-ecosystem/agent-skill-implementation` supplies 17 probe skills with unique phrases across bodies, references, scripts, and assets, specifically to distinguish deterministic harness loading from probabilistic model behavior. Port that idea into `live-executor.cjs`: record canary receipts at discovery, activation, resource load, and post-compaction. [Benchmark fixtures](https://github.com/agent-ecosystem/agent-skill-implementation/blob/main/benchmark-skills/README.md).

Mode A and Mode B should consequently stop sharing one verdict vocabulary:

- Mode A: `ROUTER-CONTRACT-PASS|FAIL|BLOCKED`—static reachability, routing precision, and corpus integrity only.
- Mode B: `SKILL-LIFT-BENEFICIAL|NEUTRAL|HARMFUL|INCONCLUSIVE`, with effect interval, practical margin, executor interaction, and cost delta.
- `PORTABLE-SKILL` requires beneficial or non-inferior live results across effectively distinct executors. A router pass alone can never confer it.

Empty gold needs fail-closed semantics. Require `goldPolicy: scored|negative|structural-only|pending`. `pending` scenarios contribute no score and make the corpus `BLOCKED-BY-GOLD`; `structural-only` is explicitly N/A rather than 1.0. Add provenance `{skillCommit, source, reviewer, behaviorConstraintIds}` and a mutation-sensitivity test that swaps or deletes gold and confirms the score changes. This aligns with Skill Coverage’s finding that leaderboard trajectories exercised only 38.66–45.51% of extracted behavior constraints: task success is not evidence that the packaged instructions were adequately tested. [Skill Coverage paper](https://arxiv.org/abs/2606.20659).

```json
{
  "new_repos": [
    {
      "name": "UCSB-NLP-Chang/Skill-Usage",
      "url": "https://github.com/UCSB-NLP-Chang/Skill-Usage",
      "stars": "~45",
      "what": "April 2026 skill-utility study with retrieval from 34k skills, three models, trajectory inspection, and refinement pipelines.",
      "lesson": "Separate oracle content efficacy from retrieval, selection, and realized end-to-end skill lift.",
      "maps_to": ["skill-benchmark", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "agent-ecosystem/agent-skill-implementation",
      "url": "https://github.com/agent-ecosystem/agent-skill-implementation",
      "stars": "~0",
      "what": "Nascent 2026 compatibility project with 17 canary-bearing skills covering 23 loader checks across nine categories.",
      "lesson": "Use resource-specific canaries to distinguish harness exposure from model activation and instruction-following.",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability"],
      "confidence": "med"
    },
    {
      "name": "anthropics/skills",
      "url": "https://github.com/anthropics/skills",
      "stars": "~161k",
      "what": "Current official Agent Skills repository; its skill-creator snapshots old/no-skill baselines and grades repeated outputs.",
      "lesson": "Treat the skill directory as the versioned intervention and preserve immutable baseline snapshots per evaluation.",
      "maps_to": ["skill-benchmark", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "agentskills/agentskills",
      "url": "https://github.com/agentskills/agentskills",
      "stars": "~23.1k",
      "what": "Active open specification repository defining portable bundles and progressive discovery, activation, and resource loading.",
      "lesson": "Benchmark each progressive-disclosure stage independently; format conformance does not prove runtime-semantic portability.",
      "maps_to": ["skill-benchmark", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "py-why/EconML",
      "url": "https://github.com/py-why/EconML",
      "stars": "~4.7k",
      "what": "Heterogeneous-treatment-effect toolkit; latest verified release v0.16.0 was July 2025.",
      "lesson": "Estimate skill uplift conditional on executor and task features, with intervals, once the factorial run matrix is large enough.",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Skill value is a staged treatment: discovery, loading, instruction adherence, and verified outcome must be measured separately because oracle-injected gains collapse under realistic retrieval.",
      "evidence": "https://arxiv.org/abs/2604.04323",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "A balanced off/auto/forced/placebo design identifies realized lift, selection tax, and content effect while executor-by-skill interactions distinguish model dependence from loader dependence.",
      "evidence": "https://github.com/py-why/EconML",
      "maps_to": ["skill-benchmark", "runtime/fan-out-fan-in", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "insight": "Unique canaries embedded separately in SKILL.md, references, scripts, and assets produce objective exposure receipts and avoid relying on model self-report.",
      "evidence": "https://github.com/agent-ecosystem/agent-skill-implementation/blob/main/benchmark-skills/README.md",
      "maps_to": ["skill-benchmark", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Task success is insufficient test adequacy: only 38.66-45.51% of extracted skill behavior constraints were covered in evaluated trajectories, so skill-benchmark needs constraint coverage alongside outcome lift.",
      "evidence": "https://arxiv.org/abs/2606.20659",
      "maps_to": ["skill-benchmark", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "UNIQUENESS-SHARPENING: add a paired off/auto/forced/placebo attribution matrix to live mode. Extend executor-dispatch.cjs with treatmentArm and executorDescriptor; make live-executor.cjs emit activation/resource canary receipts; add attribution-estimator.cjs producing realizedLift, selectionTax, contentEffect, confidence intervals, cost delta, and executor interactions. Persist each cell with skill bundle hash, task/environment hash, seed, receipts, outcome, tokens, latency, and cost.",
      "target": "skill-benchmark + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing + runtime/gauges-observability",
      "rationale": "This holds the model/task fixed while varying the deployable bundle, then holds the bundle fixed while varying runtime and model. It turns approximate skill-on/off scoring into attributable evidence.",
      "uniqueness": "Model-benchmark cannot identify whether lost value came from skill discovery, loader semantics, guidance quality, or execution; this matrix can.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/UCSB-NLP-Chang/Skill-Usage"
    },
    {
      "rec": "Split the report and verdict contracts: Mode A emits only ROUTER-CONTRACT-* results; Mode B emits SKILL-LIFT-BENEFICIAL|NEUTRAL|HARMFUL|INCONCLUSIVE using a practical-effect margin and paired interval. Require same-model/different-runtime and same-runtime/different-model contrasts before granting a PORTABLE-SKILL certificate; otherwise label the result executor-confounded.",
      "target": "skill-benchmark + runtime/gauges-observability + runtime/budget-cost",
      "rationale": "The current generic PASS can normalize over missing live usefulness, conflating deterministic router correctness with causal skill utility.",
      "uniqueness": "This creates a release certificate for a portable skill artifact rather than another aggregate model score.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/agent-ecosystem/agent-skill-implementation"
    },
    {
      "rec": "Add a pre-dispatch gold-integrity gate. Require goldPolicy=scored|negative|structural-only|pending; block a positive scored scenario when both intent/resource gold are empty; exclude pending and structural-only rows from numerators; emit BLOCKED-BY-GOLD when required coverage is incomplete. Store gold provenance and run a mutation-sensitivity check that proves changing gold changes the score.",
      "target": "skill-benchmark + runtime/gauges-observability",
      "rationale": "Treating empty expected sets as 1.0 permits high router scores without testing routing or discovery, while mutation sensitivity detects inert or decorative gold.",
      "uniqueness": "A trustworthy skill benchmark validates the bundle's behavioral contract; a model benchmark has no equivalent package-resource oracle.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2606.20659"
    }
  ],
  "contradictions": [
    {
      "claim": "A standardized Agent Skills folder is portable, so one executor is sufficient for skill evaluation.",
      "counter": "The standard defines package shape and progressive disclosure, while real harnesses may strip metadata, preload or hide resources, prune instructions, or use different activation mechanisms.",
      "evidence": "https://github.com/agent-ecosystem/agent-skill-implementation"
    },
    {
      "claim": "A Mode A PASS establishes that the skill is effective.",
      "counter": "Current Mode A normalizes over router dimensions while task usefulness remains unscored; realistic retrieval experiments show that oracle-route utility can fall toward the no-skill baseline.",
      "evidence": "https://arxiv.org/abs/2604.04323"
    }
  ],
  "next_angles": [
    "Cross-skill interference attribution: use sparse factorial or Shapley approximations to identify which skill combinations cause instruction conflicts, context pruning, or positive composition.",
    "Skill-effect certificate expiry: learn which runtime, model, dependency, and bundle changes invalidate prior attribution without requiring a full matrix rerun."
  ],
  "notes": "Skill Coverage did not expose a verified code repository in the sources found, so it is cited as a paper only. agent-ecosystem/agent-skill-implementation is a concrete and useful canary protocol but remains an early 0-star project with limited populated platform results. The current OpenCode lane lacks hermetic single-skill suppression; the off arm therefore needs an isolated registry/container before attribution can be upgraded from approximate."
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
183,935
