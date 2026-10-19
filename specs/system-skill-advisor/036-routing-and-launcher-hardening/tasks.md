---
title: "Tasks: Advisor routing and launcher hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "routing and launcher hardening tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Advisor routing and launcher hardening

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

- [x] T001 Capture baselines: vitest, Python suite, per-prompt snapshot, short-prompt probe, live CLI, HVR counts, validator census (scratch `fix036/`)
- [x] T002 Build the scratch experiment harness over a copy of the compiled build and score the scorer variants (scratch `fix036/exp/`)
- [x] T003 Write `pre.txt` from the child-dispatch preamble with this spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Item 1: asymmetric containment rule and its unit test (`runtime/lib/scorer/text.ts`, `runtime/tests/scorer/`)
- [x] T005 Item 1: restore `push allowlist` in place of `push` (`.skilled/skills/sk-git/graph-metadata.json`), then export the skill graph
- [x] T006 Item 2: authored `lead_phrases` field, approved by the operator, carried by the deriver into both scorers and `route-validate` (`_routes.yaml`, `fusion.ts`, `skill_advisor.py`)
- [x] T007 Item 3: three-word deep-loop phrases and its activation entries (`_routes.yaml`, `scoring-compatibility.json`)
- [x] T008 Item 3: the deriver and the phrase-reach probe read `mcp_subroutes` (`derive-command-bridges.cjs`, `doctor-phrase-reach.cjs`, their tests)
- [x] T009 Item 3: three-word MCP phrases, activation entries, regenerated bridges, `/doctor:setup` list row if missing, doctor-slice rows
- [x] T010 Item 4: skip the runtime reinstall when `node_modules` matches the lockfile, with a fixture test (`.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/tests/`)
- [x] T011 Item 5: drop the advisor whole-tree override (`playbook-corpus-manifest.json`)
- [x] T012 Item 5: conform the 22 older operator scenarios to the scenario contract (`manual-testing-playbook/**`)
- [x] T013 Item 6: clear HVR hard blockers in the advisor `SKILL.md` and run the Hermes skill sync
- [x] T014 Item 6: clear HVR hard blockers in the advisor playbook index
- [x] T015 Update docs that describe the deep-loop and MCP bridges as inactive
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Mutation check for each code fix (old code back, new test fails)
- [x] T017 Full gate list from the brief, each with its result line
- [x] T018 Report every moved routing row with its judgment
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining without a recorded reason
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

- [x] CHK-010 [P0] Build and typecheck pass
- [x] CHK-011 [P0] No new console errors or warnings in the suites
- [x] CHK-012 [P1] Error handling kept for the install path that still runs
- [x] CHK-013 [P1] Code follows sk-code-skilled patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met or stopped with evidence
- [x] CHK-021 [P0] Live CLI check complete
- [x] CHK-022 [P1] Edge cases tested (optional packages, version mismatch)
- [x] CHK-023 [P1] Error scenarios validated (simulated offline install failure)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (diff reviewed)
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable: no auth surface changed)
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
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-17
<!-- /ANCHOR:summary -->

---
