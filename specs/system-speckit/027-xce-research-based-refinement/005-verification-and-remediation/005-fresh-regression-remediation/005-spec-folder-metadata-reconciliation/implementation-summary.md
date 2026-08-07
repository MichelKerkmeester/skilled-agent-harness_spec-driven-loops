---
title: "Implementation Summary: Spec-Folder Control-Metadata Reconciliation"
description: "Planning-only status for this remediation sub-phase: 8 findings carried as tasks; no fixes applied yet."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/005-spec-folder-metadata-reconciliation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "remediation-implementer"
    recent_action: "Reconciled 8 spec-folder control-metadata findings; strict validation green"
    next_safe_action: "None; sub-phase complete"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Spec-Folder Control-Metadata Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete — 8/8 findings fixed, verification green |
| **Date** | 2026-06-16 |
| **Findings carried** | 8 |
| **Resolution** | 8 fixed, 0 refuted (all confirmed real against the live tree) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 8 spec-folder control-metadata findings reconciled (sourced from `../../../review/fresh-regression-75/deep-review-findings-registry.json`, filtered via `../fix-coverage.json` phase `005-spec-folder-metadata-reconciliation`). Each was confirmed real against the live file/tree before editing; none were refuted. Files changed:

| Finding | File | Change |
|---|---|---|
| 005-T002 | `000-release-cleanup/description.json` | Added missing live child `000-spec-tree-consolidation` (preserved numeric order); parity 10/10 |
| 005-T003 | `003-advisor-and-codegraph/description.json` | Added missing live child `004-skill-advisor-suite-repair` to childTopology; parity 4/4 |
| 005-T004 | `004-shared-infrastructure/description.json` | Added missing live child `009-code-graph-code-only-indexing` to childTopology; parity 9/9 |
| 005-T001 | `001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json` | Advanced frozen pointer to latest-active child `007-acceptance-coverage-gate` + its `last_active_at` |
| 005-T005 | `graph-metadata.json` (027 root) | Advanced stale pointer to latest-saved child `003-advisor-and-codegraph` + its `last_active_at` (metadata value only; generator code-change is out of scope) |
| 005-T006 | `context-index.md` | Marked the "027→028 Split" section as a historical record; rewrote dangling present-tense pointer to `028-code-graph-and-cocoindex` (nonexistent) into past-tense with real fate (track-028 is `028-memory-search-intelligence`) |
| 005-T007 | `005-verification-and-remediation/001-finding-remediation/backlog/p1-backlog.json` | NDCG-cutoff entry (`p1[95]`) upgraded `downgraded_p2`→`downgraded_p2_v2` + added v2_proof/p2_decision/p2_reason; audited siblings (no remaining gap) |
| 005-T008 | `005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-config.json` | Set stale `status: running`→`completed` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per `plan.md`: confirm → fix → verify. Each finding's cited file:line was re-opened and confirmed against the live tree before any edit. description.json omissions were surgically patched (no `generate-description.js --root` regen, avoiding subtree over-reach). Phase-parent pointers were corrected to the genuinely latest-active child, preserving each file's existing id convention (bare slug for the peck-teachings parent, full packet_id for the 027 root). The context-index and backlog/config edits were targeted text changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Per operator directive, every finding is carried (refuted as hardening, asserted fix-as-stated).
- Fixes mirror existing correct sibling patterns where available.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Implementation verification complete:

- **`validate.sh --strict --recursive`** on every touched parent: `000-release-cleanup` 11/11, `003-advisor-and-codegraph` 5/5, `004-shared-infrastructure` 10/10, `001-peck-teachings-adoption` 8/8 — all exit 0, 0 failures. `--strict` on 027 root, `001-finding-remediation`, `002-tri-system-deep-research` all PASSED.
- **Baseline→delta:** all 7 touched folders were Errors:0 Warnings:0 before edits and remain Errors:0 Warnings:0 after — zero regressions.
- **description↔graph parity:** confirmed equal for all three parents (10/10, 4/4, 9/9); both corrected pointers resolve to existing child directories.
- **JSON validity:** all 7 edited JSON files re-parse cleanly.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- 005-T005 fixed only the stale metadata pointer **value**; the generator-side recommendation (make `updatePhaseParentPointersAfterSave` walk the ancestor chain) is production code outside this metadata sub-phase's scope and is not addressed here. The corrected root pointer can drift again on the next non-walking batch save.
- Phase-parent `last_active_child_id` recency is not enforced by `validate.sh` (it only checks the pointer resolves to a real child folder), so these recency corrections are not regression-guarded by the gate.
- The codebase has a field-name inconsistency (`derived.ln_id` in the newer schema/fixtures vs `derived.last_active_child_id` in these live 027 files); edits preserved the field the live files + the active validator (`check-graph-metadata-shape.sh`) actually use. Reconciling that naming is out of scope.
<!-- /ANCHOR:limitations -->
