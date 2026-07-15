---
title: "Tasks: hoisted shared script closures (017 phase 007 child 003)"
description: "Tasks for the multi-skill shared-script closure: build the consumer graph, classify exemptions and ownership, update every consumer, preserve modes, and publish downstream dependencies."
trigger_phrases:
  - "shared script closure tasks"
  - "hoisted script naming tasks"
  - "phase 007 child 003 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored shared-script closure tasks"
    next_safe_action: "Execute T001 after the shared roots and map receipts are pinned"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/"
      - ".opencode/skills/sk-doc/scripts/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This child does not rename Python `.py` scripts or one-skill scripts delegated to phase 008"
---
# Tasks: Hoisted Shared Script Closures

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

- [ ] T001 Pin BASE, phase 005 tooling, and phase 006 map hash
- [ ] T002 Enumerate shared script roots and non-exempt script filename candidates
- [ ] T003 [P] Resolve script consumer ownership across all skill subtrees and record one-skill delegations
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the shared-script consumer graph for imports, `require`, `source`, registries, fixtures, and test commands
- [ ] T005 Assign semantic targets and record Python, package, tool-mandated, generated, lockfile, and frozen exemptions
- [ ] T006 Update every selected script and its consumers in one dependency-closed batch
- [ ] T007 Hand symlink façades to child 002 and one-skill scripts to their phase 008 owners
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every selected script has consumers in at least two skill subtrees and one closure record
- [ ] T009 Verify: all non-exempt targets are kebab-case and collision-free
- [ ] T010 Verify: imports, `require`, `source`, registries, fixtures, and test commands resolve to the target
- [ ] T011 Verify: Python/package exemptions, executable bits, and symlink dispositions remain intact
- [ ] T012 Verify: syntax, discovery parity, reference evidence, and downstream closure dependencies are recorded
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in `spec.md` met with evidence
- [ ] The SOL checklist is green for this child
- [ ] No component-owned script was moved without an explicit phase 008 handoff
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Symlink contract**: See `../002-cross-skill-symlink-closure/decision-record.md`
<!-- /ANCHOR:cross-refs -->
