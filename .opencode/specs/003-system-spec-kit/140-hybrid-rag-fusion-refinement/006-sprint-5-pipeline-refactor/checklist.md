---
title: "Verification Checklist: Sprint 5 — Pipeline Refactor"
description: "Verification checklist for 4-stage pipeline refactor, spec folder pre-filter, query expansion, and spec-kit retrieval metadata."
trigger_phrases:
  - "sprint 5 checklist"
  - "pipeline refactor checklist"
  - "sprint 5 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Sprint 5 — Pipeline Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-S5-001 [P0] Sprint 4 exit gate verified (predecessor complete)
- [ ] CHK-S5-002 [P0] Checkpoint created before R6 work (`pre-pipeline-refactor`)
- [ ] CHK-S5-003 [P0] Requirements documented in spec.md
- [ ] CHK-S5-004 [P0] Technical approach defined in plan.md
- [ ] CHK-S5-005 [P1] Dependencies identified and available
- [ ] CHK-S5-006 [P1] All 158+ existing tests green before starting
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-S5-010 [P0] Code passes lint/format checks
- [ ] CHK-S5-011 [P0] No console errors or warnings
- [ ] CHK-S5-012 [P1] Error handling implemented
- [ ] CHK-S5-013 [P1] Code follows project patterns
- [ ] CHK-S5-014 [P1] Stage interfaces documented with JSDoc
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:sprint-5-verification -->
## Sprint 5 Specific Verification

### R6 — 4-Stage Pipeline
- [ ] CHK-S5-020 [P0] Checkpoint created before R6 work
- [ ] CHK-S5-021 [P1] R6 dark-run: 0 ordering differences on full eval corpus
- [ ] CHK-S5-022 [P1] All 158+ tests pass with `SPECKIT_PIPELINE_V2` enabled
- [ ] CHK-S5-023 [P1] Stage 4 invariant verified: no score modifications in Stage 4
- [ ] CHK-S5-024 [P1] Intent weights applied ONCE in Stage 2 (prevents G2 recurrence)

### R9 — Spec Folder Pre-Filter
- [ ] CHK-S5-030 [P1] R9 cross-folder queries identical to without pre-filter

### R12 — Query Expansion
- [ ] CHK-S5-040 [P1] R12+R15 mutual exclusion: R12 suppressed when R15="simple"
- [ ] CHK-S5-041 [P1] R12 p95 simple query latency within 5% of pre-R12 baseline (baseline recorded in T004b before Phase B)

### S2/S3 — Spec-Kit Retrieval Metadata
- [ ] CHK-S5-050 [P1] S2 anchor-aware retrieval metadata present in results
- [ ] CHK-S5-051 [P1] S3 validation metadata integrated into scoring

### TM-05 — Dual-Scope Auto-Surface Hooks
- [ ] CHK-S5-055 [P1] TM-05 auto-surface hook fires at tool dispatch lifecycle point
- [ ] CHK-S5-056 [P1] TM-05 auto-surface hook fires at session compaction lifecycle point
- [ ] CHK-S5-057 [P1] TM-05 per-point token budget of 4000 enforced — no overrun
- [ ] CHK-S5-058 [P1] TM-05 no regression in existing auto-surface behavior (`hooks/auto-surface.ts`)
<!-- /ANCHOR:sprint-5-verification -->

---

<!-- ANCHOR:pageindex-verification -->
## PageIndex Verification

### PI-A4 — Constitutional Memory as Retrieval Directives (deferred from Sprint 4 per REC-07)
- [ ] CHK-PI-A4-001 [P1] PI-A4: `retrieval_directive` metadata field present on all constitutional-tier memories
- [ ] CHK-PI-A4-002 [P1] PI-A4: Directive prefix pattern validated ("Always surface when:", "Prioritize when:")
- [ ] CHK-PI-A4-003 [P1] PI-A4: Directive extraction correctly parses existing constitutional memory content
- [ ] CHK-PI-A4-004 [P1] PI-A4: No scoring logic changes — content transformation only
- [ ] CHK-PI-A4-005 [P1] PI-A4: All constitutional-tier memories have directives after transformation
- [ ] CHK-PI-A4-006 [P1] PI-A4: Directive format is LLM-consumable (clear instruction prefixes)
- [ ] CHK-PI-A4-007 [P1] PI-A4: No regression in constitutional memory surfacing rate
- [ ] CHK-PI-A4-008 [P2] PI-A4: Directive content reviewed for accuracy against source rules

### PI-B1 — Tree Thinning for Spec Folder Consolidation
- [ ] CHK-PI-B1-001 [P1] Files under 200 tokens merged into parent: summary content absorbed, no content loss
- [ ] CHK-PI-B1-002 [P1] Files under 500 tokens use content directly as summary (no separate summary pass)
- [ ] CHK-PI-B1-003 [P1] Memory thinning threshold of 300 tokens applied correctly; 100-token threshold where text is the summary
- [ ] CHK-PI-B1-004 [P1] Thinning operates pre-pipeline (context loading step) — Stage 1 receives already-thinned context
- [ ] CHK-PI-B1-005 [P1] Stage 4 invariant unaffected — thinning does not touch pipeline stages or scoring
- [ ] CHK-PI-B1-006 [P1] R9 spec folder pre-filter interaction verified — folder identity unchanged after thinning
- [ ] CHK-PI-B1-007 [P2] Token reduction measurable for spec folders with many small files

### PI-B2 — Progressive Validation for Spec Documents
- [ ] CHK-PI-B2-001 [P1] Detect level: all violations identified (equivalent to current validate.sh behavior)
- [ ] CHK-PI-B2-002 [P1] Auto-fix level: missing dates corrected automatically
- [ ] CHK-PI-B2-003 [P1] Auto-fix level: heading levels normalized automatically
- [ ] CHK-PI-B2-004 [P1] Auto-fix level: whitespace normalization applied automatically
- [ ] CHK-PI-B2-005 [P0] All auto-fixes logged with before/after diff — no silent corrections
- [ ] CHK-PI-B2-006 [P1] Suggest level: non-automatable issues presented with guided fix options
- [ ] CHK-PI-B2-007 [P1] Report level: structured output produced with full before/after diff summary
- [ ] CHK-PI-B2-008 [P0] Exit code compatibility: exit 0 = pass, exit 1 = warnings, exit 2 = errors (unchanged from current validate.sh)
- [ ] CHK-PI-B2-009 [P1] Dry-run mode: proposed auto-fixes shown without applying changes
- [ ] CHK-PI-B2-010 [P2] Existing validate.sh callers (CI, checklist verification) unaffected by new levels
<!-- /ANCHOR:pageindex-verification -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-S5-060 [P0] All acceptance criteria met (REQ-S5-001 through REQ-S5-006)
- [ ] CHK-S5-061 [P1] 30-40 new tests passing (1000-1500 LOC)
- [ ] CHK-S5-062 [P1] Edge cases tested (empty pre-filter, empty expansion, missing S2/S3 data)
- [ ] CHK-S5-063 [P1] Full regression: all 158+ existing tests pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-S5-070 [P1] Spec/plan/tasks synchronized
- [ ] CHK-S5-071 [P1] Code comments adequate
- [ ] CHK-S5-072 [P1] Feature flags documented
- [ ] CHK-S5-073 [P1] Stage architecture documented in code

## Feature Flag Audit

- [ ] CHK-S5-074 [P1] **Feature flag count at Sprint 5 exit ≤6 verified**: List all active flags. Evidence: explicit flag inventory at exit gate.
  - Flags added this sprint: `SPECKIT_PIPELINE_V2`, `SPECKIT_EMBEDDING_EXPANSION`
  - Prior sprint flags reviewed for sunset eligibility (RSF_FUSION if RSF rejected at tau<0.4 in Sprint 3, etc.)
- [ ] CHK-S5-075 [P1] **Flag interaction matrix verified under PIPELINE_V2**: Pairwise coverage of PIPELINE_V2-interacting flags (RSF_FUSION, CHANNEL_MIN_REP, DOCSCORE_AGGREGATION, LEARN_FROM_SELECTION — 6 pairs × 2 states = 12 configs) + 1 all-flags-on run. Evidence: pairwise test matrix results + all-flags-on run showing no interaction regressions. (UT-7 R5)
- [ ] CHK-S5-076 [P1] **Flag sunset decisions documented with metric evidence**: Any flag retired this sprint has documented rationale (e.g., "RSF_FUSION retired — Kendall tau=0.28 < 0.4 threshold confirmed at Sprint 3").
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-S5-080 [P1] Temp files in scratch/ only
- [ ] CHK-S5-081 [P1] scratch/ cleaned before completion
- [ ] CHK-S5-082 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 43 | [ ]/43 |
| P2 Items | 3 | [ ]/3 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 6 of 8
Sprint 5: Pipeline Refactor
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
