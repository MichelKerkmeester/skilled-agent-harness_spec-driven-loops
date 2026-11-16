---
title: "Completion Hooks: Completion-Evidence Gate"
description: "Advisory completion-evidence check that fires when an assistant claims completion, surfacing missing proof across Claude, Codex, Devin, Cursor, DSH, Pi, Vibe and the OpenCode plugins."
trigger_phrases:
  - "completion evidence hook"
  - "completion sentinel"
  - "done claim evidence check"
  - "claude completion evidence"
  - "claude stop sentinel"
  - "completion claim check"
  - "codex completion evidence"
  - "codex stop sentinel"
  - "codex completion claim check"
  - "cursor completion evidence"
  - "cursor after agent response"
  - "cursor completion claim check"
  - "devin completion evidence"
  - "devin stop sentinel"
  - "devin completion claim check"
  - "dsh completion evidence"
  - "dsh turn stopping sentinel"
  - "dsh completion claim check"
  - "opencode completion sentinel"
  - "opencode completion evidence"
  - "system speckit completion tool"
  - "pi completion evidence"
  - "pi turn end sentinel"
  - "pi completion claim check"
importance_tier: "important"
contextType: "reference"
---

# Completion Hooks: Completion-Evidence Gate

---

## 1. OVERVIEW

When the assistant claims a task is done, these hooks check the claim for objective evidence. A claim with no proof gets a warning. The policy lives in one runtime-neutral core, `completion-evidence-sentinel.cjs`. Each runtime adapter maps its own finished-turn event onto that core. This is the runtime realization of the framework's completion-verification rule.

Every adapter is advisory. It adds a warning to a bounded log and, where the runtime allows, to model-visible context. No adapter blocks or fails a turn. The core never runs a test, a build or `validate.sh`. It reads `check-completion.sh --json` output or takes a `stat` of `implementation-summary.md`.

The runtime folders here hold links. The real adapters live under `system-spec-kit/runtime/hooks/{runtime}/`. The OpenCode plugins live in `.opencode/plugins/`. Edit the source there, not here.

---

## 2. HOW IT WORKS

`evaluateCompletionEvidence({ specFolder, claimText, projectDir, env })` is the core entrypoint. It returns a transport-free decision, so each adapter can surface it in its own protocol.

1. The kill switch comes first. A disabled concern returns `{decision:'ok'}`.
2. `detectCompletionClaim(claimText)` tests the last 160 characters of the message. It looks for `completed`, `complete`, `resolved`, `fixed`, `finished`, `shipped`, `released`, `deployed`, `implemented`, `occurred` and `happened`. Checklist rows, table rows, code and assignment lines are filtered before matching. A claim word used mid-turn does not fire. Only a claim anchored to the trailing slice counts.
3. The core then resolves the spec folder. A folder whose `tasks.md` holds the protocol anchor gets a bounded `check-completion.sh --json` spawn. The default timeout is 1200 ms. The returned status is checked against the advise set below.
4. A folder with no protocol anchor is a Level 1 packet. The core takes a `stat` of `implementation-summary.md` instead. It advises when that file is absent.
5. Per-folder dedup comes next. A fingerprint of `specFolder + claimText` is stored in `.skilled/skills/.state/completion-sentinel/advisory-dedup.json`. A repeated packet and message pair is suppressed. A persistence failure fails open to not deduped.
6. A detected claim against a resolved packet returns `{decision:'advise', detail, deduped}`. The detail ends with a reminder to reread the request. That reminder asks whether each requested outcome is met or named not done. With sound evidence the detail is that reminder alone.
7. Every other case returns `{decision:'ok', detail:null, deduped}`. That covers no claim, no resolved packet, a check that could not run, an already-advised pair and the kill switch.

| Status | Advisory detail |
|---|---|
| `EVIDENCE_MISSING` | `claimed done but <N> completed P0/P1 checklist item(s) in <folder> lack an evidence marker` |
| `PRIORITY_CONTEXT_MISSING` | `claimed done but <N> checklist item(s) in <folder> are missing P0/P1/P2 priority context` |
| `P0_INCOMPLETE` | `claimed done but only <N>/<M> P0 checklist item(s) are complete in <folder>` |
| `P1_INCOMPLETE` | `claimed done but only <N>/<M> P1 checklist item(s) are complete in <folder>` |
| `AC_UNMET` | `claimed done but <N> acceptance criteria are unmet and <M> waived without a decision record in <folder>` |

The Level 1 branch advises with `claimed done but no implementation-summary.md recorded in <folder>`.

The adapter calls `appendAdvisoryLog(projectDir, detail)` to write the bounded log line. The log holds 256 KB and rotates to `.1`. Each line reads `<ISO timestamp> [completion-evidence-sentinel] <detail>`.

The core never writes stdout or stderr. `sweepStaleSentinelState` prunes aged dedup entries, stray temp files and the rotated log backup. It runs on a throttled, locked pass. OpenCode calls it on `session.created`. The Claude, Codex and Devin Stop adapters call it as a best-effort step.

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins and the completion-state helper. The adapters add `shared/hook-flags`. |
| Decisions | `ok` or `advise`. Never `block`. |
| Evidence | Recorded artifacts only. |
| Failure | Fail-open on every path. |
| State | One dedup store and one bounded log. |
| Output | The core writes nothing. |

The core imports Node builtins, `node:child_process` and `.skilled/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs`. That helper supplies the `check-completion.sh` path and the JSON-parse helper. Adapters import the core and `shared/hook-flags`, in the `.cjs`, `.mjs` or `.ts` flavor of their runtime.

The sentinel is advisory-only. A bug or a false positive can never force continuation. A detected claim against a resolved packet advises unless the check could not run or the pair was already advised. No adapter ever emits `{decision:"block"}`.

Failure is fail-open on every path. That covers a missing payload, a missing spec folder and a missing checklist. It also covers a spawn failure, a timeout and a non-zero exit with no recoverable stdout. A dedup write error, a log write error and a sweep error resolve the same way.

State lives in a dedup store and an advisory log. The dedup store is `.skilled/skills/.state/completion-sentinel/advisory-dedup.json`, written atomically per spec folder. The advisory log is `.skilled/logs/completion-sentinel-advisories.log`, capped at 256 KB and rotated to `.1`. The sweep prunes entries older than the retention window.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `Stop [id completion-evidence-stop, timeout 10]` | `claude/completion-evidence-stop.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | One `stderr` warning line, plus a log line. |
| Codex | `Stop [id completion-evidence-stop, timeout 10]` | `codex/completion-evidence-stop.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | One `stderr` warning line, plus a log line. |
| Cursor | `afterAgentResponse [id completion-evidence-stop, timeout 10]` | `cursor/completion-evidence-response.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | Nothing. The advisory goes to the log. |
| Devin | `Stop [id completion-evidence-stop, timeout 10]` | `devin/completion-evidence-stop.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | One `stderr` warning line, plus a log line. |
| DSH | `agent/turn-stopping` | `dsh/completion-evidence.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs` | An injected notice, prefixed `[completion-evidence]`. |
| OpenCode | `session.created, session.idle` | `opencode/system-completion-sentinel.js` | `.opencode/plugins/system-completion-sentinel.js` | Nothing. The advisory goes to the log. |
| OpenCode | None, a tool named `system_speckit_completion` | `opencode/system-speckit-completion.js` | `.opencode/plugins/system-speckit-completion.js` | The tool's pretty-printed JSON. |
| Pi | `turn_end` | `pi/completion-evidence.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | Nothing. The model sees it next turn. |
| Vibe | `post_agent`, called from the `turn-end` hook | `vibe/completion-evidence-post-agent.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | Nothing. The next turn's start injects it. |

Claude registers the hook in `.claude/settings.json`, Codex in `.codex/hooks.json` and Devin in `.devin/hooks.v1.json`. Cursor registers it in `.cursor/hooks.json` and Vibe registers the `turn-end` hook in `.vibe/hooks.toml`. Pi loads a one-line re-export in `.pi/extensions/` and the DSH `repo-guards` bundle loads its adapter.

Claude, Codex and Devin read the claim from `payload.last_assistant_message`. All three resolve the folder with `readLastSpecFolder`. That reads `${tmpdir()}/speckit-claude-hooks/<hash>/<hash>.json`, the shared lifecycle state file. Codex stays dormant-safe when its payload omits the message field. Devin prefers `payload.cwd`, then `DEVIN_PROJECT_DIR`, then the process folder.

Cursor reads `payload.text` and Pi flattens `event.message.content`, a string or `TextContent[]`. Both try `resolveSpecFolderFromText(claimText)` first. Cursor falls back to `readLastSpecFolder`. Pi falls back to the same reader, keyed by `ctx.sessionManager.getSessionId()`.

DSH takes the folder from the text only, with no lifecycle state file. It injects a user message, declares `ERROR_POLICY = 'fail-open'` and logs a throw through `ctx.logger.warn`.

Vibe's `post_agent` payload carries only the session root. The adapter reads the reply through the journal reader as `lastAssistantText`. It takes the folder from `VIBE_SPEC_FOLDER`. It writes a pending file under the session's project root. The `turn-start` composer injects that file once on the next main turn.

`session.idle` hands over neither the message nor the active packet. The adapter recovers the text with `resolveLastAssistantText` through `ctx.client.session.messages()`. It fetches the last 20 messages and finds the last assistant entry. It resolves the folder from the text alone, with no lifecycle state file. The tool plugin takes `specFolder` as an argument instead.

The Stop adapters skip a re-entrant `stop_hook_active`. Pi queues a model-visible next-turn advisory with `display: false` and `deliverAs: "nextTurn"`, so the human sees nothing. The call is `pi.sendMessage({customType:"completion-evidence-advisory", content, display:false}, {deliverAs:"nextTurn"})` and the content starts with `[completion-evidence]`.

The two OpenCode links exist for browsing. OpenCode loads plugins by a flat glob over `.opencode/plugins/` and does not recurse, so the real files stay there. The per-runtime adapters under `claude/`, `codex/`, `devin/`, `cursor/`, `dsh/`, `pi/` and `vibe/` are links back into `system-spec-kit/runtime/hooks/`.

The OpenCode plugins never write stdout or stderr, because OpenCode paints that output onto the prompt line. The tool plugin replaces a hand-composed pair of Bash calls at the completion-verification gate. It registers no event hook, so it cannot touch the TUI. The tool reports a failing section as `unavailable` in its JSON instead of throwing.

A `post_agent` deny becomes a retry message, so the Vibe part never uses one. It never prints and never denies.

---

## 4. DIRECTORY TREE

```text
completion-evidence/
+-- README.md
+-- claude/    completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs
+-- codex/     completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs
+-- cursor/    completion-evidence-response.mjs -> ../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs
+-- devin/     completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs
+-- dsh/       completion-evidence.mjs -> ../../../skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs
+-- opencode/
|   +-- system-completion-sentinel.js -> ../../../../.opencode/plugins/system-completion-sentinel.js
|   `-- system-speckit-completion.js -> ../../../../.opencode/plugins/system-speckit-completion.js
+-- pi/        completion-evidence.ts -> ../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts
+-- tests/     dsh-completion-evidence.test.mjs
`-- vibe/      completion-evidence-post-agent.cjs -> ../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs
```

Each runtime folder here holds a link to its real adapter. The `tests/` folder holds the DSH parity suite.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | The runtime-neutral core. It holds `detectCompletionClaim`, `resolveSpecFolderFromText`, `evaluateCompletionEvidence`, `appendAdvisoryLog` and `sweepStaleSentinelState`. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | The Claude `Stop` adapter. It reads `last_assistant_message`, resolves the folder from the lifecycle state file and logs to `stderr` and the advisory log. |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | The Codex `Stop` adapter. It has the same shape as Claude and stays dormant-safe without the message field. |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | The Devin `Stop` adapter. It has the same shape as Claude and prefers the payload folder. |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | The Cursor `afterAgentResponse` adapter. It reads `payload.text` and resolves the folder from text, then from the lifecycle state file. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs` | The DSH `agent/turn-stopping` adapter. It reads the turn's assistant message from the session snapshot and injects the advisory as a notice. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | The Pi `turn_end` extension. It flattens the message content and resolves the folder from text then state. Then it queues the next-turn advisory. |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | The Vibe `post_agent` part. It reads the reply through the journal reader, evaluates `VIBE_SPEC_FOLDER` and writes the pending file. |
| `.opencode/plugins/system-completion-sentinel.js` | The OpenCode `session.idle` plugin. It resolves the last assistant text through `ctx.client`, resolves the folder from text and logs the advisory. |
| `.opencode/plugins/system-speckit-completion.js` | The OpenCode read-only tool `system_speckit_completion`. It returns a folder's inferred level, checklist P0/P1/P2 completion with evidence gaps and placeholder completeness. |
| `.skilled/hooks/completion-evidence/tests/dsh-completion-evidence.test.mjs` | The DSH parity suite. It checks the no-claim case and the fail-open throw policy. |

---

## 6. CONFIGURATION

The concern is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_COMPLETION_DISABLED=1` | Full no-op on every runtime. The shared resolver `isHookEnabled('completion')` short-circuits every adapter. |
| `SYSTEM_COMPLETION_SENTINEL_DISABLED=1` | An alias of the same switch. The core also reads it through `KILL_SWITCH_ENV`, so it disables the core even when an adapter's resolver check is bypassed. |
| `SYSTEM_SPECKIT_COMPLETION_DISABLED=1` | An alias of the `completion` concern. It disables the tool and every adapter. |
| `SYSTEM_HOOKS_DISABLED=1` | The master switch. It disables this concern along with every other repository hook. |
| `SPECKIT_COMPLETION_SENTINEL_CHECK_TIMEOUT_MS` | Overrides the `check-completion.sh` spawn timeout. The default is 1200 ms. |
| `SPECKIT_COMPLETION_SENTINEL_LOG_MAX_BYTES` | Overrides the advisory log size cap. The default is 256 KB. |
| `SYSTEM_COMPLETION_SENTINEL_RETENTION_DAYS` | Overrides the dedup-entry retention window. The default is 30 days. |
| `SYSTEM_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS` | Overrides the sweep throttle. The default is 1 hour. |

The tool plugin checks the `completion` concern at registration time and returns an empty plugin, so `SYSTEM_HOOKS_DISABLED=1` drops it too.

Set a flag inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment always wins over the file.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .opencode/plugins/tests/system-completion-sentinel.test.cjs
```

Expected result: all tests pass. The suite covers the core and every Stop adapter. It also covers the OpenCode `session.created` sweep, its throttle, the kill switch and unrelated events.

```bash
node --test .skilled/hooks/completion-evidence/tests/dsh-completion-evidence.test.mjs
```

Expected result: all tests pass. The suite covers DSH parity with the core and the fail-open throw policy.

```bash
node -e "import('./.opencode/plugins/system-completion-sentinel.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok object`, the dual plugin export. It confirms the OpenCode adapter still resolves the core.

```bash
node -e "import('./.opencode/plugins/system-speckit-completion.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok object`, the dual plugin export. It confirms the tool plugin loads.

The suite at `.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts` reads this README. It asserts the Pi advisory wording above, so a reworded sentence fails the suite.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver the adapters use.
- [`../../skills/system-spec-kit/runtime/hooks/README.md`](../../skills/system-spec-kit/runtime/hooks/README.md): the owning skill's hook contract.
- [`../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`](../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs): the runtime-neutral core.
- [`../../../.opencode/plugins/README.md`](../../../.opencode/plugins/README.md): the OpenCode plugins index.
- [`tests/README.md`](tests/README.md): the DSH parity suite.
