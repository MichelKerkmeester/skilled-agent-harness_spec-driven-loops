---
title: "Completion Hooks: Completion-Evidence Gate"
description: "Advisory completion-evidence check that fires when an assistant claims completion, surfacing missing proof across Claude, Codex, Devin, Cursor, Pi, and the OpenCode plugins."
trigger_phrases:
  - "completion evidence hook"
  - "completion sentinel"
  - "done claim evidence check"
importance_tier: "important"
contextType: "reference"
---

# Completion Hooks: Completion-Evidence Gate

---

## 1. OVERVIEW

Index of the completion-evidence adapters, whose real code lives in `system-spec-kit` (per-runtime hooks) and `.opencode/plugins/` (OpenCode). When the assistant claims a task is "done"/"complete", these hooks check that the claim carries objective evidence and surface a warning when it does not — the runtime realization of the framework's completion-verification rule.

They are advisory: they add a warning to the model context, never block the turn. Every adapter honors the `completion` kill-switch (`isHookEnabled`; `MK_COMPLETION_DISABLED`, legacy `MK_COMPLETION_SENTINEL_DISABLED` / `MK_SPECKIT_COMPLETION_DISABLED`, or the master `MK_HOOKS_DISABLED`), default-on.

## 2. KEY FILES

| Runtime | Adapter | Fires on |
|---|---|---|
| `claude/`, `codex/`, `devin/` | `completion-evidence-stop.cjs` | the Stop event |
| `cursor/` | `completion-evidence-response.mjs` | `afterAgentResponse` |
| `pi/` | `completion-evidence.ts` | `turn_end` |
| `opencode/` | `mk-completion-sentinel.js`, `mk-speckit-completion.js` | plugin lifecycle |

Runtimes expose different "the assistant just finished" events; each adapter maps its runtime's event onto the shared completion-evidence sentinel.

## 3. BOUNDARIES

- **Advisory only.** Surfaces a warning; never denies, blocks, or fails a turn.
- **Fail-open.** Any error resolves to a no-op.
- **Real code stays in the skill/plugin.** The files here are symlinks; edit the source in `system-spec-kit` or `.opencode/plugins/`.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and kill-switch model.
- [`../../skills/system-spec-kit/mcp-server/hooks/README.md`](../../skills/system-spec-kit/mcp-server/hooks/README.md) — the owning skill's hook contract.
