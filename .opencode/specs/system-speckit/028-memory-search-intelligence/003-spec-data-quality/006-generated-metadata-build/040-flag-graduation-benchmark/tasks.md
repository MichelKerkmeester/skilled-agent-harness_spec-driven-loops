---
title: "Tasks: Flag Graduation Benchmark [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "flag graduation benchmark"
  - "stage 4 before and after benchmark"
  - "default off flag earn or delete"
  - "graduate flag to default on"
  - "keep off flag roadmap verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark"
    last_updated_at: "2026-07-04T17:11:54.215Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the task list at PLANNED, all tasks pending"
    next_safe_action: "Confirm phase 039 done, then start the flag-set iterator task"
    blockers:
      - "HARD-GATED on phase 039, the full-repo migration, being done"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-040-flag-graduation-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Flag Graduation Benchmark

<!-- SPECKIT_LEVEL: 2 -->
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

- [B] T001 Confirm phase 039 is done so the corpus is fully migrated before any measurement
- [ ] T002 Confirm the phase 029 benchmark harness and the phase 025 false-confirm driver run against the live corpus
- [ ] T003 [P] Pin the flag set under test and the noise band for a measurable earn
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the flag-set iterator that toggles each program flag in isolation against the same corpus and query set (`.opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts`)
- [ ] T005 Build the before-and-after runner composing the phase 029 harness and the phase 025 false-confirm driver for the baseline and the flag-on state (`.opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts`)
- [ ] T006 Implement the dual graduation gate over the retrieval-or-scoring metric and the false-confirm safety metric (`.opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts`)
- [ ] T007 Write the verdict writer for `benchmark-status.md` and `keep-off-flag-roadmap.md` and the default flipper for the graduated flags (`.opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts`)
- [ ] T008 Flip each graduated flag's default to ON and leave the kept-off flags default-OFF (`.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`)
- [ ] T009 Author the vitest covering single-flag isolation, the dual safety gate, a neutral-result keep-off and the kept-off default (`.opencode/skills/system-spec-kit/scripts/tests/flag-graduation-benchmark.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the benchmark over the migrated corpus and confirm a per-flag before-and-after delta for every flag, with a false-confirm regression blocking graduation
- [ ] T011 Confirm the earners read default-ON, the kept-off flags read default-OFF, and both verdict docs record every flag and every kept-off reason
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
</content>
