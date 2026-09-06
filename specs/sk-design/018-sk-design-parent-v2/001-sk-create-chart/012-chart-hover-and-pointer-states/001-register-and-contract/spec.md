---
title: "Feature Specification: The register and the recorded contract"
description: "check-corpus.cjs has no way for a chart form to declare that it correctly answers a pointer with nothing, and references/template-contract.md does not yet record what any of the 21 forms' pointer contracts are. This phase lands the fourth register and writes every contract down, with nothing annotated yet, so the corpus stays green the day the rule arrives."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: The register and the recorded contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states` |
| **Depends On** | The untouched corpus prints `RESULT: PASSED` today (baseline, not a phase) |
| **Runs With** | Alone. Phases 2 and 3 depend on this phase and cannot start before it lands |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-corpus.cjs` recognizes three interaction registers, `data-chart-tooltip`, `data-chart-legend` and `data-chart-dim`, and enforces hygiene, state and formatting rules against them. It has no way for a form to declare that it correctly answers a pointer with nothing, so a form whose figure already prints every value it encodes cannot make that claim and have the checker hold it to it. `references/template-contract.md` also has no table recording what any of the 21 forms' decided pointer contract is, and its line 403 currently misdescribes the eight forms without a hover card as ones whose marks already print their own value, which is false for `daily-range`, the one form that prints neither of the two values it encodes. Until a fourth register exists and is checked, and the full 21-row contract is written down beside it, phases 2 through 6 have no rule to be graded against and no document recording what each form is supposed to do.

### Purpose
`check-corpus.cjs` enforces a fourth register, `data-chart-inert`, for a form that correctly refuses the pointer, and `references/template-contract.md` and `scripts/README.md` carry every one of the 21 forms' contracts, the new register's rules, its failure recipes and the touch decision, while the corpus still prints `RESULT: PASSED`, because nothing is annotated yet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `data-chart-inert` register to `check-corpus.cjs`, as two branches folded into the existing interaction checks, read from the markup region alone.
- Do not add the new register to `INTERACTION_REGISTERS`. An inert form answers no pointer and owes no focus-ring rule.
- Add a fourth row to the register table in `references/template-contract.md`, and add the full 21-row per-form pointer contract to a new subsection, corrected against the four claims research verified against the code.
- Correct the false sentence at `references/template-contract.md:403`.
- Rename `references/template-contract.md` section 7 from "THE SIXTEEN RULES" to "THE SEVENTEEN RULES" and add the new rule's row.
- Record the touch decision, a tap pins its readout, a second tap or a tap outside the drawing clears it, in `references/template-contract.md` section 10.
- State, in the contract document, that the contract binds every rendered chart artifact under both `assets/templates/` and `assets/examples/`, not templates alone, since a later phase brings the deliveries up to their parents' contracts.
- Add the two mutation recipes the new register needs to `scripts/README.md` section 5, and name the new assertions in section 4.
- Record how `AC-005` should be treated, since it cannot be satisfied as written under this packet's no-shared-runtime constraint.

### Out of Scope
- Annotating any of the 21 templates - phase 2 annotates the six inert forms and phases 3 through 6 annotate the seven forms gaining a tooltip.
- Building the hover mechanism itself, its CSS, its markup or its script - phase 3 extracts and proves it, phases 4 through 6 transfer it.
- Editing `acceptance-criteria.md` - this phase records the `AC-005` recommendation for phase 8 to apply, and does not touch the parent packet's closure gate document.
- Deciding or acting on whether the six deliveries under `assets/examples/` are brought to parity with their parent templates - that decision and its execution belong to phase 7. This phase only states that the contract's scope already covers deliveries, so phase 7 has a rule to build against rather than a gap to discover.
- Re-deriving the seven already-shipped tooltip forms or the two already-terminal forms' verdicts - only their contract-table wording is corrected where research found it inaccurate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | Add the `data-chart-inert` constant and its two enforcement branches inside `checkInteractionHygiene` |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | Fourth register row, the 21-row contract table, the corrected sentence at `:403`, the renamed seventeen-rule section, the touch decision, the deliveries-scope sentence |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md` | Modify | Two new mutation recipes in section 5, the new assertions named in section 4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 21 templates has a recorded pointer contract in `references/template-contract.md`, and a contract of `inert` names the reason the static figure already suffices. This phase completes the documented half of REQ-001. The markup half, the attribute landing on each template, is phases 2 through 6. |
| REQ-005 | `check-corpus.cjs` fails a form that declares `data-chart-inert` with no reason, and fails a form that declares `data-chart-inert` alongside a register it also carries. Neither the constant nor its check joins `INTERACTION_REGISTERS`, since an inert form owes no focus-ring rule. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `references/template-contract.md`'s per-form table records, for every one of the seven partial forms, either that it gains a tooltip or the reason a legend or dim is its correct terminal state, ahead of phases 3 through 6 actually building it. |
| REQ-007 | `references/template-contract.md` section 10 records the touch decision in a stated sentence: a tap pins its readout, a second tap or a tap outside the drawing clears it, hover yields while pinned, and what is not guaranteed (drag-scrub, long press) is written down rather than left silent. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-corpus.cjs` prints `RESULT: PASSED` against the untouched corpus once the rule lands, before anything is annotated (maps to AC-001, AC-006).
- **SC-002**: The contradiction mutation on `heat-matrix.html` and the empty-reason mutation on a register-free form each print `RESULT: FAILED` naming the branch they broke, and `RESULT: PASSED` once restored from the copy (maps to AC-006).
- **SC-003**: `references/template-contract.md`'s per-form table lists all 21 forms with a decided contract, a stated reason on every `inert` row, and a recorded decision for each of the seven partial forms (maps to AC-001, AC-008).
- **SC-004**: `references/template-contract.md` section 10 states the touch decision in a sentence a reader can act on, not silence (maps to AC-009).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The untouched corpus prints `RESULT: PASSED` today | If the baseline is not green before this phase starts, the ordering this whole packet relies on no longer holds | Run `node scripts/check-corpus.cjs` first and treat a non-`PASSED` baseline as a blocker to escalate, not a reason to proceed |
| Risk | `AC-005` cannot be met as written, since the scope constraint forbids the shared runtime its own verification step assumes | Medium: a criterion nobody can satisfy blocks packet closure if it is left silently `Unmet` | Restate it against the declaration surface this phase builds, a form declares one of the four registers and `check-corpus.cjs` enforces that the declaration is internally consistent, rather than a runtime behaviour appearing from a declaration alone. This phase records the restated wording in `plan.md` as a recommendation. Phase 8 applies it to `acceptance-criteria.md`, or waives the criterion with an ADR if the restatement is rejected |
| Risk | The new register's two branches are folded into `checkInteractionHygiene` rather than given a dedicated check name | Low: a reviewer grepping the run summary for a dedicated check name finds none | `plan.md` documents the choice and its reasoning. Confirm the `interaction-hygiene` per-file assertion count rises to reflect the two new assertions, so a run that skips them under-reports rather than silently reusing the old count |
| Dependency | Phases 2 through 6 | They annotate templates against the rule and the table this phase writes, and cannot start correctly without it | None. This phase is strictly serial and precedes all of them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable to this phase's own edits. This phase adds no runtime code to any template, so no form's first paint changes.
- **NFR-P02**: Not applicable to this phase's own files. `check-corpus.cjs` and the two reference documents carry no per-file byte budget. The byte measurement itself is phase 3's job for the excerpt and phase 8's job for the final table.

### Security
- **NFR-S01**: No external fetch, CDN reference, or remote resource is introduced by a checker rule or a reference document edit.

### Reliability
- **NFR-R01**: `check-corpus.cjs`'s new branches read only the markup region string, deterministically. Running the checker twice against the same tree prints the same `RESULT` both times.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A form that declares `data-chart-inert` with only whitespace as its value: treated the same as an empty value, since the captured group is trimmed before the check reads it, and the empty-reason branch fires.
- A form that declares `data-chart-inert` with a real reason and carries no other register: passes silently. This is the intended shape for a correctly inert form, whether or not it has been annotated yet.

### Error Scenarios
- A form that carries both `data-chart-inert` and one of the three interaction registers: `check-corpus.cjs` fails it, naming both the inert declaration and the carried register in one message, so the fix, removing one of the two, is obvious from the failure text alone.
- A form with no interaction attribute of any kind: passes both new branches. This is deliberate. Silence is what keeps the corpus green while the six inert forms and the six forms gaining a tooltip are annotated across phases 2 through 6.

### State Transitions
- Not applicable. This phase adds no runtime state, only a static markup check and two reference documents.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One shared code path used by every one of the 21 forms plus the 6 deliveries, a 21-row table, a renamed rule section and two new mutation recipes |
| Risk | 8/25 | No runtime change and no new dependency, but a mistake in the shared check function affects every file the corpus reads, not one form |
| Research | 3/20 | Fully decided by `research.md`. The only open items are naming the new constant and confirming the tally arithmetic |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should `AC-005` be restated against the declaration surface (this phase's recommendation, recorded in `plan.md`), or waived with an ADR because the restatement is judged too far from the original criterion's intent? Phase 8 decides which and applies it to `acceptance-criteria.md`. This phase does not edit that file.
- Is folding the two new branches into `checkInteractionHygiene`, reusing its already-computed `carried` array, the right structural choice, or does an implementer find a reason during the build to give the new rule its own function and check name? `plan.md` proposes folding it in. A change to that choice should be recorded rather than made silently.
<!-- /ANCHOR:questions -->
