---
title: "Hermetic test isolation"
description: "Adds shared hermetic test environments so runtime tests can run in parallel without touching real HOME, temp, or database paths."
trigger_phrases:
  - "hermetic test isolation"
  - "hermetic-test-isolation"
  - "hermetic test isolation runtime"
  - "testing hermetic test isolation"
version: 1.4.0.15
---

# Hermetic test isolation

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds shared hermetic test environments so runtime tests can run in parallel without touching real HOME, temp, or database paths.

This feature belongs to the testing group and is catalogued as F048 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`createHermeticEnv()` returns an isolated HOME, DB path, tmp dir, child process environment, and cleanup function; fanout-run tests inject that environment per test and clean it after execution.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|


### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/helpers/spawn-cjs.ts` | Test | Primary regression coverage for Hermetic test isolation. |
| `tests/unit/fanout-run.vitest.ts` | Test | Primary regression coverage for Hermetic test isolation. |

---

## 4. SOURCE METADATA

- Group: Testing
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F048
- Feature file path: `testing/hermetic-test-isolation.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/007-testing/001-hermetic-test-isolation`
- Primary sources: `tests/helpers/spawn-cjs.ts`, `tests/unit/fanout-run.vitest.ts`
Related references:
- [testing](../testing/) — Testing category
