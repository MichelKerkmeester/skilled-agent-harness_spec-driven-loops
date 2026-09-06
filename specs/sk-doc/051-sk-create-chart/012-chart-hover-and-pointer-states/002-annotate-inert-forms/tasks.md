---
title: "Tasks: Annotate the six inert forms"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Annotate the six inert forms

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 1 (`001-register-and-contract`) has landed: `check-corpus.cjs` recognizes `data-chart-inert`, and `references/template-contract.md`'s contract table names all six forms' reasons (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`)
- [x] T002 Run `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED` before annotating (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`)
- [x] T003 [P] `cp` each of the six target files aside to a scratch location before editing (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/progress-single.html`, `unit-ring.html`, `unit-grid.html`, `independent-percentages.html`, `bar-columns.html`, `bar-rows.html`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add `data-chart-inert` with its reason to the figure wrapper at `progress-single.html:161`, matching phase 1's contract table row for this form (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/progress-single.html`)
- [x] T005 [P] Add `data-chart-inert` with its reason to the figure wrapper at `unit-ring.html:130`, matching phase 1's contract table row for this form (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/unit-ring.html`)
- [x] T006 [P] Add `data-chart-inert` with its reason to the figure wrapper at `unit-grid.html:130`, matching phase 1's contract table row for this form (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/unit-grid.html`)
- [x] T007 [P] Add `data-chart-inert` with its reason to the figure wrapper at `independent-percentages.html:124`, matching phase 1's contract table row for this form (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/independent-percentages.html`)
- [x] T008 [P] Add `data-chart-inert` with its reason to the figure wrapper at `bar-columns.html:149`, matching phase 1's contract table row for this form (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html`)
- [x] T009 [P] Add `data-chart-inert` with its reason to the figure wrapper at `bar-rows.html:142`, matching phase 1's contract table row for this form (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `grep -c data-chart-inert assets/templates/*.html` and confirm a non-zero count for exactly the six files above and zero for the other fifteen (`.opencode/skills/sk-doc/sk-create-chart/assets/templates`)
- [x] T011 Read each of the six attribute values against phase 1's contract table row for that form, confirming no reason was swapped or truncated (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`)
- [x] T012 Run `node scripts/check-corpus.cjs`, confirm `RESULT: PASSED`, and confirm the `interaction-hygiene` line in the run summary reports zero failures for all six files, which proves the new attribute did not join `INTERACTION_REGISTERS` (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001–T012; the verification checklist retains one open, documented item, CHK-020)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (verified: no lint tooling exists in the skill — checked for eslint/stylelint/prettier/biome configs and found none; the corpus check is the format gate here and passes: 28 rule families, 0 failures)
- [x] CHK-011 [P0] No console errors or warnings (verified: all six annotated files opened in headless Chrome with `--enable-logging=stderr`; zero CONSOLE lines in every capture)
- [x] CHK-012 [P1] Error handling implemented (verified: the diff adds attributes and no code, so no error path was introduced; the attribute's own error case was exercised through the checker's negative control)
- [x] CHK-013 [P1] Code follows project patterns (verified: attribute sits on the figure wrapper at the documented location; each value byte-matches its contract-table row)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — left open: acceptance-criteria.md still carries its unfilled scaffold AC-001 row; meeting it in that document is packet closure work outside this phase's edit scope (six templates plus this tasks.md)
- [x] CHK-021 [P0] Manual testing complete (verified: corpus check before and after the edit, the structural grep count, a byte-exact comparison of every value against its contract-table row, and the empty-value negative control)
- [x] CHK-022 [P1] Edge cases tested (verified: no reason contains a double quote; none of the six files carries a tooltip, legend or dim register — both confirmed by grep and byte-diff)
- [x] CHK-023 [P1] Error scenarios validated (verified: an empty-reason negative control made the checker fail with its exact empty-value error; the file was then restored byte-identical)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable: this phase annotates six already-correct forms rather than fixing a bug. Retained for the packet's own record.

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — verified not applicable: this phase fixes no bug, so no findings exist to classify
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (verified: all 21 templates grepped — the attribute appears in exactly the six named files)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (verified: the attribute's sole consumer is the interaction-hygiene check in check-corpus.cjs, which was read and exercised)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — verified not applicable: no security, path, parser or redaction fix exists in an attribute-only change
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — verified not applicable: a one-attribute change has no test matrix of variants
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — verified not applicable: the change reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — verified not applicable: no fix commit exists to pin; gate outputs are recorded in the Verification Summary
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (verified: the diff adds six prose reason strings and nothing else)
- [x] CHK-031 [P0] Input validation implemented — verified not applicable to the six templates: no input surface was added; validation of the attribute belongs to the checker, which was exercised
- [x] CHK-032 [P1] Auth/authz working correctly — verified not applicable: static chart templates carry no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (verified: all three agree on files, line locations and reason text; the packet's status fields stay for closure)
- [x] CHK-041 [P1] Code comments adequate (verified: no comments were added; none are needed for a self-describing attribute)
- [x] CHK-042 [P2] README updated (if applicable) — verified not applicable: the attribute is documented in the contract table, a phase-1 file; scripts/README.md is likewise phase 1's and already updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (verified: temp artifacts lived in /tmp outside the repository and were deleted after use)
- [x] CHK-051 [P1] scratch/ cleaned before completion (verified: this session's temp directory removed; the packet's scratch/ holds pre-existing research artifacts, untouched)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05. Phase gates ran and passed: baseline corpus check, six edits, post-edit corpus check with render, empty-value negative control, byte-exact contract comparison, console capture. The single open P0 item is closure-scoped: CHK-020 awaits acceptance-criteria.md's scaffold AC-001 row, which is packet-closure work outside this phase's edit scope (six templates plus this tasks.md).
<!-- /ANCHOR:summary -->

---
