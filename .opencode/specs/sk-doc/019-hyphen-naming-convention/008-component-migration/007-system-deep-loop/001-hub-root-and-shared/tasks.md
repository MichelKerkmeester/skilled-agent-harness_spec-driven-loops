---
title: "Tasks: system-deep-loop hub root and shared names (017 phase 007/001)"
description: "Execution tasks for classifying the system-deep-loop hub/shared boundary, conditionally applying any frozen-map candidate, and verifying routing and helper references."
trigger_phrases:
  - "system-deep-loop hub shared tasks"
  - "deep loop shared naming tasks"
  - "hub root reference verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared tasks"
    next_safe_action: "Execute the hub shared boundary check"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: System-deep-loop hub root and shared names

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

- [ ] T001 Load the pinned BASE manifest, frozen map, and system-deep-loop ownership boundary.
- [ ] T002 [P] Inventory root files and `shared/behavior-benchmark/`, `shared/progress/`, `shared/rollout/`, and `shared/synthesis/` paths.
- [ ] T003 Confirm exact hub/router/metadata names and capture active root/shared path consumers.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify every root/shared path as rename, exempt, frozen, generated, or tool-mandated with no unknown row.
- [ ] T005 Apply the semantic map only to a pinned-baseline in-scope candidate; record the current no-candidate result if none exists.
- [ ] T006 Update direct hub/shared Markdown and JSON path values for any moved candidate without changing route keys.
- [ ] T007 Record root/shared manifest, mode/link, and reference disposition evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare the final root/shared manifest with the frozen map and BASE inventory.
- [ ] T009 Resolve hub/router paths, shared Markdown links, and helper fixtures.
- [ ] T010 Run non-zero hub routing and shared helper checks against BASE outcomes.
- [ ] T011 Confirm no runtime, workflow, root-playbook, or root-benchmark file entered the child diff.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
<!-- /ANCHOR:cross-refs -->
