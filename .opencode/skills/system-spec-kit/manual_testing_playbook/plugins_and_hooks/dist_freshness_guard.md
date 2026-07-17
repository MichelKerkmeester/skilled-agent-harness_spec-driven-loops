---
title: "Dist Freshness Guard"
description: "Manual validation of the mk-dist-freshness-guard OpenCode plugin dist staleness warning."
trigger_phrases:
  - "mk-dist-freshness-guard"
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

`mk-dist-freshness-guard` is an OpenCode plugin that warns when a locally compiled TypeScript
`dist/` output is stale relative to its source, so a Bash dispatch or a new session never
silently trusts an out-of-date build. It reuses the shared `checkAllFreshness()` /
`checkPackageFreshness()` helpers from `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`
against a fixed registry of seven watched packages (`system-spec-kit/shared`,
`system-spec-kit/scripts`, `system-spec-kit/mcp_server`, `mcp-code-mode/mcp_server`,
`system-skill-advisor/mcp_server`, `system-code-graph/mcp_server`, and
`sk-design/design-md-generator/backend`).

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
  `.opencode/plugins/mk-dist-freshness-guard.js` and
  `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` present.
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

1. Run the plugin's own regression suite:

   ```bash
   node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs
   ```

   Expected: TAP output, `# tests 15`, `# pass 15`, `# fail 0`.

2. Run the shared checker directly against the live repo to get ground truth:

   ```bash
   node .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs check-all --json
   ```

   Expected: JSON `{"status": "stale"|"fresh"|"degraded", "results": [...]}` for the 7 packages;
   exit code `69` (`STALE_EXIT_CODE`) when at least one package is stale, `0` otherwise.

3. Drive the real plugin's `session.created` -> `experimental.chat.system.transform` path with
   the live repo as `ctx.directory`, and confirm the injected brief matches step 2's verdict:

   ```bash
   node -e '
   (async () => {
     const { pathToFileURL } = require("node:url");
     const path = require("node:path");
     const url = pathToFileURL(path.join(process.cwd(), ".opencode/plugins/mk-dist-freshness-guard.js")).href;
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
     const url = pathToFileURL(path.join(process.cwd(), ".opencode/plugins/mk-dist-freshness-guard.js")).href;
     const mod = await import(url);
     const hooks = await mod.default({ directory: process.cwd() });
     const captured = [];
     const w = console.warn, e = console.error, l = console.log;
     console.warn = (m) => captured.push("warn:" + m);
     console.error = (m) => captured.push("error:" + m);
     console.log = (m) => captured.push("log:" + m);
     await hooks["tool.execute.before"]({ tool: "bash" }, { args: { command: "bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh some-spec --strict" } });
     console.warn = w; console.error = e; console.log = l;
     console.log(JSON.stringify(captured));
   })();
   '
   ```

   Expected: printed array is `[]` (no terminal output) and
   `.opencode/logs/dist-freshness-guard.log` gains one new `risky-bash:` line.

5. Confirm the Claude-side `SessionStart` sibling agrees:

   ```bash
   python3 .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh --all
   ```

   Expected: one `STALE DIST WARNING: <packageName> -- run: <rebuildCommand>` line per stale
   package, matching step 2's stale package names exactly; exits `0` regardless of findings.

6. Kill-switch / enforce check (Claude PostToolUse path only, out of scope for the OpenCode
   plugin which has no kill-switch flag): the sibling `claude-posttooluse.cjs` hook honors
   `MK_POST_EDIT_QUALITY_DISABLED=1` as a full no-op for its comment-hygiene checks, but the
   legacy dist-staleness block in that same file runs unconditionally after the disabled
   early-return only when `DISABLED_ENV` is unset; setting it to `1` short-circuits the whole
   hook, including dist-staleness, before stdin is even read.

---

## 4. EVIDENCE

Step 1 -- unit test suite, real run against this checkout:

```text
TAP version 13
# Subtest: exports only the OpenCode plugin factory
ok 1 - exports only the OpenCode plugin factory
# Subtest: injects stale and check-error diagnostics without terminal output
ok 2 - injects stale and check-error diagnostics without terminal output
# Subtest: invalidates a warm cache for watched source mutations
ok 3 - invalidates a warm cache for watched source mutations
# Subtest: bounds session state and rotates the audit log
ok 4 - bounds session state and rotates the audit log
# Subtest: evicts the oldest session ID when the deduplication cap is reached
ok 5 - evicts the oldest session ID when the deduplication cap is reached
# Subtest: requires staged build provenance and verifies source and dist content
ok 6 - requires staged build provenance and verifies source and dist content
# Subtest: refuses promotion when watched input changes during a build
ok 7 - refuses promotion when watched input changes during a build
# Subtest: keeps JSON build inputs watched and preserves checker mtime fallback
ok 8 - keeps JSON build inputs watched and preserves checker mtime fallback
# Subtest: prunes only old matching cache temporaries
ok 9 - prunes only old matching cache temporaries
# Subtest: reports aggregate checker errors as degraded with exit zero
ok 10 - reports aggregate checker errors as degraded with exit zero
# Subtest: Claude hook rejects malformed envelopes without traceback
ok 11 - Claude hook rejects malformed envelopes without traceback
# Subtest: Claude hook shares one deadline across sequential checkers
ok 12 - Claude hook shares one deadline across sequential checkers
# Subtest: standalone wrapper resolves the shared checker from a non-repo-root cwd
ok 13 - standalone wrapper resolves the shared checker from a non-repo-root cwd
# Subtest: standalone wrapper surfaces checker errors and stale results distinctly
ok 14 - standalone wrapper surfaces checker errors and stale results distinctly
# Subtest: standalone wrapper still prints the stale banner for a stale package
ok 15 - standalone wrapper still prints the stale banner for a stale package
1..15
# tests 15
# pass 15
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

Step 2 -- live `check-all --json` against the real repository (real finding, not a fixture):
exit code `69`, and the JSON `results` array shows 6 packages `"status":"fresh"` and one
genuinely stale package:

```json
{"packageId":"sk-design/design-md-generator/backend","packageName":"design-system-extractor","status":"stale","stale":true,"packageRoot":".../.opencode/skills/sk-design/design-md-generator/backend","distEntry":".../dist/cli.js","entry":"default","rebuildCommand":"cd .opencode/skills/sk-design/design-md-generator/backend && npm run build","sourceCount":27,"newestSourceMtime":1783693794883.08,"newestSourceFile":".../scripts/report-gen.ts","distMtime":1782965858277.41,"message":"design-system-extractor dist is stale. Rebuild with: cd .opencode/skills/sk-design/design-md-generator/backend && npm run build"}
```

Step 3 -- live plugin `session.created` -> `experimental.chat.system.transform` injection,
run against the same live repository (`ctx.directory = process.cwd()`), captured
`output.system`:

```json
[
  "[dist-freshness-guard] Local compiled dist is stale; affected outputs may be untrustworthy until rebuilt:\n- STALE DIST WARNING: design-system-extractor -- run: cd .opencode/skills/sk-design/design-md-generator/backend && npm run build"
]
```

This matches step 2's live finding exactly, confirming the plugin's own diagnostic path
produces the same verdict as the raw checker.

Step 4 -- live risky-bash trigger (`tool.execute.before` with a `bash ... validate.sh ...`
command), console.warn/error/log trapped:

```text
=== captured terminal output during risky-bash trigger (must be empty) ===
[]
```

Real `.opencode/logs/dist-freshness-guard.log` tail after steps 3 and 4 (this file also
carries prior `inject:`-prefixed lines from an actual concurrently running OpenCode session
using this same plugin, confirming the log is genuinely live, not a fixture):

```text
2026-07-11T12:06:56.015Z [mk-dist-freshness-guard] inject: STALE DIST WARNING: @spec-kit/shared -- run: cd .opencode/skills/system-spec-kit/shared && npm run build; STALE DIST WARNING: @spec-kit/system-skill-advisor -- run: cd .opencode/skills/system-skill-advisor/mcp_server && npm run build; STALE DIST WARNING: design-system-extractor -- run: cd .opencode/skills/sk-design/design-md-generator/backend && npm run build
2026-07-11T12:40:11.580Z [mk-dist-freshness-guard] session.created: STALE DIST WARNING: design-system-extractor -- run: cd .opencode/skills/sk-design/design-md-generator/backend && npm run build
2026-07-11T12:40:40.362Z [mk-dist-freshness-guard] risky-bash: STALE DIST WARNING: design-system-extractor -- run: cd .opencode/skills/sk-design/design-md-generator/backend && npm run build
```

(The earlier `inject:` line also names `@spec-kit/shared` and
`@spec-kit/system-skill-advisor` as stale; those two packages were rebuilt fresh between that
concurrent session's check and this scenario's run, which is exactly the kind of point-in-time
drift the guard exists to catch -- it does not indicate a bug in this scenario's evidence.)

Step 5 -- Claude-side `SessionStart` sibling wrapper, live run:

```text
STALE DIST WARNING: design-system-extractor -- run: cd .opencode/skills/sk-design/design-md-generator/backend && npm run build
```

Identical stale-package name and rebuild command to steps 2 and 3, confirming the OpenCode
plugin and the Claude `SessionStart` hook agree on the same real repository state through the
same shared `dist-freshness.cjs` core.

---

## 5. SOURCE FILES

- Plugin: `.opencode/plugins/mk-dist-freshness-guard.js`
- Plugin unit test: `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`
- Shared core: `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`
- Claude `SessionStart` wrapper: `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh`
- Claude `PostToolUse(Write|Edit)` hook: `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs`
- Claude hook router: `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`
- Hook wiring: `.claude/settings.json` (`SessionStart` and `PostToolUse` blocks)
- Guard audit log (runtime artifact, not source): `.opencode/logs/dist-freshness-guard.log`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: dist-freshness-guard
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `plugins_and_hooks/dist_freshness_guard.md`

---

## 7. PASS/FAIL

PASS

The plugin's own regression suite is green (15/15, 0 failures). A live invocation of the real
plugin factory against this checkout's actual `ctx.directory` reproduced, through the
documented `session.created` and risky-bash triggers, the exact same stale-package finding
(`design-system-extractor`) that the raw `dist-freshness.cjs check-all --json` ground truth
reported independently, with zero console.warn/error/log calls captured at any point -- the
core no-terminal-output invariant holds. The Claude-side `SessionStart` sibling
(`check-dist-staleness.sh --all`) surfaced the identical stale package and rebuild command
through the same shared core, confirming the OpenCode plugin and its Claude-side equivalent
stay in agreement. No fabricated output was used: every payload above is a direct capture from
commands executed against this repository during this scenario's authoring.
