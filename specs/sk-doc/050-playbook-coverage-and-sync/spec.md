---
title: "Feature Specification: Manual testing playbook coverage and prompt sync"
description: "Adds manual test coverage for sk-doc modes and warns when scenario prompt copies disagree."
trigger_phrases:
  - "sk-doc manual testing coverage"
  - "playbook scenario prompt sync"
  - "prompt copy mismatch warning"
  - "operator scenario verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/050-playbook-coverage-and-sync"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-050-playbook-coverage-and-sync"
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

# Feature Specification: Manual testing playbook coverage and prompt sync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-01 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 050-playbook-coverage-and-sync |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Most sk-doc modes lacked a manual testing playbook, so no written scenarios defined correct behavior or gave operators a check to follow. The playbook rules also required matching prompt copies, but the validator checked only that a prompt existed. These gaps left regressions and prompt drift without a reliable warning.

### Purpose
Give each uncovered mode an operator-ready playbook and have the validator warn when a scenario's prompt copies disagree. Keep that warning advisory so existing drift does not fail CI.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add operator playbooks to the nine uncovered sk-doc modes.
- Add an advisory validator warning when a scenario's prompt copies disagree.

### Out of Scope
- Changing mode behavior while documenting what it already does.
- Making the prompt mismatch warning fail CI.

### Files to Change
Each row identifies one child phase and its purpose.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| specs/sk-doc/050-playbook-coverage-and-sync/001-sk-doc-playbook-coverage/ | Phase | 001-sk-doc-playbook-coverage | Adds operator playbooks to uncovered sk-doc modes. |
| specs/sk-doc/050-playbook-coverage-and-sync/002-playbook-prompt-sync/ | Phase | 002-playbook-prompt-sync | Warns when playbook prompt copies disagree. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-sk-doc-playbook-coverage/` | Manual test playbooks for uncovered sk-doc modes | Complete |
| 2 | `002-playbook-prompt-sync/` | Prompt copy synchronization warning in the package validator | Implemented |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use /speckit:resume with the parent and child folder to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-doc-playbook-coverage | 002-playbook-prompt-sync | 001-sk-doc-playbook-coverage validates on its own | validate.sh --strict on 001-sk-doc-playbook-coverage |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See each child folder for its per-phase spec.md, plan.md and tasks.md.
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for manual testing playbook coverage and prompt sync.
<!-- /ANCHOR:requirements -->
