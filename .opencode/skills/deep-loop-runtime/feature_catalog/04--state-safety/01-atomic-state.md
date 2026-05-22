---
title: "Atomic state"
description: "Writes JSON state files through temp-file, fsync, rename, and cleanup semantics."
---

# Atomic state

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

This feature belongs to the state safety group and is catalogued as F006 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/atomic-state.ts` | Runtime | Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Test | Primary regression coverage for Atomic state. |


---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F006
- Feature file path: `04--state-safety/01-atomic-state.md`
- Primary sources: `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`

