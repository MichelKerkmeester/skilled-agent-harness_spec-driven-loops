---
title: "Tasks: Code Standards Alignment"
description: "Dependency-ordered task ledger for planning an audit and alignment of the Pi Remote app code to the sk-code-opencode standards surface."
trigger_phrases:
  - "pi remote code standards alignment"
  - "pi mobile phase 13"
  - "code standards alignment"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/013-code-standards-alignment"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 013 code-standards-alignment spec set as Draft"
    next_safe_action: "Approved 013 plan, then begin 014 onboarding-and-root-readme drafting"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Tasks: Code Standards Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependency |
| `[B]` | Blocked with an explicit reason |

**Task Format**: `T### [P?] Description (owned path or evidence surface)`

The deliverables are `Apps/Pi Mobile/docs/code-standards.md` and the aligned app sources. Unchecked rows remain planning-state work.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, owned paths, rollback, and the authoritative gate.
- [ ] T002 Capture the app baseline: lint, format, typecheck, and full test run.
- [ ] T003 Confirm the `sk-code-opencode` references and checklists to apply.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run the audit across protocol, relay, web, extension, scripts, deploy shell, and config surfaces.
- [ ] T005 Record every finding in the audit matrix with its standard reference.
- [ ] T006 Reconcile `eslint.config.js`, `tsconfig.base.json`, and workspace `tsconfig.json` before editing.
- [ ] T007 [P] Apply protocol and relay alignment clusters.
- [ ] T008 [P] Apply web and extension alignment clusters.
- [ ] T009 [P] Apply script, shell, and config alignment clusters.
- [ ] T010 Author `docs/code-standards.md` and correct the stale lint/format claim in `docs/release-verification.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Re-run the app gates from final state and retain exact command, output, exit, version, and environment evidence.
- [ ] T012 Run the authoritative phase gate and the safe rollback or recovery exercise.
- [ ] T013 Reconcile checklist, current state, parent map, successor inputs, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] The app gates and the standards reference describe the same aligned state.
- [ ] Parent and child statuses plus the successor handoff describe the same final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent map**: [../spec.md](../spec.md)
- **Specification**: [spec.md](spec.md)
- **Plan**: [plan.md](plan.md)
- **Verification**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
