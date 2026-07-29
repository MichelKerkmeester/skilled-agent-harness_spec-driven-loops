---
title: "Post-Edit Quality: Warn-Only Checker Router"
description: "Path-dispatch router that runs comment-hygiene, dist-staleness and related checkers after every Write/Edit, shared by Claude, Devin, Codex and the OpenCode plugin."
trigger_phrases:
  - "post edit quality"
  - "comment hygiene hook"
  - "dist staleness hook"
---

# Post-Edit Quality: Warn-Only Checker Router

---

## 1. OVERVIEW

`post-edit-quality/` runs quality checkers against a file right after it is written or edited and surfaces bounded, redacted findings back to the model. One path-dispatch table in `lib/post-edit-router.cjs` decides which checker(s) apply to which file, shared by every runtime adapter so policy cannot drift between them.

Warn-only by contract: every failure path (missing checker, unexpected exit code, spawn error, exhausted deadline) resolves to no finding, and the edit itself is never blocked.

---

## 2. WHAT IT DOES AND INJECTS

Fires after every `Write`/`Edit` (Claude), `apply_patch`/`edit` (Codex), or equivalent, and prints bounded findings. The comment-hygiene checker's finding is verbatim:

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

And the dist-staleness branch prints `STALE DIST WARNING: <package> -- run: <rebuild command>` when a watched package's compiled output is older than its newest source.

**Visibility caveat (real, verified):** the Claude adapter emits these on exit-0 stdout, which Claude Code shows in the transcript/verbose view only — it does **not** reach the model's context in normal use. Codex/Devin adapters wrap the same text in their runtime's `additionalContext` envelope, where it is model-visible (`[SYS]`). Nothing here ever blocks the edit. See `injection-contract.md` — Post-Edit Quality entry.

---

## 3. DIRECTORY TREE

```text
post-edit-quality/
+-- lib/
|   `-- post-edit-router.cjs      # dispatch table + deadline-bounded checker runner
+-- claude/   claude-posttooluse.cjs
+-- devin/    post-edit-quality.cjs
+-- codex/    post-edit-quality.cjs
+-- pi/       post-edit-quality.ts (symlinked from .pi/extensions/)
`-- opencode/ mk-post-edit-quality.js (browsability symlink -> ../../../plugins/; real file loaded from .opencode/plugins/)
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `lib/post-edit-router.cjs` | `resolveDispatch()` is a pure path/string resolver mapping an edited file to its applicable checkers; `runChecks()` spawns the resolved checkers under a shared deadline and returns bounded, redacted findings. |
| `claude/claude-posttooluse.cjs` | Claude PostToolUse (`Write|Edit`) adapter. Emits findings as plain stdout (transcript-visible). |
| `devin/post-edit-quality.cjs` | Devin PostToolUse adapter, same router. |
| `codex/post-edit-quality.cjs` | Codex PostToolUse (`apply_patch|edit`) adapter. Extracts every `*** Add/Update/Delete File:` target from a multi-file patch so each file gets checked. |

The checker scripts themselves (comment hygiene, dist staleness, flowchart, frontmatter, placeholders, wikilinks) stay in their owning skills — the router invokes them by project-root-relative path via `spawnSync`, never a static import. OpenCode reaches the router through `.opencode/plugins/mk-post-edit-quality.js` — OpenCode discovers plugins only from `.opencode/plugins/`, so that file stays there and the `opencode/` folder here holds a browsability-only symlink back into it (nothing loads through the symlink). Pi's adapter lives in `pi/` here (symlinked from `.pi/extensions/post-edit-quality.ts`, the reverse direction — Pi loads through its symlink); Cursor's Write events proxy through `system-spec-kit`'s cursor `post-tool-use.mjs` to the Claude adapter.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The router imports Node builtins only; checker scripts are spawned by path, never imported. Adapters import `../lib/` only. |
| Decisions | Findings are advisory text. Nothing here can block or roll back an edit. |
| Failure | Every checker failure mode resolves to silence, bounded by a shared deadline. |

---

## 6. VALIDATION

```bash
node --test .opencode/plugins/tests/mk-post-edit-quality.test.cjs
```

Expected result: all tests pass (covers the router and the Claude/Codex adapters, including multi-file patch coverage).

---

## 7. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../../skills/system-spec-kit/references/hooks/injection-contract.md`](../../skills/system-spec-kit/references/hooks/injection-contract.md): finding visibility per runtime.
- [`../../skills/sk-code/code-quality/SKILL.md`](../../skills/sk-code/code-quality/SKILL.md): the comment-hygiene standard the primary checker enforces.
