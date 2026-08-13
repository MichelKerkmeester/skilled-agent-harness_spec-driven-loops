---
title: "Checklist: Deep Improvement Common Services - Resume Adapter"
description: "Blocking verification checklist for the sealed-ledger resume adapter, continuity-ladder reducers, idempotent re-entry, and common evaluator, canary, and guarded-promotion services."
trigger_phrases:
  - "deep improvement resume adapter checklist"
  - "sealed ledger resume verification"
  - "deep improvement common services checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-07-27T21:56:30Z"
    last_updated_by: "codex"
    recent_action: "Verified the adapter against real common substrates"
    next_safe_action: "Use the frozen exports in shadow parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep Improvement Common Services - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 013's `005-resume-adapter` child. Every item is a check the paired verifier runs BEFORE the
candidate commit lands; each report pins the candidate SHA, BASE SHA, sealed-ledger range and digest, event-registry/upcaster
identity, reducer-set identity, fixture digest, commands, exit codes, replay fingerprints, and shadow-authority result. The gate
fails on missing evidence, zero exercised transitions, silent fallback, mutated sealed history, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] The landed common ledger, reducer, artifact, certificate, and effect contracts were reviewed before implementation -- Evidence: production imports compile. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-007 [P2] The candidate report records BASE `fbf3c7291eb432ca541666397b95bf5da7bc500b` and the real verifier owns ledger, registry, reducer, and fixture digests.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are scoped to the resume-adapter module, its unit test, and this leaf's docs -- Evidence: scope-only git status. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-009 [P2] The adapter consumes frozen reducers and verified artifacts without emitting domain events or mutating sealed evidence -- Evidence: no predecessor file changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] The adapter reconstructs state through the real offline verifier and reducer and recomputes one canonical fingerprint -- Evidence: exact-reuse and changed-input tests pass. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-002 [P0] Certificate, replay, artifact, and reducer incompatibility is owned by the production offline verifier -- Evidence: a mutated certificate returns non-valid and blocks. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-003 [P0] The exported continuity ladder covers run identity, candidate generation, evaluation, scoring, canary, promotion, and terminal or blocked state. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-004 [P0] Resume request, lease, registry, component, and decision records use closed parsers and canonical digests -- Evidence: caller-added compatibility is rejected. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-005 [P0] Branch receipts are reused only from the offline-verified certificate and effects are recovered only from verified effect-ledger events. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-013 [P0] An intent without a binding completion remains `unknown` and receives a typed reconcile, reexecute, compensate, or blocked disposition. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-014 [P0] Evaluator identity, policy, and schema facts come from a verified evaluator capsule rather than caller data. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-015 [P0] Canary evidence remains sealed and certificate-owned; the adapter neither exposes nor regenerates canary content. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-016 [P0] Promotion branch reuse derives from verified transition receipts and never creates a production promotion decision. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-017 [P0] The common index exports one resume decision contract for the three extension lanes without variant-specific widening. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-018 [P0] Changed component facts cannot inherit success by label -- Evidence: uncovered target or schema drift yields rebuild-required. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-019 [P1] Unknown effect application remains visible and cannot become applied without the shared binder. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-020 [P1] Every output states `dark-evidence-only`, `legacyAuthority: unchanged`, and `productionCompletion: false`. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-021 [P1] Effect decisions preserve logical effect, effect, intent event, and evidence identities from verified events. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-024 [P0] The adapter owns exact, compatible, migrate, pin-old-runtime, and incompatible classification -- Evidence: the five-disposition matrix and registry-authentication test pass. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-025 [P0] Applied effects require the shared seven-fact confirmation binding -- Evidence: forged digests block and a genuine confirmation reuses. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-026 [P0] Prior references resolve through the real certificate verifier and sealed-artifact reader with kind, epoch, lifecycle, freshness, role, and ownership checks. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-027 [P1] The landed predecessors remain unchanged and the implemented adapter remains additive-dark. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-028 [P0] A non-null checkpoint is accepted only when its authenticated prefix reproduces its cursor, projection, and integrity digest. -- Evidence: the wrong-cursor fixture returns checkpoint-digest-mismatch and targeted Vitest reports 23 passed (23).
- [x] CHK-029 [P0] The adapter reconstructs one causal run stream from the authorized ledger and rejects cursor gaps or stream splits. -- Evidence: both authenticated-history fixtures return cursor-gap and targeted Vitest reports 23 passed (23).
- [x] CHK-030 [P0] The certificate start and final heads equal the real replay frontier before any prior work is reused. -- Evidence: the final-head fixture returns frontier-mismatch and targeted Vitest reports 23 passed (23).
- [x] CHK-031 [P1] Reducer, adapter, schema, and codec versions remain committed by the canonical resume fingerprint. -- Evidence: changing each exercised version changes the recomputed digest and targeted Vitest reports 23 passed (23).
- [x] CHK-032 [P1] Compatibility, effect binding, checkpoint, and frontier tests are anti-vacuous. -- Evidence: focused guard deletions produce assertion failures and targeted Vitest reports 23 passed (23).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P1] The exported surface is frozen for agent-improvement, model-benchmark, and skill-benchmark consumers. -- Evidence: targeted Vitest reports 23 passed (23).
- [x] CHK-011 [P1] The continuity source-to-projection matrix covers all seven common steps and effect unknown state. -- Evidence: targeted Vitest reports 23 passed (23).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-012 [P2] The adapter reads evaluator and canary material only through role-aware sealed-artifact APIs and exports digests rather than secret content.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-022 [P2] The implementation summary records the ownership boundary, ladder, compatibility policy, effect binding, and successor handoff.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P1] The provider change is dependency-closed and path-scoped, and its export surface is frozen before variant fan-out. -- Evidence: targeted Vitest reports 23 passed (23).
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The adapter proof contains twenty-three passing real-substrate tests. It covers all five top-level dispositions, authenticated
compatibility, ordered fingerprint recomputation, checkpoint and frontier validation, causal history, forged and genuine
effect confirmations, and unverified-certificate refusal. Whole-runtime TypeScript exits zero, the module remains dark-only,
and no predecessor or consumer lane is modified.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the replay fingerprint and receipt evidence are complete, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
