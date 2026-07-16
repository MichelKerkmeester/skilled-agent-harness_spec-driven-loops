---
title: "Tasks: 014 Manual Testing Validation"
description: "Task ledger for scenario execution, plugin bridge recovery, strict-validation repair, and final verification."
trigger_phrases:
  - "013/009/014 tasks"
  - "advisor manual testing tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/014-manual-testing-playbook-validation"
    last_updated_at: "2026-05-14T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Full advisor Vitest and strict validation passed"
    next_safe_action: "Commit scoped close-out changes"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Tasks: 014 Manual Testing Validation

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `main` branch.
- [x] T002 Locate packet 014 and parent/lane validation targets.
- [x] T003 Read `/tmp/cli-codex-dispatches/014-manual-testing-out.log`.
- [x] T004 Read D2b `011-mcp-server-package-extraction/implementation-summary.md`.
- [x] T005 Read plugin bridge compat and smoke tests.
- [x] T006 Read sk-doc frontmatter and template rules.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Reproduce plugin bridge failures at 8 failing tests.
- [x] T011 Identify root cause: partial local system-spec-kit workspace install missing `@modelcontextprotocol/sdk`.
- [x] T012 Restore expected system-spec-kit workspace dependency install without staging `node_modules`.
- [x] T013 Add plugin bridge test cleanup for shared generation marker state.
- [x] T014 Re-run plugin bridge compat, smoke, and shim interaction tests.
- [x] T015 Rewrite packet 014 docs to required Level 2 headers and anchors.
- [x] T016 Normalize `_memory.continuity.last_updated_by` to actor slug `codex`.
- [x] T017 Convert checklist entries to `CHK-NNN [PN]` priority format.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run targeted plugin bridge Vitest.
- [x] T021 Run full advisor Vitest.
- [x] T022 Run packet 014 strict validation.
- [x] T023 Run parent 009 strict validation.
- [x] T024 Run lane 013 strict validation.
- [x] T025 Confirm scoped git diff.
- [x] T026 Commit on `main`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All verification tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Full advisor Vitest and strict validation passed.
- [x] Scoped commit created on `main`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
