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

`.skilled/hooks/cli-dispatch/tests/` holds the cross-cutting suite for the two DSH dispatch adapters. The folder carries no adapter of its own. The adapters sit in `../dsh/`. The cores they call sit in `../lib/`.

A case registers an adapter on a fake DSH context. It then calls the handler for its event and reads the verdict. The fake context records each log line, so a throw case can count them. The throw cases pass a core whose single method throws. That runs the adapter's catch block without a broken rule file.

DSH registers both adapters at load time through [the repo-guards bundle](../../../../.dsh/plugins/repo-guards/index.mjs), which imports them through links in its adapters folder.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-dispatch.test.mjs` | The `node --test` suite. It drives the audit and preflight adapters through the shared DSH test helpers and asserts each verdict and log line. |

The file imports the shared test helpers from `../../shared/tests/dsh-plugin-harness.mjs`.

The suite runs parity cases and throw cases. A parity case compares an adapter with the core it calls, using a command that breaks no rule. A throw case gives the adapter a core that fails and reads what the adapter does with the failure.

The audit exports `ERROR_POLICY` as `fail-open`. The preflight exports it as `fail-closed`. Each throw case asserts its own value before it fires the handler.

- The audit accepts `echo ready` with `kind: 'accept'` after `inspectDispatch` reports `kind: 'none'`.
- The preflight allows the same command with `kind: 'allow'` after `evaluateDispatch` returns no violations.
- The preflight denies `dsh --profile headless --json -` when the session `cwd` sits in a temp folder outside the checkout. The adapter reads the rules from its own path, not from the session.
- A throwing audit core returns the downstream result and logs one warning.
- A throwing preflight core returns `kind: 'deny'` and logs one error. The downstream handler never runs.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The real core and adapter modules, plus the shared test helpers. No runtime is started. |
| Test doubles | `adapterHarness()` supplies the context. `enabled` answers the switch check and `accept` or `allow` stands in for the downstream handler. |
| Scope | Both adapters act only on a `bash` call whose `command` is a string. Any other call goes to `next()`. |

A case follows one path.

```text
╭──────────────────────────────────────────╮
│ node --test                              │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ adapterHarness()                         │
│ fake context and recorded log lines      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ registerDispatchAudit                    │
│ or registerDispatchPreflightLint         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers.get('tools/pre-execute')        │
│ or handlers.get('tools/post-execute')    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ evaluateDispatch or recordDispatch       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ the adapter verdict                      │
╰──────────────────────────────────────────╯
```

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/tests/dsh-dispatch.test.mjs
```

Expected result: `pass 5` and `fail 0`, with exit status 0.

The suite reads no fixture files. The outside-checkout case builds a temporary folder with `tempDir()` and removes it in a `finally` block.

---

## 5. RELATED

- [The dispatch concern](../README.md) holds the adapters and their switches. Its runtime coverage table names each runtime entry.
- [The preflight adapter](../dsh/dispatch-preflight-lint.mjs) denies a blocking violation and logs an advisory for a warning rule.
- [The audit adapter](../dsh/dispatch-audit.mjs) records a dispatch-shaped command and fails open.
- [The hard-rule core](../lib/dispatch-rule-checks.mjs) resolves each dispatch and evaluates the skill rules.
- [The audit core](../lib/dispatch-audit.mjs) builds the scrubbed record and appends it to the log.
- [The shared DSH test helpers](../../shared/tests/README.md) build the fake context and the downstream handlers.
