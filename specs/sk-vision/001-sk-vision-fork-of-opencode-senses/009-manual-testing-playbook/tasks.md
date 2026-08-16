---
title: "Tasks: sk-vision 009 manual testing playbook"
description: "Executable tasks for the manual testing playbook child."
trigger_phrases:
  - "sk-vision 009 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 009 task list."
    next_safe_action: "Complete T001-T013 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-009-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 009 manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Read both template assets + prompt-voice reference
- [ ] T002 Read the 008 catalog entries for cross-links; read runtime.py + pi factory for command surfaces
- [ ] T003 Create the five category folders
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author root `manual-testing-playbook/manual-testing-playbook.md` from the template (policy, preconditions, evidence rules, review protocol, category summaries, test cross-refs, catalog index)
- [ ] T005 Author 5 `scene-understanding/` scenarios (VSN-001..005)
- [ ] T006 Author 6 `pixel-analysis/` scenarios (VSN-006..011)
- [ ] T007 Author 2 `system-health/` scenarios (VSN-012..013)
- [ ] T008 Author 2 `host-adapters/` scenarios (VSN-014..015)
- [ ] T009 Author 1 `runtime-core/` scenario (VSN-016)
- [ ] T010 Scaffold `benchmark/README.md` + `benchmark/reports/README.md` (no report files authored)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Prove 17 playbook docs + 2 benchmark docs exist; prompts synchronized per file
- [ ] T012 Run `validate_document.py --type reference` on root + `validate-playbook-package.cjs` — exit 0
- [ ] T013 Optional live runs (operator-gated): persist PASS/SKIP evidence via `run-manual-playbook-scenario.cjs`; if skipped, record named blocker; run `validate.sh --strict` on this child; all tasks `[x]` with evidence
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
