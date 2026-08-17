---
title: "Implementation Summary: Deep Research Sealed Artifacts"
description: "Delivered additive-dark Deep Research artifact bindings and one complete ordered lifecycle set that delegates identity, sealing, verification, replay input, and parity equivalence to the shared sealed-reference substrate."
trigger_phrases:
  - "deep research sealed artifacts implementation"
  - "deep-research artifact bindings"
  - "deep research verified sealed reads"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the ordered lifecycle artifact-set binding"
    next_safe_action: "Use the exported set in later separately scoped consumer integration"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-set.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-sealed-artifacts.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-sealed-artifacts-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mode material is sealed as closed digest/reference capsules through the shared store"
      - "The shared reference-set digest remains the sole ordered-set identity"
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
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy authority and behavior remain unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Research now has an additive-dark artifact-binding surface over the real shared sealer. Nineteen lifecycle kinds
cover immutable initialization commitments, gathered source references, analysis observations, convergence inputs and
witnesses, synthesis views and reports, and the memory-save handoff. The ledger-facing binding exposes an
algorithm-qualified event reference and the shared `SealedArtifactReference`; it never embeds a mutable source or
report body.

### Closed Mode Material

Six exported material families validate exact fields by artifact kind. Digests are lowercase 64-hex commitments,
identifiers, versions, and references are bounded tokens, enums use closed sets, ordered digest arrays are bounded, and
locators use selectors capped at 256 characters and 16 whitespace characters. The dispatcher is exhaustive and rejects
unknown fields, wrong per-kind statuses, prose-like selectors, and mutable body fields before sealing.

### Shared-Sealer Read Boundary

`sealDeepResearchArtifact` invokes `SealedArtifactStore.seal` with the registered mode canonicalizer. The matching read
path parses the closed binding and then invokes `SealedArtifactStore.readVerified` with the expected kind. Missing,
unsealed, substituted, partially published, or corrupted artifacts release no bytes and retain the shared typed failure
contract.

### Ordered Verified Lifecycle Set

`bindDeepResearchArtifactSet` requires every registered kind across initialization, gather, analyze, convergence,
synthesis, and memory-save. It derives lifecycle roles from the closed registry, requires canonical iteration and
logical-sequence order, rejects missing or reordered members, and proves that every mode binding matches real authorized
creation evidence before delegating to the shared reference-set binder. The resulting set retains
`reference_set_digest` as its sole content identity; no mode-local digest, store, canonicalization fallback, or verifier
exists.

`deepResearchArtifactSetReplayInput` checks the exact run, lineage, generation, authenticated source tail, and replay
contract context, then asks the shared substrate to re-read every artifact, recompute its digest, and match its ledger
evidence before producing replay input. `compareDeepResearchArtifactSets` refuses parity before behavior comparison when
context, ordering, or shared evidence differs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-sealed-artifacts/deep-research-sealed-artifact-types.ts` | Created | Declares the kind registry contract, six closed material families, and sealed binding/result types |
| `runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-set.ts` | Created | Enforces complete lifecycle ordering, authorized-evidence binding, stale-context rejection, replay re-resolution, and parity equivalence |
| `runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-material.ts` | Created | Validates and canonicalizes each mode kind for the shared store |
| `runtime/lib/deep-research-sealed-artifacts/deep-research-sealed-artifacts.ts` | Created | Creates the shared store adapter and exposes seal, parse, and verified-read operations |
| `runtime/lib/deep-research-sealed-artifacts/index.ts` | Updated | Publishes the ordered-set API with the existing mode artifact API |
| `runtime/lib/deep-research-sealed-artifacts/README.md` | Updated | Documents the ordered lifecycle set and sole shared identity |
| `runtime/tests/unit/deep-research-sealed-artifacts.vitest.ts` | Updated | Proves deterministic repeated builds and fail-closed missing, reordered, stale, tampered, partial-publication, substitution, and corruption paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module remains export-only and unreferenced by legacy execution. The test suite drives the real filesystem-backed
store, transition gateway, append-only ledger, artifact creation events, verified evidence reader, reference-set binder,
and replay-input resolver. Two builder invocations over the same immutable verified evidence emit byte-identical
canonical sets. Repeated equivalent seals also retain the same shared digest reference. No package, lockfile, shared
substrate, sibling runtime, writer, cutover switch, or authority state changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Seal closed digest/reference capsules rather than mutable report or source bodies | The mode ledger needs stable artifact identities while the shared store remains the only byte-integrity authority |
| Include the artifact kind in canonical capsule bytes | Identical field values under different lifecycle kinds must not compete for one shared content address |
| Keep the event reference as `artifact:sha256:<digest>` | The typed ledger accepts bounded reference tokens, and the full shared reference remains available to verified readers and later receipts |
| Use `reference_set_digest` as the only set identity | A wrapper digest would create a forbidden mode-local identity even if it used the same hash algorithm |
| Require all registered lifecycle kinds before replay | A partial run set cannot masquerade as complete evidence for parity or replay |
| Bind freshness to exact run context without hashing a second identity | Stale tails fail closed while replay and artifact identity remain owned by the shared substrate |
| Keep certificate, receipt, and authority decisions outside the adapter | Evidence cannot become authority before a separately gated cutover |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Test-first negative control | PASS: exit 1 with 4 expected failures because the ordered-set API did not exist |
| Targeted Vitest | PASS: 1 file and 12 tests, exit 0 |
| Shared sealed-artifact substrate | PASS: 1 file and 54 tests, exit 0 |
| Determinism | PASS: two complete-set builds over the same immutable verified evidence are byte-identical; repeated equivalent seals retain the same shared digest reference |
| Full runtime TypeScript compile | PASS: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0`, exit 0 |
| Scoped OpenCode alignment | PASS: 5 files scanned, 0 findings, exit 0 |
| Comment hygiene | PASS: 4 changed TypeScript files, 0 violations |
| Repository-wide OpenCode alignment | EXPECTED BACKLOG: exit 1; 261 errors and 984 warnings outside the scoped files; stack-folders and router-sync pass |
| Strict packet validation | Exit 2 with `Errors: 0`, `Warnings: 1`; only generated-metadata disk-path normalization remains, matching the documented environment caveat |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Consumer wiring remains separately scoped.** This phase exposes replay and parity gates but does not edit completed
   sibling runtimes or change their authority.
2. **Certificate and receipt semantics remain externally owned.** They attest shared bindings and verified reads; they do
   not redefine artifact identity.
3. **The expanded sibling compatibility probe is not green at this workspace state.** Old parity fixtures lack the newer
   `ordered_chain_identities` descriptor field, and the typed-ledger placeholder file contains no tests. The frozen scope
   forbids repairing those sibling/shared surfaces here; the phase-focused suite, shared artifact substrate, and runtime
   typecheck are green.
<!-- /ANCHOR:limitations -->
