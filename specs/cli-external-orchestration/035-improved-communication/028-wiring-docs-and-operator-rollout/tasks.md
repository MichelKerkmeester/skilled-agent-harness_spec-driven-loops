---
title: "Tasks: Phase 028 Wiring Docs and Operator Rollout"
description: "Planned task breakdown for authoring the operator documentation for the wired projection: the enablement guide, the rollout runbook, and the rollback path, conformed to the sk-doc reference standard."
trigger_phrases:
  - "wiring-docs-and-operator-rollout"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/028-wiring-docs-and-operator-rollout"
    last_updated_at: "2026-08-14T08:58:00.000Z"
    last_updated_by: "claude"
    recent_action: "Completed all eleven tasks with observed evidence."
    next_safe_action: "Hand the parent packet its closing-phase handoff for the parent-packet decision."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-028-wiring-docs-rollout-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "All eleven tasks are complete with observed evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 028 Wiring Docs and Operator Rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory the enablement sources, precedence, and privacy boundary (Phase 016 enablement gate, `docs/configuration.md`) [evidence: `src/config/enablement.ts` and `docs/enablement.md` sections 2 and 3]
- [x] T002 Inventory the per-runtime launch commands: the OpenCode plugin install and each wrapper entrypoint (Phases 019 through 025) [evidence: `.opencode/plugins/mk-communication-projection.js`, `bin/cli-output-wrapper.mjs`, the wrapper registry, and `docs/enablement.md` sections 5 and 6]
- [x] T003 Inventory the capability and privacy prerequisites and the evaluation-gate report fields (Phases 005, 007, and 027) [evidence: `src/doctor/doctor.ts`, `src/release/release-gate.ts`, `src/evaluation/gate.ts`, and `docs/runbook.md` sections 3, 4 and 5]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the enablement guide covering `COMMUNICATION_PROJECTION_ENABLED`, `enablement.local.json`, and precedence (`docs/enablement.md`) [evidence: `docs/enablement.md` sections 2 and 3]
- [x] T005 Author the per-runtime setup: installing the OpenCode plugin and launching each wrapper runtime (`docs/enablement.md`) [evidence: `docs/enablement.md` sections 5 and 6]
- [x] T006 Author the rollout runbook staging enablement behind the capability, privacy, and evaluation-gate prerequisites (`docs/runbook.md`) [evidence: `docs/runbook.md` sections 2 through 5]
- [x] T007 Author the rollback path covering flag disable, `OriginalOnlyEmergencyMode`, plugin uninstall, and stopping wrappers (`docs/rollback.md`) [evidence: `docs/rollback.md` sections 2 through 5]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `validate_document.py --type reference` on every authored operator doc (`validate_document.py`) [evidence: all three docs report `Total issues: 0`]
- [x] T009 Run the fresh-operator walkthrough: enable, verify, and roll back each runtime using only the docs (manual walkthrough) [evidence: the launcher walkthrough covers `--list`, default-off passthrough, enabled fail-open, local-override opt-in, and unknown-runtime handling]
- [x] T010 Confirm doc commands and paths match the plugin, wrappers, and gate receipts (docs diff against Phases 016 and 019 through 027) [evidence: every command in the docs was exercised live against `bin/cli-output-wrapper.mjs`; plugin, test and flag paths match the wired receipts]
- [x] T011 Run strict packet validation and backfill graph metadata (`checklist.md`, `graph-metadata.json`) [evidence: `validate.sh --strict` reports 0 errors and 0 warnings; `description.json` and `graph-metadata.json` are refreshed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence. [evidence: `checklist.md` CHK-020 maps every REQ to evidence]
- [x] A fresh operator can enable, verify, and roll back each runtime using only the docs. [evidence: the launcher walkthrough in `implementation-summary.md` Verification]
- [x] Every authored operator doc passes `validate_document.py --type reference`. [evidence: all three docs report `Total issues: 0`]
- [x] Strict packet validation passes. [evidence: `validate.sh --strict` reports 0 errors and 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
