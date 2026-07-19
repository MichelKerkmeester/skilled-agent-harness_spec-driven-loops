---
title: "Tasks: Benchmark (020 phase 010)"
description: "Task breakdown for Benchmark in the 020 sk-design naming subtree."
trigger_phrases:
  - "benchmark tasks"
  - "sk-design benchmark execution"
  - "020 benchmark checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/010-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/010-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark tasks"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/benchmark/README.md"
      - ".opencode/skills/sk-design/benchmark/baseline/"
      - ".opencode/skills/sk-design/benchmark/after_009/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Benchmark (020 phase 010)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|-------|-------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence source)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Confirm the pinned BASE and clean isolated worktree for benchmark.
- [ ] T002 [P] Read the canonical convention/exemption boundary and freeze the phase-owned inventory.
- [ ] T003 [P] Record the source→target map and a consumer ledger before changing any path.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Freeze the phase-local source→target map and classify Python/tool-mandated/semantic-name exemptions.
- [ ] T005 Execute the dependency-closed filesystem renames for this phase only.
- [ ] T006 Update all path-valued references, registry/path entries, shell sources, or indexes owned by this phase.
- [ ] T007 Compare semantic identifiers, keys, fixture/scenario IDs, and preserved executable/Python paths.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the phase checklist with exact paths, counts, and reference-resolution evidence.
- [ ] T009 Prove the resulting phase surface is kebab-clean outside exemptions.
- [ ] T010 Prove no unexpected tracked file or semantic content changed.
- [ ] T011 Publish the sibling handoff with map and evidence fingerprints.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete with evidence.
- [ ] All requirements in spec.md are satisfied or explicitly blocked.
- [ ] The phase checklist has no unresolved P0 item and no unapproved P1 deferral.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
