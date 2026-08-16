---
title: "Tasks: sk-vision 009 manual testing playbook"
description: "Task list for the manual testing playbook child."
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
# Tasks: sk-vision 009 manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:tasks -->
## Tasks

| ID | Task | Status |
|----|------|--------|
| T001 | Read both template assets + prompt-voice reference; read 008 catalog entries and shipped command surfaces | [ ] |
| T002 | Create category folders (`scene-understanding/`, `pixel-analysis/`, `system-health/`, `host-adapters/`, `runtime-core/`) | [ ] |
| T003 | Author root `manual-testing-playbook/manual-testing-playbook.md` from the template (policy, preconditions, evidence rules, review protocol, category summaries, test cross-refs, catalog index) | [ ] |
| T004 | Author 5 `scene-understanding/` scenarios (VSN-001..005) | [ ] |
| T005 | Author 6 `pixel-analysis/` scenarios (VSN-006..011) | [ ] |
| T006 | Author 2 `system-health/` scenarios (VSN-012..013) | [ ] |
| T007 | Author 2 `host-adapters/` scenarios (VSN-014..015) | [ ] |
| T008 | Author 1 `runtime-core/` scenario (VSN-016) | [ ] |
| T009 | Scaffold `benchmark/README.md` + `benchmark/reports/README.md` (no report files authored) | [ ] |
| T010 | Prove 17 playbook docs + 2 benchmark docs exist; prompts synchronized per file | [ ] |
| T011 | Run `validate_document.py --type reference` on root + `validate-playbook-package.cjs` — exit 0 | [ ] |
| T012 | Optional live runs (operator-gated): persist PASS/SKIP evidence via `run-manual-playbook-scenario.cjs`; if skipped, record named blocker | [ ] |
| T013 | Run `validate.sh --strict` on this child; all tasks `[x]` with evidence | [ ] |
<!-- /ANCHOR:tasks -->
