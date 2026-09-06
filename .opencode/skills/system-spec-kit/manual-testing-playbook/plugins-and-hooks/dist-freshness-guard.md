---
title: "Dist Freshness Guard"
description: "Manual validation of the system-dist-freshness-guard OpenCode plugin dist staleness warning."
trigger_phrases:
  - "system-dist-freshness-guard"
  - "dist freshness guard"
  - "session.created stale dist warning"
  - "stale compiled dist"
version: 1.0.0.0
id: plugins-and-hooks-dist-freshness-guard
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Dist Freshness Guard

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`system-dist-freshness-guard` is an OpenCode plugin that warns when a locally compiled TypeScript
`dist/` output is stale relative to its source, so a Bash dispatch or a new session never
silently trusts an out-of-date build. It reuses the shared `checkAllFreshness()` /
`checkPackageFreshness()` helpers from `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`
against a fixed registry of six watched packages (`system-spec-kit/shared`,
`system-spec-kit/runtime/cli`, `system-spec-kit/runtime`, `mcp-code-mode/mcp-server`,
`system-skill-advisor/mcp-server`, `sk-design-md-generator/backend`).

The guard fires diagnostics on three triggers: OpenCode's `session.created` event (once per
session, deduplicated by session ID up to `MAX_SESSION_IDS = 1000`), a risky Bash command
matching `RISKY_BASH_COMMAND_REGEX = /opencode\s+run|\bvalidate\.sh\b/i`, and any mutating tool
(`write`, `edit`, `patch`, `multiedit`, `apply_patch`, `apply-patch`) touching a watched source
file, which invalidates the per-instance `STALE_CACHE_TTL_MS = 120_000` cache so the next
injection re-checks instead of serving a stale verdict. Critically the plugin never writes to
stdout/stderr -- OpenCode's TUI paints plugin console output onto the prompt input line where it
sticks until a redraw -- so every diagnostic goes through exactly two channels: an append-only
audit log at `.opencode/logs/dist-freshness-guard.log` (rotated at `MAX_GUARD_LOG_BYTES = 256KB`
to a `.1` sibling) and the `experimental.chat.system.transform` hook, which appends a bounded
`[dist-freshness-guard] ...` brief (capped at `MAX_DIAGNOSTIC_LINES = 8` body lines) into
`output.system` so the agent actually sees it in-context.

Claude Code cannot load OpenCode plugins, so the same shared `dist-freshness.cjs` core is wired
into Claude Code through a parallel, non-plugin path: a `SessionStart` hook that runs
`check-dist-staleness.sh --all` (checks every watched package once per session, mirroring the
plugin's `session.created` trigger) and a `PostToolUse(Write|Edit)` hook
(`claude-posttooluse.cjs`) that checks only the single edited file's owning package via
`router.runDistStalenessCheck`. This scenario validates the OpenCode plugin itself plus its
Claude-side sibling, using the plugin's own unit-test suite and direct live invocations against
the real repository state.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the plugin (a) detects real stale/fresh dist state for every watched
  package, (b) surfaces diagnostics only through the audit log and the system-context
  injection channel -- never stdout/stderr, (c) refreshes on `session.created` and on a risky
  Bash command, and (d) the Claude-side `SessionStart` wrapper agrees with the same finding.
- Preconditions: repository checked out at its current commit; Node available on `PATH`;
  `.opencode/plugins/system-dist-freshness-guard.js` and
  `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` present.
- Real user-facing trigger: starting a new OpenCode session (fires `session.created`), or
  running a Bash command containing `validate.sh` or `opencode run` (fires the risky-bash
  refresh), while at least one watched package's compiled `dist/` predates its TypeScript
  source.
- Expected signals: `STALE DIST WARNING: <packageName> -- run: <rebuildCommand>` and/or
  `DIST FRESHNESS CHECK ERROR: <packageName> -- <message>` lines appear in
  `.opencode/logs/dist-freshness-guard.log` and inside the injected `output.system[]` brief;
  zero console.warn/error/log calls at any point; the Claude `--all` wrapper prints the same
  stale package names.
- Pass/fail: PASS if the unit-test suite is green, a live check-all run against the real repo
  and the plugin's own `session.created` + risky-bash paths report the identical stale
  package(s), no terminal output occurs, and the Claude-side wrapper's `--all` output agrees.
  FAIL if any diagnostic reaches stdout/stderr, the plugin's live verdict disagrees with the
  raw `dist-freshness.cjs check-all` verdict, or the unit tests do not pass.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Validate the Dist Freshness Guard end to end against the commands below, and report a PASS or FAIL verdict with cited command output.`

```text
confirm the plugin (a) detects real stale/fresh dist state for every watched
```

### Commands

1. Run the plugin's own regression suite:

   ```bash
   node .opencode/plugins/tests/system-dist-freshness-guard.test.cjs
   ```

   Expected: TAP output, `# tests 15`, `# pass 15`, `# fail 0`.

2. Run the shared checker directly against the live repo to get ground truth:

   ```bash
   node .opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all --json
   ```

   Expected: JSON `{"status": "stale"|"fresh"|"degraded", "results": [...]}` for the 6 packages;
   exit code `69` (`STALE_EXIT_CODE`) when at least one package is stale, `0` otherwise.

3. Drive the real plugin's `session.created` -> `experimental.chat.system.transform` path with
   the live repo as `ctx.directory`, and confirm the injected brief matches step 2's verdict:

   ```bash
   node -e '
   (async () => {
     const { pathToFileURL } = require("node:url");
     const path = require("node:path");
     const url = pathToFileURL(path.join(process.cwd(), ".opencode/plugins/system-dist-freshness-guard.js")).href;
     const mod = await import(url);
     const hooks = await mod.default({ directory: process.cwd() });
     const output = { system: [] };
     await hooks.event({ event: { type: "session.created", sessionID: "manual-test-session" } });
     await hooks["experimental.chat.system.transform"]({}, output);
     console.log(JSON.stringify(output.system, null, 2));
   })();
   '
   ```

   Expected: `output.system` contains a `[dist-freshness-guard] Local compiled dist is stale...`
   entry (or is empty if every package is fresh at run time).

4. Confirm the risky-bash trigger refreshes diagnostics with zero terminal output:

   ```bash
   node -e '
   (async () => {
     const { pathToFileURL } = require("node:url");
     const path = require("node:path");
     const url = pathToFileURL(path.join(process.cwd(), ".opencode/plugins/system-dist-freshness-guard.js")).href;
     const mod = await import(url);
     const hooks = await mod.default({ directory: process.cwd() });
     const captured = [];
     const w = console.warn, e = console.error, l = console.log;
     console.warn = (m) => captured.push("warn:" + m);
     console.error = (m) => captured.push("error:" + m);
     console.log = (m) => captured.push("log:" + m);
     await hooks["tool.execute.before"]({ tool: "bash" }, { args: { command: "bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh some-spec --strict" } });
     console.warn = w; console.error = e; console.log = l;
     console.log(JSON.stringify(captured));
   })();
   '
   ```

   Expected: printed array is `[]` (no terminal output) and
   `.opencode/logs/dist-freshness-guard.log` gains one new `risky-bash:` line.

5. Confirm the Claude-side `SessionStart` sibling agrees:

   ```bash
   python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all
   ```

   Expected: one `STALE DIST WARNING: <packageName> -- run: <rebuildCommand>` line per stale
   package, matching step 2's stale package names exactly; exits `0` regardless of findings.

6. Kill-switch / enforce check (Claude PostToolUse path only, out of scope for the OpenCode
   plugin which has no kill-switch flag): the sibling `claude-posttooluse.cjs` hook honors
   `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` as a full no-op for its comment-hygiene checks, but the
   legacy dist-staleness block in that same file runs unconditionally after the disabled
   early-return only when `DISABLED_ENV` is unset; setting it to `1` short-circuits the whole
   hook, including dist-staleness, before stdin is even read.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: The unit-test suite is green, a live check-all run against the real repo.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the plugin host, bridge, and core files listed in section 4 are the ones actually loaded, and that any compiled output is current.
3. Compare the observed output field by field against the expected signals in section 2, and quote the first field that disagrees.


---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Plugin: `.opencode/plugins/system-dist-freshness-guard.js`
- Plugin unit test: `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs`
- Shared core: `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`
- Claude `SessionStart` wrapper: `.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`
- Claude `PostToolUse(Write|Edit)` hook: `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`
- Claude hook router: `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs`
- Hook wiring: `.claude/settings.json` (`SessionStart` and `PostToolUse` blocks)
- Guard audit log (runtime artifact, not source): `.opencode/logs/dist-freshness-guard.log`

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: dist-freshness-guard
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/dist-freshness-guard.md`
