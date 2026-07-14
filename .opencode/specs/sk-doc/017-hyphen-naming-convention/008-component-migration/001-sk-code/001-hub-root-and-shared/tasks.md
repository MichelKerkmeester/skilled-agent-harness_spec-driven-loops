---
title: "Tasks: hub root and shared sk-code names (017 phase 008/001)"
description: "Execution tasks for the sk-code hub/shared filesystem rename and reference closure."
trigger_phrases:
  - "hub shared naming tasks"
  - "sk-code shared rename tasks"
  - "workflow path repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared phase tasks"
    next_safe_action: "Execute the shared rename and reference closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Hub root and shared sk-code names

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

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the frozen rename map, BASE manifest, and shared-closure handoff.
- [ ] T002 [P] Record the pre-change shared path list, symlink targets, modes, and active references.
- [ ] T003 Confirm exact hub/tool names and all exemption classes are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename shared reference files from snake_case to kebab-case in shared/references/.
- [ ] T005 Rename shared universal references and assets/patterns files in the same dependency-closed batch.
- [ ] T006 Update SKILL.md, README.md, shared/README.md, registry path values, and internal links.
- [ ] T007 Repair and verify the code-opencode and code-webflow workflow symlink closure.
- [ ] T008 Record the final source-to-target and reference disposition evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Compare the final filesystem manifest with every phase-map row.
- [ ] T010 Resolve all shared markdown links and workflow symlinks.
- [ ] T011 Run shared routing/workflow checks and compare outcomes with BASE.
- [ ] T012 Confirm no SKILL.md, metadata, Python/package, generated, tool-mandated, identifier/key, or frozen surface changed outside scope.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Governing policy**: See ../../../../001-convention-policy-and-scope/spec.md
- **Shared closure**: See ../../../../007-shared-and-cross-cutting-closures/spec.md
<!-- /ANCHOR:cross-refs -->
