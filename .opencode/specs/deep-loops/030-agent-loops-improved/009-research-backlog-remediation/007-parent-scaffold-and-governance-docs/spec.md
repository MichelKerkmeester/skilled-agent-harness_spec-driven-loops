---
title: "Feature Specification: Parent Scaffold and Governance Docs"
description: "Author real content for 008-parent's still-template tasks.md/implementation-summary.md, and write the 2 missing ADR decision-record.md files (plus checklist.md where required)."
trigger_phrases:
  - "parent scaffold authoring"
  - "008 parent template scaffolds"
  - "missing ADR decision record"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/007-parent-scaffold-and-governance-docs"
    last_updated_at: "2026-07-01T08:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-015, F-008/G-007 (Tier1 #11,#13)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - "008-loop-systems-remediation/tasks.md"
      - "008-loop-systems-remediation/implementation-summary.md"
      - "003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/"
      - "003-deep-loop-workflows/005-anchor-ownership-conflict-adr/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parent Scaffold and Governance Docs

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 |
| **Predecessor** | 006-review-registry-and-metadata-backfill |
| **Successor** | 008-convergence-threshold-and-forced-depth-flag |
| **Handoff Criteria** | `008-loop-systems-remediation/tasks.md` and `implementation-summary.md` contain real, aggregated content (not template placeholders); both ADR folders have a `decision-record.md` and, where required by their Level, a `checklist.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`008-loop-systems-remediation/tasks.md` and `implementation-summary.md` are confirmed (direct read) to still be raw, unmodified templates — `tasks.md`'s title is literally `"Tasks: Phase 1: loop-systems-remediation [template:level_1/tasks.md]"`, its continuity `packet_pointer` is `"scaffold/008-loop-systems-remediation"`, `last_updated_by: "template-author"` — despite the parent's own `spec.md` (already fixed during this remediation phase's own scaffolding) claiming `Status: Complete` and 7 completed children existing (`research/research_archive/20260701T071133Z-gen1/research.md` §4.2, F-015). Separately, 2 of 3 ADR-titled sub-phases in `003-deep-loop-workflows` — `003-cross-mode-anti-convergence-adr` and `005-anchor-ownership-conflict-adr` — confirmed (directory listing) have no `decision-record.md` file at all, and neither has a `checklist.md` despite carrying real (not scaffold) Complete-status work (§4.2, F-008/G-007).

### Purpose
Write real `tasks.md`/`implementation-summary.md` content for the 008 parent, aggregated honestly from its 7 completed children (not fabricated) — matching the pattern already established for the 001-reference-research phase-parent note ("this spec.md is the ONLY authored document at the parent level" does NOT apply to 008, which was scaffolded as a Level-1 non-phase-parent originally, per its own Level:1(phase parent) annotation, itself flagged as non-standard in F-018). Author the 2 missing ADR decision-records documenting the actual decisions those phases already shipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `008-loop-systems-remediation/tasks.md` with real tasks reflecting what its 7 children actually did (aggregate, don't duplicate full detail — one line per child pointing at its own tasks.md).
- Rewrite `008-loop-systems-remediation/implementation-summary.md` with a real summary aggregating what was built across all 7 children, verification evidence at the parent level (e.g. "all 7 children independently validate.sh clean"), and key decisions.
- Write `003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/decision-record.md` documenting the actual cross-mode anti-convergence decision that phase shipped (read its spec.md/implementation-summary.md for the real decision content — do not invent one).
- Write `003-deep-loop-workflows/005-anchor-ownership-conflict-adr/decision-record.md` similarly for the anchor-ownership conflict decision.
- Add `checklist.md` to both ADR folders if their Level (per the Documentation Levels table, Level 2+ needs one) requires it.
- Also correct the non-standard `**Level** | 1 (phase parent)` annotation on `008-loop-systems-remediation/spec.md` flagged in F-018 — a folder with 7 numbered children should read Level 2 per spec-kit convention (small, surgical correction, not a re-scaffold).

### Out of Scope
- The third ADR sub-phase, `002-convergence-profile-unification-adr`, which already has a `decision-record.md` (confirmed present) — no action needed there.
- Any other phase-parent's own tasks.md/implementation-summary.md (008 is the only one confirmed still in raw-template state; the root 030 packet's own parent correctly has NO tasks.md/implementation-summary.md by design, per phase-parent-mode policy).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `008-loop-systems-remediation/tasks.md` | Modify | Real aggregated tasks |
| `008-loop-systems-remediation/implementation-summary.md` | Modify | Real aggregated summary |
| `008-loop-systems-remediation/spec.md` | Modify | Fix non-standard Level annotation (F-018) |
| `003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/decision-record.md` (new) | Create | Real decision record |
| `003-deep-loop-workflows/005-anchor-ownership-conflict-adr/decision-record.md` (new) | Create | Real decision record |
| `003-deep-loop-workflows/{003,005}-*/checklist.md` (new, if Level requires) | Create | Checklists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `008` parent tasks.md/implementation-summary.md contain zero template placeholder text | `grep -i "template-author\|scaffold/008\|\[template:" ` on both files returns nothing |
| REQ-002 | Both ADR folders have a `decision-record.md` reflecting their actual shipped decision | File exists and its content matches what the phase's own spec.md/implementation-summary.md describe as the real decision — not boilerplate |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both ADR folders have a `checklist.md` if their Level requires one | File exists when Level >= 2, or the implementation summary documents why it's not required |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` on `008-loop-systems-remediation` and both ADR folders passes with no template-placeholder errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Accuracy | Aggregating 7 children's work into one parent summary risks over/under-claiming | Read every child's own implementation-summary.md before writing the parent aggregate; cite each child by name |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-015, F-008/G-007, F-018).
<!-- /ANCHOR:questions -->
