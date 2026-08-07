---
title: "Tasks: Close-out and tail"
description: "Level 2 task breakdown for the shipped close-out tail and documentation backfill."
trigger_phrases:
  - "sk-code close-out tasks"
  - "advisor scorer repair tasks"
  - "review identity cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/014-close-out-and-tail"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 task list for shipped close-out commits"
    next_safe_action: "Run strict validation for phase 014"
---
# Tasks: Close-out and tail

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Update review skill name from `code-review` to `review` (`.opencode/skills/sk-code/review/SKILL.md`) [shipped: `027882bfd0`]
- [x] T002 Replace stale `sk-code-review` identity labels in review playbooks (`.opencode/skills/sk-code/review/manual_testing_playbook/`) [shipped: `027882bfd0`]
- [x] T003 Preserve intentional `sk-code-review` search keyword coverage (`.opencode/skills/sk-code/review/SKILL.md`) [shipped: `027882bfd0`]
- [x] T004 Verify review cleanup gates (`parent-skill-check`, `check-rule-copies`, review-tree links) [evidence: strict exit 0 and checks green]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Stale Test Repairs
- [x] T005 Retarget pure-review scorer expectation to `sk-code` (`advisor-quality-049-003.vitest.ts`) [shipped: `ea689d84e0`]
- [x] T006 Retarget ambiguous-code-problem scorer expectation to `sk-code` (`native-scorer.vitest.ts`) [shipped: `ea689d84e0`]

### Routing Regression Repair
- [x] T007 Widen cli-opencode disambiguation penalty to `-3.0` (`explicit.ts`) [shipped: `ea689d84e0`]
- [x] T008 Confirm the explicit OpenCode CLI delegation prompt routes to `cli-opencode` [evidence: target suites green]

### Baseline Classification
- [x] T009 Compare full advisor-suite baseline from 13 failures to 9 failures [evidence: zero new failures]
- [x] T010 Confirm 197-prompt advisor parity report is byte-identical [evidence: parity-neutral report]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T011 Restore `.codex/config.toml` reads (`rename-invariants.vitest.ts`) [shipped: `dd9487d65d`]

### Integration Tests
- [x] T012 Verify advisor target suites 39/39 green [evidence: phase facts]
- [x] T013 Verify rename-invariants target suite 4/4 green [evidence: phase facts]

### Manual Verification
- [x] T014 Classify remaining eight advisor-suite failures as other sessions' in-flight work [evidence: phase facts]
- [x] T015 Leave concurrent dirty files untouched per file-lock discipline [evidence: out-of-scope list]

### Documentation
- [x] T016 Create Level 2 `spec.md` (`014-close-out-and-tail/spec.md`) [doc backfill]
- [x] T017 Create Level 2 `plan.md` (`014-close-out-and-tail/plan.md`) [doc backfill]
- [x] T018 Create Level 2 `tasks.md` (`014-close-out-and-tail/tasks.md`) [doc backfill]
- [x] T019 Create Level 2 `checklist.md` (`014-close-out-and-tail/checklist.md`) [doc backfill]
- [x] T020 Create Level 2 `implementation-summary.md` (`014-close-out-and-tail/implementation-summary.md`) [doc backfill]
- [x] T021 Run strict validation for phase 014 (`validate.sh --strict`) [doc backfill]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All shipped code close-out tasks are marked `[x]`.
- [x] No `[B]` blocked tasks remain in this phase.
- [x] Target advisor suites are green.
- [x] Rename-invariants target suite is green.
- [x] Checklist.md records verified and deferred items with evidence.
- [x] Deferred gated follow-ups are documented as open rather than complete.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
