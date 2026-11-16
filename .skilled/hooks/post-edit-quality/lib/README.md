---
title: "Post-Edit Quality: Shared Checker Router"
description: "Runtime-neutral path-dispatch table and deadline-bounded checker runner that returns at most one checker per edit with bounded, redacted findings."
trigger_phrases:
  - "post edit router"
  - "quality checker dispatch"
  - "post edit quality core"
version: 1.0.0.0
---

# Post-Edit Quality: Shared Checker Router

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy for post-edit quality. `post-edit-router.cjs` maps an edited file to a checker by path and priority. It then spawns that checker under a shared deadline.

The table covers comment hygiene, flowcharts, frontmatter versions, spec placeholders and opt-in wikilinks. A separate `runDistStalenessCheck()` keeps the dist coverage outside the table, because it runs on every file.

The router writes no stdout or stderr and never throws. It returns at most one checker per edit, so an overlapping path resolves to exactly one row.

Claude, Codex, Devin, Cursor, Pi, OpenCode, DSH and Vibe all run it. Claude registers the adapter in `.claude/settings.json` on `PostToolUse`. Codex uses `.codex/hooks.json` and Devin uses `.devin/hooks.v1.json`. Cursor runs `post-tool-use.mjs` on `postToolUse` in `.cursor/hooks.json`, and that proxy shells out to the Claude adapter. Pi loads `.pi/extensions/post-edit-quality.ts`, a one-line re-export. OpenCode loads `.opencode/plugins/sk-code-post-edit-quality.js` by a flat glob. DSH links `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`. Vibe registers `post-edit-quality` in `.vibe/hooks.toml`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-router.cjs` | The dispatch table, the deadline-bounded runner and the dist-staleness entrypoint. |

`resolveDispatch()` is a side-effect-free resolver. It reads only whether the hub copy of a checker exists. Rows run in priority order, so an overlapping path resolves to one checker.

`runChecks()` spawns each resolved checker with `spawnSync` under a shared deadline. Findings are capped at 2000 characters each and 20 per run. Secret-shaped values are redacted before any text is printed.

`runDistStalenessCheck()` is the separate dist-staleness entrypoint. It returns null on a missing checker, a spawn error, an exhausted budget or empty stdout.

The module also exports the budget constants and `createDedupeTracker()`. The tracker gives the OpenCode plugin per-skill suppression for one session.

The router fails open. A missing checker becomes one `quality-notice` finding, so an unchecked edit never reads as a clean one. An unexpected exit, a spawn error or an exhausted deadline yields no finding.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/post-edit-router.test.cjs
```

Expected result: the router suite passes, with `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the full dispatch table and the per-runtime matrix.
- [`../../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`](../../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh): the first checker in the table.
- [`../tests/post-edit-router.test.cjs`](../tests/post-edit-router.test.cjs): the suite for this core.
