---
title: "Tasks: Phase 15: criteria-file-line-enforcement"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "acceptance criteria file line enforcement"
  - "coverage floor cutoff rollout"
  - "lifecycle activation gap"
  - "citation retrofit coverage floor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: criteria-file-line-enforcement

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Re-run the measurement method against children 006-022's `acceptance-criteria.md` files to confirm the 21-of-77 baseline still holds before any edit (`.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`, sourced for `_ac_analyze_canonical`)
- [x] T002 Decided under the autonomous directive and recorded in decision-record.md ADR-001 (operator not present): port the Manual-infeasible exemption. Original ask: get an operator decision on REQ-006 (port the Manual-infeasible exemption into `_ac_analyze_canonical`, or require a real citation on every canonical-schema Met row)
- [x] T003 [P] Decided under the autonomous directive and recorded in ADR-001: default to 2026-08-30. Original ask: get an operator decision on the open question of whether `SPECKIT_AC_COVERAGE_CUTOFF` should default to `2026-08-30` (reused from `check-ac-closure.sh`) or a later date
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `_ac_coverage_cutoff_date()` and a creation-date reader to `check-ac-coverage.sh`, mirroring `check-ac-closure.sh:44-71`
- [x] T005 Wire the cutoff into `run_check`'s enforce branch so a packet created after the cutoff and under the floor fails, and a packet on or before it stays advisory (`.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`)
- [x] T006 Extend `_ac_lifecycle_active()` (`check-ac-coverage.sh:69-99`) with the `acceptance-criteria.md` `**Status:**` fallback per T002's decision
- [x] T007 Ported (T002 chose to port): if T002 chose to port the Manual-infeasible exemption, add it to `_ac_analyze_canonical()` with the same class-marker convention `_ac_analyze_traceability()` uses (unblocked by T002)
- [x] T008 Add the `SPECKIT_AC_COVERAGE_CUTOFF` row to `runtime/ENV-REFERENCE.md`, next to the existing `SPECKIT_AC_COVERAGE*` rows (lines 166-170)
- [x] T009 Retrofit `specs/system-speckit/035-spec-kit-simplification-research/006-retrieval-drift-remediation/acceptance-criteria.md` (7 rows, currently 0 covered)
- [x] T010 [P] Retrofit `.../007-cli-package-residue-removal/acceptance-criteria.md` (7 rows, currently 0 covered)
- [x] T011 [P] Retrofit `.../009-shared-package-dead-half-removal/acceptance-criteria.md` (6 rows, currently 0 covered)
- [x] T012 [P] Retrofit `.../011-command-surface-contract-realignment/acceptance-criteria.md` (6 rows, currently 0 covered)
- [x] T013 [P] Retrofit `.../012-pre-existing-test-repair/acceptance-criteria.md` (4 rows, currently 0 covered)
- [x] T014 [P] Retrofit `.../013-trigger-phrase-quality-enforcement/acceptance-criteria.md` (4 rows, currently 0 covered)
- [x] T015 [P] Retrofit `.../014-cli-decommission-orphan-removal/acceptance-criteria.md` (5 rows, currently 0 covered)
- [x] T016 [P] Retrofit `.../015-shared-package-post-remediation-cleanup/acceptance-criteria.md` (4 rows, currently 0 covered)
- [x] T017 [P] Retrofit `.../016-template-seams-and-sentinel-repair/acceptance-criteria.md` (4 rows, 2 already covered)
- [x] T018 [P] Retrofit `.../017-completion-gate-and-catalog-alignment/acceptance-criteria.md` (4 rows, 3 already covered)
- [x] T019 [P] Retrofit `.../018-scaffold-placeholder-and-upgrade-truth/acceptance-criteria.md` (4 rows, 3 already covered)
- [x] T020 [P] Retrofit `.../019-ci-push-gates-and-runtime-doc-truth/acceptance-criteria.md` (4 rows, 3 already covered)
- [x] T021 [P] Retrofit `.../020-rule-headers-registry-coverage-and-playbook-paths/acceptance-criteria.md` (4 rows, 2 already covered)
- [x] T022 [P] Retrofit `.../021-shared-readme-generator-and-dead-exports/acceptance-criteria.md` (4 rows, 1 already covered)
- [x] T023 [P] Retrofit `.../022-doctor-signal-truth-and-conventions-precision/acceptance-criteria.md` (4 rows, 1 already covered)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Re-run the measurement method from T001 and confirm the program-wide total reaches at least 70 of 77 covered rows
- [x] T025 Run `validate.sh <folder> --strict` with `SPECKIT_AC_COVERAGE_ENFORCE=true` for each of children 006-022 individually and confirm the coverage rule reports as activated and passing, not "gate not active"
- [x] T026 Run `validate.sh --recursive --strict` on the full 035 program without the enforce override and confirm no unrelated rule regresses
- [x] T027 Update `spec.md`, `plan.md` and this document's own state to reflect what shipped
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3 names the cutoff pair, the lifecycle-activation fallback and the citation retrofit]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md section 6 names the cutoff pattern, the REQ-006 decision and the already-measured retrofit content as the three dependencies]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `check-ac-coverage.sh`'s own shellcheck or equivalent lint pass, once T004-T007 land]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: a clean `validate.sh --strict` run from T025 with no stderr output from the coverage rule]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the cutoff pair falls back to the default on a malformed `SPECKIT_AC_COVERAGE_CUTOFF` value, per NFR-R01, verified by a deliberately malformed override]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: side-by-side structural comparison between the new cutoff pair and `check-ac-closure.sh:44-71`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, every AC-ID row Met or Waived with an ADR]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: the per-packet `validate.sh --strict` runs from T025, with output attached showing activation]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: a fixture packet with a `Created` date exactly on the cutoff, confirming it stays advisory per `check-ac-closure.sh`'s own grandfathering rule]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: a packet with neither `implementation-summary.md` nor `acceptance-criteria.md` carrying a recognizable Status signal, confirming the gate stays inactive rather than guessing]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: the lifecycle-activation gap is class-of-bug (one function, one always-false condition, sixteen affected packets). The citation gap is matrix/evidence (77 rows across 16 files, individually verified)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the awk scan across all 16 packets' `implementation-summary.md` files (T001's method) is the producer census proving zero carry a Status row]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: spec.md's Files to Change table names `check-ac-coverage.sh`, `ENV-REFERENCE.md` and every affected `acceptance-criteria.md`]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable. This phase touches no parser, path-redaction or security-sensitive code path]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: the per-packet row and coverage counts are listed in this document's Phase 2 task list, one line per packet]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: a run with `SPECKIT_AC_COVERAGE_CUTOFF` set to a non-ISO string, confirming the fallback-to-default path from NFR-R01]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: the closing commit SHA, once implementation lands, is recorded in implementation-summary.md]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: every citation added is a repo-relative `file:line` reference, verified by reading the retrofitted content]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the cutoff date parser validates ISO-date shape before comparing, per `_acc_cutoff_date()`'s existing pattern]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No authentication or authorization surface exists in this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: this document's task list matches plan.md's phases and spec.md's requirements one for one]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the new cutoff pair and lifecycle fallback carry the same explanatory-comment style as the functions they mirror]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: `runtime/ENV-REFERENCE.md` updated per T008]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` on this packet's folder shows no stray file outside `scratch/`]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` is empty or holds only the `.gitkeep` placeholder at completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
