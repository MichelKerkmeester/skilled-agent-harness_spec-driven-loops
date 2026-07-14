---
title: "Tasks: semantic rename engine (017 phase 005.001)"
description: "Tasks for the semantic rename engine: explicit map validation, dependency-closure batching, exemption-aware preflight, dry-run/apply state, idempotency, mode preservation, and rollback."
trigger_phrases:
  - "semantic rename engine tasks"
  - "dependency-closure rename tasks"
  - "git-mv rollback tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the semantic rename engine task contract"
    next_safe_action: "Implement the setup tasks after phase 004 is available"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Task evidence must come from disposable repositories or read-only plan output, never from a real migration run."
---
# Tasks: Semantic Rename Engine

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

- [ ] T001 Record the semantic map fields, path normalization rules, and operation states shared with phase 006.
- [ ] T002 Define the exemption classifier for Python files and package directories, vendored/third-party trees, generated or lockfile output, tool-mandated names, test-runner magic, and frozen surfaces.
- [ ] T003 [P] Seed disposable Git repositories containing regular files, symlinks, executable files, leading underscores, double underscores, and mixed-extension references.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Validate explicit source-to-target entries and reject duplicate, unsafe, exact, case-folded, or NFC-colliding targets before execution.
- [ ] T005 Build dependency-closure batches from the reference graph; keep mixed extensions in the same closure.
- [ ] T006 Implement exemption-aware skip dispositions with a reason for every skipped candidate.
- [ ] T007 Implement deterministic dry-run output and require an explicit apply action before calling `git mv`.
- [ ] T008 Preserve symlink mode `120000` and executable bits, and expose a before/after manifest comparison.
- [ ] T009 Implement idempotent reruns and an inverse operation journal that supports batch rollback after an apply failure.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify: Dry-run produces zero writes, index changes, mode changes, or partial renames in a disposable Git repository.
- [ ] T011 Verify: A closure containing mixed extensions is planned as one dependency batch, not split by extension.
- [ ] T012 Verify: Exact, case-folded, and NFC collisions abort before any write; leading and double underscores use explicit safe targets.
- [ ] T013 Verify: Every policy exemption is skipped with a reason and no Python package directory or tool-mandated name is renamed.
- [ ] T014 Verify: Apply preserves symlink mode and executable bits, and a second run reports no pending operations.
- [ ] T015 Verify: An injected apply failure is reported and the inverse journal restores the completed portion of the batch.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All engine tasks complete with evidence in the phase checklist.
- [ ] All requirements in `spec.md` meet their acceptance criteria.
- [ ] The engine's map and operation outputs are consumable by phase 002.
- [ ] No real repository migration was executed as part of this phase's implementation evidence.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Engine decisions**: See `decision-record.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
