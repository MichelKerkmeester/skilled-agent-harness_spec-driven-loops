---
title: "Overlay Guard: Claude PreToolUse Adapter"
description: "Claude Code adapter that refuses a Write, Edit or MultiEdit to a file a vendored tree's overlay owns and names the overlay file to edit instead."
trigger_phrases:
  - "claude overlay guard"
  - "overlay owned file deny"
  - "claude pre write guard"
version: 1.0.0.0
---

# Overlay Guard: Claude PreToolUse Adapter

---

## 1. OVERVIEW

`claude/` holds the Claude Code adapter for the overlay guard. `.claude/settings.json` wires it to `PreToolUse` under the matcher `Write|Edit|MultiEdit`. The adapter resolves `tool_input.file_path` against the session directory, calls `../lib/overlay-guard.cjs`, and writes a `permissionDecision: deny` envelope when the overlay engine says the path is owned. The deny reason is the engine's own `refuse:` line, which names the overlay file to edit. A tree with no overlay manifest allows after two file-existence checks and starts no process.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.cjs`](./overlay-guard.cjs) | `PreToolUse` | Filters on `Write`, `Edit` and `MultiEdit`, reads `tool_input.file_path`, runs `evaluateWrite()` and emits the deny envelope. Prints the core's notes on stderr. | Fails open. A missing payload, an engine error or an internal bug approves, with one stderr line when the path could not be judged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
