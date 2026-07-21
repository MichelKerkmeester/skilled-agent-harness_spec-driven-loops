---
title: "Implementation Summary: Receipts & Effect Recovery"
description: "Candidate evidence for dark certified boundary receipts and replay-safe external-effect recovery."
trigger_phrases:
  - "receipts and effect recovery implementation"
  - "receipt effect candidate report"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
    last_updated_at: "2026-07-21T00:42:48Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified dark boundary receipts and the effect-recovery gateway"
    next_safe_action: "Consume the dark service from a later authority-migration phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Receipts & Effect Recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 001-receipts-and-effect-recovery |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete (additive-dark) |
| **Candidate base SHA** | `d1a3f0323c3635f24c3560feaeda839522ececf0` |
| **Authority** | Legacy paths remain canonical until a later migration phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runtime can now certify every registered phase and mode boundary after its exact durable result, and it can recover interrupted external effects without guessing whether they already happened. The service stays dark: existing writers, production effect selection, and legacy recovery authority do not import or select it.

### Runtime Modules

| Module | Contract |
|---|---|
| `errors.ts` | Stable typed fail-closed error codes and phases. |
| `types.ts` | Closed receipt, certification, intent, confirmation, adapter, claim, recovery, and operator-resolution contracts. |
| `event-contracts.ts` | Twelve registered phase/mode boundaries plus seven validator-bound ledger event types. |
| `authorized-writer.ts` | The single service-owned route from transition authorization to single-use authorized append and verified read-back. |
| `certification.ts` | Immutable exact-profile provider registry and provider-owned restart-verifiable HMAC certification. |
| `boundary-receipts.ts` | Post-result issuance, stable identity, exact-repeat deduplication, fact conflict detection, and full receipt verification. |
| `effect-adapters.ts` | Logical subprocess, atomic file, and provider-idempotent API adapters with explicit reconciliation capabilities. |
| `effect-gateway.ts` | Authorization, intent-before-effect, verified confirmation, bounded recovery, claim/fence validation, and operator resolution. |
| `legacy-compatibility.ts` | Observe-only legacy surface manifest and advisory-only assessment of process-local dispatch MACs. |
| `replay-projection.ts` | Typed reducers and replay-fingerprint components for results, receipts, effects, recovery, conflicts, and operator evidence. |
| `index.ts` | Public service boundary. |

### Boundary Manifest

| Boundary | Result event | Positive and replay proof | Failure proof |
|---|---|---|---|
| `phase-enter` | `deep-loop.phase.entered` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `phase-pause` | `deep-loop.phase.paused` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `phase-resume` | `deep-loop.phase.resumed` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `phase-completion` | `deep-loop.phase.completed` | Matrix plus independent-issuer race | Tamper, unknown provider, advisory trust, and changed-facts conflict |
| `phase-abort` | `deep-loop.phase.aborted` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `phase-handoff` | `deep-loop.phase.handed-off` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `mode-enter` | `deep-loop.mode.entered` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `mode-pause` | `deep-loop.mode.paused` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `mode-resume` | `deep-loop.mode.resumed` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `mode-completion` | `deep-loop.mode.completed` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `mode-abort` | `deep-loop.mode.aborted` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |
| `mode-handoff` | `deep-loop.mode.handed-off` | Matrix issue, verify, and exact retry | Closed registry and result-contract rejection |

Every receipt follows its exact verified result, binds the prior and resulting ledger heads, and verifies after provider reconstruction. Changed result, evidence, signer profile, or logical receipt facts conflict.

### Effect Manifest

| Adapter | Idempotency and reconciliation | Positive, failure, and recovery evidence |
|---|---|---|
| Subprocess | Logical invocation identity and durable outcome query; PID state is never accepted | Normal confirmation, missing-query refusal, and all four recovery verdicts |
| Atomic file | Target identity, expected prior digest, desired content digest, stable staging, fsync, atomic rename, and read-back | Normal publication plus all four recovery verdicts |
| API | Provider idempotency key plus status/read-after-write query | Ordering, independent-gateway race, response loss, changed-input conflict, capability refusal, and all four verdicts |

The gateway verifies authorization before intent append, makes intent visible before invoking an adapter, and returns success only after durable confirmation. Crash fixtures cover before intent, after intent, interrupted execution, after target application, after confirmation, and bounded recovery retry. `in_doubt` never auto-replays; `applied` synthesizes confirmation; `not_applied` executes once with the original key; `conflict` performs no gateway mutation.

### Security, Replay, and Legacy Authority

Safe metadata rejects secret-bearing keys and secret-shaped values. Ledger events contain digests, bounded metadata, and secret references rather than raw inputs or credentials. Certification providers retain their keys; receipts store provider identity, signed digest, and signature bytes.

Typed reducers reproduce the same final replay fingerprint for the same ledger range. The five shipped recovery surfaces remain `legacy-authoritative` and `observe-only`; process-local dispatch HMACs remain advisory.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `runtime/lib/receipts-and-effect-recovery/` | Created | Dark service implementation and public API. |
| `runtime/tests/unit/receipts-and-effect-recovery.vitest.ts` | Created | Hermetic contract, crash, race, adapter, security, and replay matrix. |
| Leaf spec documents | Modified | Candidate evidence, completion state, and validation metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The service composes the frozen phase-006 event envelope, authorized ledger, transition gateway, and replay fingerprint without changing them. Every durable service event goes through `AuthorizedEvidenceWriter`; no convenience path calls the ledger directly.

### Frozen Candidate Evidence

| Evidence | SHA-256 |
|---|---|
| Phase-006 event-envelope source tree | `e369963b090d2c6b43fb2362a9a471dc678cf897b30bf587c61db25648c0c75b` |
| Phase-006 authorized-ledger source tree | `68262ccab3513a72887d3b15695ea87505859ca83195d7a97f06543c6710892f` |
| Phase-006 replay-fingerprint source tree | `22c9e71d1615506866edad18fef61b069cd612ff3bcb136e3d07e9ef381095a5` |
| Event-registry interface source | `d66cadd11792f1a2e21ec3ddf91f25b37c8bd25aa90d1bc10e06dd564eee00b1` |
| Policy-registry interface source | `aad9cbc11a47e22964632b4b3070261199f5f0348cd2f87ce462af5e65eac52d` |
| Authorization-gateway interface source | `458d8148725957d13f932025a9a3e6d8253d3a5f9d2789f65664b3f62e43129f` |
| Boundary manifest | `01dff3626efaefd3aa8505f00fb1be829f793692ef82cf2ffdabd3ea042a4491` |
| Boundary registry | `de24094d4902f7d282d8b3c4be42aaaf217cbcece7abfe7bcf093c0aaabdc48b` |
| Validator-bound event registry | `600172d3f7873bebc9a5daf9fbc1a014f7603b3c0ec34c5435cb85d26190ca39` |
| Transition-policy registry | `c27ef84d1e8f5d2feb3af74eb88fbc43b2eb713ddeaecb22e5990e6e89fcb0fd` |
| Certification-provider registry | `5bf2679ac682389e3c06ff7eb39ea66d72348006acb2bb91a4febdba4b477824` |
| Adapter manifest | `92ab27e1f61e8e2781e044cdf622653ceae2e7a11d8cbb6bc62e3d335718fcd3` |
| Legacy surface manifest | `b2e2686a5bbdd3a1f0b7af6715d68494fe16b88726a3c01d89ceba87d73823c8` |

The key-free manifest fixture uses fixed UTC timestamps from `2026-07-21T10:00:00.000Z` through `2026-07-21T10:03:00.000Z`. External targets live in temporary directories or in-memory fixtures.

### Additive-Dark Proof

- The leaf adds only the new service directory, one focused test, and leaf documentation changes.
- Path-scoped diffs for the consumed substrate and five legacy recovery surfaces are empty.
- Existing writers and production selection points do not import the new public index.
- Unrelated untracked sibling-leaf files appeared concurrently after the clean starting snapshot. This leaf neither modified nor consumed them; path-scoped evidence excludes them.

### Manual Test Playbook

1. Build a temporary ledger with the frozen event and policy registries. Issue all 12 boundary results and verify one following certified receipt per result.
2. Reconstruct the certification registry, verify the stored receipt, mutate a bound fact, and confirm fail-closed rejection.
3. Execute each hermetic adapter through the gateway and inspect verified event order: intent before invocation, confirmation before response.
4. Inject each crash cut, resume with a current claim/fence, and confirm the recovery verdict precedes retry or confirmation synthesis.
5. Present changed canonical input under the same logical effect identity and confirm a typed conflict with no second mutation.
6. Inspect ledger payloads for credentials, raw tokens, signing keys, unrestricted subprocess input, and API payloads. Only digests, bounded metadata, and secret references are permitted.
7. Confirm the legacy surface manifest remains `legacy-authoritative` and `observe-only`, and no production selection point imports the service.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|---|---|
| Keep all service events behind one authorized writer | Authorization and single-use append proof must remain inseparable. |
| Require conclusive reconciliation for replay-safe adapters | A local intent cannot prove whether an opaque external mutation committed. |
| Record recovery verdict before retry action | A second crash must reveal why a retry or confirmation synthesis was allowed. |
| Treat process-local dispatch HMAC as advisory | Its secret is not a durable cross-resume trust root. |
| Keep legacy authority unchanged | This leaf is evidence and recovery infrastructure, not a production cutover. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Focused Vitest contract | PASS, exit `0`; 1 file and 46 tests |
| Runtime TypeScript project | PASS, exit `0`; `tsc --noEmit -p runtime/tsconfig.json` |
| Leaf-focused strict TypeScript | PASS, exit `0`; public index plus focused test |
| Comment hygiene | PASS, exit `0`; all 11 service files and the focused test |
| OpenCode alignment drift | PASS, exit `0`; 11 files and 0 findings |
| Related shipped recovery slice | BASELINE, 5 files pass and 143/144 tests pass |
| Strict spec validation | PASS, exit `0` |

The related shipped slice has one known baseline failure: `fanout-salvage.vitest.ts` cannot import `better-sqlite3`. The operator assigned that dependency and the broader approximately 100-test runtime baseline to the phase-016 gate; this leaf's blocking test gate is the focused contract. No baseline dependency or fixture-name repair was attempted.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark only.** No production effect path calls the service; a later migration phase must explicitly move authority.
2. **External guarantees depend on the adapter.** Opaque outcomes become `in_doubt`; the gateway does not promise exactly-once behavior without target idempotency or conclusive reconciliation.
3. **Runtime baseline remains externally blocked.** The missing `better-sqlite3` dependency still fails one related shipped test and remains owned by the phase-016 gate.

Rollback removes or disables dark service registration. Immutable dark evidence may remain; no legacy authority change needs reversal.
<!-- /ANCHOR:limitations -->
