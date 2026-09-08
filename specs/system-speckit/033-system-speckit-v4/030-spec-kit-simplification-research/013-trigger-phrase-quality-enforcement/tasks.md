---
title: "Tasks: Trigger phrase quality enforcement"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phrase quality tasks"
  - "judge module tasks"
  - "diagnostics bucket tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Trigger phrase quality enforcement

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

- [x] T001 Re-measure every round-two count with a census of the committed index and reads of the presentation, judge, doctor and roots (../001-ripgrep-search-system/research/confirmed-findings.md)
- [x] T002 Read the judge's consumers and the generator's imports to place the judge where both can reach it (.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/grep-convention.mjs)
- [x] T003 [P] Read the trigger-index and grep-convention test helpers (.opencode/skills/system-spec-kit/runtime/cli/tests)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extract the judge and its word lists into a dependency-free module and add the `numeric-only` and `single-token` classes; re-export from the retrofit module (.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs)
- [x] T005 Judge every unique key at generation and write the `phraseQuality` bucket to diagnostics, stats and the printed report (.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs)
- [x] T006 Read the bucket as the doctor's pollution signal at medium severity and compare all four generated artifacts in the pair check (.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml)
- [x] T007 Name the five labels and four fields the code emits and re-render the example (.opencode/commands/speckit/assets/search-presentation.txt)
- [x] T008 Correct the diagram, script count, recipe counts and lookup description; add the judge, the two-token rule for symbols, the lookup limits, the repo-rules row and the fixtures row (.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md)
- [x] T009 Add judge cases and the quality-bucket case; correct the allowlist case that admitted bare symbols (.opencode/skills/system-spec-kit/runtime/cli/tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Syntax-check the three modules and parse the doctor asset; run the five retrieval suites (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T011 Regenerate the index twice and compare hashes; read the printed bucket against the census (.opencode/skills/system-spec-kit/runtime/data/trigger-index.json)
- [x] T012 Run the sk-doc validator on the README and the conventions; run strict validation on this child, the lane and the parent (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - `node --check` on the three modules exits 0
- [x] CHK-011 [P0] No console errors or warnings - the suites report only passes
- [x] CHK-012 [P1] Error handling implemented - a phrase that normalizes to nothing keeps its existing class
- [x] CHK-013 [P1] Code follows project patterns - the module mirrors the lib's dependency-free primitives; the tests follow the suites beside them
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Five retrieval suites pass, 177 tests
- [x] CHK-022 [P1] Edge cases tested - a numbers-only date, a three-digit id, a bare symbol, a two-token symbol, each earlier class ahead of the new ones
- [x] CHK-023 [P1] Error scenarios validated - the allowlist test failed on the bare symbols before its correction, which is the behaviour change the convention asks for
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
- [x] CHK-031 [P0] Input validation implemented - the judge reads normalized text only
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
