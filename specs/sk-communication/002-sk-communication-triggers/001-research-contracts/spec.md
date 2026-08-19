---
title: "Feature Specification: Phase 1: research and contracts"
description: "Verified current-state facts for the sk-communication trigger commands: the default-off activation gate, the runnable projection entrypoint, the existing provider families, the rewrite rubric source, the cli roster, the command-authoring standard, the cross-runtime mirror model, and the dispatch contract."
trigger_phrases:
  - "sk-communication research"
  - "projection activation gate"
  - "trigger command contracts"
  - "cli roster"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/001-research-contracts"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Verified contracts for the trigger commands"
    next_safe_action: "Author the commands from the contracts"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-contracts"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Fork 1 (command 2 engine model) is a downstream design decision, not a research gap."
    answered_questions:
      - "Projection is OFF by default; enabled by COMMUNICATION_PROJECTION_ENABLED or enablement.local.json."
      - "The runnable entrypoint is cli-output-wrapper; providers are local (ollama, llama.cpp) and hosted (OpenCode Go); no cli-* provider exists."
      - "The cli-* family is six skills; dispatch uses cli-devin gemini-3-7-flash-high with glm-5-2 fallback."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research and contracts

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
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-rewrite-response |
| **Handoff Criteria** | The activation gate, entrypoint, providers, rubric, cli roster, authoring standard, mirror model, and dispatch contract are verified from the live tree. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-communication trigger commands packet.

**Scope Boundary**: This phase gathers and records verified facts only. It changes no runtime code. The full evidence body lives in `research/research.md`.

**Dependencies**:
- The sk-communication package and skill as shipped.
- The sk-create-command authoring standard and the cli-devin dispatch contract.

**Deliverables**:
- `research/research.md` with file-anchored findings.
- The contracts that constrain command 1 and command 2 (activation, invariants, mirror model, dispatch).

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Building the two trigger commands safely requires knowing exactly how the projection layer activates, what runnable surface it exposes, which engines exist, and what invariants must hold. Guessing risks breaking the projection or default-off guarantees.

### Purpose
Establish an evidence base: verify the activation gate, the runnable entrypoint, the provider families, the authentic rewrite rubric, the cli roster, the command-authoring standard, the cross-runtime mirror model, and the dispatch contract, so both commands are built on confirmed facts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verifying the enablement gate and its two opt-in sources.
- Identifying the runnable `cli-output-wrapper` entrypoint and its build requirement.
- Cataloguing the existing local and hosted provider families and the absence of a cli-* provider.
- Locating the authentic plain-English rubric (`COPY_EDITING_INSTRUCTION`).
- Enumerating the six cli-* skills and the dispatch contract.
- Recording the command-authoring standard and the cross-runtime mirror model.

### Out of Scope
- Any change to runtime code, package, or skill.
- The command 2 engine-model decision (Fork 1); this phase only frames it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The verified, file-anchored research and contracts body. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The activation gate and its opt-in sources are verified. | `isProjectionEnabled()` and `COMMUNICATION_PROJECTION_ENABLED` are cited from `src/config/enablement.ts`. |
| REQ-002 | The runnable entrypoint and provider families are verified. | `cli-output-wrapper` and the local/hosted presets are cited from the package. |
| REQ-003 | The dispatch contract is verified. | `gemini-3-7-flash-high` is confirmed in the runtime allowlist and devin is installed and authed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The command-authoring standard and mirror model are recorded. | The sk-create-command location rules and the `.claude`/`.cursor` symlink vs `.codex` stub model are documented. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every load-bearing fact in `research/research.md` cites a real file or command.
- **SC-002**: The two commands can be designed without further discovery, except the open engine-model decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A fact goes stale as the package evolves | Low | Facts are file-anchored so they can be re-verified quickly. |
| Dependency | Projection package internals | Low | Read from the shipped source, not from memory. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Fork 1 (command 2 engine model) is framed here and decided in phase 003; it is not a research gap.
<!-- /ANCHOR:questions -->
