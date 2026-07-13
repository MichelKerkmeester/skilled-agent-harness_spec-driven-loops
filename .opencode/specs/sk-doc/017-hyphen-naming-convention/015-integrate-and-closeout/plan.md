---
title: "Implementation Plan: integrate and close out (017 phase 015)"
description: "Implementation Plan for phase 015 of the 017 kebab-case filesystem-naming program: integrate and close out."
trigger_phrases:
  - "integrate and close out implementation plan"
  - "hyphen naming phase 015 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/015-integrate-and-closeout"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/015-integrate-and-closeout"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Integrate and close out

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 015) |
| **Change class** | Reconciliation + integration |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
With the migration green, the program integrates the latest origin in a clean integration worktree, reruns the entire 014 gate on the exact final commit, then supersedes 027 (append-only), updates changelogs, finalizes the convention, rolls up the parent, reconciles metadata, and merges.. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The latest origin is integrated in a clean worktree and the full 014 gate reruns on the final commit
- [ ] Packet 027 is formally superseded append-only and reconciled
- [ ] The convention doc is the single canonical source and changelogs are updated
- [ ] The parent is rolled up and completion metadata reconciled
- [ ] The program merges via a clean integration

### Definition of Done
- [ ] 027 superseded; the convention is canonical
- [ ] Program integrated cleanly and closed
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Integrate the latest origin in a clean integration worktree (never the raced primary checkout); rerun the ENTIRE 014 gate on the exact final commit.
- Mark packet 027 superseded (append-only) and reconcile its docs.
- Update changelogs; finalize the convention doc as canonical.
- Parent rollup; reconcile completion metadata; merge.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Integrate the latest origin in a clean integration worktree (never the raced primary checkout); rerun the ENTIRE 014 gate on the exact final commit.
- Mark packet 027 superseded (append-only) and reconcile its docs.
- Update changelogs; finalize the convention doc as canonical.
- Parent rollup; reconcile completion metadata; merge.

### Phase 3: Verification
- All conflicts resolved; the complete 014 gate passes on the exact final commit
- 027 status/docs reference this program as superseding; no broad rewrite of frozen 027 content
- A changelog entry exists; the convention doc is linked as canonical
- Parent status complete; child/checklist/completion metadata consistent
- The merge lands after the reran 014 gate, not through the raced checkout
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | All conflicts resolved; the complete 014 gate passes on the exact final commit |
| REQ-002 | 027 status/docs reference this program as superseding; no broad rewrite of frozen 027 content |
| REQ-003 | A changelog entry exists; the convention doc is linked as canonical |
| REQ-004 | Parent status complete; child/checklist/completion metadata consistent |
| REQ-005 | The merge lands after the reran 014 gate, not through the raced checkout |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 017 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
