<!-- iteration 42 | model glm (zai-coding-plan/glm-5.2) | angle: Benchmark/eval-driven improvement loops | 2026-07-15T00:37:57.276Z -->

I'll research eval-driven improvement loops — systems that automatically close the loop from evaluation results back into agent/prompt/model improvement. Let me search for real repos not already in the 195 catalogued.
TRL verified (~18.8k stars, v1.8.0 Jul 2026). I also spotted the literal "ralph-loop" appearing in the GitHub `eval-driven-development` topic description — a strong signal. Let me verify the Azure-Samples repo, NVIDIA Eureka (LLM-as-reward-designer closed loop), and open-compass.
Three solid hits. Let me verify two more closed-loop candidates: ChatDev (code→test→review loop) and search for automated red-teaming/eval-driven robustness loops, plus AgentTuning.
## Analysis — Iteration 42: Benchmark/eval-driven improvement loops

I verified five repos (none in the prior 195) that close the loop from eval → improvement, each illuminating a different closure mechanism.

**The two strongest "auto-close-the-loop" engines:**
- **`eureka-research/Eureka`** (~3.2k★, ICLR 2024) is the canonical LLM-as-improver loop: fan-out generates N candidate reward functions, each is *executed in a real RL environment* to get a ground-truth fitness score, then in-context evolutionary reflection mutates the next generation. Knobs are tiny and explicit (`sample=16 iteration=5`). The crucial transferable property: the evaluator is **environment execution, not an LLM-judge** — it sidesteps the LLM-as-judge failure modes prior iterations flagged. Maps cleanly to deep-improvement + runtime/fan-out-fan-in + runtime/convergence.
- **`huggingface/trl`** (~18.8k★, v1.8.0 Jul 2026) just shipped "environment-owned rewards" + per-example environment selection in `GRPOTrainer`: the scoring function is owned by the *evaluated target*, not the loop driver, and multiple sandboxed suites mix in one run. This is exactly the decoupling deep-alignment's "named-authority owns the scoring" needs.

**Two-loop architecture (ChatDev):** `OpenBMB/ChatDev` (~33.7k★, v2.2.0 Mar 2026, NeurIPS 2025) runs *two* improvement loops at different layers — (a) artifact-level code→test→review, and (b) **Puppeteer**, a *learnable RL-optimized central orchestrator* that improves the *fan-out routing itself* across episodes (meta-improvement). Its **IER** experience lifecycle has an explicit *elimination* operator (acquisition→utilization→propagation→**elimination**) — the first concrete answer to the open thread on memory decay/pruning for accumulated knowledge.

**The eval-harness baseline + the methodology signal:** `open-compass/opencompass` (~7.2k★) gives the composable-evaluator pattern (`CascadeEvaluator` = sequential evaluator DAG, `GenericLLMEvaluator` = LLM-judge as first-class stage) for graceful degradation. And the GitHub `eval-driven-development` topic description literally lists **"ralph-loop"** alongside "quality-gates"/"plan-lifecycle" — field-level confirmation that the degenerate naive-while-loop re-invoker (an open thread) is now a *named, recognized anti-pattern*, with EDD's measurement-gated admission (20+ cases, multi-run variance) as the named corrective.

**Sharpest contradiction:** the EDD community and the Eureka community both say "eval-driven" but mean opposite things — EDD = eval-as-*gate* (regression prevention, deep-review), Eureka = eval-as-*fitness* (search/optimization, deep-improvement). system-deep-loop must not conflate them: the two subsystems need *different evaluator contracts* (held-out test suite vs environment-execution reward).

```json
{
  "new_repos": [
    {"name":"eureka-research/Eureka","url":"https://github.com/eureka-research/Eureka","stars":"~3.2k","what":"LLM in-context evolutionary optimization over reward code: fan-out N candidates, eval via real RL-environment fitness, reflect, iterate (ICLR 2024).","lesson":"Make the evaluator environment-execution (ground-truth fitness), not an LLM-judge; expose tiny explicit knobs (sample N, iteration K) and feed fitness back as in-context mutation.","maps_to":["deep-improvement","runtime/fan-out-fan-in","runtime/convergence"],"confidence":"high"},
    {"name":"huggingface/trl","url":"https://github.com/huggingface/trl","stars":"~18.8k","what":"RL post-training loop; GRPOTrainer now supports environment-owned rewards + per-example environment selection across mixed sandboxed suites (v1.8.0, Jul 2026).","lesson":"Own the scoring in the evaluated environment, not the loop driver; let multiple evaluator suites coexist in one run so loop control is decoupled from eval semantics.","maps_to":["deep-improvement","deep-alignment","runtime/gauges-observability"],"confidence":"high"},
    {"name":"OpenBMB/ChatDev","url":"https://github.com/OpenBMB/ChatDev","stars":"~33.7k","what":"Virtual software co. (code->test->review) plus Puppeteer (NeurIPS 2025): a learnable RL-optimized orchestrator improving fan-out routing; IER experience lifecycle has explicit elimination operator.","lesson":"Run a second, slower improvement loop over the fan-out/fan-in policy itself (meta-improvement); give the accumulated experience store an elimination/decay gate, not only dedup.","maps_to":["deep-improvement","deep-review","runtime/fan-out-fan-in","runtime/dedup-novelty"],"confidence":"high"},
    {"name":"open-compass/opencompass","url":"https://github.com/open-compass/opencompass","stars":"~7.2k","what":"LLM eval platform; CascadeEvaluator composes sequential evaluator stages, GenericLLMEvaluator makes LLM-judge a first-class stage alongside rule-based (v0.5.3, Jun 2026).","lesson":"Build deep-review's evaluator as a composable sequential DAG (rule fast-path -> LLM-judge fallback -> human) that can short-circuit per stage for graceful degradation.","maps_to":["deep-review","runtime/gauges-observability"],"confidence":"high"},
    {"name":"Azure-Samples/eval-driven-agents","url":"https://github.com/Azure-Samples/eval-driven-agents","stars":"~3","what":"Reference implementation of eval-driven development: continuous eval + tracing/telemetry gated through GitHub-Actions CI/CD so every change must clear metrics to merge.","lesson":"The merge gate itself is the convergence certificate; map CI/CD-gated eval to runtime/locks-recovery + continuity-threading (admit an iteration only when eval deltas clear threshold with multi-run variance).","maps_to":["deep-review","runtime/gauges-observability","runtime/locks-recovery"],"confidence":"high"}
  ],
  "insights": [
    {"insight":"Evaluator-as-environment-execution vs evaluator-as-LLM-judge: Eureka beats human experts on 83% of tasks using ground-truth RL fitness, not a judge. When judge reliability is suspect, swap in an executable evaluator (run the test, read the metric) as the fitness function for deep-improvement.","evidence":"eureka-research/Eureka README + arXiv 2310.12931","maps_to":["deep-improvement","runtime/convergence"],"confidence":"high"},
    {"insight":"Two-layer improvement: ChatDev runs an artifact-level loop (code->test->review) AND a meta-loop (Puppeteer) that RL-optimizes the orchestrator's agent-routing/sequencing. system-deep-loop should improve its own fan-out policy across episodes, not only the artifacts.","evidence":"OpenBMB/ChatDev puppeteer branch, arXiv 2505.19591 (NeurIPS 2025)","maps_to":["deep-improvement","runtime/fan-out-fan-in"],"confidence":"high"},
    {"insight":"IER's experience lifecycle has an explicit ELIMINATION operator (acquisition->utilization->propagation->elimination) — the first concrete mechanism for the open thread on memory decay/pruning. Accumulation needs a forgetting policy, not just dedup.","evidence":"OpenBMB/ChatDev, arXiv 2405.04219","maps_to":["runtime/dedup-novelty","runtime/continuity-threading"],"confidence":"high"},
    {"insight":"'eval-driven' is overloaded: EDD means eval-as-GATE (regression prevention, held-out suite) while Eureka means eval-as-FITNESS (search signal, environment reward). deep-review and deep-improvement must use different evaluator contracts; conflating them produces a judge-gated search that neither prevents regressions nor optimizes well.","evidence":"Azure-Samples/eval-driven-agents README vs eureka-research/Eureka README","maps_to":["deep-review","deep-improvement"],"confidence":"high"},
    {"insight":"The 'ralph-loop' (naive bash while-loop re-invoking a coding agent with only max-iterations + test-pass as stop) is now a NAMED community anti-pattern: GitHub's eval-driven-development topic lists it beside quality-gates/plan-lifecycle. The named corrective is measurement-gated admission with multi-run variance, not a smarter stop condition alone.","evidence":"github.com/topics/eval-driven-development topic description (verbatim)","maps_to":["runtime/convergence","runtime/budget-cost","deep-review"],"confidence":"high"}
  ],
  "contradictions": [
    {"claim":"EDD guidance (Anthropic-derived, echoed by Red Hat/Lushbinary/Medium) says evaluation is THE outer loop driving every choice — always-on, measurement-gated, eval-first.","counter":"Eureka achieves human-level reward design with eval as a fitness signal inside evolutionary search, NOT as a held-out gate — and its eval is environment execution, not a test suite.","evidence":"Azure-Samples/eval-driven-agents README vs eureka-research/Eureka README (arXiv 2310.12931)"},
    {"claim":"ChatDev Puppeteer: a learnable RL-optimized central orchestrator improves multi-agent collaboration AND reduces computational cost.","counter":"An RL-learned orchestrator is itself a loop that must converge; it inherits the SICA path-dependence / multi-seed variance problem (open thread), so 'reduces cost' is conditional on the meta-loop having converged — exactly the unsolved problem.","evidence":"arXiv 2505.19591 vs prior debate-hurts / path-dependence findings"}
  ],
  "next_angles": [
    "Environment-owned reward as a contract pattern: catalog systems where the eval function is supplied by the evaluated target (TRL envs, Eureka sim, SWE-bench test specs) vs externally-imposed judges — the trust boundary that makes loops safe.",
    "Meta-loop convergence criteria: Puppeteer/RL-orchestrator and SkillOpt-style meta-improvement need their OWN stopping rule — borrow policy-gradient variance estimation / ensemble-of-policies agreement to decide when the orchestrator policy has converged.",
    "Elimination/decay operators for accumulated knowledge graphs: formalize a forgetting policy (retention vs recency vs degree) combining IER-elimination, the CRDT/bi-temporal and synaptic-homeostasis open threads.",
    "Adversarial closed-loop (attack->eval->defend->re-eval): the red-teaming iterate loop lives under 'adversarial training'/'PAIR'/'wildteamings' terminology, not 'closed loop' — worth a dedicated angle for robustness improvement loops."
  ],
  "notes": "Could not verify AgentGym/AgentTrek (both 404'd — likely renamed/merged into AgentTuning or moved off GitHub; excluded rather than guessed). Red-teaming 'closed loop' phrasing returned zero search hits; the attack/defend iterate loop almost certainly exists under different terms (adversarial training, PAIR, wildteamings) and is a genuine coverage gap. Azure-Samples/eval-driven-agents is real but very low traction (~3 stars, 14 commits) — included for its canonical methodology framing, not influence. TRL/Eureka/OpenCompass/ChatDev star counts and recency all verified directly from GitHub on 2026-07-15."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m✗ [0mWebFetch https://github.com/thudm/AgentGym failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/thudm/AgentGym)
[0m✗ [0mWebFetch https://github.com/OpenBMB/AgentTrek failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/OpenBMB/AgentTrek)
[0m% [0mWebFetch https://duckduckgo.com/html/?q=github+%22eval-driven%22+self-improving+agent+repository+loop+benchmark+optimize
[0m% [0mWebFetch https://github.com/huggingface/trl
[0m% [0mWebFetch https://github.com/open-compass/opencompass
[0m% [0mWebFetch https://github.com/eureka-research/Eureka
[0m% [0mWebFetch https://github.com/Azure-Samples/eval-driven-agents
[0m% [0mWebFetch https://github.com/OpenBMB/ChatDev
[0m% [0mWebFetch https://duckduckgo.com/html/?q=github+automated+red-teaming+%22closed+loop%22+LLM+improve+robustness+attack+defend+iterate+repository
