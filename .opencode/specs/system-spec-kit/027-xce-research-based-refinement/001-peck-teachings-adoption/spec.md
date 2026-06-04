---
title: "Feature Specification: Adopt low-risk peck teachings (T3 self-check templates, T4 current-state discipline, T2 constitutional rule review) into system-spec-kit"
description: "Phase parent: sequence the three lowest-risk peck-derived improvements (T3, T4, T2) as independently executable child phases. T1 (coverage gate) is deliberately excluded."
trigger_phrases:
  - "001-peck-teachings-adoption"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "planning-author"
    recent_action: "Authored phase map and per-phase child specs"
    next_safe_action: "Implement phase 001 (self-check templates)"
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
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Adopt low-risk peck teachings (T3 self-check templates, T4 current-state discipline, T2 constitutional rule review) into system-spec-kit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 027-xce-research-based-refinement |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase ships and passes validation independently; no change to the completion gate (T1, deferred) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 of this phase group analyzed the external `peck` framework and found four philosophy-neutral mechanisms worth adopting into system-spec-kit. Phases 002-004 implement the three lowest-risk of them as independently executable phases. The fourth — a per-criterion test-coverage completion gate (T1) — is deliberately excluded because it carries the largest blast radius and warrants its own packet.

### Purpose
Carry the source analysis (child phase 001) into action: ship the three lowest-risk peck-derived improvements in ascending-risk order, each independently verifiable, without touching the completion gate.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The source analysis (phase 001) plus the child phase manifest for adopting peck teachings T3, T4, and T2.
- Per-phase implementation details in child folders.

### Out of Scope
- T1 (per-criterion AC-coverage completion gate) — highest blast radius, separate future packet.
- Detailed per-phase implementation plans at the parent level.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `templates/manifest/{spec,plan,checklist}.md.tmpl` | Modify | 002 | Self-check + failure-mode guidance blocks |
| `scripts/rules/` + `validator-registry.json` | Modify | 003 | Advisory current-state content rule |
| `constitutional/*.md` + a review diagnostic | Modify/Create | 004 | Last-confirmed metadata + review surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-peck-teachings-for-spec-kit/ | Source analysis: peck teachings vs spec-kit gaps; defines T1-T4 (T1 deferred). | Complete |
| 2 | 002-self-check-templates/ | Add self-check + failure-mode guidance to the spec/plan/checklist manifest templates (T3). | Planned |
| 3 | 003-current-state-discipline/ | Broaden the current-state-only content rule beyond phase parents, advisory severity (T4). | Planned |
| 4 | 004-constitutional-rule-review/ | Add a read-only review surface listing constitutional rules with last-confirmed metadata (T2). | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-peck-teachings-for-spec-kit | 002-self-check-templates | Analysis complete; teachings T3/T4/T2 identified with per-teaching verdicts. | Report present + strict-validated |
| 002-self-check-templates | 003-current-state-discipline | Self-check blocks present in all three templates; a freshly scaffolded folder still passes strict validation. | `validate.sh --strict` on a throwaway scaffold |
| 003-current-state-discipline | 004-constitutional-rule-review | Advisory content rule registered; running it on existing folders adds no new errors. | `validate.sh` on a sample track |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- RESOLVED (phase 001 research — see `001-peck-teachings-for-spec-kit/research/research.md`): the T3 → T4 → T2 order is risk-based and the phases are technically independent (none hard-blocks another). Per-phase decisions are folded into the child specs: T3 = HTML-comment guidance (no line-start `## `), T4 = INFO severity scoped to implementation-summary.md first, T2 = standalone read-only diagnostic with `last_confirmed` + provenance.
- RESOLVED (continuation iteration 043): keep T3 → T4 → T2. T4 implementation must reconcile the child spec's `INFO` wording with the current validator registry severity vocabulary before coding; using the existing warning severity with strict-mode handling is acceptable if documented in the child implementation summary.
- Deferred T1 remains out of scope here; its future packet should use a two-verdict design (per-AC traceability table + a separate fresh-context reviewer), warn-only rollout, and per-level opt-in.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Source analysis**: See `001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
