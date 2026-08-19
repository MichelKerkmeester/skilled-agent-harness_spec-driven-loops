# RM-8 Dispatch Record — T015 torn-tail marker-before-move ordering

- **L1 (prompt rails):** brief carried literal `BANNED OPERATIONS` + `ALLOWED WRITE PATHS`
  (`lib/authorized-ledger/immutable-frame-store.ts` plus ONE added test in
  `tests/unit/authorized-ledger.vitest.ts`); weakening or rewriting existing tests explicitly banned.
- **L2 (isolation):** `--dir` = `.worktrees/016-036-torn-tail-marker-ordering`
  (branch `worktrees/016-036-torn-tail-marker-ordering`, allocated by `sk-git/scripts/worktree-naming.sh`).
- **L3 (recovery baseline):** worktree base commit `409e2346c0a78b4e2f1af458ccd47de642ade35d`.
  A concurrent operator session advanced `skilled/v4.0.0.0` from `11d87179e5` to this commit mid-session;
  the sibling lanes it carries are untouched here.
- **L4 (record):** this file. Executor `cline-pass/cline-pass/deepseek-v4-flash --variant xhigh`
  (primary `opencode-go` is quota-exhausted: `Monthly usage limit reached. Resets in 19 days`, and it
  hangs at 0% CPU rather than exiting). Env `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`,
  stdin `</dev/null`, no `--agent`. Captured PID 68086.

## Design authority
ADR-010 in `decision-record.md`. The packet's own `t001-disposition.md` grades `F-002-01` as
NEEDS-DESIGN and explicitly NOT a durability breach (byte-preserving atomic rename, no data loss);
the ordering is therefore audit-trail hardening, elected by the operator, not a defect fix.
