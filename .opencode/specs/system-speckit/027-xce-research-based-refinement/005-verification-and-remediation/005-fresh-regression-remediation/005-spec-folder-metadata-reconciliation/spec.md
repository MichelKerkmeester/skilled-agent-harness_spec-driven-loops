---
title: "Feature Specification: Spec-Folder Control-Metadata Reconciliation"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: 8 findings (5 P1) in this subsystem, each carried as a task with its registry recommendation. Scaffold only — no fixes applied."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/spec.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase spec from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec-Folder Control-Metadata Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (findings carried as tasks; no fixes applied) |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Findings** | 8 (5 P1 / 3 P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; validate.sh --strict --recursive; description↔graph parity. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of `005-fresh-regression-remediation` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: `../../review/fresh-regression-75/deep-review-findings-registry.json`.

**Scope Boundary**: only findings assigned to this sub-phase by `fix-coverage.json`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced 8 findings in this subsystem. Left unaddressed they risk real defects (data integrity / lifecycle / safety) plus robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the 8 findings enumerated in tasks.md (and `fix-coverage.json`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (005-T001, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json:113`: Trigger a canonical save/update against the latest active child (007) so updatePhaseParentPointer refreshes the parent, or manually correct last_active_child_id/last_active_at.
- **R2** (005-T002, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/description.json:17-27`: Add "000-spec-tree-consolidation" to the children array in 000-release-cleanup/description.json, ideally before 001-public-root-readme to preserve numeric order.
- **R3** (005-T003, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/description.json:4-8`: Add "004-skill-advisor-suite-repair" to childTopology in 003-advisor-and-codegraph/description.json and regenerate per-folder descriptions for the parent.
- **R4** (005-T004, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/description.json:4-13`: Add "009-code-graph-code-only-indexing" to childTopology in 004-shared-infrastructure/description.json and regenerate per-folder descriptions for the parent.
- **R5** (005-T005, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:231`: Make updatePhaseParentPointersAfterSave walk the ancestor chain and refresh every phase parent, or run a tree-wide graph-metadata refresh after batch saves.
- **R6** (005-T006, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:62`: Add a forward note recording what happened to 028-code-graph-and-cocoindex after the 2026-05-28 split (renamed/abandoned; current track 028 is 028-memory-search-intelligence), or explicitly mark the s
- **R7** (005-T007, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation/backlog/p1-backlog.json:1715`: Add a v2_proof (citing bm25-baseline.ts:267 as resolved) and a p2_decision/p2_reason to entry idx for the NDCG-cutoff finding, and audit the other 7 untriaged downgrades for the same closure-rationale
- **R8** (005-T008, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-config.json:12`: Update status to completed (or remove the stale field) to align with the final registry.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- validate.sh --strict --recursive; description↔graph parity.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- Doc/metadata edits must keep validate.sh --strict green.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->
