---
title: "PLG-003 -- Post-Edit Quality Router"
description: "Manual validation for the mk-post-edit-quality plugin and Claude PostToolUse hook"
trigger_phrases:
  - "plg-001"
  - "post-edit-quality"
  - "post edit quality router"
  - "mk-post-edit-quality"
  - "posttooluse quality hook"
version: 1.0.0.0
---

# PLG-003 -- Post-Edit Quality Router

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-post-edit-quality` is a runtime-neutral post-edit quality router shared by two adapters over one
core: the OpenCode plugin (`tool.execute.before` / `tool.execute.after` / `experimental.chat.system.transform`)
and the Claude Code `PostToolUse(Write|Edit)` hook. Both adapters call the same
`post-edit-router.cjs` core (`resolveDispatch()` then `runChecks()`) so the two runtimes cannot drift
on which checker fires for an edited file: comment-hygiene for in-scope source files,
frontmatter-versions for versioned skill docs, placeholders for spec-folder docs, flowchart for
flowchart assets, and an opt-in wikilinks scan. The Claude adapter prints findings directly to stdout
inline with the tool call; the OpenCode adapter cannot (OpenCode's TUI paints plugin stdout onto the
prompt line), so it buffers findings and drains them once into the next turn's
`experimental.chat.system.transform` system-message array, and separately appends every finding to a
bounded, rotated log file. Both adapters are warn-only and fail-open on every path: a missing checker,
a spawn error, a non-`{0,1}` exit code, or an exhausted shared deadline resolves to "no finding," never
to a thrown error or a blocked edit.

This scenario validates that the real dispatch/router core, the real Claude hook binary, and the real
OpenCode plugin module produce the documented behavior end-to-end: a genuine ephemeral-comment edit
surfaces a finding, a clean edit surfaces nothing, the `MK_POST_EDIT_QUALITY_DISABLED=1` kill-switch
fully silences every hook, and an edit outside the project root resolves to zero dispatch entries.

---

## 2. SCENARIO CONTRACT

- Preconditions:
  - `.opencode/plugins/mk-post-edit-quality.js` exists (OpenCode plugin adapter).
  - `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs` exists (Claude adapter).
  - `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs` exists (shared core).
  - `.claude/settings.json` wires `PostToolUse` matcher `Write|Edit` to the Claude adapter above.
  - `.opencode/plugins/tests/mk-post-edit-quality.test.cjs` (38 tests) is present.
  - All six canonical checker paths in `CHECKER_RELATIVE_PATHS` exist on disk (comment-hygiene,
    flowchart, frontmatter-versions, placeholders, wikilinks, dist-staleness) -- verified present.
  - Node `v22.23.1` available on PATH (confirmed via `node --version`).
- Real user-facing trigger: in a live Claude Code session, using the `Write` or `Edit` tool on an
  in-scope file (a `.ts`/`.js`/`.py`/`.sh` source file, a `SKILL.md`, or a spec-folder `spec.md`) fires
  `PostToolUse`, which runs the adapter above against the edited path. In OpenCode, calling
  `write`/`edit`/`patch`/`multiedit`/`apply_patch` on an in-scope file fires `tool.execute.before` (path
  stash) then `tool.execute.after` (dispatch + buffer), and the buffered advisory surfaces on the next
  turn's system-message transform.
- Expected signals:
  - Claude adapter, real ephemeral-comment `.ts` edit: stdout contains
    `COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.` and the offending
    line; process exit code `0`.
  - Claude adapter, clean edit or missing file or malformed stdin: empty stdout, exit code `0`, no
    stderr traceback.
  - Claude adapter, `MK_POST_EDIT_QUALITY_DISABLED=1`: empty stdout, exit code `0` (full no-op).
  - OpenCode plugin, real `tool.execute.before` -> `tool.execute.after` -> `chat.system.transform`
    sequence: `output.system` contains exactly one entry starting with
    `[post-edit-quality] Advisory findings from recent edits:`, and zero writes to
    `process.stdout`/`process.stderr` at any point.
  - OpenCode plugin, kill-switch env: `output.system` stays `[]` after the same sequence.
  - `resolveDispatch()` on a path outside the project root (e.g. a scratch dir under `/private/tmp`):
    returns `[]`, so neither adapter emits a finding.
  - `node --test` run of `mk-post-edit-quality.test.cjs`: `# pass 38`, `# fail 0`.
- Pass/fail: PASS if the real 38-test suite is fully green AND a live invocation of the real Claude
  adapter against a genuine ephemeral-comment file prints the `COMMENT HYGIENE WARNING` banner with
  exit `0` AND the kill-switch and outside-root cases both produce empty output AND a live import of the
  real OpenCode plugin module surfaces the buffered finding through `experimental.chat.system.transform`
  with zero terminal writes. FAIL if any real invocation throws, writes a stderr traceback, exits
  non-zero, blocks the observed edit, or the kill-switch fails to fully suppress a hook.

---

## 3. TEST EXECUTION

### Commands

1. Run the real unit-test suite (hermetic fixtures, no live session required):

```bash
node --test .opencode/plugins/tests/mk-post-edit-quality.test.cjs
```

Expected: `# tests 38`, `# pass 38`, `# fail 0`, `# cancelled 0`.

2. Live invocation of the real Claude PostToolUse adapter against a genuine ephemeral-comment file
   (created inside a throwaway dir under the repo root so `resolveDispatch` treats it as in-scope,
   then removed):

```bash
TMPDIR_LIVE=$(mktemp -d ".opencode/plugins/tests/.tmp-manual-scenario-live-XXXXXX")
cat > "$TMPDIR_LIVE/edited.ts" <<'EOF'
// See ADR-042 for details
export const liveSample = 1;
EOF
printf '%s' "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"$PWD/$TMPDIR_LIVE/edited.ts\"},\"cwd\":\"$PWD\"}" \
  | node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs
echo "EXIT_CODE=$?"
rm -rf "$TMPDIR_LIVE"
```

Expected: stdout contains `COMMENT HYGIENE WARNING`, `EXIT_CODE=0`.

3. Live kill-switch flip, against a fresh fixture file with the same violation (deliberately NOT
   reusing Command 2's `$TMPDIR_LIVE` -- Command 2's own trailing `rm -rf "$TMPDIR_LIVE"` already
   deletes that path, and the Claude adapter's `fs.existsSync(filePath)` guard returns early for any
   missing file regardless of the kill-switch; reusing the stale path would make this command "pass"
   with empty output even if the kill-switch were completely broken, since a missing file alone
   already produces empty stdout):

```bash
TMPDIR_KILL=$(mktemp -d ".opencode/plugins/tests/.tmp-manual-scenario-kill-XXXXXX")
cat > "$TMPDIR_KILL/edited.ts" <<'EOF'
// See ADR-042 for details
export const liveSample = 1;
EOF
printf '%s' "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"$PWD/$TMPDIR_KILL/edited.ts\"},\"cwd\":\"$PWD\"}" \
  | MK_POST_EDIT_QUALITY_DISABLED=1 node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs
echo "EXIT_CODE=$?"
rm -rf "$TMPDIR_KILL"
```

Expected: empty stdout, `EXIT_CODE=0` -- and this genuinely demonstrates suppression because the same
fixture (without the kill-switch env) would otherwise print `COMMENT HYGIENE WARNING`, as Command 2
just showed.

4. Live invocation of the real OpenCode plugin module (dynamic import of the actual default export,
   real `tool.execute.before`/`tool.execute.after`/`experimental.chat.system.transform` hooks, a fixture
   comment-hygiene checker so the run stays hermetic and fast):

```bash
TMPDIR_LIVE=$(mktemp -d ".opencode/plugins/tests/.tmp-manual-scenario-oc-XXXXXX")
mkdir -p "$TMPDIR_LIVE/.opencode/skills/sk-code/code-quality/scripts"
cat > "$TMPDIR_LIVE/edited.ts" <<'EOF'
// See ADR-042 for details
export const liveSample = 1;
EOF
cat > "$TMPDIR_LIVE/.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh" <<'HYG'
#!/usr/bin/env bash
echo "$1:1: fake ADR-style violation (live scenario fixture checker)"
exit 1
HYG
chmod +x "$TMPDIR_LIVE/.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh"

cat > "$TMPDIR_LIVE/live-invoke.mjs" <<EOF
import path from 'node:path';
const { default: MkPostEditQualityPlugin } = await import(new URL('file://$PWD/.opencode/plugins/mk-post-edit-quality.js'));
const projectDir = '$PWD/$TMPDIR_LIVE';
const editedFile = path.join(projectDir, 'edited.ts');
const hooks = await MkPostEditQualityPlugin({ directory: projectDir });
await hooks['tool.execute.before']({ tool: 'write', callID: 'live-call-1' }, { args: { filePath: editedFile } });
await hooks['tool.execute.after']({ tool: 'write', callID: 'live-call-1' }, { title: 'write', output: '', metadata: {} });
const output = { system: [] };
await hooks['experimental.chat.system.transform']({}, output);
console.log(JSON.stringify({ system: output.system }, null, 2));
EOF
node "$TMPDIR_LIVE/live-invoke.mjs"
rm -rf "$TMPDIR_LIVE"
```

Expected: JSON output with one `system` entry containing
`[post-edit-quality] Advisory findings from recent edits:` and the fixture finding line.

5. Adversarial -- a path outside the project root resolves to zero dispatch entries (this is why an
   edit under a scratchpad dir outside the repo never surfaces a finding, matching the unit test
   `resolveDispatch: adversarial -- a path outside the project root resolves to no match`). The
   fixture file must exist on disk first -- the Claude adapter's own `fs.existsSync(filePath)` guard
   (`claude-posttooluse.cjs`) returns early for a nonexistent path before `resolveDispatch` is ever
   called, so a command that skips file creation would produce the same empty output for the wrong
   reason and would not actually exercise the outside-root dispatch logic:

```bash
mkdir -p /private/tmp/mk-post-edit-quality-outside-root-check
cat > /private/tmp/mk-post-edit-quality-outside-root-check/outside-root.ts <<'EOF'
// See ADR-042 for details
export const liveSample = 1;
EOF
printf '%s' "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"/private/tmp/mk-post-edit-quality-outside-root-check/outside-root.ts\"},\"cwd\":\"$PWD\"}" \
  | node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs
echo "EXIT_CODE=$?"
rm -rf /private/tmp/mk-post-edit-quality-outside-root-check
```

Expected: empty stdout, `EXIT_CODE=0` (the fixture file exists, so the Claude adapter's
`fs.existsSync` guard passes and control reaches `resolveDispatch`; the router's `relativeSegments()`
then returns `null` for a path that is not a descendant of `projectDir`, so `resolveDispatch` returns
`[]` before any checker is even considered).

### Kill-switch reference

Env var: `MK_POST_EDIT_QUALITY_DISABLED`. Set to `"1"` to force every hook (Claude adapter and all
three OpenCode plugin hooks) into a full no-op, verified live in Command 3 above and in the unit-test
suite (`OpenCode plugin: kill-switch env makes every hook a full no-op`,
`Claude hook is a full no-op under its kill-switch env`).

---

## 4. EVIDENCE

Unit-test suite command and real tail output:

```bash
node --test .opencode/plugins/tests/mk-post-edit-quality.test.cjs
```

```text
1..38
# tests 38
# suites 0
# pass 38
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 11608.680125
```

Live Claude PostToolUse adapter invocation (real stdin payload, real checker install, throwaway file
removed after capture):

```text
--- edited.ts written inside repo tmp dir ---
// See ADR-042 for details
export const liveSample = 1;
--- live Claude PostToolUse hook invocation (real stdin payload) ---

COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/.tmp-manual-scenario-live-SQocEV/edited.ts:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/.tmp-manual-scenario-live-SQocEV/edited.ts:1: // See ADR-042 for details
See: .opencode/skills/sk-code/shared/references/universal/code_style_guide.md §4
Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.

EXIT_CODE=0
```

Live kill-switch invocation (same edited file, `MK_POST_EDIT_QUALITY_DISABLED=1`):

```text
--- live kill-switch invocation (MK_POST_EDIT_QUALITY_DISABLED=1) ---
EXIT_CODE=0 STDOUT_ABOVE_SHOULD_BE_EMPTY
```

(stdout above the exit-code line was empty, confirming the full no-op)

Live OpenCode plugin module invocation (real dynamic import, real hooks, fixture checker):

```text
--- live OpenCode plugin invocation (real import, real hooks, fixture checker) ---
{
  "system": [
    "[post-edit-quality] Advisory findings from recent edits:\n- [comment-hygiene] /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/.tmp-manual-scenario-oc-0VYiTx/edited.ts: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/tests/.tmp-manual-scenario-oc-0VYiTx/edited.ts:1: fake ADR-style violation (live scenario fixture checker)"
  ]
}
EXIT_CODE=0
```

Adversarial outside-project-root invocation (real scratchpad path, outside the repo root):

```bash
cat > /private/tmp/.../scratchpad/live-edit-sample.ts <<'EOF'
// See ADR-042 for details
export const liveSample = 1;
EOF
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":".../scratchpad/live-edit-sample.ts"},"cwd":"'"$PWD"'"}' \
  | node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs
echo "EXIT_CODE=$?"
```

```text
EXIT_CODE=0
```

(no stdout was produced -- the scratchpad path is outside `projectDir`, so `resolveDispatch` returned
`[]` before any checker ran, confirming the fail-safe outside-root behavior live, not only in the
unit test.)

Checker-path existence check (all six canonical paths `post-edit-router.cjs` dispatches to):

```text
OK  .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh
OK  .opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh
OK  .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh
OK  .opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh
OK  .opencode/skills/system-spec-kit/scripts/rules/check-links.sh
OK  .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh
```

`.claude/settings.json` wiring evidence (`PostToolUse` matcher `Write|Edit`):

```json
{
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "command",
      "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs'",
      "timeout": 10
    },
    {
      "type": "command",
      "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs'",
      "timeout": 5
    }
  ]
}
```

Not exercised live (documented as SKIP, not fabricated): a real end-to-end OpenCode session
(`tool.execute.after` firing from an actual `write`/`edit` tool call inside a running OpenCode TUI, and
the buffered finding actually appearing in the next model turn's system prompt) requires a live
OpenCode runtime session, which this sandboxed evidence pass does not have. The direct-import
invocation in Command 4 exercises the identical hook functions the real OpenCode host calls, and the
unit-test suite's `OpenCode plugin: before/after correlation...with zero terminal writes` test
additionally proves the console/stdout/stderr are never touched during that sequence -- both stand in
as the concrete fallback evidence for the runtime-session-only path.

Working-tree note: `.opencode/plugins/mk-post-edit-quality.js` shows as modified (`git diff --stat`,
9 insertions/9 deletions) in this repo's working tree independent of this scenario -- this scenario
only ever used `Read` on that file and ran throwaway fixtures under `mktemp`-created, removed-after-use
directories; it made no edits to any source file.

---

## 5. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- OpenCode plugin adapter: `.opencode/plugins/mk-post-edit-quality.js`
- Claude PostToolUse adapter: `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs`
- Shared runtime-neutral core: `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`
- Unit-test suite (38 tests): `.opencode/plugins/tests/mk-post-edit-quality.test.cjs`
- Hook wiring: `.claude/settings.json` (`PostToolUse` -> matcher `Write|Edit`)
- Checkers dispatched by the router:
  - `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`
  - `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh`
  - `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh`
  - `.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh`
  - `.opencode/skills/system-spec-kit/scripts/rules/check-links.sh`
  - `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: PLG-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins-and-hooks/post-edit-quality-router.md

---

## 7. PASS/FAIL

PASS

The real 38-test suite ran green (`# pass 38`, `# fail 0`, `# cancelled 0`). A live invocation of the
real Claude PostToolUse adapter against a genuine ephemeral-comment `.ts` file printed the exact
`COMMENT HYGIENE WARNING` banner with exit code `0`. The same adapter under
`MK_POST_EDIT_QUALITY_DISABLED=1` produced empty stdout with exit code `0` (full no-op). A direct live
import of the real OpenCode plugin module ran the actual `tool.execute.before` ->
`tool.execute.after` -> `experimental.chat.system.transform` sequence and surfaced the buffered finding
through `output.system` with no terminal writes. A path outside the project root produced empty stdout
live, matching the router's documented outside-root fail-safe. No fabricated output was used anywhere
in this evidence; the only unexercised path is a real OpenCode TUI session, documented above as a SKIP
with its concrete blocker and its unit-test/direct-import fallback evidence.
