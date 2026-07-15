---
title: "Tasks: system-code-graph scripts"
description: "Concrete tasks for the code-graph script filename inventory, conditional rename closure, exemption proof, and no-op evidence."
trigger_phrases:
  - "system-code-graph script tasks"
  - "code graph script rename tasks"
  - "script census tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts tasks"
    next_safe_action: "Begin pinned script inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/scripts"
      - ".opencode/skills/system-code-graph/mcp_server/scripts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current two script filenames are already kebab-case; a verified no-rename result is valid."
---

# Tasks: system-code-graph scripts

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

- [ ] T001 Inventory scripts/doctor.sh and mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs plus every script basename under the assigned surface
- [ ] T002 Separate current kebab-case names, conditional non-Python candidates, Python exemptions, and identifiers/data keys
- [ ] T003 Freeze path-reference, syntax, and BASE behavior evidence
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Preserve the two current kebab-case script filenames, or rename any additional pinned non-Python snake_case candidate
- [ ] T005 Update source, shell, registry, fixture, test, metadata, and documentation references for any conditional target
- [ ] T006 Preserve Python filenames/imports, code identifiers, tool IDs, data keys, and generated metadata
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify zero unclassified non-Python script filenames and zero stale live old paths
- [ ] T008 Run bash/node syntax checks and focused script consumers with BASE-equivalent behavior
- [ ] T009 Record a no-rename receipt or conditional map and hand off the result to the references phase
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->

