---
title: "Tasks: Deep-review remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep review remediation tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-deep-review-remediation"
    last_updated_at: "2026-06-08T11:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixes implemented, verified, synced"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-140-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-review remediation

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

- [x] T001 Round-2 verify the dominant P1 against acquireOwnerLeaseFile
- [x] T002 Confirm the respawn lock is the serialization primitive
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 F1: serialize stale-reclaim reap+spawn under the respawn lock; correct the comment (mk-spec-memory-launcher.cjs)
- [x] T004 F1c: refuse respawn when the child outlives SIGKILL (mk-spec-memory-launcher.cjs)
- [x] T005 [P] F2: rewrite the two 096-packet comments + add the reversed-ordering checker pattern
- [x] T006 [P] F3: harden the live-test execSync helpers to spawnSync (daemon-reelection-adoption-live.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Parse + hygiene clean; checker self-test green; reversed pattern catches
- [x] T008 Durability suite 18/18 and launcher-lease 11/11 green
- [x] T009 Fill spec docs and run validate.sh --strict
- [x] T010 Commit, push, sync launcher fixes to Barter (sk-code kept as-is)
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
