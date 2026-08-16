---
title: "Feature Specification: Repo-Agnostic Git Workspace Rows [specs/agents/005-git-workspace-repo-agnostic]"
description: "The root AGENTS.md calls itself a universal template but its Git Workspace Safety table inlines this repo's sk-git implementation. Every repo-specific detail should move into sk-git so the framework doc stays portable."
trigger_phrases:
  - "agents.md"
  - "repo agnostic"
  - "git workspace safety"
  - "sk-git"
  - "branch grammar"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/005-git-workspace-repo-agnostic"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Rewrote the AGENTS.md Git Workspace Safety rows repo-agnostic"
    next_safe_action: "Land the AGENTS.md edit and packet to v4 and main"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-hardening"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Repo-Agnostic Git Workspace Rows

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-16 |
| **Branch** | `worktrees/011-agents-git-rows-repo-agnostic` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`AGENTS.md` (and its `CLAUDE.md` symlink) is a portable framework doc, yet its Git Workspace Safety rows hardcode this repo's sk-git implementation: the literal branch grammar, the allocator script path and command names, an allowlist filename, several env flag names, reference-doc paths, and an internal migration-program row. A repo that adopts this template inherits rules that name files and flags it does not have.

### Purpose
State the universal principles and name sk-git; keep the exact grammar, allocator commands, push policy, and disable flags inside sk-git as the single source of truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `##### Git Workspace Safety` table in `AGENTS.md` (`CLAUDE.md` is a symlink, so one edit covers both).

### Out of Scope
- sk-git itself — not modified; it remains the source of truth.
- Every other `AGENTS.md` section, and all runtime behavior — docs-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Rewrite the Git Workspace Safety table rows repo-agnostic |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Git Workspace Safety section names sk-git and states each universal rule with zero repo-specific tokens | Section-scoped grep for the forbidden tokens returns 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The internal hyphen-case-pilot row is removed | 0 occurrences of that row |
| REQ-003 | sk-git stays named and no other section changes | Mandatory Tools + Quick Reference rows unchanged; `diff --stat` touches one table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Section-scoped grep for the repo-specific tokens (branch grammar, allocator script/commands, allowlist file, the `MK_*`/`SPECKIT_*` flag names, reference-doc paths) returns 0.
- **SC-002**: The hyphen-case-pilot row is gone.
- **SC-003**: sk-git still named in Mandatory Tools + Quick Reference; the diff touches only the one table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-git | Rules become unreachable if sk-git is absent | sk-git is loaded on every git-workflow task and holds the full detail |
| Risk | A future edit re-inlines repo specifics | Doc drifts back to non-portable | REQ-001's forbidden-token grep is a repeatable guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope, targets, and the forbidden-token list are fixed.
<!-- /ANCHOR:questions -->
