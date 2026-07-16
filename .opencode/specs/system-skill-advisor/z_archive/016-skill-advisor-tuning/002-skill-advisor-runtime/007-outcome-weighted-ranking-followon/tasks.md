---
title: "Tasks: Skill Advisor Outcome-Weighted Ranking Follow-On"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor outcome ranking tasks"
  - "advisor ambient tick tasks"
  - "advisor bm25 calibration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author task breakdown for the outcome-weighted-ranking follow-on sub-phase"
    next_safe_action: "Begin T001 baseline capture"
    blockers: []
    key_files:
      - "tasks.md"
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
# Tasks: Skill Advisor Outcome-Weighted Ranking Follow-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

> **Candidate status (vs 030 Wave-0 shipped record):** ALL three candidates in this sub-phase are PENDING. `030/spec.md §14` ships none of them, its 13 shipped rows are Q6-anchor, C9, ANN tie-stable, C5-B, C-X1/C6-A, two-primitive-content-id, gauges, skip-closed, Constitutional-CAS, Deep-Loop trio, Code-Graph Q4-C1 (plus DEFERRED C4-A, M-system-kind). No advisor outcome-ranking / ambient-tick / bm25-calibration commit exists in `git log 1ecc531431..ab5459fb6d`. Therefore no task below is pre-checked `[x]` with a commit, every task is `[ ]` PENDING.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- (Phase 0 in plan.md, Baseline + the missing signal, REQ-001, REQ-002, REQ-008) -->

- [x] T001 Capture the advisor-ranking + BM25-telemetry baseline (before any change) into `scratch/`, record live ranking output + `bm25.ts` logistic behavior. NEVER quote an unmeasured leverage number (none exists in the campaign, synthesis 03 line 9, roadmap §6) (`scratch/baseline.md`, `scratch/after.md`)
- [ ] T002 [B] Resolve the emitter seam Q-001, advisor `advisor-validate` outcome path (`handlers/advisor-validate.ts:120-136`), the skill-blind Completion-Verification gate (`scripts/spec/validate.sh`) or a new post-task signal. STILL PENDING: the record contract + append/record write-path are built, but which runtime signal *fires* the emitter is an undecided design seam
- [x] T003 Build the net-new execution-success EMITTER (the signal absent today), record per-skill task success/failure, DISTINCT from recommendation-acceptance, leave `AdvisorHookOutcomeRecord` untouched (`metrics.ts` `SkillExecutionOutcomeRecord` + `createSkillExecutionOutcomeRecord`, `skill-outcome-store.ts` `appendSkillExecutionOutcome`/`recordSkillExecutionOutcome`)
- [x] T004 Build the durable skill-outcome STORE, append-only `(skillId, success, failure, context)`, idempotent fold, query-scored recall, per-skill failure-mode storage (new `lib/scorer/skill-outcome-store.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Ambient-tick cadence driver (REQ-005)
- [x] T005 Build the idempotent out-of-process cadence driver that folds the skill-outcome store on a clock, double-tick = no-op (`skill-outcome-store.ts` `tickSkillOutcomeFold` core + `scripts/skill-outcome-fold-tick.mjs` runner)
- [x] T006 Run the ambient-tick cron/maintenance only, never a prompt-time hook (NFR-P01) (`scripts/skill-outcome-fold-tick.mjs`, nothing on the recommend path imports it)
- [ ] T007 [P] Confirm the ambient-tick is the SHARED substrate the sibling 004 C4-seam promoter rides on, one driver, two consumers. PENDING: the tick is built as the substrate, but sibling 004's promoter is not yet built to ride it (coordinate with `../004-c4-shadow-seam-beta-posterior/`)

### Outcome-weighted shadow re-rank (REQ-003, REQ-004, REQ-006)
- [x] T008 Build the shadow re-rank `score = similarity x reliability x penalty` (fresh skill = neutral 0.5), SHADOW channel only (new `lib/scorer/outcome-weighted-rerank.ts`)
- [ ] T009 Consume the SHARED Beta primitive via a thin advisor adapter (posterior reliability in `[0,1]`, cold-start 0.5). PENDING: the `ReliabilityResolver` adapter seam is built and stays neutral 0.5 until sibling 004's primitive lands, not forked, does not reuse the integer scorer
- [ ] T010 [P] Coordinate the shared Beta module location/signature + `(a0,b0)` prior with sibling 004 + Deep-Loop D2 (synthesis 04 RC6) (Q-002). PENDING: sibling 004 not landed
- [x] T011 Build per-skill failure-mode recall, query-scored ("how this skill tends to fail on inputs like yours"), surface as ADVISORY context, never a hard live demotion (`skill-outcome-store.ts` `recallSkillFailureModes`)
- [x] T012 Assert (test) the LIVE fused sort is byte-identical to baseline, the shadow re-rank changes no live ordering (guardrail test in `tests/scorer/outcome-weighted-ranking.vitest.ts`)

### ADV-bm25-calibration (REQ-007, prove-first)
- [x] T013 Replace the fixed logistic midpoint `4` with a query-length-bucketed midpoint, DEFAULT-OFF flag (byte-identical default), keep `shadowOnly:true` and the zeroed fusion weight, telemetry-only (`lib/scorer/lanes/bm25.ts` `resolveBm25LogisticMidpoint`)
- [x] T014 Capture a before/after BM25 telemetry baseline, PROVE-FIRST: no promotion claim without a measured telemetry delta (`scratch/baseline.md`, `scratch/after.md`, default-off so no live delta is claimed)

### Guardrail enforcement (REQ-003, NFR-S01)
- [x] T015 Keep the shadow re-rank channel default-off and off the live recommend path. The skill-outcome store is read-only input, the emitter cannot write live scorer weights (`isAdvisorOutcomeWeightedRerankEnabled` default-off, re-rank never imported by `fusion.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Unit-test the Beta blend: cold-start 0.5, anti-flood (low-vs-high count NOT identical), fresh-skill neutrality (blend == pure similarity on empty store) (`tests/scorer/outcome-weighted-ranking.vitest.ts`)
- [x] T017 Unit-test the store fold + ambient-tick: replay/double-delivery folds identically, double-tick is a no-op (idempotent) (`tests/scorer/outcome-weighted-ranking.vitest.ts`)
- [x] T018 Unit-test the guardrail: the shadow re-rank can NEVER change the live fused order, live sort byte-identical to baseline (`tests/scorer/outcome-weighted-ranking.vitest.ts`)
- [x] T019 Unit-test ADV-bm25-calibration: query-length bucket selection, single-token vs long query, degenerate zero-length falls back to default bucket, lane stays shadow-only (`tests/scorer/outcome-weighted-ranking.vitest.ts`)
- [x] T020 Run `tsc`/build + the existing advisor scorer suite green, capture the after-baseline and diff vs T001. Typecheck 0 errors, `tests/scorer` 15 files/109 tests pass, broad `tests/scorer tests/legacy` has 0 NEW failures (2 pre-existing fail identically at HEAD)
- [x] T021 Record the promotion-to-live NO-GO gate (real execution-success data + benchmark required to out-rank pure similarity) in `decision-record.md` (REQ-009), recorded in ADR-002
- [x] T022 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and fix until clean, PASSED (0 errors / 0 warnings)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, shadow-only build done. 4 tasks (T002, T007, T009, T010) remain PENDING on external gates: the emitter runtime seam (Q-001 undecided) and sibling 004's shared Beta primitive (not landed)
- [ ] No `[B]` blocked tasks remaining, T002 stays `[B]` until the Q-001 seam is chosen
- [x] Beta-blend + store-fold + ambient-tick + guardrail unit tests passing
- [x] Shadow-only guardrail proven intact, live fused sort byte-identical, BM25 lane still shadow-only
- [x] Promotion-to-live NO-GO gate recorded, baseline captured (no unmeasured number quoted)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: `../research/iterations/iteration-018.md` (aionforge-procedural the one genuine miss), `../research/research.md` (Broadening follow-up `SA-outcome-weighted-ranking`).
- **Sibling (owns shared Beta + C4-seam promoter):** `../004-c4-shadow-seam-beta-posterior/`.
<!-- /ANCHOR:cross-refs -->
