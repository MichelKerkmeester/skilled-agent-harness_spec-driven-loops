---
title: "Feature Specification: Phase 19: fork-compact-pointer-research"
description: "A forked sub-agent carries its parent's session id, so the compact-pointer hook pointed a compacting fork at the parent's handoff note and reset the parent's nudge level. This phase researched the cause and gated the hook on the fork's own compaction record."
trigger_phrases:
  - "fork compact pointer research"
  - "phase 19 fork compact pointer research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: fork-compact-pointer-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/197-fork-compact-pointer-fix` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-outside-loop-handoff |
| **Successor** | None |
| **Handoff Criteria** | The fork guard ships with tests, and a replay of the six recorded fires suppresses the five fork fires and delivers the parent's |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the session relaunch loop specification.

**Scope Boundary**: the Claude compact-pointer hook, its adapter tests and its README paragraph.

**Dependencies**:
- Phase 018, which added the compact-pointer hook for sessions outside the loop.

**Deliverables**:
- `research/research.md`: a 10-iteration DeepSeek investigation, the orchestrator's verification and an independent Opus review.
- The fork guard in `claude/compact-pointer.mjs`, with four new adapter tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-10-21 the compact-pointer hook fired six times for session `0b9dc60c`. Five fires came from forked sub-agents compacting. A fork carries its parent's session id, so the hook pointed each fork at the parent's open handoff note and reset the parent's nudge level. The forks refused the claim on their own judgment, and `claimHandoff` would have accepted it.

### Purpose
A fork's compaction no longer reaches the parent's note or nudge level, and the parent's own compaction still gets its pointer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research the mechanism with file and transcript evidence.
- Gate the hook: skip with no transcript path, with a transcript not named after the session, and when a fork compacted in the last 5 seconds. Move the nudge-level reset after those guards.
- Tests for each skip and for the parent case, and a note in the hook README.

### Out of Scope
- `session-prime` and the PreCompact cache, which share a slot keyed by the parent's id. The research records this hazard, and it belongs to the spec-kit hooks.
- Refusing a fork's `claim` in `claimHandoff`. Nothing in the CLI's input tells a fork from its parent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modify | Fork guard, basename check, fail-closed missing path, reset after the guards |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Four new tests, and the existing pointer tests pass a transcript path |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The skip cases and their log lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fork's compaction emits no pointer and leaves the nudge level | The fork tests pass, and fail against the old hook |
| REQ-002 | The parent's own compaction still gets its pointer | The old-fork test passes, and the replay delivers the 19:03:48 fire |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every skip is visible | Each skip writes `compact-pointer-skipped` with its reason to relaunch.log |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replaying the six recorded fires gives five suppressed and the parent's 19:03:48 fire delivered.
- **SC-002**: The session-relaunch test suite passes in full.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code writes a fork's compaction record before the fork's SessionStart hook | If the order flips, a fork fire delivers again | All five recorded fork fires show the record 0.09 to 0.85 s before the hook |
| Risk | A parent and a fork compact within the same 5 s | Low | The parent's pointer is skipped and logged, and its note stays open |
| Risk | A fork's real `transcript_path` value is unconfirmed | Low | The guard suppresses a fork whether the path names the parent's transcript or the fork's |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which `transcript_path` a fork's SessionStart payload carries. A captured payload would confirm it, and the fix holds either way.
<!-- /ANCHOR:questions -->

---
