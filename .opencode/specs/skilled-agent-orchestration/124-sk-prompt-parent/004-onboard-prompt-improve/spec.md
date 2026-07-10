---
title: "Feature Specification: Phase 4: onboard-prompt-improve"
description: "Phase 003 created the parent-hub skeleton, but its prompt-improve workflow packet is still empty. This phase plans the future relocation of today's sk-prompt behavior into that packet and the command/agent rebinding needed for the renamed mode."
trigger_phrases:
  - "prompt-improve"
  - "sk-prompt parent"
  - "prompt command rename"
  - "prompt-improver agent"
  - "phase 004"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-prompt-parent/004-onboard-prompt-improve"
    last_updated_at: "2026-07-09T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed the git mv relocation, command rename, agent repoints"
    next_safe_action: "Proceed to phase 005 fold-in"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
      - ".opencode/commands/prompt-improve.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-prompt-improve"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cli-claude-code/*, sk-code/graph-metadata.json, sk-doc/graph-metadata.json, system-deep-loop/graph-metadata.json, and cli-dispatch-skill-preload.md needed no edits — they reference the stable skill_id sk-prompt, not the internal SKILL.md path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: onboard-prompt-improve

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `scaffold/004-onboard-prompt-improve` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-scaffold-hub |
| **Successor** | 005-foldin-prompt-models |
| **Handoff Criteria** | The prompt-improve relocation plan is specific enough for future execution without touching prompt-models assets or live benchmark paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: This phase authors the plan for moving the active prompt-improvement engine into the already-scaffolded `prompt-improve/` workflow packet; this drafting pass does not execute the move.

**Dependencies**:
- Phase 003 hub skeleton exists with an empty `prompt-improve/` packet location.
- Current `.opencode/skills/sk-prompt/` content remains the source of truth until the future execution pass runs `git mv`.
- Phase 005 owns the `sk-prompt-models` fold-in and benchmark-path repointing.

**Deliverables**:
- A scoped specification for relocating the current prompt-improvement skill into `.opencode/skills/sk-prompt/prompt-improve/`.
- A concrete implementation plan covering the future `git mv`, command rename, agent repoints, and smoke verification.
- An executable task list for the later implementation pass.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 created the parent-hub skeleton, but the `prompt-improve/` packet has no relocated implementation yet. Until today's `.opencode/skills/sk-prompt/` content is moved into that packet and `/prompt` is rebound to `/prompt-improve`, the new parent hub cannot preserve the existing prompt-improvement workflow shape.

### Purpose
Populate the future `prompt-improve` workflow packet with the current sk-prompt behavior through a history-preserving move and rebind its command and agents without changing framework, DEPTH, or CLEAR behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan the future `git mv` relocation of today's `.opencode/skills/sk-prompt/` content into `.opencode/skills/sk-prompt/prompt-improve/` while preserving git history.
- Plan the `/prompt` command rename to `/prompt-improve` and the frontmatter/argument-hint update for the relocated mode.
- Plan the repointing of `.opencode/agents/prompt-improver.md` and `.claude/agents/prompt-improver.md` to the relocated packet.
- Plan reference cleanup for the explicitly named old `sk-prompt/SKILL.md` consumers.

### Out of Scope
- Changing sk-prompt's framework-selection, DEPTH-thinking, CLEAR-scoring, prompt-writing, or review behavior - this phase is pure relocation and command rebinding.
- Folding `.opencode/skills/sk-prompt-models/` into the hub - phase 005 owns prompt-models and the benchmark-path repointing risk.
- Adding a surface axis, runtime loop, transport axis, or extra router outcome - the approved parent shape is workflow-only.
- Executing the move during this drafting pass - this phase document prepares future implementation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/` -> `.opencode/skills/sk-prompt/prompt-improve/` | Move | Future `git mv` of the current 51-file prompt-improvement tree into the workflow packet, with the packet-local `graph-metadata.json` not duplicated because the hub owns the surviving advisor identity. |
| `.opencode/commands/prompt.md` -> `.opencode/commands/prompt-improve.md` | Move/Modify | Future command rename and frontmatter/argument-hint update so `/prompt-improve` resolves to the relocated mode. |
| `.opencode/agents/prompt-improver.md` | Modify | Repoint OpenCode agent instructions from the old skill path to the relocated `prompt-improve` packet. |
| `.claude/agents/prompt-improver.md` | Modify | Repoint Claude mirror agent instructions from the old skill path to the relocated `prompt-improve` packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All current prompt-improvement files are present under `.opencode/skills/sk-prompt/prompt-improve/` with git history preserved. | `git status --short` shows renames rather than copy/delete churn for the relocated files, and the future implementation verifies the expected 51-file source set is accounted for with packet-local graph metadata excluded from duplication. |
| REQ-002 | `/prompt-improve` resolves and loads the relocated `SKILL.md`. | After the move, invoking `/prompt-improve` reaches `.opencode/skills/sk-prompt/prompt-improve/SKILL.md` and completes one end-to-end smoke prompt-improvement run. |
| REQ-003 | The explicitly named old `sk-prompt/SKILL.md` consumers no longer dangle. | Grep confirms no old path remains in `cli-claude-code/*`, `sk-code/graph-metadata.json`, `sk-doc/graph-metadata.json`, `system-deep-loop/graph-metadata.json`, or `system-spec-kit/constitutional/cli-dispatch-skill-preload.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two prompt-improver agent definitions point at the relocated packet. | Both `.opencode/agents/prompt-improver.md` and `.claude/agents/prompt-improver.md` reference the new `prompt-improve` mode and no longer instruct users through the old root skill path. |
| REQ-005 | Command naming reflects the locked decision. | `.opencode/commands/prompt-improve.md` exists, `.opencode/commands/prompt.md` is removed by rename, and command metadata refers to `/prompt-improve`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future execution pass can relocate the prompt-improvement engine with `git mv` and no behavior edits to the framework, DEPTH, or CLEAR logic.
- **SC-002**: Functional smoke test passes by running `/prompt-improve` end-to-end after relocation and confirming the command resolves the relocated skill.
- **SC-003**: Targeted grep checks find no dangling references to the old `sk-prompt/SKILL.md` path in the named consumers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 parent hub skeleton | High if missing | Confirm the hub and empty `prompt-improve/` packet exist before running any future move. |
| Risk | Accidental behavior edits during relocation | Medium | Restrict implementation to `git mv`, command metadata, agent repoints, and targeted reference cleanup; compare content before/after if uncertainty appears. |
| Risk | Packet-local graph metadata duplication | Medium | Keep the single surviving hub `graph-metadata.json`; do not add a packet-level graph identity inside `prompt-improve/`. |
| Dependency | Phase 005 prompt-models fold-in | Medium | Do not touch `.opencode/skills/sk-prompt-models/` or benchmark path repointing in this phase. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No open questions for this drafting pass; locked operator decisions define the mode name, command rename, packet kind, and default router mode.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
