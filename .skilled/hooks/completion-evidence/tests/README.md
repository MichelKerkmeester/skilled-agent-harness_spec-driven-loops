---
title: "Completion Tests: DSH Adapter Parity Suite"
description: "node --test suite that checks the DSH completion-evidence adapter against the shared core and asserts its fail-open throw policy."
trigger_phrases:
  - "dsh completion tests"
  - "completion evidence parity tests"
  - "dsh completion fail-open tests"
version: 1.0.0.0
---

# Completion Tests: DSH Adapter Parity Suite

---

## 1. OVERVIEW

`.skilled/hooks/completion-evidence/tests/` holds one `node --test` suite for the DSH completion-evidence adapter. The suite imports the real shared core and the adapter. It builds a plugin context with the shared DSH test helpers. The suite then drives the `agent/turn-stopping` handler on that context.

The folder holds no runtime adapter. The per-runtime suites live with their owning skills. The DSH `repo-guards` bundle registers the adapter at `.dsh/plugins/repo-guards/index.mjs`. The suite calls the adapter's register function on a fake context instead.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-completion-evidence.test.mjs` | The `node --test` suite for the DSH adapter. |

The parity case feeds a message with no completion claim. The core returns false for that text, so the handler injects nothing. The throw case swaps in a core whose claim check throws. The handler logs one warning and injects nothing, while the suite asserts `ERROR_POLICY` is `fail-open`. The rig records log lines, so a case can assert on the warning count. Each case also stubs `inject` to catch a notice.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/completion-evidence/tests/dsh-completion-evidence.test.mjs
```

Expected result: both cases pass.

---

## 4. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../dsh/completion-evidence.mjs`](../dsh/completion-evidence.mjs): the adapter under test.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`](../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs): the shared core the parity case compares against.
