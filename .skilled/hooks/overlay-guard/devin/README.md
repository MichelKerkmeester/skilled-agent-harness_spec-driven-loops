---
title: "Overlay Guard: Devin PreToolUse Adapter"
description: "Devin CLI adapter that refuses an edit or write to a file a vendored tree's overlay owns, with the same deny envelope as the Claude adapter."
trigger_phrases:
  - "devin overlay guard"
  - "devin pre write guard"
  - "overlay owned file devin"
version: 1.0.0.0
---

# Overlay Guard: Devin PreToolUse Adapter

---

## 1. OVERVIEW

`devin/` holds the Devin CLI adapter for the overlay guard. `.devin/hooks.v1.json` wires it to `PreToolUse` under the matcher `^(edit|write)$`, with a 10-second timeout. The adapter keeps the Claude adapter's payload shape and deny envelope.

The adapter filters on `edit` and `write`, reads `tool_input.file_path`, and calls `evaluateWrite()` in `../lib/overlay-guard.cjs`. A path the overlay engine owns becomes a deny envelope carrying the engine's reason. The core's notes go to stderr, one line per note.

A whitespace-only `cwd` counts as absent, so the session directory falls back. The fallback order is `DEVIN_PROJECT_DIR` and then `process.cwd()`.

The `overlay-guard` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` registers the hook for Claude, Codex, Cursor, Devin and Pi. DSH registers it through its repo-guards bundle, OpenCode through its plugin folder and Vibe through `.vibe/hooks.toml`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The Devin adapter. It filters on `edit` and `write` and prints the deny envelope. |

The adapter approves with no output when the shared resolver turns the `overlay-guard` concern off. It also approves when the payload is missing or the tool name is neither `edit` nor `write`. A tool input that names no path approves as well.

An engine error or an internal bug approves too, with one stderr line when the path could not be judged. The adapter prints one `overlay-guard:` line when it throws, then exits 0.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver that gates the adapter.
