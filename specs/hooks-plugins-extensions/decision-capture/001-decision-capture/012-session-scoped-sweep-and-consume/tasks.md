---
title: "Tasks: Phase 12: session-scoped-sweep-and-consume"
description: "Reproduce both defects in a scratch probe, dispatch three literal briefs, then rerun every suite and the probe."
trigger_phrases:
  - "session scoped sweep and consume tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: session-scoped-sweep-and-consume

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DC` is `.skilled/hooks/decision-capture`. `PROBE` is the scratch probe script that builds a scratch HOME and a repository with one linked worktree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the sweep defect (`PROBE`). Verify: it prints `other-session` from the primary checkout and `no transcript found` from the worktree.
- [x] T002 Reproduce the state-root defect (`PROBE`). Verify: it prints `same root: false`.
- [x] T003 Check whether a repeat save duplicates a row (`decision-record-writer.ts`). Verify: the writer reuses `existing.keyToId` for a known source key, so it does not.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Open the calling session's transcript (`DC/bin/sweep-transcript.mjs`). Verify: the new sweep test passes and fails on the old file.
- [x] T005 Resolve a linked worktree to its primary checkout (`DC/lib/capture-core.mjs`). Verify: the linked-worktree test passes and fails on the old file.
- [x] T006 Mirror the root in the writer (`decision-record-writer.ts`). Verify: the parity test passes with the linked worktree and fails on the old file.
- [x] T007 Update the three README lines on state location and transcript choice (`DC/README.md`, `DC/lib/README.md`, `DC/bin/README.md`). Verify: `rg -n CLAUDE_CODE_SESSION_ID DC/bin/README.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the hook suites. Verify: `node --test DC/lib/*.test.mjs DC/bin/*.test.mjs DC/claude/*.test.mjs DC/vibe/*.test.mjs` prints 135 passed and 0 failed.
- [x] T009 Rerun the dependent suites. Verify: the OpenCode plugin test prints 6 passed, the session-stop hook 20, the writer and matcher 33, the Pi suite 10.
- [x] T010 Rerun `PROBE` on the built code. Verify: `mine-session` from both checkouts, `same root: true`, and pending goes from 1 to 0 after a worktree save.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the scratch probe shows one session and one shared root
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
