<!-- iteration 11 | SOL xhigh | mode: deep-ai-council | angle: A1-sota deep-ai-council :: 2025-2026 state of the art | 2026-07-15T08:54:58.300Z -->

The SOTA signal is fairly sharp: `deep-ai-council` should stop treating model count, role labels, and transcript-wide debate as the source of value. Its moat should be engineered epistemic independence—different evidence, methods, and objectives—followed by auditable belief revision.

### What newer systems add

1. **Designed information asymmetry, not cosmetic personas.** InfoDelphi divides evidence into a relevant shared core plus disjoint private subsets, exchanges rationales rather than conclusions alone, then aggregates probabilities in logit space. Its ablations found that all-public evidence, no rationale sharing, and a third round each degraded results. This suggests a council brief should be compiled as:

   `shared_evidence[] + seat.private_evidence[] + seat.method_contract + seat.prior`

   A single model seeing the full corpus cannot reproduce the same information-discovery dynamic merely by sampling itself. [InfoDelphi paper](https://arxiv.org/html/2607.01661)

2. **Reasoning-path allocation before deliberation.** DynaDebate generates mutually independent solution paths, assigns one per seat when exploration is useful, duplicates paths when consistency checking is preferable, requires atomic-step audits, and triggers tool verification only on unresolved disagreement. Its paper reports path coverage exceeding single-path behavior and larger gains on problems with several plausible-but-wrong entry points. [DynaDebate paper](https://arxiv.org/html/2601.05746)

3. **Selective exposure beats transcript broadcasting.** DAR’s moderator returns message indices—not rewritten summaries—chosen to preserve disagreement against the current majority. `src/dev.py` exposes strategies through `--m_role filter_critical`; full histories, ANLL uncertainty, and answers are retained in JSONL. This is directly adoptable: preserve immutable seat messages, but construct a different dissent-rich inbox for each recipient. [DAR repository](https://github.com/DA2I2-SLM/DAR), [paper](https://arxiv.org/html/2603.20640)

4. **Confidence must be calibrated and operational.** DMAD oversamples candidates, greedily selects an embedding-diverse initial subset, then separately trains confidence expression and confidence usage through `training/grpo_confidence.py` and `training/grpo_debate.py`. ECON goes further with explicit belief states, commitment alignment, novelty rewards, oscillation detection, and BNE refinement in `src/controllers/basic_mac.py`. The transferable piece is a typed belief ledger; ECON’s RL stack is too heavy for a general-purpose council default. [DMAD repository](https://github.com/SpaceHunterInf/DMAD), [ECON repository](https://github.com/tmlr-group/ECON)

5. **Consensus is not the objective for value-laden councils.** Cultural Debate measures both accuracy and cultural-group parity, while newer constitutional work separates hard prohibitions from soft utility optimization. MAC also represents constitutions as versioned rules whose proposed edits survive only when held-out evaluation improves. The council should therefore emit a majority recommendation, minority report, violated constraints, and Pareto trade-offs—not force every seat into one voice. [Cultural Debate](https://aclanthology.org/2025.acl-long.1210/), [MAC](https://www.mac-prompt.com/), [CMAG](https://arxiv.org/abs/2603.13189)

### Concrete mode changes

- **[uniqueness-sharpening] Add an epistemic brief compiler.** Cluster evidence and candidate reasoning paths, reserve a shared core, allocate complementary private slices, and record why each seat exists. Track `private_evidence_recall`, path coverage, pairwise error correlation, and the counterfactual verdict without each seat.

- **Replace round transcripts with a belief-and-challenge protocol.** Each seat emits `{claim_id, stance, probability, evidence_ids, derivation_steps, challenges, revised_from, revision_reason}`. A DAR-style selector sends original dissenting claims by ID; a DynaDebate-style verifier activates when incompatible claims survive step-level critique.

- **Make the council test gate comparative.** Run cheap single-strong, self-consistency, and same-model MoA controls. Escalate only when evidence communities, genuine objective conflict, or unresolved verifier-backed disagreement exist. OptiLLM already provides a practical same-model MoA control through `optillm/moa.py`; 2025 conditional-effectiveness studies find that generic debate often has little advantage over self-agent scaling. [OptiLLM](https://github.com/algorithmicsuperintelligence/optillm/blob/main/optillm/moa.py), [MAD-as-test-time-scaling](https://arxiv.org/abs/2505.22960)

### Moat thesis

`deep-ai-council` should own **auditable collective judgment under controlled disagreement**. Deep research assembles evidence; deep review attacks an artifact; self-consistency samples trajectories. The council uniquely maintains separate information boundaries, incompatible priors or constitutions, cross-examines how private evidence changes beliefs, and preserves legitimate residual disagreement in the final packet.

That moat disappears if every seat receives the same context and the chair merely summarizes. It strengthens when the system can prove: this evidence entered through seat X, changed claim Y in round Z, survived challenge W, and the final decision would differ without it.

```json
{
  "new_repos": [
    {
      "name": "DA2I2-SLM/DAR",
      "url": "https://github.com/DA2I2-SLM/DAR",
      "stars": "~18",
      "what": "2026 DAR implementation with 25 commits, vLLM batching, configurable filtering strategies, and JSONL debate histories.",
      "lesson": "Select immutable message IDs that maximize useful disagreement instead of broadcasting or summarizing every seat response.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "SpaceHunterInf/DMAD",
      "url": "https://github.com/SpaceHunterInf/DMAD",
      "stars": "~1",
      "what": "Official 2026 implementation of diversity-aware initialization and confidence-modulated debate; repository currently has 5 commits.",
      "lesson": "Oversample initial answers, select a maximally diverse subset, and distinguish confidence expression from the ability to use confidence during revision.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "tmlr-group/ECON",
      "url": "https://github.com/tmlr-group/ECON",
      "stars": "~39",
      "what": "ICML 2025 belief-driven coordination implementation with 17 commits, learned belief states, hierarchical coordinators, BNE refinement, and oscillation guards.",
      "lesson": "Represent each seat's belief and commitment explicitly; borrow equilibrium and oscillation checks without making RL training mandatory.",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "algorithmicsuperintelligence/optillm",
      "url": "https://github.com/algorithmicsuperintelligence/optillm",
      "stars": "~4.2k",
      "what": "Actively maintained inference proxy; release v0.3.21 was published July 5, 2026 and its moa.py implements same-model candidate, critique, and synthesis.",
      "lesson": "Use its same-model MoA path as a mandatory control arm that the council must beat, not as evidence that multiple seats are intrinsically valuable.",
      "maps_to": [
        "deep-ai-council",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "dayeonki/cultural_debate",
      "url": "https://github.com/dayeonki/cultural_debate",
      "stars": "~9",
      "what": "ACL 2025 Oral code and data with 15 commits, heterogeneous model pairings, country-specific evidence, and accuracy/parity evaluation.",
      "lesson": "For plural-value decisions, evaluate group parity and contextual legitimacy alongside aggregate correctness and preserve non-majority positions.",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Compile each council into shared common ground plus disjoint private evidence; exchange rationale excerpts so private signals can cross seat boundaries without collapsing the information partition.",
      "evidence": "https://arxiv.org/html/2607.01661",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Generate task-specific independent reasoning paths before fan-out, use unique paths for exploration and duplicate paths only when consistency checking is the better objective.",
      "evidence": "https://arxiv.org/html/2601.05746",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Construct recipient-specific inboxes from original dissenting message IDs; disagreement preservation is safer and more informative than confidence-threshold filtering or transcript summarization.",
      "evidence": "https://arxiv.org/html/2603.20640",
      "maps_to": [
        "deep-ai-council",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Track probabilistic beliefs, calibration, revisions, and oscillations as first-class council state; textual agreement alone cannot distinguish correct convergence from herding.",
      "evidence": "https://github.com/SpaceHunterInf/DMAD and https://github.com/tmlr-group/ECON",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Constitutional deliberation needs hard veto constraints, soft multi-objective scoring, and an explicit minority artifact because maximum consensus or cooperation can reduce autonomy, integrity, or fairness.",
      "evidence": "https://arxiv.org/abs/2603.13189 and https://www.mac-prompt.com/",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a CouncilBrief compiler producing shared_evidence, per-seat private_evidence, assigned reasoning_path, redundancy_group, prior, and protected objective; choose assignments by evidence-community and structural-path coverage rather than static persona labels.",
      "target": "deep-ai-council",
      "rationale": "Designed information asymmetry and path allocation reduce correlated errors before deliberation begins, where later critique cannot reliably repair them.",
      "uniqueness": "This makes the council a distributed knowledge-reconstruction protocol whose result depends on information no single seat receives, sharply separating it from one-model sampling and the other deep modes.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/html/2607.01661 and https://arxiv.org/html/2601.05746"
    },
    {
      "rec": "Replace transcript-wide rounds with typed belief messages and recipient-specific dissent retention: immutable claim IDs, probabilities, evidence IDs, atomic derivation steps, challenge targets, and explicit revision causes; trigger external verification when step-level conflicts persist.",
      "target": "deep-ai-council",
      "rationale": "It preserves minority evidence, makes persuasion auditable, limits redundant context, and distinguishes evidence-driven belief revision from social conformity.",
      "uniqueness": "The resulting influence graph and minority lineage are collective-decision artifacts that self-consistency and ordinary synthesis do not produce.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/DA2I2-SLM/DAR and https://arxiv.org/html/2601.05746"
    },
    {
      "rec": "Extend the council test gate with single-strong, self-consistency, and same-model MoA control arms plus a constitutional outcome schema containing hard violations, soft objective scores, majority recommendation, minority report, and counterfactual verdicts with each seat removed.",
      "target": "deep-ai-council",
      "rationale": "Generic debate is conditionally useful and consensus can be confidently wrong or normatively unacceptable; comparative controls expose whether council structure added value.",
      "uniqueness": "Positions the mode as plural, accountable decision governance rather than an expensive answer ensemble.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2505.22960, https://github.com/algorithmicsuperintelligence/optillm, and https://arxiv.org/abs/2603.13189"
    }
  ],
  "contradictions": [
    {
      "claim": "Using different model providers or more debate rounds inherently creates useful diversity.",
      "counter": "Self-MoA can outperform heterogeneous MoA, mathematical MAD often gains little from agent diversity, and homogeneous evidence still induces correlated errors.",
      "evidence": "https://arxiv.org/abs/2502.00674, https://arxiv.org/abs/2505.22960, https://arxiv.org/html/2607.01661"
    },
    {
      "claim": "More rounds monotonically improve the council by increasing convergence.",
      "counter": "InfoDelphi's third round degraded both calibration and accuracy after private evidence had already propagated; later rounds shifted toward herding.",
      "evidence": "https://arxiv.org/html/2607.01661"
    },
    {
      "claim": "Filtering to the most confident messages is the safest communication policy.",
      "counter": "Confidence is often miscalibrated; DAR found that retaining authentic disagreement against the majority was more robust than threshold-based uncertainty filtering.",
      "evidence": "https://arxiv.org/html/2603.20640"
    }
  ],
  "next_angles": [
    "Benchmark evidence-partition strategies for council seats: BM25 round-robin, semantic communities, contradiction clusters, causal graphs, and adversarially withheld evidence.",
    "Measure seat marginal value with leave-one-seat-out and Shapley-style verdict influence, separating useful independence from theatrical role diversity.",
    "Design a pluralist aggregation contract that distinguishes factual uncertainty, objective trade-offs, constitutional vetoes, and irreducible value disagreement.",
    "Test anti-persuasion controls: anonymous claims, authority-label randomization, confidence masking, order swaps, and minority-evidence survival across rounds."
  ],
  "notes": "No publicly verifiable repository was found for InfoDelphi or CMAG, and the DynaDebate paper's linked brianstorm repository could not be independently resolved, so those are cited as papers only. MAC has authoritative project documentation and an API example, but its GitHub destination and star count were not exposed reliably. The strongest open implementations are DAR, DMAD, ECON, and OptiLLM; several 2026 results remain preprints and need reproduction on open-ended planning rather than closed-answer benchmarks."
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
session id: 019f64f8-13e0-7223-8421-5f18de1c25ff
--------
user
You are iteration 11/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-ai-council
MODE IDENTITY (what it does today): AI Council: multi-seat diverse-lens planning/deliberation, multi-round critique, convergence checks, packet-local artifacts, council test gate.
GENERIC ALTERNATIVE it must out-value: a single strong model, or self-consistency sampling of one model

THIS ITERATION'S ANGLE (A1-sota): deep-ai-council :: 2025-2026 state of the art
DIRECTIVE: Survey the NEWEST (2025-2026) multi-agent debate / deliberation / council / mixture-of-agents systems (LLM-Debate, Society-of-Minds, MoA, ChatEval, constitutional/CAI panels, multi-agent-verify, self-MoA). What do their deliberation protocols, aggregation, and diversity controls do that our multi-seat council does NOT? Real repos/URLs + adoptable mechanisms mapped to deep-ai-council.

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
THIS run's new repos so far (37) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp
Modes covered so far this run: deep-research | deep-review
New insights so far: 39; recommendations: 27.
Open threads flagged: Adversarially test reducer-derived verdicts against truncation, duplicate JSON keys, hidden findings, narrative-verdict contradictions, and final-line injection. | Run controlled context-ladder experiments by reasoning-distance cell to learn when local slices, call graphs, tests, or cross-file contracts improve Type2 and Type3 detection. | Benchmark raw-diff versus semantic-residual review on refactor-heavy PRs, measuring token cost, obligation coverage, accepted findings, and missed regressions. | Design causal filtering for runtime witnesses using repeated seeds, environment normalization, changed-slice proximity, and input intervention. | Evaluate semantic-anchor survival across rebases, symbol moves, generated-code changes, and partial fix commits; measure false finding closure and duplicate resurrection. | Learn a language- and risk-specific verifier escalation policy from historical obligation outcomes, including verifier setup failures and time-to-counterexample.

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
I’m treating this as a read-only research iteration, so no spec-folder write choice is needed. I’ll stay inside `deep-ai-council`, exclude every repo in both supplied catalogs, and verify implementation details, recency, and star counts from primary sources.
codex
The required memory-trigger and skill-advisor gates are not exposed in this session. Routing is still unambiguous from the user’s explicit direction: `TARGET MODE: deep-ai-council`; I’m continuing with primary-source web verification and will mark any unverified metric as unknown.
web search: 
web search: 2025 self-MoA mixture of agents GitHub paper LLM ...
web search: 
web search: "From Debate to Equilibrium" GitHub Yi Zhou belief driven multi agent ...
web search: 
web search: site:github.com "Hear Both Sides" "Diversity-Aware Retention" ...
codex
A useful fault line is emerging: 2025–2026 results do not support “more models plus more rounds” as the council’s moat. The gains concentrate in designed information asymmetry, selective exposure to dissent, and explicit belief/confidence updates; homogeneous free-form debate often collapses to voting or herding. I’m checking the reference code now.
web search: 
web search: https://github.com/tmlr-group/ECON
web search: 
web search: "InfoDelphi" GitHub ...
web search: 
web search: https://github.com/SpaceHunterInf/DMAD
web search: 
web search: 
web search: 
web search: 'moa.py'
web search: 
web search: 
web search: 
web search: github InfoDelphi PolyGym Yuante Li Yicheng Tao Kate Zhang ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/ioio0614/MAME/
web search: 
web search: https://arxiv.org/html/2603.20640
web search: 
web search: https://github.com/DA2I2-SLM/DAR
web search: 
web search: https://github.com/nwpuLee2021/brianstorm
codex
The strongest mode-specific design is now clearer: the council should manufacture epistemic independence before debate, then preserve minority evidence during debate. Static role labels are too weak; the newer systems manipulate each seat’s evidence, assigned reasoning path, confidence semantics, and message visibility.
web search: 
web search: 
web search: 
web search: github nwpuLee2021 brianstorm DynaDebate ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 2025 constitutional AI multi-agent panel debate GitHub ...
web search: 
web search: "MAC: Multi-Agent Constitution Learning" GitHub ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'github.com'
codex
The SOTA signal is fairly sharp: `deep-ai-council` should stop treating model count, role labels, and transcript-wide debate as the source of value. Its moat should be engineered epistemic independence—different evidence, methods, and objectives—followed by auditable belief revision.

### What newer systems add

1. **Designed information asymmetry, not cosmetic personas.** InfoDelphi divides evidence into a relevant shared core plus disjoint private subsets, exchanges rationales rather than conclusions alone, then aggregates probabilities in logit space. Its ablations found that all-public evidence, no rationale sharing, and a third round each degraded results. This suggests a council brief should be compiled as:

   `shared_evidence[] + seat.private_evidence[] + seat.method_contract + seat.prior`

   A single model seeing the full corpus cannot reproduce the same information-discovery dynamic merely by sampling itself. [InfoDelphi paper](https://arxiv.org/html/2607.01661)

2. **Reasoning-path allocation before deliberation.** DynaDebate generates mutually independent solution paths, assigns one per seat when exploration is useful, duplicates paths when consistency checking is preferable, requires atomic-step audits, and triggers tool verification only on unresolved disagreement. Its paper reports path coverage exceeding single-path behavior and larger gains on problems with several plausible-but-wrong entry points. [DynaDebate paper](https://arxiv.org/html/2601.05746)

3. **Selective exposure beats transcript broadcasting.** DAR’s moderator returns message indices—not rewritten summaries—chosen to preserve disagreement against the current majority. `src/dev.py` exposes strategies through `--m_role filter_critical`; full histories, ANLL uncertainty, and answers are retained in JSONL. This is directly adoptable: preserve immutable seat messages, but construct a different dissent-rich inbox for each recipient. [DAR repository](https://github.com/DA2I2-SLM/DAR), [paper](https://arxiv.org/html/2603.20640)

4. **Confidence must be calibrated and operational.** DMAD oversamples candidates, greedily selects an embedding-diverse initial subset, then separately trains confidence expression and confidence usage through `training/grpo_confidence.py` and `training/grpo_debate.py`. ECON goes further with explicit belief states, commitment alignment, novelty rewards, oscillation detection, and BNE refinement in `src/controllers/basic_mac.py`. The transferable piece is a typed belief ledger; ECON’s RL stack is too heavy for a general-purpose council default. [DMAD repository](https://github.com/SpaceHunterInf/DMAD), [ECON repository](https://github.com/tmlr-group/ECON)

5. **Consensus is not the objective for value-laden councils.** Cultural Debate measures both accuracy and cultural-group parity, while newer constitutional work separates hard prohibitions from soft utility optimization. MAC also represents constitutions as versioned rules whose proposed edits survive only when held-out evaluation improves. The council should therefore emit a majority recommendation, minority report, violated constraints, and Pareto trade-offs—not force every seat into one voice. [Cultural Debate](https://aclanthology.org/2025.acl-long.1210/), [MAC](https://www.mac-prompt.com/), [CMAG](https://arxiv.org/abs/2603.13189)

### Concrete mode changes

- **[uniqueness-sharpening] Add an epistemic brief compiler.** Cluster evidence and candidate reasoning paths, reserve a shared core, allocate complementary private slices, and record why each seat exists. Track `private_evidence_recall`, path coverage, pairwise error correlation, and the counterfactual verdict without each seat.

- **Replace round transcripts with a belief-and-challenge protocol.** Each seat emits `{claim_id, stance, probability, evidence_ids, derivation_steps, challenges, revised_from, revision_reason}`. A DAR-style selector sends original dissenting claims by ID; a DynaDebate-style verifier activates when incompatible claims survive step-level critique.

- **Make the council test gate comparative.** Run cheap single-strong, self-consistency, and same-model MoA controls. Escalate only when evidence communities, genuine objective conflict, or unresolved verifier-backed disagreement exist. OptiLLM already provides a practical same-model MoA control through `optillm/moa.py`; 2025 conditional-effectiveness studies find that generic debate often has little advantage over self-agent scaling. [OptiLLM](https://github.com/algorithmicsuperintelligence/optillm/blob/main/optillm/moa.py), [MAD-as-test-time-scaling](https://arxiv.org/abs/2505.22960)

### Moat thesis

`deep-ai-council` should own **auditable collective judgment under controlled disagreement**. Deep research assembles evidence; deep review attacks an artifact; self-consistency samples trajectories. The council uniquely maintains separate information boundaries, incompatible priors or constitutions, cross-examines how private evidence changes beliefs, and preserves legitimate residual disagreement in the final packet.

That moat disappears if every seat receives the same context and the chair merely summarizes. It strengthens when the system can prove: this evidence entered through seat X, changed claim Y in round Z, survived challenge W, and the final decision would differ without it.

```json
{
  "new_repos": [
    {
      "name": "DA2I2-SLM/DAR",
      "url": "https://github.com/DA2I2-SLM/DAR",
      "stars": "~18",
      "what": "2026 DAR implementation with 25 commits, vLLM batching, configurable filtering strategies, and JSONL debate histories.",
      "lesson": "Select immutable message IDs that maximize useful disagreement instead of broadcasting or summarizing every seat response.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "SpaceHunterInf/DMAD",
      "url": "https://github.com/SpaceHunterInf/DMAD",
      "stars": "~1",
      "what": "Official 2026 implementation of diversity-aware initialization and confidence-modulated debate; repository currently has 5 commits.",
      "lesson": "Oversample initial answers, select a maximally diverse subset, and distinguish confidence expression from the ability to use confidence during revision.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "tmlr-group/ECON",
      "url": "https://github.com/tmlr-group/ECON",
      "stars": "~39",
      "what": "ICML 2025 belief-driven coordination implementation with 17 commits, learned belief states, hierarchical coordinators, BNE refinement, and oscillation guards.",
      "lesson": "Represent each seat's belief and commitment explicitly; borrow equilibrium and oscillation checks without making RL training mandatory.",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "algorithmicsuperintelligence/optillm",
      "url": "https://github.com/algorithmicsuperintelligence/optillm",
      "stars": "~4.2k",
      "what": "Actively maintained inference proxy; release v0.3.21 was published July 5, 2026 and its moa.py implements same-model candidate, critique, and synthesis.",
      "lesson": "Use its same-model MoA path as a mandatory control arm that the council must beat, not as evidence that multiple seats are intrinsically valuable.",
      "maps_to": [
        "deep-ai-council",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "dayeonki/cultural_debate",
      "url": "https://github.com/dayeonki/cultural_debate",
      "stars": "~9",
      "what": "ACL 2025 Oral code and data with 15 commits, heterogeneous model pairings, country-specific evidence, and accuracy/parity evaluation.",
      "lesson": "For plural-value decisions, evaluate group parity and contextual legitimacy alongside aggregate correctness and preserve non-majority positions.",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Compile each council into shared common ground plus disjoint private evidence; exchange rationale excerpts so private signals can cross seat boundaries without collapsing the information partition.",
      "evidence": "https://arxiv.org/html/2607.01661",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Generate task-specific independent reasoning paths before fan-out, use unique paths for exploration and duplicate paths only when consistency checking is the better objective.",
      "evidence": "https://arxiv.org/html/2601.05746",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Construct recipient-specific inboxes from original dissenting message IDs; disagreement preservation is safer and more informative than confidence-threshold filtering or transcript summarization.",
      "evidence": "https://arxiv.org/html/2603.20640",
      "maps_to": [
        "deep-ai-council",
        "runtime/dedup-novelty",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Track probabilistic beliefs, calibration, revisions, and oscillations as first-class council state; textual agreement alone cannot distinguish correct convergence from herding.",
      "evidence": "https://github.com/SpaceHunterInf/DMAD and https://github.com/tmlr-group/ECON",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Constitutional deliberation needs hard veto constraints, soft multi-objective scoring, and an explicit minority artifact because maximum consensus or cooperation can reduce autonomy, integrity, or fairness.",
      "evidence": "https://arxiv.org/abs/2603.13189 and https://www.mac-prompt.com/",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a CouncilBrief compiler producing shared_evidence, per-seat private_evidence, assigned reasoning_path, redundancy_group, prior, and protected objective; choose assignments by evidence-community and structural-path coverage rather than static persona labels.",
      "target": "deep-ai-council",
      "rationale": "Designed information asymmetry and path allocation reduce correlated errors before deliberation begins, where later critique cannot reliably repair them.",
      "uniqueness": "This makes the council a distributed knowledge-reconstruction protocol whose result depends on information no single seat receives, sharply separating it from one-model sampling and the other deep modes.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/html/2607.01661 and https://arxiv.org/html/2601.05746"
    },
    {
      "rec": "Replace transcript-wide rounds with typed belief messages and recipient-specific dissent retention: immutable claim IDs, probabilities, evidence IDs, atomic derivation steps, challenge targets, and explicit revision causes; trigger external verification when step-level conflicts persist.",
      "target": "deep-ai-council",
      "rationale": "It preserves minority evidence, makes persuasion auditable, limits redundant context, and distinguishes evidence-driven belief revision from social conformity.",
      "uniqueness": "The resulting influence graph and minority lineage are collective-decision artifacts that self-consistency and ordinary synthesis do not produce.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/DA2I2-SLM/DAR and https://arxiv.org/html/2601.05746"
    },
    {
      "rec": "Extend the council test gate with single-strong, self-consistency, and same-model MoA control arms plus a constitutional outcome schema containing hard violations, soft objective scores, majority recommendation, minority report, and counterfactual verdicts with each seat removed.",
      "target": "deep-ai-council",
      "rationale": "Generic debate is conditionally useful and consensus can be confidently wrong or normatively unacceptable; comparative controls expose whether council structure added value.",
      "uniqueness": "Positions the mode as plural, accountable decision governance rather than an expensive answer ensemble.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2505.22960, https://github.com/algorithmicsuperintelligence/optillm, and https://arxiv.org/abs/2603.13189"
    }
  ],
  "contradictions": [
    {
      "claim": "Using different model providers or more debate rounds inherently creates useful diversity.",
      "counter": "Self-MoA can outperform heterogeneous MoA, mathematical MAD often gains little from agent diversity, and homogeneous evidence still induces correlated errors.",
      "evidence": "https://arxiv.org/abs/2502.00674, https://arxiv.org/abs/2505.22960, https://arxiv.org/html/2607.01661"
    },
    {
      "claim": "More rounds monotonically improve the council by increasing convergence.",
      "counter": "InfoDelphi's third round degraded both calibration and accuracy after private evidence had already propagated; later rounds shifted toward herding.",
      "evidence": "https://arxiv.org/html/2607.01661"
    },
    {
      "claim": "Filtering to the most confident messages is the safest communication policy.",
      "counter": "Confidence is often miscalibrated; DAR found that retaining authentic disagreement against the majority was more robust than threshold-based uncertainty filtering.",
      "evidence": "https://arxiv.org/html/2603.20640"
    }
  ],
  "next_angles": [
    "Benchmark evidence-partition strategies for council seats: BM25 round-robin, semantic communities, contradiction clusters, causal graphs, and adversarially withheld evidence.",
    "Measure seat marginal value with leave-one-seat-out and Shapley-style verdict influence, separating useful independence from theatrical role diversity.",
    "Design a pluralist aggregation contract that distinguishes factual uncertainty, objective trade-offs, constitutional vetoes, and irreducible value disagreement.",
    "Test anti-persuasion controls: anonymous claims, authority-label randomization, confidence masking, order swaps, and minority-evidence survival across rounds."
  ],
  "notes": "No publicly verifiable repository was found for InfoDelphi or CMAG, and the DynaDebate paper's linked brianstorm repository could not be independently resolved, so those are cited as papers only. MAC has authoritative project documentation and an API example, but its GitHub destination and star count were not exposed reliably. The strongest open implementations are DAR, DMAD, ECON, and OptiLLM; several 2026 results remain preprints and need reproduction on open-ended planning rather than closed-answer benchmarks."
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
235,712
