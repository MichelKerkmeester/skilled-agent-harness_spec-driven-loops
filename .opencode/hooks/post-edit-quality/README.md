---
title: "Post-Edit Quality: Warn-Only Checker Router"
description: "Path-dispatch router that runs comment-hygiene, dist-staleness and related checkers after every Write/Edit, shared by Claude, Devin, Codex, Cursor, Pi and the OpenCode plugin."
trigger_phrases:
  - "post edit quality"
  - "comment hygiene hook"
  - "dist staleness hook"
---

# Post-Edit Quality: Warn-Only Checker Router

---

## 1. OVERVIEW

`post-edit-quality/` runs quality checkers against a file right after it is written or edited and surfaces bounded, redacted findings back to the model. One path-dispatch table in `lib/post-edit-router.cjs` decides which checker(s) apply to which file, shared by every runtime adapter so policy cannot drift between them. The router returns at most one checker per edit — the table is deliberately narrow and near-mutually-exclusive, with rows evaluated in priority order so an overlapping path resolves to exactly one checker, never two.

Warn-only by contract: every failure path (missing checker, unexpected exit code, spawn error, exhausted deadline) resolves to no finding, and the edit itself is never blocked. The router never writes stdout/stderr and never throws; each adapter owns its own transport.

The checker scripts themselves (comment hygiene, dist staleness, flowchart, frontmatter, placeholders, wikilinks) stay in their owning skills — the router invokes them by project-root-relative path via `spawnSync`, never a static import.

---

## 2. WHAT IT DOES

Fires after every `Write`/`Edit` (Claude), `apply_patch`/`edit` (Codex), `edit` (Devin), `edit`/`write` (Pi), or `write`/`edit`/`patch`/`multiedit`/`apply_patch` (OpenCode), resolves the edited file through the dispatch table, and runs the matched checker under a shared deadline. The comment-hygiene checker's finding is printed verbatim by the Claude/Codex/Devin adapters:

```text
COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in <file>:
  <file>:<line>: <offending comment excerpt>
See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4
Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.
```

Other checkers print:

```text
POST-EDIT QUALITY WARNING [<checker-label>] for <file>:
  <checker output lines>
```

The dispatch table rows, in priority order (`resolveDispatch` returns the first match only):

| Priority | Label | Fires when | Checker | Surface rule |
|---|---|---|---|---|
| 1 | `comment-hygiene` | In-scope source file (`.ts`/`.tsx`/`.js`/`.mjs`/`.cjs`/`.py`/`.sh`/`.bash`/`.jsonc`) outside `dist`/`node_modules`/`.git` | `check-comment-hygiene.sh` | `exit1-with-stdout` (exit 1 AND non-empty stdout) |
| 2 | `flowchart` | `.md` file whose name contains "flowchart" or lives under `sk-design-diagram/ascii-patterns/` | `validate-flowchart.sh` | `exit1` |
| 3 | `frontmatter-versions` | Versioned skill doc under `.opencode/skills/` (`SKILL.md`, `README.md` adjacent to a `SKILL.md`, or any file under `references`/`assets`/`feature-catalog`/`manual-testing-playbook`) | `check-frontmatter-versions.sh --skill <name>` | `exit1` (deduped per skill per session) |
| 4 | `placeholders` | Spec doc (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md`) under `specs/` | `check-placeholders.sh <dir>` | `exit1` |
| 5 | `wikilinks` | `.md` under `.opencode/skills/`, opt-in only (`SPECKIT_VALIDATE_LINKS=true`) | `check-links.sh <skill dir>` | `exit1` |

A separate entrypoint, `runDistStalenessCheck`, preserves the legacy dist-staleness coverage that runs alongside comment hygiene. It is kept out of the shared dispatch table because it is unconditional per edited file rather than path-matched, and because OpenCode already has independent dist-freshness coverage via `system-dist-freshness-guard.js` — folding it into the table would double-run it there. It prints `STALE DIST WARNING: <package> -- run: <rebuild command>` when a watched package's compiled output is older than its newest source.

Findings are bounded (2000 chars per finding, 20 findings max) and redacted: keyworded secret assignments (`api_key=`, `token:`, `bearer`, `authorization`, ...) are replaced with `[REDACTED]` before any text is printed or logged.

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the **same** `lib/post-edit-router.cjs` core. What differs is the event each runtime fires, how the edited file path is extracted, and how findings are delivered back.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/claude-posttooluse.cjs` | `PostToolUse` on `Write\|Edit` | `tool_input.file_path`; resolves project dir from `payload.cwd` or `CLAUDE_PROJECT_DIR` | Plain stdout (transcript/verbose view; not model context in normal use). 9s budget, 8s per checker. |
| **Codex** | `codex/post-edit-quality.cjs` | `PostToolUse` on `apply_patch\|edit` (`.codex/hooks.json`) | `apply_patch` bundles multiple files in one patch body — extracts every `*** Add/Update/Delete File:` and `*** Move to:` header so each file gets checked; resolves relative paths against `CODEX_PROJECT_DIR` | Plain stdout. One shared budget across all files in a patch; dist-staleness runs once against the first existing file. |
| **Devin** | `devin/post-edit-quality.cjs` | `PostToolUse` on `edit` (`.devin/hooks.v1.json`) | `file_path`/`filePath`/`path`; resolves relative paths against `DEVIN_PROJECT_DIR` | Plain stdout. |
| **Cursor** | `cursor/post-tool-use.mjs` | `postToolUse` event | Multiplexed proxy: `Write` tool_name → shapes a Claude payload and `spawnSync`s `claude-posttooluse.cjs`; `Shell` → dispatch audit (separate concern) | Findings returned as `agent_message` in the `{permission: 'allow'}` envelope. |
| **Pi** | `pi/post-edit-quality.ts` | `tool_result` event, discovered via `.pi/extensions/` | `toolName: 'edit'`/`'write'`; `event.input.path` resolved against `ctx.cwd` | Appends findings as `{type: "text", text}` content to the tool result — model-visible. |
| **OpenCode** | `.opencode/plugins/sk-code-post-edit-quality.js` (mirrored at `opencode/`) | Plugin: `tool.execute.before` + `tool.execute.after` + `experimental.chat.system.transform` | `after` carries only a `callID`, so `before` stashes the file path in a bounded correlation map and `after` retrieves+evicts it; watches `write`/`edit`/`patch`/`multiedit`/`apply_patch` | Findings buffered, then drained into the next turn's system context (model-visible) via the transform hook. Also written to a rotated log `.opencode/logs/post-edit-quality.log` (256 KB). **Never** stdout/stderr — OpenCode's TUI paints console output onto the prompt line. 4s budget, 3s per checker, per-skill dedupe. |

The three CommonJS adapters (Claude, Codex, Devin) share the same structure: read stdin JSON, fast-exit on a non-edit tool name, resolve the file, run the router, print findings. They share the Claude budget constants. Cursor deliberately does not reimplement the check: it reshapes its `Write` payload and shells out to the Claude adapter. Pi and OpenCode deliver findings into model-visible channels (tool-result content and the system transform respectively) rather than stdout.

Two runtimes are mirrored rather than hosted here. OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/sk-code-post-edit-quality.js` is a browsability-only symlink back into that folder and nothing loads through it. Pi loads in the other direction: the real `pi/post-edit-quality.ts` lives here, and `.pi/extensions/` holds the relative symlink Pi discovers.

---

## 4. DIRECTORY TREE

```text
post-edit-quality/
+-- lib/
|   `-- post-edit-router.cjs      # dispatch table + deadline-bounded checker runner
+-- claude/   claude-posttooluse.cjs
+-- devin/    post-edit-quality.cjs
+-- codex/    post-edit-quality.cjs
+-- cursor/   post-tool-use.mjs    # multiplexed proxy (Write -> post-edit-quality, Shell -> dispatch)
+-- pi/       post-edit-quality.ts (real file; `.pi/extensions/` symlinks to it)
`-- opencode/ sk-code-post-edit-quality.js (browsability symlink -> ../../../plugins/; real file loaded from .opencode/plugins/)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/post-edit-router.cjs` | `resolveDispatch()` is a pure path/string resolver mapping an edited file to its applicable checker (the five-row table above). `runChecks()` spawns the resolved checker under a shared deadline and returns bounded, redacted findings. `runDistStalenessCheck()` is the separate dist-staleness entrypoint. `createDedupeTracker()` gives the OpenCode plugin per-skill-per-session suppression. Imports Node builtins only; checkers are spawned by path, never imported. |
| `claude/claude-posttooluse.cjs` | Claude `PostToolUse(Write\|Edit)` adapter. Resolves the file, runs the router under the Claude budget, prints findings to stdout. Runs dist-staleness separately. |
| `codex/post-edit-quality.cjs` | Codex `PostToolUse(apply_patch\|edit)` adapter. Extracts every `*** Add/Update/Delete File:` / `*** Move to:` target from a multi-file patch so each file gets checked. |
| `devin/post-edit-quality.cjs` | Devin `PostToolUse(edit)` adapter. Accepts `file_path`/`filePath`/`path` and resolves relative paths against the project dir. |
| `cursor/post-tool-use.mjs` | Multiplexed Cursor proxy. For `Write`, shapes a Claude payload and `spawnSync`s the Claude adapter, returning findings as `agent_message`. Real home is under `system-spec-kit`; indexed here as a symlink. |
| `pi/post-edit-quality.ts` | Pi `tool_result` extension. Resolves the path, runs the router, appends findings as text content to the tool result. |
| `.opencode/plugins/sk-code-post-edit-quality.js` | OpenCode plugin. `before`/`after` correlate the file path by callID; `after` runs the router under the OpenCode budget with dedupe; `experimental.chat.system.transform` drains buffered findings into the next turn's system context. Also writes a rotated log. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | Full no-op on every runtime. The shared resolver (`isHookEnabled('post-edit-quality')`) short-circuits every adapter; the OpenCode plugin also checks this name directly. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_VALIDATE_LINKS=true` | Opt-in. Enables the wikilinks checker row (the heaviest checker — a whole-tree scan), scoped to markdown edits inside a skill directory. Off by default. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The router imports Node builtins only; checker scripts are spawned by project-root-relative path, never imported. Adapters import `../lib/` and `../../shared/hook-flags.cjs` (or `hook-flags.mjs` for Pi) only. The Cursor proxy imports `hook-flags.mjs` by a deep repo-relative path because its real home is under `system-spec-kit`. |
| Decisions | Findings are advisory text. Nothing here can block or roll back an edit. |
| Failure | Every checker failure mode (missing checker, spawn error, timeout/signal kill, exit code outside `{0,1}`, exhausted deadline) resolves to silence. |
| Output | The router never writes stdout/stderr. The OpenCode plugin never writes stdout/stderr either (it logs to file and buffers for the system transform); the Claude/Codex/Devin adapters print to stdout; Pi appends to tool-result content. |

---

## 8. VALIDATION

```bash
node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs
```

Expected result: all tests pass (covers the router and the Claude/Codex adapters, including multi-file patch coverage).

```bash
node -e "import('./.opencode/plugins/sk-code-post-edit-quality.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (confirms the OpenCode adapter still resolves this core).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): finding visibility per runtime.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../skills/sk-code/sk-code-quality/SKILL.md`](../../skills/sk-code/sk-code-quality/SKILL.md): the comment-hygiene standard the primary checker enforces.
