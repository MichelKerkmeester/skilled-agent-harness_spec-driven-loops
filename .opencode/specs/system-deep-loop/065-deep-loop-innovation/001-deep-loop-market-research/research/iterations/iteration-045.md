<!-- iteration 45 | model glm (zai-coding-plan/glm-5.2) | angle: FINAL GAP-SWEEP #3: guarantee catalogue breadth | 2026-07-15T00:48:28.229Z -->

I'll verify a few candidate repos via web search before committing, since the directive forbids inventing repos/numbers. Let me batch fetches for the highest-value gaps (AI-safety-via-debate OSS, CRDT state, concurrency/locks, knowledge-editing continual, process-reward).
Two strong confirmed repos (yjs 22.2k, Netflix/concurrency-limits 3.6k, release Dec 2025) plus a confirmed negative: AI-safety-via-debate has NO major maintained OSS (only student-scale impls). Let me verify the two most relevant remaining candidates (the adaptive-stopping debate impl, and knowledge-editing for the continual-learning gap).
Confirmed 4 genuinely-new repos (all verified against the 212-item catalogue and live GitHub). Notably, the AI-safety-via-debate open thread resolves to a **confirmed negative**: no major maintained OSS exists — only student-scale implementations (one of which is nonetheless a clean adaptive-stopping reference).

**Analysis**

- **`yjs/yjs` (22.2k★, very active, multi-language ports incl. Rust/Python)** — a CRDT framework with conflict-free merge, snapshot/undo, and tombstone GC. This is the second CRDT beyond automerge and concretely prototypes the open thread "CRDT-backed externalized state": instead of a single-writer JSONL replay, the checkpoint store could be a Yjs `Y.Map` so fan-out workers merge state without locks and forget stale tombstones automatically. Pair with a redis/y-sweet backend for persistence.

- **`Netflix/concurrency-limits` (3.6k★, release v0.5.4 Dec 2025, Java)** — implements TCP congestion-control (Vegas + Gradient2) to *auto-detect* concurrency limits using latency signals and Little's Law (`Limit ≈ RPS × Latency`), with additive-increase/multiplicative-decrease and partitioned (live vs batch) guarantees. This is the first real durable-backpressure source mapped to `runtime/locks-recovery` — the AIMD control law is a self-tuning fan-out window that backs off hard on rejection/timeouts instead of a static cap. Documented tradeoff: delay-based (Vegas) drifts on bursty traffic, motivating loss-based (AIMD) — directly relevant since LLM latency is dominated by trace length, not true queuing.

- **`zjunlp/EasyEdit` (2.9k★, ACL 2024, news dated 2026-07)** — knowledge-editing framework with lifelong/continuous editing (WISE, GRACE, UltraEdit) plus **formal per-edit metrics: Reliability, Generalization, Locality, Portability** and GRACE rollback. This imports the cross-iteration correctness contract the loop has been missing: every accumulated finding must satisfy *locality* (not disturb unrelated findings) — which is the rigorous form of the regression-suite/novelty open thread — and supports *rollback* without full replay. It also documents the central contradiction: even sophisticated methods suffer "catastrophic forgetting"/edit-interference over thousands of edits, which argues *against* in-place mutation and *for* append-only+CRDT.

- **`comp-17/llm-debate-system` (0★, 34 commits, low)** — the only found implementation of Irving's AI-safety-via-debate with a concrete, floor-gated convergence rule: **min 3 rounds, stop when the same answer-pair recurs for 2 consecutive rounds; claims 30–40% API-call reduction.** Cheap, testable convergence detector — but it encodes the dangerous assumption "agreement = truth" that debate theory exists to refute, so it must be gated by a disagreement/multi-family variance gauge.

```json
{
  "new_repos": [
    {"name":"yjs/yjs","url":"https://github.com/yjs/yjs","stars":"~22.2k","what":"CRDT framework: conflict-free shared types, snapshots, undo, tombstone GC; Rust/Python/Go ports","lesson":"Prototype the JSONL checkpoint store on a Yjs Y.Map to get lock-free fan-out merge + automatic stale-tombstone forgetting in one subsystem; benchmark vs single-writer replay","maps_to":["runtime/state-jsonl-checkpointing","runtime/fan-out-fan-in","runtime/locks-recovery"],"confidence":"high"},
    {"name":"Netflix/concurrency-limits","url":"https://github.com/Netflix/concurrency-limits","stars":"~3.6k (release v0.5.4, Dec 2025)","what":"TCP congestion-control (Vegas/Gradient2 AIMD) that auto-detects concurrency limits via latency + Little's Law, with partitioned guarantees","lesson":"Replace static fan-out caps with an AIMD control law: additive-increase on success, multiplicative-decrease on rejection/timeout; use short-vs-long RTT divergence (Gradient2) as an early queuing gauge","maps_to":["runtime/locks-recovery","runtime/budget-cost","runtime/fan-out-fan-in","runtime/gauges-observability"],"confidence":"high"},
    {"name":"zjunlp/EasyEdit","url":"https://github.com/zjunlp/EasyEdit","stars":"~2.9k (ACL 2024, news Jul 2026)","what":"Knowledge-editing framework with lifelong/continuous editing (WISE, GRACE, UltraEdit), rollback, and formal Reliability/Generalization/Locality/Portability metrics","lesson":"Adopt locality+reliability+portability as the per-finding correctness contract for knowledge accumulation; locality is the rigorous form of the regression/novelty gate, and GRACE-style rollback enables reverting one finding without replay","maps_to":["runtime/dedup-novelty","runtime/state-jsonl-checkpointing","deep-review","deep-improvement"],"confidence":"high"},
    {"name":"comp-17/llm-debate-system","url":"https://github.com/comp-17/llm-debate-system","stars":"~0 (34 commits)","what":"Irving AI-safety-via-debate impl with floor-gated convergence: min 3 rounds, stop after 2 consecutive identical answer-pairs","lesson":"A cheap, testable debate-convergence rule (floor + N-consecutive-agreement) for deep-ai-council; BUT must be paired with a disagreement/variance gauge because agreement != truth","maps_to":["deep-ai-council","runtime/convergence"],"confidence":"low"}
  ],
  "insights": [
    {"insight":"Treat the fan-out window as a TCP congestion window with AIMD control: additive-increase when quality/latency hold, multiplicative-decrease on rejection/timeout, with a delay-divergence early-warning gauge (Gradient2's long-vs-short RTT average). This self-tunes budget under provider load better than any fixed or cost-proportional cap.","evidence":"Netflix/concurrency-limits Vegas/Gradient2 algorithms + Little's Law","maps_to":["runtime/budget-cost","runtime/locks-recovery","runtime/fan-out-fan-in"],"confidence":"high"},
    {"insight":"Borrow knowledge-editing's four-axis correctness contract — Reliability (fixes target), Generalization (covers paraphrases), Locality (doesn't break unrelated findings), Portability (propagates one hop) — as the gate every accumulated finding/insight must pass before it enters the graph. Locality is the formal version of the 'does this regress prior conclusions?' check.","evidence":"zjunlp/EasyEdit evaluation metrics; WISE/GRACE lifelong-editing","maps_to":["runtime/dedup-novelty","deep-review","runtime/state-jsonl-checkpointing"],"confidence":"high"},
    {"insight":"Rollback-without-replay + conflict-free-merge is achievable by composing GRACE-style per-edit rollback (EasyEdit) with CRDT merge (Yjs): findings become individually-revertable, fan-out-mergeable state rather than an append-only log, paying memory for surgical undo.","evidence":"EasyEdit GRACE rollback + UltraEdit lifelong normalization; yjs Y.Map merge semantics","maps_to":["runtime/state-jsonl-checkpointing","runtime/locks-recovery"],"confidence":"med"},
    {"insight":"Floor-gated consecutive-agreement (min-rounds floor + 'same verdict N rounds in a row') is a zero-parameter convergence detector for deliberation loops, but it embeds the collusive-failure debate theory warns about; it must be vetoed by a model-family-diversity / pairwise-disagreement variance gauge before stopping.","evidence":"comp-17/llm-debate-system adaptive_stopping.py; Irving 2018 collusion concern","maps_to":["deep-ai-council","runtime/convergence"],"confidence":"med"}
  ],
  "contradictions": [
    {"claim":"In-place continuous knowledge editing with normalization (UltraEdit/WISE) is the efficient way to accumulate cross-iteration knowledge.","counter":"EasyEdit's own locality metrics show catastrophic forgetting / edit-interference across thousands of edits, so append-only is safer for durability.","evidence":"zjunlp/EasyEdit lifelong-editing locality degradation + GRACE rollback tradeoffs"},
    {"claim":"Delay-based concurrency backoff (Vegas) optimally protects fan-out from overload.","counter":"LLM latency is dominated by output-token length and provider routing, not real queuing, so delay-based backoff over-reacts to long reasoning traces; loss-based (AIMD, trigger on reject/timeout) is more robust.","evidence":"concurrency-limits Gradient2 design rationale (fixes Vegas min-RTT drift)"}
  ],
  "next_angles": [
    "Formal-methods lens on the loop state machine: specify the JSONL checkpoint + fan-out concurrency as TLA+ and model-check deadlock/liveness/idempotency invariants (runtime/locks-recovery has no verification coverage yet).",
    "Mechanism-design / proper-scoring-rule juries for deep-ai-council: prediction-market-style judges whose payoffs reward calibrated truth-tracking rather than agreement, resolving the collusion-vs-convergence tension.",
    "Property-based testing (Hypothesis/QuickCheck) as the self-repair provability primitive: generate adversarial inputs as the immutable regression suite that proves a deep-review fix, porting fuzzing regression-mode onto agent outputs.",
    "Active-inference crossover (still open): combine pymdp epistemic-value acquisition with botorch to pick the next deep-research query that maximizes expected information gain about the knowledge graph."
  ],
  "notes": "Confirmed-negative on the long-standing AI-safety-via-debate OSS thread: no major maintained implementation exists (DuckDuckGo + GitHub surface only student-scale repos like comp-17 and michaelslain/ai-safety-decal-project-1). runtime/locks-recovery was the most under-mapped subsystem and is now first-covered by Netflix/concurrency-limits. Formal verification of loop invariants remains entirely uncovered and is the sharpest remaining white space. Could not verify reward-overoptimization (Gao 2022) tooling OSS — still missing, low-confidence."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m% [0mWebFetch https://github.com/yjs/yjs
[0m% [0mWebFetch https://github.com/Netflix/concurrency-limits
[0m% [0mWebFetch https://html.duckduckgo.com/html/?q=AI+safety+via+debate+LLM+open+source+github+implementation+Irving
[0m% [0mWebFetch https://github.com/zjunlp/easyedit
[0m% [0mWebFetch https://github.com/comp-17/llm-debate-system
