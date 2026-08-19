---
title: "Feature Specification: Phase 2: rewrite-response command"
description: "The /rewrite-response command makes the active AI re-render its own most recent reply into sk-communication plain English, entirely in-context, with no local or external LLM and no file writes."
trigger_phrases:
  - "rewrite-response"
  - "self-rewrite command"
  - "in-context plain english"
  - "sk-communication trigger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/002-rewrite-response"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Authored and verified command 1"
    next_safe_action: "Proceed to phase 003"
    blockers: []
    key_files:
      - ".opencode/commands/rewrite-response.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-rewrite-response"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Command 1 is a pure in-context prompt command with no package dependency and no allowed-tools."
      - "Default output is the rewrite only; --show-original adds the original above it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: rewrite-response command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-research-contracts |
| **Successor** | 003-rewrite-response-by-external-agent |
| **Handoff Criteria** | The command passes `validate_document.py --type command` and holds the no-LLM and display-only invariants. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-communication trigger commands packet.

**Scope Boundary**: This phase delivers command 1 only. It adds no package code and does not touch the projection pipeline. It is engine-independent and does not depend on the command 2 engine decision (Fork 1).

**Dependencies**:
- Phase 001 verified the plain-English rubric source (`COPY_EDITING_INSTRUCTION`) and the sk-create-command standard.
- The command is authored to the sk-create-command template and mirrored across runtimes per the verified symlink model.

**Deliverables**:
- `.opencode/commands/rewrite-response.md`, invocation `/rewrite-response`.
- Cross-runtime mirrors in `.claude/commands/` and `.cursor/commands/`.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-communication projection layer rewrites CLI output through a model, but a user has no way to ask the active AI to re-render its own reply in that plain-English style without invoking any model. There was no trigger surface for a self-applied, in-context rewrite.

### Purpose
Provide `/rewrite-response`: the active AI applies sk-communication's plain-English rubric to its own most recent reply, entirely in-context, using no local or external LLM. The result is a display-only projection; canonical transcript history and files stay unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One root slash command `/rewrite-response` authored to the sk-create-command standard.
- A self-contained plain-English rubric inside the command (no package dependency at runtime).
- Preservation of protected spans (code, paths, commands, URLs, numbers, identifiers, quoted values) byte-for-byte.
- An optional `--show-original` flag and structured `OK`/`NOOP`/`FAIL` status.
- Cross-runtime mirrors for `.claude` and `.cursor`.

### Out of Scope
- Any local or external LLM, CLI dispatch, or provider call.
- Any file write or canonical-state change; the command is display-only.
- The projection package and its pipeline; this command does not touch them.
- The `.codex/prompts/` stub mirror, deferred to the integration phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/rewrite-response.md` | Create | Command 1: in-context self-rewrite, no LLM, display-only. |
| `.claude/commands/rewrite-response.md` | Create | Symlink mirror into the canonical command. |
| `.cursor/commands/rewrite-response.md` | Create | Symlink mirror into the canonical command. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The command rewrites the active AI's most recent reply in-context with no model call. | The body forbids local and external LLMs, CLI dispatch, and providers, and declares no `allowed-tools`. |
| REQ-002 | The command is display-only and changes no canonical state. | The body states it writes no files and leaves transcript history unchanged. |
| REQ-003 | Protected spans survive byte-for-byte. | The body enumerates protected span classes and requires exact re-insertion. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The command passes the authoring validators. | `check_authored_name_kebab.py` exits 0 and `validate_document.py --type command` exits 0 with zero issues. |
| REQ-005 | The command is invokable in this runtime. | `.claude/commands/rewrite-response.md` resolves to the canonical file. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/rewrite-response` emits a plain-English rewrite of the prior assistant turn with meaning and protected spans intact.
- **SC-002**: `validate_document.py --type command` reports VALID with zero issues.
- **SC-003**: No local or external model is invoked and no file is written during the command.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The AI drifts meaning while rewriting | Medium | The rubric mandates meaning preservation and byte-exact protected spans. |
| Risk | The AI treats the rewrite as a file edit | Medium | The body states display-only and forbids file writes. |
| Dependency | sk-create-command standard | Low | The command was authored to that template and validated. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Command 1 is shipped and verified.
<!-- /ANCHOR:questions -->
