---
title: "Feature Specification: Skill Advisor Outcome-Weighted Ranking Follow-On (aionforge-procedural)"
description: "Build the genuine external follow-on the campaign deferred: Beta-reliability skill ranking over EXECUTION outcomes (similarity x reliability x penalty) + per-skill failure-mode recall, gated on a net-new execution-success emitter + skill-outcome store, an idempotent out-of-process ambient-tick cadence driver (also the C4-seam promoter substrate), and a prove-first shadow-only query-length BM25 sigmoid calibration. All shadow-only; all PENDING."
trigger_phrases:
  - "advisor outcome weighted ranking"
  - "SA outcome weighted ranking followon"
  - "aionforge procedural skill ranking"
  - "advisor scheduler ambient tick"
  - "ADV bm25 calibration"
  - "skill outcome store execution success emitter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author outcome-weighted-ranking follow-on impl sub-phase from 028/003 research"
    next_safe_action: "Plan Phase-0 success-emitter + skill-outcome store, then the ambient-tick cadence driver"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-007-outcome-weighted-ranking"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Skill Advisor Outcome-Weighted Ranking Follow-On (aionforge-procedural)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The 100-iteration mining campaign closed with exactly one external crate genuinely skipped: `aionforge-procedural`, the procedural-memory / skill-ranking crate. Iteration 18 mined it and found a net-new candidate for the advisor — rank skills by their OBSERVED execution success/failure history (a Beta-posterior reliability blended `score = similarity x reliability x penalty`, fresh skill = neutral 0.5) plus per-skill failure-mode recall ("how this skill tends to fail on inputs like yours"). The 006 sibling-revisit then stress-tested it and downgraded it to PROXY-ONLY: the advisor today captures only whether a *recommendation* was accepted (`AdvisorHookOutcomeRecord.outcome in {accepted, corrected, ignored}`, keyed on `skillLabel` — `metrics.ts:81-86,394-409`), never whether the recommended skill's TASK actually succeeded. The Completion-Verification gate has zero skill attribution. So this is not a free byproduct of a present signal — a net-new execution-success emitter + a skill-outcome store must be BUILT FIRST, and only then can reliability-over-execution be computed.

This sub-phase carries that genuine follow-on plus two supporting candidates: `SA-scheduler-ambient-tick`, an idempotent out-of-process cadence driver that ticks the outcome store's consolidation and also serves as the substrate for the sibling 004 C4-seam promoter (the advisor analogue of Memory's C-G1 clock-around-an-existing-cursor, synthesis 03); and `ADV-bm25-calibration`, a prove-first shadow-only swap of the BM25 lane's fixed logistic midpoint for a query-length-bucketed one (`bm25.ts:277`), which improves telemetry only until the shadow BM25 lane is promoted.

**Key Decisions**: outcome-weighted ranking ships SHADOW-ONLY and is GATED on the net-new emitter + store (no live re-rank until execution-success data exists and a benchmark earns it); the Beta reliability math reuses the shared f64 primitive co-built in sibling 004 (and Deep-Loop D2) rather than forking a third; the ambient-tick is out-of-process cron/maintenance only, never a prompt-time hook; ADV-bm25-calibration is prove-first and cannot affect live ranking while the BM25 lane weight is zeroed.

**Critical Dependencies**: the shared Beta f64 primitive (sibling 004 owns it); the net-new execution-success emitter + skill-outcome store (this sub-phase builds them — they do not exist); a captured baseline before any leverage claim (the campaign fabricated no benefit numbers — every leverage tag is structural inference).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Implemented (shadow-only, default-off) — live promotion remains NO-GO |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor |
| **Candidates** | SA-outcome-weighted-ranking, SA-scheduler-ambient-tick, ADV-bm25-calibration |
| **Status (all)** | Shadow-only build SHIPPED (not promoted to live; verified typecheck 0 + scorer suite green, live fused sort byte-identical). **ADV-bm25-calibration** = IMPLEMENTED (query-length-bucketed midpoint behind a default-off flag, byte-identical default, lane stays shadow-only/zeroed-weight — telemetry-only; benchmark/promotion out of scope). **SA-scheduler-ambient-tick** = IMPLEMENTED (idempotent out-of-process fold-tick core + `.mjs` runner; double-tick no-op; never prompt-time). **SA-outcome-weighted-ranking** = IMPLEMENTED shadow-only (execution-success record + durable store + replay-safe fold + query-scored failure-mode recall + shadow re-rank `similarity x reliability x penalty`, fresh = 0.5); two gates remain PENDING — the emitter runtime seam (Q-001 undecided) and the shared Beta-posterior reliability math (owned by sibling 004, not landed; adapter seam built + neutral until then). Live re-rank / BM25 promotion remain NO-GO (needs real execution-success data + a benchmark). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor ranks skills by metadata similarity (the 5-lane fusion scorer), not by whether the recommended skill has historically WORKED on tasks like the current one. aionforge-procedural ranks by observed execution outcomes; mined as the single genuine external miss (iter-018: `aionforge-procedural/src/ranking.rs`, `memory.rs:256-281` `record_skill_outcome`, `memory.rs:304` failure-mode storage, `tests/bad_patterns.rs`). Three barriers make this a BUILD, not a tweak:

- **The signal does not exist (proxy-only).** The advisor captures `AdvisorHookOutcomeRecord` with `outcome in {accepted, corrected, ignored}` keyed on `skillLabel` / `correctedSkillLabel` (`metrics.ts:81-86,394-417`; consumed at `handlers/advisor-validate.ts:120-136`). That is recommendation-acceptance, NOT execution success — accepting a recommendation says nothing about whether the skill then completed the task. The Completion-Verification gate (`scripts/spec/validate.sh`) has zero skill attribution: grepping `validate.sh` for `skill` returns nothing. So a reliability-over-execution posterior has no input data today [CONFIRMED: 006 iter-018; synthesis 04 line 29; synthesis 03 line 44; verified live 2026-06-19].

- **The reliability math is shared, not owned here.** The blended ranking needs the anti-flood Beta posterior `(a0+s)/(a0+b0+s+f)` (cold-start 0.5, count floor). That f64 primitive does NOT ship in the advisor today (grep `posterior|prior|alpha|beta` in `lib/scorer/` = 0) and the live Deep-Loop integer scorer throws `RangeError` on the fractional inputs it needs (`bayesian-scorer.ts:14`). It is co-built once in sibling 004 + Deep-Loop D2 (roadmap §4 shared-infra; synthesis 04 RC6) — this sub-phase CONSUMES it via a thin adapter, it does not fork a third copy [CONFIRMED: roadmap.md:250; synthesis 01 line 65].

- **There is no cadence driver.** Folding the outcome store and ticking consolidation needs an idempotent out-of-process clock. The advisor has no standalone cadence (doc-trigger harvest runs only at scan-time / watcher-rebuild, no clock — `research.md` Internal Baseline, `doc-frontmatter.ts:22-24`). Memory's equivalent gap shrank to "add a clock-driver around the existing cursor" (synthesis 03 line 25, `consolidation.ts:518-548`); the advisor needs the analogue built net-new, and it doubles as the substrate the sibling 004 C4-seam promoter runs on.

Separately, the BM25 shadow lane scores with a query-length-blind logistic: `score = rawScore / (rawScore + 4)` (`bm25.ts:277`) — a fixed midpoint constant `4`, regardless of query length. aionforge / Mem0 use a query-length-bucketed sigmoid. Porting it improves the BM25 lane's telemetry only, because the lane is shadow-only (`shadowOnly: true`, `bm25.ts:279`) and its fusion weight is zeroed until promoted [CONFIRMED: synthesis 06 line 139-143; verified live `bm25.ts:277,279`].

### Purpose
Carry the genuine `aionforge-procedural` follow-on as documented, evidence-cited PENDING candidates — outcome-weighted ranking gated on a net-new execution-success emitter + skill-outcome store + the shared Beta primitive, an idempotent ambient-tick cadence driver, and a prove-first BM25 calibration — so the one external miss is not silently lost, and so each promotes only when its gate materializes (real execution-success data + a benchmark for ranking; the shared cadence substrate for the tick; a measured BM25 telemetry win + lane promotion for calibration).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **SA-outcome-weighted-ranking** (the genuine follow-on, shadow-only):
  - A net-new execution-success EMITTER: a write-path that records, per recommended skill, whether the task it was recommended for actually succeeded/failed (distinct from recommendation-acceptance).
  - A net-new skill-outcome STORE: a durable append-only record of `(skillId, success, failure, context)` keyed for query-scored recall.
  - A reliability blend `score = similarity x reliability x penalty` (fresh skill = neutral 0.5), consumed in a SHADOW re-rank channel only — never the live fused sort.
  - Per-skill failure-mode storage + query-scored recall ("how this skill tends to fail on inputs like yours"), surfaced as advisory context, not a hard demotion.
- **SA-scheduler-ambient-tick**: an idempotent, out-of-process (cron/maintenance) cadence driver that folds the skill-outcome store on a clock; it is also the substrate the sibling 004 C4-seam promoter runs on (one cadence driver, two consumers).
- **ADV-bm25-calibration** (prove-first, shadow-only): replace the fixed logistic midpoint `4` (`bm25.ts:277`) with a query-length-bucketed midpoint; capture a before/after telemetry baseline; it cannot affect live ranking while the BM25 lane weight is zeroed.
- A captured baseline BEFORE any leverage claim (the campaign fabricated no benefit numbers); unit tests for the Beta blend (cold-start neutrality, anti-flood), the store fold (replay/double-delivery idempotence), and the shadow-only guardrail.

### Out of Scope
- Any LIVE re-rank or live BM25 promotion. Outcome-weighting ships shadow-only; BM25 calibration is telemetry-only until the lane is promoted (separate decision). — promotion to live needs the emitter data + a benchmark, which is itself out of scope here.
- Building the shared Beta f64 primitive. — owned by sibling 004 (`004-c4-shadow-seam-beta-posterior`) + Deep-Loop D2 (028/004); this sub-phase consumes it via a thin adapter.
- The C4-seam promoter itself (estimator-proposal -> shadow-weight registry). — owned by sibling 004; this sub-phase builds only the shared ambient-tick CADENCE the promoter rides on.
- Lane-weight auto-tuning, two-gate promotion, held-out attestation. — sibling 004 owns the lane-reliability tuning path; this sub-phase ranks SKILLS by execution outcome, a different signal.
- The entity-cardinality penalty port — a near-no-op at ~22-skill scale (the quadratic term ~ 1.0), low priority, not built (synthesis 06 line 143).
- Per-lane attribution (`laneAttributionBySkill`). — empty in production, owned by 027/sibling-004 reconciliation; orthogonal to per-SKILL execution outcomes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Modify | Add a net-new execution-success record type beside `AdvisorHookOutcomeRecord` (`:81-86`) — distinct from recommendation-acceptance; persistence helpers mirroring `createAdvisorHookOutcomeRecord` (`:394-409`) |
| `.opencode/skills/system-skill-advisor/mcp_server/` (new emitter wiring) | Create | The execution-success EMITTER: a write-path hook that records per-skill task success/failure (the signal that does not exist today) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` (new `skill-outcome-store.ts`) | Create | Durable append-only skill-outcome store + per-skill failure-mode storage + query-scored recall |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` (new `outcome-weighted-rerank.ts`) | Create | Shadow re-rank: `similarity x reliability x penalty` consuming the shared Beta adapter; fresh skill = 0.5; SHADOW channel only |
| `.opencode/skills/system-skill-advisor/mcp_server/` (new ambient-tick script, out-of-process) | Create | `SA-scheduler-ambient-tick`: idempotent cron/maintenance cadence driver folding the store; also the 004 C4-seam promoter substrate |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts` | Modify | `ADV-bm25-calibration`: replace the fixed logistic midpoint `4` (`:277`) with a query-length-bucketed midpoint; shadow-only, telemetry-only |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/__tests__/` (or sibling test dir) | Create | Beta-blend (cold-start/anti-flood), store-fold (replay idempotence), shadow-only guardrail, and BM25-calibration telemetry tests; baseline-capture harness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **Net-new execution-success emitter** (the missing signal) | A write-path records, per recommended skill, whether the task it was recommended for SUCCEEDED or FAILED — distinct from recommendation-acceptance (`AdvisorHookOutcomeRecord` captures only `accepted/corrected/ignored`, `metrics.ts:81-86`). A test proves the new record carries execution success, not just acceptance; the existing acceptance record is left untouched |
| REQ-002 | **Skill-outcome store** (durable, query-scorable) | A durable append-only store of `(skillId, success, failure, context)` exists with query-scored recall; folding is idempotent (replay/double-delivery of an event folds to the same counts); the store is read-only input to ranking (no write-back into the live scorer) |
| REQ-003 | **Outcome-weighted re-rank, SHADOW-ONLY** | A shadow re-rank computes `score = similarity x reliability x penalty` with a fresh skill = neutral 0.5; `reliability` is the shared Beta posterior consumed via a thin adapter (NOT a forked copy); the LIVE fused sort (`fusion.ts:425-433`) is byte-identical to baseline — a test proves no live ordering changes |
| REQ-004 | **Reuse the shared Beta primitive** | The reliability math consumes the shared f64 `(a0+s)/(a0+b0+s+f)` primitive co-owned by sibling 004 + Deep-Loop D2 (synthesis 04 RC6) via a thin advisor adapter; it does NOT fork a third copy and does NOT reuse `bayesian-scorer.ts:13-21` (throws `RangeError` on the fractional inputs, `:14`) |
| REQ-005 | **SA-scheduler-ambient-tick** (idempotent, out-of-process) | An out-of-process (cron/maintenance, NEVER prompt-time) cadence driver folds the skill-outcome store on a clock; ticking twice in a row is a no-op (idempotent); it adds NO latency to the prompt-time advisor recommend path; it is the shared substrate the sibling 004 C4-seam promoter rides on (one driver, both consumers) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | **Per-skill failure-mode recall** | Per-skill failure modes are stored and recalled query-scored ("how this skill tends to fail on inputs like yours"), surfaced as ADVISORY context alongside a recommendation — never as a hard demotion of the live ranking (`aionforge-procedural/memory.rs:304`, `tests/bad_patterns.rs`) |
| REQ-007 | **ADV-bm25-calibration** (prove-first, shadow-only) | The fixed logistic midpoint `4` (`bm25.ts:277` `rawScore / (rawScore + 4)`) is replaced with a query-length-bucketed midpoint; the lane stays `shadowOnly: true` (`bm25.ts:279`) and its fusion weight stays zeroed, so this changes TELEMETRY, not live ranking; a before/after telemetry baseline is captured; PROVE-FIRST: no promotion claim without a measured telemetry delta |
| REQ-008 | **Captured baseline before any leverage claim** | A before-state baseline of the advisor ranking + BM25 telemetry is recorded in `scratch/` BEFORE any change; no leverage number is quoted without it (the campaign fabricated none — every leverage tag is structural inference, synthesis 03 line 9 / roadmap §6) |
| REQ-009 | **Promotion-to-live NO-GO gate** | The whole build ships SHADOW-ONLY; a documented promotion gate states that no live re-rank (and no BM25 lane promotion) happens until real execution-success data accumulates AND a benchmark proves the blend out-ranks pure similarity; the NO-GO is recorded in `decision-record.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A net-new execution-success emitter + durable skill-outcome store exist (the signal absent today), with idempotent fold; a test distinguishes execution-success from recommendation-acceptance and proves the existing acceptance record is unchanged.
- **SC-002**: A shadow outcome-weighted re-rank (`similarity x reliability x penalty`, fresh = 0.5) consumes the SHARED Beta primitive via a thin adapter; the live fused sort is byte-identical to baseline (proven by test); per-skill failure-mode recall is surfaced as advisory context only.
- **SC-003**: An idempotent out-of-process ambient-tick cadence driver folds the store (no prompt-time latency, double-tick = no-op) and is the shared substrate for the 004 C4-seam promoter; ADV-bm25-calibration swaps the fixed midpoint shadow-only with a captured telemetry baseline; and a promotion-to-live NO-GO gate (real data + benchmark required) is recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Net-new execution-success emitter + store | Without it, the reliability posterior has no input — the whole candidate is inert | Build the emitter + store FIRST (they do not exist; this is the proxy-only barrier, synthesis 04 line 29) |
| Dependency | Shared Beta f64 primitive (sibling 004 + Deep-Loop D2) | A forked third copy diverges | Consume sibling 004's primitive via a thin adapter; do NOT reuse the integer scorer (throws on fractional inputs, `bayesian-scorer.ts:14`) |
| Dependency | Ambient-tick cadence substrate (shared with 004 C4-seam) | Two cadence drivers if built twice | Build ONE idempotent out-of-process driver; the 004 promoter rides it (synthesis 03 line 25, Memory C-G1 analogue) |
| Dependency | The 004 C4-seam apply-path / shadow channel | Outcome-ranking has no live target until shadow infra exists | Stays shadow-only re-rank; gated behind the shared shadow machinery 004 owns |
| Risk | Quoting an unmeasured leverage number | Fails the regression-baseline rule (no benefit number exists anywhere, synthesis 03 line 9, roadmap §6) | Capture a baseline in `scratch/` first; never cite an invented delta |
| Risk | Treating outcome-ranking as a free byproduct | Ships nothing (the signal is proxy-only) | This is a BUILD: net-new emitter + store + adapter + shadow re-rank (synthesis 04 line 29) |
| Risk | A shadow re-rank leaking to live ordering | Corrupts skill recommendations | The re-rank is a shadow channel; a guardrail test asserts the live fused sort is byte-identical |
| Risk | ADV-bm25-calibration mistaken for a live ranking win | Over-claimed leverage | The BM25 lane is shadow-only with zeroed fusion weight (`bm25.ts:279`); this is telemetry-only until lane promotion (a separate gate) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The ambient-tick cadence driver runs out-of-process on a cron/maintenance cadence — it MUST NOT add latency to the prompt-time advisor recommend path (never a prompt-time hook).
- **NFR-P02**: The shadow outcome-weighted re-rank runs off the live recommend path (a shadow channel); the live fused sort latency is unchanged.

### Security
- **NFR-S01**: The skill-outcome store is read-only input to ranking; the emitter cannot write into the live scorer weights. The shadow re-rank cannot change live ordering.

### Reliability
- **NFR-R01**: Folding the skill-outcome store is replay-safe and order-independent: replay or double-delivery of an execution-outcome event folds to the same counts with no read-modify-write race; ticking the cadence driver twice is a no-op.

---

## 8. EDGE CASES

### Data Boundaries
- Empty skill-outcome store: fresh skill = neutral 0.5 reliability; the blend equals pure similarity (no shadow re-order); promotes nothing (REQ-003).
- A skill with only failures vs only successes: the Beta posterior moves toward the pole but a low count cannot reach certainty (anti-flood, count floor).
- BM25 calibration with a single-token query vs a long query: the query-length bucket selects the midpoint; a degenerate zero-length query falls back to the default bucket.

### Error Scenarios
- Malformed outcome record in the store JSONL: skipped defensively, not crashed (the fold tolerates poison rows).
- Ambient-tick invoked while a previous tick is mid-fold: the second invocation is a no-op (idempotent lock), never a double-count.
- Shared Beta primitive not yet available (004 not landed): the adapter is unwired and the re-rank stays inert (fresh-0.5 everywhere) — no live impact.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~7 (metrics, emitter wiring, store, re-rank, ambient-tick, bm25, tests); net-new write-path + store + cadence + a lane swap |
| Risk | 17/25 | Auth: N; API: N; Breaking: N (shadow-only); but a shadow-to-live leak risk + a proxy-only data-availability barrier + shared-infra coupling with 004/D2 |
| Research | 16/20 | aionforge-procedural mining (ranking.rs, memory.rs, bad_patterns.rs); Beta blend design; baseline capture; the proxy-only correction |
| Multi-Agent | 7/15 | Consumes the co-owned shared primitive (004/D2); otherwise single-stream |
| Coordination | 11/15 | emitter -> store -> ambient-tick -> shared-Beta-adapter -> shadow re-rank sequencing; shared cadence with 004 |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Shadow re-rank leaks into live ordering | H | L | Shadow channel only + guardrail test (REQ-003); live fused sort byte-identical |
| R-002 | Outcome-ranking inert because no execution-success data exists | H | H | Build the emitter + store FIRST; keep shadow-only until data accumulates (proxy-only, synthesis 04) |
| R-003 | Beta primitive forks from sibling 004 / Deep-Loop D2 | M | M | Consume 004's f64 module via a thin adapter; do not reuse the integer scorer |
| R-004 | Quoting an unmeasured leverage number | M | M | Capture a baseline first; no benefit number exists in the campaign (synthesis 03/06, roadmap §6) |
| R-005 | ADV-bm25-calibration mistaken for a live win | M | M | Lane is shadow-only with zeroed weight (`bm25.ts:279`); telemetry-only until promotion |
| R-006 | Two cadence drivers (this + 004 promoter) | M | M | One shared idempotent out-of-process driver (REQ-005) |

---

## 11. USER STORIES

### US-001: Rank by what actually worked (Priority: P0)

**As a** Skill Advisor maintainer, **I want** skills ranked by their observed execution success/failure history, not metadata similarity alone, **so that** a skill that reliably completes tasks like the current one is preferred over a superficially-similar one that tends to fail.

**Acceptance Criteria**:
1. Given a net-new execution-success emitter has recorded per-skill task outcomes, When the shadow re-rank computes `similarity x reliability x penalty` (fresh skill = 0.5), Then a reliably-successful skill is boosted and a frequently-failing one demoted in the SHADOW channel — and the live fused sort is byte-identical to baseline.

### US-002: A clock that ticks without touching the hot path (Priority: P0)

**As a** Skill Advisor maintainer, **I want** an idempotent out-of-process cadence driver to fold the outcome store, **so that** the store stays current on a clock without adding any latency to prompt-time recommendation and without double-counting on a re-tick.

**Acceptance Criteria**:
1. Given the ambient-tick runs on its cron cadence, When it folds the skill-outcome store and then runs again immediately, Then the second run is a no-op (idempotent) and the prompt-time recommend path is unchanged; and the same driver is what the sibling 004 C4-seam promoter rides on.

### US-003: Prove the BM25 calibration before trusting it (Priority: P1)

**As a** Skill Advisor maintainer, **I want** the query-length-bucketed BM25 midpoint to be a prove-first, shadow-only change, **so that** a calibration that does not measurably improve telemetry never reaches live ranking — and the shadow-only lane cannot affect live order regardless.

**Acceptance Criteria**:
1. Given the fixed midpoint `4` is replaced with a query-length-bucketed one, When a before/after telemetry baseline is captured, Then the change is shown to improve (or not) BM25 telemetry while the lane stays `shadowOnly:true` with a zeroed fusion weight — no live ranking moves.

---

## 12. OPEN QUESTIONS

- Q-001: Where is the right write-path seam for the execution-success emitter — the advisor `advisor-validate` hook outcome path (`handlers/advisor-validate.ts:120-136`), the Completion-Verification gate (`scripts/spec/validate.sh`, currently skill-blind), or a new post-task signal? (iter-018 proxy-only)
- Q-002: Does the shared Beta primitive (sibling 004) land in a location this adapter can import without a cross-subsystem cycle, and what (a0, b0) prior + penalty term does the advisor blend use vs the 004 / D2 adapters? (synthesis 04 RC6; roadmap Provenance open item)
- Q-003: Should the ambient-tick cadence be wholly new, or reuse the spec-kit `session-manager`/consolidation clock pattern (`consolidation.ts:518-548`) the way Memory's C-G1 does (synthesis 03 line 25)?
- Q-004: At ~22-skill scale, does the failure-mode recall earn its cost, or is it (like the entity-cardinality penalty) a near-no-op until the skill catalog grows? (synthesis 06 line 143)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent research**: `../research/research.md` (Broadening Addendum follow-up `SA-outcome-weighted-ranking`), `../research/iterations/iteration-018.md` (aionforge-procedural the one genuine miss).
- **Roadmap**: `../../research/roadmap.md` (BROADENING §7 follow-ups; §4 shared-Beta infra); synthesis `../../research/synthesis/{01,03,04,06}` (01 shared-infra + procedural-proxy; 03 §scheduler/13%-unsourced; 04 procedural-PROXY-ONLY; 06 ADV-bm25-calibration).
- **Sibling sub-phase (owns the shared Beta primitive + C4-seam promoter):** `../004-c4-shadow-seam-beta-posterior/`.
- **Wave-0 shipped record (none of these candidates shipped):** `../../../030-memory-search-intelligence-impl/spec.md` §14.

---

<!--
LEVEL 3 SPEC (~175 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
