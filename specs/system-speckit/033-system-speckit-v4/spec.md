---
title: "Feature Specification: system-speckit-v4"
description: "Phase parent for repo v4 of system-spec-kit: the twenty-four packets from the plan-preflight fix on 2026-08-15 through the metadata regeneration on 2026-09-06, consolidated in chronological order with a timeline, covering template reduction, validation-gate coherence, path containment, daemon hardening, the memory-database decommission and its landing, the runtime rename, and the integration research remediation."
trigger_phrases:
  - "system speckit v4"
  - "spec kit v4 timeline"
  - "memory decommission history"
  - "template reduction history"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Phase parent for repo v4 of system-spec-kit: the twenty-four packets from the plan-preflight fix through the metadata regeneration, consolidated in chronological order with a timeline

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None; track root `specs/system-speckit/` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates strict at its new slot, every live reference points at the new tree, the timeline names every packet's first and last commit, and the trigger index covers every child |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twenty-four packets shipped system-spec-kit's fourth generation between 2026-08-15 and 2026-09-06 as separate top-level folders numbered by creation order rather than by the order the work actually started, with names that said what was planned rather than what shipped. Anyone reading the track saw fragments; nothing showed the sequence.

### Purpose
Hold the twenty-four packets as phases in chronological order under one parent that a reader can call v4, with a timeline, literal names, and retrieval that reaches every child.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The twenty-four packets as children 001 to 024, numbered by first commit; nested phases keep their own structure with generic names made literal and 041's numbering gap closed.
- Every live reference repointed; changelogs, archives, lineages and scratch kept as recorded history.
- `timeline.md` with a chronological table and gantt built from git history.
- Trigger phrases and headings tuned for the ripgrep-first retrieval that replaced the memory database.

### Out of Scope
- Packet 051 (sk-doc, another track) and anything outside `specs/system-speckit`.
- Rewriting the children's content; only metadata rows, pointers and retrieval hooks change.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| 24 packets under this parent | Move | all | `git mv` into chronological slots with the approved names |
| `spec.md`, `description.json`, `graph-metadata.json` per packet | Modify, Regenerate | all | Back-reference rows, pointers, derived metadata |
| `timeline.md` | Create | parent | Chronological record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-plan-preflight-track-packets/ | was `034-plan-preflight-nested-packet-resolution`; first commit 2026-08-15, last 2026-09-04 | complete |
| 2 | 002-daemon-reaper-orphan-classification/ | was `035-process-reaper-classification-fix`; first commit 2026-08-22, last 2026-09-04 | complete |
| 3 | 003-spec-doc-template-reduction/ | was `036-spec-doc-template-reduction`; first commit 2026-08-26, last 2026-09-06 | draft |
| 4 | 004-decisions-and-notes-system/ | was `037-decisions-memory-redesign`; first commit 2026-08-26, last 2026-09-04 | draft |
| 5 | 005-skills-runtime-state-consolidation/ | was `038-skills-state-consolidation`; first commit 2026-08-28, last 2026-08-30 | complete |
| 6 | 006-derived-metadata-repair-tool/ | was `039-derived-repair-automation`; first commit 2026-08-28, last 2026-08-30 | in progress |
| 7 | 007-completion-gate-coherence/ | was `040-validation-gate-coherence`; first commit 2026-08-29, last 2026-08-30 | complete |
| 8 | 008-template-contracts-and-acceptance-criteria/ | was `033-spec-kit-template-optimization`; first commit 2026-08-29, last 2026-09-04 | in progress |
| 9 | 009-validation-rule-reduction/ | was `041-validation-reduction`; first commit 2026-08-29, last 2026-09-01 | complete |
| 10 | 010-goal-file-addon/ | was `042-nested-goal-template-addon`; first commit 2026-08-29, last 2026-09-04 | in progress |
| 11 | 011-graph-metadata-write-containment/ | was `043-workspace-path-containment`; first commit 2026-08-30, last 2026-09-02 | complete |
| 12 | 012-repair-write-symlink-refusal/ | was `044-repair-write-symlink-refusal`; first commit 2026-08-30, last 2026-09-02 | complete |
| 13 | 013-repair-handle-containment/ | was `046-path-containment-followups`; first commit 2026-08-30, last 2026-09-01 | complete |
| 14 | 014-daemon-and-test-harness-hardening/ | was `045-daemon-and-test-harness-hardening`; first commit 2026-08-30, last 2026-09-04 | complete |
| 15 | 015-apply-path-and-candidate-filter-fixes/ | was `047-review-remediation`; first commit 2026-08-31, last 2026-09-01 | complete |
| 16 | 016-sequential-thinking-residue-removal/ | was `048-decommissioned-server-residue`; first commit 2026-08-31, last 2026-09-02 | complete |
| 17 | 017-memory-database-decommission/ | was `049-memory-decommission`; first commit 2026-09-02, last 2026-09-05 | complete |
| 18 | 018-single-segment-packet-pointer/ | was `050-single-segment-packet-pointer`; first commit 2026-09-02, last 2026-09-02 | draft |
| 19 | 019-memory-decommission-branch-landing/ | was `052-memory-decommission-landing`; first commit 2026-09-04, last 2026-09-06 | complete |
| 20 | 020-runtime-package-rename/ | was `053-spec-kit-runtime-rename`; first commit 2026-09-04, last 2026-09-05 | complete |
| 21 | 021-decommission-debt-and-cli-nesting/ | was `054-decommission-debt-fixes`; first commit 2026-09-05, last 2026-09-05 | complete |
| 22 | 022-shared-containment-helper/ | was `055-path-containment-seam`; first commit 2026-09-05, last 2026-09-05 | complete |
| 23 | 023-trigger-index-root-and-drift-fixes/ | was `056-integration-research-remediation`; first commit 2026-09-06, last 2026-09-06 | complete |
| 24 | 024-metadata-regeneration-and-shared-parser/ | was `057-metadata-regeneration-and-parser-edges`; first commit 2026-09-06, last 2026-09-06 | complete |
| 25 | 025-docs-reality-alignment-research/ | ten-iteration research lane: playbook, catalog and references against the runtime | complete |
| 26 | 026-runtime-code-standards-research/ | ten-iteration research lane: shared and runtime code against the sk-code standards | complete |
| 27 | 027-doc-path-strict-mode-and-retired-capability-fixes/ | fourteen confirmed doc mismatches fixed at their cited lines | complete |
| 28 | 028-header-tags-hook-catch-and-script-test-fixes/ | confirmed code-standards deviations fixed; two scripts gain tests | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| any child | its successor | The child validates strict at its slot and its metadata names the parent | `validate.sh <child> --strict`; `graph-metadata.json` parent id |
| a research child | its remediation child | Ten iterations complete and every kept finding reproduced in-session | `research/confirmed-findings.md` present; `validate.sh <child> --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. Order is historical; see `timeline.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
