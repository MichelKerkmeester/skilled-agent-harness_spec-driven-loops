---
title: "Feature Specification: Phase 24: retention-tightening"
description: "Tighten the active goal-state retention default from 30 days to 2 days per operator directive, and perform a one-time manual sweep of the existing .goal-state directory to archive files that predate the new threshold."
trigger_phrases:
  - "goal state active retention 2 days"
  - "goal plugin retention tightening"
  - "manual goal-state archive sweep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/024-retention-tightening"
    last_updated_at: "2026-07-04T19:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Landed the 2-day retention default and the one-time archive migration"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-024-retention-tightening-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "2026-07-04, operator: archive scope is exactly the files older than 2 days at execution time (26 of 43), not a full unconditional reset — chosen because archiving is one-way at runtime (no auto-restore) and the directory is shared by concurrent sessions."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 24: retention-tightening

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 |
| **Predecessor** | 023-p2-hardening |
| **Successor** | none |
| **Handoff Criteria** | Default retention reduced to 2 days everywhere it is documented; full plugin suite green; the pre-existing `.goal-state` backlog manually reconciled to the new policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the Goal plugin packet: an operator-directed policy tightening, requested directly (not sourced from the dual-model review). The operator asked to (1) reduce the active-state sweep's staleness threshold from 30 days to 2 days, and (2) apply that policy retroactively to the `.opencode/skills/.goal-state` directory's existing backlog in one manual pass, since the automatic sweep only runs on `session.created` and would otherwise take up to an hour (plus however long until the shorter window naturally catches up) to reach every eligible file.

**Scope Boundary**: one constant change in `mk-goal.js` plus its two doc mirrors, and a one-time manual archive migration of the pre-existing backlog. No change to the sweep/archive/prune mechanics themselves (those were already hardened in phases 022/023).

**Dependencies**: none.

**Deliverables**:
- `DEFAULT_ACTIVE_RETENTION_DAYS` reduced from 30 to 2 in `mk-goal.js`
- `ENV_REFERENCE.md` and `goal_plugin.md` updated to state the new default
- The 26 pre-existing active-state files older than the new 2-day threshold moved into `.archive/`; the 17 files newer than the threshold left untouched

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator wants a much tighter active-goal retention window than the shipped 30-day default, and wants the existing backlog reconciled to that new window immediately rather than waiting for the automatic hourly sweep to catch up. Because `readGoal`/`restoreActiveGoal` never read from `.archive/` (confirmed by direct inspection), archiving a file is effectively a one-way move at runtime with no auto-restore; combined with `.goal-state` being shared across concurrent sessions in this repository, an unconditional "archive everything" pass risked silently dropping other sessions' live goal tracking. This was surfaced to the operator before acting, who confirmed the narrower scope: only files already older than 2 days.

### Purpose
The plugin's default active-state retention matches operator intent (2 days, documented consistently in code and both reference docs), and the pre-existing backlog is reconciled to that policy without disturbing any session's goal that was still within the new window.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `DEFAULT_ACTIVE_RETENTION_DAYS` from `30` to `2` in `mk-goal.js`
- Update the matching default value in `ENV_REFERENCE.md` and `goal_plugin.md`
- One-time manual archive migration: move every `.opencode/skills/.goal-state/*.json` file with an mtime older than the 2-day cutoff into `.goal-state/.archive/`, preserving filenames (matching `archiveGoalStateFile`'s own naming scheme) and the archive directory's `0700` mode

### Out of Scope
- Any change to the sweep/archive/prune algorithms themselves (untouched; only the retention-days constant changed)
- Files within the 2-day window (left active, per operator's explicit scope choice)
- Retroactively fsync-ing the manually-moved files the way the automated path does (a one-time manual admin action, not a repeated runtime path; verified via `ls`/count checks instead)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | `DEFAULT_ACTIVE_RETENTION_DAYS` 30 -> 2 |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Default column 30 -> 2 for `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Modify | Default column 30 -> 2 for `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` |
| `.opencode/skills/.goal-state/*.json` (26 files, runtime data) | Moved | Relocated to `.opencode/skills/.goal-state/.archive/`, not tracked in git |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The active-state retention default is 2 days everywhere it is stated | `mk-goal.js`, `ENV_REFERENCE.md`, and `goal_plugin.md` all show `2` for `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`'s default; full plugin suite stays green (no test hardcoded the old default) |
| REQ-002 | The pre-existing backlog is reconciled to the new 2-day policy without touching files inside the window | Exactly the files with mtime older than the cutoff move to `.archive/`; files within the window remain in the active directory; archive directory mode is `0700` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .opencode/plugins/tests/*.test.cjs` green before and after the constant change (110/110)
- **SC-002**: Active count + archive count sum to the pre-migration total, with the split matching the 2-day cutoff exactly
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unconditional "archive everything" would drop other concurrent sessions' live goal tracking with no auto-restore | High if done unconditionally | Surfaced to operator before acting; scope narrowed to only pre-2-day-old files, confirmed via `AskUserQuestion` |
| Risk | Shell word-splitting on a multi-line file list could mis-target `mv` | Low, but a first attempt did fail this way | First attempt failed safely (0 files moved, `mv` errored on an unsplit multi-line argument); redone with a `-print0`/`xargs -0` pipeline immune to word-splitting; verified post-move counts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope was settled via `AskUserQuestion` before the migration ran.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Predecessor**: `../023-p2-hardening/`
- **Related runtime data**: `.opencode/skills/.goal-state/` (not part of this spec-folder tree; referenced for context only)
<!-- /ANCHOR:cross-refs -->
