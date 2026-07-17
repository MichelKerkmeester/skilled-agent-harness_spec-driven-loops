<!-- iteration 12 | SOL xhigh | mode: deep-ai-council | angle: A2-moat deep-ai-council :: unique value / moat | 2026-07-15T09:00:17.412Z -->

The moat is not consensus. Consensus is often the failure mode. The defensible moat is a governed market of genuinely independent hypotheses: seats acquire different evidence or use different reasoning methods, claims are cross-examined, adjudication is blinded, and minority arguments survive until verified or explicitly rejected.

The evidence sets a high bar. NeurIPS 2025 found majority voting matched multi-agent debate across seven benchmarks; even prompted persona heterogeneity mostly preserved that result. Debate behaved like a martingale unless the protocol introduced an asymmetry favoring correct signals. [Debate or Vote](https://proceedings.neurips.cc/paper_files/paper/2025/file/934252acd87f254d5d4672fbde283bd2-Paper-Conference.pdf)

Recent work sharpens the effective-independence problem further:

- Thirty densely interacting agents produced no more answer diversity than one on MMLU-Hard; among tested interventions, architectural heterogeneity—not communication topology—escaped the hard ceiling. [Ringelmann Effect](https://arxiv.org/abs/2606.02646)
- Polling at 25× inference cost did not reliably improve truthfulness because errors remained correlated, including across model families; raw self-reported confidence was not a useful weighting signal. [Consensus Is Not Verification](https://arxiv.org/abs/2603.06612)
- Positive results come from engineered asymmetry: diversity-aware candidate selection plus calibrated confidence beat vanilla debate and voting across six reasoning benchmarks, while distinct reasoning methods beat persona-only MAD in fewer rounds. [Demystifying MAD](https://aclanthology.org/2026.findings-acl.1694/), [DMAD](https://github.com/MraDonkey/DMAD)
- In heterogeneous three-model debates, the minority was correct in 25.5% of divergent cases. A non-LLM behavioral classifier achieved positive net gain; an LLM judge had negative net gain. [Minority Sentinel](https://arxiv.org/abs/2606.29270)

This exposes four gaps in the current mode contract. [`seat_diversity_patterns.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md) validates named lenses, not error independence. [`prompt_pack_round.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md) exposes seat identity and prior summaries. [`scoring_rubric.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md) lets the same deliberative context influence scoring. [`convergence_signals.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md) still treats two-of-three agreement as its primary signal.

Three concrete changes would make this a real council:

1. Add an `independence_batch` spanning sealed, CLI-local proposal rounds. Preserve the one-CLI-per-round invariant, but prohibit cross-round visibility until every initial proposal is committed. Record model family, reasoning method, evidence partition, tools, and historical error vector. Estimate:

   `N_eff = n² / Σᵢⱼρᵢⱼ`

   using task-family correctness correlations. A three-seat run with `N_eff < 2` should be labeled `ensemble_only` and routed to the cheaper single-model/self-consistency baseline. Semantic or phrasing diversity is only a cold-start proxy, never proof of independence.

2. Replace personas with accountable cognitive assignments. Give each proposer a distinct reasoning algorithm—causal graph, counterexample search, constraint proof, minimal-change construction—and a deliberately partitioned evidence view. Personas may style an answer; reasoning-method and evidence separation change what information can enter the pool.

3. Split deliberation from adjudication. Persist claims under anonymous IDs; strip model, provider, seat, confidence, and generation order before the first scoring pass. Critics may challenge claims but do not vote. The adjudicator may select or compose supported elements but cannot invent a new plan. Reveal only empirically calibrated confidence afterward. Re-run adjudication with shuffled order and identity labels; a changed verdict emits `adjudication_unstable`. Score the entire trajectory and preserve a structured minority appeal instead of aggregating only final votes. Response anonymization has already reduced measured identity distortion dramatically, and Free-MAD shows that trajectory scoring plus anti-conformity can outperform consensus-based debate in one round. [Identity-bias study](https://arxiv.org/abs/2510.07517), [Free-MAD](https://aclanthology.org/2026.findings-acl.1600/)

The unique-value thesis is therefore narrower—and stronger—than “several models are better than one.” `deep-ai-council` should own decisions where multiple defensible plans optimize different objectives and no single verifier or named standard resolves the trade-off. `deep-research` gathers evidence; `deep-review` finds defects; `deep-alignment` checks a declared authority. The council uniquely preserves independently grounded disagreement, exposes the decision’s cruxes, composes compatible plan fragments, and returns typed residual disagreement—factual uncertainty, objective trade-off, hard veto, or irreducible value choice. If it cannot demonstrate independence, it should refuse the council label.

```json
{
  "new_repos": [
    {
      "name": "deeplearning-wisc/MAD-identity-bias",
      "url": "https://github.com/deeplearning-wisc/MAD-identity-bias",
      "stars": "~0",
      "what": "New official ACL 2026 Oral code with vanilla/anonymized runs, JSONL histories, and IBC computation in debate/metrics.py.",
      "lesson": "Blind response provenance and measure conformity-versus-obstinacy instead of assuming named seats deliberate impartially.",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "Multi-Agent-LLMs/mallm",
      "url": "https://github.com/Multi-Agent-LLMs/mallm",
      "stars": "~62",
      "what": "Separates mallm/agents, mallm/discourse_policy, and mallm/decision_protocol; latest release v1.0.6 was June 15, 2026.",
      "lesson": "Make voting, consensus, judge, report, relay, and debate policies independently selectable and benchmarkable rather than coupling deliberation to two-of-three convergence.",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "lkaesberg/decision-protocols",
      "url": "https://github.com/lkaesberg/decision-protocols",
      "stars": "~7",
      "what": "Controlled ACL 2025 experiment configurations isolate decision protocol and independent-drafting effects using MALLM.",
      "lesson": "Select aggregation by task class: voting was stronger for reasoning, consensus for knowledge, while independent drafting improved answer diversity.",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "MraDonkey/DMAD",
      "url": "https://github.com/MraDonkey/DMAD",
      "stars": "~25",
      "what": "ICLR 2025 implementation uses main_DMAD.py, prompt.py, reasoning.py, and record.py to assign distinct reasoning strategies.",
      "lesson": "Diversify cognitive procedures such as IO, compositional CoT, and duty-distinct CoT; persona labels alone do not break a shared mental set.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Debate communication has no inherent positive drift: without a mechanism favoring independently supported correct signals, its expected gain can collapse to ordinary voting or stochastic re-evaluation.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2025/file/934252acd87f254d5d4672fbde283bd2-Paper-Conference.pdf",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Effective seat count should be estimated from historical error correlation; architectural heterogeneity changes the scaling regime, while extra dense communication can destroy answer diversity.",
      "evidence": "https://arxiv.org/abs/2606.02646",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "med"
    },
    {
      "insight": "Reasoning-method diversity is more load-bearing than persona diversity: seats need different algorithms or evidence partitions, not merely Analyst, Critic, and Pragmatist labels.",
      "evidence": "https://github.com/MraDonkey/DMAD",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Identity cues create measurable sycophancy and self-bias that accumulate across rounds; anonymized claim exchange and counterbalanced adjudication convert authority-sensitive debate into content-sensitive evaluation.",
      "evidence": "https://arxiv.org/abs/2510.07517",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Minority disagreement is an information channel, not convergence noise: debate dynamics can identify when a correlated majority suppressed the correct alternative, but an LLM judge may share the majority's blind spot.",
      "evidence": "https://arxiv.org/abs/2606.29270",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an independence_batch contract: seal first proposals across CLI-local rounds, persist model-family/reasoning-method/evidence-partition metadata, estimate task-conditioned pairwise error correlations, compute effective_seats, and downgrade runs below an initial N_eff=2 moat floor to ensemble_only.",
      "target": "deep-ai-council/runtime-gauges-observability",
      "rationale": "Nominal seat count is not evidence count; the gate prevents correlated replicas from receiving council authority or budget.",
      "uniqueness": "This makes demonstrated independent judgment—not multi-agent theater—the admission criterion separating the council from self-consistency sampling.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2606.02646"
    },
    {
      "rec": "Replace lens-only selection with a sealed diversity auction that chooses seats for marginal reasoning-method, evidence-community, model-family, and tool-surface coverage; preserve the one-CLI-per-round rule by linking isolated rounds under one independence_batch_id.",
      "target": "deep-ai-council/runtime-fan-out-fan-in",
      "rationale": "Distinct cognitive procedures and evidence access create complementary hypotheses; role prose and temperature variation frequently do not.",
      "uniqueness": "A single model can imitate personas, but it cannot honestly reproduce independent model lineages, disjoint evidence acquisition, and separate tool-derived observations.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/MraDonkey/DMAD ; https://aclanthology.org/2026.findings-acl.1694/"
    },
    {
      "rec": "Introduce blinded trajectory adjudication: anonymous claim IDs, shuffled dual-pass presentation, proposer/critic/verifier/adjudicator separation, content-only scoring before calibrated-confidence reveal, and a minority-sentinel branch that emits factual_uncertainty, objective_tradeoff, hard_veto, or value_disagreement instead of forced consensus.",
      "target": "deep-ai-council/runtime-convergence",
      "rationale": "Identity bias, final-round voting, and correlated LLM judges can erase correct minorities; trajectory evidence and orthogonal verification preserve them.",
      "uniqueness": "This turns the mode into an auditable pluralist decision institution capable of preserving and adjudicating legitimate disagreement—work neither a single answer nor the other deep modes perform.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2510.07517 ; https://arxiv.org/abs/2606.29270 ; https://aclanthology.org/2026.findings-acl.1600/"
    }
  ],
  "contradictions": [
    {
      "claim": "Confidence-modulated debate can beat vanilla debate and majority voting when confidence is explicitly calibrated.",
      "counter": "Raw self-reported confidence weighting produced no benefit for truthfulness, and controlled debate studies found confidence visibility secondary to reasoning strength and diversity; therefore confidence must remain hidden unless calibration is measured out of sample.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1694/ ; https://arxiv.org/abs/2603.06612 ; https://arxiv.org/abs/2511.07784"
    },
    {
      "claim": "Additional debate rounds should improve plans through iterative correction.",
      "counter": "Longer interaction can accumulate identity bias, reduce independent drafting diversity, and degrade performance; round continuation should require verified new evidence or resolved cruxes rather than movement toward agreement.",
      "evidence": "https://arxiv.org/abs/2510.07517 ; https://arxiv.org/abs/2502.19130 ; https://aclanthology.org/2026.findings-acl.1600/"
    }
  ],
  "next_angles": [
    "Build a task-conditioned independence calibration set for architecture planning, refactors, research synthesis, and governance decisions; compare error-correlation N_eff against semantic-diversity proxies.",
    "Design the anonymous claim-graph schema and test verdict invariance under seat-label permutation, order reversal, confidence masking, and provider-name reveal.",
    "Benchmark independence batches against equal-token single-strong-model, self-consistency, majority-vote, and verifier-guided best-of-N baselines; require council-specific marginal value.",
    "Train a packet-local minority sentinel from stance changes, novel-evidence introductions, rebuttal survival, verifier outcomes, and leave-one-seat-out verdict changes."
  ],
  "notes": "The strongest positive evidence remains concentrated in benchmark QA with external ground truth; open-ended architecture and planning lack comparable oracle labels. Effective-seat thresholds therefore need risk- and task-conditioned calibration. The newest Minority Sentinel and Ringelmann results are recent preprints/workshop work, so their exact effect sizes should be independently reproduced before becoming hard defaults."
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
session id: 019f64fc-9fa3-7432-8c1c-a026fbf4b40e
--------
user
You are iteration 12/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-ai-council
MODE IDENTITY (what it does today): AI Council: multi-seat diverse-lens planning/deliberation, multi-round critique, convergence checks, packet-local artifacts, council test gate.
GENERIC ALTERNATIVE it must out-value: a single strong model, or self-consistency sampling of one model

THIS ITERATION'S ANGLE (A2-moat): deep-ai-council :: unique value / moat
DIRECTIVE: What makes a multi-SEAT diverse-lens deliberating council uniquely valuable versus one strong model or self-consistency sampling — given the effective-independence problem (9 correlated seats can equal ~2 real votes)? Find evidence on when councils actually beat a single model. Propose concrete ways to SHARPEN the moat: genuine seat diversity, role separation, blinded adjudication, effective-independence gating. This is the operator's most-valued mode — go deep.

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
THIS run's new repos so far (41) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate
Modes covered so far this run: deep-research | deep-review | deep-ai-council
New insights so far: 44; recommendations: 30.
Open threads flagged: Evaluate semantic-anchor survival across rebases, symbol moves, generated-code changes, and partial fix commits; measure false finding closure and duplicate resurrection. | Learn a language- and risk-specific verifier escalation policy from historical obligation outcomes, including verifier setup failures and time-to-counterexample. | Benchmark evidence-partition strategies for council seats: BM25 round-robin, semantic communities, contradiction clusters, causal graphs, and adversarially withheld evidence. | Measure seat marginal value with leave-one-seat-out and Shapley-style verdict influence, separating useful independence from theatrical role diversity. | Design a pluralist aggregation contract that distinguishes factual uncertainty, objective trade-offs, constitutional vetoes, and irreducible value disagreement. | Test anti-persuasion controls: anonymous claims, authority-label randomization, confidence masking, order swaps, and minority-evidence survival across rounds.

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
This is read-only mode research, so no spec-folder write path applies. I’m checking the iteration’s prior-context triggers and routing first, then I’ll test the council moat against empirical debate/diversity results rather than treating “more agents” as evidence.
exec
/bin/zsh -lc 'python3 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "iteration 12 deep-ai-council unique value moat research effective independence multi-seat deliberation" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 2161ms:
2026-07-15 10:55:29.479 xcodebuild[64674:207079830]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 10:55:29.677 xcodebuild[64674:207079829] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-KxLu6xjZ' (errno=Operation not permitted)
2026-07-15 10:55:30.135 xcodebuild[64692:207079903]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 10:55:30.247 xcodebuild[64692:207079902] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
Native advisor unavailable (None; freshness=unavailable); falling back to local Python scorer.
Skill graph: loaded from SQLite
[
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep-ai-council(keyword), !deep-ai-council(signal), council, deep(name), research [Candidate-3 deep routing: system-deep-loop ai-council HIGH]",
    "_graph_boost_count": 0,
    "mode": "ai-council",
    "workflowMode": "ai-council",
    "source": "local"
  }
]

codex
SKILL ROUTING: `system-deep-loop` → `ai-council` (0.95). The advisor’s native path was unavailable and its local scorer supplied the route; I’m loading that mode contract before using the web so this iteration stays inside the council workflow.
exec
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     154 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
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
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     491 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/mode-registry.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
{
  "skill": "system-deep-loop",
  "version": "2.0.0.0",
  "description": "Declarative mode registry: the single source of truth for the three-tier discriminator (workflowMode/runtimeLoopType/backendKind) PLUS the advisorRouting projection. The advisor keeps its hardcoded projection maps (Python DEEP_ROUTING_MODE_BY_KEY, TypeScript DEEP_MODE_BY_CANONICAL) in sync with this registry via a CI drift-guard test (maps == registry projection); the advisor does NOT read this file at runtime, which avoids cross-skill import coupling on the advisor hot path.",
  "discriminator": {
    "workflowMode": "Public command/advisor/mode key. Stable identity used in commands, advisor aliases, and this registry. Carried by every mode.",
    "runtimeLoopType": "The graph-backed convergence loop key consumed by runtime/scripts/convergence.cjs. Validated against exactly research|review|council. Explicit null for improvement-host and external-adapter modes; NEVER inferred from workflowMode.",
    "backendKind": "Which backend actually runs the mode: runtime-loop-type (runtime/ convergence), improvement-host (deep-improvement/scripts/shared/loop-host.cjs --mode), or external-adapter (loop owned by external packaging)."
  },
  "advisorRoutingContract": {
    "routingClass": "How the advisor finds the mode. 'lexical' = weighted-regex scoring in skill_advisor.py AND present in both projection maps. 'alias-fold' = TS DEEP_MODE_BY_CANONICAL only (alias projection, not lexically scored). 'metadata' = resolved by skill membership; no advisor map entry. 'command-bridge' = routed by its /deep:* command, not an advisor map entry.",
    "legacyAdvisorId": "The legacy deep-* skill id the projection maps key on (present for lexical + alias-fold modes only).",
    "advisorDefaultMode": "Marks the default mode a multi-mode legacy id folds to (deep-improvement -> agent-improvement). Never inferred from array order.",
    "legacyAliases": "The TypeScript scorer alias set (aliases.ts SKILL_ALIAS_GROUPS[legacyAdvisorId]) the merged-identity layer keys on; the drift-guard asserts these match it order-insensitive. The Python deep-router uses its own alias set + regex patterns by design (same keys, different values), so the guard only cross-checks that each legacyAdvisorId key also exists in the Python SKILL_ALIAS_GROUPS.",
    "packetSkillName": "The packet's SKILL.md name. Most packets use folder == packetSkillName == deep-<mode> (e.g. deep-ai-council). The three improvement lanes (agent/skill/model) multiplex onto one shared packet 'deep-improvement'. The legacy public key 'ai-council' is preserved only on the command/agent surfaces, not on the packet folder/name.",
    "driftGuard": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
  },
  "extensions": {
    "runtime-loop": {
      "description": "Declares the runtime-loop backend: modes with backendKind 'runtime-loop-type' converge over runtime/, keyed by runtimeLoopType (research|review|council). runtimeLoopType is explicit null for improvement-host and external-adapter modes and is never inferred from workflowMode.",
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
/bin/zsh -lc "sed -n '1,180p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
name: deep-ai-council
description: "AI Council: multi-seat planning, artifact persistence, convergence checks, packet-local ai-council outputs."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 2.4.0.0
---

<!-- Keywords: deep-ai-council, ai council, council deliberation, multi-seat planning, ai-council artifacts, council convergence, planning council, council artifact persistence -->

# AI Council

Planning-only council deliberation with diverse seats, convergence checks, and packet-local `ai-council/**` artifact persistence.

> Convergence threshold semantics: see [`references/convergence/convergence_signals.md`](references/convergence/convergence_signals.md). Deep Mode (iterative multi-topic): see [`references/convergence/depth_dispatch.md`](references/convergence/depth_dispatch.md).

---

## 1. OPERATIONAL MODES — IN-CLI (PRIMARY) + EXTERNAL-CLI (SECONDARY)

The council is **primarily an IN-CLI capability**. When invoked from inside an active runtime (OpenCode, Claude Code, OpenCode), the council deliberates using THAT runtime's own models and reasoning lenses as seats. No external dispatch is required for the common case — the active CLI's own model bench (e.g. Opus + Sonnet + Haiku on Claude Code; gpt-5.5 + gpt-5.5-pro + gpt-5.5-xhigh on OpenCode; direct DeepSeek, Xiaomi, and OpenAI provider models on OpenCode) supplies the seat diversity for a round.

**External-CLI dispatch is a SECONDARY, optional mode** for cases where a different AI vantage adds value (e.g. a fresh OpenCode perspective from inside a Claude Code session, or DeepSeek/Kimi via cli-opencode from inside another runtime). It is invoked via the `cli-*` skill family (`cli-claude-code`, `cli-opencode`) — never directly from this skill.

**Both modes obey the one-CLI-per-round invariant** (§5 ALWAYS rule 6):
- In-CLI round: all seats use the current runtime's models.
- External-CLI round: all seats use ONE external CLI (e.g. all `cli-claude-code` seats with different reasoning levels, OR all `cli-opencode` seats with different direct-provider models).
- Cross-CLI deliberation is staged as MULTIPLE rounds (one in-CLI + one external, or two different externals) — never folded into the same round.

The default and most common council run is a single in-CLI round. Add external rounds only when the active runtime cannot supply the required vantage or when explicit cross-AI validation is requested.

---

## 2. WHEN TO USE

### Activation Triggers

Use this skill when a request needs:

- Multi-seat AI council deliberation before a plan is chosen.
- Comparison of implementation, refactor, architecture, or research strategies.
- Packet-local persistence of council reports, state, seats, deliberations, and rollback evidence.
- Recovery, audit, or completion checks for existing council artifacts.

### Use Cases

### Council Planning

- Compare two or more implementation plans.
- Ask multiple reasoning lenses to critique a proposed direction.
- Decide whether a plan has enough agreement to proceed.

### Artifact Persistence

- Persist a captured council report into packet-local artifacts.
- Verify append-only state records and final `council_complete` events.
- Preserve failed rounds for forensic inspection.

### Recovery And Audit

- Inspect incomplete council output.
- Check convergence decisions against the two-of-three rule.
- Validate planning-only boundaries before handoff to implementation agents.

### When NOT to Use

Do not use this skill for:

- Direct implementation work, code edits, or spec-doc authorship outside council artifacts.
- Treating council graph rows as source-of-truth or replacing packet-local `ai-council/**` artifacts.
- Single-answer planning where no meaningful strategic disagreement is needed.
- Claims that external AI systems participated when they did not actually run.

### Keyword Triggers

- deep-ai-council
- ai council
- council deliberation
- multi-seat planning
- planning council
- council artifacts
- council convergence
- council graph
- packet-local ai-council

---

## 3. SMART ROUTING

### Primary Detection Signal

```bash
request_text="$(printf '%s' "$USER_REQUEST" | tr '[:upper:]' '[:lower:]')"
case "$request_text" in
  *"deep ai council"*|*"ai council"*|*"council deliberation"*|*"planning council"*) COUNCIL_INTENT=1 ;;
  *"persist council"*|*"ai-council artifact"*|*"council_complete"*) COUNCIL_INTENT=1 ;;
  *) COUNCIL_INTENT=0 ;;
esac
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect council intent, packet persistence intent, recovery/audit intent, or convergence intent
    +- STEP 1: Score intents and keep top-2 when ambiguity is small
    +- Phase 1: Dispatch or simulate diverse council seats
    +- Phase 2: Deliberate, critique, and test convergence
    +- Phase 3: Persist artifacts, verify state, and hand off planning result
```

### Resource Domains

The router discovers markdown resources recursively from `references/`, `assets/`, and `manual_testing_playbook/`, then applies intent scoring from `INTENT_MODEL`.

```text
references/*.md
assets/*.md
manual_testing_playbook/**/*.md
```

- `references/` contains the quick reference, loop protocol, council state, folder layout, seat diversity, output schema, convergence signals, and caller wiring.
- `assets/` contains council config, round strategy, dashboard, prompt-pack, and runtime capability templates. Markdown assets are routable; JSON/TMPL assets are operator/runtime inputs.
- `manual_testing_playbook/` contains operator validation scenarios for routing, deliberation, persistence, convergence, rollback, scope boundaries, council-graph integration, and council-graph value comparison (32 scenarios across 9 categories).
- `feature_catalog/` mirrors the playbook 1:1 with one user-facing feature entry per scenario (32 entries) — start here for "what does DAC-NNN actually do" lookups.
- `scripts/` contains deterministic helpers; scripts are invoked explicitly and are not markdown-routed. Notable entries: `persist-artifacts.cjs` (artifact writer CLI), `replay-graph-from-artifacts.cjs` (DAC-025 derived-projection rebuild — reads `ai-council-state.jsonl` and writes through `runtime//scripts/upsert.cjs --loop-type council`, with `--dry-run` for payload inspection).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/integration/quick_reference.md` |
| CONDITIONAL | Intent signals match | Intent-mapped references from `RESOURCE_MAP` |
| ON_DEMAND | Explicit validation or operator testing | `manual_testing_playbook/manual_testing_playbook.md` and scenario files |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets", SKILL_ROOT / "manual_testing_playbook")
DEFAULT_RESOURCE = "references/integration/quick_reference.md"

INTENT_MODEL = {
    "COUNCIL_RUN": {"keywords": [("deep ai council", 5), ("council deliberation", 5), ("planning council", 4), ("strategy comparison", 3)]},
    "COUNCIL_SETUP": {"keywords": [("quick reference", 3), ("loop protocol", 4), ("council setup", 4), ("round strategy", 4), ("council dashboard", 3)]},
    "ARTIFACT_PERSISTENCE": {"keywords": [("persist council", 5), ("ai-council artifact", 5), ("council report parser", 4), ("state jsonl", 3)]},
    "RECOVERY_OR_AUDIT": {"keywords": [("rollback", 4), ("audit", 3), ("missing council_complete", 5), ("completion advisory", 4)]},
    "CONVERGENCE_CHECK": {"keywords": [("convergence", 4), ("two-of-three", 5), ("max rounds", 3), ("non-converged", 4)]},
    "SCORING": {"keywords": [("scoring rubric", 5), ("five-dimension", 5), ("hunter skeptic referee", 5), ("comparison table", 4)]},
    "DEPTH_DISPATCH": {"keywords": [("depth 0", 5), ("depth 1", 5), ("parallel dispatch", 4), ("sequential thinking", 4), ("ndp compliant", 4)]},
    "FAILURE_HANDLING": {"keywords": [("seat timeout", 5), ("all seats fail", 5), ("contradiction without resolution", 4), ("insufficient vantage", 4)]},
    "ANTI_PATTERNS": {"keywords": [("anti-pattern", 5), ("convergence sycophancy", 5), ("fake consensus", 4), ("recursive council", 4)]},
    "GRAPH_SUPPORT": {"keywords": [("council graph", 5), ("graph support", 4), ("derived graph", 5), ("council_graph", 5)]},
}

RESOURCE_MAP = {
    "COUNCIL_RUN": ["references/integration/loop_protocol.md", "references/patterns/seat_diversity_patterns.md", "references/convergence/convergence_signals.md", "references/structure/output_schema.md", "assets/deep_ai_council_strategy.md", "assets/prompt_pack_round.md"],
    "COUNCIL_SETUP": ["references/integration/quick_reference.md", "references/integration/loop_protocol.md", "assets/deep_ai_council_strategy.md", "assets/deep_ai_council_dashboard.md"],
    "ARTIFACT_PERSISTENCE": ["references/structure/folder_layout.md", "references/structure/output_schema.md", "references/structure/state_format.md", "references/patterns/command_wiring.md", "references/scoring/findings_registry.md", "assets/deep_ai_council_dashboard.md"],
    "RECOVERY_OR_AUDIT": ["references/structure/state_format.md", "references/structure/folder_layout.md", "references/patterns/command_wiring.md", "references/integration/loop_protocol.md"],
    "CONVERGENCE_CHECK": ["references/convergence/convergence_signals.md", "references/patterns/seat_diversity_patterns.md", "references/structure/state_format.md", "references/integration/loop_protocol.md"],
    "SCORING": ["references/scoring/scoring_rubric.md"],
    "DEPTH_DISPATCH": ["references/convergence/depth_dispatch.md", "references/convergence/deep_mode.md", "references/scoring/findings_registry.md"],
    "FAILURE_HANDLING": ["references/convergence/failure_handling.md"],
    "ANTI_PATTERNS": ["references/patterns/anti_patterns.md"],
    "GRAPH_SUPPORT": ["references/integration/graph_support.md", "references/structure/state_format.md", "references/structure/folder_layout.md"],
}

LOAD_LEVELS = {
    "COUNCIL_RUN": "CONDITIONAL",
    "COUNCIL_SETUP": "CONDITIONAL",
    "ARTIFACT_PERSISTENCE": "CONDITIONAL",
    "RECOVERY_OR_AUDIT": "CONDITIONAL",
    "CONVERGENCE_CHECK": "CONDITIONAL",
    "SCORING": "CONDITIONAL",
    "DEPTH_DISPATCH": "CONDITIONAL",
    "FAILURE_HANDLING": "CONDITIONAL",
    "ANTI_PATTERNS": "CONDITIONAL",

exec
/bin/zsh -lc "sed -n '181,360p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
    "GRAPH_SUPPORT": "CONDITIONAL",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is council setup, planning, persistence, recovery, or convergence checking",
    "Confirm the packet/spec folder for any artifact persistence",
    "Confirm whether external AI vantages actually ran or must be labeled simulated",
    "Confirm the planning-only handoff target before implementation starts",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def classify_intents(user_request, task=None):
    text = " ".join([str(user_request or ""), str(getattr(task, "intent", "") or "")]).lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, config in INTENT_MODEL.items():
        for keyword, weight in config["keywords"]:
            if keyword in text:
                scores[intent] += weight
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("COUNCIL_RUN", None, scores)
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().upper()
    if override in RESOURCE_MAP:
        return override
    intent = str(getattr(task, "intent", "")).strip().upper()
    if intent in RESOURCE_MAP:
        return intent
    return intents[0] if intents else "UNKNOWN"

def route_sk_ai_council_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    keyed_prefixes = [f"references/{routing_key.lower()}/", f"assets/{routing_key.lower()}/", f"manual_testing_playbook/{routing_key.lower()}/"]
    keyed_docs = sorted(path for path in inventory if any(path.startswith(prefix) for prefix in keyed_prefixes))
    for relative_path in keyed_docs:
        load_if_available(relative_path)

    if routing_key not in RESOURCE_MAP and not keyed_docs:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "notice": f"No knowledge base found for routing key '{routing_key}'",
            "resources": loaded,
        }

    return {
        "routing_key": routing_key,
        "intents": intents,
        "intent_scores": scores,
        "load_level": LOAD_LEVELS.get(routing_key, "CONDITIONAL"),
        "resources": loaded,
    }
```

---

## 4. HOW IT WORKS

### Council Workflow Overview

The skill guides planning-only council runs from packet resolution through deliberation, persistence, and handoff. It keeps council artifacts under `ai-council/**` and leaves implementation to the caller or implementation agents.

**Process Flow**:

```text
STEP 1: Resolve And Prepare
       |-- Resolve target spec folder before any persistence
       |-- Load packet context and needed evidence
       |-- Select 2-3 distinct seats
       v
STEP 2: Deliberate And Converge
       |-- Run independent proposals
       |-- Run adversarial cross-seat critique
       |-- Apply two-of-three convergence or emit non-converged status
       v
STEP 3: Persist And Hand Off
       |-- Produce required report sections
       |-- Persist packet-local artifacts when caller has write context
       |-- Verify completion and hand planning to implementation agents
```

### Six-Step Operational Flow

1. Resolve the target spec folder before any council execution.
2. Select two or three distinct council seats with different reasoning lenses and, when real executors are available, different AI vantage targets.
3. Deliberate across independent proposals, adversarial critique, and convergence reconciliation.
4. Return a council report with required sections from `references/structure/output_schema.md`.
5. Persist packet-local artifacts with `scripts/persist-artifacts.cjs` when the caller owns a write-capable context.
6. Verify completion with `scripts/advise-council-completion.cjs` and the append-only state rules in `references/structure/state_format.md`.

### Resource Usage Pattern

**Scripts**:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

**References**: load `quick_reference.md` first, then intent-specific references through Section 3. Load `output_schema.md` before persistence or report validation.

**Manual testing**: load `manual_testing_playbook/manual_testing_playbook.md` only for operator validation and release checks.

---

## 5. RULES

### ✅ ALWAYS

1. **ALWAYS keep council writes scoped to packet-local `ai-council/**` artifacts**
   - This preserves the planning-only boundary and avoids mutating implementation or spec-doc surfaces.

2. **ALWAYS preserve the planning-only boundary**
   - Implementation remains with implementation agents, commands, or the top-level caller after handoff.

3. **ALWAYS use distinct strategy lenses**
   - Label simulated vantages honestly when an external AI system did not actually run.

4. **ALWAYS append a `council_complete` event for completed persisted runs**
   - State is append-only and completion must be auditable.

5. **ALWAYS treat council graph support as a derived projection**
   - The graph is rebuilt from packet-local `ai-council/**` artifacts and must not replace append-only council state.

6. **ALWAYS run a single CLI per round (one-CLI-per-round invariant)**
   - All seats within ONE deliberation round MUST be dispatched through the SAME CLI executor (e.g. all seats from `cli-claude-code`, OR all seats from `cli-opencode`, OR all seats from `cli-opencode`). Seat diversity WITHIN a round comes from different models/reasoning lenses on the same CLI (e.g. `deepseek/deepseek-v4-pro --variant high` + `xiaomi/mimo-v2.5-pro`).
   - Mixing executors within one round (e.g. one seat via OpenCode + one seat via OpenCode + one seat via Claude Code) is FORBIDDEN — it conflates orchestration boundaries, complicates rollback, and produces noisy convergence signals because per-CLI guarantees (sandbox, runtime, tool surface, output schema) differ.
   - When MULTIPLE CLIs are appropriate for a deliberation, each additional CLI is a NEW DEDICATED ROUND with its own state event, its own seats, and its own convergence pass — never folded into the same round.


exec
/bin/zsh -lc "sed -n '361,560p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
### ⛔ NEVER

1. **NEVER write application code, authored spec docs, or files outside `ai-council/**` as part of a council run**
   - The council recommends; it does not implement.

2. **NEVER add backward-compatible old-name shims without concrete active-consumer evidence**
   - Rename support should follow real consumers, not speculation.

3. **NEVER claim an external CLI or AI system participated unless it actually ran**
   - Simulated perspectives must be explicitly labeled.

4. **NEVER rewrite historical state rows**
   - State evolution is additive-only; append new events instead.

5. **NEVER mix CLI executors across seats within a single round**
   - See ALWAYS rule 6. A round is defined by its CLI; a CLI change is a round boundary, not a seat boundary.

### ⚠️ ESCALATE IF

1. **ESCALATE IF no packet/spec folder can be resolved for artifact persistence**
   - Ask for the destination before dispatching seats or writing artifacts.

2. **ESCALATE IF required report sections are missing and persistence would be lossy**
   - Fix the report or fail before writes.

3. **ESCALATE IF a caller still depends on the old `ai-council` runtime name and cannot be renamed**
   - Compatibility requires explicit user direction.

4. **ESCALATE IF a caller asks the council agent itself to mutate graph storage**
   - Graph updates belong to caller-owned `runtime/` CLI reducers, not seat deliberation.

---

## 6. REFERENCES AND RELATED RESOURCES

Ordered by load priority — most-loaded intent first.

- `references/integration/quick_reference.md` - first-touch operator cheat sheet and validation commands (ALWAYS-loaded default).
- `references/integration/loop_protocol.md` - end-to-end council workflow from packet resolution to persistence and recovery.
- `references/structure/output_schema.md` - markdown report contract parsed by the persistence helper.
- `references/scoring/scoring_rubric.md` - five-dimension scoring, adversarial critique, conflict resolution, and attribution rules.
- `references/convergence/depth_dispatch.md` - Depth 0 parallel dispatch and Depth 1 sequential inline dispatch rules.
- `references/convergence/failure_handling.md` - timeout, all-seat failure, contradiction, insufficient vantage, and rollback-state guidance.
- `references/patterns/anti_patterns.md` - council quality failure modes, detection cues, and recovery actions.
- `references/structure/folder_layout.md` - packet-local artifact tree and writer ownership.
- `references/structure/state_format.md` - append-only JSONL event semantics.
- `references/patterns/command_wiring.md` - caller-owned post-dispatch persistence patterns.
- `references/patterns/seat_diversity_patterns.md` - seat lens and vantage diversity rules.
- `references/convergence/convergence_signals.md` - convergence and escape-hatch rules.
- `references/integration/graph_support.md` - derived council graph boundaries, tool surface, and recovery behavior.
- `references/convergence/deep_mode.md` - deep-mode session/topic/round hierarchy, state files, cost guards and the runtime/ dependency.
- `references/scoring/findings_registry.md` - cross-topic findings registry, fingerprint dedup and filesystem locking.
- `assets/deep_ai_council_strategy.md` - operator-maintained round strategy template.
- `assets/deep_ai_council_dashboard.md` - council status dashboard template.
- `assets/deep_ai_council_config.json` - run-config template for council sessions.
- `assets/prompt_pack_round.md` - council seat prompt-pack template.
- `assets/runtime_capabilities.json` - runtime parity and validation matrix.
- `manual_testing_playbook/manual_testing_playbook.md` - operator validation scenarios.
- `README.md` - human-facing overview.

Related skills: `deep-research` for evidence-first investigation vantages and `system-spec-kit` for packet documentation, validation, resume, and memory continuity.

---

## 7. SUCCESS CRITERIA

### Council Skill Completion Checklist

Council alignment is complete when:

- ✅ Council requests route to the `deep-ai-council` advisor/packet surface (`packetSkillName` and `legacyAdvisorId` in `mode-registry.json`); `deep-ai-council` is the packet folder/SKILL.md name (folder == name), while the dispatched agent identity remains `ai-council`.
- ✅ Runtime mirrors dispatch `@ai-council` (`mode: subagent`, Task-dispatch only) under a consistent agent identity — both agent files (`.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`) declare `name: ai-council`, matching the registry `agent: ai-council` field.
- ✅ Council references and scripts live inside this skill package.
- ✅ Persisted artifacts and append-only state stay under packet-local `ai-council/**`.
- ✅ Persistence helpers parse and write the existing council artifact contract while graph support remains a derived projection.

### Quality Targets

- **Structure**: SKILL.md follows sk-doc required section order and frontmatter.
- **Routing**: Section 3 is the only authoritative routing source.
- **Reference shape**: reference filenames are snake_case and intro sections are short.
- **Playbook coverage**: manual testing package has 32 scenarios across 9 categories.
- **Boundary discipline**: graph rows never replace `ai-council/**` artifacts and council seats do not mutate graph storage directly.

### Validation Success

- ✅ `quick_validate.py` accepts the skill package.
- ✅ The skill's packet spec docs pass `validate.sh --strict`.
- ✅ Old kebab-case reference links are absent from live callers.

---

## 8. INTEGRATION POINTS

### Validation Workflow Integration

Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` before completion claims when spec docs are updated. Skill package structure is checked with `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/system-deep-loop/deep-ai-council`.

### Cross-Workflow Contracts

The council is a planning LEAF. It hands recommendations, risk analysis, and packet-local artifacts to implementation agents or the top-level caller; it does not perform application-code or spec-doc mutations.

### Tool Usage

- `Read`, `Glob`, and `Grep` gather evidence and verify paths.
- `Write` and `Edit` are allowed only for the planning LEAF's packet-local `ai-council/**` artifacts.
- `Bash` is for caller-owned helper invocation and validation, not for seat implementation.

### Knowledge Base Dependencies

**Required**:

- `references/structure/output_schema.md` - parser and report requiredness contract; persistence must fail closed if missing.

**Optional**:

- `references/patterns/command_wiring.md` - caller post-dispatch examples.
- `references/convergence/convergence_signals.md` - convergence guidance.
- `references/scoring/scoring_rubric.md` - synthesis scoring and critique guidance.
- `references/convergence/depth_dispatch.md` - adaptive dispatch guidance.
- `references/convergence/failure_handling.md` - failure and rollback treatment.
- `references/patterns/anti_patterns.md` - quality anti-pattern detection and recovery.
- `references/integration/graph_support.md` - derived graph support and runtime/ CLI boundary.
- `references/structure/folder_layout.md` - artifact shape and rollback layout.
- `references/patterns/seat_diversity_patterns.md` - lens selection.
- `references/structure/state_format.md` - state event semantics.
- `manual_testing_playbook/manual_testing_playbook.md` - operator validation.

### External Tools

No external tools are required. External CLIs may contribute seats only when the caller actually runs them and labels the result accurately.

exec
/bin/zsh -lc 'wc -l /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/quick_reference.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti_patterns.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_strategy.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     113 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/quick_reference.md
     176 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md
     274 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md
      64 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md
     135 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md
     344 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md
     162 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti_patterns.md
      87 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_strategy.md
      57 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md
    1412 total

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Quick Reference"
description: "Operator cheat sheet for deep-ai-council planning runs, persistence, convergence checks, and validation commands."
trigger_phrases:
  - "deep ai council quick reference"
  - "ai council operator guide"
  - "council cheat sheet"
  - "council validation"
importance_tier: "normal"
contextType: "general"
version: 2.3.0.4
---

# AI Council Quick Reference

Use this page when you need the council shape, the artifact contract, and the validation path without reading the full protocol set.

---

## 1. OVERVIEW

Use `deep-ai-council` when a plan has meaningful strategic disagreement. The council compares options, forces cross-seat critique, records convergence state, and hands a planning result back to the caller.

Do not use it for implementation, single-answer lookup, or code review. Use `deep-research` for iterative investigation and `deep-review` for iterative code audit.

---

## 2. CORE FLOW

| Step | Operator Intent | Primary Resource |
|------|-----------------|------------------|
| Resolve | Pick the packet and planning boundary | `references/structure/folder_layout.md` |
| Seat | Select 2-3 distinct planning lenses | `references/patterns/seat_diversity_patterns.md` |
| Deliberate | Gather proposals and critique them | `references/scoring/scoring_rubric.md` |
| Converge | Apply two-of-three plus blocker checks | `references/convergence/convergence_signals.md` |
| Persist | Write packet-local artifacts from caller context | `references/structure/output_schema.md` |
| Verify | Confirm final state and graph projection boundaries | `references/structure/state_format.md`, `references/integration/graph_support.md` |

---

## 3. COMMANDS

Persist a captured council report:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> \
  --memory-save-payload-out <payload>
```

Check completion:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

Replay the derived graph projection from artifacts:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs <packet> --dry-run
```

---

## 4. ARTIFACTS

| Artifact | Owner | Purpose |
|----------|-------|---------|
| `ai-council-config.json` | Caller or orchestrator | Current run settings and round limits |
| `ai-council-state.jsonl` | Persistence helper | Append-only event log |
| `council-report.md` | Council output, caller persisted | Final planning report |
| `seats/round-NNN/*.md` | Persistence helper | Per-seat proposals |
| `deliberations/*.md` | Persistence helper | Cross-seat synthesis and critique notes |
| `failed/round-NNN-*` | Persistence helper | Preserved failed or superseded rounds |

The packet-local `ai-council/**` tree is authoritative. Derived graph rows are rebuildable support, not source of truth.

---

## 5. STOP AND ESCALATE

Escalate instead of persisting when any of these hold:

- No packet/spec folder is resolved.
- Required report sections from `references/structure/output_schema.md` are missing.
- A run claims external AI participation that did not actually happen.
- Seats disagree on a material blocker after the allowed round count.
- A caller asks the council itself to modify implementation files or graph storage.

---

## 6. VALIDATION

```bash
python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/system-deep-loop/deep-ai-council --json
```

For rewritten references or assets:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --type reference --blocking-only
python3 .opencode/skills/sk-doc/scripts/extract_structure.py <file>
```

---

## 7. RELATED RESOURCES

- `references/integration/loop_protocol.md` for the full council workflow.
- `references/structure/output_schema.md` for required report sections.
- `references/structure/state_format.md` for JSONL event semantics.
- `assets/deep_ai_council_strategy.md` for an operator-maintained round plan.
- `assets/deep_ai_council_dashboard.md` for status reporting.

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Loop Protocol"
description: "End-to-end protocol for deep-ai-council planning rounds, convergence, persistence, and recovery handoff."
trigger_phrases:
  - "ai council loop protocol"
  - "council workflow"
  - "council round protocol"
  - "council persistence flow"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.5
---

# AI Council Loop Protocol

This reference describes the council loop from packet resolution to persisted planning handoff. It is intentionally planning-only: implementation belongs to the caller or a separate implementation workflow.

---

## 1. OVERVIEW

The council loop has four phases:

1. Resolve the packet and run boundary.
2. Dispatch or simulate distinct seats within one CLI round.
3. Critique proposals and evaluate convergence.
4. Persist packet-local artifacts from caller context.

The council may run multiple rounds, but a single round never mixes CLI executors. A CLI change starts a new round.

---

## 2. PHASE 1: RESOLVE

Before any seat work:

- Resolve the target spec folder.
- Confirm the council is being used for planning, not implementation.
- Load the relevant packet context and any prior `ai-council/**` state.
- Choose whether the run is in-CLI or external-CLI.
- Set `max_rounds`, `seats_per_round`, and the convergence signal.

Required resources:

- `references/structure/folder_layout.md`
- `references/structure/output_schema.md`
- `assets/deep_ai_council_config.json`

Acceptance criteria: the caller can name the packet, the run mode, and the artifact directory before deliberation starts.

---

## 3. PHASE 2: SEAT

Seats need distinct reasoning mandates. Typical lenses are Analytical, Creative, Critical, Pragmatic, Holistic, and Research.

Each seat should produce:

- Recommendation.
- Trade-offs.
- Risks.
- Evidence or assumptions.
- Conditions that would change the recommendation.

When external CLIs are not actually invoked, label the perspective as simulated. Do not imply real external participation.

### 3.1 Per-seat stepwise liveness (GAP-32 / GAP-36)

Each seat is persisted STEPWISE as it returns — a single seat is written without
requiring the full report sections (Composition / Recommended Plan / Plan
Confidence), so one seat's dispatch never fails validation because the other
seats have not returned yet. The stepwise writer is
`persist-artifacts.cjs --seat` / `lib/persist-artifacts.cjs#persistSeatStepwise`,
which for every seat appends to `ai-council-state.jsonl` in this order:

1. `progress_record` with `status:"started"` (resets the watchdog timer).
2. The seat artifact write under `seats/{round}/{seat}.md` (emits its own
   `artifact_written` audit envelope).
3. `progress_record` with `status:"completed"`, carrying `progress_delta > 0`
   and `artifact_path` (the work-anchor required by the shared pair validator so
   a no-op heartbeat cannot mask a stall).

For **in-CLI** runs (STEP 2 simulating seats within one round), the host breaks
the round into per-seat sub-steps and calls the stepwise writer once per seat,
so the completed `progress_record` count equals `seats_per_round`. Each
sub-step is bounded by a started/completed pair, giving the watchdog a
per-seat liveness edge instead of one dark window for the whole round.

**Watchdog-only bounding (in-CLI fallback).** When the host genuinely cannot
emit a per-seat started/completed boundary in in-CLI mode (for example, a
single in-process seat pass that is indivisible), the run is bounded by the
watchdog alone: the no-progress window fires if no `progress_record` AND no
artifact `mtime` change occurs within the window. In that case the loop MUST
emit at least one work-anchored `progress_record` per round, and operators
treat the per-seat count contract as best-effort, not guaranteed. The
stepwise writer is the preferred path; watchdog-only bounding is the
documented fallback, never the default.

Required resources:

- `references/patterns/seat_diversity_patterns.md`
- `references/scoring/scoring_rubric.md`
- `assets/prompt_pack_round.md`
- `.opencode/skills/system-deep-loop/shared/progress/progress-record.cjs` (additive `progress_record` type + pair validator)

Acceptance criteria: every seat has a named lens, a distinct mandate, and enough evidence for critique; the completed `progress_record` count equals the number of seats persisted when the host uses the stepwise writer.

---

## 4. PHASE 3: CRITIQUE AND CONVERGE

Run cross-seat critique before declaring agreement. Hunter looks for hidden failure modes, Skeptic challenges evidence quality, and Referee checks whether objections materially change the plan.

Convergence requires:

- Two of three seats agree on the material recommendation.
- No new high-severity blocker survives critique.
- Disagreements are either resolved or explicitly carried into the handoff.
- Max-round escape produces `non-converged`, not fake consensus.

Required resources:

- `references/convergence/convergence_signals.md`
- `references/convergence/failure_handling.md`
- `references/patterns/anti_patterns.md`

Acceptance criteria: the report can explain both the chosen plan and the strongest rejected alternative.

---

## 5. PHASE 4: PERSIST AND HAND OFF

The caller, not the council seat, persists artifacts:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> --strict-output
```

Then verify completion:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

Required resources:

- `references/structure/output_schema.md`
- `references/structure/state_format.md`
- `references/patterns/command_wiring.md`
- `assets/deep_ai_council_dashboard.md`

Acceptance criteria: `ai-council-state.jsonl` contains a `council_complete` event — not necessarily the final line, since `artifact_written` audit events for the state log itself and each subsequent artifact write typically follow it (see `references/structure/state_format.md` §5.1) — the final report exists, and any failed rounds are preserved under `failed/`.

---

## 6. RECOVERY

Recovery starts from disk, not conversation memory:

1. Inspect `ai-council-state.jsonl`.
2. Check whether `council_complete` exists.
3. Compare report sections against `references/structure/output_schema.md`.
4. Preserve incomplete or failed round artifacts.
5. Re-run advisory or replay scripts only after the state shape is understood.

If the graph projection drifts, rebuild it from artifacts. Never edit graph rows as the canonical fix.

---

## 7. RELATED RESOURCES

- `references/integration/quick_reference.md` for the operator cheat sheet.
- `references/convergence/deep_mode.md` for session/topic/round hierarchy.
- `references/scoring/findings_registry.md` for cross-topic finding state.
- `references/integration/graph_support.md` for derived projection boundaries.

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Convergence Signals"
description: "Convergence rules and escape hatches for AI Council planning rounds."
trigger_phrases:
  - "deep-ai-council convergence"
  - "two of three agree"
  - "council escape hatches"
  - "council validator graduation"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.12
---

# AI Council Convergence Signals

This reference defines the lightweight v1 convergence signal and the conditions that prevent a council round from being called converged.

---

## 1. OVERVIEW

Use `two-of-three-agree` for v1. If 2 of 3 seats endorse essentially the same plan and cross-critique produces no new high-severity findings, declare convergence and write `council-report.md`.

Agreement means the seats align on the material plan: implementation order, core risks, dependencies, and acceptance criteria. They do not need identical wording.

---

## 2. ESCAPE HATCHES

`max_rounds` reached without convergence: emit `council_complete` with `convergence:false`, preserve the competing plans, and recommend a user decision.

All seats fail in a round: do not fabricate convergence. Report the failed round with each seat status and ask for reframing or more context.

Single-seat endorsement: insufficient diversity. Re-run with stronger contrarian framing or a different vantage mix before calling the plan converged.

---

## 3. WHY SIMPLE FOR V1

ADR-001 keeps the convention lightweight. Sophisticated convergence math is non-goal N1 because the packet needs auditable output persistence, not a deep-skill state machine.

---

## 4. VALIDATOR GRADUATION

State schema and convergence fields are convention-only for v1. If drift appears in real council artifacts, graduate to a typed validator in a follow-on packet.

Cross-references:
- Agent body: `.opencode/agents/ai-council.md` §16
- Decision context: local doctor command ADRs ADR-001 and ADR-003

---

## Convergence Threshold Semantics

**Default:** 0.20 (proposed) on adjudicator-verdict stability across rounds

**Semantic:** the deep-ai-council threshold scores per-topic Round-N -> Round-N+1 verdict deltas from the adjudicator. Lower = more rounds / higher stability threshold.

**NOT INTERCHANGEABLE with siblings:**
- `deep-review` uses 0.10 default on weighted P0/P1/P2 severity ratio
- `deep-research` uses 0.05 default on newInfoRatio (negative-knowledge emphasis)

Carrying threshold expectations across siblings will cause unexpected iteration counts. See this skill's changelog and decision records for the cross-sibling threshold research and parity invariants that confirm thresholds do not carry across siblings.

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Output Schema"
description: "Markdown contract for @deep-ai-council §8 OUTPUT FORMAT and the persist-artifacts.cjs parser."
trigger_phrases:
  - "deep-ai-council output schema"
  - "council output format"
  - "persist-artifacts parser contract"
importance_tier: "important"
contextType: "implementation"
version: 2.3.0.12
---

# AI Council Output Schema

Markdown contract for AI Council report sections and the persistence helper parser.

---

## 1. OVERVIEW

This document is the single source of truth for the `@deep-ai-council` §8 OUTPUT FORMAT. The agent body uses §8 to tell the planning LEAF what report to return; `.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs` uses this contract to parse that report and persist packet-local `ai-council/` artifacts.

The report remains markdown, not JSON. The helper accepts normal heading variation, extracts the strict-required sections, and degrades gracefully for optional narrative sections.

Cross-references:

- Agent body: `.opencode/agents/ai-council.md` §8 OUTPUT FORMAT and §16 Caller Persistence Protocol
- Runtime mirror: `.claude/agents/ai-council.md`
- Helper: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs`

---

## 2. REQUIREDNESS MATRIX

| Section name | Strict-required | Helper behavior on missing |
| --- | --- | --- |
| Council Composition | Y | `parseCouncilReport()` returns `ok:false`; CLI exits 1 before writes |
| Per-seat sections or composition-table seat rows | Y | `ok:false` when no `Seat N` headings and no composition rows exist |
| Recommended Plan | Y | `ok:false`; CLI exits 1 before writes |
| Plan Confidence | Y | `ok:false`; CLI exits 1 before writes |
| Task Classification | N | Preserved in `council-report.md`; not required for persistence |
| Strategy Comparison | N | Preserved in `council-report.md`; not required for persistence |
| Deliberation Notes | N | Rendered into deliberation artifact when present |
| Winning Strategy | N | Preserved in `council-report.md`; not required for persistence |
| Implementation Steps | N | Preserved in `council-report.md`; not required for persistence |
| Prerequisites | N | Preserved in `council-report.md`; not required for persistence |
| Cross-References | N | Rendered when present; placeholder or omitted per optional policy |
| Dropped Alternatives | N | Rendered when present; placeholder or omitted per optional policy |
| Risks & Mitigations | N | Rendered when present; placeholder or omitted per optional policy |
| Planning-Only Boundary | N | Preserved in `council-report.md`; callers still enforce planning-only permissions |

Strict-required means the helper must fail before writing any files. Optional means the helper can still produce a valid artifact tree.

---

## 3. HEADING ALIASES

The helper accepts ATX heading depth `##` through `######`. Numeric prefixes are ignored. These forms are equivalent:

| Canonical section | Accepted heading examples |
| --- | --- |
| Council Composition | `## Council Composition`, `### Council Composition`, `## 1. Council Composition`, `## §1 Council Composition` |
| Recommended Plan | `## Recommended Plan`, `### Recommended Plan`, `## 7. Recommended Plan` |
| Plan Confidence | `## Plan Confidence`, `### Plan Confidence`, `## 10. Plan Confidence` |
| Cross-References | `## Cross-References`, `## Cross References` |
| Dropped Alternatives | `## Dropped Alternatives` |
| Deliberation Notes | `## Deliberation Notes`, `## Deliberation Notes details` |
| Risks & Mitigations | `## Risks & Mitigations`, `## Risks and Mitigations`, `## Risks & Mitigations details` |

The helper normalizes case, heading marks, leading section numbers, repeated whitespace, and trailing punctuation.

---

## 4. SEAT SECTION FALLBACK CONTRACT

Preferred seat extraction uses one markdown heading per seat:

```markdown
### Seat 001 - Analytical / cli-opencode
...

### Seat 002 - Critical / cli-claude-code
...
```

Accepted variations:

- `### Seat 001 - Analytical / cli-opencode`
- `### Seat 1: Analytical / cli-opencode`
- `#### Seat-001 Analytical / cli-opencode`

When no per-seat headings exist, the helper falls back to rows in the Council Composition table. The table must include a `Seat` column and should include `Strategy Lens`, `AI Vantage Target`, `Distinct Mandate`, and `Confidence` columns.

Fallback row example:

```markdown
| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Analytical | cli-opencode | Check implementation sequence | 84 |
```

Fallback seats produce `seats/round-NNN/*.md` artifacts with a clear note that the per-seat body was derived from the composition table. This preserves artifact shape without pretending the report contained detailed seat prose.

---

## 5. OPTIONAL SECTION POLICY

Optional sections are advisory content, not parser blockers.

Default behavior:

- Missing optional sections write empty placeholder text where the artifact layout expects a subsection.
- `council-report.md` always preserves the original source report.
- `ai-council-state.jsonl` records `new_findings_count` from extra unknown headings, not optional-section presence.

With `--strict-output`:

- Missing optional sections are omitted from generated subfiles instead of filled with placeholders.
- Strict-required missing sections still fail before writes.

This policy keeps the helper tolerant of older reports while giving stricter callers a cleaner generated artifact set.

---

## 6. SCHEMA-CHANGE LOCKSTEP RULE

Changes to this schema require lockstep updates in the same commit:

1. Update this `output_schema.md` contract.
2. Update `@deep-ai-council` agent body §8 in all four runtime mirrors.
3. Update `.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs`.
4. Update fixtures and `ai-council-persist-artifacts.vitest.ts` when parser behavior changes.
5. Run the mirror parity test and helper fixture test.

Do not change one surface alone. Split-brain between §8 prose, parser behavior, and fixtures makes persisted council artifacts unreliable.

exec
/bin/zsh -lc "sed -n '1,340p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Seat Diversity Patterns"
description: "Lens combinations and vantage targets for diverse AI Council seats."
trigger_phrases:
  - "deep-ai-council seat diversity"
  - "council lens combinations"
  - "council vantage targets"
  - "council diversity requirement"
  - "council strategy lenses"
  - "council task type auto-selection"
  - "council strategy count"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.10
---

# AI Council Seat Diversity Patterns

Each round uses at most 3 seats. The goal is useful disagreement, not more copies of the same answer.

---

## 1. OVERVIEW

Seat diversity is the council's first quality gate. A council that repeats the same reasoning path three times has spent more compute without gaining more judgment.

| Task Type | Recommended Lenses | Why |
| --- | --- | --- |
| Bug fix | analytical + critical + pragmatic | Finds cause, pressure-tests failure modes, keeps the fix small |
| Feature | creative + analytical + holistic | Explores shape, decomposes implementation, checks system fit |
| Refactor | holistic + pragmatic + critical | Protects architecture, limits churn, exposes regression risk |
| Architecture | analytical + critical + holistic | Names trade-offs, challenges assumptions, checks long-range fit |
| Research | research + critical + creative | Gathers evidence, tests source quality, opens alternative paths |

---

## 2. STRATEGY LENSES

Use different strategy lenses for each seat. The temperature values describe the intended reasoning posture from the agent body; they are guidance for prompt framing, not a requirement to mutate runtime temperature settings when the runtime does not expose them.

| Strategy | Temp | Reasoning Lens | Best For |
| --- | --- | --- | --- |
| Analytical | 0.1 | Systematic decomposition, formal analysis | Structure, correctness |
| Creative | 0.5 | Lateral thinking, novel approaches | Innovation, alternatives |
| Critical | 0.2 | Edge cases, failure modes, security | Robustness, safety |
| Pragmatic | 0.3 | Simplest working solution, MVP focus | Quick wins, prototypes |
| Holistic | 0.4 | System-wide impact, architecture fit | Integration, scale |
| Research | 0.2 | Evidence gathering, source validation, unknown reduction | Ambiguous requirements, external facts |

---

## 3. AI VANTAGE TARGETS

> **Primary mode: in-CLI.** The default council run uses the CURRENT active runtime's own model bench as seats - no external dispatch needed. The "Vantage Target" below names *which CLI's models supply the round's seats*, whether that CLI is the active runtime (in-CLI mode) or an externally-dispatched one (via the `cli-*` skill family).
>
> **One-CLI-per-round invariant.** A single round MUST run all its seats through ONE CLI's models. Seat diversity inside a round comes from different models/reasoning lenses on that CLI (and from different strategy lenses). Multiple CLIs in the same deliberation are staged as MULTIPLE rounds, each with its own state event. See `SKILL.md §0` Operational Modes and `§4` ALWAYS rule 6 / NEVER rule 5.

Vantage = the CLI whose model bench supplies the round's seats. Each row below is a complete round option:

| Vantage Target | Mode | Same-CLI Seat Diversity Options | Role in the Council | Typical Strategy Pairing |
| --- | --- | --- | --- | --- |
| `cli-claude-code` | in-CLI when active runtime is Claude Code; otherwise external | model: Opus / Sonnet / Haiku; reasoning: high / xhigh | Deep decomposition, correctness scrutiny, edge-case reasoning | Analytical or Critical |
| `cli-opencode` | in-CLI when active runtime is OpenCode; otherwise external | model: gpt-5.5 / gpt-5.5-pro / gpt-5.5-fast; reasoning: medium / high / xhigh | Implementation realism, code-change sequencing, refactor constraints | Analytical or Pragmatic |
| `cli-opencode` | in-CLI when active runtime is OpenCode; otherwise external | direct provider models such as `deepseek/deepseek-v4-pro`, `xiaomi/mimo-v2.5-pro`, or `openai/gpt-5.5-pro`; `--variant low/medium/high` where supported | Full plugin/skill/MCP runtime, direct-provider coverage, broad model bench within one CLI | Holistic, Research, or Creative |
| native `@deep-research` | always in-CLI (active runtime's research agent) | n/a (single-seat round) | Evidence-first investigation and citation discipline | Research or Critical |

The default council run is an in-CLI round on the active runtime. External-CLI rounds are dispatched only when the active runtime cannot supply the required vantage or when explicit cross-AI validation is requested by the caller.

Unavailable vantages may be simulated only when clearly labeled as simulated. Do not imply an external AI participated when it did not.

### Vantage Selection Rules

Use real external or native vantages when the caller actually runs them or provides their result.

Do not overclaim.

Valid:

```text
Critical Seat, simulated cli-claude-code lens
```

Valid when actually executed:

```text
Critical Seat via cli-claude-code
```

Invalid:

```text
Claude Code found...
```

when Claude Code did not run.

### Pairing Guidance

Pair lenses and vantages to create complementary coverage. **All pairings below are SINGLE-ROUND patterns** - each entry stays within one CLI; multi-CLI rounds are not pairings, they are sequential rounds.

- Analytical + `cli-opencode` (gpt-5.5 high): implementation sequence and codebase fit.
- Pragmatic + `cli-opencode` (gpt-5.5 medium): minimal working path and churn control.
- Holistic + `cli-opencode` (`deepseek/deepseek-v4-pro` high): system-wide impact, broad architectural fit via direct-provider model bench.
- Research + `cli-opencode` (multiple direct-provider models in one round): ecosystem context and external unknowns covered by multiple models within ONE CLI invocation.
- Analytical + `cli-claude-code` (Opus high): deep decomposition.
- Critical + `cli-claude-code` (Opus xhigh): edge-case and correctness scrutiny.
- Research + native `@deep-research`: source discipline and evidence reduction.
- Critical + native `@deep-research`: evidence-backed challenge to assumptions.

---

## 4. DIVERSITY REQUIREMENTS

Every council run must satisfy all applicable diversity checks.

### 1. Lens Diversity

Selected seats use different strategy lenses.

Bad:

```text
Analytical + Analytical + Analytical
```

Good:

```text
Analytical + Critical + Pragmatic
```

### 2. Vantage Diversity (within a single round)

Within ONE round, vantage diversity is achieved via DIFFERENT MODELS or REASONING LEVELS on the SAME CLI (e.g. on `cli-opencode`: `deepseek/deepseek-v4-pro --variant high` + `xiaomi/mimo-v2.5-pro`; on `cli-claude-code`: Opus + Haiku). Across-CLI diversity is staged as ADDITIONAL ROUNDS - each round runs on one CLI only.

If real external vantages are unavailable, preserve lens diversity and label simulated vantages.

### 3. Mandate Diversity

Each seat receives a unique success criterion and risk focus.

Examples:

- one seat optimizes correctness;
- one seat attacks failure modes;
- one seat minimizes implementation churn.

### 4. Output Diversity

If two seats return essentially the same plan, run cross-critique to decide whether convergence is real or artificial.

Artificial convergence signs:

- same phrasing;
- same blind spots;
- no unique evidence;
- no disagreement before recommendation.

### 5. Evidence Diversity

At least one seat must challenge assumptions, missing context, or failure modes.

Evidence diversity is mandatory because planning without challenge turns council output into repeated intuition.

---

## 5. STRATEGY COUNT GUIDELINES

| Strategies | When to Use |
| --- | --- |
| N=2 | Simple tasks with clear constraints and low risk |
| N=3 | Default and maximum: balanced diversity, critique, and synthesis |

Never increase N above 3 to simulate consensus.

If more than three vantage points matter, stage them in the plan as follow-up validation instead of dispatching an oversized council.

### N=2

Use two seats when:

- the task is small;
- scope is clear;
- risk is low;
- a focused challenge lens is enough.

Recommended pairings:

- Bug fix: Analytical + Critical.
- Narrow docs change: Pragmatic + Critical.
- Small planning choice: Analytical + Pragmatic.

### N=3

Use three seats when:

- this is the default council mode;
- requirements have multiple trade-offs;
- implementation risk exists;
- architecture fit matters;
- evidence is incomplete.

Recommended pattern:

```text
Builder lens + critic lens + integrator lens
```

### More Than Three

Do not run a wider first round.

Instead:

- complete the three-seat council;
- identify remaining validation needs;
- stage extra external vantages as follow-up checks.

---

## 6. TASK-TYPE AUTO-SELECTION

Use this flow when the user does not specify seats. **Each row below = ONE round on ONE CLI.** Multi-CLI deliberations stage additional CLIs as sequential dedicated rounds, never folded into the same round.

```text
Task Type Received
    │
    ├─► Bug Fix
    │   └─► Round 1 (recommended): cli-claude-code
    │       Seats: Analytical (Opus high) + Critical (Opus xhigh) + Pragmatic (Sonnet)
    │       Rationale: deep decomposition + edge-case scrutiny + minimal-fix lens.
    │       Optional Round 2: cli-opencode (gpt-5.5 high) for implementation-realism cross-check.
    │
    ├─► New Feature
    │   └─► Round 1: cli-opencode (direct providers)
    │       Seats: Creative (xiaomi/mimo-v2.5-pro) + Analytical (deepseek/deepseek-v4-pro high) + Holistic (openai/gpt-5.5-pro)
    │       Rationale: broad direct-provider model bench within one CLI; novel → structured → system-fit.
    │       Optional Round 2: cli-claude-code for correctness-scrutiny pass.
    │
    ├─► Refactoring
    │   └─► Round 1: cli-opencode
    │       Seats: Holistic (gpt-5.5-pro) + Pragmatic (gpt-5.5 medium) + Critical (gpt-5.5 xhigh)
    │       Rationale: implementation-realism CLI excels at refactor sequencing.
    │       Optional Round 2: cli-claude-code for regression-risk deep dive.
    │
    ├─► Architecture
    │   └─► Round 1: cli-claude-code
    │       Seats: Analytical (Opus high) + Critical (Opus xhigh) + Holistic (Sonnet)
    │       Rationale: deep-decomposition CLI for trade-off mapping.
    │       Optional Round 2: native @deep-research (single-seat) for evidence backstop.
    │
    ├─► Research / Unknowns
    │   └─► Round 1: native @deep-research (single seat)
    │       Rationale: evidence-first investigation with citation discipline.
    │       Optional Round 2: cli-opencode (multiple direct-provider models) for alternative framing.
    │       Optional Round 3: cli-claude-code (Critical lens) to test assumptions.
    │
    └─► Custom (user specifies)
        └─► User-selected strategies (N=user-defined, max 3 PER ROUND).
            If user names seats from multiple CLIs, the council MUST stage them as
            separate dedicated rounds (one CLI per round) rather than mixing.
```

Respect user-selected custom strategies up to the maximum of three PER ROUND. If the user requests more than three seats or multiple CLIs, stage them as additional dedicated rounds - never widen a single round beyond its CLI boundary.

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §3 and §16.
- Decision context: local doctor command ADRs ADR-001.
- Scoring rubric: `../scoring/scoring_rubric.md`.
- Depth dispatch: `../convergence/depth_dispatch.md`.
- Failure handling: `../convergence/failure_handling.md`.

exec
/bin/zsh -lc "sed -n '1,180p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Scoring Rubric"
description: "Five-dimension scoring, deliberation rounds, adversarial critique, conflict resolution, and attribution rules for AI Council synthesis."
trigger_phrases:
  - "deep-ai-council scoring rubric"
  - "five-dimension council scoring"
  - "hunter skeptic referee"
  - "council comparison table"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.8
---

# AI Council Scoring Rubric

Use this reference when synthesizing council seats into a scored, attributed planning recommendation. It mirrors the agent body synthesis protocol.

---

## 1. OVERVIEW

Subjective picking is the failure mode this rubric prevents.

A AI Council run should not adopt the first plausible plan, the most familiar plan, or the plan with the most confident language. It should score every returned seat against the same planning rubric, run cross-critique when disagreement is close or suspiciously absent, and compose a final plan from supported elements.

This reference applies to planning-only council synthesis.

The council:

1. receives multiple distinct seat proposals;
2. extracts each proposal independently;
3. scores each proposal with the same dimensions;
4. critiques the leading plan adversarially;
5. resolves conflicts without fabricating convergence;
6. attributes every final plan element to the seat that contributed it.

The scoring output belongs in the Multi-AI Council Report comparison table and in any persisted deliberation artifact. The score is not a popularity vote. It is an auditable planning judgment based on evidence, risk, completeness, and fit.

Core principle:

```text
Principled scoring beats repeated intuition.
```

Use the score to clarify trade-offs. Do not use it to hide unresolved contradictions.

---

## 2. THE 5-DIMENSION RUBRIC

Score every usable council seat out of 100 points.

| Dimension | Weight | Description | Scoring Guide |
| --- | --- | --- | --- |
| Correctness | 30% | Solves the stated problem completely | 30=perfect, 20=mostly, 10=partial, 0=wrong |
| Completeness | 20% | Edge cases handled, all requirements met | 20=all covered, 15=most, 10=some, 0=minimal |
| Elegance | 15% | Simple, clean, maintainable | 15=exemplary, 10=good, 5=acceptable, 0=poor |
| Robustness | 20% | Error handling, performance, security | 20=bulletproof, 15=solid, 10=adequate, 0=fragile |
| Integration | 15% | Fits existing codebase patterns and workflow constraints | 15=no friction, 10=compatible, 5=minor friction, 0=conflicts |

Operator checks:

- Does the plan answer the original request?
- Does it cover requirements, edge cases, and verification?
- Does it avoid unnecessary complexity?
- Does it handle failure, performance, security, and recovery concerns when relevant?
- Does it fit existing codebase and workflow constraints?

### Recommended Comparison Table Shape

| Seat | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Seat A |  |  |  |  |  |  |  |
| Seat B |  |  |  |  |  |  |  |
| Seat C |  |  |  |  |  |  |  |

Timeout or error rows should remain visible but excluded from scored totals.

Example:

| Seat | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Critical Seat | 24 | 16 | 10 | 19 | 12 | 81 | Strong risk handling, moderate complexity |
| Pragmatic Seat | 25 | 13 | 14 | 13 | 14 | 79 | Simple plan, weaker failure handling |
| Research Seat | TIMEOUT | N/A | N/A | N/A | N/A | N/A | Excluded from scored totals |

---

## 3. MULTI-ROUND DELIBERATION

Do not recommend after the first plausible answer.

Run at least two deliberation passes before any recommendation:

1. Round 1: Independent Extraction.
2. Round 2: Cross-Critique.
3. Round 3: Consensus Reconciliation when required.

### Round 1: Independent Extraction

Summarize each seat without merging.

Extract:

- proposed plan;
- key evidence;
- assumptions;
- confidence;
- risks and trade-offs;
- alternative challenged.

Rules:

- Preserve each seat's distinct lens.
- Do not smooth away disagreement.
- Do not promote a plan because it appears first.
- Do not treat repeated phrasing as consensus.

Output pattern:

| Seat | Proposed Plan | Key Evidence | Assumptions | Confidence |
| --- | --- | --- | --- | --- |
| Analytical |  |  |  |  |
| Critical |  |  |  |  |
| Pragmatic |  |  |  |  |

### Round 2: Cross-Critique

Have each seat's strongest concern attack the leading plan.

Identify:

- evidence-backed criticisms;
- preference-only criticisms;
- missing context;
- ignored failure modes;
- assumptions that carry too much weight.

The critique should be adversarial but fair. A trade-off is not automatically a flaw.

### Round 3: Consensus Reconciliation

Run reconciliation when any of these are true:

- scores are within 15 points;
- assumptions conflict;
- the leading plan has unresolved high-severity risk;
- all seats propose essentially the same approach;
- one assumption carries the whole plan.

Reconciliation outcomes:

- merge compatible elements;
- adopt a clear winner with documented rationale;
- present unresolved alternatives with trade-offs;
- escalate if contradiction remains.

---

## 4. ADVERSARIAL CROSS-CRITIQUE (HUNTER / SKEPTIC / REFEREE)

Adversarial cross-critique counters convergence bias and shallow consensus.

It is required when:

- strategies are within 15 points after initial scoring;
- all seats propose the same approach;
- a single assumption carries the plan.

Skip only when one seat leads by 25+ points and no critical risk is unresolved.

### HUNTER

The Hunter attacks Seat A while wearing Seat B's lens.

Prompt:

```text
What weakness does Seat A miss that Seat B would catch?
```

exec
/bin/zsh -lc "sed -n '181,380p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:

The Hunter looks for:

- ignored edge cases;
- hidden operational risk;
- missing dependencies;
- weak evidence;
- incorrect assumptions;
- places where another lens has stronger coverage.

### SKEPTIC

The Skeptic defends Seat A from the Hunter.

Prompt:

```text
Is this a real weakness or an intentional trade-off?
```

The Skeptic distinguishes:

- genuine flaws;
- acceptable simplifications;
- scope-controlled omissions;
- preference-only objections;
- risks already mitigated by the plan.

### REFEREE

The Referee adjusts scores after Hunter and Skeptic arguments.

Rules:

- For each undefended weakness, reduce 1-3 points.
- For a defended trade-off, keep the score stable.
- For a newly surfaced strength, allow a modest increase.
- Maximum total adjustment is +/-10 points per seat.
- Document adjustments in the comparison table.

### Comparison Table Treatment

Include both pre-critique and post-critique rows.

| Seat | Stage | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Adjustment Rationale |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Seat A | Pre-Critique |  |  |  |  |  |  | Initial score |
| Seat A | Post-Critique |  |  |  |  |  |  | Hunter found an undefended failure mode |
| Seat B | Pre-Critique |  |  |  |  |  |  | Initial score |
| Seat B | Post-Critique |  |  |  |  |  |  | Skeptic defended the simplicity trade-off |

### Consensus Check

If all seats score within 5 points and propose essentially the same plan, flag potential convergence sycophancy.

Ask:

```text
Are these genuinely the same good idea, or did the council fail to diversify?
```

If convergence is genuine:

- note the shared evidence;
- explain why independent seats reached the same plan;
- keep simulated-vantage labels visible.

If convergence is artificial:

- re-run the weakest seat with stronger contrarian framing; or
- report insufficient diversity and reduce confidence.

---

## 5. CONFLICT RESOLUTION MATRIX

Use this matrix after scoring and critique.

| Scenario | Action |
| --- | --- |
| Clear winner (>15 point lead) | Adopt winner, note alternatives |
| Close race (<10 point spread) | Merge best elements from top 2 |
| All low scores (<50) | Escalate: task may need reframing |
| Contradictory approaches | Present both to user with trade-off analysis |
| Strategy timeout/failure | Score remaining seats, note incomplete data |
| Simulated external vantage only | Label it as simulated; do not imply external execution |

Close races merge only elements that improve the plan without bloating it. All-low-score rounds escalate for reframing. Timeout rows remain visible as `TIMEOUT (N/A)` and are excluded from scored totals. Simulated external vantages must be labeled as simulated unless the CLI or native agent actually executed.

---

## 6. ATTRIBUTION RULES

Every final plan element needs provenance.

Attribution tells the reader which seat contributed each part and why it survived synthesis.

### Required Attribution Points

Attribute the recommended plan, validation steps, risk mitigations, dropped alternatives, unresolved trade-offs, assumptions, and confidence rationale.

### Plan Element Pattern

Use this pattern:

```text
- <Plan element> - contributed by <Seat>, strengthened by <Seat>, retained because <reason>.
```

Example:

```text
- Keep the change documentation-only - contributed by Pragmatic Seat, reinforced by Critical Seat, retained because the request names no runtime behavior change.
```

### Seat Labeling

Use stable labels: Analytical Seat, Creative Seat, Critical Seat, Pragmatic Seat, Holistic Seat, and Research Seat.

When a real external vantage ran, cite it:

```text
Analytical Seat via cli-opencode
```

When it did not run, label it:

```text
Analytical Seat, simulated cli-opencode lens
```

### Simulated-Vantage Preservation

Preserve simulated labels in council composition, seat summaries, comparison tables, attribution notes, and final confidence.

Missing external participation can reduce confidence when the absent vantage was material.

### Dropped Alternative Attribution

Do not erase lower-scoring seats.

Record:

- seat name;
- total score;
- one-line approach;
- why it was dropped;
- any useful element retained.

Example:

| Dropped Seat | Score | Approach | Reason Dropped | Retained Element |
| --- | ---: | --- | --- | --- |
| Creative Seat | 68 | Broader redesign | Too much scope for packet | Naming idea reused in docs |

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §6 SYNTHESIS PROTOCOL.
- Output schema: `../structure/output_schema.md` §4 Seat Section Fallback.
- Council signals: `../convergence/convergence_signals.md`.
- Seat diversity: `../patterns/seat_diversity_patterns.md`.
- Failure handling: `../convergence/failure_handling.md`.

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti_patterns.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "AI Council Anti-Patterns"
description: "Anti-patterns, detection cues, and recovery actions for preserving AI Council quality."
trigger_phrases:
  - "deep-ai-council anti-patterns"
  - "council fake consensus"
  - "convergence sycophancy"
  - "recursive council"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.7
---

# AI Council Anti-Patterns

These patterns degrade council quality by replacing deliberation with repetition, overclaiming, or scope drift. Use this reference to detect and recover from them.

---

## 1. OVERVIEW

The AI Council exists to produce better plans through diverse lenses, real critique, scoring, and scoped persistence.

Anti-patterns break that contract. They make the council look rigorous while removing the evidence, disagreement, or boundary discipline that makes it useful.

The most common failure is fake agreement:

```text
Three seats repeat the same plan, the report calls it consensus, and no one attacks the assumptions.
```

A valid council run should instead:

- diversify lenses;
- diversify mandates;
- load context before deliberation;
- score every usable seat;
- run cross-critique when plans converge or scores are close;
- label simulated vantages honestly;
- preserve planning-only scope.

---

## 2. THE 11 ANTI-PATTERNS

| Anti-Pattern | Why It's Problematic | Correct Behavior |
| --- | --- | --- |
| **Identical Repetition** | No diversity, wastes compute on the same reasoning path | Each seat uses a distinct lens, mandate, and vantage target |
| **Fake Consensus** | Repeated phrasing masquerades as agreement | Require independent findings and cross-critique |
| **Subjective Picking** | Bias toward familiar patterns, ignores scoring | Apply the 5-dimension rubric to ALL seats |
| **Single-Pass Recommendation** | First plausible plan adopted without deliberation | Run independent extraction, cross-critique, and reconciliation |
| **Strategy Overload** | >3 seats creates noise, not signal | Max 3. More seats are staged as follow-up validation |
| **Out-of-scope File Modification** | Council write authority is limited to `ai-council/**` | Persist council artifacts only. User or another agent executes code/spec changes |
| **Ignoring Low Scorers** | Low-scoring seats may have valuable partial insights | Score everything, cherry-pick good elements |
| **Recursive Council** | Nesting the council inside itself creates infinite loops | Multi-AI Council is a planning leaf, no self-recursion |
| **No Context Loading** | Deliberation without evidence produces hallucinated plans | ALWAYS run PREPARE before DIVERSIFY |
| **Convergence Sycophancy** | All seats artificially agree, masking real trade-offs | Run cross-critique when scores are close or plans converge |
| **External Vantage Overclaim** | Implies a tool or AI participated when it did not | Label unavailable external systems as simulated vantage lenses |

---

## 3. DETECTION CUES

Operators can spot anti-patterns from the report structure.

Red flags:

- identical opening sentences across seats;
- no critical seat;
- no seat with assumption-challenge mandate;
- no comparison table;
- no Pre-Critique or Post-Critique rows in the comparison table;
- all seats have the same confidence without explanation;
- missing `simulated:` labels for unavailable external vantages;
- no dropped-alternative section;
- no attribution for final plan elements;
- report recommends before describing deliberation;
- no timeout/error rows even though dispatch was incomplete;
- council writes outside `ai-council/**`;
- Depth 1 dispatches sub-agents;
- root cause claims lack file or packet evidence.

Structural cue:

```text
If the report could be produced by one ordinary analysis pass, the council did not add enough deliberative value.
```

---

## 4. RECOVERY ACTIONS

Recover as soon as an anti-pattern is detected.

### Re-Dispatch With Stronger Contrarian Framing

Use when:

- plans converge too quickly;
- all scores are close;
- no seat attacked assumptions.

Action:

```text
Re-run the weakest or most redundant seat with a mandate to find the strongest failure mode in the leading plan.
```

### Halt And Reframe

Use when:

- all seats fail;
- every plan scores low;
- required context is missing;
- scope is unclear.

Action:

```text
Stop synthesis, report the gap, and ask for narrower requirements or source evidence.
```

### Escalate

Use when:

- two high-scoring plans contradict each other;
- missing external vantage is material;
- the council cannot satisfy minimum diversity;
- an out-of-scope write was attempted.

Action:

```text
ESCALATION: Council cannot safely choose without user or orchestrator decision.
```

### Repair The Report

Use when:

- scoring exists but attribution is missing;
- simulated labels were omitted;
- low-scoring seats were dropped silently.

Action:

- add attribution;
- restore dropped alternatives;
- add simulated-vantage labels;
- add post-critique adjustment rationale.

---

## 5. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §11 ANTI-PATTERNS.
- Scoring rubric: `../scoring/scoring_rubric.md`.
- Seat diversity: `seat_diversity_patterns.md`.
- Depth dispatch: `../convergence/depth_dispatch.md`.
- Failure handling: `../convergence/failure_handling.md`.

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_strategy.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "Deep AI Council Strategy Template"
description: "Council round strategy template for seat setup, open disagreements, convergence status, and handoff risk."
trigger_phrases:
  - "council strategy template"
  - "ai council round strategy"
  - "deep ai council strategy"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.2
---

# Deep AI Council Strategy

Use this template before and between council rounds. Keep it short enough for every seat to read before proposing.

---

## 1. OVERVIEW

| Field | Value |
|-------|-------|
| Packet | `<spec-folder>` |
| Topic | `<planning topic>` |
| Round | `1` |
| Run Mode | `in-cli` |
| Max Rounds | `3` |

Boundary statement: `<what the council may decide, and what implementation work remains outside the council>`.

---

## 2. SEATS

| Seat | Lens | Mandate | Must Challenge |
|------|------|---------|----------------|
| Seat A | Analytical | `<main evaluation focus>` | `<risk or assumption>` |
| Seat B | Critical | `<main evaluation focus>` | `<risk or assumption>` |
| Seat C | Pragmatic | `<main evaluation focus>` | `<risk or assumption>` |

---

## 3. KNOWN CONTEXT

- `<fact with source>`
- `<constraint>`
- `<open dependency>`

---

## 4. OPEN DISAGREEMENTS

| ID | Disagreement | Current Evidence | Owner |
|----|--------------|------------------|-------|
| DAC-D001 | `<issue>` | `<evidence>` | `<seat or caller>` |

---

## 5. CONVERGENCE STATUS

| Signal | Current State |
|--------|---------------|
| Two-of-three material agreement | `unknown` |
| Surviving high-severity blocker | `unknown` |
| Required report sections ready | `unknown` |
| Failed rounds preserved | `unknown` |

Next round focus: `<what the next seat pass must decide>`.

---

## 6. HANDOFF RISKS

| Risk | Impact | Handoff Instruction |
|------|--------|---------------------|
| `<risk>` | `<impact>` | `<what the implementer must do>` |

---

## 7. ARTIFACT STATUS

| Artifact | Status | Notes |
|----------|--------|-------|
| `ai-council-config.json` | `draft` | `<notes>` |
| `ai-council-state.jsonl` | `not-started` | `<notes>` |
| `council-report.md` | `not-started` | `<notes>` |
| `failed/` | `not-needed` | `<notes>` |

exec
/bin/zsh -lc "sed -n '1,400p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
---
title: "Deep AI Council Round Prompt Pack"
description: "Seat prompt template for one deep-ai-council round with role, context slots, critique steps, and the seat verdict footer."
trigger_phrases:
  - "council round prompt pack"
  - "council seat prompt template"
  - "seat recommendation sections"
  - "council seat verdict"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.3
---

# Deep-AI-Council Round Prompt Pack

Resolved route: mode=ai-council; target_agent=plan; execution=multi_topic_session_round; state_source=ai-council/session-state.jsonl; depth_aware=true; do_not_switch_mode=true

## Role

You are {{seat_name}}, a {{seat_lens}} council seat inside `deep-ai-council`.

You are read-only. Do not create, edit, move, rename, or delete files, and do not run shell commands. Return deliberation text only; the trusted host owns all packet-local persistence.

## Context

- Packet: {{spec_folder}}
- Topic: {{topic}}
- Round: {{round}}
- Run mode: {{execution_mode}}
- Planning boundary: {{planning_boundary}}
- Prior state summary: {{prior_state_summary}}
- Known disagreements: {{known_disagreements}}
- Required output contract: the five seat-local sections and structured footer below. `references/structure/output_schema.md` applies to the synthesized full-council report, not an individual seat.

## Action

1. State the best plan for this topic and the evidence that supports it.
2. Identify the strongest risk, blocker, or assumption in your own plan.
3. Critique the other active proposal summaries if provided.
4. Return a handoff-ready recommendation with confidence and conditions that would change your view.

## Format

Return markdown with these sections:

1. `## Seat Recommendation`
2. `## Evidence And Assumptions`
3. `## Critique`
4. `## Risks And Blockers`
5. `## Handoff Recommendation`

End with a stable identifier for the proposal you recommend, followed by your stance:

```text
Council seat option: <lowercase-kebab-case-proposal-id>
Council seat verdict: SUPPORT|SUPPORT_WITH_RISKS|BLOCK
```

codex
The current packet has the right qualitative instincts—distinct lenses, mandatory critique, suspicious-consensus checks—but its gate is still nominal: three labels and two-of-three agreement can pass without measuring whether any seat contributed independent information. I’m now looking for experiments that separate debate gains from plain resampling, model strength, and judge bias.
web search: 
web search: site:arxiv.org multi-agent debate correlated agents diversity independence LLM empirical single agent self consistency ...
web search: 
web search: "Demystifying Multi-Agent Debate" GitHub ...
web search: 
web search: site:arxiv.org LLM multi agent personas do not increase diversity reasoning role prompts empirical ...
web search: 
web search: 2511.07784 GitHub Haolun Wu debate ...
web search: 
web search: 
web search: 
web search: 'Diversity-Aware Initialisation'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: "Consensus is Not Verification" GitHub 2603.06612 ...
web search: 
web search: Multi-Agent-LLMs mallm GitHub stars debate decision protocols ...
web search: 
web search: https://github.com/Multi-Agent-LLMs/mallm
web search: 
web search: "Minority Sentinel" GitHub LightGBM multi-agent debate ...
web search: 
web search: 'Stars'
web search: 
web search: https://api.github.com/repos/Multi-Agent-LLMs/mallm
web search: 
web search: 2510.07517 anonymization bias reduced multi-agent reasoning GitHub ...
web search: 
web search: https://github.com/deeplearning-wisc/MAD-identity-bias
web search: 
web search: 'Stars'
web search: 
web search: https://arxiv.org/abs/2505.22960
web search: 
web search: 'heterogeneous'
web search: 
web search: 
codex
The moat is not consensus. Consensus is often the failure mode. The defensible moat is a governed market of genuinely independent hypotheses: seats acquire different evidence or use different reasoning methods, claims are cross-examined, adjudication is blinded, and minority arguments survive until verified or explicitly rejected.

The evidence sets a high bar. NeurIPS 2025 found majority voting matched multi-agent debate across seven benchmarks; even prompted persona heterogeneity mostly preserved that result. Debate behaved like a martingale unless the protocol introduced an asymmetry favoring correct signals. [Debate or Vote](https://proceedings.neurips.cc/paper_files/paper/2025/file/934252acd87f254d5d4672fbde283bd2-Paper-Conference.pdf)

Recent work sharpens the effective-independence problem further:

- Thirty densely interacting agents produced no more answer diversity than one on MMLU-Hard; among tested interventions, architectural heterogeneity—not communication topology—escaped the hard ceiling. [Ringelmann Effect](https://arxiv.org/abs/2606.02646)
- Polling at 25× inference cost did not reliably improve truthfulness because errors remained correlated, including across model families; raw self-reported confidence was not a useful weighting signal. [Consensus Is Not Verification](https://arxiv.org/abs/2603.06612)
- Positive results come from engineered asymmetry: diversity-aware candidate selection plus calibrated confidence beat vanilla debate and voting across six reasoning benchmarks, while distinct reasoning methods beat persona-only MAD in fewer rounds. [Demystifying MAD](https://aclanthology.org/2026.findings-acl.1694/), [DMAD](https://github.com/MraDonkey/DMAD)
- In heterogeneous three-model debates, the minority was correct in 25.5% of divergent cases. A non-LLM behavioral classifier achieved positive net gain; an LLM judge had negative net gain. [Minority Sentinel](https://arxiv.org/abs/2606.29270)

This exposes four gaps in the current mode contract. [`seat_diversity_patterns.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md) validates named lenses, not error independence. [`prompt_pack_round.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md) exposes seat identity and prior summaries. [`scoring_rubric.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md) lets the same deliberative context influence scoring. [`convergence_signals.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md) still treats two-of-three agreement as its primary signal.

Three concrete changes would make this a real council:

1. Add an `independence_batch` spanning sealed, CLI-local proposal rounds. Preserve the one-CLI-per-round invariant, but prohibit cross-round visibility until every initial proposal is committed. Record model family, reasoning method, evidence partition, tools, and historical error vector. Estimate:

   `N_eff = n² / Σᵢⱼρᵢⱼ`

   using task-family correctness correlations. A three-seat run with `N_eff < 2` should be labeled `ensemble_only` and routed to the cheaper single-model/self-consistency baseline. Semantic or phrasing diversity is only a cold-start proxy, never proof of independence.

2. Replace personas with accountable cognitive assignments. Give each proposer a distinct reasoning algorithm—causal graph, counterexample search, constraint proof, minimal-change construction—and a deliberately partitioned evidence view. Personas may style an answer; reasoning-method and evidence separation change what information can enter the pool.

3. Split deliberation from adjudication. Persist claims under anonymous IDs; strip model, provider, seat, confidence, and generation order before the first scoring pass. Critics may challenge claims but do not vote. The adjudicator may select or compose supported elements but cannot invent a new plan. Reveal only empirically calibrated confidence afterward. Re-run adjudication with shuffled order and identity labels; a changed verdict emits `adjudication_unstable`. Score the entire trajectory and preserve a structured minority appeal instead of aggregating only final votes. Response anonymization has already reduced measured identity distortion dramatically, and Free-MAD shows that trajectory scoring plus anti-conformity can outperform consensus-based debate in one round. [Identity-bias study](https://arxiv.org/abs/2510.07517), [Free-MAD](https://aclanthology.org/2026.findings-acl.1600/)

The unique-value thesis is therefore narrower—and stronger—than “several models are better than one.” `deep-ai-council` should own decisions where multiple defensible plans optimize different objectives and no single verifier or named standard resolves the trade-off. `deep-research` gathers evidence; `deep-review` finds defects; `deep-alignment` checks a declared authority. The council uniquely preserves independently grounded disagreement, exposes the decision’s cruxes, composes compatible plan fragments, and returns typed residual disagreement—factual uncertainty, objective trade-off, hard veto, or irreducible value choice. If it cannot demonstrate independence, it should refuse the council label.

```json
{
  "new_repos": [
    {
      "name": "deeplearning-wisc/MAD-identity-bias",
      "url": "https://github.com/deeplearning-wisc/MAD-identity-bias",
      "stars": "~0",
      "what": "New official ACL 2026 Oral code with vanilla/anonymized runs, JSONL histories, and IBC computation in debate/metrics.py.",
      "lesson": "Blind response provenance and measure conformity-versus-obstinacy instead of assuming named seats deliberate impartially.",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "Multi-Agent-LLMs/mallm",
      "url": "https://github.com/Multi-Agent-LLMs/mallm",
      "stars": "~62",
      "what": "Separates mallm/agents, mallm/discourse_policy, and mallm/decision_protocol; latest release v1.0.6 was June 15, 2026.",
      "lesson": "Make voting, consensus, judge, report, relay, and debate policies independently selectable and benchmarkable rather than coupling deliberation to two-of-three convergence.",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "lkaesberg/decision-protocols",
      "url": "https://github.com/lkaesberg/decision-protocols",
      "stars": "~7",
      "what": "Controlled ACL 2025 experiment configurations isolate decision protocol and independent-drafting effects using MALLM.",
      "lesson": "Select aggregation by task class: voting was stronger for reasoning, consensus for knowledge, while independent drafting improved answer diversity.",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "MraDonkey/DMAD",
      "url": "https://github.com/MraDonkey/DMAD",
      "stars": "~25",
      "what": "ICLR 2025 implementation uses main_DMAD.py, prompt.py, reasoning.py, and record.py to assign distinct reasoning strategies.",
      "lesson": "Diversify cognitive procedures such as IO, compositional CoT, and duty-distinct CoT; persona labels alone do not break a shared mental set.",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Debate communication has no inherent positive drift: without a mechanism favoring independently supported correct signals, its expected gain can collapse to ordinary voting or stochastic re-evaluation.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2025/file/934252acd87f254d5d4672fbde283bd2-Paper-Conference.pdf",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Effective seat count should be estimated from historical error correlation; architectural heterogeneity changes the scaling regime, while extra dense communication can destroy answer diversity.",
      "evidence": "https://arxiv.org/abs/2606.02646",
      "maps_to": [
        "deep-ai-council",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "med"
    },
    {
      "insight": "Reasoning-method diversity is more load-bearing than persona diversity: seats need different algorithms or evidence partitions, not merely Analyst, Critic, and Pragmatist labels.",
      "evidence": "https://github.com/MraDonkey/DMAD",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Identity cues create measurable sycophancy and self-bias that accumulate across rounds; anonymized claim exchange and counterbalanced adjudication convert authority-sensitive debate into content-sensitive evaluation.",
      "evidence": "https://arxiv.org/abs/2510.07517",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Minority disagreement is an information channel, not convergence noise: debate dynamics can identify when a correlated majority suppressed the correct alternative, but an LLM judge may share the majority's blind spot.",
      "evidence": "https://arxiv.org/abs/2606.29270",
      "maps_to": [
        "deep-ai-council",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an independence_batch contract: seal first proposals across CLI-local rounds, persist model-family/reasoning-method/evidence-partition metadata, estimate task-conditioned pairwise error correlations, compute effective_seats, and downgrade runs below an initial N_eff=2 moat floor to ensemble_only.",
      "target": "deep-ai-council/runtime-gauges-observability",
      "rationale": "Nominal seat count is not evidence count; the gate prevents correlated replicas from receiving council authority or budget.",
      "uniqueness": "This makes demonstrated independent judgment—not multi-agent theater—the admission criterion separating the council from self-consistency sampling.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2606.02646"
    },
    {
      "rec": "Replace lens-only selection with a sealed diversity auction that chooses seats for marginal reasoning-method, evidence-community, model-family, and tool-surface coverage; preserve the one-CLI-per-round rule by linking isolated rounds under one independence_batch_id.",
      "target": "deep-ai-council/runtime-fan-out-fan-in",
      "rationale": "Distinct cognitive procedures and evidence access create complementary hypotheses; role prose and temperature variation frequently do not.",
      "uniqueness": "A single model can imitate personas, but it cannot honestly reproduce independent model lineages, disjoint evidence acquisition, and separate tool-derived observations.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/MraDonkey/DMAD ; https://aclanthology.org/2026.findings-acl.1694/"
    },
    {
      "rec": "Introduce blinded trajectory adjudication: anonymous claim IDs, shuffled dual-pass presentation, proposer/critic/verifier/adjudicator separation, content-only scoring before calibrated-confidence reveal, and a minority-sentinel branch that emits factual_uncertainty, objective_tradeoff, hard_veto, or value_disagreement instead of forced consensus.",
      "target": "deep-ai-council/runtime-convergence",
      "rationale": "Identity bias, final-round voting, and correlated LLM judges can erase correct minorities; trajectory evidence and orthogonal verification preserve them.",
      "uniqueness": "This turns the mode into an auditable pluralist decision institution capable of preserving and adjudicating legitimate disagreement—work neither a single answer nor the other deep modes perform.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2510.07517 ; https://arxiv.org/abs/2606.29270 ; https://aclanthology.org/2026.findings-acl.1600/"
    }
  ],
  "contradictions": [
    {
      "claim": "Confidence-modulated debate can beat vanilla debate and majority voting when confidence is explicitly calibrated.",
      "counter": "Raw self-reported confidence weighting produced no benefit for truthfulness, and controlled debate studies found confidence visibility secondary to reasoning strength and diversity; therefore confidence must remain hidden unless calibration is measured out of sample.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1694/ ; https://arxiv.org/abs/2603.06612 ; https://arxiv.org/abs/2511.07784"
    },
    {
      "claim": "Additional debate rounds should improve plans through iterative correction.",
      "counter": "Longer interaction can accumulate identity bias, reduce independent drafting diversity, and degrade performance; round continuation should require verified new evidence or resolved cruxes rather than movement toward agreement.",
      "evidence": "https://arxiv.org/abs/2510.07517 ; https://arxiv.org/abs/2502.19130 ; https://aclanthology.org/2026.findings-acl.1600/"
    }
  ],
  "next_angles": [
    "Build a task-conditioned independence calibration set for architecture planning, refactors, research synthesis, and governance decisions; compare error-correlation N_eff against semantic-diversity proxies.",
    "Design the anonymous claim-graph schema and test verdict invariance under seat-label permutation, order reversal, confidence masking, and provider-name reveal.",
    "Benchmark independence batches against equal-token single-strong-model, self-consistency, majority-vote, and verifier-guided best-of-N baselines; require council-specific marginal value.",
    "Train a packet-local minority sentinel from stance changes, novel-evidence introductions, rebuttal survival, verifier outcomes, and leave-one-seat-out verdict changes."
  ],
  "notes": "The strongest positive evidence remains concentrated in benchmark QA with external ground truth; open-ended architecture and planning lack comparable oracle labels. Effective-seat thresholds therefore need risk- and task-conditioned calibration. The newest Minority Sentinel and Ringelmann results are recent preprints/workshop work, so their exact effect sizes should be independently reproduced before becoming hard defaults."
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
240,935
