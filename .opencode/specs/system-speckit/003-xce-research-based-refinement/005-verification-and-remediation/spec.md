---
title: "Feature Specification: Verification and Remediation (Phase Parent)"
description: "Phase-parent for the verify-first remediation and research programs: epic finding remediation, tri-system deep research, deep-research remediation, residual design units, fresh+regression remediation, deep-review 017-021 remediation, and release-alignment review."
trigger_phrases:
  - "027 verification and remediation"
  - "finding remediation"
  - "tri-system deep research"
  - "deep research remediation"
  - "residual design units"
  - "fresh regression remediation"
  - "deep review 017-021 remediation"
  - "release alignment review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconcile phase map + metadata to all 7 direct children with evidence-based status"
    next_safe_action: "Resume or validate a child phase folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives, renamed-from, X to Y history
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Verification and Remediation (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 027 program produced review and research evidence that had to become terminal, verified work queues rather than assumed-true claims. The epic finding remediation, the tri-system deep-research sweep, the deep-research remediation, the residual high-blast-radius design units, the fresh+regression remediation, the deep-review 017-021 remediation, and the release-alignment review all share a single verify-first doctrine, so they belong under one themed parent.

### Purpose
Own the verification-and-remediation child phases so each can be resumed and validated independently while the parent keeps the phase map, lane status, and handoff order visible.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below. For the consolidation/migration history of this decomposition, see the root `../context-index.md` and `../timeline.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify-first remediation of unadjudicated epic-sweep findings across subsystem lanes.
- Tri-system deep-research program and its adjudicated claim registry.
- Deep-research and command-adherence remediation lanes, and the residual design units deferred for blast radius.
- Fresh+regression deep-review remediation, deep-review 017-021 remediation, and the release-alignment review (READMEs and code vs 027 reality, plus its remediation lanes).

### Out of Scope
- Feature hardening at the parent level (tracks 002-004).
- Implementation detail at the parent level.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| child phase folders `[0-9][0-9][0-9]-*/` | Modify/Create | all | Per-phase implementation lives in the child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-finding-remediation/` | Verify-first remediation of every unadjudicated epic-sweep finding across eight subsystem lanes (nested phase parent; all 8 lane children shipped) | Phase Parent |
| 002 | `002-tri-system-deep-research/` | Tri-system deep-research program — read-only angles across spec-kit, code-graph, skill-advisor | Complete |
| 003 | `003-deep-research-remediation/` | Verify-first remediation of the deep-research and command-adherence backlog across nine lanes; L1 + L8 shipped, several lanes still queued | In Progress |
| 004 | `004-residual-design-units/` | Residual design units deferred from the remediation program because each touched a high-blast-radius subsystem | Complete |
| 005 | `005-fresh-regression-remediation/` | Fresh+regression deep-review remediation across seven sub-phases (nested phase parent); lanes 001/003/004/005/007 shipped, lane 006 partial, lane 002 planning-only | In Progress |
| 006 | `006-deep-review-017-021-remediation/` | Deep-review 017-021 remediation packet; authoring (docs + metadata) complete, per-file fixes not yet applied | In Progress |
| 007 | `007-release-alignment-review/` | Release-alignment review (READMEs and code vs 027 reality) plus remediation; nested phase parent — review-output children complete, remediation children shipped | Phase Parent |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| (per-child) | (next child) | Each child ships and validates independently under tolerant policy | Per-child strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open at the parent level; per-phase questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
