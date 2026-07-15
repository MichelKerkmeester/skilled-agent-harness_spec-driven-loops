<!-- iteration 23 | SOL xhigh | mode: deep-alignment | angle: A3-mech deep-alignment :: mechanisms & reference impls | 2026-07-15T09:58:48.260Z -->

Deep-alignment should become a versioned authority compiler and temporal conformance ledger. A linter answers whether today’s artifact passes today’s hard-coded rules. Deep-alignment should determine whether a result remains valid after the authority, verifier, artifact, or environment changes—and identify which change caused the delta.

### 1. Compile authority into tested rule capsules

The current `standardSource()` abstraction identifies source files but does not establish that prose was translated faithfully. Add an explicit compilation boundary:

`authority text → structured rule IR → executable predicates → mutation-tested capsule → authorized publication`

A rule capsule should contain:

- Authority URI, edition, digest, and precedence metadata.
- Stable rule IDs tied to exact source spans and quote hashes.
- Modality: `must`, `should`, `may`, or `prohibited`.
- Applicability and assertion expressions.
- Required observations and an explicit absence-proof policy.
- Severity, exceptions, and cross-authority dependencies.
- Positive, negative, and `unknown` witnesses.
- Compiler identity/version and publication status: `draft`, `validated`, or `approved`.

The strongest reference pattern is the strict hybrid boundary in the ACL 2026 policy-compilation paper: an LLM extracts structured condition trees, while deterministic validators check schema completeness, units, conflicts, numeric constraints, and grounded service names; invalid trees are not published. [Req2LTL](https://arxiv.org/abs/2512.17334) independently supports hierarchical intermediate representations plus deterministic synthesis rather than direct prose-to-rule prompting. [ACL paper](https://aclanthology.org/2026.acl-industry.114/)

[CEL](https://cel.dev/overview/cel-overview) is a useful execution substrate: rules are parsed and type-checked before repeated evaluation, retain source diagnostics, support cost estimation, and can produce residual expressions when inputs are unknown. The transfer is an inference: CEL validates the executable rule, not whether it faithfully represents the prose. Capsule witnesses and authorized publication must close that semantic gap. Relevant implementation surfaces are [`Env.Compile`, `Program`, and `ResidualAst`](https://github.com/cel-expr/cel-go/blob/master/cel/env.go) plus evaluation-state and cost tracking in [`program.go`](https://github.com/cel-expr/cel-go/blob/master/cel/program.go).

Every capsule should undergo five authority mutations already identified by the open thread: delete, weaken, invert, narrow, and exception-wrap. Publication fails unless capsule tests or historical witnesses detect the expected semantic change.

### 2. Make evidence and suppression separate append-only facts

A verify-first finding should require an evidence receipt binding:

`artifact digest + rule ID + capsule digest + verifier identity/version + input digest + observation time + result + evidence references + missing facts`

The result should be one of `conform`, `nonconform`, or `inconclusive`. Missing or stale evidence is not conformity. For absence claims, the capsule selects a policy such as deterministic coverage proof, independent observations, or explicit abstention.

This mirrors the useful binding properties of [Cosign verification](https://docs.sigstore.dev/cosign/verifying/verify/): the decision is tied to an artifact digest, signature material, signer constraints, and transparency evidence—not merely a textual claim that verification happened.

Known deviations should never erase raw findings. [ORT resolutions](https://oss-review-toolkit.org/ort/docs/configuration/resolutions) provide the key precedent: resolutions influence reporting while analyzer and scanner evidence remains intact. Deep-alignment should strengthen ORT’s message-regex matching with semantic deviation records:

- `authority_rule_id`
- `applicability_fingerprint`
- `subject_selector`
- `authority_compatibility_range`
- `reason_code`, approver, and evidence
- Creation and expiry times
- Revalidation triggers for authority, verifier, artifact identity, and environment changes

The matcher returns `EXACT`, `MIGRATABLE`, `STALE`, or `AMBIGUOUS`. Only `EXACT` suppresses automatically. `MIGRATABLE` requires witness replay; the others reopen the finding.

### 3. Treat authority drift as an impact-analysis problem

[Buf’s breaking-change system](https://buf.build/docs/breaking/rules/) demonstrates that compatibility is multidimensional: file/source compatibility, package compatibility, wire-plus-JSON compatibility, and wire compatibility can disagree. Its rule infrastructure also associates checks with plugin and policy identities, while configuration supports scoped exceptions. [Configuration](https://buf.build/docs/configuration/v2/buf-yaml/) and [`rule.go`](https://github.com/bufbuild/buf/blob/main/private/bufpkg/bufcheck/rule.go) provide concrete reference surfaces.

Deep-alignment should therefore distinguish:

- `logicalLaneId = H(authority, artifactClass, normalizedScope)`
- `laneEpochId = H(logicalLaneId, capsuleDigest, verifierVersion, environmentProfile)`

When authority changes, compare old and new capsules and classify each rule as `ADD`, `REMOVE`, `STRENGTHEN`, `WEAKEN`, `SCOPE_SHIFT`, `EVIDENCE_CHANGE`, `SEVERITY_CHANGE`, or `UNKNOWN_SEMANTIC`. Construct a dependency graph from changed rules to required observations and matching artifacts. Fan out only affected components; replay their witnesses and deviations; fan in while preserving cross-authority conflicts and `INCONCLUSIVE` results.

Append continuity events such as `authority_capsule_published`, `rule_changed`, `evidence_observed`, `finding_asserted`, `deviation_adjudicated`, `suppression_applied`, and `comparison_invalidated`. Useful gauges become authority-change blast radius, comparable-pass rate, stale deviations, witness-replay failures, missing-observation rate, and suppression leakage.

### Unique-value thesis

The moat is longitudinal attribution. Deep-alignment can answer:

- Did the artifact drift, or did the authority change underneath it?
- Which previous passes remain comparable under the new edition?
- Which accepted deviations became stale, and why?
- Would this artifact pass under the previous authority?
- What evidence justified each finding at that historical epoch?

A linter has a fixed executable ruleset and normally reports only the current scan. A one-shot prompt lacks governed compilation, historical witnesses, evidence freshness, exception lifecycle, and replayable continuity. The other deep modes discover information, review correctness, deliberate among perspectives, or propose improvements; deep-alignment alone should maintain a binding, edition-aware conformance ledger.

```json
{
  "new_repos": [
    {
      "name": "cel-expr/cel-go",
      "url": "https://github.com/cel-expr/cel-go",
      "stars": "~3k",
      "what": "Typed, non-Turing-complete expression engine with source diagnostics, residual unknown expressions, and cost tracking; v0.29.2 released 2026-07-08.",
      "lesson": "Compile authority rules into checked, source-linked executable predicates while retaining unknown inputs instead of forcing pass/fail.",
      "maps_to": [
        "deep-alignment",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "bufbuild/buf",
      "url": "https://github.com/bufbuild/buf",
      "stars": "~11.3k",
      "what": "Schema compatibility engine with several breaking-change categories, scoped policies, exceptions, and a large compatibility corpus; v1.71.0 released 2026-06-16.",
      "lesson": "Represent authority drift with explicit compatibility classes and replay only rules and artifacts affected by the changed contract.",
      "maps_to": [
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "oss-review-toolkit/ort",
      "url": "https://github.com/oss-review-toolkit/ort",
      "stars": "~2k",
      "what": "Policy evaluator with typed resolutions kept separate from analyzer and scanner evidence; release 91.0.1 published 2026-07-09.",
      "lesson": "Apply known deviations as an adjudication overlay without deleting the raw finding or observation history.",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "sigstore/cosign",
      "url": "https://github.com/sigstore/cosign",
      "stars": "~6.1k",
      "what": "Artifact verification binds digests, signer identity, certificates, signatures, and transparency evidence; v3.1.1 released 2026-06-09.",
      "lesson": "Make every conformance assertion depend on a receipt binding subject, authority epoch, verifier version, and evidence inputs.",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Authority compilation needs a governed intermediate representation: LLM extraction may propose rule trees, but deterministic validation, witnesses, source spans, and authorized publication must gate execution.",
      "evidence": "https://aclanthology.org/2026.acl-industry.114/ ; https://arxiv.org/abs/2512.17334",
      "maps_to": [
        "deep-alignment",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    },
    {
      "insight": "Residual executable expressions provide a concrete absence-proof mechanism: unresolved required observations can remain explicit and yield INCONCLUSIVE instead of false conformity.",
      "evidence": "https://github.com/cel-expr/cel-go/blob/master/cel/env.go",
      "maps_to": [
        "deep-alignment",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Suppression is a new adjudication fact, not a destructive rewrite of the original finding; authority or verifier changes can then reactivate it deterministically.",
      "evidence": "https://oss-review-toolkit.org/ort/docs/configuration/resolutions",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Cross-epoch conformance requires compatibility classes rather than one global pass/fail bit because the same change may preserve one contract while breaking another.",
      "evidence": "https://buf.build/docs/breaking/rules/",
      "maps_to": [
        "deep-alignment",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evidence receipts should be content-bound and freshness-aware so resume can distinguish verified observations from stale, missing, or unverifiable claims.",
      "evidence": "https://docs.sigstore.dev/cosign/verifying/verify/",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an Authority Capsule Compiler that emits stable rule IDs, source spans, typed applicability and assertion expressions, evidence policies, exceptions, witnesses, and a capsule digest; require static validation plus delete, weaken, invert, narrow, and exception-wrap mutation tests before publication.",
      "target": "deep-alignment",
      "rationale": "This closes the unverified semantic gap between an authority document and executable checks, while making authority changes diffable and replayable.",
      "uniqueness": "It turns deep-alignment from a rule runner into a governed compiler for evolving normative authority, a capability absent from ordinary linters and one-shot prompts.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://aclanthology.org/2026.acl-industry.114/ ; https://github.com/cel-expr/cel-go"
    },
    {
      "rec": "Require content-bound EvidenceReceipt events for findings and represent deviations as append-only adjudication records with expiry, authority compatibility ranges, verifier-version triggers, and EXACT/MIGRATABLE/STALE/AMBIGUOUS matching.",
      "target": "deep-alignment + runtime/state-jsonl-checkpointing",
      "rationale": "Raw observations remain auditable, stale suppressions reopen automatically, and absence or verifier failure cannot silently become conformity.",
      "uniqueness": "The resulting conformance ledger can explain exactly why a historical finding was active or suppressed at any authority epoch.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://oss-review-toolkit.org/ort/docs/configuration/resolutions ; https://docs.sigstore.dev/cosign/verifying/verify/"
    },
    {
      "rec": "Separate stable logical lane IDs from epoch-specific lane IDs, classify authority diffs by compatibility type, construct rule-to-observation-to-artifact impact components, and replay only affected witnesses, deviations, and artifacts.",
      "target": "deep-alignment + runtime/fan-out-fan-in + runtime/continuity-threading",
      "rationale": "This gives authority upgrades deterministic blast-radius analysis without paying for a full audit or claiming false comparability across editions.",
      "uniqueness": "It enables counterfactual and longitudinal answers such as whether a failure came from artifact drift, authority drift, verifier drift, or environment drift.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://buf.build/docs/breaking/rules/ ; https://github.com/bufbuild/buf/blob/main/private/bufpkg/bufcheck/rule.go"
    }
  ],
  "contradictions": [
    {
      "claim": "A known deviation should remove or suppress a finding before it reaches persistent state.",
      "counter": "ORT applies resolutions only during reporting while retaining analyzer and scanner evidence; deep-alignment should likewise append adjudication without deleting the raw fact.",
      "evidence": "https://oss-review-toolkit.org/ort/docs/configuration/resolutions"
    },
    {
      "claim": "Conformance results remain comparable whenever the artifact itself has not changed.",
      "counter": "Buf exposes several distinct compatibility contracts, showing that an authority change can preserve one dimension while invalidating another; unchanged artifacts may therefore require reclassification or replay.",
      "evidence": "https://buf.build/docs/breaking/rules/"
    },
    {
      "claim": "A parsed and type-checked executable rule is sufficient evidence that natural-language authority was compiled correctly.",
      "counter": "CEL can establish executable validity, but the policy-compilation evidence requires grounding, conflict checks, witnesses, and human correction or approval to establish semantic fidelity.",
      "evidence": "https://cel.dev/overview/cel-overview ; https://aclanthology.org/2026.acl-industry.114/"
    }
  ],
  "next_angles": [
    "Build the authority-capsule amendment protocol: authorized publishers, evidence required to invalidate a rule, compatibility classifications, and cross-epoch comparison rules.",
    "Implement the five-operator authority mutation benchmark and score semantic mutation detection, witness sensitivity, false invalidation, and human-review load.",
    "Create a deviation-key migration benchmark covering authority upgrades, semantic rewrites, artifact moves, verifier upgrades, and environment drift, measuring suppression leakage and unnecessary reactivation."
  ],
  "notes": "No retrieved repository provides the complete end-to-end combination of prose-authority compilation, authorized capsule publication, evidence-bound conformance, deviation lifecycle, and cross-epoch replay. The ACL policy system's production implementation was not verified as open source, so its architectural transfer is supported by the paper rather than inspectable code. Star counts are approximate GitHub figures observed around 2026-07-15."
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
session id: 019f6531-0364-7982-baf3-4bc2397039ab
--------
user
You are iteration 23/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-alignment
MODE IDENTITY (what it does today): Autonomous standard-authority conformance audit by lane: verify-first findings, known-deviation suppression, read-only default.
GENERIC ALTERNATIVE it must out-value: a linter, or a one-shot 'check this against the rules' prompt

THIS ITERATION'S ANGLE (A3-mech): deep-alignment :: mechanisms & reference impls
DIRECTIVE: Concrete reference impls for deep-alignment: authority/spec -> checkable-rule compilation, verify-first evidence gating, known-deviation registries + suppression, lane decomposition, drift detection when the authority changes. Real repos + code. Actionable designs for deep-alignment + runtime/continuity-threading.

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
THIS run's new repos so far (91) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph, anthropics/sycophancy-to-subterfuge-paper, LiveBench/LiveBench, lm-sys/llm-decontaminator, SeldonIO/alibi-detect, deepchecks/deepchecks, NVIDIA-NeMo/Evaluator, HypothesisWorks/hypothesis, microsoft/Test_Awareness_Steering, treeverse/dvc, open-policy-agent/opa, kyverno/kyverno, microsoft/typespec, specmatic/specmatic, schemathesis/schemathesis, usnistgov/OSCAL, OpenSCAP/openscap, ComplianceAsCode/content, inspec/inspec, openvex/vexctl
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement | deep-alignment
New insights so far: 96; recommendations: 63.
Open threads flagged: Design an authority-capsule amendment protocol: authorized editors, evidence required to invalidate a rule, compatibility classes, baseline establishment, and honest cross-epoch comparability. | Build a mutation benchmark for authority compilation: delete, weaken, invert, narrow, or exception-wrap canonical rules and measure whether capsule tests and historical witness replay catch each change. | Specify a cross-authority conflict algebra for lanes: direct contradiction, precedence, narrower-scope override, incompatible severity, and exception-induced non-monotonicity. | Benchmark deviation-key designs against authority upgrades, file moves, semantic rewrites, verifier upgrades, and environment drift; measure suppression leakage versus unnecessary reactivation. | Build a cross-authority conflict corpus covering direct contradiction, narrower-scope override, edition precedence, incompatible severity, and exception-induced non-monotonicity; score correct abstention as well as resolution. | Compare evidence-sufficiency policies for absence claims—single deterministic verifier, two independent observations, and explicit coverage proof—on false conformity, inconclusive cost, and audit latency.

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
This is read-only research; no file mutation, so the spec-folder write gate does not apply. I’m routing the iteration through the repository’s memory/skill gates first, then I’ll verify the implementation details and current repository signals against primary sources.
exec
/bin/zsh -lc "node .opencode/bin/spec-memory.cjs memory_match_triggers --json '{\"prompt\":\"Iteration 23 deep-alignment mechanisms and reference implementations: authority-to-checkable-rule compilation, verify-first evidence gating, known-deviation suppression, lane decomposition, and authority drift detection.\"}' --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 3278ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

exec
/bin/zsh -lc "node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"Iteration 23 deep-alignment research on concrete mechanisms and reference implementations for authority/spec compilation into checkable rules, verify-first evidence gating, known-deviation registries, lane decomposition, and authority-change drift detection. Read-only web research.\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 0ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-skill-advisor/daemon-ipc.sock",
  "exitCode": 75
}

exec
/bin/zsh -lc 'python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Iteration 23 deep-alignment research on concrete mechanisms and reference implementations for authority/spec compilation into checkable rules, verify-first evidence gating, known-deviation registries, lane decomposition, and authority-change drift detection. Read-only web research." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2945ms:
2026-07-15 11:52:48.085 xcodebuild[4137:207644571]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:52:48.332 xcodebuild[4137:207644570] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-lgsOQv4m' (errno=Operation not permitted)
2026-07-15 11:52:48.804 xcodebuild[4147:207644632]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 11:52:48.924 xcodebuild[4147:207644631] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-deep-loop",
    "kind": "skill",
    "confidence": 0.8385,
    "uncertainty": 0.16,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.592638,
    "dominant_lane": "explicit_author",
    "status": "active",
    "workflowMode": "alignment",
    "mode": "alignment",
    "_shadow": {
      "skillId": "system-deep-loop",
      "liveScore": 0.592638,
      "shadowScore": 0.548922,
      "delta": -0.043716,
      "dominantShadowLane": "explicit_author"
    }
  },
  {
    "skill": "sk-code",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.18,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.302038,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "sk-code",
      "liveScore": 0.302038,
      "shadowScore": 0.28144,
      "delta": -0.020598,
      "dominantShadowLane": "explicit_author"
    }
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.22,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.052621,
    "dominant_lane": "lexical",
    "status": "active",
    "_shadow": {
      "skillId": "sk-doc",
      "liveScore": 0.052621,
      "shadowScore": 0.046983,
      "delta": -0.005638,
      "dominantShadowLane": "lexical"
    }
  }
]

codex
Skill routing: `system-deep-loop` → `alignment` (0.8385 confidence). The memory daemon was unavailable (retryable exit 75), so there is no recovered prior context beyond the prompt; I’m loading the mode contract directly and will keep the work read-only. `sk-code`/`sk-doc` were secondary lexical matches, but neither owns this research-only turn.
exec
/bin/zsh -lc "wc -l .opencode/skills/system-deep-loop/SKILL.md && sed -n '1,260p' .opencode/skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     154 .opencode/skills/system-deep-loop/SKILL.md
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
/bin/zsh -lc "wc -l .opencode/skills/system-deep-loop/deep-alignment/SKILL.md && sed -n '1,320p' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md && sed -n '1,240p' .opencode/skills/system-deep-loop/mode-registry.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     380 .opencode/skills/system-deep-loop/deep-alignment/SKILL.md
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

exec
/bin/zsh -lc "sed -n '321,430p' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md && for f in .opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md .opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md .opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_known_deviations.md; do wc -l \""'$f"; sed -n '"'1,420p' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
     167 .opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md
---
title: "Scoping Protocol - ARTIFACT-CLASS x AUTHORITY x SCOPE Decision Tree"
description: "The structured three-axis decision tree that resolves an interactive or non-interactive deep-alignment run into N alignment lanes, before any artifact is discovered."
trigger_phrases:
  - "deep-alignment scoping question"
  - "alignment lane resolution"
  - "artifact-class authority scope tree"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# Scoping Protocol - ARTIFACT-CLASS x AUTHORITY x SCOPE Decision Tree

The structured three-axis decision tree that resolves a deep-alignment run into N alignment lanes, before any artifact is discovered.

---

## 1. OVERVIEW

### Purpose

`deep-alignment` cannot discover a single artifact until it knows three things: what kind of artifact to look at, whose standard to check it against, and where to look. This protocol is the structured decision tree that resolves those three answers into one or more **alignment lanes** before the `DISCOVER` state runs. It replaces free-text scoping (rejected by ADR-002) with a small, enumerable tree so the same answers always resolve to the same lanes, whether a human answers interactively or a `--lane-config` file supplies them for a headless run.

An alignment lane is a `(authority, artifactClass, scope)` tuple. One run resolves to **N** lanes, not one. The tree is walked once per lane the operator wants, and lanes accumulate across as many walks as needed in a single session.

### When to Use

- Resolving an interactive deep-alignment scoping question into concrete lanes.
- Authoring a `--lane-config` file and confirming it maps onto the same lane-tuple shape.
- Auditing whether a proposed lane combination is a valid `(authority, artifactClass)` pairing.
- Debugging why a scoping walk produced zero or unexpected lanes.

### Prerequisites

- `lane_config_schema.md` §5, the field-level `scope` definition shared verbatim between the interactive path and `--lane-config`.
- `discover_contract.md`, what a lane's `scope` becomes once `DISCOVER` calls an adapter's `discover(scope)`.

---

## 2. THE THREE AXES

### 2.1 ARTIFACT-CLASS

One of exactly four values:

| Value | Meaning |
|---|---|
| `docs` | Markdown documentation, spec-kit docs, skill reference docs |
| `code` | Source files under a stack `sk-code` recognizes (OpenCode/Webflow surfaces) |
| `designs` | DESIGN.md style-reference docs and design tokens |
| `git-history` | Commits, branches, and worktree state, not file content |

This is asked first because it determines which authorities are even offered next. A `git-history` lane has nothing to do with `sk-doc`, and a `docs` lane has nothing to do with `sk-git`.

### 2.2 AUTHORITY

One or more of the currently registered authorities, presented as a **multi-select** once ARTIFACT-CLASS narrows the offered list:

| Authority | v1 artifact-class | Determinism (ADR-004) |
|---|---|---|
| `sk-doc` | `docs` | Reference, most deterministic |
| `sk-git` | `git-history` | Deterministic |
| `sk-design` | `designs` (static only, live-render is phase 010's own authority slot) | Audit-rubric |
| `sk-code` | `code` | Hybrid (ADR-008), hardest, least deterministic |

The set is **extensible**: a fifth authority registers by adding one entry to the `AUTHORITY_ARTIFACT_CLASSES` map in `scripts/scoping.cjs`, plus the short adapter decision-record ADR-012 requires. No change to this tree's shape is needed, only to the options it offers. In v1 each authority maps to exactly one artifact-class. The map itself supports an authority covering more than one class, and an artifact-class being covered by more than one authority, once a later authority actually needs that (the multi-select exists in this tree for that future case, not because v1 needs it: v1's per-class authority lists are always singletons).

### 2.3 SCOPE

One of three shapes, validated against the repo root before being accepted (NFR-S01):

| Type | Shape | Typical artifact-class |
|---|---|---|
| `paths` | A list of one or more repo-relative paths | `docs`, `code`, `designs` |
| `globs` | A list of one or more glob patterns | `docs`, `code`, `designs` |
| `branchRange` | A `{from, to}` pair of git refs | `git-history` |

`scope` validation and its exact JSON shape are shared verbatim between the interactive path and `--lane-config`. See `lane_config_schema.md` §5 for the field-level definition, and `scripts/scoping.cjs`'s `validateScope()` for the one implementation both paths call.

---

## 3. LANE RESOLUTION

One walk of the tree (one ARTIFACT-CLASS, one multi-selected set of AUTHORITY values valid for that class, one SCOPE) expands to one lane per selected authority:

```
walk = (artifactClass, [authority_1, authority_2, ...], scope)
lanes += [(authority_1, artifactClass, scope), (authority_2, artifactClass, scope), ...]
```

A single interactive session repeats this walk as many times as the operator wants (once per artifact-class/authority-set they care about), accumulating lanes across walks. This is how "sk-code and sk-git and/or sk-design in one pass," the multi-authority precedent from `002-architecture-decision`, resolves: three separate walks (`code`/`sk-code`, `git-history`/`sk-git`, `designs`/`sk-design`), each contributing one lane, all inside one session. It is **not** a full cross-product of every artifact-class against every authority. Only the combinations the operator actually names become lanes (REQ-002).

Lane count is unbounded by this phase's contract (SC-002). No hard-coded authority ceiling exists in the tree or in `scripts/scoping.cjs`. A per-run lane cap, if one is ever adopted, is corpus-partitioning territory the `ITERATE` state (phase 008) owns, not a restriction this phase's engine enforces.

---

## 4. THE INTERNAL LANE-TUPLE REPRESENTATION

Both paths, interactive and `--lane-config`, resolve to the exact same shape, so nothing downstream needs to know which path produced a lane:

```json
{
  "authority": "sk-doc",
  "artifactClass": "docs",
  "scope": { "type": "paths", "values": ["docs/", "README.md"] }
}
```

This is the object `scripts/scoping.cjs`'s `validateLane()` returns, and it is what `lane_config_schema.md` documents as the on-disk `--lane-config` array-item shape. There is no separate "interactive lane" type and "config lane" type. One shape, two producers.

---

## 5. INTERACTIVE PATH (CONVERSATIONAL, NOT A TERMINAL PROMPT)

`deep-alignment` is invoked exclusively through `/deep:alignment`'s command workflow (`SKILL.md` "FORBIDDEN INVOCATION PATTERNS"), not as a standalone script a human runs at a terminal. The interactive path is therefore the dispatched agent asking the operator the three-axis question in natural conversation, mirroring how every other state in this mode is agent-driven, not readline-driven, and then calling `scripts/scoping.cjs`'s `resolveLanesFromSelections()` once it has the operator's answers, rather than a Node.js prompt loop. `resolveLanesFromSelections()` takes exactly the shape one or more tree walks produce:

```json
[
  {
    "artifactClass": "code",
    "authorities": ["sk-code"],
    "scope": { "type": "globs", "values": ["src/**/*.ts"] }
  },
  {
    "artifactClass": "git-history",
    "authorities": ["sk-git"],
    "scope": { "type": "branchRange", "from": "main", "to": "HEAD" }
  }
]
```

One array entry per walk, `authorities` carrying the walk's multi-select. This keeps the interactive path's own "script surface" identical in spirit to `discover`/`check`: a pure function the agent calls with structured input, not a UI this codebase would have to build and maintain separately from the conversational flow the rest of the mode already uses.

---

## 6. NON-INTERACTIVE PATH (ADR-011: CONFIG-FILE ONLY)

When `--lane-config <file.json>` is supplied, the interactive question is skipped entirely. When it is absent, the interactive question is the only path. The two never run together, and neither is silently skipped when required (REQ-004): `scripts/scoping.cjs`'s CLI entrypoint enforces this by exiting non-zero with an explicit message if invoked without `--lane-config`. There is no code fallback that guesses lanes, since the fallback is the conversational path above, owned by the invoking command, not this script.

Full field-level schema: `lane_config_schema.md`. Parsing/validation implementation: `scripts/scoping.cjs`'s `parseLaneConfigFile()` / `resolveLanesFromConfig()`.

---

## 7. EDGE CASES

- **Empty scope** (a `paths`/`globs` scope that matches zero files at discover-time): the lane still resolves here in `SCOPE`. `DISCOVER`'s `discover()` call returns an empty artifact corpus and the lane is marked zero-coverage, not an error. See `discover_contract.md` §5.
- **Overlapping scopes across two lanes of different authorities**: both lanes discover independently. This phase does not dedupe across authorities. The same file can be conformance-checked against more than one standard.
- **Invalid AUTHORITY value**: fails fast, before `DISCOVER` starts, naming the unknown authority and the currently registered set (`scripts/scoping.cjs`'s `validateLane()` error message does this verbatim).
- **Interactive session abandoned mid-question**: no lanes are persisted. `SCOPE` has no partial-lane carryover. A walk that never reaches a completed `(artifactClass, authorities, scope)` triple contributes nothing to `resolveLanesFromSelections()`'s input.

---

## 8. NON-FUNCTIONAL CONSTRAINTS

- **NFR-P01**: lane resolution is a pure planning step. `scripts/scoping.cjs` does no artifact scanning of its own. It only validates and shapes the tuples `DISCOVER` will later act on.
- **NFR-S01**: every `paths`/`globs` scope value is validated against the repo root before any adapter's `discover()` sees it. `scripts/scoping.cjs` reuses `runtime/scripts/lib/cli-guards.cjs`'s `validateNamespaceValue()` for this rather than re-implementing path-traversal checks.
- **NFR-R01**: the same `--lane-config` content always resolves to the same lane set. `resolveLanesFromConfig()` has no session-state or clock dependency, so cron runs are reproducible.

---

## 9. REFERENCES AND RELATED RESOURCES

- `discover_contract.md`, what a lane's `scope` becomes once `DISCOVER` calls an adapter's `discover(scope)`.
- `lane_config_schema.md`, the on-disk `--lane-config` JSON shape, field by field.
- `scripts/scoping.cjs`, the one implementation both paths call.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-002 (this tree), ADR-003 (the adapter contract `scope` feeds), ADR-011 (config-file-only), ADR-012 (new-authority registration governance).
     206 .opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md
---
title: "--lane-config JSON Schema (ADR-011: Config-File Only)"
description: "The concrete JSON shape a --lane-config <file.json> file must satisfy for deep-alignment's non-interactive path, and how it maps 1:1 onto the interactive scoping tree's lane-tuple output."
trigger_phrases:
  - "lane-config schema"
  - "deep-alignment non-interactive lanes"
  - "--lane-config json shape"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# --lane-config JSON Schema

The concrete JSON shape a `--lane-config <file.json>` file must satisfy for deep-alignment's non-interactive path.

---

## 1. OVERVIEW

### Purpose

ADR-011 (`002-architecture-decision/decision-record.md`) locks the non-interactive path to **config-file only**: a single `--lane-config <file.json>` flag, not repeated `--lane` flags and not an inline `--lanes` JSON-array flag. This document is that ADR's remaining open deliverable, the concrete field-level JSON shape, and the reference implementation that parses and validates it is `scripts/scoping.cjs`.

### When to Use

- Authoring a `--lane-config` file for a headless deep-alignment run.
- Validating a config-file lane against the same rules `scripts/scoping.cjs` enforces at parse time.
- Confirming a config-file lane resolves to the identical shape an interactive session would produce.
- Debugging a lane-config validation failure (unknown authority, invalid artifact-class, malformed scope).

### Prerequisites

- `scoping_protocol.md`, the interactive tree that produces the identical lane-tuple shape this file's `authority`/`artifactClass`/`scope` triple maps onto 1:1.
- `discover_contract.md`, what `DISCOVER` does with a resolved lane's `scope` next.

---

## 2. TOP-LEVEL SHAPE

The file is a **bare JSON array** of lane objects, not wrapped in an envelope object:

```json
[
  { "authority": "sk-doc", "artifactClass": "docs", "scope": { "type": "paths", "values": ["docs/"] } },
  { "authority": "sk-git", "artifactClass": "git-history", "scope": { "type": "branchRange", "from": "main", "to": "HEAD" } }
]
```

No envelope, version field, or metadata wrapper is added at this level. ADR-011's own reasoning for a file (over an inline flag) is that the file itself is versionable, diffable, and reviewable *as a file*, properties git already gives any tracked JSON file, not that the content needs its own internal version counter. An empty array (`[]`) is valid and resolves to zero lanes. It is not an error (mirrors the "empty resolves, does not fail" pattern the rest of this phase uses for empty scopes, see `scoping_protocol.md` §7).

---

## 3. PER-LANE OBJECT SHAPE

Each array entry has three required keys, the same three ADR-011 names verbatim, plus an optional `adapter` discriminator:

| Key | Type | Constraint |
|---|---|---|
| `authority` | string | Must be one of the registered authorities (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES` keys: `sk-doc`, `sk-git`, `sk-design`, `sk-code` in v1, extensible per ADR-012) |
| `artifactClass` | string | Must be one of `docs`, `code`, `designs`, `git-history`, AND must be one the named `authority` actually supports (see §4) |
| `scope` | object | One of the three shapes in §5, validated against the repo root for `paths`/`globs` |
| `adapter` | string | **Optional.** One of the authority's registered adapter modules (`scripts/scoping.cjs`'s `AUTHORITY_ADAPTERS[authority]`). Defaults to the authority's own module. Lets a `designs` lane select `sk-design-live-render` instead of the static `sk-design` adapter. It is a discovery/check module selector, not part of the lane's identity (laneId is authority×artifactClass×scope). |

This is not a schema-only rule. It is the literal object `scripts/scoping.cjs`'s `validateLane()` returns on success, unchanged, so a config-file lane and an interactively-resolved lane are indistinguishable once resolved (zero information loss, per ADR-011's own constraint).

---

## 4. AUTHORITY -> ARTIFACT-CLASS VALIDITY

| Authority | Valid `artifactClass` values (v1) |
|---|---|
| `sk-doc` | `docs` |
| `sk-git` | `git-history` |
| `sk-design` | `designs` |
| `sk-code` | `code` |

A lane naming a real authority with an artifact-class that authority does not support fails validation with both values named in the error (for example, `sk-git` paired with `docs`). This table is the config-file's version of the same rule the interactive tree enforces by only offering valid authorities once ARTIFACT-CLASS is picked (`scoping_protocol.md` §2.2). The config file has no such filtering at authoring time, so `scripts/scoping.cjs` enforces it at parse time instead.

---

## 5. `scope` SHAPES

Exactly one of three, discriminated by `scope.type`:

```json
{ "type": "paths", "values": ["docs/", "README.md"] }
```
```json
{ "type": "globs", "values": ["src/**/*.ts", "!src/**/*.test.ts"] }
```
```json
{ "type": "branchRange", "from": "main", "to": "HEAD" }
```

`values` (for `paths`/`globs`) must be a non-empty array of non-empty strings. Each is validated against the repo root before the lane is accepted (NFR-S01): an absolute path outside the repo, or a value containing a `..` traversal segment, fails the whole lane-config, not just that one lane. `from`/`to` (for `branchRange`) must be non-empty strings. They are git refs, not filesystem paths, so they are not repo-root-validated the same way.

---

## 6. JSON SCHEMA (INFORMATIVE)

The following is a machine-checkable restatement of §3-§5, for tooling that wants a formal schema rather than the prose above. `scripts/scoping.cjs` does not load this file or any schema-validator library at runtime. It hand-validates against the same rules directly, matching this repo's existing convention (`runtime/scripts/upsert.cjs` validates its own JSON input the same hand-rolled way, with no `ajv`/`zod` dependency in this package).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "deep-alignment lane-config",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["authority", "artifactClass", "scope"],
    "additionalProperties": false,
    "properties": {
      "authority": { "type": "string", "enum": ["sk-doc", "sk-git", "sk-design", "sk-code"] },
      "artifactClass": { "type": "string", "enum": ["docs", "code", "designs", "git-history"] },
      "adapter": { "type": "string", "description": "Optional adapter-module discriminator; one of the authority's AUTHORITY_ADAPTERS entries (default: the authority's own module)." },
      "scope": {
        "oneOf": [
          {
            "type": "object",
            "required": ["type", "values"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "paths" },
              "values": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } }
            }
          },
          {
            "type": "object",
            "required": ["type", "values"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "globs" },
              "values": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } }
            }
          },
          {
            "type": "object",
            "required": ["type", "from", "to"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "branchRange" },
              "from": { "type": "string", "minLength": 1 },
              "to": { "type": "string", "minLength": 1 }
            }
          }
        ]
      }
    }
  }
}
```

The `authority` enum grows by one value whenever ADR-012's governance process registers a new authority. Nothing else in this schema, or in `scripts/scoping.cjs`, changes shape to accommodate it.

---

## 7. WORKED EXAMPLE, MULTI-AUTHORITY SINGLE RUN

The operator precedent from `002-architecture-decision` ("sk-code and sk-git and/or sk-design" in one pass) as a `--lane-config` file:

```json
[
  {
    "authority": "sk-code",
    "artifactClass": "code",
    "scope": { "type": "globs", "values": ["src/**/*.ts"] }
  },
  {
    "authority": "sk-git",
    "artifactClass": "git-history",
    "scope": { "type": "branchRange", "from": "main", "to": "HEAD" }
  },
  {
    "authority": "sk-design",
    "artifactClass": "designs",
    "scope": { "type": "paths", "values": ["DESIGN.md"] }
  }
]
```

`node scripts/scoping.cjs --lane-config path/to/this-file.json` resolves this to 3 lanes in one call, the same 3-lane result an equivalent 3-walk interactive session produces via `resolveLanesFromSelections()`.

---

## 8. ERROR CONTRACT

Every validation failure fails the whole file (fail-closed, per ADR-011's own risk mitigation and `spec.md`'s Error Scenarios), before `DISCOVER` starts:

| Failure | Message names |
|---|---|
| Unknown `authority` | The bad value and the full currently-registered set |
| `artifactClass` not valid for the named `authority` | Both values and the authority's actual supported class(es) |
| Malformed/missing `scope` | Which lane (`lanes[N]`) and which field |
| File missing, unreadable, or not valid JSON | The resolved path and the underlying I/O or parse error |

`scripts/scoping.cjs` exits `3` (input-validation, matching `runtime/scripts/upsert.cjs`'s own exit-code convention) on any of these. It never resolves a malformed file to a partial or best-effort lane set.

---

## 9. REFERENCES AND RELATED RESOURCES

- `scoping_protocol.md`, the interactive tree that produces the identical lane-tuple shape this file's `authority`/`artifactClass`/`scope` triple maps onto 1:1.
- `discover_contract.md`, what `DISCOVER` does with a resolved lane's `scope` next.
- `scripts/scoping.cjs`, `resolveLanesFromConfig()`, `parseLaneConfigFile()`, and `validateLane()`, the reference implementation of everything in this document.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-011 (this schema's lock), ADR-012 (authority registration governance).
     128 .opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md
---
title: "discover(scope) -> artifacts Contract"
description: "The authority-agnostic discover(scope) -> artifacts half of the pluggable adapter contract every deep-alignment authority adapter implements identically."
trigger_phrases:
  - "alignment discover contract"
  - "deep-alignment adapter discover"
  - "coverage graph seed FILE nodes"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# discover(scope) -> artifacts Contract

The authority-agnostic `discover(scope) -> artifacts` half of the pluggable adapter contract every deep-alignment authority adapter implements identically.

---

## 1. OVERVIEW

### Purpose

ADR-003 (`002-architecture-decision/decision-record.md`) locks a three-method adapter contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, and `check(artifact, rules) -> findings`. That split keeps the loop itself from ever branching on which authority it is running. This document specifies the **first** method only: its input shape, its output shape, and the authority-agnostic guarantee every adapter phase (005 sk-doc, 006 sk-git/sk-design, 007 sk-code, 010 sk-design live-render, and any future authority under ADR-012) must satisfy identically. `standardSource` and `check` belong to each adapter phase's own spec, not this one (`spec.md` §3 Out of Scope).

### When to Use

- Implementing a new authority adapter's `discover(scope)` method.
- Verifying an adapter's artifact and seed-node output shape before wiring it into `DISCOVER`.
- Auditing whether an adapter's signature stays authority-agnostic per ADR-003.
- Debugging coverage-graph seeding for a lane's discovered artifacts.

### Prerequisites

- `scoping_protocol.md`, how the `scope` this method receives gets resolved and validated before `DISCOVER` ever calls it.
- `lane_config_schema.md` §5, the field-level shape of the `scope` object.

---

## 2. SIGNATURE

```
discover(scope) -> artifacts
```

One parameter. No authority name, artifact-class, or lane identifier appears in the signature. The adapter calling it already knows its own authority and artifact-class by virtue of being that authority's own module (per the v1 registry in `scoping_protocol.md` §2.2, one authority maps to one artifact-class), so passing them again would be redundant. Passing them again would also give the loop a reason to branch on authority, which ADR-003 forbids.

---

## 3. INPUT: `scope`

Exactly the `scope` field of one resolved alignment lane (`scoping_protocol.md` §4), already validated against the repo root (NFR-S01) before `DISCOVER` calls this method, so an implementation may assume every `paths`/`globs` value is repo-relative and traversal-free. Three shapes, one per `scope.type`:

```json
{ "type": "paths", "values": ["docs/", "README.md"] }
{ "type": "globs", "values": ["src/**/*.ts"] }
{ "type": "branchRange", "from": "main", "to": "HEAD" }
```

Full field definitions: `lane_config_schema.md` §5.

---

## 4. OUTPUT: ARTIFACT CORPUS + SEED FILE NODES

`discover()` returns two things together: the artifact list itself, and the coverage-graph seed nodes that make the artifacts visible to `ITERATE`/`CONVERGE`.

```json
{
  "artifacts": [
    { "path": "docs/foo.md" }
  ],
  "nodes": [
    {
      "id": "file:docs/foo.md",
      "kind": "FILE",
      "name": "docs/foo.md",
      "metadata": { "authority": "sk-doc", "artifactClass": "docs" }
    }
  ]
}
```

### 4.1 `artifacts`

One entry per discovered artifact. For `paths`/`globs` scopes, an entry is `{ path }` (a repo-relative file path). For `branchRange` scopes, an entry is a path+ref pair, `{ path, ref }`, since the same file can exist differently at different points in the range. `plan.md` §3 states this explicitly ("file paths or path+ref pairs for git-history scopes"). The exact `path`/`ref` identity convention (which ref, how a rename across the range is represented) is each adapter's own design choice: phase 006 owns `sk-git`'s.

### 4.2 `nodes`

Seed nodes shaped for `runtime/scripts/upsert.cjs`'s `--nodes` input, one node per discovered artifact, `kind: "FILE"`. This is not a new node shape invented for this mode. It is the same `FILE` kind `deep-review` already seeds through the same script:

- `FILE` is a valid `NodeKind` for loop type `review` (`runtime/lib/coverage-graph/coverage-graph-db.ts:22`) **and** for loop type `context` (`runtime/lib/coverage-graph/coverage-graph-db.ts:34`), so a `FILE` seed node is valid regardless of which of those two `runtimeLoopType` values ADR-010's reuse-boundary work (phase 008) ultimately picks for `deep-alignment`.
- The node object itself is a `CoverageNode` (`runtime/lib/coverage-graph/coverage-graph-db.ts:79-93`): `id`, `kind`, `name` are required. `metadata` is free-form and is where an adapter should carry `authority`/`artifactClass` (and, for `branchRange` discoveries, the `ref`) so downstream findings can be traced back to their lane without a second lookup.
- `upsert.cjs` derives the rest at insert time: `kind = String(n.kind || n.nodeKind || n.type || '').toUpperCase()`, checked against `db.VALID_KINDS[loopType]` (`runtime/scripts/upsert.cjs:204-212`), and `name = n.name || n.label || n.id` (`runtime/scripts/upsert.cjs:214`). A discovered-artifact node only needs to supply `id`, `kind: "FILE"`, `name`, and `metadata`. `specFolder`, `sessionId`, and `loopType` are namespace context the CLI call supplies once for the whole batch, not per node.
- Seeding (as opposed to an ordinary iteration upsert) is what marks these `FILE` nodes as `DISCOVER`-origin rather than `ITERATE`-origin: pass `--seed-source` and `--seed-confidence` on the same `upsert.cjs` invocation (`runtime/scripts/upsert.cjs:103-129`'s `parseSeedOptions()`, both required together, `seedConfidence` a number in `[0, 1]`). A `DISCOVER`-state call seeding a lane's corpus looks like:

  ```
  node runtime/scripts/upsert.cjs \
    --spec-folder <bound-spec-folder> \
    --loop-type review \
    --session-id <session-id> \
    --seed-source deep-alignment-discover \
    --seed-confidence 1.0 \
    --nodes '[{"id":"file:docs/foo.md","kind":"FILE","name":"docs/foo.md","metadata":{"authority":"sk-doc","artifactClass":"docs"}}]'
  ```

  Zero edges is a valid call shape here: `upsert.cjs` only rejects an entirely empty `nodes`+`edges` payload when no seed options are supplied (`runtime/scripts/upsert.cjs:175-196`). A non-empty `--nodes` array with `--seed-source`/`--seed-confidence` set passes through normally.

---

## 5. EMPTY AND ZERO-MATCH SCOPE

Per `spec.md`'s edge cases, an empty scope (no paths/globs match anything on disk) is not an error. `discover()` returns `{ "artifacts": [], "nodes": [] }`, and the lane it belongs to is marked zero-coverage downstream rather than the run failing. A `SCOPE` value that resolved fine in the scoping step but happens to match zero files at discover-time is exactly the same case, not a distinct one.

---

## 6. AUTHORITY-AGNOSTIC EXTENSIBILITY GUARANTEE

No adapter phase may widen this signature to take a second parameter, and no engine-side caller may special-case a named authority when invoking it. This is the concrete meaning of ADR-003's "do NOT hard-wire only 4" constraint, made checkable: a diff of the planned signature against every adapter phase's stated usage (`plan.md` §4 Phase 3's own verification task for this phase) should show zero authority-specific parameters, in phase 005 through phase 010 alike. A fifth authority (`sk-prompt`, `system-spec-kit`, or any other) implements `discover(scope) -> artifacts` in exactly this shape, ships the short decision-record ADR-012 requires, and needs no change to this document, to `scripts/scoping.cjs`, or to the loop.

---

## 7. REFERENCES AND RELATED RESOURCES

- `scoping_protocol.md`, how the `scope` this method receives gets resolved and validated before `DISCOVER` ever calls it.
- `lane_config_schema.md`, the on-disk shape of a lane's `scope`, field by field.
- `runtime/scripts/upsert.cjs`, the coverage-graph seeding entrypoint every adapter's `nodes` output is written through.
- `runtime/lib/coverage-graph/coverage-graph-db.ts`, the `CoverageNode`/`NodeKind` types `upsert.cjs` validates against.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-003 (this contract), ADR-004 (authority sequencing), ADR-012 (new-authority governance).
     148 .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md
---
title: "State-Machine Wiring - INIT through REMEDIATE"
description: "The concrete state-to-script wiring for the deep-alignment loop: which script each state calls, the alignment/ state-file layout, the convergence-threshold formula, and the resolved loopType decision."
trigger_phrases:
  - "deep-alignment state machine wiring"
  - "alignment loop convergence thresholds"
  - "alignment state file layout"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# State-Machine Wiring - INIT through REMEDIATE

The concrete state-to-script wiring for the deep-alignment loop, from `INIT` through `REMEDIATE`.

---

## 1. OVERVIEW

### Purpose

Phase 008 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/`) wires the deep-alignment loop's seven states onto the reused deep-loop runtime plus two new single-shot scripts (`check-convergence.cjs`, `partition-corpus.cjs`) and one gated hook stub (`remediate-hook.cjs`). This document is the concrete "what calls what, in what order, with what state-file layout" reference every later phase (009's command YAML + LEAF agent) builds against, so the wiring does not need to be re-derived.

Every script named here is **single-shot**: it answers one question and returns, exactly like `runtime/scripts/{loop-lock,convergence,reduce-state,upsert}.cjs` already do. None of them loop or dispatch internally. `deep-alignment/SKILL.md`'s own "FORBIDDEN INVOCATION PATTERNS" section rules out "a custom bash/shell dispatcher to parallelize lanes or iterations." The external orchestrator that calls these once per iteration (a command YAML plus a LEAF agent, mirroring `deep_review_auto.yaml` + `deep-review.md`) is phase 009's own deliverable, not built here.

### When to Use

- Implementing phase 009's command YAML or LEAF agent against this wiring.
- Confirming which script owns a given state's reads and writes before adding a new one.
- Debugging an `alignment/` state-file inconsistency against the layout in §3.
- Deciding whether a change belongs in `check-convergence.cjs` or in `runtime/scripts/convergence.cjs` (see §5).

### Prerequisites

- `discover_contract.md`, `scoping_protocol.md`, `lane_config_schema.md`, the upstream contracts this wiring consumes.
- `runtime/scripts/{loop-lock,convergence,upsert}.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, the reused/sibling runtime primitives.

---

## 2. STATE-TO-SCRIPT MAP

| State | Script(s) invoked | Reads | Writes |
|---|---|---|---|
| `INIT` | `runtime/scripts/loop-lock.cjs acquire` | -- | `alignment/.deep-alignment.lock` |
| `SCOPE` | `deep-alignment/scripts/scoping.cjs` (`--lane-config` or `resolveLanesFromSelections`) | operator's lane answers or `--lane-config <file.json>` | `alignment/deep-alignment-config.json` (`lanes` field, frozen once written) |
| `DISCOVER` | each lane's adapter `discover(scope)` (`deep-alignment/scripts/adapters/<authority>.cjs`), then `runtime/scripts/upsert.cjs --seed-source deep-alignment-discover --seed-confidence 1.0` | `deep-alignment-config.json` lanes | `alignment/deep-alignment-corpus.json` (one entry per lane: `{laneId, authority, artifactClass, scope, artifacts}`), coverage-graph `FILE` nodes via `upsert.cjs` |
| `ITERATE` | `deep-alignment/scripts/partition-corpus.cjs` (which slice next), each lane's adapter `standardSource(authority)` + `check(artifact, rules)` | `deep-alignment-corpus.json`, `deep-alignment-findings-registry.json` (via the reducer, for already-checked counts) | `alignment/deep-alignment-state.jsonl` (append `{type:'iteration', laneId, artifactsChecked, newFindingsRatio, ...}`), `alignment/deltas/iter-NNN.jsonl` (append `{type:'finding', laneId, finding}`), `alignment/iterations/iteration-NNN.md` (narrative) |
| `CONVERGE` | `deep-alignment/scripts/check-convergence.cjs` | `deep-alignment-state.jsonl`, `deep-alignment-corpus.json`, the reducer's registry | none (decision only) |
| `REPORT` | `runtime/scripts/reduce-alignment-state.cjs <spec-folder>` | `deep-alignment-state.jsonl`, `deltas/`, `deep-alignment-config.json` | `alignment/deep-alignment-findings-registry.json`, `alignment/alignment-report.md` |
| `REMEDIATE` (optional, gated) | `deep-alignment/scripts/remediate-hook.cjs` | none | none (hook point only, no remediation logic exists yet, see §7) |

`INIT`'s lock is released (`loop-lock.cjs release`) after `REPORT`, or after `REMEDIATE` when that optional state runs.

---

## 3. THE `alignment/` STATE-FILE LAYOUT

Modeled directly on the real `review/` layout observed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/`:

```
<bound-spec-folder>/alignment/
├── deep-alignment-config.json          # SCOPE output, frozen (fileProtection: immutable)
├── deep-alignment-corpus.json          # DISCOVER output, one entry per lane (auto-generated)
├── deep-alignment-state.jsonl          # ITERATE append log (append-only)
├── deep-alignment-findings-registry.json  # REPORT output (auto-generated, reducer-owned)
├── alignment-report.md                 # REPORT output, one section per lane (auto-generated)
├── .deep-alignment.lock                # loop-lock.cjs lock file (operator-controlled)
├── iterations/
│   └── iteration-NNN.md                # per-iteration narrative (write-once)
├── deltas/
│   └── iter-NNN.jsonl                  # per-iteration finding deltas (write-once)
├── prompts/
│   └── iteration-N.md                  # per-iteration dispatch prompt (phase 009 populates)
└── dispatch-receipts/
    └── dispatch-alignment-iN-g1.{intent,completion}.json  # phase 009 populates
```

`deep-alignment-corpus.json` has no literal analog in `review/`'s layout. deep-review's four dimensions are a fixed constant, so it never needed a separate "what did DISCOVER find" file distinct from its (also fixed) config. deep-alignment's lanes are resolved per-run and their corpora are discovered per-run, so persisting the DISCOVER result as its own auto-generated file (rather than appending to the frozen config) keeps `deep-alignment-config.json`'s "immutable" `fileProtection` entry honest. See `deep_alignment_config_template.json` for the full config shape.

---

## 4. CONVERGENCE: THE RESOLVED FORMULA (REQ-004)

**Combination: AND, not OR.** Convergence requires **both**:

1. **Artifact-coverage**, the fraction of discovered artifacts checked at least once, across all applicable lanes (a lane with zero discovered artifacts is excluded from both sides of the ratio: vacuously covered, matching `reduce-alignment-state.cjs`'s own `NOT_APPLICABLE` treatment rather than inventing a second convention). Default threshold: 100% (`coverageThreshold: 1.0`).
2. **Dry-run stability**, the last N (default 2, `stabilityWindow`) iteration records, across all lanes in state-log append order, must all report `newFindingsRatio === 0`. Fewer than N iterations recorded yet fails closed to "not stable," so a fresh run can never converge on its first iteration by construction.

**Why AND, not OR**: full coverage with still-unstable findings is not a done run (something is still actively drifting), and stability with incomplete coverage is not a done run either (large parts of the corpus were never even looked at, a trivially "stable" zero-signal from untouched artifacts). Requiring both mirrors deep-review's own convergence philosophy of weighting coverage and stability as separate, simultaneously-necessary signals (`convergence.cjs`'s `computeCompositeScore` weights `dimensionCoverage` and `findingStability` as distinct additive terms, never alternatives).

**max-iterations is an independent hard stop**, applied regardless of the AND-pair's outcome: `iterationsRun >= maxIterations` forces `STOP_MAX_ITERATIONS` even when neither coverage nor stability has been met, exactly as a safety backstop against a lane that never stabilizes.

Implementation: `deep-alignment/scripts/check-convergence.cjs`. See §5 for why this is a self-contained script rather than a `runtime/scripts/convergence.cjs` code path.

---

## 5. THE loopType DECISION (REQ-001), RESOLVED

### The constraint

`runtime/scripts/convergence.cjs` (lines 659-660 as of this phase's read, re-verified current) hard-validates its loop type:

```js
if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context') {
  throw inputError('loopType must be "research", "review", "council", or "context"');
}
```

Two reuse options were on the table (plan.md §3 Architecture):

- **Option A, extend the enum**: add `'alignment'` as a fifth value, plus a new `computeCompositeScore` branch and a new lane-aware signals builder (analogous to `buildReviewSignals`).
- **Option B, reuse `'review'` unchanged**: pass `loopType: 'review'` with a distinct namespace so alignment's graph writes never collide with a real deep-review run on the same packet.

### What reading the real code changed

`computeCompositeScore`'s `'review'`-shaped branch (the one Option B would inherit unchanged) is driven by `buildReviewSignals(nodes, edges)`, which depends on graph conventions deep-alignment's adapters have no reason to produce: `DIMENSION`-kind nodes, `FINDING`-kind nodes with `metadata.severity`, and `COVERS`/`CONTRADICTS`/`EVIDENCE_FOR`/`RESOLVES` edges. `discover_contract.md` (this phase's own dependency) only specifies adapters seeding `FILE` nodes, nothing about a `DIMENSION`-per-lane graph convention. Reusing `'review'` **unchanged**, as Option B's plan.md framing described it ("zero runtime code change"), would silently produce `dimensionCoverage: 0` / `evidenceDensity: 0` / etc. for every real run (no `DIMENSION` or `FINDING` nodes ever get seeded): a composite score that looks like a permanent near-failure regardless of actual alignment quality. Making Option B produce a *meaningful* signal would require deep-alignment to fabricate a parallel `DIMENSION`-per-lane graph population scheme across every adapter's `ITERATE` call, real, non-trivial new work, just relocated from `convergence.cjs` into the adapters instead of avoided.

Separately, `loopType` is part of the coverage-graph's own namespace key (`{specFolder, loopType, sessionId}`, `convergence.cjs`'s `ns` object). Option B's own plan.md description already had to name a workaround ("bind a distinct `--spec-folder`/namespace so alignment's snapshots never collide with a real deep-review run on the same packet"), meaning reuse-unchanged is not actually collision-safe by construction. It requires an artificial disambiguation Option A gets for free, since `loopType` differing already partitions the namespace.

### The decision

**Option A (extend the enum to add `"alignment"`) is the architecturally correct long-term path.** It is namespace-safe by construction and does not require fabricating a misleading graph-population scheme. This is a recommendation for whichever future phase actually touches `runtime/scripts/convergence.cjs`, not an implementation performed here: `plan.md`'s own "Affected Surfaces" table marks `convergence.cjs` as **"Read-only analysis in this phase; a future phase either extends its enum or reuses it unchanged"**, and this phase's write scope does not include that file.

**What this phase actually built instead**: `spec.md`'s own NFR-R01 names the fallback explicitly, *"If `convergence.cjs` cannot be reused as-is (loopType rejected), the plan's fallback is graceful degradation to a documented manual coverage check, not a silent skip of convergence detection."* `deep-alignment/scripts/check-convergence.cjs` **is** that documented manual coverage check: it implements REQ-004's coverage-AND-stability-AND-max-iterations formula directly against the reducer's own registry and the JSONL state log, without touching `convergence.cjs` or depending on any graph-node convention. This gives phase 008 a real, tested, runnable convergence decision today, while leaving Option A's enum extension as a clearly-scoped, ready-to-apply follow-up (add `'alignment'` to the validation line, add a lane-aware signals branch) for whichever phase is authorized to edit that shared file.

**Do not silently reuse `'review'` unchanged.** If a future phase decides the graph-based composite score is worth the added population work after all, it should extend the enum (Option A) rather than reuse `'review'`, for the namespace-safety reason above.

---

## 6. CORPUS PARTITIONING (LANE ROUND-ROBIN)

Distinct from deep-review's fixed four-dimension rotation (four named categories, always the same four), deep-alignment's lanes are N-many, resolved per-run, with variable artifact counts. `partition-corpus.cjs` walks `deep-alignment-corpus.json`'s lanes in declaration order, wrapping, and returns the next lane with unaudited artifacts remaining (comparing the corpus's total against the reducer's per-lane `artifactsChecked` count), sliced to `batchSize` (default 5) artifacts per call. A lane whose corpus is zero-length or fully checked is skipped without ending the walk. `{done: true}` is returned only when every lane's corpus is exhausted.

---

## 7. THE `REMEDIATE` HOOK POINT (ADR-005 INVARIANT 4)

`remediate-hook.cjs` is the concrete, callable proof that the state transition after `REPORT` exists and is safe to enter. It performs **no** remediation action (no file writes, no git operations) and always returns `{status: 'not_implemented', ...}`, citing ADR-005 invariant 4 and `SKILL.md`'s "NEVER run the gated remediation pass without an explicit, separate operator opt-in" rule. A future phase that builds real remediation logic replaces this script's body. The wiring contract (REPORT can optionally transition to REMEDIATE) is already correct.

---

## 8. REFERENCES AND RELATED RESOURCES

- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-005 (alignment contract), ADR-006 (state machine + layout), ADR-010 (reduce-state.cjs relocation).
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/`, this phase's spec/plan, REQ-001 through REQ-006.
- `discover_contract.md`, `scoping_protocol.md`, `lane_config_schema.md`, the upstream contracts this wiring consumes.
- `runtime/scripts/{loop-lock,convergence,upsert}.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, the reused/sibling runtime primitives.
     288 .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md
---
title: sk-code Hybrid Adapter - standardSource, discover, check
description: The concrete standardSource("sk-code")/discover(scope)/check(artifact,rules,options) specification for the hardest of the four v1 authorities: a two-layer HYBRID check() (ADR-008 LOCKED) wrapping the real shared surface router plus verify_alignment_drift.py and the Webflow verification scripts for the deterministic layer, and a structured dispatch-packet builder (not a self-judging script) for the reasoning-agent layer.
trigger_phrases:
  - "sk-code alignment adapter"
  - "sk-code hybrid check"
  - "deep-alignment sk-code check"
  - "surface detection alignment adapter"
  - "reasoning agent dispatch packet sk-code"
importance_tier: important
contextType: implementation
version: 1.0.0.3
---

# sk-code Hybrid Adapter

The concrete `standardSource("sk-code")` / `discover(scope)` / `check(artifact, rules, options)` specification for the sk-code authority, the hardest of the four v1 `deep-alignment` authorities (ADR-004), built last so the adapter contract was already proven against sk-doc's fully-deterministic reference shape (phase 005) before this phase's honestly-partial HYBRID shape.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes the same three-method, authority-agnostic contract every adapter implements: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. This document specifies sk-code's implementation of all three, and `scripts/adapters/sk-code.cjs` is the real, executable code behind it, built to match `scripts/adapters/sk-doc.cjs`'s exact file shape (imports → constants → classifier → discover → suppression → standardSource → subprocess wrappers → check → CLI → exports) per this phase's own brief.

### ADR-008: HYBRID, Not a Deterministic Linter

ADR-008 (decision-record.md, ANCHOR `adr-008`) LOCKS this adapter's `check()` as a two-layer HYBRID: **deterministic surface-detection** (reusing sk-code's shared router, never reimplemented: REQ-001) **plus reasoning-based pattern-conformance** for everything the deterministic layer does not cover, every finding honestly labeled by producing `layer`. This document and `sk-code.cjs` implement that locked frame. They do not re-litigate whether to use it (spec.md's Open Questions §10 confirms this explicitly).

### What This Adapter Wraps (Not Reimplements)

Per REQ-001/REQ-002, four real, already-shipping sources, cited with exact line numbers so this specification stays checkable against the live files:

1. `.opencode/skills/sk-code/shared/references/stack_detection.md`: the surface-detection Detection Order (§2, lines 36-56) this adapter's `classifySurface()` ports directly.
2. `.opencode/skills/sk-code/shared/references/smart_routing.md`: the MOTION_DEV overlay's peer-category framing (§5) and the machine-readable `INTENT_SIGNALS`/`RESOURCE_MAP` this adapter's `standardSource()` points at.
3. `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real OPENCODE-surface deterministic pattern-drift checker. CLI usage at lines 110-123 (`--root` is `action='append'`, repeatable, directory-only, see Section 4.1's live-reality note). `SUPPORTED_EXTENSIONS` at lines 39-51 lists **7 languages**: TypeScript, JavaScript, Python, Shell, **Rust**, JSON and JSONC, one more than spec.md REQ-002's own acceptance-criteria prose names, "TS/JS/Python/Shell/JSON/JSONC". This was confirmed by reading the live docstring, lines 11-18, and `check_rust()`, lines 357-393, in full. It is a real spec-vs-tool discrepancy recorded here rather than silently resolved either direction. No `--json` flag exists (text stdout only, parsed by regex, Section 4.1).
4. `.opencode/skills/sk-code/code-webflow/assets/scripts/{verify-minification.mjs,test-minified-runtime.mjs}`: the real, read-only WEBFLOW-surface verification scripts (Section 4.2's live-reality findings explain why `minify-webflow.mjs`, the third script in this directory, is explicitly excluded).

Explicitly **not wrapped**: any new deterministic linter beyond what already exists (spec.md Out of Scope: "Building new deterministic linters beyond what already exists... out of scope; this phase reuses, not extends, the deterministic layer").

---

## 2. STANDARDSOURCE("SK-CODE")

`standardSource('sk-code')` returns a single object naming every real source Section 1 lists, the excluded script and the parsed known-deviation list. This is the **live output** of `node scripts/adapters/sk-code.cjs standard-source` (2026-07-11, paths shown resolved for this checkout):

```json
{
  "authority": "sk-code",
  "surfaceRouter": {
    "smartRouting": "<repo>/.opencode/skills/sk-code/shared/references/smart_routing.md",
    "stackDetection": "<repo>/.opencode/skills/sk-code/shared/references/stack_detection.md"
  },
  "validators": {
    "opencodeDrift": {
      "tool": "verify_alignment_drift.py",
      "path": "<repo>/.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py",
      "coversSurface": "OPENCODE",
      "layer": "deterministic",
      "coveredExtensions": [".ts", ".tsx", ".mts", ".js", ".mjs", ".cjs", ".py", ".sh", ".rs", ".json", ".jsonc"]
    },
    "webflowMinificationVerify": {
      "tool": "verify-minification.mjs",
      "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs",
      "coversSurface": "WEBFLOW", "layer": "deterministic", "requiresProjectRoot": true
    },
    "webflowRuntimeTest": {
      "tool": "test-minified-runtime.mjs",
      "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs",
      "coversSurface": "WEBFLOW", "layer": "deterministic", "requiresProjectRoot": true
    }
  },
  "excludedFromCheck": [{
    "tool": "minify-webflow.mjs",
    "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs",
    "reason": "Writes src/2_javascript/z_minified/*.min.js and manifest.tsv -- mutates the reviewed tree, violating ADR-005/NFR-S01 read-only-by-default. plan.md named it as part of the deterministic chain; this adapter excludes it from check() (Section 4.1.2)."
  }],
  "references": {
    "opencode": "<repo>/.opencode/skills/sk-code/code-opencode/references",
    "webflow": "<repo>/.opencode/skills/sk-code/code-webflow/references",
    "motionOverlay": "<repo>/.opencode/skills/sk-code/code-webflow/references/animation"
  },
  "knownDeviations": [ /* 6 entries, parsed from sk_code_known_deviations.md Section 9 */ ]
}
```

Calling `standardSource()` with any authority other than `'sk-code'` throws. This file is the sk-code-specific implementation, not a cross-authority dispatcher (that dispatch belongs to phase 008's engine).

---

## 3. DISCOVER(SCOPE) FOR SK-CODE

### Behavior

Given a `scope` object (the real, live shape from `../discover_contract.md` §3: `{type:'paths'|'globs', values}` or `{type:'branchRange', from, to}`), `discover()`:

1. For `type:'paths'`/`type:'globs'`: resolves and walks each value against the repo root exactly as `sk-doc.cjs` does (same `isInsideRepoRoot`/`globToRegExp`/`globWalkRoot` utilities, duplicated per-adapter rather than shared. ADR-003's own Consequences section names this exact duplication as accepted until a shared helper is worth extracting).
2. Every walk skips `verify_alignment_drift.py`'s own `EXCLUDED_DIRS` (verify_alignment_drift.py:53-63: `.git`, `node_modules`, `dist`, `build`, `coverage`, `__pycache__`, `.next`, `.venv`, `venv`), reused verbatim per REQ-001, not reimplemented.
3. Collects every file matching `CODE_EXTENSIONS`: `verify_alignment_drift.py`'s own `SUPPORTED_EXTENSIONS` (11 extensions, 7 languages) **union** `.css`/`.html`, added because `stack_detection.md:28` names WEBFLOW as owning "Webflow / vanilla HTML, CSS, JavaScript" and `verify_alignment_drift.py` itself checks neither CSS nor HTML at all (confirmed: absent from its `SUPPORTED_EXTENSIONS` and from every `check_*` function). Only the narrower, OPENCODE-checkable subset gets real layer-1 coverage. CSS/HTML artifacts get a `deterministic-layer-not-applicable` finding (Section 4.1) and fall through to layer 2 only.
4. For each collected file, reads its content and calls `classifySurface(relPath, content)` (Section 3.1) and `detectMotionDevOverlay(content)` (Section 3.2), then returns `{ artifacts: [{path}, ...], nodes: [{id, kind:'FILE', name, metadata}, ...] }`, the real `discover_contract.md` §4 output shape exactly, `surface`/`detectedFrom`/`motionDevOverlay` carried in each node's `metadata`.
5. `branchRange`: returns `{artifacts:[], nodes:[]}`. sk-code's only registered artifact-class is `code` (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES`), so a valid lane should never hand this adapter a `branchRange` scope. This mirrors `sk-doc.cjs`'s identical branch and rationale.

**Content-reading difference from sk-doc.cjs**: sk-doc's classifier is purely path-based (document type never depends on file content). sk-code's cannot be: `stack_detection.md` §2's own WEBFLOW detection order includes a content-grep fallback (animation-library globals, `Webflow.push`) a path-only classifier cannot reproduce faithfully, so `discover()` reads every candidate file's content (real, justified extra I/O, not gratuitous complexity).

### 3.1 Surface Classification (`classifySurface`)

Ported from `stack_detection.md` §2's real Detection Order, not reimplemented (REQ-001):

| Order | Rule | Source |
|---|---|---|
| 1 | Path is `.opencode/` or starts with `.opencode/` → **OPENCODE** | stack_detection.md:38,42,56, highest precedence |
| 2 | Path contains `/src/2_javascript/` or starts with `src/2_javascript/` → **WEBFLOW** | stack_detection.md:45 |
| 2 | Path ends `.webflow.js` → **WEBFLOW** | stack_detection.md:46 |
| 2 | Path is or ends `/wrangler.toml` → **WEBFLOW** | stack_detection.md:50 |
| 2 | Content matches `Webflow\.push\|--vw-\|window\.Motion\|window\.gsap\|gsap\.(to\|from\|set\|timeline\|registerPlugin)\|new Lenis\|new Hls\|new Swiper\|FilePond` → **WEBFLOW** | stack_detection.md:48-49, ported verbatim |
| 3 | None of the above → **UNKNOWN** | stack_detection.md:52-53 |

Rule 1 is checked first and short-circuits, exactly matching stack_detection.md's own documented precedent, including a consequence that precedent's own prose predicts and this adapter's live dry-run confirmed (Section 8).

### 3.2 MOTION_DEV Overlay Detection

`smart_routing.md` §5: "Motion.dev resources are a **peer category**... not a third surface." `detectMotionDevOverlay()` is therefore never a `surface` value: it is a boolean `metadata.motionDevOverlay` flag, tested against a Motion.dev-specific subset of the same marker family (`window\.Motion\b|Motion\.animate|\banimate\(|\binView\(|\bstagger\(|\bscroll\(\s*\{`), translated from `smart_routing.md`'s machine-readable `MOTION_DEV` `INTENT_SIGNALS` keyword list (`"animate()"`, `"inview"`, `"scroll()"`, `"stagger()"`) into a content regex, since `discover()` has file content available, not prompt text. Section 8 documents a real, honest limitation of this lightweight approach.

---

## 4. CHECK(ARTIFACT, RULES, OPTIONS)

`check()` runs two layers per artifact (deterministic, then reasoning-agent) and returns a flat findings array after known-deviation suppression, matching `sk-doc.cjs`'s exact shape. Per REQ-005, every call re-runs both layers fresh. Nothing is cached from `discover()` time or a prior `check()` call.

### 4.1 Layer 1 - Deterministic

Dispatches on the artifact's `surface` (from `classifySurface()`, re-derived if the caller passed a bare path):

#### 4.1.1 OPENCODE surface - `verify_alignment_drift.py`

1. If the artifact's extension is not in `verify_alignment_drift.py`'s own `SUPPORTED_EXTENSIONS` (for example a `.css`/`.html` file that classified OPENCODE by path), emit a single `P2` `deterministic-layer-not-applicable` finding. This tool structurally cannot check that extension, distinct from "ran and found nothing."
2. Otherwise, `spawnSync('python3', [verify_alignment_drift.py, '--root', dirname(absPath)], { cwd: REPO_ROOT })`, **for real**, same subprocess pattern `sk-doc.cjs` uses for `validate_document.py`. `--root` must be a **directory**: `verify_alignment_drift.py`'s own `iter_code_files()` walks via `os.walk(abs_root)`, which silently yields zero files for a file-shaped root (confirmed by reading the function). Passing the artifact's own path directly would silently under-scan, so this adapter always passes the artifact's *containing directory*.
3. No `--json` flag exists (confirmed by reading the full `argparse` block, lines 110-123). Stdout is text, parsed by a regex matching the tool's own fixed print format (verify_alignment_drift.py:534-537): `- {relpath}:{line} [{rule_id}] [{severity}] {message} Fix: {fix_hint}`. `cwd: REPO_ROOT` makes the tool's own `relpath()` (verify_alignment_drift.py:500-504, relative to `os.getcwd()`) print repo-relative paths matching this adapter's `artifact.path` convention.
4. The tool's own findings (for the whole scanned directory) are filtered down to just the lines matching this one artifact's repo-relative path.
5. Severity mapping (Section 7) translates the tool's own `ERROR`/`WARN` into `P0`/`P1`.
6. Subprocess failure (`python3` missing, etc.) becomes a `P1` `adapter-error` finding, distinct from an artifact-level conformance finding, the same discipline as `sk-doc.cjs`'s subprocess wrappers.

#### 4.1.2 WEBFLOW surface - the minification/verification scripts, honestly bounded

Building this adapter surfaced three real, load-bearing facts that reshape what "invoke the Webflow script chain" can honestly mean here, each verified live rather than assumed from plan.md's prose (Section 8 has full transcripts):

- **`minify-webflow.mjs` mutates the tree**. It shells out while doing it. `minify_file()` (lines 89-124) writes each `src/2_javascript/z_minified/*.min.js` output not via a direct file write but by shelling out to `execSync('npx terser "<source>" --compress --mangle -o "<output_path>"')` (line 104), a subprocess that can itself trigger an `npx` package fetch, a materially larger side effect than a plain file write. `save_manifest()` (line 146) separately writes `manifest.tsv` via `writeFileSync` (line 157). ADR-005/NFR-S01 require `check()` to be read-only by default. plan.md's Architecture section named this script as part of the deterministic chain to invoke. This adapter **excludes it from `check()` entirely** (recorded in `standardSource()`'s `excludedFromCheck`), a real, documented deviation from the plan's literal text, made because building the adapter surfaced a constraint (and a bigger one than initially assumed) the plan's prose had not accounted for, not silently reconciled.
- **`verify-minification.mjs` and `test-minified-runtime.mjs` take no path argument.** Both hardcode `SOURCE_DIR = 'src/2_javascript'` / `OUTPUT_DIR = 'src/2_javascript/z_minified'` **relative to `process.cwd()`** (confirmed by reading both scripts in full). Unlike `verify_alignment_drift.py --root <path>`, there is no way to point either script at an arbitrary artifact. They must run with `cwd` set to the actual Webflow project root. `findWebflowProjectRoot()` walks upward from the artifact's directory (bounded at `REPO_ROOT`) looking for a `src/2_javascript` subdirectory.
- **No such project root exists anywhere in this monorepo.** `find <repo-root> -type d -name "2_javascript"` and a repo-wide `wrangler.toml` search both returned **zero matches** (live, 2026-07-11, Section 8). This is not merely "WEBFLOW's deterministic layer is thinner," as the plan's Risk register anticipated: for any WEBFLOW-surface artifact currently discoverable inside this monorepo's own scope, the deterministic layer is **presently unavailable**, not thin. The scripts are written for a *consumer* repo (a live Webflow-project checkout with `src/2_javascript/` at its root) this monorepo does not itself contain.

Given a project root **is** found (a future consumer-repo lane, not this repo's own tree today):

1. If the artifact sits under `<projectRoot>/src/2_javascript/` (a source file), run `verify-minification.mjs` with `cwd: projectRoot`, parse its per-file text block (Section 4.1.3) and look up this artifact's own entry.
2. If the artifact sits under `<projectRoot>/src/2_javascript/z_minified/` (an output file), run `test-minified-runtime.mjs` with `cwd: projectRoot` the same way.
3. A `FAIL` status from either script becomes a `P0` finding: both scripts' own summaries declare a hard block on `FAIL` ("⚠️ VERIFICATION FAILED - Do not deploy!" / "⚠️ RUNTIME TESTS FAILED - Do not deploy!"), the same "drives the wrapped tool's own hard block" logic behind the OPENCODE layer's `ERROR`→`P0` mapping (Section 7).
4. `SKIP` (no counterpart file yet) or `PASS`, or no entry at all for this artifact in the tool's own output, produces no finding.

Given **no** project root is found (the default case in this repo today), or the artifact is WEBFLOW-surface but outside `src/2_javascript/` entirely (e.g. CSS/HTML): a single `P1` `deterministic-layer-unavailable` finding, per NFR-R01's own required language: "the adapter falls back to reasoning-agent-only judgment for that artifact and marks the deterministic layer as `unavailable` rather than silently treating it as clean."

#### 4.1.3 Text-Output Parsing (both Webflow scripts)

Neither script has a `--json` flag (confirmed by reading both in full). Both print a fixed per-file block shape: a bare relative-path line, then indented `  ✓ ...` / `  ✗ ...` / `  ⊘ SKIP: ...` lines, then `  RESULT: PASS|FAIL`. `parseFileBlockOutput()` (shared by both, since the block grammar is identical) parses this directly, the same "translate the wrapped tool's own real text output" discipline `sk-code.cjs`'s `verify_alignment_drift.py` parser follows.

#### 4.1.4 Surface `UNKNOWN`

Per spec.md's Data Boundaries edge case, a `P1` `surface-undetected` finding: never a silent skip, never a guessed surface.

### 4.2 Layer 2 - Reasoning-Agent (Structurally Cannot Self-Judge)

Extracting "does this code follow the surface's architectural patterns" from an artifact and judging it against `code-webflow/references/implementation/*` or `code-opencode/references/shared/universal_patterns.md` is a reasoning act: no deterministic script can invent that judgment, and having `sk-code.cjs` try to perform it internally would be **a category error** (plan.md's own framing, ADR-008). This adapter's answer, matching the task's explicit design requirement, is two separate pieces:

1. **`buildReasoningLayerDispatch(artifact, rules)`**, exported, independently callable (`node sk-code.cjs reasoning-dispatch <path>`), builds the well-formed input package a reasoning agent needs: the artifact path, its detected `surface` and `motionDevOverlay` flag, the exact `standardSource()` reference paths to read for that surface (plus the Motion overlay directory when the flag is set), the four conformance dimensions layer 1 cannot check (`naming-conventions-beyond-regex`, `architectural-pattern-conformance`, `cross-file-consistency`, `comment-hygiene-beyond-simple-patterns`, named directly from plan.md's Architecture section) and the exact `expectedFindingShape` the caller must produce. **This function never judges anything itself.** It is documentation-as-code for a follow-on step, not a hidden judgment engine.
2. **`checkPatternConformance(artifact, options)`**: the actual layer-2 sub-check inside `check()`. Mirrors `sk-doc.cjs`'s `checkRealityAlignment()` exactly: accepts `options.verifiedFindings`, an array of already-judged `{dimension, claim, matchesStandard, evidence, severity}` records the caller (a future phase-008 ITERATE-state reasoning-agent dispatch step) produced by actually reading the artifact and the cited references. A finding is emitted **only** for entries where `matchesStandard === false` **and** `evidence` is present. No `verifiedFindings` supplied → no findings, never an invented one, the identical "no verifiedClaims → no findings" invariant `sk-doc_adapter.md` §4.2 documents for its own reality-alignment sub-check.

REQ-005's VERIFY-FIRST re-probe requirement is satisfied structurally: `verifiedFindings` are supplied at `check()`-call time (never at `discover()`-time or cached from a prior pass), so a caller that re-reads the live file immediately before calling `check()` automatically satisfies "re-checked against the current file content, not a cached discover-time snapshot."

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005, HARD REQUIREMENT)

No reasoning-layer finding is ever asserted without a cited `evidence` field (`checkPatternConformance()` drops any `verifiedFindings` entry missing one). No deterministic-layer finding is ever asserted without an actual, fresh subprocess run against the live artifact in the same `check()` call (REQ-005). It is never reused from `discover()` time or a prior iteration. This mirrors `sk_doc_adapter.md` §5's identical discipline, applied to a hybrid rather than fully-deterministic adapter.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005)

Every finding `check()` produces passes through `suppressKnownDeviations()` before being returned. The full seeded list, its structured evidence, and the machine-readable rule block `sk-code.cjs` actually parses live in [sk_code_known_deviations.md](./sk_code_known_deviations.md), not duplicated here. Unlike sk-doc's list, every current entry has `matchTypes: []`: the four `verify_alignment_drift.py`-native exemptions (context-advisory downgrade, test-heavy downgrade, TS pattern-asset skip, the one malformed-JSON fixture) are already reflected in that tool's own output before this adapter ever sees it, and the two adapter-specific entries (OPENCODE-precedence classification of Webflow-named tooling, Motion.dev peer-library references) are classification-outcome/reasoning-layer guidance, not finding-type suppressions. A suppression, when one is ever added, would only silence the matched deviation category on the matched artifact, never blanket-exempt the whole artifact from every other check (spec.md's Data Boundaries edge case).

---

## 7. SEVERITY MAPPING

| Source | Condition | Severity | `layer` |
|---|---|---|---|
| `verify_alignment_drift.py` | finding `severity === 'ERROR'` (drives the tool's own default exit-1 gate) | P0 | deterministic |
| `verify_alignment_drift.py` | finding `severity === 'WARN'` (present regardless of exit code, non-blocking by default) | P1 | deterministic |
| `verify_alignment_drift.py` | extension outside `SUPPORTED_EXTENSIONS` | P2 (`deterministic-layer-not-applicable`) | deterministic |
| `verify-minification.mjs` / `test-minified-runtime.mjs` | `FAIL` (drives the script's own "Do not deploy!" hard block) | P0 | deterministic |
| WEBFLOW surface, no project root or outside `src/2_javascript/` | n/a | P1 (`deterministic-layer-unavailable`) | deterministic |
| surface classification | `UNKNOWN` | P1 (`surface-undetected`) | deterministic |
| either subprocess | adapter-level failure (not an artifact defect) | P1 (`adapter-error`) | deterministic |
| reasoning-agent | caller-verified contradiction (`matchesStandard === false`, `evidence` present) | caller-supplied (default P2) | reasoning-agent |

The `ERROR`→P0 / `WARN`→P1 split mirrors `sk-doc.cjs`'s own `blocking_errors`→P0 / `warnings`→P1 structural analogy exactly: in both tools, the P0-mapped category is what independently drives *that tool's own* default exit/hard-fail behavior, and the P1-mapped category is present regardless of exit status. This is a faithful port of an existing pattern, not an invented third scale.

---

## 8. LIVE-REALITY FINDINGS (VERIFIED, NOT ASSUMED)

Building and dry-running this adapter against real repo files surfaced five genuine, load-bearing facts, exactly the class of grounded discovery `deep-alignment` exists to produce, found here by construction rather than invented for illustration. All commands below were run from the repo root on 2026-07-11.

### 8.1 The WEBFLOW deterministic layer has zero live project roots in this monorepo

```
$ find <repo-root> -type d -name "2_javascript" -not -path "*/node_modules/*"
(no output)
$ find <repo-root> -maxdepth 4 -iname "wrangler.toml" -not -path "*/node_modules/*"
(no output)
```

Confirms Section 4.1.2's claim directly: for any WEBFLOW-surface artifact this adapter can discover inside this repo's own scope, `checkWebflowDeterministic()` will report `deterministic-layer-unavailable`, not run a check. The script chain targets a consumer repo this monorepo does not itself contain.

### 8.2 sk-code's own Webflow-named tooling classifies OPENCODE, not WEBFLOW

```
$ node scripts/adapters/sk-code.cjs discover .opencode/skills/sk-code/code-webflow/assets/scripts
```
returned all three files (`minify-webflow.mjs`, `test-minified-runtime.mjs`, `verify-minification.mjs`) as `"surface": "OPENCODE"`, `"detectedFrom": "path"`, because they live under `.opencode/`, and `stack_detection.md`'s own Detection Order gives OPENCODE strict precedence, with a documented rationale (line 56) that names this exact scenario ("`.opencode/` system tools... may import vanilla animation libraries internally without being WEBFLOW-shipping artifacts"). Recorded as `sk_code_known_deviations.md` Section 6 so a reasoning-agent reviewer does not mistake this for a bug.

### 8.3 `minify-webflow.mjs` writes files (via a subprocess, not even a plain write); excluded from `check()`

Confirmed by reading the script: `minify_file()` (line 104) writes each `.min.js` output by shelling out to `execSync('npx terser ... -o <output_path>')`, and `save_manifest()` (line 157) calls `writeFileSync(MANIFEST_FILE, ...)`. Section 4.1.2 documents the exclusion. `standardSource()`'s `excludedFromCheck` records it machine-readably.

### 8.4 The deterministic OPENCODE layer is real, reproducible, and currently clean across this repo

Six live `verify_alignment_drift.py` dry-runs, increasing in corpus size, all returned `[alignment-drift] PASS` with zero findings:

| Root scanned | Files scanned | Findings |
|---|---|---|
| `deep-alignment/scripts` | 2 | 0 |
| `sk-code/code-opencode/assets/scripts` | 3 | 0 |
| `deep-review/scripts` | 7 | 0 |
| `runtime/scripts` | 14 | 0 |
| `sk-code` (whole skill) | 62 | 0 |
| `system-deep-loop` (whole hub) | 447 | 0 |

This is real, reproducible, deterministic behavior, not fabricated evidence of a violation. It is also informative on its own: either this repo's OPENCODE surface is already well-aligned to the tool's 12 mechanical rule types, or (more likely, per Section 9's estimate) those 12 rules check a narrow enough slice of "conformance" that a clean run here says little about the much larger reasoning-layer surface.

### 8.5 The MOTION_DEV content-marker regex has a real, reproducible false-positive mode

```
$ node scripts/adapters/sk-code.cjs check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs
```
(via `discover()`'s metadata, and independently via a direct regex test against this adapter's own source) reports `"motionDevOverlay": true`: not because the file calls a Motion.dev API, but because line 134 of its own source is a docstring quoting `smart_routing.md`'s keyword list: `// smart_routing.md's machine-readable MOTION_DEV keyword list ("animate()", ...)`. The literal text `animate(` matches `MOTION_DEV_CONTENT_MARKER_RE` regardless of context. This is a real, accepted limitation of a lightweight regex-based overlay signal. It detects *mentioning* the pattern, not *using* it. This is recorded in `sk_code_known_deviations.md` Section 7 rather than silently smoothed over or hidden by excluding the adapter's own source from the demonstration.

---

## 9. AUTOMATABILITY-LIMITS STATEMENT (REQ-002, HONEST - THE WHOLE POINT OF ADR-008)

**Deterministic today (layer 1):**
- **Surface classification** (`classifySurface()`): fully deterministic, a direct port of `stack_detection.md` §2's real Detection Order. Confirmed accurate against real repo files (Section 8.2), including a correct-but-surprising precedence outcome.
- **OPENCODE pattern-drift**: real and reproducible via `verify_alignment_drift.py`. Its coverage is **12 mechanical rule types** across 7 languages: shebang-line presence, a `'use strict'` pragma, a docstring marker, a `MODULE:` header marker, `set -euo pipefail`, JSON/JSONC parseability, CRLF/UTF-8 hygiene and two Rust boundary-safety greps. Every one of these is a **syntax-shape or boilerplate-presence** check: none of them reads for architectural correctness, the right abstraction, or whether an implementation actually follows `code-opencode/references/shared/universal_patterns.md` or any per-language `style_guide.md`/`quality_standards.md`'s actual prose guidance. Six-plus full reference documents per language describe what "OPENCODE conformance" really means in this hub's own routing (`smart_routing.md` §6). The 12 mechanical rules check a narrow, real, but genuinely small slice of that.
- **WEBFLOW pattern-drift**: real and reproducible **only when a Webflow project root exists in scope**. Presently zero such roots exist anywhere in this monorepo (Section 8.1), so this layer is not merely "thinner" than OPENCODE's (as the plan's Risk register anticipated) but **currently unavailable** for every WEBFLOW-surface artifact this adapter can discover here. It remains real, working code for a consumer repo that does carry a live `src/2_javascript/` tree.

**Reasoning-agent, not automated today (layer 2):**
- All four named dimensions (naming conventions beyond simple regex, architectural/pattern conformance, cross-file consistency, comment hygiene beyond simple patterns) are 100% reasoning-agent judgment. `sk-code.cjs` does not perform this judgment. It prepares the dispatch packet (`buildReasoningLayerDispatch()`) and accepts pre-verified results back (`checkPatternConformance()`'s `options.verifiedFindings`). This is the majority of what "does this code follow the surface's stack patterns" actually asks. The mechanical layer answers a real but narrow "is the boilerplate present and does it parse" question. The reasoning layer answers the "is this the right pattern" question, and today, only a human or LLM reasoning agent can answer that.

**Honest fraction**: of the full conformance question, the deterministic layer's real, working coverage is a **minority slice restricted to mechanical hygiene** (12 OPENCODE rule types, WEBFLOW's real scripts gated on a project-root precondition presently unmet in this repo). The reasoning-agent layer covers everything else: the substantive "architectural/pattern conformance" the surface's own reference material (`code-webflow/references/implementation/*`, `code-opencode/references/shared/*`) actually prescribes. This is not a hedge. It is the concrete answer ADR-008 asked this phase to produce, and it is why every finding is layer-tagged rather than presented as one undifferentiated "conformance check."

---

## 10. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-code.cjs` implements every function this document specifies: `discover(scope)`, `standardSource(authority)`, `check(artifact, rules, options)`, plus `classifySurface`, `detectMotionDevOverlay`, the three subprocess wrappers, `buildReasoningLayerDispatch` and the suppression matcher. It exposes a CLI (`discover`, `check`, `standard-source`, `reasoning-dispatch` subcommands) for a manual dry-run without any engine wiring. Every command and output shown in Section 8 above is real, reproducible output from that CLI. `node --check scripts/adapters/sk-code.cjs` passes.

---

## 11. REFERENCES AND RELATED RESOURCES

- [sk_code_known_deviations.md](./sk_code_known_deviations.md): the structured, evidence-cited suppression list.
- [sk-code.cjs](../../scripts/adapters/sk-code.cjs): the executable reference implementation.
- [sk_doc_adapter.md](./sk_doc_adapter.md), [sk-doc.cjs](../../scripts/adapters/sk-doc.cjs): the reference adapter (phase 005) this file's shape and this script's structure both copy.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-004`, `adr-005`, `adr-008`): the contract, sequencing rationale, alignment invariants and the HYBRID lock this adapter implements.
- `../discover_contract.md`, `../lane_config_schema.md`: the real, live `discover(scope)->artifacts` contract this adapter's `discover()` conforms to.
- `.opencode/skills/sk-code/shared/references/stack_detection.md`, `smart_routing.md`: the shared surface router this adapter reuses (REQ-001), never reimplements.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real OPENCODE deterministic checker.
- `.opencode/skills/sk-code/code-webflow/assets/scripts/{verify-minification.mjs,test-minified-runtime.mjs,minify-webflow.mjs}`: the real WEBFLOW scripts (the third excluded from `check()`, Section 4.1.2).
     246 .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_known_deviations.md
---
title: sk-code Known-Deviation Suppression List
description: The seeded sk-code known-deviation list for deep-alignment's ADR-005 suppression invariant, seeded from verify_alignment_drift.py's own live skip-path/severity-downgrade functions plus two adapter-specific conventions found while building this adapter, not invented.
trigger_phrases:
  - "sk-code known deviations"
  - "known deviation suppression list sk-code"
  - "alignment suppression list sk-code"
  - "context advisory path test heavy path motion dev overlay"
importance_tier: important
contextType: reference
version: 1.0.0.2
---

# sk-code Known-Deviation Suppression List

The sk-code authority's known-deviation list for deep-alignment's ADR-005 suppression invariant: intentional repo conventions the mode must never flag as drift.

---

## 1. OVERVIEW

### Purpose

ADR-005 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-005`) requires every authority adapter's `standardSource` to carry a known-deviation list so a real repo-wide convention is never flagged as drift. Every entry below traces to real, already-live code: `verify_alignment_drift.py`'s own exemption functions, or a real classification outcome this adapter's own build surfaced by construction. It is not a hypothetical.

### Source of Truth

This document is the single source of truth for sk-code's suppression rules. The fenced `json` block in Section 8 is parsed directly by `scripts/adapters/sk-code.cjs`'s `loadKnownDeviations()` at runtime. There is no separate, hand-synced copy of this list in code. Editing a deviation means editing it here, once.

### Why Every Entry Below Is `matchTypes: []`

Unlike sk-doc's known-deviation list (which suppresses findings `validate_document.py`/`extract_structure.py` emit), every entry here is **native to the wrapped tool or the router itself**: `verify_alignment_drift.py` already downgrades severity or skips the check entirely for the four path categories in Sections 2-5 *before* it ever prints a finding, and the surface-precedence outcome in Section 6 is the router's own documented, correct behavior, not an adapter-level override. `sk-code.cjs`'s `suppressKnownDeviations()` therefore has nothing to actively filter for any entry here today: every `matchTypes` is `[]`. This list exists so a **reasoning-agent-layer-2** reviewer (which does not read `verify_alignment_drift.py`'s source before judging) does not independently re-flag a path or classification outcome the deterministic layer, or the router itself, already treats correctly. This mirrors `sk_doc_known_deviations.md`'s own "dormant" entries (Sections 4-5 there), which exist for the identical reason.

---

## 2. CONTEXT-ADVISORY PATH SEVERITY DOWNGRADE

**Deviation name**: Context-advisory path severity downgrade

**Why it is not a violation**: `verify_alignment_drift.py`'s `classify_severity()` (verify_alignment_drift.py:253-257) downgrades every rule's severity to `WARN`, never `ERROR`, for any path containing a `z_archive`, `scratch`, `memory`, `research`, `context`, `assets`, `examples` or `fixtures` path segment (`is_context_advisory_path()`, verify_alignment_drift.py:225-228, checking `CONTEXT_ADVISORY_SEGMENTS`, lines 75-84). plan.md's Architecture section names this exact function as one of two candidate seeds for this list ("`is_context_advisory_path`, `is_test_heavy_path`").

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:75-84`: `CONTEXT_ADVISORY_SEGMENTS` definition.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:225-228`: `is_context_advisory_path()`.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:253-257`: `classify_severity()`, the downgrade call site.
- `007-adapter-sk-code/plan.md` Architecture section names `is_context_advisory_path` as a seed candidate.

**Match rule**: none currently (`matchTypes: []`). See Section 1: `verify_alignment_drift.py`'s own output already reflects this downgrade. `sk-code.cjs`'s layer-1 translator (`checkOpencodeDeterministic()`) faithfully carries the tool's own `severity` field through to P0/P1, so a `z_archive/`-path finding already prints as P1 (WARN), never P0, with no adapter-side suppression required.

**Live-Reality Check (2026-07-11)**: confirmed by reading `verify_alignment_drift.py` in full and re-deriving the call chain (`check_file()` → `classify_severity(path, rule_id)` → `is_context_advisory_path(path)`). Not re-derived from the 130-packet or any other adapter's precedent. This is sk-code's own tool, read directly.

---

## 3. TEST-HEAVY PATH SEVERITY DOWNGRADE

**Deviation name**: Test-heavy path severity downgrade

**Why it is not a violation**: the same `classify_severity()` downgrade applies to any path under a `/tests/` segment, or whose basename ends in `.test.ts`/`.spec.ts`/`.vitest.ts`/`.test.tsx`/`.spec.tsx`/`.vitest.tsx` (`is_test_heavy_path()`, verify_alignment_drift.py:231-236, `TS_TEST_SUFFIXES`, lines 85-92). Test fixtures and specs are held to a lighter mechanical bar than shipped implementation code.

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:85-92`: `TS_TEST_SUFFIXES` definition.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:231-236`: `is_test_heavy_path()`.
- `007-adapter-sk-code/plan.md` Architecture section names `is_test_heavy_path` as the second seed candidate.

**Match rule**: none currently (`matchTypes: []`), same reasoning as Section 2.

**Live-Reality Check (2026-07-11)**: `is_context_advisory_path()` itself calls `is_test_heavy_path()` first (verify_alignment_drift.py:226). Every test-heavy path is also context-advisory, so this entry is a documented subset of Section 2's, kept separate because plan.md names both functions individually and a reasoning-agent reviewer benefits from the narrower, more specific rationale ("this is test code," not just "this is advisory").

---

## 4. TS-MODULE-HEADER EXEMPTION FOR PATTERN-ASSET FILES

**Deviation name**: TS pattern-asset module-header exemption

**Why it is not a violation**: a TypeScript file under a path containing both `/assets/` and `/patterns/` segments is exempt from the `TS-MODULE-HEADER` check entirely (`should_skip_ts_module_header()`, verify_alignment_drift.py:249-250, calling `is_ts_pattern_asset()`, lines 239-241). These are illustrative pattern snippets, not real modules expected to carry a `MODULE:` header block.

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:239-241`: `is_ts_pattern_asset()`.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:249-250`: `should_skip_ts_module_header()`, the skip call site (this check is entirely skipped, not merely downgraded, distinct from Sections 2-3's severity-downgrade shape).
- `007-adapter-sk-code/plan.md` Architecture section names `is_ts_pattern_asset` as a third seed candidate.

**Match rule**: none currently (`matchTypes: []`). `verify_alignment_drift.py` never emits `TS-MODULE-HEADER` for a matching path in the first place, so there is nothing for the adapter to suppress after the fact.

**Live-Reality Check (2026-07-11)**: confirmed by reading `should_skip_ts_module_header()`'s two-line body directly (`is_test_heavy_path(path) or is_ts_pattern_asset(path)`). This is an unconditional skip, not a severity change, the one structurally different exemption shape among the four seeded here.

---

## 5. ONE KNOWN MALFORMED JSON TEST FIXTURE

**Deviation name**: Known malformed JSON fixture exemption

**Why it is not a violation**: exactly one file, a deliberately-malformed JSON fixture used by an earlier spec-kit test suite, is exempt from the `JSON-PARSE` check by an exact-suffix match (`is_known_malformed_json_fixture()`, verify_alignment_drift.py:244-246, `KNOWN_MALFORMED_JSON_FIXTURE_SUFFIXES`, lines 94-97). The file is intentionally invalid JSON by design (it is a fixture for testing malformed-input handling), not a real drift instance.

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:94-97`: the one hardcoded suffix, pointing at `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite/scratch/001-test-agent-08/malformed.json`.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:244-246`: `is_known_malformed_json_fixture()`.
- `007-adapter-sk-code/plan.md` Architecture section names `is_known_malformed_json_fixture` as the fourth seed candidate.

**Match rule**: none currently (`matchTypes: []`), same reasoning as Section 4 (unconditional skip inside the wrapped tool, nothing left for the adapter to suppress).

**Live-Reality Check (2026-07-11)**: confirmed the named path is a real, archived test-scratch file (both `z_archive` and `scratch` path segments present, so this single file is also covered by Section 2's context-advisory downgrade on every *other* rule type. This exemption is specifically and only about the `JSON-PARSE` check being skipped outright rather than merely downgraded).

---

## 6. sk-code's OWN TOOLING UNDER `code-webflow/` CLASSIFIES OPENCODE, NOT WEBFLOW

**Deviation name**: OPENCODE-precedence classification of Webflow-named tooling paths

**Why it is not a violation**: `stack_detection.md`'s own Detection Order (Section 2, lines 38-56) gives OPENCODE strict precedence over WEBFLOW markers for any path under `.opencode/`, and names the exact live rationale: *"`.opencode/` system tools (e.g. preview servers, mock fixtures, animation demos under `.opencode/skills/sk-doc/scripts/`) may import vanilla animation libraries internally without being WEBFLOW-shipping artifacts. A first-match-WEBFLOW order would mis-route this work to the wrong standards."* This adapter's own `classifySurface()` reproduces that precedence faithfully, which means every file under `.opencode/skills/sk-code/code-webflow/**` (its reference material, its verification *scripts*, even the word "webflow" in the directory name) classifies **OPENCODE**, not WEBFLOW, when discovered inside this monorepo. This is correct, intentional router behavior, confirmed live (Section 8's live-reality note below), not an adapter bug and not something a reasoning-agent reviewer should re-flag as "wrong surface."

**Evidence**:
- `.opencode/skills/sk-code/shared/references/stack_detection.md:38,42,56`: the precedence rule and its own named rationale.
- Live CLI dry-run, 2026-07-11: `node scripts/adapters/sk-code.cjs discover .opencode/skills/sk-code/code-webflow/assets/scripts` classified all three files (`minify-webflow.mjs`, `test-minified-runtime.mjs`, `verify-minification.mjs`) as `surface: "OPENCODE"`, `detectedFrom: "path"`. See `sk_code_adapter.md` Section 8 for the full transcript.

**Match rule**: none currently (`matchTypes: []`). This is a classification-outcome deviation, not a finding-type deviation. It is recorded here for the reasoning-agent layer's benefit (Section 1) and for any future human reviewer who encounters the same "why is this WEBFLOW-named file marked OPENCODE?" question.

**Live-Reality Check (2026-07-11)**: this is not a hypothetical scenario constructed for this document. It is the actual, live output of this adapter's own `discover()` against its own repository, confirmed by direct CLI invocation (see Section 8 cross-reference above).

---

## 7. MOTION.DEV CROSS-STACK PEER-LIBRARY REFERENCES

**Deviation name**: Motion.dev / GSAP / Lenis / Swiper / HLS peer-library references are not off-standard

**Why it is not a violation**: `smart_routing.md` §5 states Motion.dev (and by the same logic, GSAP/Lenis/Swiper/HLS, the same marker family `stack_detection.md`'s WEBFLOW content-grep checks) is *"a peer resource category... It is not a separate code surface. It supplements WEBFLOW, OPENCODE, or future surfaces."* A file that references one of these peer libraries is not thereby non-conformant to its own surface's standard. It is drawing on documented, expected cross-stack integration material (`code-webflow/references/animation/`), the exact resource `standardSource()`'s `motionOverlay` reference already surfaces to the reasoning-agent layer when `motionDevOverlay: true`.

**Evidence**:
- `.opencode/skills/sk-code/shared/references/smart_routing.md` Section 5 ("MOTION_DEV MAP"): "supplements... rather than replacing it."
- `.opencode/skills/sk-code/shared/references/smart_routing.md` Section 1: "Motion.dev resources are a **peer category** loaded after either surface, not a third surface."

**Match rule**: none currently (`matchTypes: []`). `sk-code.cjs`'s layer 1 has no "wrong peer library" finding type to suppress. This entry exists purely to keep the reasoning-agent layer from independently inventing one.

**Live-Reality Check (2026-07-11)**: `sk-code.cjs`'s own `MOTION_DEV_CONTENT_MARKER_RE` content-marker regex is a lightweight literal-text match, confirmed (by direct test against this adapter's own source file) to also fire on **prose that merely names** a Motion.dev API (for example a docstring quoting `"animate()"` as a keyword, not an actual `animate(...)` call). See `sk_code_adapter.md` Section 8 for the full reproduction. This is recorded as a known, accepted imprecision of the lightweight overlay signal (a false positive on *mentioning* the pattern, not *using* it), not silently smoothed over.

---

## 8. SCOPE OF THIS LIST

**In scope**: sk-code authority only. Each other authority adapter (sk-doc phase 005, sk-git and sk-design phase 006) owns its own known-deviation list under its own `standardSource`, per ADR-005's per-authority requirement. This document does not attempt to anticipate their conventions.

**Not a dumping ground**: per `spec.md` REQ-004's acceptance criteria and the phase's own risk register, every entry here traces to real, already-live tool source or a real classification outcome this adapter's own build reproduced, never an invented convention. An entry that stops matching real repo state gets flagged for operator review at REPORT time (ADR-006's state machine), not silently dropped or silently kept. The Live-Reality Check notes above are exactly that kind of flag, surfaced at authoring time instead of waiting for a later review pass.

---

## 9. MACHINE-READABLE DEVIATION LIST

`scripts/adapters/sk-code.cjs` parses this fenced block directly (see that file's `loadKnownDeviations()`). Keep it byte-consistent with Sections 2-7 above. This block is the operative rule set (currently all `matchTypes: []`, per Section 1), the prose above is the human-readable rationale and evidence for each.

```json
{
  "authority": "sk-code",
  "version": "1.0.0",
  "generatedFrom": "sk_code_known_deviations.md Section 9, hand-maintained alongside Sections 2-7",
  "deviations": [
    {
      "id": "context-advisory-path-severity-downgrade",
      "name": "Context-advisory path severity downgrade",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": null,
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:75-84",
        "verify_alignment_drift.py:225-228",
        "verify_alignment_drift.py:253-257"
      ]
    },
    {
      "id": "test-heavy-path-severity-downgrade",
      "name": "Test-heavy path severity downgrade",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": null,
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:85-92",
        "verify_alignment_drift.py:231-236"
      ]
    },
    {
      "id": "ts-pattern-asset-module-header-exemption",
      "name": "TS pattern-asset module-header exemption",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": ["OPENCODE"],
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:239-241",
        "verify_alignment_drift.py:249-250"
      ]
    },
    {
      "id": "known-malformed-json-fixture-exemption",
      "name": "Known malformed JSON fixture exemption",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": ["OPENCODE"],
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:94-97",
        "verify_alignment_drift.py:244-246"
      ]
    },
    {
      "id": "opencode-precedence-webflow-named-tooling",
      "name": "OPENCODE-precedence classification of Webflow-named tooling paths",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "surface-detection",
      "matchSurfaces": ["OPENCODE"],
      "status": "confirmed-live",
      "evidence": [
        "stack_detection.md:38,42,56",
        "sk_code_adapter.md Section 8 (live discover() dry-run transcript)"
      ]
    },
    {
      "id": "motion-dev-cross-stack-peer-reference",
      "name": "Motion.dev / GSAP / Lenis / Swiper / HLS peer-library references are not off-standard",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": null,
      "matchSurfaces": null,
      "status": "confirmed-live",
      "evidence": [
        "smart_routing.md Section 5",
        "smart_routing.md Section 1",
        "sk_code_adapter.md Section 8 (motionDevOverlay self-reference reproduction)"
      ]
    }
  ]
}
```

---

## 10. REFERENCES AND RELATED RESOURCES

- [sk_code_adapter.md](./sk_code_adapter.md): the full `standardSource`/`discover`/`check` specification this list is loaded by.
- [sk-code.cjs](../../scripts/adapters/sk-code.cjs): the reference wiring script. `loadKnownDeviations()` parses Section 9's fenced block.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real source of Sections 2-5's exemption functions.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-005`, `adr-008`): the alignment contract and hybrid-honesty decision this list satisfies.

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md && sed -n '1,300p' .opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "--lane-config JSON Schema (ADR-011: Config-File Only)"
description: "The concrete JSON shape a --lane-config <file.json> file must satisfy for deep-alignment's non-interactive path, and how it maps 1:1 onto the interactive scoping tree's lane-tuple output."
trigger_phrases:
  - "lane-config schema"
  - "deep-alignment non-interactive lanes"
  - "--lane-config json shape"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# --lane-config JSON Schema

The concrete JSON shape a `--lane-config <file.json>` file must satisfy for deep-alignment's non-interactive path.

---

## 1. OVERVIEW

### Purpose

ADR-011 (`002-architecture-decision/decision-record.md`) locks the non-interactive path to **config-file only**: a single `--lane-config <file.json>` flag, not repeated `--lane` flags and not an inline `--lanes` JSON-array flag. This document is that ADR's remaining open deliverable, the concrete field-level JSON shape, and the reference implementation that parses and validates it is `scripts/scoping.cjs`.

### When to Use

- Authoring a `--lane-config` file for a headless deep-alignment run.
- Validating a config-file lane against the same rules `scripts/scoping.cjs` enforces at parse time.
- Confirming a config-file lane resolves to the identical shape an interactive session would produce.
- Debugging a lane-config validation failure (unknown authority, invalid artifact-class, malformed scope).

### Prerequisites

- `scoping_protocol.md`, the interactive tree that produces the identical lane-tuple shape this file's `authority`/`artifactClass`/`scope` triple maps onto 1:1.
- `discover_contract.md`, what `DISCOVER` does with a resolved lane's `scope` next.

---

## 2. TOP-LEVEL SHAPE

The file is a **bare JSON array** of lane objects, not wrapped in an envelope object:

```json
[
  { "authority": "sk-doc", "artifactClass": "docs", "scope": { "type": "paths", "values": ["docs/"] } },
  { "authority": "sk-git", "artifactClass": "git-history", "scope": { "type": "branchRange", "from": "main", "to": "HEAD" } }
]
```

No envelope, version field, or metadata wrapper is added at this level. ADR-011's own reasoning for a file (over an inline flag) is that the file itself is versionable, diffable, and reviewable *as a file*, properties git already gives any tracked JSON file, not that the content needs its own internal version counter. An empty array (`[]`) is valid and resolves to zero lanes. It is not an error (mirrors the "empty resolves, does not fail" pattern the rest of this phase uses for empty scopes, see `scoping_protocol.md` §7).

---

## 3. PER-LANE OBJECT SHAPE

Each array entry has three required keys, the same three ADR-011 names verbatim, plus an optional `adapter` discriminator:

| Key | Type | Constraint |
|---|---|---|
| `authority` | string | Must be one of the registered authorities (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES` keys: `sk-doc`, `sk-git`, `sk-design`, `sk-code` in v1, extensible per ADR-012) |
| `artifactClass` | string | Must be one of `docs`, `code`, `designs`, `git-history`, AND must be one the named `authority` actually supports (see §4) |
| `scope` | object | One of the three shapes in §5, validated against the repo root for `paths`/`globs` |
| `adapter` | string | **Optional.** One of the authority's registered adapter modules (`scripts/scoping.cjs`'s `AUTHORITY_ADAPTERS[authority]`). Defaults to the authority's own module. Lets a `designs` lane select `sk-design-live-render` instead of the static `sk-design` adapter. It is a discovery/check module selector, not part of the lane's identity (laneId is authority×artifactClass×scope). |

This is not a schema-only rule. It is the literal object `scripts/scoping.cjs`'s `validateLane()` returns on success, unchanged, so a config-file lane and an interactively-resolved lane are indistinguishable once resolved (zero information loss, per ADR-011's own constraint).

---

## 4. AUTHORITY -> ARTIFACT-CLASS VALIDITY

| Authority | Valid `artifactClass` values (v1) |
|---|---|
| `sk-doc` | `docs` |
| `sk-git` | `git-history` |
| `sk-design` | `designs` |
| `sk-code` | `code` |

A lane naming a real authority with an artifact-class that authority does not support fails validation with both values named in the error (for example, `sk-git` paired with `docs`). This table is the config-file's version of the same rule the interactive tree enforces by only offering valid authorities once ARTIFACT-CLASS is picked (`scoping_protocol.md` §2.2). The config file has no such filtering at authoring time, so `scripts/scoping.cjs` enforces it at parse time instead.

---

## 5. `scope` SHAPES

Exactly one of three, discriminated by `scope.type`:

```json
{ "type": "paths", "values": ["docs/", "README.md"] }
```
```json
{ "type": "globs", "values": ["src/**/*.ts", "!src/**/*.test.ts"] }
```
```json
{ "type": "branchRange", "from": "main", "to": "HEAD" }
```

`values` (for `paths`/`globs`) must be a non-empty array of non-empty strings. Each is validated against the repo root before the lane is accepted (NFR-S01): an absolute path outside the repo, or a value containing a `..` traversal segment, fails the whole lane-config, not just that one lane. `from`/`to` (for `branchRange`) must be non-empty strings. They are git refs, not filesystem paths, so they are not repo-root-validated the same way.

---

## 6. JSON SCHEMA (INFORMATIVE)

The following is a machine-checkable restatement of §3-§5, for tooling that wants a formal schema rather than the prose above. `scripts/scoping.cjs` does not load this file or any schema-validator library at runtime. It hand-validates against the same rules directly, matching this repo's existing convention (`runtime/scripts/upsert.cjs` validates its own JSON input the same hand-rolled way, with no `ajv`/`zod` dependency in this package).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "deep-alignment lane-config",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["authority", "artifactClass", "scope"],
    "additionalProperties": false,
    "properties": {
      "authority": { "type": "string", "enum": ["sk-doc", "sk-git", "sk-design", "sk-code"] },
      "artifactClass": { "type": "string", "enum": ["docs", "code", "designs", "git-history"] },
      "adapter": { "type": "string", "description": "Optional adapter-module discriminator; one of the authority's AUTHORITY_ADAPTERS entries (default: the authority's own module)." },
      "scope": {
        "oneOf": [
          {
            "type": "object",
            "required": ["type", "values"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "paths" },
              "values": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } }
            }
          },
          {
            "type": "object",
            "required": ["type", "values"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "globs" },
              "values": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } }
            }
          },
          {
            "type": "object",
            "required": ["type", "from", "to"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "branchRange" },
              "from": { "type": "string", "minLength": 1 },
              "to": { "type": "string", "minLength": 1 }
            }
          }
        ]
      }
    }
  }
}
```

The `authority` enum grows by one value whenever ADR-012's governance process registers a new authority. Nothing else in this schema, or in `scripts/scoping.cjs`, changes shape to accommodate it.

---

## 7. WORKED EXAMPLE, MULTI-AUTHORITY SINGLE RUN

The operator precedent from `002-architecture-decision` ("sk-code and sk-git and/or sk-design" in one pass) as a `--lane-config` file:

```json
[
  {
    "authority": "sk-code",
    "artifactClass": "code",
    "scope": { "type": "globs", "values": ["src/**/*.ts"] }
  },
  {
    "authority": "sk-git",
    "artifactClass": "git-history",
    "scope": { "type": "branchRange", "from": "main", "to": "HEAD" }
  },
  {
    "authority": "sk-design",
    "artifactClass": "designs",
    "scope": { "type": "paths", "values": ["DESIGN.md"] }
  }
]
```

`node scripts/scoping.cjs --lane-config path/to/this-file.json` resolves this to 3 lanes in one call, the same 3-lane result an equivalent 3-walk interactive session produces via `resolveLanesFromSelections()`.

---

## 8. ERROR CONTRACT

Every validation failure fails the whole file (fail-closed, per ADR-011's own risk mitigation and `spec.md`'s Error Scenarios), before `DISCOVER` starts:

| Failure | Message names |
|---|---|
| Unknown `authority` | The bad value and the full currently-registered set |
| `artifactClass` not valid for the named `authority` | Both values and the authority's actual supported class(es) |
| Malformed/missing `scope` | Which lane (`lanes[N]`) and which field |
| File missing, unreadable, or not valid JSON | The resolved path and the underlying I/O or parse error |

`scripts/scoping.cjs` exits `3` (input-validation, matching `runtime/scripts/upsert.cjs`'s own exit-code convention) on any of these. It never resolves a malformed file to a partial or best-effort lane set.

---

## 9. REFERENCES AND RELATED RESOURCES

- `scoping_protocol.md`, the interactive tree that produces the identical lane-tuple shape this file's `authority`/`artifactClass`/`scope` triple maps onto 1:1.
- `discover_contract.md`, what `DISCOVER` does with a resolved lane's `scope` next.
- `scripts/scoping.cjs`, `resolveLanesFromConfig()`, `parseLaneConfigFile()`, and `validateLane()`, the reference implementation of everything in this document.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-011 (this schema's lock), ADR-012 (authority registration governance).
---
title: "discover(scope) -> artifacts Contract"
description: "The authority-agnostic discover(scope) -> artifacts half of the pluggable adapter contract every deep-alignment authority adapter implements identically."
trigger_phrases:
  - "alignment discover contract"
  - "deep-alignment adapter discover"
  - "coverage graph seed FILE nodes"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# discover(scope) -> artifacts Contract

The authority-agnostic `discover(scope) -> artifacts` half of the pluggable adapter contract every deep-alignment authority adapter implements identically.

---

## 1. OVERVIEW

### Purpose

ADR-003 (`002-architecture-decision/decision-record.md`) locks a three-method adapter contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, and `check(artifact, rules) -> findings`. That split keeps the loop itself from ever branching on which authority it is running. This document specifies the **first** method only: its input shape, its output shape, and the authority-agnostic guarantee every adapter phase (005 sk-doc, 006 sk-git/sk-design, 007 sk-code, 010 sk-design live-render, and any future authority under ADR-012) must satisfy identically. `standardSource` and `check` belong to each adapter phase's own spec, not this one (`spec.md` §3 Out of Scope).

### When to Use

- Implementing a new authority adapter's `discover(scope)` method.
- Verifying an adapter's artifact and seed-node output shape before wiring it into `DISCOVER`.
- Auditing whether an adapter's signature stays authority-agnostic per ADR-003.
- Debugging coverage-graph seeding for a lane's discovered artifacts.

### Prerequisites

- `scoping_protocol.md`, how the `scope` this method receives gets resolved and validated before `DISCOVER` ever calls it.
- `lane_config_schema.md` §5, the field-level shape of the `scope` object.

---

## 2. SIGNATURE

```
discover(scope) -> artifacts
```

One parameter. No authority name, artifact-class, or lane identifier appears in the signature. The adapter calling it already knows its own authority and artifact-class by virtue of being that authority's own module (per the v1 registry in `scoping_protocol.md` §2.2, one authority maps to one artifact-class), so passing them again would be redundant. Passing them again would also give the loop a reason to branch on authority, which ADR-003 forbids.

---

## 3. INPUT: `scope`

Exactly the `scope` field of one resolved alignment lane (`scoping_protocol.md` §4), already validated against the repo root (NFR-S01) before `DISCOVER` calls this method, so an implementation may assume every `paths`/`globs` value is repo-relative and traversal-free. Three shapes, one per `scope.type`:

```json
{ "type": "paths", "values": ["docs/", "README.md"] }
{ "type": "globs", "values": ["src/**/*.ts"] }
{ "type": "branchRange", "from": "main", "to": "HEAD" }
```

Full field definitions: `lane_config_schema.md` §5.

---

## 4. OUTPUT: ARTIFACT CORPUS + SEED FILE NODES

`discover()` returns two things together: the artifact list itself, and the coverage-graph seed nodes that make the artifacts visible to `ITERATE`/`CONVERGE`.

```json
{
  "artifacts": [
    { "path": "docs/foo.md" }
  ],
  "nodes": [
    {
      "id": "file:docs/foo.md",
      "kind": "FILE",
      "name": "docs/foo.md",
      "metadata": { "authority": "sk-doc", "artifactClass": "docs" }
    }
  ]
}
```

### 4.1 `artifacts`

One entry per discovered artifact. For `paths`/`globs` scopes, an entry is `{ path }` (a repo-relative file path). For `branchRange` scopes, an entry is a path+ref pair, `{ path, ref }`, since the same file can exist differently at different points in the range. `plan.md` §3 states this explicitly ("file paths or path+ref pairs for git-history scopes"). The exact `path`/`ref` identity convention (which ref, how a rename across the range is represented) is each adapter's own design choice: phase 006 owns `sk-git`'s.

### 4.2 `nodes`

Seed nodes shaped for `runtime/scripts/upsert.cjs`'s `--nodes` input, one node per discovered artifact, `kind: "FILE"`. This is not a new node shape invented for this mode. It is the same `FILE` kind `deep-review` already seeds through the same script:

- `FILE` is a valid `NodeKind` for loop type `review` (`runtime/lib/coverage-graph/coverage-graph-db.ts:22`) **and** for loop type `context` (`runtime/lib/coverage-graph/coverage-graph-db.ts:34`), so a `FILE` seed node is valid regardless of which of those two `runtimeLoopType` values ADR-010's reuse-boundary work (phase 008) ultimately picks for `deep-alignment`.
- The node object itself is a `CoverageNode` (`runtime/lib/coverage-graph/coverage-graph-db.ts:79-93`): `id`, `kind`, `name` are required. `metadata` is free-form and is where an adapter should carry `authority`/`artifactClass` (and, for `branchRange` discoveries, the `ref`) so downstream findings can be traced back to their lane without a second lookup.
- `upsert.cjs` derives the rest at insert time: `kind = String(n.kind || n.nodeKind || n.type || '').toUpperCase()`, checked against `db.VALID_KINDS[loopType]` (`runtime/scripts/upsert.cjs:204-212`), and `name = n.name || n.label || n.id` (`runtime/scripts/upsert.cjs:214`). A discovered-artifact node only needs to supply `id`, `kind: "FILE"`, `name`, and `metadata`. `specFolder`, `sessionId`, and `loopType` are namespace context the CLI call supplies once for the whole batch, not per node.
- Seeding (as opposed to an ordinary iteration upsert) is what marks these `FILE` nodes as `DISCOVER`-origin rather than `ITERATE`-origin: pass `--seed-source` and `--seed-confidence` on the same `upsert.cjs` invocation (`runtime/scripts/upsert.cjs:103-129`'s `parseSeedOptions()`, both required together, `seedConfidence` a number in `[0, 1]`). A `DISCOVER`-state call seeding a lane's corpus looks like:

  ```
  node runtime/scripts/upsert.cjs \
    --spec-folder <bound-spec-folder> \
    --loop-type review \
    --session-id <session-id> \
    --seed-source deep-alignment-discover \
    --seed-confidence 1.0 \
    --nodes '[{"id":"file:docs/foo.md","kind":"FILE","name":"docs/foo.md","metadata":{"authority":"sk-doc","artifactClass":"docs"}}]'
  ```

  Zero edges is a valid call shape here: `upsert.cjs` only rejects an entirely empty `nodes`+`edges` payload when no seed options are supplied (`runtime/scripts/upsert.cjs:175-196`). A non-empty `--nodes` array with `--seed-source`/`--seed-confidence` set passes through normally.

---

## 5. EMPTY AND ZERO-MATCH SCOPE

Per `spec.md`'s edge cases, an empty scope (no paths/globs match anything on disk) is not an error. `discover()` returns `{ "artifacts": [], "nodes": [] }`, and the lane it belongs to is marked zero-coverage downstream rather than the run failing. A `SCOPE` value that resolved fine in the scoping step but happens to match zero files at discover-time is exactly the same case, not a distinct one.

---

## 6. AUTHORITY-AGNOSTIC EXTENSIBILITY GUARANTEE

No adapter phase may widen this signature to take a second parameter, and no engine-side caller may special-case a named authority when invoking it. This is the concrete meaning of ADR-003's "do NOT hard-wire only 4" constraint, made checkable: a diff of the planned signature against every adapter phase's stated usage (`plan.md` §4 Phase 3's own verification task for this phase) should show zero authority-specific parameters, in phase 005 through phase 010 alike. A fifth authority (`sk-prompt`, `system-spec-kit`, or any other) implements `discover(scope) -> artifacts` in exactly this shape, ships the short decision-record ADR-012 requires, and needs no change to this document, to `scripts/scoping.cjs`, or to the loop.

---

## 7. REFERENCES AND RELATED RESOURCES

- `scoping_protocol.md`, how the `scope` this method receives gets resolved and validated before `DISCOVER` ever calls it.
- `lane_config_schema.md`, the on-disk shape of a lane's `scope`, field by field.
- `runtime/scripts/upsert.cjs`, the coverage-graph seeding entrypoint every adapter's `nodes` output is written through.
- `runtime/lib/coverage-graph/coverage-graph-db.ts`, the `CoverageNode`/`NodeKind` types `upsert.cjs` validates against.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-003 (this contract), ADR-004 (authority sequencing), ADR-012 (new-authority governance).

exec
/bin/zsh -lc "wc -l .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md && sed -n '1,360p' .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     148 .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md
     288 .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md
     436 total
---
title: "State-Machine Wiring - INIT through REMEDIATE"
description: "The concrete state-to-script wiring for the deep-alignment loop: which script each state calls, the alignment/ state-file layout, the convergence-threshold formula, and the resolved loopType decision."
trigger_phrases:
  - "deep-alignment state machine wiring"
  - "alignment loop convergence thresholds"
  - "alignment state file layout"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# State-Machine Wiring - INIT through REMEDIATE

The concrete state-to-script wiring for the deep-alignment loop, from `INIT` through `REMEDIATE`.

---

## 1. OVERVIEW

### Purpose

Phase 008 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/`) wires the deep-alignment loop's seven states onto the reused deep-loop runtime plus two new single-shot scripts (`check-convergence.cjs`, `partition-corpus.cjs`) and one gated hook stub (`remediate-hook.cjs`). This document is the concrete "what calls what, in what order, with what state-file layout" reference every later phase (009's command YAML + LEAF agent) builds against, so the wiring does not need to be re-derived.

Every script named here is **single-shot**: it answers one question and returns, exactly like `runtime/scripts/{loop-lock,convergence,reduce-state,upsert}.cjs` already do. None of them loop or dispatch internally. `deep-alignment/SKILL.md`'s own "FORBIDDEN INVOCATION PATTERNS" section rules out "a custom bash/shell dispatcher to parallelize lanes or iterations." The external orchestrator that calls these once per iteration (a command YAML plus a LEAF agent, mirroring `deep_review_auto.yaml` + `deep-review.md`) is phase 009's own deliverable, not built here.

### When to Use

- Implementing phase 009's command YAML or LEAF agent against this wiring.
- Confirming which script owns a given state's reads and writes before adding a new one.
- Debugging an `alignment/` state-file inconsistency against the layout in §3.
- Deciding whether a change belongs in `check-convergence.cjs` or in `runtime/scripts/convergence.cjs` (see §5).

### Prerequisites

- `discover_contract.md`, `scoping_protocol.md`, `lane_config_schema.md`, the upstream contracts this wiring consumes.
- `runtime/scripts/{loop-lock,convergence,upsert}.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, the reused/sibling runtime primitives.

---

## 2. STATE-TO-SCRIPT MAP

| State | Script(s) invoked | Reads | Writes |
|---|---|---|---|
| `INIT` | `runtime/scripts/loop-lock.cjs acquire` | -- | `alignment/.deep-alignment.lock` |
| `SCOPE` | `deep-alignment/scripts/scoping.cjs` (`--lane-config` or `resolveLanesFromSelections`) | operator's lane answers or `--lane-config <file.json>` | `alignment/deep-alignment-config.json` (`lanes` field, frozen once written) |
| `DISCOVER` | each lane's adapter `discover(scope)` (`deep-alignment/scripts/adapters/<authority>.cjs`), then `runtime/scripts/upsert.cjs --seed-source deep-alignment-discover --seed-confidence 1.0` | `deep-alignment-config.json` lanes | `alignment/deep-alignment-corpus.json` (one entry per lane: `{laneId, authority, artifactClass, scope, artifacts}`), coverage-graph `FILE` nodes via `upsert.cjs` |
| `ITERATE` | `deep-alignment/scripts/partition-corpus.cjs` (which slice next), each lane's adapter `standardSource(authority)` + `check(artifact, rules)` | `deep-alignment-corpus.json`, `deep-alignment-findings-registry.json` (via the reducer, for already-checked counts) | `alignment/deep-alignment-state.jsonl` (append `{type:'iteration', laneId, artifactsChecked, newFindingsRatio, ...}`), `alignment/deltas/iter-NNN.jsonl` (append `{type:'finding', laneId, finding}`), `alignment/iterations/iteration-NNN.md` (narrative) |
| `CONVERGE` | `deep-alignment/scripts/check-convergence.cjs` | `deep-alignment-state.jsonl`, `deep-alignment-corpus.json`, the reducer's registry | none (decision only) |
| `REPORT` | `runtime/scripts/reduce-alignment-state.cjs <spec-folder>` | `deep-alignment-state.jsonl`, `deltas/`, `deep-alignment-config.json` | `alignment/deep-alignment-findings-registry.json`, `alignment/alignment-report.md` |
| `REMEDIATE` (optional, gated) | `deep-alignment/scripts/remediate-hook.cjs` | none | none (hook point only, no remediation logic exists yet, see §7) |

`INIT`'s lock is released (`loop-lock.cjs release`) after `REPORT`, or after `REMEDIATE` when that optional state runs.

---

## 3. THE `alignment/` STATE-FILE LAYOUT

Modeled directly on the real `review/` layout observed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/`:

```
<bound-spec-folder>/alignment/
├── deep-alignment-config.json          # SCOPE output, frozen (fileProtection: immutable)
├── deep-alignment-corpus.json          # DISCOVER output, one entry per lane (auto-generated)
├── deep-alignment-state.jsonl          # ITERATE append log (append-only)
├── deep-alignment-findings-registry.json  # REPORT output (auto-generated, reducer-owned)
├── alignment-report.md                 # REPORT output, one section per lane (auto-generated)
├── .deep-alignment.lock                # loop-lock.cjs lock file (operator-controlled)
├── iterations/
│   └── iteration-NNN.md                # per-iteration narrative (write-once)
├── deltas/
│   └── iter-NNN.jsonl                  # per-iteration finding deltas (write-once)
├── prompts/
│   └── iteration-N.md                  # per-iteration dispatch prompt (phase 009 populates)
└── dispatch-receipts/
    └── dispatch-alignment-iN-g1.{intent,completion}.json  # phase 009 populates
```

`deep-alignment-corpus.json` has no literal analog in `review/`'s layout. deep-review's four dimensions are a fixed constant, so it never needed a separate "what did DISCOVER find" file distinct from its (also fixed) config. deep-alignment's lanes are resolved per-run and their corpora are discovered per-run, so persisting the DISCOVER result as its own auto-generated file (rather than appending to the frozen config) keeps `deep-alignment-config.json`'s "immutable" `fileProtection` entry honest. See `deep_alignment_config_template.json` for the full config shape.

---

## 4. CONVERGENCE: THE RESOLVED FORMULA (REQ-004)

**Combination: AND, not OR.** Convergence requires **both**:

1. **Artifact-coverage**, the fraction of discovered artifacts checked at least once, across all applicable lanes (a lane with zero discovered artifacts is excluded from both sides of the ratio: vacuously covered, matching `reduce-alignment-state.cjs`'s own `NOT_APPLICABLE` treatment rather than inventing a second convention). Default threshold: 100% (`coverageThreshold: 1.0`).
2. **Dry-run stability**, the last N (default 2, `stabilityWindow`) iteration records, across all lanes in state-log append order, must all report `newFindingsRatio === 0`. Fewer than N iterations recorded yet fails closed to "not stable," so a fresh run can never converge on its first iteration by construction.

**Why AND, not OR**: full coverage with still-unstable findings is not a done run (something is still actively drifting), and stability with incomplete coverage is not a done run either (large parts of the corpus were never even looked at, a trivially "stable" zero-signal from untouched artifacts). Requiring both mirrors deep-review's own convergence philosophy of weighting coverage and stability as separate, simultaneously-necessary signals (`convergence.cjs`'s `computeCompositeScore` weights `dimensionCoverage` and `findingStability` as distinct additive terms, never alternatives).

**max-iterations is an independent hard stop**, applied regardless of the AND-pair's outcome: `iterationsRun >= maxIterations` forces `STOP_MAX_ITERATIONS` even when neither coverage nor stability has been met, exactly as a safety backstop against a lane that never stabilizes.

Implementation: `deep-alignment/scripts/check-convergence.cjs`. See §5 for why this is a self-contained script rather than a `runtime/scripts/convergence.cjs` code path.

---

## 5. THE loopType DECISION (REQ-001), RESOLVED

### The constraint

`runtime/scripts/convergence.cjs` (lines 659-660 as of this phase's read, re-verified current) hard-validates its loop type:

```js
if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context') {
  throw inputError('loopType must be "research", "review", "council", or "context"');
}
```

Two reuse options were on the table (plan.md §3 Architecture):

- **Option A, extend the enum**: add `'alignment'` as a fifth value, plus a new `computeCompositeScore` branch and a new lane-aware signals builder (analogous to `buildReviewSignals`).
- **Option B, reuse `'review'` unchanged**: pass `loopType: 'review'` with a distinct namespace so alignment's graph writes never collide with a real deep-review run on the same packet.

### What reading the real code changed

`computeCompositeScore`'s `'review'`-shaped branch (the one Option B would inherit unchanged) is driven by `buildReviewSignals(nodes, edges)`, which depends on graph conventions deep-alignment's adapters have no reason to produce: `DIMENSION`-kind nodes, `FINDING`-kind nodes with `metadata.severity`, and `COVERS`/`CONTRADICTS`/`EVIDENCE_FOR`/`RESOLVES` edges. `discover_contract.md` (this phase's own dependency) only specifies adapters seeding `FILE` nodes, nothing about a `DIMENSION`-per-lane graph convention. Reusing `'review'` **unchanged**, as Option B's plan.md framing described it ("zero runtime code change"), would silently produce `dimensionCoverage: 0` / `evidenceDensity: 0` / etc. for every real run (no `DIMENSION` or `FINDING` nodes ever get seeded): a composite score that looks like a permanent near-failure regardless of actual alignment quality. Making Option B produce a *meaningful* signal would require deep-alignment to fabricate a parallel `DIMENSION`-per-lane graph population scheme across every adapter's `ITERATE` call, real, non-trivial new work, just relocated from `convergence.cjs` into the adapters instead of avoided.

Separately, `loopType` is part of the coverage-graph's own namespace key (`{specFolder, loopType, sessionId}`, `convergence.cjs`'s `ns` object). Option B's own plan.md description already had to name a workaround ("bind a distinct `--spec-folder`/namespace so alignment's snapshots never collide with a real deep-review run on the same packet"), meaning reuse-unchanged is not actually collision-safe by construction. It requires an artificial disambiguation Option A gets for free, since `loopType` differing already partitions the namespace.

### The decision

**Option A (extend the enum to add `"alignment"`) is the architecturally correct long-term path.** It is namespace-safe by construction and does not require fabricating a misleading graph-population scheme. This is a recommendation for whichever future phase actually touches `runtime/scripts/convergence.cjs`, not an implementation performed here: `plan.md`'s own "Affected Surfaces" table marks `convergence.cjs` as **"Read-only analysis in this phase; a future phase either extends its enum or reuses it unchanged"**, and this phase's write scope does not include that file.

**What this phase actually built instead**: `spec.md`'s own NFR-R01 names the fallback explicitly, *"If `convergence.cjs` cannot be reused as-is (loopType rejected), the plan's fallback is graceful degradation to a documented manual coverage check, not a silent skip of convergence detection."* `deep-alignment/scripts/check-convergence.cjs` **is** that documented manual coverage check: it implements REQ-004's coverage-AND-stability-AND-max-iterations formula directly against the reducer's own registry and the JSONL state log, without touching `convergence.cjs` or depending on any graph-node convention. This gives phase 008 a real, tested, runnable convergence decision today, while leaving Option A's enum extension as a clearly-scoped, ready-to-apply follow-up (add `'alignment'` to the validation line, add a lane-aware signals branch) for whichever phase is authorized to edit that shared file.

**Do not silently reuse `'review'` unchanged.** If a future phase decides the graph-based composite score is worth the added population work after all, it should extend the enum (Option A) rather than reuse `'review'`, for the namespace-safety reason above.

---

## 6. CORPUS PARTITIONING (LANE ROUND-ROBIN)

Distinct from deep-review's fixed four-dimension rotation (four named categories, always the same four), deep-alignment's lanes are N-many, resolved per-run, with variable artifact counts. `partition-corpus.cjs` walks `deep-alignment-corpus.json`'s lanes in declaration order, wrapping, and returns the next lane with unaudited artifacts remaining (comparing the corpus's total against the reducer's per-lane `artifactsChecked` count), sliced to `batchSize` (default 5) artifacts per call. A lane whose corpus is zero-length or fully checked is skipped without ending the walk. `{done: true}` is returned only when every lane's corpus is exhausted.

---

## 7. THE `REMEDIATE` HOOK POINT (ADR-005 INVARIANT 4)

`remediate-hook.cjs` is the concrete, callable proof that the state transition after `REPORT` exists and is safe to enter. It performs **no** remediation action (no file writes, no git operations) and always returns `{status: 'not_implemented', ...}`, citing ADR-005 invariant 4 and `SKILL.md`'s "NEVER run the gated remediation pass without an explicit, separate operator opt-in" rule. A future phase that builds real remediation logic replaces this script's body. The wiring contract (REPORT can optionally transition to REMEDIATE) is already correct.

---

## 8. REFERENCES AND RELATED RESOURCES

- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-005 (alignment contract), ADR-006 (state machine + layout), ADR-010 (reduce-state.cjs relocation).
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/`, this phase's spec/plan, REQ-001 through REQ-006.
- `discover_contract.md`, `scoping_protocol.md`, `lane_config_schema.md`, the upstream contracts this wiring consumes.
- `runtime/scripts/{loop-lock,convergence,upsert}.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, the reused/sibling runtime primitives.

exec
/bin/zsh -lc "sed -n '1,340p' .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: sk-code Hybrid Adapter - standardSource, discover, check
description: The concrete standardSource("sk-code")/discover(scope)/check(artifact,rules,options) specification for the hardest of the four v1 authorities: a two-layer HYBRID check() (ADR-008 LOCKED) wrapping the real shared surface router plus verify_alignment_drift.py and the Webflow verification scripts for the deterministic layer, and a structured dispatch-packet builder (not a self-judging script) for the reasoning-agent layer.
trigger_phrases:
  - "sk-code alignment adapter"
  - "sk-code hybrid check"
  - "deep-alignment sk-code check"
  - "surface detection alignment adapter"
  - "reasoning agent dispatch packet sk-code"
importance_tier: important
contextType: implementation
version: 1.0.0.3
---

# sk-code Hybrid Adapter

The concrete `standardSource("sk-code")` / `discover(scope)` / `check(artifact, rules, options)` specification for the sk-code authority, the hardest of the four v1 `deep-alignment` authorities (ADR-004), built last so the adapter contract was already proven against sk-doc's fully-deterministic reference shape (phase 005) before this phase's honestly-partial HYBRID shape.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes the same three-method, authority-agnostic contract every adapter implements: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. This document specifies sk-code's implementation of all three, and `scripts/adapters/sk-code.cjs` is the real, executable code behind it, built to match `scripts/adapters/sk-doc.cjs`'s exact file shape (imports → constants → classifier → discover → suppression → standardSource → subprocess wrappers → check → CLI → exports) per this phase's own brief.

### ADR-008: HYBRID, Not a Deterministic Linter

ADR-008 (decision-record.md, ANCHOR `adr-008`) LOCKS this adapter's `check()` as a two-layer HYBRID: **deterministic surface-detection** (reusing sk-code's shared router, never reimplemented: REQ-001) **plus reasoning-based pattern-conformance** for everything the deterministic layer does not cover, every finding honestly labeled by producing `layer`. This document and `sk-code.cjs` implement that locked frame. They do not re-litigate whether to use it (spec.md's Open Questions §10 confirms this explicitly).

### What This Adapter Wraps (Not Reimplements)

Per REQ-001/REQ-002, four real, already-shipping sources, cited with exact line numbers so this specification stays checkable against the live files:

1. `.opencode/skills/sk-code/shared/references/stack_detection.md`: the surface-detection Detection Order (§2, lines 36-56) this adapter's `classifySurface()` ports directly.
2. `.opencode/skills/sk-code/shared/references/smart_routing.md`: the MOTION_DEV overlay's peer-category framing (§5) and the machine-readable `INTENT_SIGNALS`/`RESOURCE_MAP` this adapter's `standardSource()` points at.
3. `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real OPENCODE-surface deterministic pattern-drift checker. CLI usage at lines 110-123 (`--root` is `action='append'`, repeatable, directory-only, see Section 4.1's live-reality note). `SUPPORTED_EXTENSIONS` at lines 39-51 lists **7 languages**: TypeScript, JavaScript, Python, Shell, **Rust**, JSON and JSONC, one more than spec.md REQ-002's own acceptance-criteria prose names, "TS/JS/Python/Shell/JSON/JSONC". This was confirmed by reading the live docstring, lines 11-18, and `check_rust()`, lines 357-393, in full. It is a real spec-vs-tool discrepancy recorded here rather than silently resolved either direction. No `--json` flag exists (text stdout only, parsed by regex, Section 4.1).
4. `.opencode/skills/sk-code/code-webflow/assets/scripts/{verify-minification.mjs,test-minified-runtime.mjs}`: the real, read-only WEBFLOW-surface verification scripts (Section 4.2's live-reality findings explain why `minify-webflow.mjs`, the third script in this directory, is explicitly excluded).

Explicitly **not wrapped**: any new deterministic linter beyond what already exists (spec.md Out of Scope: "Building new deterministic linters beyond what already exists... out of scope; this phase reuses, not extends, the deterministic layer").

---

## 2. STANDARDSOURCE("SK-CODE")

`standardSource('sk-code')` returns a single object naming every real source Section 1 lists, the excluded script and the parsed known-deviation list. This is the **live output** of `node scripts/adapters/sk-code.cjs standard-source` (2026-07-11, paths shown resolved for this checkout):

```json
{
  "authority": "sk-code",
  "surfaceRouter": {
    "smartRouting": "<repo>/.opencode/skills/sk-code/shared/references/smart_routing.md",
    "stackDetection": "<repo>/.opencode/skills/sk-code/shared/references/stack_detection.md"
  },
  "validators": {
    "opencodeDrift": {
      "tool": "verify_alignment_drift.py",
      "path": "<repo>/.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py",
      "coversSurface": "OPENCODE",
      "layer": "deterministic",
      "coveredExtensions": [".ts", ".tsx", ".mts", ".js", ".mjs", ".cjs", ".py", ".sh", ".rs", ".json", ".jsonc"]
    },
    "webflowMinificationVerify": {
      "tool": "verify-minification.mjs",
      "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs",
      "coversSurface": "WEBFLOW", "layer": "deterministic", "requiresProjectRoot": true
    },
    "webflowRuntimeTest": {
      "tool": "test-minified-runtime.mjs",
      "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs",
      "coversSurface": "WEBFLOW", "layer": "deterministic", "requiresProjectRoot": true
    }
  },
  "excludedFromCheck": [{
    "tool": "minify-webflow.mjs",
    "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs",
    "reason": "Writes src/2_javascript/z_minified/*.min.js and manifest.tsv -- mutates the reviewed tree, violating ADR-005/NFR-S01 read-only-by-default. plan.md named it as part of the deterministic chain; this adapter excludes it from check() (Section 4.1.2)."
  }],
  "references": {
    "opencode": "<repo>/.opencode/skills/sk-code/code-opencode/references",
    "webflow": "<repo>/.opencode/skills/sk-code/code-webflow/references",
    "motionOverlay": "<repo>/.opencode/skills/sk-code/code-webflow/references/animation"
  },
  "knownDeviations": [ /* 6 entries, parsed from sk_code_known_deviations.md Section 9 */ ]
}
```

Calling `standardSource()` with any authority other than `'sk-code'` throws. This file is the sk-code-specific implementation, not a cross-authority dispatcher (that dispatch belongs to phase 008's engine).

---

## 3. DISCOVER(SCOPE) FOR SK-CODE

### Behavior

Given a `scope` object (the real, live shape from `../discover_contract.md` §3: `{type:'paths'|'globs', values}` or `{type:'branchRange', from, to}`), `discover()`:

1. For `type:'paths'`/`type:'globs'`: resolves and walks each value against the repo root exactly as `sk-doc.cjs` does (same `isInsideRepoRoot`/`globToRegExp`/`globWalkRoot` utilities, duplicated per-adapter rather than shared. ADR-003's own Consequences section names this exact duplication as accepted until a shared helper is worth extracting).
2. Every walk skips `verify_alignment_drift.py`'s own `EXCLUDED_DIRS` (verify_alignment_drift.py:53-63: `.git`, `node_modules`, `dist`, `build`, `coverage`, `__pycache__`, `.next`, `.venv`, `venv`), reused verbatim per REQ-001, not reimplemented.
3. Collects every file matching `CODE_EXTENSIONS`: `verify_alignment_drift.py`'s own `SUPPORTED_EXTENSIONS` (11 extensions, 7 languages) **union** `.css`/`.html`, added because `stack_detection.md:28` names WEBFLOW as owning "Webflow / vanilla HTML, CSS, JavaScript" and `verify_alignment_drift.py` itself checks neither CSS nor HTML at all (confirmed: absent from its `SUPPORTED_EXTENSIONS` and from every `check_*` function). Only the narrower, OPENCODE-checkable subset gets real layer-1 coverage. CSS/HTML artifacts get a `deterministic-layer-not-applicable` finding (Section 4.1) and fall through to layer 2 only.
4. For each collected file, reads its content and calls `classifySurface(relPath, content)` (Section 3.1) and `detectMotionDevOverlay(content)` (Section 3.2), then returns `{ artifacts: [{path}, ...], nodes: [{id, kind:'FILE', name, metadata}, ...] }`, the real `discover_contract.md` §4 output shape exactly, `surface`/`detectedFrom`/`motionDevOverlay` carried in each node's `metadata`.
5. `branchRange`: returns `{artifacts:[], nodes:[]}`. sk-code's only registered artifact-class is `code` (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES`), so a valid lane should never hand this adapter a `branchRange` scope. This mirrors `sk-doc.cjs`'s identical branch and rationale.

**Content-reading difference from sk-doc.cjs**: sk-doc's classifier is purely path-based (document type never depends on file content). sk-code's cannot be: `stack_detection.md` §2's own WEBFLOW detection order includes a content-grep fallback (animation-library globals, `Webflow.push`) a path-only classifier cannot reproduce faithfully, so `discover()` reads every candidate file's content (real, justified extra I/O, not gratuitous complexity).

### 3.1 Surface Classification (`classifySurface`)

Ported from `stack_detection.md` §2's real Detection Order, not reimplemented (REQ-001):

| Order | Rule | Source |
|---|---|---|
| 1 | Path is `.opencode/` or starts with `.opencode/` → **OPENCODE** | stack_detection.md:38,42,56, highest precedence |
| 2 | Path contains `/src/2_javascript/` or starts with `src/2_javascript/` → **WEBFLOW** | stack_detection.md:45 |
| 2 | Path ends `.webflow.js` → **WEBFLOW** | stack_detection.md:46 |
| 2 | Path is or ends `/wrangler.toml` → **WEBFLOW** | stack_detection.md:50 |
| 2 | Content matches `Webflow\.push\|--vw-\|window\.Motion\|window\.gsap\|gsap\.(to\|from\|set\|timeline\|registerPlugin)\|new Lenis\|new Hls\|new Swiper\|FilePond` → **WEBFLOW** | stack_detection.md:48-49, ported verbatim |
| 3 | None of the above → **UNKNOWN** | stack_detection.md:52-53 |

Rule 1 is checked first and short-circuits, exactly matching stack_detection.md's own documented precedent, including a consequence that precedent's own prose predicts and this adapter's live dry-run confirmed (Section 8).

### 3.2 MOTION_DEV Overlay Detection

`smart_routing.md` §5: "Motion.dev resources are a **peer category**... not a third surface." `detectMotionDevOverlay()` is therefore never a `surface` value: it is a boolean `metadata.motionDevOverlay` flag, tested against a Motion.dev-specific subset of the same marker family (`window\.Motion\b|Motion\.animate|\banimate\(|\binView\(|\bstagger\(|\bscroll\(\s*\{`), translated from `smart_routing.md`'s machine-readable `MOTION_DEV` `INTENT_SIGNALS` keyword list (`"animate()"`, `"inview"`, `"scroll()"`, `"stagger()"`) into a content regex, since `discover()` has file content available, not prompt text. Section 8 documents a real, honest limitation of this lightweight approach.

---

## 4. CHECK(ARTIFACT, RULES, OPTIONS)

`check()` runs two layers per artifact (deterministic, then reasoning-agent) and returns a flat findings array after known-deviation suppression, matching `sk-doc.cjs`'s exact shape. Per REQ-005, every call re-runs both layers fresh. Nothing is cached from `discover()` time or a prior `check()` call.

### 4.1 Layer 1 - Deterministic

Dispatches on the artifact's `surface` (from `classifySurface()`, re-derived if the caller passed a bare path):

#### 4.1.1 OPENCODE surface - `verify_alignment_drift.py`

1. If the artifact's extension is not in `verify_alignment_drift.py`'s own `SUPPORTED_EXTENSIONS` (for example a `.css`/`.html` file that classified OPENCODE by path), emit a single `P2` `deterministic-layer-not-applicable` finding. This tool structurally cannot check that extension, distinct from "ran and found nothing."
2. Otherwise, `spawnSync('python3', [verify_alignment_drift.py, '--root', dirname(absPath)], { cwd: REPO_ROOT })`, **for real**, same subprocess pattern `sk-doc.cjs` uses for `validate_document.py`. `--root` must be a **directory**: `verify_alignment_drift.py`'s own `iter_code_files()` walks via `os.walk(abs_root)`, which silently yields zero files for a file-shaped root (confirmed by reading the function). Passing the artifact's own path directly would silently under-scan, so this adapter always passes the artifact's *containing directory*.
3. No `--json` flag exists (confirmed by reading the full `argparse` block, lines 110-123). Stdout is text, parsed by a regex matching the tool's own fixed print format (verify_alignment_drift.py:534-537): `- {relpath}:{line} [{rule_id}] [{severity}] {message} Fix: {fix_hint}`. `cwd: REPO_ROOT` makes the tool's own `relpath()` (verify_alignment_drift.py:500-504, relative to `os.getcwd()`) print repo-relative paths matching this adapter's `artifact.path` convention.
4. The tool's own findings (for the whole scanned directory) are filtered down to just the lines matching this one artifact's repo-relative path.
5. Severity mapping (Section 7) translates the tool's own `ERROR`/`WARN` into `P0`/`P1`.
6. Subprocess failure (`python3` missing, etc.) becomes a `P1` `adapter-error` finding, distinct from an artifact-level conformance finding, the same discipline as `sk-doc.cjs`'s subprocess wrappers.

#### 4.1.2 WEBFLOW surface - the minification/verification scripts, honestly bounded

Building this adapter surfaced three real, load-bearing facts that reshape what "invoke the Webflow script chain" can honestly mean here, each verified live rather than assumed from plan.md's prose (Section 8 has full transcripts):

- **`minify-webflow.mjs` mutates the tree**. It shells out while doing it. `minify_file()` (lines 89-124) writes each `src/2_javascript/z_minified/*.min.js` output not via a direct file write but by shelling out to `execSync('npx terser "<source>" --compress --mangle -o "<output_path>"')` (line 104), a subprocess that can itself trigger an `npx` package fetch, a materially larger side effect than a plain file write. `save_manifest()` (line 146) separately writes `manifest.tsv` via `writeFileSync` (line 157). ADR-005/NFR-S01 require `check()` to be read-only by default. plan.md's Architecture section named this script as part of the deterministic chain to invoke. This adapter **excludes it from `check()` entirely** (recorded in `standardSource()`'s `excludedFromCheck`), a real, documented deviation from the plan's literal text, made because building the adapter surfaced a constraint (and a bigger one than initially assumed) the plan's prose had not accounted for, not silently reconciled.
- **`verify-minification.mjs` and `test-minified-runtime.mjs` take no path argument.** Both hardcode `SOURCE_DIR = 'src/2_javascript'` / `OUTPUT_DIR = 'src/2_javascript/z_minified'` **relative to `process.cwd()`** (confirmed by reading both scripts in full). Unlike `verify_alignment_drift.py --root <path>`, there is no way to point either script at an arbitrary artifact. They must run with `cwd` set to the actual Webflow project root. `findWebflowProjectRoot()` walks upward from the artifact's directory (bounded at `REPO_ROOT`) looking for a `src/2_javascript` subdirectory.
- **No such project root exists anywhere in this monorepo.** `find <repo-root> -type d -name "2_javascript"` and a repo-wide `wrangler.toml` search both returned **zero matches** (live, 2026-07-11, Section 8). This is not merely "WEBFLOW's deterministic layer is thinner," as the plan's Risk register anticipated: for any WEBFLOW-surface artifact currently discoverable inside this monorepo's own scope, the deterministic layer is **presently unavailable**, not thin. The scripts are written for a *consumer* repo (a live Webflow-project checkout with `src/2_javascript/` at its root) this monorepo does not itself contain.

Given a project root **is** found (a future consumer-repo lane, not this repo's own tree today):

1. If the artifact sits under `<projectRoot>/src/2_javascript/` (a source file), run `verify-minification.mjs` with `cwd: projectRoot`, parse its per-file text block (Section 4.1.3) and look up this artifact's own entry.
2. If the artifact sits under `<projectRoot>/src/2_javascript/z_minified/` (an output file), run `test-minified-runtime.mjs` with `cwd: projectRoot` the same way.
3. A `FAIL` status from either script becomes a `P0` finding: both scripts' own summaries declare a hard block on `FAIL` ("⚠️ VERIFICATION FAILED - Do not deploy!" / "⚠️ RUNTIME TESTS FAILED - Do not deploy!"), the same "drives the wrapped tool's own hard block" logic behind the OPENCODE layer's `ERROR`→`P0` mapping (Section 7).
4. `SKIP` (no counterpart file yet) or `PASS`, or no entry at all for this artifact in the tool's own output, produces no finding.

Given **no** project root is found (the default case in this repo today), or the artifact is WEBFLOW-surface but outside `src/2_javascript/` entirely (e.g. CSS/HTML): a single `P1` `deterministic-layer-unavailable` finding, per NFR-R01's own required language: "the adapter falls back to reasoning-agent-only judgment for that artifact and marks the deterministic layer as `unavailable` rather than silently treating it as clean."

#### 4.1.3 Text-Output Parsing (both Webflow scripts)

Neither script has a `--json` flag (confirmed by reading both in full). Both print a fixed per-file block shape: a bare relative-path line, then indented `  ✓ ...` / `  ✗ ...` / `  ⊘ SKIP: ...` lines, then `  RESULT: PASS|FAIL`. `parseFileBlockOutput()` (shared by both, since the block grammar is identical) parses this directly, the same "translate the wrapped tool's own real text output" discipline `sk-code.cjs`'s `verify_alignment_drift.py` parser follows.

#### 4.1.4 Surface `UNKNOWN`

Per spec.md's Data Boundaries edge case, a `P1` `surface-undetected` finding: never a silent skip, never a guessed surface.

### 4.2 Layer 2 - Reasoning-Agent (Structurally Cannot Self-Judge)

Extracting "does this code follow the surface's architectural patterns" from an artifact and judging it against `code-webflow/references/implementation/*` or `code-opencode/references/shared/universal_patterns.md` is a reasoning act: no deterministic script can invent that judgment, and having `sk-code.cjs` try to perform it internally would be **a category error** (plan.md's own framing, ADR-008). This adapter's answer, matching the task's explicit design requirement, is two separate pieces:

1. **`buildReasoningLayerDispatch(artifact, rules)`**, exported, independently callable (`node sk-code.cjs reasoning-dispatch <path>`), builds the well-formed input package a reasoning agent needs: the artifact path, its detected `surface` and `motionDevOverlay` flag, the exact `standardSource()` reference paths to read for that surface (plus the Motion overlay directory when the flag is set), the four conformance dimensions layer 1 cannot check (`naming-conventions-beyond-regex`, `architectural-pattern-conformance`, `cross-file-consistency`, `comment-hygiene-beyond-simple-patterns`, named directly from plan.md's Architecture section) and the exact `expectedFindingShape` the caller must produce. **This function never judges anything itself.** It is documentation-as-code for a follow-on step, not a hidden judgment engine.
2. **`checkPatternConformance(artifact, options)`**: the actual layer-2 sub-check inside `check()`. Mirrors `sk-doc.cjs`'s `checkRealityAlignment()` exactly: accepts `options.verifiedFindings`, an array of already-judged `{dimension, claim, matchesStandard, evidence, severity}` records the caller (a future phase-008 ITERATE-state reasoning-agent dispatch step) produced by actually reading the artifact and the cited references. A finding is emitted **only** for entries where `matchesStandard === false` **and** `evidence` is present. No `verifiedFindings` supplied → no findings, never an invented one, the identical "no verifiedClaims → no findings" invariant `sk-doc_adapter.md` §4.2 documents for its own reality-alignment sub-check.

REQ-005's VERIFY-FIRST re-probe requirement is satisfied structurally: `verifiedFindings` are supplied at `check()`-call time (never at `discover()`-time or cached from a prior pass), so a caller that re-reads the live file immediately before calling `check()` automatically satisfies "re-checked against the current file content, not a cached discover-time snapshot."

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005, HARD REQUIREMENT)

No reasoning-layer finding is ever asserted without a cited `evidence` field (`checkPatternConformance()` drops any `verifiedFindings` entry missing one). No deterministic-layer finding is ever asserted without an actual, fresh subprocess run against the live artifact in the same `check()` call (REQ-005). It is never reused from `discover()` time or a prior iteration. This mirrors `sk_doc_adapter.md` §5's identical discipline, applied to a hybrid rather than fully-deterministic adapter.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005)

Every finding `check()` produces passes through `suppressKnownDeviations()` before being returned. The full seeded list, its structured evidence, and the machine-readable rule block `sk-code.cjs` actually parses live in [sk_code_known_deviations.md](./sk_code_known_deviations.md), not duplicated here. Unlike sk-doc's list, every current entry has `matchTypes: []`: the four `verify_alignment_drift.py`-native exemptions (context-advisory downgrade, test-heavy downgrade, TS pattern-asset skip, the one malformed-JSON fixture) are already reflected in that tool's own output before this adapter ever sees it, and the two adapter-specific entries (OPENCODE-precedence classification of Webflow-named tooling, Motion.dev peer-library references) are classification-outcome/reasoning-layer guidance, not finding-type suppressions. A suppression, when one is ever added, would only silence the matched deviation category on the matched artifact, never blanket-exempt the whole artifact from every other check (spec.md's Data Boundaries edge case).

---

## 7. SEVERITY MAPPING

| Source | Condition | Severity | `layer` |
|---|---|---|---|
| `verify_alignment_drift.py` | finding `severity === 'ERROR'` (drives the tool's own default exit-1 gate) | P0 | deterministic |
| `verify_alignment_drift.py` | finding `severity === 'WARN'` (present regardless of exit code, non-blocking by default) | P1 | deterministic |
| `verify_alignment_drift.py` | extension outside `SUPPORTED_EXTENSIONS` | P2 (`deterministic-layer-not-applicable`) | deterministic |
| `verify-minification.mjs` / `test-minified-runtime.mjs` | `FAIL` (drives the script's own "Do not deploy!" hard block) | P0 | deterministic |
| WEBFLOW surface, no project root or outside `src/2_javascript/` | n/a | P1 (`deterministic-layer-unavailable`) | deterministic |
| surface classification | `UNKNOWN` | P1 (`surface-undetected`) | deterministic |
| either subprocess | adapter-level failure (not an artifact defect) | P1 (`adapter-error`) | deterministic |
| reasoning-agent | caller-verified contradiction (`matchesStandard === false`, `evidence` present) | caller-supplied (default P2) | reasoning-agent |

The `ERROR`→P0 / `WARN`→P1 split mirrors `sk-doc.cjs`'s own `blocking_errors`→P0 / `warnings`→P1 structural analogy exactly: in both tools, the P0-mapped category is what independently drives *that tool's own* default exit/hard-fail behavior, and the P1-mapped category is present regardless of exit status. This is a faithful port of an existing pattern, not an invented third scale.

---

## 8. LIVE-REALITY FINDINGS (VERIFIED, NOT ASSUMED)

Building and dry-running this adapter against real repo files surfaced five genuine, load-bearing facts, exactly the class of grounded discovery `deep-alignment` exists to produce, found here by construction rather than invented for illustration. All commands below were run from the repo root on 2026-07-11.

### 8.1 The WEBFLOW deterministic layer has zero live project roots in this monorepo

```
$ find <repo-root> -type d -name "2_javascript" -not -path "*/node_modules/*"
(no output)
$ find <repo-root> -maxdepth 4 -iname "wrangler.toml" -not -path "*/node_modules/*"
(no output)
```

Confirms Section 4.1.2's claim directly: for any WEBFLOW-surface artifact this adapter can discover inside this repo's own scope, `checkWebflowDeterministic()` will report `deterministic-layer-unavailable`, not run a check. The script chain targets a consumer repo this monorepo does not itself contain.

### 8.2 sk-code's own Webflow-named tooling classifies OPENCODE, not WEBFLOW

```
$ node scripts/adapters/sk-code.cjs discover .opencode/skills/sk-code/code-webflow/assets/scripts
```
returned all three files (`minify-webflow.mjs`, `test-minified-runtime.mjs`, `verify-minification.mjs`) as `"surface": "OPENCODE"`, `"detectedFrom": "path"`, because they live under `.opencode/`, and `stack_detection.md`'s own Detection Order gives OPENCODE strict precedence, with a documented rationale (line 56) that names this exact scenario ("`.opencode/` system tools... may import vanilla animation libraries internally without being WEBFLOW-shipping artifacts"). Recorded as `sk_code_known_deviations.md` Section 6 so a reasoning-agent reviewer does not mistake this for a bug.

### 8.3 `minify-webflow.mjs` writes files (via a subprocess, not even a plain write); excluded from `check()`

Confirmed by reading the script: `minify_file()` (line 104) writes each `.min.js` output by shelling out to `execSync('npx terser ... -o <output_path>')`, and `save_manifest()` (line 157) calls `writeFileSync(MANIFEST_FILE, ...)`. Section 4.1.2 documents the exclusion. `standardSource()`'s `excludedFromCheck` records it machine-readably.

### 8.4 The deterministic OPENCODE layer is real, reproducible, and currently clean across this repo

Six live `verify_alignment_drift.py` dry-runs, increasing in corpus size, all returned `[alignment-drift] PASS` with zero findings:

| Root scanned | Files scanned | Findings |
|---|---|---|
| `deep-alignment/scripts` | 2 | 0 |
| `sk-code/code-opencode/assets/scripts` | 3 | 0 |
| `deep-review/scripts` | 7 | 0 |
| `runtime/scripts` | 14 | 0 |
| `sk-code` (whole skill) | 62 | 0 |
| `system-deep-loop` (whole hub) | 447 | 0 |

This is real, reproducible, deterministic behavior, not fabricated evidence of a violation. It is also informative on its own: either this repo's OPENCODE surface is already well-aligned to the tool's 12 mechanical rule types, or (more likely, per Section 9's estimate) those 12 rules check a narrow enough slice of "conformance" that a clean run here says little about the much larger reasoning-layer surface.

### 8.5 The MOTION_DEV content-marker regex has a real, reproducible false-positive mode

```
$ node scripts/adapters/sk-code.cjs check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs
```
(via `discover()`'s metadata, and independently via a direct regex test against this adapter's own source) reports `"motionDevOverlay": true`: not because the file calls a Motion.dev API, but because line 134 of its own source is a docstring quoting `smart_routing.md`'s keyword list: `// smart_routing.md's machine-readable MOTION_DEV keyword list ("animate()", ...)`. The literal text `animate(` matches `MOTION_DEV_CONTENT_MARKER_RE` regardless of context. This is a real, accepted limitation of a lightweight regex-based overlay signal. It detects *mentioning* the pattern, not *using* it. This is recorded in `sk_code_known_deviations.md` Section 7 rather than silently smoothed over or hidden by excluding the adapter's own source from the demonstration.

---

## 9. AUTOMATABILITY-LIMITS STATEMENT (REQ-002, HONEST - THE WHOLE POINT OF ADR-008)

**Deterministic today (layer 1):**
- **Surface classification** (`classifySurface()`): fully deterministic, a direct port of `stack_detection.md` §2's real Detection Order. Confirmed accurate against real repo files (Section 8.2), including a correct-but-surprising precedence outcome.
- **OPENCODE pattern-drift**: real and reproducible via `verify_alignment_drift.py`. Its coverage is **12 mechanical rule types** across 7 languages: shebang-line presence, a `'use strict'` pragma, a docstring marker, a `MODULE:` header marker, `set -euo pipefail`, JSON/JSONC parseability, CRLF/UTF-8 hygiene and two Rust boundary-safety greps. Every one of these is a **syntax-shape or boilerplate-presence** check: none of them reads for architectural correctness, the right abstraction, or whether an implementation actually follows `code-opencode/references/shared/universal_patterns.md` or any per-language `style_guide.md`/`quality_standards.md`'s actual prose guidance. Six-plus full reference documents per language describe what "OPENCODE conformance" really means in this hub's own routing (`smart_routing.md` §6). The 12 mechanical rules check a narrow, real, but genuinely small slice of that.
- **WEBFLOW pattern-drift**: real and reproducible **only when a Webflow project root exists in scope**. Presently zero such roots exist anywhere in this monorepo (Section 8.1), so this layer is not merely "thinner" than OPENCODE's (as the plan's Risk register anticipated) but **currently unavailable** for every WEBFLOW-surface artifact this adapter can discover here. It remains real, working code for a consumer repo that does carry a live `src/2_javascript/` tree.

**Reasoning-agent, not automated today (layer 2):**
- All four named dimensions (naming conventions beyond simple regex, architectural/pattern conformance, cross-file consistency, comment hygiene beyond simple patterns) are 100% reasoning-agent judgment. `sk-code.cjs` does not perform this judgment. It prepares the dispatch packet (`buildReasoningLayerDispatch()`) and accepts pre-verified results back (`checkPatternConformance()`'s `options.verifiedFindings`). This is the majority of what "does this code follow the surface's stack patterns" actually asks. The mechanical layer answers a real but narrow "is the boilerplate present and does it parse" question. The reasoning layer answers the "is this the right pattern" question, and today, only a human or LLM reasoning agent can answer that.

**Honest fraction**: of the full conformance question, the deterministic layer's real, working coverage is a **minority slice restricted to mechanical hygiene** (12 OPENCODE rule types, WEBFLOW's real scripts gated on a project-root precondition presently unmet in this repo). The reasoning-agent layer covers everything else: the substantive "architectural/pattern conformance" the surface's own reference material (`code-webflow/references/implementation/*`, `code-opencode/references/shared/*`) actually prescribes. This is not a hedge. It is the concrete answer ADR-008 asked this phase to produce, and it is why every finding is layer-tagged rather than presented as one undifferentiated "conformance check."

---

## 10. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-code.cjs` implements every function this document specifies: `discover(scope)`, `standardSource(authority)`, `check(artifact, rules, options)`, plus `classifySurface`, `detectMotionDevOverlay`, the three subprocess wrappers, `buildReasoningLayerDispatch` and the suppression matcher. It exposes a CLI (`discover`, `check`, `standard-source`, `reasoning-dispatch` subcommands) for a manual dry-run without any engine wiring. Every command and output shown in Section 8 above is real, reproducible output from that CLI. `node --check scripts/adapters/sk-code.cjs` passes.

---

## 11. REFERENCES AND RELATED RESOURCES

- [sk_code_known_deviations.md](./sk_code_known_deviations.md): the structured, evidence-cited suppression list.
- [sk-code.cjs](../../scripts/adapters/sk-code.cjs): the executable reference implementation.
- [sk_doc_adapter.md](./sk_doc_adapter.md), [sk-doc.cjs](../../scripts/adapters/sk-doc.cjs): the reference adapter (phase 005) this file's shape and this script's structure both copy.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-004`, `adr-005`, `adr-008`): the contract, sequencing rationale, alignment invariants and the HYBRID lock this adapter implements.
- `../discover_contract.md`, `../lane_config_schema.md`: the real, live `discover(scope)->artifacts` contract this adapter's `discover()` conforms to.
- `.opencode/skills/sk-code/shared/references/stack_detection.md`, `smart_routing.md`: the shared surface router this adapter reuses (REQ-001), never reimplements.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real OPENCODE deterministic checker.
- `.opencode/skills/sk-code/code-webflow/assets/scripts/{verify-minification.mjs,test-minified-runtime.mjs,minify-webflow.mjs}`: the real WEBFLOW scripts (the third excluded from `check()`, Section 4.1.2).

codex
The current packet already has lane tuples and fresh re-probes, but two gaps stand out: authorities are still returned as loose `{templates, rules}` paths rather than compiled, versioned rule capsules, and suppressions lack lifecycle semantics such as expiry, authority epoch, and witness replay. I’m testing four adjacent implementation patterns against those gaps: typed policy compilation, evidence verification, resolution registries, and breaking-change analysis.
web search: 
web search: site:github.com/google/cel-go GitHub cel-go checker interpreter release ...
web search: 
web search: https://api.github.com/repos/google/cel-go
web search: 
web search: google/cel-go GitHub "stars" ...
web search: 
web search: site:github.com/google/cel-go/blob master cel/env.go Compile Program AstToCheckedExpr ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:github.com/bufbuild/buf/tree/main/private/bufpkg/bufcheck/bufbreaking ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'func (e *Env) Compile'
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:github.com/sigstore/cosign/blob/main/cmd/cosign/cli/verify verify_attestation.go ...
web search: 
web search: site:buf.build/docs/breaking "FILE" "PACKAGE" "WIRE_JSON" "WIRE" ...
web search: 
web search: site:arxiv.org natural language requirements formal specification LLM rule compilation 2025 GitHub ...
web search: 
web search: "Natural-Language Policies to Executable Decisions" ACL 2026 ...
web search: 
web search: 'condition tree'
hook: PreCompact
hook: PreCompact
hook: PreCompact Completed
hook: PreCompact Failed
context compacted
codex
Deep-alignment should become a versioned authority compiler and temporal conformance ledger. A linter answers whether today’s artifact passes today’s hard-coded rules. Deep-alignment should determine whether a result remains valid after the authority, verifier, artifact, or environment changes—and identify which change caused the delta.

### 1. Compile authority into tested rule capsules

The current `standardSource()` abstraction identifies source files but does not establish that prose was translated faithfully. Add an explicit compilation boundary:

`authority text → structured rule IR → executable predicates → mutation-tested capsule → authorized publication`

A rule capsule should contain:

- Authority URI, edition, digest, and precedence metadata.
- Stable rule IDs tied to exact source spans and quote hashes.
- Modality: `must`, `should`, `may`, or `prohibited`.
- Applicability and assertion expressions.
- Required observations and an explicit absence-proof policy.
- Severity, exceptions, and cross-authority dependencies.
- Positive, negative, and `unknown` witnesses.
- Compiler identity/version and publication status: `draft`, `validated`, or `approved`.

The strongest reference pattern is the strict hybrid boundary in the ACL 2026 policy-compilation paper: an LLM extracts structured condition trees, while deterministic validators check schema completeness, units, conflicts, numeric constraints, and grounded service names; invalid trees are not published. [Req2LTL](https://arxiv.org/abs/2512.17334) independently supports hierarchical intermediate representations plus deterministic synthesis rather than direct prose-to-rule prompting. [ACL paper](https://aclanthology.org/2026.acl-industry.114/)

[CEL](https://cel.dev/overview/cel-overview) is a useful execution substrate: rules are parsed and type-checked before repeated evaluation, retain source diagnostics, support cost estimation, and can produce residual expressions when inputs are unknown. The transfer is an inference: CEL validates the executable rule, not whether it faithfully represents the prose. Capsule witnesses and authorized publication must close that semantic gap. Relevant implementation surfaces are [`Env.Compile`, `Program`, and `ResidualAst`](https://github.com/cel-expr/cel-go/blob/master/cel/env.go) plus evaluation-state and cost tracking in [`program.go`](https://github.com/cel-expr/cel-go/blob/master/cel/program.go).

Every capsule should undergo five authority mutations already identified by the open thread: delete, weaken, invert, narrow, and exception-wrap. Publication fails unless capsule tests or historical witnesses detect the expected semantic change.

### 2. Make evidence and suppression separate append-only facts

A verify-first finding should require an evidence receipt binding:

`artifact digest + rule ID + capsule digest + verifier identity/version + input digest + observation time + result + evidence references + missing facts`

The result should be one of `conform`, `nonconform`, or `inconclusive`. Missing or stale evidence is not conformity. For absence claims, the capsule selects a policy such as deterministic coverage proof, independent observations, or explicit abstention.

This mirrors the useful binding properties of [Cosign verification](https://docs.sigstore.dev/cosign/verifying/verify/): the decision is tied to an artifact digest, signature material, signer constraints, and transparency evidence—not merely a textual claim that verification happened.

Known deviations should never erase raw findings. [ORT resolutions](https://oss-review-toolkit.org/ort/docs/configuration/resolutions) provide the key precedent: resolutions influence reporting while analyzer and scanner evidence remains intact. Deep-alignment should strengthen ORT’s message-regex matching with semantic deviation records:

- `authority_rule_id`
- `applicability_fingerprint`
- `subject_selector`
- `authority_compatibility_range`
- `reason_code`, approver, and evidence
- Creation and expiry times
- Revalidation triggers for authority, verifier, artifact identity, and environment changes

The matcher returns `EXACT`, `MIGRATABLE`, `STALE`, or `AMBIGUOUS`. Only `EXACT` suppresses automatically. `MIGRATABLE` requires witness replay; the others reopen the finding.

### 3. Treat authority drift as an impact-analysis problem

[Buf’s breaking-change system](https://buf.build/docs/breaking/rules/) demonstrates that compatibility is multidimensional: file/source compatibility, package compatibility, wire-plus-JSON compatibility, and wire compatibility can disagree. Its rule infrastructure also associates checks with plugin and policy identities, while configuration supports scoped exceptions. [Configuration](https://buf.build/docs/configuration/v2/buf-yaml/) and [`rule.go`](https://github.com/bufbuild/buf/blob/main/private/bufpkg/bufcheck/rule.go) provide concrete reference surfaces.

Deep-alignment should therefore distinguish:

- `logicalLaneId = H(authority, artifactClass, normalizedScope)`
- `laneEpochId = H(logicalLaneId, capsuleDigest, verifierVersion, environmentProfile)`

When authority changes, compare old and new capsules and classify each rule as `ADD`, `REMOVE`, `STRENGTHEN`, `WEAKEN`, `SCOPE_SHIFT`, `EVIDENCE_CHANGE`, `SEVERITY_CHANGE`, or `UNKNOWN_SEMANTIC`. Construct a dependency graph from changed rules to required observations and matching artifacts. Fan out only affected components; replay their witnesses and deviations; fan in while preserving cross-authority conflicts and `INCONCLUSIVE` results.

Append continuity events such as `authority_capsule_published`, `rule_changed`, `evidence_observed`, `finding_asserted`, `deviation_adjudicated`, `suppression_applied`, and `comparison_invalidated`. Useful gauges become authority-change blast radius, comparable-pass rate, stale deviations, witness-replay failures, missing-observation rate, and suppression leakage.

### Unique-value thesis

The moat is longitudinal attribution. Deep-alignment can answer:

- Did the artifact drift, or did the authority change underneath it?
- Which previous passes remain comparable under the new edition?
- Which accepted deviations became stale, and why?
- Would this artifact pass under the previous authority?
- What evidence justified each finding at that historical epoch?

A linter has a fixed executable ruleset and normally reports only the current scan. A one-shot prompt lacks governed compilation, historical witnesses, evidence freshness, exception lifecycle, and replayable continuity. The other deep modes discover information, review correctness, deliberate among perspectives, or propose improvements; deep-alignment alone should maintain a binding, edition-aware conformance ledger.

```json
{
  "new_repos": [
    {
      "name": "cel-expr/cel-go",
      "url": "https://github.com/cel-expr/cel-go",
      "stars": "~3k",
      "what": "Typed, non-Turing-complete expression engine with source diagnostics, residual unknown expressions, and cost tracking; v0.29.2 released 2026-07-08.",
      "lesson": "Compile authority rules into checked, source-linked executable predicates while retaining unknown inputs instead of forcing pass/fail.",
      "maps_to": [
        "deep-alignment",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "bufbuild/buf",
      "url": "https://github.com/bufbuild/buf",
      "stars": "~11.3k",
      "what": "Schema compatibility engine with several breaking-change categories, scoped policies, exceptions, and a large compatibility corpus; v1.71.0 released 2026-06-16.",
      "lesson": "Represent authority drift with explicit compatibility classes and replay only rules and artifacts affected by the changed contract.",
      "maps_to": [
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "name": "oss-review-toolkit/ort",
      "url": "https://github.com/oss-review-toolkit/ort",
      "stars": "~2k",
      "what": "Policy evaluator with typed resolutions kept separate from analyzer and scanner evidence; release 91.0.1 published 2026-07-09.",
      "lesson": "Apply known deviations as an adjudication overlay without deleting the raw finding or observation history.",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "sigstore/cosign",
      "url": "https://github.com/sigstore/cosign",
      "stars": "~6.1k",
      "what": "Artifact verification binds digests, signer identity, certificates, signatures, and transparency evidence; v3.1.1 released 2026-06-09.",
      "lesson": "Make every conformance assertion depend on a receipt binding subject, authority epoch, verifier version, and evidence inputs.",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Authority compilation needs a governed intermediate representation: LLM extraction may propose rule trees, but deterministic validation, witnesses, source spans, and authorized publication must gate execution.",
      "evidence": "https://aclanthology.org/2026.acl-industry.114/ ; https://arxiv.org/abs/2512.17334",
      "maps_to": [
        "deep-alignment",
        "runtime/continuity-threading"
      ],
      "confidence": "med"
    },
    {
      "insight": "Residual executable expressions provide a concrete absence-proof mechanism: unresolved required observations can remain explicit and yield INCONCLUSIVE instead of false conformity.",
      "evidence": "https://github.com/cel-expr/cel-go/blob/master/cel/env.go",
      "maps_to": [
        "deep-alignment",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Suppression is a new adjudication fact, not a destructive rewrite of the original finding; authority or verifier changes can then reactivate it deterministically.",
      "evidence": "https://oss-review-toolkit.org/ort/docs/configuration/resolutions",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Cross-epoch conformance requires compatibility classes rather than one global pass/fail bit because the same change may preserve one contract while breaking another.",
      "evidence": "https://buf.build/docs/breaking/rules/",
      "maps_to": [
        "deep-alignment",
        "runtime/convergence",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evidence receipts should be content-bound and freshness-aware so resume can distinguish verified observations from stale, missing, or unverifiable claims.",
      "evidence": "https://docs.sigstore.dev/cosign/verifying/verify/",
      "maps_to": [
        "deep-alignment",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add an Authority Capsule Compiler that emits stable rule IDs, source spans, typed applicability and assertion expressions, evidence policies, exceptions, witnesses, and a capsule digest; require static validation plus delete, weaken, invert, narrow, and exception-wrap mutation tests before publication.",
      "target": "deep-alignment",
      "rationale": "This closes the unverified semantic gap between an authority document and executable checks, while making authority changes diffable and replayable.",
      "uniqueness": "It turns deep-alignment from a rule runner into a governed compiler for evolving normative authority, a capability absent from ordinary linters and one-shot prompts.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://aclanthology.org/2026.acl-industry.114/ ; https://github.com/cel-expr/cel-go"
    },
    {
      "rec": "Require content-bound EvidenceReceipt events for findings and represent deviations as append-only adjudication records with expiry, authority compatibility ranges, verifier-version triggers, and EXACT/MIGRATABLE/STALE/AMBIGUOUS matching.",
      "target": "deep-alignment + runtime/state-jsonl-checkpointing",
      "rationale": "Raw observations remain auditable, stale suppressions reopen automatically, and absence or verifier failure cannot silently become conformity.",
      "uniqueness": "The resulting conformance ledger can explain exactly why a historical finding was active or suppressed at any authority epoch.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://oss-review-toolkit.org/ort/docs/configuration/resolutions ; https://docs.sigstore.dev/cosign/verifying/verify/"
    },
    {
      "rec": "Separate stable logical lane IDs from epoch-specific lane IDs, classify authority diffs by compatibility type, construct rule-to-observation-to-artifact impact components, and replay only affected witnesses, deviations, and artifacts.",
      "target": "deep-alignment + runtime/fan-out-fan-in + runtime/continuity-threading",
      "rationale": "This gives authority upgrades deterministic blast-radius analysis without paying for a full audit or claiming false comparability across editions.",
      "uniqueness": "It enables counterfactual and longitudinal answers such as whether a failure came from artifact drift, authority drift, verifier drift, or environment drift.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://buf.build/docs/breaking/rules/ ; https://github.com/bufbuild/buf/blob/main/private/bufpkg/bufcheck/rule.go"
    }
  ],
  "contradictions": [
    {
      "claim": "A known deviation should remove or suppress a finding before it reaches persistent state.",
      "counter": "ORT applies resolutions only during reporting while retaining analyzer and scanner evidence; deep-alignment should likewise append adjudication without deleting the raw fact.",
      "evidence": "https://oss-review-toolkit.org/ort/docs/configuration/resolutions"
    },
    {
      "claim": "Conformance results remain comparable whenever the artifact itself has not changed.",
      "counter": "Buf exposes several distinct compatibility contracts, showing that an authority change can preserve one dimension while invalidating another; unchanged artifacts may therefore require reclassification or replay.",
      "evidence": "https://buf.build/docs/breaking/rules/"
    },
    {
      "claim": "A parsed and type-checked executable rule is sufficient evidence that natural-language authority was compiled correctly.",
      "counter": "CEL can establish executable validity, but the policy-compilation evidence requires grounding, conflict checks, witnesses, and human correction or approval to establish semantic fidelity.",
      "evidence": "https://cel.dev/overview/cel-overview ; https://aclanthology.org/2026.acl-industry.114/"
    }
  ],
  "next_angles": [
    "Build the authority-capsule amendment protocol: authorized publishers, evidence required to invalidate a rule, compatibility classifications, and cross-epoch comparison rules.",
    "Implement the five-operator authority mutation benchmark and score semantic mutation detection, witness sensitivity, false invalidation, and human-review load.",
    "Create a deviation-key migration benchmark covering authority upgrades, semantic rewrites, artifact moves, verifier upgrades, and environment drift, measuring suppression leakage and unnecessary reactivation."
  ],
  "notes": "No retrieved repository provides the complete end-to-end combination of prose-authority compilation, authorized capsule publication, evidence-bound conformance, deviation lifecycle, and cross-epoch replay. The ACL policy system's production implementation was not verified as open source, so its architectural transfer is supported by the paper rather than inspectable code. Star counts are approximate GitHub figures observed around 2026-07-15."
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
294,128
