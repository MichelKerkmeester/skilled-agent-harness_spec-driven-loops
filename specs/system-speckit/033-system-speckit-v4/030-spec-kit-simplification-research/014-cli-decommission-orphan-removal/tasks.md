---
title: "Tasks: CLI decommission orphan removal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "orphan removal tasks"
  - "lane repair tasks"
  - "ci workflow tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI decommission orphan removal

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

- [x] T001 Re-check every removal row for importers in every path form, and every kept row for the consumer the lane missed (../002-cli-runtime-utilization/research/confirmed-findings.md)
- [x] T002 Read the barrel, the legacy test blocks and every document line that names a removal target (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T003 [P] Compare the environment-variables reference against every code reader (.opencode/skills/system-spec-kit/references/config/environment-variables.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the eight orphans, trim the barrel and the two legacy test blocks, and drop the README, catalog and hooks rows that named them (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T005 Correct the environment row, the two regex sites, the three fixtures, the architecture tag and the comment path (.opencode/skills/system-spec-kit)
- [x] T006 Supersede the resource-map row in lane 002's census and correct the dead-loader citation in lane 005's (../research/confirmed-findings.md)
- [x] T007 Repair the legacy lane: drop the test of the removed embeddings module (.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js)
- [x] T008 Repair the validation lane: nested layout paths, the frozen fixture's derived fingerprint, and the extended suite's expectations (.opencode/skills/system-spec-kit/runtime/cli/tests)
- [x] T009 Run both lanes in CI after the vitest project (.github/workflows/spec-kit-check.yml)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rebuild, run the check gate and dist freshness, and search for residue (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T011 Run the CLI vitest project, the legacy lane, the validation lane and the suites that pin the compliant fixture (.opencode/skills/system-spec-kit/runtime)
- [x] T012 Run the sk-doc validator on touched READMEs; run strict validation on this child, the lane and the parent; regenerate metadata (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - rebuild exit 0; `npm run check` exit 0
- [x] CHK-011 [P0] No console errors or warnings - dist freshness reports every output fresh
- [x] CHK-012 [P1] Error handling implemented - not applicable to removals
- [x] CHK-013 [P1] Code follows project patterns - the router already called the rule directly; the barrel keeps every live export
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The three lanes pass locally
- [x] CHK-022 [P1] Edge cases tested - the suites that copy the frozen fixture were rerun after its restamp
- [x] CHK-023 [P1] Error scenarios validated - the first rebuild failed on two relative imports the census had missed; both modules were restored and the census corrected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - not applicable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - not applicable
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
