---
title: "Tasks: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)"
description: "Task breakdown for the Memory MCP procedural-reliability cluster. All tasks are PENDING [ ] — none was shipped in 030's Wave-0 record. The unit is benchmark-first: the outcome emitter, f64 Beta primitive, and benefit micro-benchmark gate every candidate. Per-candidate refutation verdicts from research/iteration-021 are frozen as task acceptance criteria."
trigger_phrases:
  - "procedural reliability tasks"
  - "outcome emitter task"
  - "procedural benchmark gate task"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/012-012-procedural-reliability-benchmark"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Break the procedural-reliability unit into 20 PENDING tasks (0 done, none in 030 Wave-0)"
    next_safe_action: "Execute T001-T003 (outcome emitter) only inside a future implementation packet"
    blockers:
      - "No execution-success emitter exists (only recommendation-acceptance captured)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed (with commit evidence) |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`

> **All tasks below are `[ ]` PENDING.** None of the four candidates was implemented in 030's shipped Wave-0 record (`030-memory-search-intelligence-impl/spec.md` §14 lists candidates 1-13; the procedural cluster is absent). There are therefore **zero pre-checked `[x]` tasks with commit evidence** in this unit — by design, since the whole cluster is benchmark-gated.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 Emitter | T001-T003 | REQ-001 |
| M2 Beta primitive | T004-T006 | REQ-003 |
| M3 Benchmark | T007-T009 | REQ-002 |
| M4 Reliability-recall | T010-T012 | REQ-004 |
| M5 Sibling gates | T013-T021 | REQ-005/006/007 |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Outcome/usefulness emitter (shared prerequisite) — Milestone M1.

- [ ] T001 Confirm `feedback-ledger.ts` `FeedbackEventType` can be the canonical `'outcome'` source, or identify a new call site (`mcp_server/lib/feedback/feedback-ledger.ts`) [M] — open question per `research/iterations/iteration-018.md:23`
- [ ] T002 Emit `'outcome'` with skill/memory attribution at >2 call sites into `adaptive_signal_events` (`recordAdaptiveSignal`) [M] {deps: T001} — today only `'access'` flows broadly [`iter-018.jsonl:4`]
- [ ] T003 [P] Verify emitted `'outcome'` rows land with `signal_type='outcome'` and correct attribution (Vitest) [S] {deps: T002}

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Beta primitive + candidate builds — Milestones M2-M5.

### Phase 2a: Shared bounded-Beta f64 primitive + procedural adapter

- [ ] T004 Add f64 `computeWeightedReliability(s, f, α₀=1, β₀=1) = (α₀+s)/(α₀+β₀+s+f)` export, cold-start `0.5` + count-floor (`mcp_server/lib/scoring/bayesian-scorer.ts`) [S] — the live integer scorer throws on fractional inputs (`bayesian-scorer.ts:182-191`, `01-go-candidates.md:65`)
- [ ] T005 [P] Procedural adapter exposes the posterior as a recall multiplier (no mutation of the integer `computeScore`/`shouldDemote`) [S] {deps: T004}
- [ ] T006 Unit-test the primitive: unproven `0/0 → 0.5`, `1/0 → 2/3`, count-floor, fractional inputs (Vitest) [S] {deps: T004}

### Phase 2b: M-procedural-reliability-recall (PENDING — needs-benchmark + shared-infra-dep)
- [ ] T007 Fold the Beta-posterior mean into the procedural rank score (`mcp_server/lib/ranking/adaptive-ranking.ts:346`) [M] {deps: T015} — ONLY if the benchmark (T014) earns it

### Phase 2c: M-bad-pattern-negative-memory (PENDING — schema-migration + filter-site audit)
- [ ] T008 Decide host: `HAS_FAILURE` table-rebuild migration (frozen 6-value `RELATION_TYPES` `causal-edges.ts:21-28` + `CHECK` `vector-index-schema.ts:1113-1115,1781-1783`) vs the `'deprecated'` tier + `contradicts` 0.8 dampener precedent [M] {deps: none} — REFUTED-as-reuse [`iter-021.jsonl:2`]
- [ ] T009 [B] If precedent path: audit ALL retrieval-filter sites so anti-patterns never resurface as positive guidance (`reconsolidation.ts:527-533`) [M] {deps: T008}
- [ ] T010 Surface the bad-pattern WITH the procedure before reuse + recall penalty `1/(1+weight·count)` on failure-embedding match [M] {deps: T009}

### Phase 2d: M-skill-induction-repetition (PENDING — needs-benchmark, heaviest, write-side risk)
- [ ] T011 Add a new reconsolidation action beyond the closed 3-way union (`reconsolidation.ts:38`) [L] {deps: none} — REFUTED-as-reuse [`iter-021.jsonl:3`]
- [ ] T012 Add the non-existent recurrence/frequency counter in the save path (`reconsolidation.ts:202-210`) [L] {deps: T011}
- [ ] T013 Induction-precision gate: verbatim body, content-addressed idempotent id, off-by-default, ≥3 recurrence, lexical floor, never auto-promote across a trust boundary [L] {deps: T012}

### Phase 2e: M-procedural-version-reset (PENDING — already-exists-residual)
- [ ] T014b Confirm append-only deprecate-never-delete already covers procedural versioning (`reconsolidation.ts:273,365,370,526,529,575`) [S] {deps: none} — REFUTED-as-net-new [`iter-021.jsonl:4`]
- [ ] T015b Add ONLY the residual: reliability-reset-to-zero on a contract-surface change (rides T002's counter; description-only edits do not version) [S] {deps: T002, T014b}

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Benchmark gate + per-candidate STATUS — Milestones M3-M5.

- [ ] T014 Design + run the benefit micro-benchmark: reliability-weighting vs existing `access`/confirmation signals on accrued/synthetic `'outcome'` data; record the measured delta (no candidate has a benefit number today — `research/roadmap.md:269`, `03-corrections-caveats-and-residuals.md:33`) [M] {deps: T002, T004}
- [ ] T015 Decide: a non-result keeps M-procedural-reliability-recall PENDING (REQ-002) [S] {deps: T014}
- [ ] T016 Verify the reliability fold is neutral/byte-stable when all priors `r=0.5` (cold-start no-op) [S] {deps: T007}
- [ ] T017 [B] Benchmark induction precision (write-side corpus-quality risk) before enabling skill-induction [M] {deps: T013}
- [ ] T018 Record per-candidate STATUS in spec §14 (promote → Done + commit, else keep PENDING-with-reason) [S] {deps: T015}

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Outcome emitter live (T001-T003) — REQ-001
- [ ] f64 Beta primitive + adapter unit-tested (T004-T006) — REQ-003
- [ ] Benefit micro-benchmark run with a recorded delta (T014-T015) — REQ-002
- [ ] Each candidate either promoted (Done + commit) or kept PENDING with a recorded reason (T007-T018, incl. T014b/T015b)
- [ ] No candidate claims a measured benefit number it did not earn
- [ ] `validate.sh --strict` green on this folder
- [ ] checklist.md fully verified

> **Current state: 0 of 20 tasks complete.** This is a planning-only re-plan; no task is executed here.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source research**: `../research/research.md`, iterations `015/018/021`

<!-- /ANCHOR:cross-refs -->
