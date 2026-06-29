---
title: "Feature Specification: Baseline Rhythm Token"
description: "The line-height-to-spacing relation is required nowhere, so vertical rhythm drifts. This adds a baseline rhythm token row, a responsive cross-link, and a validator that fails non-baseline spacing."
trigger_phrases:
  - "d1-r7 baseline rhythm"
  - "baseline rhythm token design build"
  - "baseline_rhythm_check spacing validator"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/007-baseline-rhythm-token"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2; recorded rhythm-executable split and numeric-law scope amendment"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Baseline anchor resolved to the existing 4px base, so the current scale validates with no value changed"
      - "Numeric-law spacing-scale enforcement drift folded into this phase by approved scope amendment"
---
# Feature Specification: Baseline Rhythm Token

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `007-baseline-rhythm-token` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The line-height-to-spacing relationship is stated as a requirement nowhere, so vertical rhythm is incidental: a spacing scale can say "use the scale" while a one-off value slips through and nothing notices. The §4 spacing scale already uses a 4-point base, but nothing names that base as a baseline the whole system must resolve to, and no checker rejects a value that does not.

### Purpose
Make the relation explicit and executable: name the rhythm base in the token starter, link it from the responsive layout reference, and add a deterministic validator that fails any spacing value that is neither a baseline multiple/fraction nor a marked exception.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--baseline` rhythm row plus the resolve-to-baseline-or-exception rule in `token_starter.md` §4 Spacing Scale (additive, no listed value changed).
- A cross-link from `layout_responsive.md` §2 Spacing System to the baseline rhythm row.
- A new stdlib validator `design-foundations/scripts/baseline_rhythm_check.py`, scoped to the §4 block, mirroring `contrast_check.py`.

### Out of Scope
- Hard-checking the §3 type table's line-height column, which ships as fill-in blanks and stays advisory.
- Re-tuning any spacing value; the baseline is the existing 4px base, so the scale is unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-foundations/assets/token_starter.md` | Modify | §4 gains the `--baseline` row and the resolve-to-baseline rule |
| `sk-design/design-foundations/references/layout/layout_responsive.md` | Modify | §2 gains one cross-link to the baseline rhythm row |
| `sk-design/design-foundations/scripts/baseline_rhythm_check.py` | Create | Stdlib validator for the §4 spacing scale |
| `sk-design/shared/numeric_design_laws.md` | Modify | Scope amendment: spacing-scale row cites the new checker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | §4 carries a `--baseline` rhythm row and a rule that every spacing token and the body line-height resolves to a baseline multiple/fraction, or a labeled exception, with no listed value changed | The row and rule render; the spacing values are byte-identical to before |
| REQ-002 | `baseline_rhythm_check.py` fails a spacing value that is neither a baseline multiple/fraction nor a marked exception, scoped to the §4 block | A planted in-block non-baseline value yields a non-zero exit naming the offending token; the live scale exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The doc's `exception` marker and the validator's marker are the same literal token; `clamp()`/fluid and missing-baseline cases return defined verdicts | A marked row passes for the reason the doc states; fluid viewport terms are exempt; presence guards fire by name |
| REQ-004 | Additive and evergreen; numeric consistency with `numeric_design_laws.md` confirmed and the enforcement-status drift reconciled | No existing value/rule/section removed; no IDs or `specs/` paths embedded; the spacing-scale row now cites the checker and the law-index gate stays green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `baseline_rhythm_check.py token_starter.md` exits 0 on the live scale, exits 1 on a planted in-block non-baseline value naming the token, and exits 2 on a usage error.
- **SC-002**: The baseline base and validated values do not contradict the `spacing-scale` or `type-*` rows in `numeric_design_laws.md`, and the spacing-scale row's stale `advisory (no script)` label is reconciled to cite the new checker without breaking `numeric_law_check.py`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rhythm is now executable for spacing but not for the §3 type line-height column (fill-in blanks) | Med | State in the docstring and rule that line-height is governed by the rule but not hard-validated while the type table ships as blanks |
| Risk | The validator could misfire outside the spacing contract | Med | Scope the checker to the §4 Spacing Scale block so it bites on spacing and nothing else |
| Risk | The numeric-law spacing row was `advisory (no script)`, now superseded by a real checker | Med | Approved scope amendment reconciles that one row to cite `baseline_rhythm_check.py`; the row keeps all six columns so the completeness gate stays green |
| Dependency | `token_starter.md` §4 (row host + validator input), `layout_responsive.md` §2 (link host) | Internal | Use evergreen section anchors, confirm the relative link resolves on disk |
| Dependency | `contrast_check.py` (validator convention), `numeric_design_laws.md` (reconciliation) | Internal | Mirror the stdlib/exit/`--json` pattern; diff the baseline against the spacing/type rows |
| Dependency | Python 3 stdlib (`re`) | External | Stdlib only, no external dependency |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The validator runs in well under a second on a single token file (one file read, linear scan of the §4 block).

### Security
- **NFR-S01**: The validator reads only the target file text and no process-wide state; no network or shell-out.

### Reliability
- **NFR-R01**: The validator is deterministic: identical input yields identical exit code and output across runs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `clamp()`/fluid value: passes when its fixed-px anchors are baseline multiples; `vw`/`vh`/`%` terms are exempt.
- Half-step fraction: a `2px` value passes as a ½ fraction of the 4px baseline.
- Marked exception: a row carrying the literal `exception` marker passes regardless of its value.

### Error Scenarios
- Missing `--baseline` row: exits non-zero (`baseline token missing`).
- No spacing rows: exits non-zero (`spacing rows missing`).
- Unreadable path or missing argument: usage/read error at exit 2.

### State Transitions
- A single in-block non-baseline unmarked value fails the whole check, so one-off spacing cannot pass silently.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two additive doc edits, one new stdlib checker, one reconciled law row |
| Risk | 6/25 | Additive only, baseline anchored to the existing base, reversible by deletion |
| Research | 6/20 | Locating the §4 base, confirming the link path, diffing the numeric-law rows |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the §3 type line-height column eventually gain a hard checker too? Today the spacing scale is executable but the type relation stays advisory until a system is filled in; the rule makes that gap explicit rather than papering over it.
- The numeric-law spacing-scale row reconciliation was folded into this phase by an approved scope amendment, not deferred to the law-index owner. Future enforcement-status changes on other advisory rows should follow the same "name it, then reconcile or schedule" path rather than silent drift.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
