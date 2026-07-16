---
title: "Implementation Plan: Deep AI Council - Sealed Reference Artifacts"
description: "Implementation plan for the Deep AI Council sealed input and output reference boundary: shared content-addressed digests, seal-on-write, replay-safe reuse, and tamper-evident reads across the council lifecycle."
trigger_phrases:
  - "Deep AI Council sealed artifacts implementation plan"
  - "deep-ai-council content-addressed seal plan"
  - "deep-ai-council artifact verification plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
    last_updated_at: "2026-07-15T22:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated seal manifests from reducer-owned artifact indexes"
    next_safe_action: "Map council inputs and outputs to shared seal primitives"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep AI Council - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-ai-council mode migration |
| **Change class** | Shared sealing adapter and tamper-evident reference-read design |
| **Execution** | Contract-first planning; typed path remains additive, dark, and non-authoritative |

### Overview
The phase will define one Deep AI Council sealing adapter over the phase-006 primitives and phase-012 shared contracts. It
will inventory the immutable inputs and outputs for isolated seats, critique rounds, blinded adjudication, convergence,
synthesis, minority preservation, and the council test gate. Each item is canonicalized, content-addressed, sealed on write,
and read back only through digest and manifest verification. Reuse and resume are allowed only when the shared replay contract
proves compatibility; a changed or missing object is blocked rather than replaced by a mutable packet path. The successor
phase consumes the sealed manifest for certificates and receipts, but this phase does not certify or move authority.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-006 sealing primitives and phase-012 shared identity, artifact-reference, replay, receipt, authorization, and write-set contracts are frozen read-only inputs.
- [ ] The predecessor `002-reducers-and-projections` artifact-index boundary is explicit; this phase seals objects and does not own projection folds.
- [ ] The council lifecycle and artifact inventory identify immutable inputs, derived outputs, private scopes, blinded scopes, and required gate evidence.
- [ ] Legacy `ai-council/**` artifacts, state rows, replay fixtures, and protected-vs-known-defect decisions are pinned for shadow comparison.
- [ ] The implementation boundary excludes certificates, mode-gate authority, cutover, rollback switching, and any second seal format.

### Definition of Done
- [ ] A shared-contract map covers every seal and verification field without local duplicate identity or digest semantics.
- [ ] The seal-on-write sequence is idempotent, append-only, atomic at the shared boundary, and content-addressed.
- [ ] The tamper-evident read contract checks digest, manifest, scope, replay fingerprint, and access surface before returning bytes.
- [ ] Resume fixtures distinguish compatible reuse, re-execution, compensation, quarantine, and rejection without overwriting history.
- [ ] Shadow fixtures prove typed sealed references preserve legacy artifact identity and required content while authority stays unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared primitive boundary**: consume the phase-006 sealing primitive for canonical content digest, immutable object creation,
  seal record, and verification result. Consume phase-012 shared artifact-reference, logical identity, replay, receipt,
  authorization, and write-set fields. The mode adapter may configure artifact kinds and scope, but it cannot redefine the seal.
- **Input manifest**: create one digest-bound manifest for target snapshot, task class, strategy/protocol, prompt and tool
  capability descriptors, model or executor descriptors, seat roster, reasoning-method and independence groups, budget and
  convergence policies, contract revisions, control arms, and council test fixtures. Each entry has a stable logical identity,
  safe scope, content digest, schema/version reference, and visibility class.
- **Output inventory**: seal private proposals, critique records, blinded candidate packages, order-swapped judgments, bias and
  counterfactual probes, convergence evidence, synthesis, minority or unresolved-value records, council artifacts, and gate
  evidence. Large bodies remain in the shared content-addressed store; ledger events carry references and digests.
- **Seal-on-write**: canonicalize bytes under the shared serialization contract, calculate the shared digest, atomically create
  the content-addressed object and manifest, then append the authorized shared seal/reference record. A duplicate canonical byte
  sequence is idempotent; changed bytes receive a new object and append-only supersession lineage.
- **Tamper-evident read**: resolve the requested object by digest, verify object bytes and manifest digest, check logical scope,
  source-event range, contract versions, replay fingerprint, and declared visibility, then return a verified reference. Missing,
  mismatched, unsafe, stale, or quarantined data returns an explicit blocked result and never falls back to a current path.
- **Replay and resume**: compare the sealed input manifest and replay fingerprint before reusing a proposal, critique, judgment,
  or output. Compatible sealed references may be reused; changed inputs route to re-execute, compensate, quarantine, or reject as
  directed by the shared resume contract. Historical objects remain available for as-of replay.
- **Ownership boundary**: `002-reducers-and-projections` indexes the references and derives status; this phase owns the sealing
  adapter and read verification; `004-certificates-and-receipts` consumes seal evidence for certification. No phase duplicates
  the shared seal authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase-006 sealing primitives and phase-012 shared contracts are present, frozen, and compatible with the pinned
  migration sequence.
- Read the predecessor reducer/index contract, the Deep AI Council typed event schema, council findings registries, legacy
  artifact layout, and replay fixtures.
- Freeze the artifact inventory vocabulary, ownership matrix, access/visibility classes, and no-second-scheme boundary.

### Phase 2: Implementation
- Define the input manifest and output inventory for every lifecycle stage from run initialization through the council test gate;
  identify required, optional, private, blinded, diagnostic, and superseding entries.
- Map each inventory row to the phase-006 seal primitive and phase-012 shared reference, authorization, receipt, replay, and
  write-set fields; reject mode-local aliases and report unresolved shared fields.
- Specify canonicalization, digest, atomic create, seal record, idempotence, and supersession behavior for seal-on-write, including
  concurrent duplicate writes and failed writes.
- Specify the tamper-evident reader, including digest resolution, manifest/scope checks, visibility checks, replay compatibility,
  explicit failure taxonomy, quarantine behavior, and the absence of mutable-path fallback.
- Specify resume and reproduction decisions from sealed input manifests and replay fingerprints, preserving old objects and
  linking re-execution or compensation to the prior sealed lineage.
- Define the shadow-parity adapter that compares legacy artifact references and bytes with typed sealed references without moving
  authority; leave certificate issuance and mode-gate decisions to the successor.

### Phase 3: Verification
- Run repeated seal-on-write fixtures for identical and changed canonical bytes; compare digests, manifests, object identity,
  idempotence, and supersession lineage.
- Exercise missing, changed, unsafe, stale, wrong-scope, wrong-visibility, malformed-manifest, and quarantined-read fixtures;
  every invalid case must return an explicit non-verified result with no fallback.
- Replay the same sealed input manifest and output references twice and compare returned bytes, reference identity, replay
  fingerprints, and resume decisions.
- Exercise concurrent duplicate writes, late outputs, superseding gate evidence, private-seat access, blinded adjudication access,
  and historical as-of reads.
- Compare the sealed reference inventory with frozen legacy council artifacts and verify no reducer, certificate, gate authority,
  or legacy-writer change occurred.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract diff lists phase-006 and phase-012 inherited seal, digest, identity, replay, receipt, authorization, and write-set fields; duplicate local fields fail review |
| REQ-002 | Inventory fixtures cover target, strategy, prompt/tool/model capabilities, roster, budgets, contracts, control arms, and test fixtures with scope and visibility metadata |
| REQ-003 | Lifecycle fixtures create sealed references for proposals, critiques, blinded candidates, judgments, convergence, synthesis, minority, council, and test-gate outputs |
| REQ-004 | Repeated identical writes are idempotent; changed canonical bytes produce a new digest and append-only supersession record without overwriting the first object |
| REQ-005 | Manifest fixtures verify logical identity, run/round/seat scope, source event range, schema/policy versions, replay fingerprint, digest, and lineage |
| REQ-006 | Read fixtures cover digest mismatch, manifest mismatch, missing object, unsafe path, wrong scope, stale fingerprint, wrong visibility, and quarantine; all fail closed |
| REQ-007 | Private and blinded access fixtures prove prohibited identity, peer-score, vote-count, and rationale surfaces are not returned to unauthorized consumers |
| REQ-008 | Resume fixtures distinguish reuse, re-execute, compensate, quarantine, and reject decisions after input, policy, tool, model, or output changes |
| REQ-009 | Certificate and mode-gate fixtures consume seal evidence as input but cannot issue certification or change authority from this phase |
| REQ-010 | Shadow fixtures compare legacy and typed identity, scope, digest, required content, and availability without changing legacy authority |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the phase-006 sealing and transition-authorized ledger primitives, phase-012 shared event/reference/replay/
receipt/write-set contracts, `001-typed-ledger-schema`, `002-reducers-and-projections`, the Deep AI Council findings in
`002-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json`, cross-cutting council entries in
`findings-registry.json`, the 065 parent `spec.md`, and `manifest/phase-tree.json`.

The legacy `ai-council/**` artifact layout and state fixtures are comparison inputs only. The successor
`004-certificates-and-receipts` consumes the sealed manifest but does not redefine its digest or read semantics. The typed path
remains additive and dark; authority changes only in the staged cutover phase after mode gates and rollback evidence pass.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase authors a planning contract and introduces no runtime authority or destructive data migration. If a later dark
implementation has a sealing or read-verification defect, disable the typed sealing adapter and continue serving the legacy
artifact path for non-authoritative operation; retain all valid shared sealed objects and do not delete source events. A bad
manifest or digest is quarantined and rebuilt from the immutable input or output source under a new seal, never repaired in
place. Any persisted index or cache change is reverted by replaying the shared ledger and seal records. Certificate issuance,
authority rollback, and legacy-writer retirement remain owned by later phases.
<!-- /ANCHOR:rollback -->
