---
title: "Tasks: integrate and close out (032 phase 011)"
description: "Tasks for phase 011 of the 032 kebab-case filesystem-naming program: integrate the verified migration branch and close out the packet with a consistent parent rollup."
trigger_phrases:
  - "integrate and close out tasks"
  - "hyphen naming phase 011 tasks"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Decomposed final integration into rebase, gate rerun, linear update, and rollup tasks"
    next_safe_action: "Capture phase 010 and latest-base identities in a clean integration worktree"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Integrate and close out

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

- [ ] T001 Record the green phase 010 candidate SHA, its BASE SHA, map hash, and evidence location.
- [ ] T002 Fetch the latest integration base and record `B_latest`, the migration head, and the target ref.
- [ ] T003 Create a clean integration worktree and preserve rollback refs before rebasing.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rebase the migration branch onto `B_latest` and resolve conflicts against the approved policy and frozen map.
- [ ] T005 Reconcile path references, exemptions, phase documents, and the migration map after conflict resolution.
- [ ] T006 Fast-forward the integration target only after the post-rebase whole-repo gate passes.
- [ ] T007 Update final child-phase evidence and the 032 parent rollup from the integrated commit.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: the migration branch is rebased onto the latest base with no unresolved conflicts — record pre/post SHAs and the resolution review.
- [ ] T009 Verify: the exact phase 010 gate passes on the post-rebase candidate — all P0 domains and evidence rows are green.
- [ ] T010 Verify: integration is fast-forward-only — no merge commit, forced update, or target movement before the gate.
- [ ] T011 Verify: the final integrated commit equals the gate-passed candidate and the worktree is clean.
- [ ] T012 Verify: phase and parent metadata agree — no stale status, completion, handoff, or next-action field remains.
- [ ] T013 Record the final closeout report and rollback refs for the orchestrator.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase 010 was rerun after rebase and before fast-forward
- [ ] Parent rollup and final integrated commit are recorded consistently
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification contract**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
