---
title: "Replay Fingerprint"
description: "Derives and verifies a versioned, canonical fingerprint that commits an authorized ledger replay to its projection output."
---

# Replay Fingerprint

---

## 1. OVERVIEW

Deterministic replay-integrity primitive for the convergent-architecture runtime. It derives a canonical fingerprint that commits a ledger event range, the reducer and schema that consumed it and the runtime inputs the replay used. The result is hashed into one committed descriptor. A later verify call re-derives the fingerprint at the same version and compares it against the stored attestation, so a projection rebuild can be proven byte-identical to the original run.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `canonical-descriptor.ts` | Canonical field order, byte serialization and hashing for the fingerprint descriptor |
| `derive-replay-fingerprint.ts` | Replays ledger events through a registered reducer and hashes the resulting descriptor |
| `fingerprint-version-registry.ts` | Registry of every supported historical fingerprint-descriptor implementation |
| `index.ts` | Public API surface |
| `replay-component-registry.ts` | Registers the reducers, schemas and ledger-addressed inputs a replay is allowed to use |
| `replay-fingerprint-attestation.ts` | Writes and reads the fingerprint as a typed, authorized ledger event |
| `replay-fingerprint-types.ts` | Descriptor, error and consumer type contracts |
| `verify-replay-fingerprint.ts` | Re-derives a fingerprint at a stored version and compares it against an existing attestation |

## 3. CONSUMERS

Foundational primitive imported by most other `runtime/lib` domains. Direct consumers in this batch: `rollback-drills` (drill ledger harness), `shadow-parity` (harness and types) and `stream-fold-gauges` (gauge replay). It is also imported by `blinded-adjudication`, `claim-continuity`, `compatibility-shadow`, `contradiction-supersession`, `hierarchical-budgets`, `legacy-projections`, `locks-and-fencing`, `mode-contracts`, `path-coverage-termination`, `receipts-and-effect-recovery` and `semantic-communities`.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts`

## 5. RELATED

- [`runtime/lib/README.md`](../README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
