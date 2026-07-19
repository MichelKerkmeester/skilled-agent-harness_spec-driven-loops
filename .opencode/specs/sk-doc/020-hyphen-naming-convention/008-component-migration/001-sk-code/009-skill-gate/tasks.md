---
title: "Tasks: sk-code subtree rollup gate (020 phase 008/009)"
description: "Execution tasks for reconciling sk-code phases 001-008, checking the full scope-aware naming surface, resolving active references, and recording the final pass/block result without migration work."
trigger_phrases:
  - "sk-code skill gate tasks"
  - "sk-code subtree rollup tasks"
  - "sk-code final naming census"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate tasks"
    next_safe_action: "Execute the final sk-code rollup"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-code subtree rollup gate

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

- [ ] T001 Load the phases 001-008 checklists, maps, handoffs, pinned BASE SHA, and candidate SHA.
- [ ] T002 [P] Enumerate `.opencode/skills/sk-code/`, changelog/version surfaces, and active reference roots.
- [ ] T003 Capture sibling verdicts, map hashes, baseline path inventory, and the exact census/reference commands.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the sibling matrix for phases 001-008, including ownership, blockers, map consistency, and phase 008 release evidence.
- [ ] T005 Run the scope-aware filesystem census and classify every retained non-kebab name under the 020 exemption boundary.
- [ ] T006 Resolve active path references, links, imports, registries, and path-valued metadata against the completed maps.
- [ ] T007 Record findings only; perform no rename, reference rewrite, changelog edit, metadata repair, or content migration.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm every sibling P0 checklist item passes and no handoff or map conflict remains.
- [ ] T009 Confirm the sk-code census has no unknown in-scope snake_case name and every retained non-kebab name has evidence.
- [ ] T010 Confirm active references resolve and phase 008's changelog/version verdict is coherent above BASE `4.1.0.0`.
- [ ] T011 Record commands, exit codes, counts, findings, and the final pass/block handoff to the central gate.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the rollup report
- [ ] The phase checklist is green or records the blocking owner and finding
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Predecessor**: See ../008-changelog-verify/spec.md
- **Sibling phase set**: See ../001-hub-root-and-shared/ through ../008-changelog-verify/
- **Governing policy**: See ../../../001-convention-policy-and-scope/spec.md
<!-- /ANCHOR:cross-refs -->

