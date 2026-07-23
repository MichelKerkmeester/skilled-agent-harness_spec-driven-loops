---
title: "Verification Checklist: Offline Correction Overlay"
description: "Level-2 evidence for immutable vocabulary assignment, real scorer replay, gated shadow promotion, privacy exclusion, fenced rollback, and the inert singleton case."
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Offline Correction Overlay

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-001 [P1] Learning is one-directional and offline-only.
  - **Evidence**: `lib/correction-overlay.cjs` exposes batch ingestion, candidate compilation, replay, shadow promotion, and rollback; the activation manifest remains `servingAuthority:legacy` and `shadowOnly:true`.
- [x] CHK-002 [P1] The serving decision contract retains destination-local authority.
  - **Evidence**: replay decisions pass the upstream closed algebra with `WithheldUntilVerify`; the external execution plane rejects an evidence-target commit with `ROLE_CANNOT_COMMIT`.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] Canonical hashing is consumed from the frozen upstream library.
  - **Evidence**: overlay, replay, corpus, base, and effective identities call `canonical.cjs`; the implementation defines no serializer or SHA-256 artifact convention of its own.
- [x] CHK-004 [P1] The committed compiler, evaluator/projector, activation CAS, execution plane, and scorer baselines were green before writes.
  - **Evidence**: the five upstream Node harnesses exited 0; the evaluator baseline remained honestly `shadow-partial` for full legacy-corpus mapping while all 13 local rows passed the real scorer.
- [x] CHK-005 [P1] The protected scorer family was hashed before implementation.
  - **Evidence**: SHA-256 baselines were `b039b8dd...` for router replay, `d5a9cc72...` for the scorer, and `249be7c1...` for the scenario loader.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P1] Runtime dependencies are Node built-ins plus frozen local contracts.
  - **Evidence**: the CommonJS require scan found no package import; both files pass `node --check`.
- [x] CHK-007 [P1] Singleton behavior is cardinality-driven rather than name-driven.
  - **Evidence**: `compileCandidateOverlay()` returns the inert result when `destinations.length === 1`; the control-flow scan finds no `skillId`/`skillName` literal comparison.
- [x] CHK-008 [P1] Code comments contain durable rationale only.
  - **Evidence**: `check-comment-hygiene.sh` exits 0 for the library and harness, and the direct forbidden-comment scan returns no match.
- [x] CHK-009 [P1] Fixture syntax and naming conform to the OpenCode JavaScript/config surface.
  - **Evidence**: `python3 -m json.tool` exits 0; JavaScript uses boxed headers, strict mode, numbered uppercase sections, CommonJS, camelCase functions, and documented exports.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P1] Effective identity binds base, overlay-or-null, schema, and generation once per request.
  - **Evidence**: replay reproduces evaluator SHA-256 `713b326932f386cff008d0353152a1387db7b382f71e81dcd0bba74c5b5a900e` from original base `d8181c...`, candidate `a2098a...`, schema V1, and generation 7; promoted generation 8 reproduces `47dc3628...`; mixed pins reject with `MIXED_GENERATIONS`.
- [x] CHK-011 [P1] Overlay content is vocabulary-to-destination only and immutable.
  - **Evidence**: adjustment fields are exactly `destinationId,vocabulary`; injected `weight:4` rejects with `OVERLAY_FIELD_FORBIDDEN`, and an attempted post-compile vocabulary push throws `TypeError`.
- [x] CHK-012 [P1] Deterministic replay is byte-identical and scored externally.
  - **Evidence**: two complete three-row replays serialize identically, all base-derived rows pass phase-002's read-only `evaluateRouteGold` scorer, replay SHA-256 is `fdba309f76b82eb495862e70c2626aa90468347cfdcdbf24199b21b7ea5647b7`, and no scorer write is attempted.
- [x] CHK-013 [P1] The real route-gold verdict has a working falsifier.
  - **Evidence**: a corrupted observation expecting `implementation` but observing `figma` returns `pass:false` from the exported scorer.
- [x] CHK-014 [P1] Aggregate score cannot override a hard route-gold gate.
  - **Evidence**: the learned `construct` alias makes the real evaluator emit `route` against the base-policy `defer`; the real scorer returns `pass:false`, and promotion rejects with `ROUTE_GOLD_GATE_FAILED` even at aggregate `999999.000000`.
- [x] CHK-015 [P1] Independent approval is mandatory.
  - **Evidence**: the passing shadow fixture uses distinct proposer and approver identities; setting both to the proposer rejects with `INDEPENDENT_APPROVAL_REQUIRED`.
- [x] CHK-016 [P1] Fenced promotion compares the caller's expected prior generation and hash.
  - **Evidence**: promotion first proves the retained base-plus-overlay artifact reproduces generation 7, then `fencedSwapInMemory()` accepts generation 7 to 8; a stale expected generation rejects with `MANIFEST_CAS_MISMATCH`.
- [x] CHK-017 [P1] Rollback restores the retained prior bytes exactly.
  - **Evidence**: the second fenced swap advances the monotonic fence to 2 while restoring generation-7 artifact identity `022e26de1a27a44534212af011e20ebcda402b5e9aab403229a090163e3d7647` and manifest bytes exactly; a missing retained artifact rejects.
- [x] CHK-018 [P1] Privacy and retention exclusion occurs before compilation.
  - **Evidence**: the email/password-bearing record is excluded as `privacy-filter` despite `privacyClaim:"clean"`; the old record is excluded as `retention-policy`; mixed partition and retention-policy identities reject before voting.
- [x] CHK-019 [P1] Telemetry evidence binds the admitted corpus rather than a declaration.
  - **Evidence**: sample size must equal the admitted corpus, corpus SHA-256 is recomputed with the frozen serializer, a changed digest rejects with `TELEMETRY_CORPUS_MISMATCH`, and zero gain rejects with `TELEMETRY_GAIN_REQUIRED`.
- [x] CHK-020 [P1] N=1 remains the load-bearing base case.
  - **Evidence**: the one-destination policy returns `{overlay:null, reason:"single-destination"}`, keeps `P=static`, and reproduces its existing effective hash without a skill-name branch.
- [x] CHK-025 [P1] Replay decisions come only from the imported phase-002 evaluator.
  - **Evidence**: `runRouteGoldReplay()` materializes additive detectors/selectors, derives supplemental destination signals from those nodes, calls imported `evaluate()` against the content-valid immutable base, then imported `projectToRouteGold()` and read-only `evaluateRouteGold`; the substitute substring router is absent.
- [x] CHK-026 [P1] Candidate ordering is locale-independent.
  - **Evidence**: planted `ä-mode`/`z-mode` ordering differs under `en-US` and `sv-SE`, while both compilations produce candidate SHA-256 `72cd985bccc56b9d06613494a54cca9231c1d203461b1f7cecc4b16b66c4e80c`.
- [x] CHK-027 [P1] Declared artifact hashes authenticate canonical bytes before effective identity.
  - **Evidence**: changing promoted overlay vocabulary while retaining `overlayHash` rejects with `OVERLAY_HASH_MISMATCH` before `effectiveTuple()` returns.
- [x] CHK-028 [P1] Producer parity compares values rather than parseability.
  - **Evidence**: protected producer intent `quality` and all four produced resources are deep-compared with the real evaluator/projector observation.
- [x] CHK-029 [P1] Replay and promotion share the original immutable base axis.
  - **Evidence**: evaluator, replay evidence, and promoted tuple all carry `d8181caacfb1a60f76a6ab5c3bf0264fca055ebbce7a22a2c99a98c237995d1d`; independently recomputing the frozen effective combine yields `713b3269...`, while the old merged-graph base recompute yields `14973243...` and turns the harness red at the base equality assertion.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P1] Every anti-hollow guard is driven red at its real boundary.
  - **Evidence**: exact failures cover merged-graph base recomputation, real-evaluator route-gold divergence, each high-score promotion gate, locale-sensitive comparator restoration, caller-supplied gold, hash/bytes mismatch, unretained rollback, mixed corpus identities, injected weight, online mutation, same-person approval, unbound corpus, absent gain, mixed generations, and stale CAS.
- [x] CHK-022 [P1] Candidate-set closure is preserved.
  - **Evidence**: every adjustment destination must resolve in the compiled base index; a changed destination rejects with `CANDIDATE_SET_WIDENED`, and the harness reports candidate count 3 before and after overlay application.
- [x] CHK-023 [P1] Base policy bytes are never rewritten by learning or promotion.
  - **Evidence**: an external canonical-byte buffer captured before ingestion equals the bytes after materialization and shadow promotion; evaluator base remains `d8181c...`, while a counterfactual hash of the merged graph is `149732...`; `overlay=null`, an empty overlay, and the parity overlay emit byte-identical base decisions.
- [x] CHK-024 [P1] The optional plane cannot silently become serving-authoritative.
  - **Evidence**: the bound upstream manifest validator admits only legacy-authoritative, shadow-only manifests; the harness result is `promoted-shadow`, not a live promotion.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Privacy decisions inspect record content rather than a clean flag.
  - **Evidence**: `containsSensitiveContent()` canonicalizes the raw record and applies content patterns before normalization; the planted self-attested-clean record is excluded.
- [x] CHK-031 [P1] Negative decisions and evidence targets cannot acquire capability.
  - **Evidence**: upstream guards reject the planted target-bearing defer with `NEGATIVE_TARGET_FORBIDDEN`, the planted evidence commit with `ROLE_CANNOT_COMMIT`, and actor commit without destination READY with `COMMIT_WITHOUT_READY`.
- [x] CHK-032 [P1] Activation is preimage-checked and ABA-resistant.
  - **Evidence**: caller-supplied expected generation/hash is checked by the upstream CAS, while the independent fencing epoch advances on promotion and rollback.
- [x] CHK-033 [P1] No external input controls file paths or live config.
  - **Evidence**: all runtime imports and fixtures use module-owned resolved constants; the implementation has no file-write API and edits no live routing surface.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Architectural decisions cite the approved synthesis.
  - **Evidence**: `implementation-summary.md` cites synthesis §2, §2.1, §3 Idea 2, §4 seam D, §5.3, §6, §9, §12, and open question 7.
- [x] CHK-041 [P1] Dormancy is described as a valid result rather than a defect.
  - **Evidence**: Metadata and Known Limitations state that no production corpus or live authority was supplied and the overlay may correctly remain null forever.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every created or edited artifact is rooted in this phase folder.
  - **Evidence**: the phase inventory contains one library, one validator, one fixture, Level-2 docs, and updates to the three pre-existing contract documents only.
- [x] CHK-051 [P1] Protected scorers, registry, skill, and live routing config remain untouched.
  - **Evidence**: all three protected hashes match before and after the harness; no file outside the phase folder was written.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P1] Targeted executable verification covers every requested success criterion.
  - **Evidence**: `node harness/validate-learning-overlay.cjs` exits 0, reports immutable-base/effective-combine/replay-promotion agreement true, and reports all eight existing gates true for route-gold, no-op equivalence, immutable scorer, hard gates, authenticated CAS, corpus partitioning, locale independence, and producer parity.
- [ ] CHK-061 [P1] Repository strict spec validation is green.
  - Explicit user instruction forbids `validate.sh`; this check remains intentionally unsatisfied.
<!-- /ANCHOR:summary -->
