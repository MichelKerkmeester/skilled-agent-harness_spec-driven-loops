---
title: "Tasks: sk-doc changelog and version verification"
description: "Concrete verification tasks for the sk-doc migration changelog and version-bump phase."
trigger_phrases:
  - "sk-doc changelog verification tasks"
  - "sk-doc version bump tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verify tasks"
    next_safe_action: "Collect sibling release evidence"
    blockers: []
    key_files: [".opencode/skills/sk-doc/changelog/", ".opencode/skills/sk-doc/SKILL.md"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc changelog and version verification

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

- [ ] T001 Collect direct/nested sibling checklists, manifests, and reports.
- [ ] T002 Record latest baseline changelog `v1.8.1.0` and post-migration `SKILL.md` version.
- [ ] T003 Resolve the candidate changelog entry under create-changelog rules.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Perform no rename or release-file mutation in this verification phase.
- [ ] T005 Map the candidate entry's scope/path claims to sibling evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: one new greater four-part changelog entry exists.
- [ ] T007 Verify: entry names the completed sk-doc rename set and cites accurate paths.
- [ ] T008 Verify: entry version matches `SKILL.md` and historical entries are unchanged.
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
