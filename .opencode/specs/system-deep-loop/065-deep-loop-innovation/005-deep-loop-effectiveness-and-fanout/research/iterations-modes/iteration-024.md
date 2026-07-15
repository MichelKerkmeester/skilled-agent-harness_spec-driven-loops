<!-- iteration 24 | SOL xhigh | mode: deep-alignment | angle: A4-fail deep-alignment :: failure modes & guardrails | 2026-07-15T10:03:11.737Z -->

The current contract protects against unsupported positive findings, but not unsupported clean bills of health. Three circularities remain:

- “Live ground truth” may be stale, unauthorized, or internally inconsistent.
- “100% of discovered artifacts” is meaningless if discovery omitted artifacts or entire lanes.
- Known deviations can suppress indefinitely, overmatch after moves, or preserve an obsolete verifier configuration.

A high-precision/high-recall design must therefore audit the auditor.

1. Authority freshness must become a precondition, not metadata. Borrow TUF’s separation of trusted root, timestamp, snapshot, and targets: resolve an immutable authority capsule containing the authority epoch, source hashes, rule manifest, predecessor IDs, verifier version, publisher identity, and expiry. Reject rollback, expiry, missing previously declared rules, and mixed-version sources before `DISCOVER`. Pin one capsule for the run; an authority change becomes an explicit epoch transition, never a mid-run refresh. TUF’s client workflow already implements this ordering in `tuf.ngclient.Updater.refresh()`, while its specification defines rollback, freeze, and mix-and-match checks. [Python-TUF](https://github.com/theupdateframework/python-tuf), [TUF specification](https://github.com/theupdateframework/specification/blob/master/tuf-spec.md).

Suggested API:

```text
resolveAuthority(authority) -> {
  authorityEpoch,
  publisher,
  standardSources: [{uri, digest, ruleIds}],
  verifier: {id, version, digest},
  issuedAt,
  expiresAt,
  previousEpoch
}
```

Failure should produce `AUTHORITY_UNTRUSTED` or `INCONCLUSIVE`, never `PASS`. Map: `deep-alignment`, `runtime/state-jsonl-checkpointing`, `runtime/continuity-threading`.

2. Replace blanket known-deviation suppression with an expiring, typed ledger plus a shadow lane. Each deviation needs `deviationId`, `ruleId`, exact subject selector, semantic fingerprint, authority epoch, verifier digest, owner, evidence digest, reason, expiry, and expected match cardinality. Trivy’s YAML ignore model demonstrates useful minimum fields—ID, paths, expiry, and statement—although that format remains experimental. [Trivy filtering schema](https://trivy.dev/docs/latest/guide/configuration/filtering/).

The stronger mechanism comes from `detect-secrets`: a baseline preserves reviewed labels, but it can also pin the plugin set that created it; `--force-use-all-plugins` is needed to exercise newer detectors. Its `--only-allowlisted` mode explicitly re-scans exceptions. Deep-alignment should do the same:

- Every run: evaluate deviations without suppression in a shadow channel.
- Authority/verifier change: fully revalidate all affected deviations.
- Ordinary run: budgeted sampling is acceptable, but expired, widened, or cardinality-changing selectors are mandatory.
- Report `suppressed_count`, `stale_deviations`, `selector_expansion`, `newly_applicable_rules`, and `suppression_exposure`.

This catches the dangerous case where suppression remains syntactically valid while the rule, verifier, or artifact meaning changes. [Yelp/detect-secrets](https://github.com/Yelp/detect-secrets).

3. A clean verdict needs recall evidence. Build a rule-applicability graph over `(authority epoch, rule, artifact class, scope, verifier)` and distinguish three quantities:

```text
declared_applicable_edges
discovered_testable_edges
successfully_checked_edges
```

`checked / discovered == 1` is insufficient. A lane may pass only when `declared - checked` is empty or every missing edge has an explicit `INCONCLUSIVE` reason.

Each rule should also carry:

- One minimally nonconforming witness.
- One conforming sibling.
- Metamorphic variants such as rename, move, wrapper insertion, equivalent syntax, and irrelevant annotation.
- A precision class: `blocking`, `candidate`, or `experimental`.

Run witnesses before the real corpus. A surviving violation witness marks the verifier or lane `DEGRADED` and blocks `PASS`. A 2024 study found new false-positive and false-negative defects in established analyzers through metamorphic transformations, confirming that replaying the same validator is not an independent completeness check. [Cui et al., 2024](https://arxiv.org/abs/2408.13855).

CodeQL supplies the useful operating model for balancing precision and recall: its default suite favors high precision, while `security-extended` adds lower-precision queries; query metadata includes stable IDs, predecessor IDs, and explicit precision. Deep-alignment should let deterministic/high-precision rules block, while extended semantic rules create candidates requiring a second verifier or evidence probe. [CodeQL query suites](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites), [query metadata](https://codeql.github.com/docs/writing-codeql-queries/metadata-for-codeql-queries/).

The moat is a temporal conformance proof, not another finding list. A linter says which rules fired now. A one-shot prompt can reason semantically but cannot establish authority provenance, scope closure, exception history, or cross-run comparability. The other deep modes investigate truth, review correctness, deliberate choices, or improve artifacts. Deep-alignment alone should answer:

> Under this authorized authority epoch, verifier epoch, declared lane universe, and reviewed exception set, what conforms—and what evidence makes the absence of findings credible?

Sharpen that identity by emitting an alignment certificate containing the capsule digest, closure matrix, verifier manifest, sentinel mutation score, suppression exposure, and `PASS|FAIL|INCONCLUSIVE`. The certificate remains read-only and reproducible; remediation stays separate.

```json
{
  "new_repos": [
    {
      "name": "theupdateframework/python-tuf",
      "url": "https://github.com/theupdateframework/python-tuf",
      "stars": "~1.7k",
      "what": "Python TUF reference implementation; v7.0.0 released 2026-05-18.",
      "lesson": "Pin an authority capsule and reject expired, rolled-back, or mixed-version authority material before auditing artifacts.",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "aquasecurity/trivy",
      "url": "https://github.com/aquasecurity/trivy",
      "stars": "~36.9k",
      "what": "Multi-domain security scanner; v0.72.0 released 2026-06-30.",
      "lesson": "Known deviations should be rule-specific, path-scoped, justified, and expiring rather than permanent blanket suppressions.",
      "maps_to": [
        "deep-alignment",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "Yelp/detect-secrets",
      "url": "https://github.com/Yelp/detect-secrets",
      "stars": "~4.5k",
      "what": "Baseline-oriented secret scanner; latest tagged release v1.5.0 was 2024-05-06.",
      "lesson": "Baselines can freeze an obsolete detector set; explicitly re-run latest verifiers and separately scan allowlisted material.",
      "maps_to": [
        "deep-alignment",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "github/codeql",
      "url": "https://github.com/github/codeql",
      "stars": "~9.8k",
      "what": "Open CodeQL query and library packs; active in 2026 with bundle v2.25.5 shipped in May.",
      "lesson": "Give rules stable lineage and precision classes, then separate blocking high-precision checks from recall-oriented candidate suites.",
      "maps_to": [
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A readable live authority file is not necessarily current or authorized; conformance requires rollback, expiry, and mix-and-match checks over a pinned authority epoch.",
      "evidence": "https://github.com/theupdateframework/specification/blob/master/tuf-spec.md",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Suppression state can silently preserve obsolete verifier capabilities, so every deviation must bind to both an authority epoch and verifier digest.",
      "evidence": "https://github.com/Yelp/detect-secrets",
      "maps_to": [
        "deep-alignment",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Completeness must be measured against declared applicability edges, not only discovered artifacts; otherwise a broken discovery adapter reports perfect coverage.",
      "evidence": "https://arxiv.org/abs/2408.13855",
      "maps_to": [
        "deep-alignment",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Precision and recall can coexist through asymmetric verdict authority: high-precision rules may block, while extended rules create candidates requiring independent confirmation.",
      "evidence": "https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites",
      "maps_to": [
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an authority-capsule gate before DISCOVER with source digests, rule manifest, publisher, authority epoch, verifier digest, expiry, predecessor epoch, and rollback or mix-and-match rejection.",
      "target": "deep-alignment",
      "rationale": "Verify-first cannot establish precision when the authority or verifier being re-probed is stale, partial, or unauthorized.",
      "uniqueness": "Turns alignment into a reproducible temporal conformance proof tied to an authorized standard version, which a linter or one-shot prompt cannot provide.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/theupdateframework/specification/blob/master/tuf-spec.md"
    },
    {
      "rec": "Compile known deviations into an expiring typed ledger and add an unsuppressed shadow lane, with full replay after authority or verifier changes and cardinality checks after artifact moves.",
      "target": "deep-alignment",
      "rationale": "This detects stale exceptions, selector widening, verifier pinning, and suppression leakage without sacrificing the default report's precision.",
      "uniqueness": "Makes exception governance and drift-through-suppression first-class longitudinal evidence rather than a static ignore list.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://trivy.dev/docs/latest/guide/configuration/filtering/"
    },
    {
      "rec": "Require a rule-applicability closure matrix plus positive, negative, and metamorphic sentinels; classify rules as blocking or candidate and prohibit PASS when a sentinel survives or an applicability edge is uncovered.",
      "target": "deep-alignment",
      "rationale": "Artifact coverage alone cannot detect broken discovery, missing lanes, or verifier false negatives.",
      "uniqueness": "The resulting alignment certificate explains why absence of findings is credible, separating deep-alignment from finding-oriented linters and general deep-review.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2408.13855"
    }
  ],
  "contradictions": [
    {
      "claim": "Re-verifying every finding against live ground truth is sufficient for high precision.",
      "counter": "The same re-probe reproduces stale authority, stale verifier, and shared-model errors; authority and verifier provenance must be independently validated.",
      "evidence": "https://github.com/theupdateframework/specification/blob/master/tuf-spec.md"
    },
    {
      "claim": "Checking 100% of discovered artifacts establishes alignment coverage.",
      "counter": "A faulty discovery adapter or omitted lane shrinks the denominator and can produce a perfect score with silent violations.",
      "evidence": "https://arxiv.org/abs/2408.13855"
    }
  ],
  "next_angles": [
    "Design replayable alignment certificates: determine which artifacts, authority sources, verifier binaries, environment facts, and exception decisions must be retained to reproduce an old PASS.",
    "Benchmark lane-closure proofs based on registries, build manifests, exhaustive globs, and independent discovery adapters under file moves, generated artifacts, and newly introduced artifact classes.",
    "Calibrate candidate-to-blocking promotion using historical false-positive and false-negative corpora per rule, including confidence decay after authority or verifier upgrades."
  ],
  "notes": "Trivy's structured YAML ignore format is explicitly marked experimental, so copy the lifecycle semantics rather than its wire format. detect-secrets remains useful mechanistically, but its latest tagged release is from May 2024. Exact internal Trivy ignore-parser module paths were not verified; recommendations rely on its current official schema and documented behavior."
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
session id: 019f6537-0d7d-7d41-92df-dab72dc1a298
--------
user
You are iteration 24/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-alignment
MODE IDENTITY (what it does today): Autonomous standard-authority conformance audit by lane: verify-first findings, known-deviation suppression, read-only default.
GENERIC ALTERNATIVE it must out-value: a linter, or a one-shot 'check this against the rules' prompt

THIS ITERATION'S ANGLE (A4-fail): deep-alignment :: failure modes & guardrails
DIRECTIVE: How do conformance auditors FAIL: false positives, stale/misquoted authority, silently missed violations, over-suppression hiding real drift, lane gaps. Find detection + guardrails. Recommend how deep-alignment stays high-precision AND high-recall and detects authority staleness.

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

ALWAYS answer BOTH: (1) concrete improvements to make deep-alignment more effective; (2) the UNIQUE-VALUE / moat thesis — what deep-alignment can do that a linter, or a one-shot 'check this against the rules' prompt and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.

You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.

GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."

BROADEN within this mode — do not repeat prior coverage:
PRIOR RUNS (001 survey + 005 run-1) already catalogued 290 repos — do NOT re-list any; go DEEPER, adjacent, or newer:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility, RLHFlow/Self-rewarding-reasoning-LLM, WHGTyen/BIG-Bench-Mistake, open-compass/CriticEval, princeton-pli/Contextual-Drag, deeplearning-wisc/debate-or-vote, instadeepai/DebateLLM, dinobby/ReConcile, DA2I2-SLM/DAR, thinking-machines-lab/batch_invariant_ops, vllm-project/vllm, pyeventsourcing/eventsourcing, vcr/vcr, meta-pytorch/botorch, syne-tune/syne-tune, fidelity/mabwiser, stanford-futuredata/FrugalGPT, UKGovernmentBEIS/control-arena, gostevehoward/confseq, st-tech/zr-obp, codenotary/immudb, rr-debugger/rr, LeapLabTHU/Absolute-Zero-Reasoner, mll-lab-nu/RAGEN, langfengQ/verl-agent, verl-project/verl, OpenRLHF/OpenRLHF, apache/airflow, dagster-io/dagster, Netflix/metaflow, flyteorg/flyte, spotify/luigi, dotnet/orleans, apache/flink, apache/kafka, apache/pekko, risingwavelabs/risingwave, kubernetes-sigs/controller-runtime, resilience4j/resilience4j, robusta-dev/robusta, keephq/keep, dgtlmoon/changedetection.io, MaximeRobeyns/self_improving_coding_agent, microsoft/SkillOpt, cobusgreyling/loop-engineering, HKUDS/LightRAG, gusye1234/nano-graphrag, circlemind-ai/fast-graphrag, OpenSPG/KAG, OpenSPG/openspg, OSU-NLP-Group/HippoRAG, eureka-research/Eureka, huggingface/trl, OpenBMB/ChatDev, open-compass/opencompass, Azure-Samples/eval-driven-agents, NVIDIA/garak, microsoft/PyRIT, RICommunity/TAP, centerforaisafety/HarmBench, openai/weak-to-strong, allenai/reward-bench, google/oss-fuzz, microsoft/onefuzz, potsawee/selfcheckgpt, infer-actively/pymdp, automerge/automerge, EleutherAI/lm-evaluation-harness, yjs/yjs, Netflix/concurrency-limits, zjunlp/EasyEdit, comp-17/llm-debate-system, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, anthropics/claude-agent-sdk-typescript, microsoft/conductor, massgen/MassGen, lastmile-ai/mcp-agent, etcd-io/etcd, delta-io/delta-rs, holepunchto/autobase, cadence-workflow/cadence, nextflow-io/nextflow, snakemake/snakemake, jshiv/cronicle, MinishLab/semhash, allenai/olmes, smartyfh/LLM-Uncertainty-Bench, browser-use/browser-use, SahilShrivastava-Dev/semantic-halting-problem, grpc/grpc, temporalio/sdk-go, restatedev/sdk-typescript, Azure/azure-functions-durable-extension, scikit-learn-contrib/DESlib, Toloka/crowd-kit, ArjunPanickssery/self_recognition, lm-sys/FastChat, kubernetes/kubernetes, volcano-sh/volcano, tektoncd/pipeline, lm-sys/RouteLLM, taskflow/taskflow, google/clusterfuzz, google/syzkaller, SWE-bench/SWE-bench, Aider-AI/aider, graspologic-org/graspologic, xtdb/xtdb, terminusdb/terminusdb, feldera/feldera, Arize-ai/phoenix, open-telemetry/opentelemetry-ebpf-instrumentation, DataDog/sketches-js, openmeterio/openmeter, envoyproxy/ratelimit, bucket4j/bucket4j, chosolbee/Stop-RAG, paulaoak/certified_self_consistency, Kapilan-Balagopalan/Brakebooster, golemcloud/golem, ThousandBirdsInc/chidori, apache/burr, RyanLiu112/GenPRM, RUCBM/TOPS, PRIME-RL/TTRL, mukhal/ThinkPRM, Joyyang158/Reasoning-Bias-Detector, ucl-dark/llm_debate, lmarena/arena-hard-auto, lmarena/PPE, cimo-labs/cje, yale-nlp/bay-calibration-llm-evaluators, scikit-activeml/scikit-activeml, cleanlab/cleanlab, haizelabs/verdict, ml-research/llms-gaming-verifiers, UKGovernmentBEIS/reward-hacking-misalignment, emergent-misalignment/emergent-misalignment, hmuto/algorithmic-groupthink-paper, cedar-policy/cedar, quint-co/quint, VowpalWabbit/vowpal_wabbit, py-why/dowhy, online-ml/river
THIS run's new repos so far (95) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl, cel-expr/cel-go, bufbuild/buf, oss-review-toolkit/ort, sigstore/cosign
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment
New insights so far: 101; recommendations: 66.
Open threads flagged: Benchmark deviation-key designs against authority upgrades, file moves, semantic rewrites, verifier upgrades, and environment drift; measure suppression leakage versus unnecessary reactivation. | Build a cross-authority conflict corpus covering direct contradiction, narrower-scope override, edition precedence, incompatible severity, and exception-induced non-monotonicity; score correct abstention as well as resolution. | Compare evidence-sufficiency policies for absence claims—single deterministic verifier, two independent observations, and explicit coverage proof—on false conformity, inconclusive cost, and audit latency. | Build the authority-capsule amendment protocol: authorized publishers, evidence required to invalidate a rule, compatibility classifications, and cross-epoch comparison rules. | Implement the five-operator authority mutation benchmark and score semantic mutation detection, witness sensitivity, false invalidation, and human-review load. | Create a deviation-key migration benchmark covering authority upgrades, semantic rewrites, artifact moves, verifier upgrades, and environment drift, measuring suppression leakage and unnecessary reactivation.

Map every finding to at least one concrete system-deep-loop target (primary should be the mode "deep-alignment"): deep-alignment, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

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
This is read-only research, so the spec-folder write gate does not apply. Skill routing is user-directed to the `deep-alignment` mode; I’m loading its contract and prior context before sourcing new failure-control mechanisms.
exec
/bin/zsh -lc "node ../../../../../../.opencode/bin/spec-memory.cjs memory_match_triggers --json '{\"prompt\":\"iteration 24 deep-alignment failure modes and guardrails: false positives, authority staleness, missed violations, over-suppression, lane gaps\"}' --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 exited 75 in 3157ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

codex
The memory trigger service is unavailable in this sandbox (`EPERM` on its daemon socket). The prompt already carries the prior-run exclusions and open threads, so I’m proceeding from that explicit state. `SKILL ROUTING: User directed → deep-alignment`.
exec
/bin/zsh -lc "rg --files ../../../../../../.opencode/skills ../../../../../../.opencode/commands 2>/dev/null | rg '(system-deep-loop|deep-alignment|deep.*SKILL\\.md|SKILL\\.md"'$)'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
../../../../../../.opencode/skills/sk-git/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/hub-router.json
../../../../../../.opencode/skills/system-deep-loop/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/baselines/claude-baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-005-orchestrate-handoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-004-concise-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-003-vague-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-002-bare-command-halt.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/scenarios/ACB-001-auto-run-specified.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/behavior_benchmark/behavior_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_strategy.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/assets/runtime_capabilities.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs
../../../../../../.opencode/skills/system-deep-loop/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/rollback.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/findings-registry.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/audit-trail.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/audit-trail.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/findings-registry.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/integration-deep-mode-e2e.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-topic.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/advise-council-completion.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/rollback.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/persist-artifacts.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs
../../../../../../.opencode/skills/system-deep-loop/graph-metadata.json
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/baselines/claude-baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/system-deep-loop/runtime/vitest.config.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tsconfig.json
../../../../../../.opencode/skills/system-deep-loop/changelog/v1.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/changelog/v2.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/changelog/v1.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/runtime_routing_and_rename/advisor_routes_council_prompts_to_skill.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/runtime_routing_and_rename/runtime_agent_renamed_to_deep_ai_council.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.2.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.3.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.1.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.3.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.2.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/cross_reference_verification_detects_misalignment.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/graph_events_review.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/strategy_next_focus_and_dimension_rotation.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/severity_classification_in_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_reads_state_before_review.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_writes_findings_jsonl_and_strategy_update.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/review_dashboard_generation_after_iteration.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/iteration_execution_and_state_discipline/adversarial_self_check_runs_on_p0_findings.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-007-delegation-route-proof.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-004-concise-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-005-orchestrate-handoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-008-absorption-probe.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-006-auto-missing-inputs.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-001-auto-run-specified.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-002-bare-command-halt.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/scenarios/RVB-003-vague-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/behavior_benchmark/behavior_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/mode_hint_override.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/ai_council_routing.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/review_routing.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/research_routing.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/rollback_failed_round_preserves_forensic_trail.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/max_rounds_without_convergence_emits_non_converged.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/two_of_three_agree_triggers_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/convergence_and_rollback/cross_mode_anti_convergence_contract.md
../../../../../../.opencode/skills/system-deep-loop/benchmark/router_mode_a/skill-benchmark-report.json
../../../../../../.opencode/skills/system-deep-loop/benchmark/router_mode_a/skill-benchmark-report.md
../../../../../../.opencode/skills/system-deep-loop/benchmark/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/evidence-contract.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/pivot-candidates.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/receipt-crypto.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/bayesian-scorer.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/fallback-router.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/sleep.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/deep_review_strategy.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/deep_review_config.json
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/runtime_capabilities.json
../../../../../../.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/synthesis_save_boundary.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/leaf_only_nested_dispatch_refusal.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/setup_yaml_handoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/three_artifact_iteration_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/setup-cp-sandbox.sh
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/write_boundary_reducer_owned_files.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command_flow_stress_tests/resource_map_coverage_gate.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/external_adapter.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/improvement_host.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/runtime_loop_council.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/runtime_loop_research.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_deliberation_and_seat_diversity/three_seat_diverse_deliberation.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_deliberation_and_seat_diversity/cross_seat_critique_blocks_premature_convergence.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/helpers/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/runtime-capabilities.cjs
../../../../../../.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/skill-benchmark-report.json
../../../../../../.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/skill-benchmark-report.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/review_verdict_determines_post_review_workflow.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/final_synthesis_memory_save_and_guardrail_behavior.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/finding_deduplication_and_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/resource_map_emission.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/synthesis_save_and_guardrails/review_report_synthesis_has_all_9_sections.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/depth_and_failure_handling/depth_detection_parallel_vs_sequential.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/depth_and_failure_handling/resume_after_interrupted_state.md
../../../../../../.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json
../../../../../../.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.md
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/session-state-hierarchy.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/single_advisor_identity.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/lexical_mode_scoring.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/command_bridge_guard.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/no_false_fire_code_edit.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/baselines/claude-baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-008-per-lane-report.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-002-bare-command-halt.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-003-vague-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-010-boundary-vs-parent-skill-check.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-004-concise-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-006-known-deviation-suppression.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-005-verify-first.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-001-auto-run-lane-config.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-011-clean-pass-zero-findings.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-007-read-only-default.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/scenarios/DAB-009-boundary-vs-deep-review.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/behavior_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/seed-helpers.ts
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_iteration.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-029.ts
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_setup.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_report.md
../../../../../../.opencode/skills/system-deep-loop/benchmark/live_mode_b/skill-benchmark-report.json
../../../../../../.opencode/skills/system-deep-loop/benchmark/live_mode_b/skill-benchmark-report.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/skill_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/agent_improvement.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/model_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-005-orchestrate-handoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-004-concise-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-002-bare-command-halt.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-003-vague-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/scenarios/IMB-001-auto-run-specified.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/behavior_benchmark/behavior_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/convergence_safety_under_critical_disagreement_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/stalled_council_blocker_ranking_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/hot_topic_discovery_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/mid_run_interruption_recovery_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_value_comparison/decision_provenance_audit_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs
../../../../../../.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/data/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/data/scenarios.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-028.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-027.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-032.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-031.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/dac-030.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council-graph-value-report.json
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/query.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/scripts/status.cjs
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/convergence_stop.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/artifact_root_writes.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/hub_logic_boundary.md
../../../../../../.opencode/skills/system-deep-loop/manual_testing_playbook/state_and_convergence_discipline/externalized_state.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_review_state.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/scope_discovery_and_dimension_ordering.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_review_state_halts_for_repair.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/initialization_and_state_setup/fresh_review_initialization_creates_canonical_state_files.md
../../../../../../.opencode/skills/system-deep-loop/description.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/lifecycle/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/scope_boundaries/planning_only_boundary_rejects_implementation_writes.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/scope_boundaries/graph_support_derived_and_scoped.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/query-script.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/status-script.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-graph.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-validator.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council/round-state-jsonl.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council/cost-guards.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council/session-state-hierarchy.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/council/adjudicator-verdict-scoring.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/receipt-crypto.test.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_profiles/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/auto_mode_deep_review_kickoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/parameterized_invocation_max_iterations_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/entry_points_and_modes/confirm_mode_checkpointed_review.md
../../../../../../.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_status_recovery_payload_and_readiness.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_upsert_idempotency_and_self_loop_rejection.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_query_hostile_metadata_redaction.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/council_graph_integration/council_graph_convergence_three_state_decision_matrix.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/promotion_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/rollback.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/scoring_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/candidate_generation.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/plateau_detection.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/initialization.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/evaluation_loop/two_phase_promotion_and_rollback.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/resume_after_pause_sentinel_removal.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/pause_sentinel_halts_between_review_iterations.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/malformed_jsonl_lines_are_skipped_with_defaults.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/pause_resume_and_fault_tolerance/jsonl_reconstruction_from_review_iteration_files.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_cli_lineages_review.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_single_executor_parity_review.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_native_sequential_review.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/fanout/fanout_strongest_restriction.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dynamic_profiling.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/deterministic_scoring.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/five_dimension_rubric.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/scoring_system/dimensional_progress.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/routing-allowlist.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/five_dimension_scoring_rubric_application.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/out_of_scope_write_rejection.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/library_writer_call_sequence.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer_library_contract/hunter_skeptic_referee_cross_critique.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/host-driven-improvement.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/fallback-router.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/cli-matrix.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/optimizer-manifest-anti-convergence.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/spawn-cjs.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/coverage-graph-db.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-novelty-inertness.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-failure.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/artifact-root.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/cli-guards-writer-lock.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/convergence-score-delta.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/jsonl-repair.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/pivot-candidates.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock-cli.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/atomic-state.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/coverage-graph-query.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/evidence-contract.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/runtime-capabilities.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/council-graph-query.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/sleep.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/runtime-capabilities-matrix-conformance.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/executor-provenance-mismatch.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy-guards.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit-process-group.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/bayesian-scorer.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-salvage.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/workflow-session-id-parity.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/dependency-seams.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/observability-events.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/validation/llm_judge_hardening.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/validation/mk_deep_loop_guard.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/validation/post_dispatch_validate.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/artifact_persistence_and_state_format/output_schema_strict_required_sections_fail_closed.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/artifact_persistence_and_state_format/state_jsonl_records_council_complete_event.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/artifact_persistence_and_state_format/persist_artifacts_helper_writes_packet_local_tree.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/validator_warn_rollout.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/stop_gate_graphless_fallback.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/reducer_search_debt.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/validator_strict_v2.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/stop_gate_candidate_coverage.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/review_depth_v2_rollout/graph_vocabulary.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/fixtures/fixture-manifest.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/lane-config.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/assets/alignment_prompt_pack.md.tmpl
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/assets/deep_alignment_config_template.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/SKILL.md
../../../../../../.opencode/skills/system-code-graph/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/mirror_drift_policy.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/remediation_taxonomy.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/router_replay_and_advisor_probe.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/dual_report_and_remediation.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/mode_wiring.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/d5_connectivity_gate.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/contamination_gate_and_fixtures.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/skill_benchmark/scoring_and_funnel.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/fallback_router.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/executor_audit.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/fallback_router_typed_reroute.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/executor/executor_config.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/divergent_convergence_mode.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/dimension_coverage_convergence_signal.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/blocked_stop_reducer_surfacing.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/composite_review_convergence_stop_behavior.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/fail_closed_reducer.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/graph_convergence_review.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/p0_override_blocks_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/review_quality_guards_block_premature_stop.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/stop_on_max_iterations.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/cross_mode_anti_convergence_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/stuck_recovery_widens_dimension_focus.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/runtime_routing_and_rename/advisor_routes_council_prompts_to_skill.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/runtime_routing_and_rename/runtime_agent_renamed_to_deep_ai_council.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/runtime_mirrors.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/command_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/integration_scanning/surface_discovery.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/scoring/convergence_score_delta.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/scoring/bayesian_scorer.md
../../../../../../.opencode/skills/mcp-code-mode/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_stripped_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_neither_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_faithful_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_present_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design_dispatch/sk_design_dispatch_boundary_missing_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/security_sensitive_fix_overrides.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/convergence_signals.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/divergent_convergence_mode.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/quality_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/adversarial_self_check.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/rollback_failed_round_preserves_forensic_trail.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/claim_adjudication.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/severity_classification.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/max_rounds_without_convergence_emits_non_converged.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/verdicts.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/severity_system/cross_mode_anti_convergence_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/two_of_three_agree_triggers_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/convergence_and_rollback/cross_mode_anti_convergence_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_records_and_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/model_dispatcher.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/opt_in_5dim_scorer.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/score_delta_benchmark_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick_reference.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback_runbook.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/shared/heldout_and_gold_sets.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_improvement/agent_improve_001.public.json
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state_integrity_helpers.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/loop_lock.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/jsonl_lock_held_merge.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/permissions_gate.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/loop_lock_single_flight_decision.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/jsonl_repair.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state_deferred_writer.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/loop_lock_heartbeat_hardening.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/state_safety/atomic_state_serialize_diff.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_deliberation_and_seat_diversity/three_seat_diverse_deliberation.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_deliberation_and_seat_diversity/cross_seat_critique_blocks_premature_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/scoping-adapter.test.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/partition-identity-progress.test.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/reducer-fail-closed.test.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/security.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/correctness.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/maintainability.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/review_dimensions/traceability.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/testing/record_replay_cassette_harness.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/testing/hermetic_test_isolation.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/operator_guide.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/depth_and_failure_handling/depth_detection_parallel_vs_sequential.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/depth_and_failure_handling/resume_after_interrupted_state.md
../../../../../../.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/findings_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/config_management.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/strategy_tracking.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/graph_convergence_event.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/jsonl_state_log.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/pause_sentinel.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/state_management/dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_context_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_research_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_review_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_aicouncil_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep_loop_workflows/dlw_agentimprove_001.private.json
../../../../../../.opencode/skills/system-deep-loop/runtime/references/coverage_graph_schema.md
../../../../../../.opencode/skills/system-deep-loop/runtime/references/integration_points.md
../../../../../../.opencode/skills/system-deep-loop/runtime/references/state_format.md
../../../../../../.opencode/skills/system-deep-loop/runtime/references/script_interface_contract.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/prompt_rendering/prompt_pack.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/benchmark_operator_guide.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/mixed_executor_methodology.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/convergence_safety_under_critical_disagreement_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/stalled_council_blocker_ranking_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/hot_topic_discovery_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/mid_run_interruption_recovery_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_value_comparison/decision_provenance_audit_graph_vs_baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_date.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_stale_verdict.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_improved.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_parse_csv_line.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_baseline.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_semver.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_strict_acceptance.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_semver_compare.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/validate_ipv4.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_int_to_words.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_merge_intervals.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t1_smoke_echo.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_roman_to_int.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_ac_coverage.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t4_adversarial_tokenizer.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/fixture_edge.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/harder_normalize_path.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_bugfix_in_context.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_schema.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/hard_eval_expr.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_softened_fail.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer_over_read.json
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/convergence_check.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/fanout_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/iteration_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/executor_selection_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/synthesis.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/resource_map_coverage_gate.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/memory_save.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/initialization.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop_lifecycle/resource_map_emission.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/feature_catalog/feature_catalog.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/nothing_to_converge_and_vacuous_lane.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/dry_run_stability_fail_closed.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/coverage_and_stability_and_semantics.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/corpus_partitioning_round_robin.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/iteration_and_convergence/max_iterations_hard_stop.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.5.0.1.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.5.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.4.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/changelog/v1.2.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/query_script.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/convergence_script.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/upsert_script.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/script_entry_points/status_script.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/scope_boundaries/planning_only_boundary_rejects_implementation_writes.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/scope_boundaries/graph_support_derived_and_scoped.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/feature_catalog.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.7.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.13.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.5.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.2.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.3.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.1.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.10.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.6.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.8.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.4.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.12.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.16.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.14.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.2.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.0.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_discriminating.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v3.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo_v2.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/model_vs_model.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/glm_5.2_frameworks.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/capability_m3_vs_mimo.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/observability/byte_offset_log_regions.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/observability/single_loop_telemetry_heartbeat.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/observability/unified_observability_event_envelope.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/entry_points_and_modes/config_file_only_non_interactive_path.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/entry_points_and_modes/parameter_surface_modes_and_tuning.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/entry_points_and_modes/invocation_contract_and_forbidden_patterns.md
../../../../../../.opencode/skills/system-deep-loop/runtime/database/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite
../../../../../../.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl
../../../../../../.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_status_recovery_payload_and_readiness.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_upsert_idempotency_and_self_loop_rejection.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_alias.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_query_hostile_metadata_redaction.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/council_graph_integration/council_graph_convergence_three_state_decision_matrix.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_interface_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_foundations_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_derived_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_holdout_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_alias.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_audit.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_alias.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_audit.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_002.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_bolder_alias.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_delight_audit.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_derived_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_redesign_ui_002.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_clarify_audit.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_menu_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_mdgen_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_002.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_audit_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_002.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_no_recipe_negative_control.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_motion_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_distill_audit.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_missing.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_tokens_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_foundations_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_mp_ui_build_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_audit_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_locale_component_holdout_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_alias_mdgen_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_dense_dashboard_holdout_001.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_interface_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_craft_stateful_upload_derived_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_invalid.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_transform_quieter_alias.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_holdout_motion_001.private.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.public.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/default_profile.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/state_and_fault_tolerance/state_machine_wiring_regression.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/state_and_fault_tolerance/alignment_state_file_layout.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/state_and_fault_tolerance/malformed_jsonl_corruption_warnings.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_stall_watchdog.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_salvage_recovery.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/artifact_dir_override_parity.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_config_schema.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_run_cli_lineage_spawn.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fixed_rate_overrun_accounting.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/persisted_wait_crash_resume.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_merge_research.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_pool_concurrency_cap.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/fanout/fanout_merge_review_strongest_restriction.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/state/state_outputs.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/state/state_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/five_dimension_scoring_rubric_application.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/out_of_scope_write_rejection.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/library_writer_call_sequence.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/writer_library_contract/hunter_skeptic_referee_cross_critique.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/typed-errors.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/verify_first_and_known_deviations/sk_git_exempt_precheck_vs_suppression.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/verify_first_and_known_deviations/verify_first_no_finding_without_reprobe.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/verify_first_and_known_deviations/known_deviation_suppression.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/lifecycle/abortable_chunked_sleep.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/lifecycle/lifecycle_taxonomy_guards.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/artifact_persistence_and_state_format/output_schema_strict_required_sections_fail_closed.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/artifact_persistence_and_state_format/state_jsonl_records_council_complete_event.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/artifact_persistence_and_state_format/persist_artifacts_helper_writes_packet_local_tree.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/structure/folder_layout.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/mutation-coverage.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/fixture-lint.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/report_emission_per_lane/worst_verdict_overall_rollup.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/report_emission_per_lane/one_report_per_lane.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/report_emission_per_lane/finding_dedup_and_fail_closed_severity.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/cost_guards.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/adjudicator_verdict_scoring.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/session_state_hierarchy.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/multi_seat_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/round_state_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/baselines/claude-baseline.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/findings_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/authority_agnostic_adapter_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_design_static_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_git_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_doc_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_design_live_render_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/discovery_and_adapters/sk_code_hybrid_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/candidate-lineage.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.7.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.11.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.9.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.5.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.10.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.6.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.3.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.3.2.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.8.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.4.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.10.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-review/changelog/v1.2.0.0.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_db.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_fuzzy_merge.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/observation_threshold_guard.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_time_decay.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_query.md
../../../../../../.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/coverage_graph/coverage_graph_signals.md
../../../../../../.opencode/skills/system-deep-loop/runtime/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-005-orchestrate-handoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-004-concise-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-008-absorption-probe.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-006-auto-missing-inputs.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-001-auto-run-specified.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-007-delegation-route-proof.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-003-vague-natural-ask.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/scenarios/RSB-002-bare-command-halt.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/behavior_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/failure_handling.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/scope_shape_and_repo_root_validation.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/fail_closed_error_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/dual_path_identical_lane_shape.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/empty_lane_config_zero_lanes.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/multi_authority_single_run.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/lane_resolution_and_scoping/authority_artifact_class_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-cache.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-security.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/rollback-candidate-containment.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl
../../../../../../.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json
../../../../../../.opencode/skills/system-deep-loop/deep-research/assets/deep_research_dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/assets/runtime_capabilities.json
../../../../../../.opencode/skills/system-deep-loop/deep-research/assets/deep_research_strategy.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement_config.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/candidate-lineage.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/mutation-coverage.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/trade-off-trajectory.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/experiment-registry.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/agent-improvement-dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/benchmark-results.json
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/materialize-fixture-id.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/anti-goodhart.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-dashboard.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/model-family.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/parse-args.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/check-dispatch-cap.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/extract-deliverable.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/integration/quick_reference.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/read_only_and_gated_remediation/read_only_default_surface.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/read_only_and_gated_remediation/gated_remediation_hook_noop.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/README.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/validation/llm_judge_hardening.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/validation/mk_deep_loop_guard.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/validation/post_dispatch_validate.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts
../../../../../../.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh
../../../../../../.opencode/skills/system-deep-loop/deep-research/scripts/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs
../../../../../../.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti_patterns.md
../../../../../../.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command_wiring.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/fallback_router.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/executor_audit.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/fallback_router_typed_reroute.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/executor/executor_config.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/audit_journal_emission.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/journal_wiring.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/dimension_trajectory.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/resume_continuation.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/insufficient_sample.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/parallel_candidates_opt_in.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/legal_stop_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/replay_consumer.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/benchmark_stability.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/runtime_truth/stop_reason_taxonomy.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/scoring/convergence_score_delta.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/scoring/bayesian_scorer.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/discover.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_doc.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_design.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/check.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_git.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_code.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/adapter_sk_design_live_render.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/adapter_contract/standard_source.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/improvement_gate_delta.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/benchmark_completed_boundary.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/setup-cp-sandbox.sh
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/legal_stop_gate_bundle.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/active_critic_overfit.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/skill_load_not_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent_discipline_stress_tests/proposal_only_boundary.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state_integrity_helpers.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/loop_lock.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/jsonl_lock_held_merge.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/permissions_gate.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/loop_lock_single_flight_decision.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/jsonl_repair.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state_deferred_writer.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/loop_lock_heartbeat_hardening.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/state_safety/atomic_state_serialize_diff.md
../../../../../../.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/SMOKE-000-fake.md
../../../../../../.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/fake-leg.js
../../../../../../.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/dab-v1-golden.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/gated_remediation.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/read_only_default.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/verify_first.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/alignment_contract/known_deviation_suppression.md
../../../../../../.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
../../../../../../.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/routing-allowlist.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/mcp-figma-router-sync.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/dimension-applicability.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-surface-path-parse.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-opencode-playbook-ids.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/_args.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/testing/record_replay_cassette_harness.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/testing/hermetic_test_isolation.md
../../../../../../.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json
../../../../../../.opencode/skills/system-deep-loop/shared/rollout/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/iteration_reads_state_before_research.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/progressive_synthesis_behavior_for_research_md.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/dashboard_sparkline_trend.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/graph_events_emission.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/dashboard_generation_after_iteration.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/novelty_justification_in_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/ideas_backlog_lifecycle.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/question_conflict_ownership.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/focus_track_labels_in_dashboard.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/injection_inbox_provenance.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/iteration_writes_iteration_jsonl_and_strategy_update.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/rejected_pattern_cache.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/strategy_next_focus_and_exhausted_approach_discipline.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/manual_testing_playbook.md
../../../../../../.opencode/skills/cli-external-orchestration/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/lane_config.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/scoping_tree.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/scope_types.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/artifact_classes.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/lane_resolution/authority_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/prompt_rendering/prompt_pack.md
../../../../../../.opencode/skills/system-deep-loop/shared/rollout/tests/resolve-injection-mode.test.cjs
../../../../../../.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs
../../../../../../.opencode/skills/system-deep-loop/shared/rollout/promotion-rule.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/resource_map_toggle.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/setup_yaml_handoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/spec_fence_writeback.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/iteration_citation_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/setup-cp-sandbox.sh
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/pause_sentinel_halt.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command_flow_stress_tests/exhausted_approach_respect.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/state_machine.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/convergence_check.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/alignment_report_reducer.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/loop_lifecycle/corpus_partitioning.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/feature_catalog.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/full_setup.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/skill_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/quick_reference.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/evaluation_policy.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/integration_scan.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/target_onboarding.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/model_benchmark.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/promotion_operations.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/loop_execution.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/query_script.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/convergence_script.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/upsert_script.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/script_entry_points/status_script.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/framework-renderer.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/README.md
../../../../../../.opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/missing_candidate.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dynamic_arbitrary.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/5d_scorer/dimension_details.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/per_iteration_memory_upsert.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/final_synthesis_memory_save_and_guardrail_behavior.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/ruled_out_directions_in_synthesis.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/synthesis_save_and_guardrails/resource_map_emission.md
../../../../../../.opencode/skills/system-deep-loop/shared/progress/progress-record.test.cjs
../../../../../../.opencode/skills/system-deep-loop/shared/progress/progress-record.cjs
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/observability/byte_offset_log_regions.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/observability/single_loop_telemetry_heartbeat.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/observability/unified_observability_event_envelope.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/changelog/v1.0.0.0.md
../../../../../../.opencode/skills/system-deep-loop/mode-registry.json
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_known_deviations.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_known_deviations.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_known_deviations.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_command_known_deviations.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_command_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/iteration.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/runtime_parity.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/spec_anchoring.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/recovery.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/resource_map.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/state.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/loop_setup.md
../../../../../../.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/without_integration.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/benchmark_integration/with_integration.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/dual_report_and_remediation.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/contamination_gate.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/scoring_vs_private_gold.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/mode_wiring_routing.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/d5_connectivity_hard_gate.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/skill_benchmark/router_replay_mode_a.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_merge.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_stall_watchdog.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_pool.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_config_schema.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_salvage.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fixed_rate_overrun_accounting.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/persisted_wait_crash_resume.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/fanout/fanout_run.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/research_charter_validation.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_state_halts_for_repair.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_state.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/initialization_and_state_setup/fresh_initialization_creates_canonical_state_files.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/no_dimensions.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/plateau_detection.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/reducer_dimensions/with_dimensions.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/resume_after_pause_sentinel_removal.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/malformed_jsonl_lines_are_skipped_with_defaults.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/jsonl_reconstruction_from_iteration_files.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/pause_sentinel_halts_between_iterations.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/run_now_control.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/any_agent.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/candidate_lineage.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/full_pipeline.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/trade_off_detection.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/two_phase_promotion_and_rollback.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/end_to_end_loop/mutation_coverage_graph_tracking.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/research_output/progressive_synthesis.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/research_output/negative_knowledge.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/lifecycle/abortable_chunked_sleep.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/lifecycle/lifecycle_taxonomy_guards.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/feature_catalog.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/loop_wide_dry_run.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/confirm_mode_checkpointed_execution.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/auto_mode_deep_research_kickoff.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/entry_points_and_modes/parameterized_invocation_max_iterations_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/optin_5dim_scorer.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/criteria_exec_gate.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/reviewer_prompt_regression_fixtures.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/score_delta_benchmark_gates.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/default_pattern_scorer.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/mode_switch_routing.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/model_benchmark_mode/unknown_fallback.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/fanout/fanout_native_sequential_research.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/fanout/fanout_single_executor_parity_research.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/fanout/fanout_cli_lineages_research.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/json_output_file.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_missing_agent.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_diverse_agent.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/integration_scanner/scan_known_agent.md
../../../../../../.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_db.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_fuzzy_merge.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/observation_threshold_guard.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_time_decay.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_query.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/coverage_graph/coverage_graph_signals.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/config_management.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/strategy_tracking.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/dashboard_sparkline_trend.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/jsonl_state_log.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/ideas_backlog_lifecycle.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/question_conflict_ownership.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/injection_inbox_provenance.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/state_management/rejected_pattern_cache.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/output_checks.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/rules_extraction.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/inline_rules_fallback.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/profile_generator/file_output.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
../../../../../../.opencode/skills/system-skill-advisor/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/council/cost_guards.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/council/adjudicator_verdict_scoring.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/council/session_state_hierarchy.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/council/multi_seat_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/runtime/feature_catalog/council/round_state_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/divergent_convergence_mode.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/blocked_stop_reducer_surfacing.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/quality_guard_no_single_weak_source.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/stuck_recovery_widens_focus_and_continues.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/graph_aware_stop_gate.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/convergence_passes_guard_fails_override.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/anti_convergence_floor.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/thought_status_convergence_handling.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/composite_convergence_stop_behavior.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/stop_when_all_key_questions_are_answered.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/insight_status_prevents_false_stuck.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/graph_convergence_signals.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/stop_on_max_iterations.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/quality_guard_source_diversity.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence_and_recovery/quality_guard_focus_alignment.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/dispatch-envelope.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/grader-harness-hardening.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-runtime.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/bundle-gate-exec-gate.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/divergent_convergence_mode.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/three_signal_model.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/graph_convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/anti_convergence_floor.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/quality_guards.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/stuck_detection.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5cecfb73a67e5b6522e5992e8a1958d4.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8e6d3962a346cf59796d3df172c3901b.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/df404b41b693fd90b7d2b2fb64d46d78.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5fe47aad8aacf44314f494ab0add2dec.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4d1138ca8c23389ecdf84767e8691348.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/362330146b11be4e9ed0d522cc7b7a9f.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/e5706bc35dabb7584b4563c9d5b2bd42.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9a38a58ebffba2c0a5e87918261d9afb.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/0115576e1e7be786962398431c973dd9.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/dbd80958bc81ecc2c9c947d3db67f510.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/22c1faa7c45013e9fdfb6ce5ecf929d1.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9c562e7eb6d90a65972bc75282b09770.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/ea2a6323ff8b607dea081c14ae4fd24b.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/a59863e9ad0f70d9bf39a3b3e7d3ec2b.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f4b6ea7a34706c73189ac821c6ec177d.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/c0470150d6f7383f350f17216a2fbb3a.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/75692e98524c987bc724bd15f1268854.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8c2c8a1fd00f3af9daaef290f1be57ba.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/aac68b3316e3489dd0c4e9b5e367ddd5.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc53734e22ef097b18e31f94d61a003d.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/42840a5b34cdd91b3e2ff2d77184541e.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/d0bc23dd3d54f9d0feef1727c1313afe.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/index.jsonl
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/7fb218c8d070aa9e92bbda2b3bba94de.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/4b7b4bbc6313c5e1c67711655e612a98.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/9f00e055438f4fb69c5a0bf926d25952.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/cbbeff1caf82bd3a1e002bbd22377b43.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/720c3c2f773829e2d75f3c4cf1c9cc36.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/f2f2dd71f2533dd8cb3665d0857b8a02.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/fc10907e5828f4c8b642f4557d6c0675.out.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/per_iteration_memory_upsert.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/loop_wide_dry_run.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/convergence_check.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/fanout_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/iteration_dispatch.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/synthesis.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/memory_save.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/run_now_control.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/initialization.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/resource_map_emission.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/feature_catalog/feature_catalog.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/README.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-skeptic.md
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs
../../../../../../.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/README.md
../../../../../../.opencode/skills/sk-design/design-md-generator/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/routing-allowlist.json
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/guides/capability_matrix.md
../../../../../../.opencode/skills/sk-design/design-mcp-open-design/SKILL.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_signals.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_reference_only.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_graph.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence_recovery.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/state/state_reducer_registry.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/state/state_outputs.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/state/state_format.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/state/state_jsonl.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/protocol/spec_check_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/references/protocol/context_snapshot.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.7.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.11.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.13.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.9.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.5.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.2.2.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.2.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.1.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.3.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.3.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.10.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.6.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.8.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.4.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.12.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.2.1.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.14.0.0.md
../../../../../../.opencode/skills/system-deep-loop/deep-research/changelog/v1.2.0.0.md
../../../../../../.opencode/skills/mcp-tooling/SKILL.md
../../../../../../.opencode/skills/sk-code/code-webflow/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-quality-control/SKILL.md
../../../../../../.opencode/skills/mcp-tooling/mcp-figma/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-readme/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-benchmark/SKILL.md
../../../../../../.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md
../../../../../../.opencode/skills/sk-design/design-motion/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-changelog/SKILL.md
../../../../../../.opencode/skills/sk-code/code-opencode/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-skill/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-agent/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-feature-catalog/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-flowchart/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-diff/SKILL.md
../../../../../../.opencode/skills/sk-code/code-review/SKILL.md
../../../../../../.opencode/skills/sk-code/code-quality/SKILL.md
../../../../../../.opencode/skills/sk-doc/create-command/SKILL.md
../../../../../../.opencode/skills/sk-doc/SKILL.md
../../../../../../.opencode/skills/sk-code/SKILL.md
../../../../../../.opencode/skills/sk-design/design-interface/SKILL.md
../../../../../../.opencode/skills/sk-design/SKILL.md
../../../../../../.opencode/skills/system-spec-kit/SKILL.md
../../../../../../.opencode/skills/sk-design/design-foundations/SKILL.md
../../../../../../.opencode/skills/sk-prompt/prompt-improve/SKILL.md
../../../../../../.opencode/skills/sk-design/design-audit/SKILL.md
../../../../../../.opencode/skills/sk-prompt/SKILL.md
../../../../../../.opencode/skills/sk-prompt/prompt-models/SKILL.md

exec
/bin/zsh -lc "wc -l ../../../../../../.opencode/skills/system-deep-loop/SKILL.md && sed -n '1,260p' ../../../../../../.opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     154 ../../../../../../.opencode/skills/system-deep-loop/SKILL.md
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

exec
/bin/zsh -lc "wc -l ../../../../../../.opencode/skills/system-deep-loop/deep-alignment/SKILL.md && sed -n '1,260p' ../../../../../../.opencode/skills/system-deep-loop/deep-alignment/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     380 ../../../../../../.opencode/skills/system-deep-loop/deep-alignment/SKILL.md
---
name: deep-alignment
description: "Autonomous standard-authority conformance: audit artifacts by lane; verify-first, known-deviation suppression, read-only default."
allowed-tools: [Read, Grep, Glob, Task, Bash, memory_context, memory_search, code_graph_query]
version: 1.0.0.1
---
<!-- Note: read-only by default -- no Write/Edit in the default surface. Task/Bash are present but reserved for the gated, opt-in remediation pass; loop-owned state writes route through shared runtime scripts, not direct file edits. No WebFetch: alignment checks local artifacts against local authority standards. -->

<!-- Keywords: deep-alignment, alignment-lane, conformance-review, standard-authority, verify-first, known-deviation-suppression, read-only-default, gated-remediation, structured-scoping, artifact-conformance -->

# Autonomous Deep Alignment Loop

Structured conformance-review loop that checks artifacts against a named standard authority's own creation rules, not general code correctness. Each run resolves one or more alignment lanes (a standard authority, an artifact class, and a scope), audits the artifacts in each lane against that authority's own templates and standards, and reports findings that have been re-verified against live ground truth before being asserted.

## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Checking whether docs, code, configs, or git history in a scope follow a named authority's own creation standards, not general correctness
- Auditing multiple authorities in one run (for example sk-doc and sk-git and sk-design conformance together)
- Verifying a claimed "shipped to standard" state against live reality before trusting it
- Unattended or headless conformance sweeps across a repo or a spec folder

### When NOT to Use

- General code or doc correctness review with no specific named authority in mind (use `deep-review`)
- Checking hub structure such as folders, registries, or routing wiring rather than artifact content (use `parent-skill-check.cjs`)
- A single, already-known fix (go directly to implementation)
- A quick one-file check (use direct Grep/Read against the authority's own standards doc)

**Boundary**: `deep-alignment` is not `parent-skill-check.cjs` -- that script checks hub structure (folders, registries, routing wiring), not artifact content. `deep-alignment` is not `deep-review` -- that mode audits general code and doc correctness across arbitrary dimensions. `deep-alignment` audits artifact content conformance against one specific, named authority's own templates and creation standards.

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/deep:alignment` command. The command's YAML workflow owns state, dispatch, and convergence, mirroring every other mode in this hub.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize lanes or iterations
- Invoke cli-opencode / cli-claude-code directly in a loop to simulate iterations
- Dispatch the `@deep-alignment` LEAF agent via the Task tool for iteration loops (the agent is LEAF, a single iteration, and MUST be driven by the command's workflow)
- Skip the state machine or write ad-hoc state outside the bound spec folder's `alignment/` subdirectory
- Run the gated remediation pass without an explicit, separate operator opt-in

**ALWAYS:**
- Invoke via `/deep:alignment :auto` or `/deep:alignment :confirm`, supplying `[target] [authority]` and flags such as `--lane-config <file.json>` and `--max-iterations=N` (the full flag set is `/deep:alignment`'s own `argument-hint`, not duplicated here)
- Resolve lanes first (authority x artifact-class x scope) before any artifact is discovered
- Re-verify every finding against live ground truth before it is asserted
- Default to read-only; treat remediation as a separate, gated, opt-in pass

### Trigger Phrases

- "alignment lane" / "alignment conformance audit"
- "conformance review" / "standard authority check"
- "deep alignment" / "deep-alignment"
- "check against sk-doc/sk-git/sk-design/sk-code standards"
- "structured scoping review"

### Keyword Triggers

`deep alignment`, `alignment lane`, `conformance review`, `standard authority check`, `known-deviation suppression`, `verify-first`, `structured scoping`, `artifact conformance`

---

## 2. SMART ROUTING

`deep-alignment` is a nested mode-packet dispatched by the `system-deep-loop` hub, not a standalone skill; its own `references/` and `assets/` are private to this packet and are what this section routes across. `references/adapters/` holds each registered adapter's spec and known-deviation list; the remaining `references/*.md` hold the state-agnostic lane-resolution and state-machine protocol docs; `assets/` holds the runtime config template.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/scoping_protocol.md` |
| CONDITIONAL | If intent/state signals match | Lane config schema, discover contract, state-machine wiring, the active lane's selected adapter + known-deviation pair |
| ON_DEMAND | Only on explicit request | Adapter specs outside the active lane, `assets/deep_alignment_config_template.json` |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards markdown paths, checks `inventory`, and uses `seen`.
- Pattern 3: Extensible Routing Key - `get_routing_key()` derives the active state from dispatch context; `get_adapter_key()` prefers the lane's selected adapter and falls back to its authority.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns lane/state disambiguation and an unresolved state returns a "no alignment resources" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/scoping_protocol.md"

INTENT_SIGNALS = {
    "ALIGNMENT_SCOPE":    {"weight": 4, "keywords": ["alignment lane", "scoping question", "lane-config", "artifact-class", ":auto", ":confirm"]},
    "ALIGNMENT_DISCOVER": {"weight": 4, "keywords": ["discover contract", "adapter discover", "artifact corpus", "coverage graph seed"]},
    "ALIGNMENT_CHECK":    {"weight": 4, "keywords": ["standard source", "known deviation", "verify-first", "conformance check", "P0", "P1", "P2"]},
    "ALIGNMENT_CONVERGE": {"weight": 3, "keywords": ["alignment convergence", "coverage threshold", "stability window", "converged"]},
    "ALIGNMENT_REPORT":   {"weight": 3, "keywords": ["alignment report", "findings registry", "per-lane verdict", "overall verdict"]},
}

NOISY_SYNONYMS = {
    "ALIGNMENT_SCOPE":    {"three-axis question": 1.6, "authority scope tree": 1.5, "headless conformance sweep": 1.4},
    "ALIGNMENT_DISCOVER": {"seed FILE nodes": 1.5, "adapter contract": 1.4, "corpus partitioning": 1.4},
    "ALIGNMENT_CHECK":    {"re-probe finding": 1.5, "reasoning-agent dispatch": 1.4, "suppress known deviation": 1.4},
    "ALIGNMENT_CONVERGE": {"dry-run stability": 1.5, "coverage-and-stability": 1.5, "max iterations": 1.3},
    "ALIGNMENT_REPORT":   {"worst verdict rollup": 1.5, "one report per lane": 1.4},
}

# RESOURCE_MAP: state-scoped protocol references plus the config asset.
RESOURCE_MAP = {
    "ALIGNMENT_SCOPE":    ["references/scoping_protocol.md", "references/lane_config_schema.md"],
    "ALIGNMENT_DISCOVER": ["references/discover_contract.md"],
    "ALIGNMENT_CHECK":    ["references/state_machine_wiring.md"],
    "ALIGNMENT_CONVERGE": ["references/state_machine_wiring.md"],
    "ALIGNMENT_REPORT":   ["references/state_machine_wiring.md"],
}

# ADAPTER_RESOURCE_MAP: adapter + known-deviation prompt pack, keyed by the
# active lane's selected adapter. Default adapters keep their authority name.
ADAPTER_RESOURCE_MAP = {
    "sk-doc":    ["references/adapters/sk_doc_adapter.md", "references/adapters/sk_doc_known_deviations.md"],
    "sk-doc-command": ["references/adapters/sk_doc_command_adapter.md", "references/adapters/sk_doc_command_known_deviations.md"],
    "sk-git":    ["references/adapters/sk_git_adapter.md", "references/adapters/sk_git_known_deviations.md"],
    "sk-design": ["references/adapters/sk_design_adapter.md", "references/adapters/sk_design_known_deviations.md", "references/adapters/sk_design_live_render_adapter.md"],
    "sk-design-live-render": ["references/adapters/sk_design_adapter.md", "references/adapters/sk_design_known_deviations.md", "references/adapters/sk_design_live_render_adapter.md"],
    "sk-code":   ["references/adapters/sk_code_adapter.md", "references/adapters/sk_code_known_deviations.md"],
}

PHASE_RESOURCE_MAP = {
    "scope":    ["references/scoping_protocol.md", "references/lane_config_schema.md"],
    "discover": ["references/discover_contract.md"],
    "iterate":  ["references/state_machine_wiring.md"],
    "converge": ["references/state_machine_wiring.md"],
    "report":   ["references/state_machine_wiring.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the resolved alignment lane (authority x artifact-class x scope)",
    "Confirm the current state (SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT)",
    "Provide one concrete artifact path, finding, or expected verdict",
    "Confirm the verification command set before completion",
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
    state = str(getattr(dispatch_context, "state", "")).strip().lower()
    if state:
        return state
    text = str(getattr(dispatch_context, "text", "")).lower()
    if "converge" in text or "stability" in text:
        return "converge"
    if "report" in text or "verdict" in text:
        return "report"
    if "check" in text or "finding" in text:
        return "iterate"
    if "discover" in text or "corpus" in text:
        return "discover"
    return "scope"

def get_authority_key(dispatch_context) -> str:
    authority = str(getattr(dispatch_context, "authority", "")).strip().lower()
    return authority if authority in {"sk-doc", "sk-git", "sk-design", "sk-code"} else ""

def get_adapter_key(dispatch_context) -> str:
    adapter = str(getattr(dispatch_context, "adapter", "")).strip().lower()
    authority = get_authority_key(dispatch_context)
    if adapter:
        return adapter if adapter in ADAPTER_RESOURCE_MAP else ""
    return authority if authority in ADAPTER_RESOURCE_MAP else ""

def route_alignment_resources(task, dispatch_context):
    inventory = discover_markdown_resources()
    routing_key = get_routing_key(dispatch_context)
    authority_key = get_authority_key(dispatch_context)
    adapter_key = get_adapter_key(dispatch_context)
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

    load_if_available(DEFAULT_RESOURCE)

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
            "notice": f"No alignment resources found for routing key '{routing_key}'",
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    for relative_path in phase_resources:
        load_if_available(relative_path)

    for relative_path in ADAPTER_RESOURCE_MAP.get(adapter_key, []):
        load_if_available(relative_path)

    return {
        "routing_key": routing_key,
        "authority_key": authority_key or "unspecified",
        "adapter_key": adapter_key or "unspecified",
        "intents": intents,
        "resources": loaded,
    }
```

### Phase Detection

| State | Signal | Resources to Load |
|-------|--------|-------------------|
| SCOPE | No `deep-alignment-config.json` yet, or lane-resolution/`--lane-config` keywords | `scoping_protocol.md`, `lane_config_schema.md` |
| DISCOVER | Config frozen, corpus not yet built | `discover_contract.md`, the active lane's selected adapter spec |
| ITERATE | Corpus exists, `deep-alignment-state.jsonl` advancing | the active lane's adapter + known-deviations pair |
| CONVERGE | `check-convergence.cjs` dispatch context | `state_machine_wiring.md` (convergence formula) |
| REPORT | Convergence returned `CONVERGED`/`STOP_MAX_ITERATIONS`/`NOTHING_TO_CONVERGE` | `state_machine_wiring.md` (reducer wiring) |

---

## 3. HOW IT WORKS

### Architecture

Each run resolves to one or more alignment lanes, one lane per (standard authority x artifact class x scope) combination the operator names, either through an interactive three-axis question or a non-interactive lane-config file for headless invocation. A per-authority adapter separates "find the artifacts" from "find the standard" from "check the artifact against the standard," so the loop itself never branches on which authority it is running -- new authorities register by implementing the same three methods, not by changing the loop. The loop reuses the same convergence engine other iterative modes in this hub already run on rather than forking a parallel one.

### State Machine

`INIT` resolves the bound spec folder and loop configuration. `SCOPE` resolves the run's alignment lanes. `DISCOVER` finds the artifacts each lane covers. `ITERATE` checks artifacts against their lane's standard, slice by slice, re-verifying every finding before it is recorded. `CONVERGE` evaluates coverage and stability against the same thresholds this hub's other convergence-driven modes use. `REPORT` emits one alignment report per lane. An optional `REMEDIATE` state follows only when explicitly requested and approved -- it never runs as part of the default, read-only loop.

### The Alignment Contract

exec
/bin/zsh -lc "sed -n '261,420p' ../../../../../../.opencode/skills/system-deep-loop/deep-alignment/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:

Four invariants, enforced by the engine itself and not left to individual adapters to opt into:

1. **Verify-first** -- every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted. Pattern-matching alone is never sufficient grounds for a finding.
2. **Known-deviation suppression** -- each authority's own standard source carries a list of accepted, intentional conventions, so a real repo-wide convention is never flagged as drift.
3. **Read-only by default** -- the loop observes and reports. It never modifies an audited artifact unless remediation is explicitly requested.
4. **Gated remediation** -- fixing findings is a separate, opt-in, operator-approved pass, not an automatic follow-on. When it runs, it stays verify-first and respects this repo's existing safety discipline: scoped staging only, a worktree when the branch has diverged, and doc-only restraint when concurrent sessions are live.

---

## 4. RULES

### ✅ ALWAYS

1. Resolve lanes before discovering artifacts. Never guess a scope.
2. Re-verify a finding against live ground truth before recording it.
3. Check every finding against its lane's known-deviation list before asserting drift.
4. Keep the audited target read-only outside a gated remediation pass.
5. Emit one report per lane, not one blended report across authorities.

### ⛔ NEVER

1. Assert a finding from pattern-matching alone without a live re-probe.
2. Flag an authority's own documented, intentional convention as drift.
3. Modify an audited artifact during the default read-only loop.
4. Run remediation without an explicit, separate operator opt-in.
5. Blend structural hub-health checks or general correctness review into an alignment finding. Route those to `parent-skill-check.cjs` or `deep-review` instead.

### ⚠️ ESCALATE IF

1. **The operator requests remediation** -- confirm the exact scope (which findings, which lane) and get an explicit, separate opt-in before entering `REMEDIATE`; never treat a report review as implicit approval.
2. **`deep-alignment-state.jsonl` or a delta file is corrupted** -- cannot reconstruct iteration history; pause and report rather than guessing at prior findings.
3. **`check-convergence.cjs` returns `STOP_MAX_ITERATIONS` with lanes still uncovered or unstable** -- the run did not converge; report which lanes are unresolved rather than presenting a partial result as a clean pass.
4. **`loop-lock.cjs acquire` fails** -- another alignment run holds the lock on this spec folder; do not force-acquire or bypass the lock.
5. **A lane's overall verdict is `FAIL`** -- a confirmed P0 finding remains; human sign-off is required before treating the audited artifact as shipped-to-standard.

---

## 5. REFERENCES

### Core References

- [scoping_protocol.md](./references/scoping_protocol.md) - Three-axis ARTIFACT-CLASS x AUTHORITY x SCOPE lane resolution
- [lane_config_schema.md](./references/lane_config_schema.md) - `--lane-config` JSON shape, authority/artifact-class validity, and the error contract
- [discover_contract.md](./references/discover_contract.md) - The authority-agnostic `discover(scope) -> artifacts` half of the adapter contract
- [state_machine_wiring.md](./references/state_machine_wiring.md) - State-to-script wiring, the `alignment/` file layout, and the convergence formula
- [adapters/sk_doc_adapter.md](./references/adapters/sk_doc_adapter.md), [adapters/sk_git_adapter.md](./references/adapters/sk_git_adapter.md), [adapters/sk_design_adapter.md](./references/adapters/sk_design_adapter.md), [adapters/sk_design_live_render_adapter.md](./references/adapters/sk_design_live_render_adapter.md), [adapters/sk_code_adapter.md](./references/adapters/sk_code_adapter.md) - Per-authority `standardSource`/`discover`/`check` specifications
- [adapters/sk_doc_known_deviations.md](./references/adapters/sk_doc_known_deviations.md), [adapters/sk_git_known_deviations.md](./references/adapters/sk_git_known_deviations.md), [adapters/sk_design_known_deviations.md](./references/adapters/sk_design_known_deviations.md), [adapters/sk_code_known_deviations.md](./references/adapters/sk_code_known_deviations.md) - Per-authority known-deviation suppression lists

### Templates and Assets

- [deep_alignment_config_template.json](./assets/deep_alignment_config_template.json) - Config template with convergence defaults, file-protection rules, and script wiring

### Reference Loading Notes

- Load only the references the active state and the active lane's authority require.
- Keep `SMART ROUTING` (Section 2) as the single routing authority.

---

## 6. SUCCESS CRITERIA

### Alignment Run Completion Checklist

**A run is complete when**:
- ✅ Every resolved lane has been discovered and checked at least once
- ✅ Convergence reached `CONVERGED` (coverage AND stability), or a documented `STOP_MAX_ITERATIONS`/`NOTHING_TO_CONVERGE` outcome
- ✅ Every finding was re-verified against live ground truth before being recorded (verify-first)
- ✅ Every finding was checked against its lane's known-deviation list before being asserted as drift
- ✅ `alignment-report.md` carries one section per lane plus an overall worst-verdict rollup
- ✅ `deep-alignment-findings-registry.json` and all canonical state files parse cleanly

### Quality Targets

- **Artifact coverage**: 100% of discovered artifacts checked at least once per lane (`coverageThreshold: 1.0`)
- **Dry-run stability**: the last 2 iteration records report `newFindingsRatio === 0` (`stabilityWindow: 2`)
- **Max iterations**: 10, an independent hard stop applied regardless of the coverage-AND-stability outcome

### Validation Success

**Validation passes when**:
- ✅ `node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` passes
- ✅ `node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs <spec-folder>` returns a JSON summary with `registryPath`, `reportPath`, `overallVerdict`, `laneCount`, `findingsBySeverity`, and `corruptionCount`
- ✅ `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/system-deep-loop/deep-alignment --check` prints `Result: PASS`

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md or AGENTS.md). Skill routing follows this hub's own advisor wiring; file modifications during a run require the same spec-folder discipline as any other mutation.

### Cross-Workflow Contracts

`/deep:alignment` is this mode's invocation point; its command workflow owns state, dispatch, and convergence. The bound spec folder's `alignment/` subdirectory is the only writable state surface outside a gated `REMEDIATE` pass.

### Tool Usage Guidelines

**Task**: reserved for the command executor's iteration dispatch; never used to hand-dispatch the `@deep-alignment` LEAF agent directly for looping.

**Bash**: runs the state-machine scripts (`scoping.cjs`, `check-convergence.cjs`, `partition-corpus.cjs`, each adapter's CLI) and the gated `remediate-hook.cjs`; never a custom ad-hoc dispatcher.

**Grep/Glob/Read**: used by adapters and the loop to discover artifacts and re-verify findings against live ground truth.

### Knowledge Base Dependencies

**Required**: `references/scoping_protocol.md` and `references/lane_config_schema.md` for lane resolution; `references/discover_contract.md` and the active lane's selected adapter spec for discovery and checking; `references/state_machine_wiring.md` for convergence and reducer wiring.

**Optional**: the remaining adapter and known-deviation docs, loaded only when a lane selects that adapter.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference and asset docs dynamically under `references/` and `assets/`. Start with `references/scoping_protocol.md`, `references/lane_config_schema.md`, `references/discover_contract.md`, and `references/state_machine_wiring.md`, then load the active lane's selected adapter and known-deviation pair, and `assets/deep_alignment_config_template.json` when the config shape is needed.

Scripts: `scripts/scoping.cjs`, `scripts/check-convergence.cjs`, `scripts/partition-corpus.cjs`, `scripts/remediate-hook.cjs`, and `scripts/adapters/<authority>.cjs`.

Related skills: `deep-review` for general-correctness iterative review sharing this hub's convergence engine, `parent-skill-check.cjs` for the hub structural checks this mode does not duplicate, and `system-spec-kit` for command-owned state and continuity saves.

codex
The mode contract confirms the weak point: “verify-first” validates asserted findings, but it does not prove authority freshness, suppression safety, or negative-result completeness. I’m testing mechanisms that close those three gaps without turning alignment into general review.
web search: 
web search: site:github.com/theupdateframework/python-tuf GitHub stars latest release timestamp metadata expiration rollback freeze ...
web search: 
web search: 
web search: 
web search: 'stars'
web search: 
web search: site:codeql.github.com/docs "query suites" include exclude precision ...
web search: 
web search: site:github.com/github/codeql/releases latest release 2026 ...
web search: 
web search: github/codeql repository updated July 2026 stars 9.8k ...
web search: 
web search: site:theupdateframework.readthedocs.io python-tuf ngclient Updater refresh trusted metadata source code ...
web search: 
web search: MUSE mutation-based evaluation static analysis tools paper ICSE 2015 PDF ...
web search: 
web search: site:github.com/github/codeql/blob/main "security-extended.qls" ...
web search: 
web search: site:github.com/aquasecurity/trivy/blob/main "ExpiredAt" "IgnoredFinding" ...
web search: 
web search: aquasecurity trivy source code ignore yaml expired_at Go IgnoreConfig ...
codex
The current contract protects against unsupported positive findings, but not unsupported clean bills of health. Three circularities remain:

- “Live ground truth” may be stale, unauthorized, or internally inconsistent.
- “100% of discovered artifacts” is meaningless if discovery omitted artifacts or entire lanes.
- Known deviations can suppress indefinitely, overmatch after moves, or preserve an obsolete verifier configuration.

A high-precision/high-recall design must therefore audit the auditor.

1. Authority freshness must become a precondition, not metadata. Borrow TUF’s separation of trusted root, timestamp, snapshot, and targets: resolve an immutable authority capsule containing the authority epoch, source hashes, rule manifest, predecessor IDs, verifier version, publisher identity, and expiry. Reject rollback, expiry, missing previously declared rules, and mixed-version sources before `DISCOVER`. Pin one capsule for the run; an authority change becomes an explicit epoch transition, never a mid-run refresh. TUF’s client workflow already implements this ordering in `tuf.ngclient.Updater.refresh()`, while its specification defines rollback, freeze, and mix-and-match checks. [Python-TUF](https://github.com/theupdateframework/python-tuf), [TUF specification](https://github.com/theupdateframework/specification/blob/master/tuf-spec.md).

Suggested API:

```text
resolveAuthority(authority) -> {
  authorityEpoch,
  publisher,
  standardSources: [{uri, digest, ruleIds}],
  verifier: {id, version, digest},
  issuedAt,
  expiresAt,
  previousEpoch
}
```

Failure should produce `AUTHORITY_UNTRUSTED` or `INCONCLUSIVE`, never `PASS`. Map: `deep-alignment`, `runtime/state-jsonl-checkpointing`, `runtime/continuity-threading`.

2. Replace blanket known-deviation suppression with an expiring, typed ledger plus a shadow lane. Each deviation needs `deviationId`, `ruleId`, exact subject selector, semantic fingerprint, authority epoch, verifier digest, owner, evidence digest, reason, expiry, and expected match cardinality. Trivy’s YAML ignore model demonstrates useful minimum fields—ID, paths, expiry, and statement—although that format remains experimental. [Trivy filtering schema](https://trivy.dev/docs/latest/guide/configuration/filtering/).

The stronger mechanism comes from `detect-secrets`: a baseline preserves reviewed labels, but it can also pin the plugin set that created it; `--force-use-all-plugins` is needed to exercise newer detectors. Its `--only-allowlisted` mode explicitly re-scans exceptions. Deep-alignment should do the same:

- Every run: evaluate deviations without suppression in a shadow channel.
- Authority/verifier change: fully revalidate all affected deviations.
- Ordinary run: budgeted sampling is acceptable, but expired, widened, or cardinality-changing selectors are mandatory.
- Report `suppressed_count`, `stale_deviations`, `selector_expansion`, `newly_applicable_rules`, and `suppression_exposure`.

This catches the dangerous case where suppression remains syntactically valid while the rule, verifier, or artifact meaning changes. [Yelp/detect-secrets](https://github.com/Yelp/detect-secrets).

3. A clean verdict needs recall evidence. Build a rule-applicability graph over `(authority epoch, rule, artifact class, scope, verifier)` and distinguish three quantities:

```text
declared_applicable_edges
discovered_testable_edges
successfully_checked_edges
```

`checked / discovered == 1` is insufficient. A lane may pass only when `declared - checked` is empty or every missing edge has an explicit `INCONCLUSIVE` reason.

Each rule should also carry:

- One minimally nonconforming witness.
- One conforming sibling.
- Metamorphic variants such as rename, move, wrapper insertion, equivalent syntax, and irrelevant annotation.
- A precision class: `blocking`, `candidate`, or `experimental`.

Run witnesses before the real corpus. A surviving violation witness marks the verifier or lane `DEGRADED` and blocks `PASS`. A 2024 study found new false-positive and false-negative defects in established analyzers through metamorphic transformations, confirming that replaying the same validator is not an independent completeness check. [Cui et al., 2024](https://arxiv.org/abs/2408.13855).

CodeQL supplies the useful operating model for balancing precision and recall: its default suite favors high precision, while `security-extended` adds lower-precision queries; query metadata includes stable IDs, predecessor IDs, and explicit precision. Deep-alignment should let deterministic/high-precision rules block, while extended semantic rules create candidates requiring a second verifier or evidence probe. [CodeQL query suites](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites), [query metadata](https://codeql.github.com/docs/writing-codeql-queries/metadata-for-codeql-queries/).

The moat is a temporal conformance proof, not another finding list. A linter says which rules fired now. A one-shot prompt can reason semantically but cannot establish authority provenance, scope closure, exception history, or cross-run comparability. The other deep modes investigate truth, review correctness, deliberate choices, or improve artifacts. Deep-alignment alone should answer:

> Under this authorized authority epoch, verifier epoch, declared lane universe, and reviewed exception set, what conforms—and what evidence makes the absence of findings credible?

Sharpen that identity by emitting an alignment certificate containing the capsule digest, closure matrix, verifier manifest, sentinel mutation score, suppression exposure, and `PASS|FAIL|INCONCLUSIVE`. The certificate remains read-only and reproducible; remediation stays separate.

```json
{
  "new_repos": [
    {
      "name": "theupdateframework/python-tuf",
      "url": "https://github.com/theupdateframework/python-tuf",
      "stars": "~1.7k",
      "what": "Python TUF reference implementation; v7.0.0 released 2026-05-18.",
      "lesson": "Pin an authority capsule and reject expired, rolled-back, or mixed-version authority material before auditing artifacts.",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "aquasecurity/trivy",
      "url": "https://github.com/aquasecurity/trivy",
      "stars": "~36.9k",
      "what": "Multi-domain security scanner; v0.72.0 released 2026-06-30.",
      "lesson": "Known deviations should be rule-specific, path-scoped, justified, and expiring rather than permanent blanket suppressions.",
      "maps_to": [
        "deep-alignment",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "Yelp/detect-secrets",
      "url": "https://github.com/Yelp/detect-secrets",
      "stars": "~4.5k",
      "what": "Baseline-oriented secret scanner; latest tagged release v1.5.0 was 2024-05-06.",
      "lesson": "Baselines can freeze an obsolete detector set; explicitly re-run latest verifiers and separately scan allowlisted material.",
      "maps_to": [
        "deep-alignment",
        "runtime/dedup-novelty",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "github/codeql",
      "url": "https://github.com/github/codeql",
      "stars": "~9.8k",
      "what": "Open CodeQL query and library packs; active in 2026 with bundle v2.25.5 shipped in May.",
      "lesson": "Give rules stable lineage and precision classes, then separate blocking high-precision checks from recall-oriented candidate suites.",
      "maps_to": [
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A readable live authority file is not necessarily current or authorized; conformance requires rollback, expiry, and mix-and-match checks over a pinned authority epoch.",
      "evidence": "https://github.com/theupdateframework/specification/blob/master/tuf-spec.md",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Suppression state can silently preserve obsolete verifier capabilities, so every deviation must bind to both an authority epoch and verifier digest.",
      "evidence": "https://github.com/Yelp/detect-secrets",
      "maps_to": [
        "deep-alignment",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Completeness must be measured against declared applicability edges, not only discovered artifacts; otherwise a broken discovery adapter reports perfect coverage.",
      "evidence": "https://arxiv.org/abs/2408.13855",
      "maps_to": [
        "deep-alignment",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Precision and recall can coexist through asymmetric verdict authority: high-precision rules may block, while extended rules create candidates requiring independent confirmation.",
      "evidence": "https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites",
      "maps_to": [
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an authority-capsule gate before DISCOVER with source digests, rule manifest, publisher, authority epoch, verifier digest, expiry, predecessor epoch, and rollback or mix-and-match rejection.",
      "target": "deep-alignment",
      "rationale": "Verify-first cannot establish precision when the authority or verifier being re-probed is stale, partial, or unauthorized.",
      "uniqueness": "Turns alignment into a reproducible temporal conformance proof tied to an authorized standard version, which a linter or one-shot prompt cannot provide.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/theupdateframework/specification/blob/master/tuf-spec.md"
    },
    {
      "rec": "Compile known deviations into an expiring typed ledger and add an unsuppressed shadow lane, with full replay after authority or verifier changes and cardinality checks after artifact moves.",
      "target": "deep-alignment",
      "rationale": "This detects stale exceptions, selector widening, verifier pinning, and suppression leakage without sacrificing the default report's precision.",
      "uniqueness": "Makes exception governance and drift-through-suppression first-class longitudinal evidence rather than a static ignore list.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://trivy.dev/docs/latest/guide/configuration/filtering/"
    },
    {
      "rec": "Require a rule-applicability closure matrix plus positive, negative, and metamorphic sentinels; classify rules as blocking or candidate and prohibit PASS when a sentinel survives or an applicability edge is uncovered.",
      "target": "deep-alignment",
      "rationale": "Artifact coverage alone cannot detect broken discovery, missing lanes, or verifier false negatives.",
      "uniqueness": "The resulting alignment certificate explains why absence of findings is credible, separating deep-alignment from finding-oriented linters and general deep-review.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2408.13855"
    }
  ],
  "contradictions": [
    {
      "claim": "Re-verifying every finding against live ground truth is sufficient for high precision.",
      "counter": "The same re-probe reproduces stale authority, stale verifier, and shared-model errors; authority and verifier provenance must be independently validated.",
      "evidence": "https://github.com/theupdateframework/specification/blob/master/tuf-spec.md"
    },
    {
      "claim": "Checking 100% of discovered artifacts establishes alignment coverage.",
      "counter": "A faulty discovery adapter or omitted lane shrinks the denominator and can produce a perfect score with silent violations.",
      "evidence": "https://arxiv.org/abs/2408.13855"
    }
  ],
  "next_angles": [
    "Design replayable alignment certificates: determine which artifacts, authority sources, verifier binaries, environment facts, and exception decisions must be retained to reproduce an old PASS.",
    "Benchmark lane-closure proofs based on registries, build manifests, exhaustive globs, and independent discovery adapters under file moves, generated artifacts, and newly introduced artifact classes.",
    "Calibrate candidate-to-blocking promotion using historical false-positive and false-negative corpora per rule, including confidence decay after authority or verifier upgrades."
  ],
  "notes": "Trivy's structured YAML ignore format is explicitly marked experimental, so copy the lifecycle semantics rather than its wire format. detect-secrets remains useful mechanistically, but its latest tagged release is from May 2024. Exact internal Trivy ignore-parser module paths were not verified; recommendations rely on its current official schema and documented behavior."
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
144,547
