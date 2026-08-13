---
title: "Implementation Plan: cross-runtime command mirror restoration"
description: "Restore dangling symlinks and bring /create:diagram to cross-runtime parity."
trigger_phrases:
  - "command mirror restoration plan"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/016-command-mirror-restoration"
    last_updated_at: "2026-08-13T17:00:20.000Z"
    last_updated_by: "claude"
    recent_action: "Plan executed"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cross-runtime command mirror restoration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Symlinks, generated Markdown |
| **Framework** | Restore-then-generate: fix dangling symlinks first, then run the canonical generation scripts for the missing diagram mirrors |
| **Storage** | `.claude/`, `.codex/`, `.pi/`, `.cursor/` runtime directories |
| **Testing** | `readlink -f`, `validate-command-references.cjs`, `command-metadata-e2e.vitest.ts` |

### Overview

Direct execution, no model dispatch. Diagnosed via `git reflog` and diffing an earlier bulk-sync commit's deletions against current `HEAD`: 3 symlinks it deleted were never restored by the two prior repair commits (which focused on `system-speckit` packet content). Separately, a live routing audit surfaced that `/create:diagram` had never had its Codex/Pi/Cursor mirrors created at all — confirmed by diffing its file set against a sibling command's.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `git reflog` traced the deletion to its origin commit and confirmed which of its deletions were already repaired vs. still dangling.
- [x] Confirmed the diagram-mirror gap by diffing its file set against a working sibling command (`create-benchmark`).

### Definition of Done

- [x] 3 symlinks restored, confirmed resolvable.
- [x] 3 new diagram mirrors created via canonical generation, not hand-written.
- [x] `validate-command-references.cjs` shows no new failures.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Diagnose-restore-generate-verify: use `git reflog`/`git ls-tree` to find exactly what's still missing (not guess), restore symlinks with the same target the deleted tree entry recorded, generate the diagram mirrors through their real generation scripts, then verify with the repo's own integrity checkers.

### Key Components

- **Symlink restoration**: `.claude/commands`, `.pi/extensions/completion-evidence.ts`, `.pi/extensions/task-dispatch-guard.ts` — each target read directly from the pre-deletion git blob, not guessed.
- **Diagram mirror generation**: `sync-prompts.cjs` (Codex), `sync-prompts-pi.cjs` (Pi) — both auto-discover `.opencode/commands/create/*.md` and were confirmed to write exactly 1 new file each (`create-diagram.md`), proving no other command was missing a mirror.
- **Cursor mirror**: a direct symlink, matching every sibling command's pattern in that directory (confirmed, not assumed, by inspecting `create-benchmark.md` there first).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Trace the deletion to its origin commit via `git reflog`; diff its full deletion list against current `HEAD` to find what's still missing.
- [x] Confirm each symlink's original target from the pre-deletion git blob before restoring.

### Phase 2: Implementation

- [x] Restore `.claude/commands` and both Pi extension symlinks.
- [x] Run `sync-prompts.cjs` and `sync-prompts-pi.cjs`; create the Cursor symlink.

### Phase 3: Verification

- [x] Confirm all 3 restored symlinks resolve to an existing target.
- [x] Run `validate-command-references.cjs` and `command-metadata-e2e.vitest.ts`; confirm no new failures.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Symlink integrity | 3 restored + 1 new symlink | `readlink -f` |
| Command-reference integrity | Whole command surface | `validate-command-references.cjs` |
| Command metadata e2e | `/create:diagram` entry | `command-metadata-e2e.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sync-prompts.cjs` / `sync-prompts-pi.cjs` | Internal | Satisfied | Would require hand-writing generated files, risking drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A restored symlink points at a target that no longer exists, or a generated mirror's content is wrong.
- **Procedure**: `git checkout -- <path>` or `rm` the symlink; each was independently confirmed resolvable before commit, so a bad restoration would surface immediately.
<!-- /ANCHOR:rollback -->
