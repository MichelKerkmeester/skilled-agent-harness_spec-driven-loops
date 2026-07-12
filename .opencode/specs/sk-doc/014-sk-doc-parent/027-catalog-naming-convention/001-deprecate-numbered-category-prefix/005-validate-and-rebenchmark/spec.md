---
title: "Spec: end-to-end validation, link-guard, and Lane C benchmark regression proof"
description: "Phase 005, the gate. After the migration executes, prove nothing regressed: recursive validate.sh --strict across every touched skill (with catalog/playbook leaves still classified as their typed documents), the whole-workspace markdown-link CI guard, any hard-coded-path tests, and a re-run of the Lane C smart-routing benchmark on affected skills compared against a pre-migration baseline captured before Phase 004. Finally prove the no-new-numbers guard fires by attempting a fresh numbered folder."
trigger_phrases:
  - "validate de-numbering migration"
  - "benchmark regression proof de-numbering"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Capture baseline before Phase 004"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: End-to-End Validation & Benchmark Regression Proof

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `004-execute-migration`; successor none (final phase).

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 025/005-validate-and-rebenchmark |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 005 of 005 (gate) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The migration touches ~6,500 references and the sk-doc validator's leaf classification. This phase is the gate
that proves the deprecation caused no regression: validation still classifies every catalog/playbook leaf as its
typed document, links still resolve, hard-coded-path tests still pass, and the Lane C smart-routing benchmark
scores the affected skills no worse than before. A regression here blocks the packet's completion claim.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope:** capture a pre-migration Lane C baseline (before Phase 004 runs); after Phase 004 — recursive
`validate.sh --strict` on every touched skill's spec surface; the whole-workspace markdown-link guard; the
hard-coded category/leaf-path tests flagged in research.md; a Lane C benchmark re-run on affected skills with a
before/after delta; and a guard proof (create a throwaway `NN--` category folder → the guard must FAIL, then
remove it).

**Out of scope:** authoring or running the migration (Phases 003–004); fixing any regression found is done in
the owning phase, not invented here.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Recursive `validate.sh --strict` is Errors 0 across the parent packet and every touched skill surface.
- **R2:** Every catalog/playbook leaf is still classified as `feature_catalog` / `playbook_feature` (not
  downgraded to `readme`) — spot-checked per skill family.
- **R3:** The whole-workspace markdown-link guard passes (no dangling links from the rename).
- **R4:** The Lane C benchmark on affected skills shows no scoring regression versus the pre-migration baseline;
  any delta is explained.
- **R5:** The no-new-numbers guard FAILS on a freshly-created `NN--` category folder and PASSES once removed.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Recursive `--strict` Errors 0; leaf classification confirmed per family.
2. Link guard green; hard-coded-path tests green.
3. Benchmark before/after captured with a non-regressing delta; guard proof demonstrated.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *"No regression" without a baseline is unfalsifiable* → the Lane C baseline is captured BEFORE Phase 004 and
  the whole gate is re-run after, reporting the delta (regression-baseline-and-delta discipline).
- *Depends on* Phases 002–004 being complete; uses the Lane C harness unchanged.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
Which skills are "affected" for the benchmark is derived from the migration's per-family touch list.
<!-- /ANCHOR:questions -->
