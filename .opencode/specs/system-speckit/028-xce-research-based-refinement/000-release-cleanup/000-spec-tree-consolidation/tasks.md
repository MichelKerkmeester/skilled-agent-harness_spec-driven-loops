---
title: "Tasks: 027 Spec-Tree Six-Track Consolidation"
description: "Task breakdown for the 027 six-track consolidation."
trigger_phrases:
  - "027 consolidation tasks"
  - "027 six track tasks"
  - "spec tree regroup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/000-spec-tree-consolidation"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author task breakdown"
    next_safe_action: "Complete root-doc realignment tasks"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: 027 Spec-Tree Six-Track Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
- `[x]` complete, `[ ]` pending. Each task names its verification.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Scoped baseline commit of daemon metadata churn (`git commit --only`).
- [x] T002 Create `000-spec-tree-consolidation` leaf and wire into the parent.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Create five themed parents (lean trio); each validates.
- [x] T004 `git mv` all 30 phases + relocate untracked leftovers.
- [x] T005 Bare-prefix path rewrite + deterministic identity re-derivation.
- [ ] T006 Restructure `changelog/` to six tracks; rewrite `README.md`.
- [ ] T007 Realign root `spec.md`, `graph-metadata.json`, `description.json`, `before-vs-after.md`, `context-index.md`; regenerate `timeline.md`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T008 `validate.sh --recursive` (0 errors) and `--strict` on this folder.
- [ ] T009 Grep sweep: zero stale paths in canonical docs.
- [ ] T010 Scoped commit; verify `git show --stat HEAD`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All P0/P1 requirements met; validation green; reorg committed scoped to the 027 subtree.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md` (requirements), `plan.md` (phases), `implementation-summary.md` (evidence).
<!-- /ANCHOR:cross-refs -->
