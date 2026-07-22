---
title: "Receipts and Effect Recovery: Certified Boundaries and Idempotent Side Effects"
description: "Certifies boundary receipts and recovers idempotently from side effects across mode and phase boundaries, verified by replay."
---

# Receipts and Effect Recovery

---

## 1. OVERVIEW

Runtime primitives that certify mode and phase boundary transitions and recover idempotently from side effects (writes, external calls) in `system-deep-loop`. Boundary receipts are issued, HMAC-certified and appended only under a valid transition authorization. The effect gateway walks intent through confirmation, conflict, reconciliation and operator-resolved states so a retried effect never double-applies. A replay projection verifies the whole sequence deterministically. Legacy dispatch-receipt surfaces stay authoritative and are only shadow-observed here.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `authorized-writer.ts` | Appends ledger records only under a valid transition authorization |
| `boundary-receipts.ts` | Issues and verifies certified boundary receipts (mode or phase abort and similar) as ledger events |
| `certification.ts` | HMAC certification provider registry that signs and verifies boundary receipt certification envelopes |
| `effect-adapters.ts` | Replay-safe atomic filesystem effect adapters used by real side-effect execution |
| `effect-gateway.ts` | `EffectRecoveryGateway`: orchestrates effect intent, confirmation, conflict, reconciliation and operator-resolved events |
| `errors.ts` | Stable error codes for receipt and effect boundaries |
| `event-contracts.ts` | Ledger event type definitions and boundary registries for receipts and the effect lifecycle |
| `legacy-compatibility.ts` | Manifest of legacy-authoritative recovery surfaces the new service only observes, not replaces |
| `replay-projection.ts` | Replay component registry projecting receipt and effect ledger events for replay-fingerprint verification |
| `types.ts` | Boundary scope and action, plus effect intent, confirmation and recovery-verdict contracts |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/result-envelopes/`
- `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/`
- `.opencode/skills/system-deep-loop/runtime/lib/rollback-drills/`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/`
- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/`
- `.opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts`
