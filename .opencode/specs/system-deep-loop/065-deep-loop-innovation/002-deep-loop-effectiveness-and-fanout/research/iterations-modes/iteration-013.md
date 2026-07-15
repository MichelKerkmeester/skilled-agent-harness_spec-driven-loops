<!-- iteration 13 | SOL xhigh | mode: deep-ai-council | angle: A3-mech deep-ai-council :: mechanisms & reference impls | 2026-07-15T09:05:34.666Z -->

Majority vote is the wrong abstraction for `deep-ai-council`. The mode needs a typed adjudication router because factual truth, plan preference, constitutional constraints, and value disagreement have different aggregation semantics.

The concrete design is:

1. Evidence gate.
2. Reliability-weighted categorical aggregation.
3. Blinded pairwise comparison for competing proposals.
4. Debate only for unresolved, consequential disputes with genuine information asymmetry.
5. Explicit plural output when disagreement is normative rather than epistemic.

### 1. Bayesian seat reliability

For factual claims, record observations as `(claim_id, task_family, seat_config, independence_cluster, label, abstain, evidence_refs)`. Maintain a hierarchical confusion matrix per seat and task family:

`p(true=k | labels) ∝ prior(k) × ∏ seat_confusion[seat, task_family, k, observed]`

Use hierarchical priors so new seats shrink toward provider-, role-, and global-level reliability rather than starting at zero. Model `abstain` explicitly; forcing every seat to choose manufactures evidence.

The major caveat is correlated seats. Dawid–Skene assumes conditionally independent errors, which is false when seats share model weights, prompts, retrieval, or provider alignment. A conservative first implementation should divide each independence cluster’s total log-likelihood contribution by its size; the stronger implementation adds a cluster random effect in [Pyro](https://github.com/pyro-ppl/pyro). Store posterior entropy, Brier score, calibration support, effective seat mass, and leave-one-seat-out verdict changes.

### 2. Blinded pairwise adjudication

For plans or architectures, compare candidates anonymously and in both A/B and B/A order. Feed `(winner, loser)` observations to [`choix.ep_pairwise`](https://choix.lum.li/en/latest/api.html), which returns a Gaussian approximation to the Bradley–Terry posterior mean and covariance. That gives a probability distribution over candidate strength rather than a brittle ranking.

`choix` also exposes I-LSR, Rank Centrality, MAP optimization, and log-likelihood functions, with a current 2025 release in the [repository](https://github.com/lucasmaystre/choix). It does not model ties, position covariates, or judge identity directly. Preserve ties as unresolved, measure order effects separately, and use a custom logistic layer if seat and position coefficients become necessary.

Escalate when the posterior interval overlaps, swap consistency fails, or the comparison graph is weakly connected. Pair selection should maximize expected reduction in top-choice entropy rather than exhaustively comparing every pair.

### 3. Debate as a selective diagnostic

Debate should not be the default fan-in. It earns its cost when:

- Competing proposals cite different evidence.
- The weak judge lacks information available to advocates.
- Independent seat clusters remain split.
- The decision is consequential enough to justify adversarial scrutiny.

The protocol should lock two advocates to opposing candidates, hide their identities and prior vote totals, permit one evidence-focused rebuttal, then give the judge an atomic claim graph rather than a transcript-only gestalt. The [`math_problems_debate`](https://github.com/ArjunPanickssery/math_problems_debate) implementation supplies useful operational patterns: protocol experiments under `experiments/init_exp.py`, deterministic seeded randomness, cached LLM calls, preflight cost simulation, and real-time JSONL cost totals.

Evidence limits the scope of debate’s advantage. One study found 84% judge accuracy for debate versus 74% for unreliable consultancy, while broader weak-judge experiments found debate consistently beat consultancy but produced mixed results against direct answering when information asymmetry was absent. Debate is therefore an information-recovery protocol, not a universal reasoning amplifier. [Debate study](https://arxiv.org/abs/2311.08702), [broader scalable-oversight study](https://arxiv.org/abs/2407.04622).

A newer selective-debate result independently supports this routing: confidence-likelihood mismatch plus semantic disagreement was used to trigger debate on demand, reducing token use by nearly 50% while improving accuracy and calibration. [SELENE, EACL 2026](https://aclanthology.org/2026.eacl-industry.7/).

### 4. Seat selection as experimental design

Treat each possible action `d = (seat_config, item, protocol)` as an experiment:

`utility(d) = expected posterior entropy reduction × decision impact / expected cost`

[`pyro.contrib.oed`](https://docs.pyro.ai/en/dev/contrib.oed.html) already supplies marginal, posterior, Laplace, and nested-Monte-Carlo expected-information-gain estimators. Exact EIG will often cost too much online, so train a packet-independent router surrogate from those estimates using uncertainty, calibrated competence, independence-cluster novelty, evidence coverage, and cost as features.

Every dispatch should emit `expected_information_gain`, `actual_entropy_delta`, `tokens`, `latency`, and `counterfactual_verdict_change`. This turns seat diversity into a measured acquisition policy rather than a fixed persona roster.

### 5. Judge calibration and contamination control

Run metamorphic probes before trusting a judge:

- Candidate-order reversal.
- Seat/provider label permutation.
- Confidence masking.
- Majority-count masking.
- Argument-length normalization or claim extraction.
- Unsupported specificity and fabricated-reference traps.

[NCSOFT’s OffsetBias implementation](https://github.com/ncsoft/offsetbias) provides `data/evalbiasbench/`, `run_bench.py`, prompt configurations, and pairwise inference code. Its published model card reports 85.3 on length, 100 on concreteness, 92.3 on empty references, 95.8 on content continuation, 83.3 on familiar knowledge—but only 50 on nested instructions. That is a useful warning: debiasing improves robustness without making a judge universally safe. [Model card](https://huggingface.co/NCSOFT/Llama-3-OffsetBias-8B).

Selective judge adaptation is promising but must be isolated. [`snumprlab/lwe`](https://github.com/snumprlab/lwe) implements fixed prompting, sample-specific prompting, evolving Learning While Evaluating, and Selective LWE, where only order-inconsistent cases update the meta-prompt. The EACL study reports the highest consistency and pair accuracy at 3.9× vanilla inference cost, versus 4.4× for TextGrad and 12.9× for Dynamic Cheatsheet. However, the method is explicitly order-sensitive. Use it on a calibration stream, then freeze and hash the learned judge prompt for the decision packet; never let candidate evaluation order silently rewrite the adjudicator. [EACL 2026 paper](https://aclanthology.org/2026.eacl-short.50/).

### Unique-value thesis

The moat is not “more agents.” It is a calibrated epistemic institution:

- It learns which independently configured seat is reliable for which task family.
- It purchases the next perspective by expected information gain per cost.
- It can adversarially expose evidence that a weak judge could not discover alone.
- It distinguishes factual uncertainty from value disagreement instead of collapsing both into one score.
- It produces counterfactual receipts: order swaps, identity permutations, judge substitutions, seat removal, and debate-induced verdict changes.

A single strong model can imitate roles, and self-consistency can estimate its own sampling variance. Neither establishes independent error channels when all samples share weights and alignment. The council’s moat therefore exists only when effective independence is measured and when adjudication changes based on the epistemic structure of the dispute. `deep-research` and `deep-review` can supply evidence and critiques; `deep-ai-council` uniquely converts conflicting artifacts into a calibrated decision, preserved dissent, or an explicit non-resolution.

```json
{
  "new_repos": [
    {
      "name": "lucasmaystre/choix",
      "url": "https://github.com/lucasmaystre/choix",
      "stars": "~198",
      "what": "Bradley-Terry and Plackett-Luce inference library with ML, spectral, Rank Centrality, and Bayesian expectation-propagation APIs; latest repository release shown in August 2025.",
      "lesson": "Use ep_pairwise to turn blinded council comparisons into posterior means and covariance rather than majority rankings.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "pyro-ppl/pyro",
      "url": "https://github.com/pyro-ppl/pyro",
      "stars": "~9k",
      "what": "Probabilistic-programming system whose pyro.contrib.oed.eig module implements several expected-information-gain estimators; latest tagged release shown is 1.9.1 from June 2024, with an active development branch.",
      "lesson": "Represent seat reliability, provider correlation, item difficulty, and seat-selection utility in one posterior model, then select the next seat by information gain per cost.",
      "maps_to": [
        "deep-ai-council",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "ArjunPanickssery/math_problems_debate",
      "url": "https://github.com/ArjunPanickssery/math_problems_debate",
      "stars": "~3",
      "what": "Scalable-oversight debate and consultancy experiment code with 419 commits, deterministic seeded randomness, cached LLM calls, simulated cost preflight, tests, and JSONL cost accounting.",
      "lesson": "Make debate a reproducible protocol object with explicit consultancy and direct-answer controls, not an unstructured extra conversation round.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "ncsoft/offsetbias",
      "url": "https://github.com/ncsoft/offsetbias",
      "stars": "~26",
      "what": "EMNLP 2024 reference code and EvalBiasBench data for pairwise judges exposed to length, concreteness, empty-reference, continuation, nested-instruction, and familiar-knowledge traps.",
      "lesson": "Promote judge-bias tests from an offline benchmark into packet-level metamorphic gates before a council verdict is accepted.",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "snumprlab/lwe",
      "url": "https://github.com/snumprlab/lwe",
      "stars": "~6",
      "what": "EACL 2026 implementation of fixed, sample-specific, evolving, and selectively evolving judge prompts with swap consistency and pair-accuracy outputs.",
      "lesson": "Use self-inconsistency to target judge calibration work, but freeze and version the resulting judge state before live packet adjudication.",
      "maps_to": [
        "deep-ai-council",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Categorical council votes should be aggregated with task-conditioned seat confusion matrices and hierarchical priors; provider and prompt lineage must be modeled as correlated independence clusters or the posterior will overcount cloned errors.",
      "evidence": "pyro-ppl/pyro; https://github.com/pyro-ppl/pyro",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Blinded A/B and B/A judgments can be folded into a Bradley-Terry posterior with covariance; order disagreement is a judge defect or escalation signal, not an additional vote.",
      "evidence": "lucasmaystre/choix; https://choix.lum.li/en/latest/api.html",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Debate has its strongest empirical case under information asymmetry and unreliable consultancy; against direct answering without that asymmetry its benefit is mixed, so protocol routing should test for evidence asymmetry before paying for debate.",
      "evidence": "https://arxiv.org/abs/2311.08702 and https://arxiv.org/abs/2407.04622",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Seat dispatch can be formulated as Bayesian experimental design over seat, item, and protocol, optimizing expected entropy reduction per token instead of filling a fixed council roster.",
      "evidence": "pyro.contrib.oed; https://docs.pyro.ai/en/dev/contrib.oed.html",
      "maps_to": [
        "deep-ai-council",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Selective judge adaptation should trigger on swap inconsistency, but its evolving prompt is order-sensitive; calibration state must therefore be learned on a separate stream and frozen with a packet-visible version hash.",
      "evidence": "snumprlab/lwe; https://aclanthology.org/2026.eacl-short.50/",
      "maps_to": [
        "deep-ai-council",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "[uniqueness-sharpening] Add a typed adjudication router with four terminal semantics: reliability-weighted factual posterior, blinded pairwise plan posterior, evidence-focused debate escalation, and preserved plural/value disagreement.",
      "target": "deep-ai-council",
      "rationale": "No single aggregation rule is valid across truth claims, comparative plans, constitutional constraints, and values; routing prevents majority vote from manufacturing consensus.",
      "uniqueness": "Turns the mode into an auditable decision institution that chooses how to disagree, something single-model self-consistency and the evidence-producing deep modes do not provide.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2407.04622"
    },
    {
      "rec": "Implement a packet-external hierarchical reliability ledger and an active-seat selector scoring expected posterior entropy reduction times decision impact divided by token and latency cost.",
      "target": "deep-ai-council + runtime/budget-cost",
      "rationale": "It replaces equal seat weight and fixed rosters with calibrated conditional competence while avoiding repeated calls to correlated or uninformative seats.",
      "uniqueness": "Sharpens the council into a conditional-competence market whose diversity has measured marginal value rather than cosmetic persona variety.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://docs.pyro.ai/en/dev/contrib.oed.html"
    },
    {
      "rec": "Add a council adjudicator gate that requires anonymous candidates, A/B and B/A judging, provider and confidence masking, bandwagon concealment, OffsetBias-style adversarial probes, and a frozen judge-state hash.",
      "target": "deep-ai-council + runtime/gauges-observability",
      "rationale": "Position, verbosity, authority, nested-instruction, and sequential-learning effects can dominate substantive evidence unless verdict invariance is measured directly.",
      "uniqueness": "Produces counterfactual receipts showing that the verdict survives changes irrelevant to merit, making council decisions more defensible than a strong model's unobservable internal judgment.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/ncsoft/offsetbias"
    }
  ],
  "contradictions": [
    {
      "claim": "Multi-agent debate is generally superior to a strong direct judge.",
      "counter": "Debate reliably beat unreliable consultancy, but results against direct answering were mixed on tasks without information asymmetry.",
      "evidence": "https://arxiv.org/abs/2407.04622"
    },
    {
      "claim": "A judge that learns during evaluation can safely improve the live council over time.",
      "counter": "Selective LWE improves pair accuracy and consistency but is explicitly order-sensitive, so live adaptation can make verdicts depend on packet ordering unless calibration is separated and frozen.",
      "evidence": "https://aclanthology.org/2026.eacl-short.50/"
    }
  ],
  "next_angles": [
    "Build a correlation-aware Dawid-Skene simulation comparing naive conditional independence, provider-cluster tempering, and hierarchical random effects under cloned-seat failure modes.",
    "Design an active comparison-graph policy that selects the next candidate pair by probability-of-best entropy reduction while retaining explicit ties and Condorcet cycles.",
    "Benchmark one-round evidence debate against cross-examination, simultaneous blinded briefs, consultancy, and direct judging stratified by measured information asymmetry.",
    "Define a plural verdict artifact that separates posterior factual beliefs, Pareto-dominated options, constitutional vetoes, minority evidence, and unresolved value orderings without scalarizing them."
  ],
  "notes": "No verified public repository found that combines hierarchical seat reliability, correlation correction, blinded pairwise Bayesian aggregation, bias probes, and debate routing in one implementation. The statistical components exist separately; integrating them with JSONL event versions and council-specific counterfactual metrics remains the differentiating engineering work. Exact online EIG may be too expensive, so an offline-trained routing surrogate should be evaluated against random, fixed-roster, and uncertainty-only dispatch."
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
session id: 019f6501-7cae-78b3-aeef-e9b9f0095ec2
--------
user
You are iteration 13/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-ai-council
MODE IDENTITY (what it does today): AI Council: multi-seat diverse-lens planning/deliberation, multi-round critique, convergence checks, packet-local artifacts, council test gate.
GENERIC ALTERNATIVE it must out-value: a single strong model, or self-consistency sampling of one model

THIS ITERATION'S ANGLE (A3-mech): deep-ai-council :: mechanisms & reference impls
DIRECTIVE: Concrete reference impls for council adjudication BEYOND majority vote: bayesian/Dawid-Skene aggregation, debate-with-judge, weak-to-strong, blinded pairwise, protocol-router (evidence->pairwise->debate), seat-selection-as-experimental-design (info-gain-per-cost), judge calibration + bias mitigation (bandwagon/verbosity/position). Real repos + metrics + code. Actionable designs for deep-ai-council.

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

ALWAYS answer BOTH: (1) concrete improvements to make deep-ai-council more effective; (2) the UNIQUE-VALUE / moat thesis — what deep-ai-council can do that a single strong model, or self-consistency sampling of one model and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (45) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD
Modes covered so far this run: deep-research | deep-review | deep-ai-council
New insights so far: 49; recommendations: 33.
Open threads flagged: Design a pluralist aggregation contract that distinguishes factual uncertainty, objective trade-offs, constitutional vetoes, and irreducible value disagreement. | Test anti-persuasion controls: anonymous claims, authority-label randomization, confidence masking, order swaps, and minority-evidence survival across rounds. | Build a task-conditioned independence calibration set for architecture planning, refactors, research synthesis, and governance decisions; compare error-correlation N_eff against semantic-diversity proxies. | Design the anonymous claim-graph schema and test verdict invariance under seat-label permutation, order reversal, confidence masking, and provider-name reveal. | Benchmark independence batches against equal-token single-strong-model, self-consistency, majority-vote, and verifier-guided best-of-N baselines; require council-specific marginal value. | Train a packet-local minority sentinel from stance changes, novel-evidence introductions, rebuttal survival, verifier outcomes, and leave-one-seat-out verdict changes.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "deep-ai-council"): deep-ai-council, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
SKILL ROUTING: User directed → `deep-ai-council`. This is read-only research, so the spec-folder write gate does not apply. I’m using live primary-source research to verify implementations, modules, metrics, repository activity, and council-specific transfer mechanisms.
web search: 
web search: site:github.com Dawid Skene EM aggregation Python GitHub annotator ...
web search: 
web search: github google deepmind scalable agent alignment debate consultancy judge ...
web search: 
web search: https://github.com/NCSOFT/offsetbias
web search: 
web search: GitHub "DawidSkene" "class" label aggregation ...
web search: 
web search: "OffsetBias" GitHub NCSOFT ...
web search: 
web search: https://github.com/ncsoft/offsetbias
web search: 
web search: GitHub choix Bradley Terry Python pairwise comparisons ...
web search: 
web search: https://github.com/lucasmaystre/choix
web search: 
web search: site:github.com active preference learning pairwise comparison information gain ...
web search: 
web search: 
web search: 
web search: site:github.com/pyro-ppl/pyro "contrib/oed" experimental design expected information gain ...
web search: 
web search: 
web search: 
web search: "Becoming Experienced Judges" GitHub ...
web search: 
web search: https://github.com/snumprlab/lwe
web search: 
web search: 
web search: 
web search: repo:ArjunPanickssery/math_problems_debate solib protocols debate consultancy ...
web search: 
web search: https://api.github.com/repos/ArjunPanickssery/math_problems_debate/contents/solib
web search: 
web search: https://github.com/ArjunPanickssery/math_problems_debate/tree/master/solib?plain=1
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
codex
The strongest design is emerging as a routed adjudication stack, not one universal vote rule: categorical claims need reliability-weighted latent truth; competing plans need blinded pairwise posteriors; close, evidence-bearing disputes earn debate; value conflicts must remain plural rather than be statistically “resolved.” I’m checking the cold-start and judge-drift failure modes before fixing thresholds.
web search: 
web search: OffsetBias EvalBiasBench six bias types results accuracy Llama-3-OffsetBias-8B ...
web search: 
web search: site:aclanthology.org/2026.eacl-short.50 Selective LWE accuracy consistency cost results ...
web search: 
web search: 
codex
Majority vote is the wrong abstraction for `deep-ai-council`. The mode needs a typed adjudication router because factual truth, plan preference, constitutional constraints, and value disagreement have different aggregation semantics.

The concrete design is:

1. Evidence gate.
2. Reliability-weighted categorical aggregation.
3. Blinded pairwise comparison for competing proposals.
4. Debate only for unresolved, consequential disputes with genuine information asymmetry.
5. Explicit plural output when disagreement is normative rather than epistemic.

### 1. Bayesian seat reliability

For factual claims, record observations as `(claim_id, task_family, seat_config, independence_cluster, label, abstain, evidence_refs)`. Maintain a hierarchical confusion matrix per seat and task family:

`p(true=k | labels) ∝ prior(k) × ∏ seat_confusion[seat, task_family, k, observed]`

Use hierarchical priors so new seats shrink toward provider-, role-, and global-level reliability rather than starting at zero. Model `abstain` explicitly; forcing every seat to choose manufactures evidence.

The major caveat is correlated seats. Dawid–Skene assumes conditionally independent errors, which is false when seats share model weights, prompts, retrieval, or provider alignment. A conservative first implementation should divide each independence cluster’s total log-likelihood contribution by its size; the stronger implementation adds a cluster random effect in [Pyro](https://github.com/pyro-ppl/pyro). Store posterior entropy, Brier score, calibration support, effective seat mass, and leave-one-seat-out verdict changes.

### 2. Blinded pairwise adjudication

For plans or architectures, compare candidates anonymously and in both A/B and B/A order. Feed `(winner, loser)` observations to [`choix.ep_pairwise`](https://choix.lum.li/en/latest/api.html), which returns a Gaussian approximation to the Bradley–Terry posterior mean and covariance. That gives a probability distribution over candidate strength rather than a brittle ranking.

`choix` also exposes I-LSR, Rank Centrality, MAP optimization, and log-likelihood functions, with a current 2025 release in the [repository](https://github.com/lucasmaystre/choix). It does not model ties, position covariates, or judge identity directly. Preserve ties as unresolved, measure order effects separately, and use a custom logistic layer if seat and position coefficients become necessary.

Escalate when the posterior interval overlaps, swap consistency fails, or the comparison graph is weakly connected. Pair selection should maximize expected reduction in top-choice entropy rather than exhaustively comparing every pair.

### 3. Debate as a selective diagnostic

Debate should not be the default fan-in. It earns its cost when:

- Competing proposals cite different evidence.
- The weak judge lacks information available to advocates.
- Independent seat clusters remain split.
- The decision is consequential enough to justify adversarial scrutiny.

The protocol should lock two advocates to opposing candidates, hide their identities and prior vote totals, permit one evidence-focused rebuttal, then give the judge an atomic claim graph rather than a transcript-only gestalt. The [`math_problems_debate`](https://github.com/ArjunPanickssery/math_problems_debate) implementation supplies useful operational patterns: protocol experiments under `experiments/init_exp.py`, deterministic seeded randomness, cached LLM calls, preflight cost simulation, and real-time JSONL cost totals.

Evidence limits the scope of debate’s advantage. One study found 84% judge accuracy for debate versus 74% for unreliable consultancy, while broader weak-judge experiments found debate consistently beat consultancy but produced mixed results against direct answering when information asymmetry was absent. Debate is therefore an information-recovery protocol, not a universal reasoning amplifier. [Debate study](https://arxiv.org/abs/2311.08702), [broader scalable-oversight study](https://arxiv.org/abs/2407.04622).

A newer selective-debate result independently supports this routing: confidence-likelihood mismatch plus semantic disagreement was used to trigger debate on demand, reducing token use by nearly 50% while improving accuracy and calibration. [SELENE, EACL 2026](https://aclanthology.org/2026.eacl-industry.7/).

### 4. Seat selection as experimental design

Treat each possible action `d = (seat_config, item, protocol)` as an experiment:

`utility(d) = expected posterior entropy reduction × decision impact / expected cost`

[`pyro.contrib.oed`](https://docs.pyro.ai/en/dev/contrib.oed.html) already supplies marginal, posterior, Laplace, and nested-Monte-Carlo expected-information-gain estimators. Exact EIG will often cost too much online, so train a packet-independent router surrogate from those estimates using uncertainty, calibrated competence, independence-cluster novelty, evidence coverage, and cost as features.

Every dispatch should emit `expected_information_gain`, `actual_entropy_delta`, `tokens`, `latency`, and `counterfactual_verdict_change`. This turns seat diversity into a measured acquisition policy rather than a fixed persona roster.

### 5. Judge calibration and contamination control

Run metamorphic probes before trusting a judge:

- Candidate-order reversal.
- Seat/provider label permutation.
- Confidence masking.
- Majority-count masking.
- Argument-length normalization or claim extraction.
- Unsupported specificity and fabricated-reference traps.

[NCSOFT’s OffsetBias implementation](https://github.com/ncsoft/offsetbias) provides `data/evalbiasbench/`, `run_bench.py`, prompt configurations, and pairwise inference code. Its published model card reports 85.3 on length, 100 on concreteness, 92.3 on empty references, 95.8 on content continuation, 83.3 on familiar knowledge—but only 50 on nested instructions. That is a useful warning: debiasing improves robustness without making a judge universally safe. [Model card](https://huggingface.co/NCSOFT/Llama-3-OffsetBias-8B).

Selective judge adaptation is promising but must be isolated. [`snumprlab/lwe`](https://github.com/snumprlab/lwe) implements fixed prompting, sample-specific prompting, evolving Learning While Evaluating, and Selective LWE, where only order-inconsistent cases update the meta-prompt. The EACL study reports the highest consistency and pair accuracy at 3.9× vanilla inference cost, versus 4.4× for TextGrad and 12.9× for Dynamic Cheatsheet. However, the method is explicitly order-sensitive. Use it on a calibration stream, then freeze and hash the learned judge prompt for the decision packet; never let candidate evaluation order silently rewrite the adjudicator. [EACL 2026 paper](https://aclanthology.org/2026.eacl-short.50/).

### Unique-value thesis

The moat is not “more agents.” It is a calibrated epistemic institution:

- It learns which independently configured seat is reliable for which task family.
- It purchases the next perspective by expected information gain per cost.
- It can adversarially expose evidence that a weak judge could not discover alone.
- It distinguishes factual uncertainty from value disagreement instead of collapsing both into one score.
- It produces counterfactual receipts: order swaps, identity permutations, judge substitutions, seat removal, and debate-induced verdict changes.

A single strong model can imitate roles, and self-consistency can estimate its own sampling variance. Neither establishes independent error channels when all samples share weights and alignment. The council’s moat therefore exists only when effective independence is measured and when adjudication changes based on the epistemic structure of the dispute. `deep-research` and `deep-review` can supply evidence and critiques; `deep-ai-council` uniquely converts conflicting artifacts into a calibrated decision, preserved dissent, or an explicit non-resolution.

```json
{
  "new_repos": [
    {
      "name": "lucasmaystre/choix",
      "url": "https://github.com/lucasmaystre/choix",
      "stars": "~198",
      "what": "Bradley-Terry and Plackett-Luce inference library with ML, spectral, Rank Centrality, and Bayesian expectation-propagation APIs; latest repository release shown in August 2025.",
      "lesson": "Use ep_pairwise to turn blinded council comparisons into posterior means and covariance rather than majority rankings.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "name": "pyro-ppl/pyro",
      "url": "https://github.com/pyro-ppl/pyro",
      "stars": "~9k",
      "what": "Probabilistic-programming system whose pyro.contrib.oed.eig module implements several expected-information-gain estimators; latest tagged release shown is 1.9.1 from June 2024, with an active development branch.",
      "lesson": "Represent seat reliability, provider correlation, item difficulty, and seat-selection utility in one posterior model, then select the next seat by information gain per cost.",
      "maps_to": [
        "deep-ai-council",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "ArjunPanickssery/math_problems_debate",
      "url": "https://github.com/ArjunPanickssery/math_problems_debate",
      "stars": "~3",
      "what": "Scalable-oversight debate and consultancy experiment code with 419 commits, deterministic seeded randomness, cached LLM calls, simulated cost preflight, tests, and JSONL cost accounting.",
      "lesson": "Make debate a reproducible protocol object with explicit consultancy and direct-answer controls, not an unstructured extra conversation round.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "ncsoft/offsetbias",
      "url": "https://github.com/ncsoft/offsetbias",
      "stars": "~26",
      "what": "EMNLP 2024 reference code and EvalBiasBench data for pairwise judges exposed to length, concreteness, empty-reference, continuation, nested-instruction, and familiar-knowledge traps.",
      "lesson": "Promote judge-bias tests from an offline benchmark into packet-level metamorphic gates before a council verdict is accepted.",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "snumprlab/lwe",
      "url": "https://github.com/snumprlab/lwe",
      "stars": "~6",
      "what": "EACL 2026 implementation of fixed, sample-specific, evolving, and selectively evolving judge prompts with swap consistency and pair-accuracy outputs.",
      "lesson": "Use self-inconsistency to target judge calibration work, but freeze and version the resulting judge state before live packet adjudication.",
      "maps_to": [
        "deep-ai-council",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Categorical council votes should be aggregated with task-conditioned seat confusion matrices and hierarchical priors; provider and prompt lineage must be modeled as correlated independence clusters or the posterior will overcount cloned errors.",
      "evidence": "pyro-ppl/pyro; https://github.com/pyro-ppl/pyro",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Blinded A/B and B/A judgments can be folded into a Bradley-Terry posterior with covariance; order disagreement is a judge defect or escalation signal, not an additional vote.",
      "evidence": "lucasmaystre/choix; https://choix.lum.li/en/latest/api.html",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Debate has its strongest empirical case under information asymmetry and unreliable consultancy; against direct answering without that asymmetry its benefit is mixed, so protocol routing should test for evidence asymmetry before paying for debate.",
      "evidence": "https://arxiv.org/abs/2311.08702 and https://arxiv.org/abs/2407.04622",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Seat dispatch can be formulated as Bayesian experimental design over seat, item, and protocol, optimizing expected entropy reduction per token instead of filling a fixed council roster.",
      "evidence": "pyro.contrib.oed; https://docs.pyro.ai/en/dev/contrib.oed.html",
      "maps_to": [
        "deep-ai-council",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Selective judge adaptation should trigger on swap inconsistency, but its evolving prompt is order-sensitive; calibration state must therefore be learned on a separate stream and frozen with a packet-visible version hash.",
      "evidence": "snumprlab/lwe; https://aclanthology.org/2026.eacl-short.50/",
      "maps_to": [
        "deep-ai-council",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "[uniqueness-sharpening] Add a typed adjudication router with four terminal semantics: reliability-weighted factual posterior, blinded pairwise plan posterior, evidence-focused debate escalation, and preserved plural/value disagreement.",
      "target": "deep-ai-council",
      "rationale": "No single aggregation rule is valid across truth claims, comparative plans, constitutional constraints, and values; routing prevents majority vote from manufacturing consensus.",
      "uniqueness": "Turns the mode into an auditable decision institution that chooses how to disagree, something single-model self-consistency and the evidence-producing deep modes do not provide.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2407.04622"
    },
    {
      "rec": "Implement a packet-external hierarchical reliability ledger and an active-seat selector scoring expected posterior entropy reduction times decision impact divided by token and latency cost.",
      "target": "deep-ai-council + runtime/budget-cost",
      "rationale": "It replaces equal seat weight and fixed rosters with calibrated conditional competence while avoiding repeated calls to correlated or uninformative seats.",
      "uniqueness": "Sharpens the council into a conditional-competence market whose diversity has measured marginal value rather than cosmetic persona variety.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://docs.pyro.ai/en/dev/contrib.oed.html"
    },
    {
      "rec": "Add a council adjudicator gate that requires anonymous candidates, A/B and B/A judging, provider and confidence masking, bandwagon concealment, OffsetBias-style adversarial probes, and a frozen judge-state hash.",
      "target": "deep-ai-council + runtime/gauges-observability",
      "rationale": "Position, verbosity, authority, nested-instruction, and sequential-learning effects can dominate substantive evidence unless verdict invariance is measured directly.",
      "uniqueness": "Produces counterfactual receipts showing that the verdict survives changes irrelevant to merit, making council decisions more defensible than a strong model's unobservable internal judgment.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/ncsoft/offsetbias"
    }
  ],
  "contradictions": [
    {
      "claim": "Multi-agent debate is generally superior to a strong direct judge.",
      "counter": "Debate reliably beat unreliable consultancy, but results against direct answering were mixed on tasks without information asymmetry.",
      "evidence": "https://arxiv.org/abs/2407.04622"
    },
    {
      "claim": "A judge that learns during evaluation can safely improve the live council over time.",
      "counter": "Selective LWE improves pair accuracy and consistency but is explicitly order-sensitive, so live adaptation can make verdicts depend on packet ordering unless calibration is separated and frozen.",
      "evidence": "https://aclanthology.org/2026.eacl-short.50/"
    }
  ],
  "next_angles": [
    "Build a correlation-aware Dawid-Skene simulation comparing naive conditional independence, provider-cluster tempering, and hierarchical random effects under cloned-seat failure modes.",
    "Design an active comparison-graph policy that selects the next candidate pair by probability-of-best entropy reduction while retaining explicit ties and Condorcet cycles.",
    "Benchmark one-round evidence debate against cross-examination, simultaneous blinded briefs, consultancy, and direct judging stratified by measured information asymmetry.",
    "Define a plural verdict artifact that separates posterior factual beliefs, Pareto-dominated options, constitutional vetoes, minority evidence, and unresolved value orderings without scalarizing them."
  ],
  "notes": "No verified public repository found that combines hierarchical seat reliability, correlation correction, blinded pairwise Bayesian aggregation, bias probes, and debate routing in one implementation. The statistical components exist separately; integrating them with JSONL event versions and council-specific counterfactual metrics remains the differentiating engineering work. Exact online EIG may be too expensive, so an offline-trained routing surrogate should be evaluated against random, fixed-roster, and uncertainty-only dispatch."
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
192,364
