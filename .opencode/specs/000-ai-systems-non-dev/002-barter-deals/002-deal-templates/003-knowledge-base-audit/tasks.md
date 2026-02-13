# Tasks: Knowledge Base Cross-File Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.0 -->
<!-- RETROACTIVE: This tasks file was created after implementation to document work performed 2025-02-09 through 2025-02-10 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[P]` | Parallelizable |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

---

## Phase 1: Audit & Discovery

- [x] T001 [P0] Read all 11 knowledge base files in full → CHK-001
- [x] T002 [P0] Build cross-reference map of shared concepts (scoring, perspectives, word counts, rounds, keywords) → CHK-001
- [x] T003 [P0] Identify and classify all issues by severity (Critical/Moderate/Minor) → CHK-001
- [x] T004 [P0] Present all 18 issues to user with exact line references → CHK-002

**Phase Gate**: All 18 issues identified, classified, and presented ✅

---

## Phase 2: User Decisions & Approval

- [x] T005 [P0] Obtain canonical source decision: DEPTH Framework for DEAL scoring → CHK-002
- [x] T006 [P0] Obtain canonical source decision: Standards for word counts → CHK-002
- [x] T007 [P0] Obtain specific fix decision: Service Ref Example 2 math → CHK-002
- [x] T008 [P0] Get blanket approval for all 18 fixes → CHK-002

**Phase Gate**: All decisions made, blanket approval received ✅

---

## Phase 3A: Fix Application — Original Audit (18 fixes)

### Critical Fixes (C1-C5)
- [x] T009 [P0] C1: Fix DEAL scoring label misalignment in System Prompt (System Prompt) → CHK-010
- [x] T010 [P0] C2: Fix wrong sub-dimension name "Engagement" → "Expectations" (HVR Extensions) → CHK-010
- [x] T011 [P0] C3: Align DEAL scoring thresholds to DEPTH Framework canonical source (System Prompt) → CHK-010
- [x] T012 [P0] C4: Remove "standard" from simple-deal complexity keywords (System Prompt) → CHK-010
- [x] T013 [P0] C5: Fix math error in Service Reference Example 2 (Deal Type Service) → CHK-010

### Moderate Fixes (M1-M7)
- [x] T014 [P1] M1: Align DEPTH rounds for $improve in Interactive Mode YAML and Quick Reference → CHK-011
- [x] T015 [P1] M2a: Align word count references in Service Reference to Standards tiers → CHK-011
- [x] T016 [P1] M2b: Align word count references in Product Reference to Standards tiers → CHK-011
- [x] T017 [P1] M2c: Align word count references in Brand Extensions to Standards tiers → CHK-011
- [x] T018 [P1] M3: Add missing Content perspective row to Cognitive Rigor table (System Prompt) → CHK-011
- [x] T019 [P1] M4: Fix DEPTH Configuration cross-reference Section 7 → Section 6 (System Prompt) → CHK-011
- [x] T020 [P1] M5: Fix DEPTH loading trigger description (System Prompt) → CHK-011
- [x] T021 [P1] M7: Fix broken pipe characters in $batch table rows (System Prompt + AGENTS.md) → CHK-011

### Minor Fixes (L1-L6)
- [x] T022 [P2] L1: Fix filename version suffixes in Interactive Mode → CHK-012
- [x] T023 [P2] L2: Fix 3-item content type enumeration in Product Reference → CHK-012
- [x] T024 [P2] L3: Fix 3-item niche enumeration in Service Reference → CHK-012
- [x] T025 [P2] L4: Fix 3-item enumeration in Industry Extensions worked example → CHK-012
- [x] T026 [P2] L5: Add ALWAYS-loaded docs note to AGENTS.md → CHK-012
- [x] T027 [P2] L6: Add template version field clarification to Standards → CHK-012

**Phase Gate**: All 18 fixes applied, each verified by re-reading modified file ✅

---

## Phase 3B: Routing Logic Redesign (14 edits)

### File 1: DEPTH Framework (1 edit)
- [x] T028 [P0] Edit 1: Change Loading Condition from ON-DEMAND to ALWAYS → CHK-020

### File 2: Interactive Mode (3 edits)
- [x] T029 [P0] Edit 2: Change Loading Condition from ON-DEMAND to ALWAYS with override note → CHK-020
- [x] T030 [P0] Edit 3: Rewrite Activation Triggers intro to reflect default-first model → CHK-020
- [x] T031 [P0] Edit 4: Update closing italicized text to reflect always-loaded status → CHK-020

### File 3: System Prompt (6 edits)
- [x] T032 [P0] Edit 5: KB table Row 7 — DEPTH loading changed to ALWAYS → CHK-021
- [x] T033 [P0] Edit 6: KB table Row 8 — Interactive Mode loading changed to ALWAYS → CHK-021
- [x] T034 [P0] Edit 7: Replace entire routing tree in Section 5.1 with OVERRIDE model → CHK-021
- [x] T035 [P0] Edit 8: Update Document Loading Strategy table rows for DEPTH and IM → CHK-021
- [x] T036 [P0] Edit 9: Restructure PRELOAD_GROUPS to ALWAYS_LOADED + per-path groups → CHK-021
- [x] T037 [P1] Edit 10: Update Phase 3 comment to acknowledge ALWAYS_LOADED docs → CHK-021

### File 4: AGENTS.md (4 edits)
- [x] T038 [P0] Edit 11: Expand ALWAYS load list to include Interactive Mode + DEPTH Framework → CHK-022
- [x] T039 [P0] Edit 12: Update Note about implicit docs to include IM and DEPTH → CHK-022
- [x] T040 [P0] Edit 13: Reframe (none) command table row as default path → CHK-022
- [x] T041 [P0] Edit 14: Remove DEPTH from on-demand Complex creation line → CHK-022

**Phase Gate**: All 14 routing redesign edits applied and verified ✅

---

## Phase 4: Verification

- [x] T042 [P0] Re-read all 4 modified files (routing redesign) to confirm edits applied correctly → CHK-030
- [x] T043 [P0] Cross-file consistency check: all DEPTH/IM loading references aligned → CHK-030
- [x] T044 [P1] Create spec folder documentation (tasks.md, checklist.md, implementation-summary.md) → CHK-040

**Phase Gate**: All verification passed, documentation complete ✅

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (re-read every edited file)
- [x] All P0 checklist items verified

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T004 | CHK-001, CHK-002 | P0 | [x] |
| T009-T013 | CHK-010 | P0 | [x] |
| T014-T021 | CHK-011 | P1 | [x] |
| T022-T027 | CHK-012 | P2 | [x] |
| T028-T031 | CHK-020 | P0 | [x] |
| T032-T037 | CHK-021 | P0 | [x] |
| T038-T041 | CHK-022 | P0 | [x] |
| T042-T043 | CHK-030 | P0 | [x] |
| T044 | CHK-040 | P1 | [x] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Audit Complete
- [x] All 11 files read in full
- [x] Cross-reference map built
- [x] All 18 issues classified and presented

### Gate 2: Original Fixes Complete
- [x] All 5 Critical fixes applied and verified
- [x] All 7 Moderate fixes applied and verified
- [x] All 6 Minor fixes applied and verified

### Gate 3: Routing Redesign Complete
- [x] DEPTH Framework loading condition updated
- [x] Interactive Mode loading condition and text updated
- [x] System Prompt routing tree, tables, and pseudocode updated
- [x] AGENTS.md always-loaded list and command table updated

### Gate 4: Verification Complete
- [x] Cross-file alignment verified across all 4 files
- [x] Spec folder documentation created

---

## L2: BLOCKED TASK TRACKING

No blocked tasks. All dependencies (user decisions) were resolved during the session.

---

<!--
LEVEL 2 TASKS (~160 lines)
- Core + Verification tracking
- Task-to-checklist traceability
- Phase completion gates
- Covers both original 18-fix audit and routing redesign (14 edits)
-->
