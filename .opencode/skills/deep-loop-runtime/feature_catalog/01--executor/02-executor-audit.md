---
title: "Executor audit"
description: "Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs."
---

# Executor audit

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

This feature belongs to the executor group and is catalogued as F002 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/executor-audit.ts` | Runtime | Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/executor-audit.vitest.ts` | Test | Primary regression coverage for Executor audit. |
| `tests/unit/executor-audit-process-group.vitest.ts` | Unit | Async process-group audit coverage. |
| `tests/unit/dispatch-failure.vitest.ts` | Unit | Dispatch-failure event coverage. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F002
- Feature file path: `01--executor/02-executor-audit.md`
- Primary sources: `lib/deep-loop/executor-audit.ts`, `tests/unit/executor-audit.vitest.ts`

