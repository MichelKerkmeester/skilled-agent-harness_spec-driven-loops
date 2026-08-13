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
    last_updated_at: "2026-07-21T02:08:42Z"
    last_updated_by: "codex"
    recent_action: "Closed execution-ownership and confirmation-integrity failures with adversarial coverage"
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
| `types.ts` | Closed receipt, certification, intent, confirmation, adapter, claim, recovery, operator-resolution, and fenced-writer contracts. |
| `event-contracts.ts` | Twelve registered phase/mode boundaries plus seven validator-bound ledger event types and full intent-to-confirmation binding. |
| `authorized-writer.ts` | The single service-owned route from transition authorization through fenced expected-head append to verified read-back. |
| `certification.ts` | Immutable exact-profile provider registry and provider-owned restart-verifiable HMAC certification. |
| `boundary-receipts.ts` | Post-result issuance, stable identity, exact-repeat deduplication, fact conflict detection, and full receipt verification. |
| `effect-adapters.ts` | Logical subprocess, atomic file, and provider-idempotent API adapters with explicit reconciliation capabilities. |
| `effect-gateway.ts` | CAS-winner execution ownership, committed-request execution, externally reconciled confirmation, bounded recovery, and replay-safe operator resolution. |
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
| Subprocess | Logical invocation identity and durable outcome query; PID state is never accepted | Independent-writer contention proves one dispatch without provider deduplication, plus all four recovery verdicts |
| Atomic file | Target identity, expected prior digest, desired content digest, stable staging, fsync, atomic rename, and read-back | Independent-writer contention proves one adapter execution, plus all four recovery verdicts |
| API | Provider idempotency key plus status/read-after-write query | Ordering, response loss, request-binding conflict, capability refusal, and all four verdicts |

The gateway verifies authorization before intent append and treats the fenced expected-head append result as execution ownership. Only the append winner invokes the adapter; an idempotent-race caller waits for the winner's confirmation. The adapter receives the exact canonical request bytes committed by the intent, and every confirmation binds the actual intent event digest, effect ID, idempotency key, adapter identity, and declared postcondition. Confirmation creation and replay both require a conclusive external status query; a returned `verified` flag or digest tuple is not evidence by itself.

Crash fixtures cover before intent, after intent, interrupted execution, after target application, after confirmation, and bounded recovery retry. Operator resolution reconciles before any `confirmed_not_applied` execution, so a crash after recovery execution is repaired by status query rather than a second invocation. Successful `applied` and `not_applied` recovery records `terminal_status: confirmed`; `in_doubt` never auto-replays and `conflict` performs no gateway mutation.

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

The service composes the event envelope, authorized ledger, transition gateway, replay fingerprint, and the locks-and-fencing expected-head writer without changing those substrates. Every durable service event goes through `AuthorizedEvidenceWriter`; no convenience path calls the ledger directly.

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

- This hardening changes only the receipt/effect-recovery runtime directory, its focused unit test, and this leaf's documentation.
- It consumes the public fenced expected-head append from the locks-and-fencing substrate; this change does not modify that substrate or any existing writer.
- Existing writers and production selection points do not import the receipt/effect-recovery public index.
- The worktree already contained tracked sibling-service and substrate edits at baseline. Global `git status` is therefore not a leaf-scope proof; the before/after path delta and path-scoped diff are the authoritative scope evidence.

### Manual Test Playbook

1. Build a temporary ledger with the frozen event and policy registries. Issue all 12 boundary results and verify one following certified receipt per result.
2. Reconstruct the certification registry, verify the stored receipt, mutate a bound fact, and confirm fail-closed rejection.
3. Race independent gateway, writer, and coordinator instances against one shared ledger; confirm one subprocess/file adapter execution and one canonical confirmation.
4. Inject each crash cut, including after operator-resolution execution, then confirm recovery queries external state before any replay.
5. Present request bytes that differ from `canonicalInput`, and inject orphan, duplicate, or fact-mismatched confirmations; confirm fail-closed rejection.
6. Inspect ledger payloads for credentials, raw tokens, signing keys, unrestricted subprocess input, and API payloads. Only digests, bounded metadata, and secret references are permitted.
7. Confirm the legacy surface manifest remains `legacy-authoritative` and `observe-only`, and no production selection point imports the service.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|---|---|
| Make the fenced intent-append winner the execution owner | Process-local locks cannot prevent independent processes from invoking the same logical effect. |
| Execute the committed canonical request | An idempotency key for request A must never authorize execution of request B. |
| Require conclusive reconciliation before confirmation | Adapter-returned flags and digest strings do not prove external truth. |
| Validate the full intent-to-confirmation binding | A structurally valid orphan, duplicate, or reused confirmation must not certify another effect. |
| Reconcile operator retries before execution | A crash after recovery execution must converge through external state instead of re-executing blindly. |
| Treat process-local dispatch HMAC as advisory | Its secret is not a durable cross-resume trust root. |
| Keep legacy authority unchanged | This leaf is evidence and recovery infrastructure, not a production cutover. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Focused Vitest contract | PASS, exit `0`; 1 file and 56 tests, including 10 new adversarial cases |
| Runtime TypeScript project | PASS, exit `0`; `tsc --noEmit --composite false -p runtime/tsconfig.json` |
| Comment hygiene | PASS, exit `0`; all 11 service files and the focused test |
| OpenCode alignment drift | PASS, exit `0`; 11 files and 0 findings |
| Strict spec validation | PASS, exit `0`; Errors `0`, Warnings `0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark only.** No production effect path calls the service; a later migration phase must explicitly move authority.
2. **External guarantees depend on the adapter.** Winning the ledger CAS guarantees at-most-once logical gateway invocation. True external at-most-once additionally requires the adapter's own idempotency and conclusive external status/postcondition query; opaque outcomes remain `in_doubt`.
3. **Contention wait is bounded.** A losing caller waits for the winner's confirmation and fails as unresolved if the owner crashes before confirming; recovery must then reconcile the durable intent.

Rollback removes or disables dark service registration. Immutable dark evidence may remain; no legacy authority change needs reversal.
<!-- /ANCHOR:limitations -->
