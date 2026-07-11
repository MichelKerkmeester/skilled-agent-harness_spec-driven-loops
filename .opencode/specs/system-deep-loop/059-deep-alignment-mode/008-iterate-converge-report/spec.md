---
title: "Feature Specification: Phase 8: iterate-converge-report"
description: "Phase 008 plans wiring deep-alignment's iterate/converge/report cycle onto the reused deep-loop runtime (loop-lock, convergence, reduce-state, verify-iteration), a per-lane alignment-report reducer, coverage-plus-dry-run convergence thresholds, and corpus partitioning of discovered artifacts across iterations. All state externalizes to the bound spec folder's alignment/ subdir; no manual /tmp state."
trigger_phrases:
  - "deep-alignment convergence wiring"
  - "alignment report reducer"
  - "corpus partitioning deep-alignment"
  - "deep-alignment loop state"
  - "coverage dry-run convergence threshold"
importance_tier: "normal"
contextType: "general"
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 008 iterate/converge/report spec"
    next_safe_action: "ADR-010 LOCKED: relocate reduce-state.cjs to shared runtime; decide loopType call"
    blockers:
      - "005-007 adapter phases not yet executed"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs"
      - ".opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-008"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether convergence.cjs gains a fourth loopType value or deep-alignment reuses review loopType under a distinct artifactRoot (independent of ADR-010, not governed by it)"
      - "AND vs OR combination of coverage and dry-run-stability convergence signals"
    answered_questions:
      - "ADR-010 LOCKED: promote reduce-state.cjs (and any other mode-local primitive this phase needs) from deep-review/scripts/ to shared runtime/scripts/, behavior-preserving relocation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: iterate-converge-report

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-adapter-sk-code |
| **Successor** | 009-command-agent-advisor-cutover |
| **Handoff Criteria** | A future executor can wire the loop directly from this plan: the exact runtime scripts to reuse, the ADR-010 `reduce-state.cjs` relocation, the loopType reuse-vs-extend decision point, the alignment-report reducer shape, the convergence-threshold logic, and the externalized state-file layout are all named with real paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-alignment` is specified to MAXIMALLY reuse the deep-review/runtime engine rather than rebuild a loop from scratch, but the runtime's convergence entrypoint hard-validates its loop type: `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 659-660 accept only `"research"`, `"review"`, `"council"`, or `"context"` and throw an input error otherwise. Without a resolved plan for how deep-alignment's iterate/converge/report cycle attaches to this runtime - and for how findings roll up per lane instead of per dimension - phase 008 cannot be built and the mode has no working loop.

### Purpose
Produce an evidence-grounded plan for wiring deep-alignment onto the existing runtime (`loop-lock.cjs`, `convergence.cjs`, `reduce-state.cjs` pattern, `verify-iteration.cjs`), a per-lane alignment-report reducer, coverage-plus-dry-run convergence thresholds, and corpus partitioning of discovered artifacts - all state externalized to the bound spec folder's `alignment/` subdir, mirroring the proven `review/` state layout from the reference implementation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Phase Context

This is **Phase 8** of the `system-deep-loop/059-deep-alignment-mode` mode-packet specification.

**Scope Boundary**: Plan only. No runtime code changes, no mode-packet `SKILL.md`, no scripts ship in this phase. ADR-010 in 002's decision-record is now ACCEPTED: `reduce-state.cjs` (and any other mode-local primitive this phase needs) promotes to shared `runtime/scripts/`, with `deep-review`'s import repointed as a behavior-preserving relocation. The separate `convergence.cjs` loopType enum question (extend the enum vs. reuse `review` under a distinct `artifactRoot`) is NOT governed by ADR-010 — it is this phase's own still-open, build-time implementation call; the scaffold only names its tradeoff.

**Dependencies**: Phases 005-007 supply the adapters whose `check()` output this phase's reducer consumes. Phase 004 (scoping-and-discovery) supplies the lane list this phase iterates over.

**Deliverables**: A named plan for locking/acquiring the loop (`loop-lock.cjs`), computing convergence (`convergence.cjs` reuse-vs-extend decision), reducing per-iteration findings into a per-lane alignment-report (`reduce-state.cjs`-pattern reducer), verifying leaf-agent output (`verify-iteration.cjs` extension), partitioning the discovered corpus across iterations, and the optional gated REMEDIATE hook after REPORT.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### In Scope
- Plan reuse of `loop-lock.cjs` for the alignment loop's lock file (acquire/status/refresh/release) under the bound spec folder's `alignment/` subdir.
- Plan the `reduce-state.cjs` relocation (ADR-010, LOCKED): move `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` to shared `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, repoint `deep-review`'s import to the new path, and confirm `deep-review`'s reducer output is unchanged (behavior-preserving relocation).
- Plan the `convergence.cjs` reuse boundary: name the loopType enum constraint at lines 659-660 as an explicit open decision (extend the enum to add `"alignment"`, or reuse `"review"` under a distinct `artifactRoot`) and describe both options' tradeoffs without resolving which wins in the scaffold — this is a phase-008 execution-time implementation call, independent of ADR-010.
- Plan a per-lane alignment-report reducer as a sibling file in the shared `runtime/scripts/` directory (per ADR-010's promoted-to-shared convention, not a `deep-alignment`-local script), mirroring `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`'s `REQUIRED_DIMENSIONS`/`SEVERITY_WEIGHTS` pattern but keyed by lane (authority x artifact-class x scope) instead of by review dimension.
- Plan the `verify-iteration.cjs` extension: name the exact maps (`LEAF_BY_LOOP`, `STATE_LOG_BY_LOOP`, `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` lines 17-24) that need a `deep-alignment`/`alignment` entry.
- Plan convergence thresholds: artifact-coverage percentage plus a dry-run stability signal (N consecutive iterations with zero new findings), combined with max-iterations as a hard stop.
- Plan corpus partitioning: how discovered artifacts across N lanes get distributed across iterations, distinct from deep-review's fixed four-dimension rotation.
- Plan the externalized state-file layout under `alignment/`, modeled on the real `review/` layout observed in `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/`.
- Plan the optional, operator-gated REMEDIATE hook: the default loop is read-only and terminates at REPORT; a separate opt-in remediation pass (alignment contract invariant 4, ADR-005) attaches after REPORT as a loop-side state transition planned here, inheriting the contract's safety discipline (scoped staging only — never `git add -A` — worktree-when-diverged, doc-only/skip-shared-files when concurrent sessions are live).

### Out of Scope
- Implementing any runtime code change - future phase, not this scaffold.
- The four v1 adapters - owned by phases 005-007.
- Scoping/discovery (lane resolution) - owned by phase 004.
- Command, agent, and advisor cutover work - owned by phase 009.
- Resolving the loopType enum extension decision in the scaffold - an independent phase-008 execution-time call, not governed by ADR-010; the scaffold only names the tradeoff.
- Actually performing the `reduce-state.cjs` relocation - ADR-010 is LOCKED as a decision, but the file move and `deep-review` import repoint are future execution-pass work, not done in this scaffold.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` (future move target) | Plan only | ADR-010 LOCKED: this phase plans its relocation to `runtime/scripts/reduce-state.cjs`; no move happens here. |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` (future, not yet created) | Plan only | This phase documents the alignment-report reducer plan as a shared-runtime sibling of the relocated `reduce-state.cjs`; no file is created. |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` (future edit target) | Plan only | This phase names the exact map entries a future phase must add; no edit happens here. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Name the `convergence.cjs` loopType constraint and both reuse options (independent phase-008 execution-time call, not governed by ADR-010). | `plan.md` cites `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 657-660 verbatim and lists both the enum-extension option and the reuse-under-`review`-with-distinct-`artifactRoot` option with a tradeoff for each. |
| REQ-002 | Plan the alignment-report reducer's per-lane shape, located per ADR-010's shared-runtime convention. | `plan.md` cites `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` lines 21-24 (`REQUIRED_DIMENSIONS`, `SEVERITY_KEYS`, `SEVERITY_WEIGHTS`) as the pattern being mirrored, with the per-lane key list replacing the per-dimension key list, and names the new reducer's home as `runtime/scripts/reduce-alignment-state.cjs`, not a `deep-alignment`-local script. |
| REQ-006 | Plan the `reduce-state.cjs` relocation per ADR-010 (LOCKED: promote to shared runtime). | `plan.md` names the exact move (`deep-review/scripts/reduce-state.cjs` -> `runtime/scripts/reduce-state.cjs`), states it is behavior-preserving (only `deep-review`'s import path changes, not its logic or output), and names the verification step (output diff before/after) that proves it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Plan the `verify-iteration.cjs` extension. | `plan.md` names `LEAF_BY_LOOP` and `STATE_LOG_BY_LOOP` at `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` lines 17-24 as the exact maps needing a new entry, without editing the file in this phase. |
| REQ-004 | Plan convergence-threshold combination logic. | `plan.md` states whether coverage and dry-run-stability combine with AND or OR, and how max-iterations acts as an independent hard stop regardless of that combination. |
| REQ-005 | Plan the externalized `alignment/` state-file layout. | `plan.md` names each planned file/dir under `alignment/` and cites the real precedent layout observed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/` (state log, findings registry, strategy doc, config, `iterations/`, `deltas/`, `prompts/`, `dispatch-receipts/`, lock file). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementer can decide the loopType reuse-vs-extend question (this phase's own build-time call, independent of ADR-010) and wire `convergence.cjs` accordingly using only this plan.
- **SC-002**: A future implementer can perform the ADR-010 `reduce-state.cjs` relocation and build the alignment-report reducer directly from this plan's per-lane shape without re-deriving the `reduce-state.cjs` pattern from scratch.
- **SC-003**: The externalized state-file layout plan is concrete enough that no ad-hoc `/tmp` state is ever needed to run the loop.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `convergence.cjs` loopType enum (lines 659-660) | Reuse is blocked until this phase's execution pass decides enum-extension vs. `review`-reuse (its own build-time call, independent of ADR-010). | Name both options and their tradeoffs now so the decision is ready-made instead of open-ended research. |
| Dependency | Phases 005-007 adapter output shape | If adapter `check()` output shape changes after this phase is authored, the reducer plan needs reconciliation. | Treat the phase-005 contract's `findings` shape as canonical; reconcile at build time. |
| Risk | Per-lane convergence could mask a single stuck lane inside an otherwise-converged run. | A lane with persistent findings could get diluted by N-1 converged lanes' zero-new-findings signal. | Convergence must be evaluated per-lane, not only in aggregate; the reducer plan states per-lane verdicts roll up but do not average away a FAIL lane. |
| Risk | `reduce-state.cjs` relocation (ADR-010) accidentally changes `deep-review`'s reducer output, not just its import path. | `deep-review`'s convergence signal could silently drift. | Phase 008's execution pass diffs `deep-review`'s reducer output before/after the move; the ADR requires behavior-preservation, not just a compiling import. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Corpus partitioning bounds each iteration's artifact count so a single iteration does not attempt to check an entire large lane in one pass, mirroring deep-review's per-iteration tool-call budget discipline.

### Security
- **NFR-S01**: The lock file and state files under `alignment/` resolve only inside the bound spec folder root, mirroring `loop-lock.cjs`'s path-safety guards; no path traversal outside the packet.

### Reliability
- **NFR-R01**: If `convergence.cjs` cannot be reused as-is (loopType rejected), the plan's fallback is graceful degradation to a documented manual coverage check, not a silent skip of convergence detection.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero lanes resolved from scoping (phase 004): the loop reports "nothing to converge" and exits cleanly rather than looping indefinitely.
- A lane whose adapter's `discover()` returns zero artifacts: that lane's verdict is `not-applicable`, not folded silently into an aggregate PASS.

### Error Scenarios
- `verify-iteration.cjs`'s per-loop maps lack a `deep-alignment` entry at build time (not yet added): the loop must fail closed with a clear "unregistered loop type" error rather than silently reusing `deep-review`'s entry and writing to the wrong state log.

### State Transitions
- Restart lifecycle (per the deep-review protocol precedent): archiving the existing `alignment/` directory and minting a fresh session, mirroring `.claude/agents/deep-review.md` §"Lifecycle + Reducer Contract" (`new`/`resume`/`restart`), is named as the expected reuse pattern, not redesigned here.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Wiring plan across four runtime scripts plus a new reducer shape. |
| Risk | 12/25 | The loopType enum dependency is a real, confirmed constraint that blocks clean reuse until decided. |
| Research | 12/20 | Cross-read of `convergence.cjs`, `verify-iteration.cjs`, `reduce-state.cjs`, and the real `review/` state layout precedent. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

ADR-010 (the mode-local-primitive reuse boundary — `reduce-state.cjs`) is now LOCKED: promote to shared `runtime/scripts/`, `deep-review`'s import repointed, behavior-preserving. The items below remain genuinely open — they are this phase's own build-time implementation calls, not governed by ADR-010:

- Whether `convergence.cjs` gains a fourth loopType value (`"alignment"`) or deep-alignment reuses `"review"` under a distinct `artifactRoot` - TBD, resolved at this phase's execution pass as an independent implementation decision.
- Whether coverage and dry-run-stability convergence signals combine with AND or OR - TBD, resolve alongside the loopType decision since both affect the same convergence computation.
- Whether corpus partitioning is lane-round-robin (one lane's artifacts per iteration) or artifact-count-bounded across all lanes - TBD.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
