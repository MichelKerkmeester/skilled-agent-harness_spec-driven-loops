---
title: "Tasks: Portable cross-machine hook paths and Barter framework sync"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "portable hook paths tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-portable-cross-machine"
    last_updated_at: "2026-06-08T06:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Hook portability + Barter sync complete"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".codex/hooks.json"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-138-portable-cross-machine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Portable cross-machine hook paths and Barter framework sync

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

- [x] T001 Diagnose the hardcoded paths and the n/bin/node corruption across Public and Barter
- [x] T002 Confirm the runtime env-var pattern from the working Devin hook
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the idempotent path fixer
- [x] T004 [P] Fix Public .codex/hooks.json (portable cd + PATH node)
- [x] T005 [P] Fix Public .devin/hooks.v1.json (PATH node)
- [x] T006 Fix the three Barter hook configs (.claude/settings.local.json, .codex/hooks.json, .devin/hooks.v1.json)
- [x] T007 Surgically sync the 322 changed framework files Public to Barter (rsync --files-from, symlinks preserved)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 All five configs JSON-valid and grep-clean of hardcoded/corrupted paths
- [x] T009 Barter preserve-list (sk-code, sk-git, Barter-only skills) and runtime configs untouched; launcher carries the reap fix
- [x] T010 Fill spec docs, validate.sh --strict, commit Public changes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
