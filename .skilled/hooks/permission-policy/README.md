---
title: "Permission Policy Hook: Devin Permission-Request Policy"
description: "Devin-only adapter that responds to the PermissionRequest event with an allow/deny decision composed from the shared write-target and dispatch hard-rule cores. Fails closed, deny is the safe default."
trigger_phrases:
  - "permission request policy"
  - "devin permission hook"
  - "permission decision policy"
importance_tier: "reference"
contextType: "reference"
---

# Permission Policy Hook: Devin Permission-Request Policy

---

## 1. OVERVIEW

`permission-policy/` is the index for the adapter that answers Devin's `PermissionRequest` event with an allow-or-deny decision. `PermissionRequest` is the only dedicated approval-hook event any supported runtime exposes, Claude and Codex influence permissions through `PreToolUse` decisions, and Cursor, OpenCode, and Pi expose no separate approval event, so this concern is **Devin-only by design** (see the hub coverage matrix).

The adapter composes two existing shared cores rather than reimplementing policy: write-class tool calls delegate to `spec-gate-core`'s `isExemptTargetPath`, and exec-class tool calls delegate to `dispatch-rule-checks`' hard-rule evaluator. It is registered live in `.devin/hooks.v1.json`'s `PermissionRequest` array, replacing the prior empty-array registration that silently rejected every approval-needing tool call under non-interactive `devin -p` sessions.

The single most important property is that it **fails closed**: the opposite of the fail-open guards elsewhere in this tree. A malformed payload, an unparseable request, a missing identity field, a missing file path or command, an unknown tool class, or any internal evaluation error resolves to **deny**, because a `PermissionRequest` denial is the safe default. The only allow paths are an exempt write target, an exec command that violates no dispatch hard rule, or the kill-switch being explicitly disabled.

The real code lives in `system-spec-kit/runtime/hooks/devin/`; this folder holds a relative symlink into it.

---

## 2. WHAT IT DOES

On each `PermissionRequest` event, `permission-request-policy.mjs` reads a JSON payload from stdin and emits a decision envelope on stdout:

```json
{ "decision": "approve" | "block", "reason": "...", "hookSpecificOutput": { "hookEventName": "PermissionRequest", "permissionDecision": "allow" | "deny", "permissionDecisionReason": "..." } }
```

The decision flow:

1. **Kill-switch.** If `isHookEnabled('permission-policy')` is false (disabled), it emits `allow` with the reason "permission policy is disabled": the explicit escape hatch. The resolver itself is wrapped so that a *missing* resolver leaves the policy **enabled** (fail-closed), not disabled.
2. **Parse.** A payload that is not valid JSON → `deny`.
3. **Identity.** `hook_event_name` must be `PermissionRequest` and every required identity field (`hook_event_name`, `tool_name`, `tool_use_id`, `session_id`, `prompt_id`) must be non-blank. Otherwise → `deny`.
4. **Classify and evaluate:**

   | Tool class | Names | Evaluation | Allow when |
   |---|---|---|---|
   | `write` | `apply-patch`, `apply_patch`, `edit`, `multiedit`, `patch`, `write` | `evaluateWrite` reads the file path (`file_path` / `filePath` / `path`); delegates to `spec-gate-core.isExemptTargetPath(filePath, projectDir)` | The target path is exempt under the shared write-target policy |
   | `exec` | `bash`, `exec`, `run-command`, `run_command` | `evaluateExec` reads the command; delegates to `dispatch-rule-checks.evaluate(command, readHardRules(<cli-opencode SKILL.md>))` | The command violates no dispatch hard rule |
   | unknown | any other `tool_name` | — | Never: `deny` ("tool is not covered by a known policy class") |

5. **Failure.** Any exception inside `evaluatePermission` → `deny` ("policy evaluation failed closed"). An uncaught top-level error → `deny`.

A missing file path (`write`) or missing command (`exec`) is a `deny`, not a skip. The project dir resolves from `payload.cwd`, then `DEVIN_PROJECT_DIR`, then `process.cwd()`.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Devin** | `devin/permission-request-policy.mjs` (symlink → `system-spec-kit/runtime/hooks/devin/`) | `PermissionRequest` in `.devin/hooks.v1.json` | Decision envelope on stdout (`approve` / `block`); fails closed to `deny` |
| **Claude** | — | — | `by-design`: permission via `PreToolUse` decision, no dedicated permission-request adapter |
| **Codex** | — | — | `by-design`: permission via `PreToolUse` decision, no dedicated permission-request adapter |
| **Cursor** | — | — | `by-design`: no dedicated permission-request adapter |
| **OpenCode** | — | — | `by-design`: no dedicated permission-request adapter |
| **Pi** | — | — | `by-design`: no separate approval event beyond `tool_call` |

Only Devin exposes a dedicated approval event, so only Devin carries an adapter.

---

## 4. DIRECTORY TREE

```text
permission-policy/
+-- README.md
`-- devin/   permission-request-policy.mjs (symlink -> ../../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | The adapter. Parses the `PermissionRequest` payload, validates identity, classifies the tool as `write` / `exec` / unknown, delegates to the shared cores, and emits the decision envelope. Fails closed on every error path. |
| `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | The shared write-target policy core (`isExemptTargetPath`) that `evaluateWrite` delegates to. Not in this folder. |
| `hooks/dispatch/lib/dispatch-rule-checks.mjs` | The shared dispatch hard-rule evaluator (`evaluate`, `readHardRules`) that `evaluateExec` delegates to. Hard rules are read from `cli-external-orchestration/cli-opencode/SKILL.md`. Not in this folder. |
| `.opencode/hooks/shared/hook-flags.cjs` | The shared kill-switch resolver the adapter imports (`isHookEnabled('permission-policy')`). |

The hub entry under `devin/` is a relative symlink into `system-spec-kit`; edit the source, not the symlink.

---

## 6. CONFIGURATION

The policy is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_PERMISSION_POLICY_DISABLED=1` | Canonical kill-switch. When disabled, the adapter emits `allow` for every request (the explicit escape hatch). The resolver wrapper is fail-closed: a *missing* resolver leaves the policy enabled, not disabled. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Fails closed | Deny is the safe default. Malformed JSON, missing identity, missing file path or command, unknown tool class, or any evaluation error → `deny`. This is the opposite of the fail-open guards elsewhere in this tree. |
| Decision, not advisory | Emits a binding `approve` / `block` permission decision, not a warning. |
| Composed, not reimplemented | Write-class delegates to `spec-gate-core.isExemptTargetPath`; exec-class delegates to `dispatch-rule-checks.evaluate`. Policy lives in those shared cores and the `cli-opencode` hard rules. |
| Kill-switch is permissive | Disabling the kill-switch emits `allow`: the only way the policy broadens permissions. A missing resolver keeps the policy enabled (fail-closed). |
| Imports | Node builtins only, plus `../lib/spec-gate/spec-gate-core.mjs`, `../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs`, and the shared `hook-flags.cjs` via `createRequire`. Nothing outside the repo. |
| Real code | Stays in `system-spec-kit`; the hub entry is a relative symlink. |

---

## 8. VALIDATION

```bash
printf '%s' '{"hook_event_name":"PermissionRequest","tool_name":"bash","tool_use_id":"t1","session_id":"s1","prompt_id":"p1","tool_input":{"command":"echo hi"}}' | \
  node .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
echo "exit: $?"
```

Expected result: a JSON decision envelope (`{"decision":"approve"|"block",...}`) on stdout. The decision depends on the `cli-opencode` hard rules; `echo hi` approves when it violates no hard rule.

```bash
printf '%s' 'not-json' | \
  node .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
```

Expected result: a `{"decision":"block",...}` envelope with reason "request payload is not valid JSON" (fail-closed on malformed input).

```bash
printf '%s' '{"hook_event_name":"PermissionRequest","tool_name":"bash","tool_use_id":"t1","session_id":"s1","prompt_id":"p1","tool_input":{"command":"rm -rf /"}}' | \
  SYSTEM_PERMISSION_POLICY_DISABLED=1 node .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
```

Expected result: a `{"decision":"approve",...}` envelope with reason "permission policy is disabled" (kill-switch escape hatch).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../dispatch/README.md`](../dispatch/README.md): the dispatch hard-rule core this adapter's exec-class delegates to.
- [`../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/`](../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/): the write-target policy core this adapter's write-class delegates to.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapter uses.
