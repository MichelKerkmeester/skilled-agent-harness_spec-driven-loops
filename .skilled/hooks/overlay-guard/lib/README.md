---
title: "Overlay Guard Lib: Shared Policy Core"
description: "Runtime-neutral policy core that asks the overlay engine about each write path and denies a write only when the engine returns a refusal."
trigger_phrases:
  - "overlay guard core"
  - "overlay engine guard query"
  - "overlay owned path"
version: 1.0.0.0
---

# Overlay Guard Lib: Shared Policy Core

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy for the overlay guard. The core takes the paths of a pending write, asks the overlay engine about each unique path and returns an allow or deny decision. It reads no payload and prints nothing. The adapters in the sibling runtime folders own their event and their output channel. They hand this folder a path or a patch body.

The engine is the only judge of ownership. A path is denied when the engine exits with status 1 and prints a `refuse:` line for it. Every other answer allows the write. The core fails open, so a write it could not judge proceeds and the adapter receives a note line to print.

---

## 2. ARCHITECTURE

```text
Runtime adapters (sibling runtime folders)
  Own the event and the output channel.
        │
        │ evaluateWrite()
        ▼
Policy core (overlay-guard.cjs)
  Parses tool inputs and patch bodies. Decides allow or deny.
        │
        │ --guard per unique path
        ▼
Overlay engine
  Owns the overlay setting, the manifest and the ownership answer.

Dependency direction: adapters ───▶ lib ───▶ overlay engine
```

An adapter maps its payload and calls `evaluateWrite()`. The core asks the engine and returns a decision. The engine reads the overlay setting and the manifest.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The policy core and the payload helpers. It exports `evaluateWrite()`, `fileFieldPath()` and `pathsFromPatch()`. |
| `overlay-guard.test.cjs` | The `node --test` suite for the core and for the Claude, Codex, Cursor, Devin and Pi adapters. |

`overlay-guard.cjs` is the only file an adapter requires from this folder.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node built-ins only. The engine module loads later through `require()` for `createContext()`. No adapter and no switch file is imported. |
| Exports | `evaluateWrite()`, `fileFieldPath()` and `pathsFromPatch()`. |
| Ownership | This folder owns the decision and the parsing of tool inputs and patch bodies. The adapters own the transport. The engine owns the overlay setting, the manifest and the ownership answer. |

The core reads no environment variable. Each adapter checks the concern through `hook-flags.cjs` and calls the core only when the guard is on.

### Configuration

A request names `paths` and may name `sessionDir`, `treeRoot`, `enginePath` and `spawn`. The tree root defaults to four levels above `lib/`, the root of the vendored tree. The engine path defaults to `.skilled/commands/doctor/scripts/overlay-engine.cjs` under that root. The session directory defaults to `process.cwd()`.

Blank entries and repeats are dropped before any engine work. The core then checks the tree root for `.skilled-overlays.json` or `skilled-overlays/`. When neither name exists it allows and starts no process. When either name exists, the core loads the engine, resolves the manifest path through `createContext(treeRoot)` and checks whether that file exists. A missing manifest allows and still starts no process.

| Engine answer | Decision | Detail |
|---|---|---|
| Status 0 | allow | none |
| Status 1 with a `refuse:` line | deny | The reason is the engine output. |
| Spawn error or timeout | allow | The error message becomes the note. |
| Any other status | allow | The exit status and the output become the note. |

Only a `refuse:` answer blocks a write. A call that names several paths is denied when any one is owned, and those `refuse:` lines are joined with a newline.

The engine runs as `node <enginePath> --guard <absolutePath> --root <treeRoot>`, with the tree root as its working directory. The spawn has a 3000 ms timeout, a 1 MB buffer, UTF-8 output decoding and `SIGKILL` on expiry. It uses `process.execPath` when its basename is `node`, and the bare `node` command otherwise. An embedded runtime such as Bun reports its own binary, which cannot run the engine.

### Main flow

```text
paths
  │
  ▼
drop blank entries and repeats
  │
  ▼
any path left? ─── no ──▶ allow
  │ yes
  ▼
overlay setting or folder at the tree root? ─── no ──▶ allow
  │ yes
  ▼
engine reports a manifest? ─── no ──▶ allow
  │ yes
  ▼
--guard for each path
  │
  ├── a refuse: line ──▶ deny
  │
  └── no refusal ──────▶ allow, with a note only when a path was not judged
```

The core passes the engine text through unchanged, so an adapter can show the overlay file to edit instead.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `evaluateWrite()` | Function | Decides a pending write for a list of paths. It returns `decision`, `reason` and `notes`. |
| `fileFieldPath()` | Function | Returns the first non-empty string in a tool input's `file_path`, `filePath` or `path` field, or null. |
| `pathsFromPatch()` | Function | Returns every path named by an `*** Add File:`, `*** Update File:` or `*** Delete File:` header, and by each `*** Move to:` target. |
| `overlay-guard.cjs` | Module | The file each adapter requires. |

Paths are resolved against the session directory, and a path that repeats is asked once. An adapter prints each note, then turns a `deny` decision into its runtime block response. The [Claude adapter](../claude/overlay-guard.cjs) is a short caller to read first.

---

## 6. VALIDATION

The suite runs the policy against a fixture tree with the real engine and a real manifest. The adapter tests copy the hook folder and the shared helpers into that tree, so each adapter finds the root from its own location. One test snapshots the tree and confirms that a refused write leaves every file byte-identical. The suite also covers `strictWrites`, where an unowned vendored file and a new file are refused.

Run from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes and the command exits 0.

---

## 7. RELATED

- [Overlay guard README](../README.md): the decision table, the runtime registrations and the concern switch.
- [Overlay engine](../../../commands/doctor/scripts/overlay-engine.cjs): the `--guard` query and the manifest it reads.
- [Hook flags](../../shared/hook-flags.cjs): the resolver each adapter calls before the core.
- [Shared hook folder](../../shared/README.md): the helpers the adapters import.

<!-- readme-check
allow-ref .skilled-overlays.json | the overlay setting file sits at the root of the host repository that vendors Skilled, not in this checkout
-->
