---
title: "Tasks: semantic_shadow Doc/Comment Sync (F3)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F3 tasks doc sync"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/004-semantic-shadow-doc-sync"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced tasks"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: semantic_shadow Doc/Comment Sync (F3)

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

- [ ] T001 Confirm lane-registry.ts:12 (0.05/live) + vitest:212-213 fused shadowOnly:false
- [ ] T002 Grep consumers of raw `LaneMatch.shadowOnly`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Update SC-004 (004-lane-attribution.md) to expect shadowOnly:false for the live lane
- [ ] T004 [P] Update SC-005 (005-ablation.md) to treat semantic_shadow as a non-zero ablation lane
- [ ] T005 [P] Update feature_catalog/04--scorer-fusion/04-attribution.md
- [ ] T006 Fix the stale comment in lanes/semantic-shadow.ts (clarify raw flag; keep weight)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Re-run SC-004/SC-005 against live build — PASS, weight unchanged
- [ ] T008 semantic-shadow-cosine.vitest.ts still green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] SC-004/SC-005 PASS; lane weight unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F3
<!-- /ANCHOR:cross-refs -->
