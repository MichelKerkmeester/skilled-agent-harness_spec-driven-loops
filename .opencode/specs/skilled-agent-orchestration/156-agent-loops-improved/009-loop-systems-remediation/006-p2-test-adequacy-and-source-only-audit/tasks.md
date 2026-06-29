---
title: "Tasks: P2 Test Adequacy and Source-Only Audit"
description: "Task list for the genuinely concurrent JSONL append harness remediation."
trigger_phrases:
  - "p2 test adequacy tasks"
  - "genuinely concurrent jsonl append test tasks"
  - "child process append harness tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit"
    last_updated_at: "2026-06-29T14:45:00Z"
    last_updated_by: "claude"
    recent_action: "Tracked the concurrent append harness remediation"
    next_safe_action: "Finalize the 009 parent and 156 parent metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "p2-test-adequacy-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: P2 Test Adequacy and Source-Only Audit

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

- [x] T001 Read the sequential append test (`tests/unit/jsonl-repair.vitest.ts`)
- [x] T002 Read the atomic-state genuine concurrent pattern (`tests/unit/atomic-state.vitest.ts`)
- [x] T003 Read `appendJsonlRecord` and the `spawn-cjs` helper
- [x] T004 Confirm the suite timeout (30s) and `fileParallelism: false`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `writeAppendWriter` child-writer helper (`tests/unit/jsonl-repair.vitest.ts`)
- [x] T006 Add `runAppendWriter` spawn helper (`tests/unit/jsonl-repair.vitest.ts`)
- [x] T007 Replace the sequential test with the concurrent barrier harness (`tests/unit/jsonl-repair.vitest.ts`)
- [x] T008 Add the `existsSync` / `mkdirSync` / `sleep` imports (`tests/unit/jsonl-repair.vitest.ts`)
- [x] T009 Author concrete Level-1 docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the rewritten test in isolation (10/10 pass)
- [x] T011 Run the full deep-loop-runtime suite (60 files / 545 tests)
- [x] T012 Re-run the rewritten test five times to confirm stability (5/5 pass)
- [x] T013 Run comment hygiene on the modified test file
- [x] T014 Run strict spec validation after metadata refresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Concurrent harness verified genuine and stable
- [x] Full deep-loop-runtime suite passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
