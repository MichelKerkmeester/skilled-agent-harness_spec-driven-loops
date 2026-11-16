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

`tests/` holds the `node --test` suite for the two DSH Spec Gate adapters. The suite imports `spec-gate-core.mjs` and drives both adapters through the fake plugin context in `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. It checks core parity, operator-only classification, the delivery record and the two throw policies.

DSH registers both adapters in `.dsh/plugins/repo-guards/index.mjs`, so the suite covers the files that runtime loads. The two adapters fail in opposite directions and the suite pins both. Classify logs a warning and returns the step unchanged, so the model step continues. Enforce logs an error and returns a `deny` verdict, so the tool call never runs.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-spec-gate.test.mjs` | The `node --test` suite for both DSH adapters. |

The suite fires `agent/pre-step` and `tools/pre-execute` through the fake context. Each parity test compares an adapter result with the shared core. Classification reads only a message the operator typed, never an injected notice. The throw tests pin `fail-open` for classify and `fail-closed` for enforce. The delivery test proves that an `ask` verdict records its notice once.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/spec-gate/tests/dsh-spec-gate.test.mjs
```

Expected result: every test passes and the command exits 0. A failed assertion exits non-zero.

---

## 4. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its runtime coverage table.
- [`../dsh/spec-gate-classify.mjs`](../dsh/spec-gate-classify.mjs): the classify adapter that the suite drives.
- [`../dsh/spec-gate-enforce.mjs`](../dsh/spec-gate-enforce.mjs): the enforce adapter that the suite drives.
- [`../../shared/tests/`](../../shared/tests/): the shared test helpers that build the fake plugin context.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the DSH plugin that registers both adapters.
