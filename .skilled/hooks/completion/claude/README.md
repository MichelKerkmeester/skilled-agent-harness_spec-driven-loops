---
title: "Claude Completion Hook: Stop Event Evidence Sentinel"
description: "Claude Code Stop adapter that checks a completion claim against packet evidence and warns on stderr when the proof is missing."
trigger_phrases:
  - "claude completion evidence"
  - "claude stop sentinel"
  - "completion claim check"
version: 1.0.0.0
---

# Claude Completion Hook: Stop Event Evidence Sentinel

---

## 1. OVERVIEW

`hooks/completion/claude/` holds a browsability symlink to the Claude Code completion-evidence adapter. The adapter runs on the `Stop` event and reads the ending assistant message from `last_assistant_message`. It resolves the active spec folder from the shared lifecycle state file, then asks the runtime-neutral core whether the claim carries recorded proof.

The adapter is advisory only and never emits `{decision:"block"}`. Claude Code loads it from the `Stop` matcher in `.claude/settings.json`. The real code lives under `system-spec-kit/runtime/hooks/claude/`, so edit the target, not the link.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `completion-evidence-stop.cjs` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`](../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs) | Link only. The target runs at `Stop`, skips a re-entrant `stop_hook_active` call, evaluates the claim through the shared core, warns on stderr and appends the advisory to the bounded log. | Fails open. A missing payload, a missing spec folder, a check timeout or an internal error resolves to `ok` and lets the stop finish. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`](../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs): the real adapter this folder links to.
- [`../tests/README.md`](../tests/README.md): the DSH adapter tests for the same core.
