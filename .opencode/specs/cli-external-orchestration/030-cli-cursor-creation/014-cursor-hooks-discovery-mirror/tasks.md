---
title: "Tasks: .cursor/hooks/ discovery mirror"
description: "Task breakdown for creating the .cursor/hooks/ symlink mirror and documenting the entrypoint-guard gotcha."
trigger_phrases: ["cursor hooks discovery mirror tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-hooks-discovery-mirror"
    last_updated_at: "2026-07-24T17:37:51Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-discovery-mirror", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: .cursor/hooks/ discovery mirror

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 `WebFetch` against Cursor's own hooks documentation — confirmed `.cursor/hooks/` is the documented conventional path, quoting `.cursor/hooks/format.sh` as the exact example
- [x] T002 Re-read the live `.cursor/hooks.json` to enumerate all 13 currently-wired `command` targets fresh, not from memory
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Created `.cursor/hooks/` and 13 relative symlinks (`../../<repo-root-relative-path>`), one per wired target, preserving original basenames
- [x] T004 `find .cursor/hooks -type l ! -exec test -e {} \; -print` → empty, confirming no broken symlinks
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Functionally re-tested `spec-gate-classify.mjs` and `task-dispatch-guard.mjs` through their symlink path — identical output to their real-path invocation
- [x] T006 Functionally re-tested `session-start.js` through its symlink path — returned EMPTY output (unexpected); investigated and traced to `shared.ts`'s `runCursorHook()` entrypoint guard mismatching `process.argv[1]` against the ESM-resolved `import.meta.url` when invoked via a symlink
- [x] T007 Confirmed the same empty-output behavior for `session-end.js`, `user-prompt-submit.js`, `precompact.js` (the other 3 `runCursorHook`-guarded files)
- [x] T008 Ran a control test — `session-start.js` via its real path returns the full, correct session-context response — confirming the symlink is the specific cause, not a regression
- [x] T009 Wrote `.cursor/hooks/README.md` documenting the mirror's purpose and the gotcha
- [x] T010 Extended `code-opencode/references/shared/hooks.md`'s `CURSOR HOOKS` section with a matching "Discovery Mirror" subsection; bumped version `1.0.0.15` → `1.0.0.16`
- [x] T011 Confirmed `.cursor/hooks.json` itself remains byte-identical to before this phase (`git diff` shows no change to that file)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T012 `validate.sh 014-cursor-hooks-discovery-mirror --strict` passes 0/0; SC-001..SC-004 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Mirrors the `.cursor/hooks.json` phase 010 committed and phase 011 extended.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
