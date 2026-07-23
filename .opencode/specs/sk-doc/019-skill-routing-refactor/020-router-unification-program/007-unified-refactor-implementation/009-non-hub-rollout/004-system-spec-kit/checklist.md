---
title: "Verification Checklist: system-spec-kit Non-Hub Router Rollout"
description: "Evidence-backed Level-2 checklist for deterministic policy generation, real scorer compatibility, zero-authority parity, closed algebra, and fenced rollback."
trigger_phrases:
  - "system spec kit rollout verification"
  - "system spec kit scorer parity checklist"
  - "bounded default rollback evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/004-system-spec-kit"
    last_updated_at: "2026-07-19T10:39:28Z"
    last_updated_by: "codex"
    recent_action: "Verified every P0 and P1 rollout check"
    next_safe_action: "Retain the isolated candidate and evidence for review"
    blockers: []
    key_files:
      - "harness/run-rollout.cjs"
      - "compiled/system-spec-kit/policy.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-spec-kit-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: system-spec-kit Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass |
| **[P1]** | Required | Must pass or have explicit deferral |
| **[P2]** | Optional | May be documented as deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope and requirements are frozen in `spec.md`.
  - **Evidence**: The child limits all writes to its own folder and forbids scorer, compiler, live-skill, routing-config, install, network, and git publication changes.
- [x] CHK-002 [P0] The primary template and design authority were read before implementation.
  - **Evidence**: The generic compiler, projections, harness, parity, activation logic, compiled example, packet docs, and synthesis sections were read with 48/48 target leaf files.
- [x] CHK-003 [P1] All authored routable bytes are present.
  - **Evidence**: 48 manifest leaves were read completely; aggregate SHA-256 `34d9396ea8c5e539b186ba9cbb7ead3f4b570b01f82ccbc15d8e3145256d75ae`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The compiler is reused, not copied or edited.
  - **Evidence**: Target code imports `../../../001-compiler-n1-shadow/compiler/index.cjs`; there is no target-local compiler implementation.
- [x] CHK-011 [P0] The adapter is identity-agnostic at the policy layer.
  - **Evidence**: The frozen compiler contains no `system-spec-kit` literal or `skillId` equality branch; target identity comes from authored frontmatter and the one-mode leaf manifest.
- [x] CHK-012 [P0] Actual authored source hashes survive parser projection.
  - **Evidence**: Policy provenance hashes the real `SKILL.md`, `leaf-manifest.json`, and `leaf-aliases.json`; the parser projection and no-guard sentinel are not provenance inputs.
- [x] CHK-013 [P1] Comment hygiene passes.
  - **Evidence**: `validate.sh --strict --verbose` reports `COMMENT_HYGIENE_MARKER` PASS; child-local code comments contain no ephemeral identifiers.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Deterministic build passes.
  - **Evidence**: Two complete artifact maps, three policy compiles, and two isolated fingerprints match body SHA-256 `3cd7c7161c06826e543829435c2349feb63cff286e631ee180168c207ec5b2c6` and effective hash `64f24e05b897bad2be29d86b13e87c8feca179e3bc6e31641ddab11e8b01964d`.
- [x] CHK-021 [P0] Frozen schemas and projection hashes pass.
  - **Evidence**: Policy, advisor, 5/5 route decisions, 5/5 typed-gold rows, and policy-card frontmatter validate; all 5 content hashes recompute exactly.
- [x] CHK-022 [P0] N=1 degeneracy is complete.
  - **Evidence**: Candidate count 1, selection `single`, 48 leaves, 17 selectors, empty bundle/cross-target/handoff/authority collections, null overlay, static provenance, and rank calls 0.
- [x] CHK-023 [P0] Authored default semantics are preserved.
  - **Evidence**: Zero signal routes `references/workflows/quick-reference.md` with basis `bounded-default`; positive routes include the same always-loaded resource.
- [x] CHK-024 [P0] Negative and ambiguity invariants pass.
  - **Evidence**: `done memory` produces one clarification with `none_of_these`; the authored prohibition `claim done without checklist verification` produces target-free `reject(forbidden)` with `Withheld` authority.
- [x] CHK-025 [P0] The real scorer is green.
  - **Evidence**: Five explicit expected rows pass through the real read-only `evaluateRouteGold`; extra-resource and fabricated `WRONG` observations both fail.
- [x] CHK-026 [P0] Real legacy shadow parity is green.
  - **Evidence**: Exact PLAN, bounded default, and singular HOOKS cases report 3/3 matches, 0 mismatches, 0 effects, and legacy serving authority.
- [x] CHK-027 [P0] Fenced rollback is byte-exact.
  - **Evidence**: Generation 1 pins the candidate, rollback restores generation-0 bytes at fence 2, and pre/restored SHA-256 both equal `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`.
- [x] CHK-028 [P1] Every child-local CommonJS file passes syntax validation.
  - **Evidence**: `node --check` passes for 6 files; the target validator reports `node_check_files=6`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Producer and consumer boundaries are inventoried.
  - **Evidence**: `harness/run-rollout.cjs` inventories the authored router producer and 5 child-local consumer families.
- [x] CHK-FIX-002 [P0] Cross-consumer default behavior is verified.
  - **Evidence**: `harness/run-rollout.cjs` verifies the same explicit default across 5/5 consumer surfaces.
- [x] CHK-FIX-003 [P1] Adversarial controls can turn the gate red.
  - **Evidence**: Extra resource and fabricated oracle fail 2/2 falsifiers; artifact, hash, parity, and rollback drift are hard assertions.
- [x] CHK-FIX-004 [P1] The fixture family is complete for this archetype.
  - **Evidence**: Exact route, authored default, one-turn clarify, forbidden reject, and singular omission fixtures are 5/5 schema-valid.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, network access, or external effects exist in the child.
  - **Evidence**: `harness/run-rollout.cjs` imports only local modules and Node built-ins; decision diagnostics report `effects=0`.
- [x] CHK-031 [P0] Legacy remains serving-authoritative.
  - **Evidence**: All manifests require `servingAuthority=legacy` and `shadowOnly=true`; authority-bearing manifests fail validation.
- [x] CHK-032 [P1] Non-route decisions are target-free and authority-free.
  - **Evidence**: Clarify and reject decisions contain no destination or authority reference and carry `Withheld`; only route evidence uses `WithheldUntilVerify`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary agree.
  - **Evidence**: All 5/5 canonical docs state one isolated, shadow-only, real-green rollout with the same hashes and counts.
- [x] CHK-041 [P1] Level-2 strict validation passes.
  - **Evidence**: `validate.sh --strict` exits 0 after metadata generation and evidence reconciliation.
- [x] CHK-042 [P2] Parent program status is updated.
  - **Evidence**: Deferred by scope; the user authorized writes only inside this child and the existing lean parent needed no repair.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All writes are child-local.
  - **Evidence**: `004-system-spec-kit` contains every generated policy, fixture, activation, harness, parity, documentation, and metadata write.
- [x] CHK-051 [P1] No scratch or temporary output remains.
  - **Evidence**: `node harness/run-rollout.cjs` hashes the entire child before and after validation and asserts byte identity.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 documented deferral |

**Verification Date**: 2026-07-19
<!-- /ANCHOR:summary -->
