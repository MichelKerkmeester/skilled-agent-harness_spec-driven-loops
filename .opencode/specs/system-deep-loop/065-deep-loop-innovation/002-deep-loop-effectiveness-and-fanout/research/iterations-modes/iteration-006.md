<!-- iteration 6 | SOL xhigh | mode: deep-review | angle: A1-sota deep-review :: 2025-2026 state of the art | 2026-07-15T08:31:28.740Z -->

The competitive baseline has moved: fresh multi-pass review is no longer a moat. Cursor and Qodo already parallelize discovery and validate findings; CodeRabbit and Greptile maintain cross-commit context; Semgrep learns suppressions. Deep-review’s defensible opportunity is a transparent, longitudinal proof ledger that turns review claims into reproducible evidence and follows them through remediation.

### Comparative delta

| System | 2025–2026 mechanism | What deep-review lacks | Target |
|---|---|---|---|
| CodeRabbit | Full first review, commit-delta reviews, previous-comment reconciliation, five severity levels, feedback learnings | Commit-aware finding invalidation and explicit full-vs-incremental review semantics | deep-review, continuity-threading |
| Greptile | Repository graph, scoped rules, P0/P1/P2 comments, PR confidence score, learning from reactions and implemented suggestions | Durable, scoped adjudication memory and empirical comment-utility feedback | deep-review, dedup-novelty, gauges |
| Cursor Bugbot | Originally eight randomized-diff passes, semantic clustering, majority voting, category filtering, validator model, previous-run dedup; subsequently moved to tool-using agentic discovery | Claim-level corroboration. Deep-review’s serial dimension passes do not independently replicate a candidate, and only P0 gets adversarial replay. [Cursor reports resolution rate rising from 52% to over 70% across 40 experiments.](https://cursor.com/blog/building-bugbot) | deep-review, fan-out-fan-in |
| Graphite Agent/Diamond | Per-rule and per-exclusion acceptance, downvote, and filtering-effectiveness metrics | Outcome-grounded calibration; current convergence measures novelty, not whether findings cause justified changes. [Graphite documents these metrics explicitly.](https://graphite.com/docs/ai-review-customization) | deep-review, gauges-observability |
| Semgrep Assistant | Deterministic SAST candidates followed by separate true-positive and false-positive reasoning chains; scoped, visible, reversible “Memories”; action only above a fixed accuracy bar | Deep-review conflates discovery and adjudication and has no auditable suppression-memory lifecycle. Semgrep reports more than 96% user agreement while triaging roughly 60% of incoming findings, though this remains vendor-reported. [Semgrep’s design account](https://semgrep.dev/blog/2025/semgrep-is-confidently-handling-60-of-all-triage-for-users-without-reducing-coverage/) | deep-review, state-jsonl-checkpointing |
| Qodo 2.0 | More than a dozen specialist agents plus a judge that resolves conflicts, deduplicates, and filters below confidence/relevance thresholds; separate Precise and Exhaustive operating points | Four serial dimensions are too coarse, while strongest-restriction fan-in lets one erroneous P0 determine FAIL. Deep-review has no selectable precision/recall policy. [Qodo’s 2026 architecture description](https://www.qodo.ai/blog/Introducing-qodo-2.0-agentic-code-review/) | deep-review, fan-out-fan-in, budget-cost |
| Devin Review | Separates actionable Bugs from Investigate/Informational Flags, then assigns severe/non-severe impact within the actionable class | P0/P1/P2 currently mixes impact, confidence, and required action into one field. [Devin’s current taxonomy](https://docs.devin.ai/work-with-devin/devin-review) | deep-review |
| SWE-style verification | SWE-smith retains generated defects only when they break tests in isolated Docker environments; Code Review Bench cross-checks fixed, human-curated ground truth against continuously sampled post-review developer actions | No executable `ProofReceipt`, base/head differential reproduction, or offline/online review benchmark | deep-review, gauges-observability, locks-recovery |

### Concrete improvements

1. **Split discovery from adjudication.** Let specialist passes search aggressively, but store outputs as candidates rather than findings. Cluster candidates, record support by lineage/model/diff ordering, then dispatch a separate verifier. Every verdict-affecting P0 or P1 should require either deterministic evidence, executable reproduction, or independent cross-file reasoning. Cursor’s randomized passes are a useful diversity perturbation, but agreement alone is not proof.

2. **Replace scalar severity with factored classification.** A record should independently carry `impact`, `confidence`, `action`, `evidence_kind`, `reachability`, and `lifecycle_state`. A plausible catastrophic issue becomes `impact=critical, confidence=low, action=investigate`, not an immediate P0/FAIL. This removes the current false equivalence between severity and certainty.

3. **Uniqueness-sharpening: make deep-review an evidence-compounding reviewer.** Add immutable proof receipts containing base/head SHAs, command, environment hash, observed base/head outcomes, and artifact hashes. On later commits, replay receipts to move findings through `candidate → corroborated → reproduced → confirmed → fixed → regressed`, while scoped suppression memories remain visible, reversible, and periodically shadow-audited.

That third mechanism is the moat. Commercial reviewers increasingly do multi-agent discovery, incremental comments, and preference learning. Deep-review can instead own a review across time: falsify its own claims, preserve why a release was blocked, verify remediation without modifying the target, and detect regression after apparent closure. Deep-research accumulates external claims, council deliberates choices, alignment checks a named authority, and improvement mutates candidates; only deep-review should own reproducible code-risk evidence and the release verdict.

One caution: developer acceptance or a subsequent code change is a useful online signal, not ground truth. Code Review Bench handles this correctly by pairing its continuously sampled outcome benchmark with a fixed human-curated benchmark rather than optimizing solely for comment acceptance. [Its open pipeline exposes extraction, deduplication, judging, and per-judge results.](https://github.com/withmartian/code-review-benchmark)

```json
{
  "new_repos": [
    {
      "name": "The-PR-Agent/pr-agent",
      "url": "https://github.com/The-PR-Agent/pr-agent",
      "stars": "~12.1k",
      "what": "Open-source legacy PR reviewer; release v0.39.0 published July 5, 2026, with dynamic context, token-aware compression, and suggestion self-reflection.",
      "lesson": "pr_agent/tools/pr_code_suggestions.py and its documented second-pass 0-10 scoring show a concrete candidate re-ranking stage, while dynamic context expands hunks toward enclosing functions/classes instead of blindly adding lines.",
      "maps_to": [
        "deep-review",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "semgrep/semgrep",
      "url": "https://github.com/semgrep/semgrep",
      "stars": "~15.9k",
      "what": "Deterministic multi-language static-analysis engine; v1.169.0 released July 8, 2026.",
      "lesson": "Use deterministic analyzers as high-recall candidate producers before LLM adjudication; Semgrep Assistant's commercial scoped-memory layer is documented separately and is not implemented in this repository.",
      "maps_to": [
        "deep-review",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "SWE-bench/SWE-smith",
      "url": "https://github.com/SWE-bench/SWE-smith",
      "stars": "~702",
      "what": "NeurIPS 2025 Spotlight toolkit that builds Dockerized repository environments and synthesizes test-breaking software-engineering tasks.",
      "lesson": "Its RepoProfile/get_container abstraction and keep-only-if-a-test-breaks filter are transferable to isolated base/head reproduction receipts for review findings.",
      "maps_to": [
        "deep-review",
        "runtime/locks-recovery",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "withmartian/code-review-benchmark",
      "url": "https://github.com/withmartian/code-review-benchmark",
      "stars": "~208",
      "what": "2026 open benchmark with fixed human-curated PR issues plus a continuously refreshed online benchmark of bot comments and subsequent developer actions.",
      "lesson": "Adopt its offline/online cross-check, explicit candidate dedup stage, per-judge result storage, and precision/recall stratification instead of optimizing review convergence alone.",
      "maps_to": [
        "deep-review",
        "runtime/gauges-observability",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A review pass should emit candidates, not verdict-bearing findings; semantic clustering, claim-level replication, and a separately prompted validator should precede P0/P1 activation.",
      "evidence": "https://cursor.com/blog/building-bugbot",
      "maps_to": [
        "deep-review",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Impact, confidence, actionability, evidence type, and reachability are orthogonal. Encoding all of them in P0/P1/P2 makes low-confidence catastrophic hypotheses indistinguishable from reproduced blockers.",
      "evidence": "https://docs.devin.ai/work-with-devin/devin-review ; https://semgrep.dev/docs/semgrep-secrets/view-triage",
      "maps_to": [
        "deep-review",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "False-positive learning should produce scoped, inspectable suppression records with rationale, applicability conditions, expiry or invalidation triggers, and shadow-audit results—not opaque prompt memory.",
      "evidence": "https://semgrep.dev/blog/2025/making-zero-false-positive-sast-a-reality-with-ai-powered-memory/ ; https://www.greptile.com/docs/code-review-bot/custom-context",
      "maps_to": [
        "deep-review",
        "runtime/dedup-novelty",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "The meaningful optimization target is a precision-recall frontier plus downstream resolution and rebuttal rates, stratified by category and severity; novelty convergence alone cannot detect a confidently noisy reviewer.",
      "evidence": "https://github.com/withmartian/code-review-benchmark ; https://www.qodo.ai/blog/how-we-built-a-real-world-benchmark-for-ai-code-review/",
      "maps_to": [
        "deep-review",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a two-lane candidate/proof pipeline. Discovery waves emit FindingCandidate records with semantic cluster key, lineage, model, diff-order seed, and evidence pointers; a separate verifier emits ProofReceipt records. Require proof or independent corroboration for every verdict-affecting P0/P1, not only P0.",
      "target": "deep-review + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing",
      "rationale": "This preserves aggressive recall while preventing a single hallucinated lineage from poisoning strongest-restriction fan-in.",
      "uniqueness": "Deep-review becomes a transparent adversarial adjudicator rather than another multi-agent comment generator.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://cursor.com/blog/building-bugbot ; https://www.qodo.ai/blog/Introducing-qodo-2.0-agentic-code-review/"
    },
    {
      "rec": "Replace scalar P0/P1/P2 storage with factored impact, confidence, action, evidence_kind, reachability, and lifecycle fields; retain P0/P1/P2 only as a derived presentation projection. Add scoped suppression-memory events with previewed blast radius, expiry/invalidation conditions, and sampled shadow audits.",
      "target": "deep-review + runtime/dedup-novelty + runtime/gauges-observability",
      "rationale": "It separates dangerous-but-unverified hypotheses from confirmed blockers and turns repeated adjudication into controlled institutional knowledge.",
      "uniqueness": "Externalized, reversible adjudication history can compound across runs without contaminating fresh discovery contexts.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://docs.devin.ai/work-with-devin/devin-review ; https://semgrep.dev/blog/2025/making-zero-false-positive-sast-a-reality-with-ai-powered-memory/"
    },
    {
      "rec": "Introduce executable finding closure: selectively generate a minimal reproduction or test in an isolated clean worktree, run it against base and head, hash the environment and outputs, then replay the receipt after remediation commits. Benchmark the mode with both seeded test-breaking defects and online resolution/rebuttal outcomes.",
      "target": "deep-review + runtime/locks-recovery + runtime/continuity-threading + runtime/gauges-observability",
      "rationale": "A reproducible base/head behavioral delta is stronger evidence than model agreement, while replay closes the loop on incomplete fixes and regressions.",
      "uniqueness": "This is the moat: a longitudinal, falsifiable release-risk ledger that single-shot reviewers and the other deep modes do not own.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/SWE-bench/SWE-smith ; https://github.com/withmartian/code-review-benchmark"
    }
  ],
  "contradictions": [
    {
      "claim": "High comment precision or developer acceptance is sufficient evidence that a reviewer is effective.",
      "counter": "High precision can hide very low recall, while developer action may reflect preference or workflow pressure rather than correctness. Pair fixed human-curated ground truth with fresh online outcomes and report both operating points.",
      "evidence": "https://www.qodo.ai/blog/how-we-built-a-real-world-benchmark-for-ai-code-review/ ; https://github.com/withmartian/code-review-benchmark"
    }
  ],
  "next_angles": [
    "Design the exact FindingCandidate, ProofReceipt, SuppressionMemory, and lifecycle-event schemas plus reducer invariants and backward projection to P0/P1/P2.",
    "Benchmark claim-level replication strategies: randomized diff ordering, specialist prompts, model diversity, and tool diversity, measuring marginal recall and validator precision per dollar.",
    "Build an immutable-verifier threat model so a generated reproduction cannot overwrite tests, weaken commands, or otherwise manufacture a green proof receipt.",
    "Study longitudinal review datasets that distinguish fixed, rebutted, ignored, superseded, and workflow-rejected findings instead of treating every unaccepted comment as a false positive."
  ],
  "notes": "Commercial implementations for CodeRabbit, Greptile, Cursor Bugbot, Graphite Agent, Qodo 2.0, Devin Review, and Semgrep Assistant are not fully open. Their mechanisms and performance figures are therefore drawn from current first-party documentation and should be treated as architectural evidence, not directly comparable independent benchmarks. Star counts were verified from GitHub on 2026-07-15."
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
session id: 019f64e1-6d33-7f10-a4b3-763397cd2d81
--------
user
You are iteration 6/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-review
MODE IDENTITY (what it does today): Autonomous iterative code-review loop: externalized state, convergence detection, P0/P1/P2 findings, adversarial verify, fresh context per pass, review-report.md.
GENERIC ALTERNATIVE it must out-value: a single-shot LLM PR reviewer (CodeRabbit, Greptile, Cursor Bugbot) or a static linter

THIS ITERATION'S ANGLE (A1-sota): deep-review :: 2025-2026 state of the art
DIRECTIVE: Survey the NEWEST (2025-2026) AI code-review systems (CodeRabbit, Greptile, Cursor Bugbot, Graphite Diamond, Semgrep Assistant, PR-Agent/Qodo, Devin review, SWE-bench-style verifiers). What do their multi-pass/agentic review loops, severity models, and false-positive controls do that our iterative P0/P1/P2 loop does NOT? Real repos/URLs + adoptable mechanisms mapped to deep-review.

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

ALWAYS answer BOTH: (1) concrete improvements to make deep-review more effective; (2) the UNIQUE-VALUE / moat thesis — what deep-review can do that a single-shot LLM PR reviewer (CodeRabbit, Greptile, Cursor Bugbot) or a static linter and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (16) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs
Modes covered so far this run: deep-research
New insights so far: 17; recommendations: 12.
Open threads flagged: Study correction and retraction feeds such as Crossref relation metadata and Retraction Watch for automatic claim invalidation after a completed run. | Define the ClaimRecord JSON schema, lifecycle event grammar, reducer invariants, and migration from the existing findings registry. | Build the two-snapshot longitudinal benchmark and compare affected-claim propagation against full-run regeneration. | Compare contextual-bandit, Bayesian value-of-information, and constrained active-learning schedulers using claim-resolution gain per cost. | Benchmark source-independence clustering across DOI versions, syndication, shared ownership, review articles, and duplicated web content. | Measure prompt-injection guard false positives on legitimate papers, code, and security documentation containing imperative language.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "deep-review"): deep-review, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
This is read-only research, so the spec-folder write gate does not apply. I’ll first recover any matching prior-loop context, then route the mandated deep-review workflow and verify current product/repository evidence.
codex
No matching memory tool is exposed in this runtime, so there is no recoverable trigger context beyond the iteration packet you supplied. The project’s routing gate still applies; I’m checking its advisor before opening the deep-review contract.
exec
/bin/zsh -lc 'python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Iteration 6/40 A1-sota research for system-deep-loop deep-review: survey 2025-2026 AI code-review systems and derive mode-specific mechanisms and unique-value moat" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 3030ms:
2026-07-15 10:26:00.157 xcodebuild[87332:206879912]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 10:26:00.369 xcodebuild[87332:206879911] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-QWZQNQET' (errno=Operation not permitted)
2026-07-15 10:26:00.835 xcodebuild[87341:206879952]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 10:26:00.950 xcodebuild[87341:206879950] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
Native advisor unavailable (None; freshness=unavailable); falling back to local Python scorer.
Skill graph: loaded from SQLite
[
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep-review(keyword), !deep-review(signal), !system-deep-loop(explicit), !system-deep-loop(keyword), !system-deep-loop(signal) [Candidate-3 deep routing: system-deep-loop review MED]",
    "_graph_boost_count": 0,
    "mode": "review",
    "workflowMode": "review",
    "clarifying_question": "Should this route to review or research mode, and what output do you expect: review-report.md, research.md, or council-report.md?",
    "source": "local"
  },
  {
    "skill": "command-spec-kit-deep-review",
    "kind": "command",
    "confidence": 0.81,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, deep(name), loop, review(name)",
    "_graph_boost_count": 0,
    "source": "local"
  }
]

codex
SKILL ROUTING: `system-deep-loop` in review mode (0.95); `command-spec-kit-deep-review` also clears the threshold (0.81). Because this is a deliberately non-converging research iteration about the mode—not a request to execute a repository review—I’m loading both contracts to preserve the mode packet’s state/output rules without inventing a substitute workflow.
exec
/bin/zsh -lc "rg --files .opencode/skills .opencode/commands | rg 'system-deep-loop/.*/?SKILL\\.md"'$|system-deep-loop/SKILL'"\\.md"'$|deep-review.*(SKILL'"\\.md|\\.md)"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/SKILL.md
.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
.opencode/skills/system-deep-loop/deep-research/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
.opencode/skills/system-deep-loop/deep-alignment/SKILL.md
.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-009-boundary-vs-deep-review.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/baselines/claude-baseline.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-007-delegation-route-proof.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-004-concise-natural-ask.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-005-orchestrate-handoff.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-008-absorption-probe.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-006-auto-missing-inputs.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-001-auto-run-specified.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-002-bare-command-halt.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-003-vague-natural-ask.md
.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/behavior_benchmark.md
.opencode/skills/system-deep-loop/deep-review/assets/deep_review_strategy.md
.opencode/skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md
.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md
.opencode/skills/system-deep-loop/deep-review/SKILL.md
.opencode/skills/system-deep-loop/deep-review/scripts/README.md
.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md
.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md
.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md
.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md
.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md
.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.2.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.8.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.4.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.10.1.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.2.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.10.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.6.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.3.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.1.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.1.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.5.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.7.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.11.0.0.md
.opencode/skills/system-deep-loop/deep-review/changelog/v1.9.0.0.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/cross_reference_verification_detects_misalignment.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/graph_events_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/strategy_next_focus_and_dimension_rotation.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/severity_classification_in_jsonl.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_reads_state_before_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_writes_findings_jsonl_and_strategy_update.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_dashboard_generation_after_iteration.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/adversarial_self_check_runs_on_p0_findings.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md
.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md
.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md
.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md
.opencode/skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md
.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md
.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md
.opencode/skills/system-deep-loop/deep-review/README.md
.opencode/skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md
.opencode/skills/system-deep-loop/deep-review/references/state/state_outputs.md
.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md
.opencode/skills/system-deep-loop/deep-review/references/state/state_jsonl.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/synthesis_save_boundary.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/leaf_only_nested_dispatch_refusal.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/setup_yaml_handoff.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/three_artifact_iteration_contract.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/write_boundary_reducer_owned_files.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/resource_map_coverage_gate.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_cli_lineages_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_single_executor_parity_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_native_sequential_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_strongest_restriction.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/review_verdict_determines_post_review_workflow.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/final_synthesis_memory_save_and_guardrail_behavior.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/finding_deduplication_and_registry.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/resource_map_emission.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/review_report_synthesis_has_all_9_sections.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/divergent_convergence_mode.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/dimension_coverage_convergence_signal.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/blocked_stop_reducer_surfacing.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/composite_review_convergence_stop_behavior.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/fail_closed_reducer.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/graph_convergence_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/p0_override_blocks_convergence.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/review_quality_guards_block_premature_stop.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/stop_on_max_iterations.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/cross_mode_anti_convergence_contract.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/stuck_recovery_widens_dimension_focus.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/validator_warn_rollout.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/stop_gate_graphless_fallback.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/reducer_search_debt.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/validator_strict_v2.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/stop_gate_candidate_coverage.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/graph_vocabulary.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/security_sensitive_fix_overrides.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/convergence_signals.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/divergent_convergence_mode.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/quality_gates.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/adversarial_self_check.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/claim_adjudication.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/severity_classification.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/verdicts.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/cross_mode_anti_convergence_contract.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/auto_mode_deep_review_kickoff.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/parameterized_invocation_max_iterations_convergence.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/confirm_mode_checkpointed_review.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_iteration.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_convergence.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_setup.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_report.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/security.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/correctness.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/maintainability.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/traceability.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_review_state.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/scope_discovery_and_dimension_ordering.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_review_state_halts_for_repair.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/fresh_review_initialization_creates_canonical_state_files.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/resume_after_pause_sentinel_removal.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/pause_sentinel_halts_between_review_iterations.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/malformed_jsonl_lines_are_skipped_with_defaults.md
.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/jsonl_reconstruction_from_review_iteration_files.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/findings_registry.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/config_management.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/strategy_tracking.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/graph_convergence_event.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/jsonl_state_log.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/pause_sentinel.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/dashboard.md
.opencode/skills/system-spec-kit/constitutional/post-implementation-deep-review.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/convergence_check.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/fanout_dispatch.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/iteration_dispatch.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/executor_selection_contract.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/synthesis.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/resource_map_coverage_gate.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/memory_save.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/initialization.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/resource_map_emission.md
.opencode/skills/system-deep-loop/deep-review/feature_catalog/feature_catalog.md

exec
/bin/zsh -lc 'wc -l .opencode/skills/system-deep-loop/SKILL.md .opencode/skills/system-deep-loop/deep-review/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     154 .opencode/skills/system-deep-loop/SKILL.md
     442 .opencode/skills/system-deep-loop/deep-review/SKILL.md
     596 total

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,240p' .opencode/skills/system-deep-loop/deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: deep-review
description: "Autonomous iterative code-review loop with externalized state, convergence detection, P0/P1/P2 findings, fresh context per pass."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query]
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iterations]"
version: 1.11.0.0
---
<!-- Note: Task is for the command executor (loop management); @deep-review agent is LEAF-only (no Task). No WebFetch: review is code-only. -->

<!-- Keywords: deep-review, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agents/*.md`
- Claude runtime: `.claude/agents/*.md`

Convergence threshold semantics and sibling-parity notes (deep-review 0.10 vs deep-research 0.05 vs deep-ai-council 0.20) live in `references/convergence/convergence.md` §1 under "Threshold Semantics and Sibling Parity".

## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code`'s code-review mode instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code` or `/speckit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/deep:review` command. The command's YAML workflow owns state, dispatch, and convergence.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize iterations (ad-hoc shell fan-out)
- Invoke cli-opencode / cli-claude-code directly in a loop to simulate iterations
- Manually write iteration prompts to `/tmp` and dispatch them via `copilot -p`
- Dispatch the `@deep-review` LEAF agent via the Task tool for iteration loops (the agent is LEAF, a single iteration, and MUST be driven by the command's workflow)
- Skip the state machine: `deep-review-state.jsonl`, `deep-review-config.json`, `deltas/`, `prompts/`, `logs/`
- Manage iteration state outside the resolved local review packet under `{spec_folder}/review/`

**COMMAND-DRIVEN FAN-OUT IS SUPPORTED:** use `--executor`/`--executors`/`--concurrency` flags on `/deep:review`. The command's YAML `step_fanout_spawn` owns multi-lineage dispatch; `fanout-merge.cjs` applies strongest-restriction (any lineage active P0 → merged FAIL). This is not ad-hoc shell dispatch — it is the canonical fan-out path. Intra-lineage wave orchestration remains deferred.

**ALWAYS:**
- Invoke via `/deep:review :auto` or `/deep:review :confirm`
- Let the command's YAML workflow own dispatch (auto: `.opencode/commands/deep/assets/deep_review_auto.yaml`)
- Let `scripts/reduce-state.cjs` be the SINGLE state writer
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'review')` from `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical review root

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `convergence review`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/protocol/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards markdown paths, checks `inventory`, and uses `seen`.
- Pattern 3: Extensible Routing Key - `get_routing_key()` derives the review phase from dispatch context.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns review disambiguation and missing phases return a "no review resources" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/protocol/quick_reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "convergence review", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local markdown assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/protocol/loop_protocol.md",
        "references/state/state_format.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
        "assets/deep_review_strategy.md",
        "references/state/state_jsonl.md",
    ],
    "REVIEW_ITERATION":   [
        "references/protocol/loop_protocol.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
        "references/state/state_outputs.md",
        "references/protocol/completion_criteria.md",
        "references/protocol/loop_state_and_gates.md",
        "references/convergence/convergence_recovery.md",
    ],
    "REVIEW_REPORT":      [
        "references/state/state_format.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
        "assets/deep_review_dashboard.md",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference", "resume deep review", "deep-review wave", "review artifact", "release-readiness audit", "convergence-tracked", "same session lineage", "P0"],
    "ON_DEMAND":         [
        "references/protocol/loop_protocol.md",
        "references/state/state_format.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
    ],
}

PHASE_RESOURCE_MAP = {
    "init": ["references/protocol/loop_protocol.md", "references/state/state_format.md", "references/state/state_outputs.md"],
    "iteration": ["references/protocol/loop_protocol.md", "references/convergence/convergence.md", "references/convergence/convergence_signals.md"],
    "stuck": ["references/convergence/convergence.md", "references/convergence/convergence_signals.md", "references/protocol/loop_protocol.md", "references/state/state_reducer_registry.md"],
    "synthesis": ["references/state/state_format.md", "references/state/state_outputs.md", "references/state/state_reducer_registry.md", "assets/deep_review_dashboard.md"],
}

NON_MARKDOWN_REFERENCES = {
    "review_contract": "assets/review_mode_contract.yaml",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the review target or spec folder",
    "Confirm the review phase",
    "Provide one concrete file, diff range, or expected finding class",
    "Confirm the verification command set before final review",
]

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

def get_routing_key(dispatch_context) -> str:
    phase = str(getattr(dispatch_context, "phase", "")).strip().lower()
    if phase:
        return phase
    text = str(getattr(dispatch_context, "text", "")).lower()
    if "recovery" in text:
        return "stuck"
    if "convergence" in text or "synthesis" in text:
        return "synthesis"
    if "iteration" in text or "dimension" in text:
        return "iteration"
    return "init"

def route_review_resources(task, dispatch_context):
    inventory = discover_markdown_resources()
    routing_key = get_routing_key(dispatch_context)
    scores = score_intents(task, INTENT_SIGNALS, NOISY_SYNONYMS)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    phase_resources = PHASE_RESOURCE_MAP.get(routing_key, [])
    if routing_key == "unknown" or not phase_resources:
        return {
            "routing_key": routing_key,
            "notice": f"No review resources found for routing key '{routing_key}'",

exec
/bin/zsh -lc "sed -n '241,520p' .opencode/skills/system-deep-loop/deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    for relative_path in phase_resources:
        load_if_available(relative_path)

    task_text = str(getattr(task, "text", "")).lower()
    if any(keyword in task_text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    return {
        "routing_key": routing_key,
        "intents": intents,
        "resources": loaded,
        "non_markdown_references": NON_MARKDOWN_REFERENCES,
    }
```

### Phase Detection

Detect the current review phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists in `review/` | Loop protocol, state format, state outputs, review contract |
| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, convergence signals, review contract |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, convergence signals, loop protocol, reducer registry |
| Synthesis | Convergence triggered STOP | Review contract, state format, state outputs, reducer registry |

---

## 3. HOW IT WORKS

### Resource Map Coverage Gate

When `{spec_folder}/resource-map.md` exists at init, deep review treats it as a mandatory audit input: `resource_map_present` is persisted in config, a map snapshot seeds `Known Context`, at least one iteration audits `target_files` coverage against the map (touched / not-touched `expected-by-scope`-vs-`gap` / absent-from-map, findings tagged `resource-map-coverage`), and synthesis adds the `## Resource Map Coverage Gate` report section plus a converged `resource-map.md` (disable via `--no-resource-map`). Absent at init, the gate and section are skipped without failing the loop. Full sequencing: `references/protocol/loop_protocol.md` (init 9a, iteration 3b, synthesis 4); schema: `references/state/state_format.md`.

### Bounded Context Snapshot Replacement

During initialization, capture a bounded, pointer-based context snapshot in `deep-review-strategy.md` `Known Context` before the first dimension runs: target pointers (files, specs, symbols, resource-map entries), claimed behavior/acceptance criteria to verify, reuse/convention pointers, and risk areas, missing context, stale-graph caveats, and out-of-scope areas. It must not create a context-loop report or widen scope beyond the declared target; use `@context` for quick retrieval and `/speckit:plan` only when findings require implementation planning.

### Architecture

`/deep:review` owns the loop. The YAML workflow initializes state, dispatches one LEAF review iteration at a time, evaluates convergence, synthesizes `review-report.md`, and saves continuity. The LEAF agent reads state, reviews one dimension, writes `iteration-NNN.md`, updates strategy, and appends JSONL. Full 4-phase lifecycle: `references/protocol/loop_protocol.md`.

### State Packet Location

The review state packet always lives under the target spec's local `review/` folder. Root-spec targets use `{spec_folder}/review/` directly; child-phase and sub-phase targets use **flat-first** placement (first run writes flat, a `pt-NN` sibling packet is allocated only when prior content already exists for a different target). Full resolution rule and worked examples: `references/state/state_format.md` §1.

Core artifacts: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `.deep-review-pause`, `resource-map.md`, `review-report.md`, and `iterations/iteration-NNN.md`.

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window; state continuity comes from files, not memory, preventing accumulated findings from biasing later dimensions. Init writes config/strategy/JSONL; each loop reads state, checks convergence, dispatches one dimension, records findings, and reduces state; synthesis compiles the report and saves continuity.

### Review Dimensions

The four primary review dimensions (configured in `assets/review_mode_contract.yaml`):

| Dimension | Focus | Key Questions |
|-----------|-------|---------------|
| **Correctness** | Logic, behavior, error handling | Behavior matches claims? Edge cases handled? |
| **Security** | Vulnerabilities, exposure, trust boundaries | Inputs validated? Credentials exposed? |
| **Spec-Alignment / Traceability** | Spec vs. implementation fidelity | Code matches spec.md? Planned items present? |
| **Completeness / Maintainability** | Coverage, dead code, documentation | TODOs resolved? Code self-documenting? |

### Lifecycle + Reducer Contract

Review mode is lineage-aware. Supported lifecycle modes are `new`, `resume`, and `restart`. Required lineage fields include `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, and `releaseReadinessState`. The reducer consumes the latest JSONL delta, the new iteration file, and prior reduced state, then emits finding registry, dashboard metrics, and strategy updates.

### Severity Classification

| Severity | Criteria | Blocking |
|----------|----------|---------|
| **P0** | Correctness failure, security vulnerability, spec contradiction | Yes, blocks PASS verdict |
| **P1** | Degraded behavior, incomplete implementation, missing validation | Conditional, triggers CONDITIONAL verdict |
| **P2** | Style, naming, minor improvements, documentation gaps | No, PASS with advisories |

### Verdicts

| Verdict | Condition |
|---------|-----------|
| **PASS** | No P0/P1 findings, P2 findings recorded as advisories (`hasAdvisories: true`) |
| **CONDITIONAL** | P1 findings present, remediation plan included in report |
| **FAIL** | Any P0 finding confirmed after adversarial self-check |

### Acceptance-Coverage Signal

When the review target is a spec folder, deep review reflects the `AC_COVERAGE` validation signal in synthesis for Level 2+ folders, and only once `checklist.md` exists and `implementation-summary.md` is in-progress or later (Level 1 folders and fresh scaffolds are exempt). The signal is advisory while the validation rule stays INFO/default-off -- it can add traceability context and planning-seed work, but must not alter the iteration final-line contract below unless a later enforcement rollout explicitly changes severity.

### Iteration Final-Line Contract (MANDATORY)

Every `iteration-NNN.md` MUST end with exactly one of the following plain-text lines as the **absolute final line** (no trailing whitespace, no variation), and every review MUST emit exactly one parseable verdict:

```
Review verdict: PASS
```

```
Review verdict: CONDITIONAL
```

```
Review verdict: FAIL
```

**Mapping rule:** PASS if no P0 or P1 findings in this iteration. CONDITIONAL if any P1 (but no P0) findings. FAIL if any P0 findings. P2-only findings → PASS.

**VERDICT_LOCK:** Any confirmed active P0 forces the exact final line `Review verdict: FAIL` -- never relabel that state as conditional, partial, mixed, or advisory, and truncated/partial output is not a valid substitute for the final line. An optional advisory `riskScore` may appear in narratives/JSONL for relative risk calibration but never changes the `PASS|CONDITIONAL|FAIL` mapping.

Downstream automation (including the synthesis phase and CI gate parser) parses this final line via exact string match, do not vary the format.

### Executor Selection Contract

Executor settings are owned by the YAML workflow and rendered prompt pack -- never hand-dispatch review iterations; each iteration stays LEAF-only and produces the required markdown plus JSONL delta. Full contract (per-iteration invariants, failure modes, JSONL audit field, config surface/precedence, TrustState surface): `references/protocol/loop_protocol.md`.

---

## 4. RULES

### ✅ ALWAYS

1. Read JSONL and strategy before review action.
2. Review one dimension per iteration and write findings to `iteration-NNN.md`.
3. Append JSONL with severity counts, finding detail, and `newInfoRatio`.
4. Cite every finding with `[SOURCE: file:line]`. Reject inference-only findings.
5. Re-read cited code before recording any P0.
6. Keep target files read-only.
7. Use `generate-context.js` for continuity saves. **Owner**: the YAML workflow (`deep_review_{auto,confirm}.yaml`) calls it at the save phase, not the reducer (`scripts/reduce-state.cjs`) directly — don't expect continuity-save side effects from the reducer alone.
8. Emit setup `BINDING:` lines before workflow output.
9. Refuse nested dispatch with: `REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.`

### ⛔ NEVER

1. **Dispatch sub-agents**, `@deep-review` is LEAF-only. It cannot dispatch additional agents. When dispatch is requested, use the canonical REFUSE wording (ALWAYS rule 14).
2. **Hold findings in context**, Write everything to iteration files. Context is discarded after each dispatch.
3. **Exceed TCB**, Target 8-11 tool calls per iteration (max 12). Breadth over depth per cycle.
4. **Ask the user**, Autonomous execution. The agent makes best-judgment decisions without pausing.
5. **Skip convergence checks**, Every iteration must be evaluated against convergence criteria before the next dispatch.
6. **Modify config after init**, `deep-review-config.json` is read-only after initialization.
7. **Modify files under review**, The review loop is observation-only. No code changes during audit.
8. **Use WebFetch**, Review is code-only. No external resource fetching is permitted.
9. **Implement fixes during review**, Report findings only. Implementation is a separate follow-up step.

### Iteration Status Enum

`complete | timeout | error | stuck | insight`

- `insight`: Low newInfoRatio but important finding that changes the verdict trajectory.

### ⚠️ ESCALATE IF

1. **3+ consecutive timeouts**, Infrastructure issue. Pause loop and report to user.
2. **State file corruption**, Cannot reconstruct iteration history from JSONL or iteration files.
3. **All dimensions covered with P0 findings remaining**, Human sign-off required before shipping.
4. **Security vulnerabilities discovered in production code**, Escalate immediately. Do not defer to report synthesis.
5. **All recovery tiers exhausted**, No automatic recovery path remaining in convergence protocol.

---

## 5. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/protocol/quick_reference.md`, `references/protocol/loop_protocol.md`, `references/convergence/convergence.md`, `references/convergence/convergence_signals.md`, `references/state/state_format.md`, `references/state/state_outputs.md`, `references/state/state_reducer_registry.md`, `assets/deep_review_dashboard.md`, `assets/deep_review_strategy.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/reduce-state.cjs`, `scripts/runtime-capabilities.cjs`.

Detailed contracts: `references/protocol/loop_protocol.md` (executor invariants, failure modes, config surface), `references/protocol/loop_state_and_gates.md` (state transitions, error handling, STOP-decision gates), `references/protocol/completion_criteria.md` (full loop-completion/quality-gate/validation-success checklist), and `references/state/state_reducer_registry.md` (two-tier content-hash dedup).

Related skills: `deep-research` for investigation loops, `sk-code`'s code-review mode for single-pass review doctrine, and `system-spec-kit` for command-owned state and continuity saves.

---

## 6. SUCCESS CRITERIA

A review loop is complete only when convergence and every quality gate agree: the composite stop score clears `compositeStopScore` (or `maxIterations` is hit without a false-positive STOP), every configured dimension plus required traceability protocols (`spec_code`, `checklist_evidence`) have at least one full iteration of coverage, all canonical state files exist and parse cleanly (`deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, one `iterations/iteration-NNN.md` per dispatched iteration), `review-report.md` carries all 9 core sections plus the conditional `## Resource Map Coverage Gate`, and continuity is saved via `generate-context.js`.

Nine binary quality gates must all pass before STOP is legal: config validity + lineage match, strategy initialization completeness, state/registry consistency, iteration completeness (markdown + JSONL delta), severity-field coverage on every finding (`severity`/`category`/`file:line`/`content_hash`), the advisory-only `riskScore` never gating verdict logic, adversarial P0 replay, dimension/protocol coverage stability, acceptance-coverage (advisory `AC_COVERAGE` signal when the spec-folder lifecycle predicate is active), and the security-sensitive override (`minStabilizationPasses=2` + fix-completeness replay) when the target touches security, path handling, env precedence, schema boundaries, persistence, or shared policy. Full gate-by-gate criteria and rationale: `references/protocol/completion_criteria.md`.

Validate a completed run with `skill_advisor.py "run a deep review loop" --threshold 0.8` (skill still surfaces) and `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (exits 0).

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md or AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: deep review, convergence review, iterative review)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3. The spec folder determines the `{spec_folder}/review/` state packet location
- **Continuity**: `/speckit:resume` is the operator-facing recovery surface, resolving context in the order `handover.md -> _memory.continuity -> spec docs`. During review, the agent writes iteration, strategy, and JSONL state; after synthesis, run `generate-context.js` to write canonical packet continuity
- **Command**: `/deep:review` is the primary invocation point

### Code Graph Integration

`code_graph_query + Grep` is available to `@deep-review` for semantic code search when Grep/Glob exact matching is insufficient: finding usages by concept/intent, locating implementations when exact symbol names are unknown, and cross-referencing behavior across unfamiliar code paths.

codex
The review packet’s no-web rule governs an actual code-review run; applying it here would contradict the requested outward SOTA research. I’m treating the packet as the target contract, not the execution vehicle, and will use web evidence only for this meta-research iteration. The skill also requires its quick reference on every load, so I’m reading that before the survey.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Deep Review Quick Reference
description: One-page cheat sheet for the autonomous deep review loop.
trigger_phrases:
  - "deep review quick reference"
  - "review loop cheat sheet"
  - "p0 p1 p2 severity ladder"
  - "release readiness verdicts"
  - "review loop troubleshooting"
importance_tier: normal
contextType: general
version: 1.11.0.16
---

# Deep Review Quick Reference

One-page cheat sheet for the autonomous deep review loop.

---

## 1. OVERVIEW

### Purpose

Use this quick reference when you need the command shape, artifact names, convergence rules, and synthesis outputs for the autonomous deep-review loop without loading the full protocol references.

### When to Use

- Looking up the canonical `/deep:review` invocation without re-reading the full SKILL.md.
- Confirming default thresholds, verdicts, or release-readiness states at a glance.
- Refreshing the artifact-name and packet-file checklist before a manual orchestration pass.
- Triaging a stuck loop and need the fastest path to convergence semantics.

### Commands

| Command | Description |
|---------|-------------|
| `/deep:review:auto "target"` | Run autonomous review (no approval gates) |
| `/deep:review:confirm "target"` | Run review with approval gates at each iteration |
| `/deep:review "target"` | Ask which mode to use |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 7 | Maximum review iterations |
| `--convergence` | 0.10 | Base sensitivity for review convergence |
| `--stop-policy` | convergence | Use `max-iterations` when convergence must not end the run before the iteration ceiling |
| `--spec-folder` | auto | Target spec folder path |
| `--restart` | off | Archive the current review packet and start a fresh lineage |
| `--severity-threshold` | P2 | Minimum severity to report |

---

## 2. WHEN TO USE

| Scenario | Use |
|----------|-----|
| Multi-pass code quality audit | `/deep:review` |
| Simple single-pass code review | `sk-code` (code-review mode) |
| Pre-release readiness check | `/deep:review:auto "spec folder"` |
| Spec/implementation alignment check | `/deep:review:auto "skill sk-name"` |
| Deep technical investigation | `/deep:research` (different skill) |

---

## 3. ARCHITECTURE

```
/deep:review  -->  YAML workflow  -->  @deep-review agent (LEAF)
    |                    |                      |
    |                    |                      +-- Read state
    |                    |                      +-- Review (3-5 actions)
    |                    |                      +-- Write findings (P0/P1/P2)
    |                    |                      +-- Update state
    |                    |
    |                    +-- Init (config, strategy, state)
    |                    +-- Loop (dispatch, evaluate, decide)
    |                    +-- Synthesize (review-report.md)
    |                    +-- Save (memory context)
```

---

## 4. STATE FILES

Review mode stores its packet under the resolved local review path rooted at `{spec_folder}/review/`:

| File | Location | Format | Purpose |
|------|----------|--------|---------|
| Config | `review/deep-review-config.json` | JSON | Review parameters (immutable) |
| State | `review/deep-review-state.jsonl` | JSONL | Iteration log (append-only) |
| Registry | `review/deep-review-findings-registry.json` | JSON | Reducer-owned finding registry |
| Strategy | `review/deep-review-strategy.md` | Markdown | Dimensions, findings, next focus |
| Dashboard | `review/deep-review-dashboard.md` | Markdown | Auto-generated review dashboard |
| Iterations | `review/iterations/iteration-NNN.md` | Markdown | Per-iteration findings (write-once) |
| Report | `review/review-report.md` | Markdown | Final 9-section review report |
| Pause | `review/.deep-review-pause` | Sentinel | Pause between iterations |

### Lifecycle Modes

| Mode | Effect |
|------|--------|
| `resume` | Continue the current review lineage without resetting generation |
| `restart` | Archive current review state and start a new generation |
| `fork` (deferred) | Reserved. Start a sibling lineage branch with explicit parent linkage. Not runtime-wired. |
| `completed-continue` (deferred) | Reserved. Snapshot the completed review and reopen it for amendment-only review deltas. Not runtime-wired. |

---

## 5. REVIEW DIMENSIONS

| ID | Dimension | Priority | Description |
|----|-----------|----------|-------------|
| D1 | Correctness | 1 | Logic errors, off-by-one, wrong return types, broken invariants |
| D2 | Security | 2 | Injection, auth bypass, secrets exposure, unsafe deserialization |
| D3 | Traceability | 3 | Spec/code alignment, checklist evidence, cross-reference integrity |
| D4 | Maintainability | 4 | Patterns, clarity, documentation quality, ease of safe follow-on changes |

---

## 6. REVIEW VERDICTS

| Verdict | Condition | Meaning | Next Command |
|---------|-----------|---------|--------------|
| FAIL | Active P0 findings remain OR any binary gate fails | Does not meet quality standards | `/speckit:plan` for remediation |
| CONDITIONAL | No P0, but active P1 findings remain | Meets threshold but has required fixes | `/speckit:plan` for fixes |
| PASS | No active P0/P1 findings | Shippable, set `hasAdvisories=true` when P2 findings remain | `/create:changelog` |

### Release Readiness

`releaseReadinessState` is the canonical config/report field for review readiness tracking.

| State | Meaning |
|-------|---------|
| `in-progress` | Review still running or required coverage incomplete |
| `converged` | All 4 dimensions covered and the stabilization pass found no new P0/P1 findings |
| `release-blocking` | At least one unresolved P0 remains active |

---

## 7. REVIEW QUALITY GUARDS

| Gate | Rule |
|------|------|
| Evidence | Every active finding has file:line evidence and is not inference-only |
| Scope | Findings and reviewed files stay within declared review scope |
| Coverage | Configured dimensions plus required traceability protocols are covered before STOP |

---

## 8. REVIEW CONVERGENCE

| Signal | Weight | Description |
|--------|--------|-------------|
| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `0.08` |
| MAD Noise Floor | 0.25 | Latest ratio within noise floor |
| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with `minStabilizationPasses >= 1` |

**Key defaults:** `maxIterations=7`, `convergenceThreshold=0.10`, `rollingStopThreshold=0.08`, `noProgressThreshold=0.05`, `stuckThreshold=2`, `minStabilizationPasses=1`

**P0 override:** Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence.

---

## 9. AGENT ITERATION CHECKLIST

Each @deep-review iteration:
1. Read `deep-review-state.jsonl`, `deep-review-findings-registry.json`, and `deep-review-strategy.md`
2. Determine focus dimension from strategy "Next Focus"
3. Execute 3-5 review actions (Read, Grep, Glob, code_graph_query + Grep)
4. Write `review/iterations/iteration-NNN.md` with P0/P1/P2 findings
5. Run adversarial self-check on any P0 findings (Hunter/Skeptic/Referee)
6. Update `deep-review-strategy.md` (findings, coverage, next focus)
7. Append iteration record to `deep-review-state.jsonl`

---

## 10. REVIEW REPORT SECTIONS

| # | Section | Purpose |
|---|---------|---------|
| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` |
| 2 | Planning Trigger | Why the verdict routes to planning or changelog follow-up |
| 3 | Active Finding Registry | Deduped active findings with evidence and final severity |
| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
| 5 | Spec Seed | Minimal spec delta derived from review results |
| 6 | Plan Seed | Action-ready plan starter for remediation |
| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
| 8 | Deferred Items | P2 advisories, blocked checks, and follow-up items |
| 9 | Audit Appendix | Coverage, replay validation, and convergence evidence |

---

## 11. TUNING GUIDE

| Goal | Adjustment |
|------|------------|
| Deeper review | Lower convergence (0.05), raise max iterations (10) |
| Forced iteration ceiling | Set `--stop-policy=max-iterations` with the desired `--max-iterations` |
| Faster completion | Raise convergence (0.15), lower max iterations (5) |
| Focus on security | Specify `--dimensions security,correctness` |
| Broad coverage | Use all 4 default dimensions and allow the stabilization pass to run |

---

## 12. TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Stops too early | Lower `--convergence` from 0.10 to 0.05, or use `--stop-policy=max-iterations` when early convergence is unacceptable |
| Stuck on one dimension | Check strategy.md "Next Focus" rotation |
| P0 findings blocking convergence | Expected behavior: P0 override prevents premature stop |
| Review-report missing sections | Verify synthesis phase completed (check state.jsonl for synthesis event) |
| Agent ignores state | Verify file paths in dispatch prompt |

---

## 13. RELATED

| Resource | Purpose |
|----------|---------|
| `deep-research` | Investigation/research (not review) |
| `sk-code` (code-review mode) | Single-pass code review |
| `@deep-review` | Single review iteration agent (LEAF) |
| `@context` | Single-pass codebase search |
| `generate-context.js` | Memory save script |

For review-specific protocol documentation, see local `references/`:
- `loop_protocol.md`, Review loop lifecycle (4 phases)
- `../state/state_format.md`, Review state file schemas
- `../convergence/convergence.md`, Review convergence algorithms

codex
The current contract confirms the gap to test: deep-review rotates four coarse dimensions, accepts `file:line` evidence, adversarially replays only P0s, and maps severity directly to verdict. I’m now checking whether current reviewers add mechanisms around repository memory, confidence/feedback suppression, change-request semantics, and executable verification—areas the packet does not currently model.
web search: 
web search: site:docs.coderabbit.ai code review false positives severity confidence incremental reviews 2025 ...
web search: 
web search: Greptile AI code review documentation custom rules feedback false positive repository context official ...
web search: 
web search: site:github.com/qodo-ai/pr-agent GitHub stars latest release 2026 ...
web search: 
web search: https://github.com/qodo-ai/pr-agent
web search: 
web search: 'stars'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:qodo.ai/blog 2025 agentic code review multiple agents false positives Qodo Merge ...
web search: 
web search: repo:The-PR-Agent/pr-agent suggestions_score_threshold pr_code_suggestions.py ...
web search: 
web search: Qodo Code Review Benchmark 1.0 GitHub dataset 580 defects 100 PRs ...
web search: 
web search: 
codex
The strongest pattern is now clear: leading systems do not treat “severity” as proof. They separate broad discovery from independent validation, then learn which validated comments developers actually act on. Deep-review currently has the expensive half—fresh passes and durable state—but lacks that explicit candidate→proof→outcome lifecycle, which is where its moat can be sharpened.
web search: 
web search: site:graphite.com/docs AI review rules exclusions effectiveness downvote learn false positive ...
codex
The competitive baseline has moved: fresh multi-pass review is no longer a moat. Cursor and Qodo already parallelize discovery and validate findings; CodeRabbit and Greptile maintain cross-commit context; Semgrep learns suppressions. Deep-review’s defensible opportunity is a transparent, longitudinal proof ledger that turns review claims into reproducible evidence and follows them through remediation.

### Comparative delta

| System | 2025–2026 mechanism | What deep-review lacks | Target |
|---|---|---|---|
| CodeRabbit | Full first review, commit-delta reviews, previous-comment reconciliation, five severity levels, feedback learnings | Commit-aware finding invalidation and explicit full-vs-incremental review semantics | deep-review, continuity-threading |
| Greptile | Repository graph, scoped rules, P0/P1/P2 comments, PR confidence score, learning from reactions and implemented suggestions | Durable, scoped adjudication memory and empirical comment-utility feedback | deep-review, dedup-novelty, gauges |
| Cursor Bugbot | Originally eight randomized-diff passes, semantic clustering, majority voting, category filtering, validator model, previous-run dedup; subsequently moved to tool-using agentic discovery | Claim-level corroboration. Deep-review’s serial dimension passes do not independently replicate a candidate, and only P0 gets adversarial replay. [Cursor reports resolution rate rising from 52% to over 70% across 40 experiments.](https://cursor.com/blog/building-bugbot) | deep-review, fan-out-fan-in |
| Graphite Agent/Diamond | Per-rule and per-exclusion acceptance, downvote, and filtering-effectiveness metrics | Outcome-grounded calibration; current convergence measures novelty, not whether findings cause justified changes. [Graphite documents these metrics explicitly.](https://graphite.com/docs/ai-review-customization) | deep-review, gauges-observability |
| Semgrep Assistant | Deterministic SAST candidates followed by separate true-positive and false-positive reasoning chains; scoped, visible, reversible “Memories”; action only above a fixed accuracy bar | Deep-review conflates discovery and adjudication and has no auditable suppression-memory lifecycle. Semgrep reports more than 96% user agreement while triaging roughly 60% of incoming findings, though this remains vendor-reported. [Semgrep’s design account](https://semgrep.dev/blog/2025/semgrep-is-confidently-handling-60-of-all-triage-for-users-without-reducing-coverage/) | deep-review, state-jsonl-checkpointing |
| Qodo 2.0 | More than a dozen specialist agents plus a judge that resolves conflicts, deduplicates, and filters below confidence/relevance thresholds; separate Precise and Exhaustive operating points | Four serial dimensions are too coarse, while strongest-restriction fan-in lets one erroneous P0 determine FAIL. Deep-review has no selectable precision/recall policy. [Qodo’s 2026 architecture description](https://www.qodo.ai/blog/Introducing-qodo-2.0-agentic-code-review/) | deep-review, fan-out-fan-in, budget-cost |
| Devin Review | Separates actionable Bugs from Investigate/Informational Flags, then assigns severe/non-severe impact within the actionable class | P0/P1/P2 currently mixes impact, confidence, and required action into one field. [Devin’s current taxonomy](https://docs.devin.ai/work-with-devin/devin-review) | deep-review |
| SWE-style verification | SWE-smith retains generated defects only when they break tests in isolated Docker environments; Code Review Bench cross-checks fixed, human-curated ground truth against continuously sampled post-review developer actions | No executable `ProofReceipt`, base/head differential reproduction, or offline/online review benchmark | deep-review, gauges-observability, locks-recovery |

### Concrete improvements

1. **Split discovery from adjudication.** Let specialist passes search aggressively, but store outputs as candidates rather than findings. Cluster candidates, record support by lineage/model/diff ordering, then dispatch a separate verifier. Every verdict-affecting P0 or P1 should require either deterministic evidence, executable reproduction, or independent cross-file reasoning. Cursor’s randomized passes are a useful diversity perturbation, but agreement alone is not proof.

2. **Replace scalar severity with factored classification.** A record should independently carry `impact`, `confidence`, `action`, `evidence_kind`, `reachability`, and `lifecycle_state`. A plausible catastrophic issue becomes `impact=critical, confidence=low, action=investigate`, not an immediate P0/FAIL. This removes the current false equivalence between severity and certainty.

3. **Uniqueness-sharpening: make deep-review an evidence-compounding reviewer.** Add immutable proof receipts containing base/head SHAs, command, environment hash, observed base/head outcomes, and artifact hashes. On later commits, replay receipts to move findings through `candidate → corroborated → reproduced → confirmed → fixed → regressed`, while scoped suppression memories remain visible, reversible, and periodically shadow-audited.

That third mechanism is the moat. Commercial reviewers increasingly do multi-agent discovery, incremental comments, and preference learning. Deep-review can instead own a review across time: falsify its own claims, preserve why a release was blocked, verify remediation without modifying the target, and detect regression after apparent closure. Deep-research accumulates external claims, council deliberates choices, alignment checks a named authority, and improvement mutates candidates; only deep-review should own reproducible code-risk evidence and the release verdict.

One caution: developer acceptance or a subsequent code change is a useful online signal, not ground truth. Code Review Bench handles this correctly by pairing its continuously sampled outcome benchmark with a fixed human-curated benchmark rather than optimizing solely for comment acceptance. [Its open pipeline exposes extraction, deduplication, judging, and per-judge results.](https://github.com/withmartian/code-review-benchmark)

```json
{
  "new_repos": [
    {
      "name": "The-PR-Agent/pr-agent",
      "url": "https://github.com/The-PR-Agent/pr-agent",
      "stars": "~12.1k",
      "what": "Open-source legacy PR reviewer; release v0.39.0 published July 5, 2026, with dynamic context, token-aware compression, and suggestion self-reflection.",
      "lesson": "pr_agent/tools/pr_code_suggestions.py and its documented second-pass 0-10 scoring show a concrete candidate re-ranking stage, while dynamic context expands hunks toward enclosing functions/classes instead of blindly adding lines.",
      "maps_to": [
        "deep-review",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "semgrep/semgrep",
      "url": "https://github.com/semgrep/semgrep",
      "stars": "~15.9k",
      "what": "Deterministic multi-language static-analysis engine; v1.169.0 released July 8, 2026.",
      "lesson": "Use deterministic analyzers as high-recall candidate producers before LLM adjudication; Semgrep Assistant's commercial scoped-memory layer is documented separately and is not implemented in this repository.",
      "maps_to": [
        "deep-review",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "SWE-bench/SWE-smith",
      "url": "https://github.com/SWE-bench/SWE-smith",
      "stars": "~702",
      "what": "NeurIPS 2025 Spotlight toolkit that builds Dockerized repository environments and synthesizes test-breaking software-engineering tasks.",
      "lesson": "Its RepoProfile/get_container abstraction and keep-only-if-a-test-breaks filter are transferable to isolated base/head reproduction receipts for review findings.",
      "maps_to": [
        "deep-review",
        "runtime/locks-recovery",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "withmartian/code-review-benchmark",
      "url": "https://github.com/withmartian/code-review-benchmark",
      "stars": "~208",
      "what": "2026 open benchmark with fixed human-curated PR issues plus a continuously refreshed online benchmark of bot comments and subsequent developer actions.",
      "lesson": "Adopt its offline/online cross-check, explicit candidate dedup stage, per-judge result storage, and precision/recall stratification instead of optimizing review convergence alone.",
      "maps_to": [
        "deep-review",
        "runtime/gauges-observability",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A review pass should emit candidates, not verdict-bearing findings; semantic clustering, claim-level replication, and a separately prompted validator should precede P0/P1 activation.",
      "evidence": "https://cursor.com/blog/building-bugbot",
      "maps_to": [
        "deep-review",
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Impact, confidence, actionability, evidence type, and reachability are orthogonal. Encoding all of them in P0/P1/P2 makes low-confidence catastrophic hypotheses indistinguishable from reproduced blockers.",
      "evidence": "https://docs.devin.ai/work-with-devin/devin-review ; https://semgrep.dev/docs/semgrep-secrets/view-triage",
      "maps_to": [
        "deep-review",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "False-positive learning should produce scoped, inspectable suppression records with rationale, applicability conditions, expiry or invalidation triggers, and shadow-audit results—not opaque prompt memory.",
      "evidence": "https://semgrep.dev/blog/2025/making-zero-false-positive-sast-a-reality-with-ai-powered-memory/ ; https://www.greptile.com/docs/code-review-bot/custom-context",
      "maps_to": [
        "deep-review",
        "runtime/dedup-novelty",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "The meaningful optimization target is a precision-recall frontier plus downstream resolution and rebuttal rates, stratified by category and severity; novelty convergence alone cannot detect a confidently noisy reviewer.",
      "evidence": "https://github.com/withmartian/code-review-benchmark ; https://www.qodo.ai/blog/how-we-built-a-real-world-benchmark-for-ai-code-review/",
      "maps_to": [
        "deep-review",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add a two-lane candidate/proof pipeline. Discovery waves emit FindingCandidate records with semantic cluster key, lineage, model, diff-order seed, and evidence pointers; a separate verifier emits ProofReceipt records. Require proof or independent corroboration for every verdict-affecting P0/P1, not only P0.",
      "target": "deep-review + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing",
      "rationale": "This preserves aggressive recall while preventing a single hallucinated lineage from poisoning strongest-restriction fan-in.",
      "uniqueness": "Deep-review becomes a transparent adversarial adjudicator rather than another multi-agent comment generator.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://cursor.com/blog/building-bugbot ; https://www.qodo.ai/blog/Introducing-qodo-2.0-agentic-code-review/"
    },
    {
      "rec": "Replace scalar P0/P1/P2 storage with factored impact, confidence, action, evidence_kind, reachability, and lifecycle fields; retain P0/P1/P2 only as a derived presentation projection. Add scoped suppression-memory events with previewed blast radius, expiry/invalidation conditions, and sampled shadow audits.",
      "target": "deep-review + runtime/dedup-novelty + runtime/gauges-observability",
      "rationale": "It separates dangerous-but-unverified hypotheses from confirmed blockers and turns repeated adjudication into controlled institutional knowledge.",
      "uniqueness": "Externalized, reversible adjudication history can compound across runs without contaminating fresh discovery contexts.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://docs.devin.ai/work-with-devin/devin-review ; https://semgrep.dev/blog/2025/making-zero-false-positive-sast-a-reality-with-ai-powered-memory/"
    },
    {
      "rec": "Introduce executable finding closure: selectively generate a minimal reproduction or test in an isolated clean worktree, run it against base and head, hash the environment and outputs, then replay the receipt after remediation commits. Benchmark the mode with both seeded test-breaking defects and online resolution/rebuttal outcomes.",
      "target": "deep-review + runtime/locks-recovery + runtime/continuity-threading + runtime/gauges-observability",
      "rationale": "A reproducible base/head behavioral delta is stronger evidence than model agreement, while replay closes the loop on incomplete fixes and regressions.",
      "uniqueness": "This is the moat: a longitudinal, falsifiable release-risk ledger that single-shot reviewers and the other deep modes do not own.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/SWE-bench/SWE-smith ; https://github.com/withmartian/code-review-benchmark"
    }
  ],
  "contradictions": [
    {
      "claim": "High comment precision or developer acceptance is sufficient evidence that a reviewer is effective.",
      "counter": "High precision can hide very low recall, while developer action may reflect preference or workflow pressure rather than correctness. Pair fixed human-curated ground truth with fresh online outcomes and report both operating points.",
      "evidence": "https://www.qodo.ai/blog/how-we-built-a-real-world-benchmark-for-ai-code-review/ ; https://github.com/withmartian/code-review-benchmark"
    }
  ],
  "next_angles": [
    "Design the exact FindingCandidate, ProofReceipt, SuppressionMemory, and lifecycle-event schemas plus reducer invariants and backward projection to P0/P1/P2.",
    "Benchmark claim-level replication strategies: randomized diff ordering, specialist prompts, model diversity, and tool diversity, measuring marginal recall and validator precision per dollar.",
    "Build an immutable-verifier threat model so a generated reproduction cannot overwrite tests, weaken commands, or otherwise manufacture a green proof receipt.",
    "Study longitudinal review datasets that distinguish fixed, rebutted, ignored, superseded, and workflow-rejected findings instead of treating every unaccepted comment as a false positive."
  ],
  "notes": "Commercial implementations for CodeRabbit, Greptile, Cursor Bugbot, Graphite Agent, Qodo 2.0, Devin Review, and Semgrep Assistant are not fully open. Their mechanisms and performance figures are therefore drawn from current first-party documentation and should be treated as architectural evidence, not directly comparable independent benchmarks. Star counts were verified from GitHub on 2026-07-15."
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
162,084
