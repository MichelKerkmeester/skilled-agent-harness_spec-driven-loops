---
title: "Tasks: root and OpenCode infrastructure strays (032 phase 007 child 001)"
description: "Tasks for the root and OpenCode infrastructure dependency closure, including candidate classification, semantic targets, same-surface references, and downstream handoff."
trigger_phrases:
  - "root infrastructure closure tasks"
  - "OpenCode infrastructure naming tasks"
  - "phase 007 child 001 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored root-infrastructure closure tasks"
    next_safe_action: "Execute T001 after BASE and map evidence are pinned"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - ".opencode/install_guides/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All tasks describe future execution; this authoring pass performs no rename"
---
# Tasks: Root and OpenCode Infrastructure Strays

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE, the phase 006 map hash, and the phase 005 tooling receipt for the execution worktree
- [ ] T002 Enumerate root-level and `.opencode` infrastructure candidates, including command assets and install-guide scripts
- [ ] T003 [P] Record exact-name, Python, generated, lockfile, and frozen exclusions before target selection
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the root/infrastructure candidate ledger with one classification per observed path
- [ ] T005 Assign semantic kebab-case targets and run exact/casefold/NFC collision checks
- [ ] T006 Rewrite same-surface command, installer, shell, registry, and path-valued documentation references
- [ ] T007 Record every cross-skill symlink/shared-script edge for child 002 or 003 instead of editing it partially
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every scoped candidate is classified once and no unknown ledger entry remains
- [ ] T009 Verify: in-scope targets are kebab-case and collision-free without mechanical leading-hyphen results
- [ ] T010 Verify: all same-surface references resolve and no source path remains in the closure
- [ ] T011 Verify: tool-mandated, Python, generated, lockfile, and frozen names are unchanged
- [ ] T012 Verify: the boundary ledger and closure manifest are complete for phase 008 dependency declarations
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in `spec.md` met with evidence
- [ ] The SOL checklist is green for this child
- [ ] No migration/rename is claimed from the documentation-authoring pass alone
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent closure map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
