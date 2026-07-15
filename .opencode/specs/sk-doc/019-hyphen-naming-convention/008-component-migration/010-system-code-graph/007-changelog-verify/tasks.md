---
title: "Tasks: system-code-graph changelog verification (017 phase 007)"
description: "Tasks for phase 007 of the system-code-graph component naming migration: verify the append-only release entry, version bump, scope, exemptions, and mutation-free behavior without renaming files."
trigger_phrases:
  - "system-code-graph changelog tasks"
  - "system-code-graph version verification tasks"
  - "code graph release evidence tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/007-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification tasks"
    next_safe_action: "Build the changelog version matrix"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/changelog/"
      - ".opencode/specs/sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: system-code-graph Changelog Verification

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

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record candidate SHA, BASE SHA, final rename-map hash, and the current v1.3.0.0 release baseline
- [ ] T002 Load phases 001–006 checklists, maps, counts, and the append-only/frozen-history policy
- [ ] T003 Confirm the phase is verification-only and has no filesystem-rename scope
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Verify the approved next system-code-graph changelog entry, expected v1.4.0.0, and matching release metadata
- [ ] T005 Verify the entry names the package boundary, scripts, references, runtime, feature catalog, and manual playbook
- [ ] T006 Verify path/reference closure, zero-candidate outcomes where applicable, preserved exemptions, and frozen-history handling
- [ ] T007 Verify prior changelog entries and non-changelog migration surfaces were not changed by phase 007
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: the migration entry is latest and increments from the current release baseline — the version matrix matches the approved next version and release consumers
- [ ] T009 Verify: the complete phase 001–006 rename set is recorded — each phase surface and its evidence is named
- [ ] T010 Verify: exemptions and append-only history are preserved — Python/package, tool-mandated, generated/lockfile, test-magic, identifier/data, and frozen-history boundaries are explicit
- [ ] T011 Verify: phase 007 is mutation-free — the candidate diff contains no filesystem rename, non-changelog repair, or unrelated version change
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All P0 checklist checks have evidence
- [ ] No unexpected tracked mutation remains after verification
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
