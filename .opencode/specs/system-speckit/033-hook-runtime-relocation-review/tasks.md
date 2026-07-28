---
title: "Tasks: Relocate fully-portable runtime-hook guard cores"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook relocation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Task list authored retroactively"
    next_safe_action: "Dispatch deep-review auto YAML"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Relocate fully-portable runtime-hook guard cores

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace import dependencies for dispatch, mcp-route-guard, post-edit-quality, task-dispatch, fable-subagent-guard.
- [x] T002 Trace import dependencies for spec-gate, session-lifecycle, skill-advisor brief, git-preflight-advisory; confirm each fails the portability test.
- [x] T003 Create isolated worktree `.worktrees/0118-skilled-hook-runtime-relocation` on branch `skilled/0118-hook-runtime-relocation`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv` dispatch/mcp-route-guard/post-edit-quality/task-dispatch cores + adapters into `.opencode/runtime-hooks/{concern}/` (`.opencode/runtime-hooks/README.md`).
- [x] T005 Repoint 4 runtime config files and re-`ln -s` all affected discovery mirror symlinks.
- [x] T006 Fix `.pi/extensions/*.ts` and `.opencode/plugins/mk-*.js` import/require paths, including a concurrent session's new `git-preflight-advisory.ts`.
- [x] T007 [P] Second grep sweep for hardcoded (non-import) path-string constants; fix cross-adapter `spawnSync` targets (Cursor adapters, `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fix and re-verify 5 test files with stale relative-path constants (`dispatch-rule-checks.test.mjs`, `mcp-route-guard.test.cjs`, `mk-post-edit-quality.test.cjs`, `claude-task-dispatch-guard.test.cjs`, `test-root-name-consumer-matrix.cjs`).
- [x] T009 Re-verify `dispatch-audit.test.mjs` via its own documented `npx vitest run` invocation (false-alarm avoided).
- [x] T010 Batch-fix ~20 documentation files; manually recompute relative-depth math for 2 files where the first sed pass was wrong.
- [x] T011 Run `validate_document.py` on every touched/new documentation file.
- [x] T012 Confirm `mcp-code-mode` `parent-skill-check.cjs` failures are pre-existing (identical run against the unmodified main tree).
- [x] T013 Commit relocation as `40d5f0d2b3` (25 `git mv`, 58 modified, 1 added).
- [x] T014 Author this Level 2 review-hosting packet (spec/plan/tasks/checklist/implementation-summary).
- [ ] T015 Dispatch `/deep:review:auto`: 5 forced iterations, `stop_policy=max-iterations`, executor `cli-opencode` `gpt-5.6-sol` reasoning `high`.
- [ ] T016 Synthesize the review verdict and resolve the merge/push/leave-local decision with the operator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T015-T016 pending the deep review)
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
