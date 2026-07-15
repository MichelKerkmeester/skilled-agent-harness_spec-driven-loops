<!-- iteration 20 | SOL xhigh | mode: deep-improvement | angle: A5-synth deep-improvement :: synthesis & highest-leverage recs | 2026-07-15T09:42:09.998Z -->

The moat should be an auditable counterfactual claim: under evaluator epoch E, bounded candidate C outperformed baseline B without weakening hidden behavioral invariants. Other deep modes discover evidence, diagnose defects, or adjudicate opinions; deep-improvement alone should own controlled mutation, paired evaluation, and promotion.

One critical correction comes first. Lane A’s evaluator is only partly frozen today. [score-candidate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:535) derives a profile from the candidate, then derives another from the baseline at line 584. [generate-profile.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs:263) builds the checks from whichever agent it receives. The weights are frozen; the check set is not. A candidate can therefore partly change what it is judged on, and the baseline delta is not strictly apples-to-apples.

Highest-leverage changes, ranked by impact versus effort:

1. Freeze an `EvaluatorCapsuleV3` once at INIT. Preserve dynamic onboarding, but derive the profile only from the canonical preimage. The capsule should bind the canonical target hash, derived profile, rubric version, weights, promotion gates, fixture commitments, grader model/prompt/schema, gold-calibration hash, environment fingerprint, and feedback-disclosure policy. Both candidate and baseline must be scored through that same capsule. Bind `capsuleHash` into score caches, JSONL events, acceptance records, and ship receipts. Any evaluator amendment starts a new `evaluatorEpoch`; cross-epoch deltas become invalid. This borrows DVC’s dependency-lock shape—not its hash defaults—and keeps SHA-256 as the identity primitive. [DVC](https://github.com/treeverse/dvc)

2. Regularize semantic rule growth, not merely prompt length. [TextReg](https://arxiv.org/abs/2605.21318) identifies a characteristic failure of iterative prompt optimization: longer prompts accumulating narrow, sample-specific rules. Add a rule-delta ledger that classifies each semantic addition as `GENERALIZED_RULE`, `CASE_PATCH`, or `STYLE_ONLY`. Require generalized additions to recur across distinct failure families; discard stylistic restatements; quarantine case patches until they survive a held-out family. Rank candidates by held-out gain minus frozen capacity and narrow-scope penalties. This makes “simpler candidate wins ties” measurable rather than editorial.

3. Turn the prior cheap metamorphic check into a first-class behavioral-family gate. Each relation should declare a precondition, transformation, expected output/trace relation, risk tier, visibility, and shrinker. Use Hypothesis-style generators and shrinking to retain the smallest failing family; Hypothesis already separates generation, targeting, shrinking, replay, and state-machine sequences. [Hypothesis](https://github.com/HypothesisWorks/hypothesis), [stateful testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) Add a special evaluation-context family pairing realistic and obvious test/simulation cues. Microsoft’s test-awareness work used 2,587 real/hypothetical pairs and found material behavioral differences; deep-improvement can adopt the paired black-box test without its white-box steering machinery. [Paper](https://arxiv.org/abs/2505.14617), [repository](https://github.com/microsoft/Test_Awareness_Steering) Reduce each family to `PASS`, `BREACH`, or `INSUFFICIENT_EVIDENCE`, then aggregate to `GO`, `NO-GO`, or `INCONCLUSIVE`, following NeMo Evaluator’s separation of tolerance breach from insufficient paired evidence. [NeMo quality gates](https://docs.nvidia.com/nemo/evaluator/tutorials/quality-gate)

The documented promotion contract currently makes target-specific behavioral benchmarks conditional and repeatability advisory. [promotion_gate_contract.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md:64) That is acceptable for keeping an advisory candidate, but canonical shipping should be `INCONCLUSIVE` without capsule-bound behavioral evidence.

This sharpens the unique value cleanly: naive self-improvement optimizes a criterion it can observe—and often redefine—so score gain, grader gaming, and real improvement are entangled. Deep-improvement can separate proposer, frozen contract, hidden relational tests, and promotion authority, then preserve the exact evidence tuple that justified mutation. That controlled attribution is the moat.

```json
{
  "new_repos": [
    {
      "name": "NVIDIA-NeMo/Evaluator",
      "url": "https://github.com/NVIDIA-NeMo/Evaluator",
      "stars": "~311",
      "what": "Reproducible evaluation framework with paired run comparison, policy-driven GO/NO-GO/INCONCLUSIVE gates, interceptors, sandboxes, and an April 2026 release signal.",
      "lesson": "Adapt nemo_evaluator.engine.gate's per-item paired evidence and critical/supporting/advisory policy tiers for candidate promotion, keeping INSUFFICIENT_EVIDENCE distinct from PASS.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "HypothesisWorks/hypothesis",
      "url": "https://github.com/HypothesisWorks/hypothesis",
      "stars": "~8.8k",
      "what": "Property-based and stateful testing library with generation, targeted search, failure replay, and automatic shrinking; release 6.156.6 shipped July 10, 2026.",
      "lesson": "Represent metamorphic fixture families as strategies, target high-severity relation violations, and shrink failures into minimal promotion-blocking counterexamples.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "microsoft/Test_Awareness_Steering",
      "url": "https://github.com/microsoft/Test_Awareness_Steering",
      "stars": "~14",
      "what": "NeurIPS 2025 research code and paired real-versus-hypothetical datasets for measuring evaluation awareness; no releases found.",
      "lesson": "Add black-box evaluation-context twins that differ only in realistic versus obvious test cues and veto candidates whose behavior becomes more cue-dependent.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "treeverse/dvc",
      "url": "https://github.com/treeverse/dvc",
      "stars": "~15.7k",
      "what": "Data and experiment versioning system whose pipeline metadata links code, parameters, dependencies, outputs, and cached executions; release 3.67.1 shipped March 31, 2026.",
      "lesson": "Use a dependency-lock-shaped evaluator capsule so profile, fixtures, grader configuration, calibration, and environment form one versioned evaluation epoch; retain SHA-256 rather than copying DVC hash defaults.",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Lane A currently generates separate candidate and baseline profiles, so the measured delta compares two subject-derived check sets; freezing weights alone does not freeze the evaluator.",
      "evidence": "Local source: scripts/agent-improvement/score-candidate.cjs lines 535 and 584; generate-profile.cjs buildProfile lines 263-282",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evaluator identity should be a versioned dependency closure over the canonical profile, rubric, fixture commitments, grader, calibration, and environment; amendments open a new epoch rather than silently changing the ruler.",
      "evidence": "https://github.com/treeverse/dvc",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Metamorphic evaluation becomes substantially more actionable when relation families are generated and failing variants are shrunk into minimal counterexamples, rather than retained as an ad hoc list of perturbations.",
      "evidence": "https://github.com/HypothesisWorks/hypothesis ; https://arxiv.org/abs/2605.23965",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Real-versus-test-cued twin fixtures detect deployment/evaluation divergence that ordinary held-out accuracy misses; this should be a hard parity gate for affected agent behaviors.",
      "evidence": "https://arxiv.org/abs/2505.14617 ; https://github.com/microsoft/Test_Awareness_Steering",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Prompt improvement needs representation regularization: recurrent, broadly supported rules should survive, while batch-specific patches and style-only rewrites should be filtered before expensive evaluation.",
      "evidence": "https://arxiv.org/abs/2605.21318",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add freeze-evaluator.cjs at INIT to emit EvaluatorCapsuleV3 from the canonical target; make score-candidate.cjs require --capsule for baseline deltas and score both subjects with one frozen profile; bind capsuleHash into cache keys, journal events, accept/ship receipts, and reject cross-evaluatorEpoch comparisons.",
      "target": "deep-improvement",
      "rationale": "This closes the confirmed profile-substitution gap while retaining target-specific dynamic profiling.",
      "uniqueness": "It converts evaluator-first from a workflow convention into a mechanically enforced separation between mutator and ruler—the core advantage over naive self-improvement.",
      "effort": "M",
      "impact": "high",
      "evidence": "Local score-candidate.cjs lines 535 and 584; https://github.com/treeverse/dvc"
    },
    {
      "rec": "Add a rule-delta ledger and proposal filter: canonicalize semantic additions, classify them as GENERALIZED_RULE, CASE_PATCH, or STYLE_ONLY, count support across distinct failure families, and rank candidates by held-out delta minus capsule-frozen capacity and scope-narrowness penalties.",
      "target": "deep-improvement/runtime/dedup-novelty",
      "rationale": "It suppresses prompt bloat, example memorization, and cosmetically different candidates before costly graders and promotion gates.",
      "uniqueness": "Deep-improvement can prove that a change generalizes across evidence families; a self-rewriter optimizing its visible score cannot distinguish broad rules from grader-specific patches reliably.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2605.21318"
    },
    {
      "rec": "Add run-metamorphic-gate.cjs plus a relation registry whose records contain precondition, generator, transform, comparator, visibility, risk tier, and shrinker; include semantic-invariance, identifier-equivariance, tool-trace, and real-versus-test-context families; emit PASS/BREACH/INSUFFICIENT_EVIDENCE per family and require aggregate GO for canonical promotion.",
      "target": "deep-improvement/runtime/convergence",
      "rationale": "This deepens the prior cheap metamorphic recommendation into a reproducible, minimizable behavioral proof and prevents missing fixtures from being treated as non-regression.",
      "uniqueness": "Hidden relational tests let deep-improvement validate behavior the proposer cannot directly optimize or redefine, yielding a stronger promotion moat than static scoring.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/HypothesisWorks/hypothesis ; https://arxiv.org/abs/2603.13173 ; https://arxiv.org/abs/2505.14617 ; https://docs.nvidia.com/nemo/evaluator/tutorials/quality-gate"
    }
  ],
  "contradictions": [
    {
      "claim": "Dynamic five-dimension profiling provides a frozen evaluator and comparable candidate-minus-baseline deltas.",
      "counter": "The scorer derives the candidate profile from the candidate and the baseline profile from the baseline, allowing the evaluated check set to change with the subject.",
      "evidence": "Local scripts/agent-improvement/score-candidate.cjs lines 535 and 584; generate-profile.cjs lines 263-282"
    },
    {
      "claim": "Passing a static held-out aggregate is enough to establish deployment robustness.",
      "counter": "Semantic-invariance and test-awareness studies show that equivalent phrasing or obvious test cues can materially change behavior while conventional benchmark performance remains superficially acceptable.",
      "evidence": "https://arxiv.org/abs/2603.13173 ; https://arxiv.org/abs/2505.14617"
    }
  ],
  "next_angles": [
    "Build a profile-substitution benchmark containing adversarial candidates that delete, rename, or weaken self-declared rules; compare current self-derived scoring against one frozen canonical capsule and measure false promotions.",
    "Specify a metamorphic-relation DSL for agent prompts and tool traces, then audit relation validity and shrink quality across routing, coding, review, and safety targets.",
    "Benchmark TextReg-style recurrence and scope penalties against held-out-only selection, measuring cross-domain correctness, prompt growth, narrow-rule accumulation, and rejected useful special cases.",
    "Calibrate evaluation-context parity thresholds by testing whether real-versus-test-cued gaps predict shadow-production regressions better than ordinary held-out aggregates.",
    "Define the evaluator-amendment protocol: who may change a capsule, which evidence invalidates, how a new baseline is established, and how histories remain comparable without pretending cross-epoch continuity."
  ],
  "notes": "The memory daemon was sandbox-blocked, so prior coverage was taken from the supplied recap and local synthesis digest. No public TextReg implementation was found as of 2026-07-15; the mechanism comes from the primary preprint. Hypothesis supplies generation and shrinking, not semantic-validity guarantees, so non-logical metamorphic relations still need operator-authored preconditions and validity audits. The Microsoft repository is small research code; the recommended transfer is its paired black-box fixture design, not white-box activation steering."
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
session id: 019f6522-4971-7e60-8f6e-4ace50eb3dfd
--------
user
You are iteration 20/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-improvement
MODE IDENTITY (what it does today): Evaluator-first bounded agent improvement: 5-dimension scoring, dynamic profiling, packet-local candidates, guarded promotion.
GENERIC ALTERNATIVE it must out-value: naive 'ask the model to improve its own prompt/agent' with no frozen evaluator

THIS ITERATION'S ANGLE (A5-synth): deep-improvement :: synthesis & highest-leverage recs
DIRECTIVE: Synthesis pass for deep-improvement. Highest-leverage MODE-SPECIFIC recommendations (impact x effort) + a sharp 'why deep-improvement is uniquely valuable and how we make it more so' thesis. Remaining gaps + next_angles.

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
THIS run's new repos so far (77) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement
New insights so far: 81; recommendations: 54.
Open threads flagged: Implement an EvaluatorCapsule attack harness covering grader prompt leakage, environment variables, cache keys, fixture filenames, timing channels, logs, and forged promotion receipts. | Benchmark isotonic versus logistic judge calibration and paired-bootstrap promotion bounds under sparse gold anchors, heterogeneous profiles, and evaluator-version drift. | Measure how well offline held-out, read-only shadow, and limited canary deltas predict post-ship correctness, cost tails, rollback frequency, and metamorphic violations. | Build the evaluator-oracle leakage benchmark already flagged: vary exact-score, dimension-band, pass/fail, Ladder-thresholded, and terminal-only feedback while measuring canary reconstruction rate per evaluator query. | Attack-test EvaluatorReceiptV2 with replayed receipts, candidate-hash substitution, stale canary epochs, forged signatures, altered gold calibration, and accept-to-ship evaluator drift. | Calibrate regression-envelope false veto rates across sparse agent fixtures: paired exact tests versus bootstrap bounds, weak-segment minimum sizes, and MMD permutation tests on action traces.

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
This is read-only research, so no spec-folder choice is needed. I’ll route the deep-improvement workflow first, then verify a small set of new mechanisms against primary repositories and papers; the synthesis will prioritize evaluator-frozen promotion, not shared runtime machinery.
codex
SKILL ROUTING: User directed → `deep-improvement`. Its evaluator-first contract is frozen for this iteration; I’m checking the local mode packet before using external evidence so recommendations stay mode-specific.
exec
/bin/zsh -lc 'repo=$(git rev-parse --show-toplevel) && node "$repo/.opencode/bin/spec-memory.cjs" memory_match_triggers --json '"'{\"prompt\":\"iteration 20/40 deep-improvement synthesis highest-leverage mode-specific recommendations and unique-value moat\"}' --format json --timeout-ms 3000 && rg -n --glob 'SKILL.md' --glob '*.md' 'deep-improvement|Evaluator-first bounded agent improvement' \""'$repo/.opencode/skills" | head -80' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 exited 75 in 5194ms:
2026-07-15 11:36:38.864 xcodebuild[93321:207416342]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:36:39.084 xcodebuild[93321:207416341] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-uRUVQx4R' (errno=Operation not permitted)
2026-07-15 11:36:39.543 xcodebuild[93353:207416471]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:36:39.668 xcodebuild[93353:207416456] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

codex
The memory daemon is present but sandbox-blocked (`EPERM` on its local socket), so there is no retrievable prior continuity beyond the prompt’s supplied recap. I’m proceeding from that recap and the local deep-improvement contract; this is an explicit evidence gap, not an inferred clean slate.
exec
/bin/zsh -lc "rg -n --glob 'SKILL.md' --glob '*.md' 'deep-improvement|Evaluator-first bounded agent improvement' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills | head -120" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt_templates.md:188:- **Command-owned loop executors (never direct `--agent`)** — `deep-research` (via `/deep:research`), `deep-review` (via `/deep:review`), `deep-improvement` (via `/deep:agent-improvement`), `prompt-improver` (via `/prompt`'s deep-path escalation).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:48:- **Agent dispatch** — task matches a specialized OpenCode agent. Primary agents (directly invokable via `--agent`): `general`, `plan` (built-in), `orchestrate`. Generic subagents fully dispatched via the orchestrate primary: `context`, `review`, `write`, `debug`, `ai-council`. Command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) are owned end-to-end by their parent `/deep:*` command; `orchestrate` may perform exactly one bounded hand-off dispatch to a recognized loop request, but never manages the loop itself. See §3 "OpenCode Agent Delegation" for the full contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:207:3. **Command-owned loop executors** (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) — LOOP-OWNED by their parent commands (`/deep:research`, `/deep:review`, `/deep:agent-improvement`, `/prompt`), which own iteration state, convergence detection, and continuity. Never dispatch these directly via raw `--agent <slug>`. `orchestrate` is an authorized **caller/coordinator only** — it may perform exactly one bounded hand-off dispatch to the resolved leaf, but MUST NOT re-implement the loop.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:362:This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract. cli-opencode distinguishes 3 primary agents (directly invokable via --agent: general + plan as OpenCode built-ins; orchestrate as the repo-defined primary) from N subagents (context, review, write, debug, ai-council, deep-research, deep-review, deep-improvement, prompt-improver) which dispatch as Task subagents from a primary (`ai-council` additionally reachable via its own `/deep:ai-council` command). CO-013..CO-017 + CO-032..CO-034 exercise both surfaces — direct primary invocation and primary-dispatches-subagent routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:3:Rigorous Lane-C skill-benchmark pass over the merged `sk-prompt` parent hub, run 2026-07-09 as a post-merge verification (packet `skilled-agent-orchestration/124-sk-prompt-parent` is complete; this is a deeper follow-on check, not new packet scope). Invocations verified against the deep-improvement skill's own authoritative docs: `references/skill_benchmark/{operator_guide,scoring_contract,routing_optimization}.md`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:29:**Correction from an earlier draft of this summary**: this is a real, named conformance gap, not an inherent architectural fact. `deep-improvement/references/skill_benchmark/routing_optimization.md` §6 (Parent-Hub Routing) states the doctrine's actual expectation plainly: *"Re-run Lane C on both the child and the parent. The child should pass its own routing contract."* `sk-code`'s children (`code-review`, `code-quality`, `code-webflow`, `code-opencode`) meet that bar because each one was authored with its own `INTENT_SIGNALS`/`RESOURCE_MAP` block — that's why they benchmark individually with real Mode-A/Mode-B scores. `sk-prompt`'s two children do not meet it yet:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/z_archive/cli-codex-retired/README.md:128:| `deep-improvement` | Proposal-only improvement candidates | `--sandbox read-only` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:3:description: "Fillable scaffold for a hub's benchmark/README.md — the index of run-label folders in a skill's benchmark/ tree, naming the deep-improvement Lane C skill-benchmark harness and its scoring_contract as the governing measurement authority, with a run-label table carrying status, date, and verdict."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:44:deep-improvement Lane C scoring contract:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:45:  .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:46:The harness that produces every run in this tree is the deep-improvement Lane C
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:58:The deep-improvement Lane C skill-benchmark harness benchmarks `{{HUB_NAME}}` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the run inputs and the dual reports each run writes, one run-label folder per run.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:65:The rubric, terminal buckets, and pass thresholds are the deep-improvement Lane C **scoring contract's**, not this index's — see section 6 for the link. Where a number here and the scoring contract disagree, the scoring contract prevails.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:115:Run from the repository root. The runner and its scoring live in the deep-improvement Lane C lane; only the `--skill` and `--outputs-dir` arguments are hub-specific.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:120:node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:130:node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:155:| [`deep-improvement`]({{PATH_TO_DEEP_IMPROVEMENT_SKILL}}) | Owns the Lane C skill-benchmark harness, runner, and scoring | Running or extending a benchmark |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:160:       {{PATH_TO_DEEP_IMPROVEMENT_SKILL}} -> .opencode/skills/system-deep-loop/deep-improvement/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:162:       {{PATH_TO_SCORING_CONTRACT}}       -> .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:165:     contract is ../../system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:16:  system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/<your-profile>.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:21:        .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/my-profile.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:31:  .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md          (A–F mode enum, swept axis, defaults)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:32:  .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs  (the hard validation rules)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:33:  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md (shared vs sweep-only keys, shipped examples)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:57:node -e "const {validateProfile}=require('./.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs');const p=require('./<path-to>/my-profile.json');const r=validateProfile(p);console.log(r.valid?'VALID '+p.profileId:'INVALID: '+r.errors.join('; '))"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:70:  "family": "deep-improvement",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:116:  family              : "deep-improvement" for Lane B profiles.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:176:- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md) — the A–F mode operator guide: mode enum, swept axis, and per-mode `groupBy` / scorer defaults with a runnable profile delta for each.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:177:- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs) — the hard validation contract (`validateProfile`): mode enum, executor enum, dimension-weight sum, threshold range, positive sample count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:178:- [`../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md) — the shipped profiles, the shared-vs-sweep-only key split, and the `{spec_folder}` token policy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:179:- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/README.md`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/README.md) — the `run-benchmark.cjs` / `dispatch-model.cjs` entrypoints that consume a profile, and [`SWEEP.md`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md) for how a sweep runs and what the outputs mean.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md:180:- The scorer/evaluator and reviewer scoring contracts stay lane-local in `system-deep-loop/deep-improvement`; cross-link them from there, never copy them into this package.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_code_task_fixture_template.md:16:  <deep-improvement>/assets/model_benchmark/benchmark-fixtures/<slug>.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_code_task_fixture_template.md:26:        .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_my_new_task.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_code_task_fixture_template.md:124:- [`../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md) — normative fixture taxonomy: field set, tier taxonomy (T1–T4), pack layout, and the correctness-pass-rate design lesson.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_code_task_fixture_template.md:125:- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs) — the scorer that extracts `fn_name`, runs every oracle case in isolation, and returns `correctness_pass_rate`; the ultimate check on a filled fixture.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_code_task_fixture_template.md:126:- [`../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md) — the SEPARATE reviewer-prompt fixture shape (verdict oracle). Use it, not this template, for reviewer fixtures.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:17:  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/<slug>.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:41:  - benchmark-fixtures/README.md  ../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:44:  - reviewer_schema.md  ../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:75:[`benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:92:[`run-benchmark.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:136:[`reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:208:| [`benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md) | The fixture taxonomy: pattern, code-task, validation, and reviewer families, and which scorer consumes each. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:209:| [`reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md) | Authoritative reviewer-prompt schema, verdict contract, and deterministic-replay rules for Section 3. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:210:| [`run-benchmark.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs) | The scorer that consumes the Section 2 pattern fields — the source of truth for band weighting. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md:218:*End of template — the reviewer contract is normative in [`reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md); the fixture taxonomy in [`benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md).*
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:80:- The task is to hand-edit a `skill-benchmark-report.md` (renderer-owned) or to define how any benchmark is *scored* — a rubric, evaluator, reviewer verdict, or D1-D5 weight. Those stay lane-local in deep-improvement; this packet authors inputs, indexes, and reports, not scoring (sections 10-11).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:97:| Skill-benchmark (`skill_benchmark`, Lane C) | Whether a skill is well-routed, discoverable, efficient, and useful | `<skill>/benchmark/<run-label>/` | The storage guide + the hub `benchmark/README.md` index template | `skill-benchmark-report.md` render → `build-report.cjs`; D1-D5 scoring → deep-improvement `scoring_contract.md` | §10 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:98:| Model-benchmark (`model_benchmark`, Lane B) | What a model or prompt framework produces against a held-out oracle | `system-deep-loop/deep-improvement/assets/model_benchmark/` | Code-task, pattern/capability, and reviewer fixture templates + the profile template + the fixture guide | Evaluator / scorer / reviewer-verdict contract → deep-improvement lane | §11 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:99:| Agent-improvement (`agent_improvement`, Lane A) | An agent's quality across five dimensions | deep-improvement lane (in-lane) | Authoring guide ([guide](references/agent_improvement/agent_improvement_authoring_guide.md)) | Code-owned rubric/config; run by `/deep:agent-improvement` | §14 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:411:A skill-benchmark measures whether a skill is well-routed, discoverable, efficient, and useful; it is run by the deep-improvement Lane C harness (`/deep:skill-benchmark`), which emits a JSON+Markdown report pair per run. This packet owns exactly two things: the **storage convention** for a hub's `benchmark/` tree and the **template for its `benchmark/README.md` index**. It never authors the per-run report, the runner, or the scoring (see ALWAYS / NEVER). The full storage convention, run-label naming, and renderer boundary live in [`references/skill_benchmark/skill_benchmark_storage_guide.md`](references/skill_benchmark/skill_benchmark_storage_guide.md); the D1-D5 contract stays lane-local, cross-linked and never restated.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:450:- **ALWAYS** cross-link the deep-improvement D1-D5 scoring contract; rubric, buckets, and thresholds are lane-owned.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:466:A model-benchmark run scores what a model or prompt framework produces against a fixed, held-out oracle; it is run by the deep-improvement Lane B harness (`/deep:model-benchmark`). This packet owns the **authored inputs** — the fixtures the model answers and the run profiles that drive a run. Both are data only. It never authors the evaluator, scorers, or reviewer-verdict contract (see ALWAYS / NEVER). The fixture-family taxonomy, profile shape, and lane boundary live in [`references/model_benchmark/model_benchmark_fixture_guide.md`](references/model_benchmark/model_benchmark_fixture_guide.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:470:Model-benchmark inputs live under the deep-improvement mode-packet, not in this packet:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:473:system-deep-loop/deep-improvement/assets/model_benchmark/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:519:- No evaluator, scorer, or reviewer-verdict contract was copied here; each is cross-linked to its deep-improvement authority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:583:- [`scoring_contract.md`](../../system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md) + [`build-report.cjs`](../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs) — Lane C D1-D5 scoring and the renderer that owns `skill-benchmark-report.md`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/SKILL.md:584:- [`evaluator_contract.md`](../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) + [`reviewer_schema.md`](../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md) — Lane B evaluator rubric and reviewer-prompt schema.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/README.md:65:Do not use it for in-progress MCP benchmarks, speculative benchmark design, release notes, changelog rows, or one-off unreplayable measurements. Do not hand-author a `skill-benchmark-report.md` (renderer-owned) or any scoring/evaluator/reviewer contract (lane-local in deep-improvement).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-claude-code/README.md:117:| `deep-improvement` | Proposal-only deep-improvement candidate generation (command-owned by `/deep:agent-improvement`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:3:description: End-to-end guide for authoring the doc-only inputs a Lane A (agent-improvement) run consumes - the improvement charter and strategy scaffolds, the target-onboarding classification, the candidate proposal format, and the profiling/integration-scanning setup; where each lives in deep-improvement and what stays lane-local and code-owned.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:22:the deep-improvement lane's, and they stay lane-local. Cross-links throughout point at
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:31:of truth. It is run by [`/deep:agent-improvement`](../../../../system-deep-loop/deep-improvement/SKILL.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:45:| This guide covers (authoring inputs) | Stays lane-local in deep-improvement (cross-link) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:59:All Lane A data lives under the deep-improvement mode-packet in
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:60:[`assets/agent_improvement/`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/README.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:62:[`references/agent_improvement/`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:69:| Charter scaffold | [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md) | Adopt verbatim as the fixed policy layer — mission, dynamic-target rule, proposal-only policy, keep/discard rule, and the audit obligations. It is **immutable** for the run; the mutator must never rewrite it. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:70:| Strategy scaffold | [`improvement_strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md) | Fill the operator-owned fields (Target, Goal, Constraints, Current Hypothesis, Candidate Focus, Benchmark Focus, Integration Focus) before the run; leave the `MACHINE-OWNED` block for the reducer. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:71:| Run config (copy) | [`improvement_config.json`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json) | Fill only `target`, `specFolder`, and `lineage.sessionId` in a packet-local copy; leave scoring, stop-rule, dispatch-cap, and file-protection sections at their template values. See §3. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:72:| Target manifest | [`target_manifest.jsonc`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc) | Optionally add a classification entry or extend the `fixed`/`forbidden` protections; the `targets` array is intentionally empty under dynamic-only profiling. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:73:| Candidate file | (per format) [`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md) | Write each candidate as a complete agent `.md` under `{spec_folder}/improvement/candidates/` that differs from the target only in the one mutation being tested. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:86:[`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:95:[`target_onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:104:[`integration_scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:107:[`profiling_audit_log.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:119:| [`score_dimensions.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md) | The five dimensions (structural integrity, rule coherence, integration consistency, output quality, system fitness), their weights, and the weighted-score threshold. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:120:| [`evaluator_contract.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) | Scorer and benchmark-runner input/output contract, the rubric, and the reject-vs-`infra_failure` distinction. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:121:| [`promotion_gate_contract.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md) | The five promotion gates, per-dimension minimums, the accept/ship phases, and rollback. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:122:| [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md) | The journal-emission protocol, the stop-reason enum, and the legal-stop gate bundles (contract / behavior / integration / evidence / improvement). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:133:[`improvement_config_reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:144:   [`target_onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:147:   [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:149:   [`improvement_strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:152:   [`improvement_config.json`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:154:   [`improvement_config_reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md)).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:157:   [`integration_scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:160:   [`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:164:   ([`loop_protocol.md`](../../../../system-deep-loop/deep-improvement/references/shared/loop_protocol.md)); authoring stops before scoring, promotion, or mirror sync.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:184:  packaging work per [`mirror_drift_policy.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/mirror_drift_policy.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:207:| [`score_dimensions.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md) | The five-dimension rubric, weights, and weighted-score threshold |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:208:| [`evaluator_contract.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) | Scorer/benchmark input-output contract and reject-vs-infra-failure |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:209:| [`promotion_gate_contract.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md) | The five promotion gates, per-dimension minimums, accept/ship, rollback |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:210:| [`promotion_rules.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion_rules.md) | Promotion policy and stop-condition reference |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:211:| [`stress_test_protocol.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md) | The same-task A/B stress-test required before promotion claims |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:212:| [`loop_protocol.md`](../../../../system-deep-loop/deep-improvement/references/shared/loop_protocol.md) | The full INIT/PROPOSE/SCORE/PROMOTE lifecycle the lane runs |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:218:| [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md) | Fixed policy scaffold — adopted verbatim, immutable for the run |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:219:| [`improvement_strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md) | Operator-owned goal/hypothesis/focus fields |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:220:| [`improvement_config.json`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json) | `target`, `specFolder`, `lineage.sessionId` in a packet-local copy |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:221:| [`improvement_config_reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md) | (Read-only) field-by-field config meaning |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:222:| [`target_manifest.jsonc`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc) | Optional classification entry and `fixed`/`forbidden` protections |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:223:| [`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md) | The candidate file shape each proposal follows |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:224:| [`target_onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md) | Target preconditions and canonical/derived/candidate-only class |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:225:| [`integration_scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md) | The scanned integration surfaces a profile is built from |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:226:| [`profiling_audit_log.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md) | The profile-selection rationale log shape and retention |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:227:| [`agent_improvement/README.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/README.md) | Directory map of Lane A data, config, and templates |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:231:- [`deep-improvement SKILL.md`](../../../../system-deep-loop/deep-improvement/SKILL.md) — the mode that owns and runs Lane A (§3).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md:241:deep-improvement (§3 and §7).*
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-claude-code/references/claude_tools.md:247:| **Agent System** | 12 agents via `.claude/agents/*.md`, all directly invokable with `--agent <name>` | 12 agents via `.opencode/agents/*.md`, split into 3 classes: primary (`general`, `plan`, `orchestrate` — only `orchestrate` is a project file usable with top-level `--agent`), subagent (`context`, `markdown`, `review`, `debug`, `ai-council` — routed via `--agent orchestrate`, never direct), and command-owned (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver` — dispatched only by their parent `/deep:*` command) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-claude-code/references/agent_delegation.md:102:├── deep-improvement.md # Proposal-only agent-improvement candidates (command-owned)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-claude-code/references/agent_delegation.md:132:| `deep-improvement` | default | Proposal-only agent-improvement candidate generation | Command-owned by `/deep:agent-improvement` — never dispatch directly |

exec
/bin/zsh -lc "wc -l .opencode/skills/system-deep-loop/deep-improvement/SKILL.md && sed -n '1,260p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     339 .opencode/skills/system-deep-loop/deep-improvement/SKILL.md
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


exec
/bin/zsh -lc "sed -n '261,380p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
The local contract confirms the moat is not “better prompting”; it is controlled change attribution: immutable policy, packet-local candidates, independent scoring, and explicit promotion. The weak point is that a frozen grader can still be exploitable or insensitive, so I’m testing three adjacent mechanisms: property/metamorphic evaluation, evaluator mutation testing, and sealed evaluation artifacts with lineage.
web search: 
web search: site:github.com/HypothesisWorks/hypothesis property based testing shrinking repository ...
web search: 
web search: 
web search: 
web search: 'Regression'
web search: 
web search: 
web search: 
web search: site:github.com/NVIDIA-NeMo/Evaluator "Latest commit" 2026 ...
web search: 
web search: site:github.com metamorphic testing Python property based testing active repository ...
web search: 
web search: 
web search: 
web search: "TextReg" "Prompt Distributional Overfitting" GitHub ...
web search: 
web search: https://github.com/FelliYang/PromptBias
web search: 
web search: site:dvc.org/doc dvc.lock md5 dependencies outputs reproducible experiments ...
codex
Two findings now dominate the synthesis. First, static gold accuracy misses semantic instability; metamorphic relations can turn one fixture into a family of oracle-light checks. Second, models can change behavior merely because they infer “this is a test,” so promotion needs evaluation-context parity, not only held-out accuracy. I’m checking those against the current five-dimension and promotion contracts before ranking changes.
exec
/bin/zsh -lc "printf '%s
' '--- scratch files ---' && rg --files .opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch | head -120 && printf '%s
' '--- quick reference ---' && sed -n '1,260p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md && printf '%s
' '--- evaluator contract ---' && sed -n '1,320p' .opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md && printf '%s
' '--- score dimensions ---' && sed -n '1,300p' .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- scratch files ---
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/deep-loop-driver.cjs
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/angle-schedule.json
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/angle-schedule-modes.json
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/synthesis-digest.md
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/deep-loop-driver-modes.cjs
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/build-digest.cjs
.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype-result.json
--- quick reference ---
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
--- evaluator contract ---
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

--- score dimensions ---
---
title: Deep Agent Improvement 5-Dimension Scoring Rubric
description: Formal definition of the 5-dimension evaluation framework used by deep-improvement to score agent candidates.
trigger_phrases:
  - "5-dimension scoring"
  - "scoring rubric"
  - "dimension weights"
  - "evaluation dimensions"
importance_tier: important
contextType: implementation
version: 1.17.0.10
---

# Deep Agent Improvement 5-Dimension Scoring Rubric

Formal definition of the 5-dimension evaluation framework used by deep-improvement to score agent candidates.

---

## 1. OVERVIEW

The 5-dimension scoring rubric is the core evaluation framework for deep-improvement. It measures agent quality across five weighted dimensions: structural integrity, rule coherence, integration consistency, output quality, and system fitness. Each dimension is scored 0-100, then combined using dimension weights to produce a final weighted score.

**Scoring mode:** Dynamic only (no static profiles shipped).

**Weighted score threshold:** >= 70 produces `candidate-acceptable`; below 70 produces `needs-improvement`.

**Reproducibility:** Scorer output includes `rubricVersion` and `inputHash`. The input hash is SHA-256 over rubric version, candidate content, baseline content when present, dynamic profile checks, dimension weights, promotion gate values, manifest input, and integration-scan coverage. Identical inputs return the same cached score unless `--no-cache` is passed.

---

## 2. DIMENSIONS

### Dimension 1: Structural Integrity

**Weight:** 0.20

**What it measures:** Agent template compliance and required section presence.

**Scoring logic:**
- Checks for required sections: CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES
- Each required section present: +20 points
- Missing required section: 0 points for that section
- Score = (sections present / total required sections) * 100

**Implementation:** `score-candidate.cjs` → `checkStructuralIntegrity()`

---

### Dimension 2: Rule Coherence

**Weight:** 0.25

**What it measures:** Alignment between ALWAYS/NEVER rules and workflow instructions.

**Scoring logic:**
- Extracts ALWAYS and NEVER rules from agent definition
- Checks keyword presence in workflow instructions
- Each rule with matching keyword: +10 points
- Each rule without matching keyword: 0 points
- Score = (rules with matches / total rules) * 100

**Implementation:** `score-candidate.cjs` → `checkRuleCoherence()`

---

### Dimension 3: Integration Consistency

**Weight:** 0.25

**What it measures:** Mirror parity, command coverage, and skill references.

**Scoring logic:**
- Runs `scan-integration.cjs` to discover integration surfaces
- Mirror parity score: 60% of dimension (3 mirrors checked: Claude, OpenCode, .agents)
- Command coverage: 20% of dimension (commands reference agent)
- Skill coverage: 20% of dimension (skills reference agent)
- Score = (mirrorScore * 0.60) + (commandScore * 0.20) + (skillScore * 0.20)

**Implementation:** `score-candidate.cjs` → `checkIntegrationConsistency()` delegates to `scan-integration.cjs`

---

### Dimension 4: Output Quality

**Weight:** 0.15

**What it measures:** Output verification checklist presence and placeholder content.

**Scoring logic:**
- Checks for OUTPUT VERIFICATION section
- Each verification item present: +10 points
- Placeholder strings (TODO, FIXME, placeholder): -5 points each
- Score = (verification items / expected items) * 100 - placeholder penalty

**Implementation:** `score-candidate.cjs` → `checkOutputQuality()`

---

### Dimension 5: System Fitness

**Weight:** 0.15

**What it measures:** Permission-capability alignment, resource references, and frontmatter completeness.

**Scoring logic:**
- Verifies tools in capability scan match permission model
- Checks resource references exist
- Validates frontmatter completeness (name, description, triggers)
- Each check passing: +20 points
- Score = (checks passing / total checks) * 100

**Implementation:** `score-candidate.cjs` → `checkSystemFitness()`

---

## 3. WEIGHTED SCORE CALCULATION

```javascript
weightedScore = (
  structural * 0.20 +
  ruleCoherence * 0.25 +
  integration * 0.25 +
  outputQuality * 0.15 +
  systemFitness * 0.15
)
```

**Thresholds:**
- `weightedScore >= 70`: `candidate-acceptable`
- `weightedScore < 70`: `needs-improvement`
- Any dimension with zero checks returns `score: null`, appears in `unscoredDimensions`, and blocks promotion recommendations.

---

## 4. DYNAMIC PROFILING

**Profile generation:** `scripts/agent-improvement/generate-profile.cjs`

**Process:**
1. Parse agent frontmatter (name, description, triggers)
2. Extract ALWAYS/NEVER rules from RULES section or body fallback
3. Extract OUTPUT VERIFICATION checklist items
4. Extract CAPABILITY SCAN tool list
5. Extract RELATED RESOURCES table
5. Extract denied permissions
6. Build derived profile JSON with dimension-specific checks

**Profile output fields:**
- `id`: Agent identifier
- `derivedChecks.ruleCoherence`: Array of ALWAYS/NEVER rules
- `derivedChecks.outputChecks`: Array of verification items
- `derivedChecks.capabilityScan`: Tool list
- `derivedChecks.permissions`: Permission model
- `agentMeta`: Frontmatter metadata

---

## 5. SCORING OUTPUT FORMAT

```json
{
  "status": "success",
  "rubricVersion": "dynamic-5d/p126-reproducibility-v1",
  "inputHash": "sha256...",
  "evaluationMode": "dynamic-5d",
  "profileId": "agent-name",
  "weightedScore": 78.5,
  "recommendation": "candidate-acceptable",
  "dimensions": [
    {
      "name": "structural",
      "score": 85,
      "weight": 0.20,
      "details": [
        { "check": "CORE WORKFLOW present", "passed": true },
        { "check": "OUTPUT VERIFICATION present", "passed": true }
      ]
    },
    {
      "name": "ruleCoherence",
      "score": 72,
      "weight": 0.25,
      "details": [
        { "check": "ALWAYS rule: Read files first", "passed": true },
        { "check": "NEVER rule: Don't guess", "passed": true }
      ]
    },
    {
      "name": "integration",
      "score": 80,
      "weight": 0.25,
      "details": [
        { "check": "Mirror parity: Claude", "passed": true },
        { "check": "Mirror parity: OpenCode", "passed": false }
      ]
    },
    {
      "name": "outputQuality",
      "score": 90,
      "weight": 0.15,
      "details": [
        { "check": "Verification items present", "passed": true }
      ]
    },
    {
      "name": "systemFitness",
      "score": 65,
      "weight": 0.15,
      "details": [
        { "check": "Permission alignment", "passed": true },
        { "check": "Resource references", "passed": false }
      ]
    }
  ]
}
```

---

## 6. SOURCE ANCHORS

|| Path | Role |
|---|---|
| `scripts/agent-improvement/score-candidate.cjs` | Main scoring implementation |
| `scripts/agent-improvement/generate-profile.cjs` | Dynamic profile generation |
| `scripts/agent-improvement/scan-integration.cjs` | Integration surface discovery |
| `references/model_benchmark/evaluator_contract.md` | Evaluator policy contract |
| `feature_catalog/scoring_system/five_dimension_rubric.md` | Feature catalog entry |

exec
/bin/zsh -lc "sed -n '1,360p' .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs && sed -n '1,460p' .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs && sed -n '1,340p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md && sed -n '1,300p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ generate-profile — dynamic target profile generator                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  ERROR_TYPES,
  classifyExitCode,
  makeTypedError,
  serializeTypedError,
} = require('../lib/typed-errors.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const W_STRUCT = 10;
const W_RULE = 8;
const W_CHECK = 5;
const W_ANTI = 8;
const SECTION_RE = /^## (\d+)\.\s+(.+)$/gm;
const H3_RE = /^### (.+)$/gm;
const CHECKLIST_RE = /^[□☐]\s+(.+)$/gm;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (const e of argv) {
    if (!e.startsWith('--')) { continue; }
    const [k, ...r] = e.slice(2).split('=');
    args[k] = r.length > 0 ? r.join('=') : true;
  }
  return args;
}

function writeJson(fp, v) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, `${JSON.stringify(v, null, 2)}\n`, 'utf8');
}

function fail(error) {
  const payload = serializeTypedError(error);
  process.stderr.write(`${JSON.stringify(payload)}\n`);
  process.exit(classifyExitCode(error));
}

function allMatches(re, text) {
  const out = []; let m;
  const r = new RegExp(re.source, re.flags);
  while ((m = r.exec(text)) !== null) { out.push(m); }
  return out;
}

function listItems(text) {
  return text.split('\n')
    .filter((l) => /^[-*]\s+/.test(l.trim()))
    .map((l) => l.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

function hashContent(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function logProfileSelection(stateDir, candidateHash, chosenProfile, rationale, alternatives = []) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    candidate_hash: `sha256:${candidateHash}`,
    chosen_profile: chosenProfile,
    rationale: rationale,
    alternatives: alternatives,
  };
  try {
    const logPath = path.join(stateDir, 'profile-selection.log');
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n', 'utf8');
  } catch (err) {
    // Silent ignore - logging failure should not crash profile generation
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRONTMATTER PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { return {}; }
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s+(.+)$/);
    if (kv && kv[2].trim()) { meta[kv[1]] = kv[2].trim(); }
  }
  return meta;
}

function parsePermissions(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { return {}; }
  const pb = fm[1].match(/permission:\s*\n((?:\s+\w+:\s+\w+\n?)+)/);
  if (!pb) { return {}; }
  const perms = {};
  for (const line of pb[1].split('\n')) {
    const m = line.trim().match(/^(\w+):\s+(\w+)$/);
    if (m) { perms[m[1]] = m[2]; }
  }
  return perms;
}

function permSummary(perms) {
  const allowed = [], denied = [];
  for (const [k, v] of Object.entries(perms)) {
    (v === 'allow' ? allowed : denied).push(k);
  }
  return { allowed, denied };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SECTION PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseSections(content) {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const marks = allMatches(SECTION_RE, body);
  const secs = {};
  for (let i = 0; i < marks.length; i++) {
    const name = marks[i][2].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const start = marks[i].index + marks[i][0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : body.length;
    secs[name] = body.slice(start, end).trim();
  }
  return secs;
}

function getSection(secs, ...names) {
  for (const n of names) {
    const key = Object.keys(secs).find((k) => k.includes(n.toUpperCase()));
    if (key) { return secs[key]; }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DERIVED CHECK EXTRACTORS
// ─────────────────────────────────────────────────────────────────────────────
function deriveStructural(secs) {
  const probes = [
    ['has-core-workflow', 'CORE WORKFLOW'], ['has-output-verification', 'OUTPUT VERIFICATION'],
    ['has-anti-patterns', 'ANTI'], ['has-capability-scan', 'CAPABILITY SCAN'],
    ['has-rules', 'RULES'], ['has-related-resources', 'RELATED RESOURCES'],
  ];
  return probes
    .filter(([, label]) => Object.keys(secs).some((k) => k.includes(label.toUpperCase())))
    .map(([id, label]) => ({ id, description: `Agent has ${label} section`, weight: id.includes('anti') ? 5 : W_STRUCT }));
}

function extractRuleBlock(text, heading) {
  const re = new RegExp(`###\\s+(?:${heading})\\s*\\n([\\s\\S]*?)(?=\\n###|\\n##|\\n$|$)`, 'i');
  const m = text.match(re);
  return m ? listItems(m[1]) : [];
}

function deriveRules(secs) {
  const rc = getSection(secs, 'RULES') || getSection(secs, 'OPERATING RULES') || '';
  const checks = [];
  extractRuleBlock(rc, 'ALWAYS|Always|✅\\s*ALWAYS').forEach((rule, i) => {
    checks.push({ id: `always-rule-${i}`, rule, type: 'always', weight: W_RULE });
  });
  extractRuleBlock(rc, 'NEVER|Never|❌\\s*NEVER').forEach((rule, i) => {
    checks.push({ id: `never-rule-${i}`, rule, type: 'never', weight: W_RULE });
  });
  extractRuleBlock(rc, '(?:⚠️\\s*)?ESCALATE\\s+(?:IF|WHEN)').forEach((rule, i) => {
    checks.push({ id: `escalate-${i}`, rule, type: 'escalate', weight: 3 });
  });
  // Inline fallback (DAI playbook PG-007): when no dedicated RULES > ###ALWAYS/###NEVER block
  // yields rules, scan all section bodies for inline "- ALWAYS ..." / "- NEVER ..." bullets.
  if (!checks.some((c) => c.type === 'always' || c.type === 'never')) {
    const inlineLines = Object.values(secs).join('\n').split('\n').map((l) => l.trim());
    const collectInline = (re, type) => inlineLines
      .filter((l) => re.test(l))
      .map((l) => l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim())
      .forEach((rule, i) => checks.push({ id: `${type}-inline-${i}`, rule, type, weight: W_RULE }));
    collectInline(/^[-*]\s+(?:✅\s*)?(?:ALWAYS|Always)\b/, 'always');
    collectInline(/^[-*]\s+(?:❌\s*)?(?:NEVER|Never)\b/, 'never');
  }
  return checks;
}

function deriveOutputChecks(secs) {
  const vc = getSection(secs, 'OUTPUT VERIFICATION', 'VERIFICATION');
  if (!vc) { return []; }
  const checks = [];
  const items = allMatches(CHECKLIST_RE, vc);
  items.forEach((m, i) => checks.push({ id: `checklist-${i}`, check: m[1].trim(), weight: W_CHECK }));
  const brackets = allMatches(/^\[]\s+(.+)$/gm, vc);
  brackets.forEach((m, i) => checks.push({ id: `checklist-${items.length + i}`, check: m[1].trim(), weight: W_CHECK }));
  return checks;
}

function deriveForbidden(secs) {
  const ac = getSection(secs, 'ANTI');
  if (!ac) { return []; }
  return ac.split('\n')
    .filter((l) => /^[-*]\s+\*\*[Nn]ever\b/.test(l.trim()))
    .map((l, i) => ({ id: `anti-${i}`, pattern: l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim(), weight: W_ANTI }));
}

function tableNames(text) {
  return text.split('\n')
    .filter((l) => /^\|/.test(l.trim()) && !/^\|[-\s|]+$/.test(l) && !/^\|\s*(Skill|Agent|Command|Purpose|Path)\s*\|/i.test(l))
    .map((r) => { const c = r.split('|').map((s) => s.trim()).filter(Boolean); return c.length ? c[0].replace(/`/g, '').replace(/^@/, '').trim() : null; })
    .filter(Boolean);
}

function deriveIntegration(secs) {
  const result = { commands: [], skills: [], agents: [] };
  const rc = getSection(secs, 'RELATED RESOURCES');
  if (!rc) { return result; }
  const subs = {};
  const h3s = allMatches(H3_RE, rc);
  for (let i = 0; i < h3s.length; i++) {
    const label = h3s[i][1].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const start = h3s[i].index + h3s[i][0].length;
    const end = i + 1 < h3s.length ? h3s[i + 1].index : rc.length;
    subs[label] = rc.slice(start, end).trim();
  }
  const addUnique = (arr, val) => { if (!arr.includes(val)) { arr.push(val); } };
  const cmdKey = Object.keys(subs).find((k) => k.includes('COMMAND'));
  if (cmdKey) { allMatches(/`(\/[^`]+)`/g, subs[cmdKey]).forEach((m) => addUnique(result.commands, m[1])); }
  const skillKey = Object.keys(subs).find((k) => k.includes('SKILL'));
  if (skillKey) { tableNames(subs[skillKey]).forEach((n) => addUnique(result.skills, n)); }
  const agentKey = Object.keys(subs).find((k) => k.includes('AGENT'));
  if (agentKey) { tableNames(subs[agentKey]).forEach((n) => addUnique(result.agents, n)); }
  return result;
}

function deriveMismatches(secs, perms) {
  const cc = getSection(secs, 'CAPABILITY SCAN');
  if (!cc) { return []; }
  const out = [];
  for (const row of cc.split('\n').filter((l) => /^\|\s*`/.test(l.trim()))) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) { continue; }
    const tool = cells[0].replace(/`/g, '');
    const norm = tool.replace(/_/g, '').toLowerCase();
    for (const [perm, val] of Object.entries(perms)) {
      if (val === 'deny' && norm.includes(perm.toLowerCase())) {
        out.push({ tool, permission: perm, status: 'deny' });
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROFILE BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildProfile(agentPath, content) {
  const meta = parseFrontmatter(content);
  const perms = parsePermissions(content);
  const secs = parseSections(content);
  const id = meta.name || path.basename(agentPath, '.md');
  return {
    id, family: 'derived', targetPath: agentPath, outputKind: 'markdown',
    promotionEligible: false, generated: true, generatedAt: new Date().toISOString(),
    agentMeta: {
      name: id, mode: meta.mode || 'subagent',
      temperature: parseFloat(meta.temperature) || 0.1,
      permissionSummary: permSummary(perms),
    },
    derivedChecks: {
      structural: deriveStructural(secs), ruleCoherence: deriveRules(secs),
      outputChecks: deriveOutputChecks(secs), forbiddenBehaviors: deriveForbidden(secs),
      integrationPoints: deriveIntegration(secs), capabilityMismatches: deriveMismatches(secs, perms),
    },
    benchmark: { fixtureDir: null, requiredAggregateScore: 80, minimumFixtureScore: 60, repeatabilityTolerance: 0 },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.agent) {
    process.stderr.write('Usage: node generate-profile.cjs --agent=<path-to-agent.md> [--output=<path.json>] [--state-dir=<path>]\n');
    process.exit(2);
  }
  let content;
  try { content = fs.readFileSync(args.agent, 'utf8'); } catch (err) {
    const type = err && err.code === 'ENOENT' ? ERROR_TYPES.FILE_NOT_FOUND : ERROR_TYPES.SCRIPT_CRASH;
    fail(makeTypedError(type, `Failed to read agent file: ${err.message}`, { agent: args.agent }));
  }
  try {
    const profile = buildProfile(args.agent, content);
    const json = `${JSON.stringify(profile, null, 2)}\n`;
    if (args.output) { writeJson(args.output, profile); }
    process.stdout.write(json);

    // Log profile selection if state-dir is provided
    if (args['state-dir']) {
      const candidateHash = hashContent(content);
      logProfileSelection(
        args['state-dir'],
        candidateHash,
        profile.id,
        'Derived profile generated from agent file',
        []
      );
    }
  } catch (err) {
    fail(makeTypedError(ERROR_TYPES.PARSE_ERROR, `Failed to build profile: ${err.message}`, { agent: args.agent }));
  }
}

main();
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-candidate — 5-dimension candidate evaluation framework            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Usage:
//   node score-candidate.cjs --candidate=<path> [--baseline=<path>] [--output=<path>]
//
// When --baseline is present, the scorer evaluates both files and emits:
//   baselineScore: weighted baseline score
//   delta: total and per-dimension candidate-minus-baseline score deltas
//   thresholdDelta: comparison threshold from --thresholdDelta, manifest scoring,
//     or the default value of 2.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const {
  ERROR_TYPES,
  EXIT_CODES,
  makeTypedError,
  parseTypedError,
  serializeTypedError,
} = require('../lib/typed-errors.cjs');
const {
  WEIGHTED_SCORE_GATE,
  PROMOTION_GATES,
  evaluatePromotionGates,
} = require('../lib/promotion-gates.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

// 015 P2 (dedup): dedupe the repeated infra-failure emission. Each early-exit failure site built the
// same infra_failure object and ran the identical outputPath/writeJson/stdout/exit branch.
// emitInfraFailure centralizes the standard fields plus the write-or-stdout + exit code,
// taking only the per-site variable fields.
function emitInfraFailure(outputPath, fields) {
  const failure = {
    status: 'infra_failure',
    evaluationMode: 'dynamic-5d',
    mode: 'agent-improvement',
    ...fields,
  };
  if (outputPath) {
    writeJson(outputPath, failure);
  } else {
    process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
  }
  process.exit(1);
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableJson(entry)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function stripVolatileFields(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => stripVolatileFields(entry));
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      if (key === 'timestamp' || key === 'generatedAt') {
        continue;
      }
      result[key] = stripVolatileFields(entry);
    }
    return result;
  }
  return value;
}

function safeRead(filePath) {
  try {
    return readUtf8(filePath);
  } catch (error) {
    return { error: error.message };
  }
}

function stripJsonComments(content) {
  return content
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function loadManifest(manifestPath) {
  if (!manifestPath) {
    return null;
  }
  const raw = safeRead(manifestPath);
  if (typeof raw !== 'string') {
    return { error: raw.error };
  }
  try {
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    return { error: `Manifest parse failed: ${error.message}` };
  }
}

function inferProfileId(targetPath, explicitProfile, manifest) {
  if (explicitProfile) {
    return explicitProfile;
  }
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.profileId) {
    return manifestTarget.profileId;
  }
  return 'dynamic';
}

function inferFamily(profileId, manifest, targetPath) {
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.family) {
    return manifestTarget.family;
  }
  return profileId;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

const DIMENSION_WEIGHTS = {
  structural: 0.20,
  ruleCoherence: 0.25,
  integration: 0.25,
  outputQuality: 0.15,
  systemFitness: 0.15,
};

const RUBRIC_VERSION = 'dynamic-5d/p126-reproducibility-v1';

// F-P1-11: scope the score cache under a packet-local directory rather than a shared,
// world-writable os.tmpdir() location whose contents are trusted before rescoring.
// Prefer the --output directory (the canonical packet-local outputs dir), then the
// candidate's own directory; only fall back to os.tmpdir() when neither is available.
function defaultCacheDir({ outputPath, candidatePath } = {}) {
  const anchorDir = outputPath
    ? path.dirname(path.resolve(outputPath))
    : candidatePath
      ? path.dirname(path.resolve(candidatePath))
      : null;
  if (anchorDir) {
    return path.join(anchorDir, '.score-cache');
  }
  return path.join(os.tmpdir(), 'deep-improvement-score-cache');
}

function computeInputHash(input) {
  return crypto
    .createHash('sha256')
    .update(stableJson(input))
    .digest('hex');
}

function cachePathFor(cacheDir, inputHash) {
  return path.join(cacheDir, `${inputHash}.json`);
}

// F017-P2-10 (017 review): the filename is the only thing binding a cache entry to its
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
/bin/zsh -lc "rg -n \"generate-profile|profileAgent|args\\.target|args\\.baseline|buildProfile|derived profile|inputHash|recommendation\" .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs && sed -n '360,760p' .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
195:function cachePathFor(cacheDir, inputHash) {
196:  return path.join(cacheDir, `${inputHash}.json`);
200:// inputHash. Treat the embedded blob as untrusted on read: require cached.inputHash to
201:// equal the recomputed inputHash AND a scored status. Any mismatch (tampered or stale
204:function readCachedScore(cacheDir, inputHash) {
205:  const cachePath = cachePathFor(cacheDir, inputHash);
218:  if (cached.inputHash !== inputHash || cached.status !== 'scored') {
224:function writeCachedScore(cacheDir, inputHash, result) {
225:  writeJson(cachePathFor(cacheDir, inputHash), result);
362:// F017-P2-13b (017 review): command/skill refs come from candidate-derived profile
496:  const baselinePath = args.baseline;
498:  const targetPath = args.target || candidatePath;
522:  // Dynamic mode is the only evaluation path. generate-profile.cjs + 5-dimension scoring.
535:  const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
584:    baselineProfile = runScript('generate-profile.cjs', [`--agent=${baselinePath}`]);
600:  const inputHash = computeInputHash({
627:    const cached = readCachedScore(cacheDir, inputHash);
652:  const recommendation = hasUnscoredDimensions
668:    inputHash,
684:    recommendation,
696:    writeCachedScore(cacheDir, inputHash, result);
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
  const cacheDir = path.resolve(
    args['cache-dir'] || defaultCacheDir({ outputPath, candidatePath }),
  );

  if (!candidatePath) {
    process.stderr.write('Missing required --candidate argument\n');
    process.exit(2);
  }

  const candidateContent = safeRead(candidatePath);
  if (typeof candidateContent !== 'string') {
    emitInfraFailure(outputPath, {
      profileId: args.profile || null,
      family: null,
      target: targetPath,
      candidate: candidatePath,
      error: candidateContent.error,
      failureModes: ['profile-generation-failure'],
    });
  }

  // Dynamic mode is the only evaluation path. generate-profile.cjs + 5-dimension scoring.
  const manifest = loadManifest(manifestPath);
  if (manifest && manifest.error) {
    emitInfraFailure(outputPath, {
      profileId: args.profile || null,
      family: null,
      target: targetPath,
      candidate: candidatePath,
      error: manifest.error,
      failureModes: ['manifest-parse-failure'],
    });
  }

  const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
  if (!profile || !profile.id) {
    emitInfraFailure(outputPath, {
      target: targetPath,
      candidate: candidatePath,
      error: profile?.message || 'Failed to generate dynamic profile',
      errorType: profile?.errorType || 'UNKNOWN',
      failureModes: [`profile-generation-${(profile?.errorType || 'failure').toLowerCase()}`],
    });
  }

  const manifestProfileId = inferProfileId(targetPath, args.profile, manifest);
  const resolvedProfileId = manifestProfileId !== 'dynamic' ? manifestProfileId : profile.id;
  const family = inferFamily(resolvedProfileId, manifest, targetPath);
  const agentName = profile.id;

  // Accept optional --weights=<json> to override DIMENSION_WEIGHTS
  let weightsOverride = null;
  if (args.weights) {
    try {
      weightsOverride = JSON.parse(args.weights);
    } catch (_err) {
      process.stderr.write('Warning: failed to parse --weights JSON, using defaults\n');
    }
  }
  const candidateIntegrationReport = runScript('scan-integration.cjs', [`--agent=${agentName}`]);

  let baselineResult = null;
  let baselineProfile = null;
  let baselineContent = null;
  let baselineIntegrationReport = null;
  let delta = null;
  let baselineScore = null;
  const thresholdDelta = resolveThresholdDelta(args, manifest);

  if (baselinePath) {
    baselineContent = safeRead(baselinePath);
    if (typeof baselineContent !== 'string') {
      emitInfraFailure(outputPath, {
        profileId: args.profile || null,
        family: null,
        target: targetPath,
        candidate: candidatePath,
        baseline: baselinePath,
        error: baselineContent.error,
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

web search: 
web search: site:hypothesis.readthedocs.io/en/latest stateful testing RuleBasedStateMachine shrinking targeted property based testing ...
web search: 
web search: https://arxiv.org/pdf/2605.21318
web search: 
web search: https://export.arxiv.org/pdf/2605.21318
web search: 
web search: arxiv 2605.21318 Dual-Evidence Gradient Purification RuleBank recurrence semantic edit regularization ...
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs | sed -n '490,610p' && nl -ba .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs | sed -n '205,290p' && nl -ba .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md | sed -n '25,105p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   490	  return Number.isFinite(parsed) ? parsed : 2;
   491	}
   492	
   493	function main() {
   494	  const args = parseArgs(process.argv.slice(2));
   495	  const candidatePath = args.candidate;
   496	  const baselinePath = args.baseline;
   497	  const manifestPath = args.manifest;
   498	  const targetPath = args.target || candidatePath;
   499	  const outputPath = args.output;
   500	  const cacheDisabled = args['no-cache'] === true || args['no-cache'] === 'true';
   501	  const cacheDir = path.resolve(
   502	    args['cache-dir'] || defaultCacheDir({ outputPath, candidatePath }),
   503	  );
   504	
   505	  if (!candidatePath) {
   506	    process.stderr.write('Missing required --candidate argument\n');
   507	    process.exit(2);
   508	  }
   509	
   510	  const candidateContent = safeRead(candidatePath);
   511	  if (typeof candidateContent !== 'string') {
   512	    emitInfraFailure(outputPath, {
   513	      profileId: args.profile || null,
   514	      family: null,
   515	      target: targetPath,
   516	      candidate: candidatePath,
   517	      error: candidateContent.error,
   518	      failureModes: ['profile-generation-failure'],
   519	    });
   520	  }
   521	
   522	  // Dynamic mode is the only evaluation path. generate-profile.cjs + 5-dimension scoring.
   523	  const manifest = loadManifest(manifestPath);
   524	  if (manifest && manifest.error) {
   525	    emitInfraFailure(outputPath, {
   526	      profileId: args.profile || null,
   527	      family: null,
   528	      target: targetPath,
   529	      candidate: candidatePath,
   530	      error: manifest.error,
   531	      failureModes: ['manifest-parse-failure'],
   532	    });
   533	  }
   534	
   535	  const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
   536	  if (!profile || !profile.id) {
   537	    emitInfraFailure(outputPath, {
   538	      target: targetPath,
   539	      candidate: candidatePath,
   540	      error: profile?.message || 'Failed to generate dynamic profile',
   541	      errorType: profile?.errorType || 'UNKNOWN',
   542	      failureModes: [`profile-generation-${(profile?.errorType || 'failure').toLowerCase()}`],
   543	    });
   544	  }
   545	
   546	  const manifestProfileId = inferProfileId(targetPath, args.profile, manifest);
   547	  const resolvedProfileId = manifestProfileId !== 'dynamic' ? manifestProfileId : profile.id;
   548	  const family = inferFamily(resolvedProfileId, manifest, targetPath);
   549	  const agentName = profile.id;
   550	
   551	  // Accept optional --weights=<json> to override DIMENSION_WEIGHTS
   552	  let weightsOverride = null;
   553	  if (args.weights) {
   554	    try {
   555	      weightsOverride = JSON.parse(args.weights);
   556	    } catch (_err) {
   557	      process.stderr.write('Warning: failed to parse --weights JSON, using defaults\n');
   558	    }
   559	  }
   560	  const candidateIntegrationReport = runScript('scan-integration.cjs', [`--agent=${agentName}`]);
   561	
   562	  let baselineResult = null;
   563	  let baselineProfile = null;
   564	  let baselineContent = null;
   565	  let baselineIntegrationReport = null;
   566	  let delta = null;
   567	  let baselineScore = null;
   568	  const thresholdDelta = resolveThresholdDelta(args, manifest);
   569	
   570	  if (baselinePath) {
   571	    baselineContent = safeRead(baselinePath);
   572	    if (typeof baselineContent !== 'string') {
   573	      emitInfraFailure(outputPath, {
   574	        profileId: args.profile || null,
   575	        family: null,
   576	        target: targetPath,
   577	        candidate: candidatePath,
   578	        baseline: baselinePath,
   579	        error: baselineContent.error,
   580	        failureModes: ['baseline-read-failure'],
   581	      });
   582	    }
   583	
   584	    baselineProfile = runScript('generate-profile.cjs', [`--agent=${baselinePath}`]);
   585	    if (!baselineProfile || !baselineProfile.id) {
   586	      emitInfraFailure(outputPath, {
   587	        target: targetPath,
   588	        candidate: candidatePath,
   589	        baseline: baselinePath,
   590	        error: baselineProfile?.message || 'Failed to generate dynamic profile for baseline',
   591	        errorType: baselineProfile?.errorType || 'UNKNOWN',
   592	        failureModes: [`baseline-profile-generation-${(baselineProfile?.errorType || 'failure').toLowerCase()}`],
   593	      });
   594	    }
   595	
   596	    baselineIntegrationReport = runScript('scan-integration.cjs', [`--agent=${baselineProfile.id}`]);
   597	  }
   598	
   599	  const effectiveWeights = weightsOverride || DIMENSION_WEIGHTS;
   600	  const inputHash = computeInputHash({
   601	    rubricVersion: RUBRIC_VERSION,
   602	    // F-P1-12: bind candidate identity into the cache key. Previously the hash covered
   603	    // candidateContent + targetPath but not the candidate/baseline paths, so a stale
   604	    // cache entry for one candidate could be served for a different candidate whose
   605	    // content/profile happened to hash the same. Keying on the paths makes a mismatch
   606	    // miss the cache and rescore. Score/dimension outputs for a given candidate path are
   607	    // unchanged (paths are part of the key, not the scoring math).
   608	    candidatePath,
   609	    baselinePath: baselinePath || null,
   610	    candidateContent,
   205	function deriveForbidden(secs) {
   206	  const ac = getSection(secs, 'ANTI');
   207	  if (!ac) { return []; }
   208	  return ac.split('\n')
   209	    .filter((l) => /^[-*]\s+\*\*[Nn]ever\b/.test(l.trim()))
   210	    .map((l, i) => ({ id: `anti-${i}`, pattern: l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim(), weight: W_ANTI }));
   211	}
   212	
   213	function tableNames(text) {
   214	  return text.split('\n')
   215	    .filter((l) => /^\|/.test(l.trim()) && !/^\|[-\s|]+$/.test(l) && !/^\|\s*(Skill|Agent|Command|Purpose|Path)\s*\|/i.test(l))
   216	    .map((r) => { const c = r.split('|').map((s) => s.trim()).filter(Boolean); return c.length ? c[0].replace(/`/g, '').replace(/^@/, '').trim() : null; })
   217	    .filter(Boolean);
   218	}
   219	
   220	function deriveIntegration(secs) {
   221	  const result = { commands: [], skills: [], agents: [] };
   222	  const rc = getSection(secs, 'RELATED RESOURCES');
   223	  if (!rc) { return result; }
   224	  const subs = {};
   225	  const h3s = allMatches(H3_RE, rc);
   226	  for (let i = 0; i < h3s.length; i++) {
   227	    const label = h3s[i][1].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
   228	    const start = h3s[i].index + h3s[i][0].length;
   229	    const end = i + 1 < h3s.length ? h3s[i + 1].index : rc.length;
   230	    subs[label] = rc.slice(start, end).trim();
   231	  }
   232	  const addUnique = (arr, val) => { if (!arr.includes(val)) { arr.push(val); } };
   233	  const cmdKey = Object.keys(subs).find((k) => k.includes('COMMAND'));
   234	  if (cmdKey) { allMatches(/`(\/[^`]+)`/g, subs[cmdKey]).forEach((m) => addUnique(result.commands, m[1])); }
   235	  const skillKey = Object.keys(subs).find((k) => k.includes('SKILL'));
   236	  if (skillKey) { tableNames(subs[skillKey]).forEach((n) => addUnique(result.skills, n)); }
   237	  const agentKey = Object.keys(subs).find((k) => k.includes('AGENT'));
   238	  if (agentKey) { tableNames(subs[agentKey]).forEach((n) => addUnique(result.agents, n)); }
   239	  return result;
   240	}
   241	
   242	function deriveMismatches(secs, perms) {
   243	  const cc = getSection(secs, 'CAPABILITY SCAN');
   244	  if (!cc) { return []; }
   245	  const out = [];
   246	  for (const row of cc.split('\n').filter((l) => /^\|\s*`/.test(l.trim()))) {
   247	    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
   248	    if (cells.length < 2) { continue; }
   249	    const tool = cells[0].replace(/`/g, '');
   250	    const norm = tool.replace(/_/g, '').toLowerCase();
   251	    for (const [perm, val] of Object.entries(perms)) {
   252	      if (val === 'deny' && norm.includes(perm.toLowerCase())) {
   253	        out.push({ tool, permission: perm, status: 'deny' });
   254	      }
   255	    }
   256	  }
   257	  return out;
   258	}
   259	
   260	// ─────────────────────────────────────────────────────────────────────────────
   261	// 7. PROFILE BUILDER
   262	// ─────────────────────────────────────────────────────────────────────────────
   263	function buildProfile(agentPath, content) {
   264	  const meta = parseFrontmatter(content);
   265	  const perms = parsePermissions(content);
   266	  const secs = parseSections(content);
   267	  const id = meta.name || path.basename(agentPath, '.md');
   268	  return {
   269	    id, family: 'derived', targetPath: agentPath, outputKind: 'markdown',
   270	    promotionEligible: false, generated: true, generatedAt: new Date().toISOString(),
   271	    agentMeta: {
   272	      name: id, mode: meta.mode || 'subagent',
   273	      temperature: parseFloat(meta.temperature) || 0.1,
   274	      permissionSummary: permSummary(perms),
   275	    },
   276	    derivedChecks: {
   277	      structural: deriveStructural(secs), ruleCoherence: deriveRules(secs),
   278	      outputChecks: deriveOutputChecks(secs), forbiddenBehaviors: deriveForbidden(secs),
   279	      integrationPoints: deriveIntegration(secs), capabilityMismatches: deriveMismatches(secs, perms),
   280	    },
   281	    benchmark: { fixtureDir: null, requiredAggregateScore: 80, minimumFixtureScore: 60, repeatabilityTolerance: 0 },
   282	  };
   283	}
   284	
   285	// ─────────────────────────────────────────────────────────────────────────────
   286	// 8. MAIN
   287	// ─────────────────────────────────────────────────────────────────────────────
   288	function main() {
   289	  const args = parseArgs(process.argv.slice(2));
   290	  if (!args.agent) {
    25	- `ship`: re-check the same evidence, require the canonical target to still match the accepted preimage, then copy the accepted candidate snapshot into the canonical target.
    26	
    27	The promotion gate contract defines the five required gates that must pass before either phase can proceed: prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval.
    28	
    29	**Promotion script:** `scripts/shared/promote-candidate.cjs`
    30	
    31	**Rollback script:** `scripts/shared/rollback-candidate.cjs`
    32	
    33	**Policy reference:** `references/shared/promotion_rules.md`
    34	
    35	---
    36	
    37	## 2. PROMOTION GATES
    38	
    39	### Gate 1: Prompt Scoring
    40	
    41	**Requirement:** Weighted score >= 70, baseline delta above runtime threshold, and every scored dimension meeting its named promotion gate.
    42	
    43	**Per-dimension gates:** `scripts/lib/promotion-gates.cjs` is the source of truth.
    44	
    45	| Dimension | Minimum Score |
    46	| --- | ---: |
    47	| `structural` | 80 |
    48	| `ruleCoherence` | 85 |
    49	| `integration` | 90 |
    50	| `outputQuality` | 75 |
    51	| `systemFitness` | 80 |
    52	
    53	**Validation:**
    54	- Run `scripts/agent-improvement/score-candidate.cjs` on the candidate
    55	- Check `score >= 70`
    56	- Check `recommendation === "candidate-better"` when promotion uses a baseline
    57	- Verify all 5 dimensions have scores (no NaN or missing values)
    58	- Verify `promotionGates.passed === true` or recompute the same map from score output
    59	
    60	**Failure mode:** `score_gate_failed` - candidate does not meet minimum quality threshold.
    61	
    62	---
    63	
    64	### Gate 2: Benchmark Status
    65	
    66	**Requirement:** Benchmark pass with `minimumAggregateScore >= 85`.
    67	
    68	**Validation:**
    69	- Run `scripts/model-benchmark/run-benchmark.cjs` with target-specific fixtures
    70	- Check `benchmark-outputs/report.json` exists
    71	- Check `report.status === "benchmark-complete"`
    72	- Check `report.aggregateScore >= 85`
    73	- Verify fixture coverage (all fixtures executed)
    74	
    75	**Failure mode:** `benchmark_gate_failed` - candidate fails output-based validation.
    76	
    77	**Note:** Benchmark integration requires target-specific fixture set under `assets/model_benchmark/benchmark-fixtures/`. Not all targets have fixtures; this gate is conditional on fixture availability.
    78	
    79	---
    80	
    81	### Gate 3: Repeatability Evidence
    82	
    83	**Requirement:** Minimum 3 benchmark runs with score variance <= 5.
    84	
    85	**Validation:**
    86	- Run `scripts/agent-improvement/benchmark-stability.cjs` on historical benchmark data
    87	- Check `runCount >= 3`
    88	- Check `scoreVariance <= 5`
    89	- Verify no regression across runs
    90	
    91	**Failure mode:** `repeatability_gate_failed` - benchmark results are not stable.
    92	
    93	**Note:** Repeatability is advisory only in current release. `benchmark-stability.cjs` emits recommendations but does not auto-apply them (ADR-005).
    94	
    95	---
    96	
    97	### Gate 4: Manifest Boundary Compliance
    98	
    99	**Requirement:** Candidate path matches `target_manifest.jsonc` target definition.
   100	
   101	**Validation:**
   102	- Load `assets/agent_improvement/target_manifest.jsonc`
   103	- Check candidate path matches `targets[].canonicalPath`
   104	- Verify target is marked `mutable: true`
   105	- Check candidate is under packet-local `candidates/` directory (not canonical)

web search: 
web search: site:github.com/microsoft/Test_Awareness_Steering commits 2025 ...
exec
/bin/zsh -lc 'rg -n -C 3 "deep-improvement|EvaluatorCapsule|oracle|metamorphic|test awareness|distributional|profile" .opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/synthesis-digest.md | head -300' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
15-- **Joyyang158/Reasoning-Bias-Detector** <https://github.com/Joyyang158/Reasoning-Bias-Detector> [high] — Keep bias detection outside the scorer and attach detector reasoning to the original immutable judgment before requesting a revised verdict.
16-- **ucl-dark/llm_debate** <https://github.com/ucl-dark/llm_debate> [high] — Make debate a typed escalation with separate debate, judge, accuracy, and tournament modules rather than another free-form council round.
17-- **lmarena/arena-hard-auto** <https://github.com/lmarena/arena-hard-auto> [high] — Judge every consequential pair in both orders and treat length and formatting as measured covariates rather than allowing presentation to leak into quality.
18:- **lmarena/PPE** <https://github.com/lmarena/PPE> [high] — Calibrate each model-plus-prompt judge profile offline against human preference and verifiable correctness data before using reliability weights in council aggregation.
19:- **cimo-labs/cje** <https://github.com/cimo-labs/cje> [high] — Calibrate each model-prompt-rubric-domain seat against a small oracle slice and abstain when the deployment distribution falls outside calibration support.
20-- **yale-nlp/bay-calibration-llm-evaluators** <https://github.com/yale-nlp/bay-calibration-llm-evaluators> [med] — Use posterior judge reliability and uncertainty instead of equal votes when only a sparse human calibration set is available.
21-- **scikit-activeml/scikit-activeml** <https://github.com/scikit-activeml/scikit-activeml> [high] — Model seat dispatch as selection of a task-annotator pair with an explicit utility matrix; adapt IntervalEstimationThreshold and expected-error-reduction strategies to judge reliability, cost, and availability.
22-- **cleanlab/cleanlab** <https://github.com/cleanlab/cleanlab> [high] — Maintain per-seat quality estimates and identify which disputed cases need another annotation, while treating its classification assumptions as an adaptation boundary for open-ended council judgments.
--
61-- **lm-sys/RouteLLM** <https://github.com/lm-sys/RouteLLM> [high] — Choose WIDEN by expected marginal quality per reserved cost, using first-stage disagreement and coverage; invalid policy scores should widen safely.
62-- **taskflow/taskflow** <https://github.com/taskflow/taskflow> [med] — Conditional scheduling is compact, but ordinal successor identity is construction-order-sensitive and duplicate activation needs a branch lease.
63-
64:### deep-improvement (6)
65-- **google/clusterfuzz** <https://github.com/google/clusterfuzz> [high] — Minimize and fingerprint the original failure before repair, then bind every repair receipt to that reproducer and its regression range.
66-- **google/syzkaller** <https://github.com/google/syzkaller> [high] — Use asymmetric flaky evidence: one observed regression can veto promotion, while absence requires repeated trials and coverage across required branches.
67-- **Aider-AI/aider** <https://github.com/Aider-AI/aider> [high] — Feed deterministic failures back into a bounded repair loop, but make successful re-run receipts mandatory because a retry cap alone proves nothing.
--
127-- [I:high/E:M] Append a lineage_dispatch_resolved event before spawn and require retries to reuse its canonical fingerprint, including CLI version and effective capability state.  _(iter 1)_
128-- [I:high/E:M] Add effect_prepared, effect_dispatched, effect_result, effect_unknown, effect_reconciled, and effect_compensated event schemas. Require stable effectId/logicalBranchId/idempotencyKey, changing attemptId, request and response hashes, provider receipt, verification status, and prevEventHash. Flush effect_prepared before invoking any side-effecting adapter.  _(iter 7)_
129-- [I:high/E:M] Append budget_reserved, budget_settled, budget_released, budget_soft_exhausted, budget_hard_exhausted, budget_reset, budget_granted, and budget_compensated JSONL events. Fold them into per-resource and per-window gauges, retaining policy version, lease ID, scope path, estimate, receipt, and reset_at.  _(iter 13)_
130:- [I:high/E:M] Add immutable JSONL events seat_profile_calibrated, seat_selected, seat_judgment_attached, and council_stopped, including all candidate utilities and the calibration fingerprint used for each adaptive decision.  _(iter 18)_
131-
132-### runtime/gauges-observability (4)
133-- [I:med/E:S] Expose deterministic-reject rate, judge-escalation rate, judge cost per promoted candidate, stale-receipt count, flaky-unknown count and regression delta as stream-fold gauges.  _(iter 10)_
--
191-### deep-review/runtime/state-jsonl-checkpointing (1)
192-- [I:high/E:M] Add a versioned Eval-DAG policy with hard, weighted-soft and judge nodes; schedule nodes topologically by cost and append an immutable receipt for every verdict while retaining raw component scores.  _(iter 10)_
193-
194:### deep-improvement/runtime/convergence (1)
195-- [I:high/E:L] Make candidate promotion require a fingerprint-matched verification bundle containing original-reproducer, target-fix, impacted-regression and risk-selected full-gate receipts; timeout, flakiness or missing evidence yields UNVERIFIED.  _(iter 10)_
196-
197-### runtime/dedup-novelty (1)
--
209-### deep-review + deep-ai-council + runtime/gauges-observability (1)
210-- [I:high/E:M] Implement a three-tier verification ladder: deterministic tests and schema checks, lightweight calibrated scorer, then generative process verifier. Persist every raw score before reduction and require verifier escalation only for uncertainty-band or high-impact cases.  _(iter 16)_
211-
212:### deep-improvement + runtime/convergence (1)
213-- [I:high/E:M] Run controller learning in shadow mode over complete paired replays: log the action a learned controller would take, compare it with the live policy, and promote only versioned policies that pass quality-cost Pareto and replay-determinism gates.  _(iter 16)_
214-
215-### deep-ai-council/runtime/state-jsonl-checkpointing (1)
--
218-### deep-ai-council/runtime/convergence (1)
219-- [I:high/E:L] Replace two-of-three as the final rule with a protocol router: objective evidence gate first, blinded swapped pairwise judging second, detector-guided revision on bias flags, bounded debate only for unresolved high-value uncertainty, and constitutional vetoes for frozen hard constraints.  _(iter 17)_
220-
221:### deep-improvement/deep-ai-council/runtime/convergence (1)
222:- [I:high/E:L] Create a versioned judge-profile registry calibrated offline with human-preference and verifiable-correctness fixtures; store Brier score, domain accuracy, swap consistency, bias coefficients, effective sample size, and compatibility fingerprints, then use posterior best-candidate probability plus expected regret as the council stop signal.  _(iter 17)_
223-
224-### runtime/convergence + runtime/state-jsonl-checkpointing (1)
225-- [I:high/E:M] Add convergence_candidate, verification_pending, converged, degeneration_detected, and quarantined_inconclusive events. Require a health-witness reducer over held-out quality, invariance probes, objective drift, semantic-community survival, and council independence before converged is legal.  _(iter 19)_
--
227-### deep-ai-council + runtime/gauges-observability (1)
228-- [I:high/E:M] Emit immutable per-round council_stance and stance_flip events, then derive flip_to_majority_rate, flip_to_evidence_rate, pairwise influence, influence concentration, and effective independent seats. Block agreement-based STOP when independence falls below a calibration-derived threshold.  _(iter 19)_
229-
230:### deep-review + deep-improvement (1)
231:- [I:high/E:M] Insert a cheap metamorphic gate before generative judging: rerun deterministic checks under candidate-label permutations, evidence-order changes, identifier renaming, and equivalent tool-result transforms; after candidate selection, require frozen cross-domain alignment canaries before promotion.  _(iter 19)_
232-
233-### runtime/state-jsonl-checkpointing + runtime/locks-recovery + deep-alignment (1)
234-- [I:high/E:M] Add a transition-authorization kernel before the JSONL append boundary. Require transition_proposed followed by transition_authorized or transition_denied carrying actor_role, policy_version, projection_hash, health_state, budget_snapshot, receipt_refs, decision_id, and reasons. Encode the transition system in Quint and model-check at least: no effect without a receipt, deterministic replay, quarantine cannot self-clear, recovery authority is external to the quarantined lineage, and every bounded retry path eventually terminates or escalates.  _(iter 20)_
--
236-### deep-ai-council + runtime/fan-out-fan-in + runtime/budget-cost + runtime/gauges-observability (1)
237-- [I:high/E:M] Introduce an adjudication_broker that chooses among accept, abstain, add_judge, execute_evidence, bounded_debate, and human_escalation using estimated downstream-loss reduction minus typed cost. Persist context, candidate actions, chosen action, selection propensity, policy version, and delayed outcome on every decision. Evaluate replacements with IPS and doubly-robust estimators, but fail closed to the fixed council when support or effective-sample diagnostics are inadequate.  _(iter 20)_
238-
239:### runtime/convergence + runtime/gauges-observability + runtime/locks-recovery + deep-improvement (1)
240-- [I:high/E:L] Build a read-only loop_health_witness plus a causal degeneration benchmark. Stream raw gauges through change detectors, append immutable health_alarm attachments, and inject proxy capture, semantic collapse, conformity cascades, verifier corruption, and objective drift into replayed trajectories. Use precommitted recovery rules: single statistical alarm requests evidence; alarm plus mechanistic invariant failure quarantines; receipt or state-integrity violation quarantines immediately; only the transition kernel can authorize rollback, branch, seat rotation, verifier rotation, or human escalation.  _(iter 20)_
241-
242-
--
274-- **Once a deadline or failure threshold decides fan-in, remaining executions are effectively stopped.** vs AWS documents that child workflows may continue after a threshold is exceeded, requiring separate decision, cancellation, and late-result receipts. _(ev: https://docs.aws.amazon.com/step-functions/latest/dg/state-map-distributed.html)_
275-- **[deep-review] A weighted aggregate above threshold is sufficient for promotion.** vs Hard schema, build, security and regression failures must remain vetoes; otherwise strong soft scores can conceal a broken invariant. _(ev: https://github.com/promptfoo/promptfoo/blob/main/src/assertions/assertionsResult.ts)_
276-- **[deep-review] A rule failure should always be sent to an LLM judge that may rescue it.** vs Rescue is appropriate for ambiguous answer matching, but an LLM must not overturn deterministic hard gates; only soft or uncertain nodes should be judge-rescuable. _(ev: https://github.com/open-compass/opencompass/blob/main/opencompass/evaluator/cascade_evaluator.py)_
277:- **[deep-improvement] Passing FAIL_TO_PASS and a selected PASS_TO_PASS set proves no regression.** vs SWE-bench issue #280 shows unchanged tests can still regress outside the selected set, so promotion needs an impacted or full-suite baseline delta. _(ev: https://github.com/SWE-bench/SWE-bench/issues/280)_
278-- **[runtime/convergence] Failure to reproduce means the defect is fixed.** vs OSS-Fuzz and syzkaller explicitly account for nondeterministic and environment-sensitive failures; non-reproduction without sufficient trials is UNKNOWN. _(ev: https://google.github.io/oss-fuzz/advanced-topics/bug-fixing-guidance; https://github.com/google/syzkaller/blob/master/docs/syzbot.md)_
279-- **A fixed-seed hierarchical Leiden partition provides stable semantic-community identifiers for continuity.** vs A seed improves repeatability for an unchanged graph, but added nodes and edges can split, merge or relabel communities; durable IDs require explicit cross-snapshot matching and lifecycle events. _(ev: https://github.com/graspologic-org/graspologic/blob/main/graspologic/partition/leiden.py ; https://arxiv.org/abs/2601.08554)_
280-- **Append-only memory is sufficient to preserve contradictions safely.** vs Append-only storage preserves evidence but, without an as-of projector and explicit resolution events, retrieval can surface mutually incompatible versions and count both as novelty. _(ev: https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py ; https://docs.xtdb.com/intro/what-is-xtdb.html)_
--
293-- **Persisting the latest completed action is equivalent to recording every nondeterministic effect.** vs Action-level persistence leaves a crash window after an effect returns but before the action checkpoint commits; effect receipts close more of that window and expose the remaining ambiguity. _(ev: https://burr.apache.org/docs/reference/persister/)_
294-- **For deep-ai-council, more agreeing samples provide stronger evidence and can safely trigger quorum.** vs ReASC shows that responses should contribute according to reliability, while R3 implies correlated seats are not independent evidence; quorum needs confidence and effective-independence weighting. _(ev: https://arxiv.org/abs/2601.02970)_
295-- **For deep-review, cheap checks should always precede and largely replace expensive judges.** vs GenPRM and ThinkPRM show that additional verifier-side reasoning can improve difficult judgments; the reconciled policy is conditional escalation rather than judge elimination. _(ev: https://github.com/RyanLiu112/GenPRM and https://github.com/mukhal/ThinkPRM)_
296:- **For runtime/convergence, online adaptation from majority pseudo-rewards should make each successive iteration more effective.** vs Live TTRL-style updates change the decision policy during replay and can amplify correlated majority errors; adaptation must be checkpoint-versioned, evaluated off-policy, and promoted through deep-improvement. _(ev: https://github.com/PRIME-RL/TTRL)_
297-- **More votes eventually wash out judge bias.** vs The July 2026 Bayesian-ranking study reports naive aggregation plateauing at the wrong top-k under systematically biased judges; additional correlated votes reinforce the bias. _(ev: https://arxiv.org/abs/2607.02104)_
298-- **Debate with a judge is categorically superior to majority vote.** vs Debate helps under specific information and capability asymmetries, while comparative work finds task- and protocol-dependent outcomes; it should be an escalation policy, not the universal reducer. _(ev: https://arxiv.org/abs/2402.06782 and https://github.com/deeplearning-wisc/debate-or-vote)_
299-- **A constitutional judge is more objective because its principles are explicit.** vs Explicitness improves auditability, but the constitution can encode contested priorities or omit factual criteria; principle authorship and empirical correctness still require separate evaluation. _(ev: https://arxiv.org/abs/2406.07814)_
--
305-- **Improving aggregate reward or checkpoint quality means the optimization loop is healthy.** vs Localized reward-hacking transitions can be hidden by aggregate checkpoint means, and narrow optimization can generalize into unrelated misalignment. _(ev: https://arxiv.org/abs/2606.03238; https://arxiv.org/abs/2502.17424)_
306-- **A policy engine can make the JSONL runtime safe by itself.** vs Per-transition authorization does not prove temporal liveness, replay determinism, or safe behavior across retries and reordered events; those require an executable transition model and invariant checking. _(ev: https://github.com/cedar-policy/cedar and https://github.com/quint-co/quint)_
307-- **Logged fixed-council trajectories can directly compare any adaptive seat router.** vs Off-policy estimates require logged action propensities and adequate support for the target router; unsupported actions make the comparison unidentified regardless of estimator sophistication. _(ev: https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/tutorials/off_policy_evaluation.html)_
308:- **A stream-drift alarm is sufficient evidence that the loop has degenerated.** vs Drift detection establishes a distributional change, not its cause or harmfulness; causal assumptions, injected interventions, refuters, and mechanistic invariants are needed before destructive recovery. _(ev: https://riverml.xyz/latest/api/drift/ADWIN/ and https://www.pywhy.org/dowhy/v0.13/)_
309-
310-
311-## D. Insights by primary subsystem
--
324-- Replace count-based council quorum with a two-stage gate: calibrated single-leaf acceptance followed by confidence-weighted evidence accumulation, discounted by shared model, prompt, evidence, and ancestry. _(ev: Reliability-Aware Adaptive Self-Consistency — https://arxiv.org/abs/2601.02970, high)_
325-- Bandwagon mitigation requires information isolation, not a stronger anti-sycophancy prompt: blind author identity, model identity, seat scores, and vote counts until all independent judgments are committed. _(ev: https://github.com/Joyyang158/Reasoning-Bias-Detector, high)_
326-- A swapped-order pair should be the atomic adjudication unit; disagreement between the two orders is an abstention or escalation signal, not a tie to break arbitrarily. _(ev: https://arena.ai/blog/arena-hard/, high)_
327:- Bayesian reliability and bias coefficients cannot be learned reliably from a single 2-3-seat council; they need persistent calibration profiles versioned by model, judge prompt, rubric, and schema fingerprint. _(ev: https://arxiv.org/abs/2607.02104 and https://github.com/lmarena/PPE, med)_
328-- Debate is most justified when generators have evidence or reasoning capacity unavailable to the judge; route to bounded debate on high expected value of information, then let a separately instantiated judge decide. _(ev: https://arxiv.org/abs/2402.06782 and https://github.com/ucl-dark/llm_debate, high)_
329-- Constitutional adjudication should be a versioned hard-constraint layer with principle-specific findings and lexicographic precedence, authored independently from the judge; it should not substitute for factual or execution evidence. _(ev: https://arxiv.org/abs/2406.07814, med)_
330-- Nominal council size is misleading: record dependence-adjusted effective seat count from held-out residual correlations and use it in the convergence gate. _(ev: https://machinelearning.apple.com/research/correlated-llm-evaluation-panels, high)_
331:- Inter-judge agreement must not count as alignment unless effective-rank and human-oracle-subspace diagnostics also pass; correlated agreement can encode shared bias. _(ev: https://www.microsoft.com/en-us/research/publication/the-geometry-of-llm-as-judge-why-inter-llm-consensus-is-not-human-alignment/, high)_
332-- Council dispatch should be selective: calibrated risk-coverage curves can decide when a cheap seat is sufficient and when escalation buys enough expected agreement to justify its cost. _(ev: https://arxiv.org/abs/2407.18370, high)_
333:- When oracle labels are absent, judge-specific discrimination inferred from pairwise probabilities and cycle consistency is a better fallback than uniform weighting, but remains an unsupervised proxy rather than human calibration. _(ev: https://arxiv.org/abs/2602.16610, high)_
334-- Council degeneration is detectable from stance trajectories: classify every flip as toward evidence, the previous majority, the user, or a specific peer, then derive pairwise influence concentration and effective independent-seat count. _(ev: https://arxiv.org/abs/2604.02668, med)_
335-- Council adjudication is naturally a cost-sensitive contextual-bandit problem whose action value is expected downstream-loss reduction minus execution and latency cost, not disagreement or entropy reduction alone. _(ev: https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/tutorials/off_policy_evaluation.html, high)_
336-- Adaptive seat routing makes naive before-versus-after evaluation invalid; every seat_selected event needs its available-action set, selection propensity, router version, and eventual outcome, with deployment blocked when overlap diagnostics fail. _(ev: https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/tutorials/off_policy_evaluation.html, high)_
--
414-- Predicted failure need not mean termination: preserve the logical branch and hotswap its accumulated context to a stronger executor, while retaining the original attempt as censored evidence with a recovery receipt. _(ev: Atropos — https://arxiv.org/abs/2604.15075, med)_
415-- Termination legality and recovery authority are different control problems: a loop may correctly refuse STOP while still being unsafe if it can authorize its own unquarantine, rollback, or verifier replacement. _(ev: https://github.com/cedar-policy/cedar and https://github.com/quint-co/quint, high)_
416-
417:### deep-improvement (2)
418-- Promotion proof is a receipt lattice: target-failure repair, preservation of baseline-pass behavior, explicit baseline-known failures, and environment-policy freshness are independent requirements. _(ev: https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py; https://github.com/SWE-bench/SWE-bench/issues/280, high)_
419-- For nondeterministic regressions, positive reproduction and clean evidence have different evidentiary strength; UNKNOWN must remain distinct from PASS throughout reduction and promotion. _(ev: https://github.com/google/syzkaller/blob/master/docs/syzbot.md; https://google.github.io/oss-fuzz/advanced-topics/bug-fixing-guidance, high)_
420-

codex
The source check exposes the highest-leverage defect: weights and thresholds are frozen, but the target profile is not. `score-candidate.cjs` derives one profile from the candidate and another from the baseline, so the reported delta compares different check sets. The synthesis will therefore rank “freeze once from the canonical target, then epoch evaluator changes” above additional judges or more search.
codex
The moat should be an auditable counterfactual claim: under evaluator epoch E, bounded candidate C outperformed baseline B without weakening hidden behavioral invariants. Other deep modes discover evidence, diagnose defects, or adjudicate opinions; deep-improvement alone should own controlled mutation, paired evaluation, and promotion.

One critical correction comes first. Lane A’s evaluator is only partly frozen today. [score-candidate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:535) derives a profile from the candidate, then derives another from the baseline at line 584. [generate-profile.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs:263) builds the checks from whichever agent it receives. The weights are frozen; the check set is not. A candidate can therefore partly change what it is judged on, and the baseline delta is not strictly apples-to-apples.

Highest-leverage changes, ranked by impact versus effort:

1. Freeze an `EvaluatorCapsuleV3` once at INIT. Preserve dynamic onboarding, but derive the profile only from the canonical preimage. The capsule should bind the canonical target hash, derived profile, rubric version, weights, promotion gates, fixture commitments, grader model/prompt/schema, gold-calibration hash, environment fingerprint, and feedback-disclosure policy. Both candidate and baseline must be scored through that same capsule. Bind `capsuleHash` into score caches, JSONL events, acceptance records, and ship receipts. Any evaluator amendment starts a new `evaluatorEpoch`; cross-epoch deltas become invalid. This borrows DVC’s dependency-lock shape—not its hash defaults—and keeps SHA-256 as the identity primitive. [DVC](https://github.com/treeverse/dvc)

2. Regularize semantic rule growth, not merely prompt length. [TextReg](https://arxiv.org/abs/2605.21318) identifies a characteristic failure of iterative prompt optimization: longer prompts accumulating narrow, sample-specific rules. Add a rule-delta ledger that classifies each semantic addition as `GENERALIZED_RULE`, `CASE_PATCH`, or `STYLE_ONLY`. Require generalized additions to recur across distinct failure families; discard stylistic restatements; quarantine case patches until they survive a held-out family. Rank candidates by held-out gain minus frozen capacity and narrow-scope penalties. This makes “simpler candidate wins ties” measurable rather than editorial.

3. Turn the prior cheap metamorphic check into a first-class behavioral-family gate. Each relation should declare a precondition, transformation, expected output/trace relation, risk tier, visibility, and shrinker. Use Hypothesis-style generators and shrinking to retain the smallest failing family; Hypothesis already separates generation, targeting, shrinking, replay, and state-machine sequences. [Hypothesis](https://github.com/HypothesisWorks/hypothesis), [stateful testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) Add a special evaluation-context family pairing realistic and obvious test/simulation cues. Microsoft’s test-awareness work used 2,587 real/hypothetical pairs and found material behavioral differences; deep-improvement can adopt the paired black-box test without its white-box steering machinery. [Paper](https://arxiv.org/abs/2505.14617), [repository](https://github.com/microsoft/Test_Awareness_Steering) Reduce each family to `PASS`, `BREACH`, or `INSUFFICIENT_EVIDENCE`, then aggregate to `GO`, `NO-GO`, or `INCONCLUSIVE`, following NeMo Evaluator’s separation of tolerance breach from insufficient paired evidence. [NeMo quality gates](https://docs.nvidia.com/nemo/evaluator/tutorials/quality-gate)

The documented promotion contract currently makes target-specific behavioral benchmarks conditional and repeatability advisory. [promotion_gate_contract.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md:64) That is acceptable for keeping an advisory candidate, but canonical shipping should be `INCONCLUSIVE` without capsule-bound behavioral evidence.

This sharpens the unique value cleanly: naive self-improvement optimizes a criterion it can observe—and often redefine—so score gain, grader gaming, and real improvement are entangled. Deep-improvement can separate proposer, frozen contract, hidden relational tests, and promotion authority, then preserve the exact evidence tuple that justified mutation. That controlled attribution is the moat.

```json
{
  "new_repos": [
    {
      "name": "NVIDIA-NeMo/Evaluator",
      "url": "https://github.com/NVIDIA-NeMo/Evaluator",
      "stars": "~311",
      "what": "Reproducible evaluation framework with paired run comparison, policy-driven GO/NO-GO/INCONCLUSIVE gates, interceptors, sandboxes, and an April 2026 release signal.",
      "lesson": "Adapt nemo_evaluator.engine.gate's per-item paired evidence and critical/supporting/advisory policy tiers for candidate promotion, keeping INSUFFICIENT_EVIDENCE distinct from PASS.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "HypothesisWorks/hypothesis",
      "url": "https://github.com/HypothesisWorks/hypothesis",
      "stars": "~8.8k",
      "what": "Property-based and stateful testing library with generation, targeted search, failure replay, and automatic shrinking; release 6.156.6 shipped July 10, 2026.",
      "lesson": "Represent metamorphic fixture families as strategies, target high-severity relation violations, and shrink failures into minimal promotion-blocking counterexamples.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "microsoft/Test_Awareness_Steering",
      "url": "https://github.com/microsoft/Test_Awareness_Steering",
      "stars": "~14",
      "what": "NeurIPS 2025 research code and paired real-versus-hypothetical datasets for measuring evaluation awareness; no releases found.",
      "lesson": "Add black-box evaluation-context twins that differ only in realistic versus obvious test cues and veto candidates whose behavior becomes more cue-dependent.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "treeverse/dvc",
      "url": "https://github.com/treeverse/dvc",
      "stars": "~15.7k",
      "what": "Data and experiment versioning system whose pipeline metadata links code, parameters, dependencies, outputs, and cached executions; release 3.67.1 shipped March 31, 2026.",
      "lesson": "Use a dependency-lock-shaped evaluator capsule so profile, fixtures, grader configuration, calibration, and environment form one versioned evaluation epoch; retain SHA-256 rather than copying DVC hash defaults.",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Lane A currently generates separate candidate and baseline profiles, so the measured delta compares two subject-derived check sets; freezing weights alone does not freeze the evaluator.",
      "evidence": "Local source: scripts/agent-improvement/score-candidate.cjs lines 535 and 584; generate-profile.cjs buildProfile lines 263-282",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evaluator identity should be a versioned dependency closure over the canonical profile, rubric, fixture commitments, grader, calibration, and environment; amendments open a new epoch rather than silently changing the ruler.",
      "evidence": "https://github.com/treeverse/dvc",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Metamorphic evaluation becomes substantially more actionable when relation families are generated and failing variants are shrunk into minimal counterexamples, rather than retained as an ad hoc list of perturbations.",
      "evidence": "https://github.com/HypothesisWorks/hypothesis ; https://arxiv.org/abs/2605.23965",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Real-versus-test-cued twin fixtures detect deployment/evaluation divergence that ordinary held-out accuracy misses; this should be a hard parity gate for affected agent behaviors.",
      "evidence": "https://arxiv.org/abs/2505.14617 ; https://github.com/microsoft/Test_Awareness_Steering",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Prompt improvement needs representation regularization: recurrent, broadly supported rules should survive, while batch-specific patches and style-only rewrites should be filtered before expensive evaluation.",
      "evidence": "https://arxiv.org/abs/2605.21318",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add freeze-evaluator.cjs at INIT to emit EvaluatorCapsuleV3 from the canonical target; make score-candidate.cjs require --capsule for baseline deltas and score both subjects with one frozen profile; bind capsuleHash into cache keys, journal events, accept/ship receipts, and reject cross-evaluatorEpoch comparisons.",
      "target": "deep-improvement",
      "rationale": "This closes the confirmed profile-substitution gap while retaining target-specific dynamic profiling.",
      "uniqueness": "It converts evaluator-first from a workflow convention into a mechanically enforced separation between mutator and ruler—the core advantage over naive self-improvement.",
      "effort": "M",
      "impact": "high",
      "evidence": "Local score-candidate.cjs lines 535 and 584; https://github.com/treeverse/dvc"
    },
    {
      "rec": "Add a rule-delta ledger and proposal filter: canonicalize semantic additions, classify them as GENERALIZED_RULE, CASE_PATCH, or STYLE_ONLY, count support across distinct failure families, and rank candidates by held-out delta minus capsule-frozen capacity and scope-narrowness penalties.",
      "target": "deep-improvement/runtime/dedup-novelty",
      "rationale": "It suppresses prompt bloat, example memorization, and cosmetically different candidates before costly graders and promotion gates.",
      "uniqueness": "Deep-improvement can prove that a change generalizes across evidence families; a self-rewriter optimizing its visible score cannot distinguish broad rules from grader-specific patches reliably.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2605.21318"
    },
    {
      "rec": "Add run-metamorphic-gate.cjs plus a relation registry whose records contain precondition, generator, transform, comparator, visibility, risk tier, and shrinker; include semantic-invariance, identifier-equivariance, tool-trace, and real-versus-test-context families; emit PASS/BREACH/INSUFFICIENT_EVIDENCE per family and require aggregate GO for canonical promotion.",
      "target": "deep-improvement/runtime/convergence",
      "rationale": "This deepens the prior cheap metamorphic recommendation into a reproducible, minimizable behavioral proof and prevents missing fixtures from being treated as non-regression.",
      "uniqueness": "Hidden relational tests let deep-improvement validate behavior the proposer cannot directly optimize or redefine, yielding a stronger promotion moat than static scoring.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/HypothesisWorks/hypothesis ; https://arxiv.org/abs/2603.13173 ; https://arxiv.org/abs/2505.14617 ; https://docs.nvidia.com/nemo/evaluator/tutorials/quality-gate"
    }
  ],
  "contradictions": [
    {
      "claim": "Dynamic five-dimension profiling provides a frozen evaluator and comparable candidate-minus-baseline deltas.",
      "counter": "The scorer derives the candidate profile from the candidate and the baseline profile from the baseline, allowing the evaluated check set to change with the subject.",
      "evidence": "Local scripts/agent-improvement/score-candidate.cjs lines 535 and 584; generate-profile.cjs lines 263-282"
    },
    {
      "claim": "Passing a static held-out aggregate is enough to establish deployment robustness.",
      "counter": "Semantic-invariance and test-awareness studies show that equivalent phrasing or obvious test cues can materially change behavior while conventional benchmark performance remains superficially acceptable.",
      "evidence": "https://arxiv.org/abs/2603.13173 ; https://arxiv.org/abs/2505.14617"
    }
  ],
  "next_angles": [
    "Build a profile-substitution benchmark containing adversarial candidates that delete, rename, or weaken self-declared rules; compare current self-derived scoring against one frozen canonical capsule and measure false promotions.",
    "Specify a metamorphic-relation DSL for agent prompts and tool traces, then audit relation validity and shrink quality across routing, coding, review, and safety targets.",
    "Benchmark TextReg-style recurrence and scope penalties against held-out-only selection, measuring cross-domain correctness, prompt growth, narrow-rule accumulation, and rejected useful special cases.",
    "Calibrate evaluation-context parity thresholds by testing whether real-versus-test-cued gaps predict shadow-production regressions better than ordinary held-out aggregates.",
    "Define the evaluator-amendment protocol: who may change a capsule, which evidence invalidates, how a new baseline is established, and how histories remain comparable without pretending cross-epoch continuity."
  ],
  "notes": "The memory daemon was sandbox-blocked, so prior coverage was taken from the supplied recap and local synthesis digest. No public TextReg implementation was found as of 2026-07-15; the mechanism comes from the primary preprint. Hypothesis supplies generation and shrinking, not semantic-validity guarantees, so non-logical metamorphic relations still need operator-authored preconditions and validity audits. The Microsoft repository is small research code; the recommended transfer is its paired black-box fixture design, not white-box activation steering."
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
210,248
