---
title: "Verification Checklist: Phase 1 source-baseline"
description: "Evidence checklist for the clean working copy of the pinned upstream source."
trigger_phrases:
  - "source-baseline checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline"
    last_updated_at: "2026-08-16T12:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Verified source-baseline copy: 16 files byte-identical, reference unchanged"
    next_safe_action: "Hand off to 002-identity-config-compat"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 1 source-baseline

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-101 [P0] Each command run is recorded with its exit code and relevant output. — copy, `diff -rq`, `cmp`, and before/after `git status` results recorded in `implementation-summary.md` Verification table.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-102 [P1] The working package location is decided and recorded (outside `context/`). — `packages/pi-fast-mode-w-subagent-support/` (root has no npm workspaces, so no auto-pickup; outside `context/`).
- [x] CHK-103 [P1] The source inventory (files to copy vs reference-only) is listed before copying. — 16-file copy list in `plan.md` §4 / `tasks.md` T102; `package-lock.json` intentionally reference-only.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:copy-correctness -->
## Copy Correctness

- [x] CHK-104 [P0] Every listed `src/*` and `tests/*` file plus `package.json`, `tsconfig.json`, `README.md`, `LICENSE`, and `.gitignore` is present in the working package. — `find … -type f` = 16 files; all 6 `src/` + 4 `tests/` + 6 root files present.
- [x] CHK-105 [P1] Entry points resolve against the copied files. — `src/index.ts` and `package.json` present in the working package.
- [x] CHK-106 [P0] No source logic was edited during the copy. — `diff -rq src/`, `diff -rq tests/`, and `cmp` on the 6 root files all silent (byte-identical to source).
<!-- /ANCHOR:copy-correctness -->

<!-- ANCHOR:exclusions -->
## Exclusions

- [x] CHK-107 [P0] `.git`, `node_modules`, and local build/install artifacts are absent from the working copy. — leaked-artifacts count = 0 (`package-lock.json`, `.git`, `node_modules` all excluded).
<!-- /ANCHOR:exclusions -->

<!-- ANCHOR:reference-integrity -->
## Reference Integrity

- [x] CHK-108 [P0] `context/pi-openai-fast-mode/` is unchanged, proven by a clean `git diff` / `git status` on that path. — `git status --short` on the reference = 0 lines BEFORE and AFTER the copy.
<!-- /ANCHOR:reference-integrity -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-109 [P1] The working package lives outside `context/` and no stray files were added elsewhere. — package at `packages/pi-fast-mode-w-subagent-support/`; new tree confined to that path plus this leaf's docs.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:rollback -->
## Rollback

- [x] CHK-110 [P1] The exact delete-and-recopy rollback command is recorded. — `rm -rf packages/pi-fast-mode-w-subagent-support` then re-copy the 16-file inventory, per `plan.md` §7.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-111 [P0] Handoff criteria to `002-identity-config-compat` are met and evidence is recorded in this checklist. — working package exists, reference unchanged, inventory + rollback recorded.
<!-- /ANCHOR:summary -->
