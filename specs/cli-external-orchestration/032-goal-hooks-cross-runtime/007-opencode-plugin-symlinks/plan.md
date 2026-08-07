---
title: "Implementation Plan: OpenCode plugin browsability symlinks"
description: "Create 7 relative symlinks (5 unified-hooks-tree rows + 2 skill-owned rows) pointing at the real OpenCode plugin files in .opencode/plugins/, update tree diagrams and READMEs, then verify resolution and zero double-load with a live OpenCode session."
trigger_phrases:
  - "opencode symlink plan"
  - "hooks tree opencode row plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/007-opencode-plugin-symlinks"
    last_updated_at: "2026-07-28T20:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored implementation plan for OpenCode plugin symlink mirror"
    next_safe_action: "Author tasks.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/hooks/README.md"
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Symlink relative-path depth: 3 levels up from each concern's opencode/ subfolder to reach .opencode/plugins/."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: OpenCode plugin browsability symlinks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | Direct implementation on `skilled/v4.0.0.0`, no worktree (per parent packet operator choice) |
| **Authority** | `cli-external-orchestration`, touching `.opencode/hooks/` and 2 skill-owned hook trees |
| **Verification** | `readlink`/realpath resolution checks, `validate_document.py`, live OpenCode session smoke test |

### Overview

Create 7 relative symlinks inside `opencode/` subfolders of the relevant concern/skill hook folders, each pointing back at the real plugin file already living in `.opencode/plugins/`. Update the directory-tree diagrams and READMEs that document each concern to show the new row. Verify every link resolves, then confirm with a live OpenCode session that plugin discovery still loads each affected plugin exactly once (no double-load through the new symlink path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Parent packet plan confirms the reverse-direction symlink pattern and the 7-file list.
- [ ] Phase 001's `.opencode/hooks/goal/` concern folder exists as a real, populated directory (confirmed at spec-authoring time via `.opencode/hooks/goal/lib/goal-core.cjs`).

### Definition of Done

- [ ] All 7 symlinks created, relative, and resolving to their real `.opencode/plugins/` target.
- [ ] `.opencode/hooks/README.md` + 4 concern READMEs + 2 skill-owned hook READMEs updated and `validate_document.py` clean.
- [ ] Live OpenCode session confirms zero double-load for all 5 plugins reachable through these symlinks.
- [ ] `git status` on `.opencode/plugins/` is clean (no plugin file itself touched).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reverse Pi-mirror pattern: real file stays in its OpenCode-required fixed location (`.opencode/plugins/`), and a relative symlink is placed inside the browsable concern folder (`opencode/<file>.js`), the opposite direction from the Pi adapters elsewhere in this tree (where the concern folder holds the real file and `.pi/extensions/` holds the symlink).

### Key Components

- **`opencode/` subfolder per concern**: new, symlink-only subfolder inside `dispatch/`, `mcp-route-guard/`, `post-edit-quality/`, `task-dispatch/`, and `goal/` under `.opencode/hooks/`.
- **`opencode/` subfolder per skill-owned hook tree**: new, symlink-only subfolder inside `system-spec-kit/mcp-server/hooks/` and `sk-git/scripts/hooks/`.
- **Relative path depth**: each symlink target is computed relative to its own `opencode/` subfolder location back to `.opencode/plugins/<file>.js`.

### Control Flow

Confirm real plugin files exist and are unchanged -> create each symlink with the correct relative depth -> verify resolution (`readlink -f`) for all 7 -> update tree diagrams/READMEs -> `validate_document.py` on touched docs -> live OpenCode session smoke test for double-load -> record verification evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Symlink Creation

- [ ] Confirm the 5 unified-hooks-tree target plugins (`mk-cli-dispatch-audit.js`, `mk-mcp-route-guard.js`, `mk-post-edit-quality.js`, `mk-deep-loop-guard.js`, `mk-goal.js`) and the 2 skill-owned target plugins (`mk-spec-gate.js`, `mk-git-preflight-advisory.js`) all exist in `.opencode/plugins/`.
- [ ] Create `.opencode/hooks/{dispatch,mcp-route-guard,post-edit-quality,task-dispatch,goal}/opencode/` subfolders with the relative symlink into `.opencode/plugins/`.
- [ ] Create `.opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js` and `.opencode/skills/sk-git/scripts/hooks/opencode/mk-git-preflight-advisory.js` relative symlinks.

### Phase 2: Documentation Updates

- [ ] Update `.opencode/hooks/README.md`'s directory-tree diagram and KEY FILES table to add the 5 `opencode/` rows.
- [ ] Update `dispatch/README.md`, `mcp-route-guard/README.md`, `post-edit-quality/README.md`, `task-dispatch/README.md` with their own `opencode/` row.
- [ ] Update `system-spec-kit/mcp-server/hooks/README.md` and `sk-git/scripts/hooks/README.md` with their `opencode/` row.
- [ ] Note the `goal/opencode/mk-goal.js` row for the not-yet-authored `.opencode/hooks/goal/README.md` (owned by phase 008), without authoring that README in full here.

### Phase 3: Verification

- [ ] Resolve all 7 symlinks via `readlink -f` (or realpath) and confirm each points at the correct, existing `.opencode/plugins/` file.
- [ ] `validate_document.py` on all touched README files.
- [ ] Live OpenCode session: start a session from repo root, confirm the 5 reachable plugins each load exactly once with no double-registration error or duplicate log line.
- [ ] Confirm `git status` on `.opencode/plugins/` is clean.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|-------------------|
| Static | Symlink resolution | `readlink -f` / realpath on all 7 symlinks |
| Static | Plugin-file integrity | `git status` / content hash comparison on `.opencode/plugins/` before and after |
| Documentation | Touched READMEs | `validate_document.py` |
| Live smoke | OpenCode plugin discovery, zero double-load | Live OpenCode session start, log/behavior inspection for each of the 5 plugins |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 001 (`001-goal-core-and-state`) — `.opencode/hooks/goal/` concern folder | Internal (sibling phase) | Satisfied (folder exists on disk) | Without it, only the `goal/opencode/mk-goal.js` row would need to be deferred; the other 6 symlinks are independent. |
| Real OpenCode plugin files in `.opencode/plugins/` | Internal | Available | No symlink can be created without its real target already present. |
| A runnable local OpenCode CLI/session for the live smoke test | External tool | Assumed available | Cannot obtain live double-load evidence; would have to report the double-load check as not yet run rather than claim completion. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live OpenCode session shows a plugin loading twice, or a symlink resolves to the wrong file.
- **Procedure**: `rm` the offending symlink(s) and, if needed, the empty `opencode/` subfolder; revert the associated README edits; no plugin file itself is ever touched by this phase, so no plugin-side rollback is needed.
- **Data impact**: None. Symlinks and documentation only, no code or state changes.
<!-- /ANCHOR:rollback -->
