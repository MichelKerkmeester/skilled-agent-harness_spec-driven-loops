---
title: "Tasks: Spec-Folder Control-Metadata Reconciliation"
description: "One task per deep-review finding in this sub-phase (8 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/tasks.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Spec-Folder Control-Metadata Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] 005-S1 Capture the subsystem test/validation baseline.
- [ ] 005-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [ ] 005-T001 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json:113` — Trigger a canonical save/update against the latest active child (007) so updatePhaseParentPointer refreshes the parent, or manually correct last_active_child_id/last_active_at. _[asserted — fix as stated]_
- [ ] 005-T002 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/description.json:17-27` — Add "000-spec-tree-consolidation" to the children array in 000-release-cleanup/description.json, ideally before 001-public-root-readme to preserve numeric order. _[asserted — fix as stated]_
- [ ] 005-T003 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/description.json:4-8` — Add "004-skill-advisor-suite-repair" to childTopology in 003-advisor-and-codegraph/description.json and regenerate per-folder descriptions for the parent. _[asserted — fix as stated]_
- [ ] 005-T004 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/description.json:4-13` — Add "009-code-graph-code-only-indexing" to childTopology in 004-shared-infrastructure/description.json and regenerate per-folder descriptions for the parent. _[asserted — fix as stated]_
- [ ] 005-T005 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:231` — Make updatePhaseParentPointersAfterSave walk the ancestor chain and refresh every phase parent, or run a tree-wide graph-metadata refresh after batch saves. _[asserted — fix as stated]_
- [ ] 005-T006 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:62` — Add a forward note recording what happened to 028-code-graph-and-cocoindex after the 2026-05-28 split (renamed/abandoned; current track 028 is 028-memory-search-intelligence), or explicitly mark the s _[P2]_
- [ ] 005-T007 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation/backlog/p1-backlog.json:1715` — Add a v2_proof (citing bm25-baseline.ts:267 as resolved) and a p2_decision/p2_reason to entry idx for the NDCG-cutoff finding, and audit the other 7 untriaged downgrades for the same closure-rationale _[P2]_
- [ ] 005-T008 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-config.json:12` — Update status to completed (or remove the stale field) to align with the final registry. _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] 005-V1 validate.sh --strict --recursive; description↔graph parity.
- [ ] 005-V2 Whole-gate delta reported (no regressions).
- [ ] 005-V3 Update each finding's status in the registry (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 8 findings resolved (fixed or refuted-with-reason); verification gate green. No fixes applied in this scaffold.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
