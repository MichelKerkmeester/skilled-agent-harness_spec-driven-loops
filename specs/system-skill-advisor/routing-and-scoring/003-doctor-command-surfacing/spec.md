---
title: "Feature Specification: Doctor command guidance research and routing build"
description: "Researches doctor-command guidance and adds advisor routing that surfaces runnable doctor commands."
trigger_phrases:
  - "doctor command guidance research"
  - "advisor doctor command routing"
  - "doctor setup umbrella"
  - "runnable doctor target line"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-doctor-command-surfacing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Doctor command guidance research and routing build

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-15 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 030-doctor-command-surfacing |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor has no route to doctor commands, so plain setup and health prompts surface no command and domain prompts return only a skill. The research child found that route phrases were not used, while the routing child added generated bridges and a runnable command line.

### Purpose
The work defines how doctor guidance should fit advisor behavior and builds a read-only setup route with per-command recommendations. When a skill also fits, it stays first.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `001-doctor-command-guidance/` researches missing command guidance and identifies phrase ownership and baseline thresholds for review.
- `002-doctor-command-routing/` generates route bridges, adds the read-only `/doctor:setup` umbrella, renders runnable command targets and preserves passing routes.

### Out of Scope
- Changing advisor lane weights, thresholds or pinned corpora.
- Automatically invoking doctor commands; the advisor only suggests a runnable line.

### Files to Change
The rows below identify each child packet and the change it covers.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-doctor-command-guidance/` | Phase | 001-doctor-command-guidance | Research the missing doctor guidance and recommend a routing approach |
| `002-doctor-command-routing/` | Phase | 002-doctor-command-routing | Surface generated doctor commands while preserving passing routes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-doctor-command-guidance/` | Research missing doctor guidance and routing needs | Draft |
| 2 | `002-doctor-command-routing/` | Build doctor bridges and render runnable command targets | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` with a child folder path to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-doctor-command-guidance | 002-doctor-command-routing | 001-doctor-command-guidance validates on its own | validate.sh --strict on 001-doctor-command-guidance |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- 001-doctor-command-guidance remains Draft; owner sign-off for contested phrases and thresholds from the first baseline remain open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the child folders for per-phase spec.md, plan.md and tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for doctor command guidance research and routing build.
<!-- /ANCHOR:requirements -->
