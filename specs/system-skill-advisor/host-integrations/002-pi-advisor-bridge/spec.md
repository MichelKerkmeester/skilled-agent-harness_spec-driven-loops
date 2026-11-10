---
title: "Feature Specification: Pi advisor bridge: brief restore and stderr diagnostic"
description: "Restores Pi advisor recommendations and keeps hook diagnostics out of Pi's terminal input."
trigger_phrases:
  - "pi advisor brief restoration"
  - "pi recommendation dedup receipt"
  - "pi advisor diagnostic stderr"
  - "pi prompt input json diagnostic"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/002-pi-advisor-bridge"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-pi-advisor-bridge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Pi advisor bridge: brief restore and stderr diagnostic

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 026-pi-advisor-bridge |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi prompt hook failed to deliver skill suggestions because it could not find the advisor CLI assets and its dedup receipt ignored recommendation changes. The in-process hook also wrote JSON diagnostics to Pi's shared terminal stream, placing data on the input line.

### Purpose
These children restore the advisor brief and recommendation updates, then direct diagnostic output away from Pi's terminal while keeping the persisted diagnostic record.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `001-restore-pi-advisor-brief/` probes either root for warm-CLI assets and keys dedup receipts on the full recommendation.
- `002-pi-advisor-diagnostic-stderr/` keeps the in-process hook from writing diagnostic JSON to Pi's terminal.

### Out of Scope
- Changing the other runtime hook paths, which run the hook as a subprocess.
- Changing persisted diagnostics or directive-lifecycle reset behavior.

### Files to Change
The rows below identify each child packet and the change it covers.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-restore-pi-advisor-brief/` | Phase | 001-restore-pi-advisor-brief | Restore recommendations and deduplicate the full contribution |
| `002-pi-advisor-diagnostic-stderr/` | Phase | 002-pi-advisor-diagnostic-stderr | Keep diagnostic output off Pi's terminal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-restore-pi-advisor-brief/` | Restore recommendations and deduplicate the full contribution | Implemented |
| 2 | `002-pi-advisor-diagnostic-stderr/` | Keep diagnostic JSON off Pi's terminal input | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` with a child folder path to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-restore-pi-advisor-brief | 002-pi-advisor-diagnostic-stderr | 001-restore-pi-advisor-brief validates on its own | validate.sh --strict on 001-restore-pi-advisor-brief |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the child folders for per-phase spec.md, plan.md and tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for pi advisor bridge: brief restore and stderr diagnostic.
<!-- /ANCHOR:requirements -->
