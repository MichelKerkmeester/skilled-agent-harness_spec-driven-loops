---
title: "Tasks: Deep-loop empty archive-dir fix"
description: "Task tracking for removing eager archive-root creation in deep-loop commands, adding regression tests, and cleaning existing empty archive dirs."
trigger_phrases:
  - "deep loop archive tasks"
  - "archive dir cleanup tasks"
  - "empty archive fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 16 tasks completed across investigate / fix / verify-clean phases"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-archive-fix-20260529"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-loop empty archive-dir fix

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

- [x] T001 Enumerate all `*_archive` dirs and classify empty vs populated
- [x] T002 Git-archaeology: confirm research init introduced `archive_root` (commit `537cd82d26`); review init never had it
- [x] T003 [P] cli-opencode `openai/gpt-5.5-fast --variant high` read-only deep-trace + patch proposal
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove `{state_paths.archive_root}` from research init (`deep_start-research-loop_confirm.yaml:138`)
- [x] T005 Remove `{state_paths.archive_root}` from research init (`deep_start-research-loop_auto.yaml:154`)
- [x] T006 Lazy+guarded restart archive (`deep_start-research-loop_confirm.yaml:181`)
- [x] T007 Lazy+guarded restart archive (`deep_start-research-loop_auto.yaml:220`)
- [x] T008 Lazy+guarded restart archive (`deep_start-review-loop_confirm.yaml:204`)
- [x] T009 Lazy+guarded restart archive (`deep_start-review-loop_auto.yaml:210`)
- [x] T010 [P] Regression assertion (`scripts/tests/deep-research-contract-parity.vitest.ts`)
- [x] T011 [P] Regression assertion (`scripts/tests/deep-review-contract-parity.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 YAML parse + grep invariants (no init archive_root; 4 guarded restarts)
- [x] T013 Fresh-init / restart-present / restart-absent simulation
- [x] T014 Run resolver + contract-parity + reducer-schema suites (26 passed)
- [x] T015 Remove 5 empty `*_archive` dirs (untracked); keep 5 populated
- [x] T016 Author spec folder docs + validate --strict
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Static + behavioral + contract verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
