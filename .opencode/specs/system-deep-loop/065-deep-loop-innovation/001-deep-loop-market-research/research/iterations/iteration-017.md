<!-- iteration 17 | model luna (gpt-5.6-luna) | angle: Convergence math & formal stopping rules | 2026-07-14T22:38:21.914Z -->

The main finding is that “convergence” needs typed stopping contracts:

- `certificate_stop`: stop when a time-uniform confidence boundary proves the current winner is sufficiently separated.
- `economic_stop`: stop when the best expected gain per unit cost falls below a reservation value.
- `progress_stop`: stop when calibrated progress is too weak, catching unsolvable or stalled cases.
- `runtime_stop`: hard budget, deadline, cancellation, or replay exhaustion.

Track-and-Stop is the cleanest bandit transfer: allocate samples toward competitive branches, then stop when a Chernoff/likelihood boundary separates the leader from every challenger. Time-uniform confidence sequences make this compatible with repeated polling, but only under defensible assumptions about dependence and bounded observations. Transfer: `runtime/convergence`, `runtime/fan-out-fan-in`, `runtime/budget-cost`, `deep-ai-council`. ([Track-and-Stop](https://proceedings.mlr.press/v49/garivier16a.html), [time-uniform Chernoff bounds](https://arxiv.org/abs/1808.03204))

LLM-specific work adds a stronger fan-in rule. Certified Self-Consistency uses an anytime-valid martingale certificate; MARS bounds how much unfinished traces could change the current vote margin. Both certify a distributional property or agreement with a full-budget vote—not truth itself. Transfer: persist `leader`, `margin`, `challengers`, `boundary`, and `stop_confidence` per JSONL event. ([Certified Self-Consistency](https://arxiv.org/abs/2510.17472), [MARS](https://arxiv.org/abs/2606.12935))

Conformal Thinking exposes a missing distinction: confidence-only stopping can waste the whole budget on unsolvable inputs. Its upper threshold controls premature confident exits; its lower progress threshold controls continued reasoning with insufficient improvement. Calibrate both against a target risk with finite-sample correction. Transfer: `runtime/convergence`, `runtime/budget-cost`, `runtime/gauges-observability`, `deep-research`, `deep-review`. ([Conformal Thinking](https://arxiv.org/abs/2602.03814))

Diminishing returns is best expressed as expected marginal utility per cost, not “no change for N rounds.” Cost-aware Bayesian optimization provides a stopping rule with expected cumulative-cost guarantees; adaptive submodularity supplies approximation guarantees for batched information gathering when its assumptions hold. Transfer: choose the next branch/evaluator by estimated marginal information or quality gain per cost, and stop when every available action falls below the reservation value. ([Cost-aware stopping](https://arxiv.org/abs/2507.12453), [adaptive submodularity](https://proceedings.mlr.press/v134/esfandiari21a.html))

Operationally, Vizier separates global trial comparison from local trajectory behavior, while Optuna’s Hyperband documentation requires warm-up observations per bracket before adaptive pruning. That argues for separate branch-prune and parent-stop state machines, depth-normalized evidence, and minimum samples before pruning. ([Vizier early stopping](https://oss-vizier.readthedocs.io/en/latest/guides/developer/early_stopping.html), [Optuna Hyperband](https://optuna.readthedocs.io/en/stable/reference/generated/optuna.pruners.HyperbandPruner.html))

The hard boundary is important: runtime termination can be proven; statistical correctness can be certified only under stated assumptions; economic stopping gives efficiency or regret guarantees, not task correctness. The JSONL schema should record which contract fired and its assumptions, rather than collapsing all exits into `converged`.

```json
{
  "new_repos": [
    {
      "name": "google/vizier",
      "url": "https://github.com/google/vizier",
      "stars": "~1.7k",
      "what": "Distributed black-box optimization with an explicit early-stop policy API; recency: latest release v0.1.24 in Feb 2025, 1,236 commits, exact latest commit year not surfaced.",
      "lesson": "Separate global incumbent-vs-history pruning from local trajectory stopping and reconstruct policy state from persisted trial history.",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "optuna/optuna",
      "url": "https://github.com/optuna/optuna",
      "stars": "~14.5k",
      "what": "Mature pruning framework with median, percentile, successive-halving, Hyperband, threshold, and patient pruners; recency: v4.9.0 released Jun 2026.",
      "lesson": "Use warm-up and comparable-depth sample requirements before pruning; treat bracket-level pruning as different from study-level termination.",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "zhengkid/AutoTTS",
      "url": "https://github.com/zhengkid/AutoTTS",
      "stars": "~169",
      "what": "2026 agentic test-time-scaling controller search with trend/momentum stopping, coupled width-depth allocation, and conservative branch abandonment; 4 commits and no releases.",
      "lesson": "Use confidence momentum and persistent disagreement instead of one-round spikes, while preserving a minimum active branch cohort.",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/budget-cost", "deep-improvement"],
      "confidence": "high"
    },
    {
      "name": "Xieyangxinyu/reasoning_uncertainty",
      "url": "https://github.com/Xieyangxinyu/reasoning_uncertainty",
      "stars": "~1",
      "what": "Reproduction code for 2026 statistical early stopping using renewal and Maxwise/conformal rules; 2 commits, no releases, latest commit date not surfaced.",
      "lesson": "Calibrate false-premature-stop risk and report FPR, power, calibration split, alpha, and token savings instead of exposing only a patience value.",
      "maps_to": ["runtime/convergence", "runtime/gauges-observability", "deep-research", "deep-review"],
      "confidence": "med"
    },
    {
      "name": "QianJaneXie/CostAwareStoppingBayesOpt",
      "url": "https://github.com/QianJaneXie/CostAwareStoppingBayesOpt",
      "stars": "~4",
      "what": "Code for cost-aware Bayesian optimization stopping with PBGI and LogEIPC, heterogeneous evaluation costs, and convergence baselines; 311 commits, no releases, latest commit date not surfaced.",
      "lesson": "Replace fixed no-gain patience with a cost-aware reservation value for the best remaining evaluator or branch.",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/fan-out-fan-in", "deep-research"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Model branch selection as fixed-confidence best-arm identification: allocate work toward competitive challengers and stop only when a time-uniform likelihood or confidence boundary separates the leader.",
      "evidence": "https://proceedings.mlr.press/v49/garivier16a.html; https://arxiv.org/abs/1808.03204",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/budget-cost", "deep-ai-council"],
      "confidence": "high"
    },
    {
      "insight": "For asynchronous fan-in, certify that unfinished branches cannot overturn the current result by bounding future vote movement; record the certificate as a margin against a full-budget counterfactual.",
      "evidence": "https://arxiv.org/abs/2510.17472; https://arxiv.org/abs/2606.12935",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/gauges-observability", "deep-ai-council"],
      "confidence": "med"
    },
    {
      "insight": "Use two calibrated stopping risks: premature confidence and continued work without sufficient progress. A lower progress boundary is needed for hard or unsolvable instances.",
      "evidence": "https://arxiv.org/abs/2602.03814",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/gauges-observability", "deep-research", "deep-review"],
      "confidence": "high"
    },
    {
      "insight": "Sequential stopping should calibrate false-stop risk from trace data and preserve alpha, calibration split, power, and shift diagnostics; SW-UCB threshold adaptation is useful but is not itself a correctness certificate.",
      "evidence": "https://arxiv.org/abs/2602.13935; https://aclanthology.org/2026.acl-long.1256/",
      "maps_to": ["runtime/convergence", "runtime/gauges-observability", "runtime/continuity-threading", "deep-research", "deep-review"],
      "confidence": "high"
    },
    {
      "insight": "Formalize diminishing returns as maximum expected marginal utility per cost, optionally backed by adaptive-submodularity or weak-submodularity tests; stop when no available action clears the reservation value.",
      "evidence": "https://arxiv.org/abs/2507.12453; https://proceedings.mlr.press/v134/esfandiari21a.html",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "deep-research"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "A stable majority proves the answer is correct.",
      "counter": "The available certificates concern the modal sampling distribution or agreement with the full-budget vote, not ground-truth correctness.",
      "evidence": "https://arxiv.org/abs/2510.17472; https://arxiv.org/abs/2606.12935"
    },
    {
      "claim": "A confidence threshold alone is sufficient for adaptive stopping.",
      "counter": "Confidence-only rules can spend the full budget on unsolvable cases; a separately calibrated progress or lower-risk boundary is required.",
      "evidence": "https://arxiv.org/abs/2602.03814"
    },
    {
      "claim": "Plateau patience is a convergence proof.",
      "counter": "Patience and percentile pruning are heuristics unless their observations, dependence structure, and error risks are calibrated; unequal-depth branches can make them aggressively misleading.",
      "evidence": "https://optuna.readthedocs.io/en/stable/reference/generated/optuna.pruners.HyperbandPruner.html; https://arxiv.org/abs/2602.13935"
    }
  ],
  "next_angles": [
    "Estimate adaptive-submodularity or weak-submodularity ratios for novelty, evidence coverage, and verifier utility on existing JSONL traces.",
    "Fault-inject correlated, nonstationary, and evaluator-drifted branches to compare Track-and-Stop, martingale certificates, bootstrap bounds, and heuristic patience.",
    "Implement separate branch-prune and parent-stop decisions under asynchronous fan-in, including retries and duplicate observations.",
    "Calibrate two-sided stopping thresholds under domain shift and report false-stop rate, wasted-budget rate, and coverage by stop reason."
  ],
  "notes": "Public agent repositories still mostly expose heuristic stopping; formal guarantees live primarily in bandit, conformal, Bayesian-optimization, and sequential-inference literature. The main transfer risk is violated iid/exchangeability, correlated branches, evaluator drift, and selection over many candidate rules. GitHub star counts are snapshots from this search."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: read-only
reasoning effort: max
reasoning summaries: none
session id: 019f62c3-9290-77a3-9b27-d08ccc0f2354
--------
user
You are iteration 17/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Convergence math & formal stopping rules
DIRECTIVE: Bandit stopping, sequential testing, proof-of-convergence, diminishing-returns formalisms in agent/search loops. Map to runtime/convergence.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (76) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo)
Insights so far: 80; contradictions logged: 45.
Open threads prior iterations flagged: [runtime/convergence + runtime/gauges-observability] Benchmark false positives from stuck detectors against productive polling, retries, and interactive shell sessions using semantic signatures plus filesystem/test deltas. | [runtime/budget-cost] Measure expected gain per dollar for provider retry, parser requery, same-task continuation, fresh attempt, and alternate-model branching. | [runtime/state-jsonl-checkpointing + runtime/locks-recovery] Fault-inject executor loss between command dispatch and observation receipt; test idempotent replay and session reattachment. | [deep-research + runtime/convergence] Re-run ACI/tool-surface ablations across OpenHands, SWE-agent, mini-SWE-agent, and smolagents under equal model, seed, wall-time, and cache-adjusted budgets. | Implement and fault-inject a pass/fail/indeterminate verifier protocol across JSONL persistence, retries, and convergence math. | Benchmark outcome-equivalence deduplication against trajectory-similarity deduplication on semantically interchangeable agent paths. | Measure grader calibration and drift across judge models, rubric versions, parser versions, and equal evaluator-call budgets. | Adversarially test agentic graders against prompt injection in target outputs, workspaces, tool results, and generated artifacts.

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
I’m treating this as read-only research. I’ll search for newer convergence/stopping work, verify repository metadata from primary sources where possible, and map each finding to a system-deep-loop subsystem.
web search: 
web search: site:github.com sequential testing early stopping hyperparameter optimization bandit stopping repository ...
codex
The most promising new lead is a 2026 test-time-scaling controller with explicit Beta-confidence and consistency-based early stopping. I’m checking it against older bandit/HPO implementations so the transfer separates formal guarantees from heuristic patience rules.
web search: 
web search: site:github.com/zhengkid AutoTTS LLMs Improving LLMs Agentic Discovery Test-Time Scaling ...
web search: 
web search: https://github.com/google/vizier
web search: 
web search: https://api.github.com/repos/google/vizier
web search: 
web search: 
web search: 
web search: GitHub LLM test-time scaling adaptive stopping confidence early termination repository 2025 2026 ...
web search: 
web search: "Certified Self-Consistency" GitHub Martingale Majority Certificate ...
web search: 
web search: https://github.com/xidulu/reasoning_risk_control
web search: 
web search: github xidulu reasoning_risk_control ...
web search: 
web search: site:oss-vizier.readthedocs.io early stopping Vizier policy ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: site:github.com/zhengkid/AutoTTS/commits 2026 ...
web search: 
web search: Track-and-Stop Chernoff stopping rule generalized likelihood ratio beta(t delta) best arm identification ...
codex
The evidence is splitting into two distinct stopping contracts: “stop when this candidate is statistically safe” and “stop when further work has low expected value.” I’m looking for a formal diminishing-returns bridge between them, because an error-bound alone does not explain when to spend the next evaluator or branch call.
web search: 
web search: site:arxiv.org adaptive submodularity diminishing returns sequential information gathering stopping rule ...
web search: 
web search: "Cost-aware Stopping for Bayesian Optimization" GitHub ...
web search: 
web search: https://github.com/QianJaneXie/CostAwareStoppingBayesOpt
web search: 
web search: site:projecteuclid.org time-uniform Chernoff bounds nonnegative supermartingales confidence sequences Howard Ramdas McAuliffe Sekhon ...
web search: 
web search: 'Releases'
codex
The main finding is that “convergence” needs typed stopping contracts:

- `certificate_stop`: stop when a time-uniform confidence boundary proves the current winner is sufficiently separated.
- `economic_stop`: stop when the best expected gain per unit cost falls below a reservation value.
- `progress_stop`: stop when calibrated progress is too weak, catching unsolvable or stalled cases.
- `runtime_stop`: hard budget, deadline, cancellation, or replay exhaustion.

Track-and-Stop is the cleanest bandit transfer: allocate samples toward competitive branches, then stop when a Chernoff/likelihood boundary separates the leader from every challenger. Time-uniform confidence sequences make this compatible with repeated polling, but only under defensible assumptions about dependence and bounded observations. Transfer: `runtime/convergence`, `runtime/fan-out-fan-in`, `runtime/budget-cost`, `deep-ai-council`. ([Track-and-Stop](https://proceedings.mlr.press/v49/garivier16a.html), [time-uniform Chernoff bounds](https://arxiv.org/abs/1808.03204))

LLM-specific work adds a stronger fan-in rule. Certified Self-Consistency uses an anytime-valid martingale certificate; MARS bounds how much unfinished traces could change the current vote margin. Both certify a distributional property or agreement with a full-budget vote—not truth itself. Transfer: persist `leader`, `margin`, `challengers`, `boundary`, and `stop_confidence` per JSONL event. ([Certified Self-Consistency](https://arxiv.org/abs/2510.17472), [MARS](https://arxiv.org/abs/2606.12935))

Conformal Thinking exposes a missing distinction: confidence-only stopping can waste the whole budget on unsolvable inputs. Its upper threshold controls premature confident exits; its lower progress threshold controls continued reasoning with insufficient improvement. Calibrate both against a target risk with finite-sample correction. Transfer: `runtime/convergence`, `runtime/budget-cost`, `runtime/gauges-observability`, `deep-research`, `deep-review`. ([Conformal Thinking](https://arxiv.org/abs/2602.03814))

Diminishing returns is best expressed as expected marginal utility per cost, not “no change for N rounds.” Cost-aware Bayesian optimization provides a stopping rule with expected cumulative-cost guarantees; adaptive submodularity supplies approximation guarantees for batched information gathering when its assumptions hold. Transfer: choose the next branch/evaluator by estimated marginal information or quality gain per cost, and stop when every available action falls below the reservation value. ([Cost-aware stopping](https://arxiv.org/abs/2507.12453), [adaptive submodularity](https://proceedings.mlr.press/v134/esfandiari21a.html))

Operationally, Vizier separates global trial comparison from local trajectory behavior, while Optuna’s Hyperband documentation requires warm-up observations per bracket before adaptive pruning. That argues for separate branch-prune and parent-stop state machines, depth-normalized evidence, and minimum samples before pruning. ([Vizier early stopping](https://oss-vizier.readthedocs.io/en/latest/guides/developer/early_stopping.html), [Optuna Hyperband](https://optuna.readthedocs.io/en/stable/reference/generated/optuna.pruners.HyperbandPruner.html))

The hard boundary is important: runtime termination can be proven; statistical correctness can be certified only under stated assumptions; economic stopping gives efficiency or regret guarantees, not task correctness. The JSONL schema should record which contract fired and its assumptions, rather than collapsing all exits into `converged`.

```json
{
  "new_repos": [
    {
      "name": "google/vizier",
      "url": "https://github.com/google/vizier",
      "stars": "~1.7k",
      "what": "Distributed black-box optimization with an explicit early-stop policy API; recency: latest release v0.1.24 in Feb 2025, 1,236 commits, exact latest commit year not surfaced.",
      "lesson": "Separate global incumbent-vs-history pruning from local trajectory stopping and reconstruct policy state from persisted trial history.",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "optuna/optuna",
      "url": "https://github.com/optuna/optuna",
      "stars": "~14.5k",
      "what": "Mature pruning framework with median, percentile, successive-halving, Hyperband, threshold, and patient pruners; recency: v4.9.0 released Jun 2026.",
      "lesson": "Use warm-up and comparable-depth sample requirements before pruning; treat bracket-level pruning as different from study-level termination.",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "zhengkid/AutoTTS",
      "url": "https://github.com/zhengkid/AutoTTS",
      "stars": "~169",
      "what": "2026 agentic test-time-scaling controller search with trend/momentum stopping, coupled width-depth allocation, and conservative branch abandonment; 4 commits and no releases.",
      "lesson": "Use confidence momentum and persistent disagreement instead of one-round spikes, while preserving a minimum active branch cohort.",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/budget-cost", "deep-improvement"],
      "confidence": "high"
    },
    {
      "name": "Xieyangxinyu/reasoning_uncertainty",
      "url": "https://github.com/Xieyangxinyu/reasoning_uncertainty",
      "stars": "~1",
      "what": "Reproduction code for 2026 statistical early stopping using renewal and Maxwise/conformal rules; 2 commits, no releases, latest commit date not surfaced.",
      "lesson": "Calibrate false-premature-stop risk and report FPR, power, calibration split, alpha, and token savings instead of exposing only a patience value.",
      "maps_to": ["runtime/convergence", "runtime/gauges-observability", "deep-research", "deep-review"],
      "confidence": "med"
    },
    {
      "name": "QianJaneXie/CostAwareStoppingBayesOpt",
      "url": "https://github.com/QianJaneXie/CostAwareStoppingBayesOpt",
      "stars": "~4",
      "what": "Code for cost-aware Bayesian optimization stopping with PBGI and LogEIPC, heterogeneous evaluation costs, and convergence baselines; 311 commits, no releases, latest commit date not surfaced.",
      "lesson": "Replace fixed no-gain patience with a cost-aware reservation value for the best remaining evaluator or branch.",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/fan-out-fan-in", "deep-research"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Model branch selection as fixed-confidence best-arm identification: allocate work toward competitive challengers and stop only when a time-uniform likelihood or confidence boundary separates the leader.",
      "evidence": "https://proceedings.mlr.press/v49/garivier16a.html; https://arxiv.org/abs/1808.03204",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/budget-cost", "deep-ai-council"],
      "confidence": "high"
    },
    {
      "insight": "For asynchronous fan-in, certify that unfinished branches cannot overturn the current result by bounding future vote movement; record the certificate as a margin against a full-budget counterfactual.",
      "evidence": "https://arxiv.org/abs/2510.17472; https://arxiv.org/abs/2606.12935",
      "maps_to": ["runtime/convergence", "runtime/fan-out-fan-in", "runtime/gauges-observability", "deep-ai-council"],
      "confidence": "med"
    },
    {
      "insight": "Use two calibrated stopping risks: premature confidence and continued work without sufficient progress. A lower progress boundary is needed for hard or unsolvable instances.",
      "evidence": "https://arxiv.org/abs/2602.03814",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/gauges-observability", "deep-research", "deep-review"],
      "confidence": "high"
    },
    {
      "insight": "Sequential stopping should calibrate false-stop risk from trace data and preserve alpha, calibration split, power, and shift diagnostics; SW-UCB threshold adaptation is useful but is not itself a correctness certificate.",
      "evidence": "https://arxiv.org/abs/2602.13935; https://aclanthology.org/2026.acl-long.1256/",
      "maps_to": ["runtime/convergence", "runtime/gauges-observability", "runtime/continuity-threading", "deep-research", "deep-review"],
      "confidence": "high"
    },
    {
      "insight": "Formalize diminishing returns as maximum expected marginal utility per cost, optionally backed by adaptive-submodularity or weak-submodularity tests; stop when no available action clears the reservation value.",
      "evidence": "https://arxiv.org/abs/2507.12453; https://proceedings.mlr.press/v134/esfandiari21a.html",
      "maps_to": ["runtime/convergence", "runtime/budget-cost", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "deep-research"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "A stable majority proves the answer is correct.",
      "counter": "The available certificates concern the modal sampling distribution or agreement with the full-budget vote, not ground-truth correctness.",
      "evidence": "https://arxiv.org/abs/2510.17472; https://arxiv.org/abs/2606.12935"
    },
    {
      "claim": "A confidence threshold alone is sufficient for adaptive stopping.",
      "counter": "Confidence-only rules can spend the full budget on unsolvable cases; a separately calibrated progress or lower-risk boundary is required.",
      "evidence": "https://arxiv.org/abs/2602.03814"
    },
    {
      "claim": "Plateau patience is a convergence proof.",
      "counter": "Patience and percentile pruning are heuristics unless their observations, dependence structure, and error risks are calibrated; unequal-depth branches can make them aggressively misleading.",
      "evidence": "https://optuna.readthedocs.io/en/stable/reference/generated/optuna.pruners.HyperbandPruner.html; https://arxiv.org/abs/2602.13935"
    }
  ],
  "next_angles": [
    "Estimate adaptive-submodularity or weak-submodularity ratios for novelty, evidence coverage, and verifier utility on existing JSONL traces.",
    "Fault-inject correlated, nonstationary, and evaluator-drifted branches to compare Track-and-Stop, martingale certificates, bootstrap bounds, and heuristic patience.",
    "Implement separate branch-prune and parent-stop decisions under asynchronous fan-in, including retries and duplicate observations.",
    "Calibrate two-sided stopping thresholds under domain shift and report false-stop rate, wasted-budget rate, and coverage by stop reason."
  ],
  "notes": "Public agent repositories still mostly expose heuristic stopping; formal guarantees live primarily in bandit, conformal, Bayesian-optimization, and sequential-inference literature. The main transfer risk is violated iid/exchangeability, correlated branches, evaluator drift, and selection over many candidate rules. GitHub star counts are snapshots from this search."
}
```
hook: Stop
hook: Stop Completed
tokens used
206,798
