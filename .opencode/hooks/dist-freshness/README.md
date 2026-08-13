---
title: "Dist Freshness Hook: Self-Healing Stale Builds"
description: "OpenCode plugin that detects a stale @spec-kit dist build at session start and rebuilds it so compiled scripts never lag their TypeScript sources."
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

Index of the dist-freshness concern (real code at `.opencode/plugins/mk-dist-freshness-guard.js`, mirrored here). At session start the guard compares the compiled `dist/` output against its TypeScript sources; when `dist/` is stale it triggers a rebuild, so runtime code paths that import compiled scripts never run against an out-of-date build. This is the hook behind the `DIST REBUILT: @spec-kit/scripts -- self-healed a stale build at session start` line. It is an **OpenCode-plugin-only** concern by design — it depends on OpenCode's session-start plugin event.

Honors the `dist-freshness` kill-switch (`isHookEnabled`; `MK_DIST_FRESHNESS_DISABLED`, legacy `MK_DIST_FRESHNESS_GUARD_DISABLED`, or the master `MK_HOOKS_DISABLED`), default-on.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `opencode/` | `mk-dist-freshness-guard.js` (browsability symlink → `../../../plugins/`) |

## 3. BOUNDARIES

- **Self-healing, fail-open.** Rebuilds when stale; on any error it leaves the existing build in place rather than blocking the session.
- **Real code stays in `.opencode/plugins/`.** The entry here is a documentation-mirror symlink; the OpenCode loader globs `.opencode/plugins/`, not this tree.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and kill-switch model.
- [`../../plugins/README.md`](../../plugins/README.md) — the OpenCode plugins.
