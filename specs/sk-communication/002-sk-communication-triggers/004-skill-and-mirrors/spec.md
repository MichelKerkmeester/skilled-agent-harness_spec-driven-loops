---
title: "Feature Specification: Phase 4: SKILL note and cross-runtime mirrors"
description: "A targeted sk-communication SKILL.md subsection documents the two trigger commands, and both commands are mirrored into the Claude and Cursor runtimes, keeping the default-off invariant intact."
trigger_phrases:
  - "sk-communication skill note"
  - "trigger command mirrors"
  - "cross-runtime command mirror"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/004-skill-and-mirrors"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Added SKILL note and runtime mirrors"
    next_safe_action: "Run final recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-skill-and-mirrors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The SKILL update is a single additive subsection; the default-off statement is untouched."
      - "Claude and Cursor use symlinks; the .codex/prompts stub mirror is deferred."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: SKILL note and cross-runtime mirrors

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 10 |
| **Predecessor** | 003-rewrite-response-by-external-agent |
| **Successor** | 005-external-cli-provider |
| **Handoff Criteria** | The SKILL subsection is present, the default-off statement is intact, and both commands resolve in the Claude and Cursor runtimes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-communication trigger commands packet.

**Scope Boundary**: A single additive SKILL.md subsection and the symlink mirrors. No routing, rules, or default-off behavior in the skill is changed.

**Dependencies**:
- Phases 002 and 003 shipped the two commands under `.opencode/commands/`.
- The verified mirror model: `.claude` and `.cursor` symlink into the canonical command.

**Deliverables**:
- An "Operator Trigger Commands" subsection in `sk-communication/SKILL.md`.
- `.claude` and `.cursor` symlink mirrors for both commands.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two commands existed under `.opencode/commands/` but were undocumented in the skill and unmirrored, so operators had no in-skill pointer to the trigger surface and the commands were not invokable across runtimes.

### Purpose
Document the trigger surface in `SKILL.md` with a targeted subsection and mirror both commands into the Claude and Cursor runtimes, without changing the skill's default-off behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One additive `### Operator Trigger Commands` subsection in `sk-communication/SKILL.md`.
- `.claude` and `.cursor` symlink mirrors for both commands.

### Out of Scope
- Any change to the skill's routing, rules, or default-off gate.
- The `.codex/prompts/` stub mirror, deferred pending the stub-generation mechanism.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/SKILL.md` | Modify | Add the "Operator Trigger Commands" subsection. |
| `.claude/commands/`, `.cursor/commands/` | Create | Symlink mirrors for both commands. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The SKILL update is additive and preserves default-off. | The subsection is added and the "Projection is off by default" statement is unchanged. |
| REQ-002 | Both commands resolve in the Claude runtime. | `.claude/commands/` symlinks for both commands resolve to the canonical files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both commands resolve in the Cursor runtime. | `.cursor/commands/` symlinks for both commands resolve. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The SKILL.md subsection documents both commands and their invariants.
- **SC-002**: The default-off statement in SKILL.md is intact.
- **SC-003**: Both commands resolve through their `.claude` and `.cursor` mirrors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The edit disturbs skill routing text | Medium | The change is one additive subsection; the rest of the skill is untouched. |
| Dependency | The verified symlink mirror model | Low | Mirrors follow the established `../../.opencode/commands/` convention. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The `.codex/prompts/` mirror uses a generated stub, not a symlink; wiring it is deferred until the stub-generation mechanism is confirmed.
<!-- /ANCHOR:questions -->
