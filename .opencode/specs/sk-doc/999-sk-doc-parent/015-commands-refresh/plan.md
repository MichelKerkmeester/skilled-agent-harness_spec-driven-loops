---
title: "Implementation Plan: Refresh .opencode/commands to match the new sk-doc setup"
description: "Enumerate stale sk-doc structural references under .opencode/commands, repoint the residual ones deterministically, and verify every command resource path resolves."
trigger_phrases:
  - "commands refresh plan"
  - "125 sk-doc phase 015 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/015-commands-refresh"
    last_updated_at: "2026-07-07T06:40:27.201Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-015 plan"
    next_safe_action: "Repoint residual skill_creation refs and verify resolution"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Refresh .opencode/commands to match the new sk-doc setup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Command markdown/txt + YAML under `.opencode/commands/` |
| **Framework** | sk-doc structure produced by phases 011-013 |
| **Storage** | In-place edits to command files |
| **Testing** | Path-resolution check (every cited sk-doc resource exists) + residual-ref grep |

### Overview
Enumerate-then-repoint. Phases 012 (rename) and 013 (flatten) plus the concurrent packet-optimization pass had already converged most command references; a stale-reference audit finds the residual gap (chiefly the pre-regroup `skill_creation/` path and one monolith display label), which is repointed deterministically and then verified by resolving every command-cited sk-doc resource path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 012 + 013 committed (rename + flatten in place)
- [x] Command surface enumerated for stale sk-doc references

### Definition of Done
- [ ] Zero stale `skill_creation/`, monolith, facade, `doc-quality`, or `references/global/` references under `.opencode/commands/`
- [ ] Every command-cited sk-doc resource path resolves
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-repoint: a grep-driven stale-reference inventory drives a small set of exact-string path corrections.

### Key Components
- **Audit**: grep `.opencode/commands/` for hub-root facades, `*_creation.md` monolith links, `skill_creation/`, `doc-quality`, and `references/global/`.
- **Repoint**: deterministic exact-string replacement to the regrouped/renamed/flattened target paths.
- **Resolution check**: confirm every `.opencode/skills/sk-doc/...` path cited by `create_*` command YAMLs exists on disk.

### Data Flow
1. Grep the command surface for each stale-reference class.
2. Map each residual to its real post-refactor target.
3. Apply the repoint; leave concurrently-dirty command files to their owner (worktree-repointed only).
4. Resolve every command-cited sk-doc resource path; confirm zero broken.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate stale sk-doc structural references under `.opencode/commands/`
- [ ] Map each residual reference to its real post-refactor target path

### Phase 2: Implementation
- [ ] Repoint `skill_creation/` -> `parent_skill/` in the two `create_parent_skill_*` YAMLs
- [ ] Correct the stale monolith display label in `create/README.txt`

### Phase 3: Verification
- [ ] Grep confirms zero residual stale references under `.opencode/commands/`
- [ ] Resolve every command-cited sk-doc resource path (0 broken)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residual-reference audit | `.opencode/commands/` | `rg` for each stale-reference class |
| Path resolution | `create_*` command YAML resource paths | `test -e` per unique sk-doc path |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 012 (rename) committed | Internal | Green | Command doc-quality refs would still be stale |
| Phase 013 (flatten) committed | Internal | Green | Command references/global refs would still be stale |
| Concurrent lane command-YAML ownership | Internal | Green | Dirty command files committed by owner, not here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a repointed command path fails to resolve or a command misloads a resource.
- **Procedure**:
  1. `git revert` the commands-refresh commit (restores the prior citations).
  2. Re-run the path-resolution check to identify the specific broken mapping.
  3. Re-apply the corrected repoint and re-verify resolution before landing.
<!-- /ANCHOR:rollback -->
