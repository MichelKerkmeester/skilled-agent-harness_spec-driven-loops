# Phase 001: Lane D Loop Hardening

**Parent:** 143-deep-improvement-guarded-refine-hardening | **Status:** Implemented | **Teachings:** T2 T4 T6 T7 T8 T9 T12

## Goal

Take the packaging-side loop host (`<packaging-root>/_loop/loop.py`, pilot at `Barter/Copywriter/_loop/loop.py`) from "live-validated prototype" to production grade: resumable, session-kill-safe, portable, observable, with the promotion-accept path proven by a controlled live firing.

## Work items

1. **Prove promotion-accept live (T12).** Synthetic-deficit run: in a throwaway worktree branch, deliberately weaken one technique doc (e.g. strip the Standards effectiveness guidance), run the loop against that root with N=3, and verify the full chain fires for real: averaged floor deficit → propose → guarded promote → held-out non-regression → **accept** (worktree branch kept). Then red-team the inverse: a candidate that touches the frozen surface and one that regresses held-out must reject/halt. This is the canonical Lane D acceptance test; script it as a repeatable fixture, not a one-off.
2. **Resumable, lock-guarded state (T9).** Adopt `deep-loop-runtime` primitives (or mirror their contracts in python): single-writer loop lock with TTL (a second `--run` on the same root refuses), atomic state writes, and resume-from-journal so a session-killed run continues at the last completed sample instead of restarting. Journal `session_start` must detect and mark orphaned prior sessions.
3. **Stop-reason taxonomy alignment.** Map loop.py's `session_end.reason` values onto deep-improvement's journal taxonomy (`converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`) so Lane D runs reduce into the same dashboards as lanes A-C.
4. **Per-dimension targeting upgrade (T4).** `regrade.py` now emits per-dimension scores; make `analyze_gap` consume averaged dims directly (the notes-text fallback stays as fallback). Add an optional lowest-margin "polish" mode for when no floor fails (current behavior: noTarget stop — keep that as the default; polish is opt-in via flag).
5. **Measurement-gap semantics audit (T6, T7).** Unit-test the n=0 / None paths end to end (baseline unmeasurable → skip; candidate unmeasurable → reject, never a kill-switch). Guarantee `finally`-cleanup on every exit path including SIGTERM (T8/T9: trap-based worktree cleanup).
6. **Portability.** Remove hardcoded `/Users/...` roots from `loop.py`, `gates.py`, `derive.py`, `regrade.py`, `run.sh` (derive from script location or accept `--root`); per teaching from packet 138-portable-cross-machine. The `_loop/loop.py` contract doc in the operator guide gains a "contract conformance" checklist a new packaging can self-verify against.

## Acceptance

- Synthetic-deficit run produces a journaled live `promote_accept` and a kept worktree branch; red-team fixtures produce `KillSwitch`/reject.
- Kill -9 of a mid-iteration run, then re-invoke: resumes (or cleanly restarts) without leaked worktrees or corrupted state; lock prevents concurrent runs.
- All paths relative/configurable; loop runs from a cloned location unchanged.
- Existing dispatch-free validations still pass; loop-host vitest suite stays green.

## Status (2026-06-09)

Implemented + validated. promote_accept live-proven (synthetic deficit); lock/resume/taxonomy/margin landed; gauntlet 10/10; CW_ROOT portability; LOOP_POLISH lowest-margin mode; staleness guard covers symlinked globals (gauntlet-found bug, fixed). Evidence: t12-synthetic-deficit-evidence.md.
