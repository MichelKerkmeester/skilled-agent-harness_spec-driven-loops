---
title: "Implementation Plan: Skill Advisor Outcome-Weighted Ranking Follow-On"
description: "Sequenced shadow-only build of the aionforge-procedural follow-on: a net-new execution-success emitter + skill-outcome store, an outcome-weighted shadow re-rank over the shared Beta primitive, an idempotent out-of-process ambient-tick cadence driver, and a prove-first BM25 query-length calibration."
trigger_phrases:
  - "advisor outcome ranking plan"
  - "advisor ambient tick plan"
  - "advisor bm25 calibration plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author plan for the outcome-weighted-ranking follow-on sub-phase"
    next_safe_action: "Start Phase 0: capture baseline + build the execution-success emitter"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-007-outcome-weighted-ranking"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Advisor Outcome-Weighted Ranking Follow-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | system-skill-advisor MCP server (`mcp_server/lib/scorer/`, `mcp_server/lib/metrics.ts`) |
| **Storage** | Net-new append-only skill-outcome store (JSONL) + the existing advisor projection; env-resolved shadow channel for the re-rank |
| **Testing** | Vitest (existing advisor scorer test harness) |

### Overview
Build the genuine `aionforge-procedural` follow-on in dependency order, all shadow-only. The proxy-only barrier comes first: there is no execution-success signal today (only recommendation-acceptance), so Phase 0 builds the net-new emitter + the skill-outcome store + captures a baseline. Phase 1 builds the idempotent out-of-process ambient-tick cadence driver that folds the store (also the substrate the sibling 004 C4-seam promoter rides on). Phase 2 builds the outcome-weighted shadow re-rank `similarity x reliability x penalty` (fresh skill = 0.5) consuming the SHARED Beta primitive (owned by 004 + Deep-Loop D2) via a thin adapter, plus per-skill failure-mode recall. Phase 3 ports the prove-first BM25 query-length calibration (telemetry-only). Phase 4 verifies and records the promotion-to-live NO-GO. Nothing here changes the live fused sort.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-3)
- [ ] Success criteria measurable (spec.md §5 SC-001..003)
- [ ] Dependencies identified (net-new emitter + store; shared Beta primitive w/ 004/D2; shared ambient-tick substrate; the proxy-only data barrier)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..005)
- [ ] Beta-blend + store-fold + ambient-tick + guardrail unit tests passing
- [ ] `tsc`/build + existing advisor suite green
- [ ] Docs (spec/plan/tasks/checklist/decision-record) synchronized
- [ ] Promotion-to-live NO-GO gate recorded in decision-record.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow side-pipeline rooted on a NET-NEW data source. An out-of-process emitter records per-skill execution outcomes into a durable store; an idempotent out-of-process tick folds the store on a clock; a shadow re-rank reads the folded reliability (via the shared Beta adapter) and reorders ONLY a shadow channel. The live fused sort and the live BM25 lane weight are never on this path.

### Key Components
- **Execution-success emitter** (new, wired off a post-task signal): records `(skillId, success/failure, context)` — the signal absent today (recommendation-acceptance lives in `AdvisorHookOutcomeRecord`, `metrics.ts:81-86`, and is left untouched).
- **Skill-outcome store** (new `skill-outcome-store.ts`): durable append-only `(skillId, success, failure, context)` + per-skill failure-mode storage; query-scored recall; idempotent fold.
- **Ambient-tick driver** (new out-of-process script): idempotent cron/maintenance cadence that folds the store; double-tick = no-op; SHARED substrate the 004 C4-seam promoter rides on. Cron/maintenance only.
- **Outcome-weighted re-rank** (new `outcome-weighted-rerank.ts`): `score = similarity x reliability x penalty`, fresh skill = 0.5, `reliability` from the shared Beta adapter; SHADOW channel only.
- **BM25 lane** (`bm25.ts:277`): the fixed logistic midpoint `4` swapped for a query-length-bucketed midpoint; shadow-only (`bm25.ts:279`), telemetry-only.
- **Shared Beta primitive** (sibling 004 + Deep-Loop D2): consumed here via a thin advisor adapter (posterior reliability in `[0,1]`, cold-start 0.5).

### Data Flow
post-task execution result -> **[emitter built here]** -> skill-outcome store (append-only) -> **[ambient-tick folds on a clock]** -> folded `(success, failure)` per skill -> shared Beta adapter -> reliability `[0,1]` -> shadow re-rank `similarity x reliability x penalty` -> SHADOW recommendation channel. The live recommend path and live fused sort are untouched. (Parallel: BM25 query-length calibration affects the shadow BM25 lane telemetry only.)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `metrics.ts:81-86` (`AdvisorHookOutcomeRecord`) | Recommendation-acceptance only (`accepted/corrected/ignored` + `skillLabel`) | ADD a net-new execution-success record type BESIDE it; do NOT overload the acceptance record | Read live: `:84-86` `outcome: AdvisorOutcome; skillLabel: string; correctedSkillLabel?` |
| `metrics.ts:394-409` (`createAdvisorHookOutcomeRecord`) | Builds + sanitizes acceptance records | mirror a `createSkillExecutionOutcomeRecord` for the new store | Read live: `:405` `sanitizeSkillLabel(input.skillLabel)` |
| `handlers/advisor-validate.ts:120-136` (outcome scope) | Summarizes scoped acceptance totals | candidate emitter seam (Q-001) — record execution success here OR a new post-task path | Read live: `:131-136` `summarizeScopedOutcomeTotals` over `accepted/corrected/ignored` |
| `scripts/spec/validate.sh` (Completion-Verification) | Skill-blind completion gate | candidate emitter seam (Q-001) — currently has ZERO skill attribution | `rg -n skill validate.sh` = empty (verified live) |
| new `skill-outcome-store.ts` | does not exist | CREATE durable append-only store + failure-mode recall; idempotent fold | n/a (net-new) |
| new `outcome-weighted-rerank.ts` | does not exist | CREATE shadow re-rank; consume the shared Beta adapter; SHADOW channel only | n/a (net-new) |
| `bm25.ts:277` (logistic midpoint) | `rawScore / (rawScore + 4)` query-length-blind | replace `4` with a query-length-bucketed midpoint; shadow-only | Read live: `:277` `Number((result.rawScore / (result.rawScore + 4)).toFixed(6))` |
| `bm25.ts:279` (`shadowOnly`) | `shadowOnly: true` — lane weight zeroed in fusion | unchanged; this is why bm25-calibration is telemetry-only | Read live: `:279` `shadowOnly: true` |
| `bayesian-scorer.ts:13-21` (deep-loop integer scorer) | NOT a consumer — throws on fractional inputs | not reused; consume the shared f64 primitive instead | Read live: `:14` `if (!Number.isInteger(success)...) throw new RangeError` |
| `fusion.ts:425-433` (live fused sort) | The live ranking | unchanged; a test proves it is byte-identical | Read live: `:425-433` sort by `(score+commandBonus+intent)` then `confidence` then `localeCompare` |

Required inventories:
- New-signal seam search: `rg -n 'AdvisorHookOutcomeRecord|createAdvisorHookOutcomeRecord|advisorHookOutcomesPath' .opencode/skills/system-skill-advisor --glob '*.ts'` (confirm the acceptance path is left untouched).
- Consumers of the shared Beta primitive: coordinate with `../004-c4-shadow-seam-beta-posterior/` for the module location + adapter signature.
- Matrix axes: {empty store, all-success, all-failure, low-count vs high-count, single-token vs long query for BM25, replay/double-delivery fold, double-tick} x {shadow-only invariant: live fused sort byte-identical}.
- Algorithm invariant: the shadow re-rank can NEVER change the live fused order; the store fold is order-independent and replay-idempotent; the ambient-tick is idempotent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Baseline + the missing signal (REQ-001, REQ-002, REQ-008)
- [ ] Capture an advisor-ranking + BM25-telemetry baseline into `scratch/` (no leverage number quoted without it; none exists in the campaign)
- [ ] Build the net-new execution-success EMITTER (the signal absent today) — resolve the seam Q-001 first
- [ ] Build the durable skill-outcome STORE (append-only, idempotent fold, query-scored recall) + per-skill failure-mode storage

### Phase 1: Ambient-tick cadence driver (REQ-005)
- [ ] Build the idempotent out-of-process cadence driver that folds the store on a clock (double-tick = no-op)
- [ ] Run it cron/maintenance only — never a prompt-time hook (NFR-P01)
- [ ] Confirm it is the shared substrate the sibling 004 C4-seam promoter rides on (one driver, both consumers)

### Phase 2: Outcome-weighted shadow re-rank (REQ-003, REQ-004, REQ-006)
- [ ] Build the shadow re-rank `score = similarity x reliability x penalty` (fresh skill = 0.5), SHADOW channel only
- [ ] Consume the SHARED Beta primitive via a thin advisor adapter (do NOT fork; do NOT reuse the integer scorer)
- [ ] Build per-skill failure-mode recall, surfaced as advisory context (not a hard demotion)
- [ ] Assert (test) the live fused sort is byte-identical to baseline

### Phase 3: ADV-bm25-calibration (REQ-007, prove-first)
- [ ] Replace the fixed logistic midpoint `4` (`bm25.ts:277`) with a query-length-bucketed midpoint
- [ ] Keep the lane `shadowOnly:true` with a zeroed fusion weight — telemetry-only
- [ ] Capture a before/after BM25 telemetry baseline; no promotion claim without a measured delta

### Phase 4: Verification + NO-GO gate (REQ-009)
- [ ] Beta-blend + store-fold + ambient-tick + guardrail unit tests green; `tsc`/build + existing suite green
- [ ] Record the promotion-to-live NO-GO gate (real execution-success data + benchmark required) in decision-record.md
- [ ] `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Beta blend (cold-start 0.5, anti-flood low-vs-high count, fresh-skill neutrality); store fold (replay/double-delivery idempotence); ambient-tick (double-tick no-op); guardrail (live fused sort byte-identical) | Vitest |
| Integration | emitter -> store -> ambient-tick fold -> shared-Beta adapter -> shadow re-rank (shadow channel only); BM25 query-length bucket selection | Vitest + harness |
| Manual | Baseline capture before/after (advisor ranking + BM25 telemetry) | scratch/ harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Net-new execution-success emitter + store | Internal | Green (build here) | No reliability input — the whole candidate is inert (proxy-only barrier) |
| Shared Beta f64 primitive (sibling 004 + Deep-Loop D2) | Internal | Yellow (cross-sub-phase coordination) | Divergent fork; consume 004's module via a thin adapter |
| Ambient-tick cadence substrate (shared w/ 004 C4-seam) | Internal | Green (build here) | Two cadence drivers if built twice |
| Execution-success DATA accumulation | Internal | Red (zero today; signal absent) | No per-skill reliability signal -> stays shadow-only until data exists |
| aionforge-procedural (ranking.rs, memory.rs:256-281,304; bad_patterns.rs) | External (research) | Green (mined, iter-018) | Ranking blend + failure-mode design lacks a reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any sign the shadow re-rank could reach live ordering, or a unit test proves the live fused sort is not byte-identical.
- **Procedure**: All changes are additive and shadow-gated; revert the scoped commits per candidate. The skill-outcome store is append-only read-only input; deleting it returns ranking to pure similarity (fresh-0.5 everywhere). No live weight or live order ever changes, so rollback is reversion-only with no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Baseline + emitter + store) --> Phase 1 (Ambient-tick) --> Phase 2 (Shadow re-rank) --> Phase 4 (Verify + NO-GO)
                                                              Phase 3 (BM25 calibration, parallel) ----^
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0 | None | Ambient-tick, shadow re-rank |
| Phase 1 (ambient-tick) | Phase 0 | shadow re-rank fold cadence |
| Phase 2 (re-rank) | Phase 0 + Phase 1; shared Beta (004) | Verify |
| Phase 3 (BM25 calibration) | None (off-path parallel) | Verify |
| Phase 4 (Verify) | Phase 2 + Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0 (Baseline + emitter + store) | High | net-new write-path emitter + durable store + failure-mode storage + baseline |
| Phase 1 (Ambient-tick) | Med | idempotent out-of-process cadence driver |
| Phase 2 (Shadow re-rank) | Med | blend + shared-Beta adapter + failure-mode recall + guardrail |
| Phase 3 (BM25 calibration) | Low | one-site midpoint swap + telemetry baseline |
| Phase 4 (Verify + NO-GO) | Med | unit tests + NO-GO record + validate |
| **Total** | High | Level 3; critical path emitter -> store -> ambient-tick -> shared-Beta adapter -> shadow re-rank |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (N/A — additive shadow-only, no data migration)
- [ ] Feature flag configured (shadow re-rank channel default-off; BM25 lane stays shadow-only)
- [ ] Monitoring alerts set (N/A for shadow channel)

### Rollback Procedure
1. Disable the shadow re-rank channel (default-off) to return ranking to pure similarity.
2. Revert the per-candidate scoped commits (emitter, store, ambient-tick, re-rank, bm25).
3. Verify the advisor recommend path + live fused sort are byte-identical to baseline (live path was never touched).
4. Notify N/A (no user-facing change).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — the skill-outcome store is append-only read-only input; deleting it yields fresh-0.5 reliability everywhere.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
+--------------+     +--------------+     +--------------+     +--------------+
|   Phase 0    |---->|   Phase 1    |---->|   Phase 2    |---->|   Phase 4    |
| emitter +    |     | ambient-tick |     | shadow       |     | verify+NO-GO |
| store + base |     | cadence      |     | re-rank      |     |              |
+--------------+     +------+-------+     +------+-------+     +--------------+
                            |                    |
                     +------v-------+     +------v-------+
                     | 004 C4-seam  |     | shared Beta  | (sibling 004 +
                     | promoter     |     |  adapter     |  Deep-Loop D2)
                     | (rides tick) |     +--------------+
                     +--------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| emitter + store | None | per-skill execution outcomes | ambient-tick, re-rank |
| ambient-tick | emitter + store | folded reliability counts on a clock | re-rank cadence; 004 promoter |
| shadow re-rank | store + ambient-tick; shared Beta (004) | shadow `similarity x reliability x penalty` order | Verify |
| BM25 calibration | None (off-path) | query-length-bucketed shadow BM25 telemetry | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 0 — baseline + execution-success emitter + skill-outcome store** — CRITICAL (the signal does not exist; everything sequences behind it)
2. **Ambient-tick cadence driver** — CRITICAL (folds the store; also the 004 promoter substrate)
3. **Shadow re-rank over the shared Beta primitive** — CRITICAL (the actual ranking change, shadow-only)
4. **Verify + NO-GO** — CRITICAL (guardrail + promotion gate)

**Total Critical Path**: Phase 0 (emitter + store) -> ambient-tick -> shared-Beta adapter -> shadow re-rank -> verify.

**Parallel Opportunities**:
- `ADV-bm25-calibration` (Phase 3) is an off-critical-path parallel track (one-site shadow-only swap + telemetry baseline).
- Per-skill failure-mode recall can land alongside the re-rank once the store exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | The signal exists | emitter records execution success; durable store with idempotent fold; baseline captured | Phase 0 |
| M2 | Clock ticks | idempotent out-of-process ambient-tick folds the store; double-tick no-op; no prompt-time latency | Phase 1 |
| M3 | Shadow ranking | shadow `similarity x reliability x penalty` over the shared Beta adapter; live fused sort byte-identical | Phase 2 |
| M4 | Calibration + NO-GO | BM25 query-length midpoint swapped shadow-only with telemetry baseline; NO-GO recorded | Phase 3-4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Outcome-weighted ranking is a BUILD on a net-new signal, shadow-only

**Status**: Accepted

**Context**: aionforge-procedural ranks skills by observed execution outcomes (iter-018). The 006 revisit found the advisor captures only recommendation-acceptance (`AdvisorHookOutcomeRecord`, `metrics.ts:81-86`), never execution success; Completion-Verification is skill-blind (`validate.sh`). So the reliability signal does not exist.

**Decision**: Build a net-new execution-success emitter + skill-outcome store FIRST, then a shadow re-rank that never touches the live fused sort; gate the live flip behind real data + a benchmark (NO-GO).

**Consequences**:
- Net-new write-path + store; larger than porting a ranking formula.
- A shadow re-rank cannot corrupt live recommendations.

**Alternatives Rejected**:
- "Treat acceptance as success": rejected — accepting a recommendation says nothing about task outcome (proxy-only, synthesis 04 line 29).
- "Re-rank live immediately": rejected — no data exists and no benchmark earns it.

### ADR-002: Consume the shared Beta primitive + the shared ambient-tick; do not fork

**Status**: Accepted

**Context**: The anti-flood Beta posterior and an out-of-process cadence are both shared with sibling 004 (C4-seam) and Deep-Loop D2 (roadmap §4; synthesis 04 RC6). The live integer scorer throws on fractional inputs (`bayesian-scorer.ts:14`).

**Decision**: Consume the shared f64 Beta primitive via a thin advisor adapter (reliability in `[0,1]`, cold-start 0.5), and build ONE idempotent ambient-tick cadence driver that both this re-rank's fold and the 004 promoter ride on.

**Consequences**: Avoids a third Beta fork and a second cadence driver; the 004 sub-phase owns the primitive, this sub-phase owns the cadence substrate.

**Alternatives Rejected**:
- "Advisor builds its own Beta": rejected — duplicates the keystone math.
- "Reuse `bayesian-scorer.ts` integer scorer": rejected — throws `RangeError` on fractional inputs (`:14`).
<!--
LEVEL 3 PLAN (~205 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
