<!-- iteration 43 | model glm (zai-coding-plan/glm-5.2) | angle: Alignment / critique / safety loops | 2026-07-15T00:41:11.415Z -->

I'll research alignment/critique/safety loops. Let me search for real repos in this specific niche.
These are mostly low-star tutorials. Let me find the authoritative safety-loop frameworks (PyRIT, garak, HarmBench, PAIR).
garak (8.4k), HarmBench (1k), and PyRIT (moved to microsoft/) confirmed. Let me verify the iterative attack-loop repos PAIR and TAP, and check the canonical microsoft/PyRIT.
Strong set. Now let me add the defensive/oversight side: reward-model critique (RewardBench) and sandwiching oversight (weak-to-strong), to complement the attack loops.
All six verified. Writing the analysis.

## Alignment / critique / safety loops — iteration 43/45

**What I found.** The safety/alignment-critique niche splits cleanly into three loop archetypes, each with a canonical maintained OSS implementation that was absent from the prior 200:

1. **Red-team iterate loops (attack→judge→refine).** `microsoft/PyRIT` (4.1k, v0.14.0 Jun 2026), `NVIDIA/garak` (8.4k, v0.15.1 Jun 2026), `RICommunity/TAP` (239), and `patrickrchao/JailbreakingLLMs`/PAIR (754) are the field's reference loops. `centerforaisafety/HarmBench` (1k) is the eval harness that ties them together and adds an **adversarial-training/defense** half — the attack↔defend co-development loop.
2. **Reward-model critique (RLAIF).** `allenai/reward-bench` (726, RewardBench 2 Jun 2025) is the meta-eval: it benchmarks the *judge* itself, including **offline ensembling** of reward models and odd-count generative-judge majorities.
3. **Scalable oversight / sandwiching.** `openai/weak-to-strong` (2.5k, archived May 2026) is the loop where a weak supervisor labels a stronger model — the deceptive-finding / superalignment lineage.

**Why it transfers to system-deep-loop.**
- **TAP's two-phase pruning is the cleanest convergent fan-out/fan-in I've seen:** Phase 1 prunes off-topic candidates *before* the expensive target call; Phase 2 keeps top-k by evaluator score. This is exactly the runtime/fan-out-fan-in + runtime/budget-cost seam deep-loop needs — *prune cheap before expensive, keep top-k, bound depth/width/branching*. Better than PAIR's flat iteration.
- **garak's 5-role split** (probe / detector / harness / evaluator / generator) shows the seam between "detector" (checks one specific failure) and "evaluator" (scores/reports) is load-bearing. deep-alignment/deep-review conflate critic+verifier+harness; garak proves they're separable plugin interfaces.
- **HarmBench ships two independent judges** (a main classifier *and* a held-out validation classifier) — the "environment-owned reward" open thread made concrete: the trust boundary is "is the judge itself attackable?"
- **weak-to-strong's confidence auxiliary loss** is the critical caveat: a stronger model naively imitating weak labels *degrades* (sycophancy) unless an explicit anti-overconfidence regularizer is applied — a direct warning for deep-ai-council (don't over-anchor to the first/weak seat).

```json
{
  "new_repos": [
    {"name":"NVIDIA/garak","url":"https://github.com/NVIDIA/garak","stars":"~8.4k","what":"LLM vulnerability scanner: probe/detector/harness/evaluator/generator plugin architecture (nmap for LLMs)","lesson":"Clean 5-role separation of generator-vs-detector-vs-orchestrator-vs-scorer-vs-target; deep-loop conflates these into one 'critic' and that is the evaluator-reliability root cause. Each is an independently swappable plugin with a base class.","maps_to":["deep-alignment","deep-review","runtime/gauges-observability"],"confidence":"high"},
    {"name":"microsoft/PyRIT","url":"https://github.com/microsoft/PyRIT","stars":"~4.1k","what":"Goal-based multi-turn red-team orchestrator that persists cross-turn conversation memory of which attacks already failed","lesson":"Externalized-state checkpointing applied to the critique dimension: accumulated memory is 'what attacks failed' = a dedup/novelty signal over the attack/search space, not over document content. v0.14.0 Jun 2026.","maps_to":["deep-alignment","runtime/state-jsonl-checkpointing","runtime/dedup-novelty"],"confidence":"high"},
    {"name":"RICommunity/TAP","url":"https://github.com/RICommunity/TAP","stars":"~239","what":"Tree of Attacks with Pruning: branch -> prune-phase-1(off-topic,before target call) -> attack&assess -> prune-phase-2(keep top-k by evaluator score); depth/width/branching params","lesson":"Canonical convergent fan-out/fan-in: prune CHEAP before EXPENSIVE, keep top-k by score, bound all three tree dimensions. Beats PAIR's flat iteration; directly transferable to deep-loop fan-out+convergence+budget as a single parameterized loop.","maps_to":["runtime/fan-out-fan-in","runtime/convergence","runtime/budget-cost"],"confidence":"high"},
    {"name":"centerforaisafety/HarmBench","url":"https://github.com/centerforaisafety/HarmBench","stars":"~1k","what":"Standardized red-team eval pipeline (gen test cases -> merge -> gen completions -> eval) PLUS adversarial_training/ defense half; ships TWO independent judge classifiers (main + held-out validation)","lesson":"Attack<->defend co-development loop with a held-out validation judge = the 'environment-owned reward' contract made concrete. Trust boundary is 'is the judge itself attackable?', so a second independent judge is mandatory, not optional.","maps_to":["deep-improvement","deep-alignment","runtime/dedup-novelty"],"confidence":"high"},
    {"name":"openai/weak-to-strong","url":"https://github.com/openai/weak-to-strong","stars":"~2.5k","what":"Sandwiching/scalable-oversight loop: weak supervisor labels a stronger model; sweep.py over capability-gap pairs; confidence auxiliary loss","lesson":"Naive imitation of a weak critic DEGRADES the stronger model (sycophancy); requires an explicit anti-overconfidence regularizer. Direct warning: deep-ai-council must penalize over-anchoring to the first/weak seat, and capability-in-the-loop is NOT monotonic.","maps_to":["deep-ai-council","runtime/convergence","deep-improvement"],"confidence":"high"},
    {"name":"allenai/reward-bench","url":"https://github.com/allenai/reward-bench","stars":"~726","what":"Meta-eval that benchmarks reward models (the critic) themselves; offline RM ensembling; generative-judge ensembles require an ODD count>1 for majority vote; RewardBench 2 Jun 2025","lesson":"'Who validates the validator' made operational: ensemble critics with odd seat counts so ties are impossible, and treat any residual tie as 'no convergence' not 'pick one'.","maps_to":["deep-ai-council","runtime/convergence","runtime/dedup-novelty"],"confidence":"high"}
  ],
  "insights": [
    {"insight":"Prune cheap before expensive, then keep top-k by score: the two-phase pruning fan-out/fan-in (TAP) is the formally parameterized version of what deep-loop's runtime/fan-out-fan-in needs. Phase 1 = off-topic/novelty filter (cheap, pre-target-call); Phase 2 = top-k retention by the evaluator. Both phases are prunable => the loop is convergent by construction, not by luck.","evidence":"RICommunity/TAP (arXiv:2312.02119), branch/prune/assess/prune loop","maps_to":["runtime/fan-out-fan-in","runtime/convergence","runtime/budget-cost"],"confidence":"high"},
    {"insight":"A critique/debate loop needs an explicit anti-sycophancy regularizer, not just more capable participants. Without it, a strong model optimizing a weak critic's score will degrade below the critic's own performance (the weak-to-strong gap goes negative). This is the formal counterexample to 'more capability in the loop monotonically improves'.","evidence":"openai/weak-to-strong confidence auxiliary loss; naive-imitation degradation result","maps_to":["deep-ai-council","runtime/convergence","deep-improvement"],"confidence":"high"},
    {"insight":"Separate 'detector' (checks ONE specific failure mode) from 'evaluator' (aggregates/scores/reports) as distinct plugin interfaces. garak's whole extensibility comes from this seam; deep-loop's single 'critic' role is why evaluator reliability is a flagged failure mode.","evidence":"NVIDIA/garak garak/detectors vs garak/evaluators vs garak/harnesses base classes","maps_to":["deep-alignment","deep-review","runtime/gauges-observability"],"confidence":"high"},
    {"insight":"Adversarial critique loops show diminishing returns FAST (PAIR converges in <20 queries; TAP >80% at small depth), and aggressive fan-out+pruning beats more depth. This contradicts the 'increase depth for better results' heuristic: for safety/robustness discovery, BREADTH-with-pruning dominates DEPTH-with-refinement.","evidence":"PAIR (arXiv:2310.08419) <20 queries; TAP depth/width results","maps_to":["runtime/budget-cost","runtime/fan-out-fan-in","runtime/convergence"],"confidence":"med"},
    {"insight":"Ship two independent judges and treat disagreement between them as a signal, not noise: HarmBench's main+validation-classifier pair is the cheapest 'is the judge itself compromised' detector. For deep-review/deep-alignment, run the verifier through a second model and gate on agreement.","evidence":"centerforaisafety/HarmBench cais/HarmBench-Llama-2-13b-cls + cais/HarmBench-Mistral-7b-val-cls","maps_to":["deep-review","deep-alignment","runtime/dedup-novelty"],"confidence":"med"}
  ],
  "contradictions": [
    {"claim":"Adding a more capable model/participant to a critique loop monotonically improves output quality (assumption behind deep-improvement & deep-ai-council).","counter":"Weak-to-strong: a stronger model naively trained on weaker-model labels can UNDERPERFORM the weak supervisor (negative transfer / sycophancy) unless an anti-overconfidence auxiliary loss is added.","evidence":"openai/weak-to-strong, confidence-loss result; arXiv:2312.09390"},
    {"claim":"To improve loop results, increase iteration depth (refine the same candidate further).","counter":"Red-team iterate loops (PAIR/TAP) show success saturates within ~20 queries and that aggressive fan-out-with-pruning at shallow depth beats deeper refinement.","evidence":"PAIR arXiv:2310.08419; TAP arXiv:2312.02119 depth/width ablations"},
    {"claim":"A single LLM-as-judge is a sufficient evaluator/critic inside a loop.","counter":"HarmBench & RewardBench both ship/require a SECOND held-out judge (validation classifier / ensemble) because the primary judge is itself attackable and reward models over-optimizable; single-judge loops Goodhart their own metric.","evidence":"HarmBench validation classifier; RewardBench RM ensembling + over-optimization literature (Gao 2022)"}
  ],
  "next_angles": [
    "Specification-gaming / reward-hacking detection as a LOOP OUTPUT: when does the loop itself start gaming its own success metric? Catalog the reward-model over-optimization scaling laws (Gao et al 2022, measurable kappa) as a budget/gauge for deep-improvement, plus sycophancy-detection loops.",
    "Scalable-oversight via DEBATE (Irving AI-safety-via-debate, market-making/myopic-RL) implementations distinct from red-teaming: the loop where two agents argue and a human/judge picks, with truth-tracking guarantees. Look for maintained OSS beyond papers.",
    "Calibrated ABSTENTION ('I don't know') as a loop-termination signal: critique loops whose critic can refuse to score instead of always emitting a number; abstention-rate as a convergence/freshness gauge and as a human-escalation trigger.",
    "Self-repair / self-correction loops that PROVE they fixed a defect vs claim to (red-team->patch->re-red-team closed loop with regression guard) — borrow from fuzzing/hardening loops (OSS-Fuzz/AFL regression mode) mapped onto agent outputs."
  ],
  "notes": "Two real gaps surfaced: (1) Constitutional AI has NO authoritative maintained OSS implementation — all 17 GitHub hits are 0-star tutorials; Anthropic never released one, so deep-alignment is implementing a paper-only loop with no reference to validate against. (2) The 'specification gaming / reward hacking' angle has strong papers (Gao 2022, sycophancy) but no canonical maintained OSS loop repo — worth a dedicated next iteration. PAIR (754 stars) was folded into TAP as insight evidence since TAP supersedes it architecturally; both verified live. Note weak-to-strong and the Azure/PyRIT mirror are archived but canonical."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m✗ [0mWebFetch https://github.com/LLM-Tuning-Safety/llm discussions failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/LLM-Tuning-Safety/llm discussions)
[0m% [0mWebFetch https://github.com/search?q=constitutional+ai+critique&type=repositories
[0m% [0mWebFetch https://github.com/Azure/PyRIT
[0m% [0mWebFetch https://github.com/leondz/garak
[0m% [0mWebFetch https://github.com/centerforaisafety/HarmBench
[0m% [0mWebFetch https://github.com/microsoft/PyRIT
[0m% [0mWebFetch https://github.com/RICommunity/TAP
[0m% [0mWebFetch https://github.com/patrickrchao/JailbreakingLLMs
[0m% [0mWebFetch https://github.com/allenai/reward-bench
[0m% [0mWebFetch https://github.com/openai/weak-to-strong
