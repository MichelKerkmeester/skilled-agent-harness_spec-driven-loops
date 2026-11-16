---
title: "Permission Policy Hook: Devin Permission-Request Policy"
description: "Devin-only adapter that answers the PermissionRequest event with an allow-or-deny decision composed from the shared write-target and dispatch hard-rule cores. It fails closed, so deny is the safe default."
trigger_phrases:
  - "permission request policy"
  - "devin permission hook"
  - "permission decision policy"
  - "devin permission request"
  - "devin approval adapter"
importance_tier: "normal"
contextType: "reference"
---

# Permission Policy Hook: Devin Permission-Request Policy

---

## 1. OVERVIEW

`permission-policy/` indexes the adapter that answers Devin's `PermissionRequest` event with an allow-or-deny decision. Devin is the only runtime that carries one.

Devin is the only runtime whose approval event is not already covered by a `PreToolUse` deny. Claude and Codex gate permissions through `PreToolUse` decisions. Cursor and Pi expose no separate approval event. DSH has an `approval/request` waterfall, but its payload carries no tool arguments to judge. This concern is Devin-only by design. [`../README.md`](../README.md) holds the coverage matrix.

The adapter composes two shared cores rather than reimplementing policy. Write-class tool calls delegate to `spec-gate-core`'s `isExemptTargetPath`. Exec-class tool calls delegate to `dispatch-rule-checks`' hard-rule evaluator.

The adapter is registered live in `.devin/hooks.v1.json`'s `PermissionRequest` array. This repository runs Devin with `--permission-mode bypass`. Under bypass `PermissionRequest` never fires, so the adapter stays inert while `PreToolUse` still guards. A `devin -p` dispatch runs under the same bypass mode.

The most important property is that the adapter fails closed on its own error paths. That direction is the opposite of the fail-open guards elsewhere in this tree, on purpose. A denied approval is the safe default.

A malformed payload, a missing identity field, a missing file path or command, an unknown tool class or any internal error resolves to `deny`. The only allow paths are an exempt write target, a clean exec command or a disabled kill-switch.

The real code lives in `system-spec-kit/runtime/hooks/devin/`. This folder holds a relative symlink into it.

---

## 2. HOW IT WORKS

On each `PermissionRequest` event, `permission-request-policy.mjs` reads a JSON payload from stdin. It writes a decision envelope on stdout:

```json
{ "decision": "approve" | "block", "reason": "...", "hookSpecificOutput": { "hookEventName": "PermissionRequest", "permissionDecision": "allow" | "deny", "permissionDecisionReason": "..." } }
```

The decision flow:

1. **Kill-switch.** `isHookEnabled('permission-policy')` false emits `allow` with the reason "permission policy is disabled". That is the explicit escape hatch. The resolver call is wrapped, so a missing resolver leaves the policy enabled.
2. **Parse.** A payload that is not valid JSON becomes `deny`.
3. **Identity.** `hook_event_name` must be `PermissionRequest`. Every required identity field must be non-blank: `hook_event_name`, `tool_name`, `tool_use_id`, `session_id` and `prompt_id`. Anything else becomes `deny`.
4. **Classify and evaluate.** The tool name picks one of three classes.
5. **Failure.** Any exception inside `evaluatePermission` becomes `deny`. An uncaught top-level error also becomes `deny` and writes one line to stderr. Both paths give the reason "Permission denied: policy evaluation failed closed."

| Tool class | Names | Allow when |
|---|---|---|
| `write` | `apply-patch`, `apply_patch`, `edit`, `multiedit`, `patch`, `write` | The target path is exempt under the shared write-target policy. |
| `exec` | `bash`, `exec`, `run-command`, `run_command` | The command violates no dispatch hard rule. |
| unknown | Any other `tool_name` | Never. The adapter denies with "tool is not covered by a known policy class". |

`evaluateWrite` reads the file path from `file_path`, `filePath` or `path`. It delegates to `spec-gate-core.isExemptTargetPath(filePath, projectDir)`. `evaluateExec` reads the command and delegates to `dispatch-rule-checks.evaluate(command, readHardRules(<cli-opencode SKILL.md>))`.

A missing file path or a missing command is a `deny`, not a skip. The project dir resolves from `payload.cwd`, then `DEVIN_PROJECT_DIR`, then `process.cwd()`.

The decision is binding, not advisory. The adapter emits an `approve` or `block` permission decision rather than a warning.

Policy lives in the shared cores and in the `cli-opencode` hard rules. The adapter imports Node builtins only. It also imports `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` and `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`, which gives it `readStdin`. The shared `hook-flags.cjs` arrives through `createRequire`. Nothing comes from outside the repository.

`readHardRules` reads `hard-rules.json` beside `cli-external-orchestration/cli-opencode/SKILL.md`. It returns an empty rule list when that file is missing or unreadable, so an exec command then approves. Every other error path in the adapter denies.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Devin | `PermissionRequest [id permission-request-policy, timeout 5]` | `devin/permission-request-policy.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | A JSON decision envelope on stdout carrying `decision` and `hookSpecificOutput.permissionDecision`. |
| Claude | None | None | None | Nothing. `by-design`: permission runs through a `PreToolUse` decision, so a second adapter would duplicate it. |
| Codex | None | None | None | Nothing. `n/a`: Codex fires no permission event at all, so no approval hook exists. |
| Cursor | None | None | None | Nothing. `by-design`: no dedicated permission-request adapter. |
| OpenCode | None | None | None | Nothing. `by-design`: no dedicated permission-request adapter. |
| Pi | None | None | None | Nothing. `by-design`: no separate approval event beyond `tool_call`. |
| DSH | None | None | None | Nothing. `by-design`: `tools/pre-execute` already carries the spec-gate and dispatch decisions. |
| Vibe | None | None | None | Nothing. `by-design`: the dispatch runs `--auto-approve` behind the strict rendered guards. |

The registry id is `permission-request-policy`. The event is `PermissionRequest` and the timeout is 5 seconds. Devin registers the adapter in `.devin/hooks.v1.json`'s `PermissionRequest` array with an empty matcher. Devin is the only runtime that registers it.

The envelope carries `decision` as `approve` or `block`. It also carries `hookSpecificOutput.permissionDecision` as `allow` or `deny`, with the reason in `permissionDecisionReason`.

No registration names a path in this folder. The one link under `devin/` exists for browsing. Nothing loads through it.

---

## 4. DIRECTORY TREE

```text
permission-policy/
+-- README.md
`-- devin/    permission-request-policy.mjs -> ../../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | The adapter. It parses the payload, validates identity, classifies the tool and emits the decision envelope. |
| `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | The shared write-target core. `evaluateWrite` calls `isExemptTargetPath`. Not in this folder. |
| `hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | The shared dispatch hard-rule evaluator. `evaluateExec` calls `evaluate` and `readHardRules`. Not in this folder. |
| `.skilled/hooks/shared/hook-flags.cjs` | The shared kill-switch resolver the adapter imports. |

The hub entry under `devin/` is a relative symlink into `system-spec-kit`. Edit the source, not the link.

---

## 6. CONFIGURATION

The policy is enabled by default. A switch counts as set when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_PERMISSION_POLICY_DISABLED=1` | The canonical kill-switch. When it is set the adapter emits `allow` for every request, which is the explicit escape hatch. |
| `SYSTEM_HOOKS_DISABLED=1` | The master switch. It turns off this concern along with every other repository hook. |

The resolver wrapper is fail-closed. A missing resolver leaves the policy enabled rather than disabled.

`MK_PERMISSION_POLICY_DISABLED` also turns the policy off.

Set a flag inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for one session.

---

## 7. VALIDATION

Run these from the repository root.

```bash
printf '%s' '{"hook_event_name":"PermissionRequest","tool_name":"bash","tool_use_id":"t1","session_id":"s1","prompt_id":"p1","tool_input":{"command":"echo hi"}}' | \
  node .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
echo "exit: $?"
```

Expected result: a JSON decision envelope (`{"decision":"approve"|"block",...}`) on stdout. The decision follows the `cli-opencode` hard rules. `echo hi` approves when it violates no hard rule.

```bash
printf '%s' 'not-json' | \
  node .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
```

Expected result: a `{"decision":"block",...}` envelope with the reason "request payload is not valid JSON". That is the fail-closed path on malformed input.

```bash
printf '%s' '{"hook_event_name":"PermissionRequest","tool_name":"bash","tool_use_id":"t1","session_id":"s1","prompt_id":"p1","tool_input":{"command":"rm -rf /"}}' | \
  SYSTEM_PERMISSION_POLICY_DISABLED=1 node .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
```

Expected result: a `{"decision":"approve",...}` envelope with the reason "permission policy is disabled". That is the kill-switch escape hatch.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../cli-dispatch/README.md`](../cli-dispatch/README.md): the dispatch hard-rule core the exec class delegates to.
- [`../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/`](../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/): the write-target policy core the write class delegates to.
- [`../shared/README.md`](../shared/README.md): the kill-switch resolver the adapter calls.
- [`permission-request-policy.mjs`](../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs): the adapter itself.
