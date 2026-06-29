# Deep-Review Report — Loop-Systems Implementation Run (156/002) + /goal Plugin

**Verdict:** CONDITIONAL → the implementation is broadly sound (baseline 527/527 unit tests green), and a 20-iteration adversarial review surfaced **57 unique findings (1 P0, 35 P1, 21 P2)**, concentrated in concurrency/crash-safety, fail-policy consistency, and fan-out isolation. None block normal single-writer operation. **Eight clusters are now FIXED with regression tests** (the P0 + ~20 P1; deep-loop-runtime suite 527→545 + plugin export-contract/regressions + reducer regression, all green). The remaining findings (deep-improvement promote/rollback safety, model-benchmark ledger row, the P2 test-adequacy gaps, and the design-inherent fan-out `workspace-write` scope) are real but lower-blast and tracked below as scoped follow-ups.

## Fixes landed this pass (verified green, committed)

| Cluster | Findings closed | Tests added | Commit |
|---|---|---|---|
| **loop-lock** | P0:505 (TOCTOU split-brain) + :168/:370 (corrupt-lock wedge) | +7 (loop-lock.vitest) | `116e6fc` |
| **atomic-state** | :254 (invalid-JSON), :370 (unhandled rejection), :324 (concurrent append) | (in the +7) | `116e6fc` |
| **JSONL** | round-state-jsonl :66/:290, jsonl-repair :188/:140 | +4 (suite →538) | `a5e4f91` |
| **mk-goal** | :681 (terminal revival), :1199 (injection clamp), :1138 (continuation lock leak) | export-contract + 3 regressions | `a5e4f91` |
| **post-dispatch-validate** | :596 (stale line fails valid iter), :364 (judge timer leak), :235/:1173 (validator↔template contract) | +regressions | `b8fe22a` |
| **coverage-graph-query** | :462 (wrong edge direction), :669 (query/scoring divergence), :664 (metadata redaction) | +regressions | `b8fe22a` |
| **fanout-run** | :1116 (exit-0/no-artifact false fulfilled), :737 (subprocess-tree kill), :1049/:866 (path traversal) | +regressions | `9660e2d` |
| **reduce-state** | :654 (findings dropped when delta lacks per-finding rows) | +regression | `9660e2d` |

Each fix shipped a regression test confirmed RED before the fix (executable proof the defect was real). Full deep-loop-runtime suite: **545/545 green, typecheck clean**; all 6 plugin test files green; deep-review reducer round-trips the 20-iter packet (57 findings, 0 corruption); mk-goal.js remains default-export-only.

> Note: the `reduce-state.cjs` fix is a larger diff (+264/−114) because the rollup path was restructured to add the summary-fallback; verified by its regression test + a live round-trip of the real packet.

## Method

- **Loop:** deep-review (auto), 20 iterations, executor **cli-codex gpt-5.5 reasoning=xhigh service-tier=fast**, packet at `156-agent-loops-improved/review/`.
- **Scope:** the run's change-set (git `2aa5fcff4a..HEAD`) — `mk-goal.js` + `deep-loop-runtime/lib` + `deep-loop-runtime/scripts` + `deep-loop-workflows/deep-improvement/scripts`, reviewed as an integrated system across 7 sub-angles mapped to the 4 canonical dimensions (correctness, security, traceability, maintainability) × 6 file slices.
- **Baseline:** `deep-loop-runtime` vitest — **60 files / 527 tests, all passing** (pre-review).
- **Confirmation discipline:** finding = hypothesis. The P0 and the loop-lock / atomic-state clusters were confirmed by direct code reading (file:line below). Each fix must ship a regression test that fails before / passes after — executable confirmation.

## Findings by severity

> `Status` legend: **FIXED** (fix + regression test landed) · **FIXING** (confirmed, fix in progress) · **FOLLOW-UP** (real, tracked, deferred this pass) · **DESIGN** (reviewer flag is intended behavior / inherent constraint — rationale noted).

### P0 (1)

| File:Line | Finding | Conf | Status |
|---|---|---|---|
| `loop-lock.ts:505` | Lock refresh can overwrite a newly reclaimed holder (TOCTOU split-brain: read-check-then-unconditional-rename in `refreshLoopLock`) | high | **FIXING** |

### P1 (35) — see `monitor/all-findings.json` for full claim/evidence per finding

**loop-lock.ts (concurrency primitive)** — **FIXING**
- `:168` / `:370` Corrupt lock files are unreclaimable and misreport the contender as holder (readLoopLock→null short-circuits the stale-reclaim path; `wx` create then fails EEXIST).

**atomic-state.ts (state persistence)** — **FIXING**
- `:254` `writeStateAtomic` writes literal `"undefined"` for non-representable top-level state (bypasses the `serializeState` non-string guard).
- `:370` Deferred-writer timer does `void drainPendingWrites()` → unhandled promise rejection on write failure.
- `:324` Diff-gated JSONL append is read-whole-file + rewrite-via-rename → concurrent appends clobber each other.

**mk-goal.js (/goal plugin)** — **FIXING (subset)** / **FOLLOW-UP**
- `:681` (×2) `setGoal` on the same objective revives a terminal/over-budget goal to `active`, carrying `tokensUsed`/budget — FIXING.
- `:1199` Injection clamping can strip the directive + closing marker (truncates mid-block) — FIXING.
- `:1138` Continuation reservation failure leaves the session id locked in the in-memory in-flight set — FIXING.
- `:1381` Rejected-prompt event clears the autonomous-continuation blocker (med) — FOLLOW-UP.
- `:760` Usage dedupe only remembers the immediately previous messageID (interleaved/retried events double-count, med) — FOLLOW-UP.
- `:79` `stateDir` override can escape the goal-state root (test-only opt `opts.stateDir`, med) — FOLLOW-UP.

**round-state-jsonl.cjs / jsonl-repair.ts (JSONL integrity)** — **FIXING**
- `round-state-jsonl.cjs:66` Append corrupts a valid final JSONL line when it lacks a trailing newline.
- `round-state-jsonl.cjs:290` Read-side JSONL repair ignores the writer lock (med).
- `jsonl-repair.ts:188` Locked JSONL merge can overwrite unlocked appends (med).

**post-dispatch-validate.ts (review-infra contract)** — **FOLLOW-UP**
- `:1173` Review iteration template omits a field the validator requires; `:235` review prompt can produce JSONL the validator rejects; `:596` an older malformed JSONL line fails a valid new iteration; `:364` immediate judge rejection leaves the fast-timeout timer alive (real timer leak).

**coverage-graph-query.ts** — **FOLLOW-UP**
- `:462` Review FILE coverage gaps use the wrong edge direction; `:664` graph metadata re-emitted without redaction; `:669` claim-verification query disagrees with convergence scoring.

**fanout-run.cjs (fan-out isolation/security)** — **FOLLOW-UP / DESIGN**
- `:1018` subprocesses get repo-wide write (DESIGN: inherent to `codex --sandbox workspace-write`; mitigation = worktree isolation, noted); `:1038` same-kind replicas share CLI homes/lockfiles; `:1116` exit-zero salvage misses reported as fulfilled (real, high); `:737` timeout/stop paths don't reliably kill lineage subprocesses (real, high); `:1049`/`:866` configDir/baseArtifactDir traversal (med).

**deep-improvement scripts** — **FOLLOW-UP**
- `promote-candidate.cjs:92` workflow promotion defaults to immediate canonical mutation; `:541` pre-mutation mirror-sync blocks legitimate promotion; `rollback-candidate.cjs:120` rollback ignores the stored accepted-state hash.

**reduce-state.cjs:654** Reducer can drop findings when a delta lacks per-finding rows — **FOLLOW-UP** (review-infra robustness).

**deep_model-benchmark_auto.yaml:165** Benchmark runs write reports without the reducer ledger row — **FOLLOW-UP**.

### P2 (21) — FOLLOW-UP

Test-adequacy gaps (the review's own dimension confirming it): `mk-goal-state.test.cjs` (no automated default-export-only guard `:16`; tool-level fail-closed paths unpinned `:22`; injection presence-only not adversarial `:71`), `mk-goal-continuation.test.cjs` (fail-closed gates uncovered `:51`, budget-exhaustion uncovered `:116`), `atomic-state.vitest.ts:155` / `jsonl-repair.vitest.ts:152` (concurrent tests are actually sequential). Plus: `goal.md` router contract conflicts (`:26`,`:30`), `mk-goal.js:1270` invalid actions silently fall back to show, `coverage-graph-query.ts:249` short-alias fuzzy match, `jsonl-repair.ts:140` merge omits fsync before rename, `fanout-salvage.cjs:109` salvage writes same stdout to every missing iteration, `d5-connectivity.cjs:207` hub registry reads wrong schema location.

## Triage summary

- **Fixed/fixing this pass (high-severity correctness + data-integrity):** loop-lock (P0 + corrupt-lock), atomic-state (invalid-JSON guard, unhandled-rejection, concurrent-append), JSONL integrity (round-state newline, repair lock), mk-goal (terminal-state revival, injection clamp, continuation-lock leak).
- **Deferred follow-ups (tracked here):** review-infra contracts (post-dispatch-validate, reduce-state, coverage-graph-query), fan-out isolation hardening, deep-improvement promotion/rollback safety, the P2 test-adequacy gaps. These are real but lower-blast and warrant their own scoped packet rather than widening this pass.
- **Design/inherent:** `fanout-run.cjs:1018` repo-wide write is inherent to the chosen codex sandbox; the durable mitigation is per-lineage worktree isolation (already supported), documented rather than re-engineered here.

## Provenance

Per-iteration narratives in `iterations/`, structured deltas in `deltas/`, canonical state in `deep-review-state.jsonl`, full finding records (claim / evidenceRefs / counterevidenceSought / confidence) in `monitor/all-findings.json`.
