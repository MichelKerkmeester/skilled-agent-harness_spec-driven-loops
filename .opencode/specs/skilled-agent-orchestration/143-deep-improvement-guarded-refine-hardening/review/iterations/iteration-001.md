# Iteration 001 — Inventory + Correctness (First Deep Pass)

## Dimension

inventory + correctness

## Files Reviewed

1. `scripts/shared/loop-host.cjs` — Mode-switching entry point (4 lanes)
2. `scripts/shared/model-family.cjs` — Anti-Goodhart T1/T3 grader independence
3. `scripts/shared/rubric-guard.cjs` — Anti-Goodhart T2 rubric mutation guard
4. `scripts/shared/extract-deliverable.cjs` — T5 output-contract extraction
5. `scripts/shared/fixture-lint.cjs` — T6 gradeable-fixture classification
6. `scripts/shared/promote-candidate.cjs` — Guarded canonical promotion helper
7. `scripts/model-benchmark/run-benchmark.cjs` — Fixture + integration scoring
8. `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` — Lane D adapter
9. `Barter/Copywriter/_loop/loop.py` — Copywriter guarded-refine loop
10. `Barter/Copywriter/_loop/gauntlet.py` — Red-team attack battery
11. `Barter/Copywriter/_gates/gates.py` — Frozen scoring surface enforcement
12. `Barter/Copywriter/_gates/derive.py` — 3-copy derivation check
13. `Barter/Copywriter/benchmark/grader/regrade.py` — Independent blind re-grader
14. `Barter/Copywriter/benchmark/grader/calibrate.py` — Inter-grader calibration
15. `Barter/Copywriter/benchmark/grader/hvr_lint.py` — HVR hard-blocker linter
16. `Barter/Copywriter/benchmark/run.sh` — One-dispatch benchmark runner
17. `Barter/Barter deals/_loop/loop.py` — Deals guarded-refine loop
18. `Barter/Barter deals/_gates/gates.py` — Deals frozen scoring surface
19. `Barter/Barter deals/benchmark/grader/regrade.py` — Deals independent re-grader

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001: Barter deals `make_worktree()` returns wrong child path

**[SOURCE: Barter deals/_loop/loop.py:591-597]**

`make_worktree(i)` returns `os.path.join(base, "Copywriter")` — a hardcoded `Copywriter/` child path. This is correct for the Copywriter packaging (which lives at `.../Barter/Copywriter/`), but the Barter deals packaging lives at `.../Barter/Barter deals/`. The returned path `{worktree}/Copywriter` does not exist in a deals worktree.

Downstream callers `guarded_promote()`, `measure()`, and `benchmark_one()` all use this path as `root` to locate `_gates/gates.py`, `_gates/derive.py`, and `benchmark/run.sh`. Since those files live at the worktree root (not under a `Copywriter/` subdir), every path resolution fails.

The Copywriter loop's `make_worktree()` at line 592-597 is correct for its packaging. The deals loop is a copy-paste that was not adapted.

**Impact:** The `--run` mode of the deals loop cannot create valid worktrees. All worktree-based operations (guarded_promote, propose, benchmark in worktree) fail. The `--dry-run` path is unaffected (it never calls `make_worktree`).

**Claim:** `make_worktree` returns `{base}/Copywriter` but deals packaging root is `{base}/Barter deals`.  
**Evidence:** `loop.py:596` returns `os.path.join(base, "Copywriter")`; packaging is at `Barter/Barter deals/`.  
**Counterevidence sought:** None found — the function is structurally identical to Copywriter's.  
**Alternative explanation:** None — this is a copy-paste adaptation gap.  
**Final severity:** P1 (functional break in --run mode, not --dry-run)  
**Confidence:** 0.95  
**Downgrade trigger:** Would downgrade to P2 if the deals loop is never run in --run mode (dry-run only).

---

#### R1-P1-002: `readScoreDelta()` returns nested or top-level delta inconsistently

**[SOURCE: scripts/shared/promote-candidate.cjs:70-75]**

`readScoreDelta(score)` checks `score.delta` as an object first (returns `score.delta.total`), then falls back to `score.delta` as a primitive. The Lane A score file from `score-candidate.cjs` has historically used `score.delta` as a primitive number. The object branch (`score.delta.total`) is for a newer shape. If a score file has `delta: { total: 5, ... }`, the function returns `5`. If it has `delta: 3`, it returns `3`. If `delta` is `null` or missing, it returns `null`.

The issue: the threshold check at line 295 uses `Number(scoreDelta || 0) < threshold`. When `scoreDelta` is `null`, `Number(null || 0)` is `0`. If the threshold is explicitly `0` (line 178: `Number(config?.scoring?.thresholdDelta ?? 1)`), then `0 < 0` is `false`, so promotion proceeds. This is correct behavior. However, the function's dual-shape handling is fragile — if a future score file has `delta: { total: null }`, it returns `null` (the `?.` optional chain), and the fallback to `score.delta` (the object) would produce `NaN` in the `Number()` call.

**Impact:** Low in current usage (Lane A always produces numeric delta). Fragile for future Lane B score shapes.  
**Severity:** P2 (code clarity, not a current bug).

---

### P2

#### R1-P2-001: Barter deals `gates.py` docstring says "Copywriter"

**[SOURCE: Barter deals/_gates/gates.py:1]**

Docstring reads `"Frozen scoring surface for the Copywriter auto-refine loop"` — should say "Barter deals". Copy-paste artifact from the Copywriter gates.py.

#### R1-P2-002: `loop-host.cjs` comment references "Lane C" for non-dev-ai-system-refine

**[SOURCE: scripts/shared/loop-host.cjs:273]**

Comment says "Lane C shape" but the mode is `non-dev-ai-system-refine` which is Lane D. Lane C is `skill-benchmark`.

#### R1-P2-003: `acquire_lock()` TOCTOU race window (both loops)

**[SOURCE: Copywriter/_loop/loop.py:109-129, Barter deals/_loop/loop.py:108-128]**

Between reading the stale lock file (line 117-121) and removing it (line 126), another process could create a fresh lock. The `O_CREAT|O_EXCL` retry loop mitigates this (max 3 attempts), but the race window exists. The deep-loop-runtime loop-lock contract this mirrors uses the same pattern, so this is a known-acceptable tradeoff.

#### R1-P2-004: `run-benchmark.cjs` phantom-gap regex compiles user-authored pattern without full ReDoS guard

**[SOURCE: scripts/model-benchmark/run-benchmark.cjs:550]**

`self_score_pattern` from the profile is compiled with `new RegExp(source.slice(0, MAX_PATTERN_LENGTH), 'i')`. The length guard (512 chars) limits but does not eliminate catastrophic backtracking risk. A crafted 500-char pattern with nested quantifiers could still trigger exponential backtracking on long input. The `MAX_MATCH_INPUT_LENGTH` guard (200K) bounds the tested string, providing a second layer of defense.

#### R1-P2-005: `analyze_gap()` polish path uses `min(margins, key=margins.get)` lambda

**[SOURCE: Copywriter/_loop/loop.py:343, Barter deals/_loop/loop.py:342]**

`min(margins, key=margins.get)` works but is less readable than `min(margins, key=lambda k: margins[k])`. Both are functionally identical.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | PASS | All scripts reference spec 143 teachings (T1/T2/T3/T4/T5/T6/T11) in comments and docstrings |
| checklist_evidence | PENDING | No checklist.md found in the review packet; deferred to next iteration |

## Verdict

Review verdict: CONDITIONAL

P1 findings present (R1-P1-001 worktree path bug, R1-P1-002 fragile delta handling). No P0 findings. P2 advisories recorded.

## Next Dimension

correctness (deepening: lock contracts, convergence logic, benchmark scoring edge cases)
