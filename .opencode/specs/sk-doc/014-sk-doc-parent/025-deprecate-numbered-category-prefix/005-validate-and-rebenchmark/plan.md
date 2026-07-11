---
title: "Plan: end-to-end validation & benchmark regression proof"
description: "Capture a pre-migration Lane C baseline, then after execution run recursive strict validation, the link guard, path tests, a benchmark re-run with delta, and the no-new-numbers guard proof."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Capture baseline before Phase 004"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: End-to-End Validation & Benchmark Regression Proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
The packet's gate. Baseline the Lane C benchmark before the rename, then after execution run the full validation
+ link-guard + path-tests + benchmark-delta + guard-proof suite, and only then allow the completion claim.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Recursive `--strict` Errors 0; leaf classification intact per family; link guard green; path tests green;
benchmark delta non-regressing; guard rejects a new `NN--` folder.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Reuses the Lane C smart-routing harness (unchanged) for before/after scoring, the spec-kit validator for strict
recursion + leaf classification, the whole-workspace markdown-link guard, and the Phase 002 guard for the
rejection proof. No new tooling — this phase is measurement, not change.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. BEFORE Phase 004: capture the Lane C baseline on the skills that will be touched.
2. AFTER Phase 004: recursive `validate.sh --strict`; leaf-classification spot-check per family.
3. Run the markdown-link guard + the hard-coded-path tests.
4. Re-run Lane C on affected skills; compute + explain the before/after delta.
5. Guard proof: create a throwaway `NN--` folder → expect FAIL → remove it → expect PASS.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`validate.sh --strict --recursive` (or per-skill strict loop); the link guard; the flagged path tests;
`run-skill-benchmark.cjs` before/after on affected skills; a scripted guard-proof create/remove cycle.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Phases 002–004 complete; the Lane C harness and the spec-kit validator (rebuilt in the worktree).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Measurement-only; nothing to roll back. A failing gate blocks completion and routes the fix back to the owning
phase (002/003/004), not to this phase.
<!-- /ANCHOR:rollback -->
