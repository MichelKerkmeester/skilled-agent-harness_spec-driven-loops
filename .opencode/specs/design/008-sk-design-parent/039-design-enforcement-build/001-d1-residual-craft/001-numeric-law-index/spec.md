---
title: "Feature Specification: Numeric Design Laws Index"
description: "Cross-mode numeric design laws are restated per mode with no canonical home, so drift and duplication stay invisible. This adds one shared index plus a completeness gate."
trigger_phrases:
  - "d1-r1 numeric laws"
  - "numeric law index design build"
  - "cross-mode numeric laws shared index"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/001-numeric-law-index"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2 and recorded completeness-vs-value-advisory honesty split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone shared reference vs on-demand asset card resolved to a standalone shared reference"
---
# Feature Specification: Numeric Design Laws Index

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
| **Branch** | `001-numeric-law-index` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared base is only conceptual today. Numeric design laws (contrast ratios, motion timing bands, spacing steps, type-scale ratios, neutral chroma) are restated across mode docs with no central registry, so drift and duplication are invisible and no single row tells you a law's value, its owner, or whether anything enforces it.

### Purpose
Give every recurring cross-mode numeric law one canonical row in a shared index, plus a deterministic gate that fails when any row is under-populated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new shared reference `sk-design/shared/numeric_design_laws.md` indexing cross-mode numeric laws.
- A six-column row contract: `law_id, value/range, owner mode, enforcement target, source, caveat`.
- A new stdlib gate `sk-design/shared/scripts/numeric_law_check.py` that fails on any incomplete row.

### Out of Scope
- Duplicate detection that flags re-copying owned laws into mode-local docs - a separate sibling phase.
- Value enforcement for advisory rows - only contrast has a real calculator today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/shared/numeric_design_laws.md` | Create | Six-column index of 12 cross-mode numeric laws |
| `sk-design/shared/scripts/numeric_law_check.py` | Create | Stdlib completeness gate for the law table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The index renders one table with the fixed columns `law_id, value/range, owner mode, enforcement target, source, caveat` and every seeded row populated | `numeric_law_check.py` exits 0 on the populated index; a blanked cell exits non-zero naming the law_id + column |
| REQ-002 | Each indexed value is consistent with its cited owner source | Row-by-row diff against the owner docs finds every value present and unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Enforcement honesty: only contrast cites a real script; every other row reads `advisory (no script)` | The enforcement-target column never implies automated enforcement that does not exist |
| REQ-004 | Additive and evergreen | Only the two new files are added; neither file embeds spec, packet, or phase identifiers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The populated index passes the completeness gate (exit 0, 12 rows), and an under-populated row fails deterministically (exit 1) naming the offending law_id + column.
- **SC-002**: Every numeric value in the index traces unchanged to its cited owner doc, and the register-vs-motion difference is recorded as a caveat rather than a contradiction.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The index is completeness-checkable but most values are value-advisory; only contrast has a calculator (`contrast_check.py`) | Med | Label every non-contrast row `advisory (no script)` so the absence of enforcement is visible, not implied |
| Risk | A reader mistakes the index for a second source of truth | Med | The Source column points at the owner doc per row; the index copies no logic out of owners |
| Dependency | `motion_strategy.md`, `token_starter.md`, `contrast_pair_inventory.md`, `oklch_workflow.md`, `register.md` (owner values) | Index rows lose their canonical source if these move | Use evergreen path + section sources, never line numbers |
| Dependency | Python 3 stdlib (`re`) | No completeness gate possible without it | Stdlib only, no external dependency |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate runs in well under a second on a single index file (one file read, linear table scan).

### Security
- **NFR-S01**: The gate reads only the target file text and no process-wide state; no network or shell-out.

### Reliability
- **NFR-R01**: The gate is deterministic: identical input yields identical exit code and output across runs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a table with no data rows exits non-zero (`numeric-law rows missing`).
- Placeholder cell: `__________`, `TBD`, `TODO`, or `-` counts as incomplete and fails.
- Ragged row: a row with the wrong column count is reported as a structural error.

### Error Scenarios
- Unreadable target path: usage/read error at exit 2.
- Missing argument: usage error at exit 2.

### State Transitions
- Partial completion: any single blank cell fails the whole index, so a half-filled row cannot pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two new files, ~12 index rows, one stdlib checker |
| Risk | 6/25 | Additive only, no existing craft doc touched, reversible by deletion |
| Research | 6/20 | Locating and diffing live owner values across foundations, motion, interface |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should advisory rows eventually gain real calculators (spacing, type, motion)? Today only contrast is script-enforced; the index makes that gap explicit rather than papering over it.
- Will a future sibling consume `law_id` values directly (audit findings, duplicate detection)? If so, the slugs become a stable contract and should be versioned deliberately.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
