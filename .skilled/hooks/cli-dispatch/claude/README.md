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

`.skilled/hooks/cli-dispatch/claude/` holds the Claude Code pair for the dispatch concern. The preflight runs at `PreToolUse` on `Bash` and reads every dispatch in the command. The audit runs at `PostToolUse` on `Bash` and records a dispatch that already ran.

The preflight holds each dispatch to the rules of the skill that dispatch names. Those rules sit in the `hard-rules.json` sidecar beside that skill's `SKILL.md`. A violation comes back as a denial or as an advisory.

The audit appends one scrubbed JSONL line to the rotated dispatch log. It observes a completed call and never decides, so it emits no permission decision.

Both adapters call the runtime-neutral cores in `../lib/` rather than their own copy. Claude Code loads them from the `PreToolUse` and `PostToolUse` matchers in `.claude/settings.json`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `PreToolUse` gate on `Bash`. It stops a dispatch that breaks its skill's hard rules. |
| `dispatch-audit-posttooluse.mjs` | The `PostToolUse` recorder on `Bash`. It writes one audit line for a dispatch that ran. |

The preflight checks `isHookEnabled('dispatch-guard')`, calls `evaluateDispatch` and denies a `block` violation with `permissionDecision: 'deny'`. A `warn` violation adds `additionalContext` and leaves the permission decision alone.

The audit checks `isHookEnabled('dispatch')` before it calls `recordDispatch`. `recordDispatch` returns early when `CLI_DISPATCH_AUDIT_DISABLED` is set to `1`, so no line is written. Otherwise it receives the command, the output, the session id, the tool call id and the tool response.

The preflight fails open, so an internal error approves silently and never blocks a call. A non-dispatch command or a missing payload also exits 0 with no output. The audit emits no permission decision at all, because it only observes. On any error it exits 0 with no output, an audit write failure included.

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls for every dispatch.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls to write its line.
- [`../codex/README.md`](../codex/README.md): the Codex sibling pair for the same dispatch concern and the same cores.
