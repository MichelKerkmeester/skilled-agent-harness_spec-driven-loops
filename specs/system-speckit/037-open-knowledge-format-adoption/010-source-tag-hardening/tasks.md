---
title: "Tasks: Phase 10: source-tag-hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "source tag hardening tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: source-tag-hardening

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

- [x] T001 Write `measurement-protocol.md`: sample size per class, seed, ground-truth rule per class, planted classes and thresholds (`measurement-protocol.md`): fixed at 12:22Z, sha256 `553e93dce30dcfb7…`
- [x] T002 Record the baseline: warnings per class on the 20 packets and run time per packet: 5,860 checked, 1,748 moved, 1,575 gone, 1,040 guessed, 44 past end; 24.13 s over 20 packets
- [x] T003 [P] Confirm phase 009's parser tests pass and both labelers answer: scanner tests 50/50; both labelers answered, DeepSeek through cli-devin
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read each tag's path whole, with a test for `REPO RULES.md:88` (`check-source-tags-helper.mjs`): plus semicolons and backticks; end-to-end test
- [x] T005 Give gitignored folders one result whether or not the file is present, with tests for both: plus the symlink filter and deduplication
- [x] T006 Draw the stratified sample after the fixes and settle each row: pool from the helper warnings, factual checks on 144 rows
- [x] T007 Build the planted lineage and measure recall per class: recall 100% per class
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the 20 packets in the worktree and the main checkout at one commit, and diff: identical at `93a83a466b0b` through a temporary worktree; baseline differs by 366
- [x] T009 Rerun the default-cutoff comparison and the rule tests: 20/20 identical; helper tests 17/17
- [x] T010 Write the implementation summary, with accuracy and recall per class: every figure names its script
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check` clean)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (check-ignore errors other than exit 1 return 2 with a named reason)
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (7/7)
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested (symlinked folder, semicolon tags, present and absent ignored files)
- [x] CHK-023 [P1] Error scenarios validated (gone path outside any ignored folder still warns)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (whole-tag path: class-of-bug; ignored folder: algorithmic)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (one tag parser, fixed at source)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (consumer: `check-source-tags.sh`, which skips unknown lines such as IGNORED)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (delimiter, symlink and outside-root candidates tested)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (planted classes x 10, listed in the summary)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (`SPECKIT_SOURCE_TAG_CUTOFF` malformed case already tested)
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
- [x] CHK-042 [P2] README updated (if applicable) (not applicable)
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
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



