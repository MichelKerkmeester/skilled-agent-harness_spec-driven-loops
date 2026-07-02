---
title: "TH-001: check-dist-staleness.sh wiring into claude-posttooluse.sh"
description: "Verify that editing a file under a watched dist-producing source tree with a stale compiled dist output makes the shared PostToolUse hook print a STALE DIST WARNING banner, and that the hook always exits 0 regardless of checker outcome."
version: 3.5.0.16
---

# TH-001: check-dist-staleness.sh wiring into claude-posttooluse.sh

## 1. OVERVIEW

This scenario verifies the dist-staleness half of `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`, the shared Claude Code PostToolUse hook that fires on every `Write`/`Edit`. Alongside its pre-existing comment-hygiene check, the hook now also calls `.opencode/skills/sk-code/scripts/check-dist-staleness.sh` (a Python script despite the `.sh` extension) against the edited file. If the file falls under one of the 7 watched dist-producing source trees tracked by `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` and that package's compiled dist output is older than its newest watched source, the checker prints a `STALE DIST WARNING: <package> -- run: <rebuild command>` banner. The hook is warn-only: it always exits 0 and never blocks the edit, regardless of what the checker finds or whether the checker itself fails.

**Gap found while authoring this scenario, since fixed and re-verified**: as originally shipped, `check-dist-staleness.sh` was missing its executable bit (`-rw-r--r--` instead of its sibling `check-comment-hygiene.sh`'s `-rwxr-xr-x`). `claude-posttooluse.sh` invokes the checker via `subprocess.run([checker_path, file_path], ...)`, which requires the target file itself to be executable; without the `+x` bit this raised `PermissionError: [Errno 13] Permission denied` before the checker could run, caught by the hook's broad `except` and surfaced only as a stderr warning instead of the intended banner (the warn-only contract still held -- exit 0, edit never blocked -- but the STALE DIST WARNING banner never reached stdout in a live session). Fixed via `chmod +x .opencode/skills/sk-code/scripts/check-dist-staleness.sh` and independently re-verified end-to-end (both the negative case -- fresh dist, silent exit 0 -- and the positive case -- stale dist, banner reaches stdout through the full hook path). This scenario documents the incident for future reference; see §3 Failure Triage if the executable bit regresses again (e.g. after a checkout that strips permissions).

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to confirm that editing a source file whose compiled build is out of date actually surfaces a warning in the session, the same way the existing comment-hygiene warning does.

**Exact prompt**:
```
Edit .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts while its compiled dist output is stale, and confirm claude-posttooluse.sh prints a STALE DIST WARNING banner and still exits 0.
```

**Expected detection**: not applicable — this is a deterministic hook-wiring check, not a routing decision (no advisor probe, no surface/reference loading).

**Expected behavior (intended contract)**:
- The hook receives the standard Claude Code PostToolUse stdin JSON (`tool_name`, `tool_input.file_path`, `cwd`) for the edited file.
- `check-dist-staleness.sh` resolves the file against `dist-freshness.cjs`'s `DIST_PACKAGES` registry, finds the `system-spec-kit/mcp_server` package stale, and prints `STALE DIST WARNING: @spec-kit/mcp-server -- run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build` to stdout.
- The hook's own stdout wraps that line in blank lines and the process exits 0.

**Desired user-visible outcome**: A stale build a session is about to keep editing on top of gets flagged in-session, without ever blocking the edit itself.

## 3. TEST EXECUTION

### Preconditions

1. The hook resolves: `bash: test -f .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`.
2. The dist-staleness checker resolves: `bash: test -f .opencode/skills/sk-code/scripts/check-dist-staleness.sh`.
3. **Check the executable bit before running** (`bash: ls -la .opencode/skills/sk-code/scripts/check-dist-staleness.sh`) — if it reads `-rw-r--r--` instead of `-rwxr-xr-x`, the run will reproduce the known gap in §1 instead of the intended banner; run `chmod +x` on it first if the goal is to verify the intended contract rather than reproduce the gap.

### Exact Command Sequence

1. **Make the target package's dist stale** (reversible — see `manual_testing_playbook/16--tooling-and-scripts/cli-dist-freshness-guard.md` in the system-spec-kit skill for the same recipe used against the identical package):
   ```bash
   SOURCE=.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts
   DIST=.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js
   BAK=$(mktemp); cp "$SOURCE" "$BAK"
   printf '\n' >> "$SOURCE"
   touch -t 202001010000 "$DIST"
   rm -f .opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/.dist-freshness-system-spec-kit-mcp_server-*.json
   ```
2. **Invoke the checker directly** to confirm the underlying banner logic independent of the hook's subprocess call:
   ```bash
   python3 .opencode/skills/sk-code/scripts/check-dist-staleness.sh "$(pwd)/$SOURCE"; echo "direct_exit=$?"
   ```
3. **Invoke the full hook** the way Claude Code actually calls it, via stdin JSON:
   ```bash
   PAYLOAD=$(python3 -c "import json,os; print(json.dumps({'tool_name':'Edit','tool_input':{'file_path':os.path.abspath('$SOURCE')},'cwd':os.getcwd()}))")
   echo "$PAYLOAD" | python3 .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh; echo "hook_exit=$?"
   ```
4. **Restore** exactly:
   ```bash
   cp "$BAK" "$SOURCE"; rm -f "$BAK"
   touch "$DIST"
   rm -f .opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/.dist-freshness-system-spec-kit-mcp_server-*.json
   ```
   Confirm `git diff --stat -- "$SOURCE"` is empty of unexpected drift (it may show the repo's own pre-existing uncommitted lines on this branch if any were present before the test — do not `git checkout` the file to "clean" it, since that discards real uncommitted work; only restore via the backup copy).

### Expected Signals

| Step | Signal (intended contract, checker executable) | Signal (current shipped state, checker not executable) |
|---|---|---|
| 2 | stdout: `STALE DIST WARNING: @spec-kit/mcp-server -- run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`; `direct_exit=0` | Same — direct `python3` invocation bypasses the file's own execute bit, so step 2 always shows the intended banner regardless of the gap |
| 3 | hook stdout contains the STALE DIST WARNING banner (blank-line wrapped); `hook_exit=0` | hook stdout is empty; stderr contains `WARNING: dist staleness checker failed: [Errno 13] Permission denied: '<abs path to check-dist-staleness.sh>'`; `hook_exit=0` (still) |

### Pass/Fail Criteria

- **PASS** iff: the hook prints the STALE DIST WARNING banner to stdout for the stale package AND exits 0.
- **PARTIAL** iff: the hook exits 0 (warn-only contract holds) but the banner does not reach stdout due to a checker-invocation failure (e.g. the missing-executable-bit gap in §1) — the failure is caught safely but coverage is not achieved.
- **FAIL** iff: the hook exits non-zero (blocks the edit) for any reason, or the checker fires the banner when the package is actually fresh (false positive).

### Failure Triage

1. **Banner missing, stderr shows `Permission denied` on `check-dist-staleness.sh`**: this is the known current gap (§1). Fix: `chmod +x .opencode/skills/sk-code/scripts/check-dist-staleness.sh` (mirrors `check-comment-hygiene.sh`'s existing `-rwxr-xr-x`), then re-run step 3.
2. **Banner missing with no stderr warning**: confirm the edited file's absolute path actually falls under `dist-freshness.cjs`'s `DIST_PACKAGES` source candidates for `system-spec-kit/mcp_server` (`lib/validation` is a watched `entrySourceCandidates` path for the `validation-orchestrator` entry, but the default entry's candidates differ — verify with `node .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs check-file --file "$SOURCE" --json`).
3. **Hook exits non-zero**: this breaks the warn-only contract and is a regression — inspect `claude-posttooluse.sh`'s outer `try`/`except` around the dist-checker `subprocess.run` call; it must never propagate a checker failure as a hook failure.
4. **Restore leaves a diff on `orchestrator.ts`**: the restore did not land — re-run `cp "$BAK" "$SOURCE"` from the still-open backup path before doing anything else; never use `git checkout` to "clean" this file, since it may carry unrelated real uncommitted work on the active branch.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` — Dispatches both the comment-hygiene and dist-staleness checkers on every `Write`/`Edit`; always exits 0.
- `.opencode/skills/sk-code/scripts/check-dist-staleness.sh` — Dist-staleness checker (Python, `.sh` extension); currently missing its executable bit (see §1, §3 Failure Triage).
- `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` — Shared `checkFileFreshness()` / `DIST_PACKAGES` registry the checker calls.

**Related**: `claude-posttooluse.sh` also runs the pre-existing comment-hygiene check (`check-comment-hygiene.sh`, see `references/universal/code_style_guide.md` §4) on the same edit. That checker itself currently has **no dedicated manual testing playbook scenario** in this package — a known pre-existing gap, unrelated to and out of scope for this scenario. It is flagged here for visibility only; fixing it is a separate task.

## 5. SOURCE METADATA

- **Created**: 2026-07-02
- **Critical path**: No
- **Destructive**: No (writes only touch mtimes and a temp cache file under the already-gitignored `dist/` tree; content changes are backed up and restored byte-exact via the local `$BAK` copy)
- **Sandbox**: mutations are confined to `orchestrator.ts` mtime/content (restored) and `orchestrator.js` mtime (restored); no production behavior changes
- **Concurrent-safe**: No (touches a shared source file's mtime; run this scenario serially, and avoid running it while another session may be editing the same file)
- **Last validated**: 2026-07-02 — **PASS**. Initial authoring run found the missing-executable-bit gap (see §1, PARTIAL at the time); `chmod +x .opencode/skills/sk-code/scripts/check-dist-staleness.sh` applied and both the direct checker invocation and the full hook path independently re-verified afterward -- fresh dist exits 0 silently, stale dist prints the STALE DIST WARNING banner to stdout and still exits 0.
