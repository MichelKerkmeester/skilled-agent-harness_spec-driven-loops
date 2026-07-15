<!-- iteration 18 | SOL xhigh | mode: deep-improvement | angle: A3-mech deep-improvement :: mechanisms & reference impls | 2026-07-15T09:30:24.910Z -->

Iteration 18 verdict: deep-improvement already has a strong rubric and two-phase promotion contract. The remaining leverage is to turn evaluation into an evidence-preserving transaction: immutable raw trials, calibrated reductions, blind comparison, metamorphic relations, and a post-accept shadow state.

### Mechanisms worth adopting

1. **Separate observations from score reduction.** [Waza’s grader interface](https://github.com/microsoft/waza/blob/main/internal/graders/grader.go) receives captured transcripts, workspace files, session digests, skill invocations, and baseline output. [Autoevals](https://github.com/braintrustdata/autoevals) similarly distinguishes normalized scores from evaluator metadata and rationale. Deep-improvement should expose three APIs:

   `grade(runReceipt) -> TrialScore[]`  
   `reduce(trials, calibrationVersion) -> ScoreView`  
   `decide(scoreView, gatePolicy) -> PromotionReceipt`

   `TrialScore` should retain candidate/evaluator digests, fixture commitment, seed, judge family, dimension, raw value and scale, rationale digest, normalized value, calibration version, cost, and latency. Never round before persistence.

   Calibrate ordinal judge outputs against gold anchors using versioned isotonic mappings. Compute candidate-versus-baseline deltas with paired fixture bootstrap. Promotion should require non-negative lower bounds on critical dimensions; the weighted aggregate becomes a ranking display, not an escape hatch for a failed dimension.

2. **Blind the comparative evaluator in both orientations.** [DeepEval’s `ArenaGEval`](https://github.com/confident-ai/deepeval/blob/main/deepeval/metrics/arena_g_eval/arena_g_eval.py) masks contestant identities and randomizes their order. Deep-improvement should go further: evaluate salted aliases in both `A,B` and `B,A` order, retain both raw judgments, and adjudicate order-sensitive disagreement. This directly strengthens the open commit-before-view benchmark.

3. **Use evolutionary generation without scalar-only survival.** [EvoPrompt’s `evoluter.py`](https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py) supplies concrete GA/DE parent selection, crossover, mutation, and incumbent replacement. Borrow the operators, but maintain a Pareto archive over the five dimensions plus cost and metamorphic violations. A reasonable generation mix is targeted reflection from the weakest dimension, single-slot mutation, crossover between non-dominated candidates, and a small novelty restart budget. Each candidate must declare its mutated genome slots.

4. **Make metamorphic relations executable evaluator assets.** [LLMorph](https://github.com/steven-b-cho/llmorph) separates input transformation from the output-relation oracle and records paired source/follow-up executions; its paper reports 36 implemented relations and more than 561,000 executions ([paper](https://arxiv.org/abs/2603.23611)). Deep-improvement should define `precondition`, `transform`, and `oracle` plugins for paraphrase invariance, irrelevant-context insertion, instruction injection, denied-tool aliasing, independent-tool reordering, and budget reduction. Promotion fails on newly introduced relation violations even when the ordinary aggregate rises.

### Guarded promotion and moat

Add `shadowing` between `accepted` and `ship_eligible`. The candidate replays sampled real packets in a read-only sandbox against the incumbent, using the frozen evaluator capsule and blind paired comparison. Gate on per-dimension lower bounds, metamorphic violations, judge disagreement, and tail cost. Immutable experiment snapshots and repeated trials follow the pattern documented by [Braintrust evaluations](https://www.braintrust.dev/docs/evaluate/run-evaluations).

The uniqueness thesis is sharper than “better prompt optimization”: deep-improvement owns a **measurement-controlled mutation transaction**. Deep-research gathers evidence, deep-review diagnoses, council deliberates, and alignment checks constraints; none uniquely binds a mutable agent genome to a hidden evaluator, immutable raw receipts, calibrated promotion evidence, shadow execution, and guarded canonicalization. Naive self-improvement lets the optimizer observe or influence its own objective. Deep-improvement’s moat is the authority boundary that prevents that feedback loop—not the cleverness of its mutation model.

```json
{
  "new_repos": [
    {
      "name": "microsoft/waza",
      "url": "https://github.com/microsoft/waza",
      "stars": "~1.1k",
      "what": "Agent-skill evaluation framework with captured workspace/session evidence, deterministic and prompt graders, adversarial packs, snapshots, and a v0.38.0 release in June 2026.",
      "lesson": "Give frozen graders a narrow interface over captured run receipts rather than access to mutable candidate execution state.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "braintrustdata/autoevals",
      "url": "https://github.com/braintrustdata/autoevals",
      "stars": "~970",
      "what": "Evaluator library whose scorer results separate normalized scores from raw metadata and rationale; JavaScript v0.3.0 released in June 2026.",
      "lesson": "Persist raw evaluator observations independently from versioned normalization and score reduction.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "confident-ai/deepeval",
      "url": "https://github.com/confident-ai/deepeval",
      "stars": "~16.9k",
      "what": "Evaluation framework with ArenaGEval candidate masking and randomized comparison order; Python 4.1.0 released in July 2026.",
      "lesson": "Use salted candidate aliases and order-swapped pairwise judging to reduce identity and position bias during promotion.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "beeevita/EvoPrompt",
      "url": "https://github.com/beeevita/EvoPrompt",
      "stars": "~248",
      "what": "ICLR 2024 reference implementation of GA and differential-evolution prompt optimization with explicit crossover, mutation, parent selection, and incumbent replacement.",
      "lesson": "Adopt evolutionary candidate operators but replace scalar top-k survival with five-dimensional Pareto or lexicase selection.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "steven-b-cho/llmorph",
      "url": "https://github.com/steven-b-cho/llmorph",
      "stars": "~5",
      "what": "ICSME 2025 metamorphic-testing artifact implementing 36 relations and retaining paired source/follow-up executions; paper updated in 2026.",
      "lesson": "Represent robustness checks as executable precondition-transform-oracle relations with paired immutable receipts.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Raw trial evidence must be append-only and reduction-independent: candidate, evaluator, fixture, seed, judge family, raw scale, rationale digest, normalization version, cost, and latency should survive every later score-policy change.",
      "evidence": "microsoft/waza internal/graders/grader.go and braintrustdata/autoevals",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Candidate-blind judging should run both presentation orders; disagreement between AB and BA is evidence of evaluator instability, not noise to average away silently.",
      "evidence": "https://github.com/confident-ai/deepeval/blob/main/deepeval/metrics/arena_g_eval/arena_g_eval.py",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evolutionary mutation is useful for breadth, but survival should use per-dimension Pareto or lexicase selection so gains in one dimension cannot conceal regressions in another.",
      "evidence": "https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Metamorphic evaluation converts underspecified robustness expectations into executable paired oracles and can detect regressions without requiring a unique gold output.",
      "evidence": "https://github.com/steven-b-cho/llmorph and https://arxiv.org/abs/2603.23611",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an append-only TrialScore ledger and split grading, calibration, reduction, and promotion into separately versioned stages. Preserve pre-reduction values; calibrate ordinal judges against gold anchors; compute paired per-dimension lower bounds; prohibit aggregate compensation for critical-dimension regressions.",
      "target": "deep-improvement / runtime/state-jsonl-checkpointing / runtime/gauges-observability",
      "rationale": "The current rounded weighted score cannot be recalibrated or audited without rerunning candidates, and its aggregate may hide dimension-specific deterioration.",
      "uniqueness": "Turns deep-improvement into an auditable measurement authority rather than another prompt optimizer.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/microsoft/waza and https://github.com/braintrustdata/autoevals"
    },
    {
      "rec": "Replace single-candidate generation with a budgeted portfolio of targeted reflection, single-slot mutation, crossover, and novelty restart; retain a profile-scoped Pareto archive and evaluate every survivor through order-swapped blind comparison plus metamorphic relations.",
      "target": "deep-improvement / runtime/fan-out-fan-in / runtime/dedup-novelty / runtime/budget-cost",
      "rationale": "Evolution broadens the search while vector-aware survival and relation gates prevent scalar reward hacking.",
      "uniqueness": "Combines broad mutation with a frozen evaluator that candidates cannot inspect or overrule.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/beeevita/EvoPrompt, https://github.com/confident-ai/deepeval, and https://github.com/steven-b-cho/llmorph"
    },
    {
      "rec": "Insert a signed shadowing state between accepted and ship_eligible: replay sampled real packets read-only against the incumbent, commit evaluator and fixture digests before viewing outputs, and gate on paired dimension deltas, metamorphic violations, judge disagreement, and tail cost.",
      "target": "deep-improvement / runtime/locks-recovery / runtime/continuity-threading",
      "rationale": "Offline held-out success is necessary but does not establish performance on the live workload distribution; shadow receipts provide a reversible predictive bridge.",
      "uniqueness": "This is the moat-sharpening promotion transaction: only deep-improvement can mutate an agent and then earn canonicalization through hidden, frozen, staged evidence.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://www.braintrust.dev/docs/evaluate/run-evaluations and https://github.com/microsoft/waza"
    }
  ],
  "contradictions": [
    {
      "claim": "A weighted aggregate plus fixed dimension floors is an adequate authoritative promotion score.",
      "counter": "Evolutionary search optimizes whichever scalar is exposed, while heterogeneous dimensions have different noise and calibration; promotion should consume raw paired trials and dimension-level lower bounds, leaving the aggregate for ranking only.",
      "evidence": "https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py and https://github.com/braintrustdata/autoevals"
    },
    {
      "claim": "Rich evaluator rationales should be returned directly to the candidate generator because they accelerate improvement.",
      "counter": "Raw rationales are valuable audit evidence but also expose an optimization oracle. Keep them inside the evaluator capsule and return only budgeted, redacted failure classes to mutation workers.",
      "evidence": "Inference from Autoevals raw metadata retention, DeepEval candidate masking, and Waza's narrow grader interface: https://github.com/braintrustdata/autoevals, https://github.com/confident-ai/deepeval, https://github.com/microsoft/waza"
    }
  ],
  "next_angles": [
    "Implement an EvaluatorCapsule attack harness covering grader prompt leakage, environment variables, cache keys, fixture filenames, timing channels, logs, and forged promotion receipts.",
    "Benchmark isotonic versus logistic judge calibration and paired-bootstrap promotion bounds under sparse gold anchors, heterogeneous profiles, and evaluator-version drift.",
    "Measure how well offline held-out, read-only shadow, and limited canary deltas predict post-ship correctness, cost tails, rollback frequency, and metamorphic violations."
  ],
  "notes": "No examined repository combines immutable raw multidimensional evidence, hidden evaluator capabilities, evolutionary candidate search, metamorphic agent relations, and accept-shadow-ship promotion as one transaction. That integration remains deep-improvement's strongest unclaimed design space. Star counts are approximate and were checked on 2026-07-15; repository activity signals come from visible commits or releases."
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
session id: 019f6517-1523-7e41-a653-4fc95bfd4acf
--------
user
You are iteration 18/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-improvement
MODE IDENTITY (what it does today): Evaluator-first bounded agent improvement: 5-dimension scoring, dynamic profiling, packet-local candidates, guarded promotion.
GENERIC ALTERNATIVE it must out-value: naive 'ask the model to improve its own prompt/agent' with no frozen evaluator

THIS ITERATION'S ANGLE (A3-mech): deep-improvement :: mechanisms & reference impls
DIRECTIVE: Concrete reference impls for deep-improvement: evaluator-first harness design, multi-dimension score calibration + keeping raw pre-reduction scores, candidate-generation strategies (evolutionary/reflective), guarded-promotion gates, shadow evaluation, metamorphic/adversarial eval. Real repos + code. Actionable designs for deep-improvement.

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
THIS run's new repos so far (67) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement
New insights so far: 72; recommendations: 48.
Open threads flagged: Build a candidate-blind promotion benchmark measuring whether commit-before-view, hidden executable anchors, cross-family judges, and judge ensembles predict downstream correctness under iterative optimization. | Specify the mutable-genome boundary for deep-improvement: prompts, skills, demonstrations, memory policy, tool descriptions, workflow graph, control code, and mutation policy, with evaluator reachability tests proving each protected asset is inaccessible. | Evaluate profile-scoped promotion and harness-tree routing against one global champion under stable, heterogeneous, and drifting packet workloads. | Build an evaluator-oracle leakage benchmark: vary exact-score visibility, dimension-level feedback, pass/fail-only receipts, query budgets, and cross-candidate memory; measure how quickly a BITE-like optimizer learns promotion exploits. | Specify and attack-test the EvaluatorCapsule capability boundary: hidden fixture storage, judge credentials, grader prompts, cache contents, logs, environment variables, side channels, and signed receipt verification. | Measure whether offline held-out, shadow replay, and limited live canary deltas predict post-ship correctness, cost, and rollback rates across heterogeneous agent workloads.

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
I’m treating this as read-only research: no files will be modified, so the spec-folder write gate does not apply. I’ll verify genuinely new implementations and inspect their evaluator, score-preservation, promotion, and adversarial-test code paths—not merely collect repository names.
exec
/bin/zsh -lc 'python3 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "iteration 18 deep-improvement mechanisms and reference implementations evaluator-first harness calibration raw scores guarded promotion shadow evaluation metamorphic adversarial eval" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 2762ms:
2026-07-15 11:24:20.633 xcodebuild[36165:207277777]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:24:20.899 xcodebuild[36165:207277776] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-NdTeSKsf' (errno=Operation not permitted)
2026-07-15 11:24:21.461 xcodebuild[36218:207277948]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:24:21.609 xcodebuild[36218:207277947] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
Native advisor unavailable (None; freshness=unavailable); falling back to local Python scorer.
Skill graph: SQLite exists but could not be loaded
Skill graph: SQLite exists but could not be loaded
Skill graph: SQLite exists but could not be loaded
Skill graph: SQLite exists but could not be loaded
[
  {
    "skill": "deep-improvement",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep-improvement(explicit), !evaluator-first(phrase), candidate, deep(name), evaluator",
    "_graph_boost_count": 0,
    "source": "local"
  },
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !deep-improvement(keyword), deep(name), improvement, loop(name)",
    "_graph_boost_count": 0,
    "source": "local"
  }
]

codex
Skill routing resolved to `deep-improvement` inside `system-deep-loop` (0.95 confidence). I’m loading that workflow contract before research because it defines the frozen evaluator and state boundaries this iteration must strengthen.
exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills | rg 'system-deep-loop|deep-improvement'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/hub-router.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/baselines/claude-baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-005-orchestrate-handoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-004-concise-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-003-vague-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-002-bare-command-halt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-001-auto-run-specified.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/behavior_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_strategy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/runtime_capabilities.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/rollback.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/findings-registry.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/audit-trail.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/audit-trail.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/findings-registry.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/integration-deep-mode-e2e.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-topic.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/advise-council-completion.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/rollback.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/persist-artifacts.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/runtime_routing_and_rename/advisor_routes_council_prompts_to_skill.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/runtime_routing_and_rename/runtime_agent_renamed_to_deep_ai_council.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/rollback_failed_round_preserves_forensic_trail.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/max_rounds_without_convergence_emits_non_converged.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/two_of_three_agree_triggers_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/cross_mode_anti_convergence_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_deliberation_and_seat_diversity/three_seat_diverse_deliberation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_deliberation_and_seat_diversity/cross_seat_critique_blocks_premature_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/depth_and_failure_handling/depth_detection_parallel_vs_sequential.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/depth_and_failure_handling/resume_after_interrupted_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/convergence_safety_under_critical_disagreement_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/stalled_council_blocker_ranking_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/hot_topic_discovery_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/mid_run_interruption_recovery_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/decision_provenance_audit_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/scope_boundaries/planning_only_boundary_rejects_implementation_writes.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/scope_boundaries/graph_support_derived_and_scoped.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_status_recovery_payload_and_readiness.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_upsert_idempotency_and_self_loop_rejection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_query_hostile_metadata_redaction.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_convergence_three_state_decision_matrix.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/five_dimension_scoring_rubric_application.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/out_of_scope_write_rejection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/library_writer_call_sequence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/hunter_skeptic_referee_cross_critique.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/artifact_persistence_and_state_format/output_schema_strict_required_sections_fail_closed.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/artifact_persistence_and_state_format/state_jsonl_records_council_complete_event.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/artifact_persistence_and_state_format/persist_artifacts_helper_writes_packet_local_tree.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/runtime_routing_and_rename/advisor_routes_council_prompts_to_skill.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/runtime_routing_and_rename/runtime_agent_renamed_to_deep_ai_council.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/rollback_failed_round_preserves_forensic_trail.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/max_rounds_without_convergence_emits_non_converged.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/two_of_three_agree_triggers_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/cross_mode_anti_convergence_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_deliberation_and_seat_diversity/three_seat_diverse_deliberation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_deliberation_and_seat_diversity/cross_seat_critique_blocks_premature_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/depth_and_failure_handling/depth_detection_parallel_vs_sequential.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/depth_and_failure_handling/resume_after_interrupted_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/convergence_safety_under_critical_disagreement_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/stalled_council_blocker_ranking_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/hot_topic_discovery_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/mid_run_interruption_recovery_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/decision_provenance_audit_graph_vs_baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/scope_boundaries/planning_only_boundary_rejects_implementation_writes.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/scope_boundaries/graph_support_derived_and_scoped.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/feature_catalog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_status_recovery_payload_and_readiness.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_upsert_idempotency_and_self_loop_rejection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_query_hostile_metadata_redaction.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_convergence_three_state_decision_matrix.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/five_dimension_scoring_rubric_application.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/out_of_scope_write_rejection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/library_writer_call_sequence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/hunter_skeptic_referee_cross_critique.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/artifact_persistence_and_state_format/output_schema_strict_required_sections_fail_closed.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/artifact_persistence_and_state_format/state_jsonl_records_council_complete_event.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/artifact_persistence_and_state_format/persist_artifacts_helper_writes_packet_local_tree.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/structure/folder_layout.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/findings_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/failure_handling.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/quick_reference.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti_patterns.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command_wiring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.2.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.3.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.1.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.3.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.2.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/baselines/claude-baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-005-orchestrate-handoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-004-concise-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-002-bare-command-halt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-003-vague-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-001-auto-run-specified.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/behavior_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_profiles/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/remediation_taxonomy.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.private.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.public.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_date.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_stale_verdict.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_improved.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_parse_csv_line.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_baseline.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_semver.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_strict_acceptance.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_semver_compare.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_ipv4.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_int_to_words.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_merge_intervals.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t1_smoke_echo.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_roman_to_int.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_ac_coverage.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_edge.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_normalize_path.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_bugfix_in_context.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_eval_expr.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_softened_fail.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_over_read.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_discriminating.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/model_vs_model.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/typed-errors.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/mutation-coverage.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement_config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/candidate-lineage.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/mutation-coverage.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/trade-off-trajectory.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/benchmark-results.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/materialize-fixture-id.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/anti-goodhart.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-dashboard.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/model-family.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/parse-args.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/check-dispatch-cap.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/extract-deliverable.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/routing-allowlist.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-surface-path-parse.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-opencode-playbook-ids.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/_args.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5cecfb73a67e5b6522e5992e8a1958d4.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8e6d3962a346cf59796d3df172c3901b.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/df404b41b693fd90b7d2b2fb64d46d78.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5fe47aad8aacf44314f494ab0add2dec.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4d1138ca8c23389ecdf84767e8691348.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/362330146b11be4e9ed0d522cc7b7a9f.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/e5706bc35dabb7584b4563c9d5b2bd42.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9a38a58ebffba2c0a5e87918261d9afb.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/0115576e1e7be786962398431c973dd9.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/dbd80958bc81ecc2c9c947d3db67f510.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/22c1faa7c45013e9fdfb6ce5ecf929d1.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9c562e7eb6d90a65972bc75282b09770.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/ea2a6323ff8b607dea081c14ae4fd24b.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/a59863e9ad0f70d9bf39a3b3e7d3ec2b.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f4b6ea7a34706c73189ac821c6ec177d.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/75692e98524c987bc724bd15f1268854.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8c2c8a1fd00f3af9daaef290f1be57ba.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/aac68b3316e3489dd0c4e9b5e367ddd5.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc53734e22ef097b18e31f94d61a003d.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/42840a5b34cdd91b3e2ff2d77184541e.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/d0bc23dd3d54f9d0feef1727c1313afe.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/index.jsonl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/7fb218c8d070aa9e92bbda2b3bba94de.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4b7b4bbc6313c5e1c67711655e612a98.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9f00e055438f4fb69c5a0bf926d25952.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/cbbeff1caf82bd3a1e002bbd22377b43.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/720c3c2f773829e2d75f3c4cf1c9cc36.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f2f2dd71f2533dd8cb3665d0857b8a02.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc10907e5828f4c8b642f4557d6c0675.out.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-skeptic.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/dispatch-envelope.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/grader-harness-hardening.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-runtime.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/bundle-gate-exec-gate.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/candidate-lineage.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-cache.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-security.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/rollback-candidate-containment.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/audit_journal_emission.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/journal_wiring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/dimension_trajectory.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/resume_continuation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/parallel_candidates_opt_in.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/legal_stop_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/benchmark_stability.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/improvement_gate_delta.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/benchmark_completed_boundary.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/setup-cp-sandbox.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/legal_stop_gate_bundle.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/active_critic_overfit.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/skill_load_not_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/proposal_only_boundary.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/full_setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/skill_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/quick_reference.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/evaluation_policy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/integration_scan.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/target_onboarding.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/model_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/promotion_operations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/loop_execution.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/missing_candidate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dynamic_arbitrary.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dimension_details.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/without_integration.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/with_integration.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/any_agent.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/candidate_lineage.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/full_pipeline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/trade_off_detection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/two_phase_promotion_and_rollback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/mutation_coverage_graph_tracking.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/json_output_file.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_missing_agent.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_diverse_agent.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_known_agent.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/inline_rules_fallback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/file_output.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/rules_extraction.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/output_checks.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/dual_report_and_remediation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/contamination_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/mode_wiring_routing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/d5_connectivity_hard_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/no_dimensions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/plateau_detection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/with_dimensions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/optin_5dim_scorer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/criteria_exec_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/reviewer_prompt_regression_fixtures.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/score_delta_benchmark_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/default_pattern_scorer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/mode_switch_routing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/unknown_fallback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/promotion_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/rollback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/candidate_generation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/plateau_detection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/initialization.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/two_phase_promotion_and_rollback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dynamic_profiling.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/deterministic_scoring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/five_dimension_rubric.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dimensional_progress.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/dual_report_and_remediation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/runtime_mirrors.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/command_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_records_and_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/model_dispatcher.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/opt_in_5dim_scorer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/score_delta_benchmark_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/routing-allowlist.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/baselines/claude-baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.7.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.11.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.9.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.5.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.10.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.6.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.3.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.2.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.8.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.4.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.10.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/changelog/v1.2.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/runtime-capabilities.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/mirror_drift_policy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-007-delegation-route-proof.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-004-concise-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-005-orchestrate-handoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-008-absorption-probe.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-006-auto-missing-inputs.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-001-auto-run-specified.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-002-bare-command-halt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-003-vague-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/behavior_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/security_sensitive_fix_overrides.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/convergence_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/divergent_convergence_mode.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/quality_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/adversarial_self_check.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/claim_adjudication.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/severity_classification.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/verdicts.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/cross_mode_anti_convergence_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/cross_reference_verification_detects_misalignment.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/graph_events_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/strategy_next_focus_and_dimension_rotation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/severity_classification_in_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_reads_state_before_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_writes_findings_jsonl_and_strategy_update.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_dashboard_generation_after_iteration.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/adversarial_self_check_runs_on_p0_findings.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/security.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/correctness.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/maintainability.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/traceability.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/deep_review_strategy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/deep_review_config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/runtime_capabilities.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/state/state_outputs.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/state/state_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback_runbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/synthesis_save_boundary.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/leaf_only_nested_dispatch_refusal.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/setup_yaml_handoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/three_artifact_iteration_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/setup-cp-sandbox.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/write_boundary_reducer_owned_files.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/resource_map_coverage_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/findings_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/config_management.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/strategy_tracking.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/graph_convergence_event.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/jsonl_state_log.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/pause_sentinel.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/convergence_check.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/fanout_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/iteration_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/executor_selection_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/synthesis.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/resource_map_coverage_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/memory_save.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/initialization.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/resource_map_emission.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/feature_catalog/feature_catalog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/description.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/resume_after_pause_sentinel_removal.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/pause_sentinel_halts_between_review_iterations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/malformed_jsonl_lines_are_skipped_with_defaults.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/jsonl_reconstruction_from_review_iteration_files.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/benchmark_operator_guide.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/mixed_executor_methodology.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/review_verdict_determines_post_review_workflow.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/final_synthesis_memory_save_and_guardrail_behavior.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/finding_deduplication_and_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/resource_map_emission.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/review_report_synthesis_has_all_9_sections.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/SMOKE-000-fake.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/fake-leg.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/dab-v1-golden.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_cli_lineages_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_single_executor_parity_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_native_sequential_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_strongest_restriction.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.14.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.16.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_iteration.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.7.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.13.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.5.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.3.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.1.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.8.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.4.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.12.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/rollout/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/validator_warn_rollout.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/stop_gate_graphless_fallback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/reducer_search_debt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/validator_strict_v2.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/stop_gate_candidate_coverage.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/graph_vocabulary.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/changelog/v1.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/changelog/v2.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/changelog/v1.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/graph-metadata.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/mode_hint_override.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/ai_council_routing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/review_routing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/research_routing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_review_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/scope_discovery_and_dimension_ordering.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_review_state_halts_for_repair.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/fresh_review_initialization_creates_canonical_state_files.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/rollout/tests/resolve-injection-mode.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/rollout/promotion-rule.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/divergent_convergence_mode.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/dimension_coverage_convergence_signal.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/blocked_stop_reducer_surfacing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/composite_review_convergence_stop_behavior.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/fail_closed_reducer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/graph_convergence_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/p0_override_blocks_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/review_quality_guards_block_premature_stop.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/stop_on_max_iterations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/cross_mode_anti_convergence_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/stuck_recovery_widens_dimension_focus.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/external_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/improvement_host.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/runtime_loop_council.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/runtime_loop_research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/auto_mode_deep_review_kickoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/parameterized_invocation_max_iterations_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/confirm_mode_checkpointed_review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/skill_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/agent_improvement.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/model_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/single_advisor_identity.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/lexical_mode_scoring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/command_bridge_guard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/no_false_fire_code_edit.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/progress/progress-record.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/shared/progress/progress-record.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/convergence_stop.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/artifact_root_writes.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/hub_logic_boundary.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/externalized_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/discover.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_doc.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_design.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/check.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_git.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_code.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_design_live_render.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/standard_source.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-008-per-lane-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-002-bare-command-halt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-003-vague-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-010-boundary-vs-parent-skill-check.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-004-concise-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-006-known-deviation-suppression.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-005-verify-first.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-001-auto-run-lane-config.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-011-clean-pass-zero-findings.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-007-read-only-default.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-009-boundary-vs-deep-review.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/behavior_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/vitest.config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/gated_remediation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/read_only_default.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/verify_first.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/known_deviation_suppression.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/lane_config.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/scoping_tree.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/scope_types.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/artifact_classes.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/authority_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/evidence-contract.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/pivot-candidates.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/receipt-crypto.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/bayesian-scorer.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/fallback-router.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/sleep.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/fixtures/fixture-manifest.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/lane-config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/assets/alignment_prompt_pack.md.tmpl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/assets/deep_alignment_config_template.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/state_machine.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/convergence_check.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/alignment_report_reducer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/corpus_partitioning.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/feature_catalog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/mode-registry.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/session-state-hierarchy.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/changelog/v1.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/router_mode_a/skill-benchmark-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/router_mode_a/skill-benchmark-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/live_mode_b/skill-benchmark-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/live_mode_b/skill-benchmark-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_command_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/status.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_known_deviations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_known_deviations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_known_deviations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_command_known_deviations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/reducer-fail-closed.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/partition-identity-progress.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/query.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/scoping-adapter.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/skill-benchmark-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/skill-benchmark-report.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/nothing_to_converge_and_vacuous_lane.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/dry_run_stability_fail_closed.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/coverage_and_stability_and_semantics.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/corpus_partitioning_round_robin.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/max_iterations_hard_stop.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/authority_agnostic_adapter_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_design_static_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_git_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_doc_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_design_live_render_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_code_hybrid_adapter.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/state_and_fault_tolerance/malformed_jsonl_corruption_warnings.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/state_and_fault_tolerance/state_machine_wiring_regression.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/state_and_fault_tolerance/alignment_state_file_layout.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/entry_points_and_modes/config_file_only_non_interactive_path.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/entry_points_and_modes/parameter_surface_modes_and_tuning.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/entry_points_and_modes/invocation_contract_and_forbidden_patterns.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/read_only_and_gated_remediation/read_only_default_surface.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/read_only_and_gated_remediation/gated_remediation_hook_noop.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/empty_lane_config_zero_lanes.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/multi_authority_single_run.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/authority_artifact_class_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/dual_path_identical_lane_shape.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/fail_closed_error_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/scope_shape_and_repo_root_validation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/verify_first_and_known_deviations/known_deviation_suppression.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/verify_first_and_known_deviations/verify_first_no_finding_without_reprobe.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/report_emission_per_lane/worst_verdict_overall_rollup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/report_emission_per_lane/one_report_per_lane.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/report_emission_per_lane/finding_dedup_and_fail_closed_severity.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/references/coverage_graph_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/references/integration_points.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/references/state_format.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/references/script_interface_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/verify_first_and_known_deviations/sk_git_exempt_precheck_vs_suppression.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/database/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.2.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.5.0.1.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.5.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.4.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_pool_concurrency_cap.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_merge_review_strongest_restriction.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/validation/llm_judge_hardening.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/validation/mk_deep_loop_guard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/validation/post_dispatch_validate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_stall_watchdog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_salvage_recovery.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/artifact_dir_override_parity.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_config_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_run_cli_lineage_spawn.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fixed_rate_overrun_accounting.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/persisted_wait_crash_resume.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_merge_research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_db.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_fuzzy_merge.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/observation_threshold_guard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_time_decay.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_query.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/testing/record_replay_cassette_harness.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/testing/hermetic_test_isolation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/feature_catalog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/cost_guards.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/adjudicator_verdict_scoring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/session_state_hierarchy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/multi_seat_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/round_state_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/lifecycle/abortable_chunked_sleep.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/lifecycle/lifecycle_taxonomy_guards.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/fallback_router.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/executor_audit.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/fallback_router_typed_reroute.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/executor_config.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/validation/llm_judge_hardening.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/validation/mk_deep_loop_guard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/validation/post_dispatch_validate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/prompt_rendering/prompt_pack.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/observability/byte_offset_log_regions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/observability/single_loop_telemetry_heartbeat.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/observability/unified_observability_event_envelope.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/scoring/convergence_score_delta.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/scoring/bayesian_scorer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/observability/byte_offset_log_regions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/observability/single_loop_telemetry_heartbeat.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/observability/unified_observability_event_envelope.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/status_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/upsert_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/query_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/convergence_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/council/cost_guards.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/council/adjudicator_verdict_scoring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/council/session_state_hierarchy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/council/multi_seat_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/council/round_state_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/lifecycle/abortable_chunked_sleep.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/lifecycle/lifecycle_taxonomy_guards.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/fallback_router.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/executor_audit.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/fallback_router_typed_reroute.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/executor_config.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_db.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_fuzzy_merge.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/observation_threshold_guard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_time_decay.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_query.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/receipt-crypto.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council-graph-value-report.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/testing/record_replay_cassette_harness.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/testing/hermetic_test_isolation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_merge.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_stall_watchdog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_pool.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_config_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_salvage.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fixed_rate_overrun_accounting.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/persisted_wait_crash_resume.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_run.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/helpers/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/jsonl_repair.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state_deferred_writer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/loop_lock_heartbeat_hardening.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state_serialize_diff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/loop_lock_single_flight_decision.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/permissions_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/jsonl_lock_held_merge.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/prompt_rendering/prompt_pack.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/loop_lock.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state_integrity_helpers.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/query_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/convergence_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/upsert_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/status_script.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/baselines/claude-baseline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council/round-state-jsonl.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/scoring/convergence_score_delta.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council/cost-guards.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council/session-state-hierarchy.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/council/adjudicator-verdict-scoring.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/scoring/bayesian_scorer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/lifecycle/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/behavior_benchmark.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state_integrity_helpers.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/loop_lock.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/jsonl_lock_held_merge.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/permissions_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/loop_lock_single_flight_decision.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/jsonl_repair.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state_deferred_writer.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/loop_lock_heartbeat_hardening.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state_serialize_diff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/scripts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/dependency-seams.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/observability-events.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/workflow-session-id-parity.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-salvage.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/bayesian-scorer.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit-process-group.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/executor-provenance-mismatch.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy-guards.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/assets/deep_research_dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/assets/runtime_capabilities.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/assets/deep_research_strategy.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-005-orchestrate-handoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-004-concise-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-008-absorption-probe.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-006-auto-missing-inputs.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-001-auto-run-specified.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-007-delegation-route-proof.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-003-vague-natural-ask.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-002-bare-command-halt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/runtime-capabilities-matrix-conformance.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/runtime-capabilities.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/council-graph-query.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/sleep.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/coverage-graph-query.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/evidence-contract.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/research_output/progressive_synthesis.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/research_output/negative_knowledge.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/guides/capability_matrix.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/feature_catalog.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/protocol/spec_check_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/protocol/context_snapshot.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.8.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.4.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.12.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.2.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.14.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.2.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.10.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.1.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.3.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.3.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/state/state_reducer_registry.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.1.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/state/state_outputs.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/state/state_format.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/state/state_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.2.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-graph.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-validator.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/query-script.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/integration/status-script.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/seed-helpers.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/convergence-score-delta.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-029.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/jsonl-repair.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/pivot-candidates.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock-cli.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/atomic-state.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-novelty-inertness.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.2.2.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-failure.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/artifact-root.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.5.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/cli-guards-writer-lock.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/coverage-graph-db.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/routing-allowlist.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/spawn-cjs.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/fanout/fanout_native_sequential_research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/fanout/fanout_cli_lineages_research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/fanout/fanout_single_executor_parity_research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-031.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-030.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-027.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-032.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-028.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.7.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.11.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.13.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/changelog/v1.9.0.0.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/host-driven-improvement.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/fallback-router.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/cli-matrix.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/unit/optimizer-manifest-anti-convergence.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_reference_only.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_graph.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/quality_guard_focus_alignment.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_recovery.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/quality_guard_source_diversity.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/stop_on_max_iterations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/strategy_next_focus_and_exhausted_approach_discipline.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/manual_testing_playbook.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/divergent_convergence_mode.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/three_signal_model.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/graph_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/anti_convergence_floor.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/quality_guards.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/stuck_detection.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/composite_convergence_stop_behavior.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/stop_when_all_key_questions_are_answered.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/insight_status_prevents_false_stuck.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/graph_convergence_signals.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/anti_convergence_floor.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/thought_status_convergence_handling.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/convergence_passes_guard_fails_override.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/question_conflict_ownership.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/focus_track_labels_in_dashboard.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/injection_inbox_provenance.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/iteration_writes_iteration_jsonl_and_strategy_update.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/rejected_pattern_cache.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/graph_aware_stop_gate.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/dashboard_generation_after_iteration.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/novelty_justification_in_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/ideas_backlog_lifecycle.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/dashboard_sparkline_trend.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/graph_events_emission.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/progressive_synthesis_behavior_for_research_md.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/stuck_recovery_widens_focus_and_continues.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/iteration_reads_state_before_research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/quality_guard_no_single_weak_source.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/blocked_stop_reducer_surfacing.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/divergent_convergence_mode.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/research_charter_validation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_state_halts_for_repair.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/fresh_initialization_creates_canonical_state_files.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/iteration.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/runtime_parity.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/spec_anchoring.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/recovery.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/resource_map.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/state.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/loop_setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/data/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/data/scenarios.cjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/run_now_control.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/initialization.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/resource_map_emission.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/synthesis.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/memory_save.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/iteration_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/fanout_dispatch.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/per_iteration_memory_upsert.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/loop_wide_dry_run.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/convergence_check.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/loop_wide_dry_run.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/confirm_mode_checkpointed_execution.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/auto_mode_deep_research_kickoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/parameterized_invocation_max_iterations_convergence.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/per_iteration_memory_upsert.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/config_management.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/final_synthesis_memory_save_and_guardrail_behavior.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/ruled_out_directions_in_synthesis.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/resource_map_emission.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/run_now_control.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/pause_sentinel_halts_between_iterations.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/ideas_backlog_lifecycle.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/question_conflict_ownership.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/injection_inbox_provenance.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/rejected_pattern_cache.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/dashboard_sparkline_trend.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/jsonl_state_log.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/jsonl_reconstruction_from_iteration_files.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/strategy_tracking.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/pause_sentinel_halt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/exhausted_approach_respect.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/setup-cp-sandbox.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/iteration_citation_jsonl.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/resource_map_toggle.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/setup_yaml_handoff.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/spec_fence_writeback.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/malformed_jsonl_lines_are_skipped_with_defaults.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/resume_after_pause_sentinel_removal.md

exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement | rg '/SKILL\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md

exec
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     154 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md
     339 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
     493 total

exec
/bin/zsh -lc "sed -n '1,154p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
/bin/zsh -lc "sed -n '1,180p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
/bin/zsh -lc "sed -n '181,339p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
 succeeded in 0ms:
     115 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
     102 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
     144 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md
     126 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
      47 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
     229 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md
     323 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
      57 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md
    1255 total

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: Loop Protocol
description: End-to-end deep-improvement workflow from initialization through guarded promotion or stop decisions.
trigger_phrases:
  - "deep-improvement loop protocol"
  - "improvement workflow lifecycle"
  - "candidate score benchmark reduce promote"
  - "guarded promotion and stop decisions"
importance_tier: normal
contextType: implementation
version: 1.17.0.10
---

# Loop Protocol

End-to-end operator view of how the deep-improvement command, mutator, scorer, benchmark runner, reducer, and approval gates fit together. Use it when you need the full lifecycle, not just a quick command reminder.

---

## 1. OVERVIEW

### Purpose

Describes the normal deep-improvement loop from packet initialization through reduction, stop decisions, and guarded promotion.

### When to Use

Use this reference when:
- Running a new deep-improvement packet
- Explaining how candidates move through score, benchmark, and reducer stages
- Checking where promotion and rollback sit in the workflow

### Core Principle

The loop is evaluator-first. Candidate generation, scoring, benchmarking, reduction, and promotion must stay separated so each stage can be trusted.

---

## 2. INIT

- Confirm spec folder and execution mode
- Confirm target path
- Run `scan-integration.cjs` to map the target's full integration surface
- Run `generate-profile.cjs` to derive the dynamic scoring profile from the target agent's own rules
- Create `{spec_folder}/improvement/`, `candidates/`, and `benchmark-runs/`
- Copy the config, strategy, charter, and manifest templates into the runtime area
- Record the baseline candidate in `agent-improvement-state.jsonl`

---

## 3. PROPOSE

- Read the charter and target manifest first
- Read the target profile and fixture expectations first
- Read the canonical target surface
- Generate one bounded candidate artifact
- Write it under `improvement/candidates/` only

---

## 4. SCORE AND BENCHMARK

- Run `score-candidate.cjs` against the candidate (dynamic 5-dimension mode is the only supported path)
- Run `run-benchmark.cjs` against the packet-local output set for the active target (use `--integration-report` to include integration consistency scoring)
- Keep scorer execution separate from the mutator step
- Record baseline, candidate, benchmark run, rejected, accepted, or infra-failure events in the ledger
- The scorer produces per-dimension scores (structural, ruleCoherence, integration, outputQuality, systemFitness)

---

## 5. REDUCE AND DECIDE

- Run `reduce-state.cjs`
- Refresh `agent-improvement-dashboard.md`
- Refresh `experiment-registry.json`
- Continue if the score delta is meaningful, the benchmark passes, and the manifest boundary was respected
- Reject if the scorer flags structure, safety, or scope issues
- Keep the simpler candidate when score deltas tie
- Stop when repeatability, weak-benchmark, or infra-failure no-go rules trigger

---

## 6. PROMOTE

Promotion is a per-target decision under dynamic mode and remains a guarded later-phase workflow requiring:
- explicit operator approval
- evaluator threshold met
- benchmark evidence already present (when benchmarks are configured for that target)
- rollback plan available
- manifest still respected (target not classified `fixed` or `forbidden`)

---

## 7. RELATED RESOURCES

- `quick_reference.md`
- `../model_benchmark/evaluator_contract.md`
- `../agent_improvement/integration_scanning.md`
- `../model_benchmark/benchmark_operator_guide.md`
- `rollback_runbook.md`
- `../../README.md`


exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: Deep Agent Improvement Promotion Gate Contract
description: Formal contract defining the guarded promotion gates that must pass before a packet-local candidate can mutate the canonical target.
trigger_phrases:
  - "promotion gates"
  - "promotion contract"
  - "guarded promotion"
  - "promotion eligibility"
importance_tier: important
contextType: implementation
version: 1.17.0.13
---

# Deep Agent Improvement Promotion Gate Contract

Formal contract defining the guarded gates that must pass before a packet-local candidate can move from accepted evidence to a canonical shipped target.

---

## 1. OVERVIEW

Promotion has two callable phases:

- `accept`: verify all gates, snapshot the canonical preimage, snapshot the candidate, and record the preserved branch without mutating the canonical target.
- `ship`: re-check the same evidence, require the canonical target to still match the accepted preimage, then copy the accepted candidate snapshot into the canonical target.

The promotion gate contract defines the five required gates that must pass before either phase can proceed: prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval.

**Promotion script:** `scripts/shared/promote-candidate.cjs`

**Rollback script:** `scripts/shared/rollback-candidate.cjs`

**Policy reference:** `references/shared/promotion_rules.md`

---

## 2. PROMOTION GATES

### Gate 1: Prompt Scoring

**Requirement:** Weighted score >= 70, baseline delta above runtime threshold, and every scored dimension meeting its named promotion gate.

**Per-dimension gates:** `scripts/lib/promotion-gates.cjs` is the source of truth.

| Dimension | Minimum Score |
| --- | ---: |
| `structural` | 80 |
| `ruleCoherence` | 85 |
| `integration` | 90 |
| `outputQuality` | 75 |
| `systemFitness` | 80 |

**Validation:**
- Run `scripts/agent-improvement/score-candidate.cjs` on the candidate
- Check `score >= 70`
- Check `recommendation === "candidate-better"` when promotion uses a baseline
- Verify all 5 dimensions have scores (no NaN or missing values)
- Verify `promotionGates.passed === true` or recompute the same map from score output

**Failure mode:** `score_gate_failed` - candidate does not meet minimum quality threshold.

---

### Gate 2: Benchmark Status

**Requirement:** Benchmark pass with `minimumAggregateScore >= 85`.

**Validation:**
- Run `scripts/model-benchmark/run-benchmark.cjs` with target-specific fixtures
- Check `benchmark-outputs/report.json` exists
- Check `report.status === "benchmark-complete"`
- Check `report.aggregateScore >= 85`
- Verify fixture coverage (all fixtures executed)

**Failure mode:** `benchmark_gate_failed` - candidate fails output-based validation.

**Note:** Benchmark integration requires target-specific fixture set under `assets/model_benchmark/benchmark-fixtures/`. Not all targets have fixtures; this gate is conditional on fixture availability.

---

### Gate 3: Repeatability Evidence

**Requirement:** Minimum 3 benchmark runs with score variance <= 5.

**Validation:**
- Run `scripts/agent-improvement/benchmark-stability.cjs` on historical benchmark data
- Check `runCount >= 3`
- Check `scoreVariance <= 5`
- Verify no regression across runs

**Failure mode:** `repeatability_gate_failed` - benchmark results are not stable.

**Note:** Repeatability is advisory only in current release. `benchmark-stability.cjs` emits recommendations but does not auto-apply them (ADR-005).

---

### Gate 4: Manifest Boundary Compliance

**Requirement:** Candidate path matches `target_manifest.jsonc` target definition.

**Validation:**
- Load `assets/agent_improvement/target_manifest.jsonc`
- Check candidate path matches `targets[].canonicalPath`
- Verify target is marked `mutable: true`
- Check candidate is under packet-local `candidates/` directory (not canonical)

**Failure mode:** `boundary_gate_failed` - candidate violates boundary policy.

---

### Gate 5: Explicit Operator Approval

**Requirement:** Operator explicitly approves promotion via `--approve` flag.

**Validation:**
- Check `--approve` flag is present in promotion command
- Verify approval is for the specific candidate being promoted
- Log approval in `improvement-journal.jsonl` as `promotion_attempt` event

**Failure mode:** `approval_gate_failed` - missing explicit operator consent.

---

## 3. PROMOTION PROCESS

### Step 1: Accept Candidate

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs \
  --phase=accept \
  --candidate={spec_folder}/improvement/candidates/{candidate_id}.md \
  --target={canonical_target_path} \
  --score={score_json_path} \
  --benchmark-report={benchmark_report_path} \
  --repeatability-report={repeatability_report_path} \
  --config={spec_folder}/improvement/agent-improvement-config.json \
  --manifest={spec_folder}/improvement/target_manifest.jsonc \
  --archive-dir={spec_folder}/improvement/archive \
  --approve
```

**Validation sequence:**
1. Load candidate file and verify it exists
2. Load score JSON and verify scoring gate passed
3. Load benchmark report (if fixtures exist) and verify benchmark gate passed
4. Load manifest and verify boundary compliance
5. Verify `--approve` flag is present
6. If any gate fails, abort with specific failure mode and emit `promotion_blocked_branch_preserved` when an event log is configured
7. Snapshot canonical target and candidate under the archive directory
8. Write an accepted-state file and return its `acceptanceFile` path

---

### Step 2: Ship Accepted Candidate

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs \
  --phase=ship \
  --acceptance-file={spec_folder}/improvement/archive/{target_name}.{timestamp}.accepted.json \
  --approve
```

**Ship sequence:**
1. Re-load the accepted-state file and gate evidence
2. Verify the canonical target still hashes to the pre-acceptance snapshot
3. Restore the pre-acceptance snapshot and emit `promotion_blocked_branch_preserved` if the clean-tree check fails
4. Copy the accepted candidate snapshot over the canonical target
5. Return `status: "shipped"` with the rollback backup path and preserved branch

---

### Step 3: Post-Ship Verification

**Mirror sync check:**
- Run `scripts/agent-improvement/check-mirror-drift.cjs` to detect mirror divergence
- Record drift status in journal (separate packaging work)

**Dimensional verification:**
- Re-score canonical target to verify the shipped candidate
- Compare post-ship score to pre-acceptance baseline
- Record dimension trajectory in journal

---

## 4. ROLLBACK PROCESS

### Trigger Conditions

Rollback is triggered when:
- Operator explicitly requests rollback
- Post-promotion verification reveals regression
- Mirror sync reveals critical drift

### Rollback Execution

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs \
  --target={canonical_target_path} \
  --backup={backup_path} \
  --config={config_path} \
  --manifest={manifest_path}
```

When rolling back a two-phase promotion, the accepted-state file can supply those paths:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs \
  --acceptance-file={acceptance_file_path}
```

**Rollback sequence:**
1. Verify backup file exists and is valid
2. Verify target path matches manifest
3. Copy backup over canonical target
4. Emit `rollback_result` event with `status: "success"`
5. Leave the preserved branch and accepted candidate snapshot intact for audit
6. Record post-rollback dimensional snapshot

**Post-rollback verification:**
- Re-score canonical target to verify restoration
- Compare post-rollback score to original baseline
- Record verification in journal

---

## 5. JOURNAL EVENTS

### Promotion Events

**Event:** `promotion_blocked_branch_preserved`
```json
{
  "eventType": "promotion_blocked_branch_preserved",
  "phase": "ship",
  "target": ".opencode/agents/debug.md",
  "candidate": "improvement/archive/debug.md.accepted",
  "preservedBranch": "feature/improve-debug-agent",
  "branchPreservationPolicy": "preserve-on-failure"
}
```

**Event:** `promotion_attempt`
```json
{
  "eventType": "promotion_attempt",
  "candidateId": "candidate-001",
  "targetPath": ".opencode/agents/debug.md",
  "gates": {
    "score": { "passed": true, "weightedScore": 78.5 },
    "benchmark": { "passed": true, "aggregateScore": 90 },
    "repeatability": { "passed": true, "variance": 2.3 },
    "boundary": { "passed": true },
    "approval": { "passed": true, "approvedBy": "operator" }
  }
}
```

**Event:** `promotion_result`
```json
{
  "eventType": "promotion_result",
  "status": "success",
  "candidateId": "candidate-001",
  "backupPath": "improvement/archive/20260523_debug.md.backup",
  "postPromotionScore": 78.5
}
```

### Rollback Events

**Event:** `rollback`
```json
{
  "eventType": "rollback",
  "targetPath": ".opencode/agents/debug.md",
  "backupPath": "improvement/archive/20260523_debug.md.backup",
  "reason": "operator_request"
}
```

**Event:** `rollback_result`
```json
{
  "eventType": "rollback_result",
  "status": "success",
  "postRollbackScore": 72.0,
  "verified": true
}
```

---

## 6. FAILURE MODES

|| Failure Mode | Trigger Condition | Recovery |
|---|---|---|
| `score_gate_failed` | Weighted score < 70 or recommendation != "candidate-acceptable" | Improve candidate, re-score |
| `benchmark_gate_failed` | Benchmark aggregate score < 85 or benchmark incomplete | Fix output contract, improve fixtures |
| `repeatability_gate_failed` | Benchmark score variance > 5 or run count < 3 | Stabilize fixtures, investigate non-determinism |
| `boundary_gate_failed` | Candidate path not in manifest or target not mutable | Update manifest or choose different target |
| `approval_gate_failed` | `--approve` flag missing | Re-run with explicit approval |
| `backup_failed` | Cannot create backup of canonical target | Check file permissions, disk space |
| `mutation_failed` | Cannot copy candidate over target | Check file permissions, disk space |
| `rollback_failed` | Cannot restore backup | Verify backup exists, check permissions |
| `dimension_gate_failed` | One or more per-dimension gates fails or is unscored | Improve the targeted dimension and re-score |
| `promotion_blocked_branch_preserved` | Accept or ship gate failed under branch-preservation policy | Inspect the preserved branch and acceptance evidence before retry |

---

## 7. SOURCE ANCHORS

|| Path | Role |
|---|---|
| `scripts/shared/promote-candidate.cjs` | Promotion gate validation and mutation |
| `scripts/lib/promotion-gates.cjs` | Named weighted, benchmark, and per-dimension gate values |
| `scripts/shared/rollback-candidate.cjs` | Rollback execution and verification |
| `scripts/agent-improvement/check-mirror-drift.cjs` | Post-promotion mirror sync check |
| `scripts/agent-improvement/score-candidate.cjs` | Prompt scoring gate |
| `scripts/model-benchmark/run-benchmark.cjs` | Benchmark execution gate |
| `scripts/agent-improvement/benchmark-stability.cjs` | Repeatability analysis |
| `assets/agent_improvement/target_manifest.jsonc` | Target boundary definition |
| `references/shared/promotion_rules.md` | Promotion policy documentation |
| `feature_catalog/evaluation_loop/promotion_gates.md` | Feature catalog entry |

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: Stress-Test Failure Paths Before Promotion Claims
description: Same-task A/B stress-test protocol required before recommending promotion for changes that alter agent discipline.
trigger_phrases:
  - "stress test failure paths"
  - "A/B promotion evidence"
  - "sandbox baseline comparison"
  - "legal-stop gate keys check"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Stress-Test Failure Paths Before Promotion Claims

Full protocol for Mode 2A of the Lane A (agent-improvement) loop: proving that a disciplined `/deep:agent-improvement` run actually behaves differently from a generic improvement attempt before recommending promotion.

---

## 1. OVERVIEW

### Purpose

Defines the same-task A/B stress-test operators and orchestrators must run before recommending promotion for any candidate that alters agent discipline (rules, boundaries, escalation behavior), so promotion claims rest on observed grep/file/diff/exit-code evidence rather than on having merely read or invoked the skill.

### When to Use

Use this reference when:
- A candidate changes ALWAYS/NEVER rules, boundary enforcement, or escalation behavior
- You are about to recommend promotion and need the required stress-test evidence first
- Reviewing whether a prior promotion recommendation actually ran this protocol

### Core Principle

Reading `SKILL.md` or invoking `skill(deep-improvement)` is not evidence that the disciplined path executed. Only observed behavioral signals — helper invocation, packet-local candidate boundary, no premature canonical/mirror mutation, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness — count as evidence.

---

## 2. PROTOCOL

For changes that alter agent discipline, run at least one same-task A/B stress scenario before recommending promotion:

1. **Call A**: run a generic improvement attempt against an isolated sandbox copy of the target.
2. **Reset**: reset the sandbox to its baseline copy.
3. **Call B**: run the disciplined `/deep:agent-improvement` path against the identical prompt and files.
4. **Judge**: compare only grep/file/diff/exit-code signals between Call A and Call B — helper invocation, packet-local candidate boundary, no canonical or mirror mutation before promotion, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness.

Do not treat `Read(SKILL.md)` or `skill(deep-improvement)` as evidence that this protocol executed.

---

## 3. RELATED RESOURCES

- `../shared/loop_protocol.md`
- `../shared/runtime_truth_contracts.md`
- `score_dimensions.md`
- `../../scripts/shared/promote-candidate.cjs`

exec
 succeeded in 0ms:
---
description: "The calibration protocol for independent graders: different-family requirement, calibrate.py two-grader agreement flow, the recorded first calibration, phantom-gap tracking, and the strict-JSON grader reply contract."
trigger_phrases:
  - "different-family grader requirement"
  - "two-grader agreement flow"
  - "phantom-gap tracking"
  - "strict-json grader reply"
importance_tier: normal
contextType: implementation
version: 1.17.0.3
---


The calibration protocol that keeps independent grades trustworthy. A grader that drifts or disagrees with its calibration baseline produces promotion decisions that are no better than self-scoring.

---

## 1. OVERVIEW

### Purpose

Provides the calibration protocol for independent graders in packagings, ensuring grades remain trustworthy across model changes and iterations.

### When to Use

- Setting up a new grader model
- Validating grader agreement after a model change
- Diagnosing phantom-gap drift or reward-hacking signals

### Core Principle

A grader that drifts or disagrees with its calibration baseline produces promotion decisions that are no better than self-scoring.

---

## 2. DIFFERENT-FAMILY REQUIREMENT

The grader must be a different model family from whatever produced the outputs. The loop checks `GRADER_MODEL` against `PROPOSER_FAMILY` substring and raises a kill-switch on a match (e.g. a deepseek grader for a deepseek proposer).

This is a hard gate, not a preference. Same-family graders inherit the proposer's biases and blind spots, defeating the purpose of independent evaluation.

Hard rules (banned vocabulary, structural rules) are checked by a deterministic code linter (`benchmark/grader/deterministic_lint.py`), never by a model.

---

## 3. CALIBRATE.PY TWO-GRADER AGREEMENT FLOW

`calibrate.py` runs two independent graders over the same gold outputs and measures their agreement:

- **PROCEED** — mean absolute disagreement <= 2.0 of 25. The grader is trustworthy.
- **RECALIBRATE** — mean absolute disagreement above 2.0 of 25. The grader has drifted. Recalibrate before trusting new grades.
- **UNMEASURABLE** — n=0 gold outputs available. Cannot assess agreement.

Run `calibrate.py` whenever the grader model changes. The gold set must be version-locked and outside any tree the loop can write.

---

## 4. THE RECORDED FIRST CALIBRATION

The first calibration recorded in the pilot: MiMo (the proposer) vs an independent Claude read. Mean absolute disagreement was approximately 1.0 of 25, well within the PROCEED threshold.

This baseline establishes that the two-grader agreement flow works and that a different-family grader produces stable, low-disagreement grades.

---

## 5. PHANTOM-GAP TRACKING


A widening phantom gap is a reward-hacking signal. The convergence check requires the phantom gap to be shrinking (or stable) for the loop to continue. If the gap widens while the independent score holds steady, the proposer is learning to game the self-score without real improvement.

---

## 6. STRICT-JSON GRADER REPLY CONTRACT

Grader replies follow a strict-JSON contract: single-line JSON, no fences, no commentary. The expected shape:

```json
{"M": 3, "E": 7, "Q": 5, "T": 3, "D": 2, "total": 20, "floors_met": true, "notes": "one short line"}
```

Parsers stay tolerant and record explicit `grader_error` values. An auth failure must be diagnosable from the record, not parsed as a zero score (teaching T11).

---

## 7. HVR_VIOLATIONS OBSERVABILITY

The deterministic linter (`deterministic_lint.py`) checks graded output against the packaging's hard-blocker words and patterns. Violations are recorded as `hvr_violations` in the grade record.

A hard-blocker lint failure on the CANDIDATE'S held-out output is a hard kill-switch: the loop halts without promoting. (Lint failures on visible-benchmark output are recorded in the grade records and depress the score, but do not halt.) This catches cases where the proposer introduces banned vocabulary into technique docs that then bleed into generated output.

---

## 8. GOLD-SET MAINTENANCE

- A gold set anchors the grader, not the proposer.
- Keep gold outputs and target scores version-locked outside any tree a loop can write.
- Re-score the gold set whenever the grader model changes.
- Disagreement beyond about 2 of 25 (or 8 of 100) means recalibrate before trusting new grades.
- Gold fixtures are never optimized against. They are calibration anchors only.

---

## 9. RELATED RESOURCES

- [loop_contract.md](./loop_contract.md) — the formal benchmark/_loop/loop.py contract
- [guardrails_teachings.md](./guardrails_teachings.md) — T1 (self-scores unsafe), T3 (different-family grader), T11 (auth probes)
- [fixture_authoring.md](./fixture_authoring.md) — gold-set authoring rules
- [operator_guide.md](./operator_guide.md) — conformance checklist and invocation

exec
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     706 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs
     115 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs
     776 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
     338 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs
     855 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
    2790 total

exec
/bin/zsh -lc 'rg -n "raw|dimension|promotionGates|weightedScore|recommendation|variance|repeatability|shadow|metamorphic|adversarial|held.?out|gold|blind|calibrat" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:448:      dimensions: {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:465:  const score = Math.round((result.weightedScore || 0) * 100);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:470:  for (const [dim, value] of Object.entries(result.dimensions || {})) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:482:    dimensions: result.dimensions || {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:611:    // blind spots. Refuse unless explicitly overridden.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:710:    const recommendation =
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:752:      recommendation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:756:        repeatabilityTolerance: profile.benchmark?.repeatabilityTolerance ?? 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:802:        recommendation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:843:        recommendation: 'infra_failure',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs:32: * Evaluate scored dimensions against the per-dimension promotion thresholds.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs:34: * @param {Array<Object>} dimensions - Dimensions with name and score fields.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs:37:function evaluatePromotionGates(dimensions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs:38:  const byName = new Map((dimensions || []).map((dimension) => [dimension.name, dimension]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs:44:    const dimension = byName.get(name);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs:45:    const score = dimension ? dimension.score : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:2:// ║ benchmark-stability — score variance & weight optimization advisory      ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:31: * Default minimum session count before weight optimizer produces recommendations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:38: * The 5 scoring dimensions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:91:  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:92:  return Math.sqrt(variance);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:97: * Perfect stability = 1.0, high variance = low coefficient.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:114: * per-dimension stability coefficients.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:116: * @param {object[]} results - Array of benchmark result objects, each with { dimensions: [{ name, score }] } or { scores: { dim: number } }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:118: * @returns {{ dimensions: object, stable: boolean, warnings: string[] }|{state: string, replayCount: number, minRequired: number, reason: string}}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:137:  const dimensionScores = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:139:    dimensionScores[dim] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:144:    if (result.dimensions && Array.isArray(result.dimensions)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:145:      for (const dim of result.dimensions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:146:        if (dimensionScores[dim.name] !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:147:          dimensionScores[dim.name].push(dim.score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:153:          dimensionScores[dim].push(result.scores[dim]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:159:  const dimensionResults = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:164:    const scores = dimensionScores[dim];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:166:      dimensionResults[dim] = { coefficient: 1.0, mean: 0, stddev: 0, samples: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:174:    dimensionResults[dim] = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:188:    dimensions: dimensionResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:198: * @param {number} [maxVariance] - Maximum acceptable variance (1 - coefficient). Default: 0.05.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:199: * @returns {boolean} True if all dimensions have acceptable variance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:209:    const dimResult = stabilityResult.dimensions[dim];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:222: * Generate weight optimization recommendations based on historical session data.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:225: * @param {object[]} sessionHistory - Array of session summary objects with { dimensions: [{ name, score }], outcome? }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:226: * @param {object} currentWeights - Current dimension weights: { structural, ruleCoherence, integration, outputQuality, systemFitness }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:228: * @returns {{ recommendations: object, sufficient: boolean, report: string }}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:238:      recommendations: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:244:  // Compute per-dimension variance across sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:245:  const dimensionVariances = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:249:      if (session.dimensions && Array.isArray(session.dimensions)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:250:        const dimEntry = session.dimensions.find((d) => d.name === dim);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:258:    dimensionVariances[dim] = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:265:  // Simple heuristic: dimensions with consistently low scores deserve higher weight;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:266:  // dimensions with high variance should be investigated before weight changes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:272:    const dimData = dimensionVariances[dim];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:274:    // If a dimension consistently scores low (mean < 80), suggest increasing weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:305:    const data = dimensionVariances[dim];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:312:  reportLines.push('NOTE: These recommendations are advisory only. Do NOT auto-apply.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:316:    recommendations: recommended,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:66:  const raw = fs.readFileSync(filePath, 'utf8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:67:  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:196:    repeatabilityReportPath: context.resolvedRepeatabilityReportPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:429:  const repeatabilityReportPath = args['repeatability-report'] || acceptedState?.repeatabilityReportPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:440:  // is the Lane A agent path (scored candidate + agent dimension gates, byte-
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:444:  // requirement and agent dimension gates. The shared guards (config promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:445:  // flags, benchmark/repeatability gates, single canonical target, and agent-
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:450:    process.stderr.write('Usage (Lane A / agent): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:451:    process.stderr.write('Usage (Lane B / benchmark): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:457:  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:458:  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:514:  if (benchmarkReport.recommendation !== 'benchmark-pass') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:515:    failGate(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}`, { errorType: 'benchmark_gate_failed' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:538:  if (!repeatabilityReport) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:539:    failGate(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}`, { errorType: 'repeatability_gate_failed' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:542:  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:543:    failGate(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}`, { errorType: 'repeatability_gate_failed' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:546:  if (repeatabilityReport.passed !== true) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:547:    failGate('Cannot promote: repeatability check did not pass', { errorType: 'repeatability_gate_failed' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:583:  // recommendation, weighted score gate, 5-dimension gates, score delta) only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:586:  // aggregate gate + repeatability) and skips these agent-only checks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:589:    if (score.recommendation !== 'candidate-better') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:590:      failGate(`Cannot promote: recommendation is ${score.recommendation}`, { errorType: 'score_gate_failed' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:597:    const dimensionGate = evaluatePromotionGates(score.dimensions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:598:    if (!dimensionGate.passed) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:599:      failGate(`Cannot promote: dimension gates failed ${dimensionGate.failed.concat(dimensionGate.unscored).join(', ')}; thresholds ${JSON.stringify(PROMOTION_GATES)}`, { errorType: 'dimension_gate_failed' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:685:      repeatabilityReport: resolvedRepeatabilityReportPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:736:        repeatabilityReport: resolvedRepeatabilityReportPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:749:        repeatabilityReport: resolvedRepeatabilityReportPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:756:        recommendation: benchmarkReport.recommendation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:765:        repeatabilityReport: resolvedRepeatabilityReportPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:2:// ║ score-candidate — 5-dimension candidate evaluation framework            ║
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:11://   delta: total and per-dimension candidate-minus-baseline score deltas
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:128:  const raw = safeRead(manifestPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:129:  if (typeof raw !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:130:    return { error: raw.error };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:133:    return JSON.parse(stripJsonComments(raw));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:337:    raw: { mirrorScore, commandScore, skillScore, mirrorStatus: summary.mirrorSyncStatus },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:358:  const raw = maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:359:  return { score: Math.max(0, raw - placeholderPenalty), details, maxPossible, placeholders };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:450:  const dimensions = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:458:  const unscoredDimensions = dimensions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:461:  const weightedScore = unscoredDimensions.length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:463:    : Math.round(dimensions.reduce((sum, d) => sum + d.score * d.weight, 0));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:466:    weightedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:467:    dimensions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:473:function dimensionDelta(candidateDimensions, baselineDimensions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:488:  const raw = args.thresholdDelta ?? manifest?.scoring?.thresholdDelta ?? manifest?.scoring?.minimumDelta ?? 2;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:489:  const parsed = Number(raw);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:522:  // Dynamic mode is the only evaluation path. generate-profile.cjs + 5-dimension scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:606:    // miss the cache and rescore. Score/dimension outputs for a given candidate path are
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:616:    dimensionConfig: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:618:      promotionGates: PROMOTION_GATES,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:642:    baselineScore = baselineResult.weightedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:644:      total: dynamicResult.weightedScore !== null && baselineResult.weightedScore !== null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:645:        ? dynamicResult.weightedScore - baselineResult.weightedScore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:647:      dimensions: dimensionDelta(dynamicResult.dimensions, baselineResult.dimensions),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:652:  const recommendation = hasUnscoredDimensions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:657:        : (dynamicResult.weightedScore >= WEIGHTED_SCORE_GATE ? 'candidate-acceptable' : 'keep-baseline'))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:658:      : (dynamicResult.weightedScore >= WEIGHTED_SCORE_GATE ? 'candidate-acceptable' : 'needs-improvement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:659:  const promotionGateResult = evaluatePromotionGates(dynamicResult.dimensions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:676:    score: dynamicResult.weightedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:680:    dimensions: dynamicResult.dimensions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:683:    promotionGates: promotionGateResult,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:684:    recommendation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:689:      ...dynamicResult.dimensions

exec
/bin/zsh -lc "sed -n '200,500p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
// inputHash. Treat the embedded blob as untrusted on read: require cached.inputHash to
// equal the recomputed inputHash AND a scored status. Any mismatch (tampered or stale
// blob, wrong-key file dropped into the cache dir, parse failure) is a cache MISS so the
// caller recomputes rather than trusting an unverified payload.
function readCachedScore(cacheDir, inputHash) {
  const cachePath = cachePathFor(cacheDir, inputHash);
  if (!fs.existsSync(cachePath)) {
    return null;
  }
  let cached;
  try {
    cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (_err) {
    return null;
  }
  if (!cached || typeof cached !== 'object') {
    return null;
  }
  if (cached.inputHash !== inputHash || cached.status !== 'scored') {
    return null;
  }
  return cached;
}

function writeCachedScore(cacheDir, inputHash, result) {
  writeJson(cachePathFor(cacheDir, inputHash), result);
}

function runScript(scriptName, args) {
  const scriptPath = path.join(__dirname, scriptName);
  try {
    const out = execFileSync('node', [scriptPath, ...args], { encoding: 'utf8', timeout: 15000 });
    try {
      return JSON.parse(out);
    } catch (err) {
      return serializeTypedError(makeTypedError(ERROR_TYPES.PARSE_ERROR, `Failed to parse ${scriptName} output: ${err.message}`, { scriptName }));
    }
  } catch (err) {
    const childError = parseTypedError(err.stderr);
    if (childError) {
      return childError;
    }
    const errorType = err.status === EXIT_CODES[ERROR_TYPES.FILE_NOT_FOUND]
      ? ERROR_TYPES.FILE_NOT_FOUND
      : ERROR_TYPES.SCRIPT_CRASH;
    return serializeTypedError(makeTypedError(errorType, `${scriptName} failed: ${err.message}`, { scriptName, status: err.status || null }));
  }
}

function scoreDimStructural(profile, content) {
  const checks = profile.derivedChecks?.structural || [];
  if (checks.length === 0) { return { score: null, details: [], maxPossible: 0, unscored: true }; }
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  let earned = 0;
  const details = [];
  for (const check of checks) {
    const sectionName = check.description.replace('Agent has ', '').replace(' section', '').toUpperCase();
    const pass = new RegExp(`## \\d+\\.\\s+.*${sectionName.split(' ')[0]}`, 'i').test(content);
    if (pass) { earned += check.weight; }
    details.push({ id: check.id, pass, weight: check.weight });
  }
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDimRuleCoherence(profile, content) {
  const rules = profile.derivedChecks?.ruleCoherence || [];
  if (rules.length === 0) { return { score: null, details: [], maxPossible: 0, unscored: true }; }
  const lower = content.toLowerCase();
  const maxPossible = rules.reduce((s, r) => s + r.weight, 0);
  let earned = 0;
  const details = [];
  for (const rule of rules) {
    const keywords = rule.rule.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 4);
    const matchCount = keywords.filter((kw) => lower.includes(kw)).length;
    const pass = keywords.length > 0 && matchCount >= Math.ceil(keywords.length * 0.5);
    if (pass) { earned += rule.weight; }
    details.push({ id: rule.id, type: rule.type, rule: rule.rule, pass, matchRatio: keywords.length > 0 ? matchCount / keywords.length : 0 });
  }
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function analyzeRuntimeMirrorCoverage(report) {
  const mirrors = Array.isArray(report?.surfaces?.mirrors) ? report.surfaces.mirrors : [];
  const expectedCount = 4;
  const consideredCount = mirrors.length;
  const passed = consideredCount === expectedCount;
  return {
    checkpoint: 'runtime-mirror-coverage-considered',
    expectedCount,
    consideredCount,
    passed,
    paths: mirrors.map((mirror) => mirror.path).filter(Boolean),
    warning: passed
      ? null
      : `Expected ${expectedCount} runtime mirrors to be considered; saw ${consideredCount}`,
  };
}

function scoreDimIntegration(agentName, integrationReport) {
  const report = integrationReport || runScript('scan-integration.cjs', [`--agent=${agentName}`]);
  if (!report || report.status !== 'complete') {
    const runtimeMirrorCoverage = analyzeRuntimeMirrorCoverage(report);
    return {
      score: 0,
      details: [
        { id: 'scanner-failed', pass: false },
        { id: 'runtime-mirror-coverage-considered', pass: false, ...runtimeMirrorCoverage },
      ],
      maxPossible: 100,
      runtimeMirrorCoverage,
    };
  }
  const summary = report.summary;
  let mirrorScore = 100;
  for (const m of report.surfaces?.mirrors || []) {
    // F017-P2-06 (017 review): read mirror.status || mirror.syncStatus so this
    // lane normalizes the same field run-benchmark.cjs scoreIntegration does. The
    // scan-integration scanner emits syncStatus, so for every real input m.status
    // is undefined and this is byte-identical to reading m.syncStatus directly; the
    // fallback only removes the cross-lane field asymmetry the review flagged.
    const mStatus = m.status || m.syncStatus;
    if (mStatus === 'diverged') { mirrorScore -= 20; }
    else if (mStatus === 'missing') { mirrorScore -= 30; }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const commandScore = summary.commandCount > 0 ? 100 : 0;
  const skillScore = summary.skillCount > 0 ? 100 : 0;
  const score = Math.round(mirrorScore * 0.6 + commandScore * 0.2 + skillScore * 0.2);
  return {
    score,
    details: [
      { id: 'mirror-parity', pass: mirrorScore === 100, score: mirrorScore },
      { id: 'command-coverage', pass: commandScore > 0, count: summary.commandCount },
      { id: 'skill-coverage', pass: skillScore > 0, count: summary.skillCount },
      { id: 'runtime-mirror-coverage-considered', pass: analyzeRuntimeMirrorCoverage(report).passed, ...analyzeRuntimeMirrorCoverage(report) },
    ],
    maxPossible: 100,
    raw: { mirrorScore, commandScore, skillScore, mirrorStatus: summary.mirrorSyncStatus },
    runtimeMirrorCoverage: analyzeRuntimeMirrorCoverage(report),
  };
}

function scoreDimOutputQuality(profile, content) {
  const checks = profile.derivedChecks?.outputChecks || [];
  if (checks.length === 0) { return { score: null, details: [], maxPossible: 0, unscored: true }; }
  const lower = content.toLowerCase();
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  let earned = 0;
  const details = [];
  for (const check of checks) {
    const keywords = check.check.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 3);
    const pass = keywords.length > 0 && keywords.filter((kw) => lower.includes(kw)).length >= Math.ceil(keywords.length * 0.5);
    if (pass) { earned += check.weight; }
    details.push({ id: check.id, pass, check: check.check });
  }
  // Penalty for placeholder content
  const placeholders = (content.match(/\[YOUR_VALUE_HERE\]|\[TODO\]|\[TBD\]|\[PLACEHOLDER\]/gi) || []).length;
  const placeholderPenalty = Math.min(30, placeholders * 10);
  const raw = maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100;
  return { score: Math.max(0, raw - placeholderPenalty), details, maxPossible, placeholders };
}

// F017-P2-13b (017 review): command/skill refs come from candidate-derived profile
// content, then get interpolated into fs.existsSync paths below. Without a charset guard
// a hostile ref (e.g. a skill "../../etc" or a command "/../../secret") turns
// resource-refs-valid into a traversal-based existence oracle and perturbs the score.
// Restrict each ref segment to a basename charset (mirrors run-benchmark SAFE_FIXTURE_ID)
// and reject '.'/'..' / separators before the ref ever reaches the filesystem. A command
// ref maps ':' to a path separator, so it is validated per segment after that split.
const SAFE_REF_SEGMENT = /^[A-Za-z0-9._-]+$/;

function isSafeRefSegment(segment) {
  return (
    typeof segment === 'string'
    && segment.length > 0
    && segment !== '.'
    && segment !== '..'
    && SAFE_REF_SEGMENT.test(segment)
  );
}

function isSafeCommandRef(cmd) {
  if (typeof cmd !== 'string' || cmd.length === 0) {
    return false;
  }
  const stripped = cmd.replace(/^\//, '');
  const segments = stripped.split(':');
  return segments.length > 0 && segments.every(isSafeRefSegment);
}

function scoreDimSystemFitness(profile, content) {
  const details = [];
  let earned = 0;
  let maxPossible = 0;

  // Check permission-capability alignment
  const mismatches = profile.derivedChecks?.capabilityMismatches || [];
  maxPossible += 40;
  if (mismatches.length === 0) {
    earned += 40;
    details.push({ id: 'perm-capability-align', pass: true });
  } else {
    details.push({ id: 'perm-capability-align', pass: false, mismatches });
  }

  // Check for orphaned resource references
  const integration = profile.derivedChecks?.integrationPoints || {};
  const commands = integration.commands || [];
  const skills = integration.skills || [];
  maxPossible += 30;
  let refsValid = 0;
  let refsTotal = 0;
  for (const cmd of commands) {
    refsTotal++;
    if (!isSafeCommandRef(cmd)) { continue; }
    const cmdPath = cmd.replace(/^\//, '').replace(/:/g, '/');
    if (fs.existsSync(`.opencode/commands/${cmdPath}.md`)) { refsValid++; }
  }
  for (const sk of skills) {
    refsTotal++;
    if (!isSafeRefSegment(sk)) { continue; }
    if (fs.existsSync(`.opencode/skills/${sk}/SKILL.md`)) { refsValid++; }
  }
  const refScore = refsTotal > 0 ? Math.round(30 * refsValid / refsTotal) : 30;
  earned += refScore;
  details.push({ id: 'resource-refs-valid', pass: refsValid === refsTotal, valid: refsValid, total: refsTotal });

  // Check frontmatter completeness
  maxPossible += 30;
  const hasFrontmatter = /^---\n[\s\S]*?\n---/.test(content);
  const hasName = /^name:\s+\S/m.test(content);
  const hasMode = /^mode:\s+\S/m.test(content);
  const hasPermission = /^permission:\s*$/m.test(content);
  const fmScore = [hasFrontmatter, hasName, hasMode, hasPermission].filter(Boolean).length * 7.5;
  earned += fmScore;
  details.push({ id: 'frontmatter-complete', pass: fmScore >= 30, score: fmScore });

  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDynamic(candidateContent, agentName, profile, weights, integrationReport) {
  // Accept optional weights override; fall back to hardcoded defaults for backward compat
  const effectiveWeights = weights || DIMENSION_WEIGHTS;

  const structural = scoreDimStructural(profile, candidateContent);
  const ruleCoherence = scoreDimRuleCoherence(profile, candidateContent);
  const integration = scoreDimIntegration(agentName, integrationReport);
  const outputQuality = scoreDimOutputQuality(profile, candidateContent);
  const systemFitness = scoreDimSystemFitness(profile, candidateContent);

  const dimensions = [
    { name: 'structural', score: structural.score, weight: effectiveWeights.structural, details: structural.details, maxPossible: structural.maxPossible },
    { name: 'ruleCoherence', score: ruleCoherence.score, weight: effectiveWeights.ruleCoherence, details: ruleCoherence.details, maxPossible: ruleCoherence.maxPossible },
    { name: 'integration', score: integration.score, weight: effectiveWeights.integration, details: integration.details, maxPossible: integration.maxPossible },
    { name: 'outputQuality', score: outputQuality.score, weight: effectiveWeights.outputQuality, details: outputQuality.details, maxPossible: outputQuality.maxPossible },
    { name: 'systemFitness', score: systemFitness.score, weight: effectiveWeights.systemFitness, details: systemFitness.details, maxPossible: systemFitness.maxPossible },
  ];

  const unscoredDimensions = dimensions
    .filter((d) => d.score === null)
    .map((d) => d.name);
  const weightedScore = unscoredDimensions.length > 0
    ? null
    : Math.round(dimensions.reduce((sum, d) => sum + d.score * d.weight, 0));

  return {
    weightedScore,
    dimensions,
    unscoredDimensions,
    runtimeMirrorCoverage: integration.runtimeMirrorCoverage,
  };
}

function dimensionDelta(candidateDimensions, baselineDimensions) {
  const baselineByName = new Map((baselineDimensions || []).map((entry) => [entry.name, entry]));
  return (candidateDimensions || []).map((entry) => {
    const baseline = baselineByName.get(entry.name);
    return {
      name: entry.name,
      score: entry.score,
      baselineScore: baseline ? baseline.score : null,
      delta: baseline && entry.score !== null && baseline.score !== null ? entry.score - baseline.score : null,
      weight: entry.weight,
    };
  });
}

function resolveThresholdDelta(args, manifest) {
  const raw = args.thresholdDelta ?? manifest?.scoring?.thresholdDelta ?? manifest?.scoring?.minimumDelta ?? 2;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 2;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidatePath = args.candidate;
  const baselinePath = args.baseline;
  const manifestPath = args.manifest;
  const targetPath = args.target || candidatePath;
  const outputPath = args.output;
  const cacheDisabled = args['no-cache'] === true || args['no-cache'] === 'true';

exec
/bin/zsh -lc "sed -n '580,706p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
        failureModes: ['baseline-read-failure'],
      });
    }

    baselineProfile = runScript('generate-profile.cjs', [`--agent=${baselinePath}`]);
    if (!baselineProfile || !baselineProfile.id) {
      emitInfraFailure(outputPath, {
        target: targetPath,
        candidate: candidatePath,
        baseline: baselinePath,
        error: baselineProfile?.message || 'Failed to generate dynamic profile for baseline',
        errorType: baselineProfile?.errorType || 'UNKNOWN',
        failureModes: [`baseline-profile-generation-${(baselineProfile?.errorType || 'failure').toLowerCase()}`],
      });
    }

    baselineIntegrationReport = runScript('scan-integration.cjs', [`--agent=${baselineProfile.id}`]);
  }

  const effectiveWeights = weightsOverride || DIMENSION_WEIGHTS;
  const inputHash = computeInputHash({
    rubricVersion: RUBRIC_VERSION,
    // F-P1-12: bind candidate identity into the cache key. Previously the hash covered
    // candidateContent + targetPath but not the candidate/baseline paths, so a stale
    // cache entry for one candidate could be served for a different candidate whose
    // content/profile happened to hash the same. Keying on the paths makes a mismatch
    // miss the cache and rescore. Score/dimension outputs for a given candidate path are
    // unchanged (paths are part of the key, not the scoring math).
    candidatePath,
    baselinePath: baselinePath || null,
    candidateContent,
    baselineContent: typeof baselineContent === 'string' ? baselineContent : null,
    targetPath,
    manifest: manifest || null,
    profile: stripVolatileFields(profile),
    baselineProfile: stripVolatileFields(baselineProfile),
    dimensionConfig: {
      weights: effectiveWeights,
      promotionGates: PROMOTION_GATES,
    },
    integrationReports: {
      candidate: stripVolatileFields(candidateIntegrationReport),
      baseline: stripVolatileFields(baselineIntegrationReport),
    },
  });

  if (!cacheDisabled) {
    const cached = readCachedScore(cacheDir, inputHash);
    if (cached) {
      if (outputPath) {
        writeJson(outputPath, cached);
      } else {
        process.stdout.write(`${JSON.stringify(cached, null, 2)}\n`);
      }
      return;
    }
  }

  const dynamicResult = scoreDynamic(candidateContent, agentName, profile, weightsOverride, candidateIntegrationReport);

  if (baselinePath) {
    baselineResult = scoreDynamic(baselineContent, baselineProfile.id, baselineProfile, weightsOverride, baselineIntegrationReport);
    baselineScore = baselineResult.weightedScore;
    delta = {
      total: dynamicResult.weightedScore !== null && baselineResult.weightedScore !== null
        ? dynamicResult.weightedScore - baselineResult.weightedScore
        : null,
      dimensions: dimensionDelta(dynamicResult.dimensions, baselineResult.dimensions),
    };
  }

  const hasUnscoredDimensions = dynamicResult.unscoredDimensions.length > 0;
  const recommendation = hasUnscoredDimensions
    ? 'needs-improvement'
    : baselineResult
      ? (delta.total >= thresholdDelta
        ? 'candidate-better'
        : (dynamicResult.weightedScore >= WEIGHTED_SCORE_GATE ? 'candidate-acceptable' : 'keep-baseline'))
      : (dynamicResult.weightedScore >= WEIGHTED_SCORE_GATE ? 'candidate-acceptable' : 'needs-improvement');
  const promotionGateResult = evaluatePromotionGates(dynamicResult.dimensions);
  const warnings = [];
  if (dynamicResult.runtimeMirrorCoverage && !dynamicResult.runtimeMirrorCoverage.passed) {
    warnings.push(dynamicResult.runtimeMirrorCoverage.warning);
  }

  const result = {
    status: 'scored',
    rubricVersion: RUBRIC_VERSION,
    inputHash,
    profileId: resolvedProfileId,
    family: family || profile.family,
    evaluationMode: 'dynamic-5d',
    mode: 'agent-improvement',
    target: targetPath,
    candidate: candidatePath,
    baseline: baselinePath || null,
    score: dynamicResult.weightedScore,
    baselineScore,
    delta,
    thresholdDelta,
    dimensions: dynamicResult.dimensions,
    unscoredDimensions: dynamicResult.unscoredDimensions,
    runtimeMirrorCoverage: dynamicResult.runtimeMirrorCoverage,
    promotionGates: promotionGateResult,
    recommendation,
    warnings,
    failureModes: [
      ...dynamicResult.unscoredDimensions.map((name) => `unscored-${name}`),
      ...warnings.map(() => 'runtime-mirror-coverage-warning'),
      ...dynamicResult.dimensions
        .filter((d) => typeof d.score === 'number' && d.score < 60)
        .map((d) => `weak-${d.name}`),
    ],
  };

  if (!cacheDisabled) {
    writeCachedScore(cacheDir, inputHash, result);
  }

  if (outputPath) {
    writeJson(outputPath, result);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

main();

codex
The local contract already has five dimension gates, held-out/gold tiers, cross-family grading, two-phase accept/ship, and repeatability checks. The material gap is narrower: scores are rounded before aggregation, promotion consumes reduced summaries rather than immutable per-trial evidence, and there is no first-class metamorphic suite or post-accept shadow lane. I’m testing references against those exact seams.
web search: 
web search: site:github.com/BraintrustData/braintrust-sdk Eval scores trials experiment compare GitHub ...
web search: 
web search: https://github.com/braintrustdata/braintrust-sdk
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:github.com/braintrustdata/braintrust-sdk-javascript "Eval" "scores" "trial" ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/microsoft/waza/tree/main/internal
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:braintrust.dev/docs eval trials scores metadata Braintrust Eval API ...
web search: 
web search: 
web search: 
web search: GitHub LLM metamorphic testing repository prompts 2025 ...
web search: 
web search: LLMORPH GitHub automated metamorphic testing LLM ...
web search: 
web search: https://github.com/steven-b-cho/llmorph
web search: 
web search: https://github.com/confident-ai/deepeval/blob/main/deepeval/metrics/arena_g_eval/arena_g_eval.py
web search: 
web search: 
web search: 
web search: https://github.com/confident-ai/deepeval/blob/main/deepeval/metrics/arena_g_eval/utils.py
web search: 
web search: https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py
web search: 
web search: 'sel_mode'
web search: 
web search: https://github.com/braintrustdata/autoevals/tree/main/py/autoevals
hook: PreCompact
hook: PreCompact
hook: PreCompact Completed
hook: PreCompact Failed
context compacted
web search: 
web search: https://github.com/braintrustdata/autoevals/blob/main/py/autoevals/score.py
codex
Iteration 18 verdict: deep-improvement already has a strong rubric and two-phase promotion contract. The remaining leverage is to turn evaluation into an evidence-preserving transaction: immutable raw trials, calibrated reductions, blind comparison, metamorphic relations, and a post-accept shadow state.

### Mechanisms worth adopting

1. **Separate observations from score reduction.** [Waza’s grader interface](https://github.com/microsoft/waza/blob/main/internal/graders/grader.go) receives captured transcripts, workspace files, session digests, skill invocations, and baseline output. [Autoevals](https://github.com/braintrustdata/autoevals) similarly distinguishes normalized scores from evaluator metadata and rationale. Deep-improvement should expose three APIs:

   `grade(runReceipt) -> TrialScore[]`  
   `reduce(trials, calibrationVersion) -> ScoreView`  
   `decide(scoreView, gatePolicy) -> PromotionReceipt`

   `TrialScore` should retain candidate/evaluator digests, fixture commitment, seed, judge family, dimension, raw value and scale, rationale digest, normalized value, calibration version, cost, and latency. Never round before persistence.

   Calibrate ordinal judge outputs against gold anchors using versioned isotonic mappings. Compute candidate-versus-baseline deltas with paired fixture bootstrap. Promotion should require non-negative lower bounds on critical dimensions; the weighted aggregate becomes a ranking display, not an escape hatch for a failed dimension.

2. **Blind the comparative evaluator in both orientations.** [DeepEval’s `ArenaGEval`](https://github.com/confident-ai/deepeval/blob/main/deepeval/metrics/arena_g_eval/arena_g_eval.py) masks contestant identities and randomizes their order. Deep-improvement should go further: evaluate salted aliases in both `A,B` and `B,A` order, retain both raw judgments, and adjudicate order-sensitive disagreement. This directly strengthens the open commit-before-view benchmark.

3. **Use evolutionary generation without scalar-only survival.** [EvoPrompt’s `evoluter.py`](https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py) supplies concrete GA/DE parent selection, crossover, mutation, and incumbent replacement. Borrow the operators, but maintain a Pareto archive over the five dimensions plus cost and metamorphic violations. A reasonable generation mix is targeted reflection from the weakest dimension, single-slot mutation, crossover between non-dominated candidates, and a small novelty restart budget. Each candidate must declare its mutated genome slots.

4. **Make metamorphic relations executable evaluator assets.** [LLMorph](https://github.com/steven-b-cho/llmorph) separates input transformation from the output-relation oracle and records paired source/follow-up executions; its paper reports 36 implemented relations and more than 561,000 executions ([paper](https://arxiv.org/abs/2603.23611)). Deep-improvement should define `precondition`, `transform`, and `oracle` plugins for paraphrase invariance, irrelevant-context insertion, instruction injection, denied-tool aliasing, independent-tool reordering, and budget reduction. Promotion fails on newly introduced relation violations even when the ordinary aggregate rises.

### Guarded promotion and moat

Add `shadowing` between `accepted` and `ship_eligible`. The candidate replays sampled real packets in a read-only sandbox against the incumbent, using the frozen evaluator capsule and blind paired comparison. Gate on per-dimension lower bounds, metamorphic violations, judge disagreement, and tail cost. Immutable experiment snapshots and repeated trials follow the pattern documented by [Braintrust evaluations](https://www.braintrust.dev/docs/evaluate/run-evaluations).

The uniqueness thesis is sharper than “better prompt optimization”: deep-improvement owns a **measurement-controlled mutation transaction**. Deep-research gathers evidence, deep-review diagnoses, council deliberates, and alignment checks constraints; none uniquely binds a mutable agent genome to a hidden evaluator, immutable raw receipts, calibrated promotion evidence, shadow execution, and guarded canonicalization. Naive self-improvement lets the optimizer observe or influence its own objective. Deep-improvement’s moat is the authority boundary that prevents that feedback loop—not the cleverness of its mutation model.

```json
{
  "new_repos": [
    {
      "name": "microsoft/waza",
      "url": "https://github.com/microsoft/waza",
      "stars": "~1.1k",
      "what": "Agent-skill evaluation framework with captured workspace/session evidence, deterministic and prompt graders, adversarial packs, snapshots, and a v0.38.0 release in June 2026.",
      "lesson": "Give frozen graders a narrow interface over captured run receipts rather than access to mutable candidate execution state.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "braintrustdata/autoevals",
      "url": "https://github.com/braintrustdata/autoevals",
      "stars": "~970",
      "what": "Evaluator library whose scorer results separate normalized scores from raw metadata and rationale; JavaScript v0.3.0 released in June 2026.",
      "lesson": "Persist raw evaluator observations independently from versioned normalization and score reduction.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "confident-ai/deepeval",
      "url": "https://github.com/confident-ai/deepeval",
      "stars": "~16.9k",
      "what": "Evaluation framework with ArenaGEval candidate masking and randomized comparison order; Python 4.1.0 released in July 2026.",
      "lesson": "Use salted candidate aliases and order-swapped pairwise judging to reduce identity and position bias during promotion.",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "beeevita/EvoPrompt",
      "url": "https://github.com/beeevita/EvoPrompt",
      "stars": "~248",
      "what": "ICLR 2024 reference implementation of GA and differential-evolution prompt optimization with explicit crossover, mutation, parent selection, and incumbent replacement.",
      "lesson": "Adopt evolutionary candidate operators but replace scalar top-k survival with five-dimensional Pareto or lexicase selection.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "steven-b-cho/llmorph",
      "url": "https://github.com/steven-b-cho/llmorph",
      "stars": "~5",
      "what": "ICSME 2025 metamorphic-testing artifact implementing 36 relations and retaining paired source/follow-up executions; paper updated in 2026.",
      "lesson": "Represent robustness checks as executable precondition-transform-oracle relations with paired immutable receipts.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Raw trial evidence must be append-only and reduction-independent: candidate, evaluator, fixture, seed, judge family, raw scale, rationale digest, normalization version, cost, and latency should survive every later score-policy change.",
      "evidence": "microsoft/waza internal/graders/grader.go and braintrustdata/autoevals",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Candidate-blind judging should run both presentation orders; disagreement between AB and BA is evidence of evaluator instability, not noise to average away silently.",
      "evidence": "https://github.com/confident-ai/deepeval/blob/main/deepeval/metrics/arena_g_eval/arena_g_eval.py",
      "maps_to": [
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evolutionary mutation is useful for breadth, but survival should use per-dimension Pareto or lexicase selection so gains in one dimension cannot conceal regressions in another.",
      "evidence": "https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Metamorphic evaluation converts underspecified robustness expectations into executable paired oracles and can detect regressions without requiring a unique gold output.",
      "evidence": "https://github.com/steven-b-cho/llmorph and https://arxiv.org/abs/2603.23611",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an append-only TrialScore ledger and split grading, calibration, reduction, and promotion into separately versioned stages. Preserve pre-reduction values; calibrate ordinal judges against gold anchors; compute paired per-dimension lower bounds; prohibit aggregate compensation for critical-dimension regressions.",
      "target": "deep-improvement / runtime/state-jsonl-checkpointing / runtime/gauges-observability",
      "rationale": "The current rounded weighted score cannot be recalibrated or audited without rerunning candidates, and its aggregate may hide dimension-specific deterioration.",
      "uniqueness": "Turns deep-improvement into an auditable measurement authority rather than another prompt optimizer.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/microsoft/waza and https://github.com/braintrustdata/autoevals"
    },
    {
      "rec": "Replace single-candidate generation with a budgeted portfolio of targeted reflection, single-slot mutation, crossover, and novelty restart; retain a profile-scoped Pareto archive and evaluate every survivor through order-swapped blind comparison plus metamorphic relations.",
      "target": "deep-improvement / runtime/fan-out-fan-in / runtime/dedup-novelty / runtime/budget-cost",
      "rationale": "Evolution broadens the search while vector-aware survival and relation gates prevent scalar reward hacking.",
      "uniqueness": "Combines broad mutation with a frozen evaluator that candidates cannot inspect or overrule.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/beeevita/EvoPrompt, https://github.com/confident-ai/deepeval, and https://github.com/steven-b-cho/llmorph"
    },
    {
      "rec": "Insert a signed shadowing state between accepted and ship_eligible: replay sampled real packets read-only against the incumbent, commit evaluator and fixture digests before viewing outputs, and gate on paired dimension deltas, metamorphic violations, judge disagreement, and tail cost.",
      "target": "deep-improvement / runtime/locks-recovery / runtime/continuity-threading",
      "rationale": "Offline held-out success is necessary but does not establish performance on the live workload distribution; shadow receipts provide a reversible predictive bridge.",
      "uniqueness": "This is the moat-sharpening promotion transaction: only deep-improvement can mutate an agent and then earn canonicalization through hidden, frozen, staged evidence.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://www.braintrust.dev/docs/evaluate/run-evaluations and https://github.com/microsoft/waza"
    }
  ],
  "contradictions": [
    {
      "claim": "A weighted aggregate plus fixed dimension floors is an adequate authoritative promotion score.",
      "counter": "Evolutionary search optimizes whichever scalar is exposed, while heterogeneous dimensions have different noise and calibration; promotion should consume raw paired trials and dimension-level lower bounds, leaving the aggregate for ranking only.",
      "evidence": "https://github.com/beeevita/EvoPrompt/blob/main/evoluter.py and https://github.com/braintrustdata/autoevals"
    },
    {
      "claim": "Rich evaluator rationales should be returned directly to the candidate generator because they accelerate improvement.",
      "counter": "Raw rationales are valuable audit evidence but also expose an optimization oracle. Keep them inside the evaluator capsule and return only budgeted, redacted failure classes to mutation workers.",
      "evidence": "Inference from Autoevals raw metadata retention, DeepEval candidate masking, and Waza's narrow grader interface: https://github.com/braintrustdata/autoevals, https://github.com/confident-ai/deepeval, https://github.com/microsoft/waza"
    }
  ],
  "next_angles": [
    "Implement an EvaluatorCapsule attack harness covering grader prompt leakage, environment variables, cache keys, fixture filenames, timing channels, logs, and forged promotion receipts.",
    "Benchmark isotonic versus logistic judge calibration and paired-bootstrap promotion bounds under sparse gold anchors, heterogeneous profiles, and evaluator-version drift.",
    "Measure how well offline held-out, read-only shadow, and limited canary deltas predict post-ship correctness, cost tails, rollback frequency, and metamorphic violations."
  ],
  "notes": "No examined repository combines immutable raw multidimensional evidence, hidden evaluator capabilities, evolutionary candidate search, metamorphic agent relations, and accept-shadow-ship promotion as one transaction. That integration remains deep-improvement's strongest unclaimed design space. Star counts are approximate and were checked on 2026-07-15; repository activity signals come from visible commits or releases."
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
305,238
