---
title: "Feature Specification: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster)"
description: "Runtime implementation for the deep-loop STOP-input corroboration cluster: graph-novelty delta + reported-novelty STOP guard, lag-ceiling tripwire, same-id keep-both conflict markers and default-off progress heartbeat are implemented in deep-loop-runtime with deterministic tests. Live benchmark calibration, workflow forwarding of reported novelty and any namespace-aware graph-edge persistence remain explicit gates."
trigger_phrases:
  - "newInfoRatio audit"
  - "stop input corroboration"
  - "graph novelty delta"
  - "lag ceiling backpressure"
  - "cross lineage contradiction"
  - "deep loop progress heartbeat"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration"
    last_updated_at: "2026-06-19T13:46:00+02:00"
    last_updated_by: "codex"
    recent_action: "Implemented deep-loop-runtime stop-input corroboration (default-off gates)"
    next_safe_action: "Calibrate live thresholds and wire workflow reported-novelty forwarding"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-005-replan"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent research phase** | `028-memory-search-intelligence/004-deep-loop` (Deep Loop, convergence/fan-out/council intelligence) |
| **Source research** | `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop convergence verdict decides STOP-vs-CONTINUE from a fixed set of structural graph signals. After 030's Wave-0 pass, four independent STOP-decision and fan-out-observability gaps remain, none of which need the absent D2 reliability signal, and each of which leaves a computed self-assessment unaudited, an advisory budget unenforced, a losing finding silently discarded or a long lineage's liveness unobservable:

1. **The headline gap, the self-graded `newInfoRatio` is computed and named in the STOP rationale but NEVER consumed by the structured convergence module.** `convergence.cjs` loads ONLY graph DB nodes/edges (`db.getNodes`/`getEdges` `:330-331`), computes its signals from them (`compute*FromData` `:359-363`) and its decision args exclude the ratio (`:298-322`). The decision is graph-threshold-only (`:378-381`), then annotates `STOP_ALLOWED` with "STOP is allowed pending newInfoRatio agreement" (`:285`), deferring to a layer the structured module cannot see. The self-reported ratio flows model → JSONL → reduce-state for display only, never cross-checked. The "agreement" is **model-self-adjudicated, unbounded, unaudited.** [CONFIRMED iter-18 I18-01. Verified current: `convergence.cjs:285` STOP reason still reads "pending newInfoRatio agreement". Decision args at `:298-322` exclude the ratio.] **Important precision:** the non-consumption is scoped to the *structured* convergence module ONLY, the prose loop does consume the ratio. [CONFIRMED synthesis `01:99`, `03:47`.]
2. **Backpressure is gauged but not enforced.** 030 shipped the read-side `lag`/`pending`/`failed` pool gauges (commit `46812f12a8`), but the council cost guards remain advisory: `evaluateCouncilCostGuards` only RETURNS `{continue_allowed, stop_reasons, upper_bound}` and never aborts/throws (`cost-guards.cjs:114-140`). There is no `lag_ceiling` in `DEFAULT_COUNCIL_COST_GUARDS` (`:15-20`) and nothing trips an enforceable oldest-pending-lag tripwire. [CONFIRMED iter-2 f-costguards-advisory / f-costguards-no-live-gauge. Verified current: cost-guards returns advisory tuple only, no `lag_ceiling`/`throw`.]
3. **Cross-lineage same-id collisions silently discard the loser's body.** When two fan-out lineages report the same finding id with substantively different content, `fanout-merge.cjs` keeps the FIRST-seen and drops the rest: `findingById` is a `Map` keyed on `finding.id || finding.title` with first-write-wins (`:66-82`). The loser's body is silently discarded. No CONTRADICTS/keep-both record exists anywhere in merge. [CONFIRMED iter-8 DL-cross-lineage-contradiction. Verified current: `fanout-merge.cjs:71-77` first-seen-wins dedup.]
4. **A long single lineage emits no periodic liveness signal.** The `orchestration-status.log` ledger records one `started` and one `completed`/`failed` per lineage (`fanout-pool.cjs:81-108`). There is no periodic heartbeat WITHIN a multi-minute single lineage. `loop-lock.cjs` carries only a lock-TTL heartbeat ("the context loop has no single long-lived heartbeat process", `:24-26`), not a progress signal. [CONFIRMED iter-12 E12-04. Verified current: `loop-lock.cjs:24-26` TTL-only.]

### Purpose

Land the deep-loop **STOP-input corroboration cluster**, the convergence-hardening and fan-out-observability residuals that survive after 030's Wave-0, and that are independent of the absent D2 reliability spine. The spine of the cluster: the **newInfoRatio audit** (compute an independent graph-novelty delta the model cannot game) GATES the **newInfoRatio consumption** (wire that delta into the structured STOP decision as a blocking guard). **Q4 backpressure enforcement** adds the `lag_ceiling` tripwire on top of the already-shipped gauges. The **cross-lineage contradiction keep-both + record** stops the silent loser-discard, and the **progress heartbeat** makes a long lineage's liveness observable. The **shutdown-summary half already shipped** (030 graceful-self-stop) and is recorded here as DONE for completeness.

### Critical context (from the 028 research, authoritative)

- **This cluster does NOT depend on the absent D2 reliability signal.** D2 (`metadata.reliability`) is wholly absent on both read and write sides, every input is `r=0.5` today [CONFIRMED iter-13 F13-01]. The reliability-weighted-learning cluster (D2/D3/Q2/Q7) is therefore NO-GO until built and benchmarked, and is OUT OF SCOPE here. This cluster is STOP-corroboration / observability, keyed only on graph-novelty deltas, ledger gauges and merge-collision content, never on reliability. [CONFIRMED synthesis `01:57`, `03:11`.]
- **Every candidate here is NEEDS-BENCHMARK, except the one already DONE.** None has a measured before/after benefit number, all leverage/effort are structural inference [CONFIRMED roadmap §6]. The floor/tolerance for the novelty audit, the `lag_ceiling` default and the keep-both leverage all require calibration on real histories at build time (out of research scope). Ship for correctness/reversibility behind a default-conservative guard, NOT a promised delta.
- **The newInfoRatio audit is self-implicating**, this very research campaign ran on self-graded `newInfoRatio` values. The gap is genuine net-new (a new roadmap gap, roadmap §5 item 2 + synthesis `01:99`).
- **The shutdown-summary half is DONE, the progress half is not.** 030's graceful-self-stop (commit `46812f12a8`) flushes a distinct `stopped`-marked partial summary on SIGINT/SIGTERM (`fanout-run.cjs:510-541`, `event:'stopped'` + `writeOrchestrationSummary({stopped:true, status:'partial'})`). That satisfies the shutdown-summary half of the iter-7 `DL-progress-heartbeat`/`DL-shutdown-summary-heartbeat` pair. The **periodic in-lineage progress** half is distinct and still open. [CONFIRMED iter-12 E12-02/E12-04. Synthesis `01:101`.]
- **The cross-lineage contradiction RECORD has an unlocated anchor.** The CONTRADICTS write primitive is real (`coverage-graph-query.ts:221` schema + `findContradictions`), but the same-id-merge conflict-detection site was NOT found in `upsert.cjs` (0/269 merge|same-id|keep-both matches). The keep-both anchor is `fanout-merge.cjs`, NOT `upsert.cjs`. Whether the merge or a downstream upsert dedupes by id/content_hash (an overwrite would clobber, defeating keep-both) must be confirmed at implementation time. [CONFIRMED iter-13 F13-04.]

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, the STOP-input corroboration cluster (7 candidates: 6 runtime-implemented + 1 already DONE)

| # | Candidate | One-line | Seam (file:line) | Eff | Status |
|---|-----------|----------|------------------|-----|--------|
| C1 | **DL-newInfoRatio-audit** | compute `computeGraphNoveltyDelta(nodes, edges, snapshots)` = fraction of NEW FINDING/SOURCE/EVIDENCE_FOR nodes+edges since the prior persisted snapshot (convergence already loads snapshots). The independent, un-gameable corroboration signal for the self-graded ratio | `convergence.cjs:338,390-399` (snapshots), `:330-331` (nodes/edges), new helper | M | **DONE** (runtime, benchmark threshold calibration pending) |
| C2 | **DL-newInfoRatio-consumption** | wire the C1 delta into the structured STOP: pass the reducer's rolling-ratio as `--reported-novelty`. Add a BLOCKING guard `novelty_self_report_unverified` (STOP_ALLOWED would fire AND `reportedNovelty < threshold` BUT `graphNoveltyDelta > floor` → STOP_BLOCKED). `effectiveNovelty = max(reported, graphDelta)` anti-gaming. Absent report → no-op (backward-safe) | `convergence.cjs:191-223,285,298-322,378-381` | M | **DONE** (runtime arg/guard, workflow forwarding + benchmark calibration pending) |
| C3 | **Q4-backpressure-enforcement** | add an enforceable `lag_ceiling` (default-5s warn, aionforge) tripwire on top of the already-shipped `lag`/`pending`/`failed` gauges. The loop HONORS the tripwire (advisory cost-guards stay advisory. This is the net-new enforced gauge path) | `cost-guards.cjs:15-20,114-140`, gauges from `fanout-pool.cjs:90,108,235-238` (shipped `46812f12a8`) | M | **DONE** (runtime, fanout default-off until benchmarked) |
| C4 | **DL-cross-lineage-contradiction** | when two lineages report the same id with substantively different content, keep BOTH instead of first-seen-wins discard. Victim by canonical content-derived order (never arrival), reusing 001's total-comparator discipline | `fanout-merge.cjs:66-82` | M | **DONE** |
| C5 | **DL-cross-lineage-contradiction-record** | emit a CONTRADICTS / `_conflicts` marker for the kept-both pair (the write primitive `coverage-graph-query.ts:221` is real). Confirm at impl time whether merge or a downstream upsert dedupes by id/content_hash before relying on keep-both | `fanout-merge.cjs:66-82`, `coverage-graph-query.ts:221`, verify `upsert.cjs` dedup | M | **DONE** (`_conflicts` marker, namespace-aware graph-edge persistence not attempted from merge) |
| C6 | **DL-progress-heartbeat** | periodic progress heartbeat at a configurable cadence WITHIN a long single lineage (default ~300s, 0=disable). Distinct from the shipped shutdown `stopped` marker and from the lock-TTL heartbeat | `fanout-run.cjs` lineage worker, `loop-lock.cjs:24-26` (TTL-only), `fanout-pool.cjs:81-108` (ledger) | S | **DONE** (default-off, cadence benchmark pending) |
| C7 | **DL-shutdown-summary-heartbeat** | a distinct `stopped`-marked partial summary flushed on SIGINT/SIGTERM (the shutdown half of the iter-7 progress/shutdown pair) | `fanout-run.cjs:510-541` | S | **DONE** (commit `46812f12a8`) |

> Build order (dependency-driven): **C1 → C2** (the novelty audit produces the delta the consumption guard ingests), then **C3** (independent enforcement), then **C4 → C5** (keep-both gates the record), then **C6** (independent observability). **C7 is already shipped**, recorded for completeness, NOT re-implemented. See `plan.md`.

### Out of Scope (documented, NOT built this sub-phase)

- **Reliability-weighted learning (D2 / D3 / Q2 / Q7)**, NO-GO until built AND benchmarked. D2 is a wholly-absent net-new build (every input `r=0.5`). Q2-quarantine's "lower-trust side" is undefined without D2. D3's cap+gate is unmeasured. [CONFIRMED iter-13.] Lives in a sibling impl sub-phase of `004-deep-loop`, not here.
- **The fan-out resilience cluster**, failure-class taxonomy, transient/fatal retry, orphan-lineage reset, recover-vs-fresh gate. Owned by the sibling sub-phase `003-fanout-failure-recovery`, not re-implemented here.
- **Q6-anchor FIX, deterministic merge total-order, pool gauges, graceful-self-stop**, already SHIPPED in 030 (commits `738e118751`, `46812f12a8`). Not re-implemented (C7 above records the shutdown-summary instance as DONE).
- **The "Q4 Beta flip"** (a Memory protect-gate vote-tally candidate, FALSIFIED in synthesis `03:19`) is a DIFFERENT Q4 and is NOT this candidate. This `Q4-backpressure-enforcement` is the council/fan-out cost-guard lag tripwire.
- Modifying the external reference systems under `028.../external/`.

### Files to Change

| File Path | Change Type | Candidate(s) |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify (+ new helper) | C1, C2 |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Possibly extend (novelty-delta emitter) | C1 |
| `.opencode/skills/deep-loop-runtime/lib/council/cost-guards.cjs` | Modify (lag_ceiling + enforce path) | C3 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modify (keep-both + CONTRADICTS record) | C4, C5 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify (in-lineage progress emitter) | C6 |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Deferred gate (forward rolling-ratio as `--reported-novelty`) | C2 |
| Tests alongside each change (deep-loop-runtime test suite) | Create/Modify | all PENDING |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C1 | An independent graph-novelty delta the model cannot game | A `computeGraphNoveltyDelta(nodes, edges, snapshots)` returns the fraction of NEW FINDING/SOURCE/EVIDENCE_FOR nodes+edges since the prior persisted snapshot, computed entirely from the graph state `convergence.cjs` already loads, never from the self-reported ratio. Scope the delta to FINDING/SOURCE/EVIDENCE so legitimate low-novelty bookkeeping iterations are not penalized. [research: iter-18 I18-01, seam `convergence.cjs:338,390-399`] |
| REQ-C2 | Gate STOP on novelty corroboration, backward-safe | When the structured decision would emit `STOP_ALLOWED` AND `reportedNovelty < threshold` BUT `graphNoveltyDelta > floor`, the decision becomes `STOP_BLOCKED` with a `novelty_self_report_unverified` blocker. `effectiveNovelty = max(reportedNovelty, graphNoveltyDelta)` so under-reporting cannot game STOP. An absent `--reported-novelty` is a strict no-op (byte-identical output). [research: iter-18 I18-01] |
| REQ-C3 | Enforce an oldest-pending-lag tripwire | A `lag_ceiling` (default 5s, aionforge, config-overridable) is metered against the already-shipped oldest-pending-lag gauge. When exceeded the loop honors the tripwire (a real warn/stop signal, not an advisory-only return). The existing advisory cost-guard tuple is preserved unchanged. This is an additive enforced path. [research: iter-2 Q4 candidate, seam `cost-guards.cjs:114-140`] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C4 | Keep both sides of a same-id cross-lineage collision | When two lineages report the same id with substantively different content, the merge retains BOTH records rather than first-seen-wins discard. Ordering of the retained pair is canonical and content-derived (never arrival order), reusing 001's total-comparator + content-derived-id discipline. [research: iter-8 DL-cross-lineage-contradiction, seam `fanout-merge.cjs:66-82`] |
| REQ-C5 | Record the contradiction | A kept-both pair emits a CONTRADICTS / `_conflicts` marker using the real write primitive (`coverage-graph-query.ts:221`). BEFORE relying on keep-both, confirm whether the merge or a downstream `upsert.cjs` dedupes by id/content_hash (an overwrite would clobber the kept-both pair). [research: iter-13 F13-04] |
| REQ-C6 | Periodic in-lineage progress heartbeat | A long single lineage emits a periodic progress event at a configurable cadence (default ~300s, `0` disables), distinct from the lock-TTL heartbeat and from the shutdown `stopped` marker. The cadence is benchmark-gated: confirm long-lineage stalls are real pain before defaulting it on. [research: iter-12 E12-04, seam `fanout-run.cjs` worker, `loop-lock.cjs:24-26`] |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each PENDING candidate is independently reversible and unit-tested.
- **SC-002**: C2's STOP gate is strictly backward-safe, an absent `--reported-novelty` yields byte-identical STOP/CONTINUE output vs the current decision (the no-op fixture passes).
- **SC-003**: The model cannot game STOP by under-reporting novelty (`effectiveNovelty = max(reported, graphDelta)` proven by the gaming fixture: high graph delta + `--reported-novelty 0.01` does NOT STOP).
- **SC-004**: No new dependency on the absent D2/reliability signal is introduced anywhere in the cluster.
- **SC-005**: C7 (shutdown-summary) is confirmed already-shipped (commit `46812f12a8`) and NOT re-implemented. Its evidence row is reconciled in `tasks.md`.
- **SC-006**: `node --check` on the touched `.cjs`, the deep-loop-runtime focused tests and `validate.sh --strict` on this sub-phase all pass.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The novelty floor/tolerance is mis-calibrated | False STOP-blocks on legitimate low-novelty bookkeeping iterations, OR a gaming gap | Default no-op when `--reported-novelty` absent. Scope delta to FINDING/SOURCE/EVIDENCE. Mirror reduce-state's insight exemptions. Calibrate floor + disagreement tolerance on real snapshot histories before defaulting on (needs-benchmark) |
| Risk | C2 changes the STOP decision for existing loops | Convergence regressions | Strict backward-safe contract (REQ-C2 no-op fixture). Research-scoped first (review/context loops have their own guards) |
| Risk | The `lag_ceiling` tripwire fires spuriously on a legitimately slow batch | Premature stop | Default-5s is a WARN tier first. Config-overridable. Metered against the already-shipped gauge, not a new measurement |
| Risk | Keep-both is clobbered by a downstream id/content_hash dedup | The contradiction record is silently lost | REQ-C5 confirms the dedup behavior of merge AND any downstream `upsert.cjs` BEFORE relying on keep-both (iter-13 F13-04 unlocated-anchor) |
| Risk | The progress heartbeat adds ledger noise / a timer the batch model dislikes | Log bloat, surprise timer | `0` disables. Benchmark-gate the default-on decision (iter-12 NEEDS-BENCHMARK). Keep it a thin emitter, no new lifecycle |
| Dependency | 030 pool gauges (`46812f12a8`) | C3 enforces against the shipped `lag`/`pending`/`failed` gauges | Confirmed shipped. This sub-phase adds the tripwire, does not re-emit gauges |
| Dependency | 030 graceful-self-stop (`46812f12a8`) | C7 IS this shipped work | Confirmed shipped (`fanout-run.cjs:510-541`). Recorded DONE, not re-built |
| Dependency | 001 total-comparator + content-derived-id discipline | C4 victim ordering must be canonical, not arrival | Reuse 001's content-derived ordering. The exact 001 call site is INFERRED, confirm before implementing the tie-break |
| Dependency | D2 reliability signal | NONE, explicitly independent | Cluster keyed on graph-novelty / ledger gauges / merge content only |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: C2 is fail-open on absence, a missing `--reported-novelty` never blocks STOP (no-op), so the corroboration gate cannot wedge a loop that does not forward the ratio.
- **NFR-R02**: `effectiveNovelty = max(reported, graphDelta)` is monotone anti-gaming, under-reporting the ratio can only RAISE the effective novelty via the independent graph delta, never lower the bar.

### Compatibility
- **NFR-C01**: C3 preserves the existing `evaluateCouncilCostGuards` advisory return shape unchanged. The `lag_ceiling` enforcement is an additive path.
- **NFR-C02**: C1/C2 add args only. With the new args absent, every existing convergence invocation is byte-identical.
- **NFR-C03**: No schema migration. No new background daemon. The runtime stays fire-and-exit batch.

### Observability
- **NFR-O01**: The progress heartbeat (C6) and the lag tripwire (C3) ride the existing `orchestration-status.log` ledger and gauge surface, no new sink.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Absent reported-novelty**: C2 must be a strict no-op (byte-identical STOP/CONTINUE), distinguishable from a forwarded `--reported-novelty 0` (which IS a low self-report to corroborate).
- **Gaming attempt**: a high graph-novelty delta paired with `--reported-novelty 0.01` must NOT STOP and must surface the `novelty_self_report_unverified` blocker.
- **Legitimate low-novelty iteration**: a genuinely flat graph delta paired with a low report must STOP_ALLOWED (not spuriously blocked), the delta is scoped to FINDING/SOURCE/EVIDENCE to exempt bookkeeping-only ticks.
- **Insight-only delta**: a delta composed only of `insight`-class nodes must not spuriously block (mirror reduce-state's insight exemptions).
- **Lag exactly at the ceiling**: the tripwire boundary (`>=` vs `>`) is explicit. A lag at exactly `lag_ceiling` resolves deterministically.
- **Same-id collision with identical content**: when two lineages report the same id with byte-identical bodies, keep-both must collapse to one (no spurious self-contradiction record).
- **Same-id collision, different content**: both retained. A CONTRADICTS record emitted. Canonical content-derived order, not arrival.
- **Downstream dedup clobber**: if a downstream `upsert.cjs` dedupes by id, the kept-both pair must survive it (confirmed at REQ-C5) or the keep-both is a no-op.
- **Heartbeat disabled (`0`)**: no progress events emitted. Behaves exactly as today (regression-safe).
- **Heartbeat on a fast lineage**: a lineage that completes before the first cadence tick emits no spurious heartbeat.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Convergence, cost guards, fan-out merge, fan-out run and reducer wiring |
| Risk | 16/25 | STOP gate correctness, lag enforcement, keep-both collision handling and heartbeat noise |
| Research | 12/20 | Iteration evidence already identifies the seams and the C7 shipped record |
| Coordination | 8/15 | Independent candidates with C1 before C2 and C4 before C5 |
| **Total** | **51/85** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What floor (graph-novelty delta) and disagreement tolerance correctly separate a gaming under-report from a legitimate low-novelty bookkeeping iteration? **PENDING, calibrate on real snapshot histories before changing live defaults.**
- Does the orchestrator actually forward the reducer's rolling-ratio to `convergence.cjs`, or must `reduce-state.cjs` be extended to pass `--reported-novelty`? **PENDING, runtime supports the arg. Workflow forwarding was left untouched because this implementation was scoped to deep-loop-runtime.**
- Does the merge OR a downstream `upsert.cjs` dedupe by id/content_hash such that an overwrite would clobber the kept-both pair? **ANSWERED for runtime merge, same-id/different-content records are rewritten to content-derived ids before downstream upsert. Namespace-aware graph-edge persistence remains a separate gate.**
- Is `~300s` the right heartbeat cadence for the deep-loop CLI cost profile, and are long-lineage stalls real enough pain to default it ON? **PENDING, benchmark before defaulting on. Runtime default remains `0`/disabled.**
- Is `lag_ceiling=5s` (aionforge default) right for a fan-out where each lineage is a full multi-minute CLI dispatch, or should it be far higher? **PENDING, cost-guard default exists for pure evaluation. Fanout tripwire remains default-off until measured.**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Parent research**: `../research/research.md` (Deep Loop external-mining synthesis). The STOP-corroboration detail in `../research/iterations/iteration-002.md`, `iteration-007.md`, `iteration-008.md`, `iteration-012.md`, `iteration-013.md`, `iteration-018.md` + `../research/deltas/iter-002.jsonl`, `iter-008.jsonl`, `iter-012.jsonl`, `iter-013.jsonl`, `iter-018.jsonl`.
- **Cross-cutting roadmap**: `../../research/roadmap.md` (§5 item 2 "DL newInfoRatio audit" net-new gap, BROADENING ADDENDUM newInfoRatio non-ingestion). `../../research/synthesis/01-go-candidates.md` (the `:99-101` STOP-residuals + needs-benchmark residuals). `03-corrections-caveats-and-residuals.md` (`:47` prose-loop-does-consume precision). `04-sibling-and-cross-cutting.md`.
- **Sibling impl sub-phase**: `../003-fanout-failure-recovery/` (the resilience cluster. This sub-phase is the convergence/STOP-corroboration complement).
- **Shipped record (Wave-0)**: Wave-0 record (commit `46812f12a8`, gauges/merge/graceful-self-stop. The graceful-self-stop instance is C7 DONE here. Explicitly did NOT ship failure-class or newInfoRatio consumption).

<!-- /ANCHOR:related-docs -->
