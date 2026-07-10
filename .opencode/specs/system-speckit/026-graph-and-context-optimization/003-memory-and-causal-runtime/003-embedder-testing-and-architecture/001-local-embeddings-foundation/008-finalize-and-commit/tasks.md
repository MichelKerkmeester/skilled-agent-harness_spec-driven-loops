---
title: "Tasks: Phase 8 — Finalize + Commit"
description: "Validation cascade + commit authorship + post-merge checklist. User-driven git commit."
trigger_phrases:
  - "008 tasks finalize commit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/008-finalize-and-commit"
    last_updated_at: "2026-05-12T22:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks drafted"
    next_safe_action: "Run validate cascade"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140080c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-008-finalize-2026-05-12"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8 — Finalize + Commit

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Strict-validate packet 001
- [ ] T002 Strict-validate packet 002
- [ ] T003 Strict-validate packet 003
- [ ] T004 Strict-validate packet 004
- [ ] T005 Strict-validate packet 005
- [ ] T006 Strict-validate packet 006
- [ ] T007 Strict-validate packet 007
- [ ] T008 Strict-validate packet 008 (this one)
- [ ] T009 Strict-validate packet 009
- [ ] T010 Strict-validate parent (recursive)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Build files-changed inventory: `git status` + `git diff --stat`
- [ ] T012 Write `scratch/commit-message.txt` (conventional commit body)
- [ ] T013 Write `scratch/post-merge-checks.md` (user verification checklist)
- [ ] T014 Refresh `handover.md` terminal state
- [ ] T015 Refresh `implementation-summary.md` with files-changed inventory
- [ ] T016 Run `memory_index_scan` to pick up the final-state docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Validate this 008 packet itself
- [ ] T018 Print the commit command for the user: `git add -A && git commit -F .opencode/specs/.../008/scratch/commit-message.txt`
- [ ] T019 Update parent `graph-metadata.json` (`derived.status = completed`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All packets strict-validate exit 0
- [ ] Commit message + post-merge checklist authored
- [ ] handover.md + implementation-summary.md reflect terminal state
- [ ] User runs commit (out of agent scope)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Commit message**: `scratch/commit-message.txt` (to be authored)
- **Post-merge checks**: `scratch/post-merge-checks.md` (to be authored)
<!-- /ANCHOR:cross-refs -->
