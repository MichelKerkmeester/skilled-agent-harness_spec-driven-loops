---
title: "Tasks: Migration Tooling & Dry-Run [133/002/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "133 phase 002 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 002 tasks during 133 scaffold"
    next_safe_action: "Execute T001 after approval + D1=script"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Migration Tooling & Dry-Run

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm phase 001 convention shipped + decisions D1 (script) and D4 (collision policy)
- [x] T002 Slice per-tree rename inventories from the discovery grep as tool input fixtures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement rename map + `^[0-9]+-` basename strip (`scratch/denumber-snippets.cjs`)
- [x] T004 Implement collision gate (hard-abort, no writes on collision)
- [x] T005 Implement 4-class reference rewrite (self / neighbor / root / external), `.md`-anchored
- [x] T006 Implement `--dry-run` (default) emitting rename/reference/collision manifests
- [x] T007 Implement `--apply` using `git mv` + scoped staging (never `git add -A`)
- [x] T008 [P] Build edge-case fixtures (`./`/`../`, `#anchor`, code-fence link, substring slug, Feature ID)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Self-test tool against fixtures
- [x] T010 DeepSeek adversarial review of algorithm vs fixtures; patch gaps
- [x] T011 Dry-run on `system-code-graph` (small real tree); review manifest
- [x] T012 Dry-run on `system-spec-kit/.../16--tooling-and-scripts`; confirm collision hard-abort
- [x] T013 Inspect the 4 collision files; decide per D4 (merge vs distinct slugs); record decision note
- [x] T014 Verify idempotency (re-running `--apply` on a migrated fixture is a no-op)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Reviewed clean dry-run manifest + collision resolution recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
