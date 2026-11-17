---
title: "Spec Gate: Gate-3 Policy Core and Runtime Adapters"
description: "Asks for a spec folder before the first file mutation of a session, then remembers the answer. One policy core serves Claude, Codex, Cursor, Devin, DSH, OpenCode, Pi and Vibe, and each adapter picks its own channel for the question and the decision. Advisory by default. Deny is opt-in via SYSTEM_SPEC_GATE_ENFORCE, except on Vibe, whose pre_tool hook supplies the opt-in itself."
trigger_phrases:
  - "spec gate"
  - "spec gate claude hook"
  - "claude gate 3 classifier"
  - "claude spec gate enforce"
  - "spec gate codex hook"
  - "codex gate 3 classifier"
  - "codex spec gate enforce"
  - "spec gate cursor hook"
  - "cursor gate 3 prebind"
  - "cursor spec gate enforce"
  - "spec gate devin hook"
  - "devin gate 3 classifier"
  - "devin spec gate enforce"
  - "spec gate dsh hook"
  - "dsh gate 3 classifier"
  - "dsh spec gate enforce"
  - "spec gate opencode plugin"
  - "opencode gate 3 transform"
  - "opencode spec gate enforce"
  - "spec gate pi hook"
  - "pi gate 3 classifier"
  - "pi spec gate dialog"
importance_tier: "normal"
contextType: "reference"
---

# Spec Gate: Gate-3 Policy Core and Runtime Adapters

---

## 1. OVERVIEW

`.skilled/hooks/spec-gate/` tracks the Gate-3 spec-folder decision for a session before a repository write or edit. Its shared policy core is `spec-gate-core.mjs`. Each runtime adapter passes its input and output shape to that core.

The concern key is `spec-gate`. Its switch is `SYSTEM_SPEC_GATE_DISABLED`. The master switch is `SYSTEM_HOOKS_DISABLED`.

---

## 2. HOW IT WORKS

`classifyIntent()` uses the shared classifier and saves the session's gate state. It opens the gate when a turn triggers Gate 3. A valid folder answer satisfies the gate. A skip answer records a skipped state.

`evaluateMutation()` reads that state and checks the target path. It allows closed, satisfied, skipped, child, disabled and exempt cases. With an open gate it advises by default. It denies a non-exempt `write` or `edit` only when `SYSTEM_SPEC_GATE_ENFORCE=1`. It can advise on `bash` but never denies it.

The core records delivery after an adapter reports that the notice reached its runtime. Adapters choose the channel. They may relay a deferral on the prompt turn, but the folder question itself arrives at the first mutation. The core does not write to stdout or stderr.

---

## 3. RUNTIME COVERAGE

Each entry below is relative to `.skilled/hooks/spec-gate/`. Each real file path is relative to the repository root.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
| --- | --- | --- | --- | --- |
| Claude | `UserPromptSubmit`, `PreToolUse` | `.skilled/hooks/spec-gate/claude/spec-gate-classify.mjs`<br>`.skilled/hooks/spec-gate/claude/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | No output on prompt submit. The first mutation returns an additional-context notice or a deny decision. |
| Codex | `UserPromptSubmit`, `PreToolUse` | `.skilled/hooks/spec-gate/codex/spec-gate-classify.mjs`<br>`.skilled/hooks/spec-gate/codex/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | No output on prompt submit. The first mutation returns an additional-context notice or a deny decision. |
| Cursor | `beforeSubmitPrompt`, `sessionStart`, `preToolUse` | `.skilled/hooks/spec-gate/cursor/spec-gate-classify.mjs`<br>`.skilled/hooks/spec-gate/cursor/spec-gate-enforce.mjs`<br>`.skilled/hooks/spec-gate/cursor/spec-gate-prebind.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Classify and prebind return `permission: allow`. `preToolUse` returns an allow message or a deny object. Deny exits 2. |
| Devin | `UserPromptSubmit`, `PreToolUse` | `.skilled/hooks/spec-gate/devin/spec-gate-classify.mjs`<br>`.skilled/hooks/spec-gate/devin/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | No output on prompt submit. `PreToolUse` returns an additional-context notice or a deny decision. |
| OpenCode | `experimental.chat.system.transform`, `tool.execute.before`, `event` | `.skilled/hooks/spec-gate/opencode/system-spec-gate.js` | `.opencode/plugins/system-spec-gate.js` | Adds a deferral to system context. Throws `system-spec-gate:` on deny and writes advice events to the warning log. |
| Pi | `input`, `tool_call` | `.skilled/hooks/spec-gate/pi/spec-gate-classify.ts`<br>`.skilled/hooks/spec-gate/pi/spec-gate-enforce.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts`<br>`.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | With UI, the first write or edit opens a select and path dialog. A denied call returns `block: true`. |
| DSH | `agent/pre-step`, `tools/pre-execute` | `.skilled/hooks/spec-gate/dsh/spec-gate-classify.mjs`<br>`.skilled/hooks/spec-gate/dsh/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/spec-gate-classify.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/dsh/spec-gate-enforce.mjs` | Adds a deferral message on `agent/pre-step`. `tools/pre-execute` returns `ask` on the first undelivered write or edit and `deny` when blocked. |
| Vibe | `pre_agent`, `pre_tool` | `.skilled/hooks/spec-gate/vibe/spec-gate-classify.mjs`<br>`.skilled/hooks/spec-gate/vibe/spec-gate.mjs` | `.vibe/plugins/repo-guards/spec-gate-classify.mjs`<br>`.vibe/plugins/repo-guards/spec-gate.mjs` | Adds deferral context on `pre_agent`. `pre_tool` returns a deny object or an operator-facing `system_message`. |

Claude registers in `.claude/settings.json`. Codex uses `.codex/hooks.json`. Cursor uses `.cursor/hooks.json`. Devin uses `.devin/hooks.v1.json`. The registry at `../../../cli/runtime-mirrors/hook-registry.json` records those bindings and the Pi extension names.

OpenCode loads the flat `.opencode/plugins/*.js` glob. Pi loads `.pi/extensions/spec-gate-classify.ts` and `.pi/extensions/spec-gate-enforce.ts`. DSH registers both adapters in `.dsh/plugins/repo-guards/index.mjs`. Vibe registers `spec-gate-classify` and `spec-gate` in `.vibe/hooks.toml`.

Unexpected errors follow each runtime's failure path. Claude, Codex, Cursor and Devin report errors to stderr and allow the call. OpenCode swallows unexpected errors and throws only its own `system-spec-gate:` denial. Pi returns `{ action: "continue" }` from classify and `undefined` from enforce. DSH logs a classify error and passes the step through. An enforce error logs and returns `deny`. Vibe reports errors to stderr and allows the call.

---

## 4. DIRECTORY TREE

```text
.skilled/hooks/spec-gate/
+-- README.md -> ../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md
+-- claude/
|   +-- spec-gate-classify.mjs
|   `-- spec-gate-enforce.mjs
+-- codex/
|   +-- spec-gate-classify.mjs
|   `-- spec-gate-enforce.mjs
+-- cursor/
|   +-- spec-gate-classify.mjs
|   +-- spec-gate-enforce.mjs
|   `-- spec-gate-prebind.mjs
+-- devin/
|   +-- spec-gate-classify.mjs
|   `-- spec-gate-enforce.mjs
+-- dsh/
|   +-- spec-gate-classify.mjs
|   `-- spec-gate-enforce.mjs
+-- opencode/
|   `-- system-spec-gate.js
+-- pi/
|   +-- spec-gate-classify.ts
|   `-- spec-gate-enforce.ts
+-- vibe/
|   +-- spec-gate-classify.mjs
|   `-- spec-gate.mjs
`-- tests/
    +-- README.md
    `-- dsh-spec-gate.test.mjs
```

The runtime directories contain links to their real adapter files. `README.md` points to this file. `tests/` contains the DSH adapter suite.

---

## 5. KEY FILES

All paths in this table are relative to this README's folder.

| File | Responsibility |
| --- | --- |
| `spec-gate-core.mjs` | Shared classification and mutation policy. |
| `../../../../shared/dist/gate-3-classifier.js` | Classifier and spec-folder binding validator imported by the core. |
| `../../../../../../hooks/shared/hook-flags.cjs` | Resolves the concern switch and master switch. |
| `../../../cli/runtime-mirrors/hook-registry.json` | Records runtime bindings for Claude, Codex, Cursor, Devin and Pi. |
| `../../../tests/hooks/spec-gate-core.test.mjs` | Tests core classification and enforcement. |

---

## 6. CONFIGURATION

The shared hook-flag resolver treats `1`, `true`, `yes` and `on` as on, in any case. The core checks its enforcement and child-session flags for exact `1`.

| Switch | Concern | Effect |
| --- | --- | --- |
| `SYSTEM_SPEC_GATE_DISABLED=1` | `spec-gate` | Disables classification and enforcement. |
| `SYSTEM_HOOKS_DISABLED=1` | Every shared-resolver hook | Disables adapters that use the shared resolver. Cursor's `sessionStart` prebind does not check this switch. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | `spec-gate` | Denies an open-gate non-exempt write or edit. Vibe sets it when unset. An explicit `0` keeps Vibe advisory. |
| `AI_SESSION_CHILD=1` | Child session | Makes both core entrypoints no-ops. Vibe also treats a nonblank payload `parent_session_id` as a child. |
| `SYSTEM_SPEC_FOLDER` | Cursor prebind | A valid folder satisfies the gate at session start. Without one, prebind opens the gate only when enforcement is on. |
| `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` | `spec-gate` | Repeats in-gate notices on every eligible mutation. `false`, `no` and `off` do the same. |

Set `SYSTEM_SPEC_GATE_DISABLED` or `SYSTEM_HOOKS_DISABLED` in the environment or `.skilled/hooks/hook-flags.env`. The resolver reads that file when present and gives the environment priority. Set `SYSTEM_SPEC_GATE_ENFORCE`, `AI_SESSION_CHILD`, `SYSTEM_SPEC_FOLDER` and `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION` in the environment.

---

## 7. VALIDATION

Run these commands from the repository root.

```bash
env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE node --experimental-test-module-mocks --test --test-reporter=dot .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs
```

Expected result: the reporter prints dots for passing core cases and the command exits 0.

```bash
env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE node --test --test-reporter=dot .skilled/hooks/spec-gate/tests/dsh-spec-gate.test.mjs
```

Expected result: the reporter prints dots for passing DSH cases and the command exits 0.

```bash
printf '%s\n' '{"session_id":"readme-smoke","cwd":".","tool_name":"write","tool_input":{"file_path":"README.md"}}' | SYSTEM_SPEC_GATE_DISABLED=1 node .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected result: no stdout or stderr output and exit status 0.

---

## 8. RELATED

- [hooks coverage matrix](../../../../../../hooks/README.md): runtime coverage and the hook index.
- [Gate-3 classifier source](../../../../shared/gate-3-classifier.ts): prompt classification and spec-folder binding checks.
- [hook flag resolver](../../../../../../hooks/shared/hook-flags.cjs): concern and master switch rules.
- [runtime binding registry](../../../cli/runtime-mirrors/hook-registry.json): registered adapter bindings.
