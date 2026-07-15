# Deep-Loop Effectiveness & Fan-out Automation — Targeted Research Synthesis

> A 20-iteration targeted, non-converging follow-on to 001. Single lineage — GPT-5.6 SOL at **xhigh** reasoning (fast tier) via cli-codex `codex --search exec` — seeded with 001's 216-repo registry so it deepens instead of re-surveying. Three threads: **fan-out automation**, **recommendation deep-dive**, **general effectiveness + AI-council**.

> **Run-2 addendum (per-mode deepening):** a later 40-iteration SOL run inside this same packet took each deep-loop mode in turn (8 modes × 5 angles) and asked how it improves and what makes it *uniquely valuable*. That synthesis — 163 new repos, 111 mode-specific recommendations — lives in **`research/research-modes.md`** (registry: `research/findings-registry-modes.json`).

---

## 1. Executive Summary

This run went past 001's survey depth into **mechanisms**: reference implementations, event schemas, algorithms, and file-level changes for `system-deep-loop`. Across 20 iterations (0 parse failures) it catalogued **74 new repos** (beyond 001's 216), **83 insights**, **59 concrete recommendations**, and **64 evidence-backed contradictions**, mapping to **14 subsystems** (all 13 + a new `runtime/fan-out-automation`).

**Three headline results:**

1. **The fan-out automation the operator wants is a SMALL, well-scoped change — not a rewrite.** The contradiction analysis (§9) establishes that `fanout-run.cjs`'s `buildLineageCommand` *already* emits per-lineage model + reasoning effort and already dispatches a distinct executor kind/model per lineage. The **only** missing pieces are (a) a live-tool (`--search`) policy in the command builder and (b) a capability matrix + contract adapter + manifest compiler. The manual 001 run was forced not by a scheduling gap but by that single missing flag path.

2. **The prototype proves it end-to-end.** `scratch/fanout-prototype.cjs` dispatched a heterogeneous fleet — SOL xhigh + LUNA max via `codex --search exec` (top-level `--search`), GLM max via `opencode` — at exit 0, parsed 3/3, and merged with provenance-preserving dedup. The mechanism the shipped runtime lacks is demonstrated working, in `scratch/` only, touching zero runtime code.

3. **59 recommendations converge on ONE architecture, not 59 tweaks.** Nearly every strong recommendation is the same shape: an **append-only JSONL event with a versioned replay-compatibility fingerprint and a receipt**, gated by a **transition-authorization kernel**, with **raw scores retained before any reduction**. Termination, novelty, budget, judgment, recovery, and council adjudication all become immutable, replayable, independently-auditable events. That coherence is the most important finding: the improvements compose.

**On AI-council specifically** (operator's flagged interest): the run produced **18 concrete council/judge recommendations** and the sharpest contradictions in the set — panel *size* alone is not robustness (RoPoLL proves unbounded bias under biased contamination), judge *diversity* is not monotonic with accuracy (Kuncheva–Whitaker), and Dawid–Skene estimates competence but does **not** correct correlated errors. The council needs measured effective-independence and role separation, not more seats.

Success criteria: 20/20 iterations; 74 new repos (target ≥10); 59 recs deepening R1–R8 + new; prototype runs; 0 shipped-runtime changes. Full machine-readable catalogue: `research/findings-registry.json`; per-iteration evidence: `research/iterations/`.

---

## 2. Method & Provenance

**Executor.** Single lineage, per operator directive: GPT-5.6 SOL (`gpt-5.6-sol`) at **xhigh** reasoning on the fast tier, via cli-codex `codex --search exec` (top-level `--search`). No LUNA/GLM in the research iterations (they appear only in the prototype's multi-model demo).

**Loop.** The proven 001 Shape-B harness (`scratch/deep-loop-driver.cjs`), sequential + findings-seeded + resume-from-JSONL-line-count, adapted to 20 iterations across 3 threads. `stop_policy=max-iterations`, `convergence_mode=divergent`.

**Seed.** Every prompt carried 001's full 216-repo name list as a do-not-re-list set plus the 8 ranked recommendations as deepening targets; the merge step drops any candidate already in 001's registry. This forced genuine divergence — all 74 repos are new.

**Threads.** Fan-out automation (iters 1–5), recommendation deep-dive of R1–R8 + the two 001 open gaps (6–15), general effectiveness + AI-council depth (16–20).

**Verification.** URL reality sampled across all threads (every sampled URL resolved HTTP 200; none present in 001's registry). Confidence: the model occasionally attributes a concept to a transferred/renamed org (same model-reported caveat as 001) — repo *existence* is URL-checked; stars/recency are not audited. Citations in §9 are real arXiv/doc URLs the model supplied and should be spot-audited before load-bearing design.

**Prototype.** `scratch/fanout-prototype.cjs` (+ `fanout-prototype-result.json`) demonstrates the automated multi-model + `--search` fanout; dry-run shows resolved per-leaf argv, live run dispatched 3 models serially (concurrency=1 to respect single-dispatch discipline and the OAuth shared with a concurrent session).

---

## 3. Scope & Success Criteria

| Criterion | Target | Result |
|-----------|--------|--------|
| Iterations complete | 20 | **20/20** (0 parse failures) |
| New repos (beyond 001) | ≥10 | **74** |
| Recommendations (deepen R1–R8 + new) | stronger set | **59**, mechanism-level, mapped to named subsystems |
| Fan-out prototype runs | yes | **3/3 models, exit 0, merged** |
| Synthesis incl. Eliminated Alternatives | yes | this document (§10) |
| Zero shipped-runtime changes | yes | held — all writes in this spec folder; prototype in `scratch/` |

**Out of scope (held):** any edit to `runtime/scripts/fanout-*.cjs` or other shipped runtime/skill code. Ranking across 001+005 is phase 002; production wiring of the fan-out fix is a gated follow-on.

---

## 4. Thread 1 — Fan-out Automation (can the automation reproduce the manual run?)

**Answer: yes, with a focused change. The prototype demonstrates it.**

**The key finding (from the contradiction analysis).** The belief that "fanout-run can't pass per-lineage model or reasoning effort" is **false** — the lineage schema already carries both and `buildLineageCommand` emits them per child. Likewise "mixing LUNA/SOL/GLM needs a new heterogeneous scheduler" is false — the schema already dispatches a distinct executor kind/model per lineage, and the existing capped queue is work-conserving (better than Conductor-style barrier batches). What is actually missing is narrow:

1. **Live-tool policy in the command builder** — a typed `liveTools.webSearch: inherit|disabled|cached|live` on the executor config, compiled to codex's top-level `['--search','exec',...]` (or an explicit `web_search` override), with a **capability matrix** that rejects unsupported (kind × live-search) combinations *before* fan-out instead of silently answering from training data.
2. **Executor adapters** — refactor `buildLineageCommand` into per-kind adapters returning `{command, argv, input, effectiveConfig, invocationFingerprint}`.
3. **A fanout-manifest compiler** — accept `models[]`, `branches[]`, `replicas`, produce stable `logical_branch_id`s, and feed the existing work-conserving pool.
4. **A resolved-dispatch receipt** — append a `lineage_dispatch_resolved` JSONL event before spawn; retries reuse its canonical fingerprint (incl. CLI version + effective capability state).

**The prototype** (`scratch/fanout-prototype.cjs`) implements 1–4 in miniature and ran live: SOL xhigh + LUNA max (`codex --search exec`) + GLM max (`opencode run`), each with its own invocation fingerprint, merged by a provenance-preserving round-robin reducer. This is the design reference for the (gated) production change.

**Supporting repos:** `openai/codex` (compile a typed leaf search mode into top-level `--search`), `google-gemini/gemini-cli` (leaf capabilities as validated data), `anthropics/claude-agent-sdk-typescript` (keep auto-approval, capability restriction, and execution limits separate), `microsoft/conductor` (compile model-by-branch manifests into stable logical leaves; keep the work-conserving pool), `massgen/MassGen` (normalize provider streams into attributed events; share only *after* an isolated discovery phase so heterogeneous leaves stay independent), `snakemake/snakemake` (a reuse receipt needs a provenance fingerprint + completeness check, not just prior status).

---

## 5. Thread 2 — Recommendation Deep-Dive (mechanisms for R1–R8 + the open gaps)

Each 001 recommendation now has a concrete mechanism (full set in §8; representative depth here):

- **R1 termination** → a versioned pure `evaluateTermination` returning `continue|recover|stop_converged|stop_nonconverged|blocked`, requiring *novelty-or-completion ∧ quality_pass ∧ execution_pass* for convergence; a dual-fingerprint cycle detector (period-1/2/3, repeated-error, progress-aware) calibrated from historical JSONL; and a **path-covering stopping clock** that counts retries/salvage/handoffs/tool-re-entry with an exponential-tail bound on total stopping time (`Brakebooster`), not just expectation.
- **R2 resume receipts** → `effect_prepared|dispatched|result|unknown|reconciled|compensated` events with stable `effectId/logicalBranchId/idempotencyKey`, changing `attemptId`, request/response hashes, provider receipt, and `prevEventHash`; flush `effect_prepared` before any side-effecting adapter. Recovery policy declared per effect (`pure-rerunnable|idempotent|queryable|compensatable|non-idempotent-unqueryable`). Crash-injection replay tests at every boundary.
- **R3 council independence** → `effective-independence.cjs` computing pairwise Q/φ/double-fault and weighted **N_eff**; block agreement-based STOP when N_eff < ~1.5 or no seat has positive marginal log-loss gain. (Expanded in §6.)
- **R4 conditional fan-in** → a versioned fan-in policy evaluator appending `WAIT|ACCEPT|WIDEN|BLOCK`; immutable `logical_branch_id` distinct from `attemptId`; the dormant wave model as canonical seed/dissent stages (reserve seed cost, cheap agreement check, atomically enqueue next stage on WIDEN); leases before every spawn/retry.
- **R5 cheap-checks-before-judges** → a versioned **Eval-DAG** (hard/weighted-soft/judge nodes, topological by cost, immutable receipt per verdict, raw component scores retained); a cheap **metamorphic gate** (label permutations, evidence-order changes, identifier renaming) before generative judging; promotion requires a fingerprint-matched verification bundle (original-reproducer + target-fix + impacted-regression + risk-selected full-gate receipts) or it is `UNVERIFIED`.
- **R6 semantic novelty** → `semantic-community-projection` producing deterministic hierarchical snapshots with **stable cross-snapshot community IDs** (native Leiden integers are not continuity identifiers — `graspologic`), emitting raw `coverageGain/communityBirthGain/resolutionGain/duplicatePenalty/divergencePressure`; contradiction raises *search pressure* but only raises settled novelty when it opens new territory or is resolved with evidence.
- **R7 stream-fold gauges** → `gauge-fold` + a transactional gauge-store (SQLite/WAL) persisting per-plane byte cursors, seen event IDs, and materialized gauges in one transaction; **signed-change** deltas (insert/delete/supersede) since mergeable sketches (DDSketch) can't retract after a judgment is superseded; judgments attached as later `judgment_attached/superseded` events, never in-place upserts.
- **R8 typed budgets** → a `runtime/budget-cost` module (`BudgetPolicy/Lease/UsageEstimate/UsageReceipt`) where one locked reservation charges every applicable ancestor atomically; one **root RunLease** debited before every iteration/model-call/tool-call/retry/handoff/salvage/merge, never re-allocated on resume; budget events folded into per-resource/per-window gauges. Note: reasoning-token ceiling is a **quality** knob, not just accounting (`s1` budget forcing).

**The two open gaps — resolved (both are "no, not directly"):**
- **RL convergence theory → LLM loop termination?** No direct transfer. RL convergence concerns *learned policy/value estimates across training*; terminating one stateful execution is an **optimal-stopping / sequential-testing** problem needing its own stopping-time contract. Anytime-valid self-consistency stopping can't be copied unchanged because an agent loop changes state/prompts/evidence/tools each iteration — exchangeability must be re-established per versioned epoch.
- **Durable-execution guarantees under LLM nondeterminism?** Deterministic replay makes *control flow* deterministic only *after* freezing nondeterministic outputs as history; fresh model execution and any unrecorded response stay nondeterministic. "Exactly-once workflow" ≠ exactly-once external effect — after a lost response the runtime can't know whether the effect happened; you need endpoint dedup/reconciliation/receipts. Compatibility must be decided **per logical operation/journal segment**, not per session/runtime version.

---

## 6. Thread 3 — General Effectiveness + AI-Council Depth

**AI-council (18 recommendations — the operator's flagged interest):**

- **Coordination phasing** — `coordination_phase = isolated|peer-review|vote`; permit answer exchange only after isolated leaves emit validated envelopes; score through a distinct evaluator identity and budget.
- **Five-role separation as capability schemas** — `target_freeze → generator fan-out → provenance blinding → detector fan-out → scorer-only adjudication → deterministic robust aggregation`. Generators can't score; detectors can't revise/rank; scorers can't see generator identity/rationale/peer scores; orchestrators can't author semantic output; target mutation always creates a new `targetVersion`.
- **Effective-independence gauge** — blinded judge IDs, pairwise Q/φ/double-fault, weighted N_eff, cross-validated marginal log-loss gain; shadow first, then block convergence below a calibration-derived independence threshold.
- **Blinded pairwise adjudication** — deterministic shuffling, reversed-order comparisons, bounded structured briefs, abstain on inconsistency; treat length/formatting as measured covariates (`arena-hard-auto`).
- **Protocol router replacing two-of-three** — objective-evidence gate first, blinded swapped pairwise second, detector-guided revision on bias flags, bounded debate only for unresolved high-value uncertainty, constitutional vetoes for frozen hard constraints.
- **Calibrated seat selection** — a versioned judge-profile/seat-calibration registry (Brier/ECE, swap consistency, bias coefficients, residual vectors, N_eff, transport bounds); sequential seat router maximizing expected calibrated loss-reduction-per-cost minus residual-correlation redundancy; dispatch an executable/human verifier when remaining LLM seats are redundant; **posterior best-candidate probability + expected regret as the STOP signal**.

**General effectiveness:**
- **Three-tier verification ladder** (deterministic checks → lightweight calibrated scorer → generative process verifier), escalating only in the uncertainty band or for high-impact cases, raw scores persisted before reduction (`GenPRM`, `ThinkPRM`).
- **Adaptive compute** as an append-only `adaptive_compute_decision` event (`stop_accept|sample_peer|deepen_verifier|escalate_model|hotswap|abandon_with_receipt`) chosen by calibrated support/opposition mass.
- **Loop-health witness + causal degeneration benchmark** — stream raw gauges through change detectors, inject proxy-capture / semantic-collapse / conformity-cascade / verifier-corruption / objective-drift into replayed trajectories; precommitted recovery rules (statistical alarm → request evidence; alarm + mechanistic-invariant failure → quarantine; receipt/integrity violation → immediate quarantine).
- **Transition-authorization kernel** — before every JSONL append: `transition_proposed → authorized|denied` carrying actor_role, policy_version, projection_hash, health_state, budget_snapshot, receipt_refs; the transition system encoded in **Quint** and model-checked (no effect without a receipt; deterministic replay; quarantine can't self-clear; recovery authority external to the quarantined lineage; every bounded retry terminates or escalates).
- **Self-improvement safety** — optimization success and alignment health are **separate measurement channels**; every promotion needs frozen cross-domain alignment canaries (a narrowly improved target causes broad drift — `emergent-misalignment`).

---

## 7. Repository Catalogue (curated core of the 74)

Grouped by primary subsystem; full index in `findings-registry.json`.

**Fan-out automation:** `openai/codex`, `google-gemini/gemini-cli`, `anthropics/claude-agent-sdk-typescript`, `microsoft/conductor`, `massgen/MassGen`, `snakemake/snakemake`, `allenai/olmes` (keep instance-level raw outputs + frozen configs so calibration recomputes without rerunning leaves).

**State / checkpointing / recovery:** `temporalio/sdk-go` (separate deterministic replay from at-least-once Activities), `restatedev/sdk-typescript` (journal results, detect command-stream mismatch, keep an explicit uncertain state), `golemcloud/golem` (record nondeterministic host calls; per-effect recovery policy), `xtdb/xtdb` + `terminusdb/terminusdb` (bi-temporal: domain validity vs learned-at sequence; resolution appends a masking delta, never mutates evidence), `apache/burr` (latest-action checkpoint leaves a crash window), `cadence-workflow/cadence` (version markers in history decide replay compatibility), `quint-co/quint` (model-check the JSONL transition system), `cedar-policy/cedar` (authorize state transitions externally).

**Fan-in / fan-out:** `lastmile-ai/mcp-agent` (keep contract validation + aggregation as ordinary code), `kubernetes/kubernetes` (stable logical indexes; success rules over subsets, not first-k), `volcano-sh/volcano` (widen only after a persisted failed readiness test), `lm-sys/RouteLLM` (WIDEN by expected marginal quality per reserved cost), `taskflow/taskflow` (ordinal successor identity is construction-order-sensitive; needs branch leases).

**AI-council / judging:** `scikit-learn-contrib/DESlib` (dynamic competent non-redundant seat selection from joint-failure vectors), `Toloka/crowd-kit` (Dawid–Skene competence, but not a correlation correction), `lm-sys/FastChat` + `lmarena/arena-hard-auto` + `lmarena/PPE` (blinded, order-swapped, offline-calibrated judging), `haizelabs/verdict` (seats/verifiers/reducers as an explicit graph), `scikit-activeml/scikit-activeml` + `cleanlab/cleanlab` (seat dispatch as active-learning annotator selection).

**Convergence / dedup / gauges / budget:** `browser-use/browser-use` (cycle candidacy vs termination — need environment stagnation too), `chosolbee/Stop-RAG` (separate stop-decider trained on full trajectories with Q(λ)), `MinishLab/semhash` (semantic dedup for candidate generation only; keep reversible member mappings), `feldera/feldera` (signed-change materialized gauges), `Arize-ai/phoenix` (traces separate from later judgments), `grpc/grpc` (one root deadline/attempt budget through every child; never reset at a handoff), `envoyproxy/ratelimit` (evaluate every scope, deny on any hard-constraint fail, shadow-mode first).

**Review / improvement / alignment:** `SWE-bench/SWE-bench` (selected regression tests ≠ whole-system non-regression — issue #280), `google/clusterfuzz` + `google/syzkaller` (fingerprint the reproducer; asymmetric flaky evidence — one regression vetoes, absence needs repeated trials), `ml-research/llms-gaming-verifiers` (cheap equivalent perturbations before accepting a verifier), `UKGovernmentBEIS/reward-hacking-misalignment` + `emergent-misalignment/emergent-misalignment` (alignment as a separate channel; cross-domain canaries).

---

## 8. Consolidated Recommendations (ranked by leverage)

The 59 recommendations reduce to **one architecture and eight workstreams**. Ranked for a phase-002/003 pipeline:

1. **[fan-out automation — do first, smallest + highest operator value]** `liveTools.webSearch` enum + capability matrix + executor adapters (`--search` top-level) + fanout-manifest compiler + `lineage_dispatch_resolved` receipt. Effort S–M; the prototype is the reference. *Unblocks automated multi-model live-search runs — no more hand-rolled driver.*
2. **[convergence]** Versioned pure `evaluateTermination` (novelty ∧ quality ∧ execution) + path-covering stopping clock with exponential-tail bound + dual-fingerprint cycle detector calibrated from historical JSONL.
3. **[state]** Side-effect receipt events (`effect_*`) + per-logical-operation replay-compatibility fingerprint registry + crash-injection replay tests. Recovery policy declared per effect.
4. **[deep-ai-council]** `effective-independence.cjs` (N_eff) + five-role capability schemas + coordination-phase isolation + blinded pairwise adjudicator + protocol router replacing two-of-three + calibrated seat registry.
5. **[fan-out-fan-in]** `leaf-result@1` envelope + provenance-balanced reducer in `fanout-merge.cjs` + fan-in policy evaluator (`WAIT/ACCEPT/WIDEN/BLOCK`) + immutable `logical_branch_id` + leases.
6. **[deep-review / deep-improvement]** Versioned Eval-DAG (hard/soft/judge, cost-topological, raw scores retained) + metamorphic gate + fingerprint-matched verification bundle + cross-domain alignment canaries.
7. **[dedup-novelty / continuity]** Semantic-community projection with stable IDs + contradiction-as-versioned-event + finalized-frontier/projection fingerprints for parallel leaves.
8. **[gauges + budget, cross-cutting]** Transactional stream-fold gauge-store (signed changes, no in-place upserts) + hierarchical typed budgets with one root RunLease + a **transition-authorization kernel** (Quint-checked) as the single JSONL append gate.

**The unifying pattern:** append-only JSONL events + versioned replay fingerprints + receipts + retained raw scores + external recovery authority. Adopt the kernel and the receipt/fingerprint discipline first; the eight workstreams then compose onto it.

---

## 9. Contradictions & Design Forks (load-bearing subset of 64)

Each is a fork phase 003 must resolve; all evidence-backed (real URLs in `findings-registry.json`).

- **Fan-out:** "fanout-run can't pass per-lineage model/effort" → **false**, it already does; only live-tool policy is missing. "Mixing models needs a new scheduler" → **false**, only a matrix compiler + contract adapter. "Real-time sharing among heterogeneous agents improves quality" → sharing weakens independent evidence; belongs in a post-discovery phase. "A shared CRDT set makes novelty coordination-free" → novel/canonical status is non-monotone (retractable), needs finalization.
- **Termination:** "semantic stability ⇒ converged" and "an iteration/token cap proves boundedness" → both false; need a fused conjunctive gate over the full feedback graph; the fully quality-gated policy's judge overhead can dominate savings (cheap checks first).
- **Resume:** "a checkpoint prevents duplicate work" / "durable execution ⇒ exactly-once external effects" / "one runtime version decides replay compatibility" → all false; receipts per effect, endpoint dedup, per-operation compatibility.
- **Council:** "a larger cross-family panel is safer (averaging cancels bias)" → **RoPoLL: unbounded bias under any positive biased contamination**; "high diversity ⇒ better ensemble" → Kuncheva–Whitaker: no universal monotonic relation; "Dawid–Skene solves dependent votes" → estimates competence, not correlated failure; "more agreeing samples ⇒ safe quorum" → correlated seats aren't independent evidence; "debate is categorically superior to voting" → task/protocol-dependent, an escalation not a universal reducer.
- **Open gaps:** "RL convergence theory supplies a termination rule" → it's an optimal-stopping problem instead; "anytime-valid self-consistency copies into agent loops unchanged" → exchangeability breaks each iteration.

---

## 10. Eliminated Alternatives

Recorded rather than padded (per the phase contract):

- **Rewriting the fan-out scheduler** — eliminated. The scheduler + per-lineage model/effort dispatch already exist; only the live-tool flag path and a contract adapter are missing. A rewrite would be over-engineering.
- **A new heterogeneous multi-model scheduler** — eliminated for the same reason; the work-conserving capped queue already beats barrier-batch alternatives (Conductor). Feed it compiled matrix leaves.
- **CRDT-only coordination-free novelty registry** — eliminated as a *complete* solution; CRDTs merge observations but canonical/novel status is non-monotone and needs deterministic finalization. Useful only for provisional hints.
- **Copying the Semantic-Halting-Problem priority cascade literally** — eliminated; its published cascade can halt on semantic convergence before the info-gain judge runs, defeating the intended conjunctive gate.
- **Dawid–Skene as a correlation fix for council votes** — eliminated as sufficient; retain it for competence weighting but keep residual-correlation and raw-score gauges outside it.
- **Panel-size / diversity maximization for the council** — eliminated (RoPoLL, Kuncheva–Whitaker); replace with measured effective-independence + calibrated competence.
- **Mergeable quantile sketches (DDSketch) for all gauges** — eliminated for judgment-bearing gauges; no retraction op, so it can't maintain current-version quantiles after a superseded judgment. Use for append-only latency/cost only.
- **~Low-confidence repos** flagged `confidence:"low"` (e.g. `hmuto/algorithmic-groupthink-paper`) held out of the core catalogue; retained in the registry for phase-002 triage.

---

## 11. Open Questions & Confidence

**Still open (candidate original contributions):**
- A principled **stopping-time contract** for a single LLM execution that fuses sequential-testing (anytime-valid) with the per-epoch non-stationarity of agent loops — no repo does this.
- **Effective-independence estimation for LLM judges** under correlated model families with sparse gold — partial tools exist (crowd-kit, DESlib, calibration repos) but no assembled contract.
- A **causal degeneration benchmark** for deep loops (proxy capture, semantic collapse, conformity cascade) with precommitted recovery — sketched here, unbuilt.

**Confidence & limitations:** High confidence in repo existence/relevance (sampled URLs all resolved; 74 new, none in 001). Recommendations are concrete but **model-proposed** — file names and event schemas are design suggestions to validate against the real runtime, not verified diffs. Citations in §9 are model-supplied; spot-audit before load-bearing design. §7–§8 curation is orchestrator judgment; `findings-registry.json` (74 repos, 59 recs, 64 contradictions) is the auditable ground truth.

---

*Generated by the targeted deep-loop research driver (single-lineage SOL xhigh). Provenance: `research/deep-research-config.json`, `research/deep-research-state.jsonl` (20 iterations), `research/iterations/iteration-001.md … iteration-020.md`, `research/findings-registry.json`. Fan-out prototype: `scratch/fanout-prototype.cjs`, `scratch/fanout-prototype-result.json`.*

---

<!-- ANCHOR:sources -->
## 12. Sources & Provenance

- **Full machine-readable catalogue** (74 new repos with links, mechanisms, `maps_to`, `confidence`; 59 recommendations; 64 contradictions with evidence URLs): `research/findings-registry.json`.
- **Representative primary sources** (full set in §7): [openai/codex](https://github.com/openai/codex), [temporalio/sdk-go](https://github.com/temporalio/sdk-go), [microsoft/conductor](https://github.com/microsoft/conductor), [lmarena/arena-hard-auto](https://github.com/lmarena/arena-hard-auto), [SWE-bench/SWE-bench](https://github.com/SWE-bench/SWE-bench), [quint-co/quint](https://github.com/quint-co/quint).
- **Key contradiction citations** (spot-audit before load-bearing design): RoPoLL panel-bias [arXiv:2606.30931](https://arxiv.org/abs/2606.30931), path-covering termination [arXiv:2607.01641](https://arxiv.org/abs/2607.01641), Bayesian judge ranking [arXiv:2607.02104](https://arxiv.org/abs/2607.02104).
- **Per-iteration provenance**: `research/iterations/iteration-001.md … iteration-020.md`; run state in `research/deep-research-state.jsonl` (20 lines).
- **Prototype evidence**: `scratch/fanout-prototype.cjs` (design) + `scratch/fanout-prototype-result.json` (live 3-model run, exit 0, 3/3 parsed).
- source: public GitHub + arXiv/doc URLs captured per finding; URL sample HTTP 200-verified.
<!-- /ANCHOR:sources -->
