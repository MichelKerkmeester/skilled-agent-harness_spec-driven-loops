---
title: "Tasks: integrate and close out (017 phase 015)"
description: "Tasks for phase 015 of the 017 kebab-case filesystem-naming program: integrate and close out."
trigger_phrases:
  - "integrate and close out tasks"
  - "hyphen naming phase 015 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/015-integrate-and-closeout"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/015-integrate-and-closeout"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Integrate the latest origin in a clean integration worktree (never the raced primary checkout); rerun the ENTIRE 014 gate on the exact final commit
- [ ] T003 Mark packet 027 superseded (append-only) and reconcile its docs
- [ ] T004 Update changelogs; finalize the convention doc as canonical
- [ ] T005 Parent rollup; reconcile completion metadata; merge
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The latest origin is integrated in a clean worktree and the full 014 gate reruns on the final commit — All conflicts resolved; the complete 014 gate passes on the exact final commit
- [ ] T007 Verify: Packet 027 is formally superseded append-only and reconciled — 027 status/docs reference this program as superseding; no broad rewrite of frozen 027 content
- [ ] T008 Verify: The convention doc is the single canonical source and changelogs are updated — A changelog entry exists; the convention doc is linked as canonical
- [ ] T009 Verify: The parent is rolled up and completion metadata reconciled — Parent status complete; child/checklist/completion metadata consistent
- [ ] T010 Verify: The program merges via a clean integration — The merge lands after the reran 014 gate, not through the raced checkout
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
