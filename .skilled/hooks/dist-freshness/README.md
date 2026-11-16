---
title: "Dist Freshness Hook: Self-Healing Stale Builds"
description: "Detects a stale compiled dist build and rebuilds it so runtime code paths that import compiled scripts never lag their TypeScript sources. OpenCode plugin owns the projection; a per-runtime shell check surfaces a banner on the editor runtimes."
trigger_phrases:
  - "dist freshness guard"
  - "stale dist rebuild"
  - "self-healed a stale build"
  - "claude dist freshness"
  - "dist staleness check"
  - "claude stale build warning"
  - "codex dist freshness"
  - "codex dist staleness check"
  - "codex stale build warning"
  - "cursor dist freshness"
  - "cursor dist staleness check"
  - "cursor stale build warning"
  - "devin dist freshness"
  - "devin dist staleness check"
  - "devin stale build warning"
  - "opencode dist freshness"
  - "opencode stale build warning"
importance_tier: "important"
contextType: "reference"
---

# Dist Freshness Hook: Self-Healing Stale Builds

---

## 1. OVERVIEW

`dist-freshness/` indexes the concern that keeps compiled `dist/` output from lagging its TypeScript sources. Several repository packages publish compiled entrypoints that other code imports at runtime. A stale checkout build breaks every consumer without a word. This concern compares the compiled output against its sources and rebuilds a stale package. It is the hook behind the `DIST REBUILT: <package> -- self-healed a stale build at session start` line.

The concern has two faces that share one checker core. The OpenCode plugin owns the projection, the signal that reaches the agent mid-session. The per-runtime shell check backs the editor runtimes with a stdout banner.

- **OpenCode plugin** (`.opencode/plugins/system-dist-freshness-guard.js`) owns the projection. It checks every watched package at session start and re-checks before a risky Bash dispatch. It invalidates on a source edit and injects a bounded brief per turn from a short-lived cache.
- **Per-runtime shell check** (`check-dist-staleness.sh`, a Python 3 program behind a `.sh` name) backs the editor runtimes. It runs edited-file-scoped after an edit and cross-package once per session start. It prints a bounded banner on stdout.

Both faces fail open. A check error, a missing checker, a spawn failure, a log write failure or a build failure leaves the existing build in place. No path blocks the session.

---

## 2. HOW IT WORKS

`MkDistFreshnessGuardPlugin(ctx)` registers three hook names over the same `checkAllFreshness` core.

| Hook | Trigger | Action |
|---|---|---|
| `event` (`session.created`) | New session | Dedupes by session id, then force-refreshes diagnostics and logs them |
| `event` (`session.deleted` / `server.instance.disposed` / `global.disposed`) | Session or instance teardown | Drops the session from the warned set, and clears the cache on instance dispose |
| `tool.execute.before` (`bash`) | A Bash command matching `opencode\s+run` or `\bvalidate\.sh\b` | Force-refreshes diagnostics before a risky command trusts local dist |
| `tool.execute.before` (mutating tools) | `write` / `edit` / `patch` / `multiedit` / `apply_patch` / `apply-patch` on a watched source file | Invalidates the diagnostic cache so the next turn re-checks |
| `experimental.chat.system.transform` | Every chat turn | Injects a bounded brief (`[dist-freshness-guard] ...`) into `output.system` from a 120-second TTL cache |

The trigger regex is `/\bopencode\d*\s+run\b|\bvalidate\.sh\b/i`. It ignores case and accepts a digit after `opencode`.

The warned set holds at most 1000 session ids and drops the oldest first. The diagnostic cache lives 120 seconds. Diagnostics are capped at 8 lines.

The plugin never writes stdout or stderr. OpenCode's TUI paints plugin console output onto the prompt input line, where it sticks and corrupts the session. The plugin appends to a bounded workspace log instead, `.skilled/logs/dist-freshness-guard.log`. That log caps at 256 KB and rotates to `.log.1`. Every error path is fail-open, and every one except a failed log write is logged.

`check-dist-staleness.sh` has two modes.

| Mode | Invocation | Scope | Auto-rebuild |
|---|---|---|---|
| Single-file | `check-dist-staleness.sh <file>` | The one watched package that owns `<file>`, fast and targeted | No, warns only |
| All-packages | `check-dist-staleness.sh --all` | Every watched package, cross-package coverage | Yes, when `SPECKIT_DIST_AUTO_REBUILD` is on (default) |

The script exits 0 on every path except an unknown option, which exits 2. On a stale package it prints `STALE DIST WARNING: <package> -- run: <rebuildCommand>`. On a check error it prints `DIST FRESHNESS CHECK ERROR: <package> -- <message>`. On a successful session-start rebuild it prints `DIST REBUILT: <package> -- self-healed a stale build at session start`.

The script runs the checker with `node` and an 8-second timeout. The rebuild runs with a 180-second timeout and falls back to the warning on any failure.

The single-file check after an edit comes from `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, not from this folder, as [`../post-edit-quality/README.md`](../post-edit-quality/README.md) describes.

---

## 3. RUNTIME COVERAGE

The coverage matrix marks the projection OpenCode-owned. The system-context injection that reaches the agent mid-session is OpenCode-only. The editor runtimes carry the per-runtime shell check, which surfaces a stdout banner instead.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart [id check-dist-staleness, timeout 5]` | `claude/check-dist-staleness.sh` | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The stdout banner. A nonzero exit returns one `additionalContext` note and a stderr drift line. |
| Codex | `SessionStart [id check-dist-staleness, timeout 5]` | `codex/check-dist-staleness.sh` | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The stdout banner. A nonzero exit returns one `additionalContext` note and a stderr drift line. |
| Cursor | `sessionStart [id check-dist-staleness, timeout 10]` | `cursor/check-dist-staleness.sh` | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The stdout banner. A missing script returns one `agent_message`. |
| Devin | `SessionStart [id check-dist-staleness, timeout 5]` | `devin/check-dist-staleness.sh` | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The stdout banner only. No fallback line is registered. |
| OpenCode | `experimental.chat.system.transform, global.disposed, server.instance.disposed, session.created, session.deleted, tool.execute.before` | `opencode/system-dist-freshness-guard.js` | `.opencode/plugins/system-dist-freshness-guard.js` | A bounded brief in the system context, plus one line in the log. |
| Pi | `session_start` | None | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | A warning notification, whenever the script prints anything. |
| DSH | `agent/created` | None | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | An injected notice, prefixed with the check's label. |
| Vibe | `session_start`, `post_tool` | `vibe/dist-freshness.mjs` | `.vibe/plugins/repo-guards/dist-freshness.mjs` | A banner appended to the tool result as `hook_specific_output.additional_context`. |

Claude, Codex, Cursor and Devin run the check with `--all` at session start. The registry id is `check-dist-staleness`. Claude, Codex and Devin give it 5 seconds and Cursor gives it 10. The registered command runs the script with `python3`, as `.claude/settings.json` line 206 shows.

No registration names a path in this folder. The links exist for browsing and nothing loads through them.

OpenCode's real plugin cannot live in this tree, because its loader globs `.opencode/plugins/` by a flat pattern. So `opencode/system-dist-freshness-guard.js` is a browsability-only symlink back into that folder. Nothing loads through it.

Pi and DSH run the check from their session-start advisories, under the concern `dist-freshness`. The check is bundled into `session-start-advisories`, so neither runtime has an entry in this folder. Both pass on whatever the script prints, so a clean run shows nothing. Both stop when the `session-lifecycle` concern is off. DSH also skips a fan-out leaf.

`.skilled/hooks/session-lifecycle/vibe/session-start.mjs` runs the check with `--all` and adds its output to the session-start `additional_context`.

Vibe has two `post_tool` hooks in `.vibe/hooks.toml`, `dist-freshness-edit` and `dist-freshness-shell`. Both run `.vibe/plugins/repo-guards/dist-freshness.mjs`. The first matches `write_file` and `edit` and checks the one edited file. The second matches `bash` and `process_start` and reports only, when the command runs `validate.sh` or a headless dispatch. It runs the check with `--all` and with `SPECKIT_DIST_AUTO_REBUILD` set to `0`.

The entry is non-strict, so a check failure leaves the tool result intact. The coverage matrix in [`../README.md`](../README.md) marks Vibe `✓ covered` for this concern. It marks Pi and DSH `by-design`, because the check is bundled into `session-start-advisories`.

---

## 4. DIRECTORY TREE

```text
dist-freshness/
+-- README.md
+-- claude/    check-dist-staleness.sh -> ../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh
+-- codex/     check-dist-staleness.sh -> ../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh
+-- cursor/    check-dist-staleness.sh -> ../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh
+-- devin/     check-dist-staleness.sh -> ../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh
+-- opencode/  system-dist-freshness-guard.js -> ../../../../.opencode/plugins/system-dist-freshness-guard.js
`-- vibe/      dist-freshness.mjs -> ../../../../.vibe/plugins/repo-guards/dist-freshness.mjs
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/plugins/system-dist-freshness-guard.js` | The OpenCode plugin. It exports `MkDistFreshnessGuardPlugin(ctx)` and imports `../hooks/shared/hook-flags.cjs` and `../skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`, so nothing comes from outside the repository. Session-start refresh, risky-Bash refresh, mutation invalidation, per-turn injection from a 120-second cache, bounded audit log. Fail-open on every path. |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The per-runtime shell check, a Python 3 program. Single-file and `--all` modes, stdout banner, session-start auto-rebuild. It exits 0 on every path except an unknown option, which exits 2. |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | The shared checker core both faces call. It holds `checkAllFreshness`, `check-file`, `check-all`, `formatWarning`, `formatCheckError` and `packageForSourceFile`. |
| `.skilled/hooks/shared/hook-flags.cjs` | The shared kill-switch resolver the plugin imports, through `isHookEnabled('dist-freshness')`. The shell check re-implements the same resolution from `hook-flags.env`. |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Runs the same script in single-file mode after an edit. |

The shell check runs the core through `node .../dist-freshness.cjs`. The plugin loads it in-process with `require`.

---

## 6. CONFIGURATION

The concern is enabled by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_DIST_FRESHNESS_DISABLED=1` | Canonical kill-switch. The plugin short-circuits, because `isHookEnabled` returns false. The shell check exits 0 at once. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repository hook. |
| `SPECKIT_DIST_AUTO_REBUILD=0` | Turns off session-start auto-rebuild, which is on by default. It is not a kill-switch. The check stays active and a stale build warns instead of rebuilding. |

Set a flag inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment wins over the file, so a persisted default can be overridden for a single session.

---

## 7. VALIDATION

Run from the repository root.

```bash
node -e "import('./.opencode/plugins/system-dist-freshness-guard.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok object`, the dual plugin export.

```bash
python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all; echo "exit: $?"
```

Expected result: `exit: 0`, with a `STALE DIST WARNING` / `DIST REBUILT` / `DIST FRESHNESS CHECK ERROR` line per affected package, or no output when every package is fresh.

```bash
SYSTEM_DIST_FRESHNESS_DISABLED=1 python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all; echo "exit: $?"
```

Expected result: `exit: 0`, no output.

```bash
find .skilled/hooks/dist-freshness -type l | wc -l
```

Expected result: `5`.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the kill-switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the plugin uses.
- [`../post-edit-quality/README.md`](../post-edit-quality/README.md): the router that runs the single-file check after an edit.
- [`../../../.opencode/plugins/README.md`](../../../.opencode/plugins/README.md): the OpenCode plugins folder that loads `system-dist-freshness-guard.js`.
- [`../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`](../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh): the per-runtime shell check's real home.

<!-- readme-check
allow-ref .../dist-freshness.cjs | an ellipsis shorthand for the checker directory, named beside its full path
-->
