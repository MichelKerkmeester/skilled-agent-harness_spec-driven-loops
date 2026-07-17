---
title: "Tasks: command asset and reference closure (032 phase 008/013/009)"
description: "Bounded residual tasks for command asset ownership, kebab-case targets, and complete active path closure."
trigger_phrases:
  - "command asset closure tasks"
  - "residual command reference tasks"
  - "command template path tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored command asset tasks"
    next_safe_action: "Freeze sibling asset ownership"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Command asset and reference closure

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

A residual row is not owned by 009 until sibling ownership and the file's boundary classification are recorded.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] TSK-001 [P0] Import the frozen maps from phases 001–008 and record their source revisions.
- [ ] TSK-002 [P0] Capture a complete file and directory inventory under `.opencode/commands/**`.
- [ ] TSK-003 [P0] Subtract sibling-owned rows and create one residual row for every remaining asset, reference, template, README, script, manifest, fixture, and generated file.
- [ ] TSK-004 [P1] Record the owner and disposition for every residual row, including compliant and exempt rows.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] TSK-005 [P0] Reserve unique kebab-case targets for every residual maintained snake_case file and run collision checks.
- [ ] TSK-006 [P1] Rename only 009-owned maintained files; leave sibling-owned, generated, tool-manifest, Python, and fixture rows in their assigned boundary.
- [ ] TSK-007 [P0] Update every active link, path, template pointer, manifest input, and command README reference to each final target.
- [ ] TSK-008 [P1] Confirm no reference is changed merely because it contains an underscore in a semantic key, command ID, or negative-test value.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] TSK-009 [P0] Run path/link resolution and the relevant command-reference checks against the final tree.
- [ ] TSK-010 [P0] Search for every old residual path and classify remaining occurrences as historical, generated, fixture, tool-mandated, or unresolved.
- [ ] TSK-011 [P1] Verify ownership uniqueness and compare the final residual map with the full command inventory.
- [ ] TSK-012 [P1] Attach map hashes, collision results, link results, test output, and path-scoped diff for `010-commands-gate`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] The residual map is exhaustive and unique
- [ ] Every approved target and active pointer resolves
- [ ] All boundary rows are evidenced for rollup
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
- **Blocking verifier**: See `checklist.md`
- **Sibling maps**: See `../001-create-namespace/` through `../008-loose-command-ids/`
- **Commands rollup**: See `../010-commands-gate/checklist.md`
<!-- /ANCHOR:cross-refs -->
