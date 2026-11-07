---
title: "Devin Completion Hook: Stop Event Evidence Sentinel"
description: "Devin CLI Stop adapter that checks a completion claim against packet evidence and warns on stderr when the proof is missing."
trigger_phrases:
  - "devin completion evidence"
  - "devin stop sentinel"
  - "devin completion claim check"
version: 1.0.0.0
---

# Devin Completion Hook: Stop Event Evidence Sentinel

---

## 1. OVERVIEW

`hooks/completion/devin/` holds a browsability symlink to the Devin CLI completion-evidence adapter. The adapter runs on the `Stop` event, reads `last_assistant_message`, resolves the active spec folder from the shared lifecycle state file and delegates every policy decision to the runtime-neutral core.

The adapter is advisory only and never forces continuation. Devin loads it from `.devin/hooks.v1.json`. The real code lives under `system-spec-kit/runtime/hooks/devin/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `completion-evidence-stop.cjs` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs`](../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs) | Link only. The target runs at `Stop`, detects a trailing completion claim, evaluates the packet evidence through the shared core, warns on stderr and appends the advisory to the bounded log. | Fails open. A missing payload, a missing spec folder or an internal error resolves to `ok` and lets the stop finish. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs`](../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs): the real adapter this folder links to.
- [`../codex/README.md`](../codex/README.md): the Codex sibling with the same structure.
