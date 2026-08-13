---
title: "Permission Policy Hook: Devin Permission-Request Advisory"
description: "Advisory policy adapter for Devin's permission-request event — the one runtime that exposes a dedicated approval hook."
trigger_phrases:
  - "permission request policy"
  - "devin permission hook"
importance_tier: "reference"
contextType: "reference"
---

# Permission Policy Hook: Devin Permission-Request Advisory

---

## 1. OVERVIEW

Index of the permission-policy adapter (real code in `system-spec-kit/mcp-server/hooks/devin/`, symlinked here). It responds to Devin's `permission-request` event with an advisory policy. This concern is **Devin-only by design**: `permission-request` is the only dedicated approval-hook event any supported runtime exposes — Claude and Codex influence permissions through `PreToolUse` decisions rather than a separate event, so they carry no permission-policy adapter (see the hub coverage matrix).

Honors the `permission-policy` kill-switch (`isHookEnabled`; `MK_PERMISSION_POLICY_DISABLED` or the master `MK_HOOKS_DISABLED`), default-on.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `devin/` | `permission-request-policy.mjs` |

## 3. BOUNDARIES

- **Advisory only, fail-open.** Shapes the advisory; any error resolves to a permissive no-op.
- **Real code stays in the skill.** The file here is a symlink into `system-spec-kit`.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and coverage matrix.
