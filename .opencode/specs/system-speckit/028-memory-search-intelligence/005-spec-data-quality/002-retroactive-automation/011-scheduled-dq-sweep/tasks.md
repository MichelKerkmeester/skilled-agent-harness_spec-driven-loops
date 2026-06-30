---
title: "Tasks: B1 Scheduled DQ Sweep [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "scheduled dq sweep"
  - "data quality sweep"
  - "github actions schedule"
  - "post-merge hook"
  - "guarded auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/002-retroactive-automation/011-scheduled-dq-sweep"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "benchmark-spec-author"
    recent_action: "Mirrored benchmark and test into Phase 3 tasks"
    next_safe_action: "Hold for implementation, no code has landed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: B1 Scheduled DQ Sweep

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

- [ ] T001 [B] Confirm 026-shared-safe-fix-engine has landed the engine, registry, and frozen fixClass allow-list
- [ ] T002 Confirm the backfill-frontmatter.ts dry-run, apply, and --roots contract is callable (.opencode/skills/system-spec-kit/scripts/backfill-frontmatter.ts)
- [ ] T003 [P] Stand up a dirty scratch packet fixture with a mixed safe and risky defect set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the fan-out caller over the A1 detectors plus validate.sh --json, report mode default (.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts)
- [ ] T005 Add the guarded --apply mode routing only safe-class fixes through the backfill contract (.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts)
- [ ] T006 Add the scheduled report-only workflow with schedule cron plus workflow_dispatch, no commit step (.github/workflows/dq-corpus-sweep.yml)
- [ ] T007 Register the opt-in post-merge hook through the existing globbing installer, no installer change
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Report run on a dirty scratch packet exits non-zero with findings and leaves the working tree clean
- [ ] T009 Apply run mutates only safe-class targets, a second apply is an empty diff, plus edge cases (empty subtree, missing metadata, malformed validate output, detector throw)
- [ ] T010 Update documentation (spec/plan/tasks/checklist)
- [ ] T011 Pin the benchmark thresholds and reproduce commands on the frozen fixture (planted catch-rate 100 percent, safe-class conformance count 0, swap precision 1.0, idempotency, first-run real-defect floor) (scratch/dq-sweep-fixture/)
- [ ] T012 Author the named caller test asserting the safe-class filter, the planted catch-rate, apply precision, idempotency and the edge cases (.opencode/skills/system-spec-kit/scripts/tests/dq-sweep.vitest.ts)
- [ ] T013 Gate the mutation path behind SPECKIT_DQ_SWEEP default false, register it in ALL_SPECKIT_FLAGS plus FLAG_CHECKERS and prove flags-off byte-identical (.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts)
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
