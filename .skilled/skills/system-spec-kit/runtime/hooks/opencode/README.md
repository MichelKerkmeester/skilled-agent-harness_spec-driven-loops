---
title: "OpenCode Spec-Gate Plugin: Gate-3 transport adapter"
description: "Browsability path to the OpenCode spec-gate plugin, which maps OpenCode transport events onto the runtime-neutral Gate-3 policy core."
trigger_phrases:
  - "opencode spec gate plugin"
  - "opencode hook adapter"
  - "spec gate deferral"
  - "opencode plugin hooks"
---

# OpenCode Spec-Gate Plugin: Gate-3 transport adapter

---

## 1. OVERVIEW

`opencode/` holds one file, `system-spec-gate.js`. It is the OpenCode transport adapter over the runtime-neutral Gate-3 policy core, kept here so it sits beside the other per-runtime hook folders.

The file is the same artifact as `.skilled/plugins/system-spec-gate.js`, which OpenCode loads. Its relative imports are therefore written against the plugins directory, not this folder: `../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` for policy and `../hooks/shared/hook-flags.cjs` for the kill switches. The file is real ESM, so it reaches the CommonJS flag module through `createRequire`.

| File | Responsibility |
|---|---|
| `system-spec-gate.js` | Default-exports the plugin factory. Parses OpenCode payloads, calls the core, formats the answer. Holds no policy. |

---

## 2. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Policy | Classification, evaluation and persistence belong to `spec-gate-core.mjs`. An adapter that decides a verdict has drifted. |
| Fail-open | Every hook catches its own errors and resolves to allow. Only a genuine `deny` from the core re-throws. |
| Advisory default | Classify opens the session gate and relays a one-shot deferral instruction. Enforce records telemetry. |
| Kill switches | `isHookEnabled('spec-gate')` gates every hook, and `SYSTEM_SPEC_GATE_DISABLED=1` makes the plugin a full no-op that never touches its inputs. |

```text
╭──────────────────────────────────────────────╮
│ OpenCode lifecycle event or tool call        │
╰──────────────────────────────────────────────╯
                      │
                      ▼
┌──────────────────────────────────────────────┐
│ system-spec-gate.js parses the payload       │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│ spec-gate-core.mjs returns a decision        │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│ Deferral text, a telemetry line or deny      │
└──────────────────────────────────────────────┘
```

---

## 3. HOOKS AND ENTRYPOINTS

| Entrypoint | Type | Behavior |
|---|---|---|
| `MkSpecGatePlugin` | Default export, async factory | Takes the OpenCode plugin context, resolves `ctx.directory` and the guard state directory, returns the hook object. |
| `event(input)` | Event hook | `session.created` sweeps stale gate state. `session.resumed`, `session.compacted` and `session.compact` advance the lifecycle epoch and rearm the one-shot notice, because a resume opens a new stretch of work. `session.deleted` evicts that session's state. |
| `experimental.chat.system.transform(input, output)` | System-transform hook | Reads the session's last user message through `ctx.client` when the hook input carries no prompt, runs `classifyIntent()`, then pushes `GATE_3_DEFERRED_INSTRUCTION` into `output.system` once per stretch of work. |
| `tool.execute.before(input, output)` | Tool hook | Runs `evaluateMutation()` for the mutating tool set and for `bash`, writes one telemetry line for every non-allow decision, and throws only when the core returns `deny`. |
| `MkSpecGatePlugin.__test` | Test surface | Exposes `extractPrompt`, `sessionIdFrom`, `fetchLastUserPromptViaClient`, `eventTypeFrom`, `sessionIdFromEvent` and `filePathFromArgs`. |

With `SYSTEM_SPEC_GATE_ENFORCE=1` set, a Write or Edit whose gate is open and unanswered is denied and the reason reaches the model. Bash stays advise-only on every path.

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/plugins/tests/system-spec-gate.test.cjs
```

Expected result: the regression suite reports every test passing. It loads the plugin and the core directly, needs no live OpenCode session, and pins the kill-switch ordering plus the normal deferral path.

---

## 5. RELATED

- [Hooks README](../README.md)
- [Spec-gate core README](../lib/spec-gate/README.md)
- [Plugins README](../../../../../plugins/README.md)
