---
title: "Executor audit"
description: "Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs."
trigger_phrases:
  - "executor audit"
  - "executor-audit.ts"
  - "audit executor"
  - "recursion guard"
  - "dispatch-failure emission"
version: 1.4.0.4
---

# Executor audit

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

This feature belongs to the executor group and is catalogued as F002 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

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
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F002
- Feature file path: `executor/executor-audit.md`
- Primary sources: `lib/deep-loop/executor-audit.ts`, `tests/unit/executor-audit.vitest.ts`
Related references:
- [executor-config.md](../../feature-catalog/executor/executor-config.md) — Executor config
- [fallback-router.md](../../feature-catalog/executor/fallback-router.md) — Fallback router
