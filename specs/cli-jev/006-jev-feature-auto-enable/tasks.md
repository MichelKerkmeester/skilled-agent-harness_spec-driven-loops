---
title: "Tasks: Jev features on by default when a key is stored"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "jev feature auto enable tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Jev features on by default when a key is stored

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

- [x] T001 Pi 1.0 provider rename fixed so Luna runs on cli-pi (`9546a94310`, pushed in `1de385a5a9`)
- [x] T002 Record the suite baselines before any wiring (`scratch/baseline.txt`) (`scratch/baseline.txt`, 15 suite lines)
- [x] T003 Shared switch and readiness helper with tests (`cli-classifier/shared/scripts/jev-features.mjs`) (16 tests in `jev-features.test.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Citation advisory reads the shared switch (`cite-drift-scan.mjs`, `validate_document.py`) (cite drift 52 and advisory pytest 8 pass)
- [x] T005 Reviewer verdict fallback as the `auto` grader with the measured question (`reviewer-scorer.cjs`) (`reviewer-scorer.cjs:339`, verdict-fallback tests pass)
- [x] T006 D4 `jev` grader with the cascade rule and the `auto` default (`score-model-variant.cjs`, `run-benchmark.cjs`, `/deep:model-benchmark`) (`score-model-variant.cjs:312`, model benchmark 273 pass)
- [x] T007 WebFetch injection screen hook, registered for Claude Code (`.skilled/hooks/injection-screen/`, `.claude/settings.json`) (hook 17 pass, live Jev flag at p=0.99)
- [x] T008 Env template, env reference, hook flag template and hooks README name the switches (`ENV-REFERENCE.md:427`, `.env.example:442`)
- [x] T009 Hub docs and root README state the current features (cli-classifier README and root README validate)
- [x] T010 Sweep non-spec references to killed or unshipped Jev features (killed-tool grep outside `specs/` prints nothing)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Luna review of the wiring diff, findings verified and fixed (no P0, fixes verified by undoing each in a copy)
- [x] T012 sk-code-opencode alignment verifier over the created code (0 errors on the created and changed code)
- [x] T013 Every baseline suite rerun at or above its count (every suite at or above baseline)
- [x] T014 Deep research, 5 iterations each on Luna (cli-pi) and DeepSeek (cli-devin), merged into `research/research.md` (10 iterations, 58 merged findings)
- [x] T015 Changelog v4.0.0.3 per sk-create-changelog, validated (`validate_document.py --type changelog`, 0 issues)
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

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
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

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly
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
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



