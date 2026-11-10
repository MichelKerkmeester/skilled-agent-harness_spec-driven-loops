---
title: "Tasks: Fix Doctor Bootstrap Symlink Restart Loop"
description: "Verification checklist for the doctor bootstrap symlink fix: dependency audit, branch removal, mirror sync, and live bootstrap checks."
trigger_phrases:
  - "doctor bootstrap task list"
  - "symlink branch removal checklist"
  - "doctor runtime bootstrap verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Fix Doctor Bootstrap Symlink Restart Loop

> **Spec:** `./spec.md` | **Plan:** `./plan.md` | **Date:** 2026-06-08

---

<!-- ANCHOR:phase-1 -->
- [x] **T1** — Confirm singular-path dependency audit (launchers + MCP configs use plural only)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
- [x] **T2** — Remove redundant symlink-creation branch (branch 3) in `doctor-runtime-bootstrap.sh`
- [x] **T3** — Drop `ln -s` + `restart_required=true` from legacy migration branches 1-2; keep `mv`
- [x] **T4** — Update `--help` usage text
- [x] **T5** — Sync identical edit to the Public mirror copy
- [x] **T6** — Remove stale `.opencode/skill` symlink from the working tree
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
- [x] **T7** — Verify: `bash -n` both copies pass
- [x] **T8** — Verify: both copies byte-identical (`diff`)
- [x] **T9** — Verify: live bootstrap run reports `restart_required:false`, `actions:[]`, no symlink recreated
- [x] **T10** — Verify: single remaining `restart_required=true` is the dist-build branch
<!-- /ANCHOR:phase-3 -->
