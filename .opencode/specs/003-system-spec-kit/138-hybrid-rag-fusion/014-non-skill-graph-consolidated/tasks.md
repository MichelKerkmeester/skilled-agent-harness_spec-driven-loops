# Tasks: 014 - Non-Skill-Graph Consolidation

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: Archive Source Folders

- [x] T001 Create archive root `z_archive/non-skill-graph-legacy/`
- [x] T002 Move `005-install-guide-alignment/` to archive
- [x] T003 Move `008-codex-audit/` to archive
- [x] T004 Move `010-index-large-files/` to archive
- [x] T005 Move `011-default-on-hardening-audit/` to archive
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Canonical 014 Documentation

- [x] T010 Create `spec.md`
- [x] T011 Create `plan.md`
- [x] T012 Create `tasks.md`
- [x] T013 Create `checklist.md`
- [x] T014 Create `decision-record.md`
- [x] T015 Create `implementation-summary.md`
- [x] T016 Create `supplemental-index.md`
- [x] T017 Ensure `memory/.gitkeep` and `scratch/.gitkeep` exist
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run validator for `014-non-skill-graph-consolidated` [E: `validate.sh` -> 0 errors, warning-only result]
- [x] T021 Run validator for root `138-hybrid-rag-fusion` [E: `validate.sh` recursive -> 0 errors, warning-only result]
- [x] T022 Verify no active `005/008/010/011` folders remain under root [E: top-level `find` shows only `001`, `004`, `013`, `014` active children]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Validation passed (warning-only)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
