---
title: "Tasks: 101/004 Deep AI Council Playbook Graph Coverage"
description: "Task list for renaming DAC-011 file, updating root playbook, and authoring 8 new graph integration scenarios."
trigger_phrases:
  - "101/004 tasks"
  - "deep-ai-council playbook graph tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage"
    last_updated_at: "2026-05-11T07:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task breakdown"
    next_safe_action: "Begin T010 file rename"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/manual_testing_playbook/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-004-playbook-graph-coverage"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/004 Deep AI Council Playbook Graph Coverage

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

- [x] T001 Audit packet 101 (3 phases) and identify playbook misalignment
- [x] T002 Approve plan via /remote-control workflow
- [x] T003 Create packet via `system-spec-kit/scripts/spec/create.sh --level 1` (originally 103, then re-homed under 101 as phase 4)
- [x] T004 Author spec.md, plan.md, tasks.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Rename `05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md` → `001-graph-support-derived-and-scoped.md` via `git mv`
- [ ] T011 Update §3 of renamed DAC-011 file with forward-pointer to DAC-019..DAC-026
- [ ] T012 Update §5 SOURCE METADATA `Feature file path:` line in DAC-011 file to match new filename
- [ ] T013 Edit root `manual_testing_playbook.md` §1 OVERVIEW: count `18`→`26`, categories `7`→`8`, coverage note date + functional graph append
- [ ] T014 Edit root playbook canonical artifacts list: add `08--council-graph-integration/`
- [ ] T015 Edit root playbook TABLE OF CONTENTS: add new §16 entry
- [ ] T016 Edit root playbook §11 SCOPE BOUNDARIES: update DAC-011 path + add forward-pointer line
- [ ] T017 Edit root playbook §14 AUTOMATED TEST CROSS-REFERENCE: add `tests/council-graph.vitest.ts` row
- [ ] T018 Edit root playbook §15 FEATURE CATALOG CROSS-REFERENCE INDEX: add 8 rows for DAC-019..DAC-026 + update DAC-011 path
- [ ] T019 Add new §16 COUNCIL GRAPH INTEGRATION section with 8 sub-entries
- [ ] T020 Create `08--council-graph-integration/` folder
- [ ] T021 [P] Author DAC-019 `001-council-graph-upsert-idempotency-and-self-loop-rejection.md`
- [ ] T022 [P] Author DAC-020 `002-council-graph-upsert-empty-input-no-op-success.md`
- [ ] T023 [P] Author DAC-021 `003-council-graph-query-hostile-metadata-redaction.md`
- [ ] T024 [P] Author DAC-022 `004-council-graph-query-five-modes-prompt-safe-context.md`
- [ ] T025 [P] Author DAC-023 `005-council-graph-convergence-three-state-decision-matrix.md`
- [ ] T026 [P] Author DAC-024 `006-council-graph-status-recovery-payload-and-readiness.md`
- [ ] T027 [P] Author DAC-025 `007-council-graph-derived-projection-rebuilds-from-artifacts.md`
- [ ] T028 [P] Author DAC-026 `008-council-graph-tools-registered-separately-from-deep-loop.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `validate_document.py` on each of 8 new scenario files + renamed DAC-011 + root playbook
- [ ] T031 Run `quick_validate.py .opencode/skills/deep-ai-council`
- [ ] T032 Cross-link integrity grep: confirm root playbook references all new scenario files
- [ ] T033 Stale-vocab sweep: `rg -l 'explicitly-out-of-scope' .opencode/skills/deep-ai-council/` returns 0 files
- [ ] T034 Run `validate.sh --strict` on packet 101/004 (and re-validate parent 101 after children list update)
- [ ] T035 Run `tests/council-graph.vitest.ts` to confirm anchoring tests still pass
- [ ] T036 Author implementation-summary.md with verification evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T010..T036 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All P0 requirements REQ-001..REQ-006 verified with evidence
- [ ] `validate.sh --strict` exit 0 with 0 errors and 0 warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md` (filled post-implementation)
- **Audit source**: `../` (parent 101 phase folder, particularly `../003-deep-ai-council-graph-support/`)
- **Anchor docs**: `.opencode/skills/deep-ai-council/references/graph_support.md`
<!-- /ANCHOR:cross-refs -->
