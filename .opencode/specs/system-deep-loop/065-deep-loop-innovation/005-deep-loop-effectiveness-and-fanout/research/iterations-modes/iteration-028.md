<!-- iteration 28 | SOL xhigh | mode: agent-improvement | angle: A3-mech agent-improvement :: mechanisms & reference impls | 2026-07-15T10:21:49.046Z -->

The current mode has sound promotion discipline, but its behavioral evidence is still thin: coherence relies partly on section/keyword checks, while stress testing centers on a same-task generic-versus-disciplined A/B ([score dimensions](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/references/agent-improvement/score_dimensions.md), [stress protocol](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/references/agent-improvement/stress_test_protocol.md)). The next step is not more judging—it is controlled intervention, causal attribution, and executor-transfer evidence.

### 1. Turn benchmarks into locus-aware experiments

Adopt ASB’s perturbation taxonomy, but repurpose it from security attacks to agent-definition diagnosis. ASB independently perturbs user input, tool observations, planning prompts, and memory, while measuring attack success and original-task success separately ([config matrix](https://github.com/agiresearch/ASB/tree/main/config), [runner](https://github.com/agiresearch/ASB/blob/main/main_attacker.py)).

Each benchmark should declare:

```ts
interface BehaviorExperiment {
  scenarioId: string;
  family: string;
  injectedLocus:
    | "agent_clause" | "tool_description" | "observation"
    | "router" | "memory" | "executor";
  expectedReceipts: ReceiptPredicate[];
  forbiddenReceipts: ReceiptPredicate[];
  cleanUtilityOracle: VerifierRef;
  perturbations: PerturbationSpec[];
}
```

Run `baseline × candidate × clean/injected × executor × seed`. Record repair lift, clean-task retention, causal-blame accuracy, and cross-executor transfer. A candidate that fixes a memory defect by broadly weakening instruction discipline should fail even if its aggregate score rises.

Maps to: `agent-improvement`, `runtime/fan-out-fan-in`, `runtime/gauges-observability`, `runtime/state-jsonl-checkpointing`.

### 2. Separate mutation generation from candidate survival

Two reference implementations combine well:

- PromptAgent generates textual gradients from failing examples, proposes multiple mutations, and explores them with UCT/MCTS ([textual-gradient model](https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/world_model/gradient_descent.py), [MCTS](https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/search_algo/mcts.py)).
- EvoSkill evolves complete agent programs, retains a top-three frontier, stores candidates as Git branches, and keeps validation examples out of proposer context ([loop runner](https://github.com/sentient-agi/EvoSkill/blob/main/src/loop/runner.py), [architecture](https://github.com/sentient-agi/EvoSkill/blob/main/docs/architecture.md)).

Use textual gradients to propose atomic, single-locus diffs. Retain candidates on a Pareto frontier over behavior-family scores, clean utility, cost, and executor transfer—not a scalar average. Permit recombination only after patch ablations establish which clause caused which trajectory delta.

Maps to: `agent-improvement`, `runtime/dedup-novelty`, `runtime/budget-cost`, `runtime/state-jsonl-checkpointing`.

### 3. Make promotion executor-independent and verifier-sealed

Harbor supplies the missing reference envelope: one agent interface, adapters for Codex, Claude Code, OpenHands, SWE-agent, OpenCode and others, plus a separate verifier environment receiving only declared artifacts ([BaseAgent](https://github.com/harbor-framework/harbor/blob/main/src/harbor/agents/base.py), [installed adapters](https://github.com/harbor-framework/harbor/tree/main/src/harbor/agents/installed), [trial/verifier implementation](https://github.com/harbor-framework/harbor/blob/main/src/harbor/trial/trial.py)).

Promotion evidence should be invalidated whenever the agent package, executor adapter, model family, tool schema, verifier, or benchmark version changes. The final artifact should be a behavioral transfer certificate containing package lineage, intended delta, clause-to-scenario coverage, causal-blame results, executor matrix, family-level regressions, verifier hash, and rollback parent.

This is the moat: `agent-improvement` becomes the mode that produces causal, portable behavioral warranties for versioned agent programs. Manual prompt tweaking produces text plus anecdotes. The other deep modes research, review, deliberate, improve general artifacts, or align contracts; none owns the complete intervention → mutation → isolated verification → cross-executor promotion chain.

```json
{
  "new_repos": [
    {
      "name": "harbor-framework/harbor",
      "url": "https://github.com/harbor-framework/harbor",
      "stars": "~3.2k",
      "what": "Active agent-evaluation framework; v0.18.0 released 2026-07-07, with many executor adapters and isolated verifier environments.",
      "lesson": "Normalize trials across executors and verify candidates in a separately provisioned environment receiving only explicit artifacts.",
      "maps_to": [
        "agent-improvement",
        "runtime/fan-out-fan-in",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "name": "sentient-agi/EvoSkill",
      "url": "https://github.com/sentient-agi/EvoSkill",
      "stars": "~1k",
      "what": "Agent-program evolution implementation; v1.3.0 released 2026-06-16, supporting Codex, OpenCode, OpenHands, Goose, Claude Code, and Harbor.",
      "lesson": "Evolve prompts and skills as versioned packages, retain a small candidate frontier, and hide validation examples from the proposer.",
      "maps_to": [
        "agent-improvement",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "maitrix-org/PromptAgent",
      "url": "https://github.com/maitrix-org/PromptAgent",
      "stars": "~350",
      "what": "ICLR 2024 reference implementation combining textual-gradient prompt mutation with MCTS; older but algorithmically concrete.",
      "lesson": "Use failure-derived textual gradients as mutation proposals and tree search for exploration, while replacing scalar reward with behavior-family vectors.",
      "maps_to": [
        "agent-improvement",
        "runtime/budget-cost",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "agiresearch/ASB",
      "url": "https://github.com/agiresearch/ASB",
      "stars": "~270",
      "what": "ICLR 2025 agent-security benchmark covering direct input, observation, planning-prompt, and memory perturbations across multiple agents and scenarios.",
      "lesson": "Convert its attack-locus matrix into known-defect injections and measure repair success separately from retained clean-task utility.",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "normster/SystemCheck",
      "url": "https://github.com/normster/SystemCheck",
      "stars": "~11",
      "what": "Small 2025 system-prompt robustness implementation with utility suites, adversarial stress tests, bootstrap intervals, and 2026 evaluation additions.",
      "lesson": "Treat instruction-pressure robustness and ordinary capability retention as matched suites with uncertainty intervals rather than one mean score.",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Known-defect injection at a declared prompt, tool, routing, memory, or executor locus makes causal-blame accuracy measurable instead of inferred from aggregate improvement.",
      "evidence": "https://github.com/agiresearch/ASB/tree/main/config",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "The useful optimizer is nested: reflective failure analysis proposes atomic diffs, while frontier search preserves behaviorally distinct candidates until ablation establishes causality.",
      "evidence": "https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/search_algo/mcts.py and https://github.com/sentient-agi/EvoSkill/blob/main/src/loop/runner.py",
      "maps_to": [
        "agent-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Executor portability is an experimental axis: identical task artifacts and verifier semantics must be replayed through versioned executor adapters before promotion.",
      "evidence": "https://github.com/harbor-framework/harbor/tree/main/src/harbor/agents/installed",
      "maps_to": [
        "agent-improvement",
        "runtime/fan-out-fan-in",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Verifier isolation belongs in the behavioral contract; changing the verifier, adapter, tool schema, or model invalidates prior promotion evidence.",
      "evidence": "https://github.com/harbor-framework/harbor/blob/main/src/harbor/trial/trial.py",
      "maps_to": [
        "agent-improvement",
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Agent robustness should remain a family-level Pareto vector with confidence intervals because defensive gains can conceal clean-task capability loss.",
      "evidence": "https://github.com/normster/SystemCheck/blob/main/evals/EVALS.md",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability",
        "runtime/convergence"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a typed BehaviorExperiment layer with known-locus defect injection, clean and perturbed variants, receipt predicates, causal-blame scoring, and collateral-utility measurements.",
      "target": "agent-improvement + runtime/gauges-observability",
      "rationale": "It distinguishes a genuine localized repair from an accidental aggregate-score improvement and directly closes the open causal blame-assignment thread.",
      "uniqueness": "This turns agent-improvement into a controlled behavioral laboratory; manual editing and the other modes do not connect known interventions to attributable agent-definition repairs.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/agiresearch/ASB"
    },
    {
      "rec": "Implement failure-clustered textual-gradient proposals as single-locus agent-package diffs, then retain a top-k Pareto frontier with patch ablations before allowing recombination.",
      "target": "agent-improvement + runtime/dedup-novelty",
      "rationale": "It adds useful reflective and evolutionary search without losing attribution to broad multi-clause mutations or collapsing tradeoffs into one scalar.",
      "uniqueness": "The mode evolves versioned agent programs while preserving clause-level causal lineage, rather than producing another optimized prompt string.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/maitrix-org/PromptAgent and https://github.com/sentient-agi/EvoSkill"
    },
    {
      "rec": "Require a sealed promotion lane that replays candidates through at least one non-discovery executor family, uses an isolated verifier, and emits a hash-bound behavioral transfer certificate with a rollback parent.",
      "target": "agent-improvement + runtime/state-jsonl-checkpointing",
      "rationale": "Executor-specific prompt wins and verifier leakage otherwise masquerade as durable agent improvements.",
      "uniqueness": "The resulting artifact is a portable behavioral warranty, which is stronger and more operationally valuable than vibes-based prompt approval or a generic improvement report.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/harbor-framework/harbor"
    }
  ],
  "contradictions": [
    {
      "claim": "Scalar validation improvement is sufficient evidence that an agent-package mutation is better.",
      "counter": "Broad mutations can trade away clean utility, improve only one executor, or repair the wrong locus; promotion needs family vectors, ablation, and transfer evidence.",
      "evidence": "https://github.com/sentient-agi/EvoSkill/blob/main/docs/architecture.md and https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/world_model/world_model.py"
    },
    {
      "claim": "ASB's perturbation results can be reused directly as regression-grade agent-improvement evidence.",
      "counter": "Its locus taxonomy is valuable, but parts of the runner use substring success checks and an LLM refusal judge; promotion requires deterministic receipts and an isolated verifier.",
      "evidence": "https://github.com/agiresearch/ASB/blob/main/main_attacker.py"
    }
  ],
  "next_angles": [
    "Design the clause-to-scenario compiler that turns inherited AGENTS.md authority trees into locus-tagged clean, conflict-pair, shadowing, and hostile-override experiments.",
    "Define behavioral semantic versioning from intended family deltas and derive patch, minor, and major promotion matrices across executors.",
    "Study sequential experimental designs for minimizing the executor-by-seed-by-perturbation matrix while preserving causal-blame and transfer confidence.",
    "Specify a contamination ledger for visible failures, hidden validation, sealed rotating canaries, evaluator revisions, and benchmark retirement."
  ],
  "notes": "The strongest missing reference implementation is an end-to-end system combining typed agent-definition mutations, known-locus fault injection, patch ablation, sealed canaries, and cross-executor promotion. EvoSkill covers package evolution, Harbor covers portable isolated execution, PromptAgent covers reflective search, and ASB/SystemCheck cover perturbation families; the mode's distinctive opportunity is integrating them into one causal promotion protocol."
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
session id: 019f6546-2a14-7ca1-b766-99fcf0c18905
--------
user
You are iteration 28/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: agent-improvement
MODE IDENTITY (what it does today): deep-improvement variant: benchmark-anchored improvement of AGENT definitions/prompts/loops via behavior benchmarks + discipline stress tests + guarded promotion.
GENERIC ALTERNATIVE it must out-value: manual prompt tweaking / vibes-based agent editing

THIS ITERATION'S ANGLE (A3-mech): agent-improvement :: mechanisms & reference impls
DIRECTIVE: Concrete reference impls: agent behavior benchmarking, discipline/stress-test design, prompt/agent optimization algorithms (reflective + evolutionary), regression gating for agent definitions, transfer across executors. Real repos + code. Actionable designs for agent-improvement.

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

ALWAYS answer BOTH: (1) concrete improvements to make agent-improvement more effective; (2) the UNIQUE-VALUE / moat thesis — what agent-improvement can do that manual prompt tweaking / vibes-based agent editing and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (111) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign, theupdateframework/python-tuf, aquasecurity/trivy, Yelp/detect-secrets, github/codeql, CycloneDX/specification, slsa-framework/slsa-verifier, alan-turing-institute/AssurancePlatform, IBM/prompt-declaration-language, EvoAgentX/EvoAgentX, aiwaves-cn/agents, YaoZ720/SwarmAgenticCode, taowangcheng/SePO, Junjie-Ye/CCTU, CAR-bench/car-bench, claw-eval/claw-eval, agentevals-dev/agentevals
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment | agent-improvement
New insights so far: 119; recommendations: 78.
Open threads flagged: Build a benchmark for causal blame assignment: inject known defects into roles, tool descriptions, routing, memory, and inference settings, then measure whether the optimizer edits the correct locus. | Study adaptive benchmark overfitting in long-running agent-definition optimization and design sealed canary rotation, contamination accounting, and evaluator-version invalidation. | Compare conditional agent packages against universal prompts across model upgrades, tool-version changes, stochastic seeds, and degraded-environment episodes. | Define behavioral semantic versioning for agent definitions: classify a candidate as patch, minor, or major from its intended behavior delta and derive the required benchmark and approval depth. | Develop a clause-to-scenario compiler for inherited AGENTS.md trees, including authority shadowing, immutable clauses, and generated conflict-pair tests. | Design patch-level causal localization: ablate individual agent-definition edits and use family-specific trajectory deltas to identify which clause caused each improvement or regression.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "agent-improvement"): agent-improvement, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
This is read-only research, so the spec-folder write gate does not apply. I’m routing it through the iteration/deep-loop research contract first, then I’ll verify a small set of genuinely new implementations and extract file-level mechanisms—not add another repo catalogue.
exec
/bin/zsh -lc 'python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "iteration 28 agent-improvement mechanisms reference implementations benchmarking stress tests prompt optimization regression gating executor transfer deep research" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 3551ms:
2026-07-15 12:15:41.095 xcodebuild[14954:207904652]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 12:15:41.378 xcodebuild[14954:207904636] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-UBkmPPGF' (errno=Operation not permitted)
2026-07-15 12:15:41.933 xcodebuild[16045:207906341]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 12:15:42.108 xcodebuild[16045:207906317] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.12,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend [Candidate-3 deep routing: system-deep-loop research MED]",
    "source": "native",
    "score": 0.713338,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "system-deep-loop",
      "liveScore": 0.713338,
      "shadowScore": 0.654844,
      "delta": -0.058494,
      "dominantShadowLane": "explicit_author"
    },
    "mode": "research",
    "workflowMode": "research",
    "clarifying_question": "Should this route to research or review mode, and what output do you expect: review-report.md, research.md, or council-report.md?"
  },
  {
    "skill": "sk-prompt",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.16,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.44885,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "sk-prompt",
      "liveScore": 0.44885,
      "shadowScore": 0.415605,
      "delta": -0.033245,
      "dominantShadowLane": "explicit_author"
    }
  },
  {
    "skill": "sk-code",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.16,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.443625,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "sk-code",
      "liveScore": 0.443625,
      "shadowScore": 0.421094,
      "delta": -0.022531,
      "dominantShadowLane": "explicit_author"
    }
  }
]

codex
SKILL ROUTING: `system-deep-loop` research (0.95) is primary; `sk-prompt` (0.82) covers optimization mechanics, and `sk-code` (0.82) covers reference-implementation inspection. The hook failed, so I used the mandated local advisor fallback; its routing succeeded despite sandbox cache warnings. I’m loading those contracts before searching.
exec
/bin/zsh -lc 'wc -l .opencode/skills/system-deep-loop/SKILL.md .opencode/skills/sk-prompt/SKILL.md .opencode/skills/sk-code/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     154 .opencode/skills/system-deep-loop/SKILL.md
     136 .opencode/skills/sk-prompt/SKILL.md
     181 .opencode/skills/sk-code/SKILL.md
     471 total

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/system-deep-loop/SKILL.md && sed -n '1,200p' .opencode/skills/sk-prompt/SKILL.md && sed -n '1,240p' .opencode/skills/sk-code/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
---
name: sk-prompt
description: "Prompt engineering parent hub: routes to prompt-improve (7-framework, DEPTH-thinking, CLEAR-scored prompt enhancement) and prompt-models (read-only per-model prompt-craft profiles for small-model dispatch) through mode-registry.json; holds no packet-local logic."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: sk-prompt, prompt-engineering, mode-registry, hub-router, workflowmode, packetkind, prompt-improve, prompt-models, DEPTH, CLEAR-scoring, framework-selection, small-model-dispatch -->

# Prompt Engineering Hub (sk-prompt)

One advisor identity, two workflow packets. `sk-prompt` is the parent hub for prompt engineering: transforming requests into structured, scored prompts, and dispatching small-model prompt craft. It holds NO per-packet logic: it routes by `workflowMode` through `mode-registry.json`, and each packet keeps its own contract in its nested folder.

---

## 1. WHEN TO USE

Use this skill for prompt engineering and small-model prompt-craft lookup. The hub classifies the request and loads the matching nested packet.

| Mode | Use it for | Packet | Command |
|------|------------|--------|---------|
| **prompt-improve** | Transform a request into a structured, scored AI prompt via 7 frameworks + DEPTH thinking + CLEAR scoring | `prompt-improve/` | `/prompt-improve` |
| **prompt-models** | Look up the recommended framework/scaffold/gotchas for a specific small model (DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro, GLM-5.2) before dispatching via `cli-opencode` | `prompt-models/` | none — advisor + cross-skill reference only |

### When NOT to Use
- Code implementation, tests, or debugging — use `sk-code`.
- Documentation/skill authoring — use `sk-doc`.
- Executor mechanics (binary flags, invocation wrappers) for any CLI — use `cli-opencode`/`cli-claude-code`; `prompt-models` owns per-model prompt-craft only, never executor plumbing.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any prompt-engineering query to the single identity `sk-prompt`; the hub then picks the packet.

### The discriminator
- **`workflowMode`** — the public packet key (`prompt-improve` or `prompt-models`).
- **`packetKind`** — `workflow` for both sk-prompt packets. `prompt-models` is `workflow`, not `surface`, because its real consuming workflow (`cli-opencode`'s pre-dispatch step) lives outside this hub — the surface-packet contract requires the consumer to be a same-hub primary workflow.
- **`backendKind`** — `prompt-engine` for `prompt-improve`'s DEPTH/CLEAR pipeline, `profile-lookup` for `prompt-models`' read-only reference.

### Routing rule
```
SKILL_ROOT = path containing this SKILL.md
REGISTRY = SKILL_ROOT / "mode-registry.json"
HUB_ROUTER = SKILL_ROOT / "hub-router.json"

def _guard_in_skill(relative_path):
  resolved = (SKILL_ROOT / relative_path).resolve()
  resolved.relative_to(SKILL_ROOT)
  if resolved.suffix.lower() not in {".md", ".json"}:
    raise ValueError("only skill-local markdown/json router resources are routable")
  return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, seen):
  guarded = _guard_in_skill(relative_path)
  if guarded not in seen and (SKILL_ROOT / guarded).exists():
    load(guarded)
    seen.add(guarded)
    return True
  return False

seen = set()
if not REGISTRY.exists() or not HUB_ROUTER.exists():
  return defer("router metadata missing; inspect sk-prompt/mode-registry.json and sk-prompt/hub-router.json")

read mode-registry.json and hub-router.json
classify the request to one or more workflowMode values using hub-router.json
  (dominant prompt-engineering intent; a bare small-model name leans prompt-models)

if confidence is low, intent is contradictory, or routerPolicy.defaultMode is null and no mode wins:
  load_if_available("prompt-improve/SKILL.md", seen)
  return UNKNOWN_FALLBACK with a checklist to confirm workflowMode, target prompt/model, and delivery format

for each resolved workflowMode:
  entry = the matching mode-registry.json modes[] item
  if entry is missing or entry.packetKind != "workflow":
    return defer("unknown sk-prompt workflowMode; extend mode-registry.json and create a packet first")
  if not load_if_available(f"{entry.packet}/SKILL.md", seen):
    return defer("registered packet SKILL.md is missing; repair the packet before routing")

return single or orderedBundle according to hub-router.json routerPolicy.outcomes
```
`routerPolicy.defaultMode` is `"prompt-improve"` — the higher-traffic, more general mode. `hub-router.json` carries the router signals, vocabulary classes, and default fallback resource. Outcomes are `single`, `orderedBundle`, or `defer` — there is no `surfaceBundle` (no surface axis).

Per-packet behavior is **not flattened**: each packet keeps its own authoring contract, references, assets, and validation.

---

## 3. HOW IT WORKS

### Layout
```
sk-prompt/
  SKILL.md               # this routing hub (no per-packet logic)
  mode-registry.json     # 2 workflow modes, zero extensions
  hub-router.json        # base 3 outcomes, defaultMode: prompt-improve
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  changelog/  manual_testing_playbook/  benchmark/
  prompt-improve/         # workflow packet — 7-framework/DEPTH/CLEAR prompt engine
  prompt-models/          # workflow packet — read-only small-model prompt-craft profiles
```

Each packet is self-contained (its own `SKILL.md`, `README.md`, `changelog/`, and its `references/`/`assets/`) and carries **no** `graph-metadata.json`, so the advisor discovers exactly one `sk-prompt` identity.

### Zero extensions
This hub declares no named extensions (no `surface-axis`, `runtime-loop`, `advisor-projection`, `transform-verbs`, `transport-axis`) — the pure two-tier core, mirroring `sk-doc`'s own shape. `prompt-models` keeps a read-only `toolSurface` (Read/Grep/Glob only, `mutatesWorkspace: false`) as a plain `workflow` mode, not via a surface-axis declaration.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a packet through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep authoring contracts in the packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one identity.
- **ALWAYS** keep changelogs as real files at the hub and in each packet — never symlinked.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` inside `prompt-improve/` or `prompt-models/`.
- **NEVER** put per-packet authoring logic in the hub.
- **NEVER** duplicate executor mechanics (binary flags, invocation wrappers, budgets) inside `prompt-models/` — those stay in `cli-opencode`.

### ⚠️ ESCALATE IF
- A new prompt-engineering workflow is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- `prompt-models`' routing accuracy regresses under `routingClass: "metadata"` — see the phase 124/007 Lane-C benchmark before adding a lexical carve-out.

---

## 5. REFERENCES

- Registry: `mode-registry.json` (2 packets; `packetKind: workflow`).
- Hub router: `hub-router.json` (signals + vocabulary classes).
- Advisor descriptor: `description.json`; skill-graph identity: `graph-metadata.json`.
- Packets: `prompt-improve/`, `prompt-models/`.
- Parent-skill pattern: `sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`.
---
name: sk-code
description: "Unified two-axis code skill: routes to two WORKFLOW modes (quality, code-review) and bundles two read-only SURFACE evidence packets (code-webflow, code-opencode) — each surface carrying the implement/debug/verify workflow doctrine plus its stack knowledge — over shared surface-detection; holds no per-mode logic; dispatches by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 4.1.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: sk-code, code, surface-aware, two-axis, webflow, opencode, animation, motion.dev, frontend, browser, typescript, python, shell, json, jsonc, code-quality, code-review, quality, review, verification, debug, implement, workflow-doctrine, mode-registry, workflowmode, packetkind, backendkind, surface-router, evidence-base, surface-packet -->

# Code Family Hub (sk-code)

One skill, two axes, one shared surface-detection router, and one advisor identity. The **workflow axis** is two code modes that act (quality, code-review); the **surface axis** is two read-only evidence packets the hub bundles alongside a workflow mode (code-webflow, code-opencode). Each surface carries the shared **implement → debug → verify** workflow doctrine (`shared/references/workflow_*.md`, symlinked in) plus its own stack knowledge; code-webflow also carries the folded-in Motion.dev animation overlay. This hub holds NO per-mode logic: it routes by `workflowMode` through `mode-registry.json`, and each mode or surface keeps its own contract in its packet.

---

## 1. WHEN TO USE

Use this skill for code-family workflows. Invoke it as `sk-code` with an optional mode hint such as `quality: <request>`; the hub classifies the request, resolves a mode key, and loads the matching nested packet.

**Workflow axis** (modes that act — one is chosen as primary):

| Mode | Use it for | Packet |
|------|------------|--------|
| **quality** | Quality gate; P0/P1/P2 author checks; comment hygiene; surface checklists. | `sk-code/code-quality/` |
| **code-review** | Findings-first review; security/correctness baseline; checklists; output contract; PR-state gates. | `sk-code/code-review/` |

**Surface axis** (read-only evidence the hub bundles alongside the primary mode — never a primary, advisor-invisible):

| Surface | Carries | Packet |
|---------|---------|--------|
| **code-webflow** | Frontend evidence: CSS/HTML/JS standards, implementation and performance patterns, CDN deployment, browser debug/verify — plus the Motion.dev animation overlay. Bundles the implement → debug → verify workflow doctrine (read-only evidence) for the Webflow surface; the acting agent applies it. | `sk-code/code-webflow/` |
| **code-opencode** | System-code evidence: TypeScript/Python/shell/config standards, hooks, alignment verification, authoring checklists. Bundles the implement → debug → verify workflow doctrine (read-only evidence) for the OpenCode surface; the acting agent applies it. | `sk-code/code-opencode/` |

The **implement → debug → verify** phases are not standalone modes. Their surface-agnostic doctrine lives once in `shared/references/workflow_implement.md`, `workflow_debug.md`, and `workflow_verify.md`, and is symlinked into each surface so the active surface carries the full workflow. A request to implement, debug, or verify code detects its surface and loads that surface's bundled doctrine; the acting agent applies it.

### When NOT to Use
- Documentation-only changes with no code-work contract - use `sk-doc`.
- Git workflow, branch, commit, PR, merge, or release work - use `sk-git`.
- Pure browser inspection or external MCP transport work - use the relevant MCP skill.
- Design judgment, visual direction, motion taste, or UI audit - use `sk-design` first.
- Backend support primitives in `shared/` - they are consumed by the modes, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any code query to the single identity `sk-code`; the hub then picks the mode. This hub is a simple intent-to-packet router, not a root `references/<key>/` resource router: root `references/` and `assets/` directories are intentionally absent here, and resource slicing lives inside the nested packets plus `shared/references/smart_routing.md`.

### The discriminator
- **`workflowMode`** - the public mode/packet key: `quality`, `code-review` (workflow) or `code-webflow`, `code-opencode` (surface).
- **`packetKind`** - the axis: `workflow` (a mode that acts) or `surface` (read-only evidence bundled alongside a mode).
- **`backendKind`** - which backend runs the packet: `surface-router` or `review-cache` for workflow modes, `evidence-base` for surface packets.

Surface packets are advisor-invisible (`routingClass: metadata`, read-only `toolSurface`): the advisor still routes the single identity `sk-code`, and the hub bundles zero-or-more surfaces as evidence via `routerPolicy.outcomes.surfaceBundle` (workflow mode ordered first, surfaces after). "review my webflow animation for jank" → `[code-review, code-webflow]`.

### Routing rule
```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is quality, code-review, Webflow, or OpenCode work",
    "Confirm the target files or runtime surface",
    "Confirm the expected action: implement, debug, verify, quality gate, or review",
    "Confirm the verification command set before completion",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.name != "SKILL.md" and resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown skill resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path: str, loaded: list[str], seen: set[str]) -> None:
    guarded = _guard_in_skill(relative_path)
    path = SKILL_ROOT / guarded
    if path.exists() and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def route(task):
    loaded, seen = [], set()
    registry = read_json(SKILL_ROOT / "mode-registry.json")
    workflow_mode = explicit_mode_hint(task) or classify_workflow_mode(task)

    if not workflow_mode:
        load_if_available("shared/README.md", loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    entry = find_registry_entry(registry, workflowMode=workflow_mode)
    if not entry:
        load_if_available("shared/README.md", loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK", "unknown_mode": workflow_mode, "resources": loaded}

    packet_skill = f"{entry['packet']}/SKILL.md"
    load_if_available(packet_skill, loaded, seen)

    for surface_mode in surface_bundle_from_hub_router(task):
        surface_entry = find_registry_entry(registry, workflowMode=surface_mode)
        if surface_entry:
            load_if_available(f"{surface_entry['packet']}/SKILL.md", loaded, seen)

    if not loaded:
        load_if_available("shared/README.md", loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK", "notice": "matched registry but no packet SKILL.md was available", "resources": loaded}

    return {"workflowMode": workflow_mode, "backendKind": entry["backendKind"], "resources": loaded}
```

When no workflow mode dominates (a bare implement/debug/verify request), the router defers to a pure surface bundle: it detects the surface, loads that surface's evidence and workflow doctrine, and the agent acts. `routerPolicy.defaultMode` is `null` — the hub does not force a stale default; an unclear code intent asks for disambiguation.

Surface detection (`WEBFLOW`, `OPENCODE`, `MOTION_DEV`, with `OPENCODE` over `WEBFLOW` precedence) lives once in the hub's `shared/` layer and is consumed by every mode and surface. Modes own workflow contracts, not surface identity.

Per-mode behavior is **not flattened**: each packet keeps its own code-work contract, standards, evidence rules, and tool-permission guards.

---

## 3. HOW IT WORKS

### Layout
```
sk-code/
  SKILL.md               # this routing hub (no per-mode code logic)
  mode-registry.json     # the two-axis discriminator + advisorRouting (single source of truth)
  hub-router.json        # lexical routing signals + surfaceBundle policy for hub-local choice
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  code-quality/          # quality mode packet     (workflow)
  code-review/           # review mode packet      (workflow)
  code-webflow/          # webflow surface packet  (read-only evidence; carries the workflow doctrine + Motion.dev animation overlay)
  code-opencode/         # opencode surface packet (read-only evidence; carries the workflow doctrine)
  shared/                # shared surface-detection router, cross-mode helpers, and the implement/debug/verify workflow doctrine (references/workflow_*.md)
```

Each mode or surface packet is self-contained and carries no per-packet `graph-metadata.json`; only this hub carries one, so the advisor discovers exactly one code skill identity. The implement/debug/verify workflow doctrine is a single shared source under `shared/references/`; each surface symlinks it in rather than duplicating it.

### Backend
The `surface-router` backend is the shared surface-detection router under `shared/`. It centralizes WEBFLOW, OPENCODE, and MOTION_DEV detection and precedence, and it carries the shared implement → debug → verify workflow doctrine that each surface consumes. The `review-cache` backend supports the code-review mode's non-mutating review output cache. The `evidence-base` backend serves the surface packets: read-only domain evidence (`code-webflow/`, `code-opencode/`) the hub bundles alongside the primary mode — the packet mutates nothing and never carries process; the acting agent applies the doctrine it bundles. Shared backend material provides surface identity, the workflow doctrine, and cross-mode helpers; it must never gain per-mode workflow contracts.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep mode contracts in the mode packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity.
- **ALWAYS** give every mode an `advisorRouting` block with `routingClass: "metadata"` and the correct `packetSkillName`.
- **ALWAYS** keep the implement/debug/verify workflow doctrine as one shared source under `shared/references/`, symlinked into each surface — never fork per-surface copies.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` inside a mode packet or `shared/`.
- **NEVER** put per-mode quality, review, or surface workflow logic in the hub.
- **NEVER** hardcode a router mapping outside `mode-registry.json`.
- **NEVER** reintroduce implement, debug, or verify as standalone mode packets; they are surface-owned doctrine.

### ⚠️ ESCALATE IF
- A new code mode is needed - extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- Surface identity and workflow ownership conflict in a way the shared router cannot classify.

---

## 5. REFERENCES

- Workflow mode packets: `code-quality/SKILL.md`, `code-review/SKILL.md`.
- Surface evidence packets: `code-webflow/SKILL.md`, `code-opencode/SKILL.md`.
- Shared workflow doctrine: `shared/references/workflow_implement.md`, `shared/references/workflow_debug.md`, `shared/references/workflow_verify.md` (symlinked into each surface).
- Registry: `mode-registry.json` (two-axis: `packetKind` discriminates workflow vs surface).
- Hub router signals + surface bundling: `hub-router.json`.
- Parent-skill pattern: `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`.
- Sibling example: `.opencode/skills/sk-design/`.

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skills/system-deep-loop/mode-registry.json && wc -l .opencode/skills/system-deep-loop/deep-improvement/SKILL.md && sed -n '1,260p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
     328 .opencode/skills/system-deep-loop/deep-improvement/SKILL.md
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

exec
/bin/zsh -lc "sed -n '261,380p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md && wc -l .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

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
     115 .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
     102 .opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
     126 .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
      47 .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
     323 .opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
     390 .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md
     229 .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md
      57 .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md
     103 .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md
     166 .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md
    1658 total

codex
The local mode already has candidate scoring, held-out sets, stress A/B, integration scanning, and promotion gates. The likely gap is not “more evals”; it is a typed experiment layer that can (a) mutate one behavioral locus at a time, (b) replay the same task across executor adapters, and (c) reject gains that disappear under prompt perturbation or environment degradation. I’m testing implementations against that gap now.
web search: 
web search: site:github.com agent benchmark executor adapters containerized tasks Harbor terminal benchmark GitHub ...
web search: 
web search: Microsoft PromptBench GitHub prompt robustness benchmark repository ...
web search: 
web search: https://github.com/harbor-framework/harbor
web search: 
web search: 
web search: 
web search: site:github.com prompt perturbation robustness agent benchmark system prompt 2025 repository ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'AgentImportPath'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'def iterate'
web search: 
web search: 
web search: 
web search: 'attack_types'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'failed'
codex
Two implementations materially change the design space. Harbor now separates the agent environment from the verifier environment and normalizes executor capability metadata; EvoSkill treats an agent as a versioned program (prompt plus skills) and maintains a small scored frontier. That suggests the moat should be “controlled behavioral program evolution with causal and transfer evidence,” not “a safer prompt rewrite loop.”
web search: 
web search: https://api.github.com/repos/harbor-framework/harbor
web search: 
web search: https://github.com/harbor-framework/harbor/tree/main/src/harbor/agents/installed
web search: 
web search: 'select_parent'
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md && sed -n '1,160p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md && sed -n '1,120p' .opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md && sed -n '1,120p' .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md && sed -n '1,180p' .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md && sed -n '1,280p' .opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
---
title: Integration Scanning
description: How the integration scanner discovers all surfaces an agent touches across the repo.
trigger_phrases:
  - "integration scanning"
  - "agent integration surfaces"
  - "mirror drift detection"
  - "integration scan report"
importance_tier: normal
contextType: implementation
version: 1.17.0.23
---

# Integration Scanning

How `scan-integration.cjs` discovers the full integration surface of any agent across the repository.

---

## 1. OVERVIEW

### Purpose

Provides a complete inventory of every file and surface that references or depends on a given agent, so the evaluator can measure integration consistency rather than just prompt-file quality.

### When to Use

Use this reference when:
- Setting up a new agent as an evaluation target
- Understanding why the integration dimension scored low
- Debugging mirror drift or missing command references
- Onboarding a new agent into the deep-improvement loop

### Core Principle

An agent is not just its `.md` file. It exists across canonical, mirrors, commands, YAML workflows, skills, and global docs. Improving one surface while others drift is not real improvement.

---

## 2. SCANNED SURFACES

| Surface | Location Pattern | What It Checks |
| --- | --- | --- |
| Canonical | `.opencode/agents/{name}.md` | Exists, frontmatter parsed |
| Claude mirror | `.claude/agents/{name}.md` | Exists, sync status vs canonical |
| Commands | `.opencode/commands/**/*.md` | Files containing `@{name}` dispatch |
| YAML workflows | `.opencode/commands/**/assets/*.yaml` | Files referencing `@{name}` |
| Skills | `.opencode/skills/*/SKILL.md` | Files referencing the agent |
| Global docs | `CLAUDE.md`, `.claude/CLAUDE.md` | Agent name references |
| Skill advisor | `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Routing entries |

---

## 3. MIRROR SYNC DETECTION

Mirror sync is determined by signal matching, not byte-identical comparison:

1. Strip frontmatter from both canonical and mirror
2. Extract 3 key signal strings from the canonical body (first 3 emphasized lines over 20 characters)
3. Count how many signals appear in the mirror body
4. 2/3 or 3/3 matches = `aligned`, 0/3 or 1/3 = `diverged`, file missing = `missing`

---

## 4. USAGE

```bash
node scripts/agent-improvement/scan-integration.cjs --agent={agent-name} [--repo-root=.] [--output=path.json]
```

The output JSON includes a `summary` with `totalSurfaces`, `existingCount`, `missingCount`, `mirrorSyncStatus`, `commandCount`, and `skillCount`.

### Example Output

```json
{
  "status": "complete",
  "agent": "{agent-name}",
  "surfaces": {
    "canonical": { "path": ".opencode/agents/{agent-name}.md", "exists": true },
    "mirrors": [
      { "path": ".claude/agents/{agent-name}.md", "syncStatus": "aligned" }
    ],
    "commands": [{ "path": ".opencode/commands/speckit/{agent-name}.md", "references": ["@{agent-name}"] }],
    "skills": [{ "path": ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md", "referenceCount": 2 }]
  },
  "summary": {
    "totalSurfaces": 27,
    "existingCount": 27,
    "mirrorSyncStatus": "all-aligned",
    "commandCount": 5,
    "skillCount": 3
  }
}
```

---

## 5. RELATED RESOURCES

- `../model_benchmark/evaluator_contract.md` for the 5-dimension scoring rubric
- `../../scripts/agent-improvement/scan-integration.cjs` for the implementation
- `../../scripts/agent-improvement/check-mirror-drift.cjs` for the original mirror-only scanner
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

hook: PreCompact
hook: PreCompact
hook: PreCompact Completed
hook: PreCompact Failed
context compacted
codex
The current mode has sound promotion discipline, but its behavioral evidence is still thin: coherence relies partly on section/keyword checks, while stress testing centers on a same-task generic-versus-disciplined A/B ([score dimensions](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/references/agent-improvement/score_dimensions.md), [stress protocol](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/references/agent-improvement/stress_test_protocol.md)). The next step is not more judging—it is controlled intervention, causal attribution, and executor-transfer evidence.

### 1. Turn benchmarks into locus-aware experiments

Adopt ASB’s perturbation taxonomy, but repurpose it from security attacks to agent-definition diagnosis. ASB independently perturbs user input, tool observations, planning prompts, and memory, while measuring attack success and original-task success separately ([config matrix](https://github.com/agiresearch/ASB/tree/main/config), [runner](https://github.com/agiresearch/ASB/blob/main/main_attacker.py)).

Each benchmark should declare:

```ts
interface BehaviorExperiment {
  scenarioId: string;
  family: string;
  injectedLocus:
    | "agent_clause" | "tool_description" | "observation"
    | "router" | "memory" | "executor";
  expectedReceipts: ReceiptPredicate[];
  forbiddenReceipts: ReceiptPredicate[];
  cleanUtilityOracle: VerifierRef;
  perturbations: PerturbationSpec[];
}
```

Run `baseline × candidate × clean/injected × executor × seed`. Record repair lift, clean-task retention, causal-blame accuracy, and cross-executor transfer. A candidate that fixes a memory defect by broadly weakening instruction discipline should fail even if its aggregate score rises.

Maps to: `agent-improvement`, `runtime/fan-out-fan-in`, `runtime/gauges-observability`, `runtime/state-jsonl-checkpointing`.

### 2. Separate mutation generation from candidate survival

Two reference implementations combine well:

- PromptAgent generates textual gradients from failing examples, proposes multiple mutations, and explores them with UCT/MCTS ([textual-gradient model](https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/world_model/gradient_descent.py), [MCTS](https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/search_algo/mcts.py)).
- EvoSkill evolves complete agent programs, retains a top-three frontier, stores candidates as Git branches, and keeps validation examples out of proposer context ([loop runner](https://github.com/sentient-agi/EvoSkill/blob/main/src/loop/runner.py), [architecture](https://github.com/sentient-agi/EvoSkill/blob/main/docs/architecture.md)).

Use textual gradients to propose atomic, single-locus diffs. Retain candidates on a Pareto frontier over behavior-family scores, clean utility, cost, and executor transfer—not a scalar average. Permit recombination only after patch ablations establish which clause caused which trajectory delta.

Maps to: `agent-improvement`, `runtime/dedup-novelty`, `runtime/budget-cost`, `runtime/state-jsonl-checkpointing`.

### 3. Make promotion executor-independent and verifier-sealed

Harbor supplies the missing reference envelope: one agent interface, adapters for Codex, Claude Code, OpenHands, SWE-agent, OpenCode and others, plus a separate verifier environment receiving only declared artifacts ([BaseAgent](https://github.com/harbor-framework/harbor/blob/main/src/harbor/agents/base.py), [installed adapters](https://github.com/harbor-framework/harbor/tree/main/src/harbor/agents/installed), [trial/verifier implementation](https://github.com/harbor-framework/harbor/blob/main/src/harbor/trial/trial.py)).

Promotion evidence should be invalidated whenever the agent package, executor adapter, model family, tool schema, verifier, or benchmark version changes. The final artifact should be a behavioral transfer certificate containing package lineage, intended delta, clause-to-scenario coverage, causal-blame results, executor matrix, family-level regressions, verifier hash, and rollback parent.

This is the moat: `agent-improvement` becomes the mode that produces causal, portable behavioral warranties for versioned agent programs. Manual prompt tweaking produces text plus anecdotes. The other deep modes research, review, deliberate, improve general artifacts, or align contracts; none owns the complete intervention → mutation → isolated verification → cross-executor promotion chain.

```json
{
  "new_repos": [
    {
      "name": "harbor-framework/harbor",
      "url": "https://github.com/harbor-framework/harbor",
      "stars": "~3.2k",
      "what": "Active agent-evaluation framework; v0.18.0 released 2026-07-07, with many executor adapters and isolated verifier environments.",
      "lesson": "Normalize trials across executors and verify candidates in a separately provisioned environment receiving only explicit artifacts.",
      "maps_to": [
        "agent-improvement",
        "runtime/fan-out-fan-in",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "name": "sentient-agi/EvoSkill",
      "url": "https://github.com/sentient-agi/EvoSkill",
      "stars": "~1k",
      "what": "Agent-program evolution implementation; v1.3.0 released 2026-06-16, supporting Codex, OpenCode, OpenHands, Goose, Claude Code, and Harbor.",
      "lesson": "Evolve prompts and skills as versioned packages, retain a small candidate frontier, and hide validation examples from the proposer.",
      "maps_to": [
        "agent-improvement",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "maitrix-org/PromptAgent",
      "url": "https://github.com/maitrix-org/PromptAgent",
      "stars": "~350",
      "what": "ICLR 2024 reference implementation combining textual-gradient prompt mutation with MCTS; older but algorithmically concrete.",
      "lesson": "Use failure-derived textual gradients as mutation proposals and tree search for exploration, while replacing scalar reward with behavior-family vectors.",
      "maps_to": [
        "agent-improvement",
        "runtime/budget-cost",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "agiresearch/ASB",
      "url": "https://github.com/agiresearch/ASB",
      "stars": "~270",
      "what": "ICLR 2025 agent-security benchmark covering direct input, observation, planning-prompt, and memory perturbations across multiple agents and scenarios.",
      "lesson": "Convert its attack-locus matrix into known-defect injections and measure repair success separately from retained clean-task utility.",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "normster/SystemCheck",
      "url": "https://github.com/normster/SystemCheck",
      "stars": "~11",
      "what": "Small 2025 system-prompt robustness implementation with utility suites, adversarial stress tests, bootstrap intervals, and 2026 evaluation additions.",
      "lesson": "Treat instruction-pressure robustness and ordinary capability retention as matched suites with uncertainty intervals rather than one mean score.",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Known-defect injection at a declared prompt, tool, routing, memory, or executor locus makes causal-blame accuracy measurable instead of inferred from aggregate improvement.",
      "evidence": "https://github.com/agiresearch/ASB/tree/main/config",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "The useful optimizer is nested: reflective failure analysis proposes atomic diffs, while frontier search preserves behaviorally distinct candidates until ablation establishes causality.",
      "evidence": "https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/search_algo/mcts.py and https://github.com/sentient-agi/EvoSkill/blob/main/src/loop/runner.py",
      "maps_to": [
        "agent-improvement",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Executor portability is an experimental axis: identical task artifacts and verifier semantics must be replayed through versioned executor adapters before promotion.",
      "evidence": "https://github.com/harbor-framework/harbor/tree/main/src/harbor/agents/installed",
      "maps_to": [
        "agent-improvement",
        "runtime/fan-out-fan-in",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Verifier isolation belongs in the behavioral contract; changing the verifier, adapter, tool schema, or model invalidates prior promotion evidence.",
      "evidence": "https://github.com/harbor-framework/harbor/blob/main/src/harbor/trial/trial.py",
      "maps_to": [
        "agent-improvement",
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Agent robustness should remain a family-level Pareto vector with confidence intervals because defensive gains can conceal clean-task capability loss.",
      "evidence": "https://github.com/normster/SystemCheck/blob/main/evals/EVALS.md",
      "maps_to": [
        "agent-improvement",
        "runtime/gauges-observability",
        "runtime/convergence"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a typed BehaviorExperiment layer with known-locus defect injection, clean and perturbed variants, receipt predicates, causal-blame scoring, and collateral-utility measurements.",
      "target": "agent-improvement + runtime/gauges-observability",
      "rationale": "It distinguishes a genuine localized repair from an accidental aggregate-score improvement and directly closes the open causal blame-assignment thread.",
      "uniqueness": "This turns agent-improvement into a controlled behavioral laboratory; manual editing and the other modes do not connect known interventions to attributable agent-definition repairs.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/agiresearch/ASB"
    },
    {
      "rec": "Implement failure-clustered textual-gradient proposals as single-locus agent-package diffs, then retain a top-k Pareto frontier with patch ablations before allowing recombination.",
      "target": "agent-improvement + runtime/dedup-novelty",
      "rationale": "It adds useful reflective and evolutionary search without losing attribution to broad multi-clause mutations or collapsing tradeoffs into one scalar.",
      "uniqueness": "The mode evolves versioned agent programs while preserving clause-level causal lineage, rather than producing another optimized prompt string.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/maitrix-org/PromptAgent and https://github.com/sentient-agi/EvoSkill"
    },
    {
      "rec": "Require a sealed promotion lane that replays candidates through at least one non-discovery executor family, uses an isolated verifier, and emits a hash-bound behavioral transfer certificate with a rollback parent.",
      "target": "agent-improvement + runtime/state-jsonl-checkpointing",
      "rationale": "Executor-specific prompt wins and verifier leakage otherwise masquerade as durable agent improvements.",
      "uniqueness": "The resulting artifact is a portable behavioral warranty, which is stronger and more operationally valuable than vibes-based prompt approval or a generic improvement report.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/harbor-framework/harbor"
    }
  ],
  "contradictions": [
    {
      "claim": "Scalar validation improvement is sufficient evidence that an agent-package mutation is better.",
      "counter": "Broad mutations can trade away clean utility, improve only one executor, or repair the wrong locus; promotion needs family vectors, ablation, and transfer evidence.",
      "evidence": "https://github.com/sentient-agi/EvoSkill/blob/main/docs/architecture.md and https://github.com/maitrix-org/PromptAgent/blob/main/src/prompt_optim_agent/world_model/world_model.py"
    },
    {
      "claim": "ASB's perturbation results can be reused directly as regression-grade agent-improvement evidence.",
      "counter": "Its locus taxonomy is valuable, but parts of the runner use substring success checks and an LLM refusal judge; promotion requires deterministic receipts and an isolated verifier.",
      "evidence": "https://github.com/agiresearch/ASB/blob/main/main_attacker.py"
    }
  ],
  "next_angles": [
    "Design the clause-to-scenario compiler that turns inherited AGENTS.md authority trees into locus-tagged clean, conflict-pair, shadowing, and hostile-override experiments.",
    "Define behavioral semantic versioning from intended family deltas and derive patch, minor, and major promotion matrices across executors.",
    "Study sequential experimental designs for minimizing the executor-by-seed-by-perturbation matrix while preserving causal-blame and transfer confidence.",
    "Specify a contamination ledger for visible failures, hidden validation, sealed rotating canaries, evaluator revisions, and benchmark retirement."
  ],
  "notes": "The strongest missing reference implementation is an end-to-end system combining typed agent-definition mutations, known-locus fault injection, patch ablation, sealed canaries, and cross-executor promotion. EvoSkill covers package evolution, Harbor covers portable isolated execution, PromptAgent covers reflective search, and ASB/SystemCheck cover perturbation families; the mode's distinctive opportunity is integrating them into one causal promotion protocol."
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
286,231
