---
title: "Dist Freshness Hook: Self-Healing Stale Builds"
description: "Detects a stale compiled dist build and rebuilds it so runtime code paths that import compiled scripts never lag their TypeScript sources. OpenCode plugin owns the projection; a per-runtime shell check surfaces a banner on the editor runtimes."
trigger_phrases:
  - "dist freshness guard"
  - "stale dist rebuild"
  - "self-healed a stale build"
importance_tier: "important"
contextType: "reference"
---

# Dist Freshness Hook: Self-Healing Stale Builds

---

## 1. OVERVIEW

`dist-freshness/` is the index for the concern that keeps compiled `dist/` output from lagging its TypeScript sources. Several repo packages publish compiled entrypoints that other code imports at runtime; a stale checkout build silently breaks every consumer. This concern compares the compiled output against its sources and, when stale, triggers a rebuild — so a session that imports a compiled script never runs against an out-of-date build. It is the hook behind the `DIST REBUILT: <package> -- self-healed a stale build at session start` line.

The concern has two faces that share one checker core (`dist-freshness.cjs`):

- **OpenCode plugin** (`.opencode/plugins/system-dist-freshness-guard.js`) owns the *projection* — the signal that reaches the agent mid-session. It checks all watched packages at session start, re-checks on risky Bash dispatches, invalidates on source edits, and injects a bounded brief into the system context per turn through a short-lived cache.
- **Per-runtime shell check** (`check-dist-staleness.sh`, a Python 3 script despite the `.sh` suffix) backs the editor runtimes. It runs edited-file-scoped on each PostToolUse and cross-package once per SessionStart, surfacing a bounded banner on stdout.

Both faces fail open: a check error, a missing checker, a spawn failure, or a build failure leaves the existing build in place and never blocks the session.

---

## 2. WHAT IT DOES

### OpenCode plugin (the projection)

`MkDistFreshnessGuardPlugin(ctx)` registers four hooks over the same `checkAllFreshness` core:

| Hook | Trigger | Action |
|---|---|---|
| `event` (`session.created`) | New session | Dedupes by session id (max 1000, LRU), then force-refreshes diagnostics and logs them |
| `event` (`session.deleted` / `server.instance.disposed` / `global.disposed`) | Session/instance teardown | Drops the session from the warned set; on instance dispose also clears the diagnostic cache |
| `tool.execute.before` (`bash`) | A Bash command matching `opencode\s+run` or `\bvalidate\.sh\b` | Force-refreshes diagnostics (a risky command is about to trust local dist) |
| `tool.execute.before` (mutating tools) | `write` / `edit` / `patch` / `multiedit` / `apply_patch` / `apply-patch` on a watched package source file | Invalidates the diagnostic cache so the next turn re-checks |
| `experimental.chat.system.transform` | Every chat turn | Injects a bounded brief (`[dist-freshness-guard] ...`) into `output.system` from a 120-second TTL cache |

The plugin never writes stdout/stderr — OpenCode's TUI paints plugin console output onto the prompt input line, where it sticks and corrupts the session. Instead it appends to a bounded workspace log `.opencode/logs/dist-freshness-guard.log` (256 KB cap, rotated to `.log.1`). Diagnostics are capped at 8 lines. Every error path is fail-open and logged.

### Per-runtime shell check (the banner)

`check-dist-staleness.sh` has two modes:

| Mode | Invocation | Scope | Auto-rebuild |
|---|---|---|---|
| Single-file (PostToolUse) | `check-dist-staleness.sh <file>` | The one watched package that owns `<file>` — fast and targeted | No — warns only |
| All-packages (SessionStart) | `check-dist-staleness.sh --all` | Every watched package — cross-package coverage | Yes, when `SPECKIT_DIST_AUTO_REBUILD` is on (default) |

It always exits 0. On a stale package it prints `STALE DIST WARNING: <package> -- run: <rebuildCommand>`; on a check error `DIST FRESHNESS CHECK ERROR: <package> -- <message>`; on a successful session-start rebuild `DIST REBUILT: <package> -- self-healed a stale build at session start`. The checker is invoked as `node .../dist-freshness.cjs` with an 8-second timeout; the rebuild runs with a 180-second timeout and falls back to the warning on any failure.

---

## 3. PER-RUNTIME DELIVERY

The coverage matrix marks the *projection* OpenCode-owned: the system-context injection that reaches the agent mid-session is OpenCode-only. The editor runtimes carry the per-runtime shell check that surfaces a stdout banner instead.

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **OpenCode** | `.opencode/plugins/system-dist-freshness-guard.js` (mirrored at `opencode/`) | Plugin `event` on `session.created` / teardown; `tool.execute.before` for Bash and mutating tools; `experimental.chat.system.transform` per turn | Bounded brief injected into `output.system`; audit log only, never stdout/stderr |
| **Claude** | `claude/check-dist-staleness.sh` (symlink → `sk-code-quality/scripts/`) | PostToolUse (single-file) + SessionStart (`--all`) | Bounded stdout banner; always exits 0 |
| **Codex** | `codex/check-dist-staleness.sh` (symlink) | PostToolUse (single-file) + SessionStart (`--all`) | Bounded stdout banner |
| **Cursor** | `cursor/check-dist-staleness.sh` (symlink) | PostToolUse (single-file) + SessionStart (`--all`) | Bounded stdout banner |
| **Devin** | `devin/check-dist-staleness.sh` (symlink) | PostToolUse (single-file) + SessionStart (`--all`) | Bounded stdout banner |
| **Pi** | — | — | `by-design`: OpenCode plugin owns source/dist freshness projection; no Pi adapter |

OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/system-dist-freshness-guard.js` is a browsability-only symlink back into that folder and nothing loads through it.

---

## 4. DIRECTORY TREE

```text
dist-freshness/
+-- README.md
+-- claude/   check-dist-staleness.sh  (symlink -> ../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh)
+-- codex/    check-dist-staleness.sh  (symlink)
+-- cursor/   check-dist-staleness.sh  (symlink)
+-- devin/    check-dist-staleness.sh  (symlink)
`-- opencode/ system-dist-freshness-guard.js (browsability symlink -> ../../../plugins/system-dist-freshness-guard.js)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/plugins/system-dist-freshness-guard.js` | The OpenCode plugin. Exports `MkDistFreshnessGuardPlugin(ctx)`. Session-start refresh, risky-Bash refresh, mutation invalidation, per-turn system-context injection (120s TTL cache), bounded audit log. Fail-open on every path. |
| `.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The per-runtime shell check (Python 3). Single-file PostToolUse and `--all` SessionStart modes; stdout banner; session-start auto-rebuild. Always exits 0. |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | The shared checker core both faces call: `checkAllFreshness`, `check-file`, `check-all`, `formatWarning`, `formatCheckError`, `packageForSourceFile`. Not in this folder. |
| `.opencode/hooks/shared/hook-flags.cjs` | The shared kill-switch resolver the plugin imports (`isHookEnabled('dist-freshness')`). The shell check re-implements the same resolution from `hook-flags.env`. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_DIST_FRESHNESS_DISABLED=1` | Canonical kill-switch. The plugin short-circuits (`isHookEnabled` returns false); the shell check exits 0 immediately. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_DIST_AUTO_REBUILD=0` | Toggles session-start auto-rebuild (default on). This is **not** a kill-switch — it leaves the freshness check active and only suppresses the self-healing rebuild, so a stale build warns instead of rebuilding. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Self-healing | Session-start (`--all` / `session.created`) rebuilds a stale package in place; a broken or slow build (180s timeout) falls back to the warning and never blocks the session. |
| Fail-open | Missing checker, spawn failure, check error, rebuild failure, log write failure, or any internal error leaves the existing build in place and resolves to a no-op or warning. |
| Output | The plugin never writes stdout/stderr (TUI corruption); it logs to a bounded workspace log and injects through `output.system`. The shell check prints a bounded stdout banner and always exits 0. |
| Bounded | Plugin: 120s diagnostic TTL, 256 KB log (rotated), 1000-session LRU, 8 diagnostic lines. Shell: 8s checker timeout, 180s rebuild timeout. |
| Imports | The plugin imports Node builtins, `../hooks/shared/hook-flags.cjs`, and `../skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`. The shell check shells out to the same `.cjs` via `node`. Nothing outside the repo. |
| Real code | Stays in `.opencode/plugins/` and `sk-code-quality/scripts/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
# Verify the OpenCode plugin loads without error
node -e "import('./.opencode/plugins/system-dist-freshness-guard.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok function`.

```bash
# Verify the shell check runs (all-packages mode) and always exits 0
python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all; echo "exit: $?"
```

Expected result: `exit: 0`, with a `STALE DIST WARNING` / `DIST REBUILT` / `DIST FRESHNESS CHECK ERROR` line per affected package, or no output when every package is fresh.

```bash
# Verify the kill-switch short-circuits the shell check
SYSTEM_DIST_FRESHNESS_DISABLED=1 python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all; echo "exit: $?"
```

Expected result: `exit: 0`, no output.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the plugin uses.
- [`../../plugins/README.md`](../../plugins/README.md): the OpenCode plugins folder that loads `system-dist-freshness-guard.js`.
- [`../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`](../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh): the per-runtime shell check's real home.
