<!-- iteration 28 | model sol (gpt-5.6-sol) | angle: Evaluator reliability: LLM-as-judge failure modes | 2026-07-14T23:33:44.397Z -->

Evaluator reliability should be a state machine, not a scalar score. For `deep-review` and `deep-ai-council`, preserve the raw verdict, order-swapped verdict, rubric vector, length-controlled score, judge family, panel votes, and adversarial replay. `runtime/convergence` should abstain or escalate when these views disagree.

- Position swapping is now better treated as an invariance test than a universal correction. FairEval found severe order effects, while a 2026 five-model audit found negligible directional position bias but persistent position sensitivity and model-dependent gains from swapping. Log swap-flip rate and disagreement entropy. [FairEval](https://arxiv.org/abs/2305.17926), [2026 systematic audit](https://arxiv.org/abs/2604.23178).

- A global verbosity penalty is wrong. Length-controlled AlpacaEval estimates the counterfactual preference at equal response length and improved Arena correlation from 0.94 to 0.98. The newer audit found judges split between longer-answer preference, concision preference, and neutrality. Store raw and length-controlled rankings; test both filler expansion and information-destroying truncation. [Length-Controlled AlpacaEval](https://arxiv.org/abs/2404.04475).

- Blind provenance does not eliminate self-preference: judges can recognize their own style, and stronger authorship neutralization can make the bias recover. Rotate proposer/judge roles, forbid judges from rewriting candidates before scoring, and track leave-one-family-out winner stability. Diverse panels help, but a fresh robustness analysis shows ordinary mean aggregation can fail badly under biased contamination. [Self-recognition study](https://arxiv.org/abs/2404.13076), [AAAI 2026 obfuscation study](https://ojs.aaai.org/index.php/AAAI/article/view/41105), [PoLL](https://arxiv.org/abs/2404.18796), [RoPoLL](https://arxiv.org/abs/2606.30931).

- Rubrics need calibration against a human-labeled slice; rubric detail alone is not debiasing. Evaluators also need adversarial canaries: RobustJudge found large prompt-template-dependent robustness differences. For verifiable tasks, a fresh July 2026 preprint additionally suggests making judges commit an independent solution before viewing the candidate. [LLM-Rubric](https://aclanthology.org/2024.acl-long.745/), [RobustJudge paper](https://arxiv.org/abs/2506.09443), [commit-first study](https://arxiv.org/abs/2607.05904).

Repository metadata was checked against [FairEval](https://github.com/i-Eval/FairEval), [AlpacaEval](https://github.com/tatsu-lab/alpaca_eval), [LLM-Rubric](https://github.com/microsoft/LLM-Rubric), [Genii](https://github.com/NEUIR/Genii), and [RobustJudge](https://github.com/S3IC-Lab/RobustJudge); stars are lookup-time approximations.

```json
{
  "new_repos": [
    {
      "name": "i-Eval/FairEval",
      "url": "https://github.com/i-Eval/FairEval",
      "stars": "~145",
      "what": "Position-bias calibration artifact implementing multiple-evidence and balanced-position evaluation; last commit September 2023.",
      "lesson": "Execute A/B and B/A as one review transaction, record flip rate and diversity entropy, and abstain or escalate instead of silently averaging inconsistent judgments.",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "tatsu-lab/alpaca_eval",
      "url": "https://github.com/tatsu-lab/alpaca_eval",
      "stars": "~2,000",
      "what": "Automatic evaluator with randomized presentation and counterfactual length-controlled win rates; last commit August 2025.",
      "lesson": "Persist raw and length-controlled rankings together and block convergence when verbosity controls change the selected winner.",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "microsoft/LLM-Rubric",
      "url": "https://github.com/microsoft/LLM-Rubric",
      "stars": "~37",
      "what": "Multidimensional rubric implementation that calibrates LLM response distributions to individual human judges; last commit February 2025.",
      "lesson": "Treat criterion outputs as probabilistic features calibrated on human annotations, including judge-specific parameters, rather than directly averaging nominal rubric scores.",
      "maps_to": [
        "deep-review",
        "deep-alignment",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "NEUIR/Genii",
      "url": "https://github.com/NEUIR/Genii",
      "stars": "~6",
      "what": "ACL 2026 research artifact for group-polling optimization against judgment self-preference; repository updated January 2026.",
      "lesson": "Rotate proposer and judge roles and build cross-family consistency checks; runtime-only role rotation is an adaptation because the reported method also performs model optimization.",
      "maps_to": [
        "deep-ai-council",
        "deep-review",
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "S3IC-Lab/RobustJudge",
      "url": "https://github.com/S3IC-Lab/RobustJudge",
      "stars": "~5",
      "what": "Judge-robustness harness covering 15 attacks and 7 defenses across 12 models; last commit September 2025.",
      "lesson": "Gate evaluator changes on adversarial canaries and preserve clean, attacked, and defended judgments in JSONL so every score change is replayable.",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "deep-alignment",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Make order invariance a convergence prerequisite: run paired A/B and B/A evaluations, map both verdicts into one canonical frame, and convert disagreement into abstention or escalation rather than a synthetic winner.",
      "evidence": "FairEval: https://arxiv.org/abs/2305.17926; systematic mitigation audit: https://arxiv.org/abs/2604.23178",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Maintain two verbosity channels: observed preference and a length-controlled counterfactual, supplemented by filler-expansion and completeness-truncation controls; there is no reliable universal length penalty.",
      "evidence": "Length-Controlled AlpacaEval: https://arxiv.org/abs/2404.04475; cross-family audit: https://arxiv.org/abs/2604.23178",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Add a self-preference firewall: blind explicit provenance, prohibit judge-authored rewrites of candidates, rotate generator and judge families, and log each judge's own-family residual plus leave-one-family-out winner stability.",
      "evidence": "Self-recognition: https://arxiv.org/abs/2404.13076; authorship obfuscation: https://ojs.aaai.org/index.php/AAAI/article/view/41105; Genii: https://aclanthology.org/2026.findings-acl.71/",
      "maps_to": [
        "deep-ai-council",
        "deep-review",
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "insight": "Council diversity and aggregation robustness are separate controls: obtain independent pre-votes from disjoint model families, estimate vote correlation and leave-one-out influence, then use robust aggregation or abstention rather than an arithmetic mean.",
      "evidence": "PoLL: https://arxiv.org/abs/2404.18796; RoPoLL: https://arxiv.org/abs/2606.30931",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "insight": "For verifiable tasks, de-anchor the judge by requiring an independent committed solution before revealing the candidate; combine this with hidden anchors and adversarial canaries, retaining every intermediate judgment for replay.",
      "evidence": "RobustJudge: https://arxiv.org/abs/2506.09443; commit-first self-play audit: https://arxiv.org/abs/2607.05904",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "deep-alignment",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "Position bias is a large, stable directional preference that deep-review can correct with a fixed adjustment.",
      "counter": "FairEval found severe historical order effects, but a 2026 five-model audit found negligible directional bias while retaining position sensitivity. runtime/convergence should therefore use swapping as an invariance test, not a fixed correction.",
      "evidence": "https://arxiv.org/abs/2305.17926; https://arxiv.org/abs/2604.23178"
    },
    {
      "claim": "LLM judges universally prefer longer answers, so deep-ai-council should penalize length.",
      "counter": "Judge families split among verbosity preference, concision preference, and near-neutrality; longer answers can also be genuinely more complete. deep-review needs judge-specific expansion and truncation controls.",
      "evidence": "https://arxiv.org/abs/2404.04475; https://arxiv.org/abs/2604.23178"
    },
    {
      "claim": "Removing authorship labels or normalizing style eliminates self-preference in deep-ai-council.",
      "counter": "Judges recognize their own generations without labels, and self-preference can recover after stronger stylistic neutralization. deep-alignment must measure perturbation invariance and own-family residuals rather than assuming anonymity worked.",
      "evidence": "https://arxiv.org/abs/2404.13076; https://ojs.aaai.org/index.php/AAAI/article/view/41105"
    },
    {
      "claim": "A detailed rubric or a larger jury is monotonic reliability insurance.",
      "counter": "Rubric effectiveness is model- and benchmark-dependent, while ordinary panel means can remain brittle under correlated or biased contamination. deep-review needs human calibration; deep-ai-council needs diversity diagnostics, robust aggregation, and abstention.",
      "evidence": "https://aclanthology.org/2024.acl-long.745/; https://arxiv.org/abs/2604.23178; https://arxiv.org/abs/2606.30931"
    }
  ],
  "next_angles": [
    "De-anchored evaluation protocols: compare commit-first, blind-solve, reference-guided, and candidate-first judges on long-form reviews and complete agent trajectories.",
    "Correlation-aware council aggregation: seed family-correlated failures and compare majority vote, arithmetic mean, geometric median, leave-one-family-out selection, and abstention.",
    "Evaluator upgrade drift: replay fixed JSONL trajectories across judge-model, rubric, prompt-template, and parser upgrades and measure winner flips and premature-stop flips.",
    "Presentation invariance beyond verbosity: isolate markdown, citation density, sectioning, confidence language, and polished-but-unverifiable reasoning from substantive quality."
  ],
  "notes": "Most evidence remains pairwise and single-turn; long-horizon agent trajectories are under-tested. Self-preference measurements can confound authorship with real answer-quality differences unless residualized against human or hidden-anchor labels. RoPoLL and the commit-first reward-hacking result are fresh 2026 preprints and need independent replication. Several repositories are small research artifacts, so they are stronger as protocol references than production dependencies."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: ultra
reasoning summaries: none
session id: 019f62f3-730e-7493-8984-6263ca0eda20
--------
user
You are iteration 28/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Evaluator reliability: LLM-as-judge failure modes
DIRECTIVE: Position bias, self-preference, verbosity bias, and mitigations (rubrics, panels, adversarial). Map to deep-review, deep-ai-council.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (131) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop | Query reformulation & source diversification | Cross-iteration memory & knowledge accumulation | Reducer / aggregator design patterns | Partial-failure tolerance, retries, idempotency | Human-in-the-loop / steering / interrupt-resume | Cost economics & adaptive-depth scheduling | GAP-SWEEP #1: adjacent ecosystems uncovered | Contradiction audit: convergent vs divergent | Determinism under concurrency (fan-out correctness)
Insights so far: 135; contradictions logged: 80.
Open threads prior iterations flagged: Fuzz source-to-lock compilation and replay to detect semantic drift between editable loop intent and executed JSONL events. | Replay identical system-deep-loop JSONL trajectories under separate branch-stop and parent-stop policies, measuring false stops, wasted budget, and final selection regret. | Construct delayed-bloom branches whose quality improves only after apparent stabilization to calibrate multi-fidelity promotion and full-depth sentinel rates. | Estimate a two-dimensional improvement hazard: probability that another step improves an existing branch versus probability that a new independent branch finds a better basin. | Build a Jepsen-style linearizability model for novelty claim/commit/release histories under TTL expiry, crash, retry, and ABA lock reacquisition. | Differentially replay one branch multiset across completion permutations, worker counts, reduction trees, and numeric encodings; measure top-k and stopping-decision flips. | Fuzz cross-language canonicalization of JSON, Unicode, floating-point edge cases, prompt templates, and stochastic sample identifiers. | Design deterministic streaming early termination using fixed decision epochs, late-result policies, and replayable cancellation boundaries.

Map every finding to at least one concrete system-deep-loop target from this list: deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

Write a concise analysis (what you found + why it transfers), THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:
```json
{
  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable lesson for system-deep-loop","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "insights": [{"insight":"one specific transferable idea","evidence":"repo/paper/url","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "contradictions": [{"claim":"","counter":"","evidence":""}],
  "next_angles": ["a specific divergent angle worth exploring next"],
  "notes": "coverage gaps you noticed"
}
```
Target 2-5 NEW repos and 2-5 insights. Novelty and verifiable specifics over volume. If this angle is genuinely exhausted, return few/no new_repos but propose sharp next_angles (that is the divergent pivot, not a failure).
codex
This is read-only, low-blast research. I’m splitting the evidence hunt across judge-bias benchmarks, mitigation methods, and production evaluation tooling, then I’ll cross-check repository activity and GitHub stars before synthesizing only genuinely new coverage.
exec
/bin/zsh -lc "node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"Iteration 28/45 broadening research on evaluator reliability, LLM-as-judge position bias, self-preference, verbosity bias, and rubric/panel/adversarial mitigations mapped to deep-review and deep-ai-council; live web verification required\"}' --warm-only --format json --timeout-ms 3000" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 75 in 0ms:
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-skill-advisor/daemon-ipc.sock",
  "exitCode": 75
}

web search: 
web search: site:github.com LLM judge position bias FairEval repository ...
web search: 
web search: LLM-as-a-Judge position bias paper order swapping mitigation arXiv ...
web search: 
web search: site:github.com/tatsu-lab/alpaca_eval stars latest commit ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://api.github.com/repos/tatsu-lab/alpaca_eval
web search: 
web search: https://github.com/tatsu-lab/alpaca_eval/commits/main/
web search: 
web search: 
web search: 
web search: https://github.com/sksoumik/llm-as-judge/commits/main/
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://arxiv.org/html/2604.23178v2
web search: 
web search: site:github.com RoPoLL robust panel LLM judges ...
web search: 
web search: https://github.com/S3IC-Lab/RobustJudge
web search: 
web search: github princeton-nlp/LLMBar "Commits on" ...
web search: 
web search: "More Convincing, Not More Correct" GitHub ...
web search: 
web search: https://arxiv.org/abs/2404.13076
codex
A useful contradiction has emerged: “swap positions and add more judges” is not a universal fix. Current evidence separates persistent order sensitivity from directional position bias, shows length preference can reverse by judge family, and finds ordinary panel averaging brittle under correlated or contaminated judges. I’m verifying those distinctions against the primary papers now.
exec
/bin/zsh -lc 'for repo in tatsu-lab/alpaca_eval princeton-nlp/LLMBar ArjunPanickssery/self_recognition sksoumik/llm-as-judge S3IC-Lab/RobustJudge prometheus-eval/prometheus-eval; do gh api "repos/$repo" --jq '"'[.full_name,.stargazers_count,.pushed_at,.updated_at] | @tsv'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 192ms:
error connecting to api.github.com
check your internet connection or https://githubstatus.com
error connecting to api.github.com
check your internet connection or https://githubstatus.com
error connecting to api.github.com
check your internet connection or https://githubstatus.com

web search: 
web search: 
web search: 
web search: site:github.com/princeton-nlp/LLMBar/commit ...
web search: 
web search: https://github.com/i-Eval/FairEval
web search: 
web search: https://github.com/ArjunPanickssery/self_recognition/commits/master.atom
web search: 
web search: https://github.com/baaivision/JudgeLM
2026-07-14T23:28:55.536155Z ERROR codex_core::tools::router: error=timeout_ms must be at least 10000
web search: 
web search: site:github.com/sksoumik/llm-as-judge/commit "2026" ...
collab: Wait
collab: Wait
collab: Wait
web search: 
web search: "Reasoning-Bias-Detector" GitHub LLM judge ...
web search: 
web search: https://github.com/Joyyang158/Reasoning-Bias-Detector
collab: Wait
web search: 
web search: https://github.com/NEUIR/Genii
context compacted
codex
The evidence is converging on one design rule: judge reliability needs its own invariance and calibration loop, separate from the content-review loop. I’m tightening the repo recency signals and the few claims where 2026 results qualify older findings.
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/NEUIR/Genii/commits/main/
web search: 
web search: site:github.com/NEUIR/Genii/commit Genii NEUIR Jan 2026
web search: 
web search: 
web search: 
web search: '0.04'
web search: 
web search: 
web search: 
web search: 
codex
Evaluator reliability should be a state machine, not a scalar score. For `deep-review` and `deep-ai-council`, preserve the raw verdict, order-swapped verdict, rubric vector, length-controlled score, judge family, panel votes, and adversarial replay. `runtime/convergence` should abstain or escalate when these views disagree.

- Position swapping is now better treated as an invariance test than a universal correction. FairEval found severe order effects, while a 2026 five-model audit found negligible directional position bias but persistent position sensitivity and model-dependent gains from swapping. Log swap-flip rate and disagreement entropy. [FairEval](https://arxiv.org/abs/2305.17926), [2026 systematic audit](https://arxiv.org/abs/2604.23178).

- A global verbosity penalty is wrong. Length-controlled AlpacaEval estimates the counterfactual preference at equal response length and improved Arena correlation from 0.94 to 0.98. The newer audit found judges split between longer-answer preference, concision preference, and neutrality. Store raw and length-controlled rankings; test both filler expansion and information-destroying truncation. [Length-Controlled AlpacaEval](https://arxiv.org/abs/2404.04475).

- Blind provenance does not eliminate self-preference: judges can recognize their own style, and stronger authorship neutralization can make the bias recover. Rotate proposer/judge roles, forbid judges from rewriting candidates before scoring, and track leave-one-family-out winner stability. Diverse panels help, but a fresh robustness analysis shows ordinary mean aggregation can fail badly under biased contamination. [Self-recognition study](https://arxiv.org/abs/2404.13076), [AAAI 2026 obfuscation study](https://ojs.aaai.org/index.php/AAAI/article/view/41105), [PoLL](https://arxiv.org/abs/2404.18796), [RoPoLL](https://arxiv.org/abs/2606.30931).

- Rubrics need calibration against a human-labeled slice; rubric detail alone is not debiasing. Evaluators also need adversarial canaries: RobustJudge found large prompt-template-dependent robustness differences. For verifiable tasks, a fresh July 2026 preprint additionally suggests making judges commit an independent solution before viewing the candidate. [LLM-Rubric](https://aclanthology.org/2024.acl-long.745/), [RobustJudge paper](https://arxiv.org/abs/2506.09443), [commit-first study](https://arxiv.org/abs/2607.05904).

Repository metadata was checked against [FairEval](https://github.com/i-Eval/FairEval), [AlpacaEval](https://github.com/tatsu-lab/alpaca_eval), [LLM-Rubric](https://github.com/microsoft/LLM-Rubric), [Genii](https://github.com/NEUIR/Genii), and [RobustJudge](https://github.com/S3IC-Lab/RobustJudge); stars are lookup-time approximations.

```json
{
  "new_repos": [
    {
      "name": "i-Eval/FairEval",
      "url": "https://github.com/i-Eval/FairEval",
      "stars": "~145",
      "what": "Position-bias calibration artifact implementing multiple-evidence and balanced-position evaluation; last commit September 2023.",
      "lesson": "Execute A/B and B/A as one review transaction, record flip rate and diversity entropy, and abstain or escalate instead of silently averaging inconsistent judgments.",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "tatsu-lab/alpaca_eval",
      "url": "https://github.com/tatsu-lab/alpaca_eval",
      "stars": "~2,000",
      "what": "Automatic evaluator with randomized presentation and counterfactual length-controlled win rates; last commit August 2025.",
      "lesson": "Persist raw and length-controlled rankings together and block convergence when verbosity controls change the selected winner.",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "microsoft/LLM-Rubric",
      "url": "https://github.com/microsoft/LLM-Rubric",
      "stars": "~37",
      "what": "Multidimensional rubric implementation that calibrates LLM response distributions to individual human judges; last commit February 2025.",
      "lesson": "Treat criterion outputs as probabilistic features calibrated on human annotations, including judge-specific parameters, rather than directly averaging nominal rubric scores.",
      "maps_to": [
        "deep-review",
        "deep-alignment",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "NEUIR/Genii",
      "url": "https://github.com/NEUIR/Genii",
      "stars": "~6",
      "what": "ACL 2026 research artifact for group-polling optimization against judgment self-preference; repository updated January 2026.",
      "lesson": "Rotate proposer and judge roles and build cross-family consistency checks; runtime-only role rotation is an adaptation because the reported method also performs model optimization.",
      "maps_to": [
        "deep-ai-council",
        "deep-review",
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "S3IC-Lab/RobustJudge",
      "url": "https://github.com/S3IC-Lab/RobustJudge",
      "stars": "~5",
      "what": "Judge-robustness harness covering 15 attacks and 7 defenses across 12 models; last commit September 2025.",
      "lesson": "Gate evaluator changes on adversarial canaries and preserve clean, attacked, and defended judgments in JSONL so every score change is replayable.",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "deep-alignment",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Make order invariance a convergence prerequisite: run paired A/B and B/A evaluations, map both verdicts into one canonical frame, and convert disagreement into abstention or escalation rather than a synthetic winner.",
      "evidence": "FairEval: https://arxiv.org/abs/2305.17926; systematic mitigation audit: https://arxiv.org/abs/2604.23178",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Maintain two verbosity channels: observed preference and a length-controlled counterfactual, supplemented by filler-expansion and completeness-truncation controls; there is no reliable universal length penalty.",
      "evidence": "Length-Controlled AlpacaEval: https://arxiv.org/abs/2404.04475; cross-family audit: https://arxiv.org/abs/2604.23178",
      "maps_to": [
        "deep-review",
        "deep-ai-council",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Add a self-preference firewall: blind explicit provenance, prohibit judge-authored rewrites of candidates, rotate generator and judge families, and log each judge's own-family residual plus leave-one-family-out winner stability.",
      "evidence": "Self-recognition: https://arxiv.org/abs/2404.13076; authorship obfuscation: https://ojs.aaai.org/index.php/AAAI/article/view/41105; Genii: https://aclanthology.org/2026.findings-acl.71/",
      "maps_to": [
        "deep-ai-council",
        "deep-review",
        "deep-alignment",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "insight": "Council diversity and aggregation robustness are separate controls: obtain independent pre-votes from disjoint model families, estimate vote correlation and leave-one-out influence, then use robust aggregation or abstention rather than an arithmetic mean.",
      "evidence": "PoLL: https://arxiv.org/abs/2404.18796; RoPoLL: https://arxiv.org/abs/2606.30931",
      "maps_to": [
        "deep-ai-council",
        "runtime/fan-out-fan-in",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "insight": "For verifiable tasks, de-anchor the judge by requiring an independent committed solution before revealing the candidate; combine this with hidden anchors and adversarial canaries, retaining every intermediate judgment for replay.",
      "evidence": "RobustJudge: https://arxiv.org/abs/2506.09443; commit-first self-play audit: https://arxiv.org/abs/2607.05904",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "deep-alignment",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "Position bias is a large, stable directional preference that deep-review can correct with a fixed adjustment.",
      "counter": "FairEval found severe historical order effects, but a 2026 five-model audit found negligible directional bias while retaining position sensitivity. runtime/convergence should therefore use swapping as an invariance test, not a fixed correction.",
      "evidence": "https://arxiv.org/abs/2305.17926; https://arxiv.org/abs/2604.23178"
    },
    {
      "claim": "LLM judges universally prefer longer answers, so deep-ai-council should penalize length.",
      "counter": "Judge families split among verbosity preference, concision preference, and near-neutrality; longer answers can also be genuinely more complete. deep-review needs judge-specific expansion and truncation controls.",
      "evidence": "https://arxiv.org/abs/2404.04475; https://arxiv.org/abs/2604.23178"
    },
    {
      "claim": "Removing authorship labels or normalizing style eliminates self-preference in deep-ai-council.",
      "counter": "Judges recognize their own generations without labels, and self-preference can recover after stronger stylistic neutralization. deep-alignment must measure perturbation invariance and own-family residuals rather than assuming anonymity worked.",
      "evidence": "https://arxiv.org/abs/2404.13076; https://ojs.aaai.org/index.php/AAAI/article/view/41105"
    },
    {
      "claim": "A detailed rubric or a larger jury is monotonic reliability insurance.",
      "counter": "Rubric effectiveness is model- and benchmark-dependent, while ordinary panel means can remain brittle under correlated or biased contamination. deep-review needs human calibration; deep-ai-council needs diversity diagnostics, robust aggregation, and abstention.",
      "evidence": "https://aclanthology.org/2024.acl-long.745/; https://arxiv.org/abs/2604.23178; https://arxiv.org/abs/2606.30931"
    }
  ],
  "next_angles": [
    "De-anchored evaluation protocols: compare commit-first, blind-solve, reference-guided, and candidate-first judges on long-form reviews and complete agent trajectories.",
    "Correlation-aware council aggregation: seed family-correlated failures and compare majority vote, arithmetic mean, geometric median, leave-one-family-out selection, and abstention.",
    "Evaluator upgrade drift: replay fixed JSONL trajectories across judge-model, rubric, prompt-template, and parser upgrades and measure winner flips and premature-stop flips.",
    "Presentation invariance beyond verbosity: isolate markdown, citation density, sectioning, confidence language, and polished-but-unverifiable reasoning from substantive quality."
  ],
  "notes": "Most evidence remains pairwise and single-turn; long-horizon agent trajectories are under-tested. Self-preference measurements can confound authorship with real answer-quality differences unless residualized against human or hidden-anchor labels. RoPoLL and the commit-first reward-hacking result are fresh 2026 preprints and need independent replication. Several repositories are small research artifacts, so they are stronger as protocol references than production dependencies."
}
```
hook: Stop
hook: Stop Completed
tokens used
320,934
