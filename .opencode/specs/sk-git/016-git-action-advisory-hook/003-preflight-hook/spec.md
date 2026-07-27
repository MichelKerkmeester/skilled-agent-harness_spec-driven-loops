---
title: "Feature Specification: Preflight Hook"
description: "A git preflight advisory script wired into the existing PreToolUse Bash array, evaluating repository state before the command runs."
trigger_phrases:
  - "preflight-hook"
  - "git advisory preflight-hook"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/003-preflight-hook"
    last_updated_at: "2026-07-27T21:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase scope; detail awaits research output"
    next_safe_action: "Wait for phase 001 research to land"
    blockers:
      - "Depends on phase 001 research output"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-3"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Preflight Hook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-rule-encoding |
| **Successor** | 004-pathspec-integrity |
| **Handoff Criteria** | See the parent Phase Documentation Map |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Git action advisory hook specification.

**Scope Boundary**: A `git-preflight-advisory.mjs` sibling of the cli-opencode lint, added to the existing PreToolUse Bash hook array.

**Dependencies**: Phase 001 research output. This phase is deliberately thin until that lands — writing the detail now would mean inventing the answers the research exists to find.

**Deliverables**: See requirements below.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Encoded rules do nothing until something evaluates them against a real command and real repository state. The cli-opencode lint proves the pattern; git has no equivalent.

### Purpose

Surface the relevant rule at the moment the git command is typed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `git-preflight-advisory.mjs` sibling of the cli-opencode lint, added to the existing PreToolUse Bash hook array.

### Out of Scope
- Any new hook infrastructure. The PreToolUse mechanism exists and is proven.
- Blocking behaviour. The pre-commit, commit-msg and pre-push hooks own enforcement; this packet advises.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| To be determined by phase 001 research | Pending | The research names the surfaces this phase touches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hook advises and never blocks | A rule match prints an advisory; the command still runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The hook evaluates real repository state | Dirty count, detached or linked-worktree HEAD, and active account versus remote owner are read live |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hook fires on a real matching command without blocking it
- **SC-002**: Advisory volume stays under the threshold phase 001 recommends
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 research | Blocks this phase entirely | Phase 001 is in flight |
| Risk | An advisory that fires often enough to be skimmed past, which is worse than none | Med | Named in phase 001 requirements |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by phase 001 research output.
<!-- /ANCHOR:questions -->
