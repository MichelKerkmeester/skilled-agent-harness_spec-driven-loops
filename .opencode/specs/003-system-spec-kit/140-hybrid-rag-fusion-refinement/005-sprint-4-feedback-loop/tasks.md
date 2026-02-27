---
title: "Tasks: Sprint 4 — Feedback Loop"
description: "Task breakdown for MPAB chunk aggregation, learned relevance feedback, and shadow scoring."
trigger_phrases:
  - "sprint 4 tasks"
  - "feedback loop tasks"
  - "MPAB tasks"
  - "R11 tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 4 — Feedback Loop

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path) [effort] — requirement`

**Dependency Format**: `{T###}` = depends on task T###
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:checkpoint -->
## Safety Gate

- [ ] T-S4-PRE [GATE-PRE] Create checkpoint: `memory_checkpoint_create("pre-r11-feedback")` [0h] {} — Safety gate for R11 mutations and feedback data

> **CALENDAR DEPENDENCY — R11 (F10)**: R11 prerequisite requires R13 to complete ≥2 full eval cycles (each = 50+ queries over 7+ calendar days). Minimum **28 calendar days** must elapse between Sprint 3 completion and R11 enablement. This is wall-clock time, NOT effort hours. If splitting into S4a/S4b (recommended), T002 (R11) cannot begin until S4a metrics confirm 2 full eval cycles are complete.
>
> **RECOMMENDED SPLIT — S4a / S4b (F3)**:
> - **S4a tasks**: T001 + T001a (R1 MPAB) + T003 + T003a (R13-S2 eval) + T007 (TM-04 quality gate) — estimated 33-49h. No schema change. Delivers A/B infra + save quality gating.
> - **S4b tasks**: T002 + T002a + T002b (R11 learned feedback) + T008 (TM-06 reconsolidation) — estimated 31-48h. Requires S4a verification + 28-day calendar window.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: R1 MPAB Chunk Aggregation

- [ ] T001 [P] Implement MPAB chunk-to-memory aggregation — `computeMPAB(scores)` with N=0/N=1 guards, index-based max removal, `_chunkHits` metadata, behind `SPECKIT_DOCSCORE_AGGREGATION` flag [8-12h] — R1
  - T001a Preserve chunk ordering within documents — sort collapsed chunks by original document position before reassembly in `collapseAndReassembleChunkResults()` [2-4h] — B2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: R11 Learned Relevance Feedback

- [ ] T002 Implement learned relevance feedback — schema migration (`learned_triggers` column) + separate column isolation + 7 safeguards (provenance, TTL 30d, denylist 100+, cap 3/8, threshold top-3, shadow 1 week, eligibility 72h) + 0.7x query weight, behind `SPECKIT_LEARN_FROM_SELECTION` flag [16-24h] — R11
  - T002a Implement memory importance auto-promotion — threshold-based tier promotion when validation count exceeds configurable threshold (default: 5 validations → promote normal→important, 10 → important→critical) [5-8h] — R11 extension
  - T002b Activate negative feedback confidence signal — wire `memory_validate(wasUseful: false)` confidence score into composite scoring as demotion multiplier (floor=0.3, gradual decay); feature-flaggable [4-6h] — A4 (R11 extension, prerequisite for DEF-003)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: R13-S2 Shadow Scoring

- [ ] T003 Implement R13-S2 — shadow scoring + channel attribution + ground truth Phase B [15-20h] — R13-S2
  - T003a Implement Exclusive Contribution Rate metric — measure how often each channel is the SOLE source for a result in top-K [2-3h] — R13-S2 extension
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4-tm04 -->
## Phase 4: TM-04 Pre-Storage Quality Gate

- [ ] T007 [P] Implement multi-layer pre-storage quality gate in `memory_save` handler behind `SPECKIT_SAVE_QUALITY_GATE` flag [6-10h] — TM-04 (REQ-S4-004)
  - T007a Layer 1: structural validation (existing checks, formalised)
  - T007b Layer 2: content quality scoring — title, triggers, length, anchors, metadata, signal density; threshold >= 0.4
  - T007c Layer 3: semantic dedup — cosine similarity > 0.92 against existing memories = reject
<!-- /ANCHOR:phase-4-tm04 -->

---

<!-- ANCHOR:phase-5-tm06 -->
## Phase 5: TM-06 Reconsolidation-on-Save

- [ ] T008 [P] Implement reconsolidation-on-save in `memory_save` handler behind `SPECKIT_RECONSOLIDATION` flag; create checkpoint before enabling [6-10h] — TM-06 (REQ-S4-005)
  - T008a Checkpoint: `memory_checkpoint_create("pre-reconsolidation")` before first enable
  - T008b After embedding generation, query top-3 most similar memories in `spec_folder`
  - T008c Merge path (similarity >=0.88): merge content, increment frequency counter
  - T008d Conflict path (0.75–0.88): replace memory, add causal `supersedes` edge
  - T008e Complement path (<0.75): store new memory unchanged
<!-- /ANCHOR:phase-5-tm06 -->

---

<!-- ANCHOR:pageindex -->
## PageIndex Tasks

> **T009 (PI-A4) deferred to Sprint 5** — Constitutional memory as expert knowledge injection (8-12h) has no Sprint 4 dependency. Moved to Sprint 5 per ultra-think review REC-07.
<!-- /ANCHOR:pageindex -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T004 Verify R1 dark-run: MRR@5 within 2%, N=1 no regression [included] {T001}
- [ ] T005 Analyze R11 shadow log: noise rate <5% [included] {T002}
- [ ] T006 [GATE] Sprint 4 exit gate verification [0h] {T001, T002, T003, T004, T005, T007, T008}
  - [ ] R11 auto-promotion thresholds verified (5→important, 10→critical)
  - [ ] R13-S2 Exclusive Contribution Rate metric operational
  - [ ] A4 negative feedback: confidence demotion floor verified at 0.3; no over-suppression
  - [ ] B2 chunk ordering: multi-chunk memories reassembled in document order, not score order
  - [ ] TM-04 quality gate: low-quality saves blocked (signal density <0.4); semantic near-duplicates (>0.92) rejected
  - [ ] TM-06 reconsolidation: merge/replace/store paths verified; checkpoint created before enable
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] R1 MRR@5 within 2% of baseline verified
- [ ] R11 noise rate <5% verified
- [ ] R11 FTS5 contamination test passing
- [ ] R13-S2 A/B infrastructure operational
- [ ] Schema migration completed successfully
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 5 of 8
- Sprint 4: Feedback Loop
- 6 tasks across 4 phases
-->
