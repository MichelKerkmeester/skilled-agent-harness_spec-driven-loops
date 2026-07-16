# Implementation Plan: Fix Doctor Bootstrap Symlink Restart Loop

> **Spec:** `./spec.md` | **Level:** 1 | **Date:** 2026-06-08

---

## Approach

Edit `doctor-runtime-bootstrap.sh` to stop creating the `.opencode/skill -> skills`
compatibility symlink and to stop forcing a restart on layout-only changes, while preserving
the genuine legacy-directory migration and the legitimate post-build restart.

## Files Touched

| File | Repo | Change |
| --- | --- | --- |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | `ai-speckit` (versioned surface) | Remove symlink branch 3; drop `ln -s` + `restart_required` from migration branches 1-2; update `--help` text |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | Public mirror | Identical edit (sync) |

## Steps

1. Verify nothing depends on the singular `.opencode/skill/` path (launchers, MCP configs).
2. Remove branch 3 (the `! -e` symlink-creation branch).
3. In migration branches 1-2: keep `mv`, remove `ln -s skills ...` and `restart_required=true`,
   reword `record_action` messages.
4. Update `--help` text from "Creates the legacy bridge" to "Migrates a legacy directory".
5. Apply the identical edit to the Public mirror; confirm both copies are byte-identical.
6. Remove the stale `.opencode/skill` symlink left in the working tree.

## Verification Plan

- `bash -n` on both copies (syntax).
- `diff` both copies (sync invariant R4).
- Run the bootstrap `--json` against the live layout → expect `restart_required:false`,
  `actions:[]`, and no `.opencode/skill` created (R1, R2).
- `grep` confirms a single remaining `restart_required=true` on the dist-build branch (R3).

## Risk / Rollback

Low risk: layout-only branches, dead-code on a v3.4 install. Rollback = `git checkout` the
script in each repo. No database state is touched by this change.
