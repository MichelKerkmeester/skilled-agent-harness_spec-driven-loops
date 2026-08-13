---
title: "Hook Install: Codex Hook Installer"
description: "Index of the install-codex-hooks adapter that reconciles versioned hooks into Codex's user-global hook file, deployed from Claude, Cursor, and Devin."
trigger_phrases:
  - "codex hook installer"
  - "install codex hooks"
importance_tier: "reference"
contextType: "reference"
---

# Hook Install: Codex Hook Installer

---

## 1. OVERVIEW

Index of the hook-install concern. The shared installer — real code at `.opencode/bin/install-codex-hooks.mjs` — reconciles the repository's versioned hooks into Codex's user-global hook file, so Codex runs the current managed hook set. It is deployed from the Claude, Cursor, and Devin runtime hook dirs (each a symlink to the one installer); Codex itself carries no copy — it is the install target, not an installer host.

This is tooling that *installs* hooks rather than a runtime event hook; it is indexed here so the hub shows every hook-related executable in one place.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `claude/`, `cursor/`, `devin/` | `install-codex-hooks.mjs` (symlink → `../../../bin/install-codex-hooks.mjs`) |

## 3. BOUNDARIES

- **Explicitly invoked.** Runs as a reconcile step (`node .opencode/bin/install-codex-hooks.mjs [--repo <path>]`), not on every turn.
- **Real code stays in `.opencode/bin/`.** The hub entries are relative symlinks.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index.
- [`../codex-watchdog/README.md`](../codex-watchdog/README.md) — monitors that Codex hooks stay healthy after install.
