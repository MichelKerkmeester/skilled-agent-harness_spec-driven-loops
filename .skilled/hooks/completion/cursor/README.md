---
title: "Cursor Completion Hook: afterAgentResponse Evidence Check"
description: "Cursor adapter that checks the final assistant response for a completion claim and records an advisory when packet evidence is missing."
trigger_phrases:
  - "cursor completion evidence"
  - "cursor after agent response"
  - "cursor completion claim check"
version: 1.0.0.0
---

# Cursor Completion Hook: afterAgentResponse Evidence Check

---

## 1. OVERVIEW

`hooks/completion/cursor/` holds a browsability symlink to the Cursor completion-evidence adapter. The adapter runs on `afterAgentResponse` and reads the final assistant text from `payload.text`. It resolves the spec folder from that text first and falls back to the shared lifecycle state file.

The adapter is advisory only and writes to the bounded log with no stderr output. Cursor loads it from `.cursor/hooks.json`. The real code lives under `system-spec-kit/runtime/hooks/cursor/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `completion-evidence-response.mjs` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs`](../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs) | Link only. The target runs at `afterAgentResponse`, detects a completion claim, resolves the spec folder from the text or the lifecycle state, evaluates the evidence through the shared core and appends the advisory to the log. | Fails open. A missing payload, a missing spec folder or an internal error returns without output. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs`](../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs): the real adapter this folder links to.
- [`../pi/README.md`](../pi/README.md): the other adapter that resolves the spec folder from the claim text first.
