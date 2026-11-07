---
title: "Pi Completion Hook: turn_end Evidence Extension"
description: "Pi extension that checks the ending assistant message for a completion claim and queues a hidden model-visible advisory for the next turn."
trigger_phrases:
  - "pi completion evidence"
  - "pi turn end sentinel"
  - "pi completion claim check"
version: 1.0.0.0
---

# Pi Completion Hook: turn_end Evidence Extension

---

## 1. OVERVIEW

`hooks/completion/pi/` holds a browsability symlink to the Pi completion-evidence extension. The extension runs on `turn_end` and flattens the ending assistant message content. It resolves the spec folder from the claim text first and falls back to the shared lifecycle state file.

When the shared core advises, the extension writes the bounded log and sends a message with `display: false` and `deliverAs: "nextTurn"`, so the advisory is hidden from the operator and visible to the model on the next turn. `.pi/extensions/` symlinks to the real file under `system-spec-kit/runtime/hooks/pi/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `completion-evidence.ts` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts`](../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts) | Link only. The target runs at `turn_end`, detects a completion claim, evaluates the packet evidence through the shared core, appends the advisory log and queues the next-turn advisory. | Fails open. A missing message, a missing spec folder or an internal error returns without an advisory. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts`](../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts): the real extension this folder links to.
- [`../cursor/README.md`](../cursor/README.md): the other adapter that resolves the spec folder from the claim text first.
