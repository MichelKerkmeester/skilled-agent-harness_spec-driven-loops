---
title: "Spec Gate: runtime-neutral Gate-3 policy core"
description: "Shared classify and enforce logic that turns the spec-folder-before-mutation rule into session-scoped state readable by every runtime hook (Claude, Codex, Cursor, Devin, Pi, OpenCode). The question is delivered at the first mutation, once per session; the menu is never appended to a write-intent turn. Advisory by default; deny is opt-in via SYSTEM_SPEC_GATE_ENFORCE."
---

# Spec Gate

---

## 1. OVERVIEW

`lib/spec-gate/` is the single runtime-neutral implementation of the Gate-3 policy: ask for a spec folder before the first file mutation of a session, then remember the answer. `classifyIntent()` reads a user turn and either opens the gate or parses an answer to an already-open gate; the menu itself is **never appended to a model turn**, so a write-intent turn proceeds instead of stalling on a question. `evaluateMutation()` reads the cached gate state for a Write, Edit, or Bash call and returns `allow`, `advise`, or `deny`, reporting `gateOpenUndelivered` when an interactive runtime can still ask at that first mutation. A dispatched child (`AI_SESSION_CHILD=1`) short-circuits both entrypoints as a complete no-op before any gate-state read or write, question, denial, or telemetry.

The module owns atomic session-state persistence, an appendable warning log, and a throttled stale-state sweep, but it **never writes to stdout or stderr itself**: every runtime adapter wraps it and chooses its own emission channel. Every entrypoint **fails open**: an unreadable state file, a classifier throw, an unresolvable project root, or an unexpected argument shape all resolve to `allow` with no side effects.

Deny is **opt-in** via `SYSTEM_SPEC_GATE_ENFORCE`. Without it, an open-gate mutation surfaces as `advise` (a warning the operator can ignore) rather than `deny`. This keeps the gate safe to ship by default and lets an operator turn on enforcement once they trust the classifier.

---

## 2. WHAT IT DOES

The core exposes two main entrypoints plus state-management helpers:

**`classifyIntent({ prompt, sessionID, projectDir, env })`**: runs the compiled Gate-3 classifier (`shared/dist/gate-3-classifier.js`) against the prompt. If the turn triggers file-mutation intent and the session gate is not yet answered, it opens the gate and returns the bounded Gate-3 question **for the runtime adapter to deliver at the first mutation** — adapters never put it on the turn itself. If the gate is already open, it parses the prompt as an answer and resolves the gate (recording the spec folder); a resume trigger or an unbound answer attempt also re-arms the one-time delivery marker. A dispatched child (`AI_SESSION_CHILD=1`) returns a complete no-op before any state read. Returns `{ question?, ... }`.

**`evaluateMutation({ tool, filePath, sessionID, projectDir, env })`**, reads the cached gate state for a Write/Edit/Bash call. Returns `allow` (gate closed or target exempt), `advise` (gate open, mutation not yet scoped, warn only), or `deny` (gate open, mutation not scoped, `SYSTEM_SPEC_GATE_ENFORCE=1`). The `wouldDeny` flag distinguishes "would deny under enforcement" from "actually denied", so the warning log records both even when enforcement is off. A first, still-undelivered Write/Edit additionally reports `gateOpenUndelivered: true` so an interactive adapter can ask at that moment; its `advise` detail is `GATE_3_MUTATION_NOTICE` on the first delivery and `null` afterwards (a silent allow whose `wouldDeny` is still true), while `deny` keeps carrying `GATE_3_DENY_DETAIL` on every blocked call. A dispatched child short-circuits to `allow`.

**State & telemetry helpers:** `resolveGuardPaths(projectDir)`, `readGateState`/`writeGateStateAtomic`/`evictGateState`, `appendWarningLog(stateDir, detail)`, `formatSpecGateEvent({...})`, `sweepStaleGateStates(stateDir, runtimeState)` (throttled), `isChildSession(env)`.

**Shadow-delivery observation (telemetry):** `observeGate3QuestionDelivery(request)` records that the Gate-3 question was actually emitted; `shouldSuppressGate3Delivery(request)` decides whether a repeated question may be suppressed. A question is confirmable only by an observed receipt whose `lifecycleEpoch >= 1` matches the question hash: epoch 0 (no lifecycle boundary yet) never confirms. This in-memory epoch/receipt machinery is no longer the emission gate — repeated-delivery suppression is decided by the persisted per-session marker below, and the receipts stay as telemetry. Receipt/epoch helpers: `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `advanceGate3LifecycleEpoch`, `clearGate3SessionDelivery`.

**Mutation-time delivery:** the session state file carries a delivery marker (`questionDeliveredAtMs`, `questionDeliveredChannel`, `questionDeliveredCount`), so suppression survives runtimes that lose process memory between events. `recordGate3NoticeDelivered({ sessionID, projectDir, channel })` writes it once the notice is actually on the wire (channels in use: `mutation`, `dialog`, `dialog-cancelled`, `system-deferral`, `classify-deferral`); `shouldDeliverGate3Deferral({ sessionID, projectDir, env })` reports whether the no-dialog deferral instruction still has to be relayed; `bindGate3Answer({ answer, sessionID, projectDir, env })` binds a programmatically chosen answer (the interactive dialog path) with the same acceptance rules as a conversational answer; `rearmGate3NoticeDelivery({ sessionID, projectDir, env })` clears the marker for a resume event that carries no prompt. Suppression is on by default once delivered; only `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` forces every in-gate mutation to ask again, and anything unreadable delivers (fail-open).

**Prompt sanitization (Pi):** `sanitizePromptForClassify` strips sibling injections (the advisor's directives capsule) and the harness's embedded conversation history from a prompt before classification, so only the user's own latest words classify. Input transforms chain across Pi handlers, so the hook sees injected prose containing literal trigger words ("write", "move") and history text that would re-open the gate on read-only turns without the sanitizer.

**Session keying:** `resolveSessionKey({ sessionId, sessionFile })`: the session file stays stable across invocations of one conversation while the session id is fresh per process; both classify and enforce must key state identically or classify's answer never reaches enforce's lookup.

---

## 3. PER-RUNTIME DELIVERY

Every runtime adapter imports the **same** `spec-gate-core.mjs` and calls `classifyIntent` / `evaluateMutation`. What differs is the event each runtime fires, the payload shape, and the channel the question/decision is handed back through.

| Runtime | Adapters | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/spec-gate-classify.mjs`, `claude/spec-gate-enforce.mjs` | `UserPromptSubmit` (classify, matcher `""`) + `PreToolUse` (enforce, matchers `Bash` and `Write\|Edit`) in `.claude/settings.json`; timeout 5s | Reads `prompt` + `cwd` + `session_id` (classify); `tool_name` + `tool_input.file_path` + `cwd` (enforce); falls back to `CLAUDE_PROJECT_DIR` then `process.cwd()` | Classify: silent — opens the gate, writes nothing. Enforce: `permissionDecision: deny` JSON on deny; `additionalContext` carrying the once-per-session notice on the first in-gate Write/Edit; exit 0 otherwise |
| **Codex** | `codex/spec-gate-classify.mjs`, `codex/spec-gate-enforce.mjs` | `UserPromptSubmit` (classify) + `PreToolUse` (enforce, matcher `exec\|apply_patch\|edit`) in `.codex/hooks.json`; timeout 5s | Same shape as Claude over Codex's `exec`/`apply_patch`/`edit` tools; `cd "${CODEX_PROJECT_DIR:-$PWD}"`; fallback `printf` envelope on resolution failure | Same silent classify, once-per-session advise notice, and deny JSON |
| **Cursor** | `cursor/spec-gate-prebind.mjs`, `cursor/spec-gate-classify.mjs`, `cursor/spec-gate-enforce.mjs` | `sessionStart` (prebind) + `beforeSubmitPrompt` (classify) + `preToolUse` (enforce) in `.cursor/hooks.json`; timeout 10s | Cursor does not deliver its prompt-classification event reliably under the CLI, so `sessionStart` is the confirmed place to establish state: `prebind` satisfies the gate immediately when `SYSTEM_SPEC_FOLDER` names a valid spec folder (source `flags`, never `prior_answer`), or opens it when `SYSTEM_SPEC_GATE_ENFORCE=1`. `classify` runs the shared classifier when the prompt event does fire. `enforce` evaluates mutations | Prebind: `permission: allow` JSON. Classify: silent. Enforce: `agent_message` carries the once-per-session notice on advise; deny/allow as elsewhere |
| **Devin** | `devin/spec-gate-classify.mjs`, `devin/spec-gate-enforce.mjs` | `UserPromptSubmit` (classify, matcher `""`) + `PreToolUse` (enforce, matchers `^exec$` and `^edit$`) in `.devin/hooks.v1.json`; timeout 5-10s | Same shape as Claude over Devin's `exec`/`edit` tools; `cd "${DEVIN_PROJECT_DIR:-$PWD}"` | Same silent classify, once-per-session advise notice, and deny JSON |
| **Pi** | `pi/spec-gate-classify.ts`, `pi/spec-gate-enforce.ts` (real files; `.pi/extensions/` symlinks here) | `input` (classify) + `tool_call` (enforce, tools `bash`/`write`/`edit`) via `.pi/extensions/` | Imports the core in-process. Classify sanitizes the prompt (`sanitizePromptForClassify`) and keys state via `resolveSessionKey({ sessionId, sessionFile })`. Enforce keys state identically so classify's answer reaches enforce's lookup | Classify: leaves the turn untouched when `ctx.hasUI`; appends the one-shot deferral instruction only when it is false. Enforce: at the first in-gate Write/Edit opens an interactive `ctx.ui.select` + path-input dialog, binds the answer programmatically, and blocks that single call with a retry reason; `block: true` + `reason` on deny |
| **OpenCode** | `.skilled/plugins/system-spec-gate.js` (mirrored at `opencode/` via browsability symlink) | Plugin. `experimental.chat.system.transform` (classify), `tool.execute.before` for mutating tools + `bash` (enforce), `event` for session lifecycle | `experimental.chat.system.transform`'s typed input carries no `prompt` field, so the adapter best-effort fetches the session's last user message via `ctx.client` (guarded, fail-open) when `extractPrompt(input)` comes up empty. Enforce throws `system-spec-gate: <detail>` on deny (OpenCode's deny signal); the plugin's catch re-throws only that message and swallows everything else | Classify: one-shot deferral instruction appended to `output.system` (never the menu). Enforce: throw on deny (blocks the tool call); advise and would-deny telemetry logged to the state dir, never stdout/stderr. `event`: sweeps stale state on `session.created`, advances the lifecycle epoch and re-arms the delivery marker on `session.resumed`/`compacted`/`compact`, evicts on `session.deleted` |

OpenCode discovers plugins solely from `.opencode/plugins/`, so `system-spec-gate.js` must live there; `opencode/system-spec-gate.js` is a relative symlink back into that folder for browsability: nothing loads through it. Pi loads in the other direction: the real `pi/spec-gate-*.ts` files live here, and `.pi/extensions/spec-gate-*.ts` are the symlinks Pi discovers.

---

## 4. DIRECTORY TREE

```text
lib/spec-gate/
+-- README.md              # this reference (symlinked from .skilled/hooks/spec-gate/README.md)
+-- spec-gate-core.mjs     # the policy core
`-- spec-gate-core.test.mjs

<runtime>/spec-gate-classify.mjs   # claude, codex, cursor, devin
<runtime>/spec-gate-enforce.mjs    # claude, codex, cursor, devin
cursor/spec-gate-prebind.mjs       # Cursor-only sessionStart state prebind
pi/spec-gate-classify.ts           # real Pi extension (.pi/extensions/ symlinks here)
pi/spec-gate-enforce.ts            # real Pi extension
runtime/tests/spec-gate-pi-extension.vitest.ts  # fake-ExtensionAPI suite for both Pi extensions
.skilled/plugins/system-spec-gate.js  # OpenCode plugin
```

The hooks-tree index at `.skilled/hooks/spec-gate/` mirrors these per runtime via relative symlinks; this README is the symlink target.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `spec-gate-core.mjs` | The policy core: `classifyIntent()`, `evaluateMutation()`, gate-state read/write/evict, the warning log, archive pruning, the throttled stale-state sweep, shadow-delivery observation, prompt sanitization, session-key resolution, and the persisted mutation-time delivery marker (`shouldDeliverGate3Deferral`, `recordGate3NoticeDelivered`, `bindGate3Answer`, `rearmGate3NoticeDelivery`). Never writes stdout/stderr. |
| `spec-gate-core.test.mjs` | `node --test` corpus covering the golden classify/enforce loop, fail-open paths, `answerParse()`, the once-per-session delivery contract, and programmatic answer binding. Run with `--experimental-test-module-mocks` for the ESM-mock cases. |
| `<runtime>/spec-gate-classify.mjs` | Thin stdin adapters that read the user-turn payload and call `classifyIntent` to open or resolve the gate. Classify emits **nothing**: the question belongs at the first mutation. Fail open to exit 0. |
| `<runtime>/spec-gate-enforce.mjs` | Thin stdin adapters that read the tool-call payload, call `runEnforceGate`, emit deny/advise/allow, and record the delivery marker through `result.observe()` once the advise envelope is on the wire. Fail open to exit 0. |
| `cursor/spec-gate-prebind.mjs` | Cursor-only `sessionStart` adapter. Satisfies the gate immediately when `SYSTEM_SPEC_FOLDER` names a valid spec folder (source `flags`), or opens it when `SYSTEM_SPEC_GATE_ENFORCE=1`. Disabled/child/malformed cases write no state. |
| `pi/spec-gate-classify.ts`, `pi/spec-gate-enforce.ts` | Native Pi extensions importing the core in-process. Classify sanitizes the prompt and relays the one-shot deferral only when `ctx.hasUI` is false; enforce opens the interactive dialog at the first undelivered Write/Edit (`ctx.ui.select` + path input, then `bindGate3Answer`) and returns `block: true` on deny. |
| `runtime/tests/spec-gate-pi-extension.vitest.ts` | Fake-`ExtensionAPI` suite driving both Pi extensions through their production event handlers: no turn-time menu, dialog at the first write, one-time block, repeat suppression, cancel fail-open. |
| `.skilled/plugins/system-spec-gate.js` | OpenCode plugin. `experimental.chat.system.transform` classifies (best-effort fetches the last user message via `ctx.client`) and relays the one-shot deferral; `tool.execute.before` enforces (throws `system-spec-gate:` on deny) and logs would-deny telemetry; `event` sweeps, advances the epoch, re-arms the delivery marker, and evicts state. All policy and persistence live in the core; this file only maps OpenCode's transport onto it. |
| `shared/dist/gate-3-classifier.js` | The compiled classifier the core imports from `shared/`. |

---

## 6. CONFIGURATION

The gate is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_SPEC_GATE_DISABLED=1` | Canonical kill-switch. Every adapter checks `isHookEnabled('spec-gate')` and returns allow/exit 0 before any state work. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Opt-in enforcement. Promotes an open-gate mutation from `advise` to `deny`. Without it, the gate is advisory-only. |
| `AI_SESSION_CHILD=1` | Dispatched sub-session flag. Both `classifyIntent` and `evaluateMutation` short-circuit as a complete no-op before any state read/write, question, denial, or telemetry. |
| `SYSTEM_SPEC_FOLDER` | Cursor prebind: names a valid spec folder to satisfy the gate immediately at session start (source `flags`, never `prior_answer`). |
| `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` | Force every in-gate mutation to carry the notice. Suppression is on by default once a session has received the question; any other value (or unset) keeps the session quiet after delivery. Unknown or unobserved state always delivers. |

Set a flag inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory by default | Without `SYSTEM_SPEC_GATE_ENFORCE`, an open-gate mutation surfaces as `advise` (a warning the operator can ignore), never `deny`. |
| Fail-open | An unreadable state file, a classifier throw, an unresolvable project root, or an unexpected argument shape all resolve to `allow` with no side effects. Every adapter's `main().catch(() => approve())` makes the fail-open path the exit-0 path. |
| Child no-op | `AI_SESSION_CHILD=1` short-circuits both entrypoints before any state read/write, question, denial, or telemetry. |
| Atomic state | The core owns atomic session-state persistence; adapters never write state directly. |
| No stdout/stderr from core | The core never writes to stdout or stderr itself; every adapter chooses its own emission channel. OpenCode never writes stdout/stderr at all (advises via the state-dir log). |
| Telemetry | One structured warning-log line for the first open-gate mutation event (advise or would-deny), written to a real file log: never depends on `additionalContext` landing anywhere observable. Once the notice is delivered, later mutations resolve to a silent allow and the core writes no further line (the OpenCode adapter keeps logging its would-deny row). `allow` on a never-open gate or an exempt target has nothing to measure. |
| Shadow delivery | `observeGate3QuestionDelivery` is called strictly post-emission by each adapter; the epoch/receipt shadow stays telemetry. Repeated-delivery suppression is governed by the persisted per-session marker, default-on, fail-open. |
| Once-per-session delivery | The marker (`questionDeliveredAtMs`/`Channel`/`Count`) in session state gates re-emission and survives stateless per-event runtimes. It re-arms only on a resume trigger, an unbound answer attempt, or a fresh gate open, and it never changes the gate decision itself: a delivered session still denies under enforcement. |
| Session keying | Classify and enforce must key state identically (`resolveSessionKey`) or classify's answer never reaches enforce's lookup. |
| Imports | The core imports the compiled `shared/dist/gate-3-classifier.js` and Node builtins. Adapters import the core and the shared `hook-flags` resolver. Nothing outside the repo. |

---

## 8. VALIDATION

```bash
node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs
```

Expected result: all core tests pass (golden classify/enforce loop, fail-open paths, `answerParse()`, the once-per-session delivery contract, programmatic answer binding). Run with `--experimental-test-module-mocks` for the ESM-mock cases.

```bash
node --test .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-claude.test.mjs
node --test .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-codex.test.mjs
node --test .skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs
node --test .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs
```

Expected result: all per-runtime adapter tests pass.

```bash
env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE node .skilled/plugins/tests/system-spec-gate.test.cjs
```

Expected result: 11 pass, 0 fail (OpenCode plugin, including the one-shot deferral relay and the session-key fallback).

```bash
(cd .skilled/skills/system-spec-kit/runtime && npx vitest run --config ../vitest.config.ts --project root runtime/tests/spec-gate-pi-extension.vitest.ts)
```

Expected result: the Pi extension suite passes (turn untouched, dialog at the first write, one-time block, repeat suppression, cancel fail-open).

```bash
node --check .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs
node --check .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
node --check .skilled/plugins/system-spec-gate.js
```

Expected result: no syntax errors (repeat for the codex/cursor/devin siblings).

---

## 9. RELATED

- [`../README.md`](../README.md): the owning `lib/` folder, including `hook-adapter-shared.mjs` and `workspace/`.
- [`../../claude/README.md`](../../claude/README.md), [`../../codex/README.md`](../../codex/README.md), [`../../cursor/README.md`](../../cursor/README.md), [`../../devin/README.md`](../../devin/README.md): per-runtime hook folders that wire these adapters.
- [`../../../../shared/gate-3-classifier.ts`](../../../../shared/gate-3-classifier.ts): the compiled classifier this core imports from `shared/dist/`.
- [`../../../README.md`](../../../README.md): the owning skill's hook contract.
- [`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md`](../../../../../../skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md): the manual scenario validating this core end to end.
- [`.skilled/hooks/README.md`](../../../../../../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix.
- [`.skilled/plugins/README.md`](../../../../../../plugins/README.md): the OpenCode plugins folder that loads `system-spec-gate.js`.
