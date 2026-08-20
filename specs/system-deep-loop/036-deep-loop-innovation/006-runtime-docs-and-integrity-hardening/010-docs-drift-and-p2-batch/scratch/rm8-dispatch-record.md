# RM-8 Dispatch Record — T014 shared strict-validator re-adoption

- **L1 (prompt rails):** brief carried literal `BANNED OPERATIONS` + `ALLOWED WRITE PATHS`
  (two files only: `deep-review-rollback-gate/mode-gate.ts`, `deep-research-rollback-gate/mode-gate.ts`);
  test edits explicitly banned.
- **L2 (isolation):** `--dir` = `.worktrees/015-036-mode-gate-strict-validator`
  (branch `worktrees/015-036-mode-gate-strict-validator`, allocated by `sk-git/scripts/worktree-naming.sh`).
- **L3 (recovery baseline):** worktree base commit `11d87179e5a568fa3fe34fa4f58c2d732e8c2a5d`.
  Main checkout carries unrelated sibling-lane dirt (048→049 rename, 039/040 deletions, sk-vision edits)
  left untouched per scope lock; the worktree is cut from the commit, so that dirt is outside the blast radius.
- **L4 (record):** this file. Executor `opencode-go/deepseek-v4-flash --variant max`,
  env `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`, stdin `</dev/null`, no `--agent`. Captured PID 915.

## Red-before negative control (reproduced by the orchestrator, not the executor)
Naive whole-predicate filter→reject adoption of `validateRows` in the review gate:
3 failures / 81 pass of 84 — see `t014-red-before.txt`.
Root cause: the review predicate conflated structural validity with authentication membership and
success selection, so legal `incomplete` / `abstained` / unauthenticated rows hard-rejected the
evidence set instead of being excluded from the count.
