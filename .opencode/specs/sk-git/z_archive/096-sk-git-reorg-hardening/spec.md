---
title: "Feature Specification: sk-git Large-Reorg + Worktree Hardening [sk-git/z_archive/096-sk-git-reorg-hardening/spec]"
description: "Harden the sk-git skill so large rename/reorg + worktree workflows avoid the failure modes hit during the 026 wave-4 reorg."
trigger_phrases:
  - "sk-git reorg hardening"
  - "git worktree gitignored deps"
  - "rename-heavy merge guidance"
  - "scoped staging discipline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/096-sk-git-reorg-hardening"
    last_updated_at: "2026-07-14T21:40:41Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created packet for sk-git hardening"
    next_safe_action: "Update sk-git skill per the five failure modes"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-git Large-Reorg + Worktree Hardening

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 026 wave-4 reorganization (a large rename/renumber executed in a git worktree, then merged to main) hit several avoidable failure modes that the sk-git skill does not currently guard against: gitignored leftover folders after `git mv`, a fresh worktree missing gitignored build deps (breaking the spec-kit toolchain), the memory DB being a single global instance (not per-worktree), accidental staging of unrelated in-flight WIP, and rename-heavy merge verification gaps.

### Purpose
Update the sk-git skill with concrete guidance, checklists, and a large-reorg playbook so the next such workflow is smooth and safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `.opencode/skills/sk-git/` SKILL.md + reference docs for the five failure modes.
- Add a large rename/reorg + worktree playbook.

### Out of Scope
- Changing git itself or non-sk-git skills.
- Re-running the 026 reorg.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/SKILL.md` | Modify | Rules/routing for large reorg + worktree |
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modify | Worktree dep/DB caveats + leftover cleanup |
| `.opencode/skills/sk-git/references/commit_workflows.md` | Modify | Scoped-staging discipline |
| `.opencode/skills/sk-git/references/shared_patterns.md` | Modify | Rename-heavy merge verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Post-rename ignored-leftover cleanup documented | sk-git describes detecting + removing 0-tracked-file dirs after git mv/merge |
| REQ-002 | Worktree dep/DB caveats documented | sk-git warns fresh worktrees lack gitignored deps; toolchain + memory DB run on main |
| REQ-003 | Scoped-staging discipline mandated | sk-git forbids broad `git add` when unrelated WIP exists; requires staged-set assertion |
| REQ-004 | Rename-heavy merge verification documented | sk-git requires R-status + no old/new duplicate folders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-git SKILL.md + references cover all five failure modes with concrete steps.
- **SC-002**: A large-reorg playbook exists and is discoverable from SKILL.md.
- **SC-003**: `validate.sh --strict` passes on this packet and sk-git docs remain coherent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-git reference docs (worktree/commit/shared) | Doc edits must stay coherent across files | Cross-link sections; keep edits surgical and scoped |
| Risk | Guidance drifts from real git behavior | Low | All steps copied from the 026 wave-4 incident, verified against actual commands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: New guidance lives in the matching reference doc, not inline in SKILL.md, so the skill index stays concise.
- **NFR-M02**: Each failure-mode section is self-contained and copy-pasteable as a runbook step.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Worktree Boundaries
- Gitignored deps missing in a fresh worktree: toolchain and DB ops run on main post-merge only.
- `git mv` leftover dirs holding only ignored files: detect via `git ls-files` + `git status --porcelain`, remove from the working tree separately.

### Staging Boundaries
- Unrelated WIP already staged in the index: re-check `git diff --cached` after any `git stash pop`.
- Accidental commit of unrelated WIP: recover with `git reset --mixed HEAD~1`, then re-stage precise pathspecs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 doc files in one skill, no code |
| Risk | 4/25 | Documentation-only; no runtime behavior change |
| Research | 6/20 | Incident lessons already captured in scratch notes |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS
- sk-git skill: `.opencode/skills/sk-git/`
- Source incident: `system-spec-kit/026-graph-and-context-optimization` wave-4 reorg
