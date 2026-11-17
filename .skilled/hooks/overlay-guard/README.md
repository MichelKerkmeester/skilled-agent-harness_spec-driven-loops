---
title: 'Overlay Guard: Refuse Edits to Overlay-Owned Files'
description: 'Pre-write guard that refuses writes to overlay-owned files across eight runtimes and returns the engine refusal line.'
trigger_phrases:
  - 'overlay guard'
  - 'overlay owned file'
  - 'pre write overlay guard'
  - 'opencode overlay guard'
  - 'opencode overlay owned write'
  - 'opencode overlay plugin link'
importance_tier: 'normal'
contextType: 'reference'
---

# Overlay Guard: Refuse Edits to Overlay-Owned Files

---

## 1. OVERVIEW

`overlay-guard/` checks a file write before the runtime applies it. If the overlay engine owns the destination, it refuses the call and names the overlay copy to edit.

The shared policy lives in `lib/overlay-guard.cjs`. The core asks `.skilled/commands/doctor/scripts/overlay-engine.cjs` to read the overlay setting and manifest. It does not read either itself.

The concern key is `overlay-guard`. `SYSTEM_OVERLAY_GUARD_DISABLED=1` turns off this concern. `SYSTEM_HOOKS_DISABLED=1` turns off every repository hook.

The guard never applies an overlay or changes the target file.

---

## 2. HOW IT WORKS

`evaluateWrite()` resolves each path against the session directory. It asks the engine to run `--guard` once for each unique path. One `refuse:` line denies the call. An `allow` answer for every path lets the runtime continue.

`fileFieldPath()` reads a path from a tool input. `pathsFromPatch()` reads file headers and move targets from a patch body.

| Engine result | Decision | Effect |
|---|---|---|
| `refuse:` for any path | `deny` | The runtime blocks the call and shows the engine line. |
| `allow` for each path | `allow` | The runtime continues. |
| No paths or no manifest | `allow` | The core starts no engine process. |
| Engine error or timeout | `allow` | The adapter reports a note through its runtime. |

With `strictWrites: true`, the engine can also refuse writes to unowned paths inside the manifest's vendored scope.

When neither `.skilled-overlays.json` nor `skilled-overlays/` exists at the tree root, the core allows after two existence checks. It does not start the engine. If the engine cannot read the setting or it errors or times out, the core allows the write and adds a note.

The core does not inspect shell command text. A file change made through a shell command bypasses this guard.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | Deny response |
|---|---|---|---|---|
| Claude | `PreToolUse` | `claude/overlay-guard.cjs` | `.skilled/hooks/overlay-guard/claude/overlay-guard.cjs` | `permissionDecision: deny` envelope on stdout, exit 0. |
| Codex | `PreToolUse` | `codex/overlay-guard.cjs` | `.skilled/hooks/overlay-guard/codex/overlay-guard.cjs` | `permissionDecision: deny` envelope on stdout, exit 0. |
| Cursor | `preToolUse` | `cursor/overlay-guard.mjs` | `.skilled/hooks/overlay-guard/cursor/overlay-guard.mjs` | `permission: deny` envelope with the reason, exit 2. |
| Devin | `PreToolUse` | `devin/overlay-guard.cjs` | `.skilled/hooks/overlay-guard/devin/overlay-guard.cjs` | `permissionDecision: deny` envelope on stdout, exit 0. |
| OpenCode | `tool.execute.before` | `opencode/overlay-guard.js` | `.opencode/plugins/overlay-guard.js` | Throws an error with the engine refusal line. |
| Pi | `tool_call` | `pi/overlay-guard.ts` | `.skilled/hooks/overlay-guard/pi/overlay-guard.ts` | Returns `{ block: true, reason }`. |
| DSH | `tools/pre-execute` | `dsh/overlay-guard.mjs` | `.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs` | Returns `{ kind: 'deny', reason }`. |
| Vibe | `pre_tool` | `vibe/overlay-guard.mjs` | `.vibe/plugins/repo-guards/overlay-guard.mjs` | Writes a deny object to stdout, exit 0. |

Claude registers in `.claude/settings.json` on `PreToolUse` with matcher `Write|Edit|MultiEdit` and a 10 second timeout. Codex registers in `.codex/hooks.json` on `PreToolUse` with matcher `apply_patch|edit` and a 10 second timeout. Cursor registers in `.cursor/hooks.json` on `preToolUse` with matcher `Write` and a 10 second timeout. Its registration has no fallback chain, so exit 2 reaches Cursor. Devin registers in `.devin/hooks.v1.json` on `PreToolUse` with matcher `^(edit|write)$` and a 10 second timeout.

The `overlay-guard` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` supplies those four registrations and Pi's extension entry. OpenCode loads JavaScript plugins through a flat glob over `.opencode/plugins/`. Pi discovers `.pi/extensions/overlay-guard.ts`, which re-exports `pi/overlay-guard.ts`.

The DSH bundle at `.dsh/plugins/repo-guards/index.mjs` imports the adapter through `.dsh/plugins/repo-guards/adapters/overlay-guard.mjs`. That link points to `dsh/overlay-guard.mjs`. Vibe registers `overlay-guard` in `.vibe/hooks.toml` as a strict `pre_tool` hook with match `re:write_file|edit`. It checks both the session directory and this checkout.

An engine failure does not create a denial. If none of the checks returns a refusal, the adapter allows the write. Claude and Codex approve with exit 0 and no stdout when allowed. Devin uses the same output path. Cursor returns its allow envelope. Pi returns `undefined`. DSH calls `next()` and logs notes. OpenCode writes notes to its bounded log. Vibe allows with empty stdout.

An internal error does not block a write. Claude, Codex, Devin and Cursor print one line to stderr. Pi swallows the error. DSH logs through the plugin logger. OpenCode writes to its log. Vibe prints one line to stderr.

---

## 4. DIRECTORY TREE

```text
overlay-guard/
+-- README.md
+-- claude/
|   +-- README.md
|   `-- overlay-guard.cjs
+-- codex/
|   +-- README.md
|   `-- overlay-guard.cjs
+-- cursor/
|   +-- README.md
|   `-- overlay-guard.mjs
+-- devin/
|   +-- README.md
|   `-- overlay-guard.cjs
+-- dsh/
|   +-- README.md
|   `-- overlay-guard.mjs
+-- lib/
|   +-- README.md
|   +-- overlay-guard.cjs
|   `-- overlay-guard.test.cjs
+-- opencode/
|   `-- overlay-guard.js -> .opencode/plugins/overlay-guard.js
+-- pi/
|   +-- README.md
|   `-- overlay-guard.ts
+-- tests/
|   +-- README.md
|   +-- dsh-overlay-guard.test.mjs
|   `-- opencode-overlay-guard.test.mjs
`-- vibe/
    `-- overlay-guard.mjs -> .vibe/plugins/repo-guards/overlay-guard.mjs
```

The runtime folders with READMEs cover Claude, Codex, Cursor, Devin, DSH and Pi. The OpenCode and Vibe folders point to their real plugin files.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/overlay-guard.cjs` | Shared policy and payload helpers. |
| `../../commands/doctor/scripts/overlay-engine.cjs` | Reads overlay settings and answers the `--guard` query. |
| `../shared/hook-flags.cjs` | Resolves the concern switch and master switch. |
| `../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds registration data for Claude, Codex, Cursor, Devin and Pi. |

---

## 6. CONFIGURATION

The concern is on by default. Any of `1`, `true`, `yes` or `on` disables either switch, regardless of case.

| Switch | Effect |
|---|---|
| `SYSTEM_OVERLAY_GUARD_DISABLED=1` | Turns off this guard across runtimes. |
| `SYSTEM_HOOKS_DISABLED=1` | Turns off every repository hook. |

Set a switch inline or export it for a session. To keep it, copy `.skilled/hooks/hook-flags.env.example` to `.skilled/hooks/hook-flags.env`. The environment takes precedence over the file.

---

## 7. VALIDATION

The core suite covers the policy and five runtime adapters in [`lib/overlay-guard.test.cjs`](./lib/overlay-guard.test.cjs). The DSH suite is in [`tests/dsh-overlay-guard.test.mjs`](./tests/dsh-overlay-guard.test.mjs). The OpenCode suite is in [`tests/opencode-overlay-guard.test.mjs`](./tests/opencode-overlay-guard.test.mjs).

Run the DSH suite from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/tests/dsh-overlay-guard.test.mjs
```

Expected result: every test passes and the command exits 0.

Run the disabled-switch smoke check from the repository root.

```bash
SYSTEM_OVERLAY_GUARD_DISABLED=1 node .skilled/hooks/overlay-guard/claude/overlay-guard.cjs < /dev/null
```

Expected result: no stdout or stderr and exit status 0.

---

## 8. RELATED

- [hooks tree](../README.md): the shared runtime coverage matrix.
- [shared hook helpers](../shared/README.md): the switch resolver used by the adapters.
- [OpenCode plugin discovery](../../../.opencode/plugins/README.md): how OpenCode loads plugins from its local folder.
- [DSH guard bundle](../../../.dsh/plugins/repo-guards/README.md): how the bundle registers this adapter.

<!-- readme-check
allow-ref .skilled-overlays.json | the overlay setting file sits at the root of a host repository that vendors Skilled, not in this checkout
-->
