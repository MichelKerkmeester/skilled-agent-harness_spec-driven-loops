---
title: "Implementation Summary: Deep Alignment Typed Ledger Schema"
description: "The additive-dark Deep Alignment ledger boundary exposes a 41-stem typed event union: 21 Deep Review-compatible shared-backbone payloads and 20 authority/conformance extensions with fail-closed compatibility."
trigger_phrases:
  - "deep alignment typed ledger implementation"
  - "deep alignment event union"
  - "deep alignment legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:51:39Z"
    last_updated_by: "codex"
    recent_action: "Added guard-specific mutation coverage for seven extension stems"
    next_safe_action: "Fold DeepAlignmentLedgerEvent in 002-reducers-and-projections without widening closed payloads"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/deep-alignment-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/deep-alignment-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-alignment-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Shared review-loop payloads are validated by the real Deep Review schema factory"
      - "Authorization references remain owned by durable ledger frames"
      - "Authority validity and typed adjudication are required before conformance decisions"
      - "Unknown, ambiguous, lossy, expired, rolled-back, and mixed inputs fail closed"
      - "All seven targeted cross-field guards reject crafted field-valid but semantically incoherent inputs"
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
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; the legacy Deep Alignment path remains authoritative |
| **Baseline revision** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Alignment now has a typed append-only schema boundary for later reducers and projections. `DeepAlignmentLedgerEvent`
is a 41-stem discriminated union. Every event specializes the shared `EventEnvelope`, carries a closed typed scope with
`runId`, `sessionId`, and `authorityEpochId`, commits to `prevEventHash`, records replay metadata, and receives a
deterministic payload digest.

### Shared review-loop backbone

Twenty-one payload contracts map directly to the converged Deep Review module and are validated by its real
`createDeepReviewLedgerPayload` factory: run initialization/resume/restart, scope resolution, dimension ordering, protocol
planning, pass start/completion, finding lineage/state, convergence/graph convergence, blocked stop, pause/recovery,
synthesis/report commit, continuity requested/completed/failed, and run completion. Deep Alignment adds its authority epoch
only in mode scope; it does not fork those payload semantics.

### Deep Alignment extensions

Twenty mode-specific stems add authority reference and validation, authority-epoch compatibility, lane planning/start/
completion, subject snapshots, applicability, raw observations, evidence receipts, observation reconciliation, blinded
candidates, independent verification, proof witnesses, claim adjudication, conformance assessment, known-deviation
record/invalidation, applicability coverage, and old-authority witness replay.

Every extension payload is closed by an exact field allowlist and semantic-kind validators. Digests and fingerprints require
lowercase 64-character hex; identities, references, versions, and codes are bounded tokens; selectors are short structured
locators; ratios and counts are range checked; enums are occurrence-specific; human explanation is accepted only in
explicit rationale fields. Nested authority checks, locators, fingerprints, and coverage classes reject unknown keys.

Authority validation records parse, type, capability, rule-test, coverage, expiry, rollback, signature, and mix-and-match
checks separately. A `valid` authority requires every check to pass. Conformance assessment accepts only an authority
validation reference and the literal `valid` authority status, and it preserves `not_applicable`, `unresolved`, `blocked`,
`inconclusive`, and `untested` without pass coercion.

Raw observations and detector candidates cannot carry conformance or P0/P1/P2 fields. A severity-bearing finding requires
an accepted typed adjudication with evidence receipts and proof witnesses; conformance records bind that adjudication,
authority validation, applicability decision, subject digest, verification, verifier, witnesses, and evidence.

Known deviations are chronological overlays. Recording requires the original finding, assessment, authority, verifier,
issuer, scope predicate, subject, expiry, and invalidation conditions. Invalidation requires evidence and a reactivated
finding reference. Coverage categories are pairwise disjoint, and cross-epoch witness replay binds affected rules plus an
explicit compatibility decision.

Dedicated mutation tests now exercise the cross-field guards for authority-epoch compatibility, authority-witness replay,
subject snapshot ancestry, lane-plan rule ordering, applicability target facts, proof-witness receipts, and independent
candidate scoring. Each test accepts the coherent fixture, then changes only a real field to preserve closed shape and
primitive validity while violating the stem's semantic rule.

### Compatibility boundary

The pure compatibility hook returns `exact`, `compatible`, `migrate`, `pin-old-runtime`, `degraded`, or `blocked`.
Registered legacy migrations preserve the original record digest and deterministic upcaster fingerprint. Unknown stems and
versions, ambiguous or lossy conversions, and expired, rolled-back, or mixed authority inputs return `blocked`; in-place
legacy mutations return `pin-old-runtime`.

### Contract pins

| Contract | SHA-256 |
|----------|---------|
| Shared event-envelope export | `87c50ebe979550fe2ac69be7eaf89a43d6fbfeb280d9a72e8fcba0ac59e1dd9b` |
| Authorized-ledger export | `5c5daca8f76752311478a905df6c7035a6eefcfb18bbd474bbbb6310d7d33315` |
| Replay-fingerprint export | `4bc262f52f155ef4efdd993f6193fdd40558f07429b67244496bb70a4807bc90` |
| Deep Review shared payload contract | `eb588e451e91501be56d1bd34dbecdb3f3e36ad3c502307ca9519412a74f10d4` |
| Deep Alignment vocabulary manifest | `f68c4c5cb2e28e0984fb92335bce4dd516b6720c8024468ddeffdc4837c9b7ff` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-alignment-ledger-schema/deep-alignment-ledger-types.ts` | Created | Stems, shared mapping, scopes, value objects, payload contracts, compatibility types, and exported union |
| `runtime/lib/deep-alignment-ledger-schema/deep-alignment-ledger-schema.ts` | Created | Closed validators, shared-contract delegation, payload digests, registry, and envelope preparation |
| `runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts` | Created | Pure fail-closed compatibility decisions and registered legacy upcasters |
| `runtime/lib/deep-alignment-ledger-schema/index.ts` | Created | Stable public boundary for sibling consumers |
| `runtime/tests/unit/deep-alignment-ledger-schema.vitest.ts` | Created and extended | Full-stem authorization, parity, guard-specific mutation rejection, conformance, deviation, and compatibility coverage |
| Leaf packet docs | Updated | Complete status, verification evidence, contract pins, and sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module remains dark and has no authoritative writer integration. Tests prepare current envelopes, authorize them with
the real `TransitionAuthorizationGateway`, append them with `AppendOnlyLedger.appendAuthorized`, and read them through
verified ledger storage. Shared events additionally pass through the real Deep Review payload factory, so parity is
executable rather than asserted by duplicated shape tables. No golden schema, Deep Review source, shared envelope,
authorized ledger, replay primitive, legacy writer, reducer, projection, report generator, certificate, rollback, or mode
gate changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Validate shared payloads through Deep Review’s factory | The parity fence should fail when the shared backbone drifts; copied validators could diverge silently. |
| Keep authorization references in durable ledger frames | The frozen gateway and ledger own policy freshness and durable decision references; a mode payload must not create a second authority surface. |
| Require authority validity before conformance | Parseable authority data can still be expired, rolled back, mixed, unsigned, or insufficiently tested. |
| Keep observations and candidates non-verdict-bearing | Detector output is evidence, not publication authority; typed verification and adjudication provide the decision boundary. |
| Keep conformance, severity, impact, and confidence orthogonal | No scalar score can substitute for a discrete authority disposition or its proof bindings. |
| Represent deviations as append-only overlays | Authority, verifier, subject, scope, or expiry drift must reactivate the original finding without erasing history. |
| Fail closed on unsafe compatibility | Missing identity, unknown versions, ambiguity, loss, expiry, rollback, and mixed authority cannot safely manufacture typed facts. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 23 tests; seven guard-specific cases added to the 16-test baseline |
| Cross-field guard falsifier | PASS: disabling only the seven targeted `isExtensionData` branches made exactly the seven new tests fail because their crafted-bad calls no longer threw |
| All-stem matrix | PASS: 41/41 stems authorize, append, and read back with durable authorization references |
| Shared-backbone parity | PASS: 21/21 mapped payloads validate through the real Deep Review factory |
| Closed-shape and immutable-body probes | PASS: missing IDs, absent prior hash, payload tampering, mutable bodies, prose selectors, and in-place updates reject before append |
| Authority and adjudication gates | PASS: invalid authority cannot produce conformance; raw observations/candidates cannot carry verdicts; severity requires accepted proof-bearing adjudication |
| Compatibility and producer path | PASS: all six compatibility classes covered; registered legacy row preserves source/upcaster digests and passes real authorize/append/readback |
| Whole-runtime TypeScript | SKIPPED by explicit lane instruction; a separate batched TypeScript run owns this gate |
| Scope audit | PASS: this coverage pass changes only the unit suite and this leaf’s docs; no `runtime/lib` file changed |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after the coverage evidence and generated metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or projection.** The next sibling must fold `DeepAlignmentLedgerEvent` without widening closed payloads.
2. **No authoritative writer.** The existing Deep Alignment path remains unchanged and authoritative.
3. **No sealed artifact or certificate.** Payloads carry immutable references, digests, receipts, and locators only.
4. **No resume adapter, shadow parity, rollback switch, authority cutover, or mode gate.** Later siblings own those concerns.
5. **Legacy migration is narrow.** Records without stable run, session, authority epoch, iteration, and lane identity pin to the old runtime.
<!-- /ANCHOR:limitations -->
