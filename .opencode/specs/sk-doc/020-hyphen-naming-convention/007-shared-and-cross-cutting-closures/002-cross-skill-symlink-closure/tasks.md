---
title: "Tasks: cross-skill symlink closure (032 phase 007 child 002)"
description: "Tasks for the atomic symlink closure: manifest link edges, group pointers by target, preflight modes and relative paths, execute closed batches, and publish downstream dependencies."
trigger_phrases:
  - "cross-skill symlink closure tasks"
  - "atomic symlink tasks"
  - "phase 007 child 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored atomic symlink closure tasks"
    next_safe_action: "Execute T001 after map and baseline receipts are pinned"
    blockers: []
    key_files:
      - ".opencode/install_guides/install_scripts/"
      - ".opencode/skills/sk-doc/scripts/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "A target and its pointers are one closure; no pointer-only or target-only batch is valid"
---
# Tasks: Cross-Skill Symlink Closure

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

- [ ] T001 Pin BASE, the phase 006 map hash, and the phase 005 reference-checker receipt
- [ ] T002 Enumerate every tracked symlink link-node and resolve its target, stored text, mode, and executable target bits
- [ ] T003 [P] Assign target ownership and classify frozen, generated, tool-mandated, Python, or rename dispositions
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the reverse target-to-link-node index and one closure record per affected target
- [ ] T005 Precompute target moves and relative link text from each link-node directory
- [ ] T006 Apply each target plus every link-node and path reference as one atomic dependency-closed batch
- [ ] T007 Record unresolved or ambiguous edges as blockers for the target-owning phase instead of guessing
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every symlink edge has a target owner, map disposition, and mode evidence
- [ ] T009 Verify: a failed collision or unresolved pointer aborts before mutation in a dry-run fixture
- [ ] T010 Verify: every changed link resolves from its own directory and no target is dangling
- [ ] T011 Verify: link mode, target type, and executable bits match the preflight manifest
- [ ] T012 Verify: the reference checker is clean and the closure handoff exposes phase 008 dependencies
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in `spec.md` met with evidence
- [ ] The SOL checklist is green for this child
- [ ] The atomicity decision is reflected in the candidate closure report
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
- **Verifier contract**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
