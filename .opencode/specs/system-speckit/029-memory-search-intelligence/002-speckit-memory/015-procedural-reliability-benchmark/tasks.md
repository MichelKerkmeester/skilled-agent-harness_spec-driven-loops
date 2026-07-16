---
title: "Tasks: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)"
description: "Task breakdown for the Memory MCP procedural-reliability cluster. All tasks are PENDING [ ], none was shipped in 030's Wave-0 record. The unit is benchmark-first: the outcome emitter, f64 Beta primitive and benefit micro-benchmark gate every candidate. Per-candidate refutation verdicts from research/iteration-021 are frozen as task acceptance criteria."
trigger_phrases:
  - "procedural reliability tasks"
  - "outcome emitter task"
  - "procedural benchmark gate task"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/015-procedural-reliability-benchmark"
    last_updated_at: "2026-07-04T17:51:04.560Z"
    last_updated_by: "codex"
    recent_action: "Implemented default-off outcome bridge, Beta primitive and recall plumbing"
    next_safe_action: "Run the benefit micro-benchmark before promoting the reliability-recall candidate"
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

> Shared benchmark-build plumbing is now implemented and tested. None of the four candidates was implemented in the shipped Wave-0 record (the Wave-0 record lists candidates 1-13 and the procedural cluster is absent), and no candidate is promoted here until a measured benchmark delta exists.

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

> Outcome/usefulness emitter (shared prerequisite), Milestone M1.

- [x] T001 Confirm `feedback-ledger.ts` can be the canonical outcome bridge (`mcp_server/lib/feedback/feedback-ledger.ts`) [M], implemented as a default-off mirror from strong/reformulation feedback signals
- [x] T002 Emit `'outcome'` / `'correction'` with memory attribution into `adaptive_signal_events` (`recordAdaptiveSignal`) [M] {deps: T001}, gated by `SPECKIT_PROCEDURAL_OUTCOME_EMITTER` and existing adaptive ranking enablement
- [x] T003 [P] Verify emitted `'outcome'` rows land with `signal_type='outcome'` and correct attribution (Vitest) [S] {deps: T002}, see `tests/feedback-ledger.vitest.ts`

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Beta primitive + candidate builds, Milestones M2-M5.

### Phase 2a: Shared bounded-Beta f64 primitive + procedural adapter

- [x] T004 Add f64 `computeWeightedReliability(s, f, α₀=1, β₀=1) = (α₀+s)/(α₀+β₀+s+f)` export, cold-start `0.5` + count-floor (`mcp_server/lib/scoring/bayesian-scorer.ts`) [S], integer scorer untouched
- [x] T005 [P] Procedural adapter exposes the posterior as a recall multiplier (no mutation of the integer scorer) [S] {deps: T004}
- [x] T006 Unit-test the primitive: unproven `0/0 → 0.5`, `1/0 → 2/3`, count-floor, fractional inputs (Vitest) [S] {deps: T004}, see `tests/bayesian-scorer.vitest.ts`

### Phase 2b: M-procedural-reliability-recall (PENDING, needs-benchmark + shared-infra-dep)
- [x] T007 Fold the Beta-posterior mean into the procedural rank score behind `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` (`mcp_server/lib/cognitive/adaptive-ranking.ts`) [M] {deps: T015}, default-off plumbing only. Promotion still waits on T014/T015

### Phase 2c: M-bad-pattern-negative-memory (PENDING, schema-migration + filter-site audit)
- [ ] T008 Decide host: `HAS_FAILURE` table-rebuild migration (frozen 6-value `RELATION_TYPES` `causal-edges.ts:21-28` + `CHECK` `vector-index-schema.ts:1113-1115,1781-1783`) vs the `'deprecated'` tier + `contradicts` 0.8 dampener precedent [M] {deps: none}, REFUTED-as-reuse [`iter-021.jsonl:2`]
- [ ] T009 [B] If precedent path: audit ALL retrieval-filter sites so anti-patterns never resurface as positive guidance (`reconsolidation.ts:527-533`) [M] {deps: T008}
- [ ] T010 Surface the bad-pattern WITH the procedure before reuse + recall penalty `1/(1+weight·count)` on failure-embedding match [M] {deps: T009}

### Phase 2d: M-skill-induction-repetition (PENDING, needs-benchmark, heaviest, write-side risk)
- [ ] T011 Add a new reconsolidation action beyond the closed 3-way union (`reconsolidation.ts:38`) [L] {deps: none}, REFUTED-as-reuse [`iter-021.jsonl:3`]
- [ ] T012 Add the non-existent recurrence/frequency counter in the save path (`reconsolidation.ts:202-210`) [L] {deps: T011}
- [ ] T013 Induction-precision gate: verbatim body, content-addressed idempotent id, off-by-default, ≥3 recurrence, lexical floor, never auto-promote across a trust boundary [L] {deps: T012}

### Phase 2e: M-procedural-version-reset (PENDING, already-exists-residual)
- [ ] T014b Confirm append-only deprecate-never-delete already covers procedural versioning (`reconsolidation.ts:273,365,370,526,529,575`) [S] {deps: none}, REFUTED-as-net-new [`iter-021.jsonl:4`]
- [ ] T015b Add ONLY the residual: reliability-reset-to-zero on a contract-surface change (rides T002's counter, description-only edits do not version) [S] {deps: T002, T014b}

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Benchmark gate + per-candidate STATUS, Milestones M3-M5.

- [ ] T014 Design + run the benefit micro-benchmark: reliability-weighting vs existing `access`/confirmation signals on accrued/synthetic `'outcome'` data, record the measured delta [M] {deps: T002, T004}. PENDING: no benchmark delta was run in this deterministic unit-test build
- [ ] T015 Decide: a non-result keeps M-procedural-reliability-recall PENDING (REQ-002) [S] {deps: T014}. PENDING: candidate not promoted without T014
- [x] T016 Verify the reliability fold is neutral/byte-stable by default and only changes ranking when opted in [S] {deps: T007}, see `tests/adaptive-ranking.vitest.ts`, `tests/search-flags.vitest.ts`, `tests/flag-ceiling.vitest.ts`
- [ ] T017 [B] Benchmark induction precision (write-side corpus-quality risk) before enabling skill-induction [M] {deps: T013}
- [x] T018 Record per-candidate STATUS in spec §14 (promote → Done + commit, else keep PENDING-with-reason) [S] {deps: T015}

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Outcome emitter benchmark bridge implemented default-off (T001-T003) for REQ-001
- [x] f64 Beta primitive + adapter unit-tested (T004-T006) for REQ-003
- [ ] Benefit micro-benchmark run with a recorded delta (T014-T015) for REQ-002
- [x] Each candidate either promoted (Done + commit) or kept PENDING with a recorded reason (T007-T018, incl. T014b/T015b)
- [x] No candidate claims a measured benefit number it did not earn
- [ ] `validate.sh --strict` green on this folder
- [ ] checklist.md fully verified

> **Current state: shared plumbing complete, 0 of 4 candidates promoted.** Benchmark-acceptance candidates remain pending until T014/T015.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source research**: `../research/research.md`, iterations `015/018/021`

<!-- /ANCHOR:cross-refs -->
