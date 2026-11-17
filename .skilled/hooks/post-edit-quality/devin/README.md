---
title: "Devin Post-Edit Quality: PostToolUse Adapter"
description: "Devin CLI adapter that runs the shared checker router after an edit or write and delivers bounded findings as PostToolUse additionalContext."
trigger_phrases:
  - "devin post edit quality"
  - "devin comment hygiene"
  - "devin posttooluse quality"
version: 1.0.0.0
---

# Devin Post-Edit Quality: PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/post-edit-quality/devin/` holds the Devin adapter for the post-edit quality concern. Devin runs it on `PostToolUse` and acts only when the tool is `edit` or `write`. The matcher in `.devin/hooks.v1.json` is `^(edit|write)$`. An edit with nothing to report prints nothing. Otherwise the adapter prints one JSON envelope on stdout, with the checker text under `hookSpecificOutput.additionalContext`.

`.devin/hooks.v1.json` registers the command in its `"PostToolUse"` array with a 10-second timeout. The command is `bash -c 'cd "${DEVIN_PROJECT_DIR:-$PWD}" && node .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs'`. The entry carries no drift fallback. The `post-edit-quality` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` holds the same event and matcher, with `fallback` set to `none`. No other runtime loads this file.

The adapter checks the switch before it reads any stdin. `isHookEnabled('post-edit-quality')` comes from `.skilled/hooks/shared/hook-flags.cjs`, so `SK_CODE_POST_EDIT_QUALITY_DISABLED` turns this concern off and `SYSTEM_HOOKS_DISABLED` is the master switch. A disabled concern returns at once and Devin sees no output.

Then it reads the payload with `readStdin()`, which waits 3000 ms at most. The path comes from `tool_input.file_path`, with `filePath` and `path` as fallbacks. The first string wins. A relative path is joined to the project directory. `payload.cwd` supplies that directory when the payload holds a string. `DEVIN_PROJECT_DIR` or `process.cwd()` answers otherwise. A file that is not on disk ends the run.

`resolveDispatch()` and `runChecks()` in `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` run under the router's 9000 ms budget, with 8000 ms for each checker and a 500 ms floor. A separate staleness check runs while 500 ms or more remains. Each finding names the file and lists the flagged lines. A comment-hygiene hit also names the escape: add `hygiene-ok` to a comment line to suppress that line. Any other hit prints as `POST-EDIT QUALITY WARNING [label]`. The staleness banner joins the findings in the same message.

Every failure ends at exit 0 with nothing on either stream. Malformed stdin, a payload that is not an object, a tool name outside the two, a missing path alias, a missing file and a throw inside the router all return without a finding. A missing checker is the one exception: it adds a `quality-notice` finding that names the missing path.

---

## 2. DIRECTORY TREE

The folder is flat, so the table names every file beside this README.

| File | Responsibility |
|---|---|
| `post-edit-quality.cjs` | The adapter. It checks the switch, filters the tool name, resolves the path and calls the shared router. |

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/devin-post-edit-quality.test.cjs
```

Expected result: every test passes, with `fail 0` in the summary and exit status 0. The suite sends a `write` payload and an `edit` payload against a fixture whose comment the real checker flags. It also checks that a `read` stays silent and that a non-string `file_path` does not hide a later alias.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README, with the runtime coverage table and the registration notes.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the router that picks the checker and the staleness scan.
- [`../tests/devin-post-edit-quality.test.cjs`](../tests/devin-post-edit-quality.test.cjs): the suite that drives this adapter.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the resolver behind `isHookEnabled()`.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the stdin reader with the 3000 ms deadline.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin hook config that registers this adapter.
