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
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 008 iterate/converge/report implementation plan"
    next_safe_action: "Close ADR-010 loopType call at this phase's execution"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
This phase plans, not builds, the wiring between `deep-alignment` and the existing deep-loop runtime. The central open item is `convergence.cjs`'s hard-validated loopType enum (`research`/`review`/`council`/`context` only, at lines 659-660) - this plan names both reuse paths and their tradeoffs so this phase's execution pass can close open ADR-010 (002's decision-record) without re-deriving the constraint. Everything else (locking, reducer shape, corpus partitioning, state layout) is planned concretely enough to build once that one decision lands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 005-007's adapter `check()` output shape is available (or the phase-005 contract's `findings` shape is used as fallback).
- [ ] The `convergence.cjs` loopType constraint is confirmed current at the cited line numbers.
- [ ] The real `review/` state-layout precedent is confirmed current.

### Definition of Done
- [ ] The convergence reuse-vs-extend tradeoff is documented well enough to close open ADR-010 without further research.
- [ ] The alignment-report reducer's per-lane shape is concrete enough to code from.
- [ ] `checklist.md` items are reviewed and either checked with evidence or explicitly deferred.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin specialization over the existing deep-loop runtime, per the design brief: "REUSES the deep-review/runtime engine... it is a THIN specialization, not a rebuild."

### Key Components
- **Locking**: reuse `.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` unchanged - `acquire --lock-path <spec-folder>/alignment/.deep-alignment.lock --packet-id <packet> --runtime-kind alignment`, `status`, `refresh`, `release` subcommands, mirroring the deep-review `.deep-review.lock` / `.owner-pid` pattern observed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/.deep-review.lock`.
- **Convergence - Option A (enum extension)**: add `"alignment"` as a fifth accepted value at `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 659-660, alongside a new `computeCompositeScore` branch (the function already branches per loopType at line 303/307/319). Tradeoff: touches shared runtime code every other mode depends on; requires the same care as the existing `"context"` loopType addition set a precedent for.
- **Convergence - Option B (reuse under `review`)**: pass `loopType: "review"` to `convergence.cjs` but bind a distinct `--spec-folder`/namespace so alignment's snapshots never collide with a real deep-review run on the same packet, and treat `review`'s existing severity-weighted composite score as directly applicable (P0/P1/P2 findings already exist in the adapter contract). Tradeoff: zero runtime code change, but "loopType: review" is a semantic mismatch an operator or future maintainer could find confusing in logs/telemetry.
- **Alignment-report reducer**: a new `reduce-state.cjs`-pattern script mirroring `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` lines 21-24 - replace `REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability']` with a `REQUIRED_LANES` list resolved from phase 004's scoping output, keep the `SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }` pattern for per-lane composite scoring, and emit a per-lane verdict (PASS/CONDITIONAL/FAIL, mirroring the deep-review verdict table) rolled into one `alignment-report.md`.
- **`verify-iteration.cjs` extension**: add `alignment: 'deep-alignment'` to `LEAF_BY_LOOP` and `alignment: 'deep-alignment-state.jsonl'` to `STATE_LOG_BY_LOOP` at `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` lines 17-24, so the after-dispatch leaf-reliability check covers the new loop type instead of silently passing it through unchecked.
- **Corpus partitioning**: distribute discovered artifacts across iterations lane-by-lane (each iteration covers one lane's next unaudited slice, rotating lanes round-robin), distinct from deep-review's fixed four-dimension rotation, because deep-alignment's "dimensions" are lanes of variable artifact count rather than four fixed named categories.
- **REMEDIATE hook (optional, gated)**: the default loop is read-only and terminates at REPORT; an operator-gated remediation pass (ADR-005 invariant 4) attaches after REPORT as a separate opt-in state transition planned here, inheriting the alignment contract's safety discipline (scoped staging only — never `git add -A` — worktree-when-diverged, doc-only/skip-shared-files when concurrent sessions are live).

### Data Flow
The loop acquires the lock, resolves the next corpus slice from the partitioning plan, dispatches a leaf iteration against that slice (adapter `discover()`/`check()` already ran or run inline), appends findings to the JSONL state log, the reducer refreshes the per-lane registry and `alignment-report.md`, `convergence.cjs` (or its option-B equivalent) computes the composite convergence score, and the loop either continues, stops on convergence, or stops on max-iterations. The optional gated REMEDIATE pass, when the operator explicitly invokes it, attaches only after a REPORT-terminated run — never as part of the default read-only loop.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase plans new wiring and modifies no existing runtime behavior yet. Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Owns the live loopType-validated convergence computation for research/review/council/context | Read-only analysis in this phase; a future phase either extends its enum or reuses it unchanged | Lines 657-660 cited above |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Owns the live per-loop leaf-reliability check maps | Read-only analysis in this phase; a future phase adds map entries | Lines 17-24 cited above |
| `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` | Owns the live per-dimension review reducer pattern | Read-only pattern reference; not modified; a future phase writes a new sibling reducer for alignment | Lines 21-24 cited above |

Required inventories:
- Same-class producers: `rg -n "loopType !== " .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` confirms the single validation site for the enum constraint.
- Consumers of changed symbols: not applicable - no symbols change in this phase.
- Matrix axes: convergence option (A extend-enum, B reuse-review) x reducer shape (lane-keyed) x partitioning (lane-round-robin) = the three named decision surfaces above.
- Algorithm invariant: composite convergence score must remain monotonic non-increasing toward the threshold as findings stabilize, matching `computeCompositeScore`'s existing severity-weighted design regardless of which reuse option is chosen.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 005-007's adapter `check()` output shape (or fall back to the phase-005 contract's `findings` shape).
- [ ] Re-read `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 640-780 and confirm the loopType constraint and `computeCompositeScore` branching are unchanged.
- [ ] Re-read `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` lines 1-40 and confirm `LEAF_BY_LOOP`/`STATE_LOG_BY_LOOP` shape is unchanged.

### Phase 2: Core Implementation (future execution pass — not run in this phase)
- [ ] Decide the convergence reuse-vs-extend option and record it by closing/amending open ADR-010 in 002's decision-record (the scaffold prepared the tradeoff writeup; this phase's execution makes the call).
- [ ] Implement the alignment-report reducer per the Architecture section above, once the loopType decision lands.
- [ ] Add the `verify-iteration.cjs` map entries per the Architecture section above.
- [ ] Implement corpus partitioning (lane round-robin) for iteration dispatch.
- [ ] Stand up the `alignment/` state-file layout mirroring the real `review/` precedent: state log, findings registry, strategy doc, config, `iterations/`, `deltas/`, `prompts/`, `dispatch-receipts/`, lock file.

### Phase 3: Verification (future execution pass — not run in this phase)
- [ ] Dry-run the lock acquire/status/refresh/release cycle against a scratch `alignment/` directory.
- [ ] Dry-run the reducer against a synthetic multi-lane findings set and confirm a FAIL lane is not averaged away by converged lanes.
- [ ] Confirm the loop reports "nothing to converge" cleanly when zero lanes resolve.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reducer per-lane scoring, corpus partitioning | vitest (matching `system-deep-loop/deep-review/scripts/tests/` convention) |
| Integration | Full loop-lock -> dispatch -> reduce -> converge cycle | Manual dry-run against a synthetic multi-lane corpus |
| Manual | Lock/state-file layout matches the real `review/` precedent | Directory diff against `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ADR-010 closure (loopType reuse-vs-extend, owned by this phase's execution pass) | Internal | Open | Reducer and convergence wiring cannot be finalized in code until this phase's execution closes ADR-010; this phase's plan stays valid either way. |
| Phases 005-007 adapter `check()` output shape | Internal | Planned in parallel | If the shape shifts, the reducer plan needs reconciliation before build. |
| Phase 004 scoping/discovery lane list | Internal | Owned by phase 004 | Corpus partitioning needs a concrete lane list to round-robin over; the plan here is shape-only until that lands. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The ADR-010 closure picks a convergence reuse option that materially conflicts with this plan's assumptions, or the `review/` state-layout precedent has since changed shape.
- **Procedure**: Re-open this phase's plan, re-cite the current runtime scripts and the current precedent layout, and update `spec.md`/`plan.md` before resuming implementation.
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
| Core | Setup, ADR-010 closure (this phase's execution) | Verify |
| Verify | Core | Phase 009 (command/agent/advisor/cutover) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-read 3 runtime scripts |
| Core Implementation | High | New reducer + partitioning + one runtime touch-point, gated on closing ADR-010 first |
| Verification | Medium | Lock cycle + reducer dry-run + zero-lane edge case |
| **Total** | | **High (gated on closing open ADR-010 before code can land)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] ADR-010 closure recorded in 002's decision-record before core implementation starts.
- [ ] Reducer output format agreed before first convergence run ships.

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
