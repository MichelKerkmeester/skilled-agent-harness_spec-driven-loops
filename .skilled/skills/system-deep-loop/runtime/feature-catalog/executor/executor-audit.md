---
title: "Executor audit"
description: "Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs."
trigger_phrases:
  - "executor audit"
  - "executor-audit.ts"
  - "audit executor"
  - "recursion guard"
  - "dispatch-failure emission"
version: 1.4.1.0
---

# Executor audit

---

## 1. OVERVIEW

Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

This feature belongs to the executor group and is catalogued as F002 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning.

The synchronous runner sends the child's stdout to a file, never to a memory buffer, so a long stream-json run cannot fail with `ENOBUFS`. A caller names the file with `stdoutLogPath`; without one the runner uses a temporary file and removes it. The checks that follow, `onStdout`, `completionCheck`, the unavailable-marker scan and the opt-in model check, read the whole file up to 20 MB and its last 20 MB past that, cut at a line boundary. The terminal echo copies the file in chunks. The 10 MB `maxBuffer` now bounds stderr only. `dispatch-iteration.cjs` points the file at `iterations/iteration-NNN.out` and masks it with the fan-out lineage-log redactor after the run.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/executor-audit.ts` | Runtime | Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/executor-audit.vitest.ts` | Automated test | Primary regression coverage for Executor audit. |
| `tests/unit/executor-audit-process-group.vitest.ts` | Unit | Async process-group audit coverage. |
| `tests/unit/dispatch-failure.vitest.ts` | Unit | Dispatch-failure event coverage. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `executor/executor-audit.md`
- Primary sources: `lib/deep-loop/executor-audit.ts`, `tests/unit/executor-audit.vitest.ts`
Related references:
- [executor-config.md](../../feature-catalog/executor/executor-config.md) — Executor config
- [fallback-router.md](../../feature-catalog/executor/fallback-router.md) — Fallback router
