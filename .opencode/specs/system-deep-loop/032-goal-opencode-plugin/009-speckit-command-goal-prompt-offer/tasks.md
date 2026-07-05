---
title: "Tasks: Phase 9: speckit-command-goal-prompt-offer"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "speckit command goal prompt offer tasks"
  - "phase 009 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Completed command goal offer"
    next_safe_action: "Refresh generated metadata"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/speckit_plan_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_plan_auto.yaml"
      - ".opencode/commands/speckit/plan.md"
    session_dedup:
      fingerprint: "sha256:66ff3b9d4156d6d61ba27df0c3403f331b0c1138faee07c512ed2b0ff81dfd03"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: speckit-command-goal-prompt-offer

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

- [x] T001 Confirm the pre-change zero-hit baseline: `rg -n "goal_prompt_choice|mk_goal" .opencode/commands/speckit/` (expect zero, per INT-1)
- [x] T002 [P] Re-confirm the current `allowed-tools` line on each of the four routers immediately before editing (`.opencode/commands/speckit/plan.md`, `complete.md`, `implement.md`, `resume.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Presentation Contracts (REQ-001)

- [x] T003 Draft one shared, non-blocking goal-prompt offer line consistent with each file's existing question-numbering style
- [x] T004 [P] Insert the offer into `speckit_plan_presentation.txt`'s Consolidated Prompt Template (`.opencode/commands/speckit/assets/speckit_plan_presentation.txt`)
- [x] T005 [P] Insert the offer into `speckit_complete_presentation.txt`'s equivalent template (`.opencode/commands/speckit/assets/speckit_complete_presentation.txt`)
- [x] T006 [P] Insert the offer into `speckit_implement_presentation.txt`'s equivalent template (`.opencode/commands/speckit/assets/speckit_implement_presentation.txt`)
- [x] T007 [P] Insert the offer into `speckit_resume_presentation.txt`'s equivalent template, adapted to resume framing (`.opencode/commands/speckit/assets/speckit_resume_presentation.txt`)

### Workflow YAML Fields (REQ-002)

- [x] T008 [P] Add `goal_prompt_choice` (+ `goal_objective` when `set`) to `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`
- [x] T009 [P] Add `goal_prompt_choice` (+ `goal_objective` when `set`) to `speckit_complete_auto.yaml` and `speckit_complete_confirm.yaml`
- [x] T010 [P] Add `goal_prompt_choice` (+ `goal_objective` when `set`) to `speckit_implement_auto.yaml` and `speckit_implement_confirm.yaml`
- [x] T011 [P] Add `goal_prompt_choice` (+ `goal_objective` when `set`) to `speckit_resume_auto.yaml` and `speckit_resume_confirm.yaml`

### Router Tool Permissions (REQ-003, REQ-004)

- [x] T012 Append `mk_goal, mk_goal_status` to `allowed-tools` on `.opencode/commands/speckit/plan.md`, `complete.md`, `implement.md`
- [x] T013 Append `mk_goal_status` (only) to `allowed-tools` on `.opencode/commands/speckit/resume.md`
- [x] T014 Trace every workflow file touched above and confirm `mk_goal` set-mutation is gated strictly behind `goal_prompt_choice=set` (REQ-004)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Author the INT-3 contract test (`.opencode/plugins/tests/` or equivalent), modeled on `mk-goal-export-contract.test.cjs`'s file-read + assert pattern, covering offer text (4 files), `goal_prompt_choice` (8 files), `allowed-tools` (4 routers), and zero stale `goal.md` occurrences
- [x] T016 Run `node --test` on the new contract test; paste green output
- [x] T017 Prove the test actually pins the surfaces: temporarily mutate one covered file, confirm the test fails, then restore and re-confirm green
- [x] T018 Run `validate.sh --strict` on this folder; update `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh contract-test run pasted as evidence, not cited from a prior run
- [x] Offer wording confirmed consistent across all four presentation contracts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §E INT-1 (T003-T014), INT-2 (this phase's authorship), INT-3 (T015-T017)
- **Design input**: `handover.md` §2.1, §3.2 (historical, not edited by this phase)
<!-- /ANCHOR:cross-refs -->
