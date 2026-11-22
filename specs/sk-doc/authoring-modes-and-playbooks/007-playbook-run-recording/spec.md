---
title: "Feature Specification: Playbook run recording: save manual testing playbook results into benchmark reports and enforce it"
description: "Manual testing playbook runs leave no saved results unless someone writes them by hand. This program adds a recorder that writes the run into the skill benchmark folder, makes the validator enforce the results contract and backfills the contract into every playbook."
trigger_phrases:
  - "playbook run recording phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording"
    last_updated_at: "2026-11-22T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "da5c810b-9095-42b1-8923-c83799a0919f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Playbook run recording: save manual testing playbook results into benchmark reports and enforce it

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/514-playbook-run-recording` |
| **Parent Spec** | None, this is a phase parent in the `sk-doc/authoring-modes-and-playbooks` sub-track |
| **Parent Packet** | sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording |
| **Predecessor** | 004-conversation-playbook-scenarios |
| **Successor** | None |
| **Handoff Criteria** | The recorder writes a run folder and its index row, the validator fails a root without the results marker, and every playbook root carries the marker |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-create-manual-testing-playbook` mode says a scenario run is incomplete until its verdict is recorded under the skill's `benchmark/reports/`. Nothing makes that happen. No script writes a run folder or its index row, the conversation runner leaves its results in a scratch folder outside the repository, the validator only warns when a playbook leaves the rule out, and 11 of the 59 playbook roots leave it out. The mode's `SKILL.md` says reports are written by hand while its template says they are never hand-authored. Runs therefore leave nothing behind unless the operator asks, as happened in the browser hub packet, where the Chrome DevTools playbook had 5 of 30 scenarios recorded.

### Purpose
Every playbook run ends with its verdicts saved in the skill's benchmark folder through one command, and a playbook that drops the results rule fails validation.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A recorder script that writes a dated run folder and its index row from verdict records or from the conversation runner's output.
- The conversation runner naming its scenario and printing the recorder command when it ends.
- A validator error for a root without the results marker, and an opt-in coverage report.
- One consistent results contract across `SKILL.md`, the templates and the playbook roots.
- Adding the marker to the 11 roots that lack it.

### Out of Scope
- Running any playbook scenario. This program saves results, it does not produce them.
- Making coverage a default failure. Most playbooks are partly run, and the request was for saved output.
- Rewriting existing run reports into the recorder's format.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs` | Create | 001-run-recorder-and-validator | The recorder |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/{validate-playbook-package,run-conversation-scenario}.cjs` and their tests | Modify | 001-run-recorder-and-validator | Marker error, coverage report, runner hand-off |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/{SKILL.md,assets/*.md}` | Modify | 001-run-recorder-and-validator | One results contract |
| 11 `manual-testing-playbook/manual-testing-playbook.md` roots | Modify | 002-playbook-marker-backfill | The results marker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-run-recorder-and-validator/ | Recorder script, runner hand-off, validator enforcement and the mode's docs | Complete |
| 2 | 002-playbook-marker-backfill/ | The results marker in the 11 roots that lack it | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-run-recorder-and-validator | 002-playbook-marker-backfill | The validator reports a missing marker as an error, and the template marker text is final | `validate-playbook-package.cjs` exits 1 and names `RESULT_PERSISTENCE_MARKER_MISSING` for the 11 roots |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator chose the two phases, the backfill and the worktree on 2026-11-22.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
