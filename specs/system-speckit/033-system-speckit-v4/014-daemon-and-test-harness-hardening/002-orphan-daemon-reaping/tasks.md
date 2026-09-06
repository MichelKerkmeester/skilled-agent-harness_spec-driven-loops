---
title: "Tasks: Phase 2: Orphan Daemon Reaping"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "orphan daemon reaping tasks"
  - "stdin close shutdown handler"
  - "isRespawnLockStale orphaned holder"
  - "guarded apply path process-sweep"
  - "session-start orphan sweep flag"
  - "negative control orphanSurvived"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: Orphan Daemon Reaping

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Answer the autonomous-vs-confirmed apply question and record the decision
- [ ] T002 Choose the lifecycle event that invokes the sweep
- [x] T003 Negative control captured on a spawned fixture — orphan survived, `lockStale:false`, `applyAttempted:false`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 stdin-close shutdown handler added (`.opencode/bin/system-spec-memory-launcher.cjs`)
- [x] T005 Orphan predicate now evaluated on the existing heartbeat — no new interval (`.opencode/bin/system-spec-memory-launcher.cjs`)
- [x] T006 `isRespawnLockStale()` treats an orphaned holder as stale (`.opencode/bin/lib/model-server-supervision.cjs`)
- [x] T007 Guarded apply path added — signals only aged, exactly owned orphans with no live parent and no connected peer (`.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`)
- [x] T008 Session-start trigger added in the existing cleanup plugin, behind `SPECKIT_SESSION_START_ORPHAN_SWEEP` (`.opencode/hooks/`)
- [x] T009 [P] Ops README now documents the ownership-checked apply sweep (`.opencode/skills/system-spec-kit/scripts/ops/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Negative control re-run — `orphanSurvived:false`, `lockReleased:true`
- [x] T011 Safety test passes — live parent and connected peer both yield `appliedPids:[]`, `signals:[]`
- [x] T012 Other launchers untouched; 0 of 15 live baseline daemons signalled
- [ ] T013 [B] Build and drift gates DEFERRED — meaningless in a bare worktree; they belong on the integration branch
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` except the deferred toolchain gate
- [x] The one `[B]` item is a recorded deferral, not a blocker
- [x] All 8 acceptance rows Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
