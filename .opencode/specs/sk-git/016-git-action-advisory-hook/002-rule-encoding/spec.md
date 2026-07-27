---
title: "Feature Specification: Rule Encoding"
description: "Encode the sk-git rules the research confirms as advisable into hard_rules frontmatter, using the schema cli-devin already declares."
trigger_phrases:
  - "rule-encoding"
  - "git advisory rule-encoding"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/002-rule-encoding"
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
      session_id: "2026-07-27-sk-git-016-2"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule Encoding

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
| **Phase** | 2 of 4 |
| **Predecessor** | 001-advisory-research |
| **Successor** | 003-preflight-hook |
| **Handoff Criteria** | See the parent Phase Documentation Map |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Git action advisory hook specification.

**Scope Boundary**: Adding `hard_rules:` frontmatter to sk-git's SKILL.md for the rules research confirms as mechanically checkable.

**Dependencies**: Phase 001 research output. This phase is deliberately thin until that lands — writing the detail now would mean inventing the answers the research exists to find.

**Deliverables**: See requirements below.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-git declares no `hard_rules:` frontmatter, so the existing evaluator has nothing to read for git commands. Its rules live only as prose, reachable by prompt routing and never by the command itself.

### Purpose

Give the existing evaluator a rule set to read for git operations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adding `hard_rules:` frontmatter to sk-git's SKILL.md for the rules research confirms as mechanically checkable.

### Out of Scope
- Changing any sk-git rule's content. Encoding an existing rule is not rewriting it.
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
| REQ-001 | Every encoded rule traces to existing sk-git prose or an observed incident | No rule appears that research did not confirm as mechanically checkable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Rules parse under the existing parseHardRules() | Round-trip test: parse the frontmatter and assert the rule set matches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The encoded set matches the research-confirmed set exactly, with no invented additions
- **SC-002**: Every rule's message names the state it read, so the operator can judge it
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 research | Blocks this phase entirely | Phase 001 is in flight |
| Risk | Encoding a judgement-only rule as if it were mechanical, producing false positives | Med | Named in phase 001 requirements |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by phase 001 research output.
<!-- /ANCHOR:questions -->
