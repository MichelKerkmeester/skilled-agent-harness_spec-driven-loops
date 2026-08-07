<!-- iteration 44 | model glm (zai-coding-plan/glm-5.2) | angle: Cross-model re-examination of top findings | 2026-07-15T00:45:29.889Z -->

This turn produces a chat-only analysis (no files mutated), so Gate 3 (spec folder) doesn't apply. One honesty note up front: my tool surface has `webfetch` for specific URLs but **no free-form web search** — so I'll verify the load-bearing new repos by fetching their GitHub pages rather than searching, and mark anything I can't confirm as low confidence.

Let me verify the new candidates I want to introduce (serving the angle: cross-re-examination = confirm with real data).
## Cross-model re-examination (iteration 44/45)

**Honesty caveat on tooling:** I do not have free-form web search — only `webfetch` for specific URLs. So instead of *claiming* coverage I verified each new repo's URL, star count, and recency by fetching its GitHub page (results summarized below). Numbers are snapshot-verified, not estimated.

### Verified new repos (cross-checking the catalogue's gaps)

| repo | stars | recency | status |
|---|---|---|---|
| `google/oss-fuzz` | 12.4k | active; blog "AI fuzzing" Nov 2024; trophies "as of May 2025" | live |
| `microsoft/onefuzz` | 2.8k | **archived Nov 2023**, last release 8.9.0 Oct 2023 | ref-only |
| `EleutherAI/lm-evaluation-harness` | 13.3k | active; CLI refactor Dec 2025 | live |
| `potsawee/selfcheckgpt` | 625 | last release Mar 2024; EMNLP 2023 | live |
| `infer-actively/pymdp` | 721 | v1.0.3 **Jun 2026** (very active) | live |
| `automerge/automerge` | 6.4k | v3.3.2 **Jul 2026** (very active) | live |

(Dropped `autogluon` — the URL I had was a 404; correct org is `autogluon/autogluon` but I couldn't verify stars this pass, so I won't cite a number.)

### Re-examining the registry's strongest findings (confirm/challenge)

1. **"Multi-agent debate/council ⇒ better truth-tracking" — CHALLENGE.** The open thread already flags "ensemble of weak < single strong." The cross-model lens sharpens *why*: the gain is conditional on **error-independence across model families**. A council of same-family peers has correlated blind spots → marginal gains and risk of amplifying confident errors. *Transfer:* `deep-ai-council` should (a) enforce family diversity, (b) emit **pairwise-disagreement** as a first-class novelty gauge, not just a vote tally. Maps to `deep-ai-council`, `runtime/dedup-novelty`, `runtime/gauges-observability`.

2. **"Self-reflection monotonically improves" — CHALLENGE / refine.** `selfcheckgpt` is the clean evidence: a model cannot reliably catch errors *it* produced (correlated blind spots), but **cross-sample inconsistency** is a zero-ground-truth confidence signal that works. *Transfer:* use SelfCheckGPT-style per-claim inconsistency (and a critic that can **abstain** instead of always scoring) as a convergence/freshness gauge and human-escalation trigger in `deep-review`/`runtime/convergence`. This operationalizes the open "calibrated abstention" thread.

3. **"Convergence = novelty plateau" — CONFIRM via fuzzing.** `oss-fuzz` (13k vulns / 50k bugs fixed over 1k projects) is the industrial-grade analog: convergence is measured against a **coverage frontier** (what classes remain), and every fix is gated by a **regression-mode re-run**, never by the fixer's "done" claim. *Transfer:* treat the accumulated findings as a test corpus; a deep-review "fix" must survive re-eval against the whole finding set. Maps to `runtime/convergence`, `runtime/dedup-novelty`, `deep-review`. (`onefuzz` carries the same architecture — *programmatic triage + result de-duplication + reproducible crashes* — but is **archived**: useful as design reference, not a runtime dependency.)

4. **"Checkpoint/resume = durable replay" — CONFIRM + deepen via CRDTs.** Replay assumes a single writer; under concurrent fan-out branches you need **merge** semantics. `automerge` gives conflict-free merge + tombstones, solving *two* open threads at once: "determinism under concurrency" and "elimination/decay operators for the knowledge graph" (tombstones = formal forgetting). Maps to `runtime/fan-out-fan-in`, `runtime/state-jsonl-checkpointing`.

5. **New convergence objective — active inference (`pymdp`).** Instead of passively stopping at a novelty plateau, active-inference agents **actively seek epistemic (info-gathering) actions** then exploit. Expected Free Energy = instrumental + epistemic value. *Transfer:* deep-research next-query selection should **maximize expected information gain about the knowledge graph**, not merely avoid duplication. Maps to `runtime/dedup-novelty`, `runtime/convergence`, `runtime/budget-cost`.

6. **Eval-as-loop gotcha (`lm-evaluation-harness`).** Its `--use_cache` is **rank-dependent** ("restart with same GPU count if interrupted") — a concrete reproducibility trap under fan-out. *Transfer:* `runtime/state-jsonl-checkpointing`/`runtime/locks-recovery` must record the parallelism shape in the checkpoint, not just the data.

### Contradictions logged
- Debate helps ↔ homogeneous ensembles add little ⇒ **diversity is the precondition**, not vote count.
- Self-correction helps ↔ self-affirmation is marginal ⇒ usable signal is **cross-sample consistency** (SelfCheckGPT), not self-reassurance.
- Checkpoint=resume ↔ concurrent fan-out breaks single-writer replay ⇒ need **CRDT merge**.
- "Use onefuzz" ↔ "it's archived" ⇒ borrow the *architecture*, never couple the runtime to one external project.

```json
{
  "new_repos": [
    {"name":"google/oss-fuzz","url":"https://github.com/google/oss-fuzz","stars":"~12.4k","what":"Continuous fuzzing infra (libFuzzer/AFL++/Honggfuzz + ClusterFuzz); regression mode; 13k vulns/50k bugs fixed across 1k projects as of May 2025.","lesson":"Industrial-grade convergence = coverage-frontier plateau + every fix gated by a regression re-run, not by the fixer's claim; accumulated findings are a test corpus. Direct model for deep-review self-repair-prove-it.","maps_to":["deep-review","runtime/convergence","runtime/dedup-novelty","runtime/locks-recovery"],"confidence":"high"},
    {"name":"microsoft/onefuzz","url":"https://github.com/microsoft/onefuzz","stars":"~2.8k (ARCHIVED Nov 2023)","what":"Self-hosted Fuzzing-as-a-Service: programmatic triage, result de-duplication, reproducible crashes, ensemble fuzzing sharing inputs. Archived; reference architecture only.","lesson":"Programmatic triage + dedup + guaranteed-reproducible findings is the closed-loop self-repair contract; but an archived project proves you must borrow the architecture, never couple your runtime to one external dependency.","maps_to":["deep-review","runtime/dedup-novelty","runtime/locks-recovery"],"confidence":"high"},
    {"name":"potsawee/selfcheckgpt","url":"https://github.com/potsawee/selfcheckgpt","stars":"~625","what":"Zero-ground-truth hallucination/confidence detection via cross-sample inconsistency (BERTScore/QA/NLI/LLM-prompt variants).","lesson":"A model can't reliably catch its own errors, but cross-sample disagreement is a usable per-claim confidence signal; use it (and an abstaining critic) as a convergence/freshness gauge and human-escalation trigger instead of always-on scoring.","maps_to":["deep-review","runtime/convergence","runtime/gauges-observability","deep-ai-council"],"confidence":"high"},
    {"name":"infer-actively/pymdp","url":"https://github.com/infer-actively/pymdp","stars":"~721","what":"Active inference for MDPs (JAX); Expected Free Energy = instrumental + epistemic value; agents actively seek info then exploit (v1.0.3 Jun 2026, very active).","lesson":"Convergence objective should be forward-looking expected information gain about the knowledge graph, not passive novelty plateau; deep-research next-query selection can borrow epistemic-value maximization.","maps_to":["runtime/dedup-novelty","runtime/convergence","runtime/budget-cost"],"confidence":"high"},
    {"name":"automerge/automerge","url":"https://github.com/automerge/automerge","stars":"~6.4k","what":"CRDT library with compact history, sync protocol, and tombstones; v3.3.2 Jul 2026 (very active).","lesson":"Conflict-free merge + tombstones give formal semantics for concurrent fan-out state AND formal forgetting/elimination of accumulated knowledge — solves determinism-under-concurrency and knowledge-graph decay in one move.","maps_to":["runtime/fan-out-fan-in","runtime/state-jsonl-checkpointing","runtime/dedup-novelty"],"confidence":"high"},
    {"name":"EleutherAI/lm-evaluation-harness","url":"https://github.com/EleutherAI/lm-evaluation-harness","stars":"~13.3k","what":"Few-shot eval harness backend for the Open LLM Leaderboard; resumable caching, --log_samples, v0.4.x, active Dec 2025.","lesson":"Resumable eval caching is RANK/PARALLELISM-dependent — record the parallelism shape in the checkpoint, not just the data; priority-ordered eval procedure + post-hoc sample logging are patterns for deep-improvement eval loops.","maps_to":["runtime/state-jsonl-checkpointing","runtime/locks-recovery","deep-improvement","runtime/continuity-threading"],"confidence":"high"}
  ],
  "insights": [
    {"insight":"Council/debate gains are conditional on model-family error-independence; homogeneous peers have correlated blind spots. Make family-diversity mandatory and surface pairwise-disagreement as a novelty gauge, not a vote count.","evidence":"open threads (ensemble-of-weak<single-strong); potsawee/selfcheckgpt cross-sample finding","maps_to":["deep-ai-council","runtime/dedup-novelty","runtime/gauges-observability"],"confidence":"med"},
    {"insight":"Treat the accumulated findings set as a regression test corpus: every 'fixed' deep-review finding must survive a re-eval against the whole set (fuzzing regression-mode + bisection), or the fix is unproven.","evidence":"google/oss-fuzz regression mode; microsoft/onefuzz reproducible-crash triage","maps_to":["deep-review","runtime/convergence","runtime/locks-recovery"],"confidence":"high"},
    {"insight":"Convergence should be an active info-gain objective (Expected Free Energy: instrumental+epistemic), not a passive novelty plateau — agents should actively probe the knowledge frontier before declaring done.","evidence":"infer-actively/pymdp active inference / epistemic value","maps_to":["runtime/dedup-novelty","runtime/convergence","runtime/budget-cost"],"confidence":"med"},
    {"insight":"A single CRDT/tombstone store (automerge) unifies two open threads at once: conflict-free merge for concurrent iteration branches (fan-out determinism) and formal forgetting (tombstones) for the knowledge graph.","evidence":"automerge/automerge CRDT history + tombstones","maps_to":["runtime/fan-out-fan-in","runtime/state-jsonl-checkpointing"],"confidence":"med"},
    {"insight":"Cross-sample self-consistency (SelfCheckGPT) is the practical abstention/confidence signal that makes a critic able to refuse-to-score; abstention-rate then becomes a convergence freshness gauge and human-escalation trigger.","evidence":"potsawee/selfcheckgpt (zero-ground-truth inconsistency detection)","maps_to":["runtime/convergence","runtime/gauges-observability","deep-review"],"confidence":"med"}
  ],
  "contradictions": [
    {"claim":"Multi-agent debate/council monotonically improves truth-tracking.","counter":"Gains vanish for homogeneous same-family ensembles; a single strong model often beats many correlated weak ones.","evidence":"catalogue open thread + selfcheckgpt correlated-blind-spot rationale"},
    {"claim":"Self-reflection/self-refine loops reliably self-correct.","counter":"A model cannot reliably catch errors it produced without an external/cross-sample signal; gains often come from extra compute/rewinds.","evidence":"microsoft/lost_in_conversation (in catalogue) + potsawee/selfcheckgpt"},
    {"claim":"Checkpoint/resume = deterministic durable replay.","counter":"Under concurrent fan-out, single-writer replay breaks; you need CRDT-style conflict-free merge.","evidence":"automerge/automerge CRDT vs single-writer replay assumption"},
    {"claim":"Borrow a mature external loop engine (e.g. onefuzz) as the runtime substrate.","counter":"onefuzz is archived (Nov 2023); architectural lessons survive but a hard runtime coupling is a liability.","evidence":"microsoft/onefuzz archived notice"}
  ],
  "next_angles": [
    "Free-energy / Bayesian-experimental-design crossover for query selection: combine pymdp epistemic value with botorch acquisition functions to pick the next deep-research query that maximizes expected information gain about the knowledge graph.",
    "Regression-suite-as-loop-gate: port fuzzing regression-mode + bisection into deep-review so fixes are provable against the accumulated finding corpus; treat findings as immutable tests with severity-graded thresholds.",
    "CRDT-backed externalized state: prototype the JSONL checkpoint store on automerge to get conflict-free fan-out merge + tombstone forgetting in one subsystem, then benchmark against current single-writer replay.",
    "Model-family diversity as a hard constraint + pairwise-disagreement gauge in deep-ai-council: refuse to start a council with <2 unrelated families and track disagreement variance over iterations as a convergence/over-confidence signal.",
    "Dedicated search for maintained OSS for AI-safety-via-debate (Irving) and reward-overoptimization scaling-law tooling (Gao 2022) — still unverified/missing; low-confidence gap worth a targeted find."
  ],
  "notes": "Tooling honesty: I had webfetch-to-URL only, no free-form web search, so coverage of nascent 2025-2026 repos is not exhaustive and star counts are snapshot-verified (not trends). onefuzz is archived — cited as architecture, not dependency. autogluon omitted (URL 404; correct org autogluon/autogluon unverified this pass). Two open threads still unresolved with verified OSS: scalable-oversight-via-debate (Irving) maintained repo, and reward-model-overoptimization (Gao 2022) tooling — both flagged low confidence. The cross-model re-examination confirms 4 of the registry's top findings (fuzzing-as-convergence, eval-as-loop, checkpoint/resume, self-consistency) and challenges 2 (debate-unconditionally-helps, self-reflection-unconditionally-helps) by conditioning them on diversity/external-signal."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m✗ [0mWebFetch https://github.com/dmlc/autogluon failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/dmlc/autogluon)
[0m% [0mWebFetch https://github.com/automerge/automerge
[0m% [0mWebFetch https://github.com/infer-actively/pymdp
[0m% [0mWebFetch https://github.com/google/oss-fuzz
[0m% [0mWebFetch https://github.com/potsawee/selfcheckgpt
[0m% [0mWebFetch https://github.com/microsoft/onefuzz
[0m% [0mWebFetch https://github.com/EleutherAI/lm-evaluation-harness
