---
title: "Feature Specification: Doctor command audit and the fixes it recorded"
description: "Tracks the doctor command audit, guided environment setup, and repairs to its recorded findings."
trigger_phrases:
  - "doctor command audit findings"
  - "doctor environment switch setup"
  - "doctor retrieval index repairs"
  - "doctor release updater fixes"
  - "doctor gate coverage repairs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-doctor-audit-and-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: Doctor command audit and the fixes it recorded

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 036-doctor-audit-and-fixes |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Doctor commands were written against earlier paths and retired subsystems, leaving their current checks uncertain; the audit also recorded subsystem defects for follow-up. Stale retrieval data, unsettled release-update customization rules, and doctor gates with missing coverage or incorrect text could leave operators with misleading health reports even when checks passed.

### Purpose
Together these phases audit each doctor command against the current system, add a guided way to set documented environment switches, and address the recorded findings across retrieval, release updates, and doctor gates.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check current doctor commands against the system, retain or retire targets on evidence, and add guided `/doctor:env` setup.
- Address recorded retrieval, release-updater, doctor-gate, fixture, and reporting defects.

### Out of Scope
- Re-auditing targets where the audit recorded no defect.
- Doctor behavior unrelated to the audited findings and environment setup.

### Files to Change
Summary of the child phase folders and their changes.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-doctor-command-audit/` | Phase | 001-doctor-command-audit | Audit doctor commands and add guided environment-switch setup. |
| `002-doctor-audit-followups/` | Phase | 002-doctor-audit-followups | Address retrieval, release-update, and doctor-gate findings. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-doctor-command-audit/` | Audit doctor commands and guide environment switch setup | Complete |
| 2 | `002-doctor-audit-followups/` | Fix recorded retrieval, update-engine, and doctor-gate defects | Complete |
| 3 | `003-nested-skilled-root/` | Find the folder holding `.skilled` when it sits below another repository's git root | Complete |
| 4 | `004-symlink-relink-after-unlink/` | Let `/doctor:symlink` relink a project after an unlink by giving each apply its own run folder | Complete |
| 5 | `005-advisor-linked-project-workspace/` | Let the skill advisor serve a project linked with `/doctor:symlink` by admitting a workspace wired to its source tree | Complete |
| 6 | `006-doctor-update-local-state/` | Keep `/doctor:update` state in the ignored `.skilled/skills/.state/doctor-update/` so `.skilled/release/` stops shipping | Complete |
| 7 | `007-main-ci-repairs/` | Turn main's red Markdown Link Integrity, sk-doc Script Tests and Playbook Operator Contract workflows green | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` to resume a specific child phase folder
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-doctor-command-audit | 002-doctor-audit-followups | 001-doctor-command-audit validates on its own | `validate.sh --strict` on 001-doctor-command-audit |
| 002-doctor-audit-followups | 003-nested-skilled-root | 002-doctor-audit-followups validates on its own | `validate.sh --strict` on 002-doctor-audit-followups |
| 003-nested-skilled-root | 004-symlink-relink-after-unlink | 003-nested-skilled-root validates on its own | `validate.sh --strict` on 003-nested-skilled-root |
| 004-symlink-relink-after-unlink | 005-advisor-linked-project-workspace | 004-symlink-relink-after-unlink validates on its own | `validate.sh --strict` on 004-symlink-relink-after-unlink |
| 005-advisor-linked-project-workspace | 006-doctor-update-local-state | 005-advisor-linked-project-workspace validates on its own | `validate.sh --strict` on 005-advisor-linked-project-workspace |
| 006-doctor-update-local-state | 007-main-ci-repairs | 006-doctor-update-local-state validates on its own | `validate.sh --strict` on 006-doctor-update-local-state |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the child folders for each phase's spec.md, plan.md, and tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for doctor command audit and the fixes it recorded.
<!-- /ANCHOR:requirements -->
