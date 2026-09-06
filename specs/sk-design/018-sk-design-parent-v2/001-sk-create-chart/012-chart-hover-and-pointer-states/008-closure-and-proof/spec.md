---
title: "Feature Specification: Prove the pointer contract, run the failure mutation, and close the packet's acceptance criteria"
description: "The corpus has never been proven to fail on a broken contract, and AC-005 cannot be met as written. This phase runs the render check, executes the deliberate mutation AC-006 requires, resolves every acceptance criterion honestly, and reconciles the packet's completion metadata."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Closure and proof for the pointer contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states |
| **Depends On** | 007-deliveries-to-parity, and transitively 001 through 006 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 through 007 land the register, the annotations and the delivery transfers, but nothing yet proves the corpus checker actually fails a form whose rendered output contradicts its declared contract. `RESULT: PASSED` has so far been read as a marker, never as a run somebody watched go red on purpose. Two of the eleven acceptance criteria carry a specific warning of their own: AC-006 is named in `acceptance-criteria.md` as the row most likely to be quietly skipped, and AC-005 cannot be satisfied as written because the packet's own no-shared-runtime constraint forbids the behaviour its verification step assumes.

### Purpose
Every one of the eleven rows in `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded` with evidence that was actually observed, the render run and the AC-006 mutation both execute rather than being asserted, and no document in the packet claims a completion state another document contradicts.

### Non-Goals
- Implementing a ninth phase that tightens the silence-passes rule research.md section 9 (O3) raises. This phase decides whether to defer that question in writing or flag it for future work. It does not change `check-corpus.cjs`'s enforcement either way.
- Originating AC-005's restatement or waiver. That belongs to phase 001-register-and-contract. This phase confirms it happened and blocks closure if it did not.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `node scripts/check-corpus.cjs --render` from the final state and read the literal `RESULT:` line.
- Execute the AC-006 mutation on `heat-matrix.html`, confirm a named failure, restore it.
- Walk AC-002 (keyboard), AC-003 (no-script), AC-004 (first paint) and AC-010 (external references) and record what each asks for.
- Confirm phase 001-register-and-contract's disposition of AC-005, and escalate rather than close if it is missing.
- Report the AC-011 byte table across every file phases 001 through 007 changed.
- Decide and record whether the O3 completeness question (research.md section 9) is deferred or flagged for a future phase.
- Fill every row of `acceptance-criteria.md` and write its closure statement.
- Reconcile `spec.md`'s status and any other document's completion claim against the finished `acceptance-criteria.md`.

### Out of Scope
- Building the ninth phase itself, if the O3 answer is to tighten silence-passes. Recording the decision is in scope, implementing a checker change is a separate phase with its own mutation proof.
- Re-running phases 001 through 007's own verification steps. This phase reads their final state and does not redo their work.
- Editing `check-corpus.cjs`, `template-contract.md` or `scripts/README.md`, beyond what an AC-005 restatement (if not already done in phase 001) or a decision record requires.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md` | Modify | Fill Status, Verification and Waiver columns for all 11 rows with observed evidence, write the Closure Statement |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/decision-record.md` | Create | ADR entries for AC-005 (if phase 001 has not already recorded one) and for the O3 completeness-question disposition |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/spec.md` | Modify | Reconcile the Status field and any shipped or current-state claim once closure is proven |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node scripts/check-corpus.cjs --render`, run from the final state, prints the literal string `RESULT: PASSED`, read from the output and not inferred from the exit code. Maps to parent REQ-005 and AC-007. |
| REQ-002 | The AC-006 mutation, `data-chart-inert` added to `heat-matrix.html` which already carries `data-chart-tooltip`, is executed once, produces a named `RESULT: FAILED`, and is restored from a copy rather than from `git checkout --`. Maps to parent REQ-005 and AC-006. |
| REQ-003 | One form per contract class, `tooltip`, `terminal` and `inert`, is walked by keyboard, confirming every card-revealed value is present in that form's `data-chart-table`, and the six existing `tabindex` controls latch and show a focus ring on tab and not on click. Maps to parent REQ-002 and AC-002. |
| REQ-004 | The no-script pass across the 13 tooltip-contract forms, and the first-paint check on the heaviest form, are both executed and their results recorded. Maps to parent REQ-003, AC-003 and AC-004. |
| REQ-005 | Phase 001-register-and-contract's disposition of AC-005, a restatement against the declaration surface or a waiver with a decision record, is confirmed to exist before this phase closes. If neither exists, this phase escalates rather than marks AC-005 Met. Maps to parent REQ-004 and AC-005. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The external-resource grep count across the corpus is confirmed unmoved from its pre-packet baseline. Maps to parent REQ-008 and AC-010. |
| REQ-007 | The real per-file byte delta is reported as a table for every file phases 001 through 007 changed, using the measured 7,016-byte figure for an unmodified copy of the excerpt rather than remeasuring it. Maps to parent NFR-P02 and AC-011. |
| REQ-008 | **Answered, then superseded by the follow-up that implemented it (ADR-003).** The O3 completeness question (research.md section 9) is answered in writing, deferred with a stated reason or flagged as a future phase, and the answer is written into `template-contract.md` or a decision record. |
| REQ-009 | Every row of `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded`, none is left `Open`, and `spec.md`'s Status field agrees with the finished criteria. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `RESULT: PASSED` is observed, literally, in the terminal output of a `--render` run against the final state.
- **SC-002**: The AC-006 mutation is observed to fail once, naming the contradiction branch, and to pass once restored, with both outputs kept as evidence.
- **SC-003**: All 11 rows of `acceptance-criteria.md` read `Met`, `Waived` or `Superseded`, none `Open`.
- **SC-004**: No document in the packet, `spec.md`, `acceptance-criteria.md` or this phase's own `implementation-summary.md`, claims a completion state contradicted by another.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 through 007 all reporting `RESULT: PASSED` at their own final state | This phase reads the final state and has nothing to verify otherwise | Confirm each phase's own verification evidence before starting |
| Dependency | Phase 001-register-and-contract's AC-005 disposition | Closing with AC-005 silently marked Met would repeat the exact failure research.md section 9 (O2) warns against | Treat a missing disposition as a blocker, not a gap to fill in on this phase's own authority |
| Risk | AC-006 is named as the criterion most likely to be quietly skipped | A checker that has only ever passed is not evidence it can fail | Execute the mutation as a required task, not a suggestion, and keep both outputs (`FAILED` and the restored `PASSED`) as the Verification cell's evidence |
| Risk | No headless Chrome or Chromium binary on the machine running `--render` | `check-corpus.cjs` errors rather than skipping when it finds none | Set `CHROME_PATH` if the binary lives outside the usual paths, and report the absence as a blocker rather than a silent skip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not directly tested by this phase. The first-paint check under REQ-004 confirms the parent packet's own NFR-P01 held after phases 001 through 007.
- **NFR-P02**: The per-file byte delta this phase reports is the parent's NFR-P02 requirement, discharged here rather than assumed.

### Security
- **NFR-S01**: Confirmed by the external-resource grep under REQ-006. No new fetch, CDN, remote font or script target across the corpus.

### Reliability
- **NFR-R01**: Confirmed by the no-script pass under REQ-004. Every form degrades to the same readable figure with scripting unavailable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A criterion whose observed evidence conflicts with what another document already claims. Treat this as a logic-sync condition and resolve it before writing the row, not after.
- A `Waived` or `Superseded` row whose named decision record does not yet exist. Create the record before marking the row, never after.

### Error Scenarios
- The AC-006 mutation fails to produce `RESULT: FAILED` at all. Do not proceed to mark AC-006 Met. Treat this as a defect in the checker or in the mutation recipe and escalate rather than move on.
- `--render` cannot find a browser. Report the blocker per REQ-004's mitigation rather than marking AC-007 Met on the structural run alone.

### State Transitions
- Mid-closure halt: if a criterion cannot be resolved honestly in this session, leave its row at its last observed status (`Unmet`), never advance it to `Met` on the expectation that evidence will appear later.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two or three documents changed, but evidence spans the whole 30-file corpus |
| Risk | 8/25 | Closure risk: a wrongly marked `Met` row is worse than an honestly `Open` one |
| Research | 2/20 | Fully resolved by research.md and phase-recommendation.md PHASE 8 |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The O3 completeness question (research.md section 9): whether silence should keep passing an unannotated form now that all 21 templates are annotated, or whether that should become an error in a future phase. This phase must answer it in writing, not implement a checker change either way.
<!-- /ANCHOR:questions -->
