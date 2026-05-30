---
title: "Tasks: Worktree-per-AI-session automation"
description: "Build task tracker for the worktree automation. Design captured; code deferred to a quiet tree."
trigger_phrases:
  - "worktree automation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/035-worktree-per-session-automation"
    last_updated_at: "2026-05-30T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Enumerated build tasks (deferred)"
    next_safe_action: "Phase 1 Step-0 boot test on a quiet tree"
    blockers: ["Code deferred to a quiet tree"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003503"
      session_id: "035-worktree-tasks"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: Worktree-per-AI-session automation

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Capture the approved design (mechanism, hybrid DBs, 5 runtimes, reaper) as this packet
- [x] T002 Record Step-0 gate status (getDbDir reads the override + .db-updated derives; WAL/marker relocation still to boot-test)
- [x] T003 Step-0 boot test DONE: daemon boots against an in-repo SPEC_KIT_DB_DIR, IPC socket relocates, shared DB untouched, clean SIGTERM removes marker (DB files lazy-created on first tool call, not boot). Surfaced the sun_path socket-length blocker (174-char worktree socket > macOS ~104) and fixed it with SPECKIT_IPC_SOCKET_DIR; verified end-to-end on a real `git worktree add`
- [x] T004 Added `.worktrees/` to `.gitignore`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 worktree-session.sh BUILT + verified: child guard (AI_SESSION_CHILD + structural git-common-dir backstop), allocate worktree + branch, symlink shared deps, per-worktree DB env + SPECKIT_IPC_SOCKET_DIR socket fix, exec. Dry-run tested all three paths; real-worktree daemon boot verified (BOOTED=1, EINVAL=0).
- [ ] T006 [B] Per-runtime entry points (claude/codex/opencode/devin/gemini) + AI_SESSION_CHILD=1 at cli-* dispatch sites (environment-specific shell wiring — pending operator)
- [ ] T007 [B] Guard-hook step in each runtime's SessionStart chain (detect-and-warn)
- [x] T008 worktree-reaper.sh BUILT + verified (NEW focused script, not session-cleanup.sh which does not exist): prune merged/clean worktrees + stale ~/.spk-wt-sock socket dirs, report orphan daemons (--reap-daemons to kill). Dry-run clean.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [B] Top-level isolation + child suppression + two-concurrent-session tests
- [ ] T010 [B] Per-runtime smoke + reaper safety (sibling worktree untouched)
- [ ] T011 [B] Document the wrapper + deliberate symlink-deps override in sk-git

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Step-0 gate green; wrapper isolates top-level + suppresses children
- [ ] Five runtimes smoke-tested; reaper safe
- [ ] sk-git documents the pattern

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Approved design**: `~/.claude/plans/can-we-automate-this-noble-nebula.md` (Part 3)

<!-- /ANCHOR:cross-refs -->
