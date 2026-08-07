# Tasks: Fix Doctor Bootstrap Symlink Restart Loop

> **Spec:** `./spec.md` | **Plan:** `./plan.md` | **Date:** 2026-06-08

---

- [x] **T1** — Confirm singular-path dependency audit (launchers + MCP configs use plural only)
- [x] **T2** — Remove redundant symlink-creation branch (branch 3) in `doctor-runtime-bootstrap.sh`
- [x] **T3** — Drop `ln -s` + `restart_required=true` from legacy migration branches 1-2; keep `mv`
- [x] **T4** — Update `--help` usage text
- [x] **T5** — Sync identical edit to the Public mirror copy
- [x] **T6** — Remove stale `.opencode/skill` symlink from the working tree
- [x] **T7** — Verify: `bash -n` both copies pass
- [x] **T8** — Verify: both copies byte-identical (`diff`)
- [x] **T9** — Verify: live bootstrap run reports `restart_required:false`, `actions:[]`, no symlink recreated
- [x] **T10** — Verify: single remaining `restart_required=true` is the dist-build branch
