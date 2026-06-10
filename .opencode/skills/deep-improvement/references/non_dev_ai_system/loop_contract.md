---
title: "Lane D Loop Contract"
description: "Formal contract for the packaging-owned _loop/loop.py host: required files, argv surface, env knobs, journal events, kill-switches, lock and resume semantics, the CW_ROOT override, and how loop-host and the adapter invoke it."
trigger_phrases:
  - "loop contract"
  - "_loop/loop.py"
  - "lane d loop host"
  - "guarded refine loop argv"
importance_tier: important
contextType: reference
---

# Lane D Loop Contract

The formal contract that every Lane-D-ready packaging must implement. The loop host lives with the packaging under test, not in deep-improvement, so it can evolve without touching the skill.

---

## 1. REQUIRED FILES

A packaging opts in by implementing three components under its root:

| File | Role |
|---|---|
| `<packaging-root>/_loop/loop.py` | The guarded loop host. Pre-flight gates, N-sample benchmark, independent re-grade, gap analysis, worktree propose, guarded promote-N, convergence and kill-switch logic. |
| `<packaging-root>/_gates/gates.py` | Frozen scoring surface. `freeze` snapshots the rubric, floors and hard-blocker rules. `check` exits 1 on drift. |
| `<packaging-root>/_gates/derive.py` | Source-of-truth to derived-copy regeneration. `derive` regenerates copies. `check` exits 1 on drift. |

## 2. ARGV SURFACE

`loop.py` accepts two modes:

- `--dry-run` (default) -- exercises gates, grader-family guard and gap analysis on existing grades. Zero dispatches, zero edits, zero promotion.
- `--run` -- the real autonomous loop (dispatches models, may promote into a worktree branch). Optional `--max-iters N` caps the iteration count (default 5).

The skill-side adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) maps the loop-host flags onto this surface. It decides `--dry-run` vs `--run` based on whether `--live` was passed to loop-host, then spawns `python3 _loop/loop.py` with the chosen argv and env.

## 3. ENV KNOBS

| Env var | Purpose | Default |
|---|---|---|
| `LOOP_FIXTURES` | Comma-separated visible optimization fixture IDs | config `fixtures.visible` |
| `LOOP_VARIANTS` | Comma-separated benchmark variants to run | config `fixtures.variants` |
| `LOOP_HELD_OUT` | Comma-separated held-out promotion-gate fixture IDs | config `fixtures.held_out` |
| `LOOP_SAMPLES` | Number of samples per (variant, fixture) pair | 3 |
| `PROPOSER_MODEL` | Proposer model identifier | config `models.proposer` |
| `GRADER_MODEL` | Grader model identifier (must differ from proposer family) | config `models.grader` |
| `LOOP_ACCEPT_MARGIN` | Required held-out improvement beyond non-regression | 0 |
| `LOOP_SKIP_PROBE` | Set to 1 to skip the T11 provider auth probes (tests/CI only) | unset |
| `LOOP_POLISH` | When 1, targets the lowest-margin dimension when all floors pass | off (decline-when-clean) |
| `LOOP_LOCK_TTL` | Seconds before a loop lock is considered stale | 7200 |
| `LOOP_SKIP_PROBE` | When 1, skips auth pre-flight probes | off |

## 4. JOURNAL EVENTS

Every per-sample grade is journaled to `_loop/state/loop-journal.jsonl` as an append-only JSONL file. Events include:

- `session_start` -- records proposer, grader, fixtures, held-out, config hash and HEAD sha
- `benchmark` -- one run-tagged benchmark dispatch (variant, fixture, run, rc, output path)
- `regrade` -- blind re-grade result (grader model, rc, count)
- `grade` -- per-sample grade record keyed by (phase, iter, variant, fixture, run) with config hash and HEAD sha for resume guarding
- `sample` -- aggregated N-sample result for a phase
- `iteration` -- per-iteration independent score and phantom gap
- `heldout_baseline` -- pre-edit held-out measurement
- `propose` -- proposer dispatch result (doc, rc)
- `promote_accept` or `promote_reject` -- promotion outcome with reason
- `promotion` -- per-iteration promotion summary
- `session_end` -- final stop reason
- `lock_evicted` -- stale lock removal
- `session_orphaned` -- detected killed run
- `resume` -- cached grade count from prior orphaned session
- `worktree_swept` -- removed leaked worktree
- `worktree_kept` -- accepted promotion worktree
- `provider_probe` -- auth pre-flight result (T11)
- `grade_cached` -- resume cache hit (grade reused from prior run)

## 5. CANONICAL STOP REASONS

Stop reasons map onto the deep-improvement journal taxonomy:

| Reason | Canonical | When |
|---|---|---|
| `converged` | `converged` | Independent score plateaued at or above target, phantom gap stable |
| `maxIterationsReached` | `maxIterationsReached` | Iteration ceiling hit |
| `noTarget` | `converged` | No actionable gap found (decline-when-clean) |
| `killSwitch` | `blockedStop` | Any kill-switch triggered |
| `visibleUnmeasurable` | `error` | Visible sampling produced no gradeable output |
| `promote_skip` | (event) | Promotion phase skipped: unmeasurable baseline or proposer dispatch failure, distinct from a quality rejection |
| `stuckRecovery` | `stuckRecovery` | Below target and plateaued with no gap shrinkage |
| `manualStop` | `manualStop` | Operator interruption |
| `error` | `error` | Unhandled exception |

## 6. KILL-SWITCHES

Each of these halts the loop without promoting:

- Scoring-surface drift (`gates.py check` exits non-zero)
- Derived-copy drift (`derive.py check` exits non-zero)
- Grader-family violation (grader model contains the proposer family substring)
- Hard-blocker lint failure on graded output (HVR violation)
- New floor breach on held-out (candidate introduced a regression)
- Held-out regression or improvement below `LOOP_ACCEPT_MARGIN`
- Iteration ceiling reached
- Concurrent-run lock (single writer, with stale locks from dead runs evicted after TTL)

## 7. LOCK AND RESUME SEMANTICS

The loop uses a single-writer lock at `_loop/state/loop.lock`. A second concurrent run is refused. Stale locks (dead pid or TTL exceeded) are evicted with a journal entry.

Resume from a killed run works by:
1. Reading the journal to find orphaned `session_start` entries (no matching `session_end`).
2. Sweeping leaked worktrees from killed runs (never touching kept promotion worktrees).
3. Building a resume cache of per-sample grades from the orphaned session, guarded by config hash and packaging HEAD sha. Only `visible` and `baseline` phase grades are cached. Candidate-phase grades are never reused (they depend on a proposer edit that died with its worktree).

## 8. THE CW_ROOT OVERRIDE

All paths honor the `CW_ROOT` environment variable (configurable via `packaging_root_env` in the packaging config). When set, it overrides the default `packaging_root` value. The dry-run must be exercised from a git worktree to confirm it reads only worktree files.

## 9. HOW LOOP-HOST AND THE ADAPTER INVOKE IT

`scripts/shared/loop-host.cjs` resolves `--mode=non-dev-ai-system-refine`, validates against `VALID_MODES`, and plans a single adapter step pointing at `run-non-dev-ai-system.cjs`. The adapter:
1. Resolves `--packaging-root` and confirms `_loop/loop.py` exists (exit 2 otherwise).
2. Maps recognized flags to the `ENV_FORWARD` table (`LOOP_FIXTURES`, `LOOP_VARIANTS`, `LOOP_HELD_OUT`, `LOOP_SAMPLES`, `PROPOSER_MODEL`, `GRADER_MODEL`).
3. Decides `--dry-run` (default) or `--run` (when `--live` is passed).
4. Spawns `python3 _loop/loop.py` with the chosen argv and env.

Loop logic stays packaging-owned so it can evolve without touching deep-improvement.

---

## Related Resources

- [operator_guide.md](./operator_guide.md) -- invocation, guardrails, conformance checklist, pilot notes
- [guardrails_teachings.md](./guardrails_teachings.md) -- the twelve pilot teachings and their guardrail encodings
- [fixture_authoring.md](./fixture_authoring.md) -- how to author visible, held-out and gold fixtures
- [grader_calibration.md](./grader_calibration.md) -- the calibration protocol for independent graders
