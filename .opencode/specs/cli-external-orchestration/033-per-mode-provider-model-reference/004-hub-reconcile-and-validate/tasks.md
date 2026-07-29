---
title: "Tasks: Phase 4 — hub reconcile + adjacent fixes + validate"
description: "Task list for hub reconcile, the three approved adjacent fixes, and the closing conformance battery (Complete)."
trigger_phrases:
  - "hub reconcile provider pointers tasks"
  - "version skew reconcile task list"
  - "stale scripts reference removal tasks"
  - "cli conformance gates tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference/004-hub-reconcile-and-validate"
    last_updated_at: "2026-07-29T09:18:46Z"
    last_updated_by: "implementer"
    recent_action: "Reconciled hub docs, fixed adjacent defects, ran conformance battery"
    next_safe_action: "Optional /memory:save to stamp continuity fingerprints and close the packet"
    blockers: []
    key_files:
      - "SKILL.md"
      - "README.md"
      - "hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-033-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4 — hub reconcile + adjacent fixes + validate

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

- [x] T001 Confirm phases 1-3 complete — [evidence: phases 001-003 `implementation-summary.md` present + marked Complete]
- [x] T002 Grep hub root files for the lagging version 1.1.0.0 and the phantom `cli-opencode/scripts/` reference
- [x] T003 [P] Confirm `cli-opencode/scripts/` is absent on disk
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a catalog pointer bullet to parent `SKILL.md` §5 and `README.md`
- [x] T005 Align `hub-router.json` + `README.md` frontmatter version 1.1.0.0 → 1.2.0.0 (version field only, no model-token change)
- [x] T006 Remove the phantom `cli-opencode/scripts/` reference from the SKILL.md layout tree and README §2 prose
- [x] T007 Add `changelog/` entries for the changed docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `ci-skill-root-metadata.cjs` — PASS (11/11, hub clean class-H); `parent-skill-check.cjs` — PASS (0 warnings)
- [x] T009 `generate-leaf-manifest.cjs --check` — fresh; `advisor_validate` — clean; routing smoke — 6/6 at 0.95
- [x] T010 `validate.sh` per child + recursive `--strict` — Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
