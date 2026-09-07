---
title: "Feature Specification: Phase 15: criteria-file-line-enforcement"
description: "The acceptance-criteria coverage floor exists, defaults advisory and is currently a no-op for the very program that documents it as aspirational, because the packets it should measure carry no completion signal the gate's own activation check reads."
trigger_phrases:
  - "acceptance criteria file line enforcement"
  - "coverage floor cutoff rollout"
  - "lifecycle activation gap"
  - "citation retrofit coverage floor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: criteria-file-line-enforcement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/015-criteria-file-line-enforcement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-registration-schema-unification |
| **Successor** | 016-cross-session-operator-items |
| **Handoff Criteria** | `validate.sh --strict` with the enforce switch on genuinely activates and passes for children 006 to 022, not merely a switch that flips with no effect |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Recorded findings closure specification.

**Scope Boundary**: `check-ac-coverage.sh`'s enforce/cutoff behavior, its lifecycle-activation check, `runtime/ENV-REFERENCE.md`'s documentation of the new variable and the acceptance-criteria.md content of the simplification program's own children 006 through 022. No change to `check-ac-closure.sh`'s existing cutoff (it stays the model this phase copies, not a file this phase edits) and no change to any packet outside that program.

**Dependencies**:
- Lane 004 round two `f-iter004-002` and `f-iter004-001`, `specs/system-speckit/035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria/research/confirmed-findings.md:101,120`
- `check-ac-coverage.sh` and `check-ac-closure.sh` under `.opencode/skills/system-spec-kit/runtime/cli/rules/`
- `runtime/ENV-REFERENCE.md:166-170`, which already documents `SPECKIT_AC_COVERAGE`, `SPECKIT_AC_COVERAGE_ENFORCE`, `SPECKIT_AC_COVERAGE_FLOOR`, `SPECKIT_AC_CLOSURE` and `SPECKIT_AC_CLOSURE_CUTOFF`

**Deliverables**:
- A cutoff-gated enforce switch for `check-ac-coverage.sh`, matching `check-ac-closure.sh`'s existing rollout pattern
- A closed lifecycle-activation gap, since the gate currently never turns on for any of the 16 measurable packets in the program it is meant to prove
- Citation retrofit across children 006 to 022 sufficient to clear the 90 percent floor

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-ac-coverage.sh` already ships a floor (default 0.9), an advisory default and an `SPECKIT_AC_COVERAGE_ENFORCE` switch that is off by default (`runtime/ENV-REFERENCE.md:166-168`). Lane 004 round two confirmed two related gaps: one in five Met criteria cite `file:line` repository-wide (`f-iter004-002`, `confirmed-findings.md:120`) and child 010's own first-authored criteria cited none until a later pass added them (`f-iter004-001`, `confirmed-findings.md:101`). Neither gap is theoretical for the program that produced these findings. A direct measurement of the program's own children 006 through 022 (excluding 008, a Level 1 packet with no `acceptance-criteria.md`) found 77 acceptance-criteria rows across 16 packets, of which 21 (27 percent) currently cite a `file:line`-shaped verification and 56 do not, well under the 90 percent floor `check-ac-coverage.sh` already defines. Only child 010 (6 of 6 rows) already clears the floor. But turning the enforce switch on today would change none of this: `check-ac-coverage.sh`'s `_ac_lifecycle_active()` function (`check-ac-coverage.sh:69-99`) requires `implementation-summary.md` to carry a table row whose Status cell matches one of a fixed set of values (`check-ac-coverage.sh:94,98`), and a direct check of all 16 packets' `implementation-summary.md` files found not one carries a Status row at all - their Metadata table holds only Spec Folder, Completed and Level. Each packet's completion state is instead recorded in `acceptance-criteria.md`'s own metadata block (for example child 006's `**Status:** Complete`), a field `_ac_lifecycle_active()` never reads. The coverage gate is therefore a complete no-op for this entire program today, independent of the enforce switch, and "retrofit the program's children to the floor" and "validate strict with the switch on" are both unachievable until this activation gap closes alongside the cutoff and the citations.

### Purpose
`check-ac-coverage.sh` fails an under-floor packet created after a cutoff date the same way `check-ac-closure.sh` already does, the gate genuinely activates for the program's own completed children instead of silently skipping them and children 006 through 022 carry enough `file:line` citations to clear the floor for real.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A cutoff-gated enforce switch for `check-ac-coverage.sh`, matching `check-ac-closure.sh`'s `_acc_cutoff_date()` / `_acc_created_date()` pattern (`check-ac-closure.sh:44-71`)
- Closing the lifecycle-activation gap so `_ac_lifecycle_active()` recognizes a completed Level 2+ packet whose completion signal lives in `acceptance-criteria.md`'s own metadata rather than assuming a `Status` row in `implementation-summary.md` that this program's packets never carry
- Retrofitting `file:line` citations into children 006 through 022's `acceptance-criteria.md` Verification cells until each packet reaches the 90 percent floor (56 rows across 15 packets need a citation, or a documented, honest alternative, to close the 21-of-77 to 70-of-77 gap)
- Documenting the new cutoff variable in `runtime/ENV-REFERENCE.md`, alongside the existing `SPECKIT_AC_COVERAGE*` rows

### Out of Scope
- `check-ac-closure.sh` itself - it is the pattern this phase copies, not a file this phase edits
- Any packet outside `specs/system-speckit/035-spec-kit-simplification-research/006-*` through `022-*` - the retrofit is scoped to the program lane 004 measured, not a repository-wide sweep
- Raising or lowering the 0.9 floor value itself - `SPECKIT_AC_COVERAGE_FLOOR` is unchanged. This phase is about the enforce switch's rollout boundary and the gate's ability to activate, not the floor's height

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` | Modify | Add a cutoff-gated enforce path mirroring `check-ac-closure.sh`'s pattern |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` (`_ac_lifecycle_active`, lines 69-99) | Modify (same file) | Close the Status-detection gap so the gate activates for a completed packet whose signal lives in `acceptance-criteria.md` |
| `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:166-170` | Modify | Document the new cutoff variable next to the existing `SPECKIT_AC_COVERAGE*` rows |
| `specs/system-speckit/035-spec-kit-simplification-research/006-retrieval-drift-remediation/acceptance-criteria.md` through `.../022-doctor-signal-truth-and-conventions-precision/acceptance-criteria.md` (15 files. 010 already meets the floor, 008 has no such file) | Modify | Add `file:line` citations, or a documented alternative, to reach the 90 percent floor per packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-ac-coverage.sh` gains a cutoff date (`SPECKIT_AC_COVERAGE_CUTOFF`, defaulting to the same `2026-08-30` boundary `check-ac-closure.sh` already uses) so a packet created after the cutoff and under the floor fails, while a packet created on or before it stays advisory, exactly mirroring `_acc_cutoff_date()` / `_acc_created_date()` |
| REQ-002 | `_ac_lifecycle_active()` is extended to also recognize a completion signal in `acceptance-criteria.md`'s own metadata (its `**Status:**` field) as an alternative to the `implementation-summary.md` Status row it currently requires exclusively, since the measured program carries the former and none of the latter |
| REQ-003 | Children 006 through 022's `acceptance-criteria.md` files carry enough `file:line`-cited or otherwise honestly-resolved rows to move the program's measured coverage from 21 of 77 (27 percent) to at least 70 of 77 (91 percent), clearing the floor |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `runtime/ENV-REFERENCE.md` documents `SPECKIT_AC_COVERAGE_CUTOFF` in the same table and style as the existing `SPECKIT_AC_COVERAGE*` and `SPECKIT_AC_CLOSURE*` rows |
| REQ-005 | Running `validate.sh <folder> --strict` with `SPECKIT_AC_COVERAGE_ENFORCE=true` set passes for each of children 006 through 022 individually, with the coverage gate observed to have actually activated (not silently skipped) for every one |
| REQ-006 | The gap between `_ac_analyze_canonical()`'s all-or-nothing `file:line` requirement and `_ac_analyze_traceability()`'s existing Manual-infeasible exemption is resolved by an explicit decision (either port the exemption, or accept that every canonical-schema Met row must carry a real citation), recorded rather than left as a silent inconsistency between the two coverage-counting paths |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` with `SPECKIT_AC_COVERAGE_ENFORCE=true` set passes for each of children 006 through 022 individually, and the run's output shows the coverage rule actually evaluated (not the "gate not active for this level or lifecycle state" message this program currently produces for all 16)
- **SC-002**: A direct re-measurement of the 16 packets' `acceptance-criteria.md` files (the same method used to find 21 of 77 today) reports at least 70 of 77 rows covered
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `_ac_analyze_canonical()` (the acceptance-criteria.md schema every 006-022 packet uses) has no Manual-infeasible exemption, unlike `_ac_analyze_traceability()` (the legacy tasks.md schema) | Some Met rows are genuinely verified by aggregate command output (a test run's pass count) rather than a single line, and forcing a `file:line` onto them risks a citation that names a file without actually proving the claim | REQ-006 makes this an explicit decision rather than a silent workaround. The retrofit task (T0xx in tasks.md) resolves each row honestly, citing the real assertion line where one exists |
| Risk | Retrofitting 56 rows across 15 files is real authoring work, not a config flip | Under-scoping this as "just turn on the switch" would leave REQ-003 unmet even after REQ-001 and REQ-002 land | The plan sequences the retrofit as its own phase with a per-packet task, not a single blanket task |
| Dependency | `check-ac-closure.sh`'s existing cutoff pattern (`_acc_cutoff_date`, `_acc_created_date`) | If that pattern changes shape before this phase lands, the mirrored implementation needs re-anchoring | REQ-001 copies the pattern's structure, which is small and stable (roughly 25 lines), minimizing drift risk |
| Dependency | The 16 packets' `Created` dates in `spec.md` (all 2026-09-06 or 2026-09-07) sitting after the proposed cutoff default | If a future session backdates or edits one of those dates, it could fall out of enforcement scope unexpectedly | Not mitigated further in this phase. Noted as a known property of date-based cutoffs, matching `check-ac-closure.sh`'s own accepted trade-off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The lifecycle-activation fallback read (checking `acceptance-criteria.md`'s metadata when `implementation-summary.md` carries no Status row) costs one additional small file read per packet, negligible against `validate.sh`'s existing per-packet cost
- **NFR-P02**: No change to `check-ac-coverage.sh`'s existing single-pass `_ac_analyze_canonical()` parse. The citation retrofit is a content change, not an algorithmic one

### Security
- **NFR-S01**: No credential, token or path-traversal surface is introduced. Every citation added is a repo-relative `file:line` reference to an existing file
- **NFR-S02**: The cutoff and lifecycle-activation changes touch only validation logic, never write to a spec-folder document at validation time

### Reliability
- **NFR-R01**: An unrecognized `SPECKIT_AC_COVERAGE_CUTOFF` value falls back to the default and reports a note, mirroring `_acc_cutoff_date()`'s existing malformed-value handling, rather than silently miscomparing dates as strings
- **NFR-R02**: The lifecycle-activation fallback fails closed (gate stays inactive) if neither `implementation-summary.md` nor `acceptance-criteria.md` carries a recognizable completion signal, never assuming activity by default
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A packet with `acceptance-criteria.md` present but no `**Status:**` line at all: the lifecycle check stays inactive for it, same as today, rather than guessing a completion state
- A criterion whose Verification cell already contains something that looks like a `file:line` but is not one (for example a version number or a port) - `check-ac-coverage.sh`'s existing `has_file_line()` regex is unchanged by this phase and is not re-validated here, since lane 004 round two (`f-iter004-004`) already hardened it to require a path-like token before the colon
- A packet whose `Created` date in `spec.md` is missing or malformed: `_acc_created_date()`'s existing behavior (treat as pre-cutoff, advisory) is inherited unchanged by the new coverage cutoff, per REQ-001's mirroring of the closure pattern

### Error Scenarios
- A retrofit citation names a `file:line` that does not exist (a typo or a stale line number after the cited file changes): not caught mechanically by this phase's scope, since `check-ac-coverage.sh`'s regex only validates shape, not existence. Flagged as a manual-review responsibility for whoever retrofits each packet
- The enforce switch is turned on globally before the lifecycle-activation gap (REQ-002) lands: every packet in the repository whose `implementation-summary.md` lacks a Status row (not just this program's 16) would stay silently unenforced, which is the status quo, not a regression - REQ-002 only adds a new path to activation, it never removes the existing one

### State Transitions
- Nothing in this phase depends on session or runtime state. The cutoff and lifecycle checks are pure functions of committed file content at validation time
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Two functions in one shell script, one reference doc row and content retrofit across 15 files |
| Risk | 12/25 | The main risk is the Manual-infeasible asymmetry (REQ-006) requiring a real design decision rather than a mechanical fix |
| Research | 6/20 | The cutoff pattern to mirror and the exact activation gap are already fully characterized in this spec's problem statement |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should REQ-006's Manual-infeasible exemption, if ported, use the same three-word class marker `_ac_analyze_traceability()` uses, or a simpler single `Status` value? The canonical schema's `Status` column already carries `Met/Unmet/Waived/Superseded`. Adding a fifth value changes the closure semantics in `check-ac-closure.sh` too and needs that rule's owner to weigh in before implementation.
- Is `2026-08-30` (reused from `check-ac-closure.sh`) the right default for `SPECKIT_AC_COVERAGE_CUTOFF`, or should the two cutoffs diverge now that the coverage gate's rollout is a separate decision from the closure gate's? Reusing the value keeps the two rollouts synchronized and is this spec's working assumption, but the operator may prefer a later date for coverage specifically.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
