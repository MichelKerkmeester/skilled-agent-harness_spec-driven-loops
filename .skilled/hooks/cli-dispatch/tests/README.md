---
title: "Dispatch Tests: DSH Adapter Parity and Policy Suite"
description: "node --test suite that checks both DeepSeek Harness dispatch adapters against the shared cores and asserts their opposite error policies."
trigger_phrases:
  - "dsh dispatch tests"
  - "dispatch adapter parity tests"
  - "dispatch fail-closed tests"
version: 1.0.0.0
---

# Dispatch Tests: DSH Adapter Parity and Policy Suite

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/tests/` holds the cross-cutting test suite for the two DSH dispatch adapters. The suite imports the real rule engine, the real audit core and both adapters. It drives them through the shared DSH test helpers in `../../shared/tests/dsh-plugin-harness.mjs`.

DSH registers both adapters through `.dsh/plugins/repo-guards/index.mjs`, which imports them from the adapters folder beside it.

The suite also proves that the preflight reads this checkout's hard rules. That holds when the session runs outside the checkout. That is the normal case for a DSH lineage folder.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-dispatch.test.mjs` | The `node --test` suite. It drives both adapters and both shared cores through the shared DSH test helpers. |

The suite covers these behaviors:

- Audit parity: the core reports `kind: 'none'` for a non-dispatch command and the adapter returns `accept`.
- Preflight parity: a command with no violations gets `allow`.
- Outside-checkout lookup: `dsh --profile headless --json -` is denied even when the session `cwd` sits outside the checkout.
- Audit throw policy: a throwing core still returns `accept` and logs one warning.
- Preflight throw policy: a throwing core returns `deny`, logs one error and never calls `next()`.

The suite has no error path of its own. The shared helpers record log lines. The test records whether `next()` ran.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/tests/dsh-dispatch.test.mjs
```

Expected result: `pass 5` and `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../dsh/dispatch-preflight-lint.mjs`](../dsh/dispatch-preflight-lint.mjs): the fail-closed adapter under test.
- [`../dsh/dispatch-audit.mjs`](../dsh/dispatch-audit.mjs): the fail-open adapter under test.
- [`../../README.md`](../../README.md): the unified hooks tree this concern lives in.
