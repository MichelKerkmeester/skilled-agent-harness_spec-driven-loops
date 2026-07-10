---
title: "Feature Specification: Phase 4: onboard-chrome-devtools"
description: "git mv the 41-file mcp-chrome-devtools tree into mcp-tooling/mcp-chrome-devtools/ as the hub's first workflow packet, rewriting its internal absolute and relative self-paths. No routing or advisor changes yet."
trigger_phrases:
  - "onboard chrome-devtools packet"
  - "mcp-chrome-devtools git mv"
  - "first workflow packet move"
  - "chrome-devtools self-path rewrite"
  - "phase 004 onboard-chrome-devtools"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled onboarding docs to reflect the executed move"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-chrome-devtools"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "chrome-devtools moves as a workflow packet keeping its own version 1.0.8.0 and changelog"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: onboard-chrome-devtools

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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-scaffold-hub |
| **Successor** | 005-foldin-clickup-and-figma |
| **Handoff Criteria** | The 41-file chrome-devtools tree resolves under `mcp-tooling/mcp-chrome-devtools/`; its internal self-paths are rewritten; the packet's own version 1.0.8.0 and changelog are intact |
| **Execution Note** | `git status --short` recorded 40 rename entries (41 tracked files minus the dissolved `graph-metadata.json`, deleted in phase 006, not renamed); `mcp-tooling/mcp-chrome-devtools/SKILL.md` still carries `version: 1.0.8.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Move the `mcp-chrome-devtools` tree only. This phase does the `git mv` for the first workflow packet and rewrites its internal self-referential paths (absolute and relative, including any `../mcp-*` cross-skill form); it does not touch `mcp-click-up`, `mcp-figma`, `mcp-code-mode`, the advisor graph, or external documentation referrers (those are phases 005-006).

**Dependencies**:
- Phase 003's hub skeleton with the empty `mcp-chrome-devtools/` packet directory in place.

**Deliverables**:
- The 41-file `mcp-chrome-devtools` tree relocated to `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` via `git mv`.
- Internal absolute and relative self-paths inside the moved tree (INSTALL_GUIDE, README, changelog, scripts, examples, playbooks) rewritten from `.opencode/skills/mcp-chrome-devtools/...` (and any relative `../mcp-chrome-devtools` / cross-skill `../mcp-*` form) to the nested `.opencode/skills/mcp-tooling/mcp-chrome-devtools/...` location.
- The packet's own `version: 1.0.8.0` and `changelog/` preserved.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub skeleton exists but has no packet content. Chrome-devtools is the smallest of the two workflow bridges (41 files) and the chosen `defaultMode`, so moving it first exercises the packet-move procedure and self-path rewrite on the simplest case before the larger click-up and transport moves in phase 005.

### Purpose
Relocate the chrome-devtools workflow packet under the hub with all internal self-paths corrected, keeping its independent version and changelog intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` the entire `.opencode/skills/mcp-chrome-devtools/` tree (41 tracked files) to `.opencode/skills/mcp-tooling/mcp-chrome-devtools/`.
- Rewrite internal absolute and relative self-paths inside the moved tree to the new nested location.
- Preserve the packet's `version: 1.0.8.0`, `changelog/`, `references/`, `examples/`, `scripts/`, and `manual_testing_playbook/`.

### Out of Scope
- Moving `mcp-click-up` or `mcp-figma` - phase 005.
- Deleting the packet's `graph-metadata.json` or building the hub graph identity - phase 006.
- Repointing external referrers like `doctor_mcp_install.yaml` or the advisor corpus - phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-chrome-devtools/*` (41 files) | Move | `git mv` to `.opencode/skills/mcp-tooling/mcp-chrome-devtools/*` |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/{INSTALL_GUIDE,README,SKILL}.md` | Modify | Rewrite internal absolute and relative self-paths to the nested location |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Chrome-devtools content relocated under the hub | All 41 tracked files resolve under `mcp-tooling/mcp-chrome-devtools/`; `git` records renames, not rewrites |
| REQ-002 | Internal absolute and relative self-paths rewritten | A grep for BOTH the absolute `.opencode/skills/mcp-chrome-devtools/` and the relative `../mcp-chrome-devtools` forms inside the moved tree returns zero live self-path hits (excluding historical changelog prose); additionally, each rewritten relative link is resolved from its containing file's directory and confirmed to exist on disk, not just grep-absent |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Packet identity preserved | The moved packet keeps `version: 1.0.8.0` and its own `changelog/`; no external referrer is touched in this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The chrome-devtools packet resolves cleanly under the hub with corrected internal self-paths.
- **SC-002**: No external referrer, advisor graph file, or other bridge tree is modified in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 hub skeleton with empty packet dir | High | Do not move until the skeleton exists |
| Risk | A live internal self-path is missed and fails silently after the move | Medium | Grep the moved tree for the old path and rewrite every live hit |
| Risk | Historical changelog prose documenting the skill's own history is blindly rewritten | Low | Only rewrite LIVE functional/self-reference paths; leave historical changelog narrative intact |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved by phase 002: chrome-devtools is a workflow packet keeping the `mcp-` prefix and its own version 1.0.8.0.
- None open; this is a scoped single-tree move against an existing skeleton.
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
