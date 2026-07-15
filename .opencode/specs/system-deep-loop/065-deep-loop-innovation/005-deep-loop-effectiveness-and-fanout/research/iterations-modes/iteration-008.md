<!-- iteration 8 | SOL xhigh | mode: deep-review | angle: A3-mech deep-review :: mechanisms & reference impls | 2026-07-15T08:40:09.688Z -->

Deep-review’s moat should be “proof-carrying longitudinal review,” not merely more review passes. A material finding should retain identity across revisions, survive active falsification, and eventually carry an immutable fix-verification receipt.

The current design is already close: nine legal-stop gates, typed P0/P1 adjudication, cross-pass state, and security-sensitive fix replay. Three weaknesses remain:

- The reducer’s primary identity is an agent-supplied hash incorporating file, line, type, and description; its fallback is also line-based ([reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:748)). That is brittle under line movement and paraphrase.
- Claim adjudication validates that the reviewer described counterevidence, not that independent refuters actually ran ([state_format.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md:409)).
- Coverage records whether four broad dimensions were visited, rather than whether risk-specific cells reached sufficient evidence depth ([review_mode_contract.yaml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:60)).

### 1. Replace self-adjudication with a deterministic-first refutation cascade

Use this order:

1. Schema, diff-scope, compilation, type, lint, and existing tests.
2. Diff-filtered static results from SARIF, Semgrep, CodeQL, or stack-native analyzers.
3. Claim-specific execution: reproducer, property test, sanitizer, or targeted mutation.
4. LLM judge only for the unresolved semantic residual.
5. Independent refuters for proposed P0/P1 findings.

This is implementable rather than aspirational. Reviewdog’s `filter.FilterCheck` preserves every diagnostic while separately recording `ShouldReport`, diff-file membership, diff-context membership, source lines, and old positions—exactly the separation deep-review needs between “detected” and “relevant to this change” ([source](https://github.com/reviewdog/reviewdog/blob/master/filter/filter.go)). Semgrep’s newer Workflows explicitly combine deterministic scanners, custom validation, and LLM-backed analysis ([docs](https://semgrep.dev/docs/workflows/overview)); Promptfoo already exposes deterministic assertions and model-graded assertions through one result shape ([docs](https://www.promptfoo.dev/docs/configuration/expected-outputs/)).

Each attempt should append a `verification_attempt` JSONL event containing `findingId`, `verifierKind`, `independenceClass`, `tool/version`, `commandDigest`, `targetRevision`, `sourceTreeDigest`, `harnessDigest`, `outcome=supports|refutes|inconclusive`, and artifact hashes.

“Refute-by-N” should count independent evidence classes, not agents. Fresh context using the same model is weaker than a different tool family; an executable positive-control test is stronger than either. A reasonable P0 policy is one executable support plus one independent structural analysis. Two independent refutations, including at least one executable or symbolic refutation, move the finding to `rebutted`; conflicting strong evidence moves it to `contested`, never silently resolved.

The recent CASCADE paper supplies a useful two-sided control: it reports a documentation inconsistency only when a generated test fails on real code and passes on documentation-derived code. On its reported real-repository run, 10 of 13 newly found inconsistencies were subsequently fixed ([paper](https://arxiv.org/abs/2604.19400)). Deep-review should generalize that into “candidate fails, positive control passes”—where the positive control can be the base revision, a specification-derived oracle, or a known-good reference.

Generated verifiers must run outside the reviewed tree, with the target mounted read-only and command/harness/source digests recorded. Otherwise an agent can manufacture green evidence by weakening tests or commands.

Useful gauges: `deterministic_elimination_rate`, `judge_escalation_rate`, attempts by independence class, `contested_findings`, refutation budget remaining, and executable-support coverage by severity.

### 2. Move finding identity into the reducer and version it

OASIS SARIF explicitly warns against absolute line numbers in fingerprints and supports versioned partial fingerprints plus `new|unchanged|updated|absent` baseline states ([spec](https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html)). CodeQL Action’s concrete implementation hashes a rolling window of 100 non-whitespace characters, normalizes line endings, and disambiguates repeated context hashes ([fingerprints.ts](https://github.com/github/codeql-action/blob/main/src/fingerprints.ts)).

Deep-review should adopt a reducer-owned matching cascade:

1. Exact prior durable ID.
2. `rule/claim-class + symbol FQN + normalized AST/program-slice hash`.
3. Rename-aware path plus rolling context hash.
4. Source/sink or invariant endpoints plus root-cause class.
5. Ambiguous candidate linkage requiring adjudication—never automatic merge.

Store versioned components such as `symbolContext/v1`, `sliceHash/v1`, and `rollingContext/v1`, allowing algorithms to evolve without losing continuity. The iteration agent may provide partial identity hints, but the reducer must assign the durable identity. Microsoft’s current AI-SARIF guidance makes the same ownership distinction: AI producers should not persist final fingerprints; result management owns cross-run identity ([guidance](https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md)).

Expand lifecycle dispositions to `fixed`, `rebutted`, `accepted-risk`, `superseded`, `workflow-rejected`, and `absent-unverified`. Suppressions should carry the relevant symbol/slice/dependency fingerprint and automatically expire when that dependency set changes.

Useful gauges: ambiguous-match rate, merges and splits, findings reborn after suppression, suppression invalidations, and baseline-state transitions.

### 3. Make coverage evidence-deep and fix verification regression-backed

Keep the four public dimensions stable, but add dynamically required cells beneath them. Examples:

- Auth/input changes require security × trust-boundary and negative-path cells.
- Locks, queues, or async state require correctness × concurrency.
- Public schema/API changes require traceability × compatibility.
- Test changes require correctness × test-quality and mutation-survival cells.

Cell states should be `not-applicable`, `unexamined`, `deterministic-checked`, `judge-reviewed`, `executably-verified`, or `blocked`. “Covered” means every risk-triggered cell reached its required depth, not that a reviewer visited its parent dimension.

Severity must also become orthogonal to confidence. Microsoft’s AI-SARIF profile separates `level` from confidence-like `rank`, and adds exploitability plus structured evidence `{strength, scope, backing[]}` ([guidance](https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md)). Deep-review can preserve P0/P1/P2 as impact while separately recording `confidence`, `reachability`, `evidenceStrength`, and `evidenceScope`.

For reruns after remediation, require:

- The prior reproducer fails before the fix and passes after it.
- The pinned baseline verification suite remains non-regressive.
- Relevant mutation survivors are killed or explicitly adjudicated.
- Commands, harness, source revision, and outputs are hash-addressed.

PIT provides mutation, coverage, and test-strength thresholds plus history-backed incremental analysis ([Maven reference](https://pitest.org/quickstart/maven/)). Its own documentation warns that cached mutation outcomes can become wrong when dependencies change, so deep-review should invalidate caches from the finding’s dependency slice rather than changed-line overlap alone ([incremental-analysis warning](https://pitest.org/quickstart/incremental_analysis/)).

This sharpens the unique value: single-shot reviewers produce comments; linters produce detections; other deep modes produce research, deliberation, improvement candidates, or conformance judgments. Deep-review alone can remain read-only while maintaining a revision-spanning ledger of what was alleged, how it was independently challenged, what changed, and whether the original failure is now demonstrably gone.

```json
{
  "new_repos": [
    {
      "name": "reviewdog/reviewdog",
      "url": "https://github.com/reviewdog/reviewdog",
      "stars": "~9.5k",
      "what": "Language-agnostic review diagnostic router; latest tagged release observed v0.21.0 in September 2025.",
      "lesson": "Preserve all deterministic diagnostics but separately track diff relevance, source context, and reportability before escalating residuals to judges.",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "github/codeql-action",
      "url": "https://github.com/github/codeql-action",
      "stars": "~1.6k",
      "what": "CodeQL analysis and SARIF upload implementation; CodeQL Bundle v2.26.0 released July 8, 2026.",
      "lesson": "Use normalized rolling source-context fingerprints and occurrence disambiguation instead of absolute lines for cross-revision finding identity.",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "microsoft/sarif-sdk",
      "url": "https://github.com/microsoft/sarif-sdk",
      "stars": "~223",
      "what": "SARIF object model, validation tooling, and recent AI-finding profile; v4.6.5 released May 18, 2026.",
      "lesson": "Separate severity, confidence, exploitability, evidence strength and scope; assign durable fingerprints in the reducer rather than the AI producer.",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/gauges-observability", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "hcoles/pitest",
      "url": "https://github.com/hcoles/pitest",
      "stars": "~1.8k",
      "what": "JVM mutation-testing and verification system; v1.25.7 released July 8, 2026.",
      "lesson": "Turn accepted findings into mutation or reproduction obligations and gate later fixes on pre-fix failure, post-fix success, and non-regressing test strength.",
      "maps_to": ["deep-review", "runtime/convergence", "runtime/gauges-observability", "runtime/budget-cost"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "The judge should see only the semantic residual left after schema, build, test, diff-filtered static analysis, and claim-specific executable checks; deterministic failures and eliminations remain first-class receipts.",
      "evidence": "https://github.com/reviewdog/reviewdog/blob/master/filter/filter.go ; https://semgrep.dev/docs/workflows/overview ; https://www.promptfoo.dev/docs/configuration/expected-outputs/",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Refute-by-N must count independent evidence classes rather than repeated LLM votes; require a two-sided executable control so a malformed generated reproducer cannot confirm its own finding.",
      "evidence": "https://arxiv.org/abs/2604.19400",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/convergence", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Cross-pass finding identity should use versioned partial fingerprints based on symbols, normalized source context, program slices, and rename mapping; baseline state should distinguish new, updated, unchanged, and absent.",
      "evidence": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html ; https://github.com/github/codeql-action/blob/main/src/fingerprints.ts",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "insight": "P0/P1/P2 should remain an impact axis while confidence, reachability, exploitability, evidence strength, and evidence scope are recorded independently; otherwise repeated judge agreement can incorrectly inflate severity.",
      "evidence": "https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md",
      "maps_to": ["deep-review", "runtime/gauges-observability", "runtime/convergence"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add reducer-validated verification_attempt JSONL events and a refute-by-independent-class policy. Run deterministic checks first, require two-sided executable controls for generated reproducers, and classify unresolved support/refutation conflicts as contested.",
      "target": "deep-review + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing + runtime/gauges-observability",
      "rationale": "The current adjudication gate validates packet completeness and self-reported counterevidence, not whether independent falsification actually occurred.",
      "uniqueness": "Creates a longitudinal proof ledger that single-shot reviewers, static linters, research loops, and planning councils do not maintain.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2604.19400 ; https://semgrep.dev/docs/workflows/overview"
    },
    {
      "rec": "Replace the line-and-description content hash with reducer-owned, versioned partial fingerprints and a confidence-ordered matching cascade; add explicit baseline states and longitudinal dispositions, and invalidate suppressions from symbol, program-slice, and dependency fingerprints.",
      "target": "deep-review + runtime/dedup-novelty + runtime/state-jsonl-checkpointing + runtime/continuity-threading",
      "rationale": "Line movement, renames, and paraphrased descriptions currently create duplicate findings or unsafe merges, weakening both convergence math and historical suppression.",
      "uniqueness": "Lets deep-review reason about one defect across many passes and patch revisions instead of generating stateless comments per commit.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html ; https://github.com/github/codeql-action/blob/main/src/fingerprints.ts"
    },
    {
      "rec": "Introduce risk-triggered coverage cells with evidence-depth states, orthogonal severity/confidence/exploitability fields, and immutable regression receipts requiring pre-fix failure, post-fix success, baseline non-regression, and targeted mutation-survivor adjudication.",
      "target": "deep-review + runtime/convergence + runtime/gauges-observability + runtime/budget-cost",
      "rationale": "A boolean dimension visit cannot distinguish cursory inspection from executable verification, while a green post-fix test alone does not prove that the test detects the original defect.",
      "uniqueness": "Turns review convergence into release-readiness evidence accumulated across remediation cycles, which is outside the contract of single-shot reviewers and the other read-only deep modes.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md ; https://pitest.org/quickstart/maven/"
    }
  ],
  "contradictions": [
    {
      "claim": "File path plus absolute line range is a suitable primary cross-pass finding identity.",
      "counter": "SARIF explicitly warns that absolute line numbers destabilize fingerprints after unrelated insertions; location should be supplemented by stable semantic and contextual components.",
      "evidence": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html"
    },
    {
      "claim": "Fresh-context repetition by the same reviewer is sufficient adversarial verification.",
      "counter": "Fresh context reduces anchoring but does not create tool or evidence independence; CASCADE's false-positive control comes from complementary executions with opposite expected outcomes.",
      "evidence": "https://arxiv.org/abs/2604.19400"
    },
    {
      "claim": "Incremental mutation history can be reused whenever the directly mutated file is unchanged.",
      "counter": "PIT warns that dependency changes can alter behavior without changing the mutated class and that several history optimizations introduce possible error.",
      "evidence": "https://pitest.org/quickstart/incremental_analysis/"
    }
  ],
  "next_angles": [
    "Benchmark the evidence-independence taxonomy on longitudinal review histories: accepted, rebutted, ignored-risk, superseded, workflow-rejected, and later-regressed findings.",
    "Specify suppression invalidation from program slices, symbol identities, dependency manifests, build flags, and verifier-command digests, then measure false carry-forward versus line-overlap invalidation.",
    "Mine changed-code features and historical misses to learn mandatory concurrency, compatibility, security, and test-quality coverage cells and their minimum evidence depth."
  ],
  "notes": "The CASCADE paper was verifiable, but no public implementation repository was located, so it is evidence only and not listed as a new repo. Cascade's commercial evaluator documentation exposes code and LLM scorer types, but I could not verify a corresponding public reference implementation. The proposed thresholds and independence policy still need calibration against system-deep-loop's own accepted/rebutted finding history."
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
session id: 019f64ea-0e6d-79a1-aa78-172277ea7de1
--------
user
You are iteration 8/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-review
MODE IDENTITY (what it does today): Autonomous iterative code-review loop: externalized state, convergence detection, P0/P1/P2 findings, adversarial verify, fresh context per pass, review-report.md.
GENERIC ALTERNATIVE it must out-value: a single-shot LLM PR reviewer (CodeRabbit, Greptile, Cursor Bugbot) or a static linter

THIS ITERATION'S ANGLE (A3-mech): deep-review :: mechanisms & reference impls
DIRECTIVE: Concrete reference impls for deep-review: cheap-deterministic-checks-before-judges cascades, adversarial finding verification (refute-by-N), cross-pass finding dedup, severity calibration, coverage/dimension tracking, regression-gated fix verification. Real repos (promptfoo, semgrep, oss-fuzz, CascadeEvaluator) + code. Actionable designs for deep-review + runtime/gauges-observability.

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
THIS run's new repos so far (23) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js
Modes covered so far this run: deep-research | deep-review
New insights so far: 25; recommendations: 18.
Open threads flagged: Build an immutable-verifier threat model so a generated reproduction cannot overwrite tests, weaken commands, or otherwise manufacture a green proof receipt. | Study longitudinal review datasets that distinguish fixed, rebutted, ignored, superseded, and workflow-rejected findings instead of treating every unaccepted comment as a false positive. | Design and benchmark an evidence-independence taxonomy: same prompt, changed prompt, fresh context, different model family, different tool family, executable test, symbolic proof, and human confirmation. | Mine review histories for dimension-specific miss rates and use them to learn which changed-code features make security, concurrency, compatibility, or test-quality cells mandatory. | Evaluate whether mutation survivors and generated reproducers predict accepted review findings better than LLM confidence, reviewer agreement, or static severity labels. | Specify suppression invalidation using program slices and dependency fingerprints rather than line overlap alone.

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
I’m treating this as read-only research, so the spec-folder write gate does not apply. I’m loading the named deep-review workflow first, then I’ll verify implementation-level mechanisms and current repository signals from primary sources.
exec
/bin/zsh -lc "node ../../../../../../bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"Iteration 8/40 research for system-deep-loop deep-review mechanisms and reference implementations; read-only web research; concrete cheap-check cascades, adversarial verification, finding dedup, severity calibration, coverage tracking, and regression-gated verification.\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 exited 1 in 0ms:
node:internal/modules/cjs/loader:1433
  throw err;
  ^

Error: Cannot find module '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/bin/skill-advisor.cjs'
    at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
    at Function._load (node:internal/modules/cjs/loader:1216:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v22.23.1

exec
/bin/zsh -lc "node ../../../../../bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"Iteration 8/40 research for system-deep-loop deep-review mechanisms and reference implementations; read-only web research; concrete cheap-check cascades, adversarial verification, finding dedup, severity calibration, coverage tracking, and regression-gated verification.\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 exited 75 in 0ms:
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-skill-advisor/daemon-ipc.sock",
  "exitCode": 75
}

exec
/bin/zsh -lc "python3 ../../../../../skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py 'Iteration 8/40 research for system-deep-loop deep-review mechanisms and reference implementations; read-only web research; concrete cheap-check cascades, adversarial verification, finding dedup, severity calibration, coverage tracking, and regression-gated verification.' --threshold 0.8" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 3156ms:
2026-07-15 10:35:18.781 xcodebuild[23562:206958602]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 10:35:19.021 xcodebuild[23562:206958600] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-8uyjnqtg' (errno=Operation not permitted)
2026-07-15 10:35:19.494 xcodebuild[23575:206958675]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-07-15 10:35:19.604 xcodebuild[23575:206958674] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
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
    "source": "local"
  },
  {
    "skill": "sk-code",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !regression, !review, !review(multi), !verification [disambiguation: deep-review reserved for this prompt]",
    "_graph_boost_count": 0,
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
SKILL ROUTING: `system-deep-loop` (0.95, mode `review`) is mandatory; `sk-code` is advisory here because this is research, not a code change. The advisor’s daemon was unavailable, so I used its documented local scorer fallback.
exec
/bin/zsh -lc "wc -l ../../../../../skills/system-deep-loop/SKILL.md && sed -n '1,260p' ../../../../../skills/system-deep-loop/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
     154 ../../../../../skills/system-deep-loop/SKILL.md
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
/bin/zsh -lc "sed -n '1,240p' ../../../../../skills/system-deep-loop/mode-registry.json && wc -l ../../../../../skills/system-deep-loop/deep-review/SKILL.md && sed -n '1,280p' ../../../../../skills/system-deep-loop/deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
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
     442 ../../../../../skills/system-deep-loop/deep-review/SKILL.md
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


exec
/bin/zsh -lc "sed -n '281,520p' ../../../../../skills/system-deep-loop/deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
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
The mode packet confirms a useful boundary: deep-review already has content-hash dedup, dimension gates, adversarial P0 replay, and strict verdict locking. I’m checking their exact implementation now so the recommendations extend those mechanisms instead of renaming existing features.
exec
/bin/zsh -lc "sed -n '1,260p' ../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md && rg -n \"dedup|content_hash|fingerprint|adversarial|refut|severity|dimension|coverage|regression|fix|verif|riskScore|finding\" ../../../../../skills/system-deep-loop/deep-review/{scripts,references,assets} ../../../../../skills/system-deep-loop/runtime/scripts --glob '*.{md,cjs,json,yaml}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
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
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:3:description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:6:  - "review dimension tracking"
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:22:Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:27:- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:30:- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:61:[None yet -- populated as iterations complete dimension reviews]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:77:[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:95:[Populated when a review approach has been tried from multiple angles without yielding new findings]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:104:- Prefer for: [related dimensions where this category may help]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:128:[Recommended focus area for the next iteration -- updated at end of each iteration. Includes target dimension and/or specific files to review.]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:138:Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:141:- Behavior claims: acceptance criteria, public contracts, or docs to verify.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:145:Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:167:[Per-file coverage state table -- populated during initialization from scope discovery]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:184:- Findings registry: `deep-review-findings-registry.json`
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:187:- Severity threshold: [from config.severityThreshold]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:202:- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:203:- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:204:- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:207:- Dimension: test-coverage
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:209:- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_strategy.md:215:| test-coverage        | converging | 2, 4               |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:3:description: "Focused reference for severity-weighted stop signals, P0 overrides, quality gates, and graph-aware blocked-stop checks."
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:7:  - "severity weighted convergence"
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:22:Deep-review convergence is a release-readiness decision. The loop stops only when severity-weighted findings stabilize, dimension coverage is complete, quality gates pass, and no P0 override is active.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:30:| Severity-weighted new findings | Weighted P0/P1/P2 discovery ratio for the latest iteration | Above the configured threshold |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:32:| Dimension coverage | Required review dimensions and traceability overlays covered | Any required dimension is missing |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:33:| Quality-gate bundle | Evidence, scope, coverage, P0, density, hotspot, claim, candidate, graphless gates | Any required gate fails |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:55:1. New findings are below threshold.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:57:3. All required dimensions are covered.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_signals.md:72:| `deep-review` | Severity-weighted P0/P1/P2 new findings | `0.10` |
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:9:// ║   research: deduplicated deep-research-findings-registry.json +          ║
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:11:// ║   review:   severity-rollup deep-review-findings-registry.json           ║
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:138:    record.finding,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:141:    record.severity,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:152:    record.finding,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:162:    severity: undefined,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:171:    record.finding,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:179:// nouns/verbs that distinguish one finding from another, not on filler.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:197:// findings).
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:207:// Below this title overlap two same-body findings are treated as DISTINCT (their titles
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:210:// are paraphrases of one point that share their subject noun, and the same-body findings
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:216:// Title-aware near-dup match (deep-review P2-15 fix): two findings are near-duplicates
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:218:// This closes the title blind spot — genuinely-distinct findings that share an identical
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:287:  const incomingRank = SEVERITY_RANK[incoming.severity] ?? 0;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:288:  const existingRank = SEVERITY_RANK[existing.severity] ?? 0;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:342:function getFindingBucket(index, id, finding, enableNearDuplicateDedup) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:343:  const contentKey = enableNearDuplicateDedup ? nearDuplicateContentKey(finding) : '';
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:349:  // Title-aware bucketing (deep-review P2-15 fix): a content key can host MORE than one
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:350:  // bucket when several genuinely-distinct findings share an identical body but carry
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:352:  // same-body finding joins the bucket whose records its title actually matches, and
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:353:  // otherwise opens a new bucket. Without this a distinct finding would share a bucket with
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:354:  // a different finding and be mis-tagged as a same-id conflict variant by
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:359:      ? candidateBuckets.find((b) => b.records.some((entry) => nearDuplicateMatches(entry, finding)))
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:394:function addResearchFinding(bucket, finding, label, options = {}) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:396:    ? (entry) => nearDuplicateMatches(entry, finding)
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:397:    : (entry) => contentIdentityKey(entry) === contentIdentityKey(finding);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:401:      replaceRecord(existing, chooseCanonicalRecord(existing, finding, ['id', 'title']), mergeLineageLabels(existing, finding, label));
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:407:  bucket.push({ ...finding, _lineages: [label] });
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:410:function addReviewFinding(bucket, finding, label, options = {}) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:412:    ? (entry) => nearDuplicateMatches(entry, finding)
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:413:    : (entry) => contentIdentityKey(entry) === contentIdentityKey(finding);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:416:    bucket.push({ ...finding, _lineages: [label] });
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:423:      chooseReviewCanonicalRecord(existing, finding, ['findingId', 'title']),
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:424:      mergeLineageLabels(existing, finding, label),
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:429:  const incomingRank = SEVERITY_RANK[finding.severity] ?? 0;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:430:  const existingRank = SEVERITY_RANK[existing.severity] ?? 0;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:433:      ...finding,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:434:      _lineages: mergeLineageLabels(existing, finding, label),
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:441:function flattenFindingBuckets(findingById, idKey, sortKeys) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:443:  for (const [baseId, bucket] of findingById) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:463: * Normalize a registry object so that the canonical findings key is populated,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:464: * tolerating known aliases (e.g. `findings` → `keyFindings` for research,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:465: * `findings` → `openFindings` for review).
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:490:        severity: 'warn',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:501:  // No usable findings array found — registry will be skipped.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:505:    severity: 'warn',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:507:    message: `Registry has no usable "${canonicalKey}" array (checked aliases: ${Object.keys(aliases).join(', ')}); lineage findings will be skipped.`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:521: * Merge research findings registries from all lineages.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:522: * Deduplicates by findingId; cross-model attribution via lineage labels.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:527:  const findingById = mergeOptions.enableNearDuplicateDedup ? createFindingBucketIndex() : new Map();
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:533:      aliases: { findings: 'keyFindings' },
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:541:    for (const finding of registry.keyFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:542:      const id = finding.id || finding.title;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:545:        addResearchFinding(getFindingBucket(findingById, id, finding, true).records, finding, label, mergeOptions);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:547:        if (!findingById.has(id)) findingById.set(id, []);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:548:        addResearchFinding(findingById.get(id), finding, label, mergeOptions);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:554:    ? flattenFindingBucketIndex(findingById, 'id', ['id', 'title'])
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:555:    : flattenFindingBuckets(findingById, 'id', ['id', 'title']);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:572:    // were previously dropped here, under-reporting answered coverage in the
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:612:      coverageBySources: {},
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:623: * Merge review findings registries with strongest-restriction severity rollup.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:624: * Any lineage with an active P0 finding causes the merged result to be FAIL.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:625: * Deduplication is by findingId; cross-lineage P0 wins if any lineage reports it.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:629:  const findingById = mergeOptions.enableNearDuplicateDedup ? createFindingBucketIndex() : new Map();
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:635:      aliases: { findings: 'openFindings' },
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:643:    for (const finding of registry.openFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:644:      if (finding.status !== 'active') continue;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:645:      const id = finding.findingId || finding.title;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:648:        addReviewFinding(getFindingBucket(findingById, id, finding, true).records, finding, label, mergeOptions);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:650:        if (!findingById.has(id)) findingById.set(id, []);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:651:        addReviewFinding(findingById.get(id), finding, label, mergeOptions);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:656:  // Resolved findings are tracked separately per lineage and were previously
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:657:  // dropped here, zeroing the merged resolved coverage. Collect them by id with
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:658:  // _lineages attribution, without touching open-finding/verdict semantics.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:662:    for (const finding of registry.resolvedFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:663:      const id = finding.findingId || finding.title;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:666:        addReviewFinding(getFindingBucket(resolvedFindingById, id, finding, true).records, finding, label, mergeOptions);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:670:        resolvedFindingById.set(id, { ...finding, _lineages: [label] });
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:675:    ? flattenFindingBucketIndex(resolvedFindingById, 'findingId', ['findingId', 'title'])
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:676:    : sortByContentThenId([...resolvedFindingById.values()], ['findingId', 'title']);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:679:    ? flattenFindingBucketIndex(findingById, 'findingId', ['findingId', 'title'])
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:680:    : flattenFindingBuckets(findingById, 'findingId', ['findingId', 'title']);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:681:  const activeP0 = mergedFindings.filter((f) => f.severity === 'P0' && f.status === 'active').length;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:682:  const activeP1 = mergedFindings.filter((f) => f.severity === 'P1' && f.status === 'active').length;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:683:  const activeP2 = mergedFindings.filter((f) => f.severity === 'P2' && f.status === 'active').length;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:700:    findingsBySeverity: { P0: activeP0, P1: activeP1, P2: activeP2 },
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:733:        ? registry?.findingsBySeverity?.P0 > 0
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:735:          : registry?.findingsBySeverity?.P1 > 0
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:751: * Reconstruct a minimal review findings registry from a lineage state log.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:753: * Leaf-only review lineages may carry active findings only in their state log
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:754: * iteration records (`findingDetails`), with no registry file on disk. This maps
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:755: * those findingDetails into the openFindings shape mergeReviewRegistries consumes,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:760: * @returns {{openFindings:Array,Object}|null} Reconstructed registry, or null when no findings exist.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:767:    if (!record || record.type !== 'iteration' || !Array.isArray(record.findingDetails)) continue;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:768:    for (const detail of record.findingDetails) {
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:770:      const id = detail.id || detail.findingId || detail.title;
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:774:        findingId: id,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:776:        severity: detail.severity || 'P2',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:778:        ...(detail.dimension ? { dimension: detail.dimension } : {}),
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:790:    P0: openFindings.filter((f) => f.severity === 'P0').length,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:791:    P1: openFindings.filter((f) => f.severity === 'P1').length,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:792:    P2: openFindings.filter((f) => f.severity === 'P2').length,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:794:  return { openFindings, resolvedFindings, findingsBySeverity: bySeverity, _reconstructed: true };
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:801:      const objectText = firstNonEmptyString([value.title, value.summary, value.text, value.finding, value.description]);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:814:      id: `state-finding-${run}-${index + 1}-${crypto.createHash('sha256').update(text).digest('hex').slice(0, 12)}`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:822:  const text = firstNonEmptyString([candidate.title, candidate.summary, candidate.text, candidate.finding, candidate.description]);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:825:    id: candidate.id || candidate.findingId || `state-finding-${run}-${index + 1}-${crypto.createHash('sha256').update(text).digest('hex').slice(0, 12)}`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:837:  const structured = [record.keyFindings, record.findings, record.findingDetails]
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:843:  const findingsCount = Number(record.findingsCount);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:844:  if (!Number.isFinite(findingsCount) || findingsCount <= 0) return [];
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:848:    record.findingsSummary,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:854:    id: `state-finding-${run}-1-${crypto.createHash('sha256').update(narrative || String(run)).digest('hex').slice(0, 12)}`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:855:    title: narrative || `Iteration ${run} recorded ${Math.floor(findingsCount)} finding(s)`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:856:    summary: narrative || `State log recorded ${Math.floor(findingsCount)} finding(s) but no structured finding text.`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:862: * Reconstruct a minimal research findings registry from a lineage state log.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:865: * registry file on disk. This maps state-log findings into keyFindings so the
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:870: * @returns {{keyFindings:Array,Object}|null} Reconstructed registry, or null when no findings exist.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:900:      coverageBySources: {},
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:932:    loopType === 'review' ? 'deep-review-findings-registry.json' : 'deep-research-findings-registry.json';
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:942:    // active findings only in their state log's findingDetails, with no registry file.
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:944:    // dropping its findings from synthesis. Reconstruct a minimal registry from the
../../../../../skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:992:      : { key_findings: mergedRegistry.keyFindings?.length ?? 0 }),
../../../../../skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:191:    'dimensions',
../../../../../skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:284:  const rows = (doc.contract.dimensions || []).map((item) => [
../../../../../skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:355:    renderSettingsTable(convergence.severityMath),
../../../../../skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:359:    renderSettingsTable(convergence.coverageAge),
../../../../../skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:371:    item.dimension,
../../../../../skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:431:  dimensions: renderDimensionsSection,
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:58:  # Simplified review dimensions. Traceability and maintainability absorb the
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:59:  # prior seven-dimension model's overlap.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:60:  dimensions:
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:121:      rule: Every active finding must be backed by concrete file:line evidence and may not rely only on inference.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:128:    - id: coverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:132:        - severity-coverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:134:      rule: Required dimensions and required traceability protocols must be covered before STOP is allowed.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:145:        description: Rolling average of severity-weighted new findings across recent evidence-bearing iterations.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:148:        description: Robust noise-floor test comparing the latest severity-weighted ratio against MAD-derived churn.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:149:      - id: dimension-coverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:151:        description: Coverage vote based on required dimension completion plus required protocol coverage stability.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:152:    severityMath:
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:156:    coverageAge:
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:191:      - findingsRegistry
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:202:      description: Review is ongoing or coverage is incomplete.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:204:      description: All dimensions are covered and no new P0/P1 findings appeared in the latest stabilization pass.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:206:      description: At least one unresolved P0 finding is present.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:212:      dimension: traceability
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:220:      dimension: traceability
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:228:      dimension: traceability
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:236:      dimension: traceability
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:242:      failCriteria: Runtime definitions materially diverge in contract, permissions, workflow, or severity/evidence rules.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:244:      dimension: traceability
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:249:      partialCriteria: Catalog coverage is incomplete or stale, but no confirmed contradiction to shipped behavior is present.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:252:      dimension: traceability
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:272:    findingsRegistry:
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:273:      pathPattern: "{artifact_dir}/deep-review-findings-registry.json"
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:279:        - dimensionCoverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:280:        - findingsBySeverity
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:287:        - active-finding-registry
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:298:        - review-dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:299:        - completed-dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:300:        - running-findings
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:315:        - findings-summary
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:316:        - dimension-coverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:332:          - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:334:          - findingsCount
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:335:          - findingsSummary
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:336:          - findingsNew
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:337:          - findingDetails
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:347:          - findingsRefined
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:348:          - findingRefs
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:350:          - coverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:368:          - dimensionCoverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:375:# taxonomy (target types, dimensions, severities, verdicts, quality gates,
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:391:        - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:413:      - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:423:      - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:433:      - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:442:      - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:451:      - dimensions
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:456:# Validator contract for CI, render verification, and drift detection.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:462:    - id: render-verify
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:467:      description: "Confirm the dimension, severity, and verdict ids (plus cross-reference-protocol ids for the two workflow YAMLs) declared in each authoredArtifacts entry's enumParityChecked are still literally present in that file; see deep-review-contract-parity.vitest.ts."
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:473:      description: Ensure reducer inputs, outputs, and findings-registry metrics are documented consistently across assets and runtime mirrors.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:476:    - id: runtime-coverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:477:      description: Ensure every supported runtime deep-review agent has a declared authoredArtifacts entry and parity coverage.
../../../../../skills/system-deep-loop/deep-review/scripts/README.md:23:Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.
../../../../../skills/system-deep-loop/deep-review/scripts/README.md:89:User request: Check .opencode/skills/system-deep-loop/deep-review/scripts for sk-code and README coverage.
../../../../../skills/system-deep-loop/deep-review/scripts/README.md:101:| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |
../../../../../skills/system-deep-loop/deep-review/scripts/README.md:110:| [`sk-code/SKILL.md`](../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:6:  - "severity weighted stop ratio"
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:29:| **CONTINUE** | More review work is expected to yield meaningful new findings. Dispatch the next iteration. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:33:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:36:- `in-progress` while coverage is incomplete or new P0/P1 findings are still appearing
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:37:- `converged` once coverage and stabilization pass without new P0/P1 findings
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:38:- `release-blocking` whenever unresolved P0 findings remain active
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:63:`convergenceThreshold` (default 0.10) compares new severity-weighted findings (P0=10, P1=5, P2=1) against accumulated findings. Lower values demand more iterations and a higher signal threshold before STOP is legal.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:69:| `deep-review` | 0.10 | severity-weighted P0/P1/P2 ratio |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:77:> **STATUS: SPEC ONLY (future implementation).** The override matrix below describes the contract that a future release should apply automatically when the review target involves security-sensitive surfaces. As of v1.9.0.0, the runtime does NOT auto-detect security-sensitivity and does NOT apply these overrides. `requiredClosedFindingReplay` and `requiredFixCompletenessGate` exist in no config / yaml / reducer surface (verified by grep). Operators running a security-sensitive review must manually tighten thresholds via `--convergence` + `--max-iterations` and manually maintain the closed-gate replay table. The contract below stands as the target spec for the next implementation pass. (Provenance for this deferred contract is recorded in this skill's changelog.)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:79:For review reruns after fixes involving security, path disclosure, auth/authz, sandboxing, env precedence, public schemas, persistence, or user-visible error payloads (intended contract, not yet runtime-enforced):
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:102:| `divergent` | After all review gates pass, translates the eligible `all_dimensions_clean` STOP into a read-only three-seat direction-selection pivot and continues with the selected review direction. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:106:Review has one eligible reason: the exact internal reason `all_dimensions_clean` with decision `STOP`. The nine legal-stop gates run before the divergent branch and remain unchanged. `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, and `userPaused` are explicitly excluded. Max iterations, pause or cancellation, manual stop, unrecoverable error, and any blocked security or quality gate therefore never dispatch a pivot Council.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:108:Each eligible pivot runs one native, in-process Council round with exactly three distinct seats: analytical, critical, and pragmatic. It does not use an external CLI. The transaction requires all three seat returns to be parse-valid and at least two seats to materially endorse the same candidate without a high-severity blocker. Candidate sources are persisted unswept dimensions, search debt, producer-consumer gaps, negative-test gaps, and traceability gaps. Candidate generation rejects directions without in-scope evidence and directions that imply implementation, a fix, mutation, writing, or target expansion.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:110:The guarantees are absolute: divergent mode never changes the PASS/CONDITIONAL/FAIL mapping, never authorizes a fix, and never makes the review target writable. A successful pivot returns to the loop before `phase_synthesis`; verdict computation exists only inside `phase_synthesis`, where active P0 yields FAIL, active P1 yields CONDITIONAL, and no active P0/P1 yields PASS. A failed pivot fails closed to that existing synthesis path.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:136:  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:139:    "dimensionCoverageGate": {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:148:    "fixCompletenessReplayGate": { "pass": true, "securitySensitive": false, "requiredRows": 0, "passingRows": 0 },
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:153:  "recoveryStrategy": "Dispatch the next iteration at the maintainability dimension and re-check after resolving the remaining P0.",
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:161:- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate`. This is the full 9-gate set emitted by `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1, securitySensitive, requiredRows, passingRows, searchDebt, mode, unavailabilityReason). The reducer reads these verbatim and does not coerce shapes. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates, they pass trivially when the review-depth-v2 search path is inactive (no search debt, graph available).
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:171:2. **All dimensions covered + clean** -- all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:190:The loop stops unconditionally. Synthesis runs with whatever findings exist.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:195:if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:196:  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:197:    if buildReviewLegalStop(state, config, coverage).passed:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:201:Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and the 5-gate legal-stop bundle passes. If gates fail, the loop records `stopReason=blockedStop` and continues despite full coverage.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:236:Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold. The signal set below matches the authoritative 3-signal vote in `deep_review_{auto,confirm}.yaml` `step_check_convergence` and the quick-reference convergence table, the 3rd signal is **dimension coverage**, not a standalone novelty ratio.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:240:| Rolling Average | 0.30 | 2 | Recent severity-weighted finding yield |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:242:| Dimension Coverage | 0.45 | 1 | Configured review dimensions fully covered AND required traceability protocols covered AND `coverage_age >= minStabilizationPasses` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:246:Averages the last 2 severity-weighted `newFindingsRatio` values from evidence-bearing iterations (excludes `thought` status). Votes STOP when the average drops below `rollingStopThreshold` (0.08).
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:270:Highest-weight signal. Votes STOP once every configured review dimension AND every required traceability protocol has been covered by at least one iteration, and the coverage set has been stable for at least `minStabilizationPasses` iterations (default 1). This is the signal the YAML workflow evaluates.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:273:dimensionStop =
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:274:  dimensions_covered_count == configured_dimensions_count
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:276:  AND coverage_age >= config.minStabilizationPasses
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:279:The latest severity-weighted newFindingsRatio is still tracked (the dashboard and registry surface it as `newFindingsRatio`), but it does NOT cast an independent stop vote, it feeds the rolling average and MAD noise-floor signals only.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:296:Measures how much genuinely new review insight each iteration contributes beyond surface-level overlap with prior findings. Unlike `newFindingsRatio` (which is severity-weighted), `semanticNovelty` evaluates the conceptual novelty of findings independent of severity weighting.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:301:| 0.4-0.7 | Mix of new review insights and restatements of prior findings |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:303:| 0.0 | No semantically novel findings detected |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:314:When `semanticNovelty` drops below 0.15 for 2+ consecutive evidence iterations, it provides strong supporting evidence for a legal STOP decision. This signal catches cases where `newFindingsRatio` stays moderate (due to severity weighting of refinements) but the review has exhausted genuinely new defect categories.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:316:#### findingStability (0.0-1.0)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:318:Measures how stable the cumulative finding set is across iterations. A high stability score means the finding registry is not materially changing between iterations -- findings are not being added, upgraded, downgraded, or invalidated at a significant rate.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:323:| 0.6-0.8 | Moderate stability, some findings still evolving |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:324:| 0.3-0.5 | Active churn, findings being added, merged, or reclassified frequently |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:332:    if f.id in priorRegistry and f.severity == priorRegistry[f.id].severity
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:340:- `findingStability >= 0.85` supports STOP: the finding set has stabilized and further iterations are unlikely to materially change the review outcome.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:341:- `findingStability < 0.50` prevents STOP: the finding set is still in flux and the review has not reached a stable assessment.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:347:1. **findingStability gate** (existing): The existing `findingStability` gate already evaluates rolling average, MAD noise floor, and novelty ratio. The new `semanticNovelty` signal adds a sub-check:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:351:2. **findingStability signal** (new): The `findingStability` metric (0.0-1.0) is surfaced alongside the existing convergence signals. It supports the `findingStability` gate evaluation by providing a registry-level stability measure that complements the ratio-based churn signals.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:353:The gate passes only when both the existing churn-based checks AND the semantic stability checks agree. When a semantic check fails, the persisted `blocked_stop.gateResults.findingStability` payload includes the semantic signal values.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:365:    "findingStability": { "value": 0.92, "supportsStop": true }
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:387:Semantic convergence signals (`semanticNovelty`, `findingStability`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:393:The review loop uses `newFindingsRatio` instead of `newInfoRatio`. It weights findings by severity so that critical discoveries count far more than minor suggestions.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:409:weightedNew       = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:410:weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:411:weightedTotal     = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:416:- `fully_new_findings` -- findings not present in any prior iteration (new findingId).
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:417:- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:426:if total_findings == 0:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:430:A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:436:> **GATE MODEL, two naming conventions mapped to one authoritative set.** The authoritative producer is `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`, which emits **9 gates** with the `Gate` suffix: `convergenceGate` / `dimensionCoverageGate` / `p0ResolutionGate` / `evidenceDensityGate` / `hotspotSaturationGate` / `claimAdjudicationGate` / `fixCompletenessReplayGate` / `candidateCoverageGate` / `graphlessFallbackGate`. The §Section-1 event shape (lines 98-119) mirrors this set verbatim and the reducer reads those names verbatim, so treat the event shape as authoritative when writing or reading JSONL state. The §6 table below is the high-level conceptual model and uses descriptive names WITHOUT the `Gate` suffix where one reads more naturally (for example `findingStability` maps to `convergenceGate`); each row carries its event-shape name so the mapping is explicit. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. The gate-model drift cluster (LG-0013, LG-0016, LG-0031, LG-0032) was reconciled in `006-gate-model-reconciliation`.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:442:| **findingStability** | `convergenceGate` | Rolling average, MAD noise floor, and novelty ratio must all indicate low-yield review churn | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:443:| **dimensionCoverage** | `dimensionCoverageGate` | Every configured review dimension must have been examined at least once, with required traceability coverage stabilized | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:444:| **p0Resolution** | `p0ResolutionGate` | No unresolved P0 findings may remain active at stop time | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:445:| **evidenceDensity** | `evidenceDensityGate` | Evidence density across active findings must meet the configured threshold | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:447:| (no §6 counterpart) | `claimAdjudicationGate` | Each new P0/P1 finding must carry a typed adjudication packet, missing or failing packets veto STOP | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:448:| **fixCompletenessReplay** | `fixCompletenessReplayGate` | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:449:| **candidateCoverage** (v2 rollout) | `candidateCoverageGate` | Search debt must be cleared and every required bug class must have candidate coverage before STOP, passes trivially when the v2 search path is inactive | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:455:function buildReviewLegalStop(state, config, coverage):
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:457:    findingStability: {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:461:    dimensionCoverage: {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:462:      pass: everyConfiguredDimensionExaminedAtLeastOnce(coverage, config.reviewDimensions) and
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:463:            coverage.requiredProtocolsCovered and
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:464:            coverage.stabilizationPasses >= 1,
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:465:      detail: "All configured review dimensions have been examined, required traceability protocols are covered, and stabilization has aged enough to stop."
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:469:      detail: "No unresolved P0 findings remain and blocker adjudication is complete."
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:473:      detail: "Evidence density meets the configured threshold for active findings."
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:479:    fixCompletenessReplay: {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:481:      detail: "Security-sensitive fix reruns include closed-gate replay evidence and producer/consumer/matrix coverage before STOP."
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:485:      detail: "Search debt is cleared and every required bug class has candidate coverage. Passes trivially when the v2 search path is inactive."
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:507:| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:508:| `dimensionCoverage` | Schedule the next uncovered review dimension immediately. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:509:| `p0Resolution` | Re-open the active blocker path and verify whether the P0 is real, downgraded, or still unresolved. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:510:| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:512:| `fixCompletenessReplay` | Replay prior active or remediated P0/P1 gates, then record producer, consumer, and matrix coverage evidence before re-checking STOP. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:522:| `all_dimensions_clean` | `converged` | Legacy review-specific terminal label, now expressed by the shared enum. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:524:| `all dimensions clean` | `converged` | Old operator-facing prose for the same successful stop. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:539:The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:544:| **CONDITIONAL** | `activeP0 == 0` AND `activeP1 > 0` | Meets threshold but has required fixes before release. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:568:| FAIL | `/speckit:plan` -- create remediation plan from findings |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:569:| CONDITIONAL | `/speckit:plan` -- create fix plan for P1 findings |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:601:- Review dimensions (`reviewDimensions`) and product mode (`mode`)
../../../../../skills/system-deep-loop/runtime/scripts/README.md:19:| `query.cjs` | Queries coverage gaps, unverified claims, contradictions, council graph state, and related graph state |
../../../../../skills/system-deep-loop/runtime/scripts/README.md:22:| `fanout-run.cjs` | Runs parallel research or review lineages through headless CLI subprocesses. Deprecated context fan-out is rejected before dispatch. On `SIGINT`/`SIGTERM` it flushes a partial summary marked `stopped:true` instead of dying silently, and treats an empty / no-new-findings tick as valid convergence rather than failure |
../../../../../skills/system-deep-loop/runtime/scripts/README.md:25:| `fanout-merge.cjs` | Merges research or review fan-out lineage outputs into consolidated artifacts, applying a deterministic content-derived total-order sort (on top of id-or-title dedup and, when `SPECKIT_FANOUT_NEAR_DUP_DEDUP` is enabled, a title-aware Jaccard near-dup gate that treats same-body findings with distinct titles as distinct) so merged findings order reproducibly across runs. `--loop-type context` is accepted but currently uses research registry and state filenames, so it is not a correct context-output merger |
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:7:  - "review findings summary"
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:8:  - "review coverage trend"
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:31:- **Data sources:** `deep-review-state.jsonl` + `deep-review-strategy.md` + `deep-review-findings-registry.json`
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:68:- **Repeated findings:** [N]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:98:- New findings trend (last 3): [N -> N -> N] [increasing | stable | decreasing]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:106:- **Disproved findings:** [findings investigated and determined to be false positives]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:114:[from strategy.md "Next Focus" section, next dimension, file set, or review lens]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:121:- [blockers, missing coverage, unresolved contradictions, gate violations, high stuck count, declining trend, etc.]
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:146:| 2 | test-coverage        | 6             | 1  | 2  | 1  | 0.52  | converging |
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:156:- 1 P0 in test-coverage dimension -- review cannot terminate PASS until resolved
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_dashboard.md:157:- agent_cross_runtime protocol partial: OpenCode runtime path still unverified
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:6:  - "least covered dimension pivot"
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:37:| Recovery strategies | Choose granularity, protocol replay, or severity-focused review after stuck detection. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:38:| Convergence report | Records stop reason, verdict, coverage, score, gates, and recovery attempts. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:51:| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity:** zoom into functions if reviewing at file level, or zoom out to module level if reviewing functions |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:53:| Low-value advisory churn | Last 2 iterations found only P2 findings | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:57:Stuck recovery always pivots to the **least-covered dimension** -- the review dimension with the fewest iteration passes and lowest coverage ratio -- rather than relying solely on strategy-based selection. This ensures recovery escapes local minima by exploring under-examined areas of the review target.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:61:leastCovered = min(dimensions, key=lambda d: (iterationCountFor(d), coverageRatioFor(d)))
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:64:When the stuck recovery fires, the YAML workflow appends a `stuck_recovery` JSONL event that records the target dimension:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:74:  leastCovered = findLeastCoveredDimension(state.dimensionCoverage, state.iterations)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:76:  if len(set(lastFocuses)) <= 1:                           // same dimension stuck
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:77:    return { strategy: "change_granularity", dimension: leastCovered }
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:79:    return { strategy: "protocol_first_replay", dimension: leastCovered }
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:80:  return { strategy: "escalate_severity_review", dimension: leastCovered }  // default
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:86:RECOVERY MODE: The last {stuckCount} iterations found no significant new findings.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:88:Dimension focus that is exhausted: {dimension}
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:94:- escalate_severity_review: Hunt for P0/P1 patterns across all dimensions.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:101:- **Success:** Recovery iteration finds any new P0/P1 or materially advances required traceability coverage. Reset stuck count. Continue.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:102:- **Failure:** Recovery iteration finds only P2 or nothing. If all dimensions are covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:126:Active findings at convergence:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:129:Dimension coverage: N / 4 (X%)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:144:  findingStability: [PASS | FAIL]
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:145:  dimensionCoverage: [PASS | FAIL]
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:152:  findingStability:   0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:176:  "dimensionCoverage": 1.0,
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:196:When `graphEvents` are present in review iteration records, the reducer builds an in-memory coverage graph and derives structural convergence signals that complement the existing statistical signals.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:202:| `graphDimensionCoverage` | number (0.0-1.0) | Fraction of dimension nodes with at least one COVERS edge to a file node | Above 0.85 supports stop |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:203:| `graphFindingConnectivity` | number (0.0-1.0) | Fraction of finding nodes with at least one EVIDENCES edge | Above 0.90 supports stop (all findings backed by evidence) |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:204:| `graphRemediationRatio` | number (0.0-1.0) | Fraction of P0/P1 findings with at least one REMEDIATES edge | Rising ratio supports stop (findings being resolved) |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:205:| `graphIsolatedFindings` | number | Finding nodes with no edges | Above 0 prevents stop (unconnected findings need evidence) |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:209:Graph signals participate in the existing `findingStability` gate as additional sub-checks:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:212:findingStability.checks.graphEvidence = {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:214:  detail: "Graph shows N/M findings connected with K isolated"
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence_recovery.md:218:When `graphEvents` are absent (no graph data), the `graphEvidence` sub-check is omitted from the findingStability gate evaluation. The gate passes or fails based on existing sub-checks alone.
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:62:      '.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/findings_registry.md',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:81:      autoEnd: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:82:      confirmStart: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:86:      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:110:        '{state_paths.findings_registry} cross-topic findings registry JSON',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:124:        '{state_paths.findings_registry}',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:130:        'coverage-graph records for loop_type=council',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:143:        'implementation fixes during council execution',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:189:      autoEnd: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:190:      confirmStart: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:194:      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:202:        'coverage_threshold',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:225:        '{state_paths_findings_registry} reducer-owned in-place updates only',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:287:      autoEnd: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:288:      confirmStart: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:292:      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:296:        'review_dimensions',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:331:        '{state_paths_findings_registry} in-place updates only',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:343:        'implementation fixes during review execution',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:395:      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:444:        'implementation fixes during research execution',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:577:  const directiveOpening = `You were invoked via \`opencode run --command ${definition.id}\` with the \`:auto\` suffix and a bound spec_folder and target in your message. The \`:auto\` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:`;
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:676:    '  - "Missing or invalid receipt evidence makes route claims advisory only and forbids findings output."',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:709:    'rule: "Producing findings without a dispatch receipt is role absorption; write no findings."',
../../../../../skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:710:    'writePolicy: "If receipt evidence is absent, invalid, or mismatched to command intent, emit an abort status and leave finding artifacts unwritten."',
../../../../../skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:553:function formatDrift(prefix, drift) {
../../../../../skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:559:  return `${prefix} ${fields.join(' ')}\n`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:20:// (same keys, same weights) so the two reducers share one severity vocabulary
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:21:// even though they aggregate by different keys (lane here, review dimension
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:23:// dimensions are a fixed constant, but deep-alignment's lanes are resolved
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:41:// all-NOT_APPLICABLE run (zero coverage everywhere) still reports PASS
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:191: * A finding's dedup key: content_hash when the adapter/loop supplied one,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:192: * else a fallback over the fields every adapter's finding shape carries in
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:193: * common (severity + type + message) -- adapter shapes are heterogeneous
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:197: * @param {Object} finding
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:200:function findingDedupKey(finding) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:201:  if (finding && typeof finding.contentHash === 'string' && finding.contentHash) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:202:    return `ch:${finding.contentHash}`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:204:  const severity = normalizeText(finding && finding.severity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:205:  const type = normalizeText(finding && finding.type);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:206:  const message = normalizeText(finding && finding.message).slice(0, 120);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:208:    (finding && (finding.artifactPath || finding.artifactTarget || finding.artifactRef || finding.artifactId)) || '',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:210:  return `fl:${severity}|${type}|${artifact}|${message}`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:215: * Findings are the RAW adapter check() output (severity/type/message plus
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:216: * whatever adapter-specific fields that authority's finding carries) --
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:219: * their finding shapes byte-identical to each other (confirmed by reading
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:223: * severity is read structurally here; every other field passes through.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:237:    .filter((record) => record && record.type === 'finding' && record.laneId === laneId)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:238:    .map((record) => record.finding)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:239:    .filter((finding) => finding && typeof finding === 'object');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:243:  // a bare numeric count (simpler emitters and unit fixtures). Union the paths
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:244:  // across iterations so a re-audited artifact counts once -- coverage is the
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:246:  // loop that keeps re-checking the same slice must not inflate coverage past the
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:265:  // the same finding; only the first occurrence counts as "open").
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:268:  for (const finding of laneDeltaFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:269:    const severity = normalizeSeverity(finding.severity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:270:    if (!severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:271:      // A finding whose severity is not a recognized P0/P1/P2 is a data-integrity
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:272:      // fault, not a droppable non-finding. Silently skipping it lets a truncated
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:278:    const key = findingDedupKey(finding);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:280:      byKey.set(key, { ...finding, severity });
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:285:  const findingsBySeverity = zeroSeverityMap();
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:287:  for (const finding of openFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:288:    findingsBySeverity[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:289:    compositeScore += SEVERITY_WEIGHTS[finding.severity] || 0;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:301:  } else if (findingsBySeverity.P0 > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:303:  } else if (findingsBySeverity.P1 > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:319:    // a prefix cursor, which a duplicate or out-of-order re-check would desync. Null
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:323:    findingsBySeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:340:  const findingsBySeverity = zeroSeverityMap();
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:347:    for (const severity of SEVERITY_KEYS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:348:      findingsBySeverity[severity] += entry.findingsBySeverity[severity] || 0;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:361:  // A corrupted state log or an unrecognized finding severity means the gate is
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:388:    findingsBySeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:402: * each lane's findings under its own heading rather than interleaving them.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:421:    `- Findings: P0 ${overall.findingsBySeverity.P0} / P1 ${overall.findingsBySeverity.P1} / P2 ${overall.findingsBySeverity.P2}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:431:    lines.push(`- Findings: P0 ${entry.findingsBySeverity.P0} / P1 ${entry.findingsBySeverity.P1} / P2 ${entry.findingsBySeverity.P2}`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:435:      lines.push('No open findings.', '');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:438:    for (const severity of SEVERITY_KEYS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:439:      const bucket = entry.openFindings.filter((finding) => finding.severity === severity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:441:      lines.push(`### ${severity}`, '');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:442:      for (const finding of bucket) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:443:        const artifact = finding.artifactPath || finding.artifactTarget || finding.artifactRef || finding.artifactId || 'unknown-artifact';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:444:        const layer = finding.layer || finding.producedBy || 'unlabeled';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:445:        lines.push(`- **${finding.type || 'finding'}** (${layer}) — \`${artifact}\` — ${normalizeText(finding.message)}`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:456: * findings-registry.json and alignment-report.md, mirroring
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:474:  const registryPath = path.join(alignmentDir, 'deep-alignment-findings-registry.json');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:535:        findingsBySeverity: result.registry.overall.findingsBySeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:556:  findingDedupKey,
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_config.json:43:  "severityThreshold": "P2",
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_config.json:62:    "deep-review-findings-registry.json": "auto-generated",
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_config.json:78:      "findingsRegistry",
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_config.json:83:      "dimensionsCovered",
../../../../../skills/system-deep-loop/deep-review/assets/deep_review_config.json:84:      "findingsBySeverity",
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:3:description: "Human-readable snapshot of the deep-review contract: targets, dimensions, severities, gates, convergence, outputs, and validation."
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:7:  - "review dimensions"
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:74:| `evidence` | Evidence | yes | `evidence-completeness`, `no-inference-only` | Every active finding must be backed by concrete file:line evidence and may not rely only on inference. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:76:| `coverage` | Coverage | yes | `severity-coverage`, `cross-reference` | Required dimensions and required traceability protocols must be covered before STOP is allowed. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:92:| `rolling-average` | 0.3 | Rolling average of severity-weighted new findings across recent evidence-bearing iterations. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:93:| `mad-noise-floor` | 0.25 | Robust noise-floor test comparing the latest severity-weighted ratio against MAD-derived churn. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:94:| `dimension-coverage` | 0.45 | Coverage vote based on required dimension completion plus required protocol coverage stability. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:151:- **Fail:** Runtime definitions materially diverge in contract, permissions, workflow, or severity/evidence rules.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:156:- **Partial:** Catalog coverage is incomplete or stale, but no confirmed contradiction to shipped behavior is present.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:173:### `findingsRegistry`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:175:- **Path pattern:** `{artifact_dir}/deep-review-findings-registry.json`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:177:- **Sections:** `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, `convergenceScore`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:182:- **Sections:** `executive-summary`, `planning-trigger`, `active-finding-registry`, `remediation-workstreams`, `spec-seed`, `plan-seed`, `traceability-status`, `deferred-items`, `audit-appendix`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:187:- **Required sections:** `topic`, `review-dimensions`, `completed-dimensions`, `running-findings`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`, `known-context`, `cross-reference-status`, `files-under-review`, `review-boundaries`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:193:- **Sections:** `status`, `findings-summary`, `dimension-coverage`, `progress`, `next-focus`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:204:- **Iteration record required:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:205:- **Iteration record optional:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`, `graphEvents`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:206:- **Synthesis event required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:215:| `render-verify` | Re-render the single review-contract-snapshot artifact (node render-contract-snapshot.cjs --check) and fail on drift. The five authoredArtifacts entries are hand-maintained and are not re-rendered by this check. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:217:| `enum-parity` | Confirm the dimension, severity, and verdict ids (plus cross-reference-protocol ids for the two workflow YAMLs) declared in each authoredArtifacts entry's enumParityChecked are still literally present in that file; see deep-review-contract-parity.vitest.ts. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:220:| `reducer-contract` | Ensure reducer inputs, outputs, and findings-registry metrics are documented consistently across assets and runtime mirrors. |
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md:222:| `runtime-coverage` | Ensure every supported runtime deep-review agent has a declared authoredArtifacts entry and parity coverage. |
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:298:    .filter((blocker) => blocker && blocker.severity === 'blocking')
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:321:    // (by-model confidence); then scope coverage, relevance gate, dependency map.
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:331:    clamp(safe(signals.dimensionCoverage)) * 0.25 +
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:332:    clamp(safe(signals.findingStability)) * 0.20 +
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:344:  const dimensionIds = new Set(nodes.filter((node) => node.kind === 'DIMENSION').map((node) => node.id));
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:345:  const findingNodes = nodes.filter((node) => node.kind === 'FINDING');
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:352:    coversEdges.map((edge) => edge.sourceId).filter((sourceId) => dimensionIds.has(sourceId)),
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:359:  const p0Findings = findingNodes.filter((node) => parseMetadata(node.metadata).severity === 'P0');
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:370:        .filter((sourceId) => dimensionIds.has(sourceId)),
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:375:    dimensionCoverage: dimensionIds.size > 0 ? coveredDimensionIds.size / dimensionIds.size : 0,
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:376:    findingStability: findingNodes.length > 0
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:377:      ? findingNodes.filter((node) => !contradictionNodeIds.has(node.id)).length / findingNodes.length
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:382:    evidenceDensity: findingNodes.length > 0 ? evidenceEdges.length / findingNodes.length : 0,
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:387:function evaluateResearch(signals, gaps, contradictions, unverified) {
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:404:    blockers.push({ type: 'source_diversity_guard', description: `Source diversity (${signals.sourceDiversity.toFixed(2)}) is below the blocking threshold (${thresholds.sourceDiversity}). STOP is blocked until diverse sources cover key questions.`, count: 1, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:407:    blockers.push({ type: 'evidence_depth_guard', description: `Evidence depth (${signals.evidenceDepth.toFixed(2)}) is below the blocking threshold (${thresholds.evidenceDepth}). STOP is blocked until question->finding->source chains are deeper.`, count: 1, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:410:    blockers.push({ type: 'uncovered_questions', description: `${gaps.length} question(s) have no coverage edges`, count: gaps.length, severity: signals.questionCoverage < thresholds.questionCoverage ? 'blocking' : 'warning' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:413:    blockers.push({ type: 'high_contradiction_density', description: `${contradictions.length} contradiction(s) detected with density above threshold`, count: contradictions.length, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:415:  if (unverified.length > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:416:    blockers.push({ type: 'unverified_claims', description: `${unverified.length} claim(s) remain unverified`, count: unverified.length, severity: signals.claimVerificationRate < thresholds.claimVerificationRate ? 'blocking' : 'warning' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:423:    dimensionCoverage: 0.8,
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:424:    findingStability: 0.7,
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:431:    { signal: 'dimensionCoverage', value: signals.dimensionCoverage, threshold: thresholds.dimensionCoverage, passed: signals.dimensionCoverage >= thresholds.dimensionCoverage, role: 'blocking_guard' },
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:432:    { signal: 'findingStability', value: signals.findingStability, threshold: thresholds.findingStability, passed: signals.findingStability >= thresholds.findingStability, role: 'weighted' },
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:438:    blockers.push({ type: 'unresolved_p0_findings', description: `P0 resolution rate (${(signals.p0ResolutionRate * 100).toFixed(0)}%) is below threshold (${(thresholds.p0ResolutionRate * 100).toFixed(0)}%)`, count: 1, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:440:  if (signals.dimensionCoverage < thresholds.dimensionCoverage) {
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:441:    blockers.push({ type: 'uncovered_dimensions', description: `Dimension coverage (${(signals.dimensionCoverage * 100).toFixed(0)}%) is below threshold (${(thresholds.dimensionCoverage * 100).toFixed(0)}%). ${gaps.length} gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.`, count: gaps.length, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:443:  if (contradictions.length > 0 && signals.findingStability < thresholds.findingStability) {
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:444:    blockers.push({ type: 'unstable_findings', description: `${contradictions.length} contradiction(s) are lowering finding stability below threshold`, count: contradictions.length, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:466:    blockers.push({ type: 'uncovered_slices', description: `Slice coverage (${(signals.sliceCoverage * 100).toFixed(0)}%) is below threshold (${(thresholds.sliceCoverage * 100).toFixed(0)}%). ${gaps.length} gap(s) found. STOP is blocked until the in-scope surface is swept.`, count: gaps.length, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:469:    blockers.push({ type: 'low_relevance_focus', description: `Relevance floor (${(signals.relevanceFloor * 100).toFixed(0)}%) is below threshold. The loop is collecting mostly low-relevance context; STOP is blocked until findings clear the relevance gate.`, count: 1, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:472:    blockers.push({ type: 'low_cross_executor_agreement', description: `Cross-executor agreement (${(signals.agreementRate * 100).toFixed(0)}%) is below threshold. Findings are not yet confirmed by multiple model lenses; STOP is blocked.`, count: 1, severity: 'blocking' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:475:    blockers.push({ type: 'context_contradictions', description: `${contradictions.length} contradiction(s) detected across executors; reconcile before STOP.`, count: contradictions.length, severity: 'warning' });
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:540:      type: 'novelty_self_report_unverified',
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:543:      severity: 'blocking',
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:601:        description: `Leading finding "${leadingFinding.id}" has ${leadingFinding.observations} observation(s), below min_observations (${observationThreshold.minObservations}). STOP is blocked until the finding is confirmed again.`,
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:603:        severity: 'blocking',
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:670:      : await import('../lib/coverage-graph/coverage-graph-db.ts');
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:688:    const signalsLib = await import('../lib/coverage-graph/coverage-graph-signals.ts');
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:689:    const queryLib = await import('../lib/coverage-graph/coverage-graph-query.ts');
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:772:    const unverified = loopType === 'research' ? queryLib.findUnverifiedClaims(ns) : [];
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:774:      ? evaluateResearch(signals, gaps, contradictions, unverified)
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:780:    const initialBlockingBlockers = blockers.filter((blocker) => blocker.severity === 'blocking');
../../../../../skills/system-deep-loop/runtime/scripts/convergence.cjs:798:    const blockingBlockers = blockers.filter((blocker) => blocker.severity === 'blocking');
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:27:      topic: 'summary fallback regression',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:29:      reviewTarget: 'summary fallback fixture',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:51:    dimensions: ['correctness'],
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:53:    findingsCount: 3,
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:54:    findingsSummary: { P0: 1, P1: 1, P2: 1 },
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:55:    findingsNew: { P0: 1, P1: 1, P2: 1 },
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:106:  assert.deepEqual(registry.findingsBySeverity, { P0: 1, P1: 1, P2: 1 });
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:108:  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 3);
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:115:      type: 'finding',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:118:      severity: 'P0',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:121:      findingClass: 'correctness',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:126:      type: 'finding',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:129:      severity: 'P1',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:130:      title: 'Structured required finding',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:132:      findingClass: 'correctness',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:137:      type: 'finding',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:140:      severity: 'P2',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:141:      title: 'Structured advisory finding',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:143:      findingClass: 'correctness',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:149:  assert.deepEqual(registry.findingsBySeverity, { P0: 1, P1: 1, P2: 1 });
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:151:  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 0);
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:197:          dimension: 'security',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:206:          dimension: 'security',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:222:          dimension: 'security',
../../../../../skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:246:console.log('[deep-review] reduce-state summary fallback regression passed');
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:7:  - "p0 p1 p2 severity ladder"
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:51:| `--severity-threshold` | P2 | Minimum severity to report |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:74:    |                    |                      +-- Write findings (P0/P1/P2)
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:93:| Registry | `review/deep-review-findings-registry.json` | JSON | Reducer-owned finding registry |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:94:| Strategy | `review/deep-review-strategy.md` | Markdown | Dimensions, findings, next focus |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:96:| Iterations | `review/iterations/iteration-NNN.md` | Markdown | Per-iteration findings (write-once) |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:126:| FAIL | Active P0 findings remain OR any binary gate fails | Does not meet quality standards | `/speckit:plan` for remediation |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:127:| CONDITIONAL | No P0, but active P1 findings remain | Meets threshold but has required fixes | `/speckit:plan` for fixes |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:128:| PASS | No active P0/P1 findings | Shippable, set `hasAdvisories=true` when P2 findings remain | `/create:changelog` |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:136:| `in-progress` | Review still running or required coverage incomplete |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:137:| `converged` | All 4 dimensions covered and the stabilization pass found no new P0/P1 findings |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:146:| Evidence | Every active finding has file:line evidence and is not inference-only |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:148:| Coverage | Configured dimensions plus required traceability protocols are covered before STOP |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:156:| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `0.08` |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:158:| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with `minStabilizationPasses >= 1` |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:162:**P0 override:** Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence.
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:169:1. Read `deep-review-state.jsonl`, `deep-review-findings-registry.json`, and `deep-review-strategy.md`
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:170:2. Determine focus dimension from strategy "Next Focus"
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:172:4. Write `review/iterations/iteration-NNN.md` with P0/P1/P2 findings
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:173:5. Run adversarial self-check on any P0 findings (Hunter/Skeptic/Referee)
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:174:6. Update `deep-review-strategy.md` (findings, coverage, next focus)
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:185:| 3 | Active Finding Registry | Deduped active findings with evidence and final severity |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:186:| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:202:| Focus on security | Specify `--dimensions security,correctness` |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:203:| Broad coverage | Use all 4 default dimensions and allow the stabilization pass to run |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:212:| Stuck on one dimension | Check strategy.md "Next Focus" rotation |
../../../../../skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:213:| P0 findings blocking convergence | Expected behavior: P0 override prevents premature stop |
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:3:description: "Focused reference for reducer ownership, findings registry semantics, fail-closed behavior, and reconstruction rules."
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:6:  - "review findings registry"
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:22:The reducer turns append-only review evidence into the current findings registry, dashboard, and strategy state. It is the authority for derived outputs, not a second source of truth.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:33:| Strategy machine sections | `scripts/reduce-state.cjs` | Update from coverage and findings |
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:37:No agent should hand-edit reducer-owned derived state as the authoritative fix. Repair JSONL or rerun the reducer.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:43:The registry groups findings into:
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:45:- Active findings.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:46:- Resolved findings.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:47:- Repeated findings.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:48:- Blocked or disputed findings.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:49:- Claim-adjudicated severity changes.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:51:Each active finding needs severity, category, file:line evidence, finding class, content hash, first-seen iteration, and latest-seen iteration.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:57:The reducer must refuse to publish derived state when JSONL is corrupt in strict mode. That protects dashboards and verdict previews from silently losing findings.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:72:1. Rebuild the registry from JSONL finding details.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:74:3. Rebuild strategy from completed dimensions and active findings.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:83:The reducer deduplicates findings at synthesis time using a two-tier match.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:87:1. **PRIMARY: content_hash** = `sha256(file_path + line_range + finding_type + normalized_description_80chars)`
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:88:   - `file_path`: repo-relative path of the finding
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:90:   - `finding_type`: one of `security`, `correctness`, `performance`, `maintainability`, `test_quality`, `contract_safety`, `removal`
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:92:2. **FALLBACK (legacy records): file:line + normalized_title** - applied when one or both records lack a `content_hash`, preserving existing behavior unchanged.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:96:When the same `content_hash` appears across iterations from different dimensions, synthesis collapses them to ONE entry with `dimensions: [<all dimensions that emitted it>]` rather than emitting multiple records. Records without `content_hash` fall back to `file:line + normalized_title`; no migration is required for existing JSONL state.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:100:Every finding emitted into the JSONL delta (`findingDetails[]`) MUST include a `content_hash` field computed per the two-tier match. `reduce-state.cjs` reads this field for synthesis dedup.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:196: * Parse a finding line of the form: `- **F001**: Title — file:line — Description`
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:198: * @param {string} line - Raw finding bullet
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:199: * @param {string} severity - P0, P1, or P2 context
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:200: * @returns {Object|null} Structured finding or null when the line is not a finding
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:202:function parseFindingLine(line, severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:208:  const [, findingId, title, evidenceRaw, description] = match;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:223:    findingId,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:224:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:232:function parseFindingsBlock(sectionText, severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:241:    .map((line) => parseFindingLine(line.replace(/^-\s+/, ''), severity))
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:249: * @returns {Object} Parsed iteration with focus, findings, cross-reference, and reflection fields
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:260:  const findingsSection = extractSection(markdown, 'Findings') || extractSection(markdown, 'Findings - New');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:267:  const p0Block = extractSubsection(findingsSection, 'P0') || extractSubsection(findingsSection, 'P0 Findings');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:268:  const p1Block = extractSubsection(findingsSection, 'P1') || extractSubsection(findingsSection, 'P1 Findings');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:269:  const p2Block = extractSubsection(findingsSection, 'P2') || extractSubsection(findingsSection, 'P2 Findings');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:271:  const findings = [
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:277:  const dimensionsAddressed = (assessmentSection.match(/Dimensions addressed:\s*(.+)/i) || [])[1];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:283:    findings,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:287:    dimensionsAddressed: dimensionsAddressed
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:288:      ? dimensionsAddressed.split(/[,;]/).map((value) => normalizeText(value).toLowerCase()).filter(Boolean)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:312:    if (seen.has(item.findingId)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:315:    seen.add(item.findingId);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:366:    const findingId = normalizeText(getNestedField(record, 'findingId') || '');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:368:    if (!findingId || !finalSeverity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:375:    adjudicationByFinding.set(findingId, {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:376:      findingId,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:521: * Convert a {type:"finding"} delta record to the structured-finding shape
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:527: *   { type:"finding", iteration, id, severity, status, title, file, findingClass,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:531:  if (!record || record.type !== 'finding' || !record.id) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:546:  // Prefer finalSeverity (post-adjudication) over initial severity.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:547:  const rawSeverity = record.finalSeverity || record.severity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:548:  const severity = normalizeSeverity(rawSeverity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:549:  if (!severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:557:    findingId: record.id,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:558:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:563:    findingClass: record.findingClass || null,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:569:    // Content hashes let the registry collapse repeated findings across review
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:570:    // dimensions; legacy records remain valid without one.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:571:    contentHash: typeof record.content_hash === 'string' && record.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:572:      ? record.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:594:    ? getNestedField(record, 'findingsSummary')
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:601:  for (const severity of SEVERITY_KEYS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:602:    const rawCount = summary[severity];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:606:    counts[severity] = count;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:628:function findingDetailToFinding(detail, record, index) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:632:  const severity = normalizeSeverity(detail.finalSeverity || detail.severity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:633:  if (!severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:637:  const findingId = normalizeText(detail.id || detail.findingId || '')
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:638:    || `SUMMARY-${run}-${severity}-${String(index + 1).padStart(3, '0')}`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:641:    findingId,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:642:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:643:    title: normalizeText(detail.title || `Summary ${severity} finding`),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:649:    findingClass: detail.findingClass || null,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:653:    contentHash: typeof detail.content_hash === 'string' && detail.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:654:      ? detail.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:671:    const details = Array.isArray(record.findingDetails) ? record.findingDetails : [];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:688:function countFindingsSeenInRun(findingById, run) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:690:  for (const finding of findingById.values()) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:691:    if (!SEVERITY_KEYS.includes(finding.severity)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:694:    if (finding.firstSeen <= run && finding.lastSeen >= run) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:695:      counts[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:701:function summarySlotFinding(run, severity, slotIndex, record) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:703:    findingId: `SUMMARY-${severity}-${String(slotIndex + 1).padStart(3, '0')}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:704:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:705:    title: `Summary ${severity} finding ${slotIndex + 1}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:709:    findingClass: 'summary-only',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:718:  const details = Array.isArray(record.findingDetails) ? record.findingDetails : [];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:720:    .map((detail, index) => findingDetailToFinding(detail, record, index))
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:723:  for (const finding of detailFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:724:    detailCounts[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:732:  const findings = [...detailFindings];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:733:  for (const severity of SEVERITY_KEYS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:734:    const alreadyRepresented = (representedCounts[severity] || 0) + detailCounts[severity];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:735:    const missingCount = Math.max(0, summary[severity] - alreadyRepresented);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:737:      findings.push(summarySlotFinding(run, severity, alreadyRepresented + index, record));
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:740:  return findings;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:744: * Build a two-tier dedup key. Primary: content_hash. Fallback for legacy
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:748:function findingDedupKey(finding) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:749:  if (finding.contentHash) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:750:    return `ch:${finding.contentHash}`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:752:  const file = finding.file || '';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:753:  const line = isFiniteNumber(finding.line) ? finding.line : '';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:754:  const title = normalizeText(finding.title || '').toLowerCase().slice(0, 80);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:758:function dedupeDimensions(dimensions) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:761:  for (const dimension of dimensions) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:762:    if (!dimension) continue;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:763:    if (seen.has(dimension)) continue;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:764:    seen.add(dimension);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:765:    out.push(dimension);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:771: * Collapse cross-dimension restatements into one canonical entry with a merged
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:772: * `dimensions[]` list. Same-id entries are already merged upstream, so this only
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:773: * handles genuine cross-id duplicates while unique findings stay independent.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:775:function collapseFindingsByDedupKey(findingEntries) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:777:  for (const finding of findingEntries) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:778:    const key = findingDedupKey(finding);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:782:        ...finding,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:783:        dimensions: dedupeDimensions([finding.dimension]),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:788:    // Keep the earliest-discovered finding as canonical; fold the duplicate in.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:789:    if (isFiniteNumber(finding.firstSeen) && finding.firstSeen < existing.firstSeen) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:790:      existing.firstSeen = finding.firstSeen;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:792:    if (isFiniteNumber(finding.lastSeen) && finding.lastSeen > existing.lastSeen) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:793:      existing.lastSeen = finding.lastSeen;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:795:    existing.dimensions = dedupeDimensions([...existing.dimensions, finding.dimension]);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:796:    if (finding.findingId && finding.findingId !== existing.findingId
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:797:      && !existing.mergedFindingIds.includes(finding.findingId)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:798:      existing.mergedFindingIds.push(finding.findingId);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:800:    existing.transitions = mergeTransitions(existing.transitions, finding.transitions);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:806:  const findingById = new Map();
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:809:  function upsertFinding(finding, run, iteration, initialReason, adjustmentReason) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:810:    const claimAdjudication = claimAdjudicationByFinding.get(finding.findingId);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:811:    const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:812:    const existing = findingById.get(finding.findingId);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:814:      findingById.set(finding.findingId, {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:815:        ...finding,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:816:        severity: canonicalSeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:817:        dimension: deriveDimension(
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:818:          { ...finding, severity: canonicalSeverity },
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:837:    if (existing.severity !== canonicalSeverity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:840:        from: existing.severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:844:      existing.severity = canonicalSeverity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:851:  // Structured finding rows are the primary source because they carry exact
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:852:  // severity, status, file evidence, and claim fields from the loop runtime.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:856:    const finding = deltaRecordToFinding(record);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:857:    if (!finding) continue;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:862:    deltaFindingsByRun.get(run).push(finding);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:866:  // Cross-reference iteration markdown files for focus/dimensionsAddressed
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:871:    const pseudoIteration = iterationByRun.get(run) || { focus: '', run, dimensionsAddressed: [] };
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:872:    for (const finding of deltaFindingsByRun.get(run)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:873:      upsertFinding(finding, run, pseudoIteration, 'Initial discovery (delta)', 'Severity adjusted in later delta');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:878:    for (const finding of iteration.findings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:879:      upsertFinding(finding, iteration.run, iteration, 'Initial discovery', 'Severity adjusted in later iteration');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:891:      dimensionsAddressed: Array.isArray(record.dimensions)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:892:        ? record.dimensions.map((value) => normalizeText(value).toLowerCase()).filter(Boolean)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:895:    const representedCounts = countFindingsSeenInRun(findingById, run);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:897:    for (const finding of fallbackFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:899:        finding,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:917:  // Deduplicate restatements before splitting open and resolved findings.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:918:  const collapsedFindings = collapseFindingsByDedupKey([...findingById.values()]);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:922:  for (const finding of collapsedFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:923:    // A collapsed finding is resolved only when its canonical id and every
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:925:    const allIds = [finding.findingId, ...(finding.mergedFindingIds || [])];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:928:      finding.status = 'resolved';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:929:      resolvedFindings.push(finding);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:931:      openFindings.push(finding);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:942:  const severityOrder = { P0: 0, P1: 1, P2: 2 };
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:943:  const severityDiff = (severityOrder[left.severity] ?? 9) - (severityOrder[right.severity] ?? 9);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:944:  if (severityDiff !== 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:945:    return severityDiff;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:947:  return left.findingId.localeCompare(right.findingId);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:950:function deriveDimension(finding, iteration) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:951:  const focus = `${iteration.focus} ${finding.title} ${finding.description}`.toLowerCase();
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:952:  for (const dimension of REQUIRED_DIMENSIONS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:953:    if (focus.includes(dimension)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:954:      return dimension;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:957:  return iteration.dimensionsAddressed[0] || 'correctness';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:962:  for (const dimension of REQUIRED_DIMENSIONS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:963:    covered[dimension] = false;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:967:    if (!Array.isArray(record.dimensions)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:970:    for (const dimension of record.dimensions) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:971:      const normalized = String(dimension).toLowerCase();
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:983:    for (const dimension of REQUIRED_DIMENSIONS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:984:      if (normalized.includes(dimension)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:985:        covered[dimension] = true;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995:  for (const finding of openFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:996:    if (SEVERITY_KEYS.includes(finding.severity)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:997:      counts[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1055:  // Persist the raw signal payload (dimensionCoverage, findingStability,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1226: * (`{type, description, count, severity}`), prefer `.type`, then `.name`, then
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1303:    finding: 'covered',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1362:      const coverage = record.searchCoverage;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1364:        requiredBugClasses: asStringList(coverage.requiredBugClasses),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1365:        covered: asStringList(coverage.covered),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1366:        ruledOut: asStringList(coverage.ruledOut),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1367:        deferred: asStringList(coverage.deferred),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1368:        blocked: asStringList(coverage.blocked),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1369:        graphCoverageMode: normalizeText(coverage.graphCoverageMode) || null,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1386:        dimension: normalizeText(row.dimension) || 'UNKNOWN',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1456:  const severityBuckets = ['P0', 'P1', 'P2'];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1476:      if (record.findingsSummary !== undefined) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1477:        const value = record.findingsSummary;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1479:          || !severityBuckets.every((key) => key in value)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1480:          warnings.push({ index, rule: 'findingsSummary-severity-keys', detail: 'findingsSummary must contain P0, P1, P2 keys' });
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1483:      // findingsNew is contractually polymorphic: prompt_pack_iteration.md.tmpl documents it
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1484:      // as an array of new-finding entries, while legacy records emit a {P0,P1,P2} count
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1487:      if (record.findingsNew !== undefined) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1488:        const value = record.findingsNew;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1491:          && severityBuckets.every((key) => key in value);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1493:          warnings.push({ index, rule: 'findingsNew-shape', detail: 'findingsNew must be an array of findings or an object with P0, P1, P2 keys' });
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1496:      if (record.findingDetails !== undefined && !Array.isArray(record.findingDetails)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1497:        warnings.push({ index, rule: 'findingDetails-array', detail: 'findingDetails must be an array' });
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1508:  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1509:  const findingsBySeverity = buildFindingsBySeverity(openFindings);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1520:  // so persistent-same-severity findings and severity-churn findings don't collapse.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1521:  const persistentSameSeverity = openFindings.filter((finding) => {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1522:    if (finding.lastSeen - finding.firstSeen < 1) return false;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1523:    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1529:  const severityChanged = openFindings.filter((finding) => {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1530:    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1536:  // New code should read persistentSameSeverity + severityChanged directly.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1537:  const repeatedFindings = openFindings.filter((finding) => finding.lastSeen - finding.firstSeen >= 1);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1551:    severityChanged,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1553:    dimensionCoverage,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1554:    findingsBySeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1592:  const coverage = registry.searchCoverage && typeof registry.searchCoverage === 'object'
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1602:      `- graphCoverageMode: ${coverage.graphCoverageMode || 'none'}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1607:    `- graphCoverageMode: ${coverage.graphCoverageMode || 'none'}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1663:      const suffix = content.endsWith('\n') ? '' : '\n';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1664:      return `${content}${suffix}\n${replacement}\n`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1699:  const severity = registry.findingsBySeverity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1701:    `- P0 (Blockers): ${severity.P0}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1702:    `- P1 (Required): ${severity.P1}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1703:    `- P2 (Suggestions): ${severity.P2}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1708:    .filter((dimension) => registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1709:    .map((dimension) => `- [x] ${dimension}`)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1713:    .filter((dimension) => !registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1714:    .map((dimension) => `- [ ] ${dimension}`)
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1715:    .join('\n') || '[All dimensions complete]';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1717:  // Default next-focus comes from latest iteration → first uncovered dimension → fallback.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1719:    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1720:    || '[All dimensions covered]';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1752:  updated = replaceAnchorSection(updated, 'review-dimensions', '3. REVIEW DIMENSIONS (remaining)', remainingDimensions, anchorOptions);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1753:  updated = replaceAnchorSection(updated, 'completed-dimensions', '4. COMPLETED DIMENSIONS', completedDimensions, anchorOptions);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1754:  updated = replaceAnchorSection(updated, 'running-findings', '5. RUNNING FINDINGS', runningFindings, anchorOptions);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1798:    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1799:    || '[All dimensions covered]';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1802:  const severity = registry.findingsBySeverity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1804:  const verdict = severity.P0 > 0
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1806:    : severity.P1 > 0 || hasSearchDebt
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1809:  const hasAdvisories = verdict === 'PASS' && severity.P2 > 0;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1814:      const dimensions = Array.isArray(record.dimensions) ? record.dimensions.join('/') : '-';
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1816:      const summary = record.findingsSummary || {};
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1817:      const findings = `${summary.P0 ?? 0}/${summary.P1 ?? 0}/${summary.P2 ?? 0}`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1818:      return `| ${record.run} | ${record.focus || 'unknown'} | ${dimensions} | ${ratio} | ${findings} | ${record.status || 'complete'} |`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1822:  const dimensionRows = REQUIRED_DIMENSIONS
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1823:    .map((dimension) => {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1824:      const covered = registry.dimensionCoverage[dimension];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1826:      const openInDimension = registry.openFindings.filter((finding) => finding.dimension === dimension).length;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1827:      return `| ${dimension} | ${status} | ${openInDimension} |`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1839:    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1864:    '<!-- ANCHOR:dimension-expansion -->',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1879:    '<!-- /ANCHOR:dimension-expansion -->',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1880:    '<!-- ANCHOR:findings-summary -->',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1885:    `| P0 (Blockers) | ${severity.P0} |`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1886:    `| P1 (Required) | ${severity.P1} |`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1887:    `| P2 (Suggestions) | ${severity.P2} |`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1890:    '<!-- /ANCHOR:findings-summary -->',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1899:    '<!-- ANCHOR:dimension-coverage -->',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1902:    '| Dimension | Status | Open findings |',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1904:    dimensionRows,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1906:    '<!-- /ANCHOR:dimension-coverage -->',
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1945:    `- severityChanged: ${(registry.severityChanged || []).length}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1973:      // claim-adjudication and legal-stop gate failures, not just severity.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1978:      if (severity.P0 > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1979:        lines.push(`- ${severity.P0} active P0 finding(s) blocking release.`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1981:      if (severity.P1 > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1982:        lines.push(`- ${severity.P1} active P1 finding(s) — required before release; not a P0 but still blocks PASS.`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1990:          && !normalizeText(getNestedField(record, 'findingId') || ''));
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1991:      const activeP0P1 = severity.P0 + severity.P1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2009:      if (severity.P2 > 0 && lines.length === 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2010:        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2045:  const registryPath = path.join(reviewDir, 'deep-review-findings-registry.json');
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2076:  // Load delta payloads up-front so the finding registry can use structured
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2232:  findingDedupKey,
../../../../../skills/system-deep-loop/deep-review/references/state/state_outputs.md:32:| `deep-review-findings-registry.json` | Reducer | Regenerated | Active, resolved, repeated, and blocked findings |
../../../../../skills/system-deep-loop/deep-review/references/state/state_outputs.md:35:| `iterations/iteration-NNN.md` | Iteration agent | Write-once | Detailed findings for one pass |
../../../../../skills/system-deep-loop/deep-review/references/state/state_outputs.md:57:The line maps to the findings in that iteration only. Synthesis computes the final release verdict from the full state.
../../../../../skills/system-deep-loop/deep-review/references/state/state_outputs.md:67:- Dimension coverage.
../../../../../skills/system-deep-loop/deep-review/references/state/state_outputs.md:82:- Active finding registry.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:31:- Adding or checking Review Depth Schema v2 target selection, search coverage, and ledger fields.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:39:| Iteration record | Captures focus, reviewed files, findings, convergence ratios, and graph events. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:41:| Review Depth Schema v2 | Adds target selection, search coverage, and ledger proof for deeper review iterations. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:61:  "dimensions": ["traceability", "maintainability"],
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:68:  "findingsCount": 4,
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:69:  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:70:  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:71:  "findingDetails": [
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:74:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:76:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:79:      "recommendation": "Update the consumer and add verification.",
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:81:      "findingClass": "cross-consumer",
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:91:**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:93:**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`, `graphEvents`
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:98:| dimensions | string[] | Review dimensions addressed this iteration |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:103:| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:104:| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:105:| findingDetails | array | Active findings with `id`, `severity`, `title`, `dimension`, `file`, `evidence`, `recommendation`, `disposition`, `findingClass`, `scopeProof`, and `affectedSurfaceHints`, use `[]` when there are no findings |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:106:| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:112:| rollingAvg | 0.30 | Rolling average of severity-weighted new findings |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:114:| dimensionCoverage | 0.45 | Required dimension + protocol coverage stability |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:121:The optional `graphEvents` array records coverage graph mutations emitted by a review iteration. The MCP coverage graph handlers (`mcp_server/handlers/coverage-graph/upsert.ts`) consume these events and persist them into `deep-loop-graph.sqlite`, where they become the source of truth for graph-assisted convergence, hotspot saturation, and blocked-stop evidence.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:127:  "dimensions": ["correctness"],
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:129:  "findingsSummary": { "P0": 0, "P1": 1, "P2": 0 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:130:  "findingsNew": { "P0": 0, "P1": 1, "P2": 0 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:136:    { "type": "dimension", "id": "d-correctness", "label": "correctness" },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:138:    { "type": "finding", "id": "f-001", "label": "Missing CSRF token check on session POST" },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:153:| type | `"dimension"` \| `"file"` \| `"finding"` \| `"evidence"` \| `"remediation"` \| `"edge"` | Yes | Review-loop node kind or the literal `"edge"` for relation rows |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:155:| label | string | Yes | Human-readable name/caption (dimension, path, finding title, evidence anchor, etc.) |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:163:`graphEvents` entries are scoped by the session that emits them. The coverage graph DB uses a composite primary key of `(spec_folder, loop_type, session_id, id)`, so two independent review sessions in the same spec folder MAY reuse the same logical `id` without collision, each session gets its own row.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:168:2. **No cross-session global uniqueness requirement**: callers MUST NOT prefix ids with the session id or random salt to "avoid collisions". The DB layer handles namespace isolation. Salting ids only makes provenance harder to read.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:172:The collision regression in `.opencode/skills/system-spec-kit/scripts/tests/session-isolation.vitest.ts` ("shared-ID collisions" block) exercises this contract directly: two sessions upsert identical node and edge ids, and both rows must survive independently.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:181:  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:186:**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:198:  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:201:    "dimensionCoverageGate": {
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:210:    "fixCompletenessReplayGate": { "pass": true, "securitySensitive": false, "requiredRows": 0, "passingRows": 0 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:214:  "recoveryStrategy": "Cover the missing review dimensions, then resolve the active P0.",
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:221:`gateResults` carries the full 9-gate set emitted by `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate`. The last two are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. See `../convergence/convergence.md` §Section-1 for the authoritative shape.
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:237:    "dimensionCoverage": 1,
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:238:    "findingStability": 0.88,
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:318:      "evidence": ["README.md:48"], "findingRefs": ["F004"],
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:335:| results[].findingRefs | string[] | No | Related finding identifiers |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:343:- `findingsSummary` and `findingsNew` must each contain `P0`, `P1`, `P2` keys
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:344:- `findingDetails` must be an array. Each active item must include `findingClass`, `scopeProof`, and `affectedSurfaceHints`
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:360:- Required: `id, dimension, targetRefs, bugClass, disposition, rationale`
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:364:  - `finding` → `linkedFindingId` (must reference an id present in `findingDetails[]`)
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:386:| `selectionReason` | string | Yes | Why these targets were highest-value for the dimension or bug class. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:389:| `graphStatus` | `'available' \| 'unavailable' \| 'partial'` | Yes | Code/coverage graph availability for this iteration's target selection. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:398:| `covered` | string[] | Yes | Required classes searched with conclusive finding or clean proof. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:409:| `dimension` | string | Yes | Review dimension addressed by this row. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:414:| `disposition` | string | Yes | One of `finding`, `ruled_out`, `deferred`, `blocked`, `not_applicable`. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:419:| `finding` | `linkedFindingId` | Must reference an `id` present in `findingDetails[]`. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:434:  "dimensions": ["correctness"],
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:436:  "findingsSummary": { "P0": 0, "P1": 0, "P2": 0 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:437:  "findingsNew": { "P0": 0, "P1": 0, "P2": 0 },
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:438:  "findingDetails": [],
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:449:  "searchLedger": [{ "id": "SL-001", "dimension": "correctness", "targetRefs": ["src/review-target.ts"], "bugClass": "state_transition", "hypothesis": "state transition can skip validation", "searchActions": [{ "method": "direct_read", "queryOrPath": "src/review-target.ts", "result": "validation guard present on all branches", "evidenceRefs": ["src/review-target.ts:42"] }], "disposition": "ruled_out", "rationale": "all mutation branches call the validator", "ruledOutReason": "guard verified by direct read" }]
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:459:| v2 standard/complex | Parse v2 fields in addition to v1 required fields. | Enforce v2 shape, ledger linkage, coverage reconciliation, and evidence refs. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_jsonl.md:461:Phase E reducer/dashboard/report work must preserve and expose `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`. Until Phase E ships, these are contract obligations only. `deep-review-findings-registry.json`, `deep-review-dashboard.md`, and `review-report.md` are not expected to persist them.
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:107:      : await import('../lib/coverage-graph/coverage-graph-db.ts');
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:112:      : await import('../lib/coverage-graph/coverage-graph-query.ts');
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:198:        if (loopType !== 'research') throw inputError('uncovered_questions is only valid for research graphs; use coverage_gaps for review graphs');
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:201:      case 'coverage_gaps': {
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:206:      case 'unverified_claims': {
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:207:        const claims = query.findUnverifiedClaims(ns);
../../../../../skills/system-deep-loop/runtime/scripts/query.cjs:208:        data = { queryType, namespace: ns, scopeMode: 'session', claims: claims.slice(0, limit), totalUnverified: claims.length };
../../../../../skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:204: * variable is set. Used by contract tests to verify that scripts
../../../../../skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:397:      // claim an unverifiable lock.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:3:description: End-to-end fixture for the deep-review blocked_stop reducer path.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:8:This fixture demonstrates the full `blocked_stop -> registry -> dashboard` reducer path for a review packet.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:10:For Gate E continuity, this fixture stays supporting evidence only. Broader packet recovery still routes through `/speckit:resume`, then `handover.md`, `_memory.continuity`, and the remaining spec docs.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:14:- A severity upgrade where `F002` moves from `P2` in iteration 1 to `P1` in iteration 3
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:16:- Three iteration files that let the reducer populate `blockedStopHistory`, `persistentSameSeverity`, and `severityChanged`
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:18:This fixture is intended to exercise:
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:20:- `REQ-021` reducer handling for blocked-stop history plus severity-transition tracking
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:26:  .opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:2:  "topic": "Reducer blocked-stop fixture for deep review review-mode packets",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:3:  "sessionId": "rvw-blocked-stop-fixture",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:15:  "specFolder": ".opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:21:  "reviewTarget": "blocked-stop-session fixture",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:22:  "reviewTargetType": "fixture",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:29:  "severityThreshold": "P2",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:2:  "sessionId": "rvw-blocked-stop-fixture",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:7:      "findingId": "F001",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:8:      "severity": "P0",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:13:      "dimension": "security",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:27:      "findingId": "F002",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:28:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:33:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:53:      "findingId": "F003",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:54:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:59:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:78:        "dimensionCoverageGate",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:86:        "dimensionCoverageGate": {
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:109:      "recoveryStrategy": "Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:115:      "findingId": "F001",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:116:      "severity": "P0",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:121:      "dimension": "security",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:135:      "findingId": "F003",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:136:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:141:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:155:  "severityChanged": [
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:157:      "findingId": "F002",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:158:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:163:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:185:      "findingId": "F001",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:186:      "severity": "P0",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:191:      "dimension": "security",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:205:      "findingId": "F002",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:206:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:211:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:231:      "findingId": "F003",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:232:      "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:237:      "dimension": "correctness",
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:251:  "dimensionCoverage": {
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:257:  "findingsBySeverity": {
../../../../../skills/system-deep-loop/runtime/scripts/status.cjs:131:      : await import('../lib/coverage-graph/coverage-graph-db.ts');
../../../../../skills/system-deep-loop/runtime/scripts/status.cjs:174:    const signals = await import('../lib/coverage-graph/coverage-graph-signals.ts');
../../../../../skills/system-deep-loop/runtime/scripts/upsert.cjs:109:  if (isCouncil) throw inputError('seed options are only supported for coverage graph loops');
../../../../../skills/system-deep-loop/runtime/scripts/upsert.cjs:163:      : await import('../lib/coverage-graph/coverage-graph-db.ts');
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:8:Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:15:- Review Target: blocked-stop-session fixture (fixture)
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:21:- Session ID: rvw-blocked-stop-fixture
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:38:| 1 | Correctness review of reducer fixture state transitions | correctness | 0.55 | 0/1/1 | complete |
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:40:| 3 | Security verification of the blocked-stop path | correctness/security | 0.15 | 1/2/0 | complete |
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:44:| Dimension | Status | Open findings |
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:52:### Iteration 3 — blocked by [dimensionCoverageGate, p0ResolutionGate]
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:53:- Recovery: Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:54:- Gate results: convergenceGate: true, dimensionCoverageGate: false, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:67:- severityChanged: 1
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:74:Resolve F001 first, then add traceability and maintainability coverage so the legal-stop gates can be re-evaluated without an active blocker.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:77:- 1 active P0 finding(s) blocking release.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:3:description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:14:Serves as the persistent brain for this blocked-stop review fixture. Records which dimensions remain, what was found, what approaches failed, and where the next iteration should focus.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:19:- Per iteration: Capture findings, blocked-stop history, and the next focus signal.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:20:- Mutability: Mutable within this fixture only.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:27:Blocked-stop fixture that exercises legal-stop gating, registry lineage, and dashboard surfacing for review mode.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:36:- This fixture does not model synthesis completion.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:37:- This fixture does not attempt to resolve any finding.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:42:- Stop only after all required dimensions are covered and no active P0 remains.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:58:- Iteration files keep the finding lineage explicit across severity changes.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:64:- Convergence alone is insufficient when dimension coverage and P0 resolution gates still fail.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:69:### A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data. -- BLOCKED (iteration 2, 1 attempts)
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:70:- What was tried: A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:72:- Do NOT retry: A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:79:### Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active. -- BLOCKED (iteration 3, 1 attempts)
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:80:- What was tried: Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:82:- Do NOT retry: Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:105:BLOCKED on: dimensionCoverageGate, p0ResolutionGate
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:106:Recovery: Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:110:- This fixture is intentionally incomplete on traceability and maintainability coverage.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:111:- F002 is expected to show a severity transition from P2 to P1.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:133:[Per-file coverage state table -- populated during initialization from scope discovery]
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:149:- Session lineage: sessionId=rvw-blocked-stop-fixture, parentSessionId=null, generation=1, lineageMode=new
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:150:- Findings registry: `deep-review-findings-registry.json`
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:154:- Review target type: fixture
../../../../../skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:80:// descriptive suffix (iteration-NNN-some-focus.md), so match the padded number as a
../../../../../skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:81:// prefix bounded by "." or "-" to avoid confusing 002 with 020.
../../../../../skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:123:function verify(loopType, artifactDir, iteration) {
../../../../../skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:178:    process.stdout.write('Usage: verify-iteration.cjs --loop-type review|research|context|alignment --artifact-dir <dir> --iteration <N> [--json]\n');
../../../../../skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:186:  const result = verify(args.loopType, args.artifactDir, args.iteration);
../../../../../skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:201:module.exports = { verify, checkRouteProof, findIterationNarrative, readJsonlRecords, pad3, REASONS, LEAF_BY_LOOP, STATE_LOG_BY_LOOP };
../../../../../skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:520:        severity: 'warning',
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:87:  if (mode === 'fix') {
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:96:// (target, :auto suffix, spec_folder, topic, flags) arrives only via this prelude's
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:99:function buildInvocationPrefix(argsText) {
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:108:      'Bind setup from the MESSAGE above — the target, the `:auto`/`:confirm` suffix, `--spec-folder`, the research topic, and other flags are there. When ARGS_PRESENT=true you MUST proceed on that MESSAGE now: do NOT ask the setup question, and do NOT treat a populated MESSAGE as empty.',
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:141:  const prefix = buildInvocationPrefix(argsText);
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:142:  const output = Buffer.concat([prefix, body]);
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:149:  return { command: definition.command, mode, output, body, prefix, manifestRow };
../../../../../skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:257:  buildInvocationPrefix,
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md:4:Correctness review of reducer fixture state transitions and registry bookkeeping.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md:20:Expand into security review around export and reducer boundary handling to verify whether any active path can escalate beyond correctness-only impact.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md:1:# Iteration 3: Blocked-stop verification before legal stop
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md:4:Security verification of the blocked-stop path before a legal stop decision.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md:12:- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Security review showed the stale snapshot can preserve an outdated legal-stop decision, so severity is upgraded from advisory to required.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md:18:- Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md:21:Resolve F001 first, then add traceability and maintainability coverage so the legal-stop gates can be re-evaluated without an active blocker.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:4:Security review after export-path escalation from the blocked-stop fixture.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:17:- A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.
../../../../../skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:23:Keep the security path under review, verify whether the stale stop-gate snapshot can influence blocker handling, and preserve the active P0 until the export boundary is proven safe.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:24:This reference is the authoritative checklist for "is this review loop actually done." SKILL.md §6 SUCCESS CRITERIA carries a condensed summary and links here for the full enumeration; use this file when verifying a completed run, debugging a premature STOP, or reconciling completion metadata against the loop's real state.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:35:`references/protocol/loop_state_and_gates.md` defines the three state-machine-level binary gates (Evidence, Scope, Coverage) that block a STOP *decision* inside the convergence check. This file is the broader definition-of-done: it also covers artifact existence, report structure, severity-field completeness, and the release-readiness handoff -- checked once the loop believes it has already reached STOP.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:44:- Every configured review dimension has at least one full iteration of coverage recorded in `deep-review-state.jsonl` and reflected in `deep-review-strategy.md`.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:46:- All canonical state files exist and parse cleanly: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, and one `iterations/iteration-NNN.md` per dispatched iteration.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:59:- **State consistency**: `deep-review-state.jsonl` opens with the config record and appends one iteration record per dispatched iteration. Reducer-owned fields in `deep-review-findings-registry.json` reconcile against JSONL totals.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:60:- **Iteration completeness**: every dispatched iteration produced both an `iterations/iteration-NNN.md` (non-empty, ending with the canonical `Review verdict: PASS|CONDITIONAL|FAIL` line) AND a JSONL delta record with `findingDetails[]`, `findingsSummary`, `newFindingsRatio`.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:61:- **Severity coverage**: every reported finding carries `severity` in {P0, P1, P2}, `category`, `file:line` evidence, `finding_class`, and a `content_hash` for synthesis dedup.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:62:- **Advisory numeric score**: `riskScore` may appear in finding details as non-gating context only; verdict logic must ignore it.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:63:- **Adversarial replay**: every P0 finding survived adversarial self-check. Rejected P0s downgraded with rationale recorded in the iteration narrative.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:64:- **Coverage threshold**: `dimensions_covered_count == configured_dimensions_count` AND required traceability protocols covered, stable for at least `minStabilizationPasses` iterations.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:65:- **Acceptance coverage**: when the spec-folder lifecycle predicate is active, the final report records `AC_COVERAGE` status, covered/total, floor, and next action; default-off INFO output is advisory and does not by itself block STOP.
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:66:- **Security-sensitive override**: when the run targets security, path handling, env precedence, schema boundaries, persistence, or shared policy, the gates from `references/convergence/convergence.md` "Security-Sensitive Fix Overrides" apply (`minStabilizationPasses=2`, closed-finding replay required, fix-completeness gate enforced).
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:74:- The final report records stop reason, iteration count, dimension coverage, severity counts (P0/P1/P2), verdict (PASS / CONDITIONAL / FAIL), and release-readiness state (`in-progress`, `converged`, `release-blocking`).
../../../../../skills/system-deep-loop/deep-review/references/protocol/completion_criteria.md:75:- Verdict logic matches: PASS = no P0/P1 findings (P2 advisories permitted with `hasAdvisories: true`). CONDITIONAL = P1 findings present with remediation plan. FAIL = any P0 confirmed after adversarial self-check.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:56:Each agent dispatch gets a fresh context window. State continuity comes from files on disk, not in-context memory. This eliminates context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:74:Set up all state files for a new review session. Discover the scope, order dimensions by risk priority, establish the traceability protocol plan, and create the review state packet.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:98:4. **Dimension ordering**: Order the 4 review dimensions for iteration based on risk priority:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:107:   Default order: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. This order is configurable but the default prioritizes highest-impact dimensions first.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:122:6. **Write config**: `{artifact_dir}/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:126:8. **Initialize reducer state**: Create `{artifact_dir}/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:135:   - `resource-map.md not present. Skipping coverage gate` when it does not
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:137:9a. **Initialize resource-map coverage state**:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:143:   - In **confirm mode**: present the charter (target, dimensions, scope, non-goals) for user review before proceeding
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:146:11. **Resume only if config, JSONL, strategy, and findings registry agree**. Otherwise halt for repair instead of guessing.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:154:| Registry | `{artifact_dir}/deep-review-findings-registry.json` | Reducer-owned findings state |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:155:| Strategy | `{artifact_dir}/deep-review-strategy.md` | Dimensions, findings, next focus |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:165:- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:166:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:167:- Read `{artifact_dir}/deep-review-strategy.md` -- get next focus dimension/files, remaining dimensions, and protocol gaps
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:174:| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:175:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:185:  - Dimension coverage reaches 100% across the 4-dimension model
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:188:  - Evidence, scope, and coverage gates pass
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:191:If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records nine review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate` (see `../convergence/convergence.md` §Section-1 blocked_stop event example for the authoritative shape). The Step 4a claim-adjudication path treats `claimAdjudicationGate` as a hard STOP gate, so the count covers both the convergence decision tree and the adjudication enforcement path. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:203:| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `rollingStopThreshold` |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:205:| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with stabilization |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:207:**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:213:1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:219:     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:258:Focus Dimension: {strategy.nextFocus.dimension}
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:264:Active Findings: {findingsSummary}
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:268:  - Registry: {artifact_dir}/deep-review-findings-registry.json
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:270:Output: Write findings to {artifact_dir}/iterations/iteration-{NNN}.md
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:280:- `cli-opencode` (spec 018): pipe rendered prompt via stdin to `opencode run --model X --format json --dangerously-skip-permissions --pure --dir {repo_root} [--variant Y]`. **This grants full OS-level workspace write access.** There is no `--sandbox workspace-write` flag in the live command, and `sandboxMode='read-only'` is NOT currently honored/enforced by opencode (no opencode equivalent exists). The only real containment is (a) the prompt-level "ALLOWED WRITE PATHS" / "BANNED OPERATIONS" contract rendered into the iteration prompt (`assets/prompt_pack_iteration.md.tmpl`), which relies on the model obeying instructions rather than an OS-level sandbox, and (b) post-dispatch validation (`validateIterationOutputs`) catching some violations after the fact. Because review targets are arbitrary code/spec files, they MUST be treated as potentially adversarial content (untrusted) for prompt-injection purposes — the same containment posture as untrusted fetched content in deep-research.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:302:During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:320:- `findingRefs`: Array of finding IDs generated from this protocol
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:325:When `config.resource_map_present == true`, at least one loop iteration MUST audit implementation-vs-resource-map coverage:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:334:5. Emit any resulting findings with category `resource-map-coverage`
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:336:When `config.resource_map_present == false`, skip this audit and rely on the `Known Context` note: `resource-map.md not present. Skipping coverage gate`.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:344:   - `dimensions` (array of dimensions covered)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:346:   - `findingsSummary` (cumulative P0/P1/P2 counts)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:347:   - `findingsNew` (this iteration's new findings)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:349:3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:359:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:365:| `findingId` | string | Matches the finding ID in the iteration body |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:366:| `claim` | string | The single assertion the finding makes |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:373:| `transitions` | object[] | Optional, required when `finalSeverity` differs from the originally asserted severity |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:380:4. Confirm or downgrade severity before the finding becomes convergence-visible.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:383:**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated. The original severity is preserved in the iteration file for audit trail.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:393:| Progress Table | Iteration number, focus dimension, `newFindingsRatio`, findings count, status |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:394:| Coverage | Files reviewed, dimensions completed, traceability protocol status |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:417:| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity**: if reviewing at file level, zoom into functions, if reviewing functions, zoom out to module level |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:419:| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review**: explicitly search for P0/P1 patterns or downgrade unsupported severity claims |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:427:  // Same dimension stuck? Change granularity
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:429:    return { strategy: "change_granularity", dimension: lastFocuses[0] }
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:435:  // Default: escalate severity
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:436:  return { strategy: "escalate_severity_review" }
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:440:- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:441:- If recovery iteration finds only P2 or nothing: recovery failed. If all dimensions are already covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:449:Compile all iteration findings into the final `{artifact_dir}/review-report.md`. The synthesis phase owns the canonical review report output.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:455:Consolidate findings across all iterations:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:458:2. Group findings by file + line range + root cause
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:459:3. Merge duplicates, keeping the highest severity and all evidence
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:460:4. Assign final finding IDs: `F001`, `F002`, ...
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:461:5. Preserve the audit trail: note which iterations contributed to each merged finding
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:465:Use adjudicated `finalSeverity` for any P0/P1 that was downgraded during claim adjudication (Step 4a of the iteration loop). The original severity from the iteration file is preserved in the audit appendix.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:472:2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:473:3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:474:4. Re-run the evidence, scope, and coverage gates against stored findings and scope data
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:489:| 3 | Active Finding Registry | Deduplicated active findings with evidence and final severity |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:490:| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:505:| **CONDITIONAL** | No active P0, but active P1 remains | `/speckit:plan` for fixes |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:508:When `PASS` verdict is issued and active P2 findings remain, set `hasAdvisories = true` in the report metadata.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:524:     "dimensionCoverage": X,
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:540:1. **Compose context payload**: Create a structured JSON payload with the review summary, active findings, verdict, next action, and relevant artifacts. Use `specFolder` for the target packet and include curated `observations`, `recent_context`, `toolCalls`, and `exchanges` when available.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:544:   node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"{spec_folder}","sessionSummary":"Deep review completed; see review/review-report.md for verdict and findings."}' {spec_folder}
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:570:1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:572:3. **Read strategy**: Load current dimension progress, findings, and next focus from `deep-review-strategy.md`
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:582:The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures. Until then treat the contract below as canonical.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:625:| 2 | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract dimensions, findings, coverage |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:652:- The user is notified with current state (iteration count, dimensions covered, findings)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:674:| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:702:| Review Contract | `assets/review_mode_contract.yaml` | Single source of truth for dimensions, verdicts, gates, protocols |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:736:2. Append a JSONL delta record to `{state_paths.state_log}` with required fields: `type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:760:- Convergence detection, lifecycle events (new/resume/restart), the review dimensions pass, and stuck_recovery stay YAML-driven.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:7:  - "review severity weights"
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:29:| `deep-review-findings-registry.json` | JSON | Auto-generated reducer state |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:40:  deep-review-findings-registry.json
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:62:- Authoring fixtures that need to round-trip through the reducer.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:86:  "severityThreshold": "P2",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:100:    "deep-review-findings-registry.json": "auto-generated",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:111:    "outputs": ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:113:      "dimensionsCovered",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:114:      "findingsBySeverity",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:138:| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:140:| severityThreshold | string | `"P2"` | Minimum severity to report: `P0`, `P1`, `P2` |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:194:| review-dimensions | Each iteration | Unchecked dimensions drive next focus |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:195:| completed-dimensions | Each iteration | Checked dimensions with verdict summary |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:196:| running-findings | Each iteration | P0/P1/P2 active counts + deltas |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:204:| files-under-review | Each iteration | Per-file coverage state table |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:211:| review-dimensions | Key Questions (remaining) |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:212:| completed-dimensions | Answered Questions |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:213:| running-findings | _(none, review-specific)_ |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:223:2. Move completed dimensions from "remaining" to "completed" with `[x]` and verdict
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:224:3. Update running-findings with P0/P1/P2 counts and deltas
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:227:6. Set next-focus based on remaining dimensions and open findings
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:231:## 5. FINDINGS REGISTRY (deep-review-findings-registry.json)
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:244:  "severityChanged": [],
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:246:  "dimensionCoverage": {
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:252:  "findingsBySeverity": {
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:274:| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:275:| `severityChanged` | array | Findings that went through at least one severity transition (P0↔P1↔P2) in their `transitions` history. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:276:| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility, new code should read the split arrays. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:309:- New findings: P0=[n] P1=[n] P2=[n]
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:310:- Refined findings: P0=[n] P1=[n] P2=[n]
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:311:- New findings ratio: [0.0-1.0]
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:330:- New findings ratio: [0.0-1.0]
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:344:Every finding must include: unique ID (`F001`...), severity (`P0`/`P1`/`P2`), concrete `file:line` evidence, and dimension tag.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:356:| 3 | Active Finding Registry | Deduped active findings with evidence, severity, dimension |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:358:| 5 | Spec Seed | Minimal spec updates implied by findings |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:359:| 6 | Plan Seed | Initial remediation tasks from findings |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:362:| 9 | Deferred Items | Advisory findings, blocked items, follow-up checks |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:365:**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:369:**Active Finding Registry** lists each active finding with findingId, severity, dimension, title, file:line evidence, first/last seen iteration, and status.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:371:**Remediation Workstreams** group related findings into ordered lanes with constituent finding IDs and execution order.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:373:**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:379:**Deferred Items** captures advisory findings, blocked protocols, and future follow-up checks.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:381:**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:390:- **Generated from**: JSONL state log + strategy + findings registry
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:399:| Progress Table | JSONL | Run, status, focus, dimensions, ratio, duration |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:400:| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:409:Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`), a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:413:Embed the packet inside the iteration file for each new P0/P1 finding. The orchestrator parses it after evaluation and persists the validation result.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:417:  "findingId": "F003",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:420:    ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:154",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:421:    ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:292-302"
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:423:  "counterevidenceSought": "Grepped the module for compound-key upserts, checked migration scripts, and inspected session-isolation.vitest.ts for a collision regression, none found.",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:427:  "downgradeTrigger": "If a composite primary key `(spec_folder, loop_type, session_id, id)` lands and a collision regression covers the ID-reuse path, downgrade to P2 tech-debt.",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:438:| `findingId` | string | Must match the finding ID in the iteration body and registry |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:439:| `claim` | string | The single assertion the finding makes (one sentence, evidence-backed) |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:443:| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication (may differ from the severity originally asserted) |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:445:| `downgradeTrigger` | string | The concrete condition under which this finding should be downgraded in a future iteration |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:446:| `transitions` | object[] | Optional severity transition log, required when `finalSeverity` differs from the originally asserted severity |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:450:1. A packet MUST exist for every new P0/P1 finding introduced in this iteration. Carried-forward findings reuse the previous packet unless severity transitioned.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:453:4. `finalSeverity` MUST match the severity the finding is registered under in the iteration's `Findings` section and in `deep-review-findings-registry.json`.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:461:- Every transition is recorded in the packet's `transitions` array and mirrored into the finding registry's `transitions` field
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:467:Each finding is tracked with a unique identifier enabling deduplication, severity transitions, and status lifecycle.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:473:  "findingId": "F003",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:474:  "severity": "P1",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:475:  "category": "resource-map-coverage",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:477:  "dimension": "traceability",
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:485:    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed real coverage gap against applied target inventory" }
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:492:| findingId | string | Sequential unique ID: `F001`, `F002`, ... |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:493:| severity | `"P0"` / `"P1"` / `"P2"` | Current severity |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:494:| category | `"correctness"` / `"security"` / `"traceability"` / `"maintainability"` / `"resource-map-coverage"` | Primary audit category for the finding, `resource-map-coverage` is reserved for implementation-vs-map coverage gaps |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:496:| dimension | string | Primary dimension: correctness, security, traceability, maintainability |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:506:[discovered] --> active --> resolved    (fixed or confirmed non-issue)
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:522:Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:535:Severity for `resource-map-coverage` findings is calibrated to the coverage-gate outcome:
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:537:- `P1` when an untouched or absent path represents a real coverage gap
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:538:- `P0` only when the missing coverage masks a release-blocking correctness or security risk
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:544:| Evidence | Every active finding backed by concrete file:line evidence |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:546:| Coverage | Required dimensions and required protocols covered |
../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md:548:All three gates must pass before STOP. Gate failure forces `verdict: "FAIL"` regardless of finding counts.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:39:| Evidence | Active findings cite concrete `file:line` evidence and avoid inference-only claims. |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:41:| Coverage | Required dimensions and traceability protocols are complete before STOP. |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:59:[STUCK_RECOVERY] --> change granularity / protocol replay / escalate severity
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:61:    |-- recovered (new P0/P1 or coverage advance) --> [ITERATING]
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:62:    |-- still stuck + dimensions covered --> [SYNTHESIZING] (gaps documented)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:63:    |-- still stuck + dimensions remaining --> [ITERATING] (next dimension)
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:69:[SYNTHESIZING] --> finding dedup, severity reconcile, replay validate, compile report
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:80:- `complete`: Normal iteration with findings processed
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:83:- `stuck`: Iteration produced no meaningful new findings
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:84:- `insight`: Low `newFindingsRatio` but important finding that changes the verdict trajectory
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:95:| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:107:| 2 | Focus exhaustion (2+ low-value iterations on same focus) | Pivot to different dimension or file set | 2 pivots |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:116:Evidence, Scope, and Coverage are the contract-level binary gates defined in `review_mode_contract.yaml` under `qualityGates`, evaluated after the composite convergence score exceeds the `compositeStopScore` threshold. They are necessary but not sufficient on their own: the review-specific legal-stop decision expands them into a **9-gate bundle** (`convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, `graphlessFallbackGate`) emitted by `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`. STOP is legal only when the full 9-gate bundle passes together. The authoritative gate model, event shape, and evaluation pseudocode live in `references/convergence/convergence.md` §6 "Legal-Stop Gate Bundle"; the 3-gate table and pseudocode below illustrate the contract-level layer only, not the complete STOP-legality check.
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:122:| **Evidence** | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, continue loop (persisted via the `blocked_stop` event below) |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:124:| **Coverage** | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, continue loop (persisted via the `blocked_stop` event below) |
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:129:function checkReviewQualityGates(state, config, coverage):
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:133:  for f in state.findings where f.status == "active":
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:135:      violations.push({ gate: "evidence", findingId: f.id,
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:136:                        detail: "Active finding lacks evidence or is inference-only" })
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:140:  for f in state.findings where f.status == "active":
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:142:      violations.push({ gate: "scope", findingId: f.id,
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:146:  if coverage.dimensionCoverage < 1.0:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:147:    violations.push({ gate: "coverage",
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:148:                      detail: "Not all configured review dimensions are covered" })
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:149:  if not coverage.requiredProtocolsCovered:
../../../../../skills/system-deep-loop/deep-review/references/protocol/loop_state_and_gates.md:150:    violations.push({ gate: "coverage",
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:420:    const labelSuffix = rejection.label ? ` lineage=${rejection.label}` : '';
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:421:    process.stderr.write(`[fanout-run] ${rejection.message}${labelSuffix}\n`);
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:424:      severity: 'warning',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1063:          `review_dimensions: all`,
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1114:    'review_dimensions: all',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1252:          severity: 'warning',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1560:      severity: 'error',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1613:      convergence: { status: 'converged', reason: 'empty_tick', no_new_findings: true },
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1706:          severity: 'error',
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1733:      // narrower sandbox; a path-scoped workspace-write would be the stronger fix if the CLIs
../../../../../skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1944:              severity: 'warning',

exec
/bin/zsh -lc 'rg -n "function .*([Dd]edup|[Ff]ind|[Ss]ever)|content_hash|persistentSameSeverity|severityChanged|same file|root cause|claimAdjudication|fixCompleteness|dimensionCoverage" ../../../../../skills/system-deep-loop/deep-review/scripts/reduce-state.cjs ../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md ../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md ../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 exited 2 in 0ms:
rg: ../../../../../skills/system-deep-loop/deep-review/scripts/reduce-state.cjs: No such file or directory (os error 2)
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:136:  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:139:    "dimensionCoverageGate": {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:147:    "claimAdjudicationGate": { "pass": true, "activeP0P1": 2 },
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:148:    "fixCompletenessReplayGate": { "pass": true, "securitySensitive": false, "requiredRows": 0, "passingRows": 0 },
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:161:- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate`. This is the full 9-gate set emitted by `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1, securitySensitive, requiredRows, passingRows, searchDebt, mode, unavailabilityReason). The reducer reads these verbatim and does not coerce shapes. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates, they pass trivially when the review-depth-v2 search path is inactive (no search debt, graph available).
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:195:if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:307:function computeSemanticNovelty_review(currentFindings, priorCumulativeFindings):
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:329:function computeFindingStability(currentRegistry, priorRegistry):
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:417:- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:436:> **GATE MODEL, two naming conventions mapped to one authoritative set.** The authoritative producer is `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`, which emits **9 gates** with the `Gate` suffix: `convergenceGate` / `dimensionCoverageGate` / `p0ResolutionGate` / `evidenceDensityGate` / `hotspotSaturationGate` / `claimAdjudicationGate` / `fixCompletenessReplayGate` / `candidateCoverageGate` / `graphlessFallbackGate`. The §Section-1 event shape (lines 98-119) mirrors this set verbatim and the reducer reads those names verbatim, so treat the event shape as authoritative when writing or reading JSONL state. The §6 table below is the high-level conceptual model and uses descriptive names WITHOUT the `Gate` suffix where one reads more naturally (for example `findingStability` maps to `convergenceGate`); each row carries its event-shape name so the mapping is explicit. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. The gate-model drift cluster (LG-0013, LG-0016, LG-0031, LG-0032) was reconciled in `006-gate-model-reconciliation`.
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:443:| **dimensionCoverage** | `dimensionCoverageGate` | Every configured review dimension must have been examined at least once, with required traceability coverage stabilized | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:447:| (no §6 counterpart) | `claimAdjudicationGate` | Each new P0/P1 finding must carry a typed adjudication packet, missing or failing packets veto STOP | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:448:| **fixCompletenessReplay** | `fixCompletenessReplayGate` | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:461:    dimensionCoverage: {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:468:      pass: countActiveFindings(state, ["P0"]) == 0 and state.claimAdjudicationPassed != false,
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:479:    fixCompletenessReplay: {
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:508:| `dimensionCoverage` | Schedule the next uncovered review dimension immediately. |
../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md:512:| `fixCompletenessReplay` | Replay prior active or remediated P0/P1 gates, then record producer, consumer, and matrix coverage evidence before re-checking STOP. |
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:87:1. **PRIMARY: content_hash** = `sha256(file_path + line_range + finding_type + normalized_description_80chars)`
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:92:2. **FALLBACK (legacy records): file:line + normalized_title** - applied when one or both records lack a `content_hash`, preserving existing behavior unchanged.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:96:When the same `content_hash` appears across iterations from different dimensions, synthesis collapses them to ONE entry with `dimensions: [<all dimensions that emitted it>]` rather than emitting multiple records. Records without `content_hash` fall back to `file:line + normalized_title`; no migration is required for existing JSONL state.
../../../../../skills/system-deep-loop/deep-review/references/state/state_reducer_registry.md:100:Every finding emitted into the JSONL delta (`findingDetails[]`) MUST include a `content_hash` field computed per the two-tier match. `reduce-state.cjs` reads this field for synthesis dedup.
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:279:        - dimensionCoverage
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:368:          - dimensionCoverage

exec
/bin/zsh -lc "rg --files ../../../../../skills/system-deep-loop | rg '/reduce-state\\.cjs"'$|deep_review_(auto|confirm)'"\\.yaml"'$|review_mode_contract'"\\.yaml"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs
../../../../../skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs
../../../../../skills/system-deep-loop/deep-research/scripts/reduce-state.cjs

exec
/bin/zsh -lc 'rg -n "content_hash|findingDetails|persistentSameSeverity|severityChanged|severity|dimensionCoverage|claim_adjudication|fix_completeness|blocked_stop|function .*Finding|function .*finding" ../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs ../../../../../commands/deep/assets/deep_review_auto.yaml ../../../../../commands/deep/assets/deep_review_confirm.yaml' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:199: * @param {string} severity - P0, P1, or P2 context
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:202:function parseFindingLine(line, severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:224:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:232:function parseFindingsBlock(sectionText, severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:241:    .map((line) => parseFindingLine(line.replace(/^-\s+/, ''), severity))
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:358:function buildClaimAdjudicationByFinding(records) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:362:    if (record?.type !== 'event' || record?.event !== 'claim_adjudication') {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:527: *   { type:"finding", iteration, id, severity, status, title, file, findingClass,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:530:function deltaRecordToFinding(record) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:546:  // Prefer finalSeverity (post-adjudication) over initial severity.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:547:  const rawSeverity = record.finalSeverity || record.severity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:548:  const severity = normalizeSeverity(rawSeverity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:549:  if (!severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:558:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:571:    contentHash: typeof record.content_hash === 'string' && record.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:572:      ? record.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:601:  for (const severity of SEVERITY_KEYS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:602:    const rawCount = summary[severity];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:606:    counts[severity] = count;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:612:function parseFindingLocation(fileValue) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:628:function findingDetailToFinding(detail, record, index) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:632:  const severity = normalizeSeverity(detail.finalSeverity || detail.severity);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:633:  if (!severity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:638:    || `SUMMARY-${run}-${severity}-${String(index + 1).padStart(3, '0')}`;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:642:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:643:    title: normalizeText(detail.title || `Summary ${severity} finding`),
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:653:    contentHash: typeof detail.content_hash === 'string' && detail.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:654:      ? detail.content_hash
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:671:    const details = Array.isArray(record.findingDetails) ? record.findingDetails : [];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:688:function countFindingsSeenInRun(findingById, run) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:691:    if (!SEVERITY_KEYS.includes(finding.severity)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:695:      counts[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:701:function summarySlotFinding(run, severity, slotIndex, record) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:703:    findingId: `SUMMARY-${severity}-${String(slotIndex + 1).padStart(3, '0')}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:704:    severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:705:    title: `Summary ${severity} finding ${slotIndex + 1}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:717:function fallbackFindingsFromIterationRecord(record, run, representedCounts) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:718:  const details = Array.isArray(record.findingDetails) ? record.findingDetails : [];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:724:    detailCounts[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:733:  for (const severity of SEVERITY_KEYS) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:734:    const alreadyRepresented = (representedCounts[severity] || 0) + detailCounts[severity];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:735:    const missingCount = Math.max(0, summary[severity] - alreadyRepresented);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:737:      findings.push(summarySlotFinding(run, severity, alreadyRepresented + index, record));
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:744: * Build a two-tier dedup key. Primary: content_hash. Fallback for legacy
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:748:function findingDedupKey(finding) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:775:function collapseFindingsByDedupKey(findingEntries) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:805:function buildFindingRegistry(iterationFiles, iterationRecords, deltaRecords = []) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:809:  function upsertFinding(finding, run, iteration, initialReason, adjustmentReason) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:811:    const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:816:        severity: canonicalSeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:818:          { ...finding, severity: canonicalSeverity },
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:837:    if (existing.severity !== canonicalSeverity) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:840:        from: existing.severity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:844:      existing.severity = canonicalSeverity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:852:  // severity, status, file evidence, and claim fields from the loop runtime.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:941:function compareFindings(left, right) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:942:  const severityOrder = { P0: 0, P1: 1, P2: 2 };
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:943:  const severityDiff = (severityOrder[left.severity] ?? 9) - (severityOrder[right.severity] ?? 9);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:944:  if (severityDiff !== 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:945:    return severityDiff;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:950:function deriveDimension(finding, iteration) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:993:function buildFindingsBySeverity(openFindings) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:996:    if (SEVERITY_KEYS.includes(finding.severity)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:997:      counts[finding.severity] += 1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1055:  // Persist the raw signal payload (dimensionCoverage, findingStability,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1226: * (`{type, description, count, severity}`), prefer `.type`, then `.name`, then
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1264:    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1456:  const severityBuckets = ['P0', 'P1', 'P2'];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1479:          || !severityBuckets.every((key) => key in value)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1480:          warnings.push({ index, rule: 'findingsSummary-severity-keys', detail: 'findingsSummary must contain P0, P1, P2 keys' });
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1491:          && severityBuckets.every((key) => key in value);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1496:      if (record.findingDetails !== undefined && !Array.isArray(record.findingDetails)) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1497:        warnings.push({ index, rule: 'findingDetails-array', detail: 'findingDetails must be an array' });
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1508:  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1520:  // so persistent-same-severity findings and severity-churn findings don't collapse.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1521:  const persistentSameSeverity = openFindings.filter((finding) => {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1529:  const severityChanged = openFindings.filter((finding) => {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1536:  // New code should read persistentSameSeverity + severityChanged directly.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1550:    persistentSameSeverity,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1551:    severityChanged,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1553:    dimensionCoverage,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1699:  const severity = registry.findingsBySeverity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1701:    `- P0 (Blockers): ${severity.P0}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1702:    `- P1 (Required): ${severity.P1}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1703:    `- P2 (Suggestions): ${severity.P2}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1708:    .filter((dimension) => registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1713:    .filter((dimension) => !registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1719:    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1798:    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1802:  const severity = registry.findingsBySeverity;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1804:  const verdict = severity.P0 > 0
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1806:    : severity.P1 > 0 || hasSearchDebt
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1809:  const hasAdvisories = verdict === 'PASS' && severity.P2 > 0;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1824:      const covered = registry.dimensionCoverage[dimension];
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1885:    `| P0 (Blockers) | ${severity.P0} |`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1886:    `| P1 (Required) | ${severity.P1} |`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1887:    `| P2 (Suggestions) | ${severity.P2} |`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1944:    `- persistentSameSeverity: ${(registry.persistentSameSeverity || []).length}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1945:    `- severityChanged: ${(registry.severityChanged || []).length}`,
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1972:      // `blocked_stop` and `claim_adjudication` events so operators see
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1973:      // claim-adjudication and legal-stop gate failures, not just severity.
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1978:      if (severity.P0 > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1979:        lines.push(`- ${severity.P0} active P0 finding(s) blocking release.`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1981:      if (severity.P1 > 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1982:        lines.push(`- ${severity.P1} active P1 finding(s) — required before release; not a P0 but still blocks PASS.`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1988:          && record.event === 'claim_adjudication'
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1991:      const activeP0P1 = severity.P0 + severity.P1;
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2004:        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2009:      if (severity.P2 > 0 && lines.length === 0) {
../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2010:        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
../../../../../commands/deep/assets/deep_review_confirm.yaml:371:          severityThreshold: "P2"
../../../../../commands/deep/assets/deep_review_confirm.yaml:376:          # Semantic: weighted P0/P1/P2 severity ratio. See SKILL.md §"Convergence Threshold Semantics".
../../../../../commands/deep/assets/deep_review_confirm.yaml:398:        content: '{"sessionId":"{session_id_init}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
../../../../../commands/deep/assets/deep_review_confirm.yaml:484:          - last_claim_adjudication_passed: "Scan state.jsonl for the most recent `claim_adjudication` event; use its `passed` boolean. Default true when no event exists or when activeP0 + activeP1 == 0 (gate is vacuous without adjudicable findings)."
../../../../../commands/deep/assets/deep_review_confirm.yaml:485:          - claim_adjudication_active_count: "Count of active P0/P1 findings at the time of the last claim_adjudication event; 0 when none exist"
../../../../../commands/deep/assets/deep_review_confirm.yaml:487:          - fix_completeness_replay_required_rows: "Count prior active or remediated P0/P1 findings, plus any prior security/path P2 findings, that require closed-gate replay before STOP."
../../../../../commands/deep/assets/deep_review_confirm.yaml:488:          - fix_completeness_replay_passing_rows: "Count required replay rows marked PASS with file:line or command evidence and producer/consumer/matrix coverage."
../../../../../commands/deep/assets/deep_review_confirm.yaml:537:             claim_adjudication_gate_pass = (last_claim_adjudication_passed != false) OR (p0_count + p1_count == 0)
../../../../../commands/deep/assets/deep_review_confirm.yaml:538:             If claim_adjudication_gate_pass == false:
../../../../../commands/deep/assets/deep_review_confirm.yaml:544:               Skip hard stops (1) and composite convergence (4); proceed directly to step 5 legal-stop decision-tree assembly so blocked_by_json, gate outputs, and the blocked_stop event still populate consistently.
../../../../../commands/deep/assets/deep_review_confirm.yaml:554:               If graph_decision == "STOP_BLOCKED", set stop_blocked = true and route through blocked_stop emission instead of stopping.
../../../../../commands/deep/assets/deep_review_confirm.yaml:571:               b) dimensionCoverageGate: pass when configured dimensions and required traceability coverage are complete and coverage_age >= 1; record covered and missing dimensions
../../../../../commands/deep/assets/deep_review_confirm.yaml:575:               f) claimAdjudicationGate: pass when claim_adjudication_gate_pass == true (i.e. last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate); record last_claim_adjudication_passed and claim_adjudication_active_count
../../../../../commands/deep/assets/deep_review_confirm.yaml:576:               g) fixCompletenessReplayGate: pass when security_sensitive_fix_scope == false OR every required closed-gate replay row passes with file:line or command evidence and producer/consumer/matrix coverage; record security_sensitive_fix_scope, fix_completeness_replay_required_rows, and fix_completeness_replay_passing_rows
../../../../../commands/deep/assets/deep_review_confirm.yaml:583:               blocked_by_json = JSON array of failing gate names (always include "claimAdjudicationGate" when claim_adjudication_gate_pass == false, "fixCompletenessReplayGate" when fix_completeness_replay_gate_pass == false, "candidateCoverageGate" when candidate_coverage_gate_pass == false, and "graphlessFallbackGate" when graphless_fallback_gate_pass == false)
../../../../../commands/deep/assets/deep_review_confirm.yaml:595:               claim_adjudication_gate_pass = boolean
../../../../../commands/deep/assets/deep_review_confirm.yaml:596:               claim_adjudication_active_count = numeric count of active P0/P1 at the gate
../../../../../commands/deep/assets/deep_review_confirm.yaml:597:               fix_completeness_replay_gate_pass = boolean
../../../../../commands/deep/assets/deep_review_confirm.yaml:599:               fix_completeness_replay_required_rows = numeric count of closed-gate replay rows required for security-sensitive fix reruns
../../../../../commands/deep/assets/deep_review_confirm.yaml:600:               fix_completeness_replay_passing_rows = numeric count of required closed-gate replay rows marked PASS with evidence
../../../../../commands/deep/assets/deep_review_confirm.yaml:636:          - dimension_coverage_gate_pass: "Boolean pass/fail for dimensionCoverageGate"
../../../../../commands/deep/assets/deep_review_confirm.yaml:644:          - claim_adjudication_gate_pass: "Boolean pass/fail for claimAdjudicationGate (false vetoes STOP)"
../../../../../commands/deep/assets/deep_review_confirm.yaml:645:          - claim_adjudication_active_count: "Count of active P0/P1 findings evaluated by claimAdjudicationGate"
../../../../../commands/deep/assets/deep_review_confirm.yaml:646:          - fix_completeness_replay_gate_pass: "Boolean pass/fail for fixCompletenessReplayGate (false vetoes STOP on security-sensitive fix reruns)"
../../../../../commands/deep/assets/deep_review_confirm.yaml:648:          - fix_completeness_replay_required_rows: "Count of closed-gate replay rows required before STOP"
../../../../../commands/deep/assets/deep_review_confirm.yaml:649:          - fix_completeness_replay_passing_rows: "Count of required closed-gate replay rows that passed with evidence"
../../../../../commands/deep/assets/deep_review_confirm.yaml:663:      step_emit_blocked_stop:
../../../../../commands/deep/assets/deep_review_confirm.yaml:666:          append_jsonl: '{"type":"event","event":"blocked_stop","mode":"review","run":{current_iteration},"blockedBy":{blocked_by_json},"gateResults":{"convergenceGate":{"pass":{convergence_gate_pass},"score":{convergence_gate_score}},"dimensionCoverageGate":{"pass":{dimension_coverage_gate_pass},"covered":{dimension_coverage_gate_covered_json},"missing":{dimension_coverage_gate_missing_json}},"p0ResolutionGate":{"pass":{p0_resolution_gate_pass},"activeP0":{active_p0_count}},"evidenceDensityGate":{"pass":{evidence_density_gate_pass},"avgEvidencePerFinding":{avg_evidence_per_finding}},"hotspotSaturationGate":{"pass":{hotspot_saturation_gate_pass}},"claimAdjudicationGate":{"pass":{claim_adjudication_gate_pass},"activeP0P1":{claim_adjudication_active_count}},"fixCompletenessReplayGate":{"pass":{fix_completeness_replay_gate_pass},"securitySensitive":{security_sensitive_fix_scope},"requiredRows":{fix_completeness_replay_required_rows},"passingRows":{fix_completeness_replay_passing_rows}},"candidateCoverageGate":{"pass":{candidate_coverage_gate_pass},"searchDebt":{candidate_coverage_search_debt_json},"missing":{candidate_coverage_missing_json}},"graphlessFallbackGate":{"pass":{graphless_fallback_gate_pass},"mode":"{graphless_fallback_mode}","missing":{graphless_fallback_missing_json},"unavailabilityReason":"{graphless_fallback_unavailability_reason}"}},"graphBlockerDetail":{graph_blockers_json},"recoveryStrategy":"{recovery_strategy}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
../../../../../commands/deep/assets/deep_review_confirm.yaml:939:            - "Escalate severity review: re-examine P2 findings for potential P1 upgrades"
../../../../../commands/deep/assets/deep_review_confirm.yaml:1117:          assert_jsonl_fields: [type, iteration, mode, run, status, focus, dimensions, filesReviewed, findingsCount, findingsSummary, findingsNew, findingDetails, newFindingsRatio, sessionId, generation, lineageMode, timestamp, durationMs]
../../../../../commands/deep/assets/deep_review_confirm.yaml:1142:            severity: "advisory"
../../../../../commands/deep/assets/deep_review_confirm.yaml:1143:            event_shape: '{"type":"event","event":"schema_advisory","mode":"review","iteration":{current_iteration},"warnings":{result.warnings},"severity":"advisory","timestamp":"{ISO_8601_NOW}"}'
../../../../../commands/deep/assets/deep_review_confirm.yaml:1167:          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
../../../../../commands/deep/assets/deep_review_confirm.yaml:1176:      step_post_iteration_claim_adjudication:
../../../../../commands/deep/assets/deep_review_confirm.yaml:1184:            claim_adjudication_passed: true
../../../../../commands/deep/assets/deep_review_confirm.yaml:1185:          append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},"passed":true,"activeP0P1":{active_p0_p1_count},"missingPackets":[],"timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
../../../../../commands/deep/assets/deep_review_confirm.yaml:1190:            claim_adjudication_passed: false
../../../../../commands/deep/assets/deep_review_confirm.yaml:1191:          append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},"passed":false,"activeP0P1":{active_p0_p1_count},"missingPackets":{missing_packet_ids},"reason":"Missing typed packet fields for new P0/P1 findings","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
../../../../../commands/deep/assets/deep_review_confirm.yaml:1241:          **New Findings**: {findings_count} (P0={severity_counts.P0} P1={severity_counts.P1} P2={severity_counts.P2})
../../../../../commands/deep/assets/deep_review_confirm.yaml:1317:          p0_count: "Accumulate from severity_counts"
../../../../../commands/deep/assets/deep_review_confirm.yaml:1318:          p1_count: "Accumulate from severity_counts"
../../../../../commands/deep/assets/deep_review_confirm.yaml:1319:          p2_count: "Accumulate from severity_counts"
../../../../../commands/deep/assets/deep_review_confirm.yaml:1369:      # H-1 verdict derivation: parse findings JSONL, map highest severity to verdict
../../../../../commands/deep/assets/deep_review_confirm.yaml:1426:          2. Compute content_hash for each finding (emission requirement):
../../../../../commands/deep/assets/deep_review_confirm.yaml:1427:             content_hash = sha256(file_path + "\u001f" + line_range + "\u001f" + finding_type + "\u001f" + normalized_description_80chars)
../../../../../commands/deep/assets/deep_review_confirm.yaml:1430:             PRIMARY: group by content_hash field
../../../../../commands/deep/assets/deep_review_confirm.yaml:1431:               - Same content_hash, multiple dimensions → single finding, merged `dimensions: [<all>]` array
../../../../../commands/deep/assets/deep_review_confirm.yaml:1432:               - Keep highest severity on duplicates
../../../../../commands/deep/assets/deep_review_confirm.yaml:1433:             FALLBACK (legacy records lacking content_hash): file:line + normalized_title
../../../../../commands/deep/assets/deep_review_confirm.yaml:1435:               - Keep highest severity on duplicates
../../../../../commands/deep/assets/deep_review_confirm.yaml:1438:             - Record first_seen, upgraded_in, previous_severity for severity changes
../../../../../commands/deep/assets/deep_review_confirm.yaml:1442:             - Determine final severity and status
../../../../../commands/deep/assets/deep_review_confirm.yaml:1455:            2. Skeptic: Challenge severity — is this really P0/P1? Could it be P2?
../../../../../commands/deep/assets/deep_review_confirm.yaml:1484:             - Build `activeFindings`, `findingClasses`, and `affectedSurfacesSeed` from reducer-owned state plus iteration JSONL `findingDetails`; if a field is missing, mark it `UNKNOWN` instead of inferring it from prose
../../../../../commands/deep/assets/deep_review_confirm.yaml:1488:             - For each: ID, severity, title, dimension, file:line, evidence, impact, fix recommendation, disposition, findingClass, scopeProof, affectedSurfaceHints
../../../../../commands/deep/assets/deep_review_confirm.yaml:1527:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
../../../../../commands/deep/assets/deep_review_confirm.yaml:1626:  severity_weights:
../../../../../commands/deep/assets/deep_review_auto.yaml:408:          severityThreshold: "P2"
../../../../../commands/deep/assets/deep_review_auto.yaml:413:          # Semantic: weighted P0/P1/P2 severity ratio. See SKILL.md §"Convergence Threshold Semantics".
../../../../../commands/deep/assets/deep_review_auto.yaml:439:        content: '{"sessionId":"{session_id_init}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
../../../../../commands/deep/assets/deep_review_auto.yaml:527:          - last_claim_adjudication_passed: "Scan state.jsonl for the most recent `claim_adjudication` event; use its `passed` boolean. Default true when no event exists or when activeP0 + activeP1 == 0 (gate is vacuous without adjudicable findings)."
../../../../../commands/deep/assets/deep_review_auto.yaml:528:          - claim_adjudication_active_count: "Count of active P0/P1 findings at the time of the last claim_adjudication event; 0 when none exist"
../../../../../commands/deep/assets/deep_review_auto.yaml:530:          - fix_completeness_replay_required_rows: "Count prior active or remediated P0/P1 findings, plus any prior security/path P2 findings, that require closed-gate replay before STOP."
../../../../../commands/deep/assets/deep_review_auto.yaml:531:          - fix_completeness_replay_passing_rows: "Count required replay rows marked PASS with file:line or command evidence and producer/consumer/matrix coverage."
../../../../../commands/deep/assets/deep_review_auto.yaml:581:             claim_adjudication_gate_pass = (last_claim_adjudication_passed != false) OR (p0_count + p1_count == 0)
../../../../../commands/deep/assets/deep_review_auto.yaml:582:             If claim_adjudication_gate_pass == false:
../../../../../commands/deep/assets/deep_review_auto.yaml:588:               Skip hard stops (1) and composite convergence (4); proceed directly to step 5 legal-stop decision-tree assembly so blocked_by_json, gate outputs, and the blocked_stop event still populate consistently.
../../../../../commands/deep/assets/deep_review_auto.yaml:599:               If graph_decision == "STOP_BLOCKED", set stop_blocked = true and route through blocked_stop emission instead of stopping.
../../../../../commands/deep/assets/deep_review_auto.yaml:617:               b) dimensionCoverageGate: pass when configured dimensions and required traceability coverage are complete and coverage_age >= 1; record covered and missing dimensions
../../../../../commands/deep/assets/deep_review_auto.yaml:621:               f) claimAdjudicationGate: pass when claim_adjudication_gate_pass == true (i.e. last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate); record last_claim_adjudication_passed and claim_adjudication_active_count
../../../../../commands/deep/assets/deep_review_auto.yaml:622:               g) fixCompletenessReplayGate: pass when security_sensitive_fix_scope == false OR every required closed-gate replay row passes with file:line or command evidence and producer/consumer/matrix coverage; record security_sensitive_fix_scope, fix_completeness_replay_required_rows, and fix_completeness_replay_passing_rows
../../../../../commands/deep/assets/deep_review_auto.yaml:629:               blocked_by_json = JSON array of failing gate names (always include "claimAdjudicationGate" when claim_adjudication_gate_pass == false, "fixCompletenessReplayGate" when fix_completeness_replay_gate_pass == false, "candidateCoverageGate" when candidate_coverage_gate_pass == false, and "graphlessFallbackGate" when graphless_fallback_gate_pass == false)
../../../../../commands/deep/assets/deep_review_auto.yaml:641:               claim_adjudication_gate_pass = boolean
../../../../../commands/deep/assets/deep_review_auto.yaml:642:               claim_adjudication_active_count = numeric count of active P0/P1 at the gate
../../../../../commands/deep/assets/deep_review_auto.yaml:643:               fix_completeness_replay_gate_pass = boolean
../../../../../commands/deep/assets/deep_review_auto.yaml:645:               fix_completeness_replay_required_rows = numeric count of closed-gate replay rows required for security-sensitive fix reruns
../../../../../commands/deep/assets/deep_review_auto.yaml:646:               fix_completeness_replay_passing_rows = numeric count of required closed-gate replay rows marked PASS with evidence
../../../../../commands/deep/assets/deep_review_auto.yaml:682:          - dimension_coverage_gate_pass: "Boolean pass/fail for dimensionCoverageGate"
../../../../../commands/deep/assets/deep_review_auto.yaml:690:          - claim_adjudication_gate_pass: "Boolean pass/fail for claimAdjudicationGate (false vetoes STOP)"
../../../../../commands/deep/assets/deep_review_auto.yaml:691:          - claim_adjudication_active_count: "Count of active P0/P1 findings evaluated by claimAdjudicationGate"
../../../../../commands/deep/assets/deep_review_auto.yaml:692:          - fix_completeness_replay_gate_pass: "Boolean pass/fail for fixCompletenessReplayGate (false vetoes STOP on security-sensitive fix reruns)"
../../../../../commands/deep/assets/deep_review_auto.yaml:694:          - fix_completeness_replay_required_rows: "Count of closed-gate replay rows required before STOP"
../../../../../commands/deep/assets/deep_review_auto.yaml:695:          - fix_completeness_replay_passing_rows: "Count of required closed-gate replay rows that passed with evidence"
../../../../../commands/deep/assets/deep_review_auto.yaml:709:      step_emit_blocked_stop:
../../../../../commands/deep/assets/deep_review_auto.yaml:712:          append_jsonl: '{"type":"event","event":"blocked_stop","mode":"review","run":{current_iteration},"blockedBy":{blocked_by_json},"gateResults":{"convergenceGate":{"pass":{convergence_gate_pass},"score":{convergence_gate_score}},"dimensionCoverageGate":{"pass":{dimension_coverage_gate_pass},"covered":{dimension_coverage_gate_covered_json},"missing":{dimension_coverage_gate_missing_json}},"p0ResolutionGate":{"pass":{p0_resolution_gate_pass},"activeP0":{active_p0_count}},"evidenceDensityGate":{"pass":{evidence_density_gate_pass},"avgEvidencePerFinding":{avg_evidence_per_finding}},"hotspotSaturationGate":{"pass":{hotspot_saturation_gate_pass}},"claimAdjudicationGate":{"pass":{claim_adjudication_gate_pass},"activeP0P1":{claim_adjudication_active_count}},"fixCompletenessReplayGate":{"pass":{fix_completeness_replay_gate_pass},"securitySensitive":{security_sensitive_fix_scope},"requiredRows":{fix_completeness_replay_required_rows},"passingRows":{fix_completeness_replay_passing_rows}},"candidateCoverageGate":{"pass":{candidate_coverage_gate_pass},"searchDebt":{candidate_coverage_search_debt_json},"missing":{candidate_coverage_missing_json}},"graphlessFallbackGate":{"pass":{graphless_fallback_gate_pass},"mode":"{graphless_fallback_mode}","missing":{graphless_fallback_missing_json},"unavailabilityReason":"{graphless_fallback_unavailability_reason}"}},"graphBlockerDetail":{graph_blockers_json},"recoveryStrategy":"{recovery_strategy}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
../../../../../commands/deep/assets/deep_review_auto.yaml:924:            - "Escalate severity review: re-examine P2 findings for potential P1 upgrades"
../../../../../commands/deep/assets/deep_review_auto.yaml:1434:          assert_jsonl_fields: [type, iteration, mode, run, status, focus, dimensions, filesReviewed, findingsCount, findingsSummary, findingsNew, findingDetails, newFindingsRatio, sessionId, generation, lineageMode, timestamp, durationMs]
../../../../../commands/deep/assets/deep_review_auto.yaml:1469:            severity: "advisory"
../../../../../commands/deep/assets/deep_review_auto.yaml:1470:            event_shape: '{"type":"event","event":"schema_advisory","mode":"review","iteration":{current_iteration},"warnings":{result.warnings},"severity":"advisory","timestamp":"{ISO_8601_NOW}"}'
../../../../../commands/deep/assets/deep_review_auto.yaml:1495:          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
../../../../../commands/deep/assets/deep_review_auto.yaml:1505:          append_jsonl: '{"type":"iteration","iteration":{current_iteration},"run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"findingDetails":[],"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"durationMs":0,"timestamp":"{ISO_8601_NOW}","sessionId":"{config.lineage.sessionId}","generation":{config.lineage.generation},"lineageMode":"{config.lineage.lineageMode}"}'
../../../../../commands/deep/assets/deep_review_auto.yaml:1507:      step_post_iteration_claim_adjudication:
../../../../../commands/deep/assets/deep_review_auto.yaml:1515:            claim_adjudication_passed: true
../../../../../commands/deep/assets/deep_review_auto.yaml:1516:          append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},"passed":true,"activeP0P1":{active_p0_p1_count},"missingPackets":[],"timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
../../../../../commands/deep/assets/deep_review_auto.yaml:1521:            claim_adjudication_passed: false
../../../../../commands/deep/assets/deep_review_auto.yaml:1522:          append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},"passed":false,"activeP0P1":{active_p0_p1_count},"missingPackets":{missing_packet_ids},"reason":"Missing typed packet fields for new P0/P1 findings","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
../../../../../commands/deep/assets/deep_review_auto.yaml:1618:          p0_count: "Accumulate from severity_counts"
../../../../../commands/deep/assets/deep_review_auto.yaml:1619:          p1_count: "Accumulate from severity_counts"
../../../../../commands/deep/assets/deep_review_auto.yaml:1620:          p2_count: "Accumulate from severity_counts"
../../../../../commands/deep/assets/deep_review_auto.yaml:1626:        log: "Iteration {N} complete. Dimensions: {dimensions}. newFindingsRatio: {newFindingsRatio}. Findings: P0={severity_counts.P0} P1={severity_counts.P1} P2={severity_counts.P2}. Stuck count: {stuck_count}."
../../../../../commands/deep/assets/deep_review_auto.yaml:1671:      # H-1 verdict derivation: parse findings JSONL, map highest severity to verdict
../../../../../commands/deep/assets/deep_review_auto.yaml:1704:          2. Compute content_hash for each finding (emission requirement):
../../../../../commands/deep/assets/deep_review_auto.yaml:1705:             content_hash = sha256(file_path + "\u001f" + line_range + "\u001f" + finding_type + "\u001f" + normalized_description_80chars)
../../../../../commands/deep/assets/deep_review_auto.yaml:1708:             PRIMARY: group by content_hash field
../../../../../commands/deep/assets/deep_review_auto.yaml:1709:               - Same content_hash, multiple dimensions → single finding, merged `dimensions: [<all>]` array
../../../../../commands/deep/assets/deep_review_auto.yaml:1710:               - Keep highest severity on duplicates
../../../../../commands/deep/assets/deep_review_auto.yaml:1711:             FALLBACK (legacy records lacking content_hash): file:line + normalized_title
../../../../../commands/deep/assets/deep_review_auto.yaml:1713:               - Keep highest severity on duplicates
../../../../../commands/deep/assets/deep_review_auto.yaml:1716:             - Record first_seen, upgraded_in, previous_severity for severity changes
../../../../../commands/deep/assets/deep_review_auto.yaml:1720:             - Determine final severity and status
../../../../../commands/deep/assets/deep_review_auto.yaml:1733:            2. Skeptic: Challenge severity — is this really P0/P1? Could it be P2?
../../../../../commands/deep/assets/deep_review_auto.yaml:1749:        note: "Cross-check target_files from {spec_folder}/applied/T-*.md against {spec_folder}/resource-map.md. Report touched entries, untouched entries split into expected-by-scope vs gap, and implementation paths absent from the map. Findings raised here use category resource-map-coverage with severity calibrated to the gate outcome."
../../../../../commands/deep/assets/deep_review_auto.yaml:1766:             - Build `activeFindings`, `findingClasses`, and `affectedSurfacesSeed` from reducer-owned state plus iteration JSONL `findingDetails`; if a field is missing, mark it `UNKNOWN` instead of inferring it from prose
../../../../../commands/deep/assets/deep_review_auto.yaml:1770:             - For each: ID, severity, title, dimension, file:line, evidence, impact, fix recommendation, disposition, findingClass, scopeProof, affectedSurfaceHints
../../../../../commands/deep/assets/deep_review_auto.yaml:1856:          function countIterationFindings(record) {
../../../../../commands/deep/assets/deep_review_auto.yaml:1860:            if (Array.isArray(record.findingDetails)) return record.findingDetails.length;
../../../../../commands/deep/assets/deep_review_auto.yaml:1864:          function normalizeFindingKey(value) {
../../../../../commands/deep/assets/deep_review_auto.yaml:1868:          function findingKeys(candidate) {
../../../../../commands/deep/assets/deep_review_auto.yaml:1885:          function collectIterationFindingGroups(record) {
../../../../../commands/deep/assets/deep_review_auto.yaml:1886:            if (!record || record.type !== 'iteration' || !Array.isArray(record.findingDetails)) return [];
../../../../../commands/deep/assets/deep_review_auto.yaml:1887:            return record.findingDetails
../../../../../commands/deep/assets/deep_review_auto.yaml:1892:          function collectRegistryFindingKeys(registry) {
../../../../../commands/deep/assets/deep_review_auto.yaml:1931:              severity: 'warning',
../../../../../commands/deep/assets/deep_review_auto.yaml:1936:              dimensionCoverage: Number('{dimension_coverage}'),
../../../../../commands/deep/assets/deep_review_auto.yaml:1958:              dimensionCoverage: Number('{dimension_coverage}'),
../../../../../commands/deep/assets/deep_review_auto.yaml:2087:  severity_weights:

codex
The biggest concrete gaps are now visible: identity is tied to `file + line + type + 80-char description`, P0 adjudication checks packet completeness rather than independent refutation, and “dimension covered” is mostly a boolean. I’m testing reference designs for stable result matching, evidence independence, and mutation-backed regression gates against those gaps.
web search: 
web search: GitHub SARIF SDK result matching partialFingerprints baselineState repository stars ...
web search: 
web search: site:github.com/microsoft/sarif-sdk stars SARIF SDK GitHub ...
web search: 
web search: https://github.com/microsoft/sarif-sdk
web search: 
web search: https://github.com/github/codeql-action/blob/main/src/fingerprints.ts
web search: 
web search: 'primaryLocationLineHash'
web search: 
web search: 'Stars'
web search: 
web search: site:github.com/hcoles/pitest "HistoryStore" "History" incremental analysis source ...
web search: 
web search: CascadeEvaluator GitHub runcascade eval library code scorer LLM judge ...
web search: 
web search: "CASCADE: Detecting Inconsistencies" GitHub ...
web search: 
web search: site:semgrep.dev/docs match_based_id fingerprint findings ignored triage Semgrep baseline scan ...
web search: 
web search: site:promptfoo.dev/docs assertions deterministic model graded cost latency javascript assertion provider rubric ...
web search: 
web search: 'Releases'
web search: 
web search: 'type Mode'
exec
/bin/zsh -lc "sed -n '740,900p' ../../../../../skills/system-deep-loop/runtime/scripts/reduce-state.cjs && sed -n '400,550p' ../../../../../skills/system-deep-loop/deep-review/references/state/state_format.md && sed -n '430,525p' ../../../../../skills/system-deep-loop/deep-review/references/convergence/convergence.md && sed -n '210,390p' ../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
  return findings;
}

/**
 * Build a two-tier dedup key. Primary: content_hash. Fallback for legacy
 * records: `file:line + normalized-title`. Namespacing keeps the tiers from
 * colliding.
 */
function findingDedupKey(finding) {
  if (finding.contentHash) {
    return `ch:${finding.contentHash}`;
  }
  const file = finding.file || '';
  const line = isFiniteNumber(finding.line) ? finding.line : '';
  const title = normalizeText(finding.title || '').toLowerCase().slice(0, 80);
  return `fl:${file}:${line}|${title}`;
}

function dedupeDimensions(dimensions) {
  const seen = new Set();
  const out = [];
  for (const dimension of dimensions) {
    if (!dimension) continue;
    if (seen.has(dimension)) continue;
    seen.add(dimension);
    out.push(dimension);
  }
  return out;
}

/**
 * Collapse cross-dimension restatements into one canonical entry with a merged
 * `dimensions[]` list. Same-id entries are already merged upstream, so this only
 * handles genuine cross-id duplicates while unique findings stay independent.
 */
function collapseFindingsByDedupKey(findingEntries) {
  const byKey = new Map();
  for (const finding of findingEntries) {
    const key = findingDedupKey(finding);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        ...finding,
        dimensions: dedupeDimensions([finding.dimension]),
        mergedFindingIds: [],
      });
      continue;
    }
    // Keep the earliest-discovered finding as canonical; fold the duplicate in.
    if (isFiniteNumber(finding.firstSeen) && finding.firstSeen < existing.firstSeen) {
      existing.firstSeen = finding.firstSeen;
    }
    if (isFiniteNumber(finding.lastSeen) && finding.lastSeen > existing.lastSeen) {
      existing.lastSeen = finding.lastSeen;
    }
    existing.dimensions = dedupeDimensions([...existing.dimensions, finding.dimension]);
    if (finding.findingId && finding.findingId !== existing.findingId
      && !existing.mergedFindingIds.includes(finding.findingId)) {
      existing.mergedFindingIds.push(finding.findingId);
    }
    existing.transitions = mergeTransitions(existing.transitions, finding.transitions);
  }
  return [...byKey.values()];
}

function buildFindingRegistry(iterationFiles, iterationRecords, deltaRecords = []) {
  const findingById = new Map();
  const claimAdjudicationByFinding = buildClaimAdjudicationByFinding(iterationRecords);

  function upsertFinding(finding, run, iteration, initialReason, adjustmentReason) {
    const claimAdjudication = claimAdjudicationByFinding.get(finding.findingId);
    const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
    const existing = findingById.get(finding.findingId);
    if (!existing) {
      findingById.set(finding.findingId, {
        ...finding,
        severity: canonicalSeverity,
        dimension: deriveDimension(
          { ...finding, severity: canonicalSeverity },
          iteration,
        ),
        firstSeen: run,
        lastSeen: run,
        status: 'active',
        transitions: mergeTransitions(
          [{
            iteration: run,
            from: null,
            to: canonicalSeverity,
            reason: initialReason,
          }],
          claimAdjudication?.transitions,
        ),
      });
      return;
    }
    existing.lastSeen = run;
    if (existing.severity !== canonicalSeverity) {
      existing.transitions.push({
        iteration: run,
        from: existing.severity,
        to: canonicalSeverity,
        reason: adjustmentReason,
      });
      existing.severity = canonicalSeverity;
    }
    if (claimAdjudication?.transitions?.length) {
      existing.transitions = mergeTransitions(existing.transitions, claimAdjudication.transitions);
    }
  }

  // Structured finding rows are the primary source because they carry exact
  // severity, status, file evidence, and claim fields from the loop runtime.
  // Iteration markdown remains a compatibility fallback.
  const deltaFindingsByRun = new Map();
  for (const record of deltaRecords) {
    const finding = deltaRecordToFinding(record);
    if (!finding) continue;
    const run = isFiniteNumber(record.iteration) ? record.iteration : 0;
    if (!deltaFindingsByRun.has(run)) {
      deltaFindingsByRun.set(run, []);
    }
    deltaFindingsByRun.get(run).push(finding);
  }

  // Process deltas in iteration order so transitions reflect chronology.
  // Cross-reference iteration markdown files for focus/dimensionsAddressed
  // metadata (used by deriveDimension); pseudo iteration if no markdown match.
  const iterationByRun = new Map(iterationFiles.map((it) => [it.run, it]));
  const sortedRuns = [...deltaFindingsByRun.keys()].sort((a, b) => a - b);
  for (const run of sortedRuns) {
    const pseudoIteration = iterationByRun.get(run) || { focus: '', run, dimensionsAddressed: [] };
    for (const finding of deltaFindingsByRun.get(run)) {
      upsertFinding(finding, run, pseudoIteration, 'Initial discovery (delta)', 'Severity adjusted in later delta');
    }
  }

  for (const iteration of iterationFiles) {
    for (const finding of iteration.findings) {
      upsertFinding(finding, iteration.run, iteration, 'Initial discovery', 'Severity adjusted in later iteration');
    }
  }

  const summaryFallbackRecords = collectSummaryFallbackRecords(iterationRecords, deltaRecords);
  for (const { run, record } of summaryFallbackRecords) {
    if (deltaFindingsByRun.has(run)) {
      continue;
    }
    const pseudoIteration = iterationByRun.get(run) || {
      focus: normalizeText(record.focus || ''),
      run,
      dimensionsAddressed: Array.isArray(record.dimensions)
        ? record.dimensions.map((value) => normalizeText(value).toLowerCase()).filter(Boolean)
        : [],
    };
    const representedCounts = countFindingsSeenInRun(findingById, run);
    const fallbackFindings = fallbackFindingsFromIterationRecord(record, run, representedCounts);
    for (const finding of fallbackFindings) {
      upsertFinding(
        finding,
        run,
| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
| Trend | JSONL signals | Rolling average, composite stop score, trajectory |

**Rules:** Sole inputs are JSONL + strategy. Overwrite entirely on refresh. Read-only for all agents.

---

## 9. CLAIM ADJUDICATION

Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`), a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.

### Typed Packet Schema (required)

Embed the packet inside the iteration file for each new P0/P1 finding. The orchestrator parses it after evaluation and persists the validation result.

```json
{
  "findingId": "F003",
  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:154",
    ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:292-302"
  ],
  "counterevidenceSought": "Grepped the module for compound-key upserts, checked migration scripts, and inspected session-isolation.vitest.ts for a collision regression, none found.",
  "alternativeExplanation": "Could be intentional single-tenant design, but REQ-024 explicitly requires session isolation, so this is rejected.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "If a composite primary key `(spec_folder, loop_type, session_id, id)` lands and a collision regression covers the ID-reuse path, downgrade to P2 tech-debt.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `findingId` | string | Must match the finding ID in the iteration body and registry |
| `claim` | string | The single assertion the finding makes (one sentence, evidence-backed) |
| `evidenceRefs` | string[] | `file:line` or `file:range` citations that substantiate the claim (at least one entry) |
| `counterevidenceSought` | string | Where the reviewer looked for contradicting evidence (commands, paths, docs), blank string is not acceptable |
| `alternativeExplanation` | string | An alternative reading of the evidence, even if the reviewer rejects it |
| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication (may differ from the severity originally asserted) |
| `confidence` | number `[0, 1]` | Reviewer confidence in `finalSeverity` |
| `downgradeTrigger` | string | The concrete condition under which this finding should be downgraded in a future iteration |
| `transitions` | object[] | Optional severity transition log, required when `finalSeverity` differs from the originally asserted severity |

### Validation Rules (enforced by `step_post_iteration_claim_adjudication`)

1. A packet MUST exist for every new P0/P1 finding introduced in this iteration. Carried-forward findings reuse the previous packet unless severity transitioned.
2. All required fields MUST be present and non-empty. `confidence` MUST be a number in `[0, 1]`.
3. Each `evidenceRefs` entry MUST contain a `:` separating the path from a line or range.
4. `finalSeverity` MUST match the severity the finding is registered under in the iteration's `Findings` section and in `deep-review-findings-registry.json`.
5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.

### Severity Transition Rules

- **P2 → P1**: confirmed exploitable impact or spec violation with direct evidence
- **P1 → P0**: demonstrated data loss, security breach, or hard-gate failure
- **Downgrade**: requires explicit counterevidence or a confirmed alternative explanation
- Every transition is recorded in the packet's `transitions` array and mirrored into the finding registry's `transitions` field

---

## 10. FINDING REGISTRY

Each finding is tracked with a unique identifier enabling deduplication, severity transitions, and status lifecycle.

### Schema

```json
{
  "findingId": "F003",
  "severity": "P1",
  "category": "resource-map-coverage",
  "status": "active",
  "dimension": "traceability",
  "title": "Applied target file missing from resource-map inventory",
  "file": ".opencode/commands/deep/assets/deep_review_auto.yaml",
  "line": 955,
  "firstSeen": 2,
  "lastSeen": 4,
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery" },
    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed real coverage gap against applied target inventory" }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| findingId | string | Sequential unique ID: `F001`, `F002`, ... |
| severity | `"P0"` / `"P1"` / `"P2"` | Current severity |
| category | `"correctness"` / `"security"` / `"traceability"` / `"maintainability"` / `"resource-map-coverage"` | Primary audit category for the finding, `resource-map-coverage` is reserved for implementation-vs-map coverage gaps |
| status | `"active"` / `"resolved"` / `"deferred"` / `"disproved"` | Current status |
| dimension | string | Primary dimension: correctness, security, traceability, maintainability |
| title | string | Short description |
| file | string | File path |
| line | number | Line number (approximate) |
| firstSeen / lastSeen | number | Iteration where first discovered / last referenced |
| transitions | array | Severity and status change history |

### Status Lifecycle

```text
[discovered] --> active --> resolved    (fixed or confirmed non-issue)
                  |
                  +--> deferred    (advisory, below threshold)
                  |
                  +--> disproved   (counterevidence invalidated)
```

| Status | Counts Toward Verdict |
|--------|----------------------|
| active | Yes |
| resolved | No |
| deferred | No (listed in Deferred Items) |
| disproved | No |

### Deduplication

Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.

### Cross-Reference Protocols

| Protocol | Level | Applies To | Gate |
|----------|-------|------------|------|
| spec_code | core | all types | hard |
| checklist_evidence | core | all types | hard |
| skill_agent | overlay | skill | advisory |
| agent_cross_runtime | overlay | agent | advisory |
| feature_catalog_code | overlay | skill, spec-folder, track, files | advisory |
| playbook_capability | overlay | skill, agent, spec-folder | advisory |

Severity for `resource-map-coverage` findings is calibrated to the coverage-gate outcome:
- `P2` when an untouched map entry is explicitly `expected-by-scope`
- `P1` when an untouched or absent path represents a real coverage gap
- `P0` only when the missing coverage masks a release-blocking correctness or security risk

### Quality Gates

| Gate | Rule |
|------|------|
| Evidence | Every active finding backed by concrete file:line evidence |
| Scope | Reviewed files and conclusions stay inside declared scope |
| Coverage | Required dimensions and required protocols covered |

All three gates must pass before STOP. Gate failure forces `verdict: "FAIL"` regardless of finding counts.A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.

---

## 6. LEGAL-STOP GATE BUNDLE

> **GATE MODEL, two naming conventions mapped to one authoritative set.** The authoritative producer is `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`, which emits **9 gates** with the `Gate` suffix: `convergenceGate` / `dimensionCoverageGate` / `p0ResolutionGate` / `evidenceDensityGate` / `hotspotSaturationGate` / `claimAdjudicationGate` / `fixCompletenessReplayGate` / `candidateCoverageGate` / `graphlessFallbackGate`. The §Section-1 event shape (lines 98-119) mirrors this set verbatim and the reducer reads those names verbatim, so treat the event shape as authoritative when writing or reading JSONL state. The §6 table below is the high-level conceptual model and uses descriptive names WITHOUT the `Gate` suffix where one reads more naturally (for example `findingStability` maps to `convergenceGate`); each row carries its event-shape name so the mapping is explicit. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. The gate-model drift cluster (LG-0013, LG-0016, LG-0031, LG-0032) was reconciled in `006-gate-model-reconciliation`.

Deep review treats STOP as legal only when the full review-specific gate bundle passes together. Convergence math may request STOP, but the workflow must still evaluate these 9 gates and persist a blocked-stop event when any gate fails.

| Gate (§6 conceptual) | Event-shape name (§Section-1) | Rule | Fail Action |
|------|------|------|-------------|
| **findingStability** | `convergenceGate` | Rolling average, MAD noise floor, and novelty ratio must all indicate low-yield review churn | Block STOP, persist `blockedStop` |
| **dimensionCoverage** | `dimensionCoverageGate` | Every configured review dimension must have been examined at least once, with required traceability coverage stabilized | Block STOP, persist `blockedStop` |
| **p0Resolution** | `p0ResolutionGate` | No unresolved P0 findings may remain active at stop time | Block STOP, persist `blockedStop` |
| **evidenceDensity** | `evidenceDensityGate` | Evidence density across active findings must meet the configured threshold | Block STOP, persist `blockedStop` |
| **hotspotSaturation** | `hotspotSaturationGate` | Review hotspots must be revisited enough times to satisfy the saturation heuristic | Block STOP, persist `blockedStop` |
| (no §6 counterpart) | `claimAdjudicationGate` | Each new P0/P1 finding must carry a typed adjudication packet, missing or failing packets veto STOP | Block STOP, persist `blockedStop` |
| **fixCompletenessReplay** | `fixCompletenessReplayGate` | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |
| **candidateCoverage** (v2 rollout) | `candidateCoverageGate` | Search debt must be cleared and every required bug class must have candidate coverage before STOP, passes trivially when the v2 search path is inactive | Block STOP, persist `blockedStop` |
| **graphlessFallback** (v2 rollout) | `graphlessFallbackGate` | When the code graph is unavailable, required bug classes must carry cited fallback ledger rows, passes trivially when the graph is available | Block STOP, persist `blockedStop` |

### Gate Evaluation

```
function buildReviewLegalStop(state, config, coverage):
  gateResults = {
    findingStability: {
      pass: rollingStop and madStop and state.latestNoveltyRatio <= config.convergenceThreshold,
      detail: "Rolling average, MAD noise floor, and novelty ratio are all below stop thresholds."
    },
    dimensionCoverage: {
      pass: everyConfiguredDimensionExaminedAtLeastOnce(coverage, config.reviewDimensions) and
            coverage.requiredProtocolsCovered and
            coverage.stabilizationPasses >= 1,
      detail: "All configured review dimensions have been examined, required traceability protocols are covered, and stabilization has aged enough to stop."
    },
    p0Resolution: {
      pass: countActiveFindings(state, ["P0"]) == 0 and state.claimAdjudicationPassed != false,
      detail: "No unresolved P0 findings remain and blocker adjudication is complete."
    },
    evidenceDensity: {
      pass: computeEvidenceDensity(state.activeFindings) >= config.evidenceDensityThreshold,
      detail: "Evidence density meets the configured threshold for active findings."
    },
    hotspotSaturation: {
      pass: computeHotspotSaturation(state.hotspots) >= config.hotspotSaturationThreshold,
      detail: "Priority hotspots received enough revisits to satisfy saturation."
    },
    fixCompletenessReplay: {
      pass: not isSecuritySensitiveFixRerun(state, config) or allRequiredReplayRowsPass(state.reviewReport),
      detail: "Security-sensitive fix reruns include closed-gate replay evidence and producer/consumer/matrix coverage before STOP."
    },
    candidateCoverage: {
      pass: not isReviewDepthV2Active(state, config) or (searchDebtCleared(state) and allRequiredBugClassesCovered(state)),
      detail: "Search debt is cleared and every required bug class has candidate coverage. Passes trivially when the v2 search path is inactive."
    },
    graphlessFallback: {
      pass: state.searchCoverage.graphCoverageMode == "graph_available" or allRequiredBugClassesHaveFallbackRows(state),
      detail: "When the code graph is unavailable, required bug classes carry cited fallback ledger rows. Passes trivially when the graph is available."
    }
  }

  blockedBy = [name for name, result in gateResults.items() if not result.pass]
  return {
    pass: len(blockedBy) == 0,
    blockedBy,
    gateResults
  }
```

When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class `blocked_stop` event with the failing `blockedBy` gates, the full `gateResults` bundle, a `recoveryStrategy`, and the normal run/timestamp/session lineage fields before overriding the decision to CONTINUE.

### Blocked-Stop Recovery Strategy

| Failed Gate | Recovery Strategy |
|-------------|-------------------|
| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
| `dimensionCoverage` | Schedule the next uncovered review dimension immediately. |
| `p0Resolution` | Re-open the active blocker path and verify whether the P0 is real, downgraded, or still unresolved. |
| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
| `hotspotSaturation` | Revisit undersampled hotspots or adjacent call sites until the saturation heuristic passes. |
| `fixCompletenessReplay` | Replay prior active or remediated P0/P1 gates, then record producer, consumer, and matrix coverage evidence before re-checking STOP. |
| `candidateCoverage` | Clear outstanding search debt and run candidate discovery for the missing bug classes before re-checking STOP. |
| `graphlessFallback` | Add cited fallback ledger rows for the required bug classes, or restore graph availability, before re-checking STOP. |

### Legacy Stop-Reason Mapping

Use this table when replaying old packets or translating older prose/docs into the shared stop contract.

| Legacy label | New `stopReason` | Mapping note |
|--------------|------------------|--------------|
| `all_dimensions_clean` | `converged` | Legacy review-specific terminal label, now expressed by the shared enum. |
| `composite_converged` | `converged` | Legacy convergence-math wording now rolls into shared terminal success. |
| `all dimensions clean` | `converged` | Old operator-facing prose for the same successful stop. |
| `max_iterations_reached` | `maxIterationsReached` | Legacy machine label for the hard iteration cap. |
  crossReferenceProtocols:
    - id: spec_code
      dimension: traceability
      level: core
      appliesTo: [spec-folder, skill, agent, track, files]
      gateClass: hard
      passCriteria: All normative claims resolve to shipped behavior or explicitly documented non-applicability with evidence.
      partialCriteria: Some claims resolve, but one or more claims remain ambiguous or blocked by missing evidence.
      failCriteria: A normative claim contradicts shipped behavior, references missing implementation, or cannot be reconciled.
    - id: checklist_evidence
      dimension: traceability
      level: core
      appliesTo: [spec-folder, skill, agent, track, files]
      gateClass: hard
      passCriteria: Every checked checklist-style claim has supporting evidence and no unsupported completion marks remain.
      partialCriteria: Evidence exists for part of the checked set, but some checked items remain unproven or weakly linked.
      failCriteria: Checked items are unsupported, contradicted by evidence, or materially overstate completion.
    - id: skill_agent
      dimension: traceability
      level: overlay
      appliesTo: [skill]
      gateClass: advisory
      passCriteria: SKILL.md contracts, routing guidance, and referenced runtime agents agree on capabilities and boundaries.
      partialCriteria: Shared intent is consistent, but one or more runtime contracts drift in wording, tools, or expectations.
      failCriteria: SKILL.md and runtime agents materially disagree on capability, routing, permissions, or operating contract.
    - id: agent_cross_runtime
      dimension: traceability
      level: overlay
      appliesTo: [agent]
      gateClass: advisory
      passCriteria: Runtime-specific agent definitions express equivalent behavior, constraints, and evidence requirements.
      partialCriteria: Runtime definitions are broadly aligned but contain non-blocking drift in examples, labels, or metadata.
      failCriteria: Runtime definitions materially diverge in contract, permissions, workflow, or severity/evidence rules.
    - id: feature_catalog_code
      dimension: traceability
      level: overlay
      appliesTo: [skill, spec-folder, track, files]
      gateClass: advisory
      passCriteria: Feature catalog claims match current capability, entry points, and discoverable implementation surfaces.
      partialCriteria: Catalog coverage is incomplete or stale, but no confirmed contradiction to shipped behavior is present.
      failCriteria: Catalog claims are materially false, missing required features, or point to absent implementation.
    - id: playbook_capability
      dimension: traceability
      level: overlay
      appliesTo: [skill, agent, spec-folder]
      gateClass: advisory
      passCriteria: Playbook scenario preconditions, steps, and expected signals are executable against current capability.
      partialCriteria: Scenarios mostly match reality, but one or more steps need updates, clarifications, or narrower scoping.
      failCriteria: Playbook scenarios assume capabilities that do not exist or cannot be executed as documented.

  # Output contracts consumed by synthesis and replay tooling.
  outputs:
    config:
      pathPattern: "{artifact_dir}/deep-review-config.json"
      machineOwned: false
      fields:
        - sessionId
        - parentSessionId
        - lineageMode
        - generation
        - continuedFromRun
        - releaseReadinessState
    findingsRegistry:
      pathPattern: "{artifact_dir}/deep-review-findings-registry.json"
      machineOwned: true
      sections:
        - openFindings
        - resolvedFindings
        - repeatedFindings
        - dimensionCoverage
        - findingsBySeverity
        - convergenceScore
    reviewReport:
      pathPattern: "{artifact_dir}/review-report.md"
      sections:
        - executive-summary
        - planning-trigger
        - active-finding-registry
        - remediation-workstreams
        - spec-seed
        - plan-seed
        - traceability-status
        - deferred-items
        - audit-appendix
    strategy:
      pathPattern: "{artifact_dir}/deep-review-strategy.md"
      requiredSections:
        - topic
        - review-dimensions
        - completed-dimensions
        - running-findings
        - what-worked
        - what-failed
        - exhausted-approaches
        - ruled-out-directions
        - next-focus
        - known-context
        - cross-reference-status
        - files-under-review
        - review-boundaries
    dashboard:
      pathPattern: "{artifact_dir}/deep-review-dashboard.md"
      machineOwned: true
      sections:
        - status
        - findings-summary
        - dimension-coverage
        - progress
        - next-focus
    pauseSentinel:
      pathPattern: "{artifact_dir}/.deep-review-pause"
      machineOwned: false
      description: Operator-controlled sentinel checked between iterations to pause the loop without discarding state.
    jsonl:
      pathPattern: "{artifact_dir}/deep-review-state.jsonl"
      iterationRecord:
        required:
          - type
          - mode
          - run
          - status
          - focus
          - dimensions
          - filesReviewed
          - findingsCount
          - findingsSummary
          - findingsNew
          - findingDetails
          - newFindingsRatio
          - sessionId
          - generation
          - lineageMode
          - timestamp
          - durationMs
        optional:
          - parentSessionId
          - continuedFromRun
          - findingsRefined
          - findingRefs
          - traceabilityChecks
          - coverage
          - noveltyJustification
          - ruledOut
          - focusTrack
          - scoreEstimate
          - segment
          - convergenceSignals
          - graphEvents
      synthesisEvent:
        required:
          - type
          - event
          - mode
          - totalIterations
          - verdict
          - activeP0
          - activeP1
          - activeP2
          - dimensionCoverage
          - stopReason
          - timestamp

# Render targets define machine-generated contract fragments. Exactly one
# target is real: the human-readable snapshot rendered by
# render-contract-snapshot.cjs. Everything else that mentions this contract's
# taxonomy (target types, dimensions, severities, verdicts, quality gates,
# convergence, cross-reference protocols) is hand-authored — see
# authoredArtifacts below, not rendered from this file.
render:
  artifacts:
    - id: review-contract-snapshot
      path: .opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract_snapshot.md
      ownership: generated
      generator: .opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs
      format: markdown
      markers:
        begin: "<!-- BEGIN GENERATED: review-mode-contract/snapshot -->"
        end: "<!-- END GENERATED: review-mode-contract/snapshot -->"
      sections:
        - meta
        - target-types

exec
/bin/zsh -lc "rg -n \"severity|P0|P1|P2|reviewDimensions|dimensions:\" ../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml | head -100 && sed -n '100,220p' ../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
60:  dimensions:
84:    - id: P0
88:    - id: P1
92:    - id: P2
101:      condition: "activeP0 > 0 OR any required quality gate fails"
105:      condition: "activeP0 == 0 AND activeP1 > 0"
109:      condition: "activeP0 == 0 AND activeP1 == 0"
110:      hasAdvisoriesMetadata: "Set hasAdvisories=true when activeP2 > 0."
132:        - severity-coverage
145:        description: Rolling average of severity-weighted new findings across recent evidence-bearing iterations.
148:        description: Robust noise-floor test comparing the latest severity-weighted ratio against MAD-derived churn.
152:    severityMath:
204:      description: All dimensions are covered and no new P0/P1 findings appeared in the latest stabilization pass.
206:      description: At least one unresolved P0 finding is present.
242:      failCriteria: Runtime definitions materially diverge in contract, permissions, workflow, or severity/evidence rules.
365:          - activeP0
366:          - activeP1
367:          - activeP2
467:      description: "Confirm the dimension, severity, and verdict ids (plus cross-reference-protocol ids for the two workflow YAMLs) declared in each authoredArtifacts entry's enumParityChecked are still literally present in that file; see deep-review-contract-parity.vitest.ts."
      label: Fail
      condition: "activeP0 > 0 OR any required quality gate fails"
      nextCommand: /speckit:plan
    - id: CONDITIONAL
      label: Conditional
      condition: "activeP0 == 0 AND activeP1 > 0"
      nextCommand: /speckit:plan
    - id: PASS
      label: Pass
      condition: "activeP0 == 0 AND activeP1 == 0"
      hasAdvisoriesMetadata: "Set hasAdvisories=true when activeP2 > 0."
      nextCommand: /create:changelog

  # Binary gates applied after convergence math votes STOP.
  qualityGates:
    - id: evidence
      label: Evidence
      binary: true
      combines:
        - evidence-completeness
        - no-inference-only
      rule: Every active finding must be backed by concrete file:line evidence and may not rely only on inference.
    - id: scope
      label: Scope
      binary: true
      combines:
        - scope-alignment
      rule: Reviewed files, targets, and conclusions must stay inside the declared review scope.
    - id: coverage
      label: Coverage
      binary: true
      combines:
        - severity-coverage
        - cross-reference
      rule: Required dimensions and required traceability protocols must be covered before STOP is allowed.

  # Review-specific convergence settings calibrated from the v2 research.
  convergence:
    defaults:
      maxIterations: 7
      convergenceThreshold: 0.10
      stuckThreshold: 2
    signals:
      - id: rolling-average
        weight: 0.30
        description: Rolling average of severity-weighted new findings across recent evidence-bearing iterations.
      - id: mad-noise-floor
        weight: 0.25
        description: Robust noise-floor test comparing the latest severity-weighted ratio against MAD-derived churn.
      - id: dimension-coverage
        weight: 0.45
        description: Coverage vote based on required dimension completion plus required protocol coverage stability.
    severityMath:
      refinementMultiplier: 0.5
      p0OverrideMinRatio: 0.50
      noFindingsRatio: 0.0
    coverageAge:
      minStabilizationPasses: 1
    thresholds:
      rollingStopThreshold: 0.08
      noProgressThreshold: 0.05
      compositeStopScore: 0.60

  lifecycleModes:
    - id: new
      description: Create a brand-new review lineage with generation 1 and no parent session.
    - id: resume
      description: Continue the current review lineage without changing generation.
    - id: restart
      description: Start a new generation for the same target and archive the prior review packet state.
    - id: fork
      status: deferred
      description: Reserved compatibility branch. The current runtime does not emit or accept fork review lineages.
    - id: completed-continue
      status: deferred
      description: Reserved compatibility branch. The current runtime does not reopen completed sessions under a completed-continue lineage.

  lineageFields:
    - sessionId
    - parentSessionId
    - lineageMode
    - generation
    - continuedFromRun

  reducer:
    enabled: true
    inputs:
      - latestJSONLDelta
      - newIterationFile
      - priorReducedState
    outputs:
      - findingsRegistry
      - dashboardMetrics
      - strategyUpdates
    failureModes:
      malformedDelta: skip-and-warn
      missingIterationFile: no-op-with-error
      schemaMismatch: reject-with-conflict-event
    idempotent: true

  releaseReadinessStates:
    - id: in-progress
      description: Review is ongoing or coverage is incomplete.
    - id: converged
      description: All dimensions are covered and no new P0/P1 findings appeared in the latest stabilization pass.
    - id: release-blocking
      description: At least one unresolved P0 finding is present.

  # Cross-reference protocols are typed traceability checks. Core protocols are
  # hard gates; overlay protocols apply only to matching target types.
  crossReferenceProtocols:
    - id: spec_code
      dimension: traceability
      level: core
      appliesTo: [spec-folder, skill, agent, track, files]
      gateClass: hard
      passCriteria: All normative claims resolve to shipped behavior or explicitly documented non-applicability with evidence.
      partialCriteria: Some claims resolve, but one or more claims remain ambiguous or blocked by missing evidence.
      failCriteria: A normative claim contradicts shipped behavior, references missing implementation, or cannot be reconciled.
    - id: checklist_evidence
      dimension: traceability

exec
/bin/zsh -lc "sed -n '50,105p' ../../../../../skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch
 succeeded in 0ms:
      cliValue: track
      label: Track
      description: Review a spec track spanning multiple child spec folders and shared coordination artifacts.
    - id: files
      cliValue: files
      label: Files
      description: Review an explicit file set plus immediate cross-references required to evaluate shipped behavior.

  # Simplified review dimensions. Traceability and maintainability absorb the
  # prior seven-dimension model's overlap.
  dimensions:
    - id: correctness
      priority: 1
      label: Correctness
      checks: Validate logic, invariants, state transitions, edge cases, and behavior against observable intent.
      requiredForSeverityCoverage: true
    - id: security
      priority: 2
      label: Security
      checks: Validate trust boundaries, authz/authn behavior, input handling, secrets exposure, and exploit paths.
      requiredForSeverityCoverage: true
    - id: traceability
      priority: 3
      label: Traceability
      checks: Validate spec alignment, completeness, checklist evidence, and cross-reference integrity across linked artifacts.
      requiredForSeverityCoverage: false
    - id: maintainability
      priority: 4
      label: Maintainability
      checks: Validate codebase patterns, documentation quality, clarity, and ease of safe follow-on changes.
      requiredForSeverityCoverage: false

  # Severity contract stays stable across review outputs.
  severities:
    - id: P0
      weight: 10.0
      label: Blocker
      requiresFileLineEvidence: true
    - id: P1
      weight: 5.0
      label: Required
      requiresFileLineEvidence: true
    - id: P2
      weight: 1.0
      label: Suggestion
      requiresFileLineEvidence: true

  # Verdicts collapse PASS WITH NOTES into PASS + hasAdvisories metadata.
  verdicts:
    - id: FAIL
      label: Fail
      condition: "activeP0 > 0 OR any required quality gate fails"
      nextCommand: /speckit:plan
    - id: CONDITIONAL
      label: Conditional
      condition: "activeP0 == 0 AND activeP1 > 0"

codex
Deep-review’s moat should be “proof-carrying longitudinal review,” not merely more review passes. A material finding should retain identity across revisions, survive active falsification, and eventually carry an immutable fix-verification receipt.

The current design is already close: nine legal-stop gates, typed P0/P1 adjudication, cross-pass state, and security-sensitive fix replay. Three weaknesses remain:

- The reducer’s primary identity is an agent-supplied hash incorporating file, line, type, and description; its fallback is also line-based ([reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:748)). That is brittle under line movement and paraphrase.
- Claim adjudication validates that the reviewer described counterevidence, not that independent refuters actually ran ([state_format.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md:409)).
- Coverage records whether four broad dimensions were visited, rather than whether risk-specific cells reached sufficient evidence depth ([review_mode_contract.yaml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml:60)).

### 1. Replace self-adjudication with a deterministic-first refutation cascade

Use this order:

1. Schema, diff-scope, compilation, type, lint, and existing tests.
2. Diff-filtered static results from SARIF, Semgrep, CodeQL, or stack-native analyzers.
3. Claim-specific execution: reproducer, property test, sanitizer, or targeted mutation.
4. LLM judge only for the unresolved semantic residual.
5. Independent refuters for proposed P0/P1 findings.

This is implementable rather than aspirational. Reviewdog’s `filter.FilterCheck` preserves every diagnostic while separately recording `ShouldReport`, diff-file membership, diff-context membership, source lines, and old positions—exactly the separation deep-review needs between “detected” and “relevant to this change” ([source](https://github.com/reviewdog/reviewdog/blob/master/filter/filter.go)). Semgrep’s newer Workflows explicitly combine deterministic scanners, custom validation, and LLM-backed analysis ([docs](https://semgrep.dev/docs/workflows/overview)); Promptfoo already exposes deterministic assertions and model-graded assertions through one result shape ([docs](https://www.promptfoo.dev/docs/configuration/expected-outputs/)).

Each attempt should append a `verification_attempt` JSONL event containing `findingId`, `verifierKind`, `independenceClass`, `tool/version`, `commandDigest`, `targetRevision`, `sourceTreeDigest`, `harnessDigest`, `outcome=supports|refutes|inconclusive`, and artifact hashes.

“Refute-by-N” should count independent evidence classes, not agents. Fresh context using the same model is weaker than a different tool family; an executable positive-control test is stronger than either. A reasonable P0 policy is one executable support plus one independent structural analysis. Two independent refutations, including at least one executable or symbolic refutation, move the finding to `rebutted`; conflicting strong evidence moves it to `contested`, never silently resolved.

The recent CASCADE paper supplies a useful two-sided control: it reports a documentation inconsistency only when a generated test fails on real code and passes on documentation-derived code. On its reported real-repository run, 10 of 13 newly found inconsistencies were subsequently fixed ([paper](https://arxiv.org/abs/2604.19400)). Deep-review should generalize that into “candidate fails, positive control passes”—where the positive control can be the base revision, a specification-derived oracle, or a known-good reference.

Generated verifiers must run outside the reviewed tree, with the target mounted read-only and command/harness/source digests recorded. Otherwise an agent can manufacture green evidence by weakening tests or commands.

Useful gauges: `deterministic_elimination_rate`, `judge_escalation_rate`, attempts by independence class, `contested_findings`, refutation budget remaining, and executable-support coverage by severity.

### 2. Move finding identity into the reducer and version it

OASIS SARIF explicitly warns against absolute line numbers in fingerprints and supports versioned partial fingerprints plus `new|unchanged|updated|absent` baseline states ([spec](https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html)). CodeQL Action’s concrete implementation hashes a rolling window of 100 non-whitespace characters, normalizes line endings, and disambiguates repeated context hashes ([fingerprints.ts](https://github.com/github/codeql-action/blob/main/src/fingerprints.ts)).

Deep-review should adopt a reducer-owned matching cascade:

1. Exact prior durable ID.
2. `rule/claim-class + symbol FQN + normalized AST/program-slice hash`.
3. Rename-aware path plus rolling context hash.
4. Source/sink or invariant endpoints plus root-cause class.
5. Ambiguous candidate linkage requiring adjudication—never automatic merge.

Store versioned components such as `symbolContext/v1`, `sliceHash/v1`, and `rollingContext/v1`, allowing algorithms to evolve without losing continuity. The iteration agent may provide partial identity hints, but the reducer must assign the durable identity. Microsoft’s current AI-SARIF guidance makes the same ownership distinction: AI producers should not persist final fingerprints; result management owns cross-run identity ([guidance](https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md)).

Expand lifecycle dispositions to `fixed`, `rebutted`, `accepted-risk`, `superseded`, `workflow-rejected`, and `absent-unverified`. Suppressions should carry the relevant symbol/slice/dependency fingerprint and automatically expire when that dependency set changes.

Useful gauges: ambiguous-match rate, merges and splits, findings reborn after suppression, suppression invalidations, and baseline-state transitions.

### 3. Make coverage evidence-deep and fix verification regression-backed

Keep the four public dimensions stable, but add dynamically required cells beneath them. Examples:

- Auth/input changes require security × trust-boundary and negative-path cells.
- Locks, queues, or async state require correctness × concurrency.
- Public schema/API changes require traceability × compatibility.
- Test changes require correctness × test-quality and mutation-survival cells.

Cell states should be `not-applicable`, `unexamined`, `deterministic-checked`, `judge-reviewed`, `executably-verified`, or `blocked`. “Covered” means every risk-triggered cell reached its required depth, not that a reviewer visited its parent dimension.

Severity must also become orthogonal to confidence. Microsoft’s AI-SARIF profile separates `level` from confidence-like `rank`, and adds exploitability plus structured evidence `{strength, scope, backing[]}` ([guidance](https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md)). Deep-review can preserve P0/P1/P2 as impact while separately recording `confidence`, `reachability`, `evidenceStrength`, and `evidenceScope`.

For reruns after remediation, require:

- The prior reproducer fails before the fix and passes after it.
- The pinned baseline verification suite remains non-regressive.
- Relevant mutation survivors are killed or explicitly adjudicated.
- Commands, harness, source revision, and outputs are hash-addressed.

PIT provides mutation, coverage, and test-strength thresholds plus history-backed incremental analysis ([Maven reference](https://pitest.org/quickstart/maven/)). Its own documentation warns that cached mutation outcomes can become wrong when dependencies change, so deep-review should invalidate caches from the finding’s dependency slice rather than changed-line overlap alone ([incremental-analysis warning](https://pitest.org/quickstart/incremental_analysis/)).

This sharpens the unique value: single-shot reviewers produce comments; linters produce detections; other deep modes produce research, deliberation, improvement candidates, or conformance judgments. Deep-review alone can remain read-only while maintaining a revision-spanning ledger of what was alleged, how it was independently challenged, what changed, and whether the original failure is now demonstrably gone.

```json
{
  "new_repos": [
    {
      "name": "reviewdog/reviewdog",
      "url": "https://github.com/reviewdog/reviewdog",
      "stars": "~9.5k",
      "what": "Language-agnostic review diagnostic router; latest tagged release observed v0.21.0 in September 2025.",
      "lesson": "Preserve all deterministic diagnostics but separately track diff relevance, source context, and reportability before escalating residuals to judges.",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "github/codeql-action",
      "url": "https://github.com/github/codeql-action",
      "stars": "~1.6k",
      "what": "CodeQL analysis and SARIF upload implementation; CodeQL Bundle v2.26.0 released July 8, 2026.",
      "lesson": "Use normalized rolling source-context fingerprints and occurrence disambiguation instead of absolute lines for cross-revision finding identity.",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "microsoft/sarif-sdk",
      "url": "https://github.com/microsoft/sarif-sdk",
      "stars": "~223",
      "what": "SARIF object model, validation tooling, and recent AI-finding profile; v4.6.5 released May 18, 2026.",
      "lesson": "Separate severity, confidence, exploitability, evidence strength and scope; assign durable fingerprints in the reducer rather than the AI producer.",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/gauges-observability", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "name": "hcoles/pitest",
      "url": "https://github.com/hcoles/pitest",
      "stars": "~1.8k",
      "what": "JVM mutation-testing and verification system; v1.25.7 released July 8, 2026.",
      "lesson": "Turn accepted findings into mutation or reproduction obligations and gate later fixes on pre-fix failure, post-fix success, and non-regressing test strength.",
      "maps_to": ["deep-review", "runtime/convergence", "runtime/gauges-observability", "runtime/budget-cost"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "The judge should see only the semantic residual left after schema, build, test, diff-filtered static analysis, and claim-specific executable checks; deterministic failures and eliminations remain first-class receipts.",
      "evidence": "https://github.com/reviewdog/reviewdog/blob/master/filter/filter.go ; https://semgrep.dev/docs/workflows/overview ; https://www.promptfoo.dev/docs/configuration/expected-outputs/",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Refute-by-N must count independent evidence classes rather than repeated LLM votes; require a two-sided executable control so a malformed generated reproducer cannot confirm its own finding.",
      "evidence": "https://arxiv.org/abs/2604.19400",
      "maps_to": ["deep-review", "runtime/fan-out-fan-in", "runtime/convergence", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "insight": "Cross-pass finding identity should use versioned partial fingerprints based on symbols, normalized source context, program slices, and rename mapping; baseline state should distinguish new, updated, unchanged, and absent.",
      "evidence": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html ; https://github.com/github/codeql-action/blob/main/src/fingerprints.ts",
      "maps_to": ["deep-review", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing", "runtime/continuity-threading"],
      "confidence": "high"
    },
    {
      "insight": "P0/P1/P2 should remain an impact axis while confidence, reachability, exploitability, evidence strength, and evidence scope are recorded independently; otherwise repeated judge agreement can incorrectly inflate severity.",
      "evidence": "https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md",
      "maps_to": ["deep-review", "runtime/gauges-observability", "runtime/convergence"],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Add reducer-validated verification_attempt JSONL events and a refute-by-independent-class policy. Run deterministic checks first, require two-sided executable controls for generated reproducers, and classify unresolved support/refutation conflicts as contested.",
      "target": "deep-review + runtime/fan-out-fan-in + runtime/state-jsonl-checkpointing + runtime/gauges-observability",
      "rationale": "The current adjudication gate validates packet completeness and self-reported counterevidence, not whether independent falsification actually occurred.",
      "uniqueness": "Creates a longitudinal proof ledger that single-shot reviewers, static linters, research loops, and planning councils do not maintain.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://arxiv.org/abs/2604.19400 ; https://semgrep.dev/docs/workflows/overview"
    },
    {
      "rec": "Replace the line-and-description content hash with reducer-owned, versioned partial fingerprints and a confidence-ordered matching cascade; add explicit baseline states and longitudinal dispositions, and invalidate suppressions from symbol, program-slice, and dependency fingerprints.",
      "target": "deep-review + runtime/dedup-novelty + runtime/state-jsonl-checkpointing + runtime/continuity-threading",
      "rationale": "Line movement, renames, and paraphrased descriptions currently create duplicate findings or unsafe merges, weakening both convergence math and historical suppression.",
      "uniqueness": "Lets deep-review reason about one defect across many passes and patch revisions instead of generating stateless comments per commit.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html ; https://github.com/github/codeql-action/blob/main/src/fingerprints.ts"
    },
    {
      "rec": "Introduce risk-triggered coverage cells with evidence-depth states, orthogonal severity/confidence/exploitability fields, and immutable regression receipts requiring pre-fix failure, post-fix success, baseline non-regression, and targeted mutation-survivor adjudication.",
      "target": "deep-review + runtime/convergence + runtime/gauges-observability + runtime/budget-cost",
      "rationale": "A boolean dimension visit cannot distinguish cursory inspection from executable verification, while a green post-fix test alone does not prove that the test detects the original defect.",
      "uniqueness": "Turns review convergence into release-readiness evidence accumulated across remediation cycles, which is outside the contract of single-shot reviewers and the other read-only deep modes.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/microsoft/sarif-sdk/blob/main/docs/ai/generating-sarif.md ; https://pitest.org/quickstart/maven/"
    }
  ],
  "contradictions": [
    {
      "claim": "File path plus absolute line range is a suitable primary cross-pass finding identity.",
      "counter": "SARIF explicitly warns that absolute line numbers destabilize fingerprints after unrelated insertions; location should be supplemented by stable semantic and contextual components.",
      "evidence": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html"
    },
    {
      "claim": "Fresh-context repetition by the same reviewer is sufficient adversarial verification.",
      "counter": "Fresh context reduces anchoring but does not create tool or evidence independence; CASCADE's false-positive control comes from complementary executions with opposite expected outcomes.",
      "evidence": "https://arxiv.org/abs/2604.19400"
    },
    {
      "claim": "Incremental mutation history can be reused whenever the directly mutated file is unchanged.",
      "counter": "PIT warns that dependency changes can alter behavior without changing the mutated class and that several history optimizations introduce possible error.",
      "evidence": "https://pitest.org/quickstart/incremental_analysis/"
    }
  ],
  "next_angles": [
    "Benchmark the evidence-independence taxonomy on longitudinal review histories: accepted, rebutted, ignored-risk, superseded, workflow-rejected, and later-regressed findings.",
    "Specify suppression invalidation from program slices, symbol identities, dependency manifests, build flags, and verifier-command digests, then measure false carry-forward versus line-overlap invalidation.",
    "Mine changed-code features and historical misses to learn mandatory concurrency, compatibility, security, and test-quality coverage cells and their minimum evidence depth."
  ],
  "notes": "The CASCADE paper was verifiable, but no public implementation repository was located, so it is evidence only and not listed as a new repo. Cascade's commercial evaluator documentation exposes code and LLM scorer types, but I could not verify a corresponding public reference implementation. The proposed thresholds and independence policy still need calibration against system-deep-loop's own accepted/rebutted finding history."
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
218,662
