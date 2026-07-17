<!-- iteration 36 | model glm (zai-coding-plan/glm-5.2) | angle: Loop engineering in RL / agent research (non-framework lens) | 2026-07-15T00:16:59.600Z -->

I'll research RL/agent training loops, self-play, curriculum, and absolute-zero reasoning that could inform iterative agent systems. Let me search for real, current work.
Let me search more specifically for these RL/agent research projects.
Found AZR (1.9k stars, 2025). Now let me find curriculum learning, self-play, and RL loop repos.
Good finds. Now let me search for veRL, DAPO, and self-play/curriculum-specific repos.
Excellent finds. Let me verify RAGEN and verl-agent, which appeared as verl ecosystem projects.
I have rich findings. Let me synthesize the analysis.

## Analysis: RL/Agent Loop Engineering → system-deep-loop

**What I found:** Five repos in the RL training ecosystem that implement loop control patterns directly transferable to system-deep-loop's iterative runtime. None were in the prior 166-repo catalogue.

**1. AZR (LeapLabTHU/Absolute-Zero-Reasoner, 1.9k stars, 2025/06)** implements a PROPOSE→SOLVE self-play loop where the reward isn't "did you solve it" but **learnability** — measured by pass-rate delta between the model's attempts before and after training on a self-proposed task. Tasks that don't improve the model get zero reward, even if they're correct. This is a meta-convergence signal: the loop rewards iterations that produce *learnable* findings, not just correct ones. AZR also ships pluggable intrinsic rewards for diversity and complexity. Transfer: deep-improvement's convergence detection should track whether each iteration's findings actually improve downstream performance, not just whether they're novel.

**2. RAGEN-2 (mll-lab-nu/RAGEN, 2.7k stars, 2026/03)** diagnoses **template collapse** — a failure mode where the agent appears to generate diverse reasoning (high entropy) but actually produces input-agnostic templates (low mutual information I(X;Z)). They decompose reasoning quality into within-input diversity (conditional entropy H(Z|X)) and cross-input distinguishability (MI), yielding four regimes. Their **SNR-adaptive filtering** uses reward variance as a lightweight proxy to skip low-signal iterations (zero variance = no learning signal = waste of budget). Transfer: deep-loop's dedup/novelty gauge is blind to template collapse — a loop can report "high diversity" while repeating the same template across different inputs. The MI decomposition and variance-based filtering are directly portable.

**3. verl-agent (langfengQ/verl-agent, 2.1k stars, 2026/05, NeurIPS 2025)** introduces **GiGPO** (Group-in-Group Policy Optimization): two-level credit assignment for long-horizon agent loops. Episode-level groups capture overall task success; step-level groups gather repeated states *across trajectories* to compute per-action advantages. Critically, verl-agent uses **step-independent multi-turn rollout** with a customizable memory module — each step's input is reconstructed from a concise history summary rather than concatenating the full trajectory. This keeps context length near-constant over 30-50 step horizons. Transfer: deep-loop's fan-out should support nested grouping (iteration-level + sub-task-level), and the memory module pattern maps to runtime/state-jsonl-checkpointing for long-horizon loops.

**4. verl (verl-project/verl, 22.5k stars, 2026/06)** ships experimental modules `fully_async_policy`, `one_step_off_policy`, and `transfer_queue` that explicitly manage the staleness boundary between async generation and training. The `one_step_off_policy` approach allows exactly one step of staleness — a bounded off-policy window. The transfer_queue buffers and orders stale samples. Transfer: deep-loop's async fan-out needs an explicit staleness bound — parallel iterations that start from state S may commit after state S+1 is live. The one-step window + transfer queue is a concrete pattern for runtime/locks-recovery.

**5. OpenRLHF (OpenRLHF/OpenRLHF, 9.8k stars, 2026/04)** implements **off-policy correction** via importance sampling with token-level clamping (TIS) or token-level filtering (ICEPOP). When async rollouts are off-policy (generated with stale weights), the IS correction threshold `[low, high]` bounds how much off-policy a sample can be before it's discarded entirely. This is a quality gate for fan-out results: stale iterations aren't blindly merged — they're weighted by freshness. Transfer: deep-loop's fan-in should weight parallel iteration results by a freshness score, discarding iterations whose state has drifted beyond a threshold.

**Key contradiction:** OpenRLHF warns "async training may affect stability — use only when convergence is validated," while verl ships `fully_async_policy` as production-ready. The resolution is the correction mechanism: verl bounds staleness to one step + uses a transfer queue; OpenRLHF's `async_queue_size` is tunable but unbounded by default. This maps to a design tension in deep-loop: async fan-out increases throughput but risks merging stale/contradictory findings. The RL ecosystem's answer is bounded staleness + IS-based weighting, not "async is safe" or "async is unsafe."

```json
{
  "new_repos": [
    {
      "name": "LeapLabTHU/Absolute-Zero-Reasoner",
      "url": "https://github.com/LeapLabTHU/Absolute-Zero-Reasoner",
      "stars": "~1.9k",
      "what": "Self-play reasoning loop (PROPOSE→SOLVE) with learnability reward — tasks rewarded only if they improve the model, not just if correct",
      "lesson": "Convergence signal should measure downstream performance delta (did this iteration actually help?), not just output correctness or novelty",
      "maps_to": ["deep-improvement", "runtime/convergence", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "name": "mll-lab-nu/RAGEN",
      "url": "https://github.com/mll-lab-nu/RAGEN",
      "stars": "~2.7k",
      "what": "StarPO agent RL framework with template-collapse diagnostics (MI proxy H(Z|X) vs I(X;Z)) and SNR-adaptive filtering by reward variance",
      "lesson": "Diversity metrics based on entropy alone miss template collapse — decompose into within-iteration diversity and cross-iteration distinguishability; skip zero-variance iterations to save budget",
      "maps_to": ["runtime/dedup-novelty", "runtime/gauges-observability", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "langfengQ/verl-agent",
      "url": "https://github.com/langfengQ/verl-agent",
      "stars": "~2.1k",
      "what": "GiGPO: two-level credit assignment (episode-level + step-level groups) for long-horizon agent RL; step-independent rollout with customizable memory module keeping context constant over 30-50 steps",
      "lesson": "Nested grouping for fan-out (iteration-level + sub-task-level) and memory-module pattern for checkpointing long-horizon loops without unbounded context growth",
      "maps_to": ["runtime/fan-out-fan-in", "runtime/state-jsonl-checkpointing", "deep-improvement"],
      "confidence": "high"
    },
    {
      "name": "verl-project/verl",
      "url": "https://github.com/verl-project/verl",
      "stars": "~22.5k",
      "what": "HybridFlow RL library with experimental fully_async_policy, one_step_off_policy, and transfer_queue modules for bounded-staleness async RL",
      "lesson": "Async fan-out needs an explicit staleness bound (one-step window) plus a transfer queue that buffers and orders stale samples before merge",
      "maps_to": ["runtime/fan-out-fan-in", "runtime/locks-recovery", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "OpenRLHF/OpenRLHF",
      "url": "https://github.com/OpenRLHF/OpenRLHF",
      "stars": "~9.8k",
      "what": "RLHF framework with off-policy correction (TIS token-clamp / ICEPOP token-filter) via importance sampling thresholds [low,high] for async rollouts",
      "lesson": "Fan-in should weight parallel results by a freshness/importance-sampling score and discard iterations whose state drift exceeds a bounded threshold",
      "maps_to": ["runtime/fan-out-fan-in", "runtime/convergence", "runtime/dedup-novelty"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Learnability reward: score each iteration by whether its findings improve downstream task performance (pass-rate delta), not by correctness or novelty alone. Iterations that produce correct-but-non-transferable findings get zero reward.",
      "evidence": "LeapLabTHU/Absolute-Zero-Reasoner PROPOSE→SOLVE loop with learnability reward (arxiv 2505.03335)",
      "maps_to": ["deep-improvement", "runtime/convergence"],
      "confidence": "high"
    },
    {
      "insight": "Template collapse detection: decompose novelty into within-iteration diversity (conditional entropy H(Z|X)) and cross-iteration distinguishability (mutual information I(X;Z)). High entropy + low MI = the loop is generating diverse-looking but input-agnostic templates — invisible to entropy-only gauges.",
      "evidence": "mll-lab-nu/RAGEN RAGEN-2 four reasoning regimes (arxiv 2604.06268)",
      "maps_to": ["runtime/dedup-novelty", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "SNR-adaptive budget filtering: use reward-variance as a lightweight proxy to skip low-signal iterations before committing full compute. Zero-variance iterations (all rollouts agree) carry no learning signal and should be short-circuited.",
      "evidence": "mll-lab-nu/RAGEN SNR-Adaptive Filtering (top-p and top-k modes)",
      "maps_to": ["runtime/budget-cost", "runtime/convergence"],
      "confidence": "high"
    },
    {
      "insight": "Bounded off-policy window for async fan-out: allow exactly N steps of staleness between when a parallel iteration starts and when its results are merged, with importance-sampling correction weighting stale results. Beyond the threshold, discard rather than merge.",
      "evidence": "verl-project/verl one_step_off_policy + transfer_queue; OpenRLHF TIS/ICEPOP IS correction thresholds",
      "maps_to": ["runtime/fan-out-fan-in", "runtime/locks-recovery"],
      "confidence": "high"
    },
    {
      "insight": "Nested group credit assignment: for multi-step agent loops, compute advantages at two levels — episode-level (did the whole iteration succeed?) and step-level (was this particular sub-action better than alternatives at the same state?). This enables fine-grained quality scoring without a critic.",
      "evidence": "langfengQ/verl-agent GiGPO two-level grouping (NeurIPS 2025, arxiv 2505.10978)",
      "maps_to": ["runtime/fan-out-fan-in", "deep-improvement"],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Async RL training is production-ready and safe for use",
      "counter": "Async training may affect stability — use only when throughput is critical and convergence is validated",
      "evidence": "verl ships fully_async_policy as production feature vs OpenRLHF README warning about async stability; resolution is bounded staleness (verl one_step_off_policy) vs unbounded queue (OpenRLHF async_queue_size default)"
    },
    {
      "claim": "Zero external data is needed for self-play reasoning improvement",
      "counter": "AZR still requires seed datasets (data/ directory with prompted seeds) and improvements are highly model-dependent (Llama3.1 +3.2 vs Qwen2.5-14B-Coder +13.2 total avg)",
      "evidence": "LeapLabTHU/Absolute-Zero-Reasoner README seeding section + results table showing model-dependent gains"
    },
    {
      "claim": "Maintaining high entropy prevents reasoning collapse",
      "counter": "Template collapse occurs with high entropy — the model generates diverse-looking but input-agnostic reasoning. Entropy is necessary but insufficient; mutual information I(X;Z) is the missing axis.",
      "evidence": "RAGEN-2 template collapse diagnostics showing high H(Z|X) + low I(X;Z) regime"
    }
  ],
  "next_angles": [
    "Formalize a learnability score for deep-improvement iterations: measure downstream task pass-rate delta before/after incorporating each iteration's findings, and use it as a convergence signal alongside novelty",
    "Implement MI-based template collapse detection in deep-loop's novelty gauge: track both within-iteration diversity and cross-iteration distinguishability to catch the high-entropy-but-templated failure mode",
    "Design a bounded-staleness protocol for async fan-out: define a max-drift threshold (analogous to one_step_off_policy) and an IS-correction weighting scheme for merging stale parallel results",
    "Explore nested group evaluation for deep-review: episode-level scoring (did the review pass?) combined with step-level scoring (was each finding valid at its code location?) for critic-free quality assignment",
    "Map SNR-adaptive filtering to deep-loop budget control: skip iterations where all parallel rollouts produce identical-signal findings (zero variance) to save compute without losing coverage"
  ],
  "notes": "RL training ecosystem is the richest source of loop-engineering patterns found so far — it has formal solutions for staleness (bounded off-policy windows), collapse detection (MI decomposition), budget filtering (variance-based SNR), and credit assignment (nested groups). Coverage gap: no repo formally connects RL convergence theory (regret bounds, sample complexity) to LLM agent loop termination criteria. Also missing: formal analysis of when self-play (AZR-style) degenerates versus converges — the 'zero data' framing obscures the bootstrapping dependency."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m✗ [0mWebFetch https://github.com/Andrew-Zhou/absolute_zero_reasoner failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/Andrew-Zhou/absolute_zero_reasoner)
[0m% [0mWebFetch https://github.com/search?q=absolute+zero+reasoner+RL&type=repositories
[0m% [0mWebFetch https://www.google.com/search?q=%22absolute+zero+reasoner%22+github+repo+RL+self-play
[0m% [0mWebFetch https://github.com/LeapLabTHU/Absolute-Zero-Reasoner
[0m% [0mWebFetch https://www.google.com/search?q=curriculum+learning+LLM+self-play+github+2025+intrinsic+reward+diversity
[0m% [0mWebFetch https://github.com/huggingface/trl
[0m% [0mWebFetch https://github.com/OpenRLHF/OpenRLHF
[0m% [0mWebFetch https://www.google.com/search?q=%22self-play%22+%22curriculum%22+LLM+agent+intrinsic+motivation+github+repo+2025
[0m✗ [0mWebFetch https://github.com/BytedanceResearch/DAPO failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/BytedanceResearch/DAPO)
[0m% [0mWebFetch https://github.com/volcengine/verl
[0m% [0mWebFetch https://github.com/langfengQ/verl-agent
[0m% [0mWebFetch https://github.com/ZihanWang314/ragen
