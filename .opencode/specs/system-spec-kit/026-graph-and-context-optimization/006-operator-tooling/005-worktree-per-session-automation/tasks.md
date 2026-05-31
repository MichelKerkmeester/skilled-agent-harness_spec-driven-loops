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
- [ ] T006 [B] Per-runtime entry points + AI_SESSION_CHILD=1 at cli-* dispatch sites: PATTERN DOCUMENTED in bin/README + sk-git §3; the actual alias + dispatch-env wiring is operator-machine-specific (shell rc / settings.local.json), left to the operator
- [x] T007 Guard-hook step BUILT as worktree-guard.sh (detect-and-warn, runtime-agnostic, non-fatal); verified across 5 paths (main warns; child/off/worktree/non-git silent; always exit 0). Operator wires it into each SessionStart chain
- [x] T008 worktree-reaper.sh BUILT + verified (NEW focused script, not session-cleanup.sh which does not exist): prune merged/clean worktrees + stale ~/.spk-wt-sock socket dirs, report orphan daemons (--reap-daemons to kill). Dry-run clean.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Top-level isolation + child suppression + two-concurrent-session test (SC-001) PASSED: distinct branches/DB-dirs/sockets, A commit independent, B + main unaffected, both daemons booted concurrently (EINVAL=0), main HEAD unchanged, worktrees cleaned
- [x] T010 Reaper safety verified: dry-run prunes nothing with no worktrees, never touches main or sibling; per-runtime smoke is the same wrapper path (runtime arg is opaque) — exercised via claude
- [x] T011 Documented the wrapper + deliberate symlink-deps override in sk-git §3 (Launch-Wrapper Worktrees vs the In-Session Ask-First Rule) + bin/README

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Step-0 gate green; wrapper isolates top-level + suppresses children
- [x] Reaper safe; guard warns on shared-main top-level sessions
- [x] sk-git + bin/README document the pattern
- [ ] Operator-machine wiring (launch aliases + SessionStart guard-hook entries + AI_SESSION_CHILD=1 at dispatch) — deferred to operator

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Approved design**: `~/.claude/plans/can-we-automate-this-noble-nebula.md` (Part 3)

<!-- /ANCHOR:cross-refs -->
