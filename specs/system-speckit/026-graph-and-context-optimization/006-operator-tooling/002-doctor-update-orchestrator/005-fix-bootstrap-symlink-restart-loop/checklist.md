# Checklist: Fix Doctor Bootstrap Symlink Restart Loop

> **Spec:** `./spec.md` | **Date:** 2026-06-08

---

## P0 — Correctness

- [x] Bootstrap completes with `restart_required:false` on the live v3.4 layout (R1)
      — evidence: live `--json` run returned `restart_required:false`, `actions:[]`
- [x] No `.opencode/skill` compatibility symlink created by the bootstrap (R2)
      — evidence: `ls .opencode/skill` → "No such file or directory" after run
- [x] Fresh-install restart preserved — dist-build branch still sets `restart_required=true` (R3)
      — evidence: `grep` shows the single remaining occurrence on the build branch
- [x] Both repo copies byte-identical (R4) — evidence: `diff` reports no differences

## P1 — Quality

- [x] `bash -n` syntax check passes on both copies
- [x] `--help` text updated to match new behavior
- [x] Code comment states the durable WHY (redundant symlink shim must not gate a restart)
- [x] No ADR/REQ/CHK ids or spec paths embedded in code comments (hygiene gate)

## P2 — Hygiene

- [x] Stale working-tree `.opencode/skill` symlink removed
- [x] No database state mutated by this change
- [ ] Git commit/push — deferred to operator (assistant git policy is read-only)
