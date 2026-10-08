---
title: "Tasks: Legacy-era report and detection"
description: "Build a unified, read-only packet classifier that combines five pre-v4 signals with exclusion filtering and header alias normalization."
trigger_phrases:
  - "legacy era report tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Legacy-era report and detection

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

- [ ] T001 Define exclusion list patterns for lineages, scratch, changelog, git-ignored paths (repo-era.mjs:10-30)
- [ ] T002 Create header alias map for drifting spellings (repo-era.mjs:32-50)
- [ ] T003 [P] Set up Vitest fixture with 20 test packets covering era signals (tests/repo-era.vitest.ts:1-100)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement PacketClassifier class: walk specs/ tree using lib/corpus.mjs filtering (repo-era.mjs:52-150)
- [ ] T005 Implement signal detectors: layout, frontmatter, template marker, generated metadata, level match (repo-era.mjs:152-300)
- [ ] T006 Implement EraReport class: aggregate signal findings into counts and classification (repo-era.mjs:302-400)
- [ ] T007 Export classifyRepo and buildReport functions for preflight/doctor/sweep (repo-era.mjs:402-410)
- [ ] T008 Integrate era report into upgrade-legacy.mjs preflight section (upgrade-legacy.mjs:~170)
- [ ] T009 Add compatibility section to /doctor:update check workflow (doctor-update-check.yaml:new section)
- [ ] T010 Add era signals documentation to spec-kit README (README.md:new section)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Test classifier walk covers all 20 fixture packets (tests/repo-era.vitest.ts:102-180)
- [ ] T012 Test exclusion patterns filter lineages, scratch, changelog, git-ignored (tests/repo-era.vitest.ts:182-250)
- [ ] T013 Test signal detectors fire correctly on each era signal (tests/repo-era.vitest.ts:252-380)
- [ ] T014 Test header alias normalization resolves all drifting spellings (tests/repo-era.vitest.ts:382-420)
- [ ] T015 Test report counts match individual signal tallies (tests/repo-era.vitest.ts:422-450)
- [ ] T016 Run repo-era on fixture, verify report counts match AC-004 consistency check (fixture, not corpus-scale)
- [ ] T017 Verify `upgrade-legacy` preflight prints layout and frontmatter findings (manual)
- [ ] T018 Update plan.md and spec.md for closure (this folder)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



