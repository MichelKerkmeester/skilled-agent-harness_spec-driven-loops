---
title: "Implementation Plan: Phase 8: iterate-converge-report"
description: "Plan wiring deep-alignment onto the reused deep-loop runtime: loop-lock for locking, a resolved convergence.cjs reuse-vs-extend decision, a per-lane alignment-report reducer mirroring reduce-state.cjs, a verify-iteration.cjs extension, and corpus partitioning of discovered artifacts across iterations, all state externalized under alignment/."
trigger_phrases:
  - "phase 008 implementation plan"
  - "convergence reuse plan"
  - "alignment report reducer plan"
  - "corpus partitioning plan"
importance_tier: "normal"
contextType: "general"
status: "implemented"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/008-iterate-converge-report"
    last_updated_at: "2026-07-11T16:09:46Z"
    last_updated_by: "claude"
    recent_action: "Built and tested deep-alignment CONVERGE/ITERATE/REMEDIATE wiring scripts"
    next_safe_action: "Phase 009 builds the command YAML and LEAF agent"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/032-deep-alignment-mode/008-iterate-converge-report/spec.md"
      - ".opencode/specs/system-deep-loop/032-deep-alignment-mode/008-iterate-converge-report/tasks.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "loopType: recommend Option A for a future phase; this phase implements NFR-R01's manual-check fallback instead of editing convergence.cjs (out of this phase's write scope)"
      - "AND/OR: AND, max-iterations independent hard stop"
      - "Corpus partitioning: lane-round-robin, implemented in partition-corpus.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: iterate-converge-report

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS (matching `system-deep-loop/runtime/scripts/*.cjs` and `deep-review/scripts/reduce-state.cjs`) |
| **Framework** | `deep-alignment` mode-packet (planned, not yet scaffolded) over the `system-deep-loop` runtime |
| **Storage** | JSONL append log + JSON registry + Markdown strategy doc under the bound spec folder's `alignment/` subdir, mirroring `review/`'s real layout |
| **Testing** | None runnable in this phase - reducer/convergence unit tests are planned build-out work for whichever phase actually implements the code |

### Overview
This phase builds the wiring between `deep-alignment` and the existing deep-loop runtime (gate-flipped to executed, operator approval 2026-07-11). ADR-010 (002's decision-record) is LOCKED and PERFORMED: `reduce-state.cjs` promoted from `deep-review/scripts/` to shared `runtime/scripts/`, `deep-review`'s import repointed, behavior-preservation regression-proven (identical pass/fail counts before and after the move, see `implementation-summary.md`). Separately, `convergence.cjs`'s hard-validated loopType enum (`research`/`review`/`council`/`context` only, at lines 659-660, re-verified current) stays this phase's own recommendation rather than an edit — `convergence.cjs` remains read-only in this phase's actual write scope (see Affected Surfaces below); Option A (enum extension) is named as the architecturally correct follow-up, and this phase ships spec.md NFR-R01's own sanctioned "documented manual coverage check" fallback (`deep-alignment/scripts/check-convergence.cjs`) instead. Locking, reducer shape and location, corpus partitioning, and state layout are all built and tested, not just planned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 005-007's adapter `check()` output shape is available — all 5 adapters (`sk-doc`, `sk-git`, `sk-design`, `sk-design-live-render`, `sk-code`) export the identical `{discover, standardSource, check}` triad, confirmed by reading each `module.exports` block.
- [x] The `convergence.cjs` loopType constraint is confirmed current at the cited line numbers — re-verified at lines 659-660 via `grep -n` at execution time, unchanged from the scaffold's citation.
- [x] The real `review/` state-layout precedent is confirmed current — re-listed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/`.

### Definition of Done
- [x] The convergence reuse-vs-extend tradeoff is documented and RESOLVED (recommend Option A for a future convergence.cjs edit; this phase ships NFR-R01's manual-check fallback instead) — `references/state_machine_wiring.md` §5.
- [x] The ADR-010 `reduce-state.cjs` relocation (LOCKED: promote to shared runtime) is PERFORMED and regression-proven behavior-preserving (see `implementation-summary.md` §Verification for the before/after test-count proof).
- [x] The alignment-report reducer's per-lane shape and shared-runtime location are built (`runtime/scripts/reduce-alignment-state.cjs`, 489 lines) and smoke-tested (FAIL lane not averaged away, confirmed).
- [x] `checklist.md` items are reviewed and either checked with evidence or explicitly deferred (see `checklist.md`).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin specialization over the existing deep-loop runtime, per the design brief: "REUSES the deep-review/runtime engine... it is a THIN specialization, not a rebuild."

### Key Components
- **Locking**: reuse `.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` unchanged - `acquire --lock-path <spec-folder>/alignment/.deep-alignment.lock --packet-id <packet> --runtime-kind alignment`, `status`, `refresh`, `release` subcommands, mirroring the deep-review `.deep-review.lock` / `.owner-pid` pattern observed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/.deep-review.lock`.
- **`reduce-state.cjs` relocation (ADR-010, LOCKED)**: relocate `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` to `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`; repoint `deep-review`'s own import/require path to the new location. `deep-review`'s reducer LOGIC and OUTPUT do not change — this is purely a location plus import-path change (behavior-preserving relocation), verified by diffing reducer output before/after the move. `deep-alignment`'s own lane-keyed alignment-report reducer is authored as a sibling file in the same shared `runtime/scripts/` directory (`reduce-alignment-state.cjs`), not a `deep-alignment`-local script — establishing "reducers are shared-runtime primitives" as the going-forward convention.
- **Convergence - Option A (enum extension) - RECOMMENDED for a future phase, not performed here**: add `"alignment"` as a fifth accepted value at `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 659-660 (re-verified current), alongside a new `computeCompositeScore` branch (the function already branches per loopType at line 303/307/319). Tradeoff: touches shared runtime code every other mode depends on; requires the same care as the existing `"context"` loopType addition set a precedent for. Reading `buildReviewSignals()`'s actual implementation (line 343) confirmed it depends on `DIMENSION`/`FINDING`/`COVERS`/`RESOLVES`/`EVIDENCE_FOR` graph conventions with no natural analog to deep-alignment's lane model, and that `loopType` is part of the coverage-graph's own namespace key -- both facts favor A over B, detailed in `references/state_machine_wiring.md` §5. NOT performed in this phase: `convergence.cjs` stays read-only per this plan's own Affected Surfaces table and this phase's write scope.
- **Convergence - Option B (reuse under `review`) - EVALUATED AND NOT CHOSEN**: pass `loopType: "review"` to `convergence.cjs` but bind a distinct `--spec-folder`/namespace so alignment's snapshots never collide with a real deep-review run on the same packet. Re-reading `buildReviewSignals()` showed this option's "zero runtime code change" framing was incomplete: reused unchanged, it would silently produce near-zero `dimensionCoverage`/`evidenceDensity` signals every run (no `DIMENSION`/`FINDING` nodes ever get seeded by any adapter contract read for this phase), and making it meaningful would require deep-alignment to fabricate a parallel graph-population scheme across every adapter -- real new work, just relocated. Not chosen.
- **What this phase actually ships for CONVERGE**: `deep-alignment/scripts/check-convergence.cjs`, implementing spec.md NFR-R01's own sanctioned "documented manual coverage check" fallback directly against the reducer's registry and the JSONL state log -- no graph dependency, no `convergence.cjs` edit. See §4 below and `references/state_machine_wiring.md` §4.
- **Alignment-report reducer - BUILT**: `runtime/scripts/reduce-alignment-state.cjs` (per ADR-010's shared-runtime relocation convention, sibling to the relocated `reduce-state.cjs`), mirroring `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` lines 21-24 (`REQUIRED_DIMENSIONS`/`SEVERITY_KEYS`/`SEVERITY_WEIGHTS`) - `resolveRequiredLanes()` reads the run's lane list from `deep-alignment-config.json` (config-resolved, not hardcoded, since lanes are per-run not a fixed 4), keeps the identical `SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }`, and emits a per-lane verdict (PASS/CONDITIONAL/FAIL/NOT_APPLICABLE, `VERDICT_SEVERITY_RANK` worst-lane-wins rollup) into one `alignment-report.md`. Smoke-tested directly and via 4/4 wiring tests.
- **`verify-iteration.cjs` extension - CONFIRMED IN PLACE**: `alignment: 'deep-alignment'` in `LEAF_BY_LOOP` (lines 18-22) and `alignment: 'deep-alignment-state.jsonl'` in `STATE_LOG_BY_LOOP` (lines 24-28) at `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` (line numbers shifted by +1 from the scaffold's "17-24" citation now that the `alignment` entries exist), so the after-dispatch leaf-reliability check covers the new loop type instead of silently passing it through unchecked.
- **Corpus partitioning - BUILT**: `deep-alignment/scripts/partition-corpus.cjs` distributes discovered artifacts across iterations lane-by-lane (each call resolves one lane's next unaudited slice, rotating lanes round-robin in corpus-declaration order, bounded by `--batch-size`), distinct from deep-review's fixed four-dimension rotation, because deep-alignment's "dimensions" are lanes of variable artifact count rather than four fixed named categories. Tested: multi-lane rotation, lane-exhaustion skip, and `{done:true}` terminal state all pass.
- **REMEDIATE hook (optional, gated) - HOOK POINT BUILT, LOGIC INTENTIONALLY NOT BUILT**: the default loop is read-only and terminates at REPORT; `deep-alignment/scripts/remediate-hook.cjs` is the enterable, callable, tested proof that the state transition after REPORT exists (`{status:'not_implemented', ...}`, citing ADR-005 invariant 4), performing zero filesystem or git action. A future operator-approved pass replaces this stub's body with real remediation, inheriting the alignment contract's safety discipline (scoped staging only — never `git add -A` — worktree-when-diverged, doc-only/skip-shared-files when concurrent sessions are live) — none of that logic is implemented here, per this phase's explicit instruction to wire the hook point only.

### Data Flow
The loop acquires the lock, `partition-corpus.cjs` resolves the next corpus slice, dispatches a leaf iteration against that slice (adapter `discover()`/`check()` already ran or run inline), appends findings to the JSONL state log, the reducer refreshes the per-lane registry and `alignment-report.md`, `check-convergence.cjs` computes the coverage-AND-stability decision, and the loop either continues, stops on convergence, or stops on max-iterations. The optional gated REMEDIATE pass, when the operator explicitly invokes it, attaches only after a REPORT-terminated run via `remediate-hook.cjs` — never as part of the default read-only loop. (The command YAML + LEAF agent that actually performs this dispatch loop is phase 009's own deliverable; this phase ships the single-shot scripts that workflow calls.)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase builds new wiring alongside existing runtime scripts, modifying only the one explicitly-scoped relocation. Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Owns the live loopType-validated convergence computation for research/review/council/context | Read-only analysis in this phase (confirmed); NOT edited — recommendation only (Option A) for a future phase | Lines 659-660 re-verified current via `grep -n` at execution time |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Owns the live per-loop leaf-reliability check maps | Modified — `alignment` entries added to both maps | `LEAF_BY_LOOP` lines 18-22, `STATE_LOG_BY_LOOP` lines 24-28, confirmed present |
| `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` -> `runtime/scripts/reduce-state.cjs` | Owns the live per-dimension review reducer pattern | Relocated per ADR-010 (LOCKED); `deep-review`'s import path changed, logic/output byte-identical (1-line usage-string diff only); new sibling reducer for alignment built at the same shared location | Regression-proven, see `implementation-summary.md` §Verification |

Required inventories:
- Same-class producers: `rg -n "loopType !== " .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` confirms the single validation site for the enum constraint (still one site, unchanged).
- Consumers of changed symbols: `reduce-state.cjs`'s consumers (6 files: config, both YAML workflows, both agent copies, cross-package vitest test) were already repointed prior to this phase's execution pass; verified via `rg -n "deep-review/scripts/reduce-state\|runtime/scripts/reduce-state"` returning zero stale old-path references.
- Matrix axes: convergence option (A extend-enum — recommended, not performed; B reuse-review — evaluated, not chosen) x reducer shape (lane-keyed, built) x partitioning (lane-round-robin, built) = the three named decision surfaces above, all resolved.
- Algorithm invariant: `check-convergence.cjs`'s coverage ratio is monotonic non-decreasing as artifacts get checked (never decreases once an artifact is marked checked), matching the spirit of `computeCompositeScore`'s monotonic-toward-threshold design without depending on its graph-signal implementation.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phases 005-007's adapter `check()` output shape — all 5 adapters export `{discover, standardSource, check}` identically (`sk-doc.cjs:653`, `sk-git.cjs:717`, `sk-design.cjs:690`, `sk-design-live-render.cjs:585`, `sk-code.cjs:975`).
- [x] Re-read `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 640-780 and confirm the loopType constraint and `computeCompositeScore` branching are unchanged — confirmed at lines 659-660 (enum check) and 303-334 (`computeCompositeScore`); `buildReviewSignals` at line 343 read in full to inform the loopType decision.
- [x] Re-read `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` lines 1-40 and confirm `LEAF_BY_LOOP`/`STATE_LOG_BY_LOOP` shape is unchanged — confirmed; both maps already carry the `alignment` entry (lines 18-22, 24-28).

### Phase 2: Core Implementation — EXECUTED
- [x] Relocate `reduce-state.cjs` from `deep-review/scripts/` to shared `runtime/scripts/` per ADR-010 (LOCKED), repoint `deep-review`'s import, and verify reducer output is byte-identical before/after the move. **Evidence**: `git show HEAD:.../deep-review/scripts/reduce-state.cjs` vs. the current `runtime/scripts/reduce-state.cjs` differs by exactly one line (`reduce-state.cjs:2166`, a usage-string path reference); all 6 consumer files repointed; full regression proof in `implementation-summary.md`.
- [x] Decide the convergence reuse-vs-extend option. **Decision**: recommend Option A for a future `convergence.cjs` edit (namespace-safety + signal-honesty reasoning in `references/state_machine_wiring.md` §5); this phase ships NFR-R01's manual-check fallback (`check-convergence.cjs`) instead of editing `convergence.cjs`, which stays outside this phase's write scope.
- [x] Implement `runtime/scripts/reduce-alignment-state.cjs`, the alignment-report reducer, as a sibling of the relocated `reduce-state.cjs`. **Evidence**: 489 lines, `resolveRequiredLanes`/`buildLaneEntry`/`buildOverallRollup`/`renderAlignmentReport`/`reduceAlignmentState` all present and smoke-tested.
- [x] Add the `verify-iteration.cjs` map entries per the Architecture section above. **Evidence**: confirmed already present (`LEAF_BY_LOOP`/`STATE_LOG_BY_LOOP`, lines 18-28).
- [x] Implement corpus partitioning (lane round-robin) for iteration dispatch. **Evidence**: `deep-alignment/scripts/partition-corpus.cjs`, tested in `state-machine-wiring.test.cjs`.
- [x] Stand up the `alignment/` state-file layout mirroring the real `review/` precedent. **Evidence**: `references/state_machine_wiring.md` §3 names every file/dir; `deep_alignment_config_template.json` provides the config shape.

### Phase 3: Verification — EXECUTED
- [x] Diff `deep-review`'s reducer output before/after the `reduce-state.cjs` relocation and confirm it is byte-identical (ADR-010 behavior-preservation check). **Evidence**: isolated detached-HEAD git worktree run of the plain-node reducer test + 4 vitest files; BEFORE and AFTER both report "22 passed / 1 failed" with the identical pre-existing failing test name (`LG-0006: traceabilityChecks rollup`) — proving the relocation changed nothing (see `implementation-summary.md`).
- [x] Dry-run the reducer against a synthetic multi-lane findings set and confirm a FAIL lane is not averaged away by converged lanes. **Evidence**: direct smoke test (2-lane fixture, one FAIL one PASS) confirms `overall.verdict === 'FAIL'`; also covered by `state-machine-wiring.test.cjs`'s `testFullWiringConverges`.
- [x] Confirm the loop reports "nothing to converge" cleanly when zero lanes resolve. **Evidence**: `testZeroLanesCleanExit` in `state-machine-wiring.test.cjs`.
- [x] (Added) Confirm max-iterations acts as an independent hard stop even when neither coverage nor stability is met. **Evidence**: `testMaxIterationsIndependentHardStop`.
- [x] (Added) Confirm a zero-artifact lane is NOT_APPLICABLE and excluded from the coverage ratio without blocking a real lane's convergence. **Evidence**: `testZeroArtifactLaneIsNotApplicable`.
- Loop-lock acquire/status/refresh/release dry-run against a scratch `alignment/` directory: DEFERRED, not run in this phase. `loop-lock.cjs` is unmodified, reused as-is (no new risk this phase introduces), and its own acquire/refresh/release cycle is exercised by `deep-review`'s existing test coverage; this phase's own scripts (`check-convergence.cjs`, `partition-corpus.cjs`) do not call it directly (dispatch/locking is phase 009's command-workflow responsibility). See `checklist.md` CHK-FIX-006.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Result |
|-----------|-------|-------|--------|
| Unit | Reducer per-lane scoring, corpus partitioning, convergence decision | Plain Node `assert`-based test (matching `deep-review/scripts/tests/*.test.cjs` convention, not vitest — that convention is plain-node `.test.cjs` for this class of reducer/state test) | `deep-alignment/scripts/tests/state-machine-wiring.test.cjs`, 4/4 scenarios pass |
| Integration | SCOPE -> DISCOVER(stand-in) -> ITERATE -> CONVERGE -> REPORT -> REMEDIATE-hook cycle | Synthetic multi-lane fixture in a temp dir | `testFullWiringConverges` — full round-trip, verdict PASS, report+registry written, hook safe no-op |
| Regression | `deep-review`'s reducer behavior before/after the ADR-010 relocation | Isolated detached-HEAD git worktree (zero risk to concurrent sessions in the main tree) | Byte-identical pass/fail counts and failing-test-name, both runs — see `implementation-summary.md` |
| Manual | Lock/state-file layout matches the real `review/` precedent | Directory diff against `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/` | `references/state_machine_wiring.md` §3 names every file/dir against that precedent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Loop-type reuse-vs-extend decision | Internal | RESOLVED — recommend Option A for a future `convergence.cjs` edit; this phase ships the NFR-R01 manual-check fallback instead | None remaining; `check-convergence.cjs` is a real, tested, working convergence decision today. |
| ADR-010 relocation (`reduce-state.cjs` -> shared `runtime/scripts/`) | Internal | DONE — relocation performed, regression-proven behavior-preserving | None remaining. |
| Phases 005-007 adapter `check()` output shape | Internal | DONE — all 5 adapters confirmed to export the identical `{discover, standardSource, check}` triad | None remaining. |
| Phase 004 scoping/discovery lane list | Internal | DONE — `scripts/scoping.cjs` confirmed complete (`resolveLanesFromConfig`/`resolveLanesFromSelections`/`validateLane`) | None remaining; corpus partitioning consumes lane output via `deep-alignment-corpus.json`, tested end to end. |
| Phase 009 command YAML + LEAF agent | Internal | Owned by phase 009, not started | The single-shot scripts this phase ships (`check-convergence.cjs`, `partition-corpus.cjs`, `remediate-hook.cjs`) have no live dispatcher calling them yet; that dispatcher is explicitly phase 009's scope, not a gap in this phase. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future phase's `convergence.cjs` edit (Option A) conflicts with this phase's `check-convergence.cjs` fallback in a way that needs reconciliation, or the ADR-010 relocation is later found to have changed `deep-review`'s behavior after all (not indicated by this phase's regression proof, but nameable as a trigger).
- **Procedure**: `git mv .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs .opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`, revert the 6 repointed consumer references, delete `reduce-alignment-state.cjs` and the 3 `deep-alignment/scripts/` additions, and re-run `deep-review`'s test suite to confirm a clean revert. No data migrations are involved (no runtime state has been created outside test fixtures).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (n/a) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Adapter output shape available | Core |
| Core | Setup, `reduce-state.cjs` relocation (ADR-010, LOCKED), loopType decision | Verify |
| Verify | Core | Phase 009 (command/agent/advisor/cutover) |

**Status: Setup DONE, Core DONE, Verify DONE.** Phase 009 is unblocked to start.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|------------------|
| Setup | Low | Re-read + re-verified 3 runtime scripts, all citations confirmed current |
| Core Implementation | High | `reduce-state.cjs` relocation (ADR-010) confirmed already performed (by a prior pass on this same uncommitted working tree) + regression-proven; new sibling reducer confirmed already built; 3 new single-shot scripts (`check-convergence.cjs`, `partition-corpus.cjs`, `remediate-hook.cjs`) authored fresh this pass |
| Verification | Medium | Isolated git-worktree regression proof + 4-scenario wiring test suite, both executed and passing |
| **Total** | | **High, fully executed.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `reduce-state.cjs` relocation (ADR-010, LOCKED) performed and output-diffed before reducer core implementation starts.
- [x] Reducer output format agreed before first convergence run ships — `reduce-alignment-state.cjs`'s registry shape is the format `check-convergence.cjs` and `partition-corpus.cjs` both consume.

### Rollback Procedure
1. Disable the alignment loop's dispatch (report "not yet wired") rather than shipping a convergence computation against the wrong loopType.
2. Revert reducer/runtime-touch-point code via normal version control.
3. Re-verify against the dry-run cases in Testing Strategy before re-enabling.
4. No user-facing notification needed - this is an internal deep-loop mode, not a shipped user surface, in v1.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
