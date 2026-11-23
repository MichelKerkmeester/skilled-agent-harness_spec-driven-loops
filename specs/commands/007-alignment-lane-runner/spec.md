---
title: "Feature Specification: Alignment lane runner"
description: "Series parent for changes to run-lanes.cjs, the private lane runner that /local-skilled-alignment and /local-doc-alignment share: how it reads a lane's result and which executor kinds it can dispatch."
trigger_phrases:
  - "alignment lane runner phase parent spec"
  - "run-lanes.cjs changes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/007-alignment-lane-runner"
    last_updated_at: "2026-11-23T18:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Series parent created with the result parser as child 001 and the cli-devin lane as child 002"
    next_safe_action: "Work child 002-devin-lane"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-alignment-lane-runner"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Alignment lane runner

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 007-alignment-lane-runner |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child passes `validate.sh --strict` and the lane runner's tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two private alignment commands, `/local-skilled-alignment` and `/local-doc-alignment`, send their review lanes and critic through one runner, `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs`. Each change to that runner is small and separate. One fixed how it reads a lane's findings out of model output, and the next adds an executor kind. Recording them as unrelated top-level packets would split the runner's history across the track.

### Purpose
Keep every change to `run-lanes.cjs` in one place, one child per change, so a reader finds the runner's whole history under one parent.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Changes to `run-lanes.cjs`, its tests and the executor presets in `executors.json` that it reads.
- The workflow and command docs of the two alignment commands where they name the kinds or presets the runner accepts.

### Out of Scope
- The alignment commands' scope, check and report scripts, except where a runner change must reach them.
- The deep-loop runtime that the runner calls. A change there belongs to the deep-loop packets.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` | Modify | 001, 002 | Result parser, then the cli-devin kind |
| `.skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` | Modify | 001, 002 | Tests for each change |
| `.skilled/commands/assets/local-skilled-alignment/executors.json` | Modify | 002 | A `devin` preset |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-alignment-lane-result-parser/ | Recover the last top-level findings object from lane output | Complete |
| 2 | 002-devin-lane/ | Run lanes on cli-devin through the deep-loop runtime's shared Devin builder | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-alignment-lane-result-parser | 002-devin-lane | The runner recovers a lane's findings object from noisy output, so a new kind's output is read the same way | `node --test .skilled/commands/assets/local-skilled-alignment/tests/` passes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The series closes when the runner has no further planned change.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks one child per change to `run-lanes.cjs`.
<!-- /ANCHOR:requirements -->
