---
title: "Completion Hooks: Completion-Evidence Gate"
description: "Advisory completion-evidence check that fires when an assistant claims completion, surfacing missing proof across Claude, Codex, Devin, Cursor, Pi, and the OpenCode plugins."
trigger_phrases:
  - "completion evidence hook"
  - "completion sentinel"
  - "done claim evidence check"
importance_tier: "important"
contextType: "reference"
---

# Completion Hooks: Completion-Evidence Gate

---

## 1. OVERVIEW

When the assistant claims a task is "done"/"complete"/"shipped"/"implemented", these hooks check that the claim carries objective evidence and surface a warning when it does not — the runtime realization of the framework's completion-verification rule. The policy lives in one runtime-neutral core (`completion-evidence-sentinel.cjs`); each runtime adapter maps its own "the assistant just finished" event onto it.

Advisory only: every adapter adds a warning to a bounded log (and, where the runtime allows, to model-visible context), never blocks or fails a turn. The core never executes a test, build, or `validate.sh` — it only does a bounded read of `check-completion.sh --json` output or a `stat` of `implementation-summary.md`.

Every file in this folder is a symlink. The real per-runtime adapters live in `system-spec-kit/runtime/hooks/{runtime}/`; the OpenCode plugins live in `.opencode/plugins/`. Edit the source there, not here.

---

## 2. WHAT IT DOES

`evaluateCompletionEvidence({ specFolder, claimText, projectDir, env })` is the core entrypoint. It:

1. Checks the kill switch. If disabled, returns `{decision:'ok'}`.
2. Runs `detectCompletionClaim(claimText)` — tests the **last 400 characters** of the assistant's message for claim words (`completed`, `resolved`, `fixed`, `finished`, `shipped`, `released`, `deployed`, `implemented`, `occurred`, `happened`). A claim word used mid-turn ("I fixed the earlier typo, now let me look at...") does not fire — only a claim anchored to the trailing slice.
3. Resolves the spec folder. If the folder has a `checklist.md`, spawns `check-completion.sh --json` under a bounded timeout (default 1200 ms) and checks the returned status against the advise set:

| Status | Advisory detail |
|---|---|
| `EVIDENCE_MISSING` | `claimed done but <N> completed P0/P1 checklist item(s) in <folder> lack an evidence marker` |
| `PRIORITY_CONTEXT_MISSING` | `claimed done but <N> checklist item(s) in <folder> are missing P0/P1/P2 priority context` |
| `P0_INCOMPLETE` | `claimed done but only <N>/<M> P0 checklist item(s) are complete in <folder>` |
| `P1_INCOMPLETE` | `claimed done but only <N>/<M> P1 checklist item(s) are complete in <folder>` |

   If the folder has no `checklist.md` (Level 1), it stats `implementation-summary.md` instead and advises when the file is absent: `claimed done but no implementation-summary.md recorded in <folder>`.

4. Applies per-spec-folder dedup. A fingerprint of `specFolder + claimText` is stored in `.opencode/skills/.state/completion-sentinel/advisory-dedup.json`; if the same packet+message pair was already advised, the advisory is suppressed. A persistence failure fails open to "not deduped" — the worst case is one extra advisory, never a blocked turn.
5. Returns `{decision:'advise', detail, deduped}` or `{decision:'ok', detail:null, deduped}`.

The adapter invokes `appendAdvisoryLog(projectDir, detail)` to write the bounded log line (256 KB, rotated to `.1`):

```text
<ISO timestamp> [completion-evidence-sentinel] <detail>
```

The core never writes stdout/stderr. The sweep (`sweepStaleSentinelState`) prunes aged dedup entries, stray temp files, and the rotated log backup on a throttled, locked pass — adapter-invoked on `session.created` (OpenCode) or as a best-effort step (Claude Stop).

A second OpenCode plugin, `system-speckit-completion.js`, is a **read-only tool** (`system_speckit_completion`), not a sentinel. It returns a spec folder's inferred level, checklist P0/P1/P2 completion with evidence gaps, and placeholder completeness percentage — replacing a hand-composed pair of Bash calls at the completion-verification gate. It shares the kill-switch family but has no event hooks and cannot touch the TUI.

---

## 3. PER-RUNTIME DELIVERY

Every adapter evaluates the **same** core. What differs is the event, how the claim text and spec folder are recovered, and how the advisory is delivered.

| Runtime | Adapter (symlink target) | Event | Claim text source | Spec folder source | Delivery |
|---|---|---|---|---|---|
| **Claude** | `claude/completion-evidence-stop.cjs` → `system-spec-kit/.../hooks/claude/` | `Stop` (`.claude/settings.json`) | `payload.last_assistant_message` | `readLastSpecFolder` from `${tmpdir()}/speckit-claude-hooks/<hash>/<hash>.json` (shared lifecycle state file) | `stderr` warning + advisory log. Never `{decision:"block"}` — advisory only. Skips re-entrant `stop_hook_active`. |
| **Codex** | `codex/completion-evidence-stop.cjs` → `system-spec-kit/.../hooks/codex/` | `Stop` (`.codex/hooks.json`) | `payload.last_assistant_message` (dormant-safe if Codex doesn't surface the field) | Same lifecycle state file as Claude | `stderr` warning + advisory log. |
| **Devin** | `devin/completion-evidence-stop.cjs` → `system-spec-kit/.../hooks/devin/` | `Stop` (`.devin/hooks.v1.json`) | `payload.last_assistant_message` | Same lifecycle state file | `stderr` warning + advisory log. |
| **Cursor** | `cursor/completion-evidence-response.mjs` → `system-spec-kit/.../hooks/cursor/` | `afterAgentResponse` | `payload.text` | `resolveSpecFolderFromText(claimText)` (regex on the claim text), then `readLastSpecFolder` fallback | Advisory log only (no stderr). |
| **Pi** | `pi/completion-evidence.ts` → `system-spec-kit/.../hooks/pi/` | `turn_end` | Flattens `event.message.content` (string or `TextContent[]`) | `resolveSpecFolderFromText(claimText)`, then `readLastSpecFolder` using `ctx.sessionManager.getSessionId()` | Advisory log + `pi.sendMessage({customType:"completion-evidence-advisory", content, display:false})` — model-visible. |
| **OpenCode** | `opencode/system-completion-sentinel.js` → `.opencode/plugins/` | `session.idle` (+ `session.created` for sweep) | `resolveLastAssistantText` via `ctx.client.session.messages()` (fetches last 20 messages, finds last assistant entry) | `resolveSpecFolderFromText(claimText)` only — no lifecycle state file | Advisory log only. **Never** stdout/stderr (TUI constraint). `session.created` triggers throttled state sweep. |
| **OpenCode** | `opencode/system-speckit-completion.js` → `.opencode/plugins/` | None (read-only tool) | N/A | Tool arg `specFolder` | Tool return value (pretty-printed JSON). Not a sentinel. |

The three Stop-event adapters (Claude, Codex, Devin) share the same structure: read stdin, check kill switch, skip re-entrant stops, extract claim text, resolve spec folder from the shared lifecycle state file, run the core, log to stderr + advisory log. Cursor and Pi resolve the spec folder from the claim text first (regex), falling back to the lifecycle state file. OpenCode resolves from text only — `session.idle` hands over neither the message nor the active packet, so the adapter must recover both itself (the message via `ctx.client`, the folder via regex).

OpenCode's real plugins cannot live in this tree because the loader globs `.opencode/plugins/` by a flat pattern, so `opencode/system-completion-sentinel.js` and `opencode/system-speckit-completion.js` are browsability-only symlinks back into that folder. The per-runtime adapters under `claude/`, `codex/`, `devin/`, `cursor/`, and `pi/` are symlinks back into `system-spec-kit/runtime/hooks/`.

---

## 4. DIRECTORY TREE

```text
completion/
+-- claude/   completion-evidence-stop.cjs   (symlink -> ../../../skills/system-spec-kit/runtime/hooks/claude/)
+-- codex/    completion-evidence-stop.cjs   (symlink -> ../../../skills/system-spec-kit/runtime/hooks/codex/)
+-- devin/    completion-evidence-stop.cjs   (symlink -> ../../../skills/system-spec-kit/runtime/hooks/devin/)
+-- cursor/   completion-evidence-response.mjs (symlink -> ../../../skills/system-spec-kit/runtime/hooks/cursor/)
+-- pi/       completion-evidence.ts        (symlink -> ../../../skills/system-spec-kit/runtime/hooks/pi/)
`-- opencode/
    +-- system-completion-sentinel.js       (symlink -> ../../../plugins/system-completion-sentinel.js)
    `-- system-speckit-completion.js        (symlink -> ../../../plugins/system-speckit-completion.js)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs` | The runtime-neutral core. `detectCompletionClaim` (tail-anchored regex), `resolveSpecFolderFromText` (regex extraction), `evaluateCompletionEvidence` (checklist or implementation-summary check + dedup), `appendAdvisoryLog` (bounded log), `sweepStaleSentinelState` (throttled sweep). Never writes stdout/stderr. |
| `system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | Claude `Stop` adapter. Reads `last_assistant_message`, resolves spec folder from the shared lifecycle state file, runs the core, logs to stderr + advisory log. Skips re-entrant `stop_hook_active`. |
| `system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | Codex `Stop` adapter. Same structure as Claude. Dormant-safe if Codex doesn't surface the message field. |
| `system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | Devin `Stop` adapter. Same structure as Claude. |
| `system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | Cursor `afterAgentResponse` adapter. Reads `payload.text`, resolves spec folder from text then lifecycle state, runs the core, logs to advisory log. |
| `system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | Pi `turn_end` extension. Flattens assistant message content, resolves spec folder from text then lifecycle state, runs the core, logs + sends `pi.sendMessage` (model-visible). |
| `.opencode/plugins/system-completion-sentinel.js` | OpenCode `session.idle` plugin. Resolves last assistant text via `ctx.client.session.messages()`, resolves spec folder from text, runs the core, logs to advisory log. `session.created` triggers sweep. Never stdout/stderr. |
| `.opencode/plugins/system-speckit-completion.js` | OpenCode read-only tool `system_speckit_completion`. Returns a spec folder's completion state (level, checklist P0/P1/P2, placeholder completeness). Not a sentinel — no event hooks. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_COMPLETION_DISABLED=1` | Full no-op on every runtime. The shared resolver (`isHookEnabled('completion')`) short-circuits every adapter. |
| `SYSTEM_COMPLETION_SENTINEL_DISABLED=1` | Legacy alias. Also checked inside `evaluateCompletionEvidence` itself (`KILL_SWITCH_ENV`), so it disables the core even if an adapter's resolver check is bypassed. |
| `SYSTEM_SPECKIT_COMPLETION_DISABLED=1` | Disables the `system_speckit_completion` tool (the OpenCode plugin checks this at registration time and returns an empty plugin). |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_COMPLETION_SENTINEL_CHECK_TIMEOUT_MS` | Override the `check-completion.sh` spawn timeout (default 1200 ms). |
| `SPECKIT_COMPLETION_SENTINEL_LOG_MAX_BYTES` | Override the advisory log size cap (default 256 KB). |
| `SYSTEM_COMPLETION_SENTINEL_RETENTION_DAYS` | Override the dedup-entry retention window (default 30 days). |
| `SYSTEM_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS` | Override the sweep throttle (default 1 hour). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins, `node:child_process`, and `../../../skills/system-spec-kit/runtime/cli/lib/completion-state.cjs` (for `check-completion.sh` path + JSON-parse helper). Adapters import the core and `shared/hook-flags` (`.cjs`/`.mjs`/`.ts` flavor per runtime). |
| Decisions | `ok` or `advise`. Never `block` — the sentinel is advisory-only for the entire v1 rollout. A bug or false-positive can never force continuation. |
| Evidence | The core checks recorded artifacts only: `check-completion.sh --json` output (checklist folders) or a `stat` of `implementation-summary.md` (Level 1 folders). It never runs a test, build, or `validate.sh`. |
| Failure | Fail-open on every path: missing payload, missing spec folder, missing checklist, spawn failure, timeout, non-zero exit with no recoverable stdout, dedup persistence error, log write error, sweep error — all resolve to `{decision:'ok'}` or a no-op. |
| State | Dedup store at `.opencode/skills/.state/completion-sentinel/advisory-dedup.json` (atomic writes, per-spec-folder fingerprint). Advisory log at `.opencode/logs/completion-sentinel-advisories.log` (256 KB, rotated to `.1`). Sweep prunes entries older than the retention window. |
| Output | The core never writes stdout/stderr. Adapters log to the bounded advisory log; the Stop-event adapters also warn to stderr; Pi sends a model-visible `pi.sendMessage`; OpenCode logs to file only (TUI constraint). |

---

## 8. VALIDATION

```bash
node --test .opencode/plugins/tests/system-completion-sentinel.test.cjs
```

Expected result: all tests pass (covers the core, the Claude/Codex/Devin Stop adapters, and the OpenCode `session.idle` adapter, including dedup and fail-open paths).

```bash
node -e "import('./.opencode/plugins/system-completion-sentinel.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok function` (confirms the OpenCode adapter still resolves the core).

```bash
node -e "import('./.opencode/plugins/system-speckit-completion.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok function` (confirms the tool plugin loads).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../skills/system-spec-kit/runtime/hooks/README.md`](../../skills/system-spec-kit/runtime/hooks/README.md): the owning skill's hook contract.
- [`../../skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`](../../skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs): the runtime-neutral core.
- [`../../plugins/README.md`](../../plugins/README.md): the OpenCode plugins index.
