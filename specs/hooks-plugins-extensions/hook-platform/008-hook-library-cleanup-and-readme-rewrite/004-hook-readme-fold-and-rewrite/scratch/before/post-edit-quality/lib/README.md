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

`lib/` holds the runtime-neutral policy for post-edit quality. `post-edit-router.cjs` maps an edited file to a checker by path and priority, then spawns that checker under a shared deadline. The table covers comment hygiene, flowcharts, frontmatter versions, spec placeholders and opt-in wikilinks. A separate `runDistStalenessCheck()` keeps the legacy dist coverage outside the table because it runs on every file. The router writes no stdout or stderr and never throws.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-edit-router.cjs`](./post-edit-router.cjs) | Shared core | Exports `resolveDispatch()`, `runChecks()`, `runDistStalenessCheck()` and the budget constants. Findings are capped at 2000 characters each and 20 per run, and secret-shaped values are redacted. | Fails open. A missing checker becomes one `quality-notice` finding, while an unexpected exit, a spawn error or an exhausted deadline yields no finding. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the full dispatch table and the per-runtime matrix.
- [`../../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`](../../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh): the first checker in the table.
- [`../tests/post-edit-router.test.cjs`](../tests/post-edit-router.test.cjs): the suite for this core.
