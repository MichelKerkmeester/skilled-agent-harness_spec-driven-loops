---
title: "Post-Edit Quality: Test Suite"
description: "node --test suites for the shared router, the DSH adapter, and the Codex and Devin PostToolUse adapters."
trigger_phrases:
  - "post edit quality tests"
  - "checker dispatch tests"
  - "post edit adapter tests"
version: 1.0.0.0
---

# Post-Edit Quality: Test Suite

---

## 1. OVERVIEW

`tests/` holds the automated checks for the post-edit quality concern. Each file drives one adapter or the shared router against a throwaway project tree, so checker dispatch and project-root resolution never touch this repository. Run the whole set with `node --test .skilled/hooks/post-edit-quality/tests/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-edit-router.test.cjs`](./post-edit-router.test.cjs) | Router suite | Covers checker resolution beside the router's real path, the built-in extension set, the missing-checker notice and the hostile partial-install case. | Not applicable, the suite asserts behavior. |
| [`dsh-post-edit-quality.test.mjs`](./dsh-post-edit-quality.test.mjs) | DSH adapter suite | Asserts shared-core parity for an ordinary file result and the fail-open throw policy with one log line. | Not applicable, the suite asserts behavior. |
| [`codex-post-edit-quality.test.cjs`](./codex-post-edit-quality.test.cjs) | Codex adapter suite | Spawns the adapter against a fixture project and covers the `edit` positive control, the `read` negative control and the three path aliases. | Not applicable, the suite asserts behavior. |
| [`devin-post-edit-quality.test.cjs`](./devin-post-edit-quality.test.cjs) | Devin adapter suite | Spawns the adapter against a fixture project and pins `write` plus `edit` as edit events, with `read` as the negative control. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the router the suites exercise.
- [`../dsh/post-edit-quality.mjs`](../dsh/post-edit-quality.mjs): the DSH adapter under test.
