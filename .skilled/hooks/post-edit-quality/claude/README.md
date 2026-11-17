---
title: "Claude Post-Edit Quality: PostToolUse Adapter"
description: "Claude Code adapter that runs the shared checker router after a Write or Edit and delivers bounded findings as PostToolUse additionalContext."
trigger_phrases:
  - "claude post edit quality"
  - "claude comment hygiene hook"
  - "posttooluse quality check"
version: 1.0.0.0
---

# Claude Post-Edit Quality: PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/post-edit-quality/claude/` holds the Claude Code adapter for the post-edit quality concern. It runs at `PostToolUse` after a `Write` or `Edit` call. A finding reaches the model as `hookSpecificOutput.additionalContext`, and a clean edit prints nothing at all.

`.claude/settings.json` registers the adapter in its `PostToolUse` array, under the matcher `Write|Edit` and a 10 second timeout. The command runs from the project directory and exits at once when `.skilled/hooks` is absent.

The adapter checks the concern switch before it reads any input. `SK_CODE_POST_EDIT_QUALITY_DISABLED` turns off this concern, and `SYSTEM_HOOKS_DISABLED` is the master switch. Both resolve through `.skilled/hooks/shared/hook-flags.cjs`. With either switch on, the process exits 0 with no output.

The command ends in a drift fallback. When the adapter file is missing or `node` fails, the fallback writes `mk-hook-drift host=claude event=PostToolUse adapter=post-edit-quality.cjs` to stderr. On stdout it writes one `hookSpecificOutput` envelope. That envelope carries a rebuild message in `additionalContext` and sets `mkHookDrift` to true.

After the switch, the adapter reads the stdin JSON. It returns at once unless `tool_name` is `Write` or `Edit`. A malformed payload ends the run, and so does a missing `tool_input.file_path`. A path that does not exist ends it as well.

The adapter resolves the checker through `../lib/post-edit-router.cjs` and runs it under a 9000 ms hook budget, with an 8000 ms cap for each checker. The dist-staleness check runs after the checker and needs 500 ms of budget left. The project directory comes from `payload.cwd` when the payload names one. Otherwise the adapter reads `CLAUDE_PROJECT_DIR`, with the process directory as the last fallback.

Every failure ends the same way. A dispatch error or a checker error adds no finding, and the process exits 0, so a bug here never blocks the tool call it observes. A missing checker is the one exception: it adds a `quality-notice` finding that names the missing path.

Codex, Devin, DSH, OpenCode, Pi and Vibe keep their own adapters in sibling folders. Cursor reaches this file through the `postToolUse` proxy that spawns it for a `Write`.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `post-edit-quality.cjs` | The adapter. It gates on the concern switch, then reads the payload and runs the shared router. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs
```

Expected result: every test passes, with `fail 0` in the summary. The suite drives this adapter through malformed payloads, a flagged edit, its kill switch and a missing file. One case runs a copy of the adapter under a temporary tree to prove the shared budget holds.

---

## 4. RELATED

- [The concern README](../README.md): the dispatch table and the runtime coverage matrix.
- [The shared router](../lib/post-edit-router.cjs): picks the checker for an edited path and runs it.
- [The switch resolver](../../shared/hook-flags.cjs): resolves the concern switch and the master switch.
- [The stdin reader](../../shared/hook-adapter-shared.cjs): collects stdin under a 3000 ms timeout.
- [The Claude registration](../../../../.claude/settings.json): runs this adapter on `PostToolUse`.
- [The Cursor registration](../../../../.cursor/hooks.json): its proxy spawns this adapter for a `Write`.
