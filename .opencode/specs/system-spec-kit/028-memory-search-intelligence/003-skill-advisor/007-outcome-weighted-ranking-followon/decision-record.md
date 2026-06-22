---
title: "Decision Record: Skill Advisor Outcome-Weighted Ranking Follow-On"
description: "Architectural decisions for the aionforge-procedural follow-on: build-on-a-net-new-signal shadow-only, reuse the shared Beta primitive and ambient-tick, prove-first BM25 calibration and the promotion-to-live NO-GO gate."
trigger_phrases:
  - "advisor outcome ranking decision record"
  - "advisor outcome ranking no-go gate"
  - "advisor procedural ranking adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author decision record for the outcome-weighted-ranking follow-on sub-phase"
    next_safe_action: "Hold for emitter + store + benchmark before live flip"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-007-outcome-weighted-ranking"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Skill Advisor Outcome-Weighted Ranking Follow-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> DELETED, superseded by measurement. The `SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK` flag and its code were removed in the flag-resolution reckoning because the outcome ledger stayed empty, every skill resolved to neutral and MRR stayed within noise so the order never moved. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Outcome-weighted ranking is a BUILD on a net-new signal, shadow-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Michel Kerkmeester, claude-opus-4-8 |

---

<!-- ANCHOR:adr-001-context -->
### Context

aionforge-procedural ranks skills by their observed execution outcomes (iter-018: `ranking.rs`, `memory.rs:256-281`). We wanted that signal in the advisor, which today ranks by metadata similarity alone. The 006 sibling-revisit stress-tested the idea and found the required signal does not exist: the advisor captures only whether a recommendation was accepted (`AdvisorHookOutcomeRecord.outcome in {accepted, corrected, ignored}`, `metrics.ts:81-86`), never whether the recommended skill's task succeeded, and the Completion-Verification gate is skill-blind (`scripts/spec/validate.sh`, grep `skill` = empty). So reliability-over-execution is proxy-only.

### Constraints

- The live fused sort (`fusion.ts:425-433`) must stay byte-identical, recommendation quality cannot regress on an unproven re-rank.
- No execution-success data exists today, so any ranking change is unmeasured until the emitter accumulates data.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Build a net-new execution-success emitter + a durable skill-outcome store FIRST, then a shadow-only re-rank (`similarity x reliability x penalty`, fresh skill = 0.5) that never touches the live fused sort, with the live flip gated behind real data and a benchmark.

**How it works**: A post-task write-path records per-skill success/failure into an append-only store. An idempotent out-of-process tick folds it. A shadow channel re-orders only itself off the folded reliability. The live recommend path is untouched.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Net-new emitter + store + shadow re-rank** | Real execution signal, no live risk | Larger build, data must accumulate before value | 8/10 |
| Treat recommendation-acceptance as success | Free (data exists) | Acceptance != task success. Proxy-only, measures the wrong thing | 2/10 |
| Re-rank live immediately on a heuristic | Visible now | No data, no benchmark. Can demote the right skill | 1/10 |

**Why this one**: The other two ship a wrong or unproven signal into live routing. Only the chosen path measures actual execution outcomes without risking live recommendations.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Skills can be ranked by what actually worked, not metadata similarity alone, once data accumulates.
- A bad shadow re-rank cannot corrupt live recommendations (the channel is non-live).

**What it costs**:
- A net-new write-path + store + cadence, larger than porting a ranking formula. Mitigation: reuse the shared Beta primitive and ambient-tick (ADR-002).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shadow re-rank leaks to live ordering | H | Shadow channel only + a guardrail test proving the live fused sort is byte-identical |
| Ranking stays inert (no data) | M | Build the emitter first, keep shadow-only until data exists |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The genuine external miss (iter-018). Similarity-only ranking ignores observed reliability |
| 2 | **Beyond Local Maxima?** | PASS | Acceptance-as-success and live-now alternatives weighed and rejected |
| 3 | **Sufficient?** | PASS | Net-new signal + shadow re-rank is the minimum that measures execution outcomes safely |
| 4 | **Fits Goal?** | PASS | On the 028/003 routing-intelligence path, the one external follow-on the campaign deferred |
| 5 | **Open Horizons?** | PASS | Shadow-first with a documented live-promotion gate, reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `metrics.ts` gains a net-new execution-success record type beside the acceptance record. New emitter wiring, `skill-outcome-store.ts`, `outcome-weighted-rerank.ts`.
- The live fused sort and live lane weights are unchanged.

**How to roll back**: Disable the shadow re-rank channel (default-off), revert the scoped commits, delete the append-only store (ranking returns to fresh-0.5 / pure similarity). No live order ever moved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Reuse the shared Beta primitive and a shared ambient-tick, prove-first BM25, live-promotion NO-GO

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Michel Kerkmeester, claude-opus-4-8 |

---

<!-- ANCHOR:adr-002-context -->
### Context

The anti-flood Beta posterior `(a0+s)/(a0+b0+s+f)` and an out-of-process cadence are both shared with sibling 004 (C4-seam) and Deep-Loop D2 (roadmap §4, synthesis 04 RC6). The live integer scorer throws `RangeError` on the fractional inputs a reliability posterior needs (`bayesian-scorer.ts:14`). The BM25 lane uses a query-length-blind logistic midpoint (`bm25.ts:277` `rawScore / (rawScore + 4)`) and is shadow-only with a zeroed fusion weight (`bm25.ts:279`). No benefit number exists anywhere in the 028 campaign, every leverage tag is structural inference (synthesis 03 line 9, roadmap §6).

### Constraints

- One Beta math module and one cadence driver across 004 + this sub-phase + D2, no third fork, no second clock.
- BM25 calibration cannot affect live ranking while the lane weight is zeroed.
- No live flip without a captured baseline plus a measured benchmark.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Consume sibling 004's shared Beta f64 primitive via a thin advisor adapter, build ONE idempotent ambient-tick the 004 promoter also rides, ship ADV-bm25-calibration prove-first shadow-only (telemetry-only) and record a hard NO-GO on going live until real execution-success data plus a benchmark earn it.

**How it works**: The re-rank's reliability comes from the shared posterior (cold-start 0.5). The ambient-tick folds the store and is the same driver the C4-seam promoter uses. The BM25 midpoint becomes query-length-bucketed but stays in the shadow lane. The NO-GO is recorded here.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Shared Beta + shared tick + prove-first BM25 + NO-GO** | One module/clock, no live risk, honest about unmeasured leverage | Cross-sub-phase coordination | 9/10 |
| Advisor forks its own Beta + its own cadence | No coordination | Divergent forks, two clocks, duplicated keystone math | 3/10 |
| Reuse `bayesian-scorer.ts` integer scorer | Already shipped | Throws on fractional inputs (`:14`), wrong type | 1/10 |
| Promote BM25 calibration live now | Simpler | Lane weight is zeroed, unproven, over-claims leverage | 2/10 |

**Why this one**: It builds the keystone math once, keeps a single cadence and refuses to quote leverage or go live without a measured delta.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No divergent Beta fork and no second cadence driver across 004 / this sub-phase / D2.
- BM25 telemetry can be evaluated query-length-aware without risking live order.

**What it costs**:
- Coordination with sibling 004 on the shared module location + adapter signature. Mitigation: 004 owns the primitive, this sub-phase owns the cadence substrate (Q-002, Q-003).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Quoting an unmeasured leverage number | M | Capture a baseline first, no benefit number exists in the campaign |
| BM25 calibration mistaken for a live win | M | Lane stays shadow-only with a zeroed weight, telemetry-only |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The Beta math and cadence are genuinely shared, a fork would duplicate the keystone |
| 2 | **Beyond Local Maxima?** | PASS | Fork-own-Beta, reuse-integer-scorer, promote-BM25-now all weighed and rejected |
| 3 | **Sufficient?** | PASS | One primitive + one cadence + a prove-first lane swap + a NO-GO gate |
| 4 | **Fits Goal?** | PASS | Aligns with the 004/D2 shared-infra plan (roadmap §4, synthesis 04 RC6) |
| 5 | **Open Horizons?** | PASS | Live flip stays gated behind a benchmark, reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- A thin advisor adapter over sibling 004's Beta primitive, one shared ambient-tick driver, a query-length-bucketed midpoint in `bm25.ts` (shadow-only) and a recorded NO-GO.
- No new external dependency, no schema migration.

**How to roll back**: Unwire the adapter, disable the ambient-tick cron entry, revert the `bm25.ts` midpoint to the constant `4`. All reversible, no live state changed.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
