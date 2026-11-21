---
title: "Executor config"
description: "Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch."
trigger_phrases:
  - "executor config"
  - "executor-config.ts"
  - "configure executor"
  - "permission-mode normalization"
  - "deep-loop dispatch configuration"
version: 1.4.2.0
---

# Executor config

---

## 1. OVERVIEW

Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

This feature belongs to the executor group and is catalogued as F001 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization.

`EXECUTOR_ADAPTER_CAPABILITIES` sits beside `EXECUTOR_KIND_FLAG_SUPPORT` and records, for each executor kind, its binary, prompt channel (argv, stdin or a prompt file), log format, cost source, effort surface, sandbox surface and resume. Resume is artifact resume for every kind: no builder passes a model-session resume flag. A table-driven conformance test (`tests/unit/executor-adapter-capabilities.vitest.ts`) checks each CLI kind's record against its fan-out command builder (binary, prompt channel, log format, resume, effort and sandbox surface), every kind's cost source against the provider-cost reader, and the claude and codex records against the single-iteration dispatcher, so a builder that drifts from its record fails the test. The codex dispatcher case is skipped when the suite itself runs inside a codex session. The cost reader returns a cost only for opencode and claude; every other kind reads unknown, never zero.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/executor-config.ts` | Runtime | Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/executor-config.vitest.ts` | Automated test | Primary regression coverage for Executor config. |
| `tests/unit/executor-adapter-capabilities.vitest.ts` | Automated test | Conformance of each kind's capability record to the builders and the cost reader. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `executor/executor-config.md`
- Primary sources: `lib/deep-loop/executor-config.ts`, `tests/unit/executor-config.vitest.ts`
Related references:
- [executor-audit.md](../../feature-catalog/executor/executor-audit.md) — Executor audit
