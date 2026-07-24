---
title: "Implementation Summary: Model Benchmark Sealed Reference Artifacts"
description: "Delivered additive-dark model-benchmark artifact bindings for recipes, runs, cells, observations, scoring, validity, contamination, workload, and selection evidence over the shared sealer."
trigger_phrases:
  - "model benchmark sealed artifacts implementation"
  - "model benchmark verified sealed reads"
  - "model benchmark scoring evidence binding"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-24T04:18:10Z"
    last_updated_by: "codex"
    recent_action: "Closed access-role normalization fail-open"
    next_safe_action: "Close the remaining broad phase-verifier checklist items"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-sealed-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-sealed-artifacts.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-sealed-artifacts-20260723"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Model-specific artifact kinds are closed and canonicalized through one shared store"
      - "Common deep-improvement artifacts remain delegated to the 004 adapter contract"
      - "Model/executor identity, matrix membership, workload, validity, contamination, and selection evidence remain digest/reference-only"
      - "Tampered, unsealed, truncated, partial, missing-dependency, stale, incomplete, contaminated, invalid, and wrong-kind reads fail closed"
      - "Candidate and scorer roles cannot receive sealed or private scoring, judge, or oracle material"
      - "Case, whitespace, and malformed access roles normalize before visibility enforcement"
      - "Model-cell matrix identity resolves from matrixMembership.matrixDigest"
      - "Base, case, prompt, and candidate-view visibility combine by the most-restrictive value"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-sealed-artifacts |
| **Implemented** | 2026-07-23 |
| **Level** | 2 |
| **Status** | In Progress |
| **Posture** | Additive-dark; legacy execution and shared common authority remain unchanged |
| **substrateImportsReal** | true |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`model-benchmark-sealed-artifacts` adds closed, digest/reference-only bindings for benchmark recipes, run manifests,
resolved model cells, raw cell outputs, scoring matrices, common anchors, adaptive diagnostics, validity evidence,
contamination lineage, workload evidence, and selection evidence. Every material has a per-kind closed field set;
digests, bounded tokens, enums, bounded numeric values, structured locators, immutable references, and typed event
bindings are validated before canonicalization.

The adapter imports the landed model-benchmark ledger schema for event stems and matrix keys. It composes the common
canonicalizer profiles into one `SealedArtifactStore`, then invokes that real phase-007 store for derivation, seal-on-
write publication, immutable reads, length checks, digest checks, and descriptor checks. It does not inline response,
trajectory, report, fixture, or evaluator bodies into its ledger-facing material.

The read boundary computes one most-restrictive effective visibility from base `visibility` plus independently parsed
case, prompt, and candidate-view policy fields. A non-public `caseVisibility`, sealed or withheld
`promptVisibilityPolicy`, restricted recipe `candidateView`, uncertain contamination state, or undisclosed exposure
therefore refuses `candidate` and `scorer` reads before returning bytes or material even when base visibility says
`public`. Before that decision, `accessRole` is trimmed, case-folded, and validated against the closed model-benchmark
role enum; malformed or unknown roles resolve to the most-restrictive `candidate` role. The shared adapter's
normalizer is private, so this leaf replicates its exact fail-closed behavior without changing the common module.
Trusted `evaluator` and `downstream` service roles retain the fully verified artifact, and genuinely public materials
remain candidate-readable. Model-cell matrix checks resolve the cell identity from
`matrixMembership.matrixDigest`; top-level `matrixDigest` and run-manifest `matrixMembershipDigest` remain supported
for their respective material shapes.

The public binding types are `ModelBenchmarkSealedArtifactBinding` and `ModelBenchmarkVerifiedSealedArtifact`. The
successor certificate/receipt leaf should bind `reference`, `artifactKind`, descriptor digest, content digest,
evaluator epoch, matrix/workload identity, visibility, completeness, validity, contamination, and the successful
verified-read outcome. It owns certificate and receipt materialization; this leaf does not.

### Shared adapter consumed

The model adapter consumes these 004 exports without forking their semantics:

- `DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT`
- `DeepImprovementCommonArtifactKinds`
- `createDeepImprovementCommonArtifactCanonicalizerRegistry`
- `createDeepImprovementCommonSealedArtifactStore`
- `isDeepImprovementCommonArtifactKind`
- `sealDeepImprovementCommonArtifact`
- `readDeepImprovementCommonArtifact`
- `DeepImprovementCommonArtifactKind`, `DeepImprovementCommonArtifactMaterialByKind`,
  `DeepImprovementCommonSealedArtifactBinding`, `DeepImprovementVerifiedSealedArtifact`, and
  `DeepImprovementArtifactReadPolicy`

### Files changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/model-benchmark-sealed-artifacts/model-benchmark-sealed-artifact-types.ts` | Created | Model kind matrix, closed material types, binding types, and read-policy failures |
| `runtime/lib/model-benchmark-sealed-artifacts/model-benchmark-artifact-material.ts` | Created | Exhaustive per-kind validation, canonical serialization, and composed common/model registry |
| `runtime/lib/model-benchmark-sealed-artifacts/model-benchmark-sealed-artifacts.ts` | Created | Real store construction, seal/read bindings, dependency closure, and policy checks |
| `runtime/lib/model-benchmark-sealed-artifacts/index.ts` | Created | Stable mode export surface |
| `runtime/tests/unit/model-benchmark-sealed-artifacts.vitest.ts` | Created | Real-sealer determinism, mutation, publication, dependency, policy, and substitution proofs |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is new and unreferenced by legacy execution, so it remains dark and non-authoritative. The test suite uses
the real filesystem-backed `SealedArtifactStore`; it does not replace hashing, storage, canonicalization, publication,
or verification with a test double. Common artifact profiles delegate to the landed deep-improvement-common registry,
while mode-specific profiles add only model-benchmark material and read-policy fields.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compose common and model profiles in one real store | A model artifact can depend on a common evaluator, canary, or promotion reference without creating a second sealing scheme |
| Block sealed/private candidate and scorer reads | The existing verified-artifact return shape contains bytes and full material, so refusing the read is the fail-closed way to prevent judge, score, winner, and exact-uncertainty leakage |
| Normalize roles at the read-policy boundary | Case, whitespace, and unknown runtime values must not bypass the closed role enum; unknown values inherit candidate visibility rather than full-material access |
| Combine base and kind-specific visibility by restrictiveness | Independently valid fields must not let a public base declaration override private case lineage, withheld prompts, restricted candidate views, uncertain contamination, or undisclosed exposure |
| Resolve cell matrix identity from nested membership | The model-cell schema stores its true matrix digest under `matrixMembership.matrixDigest`; using only top-level fields falsely rejected valid reads |
| Keep every artifact body outside the binding | Certificates and receipts need stable commitments and immutable references, not mutable report or response text |
| Validate matrix, usage, workload, validity, contamination, and visibility as typed fields | A score or ratio cannot hide missing evidence, stale epochs, contaminated cases, or workload mismatch |
| Keep common-anchor and adaptive-diagnostic artifacts separate | Paired confirmatory evidence must not be conflated with adaptive exploratory allocation |
| Leave reducers, projections, replay, resume, parity, certificates, receipts, and gates to sibling leaves | This adapter remains additive-dark and within its sealed-artifact boundary |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 12 tests passed serially; the new role-normalization test failed against the prior bare-equality policy before the fix |
| Visibility proof | PASS: `Candidate`, `CANDIDATE`, `SCORER`, ` candidate`, unknown `auditor`, and normalized `candidate` reads of sealed scoring evidence return typed `VISIBILITY_MISMATCH` without bytes, material, or the secret winner identifier |
| Visibility controls | PASS: evaluator and downstream reads retain the full winner, judge-calibration, and uncertainty material; existing genuinely public candidate controls remain readable |
| Matrix proof | PASS: the true nested cell `matrixMembership.matrixDigest` succeeds; the run-manifest `matrixMembershipDigest` succeeds; a wrong cell digest returns typed `MATRIX_MISMATCH` with the actual nested digest |
| Rejection proofs | PASS: tampered digest/bytes, unsealed reference, truncated capsule, partial publication, missing dependency, stale epoch/freshness, wrong kind, incomplete usage, contamination, invalid validity, visibility violations, and matrix mismatch all release no bytes |
| Determinism | PASS: repeated equivalent seals reproduce the same shared content digest; semantic recipe mutation changes identity |
| Whole-runtime TypeScript | PASS: runtime project compiler exits 0; `runtime/lib/model-benchmark-sealed-artifacts/` diagnostic grep is 0 |
| Alignment drift | PASS: 4 scoped TypeScript files scanned, Findings 0, Errors 0, Warnings 0 |
| Comment hygiene | PASS: no forbidden packet, requirement, checklist, task, or spec markers in code comments |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 |
| Scope audit | Preserved unrelated pre-existing worktree changes; this build adds only the model-benchmark module, its unit test, and this leaf's docs |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No authoritative consumer.** Dispatch, reduction, projection, replay/resume, parity, certificates, receipts,
   promotion, and mode-gate behavior stay outside this leaf.
2. **The broader planning checklist remains partially verified.** The shared-store, typed matrix-mismatch, and
   candidate/scorer visibility items carry current evidence; unchecked replay, concurrency, downstream certificate,
   reducer, parity, and authority items remain outside this scoped re-verification.
3. **Common service behavior remains common-owned.** The model adapter only delegates common canonicalization and read
   policy; it does not reimplement evaluator, canary, promotion, veto, or redaction semantics.
<!-- /ANCHOR:limitations -->
