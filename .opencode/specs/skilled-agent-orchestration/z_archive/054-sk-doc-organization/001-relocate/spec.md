---
title: "Feature Specification: Phase 1: relocate"
description: "Physically move 4 sk-doc asset items (2 dirs + 2 files) from single-purpose subfolders up to assets/ root, then rmdir the now-empty agents/ subfolder. References still point to OLD paths after this phase — Phase 2 handles the reference sweep."
trigger_phrases:
  - "068/001"
  - "relocate"
  - "sk-doc asset moves"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/001-relocate"
    last_updated_at: "2026-05-05T08:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 1 spec.md after Phase 1 work executed (commit ccd73ef55)"
    next_safe_action: "Author plan.md/tasks.md/implementation-summary.md and commit child docs"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/assets/feature_catalog
      - .opencode/skills/sk-doc/assets/testing_playbook
      - .opencode/skills/sk-doc/assets/agent_template.md
      - .opencode/skills/sk-doc/assets/command_template.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-authoring"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: relocate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-update-and-mirror |
| **Handoff Criteria** | 4 git mv operations succeed; `assets/agents/` physically deleted; new files visible at `assets/{feature_catalog,testing_playbook,agent_template.md,command_template.md}`; references still point to OLD paths (expected — Phase 2 fixes them) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-doc asset reorganization. It physically moves 4 asset items out of single-purpose subfolders and deletes the empty `agents/` subfolder. After this phase, references across sk-doc internal docs, /create:* commands × 4 runtimes, and the @create agent × 4 runtimes still point to the OLD paths — Phase 2 closes that gap.

**Scope Boundary**: Physical moves only. NO substring substitutions, NO mirror replication, NO content changes. Just `git mv` × 4 + `rmdir`.

**Dependencies**:
- Empty 068-sk-doc-organization/ scaffolded by `create.sh --phase` (✓ done)
- On `main` branch with `--skip-branch` flag set (✓ done)

**Deliverables**:
- `assets/feature_catalog/` directory at root level (was under `documentation/`)
- `assets/testing_playbook/` directory at root level (was under `documentation/`)
- `assets/agent_template.md` file at root level (was under `agents/`)
- `assets/command_template.md` file at root level (was under `agents/`)
- `assets/agents/` directory physically deleted (no .bak, no _deprecated, no archive)
- One commit on main: `feat(sk-doc): relocate feature_catalog/testing_playbook/templates to assets/ root (068/001)`

**Changelog**:
- Phase closeout (Phase 3) refreshes the matching file in ../changelog/ using parent packet number plus phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc skill's `assets/` directory has accreted a two-level hierarchy where heavy-traffic templates and package folders sit one level deeper than they need to be (`assets/agents/agent_template.md`, `assets/documentation/feature_catalog/`, etc.). This makes load paths longer and the `agents/` subfolder is single-purpose with only 2 files inside.

### Purpose
Promote the 4 heavy-traffic asset items to `assets/` root and delete the empty `agents/` subfolder, shortening every load path and removing the only one-template-deep subfolder. Pure relocation: byte-content of moved files preserved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 `git mv` operations (preserves git history)
- 1 `rmdir` of empty `assets/agents/` (physical delete, NOT archive)
- Single batched dispatch — atomic operation, all 5 commands or none
- Verify post-move FS state with `ls -la` and `test ! -e`
- One commit on main with descriptive message

### Out of Scope
- Reference-string updates — Phase 2 (002-update-and-mirror) handles this
- Cross-runtime mirror replication — Phase 2 handles this
- Validation gate — Phase 3 (003-verify-and-ship) handles this
- Template byte-content changes — out of scope for entire packet
- `barter/coder/` mirror tree — out of scope for entire packet (locked at parent)
- Renaming files (only directory promotion) — same filenames, new parent

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/documentation/feature_catalog/` | Move | Promoted to `assets/feature_catalog/` (2 files inside preserved) |
| `.opencode/skills/sk-doc/assets/documentation/testing_playbook/` | Move | Promoted to `assets/testing_playbook/` (2 files inside preserved) |
| `.opencode/skills/sk-doc/assets/agents/agent_template.md` | Move | Promoted to `assets/agent_template.md` |
| `.opencode/skills/sk-doc/assets/agents/command_template.md` | Move | Promoted to `assets/command_template.md` |
| `.opencode/skills/sk-doc/assets/agents/` | Delete | Empty after moves; physical `rmdir` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `feature_catalog/` directory promoted to `assets/` root | `test -d .opencode/skills/sk-doc/assets/feature_catalog && test ! -d .opencode/skills/sk-doc/assets/documentation/feature_catalog` |
| REQ-002 | `testing_playbook/` directory promoted to `assets/` root | `test -d .opencode/skills/sk-doc/assets/testing_playbook && test ! -d .opencode/skills/sk-doc/assets/documentation/testing_playbook` |
| REQ-003 | `agent_template.md` promoted to `assets/` root | `test -f .opencode/skills/sk-doc/assets/agent_template.md && test ! -f .opencode/skills/sk-doc/assets/agents/agent_template.md` |
| REQ-004 | `command_template.md` promoted to `assets/` root | `test -f .opencode/skills/sk-doc/assets/command_template.md && test ! -f .opencode/skills/sk-doc/assets/agents/command_template.md` |
| REQ-005 | `assets/agents/` folder physically deleted | `test ! -e .opencode/skills/sk-doc/assets/agents` |
| REQ-006 | Git history preserved via `git mv` (not `mv` + `git add`) | `git log --follow --oneline .opencode/skills/sk-doc/assets/agent_template.md` shows pre-move history |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | One commit on main with descriptive message | `git log -1 --format='%s'` matches `feat(sk-doc): relocate ... (068/001)`; `git branch --show-current` returns `main` |
| REQ-008 | Inner contents of moved directories preserved (no surprise loss) | `feature_catalog/` and `testing_playbook/` each contain 2 .md files at new location |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 P0 + 2 P1 REQs verified with evidence; physical FS state matches target layout
- **SC-002**: Phase 2 unblocked — references can now be swept against the new path layout

### Given/When/Then Verification Scenarios

**Given** the empty 068-sk-doc-organization/ scaffold exists, **When** `git mv .opencode/skills/sk-doc/assets/documentation/feature_catalog .opencode/skills/sk-doc/assets/feature_catalog` runs, **Then** the directory and its 2 inner files appear at the new path with git rename detection.

**Given** `feature_catalog` moved, **When** `git mv .opencode/skills/sk-doc/assets/documentation/testing_playbook .opencode/skills/sk-doc/assets/testing_playbook` runs, **Then** the directory and its 2 inner files appear at the new path.

**Given** both folders moved, **When** the 2 template files are moved via `git mv ... assets/agents/{agent,command}_template.md ... assets/{agent,command}_template.md`, **Then** `assets/agents/` is empty.

**Given** `assets/agents/` is empty, **When** `rmdir .opencode/skills/sk-doc/assets/agents` runs, **Then** `test ! -e .opencode/skills/sk-doc/assets/agents` exits 0.

**Given** all moves complete, **When** running `git status --porcelain`, **Then** 6 R (rename) entries are staged for the moves (2 from `feature_catalog/`, 2 from `testing_playbook/`, 2 templates).

**Given** the staged changes, **When** committing with the prescribed message on main, **Then** `git log -1` shows the commit on main and `git branch --show-current` returns `main`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 068 spec folder scaffolded with empty children | High — phase decomposition prerequisite | `create.sh --phase --parent` ran successfully; verified by `ls 001-relocate/` |
| Risk | `git mv` target path already exists | Low — would fail loudly | Pre-flight rg confirmed target paths empty; halt-on-failure semantics in batched dispatch |
| Risk | `rmdir` fails because folder isn't empty | Low — only moved 2 files out | Move both templates BEFORE rmdir; halt if non-empty |
| Risk | Auto-branching by create.sh strands work | Low — `--skip-branch` flag set | `git branch --show-current = main` checked before commit |
| Risk | References to old paths still resolve | Medium — silent breakage in next sk-doc invocation | Phase 2 closes immediately; don't ship Phase 1 alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — phase scope and execution are atomic and well-defined.
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
