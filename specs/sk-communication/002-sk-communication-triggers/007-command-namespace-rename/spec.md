---
title: "Feature Specification: Phase 7: rewrite command namespace rename"
description: "Move the two trigger commands into a rewrite/ subfolder and drop the rewrite- filename prefix, so they invoke as /rewrite:response and /rewrite:response-by-external-agent under the established folder/name.md namespace convention, with every functional reference updated."
trigger_phrases:
  - "rewrite command namespace"
  - "rewrite response command rename"
  - "rewrite subfolder commands"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/007-command-namespace-rename"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Renamed both commands into the rewrite/ namespace and updated functional references"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files:
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
      - ".opencode/skills/sk-communication/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-command-namespace-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The colon namespace matches the runtime convention already used by /deep:research and /memory:save, where a folder/name.md file invokes as /folder:name."
      - "Historical spec docs and phase-folder names that contain the old command string are records of what was built and are left unchanged; only functional invocation references are updated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: rewrite command namespace rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-external-cli-runtime-wiring |
| **Successor** | 008-spawn-process-group-hardening |
| **Handoff Criteria** | Both commands live under `.opencode/commands/rewrite/`, invoke as `/rewrite:response` and `/rewrite:response-by-external-agent`, and no functional surface references the old flat names. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-communication trigger commands packet.

**Scope Boundary**: A structural rename of the two shipped trigger commands into a `rewrite/` namespace. No command behavior, contract, or projection logic changes; only file locations, invocation names, and the functional references that point at them.

**Dependencies**:
- Phases 002 and 003 shipped the two commands at their flat paths; phase 006 shipped the external-cli entrypoint the second command invokes.

**Deliverables**:
- Both command files relocated and renamed under `.opencode/commands/rewrite/`.
- Every functional invocation reference updated to the colon-namespaced form.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two trigger commands sat at the flat paths `.opencode/commands/rewrite-response.md` and `.opencode/commands/rewrite-response-by-external-agent.md`, so they invoked as `/rewrite-response` and `/rewrite-response-by-external-agent`. Every other command group in the tree (`deep`, `memory`, `speckit`, and others) is a subfolder that invokes under a `/group:name` namespace, so the two rewrite commands were the odd flat pair.

### Purpose
Move both commands into a `rewrite/` subfolder and drop the redundant `rewrite-` filename prefix so they invoke as `/rewrite:response` and `/rewrite:response-by-external-agent`, matching the established namespace convention, and update every functional reference so no invocation breaks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relocating and renaming the two command files under `.opencode/commands/rewrite/`.
- Updating the invocation strings inside both command files.
- Updating the skill routing list in `SKILL.md` and the feature-catalog reference.

### Out of Scope
- Any change to command behavior, contract, arguments, or the projection pipeline.
- Rewriting historical spec docs or phase-folder names that contain the old command string; those are records of what was built.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/rewrite-response.md` → `.opencode/commands/rewrite/response.md` | Rename | Command 1 relocated and de-prefixed. |
| `.opencode/commands/rewrite-response-by-external-agent.md` → `.opencode/commands/rewrite/response-by-external-agent.md` | Rename | Command 2 relocated and de-prefixed. |
| `.opencode/skills/sk-communication/SKILL.md` | Modify | Trigger-command list uses the colon-namespaced invocations. |
| `.opencode/skills/sk-communication/feature-catalog/provider-and-privacy/external-cli-provider.md` | Modify | Catalog reference uses the colon-namespaced invocation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both commands live under the `rewrite/` namespace. | `.opencode/commands/rewrite/response.md` and `.opencode/commands/rewrite/response-by-external-agent.md` exist and the flat paths are gone. |
| REQ-002 | No functional surface references the old flat invocation. | A search for `/rewrite-response` across the command files, `SKILL.md`, and the feature-catalog returns nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The rename preserves command behavior and git history. | Both files move with `git mv` and show as renames; no command contract, argument, or projection-pipeline logic changes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two commands resolve at their new paths and invoke as `/rewrite:response` and `/rewrite:response-by-external-agent`.
- **SC-002**: No functional file references the old flat command names.
- **SC-003**: Command behavior, contract, and the projection pipeline are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stale reference keeps pointing at the old invocation | Low | A repo search over the functional surfaces confirms none remain; historical spec docs are intentionally excluded. |
| Dependency | The two shipped commands | Low | Present and moved with `git mv`, preserving history. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
