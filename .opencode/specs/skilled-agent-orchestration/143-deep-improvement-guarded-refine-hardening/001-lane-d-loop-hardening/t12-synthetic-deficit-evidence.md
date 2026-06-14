# T12 Evidence: First Live promote_accept (Synthetic-Deficit Run)

**Date:** 2026-06-09 20:38-20:53 | **Run:** synthetic-deficit worktree (detached commit `3e5187b`), 16 dispatches total
**Proposer:** deepseek/deepseek-v4-pro | **Grader:** xiaomi/mimo-v2-pro | **N=3 sampling**

## Fixture

Injected an actively harmful "Restraint Rule" into the Standards technique doc (CLI source, derived to both copies, committed in an isolated worktree): *no numbers, statistics, proof points, pricing or calls to action in any deliverable*. Standards is exactly the doc the loop's gap analysis targets for the E (effectiveness) dimension, so a competent proposer edit to that doc is also the plausible cure. The frozen scoring surface was untouched (gates pass — Standards is a technique doc, by design).

## Chain (from the loop journal)

| Step | Result |
|---|---|
| Visible sampling (project/T1 x3, with deficit) | averaged independent **18.67** (phantom gap +3.67) → E-floor deficit detected |
| Gap analysis | dimension **E** → target `Standards - v0.114.md` (the injected doc) |
| Held-out baseline (project/T7-stat x3, sub-worktree, with deficit) | **12.33**, floors failing — T7 is stat-centric, so the no-stats rule crushed it (accidentally ideal held-out sensitivity) |
| Propose (deepseek, sub-worktree) | edited Standards: added 2 validation-checklist technique items (variation distinctness, tone delivery) |
| Guarded promote | frozen-surface gate PASS, derive regeneration PASS, candidate held-out **14.00** vs baseline 12.33, no new floor breach, HVR clean |
| Decision | **`promote_accept`** → sub-worktree branch kept → `promotion: true` |
| Hygiene | main repo knowledge base untouched; journal complete; session_end `maxIterationsReached` (max-iters 1) |

## What this proves

The promotion-accept path — the one segment never live-fired during the pilot — works end to end with real dispatches: deficit detection on averaged grades, technique-only targeting, isolated proposal, all promotion gates, held-out baseline-vs-candidate comparison, accept, and worktree retention.

## Findings for the phase backlog

1. **Proposer prompt biases toward ADDING guidance.** The injected harmful rule was the obvious root cause, but the proposer added new checklist items instead of removing/correcting the bad rule (the propose() instruction literally says "add a concrete requirement or checklist item"). Fix: the proposal prompt must offer remove/correct/add as co-equal moves and ask the proposer to look for guidance that *causes* the measured deficit. (Phase 001 work item; also feeds the Phase 003 decline-when-clean/targeting work.)
2. **+1.67 held-out improvement is within plausible noise at N=3.** The accept threshold is non-regression, so the accept is valid, but a confidence margin (accept only if improvement > noise band, e.g. pooled std) would make accepts more meaningful. (Phase 001, convergence/targeting upgrade.)
3. **Held-out fixture sensitivity matters.** T7-stat was maximally sensitive to this deficit (stats forbidden → stat fixture collapses). The Phase 004 held-out convention should prefer fixtures sensitive to the dimensions being optimized.

## Phase 001 hardening landed (same day)

Lock + resume + taxonomy + margin shipped and validated dispatch-free: single-writer lock with stale eviction, orphan detection + stale-worktree sweep, per-sample grade journaling with a config-hash/HEAD-sha-guarded resume cache (candidate grades never reused), canonical stop reasons, `LOOP_ACCEPT_MARGIN`, per-pair `sample_scores`/`std`. The red-team gauntlet (`_loop/gauntlet.py`, 10 attacks, zero dispatches) runs **10/10** — and on its first run it found a real bug: the dirty-tree staleness guard's pathspec missed **symlinked shared-global docs** (their content lives outside `Copywriter/`), so uncommitted global-doc edits would never have blocked a run. Fixed by resolving symlink targets into the pathspec set. Operational consequence worth knowing: a live `--run` now correctly refuses while shared-global docs (e.g. the operator's in-flight EUR→€ edits to `z — Global (Shared)/`) are uncommitted.
