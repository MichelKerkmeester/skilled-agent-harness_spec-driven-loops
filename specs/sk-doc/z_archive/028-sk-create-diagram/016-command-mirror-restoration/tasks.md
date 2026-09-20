---
title: "Tasks: cross-runtime command mirror restoration"
description: "Task queue for restoring dangling symlinks and completing diagram's cross-runtime mirrors."
trigger_phrases:
  - "command mirror restoration tasks"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/016-command-mirror-restoration"
    last_updated_at: "2026-08-13T17:00:20.000Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cross-runtime command mirror restoration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |

**Task Format**: T### Description
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace the deletion via `git reflog`; diff against current `HEAD` [EVIDENCE: found `.claude/commands`, `.pi/extensions/completion-evidence.ts`, `.pi/extensions/task-dispatch-guard.ts` still missing out of the 61 symlinks the bulk-sync commit deleted; the hooks-tree symlinks were already fixed by later, unrelated commits.]
- [x] T002 Confirm the diagram-mirror gap by diffing against a sibling command [EVIDENCE: `create-benchmark.md` present in `.codex/prompts/`, `.pi/prompts/`, `.cursor/commands/`; `create-diagram.md`/`.toml` absent from all three.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Restore `.claude/commands -> ../.opencode/commands` [EVIDENCE: target read from the pre-deletion git blob (`git cat-file -p`); `readlink` confirms match.]
- [x] T004 Restore both Pi extension symlinks [EVIDENCE: `git cat-file -p` targets confirmed matching `completion-evidence.ts` and `task-dispatch-guard.ts`; both present on disk before restoring.]
- [x] T005 Run `sync-prompts.cjs` and `sync-prompts-pi.cjs` [EVIDENCE: both reported `Wrote 1 of 34 generated prompts` — confirms `create-diagram` was the only missing entry across all 34 commands, no other sibling was affected.]
- [x] T006 Create the Cursor symlink [EVIDENCE: `.cursor/commands/create-diagram.md -> ../../.opencode/commands/create/diagram.md`, matching the exact relative-path pattern of the sibling symlinks in that directory.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm all 4 touched/restored symlinks resolve [EVIDENCE: `readlink -f` on each returns an existing absolute path.]
- [x] T008 Run `validate-command-references.cjs` [EVIDENCE: 2 pre-existing, unrelated failures only (ClickUp install guide, Pi runtime-dir allowlist) — nothing touching these paths.]
- [x] T009 Run `command-metadata-e2e.vitest.ts` [EVIDENCE: 2/2 tests pass.]
- [x] T010 Write `implementation-summary.md`
- [x] T011 Write `checklist.md` [EVIDENCE: `checklist.md` present with `9/9` sections filled.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required tasks marked [x]
- [x] 0 dangling symlinks remain in the command/advisor scope
- [x] `/create:diagram` reachable from all 4 runtimes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
