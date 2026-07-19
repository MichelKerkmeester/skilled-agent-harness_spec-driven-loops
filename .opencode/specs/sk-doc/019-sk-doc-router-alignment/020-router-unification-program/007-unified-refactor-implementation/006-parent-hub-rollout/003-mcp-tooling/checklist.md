---
title: "Checklist: mcp-tooling Unified Router Canary"
description: "Level-2 evidence checklist for the compiled tooling destination graph, authority fence, route-gold, activation CAS, and destination rollout."
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: mcp-tooling Unified Router Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

<!-- ANCHOR:protocol -->
## Protocol

- [x] CHK-001 [P1] Validation is phase-local, zero-dependency, and read-only outside this folder.
  - **Evidence**: `harness/validate-canary.cjs` reports zero external dependencies and re-hashes every authored input and frozen scorer before and after execution.
- [x] CHK-002 [P1] Live serving authority remains unchanged.
  - **Evidence**: Stage-4 output is `servingAuthority: legacy`; candidate and prior manifests are phase-local and `shadowOnly: true`.

<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] The preceding parent-hub canary is GREEN.
  - **Evidence**: `../002-system-deep-loop/harness/validate-canary.cjs` reran GREEN before implementation.
- [x] CHK-004 [P1] Blast-radius evidence confirms the tooling-last order.
  - **Evidence**: `compiled/blast-radius.json` records the only measured row with both external mutation capability and cross-hub judgment dependencies.
- [x] CHK-005 [P1] Authored registry, hub, judgment, transport, and infrastructure identities are pinned.
  - **Evidence**: `activation/acceptance.json` binds seven live source digests; the validator proves those bytes remain unchanged.

<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P1] Composition and authority behavior comes from compiled data.
  - **Evidence**: `compiled/destination-graph.json` contains 15 `composeAfter` rules, 15 `requiresAuthorityFrom` dependencies, and rollout prerequisites; static scanning reports zero destination-name conditional branches.
- [x] CHK-007 [P1] Transports never approve judgment.
  - **Evidence**: All 23 authority edges resolve their approver role; transport approvers equal zero, and a planted transport approver fails `TRANSPORT_SUPPLIES_JUDGMENT`.
- [x] CHK-008 [P1] The richer destination graph is bound to the frozen policy identity.
  - **Evidence**: Graph digest `f8afb35281b150280bd764ee0be961a27ffcdcd63e99dd61914614533291daa2` is included in policy provenance and the canonical recompile is byte-identical.

<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P1] Stage 4 route-gold is GREEN through the real scorer.
  - **Evidence**: Eight typed projections pass the real read-only `evaluateRouteGold`; a corrupted observation fails and no scorer write-back occurs.
- [x] CHK-010 [P1] The Figma case runs through judgment VERIFY and transport COMMIT.
  - **Evidence**: `interface → mcp-figma` produces an approving `RouteProofV1`, consumes destination-local authority at transport VERIFY, then reaches exactly `PREPARE → VERIFY → COMMIT`.
- [x] CHK-011 [P1] Stage 6 proof and effect fences pass.
  - **Evidence**: Hash, epoch, expiry, read-set, authority, policy-bound idempotency, receipt, and read-only-before-mutating checks all report `pass`.
- [x] CHK-012 [P1] Every aggregate hard block is driven.
  - **Evidence**: The validator drives transport-as-judgment, out-of-order COMMIT, unsatisfied authority COMMIT, premature mutation enablement, negative authority, tuple mismatch, mixed generation, COMMIT without VERIFY, and scorer-edit-required blocks.
- [x] CHK-013 [P1] Guard-removal falsifiers prove load-bearing enforcement.
  - **Evidence**: In-memory source mutants show that removing each role, ordering, authority, or rollout guard allows its forbidden state.
- [x] CHK-023 [P1] Changing only `effectivePolicyHash` changes the composition idempotency key.
  - **Evidence**: With request and full target held constant, the current-policy key is `6fab63e8451349cb8b862d61cf0f486992fd6a1d55846400de743d0180723928` and the policy-only variant is `c2b5a03ff21525d4e36672f6285f8131dd1db95adb116508d9e347f6edba2d00`.
- [x] CHK-024 [P1] Composition idempotency matches the frozen execution-plane owner.
  - **Evidence**: The composition fixture and `prepareRoute` oracle both derive `6fab63e8451349cb8b862d61cf0f486992fd6a1d55846400de743d0180723928` for the same request facts, full target, and effective policy.

<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-014 [P1] Zero-signal and ambiguous tooling requests do not over-emit.
  - **Evidence**: Both cases return target-free `defer`; the unapproved mutating Figma case returns `defer(dependency-failure)` with no fallback transport.
- [x] CHK-015 [P1] Advisor drift cannot override the compiled decision.
  - **Evidence**: Live identity match may contribute; stale, absent, and projection-drift cases are annotation/zero-evidence with zero decision overrides.
- [x] CHK-016 [P1] Document-only parity has no machine-policy fallback.
  - **Evidence**: Eight card replays match machine decisions, emit only `PREPARED_DRAFT` for routes, and a planted card divergence is detected.

<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-017 [P1] Activation uses expected-preimage CAS, token locking, and monotonic fencing.
  - **Evidence**: A wrong generation/hash preimage is rejected; forward and rollback swaps consume fence epochs 1 and 2.
- [x] CHK-018 [P1] Rollback restores exact bytes without overstating effect recovery.
  - **Evidence**: Prior and restored manifest hashes both equal `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`; rollback cannot undo a committed external effect.

<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-019 [P1] Machine and human policy views share one compiled snapshot.
  - **Evidence**: `compiled/PolicyCardV1.md`, `policy.json`, `destination-graph.json`, advisor projection, and typed gold are all regenerated by `harness/build-artifacts.cjs`.
- [x] CHK-020 [P1] Limitations and serving state are explicit.
  - **Evidence**: `implementation-summary.md` states that external effects are simulated, legacy remains authoritative, strict packet validation is blocked by legacy template/runtime prerequisites, and post-COMMIT recovery is destination-owned.

<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-021 [P1] Every created or edited file is inside the phase folder.
  - **Evidence**: The phase-local file inventory and harness path guard contain generated artifacts, temporary activation drills, code, fixtures, and documentation under this directory only.
- [x] CHK-022 [P1] Protected live inputs and scorer files are byte-unchanged.
  - **Evidence**: The validator's before/after digests match all seven authored inputs and all three frozen scorer files.

<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary

The execution-plane idempotency teeth, Stage 4, and Stage 6 are GREEN with legacy still serving-authoritative. Strict packet validation was attempted and failed with 11 errors and 3 warnings from the packet's legacy template shape plus unavailable validator runtime artifacts; it is not claimed as passing.

<!-- /ANCHOR:summary -->
