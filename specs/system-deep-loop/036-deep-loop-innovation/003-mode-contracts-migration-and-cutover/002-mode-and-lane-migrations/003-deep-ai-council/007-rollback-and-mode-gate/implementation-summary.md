---
title: "Implementation Summary: Deep AI Council Rollback and Mode Gate"
description: "The additive-dark Council migration gate re-derives readiness and protects non-destructive rollback without moving authority."
trigger_phrases:
  - "Deep AI Council rollback gate implementation"
  - "Deep AI Council migration readiness certificate"
  - "deep-ai-council rollback window"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Reverified the Council rollback gate at HEAD"
    next_safe_action: "Phase 014 may verify the readiness certificate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/rollback-switch.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The parity exit status is authenticated input but never the migration verdict."
      - "Rollback-window credit requires 14 days and five distinct execution identities."
      - "The gate remains additive-dark and cannot move authority."
      - "Seven substrate-handle limits remain phase-014 correlation boundaries."
---
# Implementation Summary: Deep AI Council Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-rollback-and-mode-gate |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Status** | Complete |
| **Runtime Surface** | `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/` |
| **Authority** | Additive-dark evidence only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The four-file `deep-ai-council-rollback-gate` module mirrors the landed golden gate surface: closed public types and schema constants, `DeepAiCouncilModeMigrationGate`, `evaluateDeepAiCouncilRollbackWindow`, `DeepAiCouncilRollbackSwitch`, and public exports. It imports only this mode's landed ledger, reducer, sealed-artifact, certificate, resume, and shadow-parity modules plus the frozen shared substrate. It does not import another mode's rollback gate.

The migration gate consumes the required parity receipt and mode-gate handoff but does not adopt either reported exit status. It parses the closed Council receipt, verifies its parity certificate and complete manifest binding, authenticates every stream and attestation against the immutable audit produced by the real `TransitionAuthorizationGateway`, reads all required Council artifact lifecycles through the real sealed-artifact reader, and drives `verifyDeepAiCouncilCertificateOffline`. The offline verifier replays the authorized ledger through the landed Council reducer and verifies the receipt chain, artifact dependency closure, test-gate evidence, and run certificate.

The gate binds exact version fields, the full health aggregate, complete Council resume semantics, ten distinct authenticated lifecycle identities, verified rollback-drill facts, classification digest, rollback anchor, and every final certificate field. A blocked caller-reported parity summary still produces a pass only when the underlying authenticated evidence independently re-derives readiness. A green receipt with missing authorization audit evidence, invalid replay, stale drill facts, missing lifecycle evidence, or a mismatched rollback anchor is denied.

The rollback-window evaluator requires both 14 elapsed calendar days and five successful authoritative executions. Repeated execution IDs, repeated certificate digests, and transitively connected identity aliases form one component and receive one threshold credit. Low traffic or unresolved evidence extends the window, and this leaf always emits `windowClosed: false`.

The rollback switch re-runs the complete mode gate and requires an exact certificate reproduction before calling the real transition gateway. Every declared request field is validated, gateway-bound, re-derived, or restricted to a closed value; unknown request keys fail closed. The canonical Council writer resource and complete stale lease are authorization-bound. The stale token must be a positive safe integer strictly below the new token issued above the real coordinator's durable high-water mark. Destructive intent and changed retention counts are denied before authorization.

### Files Changed

| File | Purpose |
|------|---------|
| `runtime/lib/deep-ai-council-rollback-gate/types.ts` | Closed gate, certificate, rollback-window, and rollback-switch contracts |
| `runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts` | Independent evidence re-derivation and deterministic readiness certificate |
| `runtime/lib/deep-ai-council-rollback-gate/rollback-switch.ts` | Exception-safe request binding, real gateway authorization, and real writer fencing |
| `runtime/lib/deep-ai-council-rollback-gate/index.ts` | Mode-local public exports |
| `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` | Real-substrate positive and adversarial verification |
| `decision-record.md` | Seven mirrored substrate-handle boundaries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation began from the complete golden four-file control flow rather than a reduced wrapper. Council-specific adaptations use the ten Council transition families, all eight sealed-artifact lifecycles, the Council test-gate certificate closure, the Council resume decision algebra, and the ten required Council fixture labels. The tests reuse the landed Council certificate fixture depth and add independent parity audit, rollback-drill, classification, health, request-binding, rollback-window, and fencing scenarios.

Every public entry is fail-closed. Malformed gate inputs and rollback requests, including circular references, non-finite values, forbidden or inherited prototypes, unknown fields, and wrong shapes, resolve to a typed non-green result or denial. Canonical serializer and validator exceptions do not escape the public methods.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-derive parity from receipt parsing and the real authorization audit | Reported green status cannot establish authorized evidence |
| Drive the landed offline certificate verifier and reducer replay | Certificate shape or digest consistency is not proof of valid replay |
| Bind the complete Council resume semantic view | Summary equality can hide branch, effect, invalidation, certificate, or test-gate drift |
| Require all eight artifact lifecycles | Council readiness includes critique, blinded judgment, artifact commit, and test-gate evidence |
| Deduplicate rollback executions by connected identity | Repeated rows or aliases cannot manufacture the five-execution threshold |
| Re-run the mode gate before rollback authorization | A self-consistent migration certificate is insufficient without its original evidence |
| Keep every authority mutation field false | Phase 014 alone owns any authority transition |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`: 32/32 in 517.85s using the requested runner config |
| Whole-runtime TypeScript | PASS: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0` exited 0 with zero diagnostics |
| Verdict re-derivation | PASS for blocked self-report, missing gateway audit anchor, and tampered replay |
| Complete request binding | PASS for changed and unknown consequential request fields |
| Rollback window | PASS for minimum days, minimum executions, and connected-identity deduplication |
| Rollback anchor | PASS for equality against the reverified migration certificate |
| Fencing | PASS for canonical resource identity, stale-lease structure, and strict token supersession |
| Never-throw boundary | PASS for circular, non-finite, inherited-prototype, unknown-field, null, and wrong-shape inputs |
| Additive-dark | PASS with `authorityMutation: false`, `ledgerAuthority: denied`, zero deletion, and zero rewrite evidence |
| Strict spec validation | Best-effort result recorded after metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Retained event and artifact counts are gateway-bound assertions; phase 014 must source them from the real stores.
2. Lifecycle rows authenticate distinct evidence identities, not unsupported one-to-one fixture semantics.
3. The full health aggregate is signed, but this leaf receives no signed observation history from which to re-derive it.
4. Resume evidence is fully compared and bound without a signed resume-reference store.
5. Rollback-window history is bound and deduplicated without an authoritative historical certificate store.
6. Shared-contract, write-set, and unresolved-risk completeness require phase-014 source correlation.
7. Historical lease identity is not recoverable from the coordinator API; only resource identity, complete tuple binding, and strict token supersession are proven here.
<!-- /ANCHOR:limitations -->
