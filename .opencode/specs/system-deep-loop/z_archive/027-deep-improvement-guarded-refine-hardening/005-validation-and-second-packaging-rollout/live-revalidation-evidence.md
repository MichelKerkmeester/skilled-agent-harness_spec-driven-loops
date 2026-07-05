# Phase 005 Evidence: Live Re-Validation Through the Full Lane D Stack

## Run 1: Copywriter, full stack (2026-06-09 21:40-22:03)

**Invocation:** `loop-host.cjs --mode=packaging-benchmark-refine --packaging-root <Copywriter> --live --max-iters 1 --fixtures T1-write --variants project --held-out T7-stat --samples 3` — the command surface end to end (loop-host → adapter → hardened packaging loop), with every Phase 001-004 addition active.

**Chain (journal):**
- T11 provider probes fired live before the batch (proposer + grader, both ok) — first live validation of the auth pre-flight.
- Visible sampling: project/T1 x3 → averaged independent **20.0** (phantom gap +3.5); E-floor deficit on average → target Standards.
- Held-out baseline: project/T7-stat x3 → **14.33**, floors failing (real product signal: the project variant is consistently weak on the stat fixture — indep 13/16/14, M/E/T/D floors missed; same pattern as every prior T7 measurement).
- Propose: deepseek edited Standards in the isolated worktree (remove/correct/add prompt active).
- Guarded promote: frozen-surface gate PASS, derive PASS, candidate held-out x3 = 16/14/13 — **sample 3 carried a genuine HVR hard-blocker in its deliverable** → all-samples HVR rule → **KillSwitch HALT (`blockedStop`), nothing promoted**.
- Teardown: worktree cleaned (finally), main knowledge base untouched, lock released, canonical stop reason journaled.

**Verdict:** the guarded loop did exactly what the council specified — it refused to promote a candidate whose held-out output violated a hard rule, halted, and left no residue. Combined with the Phase 001 synthetic-deficit run (live `promote_accept`), both promotion outcomes (accept and blocked) are now live-proven. Documented outcome per the phase acceptance ("…or documented convergence with all gates green" — here: documented guarded halt with all gates green).

**Follow-up finding shipped immediately:** the journal recorded `hvr_lint_clean: false` but not WHICH violation — undiagnosable after worktree cleanup. `regrade.py` (both packagings) now records `hvr_violations` types per sample.

**Product signal for the Copywriter team (outside this spec):** project-variant T7-stat persistently fails M/E/T floors at baseline (~13-16/25 independent) — the stat-heavy fixture exposes a real weakness in the compact-CI packaging, and self-reports for those same outputs ran 21-23/25.

## Run 2: Barter deals, second packaging (same day)

Completed 22:05-22:20: probes ok, visible D1-deal-write x3 -> averaged independent **23.67/25**, phantom gap **+0.67** -> no floor deficit -> **decline-when-clean** (noTarget, canonical converged), clean teardown, kb untouched. The guarded outcome on a healthy packaging is zero doc churn — exactly as designed. Cross-packaging finding: the deals DEAL self-scoring is nearly calibrated (+0.67 gap) versus the Copywriter's +3.5 to +6 MEQT inflation, so self-score trustworthiness varies sharply BY SYSTEM and must be measured per packaging, never assumed. Onboarding facts: contract scaffolding ported with ZERO deep-improvement code changes (frozen DEAL surface: HVR + System Prompt §3 + DEPTH §4; floors D≥3 E≥4 A≥3 L≥3, maxes 6/7/6/6; empty derived set — single packaging; own harness + grader + 2 fixtures). Conformance checklist green; red-team gauntlet 10/10 dispatch-free. Friction found during onboarding (for the contract template): ported reset paths in the gauntlet needed packaging-relative prefixes; the packaging's staged-but-uncommitted doc bumps had to be committed before HEAD-worktrees carried the frozen-surface targets.
