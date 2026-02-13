# Tasks: Remaining Deferred Work

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

## Phase 1: LinkedIn Audits — Nigel & Pieter (PARALLEL)

> Both audits run simultaneously. Tasks T001-T007 (Nigel) and T008-T014 (Pieter) have no dependencies on each other.

**Nigel de Lange:**

- [x] T001 [P] [P0] Read all Nigel system prompt files (`3. LinkedIn/Nigel de Lange/knowledge base/system/*.md`) → CHK-001
- [x] T002 [P] [P0] Read all Nigel rules files (`3. LinkedIn/Nigel de Lange/knowledge base/rules/*.md`) → CHK-001
- [x] T003 [P] [P0] Read all Nigel context files (`3. LinkedIn/Nigel de Lange/knowledge base/context/*.md`) → CHK-001
- [x] T004 [P] [P0] Read all Nigel voice files (`3. LinkedIn/Nigel de Lange/knowledge base/voice/*.md`) → CHK-001
- [x] T005 [P] [P0] Read Nigel AGENTS.md (`3. LinkedIn/Nigel de Lange/AGENTS.md`) → CHK-001
- [x] T006 [P0] Apply 21-category bug taxonomy, produce Nigel audit report → CHK-020
- [x] T007 [P0] Categorize Nigel findings by severity (CRITICAL/HIGH/MEDIUM/LOW) → CHK-020

**Pieter Bertram (in parallel):**

- [x] T008 [P] [P0] Read all Pieter system prompt files (`3. LinkedIn/Pieter Bertram/knowledge base/system/*.md`) → CHK-001
- [x] T009 [P] [P0] Read all Pieter rules files (`3. LinkedIn/Pieter Bertram/knowledge base/rules/*.md`) → CHK-001
- [x] T010 [P] [P0] Read all Pieter context files (`3. LinkedIn/Pieter Bertram/knowledge base/context/*.md`) → CHK-001
- [x] T011 [P] [P0] Read all Pieter voice files (`3. LinkedIn/Pieter Bertram/knowledge base/voice/*.md`) → CHK-001
- [x] T012 [P] [P0] Read Pieter AGENTS.md (`3. LinkedIn/Pieter Bertram/AGENTS.md`) → CHK-001
- [x] T013 [P0] Apply 21-category bug taxonomy, produce Pieter audit report → CHK-020
- [x] T014 [P0] Categorize Pieter findings by severity; note shared patterns with Nigel → CHK-020

**Phase Gate**: Both audit reports complete with all findings categorized; shared/divergent patterns documented

> **Phase 1 completed: 2026-02-10** — All 3 audit reports produced and verified.
> - `nigel-audit-report.md` (224 lines, 11 findings)
> - `pieter-audit-report.md` (264 lines, 8 findings)
> - `cross-agent-analysis.md` (318 lines, 4 cross-agent findings)
> - Total: 23 findings (18 actionable, 5 document-only), 4 user decisions needed

---

## Phase 2: LinkedIn Bug Fixes

- [x] T015 [P0] Fix all CRITICAL findings — Nigel de Lange → CHK-021
- [x] T016 [P0] Fix all CRITICAL findings — Pieter Bertram → CHK-021
- [x] T017 [P0] Fix all HIGH findings — Nigel de Lange → CHK-021
- [x] T018 [P0] Fix all HIGH findings — Pieter Bertram → CHK-021
- [x] T019 [P1] Fix all MEDIUM findings — Nigel de Lange → CHK-022
- [x] T020 [P1] Fix all MEDIUM findings — Pieter Bertram → CHK-022
- [x] T021 [P1] Fix all LOW findings — Nigel de Lange → CHK-022
- [x] T022 [P1] Fix all LOW findings — Pieter Bertram → CHK-022
- [x] T023 [P0] Verification sweep — Nigel de Lange (all fixes confirmed) → CHK-023
- [x] T024 [P0] Verification sweep — Pieter Bertram (all fixes confirmed) → CHK-023

**Phase Gate**: All CRITICAL/HIGH fixes verified; MEDIUM/LOW resolved or deferred

> **Phase 2 completed: 2026-02-10** — All bug fixes applied and verified.
> - **Symlinks**: 10 created (5 Nigel + 5 Pieter) to Global shared files
> - **Nigel fixes**: 11 edits (quote closed, 14 blockers, Pragmatic Operator, scoring weights, $saas added)
> - **Pieter fixes**: 33 UK English conversions + version ref + Founder-Operator label
> - **Cleanup**: CORINA placeholders removed from both directories
> - **Verification**: All 17 checks passed, 0 remaining issues

---

## Phase 3: Token Budget Documentation (M-05)

- [x] T025 [P] [P1] Research token budget patterns across all agents using DEPTH → CHK-030
- [x] T026 [P1] Draft token budget document following Global shared file conventions (metadata header, Loading Condition, Purpose, Scope) → CHK-030
- [x] T027 [P1] Create `0. Global (Shared)/system/` directory and `System - Token Budget - v0.100.md` → CHK-031, CHK-033, CHK-034
- [x] T028 [P1] Add symlinks or loading references in applicable agent AGENTS.md / system prompts; verify consistency → CHK-031, CHK-035

**Phase Gate**: Token budget document exists at `0. Global (Shared)/system/System - Token Budget - v0.100.md`, referenced by applicable agents

> **Phase 3 completed: 2026-02-10** — Token Budget documentation created.
> - Created `0. Global (Shared)/system/System - Token Budget - v0.100.md` (204 lines)
> - 8 sections covering all 7 DEPTH agents with budget guidelines
> - Reference comments added to all 7 DEPTH-agent AGENTS.md files

---

## Phase 4: Final Verification

- [x] T029 [P0] Final verification sweep — Nigel de Lange → CHK-040
- [x] T030 [P0] Final verification sweep — Pieter Bertram → CHK-040
- [x] T031 [P1] Regression check — previously fixed agents unchanged → CHK-041
- [x] T032 [P1] Update spec.md/plan.md/tasks.md to Complete status → CHK-042

**Phase Gate**: All verification passes, no regressions, docs updated

> **Phase 4 completed: 2026-02-10** — Final verification passed.
> - Nigel: 5/5 checks passed (symlinks, AGENTS.md, System Prompt, Quality Validators, stale refs)
> - Pieter: 7/7 checks passed (symlinks, AGENTS.md, System Prompt, Voice DNA, QV, UK English, stale refs)
> - Token Budget: 3/3 checks passed (document exists, all 7 AGENTS.md references, Global shared files)
> - 2 additional UK English fixes applied during verification (Pieter Content Standards + export doc)

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
- **TikTok Audit Reference**: See `specs/003-tiktok-audit/`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T005 | CHK-001 | P0 | [x] |
| T006-T007 | CHK-020 | P0 | [x] |
| T008-T012 | CHK-001 | P0 | [x] |
| T013-T014 | CHK-020 | P0 | [x] |
| T015-T018 | CHK-021 | P0 | [x] |
| T019-T022 | CHK-022 | P1 | [x] |
| T023-T024 | CHK-023 | P0 | [x] |
| T025-T026 | CHK-030 | P1 | [x] |
| T027 | CHK-031, CHK-033, CHK-034 | P1 | [x] |
| T028 | CHK-031, CHK-035 | P1 | [x] |
| T029-T030 | CHK-040 | P0 | [x] |
| T031 | CHK-041 | P1 | [x] |
| T032 | CHK-042 | P1 | [x] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: LinkedIn Audits Complete (PARALLEL)
- [x] All Nigel knowledge base files read
- [x] Nigel audit report produced with severity ratings
- [x] All Pieter knowledge base files read
- [x] Pieter audit report produced with severity ratings
- [x] Shared/divergent patterns between Nigel and Pieter documented
- [x] Ready for Phase 2 (bug fixes)

### Gate 2: Bug Fixes Complete
- [x] All CRITICAL/HIGH fixes applied (both agents)
- [x] All MEDIUM/LOW fixes applied or deferred
- [x] Verification sweeps pass at 100% (both agents)

### Gate 3: M-05 Complete
- [x] `0. Global (Shared)/system/` directory exists
- [x] `System - Token Budget - v0.100.md` created with proper metadata header
- [x] Symlinks or loading references added in applicable agents
- [x] Consistency verified across all DEPTH-using agents

### Gate 4: Final Verification
- [x] All agents verified
- [x] No regressions detected
- [x] Documentation updated to Complete

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| (none) | — | — | — |

---
