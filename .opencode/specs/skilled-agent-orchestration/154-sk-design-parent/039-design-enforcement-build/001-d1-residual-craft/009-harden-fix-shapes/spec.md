---
title: "Feature Specification: Recommended Fix-Shape Column for the Hardening Matrix"
description: "The hardening matrix proved each edge case but named a fix shape only in one section, so audits flagged gaps without a consistent remedy direction. This adds a 'Fix shape to recommend' column to every probe table, one remedy shape + owner per row, additive and recommend-only."
trigger_phrases:
  - "d1-r9 harden fix shapes"
  - "harden fix shapes design build"
  - "hardening matrix recommended fix owner"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/009-harden-fix-shapes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record matrix-shape-greppable vs remedy-correctness split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase ships content only: the spec names no validator, so the column shape is grep-checkable but no checker is bundled"
      - "Residual was the systematic fix shape, not the matrix itself, which already proved each gap and named an owner"
---
# Feature Specification: Recommended Fix-Shape Column for the Hardening Matrix

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `009-harden-fix-shapes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hardening matrix in `hardening_edge_cases.md` proved each edge case three ways: a probe to run, the symptom an unhardened surface shows, and the finding to file when the symptom appears. It routed an owner in the routing summary, but the recommended fix shape was systematic only in the Overlays section, and there it lived as a prose line. An auditor reading any other table got a confirmed gap with no consistent remedy direction, and nothing stated whether a fix-shape recommendation could be checked.

### Purpose
Make the recommended fix shape a per-row, deterministic field across every probe table. Add a `Fix shape to recommend` column so each edge case names the shape of its remedy and the owner who carries it, written as a remedy pattern rather than implementation code. The audit still only recommends a shape and routes an owner; the correctness of the fix stays `sk-code` work after the user accepts it. The matrix states honestly that the column shape is checkable while whether the remedy is right stays advisory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `Fix shape to recommend` column added to every probe table in `hardening_edge_cases.md`: the eight original tables (Extreme Inputs, API and Network Errors, Permissions and Rate Limits, Concurrency, Internationalization and RTL, Text Expansion, CJK and Emoji, Overlays and Top Layer) plus the §8B Device and Constrained Context table.
- One recommended fix shape plus one owner per probe row across all 35 rows, the owner drawn only from the file's routing set (`foundations`, `interface`, `sk-code`) or the a11y and evidence routes the file already names.
- The Overlays section's existing prose `Fix shape:` line folded into the column for its row with no content loss.
- A reinforcement in the routing summary that the new column is a recommendation, not a checker or proof the remedy is correct.

### Out of Scope
- A deterministic matrix checker: the spec target is the reference doc alone and names no validator, so the column shape is grep-checkable but no gate ships this phase.
- Any new owner vocabulary beyond the file's existing routing set and named routes.
- Any change to the probes, symptoms, findings, section ordering, severity model, or any sibling reference file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-audit/references/hardening_edge_cases.md` | Modify | Every probe table gains a `Fix shape to recommend` column with one remedy shape + owner per row; the Overlays prose fix line folds into the column; the routing summary reinforces the recommend-only boundary. One additive edit, no probe/symptom/finding row removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every probe table carries a `Fix shape to recommend` column | A grep returns one column header per probe table across all nine tables |
| REQ-002 | Every probe row names a non-empty recommended fix shape and one owner (deterministic shape) | All 35 rows carry a filled fix-shape cell; a row missing the cell or the owner fails the check |
| REQ-003 | Additive and lossless: no probe/symptom/finding row removed, section ordering preserved | The diff reformats every row to gain the column with zero rows lost; symptoms and findings survive verbatim; the §8A to §8B to §9 ordering is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every owner is drawn only from the file's routing set or the named a11y and evidence routes | Owner tokens are `foundations`, `interface`, or `sk-code`; rows with an accessibility or evidence half cite `assets/a11y_quick_fixes.md` or `accessibility_performance.md` |
| REQ-005 | Recommend-only boundary intact and reinforced; evergreen and scope clean | No row carries implementation code; the routing summary states the column is advisory; no spec/packet/phase IDs or `specs/` paths in the new content; only the one file is in the change set |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `Fix shape to recommend` column is present on all nine probe tables, every one of the 35 probe rows carries a non-empty fix shape, and every owner is in the allowed set (9 `foundations`, 9 `interface`, 17 `sk-code`).
- **SC-002**: The edit is additive and lossless (35 rows reformatted, 0 rows lost, symptoms and findings verbatim), the Overlays prose fix line is folded into the column, the section ordering is intact, and the routing summary names the column as advisory.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The matrix shape is deterministic and grep-checkable, but whether a recommended fix shape is the right remedy is not | Med | State the split in the routing summary: the column shape is checkable, remedy correctness stays `sk-code` plus human or rendered review; the column carries no certification that the fix is correct |
| Risk | A fix shape could cross into implementation code and break the audit/implement boundary | Med | Write each fix shape as a remedy pattern plus owner, never step-by-step code; the audit recommends and routes, `sk-code` implements |
| Risk | Folding the Overlays prose line or adding a column could drop or reword a probe, symptom, or finding | Med | Reformat additively, row by row; verify 35 rows in, 35 rows out, symptoms and findings verbatim, ordering unchanged |
| Dependency | `hardening_edge_cases.md` routing summary and findings schema (owner vocabulary) | Internal | Owners drawn only from the file's named set; no parallel vocabulary invented |
| Dependency | Accessibility quick-fixes and performance assets already linked from the file | Internal | A11y and evidence halves route to `assets/a11y_quick_fixes.md` and `accessibility_performance.md` as the file already names them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The column is a per-row field with a fixed owner vocabulary, so each new probe row inherits the same recommend-and-route shape without a doc rewrite.

### Reliability
- **NFR-R01**: The column shape is deterministic: a grep for the column header per table and for an owner token per row returns the same answer on every run.

### Integrity
- **NFR-I01**: The matrix asserts no remedy correctness; the routing summary scopes the column as advisory so the doc carries no false trust signal that the recommended fix is verified right.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A row whose fix-shape cell is present but whose remedy is debatable still satisfies the shape check; remedy correctness stays an audit and `sk-code` judgment.
- A row whose owner falls outside the file's routing set is a vocabulary failure even if the cell is non-empty.

### Error Scenarios
- A probe row missing the fix-shape cell or the owner fails the deterministic shape check.
- Any dropped or reworded probe, symptom, or finding is a no-regression failure, not a column-shape failure.

### State Transitions
- The three layers stay distinct: the probe proves the gap, the finding records it, and the fix-shape column recommends a remedy direction and routes an owner; `sk-code` implements the accepted fix.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One additive column across nine probe tables in one reference doc, 35 rows |
| Risk | 5/25 | Additive only, reversible by reverting one file, no probe/symptom/finding content changed |
| Research | 5/20 | Re-reading the probe tables, the routing summary owner vocabulary, and the named a11y and evidence routes |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a deterministic matrix checker eventually ship for the column? Today the column shape is grep-checkable (header per table, owner token per row) but no gate is bundled, because the spec target is the reference doc alone and names no validator. A small lint enforcing column presence and owner vocabulary is the natural enforcement upgrade and is recorded here so a later phase can pick it up deliberately rather than as silent scope drift. It would still not certify remedy correctness, which stays advisory.
- Where does the matrix-shape-vs-remedy-correctness split land? The matrix shape (column present on every table, every row filled, owner in the named set) is grep-verifiable. Whether a recommended fix shape is the right remedy for a given surface stays `sk-code` plus human or rendered review. The column gives each probe a remediation direction and an owner; it does not certify the fix is correct.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
