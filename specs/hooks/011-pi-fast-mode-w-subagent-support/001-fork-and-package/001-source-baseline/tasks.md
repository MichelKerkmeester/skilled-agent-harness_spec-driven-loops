---
title: "Tasks: Phase 1 source-baseline"
description: "Task ledger for creating the isolated upstream source baseline."
trigger_phrases:
  - "source-baseline tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline"
    last_updated_at: "2026-08-16T12:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed source-baseline tasks: copy verified, reference unchanged"
    next_safe_action: "Hand off to 002-identity-config-compat"
    blockers: []
    key_files: ["../../context/pi-openai-fast-mode/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Phase 1 source-baseline

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T101 Decide and record the working package location outside `context/`.
- [x] T102 Inventory the pinned source at `context/pi-openai-fast-mode/` (commit `9b28456`, v0.3.0, per `context/README.md`) and record the copy list: `src/commands.ts`, `src/config.ts`, `src/index.ts`, `src/payload.ts`, `src/status.ts`, `src/types.ts`, `tests/commands.test.ts`, `tests/config.test.ts`, `tests/extension.test.ts`, `tests/payload-status.test.ts`, `package.json`, `tsconfig.json`, `README.md`, `LICENSE`, `.gitignore`, `preview-img.png`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T103 Copy exactly the T102 inventory into the working package, excluding `.git`, `node_modules`, and any local build/install artifacts. — 16 files copied into `packages/pi-fast-mode-w-subagent-support/`; leaked-artifacts count = 0.
- [x] T104 Confirm the copied entry points and package files exist without changing source logic. — `find` = 16 files; `src/index.ts` + `package.json` present; `diff -rq`/`cmp` byte-identical to source.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T105 Prove the pinned tree is unchanged via `git status`/`git diff` on `context/pi-openai-fast-mode/` before and after the copy. — `git status --short` on the reference = 0 lines before AND after.
- [x] T106 Record the rollback command `rm -rf packages/pi-fast-mode-w-subagent-support` and re-copy from the pinned source. — recorded in `plan.md` §7.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
