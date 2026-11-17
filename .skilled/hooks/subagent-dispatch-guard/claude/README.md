---
title: "Claude Task Dispatch Guard: PreToolUse Adapters"
description: "The two Claude adapters for deep-loop dispatch policy and the Fable-model subagent guard."
trigger_phrases:
  - "claude task dispatch guard"
  - "fable subagent guard"
  - "claude deep loop guard"
version: 1.0.0.0
---

# Claude Task Dispatch Guard: PreToolUse Adapters

---

## 1. OVERVIEW

`.skilled/hooks/subagent-dispatch-guard/claude/` holds the Claude Code adapters for the Task Dispatch Guard concern. Both run at `PreToolUse`. `task-dispatch-guard.cjs` runs before a `Task` call and applies the shared policy in `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs`. A policy reject writes `permissionDecision: deny` with the core's reason. A warning writes `additionalContext` and leaves the permission decision alone. `fable-subagent-guard.mjs` runs before a `Task` or `Agent` call. While a Fable model drives the main loop, it denies a fork and a call with no model. It also denies a call whose model is not an Opus or Sonnet id.

`.claude/settings.json` registers both. The event is written as `"PreToolUse"`. The matchers are `Task` and `Task|Agent`, with a 5-second timeout on each entry. Both entries carry the same drift fallback. When the adapter is missing or `node` fails, the fallback prints `mk-hook-drift host=claude event=PreToolUse adapter=<name>` on stderr. It also prints one JSON line whose `additionalContext` asks Claude to rebuild the spec-kit runtime and whose `mkHookDrift` field is `true`. A checkout with no `.skilled/hooks` tree exits 0 before either runs.

Both adapters check their switch before they read stdin. They call `isHookEnabled('task-dispatch')`, so a disabled adapter never parses a payload. `task-dispatch-guard.cjs` imports `.skilled/hooks/shared/hook-flags.cjs` and `fable-subagent-guard.mjs` imports `.skilled/hooks/shared/hook-flags.mjs`, the ESM facade over the same resolver. The concern switch is `SYSTEM_TASK_DISPATCH_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch.

Every quiet path exits 0 with no output. The deep-loop guard returns at once for another tool name. A missing or invalid payload and a throw from `main` also exit 0 with no output. The Fable guard returns at once for another tool name or malformed stdin. It also returns when the transcript is missing or unreadable. The same happens when the main loop is not on a Fable model.

---

## 2. DIRECTORY TREE

The folder is flat, so this table names every entry beside the README. It holds no test file or subfolder. The suites sit in `.opencode/plugins/tests/`.

| File | Responsibility |
|---|---|
| `fable-subagent-guard.mjs` | The child-model adapter. It checks the switch, reads the last main-loop model from the transcript tail and skips sidechain entries. It denies a dispatch that would inherit Fable or leave the allowlist. |
| `task-dispatch-guard.cjs` | The shared-policy adapter. It checks the switch, reads the `Task` payload and calls `evaluateDispatch`. It writes the deny or the warning envelope. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs .opencode/plugins/tests/claude-fable-subagent-guard.test.cjs
```

Expected result: every test passes and the command exits 0.

The task dispatch suite pipes `PreToolUse` payloads into `task-dispatch-guard.cjs`. It checks the deny envelope and the warning path that emits `additionalContext` and appends to the shared log. The Fable suite writes transcript fixtures and checks each deny path. It also covers an allowed Opus or Sonnet dispatch and the fail-open paths.

---

## 4. RELATED

- [the task dispatch guard README](../README.md): the concern overview and its runtime table.
- [the shared policy core](../lib/subagent-dispatch-guard.cjs): the mode and loop-repeat rules the deep-loop guard calls.
- [the switch resolver](../../shared/hook-flags.cjs): the resolver behind `isHookEnabled`.
- [the ESM switch facade](../../shared/hook-flags.mjs): the module the Fable guard imports.
- [the stdin reader](../../shared/hook-adapter-shared.cjs): `readStdin`, used by both adapters, and `parseJsonFailOpen`, used by the deep-loop guard.
- [the Claude settings file](../../../../.claude/settings.json): the `PreToolUse` entries for both adapters.
- [the task dispatch suite](../../../../.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs): the payloads this adapter is checked against.
- [the Fable suite](../../../../.opencode/plugins/tests/claude-fable-subagent-guard.test.cjs): the transcript fixtures for the child-model guard.
