---
title: "Claude Dispatch Hooks: Preflight Lint and Audit Pair"
description: "Claude Code PreToolUse and PostToolUse adapters that lint a composed CLI dispatch against hard rules and record a scrubbed audit line after it runs."
trigger_phrases:
  - "claude dispatch preflight"
  - "claude dispatch audit"
  - "claude bash dispatch lint"
version: 1.0.0.0
---

# Claude Dispatch Hooks: Preflight Lint and Audit Pair

---

## 1. OVERVIEW

`hooks/dispatch/claude/` holds the Claude Code pair for the dispatch concern. The preflight runs at `PreToolUse` on `Bash` and evaluates every dispatch in the command against the target skill's `hard-rules.json` sidecar. The audit runs at `PostToolUse` on `Bash` and appends one scrubbed JSONL line to the rotated dispatch log.

Both adapters call the runtime-neutral cores in `../lib/`. The preflight may deny, the audit never decides. Claude Code loads them from the `PreToolUse` and `PostToolUse` matchers in `.claude/settings.json`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-preflight-lint.mjs` | `PreToolUse` on `Bash` | Checks `isHookEnabled('dispatch-guard')`, calls `evaluateDispatch` and denies a `block`-severity violation with `permissionDecision: 'deny'`. A `warn` violation adds `additionalContext` and lets the normal permission flow continue. | Fails open. A non-dispatch command or an internal error exits 0 and approves silently. |
| `dispatch-audit-posttooluse.mjs` | `PostToolUse` on `Bash` | Checks `isHookEnabled('dispatch')` and the audit kill switch, then calls `recordDispatch` with the command, output and session metadata. It is observe-only and emits no permission decision. | Fails open. A missing payload, a parse error or an audit write failure exits 0 with no output. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../codex/README.md`](../codex/README.md): the Codex sibling pair.
