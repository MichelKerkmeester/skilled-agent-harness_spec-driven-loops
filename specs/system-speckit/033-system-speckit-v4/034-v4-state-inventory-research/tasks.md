---
title: "Tasks: v4 state inventory research"
description: "Setup, run, merge and close tasks for the two-lane inventory research, with the verification checklist that gates closure."
trigger_phrases:
  - "v4 state inventory tasks"
  - "research lane task list"
  - "luna deepseek lane checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4 state inventory research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open, `[x]` done, `[B]` blocked
- `[P]` may run in parallel with its neighbours
- Paths in parentheses name the file a task produces
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold this child under the v4 parent and fill the planning documents (spec.md, plan.md, tasks.md, acceptance-criteria.md)
- [x] T002 Write the research charter with ten angles and the ground-truth files per angle (scratch/topic.txt)
- [x] T003 [P] Verify codex and devin are on PATH and authenticated before launch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Run

- [x] T004 Launch both lanes detached through fanout-run.cjs, ten iterations each, stop policy max-iterations (scratch/launch-research.sh)
- [x] T005 Monitor log growth and iteration files; resume a lane silent for fifteen minutes (research/lineages/*/iterations)
- [x] T006 Confirm ten iteration files and ten state events per lane and that each lane's research.md was synthesized
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Merge

- [x] T007 Merge the two lanes into one inventory and one drift table, keeping disagreements as rows (research/research.md)
- [x] T008 Reproduce every P0 and P1 drift row in this session; drop what does not reproduce (research/confirmed-drift.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Close

- [x] T009 Run strict validation on this child and the parent
- [x] T010 Regenerate description and graph metadata, stamp completion, add the parent map row and the timeline entry
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-references -->
## Cross-References

- `spec.md` requirements REQ-001 to REQ-006
- `acceptance-criteria.md` AC-001 to AC-006
- `../CHANGELOG-v4.0.0.0.md`, the draft under test
<!-- /ANCHOR:cross-references -->

---

<!-- ANCHOR:verification -->
## Verification Checklist

## Verification Protocol

Every row below is ticked only with the command or listing that proved it, recorded in implementation-summary.md. Gate: `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/034-v4-state-inventory-research --strict` must print `RESULT: PASSED`; iteration proof: `ls research/lineages/*/iterations | wc -l` equals 20.

## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available

## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Ten iterations and ten events per lane confirmed by listing
- [x] CHK-022 [P1] Every P0 and P1 drift row reproduced or dropped with a note

## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
<!-- /ANCHOR:verification -->
