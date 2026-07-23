---
title: "Implementation Summary: Deep Improvement Common Typed Ledger Schema"
description: "The additive-dark Deep Improvement Common ledger boundary exposes a 35-stem typed event union, closed evaluator/canary/promotion payloads, a pinned score backend, and fail-closed legacy compatibility hooks."
trigger_phrases:
  - "deep improvement common typed ledger implementation"
  - "deep improvement common event union"
  - "deep improvement common legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T09:11:00Z"
    last_updated_by: "codex"
    recent_action: "Hardened terminal facts and non-vacuous schema proofs"
    next_safe_action: "Authenticate promotion references during phase-014 cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-common-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The full common catalog contains 35 stems"
      - "Score writes bind backend:deep-improvement-score"
      - "Authorization proof and durable decision references remain shared-substrate concerns"
      - "The three downstream variants consume closed common contracts and add namespaced events"
      - "Run completion outcomes accept only the six legacy-compatible stop-reason pairs"
      - "Promotion authorization references are format-checked here and authenticated during cutover"
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
| **Spec Folder** | 001-typed-ledger-schema |
| **Implemented** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; existing Deep Improvement journals remain authoritative |
| **Baseline revision** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Improvement Common now has one typed append-only vocabulary for the evaluator-first services shared by
agent-improvement, model-benchmark, and skill-benchmark. The schema covers 35 lifecycle stems across run and candidate
lineage, evaluator epochs and raw observations, score normalization and verification, sealed canary references and
veto outcomes, and externally authorized promotion rollout.

### Closed typed ledger boundary

`DeepImprovementCommonLedgerEvent` is the discriminated union. `DeepImprovementCommonEventEnvelope` specializes the
shared `EventEnvelope` without shadowing identity, causation, producer, authority epoch, or authorization-frame
ownership. The common payload adds the stem, independent event version, typed scope, previous-tail hash,
deterministic payload digest, replay metadata, and closed event data.

`DATA_FIELD_RULES` assigns every payload field one semantic validator. Digests and fingerprints require lowercase
64-character hex; identifiers, references, versions, and codes use bounded tokens; ratios and counts are range
checked; enums are occurrence-specific; human explanation is accepted only in explicit reason fields; nested score
vectors reject unknown keys and duplicate dimensions. A recursive mutable-body scan remains a secondary defense.
Run completion additionally closes the terminal-fact matrix: completed pairs only with convergence or iteration
exhaustion, quarantined pairs only with blocked-stop or stuck-recovery, and aborted pairs only with error or manual
stop.

Raw evaluator observations carry fixture, evaluator, artifact, digest, outcome, and receipt references only.
`evaluation_normalized` separately binds observation event IDs, a score-policy version, scorer fingerprint, closed
score vector, normalization receipt, and the exact `backend:deep-improvement-score` write backend. Candidate proposals
cannot carry scores, and score events cannot carry raw bodies or promotion authority.

Promotion payloads cite proposal and evidence digests. An authorized promotion requires a
`transition-authorization:*` business-decision reference, while the actual write still requires a durable allow proof
from the real shared gateway before the append-only ledger accepts it. This schema validates the reference format, not
its historical authenticity. Phase 014 must authenticate the promotion reference against a real
`TransitionAuthorizationGateway` decision while folding prior events or an authenticated migration registry.

### Shared downstream contract

The three downstream variants extend this module through their own event namespaces. Their common surface is:

- `DeepImprovementCommonEventStems`, `DeepImprovementCommonWireEventTypes`, `DeepImprovementCommonPayloadMap`,
  `DeepImprovementCommonScopeMap`, `DeepImprovementCommonEventEnvelope`, and `DeepImprovementCommonLedgerEvent`.
- `createDeepImprovementCommonEventRegistry`, `prepareDeepImprovementCommonEvent`,
  `deepImprovementCommonPayloadDigest`, `decideDeepImprovementCommonCompatibility`, and
  `upcastLegacyDeepImprovementCommonRecord`.
- `DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF` for all normalized score writes.

Downstream lanes must not widen these common payloads back to open objects. Variant-only facts belong in new
`agent-improvement.*`, `model-benchmark.*`, or `skill-benchmark.*` stems that reference common event IDs and digests.

### Contract pins

| Contract | SHA-256 |
|----------|---------|
| Shared event-envelope export | `87c50ebe979550fe2ac69be7eaf89a43d6fbfeb280d9a72e8fcba0ac59e1dd9b` |
| Authorized-ledger export | `5c5daca8f76752311478a905df6c7035a6eefcfb18bbd474bbbb6310d7d33315` |
| Replay-fingerprint export | `4bc262f52f155ef4efdd993f6193fdd40558f07429b67244496bb70a4807bc90` |
| Golden Deep Research schema template | `1dbc162804943d1b845f3b1088cebc234336d6959fc8351fbacd1dc5fe9b605a` |
| Deep Improvement Common vocabulary manifest | `17d046e122f698f5cf9fadd3c0c4901f0a960faad72a2bbd28f42cd5d51c6efc` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-types.ts` | Created | Event stems, wire mappings, typed scopes, payload contracts, and public union |
| `runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-schema.ts` | Created | Closed validation, deterministic digests, registry, preparation, and score-backend binding |
| `runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts` | Created | Pure fail-closed compatibility decisions and registered legacy upcasters |
| `runtime/lib/deep-improvement-common-ledger-schema/index.ts` | Created | Stable public module boundary for sibling consumers |
| `runtime/tests/unit/deep-improvement-common-ledger-schema.vitest.ts` | Created | All-stem authorization, replay, rejection, separation, immutability, and compatibility coverage |
| Leaf packet docs | Updated | Completion state, verification evidence, and sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is dark and has no authoritative writer integration. Tests construct current envelopes, authorize them with
the real `TransitionAuthorizationGateway`, append them with `AppendOnlyLedger.appendAuthorized`, and read them through
verified ledger storage. No golden Deep Research module, shared envelope, authorized ledger, replay fingerprint,
legacy writer, reducer, projection, sealed-artifact service, certificate, rollback switch, or authority path changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep authorization proof references in durable ledger frames | The frozen gateway and ledger own proof freshness, policy binding, and durable decision references. Repeating them in the common envelope would create a second authority surface. |
| Require explicit downstream variant attribution | A closed three-value scope makes shared-service ownership replay-addressable while leaving variant-only facts in downstream namespaces. |
| Freeze normalized score writes to one backend reference | `backend:deep-improvement-score` prevents sibling lanes from silently forking the common score write contract. |
| Preserve raw and derived values in different event families | Evaluator observations remain immutable witnesses; normalization and promotion record later judgments without overwriting them. |
| Close run-completion terminal facts as explicit pairs | The legacy compatibility mapping defines six coherent outcome/reason pairs; validating the pair prevents contradictory terminal history. |
| Close every payload and nested object by semantic kind | Exact fields prevent synonym-key smuggling and force every new field to declare its digest, token, enum, numeric, prose, or value-object role. |
| Keep promotion-reference authenticity outside the schema | The schema can enforce a transition-authorization token shape, but phase 014 must resolve it to a real gateway decision before cutover. |
| Pin lossy legacy events to the old runtime | Compatibility must not fabricate evaluator, canary, promotion, or lineage evidence from open legacy detail objects. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 15 tests passed |
| All-stem matrix | PASS: 35/35 stems authorize, append, and read back with replay metadata and durable authorization references |
| Terminal-fact consistency | PASS: `aborted + blockedStop` rejects, `quarantined + blockedStop` accepts, and removing the pair guard makes the negative test fail |
| Reference-token boundary | PASS: under-256-character prose with spaces rejects in real observation/canary reference fields, while valid no-space tokens prepare |
| Append-only construction | PASS: candidate generation and observation normalization prepare as new registered events that reference predecessor identity and digest |
| Raw/derived boundary | PASS: candidate scores, observation normalization, and cross-family fields reject before append |
| Promotion authorization | PASS: self-issued score references and absent gateway proofs reject; the ledger head remains unchanged |
| Legacy producer path | PASS: a registered session record upcasts deterministically, retains source/upcaster digests, and prepares against the current registry |
| Runtime TypeScript project | PASS: project-pinned `tsc --noEmit -p runtime/tsconfig.json` exit 0 with zero errors |
| Comment hygiene scan | PASS: no decision, requirement, checklist, task, or spec-path labels in code comments |
| Scope audit | PASS: authored implementation changes are limited to the new module, its unit suite, and this leaf's docs |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after generated metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or projection.** The next sibling folds `DeepImprovementCommonLedgerEvent`; this leaf provides no materialized state.
2. **No authoritative writer.** Existing Deep Improvement journals remain unchanged and authoritative.
3. **No sealed-artifact implementation.** Canary, evaluator, fixture, candidate, and evidence payloads carry references plus digests only.
4. **No certificate, rollback implementation, mode gate, or cutover.** Those remain later-sibling concerns.
5. **Legacy migration is narrow.** Records without stable run and candidate identity return `pin-old-runtime`; unknown records and versions return `blocked`.
6. **Promotion reference authenticity is not schema-local.** A syntactically valid fabricated
   `externalAuthorizationRef` can pass this layer. Phase 014 must authenticate it against a real gateway decision before
   authority cutover, using folded prior events or an authenticated migration registry.
<!-- /ANCHOR:limitations -->
