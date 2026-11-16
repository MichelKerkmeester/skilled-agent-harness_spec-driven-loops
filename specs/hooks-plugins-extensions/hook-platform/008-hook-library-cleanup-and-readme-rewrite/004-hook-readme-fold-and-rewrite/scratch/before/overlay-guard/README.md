---
title: "Overlay Guard: Refuse Edits to Overlay-Owned Files"
description: "Pre-write guard that refuses an edit to a file a vendored Skilled tree's overlay owns and names the overlay file to edit, and with strict writes on also a vendored write no overlay owns, with one runtime-neutral core and seven per-runtime adapters."
trigger_phrases:
  - "overlay guard"
  - "overlay owned file"
  - "pre write overlay guard"
---

# Overlay Guard: Refuse Edits to Overlay-Owned Files

---

## 1. OVERVIEW

`overlay-guard/` stops an agent from editing a file that an overlay owns in a project that vendors Skilled. A vendored tree is replaced wholesale at each re-pin, and the overlay engine then puts the project's own versions back from the overlay folder. An edit made directly to one of those files is therefore lost at the next re-pin. The guard refuses that edit before it is written and tells the agent which overlay file to edit instead.

The concern is one runtime-neutral core plus a thin adapter per runtime. The core never judges ownership itself. It asks the overlay engine's `--guard` query, once per path, and the engine stays the only reader of the overlay setting and the manifest. Two outcomes exist: `allow` (stay silent) and `deny` (refuse with the engine's message).

A project can widen what the engine refuses with `"strictWrites": true` in its overlay manifest. The engine then also refuses a new file, or an edit to an upstream file no overlay owns, under `.skilled`, a runtime folder or a root file the manifest names, and its line names the overlay path to create or the `apply --adopt` command to run. The guard needs no setting of its own for this, because it passes the engine's answer on. The key is off unless the project sets it.

The guard is pre-write only. It never applies overlays, captures a live edit or writes any file. After the operator edits the overlay, running the engine's `apply` is a separate, explicit step.

It ships to every Skilled repository, and nearly all of them have no overlays. In a tree with no overlay manifest it allows on two file-existence checks, without loading the engine or starting a process, and prints nothing.

---

## 2. WHAT IT DOES

The guard runs before a file write. It takes the path or paths the write names and resolves each against the session directory. Then it decides:

| Condition | Decision |
|---|---|
| The call names no path | `allow` |
| Neither `.skilled-overlays.json` nor `skilled-overlays/` exists at the tree root | `allow` at once, nothing loaded or spawned |
| The engine resolves the overlay folder and finds no `overlay-manifest.json` there | `allow`, no process spawned |
| The engine's `--guard` exits 1 for any named path | `deny` with the engine's `refuse:` line |
| The engine's `--guard` exits 0 for every path | `allow` |
| The engine errors or times out, or the setting cannot be read | `allow`, with one note line on stderr |

The refusal is the engine's own line, for example:

```text
refuse: .skilled/owned/target.txt is owned by skilled-overlays/files/owned.txt; edit the overlay, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply
```

The guard finds its tree root and the engine from its own location (`lib/` sits four levels below the root), the same tree the engine treats as its default root. A path the engine could not judge is never refused. Only an engine `refuse:` answer blocks a write.

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the same `lib/overlay-guard.cjs` core. What differs is the tool names each runtime uses for a write and where the path sits in its payload, plus how a refusal is handed back.

| Runtime | Adapter | Event and matcher | Paths it reads | Refusal |
|---|---|---|---|---|
| **Claude** | `claude/overlay-guard.cjs` | `PreToolUse`, `Write\|Edit\|MultiEdit` | `tool_input.file_path` | `permissionDecision: "deny"` with the reason |
| **Codex** | `codex/overlay-guard.cjs` | `PreToolUse`, `apply_patch\|edit` | a path field, or every `*** Add/Update/Delete File:` header and `*** Move to:` target in the patch | `permissionDecision: "deny"` |
| **Cursor** | `cursor/overlay-guard.mjs` | `preToolUse`, `Write` | `tool_input.file_path` | `{"permission":"deny"}` and exit 2 |
| **Devin** | `devin/overlay-guard.cjs` | `PreToolUse`, `^(edit\|write)$` | `tool_input.file_path` | `permissionDecision: "deny"` |
| **Pi** | `pi/overlay-guard.ts` | `tool_call`, tools `edit` and `write` | `input.path` | `{ block: true, reason }` |
| **DSH** | `dsh/overlay-guard.mjs` | `tools/pre-execute`, tools `write`, `edit` and `apply_patch` | a path field, or every file header in the patch | `{ kind: 'deny', reason }` |
| **OpenCode** | `opencode/overlay-guard.js` | `tool.execute.before`, tools `write`, `edit`, `multiedit`, `patch` and `apply_patch` | the `file_path`, `filePath` or `path` field, or every `*** Add/Update/Delete File:` header and `*** Move to:` target in a patch body | throws the engine's `refuse:` line |

Shell commands are not parsed. A write made through `Bash`, `exec` or `Shell` is not guarded.

The Cursor registration carries no fallback chain. Cursor blocks on exit 2, and a `|| { fallback }` chain would run on that exit, append an allow envelope and exit 0, so the refusal would never reach Cursor.

Pi loads through `.pi/extensions/overlay-guard.ts`, a one-line entry file that re-exports `pi/overlay-guard.ts`. Pi discovers it through that entry file and loads it from this folder, so its imports are relative to this folder. DSH loads through the repo-guards bundle, whose `adapters/overlay-guard.mjs` links back to `dsh/overlay-guard.mjs`. OpenCode loads its plugin from `.opencode/plugins/overlay-guard.js`, and `opencode/overlay-guard.js` is a relative symlink back to it. Nothing loads through that link, because the OpenCode loader globs only `.opencode/plugins/*.js`.

---

## 4. DIRECTORY TREE

```text
overlay-guard/
+-- lib/
|   +-- overlay-guard.cjs        # runtime-neutral core (fast no-manifest exit, engine --guard per path)
|   `-- overlay-guard.test.cjs   # node --test suite for the core and the Claude, Codex, Cursor and Devin adapters
+-- claude/   overlay-guard.cjs  # PreToolUse adapter
+-- codex/    overlay-guard.cjs  # PreToolUse adapter, reads apply_patch headers
+-- cursor/   overlay-guard.mjs  # preToolUse adapter, Cursor permission envelope
+-- devin/    overlay-guard.cjs  # PreToolUse adapter
+-- dsh/      overlay-guard.mjs  # tools/pre-execute adapter (linked from the .dsh repo-guards bundle)
+-- opencode/ overlay-guard.js   # tool.execute.before adapter (symlink to .opencode/plugins/overlay-guard.js)
+-- pi/       overlay-guard.ts   # Pi tool_call extension (re-exported from .pi/extensions/)
`-- tests/
    +-- dsh-overlay-guard.test.mjs  # node --test suite for the DSH adapter
    `-- opencode-overlay-guard.test.mjs  # node --test suite for the OpenCode plugin
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
| `opencode/overlay-guard.js` | A browsability link to the OpenCode plugin, which throws the engine's refusal in `tool.execute.before` and writes its notes to a log because OpenCode paints console output onto the prompt line. |

The registrations come from the `overlay-guard` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, rendered by `sync-hook-registrations.cjs` in the same folder.

---

## 6. CONFIGURATION

The guard is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_OVERLAY_GUARD_DISABLED=1` | Full no-op in every runtime. Each adapter checks the shared resolver before reading the payload. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file.

The overlay folder itself is the engine's setting, `overlayDir` in `.skilled-overlays.json` at the tree root, defaulting to `skilled-overlays/`. The guard does not read that value. It asks the engine.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only, and loads the engine module only when the tree carries an overlay setting or folder. Adapters import `../lib/` and `../../shared/`. |
| Writes | None. The guard never applies, captures or writes a file, and a refused call leaves the tree byte-identical. |
| Decisions | `allow` or `deny`. `deny` only when the engine answered `refuse:` for a path: an overlay owns it, or strict writes are on and no overlay does. |
| Failure | Fails open. Malformed stdin, an engine error or timeout, an unreadable setting or an internal error allows the write, with a one-line stderr note when the engine could not judge a path. |

---

## 8. VALIDATION

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: all tests pass.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

Expected result: `PASS`, with the four registration files matching the registry and every Pi extension resolving.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../shared/README.md`](../shared/README.md): the shared stdin parser and kill-switch resolver the adapters use.
- [`../../commands/doctor/overlay.md`](../../commands/doctor/overlay.md): the overlay command and the engine whose `--guard` query this hook asks.
