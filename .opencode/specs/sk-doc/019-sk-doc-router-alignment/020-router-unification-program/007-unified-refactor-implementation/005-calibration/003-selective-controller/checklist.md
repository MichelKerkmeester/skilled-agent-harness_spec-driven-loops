---
title: "Verification Checklist: Selective-Classification Controller"
description: "Level-2 evidence for certificate-gated decisions, bounded clarification, held-out promotion metrics, projection parity, and singleton folding."
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Protocol

- [x] CHK-001 [P0] Multi-candidate routing requires externally bound certificate evidence.
  - **Evidence**: `validateCertificateGate()` recomputes both certificate hashes and compares policy hash, risk slice, generation, active id, lifecycle, method, and corpus identity against request/handle authorities.
- [x] CHK-002 [P0] Authority remains destination-local.
  - **Evidence**: route output is fixed to `WithheldUntilVerify`; every negative branch is target-free and fixed to `Withheld`.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] Approved specification, plan, tasks, and synthesis sections were read before implementation.
  - **Evidence**: the controller contract cites synthesis §2.3, §3 Idea 5, §4, §5.1, §8.1, §8.2, §9, §10, §11 Q2, and §12.
- [x] CHK-004 [P1] Frozen upstream contracts were consumed without redefining their statistical or authority shapes.
  - **Evidence**: the implementation imports frozen canonical hashing; the harness validates the certificate with the committed calibration contract, the corpus with the committed held-out contract, and decisions with the committed compatibility projector.
- [x] CHK-005 [P1] Baseline and blast radius were recorded.
  - **Evidence**: baseline was no controller artifacts or harness; all delivered mutations are confined to this shadow-only phase folder.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The controller is deterministic and effect-free.
  - **Evidence**: source gates reject filesystem, network, clock, and randomness APIs; 17 route-gold fixtures each produce one byte-identical decision across 25 runs.
- [x] CHK-011 [P0] Runtime dependencies stay inside the allowed boundary.
  - **Evidence**: controller source contains one `require()`, targeting the frozen `canonical.cjs`; no package dependency or install was added.
- [x] CHK-012 [P0] No skill-name branch exists.
  - **Evidence**: source gate rejects `skillId` literal comparisons; singleton behavior is selected only by `candidateCount === 1`.
- [x] CHK-013 [P0] Code comment hygiene is clean.
  - **Evidence**: the required comment-hygiene script exits 0 for both CommonJS files; the harness independently rejects ephemeral artifact pointers in controller comments.
- [x] CHK-014 [P1] JavaScript and JSON syntax checks are clean.
  - **Evidence**: `node --check` exits 0 for both CommonJS files and Node parses both JSON artifacts without error.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Certificate absence, staleness, and identity mismatch cannot auto-route.
  - **Evidence**: fixtures return `CERTIFICATE_ABSENT`, `CERTIFICATE_STALE`, `CERTIFICATE_POLICY_MISMATCH`, `CERTIFICATE_RISK_SLICE_MISMATCH`, and `CERTIFICATE_THRESHOLD_INVALID`, each ending in `clarify` rather than either route basis.
- [x] CHK-021 [P0] Rank-only evidence cannot produce a signal route.
  - **Evidence**: `rank-only-never-routes` has a passing rank and margin but no certificate; it emits one typed `clarify` with zero threshold calls.
- [x] CHK-022 [P0] Every friction limit has a real red-path assertion.
  - **Evidence**: actual second-turn, fourth-option, third-attempt, and 257-token inputs hard-fail with four distinct fixed reasons.
- [x] CHK-023 [P0] Accepted clarification performs exactly one bounded rescore.
  - **Evidence**: `accepted-answer-rescores-once` reports `userTurns:1`, `rescoreCalls:1`, and no third attempt.
- [x] CHK-024 [P0] N=1 constant-folds ranking and thresholds away.
  - **Evidence**: the singular exact fixture emits `single`/`signal` with zero rank/threshold/rescore calls; ranking hard-fails with `SINGULAR_THRESHOLD_LOGIC_FORBIDDEN` and `orderedBundle` hard-fails with `SINGULAR_SELECTION_KIND_INVALID`.
- [x] CHK-025 [P0] Projection invisibility is byte-proven.
  - **Evidence**: validated and unvalidated versions of the same route both project to `{"observedIntents":["quality"],"observedResources":["code-quality/SKILL.md"]}`.
- [x] CHK-026 [P0] Real route-gold scoring has a falsifier.
  - **Evidence**: exported `evaluateRouteGold` passes all 17 typed rows; a deliberately corrupted intent returns `pass:false` and `intentOk:false`.
- [x] CHK-027 [P0] A non-discriminating accepted answer cannot auto-route.
  - **Evidence**: `none-of-these-defers-no-match` carries a valid certificate and high rank yet executes `accepted-answer-no-match`, emits target-free `defer(no-match)`, and records zero threshold calls.
- [x] CHK-028 [P0] A spent shared user turn cannot emit another clarification.
  - **Evidence**: `spent-turn-cannot-clarify` uses `attempt:1,userTurnsUsed:1` with a valid clarification shape and terminates at target-free `defer(evidence-unavailable)`.
- [x] CHK-029 [P0] A malformed certificate field abstains without throwing.
  - **Evidence**: the malformed-threshold fixture recomputes both certificate identities, reaches `CERTIFICATE_THRESHOLD_INVALID`, and emits one typed `clarify`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Bounded default cannot bypass the certificate gate.
  - **Evidence**: `certified-bounded-default` is reachable only with a live bound certificate, request-pinned `bounded-default-low`, and usable rank evidence; the certified zero-signal fixture bypasses that branch.
- [x] CHK-031 [P0] External held-out evidence is actually resolved.
  - **Evidence**: the harness validates the real held-out corpus and recomputes `be0fca5545dfe895c8bb22e45fdd07cbde8517873e76c9251af7a4ae7d8bccca`, then binds its policy, generation, and one matching risk-slice record to certificate `de8f49083fb5df1150da09ae78a93efda6535cf52585449edca833850d106aca`.
- [x] CHK-032 [P1] Advisor degradation preserves compiled-policy decisions.
  - **Evidence**: stale and absent advisor fixtures both route through compiled policy evidence; traces distinguish annotation-only from zero evidence.
- [x] CHK-033 [P1] Zero signal does not over-emit.
  - **Evidence**: both absent-certificate and valid-certificate zero-signal fixtures emit target-free `defer(no-match)` with empty compatibility intents/resources and zero rank/threshold calls.
- [x] CHK-034 [P0] Certificate sample counts match the actual held-out slice.
  - **Evidence**: both `evaluationWindow.sampleCount` and `metrics.sampleCount` equal the harness-counted one matching corpus record.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Decisions cannot self-license certificate validity.
  - **Evidence**: the gate derives legality from the external handle and request-pinned identity, not from output calibration fields.
- [x] CHK-041 [P0] Protected scorer files remain byte-stable.
  - **Evidence**: before/after SHA-256 checks match `d5a9cc72…`, `b039b8dd…`, and `249be7c1…`; no scorer write path exists in the phase.
- [x] CHK-042 [P1] Fenced activation remains downstream and reversible.
  - **Evidence**: the controller has no activation or commit API; contract documentation retains Stage-4 fenced CAS and prior-generation rollback as downstream gates.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] The precise function, algebra, evidence, and friction contracts are documented.
  - **Evidence**: `selective-controller-contract.md` defines input provenance, branch ordering, certificate consumption, advisor semantics, four fixed assertions, and migration limits.
- [x] CHK-051 [P1] All seven promotion metrics have counting rules and one held-out slice rule.
  - **Evidence**: `promotion-metrics.v1.json` defines numerator, denominator, unit, and corpus binding for coverage, selective risk, option recall, clarification resolution, cancel/decline, added turns, and card size.
- [x] CHK-052 [P1] Shadow-stage limits are not reported as production evidence.
  - **Evidence**: validator and summary report `shadow-partial`; real threshold fitting and per-hub canary activation remain explicit limitations.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Every created or edited file is rooted in this phase folder.
  - **Evidence**: phase inventory contains only the controller, harness, fixtures, contract, metrics, packet docs, and existing metadata.
- [x] CHK-061 [P0] Live config, registry, scorer, and skill files were not modified.
  - **Evidence**: all protected digest checks pass and no implementation command targeted a file outside the phase folder.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary

- [x] CHK-070 [P0] Targeted validator reaches the honest shadow gate.
  - **Evidence**: `node harness/validate-selective-controller.cjs` exits 0; SC-001..SC-004 are `pass`, SC-005 is `shadow-partial`.
- [ ] CHK-071 [P1] Repository strict spec validation is green.
  - **Evidence**: intentionally unsatisfied; explicit instruction prohibited running `validate.sh` in this change.
<!-- /ANCHOR:summary -->
