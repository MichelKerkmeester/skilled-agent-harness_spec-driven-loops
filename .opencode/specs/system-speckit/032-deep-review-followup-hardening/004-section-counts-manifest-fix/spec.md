---
title: "Feature Specification: Section-Counts Manifest Fix"
description: "Fix SECTION_COUNTS deriving spec.md's expected section count from the cross-doc sectionGates total instead of the spec template's own per-doc contract."
trigger_phrases:
  - "section counts fix"
  - "section counts false warning"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-deep-review-followup-hardening/004-section-counts-manifest-fix"
    last_updated_at: "2026-07-02T17:59:45Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented and verified the section-count derivation fix"
    next_safe_action: "No follow-up required; packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-004-section-counts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Section-Counts Manifest Fix

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

`SECTION_COUNTS` warns on virtually every honest spec in the repo ("spec.md has 7 sections, expected at least 25 for Level 1"; "expected at least 59 for Level 3") because it derives spec.md's minimum from the level-contract's `sectionGates` map — which enumerates gates across ALL document types — and compares that cross-doc total against spec.md alone. The plan.md expectation right next to it already does it correctly, using the per-doc template contract. This child makes spec.md use the same per-doc derivation, so the warning fires only when a spec genuinely falls below its own template's section count. The hardcoded requirements/scenario minimums are policy, not bugs, and stay untouched.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Template-conforming specs at every level stop producing the false h2-count warning; a genuinely thin spec still warns; the validation fixture suite stays fully green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In `check-section-counts.sh`, `_section_expected_spec_h2` counts every `sectionGates` entry active at the declared level from `template-structure.js level-contract` output — a cross-document total (25 at Level 1, 59 at Level 3) — and the rule then warns whenever spec.md's own `##` count is below it. Since the Level 1 spec template itself has 7 sections and the Level 3 template about 14, every template-conforming spec in the repo warns falsely. The adjacent plan.md expectation calls `_section_expected_template_h2 ... plan.md`, which reads the per-doc contract and is correct. The bug has been observed repo-wide throughout packet 030's validation work and was accepted as known noise; this child removes the noise at its source.

### Purpose
Make the spec.md expectation come from the spec.md template contract for the declared level, exactly as plan.md's already does, so SECTION_COUNTS regains signal value.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `_section_expected_spec_h2`'s sectionGates counting with the per-doc template contract derivation (the same helper path plan.md uses, pointed at `spec.md`).
- A sensible fallback when the contract is unavailable (mirroring plan.md's existing `-eq 0` fallback), with a level-appropriate default.
- Fixture/regression verification through the existing bash validation test suite plus live before/after checks on known false-warning folders.

### Out of Scope
- The hardcoded `min_requirements`/`min_scenarios` policy values (design policy, not defects).
- The acceptance-scenario counting heuristic.
- Any change to warn-vs-error severity.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | Modify | Per-doc derivation for spec.md's expected h2 count |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Modify | Update stale `053-template-compliant-level2` expectations from warn to pass after the false warning was removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | False warning eliminated | A template-conforming Level 1 spec (7 sections) and Level 3 spec (template count) produce no h2-count warning |
| REQ-002 | True warning preserved | A spec genuinely below its own template's section count still warns |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Fallback safety | When the template contract cannot be resolved, the expectation falls back to a documented level-appropriate default instead of 0 or the cross-doc total |
| REQ-004 | Suite green | `test-validation-extended.sh` fully green after the change |
| REQ-005 | Stale suite expectation corrected | Any test assertion that expected the old false warning is updated to assert the corrected pass state |
| REQ-006 | Scratch cleanup | Temporary thin-spec fixtures are removed after their warning output is captured |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live before/after on packet 030's known false-warning folders (e.g. `001-reference-research`, `010-documentation-truth-audit`): warning present before, absent after, with no other output change.
- **SC-002**: Thin-spec fixture still warns.
- **SC-003**: Bash validation suite fully green.

### Acceptance Scenarios

- **Scenario 1**: **Given** a Level 1 spec has exactly its template's h2 count, **when** `SECTION_COUNTS` runs, **then** no spec h2 warning is emitted.
- **Scenario 2**: **Given** a Level 2 spec has at least its template's h2 count, **when** `SECTION_COUNTS` runs, **then** no spec h2 warning is emitted.
- **Scenario 3**: **Given** a Level 3 spec has its template's h2 count, **when** the helper contract is available, **then** the rule uses the per-doc contract count.
- **Scenario 4**: **Given** a Level 3+ spec is evaluated, **when** the helper contract is available, **then** the rule uses the Level 3+ per-doc contract count.
- **Scenario 5**: **Given** a spec is below its own template h2 count, **when** `SECTION_COUNTS` runs, **then** the rule still emits a warning.
- **Scenario 6**: **Given** the validation fixture suite runs, **when** the clean Level 2 fixture is evaluated, **then** it passes instead of depending on the removed false warning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Some folder relied on the inflated expectation to force content depth | L | None observed repo-wide; warn-severity means no gating changed |
| Dependency | `template-structure.js contract` output shape | L | Same dependency plan.md's path already has |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Consistency | spec.md and plan.md expectations derive through the same mechanism | One helper path, two doc arguments |
| NFR-002 | Performance | No additional node invocations beyond the existing per-run calls | Reuse or replace, never add |

## 8. EDGE CASES

| # | Edge Case | Expected Behavior |
|---|-----------|-------------------|
| 1 | Level string `3+` | Resolves the 3+ template contract like plan.md's path does |
| 2 | Contract helper errors | Documented fallback default; no crash, no zero-expectation free pass |
| 3 | Phase-parent folders | Unchanged behavior (parent spec shape differs; whatever gate applies today keeps applying) |
| 4 | Spec with MORE sections than template | No warning (minimum check only) |

## 9. COMPLEXITY ASSESSMENT

| Factor | Assessment | Notes |
|--------|------------|-------|
| Code | Trivial | One derivation swap + fallback |
| Verification | Small | Fixtures + live before/after |
| Blast radius | Repo-wide but warn-only | Signal improves; no gating changes |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Fixture suite encodes the old wrong expectation | Medium | Low | Update fixtures to the correct expectation with the fix, in the same change |
| Divergent behavior vs any native SECTION_COUNTS twin | Low | Medium | Verified shell-only during scoping (no native implementation exists) |

## 11. USER STORIES

- **US-001**: As a spec author following the template exactly, I stop seeing a warning telling me my complete spec is incomplete. Acceptance: REQ-001 live checks.
- **US-002**: As a reviewer, a SECTION_COUNTS warning once again means something real. Acceptance: REQ-002 thin-spec fixture.

## 12. OPEN QUESTIONS

- None. Root cause read directly from the rule source during scoping (2026-07-02).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Rule under fix**: `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` (`_section_expected_spec_h2` vs `_section_expected_template_h2`)
- **Contract source**: `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` (`contract <doc> <level>` / `level-contract <level>`)
- **Local decisions**: `decision-record.md` — **Plan**: `plan.md` — **Tasks**: `tasks.md` — **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
