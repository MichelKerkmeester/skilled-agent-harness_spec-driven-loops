<!-- iteration 6 | model luna (gpt-5.6-luna) | angle: Multi-agent deliberation / debate | 2026-07-14T21:43:35.156Z -->

The main transfer is that council quality depends on independence, protocol, and adjudicator calibration—not raw seat count.

New coverage:

- `karpathy/llm-council`: staged independent answers → anonymous peer review → chairman synthesis. It is explicitly a prototype, but the protocol is useful for `deep-ai-council`.
- `machine-theory/lm-council`: 20-model council experiments, jury ablations, and sub-council selection. This directly supports effective-independent-judge measurement.
- `thunlp/ChatEval`: persona-conditioned referee seats with evidence-plus-score outputs.
- `S-Abdelnabi/LLM-Deliberation`: configurable cooperative, greedy, and adversarial incentives, multi-player games, metrics, and logs.
- `Henrymachiyu/Multi_Agent_Judge_Bias`: reproducible bias experiments across debate and meta-judge protocols, with raw traces.

GitHub snapshots show approximate counts of ~22.5k stars for [karpathy/llm-council](https://github.com/karpathy/llm-council), ~310 for [machine-theory/lm-council](https://github.com/machine-theory/lm-council), ~340 for [ChatEval](https://github.com/thunlp/ChatEval), ~54 for [LLM-Deliberation](https://github.com/S-Abdelnabi/LLM-Deliberation), and ~8 for [Multi_Agent_Judge_Bias](https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias). Visible commit signals are 2025, 2025, 2024, 2024, and unknown respectively.

The strongest research result is that diversity must be measured behaviorally. The [Language Model Council paper](https://arxiv.org/abs/2406.08598) studies incremental judge value with 20 models and sub-councils, while [Multi-LLM Debate](https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf) shows correlated models can create echo chambers and tyranny of the majority. A controlled study also finds intrinsic reasoning strength and group diversity dominate structural choices such as order and confidence visibility ([paper](https://arxiv.org/abs/2511.07784)).

For `system-deep-loop`, add blind-review provenance, effective-independent-seat metrics, role/incentive fidelity gauges, bias perturbation tests, minority-correction tracking, and adaptive stopping based on distributional stability rather than agreement alone. The [adaptive-stability paper](https://arxiv.org/abs/2510.12697) provides one concrete model for that stopping signal. No inspected repository combines these deliberation controls with crash-safe JSONL state, lock recovery, novelty receipts, and cost gauges.

```json
{
  "new_repos": [
    {
      "name": "karpathy/llm-council",
      "url": "https://github.com/karpathy/llm-council",
      "stars": "~22.5k",
      "what": "Three-stage local council: independent answers, anonymous cross-review/ranking, and chairman synthesis; latest visible commit 2025.",
      "lesson": "Make blind peer review a separate durable event stage, with identity reveal outside adjudication.",
      "maps_to": ["deep-ai-council", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "machine-theory/lm-council",
      "url": "https://github.com/machine-theory/lm-council",
      "stars": "~310",
      "what": "Council research toolkit covering 20-model subjective evaluation, jury ablations, leaderboards, and sub-council analysis; latest visible commit 2025.",
      "lesson": "Treat seat selection as an experimental-design problem measured by marginal information gain per cost.",
      "maps_to": ["deep-ai-council", "runtime/dedup-novelty", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "name": "thunlp/ChatEval",
      "url": "https://github.com/thunlp/ChatEval",
      "stars": "~340",
      "what": "Persona-conditioned referee team for comparing generated responses, with evidence and score outputs; latest visible commit 2024.",
      "lesson": "Give seats explicit evaluation traits and require structured evidence before scoring or synthesis.",
      "maps_to": ["deep-ai-council", "deep-review", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "S-Abdelnabi/LLM-Deliberation",
      "url": "https://github.com/S-Abdelnabi/LLM-Deliberation",
      "stars": "~54",
      "what": "Negotiation benchmark with configurable cooperative, greedy, and adversarial incentives, multi-player variants, evaluation code, and logs; latest visible commit 2024.",
      "lesson": "Model seat behavior through incentive and role-fidelity tests, including collusion and adversarial pressure.",
      "maps_to": ["deep-ai-council", "deep-alignment", "deep-research", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "Henrymachiyu/Multi_Agent_Judge_Bias",
      "url": "https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias",
      "stars": "~8",
      "what": "Official bias study with debate/meta-judge runners, raw round-by-round results, and conversation logs; 2025 paper, repository commit year not surfaced.",
      "lesson": "Make position, verbosity, chain-of-thought, and bandwagon bias regressions explicit council gates.",
      "maps_to": ["deep-ai-council", "deep-alignment", "runtime/gauges-observability", "runtime/dedup-novelty"],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Effective judge count should be estimated from behavioral independence and marginal utility, not the number of seats.",
      "evidence": "https://arxiv.org/abs/2406.08598; https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf; https://arxiv.org/abs/2511.07784",
      "maps_to": ["deep-ai-council", "runtime/dedup-novelty", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "insight": "Anonymous peer review should be persisted separately from model identity, then passed to a chairman or adjudicator as a blind evidence bundle.",
      "evidence": "https://github.com/karpathy/llm-council; https://github.com/thunlp/ChatEval",
      "maps_to": ["deep-ai-council", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Seat diversity needs incentive and role-fidelity tests; cooperation, competition, and malicious behavior are distinct deliberation regimes.",
      "evidence": "https://arxiv.org/abs/2309.17234; https://github.com/S-Abdelnabi/LLM-Deliberation",
      "maps_to": ["deep-ai-council", "deep-alignment", "deep-research", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Consensus is not a sufficient adjudication signal: debate can amplify position, verbosity, chain-of-thought, and bandwagon biases, while meta-judge protocols may resist them differently.",
      "evidence": "https://arxiv.org/abs/2505.19477; https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias",
      "maps_to": ["deep-ai-council", "deep-alignment", "runtime/gauges-observability", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "insight": "Debate termination should use stability of verdict distributions and unresolved minority evidence, not fixed rounds or raw agreement.",
      "evidence": "https://arxiv.org/abs/2510.12697; https://arxiv.org/abs/2305.19118",
      "maps_to": ["deep-ai-council", "runtime/convergence", "runtime/budget-cost"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "[deep-ai-council, runtime/dedup-novelty] More seats and debate rounds should monotonically improve reliability.",
      "counter": "Correlated seats can form echo chambers; later debate can amplify shared misconceptions or existing judge bias.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf; https://arxiv.org/abs/2505.19477"
    },
    {
      "claim": "[deep-ai-council, deep-alignment, runtime/gauges-observability] Anonymous reviewing is enough to make adjudication unbiased.",
      "counter": "Anonymity can reduce model-name favoritism, but does not remove order, verbosity, chain-of-thought, or bandwagon effects.",
      "evidence": "https://github.com/karpathy/llm-council; https://arxiv.org/abs/2505.19477"
    },
    {
      "claim": "[deep-ai-council, runtime/convergence] Majority consensus is a safe stopping signal.",
      "counter": "Majority pressure can suppress independent correction; a correct minority may require an explicit challenge or sentinel path.",
      "evidence": "https://arxiv.org/abs/2511.07784; https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf"
    }
  ],
  "next_angles": [
    "deep-ai-council/runtime/dedup-novelty: Estimate effective independent judge count under shared model families, prompts, providers, and RAG evidence.",
    "deep-ai-council/runtime/gauges-observability: Compare blind versus attributed review with order swaps, identity leaks, and confidence masking.",
    "deep-ai-council/runtime/convergence/runtime/budget-cost: Compare fixed-round debate, stability-based stopping, and minority-sentinel escalation under equal budgets.",
    "deep-ai-council/deep-alignment/runtime/continuity-threading: Fault-inject collusive or malicious seats that poison shared evidence and test quarantine and revalidation.",
    "deep-ai-council/deep-review: Compare majority vote, blind peer ranking, meta-judge selection, and evidence-weighted adjudication on the same debate traces."
  ],
  "notes": "The inspected repos are mostly research or prototype artifacts. I did not find one that combines debate adjudication with crash-safe JSONL checkpoints, lock recovery, novelty receipts, and cost gauges; the bias repository's commit year was not verifiable from the fetched GitHub history."
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
session id: 019f6291-5e06-76b2-adbb-afb2b6c80aa0
--------
user
You are iteration 6/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Multi-agent deliberation / debate
DIRECTIVE: Debate, mixture-of-agents, seat diversity, adjudication. Map to deep-ai-council.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (25) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement
Insights so far: 25; contradictions logged: 15.
Open threads prior iterations flagged: runtime/locks-recovery + runtime/state-jsonl-checkpointing: fault-inject a crash after an adversarial attack executes but before its verdict and novelty receipt append; verify idempotent resume. | deep-ai-council + runtime/dedup-novelty: estimate effective independent judge count across model families, prompts, temperatures, and shared training data. | deep-improvement + runtime/convergence: compare free-form critique, structured edit plans, and tool-verified patches; accept only when held-out checks improve without regressions. | deep-alignment + runtime/gauges-observability: build a judge calibration suite covering order swaps, false premises, long-form consistency, adversarial judge injection, and confidence calibration. | deep-improvement/runtime/continuity-threading: fault-inject poisoned, stale, and incorrectly attributed memory deltas; test quarantine, expiry, rollback, and revalidation. | runtime/fan-out-fan-in/runtime/budget-cost: compare linear Self-Refine, ToT BFS, GoT merges, and LATS-style MCTS under one fixed token and tool-call budget. | deep-research/runtime/dedup-novelty: measure positive transfer versus cross-task interference when reflective lessons move between research questions, reviews, and coding tasks. | runtime/state-jsonl-checkpointing/runtime/gauges-observability: benchmark whether event-level observation/action/reflection provenance improves recovery after crashes between tool execution and memory promotion.

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
This is a research-only pass, so I’ll broaden the multi-agent deliberation/debate coverage with live primary sources, verify each repository’s URL/stars/recency, and map every finding to a system-deep-loop target. I’ll avoid the 25 already catalogued repositories.
web search: 
web search: site:github.com multi-agent debate framework agent council adjudicator repository ...
web search: 
web search: GitHub AgentsCourt court debate simulation legal knowledge augmentation ...
web search: 
web search: https://github.com/thunlp/ChatEval
web search: 
web search: 
web search: 
web search: https://api.github.com/repos/thunlp/ChatEval
web search: 
web search: https://github.com/thunlp/ChatEval/commits/main/
web search: 
web search: 
web search: 
web search: site:github.com/Henrymachiyu/Multi_Agent_Judge_Bias/commits "Commits on" ...
web search: 
web search: https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias/commits/main.atom
web search: 
web search: GitHub LLM council multi-model debate judge repository ...
web search: 
web search: https://github.com/karpathy/llm-council
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/machine-theory/lm-council/commits/main/
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://arxiv.org/abs/2511.07784
web search: 
web search: https://arxiv.org/abs/2510.12697
web search: 
web search: https://arxiv.org/abs/2308.07201
web search: 
web search: 
web search: 
web search: site:github.com/Henrymachiyu/Multi_Agent_Judge_Bias/commit/ Henrymachiyu 2025 ...
codex
The main transfer is that council quality depends on independence, protocol, and adjudicator calibration—not raw seat count.

New coverage:

- `karpathy/llm-council`: staged independent answers → anonymous peer review → chairman synthesis. It is explicitly a prototype, but the protocol is useful for `deep-ai-council`.
- `machine-theory/lm-council`: 20-model council experiments, jury ablations, and sub-council selection. This directly supports effective-independent-judge measurement.
- `thunlp/ChatEval`: persona-conditioned referee seats with evidence-plus-score outputs.
- `S-Abdelnabi/LLM-Deliberation`: configurable cooperative, greedy, and adversarial incentives, multi-player games, metrics, and logs.
- `Henrymachiyu/Multi_Agent_Judge_Bias`: reproducible bias experiments across debate and meta-judge protocols, with raw traces.

GitHub snapshots show approximate counts of ~22.5k stars for [karpathy/llm-council](https://github.com/karpathy/llm-council), ~310 for [machine-theory/lm-council](https://github.com/machine-theory/lm-council), ~340 for [ChatEval](https://github.com/thunlp/ChatEval), ~54 for [LLM-Deliberation](https://github.com/S-Abdelnabi/LLM-Deliberation), and ~8 for [Multi_Agent_Judge_Bias](https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias). Visible commit signals are 2025, 2025, 2024, 2024, and unknown respectively.

The strongest research result is that diversity must be measured behaviorally. The [Language Model Council paper](https://arxiv.org/abs/2406.08598) studies incremental judge value with 20 models and sub-councils, while [Multi-LLM Debate](https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf) shows correlated models can create echo chambers and tyranny of the majority. A controlled study also finds intrinsic reasoning strength and group diversity dominate structural choices such as order and confidence visibility ([paper](https://arxiv.org/abs/2511.07784)).

For `system-deep-loop`, add blind-review provenance, effective-independent-seat metrics, role/incentive fidelity gauges, bias perturbation tests, minority-correction tracking, and adaptive stopping based on distributional stability rather than agreement alone. The [adaptive-stability paper](https://arxiv.org/abs/2510.12697) provides one concrete model for that stopping signal. No inspected repository combines these deliberation controls with crash-safe JSONL state, lock recovery, novelty receipts, and cost gauges.

```json
{
  "new_repos": [
    {
      "name": "karpathy/llm-council",
      "url": "https://github.com/karpathy/llm-council",
      "stars": "~22.5k",
      "what": "Three-stage local council: independent answers, anonymous cross-review/ranking, and chairman synthesis; latest visible commit 2025.",
      "lesson": "Make blind peer review a separate durable event stage, with identity reveal outside adjudication.",
      "maps_to": ["deep-ai-council", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "machine-theory/lm-council",
      "url": "https://github.com/machine-theory/lm-council",
      "stars": "~310",
      "what": "Council research toolkit covering 20-model subjective evaluation, jury ablations, leaderboards, and sub-council analysis; latest visible commit 2025.",
      "lesson": "Treat seat selection as an experimental-design problem measured by marginal information gain per cost.",
      "maps_to": ["deep-ai-council", "runtime/dedup-novelty", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "name": "thunlp/ChatEval",
      "url": "https://github.com/thunlp/ChatEval",
      "stars": "~340",
      "what": "Persona-conditioned referee team for comparing generated responses, with evidence and score outputs; latest visible commit 2024.",
      "lesson": "Give seats explicit evaluation traits and require structured evidence before scoring or synthesis.",
      "maps_to": ["deep-ai-council", "deep-review", "runtime/fan-out-fan-in", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "S-Abdelnabi/LLM-Deliberation",
      "url": "https://github.com/S-Abdelnabi/LLM-Deliberation",
      "stars": "~54",
      "what": "Negotiation benchmark with configurable cooperative, greedy, and adversarial incentives, multi-player variants, evaluation code, and logs; latest visible commit 2024.",
      "lesson": "Model seat behavior through incentive and role-fidelity tests, including collusion and adversarial pressure.",
      "maps_to": ["deep-ai-council", "deep-alignment", "deep-research", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "name": "Henrymachiyu/Multi_Agent_Judge_Bias",
      "url": "https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias",
      "stars": "~8",
      "what": "Official bias study with debate/meta-judge runners, raw round-by-round results, and conversation logs; 2025 paper, repository commit year not surfaced.",
      "lesson": "Make position, verbosity, chain-of-thought, and bandwagon bias regressions explicit council gates.",
      "maps_to": ["deep-ai-council", "deep-alignment", "runtime/gauges-observability", "runtime/dedup-novelty"],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Effective judge count should be estimated from behavioral independence and marginal utility, not the number of seats.",
      "evidence": "https://arxiv.org/abs/2406.08598; https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf; https://arxiv.org/abs/2511.07784",
      "maps_to": ["deep-ai-council", "runtime/dedup-novelty", "runtime/budget-cost", "runtime/fan-out-fan-in"],
      "confidence": "high"
    },
    {
      "insight": "Anonymous peer review should be persisted separately from model identity, then passed to a chairman or adjudicator as a blind evidence bundle.",
      "evidence": "https://github.com/karpathy/llm-council; https://github.com/thunlp/ChatEval",
      "maps_to": ["deep-ai-council", "runtime/state-jsonl-checkpointing", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Seat diversity needs incentive and role-fidelity tests; cooperation, competition, and malicious behavior are distinct deliberation regimes.",
      "evidence": "https://arxiv.org/abs/2309.17234; https://github.com/S-Abdelnabi/LLM-Deliberation",
      "maps_to": ["deep-ai-council", "deep-alignment", "deep-research", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Consensus is not a sufficient adjudication signal: debate can amplify position, verbosity, chain-of-thought, and bandwagon biases, while meta-judge protocols may resist them differently.",
      "evidence": "https://arxiv.org/abs/2505.19477; https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias",
      "maps_to": ["deep-ai-council", "deep-alignment", "runtime/gauges-observability", "runtime/dedup-novelty"],
      "confidence": "high"
    },
    {
      "insight": "Debate termination should use stability of verdict distributions and unresolved minority evidence, not fixed rounds or raw agreement.",
      "evidence": "https://arxiv.org/abs/2510.12697; https://arxiv.org/abs/2305.19118",
      "maps_to": ["deep-ai-council", "runtime/convergence", "runtime/budget-cost"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "[deep-ai-council, runtime/dedup-novelty] More seats and debate rounds should monotonically improve reliability.",
      "counter": "Correlated seats can form echo chambers; later debate can amplify shared misconceptions or existing judge bias.",
      "evidence": "https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf; https://arxiv.org/abs/2505.19477"
    },
    {
      "claim": "[deep-ai-council, deep-alignment, runtime/gauges-observability] Anonymous reviewing is enough to make adjudication unbiased.",
      "counter": "Anonymity can reduce model-name favoritism, but does not remove order, verbosity, chain-of-thought, or bandwagon effects.",
      "evidence": "https://github.com/karpathy/llm-council; https://arxiv.org/abs/2505.19477"
    },
    {
      "claim": "[deep-ai-council, runtime/convergence] Majority consensus is a safe stopping signal.",
      "counter": "Majority pressure can suppress independent correction; a correct minority may require an explicit challenge or sentinel path.",
      "evidence": "https://arxiv.org/abs/2511.07784; https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6c6acf1afbf2bf82b614ad-Paper-Conference.pdf"
    }
  ],
  "next_angles": [
    "deep-ai-council/runtime/dedup-novelty: Estimate effective independent judge count under shared model families, prompts, providers, and RAG evidence.",
    "deep-ai-council/runtime/gauges-observability: Compare blind versus attributed review with order swaps, identity leaks, and confidence masking.",
    "deep-ai-council/runtime/convergence/runtime/budget-cost: Compare fixed-round debate, stability-based stopping, and minority-sentinel escalation under equal budgets.",
    "deep-ai-council/deep-alignment/runtime/continuity-threading: Fault-inject collusive or malicious seats that poison shared evidence and test quarantine and revalidation.",
    "deep-ai-council/deep-review: Compare majority vote, blind peer ranking, meta-judge selection, and evidence-weighted adjudication on the same debate traces."
  ],
  "notes": "The inspected repos are mostly research or prototype artifacts. I did not find one that combines debate adjudication with crash-safe JSONL checkpoints, lock recovery, novelty receipts, and cost gauges; the bias repository's commit year was not verifiable from the fetched GitHub history."
}
```
hook: Stop
hook: Stop Completed
tokens used
211,647
