---
title: "Executor config"
description: "Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch."
trigger_phrases:
  - "executor config"
  - "executor-config.ts"
  - "configure executor"
  - "permission-mode normalization"
  - "deep-loop dispatch configuration"
version: 1.4.0.4
---

# Executor config

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

This feature belongs to the executor group and is catalogued as F001 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

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
- Feature file path: `executor/executor-config.md`
- Primary sources: `lib/deep-loop/executor-config.ts`, `tests/unit/executor-config.vitest.ts`
Related references:
- [executor-audit.md](executor-audit.md) — Executor audit
