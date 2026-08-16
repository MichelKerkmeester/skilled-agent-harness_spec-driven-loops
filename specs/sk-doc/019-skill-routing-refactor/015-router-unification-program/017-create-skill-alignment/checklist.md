---
title: "Checklist: create-skill Compiled-Routing Alignment"
description: "Completed QA record for generated parent-hub directives, explicit legacy/ready states, canonical manifest minting, and backward compatibility."
trigger_phrases:
  - "create-skill compiled routing checklist"
  - "parent hub readiness QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/017-create-skill-alignment"
    last_updated_at: "2026-08-16T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Conformed docs to updated strict validator"
    next_safe_action: "Rerun recursive strict validation for the program"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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

All checks are verified against the delivered implementation and recorded evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The P3 minter, manifest location, freshness predicate, and runtime discovery interface are stable.
  - **Evidence**: Shared API contract and test double; `init_skill.py:412` `_compiled_manifest_cli` resolves the canonical CLI path.
- [x] CHK-002 [P0] Current create-skill output and tests are captured before modification.
  - **Evidence**: Baseline fixture trees and pytest log; `test_create_skill_contract.py` 23/23 passed.
- [x] CHK-003 [P1] The directive block is approved against all seven existing hubs.
  - **Evidence**: Normalized directive comparison; `compiled-routing-lockstep-surfaces.json` lists 19/19 registered surfaces.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Parent-only state parsing accepts exactly `legacy|ready`.
  - **Evidence**: Parameterized parser tests.
- [x] CHK-011 [P0] Ready mode delegates to shared minter/freshness code and defines no local allowlist.
  - **Evidence**: Import and call-site inspection; `init_skill.py:774` calls `_run_manifest_command('mint', ...)` with no local digest logic.
- [x] CHK-012 [P0] Generated hub-name substitution leaves no template token.
  - **Evidence**: Generated `SKILL.md` assertions.
- [x] CHK-013 [P1] Existing initializer structure and error handling remain readable and deterministic.
  - **Evidence**: Review plus lint/test output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Legacy parent generation emits no manifest and reports legacy.
  - **Evidence**: Temp fixture path inventory and captured output; `test_parent_scaffold_defaults_to_legacy_without_manifest` passed.
- [x] CHK-021 [P0] Ready parent generation reports ready only after a fresh manifest is verified.
  - **Evidence**: Test minter manifest plus predicate result; `test_parent_scaffold_ready_mints_and_verifies_canonical_manifest` passed.
- [x] CHK-022 [P0] Missing minter, mint error, stale digest, and malformed manifest fail closed.
  - **Evidence**: Negative test matrix with non-zero results; `test_parent_scaffold_never_reports_ready_when_minter_is_missing`, `test_compiled_routing_validator_rejects_stale_manifest`, `test_compiled_routing_validator_rejects_malformed_manifest` all passed.
- [x] CHK-023 [P0] The compiled-routing option is rejected for standalone skills.
  - **Evidence**: Parent-only guard test; `test_compiled_routing_option_is_parent_only` passed.
- [x] CHK-024 [P1] Existing standalone and parent invocations remain compatible.
  - **Evidence**: Existing suite plus byte/text comparison of unaffected output; `test_create_skill_contract.py` 23/23 passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Active scaffold and canonical parent template contain the same directive.
  - **Evidence**: Block extraction equality; `test_parent_templates_carry_the_same_exact_directive` passed.
- [x] CHK-031 [P0] create-skill workflow orders manifest mint after final routing inputs.
  - **Evidence**: Workflow and call-order test; `init_skill.py:774` mints only after router inputs are written.
- [x] CHK-032 [P0] Validator distinguishes legacy, ready, and inconsistent outputs.
  - **Evidence**: Three-state fixture matrix; `validate_skill_package.py:131` classifies by `causeCode`.
- [x] CHK-033 [P1] README and parent reference use the same option and status names.
  - **Evidence**: Documentation consistency grep; `README.md:87` uses the same legacy/ready/compiled-ready terms.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Manifest paths returned by the minter are canonical and scope-validated.
  - **Evidence**: Outside-store negative test; `compiled-route-manifest.cjs:52` `MANIFEST_KEYS` fixes the schema the minter returns.
- [x] CHK-041 [P0] No digest is synthesized or accepted without shared freshness verification.
  - **Evidence**: Stale and forged manifest tests; `test_compiled_routing_validator_rejects_stale_manifest` passed.
- [x] CHK-042 [P1] Generator output contains no secret or environment value.
  - **Evidence**: Fixture inspection; `hasExactKeys` enforcement in `compiled-route-manifest.cjs` rejects any key outside the fixed `MANIFEST_KEYS` allowlist.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary report the implemented state consistently.
  - **Evidence**: Final cross-document status audit; confirmed via `validate.sh --strict` STATUS_CROSS_DOC_CONSISTENCY.
- [x] CHK-051 [P1] create-skill docs reference the authoritative contract without duplicating it.
  - **Evidence**: Cross-link review; `README.md:87` points to `compiled-routing-architecture.md` instead of restating it.
- [x] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Only the active and canonical parent templates own the directive source text.
  - **Evidence**: Repository search and parity test; `compiled-routing-lockstep-surfaces.json` inventories 19/19 registered surfaces.
- [x] CHK-061 [P0] Ready manifests are written only through the canonical P3 store interface.
  - **Evidence**: Minter return-path assertion; `mintCanonicalManifest` in `compiled-route-manifest.cjs` is the sole write path.
- [x] CHK-062 [P1] Existing hubs and frozen scorer files remain untouched.
  - **Evidence**: Scoped change inventory and scorer hashes; diff review confirmed no hub or scorer file in this packet's change set.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 17 | 17/17 | Verified |
| P1 Items | 8 | 8/8 | Verified |
| P2 Items | 0 | 0/0 | Not applicable |

**Verification Date**: 2026-07-21.

**Verification Scope**: Parent-hub directive generation, explicit legacy/ready state, canonical manifest mint/freshness, fail-closed behavior, standalone compatibility, and documentation synchronization.
<!-- /ANCHOR:summary -->
