<!-- iteration 10 | SOL xhigh | mode: deep-review | angle: A5-synth deep-review :: synthesis & highest-leverage recs | 2026-07-15T08:49:39.767Z -->

Deep-review’s moat should be **stateful semantic change assurance**, not “the same diff reviewed repeatedly.” A single-shot reviewer produces plausible comments; deep-review should produce an auditable argument about what behavior changed, which risks were exercised, what evidence falsified each concern, and what remains uncertain.

The highest-leverage change is to review a **semantic residual** rather than the raw patch:

`raw diff − syntax-only changes − modeled equivalences = behavior requiring review`

[Difftastic](https://github.com/Wilfred/difftastic) provides a cheap AST-level filter and conservative fallback, while Infer 1.3’s new `infer/src/semdiff` goes further with equality saturation and configurable rewrite rules. Infer’s CI workflow also already distinguishes `introduced`, `fixed`, and `preexisting` findings—exactly the lineage deep-review needs across patch revisions. [Infer](https://github.com/facebook/infer) is active at roughly 15.7k stars with a May 2026 release.

The residual should then become an **obligation graph**, not file-oriented fan-out. Anchor each changed symbol to affected callers, data-flow paths, observable sinks, relevant tests, and unmodeled boundaries. Joern’s `joern-slice data-flow` already emits JSON `{nodes, edges}` with file, method, type, and location metadata; its interprocedural slicing supports depth, sink, method, annotation, and file filters. That gives deep-review a concrete coverage unit: `changed node → observable boundary`, rather than “reviewed file.” [Joern’s slicing documentation](https://docs.joern.io/cpg-slicing/) also exposes the main trade-off: deep slices are expensive and external-call semantics need project-specific modeling.

Each obligation should have a falsifiable lifecycle:

```text
suspected → witnessed | falsified | residual-risk
witnessed → fixed-pending → fixed-verified | regressed
```

Its stable identity should combine symbol identity, normalized AST path, semantic-expression hash, and slice-boundary hash—not line numbers. Evidence receipts should record the base/head SHAs, verifier command digest, selected tests, exit status, relevant output hash, and independent verifier pass. `review-report.md` then becomes an assurance case: closed obligations, falsified claims, confirmed defects, and explicit residual risks.

Dynamic evidence belongs late in the escalation ladder. Collector-Sahab’s `matched-line-finder → trace-collector → trace-diff` pipeline demonstrates a useful before/after witness mechanism, but its evaluation contains the critical warning: 96% of sampled augmented diffs were correct, yet only 55% were causally related to the intended change; timestamps and random paths created irrelevant differences. Dynamic witnesses therefore need repeated-seed stability, volatility filtering, and slice proximity before affecting severity. [Paper and evaluation](https://arxiv.org/abs/2212.11077).

The resulting differentiator is sharp: other deep modes research, deliberate, improve, or align artifacts. Deep-review alone owns an executable before/after relation and can repeatedly challenge claims against code, tests, traces, and constrained equivalence checkers. Its product is not “more findings.” It is **bounded confidence about a change**, including proof of what was checked and honest accounting of what could not be checked.

```json
{
  "new_repos": [
    {
      "name": "facebook/infer",
      "url": "https://github.com/facebook/infer",
      "stars": "~15.7k",
      "what": "Compositional static analyzer; v1.3.0 released May 2026 added equality-saturation Semdiff and strengthened incremental analysis.",
      "lesson": "Normalize semantically irrelevant changes before review and retain introduced/fixed/preexisting issue lineage across patch revisions.",
      "maps_to": ["deep-review", "runtime/continuity-threading", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "name": "joernio/joern",
      "url": "https://github.com/joernio/joern",
      "stars": "~3.3k",
      "what": "Cross-language code-property-graph platform with interprocedural data-flow slicing and a July 2026 release.",
      "lesson": "Define review coverage as JSON program slices from changed nodes to callers, data-flow sources, and observable sinks rather than changed files.",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "Wilfred/difftastic",
      "url": "https://github.com/Wilfred/difftastic",
      "stars": "~25.6k",
      "what": "Tree-sitter structural diff using graph search; v0.69.0 released April 2026.",
      "lesson": "Use AST equality as a cheap first-stage noise filter, while preserving a conservative raw-diff fallback on parse errors or unsupported languages.",
      "maps_to": ["deep-review", "runtime/budget-cost", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "name": "ASSERT-KTH/collector-sahab",
      "url": "https://github.com/ASSERT-KTH/collector-sahab",
      "stars": "~10",
      "what": "Before/after Java runtime-state differencer split into matched-line, trace-collection, and trace-diff modules; latest release September 2024.",
      "lesson": "Attach concise runtime witnesses to review claims, but filter unstable and causally unrelated values before using them as severity evidence.",
      "maps_to": ["deep-review", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "diffkemp/diffkemp",
      "url": "https://github.com/diffkemp/diffkemp",
      "stars": "~43",
      "what": "LLVM-based semantic-equivalence comparison for selected functions in large C projects; latest release August 2024.",
      "lesson": "Escalate high-risk refactor obligations to selective before/after equivalence checks and report unsupported transformations as residual risk, not equality.",
      "maps_to": ["deep-review", "runtime/budget-cost"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Construct a semantic residual by subtracting syntax-equivalent and explicitly modeled semantics-preserving edits before allocating LLM review passes.",
      "evidence": "https://github.com/facebook/infer/blob/main/Changelog.md and https://github.com/Wilfred/difftastic",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "insight": "The natural path-coverage cell for deep-review is changed semantic node to affected observable boundary, represented as a program slice with explicit unmodeled external calls.",
      "evidence": "https://docs.joern.io/cpg-slicing/ and https://docs.joern.io/dataflow-semantics/",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/convergence"],
      "confidence": "high"
    },
    {
      "insight": "Finding continuity should use introduced/fixed/preexisting lineage plus stable semantic anchors, allowing deep-review to distinguish a resolved defect from one moved or re-expressed by a later patch.",
      "evidence": "https://fbinfer.com/docs/steps-for-ci/",
      "maps_to": ["deep-review", "runtime/continuity-threading", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "A runtime difference is a witness, not a verdict: it must pass stability, causal-proximity, and relevance checks before changing finding confidence.",
      "evidence": "https://arxiv.org/abs/2212.11077",
      "maps_to": ["deep-review", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Selective semantic-equivalence checking is best used as the expensive terminal verifier for scoped high-risk functions; inability to prove equivalence must remain distinct from a demonstrated behavior change.",
      "evidence": "https://github.com/diffkemp/diffkemp",
      "maps_to": ["deep-review", "runtime/budget-cost"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Build a semantic-obligation planner: normalize the diff, assign stable symbol/AST anchors, expand each residual through call/data-flow slices to observable boundaries, and fan out passes by obligation rather than file. Expose build_obligations(base_sha, head_sha) returning anchor, residual_kind, callers, sinks, tests, unmodeled_boundaries, and confidence.",
      "target": "deep-review",
      "rationale": "It removes mechanical review noise and gives multi-pass review an explicit, measurable coverage surface. Start with Difftastic-style AST checks and language adapters; add equality rules and CPG slicing incrementally.",
      "uniqueness": "This turns deep-review from repeated comment generation into path-accountable semantic change analysis, which single-shot reviewers and linters do not provide.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/facebook/infer and https://docs.joern.io/cpg-slicing/"
    },
    {
      "rec": "Add a proof-carrying finding ledger with suspected, witnessed, falsified, residual-risk, fixed-pending, fixed-verified, and regressed states. Persist semantic anchors and verifier receipts, require an independent falsifier pass for P0/P1, and render review-report.md as obligations plus evidence plus residual risk.",
      "target": "deep-review",
      "rationale": "Fresh-context passes retain independence without rediscovering the same claims, and later patches can be judged as fixes, relocations, or regressions.",
      "uniqueness": "The durable falsification history is the moat: a PR bot offers a snapshot, while deep-review supplies an evolving assurance argument across patch revisions.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://fbinfer.com/docs/steps-for-ci/"
    },
    {
      "rec": "Implement an obligation-specific verification ladder: static path or analyzer witness, targeted before/after test, stable runtime-state difference across seeds, mutation or differential test, then scoped semantic-equivalence checking. A P0/P1 must carry an executable counterexample, a sound analyzer path, or an explicit unverified-residual label explaining why verification was unavailable.",
      "target": "deep-review",
      "rationale": "It converts plausible findings into reproducible evidence while spending expensive verification only on unresolved high-risk obligations.",
      "uniqueness": "Deep-review becomes the mode that actively tries to disprove its own findings and verifies fixes against the same witness, beyond both lint rules and one-pass LLM judgment.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/ASSERT-KTH/collector-sahab and https://github.com/diffkemp/diffkemp"
    }
  ],
  "contradictions": [
    {
      "claim": "A syntax-aware diff identifies behavior-preserving changes.",
      "counter": "Difftastic explicitly compares syntax rather than semantics, treats ordering as significant, and falls back to line diffs on parse failures; AST equality is only a cheap filter.",
      "evidence": "https://github.com/Wilfred/difftastic"
    },
    {
      "claim": "A correct runtime difference is relevant evidence for the reviewed change.",
      "counter": "Collector-Sahab reported 96% correctness on 29 sampled augmented diffs but only 55% causal relation; timestamps, random paths, and unrelated state can dominate.",
      "evidence": "https://arxiv.org/abs/2212.11077"
    },
    {
      "claim": "Failure to establish semantic equivalence demonstrates a behavioral regression.",
      "counter": "DiffKemp is explicitly incomplete and can report false non-equivalence, especially under complex refactoring; unknown and counterexample must be separate outcomes.",
      "evidence": "https://github.com/diffkemp/diffkemp"
    }
  ],
  "next_angles": [
    "Benchmark raw-diff versus semantic-residual review on refactor-heavy PRs, measuring token cost, obligation coverage, accepted findings, and missed regressions.",
    "Design causal filtering for runtime witnesses using repeated seeds, environment normalization, changed-slice proximity, and input intervention.",
    "Evaluate semantic-anchor survival across rebases, symbol moves, generated-code changes, and partial fix commits; measure false finding closure and duplicate resurrection.",
    "Learn a language- and risk-specific verifier escalation policy from historical obligation outcomes, including verifier setup failures and time-to-counterexample."
  ],
  "notes": "The main remaining gap is empirical: structural filtering, program slicing, runtime differencing, and semantic equivalence are individually supported, but their composition into a longitudinal review-obligation system has not been benchmarked. Coverage must also expose unsupported languages, unresolved dynamic dispatch, missing dependency semantics, flaky traces, and unavailable build/test environments rather than silently treating them as reviewed."
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
session id: 019f64f4-aee5-7520-9b2b-61baf44392fd
--------
user
You are iteration 10/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-review
MODE IDENTITY (what it does today): Autonomous iterative code-review loop: externalized state, convergence detection, P0/P1/P2 findings, adversarial verify, fresh context per pass, review-report.md.
GENERIC ALTERNATIVE it must out-value: a single-shot LLM PR reviewer (CodeRabbit, Greptile, Cursor Bugbot) or a static linter

THIS ITERATION'S ANGLE (A5-synth): deep-review :: synthesis & highest-leverage recs
DIRECTIVE: Synthesis pass for deep-review. Highest-leverage MODE-SPECIFIC recommendations (impact x effort) + a sharp 'why deep-review is uniquely valuable and how we make it more so' thesis. Remaining gaps + next_angles.

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
THIS run's new repos so far (32) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy
Modes covered so far this run: deep-research | deep-review
New insights so far: 34; recommendations: 24.
Open threads flagged: Benchmark the evidence-independence taxonomy on longitudinal review histories: accepted, rebutted, ignored-risk, superseded, workflow-rejected, and later-regressed findings. | Specify suppression invalidation from program slices, symbol identities, dependency manifests, build flags, and verifier-command digests, then measure false carry-forward versus line-overlap invalidation. | Mine changed-code features and historical misses to learn mandatory concurrency, compatibility, security, and test-quality coverage cells and their minimum evidence depth. | Build an online shadow-canary protocol and compare Bayesian change-point detection against fixed thresholds after model, prompt, or tool updates. | Adversarially test reducer-derived verdicts against truncation, duplicate JSON keys, hidden findings, narrative-verdict contradictions, and final-line injection. | Run controlled context-ladder experiments by reasoning-distance cell to learn when local slices, call graphs, tests, or cross-file contracts improve Type2 and Type3 detection.

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
This is a read-only synthesis pass; no files will be changed, so the spec-folder choice is not applicable. I’m using live web evidence to verify current repos, implementation details, stars, and recency before ranking the mode-specific recommendations.
web search: 
web search: GitHub facebook infer compositional interprocedural analysis diff review Pulse stars releases 2026 ...
web search: 
web search: https://github.com/facebook/infer
web search: 
web search: 
web search: 
web search: site:github.com/facebook/infer Semdiff semantic diff egraph v1.3 source ...
web search: 
web search: https://github.com/facebook/infer/tree/main/infer/src/semdiff
web search: 
web search: 
codex
The strongest pattern is emerging: deep-review should stop treating a PR as a bag of changed lines and treat it as a set of semantic change obligations. Two implementation families support that directly—semantic-diff normalization to remove review noise, and program slices/counterexamples to make each surviving concern falsifiable.
web search: 
web search: site:docs.joern.io joern-slice data-flow slice usages CLI ...
web search: 
web search: GitHub Wilfred difftastic syntax aware structural diff stars latest release 2026 ...
web search: 
web search: 
web search: 
web search: GitHub diffkemp semantic diff kernel functions stars release ...
web search: 
web search: https://github.com/viktormalik/diffkemp
web search: 
web search: https://github.com/ASSERT-KTH/collector-sahab
web search: 
web search: 
codex
Deep-review’s moat should be **stateful semantic change assurance**, not “the same diff reviewed repeatedly.” A single-shot reviewer produces plausible comments; deep-review should produce an auditable argument about what behavior changed, which risks were exercised, what evidence falsified each concern, and what remains uncertain.

The highest-leverage change is to review a **semantic residual** rather than the raw patch:

`raw diff − syntax-only changes − modeled equivalences = behavior requiring review`

[Difftastic](https://github.com/Wilfred/difftastic) provides a cheap AST-level filter and conservative fallback, while Infer 1.3’s new `infer/src/semdiff` goes further with equality saturation and configurable rewrite rules. Infer’s CI workflow also already distinguishes `introduced`, `fixed`, and `preexisting` findings—exactly the lineage deep-review needs across patch revisions. [Infer](https://github.com/facebook/infer) is active at roughly 15.7k stars with a May 2026 release.

The residual should then become an **obligation graph**, not file-oriented fan-out. Anchor each changed symbol to affected callers, data-flow paths, observable sinks, relevant tests, and unmodeled boundaries. Joern’s `joern-slice data-flow` already emits JSON `{nodes, edges}` with file, method, type, and location metadata; its interprocedural slicing supports depth, sink, method, annotation, and file filters. That gives deep-review a concrete coverage unit: `changed node → observable boundary`, rather than “reviewed file.” [Joern’s slicing documentation](https://docs.joern.io/cpg-slicing/) also exposes the main trade-off: deep slices are expensive and external-call semantics need project-specific modeling.

Each obligation should have a falsifiable lifecycle:

```text
suspected → witnessed | falsified | residual-risk
witnessed → fixed-pending → fixed-verified | regressed
```

Its stable identity should combine symbol identity, normalized AST path, semantic-expression hash, and slice-boundary hash—not line numbers. Evidence receipts should record the base/head SHAs, verifier command digest, selected tests, exit status, relevant output hash, and independent verifier pass. `review-report.md` then becomes an assurance case: closed obligations, falsified claims, confirmed defects, and explicit residual risks.

Dynamic evidence belongs late in the escalation ladder. Collector-Sahab’s `matched-line-finder → trace-collector → trace-diff` pipeline demonstrates a useful before/after witness mechanism, but its evaluation contains the critical warning: 96% of sampled augmented diffs were correct, yet only 55% were causally related to the intended change; timestamps and random paths created irrelevant differences. Dynamic witnesses therefore need repeated-seed stability, volatility filtering, and slice proximity before affecting severity. [Paper and evaluation](https://arxiv.org/abs/2212.11077).

The resulting differentiator is sharp: other deep modes research, deliberate, improve, or align artifacts. Deep-review alone owns an executable before/after relation and can repeatedly challenge claims against code, tests, traces, and constrained equivalence checkers. Its product is not “more findings.” It is **bounded confidence about a change**, including proof of what was checked and honest accounting of what could not be checked.

```json
{
  "new_repos": [
    {
      "name": "facebook/infer",
      "url": "https://github.com/facebook/infer",
      "stars": "~15.7k",
      "what": "Compositional static analyzer; v1.3.0 released May 2026 added equality-saturation Semdiff and strengthened incremental analysis.",
      "lesson": "Normalize semantically irrelevant changes before review and retain introduced/fixed/preexisting issue lineage across patch revisions.",
      "maps_to": ["deep-review", "runtime/continuity-threading", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "name": "joernio/joern",
      "url": "https://github.com/joernio/joern",
      "stars": "~3.3k",
      "what": "Cross-language code-property-graph platform with interprocedural data-flow slicing and a July 2026 release.",
      "lesson": "Define review coverage as JSON program slices from changed nodes to callers, data-flow sources, and observable sinks rather than changed files.",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "Wilfred/difftastic",
      "url": "https://github.com/Wilfred/difftastic",
      "stars": "~25.6k",
      "what": "Tree-sitter structural diff using graph search; v0.69.0 released April 2026.",
      "lesson": "Use AST equality as a cheap first-stage noise filter, while preserving a conservative raw-diff fallback on parse errors or unsupported languages.",
      "maps_to": ["deep-review", "runtime/budget-cost", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "name": "ASSERT-KTH/collector-sahab",
      "url": "https://github.com/ASSERT-KTH/collector-sahab",
      "stars": "~10",
      "what": "Before/after Java runtime-state differencer split into matched-line, trace-collection, and trace-diff modules; latest release September 2024.",
      "lesson": "Attach concise runtime witnesses to review claims, but filter unstable and causally unrelated values before using them as severity evidence.",
      "maps_to": ["deep-review", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "diffkemp/diffkemp",
      "url": "https://github.com/diffkemp/diffkemp",
      "stars": "~43",
      "what": "LLVM-based semantic-equivalence comparison for selected functions in large C projects; latest release August 2024.",
      "lesson": "Escalate high-risk refactor obligations to selective before/after equivalence checks and report unsupported transformations as residual risk, not equality.",
      "maps_to": ["deep-review", "runtime/budget-cost"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Construct a semantic residual by subtracting syntax-equivalent and explicitly modeled semantics-preserving edits before allocating LLM review passes.",
      "evidence": "https://github.com/facebook/infer/blob/main/Changelog.md and https://github.com/Wilfred/difftastic",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "insight": "The natural path-coverage cell for deep-review is changed semantic node to affected observable boundary, represented as a program slice with explicit unmodeled external calls.",
      "evidence": "https://docs.joern.io/cpg-slicing/ and https://docs.joern.io/dataflow-semantics/",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/convergence"],
      "confidence": "high"
    },
    {
      "insight": "Finding continuity should use introduced/fixed/preexisting lineage plus stable semantic anchors, allowing deep-review to distinguish a resolved defect from one moved or re-expressed by a later patch.",
      "evidence": "https://fbinfer.com/docs/steps-for-ci/",
      "maps_to": ["deep-review", "runtime/continuity-threading", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "A runtime difference is a witness, not a verdict: it must pass stability, causal-proximity, and relevance checks before changing finding confidence.",
      "evidence": "https://arxiv.org/abs/2212.11077",
      "maps_to": ["deep-review", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Selective semantic-equivalence checking is best used as the expensive terminal verifier for scoped high-risk functions; inability to prove equivalence must remain distinct from a demonstrated behavior change.",
      "evidence": "https://github.com/diffkemp/diffkemp",
      "maps_to": ["deep-review", "runtime/budget-cost"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Build a semantic-obligation planner: normalize the diff, assign stable symbol/AST anchors, expand each residual through call/data-flow slices to observable boundaries, and fan out passes by obligation rather than file. Expose build_obligations(base_sha, head_sha) returning anchor, residual_kind, callers, sinks, tests, unmodeled_boundaries, and confidence.",
      "target": "deep-review",
      "rationale": "It removes mechanical review noise and gives multi-pass review an explicit, measurable coverage surface. Start with Difftastic-style AST checks and language adapters; add equality rules and CPG slicing incrementally.",
      "uniqueness": "This turns deep-review from repeated comment generation into path-accountable semantic change analysis, which single-shot reviewers and linters do not provide.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/facebook/infer and https://docs.joern.io/cpg-slicing/"
    },
    {
      "rec": "Add a proof-carrying finding ledger with suspected, witnessed, falsified, residual-risk, fixed-pending, fixed-verified, and regressed states. Persist semantic anchors and verifier receipts, require an independent falsifier pass for P0/P1, and render review-report.md as obligations plus evidence plus residual risk.",
      "target": "deep-review",
      "rationale": "Fresh-context passes retain independence without rediscovering the same claims, and later patches can be judged as fixes, relocations, or regressions.",
      "uniqueness": "The durable falsification history is the moat: a PR bot offers a snapshot, while deep-review supplies an evolving assurance argument across patch revisions.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://fbinfer.com/docs/steps-for-ci/"
    },
    {
      "rec": "Implement an obligation-specific verification ladder: static path or analyzer witness, targeted before/after test, stable runtime-state difference across seeds, mutation or differential test, then scoped semantic-equivalence checking. A P0/P1 must carry an executable counterexample, a sound analyzer path, or an explicit unverified-residual label explaining why verification was unavailable.",
      "target": "deep-review",
      "rationale": "It converts plausible findings into reproducible evidence while spending expensive verification only on unresolved high-risk obligations.",
      "uniqueness": "Deep-review becomes the mode that actively tries to disprove its own findings and verifies fixes against the same witness, beyond both lint rules and one-pass LLM judgment.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/ASSERT-KTH/collector-sahab and https://github.com/diffkemp/diffkemp"
    }
  ],
  "contradictions": [
    {
      "claim": "A syntax-aware diff identifies behavior-preserving changes.",
      "counter": "Difftastic explicitly compares syntax rather than semantics, treats ordering as significant, and falls back to line diffs on parse failures; AST equality is only a cheap filter.",
      "evidence": "https://github.com/Wilfred/difftastic"
    },
    {
      "claim": "A correct runtime difference is relevant evidence for the reviewed change.",
      "counter": "Collector-Sahab reported 96% correctness on 29 sampled augmented diffs but only 55% causal relation; timestamps, random paths, and unrelated state can dominate.",
      "evidence": "https://arxiv.org/abs/2212.11077"
    },
    {
      "claim": "Failure to establish semantic equivalence demonstrates a behavioral regression.",
      "counter": "DiffKemp is explicitly incomplete and can report false non-equivalence, especially under complex refactoring; unknown and counterexample must be separate outcomes.",
      "evidence": "https://github.com/diffkemp/diffkemp"
    }
  ],
  "next_angles": [
    "Benchmark raw-diff versus semantic-residual review on refactor-heavy PRs, measuring token cost, obligation coverage, accepted findings, and missed regressions.",
    "Design causal filtering for runtime witnesses using repeated seeds, environment normalization, changed-slice proximity, and input intervention.",
    "Evaluate semantic-anchor survival across rebases, symbol moves, generated-code changes, and partial fix commits; measure false finding closure and duplicate resurrection.",
    "Learn a language- and risk-specific verifier escalation policy from historical obligation outcomes, including verifier setup failures and time-to-counterexample."
  ],
  "notes": "The main remaining gap is empirical: structural filtering, program slicing, runtime differencing, and semantic equivalence are individually supported, but their composition into a longitudinal review-obligation system has not been benchmarked. Coverage must also expose unsupported languages, unresolved dynamic dispatch, missing dependency semantics, flaky traces, and unavailable build/test environments rather than silently treating them as reviewed."
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
156,195
