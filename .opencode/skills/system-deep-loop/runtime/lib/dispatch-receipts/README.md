---
title: "Dispatch Receipts"
description: "Records a durable, integrity-checked receipt before a dispatch crosses the process-spawn boundary, so a resumed session can recognize an already-launched run."
---

# Dispatch Receipts

---

## 1. OVERVIEW

Launch-boundary substrate for `system-deep-loop` dispatch. The barrier resolves, authorizes and durably appends a receipt before a spawn call is allowed to cross the process boundary. The fingerprint module confirms the receipt still matches the adapter invocation that produced it. The resume projection folds only ledger-verified events into one exact receipt slot so a resumed session can tell whether a launch already happened.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `dispatch-barrier.ts` | `dispatchWithDurableReceipt`, resolving, authorizing, durably appending and only then crossing the spawn boundary |
| `errors.ts` | `DispatchReceiptError`, the bounded fail-closed error that never retains raw launch material |
| `event-contract.ts` | `isDispatchReceiptPayload`, the closed, secret-excluding version-one payload check |
| `evidence.ts` | `dispatchReceiptEvidenceFromVerified`, parsing one verified event and retaining only stable sibling-facing evidence |
| `fingerprint.ts` | `verifyAdapterInvocationFingerprint`, recomputing the producing adapter's version-one bytes and retaining its original digest unchanged |
| `identity.ts` | `assertDispatchIdentity`, requiring a bounded identity that cannot contain raw structured input |
| `index.ts` | Public API surface |
| `integrity.ts` | `createProcessLocalDispatchReceiptMacProvider`, an advisory MAC provider whose key cannot be reconstructed after process loss |
| `resume-projection.ts` | `projectVerifiedDispatchReceipt`, folding only ledger-verified events into one exact dispatch receipt slot |
| `types.ts` | Shared dispatch receipt type definitions |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/result-envelopes/resume-reducer.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/policy.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/legacy-compatibility.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`authorized-ledger`](../authorized-ledger/README.md)
