---
title: "Checklist: create-skill Compiled-Routing Alignment"
description: "Planned QA gate for generated parent-hub directives, explicit legacy/ready states, canonical manifest minting, and backward compatibility."
trigger_phrases:
  - "create-skill compiled routing checklist"
  - "parent hub readiness QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: create-skill Compiled-Routing Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot report aligned generator behavior while unchecked |
| **[P1]** | Required | Must verify or record an operator-approved deferral |
| **[P2]** | Optional | May defer with an explicit reason |

All checks are **Planned** and remain unchecked until implementation evidence exists.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The P3 minter, manifest location, freshness predicate, and runtime discovery interface are stable.
  - **Planned evidence**: Shared API contract and test double.
- [ ] CHK-002 [P0] Current create-skill output and tests are captured before modification.
  - **Planned evidence**: Baseline fixture trees and pytest log.
- [ ] CHK-003 [P1] The directive block is approved against all seven existing hubs.
  - **Planned evidence**: Normalized directive comparison.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Parent-only state parsing accepts exactly `legacy|ready`.
  - **Planned evidence**: Parameterized parser tests.
- [ ] CHK-011 [P0] Ready mode delegates to shared minter/freshness code and defines no local allowlist.
  - **Planned evidence**: Import and call-site inspection.
- [ ] CHK-012 [P0] Generated hub-name substitution leaves no template token.
  - **Planned evidence**: Generated `SKILL.md` assertions.
- [ ] CHK-013 [P1] Existing initializer structure and error handling remain readable and deterministic.
  - **Planned evidence**: Review plus lint/test output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Legacy parent generation emits no manifest and reports legacy.
  - **Planned evidence**: Temp fixture path inventory and captured output.
- [ ] CHK-021 [P0] Ready parent generation reports ready only after a fresh manifest is verified.
  - **Planned evidence**: Test minter manifest plus predicate result.
- [ ] CHK-022 [P0] Missing minter, mint error, stale digest, and malformed manifest fail closed.
  - **Planned evidence**: Negative test matrix with non-zero results.
- [ ] CHK-023 [P0] The compiled-routing option is rejected for standalone skills.
  - **Planned evidence**: Parent-only guard test.
- [ ] CHK-024 [P1] Existing standalone and parent invocations remain compatible.
  - **Planned evidence**: Existing suite plus byte/text comparison of unaffected output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Active scaffold and canonical parent template contain the same directive.
  - **Planned evidence**: Block extraction equality.
- [ ] CHK-031 [P0] create-skill workflow orders manifest mint after final routing inputs.
  - **Planned evidence**: Workflow and call-order test.
- [ ] CHK-032 [P0] Validator distinguishes legacy, ready, and inconsistent outputs.
  - **Planned evidence**: Three-state fixture matrix.
- [ ] CHK-033 [P1] README and parent reference use the same option and status names.
  - **Planned evidence**: Documentation consistency grep.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Manifest paths returned by the minter are canonical and scope-validated.
  - **Planned evidence**: Outside-store negative test.
- [ ] CHK-041 [P0] No digest is synthesized or accepted without shared freshness verification.
  - **Planned evidence**: Stale and forged manifest tests.
- [ ] CHK-042 [P1] Generator output contains no secret or environment value.
  - **Planned evidence**: Fixture inspection.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, and summary all report Planned status.
  - **Planned evidence**: Status audit.
- [ ] CHK-051 [P1] create-skill docs reference the authoritative contract without duplicating it.
  - **Planned evidence**: Cross-link review.
- [ ] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Planned evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Only the active and canonical parent templates own the directive source text.
  - **Planned evidence**: Repository search and parity test.
- [ ] CHK-061 [P0] Ready manifests are written only through the canonical P3 store interface.
  - **Planned evidence**: Minter return-path assertion.
- [ ] CHK-062 [P1] Existing hubs and frozen scorer files remain untouched.
  - **Planned evidence**: Scoped change inventory and scorer hashes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 17 | 0/17 | Planned |
| P1 Items | 8 | 0/8 | Planned |
| P2 Items | 0 | 0/0 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: Parent-hub directive generation, explicit legacy/ready state, canonical manifest mint/freshness, fail-closed behavior, standalone compatibility, and documentation synchronization.
<!-- /ANCHOR:summary -->

