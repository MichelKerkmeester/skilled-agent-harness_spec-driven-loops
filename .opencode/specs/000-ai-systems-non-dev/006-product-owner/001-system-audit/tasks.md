# Tasks: Product Owner — DEPTH Energy Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

---

## Phase 1: Deep System Audit

- [x] T001 [P] [P0] Read all Product Owner system files (`Product Owner/knowledge base/system/*.md`) → CHK-001
- [x] T002 [P] [P0] Read all Product Owner rules/context/voice files → CHK-001
- [x] T003 [P] [P0] Read Product Owner AGENTS.md → CHK-001
- [x] T004 [P0] Apply 21-category bug taxonomy, produce audit report → CHK-002
- [x] T005 [P0] Categorize findings by severity (CRITICAL/HIGH/MEDIUM/LOW) → CHK-002

**Phase Gate**: Audit report complete with severity ratings ✓ (findings documented in spec.md Section 9)

---

## Phase 2: Cross-File Alignment

- [x] T006 [P0] Rewrite System Prompt v0.956 → v1.000 → CHK-005, CHK-006
  - Remove 16+ round references ("10-round DEPTH", "Auto-scale to 1-5 rounds", Quick Ref "Rounds" column, "Rounds 1-2" through "Rounds 6-10", etc.)
  - Remove 5 RICCE references (rules 31/37, loading table, RICCE Structure table, must-have validation)
  - Rewrite Section 4 Quick Reference: replace rounds-based content with energy-level-aligned content
  - Replace `depth_rounds` with `energy_level` in pseudocode routing (lines 333, 388)
  - Fix checkbox syntax rule 27: `[]` → `[ ]` (line 71)
  - Version bump to v1.000
- [x] T007 [P0] Rewrite Interactive Mode v0.320 → v0.400 → CHK-007
  - Remove 5+ `depth_rounds` references from command configs (lines 208, 210, 216)
  - Replace "complete DEPTH (10 rounds)" with energy level reference (line 39)
  - Replace "DEPTH rounds: 10" with energy level reference (line 243)
  - Update state machine YAML to reference energy levels
  - Version bump to v0.400
- [x] T008 [P1] Review DEPTH Framework v0.200 → CHK-008
  - Verify clean state: 0 rounds, 0 RICCE, 0 depth_rounds (already confirmed)
  - Version bump only if structural changes made during audit fixes
- [x] T009 [P0] Cross-file verification → CHK-009, CHK-010
  - Grep all 3 files for: rounds, RICCE, depth_rounds — must return 0
  - Verify energy terminology (Raw/Quick/Standard/Deep) consistent across all files

**Phase Gate**: 3 files aligned, zero violations confirmed ✓

---

## Phase 3: Audit Fix Implementation

- [x] T010 [P0] Fix all CRITICAL findings from audit report → CHK-003
- [x] T011 [P0] Fix all HIGH findings from audit report → CHK-004
- [x] T012 [P1] Fix all MEDIUM findings → CHK-020
- [x] T013 [P1] Fix all LOW findings → CHK-021
- [x] T014 [P0] Final verification sweep → CHK-012

**Phase Gate**: All fixes applied and verified ✓

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All verification sweeps pass at 100%
- [x] All P0 checklist items verified

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T003 | CHK-001 | P0 | [x] |
| T004-T005 | CHK-002 | P0 | [x] |
| T006 | CHK-005, CHK-006 | P0 | [x] |
| T007 | CHK-007 | P0 | [x] |
| T008 | CHK-008 | P1 | [x] |
| T009 | CHK-009, CHK-010 | P0 | [x] |
| T010 | CHK-003 | P0 | [x] |
| T011 | CHK-004 | P0 | [x] |
| T012-T013 | CHK-020, CHK-021 | P1 | [x] |
| T014 | CHK-012 | P0 | [x] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Audit Complete

- [x] All KB files read (T001-T003)
- [x] 21-category taxonomy applied (T004)
- [x] Severity ratings assigned (T005)
- [x] Ready for alignment work

### Gate 2: Alignment Complete

- [x] System Prompt v1.000 written — zero rounds/RICCE (T006)
- [x] Interactive Mode v0.400 written — zero depth_rounds (T007)
- [x] DEPTH Framework verified clean (T008)
- [x] Cross-file verification passes (T009)

### Gate 3: Fixes Complete

- [x] All CRITICAL/HIGH findings resolved (T010-T011)
- [x] MEDIUM/LOW findings addressed (T012-T013)
- [x] Final verification passes (T014)

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| T006-T009 | T004-T005 (audit) | High | Cannot begin alignment until audit complete |
| T010-T013 | T004-T005 (audit) | High | Cannot fix findings until they're identified |

---

## L3: ARCHITECTURE TASKS

### ADR Implementation

| Task ID | ADR Reference | Description | Status |
|---------|---------------|-------------|--------|
| T006 | ADR-001 | Remove RICCE from System Prompt, replace with 6-dim self-rating | [x] |
| T007 | ADR-001 | Remove rounds-based config from Interactive Mode | [x] |
| T006 | ADR-002 | Version bump System Prompt to v1.000 | [x] |
| T007 | ADR-002 | Version bump Interactive Mode to v0.400 | [x] |

---

## L3: MILESTONE TRACKING

| Milestone | Target | Tasks Required | Status |
|-----------|--------|----------------|--------|
| M1: Audit Complete | Phase 1 | T001-T005 | [x] |
| M2: System Prompt Migrated | Phase 2 | T006 | [x] |
| M3: Interactive Mode Migrated | Phase 2 | T007 | [x] |
| M4: All Files Verified | Phase 2 | T008-T009 | [x] |
| M5: Audit Fixes Complete | Phase 3 | T010-T014 | [x] |

---

## L3: RISK MITIGATION TASKS

| Task ID | Risk ID | Mitigation Action | Priority | Status |
|---------|---------|-------------------|----------|--------|
| T009 | R-001 | Cross-file grep verification after alignment | P0 | [x] |
| T008 | R-002 | Verify DEPTH Framework is actually clean before assuming | P1 | [x] |
