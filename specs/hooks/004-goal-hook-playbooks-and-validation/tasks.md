---
title: "Tasks: Goal-Hook Playbooks and Live Cross-Runtime Validation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal hook playbook tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/004-goal-hook-playbooks-and-validation"
    last_updated_at: "2026-07-29T09:38:42Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/checklist/summary for the goal-hook tracker"
    next_safe_action: "Run generate-description.js, backfill, and validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/pi-injection-excerpt.txt"
      - ".opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/devin-injection-excerpt.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hook-playbooks-and-validation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Goal-Hook Playbooks and Live Cross-Runtime Validation

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

- [x] T001 Confirm packet 003 (goal-hook implementation) shipped before authoring playbooks (`003-goal-hooks-cross-runtime/spec.md` completion_pct 100%)
- [x] T002 Create packet folder plus `evidence/` subdir (`evidence/` holds 5/5 captured files)
- [x] T003 [P] Read the sk-doc manual-testing-playbook template and each CLI skill's playbook conventions (`create-manual-testing-playbook/assets/manual-testing-playbook-template.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Name the DV-### goal-hook playbook scenario for cli-devin (`cli-devin/manual-testing-playbook/goal-hook/goal-hook.md`)
- [x] T005 Name the CU-### goal-hook playbook scenario for cli-cursor (`cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md`)
- [x] T006 Name the PI-### goal-hook playbook scenario for cli-pi (`cli-pi/manual-testing-playbook/goal-hook/goal-hook.md`)
- [x] T007 Name the CO-### goal-hook playbook scenario for cli-opencode (`cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`)
- [x] T008 Name the CC-### goal-hook playbook scenario for cli-claude-code (`cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md`)
- [x] T009 Name the shared goal-manage-cli playbook (`manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run live Pi validation (offline gpt, free) and capture the transcript excerpt (canary `GOALCANARY-PI-2603128151` cited verbatim by the model)
- [x] T011 Run live Devin validation (glm-5-2, free) and capture transcript plus model reply (canary `GOALCANARY-DV-1255523564` quoted verbatim, block appears 2/2 times)
- [x] T012 Run live Cursor validation (composer-2.5, paid) and record the RECORDED-EVIDENCE tier (`turns_used` 0/1, hook fires; canary+active_goal 0/0 in transcript, model-invisible by contract)
- [x] T013 Attempt live OpenCode mk-goal validation with two cheap models and document the finding (`opencode run` does not expose the `mk_goal` tool or fire the injection transform)
- [x] T014 Record Claude-native `/goal` as upstream, doc-only, not headless-scriptable (noted in `implementation-summary.md` Known Limitations)
- [x] T015 Run generate-description.js, backfill-graph-metadata.js, and `validate.sh --strict`, iterate to a clean result (final run: Errors: 0, Warnings: 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Upstream packet**: `.opencode/specs/hooks/003-goal-hooks-cross-runtime/spec.md`
<!-- /ANCHOR:cross-refs -->
