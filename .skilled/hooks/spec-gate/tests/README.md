---
title: "Spec Gate Tests: DSH Adapter Suite"
description: "Node test suite for the DSH Gate-3 classifier and enforcement adapters against the shared policy core."
trigger_phrases:
  - "spec gate dsh tests"
  - "dsh adapter parity tests"
  - "spec gate throw policy test"
version: 1.0.0.0
---

# Spec Gate Tests: DSH Adapter Suite

---

## 1. OVERVIEW

`.skilled/hooks/spec-gate/tests/` holds the `node --test` suite for the two DSH Spec Gate adapters. Each adapter runs through a fake plugin context and its result is compared with the shared policy core, so an adapter that drifts from the core fails here.

The suite imports `../dsh/spec-gate-classify.mjs` and `../dsh/spec-gate-enforce.mjs`. Both are symlinks to the runtime hook files. The DSH plugin registers those same files through its own `adapters/` folder.

Current state:

- The classify adapter fails open and the enforce adapter fails closed. The suite pins both.
- Only a message the operator typed is classified, never a notice a guard injected.

---

## 2. FILES

The folder holds no subfolders, so this table is the complete inventory.

| File | Responsibility |
|---|---|
| `dsh-spec-gate.test.mjs` | The `node --test` suite for both DSH adapters. |

---

## 3. BOUNDARIES AND FLOW

The suite loads each adapter the way the runtime does, through a symlinked module path that resolves to the same runtime hook file. It reads the shared core and the fake plugin context directly. It keeps no copy of either.

`adapterHarness()` from `../../shared/tests/dsh-plugin-harness.mjs` keeps one handler per event and records every warn and error line in `logs`.

| Boundary | Rule |
|---|---|
| Imports | The core comes from the runtime hooks library. Each adapter comes through its `../dsh/` symlink. The fake context comes from the shared tests folder. |
| Exports | The test file exports nothing. It reads `ERROR_POLICY` from each adapter. |
| Ownership | DSH adapter behavior belongs here. Core classification and enforcement cases live in the runtime core test instead. |
| Environment | A test that needs a switch passes its own `env` object. The throw tests leave `env` at the default, so `process.env` applies. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ operator prompt or guarded tool call     │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ agent/pre-step or tools/pre-execute      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ adapter handler from ../dsh/             │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ spec-gate-core.mjs                       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ notice, ask, deny or pass-through        │
╰──────────────────────────────────────────╯
```

The parity tests run the core and the adapter on the same input, then compare the results. Classification must leave the step as `enter` and add one notice. Enforcement on a child session must allow the call.

Classification reads only the last message whose `role` is `user` and whose `source.kind` is `user`. A notice from `repo-guards` is skipped even when it reads like a mutation request.

Each adapter declares its error policy through `ERROR_POLICY`. When the core throws, classification logs a warning and returns the downstream step. Enforcement logs an error and returns `deny` without calling the next handler.

Enforcement asks for `write` and `edit` only while the gate is open and its notice is undelivered. It records the delivery once, so the next call passes with `allow`.

`bash` and `apply_patch` stay guarded for the deny decision. Neither raises `ask`.

---

## 4. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/spec-gate/tests/dsh-spec-gate.test.mjs
```

Expected result: each test prints a passing line, the summary reports `fail 0` and the command exits 0.

---

## 5. RELATED

- [Spec Gate concern README](../README.md) covers the policy core, the switches and the runtime coverage table.
- [classify adapter](../dsh/spec-gate-classify.mjs) registers the `agent/pre-step` handler.
- [enforce adapter](../dsh/spec-gate-enforce.mjs) registers the `tools/pre-execute` handler.
- [core test suite](../../../skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs) covers classification and enforcement in the shared core.
- [DSH plugin entry](../../../../.dsh/plugins/repo-guards/index.mjs) registers both adapters for the runtime.
