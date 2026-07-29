---
title: "Verification Checklist: Create-Journey Gate Fixes"
description: "Planned verification items for the journey-critical fixes, template consistency, silent-discard reporting, and the two-class journey proof."
trigger_phrases:
  - "create journey gate fixes checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Create-Journey Gate Fixes

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Items are marked only with command output or diff evidence at execution time.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Every lens-2/lens-3 finding re-verified at its cited file:line on the execution tip [evidence: each cited file:line re-checked; F2 narrowed to `SKILL.md:275`]
- [x] CHK-002 [P1] Broken parent journey reproduced in a temp dir with the exact doctor/gate failures captured [evidence: `init_skill.py --kind parent` into tmp then doctor: FAIL on resourceContractVersion pre-fix, 0/0 post-fix]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Generator error path follows the existing ContractError conventions [evidence: `ORPHAN_ALIAS_MODE` follows the existing ContractError shape]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-004 [P1] Failing-fixture test covers the unknown-mode alias row [evidence: failing fixture added in `leaf-resource-contract.test.cjs`, suite passes]
- [x] CHK-005 [P1] Two-class journey proof green: scaffold → gate --fix → clean gate → doctor 0 failures [evidence: `create-journey-proof.test.cjs` prints its pass line, doctor 0 failures]
- [x] CHK-006 [P1] Contract + doctor suites and drift guards pass [evidence: create-skill suites + doctor suite green; drift guards 3/3 in prior sweep]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-007 [P1] resourceContractVersion declared in template + scaffolder; committed manifests byte-identical fleet-wide [evidence: `ci-leaf-manifest-freshness.cjs` checked=11 fresh=11 after declaring the version]
- [x] CHK-008 [P1] Router/registry example templates set-equivalent; doctor 5b/5e pass on an all-examples hub [evidence: `create-journey-proof.test.cjs` asserts doctor exit 0 incl. rules 5b/5e on the all-examples hub]
- [x] CHK-009 [P1] Workflow conformance steps use gate --fix then clean re-run in both journeys [evidence: both workflow steps read `--fix` then clean re-run]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-011 [P1] No new execution paths beyond the generator's named error; probes stay root-contained [evidence: `generate-leaf-manifest.cjs` diff adds one throw path; `git diff --stat` shows no other executable change]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P1] Template notes state only validation that actually runs (family, runtimeLoopTypes) [evidence: `parent-skill-check.cjs:481-491` compared against the template notes line-for-line]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-012 [P1] All edits confined to create-skill assets/scripts/SKILL.md and their tests; no new top-level files [evidence: `git status --short` lists only create-skill paths, tests, and the decision record]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending execution.
<!-- /ANCHOR:summary -->
