---
title: "Codex Completion Hook: Stop Event Evidence Sentinel"
description: "Codex CLI Stop adapter that checks a completion claim against packet evidence and warns on stderr when the proof is missing."
trigger_phrases:
  - "codex completion evidence"
  - "codex stop sentinel"
  - "codex completion claim check"
version: 1.0.0.0
---

# Codex Completion Hook: Stop Event Evidence Sentinel

---

## 1. OVERVIEW

`hooks/completion/codex/` holds a browsability symlink to the Codex CLI completion-evidence adapter. The adapter runs on the `Stop` event, reads `last_assistant_message`, resolves the active spec folder from the shared lifecycle state file and delegates the policy to the runtime-neutral core.

The adapter is dormant-safe. A Codex version that does not surface the message field gives the core an empty claim text, and the sentinel does nothing. Codex loads it from `.codex/hooks.json`. The real code lives under `system-spec-kit/runtime/hooks/codex/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `completion-evidence-stop.cjs` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs`](../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs) | Link only. The target runs at `Stop`, detects a trailing completion claim, evaluates the packet evidence through the shared core, warns on stderr and appends the advisory to the bounded log. | Fails open. A missing payload, an absent message field, a missing spec folder or an internal error resolves to `ok` and lets the stop finish. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs`](../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs): the real adapter this folder links to.
- [`../claude/README.md`](../claude/README.md): the Claude Code sibling with the same structure.
