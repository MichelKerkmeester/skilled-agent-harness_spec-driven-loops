---
title: "Sealed Reference Artifacts"
description: "Content-addressed sealing, storage and lifecycle tracking for reference artifacts such as prompt sets, fixtures and configuration."
---

# Sealed Reference Artifacts

---

## 1. OVERVIEW

Gives replay and shadow-parity comparisons something stable to bind to. An artifact such as a prompt set, fixture, prior-run output or configuration value is canonicalized, digested and sealed once, then tracked through a lifecycle of sealed, superseded, retired and restored states with a retention sweep. A bound reference set proves that two runs consumed byte-identical inputs.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `artifact-events.ts` | Typed ledger events for artifact sealing and lifecycle transitions, plus verified-evidence reads |
| `artifact-reference-set.ts` | Binds sealed artifacts into one replay input and proves input equivalence for parity checks |
| `artifact-registries.ts` | Frozen canonicalizer and digest registries keyed by artifact kind and version |
| `artifact-retention.ts` | Derives lifecycle state, plans retention and sweep and restores artifacts from tombstones |
| `index.ts` | Public API surface |
| `sealed-artifact-store.ts` | Filesystem-backed store that seals, reads and validates artifact references |
| `sealed-artifact-types.ts` | Artifact kinds, versions and error contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/` (harness and types)
- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/`
- `.opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts`
- Also exercised by `mixed-version-fixtures.vitest.ts` and `shadow-parity-harness.vitest.ts`.

## 5. RELATED

- [`runtime/lib/README.md`](../README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
