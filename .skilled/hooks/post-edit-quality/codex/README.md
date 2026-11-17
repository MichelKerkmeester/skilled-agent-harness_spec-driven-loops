---
title: "Codex Post-Edit Quality: PostToolUse Adapter"
description: "Codex CLI adapter that checks every file named by an apply_patch or edit and prints bounded findings as plain stdout."
trigger_phrases:
  - "codex post edit quality"
  - "codex apply patch quality"
  - "codex comment hygiene"
version: 1.0.0.0
---

# Codex Post-Edit Quality: PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/post-edit-quality/codex/` holds the Codex adapter for the post-edit quality concern. It runs at `PostToolUse` and prints its findings as plain text on stdout. A clean edit prints nothing. Claude, Devin, DSH, OpenCode, Pi and Vibe keep their own adapters in the sibling folders. Cursor's folder holds only a link to the shared `postToolUse` proxy, which spawns the Claude adapter.

`.codex/hooks.json` registers the adapter under `PostToolUse` with the matcher `apply_patch|edit` and a 10 second timeout. No other runtime registers this file. The entry runs the adapter from the project directory and wraps the command in a drift fallback. When the adapter is missing or `node` fails, the fallback prints `mk-hook-drift host=codex event=PostToolUse adapter=post-edit-quality.cjs` to stderr. It then prints a `hookSpecificOutput.additionalContext` message that asks the operator to build the spec-kit runtime or restore the missing adapter.

The adapter calls `isHookEnabled('post-edit-quality')` before it reads anything else. A concern that is off returns at once, with no output. Otherwise the adapter reads the JSON payload on stdin, waiting at most 3000 ms for it.

The concern switch is `SK_CODE_POST_EDIT_QUALITY_DISABLED`, which also accepts the `MK_POST_EDIT_QUALITY_DISABLED` alias. `SYSTEM_HOOKS_DISABLED` is the master switch, because the adapter reaches the shared resolver in `.skilled/hooks/shared/hook-flags.cjs`. Exit status is 0 on every path, so the observed tool call is never blocked. A missing checker still prints one `quality-notice` for that file. A malformed payload, a missing file or a spawn error prints nothing for it.

The payload tells the adapter which file to check. The `tool_input.file_path` field wins. A non-string value there does not hide a later alias such as `filePath` or `path`. Codex sends an `apply_patch` file list in the patch body rather than in a path field, so the adapter reads every file header from that body, both `*** Add/Update/Delete File:` and `*** Move to:`.

A relative path resolves against `cwd`, then `CODEX_PROJECT_DIR`, then the process directory. Every file in one patch shares a 9000 ms budget, with an 8000 ms cap per checker. Once less than 500 ms remains, no further file is checked. The dist-staleness check runs once, against the first file that exists, so a large patch gets one banner.

A comment-hygiene finding opens with `COMMENT HYGIENE WARNING` and lists the flagged lines under the file path. It also prints the `hygiene-ok` escape that silences a single line. Any other finding opens with `POST-EDIT QUALITY WARNING` and its checker label. A checker that cannot be found produces a `quality-notice` line, so an unchecked edit never reads as a clean one.

---

## 2. DIRECTORY TREE

The folder is flat. The table names every entry beside this README.

| File | Responsibility |
|---|---|
| `post-edit-quality.cjs` | The `PostToolUse` adapter. It checks the switch, reads the payload, resolves each existing file through `resolveDispatch()`, runs the checker through `runChecks()` and prints the findings. |

The suite that drives the adapter lives in the concern's `tests/` folder, at `.skilled/hooks/post-edit-quality/tests/codex-post-edit-quality.test.cjs`.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/codex-post-edit-quality.test.cjs
```

Expected result: every test passes, with `fail 0` in the summary and exit status 0. The suite builds a throwaway project and checks that an `edit` payload surfaces the comment-hygiene finding. It also checks the negative cases: a `read` payload stays silent and a non-string `file_path` cannot hide a later alias.

---

## 4. RELATED

- [The post-edit quality concern](../README.md): the dispatch table and the per-runtime matrix.
- [The shared router](../lib/post-edit-router.cjs): the checker table this adapter resolves against.
- [The Codex suite](../tests/codex-post-edit-quality.test.cjs): the tests that drive this adapter.
- [The switch resolver](../../shared/hook-flags.cjs): the module that answers the concern switch and the master switch.
- [The Codex registration](../../../../.codex/hooks.json): the `PostToolUse` entry that runs this adapter.
