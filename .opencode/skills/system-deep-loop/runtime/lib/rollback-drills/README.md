---
title: "Rollback Drills"
description: "Runs fault-injected forward-detect-reverse-resume drills against an isolated sandbox ledger and certifies the rollback."
---

# Rollback Drills

---

## 1. OVERVIEW

Proves a cutover can be rolled back before anyone depends on that promise. A drill runs one complete forward-detect-reverse-resume cycle against an isolated sandbox ledger and injects a named fault such as a crash at the cut point, a timeout, a conflicting receipt or a fingerprint mismatch. It then records whether detection and reversal behaved correctly. A passing drill is signed into an immutable certificate that carries no key material.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `index.ts` | Public API surface |
| `rollback-certificate.ts` | Signs a completed drill's facts into an immutable certificate |
| `rollback-drill-contract.ts` | Validates drill manifests, in-flight dispositions and state reconstructions |
| `rollback-drill-ledger.ts` | Production-shaped ledger and authorization gateway bound to one isolated drill lane |
| `rollback-drill-runner.ts` | Executes one complete drill: forward run, fault injection, detection, reverse and resume |
| `rollback-drill-types.ts` | Fault fixtures, schema versions and manifest and state type contracts |
| `sandbox-authority-store.ts` | File-backed authority store scoped to a single sandbox directory for durable drill readback |

## 3. CONSUMERS

No sibling `runtime/lib` domain imports this yet. It depends on `replay-fingerprint`, `receipts-and-effect-recovery`, `authorized-ledger`, `legacy-projections` and `deep-loop/atomic-state`.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/rollback-drills.vitest.ts`

## 5. RELATED

- [`runtime/lib/README.md`](../README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
