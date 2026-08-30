---
title: "Feature Specification: [sk-communication/002-sk-communication-triggers/003-rewrite-response-by-external-agent/spec]"
description: "The /rewrite-response-by-external-agent command runs a one-shot sk-communication projection of a target through a user-chosen engine (a cli-* skill, native in-context, or a local LLM), flipping projection on inline for the single run and guaranteeing it off afterward, with no shipped-package edits."
trigger_phrases:
  - "rewrite-response-by-external-agent"
  - "one-shot projection command"
  - "engine choice projection"
  - "sk-communication trigger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/003-rewrite-response-by-external-agent"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Authored and verified command 2"
    next_safe_action: "Update SKILL note and mirrors in phase 004"
    blockers: []
    key_files:
      - ".opencode/commands/rewrite-response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-rewrite-response-by-external-agent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Built as command-level orchestration (no shipped-package change); a first-class external-cli package provider is a future hardening."
      - "ON/OFF uses process-scoped COMMUNICATION_PROJECTION_ENABLED set inline, guaranteed off after the single run."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: rewrite-response-by-external-agent command

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
| **Phase** | 3 of 10 |
| **Predecessor** | 002-rewrite-response |
| **Successor** | 004-skill-and-mirrors |
| **Handoff Criteria** | The command passes `validate_document.py --type command`, asks the engine, and guarantees the flip-off with no package edits. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-communication trigger commands packet.

**Scope Boundary**: This phase delivers command 2 as a command-level orchestration that changes NO shipped package code. It reuses existing surfaces: the active AI for native, `cli-external-orchestration` for the cli-* path, and the package's `cli-output-wrapper` for the local path.

**Dependencies**:
- Phase 001 verified the activation gate, the cli roster, and the runnable entrypoint.
- The command is authored to the sk-create-command template and mirrored across runtimes.

**Deliverables**:
- `.opencode/commands/rewrite-response-by-external-agent.md`, invocation `/rewrite-response-by-external-agent`.
- Cross-runtime mirrors in `.claude/commands/` and `.cursor/commands/`.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-communication ships off by default with no operator surface to run its projection once against a chosen engine. A user cannot pick "external cli-* skill", "native", or "local LLM" for a single rewrite without leaving projection enabled globally.

### Purpose
Provide `/rewrite-response-by-external-agent`: a one-shot projection of a target that asks the user which engine to run, flips `COMMUNICATION_PROJECTION_ENABLED` on inline for that single run, and lets it fall away immediately afterward. The default-off invariant holds even on error, and canonical bytes never change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One root slash command with a mandatory engine-choice gate.
- Engine routing across all six cli-* skills, native in-context, and the local provider path.
- An explicit ON→run→OFF mechanism using inline `COMMUNICATION_PROJECTION_ENABLED`, guaranteed off, never persisted.
- Cross-runtime mirrors for `.claude` and `.cursor`.

### Out of Scope
- Any change to the shipped projection package (`src/`), including a new provider family.
- Changing the global default-off state or writing `enablement.local.json`.
- The `.codex/prompts/` stub mirror, deferred to phase 004 or later.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/rewrite-response-by-external-agent.md` | Create | Command 2: one-shot engine-choice projection, no package edits. |
| `.claude/commands/rewrite-response-by-external-agent.md` | Create | Symlink mirror. |
| `.cursor/commands/rewrite-response-by-external-agent.md` | Create | Symlink mirror. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The command asks the user which engine to run and forbids inference. | A mandatory gate presents the three-option menu and waits when the engine is not supplied. |
| REQ-002 | Projection is flipped on inline for the single run and guaranteed off afterward. | The body sets `COMMUNICATION_PROJECTION_ENABLED` inline (or via a trap-guarded subshell) and never persists it. |
| REQ-003 | The default-off invariant holds and canonical bytes never change. | The body never writes `enablement.local.json` and states the projection is display-only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All six cli-* skills, native, and local are routable. | Each engine has an executable branch, and the cli-* branch reads the chosen skill's `SKILL.md` first. |
| REQ-005 | The command passes the authoring validators. | `check_authored_name_kebab.py` and `validate_document.py --type command` both exit 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/rewrite-response-by-external-agent` projects a target through the chosen engine and displays the rewrite.
- **SC-002**: `COMMUNICATION_PROJECTION_ENABLED` is never left set after the run, including error paths.
- **SC-003**: No shipped package file is modified by this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The flag leaks into the parent shell | High | Inline env scoping plus a trap-guarded subshell; never export in the parent. |
| Risk | The cli-* path routes without the preload rule | Medium | The branch requires reading the chosen `cli-*` SKILL.md before dispatch. |
| Dependency | Local provider config for the local path | Low | The local branch checks config and gives actionable setup instructions if absent. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- A first-class `external-cli` package provider (routing the cli-* path through the package's privacy and fidelity pipeline) is a recommended future hardening; it needs a package change and operator approval, and is out of scope here.
<!-- /ANCHOR:questions -->
