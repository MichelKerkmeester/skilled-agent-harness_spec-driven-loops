<!-- iteration 17 | SOL xhigh | mode: deep-improvement | angle: A2-moat deep-improvement :: unique value / moat | 2026-07-15T09:23:53.088Z -->

The moat is not “better self-editing.” It is an epistemic firewall around improvement: mutate one bounded surface, judge it with a precommitted ruler the mutator cannot alter, retain the baseline, and require causal evidence before exposure.

The current implementation is close, but uneven.md:76>)). The shared held-out convention currently names Lane B, however, while Lane A’s evaluator is dynamically derived and Lane C is diagnostic ([held-out convention](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:15>)). Promotion is still `accept → ship`, with no behavior-shadow or canary stage ([promotion rules](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md:39>)), and the benchmark cache still substitutes a hardcoded grader-build placeholder ([cache.cjs](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:20>)).

Three findings sharpen the design.

1. External evaluation is necessary, but a single frozen proxy is insufficient. Intrinsic self-correction can degrade reasoning without external feedback ([Huang et al.](https://arxiv.org/abs/2310.01798)), while continued optimization against a fixed proxy eventually raises proxy reward while lowering gold reward ([Gao et al.](https://arxiv.org/abs/2210.10760)). Freeze therefore means “fixed during this comparison,” not “trusted forever.”  
   Maps: `deep-improvement`, `runtime/convergence`.

2. Evaluator access itself is a capability. BITE learns semantics-preserving judge exploits through black-box queries and reports over 65% attack success with 1–2 point gains on a nine-point scale ([paper](https://arxiv.org/abs/2605.26156)); judge preferences can also be reverse-engineered and transferred to unseen judges ([NeurIPS 2025](https://papers.nips.cc/paper_files/paper/2025/hash/92a4d7a222ae16d4fbad90ef7743d5e0-Abstract-Conference.html)). A hash prevents rewriting, but not oracle extraction. Hidden promotion evaluation needs query budgets, delayed/coarse disclosure, and process-level unreadability.  
   Maps: `deep-improvement`, `runtime/budget-cost`, `runtime/state-jsonl-checkpointing`.

3. Promotion should be progressive delivery. Argo’s model separates mirrored traffic, baseline/canary experiments, analysis results, pauses, inconclusive states, promotion, and automatic abort ([analysis](https://argo-rollouts.readthedocs.io/en/stable/features/analysis/), [traffic mirroring](https://argo-rollouts.readthedocs.io/en/stable/features/traffic-management/)). For agents, “shadow” means paired replay of redacted real tasks with candidate outputs discarded; live canarying is optional and only valid behind a reversible routing adapter.  
   Maps: `deep-improvement`, `runtime/gauges-observability`, `runtime/locks-recovery`, `runtime/state-jsonl-checkpointing`.

The uniqueness-sharpening implementation is an `EvaluatorCapsule` committed before candidate generation:

```text
EvaluatorCapsule {
  epochId,
  evaluatorTreeHash,
  rubricHash,
  hiddenSetCommitment,
  goldSetHash,
  judgeBuildIds[],
  aggregationPolicyHash,
  candidateReadablePaths[],
  maxPromotionQueries
}
```

Every evaluation emits a signed receipt binding capsule, baseline, candidate, and run hashes. The proposer receives visible-fixture detail, but hidden promotion evaluation returns only gate outcomes and coarse dimension bands. Promotion uses deterministic anchors plus diverse judges; for safety dimensions require `min_j LCB(delta_j) >= 0`, use uncertainty-weighted aggregation for softer utility, and return `inconclusive` when disagreement exceeds its calibrated ceiling. Conservative reward-model ensembles have direct evidence for reducing overoptimization; mean aggregation is not the safe default ([Coste et al.](https://arxiv.org/abs/2310.02743)).

The resulting state machine should be `propose → accept-offline → shadow → canary → ship`, with automatic rollback to the recorded baseline hash. This is what the other modes cannot supply: research finds evidence, review finds faults, council deliberates, and alignment measures conformance; only deep-improvement can turn a bounded mutation into a reversible, experimentally warranted promotion decision.

```json
{
  "new_repos": [
    {
      "name": "xianglinyang/llm-as-a-judge-attack",
      "url": "https://github.com/xianglinyang/llm-as-a-judge-attack",
      "stars": "~2",
      "what": "May 2026 BITE implementation; src/evolve_agent/bandit/UCB performs budgeted black-box judge exploitation, with transferability and detection notebooks.",
      "lesson": "Treat exact evaluator feedback as an attack surface: budget hidden-eval queries and run semantics-preserving score-inflation attacks before promotion.",
      "maps_to": ["deep-improvement", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "tlc4418/llm_optimization",
      "url": "https://github.com/tlc4418/llm_optimization",
      "stars": "~49",
      "what": "ICLR 2024 reference code with six commits and no releases; src/bon/run_bon_pipeline.py and PPO configs implement individual, mean, WCO, and UWO reward-model evaluation.",
      "lesson": "Fan out to diverse evaluators and promote on a conservative lower bound or uncertainty-weighted objective, not one judge or an unqualified mean.",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "argoproj/argo-rollouts",
      "url": "https://github.com/argoproj/argo-rollouts",
      "stars": "~3.5k",
      "what": "Active progressive-delivery controller; v1.9.0 released March 20, 2026, with AnalysisTemplate, Experiment, traffic mirroring, pauses, inconclusive states, promotion, and abort.",
      "lesson": "Extend accept/ship into shadow/canary/ship stages whose analysis receipts can pause, promote, or restore the stable baseline automatically.",
      "maps_to": ["deep-improvement", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability", "runtime/locks-recovery"],
      "confidence": "high"
    },
    {
      "name": "Giskard-AI/giskard-oss",
      "url": "https://github.com/Giskard-AI/giskard-oss",
      "stars": "~5.5k",
      "what": "Active agent-evaluation repository; giskard-scan v1.0.0b3 released July 13, 2026, with Scenario checks, multi-turn testing, vulnerability_scan, and an extensible scenario-generator registry.",
      "lesson": "Generate adversarial evaluator canaries from the target description, validate them against known-good and known-bad outputs, then freeze that generated suite for the evaluation epoch.",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A frozen evaluator is an experiment-scoped commitment, not a permanently trustworthy objective: re-baseline both candidate and baseline whenever an evaluator epoch changes.",
      "evidence": "https://arxiv.org/abs/2210.10760",
      "maps_to": ["deep-improvement", "runtime/convergence", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Evaluator secrecy and query control are separate from evaluator immutability; repeated scalar feedback can reveal exploitable judge preferences without any evaluator write access.",
      "evidence": "https://arxiv.org/abs/2605.26156",
      "maps_to": ["deep-improvement", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Require conservative cross-family judge agreement plus deterministic anchors; diverse reward-model ensembles using worst-case or uncertainty-weighted objectives reduce proxy overoptimization.",
      "evidence": "https://arxiv.org/abs/2310.02743",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "The evaluator must be outside the mutable genome at the capability level, because models trained on specification gaming have generalized to modifying rewards and tests directly.",
      "evidence": "https://arxiv.org/abs/2406.10162",
      "maps_to": ["deep-improvement", "runtime/locks-recovery", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Promotion is a deployment experiment rather than a file-copy decision: shadow evidence and bounded canary exposure measure behavior on the operating distribution while preserving a stable rollback target.",
      "evidence": "https://argo-rollouts.readthedocs.io/en/stable/features/analysis/",
      "maps_to": ["deep-improvement", "runtime/gauges-observability", "runtime/locks-recovery"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a lane-independent EvaluatorCapsule created before candidate generation. Hash evaluator code, rubric, real judge build identifiers, aggregation policy, gold anchors, and a commitment to hidden fixtures; record the capsule in session_start and require a matching signed EvalReceipt at every promotion gate. Run the evaluator in a separate capability boundary, expose no hidden paths, and cap promotion-oracle queries per candidate.",
      "target": "deep-improvement + runtime/state-jsonl-checkpointing + runtime/budget-cost",
      "uniqueness": "This makes deep-improvement the only mode that commits the ruler before proposing a mutation and can prove that the mutation never controlled or inspected its promotion oracle.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2406.10162"
    },
    {
      "rec": "Add an adversarial conservative evaluator quorum for finalists: deterministic executable anchors first, then at least two provider/family-diverse judges and one attack lane. Require non-negative per-judge lower confidence bounds on safety dimensions, use uncertainty-weighted aggregation for utility, and return inconclusive on excessive disagreement. Run BITE-style semantic-preserving edits and generated Giskard scenarios against the evaluator capsule; refresh attacks only between frozen epochs.",
      "target": "deep-improvement + runtime/fan-out-fan-in + runtime/gauges-observability",
      "rationale": "Different-family grading removes one correlation but does not prevent transferable style attacks or shared judge biases. Conservative aggregation and adversarial meta-evaluation make disagreement and evaluator fragility promotion blockers.",
      "uniqueness": "The mode improves not only the candidate but the credibility of the evidence authorizing promotion, while keeping evaluator evolution temporally separated from candidate optimization.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2310.02743; https://arxiv.org/abs/2605.26156"
    },
    {
      "rec": "Extend promote-candidate from accept/ship to accept-offline/shadow/canary/ship. Shadow runs paired baseline and candidate on redacted trace snapshots with candidate outputs discarded. Canary adapters expose 1%, 5%, then 20% of eligible traffic with pauses and automatically restore the baseline on a hard-rule failure, negative evaluator lower bound, cost ceiling, or error-rate regression. Journal only trace references, hashes, metrics, and stage decisions.",
      "target": "deep-improvement + runtime/state-jsonl-checkpointing + runtime/gauges-observability + runtime/locks-recovery",
      "rationale": "Offline fixtures cannot prove compatibility with the operating distribution. Progressive exposure supplies paired downstream evidence while limiting blast radius and preserving deterministic rollback.",
      "uniqueness": "This turns deep-improvement from guarded prompt editing into a progressive-delivery controller for agent behavior, a capability absent from research, review, council, and alignment modes.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://argo-rollouts.readthedocs.io/en/stable/features/traffic-management/"
    }
  ],
  "contradictions": [
    {
      "claim": "Freezing one evaluator is sufficient to prevent reward hacking.",
      "counter": "Black-box bandit optimization can discover semantics-preserving score exploits, and preference attacks can transfer to judges not used during optimization; freezing must be combined with query control, evaluator diversity, adversarial canaries, and periodic human-authorized epoch rotation.",
      "evidence": "https://arxiv.org/abs/2605.26156; https://papers.nips.cc/paper_files/paper/2025/hash/92a4d7a222ae16d4fbad90ef7743d5e0-Abstract-Conference.html"
    },
    {
      "claim": "A rising aggregate evaluator score proves the candidate is improving.",
      "counter": "Proxy reward can continue rising after gold reward peaks and declines; conservative ensemble objectives mitigate this better than single-proxy optimization.",
      "evidence": "https://arxiv.org/abs/2210.10760; https://arxiv.org/abs/2310.02743"
    }
  ],
  "next_angles": [
    "Build an evaluator-oracle leakage benchmark: vary exact-score visibility, dimension-level feedback, pass/fail-only receipts, query budgets, and cross-candidate memory; measure how quickly a BITE-like optimizer learns promotion exploits.",
    "Specify and attack-test the EvaluatorCapsule capability boundary: hidden fixture storage, judge credentials, grader prompts, cache contents, logs, environment variables, side channels, and signed receipt verification.",
    "Measure whether offline held-out, shadow replay, and limited live canary deltas predict post-ship correctness, cost, and rollback rates across heterogeneous agent workloads."
  ],
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
session id: 019f6512-714d-7f01-95a7-b5af85676b9a
--------
user
You are iteration 17/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-improvement
MODE IDENTITY (what it does today): Evaluator-first bounded agent improvement: 5-dimension scoring, dynamic profiling, packet-local candidates, guarded promotion.
GENERIC ALTERNATIVE it must out-value: naive 'ask the model to improve its own prompt/agent' with no frozen evaluator

THIS ITERATION'S ANGLE (A2-moat): deep-improvement :: unique value / moat
DIRECTIVE: What makes an EVALUATOR-FIRST, guarded-promotion, bounded improvement loop uniquely valuable versus naive 'ask the model to improve itself' — given Goodhart/reward-hacking? Find evidence that frozen-evaluator + regression-gated promotion beats open-loop self-edit. Propose concrete ways to SHARPEN the moat: frozen eval canaries, shadow-then-promote, adversarial evaluators.

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
THIS run's new repos so far (63) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement
New insights so far: 67; recommendations: 45.
Open threads flagged: Implement the packet-local counterfactual probe matrix and determine which perturbation metrics best predict real downstream plan changes rather than harmless wording variation. | Test factual-seat calibration using domain seed questions while proving that performance weights cannot suppress normative minority positions. | Design the exact CandidateMatrixArchive schema and compare case-wise Pareto, MAP-Elites, and scalar ranking on synthetic candidate populations with specialists, generalists, regressions, and deceptive high-score candidates. | Build a candidate-blind promotion benchmark measuring whether commit-before-view, hidden executable anchors, cross-family judges, and judge ensembles predict downstream correctness under iterative optimization. | Specify the mutable-genome boundary for deep-improvement: prompts, skills, demonstrations, memory policy, tool descriptions, workflow graph, control code, and mutation policy, with evaluator reachability tests proving each protected asset is inaccessible. | Evaluate profile-scoped promotion and harness-tree routing against one global champion under stable, heterogeneous, and drifting packet workloads.

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
This is a read-only research iteration, so no spec-folder write path applies. I’m routing it as deep-improvement moat research and will verify new sources, repository activity, stars, and implementation details before synthesizing the promotion design.
exec
/bin/zsh -lc 'python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "iteration 17/40 deep-improvement A2-moat evaluator-first guarded-promotion bounded improvement loop versus naive self-edit; Goodhart reward-hacking; frozen eval canaries, shadow-then-promote, adversarial evaluators; read-only web research" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "node .opencode/bin/spec-memory.cjs memory_match_triggers --json '{\"prompt\":\"iteration 17/40 deep-improvement A2-moat evaluator-first guarded-promotion bounded improvement loop versus naive self-edit; Goodhart reward-hacking; frozen eval canaries, shadow-then-promote, adversarial evaluators; read-only web research\"}' --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1873ms:
2026-07-15 11:19:20.301 xcodebuild[133:207207536]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:19:20.448 xcodebuild[133:207207533] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-qyySw9Or' (errno=Operation not permitted)
2026-07-15 11:19:20.817 xcodebuild[146:207207598]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:19:20.921 xcodebuild[146:207207586] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
Native advisor unavailable (None; freshness=unavailable); falling back to local Python scorer.
Skill graph: loaded from SQLite
[
  {
    "skill": "deep-improvement",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep-improvement(explicit), !evaluator-first(phrase), !improvement loop(phrase), candidate, deep(name)",
    "_graph_boost_count": 0,
    "source": "local"
  },
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep-improvement(keyword), !deep-improvement(signal), deep(name), improvement, loop(name)",
    "_graph_boost_count": 0,
    "source": "local"
  }
]

 exited 75 in 3241ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

codex
Skill routing resolved at 0.95 to `deep-improvement` inside `system-deep-loop`. The memory trigger service is unavailable in this sandbox; the local advisor still resolved the required mode, so I’m loading that mode contract before browsing rather than substituting a generic research workflow.
exec
/bin/zsh -lc "rg --files .opencode/skills/system-deep-loop .opencode/skills | rg 'deep-improvement|system-deep-loop/.*/SKILL\\.md|system-deep-loop/SKILL\\.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/SKILL.md
.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
.opencode/skills/system-deep-loop/deep-review/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/baselines/claude-baseline.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-005-orchestrate-handoff.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-004-concise-natural-ask.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-002-bare-command-halt.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-003-vague-natural-ask.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-001-auto-run-specified.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/behavior_benchmark.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_profiles/README.md
.opencode/skills/system-deep-loop/deep-alignment/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/remediation_taxonomy.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/promotion_gates.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/rollback.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/candidate_generation.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/plateau_detection.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/initialization.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/two_phase_promotion_and_rollback.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dynamic_profiling.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/deterministic_scoring.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/five_dimension_rubric.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dimensional_progress.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/dual_report_and_remediation.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_date.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_stale_verdict.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_improved.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_parse_csv_line.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_baseline.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_semver.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_strict_acceptance.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_semver_compare.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_ipv4.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_int_to_words.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_merge_intervals.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t1_smoke_echo.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_roman_to_int.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_ac_coverage.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_edge.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_normalize_path.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_bugfix_in_context.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_eval_expr.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_softened_fail.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_over_read.json
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/runtime_mirrors.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/command_dispatch.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_discriminating.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/model_vs_model.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json
.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_records_and_gates.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/model_dispatcher.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/opt_in_5dim_scorer.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/score_delta_benchmark_gates.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md
.opencode/skills/system-deep-loop/deep-improvement/routing-allowlist.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/typed-errors.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md
.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json
.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/mirror_drift_policy.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/mutation-coverage.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs
.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json
.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback_runbook.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement_config.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/candidate-lineage.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/mutation-coverage.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/trade-off-trajectory.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-dashboard.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/benchmark-results.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/materialize-fixture-id.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/anti-goodhart.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-dashboard.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/model-family.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/parse-args.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/check-dispatch-cap.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/extract-deliverable.cjs
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/benchmark_operator_guide.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/mixed_executor_methodology.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.7.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.13.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.5.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.1.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.3.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.1.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.8.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.4.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.12.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.1.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.16.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.14.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/candidate-lineage.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/routing-allowlist.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-surface-path-parse.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-opencode-playbook-ids.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/_args.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs
.opencode/skills/system-deep-loop/deep-research/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-cache.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-security.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/rollback-candidate-containment.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/audit_journal_emission.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/journal_wiring.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/dimension_trajectory.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/resume_continuation.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/parallel_candidates_opt_in.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/legal_stop_gates.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/benchmark_stability.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/dispatch-envelope.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/grader-harness-hardening.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-runtime.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/bundle-gate-exec-gate.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/improvement_gate_delta.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/benchmark_completed_boundary.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/setup-cp-sandbox.sh
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/legal_stop_gate_bundle.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/active_critic_overfit.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/skill_load_not_protocol.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/proposal_only_boundary.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/full_setup.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/skill_benchmark.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/quick_reference.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/evaluation_policy.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/integration_scan.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/target_onboarding.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/model_benchmark.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/promotion_operations.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/loop_execution.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/missing_candidate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dynamic_arbitrary.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dimension_details.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/without_integration.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/with_integration.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5cecfb73a67e5b6522e5992e8a1958d4.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8e6d3962a346cf59796d3df172c3901b.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/df404b41b693fd90b7d2b2fb64d46d78.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5fe47aad8aacf44314f494ab0add2dec.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4d1138ca8c23389ecdf84767e8691348.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/362330146b11be4e9ed0d522cc7b7a9f.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/e5706bc35dabb7584b4563c9d5b2bd42.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9a38a58ebffba2c0a5e87918261d9afb.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/0115576e1e7be786962398431c973dd9.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/dbd80958bc81ecc2c9c947d3db67f510.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/22c1faa7c45013e9fdfb6ce5ecf929d1.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9c562e7eb6d90a65972bc75282b09770.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/ea2a6323ff8b607dea081c14ae4fd24b.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/a59863e9ad0f70d9bf39a3b3e7d3ec2b.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f4b6ea7a34706c73189ac821c6ec177d.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/75692e98524c987bc724bd15f1268854.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8c2c8a1fd00f3af9daaef290f1be57ba.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/aac68b3316e3489dd0c4e9b5e367ddd5.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc53734e22ef097b18e31f94d61a003d.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/42840a5b34cdd91b3e2ff2d77184541e.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/d0bc23dd3d54f9d0feef1727c1313afe.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/index.jsonl
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/7fb218c8d070aa9e92bbda2b3bba94de.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4b7b4bbc6313c5e1c67711655e612a98.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9f00e055438f4fb69c5a0bf926d25952.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/cbbeff1caf82bd3a1e002bbd22377b43.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/720c3c2f773829e2d75f3c4cf1c9cc36.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f2f2dd71f2533dd8cb3665d0857b8a02.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc10907e5828f4c8b642f4557d6c0675.out.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/any_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/candidate_lineage.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/full_pipeline.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/trade_off_detection.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/two_phase_promotion_and_rollback.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/mutation_coverage_graph_tracking.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/json_output_file.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_missing_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_diverse_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_known_agent.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-skeptic.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/README.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/inline_rules_fallback.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/file_output.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/rules_extraction.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/output_checks.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/dual_report_and_remediation.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/contamination_gate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/mode_wiring_routing.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/d5_connectivity_hard_gate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/no_dimensions.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/plateau_detection.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/with_dimensions.md
.opencode/skills/system-deep-loop/deep-improvement/README.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/optin_5dim_scorer.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/criteria_exec_gate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/reviewer_prompt_regression_fixtures.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/score_delta_benchmark_gates.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/default_pattern_scorer.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/mode_switch_routing.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/unknown_fallback.md
.opencode/skills/system-deep-loop/SKILL.md
.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/baselines/claude-baseline.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-005-orchestrate-handoff.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-004-concise-natural-ask.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-002-bare-command-halt.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-003-vague-natural-ask.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-001-auto-run-specified.md
.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/behavior_benchmark.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_profiles/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/remediation_taxonomy.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.private.json
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.public.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_date.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_stale_verdict.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_improved.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_parse_csv_line.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_baseline.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_semver.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_strict_acceptance.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_semver_compare.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_ipv4.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_int_to_words.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_merge_intervals.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t1_smoke_echo.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_roman_to_int.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_ac_coverage.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_edge.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_normalize_path.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_bugfix_in_context.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_eval_expr.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_softened_fail.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_over_read.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_discriminating.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/model_vs_model.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json
.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/typed-errors.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/mutation-coverage.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/promotion_gates.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/rollback.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/candidate_generation.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/plateau_detection.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/initialization.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/two_phase_promotion_and_rollback.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dynamic_profiling.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/deterministic_scoring.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/five_dimension_rubric.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dimensional_progress.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement_config.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/candidate-lineage.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/mutation-coverage.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/trade-off-trajectory.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-dashboard.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/benchmark-results.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/materialize-fixture-id.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/anti-goodhart.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-dashboard.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/model-family.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/parse-args.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/check-dispatch-cap.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/extract-deliverable.cjs
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/dual_report_and_remediation.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/runtime_mirrors.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/command_dispatch.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_records_and_gates.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/model_dispatcher.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/opt_in_5dim_scorer.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/score_delta_benchmark_gates.md
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md
.opencode/skills/system-deep-loop/deep-improvement/routing-allowlist.json
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/routing-allowlist.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-surface-path-parse.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-opencode-playbook-ids.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/_args.cjs
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/mirror_drift_policy.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md
.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback_runbook.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/benchmark_operator_guide.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/mixed_executor_methodology.md
.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.7.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.13.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.5.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.1.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.3.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.1.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.8.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.4.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.12.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.1.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.16.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.14.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5cecfb73a67e5b6522e5992e8a1958d4.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8e6d3962a346cf59796d3df172c3901b.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/df404b41b693fd90b7d2b2fb64d46d78.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5fe47aad8aacf44314f494ab0add2dec.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4d1138ca8c23389ecdf84767e8691348.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/362330146b11be4e9ed0d522cc7b7a9f.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/e5706bc35dabb7584b4563c9d5b2bd42.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9a38a58ebffba2c0a5e87918261d9afb.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/0115576e1e7be786962398431c973dd9.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/dbd80958bc81ecc2c9c947d3db67f510.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/22c1faa7c45013e9fdfb6ce5ecf929d1.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9c562e7eb6d90a65972bc75282b09770.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/ea2a6323ff8b607dea081c14ae4fd24b.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/a59863e9ad0f70d9bf39a3b3e7d3ec2b.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f4b6ea7a34706c73189ac821c6ec177d.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/75692e98524c987bc724bd15f1268854.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8c2c8a1fd00f3af9daaef290f1be57ba.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/aac68b3316e3489dd0c4e9b5e367ddd5.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc53734e22ef097b18e31f94d61a003d.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/42840a5b34cdd91b3e2ff2d77184541e.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/d0bc23dd3d54f9d0feef1727c1313afe.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/index.jsonl
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/7fb218c8d070aa9e92bbda2b3bba94de.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4b7b4bbc6313c5e1c67711655e612a98.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9f00e055438f4fb69c5a0bf926d25952.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/cbbeff1caf82bd3a1e002bbd22377b43.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/720c3c2f773829e2d75f3c4cf1c9cc36.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f2f2dd71f2533dd8cb3665d0857b8a02.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc10907e5828f4c8b642f4557d6c0675.out.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json
.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs
.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json
.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-skeptic.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/README.md
.opencode/skills/system-deep-loop/deep-review/SKILL.md
.opencode/skills/system-deep-loop/deep-research/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/dispatch-envelope.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/grader-harness-hardening.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-runtime.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/bundle-gate-exec-gate.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/candidate-lineage.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-cache.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-security.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/rollback-candidate-containment.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs
.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/audit_journal_emission.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/journal_wiring.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/dimension_trajectory.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/resume_continuation.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/parallel_candidates_opt_in.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/legal_stop_gates.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/benchmark_stability.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md
.opencode/skills/system-deep-loop/deep-alignment/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/json_output_file.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_missing_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_diverse_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_known_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/inline_rules_fallback.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/improvement_gate_delta.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/file_output.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/rules_extraction.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/output_checks.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/benchmark_completed_boundary.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/setup-cp-sandbox.sh
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/legal_stop_gate_bundle.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/active_critic_overfit.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/skill_load_not_protocol.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/proposal_only_boundary.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/dual_report_and_remediation.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/contamination_gate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/mode_wiring_routing.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/d5_connectivity_hard_gate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/no_dimensions.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/plateau_detection.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/with_dimensions.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/full_setup.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/skill_benchmark.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/quick_reference.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/evaluation_policy.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/integration_scan.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/target_onboarding.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/model_benchmark.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/promotion_operations.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/loop_execution.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/optin_5dim_scorer.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/criteria_exec_gate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/reviewer_prompt_regression_fixtures.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/score_delta_benchmark_gates.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/default_pattern_scorer.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/mode_switch_routing.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/unknown_fallback.md
.opencode/skills/system-deep-loop/deep-improvement/README.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/missing_candidate.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dynamic_arbitrary.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dimension_details.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/any_agent.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/candidate_lineage.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/full_pipeline.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/trade_off_detection.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/two_phase_promotion_and_rollback.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/mutation_coverage_graph_tracking.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/without_integration.md
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/with_integration.md

exec
/bin/zsh -lc 'wc -l .opencode/skills/system-deep-loop/deep-improvement/SKILL.md .opencode/skills/system-deep-loop/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     339 .opencode/skills/system-deep-loop/deep-improvement/SKILL.md
     154 .opencode/skills/system-deep-loop/SKILL.md
     493 total

exec
/bin/zsh -lc "sed -n '181,360p' .opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "sed -n '181,360p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "sed -n '1,180p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
  - benchmark and refine a packaging
---

<!-- Keywords: deep-improvement, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

## 1. WHEN TO USE

### Three Co-Equal Lanes

This skill supports four co-equal use-case lanes that share the same candidate, dispatcher, and scorer seams:

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

**Lane awareness**: resources are organized by lane. `references/agent_improvement/` + `assets/agent_improvement/` carry Lane A guidance, `references/model_benchmark/` + `assets/model_benchmark/` carry Lane B guidance, and `references/skill_benchmark/` + `assets/skill_benchmark/` carry Lane C guidance.

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

exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
       (the 4 improvement modes all share the system-deep-loop/deep-improvement/ packet)
  → if registry[mode].runtimeLoopType !== null: backend = convergence.cjs --loop-type <runtimeLoopType>
     else: backend = improvement loop-host (--mode) or external adapter, per backendKind
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
- A new mode is needed beyond the eight registered — extend `mode-registry.json` and open a packet, do not bolt logic onto the hub.
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
/bin/zsh -lc "sed -n '1,120p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
  - benchmark and refine a packaging
---

<!-- Keywords: deep-improvement, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

## 1. WHEN TO USE

### Three Co-Equal Lanes

This skill supports four co-equal use-case lanes that share the same candidate, dispatcher, and scorer seams:

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

**Lane awareness**: resources are organized by lane. `references/agent_improvement/` + `assets/agent_improvement/` carry Lane A guidance, `references/model_benchmark/` + `assets/model_benchmark/` carry Lane B guidance, and `references/skill_benchmark/` + `assets/skill_benchmark/` carry Lane C guidance.

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

exec
/bin/zsh -lc "sed -n '121,240p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

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

exec
/bin/zsh -lc "sed -n '241,339p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'wc -l .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md .opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback_runbook.md .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/two_phase_promotion_and_rollback.md .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/promotion_gates.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     115 .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
     102 .opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
     144 .opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md
     126 .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
      47 .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
     323 .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
      85 .opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback_runbook.md
      60 .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/two_phase_promotion_and_rollback.md
      61 .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/promotion_gates.md
    1063 total

codex
The mode already has packet-local candidates, independent scoring, held-out checks, repeatability, Pareto blocking, and explicit promotion approval. The useful research boundary is narrower: evaluator immutability and secrecy, evidence from optimizer–grader collusion, staged exposure under real traffic, and evaluator diversification that the candidate cannot anticipate.
exec
/bin/zsh -lc "sed -n '1,400p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,400p' .opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,400p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Promotion Rules
description: Keep, reject, and guarded promotion rules for deep-improvement candidates.
trigger_phrases:
  - "promotion rules"
  - "keep vs reject candidate"
  - "promotion prerequisites"
  - "no-go conditions"
importance_tier: important
contextType: implementation
version: 1.17.0.14
---

# Promotion Rules

Policy reference for deciding whether a deep-improvement candidate stays baseline-only, is rejected, or becomes promotion-eligible. Use it when score and benchmark evidence exist and you need the decision rule, not just the raw metrics.

---

## 1. OVERVIEW

### Purpose

Defines the difference between an interesting candidate, an acceptable candidate, and a promotable candidate.

### When to Use

Use this reference when:
- Reviewing score and benchmark outputs
- Explaining why a candidate tied, lost, or won
- Checking whether promotion prerequisites are actually satisfied

### Core Principle

Promotion stays intentionally narrower than scoring and benchmarking. A candidate can be promising without being safe to promote.

---

## 2. CURRENT PROMOTION POSTURE

All agent targets are evaluated via dynamic mode. Promotion is a per-target decision made under dynamic mode; there are no static, automatically promotion-eligible profiles.

When promotion is enabled, the promotion script enforces the same gates in both callable phases:
- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
- a matching `benchmark-pass` report (when benchmarks are configured for the target)
- a passing repeatability report
- explicit operator approval plus manifest boundary enforcement for the specific target
- a hard repo-managed mirror sync gate when the target is an agent definition under `.opencode/agents/`, `.claude/agents/`, or `.opencode/agents/`

`--phase=accept` verifies those gates and snapshots the canonical preimage plus accepted candidate into the archive without mutating the canonical target. `--phase=ship` loads the accepted-state file, verifies that the canonical target still matches the accepted preimage, and then writes the accepted candidate snapshot. The legacy no-phase command still performs the previous guarded one-step promotion for existing callers.

The default branch preservation policy is `preserve-on-failure`. Under that policy, accept or ship gate failures emit `promotion_blocked_branch_preserved` to the configured event log and leave branch/candidate evidence intact.

---

## 3. KEEP VS REJECT

Keep the baseline when:
- the candidate score is lower
- the candidate violates the manifest
- the candidate only adds noise

Reject the candidate when:
- hard rejection conditions fire
- the run is an infra failure
- the candidate broadens scope

Prefer the candidate only when:
- the candidate score is higher
- no hard rejection condition fired
- the delta is meaningful

---

## 4. TIE-BREAK

When scores tie, prefer the simpler option:
- fewer instructions
- less duplication
- clearer file-reading contract
- narrower scope language

---

## 5. PROMOTION PREREQUISITES

Promotion is allowed only when:
- artifact-level fixtures exist (or are waived for the specific target)
- repeatability is proven for the active benchmark set
- rollback steps are documented
- accept/ship evidence is present when using the two-phase path
- the explicit approval gate is passed
- the target is not classified `fixed` or `forbidden` in the manifest
- agent-definition targets are present and content-aligned across both runtime mirrors (`.opencode/agents/`, `.claude/agents/`)

If mirror verification fails, promotion rejects with a structured `MIRROR_SYNC_GATE_FAILED` error. The optional promotion state file records `mirror_sync_state` as `all_landed`, `partial:<runtime-list>`, or `verification_failed`. Resume behavior defaults to rolling back partial mirror landings before another promotion attempt; operators may instead retry failed mirrors or pause for an explicit decision.

---

## 6. NO-GO CONDITIONS

Safety brakes that force the loop to stop or refuse broader rollout. Do not expand the loop beyond the current boundary when any of these are true:

- the scorer cannot reliably separate a weak candidate from the baseline
- the benchmark runner cannot produce stable scores across repeat runs
- promotion cannot be rolled back quickly
- runtime mirror drift is undocumented
- a second target lacks a deterministic or policy-stable evaluator
- the mutator and scorer boundaries blur
- canonical mutation happens without explicit approval
- ship attempts to write over a canonical target that no longer matches the accepted preimage
- benchmark evidence and mirror-sync evidence are being mixed together
- a profile exceeds the configured infra-failure or weak-benchmark limits
- all 5 evaluation dimensions have plateaued (3+ consecutive identical scores per dimension), indicating the loop has exhausted its current approach - stop and reassess the hypothesis or target

The reducer consumes these configured stop rules and marks the runtime `shouldStop` when the packet crosses them.

---

## 7. RELATED RESOURCES

- `../model_benchmark/evaluator_contract.md`
- `rollback_runbook.md`
- `../../scripts/shared/reduce-state.cjs`
- `../../scripts/shared/promote-candidate.cjs`
- `../../scripts/shared/rollback-candidate.cjs`

exec
/bin/zsh -lc "sed -n '1,400p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
4. **N-sample evidence.** Single runs are stochastic (teaching T4; one fixture swung 16 to 22 across runs). Held-out gating uses N >= 3 sample averages with all-samples pass semantics (`--samples` in Lane B, `LOOP_SAMPLES` in

## 3. GOLD-SET RULES

A gold set anchors the GRADER, not the proposer: a small output set with human-agreed target scores, re-scored whenever the grader model changes. Disagreement beyond ~2 of 25 (or 8 of 100) means recalibrate before trusting new grades. Keep gold outputs and target scores version-locked outside any tree a loop can write.

## 4. GRADER RULES (cross-reference)

- Hard rules (banned vocabulary, structural rules) are checked by **deterministic code linters**, never by a model.
- Grader replies follow a strict-JSON contract (single-line JSON, no fences); parsers stay tolerant and record explicit `grader_error` values — an auth failure must be diagnosable from the record, not parsed as a zero score (teaching T11).
- Probe provider auth with one minimal dispatch before any multi-dispatch batch; an expired credential must fail the batch in one probe, not N grading calls.

## 5. PHANTOM GAP

Wherever the system under test self-reports a score, record `self_score` vs the independent score and their gap per fixture (Lane B: `self_score_pattern` + `phantomGap` in the report; A widening gap is a reward-hacking signal and must surface as a warning, never be averaged away.

web search: 
web search: site:arxiv.org reward model overoptimization proxy reward gold reward Gao 2023 ...
web search: 
web search: 
web search: 
web search: 'stars'
web search: 
web search: site:github.com/openai/simple-evals GitHub simple evals stars ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:arxiv.org LLM judges adversarial attacks reward hacking evaluator optimization judge ensemble 2025 ...
web search: 
web search: "Turning Bias into Bugs" GitHub BITE LLM judges ...
web search: 
web search: https://github.com/xianglinyang/llm-as-a-judge-attack
web search: 
web search: 
codex
The strongest evidence is now consistent across three levels: fixed proxy rewards eventually diverge from gold reward under optimization; independent judge signals can be reverse-engineered or stylistically attacked; and conservative evaluator ensembles reduce overoptimization. I’m checking the shipped mode for exact missing seams so the recommendations land on real modules, not abstract policy.
exec
/bin/zsh -lc "rg -n -i \"same.family|different.family|cross.family\" .opencode/skills/system-deep-loop/deep-improvement --glob '"'!scripts/model-benchmark/scorer/cache/**'"' --glob '"'!benchmark/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/deep-improvement/README.md:120:Run `deep-improvement` when you want to prove an agent edit earned its place before you commit it. Run it when integration drift across runtime mirrors worries you and you need a scanner to find every surface. Run Lane B when a model or prompt framework needs benchmark comparison against repeatable fixtures. Run Lane C when a skill's routing accuracy or discoverability needs measurement. Run ai Project, native skill) needs guarded benchmark-and-refine against an independent different-family grader.
.opencode/skills/system-deep-loop/deep-improvement/README.md:168:A: Lane A improves a bounded agent `.md` file and writes packet-local candidates with five-dimension scores. Lane B benchmarks a model or prompt framework against repeatable fixtures. Lane C diagnoses a skill's routing, discovery, efficiency and usefulness without mutating the skill. All four share the same candidate, dispatcher and scorer seams.
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/model-family.cjs:3:// ║ model-family — different-family grader enforcement (anti-Goodhart T1/T3) ║
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/model-family.cjs:8: * Pilot teaching T1/T3 (spec 143): self-scores and same-family grading are the
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:40:- The grader must be a **different model family** from whatever produced the outputs (`scripts/shared/model-family.cjs`; Lane B refuses same-family LLM grading without `--allow-same-family`; the same kill-switch guard).
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md:48:- **Template bugs that only fire for the second packaging**: gauntlet A3's same-family grader is now constructed from `{{PROPOSER_FAMILY}}` instead of a hardcoded deepseek literal, and `check_convergence` honors the runtime `--max-iters` instead of the module constant. Both fixes mirrored into the live Copywriter and Barter deals instances.
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/anti-goodhart.vitest.ts:14:describe('model-family (T1/T3: different-family grader enforcement)', () => {
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:16:// Anti-Goodhart guards: different-family grader enforcement, N-sample
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:579:  const allowSameFamily = args['allow-same-family'] === true || args['allow-same-family'] === 'true';
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:582:    process.stderr.write('Usage: node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--output <path>] [--state-log <path>] [--label <string>] [--profiles-dir <path>] [--integration-report <path>] [--scorer pattern|5dim] [--grader noop|mock|llm] [--samples <n>] [--allow-same-family]\n');
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:619:          + 'Same-family grading is the score-inflation mechanism. Use a different-family grader or pass --allow-same-family to override explicitly.\n',
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:623:      graderIndependence = verdict.overridden ? 'overridden-same-family' : 'independent';
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:124:  'allow-same-family',

exec
/bin/zsh -lc "rg -n -i \"ensemble|worst.case|uncertainty.weight|judge.*disagree\" .opencode/skills/system-deep-loop/deep-improvement --glob '"'!scripts/model-benchmark/scorer/cache/**'"' --glob '"'!benchmark/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg -n -i \"shadow|canary|traffic|rollout\" .opencode/skills/system-deep-loop/deep-improvement --glob '"'!scripts/model-benchmark/scorer/cache/**'"' --glob '"'!benchmark/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md:110:- open-ended multi-target rollout
.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:57:- Mapping an orphan into an unrelated high-traffic intent just to make D5 green.
.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md:102:Safety brakes that force the loop to stop or refuse broader rollout. Do not expand the loop beyond the current boundary when any of these are true:

exec
/bin/zsh -lc "rg -n -i \"evaluator.*hash|grader.*hash|manifest.*hash|frozen evaluator|freeze.*evaluator\" .opencode/skills/system-deep-loop/deep-improvement --glob '"'!scripts/model-benchmark/scorer/cache/**'"' --glob '"'!benchmark/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:64:  const base = buildGraderBase({ variantHash: 'live', graderMode, cacheDir, dimId: 'D4' });
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:10: *   cache/grader/   Grader-call results (depend on rubric_version + grader_model_build_hash).
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:22: * Grader model build hash: hardcoded placeholder "claude-sonnet-4.6@2026-04-01" today.
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:52:const GRADER_MODEL_BUILD_HASH_PLACEHOLDER = 'claude-sonnet-4.6@2026-04-01';
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:100: * @param {string} [input.grader_model_build_hash] - Grader model build hash (defaults to placeholder).
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:109:  grader_model_build_hash,
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:121:      'derive_grader_key requires variant_hash, fixture_id, rubric_version, dim_id, swe16_output_hash'
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:124:  const buildHash = grader_model_build_hash || GRADER_MODEL_BUILD_HASH_PLACEHOLDER;
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:387:  GRADER_MODEL_BUILD_HASH_PLACEHOLDER,
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:367: * @param {string} [opts.grader_model_build_hash] - Grader model build hash for cache keying.
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:381:    grader_model_build_hash,
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:391:    grader_model_build_hash || '',
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:399:    grader_model_build_hash: graderBuildIdentity,
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:470:function buildGraderBase({ variantHash, graderMode, cacheDir, systemPromptPath, dimId }) {
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:474:    grader_model_build_hash: 'na',
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5cecfb73a67e5b6522e5992e8a1958d4.out.md:1:<!-- cache-meta {"kind":"grader","key":"5cecfb73a67e5b6522e5992e8a1958d4","created_at":"2026-07-08T16:44:05.496Z","dim_id":"D4","fixture_id":"fixture-edge","variant_hash":"360054ce8b88e786","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md:1:<!-- cache-meta {"kind":"grader","key":"c0470150d6f7383f350f17216a2fbb3a","created_at":"2026-07-09T17:05:57.195Z","dim_id":"D4-R","fixture_id":"SP-004#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/7fb218c8d070aa9e92bbda2b3bba94de.out.md:1:<!-- cache-meta {"kind":"grader","key":"7fb218c8d070aa9e92bbda2b3bba94de","created_at":"2026-06-15T14:24:23.887Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8e6d3962a346cf59796d3df172c3901b.out.md:1:<!-- cache-meta {"kind":"grader","key":"8e6d3962a346cf59796d3df172c3901b","created_at":"2026-06-15T14:24:23.881Z","dim_id":"D4","fixture_id":"CS-001#off","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/75692e98524c987bc724bd15f1268854.out.md:1:<!-- cache-meta {"kind":"grader","key":"75692e98524c987bc724bd15f1268854","created_at":"2026-07-11T14:13:35.835Z","dim_id":"D4","fixture_id":"fixture-baseline","variant_hash":"03d4867bff36a075","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/42840a5b34cdd91b3e2ff2d77184541e.out.md:1:<!-- cache-meta {"kind":"grader","key":"42840a5b34cdd91b3e2ff2d77184541e","created_at":"2026-06-15T14:24:23.879Z","dim_id":"D4","fixture_id":"CS-001#on","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4b7b4bbc6313c5e1c67711655e612a98.out.md:1:<!-- cache-meta {"kind":"grader","key":"4b7b4bbc6313c5e1c67711655e612a98","created_at":"2026-07-08T16:44:05.140Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md:1:<!-- cache-meta {"kind":"grader","key":"8429f8a8a9d13c87e2176d57a49648c5","created_at":"2026-07-09T17:06:44.706Z","dim_id":"D4-R","fixture_id":"SP-004#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/d0bc23dd3d54f9d0feef1727c1313afe.out.md:1:<!-- cache-meta {"kind":"grader","key":"d0bc23dd3d54f9d0feef1727c1313afe","created_at":"2026-07-08T16:44:05.098Z","dim_id":"D4","fixture_id":"CS-001#off","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8c2c8a1fd00f3af9daaef290f1be57ba.out.md:1:<!-- cache-meta {"kind":"grader","key":"8c2c8a1fd00f3af9daaef290f1be57ba","created_at":"2026-07-08T16:44:05.442Z","dim_id":"D4","fixture_id":"x","variant_hash":"h","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc53734e22ef097b18e31f94d61a003d.out.md:1:<!-- cache-meta {"kind":"grader","key":"fc53734e22ef097b18e31f94d61a003d","created_at":"2026-07-11T16:22:35.740Z","dim_id":"D4","fixture_id":"CS-001#off","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/df404b41b693fd90b7d2b2fb64d46d78.out.md:1:<!-- cache-meta {"kind":"grader","key":"df404b41b693fd90b7d2b2fb64d46d78","created_at":"2026-07-09T16:56:45.327Z","dim_id":"D4-R","fixture_id":"SP-001#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9f00e055438f4fb69c5a0bf926d25952.out.md:1:<!-- cache-meta {"kind":"grader","key":"9f00e055438f4fb69c5a0bf926d25952","created_at":"2026-07-11T14:13:36.101Z","dim_id":"D4","fixture_id":"x","variant_hash":"h","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/aac68b3316e3489dd0c4e9b5e367ddd5.out.md:1:<!-- cache-meta {"kind":"grader","key":"aac68b3316e3489dd0c4e9b5e367ddd5","created_at":"2026-07-11T16:22:35.795Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/dbd80958bc81ecc2c9c947d3db67f510.out.md:1:<!-- cache-meta {"kind":"grader","key":"dbd80958bc81ecc2c9c947d3db67f510","created_at":"2026-06-15T15:07:09.255Z","dim_id":"D4","fixture_id":"fixture-improved","variant_hash":"5b4ea0af1247e1ec","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/a59863e9ad0f70d9bf39a3b3e7d3ec2b.out.md:1:<!-- cache-meta {"kind":"grader","key":"a59863e9ad0f70d9bf39a3b3e7d3ec2b","created_at":"2026-06-15T15:07:09.384Z","dim_id":"D4","fixture_id":"x","variant_hash":"h","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5fe47aad8aacf44314f494ab0add2dec.out.md:1:<!-- cache-meta {"kind":"grader","key":"5fe47aad8aacf44314f494ab0add2dec","created_at":"2026-07-08T16:44:05.319Z","dim_id":"D4","fixture_id":"fixture-improved","variant_hash":"5b4ea0af1247e1ec","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md:1:<!-- cache-meta {"kind":"grader","key":"5036729e69ce24c3ba32d9bf748e6152","created_at":"2026-07-09T16:59:33.152Z","dim_id":"D4-R","fixture_id":"SP-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f4b6ea7a34706c73189ac821c6ec177d.out.md:1:<!-- cache-meta {"kind":"grader","key":"f4b6ea7a34706c73189ac821c6ec177d","created_at":"2026-07-08T16:44:05.141Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/22c1faa7c45013e9fdfb6ce5ecf929d1.out.md:1:<!-- cache-meta {"kind":"grader","key":"22c1faa7c45013e9fdfb6ce5ecf929d1","created_at":"2026-07-08T16:44:05.157Z","dim_id":"D4","fixture_id":"fixture-baseline","variant_hash":"03d4867bff36a075","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md:1:<!-- cache-meta {"kind":"grader","key":"8f1323b05b3fd805dc519983d68b2e9d","created_at":"2026-07-09T17:02:45.940Z","dim_id":"D4-R","fixture_id":"SP-003#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc10907e5828f4c8b642f4557d6c0675.out.md:1:<!-- cache-meta {"kind":"grader","key":"fc10907e5828f4c8b642f4557d6c0675","created_at":"2026-07-11T16:22:35.737Z","dim_id":"D4","fixture_id":"CS-001#on","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f2f2dd71f2533dd8cb3665d0857b8a02.out.md:1:<!-- cache-meta {"kind":"grader","key":"f2f2dd71f2533dd8cb3665d0857b8a02","created_at":"2026-07-11T14:13:36.145Z","dim_id":"D4","fixture_id":"fixture-edge","variant_hash":"360054ce8b88e786","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4d1138ca8c23389ecdf84767e8691348.out.md:1:<!-- cache-meta {"kind":"grader","key":"4d1138ca8c23389ecdf84767e8691348","created_at":"2026-07-08T16:44:05.095Z","dim_id":"D4","fixture_id":"CS-001#on","variant_hash":"live","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/720c3c2f773829e2d75f3c4cf1c9cc36.out.md:1:<!-- cache-meta {"kind":"grader","key":"720c3c2f773829e2d75f3c4cf1c9cc36","created_at":"2026-06-15T15:07:09.001Z","dim_id":"D4","fixture_id":"fixture-baseline","variant_hash":"03d4867bff36a075","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/cbbeff1caf82bd3a1e002bbd22377b43.out.md:1:<!-- cache-meta {"kind":"grader","key":"cbbeff1caf82bd3a1e002bbd22377b43","created_at":"2026-07-09T16:56:09.228Z","dim_id":"D4-R","fixture_id":"SP-001#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/ea2a6323ff8b607dea081c14ae4fd24b.out.md:1:<!-- cache-meta {"kind":"grader","key":"ea2a6323ff8b607dea081c14ae4fd24b","created_at":"2026-07-11T14:13:35.999Z","dim_id":"D4","fixture_id":"fixture-improved","variant_hash":"5b4ea0af1247e1ec","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9c562e7eb6d90a65972bc75282b09770.out.md:1:<!-- cache-meta {"kind":"grader","key":"9c562e7eb6d90a65972bc75282b09770","created_at":"2026-06-15T14:24:23.886Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#on","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9a38a58ebffba2c0a5e87918261d9afb.out.md:1:<!-- cache-meta {"kind":"grader","key":"9a38a58ebffba2c0a5e87918261d9afb","created_at":"2026-07-11T16:22:35.796Z","dim_id":"D4-R","fixture_id":"LS-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/0115576e1e7be786962398431c973dd9.out.md:1:<!-- cache-meta {"kind":"grader","key":"0115576e1e7be786962398431c973dd9","created_at":"2026-07-09T16:59:57.764Z","dim_id":"D4-R","fixture_id":"SP-002#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/362330146b11be4e9ed0d522cc7b7a9f.out.md:1:<!-- cache-meta {"kind":"grader","key":"362330146b11be4e9ed0d522cc7b7a9f","created_at":"2026-06-15T15:07:09.486Z","dim_id":"D4","fixture_id":"fixture-edge","variant_hash":"360054ce8b88e786","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"ok"} -->
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/e5706bc35dabb7584b4563c9d5b2bd42.out.md:1:<!-- cache-meta {"kind":"grader","key":"e5706bc35dabb7584b4563c9d5b2bd42","created_at":"2026-07-09T17:03:14.530Z","dim_id":"D4-R","fixture_id":"SP-003#taskoutcome#off","variant_hash":"live-d4r","rubric_version":"v1.0.0","grader_model":"claude-sonnet-4-5","parse_status":"fallback_fenced"} -->

exec
/bin/zsh -lc "rg -n -i \"held.out|gold set|hidden fixture|unpublished seeds\" .opencode/skills/system-deep-loop/deep-improvement --glob '"'!scripts/model-benchmark/scorer/cache/**'"' --glob '"'!benchmark/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md:49:| `fixtures/<skill-id>/<id>.private.json` | The held-out gold for the same scenario: `expected` labels (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`) and a `rubric` of usefulness / harm checks. |
.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:888:Expected signals: dry-run exits 0 with gap analysis and zero dispatches; gauntlet exits 0 with `GAUNTLET: 10/10 passed`; live run exits 0 with `event: "promote_accept"` in the loop journal and held-out independent grade at or above baseline.
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.0.0.md:35:- Synthetic-deficit live run journals a `promote_accept` and restores the independent grade to baseline on held-out fixtures.
.md:92:Single runs are stochastic (teaching T4). Held-out gating uses N >= 3 sample averages with all-samples pass semantics. The `--samples` flag (forwarded to `LOOP_SAMPLES` by the
.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md:470:Runs the packaging-owned 7-phase guarded loop (preflight gates, N-sample benchmark, gap analysis, worktree, held-out baseline, propose, guarded promote-N) with dry-run as the default and independent-grade optimization as the only target.
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md:50:- **Loop efficiency (Fable)**: the held-out baseline is measured once per session and cached (only when measurable), and the first accepted promotion ends the session (`promotedStop`, canonical `converged`) - at most one kept worktree per run, no burned dispatches re-sampling unchanged HEAD.
.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md:51:- **Kill-switch taxonomy corrected everywhere**: hard halts (frozen-surface drift, derivation drift, candidate held-out HVR violation, grader family, lock) vs promote_reject-and-continue (floor breach, held-out regression) - loop_contract, operator_guide, catalog, grader_calibration and the template docstring all now match the code.
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md:18:`benchmark-fixtures/` holds the JSON fixtures a sweep scores. Each coding-task fixture names a function (`fn_name`), states the task, and carries `tests[]` (visible) + `hidden_tests[]` (held-out adversarial) oracle cases of the form `{name, args[], expect}`. `code-task-scorer.cjs` extracts the model's function, runs every oracle case in an isolated child process, and returns a `correctness_pass_rate` fraction — so "mostly right" separates from "fully right" instead of pass/fail.
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:2:title: Held-Out and Gold Sets
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:3:description: Shared evaluation convention for visible, held-out, and gold fixture tiers that keeps deep-improvement promotion evidence honest across lanes.
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:5:  - "held-out and gold sets"
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:7:  - "gold set calibration"
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:8:  - "held-out non-regression"
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:15:# Held-Out and Gold Sets - Shared Evaluation Convention
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:24:| **Held-out** | grader only | promotion gates | the proposer NEVER sees ids, prompts or seeds; promotion requires non-regression here, not on visible fixtures |
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:27:## 2. HELD-OUT RULES
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:29:1. **Gradeable, always.** Every held-out fixture must produce a delimited deliverable (`<DELIVERABLE>` contract). Interactive fixtures that answer with a clarifying question are ungradeable and turn into false gate failures (teaching T6). Gate lists with `scripts/shared/fixture-lint.cjs` before any paid dispatch.
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:30:2. **Dimension-sensitive.** Prefer held-out fixtures that are maximally sensitive to the dimensions being optimized (the pilot's stat-centric fixture collapsed under a no-stats deficit, which is exactly what made its signal decisive).
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:31:3. **Unpublished seeds.** Adversarial seeds and expected answers must not live in files the proposer reads. If a fixture's tricks are enumerated in-repo, it is a visible fixture by definition.
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:32:4. **N-sample evidence.** Single runs are stochastic (teaching T4; one fixture swung 16 to 22 across runs). Held-out gating uses N >= 3 sample averages with all-samples pass semantics (`--samples` in Lane B, `LOOP_SAMPLES` in
.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:36:A gold set anchors the GRADER, not the proposer: a small output set with human-agreed target scores, re-scored whenever the grader model changes. Disagreement beyond ~2 of 25 (or 8 of 100) means recalibrate before trusting new grades. Keep gold outputs and target scores version-locked outside any tree a loop can write.
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs:8: * Pilot teaching T6 (spec 143): a held-out fixture that answers with a
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs:13: * from held-out sets BEFORE any paid dispatch.
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs:26: * lint can gate held-out lists in CI and loop pre-flights).
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs:64:    process.stderr.write(`fixture-lint: ${bad.length} fixture(s) not gradeable (${bad.map((b) => `${b.id}:${b.classification}`).join(', ')}) — interactive or uncontracted fixtures must not be used as held-out gates (spec 143 T6)\n`);
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:264:        'held-out': 'LOOP_HELD_OUT',
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:27: *        [--held-out=<a,b>] [--samples=<n>] [--proposer-model=<id>] [--grader-model=<id>]
.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:90:  'held-out',
.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md:66:Use `tests` for visible calibration cases and `hidden_tests` for held-out oracle cases. Each case may override `input`, `input_kind`, `expectedVerdict`, `expectedFindings`, and `reviewer_output`.
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts:253:      // Held-out cases dominate so a model cannot pattern-match the prompt examples.
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts:329:      // Held-out cases dominate so a model cannot pattern-match the prompt examples.
.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:302: * The oracle is the fixture's visible `tests` PLUS any `hidden_tests` (held-out,

exec
 succeeded in 0ms:
    70	  --packaging-root "/path/to/Copywriter" --live --max-iters 1 \
    71	  --fixtures T1-write --variants project --held-out T7-stat --samples 3
    72	```
    73	
    74	---
    75	
    76	## 4. NON-NEGOTIABLE GUARDRAILS (COUNCIL-DERIVED)
    77	
    78	1. **Frozen scoring surface.** The rubric, floors and hard-blocker rules the grader scores against are content-hashed (`benchmark/_gates/`). The proposer may only edit technique docs. Any diff to the frozen region halts the loop (the optimizer must never write its own ruler).
    79	2. **Independent different-family grader.** The blind re-grader must not share a model family with the proposer (the loop refuses, e.g. a deepseek grader for a deepseek proposer). The packaging's hard rules are checked by a deterministic code linter, never by a model.
    80	3. **Held-out promotion gate.** Candidates are accepted only on non-regression of the independent grade on held-out fixtures the proposer never sees, measured against a pre-edit baseline in the same worktree. The baseline is measured once per session and reused for later iterations (HEAD cannot change mid-run, so re-measuring it would burn dispatches for no new signal); candidate measurements are always fresh. Held-out fixtures must produce gradeable deliverables (interactive fixtures that answer with a question cannot be graded).
    81	4. **N-sample averaging.** Single benchmark runs are stochastic (the pilot saw one fixture swing 16 to 22 independent across runs). Targeting and promotion use `LOOP_SAMPLES` (default 3) averaged grades.
    82	5. **Worktree isolation, always cleaned.** Edits happen in a worktree detached at HEAD (`loop.py --run` refuses a dirty source tree, including uncommitted edits to symlinked shared-global docs). Accepted candidates stay in their kept worktree (detached at the candidate state) for deliberate operator merge; rejected ones are removed, including on kill-switch exits. The first accepted promotion ends the session (`promotedStop`, canonical `converged`, with the kept-worktree path printed and journaled) — further iterations would re-sample unchanged HEAD and could never observe the kept improvement, so at most one worktree is kept per run.
    83	6. **Resume + observability.** Every per-sample grade is journaled; a killed run resumes from its journal (grade reuse is guarded by a config hash + the packaging HEAD sha; candidate-phase grades are never reused). Held-out gating uses N-sample averages with all-samples pass semantics for floors and the hard-rule linter. Stop reasons map onto the deep-improvement journal taxonomy (`converged`, `blockedStop`, `stuckRecovery`, `error`, ...).
    84	
    85	Kill-switches that halt without promoting: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure on graded output, new floor breach, held-out regression (or improvement below `LOOP_ACCEPT_MARGIN`), iteration ceiling, and a concurrent-run lock (single writer; stale locks from dead runs are evicted).
    86	
    87	---
    88	
    89	## 5. ONBOARDING A NEW PACKAGING (SCAFFOLDER)
    90	

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs | sed -n '1,65p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ cache.cjs — atomic append-only cache layer for the eval pipeline          ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	/**
     7	 * Atomic, append-only cache layer for the eval-rig pipeline.
     8	 * Two cache kinds live side by side under cache/:
     9	 *   cache/det/      Deterministic check results (regex-checkable; grader-independent).
    10	 *   cache/grader/   Grader-call results (depend on rubric_version + grader_model_build_hash).
    11	 *
    12	 * Storage model:
    13	 *   cache/<kind>/index.jsonl        Append-only index, one JSON row per entry.
    14	 *   cache/<kind>/<key>.out.md       Atomic blob storage (temp+rename), one file per key.
    15	 *
    16	 * Concurrency model:
    17	 *   cache/<kind>/.lock-<key>/       Mkdir-based advisory lock; POSIX atomic mkdir.
    18	 *                                    5-minute TTL stale-lock auto-clear.
    19	 *
    20	 * Cache keys are 32-char SHA-256 hex prefixes derived from canonicalized input bundles.
    21	 *
    22	 * Grader model build hash: hardcoded placeholder "claude-sonnet-4.6@2026-04-01" today.
    23	 * TODO: replace with the real API model-version header captured at dispatch time
    24	 *       (read from response headers when the grader call lands).
    25	 *
    26	 * The cache root is run-scoped. write_atomic / read / cache_hit / read_index /
    27	 * rebuild_index accept an optional final cacheRoot argument. When omitted they
    28	 * fall back to the legacy in-repo CACHE_ROOT so existing callers keep working,
    29	 * but run-scoped callers (the grader harness) pass a per-run outputs directory
    30	 * instead of writing into a shared in-repo location that is trusted on the
    31	 * cache-hit path.
    32	 */
    33	
    34	// ─────────────────────────────────────────────────────────────────────────────
    35	// 1. IMPORTS/REQUIRES
    36	// ─────────────────────────────────────────────────────────────────────────────
    37	
    38	const fs = require('fs');
    39	const path = require('path');
    40	const crypto = require('crypto');
    41	
    42	// ─────────────────────────────────────────────────────────────────────────────
    43	// 2. CONSTANTS
    44	// ─────────────────────────────────────────────────────────────────────────────
    45	
    46	const PACKET_ROOT = path.resolve(__dirname, '..');
    47	const CACHE_ROOT = path.join(PACKET_ROOT, 'cache');
    48	const VALID_KINDS = new Set(['det', 'grader']);
    49	const LOCK_TTL_MS = 5 * 60 * 1000;
    50	const LOCK_RETRY_INTERVAL_MS = 50;
    51	const LOCK_WAIT_MAX_MS = 5 * 60 * 1000;
    52	const GRADER_MODEL_BUILD_HASH_PLACEHOLDER = 'claude-sonnet-4.6@2026-04-01';
    53	
    54	// ─────────────────────────────────────────────────────────────────────────────
    55	// 3. HELPERS
    56	// ─────────────────────────────────────────────────────────────────────────────
    57	
    58	function sha256Hex(input) {
    59	  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
    60	}
    61	
    62	function canonicalConcat(parts) {
    63	  // Pipe-delimited canonical concatenation; pipes inside parts are escaped.
    64	  return parts
    65	    .map((p) => String(p === undefined || p === null ? '' : p).replace(/\|/g, '\\|'))

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md | sed -n '30,60p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    30	- Explaining why a candidate tied, lost, or won
    31	- Checking whether promotion prerequisites are actually satisfied
    32	
    33	### Core Principle
    34	
    35	Promotion stays intentionally narrower than scoring and benchmarking. A candidate can be promising without being safe to promote.
    36	
    37	---
    38	
    39	## 2. CURRENT PROMOTION POSTURE
    40	
    41	All agent targets are evaluated via dynamic mode. Promotion is a per-target decision made under dynamic mode; there are no static, automatically promotion-eligible profiles.
    42	
    43	When promotion is enabled, the promotion script enforces the same gates in both callable phases:
    44	- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
    45	- a matching `benchmark-pass` report (when benchmarks are configured for the target)
    46	- a passing repeatability report
    47	- explicit operator approval plus manifest boundary enforcement for the specific target
    48	- a hard repo-managed mirror sync gate when the target is an agent definition under `.opencode/agents/`, `.claude/agents/`, or `.opencode/agents/`
    49	
    50	`--phase=accept` verifies those gates and snapshots the canonical preimage plus accepted candidate into the archive without mutating the canonical target. `--phase=ship` loads the accepted-state file, verifies that the canonical target still matches the accepted preimage, and then writes the accepted candidate snapshot. The legacy no-phase command still performs the previous guarded one-step promotion for existing callers.
    51	
    52	The default branch preservation policy is `preserve-on-failure`. Under that policy, accept or ship gate failures emit `promotion_blocked_branch_preserved` to the configured event log and leave branch/candidate evidence intact.
    53	
    54	---
    55	
    56	## 3. KEEP VS REJECT
    57	
    58	Keep the baseline when:
    59	- the candidate score is lower
    60	- the candidate violates the manifest

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md | sed -n '12,46p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    12	version: 1.17.0.2
    13	---
    14	
    15	# Held-Out and Gold Sets - Shared Evaluation Convention
    16	
    17	The pilot behind spec 143 proved two things about benchmark-driven improvement: self-reported scores inflate (~+6/25 measured against independent graders) and proposers overfit any fixture they can read (the pilot's adversarial fixture published its own seeds in-repo). This convention is how every deep-improvement lane keeps its evidence honest. It applies to Lane B profiles and any future loop that promotes on benchmark evidence.
    18	
    19	## 1. THE THREE FIXTURE TIERS
    20	
    21	| Tier | Who sees it | Used for | Rules |
    22	|---|---|---|---|
    23	| **Visible** | proposer + grader | gap analysis, iteration targeting | may be discussed in prompts and journals |
    24	| **Held-out** | grader only | promotion gates | the proposer NEVER sees ids, prompts or seeds; promotion requires non-regression here, not on visible fixtures |
    25	| **Gold** (optional) | humans + grader | grader calibration | human-anchored target scores, version-locked; never optimized against |
    26	
    27	## 2. HELD-OUT RULES
    28	
    29	1. **Gradeable, always.** Every held-out fixture must produce a delimited deliverable (`<DELIVERABLE>` contract). Interactive fixtures that answer with a clarifying question are ungradeable and turn into false gate failures (teaching T6). Gate lists with `scripts/shared/fixture-lint.cjs` before any paid dispatch.
    30	2. **Dimension-sensitive.** Prefer held-out fixtures that are maximally sensitive to the dimensions being optimized (the pilot's stat-centric fixture collapsed under a no-stats deficit, which is exactly what made its signal decisive).
    31	3. **Unpublished seeds.** Adversarial seeds and expected answers must not live in files the proposer reads. If a fixture's tricks are enumerated in-repo, it is a visible fixture by definition.
32	4. **N-sample evidence.** Single runs are stochastic (teaching T4; one fixture swung 16 to 22 across runs). Held-out gating uses N >= 3 sample averages with all-samples pass semantics (`--samples` in Lane B, `LOOP_SAMPLES` in
    33	
    34	## 3. GOLD-SET RULES
    35	
    36	A gold set anchors the GRADER, not the proposer: a small output set with human-agreed target scores, re-scored whenever the grader model changes. Disagreement beyond ~2 of 25 (or 8 of 100) means recalibrate before trusting new grades. Keep gold outputs and target scores version-locked outside any tree a loop can write.
    37	
    38	## 4. GRADER RULES (cross-reference)
    39	
    40	- The grader must be a **different model family** from whatever produced the outputs (`scripts/shared/model-family.cjs`; Lane B refuses same-family LLM grading without `--allow-same-family`; the same kill-switch guard).
    41	- Hard rules (banned vocabulary, structural rules) are checked by **deterministic code linters**, never by a model.
    42	- Grader replies follow a strict-JSON contract (single-line JSON, no fences); parsers stay tolerant and record explicit `grader_error` values — an auth failure must be diagnosable from the record, not parsed as a zero score (teaching T11).
    43	- Probe provider auth with one minimal dispatch before any multi-dispatch batch; an expired credential must fail the batch in one probe, not N grading calls.
    44	
    45	## 5. PHANTOM GAP
    46	

web search: 
web search: site:argo-rollouts.readthedocs.io AnalysisTemplate successfulRunHistoryLimit failureLimit canary steps mirror traffic Argo Rollouts ...
codex
The moat is not “better self-editing.” It is an epistemic firewall around improvement: mutate one bounded surface, judge it with a precommitted ruler the mutator cannot alter, retain the baseline, and require causal evidence before exposure.

The current implementation is close, but uneven.md:76>)). The shared held-out convention currently names Lane B, however, while Lane A’s evaluator is dynamically derived and Lane C is diagnostic ([held-out convention](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md:15>)). Promotion is still `accept → ship`, with no behavior-shadow or canary stage ([promotion rules](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md:39>)), and the benchmark cache still substitutes a hardcoded grader-build placeholder ([cache.cjs](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:20>)).

Three findings sharpen the design.

1. External evaluation is necessary, but a single frozen proxy is insufficient. Intrinsic self-correction can degrade reasoning without external feedback ([Huang et al.](https://arxiv.org/abs/2310.01798)), while continued optimization against a fixed proxy eventually raises proxy reward while lowering gold reward ([Gao et al.](https://arxiv.org/abs/2210.10760)). Freeze therefore means “fixed during this comparison,” not “trusted forever.”  
   Maps: `deep-improvement`, `runtime/convergence`.

2. Evaluator access itself is a capability. BITE learns semantics-preserving judge exploits through black-box queries and reports over 65% attack success with 1–2 point gains on a nine-point scale ([paper](https://arxiv.org/abs/2605.26156)); judge preferences can also be reverse-engineered and transferred to unseen judges ([NeurIPS 2025](https://papers.nips.cc/paper_files/paper/2025/hash/92a4d7a222ae16d4fbad90ef7743d5e0-Abstract-Conference.html)). A hash prevents rewriting, but not oracle extraction. Hidden promotion evaluation needs query budgets, delayed/coarse disclosure, and process-level unreadability.  
   Maps: `deep-improvement`, `runtime/budget-cost`, `runtime/state-jsonl-checkpointing`.

3. Promotion should be progressive delivery. Argo’s model separates mirrored traffic, baseline/canary experiments, analysis results, pauses, inconclusive states, promotion, and automatic abort ([analysis](https://argo-rollouts.readthedocs.io/en/stable/features/analysis/), [traffic mirroring](https://argo-rollouts.readthedocs.io/en/stable/features/traffic-management/)). For agents, “shadow” means paired replay of redacted real tasks with candidate outputs discarded; live canarying is optional and only valid behind a reversible routing adapter.  
   Maps: `deep-improvement`, `runtime/gauges-observability`, `runtime/locks-recovery`, `runtime/state-jsonl-checkpointing`.

The uniqueness-sharpening implementation is an `EvaluatorCapsule` committed before candidate generation:

```text
EvaluatorCapsule {
  epochId,
  evaluatorTreeHash,
  rubricHash,
  hiddenSetCommitment,
  goldSetHash,
  judgeBuildIds[],
  aggregationPolicyHash,
  candidateReadablePaths[],
  maxPromotionQueries
}
```

Every evaluation emits a signed receipt binding capsule, baseline, candidate, and run hashes. The proposer receives visible-fixture detail, but hidden promotion evaluation returns only gate outcomes and coarse dimension bands. Promotion uses deterministic anchors plus diverse judges; for safety dimensions require `min_j LCB(delta_j) >= 0`, use uncertainty-weighted aggregation for softer utility, and return `inconclusive` when disagreement exceeds its calibrated ceiling. Conservative reward-model ensembles have direct evidence for reducing overoptimization; mean aggregation is not the safe default ([Coste et al.](https://arxiv.org/abs/2310.02743)).

The resulting state machine should be `propose → accept-offline → shadow → canary → ship`, with automatic rollback to the recorded baseline hash. This is what the other modes cannot supply: research finds evidence, review finds faults, council deliberates, and alignment measures conformance; only deep-improvement can turn a bounded mutation into a reversible, experimentally warranted promotion decision.

```json
{
  "new_repos": [
    {
      "name": "xianglinyang/llm-as-a-judge-attack",
      "url": "https://github.com/xianglinyang/llm-as-a-judge-attack",
      "stars": "~2",
      "what": "May 2026 BITE implementation; src/evolve_agent/bandit/UCB performs budgeted black-box judge exploitation, with transferability and detection notebooks.",
      "lesson": "Treat exact evaluator feedback as an attack surface: budget hidden-eval queries and run semantics-preserving score-inflation attacks before promotion.",
      "maps_to": ["deep-improvement", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "tlc4418/llm_optimization",
      "url": "https://github.com/tlc4418/llm_optimization",
      "stars": "~49",
      "what": "ICLR 2024 reference code with six commits and no releases; src/bon/run_bon_pipeline.py and PPO configs implement individual, mean, WCO, and UWO reward-model evaluation.",
      "lesson": "Fan out to diverse evaluators and promote on a conservative lower bound or uncertainty-weighted objective, not one judge or an unqualified mean.",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "argoproj/argo-rollouts",
      "url": "https://github.com/argoproj/argo-rollouts",
      "stars": "~3.5k",
      "what": "Active progressive-delivery controller; v1.9.0 released March 20, 2026, with AnalysisTemplate, Experiment, traffic mirroring, pauses, inconclusive states, promotion, and abort.",
      "lesson": "Extend accept/ship into shadow/canary/ship stages whose analysis receipts can pause, promote, or restore the stable baseline automatically.",
      "maps_to": ["deep-improvement", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability", "runtime/locks-recovery"],
      "confidence": "high"
    },
    {
      "name": "Giskard-AI/giskard-oss",
      "url": "https://github.com/Giskard-AI/giskard-oss",
      "stars": "~5.5k",
      "what": "Active agent-evaluation repository; giskard-scan v1.0.0b3 released July 13, 2026, with Scenario checks, multi-turn testing, vulnerability_scan, and an extensible scenario-generator registry.",
      "lesson": "Generate adversarial evaluator canaries from the target description, validate them against known-good and known-bad outputs, then freeze that generated suite for the evaluation epoch.",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A frozen evaluator is an experiment-scoped commitment, not a permanently trustworthy objective: re-baseline both candidate and baseline whenever an evaluator epoch changes.",
      "evidence": "https://arxiv.org/abs/2210.10760",
      "maps_to": ["deep-improvement", "runtime/convergence", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Evaluator secrecy and query control are separate from evaluator immutability; repeated scalar feedback can reveal exploitable judge preferences without any evaluator write access.",
      "evidence": "https://arxiv.org/abs/2605.26156",
      "maps_to": ["deep-improvement", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Require conservative cross-family judge agreement plus deterministic anchors; diverse reward-model ensembles using worst-case or uncertainty-weighted objectives reduce proxy overoptimization.",
      "evidence": "https://arxiv.org/abs/2310.02743",
      "maps_to": ["deep-improvement", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "The evaluator must be outside the mutable genome at the capability level, because models trained on specification gaming have generalized to modifying rewards and tests directly.",
      "evidence": "https://arxiv.org/abs/2406.10162",
      "maps_to": ["deep-improvement", "runtime/locks-recovery", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Promotion is a deployment experiment rather than a file-copy decision: shadow evidence and bounded canary exposure measure behavior on the operating distribution while preserving a stable rollback target.",
      "evidence": "https://argo-rollouts.readthedocs.io/en/stable/features/analysis/",
      "maps_to": ["deep-improvement", "runtime/gauges-observability", "runtime/locks-recovery"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a lane-independent EvaluatorCapsule created before candidate generation. Hash evaluator code, rubric, real judge build identifiers, aggregation policy, gold anchors, and a commitment to hidden fixtures; record the capsule in session_start and require a matching signed EvalReceipt at every promotion gate. Run the evaluator in a separate capability boundary, expose no hidden paths, and cap promotion-oracle queries per candidate.",
      "target": "deep-improvement + runtime/state-jsonl-checkpointing + runtime/budget-cost",
      "uniqueness": "This makes deep-improvement the only mode that commits the ruler before proposing a mutation and can prove that the mutation never controlled or inspected its promotion oracle.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2406.10162"
    },
    {
      "rec": "Add an adversarial conservative evaluator quorum for finalists: deterministic executable anchors first, then at least two provider/family-diverse judges and one attack lane. Require non-negative per-judge lower confidence bounds on safety dimensions, use uncertainty-weighted aggregation for utility, and return inconclusive on excessive disagreement. Run BITE-style semantic-preserving edits and generated Giskard scenarios against the evaluator capsule; refresh attacks only between frozen epochs.",
      "target": "deep-improvement + runtime/fan-out-fan-in + runtime/gauges-observability",
      "rationale": "Different-family grading removes one correlation but does not prevent transferable style attacks or shared judge biases. Conservative aggregation and adversarial meta-evaluation make disagreement and evaluator fragility promotion blockers.",
      "uniqueness": "The mode improves not only the candidate but the credibility of the evidence authorizing promotion, while keeping evaluator evolution temporally separated from candidate optimization.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2310.02743; https://arxiv.org/abs/2605.26156"
    },
    {
      "rec": "Extend promote-candidate from accept/ship to accept-offline/shadow/canary/ship. Shadow runs paired baseline and candidate on redacted trace snapshots with candidate outputs discarded. Canary adapters expose 1%, 5%, then 20% of eligible traffic with pauses and automatically restore the baseline on a hard-rule failure, negative evaluator lower bound, cost ceiling, or error-rate regression. Journal only trace references, hashes, metrics, and stage decisions.",
      "target": "deep-improvement + runtime/state-jsonl-checkpointing + runtime/gauges-observability + runtime/locks-recovery",
      "rationale": "Offline fixtures cannot prove compatibility with the operating distribution. Progressive exposure supplies paired downstream evidence while limiting blast radius and preserving deterministic rollback.",
      "uniqueness": "This turns deep-improvement from guarded prompt editing into a progressive-delivery controller for agent behavior, a capability absent from research, review, council, and alignment modes.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://argo-rollouts.readthedocs.io/en/stable/features/traffic-management/"
    }
  ],
  "contradictions": [
    {
      "claim": "Freezing one evaluator is sufficient to prevent reward hacking.",
      "counter": "Black-box bandit optimization can discover semantics-preserving score exploits, and preference attacks can transfer to judges not used during optimization; freezing must be combined with query control, evaluator diversity, adversarial canaries, and periodic human-authorized epoch rotation.",
      "evidence": "https://arxiv.org/abs/2605.26156; https://papers.nips.cc/paper_files/paper/2025/hash/92a4d7a222ae16d4fbad90ef7743d5e0-Abstract-Conference.html"
    },
    {
      "claim": "A rising aggregate evaluator score proves the candidate is improving.",
      "counter": "Proxy reward can continue rising after gold reward peaks and declines; conservative ensemble objectives mitigate this better than single-proxy optimization.",
      "evidence": "https://arxiv.org/abs/2210.10760; https://arxiv.org/abs/2310.02743"
    }
  ],
  "next_angles": [
    "Build an evaluator-oracle leakage benchmark: vary exact-score visibility, dimension-level feedback, pass/fail-only receipts, query budgets, and cross-candidate memory; measure how quickly a BITE-like optimizer learns promotion exploits.",
    "Specify and attack-test the EvaluatorCapsule capability boundary: hidden fixture storage, judge credentials, grader prompts, cache contents, logs, environment variables, side channels, and signed receipt verification.",
    "Measure whether offline held-out, shadow replay, and limited live canary deltas predict post-ship correctness, cost, and rollback rates across heterogeneous agent workloads."
  ],
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
201,308
