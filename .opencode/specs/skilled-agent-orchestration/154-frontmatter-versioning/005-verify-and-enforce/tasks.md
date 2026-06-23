---
title: "Tasks: Phase 5: verify-and-enforce [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/005-verify-and-enforce"
    last_updated_at: "2026-06-23T07:33:12Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-verify-and-enforce"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: verify-and-enforce

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

- [x] T001 Confirm phases 3-4 populated every in-scope doc, making the required-flip safe — Evidence: the flip was safe because the corpus already carried versions.
- [x] T002 Scope enforcement to in-scope classes only — Evidence: commands, agents, and standalone install guides are excluded by design.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip the quick validator and the packaging validator to error on an absent version for skills — Evidence: a no-version skill now fails with "Missing required version"; commands keep it optional.
- [x] T004 Add the corpus-wide gate script wrapping the engine's gate mode — Evidence: the gate discovers every in-scope doc git-free and runs the full corpus in about 0.17s.
- [x] T005 Record the owning skill's changelog entry and mark the enforcement section of the standard active — Evidence: a changelog entry for the versioning standard was created and the standard's enforcement section flipped to active.
- [x] T006 Re-version the owning skill's docs to the new changelog anchor — Evidence: 71 docs re-versioned to the 1.8.0.0 anchor so the owning skill exemplifies the standard.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify the required-flip with a no-version fixture and a real skill — Evidence: the no-version skill FAILS as expected; a real skill PASSES.
- [x] T008 Confirm the three existing validator suites stay green — Evidence: all suites pass.
- [x] T009 Confirm the gate exits 0 on the full corpus, from the manifest and standalone — Evidence: PASS, exit 0, ok=2210, 12 skipped.
- [x] T010 Reconcile spec completion metadata across the phase docs — Evidence: the owning skill carries the 1.8.0.0 version derived by the standard, not lagging its own changelog.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (enforcement works; gate exit 0 over the full corpus)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
