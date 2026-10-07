---
title: "Tasks — Mass-Deletion Guard"
description: "Executor-ready task list for the shared deletion-guard lib, the commit and push hook wiring, the tracked test, and the spec-folder validation pass."
trigger_phrases:
  - "mass deletion guard tasks"
  - "deletion guard task list"
  - "commit hook guard tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks — Mass-Deletion Guard

<!-- ANCHOR:phase-1 -->
- [x] **T1** Author `lib/mass-deletion-guard.sh` (count/verdict/report helpers),
  hardened fail-open for `set -euo pipefail`.
- [x] **T2** Wire the staged-deletion gate into `pre-commit` after `REPO_ROOT`.
- [x] **T3** Wire the push backstop (Gate 0) into `pre-push`: capture `local_sha`,
  compute range deletions, run before the release-branch skip.
- [x] **T4** Author tracked test `tests/mass-deletion-guard.test.sh`
  (verdict-logic + real-commit integration).
- [x] **T5** `bash -n` all three touched hook files; run the test suite.
- [x] **T6** Confirm the effective `core.hooksPath` `pre-commit` resolves to the
  edited source, so the commit gate fires on the real repo.
- [x] **T7** Document the `pre-push`-unwired constraint (machine `core.hooksPath`
  omits `pre-push`; wiring it would activate dormant naming/permission gates).
- [x] **T8** Spec-folder docs + metadata; `validate.sh --strict`.
<!-- /ANCHOR:phase-1 -->
