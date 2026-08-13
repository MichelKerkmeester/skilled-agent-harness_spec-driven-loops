---
title: "Implementation Summary: Canonical Dispatch Receipts"
description: "A new additive-dark dispatch barrier now records one authorized, durable pre-spawn receipt, preserves the phase-005 invocation fingerprint, and gives resume a verified three-valued projection without changing legacy execution authority."
trigger_phrases:
  - "canonical dispatch receipts implementation"
  - "durable pre-spawn receipt complete"
  - "dispatch receipt resume projection"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
    last_updated_at: "2026-07-21T04:08:00Z"
    last_updated_by: "codex"
    recent_action: "Verified additive-dark dispatch receipts"
    next_safe_action: "Integrate through a later authorized leaf"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/dispatch-barrier.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Canonical Dispatch Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-canonical-dispatch-receipts |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Execution Base** | `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Event Contract** | `lineage_dispatch_resolved` logical name; `lineage.dispatch.resolved` wire type; version 1 |
| **Inherited Interfaces** | Envelope v1; versioned type registry; authorized single-use gateway; append-only ledger; phase-007 authorized evidence writer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Dispatch now has a reusable dark-path barrier that cannot reach its spawn callback until configuration expansion, capability validation, manifest expansion, adapter resolution, fingerprint verification, transition authorization, durable ledger append, and verified readback have succeeded. The event records the original adapter fingerprint and safe launch digests. It never persists raw prompts, credentials, environment maps, or key material.

Resume reads only verified ledger frames. It classifies an absent receipt as eligible for first dispatch, an exact receipt plus verified successor result as resolved, and a receipt without a result as unresolved. The unresolved state suppresses blind respawn and exposes typed effect-recovery and successor-salvage handoffs.

### Runtime Contract

- `event-contract.ts` registers the closed version-one receipt payload with the existing envelope registry and owns canonical event construction.
- `fingerprint.ts` reproduces the phase-005 JSON byte order independently, compares the resulting fingerprint, and retains the adapter value unchanged.
- `dispatch-barrier.ts` accepts the existing phase-007 `AuthorizedEvidenceWriter`, then crosses the caller-supplied spawn boundary only after a fresh durable append.
- `resume-projection.ts` uses the existing `AppendOnlyLedger` verified reader and fails closed on corrupt, unauthorized, malformed, or unsupported evidence.
- `integrity.ts` reuses `canonicalReceiptJson`, `deriveReceiptKey`, `signReceipt`, and `verifyReceipt`. Process-local HMAC is explicitly advisory; durable labeling requires a provider that declares restart re-derivation support.
- `evidence.ts` exports stable receipt, dispatch, branch, fingerprint, sequence, event-hash, record-hash, and unresolved-classification fields for later siblings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/dispatch-receipts/dispatch-barrier.ts` | Created | Ordered resolution, authorized durable append, exact-retry suppression, and post-append spawn boundary |
| `runtime/lib/dispatch-receipts/errors.ts` | Created | Bounded typed failures for fingerprint, append, conflict, integrity, evidence, and recovery paths |
| `runtime/lib/dispatch-receipts/event-contract.ts` | Created | Version-one closed event schema, registry definition, and canonical builder |
| `runtime/lib/dispatch-receipts/evidence.ts` | Created | Typed sibling evidence and unresolved recovery/salvage handoff |
| `runtime/lib/dispatch-receipts/fingerprint.ts` | Created | Independent phase-005 fingerprint verification and safe digest extraction |
| `runtime/lib/dispatch-receipts/identity.ts` | Created | Stable receipt and idempotency identities derived from dispatch identity |
| `runtime/lib/dispatch-receipts/index.ts` | Created | Public additive-dark API |
| `runtime/lib/dispatch-receipts/integrity.ts` | Created | Honest ledger-only, advisory HMAC, and durable-provider verification profiles |
| `runtime/lib/dispatch-receipts/resume-projection.ts` | Created | Verified ledger projection and three-valued resume classification |
| `runtime/lib/dispatch-receipts/types.ts` | Created | Closed launch, event, barrier, evidence, handoff, and resume types |
| `runtime/tests/unit/dispatch-receipts.vitest.ts` | Created | Adversarial ordering, idempotency, crash, corruption, secret, and trust-root fixtures |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Reconciled implementation state and linked verification evidence |
| `implementation-summary.md` | Created | Recorded architecture, proofs, verification, and rollout boundary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is additive-dark. It adds a new library surface and hermetic tests but does not modify the phase-005 writers, pool, subprocess launcher, phase-006 envelope/ledger/authorization substrate, or phase-007 receipt/effect-recovery substrate. Every barrier result labels legacy execution as authoritative, and resume decisions label the verified ledger as evidence authority without activating them in production paths.

The test harness composes the real versioned registry, transition policy registry, authorization gateway, fenced writer, append-only ledger, and phase-007 authorized evidence writer. Spawn sentinels re-read the durable ledger before returning, so the ordering proof observes the committed frame rather than an in-memory flag.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the logical event name separate from the wire type | The frozen envelope registry requires a three-segment dotted wire type, while the leaf contract names the event `lineage_dispatch_resolved` |
| Require the concrete authorized writer and append-only ledger | Structural lookalikes could bypass authorization or verified replay; runtime instance checks preserve the frozen trust path |
| Derive receipt and idempotency IDs from dispatch identity only | Exact canonical retries must find the original slot, while changed payload bytes under that slot must conflict |
| Treat every idempotent dispatch retry as unresolved at the spawn boundary | A durable pre-spawn receipt proves intent, not subprocess start or completion; only verified successor evidence can resolve it |
| Keep the adapter fingerprint as the only invocation fingerprint | Independent normalization verifies the original bytes but does not mint or persist a competing fingerprint |
| Make HMAC optional and subordinate to ledger verification | Process-local secrets cannot establish restart authority; a durable provider must prove re-derivation capability before receiving a durable label |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:proofs -->
## Load-Bearing Proofs

### No Spawn Before Durable Append

The barrier calls `spawn` only after `AuthorizedEvidenceWriter.append` returns a verified append result. Tests inject failures at configuration, capability, manifest, adapter, authorization, pre-commit, and post-fsync/pre-publish cuts and observe zero spawn calls. All four executor kinds re-read one verified ledger event from inside the spawn sentinel.

### Fingerprint Byte Equality

The verifier reconstructs the exact phase-005 property order and uses `JSON.stringify` plus SHA-256, then compares the result with the adapter's `invocationFingerprint`. The verified facts retain the original string unchanged. Mutating kind, executable, executable version, model, effort, tier, sandbox, permission, search policy, argv, or prompt digest while retaining the promoted bytes produces `INVOCATION_FINGERPRINT_CONFLICT`.

### Idempotency and Conflict Detection

Sequential and concurrent exact retries converge on one ledger frame and return the original sequence, canonical-event hash, and record hash. Only one spawn occurs. Reusing the dispatch identity with changed canonical launch facts produces `DISPATCH_ID_CONFLICT` before a second spawn.

### Secret Exclusion

The persisted schema is a closed field allowlist. Raw prompt, credential, environment-secret, and run-master-secret canaries appear in ephemeral adapter inputs only; event bytes and the exported canonical MAC input contain none of them. The module contains no logging calls, and errors expose bounded identifiers or digests rather than launch material.

### Three-Valued Resume

Verified ledger absence returns `not_dispatched` and permits one first dispatch. An exact receipt plus verified successor result returns `result_recorded`. Receipt without result returns `unresolved`, suppresses first-dispatch eligibility, and emits typed `reconcile` plus `inspect-and-salvage` actions. Desired-fingerprint or result-binding drift returns a typed conflict that requires a new authorized dispatch identity. Malformed, unauthorized, unknown-version, hash-invalid, and MAC-invalid evidence returns `corrupt` and never becomes dispatch-eligible.
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canonical dispatch-receipt leaf suite | PASS, exit 0: 1 file and 26 tests |
| Leaf plus frozen receipt-crypto vectors | PASS, exit 0: 2 files and 37 tests |
| TypeScript typecheck | PASS, exit 0 |
| OpenCode alignment verifier | PASS, exit 0: 10 implementation files scanned, 0 findings |
| Comment hygiene | PASS, exit 0 for all 10 runtime modules and the test |
| Strict spec validation | PASS, exit 0: Errors 0, Warnings 0 |
| Scoped repository status | PASS: only the new dispatch-receipts module, its unit test, and this leaf's docs belong to this change |

### Exact Commands

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts
```

Result: `Test Files 1 passed (1); Tests 26 passed (26)`.

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts ../../system-deep-loop/runtime/tests/receipt-crypto.test.ts
```

Result: `Test Files 2 passed (2); Tests 37 passed (37)`.

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

Result: exit 0.

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --fail-on-warn --root .opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts --root .opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts
```

Result: exit 0; 10 files scanned; 0 errors, warnings, or findings.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts --strict
```

Result: exit 0; Errors 0; Warnings 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The barrier is not an exactly-once subprocess claim.** A receipt-only state remains unresolved until effect recovery or verified successor evidence establishes the outcome.
2. **Production execution is intentionally unchanged.** This leaf exposes the additive-dark contract and hermetic proof surface; a later authorized integration leaf must adopt it before production fan-out uses ledger-derived resume decisions.
3. **Process-local HMAC is advisory.** Durable cross-resume verification requires a registered provider that can reconstruct the same key after restart. The ledger remains the durable integrity authority in every profile.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

No runtime scope deviation. The leaf remained additive-only and did not modify existing writers or the phase-006/007 substrate. The shared worktree already contained unrelated changes outside this leaf; scoped status and diff inspection separate those pre-existing paths from this change.
<!-- /ANCHOR:deviations -->
