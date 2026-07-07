---
title: "Tasks: Phase 4 — onboard implement"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code onboard implement tasks"
  - "sk-code relocation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/004-onboard-implement"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented completed onboard-implement relocation tasks"
    next_safe_action: "Proceed to 005 foldin-review to fold sk-code-review into code-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4 — onboard implement

<!-- SPECKIT_LEVEL: 1 -->

---

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Design the split map for flat sk-code content; evidence: relocation split assigns 128 files across `shared`, `code-implement`, `code-quality`, `code-verify`, and `code-debug`.
- [x] T002 Preserve hub-level routing test artifacts; evidence: `benchmark/` and `manual_testing_playbook/` intentionally stayed at the hub.
- [x] T003 Record the decision-record §5.3 refinement; evidence: webflow/opencode `quality_standards` files travel with language dirs into `code-implement`, while `code-quality` owns checklists and hygiene scripts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move 128 files with `git mv`; evidence: all 128 moves are tracked by git as renames.
- [x] T005 Remove flat top-level source directories; evidence: `references/`, `assets/`, and `scripts/` are now removed after relocation.
- [x] T006 Run the initial GPT-5.5 repointing pass; evidence: the pass self-reported zero unresolved links, but full link-resolution found 101 still broken.
- [x] T007 Run deterministic link repair; evidence: old-structure-aware repair fixed 111 links across 43 files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify markdown content links; evidence: full markdown link-resolution reports zero broken content links.
- [x] T009 Verify apparent non-link hit; evidence: one apparent hit was JavaScript inside a code fence, not a link.
- [x] T010 Spot-check non-markdown asset path references; evidence: spot-checked asset path references are valid.
- [x] T011 Revert out-of-scope runtime side effect; evidence: package runtime side-effect change was reverted.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Onboard-implement relocation phase accepted and complete; fold-in and contract authoring work deferred to phases 005 and 006
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Relocation Map**: See `relocation-map.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
