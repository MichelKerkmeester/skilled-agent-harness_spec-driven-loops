---
title: "Implementation Plan: Phase 1: relocate"
description: "Single batched git mv + rmdir dispatch. Atomic 5-command sequence; no parallelism within phase. Halt-on-failure semantics."
trigger_phrases:
  - "068/001 plan"
  - "relocate plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/001-relocate"
    last_updated_at: "2026-05-05T08:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 1 plan.md"
    next_safe_action: "Continue with tasks.md authoring"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-authoring"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: relocate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash + git (file relocation only) |
| **Framework** | system-spec-kit phase decomposition |
| **Storage** | Filesystem (`.opencode/skills/sk-doc/assets/`) |
| **Testing** | `ls -la` + `test ! -e` + `git status` |

### Overview
Single batched dispatch of 4 `git mv` operations followed by `rmdir` of the now-empty `assets/agents/` directory. Atomic — halt on any non-zero exit. Result is a flatter `assets/` layout where heavy-traffic templates sit at the root and the redundant single-purpose `agents/` subfolder no longer exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent spec.md authored with Phase Documentation Map
- [x] 068-sk-doc-organization/ scaffolded with 3 empty children
- [x] On `main` branch with `--skip-branch` flag honored

### Definition of Done
- [x] All 4 `git mv` operations succeed
- [x] `assets/agents/` physically deleted
- [x] One commit on main with descriptive message
- [ ] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md) authored and committed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Atomic batched filesystem operation. No state, no parallelism, no rollback within phase (rollback is at the commit boundary via `git reset --hard`).

### Key Components
- **`git mv`** (4×): Preserves git rename detection, reuses existing object hashes, history follows the file
- **`rmdir`** (1×): Hard-fails if directory non-empty — guarantees the empty-state precondition

### Data Flow
```
state-pre  -> git mv #1 -> git mv #2 -> git mv #3 -> git mv #4 -> rmdir -> state-post -> commit
            (halt-on-fail at every step)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify `git branch --show-current` returns `main`
- [x] Verify target paths do not exist (no overwrite hazard)
- [x] Verify source paths exist (no move-from-nothing)

### Phase 2: Core Implementation
- [x] `git mv .opencode/skills/sk-doc/assets/documentation/feature_catalog .opencode/skills/sk-doc/assets/feature_catalog`
- [x] `git mv .opencode/skills/sk-doc/assets/documentation/testing_playbook .opencode/skills/sk-doc/assets/testing_playbook`
- [x] `git mv .opencode/skills/sk-doc/assets/agents/agent_template.md .opencode/skills/sk-doc/assets/agent_template.md`
- [x] `git mv .opencode/skills/sk-doc/assets/agents/command_template.md .opencode/skills/sk-doc/assets/command_template.md`
- [x] `rmdir .opencode/skills/sk-doc/assets/agents`

### Phase 3: Verification
- [x] `ls -la .opencode/skills/sk-doc/assets/` shows new layout
- [x] `test ! -e .opencode/skills/sk-doc/assets/agents` exits 0
- [x] `git status --porcelain` shows 6 R lines (renames)
- [x] One commit on main with prescribed message
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each `git mv` exit code | shell `&&` chain |
| Integration | Final FS state | `ls -la`, `test ! -e`, `git status` |
| Manual | Visual diff of `assets/` layout pre/post | `tree` or `ls -la` comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` (>= 2.0) | External | Green | Cannot move with rename detection |
| `rmdir` (POSIX) | External | Green | Falls back to manual error reporting if dir non-empty |
| 068 spec folder scaffold | Internal | Green | Phase metadata cannot resolve |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the 5 commands fails OR git status shows unexpected content after the batch
- **Procedure**: `git reset --hard HEAD~1` (rolls back the Phase 1 commit; FS state restored from committed parent)
- **Granularity**: Phase boundary — Phase 1 is a single commit, fully reversible. Phases 2 and 3 land as separate commits, each independently rollback-able.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
