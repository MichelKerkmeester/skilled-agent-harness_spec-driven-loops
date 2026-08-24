---
title: "Codex Watchdog Hook: Codex Hook-Health Monitor"
description: "OpenCode plugin that watches Codex hook health and surfaces a warning when Codex hooks fail to fire or misbehave."
trigger_phrases:
  - "codex hooks watchdog"
  - "codex hook health"
importance_tier: "reference"
contextType: "reference"
---

# Codex Watchdog Hook: Codex Hook-Health Monitor

---

## 1. OVERVIEW

Codex reads hooks only from the user-global `~/.codex/hooks.json` — a file that can silently drift from the repo (stale checkout anchor, missing adapter, manual edit). Claude and OpenCode hooks are repo-local and cannot drift. The watchdog closes that gap: on each OpenCode session start it runs the Codex hook installer's non-mutating `--check` and records drift for the operator.

It runs as an **OpenCode plugin** (the observing runtime) that watches the Codex configuration. There is no adapter on any other runtime — this is an OpenCode-plugin-hosted concern. Surfacing only; repair stays an explicit installer run.

---

## 2. WHAT IT DOES

On `session.created`, the plugin:

1. Checks the `codex-watchdog` kill switch. If disabled, returns immediately.
2. Extracts the session ID and dedupes per session (bounded set, max 1000 entries with LRU eviction). A session that already warned is not re-checked.
3. Runs `node .opencode/bin/install-codex-hooks.mjs --check` via `execFileSync` with a 5-second timeout and `stdio: 'ignore'`. This is the installer's non-mutating verification mode — it exits 0 when the user-global Codex hooks match the repo, non-zero on drift.
4. If the check exits non-zero (drift detected, or the installer could not run), appends one line to the bounded workspace log `.opencode/logs/codex-hooks-watchdog.log`:

```text
<ISO timestamp> codex hook drift detected; run: node .opencode/bin/install-codex-hooks.mjs --check
```

The log is capped at 256 KB (truncated on overflow). The plugin never throws, never writes stdout/stderr (OpenCode's TUI paints console output onto the prompt input line), and never blocks a turn. Any error — missing installer, spawn failure, timeout, log write failure — resolves to a no-op.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **OpenCode** | `.opencode/plugins/codex-hooks-watchdog.js` (mirrored at `opencode/`) | Plugin `event` on `session.created` | Bounded workspace log only. Never stdout/stderr, never model context, never a thrown error. |
| **Claude** | — | — | Not applicable. Claude hooks are repo-local and cannot drift. |
| **Codex** | — | — | Not applicable. Codex is the *observed* runtime, not the observing one. |
| **Devin** | — | — | Not applicable. |
| **Cursor** | — | — | Not applicable. |
| **Pi** | — | — | Not applicable. |

OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/codex-hooks-watchdog.js` is a browsability-only symlink back into that folder and nothing loads through it.

---

## 4. DIRECTORY TREE

```text
codex-watchdog/
`-- opencode/ codex-hooks-watchdog.js (browsability symlink -> ../../../plugins/codex-hooks-watchdog.js)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/plugins/codex-hooks-watchdog.js` | The plugin. Exports `MkCodexHooksWatchdogPlugin(ctx)`. On `session.created`, dedupes by session ID, runs `install-codex-hooks.mjs --check` (5s timeout, `stdio: 'ignore'`), and logs drift to `.opencode/logs/codex-hooks-watchdog.log` (256 KB cap). Fail-open on every error path. |
| `.opencode/bin/install-codex-hooks.mjs` | The Codex hook installer. `--check` is the non-mutating verification mode the watchdog calls; the operator runs it without `--check` to repair drift. Not in this folder. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `CODEX_HOOKS_WATCHDOG_DISABLED=1` | Full no-op. The canonical flag for this concern (set in `CONCERN_CANONICAL` in `hook-flags.cjs`). |
| `CODEX_WATCHDOG_DISABLED=1` | Legacy alias. Also disables the concern. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins only, plus `../hooks/shared/hook-flags.cjs` via `createRequire`. |
| Decisions | Advisory only. Emits a log line on drift; never blocks a turn, never throws, never writes stdout/stderr. |
| Failure | Fail-open on every path: disabled kill switch, missing installer, spawn failure, timeout, non-zero exit, log write failure — all resolve to a no-op. |
| State | Per-session dedupe set (max 1000, LRU eviction). Bounded log file (256 KB, truncated on overflow). No persistent state outside the log. |

---

## 8. VALIDATION

```bash
# Verify the plugin loads without error
node -e "import('./.opencode/plugins/codex-hooks-watchdog.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok function`.

```bash
# Verify the kill switch short-circuits
CODEX_HOOKS_WATCHDOG_DISABLED=1 node -e "
  import('./.opencode/plugins/codex-hooks-watchdog.js').then(async m => {
    const plugin = await m.default({ directory: process.cwd() });
    // session.created with disabled flag -> no log written, no throw
    await plugin.event({ event: { type: 'session.created', sessionID: 'test' } });
    console.log('ok');
  });
"
```

Expected result: `ok`, no log line appended.

```bash
# Verify drift detection logs (requires a drifted ~/.codex/hooks.json)
node .opencode/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result: exit 0 when hooks are in sync; non-zero on drift. The watchdog logs the remediation line only on non-zero.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the plugin uses.
- [`../../plugins/README.md`](../../plugins/README.md): the OpenCode plugins index.
- [`../../bin/install-codex-hooks.mjs`](../../bin/install-codex-hooks.mjs): the Codex hook installer whose `--check` mode the watchdog calls.
