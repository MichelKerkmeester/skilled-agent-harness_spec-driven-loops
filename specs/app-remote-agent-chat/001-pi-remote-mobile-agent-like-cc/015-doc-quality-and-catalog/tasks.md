---
title: "Tasks: Doc Quality and Feature Catalog"
description: "Dependency-ordered task ledger for planning the sk-doc DQI quality gate across the Pi Remote app docs and the feature catalog."
trigger_phrases:
  - "pi remote doc quality and feature catalog"
  - "pi mobile phase 15"
  - "doc quality and feature catalog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/015-doc-quality-and-catalog"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 015 doc-quality-and-catalog spec set as Draft"
    next_safe_action: "Run validate.sh on all six phase folders; reconcile packet map"
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

# Tasks: Doc Quality and Feature Catalog

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

The deliverables are the DQI gate, baseline report, and feature catalog under `Apps/Pi Mobile/docs/`. Unchecked rows remain planning-state work.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, owned paths, rollback, and the authoritative gate.
- [ ] T002 Confirm the finished doc set from phases 010-014 and the catalog surface inventory.
- [ ] T003 Review the `sk-create-feature-catalog` templates and freeze the DQI bar.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run `extract_structure.py` across every app doc and capture the DQI baseline.
- [ ] T005 Author `docs/quality/dqi-report.md` with per-file scores and bands.
- [ ] T006 Author `docs/quality/dqi-gate.md` with the procedure, scoring command, bar, and findings rules.
- [ ] T007 [P] Author the catalog root `docs/feature-catalog/feature-catalog.md`.
- [ ] T008 [P] Author the rpc-and-protocol, relay-and-state, and auth-and-boundary per-feature files.
- [ ] T009 [P] Author the approval-and-mutation, push-and-notifications, and web-pwa per-feature files.
- [ ] T010 [P] Author the deploy-and-platform and release-and-verification per-feature files.
- [ ] T011 Check root-to-feature bijection and local link resolution.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Re-score the docs after catalog authoring and record the quality delta.
- [ ] T013 Run the authoritative phase gate and the safe rollback or recovery exercise.
- [ ] T014 Reconcile checklist, current state, parent map, and packet status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] The DQI gate and the catalog describe the same current state as the app.
- [ ] Parent and child statuses plus the packet map describe the same final state.
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
