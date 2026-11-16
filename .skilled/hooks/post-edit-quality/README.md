---
title: "Post-Edit Quality: Warn-Only Checker Router"
description: "Path-dispatch router that runs comment-hygiene, dist-staleness and related checkers after every Write/Edit, shared by Claude, Devin, Codex, Cursor, Pi, DSH, Vibe and the OpenCode plugin."
trigger_phrases:
  - "post edit quality"
  - "comment hygiene hook"
  - "dist staleness hook"
  - "cursor post edit quality"
  - "cursor post tool use"
  - "cursor quality proxy"
  - "opencode post edit quality"
  - "opencode quality plugin"
  - "opencode system context findings"
---

# Post-Edit Quality: Warn-Only Checker Router

---

## 1. OVERVIEW

`post-edit-quality/` runs quality checkers against a file right after it is written or edited. It surfaces bounded, redacted findings back to the model.

One path-dispatch table in `lib/post-edit-router.cjs` decides which checker applies to which file. Every runtime adapter shares that table, so policy cannot drift between them. The router returns at most one checker per edit. Rows are evaluated in priority order, so an overlapping path resolves to exactly one checker.

Warn-only by contract. A missing checker becomes one `quality-notice` finding, so an unchecked edit never reads as a clean one. Every other failure path resolves to no finding. The edit itself is never blocked.

The router never writes stdout or stderr and never throws. Each adapter owns its own transport.

The checker scripts stay in their owning skills. The router spawns them by path via `spawnSync`, never a static import. It looks for the comment-hygiene checker beside its own real path first, so a project that reaches this hub through a link still gets the hub's copy. It falls back to the project folder. The extensions it sends come from `sk-code-quality/assets/comment-syntax.json`, with a built-in set when that table cannot be read.

---

## 2. HOW IT WORKS

Each adapter fires after a write or edit, resolves the edited file through the dispatch table, and runs the matched checker under a shared deadline. The comment-hygiene finding is printed verbatim by the Claude, Codex and Devin adapters:

```text
COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in <file>:
  <file>:<line>: <offending comment excerpt>
See: .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md §4
Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.
```

Other checkers print:

```text
POST-EDIT QUALITY WARNING [<checker-label>] for <file>:
  <checker output lines>
```

The dispatch table rows, in priority order. `resolveDispatch` returns the first match only:

| Priority | Label | Fires when | Checker | Surface rule |
|---|---|---|---|---|
| 1 | `comment-hygiene` | In-scope source file (`.ts`/`.tsx`/`.js`/`.mjs`/`.cjs`/`.py`/`.sh`/`.bash`/`.jsonc`) outside `dist`/`node_modules`/`.git` | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | `exit1-with-stdout` (exit 1 and non-empty stdout) |
| 2 | `flowchart` | `.md` file whose name contains "flowchart" or lives under `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/` | `.skilled/skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh` | `exit1` |
| 3 | `frontmatter-versions` | A versioned doc under `.skilled/skills/`: every `.md` except changelog entries, test input (`tests/`, `fixtures/`), generated output (`runtime/`, `benchmark/`, `behavior-benchmark/` with no doc subtree above) and spec-doc examples. With `SPECKIT_VALIDATE_LINKS=true`, any of these but `SKILL.md` goes to `wikilinks` instead | `check-frontmatter-versions.sh --skill <name>` | `exit1` (deduped per skill per session) |
| 4 | `placeholders` | Spec doc under `specs/` (`spec.md`/`plan.md`/`tasks.md`/`decision-record.md`) and a file named checklist.md | `check-placeholders.sh <dir>` | `exit1` |
| 5 | `wikilinks` | `.md` under `.skilled/skills/`, opt-in only (`SPECKIT_VALIDATE_LINKS=true`) | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-links.sh <skill dir>` | `exit1` |

A separate entrypoint, `runDistStalenessCheck`, keeps the dist-staleness coverage that runs alongside comment hygiene. It runs `check-dist-staleness.sh` for a single file. It stays out of the shared table because it is unconditional per edited file rather than path-matched. OpenCode also carries its own dist-freshness coverage via `system-dist-freshness-guard.js`, so folding it in would double-run it there. It prints `STALE DIST WARNING: <package> -- run: <rebuild command>` when a watched package's compiled output is older than its newest source.

Findings are bounded at 2000 characters each, with 20 findings at most. Keyworded secret assignments such as `api_key=`, `token:`, `bearer` and `authorization` are replaced with `[REDACTED]` before any text is printed or logged. The same pattern also covers access_key, secret, password and passwd.

| Boundary | Rule |
|---|---|
| Imports | The router imports Node builtins only. Checker scripts are spawned by path, never imported. Only the comment-hygiene checker is looked up beside the router first, with the project folder second. Adapters import `../lib/` and the shared helpers in `../../shared/`. Claude, Codex and Devin use `hook-flags.cjs` plus `hook-adapter-shared.cjs` for stdin. Pi and DSH use `hook-flags.mjs`, and DSH also imports `../../shared/dsh/dsh-llm.mjs`. The Cursor proxy imports `hook-flags.mjs` by a deep repo-relative path, because its real home is under `system-spec-kit`. |
| Decisions | Findings are advisory text. Nothing here can block or roll back an edit. |
| Failure | A missing checker returns one de-duplicated `quality-notice` finding. Every other checker failure mode resolves to silence: a spawn error, a timeout or signal kill, an exit code outside `{0,1}` or an exhausted deadline. |
| Output | The router never writes stdout or stderr. The OpenCode plugin never writes either, since it logs to file and buffers for the system transform. Claude and Devin write a `hookSpecificOutput.additionalContext` JSON envelope on stdout. Codex prints plain text on stdout. Pi appends to tool-result content. |

---

## 3. RUNTIME COVERAGE

Every runtime evaluates the same `lib/post-edit-router.cjs` core. What differs is the event each runtime fires, how the edited file path is extracted and how findings reach the model.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse` on `Write\|Edit` | `claude/post-edit-quality.cjs` | `.skilled/hooks/post-edit-quality/claude/post-edit-quality.cjs` | A `hookSpecificOutput.additionalContext` envelope on stdout. |
| Codex | `PostToolUse` on `apply_patch\|edit` | `codex/post-edit-quality.cjs` | `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` | Plain text on stdout, one block per file in the patch. |
| Devin | `PostToolUse` on `^(edit\|write)$` | `devin/post-edit-quality.cjs` | `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | A `hookSpecificOutput.additionalContext` envelope on stdout. |
| Cursor | `postToolUse` [id `post-tool-use`, timeout 10] | `cursor/post-tool-use.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | `{permission: 'allow'}` with the findings as `agent_message`. |
| Pi | `tool_result` | `pi/post-edit-quality.ts` | `.skilled/hooks/post-edit-quality/pi/post-edit-quality.ts` | Findings appended as `{type: "text", text}` content on the tool result. |
| OpenCode | `experimental.chat.system.transform, tool.execute.after, tool.execute.before` | `opencode/sk-code-post-edit-quality.js` | `.opencode/plugins/sk-code-post-edit-quality.js` | A brief in the next turn's system context, plus a line in a log file. |
| DSH | `tools/post-execute` | `dsh/post-edit-quality.mjs` | `.skilled/hooks/post-edit-quality/dsh/post-edit-quality.mjs` | An extra context notice on an accepted tool result. |
| Vibe | `post_tool` | None | `.vibe/plugins/repo-guards/post-edit-quality.mjs` | `hook_specific_output.additional_context` on stdout. |

Claude, Codex and Devin share one structure. Each reads stdin JSON, exits fast on a non-edit tool name, resolves the file, runs the router, then delivers findings. Claude and Devin write a `hookSpecificOutput.additionalContext` JSON envelope on stdout. Codex prints plain text on stdout. All three use the Claude budget constants, a 9s budget with 8s per checker.

Claude registers the hook in `.claude/settings.json`, Codex in `.codex/hooks.json` and Devin in `.devin/hooks.v1.json`. Each registration sets a 10-second timeout. A clean edit prints nothing.

Claude resolves the project dir from `payload.cwd` or `CLAUDE_PROJECT_DIR`. It reads `tool_input.file_path`. Codex reads `file_path`, `filePath` or `path` first and falls back to patch headers. It extracts every `*** Add/Update/Delete File:` and `*** Move to:` header so each file in the patch gets checked.

Codex shares one budget across the files of a patch and resolves against `payload.cwd` or `CODEX_PROJECT_DIR`. Dist-staleness runs once against the first existing file. Devin accepts `file_path`/`filePath`/`path` and resolves relative paths against `DEVIN_PROJECT_DIR`.

Cursor does not reimplement the check. It reshapes its `Write` payload and shells out to the Claude adapter. Its `Shell` branch runs the dispatch audit instead, a separate concern. The proxy is registered as `postToolUse` with id `post-tool-use` and a 10 second timeout. The child runs under an 8000 ms timeout and a 1 MB buffer. A spawn failure approves with no message.

Pi listens on `tool_result`. The real `pi/post-edit-quality.ts` lives here, and `.pi/extensions/` holds a one-line entry file that re-exports it. It matches `toolName: 'edit'` and `'write'`. It resolves `event.input.path` against `ctx.cwd` and appends findings as `{type: "text", text}` content. It also runs `runDistStalenessCheck` and appends that banner.

OpenCode's `after` carries only a `callID`, so `before` stashes the file path in a bounded correlation map and `after` retrieves and evicts it. It watches `write`/`edit`/`patch`/`multiedit`/`apply_patch`/`apply-patch`. Findings are buffered, then drained into the next turn's system context via the transform hook. They are also written to a rotated log at `.skilled/logs/post-edit-quality.log`. Once that file passes 256 KB it is copied to `post-edit-quality.log.1` and then truncated.

The OpenCode plugin never writes stdout or stderr, because OpenCode's TUI paints console output onto the prompt line. It runs a 4s budget with 3s per checker and per-skill dedupe. OpenCode loads the plugin by a flat glob of `.opencode/plugins/`. The `opencode/` entry is a browsability link back into that folder, and nothing loads through it.

DSH registers on `tools/post-execute` through `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`, a link to `dsh/post-edit-quality.mjs`. It matches `write`, `edit` and `apply_patch`. It calls `next()` first and reads `path`, `file_path` or `filePath`. It attaches the findings as an extra context notice on an accepted result. It also runs `runDistStalenessCheck` and appends that banner.

Vibe registers a `post_tool` hook named `post-edit-quality` in `.vibe/hooks.toml`, with `strict = true` and a match on `write_file` and `edit`. It runs `.vibe/plugins/repo-guards/post-edit-quality.mjs`, which appends the findings to the tool result as `hook_specific_output.additional_context`. It also runs `runDistStalenessCheck` and appends that banner.

Each adapter has its own error path. Claude, Codex and Devin end in `process.exit(0)` and swallow a dispatch or spawn bug. Cursor approves on a parse failure. Its top-level catch writes `post-tool-use: <message>` to stderr before approving. Pi returns `undefined`, so the tool result stays as it was. OpenCode catches inside each hook body and returns. DSH calls `ctx.logger.warn` with `repo-guards post-edit-quality: <error>` and returns the downstream result. Vibe's `runGuard` writes `post-edit-quality: <message>` to stderr and exits 0.

---

## 4. DIRECTORY TREE

```text
post-edit-quality/
+-- lib/
|   `-- post-edit-router.cjs      # dispatch table + deadline-bounded checker runner
+-- tests/
|   +-- post-edit-router.test.cjs
|   +-- codex-post-edit-quality.test.cjs
|   +-- devin-post-edit-quality.test.cjs
|   `-- dsh-post-edit-quality.test.mjs
+-- claude/   post-edit-quality.cjs
+-- codex/    post-edit-quality.cjs
+-- cursor/   post-tool-use.mjs    # link to system-spec-kit's postToolUse proxy
+-- devin/    post-edit-quality.cjs
+-- dsh/      post-edit-quality.mjs
+-- opencode/ sk-code-post-edit-quality.js  # link to .opencode/plugins/
`-- pi/       post-edit-quality.ts
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/post-edit-router.cjs` | `resolveDispatch()` is a side-effect-free resolver mapping an edited file to its applicable checker. The only state it reads is whether the hub copy of a checker exists. `runChecks()` spawns the resolved checker under a shared deadline and returns bounded, redacted findings. `runDistStalenessCheck()` is the separate dist-staleness entrypoint. `createDedupeTracker()` gives the OpenCode plugin per-skill-per-session suppression. Imports Node builtins only. Checkers are spawned by path, never imported. |
| `claude/post-edit-quality.cjs` | Claude `PostToolUse(Write\|Edit)` adapter. Resolves the file, runs the router under the Claude budget, writes findings as a `hookSpecificOutput.additionalContext` JSON envelope on stdout. Runs dist-staleness separately. |
| `codex/post-edit-quality.cjs` | Codex `PostToolUse(apply_patch\|edit)` adapter. Extracts every `*** Add/Update/Delete File:` and `*** Move to:` target from a patch so each file gets checked. |
| `devin/post-edit-quality.cjs` | Devin `PostToolUse(^(edit\|write)$)` adapter. Accepts `file_path`/`filePath`/`path` and resolves relative paths against the project dir. |
| `cursor/post-tool-use.mjs` | Multiplexed Cursor proxy. For `Write`, shapes a Claude payload and `spawnSync`s the Claude adapter, returning findings as `agent_message`. Real home is under `system-spec-kit`, indexed here as a link. |
| `pi/post-edit-quality.ts` | Pi `tool_result` extension. Resolves the path, runs the router, appends findings as text content to the tool result. |
| `dsh/post-edit-quality.mjs` | DSH `tools/post-execute` adapter. Resolves the path, runs the router, attaches findings as an extra context notice on an accepted result. |
| `.opencode/plugins/sk-code-post-edit-quality.js` | OpenCode plugin. `before` and `after` correlate the file path by callID. `after` runs the router under the OpenCode budget with dedupe. `experimental.chat.system.transform` drains buffered findings into the next turn's system context. Also writes a rotated log. |
| `.vibe/plugins/repo-guards/post-edit-quality.mjs` | Vibe `post_tool` hook. Runs the router on the written file and appends findings as `hook_specific_output.additional_context`. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | Full no-op on every runtime. The shared resolver (`isHookEnabled('post-edit-quality')`) short-circuits every adapter, the OpenCode plugin included. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_VALIDATE_LINKS=true` | Opt-in. Enables the wikilinks checker row, the heaviest one, a whole-tree scan scoped to markdown edits inside a skill directory. Off by default. |

`MK_POST_EDIT_QUALITY_DISABLED` is also accepted as an alias.

Set a flag inline for one command, export it for a session or persist it in `.skilled/hooks/hook-flags.env`. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. VALIDATION

```bash
node --test .skilled/hooks/post-edit-quality/tests/*.test.cjs
```

Expected result: the router suite and the Codex and Devin adapter suites all pass, with `fail 0`.

```bash
node --test .skilled/hooks/post-edit-quality/tests/dsh-post-edit-quality.test.mjs
```

Expected result: the DSH adapter suite passes, with `fail 0`.

```bash
node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs
```

Expected result: all tests pass. The suite covers the router and the Claude and Codex adapters, including multi-file patch coverage.

```bash
node -e "import('./.opencode/plugins/sk-code-post-edit-quality.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error, which confirms the OpenCode adapter still resolves this core.

---

## 8. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): finding visibility per runtime.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../dist-freshness/README.md`](../dist-freshness/README.md): the dist-staleness checker `runDistStalenessCheck` spawns for a single file.
- [`../../skills/sk-code/sk-code-quality/SKILL.md`](../../skills/sk-code/sk-code-quality/SKILL.md): the comment-hygiene standard the primary checker enforces.
