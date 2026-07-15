<!-- iteration 19 | SOL xhigh | mode: deep-improvement | angle: A4-fail deep-improvement :: failure modes & guardrails | 2026-07-15T09:36:06.769Z -->

Deep-improvement’s next moat is not a smarter score. It is an evaluator that the optimizer cannot inspect, query exhaustively, modify, or impersonate—and whose signed decision is the only promotion credential.


### Failure taxonomy and fail-safe response

| Degeneration | Detection | Fail-safe | Maps to |
|---|---|---|---|
| Regressional Goodhart: selecting the luckiest noisy candidate | Paired candidate/baseline results; sequentially valid or Ladder-style material-improvement threshold; count all evaluator queries | Keep baseline unless the paired improvement clears the adaptive threshold; exact scores remain hidden until session end | deep-improvement, runtime/convergence, runtime/budget-cost |
| Extremal Goodhart: mode collapse or capability drift outside the evaluator’s calibrated region | Per-slice lower bounds plus automatic weak-segment search; MMD/permutation tests over action/tool-trace embeddings | Veto new weak slices; unexplained trace drift forces shadow evaluation, never direct promotion | deep-improvement, runtime/gauges-observability |
| Causal Goodhart: changing proxy-visible structure without improving behavior | Divergence between visible score, sealed-canary score, and gold-calibrated score; metamorphic canaries | A visible gain with flat/negative sealed evidence is `PROXY_ONLY_GAIN` and blocks promotion | deep-improvement |
| Adversarial Goodhart: oracle leakage, sycophancy, reward/test tampering | Honeypot evaluator files, credentials, cache keys and logs; semantic leak scan; stance-flip canaries; separate reward and oversight channels | Immediate non-overridable veto; burn the canary epoch and invalidate every receipt derived from it | deep-improvement, runtime/state-jsonl-checkpointing |

This taxonomy comes directly from regressional, extremal, causal, and adversarial Goodhart, rather than treating every failure as generic “benchmark instability.” [Manheim and Garrabrant](https://arxiv.org/abs/1803.04585) provide the taxonomy; [reward-model overoptimization](https://arxiv.org/abs/2210.10760) shows why additional proxy optimization can eventually reduce gold performance.

### Three concrete changes

1. **EvaluatorCapsule V2 — uniqueness-sharpening.** Make promotion consume a signed receipt:

   `evaluate({candidateHash, baselineHash, evaluatorEpoch, queryOrdinal}) → EvaluatorReceiptV2`

   The receipt should bind `candidateHash`, `baselineHash`, `evaluatorHash`, sealed-canary epoch, query count, gold-calibration result, tamper signals, slice vetoes, decision, and signature. It must omit fixture IDs, prompts, exact scores, grader prompt, and cache details. `promote-candidate.cjs` should reject unsigned, replayed, stale-epoch, mismatched-hash, or veto-bearing receipts. Sealed/gold regressions and scoring-surface mutation must have no same-session override; a legitimate rubric change starts a new evaluator epoch and recalibrates gold.

   Anthropic’s reward-tampering artifacts separate `reward_cmd` from `oversight_cmd`, and recorded cases where agents edited both reward and tests—exactly why ordinary success signals cannot authorize promotion by themselves. [Repository and artifact contract](https://github.com/anthropics/sycophancy-to-subterfuge-paper).

2. **Non-extractive evaluator feedback.** Apply the [Ladder](https://proceedings.mlr.press/v37/blum15.html) principle: update candidate-visible feedback only after a statistically material improvement; otherwise return the prior coarse band. A suitable response is `{verdictBand, vetoClass, queriesRemaining}`, not dimension scores or failing fixture names. Exact evidence becomes visible only after the session is terminal.

   Before promotion, scan candidate text, proposer-visible prompts, summaries, caches, and logs against sealed fixtures inside the capsule. `lm-sys/llm-decontaminator` gives a concrete two-stage implementation: SentenceTransformer cosine top-k retrieval in `vector_db.py`, followed by binary semantic-equivalence adjudication in `llm_detect.py`. Any semantic match burns the canary epoch.

3. **Regression envelope instead of aggregate thresholds.** Preserve the aggregate gate, but make it insufficient. Record paired deltas by task family, difficulty, tool-use pattern, cost/latency decile, and mutation family. Discover additional weak slices using Deepchecks’ tree-based error segmentation. Compare baseline and candidate action-trace embeddings with an MMD permutation test; Alibi Detect exposes `MMDDrift(...).predict(..., return_p_val=True, return_distance=True)`.

   Drift statistics need baseline false-positive calibration and adequate samples; with sparse fixtures, use deterministic per-slice floors and paired exact tests instead. The existing `--allow-hurt-fixtures` may remain for visible exploratory fixtures, but never for sealed canaries or gold anchors.

### Moat thesis

Naive self-improvement produces a candidate and a self-congratulatory score. Deep-research gathers evidence, deep-review finds defects, council deliberates, and alignment checks a named authority—but none should possess mutation authority.

Deep-improvement can uniquely produce a bounded, rollback-capable, tamper-tested promotion decision: one actor proposes; a sealed counterparty attempts to falsify the improvement; a signed, veto-free receipt authorizes accept/ship. Sharpening that separation turns “the score went up” into “the candidate survived an evaluator it could neither learn nor alter.” That is the defensible moat.

Source maturity: Anthropic’s artifact repo has ~28 stars and was archived June 2025; LiveBench has ~1.2k stars and a January 2026 changelog entry; llm-decontaminator has ~324 stars but no releases and is 2023-era code; Alibi Detect has ~2.5k stars with v0.13.0 from December 2025; Deepchecks has ~4k stars with v0.19.1 from December 2024. [Anthropic](https://github.com/anthropics/sycophancy-to-subterfuge-paper), [LiveBench changelog](https://github.com/LiveBench/LiveBench/blob/main/changelog.md), [LLM Decontaminator](https://github.com/lm-sys/llm-decontaminator), [Alibi Detect](https://github.com/SeldonIO/alibi-detect), [Deepchecks](https://github.com/deepchecks/deepchecks).

```json
{
  "new_repos": [
    {
      "name": "anthropics/sycophancy-to-subterfuge-paper",
      "url": "https://github.com/anthropics/sycophancy-to-subterfuge-paper",
      "stars": "~28",
      "what": "2024 reward-tampering artifacts, archived June 2025; environments.json separates reward_cmd from oversight_cmd and publishes tampering samples.",
      "lesson": "Optimization reward and tamper oversight must be independent channels; successful task reward cannot itself authorize promotion.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "LiveBench/LiveBench",
      "url": "https://github.com/LiveBench/LiveBench",
      "stars": "~1.2k",
      "what": "ICLR 2025 benchmark with objective ground-truth scoring, rotating questions, and a changelog updated January 2026.",
      "lesson": "Use versioned canary epochs that rotate before repeated adaptive evaluation turns them into training data; prefer deterministic ground truth over judge opinion.",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "lm-sys/llm-decontaminator",
      "url": "https://github.com/lm-sys/llm-decontaminator",
      "stars": "~324",
      "what": "2023 contamination detector using embedding top-k retrieval in vector_db.py followed by LLM semantic-equivalence classification in llm_detect.py; no releases.",
      "lesson": "Scan every proposer-visible artifact for paraphrased canary leakage inside the evaluator boundary, returning only a leak veto rather than the matching text.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "SeldonIO/alibi-detect",
      "url": "https://github.com/SeldonIO/alibi-detect",
      "stars": "~2.5k",
      "what": "Outlier, adversarial, and drift detection library; v0.13.0 released December 2025, including MMD, KS, classifier, and online detectors.",
      "lesson": "Compare baseline and candidate action-trace distributions, not only final scores; unexplained semantic or tool-use drift is evidence of capability drift.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "deepchecks/deepchecks",
      "url": "https://github.com/deepchecks/deepchecks",
      "stars": "~4k",
      "what": "Continuous model/data validation library; v0.19.1 released December 2024, with WeakSegmentsPerformance and configurable pass/fail conditions.",
      "lesson": "Train shallow error-prediction trees over fixture metadata to discover concentrated regressions that aggregate promotion scores conceal.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Classify every promotion failure as regressional, extremal, causal, or adversarial Goodhart and attach a distinct detection receipt and veto; generic benchmark_failed loses the evidence needed to improve the evaluator.",
      "evidence": "https://arxiv.org/abs/1803.04585",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evaluator success and evaluator-integrity oversight must be separate outputs: a candidate can pass the nominal task while modifying reward, tests, caches, or evidence.",
      "evidence": "https://github.com/anthropics/sycophancy-to-subterfuge-paper",
      "maps_to": [
        "deep-improvement"
      ],
      "confidence": "high"
    },
    {
      "insight": "Adaptive evaluator feedback is an information leak; reveal only thresholded verdict bands during optimization and withhold exact scores and fixture identities until session termination.",
      "evidence": "https://proceedings.mlr.press/v37/blum15.html",
      "maps_to": [
        "deep-improvement",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Canary freshness needs an explicit lifecycle—sealed, active, burned, retired—and semantic leakage detection because paraphrases and translations bypass literal matching.",
      "evidence": "https://github.com/LiveBench/LiveBench; https://github.com/lm-sys/llm-decontaminator",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Optimization pressure is itself a risk signal: track cumulative evaluator queries and candidate fan-out against sealed/gold gain, and stop when proxy gain continues while independent gain stalls or reverses.",
      "evidence": "https://arxiv.org/abs/2210.10760",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement EvaluatorReceiptV2 and require promote-candidate.cjs to verify its signature, candidate/baseline/evaluator hashes, fresh canary epoch, gold calibration, query count, and empty veto set; make sealed/gold regression and evaluator-surface mutation non-overridable.",
      "target": "deep-improvement; runtime/state-jsonl-checkpointing",
      "rationale": "This closes forged receipts, stale evidence, reward/test tampering, and same-session rubric changes while keeping exact evaluator internals outside the mutator's capability boundary.",
      "uniqueness": "Makes deep-improvement the only mode that can issue cryptographically bound mutation authority after independent falsification, not merely advice or a higher score.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/anthropics/sycophancy-to-subterfuge-paper; https://arxiv.org/abs/2406.10162"
    },
    {
      "rec": "Add a non-extractive evaluator-oracle API: Ladder-style material-improvement updates, coarse verdict bands, per-epoch query budgets, terminal-only exact evidence, semantic leak scanning across candidate/proposer-visible artifacts, and automatic canary-epoch burn on any match.",
      "target": "deep-improvement; runtime/budget-cost; runtime/dedup-novelty",
      "rationale": "Repeated dimension-level feedback lets the optimizer reconstruct the promotion surface even when fixture files are hidden; coarse thresholded feedback and semantic scanning reduce that channel.",
      "uniqueness": "Sharpens the frozen-evaluator moat by making evaluator secrecy an enforced information-flow property rather than an operator convention.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://proceedings.mlr.press/v37/blum15.html; https://github.com/lm-sys/llm-decontaminator; https://github.com/LiveBench/LiveBench"
    },
    {
      "rec": "Replace aggregate-only promotion with a regression envelope: paired global lower bound, non-overridable sealed/gold slice floors, automatic weak-segment discovery, action-trace drift testing, and proxy-versus-sealed gain curves indexed by evaluator query count.",
      "target": "deep-improvement; runtime/gauges-observability; runtime/convergence",
      "rationale": "Aggregate gains can conceal mode collapse, tail regressions, and behavior drift; the envelope turns each into a named promotion veto and stops overoptimization before the proxy/gold relationship reverses.",
      "uniqueness": "",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/deepchecks/deepchecks; https://github.com/SeldonIO/alibi-detect; https://arxiv.org/abs/2210.10760"
    }
  ],
  "contradictions": [
    {
      "claim": "Increasing a frozen proxy score makes a candidate increasingly likely to be better.",
      "counter": "Gold performance can peak and then decline as optimization pressure against an imperfect proxy increases; evaluator query count and candidate fan-out must be treated as risk variables.",
      "evidence": "https://arxiv.org/abs/2210.10760"
    },
    {
      "claim": "A different-family LLM grader is sufficient evaluator independence.",
      "counter": "Different-family grading removes one correlated-bias channel but does not make judgments objective or contamination-free; LiveBench adopted objective ground truth and reports severe judge error on hard tasks.",
      "evidence": "https://github.com/LiveBench/LiveBench/blob/main/changelog.md"
    },
    {
      "claim": "Repeatability evidence is advisory only in the current promotion contract.",
      "counter": "The shipped promotion path hard-fails when the repeatability report is missing or passed is not true; only weight recommendations are advisory.",
      "evidence": ".opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md; .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs"
    }
  ],
  "next_angles": [
    "Build the evaluator-oracle leakage benchmark already flagged: vary exact-score, dimension-band, pass/fail, Ladder-thresholded, and terminal-only feedback while measuring canary reconstruction rate per evaluator query.",
    "Attack-test EvaluatorReceiptV2 with replayed receipts, candidate-hash substitution, stale canary epochs, forged signatures, altered gold calibration, and accept-to-ship evaluator drift.",
    "Calibrate regression-envelope false veto rates across sparse agent fixtures: paired exact tests versus bootstrap bounds, weak-segment minimum sizes, and MMD permutation tests on action traces."
  ],
"notes": "The strongest existing isolation is MMD and tree-discovered weak slices are transfers from ML monitoring, not yet validated on agent traces, so their false-veto rates need calibration before becoming hard gates. The Anthropic repository is archived and llm-decontaminator is older research code; both are mechanism references, not dependencies to vendor unchanged."
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
session id: 019f651d-1360-7ea1-9650-70e6b7afe01a
--------
user
You are iteration 19/40 of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.
system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.

TARGET MODE: deep-improvement
MODE IDENTITY (what it does today): Evaluator-first bounded agent improvement: 5-dimension scoring, dynamic profiling, packet-local candidates, guarded promotion.
GENERIC ALTERNATIVE it must out-value: naive 'ask the model to improve its own prompt/agent' with no frozen evaluator

THIS ITERATION'S ANGLE (A4-fail): deep-improvement :: failure modes & guardrails
DIRECTIVE: How do self-improvement loops DEGENERATE: reward hacking, evaluator overfitting, mode collapse, capability drift, sycophancy amplification, spurious 'improvements'. Find taxonomies + detection + guardrails (frozen canaries, held-out evals, promotion vetoes). Recommend how deep-improvement fails safe.

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
THIS run's new repos so far (72) — also do not repeat:
  assafelovic/gpt-researcher, langchain-ai/local-deep-researcher, GAIR-NLP/DeepResearcher, bytedance/deer-flow, asreview/asreview, ResearchObject/ro-crate-py, in-toto/attestation, imlrz/DeepResearch-Bench-II, markrussinovich/refchecker, amazon-science/RefChecker, amazon-science/RAGChecker, microsoft/BIPIA, Future-House/paper-qa, CoLRev-Environment/colrev, trungdong/prov, ourresearch/openalex-docs, The-PR-Agent/pr-agent, semgrep/semgrep, SWE-bench/SWE-smith, withmartian/code-review-benchmark, PurCL/RepoAudit, adamjgmiller/adamsreview, stryker-mutator/stryker-js, reviewdog/reviewdog, github/codeql-action, microsoft/sarif-sdk, hcoles/pitest, crytic/slither, rust-lang/rust-clippy, SonarSource/sonarqube, FoundryHQ-AI/swe-prbench, kaustpradalab/LLM-sycophancy, facebook/infer, joernio/joern, Wilfred/difftastic, ASSERT-KTH/collector-sahab, diffkemp/diffkemp, SpaceHunterInf/DMAD, tmlr-group/ECON, algorithmicsuperintelligence/optillm, dayeonki/cultural_debate, deeplearning-wisc/MAD-identity-bias, Multi-Agent-LLMs/mallm, lkaesberg/decision-protocols, MraDonkey/DMAD, lucasmaystre/choix, pyro-ppl/pyro, ArjunPanickssery/math_problems_debate, ncsoft/offsetbias, snumprlab/lwe, zhiyuan-weng/BenchForm, aialt/SoS-LLMs, Ahren09/AgentReview, compdemocracy/polis, OakleyJ/SHELF, voting-tools/pref_voting, argdown/argdown, yoheinakajima/activegraph, gepa-ai/gepa, algorithmicsuperintelligence/openevolve, stanford-iris-lab/meta-harness, A-EVO-Lab/AdaptiveHarness, ShengranHu/ADAS, xianglinyang/llm-as-a-judge-attack, tlc4418/llm_optimization, argoproj/argo-rollouts, Giskard-AI/giskard-oss, microsoft/waza, braintrustdata/autoevals, confident-ai/deepeval, beeevita/EvoPrompt, steven-b-cho/llmorph
Modes covered so far this run: deep-research | deep-review | deep-ai-council | deep-improvement
New insights so far: 76; recommendations: 51.
Open threads flagged: Build an evaluator-oracle leakage benchmark: vary exact-score visibility, dimension-level feedback, pass/fail-only receipts, query budgets, and cross-candidate memory; measure how quickly a BITE-like optimizer learns promotion exploits. | Specify and attack-test the EvaluatorCapsule capability boundary: hidden fixture storage, judge credentials, grader prompts, cache contents, logs, environment variables, side channels, and signed receipt verification. | Measure whether offline held-out, shadow replay, and limited live canary deltas predict post-ship correctness, cost, and rollback rates across heterogeneous agent workloads. | Implement an EvaluatorCapsule attack harness covering grader prompt leakage, environment variables, cache keys, fixture filenames, timing channels, logs, and forged promotion receipts. | Benchmark isotonic versus logistic judge calibration and paired-bootstrap promotion bounds under sparse gold anchors, heterogeneous profiles, and evaluator-version drift. | Measure how well offline held-out, read-only shadow, and limited canary deltas predict post-ship correctness, cost tails, rollback frequency, and metamorphic violations.

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
This is read-only research, so no spec-folder choice is needed. I’m routing it through the named deep-improvement research loop: first I’ll recover the mode-specific context, then verify a small set of non-duplicative sources and extract concrete fail-safe mechanisms rather than adding another catalog.
exec
/bin/zsh -lc "node .opencode/bin/spec-memory.cjs memory_match_triggers --json '{\"prompt\":\"iteration 19/40 deep-improvement failure modes guardrails reward hacking evaluator overfitting mode collapse capability drift sycophancy frozen canaries held-out evals promotion vetoes\"}' --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 3350ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}

codex
The memory daemon is unreachable from this sandbox (`EPERM` on its socket), so there is no hidden continuity to recover beyond the prompt’s prior-work ledger. The research boundary is still clear: new evidence must change deep-improvement’s evaluator/promotion design, not the shared runtime.
exec
/bin/zsh -lc "rg --files .opencode/skills | rg 'system-deep-loop/.*/?SKILL\\.md"'$|system-deep-loop/SKILL'"\\.md"'$|command-spec-kit/.*/?SKILL'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-deep-loop/SKILL.md
.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
.opencode/skills/system-deep-loop/deep-review/SKILL.md
.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
.opencode/skills/system-deep-loop/deep-research/SKILL.md
.opencode/skills/system-deep-loop/deep-alignment/SKILL.md

exec
/bin/zsh -lc "node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"iteration 19 deep-improvement failure modes guardrails research loop reward hacking evaluator overfitting held-out evals promotion vetoes\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 205ms:
{
  "status": "error",
  "error": "backend unavailable: connect EPERM /tmp/mk-skill-advisor/daemon-ipc.sock",
  "exitCode": 75
}

exec
/bin/zsh -lc "wc -l .opencode/skills/system-deep-loop/SKILL.md .opencode/skills/system-deep-loop/deep-improvement/SKILL.md && sed -n '1,260p' .opencode/skills/system-deep-loop/SKILL.md && sed -n '1,320p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     154 .opencode/skills/system-deep-loop/SKILL.md
     339 .opencode/skills/system-deep-loop/deep-improvement/SKILL.md
     493 total
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


codex
Skill routing resolves to `system-deep-loop → deep-improvement`, with evaluation-policy and promotion-operations guidance active. That contract makes one boundary especially relevant here: the mutator must never see or control the evidence that authorizes promotion. I’m checking the shipped evaluator and gate contracts before proposing stronger mechanisms.
exec
/bin/zsh -lc "wc -l 'references/shared/quick_reference.md' 'references/model_benchmark/evaluator_contract.md' 'references/shared/promotion_rules.md' 'references/shared/heldout_and_gold_sets.md' 'references/agent_improvement/score_dimensions.md' 'assets/agent_improvement/improvement_config_reference.md' 'references/shared/rollback_runbook.md' 'references/agent_improvement/stress_test_protocol.md' 'references/shared/promotion_gate_contract.md' 'references/shared/runtime_truth_contracts.md' && sed -n '1,500p' 'references/shared/quick_reference.md' && sed -n '1,500p' 'references/model_benchmark/evaluator_contract.md' && sed -n '1,500p' 'references/shared/promotion_rules.md' && sed -n '1,500p' 'references/shared/heldout_and_gold_sets.md' && sed -n '1,500p' 'references/agent_improvement/score_dimensions.md' && sed -n '1,500p' 'assets/agent_improvement/improvement_config_reference.md' && sed -n '1,500p' 'references/shared/rollback_runbook.md' && sed -n '1,500p' 'references/agent_improvement/stress_test_protocol.md' && sed -n '1,500p' 'references/shared/promotion_gate_contract.md' && sed -n '1,500p' 'references/shared/runtime_truth_contracts.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement
 succeeded in 0ms:
     115 references/shared/quick_reference.md
     144 references/model_benchmark/evaluator_contract.md
     126 references/shared/promotion_rules.md
      47 references/shared/heldout_and_gold_sets.md
     229 references/agent_improvement/score_dimensions.md
     103 assets/agent_improvement/improvement_config_reference.md
      85 references/shared/rollback_runbook.md
      57 references/agent_improvement/stress_test_protocol.md
     323 references/shared/promotion_gate_contract.md
     226 references/shared/runtime_truth_contracts.md
    1455 total
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

---
title: Promotion Rules
description: Keep, reject, and guarded promotion rules for deep-improvement candidates.
trigger_phrases:
  - "promotion rules"
  - "keep vs reject candidate"
  - "promotion prerequisites"
  - "no-go conditions"
importance_tier: important
contextType: implementation
version: 1.17.0.14
---

# Promotion Rules

Policy reference for deciding whether a deep-improvement candidate stays baseline-only, is rejected, or becomes promotion-eligible. Use it when score and benchmark evidence exist and you need the decision rule, not just the raw metrics.

---

## 1. OVERVIEW

### Purpose

Defines the difference between an interesting candidate, an acceptable candidate, and a promotable candidate.

### When to Use

Use this reference when:
- Reviewing score and benchmark outputs
- Explaining why a candidate tied, lost, or won
- Checking whether promotion prerequisites are actually satisfied

### Core Principle

Promotion stays intentionally narrower than scoring and benchmarking. A candidate can be promising without being safe to promote.

---

## 2. CURRENT PROMOTION POSTURE

All agent targets are evaluated via dynamic mode. Promotion is a per-target decision made under dynamic mode; there are no static, automatically promotion-eligible profiles.

When promotion is enabled, the promotion script enforces the same gates in both callable phases:
- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
- a matching `benchmark-pass` report (when benchmarks are configured for the target)
- a passing repeatability report
- explicit operator approval plus manifest boundary enforcement for the specific target
- a hard repo-managed mirror sync gate when the target is an agent definition under `.opencode/agents/`, `.claude/agents/`, or `.opencode/agents/`

`--phase=accept` verifies those gates and snapshots the canonical preimage plus accepted candidate into the archive without mutating the canonical target. `--phase=ship` loads the accepted-state file, verifies that the canonical target still matches the accepted preimage, and then writes the accepted candidate snapshot. The legacy no-phase command still performs the previous guarded one-step promotion for existing callers.

The default branch preservation policy is `preserve-on-failure`. Under that policy, accept or ship gate failures emit `promotion_blocked_branch_preserved` to the configured event log and leave branch/candidate evidence intact.

---

## 3. KEEP VS REJECT

Keep the baseline when:
- the candidate score is lower
- the candidate violates the manifest
- the candidate only adds noise

Reject the candidate when:
- hard rejection conditions fire
- the run is an infra failure
- the candidate broadens scope

Prefer the candidate only when:
- the candidate score is higher
- no hard rejection condition fired
- the delta is meaningful

---

## 4. TIE-BREAK

When scores tie, prefer the simpler option:
- fewer instructions
- less duplication
- clearer file-reading contract
- narrower scope language

---

## 5. PROMOTION PREREQUISITES

Promotion is allowed only when:
- artifact-level fixtures exist (or are waived for the specific target)
- repeatability is proven for the active benchmark set
- rollback steps are documented
- accept/ship evidence is present when using the two-phase path
- the explicit approval gate is passed
- the target is not classified `fixed` or `forbidden` in the manifest
- agent-definition targets are present and content-aligned across both runtime mirrors (`.opencode/agents/`, `.claude/agents/`)

If mirror verification fails, promotion rejects with a structured `MIRROR_SYNC_GATE_FAILED` error. The optional promotion state file records `mirror_sync_state` as `all_landed`, `partial:<runtime-list>`, or `verification_failed`. Resume behavior defaults to rolling back partial mirror landings before another promotion attempt; operators may instead retry failed mirrors or pause for an explicit decision.

---

## 6. NO-GO CONDITIONS

Safety brakes that force the loop to stop or refuse broader rollout. Do not expand the loop beyond the current boundary when any of these are true:

- the scorer cannot reliably separate a weak candidate from the baseline
- the benchmark runner cannot produce stable scores across repeat runs
- promotion cannot be rolled back quickly
- runtime mirror drift is undocumented
- a second target lacks a deterministic or policy-stable evaluator
- the mutator and scorer boundaries blur
- canonical mutation happens without explicit approval
- ship attempts to write over a canonical target that no longer matches the accepted preimage
- benchmark evidence and mirror-sync evidence are being mixed together
- a profile exceeds the configured infra-failure or weak-benchmark limits
- all 5 evaluation dimensions have plateaued (3+ consecutive identical scores per dimension), indicating the loop has exhausted its current approach - stop and reassess the hypothesis or target

The reducer consumes these configured stop rules and marks the runtime `shouldStop` when the packet crosses them.

---

## 7. RELATED RESOURCES

- `../model_benchmark/evaluator_contract.md`
- `rollback_runbook.md`
- `../../scripts/shared/reduce-state.cjs`
- `../../scripts/shared/promote-candidate.cjs`
- `../../scripts/shared/rollback-candidate.cjs`
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
---
title: Improvement Config Reference
description: Field-level documentation for improvement_config.json runtime configuration.
trigger_phrases:
  - "improvement config reference"
  - "improvement config fields"
  - "dimension weight tuning"
  - "stop rule thresholds"
  - "model-benchmark mode config"
importance_tier: normal
contextType: implementation
version: 1.17.0.13
---

# Improvement Config Reference

Field-level reference for `improvement_config.json`. Use this when modifying runtime configuration for a deep-improvement packet.

---

## 1. OVERVIEW

### Purpose

Documents each field in `improvement_config.json` so operators can tune scoring, benchmarking, stop rules, and file protection without guessing.

### When to Use

Use this reference when:
- Adjusting dimension weights for a specific target
- Changing stop rule thresholds
- Enabling or disabling dynamic profiling
- Understanding what each config section controls

---

## 2. FIELDS

### Top-Level

| Field | Type | Description |
| --- | --- | --- |
| `target` | string | Path to the canonical target agent file |
| `targetProfile` | string | Active profile ID (always `dynamic` in the current release) |
| `targetKind` | string | Classification: `dynamic` (default), `derived`, or `candidate-only` |
| `maxIterations` | number | Maximum loop iterations before forced stop |
| `executionMode` | string | AUTONOMOUS or INTERACTIVE |
| `proposalOnly` | boolean | When true, candidates cannot be promoted |
| `promotionEnabled` | boolean | When true, guarded promotion is available |

### Scoring

| Field | Type | Description |
| --- | --- | --- |
| `thresholdDelta` | number | Minimum score improvement for candidate-better recommendation |
| `hardRejectOnMissingTemplate` | boolean | Reject if required template references are absent |
| `hardRejectOnNestedDelegation` | boolean | Reject if nested delegation is detected |
| `simplicityTieBreak` | boolean | Prefer simpler candidate when scores tie |
| `dynamicProfileEnabled` | boolean | Must remain `true`; dynamic mode is the sole scoring path via generate-profile.cjs |
| `dimensionWeights` | object | Per-dimension weights for 5D scoring (must sum to 1.0) |

### Stop Rules

| Field | Type | Description |
| --- | --- | --- |
| `maxConsecutiveTies` | number | Stop after N consecutive tie scores |
| `maxInfraFailuresPerProfile` | number | Stop after N infrastructure failures |
| `maxWeakBenchmarkRunsPerProfile` | number | Stop after N weak benchmark results |
| `stopOnDriftAmbiguity` | boolean | Stop if mirror drift report is ambiguous |
| `stopOnDimensionPlateau` | boolean | Stop if all 5 dimensions plateau (identical scores over the plateau window) |
| `plateauWindow` | number | Number of trailing scores to compare for plateau detection (default: 3) |

### Dispatch Caps

Cumulative, whole-session cost ceilings by operation type — independent of `maxIterations` and never reset per-iteration. Enforced by `scripts/shared/check-dispatch-cap.cjs`, which the loop YAML runs before every candidate dispatch, score execution, and benchmark run; it counts completed operations from `improvement-journal.jsonl` and halts with a clear error before starting one that would push the cumulative count past its cap. A missing or non-numeric field falls back to the same default shown below, so an out-of-date config still enforces a real ceiling.

| Field | Type | Description |
| --- | --- | --- |
| `maxCandidateDispatches` | number | Cumulative cap on `@deep-improvement` candidate-generation dispatches for the whole session (default: 5, i.e. `maxIterations` at 1 dispatch/iteration) |
| `maxScoreExecutions` | number | Cumulative cap on `score-candidate.cjs` executions for the whole session — counts the primary score plus both uncached stability replays (default: 15, i.e. `maxIterations` x 3 executions/iteration) |
| `maxBenchmarkRuns` | number | Cumulative cap on `run-benchmark.cjs` executions for the whole session (default: 5, i.e. `maxIterations` at 1 run/iteration) |

### Model-Benchmark Mode

The model-benchmark mode (run via `scripts/shared/loop-host.cjs --mode=model-benchmark`) is selected at the command line, not by a config field. Its operator-facing levers:

| Lever | Where | Description |
| --- | --- | --- |
| `--mode` | `loop-host.cjs` | `agent-improvement` (default) or `model-benchmark`. Unknown values warn and fall back to agent-improvement. |
| `--scorer` | `run-benchmark.cjs` | `pattern` (default, byte-identical heading/pattern matcher) or `5dim` (routes outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`). |
| `--grader` | `run-benchmark.cjs` | `noop` (default, deterministic), `mock`, or `llm`. Only consulted under `--scorer 5dim`. |
| `DEEP_AGENT_ALLOW_CRITERIA_EXEC` | env | Set to `0` to refuse criteria-driven shell execution in the 5-dim scorer. Default permissive. |
| `DEEP_AGENT_GRADER_CACHE_RAW` | env | Set to `0` to redact raw grader output from the on-disk cache. Default permissive. |

The default agent-improvement path is unaffected when no mode flag is set. See SKILL.md "Lane B" for the full contract.

---

## 3. RELATED RESOURCES

- `improvement_config.json`: the actual config file
- `../../references/model_benchmark/evaluator_contract.md`: scoring rubric details
- `../../references/shared/promotion_rules.md`: stop condition reference
---
title: Rollback Runbook
description: Rollback and post-promotion verification procedure for bounded deep-improvement promotions.
trigger_phrases:
  - "rollback runbook"
  - "promotion rollback steps"
  - "post-promotion verification"
  - "restore canonical target"
importance_tier: normal
contextType: implementation
version: 1.17.0.11
---

# Rollback Runbook

Operational runbook for the controlled promotion and rollback path. Use it when the evaluator gates have already passed and the next question is how to mutate and restore the canonical target safely.

---

## 1. OVERVIEW

### Purpose

Explains the operator steps for guarded promotion, rollback, and post-rollback verification.

### When to Use

Use this reference when:
- a candidate is promotion-eligible
- you need a safe rollback path before mutating the canonical target
- you need to record post-promotion or post-rollback proof

### Core Principle

Rollback is part of the promotion contract. If a promotion cannot be reversed quickly and proven, it is not safe enough to run.

---

## 2. PROMOTION PRECONDITIONS

- candidate score file exists
- recommendation is `candidate-better`
- delta meets threshold
- operator explicitly approves promotion
- backup path is recorded before mutation

---

## 3. PROMOTION STEPS

1. Archive the current canonical target
2. Copy the accepted candidate into the canonical target
3. Re-run the scorer against the promoted target if needed
4. Run any packet verification tied to the target surface

---

## 4. ROLLBACK STEPS

1. Restore the archived pre-promotion file to the canonical target
2. Verify the target parses cleanly
3. Record the rollback in the packet evidence

---

## 5. POST-PROMOTION VERIFICATION

- `git diff -- <target>` shows only the intended canonical target edits when the worktree is otherwise clean
- packet validation still passes
- derived runtime surfaces are either synchronized or captured in drift-review evidence
- direct comparison to the archived backup proves the rollback restored the pre-promotion file

### Dimensional Score Preservation

After rollback, re-run `score-candidate.cjs --dynamic` against the restored target to confirm dimensional scores return to baseline levels. Record the post-rollback dimensional snapshot in the ledger for audit trail continuity.

---

## 6. RELATED RESOURCES

- `promotion_rules.md`
- `../agent_improvement/mirror_drift_policy.md`
- `../../scripts/shared/promote-candidate.cjs`
- `../../scripts/agent-improvement/rollback-candidate.cjs`

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
title: Runtime Truth Contracts
description: Full audit-journal, stop-reason, gate-bundle, mutation-coverage, and reducer-consumer contracts for deep-improvement sessions.
trigger_phrases:
  - "stop reason taxonomy"
  - "audit journal protocol"
  - "legal-stop gate bundles"
  - "mutation coverage graph"
  - "session outcome enum"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Runtime Truth Contracts

Full detail behind the SKILL.md quick summary of session termination, journal emission, gate bundles, and reducer replay for `deep-improvement`. Use it when wiring or auditing orchestrator-side journal calls, when a session's stop reason or outcome looks wrong, or when the reducer's replay-derived registry fields need explaining.

---

## 1. OVERVIEW

### Purpose

Defines the exact contracts an orchestrator must honor when starting, running, and ending a deep-improvement session: which stop reasons and session outcomes are legal, how the append-only journal is emitted and replayed, which gate bundles must pass before `converged` can be claimed, and how mutation coverage, trajectory, trade-off, and lineage tracking behave.

### When to Use

Use this reference when:
- Wiring `session_start` / `session_end` emission into a new or modified orchestrator
- Debugging why a session's `stopReason` or `sessionOutcome` was rejected
- Explaining what the reducer's `journalSummary`, `candidateLineage`, or `mutationCoverage` registry fields mean
- Deciding whether a candidate mutation is a duplicate of one already tried

### Core Principle

Every session termination must be legible after the fact: why it ended (`stopReason`) and what happened to the candidate (`sessionOutcome`) are separate, both required, and both drawn from a small frozen enum. Journal emission is orchestrator-only — the target agent never writes journal rows.

---

## 2. STOP-REASON TAXONOMY

**stopReason** (WHY the session ended):

| Reason | Trigger Condition |
| --- | --- |
| `converged` | All legal-stop gate bundles pass and dimension trajectory is stable |
| `maxIterationsReached` | Iteration counter equals `maxIterations` config |
| `blockedStop` | One or more legal-stop gate bundles fail when convergence math would otherwise trigger stop |
| `manualStop` | Operator cancels the session |
| `error` | Infra failure, script crash, or unrecoverable condition |
| `stuckRecovery` | Session detected stuck state and exhausted recovery options |

**sessionOutcome** (WHAT happened to the candidate):

| Outcome | When Used |
| --- | --- |
| `keptBaseline` | Baseline was retained because candidate did not improve |
| `promoted` | Candidate was promoted to canonical target |
| `rolledBack` | Promoted candidate was rolled back to prior state |
| `advisoryOnly` | Session completed for assessment only; no mutation attempted |

### Frozen Helper Enums

`scripts/shared/improvement-journal.cjs` exports and validates exactly these two enums — `STOP_REASONS` (the six reasons above) and `SESSION_OUTCOMES` (the four outcomes above). Keep session-end emissions aligned to those helper-owned values until the helper contract itself changes. Labels such as `convergedImprovement`, `plateau`, `benchmarkPlateau`, `rejected`, `deferred`, `blocked`, or `errored` are NOT accepted by the current CLI validator. Plateau detection is a reducer/stop-rule condition; it must reconcile to one of the canonical stop reasons above when emitted as `details.stopReason`.

---

## 3. AUDIT JOURNAL PROTOCOL

All journal emission is orchestrator-only (ADR-001). The journal (`improvement-journal.jsonl`) is an append-only JSONL file capturing lifecycle events, separate from `agent-improvement-state.jsonl` (which tracks proposal/evaluation data).

**Script**: `scripts/shared/improvement-journal.cjs`

Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`

### Journal Wiring Contract

The target agent being evaluated never writes journal rows directly. Only the visible YAML workflow or an operator-side wrapper invokes the helper. The CLI contract is:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs --emit <eventType> --journal <journal_path> --details '<json>'
```

The helper validates event type plus `session_end` or `session_ended` details, and the CLI entrypoint stores boundary context under `details`. Top-level `iteration` and `candidateId` fields are available only through the JS API, not through the CLI wrapper used by the YAML workflows.

### Boundary Points

Journal boundaries are `session_start` after baseline setup, per-iteration candidate/scoring/gate events, and `session_end` after synthesis or terminal stop. Required details include session id, target, iteration/candidate paths, scores, stop reason, session outcome, and total iterations.

### Orchestrator Ownership

- Auto mode emits `session_start` after `step_record_baseline`, then emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop iteration, and finally emits `session_end` after synthesis.
- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.
- Operators invoking the helper manually must use the same boundary order so replay and reducer consumers see a consistent journal shape.

---

## 4. LEGAL-STOP GATE BUNDLES

A session may NOT claim `converged` unless all five gate bundles pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate`. The orchestrator emits `legal_stop_evaluated` with nested `details.gateResults` before any `session_end`. Failures emit `blocked_stop` with `failedGates[]` and `stopReason:"blockedStop"`.

For legal-stop replay, the reducer consumes `details.gateResults` from the latest `legal_stop_evaluated` event and surfaces it as `journalSummary.latestLegalStop.gateResults` in `experiment-registry.json` plus the dashboard's latest legal-stop table.

---

## 5. STATIC BENCHMARK ASSETS

The reusable benchmark contract ships with the skill, not with each spec packet:

- Profile: `assets/model_benchmark/benchmark-profiles/default.json`
- Fixtures: `assets/model_benchmark/benchmark-fixtures/*.json`
- Materializer: `scripts/shared/materialize-benchmark-fixtures.cjs`
- Runner: `scripts/model-benchmark/run-benchmark.cjs`

`materialize-benchmark-fixtures.cjs` and `run-benchmark.cjs` are output-location-agnostic — both take a required `--outputs-dir` and write wherever the caller points them. Two callers use this contract for two distinct purposes with two distinct, fixed output conventions:

- **Lane A (`/deep:agent-improvement`, this session's own runtime):** every iteration's `step_materialize_benchmark-fixtures` + `step_run_benchmark` steps materialize `default.json`'s fixtures and run the benchmark spec-locally, into `{spec_folder}/improvement/benchmark-outputs/`. `benchmark_completed` may be emitted only after `{spec_folder}/improvement/benchmark-outputs/report.json` exists (both `auto` and `confirm` modes verify with `test -f {spec_folder}/improvement/benchmark-outputs/report.json`). The runner also appends a `benchmark_run` row to `{spec_folder}/improvement/agent-improvement-state.jsonl`. There is no sk-prompt/prompt-models hub path in this flow.
- **Lane B (standalone `/deep:model-benchmark` command):** materializes fixtures and runs the benchmark against the sk-prompt/prompt-models hub, keyed by the operator-supplied `run_label` — `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/{fixture.id}.md` for materialized fixtures, then `run-benchmark.cjs --outputs-dir .opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}`, writing `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/report.json` with `status:"benchmark-complete"`. `run_label` is a required identifier that distinguishes benchmark runs in the hub (e.g. `"minimax-tidd-ec"`, `"mimo-costar"`). This flow is not spec-local by design — Lane B compares models/frameworks across sessions, so results are meant to persist centrally rather than live under one packet.

Repeatability output from `benchmark-stability.cjs` is separate evidence and does not by itself prove benchmark completion.

---

## 6. RESUME/CONTINUATION SEMANTICS (current release)

Sessions support a single lineage mode today: `new`. Every invocation of the `/deep:agent-improvement` workflow starts a fresh session with a new session id and generation 1. Multi-generation lineage modes (`resume`, `restart`, `fork`, `completed-continue`) were described in earlier drafts but have no shipped runtime wiring in the deep-improvement workflow, reducer, or journal consumer.

Operators who want to continue evaluating an agent after a prior session SHOULD archive the prior session folder (e.g. move `improve/` to `improve_archive/{timestamp}/`) and re-invoke the command, which starts a new `new`-mode session. The reducer treats each session independently and does not carry ancestry across sessions.

If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `deep_agent-improvement_{auto,confirm}.yaml`, reducer ancestry handling in `deep-improvement/scripts/shared/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.

---

## 7. MUTATION COVERAGE GRAPH

**Script**: `scripts/shared/mutation-coverage.cjs`

Tracks explored dimensions, tried mutation types per dimension, and exhausted mutation sets using `loop_type: "improvement"` namespace isolation (ADR-002). The orchestrator skips mutation types already in the exhausted log.

### Mutation Signature Dedup

Each mutation entry in `mutation-coverage.json` carries a `signature` field computed as:

```text
signature = sha256(dimension + "\u001f" + mutationType + "\u001f" + targetSection + "\u001f" + normalizedBody64)
```

Where `normalizedBody64` = whitespace-collapsed, lowercased, first 64 characters of the mutation body.

**Dedup behavior:**
- Before proposing a new mutation, `isSignatureSeen()` scans existing `mutations[]` and `exhausted[]` arrays
- If the signature matches, the candidate is skipped with `reason: "EXHAUSTED-FROM: iter-NNN"` recorded in `exhausted[]`
- The `EXHAUSTED-FROM` format references the iteration where the original mutation was tried

**Bypass:**
```bash
export DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1  # Force re-evaluation of previously seen signatures
```
When set, `isSignatureSeen()` always returns `{ seen: false }`. Every mutation is considered fresh.

**Backward compatibility:** Legacy `mutation-coverage.json` entries without `signature` field fall back to the existing `dimension::mutationType` dedup in the reducer. No migration required.

**Authoritative storage:** `mutation-coverage.json` `mutations[]` array. `signature` is written by `recordMutation()` and read by `isSignatureSeen()` and `reduce-state.cjs`.

---

## 8. DIMENSION TRAJECTORY

Trajectory data records per-iteration dimension scores. Two distinct convergence signals run side by side and must not be conflated. `mutation-coverage.cjs` `checkConvergenceEligibility()` marks a profile convergence-eligible when it has at least 3 data points and every dimension delta across the last 3 points is within `DEFAULT_STABILITY_DELTA` (+/-2), a tolerance band. Separately, `reduce-state.cjs` `stopOnDimensionPlateau` fires the plateau stop only when a dimension's last 3 scores are identical (exact-repeat). The +/-2 trajectory eligibility and the exact-repeat plateau stop are different checks.

Stop-condition counters (`maxConsecutiveTies`, `maxInfraFailuresPerProfile`, `maxWeakBenchmarkRunsPerProfile`) default to disabled, with no cap, unless the runtime config sets them. Only configured counters can trigger `blockedStop`.

---

## 9. TRADE-OFF DETECTION

**Script**: `scripts/agent-improvement/trade-off-detector.cjs`

Detects Pareto trade-offs: flags when improvement > +3 in one dimension causes regression < -3 in hard dimensions (structural, integration, systemFitness) or < -5 in soft dimensions (ruleCoherence, outputQuality). Blocks promotion for Pareto-dominated candidates.

---

## 10. PARALLEL CANDIDATE WAVES (Optional)

**Script**: `scripts/agent-improvement/candidate-lineage.cjs`

Disabled by default (`parallelWaves.enabled: false` in config, ADR-004). When enabled, spawns 2-3 candidates with different mutation strategies. Activation requires: exploration-breadth score above threshold, 3+ unresolved mutation families, and 2 consecutive tie/plateau iterations.

---

## 11. WEIGHT OPTIMIZER (Advisory Only)

**Script**: `scripts/agent-improvement/benchmark-stability.cjs`

Reads historical session data and emits a weight-recommendation report. Recommendations do NOT auto-apply (ADR-005). Requires minimum session count threshold before producing recommendations.

---

## 12. REDUCER CONSUMER SIDE

The reducer is the consumer for replay artifacts on refresh, rather than a separate orchestrator-only synthesis step. Every `scripts/shared/reduce-state.cjs` pass attempts to read:

- `improvement-journal.jsonl` — to summarize last session boundaries, total replayed events, per-event counts, and terminal `stopReason` / `sessionOutcome`
- `candidate-lineage.json` — to summarize lineage depth, total candidate count, and the latest candidate leaf
- `mutation-coverage.json` — to summarize mutation coverage ratio and uncovered mutations

These inputs remain optional. Missing files do not fail the reducer. The corresponding registry field is set to `null` so dashboard and registry refreshes still complete.

The reducer writes these summaries into new top-level registry fields: `journalSummary`, `candidateLineage`, `mutationCoverage`.

Graceful degradation is required: if any artifact is missing, unreadable, or not yet generated for the current runtime, the reducer preserves the rest of the registry and records `null` for that field instead of throwing.

The dashboard also includes a dedicated **Sample Quality** section. This separates replay/stability sample sufficiency from benchmark failures so operators can tell the difference between a true regression and an iteration that simply lacked enough data for trade-off or replay-stability trust.

---

## 13. RELATED RESOURCES

- `loop_protocol.md`
- `quick_reference.md`
- `../model_benchmark/evaluator_contract.md`
- `../agent_improvement/mirror_drift_policy.md`
- `../../scripts/shared/improvement-journal.cjs`
- `../../scripts/shared/mutation-coverage.cjs`
- `../../scripts/shared/reduce-state.cjs`

exec
/bin/zsh -lc "sed -n '1,400p' references/shared/promotion_gate_contract.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement
 succeeded in 0ms:
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

codex
The shipped contract already has visible/held-out/gold tiers, but three gaps are concrete: repeatability is described as mandatory while implementation remains advisory; target-specific benchmarks can be absent; and a fixed ≥70/≥85 gate can be optimized without testing whether failures are correlated or newly concentrated. I’m looking for mechanisms that close those exact holes: tamper-evident evaluator isolation, leakage tests, and drift-aware vetoes.
web search: 
web search: site:github.com/anthropics sycophancy subterfuge reward tampering repository ...
web search: 
web search: https://github.com/anthropics/sycophancy-to-subterfuge-paper
web search: 
web search: 
web search: 
web search: 'Releases'
web search: 
web search: Manheim Garrabrant Categorizing Variants of Goodhart's Law arXiv regressional extremal causal adversarial ...
codex
The external evidence sharpens the failure model into four cases: noisy-selection wins, out-of-distribution wins, proxy-only wins, and evaluator-manipulation wins. Deep-improvement currently treats all four mainly as “score/benchmark instability”; the safer design needs a distinct veto and receipt for each class. I’m checking where the present promotion code can enforce those vetoes without pushing logic into the shared runtime.
exec
/bin/zsh -lc 'rg -n "held.?out|gold|repeatab|variance|promotionGates|benchmark_gate|allow-same-family|grader|approval|acceptance|minimumAggregate|thresholdDelta|phantom" scripts references assets | head -n 260' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement
 succeeded in 0ms:
assets/agent_improvement/improvement_config.json:43:    "thresholdDelta": 2,
assets/agent_improvement/improvement_config.json:58:    "minimumAggregateScore": 85,
assets/agent_improvement/improvement_config.json:60:    "repeatabilityTolerance": 0
references/agent_improvement/target_onboarding.md:35:Target growth should be explicit, repeatable, and evaluator-backed. If the target cannot be classified or benchmarked cleanly, it is not ready.
references/agent_improvement/target_onboarding.md:78:- promotion remains a per-target decision requiring explicit operator approval, repeatability evidence, and manifest boundary compliance
assets/agent_improvement/improvement_charter.md:55:- human approval is required before any canonical promotion
assets/agent_improvement/improvement_charter.md:99:- **evidenceGate**: benchmark pass AND repeatability pass
assets/agent_improvement/improvement_config_reference.md:55:| `thresholdDelta` | number | Minimum score improvement for candidate-better recommendation |
assets/agent_improvement/improvement_config_reference.md:91:| `--grader` | `run-benchmark.cjs` | `noop` (default, deterministic), `mock`, or `llm`. Only consulted under `--scorer 5dim`. |
assets/agent_improvement/improvement_config_reference.md:93:| `DEEP_AGENT_GRADER_CACHE_RAW` | env | Set to `0` to redact raw grader output from the on-disk cache. Default permissive. |
scripts/README.md:70:|   +-- benchmark-stability.cjs            # Score variance and weight advisory
scripts/README.md:102:| `model-benchmark/scorer/` | Five-dimension scorer with `score-model-variant.cjs`, `deterministic/`, `grader/`, and `lib/cache.cjs`. The runtime `cache/` is git-ignored. |
assets/agent_improvement/README.md:36:| `improvement_config_reference.md` | Field-level reference for `improvement_config.json`: documents top-level, scoring, and stop-rule fields, plus the command-line model-benchmark levers (`--mode`, `--scorer`, `--grader`) and their env switches. |
assets/agent_improvement/improvement_strategy.md:48:- promotion allowed only with explicit per-target approval under dynamic mode
assets/agent_improvement/improvement_strategy.md:52:- stop when no-go or repeatability rules fail
assets/agent_improvement/improvement_strategy.md:138:- If soft dimension regresses (ruleCoherence, outputQuality): WARN operator, allow with explicit approval
assets/agent_improvement/target_manifest.jsonc:6:  // requires explicit per-target approval under dynamic mode.
scripts/shared/reduce-state.cjs:1353:- All targets evaluated via dynamic mode; promotion requires explicit per-target approval
scripts/shared/promote-candidate.cjs:149:    acceptanceFile: blockedContext.acceptanceFile || null,
scripts/shared/promote-candidate.cjs:165:  if (args['acceptance-file'] && args['acceptance-file'] !== true) {
scripts/shared/promote-candidate.cjs:166:    return args['acceptance-file'];
scripts/shared/promote-candidate.cjs:177:  const acceptanceFile = resolveAcceptanceFilePath(context.args, context.archiveDir, context.target, timestamp);
scripts/shared/promote-candidate.cjs:196:    repeatabilityReportPath: context.resolvedRepeatabilityReportPath,
scripts/shared/promote-candidate.cjs:201:  writeJson(acceptanceFile, acceptedState);
scripts/shared/promote-candidate.cjs:202:  return { acceptanceFile, acceptedState };
scripts/shared/promote-candidate.cjs:207:    failGate('Cannot ship: acceptance file is not in accepted state', {
scripts/shared/promote-candidate.cjs:208:      errorType: 'acceptance_state_invalid',
scripts/shared/promote-candidate.cjs:217:    failGate('Cannot ship: canonical target missing after acceptance; restored pre-acceptance target', {
scripts/shared/promote-candidate.cjs:228:    failGate('Cannot ship: canonical target changed after acceptance; restored pre-acceptance target', {
scripts/shared/promote-candidate.cjs:243:    failGate('Cannot ship: accepted candidate snapshot hash changed after acceptance', {
scripts/shared/promote-candidate.cjs:423:    ? readAcceptanceState(args['acceptance-file'])
scripts/shared/promote-candidate.cjs:429:  const repeatabilityReportPath = args['repeatability-report'] || acceptedState?.repeatabilityReportPath;
scripts/shared/promote-candidate.cjs:445:  // flags, benchmark/repeatability gates, single canonical target, and agent-
scripts/shared/promote-candidate.cjs:450:    process.stderr.write('Usage (Lane A / agent): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
scripts/shared/promote-candidate.cjs:451:    process.stderr.write('Usage (Lane B / benchmark): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
scripts/shared/promote-candidate.cjs:457:  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
scripts/shared/promote-candidate.cjs:458:  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
scripts/shared/promote-candidate.cjs:468:    acceptanceFile: args['acceptance-file'] || null,
scripts/shared/promote-candidate.cjs:483:  const threshold = Number(config?.scoring?.thresholdDelta ?? 1);
scripts/shared/promote-candidate.cjs:503:    failGate(`Cannot promote: benchmark profile ${benchmarkReport.profileId} does not match runtime config target profile ${config.targetProfile}`, { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:507:    failGate('Cannot promote: benchmark report is not in benchmark-complete state', { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:511:    failGate(`Cannot promote: benchmark report target ${benchmarkReport.target} does not match requested target ${target}`, { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:515:    failGate(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}`, { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:519:    failGate(`Cannot promote: benchmark aggregate ${benchmarkReport.aggregateScore} below gate ${BENCHMARK_AGGREGATE_GATE}`, { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:525:    failGate('Cannot promote: outcomeScoreDelta is undefined because a baseline score is missing; pass --no-baseline-ok only when this is explicitly reviewed', { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:529:    failGate(`Cannot promote: regression: outcomeScoreDelta < 0 (${outcomeScoreDelta})`, { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:535:    failGate(`Cannot promote: hurt fixtures detected (${fixtureIds}); pass --allow-hurt-fixtures only when this trade-off is explicitly reviewed`, { errorType: 'benchmark_gate_failed' });
scripts/shared/promote-candidate.cjs:538:  if (!repeatabilityReport) {
scripts/shared/promote-candidate.cjs:539:    failGate(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}`, { errorType: 'repeatability_gate_failed' });
scripts/shared/promote-candidate.cjs:542:  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
scripts/shared/promote-candidate.cjs:543:    failGate(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}`, { errorType: 'repeatability_gate_failed' });
scripts/shared/promote-candidate.cjs:546:  if (repeatabilityReport.passed !== true) {
scripts/shared/promote-candidate.cjs:547:    failGate('Cannot promote: repeatability check did not pass', { errorType: 'repeatability_gate_failed' });
scripts/shared/promote-candidate.cjs:586:  // aggregate gate + repeatability) and skips these agent-only checks.
scripts/shared/promote-candidate.cjs:660:    const acceptance = createAcceptanceState({
scripts/shared/promote-candidate.cjs:679:      acceptanceFile: acceptance.acceptanceFile,
scripts/shared/promote-candidate.cjs:680:      candidateSnapshotPath: acceptance.acceptedState.candidateSnapshotPath,
scripts/shared/promote-candidate.cjs:681:      preAcceptBackupPath: acceptance.acceptedState.preAcceptBackupPath,
scripts/shared/promote-candidate.cjs:685:      repeatabilityReport: resolvedRepeatabilityReportPath,
scripts/shared/promote-candidate.cjs:688:      timestamp: acceptance.acceptedState.acceptedAt,
scripts/shared/promote-candidate.cjs:731:        acceptanceFile: args['acceptance-file'],
scripts/shared/promote-candidate.cjs:736:        repeatabilityReport: resolvedRepeatabilityReportPath,
scripts/shared/promote-candidate.cjs:749:        repeatabilityReport: resolvedRepeatabilityReportPath,
scripts/shared/promote-candidate.cjs:765:        repeatabilityReport: resolvedRepeatabilityReportPath,
scripts/shared/fixture-lint.cjs:8: * Pilot teaching T6 (spec 143): a held-out fixture that answers with a
scripts/shared/fixture-lint.cjs:13: * from held-out sets BEFORE any paid dispatch.
scripts/shared/fixture-lint.cjs:26: * lint can gate held-out lists in CI and loop pre-flights).
scripts/shared/fixture-lint.cjs:64:    process.stderr.write(`fixture-lint: ${bad.length} fixture(s) not gradeable (${bad.map((b) => `${b.id}:${b.classification}`).join(', ')}) — interactive or uncontracted fixtures must not be used as held-out gates (spec 143 T6)\n`);
scripts/shared/extract-deliverable.cjs:8: * Pilot teaching T5 (spec 143): graders and linters that read a model's whole
scripts/shared/extract-deliverable.cjs:15: * Mirrors the python extraction in the pilot's benchmark/grader/deterministic_lint.py.
scripts/shared/loop-host.cjs:23: *        [--scorer=<pattern|5dim>] [--grader=<noop|mock|llm>]
scripts/shared/loop-host.cjs:27: *        [--held-out=<a,b>] [--samples=<n>] [--proposer-model=<id>] [--grader-model=<id>]
scripts/shared/loop-host.cjs:90:  'held-out',
scripts/shared/loop-host.cjs:93:  'grader-model',
scripts/shared/loop-host.cjs:122:  'grader',
scripts/shared/loop-host.cjs:124:  'allow-same-family',
scripts/shared/loop-host.cjs:202:    // run-benchmark.cjs forwards scorer/grader/integration-report so the journal
references/shared/loop_protocol.md:16:End-to-end operator view of how the deep-improvement command, mutator, scorer, benchmark runner, reducer, and approval gates fit together. Use it when you need the full lifecycle, not just a quick command reminder.
references/shared/loop_protocol.md:79:- Stop when repeatability, weak-benchmark, or infra-failure no-go rules trigger
references/shared/loop_protocol.md:86:- explicit operator approval
references/shared/quick_reference.md:66:# Opt-in 5-dimension scorer (default is --scorer pattern); grader noop|mock|llm
references/shared/quick_reference.md:67:node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs --scorer 5dim --grader noop
references/shared/heldout_and_gold_sets.md:3:description: Shared evaluation convention for visible, held-out, and gold fixture tiers that keeps deep-improvement promotion evidence honest across lanes.
references/shared/heldout_and_gold_sets.md:5:  - "held-out and gold sets"
references/shared/heldout_and_gold_sets.md:7:  - "gold set calibration"
references/shared/heldout_and_gold_sets.md:8:  - "held-out non-regression"
references/shared/heldout_and_gold_sets.md:9:  - "phantom gap convention"
references/shared/heldout_and_gold_sets.md:17:The pilot behind spec 143 proved two things about benchmark-driven improvement: self-reported scores inflate (~+6/25 measured against independent graders) and proposers overfit any fixture they can read (the pilot's adversarial fixture published its own seeds in-repo). This convention is how every deep-improvement lane keeps its evidence honest. It applies to Lane B profiles and any future loop that promotes on benchmark evidence.
references/shared/heldout_and_gold_sets.md:23:| **Visible** | proposer + grader | gap analysis, iteration targeting | may be discussed in prompts and journals |
references/shared/heldout_and_gold_sets.md:24:| **Held-out** | grader only | promotion gates | the proposer NEVER sees ids, prompts or seeds; promotion requires non-regression here, not on visible fixtures |
references/shared/heldout_and_gold_sets.md:25:| **Gold** (optional) | humans + grader | grader calibration | human-anchored target scores, version-locked; never optimized against |
references/shared/heldout_and_gold_sets.md:29:1. **Gradeable, always.** Every held-out fixture must produce a delimited deliverable (`<DELIVERABLE>` contract). Interactive fixtures that answer with a clarifying question are ungradeable and turn into false gate failures (teaching T6). Gate lists with `scripts/shared/fixture-lint.cjs` before any paid dispatch.
references/shared/heldout_and_gold_sets.md:30:2. **Dimension-sensitive.** Prefer held-out fixtures that are maximally sensitive to the dimensions being optimized (the pilot's stat-centric fixture collapsed under a no-stats deficit, which is exactly what made its signal decisive).
references/shared/heldout_and_gold_sets.md:36:A gold set anchors the GRADER, not the proposer: a small output set with human-agreed target scores, re-scored whenever the grader model changes. Disagreement beyond ~2 of 25 (or 8 of 100) means recalibrate before trusting new grades. Keep gold outputs and target scores version-locked outside any tree a loop can write.
references/shared/heldout_and_gold_sets.md:40:- The grader must be a **different model family** from whatever produced the outputs (`scripts/shared/model-family.cjs`; Lane B refuses same-family LLM grading without `--allow-same-family`; the same kill-switch guard).
references/shared/heldout_and_gold_sets.md:42:- Grader replies follow a strict-JSON contract (single-line JSON, no fences); parsers stay tolerant and record explicit `grader_error` values — an auth failure must be diagnosable from the record, not parsed as a zero score (teaching T11).
references/shared/heldout_and_gold_sets.md:47:Wherever the system under test self-reports a score, record `self_score` vs the independent score and their gap per fixture (Lane B: `self_score_pattern` + `phantomGap` in the report; A widening gap is a reward-hacking signal and must surface as a warning, never be averaged away.
references/shared/promotion_gate_contract.md:27:The promotion gate contract defines the five required gates that must pass before either phase can proceed: prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval.
references/shared/promotion_gate_contract.md:58:- Verify `promotionGates.passed === true` or recompute the same map from score output
references/shared/promotion_gate_contract.md:66:**Requirement:** Benchmark pass with `minimumAggregateScore >= 85`.
references/shared/promotion_gate_contract.md:75:**Failure mode:** `benchmark_gate_failed` - candidate fails output-based validation.
references/shared/promotion_gate_contract.md:83:**Requirement:** Minimum 3 benchmark runs with score variance <= 5.
references/shared/promotion_gate_contract.md:91:**Failure mode:** `repeatability_gate_failed` - benchmark results are not stable.
references/shared/promotion_gate_contract.md:117:- Verify approval is for the specific candidate being promoted
references/shared/promotion_gate_contract.md:118:- Log approval in `improvement-journal.jsonl` as `promotion_attempt` event
references/shared/promotion_gate_contract.md:120:**Failure mode:** `approval_gate_failed` - missing explicit operator consent.
references/shared/promotion_gate_contract.md:135:  --repeatability-report={repeatability_report_path} \
references/shared/promotion_gate_contract.md:150:8. Write an accepted-state file and return its `acceptanceFile` path
references/shared/promotion_gate_contract.md:159:  --acceptance-file={spec_folder}/improvement/archive/{target_name}.{timestamp}.accepted.json \
references/shared/promotion_gate_contract.md:165:2. Verify the canonical target still hashes to the pre-acceptance snapshot
references/shared/promotion_gate_contract.md:166:3. Restore the pre-acceptance snapshot and emit `promotion_blocked_branch_preserved` if the clean-tree check fails
references/shared/promotion_gate_contract.md:180:- Compare post-ship score to pre-acceptance baseline
references/shared/promotion_gate_contract.md:208:  --acceptance-file={acceptance_file_path}
references/shared/promotion_gate_contract.md:251:    "repeatability": { "passed": true, "variance": 2.3 },
references/shared/promotion_gate_contract.md:253:    "approval": { "passed": true, "approvedBy": "operator" }
references/shared/promotion_gate_contract.md:298:| `benchmark_gate_failed` | Benchmark aggregate score < 85 or benchmark incomplete | Fix output contract, improve fixtures |
references/shared/promotion_gate_contract.md:299:| `repeatability_gate_failed` | Benchmark score variance > 5 or run count < 3 | Stabilize fixtures, investigate non-determinism |
references/shared/promotion_gate_contract.md:301:| `approval_gate_failed` | `--approve` flag missing | Re-run with explicit approval |
references/shared/promotion_gate_contract.md:306:| `promotion_blocked_branch_preserved` | Accept or ship gate failed under branch-preservation policy | Inspect the preserved branch and acceptance evidence before retry |
scripts/shared/tests/loop-host.vitest.ts:52:      const args = loopHost.parseArgs(['--profile', 'p.json', '--scorer', '5dim', '--grader', 'noop']);
scripts/shared/tests/loop-host.vitest.ts:53:      expect(args).toEqual({ profile: 'p.json', scorer: '5dim', grader: 'noop' });
scripts/shared/tests/loop-host.vitest.ts:132:    it('forwards --scorer and --grader to run-benchmark (5dim + mock/llm reachable via loop-host)', () => {
scripts/shared/tests/loop-host.vitest.ts:135:        loopHost.parseArgs(['--profile=p.json', '--outputs-dir=/tmp/o', '--scorer=5dim', '--grader=mock']),
scripts/shared/tests/loop-host.vitest.ts:141:          expect.arrayContaining(['--scorer', '5dim', '--grader', 'mock']),
scripts/shared/tests/loop-host.vitest.ts:143:        // materialize never carries scorer/grader
scripts/shared/tests/loop-host.vitest.ts:148:    it('forwards space-form scorer/grader from parseArgs through to run-benchmark (F-P0-1 end to end)', () => {
scripts/shared/tests/loop-host.vitest.ts:155:        '--grader', 'noop',
scripts/shared/tests/loop-host.vitest.ts:162:          expect.arrayContaining(['--scorer', '5dim', '--grader', 'noop']),
scripts/shared/tests/loop-host.vitest.ts:264:        'held-out': 'LOOP_HELD_OUT',
scripts/shared/tests/loop-host.vitest.ts:267:        'grader-model': 'GRADER_MODEL',
references/shared/promotion_rules.md:44:- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
references/shared/promotion_rules.md:46:- a passing repeatability report
references/shared/promotion_rules.md:47:- explicit operator approval plus manifest boundary enforcement for the specific target
references/shared/promotion_rules.md:89:- repeatability is proven for the active benchmark set
references/shared/promotion_rules.md:92:- the explicit approval gate is passed
references/shared/promotion_rules.md:110:- canonical mutation happens without explicit approval
scripts/shared/model-family.cjs:3:// ║ model-family — different-family grader enforcement (anti-Goodhart T1/T3) ║
scripts/shared/model-family.cjs:9: * score-inflation mechanism (~+6/25 measured). A grader that shares a model
scripts/shared/model-family.cjs:11: * an LLM grader must refuse the combination unless explicitly overridden.
scripts/shared/model-family.cjs:65: * Gate: the grader must not share a family with ANY generator model.
scripts/shared/model-family.cjs:68: * @param {string} graderModel
scripts/shared/model-family.cjs:72:function assertGraderIndependence(generatorModels, graderModel, allowSameFamily) {
scripts/shared/model-family.cjs:76:  const collisions = ids.filter((id) => familiesCollide(id, graderModel));
scripts/model-benchmark/MODES.md:192:> The fixtures above span tiers on purpose: `t1-echo` (T1 smoke / demote-class) confirms the harness end-to-end and is expected to saturate; the two T3 fixtures separate on real algorithmic correctness; `t4-tokenize-expr` (T4 adversarial, strict-acceptance with a malformed-input sentinel branch) is the one frontier models genuinely vary on. Reading the per-fixture verdict together is the capability radar.
references/shared/runtime_truth_contracts.md:94:- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.

exec
/bin/zsh -lc "sed -n '430,610p' scripts/shared/promote-candidate.cjs && sed -n '1,280p' scripts/agent-improvement/benchmark-stability.cjs && sed -n '1,120p' scripts/lib/promotion-gates.cjs && sed -n '1,130p' assets/agent_improvement/improvement_config.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement
 succeeded in 0ms:
  const configPath = args.config || acceptedState?.configPath;
  const manifestPath = args.manifest || acceptedState?.manifestPath;
  const archiveDir = args['archive-dir'] || acceptedState?.archiveDir;
  const approve = args.approve === true || args.approve === 'true';
  const allowHurtFixtures = args['allow-hurt-fixtures'] === true || args['allow-hurt-fixtures'] === 'true';
  const noBaselineOk = args['no-baseline-ok'] === true || args['no-baseline-ok'] === 'true';

  // Lane B (model-benchmark) produces report.json with
  // status=benchmark-complete and never a scored agent file. Promotion mode is
  // therefore selected by the presence of --score: when --score is supplied this
  // is the Lane A agent path (scored candidate + agent dimension gates, byte-
  // behavior unchanged); when --score is omitted and --benchmark-report points at
  // a benchmark-complete + benchmark-pass report this is the Lane B benchmark path,
  // which promotes on benchmark evidence alone and bypasses the agent scored-file
  // requirement and agent dimension gates. The shared guards (config promotion
  // flags, benchmark/repeatability gates, single canonical target, and agent-
  // definition mirror sync) apply to both modes.
  const benchmarkMode = !scorePath;

  if (!candidate || !target || !benchmarkReportPath || !configPath || !manifestPath || !archiveDir || !approve) {
    process.stderr.write('Usage (Lane A / agent): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
    process.stderr.write('Usage (Lane B / benchmark): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
    process.exit(2);
  }

  const score = benchmarkMode ? null : readJson(scorePath);
  const benchmarkReport = readJson(benchmarkReportPath);
  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
  const config = readJson(configPath);
  const branchPreservationPolicy = resolveBranchPreservationPolicy(config);
  const preservedBranch = resolvePreservedBranch(args, config, acceptedState);
  const eventLogPath = resolveEventLogPath(args, config);
  const mirrorStateFilePath = args['state-file'] || config?.promotion?.mirrorSyncStateFile || null;
  const blockedContext = {
    phase,
    target,
    candidate,
    acceptanceFile: args['acceptance-file'] || null,
    preservedBranch,
    branchPreservationPolicy,
  };
  const failGate = (message, details = {}) => {
    emitBlockedBranchPreserved(eventLogPath, blockedContext, message, details);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  };
  let allowedCanonicalTarget;
  try {
    allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);
  } catch (error) {
    failGate(error.message, { errorType: 'boundary_gate_failed' });
  }
  const threshold = Number(config?.scoring?.thresholdDelta ?? 1);
  const proposalOnly = config?.proposalOnly;
  const promotionEnabled = config?.promotionEnabled;
  if (!benchmarkMode && score.status !== 'scored') {
    failGate('Cannot promote: score file is not in scored state', { errorType: 'score_gate_failed' });
  }

  if (proposalOnly !== false) {
    failGate('Cannot promote: runtime config is still in proposal-only mode', { errorType: 'config_gate_failed' });
  }

  if (promotionEnabled !== true) {
    failGate('Cannot promote: promotionEnabled is not true in runtime config', { errorType: 'config_gate_failed' });
  }

  if (config?.target && target !== config.target) {
    failGate(`Cannot promote: target ${target} does not match runtime config target ${config.target}`, { errorType: 'config_gate_failed' });
  }

  if (config?.targetProfile && benchmarkReport.profileId !== config.targetProfile) {
    failGate(`Cannot promote: benchmark profile ${benchmarkReport.profileId} does not match runtime config target profile ${config.targetProfile}`, { errorType: 'benchmark_gate_failed' });
  }

  if (benchmarkReport.status !== 'benchmark-complete') {
    failGate('Cannot promote: benchmark report is not in benchmark-complete state', { errorType: 'benchmark_gate_failed' });
  }

  if (benchmarkReport.target !== target) {
    failGate(`Cannot promote: benchmark report target ${benchmarkReport.target} does not match requested target ${target}`, { errorType: 'benchmark_gate_failed' });
  }

  if (benchmarkReport.recommendation !== 'benchmark-pass') {
    failGate(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}`, { errorType: 'benchmark_gate_failed' });
  }

  if (Number(benchmarkReport.aggregateScore || 0) < BENCHMARK_AGGREGATE_GATE) {
    failGate(`Cannot promote: benchmark aggregate ${benchmarkReport.aggregateScore} below gate ${BENCHMARK_AGGREGATE_GATE}`, { errorType: 'benchmark_gate_failed' });
  }

  const benchmarkHasDeltaContract = hasBenchmarkDeltaContract(benchmarkReport);
  const outcomeScoreDelta = readOutcomeScoreDelta(benchmarkReport);
  if (benchmarkHasDeltaContract && outcomeScoreDelta === null && !noBaselineOk) {
    failGate('Cannot promote: outcomeScoreDelta is undefined because a baseline score is missing; pass --no-baseline-ok only when this is explicitly reviewed', { errorType: 'benchmark_gate_failed' });
  }

  if (outcomeScoreDelta !== null && outcomeScoreDelta < 0) {
    failGate(`Cannot promote: regression: outcomeScoreDelta < 0 (${outcomeScoreDelta})`, { errorType: 'benchmark_gate_failed' });
  }

  const hurtFixtures = hurtFixtureDeltas(benchmarkReport);
  if (hurtFixtures.length > 0 && !allowHurtFixtures) {
    const fixtureIds = hurtFixtures.map((entry) => entry.id || 'unknown').join(', ');
    failGate(`Cannot promote: hurt fixtures detected (${fixtureIds}); pass --allow-hurt-fixtures only when this trade-off is explicitly reviewed`, { errorType: 'benchmark_gate_failed' });
  }

  if (!repeatabilityReport) {
    failGate(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}`, { errorType: 'repeatability_gate_failed' });
  }

  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
    failGate(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}`, { errorType: 'repeatability_gate_failed' });
  }

  if (repeatabilityReport.passed !== true) {
    failGate('Cannot promote: repeatability check did not pass', { errorType: 'repeatability_gate_failed' });
  }

  if (!fs.existsSync(candidate)) {
    rejectWithStructuredError('missing-candidate', `Cannot promote: candidate file not found: ${candidate}`, {}, mirrorStateFilePath, blockedContext, eventLogPath);
  }

  // The optimizer must never alter the scoring surface it is being measured by.
  const allowRubricEdit = args['allow-rubric-edit'] === true || args['allow-rubric-edit'] === 'true';
  if (fs.existsSync(target) && fs.existsSync(candidate)) {
    const { rubricMutated } = require('./rubric-guard.cjs');
    const verdict = rubricMutated(fs.readFileSync(target, 'utf8'), fs.readFileSync(candidate, 'utf8'));
    if (verdict.mutated && !allowRubricEdit) {
      rejectWithStructuredError(
        'rubric-mutation',
        'Cannot promote: candidate mutates the target\'s own scoring-relevant regions (rubric/floors/gates). '
        + 'Re-run with --allow-rubric-edit only if a rubric change is the explicit, reviewed intent.',
        { baselineRegions: verdict.baselineRegions, candidateRegions: verdict.candidateRegions },
        mirrorStateFilePath,
        blockedContext,
        eventLogPath,
      );
    }
  }

  if (target !== allowedCanonicalTarget) {
    failGate(`Cannot promote: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}`, { errorType: 'boundary_gate_failed' });
  }

  try {
    assertWithinAllowedRoots(target, config);
  } catch (error) {
    failGate(error.message, { errorType: 'boundary_gate_failed' });
  }

  // The agent scored-file gates (candidate-better
  // recommendation, weighted score gate, 5-dimension gates, score delta) only
  // apply to Lane A. Lane B has no scored agent file, so it promotes on the
  // benchmark report gates verified above (benchmark-complete + benchmark-pass +
  // aggregate gate + repeatability) and skips these agent-only checks.
  let scoreDelta = null;
  if (!benchmarkMode) {
    if (score.recommendation !== 'candidate-better') {
      failGate(`Cannot promote: recommendation is ${score.recommendation}`, { errorType: 'score_gate_failed' });
    }

    if (Number(score.score || 0) < WEIGHTED_SCORE_GATE) {
      failGate(`Cannot promote: score ${score.score} below weighted gate ${WEIGHTED_SCORE_GATE}`, { errorType: 'score_gate_failed' });
    }

    const dimensionGate = evaluatePromotionGates(score.dimensions);
    if (!dimensionGate.passed) {
      failGate(`Cannot promote: dimension gates failed ${dimensionGate.failed.concat(dimensionGate.unscored).join(', ')}; thresholds ${JSON.stringify(PROMOTION_GATES)}`, { errorType: 'dimension_gate_failed' });
    }

    scoreDelta = readScoreDelta(score);
    if (Number(scoreDelta || 0) < threshold) {
      failGate(`Cannot promote: delta ${scoreDelta} below threshold ${threshold}`, { errorType: 'score_gate_failed' });
    }
  }

  let runtimeMirrorSync = null;
  if (isAgentDefinitionTarget(target)) {
    const agentName = inferAgentNameFromPath(target);
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ benchmark-stability — score variance & weight optimization advisory      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default number of replay runs for stability measurement.
 * @type {number}
 */
const MIN_REPLAY_COUNT_DEFAULT = 3;
const DEFAULT_REPLAY_COUNT = MIN_REPLAY_COUNT_DEFAULT;

/**
 * Default stability warning threshold. Below this coefficient, a warning is emitted.
 * Coefficient = 1 - (stddev / mean). Perfect stability = 1.0.
 * @type {number}
 */
const DEFAULT_WARNING_THRESHOLD = 0.95;

/**
 * Default minimum session count before weight optimizer produces recommendations.
 * Research finding (P2): refuse auto-apply until sufficient run history.
 * @type {number}
 */
const DEFAULT_SESSION_COUNT_THRESHOLD = 5;

/**
 * The 5 scoring dimensions.
 * @type {Readonly<string[]>}
 */
const DIMENSIONS = Object.freeze([
  'structural',
  'ruleCoherence',
  'integration',
  'outputQuality',
  'systemFitness',
]);

function resolveMinReplayCount(config) {
  if (Number.isInteger(config?.minReplayCount) && config.minReplayCount > 0) {
    return config.minReplayCount;
  }

  const envValue = Number.parseInt(
    process.env.SK_IMPROVE_AGENT_BENCHMARK_MIN_REPLAY_COUNT || '',
    10
  );
  if (Number.isInteger(envValue) && envValue > 0) {
    return envValue;
  }

  return MIN_REPLAY_COUNT_DEFAULT;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. STABILITY MEASUREMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Compute standard deviation of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function stddev(values) {
  if (values.length <= 1) {
    return 0;
  }
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Compute stability coefficient: 1 - (stddev / mean).
 * Perfect stability = 1.0, high variance = low coefficient.
 *
 * @param {number[]} values - Array of score values from replays
 * @returns {number} Stability coefficient (0.0 to 1.0, or 1.0 if mean is 0)
 */
function stabilityCoefficient(values) {
  const m = mean(values);
  if (m === 0) {
    return 1.0;
  }
  const sd = stddev(values);
  return Math.max(0, 1 - sd / Math.abs(m));
}

/**
 * Run stability measurement on benchmark results (REQ-AI-013).
 * Accepts an array of result sets from identical replays and computes
 * per-dimension stability coefficients.
 *
 * @param {object[]} results - Array of benchmark result objects, each with { dimensions: [{ name, score }] } or { scores: { dim: number } }
 * @param {object} [config] - { warningThreshold?, minReplayCount? }
 * @returns {{ dimensions: object, stable: boolean, warnings: string[] }|{state: string, replayCount: number, minRequired: number, reason: string}}
 */
function measureStability(results, config) {
  const replayCount = Array.isArray(results) ? results.length : 0;
  const opts = {
    warningThreshold: DEFAULT_WARNING_THRESHOLD,
    minReplayCount: resolveMinReplayCount(config),
    ...config,
  };

  if (replayCount < opts.minReplayCount) {
    return {
      state: 'insufficientSample',
      replayCount,
      minRequired: opts.minReplayCount,
      reason: `Benchmark stability requires at least ${opts.minReplayCount} replays before verdict`,
    };
  }

  const dimensionScores = {};
  for (const dim of DIMENSIONS) {
    dimensionScores[dim] = [];
  }

  // Extract scores from results
  for (const result of results) {
    if (result.dimensions && Array.isArray(result.dimensions)) {
      for (const dim of result.dimensions) {
        if (dimensionScores[dim.name] !== undefined) {
          dimensionScores[dim.name].push(dim.score);
        }
      }
    } else if (result.scores) {
      for (const dim of DIMENSIONS) {
        if (typeof result.scores[dim] === 'number') {
          dimensionScores[dim].push(result.scores[dim]);
        }
      }
    }
  }

  const dimensionResults = {};
  const warnings = [];
  let allStable = true;

  for (const dim of DIMENSIONS) {
    const scores = dimensionScores[dim];
    if (scores.length === 0) {
      dimensionResults[dim] = { coefficient: 1.0, mean: 0, stddev: 0, samples: 0 };
      continue;
    }

    const coeff = stabilityCoefficient(scores);
    const m = mean(scores);
    const sd = stddev(scores);

    dimensionResults[dim] = {
      coefficient: Math.round(coeff * 10000) / 10000,
      mean: Math.round(m * 100) / 100,
      stddev: Math.round(sd * 100) / 100,
      samples: scores.length,
    };

    if (coeff < opts.warningThreshold) {
      allStable = false;
      warnings.push(`stabilityWarning: ${dim} coefficient ${coeff.toFixed(4)} < threshold ${opts.warningThreshold}`);
    }
  }

  return {
    dimensions: dimensionResults,
    stable: allStable,
    warnings,
  };
}

/**
 * Check if stability results are acceptable.
 *
 * @param {object} stabilityResult - Result from measureStability
 * @param {number} [maxVariance] - Maximum acceptable variance (1 - coefficient). Default: 0.05.
 * @returns {boolean} True if all dimensions have acceptable variance
 */
function isStable(stabilityResult, maxVariance) {
  if (stabilityResult?.state === 'insufficientSample') {
    return false;
  }

  const threshold = typeof maxVariance === 'number' ? maxVariance : 0.05;

  for (const dim of DIMENSIONS) {
    const dimResult = stabilityResult.dimensions[dim];
    if (dimResult && (1 - dimResult.coefficient) > threshold) {
      return false;
    }
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WEIGHT OPTIMIZER (Advisory Only — REQ-AI-012)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate weight optimization recommendations based on historical session data.
 * Research finding (P2): advisory-only, never auto-apply.
 *
 * @param {object[]} sessionHistory - Array of session summary objects with { dimensions: [{ name, score }], outcome? }
 * @param {object} currentWeights - Current dimension weights: { structural, ruleCoherence, integration, outputQuality, systemFitness }
 * @param {object} [config] - { sessionCountThreshold? }
 * @returns {{ recommendations: object, sufficient: boolean, report: string }}
 */
function generateWeightRecommendations(sessionHistory, currentWeights, config) {
  const opts = {
    sessionCountThreshold: DEFAULT_SESSION_COUNT_THRESHOLD,
    ...config,
  };

  if (!sessionHistory || sessionHistory.length < opts.sessionCountThreshold) {
    return {
      recommendations: null,
      sufficient: false,
      report: `Insufficient session history: ${(sessionHistory || []).length} < ${opts.sessionCountThreshold}. Recommendations require at least ${opts.sessionCountThreshold} sessions.`,
    };
  }

  // Compute per-dimension variance across sessions
  const dimensionVariances = {};
  for (const dim of DIMENSIONS) {
    const scores = [];
    for (const session of sessionHistory) {
      if (session.dimensions && Array.isArray(session.dimensions)) {
        const dimEntry = session.dimensions.find((d) => d.name === dim);
        if (dimEntry) {
          scores.push(dimEntry.score);
        }
      } else if (session.scores && typeof session.scores[dim] === 'number') {
        scores.push(session.scores[dim]);
      }
    }
    dimensionVariances[dim] = {
      mean: mean(scores),
      stddev: stddev(scores),
      count: scores.length,
    };
  }

  // Simple heuristic: dimensions with consistently low scores deserve higher weight;
  // dimensions with high variance should be investigated before weight changes.
  const recommended = {};
  let totalWeight = 0;

  for (const dim of DIMENSIONS) {
    const current = currentWeights[dim] || 0.20;
    const dimData = dimensionVariances[dim];

    // If a dimension consistently scores low (mean < 80), suggest increasing weight
    // If it consistently scores high (mean > 95), suggest slightly decreasing weight
    let adjustment = 0;
    if (dimData.mean < 80 && dimData.count >= 3) {
      adjustment = 0.02;
    } else if (dimData.mean > 95 && dimData.count >= 3) {
      adjustment = -0.01;
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ promotion-gates — promotion gate thresholds and gate evaluation         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTED_SCORE_GATE = 70;

const PROMOTION_GATES = Object.freeze({
  structural: 80,
  ruleCoherence: 85,
  integration: 90,
  outputQuality: 75,
  systemFitness: 80,
});

const BENCHMARK_AGGREGATE_GATE = 85;

const MIRROR_SYNC_STATES = Object.freeze({
  allLanded: 'all_landed',
  verificationFailed: 'verification_failed',
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate scored dimensions against the per-dimension promotion thresholds.
 *
 * @param {Array<Object>} dimensions - Dimensions with name and score fields.
 * @returns {Object} Result with passed flag, thresholds, per-name results, failed, unscored.
 */
function evaluatePromotionGates(dimensions) {
  const byName = new Map((dimensions || []).map((dimension) => [dimension.name, dimension]));
  const results = {};
  const failed = [];
  const unscored = [];

  for (const [name, minimumScore] of Object.entries(PROMOTION_GATES)) {
    const dimension = byName.get(name);
    const score = dimension ? dimension.score : null;
    const passed = typeof score === 'number' && Number.isFinite(score) && score >= minimumScore;
    results[name] = {
      score,
      minimumScore,
      passed,
    };
    if (score === null || score === undefined) {
      unscored.push(name);
    } else if (!passed) {
      failed.push(name);
    }
  }

  return {
    passed: failed.length === 0 && unscored.length === 0,
    thresholds: PROMOTION_GATES,
    results,
    failed,
    unscored,
  };
}

/**
 * Build the partial mirror-sync state label from the landed runtimes.
 *
 * @param {Array<string>} presentRuntimes - Runtimes whose mirrors landed.
 * @returns {string} A `partial:<runtimes>` label, or the verification-failed state.
 */
function buildPartialMirrorSyncState(presentRuntimes) {
  const landed = [...new Set(presentRuntimes || [])].sort();
  return landed.length > 0 ? `partial:${landed.join(',')}` : MIRROR_SYNC_STATES.verificationFailed;
}

/**
 * Evaluate the mirror-sync gate from a verifyMirrorSync result.
 *
 * @param {Object} syncResult - Result object from the mirror-sync verifier.
 * @returns {Object} Gate outcome with passed, mirror_sync_state, recoveryAction, result.
 */
function evaluateMirrorSyncGate(syncResult) {
  if (syncResult?.allInSync) {
    return {
      passed: true,
      mirror_sync_state: MIRROR_SYNC_STATES.allLanded,
      recoveryAction: null,
      result: syncResult,
    };
  }

  return {
    passed: false,
    mirror_sync_state: buildPartialMirrorSyncState(syncResult?.presentRuntimes || []),
    recoveryAction: 'rollback_partial_mirrors',
    result: syncResult || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  WEIGHTED_SCORE_GATE,
  PROMOTION_GATES,
  BENCHMARK_AGGREGATE_GATE,
  MIRROR_SYNC_STATES,
  buildPartialMirrorSyncState,
  evaluateMirrorSyncGate,
  evaluatePromotionGates,
};
{
  "target": "",
  "targetProfile": "dynamic",
  "targetKind": "dynamic",
  "maxIterations": 5,
  "maxCandidatesPerIteration": 1,
  "executionMode": "confirm",
  "proposalOnly": true,
  "promotionEnabled": false,
  "branchPreservationPolicy": "preserve-on-failure",
  "baselineRequired": true,
  "specFolder": "",
  "createdAt": "",
  "status": "initialized",
  "lineage": {
    "sessionId": "",
    "parentSessionId": null,
    "lineageMode": "new",
    "allowedModes": [
      "new"
    ],
    "generation": 1
  },
  "paths": {
    "runtimeRoot": "improvement",
    "stateLog": "improvement/agent-improvement-state.jsonl",
    "strategy": "improvement/agent-improvement-strategy.md",
    "dashboard": "improvement/agent-improvement-dashboard.md",
    "registry": "improvement/experiment-registry.json",
    "charter": "improvement/agent-improvement-charter.md",
    "manifest": "improvement/target_manifest.jsonc",
    "candidates": "improvement/candidates",
    "benchmarkRoot": "improvement/benchmark-runs",
    "targetProfiles": ".opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target-profiles",
    "fixtureCatalog": ".opencode/skills/system-deep-loop/deep-improvement/assets/fixtures"
  },
  "targets": {
    "activeProfile": "dynamic",
    "supportedProfiles": [],
    "promotionEligibleProfiles": []
  },
  "scoring": {
    "thresholdDelta": 2,
    "hardRejectOnMissingTemplate": true,
    "hardRejectOnNestedDelegation": true,
    "simplicityTieBreak": true,
    "dynamicProfileEnabled": true,
    "dimensionWeights": {
      "structural": 0.20,
      "ruleCoherence": 0.25,
      "integration": 0.25,
      "outputQuality": 0.15,
      "systemFitness": 0.15
    }
  },
  "benchmarks": {
    "requiredForProfiles": [],
    "minimumAggregateScore": 85,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0
  },
  "stopRules": {
    "maxConsecutiveTies": 2,
    "maxInfraFailuresPerProfile": 2,
    "maxWeakBenchmarkRunsPerProfile": 2,
    "stopOnDriftAmbiguity": true,
    "stopOnDimensionPlateau": true,
    "plateauWindow": 3
  },
  "dispatchCaps": {
    "maxCandidateDispatches": 5,
    "maxScoreExecutions": 15,
    "maxBenchmarkRuns": 5
  },
  "journal": {
    "enabled": true,
    "path": "improvement/improvement-journal.jsonl",
    "sessionId": "",
    "emitLifecycleEvents": true
  },
  "coverageGraph": {
    "enabled": true,
    "path": "improvement/mutation-coverage.json"
  },
  "trajectory": {
    "minDataPoints": 3,
    "stabilityDelta": 2
  },
  "tradeOff": {
    "enabled": true,
    "improvementThreshold": 3,
    "regressionThresholds": {
      "hard": -3,
      "soft": -5
    }
  },
  "parallelWaves": {
    "enabled": false,
    "activationThreshold": 0.7,
    "maxCandidates": 3,
    "lineagePath": "improvement/candidate-lineage.json"
  },
  "weightOptimizer": {
    "enabled": false,
    "sessionCountThreshold": 5,
    "reportPath": "improvement/weight-recommendation.md",
    "autoApply": false
  },
  "benchmarkStability": {
    "replayCount": 3,
    "warningThreshold": 0.95
  },
  "fileProtection": {
    "agent-improvement-config.json": "immutable",
    "agent-improvement-state.jsonl": "append-only",
    "improvement-journal.jsonl": "append-only",
    "mutation-coverage.json": "mutable",
    "candidate-lineage.json": "mutable",
    "agent-improvement-strategy.md": "mutable",
    "agent-improvement-dashboard.md": "auto-generated",
    "experiment-registry.json": "auto-generated",
    "candidates/*": "write-once",
    "benchmark-runs/*": "write-many-evidence",
    "agent-improvement-charter.md": "immutable",
    "target_manifest.jsonc": "immutable"
  }
}

web search: 
web search: repo:deepchecks/deepchecks "TrainTestLeakage" ...
web search: 
web search: GitHub benchmark contamination detection n-gram LLM Decontaminator repository ...
web search: 
web search: https://github.com/lm-sys/llm-decontaminator
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
codex
Deep-improvement’s next moat is not a smarter score. It is an evaluator that the optimizer cannot inspect, query exhaustively, modify, or impersonate—and whose signed decision is the only promotion credential.


### Failure taxonomy and fail-safe response

| Degeneration | Detection | Fail-safe | Maps to |
|---|---|---|---|
| Regressional Goodhart: selecting the luckiest noisy candidate | Paired candidate/baseline results; sequentially valid or Ladder-style material-improvement threshold; count all evaluator queries | Keep baseline unless the paired improvement clears the adaptive threshold; exact scores remain hidden until session end | deep-improvement, runtime/convergence, runtime/budget-cost |
| Extremal Goodhart: mode collapse or capability drift outside the evaluator’s calibrated region | Per-slice lower bounds plus automatic weak-segment search; MMD/permutation tests over action/tool-trace embeddings | Veto new weak slices; unexplained trace drift forces shadow evaluation, never direct promotion | deep-improvement, runtime/gauges-observability |
| Causal Goodhart: changing proxy-visible structure without improving behavior | Divergence between visible score, sealed-canary score, and gold-calibrated score; metamorphic canaries | A visible gain with flat/negative sealed evidence is `PROXY_ONLY_GAIN` and blocks promotion | deep-improvement |
| Adversarial Goodhart: oracle leakage, sycophancy, reward/test tampering | Honeypot evaluator files, credentials, cache keys and logs; semantic leak scan; stance-flip canaries; separate reward and oversight channels | Immediate non-overridable veto; burn the canary epoch and invalidate every receipt derived from it | deep-improvement, runtime/state-jsonl-checkpointing |

This taxonomy comes directly from regressional, extremal, causal, and adversarial Goodhart, rather than treating every failure as generic “benchmark instability.” [Manheim and Garrabrant](https://arxiv.org/abs/1803.04585) provide the taxonomy; [reward-model overoptimization](https://arxiv.org/abs/2210.10760) shows why additional proxy optimization can eventually reduce gold performance.

### Three concrete changes

1. **EvaluatorCapsule V2 — uniqueness-sharpening.** Make promotion consume a signed receipt:

   `evaluate({candidateHash, baselineHash, evaluatorEpoch, queryOrdinal}) → EvaluatorReceiptV2`

   The receipt should bind `candidateHash`, `baselineHash`, `evaluatorHash`, sealed-canary epoch, query count, gold-calibration result, tamper signals, slice vetoes, decision, and signature. It must omit fixture IDs, prompts, exact scores, grader prompt, and cache details. `promote-candidate.cjs` should reject unsigned, replayed, stale-epoch, mismatched-hash, or veto-bearing receipts. Sealed/gold regressions and scoring-surface mutation must have no same-session override; a legitimate rubric change starts a new evaluator epoch and recalibrates gold.

   Anthropic’s reward-tampering artifacts separate `reward_cmd` from `oversight_cmd`, and recorded cases where agents edited both reward and tests—exactly why ordinary success signals cannot authorize promotion by themselves. [Repository and artifact contract](https://github.com/anthropics/sycophancy-to-subterfuge-paper).

2. **Non-extractive evaluator feedback.** Apply the [Ladder](https://proceedings.mlr.press/v37/blum15.html) principle: update candidate-visible feedback only after a statistically material improvement; otherwise return the prior coarse band. A suitable response is `{verdictBand, vetoClass, queriesRemaining}`, not dimension scores or failing fixture names. Exact evidence becomes visible only after the session is terminal.

   Before promotion, scan candidate text, proposer-visible prompts, summaries, caches, and logs against sealed fixtures inside the capsule. `lm-sys/llm-decontaminator` gives a concrete two-stage implementation: SentenceTransformer cosine top-k retrieval in `vector_db.py`, followed by binary semantic-equivalence adjudication in `llm_detect.py`. Any semantic match burns the canary epoch.

3. **Regression envelope instead of aggregate thresholds.** Preserve the aggregate gate, but make it insufficient. Record paired deltas by task family, difficulty, tool-use pattern, cost/latency decile, and mutation family. Discover additional weak slices using Deepchecks’ tree-based error segmentation. Compare baseline and candidate action-trace embeddings with an MMD permutation test; Alibi Detect exposes `MMDDrift(...).predict(..., return_p_val=True, return_distance=True)`.

   Drift statistics need baseline false-positive calibration and adequate samples; with sparse fixtures, use deterministic per-slice floors and paired exact tests instead. The existing `--allow-hurt-fixtures` may remain for visible exploratory fixtures, but never for sealed canaries or gold anchors.

### Moat thesis

Naive self-improvement produces a candidate and a self-congratulatory score. Deep-research gathers evidence, deep-review finds defects, council deliberates, and alignment checks a named authority—but none should possess mutation authority.

Deep-improvement can uniquely produce a bounded, rollback-capable, tamper-tested promotion decision: one actor proposes; a sealed counterparty attempts to falsify the improvement; a signed, veto-free receipt authorizes accept/ship. Sharpening that separation turns “the score went up” into “the candidate survived an evaluator it could neither learn nor alter.” That is the defensible moat.

Source maturity: Anthropic’s artifact repo has ~28 stars and was archived June 2025; LiveBench has ~1.2k stars and a January 2026 changelog entry; llm-decontaminator has ~324 stars but no releases and is 2023-era code; Alibi Detect has ~2.5k stars with v0.13.0 from December 2025; Deepchecks has ~4k stars with v0.19.1 from December 2024. [Anthropic](https://github.com/anthropics/sycophancy-to-subterfuge-paper), [LiveBench changelog](https://github.com/LiveBench/LiveBench/blob/main/changelog.md), [LLM Decontaminator](https://github.com/lm-sys/llm-decontaminator), [Alibi Detect](https://github.com/SeldonIO/alibi-detect), [Deepchecks](https://github.com/deepchecks/deepchecks).

```json
{
  "new_repos": [
    {
      "name": "anthropics/sycophancy-to-subterfuge-paper",
      "url": "https://github.com/anthropics/sycophancy-to-subterfuge-paper",
      "stars": "~28",
      "what": "2024 reward-tampering artifacts, archived June 2025; environments.json separates reward_cmd from oversight_cmd and publishes tampering samples.",
      "lesson": "Optimization reward and tamper oversight must be independent channels; successful task reward cannot itself authorize promotion.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "LiveBench/LiveBench",
      "url": "https://github.com/LiveBench/LiveBench",
      "stars": "~1.2k",
      "what": "ICLR 2025 benchmark with objective ground-truth scoring, rotating questions, and a changelog updated January 2026.",
      "lesson": "Use versioned canary epochs that rotate before repeated adaptive evaluation turns them into training data; prefer deterministic ground truth over judge opinion.",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "name": "lm-sys/llm-decontaminator",
      "url": "https://github.com/lm-sys/llm-decontaminator",
      "stars": "~324",
      "what": "2023 contamination detector using embedding top-k retrieval in vector_db.py followed by LLM semantic-equivalence classification in llm_detect.py; no releases.",
      "lesson": "Scan every proposer-visible artifact for paraphrased canary leakage inside the evaluator boundary, returning only a leak veto rather than the matching text.",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "name": "SeldonIO/alibi-detect",
      "url": "https://github.com/SeldonIO/alibi-detect",
      "stars": "~2.5k",
      "what": "Outlier, adversarial, and drift detection library; v0.13.0 released December 2025, including MMD, KS, classifier, and online detectors.",
      "lesson": "Compare baseline and candidate action-trace distributions, not only final scores; unexplained semantic or tool-use drift is evidence of capability drift.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "deepchecks/deepchecks",
      "url": "https://github.com/deepchecks/deepchecks",
      "stars": "~4k",
      "what": "Continuous model/data validation library; v0.19.1 released December 2024, with WeakSegmentsPerformance and configurable pass/fail conditions.",
      "lesson": "Train shallow error-prediction trees over fixture metadata to discover concentrated regressions that aggregate promotion scores conceal.",
      "maps_to": [
        "deep-improvement",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Classify every promotion failure as regressional, extremal, causal, or adversarial Goodhart and attach a distinct detection receipt and veto; generic benchmark_failed loses the evidence needed to improve the evaluator.",
      "evidence": "https://arxiv.org/abs/1803.04585",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    },
    {
      "insight": "Evaluator success and evaluator-integrity oversight must be separate outputs: a candidate can pass the nominal task while modifying reward, tests, caches, or evidence.",
      "evidence": "https://github.com/anthropics/sycophancy-to-subterfuge-paper",
      "maps_to": [
        "deep-improvement"
      ],
      "confidence": "high"
    },
    {
      "insight": "Adaptive evaluator feedback is an information leak; reveal only thresholded verdict bands during optimization and withhold exact scores and fixture identities until session termination.",
      "evidence": "https://proceedings.mlr.press/v37/blum15.html",
      "maps_to": [
        "deep-improvement",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Canary freshness needs an explicit lifecycle—sealed, active, burned, retired—and semantic leakage detection because paraphrases and translations bypass literal matching.",
      "evidence": "https://github.com/LiveBench/LiveBench; https://github.com/lm-sys/llm-decontaminator",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/dedup-novelty"
      ],
      "confidence": "high"
    },
    {
      "insight": "Optimization pressure is itself a risk signal: track cumulative evaluator queries and candidate fan-out against sealed/gold gain, and stop when proxy gain continues while independent gain stalls or reverses.",
      "evidence": "https://arxiv.org/abs/2210.10760",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "rec": "Implement EvaluatorReceiptV2 and require promote-candidate.cjs to verify its signature, candidate/baseline/evaluator hashes, fresh canary epoch, gold calibration, query count, and empty veto set; make sealed/gold regression and evaluator-surface mutation non-overridable.",
      "target": "deep-improvement; runtime/state-jsonl-checkpointing",
      "rationale": "This closes forged receipts, stale evidence, reward/test tampering, and same-session rubric changes while keeping exact evaluator internals outside the mutator's capability boundary.",
      "uniqueness": "Makes deep-improvement the only mode that can issue cryptographically bound mutation authority after independent falsification, not merely advice or a higher score.",
      "effort": "L",
      "impact": "high",
      "evidence": "https://github.com/anthropics/sycophancy-to-subterfuge-paper; https://arxiv.org/abs/2406.10162"
    },
    {
      "rec": "Add a non-extractive evaluator-oracle API: Ladder-style material-improvement updates, coarse verdict bands, per-epoch query budgets, terminal-only exact evidence, semantic leak scanning across candidate/proposer-visible artifacts, and automatic canary-epoch burn on any match.",
      "target": "deep-improvement; runtime/budget-cost; runtime/dedup-novelty",
      "rationale": "Repeated dimension-level feedback lets the optimizer reconstruct the promotion surface even when fixture files are hidden; coarse thresholded feedback and semantic scanning reduce that channel.",
      "uniqueness": "Sharpens the frozen-evaluator moat by making evaluator secrecy an enforced information-flow property rather than an operator convention.",
      "effort": "M",
      "impact": "high",
      "evidence": "https://proceedings.mlr.press/v37/blum15.html; https://github.com/lm-sys/llm-decontaminator; https://github.com/LiveBench/LiveBench"
    },
    {
      "rec": "Replace aggregate-only promotion with a regression envelope: paired global lower bound, non-overridable sealed/gold slice floors, automatic weak-segment discovery, action-trace drift testing, and proxy-versus-sealed gain curves indexed by evaluator query count.",
      "target": "deep-improvement; runtime/gauges-observability; runtime/convergence",
      "rationale": "Aggregate gains can conceal mode collapse, tail regressions, and behavior drift; the envelope turns each into a named promotion veto and stops overoptimization before the proxy/gold relationship reverses.",
      "uniqueness": "",
      "effort": "M",
      "impact": "high",
      "evidence": "https://github.com/deepchecks/deepchecks; https://github.com/SeldonIO/alibi-detect; https://arxiv.org/abs/2210.10760"
    }
  ],
  "contradictions": [
    {
      "claim": "Increasing a frozen proxy score makes a candidate increasingly likely to be better.",
      "counter": "Gold performance can peak and then decline as optimization pressure against an imperfect proxy increases; evaluator query count and candidate fan-out must be treated as risk variables.",
      "evidence": "https://arxiv.org/abs/2210.10760"
    },
    {
      "claim": "A different-family LLM grader is sufficient evaluator independence.",
      "counter": "Different-family grading removes one correlated-bias channel but does not make judgments objective or contamination-free; LiveBench adopted objective ground truth and reports severe judge error on hard tasks.",
      "evidence": "https://github.com/LiveBench/LiveBench/blob/main/changelog.md"
    },
    {
      "claim": "Repeatability evidence is advisory only in the current promotion contract.",
      "counter": "The shipped promotion path hard-fails when the repeatability report is missing or passed is not true; only weight recommendations are advisory.",
      "evidence": ".opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md; .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs"
    }
  ],
  "next_angles": [
    "Build the evaluator-oracle leakage benchmark already flagged: vary exact-score, dimension-band, pass/fail, Ladder-thresholded, and terminal-only feedback while measuring canary reconstruction rate per evaluator query.",
    "Attack-test EvaluatorReceiptV2 with replayed receipts, candidate-hash substitution, stale canary epochs, forged signatures, altered gold calibration, and accept-to-ship evaluator drift.",
    "Calibrate regression-envelope false veto rates across sparse agent fixtures: paired exact tests versus bootstrap bounds, weak-segment minimum sizes, and MMD permutation tests on action traces."
  ],
"notes": "The strongest existing isolation is MMD and tree-discovered weak slices are transfers from ML monitoring, not yet validated on agent traces, so their false-veto rates need calibration before becoming hard gates. The Anthropic repository is archived and llm-decontaminator is older research code; both are mechanism references, not dependencies to vendor unchanged."
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
203,242
