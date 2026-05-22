---
title: "Executor config"
description: "Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch."
---

# Executor config

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

This feature belongs to the executor group and is catalogued as F001 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/executor-config.ts` | Runtime | Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/executor-config.vitest.ts` | Test | Primary regression coverage for Executor config. |


---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F001
- Feature file path: `01--executor/01-executor-config.md`
- Primary sources: `lib/deep-loop/executor-config.ts`, `tests/unit/executor-config.vitest.ts`

