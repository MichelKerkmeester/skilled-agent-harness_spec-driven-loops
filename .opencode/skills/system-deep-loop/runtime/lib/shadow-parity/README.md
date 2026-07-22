---
title: "Shadow Parity"
description: "Runs a candidate implementation against its legacy baseline and issues a parity certificate only when every case closes with zero divergence."
---

# Shadow Parity

---

## 1. OVERVIEW

Gates a cutover on proof, not confidence. A compiled case manifest runs each candidate path in shadow mode alongside its legacy baseline and compares terminal status, return value, error behavior and replay fingerprint. A parity certificate is issued only when every case in a mode closes with zero observed divergence. It carries the minimum successful-run and rollback-window guarantees a transition policy requires.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `index.ts` | Public API surface |
| `parity-case-manifest.ts` | Compiles baseline rows into an executable one-to-one case manifest |
| `parity-certificates.ts` | Issues and verifies parity certificates from a complete, zero-divergence case-result set |
| `shadow-parity-harness.ts` | Runs one case in shadow mode, recording intent without dispatching a live effect |
| `shadow-parity-types.ts` | Observation classes, divergence records and certificate type contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/`

It depends on `replay-fingerprint` and `sealed-reference-artifacts` for fingerprint verification and sealed-input binding.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/shadow-parity-harness.vitest.ts`

## 5. RELATED

- [`runtime/lib/replay-fingerprint/README.md`](../replay-fingerprint/README.md)
- [`runtime/lib/sealed-reference-artifacts/README.md`](../sealed-reference-artifacts/README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
