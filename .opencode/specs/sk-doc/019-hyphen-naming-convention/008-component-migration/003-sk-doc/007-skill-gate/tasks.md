---
title: "Tasks: sk-doc subtree rollup gate"
description: "Concrete aggregation and whole-surface verification tasks for the sk-doc rollup gate."
trigger_phrases:
  - "sk-doc skill gate tasks"
  - "sk-doc naming rollup tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-doc rollup gate tasks"
    next_safe_action: "Collect direct and nested phase receipts"
    blockers: []
    key_files: [".opencode/skills/sk-doc/", "../003-create-packets/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc subtree rollup gate

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

- [ ] T001 Enumerate direct leaves 001, 002, 004, 005, 006 and 007 plus nested leaves 001-011.
- [ ] T002 Collect checklist/report hashes and zero-row evidence.
- [ ] T003 Pin the 001 exemption set, changelog evidence, and whole-surface census command.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Perform no migration or repair in the rollup gate.
- [ ] T005 Build the aggregate evidence matrix and exemption accounting.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: every direct/nested leaf checklist passes and zero-row phases are accounted for.
- [ ] T007 Verify: whole `.opencode/skills/sk-doc` census has no in-scope snake_case residue or unknown class.
- [ ] T008 Verify: changelog/version evidence and documentation-only gate diff are clean.
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
