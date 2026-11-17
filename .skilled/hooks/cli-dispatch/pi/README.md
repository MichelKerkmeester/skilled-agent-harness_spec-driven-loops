---
title: "Pi Dispatch: Input, Tool Call and Tool Result Adapters"
description: "Pi extensions that authorize a bash dispatch from the operator's own request, lint it against hard rules and record the completed command."
trigger_phrases:
  - "pi dispatch preflight"
  - "pi dispatch audit"
  - "pi dispatch authorization"
version: 1.0.0.0
---

# Pi Dispatch: Input, Tool Call and Tool Result Adapters

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/pi/` holds the Pi adapters for the dispatch concern. The preflight checks that the operator's own request authorizes a `bash` dispatch, then checks the target skill's hard rules. The audit records a finished dispatch.

Pi discovers the adapters through `.pi/extensions/dispatch-preflight-lint.ts` and `.pi/extensions/dispatch-audit.ts`. Each entry file re-exports the adapter from this folder on a single line. The preflight calls `pi.on('input', ...)` and `pi.on('tool_call', ...)`. The audit calls `pi.on('tool_result', ...)`.

Both adapters read their switch first and return at once when the concern is off. The preflight checks `dispatch-guard`, whose switch is `SYSTEM_DISPATCH_GUARD_DISABLED`. The audit checks `dispatch`, whose switch is `CLI_DISPATCH_AUDIT_DISABLED`. `SYSTEM_DISPATCH_DISABLED` turns off both concerns. `SYSTEM_HOOKS_DISABLED` is the master switch, and these adapters reach it through the shared resolver at `.skilled/hooks/shared/hook-flags.mjs`.

At `input` from an interactive or RPC source the preflight captures the operator's text for the session. At `tool_call` it reads the `bash` command, resolves the dispatch and checks the stored text. A capsule or spec gate suffix in that text is stripped before the check. The audit reads the command and output of a finished `bash` call.

Every failure leaves the call alone. The preflight returns `undefined` when its own lint throws, so it blocks nothing. The audit swallows a throw, so a completed command is unaffected. A failed input capture is dropped and the turn continues.

---

## 2. DIRECTORY TREE

The folder is flat. The table names every entry other than this README.

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.ts` | The preflight adapter. It registers the `input` and `tool_call` handlers, decides whether the dispatch is authorized and then evaluates each packet's hard rules. |
| `dispatch-audit.ts` | The audit adapter. It registers the `tool_result` handler and passes a finished `bash` call to `recordDispatch` in `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs` with `runtime: 'pi'`. |
| `dispatch-preflight-lint.test.ts` | The vitest suite for the preflight. It drives the extension through a fake Pi API and covers the deny matrix, refusal phrasings, reset forms, next-sentence retraction and the registered handler boundary. |
| `directive-dedup.test.ts` | The vitest suite for the Pi prompt advisor's directive dedup. It imports the advisor at `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` and no dispatch adapter. |

---

## 3. VALIDATION

Run from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.test.ts
```

Expected result: every test passes and the command exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern and its per-runtime table.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the core that resolves a dispatch and records the audit line.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../../../../.pi/extensions/README.md`](../../../../.pi/extensions/README.md): the Pi entry files, one per extension.
