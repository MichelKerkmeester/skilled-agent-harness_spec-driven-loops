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

- [x] T001 Read both template assets + prompt-voice reference [evidence: read both template assets (manual-testing-playbook-template.md, -snippet-template.md) + references/prompt-voice.md in full - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T002 Read the 008 catalog entries for cross-links; read runtime.py + pi factory for command surfaces [evidence: read all 16 catalog entries (names + paths listed), runtime.py handlers (response shapes captured), pi/sk-vision.ts (13 tool registrations) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T003 Create the five category folders [evidence: mkdir -p for 5 category folders under manual-testing-playbook/ - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author root `manual-testing-playbook/manual-testing-playbook.md` from the template (policy, preconditions, evidence rules, review protocol, category summaries, test cross-refs, catalog index) [evidence: authored root manual-testing-playbook/manual-testing-playbook.md (21345 bytes): policy, preconditions, evidence rules, review protocol, orchestration, category summaries, automated-test cross-ref (8 bun tests), 16-row catalog index - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T005 Author 5 `scene-understanding/` scenarios (VSN-001..005) [evidence: authored scene-understanding/{inspect,ocr,detect,point,segment}.md (VSN-001..005) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T006 Author 6 `pixel-analysis/` scenarios (VSN-006..011) [evidence: authored pixel-analysis/{colors,diff,metadata,crop,zoom,annotate}.md (VSN-006..011) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T007 Author 2 `system-health/` scenarios (VSN-012..013) [evidence: authored system-health/{status,reverse}.md (VSN-012..013) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T008 Author 2 `host-adapters/` scenarios (VSN-014..015) [evidence: authored host-adapters/{opencode-plugin,pi-extension}.md (VSN-014..015) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T009 Author 1 `runtime-core/` scenario (VSN-016) [evidence: authored runtime-core/runtime-lifecycle.md (VSN-016) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T010 Scaffold `benchmark/README.md` + `benchmark/reports/README.md` (no report files authored) [evidence: scaffolded benchmark/README.md + benchmark/reports/README.md; no report files hand-authored - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Prove 17 playbook docs + 2 benchmark docs exist; prompts synchronized per file [evidence: find count = 17 playbook docs + 2 benchmark docs; escape-aware check: 16/16 files 9-column tables, prompts synchronized, expected signals reference step numbers (BAD: 0)]
- [x] T012 Run `validate_document.py --type reference` on root + `validate-playbook-package.cjs` — exit 0 [evidence: validate_document.py --type reference exit 0 (VALID, 0 issues); validate-playbook-package.cjs exit 0 (16 scenarios, 5 categories, violations=0) - gates `validate.sh` and `validate-playbook-package.cjs` exit 0]
- [x] T013 Optional live runs (operator-gated): persist PASS/SKIP evidence via `run-manual-playbook-scenario.cjs`; if skipped, record named blocker; run `validate.sh --strict` on this child; all tasks `[x]` with evidence [evidence: live runs AUTHORIZED and executed: VSN-012 status PASS + VSN-002 ocr PASS persisted via run-manual-playbook-scenario.cjs (exit 0) into benchmark/reports/2026-08-16--manual-testing-playbook--{status-live-run,ocr-live-run}/; validate.sh --strict run (see implementation-summary)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` ( [Source: T001-T013 all checked above]
- [x] No `[B]` blocked tasks remaining ( [Source: zero blocked markers in task list]
- [x] Manual verification passed ( [Source: validators exit 0; see implementation-summary.md]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
