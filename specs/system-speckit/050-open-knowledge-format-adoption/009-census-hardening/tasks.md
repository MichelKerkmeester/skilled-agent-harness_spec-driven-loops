---
title: "Tasks: Phase 9: census-hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: census-hardening

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

- [x] T001 Write `measurement-protocol.md`: sample size per class, seed, ground-truth rule per class and thresholds (`measurement-protocol.md`): fixed at 12:22Z, sha256 `8afc427486f599ac…`
- [x] T002 Record the baseline: census sha256 at `5285608745fe` and the median time of three full runs: baseline copy run 735.6 s at `5285608745fe`; three-run median 735.6 s
- [x] T003 [P] Confirm both labelers answer before dispatch: cli-codex and cli-opencode: Luna answered through cli-codex; the cli-opencode Go route refused DeepSeek, so DeepSeek ran through cli-devin
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix spaced paths in the shared parser, with a positive and a negative test (`cite-drift-scan.mjs`): two tests added, 439-row delta
- [x] T005 Draw the stratified samples and settle each row by factual check or two labelers: factual checks for 300 rows; 150 guessed rows labeled by both models
- [x] T006 Split the gone class by cause over the whole class: six causes over 45,338 rows
- [x] T007 Batch the git reads and add the redirect-table rebuild flag: chunked `git cat-file --batch` and `--rebuild-redirects`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Byte-compare census output before and after, apart from the spaced-path delta: 7 lines differ, all spaced delta
- [x] T009 Time three full runs after the change and rerun the scanner tests: medians 214.9 s against 735.6 s; scanner tests 50/50
- [x] T010 Write the implementation summary, with accuracy per class and its interval: every figure names its script
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (operator labels pending)
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check` clean)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (failed cat-file chunk and failed git log both exit non-zero with a named reason)
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (7/8; AC-004 waits for operator labels)
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested (multi-byte doc, spaced prose negative)
- [x] CHK-023 [P1] Error scenarios validated (rebuild outside a repo returns 2)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (spaced path: class-of-bug in the shared parser)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (one producer, `CITATION_RE`, fixed at source)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (consumers: the scanner tests and `check-source-tags-helper.mjs`, which passes `lead` through and is tested in phase 010)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (spaced negative case; a spaced path counts only when the whole name is tracked)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (four classes x protocol sizes, listed in the summary)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (not applicable: no process-wide state read)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (nothing is committed under D4, so no fix SHA exists yet)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable) (deferred: `--rebuild-redirects` is not yet in the sk-doc playbook or feature catalog, which sit outside this phase's file list)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch holds the measurement evidence, kept on purpose)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 0/1 (deferred) |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



