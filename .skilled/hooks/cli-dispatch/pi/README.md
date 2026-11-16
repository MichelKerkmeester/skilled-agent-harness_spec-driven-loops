---
title: "Pi Dispatch Hooks: Authorized Preflight and Audit Extensions"
description: "Pi extensions that authorize a bash dispatch from the operator's own request, lint it against hard rules and record the completed command."
trigger_phrases:
  - "pi dispatch preflight"
  - "pi dispatch audit"
  - "pi dispatch authorization"
version: 1.0.0.0
---

# Pi Dispatch Hooks: Authorized Preflight and Audit Extensions

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/pi/` holds the Pi extensions for the dispatch concern. Pi is the only runtime with an authorization layer on top of the hard-rule lint. A direct dispatch must be authorized by the operator's own request.

The preflight captures the raw user input at `input` and evaluates the command at `tool_call`. The real TypeScript files live here, and `.pi/extensions/` holds the one-line entry files Pi discovers.

The hook registry names `dispatch-preflight-lint.ts` and `dispatch-audit.ts` as Pi's extension for the two dispatch hooks. The preflight runs while the `dispatch-guard` concern is on. The audit runs while `dispatch` is on.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.ts` | The Pi `input` and `tool_call` extension. It captures the operator's text only from an interactive or RPC `input` event, authorizes the dispatch and then runs the hard rules. |
| `dispatch-audit.ts` | The Pi `tool_result` extension. It records a finished `bash` dispatch through `recordDispatch` with the command, output, session and call ids, tagged `runtime: 'pi'`. |
| `dispatch-preflight-lint.test.ts` | The `vitest` suite for the preflight. It covers dispatch recognition, the authorization rules, quoted and negated mentions and the block and warn paths. |
| `directive-dedup.test.ts` | The `vitest` suite for the prompt advisor's directive dedup, which runs beside the preflight in a Pi session. |

The preflight reads the command word, then unwraps a wrapper or a heredoc a shell runs. One resolved packet under a none reading is a direct dispatch. Several resolved packets leave it ambiguous, and zero packets leave it a non-dispatch the hook ignores.

The preflight calls `shouldDenyPiDispatch`, then evaluates the hard rules of every resolved packet in the command. A deny returns `{block: true, reason}`. A warning returns `{reason}` and lets the command run. An authorized dispatch still answers to its skill's hard rules, so a missing stdin redirect blocks it.

Both Pi files fail open. The preflight returns `undefined` when its own lint throws, so unrelated work is not blocked. The audit swallows a throw, so a completed command is unaffected.

---

## 3. VALIDATION

Run from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.test.ts .skilled/hooks/cli-dispatch/pi/directive-dedup.test.ts
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the preflight and audit import.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`](../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts): the advisor whose directive dedup the second suite covers.
- [`../../../../.pi/extensions/README.md`](../../../../.pi/extensions/README.md): the entry files Pi discovers, one per extension.
