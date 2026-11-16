---
title: "Git Preflight (DSH): Post-Execute Advisory"
description: "DSH's link into the shared advisory adapter, which appends up to three sk-git rule warnings to an accepted bash result without blocking or denying the call."
trigger_phrases:
  - "dsh git preflight advisory"
  - "repo-guards post execute"
  - "sk-git advisory context"
version: 1.0.0.0
---

# Git Preflight (DSH): Post-Execute Advisory

---

## 1. OVERVIEW

`git-preflight/dsh/` holds the DSH adapter for the git preflight advisory. `git-preflight-advisory.mjs` is a relative symlink to `../../../skills/sk-git/scripts/hooks/dsh/git-preflight-advisory.mjs`. The `repo-guards` bundle imports `registerGitPreflightAdvisory` from that real file and calls it with the plugin context.

The handler runs on `tools/post-execute` for `bash`, and only after `next()` returns a result with `kind` equal to `accept`. A DSH session can run outside the checkout, so the adapter reads the hard rules from its own location, at `.skilled/skills/sk-git/SKILL.md`, rather than from the session cwd. It gates on `GIT_SHAPE`, keeps rules whose check exists in `GIT_CHECKS` and builds a lazy context with `createGitContext`. A non-empty finding list becomes one user notice appended to `additionalContexts`.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-preflight-advisory.mjs` | `tools/post-execute` for `bash` | Is a link to the real DSH adapter. It honors `isHookEnabled('git-preflight')`, `SKGIT_ADVISORY` and `SKGIT_ADVISORY_SKIP`, caps the text at three findings and never changes the tool result kind. | Exports `ERROR_POLICY` as `fail-open`. Logs `repo-guards git-preflight-advisory: ...` and returns the downstream result unchanged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the suppression tiers and the 17 rule ids.
- [`../../../skills/sk-git/scripts/hooks/dsh/git-preflight-advisory.mjs`](../../../skills/sk-git/scripts/hooks/dsh/git-preflight-advisory.mjs): the real adapter this link points at.
- [`../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`](../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs): the shared stdin hook and its rule engine.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers the adapter.
