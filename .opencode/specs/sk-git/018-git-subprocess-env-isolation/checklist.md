---
title: "Checklist: git test/tool subprocess env isolation"
description: "QA verification for the GIT_* env-scrub hardening across the three write-capable git test/tool helpers."
trigger_phrases:
  - "git env isolation checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/018-git-subprocess-env-isolation"
    last_updated_at: "2026-07-29T06:03:51Z"
    last_updated_by: "claude"
    recent_action: "All QA items verified with evidence"
    next_safe_action: "Commit on skilled/v4"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "git-env-isolation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: git test/tool subprocess env isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is checked only with evidence (a command run, a file:line, or a test count). Security items are mandatory for this packet because the failure mode is repository-config corruption.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] The three target files were read in full before editing (`Read` on `git-rule-checks.test.mjs`, `rename_tooling_fixture_core.py`, `worktree-naming.test.sh`).
- [x] CHK-002 [P1] The poisoned-env leak reproduced against the current helper (sandbox: unscrubbed `git -C tempdir config` under `GIT_DIR`/`GIT_WORK_TREE` wrote into the stand-in repo).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] The scrub removes only repository/config/object-store redirectors; benign vars preserved (denylist = `GIT_ENV_REDIRECTORS` / `_GIT_ENV_REDIRECTORS`; `GIT_AUTHOR_DATE`/`GIT_COMMITTER_DATE`/`PATH` are not in it).
- [x] CHK-004 [P0] Each git spawn in the three helpers routes through the scrub; no unscrubbed spawn remains (`git()` env, `_run_git` both branches, shell `unset` before all git incl. the trap).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] `node --test git-rule-checks.test.mjs` passes 24/24, including the new poisoned-env regression case.
- [x] CHK-006 [P0] `bash worktree-naming.test.sh` passes 47/47.
- [x] CHK-007 [P1] The sk-doc rename fixture harness has 2 pre-existing failures (deleted `.gitkeep`, not-mine), proven independent by running the HEAD core (identical 2/2). Python fix verified via the direct poisoned-env check (CHK-008) instead.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-008 [P0] Direct poisoned-env invocation of each hardened helper leaves a stand-in repo unchanged (JS regression test; Python `_run_git` check; shell suite under poison — all PASS, stand-in identity/bare/hooksPath intact).
- [x] CHK-009 [P0] No remaining helper in scope inherits `GIT_DIR`/`GIT_WORK_TREE`/`GIT_CONFIG*` into a config-writing git subprocess (every spawn routes through `cleanGitEnv()`, `_scrub_git_env()`, or the shell `unset`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P0] The corruption vector (identity/bare/hooksPath leak into shared worktree config) is closed for all three helpers — the poisoned-env checks left `user.email`, `user.name`, and `core.bare` on the stand-in repo unchanged (3/3).
- [x] CHK-011 [P1] No new secret, token, or absolute host path is introduced into the scrubbed env or committed files (additions are the static `GIT_*` var-name denylists only).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-012 [P1] `implementation-summary.md` records what changed (What Was Built), the verification evidence (Verification table), and the deferred `git-context.mjs` note (Known Limitations #2).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-013 [P1] Changes are confined to the three in-scope files; no adjacent cleanup (`git status` shows only the 3 helpers plus this packet's docs).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Suites**: git-rule-checks 24/24, worktree-naming 47/47, rename fixture 2 pre-existing fails (proven independent).
- **Poisoned-env checks**: 3/3 helpers leave the stand-in repo untouched.
- **Packet validation**: `validate.sh --strict` Errors 0.
<!-- /ANCHOR:summary -->
