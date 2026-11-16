---
title: "Overlay Guard: Refuse Edits to Overlay-Owned Files"
description: "Pre-write guard that refuses an edit to a file a vendored Skilled tree's overlay owns and names the overlay file to edit. With strict writes on it also refuses a vendored write no overlay owns. One runtime-neutral core, a thin adapter per runtime and a Vibe hook."
trigger_phrases:
  - "overlay guard"
  - "overlay owned file"
  - "pre write overlay guard"
  - "opencode overlay guard"
  - "opencode overlay owned write"
  - "opencode plugin link"
importance_tier: "normal"
contextType: "reference"
---

# Overlay Guard: Refuse Edits to Overlay-Owned Files

---

## 1. OVERVIEW

`overlay-guard/` stops an agent from editing a file that an overlay owns in a project that vendors Skilled. A vendored tree is replaced wholesale at each re-pin, and the overlay engine then puts the project's own versions back. An edit made directly to one of those files is lost at the next re-pin. The guard refuses that edit before it is written and names the overlay file to edit instead.

The concern is one runtime-neutral core plus a thin adapter per runtime. The core never judges ownership itself. It asks the overlay engine's `--guard` query once per path, so the engine stays the only reader of the overlay setting and the manifest. Two outcomes exist: `allow` (stay silent) and `deny` (refuse with the engine's message).

A project can widen what the engine refuses with `"strictWrites": true` in its overlay manifest. The engine then also refuses a new file or an edit to an upstream file no overlay owns. The paths it covers are `.skilled`, a runtime folder or a root file the manifest names. Its line names the overlay path to create or the `apply --adopt` command to run.

The guard needs no setting of its own for this, because it passes the engine's answer on. The key is off unless the project sets it.

The guard is pre-write only. It never applies overlays, captures a live edit or writes any file. A refused call leaves the tree byte-identical. After the operator edits the overlay, running the engine's `apply` is a separate, explicit step.

It ships to every Skilled repository, and nearly all of them have no overlays. In a tree with no overlay manifest it allows on two file-existence checks, without loading the engine or starting a process, and prints nothing.

---

## 2. HOW IT WORKS

The guard runs before a file write. It takes the path or paths the write names and resolves each against the session directory. Then it decides:

| Condition | Decision |
|---|---|
| The call names no path | `allow` |
| Neither `.skilled-overlays.json` nor `skilled-overlays/` exists at the tree root | `allow` at once, nothing loaded or spawned |
| The engine resolves the overlay folder and finds no `overlay-manifest.json` there | `allow`, no process spawned |
| The engine's `--guard` exits 1 for any named path | `deny` with the engine's `refuse:` line |
| The engine's `--guard` exits 0 for every path | `allow` |
| The engine errors, times out or cannot read the setting | `allow`, with a note the adapter prints on stderr, or logs in OpenCode and DSH |

The refusal is the engine's own line, for example:

```text
refuse: .skilled/owned/target.txt is owned by skilled-overlays/files/owned.txt; edit the overlay, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply
```

The core defaults its tree root to its own location, four levels above `lib/`. That is the same tree the engine treats as its default root. A path the engine could not judge is never refused. Only an engine `refuse:` answer blocks a write.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse` | `claude/overlay-guard.cjs` | `.skilled/hooks/overlay-guard/claude/overlay-guard.cjs` | A denied call, with `permissionDecision: "deny"` and the engine's reason. |
| Codex | `PreToolUse` | `codex/overlay-guard.cjs` | `.skilled/hooks/overlay-guard/codex/overlay-guard.cjs` | The same deny envelope, with the engine's reason. |
| Cursor | `preToolUse` | `cursor/overlay-guard.mjs` | `.skilled/hooks/overlay-guard/cursor/overlay-guard.mjs` | `{"permission":"deny"}` and exit 2, with the reason in both messages. |
| Devin | `PreToolUse` | `devin/overlay-guard.cjs` | `.skilled/hooks/overlay-guard/devin/overlay-guard.cjs` | The same deny envelope, with the engine's reason. |
| Pi | `tool_call` | `pi/overlay-guard.ts` | `.skilled/hooks/overlay-guard/pi/overlay-guard.ts` | `{ block: true, reason }`. |
| DSH | `tools/pre-execute` | `dsh/overlay-guard.mjs` | `.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs` | `{ kind: 'deny', reason }`. |
| OpenCode | `tool.execute.before` | `opencode/overlay-guard.js` | `.opencode/plugins/overlay-guard.js` | A thrown error carrying the engine's `refuse:` line. |
| Vibe | `pre_tool` | None | `.vibe/plugins/repo-guards/overlay-guard.mjs` | A `{"decision":"deny","reason":...}` object on stdout, with exit 0. |

Claude matches `Write\|Edit\|MultiEdit` and reads `tool_input.file_path`. Codex matches `apply_patch\|edit` and reads a path field or every `*** Add/Update/Delete File:` header and `*** Move to:` target in the patch. Cursor matches `Write` and reads `tool_input.file_path`, with the workspace root from `workspace_roots[0]`. Devin matches `^(edit\|write)$` and reads `tool_input.file_path`.

Pi matches the tools `edit` and `write` and reads `input.path`. DSH matches the tools `write`, `edit` and `apply_patch` and reads a path field or every file header in the patch. OpenCode matches the tools `write`, `edit`, `multiedit`, `patch` and `apply_patch`. It reads the `file_path`, `filePath` or `path` field. For a patch it also reads every `*** Add/Update/Delete File:` header and `*** Move to:` target in the body.

Vibe matches `bash`, `process_start`, `write_file` and `edit` and reads `tool_input.file_path`. The hook judges only `write` and `edit`, so a `bash` or `process_start` call is allowed.

Shell commands are not parsed. A write made through `Bash`, `exec` or `Shell` is not guarded.

The Cursor registration carries no fallback chain. Cursor blocks on exit 2, and a `|| { fallback }` chain would run on that exit. It would append an allow envelope and exit 0, so the refusal would never reach Cursor.

Pi loads through `.pi/extensions/overlay-guard.ts`, a one-line entry file that re-exports `pi/overlay-guard.ts`. Pi discovers it through that entry file and loads it from this folder, so its imports are relative to this folder.

DSH loads through the repo-guards bundle, whose `.dsh/plugins/repo-guards/adapters/overlay-guard.mjs` links back to `dsh/overlay-guard.mjs`.

OpenCode loads its plugin from `.opencode/plugins/overlay-guard.js`, and `opencode/overlay-guard.js` is a relative symlink back to it. Nothing loads through that link, because the OpenCode loader globs only `.opencode/plugins/*.js`. The plugin judges paths against the project directory it receives. It writes its notes to a log capped at 256 KB and rotated to `.1`.

Vibe registers the hook in `.vibe/hooks.toml` as a `pre_tool` hook named `overlay-guard`, with `strict = true`. The hook judges the session directory and this checkout, so a session started elsewhere still covers this tree.

A malformed payload allows the write silently. Only an internal error prints one `overlay-guard:` line on stderr. Claude, Codex, Cursor, Devin and Vibe print that line. Cursor's allow also prints `{"permission":"allow"}`. Pi returns nothing. DSH logs through the plugin logger and calls `next()`. OpenCode appends a line to its log file.

---

## 4. DIRECTORY TREE

```text
overlay-guard/
+-- README.md
+-- lib/
|   +-- README.md
|   +-- overlay-guard.cjs        # runtime-neutral core
|   `-- overlay-guard.test.cjs   # node --test suite for the core and five adapters
+-- claude/
|   +-- README.md
|   `-- overlay-guard.cjs        # PreToolUse adapter
+-- codex/
|   +-- README.md
|   `-- overlay-guard.cjs        # PreToolUse adapter, reads apply_patch headers
+-- cursor/
|   +-- README.md
|   `-- overlay-guard.mjs        # preToolUse adapter, Cursor permission envelope
+-- devin/
|   +-- README.md
|   `-- overlay-guard.cjs        # PreToolUse adapter
+-- dsh/
|   +-- README.md
|   `-- overlay-guard.mjs        # tools/pre-execute adapter
+-- opencode/
|   `-- overlay-guard.js         # tool.execute.before adapter, a link to the plugin
+-- pi/
|   +-- README.md
|   `-- overlay-guard.ts         # Pi tool_call extension
`-- tests/
    +-- README.md
    +-- dsh-overlay-guard.test.mjs
    `-- opencode-overlay-guard.test.mjs
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/overlay-guard.cjs` | The policy: the no-manifest fast exit, the engine's manifest lookup, one `--guard` spawn per path with a 3-second timeout and the `allow` or `deny` decision. Also the payload helpers the adapters share. Node builtins only, and it never writes stdout or stderr. |
| `claude/overlay-guard.cjs`, `devin/overlay-guard.cjs` | Read the matched payload, evaluate the core, deny on an owned path, print notes on stderr. |
| `codex/overlay-guard.cjs` | The same, plus every path an `apply_patch` body names. One owned path refuses the whole call. |
| `cursor/overlay-guard.mjs` | Cursor's permission envelope, with the workspace root from `workspace_roots[0]`. |
| `pi/overlay-guard.ts` | Filters on `edit` and `write`, honors the kill-switch, dynamic-imports the core. |
| `dsh/overlay-guard.mjs` | Registers on `tools/pre-execute`, judges `write`, `edit` and `apply_patch`, logs a note through the plugin logger. |
| `opencode/overlay-guard.js` | A browsability link to the OpenCode plugin, which throws the engine's refusal in `tool.execute.before` and writes its notes to a log because OpenCode paints console output onto the prompt line. |
| `.vibe/plugins/repo-guards/overlay-guard.mjs` | The Vibe hook. It judges the session directory and this checkout, then prints the deny object. |

The adapters in this folder import `../lib/` and `../../shared/`. The OpenCode plugin and the Vibe hook reach the same files from their own folders.

The registrations come from the `overlay-guard` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, rendered by `sync-hook-registrations.cjs` in the same folder. That entry covers Claude, Codex, Cursor, Devin and Pi. DSH registers through its repo-guards bundle, OpenCode through its plugin folder and Vibe through `.vibe/hooks.toml`.

---

## 6. CONFIGURATION

The guard is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_OVERLAY_GUARD_DISABLED=1` | Full no-op in every runtime. Each adapter checks the shared resolver and does nothing when it is off. DSH then registers no handler. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment always wins over the file.

The overlay folder itself is the engine's setting, `overlayDir`, read from `.skilled-overlays.json` at the tree root and defaulting to `skilled-overlays/`. The guard does not read that value. It asks the engine.

---

## 7. VALIDATION

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: all tests pass.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

Expected result: `PASS`, with the four registration files matching the registry and every Pi extension resolving.

---

## 8. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../shared/README.md`](../shared/README.md): the shared stdin parser and kill-switch resolver the adapters use.
- [`../../commands/doctor/overlay.md`](../../commands/doctor/overlay.md): the overlay command and the engine whose `--guard` query this hook asks.
- [`../../../.opencode/plugins/overlay-guard.js`](../../../.opencode/plugins/overlay-guard.js): the OpenCode plugin this folder links to.
- [`../../../.vibe/plugins/repo-guards/overlay-guard.mjs`](../../../.vibe/plugins/repo-guards/overlay-guard.mjs): the Vibe hook.

<!-- readme-check
allow-ref .skilled/owned/target.txt | an illustrative refusal line, not a path in this checkout
allow-ref .skilled-overlays.json | the overlay setting file at the root of a project that vendors Skilled
-->
