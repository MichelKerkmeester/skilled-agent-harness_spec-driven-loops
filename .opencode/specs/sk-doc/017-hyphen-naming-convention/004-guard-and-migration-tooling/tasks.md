---
title: "Tasks: guard and migration tooling (019 phase 004)"
description: "Tasks for phase 004 of the 019 kebab-case filesystem-naming program: guard and migration tooling."
trigger_phrases:
  - "guard and migration tooling tasks"
  - "hyphen naming phase 004 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/004-guard-and-migration-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/004-guard-and-migration-tooling"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Guard and migration tooling

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm predecessor phases landed and the execution worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 A no-new-snake_case guard that fails on a new in-scope snake_case FS name and respects every exemption
- [ ] T003 A deterministic rename engine: path-segment `_`->`-`, collision hard-abort, reference + import sweep, exemption deny-list, dry-run default (no mutation without an explicit apply)
- [ ] T004 A safety/collision + exemption report emitted before any write
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: The guard rejects a fresh in-scope snake_case name and accepts a hyphenated one — A synthetic snake_case file fails the guard; a hyphenated one passes
- [ ] T006 Verify: The rename engine is dry-run by default and hard-aborts on any collision — A synthetic colliding pair aborts before any write
- [ ] T007 Verify: The engine rewrites references and imports in the same pass as the rename — A renamed file has all its importers updated in the dry-run diff
- [ ] T008 Verify: Every exemption class is enforced by the engine deny-list — Vendored/`.py`/generated/tool-mandated names are never in the rename map
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
