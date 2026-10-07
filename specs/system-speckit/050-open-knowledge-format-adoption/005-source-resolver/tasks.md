---
title: "Tasks: Phase 5: source-resolver"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "source resolver tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: source-resolver

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

- [x] T001 Choose 20 existing packets with `path:line` tags in research or review artifacts, spread across tracks (`scratch/p005-packets.txt`)
- [x] T002 Validate them before the rule exists: 54 folders, all PASSED (`scratch/p005-comparison.json`)
- [x] T003 [P] Confirm the compiled deep contracts are fresh before editing a source they digest
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Helper that finds the tags and calls the shared resolver (`runtime/cli/rules/check-source-tags-helper.mjs`)
- [x] T005 Warn rule and registry entry, counts 41 to 42 (`runtime/cli/rules/check-source-tags.sh`, `validator-registry.json`, `README.md`, `ARCHITECTURE.md`)
- [x] T006 Command surfaces: both prompt packs with contracts regenerated, `/speckit:plan`, `/speckit:complete`, `/doctor:deep-loop` and its route
- [x] T007 Error handling: malformed cutoff falls back, missing date skips, unreadable repo or table exits 2 and the rule reports a skipped check
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fixture tests, 9/9 (`runtime/cli/tests/check-source-tags.vitest.ts`), and the rule on phase 001 with the cutoff lifted: 47 tags resolve
- [x] T009 Rerun the 20 packets with the default cutoff and with it forced to 2000; rerun the CLI suite
- [x] T010 Document the rule and its flag (`validation-rules.md`, `ENV-REFERENCE.md`, `environment-variables.md`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-007 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: plan.md, written alongside the build (implementation-summary.md:91)
- [x] CHK-003 [P1] Dependencies identified and available: the phase 004 resolver, imported unchanged
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `npm run lint` exit 0; `node --check` on the helper; `bash -n` on the rule
- [x] CHK-011 [P0] No console errors or warnings: CLI suite exit 0 with no failed test (implementation-summary.md:125)
- [x] CHK-012 [P1] Error handling implemented: a malformed cutoff falls back, a missing date skips, and an unreadable repo or table exits 2 so the rule reports a skipped check
- [x] CHK-013 [P1] Code follows project patterns: registry-driven shell rule with a node helper, the shape of the existing rules
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: all seven met (acceptance-criteria.md:57-63)
- [x] CHK-021 [P0] Manual testing complete: the rule on phase 001 with the cutoff lifted: 47 tags resolve (implementation-summary.md:119)
- [x] CHK-022 [P1] Edge cases tested: packet-root and uncommitted targets, cutoff skip and malformed cutoff (implementation-summary.md:115)
- [x] CHK-023 [P1] Error scenarios validated: moved and gone fixtures each warn with their class (implementation-summary.md:116)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: not applicable: this phase builds a feature and fixes no review finding
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.: not applicable: no defect class was fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.: consumers are the registry, both prompt packs, `/speckit:plan`, `/speckit:complete` and `/doctor:deep-loop`, each updated
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.: not applicable: no security, path or parser fix; the resolver is reused unchanged
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.: 20 packets by two cutoffs, 54 folders (implementation-summary.md:117-118)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.: the fixture repo sets `core.excludesFile` to `/dev/null` so a global ignore file cannot hide it, and the malformed-cutoff case covers the env variable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.: evidence is the uncommitted diff on `5285608745fe`; the commit is held by root D4
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: a pattern scan of the whole program diff found none
- [x] CHK-031 [P0] Input validation implemented: the cutoff is validated as a date before use
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: spec, plan and tasks describe the same build
- [x] CHK-041 [P1] Code comments adequate: comments state the why and carry no packet labels
- [x] CHK-042 [P2] README updated (if applicable): README and ARCHITECTURE counts and `validation-rules.md` updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: capture script and comparison data are in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion: kept on purpose: `p005-comparison.json` is cited as evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



