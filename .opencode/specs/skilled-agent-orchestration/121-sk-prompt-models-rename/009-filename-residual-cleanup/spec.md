---
title: "Feature Specification: Phase 9: filename-residual-cleanup"
description: "git mv the residual files whose NAME still contains sk-prompt-small-model (2 cli-opencode playbook docs + a changelog entry), repair references to them, and reconcile the repo-root README rename that is currently riding on uncommitted WIP."
trigger_phrases:
  - "filename residual rename cleanup"
  - "sk-prompt-small-model filename git mv"
  - "readme rename reconcile"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/009-filename-residual-cleanup"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/009-filename-residual-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: filename-residual-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 (review-remediation) |
| **Predecessor** | 008-graph-symmetry-cleanup |
| **Successor** | None (remediation arc complete) |
| **Handoff Criteria** | `git ls-files '*sk-prompt-small-model*'` returns only frozen history/archive; the repo-root README reflects the new name |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **review-remediation phase** addressing review recs **#2** (filename residue) and **#3** (repo-root README).

**Scope Boundary**: Rename the live FILENAMES that still contain the old skill name + repair references to them; reconcile the README. Archived filenames (e.g. `z_archive/.../019-sk-prompt-small-model-readme/`) STAY — they are historical packet names.

**Dependencies**:
- `git mv`; the manual-testing-playbook index that references the two playbook files by path.

**Deliverables**:
- `cli-opencode/manual_testing_playbook/07--prompt-templates/{deepseek-v4,kimi-k2-7}-direct-with-sk-prompt-models.md` → `…-with-sk-prompt-models.md`, with the playbook index references updated.
- `.opencode/changelog/sk-prompt-small-model` → `.opencode/changelog/sk-prompt-models` (confirm whether file or dir; repair any index referencing it).
- Repo-root `README.md` reconciled to the new name (its rename edit currently sits uncommitted on top of unrelated WIP).

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rename swapped file CONTENT but not a few FILENAMES that embed the old skill name (2 playbook docs + a changelog entry). Their content is renamed, but the names are inconsistent and any index referencing them by path is now slightly stale. Separately, the repo-root `README.md` HEAD still names the old skill: its rename edit was deliberately left uncommitted because it rode on unrelated pre-existing WIP that must not be bundled into the rename commit.

### Purpose
Make the filenames consistent with the rename and get the README to the new name without committing the unrelated WIP, closing the last cosmetic residue from the rename.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` the 2 playbook files + the changelog entry; repair references (the playbook index + any link).
- Reconcile the README to the new name (isolate the rename line OR commit it with the user's WIP, by the user's choice).

### Out of Scope
- Archived/historical filenames (`z_archive/**`, the `019-sk-prompt-small-model*` packet folders) — frozen history.
- The unrelated pre-existing WIP itself (not this packet's work).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-opencode/manual_testing_playbook/07--prompt-templates/deepseek-v4-direct-with-sk-prompt-models.md` | git mv | → `…-with-sk-prompt-models.md` |
| `cli-opencode/manual_testing_playbook/07--prompt-templates/kimi-k2-7-direct-with-sk-prompt-models.md` | git mv | → `…-with-sk-prompt-models.md` |
| `cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Modify | Repair the index references to the two renamed files |
| `.opencode/changelog/sk-prompt-small-model` | git mv | → `.opencode/changelog/sk-prompt-models` (confirm file vs dir) |
| `README.md` (repo root) | Modify/commit | Reconcile to the new name without bundling unrelated WIP |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Filenames renamed + references repaired | `git ls-files '*sk-prompt-small-model*'` returns only frozen history/archive; no broken playbook link |
| REQ-002 | README reflects the new name | The committed repo-root README references `sk-prompt-models` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No unrelated WIP committed | The README reconciliation does not bundle other sessions' pre-existing work |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git ls-files '*sk-prompt-small-model*'` lists only intentional history/archive paths.
- **SC-002**: The repo-root README (HEAD) names `sk-prompt-models`; no unrelated WIP was committed alongside it.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the git mv + index repair, **When** the playbook index is opened, **Then** its links resolve to the renamed files.
- **Given** the README reconciliation, **When** HEAD is inspected, **Then** it says sk-prompt-models with no unrelated WIP in the same commit.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | README rename entangled with unrelated WIP | Committing others' WIP | Isolate the rename line (git restore --staged the WIP hunks) or coordinate with the WIP owner before committing |
| Risk | Renaming an archived filename | Falsifies history | Limit git mv to the 2 live playbook files + the live changelog entry |
| Risk | Broken playbook link after mv | Stale index | Repair the manual_testing_playbook.md references in the same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is `.opencode/changelog/sk-prompt-small-model` a file or a directory, and what references it? (Confirm before git mv.)
- For the README: isolate the rename hunk, or commit it together with the user's WIP? (User's call.)
<!-- /ANCHOR:questions -->
