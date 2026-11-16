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

`spec-gate-core.mjs` is the one runtime-neutral implementation of the Gate-3 policy. It asks for a spec folder before the first file mutation of a session, then remembers the answer. `classifyIntent()` reads a user turn and either opens the gate or parses an answer to an already-open gate. `evaluateMutation()` reads the cached gate state for a write, edit or shell call and returns `allow`, `advise` or `deny`.

The menu is never appended to a model turn, so a write-intent turn proceeds instead of stalling on a question. A first, still-undelivered write reports `gateOpenUndelivered`, which lets an interactive runtime ask at that moment. A dispatched child (`AI_SESSION_CHILD=1`) short-circuits both entrypoints as a complete no-op.

Deny is opt-in via `SYSTEM_SPEC_GATE_ENFORCE`. Without it, an open-gate mutation surfaces as `advise`, a warning the operator can ignore. Vibe is the exception. Its `pre_tool` hook sets the opt-in when the operator has not, and an explicit `0` keeps it advisory. A payload `parent_session_id` marks a child session on Vibe.

The core owns atomic session-state persistence, an appendable warning log and a throttled stale-state sweep. It never writes to stdout or stderr itself, because every adapter chooses its own emission channel.

---

## 2. HOW IT WORKS

Every adapter calls the same core. The core holds the policy, and an adapter holds only payload parsing plus the envelope its runtime reads.

### Classify

`classifyIntent({ prompt, sessionID, projectDir, env })` runs the compiled classifier at `shared/dist/gate-3-classifier.js`. A write-intent turn opens the gate and returns `{ question?, ... }`. The adapter delivers that question at the first mutation, never on the turn itself. When the gate is already open, the prompt is parsed as an answer and the gate resolves with the recorded spec folder. A resume trigger or an unbound answer attempt re-arms the one-time delivery marker.

### Enforce

`evaluateMutation({ tool, filePath, sessionID, projectDir, env })` reads the cached gate state for a write, edit or shell call. It returns one of three decisions.

| Decision | When |
|---|---|
| `allow` | The gate is closed, the target is exempt or the session is a child. |
| `advise` | The gate is open and the mutation is not yet scoped. The operator sees a warning. |
| `deny` | The gate is open, the mutation is not scoped and `SYSTEM_SPEC_GATE_ENFORCE=1` is set. |

The `wouldDeny` flag separates a would-deny from an actual deny, so the warning log records both. A first, still-undelivered write or edit also reports `gateOpenUndelivered: true`. Its `advise` detail is `GATE_3_MUTATION_NOTICE` on the first delivery and `null` afterwards. A silent allow still carries `wouldDeny` true. A `deny` keeps carrying `GATE_3_DENY_DETAIL` on every blocked call.

### Exempt Targets

`isExemptTargetPath` decides on the real path, after symlinks and `..` are resolved. A write or edit to an exempt target is always `allow`. The exempt classes are the spec tree, `.git`, `node_modules`, `dist` output and anything outside the repo. Gitignored runtime state under `.skilled/skills/.state/` is exempt too. The one tracked doc in a state dir, its `<concern>/README.md`, stays gated.

### State And Telemetry

`resolveGuardPaths(projectDir)` anchors the state dir at the repository root. `readGateState`, `writeGateStateAtomic` and `evictGateState` own a JSON file per session. `appendWarningLog(stateDir, detail)` appends one line to a bounded, rotated log. `formatSpecGateEvent({...})` composes that line and scrubs secrets from the path.

The core logs one line whenever the decision is not `allow`. Once the notice is delivered, an unenforced mutation resolves to a silent allow, so the core writes no further line. OpenCode still logs a would-deny on that allow. `sweepStaleGateStates(stateDir, runtimeState)` archives stale files and is throttled. `isChildSession(env)` reads the child flag.

### Shadow Delivery

`observeGate3QuestionDelivery(request)` records that the question was actually emitted. `shouldSuppressGate3Delivery(request)` decides whether a repeat may be suppressed. A question is confirmable only by an observed receipt whose `lifecycleEpoch >= 1` matches the question hash. Epoch 0 never confirms. This in-memory machinery is telemetry now, not the emission gate. The receipt and epoch helpers are `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `advanceGate3LifecycleEpoch` and `clearGate3SessionDelivery`.

### Delivery Marker

The session state file carries a delivery marker: `questionDeliveredAtMs`, `questionDeliveredChannel` and `questionDeliveredCount`. Suppression therefore survives a runtime that loses process memory between events. `recordGate3NoticeDelivered({ sessionID, projectDir, channel })` writes the marker once the notice is on the wire. The channels in use are `mutation`, `dialog`, `dialog-cancelled`, `system-deferral` and `classify-deferral`.

`shouldDeliverGate3Deferral({ sessionID, projectDir, env })` reports whether the no-dialog deferral still has to be relayed. `bindGate3Answer({ answer, sessionID, projectDir, env })` binds a programmatic answer under the same rules as a conversational one. `rearmGate3NoticeDelivery({ sessionID, projectDir, env })` clears the marker for a resume event that carries no prompt.

Suppression is on by default once delivered. `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` forces every in-gate mutation to ask again, and so do `false`, `no` and `off`. Anything unreadable delivers, so the fail-open direction is to ask.

### Prompt Sanitization

`sanitizePromptForClassify` strips sibling injections and the embedded conversation history from a prompt before classification. Only the user's own latest words classify. Input transforms chain across Pi handlers, so the hook sees injected prose with literal trigger words. History text would re-open the gate on read-only turns without the sanitizer.

### Session Keying

`resolveSessionKey({ sessionId, sessionFile })` keeps the session file stable across invocations of one conversation. The session id is fresh per process. Classify and enforce must key state identically, or classify's answer never reaches enforce's lookup.

### Shell Writes

A shell command that writes a file is never refused. `DENY_CAPABLE_TOOLS` holds `write` and `edit` only, so `bash` is never deny-capable. The core also skips target-path evaluation for `bash`, so a shell call carries no path for the gate to check. A shell call can still be advised and logged. The operator kept this as a known limit rather than parse shell redirects.

---

## 3. RUNTIME COVERAGE

Each entry below is relative to `.skilled/hooks/spec-gate/`. That folder links this file as its README, and its runtime folders hold links only.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `UserPromptSubmit` | `claude/spec-gate-classify.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | Nothing. The gate opens and the hook exits 0. |
| Claude | `PreToolUse` | `claude/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | A `permissionDecision: deny` JSON on deny. An `additionalContext` notice on the first in-gate write or edit. |
| Codex | `UserPromptSubmit` | `codex/spec-gate-classify.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Nothing. The gate opens and the hook exits 0. |
| Codex | `PreToolUse` | `codex/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | The same deny JSON and the same `additionalContext` notice as Claude. |
| Cursor | `beforeSubmitPrompt` | `cursor/spec-gate-classify.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | `{"permission":"allow"}` and nothing else. |
| Cursor | `preToolUse` | `cursor/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | `permission: deny` with `user_message` and `agent_message` on deny, exit 2. `permission: allow` with an `agent_message` notice on advise. |
| Cursor | `sessionStart` | `cursor/spec-gate-prebind.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | `permission: allow`. The hook writes gate state and says nothing else. |
| Devin | `UserPromptSubmit` | `devin/spec-gate-classify.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | Nothing. The gate opens and the hook exits 0. |
| Devin | `PreToolUse` | `devin/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | The same deny JSON and the same `additionalContext` notice as Claude. |
| DSH | `agent/pre-step` | `dsh/spec-gate-classify.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/spec-gate-classify.mjs` | One extra user-role message carrying the deferral instruction, once per stretch of work. |
| DSH | `tools/pre-execute` | `dsh/spec-gate-enforce.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/spec-gate-enforce.mjs` | A `deny` verdict with a reason. An `ask` verdict with a reason at the first undelivered write or edit. |
| OpenCode | `experimental.chat.system.transform`, `tool.execute.before`, `event` (`session.created`, `session.resumed`, `session.compacted`, `session.compact`, `session.deleted`) | `opencode/system-spec-gate.js` | `.opencode/plugins/system-spec-gate.js` | The deferral instruction appended to `output.system`. A thrown `system-spec-gate: <detail>` on deny. One log line for an advise or a would-deny. |
| Pi | `input` | `pi/spec-gate-classify.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | The turn untouched when `ctx.hasUI` is true. The deferral instruction appended when it is false. |
| Pi | `tool_call` | `pi/spec-gate-enforce.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | An interactive `ctx.ui.select` dialog and a path input at the first undelivered write or edit. `block: true` with a reason on deny. |
| Vibe | `pre_agent` | None | `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | `hook_specific_output.additional_context` carrying the deferral instruction, once per stretch of work. |
| Vibe | `pre_tool` | None | `.vibe/plugins/repo-guards/spec-gate.mjs` | A `decision: deny` object with a reason on deny. A `system_message` note to the operator on advise. |

Claude, Codex, Cursor and Devin register their adapters in `hook-registry.json`. The Claude entries land in `.claude/settings.json` and the Codex entries in `.codex/hooks.json`. The Cursor entries land in `.cursor/hooks.json` and the Devin entries in `.devin/hooks.v1.json`. Claude gives classify 3 seconds and enforce 5. Codex gives classify 3 and enforce 5. Cursor gives every entry 10 seconds. Devin gives classify 10 and enforce 5.

Claude matches `""` for classify. It matches `Bash` and `Write\|Edit` for enforce. The Codex matcher is `exec\|Bash\|apply_patch\|edit`. Codex maps `exec` and `bash` to shell, `apply_patch` to write and `edit` to edit, and reads paths from the patch text. The Devin matchers are `^exec$` and `^(edit\|write)$`. Cursor registers no matcher and gates only `Shell` and `Write`. Devin exits 0 on a blank session id. DSH guards `write`, `edit`, `apply_patch` and `bash`.

Claude reads `prompt`, `cwd` and `session_id` for classify. It reads `tool_name`, `tool_input.file_path` and `cwd` for enforce. Claude falls back to `CLAUDE_PROJECT_DIR` and then `process.cwd()`. Codex runs `cd "${CODEX_PROJECT_DIR:-$PWD}"` and prints a `printf` envelope when resolution fails. Devin runs `cd "${DEVIN_PROJECT_DIR:-$PWD}"`.

Cursor does not deliver its prompt event reliably under the CLI. `sessionStart` is the confirmed place to establish state, so `prebind` satisfies the gate when `SYSTEM_SPEC_FOLDER` names a valid spec folder. It records the source as `flags`, never `prior_answer`. Without a valid declaration it opens the gate when `SYSTEM_SPEC_GATE_ENFORCE=1`. `classify` runs the shared classifier when the prompt event does fire. `enforce` judges mutations.

Pi loads the real files from `.skilled/skills/system-spec-kit/runtime/hooks/pi/`. `.pi/extensions/spec-gate-*.ts` are one-line entries that re-export them. Once the dialog binds an answer, enforce blocks that one call and asks for a retry.

DSH registers both adapters in `.dsh/plugins/repo-guards/index.mjs`. Its classify handler reads only a message the operator typed, so a guard notice or a context snapshot never classifies.

OpenCode discovers plugins only from `.opencode/plugins/`, so `system-spec-gate.js` must live there. A relative link in the `opencode/` folder points back at that file for browsing, and nothing loads through it. The transform input carries no prompt field, so the adapter fetches the session's last user message through `ctx.client` when `extractPrompt(input)` comes up empty. The `event` handler sweeps on `session.created`. It advances the epoch and re-arms the marker on `session.resumed`, `session.compacted` and `session.compact`. It evicts on `session.deleted`.

Vibe registers both hooks in `.vibe/hooks.toml`. `spec-gate-classify` is a `pre_agent` hook. `spec-gate` is a strict `pre_tool` hook matching `bash`, `process_start`, `write_file` and `edit`. Its `pre_tool` hook sets `SYSTEM_SPEC_GATE_ENFORCE=1` when the operator has not set a value, and an explicit `0` keeps the core advisory. A payload `parent_session_id` marks a child session. Vibe has no entry in this folder.

Each adapter has its own error path. On an internal error `evaluateMutation` returns `allow`, and `classifyIntent` evicts the session state and returns closed. The Claude, Codex, Cursor and Devin adapters end in `main().catch(() => approve())`. Each of those catches writes a stderr line before it exits 0. The Cursor prebind adapter catches into `allow()` instead. Cursor's approve prints `permission: allow`. Its classify emits `{"permission":"allow"}`.

Pi returns `{ action: "continue" }` from classify and `undefined` from enforce. OpenCode swallows every error except its own `system-spec-gate:` throw. DSH classify logs a warning and returns the step unchanged. DSH enforce fails closed and returns a `deny` verdict. Vibe reports on stderr and exits 0.

---

## 4. DIRECTORY TREE

```text
.skilled/hooks/spec-gate/
+-- README.md -> ../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md
+-- claude/    spec-gate-classify.mjs, spec-gate-enforce.mjs
+-- codex/     spec-gate-classify.mjs, spec-gate-enforce.mjs
+-- cursor/    spec-gate-classify.mjs, spec-gate-enforce.mjs, spec-gate-prebind.mjs
+-- devin/     spec-gate-classify.mjs, spec-gate-enforce.mjs
+-- dsh/       spec-gate-classify.mjs, spec-gate-enforce.mjs
+-- opencode/  system-spec-gate.js
+-- pi/        spec-gate-classify.ts, spec-gate-enforce.ts
`-- tests/     dsh-spec-gate.test.mjs
```

The hooks tree indexes this feature per runtime. Every runtime folder holds links only, so the table above is the whole index. `tests/` holds real code and keeps its own README.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `spec-gate-core.mjs` | The policy core. It owns `classifyIntent()`, `evaluateMutation()`, gate-state read, write and evict, the warning log, archive pruning, the throttled sweep, shadow-delivery observation, prompt sanitization, session-key resolution and the delivery marker (`shouldDeliverGate3Deferral`, `recordGate3NoticeDelivered`, `bindGate3Answer`, `rearmGate3NoticeDelivery`). It never writes stdout or stderr. |
| `../../../tests/hooks/spec-gate-core.test.mjs` | The `node --test` corpus. It covers the golden classify and enforce loop, the fail-open paths, `answerParse()`, the once-per-session delivery contract and programmatic answer binding. Add `--experimental-test-module-mocks` for the ESM-mock cases. |
| `<runtime>/spec-gate-classify.mjs` | Thin stdin adapters for Claude, Codex, Cursor and Devin. They read the user turn and call `classifyIntent`. They emit nothing, because the question belongs at the first mutation. |
| `<runtime>/spec-gate-enforce.mjs` | Thin stdin adapters for the same four runtimes. They read the tool call, call `runEnforceGate`, emit the decision and call `result.observe()` once the notice is on the wire. |
| `cursor/spec-gate-prebind.mjs` | The Cursor `sessionStart` adapter. It satisfies the gate when `SYSTEM_SPEC_FOLDER` names a valid spec folder, or opens it when `SYSTEM_SPEC_GATE_ENFORCE=1`. A disabled, child or malformed case writes no state. |
| `pi/spec-gate-classify.ts`, `pi/spec-gate-enforce.ts` | Native Pi extensions that import the core in process. Classify sanitizes the prompt and relays the deferral only when `ctx.hasUI` is false. Enforce opens the dialog at the first undelivered write or edit and returns `block: true` on deny. |
| `runtime/tests/spec-gate-pi-extension.vitest.ts` | A fake-`ExtensionAPI` suite that drives both Pi extensions through their production handlers. |
| `.opencode/plugins/system-spec-gate.js` | The OpenCode plugin. It maps OpenCode's transport onto the core and keeps no policy of its own. |
| `shared/dist/gate-3-classifier.js` | The compiled classifier the core imports from `shared/`. |

---

## 6. CONFIGURATION

The gate is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_SPEC_GATE_DISABLED=1` | The canonical kill-switch. It returns allow or exit 0 before any state work. |
| `SYSTEM_HOOKS_DISABLED=1` | The master switch. It turns off this concern along with every other repository hook. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Opt-in enforcement. It promotes an open-gate mutation from `advise` to `deny`. Vibe's `pre_tool` hook sets it when the operator has not, and an explicit `0` keeps the core advisory. |
| `AI_SESSION_CHILD=1` | The dispatched sub-session flag. Both entrypoints short-circuit as a complete no-op. |
| `SYSTEM_SPEC_FOLDER` | Cursor prebind. It names a valid spec folder to satisfy the gate at session start, with source `flags`. |
| `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` | Forces every in-gate mutation to carry the notice. So do `false`, `no` and `off`. Any other value keeps the session quiet after delivery. |

The core, OpenCode and Vibe check `isHookEnabled('spec-gate')`. Cursor prebind checks only `SYSTEM_SPEC_GATE_DISABLED=1`, so `SYSTEM_HOOKS_DISABLED` does not stop it.

Set a flag inline for one command, export it for a session or persist it in `.skilled/hooks/hook-flags.env`. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file.

The core reads `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_SPEC_GATE_ENFORCE` and `AI_SESSION_CHILD` as an exact `1`. The shared `hook-flags` resolver accepts `1`, `true`, `yes` or `on`.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs
```

Expected result: every core test passes. The corpus covers the golden classify and enforce loop, the fail-open paths, `answerParse()`, the once-per-session delivery contract and programmatic answer binding. Add `--experimental-test-module-mocks` for the ESM-mock cases.

```bash
node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-claude.test.mjs
node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-codex.test.mjs
node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs
node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-prebind.test.mjs
```

Expected result: every per-runtime adapter test passes.

```bash
env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE node .opencode/plugins/tests/system-spec-gate.test.cjs
```

Expected result: every test passes. The suite covers the one-shot deferral relay and the session-key fallback.

```bash
(cd .skilled/skills/system-spec-kit && npx vitest run --config vitest.config.ts --project root runtime/tests/spec-gate-pi-extension.vitest.ts)
```

Expected result: the Pi extension suite passes. It covers the untouched turn, the dialog at the first write, the one-time block, repeat suppression and the cancel fail-open.

```bash
node --check .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs
node --check .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
node --check .opencode/plugins/system-spec-gate.js
```

Expected result: no syntax errors. Repeat for the codex, cursor and devin siblings.

---

## 8. RELATED

- [`../README.md`](../README.md): the owning `lib/` folder, including `hook-adapter-shared.mjs` and `workspace/`.
- [`../../claude/README.md`](../../claude/README.md), [`../../codex/README.md`](../../codex/README.md), [`../../cursor/README.md`](../../cursor/README.md), [`../../devin/README.md`](../../devin/README.md): the per-runtime hook folders that wire these adapters.
- [`../../../../shared/gate-3-classifier.ts`](../../../../shared/gate-3-classifier.ts): the classifier source that compiles into `shared/dist/`.
- [`../../../README.md`](../../../README.md): the owning skill's hook contract.
- [`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md`](../../../../../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md): the manual scenario that validates this core end to end.
- [`.skilled/hooks/README.md`](../../../../../../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix.
- [`.opencode/plugins/README.md`](../../../../../../../.opencode/plugins/README.md): the OpenCode plugins folder that loads `system-spec-gate.js`.
