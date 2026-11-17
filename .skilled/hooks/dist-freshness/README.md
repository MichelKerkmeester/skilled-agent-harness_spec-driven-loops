---
title: "Dist Freshness: Check and Rebuild Stale Compiled Output"
description: "Checks compiled package output against its sources and reports stale builds. Session-start shell checks can rebuild stale output."
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

# Dist Freshness: Check and Rebuild Stale Compiled Output

---

## 1. OVERVIEW

`dist-freshness/` checks compiled `dist/` output against package sources. A stale result produces a warning. The `--all` shell check can rebuild stale packages at session start.

The shared core is `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`. The Python wrapper is `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`. It runs the core through `node`. The OpenCode plugin imports the core directly.

The concern key is `dist-freshness`. Its switch is `SYSTEM_DIST_FRESHNESS_DISABLED`. `SYSTEM_HOOKS_DISABLED` disables this concern and every other repository hook.

---

## 2. HOW IT WORKS

The core exposes `checkAllFreshness()`, `checkFileFreshness()`, `formatWarning()` and `formatCheckError()`. `checkAllFreshness()` checks every package in the registry. `checkFileFreshness()` maps one source path to its package.

The wrapper sends `--all` to `check-all`. With a file path, it runs `check-file`. Single-file mode warns but does not rebuild. The `--all` mode can rebuild stale packages. Rebuilding is on by default. Set `SPECKIT_DIST_AUTO_REBUILD=0` to keep that mode in warning-only behavior.

The OpenCode plugin refreshes on `session.created`. Before a Bash command runs, it refreshes again when the text matches `/\bopencode\d*\s+run\b|\bvalidate\.sh\b/i`. A mutating tool call clears the diagnostic cache when its path may belong to a watched package. A system transform injects stale or check-error details from the cache, which expires after 120 seconds.

The plugin writes diagnostics to `.skilled/logs/dist-freshness-guard.log`. The active log rotates at 256 KB to `.log.1`. The plugin writes no stdout or stderr.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What it shows |
|---|---|---|---|---|
| Claude | `SessionStart` | `claude/check-dist-staleness.sh` (browsing symlink) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Stdout banner. The wrapper adds an `additionalContext` note if the command fails. |
| Codex | `SessionStart` | `codex/check-dist-staleness.sh` (browsing symlink) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Stdout banner. The wrapper adds an `additionalContext` note if the command fails. |
| Cursor | `sessionStart` | `cursor/check-dist-staleness.sh` (browsing symlink) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Stdout banner. The wrapper sends an `agent_message` if the command fails. |
| Devin | `SessionStart` | `devin/check-dist-staleness.sh` (browsing symlink) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Stdout banner. No fallback is registered. |
| OpenCode | `session.created`, `session.deleted`, `server.instance.disposed`, `global.disposed`, `tool.execute.before` and `experimental.chat.system.transform` | `opencode/system-dist-freshness-guard.js` (browsing symlink) | `.opencode/plugins/system-dist-freshness-guard.js` | Stale or error details enter system context and the workspace log. |
| Pi | `session_start` | None (session-start bundle) | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | A warning notification appears when the check prints text. A clean check stays silent. |
| DSH | `agent/created` on startup | None (guard bundle) | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | A labeled notice is injected when the check prints text. Fan-out leaves skip the check. |
| Vibe | `session_start` and `post_tool` | `vibe/dist-freshness.mjs` (browsing symlink) | Session start: `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`<br>Post-tool: `.vibe/plugins/repo-guards/dist-freshness.mjs` | Startup and tool warnings go into `hook_specific_output.additional_context`. |

The shared registry gives the shell check the ID `check-dist-staleness`. It maps the startup commands in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`. Each command runs the Python checker with `--all`. The timeout is 5 seconds except for Cursor, which uses 10 seconds.

OpenCode loads the plugin through the flat `.opencode/plugins/*.js` glob. Pi loads `.pi/extensions/session-start-advisories.ts`, which re-exports its adapter. The DSH bundle in `.dsh/plugins/repo-guards/index.mjs` registers the session-start adapter.

Vibe registers its `session_start` hook and two `post_tool` checks in `.vibe/hooks.toml`. The session-start entry runs `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`. The post-tool entries run `.vibe/plugins/repo-guards/dist-freshness.mjs`.

The runtime entries in this folder are browsing symlinks. Claude, Codex, Cursor and Devin call the shared Python script directly. OpenCode and Vibe load the real files shown in the table. Pi and DSH run the checker through their session-start adapters.

---

## 4. DIRECTORY TREE

```text
dist-freshness/
+-- README.md
+-- claude/check-dist-staleness.sh
+-- codex/check-dist-staleness.sh
+-- cursor/check-dist-staleness.sh
+-- devin/check-dist-staleness.sh
+-- opencode/system-dist-freshness-guard.js
`-- vibe/dist-freshness.mjs
```

Pi and DSH have no directory here because their checks run inside session-start adapters.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Shared package registry and freshness checks. |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Python wrapper used by the runtime checks. |
| `.opencode/plugins/system-dist-freshness-guard.js` | OpenCode plugin for lifecycle checks and system-context injection. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | ID and runtime bindings for the shell check. |
| `.skilled/hooks/shared/hook-flags.cjs` | Concern and master switch resolver used by the OpenCode plugin. |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Exports `runDistStalenessCheck()` for a single-file edit check. |

---

## 6. CONFIGURATION

The concern is on by default. The kill switches turn it off when their value is `1`, `true`, `yes` or `on`, in any case.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_DIST_FRESHNESS_DISABLED=1` | `dist-freshness` | Turns off this concern across the runtime adapters. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off all repository hooks. |
| `SPECKIT_DIST_AUTO_REBUILD=0` | Shell checker | Stops `--all` from rebuilding stale output. The check still reports a warning. |

Set the first two switches inline or export them for a session. To persist them, write them in `.skilled/hooks/hook-flags.env`, a gitignored copy of `.skilled/hooks/hook-flags.env.example`. Environment values override the file. `SPECKIT_DIST_AUTO_REBUILD` is read from the process environment.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .vibe/plugins/repo-guards/tests/dist-freshness.test.mjs
```

Expected result: every test passes and none fails.

```bash
SYSTEM_DIST_FRESHNESS_DISABLED=1 python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all
```

Expected result: no output and exit status 0.

---

## 8. RELATED

- [hooks coverage matrix](../README.md): runtime coverage for the hooks tree.
- [shared freshness core](../../skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs): package freshness logic.
- [Python checker](../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh): the runtime command wrapper.

