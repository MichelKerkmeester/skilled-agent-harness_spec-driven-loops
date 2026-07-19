---
title: "Tasks: scripts command namespace naming (020 phase 008/013/006)"
description: "Bounded audit tasks for proving the scripts namespace needs no physical rename and retaining the checker fixture contract."
trigger_phrases:
  - "scripts namespace naming tasks"
  - "scripts command audit tasks"
  - "command checker self-test tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts namespace tasks"
    next_safe_action: "Collect scripts audit evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Scripts command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

This phase records a no-rename result; verification tasks must not become implementation work without an amended scope decision.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] TSK-001 [P0] Capture BASE and candidate listings for `.opencode/commands/scripts/`, including `fixtures/`.
- [ ] TSK-002 [P0] Add one frozen-map row for `README.md`, `fixtures/README.md`, `fixtures/broken-command-refs.yaml`, `validate-command-references.cjs`, and both directory basenames.
- [ ] TSK-003 [P1] Classify every underscore-bearing string in the fixture as intentional negative-test data or a live filesystem name.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] TSK-004 [P0] Run the filesystem-name scan and prove that no in-scope snake_case basename exists in the scripts subtree.
- [ ] TSK-005 [P0] Run the checker self-test and capture the expected broken-agent, broken-skill, and phantom-runtime-dir outcomes.
- [ ] TSK-006 [P1] Run the default checker scan and record that the live command tree resolves cleanly.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] TSK-007 [P1] Confirm the fixture content and executable script bytes are unchanged from BASE.
- [ ] TSK-008 [P1] Attach inventory, command output, exit statuses, and path-scoped diff evidence to the child report.
- [ ] TSK-009 [P2] Hand the no-rename disposition and any unresolved classification to `010-commands-gate`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The child is complete when TSK-001 through TSK-008 have receipts, the self-test behavior is unchanged, and no live filesystem basename remains unclassified. TSK-009 is required for rollup handoff.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Blocking verifier**: See `checklist.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/decision-record.md`
- **Commands rollup**: See `../010-commands-gate/checklist.md`
<!-- /ANCHOR:cross-refs -->
