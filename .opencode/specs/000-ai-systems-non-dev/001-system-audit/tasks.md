# Tasks: Prompt Improver

<!-- SPECKIT_LEVEL: 3 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Phase 1: Deep System Audit

- [ ] T001 [P] [P0] Read all Prompt Improver system files (`Prompt Improver/knowledge base/system/*.md`)
- [ ] T002 [P] [P0] Read all Prompt Improver rules/context/voice files
- [ ] T003 [P] [P0] Read Prompt Improver AGENTS.md
- [ ] T004 [P0] Apply 21-category bug taxonomy, produce audit report
- [ ] T005 [P0] Categorize findings by severity (CRITICAL/HIGH/MEDIUM/LOW)

**Phase Gate**: Audit report complete with severity ratings

---

## Phase 2: DEPTH Redesign

- [ ] T006 [P0] Rewrite DEPTH Framework v0.131 → v0.200 (remove 19 round refs, remove 25 RICCE refs, energy levels)
- [ ] T007 [P0] Rewrite Interactive Mode v0.700 → v0.800 (remove 14 depth_rounds refs, update configs)
- [ ] T008 [P0] Rewrite System Prompt v0.982 → v1.000 (remove 18 round refs, 5 RICCE refs, update workflow)
- [ ] T009 [P0] Cross-file verification: zero rounds/RICCE/depth_rounds violations

**Phase Gate**: 3 new files written, zero violations confirmed

---

## Phase 3: Audit Fix Implementation

- [ ] T010 [P0] Fix all CRITICAL findings
- [ ] T011 [P0] Fix all HIGH findings
- [ ] T012 [P1] Fix all MEDIUM findings
- [ ] T013 [P1] Fix all LOW findings
- [ ] T014 [P0] Final verification sweep

**Phase Gate**: All fixes applied and verified

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All verification sweeps pass at 100%
