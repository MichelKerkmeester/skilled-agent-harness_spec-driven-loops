---
title: "Implementation Summary: Deep Research Typed Ledger Schema"
description: "The additive-dark Deep Research ledger boundary now exposes a typed event union, closed payload and scope contracts, and fail-closed legacy compatibility hooks for the reducer sibling."
trigger_phrases:
  - "deep research typed ledger implementation"
  - "deep research event union"
  - "deep research legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-21T17:16:43Z"
    last_updated_by: "codex"
    recent_action: "Rejected whitespace-only locator selectors"
    next_safe_action: "Fold the exported event union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Logical deep_research stems map explicitly to shared-envelope-compliant wire event types"
      - "Authorization references remain owned by durable ledger frames"
      - "Unknown legacy records and versions fail closed"
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
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy Deep Research JSONL remains authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Research now has a ratifiable ledger schema that the reducer sibling can consume without inheriting mutable JSONL shapes. The boundary covers all 23 lifecycle stems, binds each payload to a typed scope, prior-tail commitment, payload digest, and shared replay metadata, and sends every persisted event through the existing authorization gateway and append-only ledger.

### Typed ledger boundary

`DeepResearchLedgerEvent` is the discriminated union. `DeepResearchEventEnvelope` specializes the shipped `EventEnvelope` without introducing a parallel identity or authorization format. Logical `deep_research.*` stems map one-to-one to three-segment kebab-case wire event types accepted by the shared registry.

`ConvergenceDecisionData` now exports exact `RawConvergenceSignals`, `TrustedConvergenceSignals`, and `ConvergenceQualityGateResults` contracts. Raw signals contain three ratios plus an observation digest; trusted signals contain three ratios plus an assessment digest; quality results contain three bounded gate statuses, a policy version, and a result digest. Unknown keys and prose values are rejected before authorization or append. This is the complete event-input contract for `002-reducers-and-projections`; raw and trusted collections remain separate and the sibling must not widen them back to open JSON.

`DATA_FIELD_RULES` is now the single source for accepted DATA keys and their semantic validators across all 23 payloads. Digests and fingerprints use strict lowercase hex. Identifiers, references, versions, and codes use bounded ASCII system tokens; enum values are occurrence-specific; ratios and counts are range checked; arrays validate every member; nested value objects remain closed. Only explicit `*Reason` fields accept bounded explanation prose, now capped at 4,096 characters. There is no unconstrained string fallthrough.

The audit closed the missed lookalikes. `reasonCode` uses the 128-character code-token shape, while `admissionPolicyVersion`, `convergencePolicyVersion`, and `NextFocusSelectedData.policyVersion` use the version-token shape. `tieBreakKey`, `invalidationScope`, `route`, and `mergeMode` were the genuinely ambiguous scalar fields; they are stable code tokens. Locator selectors use a separate non-blank, single-line 2,048-character locator shape because URLs and selectors are neither identifiers nor human explanations.

### Legacy compatibility boundary

The pure compatibility hook returns `exact`, `compatible`, `migrate`, `pin-old-runtime`, or `blocked`. Registered legacy migrations preserve the original record digest and a deterministic upcaster fingerprint. Unknown record types and event versions return `blocked`; no hook guesses a payload shape or derives stable identity from mutable prose.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Created | Event stems, wire mappings, scopes, field-level payload contracts, and exported union |
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Created | Closed validators, payload digests, event registry, and envelope preparation |
| `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Created | Pure fail-closed legacy decision and upcast hooks |
| `runtime/lib/deep-research-ledger-schema/index.ts` | Created | Stable public module boundary for the reducer sibling |
| `runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Created | Authorization, replay-addressability, rejection, and compatibility matrix |
| Leaf packet docs | Updated | Completion state, evidence, contract resolutions, and sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The schema is dark and has no runtime writer integration. Tests construct current envelopes, authorize them with `TransitionAuthorizationGateway`, append them with `AppendOnlyLedger.appendAuthorized`, and read them back through the verified ledger boundary. No existing envelope, ledger, mode-contract, replay-fingerprint, JSONL writer, reducer, or projection file changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve logical stems and map them to compliant wire types | The shared envelope requires three lowercase kebab-case segments, while the leaf contract freezes `deep_research.*` names for mode consumers. An explicit one-to-one map preserves both contracts. |
| Keep authorization references in durable ledger frames | The shipped gateway and ledger already own receipt shape, freshness, and proof validation. Repeating that data in a mode payload would create a conflicting authority. |
| Carry a prior-tail commitment in the mode payload | This makes a candidate event rejectable before append while leaving `prev_record_hash` in the durable frame as the authoritative hash-chain field. |
| Keep source and report bytes outside payloads | Digest-bound source and passage selectors preserve replay and provenance without embedding mutable or instruction-bearing content. |
| Close convergence evidence collections | Exact numeric, status, policy-version, and digest fields prevent synonym keys from bypassing mutable-evidence checks while preserving raw-versus-trusted semantics. |
| Classify every DATA field by semantic kind | Accepted field names are derived from one exhaustive rule table, so a new field fails until its digest, token, enum, numeric, prose, array, or closed-object kind is declared. |
| Bound system tokens and explanation prose | References and versions use a 256-character ASCII token alphabet; codes use 128 characters; explicit `*Reason` prose uses 4,096 characters. `reasonCode` is a code, not an explanation passage. |
| Keep system-generated tokens ASCII-only | No legitimate reference in the additive-dark contract requires non-ASCII text. Display prose stays in explicit reason fields; a Unicode token need would require a versioned contract decision. |
| Pin lossy legacy behavior to the old runtime | Idea promotion, pause, and recovery events do not have lossless equivalents in this leaf. Pinning preserves behavior instead of inventing identities or reducer semantics. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 16 tests passed; Round-4 baseline was 15/15 |
| Locator selector discipline | PASS: ASCII-space and non-breaking-space-only selectors are rejected for both source and passage locator kinds before append; verified head remains sequence 0 and readback remains empty |
| Residual reproduction | PASS: a quoted passage over 2.7 KiB in `reasonCode` is rejected during preparation; verified head remains sequence 0 and readback remains empty |
| Policy-version family | PASS: prose is rejected in admission, convergence, and next-focus policy-version fields; legitimate version tokens authorize, append, and read back |
| Positive controls | PASS: legitimate reason codes, version tokens, and human `*Reason` explanations authorize, append, and read back byte-equivalent values |
| Classification completeness | PASS: all 23 valid fixtures pass with accepted fields derived from `DATA_FIELD_RULES`; representative digest, token, enum, array, numeric, timestamp, prose, and closed-object fields reject over-long narrative input |
| Authorized-ledger substrate | PASS: 20/20 tests, including `AUTHORIZATION_INVALID` for forged/replayed proofs and `EVENT_ID_CONFLICT`; denied capability still commits zero events |
| Runtime TypeScript project | PASS: project-pinned `tsc --noEmit -p runtime/tsconfig.json` exit 0 with zero errors |
| Comment hygiene scan | PASS: no packet, requirement, checklist, task, or decision IDs in code comments |
| Scope audit | PASS: implementation is limited to the new module, one unit suite, and leaf docs |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after generated-metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or projection.** The next sibling must fold `DeepResearchLedgerEvent`; this leaf intentionally provides no state reconstruction.
2. **No authoritative writer.** The existing JSONL path remains unchanged and authoritative.
3. **No sealed artifacts, certificates, resume adapter, parity harness, rollback switch, or gate.** Those remain owned by later siblings.
4. **Legacy migration is deliberately narrow.** Records without stable run, lineage, or iteration identity return `pin-old-runtime`; unknown records and versions return `blocked`.
5. **Admission reason codes are token-bounded, not yet enumerated.** The current spec does not define a complete value set; a later version may ratify an enum once producer vocabulary stabilizes.
<!-- /ANCHOR:limitations -->
