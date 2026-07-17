---
title: "Tasks: create-diff naming audit"
description: "Concrete census and verification tasks for the create-diff naming phase."
trigger_phrases:
  - "create-diff naming audit tasks"
  - "create-diff zero-row tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-diff audit tasks"
    next_safe_action: "Execute the create-diff census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-diff/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-diff naming audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 List every create-diff file and directory at BASE.
- [ ] T002 Classify filesystem names, mandated names, and content tokens.
- [ ] T003 Record path reference search terms and expected zero-row result.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Make no migration rename; preserve the component.
- [ ] T005 Record any discovered candidate as a classification issue rather than editing spec scope silently.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: the complete candidate count is zero.
- [ ] T007 Verify: create-diff path references resolve and no tracked file changed.
- [ ] T008 Verify: content underscores were not treated as filesystem debt.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` have evidence in the candidate report.
- [ ] The phase checklist is satisfied by the central verifier.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
