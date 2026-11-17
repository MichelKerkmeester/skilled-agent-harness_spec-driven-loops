---
title: "DSH Task Dispatch Guard: tools/pre-execute Adapter"
description: "Real DSH adapter that records shared deep-loop dispatch warnings for subagent hand-offs."
trigger_phrases:
  - "dsh task dispatch guard"
  - "dsh subagent hand off"
  - "dsh deep loop guard"
version: 1.0.0.0
---

# DSH Task Dispatch Guard: tools/pre-execute Adapter

---

## 1. OVERVIEW

`.skilled/hooks/subagent-dispatch-guard/dsh/` holds the DSH adapter for the task dispatch guard. It runs at `tools/pre-execute` for the `subagent` and `subagent_fork` tools. The adapter passes a new hand-off to the shared core and appends the warnings and audits it returns. They land in `guard-warnings.log` in `.skilled/skills/.state/loop-guard/` under the project directory. It reads those two lists and ignores `decision`. Every handled call ends in `next()`, so this adapter never denies a hand-off. It writes nothing to stdout.

DSH loads the adapter through the `repo-guards` bundle. `.dsh/patches/guards.patch.yml` inserts the plugin from `.dsh/plugins/repo-guards/index.mjs`. That file calls `registerTaskDispatchGuard`. The bundle reaches this folder through `.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs`, a relative link to `task-dispatch-guard.mjs`. The adapter registers itself with `ctx.on('tools/pre-execute', ...)`. The registration carries no matcher and no timeout. It adds no fallback around the call. No other runtime registers this file.

The adapter checks `isHookEnabled('task-dispatch')` before it registers a handler. A disabled concern registers no handler, so the adapter never sees a call. When the concern is on, it reads `exec.name` and then `exec.arguments`. A tool it does not judge passes at once. So does a call whose `action` or `resume` field holds a string. The prompt is the first non-blank of `prompt` or `task`. When both are blank, it is the first non-blank of `message` or `workflowScript`. A call with no prompt passes at once. The target identity is the first non-blank of `agent` or `agent_preset`. When both are blank, it is the first non-blank of `subagent_type` or `subagentType`. The project directory comes from `exec.agent.session.header.cwd`, with `process.cwd()` as the fallback.

The concern key is `task-dispatch`. Its switch is `SYSTEM_TASK_DISPATCH_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch. The `isHookEnabled` call resolves both switches through `.skilled/hooks/shared/hook-flags.mjs`. Every failure ends the same way. A core throw logs one `repo-guards task-dispatch-guard:` warning through the plugin logger. The call then goes to `next()`. A logger throw is swallowed. A write error never blocks a hand-off either. The core drops a warning it cannot write. An audit tries a second file beside the state folder.

---

## 2. DIRECTORY TREE

```text
dsh/
+-- README.md
`-- task-dispatch-guard.mjs
```

| File | Responsibility |
|---|---|
| `task-dispatch-guard.mjs` | The adapter. It checks the concern switch, calls the shared core for a new hand-off, records the warnings and audits, then passes the call on. |

The folder is flat and holds no test of its own. The module exports `registerTaskDispatchGuard` for the bundle and `ERROR_POLICY` set to `fail-open`. The suite that drives the adapter lives in `.skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs`.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs
```

Expected result: every test passes and the command exits 0. One case runs an unknown hand-off identity through the core and the adapter. Both allow the call. The other case reads the declared policy and makes the core throw. It checks that the call still allows and that one log line is written.

---

## 4. RELATED

- [the task dispatch guard concern](../README.md): its switch table and runtime coverage.
- [the shared core](../lib/subagent-dispatch-guard.cjs): the policy that judges a dispatch.
- [the switch resolver facade](../../shared/hook-flags.mjs): the module behind `isHookEnabled`.
- [the adapter suite](../tests/dsh-task-dispatch-guard.test.mjs): the cases that drive this file.
- [the repo-guards bundle](../../../../.dsh/plugins/repo-guards/index.mjs): the file that calls `registerTaskDispatchGuard`.
- [the bundle's adapter link](../../../../.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs): the relative link to this adapter.
- [the guards patch](../../../../.dsh/patches/guards.patch.yml): the patch that inserts the bundle.
