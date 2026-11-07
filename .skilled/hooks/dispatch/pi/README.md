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

`hooks/dispatch/pi/` holds the Pi extensions for the dispatch concern. Pi is the only runtime with an authorization layer on top of the hard-rule lint, because a direct dispatch must be authorized by the operator's own request. The preflight captures the raw user input at `input` and evaluates the command at `tool_call`.

The real TypeScript files live here, and `.pi/extensions/` holds the relative symlinks Pi discovers.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-preflight-lint.ts` | `input` and `tool_call` for `bash` | Captures interactive or RPC user text, resolves wrapped and shell-run dispatch shapes, runs `shouldDenyPiDispatch` authorization and then evaluates every resolved packet's hard rules. Returns `{block: true, reason}` on a deny and `{reason}` on a warning. | Fails open. A lint failure returns `undefined`, so unrelated work is not blocked. |
| `dispatch-audit.ts` | `tool_result` for `bash` | Imports the audit core, calls `recordDispatch` with the command, output, session and call ids and tags the record `runtime: 'pi'`. | Fails open. A throw is swallowed and the completed command is unaffected. |
| `dispatch-preflight-lint.test.ts` | `vitest` suite | Covers dispatch recognition, the authorization rules, quoted and negated mentions, and the preflight block and warn paths. | Not applicable. |
| `directive-dedup.test.ts` | `vitest` suite | Covers the prompt advisor's directive dedup behavior that runs beside the preflight in a Pi session. | Not applicable. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the preflight and audit import.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`](../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts): the advisor whose directive dedup the second suite covers.
