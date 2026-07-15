<!-- iteration 1 | model luna (gpt-5.6-luna) | angle: Loop control & termination policies | 2026-07-14T21:17:34.588Z -->

The state of the art is asymmetric: production runtimes mostly combine hard caps with repeated-pattern guards, while semantic saturation and deliberate broadening remain less mature. A robust `system-deep-loop` controller should layer all four: progress, quality, pathology, and resource limits.

- [Q00/ouroboros](https://github.com/Q00/ouroboros) is the closest match to a convergence runtime: weighted ontology similarity, stagnation, period-2 oscillation, repetitive feedback, drift measurement, checkpoints, and a 30-generation cap. Its separation of termination signals transfers directly to `runtime/convergence` and `runtime/gauges-observability`.
- [OpenHands/software-agent-sdk](https://github.com/OpenHands/software-agent-sdk) has a concrete [Stuck Detector](https://docs.openhands.dev/sdk/guides/agent-stuck-detector) and [source implementation](https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/stuck_detector.py). It detects exact action/observation repeats, repeated errors, monologues, context failures, and alternating cycles while ignoring volatile IDs and metrics.
- [strongdm/attractor](https://github.com/strongdm/attractor) is a design specification rather than a full runtime. Its [coding-agent loop spec](https://github.com/strongdm/attractor/blob/main/coding-agent-loop-spec.md) treats loop detection as an observable control event that can inject steering before termination, alongside independent turn, round, and abort limits.
- [AIDASLab/MATA](https://github.com/AIDASLab/MATA), documented in its [ACL 2026 paper](https://aclanthology.org/2026.findings-acl.1672/), uses execution success, multi-metric similarity, confidence, and branch agreement. It skips redundant reasoning paths when outputs agree and expands only when disagreement or low confidence justifies the cost.
- [egmaminta/GEPA-Lite](https://github.com/egmaminta/GEPA-Lite) demonstrates broadening through exploit/explore/merge strategies, Pareto selection, mini-batch non-regression gates, and fixed query budgets. Its own limitations are informative: no archive or diversity penalty yet, and early stopping is still future work.

Two papers sharpen the design. [Semantic Early-Stopping](https://arxiv.org/abs/2606.27009) proposes a halt cascade combining semantic delta, patience, quality signals, and an unconditional maximum; its evaluation is small, so treat the reported token savings as directional. [IAL-Scan](https://arxiv.org/abs/2607.01641) argues that a bound is only safe when it covers the entire repeated feedback path, including retries, handoffs, re-entry, and state growth.

The practical transfer is a bifurcated policy: convergence loops need semantic/quality plateau detection, while broadening loops need Pareto-front preservation and novelty-rate or hypervolume saturation. Both need path-aware oscillation detection and an unconditional budget ceiling.

```json
{
  "new_repos": [
    {
      "name": "Q00/ouroboros",
      "url": "https://github.com/Q00/ouroboros",
      "stars": "~4.9k (GitHub snapshot)",
      "what": "Agent OS with weighted ontology convergence at >=0.95, three-generation stagnation, period-2 oscillation, repetitive-feedback detection, checkpoints, and a 30-generation cap; latest release v0.50.4 on 2026-07-14.",
      "lesson": "Use separate semantic stabilization, repetition, oscillation, drift, and hard-cap signals instead of one convergence score.",
      "maps_to": [
        "runtime/convergence",
        "runtime/dedup-novelty",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "med"
    },
    {
      "name": "OpenHands/software-agent-sdk",
      "url": "https://github.com/OpenHands/software-agent-sdk",
      "stars": "~900 (GitHub snapshot)",
      "what": "SDK with a default StuckDetector for repeated action-observation pairs, repeated errors, monologues, alternating cycles, and context-window loops; latest release v1.36.0 on 2026-07-13.",
      "lesson": "Compare normalized event content while ignoring volatile IDs, and detect both exact repeats and period-2 alternation within a bounded active-branch window.",
      "maps_to": [
        "runtime/convergence",
        "runtime/dedup-novelty",
        "runtime/gauges-observability",
        "runtime/locks-recovery",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "name": "strongdm/attractor",
      "url": "https://github.com/strongdm/attractor",
      "stars": "~1.2k (GitHub snapshot)",
      "what": "Language-agnostic coding-agent loop specification; no releases, with the latest visible commit on 2026-03-17.",
      "lesson": "Make loop detection an observable control event that can steer the next turn, while retaining independent round, turn, and abort bounds.",
      "maps_to": [
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "name": "AIDASLab/MATA",
      "url": "https://github.com/AIDASLab/MATA",
      "stars": "~3 (GitHub snapshot)",
      "what": "ACL 2026 multi-agent TableQA implementation; no releases, 75 commits, and an ACL 2026 paper/repository signal, with exact latest commit date not exposed.",
      "lesson": "Gate expensive branches by confidence and agreement: skip redundant paths on agreement, escalate on disagreement or low confidence, and stop refinement on multi-metric convergence or successful execution.",
      "maps_to": [
        "runtime/convergence",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "deep-ai-council",
        "deep-research"
      ],
      "confidence": "high"
    },
    {
      "name": "egmaminta/GEPA-Lite",
      "url": "https://github.com/egmaminta/GEPA-Lite",
      "stars": "~56 (GitHub snapshot)",
      "what": "Small GEPA prompt-evolution implementation; no releases, two commits, and a GitHub 2025 update signal.",
      "lesson": "For deliberate broadening, preserve a non-dominated Pareto pool, mix exploit/explore/merge, gate global evaluation with mini-batch non-regression, and spend full budget only on promising mutants.",
      "maps_to": [
        "deep-research",
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Use a halt cascade: explicit success or critic approval, semantic-delta plateau with patience, quality or marginal-gain plateau, then unconditional Tmax; implement the cascade once as a pure function so live execution, replay, and post-hoc reasons cannot diverge.",
      "evidence": "https://arxiv.org/abs/2606.27009",
      "maps_to": [
        "runtime/convergence",
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    },
    {
      "insight": "Oscillation detection should operate on normalized action-observation events, not raw text or IDs: exact repeats, repeated errors, agent monologues, and period-2 alternation are distinct gauges with separate thresholds.",
      "evidence": "https://docs.openhands.dev/sdk/guides/agent-stuck-detector and https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/stuck_detector.py",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "insight": "Divergent research should avoid pruning by a single scalar too early: retain a Pareto frontier, use controlled exploration and merge, and define saturation over frontier novelty or hypervolume rather than only best-score improvement.",
      "evidence": "https://github.com/egmaminta/GEPA-Lite",
      "maps_to": [
        "deep-research",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "med"
    },
    {
      "insight": "Make fan-in budget-aware: if candidates or paths agree, skip redundant branches; if they disagree or confidence is low, expand the branch set or invoke the expensive judge. This is conditional widening, not fixed fan-out.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1672/ and https://github.com/AIDASLab/MATA",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "deep-ai-council",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "A loop is safe only when a bound covers the entire repeated feedback path, including retries, handoffs, tool re-entry, and state growth; a max-iterations setting elsewhere is not sufficient.",
      "evidence": "https://arxiv.org/abs/2607.01641",
      "maps_to": [
        "runtime/locks-recovery",
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Semantic similarity or stability is sufficient to declare convergence.",
      "counter": "A loop can converge to a stable but wrong answer; semantic stopping needs quality, critic, execution, or confidence signals.",
      "evidence": "https://arxiv.org/abs/2606.27009; https://aclanthology.org/2026.findings-acl.1672/"
    },
    {
      "claim": "A global iteration or token cap is an adequate termination policy.",
      "counter": "Caps are progress-blind, and a bound may fail to cover the actual repeated feedback path.",
      "evidence": "https://arxiv.org/abs/2606.27009; https://arxiv.org/abs/2607.01641; https://github.com/strongdm/attractor/blob/main/coding-agent-loop-spec.md"
    },
    {
      "claim": "More iterations or branches are monotonically better.",
      "counter": "MATA reports that most refinements finish in one or two rounds, while GEPA-Lite uses non-regression gates because additional mutations can create churn.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1672/; https://github.com/egmaminta/GEPA-Lite"
    }
  ],
  "next_angles": [
    "Calibrate thresholds by task phase, model, and tool class so legitimate polling is not mistaken for pathological repetition.",
    "Add frontier saturation metrics: novelty rate, Pareto-front coverage or hypervolume, and marginal gain per token.",
    "Design recovery transitions after loop detection: steering injection, strategy or model change, rollback to the last good JSONL checkpoint, or escalation.",
    "Build a static bound-coverage checker over system-deep-loop event graphs, including fan-out, fan-in, retries, and re-entry paths.",
    "Benchmark semantic convergence against stable but incorrect answers to quantify false-positive stopping."
  ],
  "notes": "Most discovered systems are either cap-plus-verifier or pattern-guard runtimes, or task-specific optimizers. Few combine semantic saturation, calibrated quality, oscillation detection, Pareto broadening, and durable JSONL recovery in one runtime. MATA and GEPA-Lite thresholds are domain-specific; OpenHands and Attractor detect repetition but do not measure value gain. Exact latest commit dates were unavailable for MATA and GEPA-Lite; star counts are approximate snapshots."
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
session id: 019f6278-6981-7402-bf43-6a17d51124a2
--------
user
You are iteration 1/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Loop control & termination policies
DIRECTIVE: Find repos/frameworks implementing convergence vs divergent/broaden stopping, novelty/saturation stopping, diminishing-returns and oscillation detection. Map to runtime/convergence.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (0) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  (none yet)
Angles already covered: (none yet)
Insights so far: 0; contradictions logged: 0.

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
Research mode: I’ll verify current repositories and papers, avoid the empty prior catalog, and map each finding to a concrete `system-deep-loop` subsystem. I’ll also separate verified metadata from low-confidence gaps.
web search: 
web search: GitHub agent loop convergence termination novelty saturation diminishing returns oscillation detection framework ...
web search: 
web search: site:github.com "diminishing returns" agent loop ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 'stagnation'
web search: 
web search: https://github.com/strongdm/attractor
web search: 
web search: site:github.com/strongdm/attractor "Latest commit" 2026 ...
web search: 
web search: 
web search: 
web search: https://github.com/egmaminta/GEPA-Lite/commits/main/
web search: 
web search: 
web search: 
web search: "IAL-Scan" GitHub ...
web search: 
web search: site:microsoft.github.io/autogen stable termination conditions MaxMessageTermination TokenUsageTermination ...
web search: 
web search: https://github.com/dakshjain-1616/agentic-loop-stability-eval
web search: 
web search: 'repetition'
web search: 
web search: GitHub LLM agent loop detector repeated tool calls hash oscillation ...
web search: 
web search: https://github.com/agent-protocol/adk-golang
web search: 
web search: https://github.com/All-Hands-AI/OpenHands
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/OpenHands/software-agent-sdk
web search: 
web search: https://arxiv.org/abs/2604.02035
web search: 
web search: https://github.com/AIDASLab/MATA
web search: 
web search: 'Early stopping'
web search: 
web search: 
web search: 
web search: site:github.com/AIDASLab/MATA/commits "2026" ...
web search: 
web search: https://api.github.com/repos/egmaminta/GEPA-Lite/commits?per_page=1
web search: 
web search: "egmaminta/GEPA-Lite" "committed" ...
context compacted
codex
The state of the art is asymmetric: production runtimes mostly combine hard caps with repeated-pattern guards, while semantic saturation and deliberate broadening remain less mature. A robust `system-deep-loop` controller should layer all four: progress, quality, pathology, and resource limits.

- [Q00/ouroboros](https://github.com/Q00/ouroboros) is the closest match to a convergence runtime: weighted ontology similarity, stagnation, period-2 oscillation, repetitive feedback, drift measurement, checkpoints, and a 30-generation cap. Its separation of termination signals transfers directly to `runtime/convergence` and `runtime/gauges-observability`.
- [OpenHands/software-agent-sdk](https://github.com/OpenHands/software-agent-sdk) has a concrete [Stuck Detector](https://docs.openhands.dev/sdk/guides/agent-stuck-detector) and [source implementation](https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/stuck_detector.py). It detects exact action/observation repeats, repeated errors, monologues, context failures, and alternating cycles while ignoring volatile IDs and metrics.
- [strongdm/attractor](https://github.com/strongdm/attractor) is a design specification rather than a full runtime. Its [coding-agent loop spec](https://github.com/strongdm/attractor/blob/main/coding-agent-loop-spec.md) treats loop detection as an observable control event that can inject steering before termination, alongside independent turn, round, and abort limits.
- [AIDASLab/MATA](https://github.com/AIDASLab/MATA), documented in its [ACL 2026 paper](https://aclanthology.org/2026.findings-acl.1672/), uses execution success, multi-metric similarity, confidence, and branch agreement. It skips redundant reasoning paths when outputs agree and expands only when disagreement or low confidence justifies the cost.
- [egmaminta/GEPA-Lite](https://github.com/egmaminta/GEPA-Lite) demonstrates broadening through exploit/explore/merge strategies, Pareto selection, mini-batch non-regression gates, and fixed query budgets. Its own limitations are informative: no archive or diversity penalty yet, and early stopping is still future work.

Two papers sharpen the design. [Semantic Early-Stopping](https://arxiv.org/abs/2606.27009) proposes a halt cascade combining semantic delta, patience, quality signals, and an unconditional maximum; its evaluation is small, so treat the reported token savings as directional. [IAL-Scan](https://arxiv.org/abs/2607.01641) argues that a bound is only safe when it covers the entire repeated feedback path, including retries, handoffs, re-entry, and state growth.

The practical transfer is a bifurcated policy: convergence loops need semantic/quality plateau detection, while broadening loops need Pareto-front preservation and novelty-rate or hypervolume saturation. Both need path-aware oscillation detection and an unconditional budget ceiling.

```json
{
  "new_repos": [
    {
      "name": "Q00/ouroboros",
      "url": "https://github.com/Q00/ouroboros",
      "stars": "~4.9k (GitHub snapshot)",
      "what": "Agent OS with weighted ontology convergence at >=0.95, three-generation stagnation, period-2 oscillation, repetitive-feedback detection, checkpoints, and a 30-generation cap; latest release v0.50.4 on 2026-07-14.",
      "lesson": "Use separate semantic stabilization, repetition, oscillation, drift, and hard-cap signals instead of one convergence score.",
      "maps_to": [
        "runtime/convergence",
        "runtime/dedup-novelty",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery"
      ],
      "confidence": "med"
    },
    {
      "name": "OpenHands/software-agent-sdk",
      "url": "https://github.com/OpenHands/software-agent-sdk",
      "stars": "~900 (GitHub snapshot)",
      "what": "SDK with a default StuckDetector for repeated action-observation pairs, repeated errors, monologues, alternating cycles, and context-window loops; latest release v1.36.0 on 2026-07-13.",
      "lesson": "Compare normalized event content while ignoring volatile IDs, and detect both exact repeats and period-2 alternation within a bounded active-branch window.",
      "maps_to": [
        "runtime/convergence",
        "runtime/dedup-novelty",
        "runtime/gauges-observability",
        "runtime/locks-recovery",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "name": "strongdm/attractor",
      "url": "https://github.com/strongdm/attractor",
      "stars": "~1.2k (GitHub snapshot)",
      "what": "Language-agnostic coding-agent loop specification; no releases, with the latest visible commit on 2026-03-17.",
      "lesson": "Make loop detection an observable control event that can steer the next turn, while retaining independent round, turn, and abort bounds.",
      "maps_to": [
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/locks-recovery",
        "runtime/state-jsonl-checkpointing",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "name": "AIDASLab/MATA",
      "url": "https://github.com/AIDASLab/MATA",
      "stars": "~3 (GitHub snapshot)",
      "what": "ACL 2026 multi-agent TableQA implementation; no releases, 75 commits, and an ACL 2026 paper/repository signal, with exact latest commit date not exposed.",
      "lesson": "Gate expensive branches by confidence and agreement: skip redundant paths on agreement, escalate on disagreement or low confidence, and stop refinement on multi-metric convergence or successful execution.",
      "maps_to": [
        "runtime/convergence",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "deep-ai-council",
        "deep-research"
      ],
      "confidence": "high"
    },
    {
      "name": "egmaminta/GEPA-Lite",
      "url": "https://github.com/egmaminta/GEPA-Lite",
      "stars": "~56 (GitHub snapshot)",
      "what": "Small GEPA prompt-evolution implementation; no releases, two commits, and a GitHub 2025 update signal.",
      "lesson": "For deliberate broadening, preserve a non-dominated Pareto pool, mix exploit/explore/merge, gate global evaluation with mini-batch non-regression, and spend full budget only on promising mutants.",
      "maps_to": [
        "deep-research",
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "med"
    }
  ],
  "insights": [
    {
      "insight": "Use a halt cascade: explicit success or critic approval, semantic-delta plateau with patience, quality or marginal-gain plateau, then unconditional Tmax; implement the cascade once as a pure function so live execution, replay, and post-hoc reasons cannot diverge.",
      "evidence": "https://arxiv.org/abs/2606.27009",
      "maps_to": [
        "runtime/convergence",
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "med"
    },
    {
      "insight": "Oscillation detection should operate on normalized action-observation events, not raw text or IDs: exact repeats, repeated errors, agent monologues, and period-2 alternation are distinct gauges with separate thresholds.",
      "evidence": "https://docs.openhands.dev/sdk/guides/agent-stuck-detector and https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/stuck_detector.py",
      "maps_to": [
        "runtime/dedup-novelty",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/locks-recovery"
      ],
      "confidence": "high"
    },
    {
      "insight": "Divergent research should avoid pruning by a single scalar too early: retain a Pareto frontier, use controlled exploration and merge, and define saturation over frontier novelty or hypervolume rather than only best-score improvement.",
      "evidence": "https://github.com/egmaminta/GEPA-Lite",
      "maps_to": [
        "deep-research",
        "runtime/fan-out-fan-in",
        "runtime/dedup-novelty",
        "runtime/convergence"
      ],
      "confidence": "med"
    },
    {
      "insight": "Make fan-in budget-aware: if candidates or paths agree, skip redundant branches; if they disagree or confidence is low, expand the branch set or invoke the expensive judge. This is conditional widening, not fixed fan-out.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1672/ and https://github.com/AIDASLab/MATA",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "deep-ai-council",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "A loop is safe only when a bound covers the entire repeated feedback path, including retries, handoffs, tool re-entry, and state growth; a max-iterations setting elsewhere is not sufficient.",
      "evidence": "https://arxiv.org/abs/2607.01641",
      "maps_to": [
        "runtime/locks-recovery",
        "runtime/budget-cost",
        "runtime/gauges-observability",
        "runtime/state-jsonl-checkpointing"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Semantic similarity or stability is sufficient to declare convergence.",
      "counter": "A loop can converge to a stable but wrong answer; semantic stopping needs quality, critic, execution, or confidence signals.",
      "evidence": "https://arxiv.org/abs/2606.27009; https://aclanthology.org/2026.findings-acl.1672/"
    },
    {
      "claim": "A global iteration or token cap is an adequate termination policy.",
      "counter": "Caps are progress-blind, and a bound may fail to cover the actual repeated feedback path.",
      "evidence": "https://arxiv.org/abs/2606.27009; https://arxiv.org/abs/2607.01641; https://github.com/strongdm/attractor/blob/main/coding-agent-loop-spec.md"
    },
    {
      "claim": "More iterations or branches are monotonically better.",
      "counter": "MATA reports that most refinements finish in one or two rounds, while GEPA-Lite uses non-regression gates because additional mutations can create churn.",
      "evidence": "https://aclanthology.org/2026.findings-acl.1672/; https://github.com/egmaminta/GEPA-Lite"
    }
  ],
  "next_angles": [
    "Calibrate thresholds by task phase, model, and tool class so legitimate polling is not mistaken for pathological repetition.",
    "Add frontier saturation metrics: novelty rate, Pareto-front coverage or hypervolume, and marginal gain per token.",
    "Design recovery transitions after loop detection: steering injection, strategy or model change, rollback to the last good JSONL checkpoint, or escalation.",
    "Build a static bound-coverage checker over system-deep-loop event graphs, including fan-out, fan-in, retries, and re-entry paths.",
    "Benchmark semantic convergence against stable but incorrect answers to quantify false-positive stopping."
  ],
  "notes": "Most discovered systems are either cap-plus-verifier or pattern-guard runtimes, or task-specific optimizers. Few combine semantic saturation, calibrated quality, oscillation detection, Pareto broadening, and durable JSONL recovery in one runtime. MATA and GEPA-Lite thresholds are domain-specific; OpenHands and Attractor detect repetition but do not measure value gain. Exact latest commit dates were unavailable for MATA and GEPA-Lite; star counts are approximate snapshots."
}
```
hook: Stop
hook: Stop Completed
tokens used
266,100
