# Tasks: README Style Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Wave 1 — mcp_server/lib/* (25 files)

- [x] T001 [P] Process mcp_server/lib/architecture/ (5 files)
- [x] T002 [P] Process mcp_server/lib/cache/ + cognitive/ + config/ (5 files)
- [x] T003 [P] Process mcp_server/lib/embeddings/ + errors/ + interfaces/ (5 files)
- [x] T004 [P] Process mcp_server/lib/learning/ + parsing/ + providers/ (5 files)
- [x] T005 [P] Process mcp_server/lib/response/ + scoring/ + search/ + session/ + storage/ (5 files)

---

## Phase 2: Wave 2 — mcp_server/ + scripts/ + shared/ (24 files)

- [x] T006 [P] Process mcp_server/ remaining + mcp_server/utils/ + mcp_server/tools/ (5 files)
- [x] T007 [P] Process scripts/core/ + scripts/extractors/ + scripts/lib/ + scripts/loaders/ (5 files)
- [x] T008 [P] Process scripts/memory/ + scripts/renderers/ + scripts/rules/ (5 files)
- [x] T009 [P] Process scripts/setup/ + scripts/spec-folder/ + scripts/spec/ + scripts/templates/ (5 files)
- [x] T010 [P] Process scripts/test-fixtures/ + scripts/tests/ + scripts/types/ + scripts/utils/ + shared/ (4 files)

---

## Phase 3: Wave 3 — templates/ + skill roots + top-level (26 files)

- [x] T011 [P] Process templates/addendum/ + templates/core/ + templates/examples/ (5 files)
- [x] T012 [P] Process templates/level_1/ + templates/level_2/ + templates/level_3/ + templates/level_3+/ (5 files)
- [x] T013 [P] Process templates/memory/ + skill roots (system-spec-kit, workflows-*, mcp-*) (6 files)
- [x] T014 [P] Process top-level (root README.md, CHANGELOG.md, etc.) (5 files)
- [x] T015 [P] Process remaining skill directories and top-level files (5 files)

---

## Phase 4: Verification & Remediation

- [x] T016 Select 10 random README.md files for spot-check
- [x] T017 Verify 7 style rules per file (70 total checks)
- [x] T018 Document compliance rate (63/70 = 90%)
- [x] T019 Fix 7 discovered issues immediately
- [x] T020 Re-verify fixed files

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed (≥90% compliance achieved)
- [x] Spec folder documentation complete

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
