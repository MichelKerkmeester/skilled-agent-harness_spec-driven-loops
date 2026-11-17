---
title: "Permission Policy Hook: Devin Permission-Request Policy"
description: "Devin adapter that checks write targets and command requests before returning an allow or deny decision."
trigger_phrases:
  - "permission request policy"
  - "devin permission hook"
  - "permission decision policy"
  - "devin permission request"
  - "devin approval adapter"
importance_tier: "normal"
contextType: "reference"
---

# Permission Policy: Devin PermissionRequest Decisions

---

## 1. OVERVIEW

`.skilled/hooks/permission-policy/` contains a Devin adapter for the `PermissionRequest` event. It returns a JSON envelope with an approval or denial.

The entry in `devin/permission-request-policy.mjs` is a symlink to [the Devin implementation](../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs). Devin registers that implementation in `.devin/hooks.v1.json`.

The concern key is `permission-policy`. `SYSTEM_PERMISSION_POLICY_DISABLED=1` turns it off. `SYSTEM_HOOKS_DISABLED=1` turns off every repository hook except the sk-git message gate, which has no off switch.

---

## 2. HOW IT WORKS

`evaluatePermission(payload)` requires `hook_event_name` to equal `PermissionRequest`. It also requires nonblank `tool_name`, `tool_use_id`, `session_id` and `prompt_id`.

With the policy enabled, `evaluatePermission(payload)` applies these tool classes.

| Tool class | Tool names | Allow rule |
|---|---|---|
| `write` | `apply-patch`, `apply_patch`, `edit`, `multiedit`, `patch`, `write` | `isExemptTargetPath` marks the target as exempt. |
| `exec` | `bash`, `exec`, `run-command`, `run_command` | `evaluate` returns no rule violations. |
| unknown | Any other tool name | Never. |

`evaluateWrite` reads `file_path` first. If that is blank, it checks `filePath` and then `path`. The adapter denies a missing target. It calls `isExemptTargetPath` from the shared spec-gate core. An exempt target returns `allow`.

`evaluateExec` requires a command. It loads the rules beside `cli-opencode/SKILL.md` with `readHardRules`, then calls `evaluate` from the dispatch core. Any returned violation produces `deny`. The loader returns an empty rule list if the rules file is missing, unreadable or malformed. With no rules, the adapter can approve the command.

Malformed JSON, incomplete identity, a missing input or a policy exception returns a deny envelope. An uncaught top-level error writes one line to stderr before returning that envelope.

When the concern is disabled, the adapter returns an allow envelope before it reads stdin.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | None | None | None | No output from this concern. |
| Codex | None | None | None | No output from this concern. |
| Cursor | None | None | None | No output from this concern. |
| Devin | `PermissionRequest` | `devin/permission-request-policy.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | JSON envelope with `decision` set to `approve` or `block` and `hookSpecificOutput.permissionDecision` set to `allow` or `deny`. |
| OpenCode | None | None | None | No output from this concern. |
| Pi | None | None | None | No output from this concern. |
| DSH | None | None | None | No output from this concern. |
| Vibe | None | None | None | No output from this concern. |

Claude registers hooks in `.claude/settings.json`. Codex uses `.codex/hooks.json`. Cursor uses `.cursor/hooks.json`. Devin registers this adapter under `PermissionRequest` in `.devin/hooks.v1.json` with an empty matcher and a 5-second timeout.

OpenCode loads plugin modules through the flat `.opencode/plugins/*.js` glob. Pi discovers `*.ts` entries in `.pi/extensions/`. DSH registers adapters through `.dsh/plugins/repo-guards/index.mjs`. Vibe registers hooks in `.vibe/hooks.toml`. Only Devin's registration points to this adapter.

---

## 4. DIRECTORY TREE

```text
permission-policy/
+-- README.md
`-- devin/
    `-- permission-request-policy.mjs
```

The Devin entry is a symlink to the implementation linked above. Devin's registration runs the implementation path directly.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| [Devin entry](devin/permission-request-policy.mjs) | Symlink for browsing to the adapter source. |
| [Devin adapter](../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs) | Reads the request, checks its identity and returns the decision envelope. |
| [Stdin helper](../../skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs) | Provides `readStdin` for the adapter. |
| [Write-target core](../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs) | Exposes `isExemptTargetPath` for write requests. |
| [Dispatch rules core](../cli-dispatch/lib/dispatch-rule-checks.mjs) | Exposes `readHardRules` and `evaluate` for command requests. |
| [CLI hard-rules file](../../skills/cli-external-orchestration/cli-opencode/hard-rules.json) | Holds the rules the adapter checks for exec requests. |
| [Hook switch resolver](../shared/hook-flags.cjs) | Resolves the concern switch and master switch. |
| [Devin hook settings](../../../.devin/hooks.v1.json) | Registers the `PermissionRequest` adapter. |
| [Policy tests](../../skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs) | Checks the allow and deny cases for the adapter. |

---

## 6. CONFIGURATION

The policy is enabled by default. The resolver treats `1`, `true`, `yes` or `on` as true in any case.

| Switch | Effect |
|---|---|
| `SYSTEM_PERMISSION_POLICY_DISABLED=1` | Turns off this policy. |
| `MK_PERMISSION_POLICY_DISABLED=1` | Legacy alias that also turns off this policy. |
| `SYSTEM_HOOKS_DISABLED=1` | Turns off every repository hook except the sk-git message gate. |

Set a switch in the shell or in `.skilled/hooks/hook-flags.env`. The resolver reads the environment first, then the file. Copy [the example](../hook-flags.env.example) to keep a local setting.

---

## 7. VALIDATION

The [permission policy test suite](../../skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs) checks write and exec decisions, malformed input, missing identity and unknown tool names.

Run this smoke check from the repository root.

```bash
printf '%s' '{"hook_event_name":"PermissionRequest","tool_name":"bash","tool_use_id":"t1","session_id":"s1","prompt_id":"p1","tool_input":{"command":"echo hi"}}' | SYSTEM_PERMISSION_POLICY_DISABLED=1 node .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
```

Expected result: the command prints an approval envelope for the disabled policy. The outer `decision` is `approve`. The nested `permissionDecision` is `allow`. Exit status is 0.

---

## 8. RELATED

- [Hooks index](../README.md): runtime coverage and switch index.
- [Dispatch hook docs](../cli-dispatch/README.md): the shared command rule checks.
- [Shared hook docs](../shared/README.md): the switch resolver.
- [Devin hook settings](../../../.devin/hooks.v1.json): the adapter registration.
